
import React, { useState, useCallback, useEffect } from 'react';
import { View, SessionState } from './types';
import type { FocusList, BlockList, FocusSession, GardenPlant, CycleStat } from './types';
import { PopupView } from './views/PopupView';
import { ActiveFocusView } from './views/ActiveFocusView';
import { BreakView } from './views/BreakView';
import { OptionsView } from './views/OptionsView';
import { DashboardView } from './views/DashboardView';
import { TimerIcon, SettingsIcon, DashboardIcon } from './components/icons/NavigationIcons';
import { storage } from './utils/storage';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentView, setCurrentView] = useState<View>(View.POPUP);
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);

  const [focusLists, setFocusLists] = useState<FocusList[]>([]);
  const [blockLists, setBlockLists] = useState<BlockList[]>([]);
  const [garden, setGarden] = useState<GardenPlant[]>([]);
  const [stats, setStats] = useState<CycleStat[]>([]);

  // Load data from chrome storage on mount
  useEffect(() => {
    const loadData = async () => {
      const data = await storage.getData();
      setFocusLists(data.focusLists);
      setBlockLists(data.blockLists);
      setGarden(data.garden);
      setStats(data.stats);
      
      if (data.activeSession) {
        setActiveSession(data.activeSession);
        if (data.activeSession.state === SessionState.BREAK) {
           setCurrentView(View.BREAK);
        } else {
           setCurrentView(View.ACTIVE_FOCUS);
        }
      }
      setIsLoaded(true);
    };
    loadData();
  }, []);

  // --- Persist functions ---
  const updateGarden = async (newGarden: GardenPlant[]) => {
      setGarden(newGarden);
      await storage.saveData('garden', newGarden);
  };

  const updateStats = async (newStats: CycleStat[]) => {
      setStats(newStats);
      await storage.saveData('stats', newStats);
  };
  
  const updateFocusLists = async (lists: FocusList[]) => {
      setFocusLists(lists);
      await storage.saveData('focusLists', lists);
  };

  const updateBlockLists = async (lists: BlockList[]) => {
      setBlockLists(lists);
      await storage.saveData('blockLists', lists);
  };

  // --- Actions ---

  const startFocus = useCallback(async (list: FocusList, withPrep: boolean) => {
    const now = Date.now();
    let newSession: FocusSession;

    if (withPrep) {
      newSession = {
        list,
        state: SessionState.PREP,
        startTime: now,
        endTime: now + 60 * 1000, // 1 min prep
      };
    } else {
      newSession = {
        list,
        state: SessionState.FOCUS,
        startTime: now,
        endTime: now + list.focusMinutes * 60 * 1000,
      };
    }
    
    setActiveSession(newSession);
    await storage.setSession(newSession);
    setCurrentView(View.ACTIVE_FOCUS);
  }, []);

  const handlePrepComplete = useCallback(async () => {
    if (!activeSession) return;
    const now = Date.now();
    const newSession: FocusSession = {
      ...activeSession,
      state: SessionState.FOCUS,
      startTime: now,
      endTime: now + activeSession.list.focusMinutes * 60 * 1000,
    };
    
    setActiveSession(newSession);
    await storage.setSession(newSession);
  }, [activeSession]);
  
  const handleFocusComplete = useCallback(async () => {
    if (!activeSession) return;
    const now = Date.now();
    const newSession: FocusSession = {
        ...activeSession,
        state: SessionState.BREAK,
        startTime: now,
        endTime: now + activeSession.list.breakMinutes * 60 * 1000,
    };
    
    setActiveSession(newSession);
    await storage.setSession(newSession);

    // Add a healthy plant
    const newPlant: GardenPlant = { id: Date.now(), type: 'sapling', date: new Date().toISOString().split('T')[0], status: 'alive' };
    const updatedGarden = [...garden, newPlant];
    await updateGarden(updatedGarden);
    
    // Update stats
    const today = new Date().toISOString().split('T')[0];
    let updatedStats = [...stats];
    const existingIndex = updatedStats.findIndex(s => s.date === today);
    
    if (existingIndex >= 0) {
        updatedStats[existingIndex] = { ...updatedStats[existingIndex], completed: updatedStats[existingIndex].completed + 1 };
    } else {
        updatedStats.push({ date: today, completed: 1, interrupted: 0, emergencyAccess: {} });
    }
    await updateStats(updatedStats);

    setCurrentView(View.BREAK);
  }, [activeSession, garden, stats]);

  const handleBreakComplete = useCallback(async () => {
    setActiveSession(null);
    await storage.setSession(null);
    setCurrentView(View.POPUP);
  }, []);

  const handleExtendFocus = useCallback(async () => {
      if (!activeSession) return;
      const now = Date.now();
      const newSession: FocusSession = {
          ...activeSession,
          state: SessionState.FOCUS,
          startTime: now,
          endTime: now + 15 * 60 * 1000,
      };
      setActiveSession(newSession);
      await storage.setSession(newSession);
  }, [activeSession]);

  const handleGiveUp = useCallback(async () => {
      if (!activeSession) return;

      // Logic: If it's NOT prep time, it's a penalty.
      // We use !== PREP instead of === FOCUS to catch any edge case where state is numeric 2 vs string "FOCUS"
      // and to align with the UI logic.
      const isPrep = activeSession.state === SessionState.PREP;

      if (!isPrep) {
        // Add withered plant
        const newPlant: GardenPlant = { id: Date.now(), type: 'sapling', date: new Date().toISOString().split('T')[0], status: 'withered' };
        const updatedGarden = [...garden, newPlant];
        await updateGarden(updatedGarden);
        
        // Update stats (Interrupted)
        const today = new Date().toISOString().split('T')[0];
        let updatedStats = [...stats];
        const existingIndex = updatedStats.findIndex(s => s.date === today);
        if (existingIndex >= 0) {
             updatedStats[existingIndex] = { ...updatedStats[existingIndex], interrupted: updatedStats[existingIndex].interrupted + 1 };
        } else {
             updatedStats.push({ date: today, completed: 0, interrupted: 1, emergencyAccess: {} });
        }
        await updateStats(updatedStats);
      }

      // Crucial: Clear session and storage immediately
      setActiveSession(null);
      await storage.setSession(null);
      setCurrentView(View.POPUP);
  }, [activeSession, garden, stats]);

  if (!isLoaded) {
      return <div className="flex items-center justify-center h-full bg-slate-900 text-white">Carregando...</div>;
  }

  const renderView = () => {
    switch (currentView) {
      case View.ACTIVE_FOCUS:
        if (activeSession) {
          return <ActiveFocusView 
            session={activeSession} 
            onComplete={activeSession.state === SessionState.PREP ? handlePrepComplete : handleFocusComplete}
            onExtend={handleExtendFocus}
            onGiveUp={handleGiveUp}
          />;
        }
        return null;
      case View.BREAK:
        if (activeSession) {
            return <BreakView session={activeSession} onComplete={handleBreakComplete} />;
        }
        return null;
      case View.OPTIONS:
        return <OptionsView 
          focusLists={focusLists} 
          blockLists={blockLists}
          onSaveFocusLists={updateFocusLists}
          onSaveBlockLists={updateBlockLists}
        />;
      case View.DASHBOARD:
        return <DashboardView garden={garden} stats={stats} />;
      case View.POPUP:
      default:
        return <PopupView focusLists={focusLists} onStartFocus={startFocus} />;
    }
  };

  const NavItem: React.FC<{view: View; icon: React.ReactNode; label: string}> = ({view, icon, label}) => {
    const isActive = currentView === view;
    return (
        <button
            onClick={() => setCurrentView(view)}
            className={`flex flex-col items-center justify-center space-y-1 w-full transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </button>
    )
  }

  // Only show nav if not in an active managed state
  const showNav = currentView !== View.ACTIVE_FOCUS && currentView !== View.BREAK;

  return (
    <div className="bg-slate-900 w-full h-full flex flex-col">
      <div className="flex-grow overflow-hidden relative">
        {renderView()}
      </div>
      {showNav && (
        <nav className="flex-shrink-0 bg-slate-900 border-t border-slate-700 flex justify-around p-2 z-50">
            <NavItem view={View.POPUP} icon={<TimerIcon className="w-6 h-6"/>} label="Foco"/>
            <NavItem view={View.DASHBOARD} icon={<DashboardIcon className="w-6 h-6"/>} label="Jardim"/>
            <NavItem view={View.OPTIONS} icon={<SettingsIcon className="w-6 h-6"/>} label="Opções"/>
        </nav>
      )}
    </div>
  );
};

export default App;

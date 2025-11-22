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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.POPUP);
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);

  const [focusLists, setFocusLists] = useState<FocusList[]>([]);
  const [blockLists, setBlockLists] = useState<BlockList[]>([]);
  const [garden, setGarden] = useState<GardenPlant[]>([]);
  const [stats, setStats] = useState<CycleStat[]>([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
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
      } catch (error) {
        console.error("Critical error loading app:", error);
        setLoadError("Erro ao carregar dados.");
      }
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
      newSession = { list, state: SessionState.PREP, startTime: now, endTime: now + 60 * 1000 };
    } else {
      newSession = { list, state: SessionState.FOCUS, startTime: now, endTime: now + list.focusMinutes * 60 * 1000 };
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

    // Add plant
    const newPlant: GardenPlant = { id: Date.now(), type: 'sapling', date: new Date().toISOString().split('T')[0], status: 'alive' };
    await updateGarden([...garden, newPlant]);
    
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
      const newSession: FocusSession = { ...activeSession, state: SessionState.FOCUS, startTime: now, endTime: now + 15 * 60 * 1000 };
      setActiveSession(newSession);
      await storage.setSession(newSession);
  }, [activeSession]);

  const handleGiveUp = useCallback(async () => {
      if (!activeSession) return;
      const isPrep = activeSession.state === SessionState.PREP;
      if (!isPrep) {
        // Penalty
        const newPlant: GardenPlant = { id: Date.now(), type: 'sapling', date: new Date().toISOString().split('T')[0], status: 'withered' };
        await updateGarden([...garden, newPlant]);
        // Stats
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
      setActiveSession(null);
      await storage.setSession(null);
      setCurrentView(View.POPUP);
  }, [activeSession, garden, stats]);

  // Loading View
  if (!isLoaded || loadError) {
      return <div className="page-container justify-center items-center text-center">
          {loadError ? <p className="text-danger">{loadError}</p> : <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
      </div>;
  }

  const renderView = () => {
    switch (currentView) {
      case View.ACTIVE_FOCUS:
        if (activeSession) return <ActiveFocusView session={activeSession} onComplete={activeSession.state === SessionState.PREP ? handlePrepComplete : handleFocusComplete} onExtend={handleExtendFocus} onGiveUp={handleGiveUp} />;
        return null;
      case View.BREAK:
        if (activeSession) return <BreakView session={activeSession} onComplete={handleBreakComplete} />;
        return null;
      case View.OPTIONS:
        return <OptionsView focusLists={focusLists} blockLists={blockLists} onSaveFocusLists={updateFocusLists} onSaveBlockLists={updateBlockLists} />;
      case View.DASHBOARD:
        return <DashboardView garden={garden} stats={stats} />;
      default:
        return <PopupView focusLists={focusLists} onStartFocus={startFocus} />;
    }
  };

  const NavItem: React.FC<{view: View; icon: React.ReactNode;}> = ({view, icon}) => (
    <button onClick={() => setCurrentView(view)} className={`nav-item ${currentView === view ? 'active' : ''}`}>
        {icon}
    </button>
  );

  const showNav = currentView !== View.ACTIVE_FOCUS && currentView !== View.BREAK;

  return (
    <>
      {renderView()}
      {showNav && (
        <nav className="nav-dock">
            <NavItem view={View.POPUP} icon={<TimerIcon className="w-6 h-6"/>}/>
            <NavItem view={View.DASHBOARD} icon={<DashboardIcon className="w-6 h-6"/>}/>
            <NavItem view={View.OPTIONS} icon={<SettingsIcon className="w-6 h-6"/>}/>
        </nav>
      )}
    </>
  );
};

export default App;

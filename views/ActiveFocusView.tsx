
import React, { useEffect, useState } from 'react';
import { SessionState } from '../types'; // Import SessionState enum
import type { FocusSession } from '../types';
import { useTimer } from '../hooks/useTimer';
import { PlantIcon } from '../components/icons/PlantIcon';
import { Button } from '../components/common/Button';

interface ActiveFocusViewProps {
  session: FocusSession;
  onComplete: () => void;
  onExtend: () => void;
  onGiveUp: () => void;
}

export const ActiveFocusView: React.FC<ActiveFocusViewProps> = ({ session, onComplete, onExtend, onGiveUp }) => {
  // Timer is now driven by the session.endTime stored timestamp, not an internal start/stop
  const { timeLeftFormatted, secondsLeft } = useTimer(session.endTime);
  const [isConfirmingGiveUp, setIsConfirmingGiveUp] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete();
    }
  }, [secondsLeft, onComplete]);

  const totalSeconds = (session.endTime - session.startTime) / 1000;
  const growthPercentage = 1 - (secondsLeft / totalSeconds);
  
  const isPrep = session.state === SessionState.PREP;

  const handleGiveUpClick = () => {
    if (isPrep) {
        // No penalty in prep, just do it
        onGiveUp();
    } else {
        // In focus mode, ask for confirmation inside the UI
        setIsConfirmingGiveUp(true);
    }
  };

  return (
    <div className={`p-8 flex flex-col h-full justify-between items-center text-center transition-colors duration-500 w-full`}
        style={{backgroundColor: isPrep ? '#4f3b11' : '#0F172A'}}>
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
         <PlantIcon growth={growthPercentage} className="w-96 h-96 absolute bottom-[-50px] left-1/2 transform -translate-x-1/2 text-slate-800 opacity-30" />
      </div>
      
      <header className="z-10 w-full">
         <p className="text-2xl font-semibold" style={{color: isPrep ? '#F59E0B' : '#E2E8F0'}}>
            {isPrep ? "Prepare-se..." : session.list.name}
         </p>
         {!isPrep && <p className="text-slate-500 text-sm mt-1">Mantenha o foco para sua planta crescer</p>}
      </header>

      <main className="z-10 flex flex-col items-center justify-center flex-grow">
        <h1 className="text-7xl sm:text-8xl font-bold tracking-tighter" style={{color: isPrep ? '#F59E0B' : '#E2E8F0'}}>
          {timeLeftFormatted}
        </h1>
      </main>

      <footer className="z-10 w-full max-w-xs space-y-3 mb-4">
        {secondsLeft <= 0 ? (
             <Button onClick={onExtend} variant="secondary">Continuar (+15 min)</Button>
        ) : isConfirmingGiveUp ? (
            <div className="space-y-2 animate-fade-in">
                <p className="text-red-400 font-bold text-sm mb-2">Sua planta vai murchar. Tem certeza?</p>
                <div className="flex space-x-2">
                    <Button onClick={() => setIsConfirmingGiveUp(false)} variant="ghost" className="text-slate-300 bg-slate-800">Voltar</Button>
                    <Button onClick={onGiveUp} className="bg-red-600 hover:bg-red-700 text-white">Sim, Desistir</Button>
                </div>
            </div>
        ) : (
            <Button onClick={handleGiveUpClick} variant="ghost" className={`text-sm w-full ${isPrep ? 'text-slate-400 hover:text-white' : 'text-red-400 hover:text-red-300 hover:bg-red-900/20'}`}>
                {isPrep ? "Cancelar" : "Desistir (Matar Planta)"}
            </Button>
        )}
      </footer>
    </div>
  );
};

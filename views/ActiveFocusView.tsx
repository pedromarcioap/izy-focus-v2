import React, { useEffect, useState } from 'react';
import { SessionState } from '../types';
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
  const { timeLeftFormatted, secondsLeft } = useTimer(session.endTime);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete();
    }
  }, [secondsLeft, onComplete]);

  const totalSeconds = (session.endTime - session.startTime) / 1000;
  const growthPercentage = 1 - (secondsLeft / totalSeconds);
  const isPrep = session.state === SessionState.PREP;

  return (
    <div className="view-scroll no-nav items-center justify-center animate-in relative overflow-hidden" style={{paddingBottom: '20px'}}>
      
      {/* Background Ambient Plant - Inline styles for safety */}
      <div 
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
        style={{ 
            position: 'absolute', 
            top: 0, left: 0, right: 0, bottom: 0, 
            zIndex: 0,
            opacity: 0.2 
        }}
      >
        <div style={{ width: '100%', height: '100%', transform: 'scale(1.5)', filter: 'blur(4px)' }}>
            <PlantIcon growth={growthPercentage} className="w-full h-full opacity-30" />
        </div>
      </div>

      {/* Top Meta */}
      <div className="relative z-10 flex flex-col items-center mt-4">
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-2 ${isPrep ? 'text-warning bg-warning/10' : 'text-primary bg-primary-dim'}`}>
            {isPrep ? "Preparando" : "Modo Foco"}
        </div>
        <h2 className="text-sm text-muted font-medium">{session.list.name}</h2>
      </div>

      {/* Main Timer */}
      <div className="relative z-20 text-center my-auto">
        <h1 className="timer-huge">{timeLeftFormatted}</h1>
        
        {!isPrep && !confirmGiveUp && (
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mt-4">
             <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
             <span className="text-xs text-white tracking-wide opacity-80">Cultivando planta</span>
           </div>
        )}
      </div>

      {/* Controls Layer */}
      <div className="w-full z-20 flex flex-col gap-3 mt-auto">
        
        {secondsLeft <= 0 ? (
           <Button size="lg" onClick={onExtend} className="animate-pulse shadow-lg">
             Continuar (+15m)
           </Button>
        ) : 
        
        confirmGiveUp ? (
           <div className="card border-danger bg-black/90 flex flex-col gap-4 text-center animate-in backdrop-blur-xl">
             <div>
                <p className="text-danger font-bold text-sm uppercase tracking-wide">Cuidado</p>
                <p className="text-sm text-muted mt-1">Sua planta irá murchar se parar agora.</p>
             </div>
             <div className="flex gap-3">
               <Button size="sm" variant="ghost" onClick={() => setConfirmGiveUp(false)} className="flex-1">Voltar</Button>
               <Button size="sm" variant="danger" onClick={onGiveUp} className="flex-1">Desistir</Button>
             </div>
           </div>
        ) : 
        
        (
           <Button 
             variant="ghost"
             size="sm"
             onClick={() => isPrep ? onGiveUp() : setConfirmGiveUp(true)} 
             className="text-xs opacity-50 hover:opacity-100 border-none"
           >
             {isPrep ? "CANCELAR" : "DESISTIR"}
           </Button>
        )}
      </div>
    </div>
  );
};
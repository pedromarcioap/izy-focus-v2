import { React, useEffect, useState } from '../libs/deps.js';
import { SessionState } from '../types';
import type { FocusSession, UserSettings } from '../types';
import { useTimer } from '../hooks/useTimer';
import { PlantIcon } from '../components/icons/PlantIcon';
import { Button } from '../components/common/Button';
import { FOCUS_MUSIC_TRACKS } from '../constants';

interface ActiveFocusViewProps {
  session: FocusSession;
  settings: UserSettings;
  onComplete: () => void;
  onExtend: () => void;
  onGiveUp: () => void;
}

declare var chrome: any;

const safelySendMessage = (message: any) => {
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
    try {
      chrome.runtime.sendMessage(message);
    } catch (e) {
      console.warn("Failed to send message to extension background:", e);
    }
  } else {
    // Fallback for dev environment
    console.log("[Mock SendMessage]:", message);
  }
};

export const ActiveFocusView = ({ session, settings, onComplete, onExtend, onGiveUp }: ActiveFocusViewProps) => {
  const { timeLeftFormatted, secondsLeft } = useTimer(session.endTime);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);

  const isPrep = session.state === SessionState.PREP;
  const isFocus = session.state === SessionState.FOCUS;

  // --- Music Logic (Offscreen Delegation) ---
  useEffect(() => {
    // Only attempt to play music if we are officially in focus mode.
    if (settings.focusMusicEnabled && isFocus) {
        const track = FOCUS_MUSIC_TRACKS.find(t => t.id === settings.focusMusicTrack);
        if (track && track.url) {
            safelySendMessage({
                action: 'START_MUSIC',
                url: track.url,
                volume: settings.focusMusicVolume
            });
        }
    } else {
        // If prep or disabled, ensure it stops
        safelySendMessage({ action: 'STOP_MUSIC' });
    }
  }, [isFocus, settings.focusMusicEnabled, settings.focusMusicTrack]);

  // Volume updates
  useEffect(() => {
      if (settings.focusMusicEnabled && isFocus) {
        safelySendMessage({
            action: 'UPDATE_VOLUME',
            volume: settings.focusMusicVolume
        });
      }
  }, [settings.focusMusicVolume, isFocus, settings.focusMusicEnabled]);

  // Completion Logic
  useEffect(() => {
    if (secondsLeft <= 0) {
        onComplete();
    }
  }, [secondsLeft, onComplete]);

  const totalSeconds = (session.endTime - session.startTime) / 1000;
  const growthPercentage = 1 - (secondsLeft / totalSeconds);

  return (
    <div className="view-scroll no-nav items-center justify-center animate-in relative overflow-hidden" style={{paddingBottom: '20px'}}>
      
      {/* Background Ambient Plant */}
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
            <PlantIcon growth={growthPercentage} className="w-full h-full opacity-30" style={{width: '100%', height: '100%'}} />
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
           <div className="flex flex-col items-center gap-2 mt-4">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                 <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                 <span className="text-xs text-white tracking-wide opacity-80">Cultivando planta</span>
               </div>
               {settings.focusMusicEnabled && (
                   <span className="text-xs text-muted opacity-60">🎵 {FOCUS_MUSIC_TRACKS.find(t => t.id === settings.focusMusicTrack)?.name}</span>
               )}
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
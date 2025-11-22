
import React, { useEffect, useMemo } from 'react';
import type { FocusSession } from '../types';
import { useTimer } from '../hooks/useTimer';
import { MICRO_BREAK_SUGGESTIONS } from '../constants';
import { Button } from '../components/common/Button';

interface BreakViewProps {
  session: FocusSession;
  onComplete: () => void;
}

export const BreakView: React.FC<BreakViewProps> = ({ session, onComplete }) => {
  const { timeLeftFormatted, secondsLeft } = useTimer(session.endTime);
  const suggestion = useMemo(() => MICRO_BREAK_SUGGESTIONS[Math.floor(Math.random() * MICRO_BREAK_SUGGESTIONS.length)], []);

  useEffect(() => {
    // Sound logic remains same
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext) {
        const o = audioContext.createOscillator();
        const g = audioContext.createGain();
        o.connect(g);
        g.connect(audioContext.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(440, audioContext.currentTime);
        g.gain.setValueAtTime(0.1, audioContext.currentTime);
        g.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
        o.start();
        o.stop(audioContext.currentTime + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete();
    }
  }, [secondsLeft, onComplete]);

  return (
    <div className="page-container justify-center items-center text-center animate-in" 
         style={{ background: 'linear-gradient(to bottom, #1a1c1a, #0c2e23)' }}>
      
      <div className="mb-8">
        <span className="text-label text-emerald-300">PAUSA REGENERATIVA</span>
        <h1 className="timer-huge">{timeLeftFormatted}</h1>
      </div>

      <div className="card-glass w-full mb-8 border-l-4 border-l-emerald-500">
        <p className="text-xs text-emerald-400 font-bold mb-2 uppercase">Sugestão</p>
        <p className="text-lg italic text-white opacity-90">"{suggestion}"</p>
      </div>

      <Button variant="ghost" onClick={onComplete} className="border-primary text-emerald-300 hover:bg-dim">
        Encerrar Pausa
      </Button>
    </div>
  );
};

import React, { useEffect, useMemo } from 'react';
import type { FocusSession } from '../types';
import { useTimer } from '../hooks/useTimer';
import { Button } from '../components/common/Button';
import { MICRO_BREAK_SUGGESTIONS } from '../constants';

interface BreakViewProps {
  session: FocusSession;
  onComplete: () => void;
}

export const BreakView: React.FC<BreakViewProps> = ({ session, onComplete }) => {
  const { timeLeftFormatted, secondsLeft } = useTimer(session.endTime);
  
  const suggestion = useMemo(() => MICRO_BREAK_SUGGESTIONS[Math.floor(Math.random() * MICRO_BREAK_SUGGESTIONS.length)], []);

  useEffect(() => {
    // Play a calm notification sound
    // FIX: Cast window to `any` to allow access to the vendor-prefixed webkitAudioContext for broader browser compatibility.
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioContext) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onComplete();
    }
  }, [secondsLeft, onComplete]);

  return (
    <div className="p-8 flex flex-col h-full justify-between items-center text-center bg-[#4f3b11] text-amber-100 transition-all animate-fade-in w-full">
      <header className="z-10">
        <p className="text-2xl font-semibold text-amber-200">Hora da Pausa</p>
        <p className="text-amber-100/60 text-sm mt-1">Você completou o ciclo e ganhou uma planta!</p>
      </header>
      
      <main className="z-10 flex flex-col items-center w-full flex-grow justify-center">
        <h1 className="text-7xl sm:text-8xl font-bold text-white tracking-tighter">
          {timeLeftFormatted}
        </h1>
        <div className="mt-8 bg-black bg-opacity-30 p-4 rounded-xl border border-amber-700/30 w-full">
            <p className="text-xs text-amber-300 uppercase tracking-wider font-bold mb-2">Sugestão</p>
            <p className="text-lg text-amber-100">{suggestion}</p>
        </div>
      </main>

      <footer className="z-10 w-full max-w-xs mb-4">
        <Button onClick={onComplete} variant="secondary" className="bg-amber-600 hover:bg-amber-500 text-white border-none">
          Encerrar Pausa
        </Button>
      </footer>
    </div>
  );
};
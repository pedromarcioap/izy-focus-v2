import { useState, useEffect, useCallback } from 'react';

export const useTimer = (targetEndTime: number) => {
  const calculateTimeLeft = () => {
    const now = Date.now();
    const diff = Math.max(0, Math.round((targetEndTime - now) / 1000));
    return diff;
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateTimeLeft());
  
  useEffect(() => {
    // Immediate update
    setSecondsLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const left = calculateTimeLeft();
      setSecondsLeft(left);
      if (left <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetEndTime]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return { 
    timeLeftFormatted: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    secondsLeft,
    // In this new version, 'isRunning' is implied by secondsLeft > 0 and the existence of a session
    isRunning: secondsLeft > 0, 
    // Start/Pause/Reset are handled by the App logic updating the 'targetEndTime' in storage, 
    // so we don't export them here to avoid conflicting truth sources.
  };
};
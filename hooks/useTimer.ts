import { useState, useEffect } from '../libs/deps.js';

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
    isRunning: secondsLeft > 0, 
  };
};

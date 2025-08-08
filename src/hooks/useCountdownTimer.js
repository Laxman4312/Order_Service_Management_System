import { useState, useEffect } from 'react';

const useCountdownTimer = (initialMinutes, timerKey = 'default') => {
  // Calculate remaining time based on token creation time
  const calculateRemainingTime = () => {
    const tokenCreationTime = localStorage.getItem(`${timerKey}_creation_time`);
    if (!tokenCreationTime) return initialMinutes * 60;

    const elapsedTime = Math.floor((Date.now() - parseInt(tokenCreationTime)) / 1000);
    const totalTime = initialMinutes * 60;
    return Math.max(0, totalTime - elapsedTime);
  };

  const [timeLeft, setTimeLeft] = useState(calculateRemainingTime());
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = Math.max(0, calculateRemainingTime());
          if (newTime === 0) {
            clearInterval(intervalId);
            setIsRunning(false);
            localStorage.removeItem(`${timerKey}_creation_time`);
          }
          return newTime;
        });
      }, 1000);

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [isRunning, timerKey]);

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const remainingTime = calculateRemainingTime();
        setTimeLeft(remainingTime);
        if (remainingTime > 0) {
          setIsRunning(true);
        }
      }
    };

    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    // Only set creation time if it doesn't exist
    if (!localStorage.getItem(`${timerKey}_creation_time`)) {
      localStorage.setItem(`${timerKey}_creation_time`, Date.now().toString());
    }
    setTimeLeft(calculateRemainingTime());
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const clearTimer = () => {
    localStorage.removeItem(`${timerKey}_creation_time`);
    setIsRunning(false);
    setTimeLeft(0);
  };

  return {
    timeLeft,
    isRunning,
    formattedTime: formatTime(timeLeft),
    startTimer,
    stopTimer,
    clearTimer,
  };
};

export default useCountdownTimer;

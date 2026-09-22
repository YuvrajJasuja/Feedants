import { useState, useEffect } from 'react';

export interface CountdownResult {
  countdownText: string;
  countdownLabel: string;
  isExpired: boolean;
}

/**
 * Reusable React Hook for memory-safe real-time countdown calculation.
 * Prevents negative timers, multiple intervals, and memory leaks on unmount.
 */
export function useCountdown(
  targetDateStr?: string,
  labelPrefix: string = 'Registration closes in'
): CountdownResult {
  const [countdownText, setCountdownText] = useState<string>('00d : 00h : 00m : 00s');
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    if (!targetDateStr) {
      setCountdownText('Ended');
      setIsExpired(true);
      return;
    }

    const targetTime = new Date(targetDateStr).getTime();
    if (isNaN(targetTime)) {
      setCountdownText('Ended');
      setIsExpired(true);
      return;
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setCountdownText('00d : 00h : 00m : 00s');
        setIsExpired(true);
        return;
      }

      setIsExpired(false);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
      setCountdownText(`${pad(days)}d : ${pad(hours)}h : ${pad(minutes)}m : ${pad(seconds)}s`);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [targetDateStr]);

  return {
    countdownText,
    countdownLabel: labelPrefix,
    isExpired,
  };
}

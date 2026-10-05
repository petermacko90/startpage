import { useCallback, useEffect, useRef } from "react";

export function useTimer() {
  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((callback: () => void, delay: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      callback();
    }, delay);
  }, []);

  useEffect(() => {
    const currentTimer = timerRef.current;

    return () => {
      if (currentTimer) clearTimeout(currentTimer);
    };
  }, []);

  return { clearTimer, startTimer };
}

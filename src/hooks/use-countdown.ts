'use client';

import { useState } from 'react';

type Options = {
  onEnd?: () => void;
};

export const useCountdown = (count: number, options?: Options) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  const startCountdown = () => {
    setCountdown(count);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) {
          return null;
        }

        if (prev <= 1) {
          clearInterval(interval);
          options?.onEnd?.();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return {
    countdown,
    startCountdown,
  };
};

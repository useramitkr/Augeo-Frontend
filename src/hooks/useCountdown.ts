'use client';

import { useState, useEffect } from 'react';
import { getCountdown } from '@/lib/utils';

export function useCountdown(endTime: string | Date) {
  const [countdown, setCountdown] = useState(getCountdown(endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const result = getCountdown(endTime);
      setCountdown(result);
      if (!result) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return countdown;
}

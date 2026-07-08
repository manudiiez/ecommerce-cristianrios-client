"use client";

import { useEffect, useState } from "react";

export interface CountdownParts {
  d: number;
  h: number;
  m: number;
  s: number;
  done: boolean;
}

export function useCountdown(endsAt: number): CountdownParts {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    // primer tick diferido (no sincrónico) para no chocar con el render de
    // hidratación del servidor, luego un tick real por segundo
    const kickoff = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(kickoff);
      clearInterval(interval);
    };
  }, []);

  const diff = Math.max(0, endsAt - (now ?? endsAt));
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    done: diff <= 0,
  };
}

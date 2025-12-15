import { useEffect, useRef } from 'react';
import { useRuntimeStore } from '@/state/runtimeStore';


type Options = {
  intervalMs?: number;
  workMs?: number; // simulation
};

export function useFrameLoop({ intervalMs = 300, workMs = 25 }: Options = {}) {
  const isRunning = useRuntimeStore((s) => s.isRunning);
  const reportFrame = useRuntimeStore((s) => s.reportFrame);

  const inFlight = useRef(false);

  useEffect(() => {
    if (!isRunning) return;

    const id = setInterval(async () => {
      if (inFlight.current) {
        reportFrame(0, true); // dropped
        return;
      }

      inFlight.current = true;
      const t0 = Date.now();
      try {
        await new Promise((r) => setTimeout(r, workMs));
        const t1 = Date.now();
        reportFrame(t1 - t0, false);
      } finally {
        inFlight.current = false;
      }
    }, intervalMs);

    return () => clearInterval(id);
  }, [isRunning, intervalMs, workMs, reportFrame]);
}

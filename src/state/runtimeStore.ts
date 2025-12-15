import { create } from 'zustand';
import type { PerfMetrics } from "@/core/types/perf";

type RuntimeState = {
  isRunning: boolean;
  metrics: PerfMetrics;
  setRunning: (v: boolean) => void;
  reportFrame: (latencyMs: number, dropped?: boolean) => void;
  reset: () => void;
};

const initial: PerfMetrics = {
  fps: 0,
  avgLatencyMs: 0,
  p95LatencyMs: 0,
  framesProcessed: 0,
  droppedFrames: 0,
};

export const useRuntimeStore = create<RuntimeState>((set, get) => {
  // windowed stats
  let windowStart = Date.now();
  let latencies: number[] = [];
  let framesInWindow = 0;

  const recompute = () => {
    const now = Date.now();
    const elapsed = now - windowStart;

    // update every ~2s to keep the stats stable
    if (elapsed < 2000) return;

    latencies.sort((a, b) => a - b);
    const avg =
      latencies.length === 0 ? 0 : latencies.reduce((s, x) => s + x, 0) / latencies.length;
    const p95Index = Math.floor(latencies.length * 0.95);
    const p95 = latencies.length === 0 ? 0 : latencies[Math.min(p95Index, latencies.length - 1)];
    const fps = framesInWindow / (elapsed / 1000);

    set((s) => ({
      metrics: {
        ...s.metrics,
        fps: Number(fps.toFixed(1)),
        avgLatencyMs: Math.round(avg),
        p95LatencyMs: Math.round(p95),
      },
    }));

    // reset window
    windowStart = now;
    latencies = [];
    framesInWindow = 0;
  };

  return {
    isRunning: true,
    metrics: initial,
    setRunning: (v) => set({ isRunning: v }),
    reportFrame: (latencyMs, dropped = false) => {
      const s = get();
      if (dropped) {
        set({
          metrics: { ...s.metrics, droppedFrames: s.metrics.droppedFrames + 1 },
        });
        return;
      }

      latencies.push(latencyMs);
      framesInWindow += 1;

      set({
        metrics: { ...s.metrics, framesProcessed: s.metrics.framesProcessed + 1 },
      });

      recompute();
    },
    reset: () => set({ metrics: initial }),
  };
});

export type PerfMetrics = {
    fps: number;
    avgLatencyMs: number;
    p95LatencyMs: number;
    framesProcessed: number;
    droppedFrames: number;
}
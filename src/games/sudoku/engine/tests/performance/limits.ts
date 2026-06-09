export interface PerfLimits {
  readonly solve: number;
  readonly generate: number;
  readonly candidates: number;
}

export const PERF_LIMITS: Record<
  "classic" | "6x6" | "diagonal" | "hyper",
  PerfLimits
> = {
  classic: { solve: 150, generate: 800, candidates: 15 },
  "6x6": { solve: 80, generate: 400, candidates: 50 },
  diagonal: { solve: 200, generate: 4000, candidates: 20 },
  hyper: { solve: 200, generate: 3000, candidates: 25 },
};

export function medianMs(run: () => void, samples = 3): number {
  const times: number[] = [];
  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    run();
    times.push(performance.now() - start);
  }
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)]!;
}

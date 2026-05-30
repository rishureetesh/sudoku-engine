export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextInt(maxExclusive: number): number {
    return Math.floor(this.next() * maxExclusive);
  }

  shuffle<T>(items: readonly T[]): T[] {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1);
      const tmp = copy[i]!;
      copy[i] = copy[j]!;
      copy[j] = tmp;
    }
    return copy;
  }
}

let globalRandom: SeededRandom | undefined;

export function setGlobalSeed(seed: number): void {
  globalRandom = new SeededRandom(seed);
}

export function clearGlobalSeed(): void {
  globalRandom = undefined;
}

export function random(): number {
  if (globalRandom) {
    return globalRandom.next();
  }
  return Math.random();
}

export function randomInt(maxExclusive: number): number {
  return Math.floor(random() * maxExclusive);
}

export function shuffle<T>(items: readonly T[]): T[] {
  if (globalRandom) {
    return globalRandom.shuffle(items);
  }
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy;
}

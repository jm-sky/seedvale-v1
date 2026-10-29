/**
 * Isolated reference import from SeedVale V3 (V2-derived cave system).
 * Source: src/game/core/rng.ts
 * Source revision: 47733d6ba0fe96d4607be22c470c7331c76c2c5c
 * Extracted Rng state/constructor/next/range/int, hashInts, hashString and cave SALTS; algorithms/values unchanged.
 * Inactive: do not import from production code. See README.md.
 */
/** Mulberry32 PRNG. State is a single uint32 so it can be saved. */
export class Rng {
  state: number
  constructor(seed: number) {
    this.state = seed >>> 0
  }

  next(): number {
    let t = (this.state = (this.state + 0x6d2b79f5) >>> 0)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  range(min: number, max: number): number {
    return min + (max - min) * this.next()
  }

  int(min: number, maxInclusive: number): number {
    return min + Math.floor(this.next() * (maxInclusive - min + 1))
  }

}

/** Integer hash of arbitrary ints → uint32. */
export function hashInts(...vals: number[]): number {
  let h = 0x811c9dc5
  for (const v of vals) {
    h = Math.imul(h ^ (v | 0), 0x01000193)
    h ^= h >>> 13
    h = Math.imul(h, 0x5bd1e995)
    h ^= h >>> 15
  }
  return h >>> 0
}

export function hashString(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193)
  return h >>> 0
}

/** Original cave stream salts; unrelated registry entries omitted. */
export const SALTS = {
  /** Cave candidate slot: picks the entrance candidate and offset per (slot, try). */
  caveSlot: 0xca7e5,
  /** Cave main route (spine) draws per entrance and try. */
  caveSpine: 0x5b17e,
  /** Cave side branches draws, separate from the main route so the main draws do not shift. */
  caveBranch: 0xb2a7c,
} as const

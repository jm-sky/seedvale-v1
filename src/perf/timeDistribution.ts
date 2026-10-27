import { percentile } from './percentile'

/** Wall-clock distribution for a series of frame samples. Missing series →
 *  all fields `null` (never silent zeros). */
export type TimeDistribution = {
  p50: number | null
  p95: number | null
  p99: number | null
  max: number | null
  sampleCount: number
}

export function timeDistribution(samples: readonly number[]): TimeDistribution {
  const n = samples.length
  if (n <= 0) {
    return { p50: null, p95: null, p99: null, max: null, sampleCount: 0 }
  }
  const sorted = Float64Array.from(samples)
  sorted.sort()
  return {
    p50: round1(percentile(sorted, n, 50)),
    p95: round1(percentile(sorted, n, 95)),
    p99: round1(percentile(sorted, n, 99)),
    max: round1(sorted[n - 1]!),
    sampleCount: n,
  }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

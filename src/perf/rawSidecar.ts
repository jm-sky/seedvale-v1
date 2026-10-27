import type { SessionTotals } from './monitor'

/** Max frames exported at full resolution before explicit decimation. */
export const RAW_SIDECAR_FULL_LIMIT = 6000

export type RawSidecarSampling = {
  mode: 'full' | 'decimated'
  factor: number
  originalCount: number
  exportedCount: number
}

export type RawFrameSample = {
  i: number
  frameMs: number
  simulateMs: number
  renderMs: number
  drawCalls: number
  triangles: number
}

export type PerfRawSidecar = {
  schemaVersion: 1
  sampling: RawSidecarSampling
  frames: RawFrameSample[]
}

/**
 * Builds a bounded raw frame series from a completed session.
 * Decimation (keep every Nth sample) is applied only when `frameMs.length`
 * exceeds {@link RAW_SIDECAR_FULL_LIMIT}; the sampling metadata is always
 * explicit so consumers never assume a full series.
 */
export function buildRawSidecar(totals: SessionTotals): PerfRawSidecar {
  const originalCount = totals.frameMs.length
  let factor = 1
  if (originalCount > RAW_SIDECAR_FULL_LIMIT) {
    factor = Math.ceil(originalCount / RAW_SIDECAR_FULL_LIMIT)
  }
  const frames: RawFrameSample[] = []
  for (let i = 0; i < originalCount; i += factor) {
    frames.push({
      i,
      frameMs: totals.frameMs[i]!,
      simulateMs: totals.simulateMs[i] ?? 0,
      renderMs: totals.renderWallMs[i] ?? 0,
      drawCalls: totals.drawCallsSeries[i] ?? 0,
      triangles: totals.trianglesSeries[i] ?? 0,
    })
  }
  return {
    schemaVersion: 1,
    sampling: {
      mode: factor === 1 ? 'full' : 'decimated',
      factor,
      originalCount,
      exportedCount: frames.length,
    },
    frames,
  }
}

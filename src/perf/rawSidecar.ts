import type { SessionTotals } from './monitor'

/** Max frames exported at full resolution before explicit decimation. */
export const RAW_SIDECAR_FULL_LIMIT = 6000

export type RawSidecarSampling = {
  mode: 'full' | 'decimated'
  factor: number
  originalCount: number
  exportedCount: number
}

/** Order = numeric code stored per frame (`shadowReason` in the v2 sidecar). */
export const SHADOW_REASON_CODES = ['none', 'move', 'actor', 'stale', 'force'] as const

export type RawFrameSample = {
  i: number
  frameMs: number
  simulateMs: number
  renderMs: number
  drawCalls: number
  triangles: number
  /** v2 (world-terrain-056 S0). Mirror draw calls actually submitted (>0 = drawn). */
  mirrorDrawCalls?: number
  /** 1 when a shadow refresh was requested from three this frame (incl. forced). */
  shadowRefreshed?: number
  /** Index into {@link SHADOW_REASON_CODES}. */
  shadowReason?: number
  framesSinceShadow?: number
  msSinceShadow?: number
  shadowCentreDeltaM?: number
}

export type PerfRawSidecar = {
  schemaVersion: 2
  shadowReasonCodes: readonly string[]
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
      mirrorDrawCalls: totals.mirrorDrawCallsSeries?.[i] ?? 0,
      shadowRefreshed: totals.shadowRefreshedSeries?.[i] ?? 0,
      shadowReason: totals.shadowReasonSeries?.[i] ?? 0,
      framesSinceShadow: totals.framesSinceShadowSeries?.[i] ?? 0,
      msSinceShadow: Math.round((totals.msSinceShadowSeries?.[i] ?? 0) * 10) / 10,
      shadowCentreDeltaM: Math.round((totals.shadowCentreDeltaSeries?.[i] ?? 0) * 1000) / 1000,
    })
  }
  return {
    schemaVersion: 2,
    shadowReasonCodes: SHADOW_REASON_CODES,
    sampling: {
      mode: factor === 1 ? 'full' : 'decimated',
      factor,
      originalCount,
      exportedCount: frames.length,
    },
    frames,
  }
}

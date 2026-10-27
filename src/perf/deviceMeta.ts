import type { GpuTimer } from './gpuTimer'
import type { DeviceMeta, GpuTimerStatus } from './types'
import { percentile } from './percentile'
import type { WebGLRenderer } from 'three'

export function captureDeviceMeta(renderer?: WebGLRenderer | null): DeviceMeta {
  const nav = typeof navigator !== 'undefined' ? navigator : null
  let webglVendor: string | null = null
  let webglRenderer: string | null = null
  if (renderer) {
    try {
      const gl = renderer.getContext()
      const ext = gl.getExtension('WEBGL_debug_renderer_info') as {
        UNMASKED_VENDOR_WEBGL: number
        UNMASKED_RENDERER_WEBGL: number
      } | null
      if (ext) {
        webglVendor = String(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) ?? '') || null
        webglRenderer = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? '') || null
      }
    } catch {
      // ignore
    }
  }
  return {
    userAgent: nav?.userAgent ?? null,
    platform: nav?.platform ?? null,
    language: nav?.language ?? null,
    webglVendor,
    webglRenderer,
    manual: {
      gpu: null,
      driver: null,
      os: null,
      browser: null,
      powerThermal: null,
      notes: null,
    },
  }
}

export function buildGpuTimerStatus(timer: GpuTimer): GpuTimerStatus {
  const prov = timer.provenance()
  const samples = timer.samples()
  if (!prov.available) {
    return {
      available: false,
      resolved: false,
      samples: 0,
      querySpan: 'unavailable',
      unresolved: null,
      disjoint: null,
      skipped: null,
      avgMs: null,
      p95Ms: null,
      maxMs: null,
    }
  }
  if (samples.length === 0) {
    return {
      available: true,
      resolved: false,
      samples: 0,
      querySpan: prov.querySpan,
      unresolved: prov.unresolved,
      disjoint: prov.disjointEvents,
      skipped: prov.skipped,
      avgMs: null,
      p95Ms: null,
      maxMs: null,
    }
  }
  const sorted = Float64Array.from(samples)
  sorted.sort()
  const sum = samples.reduce((a, b) => a + b, 0)
  return {
    available: true,
    resolved: true,
    samples: samples.length,
    querySpan: prov.querySpan,
    unresolved: prov.unresolved,
    disjoint: prov.disjointEvents,
    skipped: prov.skipped,
    avgMs: Math.round((sum / samples.length) * 100) / 100,
    p95Ms: Math.round(percentile(sorted, sorted.length, 95) * 100) / 100,
    maxMs: Math.round((sorted[sorted.length - 1] ?? 0) * 100) / 100,
  }
}

export function drawingBufferSize(renderer: WebGLRenderer | null | undefined): {
  width: number | null
  height: number | null
} {
  if (!renderer) return { width: null, height: null }
  try {
    const el = renderer.domElement as HTMLCanvasElement & {
      drawingBufferWidth?: number
      drawingBufferHeight?: number
    }
    return {
      width: el.drawingBufferWidth ?? null,
      height: el.drawingBufferHeight ?? null,
    }
  } catch {
    return { width: null, height: null }
  }
}

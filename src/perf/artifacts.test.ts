import { describe, expect, it } from 'vitest'
import { assertArtifactRoundTrip, buildArtifactBundle } from './artifacts'
import { emptySessionTotals } from './monitor'
import { buildReport } from './report'

describe('artifact bundle', () => {
  it('round-trips JSON without coercing nulls to zero', () => {
    const totals = emptySessionTotals()
    totals.frames = 3
    totals.frameMs = [16, 17, 18]
    totals.simulateMs = [4, 4, 5]
    totals.renderWallMs = [12, 13, 13]
    totals.drawCallsSeries = [10, 10, 10]
    totals.trianglesSeries = [100, 100, 100]
    totals.frameMsSum = 51
    totals.frameMsMin = 16
    totals.frameMsMax = 18
    totals.drawCallsSum = 30
    totals.drawCallsMax = 10
    totals.trianglesSum = 300
    const report = buildReport({
      durationSec: 1,
      scenario: 'settlement-heavy',
      totals,
      context: {
        loadedChunks: 10,
        npcCount: 4,
        faunaCount: 2,
        pixelRatio: 1,
        quality: 'High',
        gitSha: 'abc123',
        runId: 'run-1',
        phase: 'warm',
        drawingBufferWidth: null,
        drawingBufferHeight: null,
      },
      passSubmissions: null,
      grassBaseline: null,
    })
    expect(report.frameTime.p50).not.toBeNull()
    expect(report.context.drawingBufferWidth).toBeNull()
    const bundle = buildArtifactBundle({
      report,
      markdown: formatPlaceholder(report.scenario),
      hardwareClass: 'diagnostic',
    })
    expect(bundle.meta.gitSha).toBe('abc123')
    expect(bundle.raw?.sampling.exportedCount).toBe(3)
    expect(() => assertArtifactRoundTrip(bundle)).not.toThrow()
  })
})

function formatPlaceholder(scenario: string): string {
  return `# Seedvale Performance Benchmark Report\n\nScenario: ${scenario}\n`
}

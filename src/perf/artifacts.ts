import type { PerfRawSidecar } from './rawSidecar'
import type { PerfReportJson } from './types'

/**
 * Deterministic benchmark artifact bundle for disk export.
 * Browser publishes this on `window.__seedvalePerfLastArtifacts`; the agent
 * writes JSON / raw / Markdown / meta under `docs/performance/results/`.
 */

export type PerfArtifactMeta = {
  schemaVersion: 1
  gitSha: string
  runId: string
  scenario: string
  phase: string
  canonical: boolean
  generatedAt: string
  fixtureVersion: string | null
  quality: string
  /** Explicit capture classification for non-Arc / software runs. */
  hardwareClass: 'target-gpu' | 'diagnostic' | 'unknown'
  notes: string | null
}

export type PerfArtifactBundle = {
  report: PerfReportJson
  raw: PerfRawSidecar | null
  markdown: string
  meta: PerfArtifactMeta
}

export function buildArtifactBundle(input: {
  report: PerfReportJson
  markdown: string
  hardwareClass?: PerfArtifactMeta['hardwareClass']
  notes?: string | null
}): PerfArtifactBundle {
  const { report } = input
  const gitSha = report.context.gitSha ?? 'unavailable'
  const runId = report.context.runId ?? 'unavailable'
  return {
    report,
    raw: report.raw ?? null,
    markdown: input.markdown,
    meta: {
      schemaVersion: 1,
      gitSha,
      runId,
      scenario: report.scenario,
      phase: report.context.phase ?? 'unknown',
      canonical: report.canonical,
      generatedAt: new Date().toISOString(),
      fixtureVersion: report.context.fixtureVersion ?? null,
      quality: report.quality,
      hardwareClass: input.hardwareClass ?? 'unknown',
      notes: input.notes ?? null,
    },
  }
}

/** Round-trip sanity: serialize → parse → compare key fields. */
export function assertArtifactRoundTrip(bundle: PerfArtifactBundle): void {
  const json = JSON.stringify(bundle)
  const parsed = JSON.parse(json) as PerfArtifactBundle
  if (parsed.report.scenario !== bundle.report.scenario) {
    throw new Error('artifact round-trip: scenario mismatch')
  }
  if (parsed.meta.gitSha !== bundle.meta.gitSha) {
    throw new Error('artifact round-trip: gitSha mismatch')
  }
  if (parsed.report.frameCount !== bundle.report.frameCount) {
    throw new Error('artifact round-trip: frameCount mismatch')
  }
  if ((parsed.raw?.sampling.exportedCount ?? null) !== (bundle.raw?.sampling.exportedCount ?? null)) {
    throw new Error('artifact round-trip: raw sampling mismatch')
  }
}

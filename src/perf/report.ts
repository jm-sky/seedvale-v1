import type { AgentCpuReport } from './agentCpuDiag'
import type { GrassBaselineSnapshot } from './grassBaseline'
import type { GrassFinalizationReport } from './grassFinalizationDiag'
import type { SessionTotals } from './monitor'
import type { PassSubmissionReport } from './passSubmissionCollector'
import type { IsolationProbeRow, LongFrameAttribution, PerfContext, PerfReportJson } from './types'
import { percentile } from './percentile'
import { buildRawSidecar } from './rawSidecar'
import { type AgentDetailCensus, SCENE_BUCKETS, type SceneCensus, SETTLEMENT_CONTENT_KINDS, type SettlementShadowCensus } from './sceneCensus'
import { timeDistribution } from './timeDistribution'
import { LONG_FRAME_MS, PERF_CATEGORIES, PERF_CATEGORY_COUNT } from './types'

const EMPTY_CONTEXT: PerfContext = {
  loadedChunks: 0,
  npcCount: 0,
  faunaCount: 0,
  pixelRatio: 1,
  quality: 'High',
}

export function buildReport(input: {
  durationSec: number
  scenario: string
  totals: SessionTotals
  context?: PerfContext
  scene?: SceneCensus
  shadowCasters?: SceneCensus
  settlementShadowCasters?: SettlementShadowCensus
  agentDetail?: AgentDetailCensus
  isolation?: IsolationProbeRow[]
  agentCpu?: AgentCpuReport | null
  grassFinalization?: GrassFinalizationReport | null
  grassBaseline?: GrassBaselineSnapshot | null
  passSubmissions?: PassSubmissionReport | null
  includeRaw?: boolean
  /** False only for `current` (plan tools-001 §2) — no fixed anchor, so it
   *  can't be trusted in an automated baseline comparison. Defaults true. */
  canonical?: boolean
}): PerfReportJson {
  const { totals, durationSec, scenario } = input
  const n = Math.max(1, totals.frames)
  const ctx = input.context ?? EMPTY_CONTEXT
  const sorted = Float64Array.from(totals.frameMs)
  sorted.sort()
  const avgMs = totals.frames > 0 ? totals.frameMsSum / totals.frames : 0
  const fpsAvg = avgMs > 0 ? 1000 / avgMs : 0
  const fpsMin = totals.frameMsMax > 0 ? 1000 / totals.frameMsMax : 0
  const p1Ms = totals.frames > 0 ? percentile(sorted, sorted.length, 99) : 0
  const fpsP1 = p1Ms > 0 ? 1000 / p1Ms : 0
  const frameDist = timeDistribution(totals.frameMs)
  const updateDist = timeDistribution(totals.simulateMs ?? [])
  const renderDist = timeDistribution(totals.renderWallMs ?? [])

  const systems: PerfReportJson['systems'] = {}
  const ranked: { name: string; ms: number }[] = []
  for (let i = 0; i < PERF_CATEGORY_COUNT; i++) {
    const ms = totals.categoryMsSum[i]! / n
    if (ms < 0.05) continue
    const name = PERF_CATEGORIES[i]!
    systems[name] = round1(ms)
    ranked.push({ name, ms })
  }
  ranked.sort((a, b) => b.ms - a.ms)
  const bottlenecks = ranked.slice(0, 3).map((r) => r.name)

  const spikes: PerfReportJson['spikes'] = []
  for (let i = 0; i < PERF_CATEGORY_COUNT; i++) {
    const count = totals.spikeCounts[i]! + totals.hitchCounts[i]!
    if (count <= 0) continue
    spikes.push({ category: PERF_CATEGORIES[i]!, count })
  }
  spikes.sort((a, b) => b.count - a.count)

  const hitches = [...(totals.hitchByLabel?.values() ?? [])]
    .map((row) => ({
      category: row.category,
      label: row.label,
      count: row.count,
      avgMs: round1(row.sumMs / Math.max(1, row.count)),
      maxMs: round1(row.maxMs),
    }))
    .sort((a, b) => b.maxMs - a.maxMs)

  const hitchCount = hitches.reduce((sum, h) => sum + h.count, 0)
  const frameMaxMs = totals.frameMsMax === Infinity ? 0 : totals.frameMsMax
  const largestHitchMs = hitches.reduce((max, h) => Math.max(max, h.maxMs), 0)
  const unattributedMs = Math.max(0, frameMaxMs - largestHitchMs)
  const p95Ms = totals.frames > 0 ? percentile(sorted, sorted.length, 95) : 0

  const top = ranked[0]
  const second = ranked[1]
  let recommendation: string
  // A single frame far above p95, with no labelled hitch to match it, is a
  // spike the report can't explain — do not credit it to the top CPU
  // category (plan tools-001 §5: sustained cost vs. frame spikes vs. no
  // attribution are distinct claims).
  if (frameMaxMs > 50 && unattributedMs > 0 && unattributedMs > p95Ms * 2) {
    recommendation = `Largest frame (${round1(frameMaxMs)} ms) is not explained by labelled hitches (largest ${round1(largestHitchMs)} ms) — unattributed frame spike, not a category bottleneck.`
  } else if (!top) {
    recommendation = 'No CPU system stood out; cost may be GPU fill-rate inside RENDER.'
  } else if (top.name === 'RENDER') {
    // EffectComposer submission can include GPU wait, so a high RENDER
    // average is not proof of CPU cost — isolation probes distinguish this.
    recommendation = 'RENDER is the largest sustained CPU-measured category, but composer submission time can include GPU wait — not confirmed as a CPU bottleneck without isolation probes.'
  } else if (second && top.ms < second.ms * 1.3) {
    recommendation = `No single system dominates sustained cost — ${ranked.slice(0, 3).map((r) => r.name).join(', ')} are comparable.`
  } else {
    recommendation = `${top.name} is the primary sustained bottleneck.`
  }

  const longFrames = buildLongFrameAttribution(totals)

  return {
    durationSec,
    quality: ctx.quality,
    pixelRatio: ctx.pixelRatio,
    scenario,
    canonical: input.canonical ?? true,
    frameCount: totals.frames,
    fps: {
      avg: round1(fpsAvg),
      min: Math.round(fpsMin),
      p1: Math.round(fpsP1),
    },
    frameTime: {
      avg: round1(avgMs),
      p50: frameDist.p50,
      p95: round1(p95Ms),
      p99: frameDist.p99,
      max: round1(frameMaxMs),
    },
    updateTime: updateDist,
    renderTime: renderDist,
    frameWallTime: frameDist,
    hitchCount,
    longFrameCount: longFrames.count,
    rendering: {
      drawCallsAvg: Math.round(totals.drawCallsSum / n),
      drawCallsMax: totals.drawCallsMax,
      trianglesAvg: Math.round(totals.trianglesSum / n),
      mirrorDrawCallsAvg: Math.round((totals.mirrorDrawCallsSum ?? 0) / n),
      geometries: ctx.geometries ?? totals.geometriesLast,
      textures: ctx.textures ?? totals.texturesLast,
    },
    scene: input.scene,
    shadowCasters: input.shadowCasters,
    settlementShadowCasters: input.settlementShadowCasters,
    agentDetail: input.agentDetail,
    passSubmissions: input.passSubmissions ?? null,
    hitches,
    isolation: input.isolation,
    systems,
    bottlenecks,
    spikes,
    attribution: {
      frameMaxMs: round1(frameMaxMs),
      largestHitchMs: round1(largestHitchMs),
      unattributedMs: round1(unattributedMs),
    },
    longFrames,
    recommendation,
    context: ctx,
    agentCpu: input.agentCpu ?? undefined,
    grassFinalization: input.grassFinalization ?? undefined,
    grassBaseline: input.grassBaseline ?? null,
    raw: input.includeRaw === false ? undefined : buildRawSidecar(totals),
  }
}

export function formatReport(report: PerfReportJson): string {
  const sysLines = Object.entries(report.systems)
    .map(([name, ms]) => `  ${name.padEnd(14)} ${ms.toFixed(1)} ms`)
    .join('\n')
  const bottlenecks = report.bottlenecks.map((b, i) => `  ${i + 1}. ${b}`).join('\n') || '  (none attributed)'
  const spikes = report.spikes.map((s) => `  ${s.category}: ${s.count}`).join('\n') || '  (none)'
  const hitchLines = (report.hitches ?? [])
    .map((h) => `  ${h.label.padEnd(22)} n=${h.count} avg=${h.avgMs.toFixed(1)} max=${h.maxMs.toFixed(1)}`)
    .join('\n')
  const sceneLines = formatCensusLines(report.scene, SCENE_BUCKETS)
  const shadowCasterLines = formatCensusLines(report.shadowCasters, SCENE_BUCKETS)
  const settlementShadowLines = formatCensusLines(
    report.settlementShadowCasters,
    SETTLEMENT_CONTENT_KINDS,
  )
  const agentDetailLines = formatAgentDetailLines(report.agentDetail)
  const isolationLines = (report.isolation ?? [])
    .map((row) => `  ${row.id.padEnd(18)} render=${row.renderMsAvg.toFixed(1)} ms draws=${row.drawCallsAvg} tris=${formatTriangles(row.trianglesAvg)}`)
    .join('\n')
  const ctx = report.context
  const reproLines = [
    ctx.gitSha ? `  gitSha: ${ctx.gitSha}` : null,
    ctx.runId ? `  runId: ${ctx.runId}` : null,
    ctx.phase ? `  phase: ${ctx.phase}` : null,
    ctx.fixtureVersion ? `  fixture: ${ctx.fixtureVersion}` : null,
    ctx.seed != null ? `  seed: ${ctx.seed}` : null,
    ctx.elapsedDays != null ? `  elapsedDays: ${ctx.elapsedDays}` : null,
    ctx.timeOfDay != null ? `  timeOfDay: ${ctx.timeOfDay.toFixed(3)}` : null,
    ctx.season ? `  season: ${ctx.season}` : null,
    ctx.weather ? `  weather: ${ctx.weather}` : null,
    ctx.terrainResolution != null ? `  terrainResolution: ${ctx.terrainResolution}` : null,
    ctx.loadRadius != null ? `  loadRadius: ${ctx.loadRadius}` : null,
    ctx.grassMacroVariation != null ? `  grassMacroVariation: ${ctx.grassMacroVariation ? 'ON' : 'OFF'}` : null,
    ctx.viewportWidth != null && ctx.viewportHeight != null ? `  viewport: ${ctx.viewportWidth}x${ctx.viewportHeight}` : null,
    ctx.drawingBufferWidth != null && ctx.drawingBufferHeight != null
      ? `  drawingBuffer: ${ctx.drawingBufferWidth}x${ctx.drawingBufferHeight}`
      : null,
    ctx.cameraPose
      ? `  camera: pos=(${round1(ctx.cameraPose.position.x)}, ${round1(ctx.cameraPose.position.y)}, ${round1(ctx.cameraPose.position.z)})`
      : null,
    ctx.scenarioAnchor ? `  anchor: (${round1(ctx.scenarioAnchor.x)}, ${round1(ctx.scenarioAnchor.z)})` : null,
    ctx.scenarioSettlement
      ? `  settlement: ${ctx.scenarioSettlement.name} (${ctx.scenarioSettlement.id}) `
        + `terrain=${ctx.scenarioSettlement.terrain} size=${ctx.scenarioSettlement.size} `
        + `families=${ctx.scenarioSettlement.familyCount} residents=${ctx.scenarioSettlement.residentCount} `
        + `pos=(${round1(ctx.scenarioSettlement.x)}, ${round1(ctx.scenarioSettlement.z)})`
      : null,
    ctx.route ? `  route: start=(${round1(ctx.route.startX)}, ${round1(ctx.route.startZ)}) speed=${ctx.route.speedMps} m/s duration=${ctx.route.durationSec}s` : null,
    ctx.populationGate
      ? `  populationGate: ${ctx.populationGate.status} waited=${ctx.populationGate.waitedMs}ms npc=${ctx.populationGate.npcCount}${ctx.populationGate.status === 'timeout' ? ' (UNSTABLE — population still changing at timeout)' : ''}`
      : null,
    ctx.cameraControl
      ? `  cameraControl: yaw=${round1(ctx.cameraControl.yaw)} pitch=${round1(ctx.cameraControl.pitch)} distance=${round1(ctx.cameraControl.distance)}`
      : null,
    ctx.gpuTimer
      ? `  gpuTimer: available=${ctx.gpuTimer.available} resolved=${ctx.gpuTimer.resolved} samples=${ctx.gpuTimer.samples} span=${ctx.gpuTimer.querySpan}`
      : null,
  ].filter((line): line is string => line !== null)

  const distLine = (label: string, d: { p50: number | null; p95: number | null; p99: number | null; max: number | null; sampleCount: number }): string =>
    `  ${label}: p50=${d.p50 ?? 'unavailable'} p95=${d.p95 ?? 'unavailable'} p99=${d.p99 ?? 'unavailable'} max=${d.max ?? 'unavailable'} n=${d.sampleCount}`

  const pass = report.passSubmissions
  const passLines = pass
    ? [
        `  reliability: ${pass.reliability}${pass.reliabilityReason ? ` (${pass.reliabilityReason})` : ''}`,
        `  frames: ${pass.frames} shadowRefresh=${pass.shadowRefreshFrames} shadowSkipped=${pass.shadowSkippedFrames}`,
        `  mirror calls avg: ${pass.mirror?.callsAvg ?? 'unavailable'}`,
        `  shadow calls avg: ${pass.shadow?.callsAvg ?? 'unavailable'}`,
        `  main calls avg: ${pass.main?.callsAvg ?? 'unavailable'}`,
      ].join('\n')
    : '  (not collected)'

  return [
    '[Seedvale Benchmark]',
    '',
    `Scenario: ${report.scenario}${report.canonical ? '' : ' (non-canonical)'}`,
    `Duration: ${report.durationSec}s`,
    `Frames: ${report.frameCount}`,
    `Quality: ${report.quality}`,
    `Pixel ratio: ${report.pixelRatio}`,
    '',
    'Reproducibility:',
    reproLines.join('\n') || '  (no fixture context)',
    '',
    'FPS:',
    `  avg: ${report.fps.avg}`,
    `  min: ${report.fps.min}`,
    `  p1: ${report.fps.p1}`,
    '',
    'Frame time (wall-clock):',
    `  avg: ${report.frameTime.avg} ms`,
    `  p50: ${report.frameTime.p50 ?? 'unavailable'} ms`,
    `  p95: ${report.frameTime.p95} ms`,
    `  p99: ${report.frameTime.p99 ?? 'unavailable'} ms`,
    `  max: ${report.frameTime.max} ms`,
    '',
    'Distributions (CPU wall-clock; render may include GPU wait):',
    distLine('update', report.updateTime),
    distLine('render', report.renderTime),
    distLine('frame', report.frameWallTime),
    '',
    'Rendering (combined renderer.info):',
    `  draw calls: ${report.rendering.drawCallsAvg} avg / ${report.rendering.drawCallsMax} max`,
    `  triangles: ${formatTriangles(report.rendering.trianglesAvg)} avg`,
    `  mirror draws: ${report.rendering.mirrorDrawCallsAvg ?? 0} avg`,
    `  geometries: ${report.rendering.geometries ?? report.context.geometries ?? 0}`,
    `  textures: ${report.rendering.textures ?? report.context.textures ?? 0}`,
    '',
    'Pass submissions (actual):',
    passLines,
    '',
    'Scene (one-pass estimate):',
    sceneLines || '  (not sampled)',
    '',
    'Shadow casters (one-pass estimate):',
    shadowCasterLines || '  (not sampled)',
    '',
    'Settlement shadow casters (one-pass estimate):',
    settlementShadowLines || '  (not sampled)',
    '',
    'Agent detail (one-pass estimate):',
    agentDetailLines || '  (not sampled)',
    '',
    'Systems:',
    sysLines || '  (no per-system CPU samples)',
    '',
    'Detected bottlenecks:',
    bottlenecks,
    '',
    'Critical spikes:',
    spikes,
    '',
    `Hitches (>= 8 ms): total=${report.hitchCount}`,
    hitchLines || '  (none)',
    '',
    'Isolation probes:',
    isolationLines || '  (not run)',
    '',
    'Frame attribution:',
    `  frame max: ${report.attribution.frameMaxMs} ms`,
    `  largest labelled hitch: ${report.attribution.largestHitchMs} ms`,
    `  unattributed: ${report.attribution.unattributedMs} ms`,
    '',
    'Long frames:',
    `  threshold: ${report.longFrames?.thresholdMs ?? LONG_FRAME_MS} ms`,
    `  count: ${report.longFrameCount}`,
    `  worst: ${report.longFrames?.worst[0] ? `${report.longFrames.worst[0].frameMs} ms` : '(none)'}`,
    '',
    'Raw sidecar:',
    report.raw
      ? `  sampling=${report.raw.sampling.mode} factor=${report.raw.sampling.factor} exported=${report.raw.sampling.exportedCount}/${report.raw.sampling.originalCount}`
      : '  (absent)',
    '',
    'Recommendation:',
    report.recommendation,
    // Agent CPU is intentionally NOT embedded here — `getBenchmarkReport`
    // appends it once to avoid the historical duplicate Markdown section.
  ].join('\n')
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

const WORST_LONG_FRAMES_IN_REPORT = 5

function buildLongFrameAttribution(totals: SessionTotals): LongFrameAttribution {
  const records = totals.longFrames ?? []
  const count = totals.longFrameCount ?? records.length
  const worst = [...records]
    .sort((a, b) => b.frameMs - a.frameMs)
    .slice(0, WORST_LONG_FRAMES_IN_REPORT)
    .map((record) => ({
      ...record,
      frameMs: round1(record.frameMs),
      simulateMs: round1(record.simulateMs),
      renderMs: round1(record.renderMs),
      otherMs: round1(record.otherMs),
      categoryMs: Object.fromEntries(
        Object.entries(record.categoryMs).map(([name, ms]) => [name, round1(ms ?? 0)]),
      ),
      stages: record.stages.map((stage) => ({ label: stage.label, ms: round1(stage.ms) })),
    }))
  return {
    thresholdMs: LONG_FRAME_MS,
    count,
    worst,
  }
}

function formatTriangles(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

function formatCensusLines(
  census: Partial<Record<string, { drawCalls: number, triangles: number, meshes: number, instances: number }>> | undefined,
  keys: readonly string[],
): string {
  if (!census) return ''
  return keys
    .map((key) => {
      const row = census[key]
      if (!row || row.drawCalls <= 0) return null
      return `  ${key.padEnd(16)} draws=${row.drawCalls} tris=${formatTriangles(row.triangles)} meshes=${row.meshes} inst=${row.instances}`
    })
    .filter((line): line is string => line !== null)
    .join('\n')
}

function formatAgentDetailLines(agentDetail: AgentDetailCensus | undefined): string {
  if (!agentDetail) return ''
  const section = (label: string, group: AgentDetailCensus['npc']): string[] => {
    if (group.families.length === 0) return []
    const lines = [`  ${label}:`]
    lines.push('    by family (sorted by draws):')
    for (const f of group.families) {
      lines.push(
        `      ${f.family.padEnd(16)} agents=${f.agents} draws=${f.drawCalls} tris=${formatTriangles(f.triangles)} skinned=${f.skinnedMeshes}/${f.meshes}`,
      )
    }
    lines.push('    by distance band:')
    for (const b of group.distanceBands) {
      if (b.agents === 0) continue
      lines.push(
        `      ${b.band.padEnd(4)} agents=${b.agents} camera-relevant=${b.cameraRelevantAgents} draws=${b.drawCalls} tris=${formatTriangles(b.triangles)}`,
      )
    }
    return lines
  }
  return [...section('NPC', agentDetail.npc), ...section('Fauna', agentDetail.fauna)].join('\n')
}

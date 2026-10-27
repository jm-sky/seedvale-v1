import type { QualityPreset } from '../config/qualityProfiles'
import type { WorldConfig } from '../config/worldConfig'
import type { LookState } from '../input/MouseLook'
import type { SettlementCell, SettlementDef } from '../settlement/settlementGenerator'
import type { DayNightState } from '../world/dayNight'
import type { BenchmarkScenarioId } from './benchmarkScenarios'
import type { IsolationHost } from './isolationProbe'
import type { PerfMonitor } from './monitor'
import type { PassSubmissionCollector } from './passSubmissionCollector'
import type { CameraControlResult, PerfReportJson, PopulationGateResult, PopulationSnapshot, ScenarioSettlement } from './types'
import { clampDistance, clampPitch } from '../input/MouseLook'
import { worldToChunk } from '../terrain/chunkGrid'
import { buildAgentCpuReport, formatAgentCpuReport, getAgentCpuDiag } from './agentCpuDiag'
import { assertArtifactRoundTrip, buildArtifactBundle, type PerfArtifactBundle } from './artifacts'
import { createRunId, getBuildGitSha } from './buildInfo'
import { buildGpuTimerStatus, captureDeviceMeta, drawingBufferSize } from './deviceMeta'
import { getGpuTimer } from './gpuTimer'
import {
  formatGrassBaselineReport,
  getGrassBaselineDiag,
} from './grassBaseline'
import {
  buildGrassFinalizationReport,
  formatGrassFinalizationReport,
  getGrassFinalizationDiag,
} from './grassFinalizationDiag'
import {
  scenarioSettlementFromDef,
  selectHeavySettlement,
} from './heavySettlementScenario'
import { formatIsolationReport, runIsolationProbes } from './isolationProbe'
import { formatLongFrameAttribution } from './longFrameFormat'
import { formatPassSubmissionReport } from './passSubmissionCollector'
import { formatProgramAttributionReport, formatProgramCensusReport, formatProgramCompileCostReport, getProgramCensus } from './programCensus'
import { buildReport, formatReport } from './report'
import { censusAgentDetail, censusScene, censusSettlementShadowCasters, censusShadowCasters } from './sceneCensus'
import type { Camera, WebGLRenderer } from 'three'

/** Post-preload settle window (plan tools-001 §3) — lets lazy
 *  initialization/first-use costs that `waitForChunks()` doesn't cover (GC,
 *  first-frame allocations) fall outside the measured session. Not a
 *  cold-start eliminator; a separate cold-start mode would be a distinct,
 *  explicitly-named benchmark, not a weaker version of this one. */
const WARMUP_MS = 1000
const DEFAULT_DURATION_SEC = 30
/** `stream` scenario route (plan tools-001 §2) — encoded here so a report's
 *  `context.route` reflects the actual constants used, not just "some
 *  interval". */
const STREAM_SPEED_MPS = 8 * 1.8
const STREAM_UPDATE_MS = 100
/** Shore margin for `seekWater` (plan tools-001 §2) — a candidate must stand
 *  this close above `waterLevel` (dry) to count as "at the water's edge". */
const WATER_SHORE_MARGIN = 1.5

/** Optional run controls. Defaults keep the previous harness behaviour except
 *  the population gate, which is on (set `populationGate: false` to skip). */
export type BenchmarkRunOptions = {
  /** Controlled camera look (radians / world units) applied through the
   *  regular `MouseLook` state read by `PlayerController.syncCamera` — no
   *  pointer lock needed. Omitted fields keep the current value. */
  camera?: { yaw?: number; pitch?: number; distance?: number }
  /** Wait for a stable NPC count before the measured window. `false` skips. */
  populationGate?: false | { stableMs?: number; timeoutMs?: number }
}

export type BenchmarkRunner = {
  running: () => boolean
  run: (id: BenchmarkScenarioId, durationSec?: number, options?: BenchmarkRunOptions) => Promise<PerfReportJson | null>
}

const POPULATION_POLL_MS = 250
const POPULATION_STABLE_MS = 5000
const POPULATION_TIMEOUT_MS = 90000

type TerrainProbe = {
  waitForChunks: (coords: { cx: number; cz: number }[]) => Promise<void>
  sampleForestFactor: (x: number, z: number) => number
  sampleHeight: (x: number, z: number) => number
  waterLevel: number
}

export type BenchmarkHost = {
  config: WorldConfig
  // Accessor, not a value — `bundle.chunkManager` is replaced wholesale on a
  // `WorldBundle` rebuild (terrain-config change, New Game); a captured value
  // would silently keep probing a disposed instance (plan 195 data-consistency
  // audit, finding A). Read live at each call site, matching the rest of the
  // codebase's `WorldContext`/`bundle.x` accessor convention.
  chunkManager: () => TerrainProbe
  home: () => { x: number; z: number }
  /** Live settlement-def seam for `settlement-heavy` (plan tools-016). Same
   *  lifetime rule as `chunkManager` — resolve through the current
   *  `WorldBundle`, never capture a replaceable manager by value. */
  settlements: () => {
    getHomeDef: () => SettlementDef
    peekDef: (cell: SettlementCell) => SettlementDef | null
  }
  dayNight: DayNightState
  player: { setPosition: (x: number, z: number) => void; mesh: { position: { x: number; y: number; z: number } } }
  monitor: PerfMonitor
  applyQualityPreset: (preset: Exclude<QualityPreset, 'Custom'>) => void
  isolation: IsolationHost
  /** Benchmark camera, for {@link censusAgentDetail}'s point-in-frustum
   *  estimate (plan world-terrain-041) — same stable-for-the-session value
   *  the rest of the render stack uses, not an accessor, since (unlike
   *  `chunkManager`) it is never replaced by a `WorldBundle` rebuild. */
  camera: Camera
  renderer: WebGLRenderer
  passCollector: PassSubmissionCollector
  /** Live player camera look state (`createMouseLook().state`) — the same
   *  object `PlayerController.syncCamera` reads every tick. */
  look: LookState
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

async function waitForStablePopulation(
  monitor: PerfMonitor,
  gate: BenchmarkRunOptions['populationGate'],
): Promise<PopulationGateResult> {
  if (gate === false) {
    return { status: 'disabled', waitedMs: 0, stableForMs: 0, npcCount: monitor.getContext().npcCount, timeoutMs: 0 }
  }
  const stableMs = gate?.stableMs ?? POPULATION_STABLE_MS
  const timeoutMs = gate?.timeoutMs ?? POPULATION_TIMEOUT_MS
  const start = performance.now()
  let last = monitor.getContext().npcCount
  let lastChange = start
  for (;;) {
    await sleep(POPULATION_POLL_MS)
    const now = performance.now()
    const count = monitor.getContext().npcCount
    if (count !== last) {
      last = count
      lastChange = now
    }
    if (now - lastChange >= stableMs) {
      return { status: 'stable', waitedMs: Math.round(now - start), stableForMs: Math.round(now - lastChange), npcCount: count, timeoutMs }
    }
    if (now - start >= timeoutMs) {
      return { status: 'timeout', waitedMs: Math.round(now - start), stableForMs: Math.round(now - lastChange), npcCount: count, timeoutMs }
    }
  }
}

function loadRing(x: number, z: number, chunkSize: number, loadRadius: number) {
  const center = worldToChunk(x, z, chunkSize)
  const coords: { cx: number; cz: number }[] = []
  for (let dz = -loadRadius; dz <= loadRadius; dz++) {
    for (let dx = -loadRadius; dx <= loadRadius; dx++) {
      coords.push({ cx: center.cx + dx, cz: center.cz + dz })
    }
  }
  return coords
}

function seekForest(probe: TerrainProbe, originX: number, originZ: number): { x: number; z: number } {
  let best = { x: originX, z: originZ, score: probe.sampleForestFactor(originX, originZ) }
  for (let r = 32; r <= 384; r += 32) {
    for (let a = 0; a < 12; a++) {
      const x = originX + Math.cos((a / 12) * Math.PI * 2) * r
      const z = originZ + Math.sin((a / 12) * Math.PI * 2) * r
      const score = probe.sampleForestFactor(x, z)
      if (score > best.score) best = { x, z, score }
    }
  }
  return best
}

/** Finds a scene that is actually water-adjacent, not just close in height
 *  to `waterLevel` (plan tools-001 §2 — proximity-to-waterLevel alone can
 *  land on dry high ground that merely happens to sit near that elevation).
 *  A candidate must be dry land within `WATER_SHORE_MARGIN` above
 *  `waterLevel`, with at least one sample a few units away that is actually
 *  submerged — i.e. visibly at the water's edge. */
function seekWater(probe: TerrainProbe, originX: number, originZ: number): { x: number; z: number } {
  const waterLevel = probe.waterLevel
  let best: { x: number; z: number; score: number } | null = null
  for (let r = 16; r <= 384; r += 16) {
    for (let a = 0; a < 16; a++) {
      const x = originX + Math.cos((a / 16) * Math.PI * 2) * r
      const z = originZ + Math.sin((a / 16) * Math.PI * 2) * r
      const h = probe.sampleHeight(x, z)
      if (h < waterLevel || h > waterLevel + WATER_SHORE_MARGIN) continue
      const nearWater = [0, 90, 180, 270].some((deg) => {
        const rad = (deg / 180) * Math.PI
        const hx = x + Math.cos(rad) * 6
        const hz = z + Math.sin(rad) * 6
        return probe.sampleHeight(hx, hz) < waterLevel
      })
      if (!nearWater) continue
      const score = h - waterLevel
      if (!best || score < best.score) best = { x, z, score }
    }
  }
  return best ?? { x: originX, z: originZ }
}

export function createBenchmarkRunner(host: BenchmarkHost): BenchmarkRunner {
  let inFlight = false

  // Phase: required chunk preload, ahead of the measured session (plan
  // tools-001 §3 — `setup → required chunk preload → warm-up → measured run`).
  async function preloadChunks(x: number, z: number): Promise<void> {
    const { chunkSize, loadRadius } = host.config.terrain
    await host.chunkManager().waitForChunks(loadRing(x, z, chunkSize, loadRadius))
  }

  return {
    running: () => inFlight,
    async run(id, durationSec = DEFAULT_DURATION_SEC, options = {}) {
      if (inFlight) return null
      inFlight = true
      const { player, dayNight, config, monitor } = host
      const saved = {
        x: player.mesh.position.x,
        z: player.mesh.position.z,
        timeOfDay: dayNight.timeOfDay,
        preset: config.quality.preset,
      }
      try {
        // Phase: setup — resolve the scenario anchor from the (deterministic,
        // fixture-derived) home settlement position, not from wherever the
        // player/camera happened to be before the run. `current` is the one
        // exception: it deliberately keeps the pre-run position and is
        // reported as non-canonical (plan tools-001 §2).
        const home = host.home()
        let x = saved.x
        let z = saved.z
        let timeOfDay = saved.timeOfDay
        let anchor: { x: number; z: number } | undefined
        let scenarioSettlement: ScenarioSettlement | undefined
        if (id === 'settlement') {
          x = home.x
          z = home.z
          anchor = { x, z }
        } else if (id === 'settlement-heavy') {
          const settlements = host.settlements()
          const homeDef = settlements.getHomeDef()
          const selected = selectHeavySettlement({
            home: homeDef,
            peekDef: (cell) => settlements.peekDef(cell),
          })
          if (!selected.ok) {
            console.error(`[benchmark] settlement-heavy: ${selected.reason}`)
            return null
          }
          x = selected.def.x
          z = selected.def.z
          anchor = { x, z }
          scenarioSettlement = scenarioSettlementFromDef(selected.def)
        } else if (id === 'forest' || id === 'stress') {
          const found = seekForest(host.chunkManager(), home.x, home.z)
          x = found.x
          z = found.z
          anchor = found
        } else if (id === 'water') {
          const found = seekWater(host.chunkManager(), home.x, home.z)
          x = found.x
          z = found.z
          anchor = found
        } else if (id === 'stream') {
          x = home.x
          z = home.z
          anchor = { x, z }
        }
        if (id === 'night' || id === 'stress') timeOfDay = 0.05
        host.applyQualityPreset('High')

        if (x !== saved.x || z !== saved.z) player.setPosition(x, z)
        dayNight.timeOfDay = timeOfDay

        // Phase: required chunk preload.
        await preloadChunks(x, z)
        // Phase: warm-up — outside the measured session (see WARMUP_MS doc).
        await sleep(WARMUP_MS)

        // Phase: controlled camera (no pointer lock). Applied before the
        // population gate so the gate and window see the same view.
        let cameraControl: CameraControlResult | null = null
        if (options.camera) {
          const { look } = host
          if (options.camera.yaw !== undefined) look.yaw = options.camera.yaw
          if (options.camera.distance !== undefined) look.distance = clampDistance(options.camera.distance)
          if (options.camera.pitch !== undefined) look.pitch = clampPitch(options.camera.pitch, look.distance)
          cameraControl = { applied: true, yaw: look.yaw, pitch: look.pitch, distance: look.distance }
        }

        // Phase: population-stability gate. Observes only — never freezes or
        // alters the simulation. A timeout is recorded as an explicit failure
        // status in the report, and the run still proceeds (unstable).
        const populationGate = await waitForStablePopulation(monitor, options.populationGate)

        // Stream route is derived from elapsed wall-clock time each tick,
        // not accumulated per-tick — `setInterval`'s delivered delay isn't
        // exactly `STREAM_UPDATE_MS`, and a fixed per-tick step would drift
        // the actual distance travelled away from `STREAM_SPEED_MPS ×
        // durationSec` (plan tools-001 §2/traps §10).
        let streamTimer = 0
        const streamStart = performance.now()
        if (id === 'stream') {
          streamTimer = window.setInterval(() => {
            const elapsedSec = (performance.now() - streamStart) / 1000
            player.setPosition(x + STREAM_SPEED_MPS * elapsedSec, z)
          }, STREAM_UPDATE_MS)
        }

        // Phase: measured session (explicit warm — preload + WARMUP_MS above).
        const runId = createRunId()
        const gitSha = getBuildGitSha()
        const populationStart: PopulationSnapshot = {
          npcCount: monitor.getContext().npcCount,
          faunaCount: monitor.getContext().faunaCount,
          loadedChunks: monitor.getContext().loadedChunks,
          settlementFamilyCount: scenarioSettlement?.familyCount ?? null,
          settlementResidentCount: scenarioSettlement?.residentCount ?? null,
        }
        getAgentCpuDiag().reset()
        getGrassFinalizationDiag().reset()
        getGrassBaselineDiag().reset()
        // Window-scoped GPU timer samples: reset here, read before the
        // isolation probes (which reset it per probe) — see `gpuTimerStatus`.
        getGpuTimer().reset()
        host.passCollector.enable(host.renderer)
        host.passCollector.beginSession()
        monitor.setSource('benchmark', true)
        monitor.beginSession()
        const windowStartedAt = performance.timeOrigin + performance.now()
        try {
          await sleep(durationSec * 1000)
        } finally {
          // Always tear down collector even if the timed window throws.
        }
        const totals = monitor.endSession()
        if (typeof window !== 'undefined') {
          // Epoch-ms bounds of the measured window, so external diagnostics
          // (console GL errors, traces) can be placed relative to it.
          window.__seedvalePerfWindow = { startMs: windowStartedAt, endMs: performance.timeOrigin + performance.now() }
        }
        await sleep(200)
        getGpuTimer().poll()
        const gpuTimerStatus = buildGpuTimerStatus(getGpuTimer())
        const passSubmissions = host.passCollector.endSession()
        host.passCollector.disable()
        const agentCpuTotals = getAgentCpuDiag().snapshot()
        const grassFinalizationTotals = getGrassFinalizationDiag().snapshot()
        if (streamTimer) window.clearInterval(streamTimer)

        const scene = censusScene(host.isolation.scene)
        const shadowCasters = censusShadowCasters(host.isolation.scene)
        const settlementShadowCasters = censusSettlementShadowCasters(host.isolation.scene)
        // Bounded, benchmark-only agent breakdown (plan world-terrain-041) —
        // camera-relevance is a point-in-frustum estimate off the same
        // camera the render stack already uses, no extra measurement.
        const agentDetail = censusAgentDetail(host.isolation.scene, player.mesh.position, host.camera)
        const grassBaseline = getGrassBaselineDiag().snapshotScene(host.isolation.scene)
        // Previously skipped for `stream` — now runs for every scenario so
        // the render-cost breakdown (water/vegetation/postprocessing/mirrors/
        // CPU-GPU separation) is available for the scenario program census
        // and compile-cost diagnostics already target.
        const isolation = await runIsolationProbes(host.isolation, monitor)
        monitor.setSource('benchmark', false)

        const baseContext = monitor.getContext()
        const populationEnd: PopulationSnapshot = {
          npcCount: baseContext.npcCount,
          faunaCount: baseContext.faunaCount,
          loadedChunks: baseContext.loadedChunks,
          settlementFamilyCount: scenarioSettlement?.familyCount ?? null,
          settlementResidentCount: scenarioSettlement?.residentCount ?? null,
        }
        const agentCpu = buildAgentCpuReport({
          frames: totals.frames,
          totals: agentCpuTotals,
          categoryMsSum: totals.categoryMsSum,
          context: baseContext,
        })
        const grassFinalization = buildGrassFinalizationReport(grassFinalizationTotals)
        const buf = drawingBufferSize(host.renderer)
        const cam = host.camera
        const report = buildReport({
          durationSec,
          scenario: id,
          totals,
          canonical: id !== 'current',
          agentCpu,
          grassFinalization,
          grassBaseline,
          passSubmissions,
          context: {
            ...baseContext,
            timeOfDay,
            scenarioAnchor: anchor,
            scenarioSettlement,
            route: id === 'stream'
              ? { startX: x, startZ: z, speedMps: STREAM_SPEED_MPS, updateMs: STREAM_UPDATE_MS, durationSec }
              : undefined,
            viewportWidth: typeof window !== 'undefined' ? window.innerWidth : undefined,
            viewportHeight: typeof window !== 'undefined' ? window.innerHeight : undefined,
            drawingBufferWidth: buf.width,
            drawingBufferHeight: buf.height,
            gitSha,
            runId,
            phase: 'warm',
            cameraPose: {
              position: { x: cam.position.x, y: cam.position.y, z: cam.position.z },
              quaternion: {
                x: cam.quaternion.x,
                y: cam.quaternion.y,
                z: cam.quaternion.z,
                w: cam.quaternion.w,
              },
            },
            populationStart,
            populationEnd,
            populationGate,
            cameraControl,
            device: captureDeviceMeta(host.renderer),
            gpuTimer: gpuTimerStatus,
          },
          scene,
          shadowCasters,
          settlementShadowCasters,
          agentDetail,
          isolation,
        })
        console.log(formatReport(report))
        console.log(report)
        if (agentCpu) console.log(formatAgentCpuReport(agentCpu))
        if (grassFinalization) console.log(formatGrassFinalizationReport(grassFinalization))
        console.log(formatGrassBaselineReport(grassBaseline))
        console.log(formatPassSubmissionReport(passSubmissions))
        console.log(formatLongFrameAttribution(report.longFrames))
        // Plan 149 Phase 0 program-census diagnostic (docs/performance/audits/
        // 2026-09-01--program-census.md) — the census (`?programCensus=1` or
        // `?benchmark=stream`, see `src/perf/flags.ts`) accumulates for the
        // whole app session, not just this call's measured window, matching
        // how that census's dumps were produced.
        const programCensus = getProgramCensus()
        if (programCensus.enabled) {
          console.log(formatProgramCensusReport(programCensus))
          // Narrow program → material → object → asset attribution follow-up
          // (see formatProgramAttributionReport doc comment) for the runner-up
          // first-use transitions — same census data, no extra measurement.
          console.log(formatProgramAttributionReport(programCensus))
          // Best-effort compile/link cost attribution (see
          // formatProgramCompileCostReport doc comment) — same census data,
          // no extra measurement, explicit about what can't be isolated.
          console.log(formatProgramCompileCostReport(programCensus))
        }
        // Render-cost isolation breakdown (water/vegetation-grass/
        // postprocessing/mirrors/CPU-GPU separation) — independent of the
        // program census, always printed when probes ran.
        console.log(formatIsolationReport(isolation))

        const getBenchmarkReport = (): string => {
          const content: string[] = []

          const headers: string[] = [
            'Seedvale Benchmark',
            agentCpu ? 'Seedvale Agent CPU' : undefined,
            grassFinalization ? 'Seedvale Grass Finalization' : undefined,
            'Seedvale Grass Baseline',
            'Seedvale Pass Submissions',
            'Seedvale Long Frame Attribution',
            programCensus.enabled ? 'Seedvale Program Census' : undefined,
            programCensus.enabled ? 'Seedvale Program Attribution' : undefined,
            programCensus.enabled ? 'Seedvale Program Compile Cost' : undefined,
            'Seedvale Render Isolation',
          ].filter((header): header is string => header !== undefined)

          content.push('# Seedvale Performance Benchmark Report')
          content.push('')
          content.push(`> Generated: ${new Date().toISOString()}`)
          content.push('> Sections:')
          content.push(...headers.map((header) => `> - [${header}]`))
          content.push('\n---\n')

          content.push(formatReport(report))
          content.push('\n---\n')

          // Agent CPU once here only — `formatReport` no longer embeds it.
          if (agentCpu) {
            content.push(formatAgentCpuReport(agentCpu))
            content.push('\n---\n')
          }

          if (grassFinalization) {
            content.push(formatGrassFinalizationReport(grassFinalization))
            content.push('\n---\n')
          }

          content.push(formatGrassBaselineReport(grassBaseline))
          content.push('\n---\n')
          content.push(formatPassSubmissionReport(passSubmissions))
          content.push('\n---\n')

          content.push(formatLongFrameAttribution(report.longFrames))
          content.push('\n---\n')

          if (programCensus.enabled) {
            content.push(formatProgramCensusReport(programCensus))
            content.push('\n---\n')
            content.push(formatProgramAttributionReport(programCensus))
            content.push('\n---\n')
            content.push(formatProgramCompileCostReport(programCensus))
            content.push('\n---\n')
          }

          content.push(formatIsolationReport(isolation))
          content.push('')

          return content.join('\n')
        }

        const copyBenchmarkReport = (): void => {
          navigator.clipboard.writeText(getBenchmarkReport())
        }

        const markdown = getBenchmarkReport()
        const artifacts = buildArtifactBundle({
          report,
          markdown,
          hardwareClass: 'unknown',
          notes: 'Harness capture — set hardwareClass to target-gpu only on verified Arc/real-GPU runs.',
        })
        assertArtifactRoundTrip(artifacts)

        if (typeof window !== 'undefined') {
          window.__seedvalePerfLastReport = report
          const previous = window.__seedvalePerfReports ?? []
          window.__seedvalePerfReports = [...previous, report]
          window.__seedvalePerfLastArtifacts = artifacts
          window.__copyBenchmarkReport = copyBenchmarkReport
          window.__getBenchmarkReport = getBenchmarkReport
        }
        return report
      } finally {
        host.passCollector.disable()
        if (saved.preset === 'Low' || saved.preset === 'Medium' || saved.preset === 'High') {
          host.applyQualityPreset(saved.preset)
        }
        player.setPosition(saved.x, saved.z)
        dayNight.timeOfDay = saved.timeOfDay
        inFlight = false
      }
    },
  }
}

declare global {
  interface Window {
    __seedvalePerfLastReport?: PerfReportJson
    __seedvalePerfReports?: PerfReportJson[]
    __seedvalePerfLastArtifacts?: PerfArtifactBundle
    __seedvaleRunBenchmark?: (id: BenchmarkScenarioId, durationSec?: number, options?: BenchmarkRunOptions) => Promise<PerfReportJson | null>
    __copyBenchmarkReport?: () => void
    __getBenchmarkReport?: () => string
    __seedvaleReady?: boolean
    __seedvalePerfWindow?: { startMs: number; endMs: number }
  }
}

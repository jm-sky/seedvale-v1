import { BENCHMARK_SCENARIO_IDS, type BenchmarkScenarioId } from './benchmarkScenarios'

const BENCHMARK_SCENARIO_ID_SET: ReadonlySet<string> = new Set(BENCHMARK_SCENARIO_IDS)

function params(): URLSearchParams | null {
  if (typeof window === 'undefined') return null
  try {
    return new URLSearchParams(window.location.search)
  } catch {
    return null
  }
}

function flagOn(raw: string | null): boolean {
  if (raw === null || raw.trim() === '') return true
  const v = raw.trim().toLowerCase()
  return v !== '0' && v !== 'false' && v !== 'no'
}

/** `?perf` / `?perf=1` — enable per-system timings without opening lil-gui. */
export function isPerfUrlEnabled(): boolean {
  const p = params()
  if (!p?.has('perf')) return false
  return flagOn(p.get('perf'))
}

/** `?programCensus=1` — plan 149 Phase 0 WebGLProgram/material census
 *  (`src/perf/programCensus.ts`), usable standalone (e.g. under manual play
 *  or agent-browser) without running the full 30s `stream` benchmark. The
 *  `stream` benchmark itself enables the census automatically. */
export function isProgramCensusUrlEnabled(): boolean {
  const p = params()
  if (!p?.has('programCensus')) return false
  return flagOn(p.get('programCensus'))
}

/** Production `NUM_POINT_LIGHTS` cap (plan 157). Review 024 rejected 8 and 12
 *  (visible night cull) and kept 16 as the only visual-safe budget on the
 *  measured curve. Override or disable via `?pointLightBudget`. */
export const DEFAULT_POINT_LIGHT_BUDGET = 16

/**
 * Parse `?pointLightBudget` into the pad/cull cap, or `null` to leave the
 * registry running without padding.
 *
 * Production default is {@link DEFAULT_POINT_LIGHT_BUDGET} (16) when the
 * param is absent. QA/rollback:
 *  - `?pointLightBudget=N` → that integer (≥ 1)
 *  - bare / `true` / `yes` → {@link DEFAULT_POINT_LIGHT_BUDGET}
 *  - `0` / `false` / `no` / `off` → pad/cull off (`null`)
 */
export function parsePointLightBudgetFlag(raw: string | null, present: boolean): number | null {
  if (!present) return DEFAULT_POINT_LIGHT_BUDGET
  if (raw === null || raw.trim() === '') return DEFAULT_POINT_LIGHT_BUDGET
  const v = raw.trim().toLowerCase()
  if (v === '0' || v === 'false' || v === 'no' || v === 'off') return null
  if (v === 'true' || v === 'yes') return DEFAULT_POINT_LIGHT_BUDGET
  const n = Number.parseInt(raw, 10)
  if (!Number.isInteger(n) || n < 1) return null
  return n
}

/** Production PointLight budget, overridable from the URL. See
 *  {@link parsePointLightBudgetFlag}. */
export function pointLightBudgetFromUrl(): number | null {
  const p = params()
  if (!p) return DEFAULT_POINT_LIGHT_BUDGET
  return parsePointLightBudgetFlag(p.get('pointLightBudget'), p.has('pointLightBudget'))
}

export function parseBenchmarkScenarioId(raw: string | null | undefined): BenchmarkScenarioId | null {
  if (!raw) return null
  const id = raw.trim().toLowerCase()
  if (BENCHMARK_SCENARIO_ID_SET.has(id)) return id as BenchmarkScenarioId
  return null
}

export function benchmarkScenarioFromUrl(): BenchmarkScenarioId | null {
  return parseBenchmarkScenarioId(params()?.get('benchmark'))
}

/** `?benchmarkAutorun=0` — boot the `?benchmark=` fixture world without starting
 *  the run (worldgen fixture export, plan tools-020). */
export function isBenchmarkAutorunEnabled(): boolean {
  const p = params()
  if (!p?.has('benchmarkAutorun')) return true
  return flagOn(p.get('benchmarkAutorun'))
}

/** Parse `?benchYaw=<radians>` — finite number, else `null`. */
export function parseBenchmarkYaw(raw: string | null | undefined): number | null {
  if (raw === null || raw === undefined || raw.trim() === '') return null
  const v = Number(raw)
  return Number.isFinite(v) ? v : null
}

/** `?benchYaw=<radians>` — controlled camera yaw for the URL-autorun benchmark
 *  (e.g. the Q16 open-view control arm); absent keeps the loaded look. */
export function benchmarkYawFromUrl(): number | null {
  return parseBenchmarkYaw(params()?.get('benchYaw'))
}

/** Parse `?benchDuration=<seconds>` — integer 5…300, else `null`. */
export function parseBenchmarkDuration(raw: string | null | undefined): number | null {
  if (raw === null || raw === undefined || raw.trim() === '') return null
  const v = Number(raw)
  return Number.isInteger(v) && v >= 5 && v <= 300 ? v : null
}

/** `?benchDuration=<seconds>` — measured-window length for the URL-autorun
 *  benchmark (e.g. a longer `stream` route that crosses more river tiles);
 *  absent keeps the default 30 s. */
export function benchmarkDurationFromUrl(): number | null {
  return parseBenchmarkDuration(params()?.get('benchDuration'))
}

/** Single per-frame scene matrix update (`src/render/frameSceneMatrices.ts`, queue Q14).
 *  On by default since the native Windows A/B (frame p50 -3.1 ms, see
 *  docs/performance/results/2026-10-29--win-q14-frame-matrix-once-ab.md);
 *  `?frameMatrixOnce=0` restores the per-render matrix updates for A/B. */
export function isFrameMatrixOnceEnabled(): boolean {
  const p = params()
  if (!p?.has('frameMatrixOnce')) return true
  return flagOn(p.get('frameMatrixOnce'))
}

/** world-terrain-055 S1: ±56 m sun shadow frustum shifted 24 m ahead of the
 *  player along camera forward. On by default (author 2026-11-01, WSL A/B: no
 *  regression, shadow calls −11.6 %); `?shadowFrustum=legacy` restores ±80 m
 *  centred on the player. Windows A/B + visual check still pending (queue §4/§2). */
export function shadowFrustumModeFromUrl(): 'legacy' | 'tight' {
  return params()?.get('shadowFrustum') === 'legacy' ? 'legacy' : 'tight'
}

/** world-terrain-055 S2: refresh the sun shadow map every 2nd frame when only
 *  nearby NPC/fauna motion (not the player/camera) triggers it. On by default
 *  (author 2026-11-01, WSL A/B: draws −260/frame, no regression);
 *  `?shadowActorCadence=0` restores per-frame refresh. */
export function isShadowActorCadenceEnabled(): boolean {
  const p = params()
  if (!p?.has('shadowActorCadence')) return true
  return flagOn(p.get('shadowActorCadence'))
}

/** world-terrain-056 S1: alternate shadow refresh frames while the frustum
 *  centre moves (escapes in `shadowBudget.ts`). Default ON (author 2026-11-02:
 *  keep candidate flags on during play; benchmarks later);
 *  `?shadowMotionCadence=0` restores refresh on every moving frame. */
export function isShadowMotionCadenceEnabled(): boolean {
  const p = params()
  if (!p?.has('shadowMotionCadence')) return true
  return flagOn(p.get('shadowMotionCadence'))
}

/** Stutter diagnosis 2026-11-02: on a frame that refreshes the shadow map,
 *  a due water-mirror pass yields to the next frame (at most one frame in a
 *  row) so the two full scene passes never stack. Default ON;
 *  `?mirrorShadowStagger=0` restores the independent cadences. */
export function isMirrorShadowStaggerEnabled(): boolean {
  const p = params()
  if (!p?.has('mirrorShadowStagger')) return true
  return flagOn(p.get('mirrorShadowStagger'))
}

/** CA2 far-band grass main storage cap (`chunkManager.ts` `grassMainCapFor`).
 *  On by default; `?grassMainCap=0` stores every generated main instance again
 *  (pre-CA2) for the memory/upload A/B. */
export function isGrassMainCapEnabled(): boolean {
  const p = params()
  if (!p?.has('grassMainCap')) return true
  return flagOn(p.get('grassMainCap'))
}

/** Q5 Track B: interior house chests as one settlement `InstancedMesh` group
 *  (`settlement/props.ts`). On by default; `?chestInstancing=0` restores one
 *  procedural chest `Group` per house for the A/B. */
export function isChestInstancingEnabled(): boolean {
  const p = params()
  if (!p?.has('chestInstancing')) return true
  return flagOn(p.get('chestInstancing'))
}

/** Q20 Track A (A1): one skeleton per actor (`render/actorSkeletonSharing.ts`).
 *  On by default since the WSL A/B (docs/performance/results/
 *  2026-10-30--wsl-q20-actor-skeleton-sharing-ab.md); `?actorSkeletons=0`
 *  keeps one cloned skeleton per skinned part for the Windows A/B. */
export function isActorSkeletonSharingEnabled(): boolean {
  const p = params()
  if (!p?.has('actorSkeletons')) return true
  return flagOn(p.get('actorSkeletons'))
}

/** NPC body builds (slim/heavy morph derivatives, `characters/bodyBuild.ts`, 2026-11-02). On by default
 *  (author-requested feature); `?npcBuilds=0` forces every NPC onto the original body files with no build
 *  morph — the A arm of the WSL/Windows A/B (extra GLB variants + morph texture fetches). */
export function isNpcBodyBuildsEnabled(): boolean {
  const p = params()
  if (!p?.has('npcBuilds')) return true
  return flagOn(p.get('npcBuilds'))
}

/** Issue 040: god-rays shader with per-tap HDR cap, normalised accumulation,
 *  soft shoulder and jittered taps (`render/godRaysShader.ts`). On by
 *  default; `?godRaysSoft=0` compiles the issue-016 shader for the
 *  before/after visual + GPU A/B. */
export function isGodRaysSoftEnabled(): boolean {
  const p = params()
  if (!p?.has('godRaysSoft')) return true
  return flagOn(p.get('godRaysSoft'))
}

/** Q17 Track E (E1): loading-window prewarm also compiles the instanced
 *  program families of every loaded chunk-content template
 *  (`render/programPrewarm.ts`, `ChunkManager.programPrewarmTemplates`), so
 *  species first met mid-travel (e.g. `maple_1.glb`, ferns) do not pay their
 *  first-use link in the water mirror pass. Default ON since the 2026-11-02
 *  stutter diagnosis (author: optimisations on, benchmarks later; the
 *  2026-10-30 Windows A/B removed the render-side link spikes, guards
 *  inconclusive); `?prewarmTemplates=0` restores home-scene-only prewarm. */
export function isTemplateProgramPrewarmEnabled(): boolean {
  const p = params()
  if (!p?.has('prewarmTemplates')) return true
  return flagOn(p.get('prewarmTemplates'))
}

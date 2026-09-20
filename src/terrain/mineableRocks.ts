import type { EnvironmentKind } from './chunkEnvironment'
import {
  applyMineableWorkAction as applyPureMineableWorkAction,
  initialMineableWorkState,
  type MineableWorkDefinition,
  type MineableWorkState,
} from '../world/mineableWork'

/**
 * Mineable environment-rock domain (plan world-terrain-047) — balancing
 * tables and effective-state derivation for generated `largeRock`/
 * `rockCluster` environment props. Owns *what* a rock's current stage/prompt/
 * collider profile is; rendering, collision and persistence stay owned by
 * `chunkManager.ts`/`createApp.ts`.
 *
 * @domain world-terrain
 */

export type MineableRockKind = Extract<EnvironmentKind, 'largeRock' | 'rockCluster'>

export function isMineableRockKind(kind: EnvironmentKind): kind is MineableRockKind {
  return kind === 'largeRock' || kind === 'rockCluster'
}

/** Boulder stage yields 1–2 stone for 4 actions, then transitions to the pile
 *  stage (3 more actions, same yield) before depleting entirely. */
const LARGE_ROCK_WORK: MineableWorkDefinition = {
  requiredCapability: 'rock_mining',
  stages: [
    { id: 'boulder', actionsRequired: 4, yield: { kind: 'stone', min: 1, max: 2 } },
    { id: 'pile', actionsRequired: 3, yield: { kind: 'stone', min: 1, max: 2 } },
  ],
}

/** Ordinary small cluster — 3 actions, 1 stone each, then gone. */
const ROCK_CLUSTER_WORK: MineableWorkDefinition = {
  requiredCapability: 'rock_mining',
  stages: [
    { id: 'cluster', actionsRequired: 3, yield: { kind: 'stone', min: 1, max: 1 } },
  ],
}

export function mineableWorkDefinitionForRock(kind: MineableRockKind): MineableWorkDefinition {
  return kind === 'largeRock' ? LARGE_ROCK_WORK : ROCK_CLUSTER_WORK
}

/** Sparse per-rock runtime state, keyed by stable `EnvironmentPlacement.resourceId`.
 *  No entry means untouched (full base state). `'depleted'` is an explicit
 *  tombstone — required so deterministic worldgen never respawns a fully
 *  mined rock (unlike a mid-progress `MineableWorkState`, which is
 *  indistinguishable from "untouched" only at `stageIndex: 0, actionsInStage: 0`). */
export type MineableRockRuntimeState = MineableWorkState | 'depleted'

export type MineableRockStateStore = Map<string, MineableRockRuntimeState>

/** The rock's currently visible/collidable shape — `'depleted'` means no
 *  visual and no collider. A `rockCluster` never becomes a `largeRock`; a
 *  `largeRock` becomes a `rockCluster` once its boulder stage (index 0)
 *  completes, regardless of how many pile actions (index 1) have landed
 *  since — only the boulder→pile→gone transitions are visible, never an
 *  intermediate-hit rebuild. */
export function effectiveMineableRockKind(
  baseKind: MineableRockKind,
  runtimeState: MineableRockRuntimeState | undefined,
): MineableRockKind | 'depleted' {
  if (runtimeState === 'depleted') return 'depleted'
  if (baseKind === 'rockCluster') return 'rockCluster'
  if (!runtimeState) return 'largeRock'
  return runtimeState.stageIndex === 0 ? 'largeRock' : 'rockCluster'
}

/** True once a rock's state has diverged from its deterministic base
 *  (untouched) — the "must suppress the batched base instance and project a
 *  runtime override instead" signal for `chunkManager.ts`. */
export function isMineableRockTouched(runtimeState: MineableRockRuntimeState | undefined): boolean {
  return runtimeState !== undefined
}

export function mineableRockPromptLabel(effectiveKind: MineableRockKind): string {
  return effectiveKind === 'largeRock' ? 'Rozbij skałę' : 'Rozbij kamienie'
}

export type MineableRockWorkOutcome = {
  yield: { kind: MineableWorkDefinition['stages'][number]['yield']['kind'], amount: number }
  nextState: MineableRockRuntimeState
  stageCompleted: boolean
  depleted: boolean
}

/** Applies exactly one completed mining action against `runtimeState`
 *  (`undefined` = untouched base state), returning the yield and the state
 *  to store back. Returns `null` for an already-depleted rock — callers must
 *  not offer the action at all once `effectiveMineableRockKind` reports
 *  `'depleted'`. */
export function applyMineableRockAction(
  baseKind: MineableRockKind,
  runtimeState: MineableRockRuntimeState | undefined,
  random: () => number = Math.random,
): MineableRockWorkOutcome | null {
  if (runtimeState === 'depleted') return null
  const definition = mineableWorkDefinitionForRock(baseKind)
  const state = runtimeState ?? initialMineableWorkState()
  const result = applyPureMineableWorkAction(definition, state, random)
  return {
    yield: result.yield,
    nextState: result.depleted ? 'depleted' : result.state!,
    stageCompleted: result.stageCompleted,
    depleted: result.depleted,
  }
}

/** Sparse save-row shape (plan world-terrain-047 §9) — `stageIndex ===
 *  DEPLETED_STAGE_INDEX` is the tombstone encoding of `'depleted'`. */
export type SaveMineableRockRow = { id: string, stageIndex: number, actionsInStage: number }

export const DEPLETED_STAGE_INDEX = -1

export function serializeMineableRockState(state: ReadonlyMap<string, MineableRockRuntimeState>): SaveMineableRockRow[] {
  const rows: SaveMineableRockRow[] = []
  for (const [id, runtimeState] of state) {
    rows.push(
      runtimeState === 'depleted'
        ? { id, stageIndex: DEPLETED_STAGE_INDEX, actionsInStage: 0 }
        : { id, stageIndex: runtimeState.stageIndex, actionsInStage: runtimeState.actionsInStage },
    )
  }
  return rows
}

export function deserializeMineableRockState(rows: readonly SaveMineableRockRow[]): MineableRockStateStore {
  const state: MineableRockStateStore = new Map()
  for (const row of rows) {
    state.set(
      row.id,
      row.stageIndex === DEPLETED_STAGE_INDEX
        ? 'depleted'
        : { stageIndex: row.stageIndex, actionsInStage: row.actionsInStage },
    )
  }
  return state
}

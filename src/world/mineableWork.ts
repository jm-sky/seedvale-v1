import type { ItemCapability } from '../items/itemCatalog'
import type { ItemKind } from '../items/items'

/**
 * Reusable finite capability-gated mining/progress contract (plan
 * world-terrain-047) — the shared shape between the surface decorative rocks
 * this plan lands and the planned cave obstruction in
 * `quests-progression-041`. Describes work/progress only: no rendering,
 * collision, terrain or quest concerns, and no `HeldTool` dependency —
 * capability checking stays at the owner/action boundary.
 *
 * @domain world
 */

export type MineableWorkStage = {
  id: string
  /** Completed actions required to finish this stage. */
  actionsRequired: number
  yield: { kind: ItemKind, min: number, max: number }
}

export type MineableWorkDefinition = {
  requiredCapability: ItemCapability
  stages: readonly MineableWorkStage[]
}

export type MineableWorkState = {
  stageIndex: number
  actionsInStage: number
}

export type MineableWorkResult = {
  /** `null` means the work is now fully depleted — the owner must stop
   *  offering this action and drop/tombstone its presentation. */
  state: MineableWorkState | null
  yield: { kind: ItemKind, amount: number }
  stageCompleted: boolean
  depleted: boolean
}

export function initialMineableWorkState(): MineableWorkState {
  return { stageIndex: 0, actionsInStage: 0 }
}

/** Applies exactly one completed work action against `state`, resolving the
 *  current stage's `min..max` yield with the injected `random` (deterministic
 *  under test). `state` must reference a definition that still has a stage at
 *  `state.stageIndex` — callers must not call this again once a prior result
 *  reported `depleted: true`. */
export function applyMineableWorkAction(
  definition: MineableWorkDefinition,
  state: MineableWorkState,
  random: () => number = Math.random,
): MineableWorkResult {
  const stage = definition.stages[state.stageIndex]
  if (!stage) {
    throw new Error(`applyMineableWorkAction: no stage at index ${state.stageIndex}`)
  }
  const amount = stage.yield.min + Math.floor(random() * (stage.yield.max - stage.yield.min + 1))
  const actionsInStage = state.actionsInStage + 1
  if (actionsInStage < stage.actionsRequired) {
    return {
      state: { stageIndex: state.stageIndex, actionsInStage },
      yield: { kind: stage.yield.kind, amount },
      stageCompleted: false,
      depleted: false,
    }
  }
  const nextStageIndex = state.stageIndex + 1
  const depleted = nextStageIndex >= definition.stages.length
  return {
    state: depleted ? null : { stageIndex: nextStageIndex, actionsInStage: 0 },
    yield: { kind: stage.yield.kind, amount },
    stageCompleted: true,
    depleted,
  }
}

import type { Interactable } from '../interaction/Interactable'
import { hasItemCapability } from '../items/itemCatalog'
import type { ToolKind } from '../items/HeldTool'
import {
  RISKY_WATER_DRINK_CONFIRM_BODY,
  RISKY_WATER_DRINK_CONFIRM_LABEL,
  requiresRiskyWaterDrinkConfirmation,
  type WaterSource,
} from '../world/WaterSource'

const RISKY_WATER_DRINK_CONFIRM_TITLE = 'Picie wody'

export type DirectWaterDrinkDeps = {
  drinkFromWaterSource: (source: WaterSource) => void
  openActionConfirm: (title: string, body: string, onConfirm: () => void, confirmLabel?: string) => void
}

/** When gaze picks a plain shoreline candidate, dig/combat fallbacks may still
 *  express stronger player intent (plan ui-input-034). Tab/cycle and fishing
 *  rod shoreline interactions are out of scope here — only the gaze winner is
 *  arbitrated. */
/** @domain ui-input */
export function arbitrateGazeWaterEdgeTarget(
  gazeTarget: Interactable | null,
  digTarget: Interactable | null,
  combatTarget: Interactable | null,
  heldTool: ToolKind | null,
): Interactable | null {
  if (!gazeTarget) return null
  if (gazeTarget.kind !== 'waterEdge') return gazeTarget
  if (hasItemCapability(heldTool, 'fishing')) return gazeTarget
  if (digTarget) return digTarget
  if (combatTarget) return combatTarget
  return gazeTarget
}

/** Routes one direct player drink through risky confirmation when needed.
 *  `revalidateSource` must rebuild the live source at commit time; if it
 *  returns null, no drink mutation runs. */
/** @domain ui-input */
export function requestDirectWaterDrink(
  previewSource: WaterSource,
  revalidateSource: () => WaterSource | null,
  deps: DirectWaterDrinkDeps,
): void {
  if (!requiresRiskyWaterDrinkConfirmation(previewSource)) {
    deps.drinkFromWaterSource(previewSource)
    return
  }
  deps.openActionConfirm(
    RISKY_WATER_DRINK_CONFIRM_TITLE,
    RISKY_WATER_DRINK_CONFIRM_BODY,
    () => {
      const live = revalidateSource()
      if (live) deps.drinkFromWaterSource(live)
    },
    RISKY_WATER_DRINK_CONFIRM_LABEL,
  )
}

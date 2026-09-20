import type { DroppedItems } from '../items/createDroppedItems'
import type { Inventory } from '../items/Inventory'
import type { ItemKind } from '../items/items'
import type { Hud } from '../ui/createHud'
import type { Toast } from '../ui/createToast'
import type { ChunkManager } from './chunkManager'
import { playInventoryPickUp } from '../audio/inventorySounds'
import {
  DIG_RADIUS,
  type DigProfile,
  isEligibleShellDigSpot,
  resolveDigShell,
  resolveDigStone,
} from './dig'
import { nearestGridPoint, resolveLevelSamples } from './terrainPreparation'

export type DigFeedback = {
  inventory: Inventory
  droppedItems: DroppedItems
  toast: Toast
  hud: Hud
  playOnce: (url: string, volume?: number) => void
  /** Application-owned count-backed acquisition toast (plan ui-input-020). */
  showCountAcquisition: (kind: ItemKind, delta: number, total: number) => void
}

/** Adds `amount` `kind` units straight to inventory and reports the pickup
 *  as one grouped toast — the "fits" half of the shared count-backed dig/mine
 *  acquisition contract (plan world-terrain-047 §3). Reused by rock-mining
 *  yield in `groundActions.ts` so every count-backed terrain acquisition
 *  shares one grant path. */
export function addDigItemToInventory(kind: ItemKind, feedback: DigFeedback, amount = 1): void {
  feedback.inventory.add(kind, amount)
  playInventoryPickUp(feedback.playOnce)
  feedback.hud.setInventoryWeight(feedback.inventory.totalWeight(), feedback.inventory.maxWeight)
  feedback.showCountAcquisition(kind, amount, feedback.inventory.count(kind))
}

/** Drops one `kind` unit beside `(x, z)` — the "doesn't fit" half of the
 *  shared count-backed dig/mine acquisition contract. */
export function dropDigItemNearby(kind: ItemKind, x: number, z: number, feedback: DigFeedback, random: () => number): void {
  const angle = random() * Math.PI * 2
  feedback.droppedItems.drop(kind, x + Math.cos(angle) * 0.55, z + Math.sin(angle) * 0.55)
}

/** Applies one dig depression + stone outcome, plus an independent shell
 *  find on eligible coastal sand (plan world-terrain-047), at `(x, z)`. */
export function applyDigAt(
  chunkManager: ChunkManager,
  x: number,
  z: number,
  profile: DigProfile,
  feedback: DigFeedback,
  random: () => number = Math.random,
): void {
  chunkManager.modifyTerrain(x, z, DIG_RADIUS, profile.depth, 'player')
  // A previously-dropped stone resting where we just dug (e.g. from an
  // earlier dig at the same spot) is now floating above the new depression —
  // re-settle it onto the fresh height instead of leaving it stuck in place.
  feedback.droppedItems.settleNear(x, z, DIG_RADIUS)
  const outcome = resolveDigStone(profile.stoneChance, feedback.inventory.canAdd('stone'), random)
  if (outcome.kind === 'none') {
    feedback.toast.show(profile.surface === 'rock' ? 'Wykuto skałę.' : 'Wykopano dołek.')
  } else if (outcome.kind === 'inventory') {
    addDigItemToInventory('stone', feedback)
  } else {
    // Full inventory or unnoticed — never silently lose the stone.
    dropDigItemNearby('stone', x, z, feedback, random)
    feedback.toast.show(
      outcome.reason === 'full'
        ? 'Kamień wypadł na ziemię — ekwipunek jest pełny.'
        : 'Kamień wypadł na ziemię.',
    )
  }

  // Independent shell find (plan world-terrain-047) — a single dig may
  // therefore produce both a stone and a shell.
  if (isEligibleShellDigSpot(x, z, profile, chunkManager)) {
    const shellOutcome = resolveDigShell(feedback.inventory.canAdd('shell'), random)
    if (shellOutcome.kind === 'inventory') {
      addDigItemToInventory('shell', feedback)
    } else if (shellOutcome.kind === 'ground') {
      dropDigItemNearby('shell', x, z, feedback, random)
      feedback.toast.show('Muszelka wypadła na ziemię — ekwipunek jest pełny.')
    }
  }
}

/** "Wyrównaj" (plan `world-terrain-002` §1) — levels the 3×3 nearest terrain
 *  samples around `(x, z)` to the central sample's own current height (never
 *  the procedural base). A one-shot exact-height write through the same
 *  `applyExactHeights` primitive active terrain-preparation work uses, keyed
 *  by a *stable*, location-derived id (the grid-snapped center point) so
 *  repeat-leveling the same spot replaces its own prior entry instead of
 *  appending a growing list forever (plan `world-terrain-save`). */
export function applyLevelAt(
  chunkManager: ChunkManager,
  x: number,
  z: number,
  toast: Toast,
): void {
  const samples = resolveLevelSamples(x, z, chunkManager.chunkSize, chunkManager.resolution)
  const center = nearestGridPoint(x, z, chunkManager.chunkSize, chunkManager.resolution)
  const targetHeight = chunkManager.sampleHeight(center.x, center.z)
  const heights = samples
    .filter((s) => Math.abs(chunkManager.sampleHeight(s.x, s.z) - targetHeight) > 1e-4)
    .map((s) => ({ x: s.x, z: s.z, height: targetHeight }))
  if (heights.length === 0) {
    toast.show('Teren jest już wyrównany.')
    return
  }
  chunkManager.applyExactHeights(`level:${center.x}:${center.z}`, heights)
  toast.show('Wyrównano teren.')
}

/** "Zrób górkę" (plan `world-terrain-002` §1) — the inverse of "Wykop
 *  dołek": the same radial deformation `modifyTerrain` already applies for a
 *  dig, just raising instead of lowering (a negative depth), so it shares
 *  the exact same single-deformation limits/mechanism. Never yields stone —
 *  raising ground doesn't unearth anything. */
export function applyMoundAt(
  chunkManager: ChunkManager,
  x: number,
  z: number,
  depth: number,
  toast: Toast,
): void {
  chunkManager.modifyTerrain(x, z, DIG_RADIUS, -depth, 'player')
  toast.show('Usypano górkę.')
}

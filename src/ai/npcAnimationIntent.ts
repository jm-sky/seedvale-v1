import type { Inventory } from '../items/Inventory'
import type { Role } from './characters'
import type { NeedId } from './Needs'
import type { ActionId, Phase } from './npcAction'
import { HOUSEHOLD_WOOD_ITEM_KINDS } from '../settlement/householdWood'

/**
 * Presentation-only NPC animation intent (plan npc-055).
 * Derived from simulation phase / `ActionId` / movement — never persisted
 * and never authoritative for work completion or timing.
 *
 * @domain npc
 */
export type NpcAnimationIntent =
  | 'idle'
  | 'walk'
  | 'run'
  | 'interact'
  | 'talk'
  | 'consume'
  | 'chopTree'
  | 'farmHarvest'
  | 'farmPlant'
  | 'farmWater'
  | 'walkCarry'
  | 'fixKneeling'
  | 'sitIdle'
  | 'sitTalk'
  | 'layToIdle'
  | 'mine'
  | 'fish'
  | 'attackMelee'
  | 'attackRanged'
  | 'death'
  | 'hurt'

/** Roles whose ambiguous generic `work` uses kneeling rather than Interact. */
const FIX_KNEELING_WORK_ROLES: ReadonlySet<Role> = new Set([
  'blacksmith',
  'herbalist',
  'hunter',
  'textile_worker',
])

/** Inputs for {@link resolveNpcAnimationIntent}. Combat one-shot gates stay outside. */
export type ResolveNpcAnimationIntentInput = {
  phase: Phase
  /** Current pending action kind, if any. */
  actionKind: ActionId | null
  /** Chain kind carried across `next` promotion (`promoteChainKind`). */
  chainKind: ActionId | null
  role: Role
  moving: boolean
  /** Effective run/flee locomotion — overrides walk and walkCarry. */
  run: boolean
  /** Precomputed bulky-cargo presentation flag (see {@link isBulkyCargoPresentation}). */
  bulkyCargo: boolean
  /** True only when the NPC already has a real seated seat/anchor. */
  seated?: boolean
  activeNeed?: NeedId
}

/**
 * True when an inventory holds wood/beam bulky cargo.
 * Ordinary food, herbs, arrows and ore do not qualify.
 *
 * @domain npc
 */
export function isBulkyCargo(inventory: Pick<Inventory, 'holdsAny'>): boolean {
  for (const kind of HOUSEHOLD_WOOD_ITEM_KINDS) {
    if (inventory.holdsAny(kind)) return true
  }
  return false
}

/**
 * Presentation bulky-cargo flag for walkCarry: inventory wood/beams, or a
 * woodcut deposit leg (chop→deposit), or a wood exchange→deposit leg.
 * Does not invent persisted cargo state.
 *
 * @domain npc
 */
export function isBulkyCargoPresentation(input: {
  carried?: Pick<Inventory, 'holdsAny'> | null
  transportCargo?: Pick<Inventory, 'holdsAny'> | null
  actionKind: ActionId | null
  chainKind: ActionId | null
  activeNeed?: NeedId
}): boolean {
  if (input.carried && isBulkyCargo(input.carried)) return true
  if (input.transportCargo && isBulkyCargo(input.transportCargo)) return true
  const kind = input.actionKind
  const chain = input.chainKind ?? kind
  if (kind === 'deposit' && chain === 'chop') return true
  if (kind === 'deposit' && chain === 'exchange' && input.activeNeed === 'wood') return true
  return false
}

function intentForAction(actionKind: ActionId, role: Role, seated: boolean): NpcAnimationIntent {
  switch (actionKind) {
    case 'accompany':
    case 'approachPlayer':
    case 'bury':
    case 'cleanAnimalCorpse':
    case 'deposit':
    case 'drink':
    case 'exchange':
    case 'heal':
    case 'sharpen':
    case 'shear':
    case 'shelter':
    case 'travel':
    case 'visitGrave':
      return 'interact'
    case 'chop':
      return 'chopTree'
    case 'conversation':
      return seated ? 'sitTalk' : 'talk'
    case 'eat':
      return 'consume'
    case 'fish':
      return 'fish'
    case 'harvest':
      return 'farmHarvest'
    case 'mine':
      return 'mine'
    case 'plant':
      return 'farmPlant'
    case 'social':
      return seated ? 'sitIdle' : 'interact'
    case 'waterGarden':
      return 'farmWater'
    case 'work':
      return FIX_KNEELING_WORK_ROLES.has(role) ? 'fixKneeling' : 'interact'
    default: {
      const _exhaustive: never = actionKind
      return _exhaustive
    }
  }
}

/**
 * Resolve presentation animation intent from existing simulation state.
 * Combat/hurt/death one-shots are owned by `NpcAgent` and must not call this.
 *
 * Precedence: stationary busy action → run → bulky walkCarry → walk → idle/sleep.
 *
 * @domain npc
 */
export function resolveNpcAnimationIntent(input: ResolveNpcAnimationIntentInput): NpcAnimationIntent {
  const seated = input.seated === true
  // Stationary busy phases win over stale movement flags (notes precedence §2).
  const busy =
    (input.phase === 'execute' || input.phase === 'lookAtPlayer')
    && input.actionKind != null

  if (busy) {
    return intentForAction(input.actionKind!, input.role, seated)
  }

  if (input.moving && input.run) return 'run'
  if (input.moving && input.bulkyCargo) return 'walkCarry'
  if (input.moving) return 'walk'

  if (input.phase === 'sleep') return 'layToIdle'
  // goSleep steers to bed; locomotion clips apply while still moving above.

  if (seated) return 'sitIdle'
  return 'idle'
}

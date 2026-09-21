import type { Interactable } from '../../interaction/Interactable'
import type { RemovalPreview } from './placementActions'
import { hasItemCapability } from '../../items/itemCatalog'
import { ITEM_DEFS, type ItemKind } from '../../items/items'
import {
  isPlayerPlacedFire,
  isRemovablePlacedFireKind,
  type PlacedFireEntry,
} from '../../settlement/PlacedFires'
import { FIRE_PIT_STONE_COST } from '../userActions'
import { isActionBlocked, type PlayerActionContext } from './actionContext'

export type FireRemovalPreview = {
  id: string
  fireKind: 'simple' | 'pit'
  actionLabel: string
  confirmTitle: string
  body: string
  canReceive: boolean
  reasonLabel: string
  salvageCount: number
  hasBurned: boolean
  lit: boolean
  grate: boolean
}

const GRATE_BLOCK_REASON = 'Najpierw zdemontuj ruszt.'

function copyForKind(kind: 'simple' | 'pit'): { actionLabel: string, confirmTitle: string } {
  if (kind === 'simple') {
    return { actionLabel: 'Usuń ognisko', confirmTitle: 'Usuń ognisko' }
  }
  return { actionLabel: 'Rozbierz palenisko', confirmTitle: 'Rozbierz palenisko' }
}

function bodyForKind(kind: 'simple' | 'pit'): string {
  if (kind === 'simple') return 'Ognisko zostanie usunięte. Spalone gałęzie nie wrócą.'
  return `Rozbierzesz palenisko. Odzyskasz ${FIRE_PIT_STONE_COST}× ${ITEM_DEFS.stone.label}.`
}

export function isPlacedFireDismantleShortcut(
  source: Extract<Interactable, { kind: 'campfire' }>['source'],
  heldTool: ItemKind | null,
): boolean {
  return source.kind === 'placed'
    && isRemovablePlacedFireKind(source.fireKind)
    && hasItemCapability(heldTool, 'soil_digging')
}

function previewFromEntry(entry: PlacedFireEntry): FireRemovalPreview | null {
  if (!isPlayerPlacedFire(entry) || !isRemovablePlacedFireKind(entry.kind)) return null
  const copy = copyForKind(entry.kind)
  const grate = entry.grate === true
  return {
    id: entry.id,
    fireKind: entry.kind,
    actionLabel: copy.actionLabel,
    confirmTitle: copy.confirmTitle,
    body: bodyForKind(entry.kind),
    canReceive: !grate,
    reasonLabel: grate ? GRATE_BLOCK_REASON : '',
    salvageCount: entry.kind === 'pit' ? FIRE_PIT_STONE_COST : 0,
    hasBurned: entry.hasBurned === true,
    lit: entry.fire.isLit(),
    grate,
  }
}

export function fireRemovalToInspectionPreview(preview: FireRemovalPreview): RemovalPreview {
  return {
    recovered: preview.salvageCount > 0
      ? [{ kind: 'stone', count: preview.salvageCount }]
      : [],
    canReceive: preview.canReceive,
    reasonLabel: preview.reasonLabel,
    body: preview.body,
  }
}

export function createFireRemovalActions(ctx: PlayerActionContext) {
  const previewPlacedFireRemoval = (id: string): FireRemovalPreview | null => {
    const entry = ctx.bundle.placedFires.find(id)
    if (!entry) return null
    return previewFromEntry(entry)
  }

  const commitPlacedFireRemoval = (id: string): boolean => {
    if (isActionBlocked(ctx)) return false
    const entry = ctx.bundle.placedFires.find(id)
    if (!entry) return false
    const preview = previewFromEntry(entry)
    if (!preview || !preview.canReceive) return false
    const { fireKind, hasBurned, salvageCount } = preview
    const x = entry.x
    const z = entry.z
    if (!ctx.bundle.placedFires.remove(id)) return false
    if (salvageCount > 0) ctx.grantItem('stone', salvageCount)
    if (hasBurned) ctx.bundle.fireResidues.add(x, z, ctx.dayNight.elapsedDays)
    ctx.hud.setInventoryWeight(ctx.inventory.totalWeight(), ctx.inventory.maxWeight)
    ctx.onInventoryChanged()
    ctx.syncQuickActionAvailability()
    ctx.toast.show(fireKind === 'simple' ? 'Usunięto ognisko.' : 'Rozbrano palenisko.')
    return true
  }

  return { previewPlacedFireRemoval, commitPlacedFireRemoval }
}

export type FireRemovalActions = ReturnType<typeof createFireRemovalActions>

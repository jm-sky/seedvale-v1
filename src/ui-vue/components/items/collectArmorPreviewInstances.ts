import type { ArmorPreviewInstance } from '../../../items/equipmentPreview'
import type { EquipmentPositionKey } from '../../../items/equipmentTypes'
import type { InventoryGroupView } from '../../../items/inventoryView'
import type { EquipmentSlotView } from './equipmentPanelTypes'
import { armorPositionOf, EQUIPMENT_POSITIONS } from '../../../items/equipment'
import { isArmorCatalogKind } from '../../../items/itemCatalog'
import { itemDisplayName } from '../../../items/itemDisplay'
import { ARMOR_QUALITY_LABELS, normalizeArmorQuality } from '../../../items/itemInstances'

/** Flatten armor instance rows from inventory groups for loadout preview. */
export function collectArmorPreviewInstances(
  groups: readonly InventoryGroupView[],
): ArmorPreviewInstance[] {
  const out: ArmorPreviewInstance[] = []
  for (const group of groups) {
    if (!isArmorCatalogKind(group.kind)) continue
    for (const row of group.instances) {
      if (!row.quality) continue
      out.push({
        id: row.id,
        kind: group.kind,
        quality: normalizeArmorQuality(row.quality),
        label: itemDisplayName(group.kind),
      })
    }
  }
  return out
}

/** Build equipment panel rows for all 14 worn positions from equipped ids + armor instance list.
 * @domain ui-input
 */
export function buildEquipmentSlotViews(
  equippedSlots: Partial<Record<EquipmentPositionKey, string>>,
  instances: readonly ArmorPreviewInstance[],
): EquipmentSlotView[] {
  const byId = new Map(instances.map((row) => [row.id, row]))
  return EQUIPMENT_POSITIONS.map((position) => {
    const [slot, layer] = position.split(':') as [EquipmentSlotView['slot'], EquipmentSlotView['layer']]
    const instanceId = equippedSlots[position] ?? null
    const row = instanceId ? byId.get(instanceId) : undefined
    return {
      position,
      slot,
      layer,
      instanceId: row ? instanceId : null,
      label: row?.label ?? null,
      quality: row?.quality ?? null,
      qualityLabel: row ? qualityLabelFor(row) : null,
    }
  })
}

/** Positions that at least one owned, currently not worn armor piece could fill.
 * @domain ui-input
 */
export function positionsWithCandidates(
  equippedSlots: Partial<Record<EquipmentPositionKey, string>>,
  instances: readonly ArmorPreviewInstance[],
): Set<EquipmentPositionKey> {
  const worn = new Set(Object.values(equippedSlots))
  const out = new Set<EquipmentPositionKey>()
  for (const row of instances) {
    if (worn.has(row.id)) continue
    const position = armorPositionOf(row.kind)
    if (position) out.add(position)
  }
  return out
}

function qualityLabelFor(row: ArmorPreviewInstance): string | null {
  return ARMOR_QUALITY_LABELS[row.quality] ?? null
}

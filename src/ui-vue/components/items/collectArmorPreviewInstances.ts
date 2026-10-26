import type { ArmorPreviewInstance } from '../../../items/equipmentPreview'
import type { InventoryGroupView } from '../../../items/inventoryView'
import type { EquipmentSlotView } from './equipmentPanelTypes'
import { EQUIPMENT_SLOTS, type EquipmentSlot } from '../../../items/equipment'
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

/** Build equipment panel slot rows from equipped ids + armor instance list. */
export function buildEquipmentSlotViews(
  equippedSlots: Partial<Record<EquipmentSlot, string>>,
  instances: readonly ArmorPreviewInstance[],
): EquipmentSlotView[] {
  const byId = new Map(instances.map((row) => [row.id, row]))
  return EQUIPMENT_SLOTS.map((slot) => {
    const instanceId = equippedSlots[slot] ?? null
    const row = instanceId ? byId.get(instanceId) : undefined
    return {
      slot,
      instanceId,
      label: row?.label ?? null,
      qualityLabel: row ? qualityLabelFor(row) : null,
    }
  })
}

function qualityLabelFor(row: ArmorPreviewInstance): string | null {
  return ARMOR_QUALITY_LABELS[row.quality] ?? null
}

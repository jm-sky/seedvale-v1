<script setup lang="ts">
import { computed } from 'vue'
import { firstUpperCase } from '@/lib/firstUpperCase'
import type { LoadoutStatView } from '../../../items/equipmentPreview'
import type { EquipmentPositionKey } from '../../../items/equipmentTypes'
import type { PrimaryWeaponChoice } from '../../../items/primaryWeapons'
import type { EquipmentSlotView } from './equipmentPanelTypes'
import {
  type EquipmentSlot,
  isEquipmentSlot,
} from '../../../items/equipment'
import { ITEM_CATALOG } from '../../../items/itemCatalog'
import { ITEM_DEFS, type ItemKind } from '../../../items/items'
import AmmoSection from './AmmoSection.vue'
import { EQUIPMENT_LAYOUT, type EquipmentCellKey } from './equipmentLayout'
import EquipmentSlotCell from './EquipmentSlotCell.vue'
import LoadoutSummary from './LoadoutSummary.vue'

const props = defineProps<{
  slots: readonly EquipmentSlotView[]
  heldTool: ItemKind | null
  heldLabel: string | null
  heldInstanceId?: string | null
  primaryMelee: PrimaryWeaponChoice | null
  primaryRanged: PrimaryWeaponChoice | null
  primaryMeleeLabel: string | null
  primaryRangedLabel: string | null
  /** Current inventory selection — AmmoSection only when this kind is ranged. */
  selectedKind?: ItemKind | null
  /** Live inventory counts for AmmoSection. */
  counts: Partial<Record<string, number>>
  loadoutCurrent: LoadoutStatView
  loadoutDelta?: LoadoutStatView | null
  loadoutContext: string
  compareInstanceId?: string | null
  highlightSlot?: EquipmentSlot | null
}>()

const emit = defineEmits<{
  'select-slot': [slot: EquipmentSlot, instanceId: string]
  'select-held': []
  'select-primary-melee': []
  'select-primary-ranged': []
  'unequip-armor': [position: EquipmentPositionKey]
  unequip: []
}>()

const bySlot = computed(() => {
  const map = new Map<EquipmentSlot, EquipmentSlotView>()
  for (const row of props.slots) map.set(row.slot, row)
  return map
})

function cellLabel(key: EquipmentCellKey): string | null {
  if (key === 'held') return props.heldTool ? props.heldLabel ?? ITEM_DEFS[props.heldTool].label : null
  return isEquipmentSlot(key) ? bySlot.value.get(key)?.label ?? null : null
}

function selectCell(key: EquipmentCellKey): void {
  if (key === 'held') { emit('select-held'); return }
  if (!isEquipmentSlot(key)) return
  const id = bySlot.value.get(key)?.instanceId
  if (id) emit('select-slot', key, id)
}

function unequipCell(key: EquipmentCellKey): void {
  if (key === 'held') emit('unequip')
  else if (isEquipmentSlot(key)) {
    const position = bySlot.value.get(key)?.position
    if (position) emit('unequip-armor', position)
  }
}

function primaryLabel(choice: PrimaryWeaponChoice | null, fallback: string | null): string {
  if (fallback) return fallback
  if (!choice) return '—'
  return ITEM_DEFS[choice.kind]?.label ?? choice.kind
}

/** Ammo under Założone only while a ranged weapon/tool is selected (not armor/melee/etc.). */
const rangedAmmo = computed(() => {
  const kind = props.selectedKind ?? null
  if (!kind) return null
  const ranged = ITEM_CATALOG[kind]?.ranged
  if (!ranged || ranged.ammoKinds.length === 0) return null
  return {
    weaponLabel: ITEM_DEFS[kind]?.label ?? kind,
    ammoKinds: ranged.ammoKinds,
  }
})
</script>

<template>
  <section class="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
    <h2 class="mb-2 text-lg font-semibold text-neutral-100">
      Założone
    </h2>
    <div class="equipment-grid grid grid-cols-1 gap-2 text-sm">
      <EquipmentSlotCell
        v-for="cell in EQUIPMENT_LAYOUT"
        :key="cell.key"
        class="equipment-cell"
        :style="{ '--equipment-area': cell.area }"
        :label="cell.label"
        :item-label="cellLabel(cell.key)"
        :unavailable="cell.key === 'shield'"
        :highlighted="highlightSlot === cell.key"
        :compared="isEquipmentSlot(cell.key) && !!compareInstanceId && compareInstanceId === bySlot.get(cell.key)?.instanceId"
        @select="selectCell(cell.key)"
        @unequip="unequipCell(cell.key)"
      />
    </div>
    <div class="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
      <div class="min-w-0 border-b border-neutral-800 py-0.5">
        <span class="whitespace-nowrap text-xs text-neutral-500 uppercase">
          Podst. wręcz
        </span>
        <div class="flex min-w-0 items-center whitespace-nowrap">
          <button
            v-if="primaryMelee"
            type="button"
            class="min-w-0 truncate hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :title="firstUpperCase(primaryLabel(primaryMelee, primaryMeleeLabel))"
            @click="emit('select-primary-melee')"
          >
            {{ firstUpperCase(primaryLabel(primaryMelee, primaryMeleeLabel)) }}
          </button>
          <span
            v-else
            class="text-neutral-600"
          >—</span>
        </div>
      </div>

      <div class="min-w-0 border-b border-neutral-800 py-0.5">
        <span class="whitespace-nowrap text-xs text-neutral-500 uppercase">
          Podst. dystans
        </span>
        <div class="flex min-w-0 items-center whitespace-nowrap">
          <button
            v-if="primaryRanged"
            type="button"
            class="min-w-0 truncate hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :title="firstUpperCase(primaryLabel(primaryRanged, primaryRangedLabel))"
            @click="emit('select-primary-ranged')"
          >
            {{ firstUpperCase(primaryLabel(primaryRanged, primaryRangedLabel)) }}
          </button>
          <span
            v-else
            class="text-neutral-600"
          >—</span>
        </div>
      </div>
    </div>

    <AmmoSection
      v-if="rangedAmmo"
      :weapon-label="rangedAmmo.weaponLabel"
      :ammo-kinds="rangedAmmo.ammoKinds"
      :counts="counts"
    />

    <LoadoutSummary
      class="mt-3"
      :current="loadoutCurrent"
      :delta="loadoutDelta"
      :context="loadoutContext"
    />
  </section>
</template>


<style scoped>
@media (min-width: 640px) {
  .equipment-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-areas:
      ". head ."
      "shoulders torso weapon"
      "forearms legs shield"
      "hands feet .";
  }

  .equipment-cell {
    grid-area: var(--equipment-area);
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { firstUpperCase } from '@/lib/firstUpperCase'
import type { LoadoutStatView } from '../../../items/equipmentPreview'
import type { EquipmentPositionKey } from '../../../items/equipmentTypes'
import type { PrimaryWeaponChoice } from '../../../items/primaryWeapons'
import type { EquipmentCellRow, EquipmentSlotView } from './equipmentPanelTypes'
import { ITEM_CATALOG } from '../../../items/itemCatalog'
import { ITEM_DEFS, type ItemKind } from '../../../items/items'
import AmmoSection from './AmmoSection.vue'
import { buildArmorCellRows, EMPTY_ROW_TEXT, EQUIPMENT_LAYOUT, type EquipmentLayoutCell } from './equipmentLayout'
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
  /** Why the selected candidate cannot be previewed (stale/not armor); null when fine. */
  loadoutUnavailableReason?: string | null
  carriedWeightKg?: number | null
  carryCapacityKg?: number | null
  compareInstanceId?: string | null
  highlightPosition?: EquipmentPositionKey | null
  /** Positions an owned, not worn piece could fill (decides "—" vs "no compatible items"). */
  positionsWithCandidates?: ReadonlySet<EquipmentPositionKey>
}>()

const emit = defineEmits<{
  'select-slot': [position: EquipmentPositionKey, instanceId: string]
  'select-held': []
  'select-primary-melee': []
  'select-primary-ranged': []
  'unequip-armor': [position: EquipmentPositionKey]
  unequip: []
}>()

const NO_CANDIDATES: ReadonlySet<EquipmentPositionKey> = new Set()

function heldRow(): EquipmentCellRow {
  const label = props.heldTool ? props.heldLabel ?? ITEM_DEFS[props.heldTool].label : null
  return {
    position: null,
    layerLabel: null,
    state: label ? 'worn' : 'empty',
    itemLabel: label,
    qualityLabel: null,
    emptyText: EMPTY_ROW_TEXT,
    highlighted: false,
    compared: false,
  }
}

const shieldRow: EquipmentCellRow = {
  position: null,
  layerLabel: null,
  state: 'unavailable',
  itemLabel: null,
  qualityLabel: null,
  emptyText: 'N/A',
  highlighted: false,
  compared: false,
}

const cells = computed(() => EQUIPMENT_LAYOUT.map((cell: EquipmentLayoutCell) => ({
  cell,
  rows: cell.key === 'held'
    ? [heldRow()]
    : cell.key === 'shield'
      ? [shieldRow]
      : buildArmorCellRows(cell, {
          slots: props.slots,
          positionsWithCandidates: props.positionsWithCandidates ?? NO_CANDIDATES,
          highlightPosition: props.highlightPosition ?? null,
          compareInstanceId: props.compareInstanceId ?? null,
        }),
})))

const instanceIdAt = computed(() => new Map(props.slots.map((row) => [row.position, row.instanceId])))

function selectRow(row: EquipmentCellRow): void {
  if (!row.position) { emit('select-held'); return }
  const id = instanceIdAt.value.get(row.position)
  if (id) emit('select-slot', row.position, id)
}

function unequipRow(row: EquipmentCellRow): void {
  if (row.position) emit('unequip-armor', row.position)
  else emit('unequip')
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
        v-for="{ cell, rows } in cells"
        :key="cell.key"
        class="equipment-cell"
        :style="{ '--equipment-area': cell.area }"
        :label="cell.label"
        :rows="rows"
        @select="selectRow"
        @unequip="unequipRow"
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
      :unavailable-reason="loadoutUnavailableReason ?? null"
      :carried-weight-kg="carriedWeightKg ?? null"
      :carry-capacity-kg="carryCapacityKg ?? null"
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

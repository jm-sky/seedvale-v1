<script setup lang="ts">
import { computed } from 'vue'
import { firstUpperCase } from '@/lib/firstUpperCase'
import type { LoadoutStatView } from '../../../items/equipmentPreview'
import type { PrimaryWeaponChoice } from '../../../items/primaryWeapons'
import type { EquipmentSlotView } from './equipmentPanelTypes'
import {
  EQUIPMENT_SLOT_LABEL,
  EQUIPMENT_SLOTS,
  type EquipmentSlot,
} from '../../../items/equipment'
import { ITEM_CATALOG } from '../../../items/itemCatalog'
import { ITEM_DEFS, type ItemKind } from '../../../items/items'
import AmmoSection from './AmmoSection.vue'
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
}>()

const emit = defineEmits<{
  'select-slot': [slot: EquipmentSlot, instanceId: string]
  'select-held': []
  'select-primary-melee': []
  'select-primary-ranged': []
  'unequip-armor': [slot: EquipmentSlot]
  unequip: []
}>()

const slotOrder = EQUIPMENT_SLOTS

const bySlot = computed(() => {
  const map = new Map<EquipmentSlot, EquipmentSlotView>()
  for (const row of props.slots) map.set(row.slot, row)
  return map
})

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
    <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
      <div
        v-for="slot in slotOrder"
        :key="slot"
        class="min-w-0 border-b border-neutral-800 py-0.5"
      >
        <span class="inline-flex items-center gap-1 whitespace-nowrap text-xs text-neutral-500 uppercase">
          {{ EQUIPMENT_SLOT_LABEL[slot] }}
        </span>
        <div class="flex min-w-0 items-center gap-2.5 whitespace-nowrap">
          <template v-if="bySlot.get(slot)?.instanceId">
            <button
              type="button"
              class="min-w-0 truncate hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              :class="compareInstanceId === bySlot.get(slot)!.instanceId ? 'text-amber-200' : 'text-neutral-200'"
              :title="firstUpperCase(bySlot.get(slot)!.label!)"
              @click="emit('select-slot', slot, bySlot.get(slot)!.instanceId!)"
            >
              {{ firstUpperCase(bySlot.get(slot)!.label!) }}
            </button>
            <button
              type="button"
              class="shrink-0 text-xs text-neutral-500 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              :aria-label="`Zdejmij ${bySlot.get(slot)!.label}`"
              @click="emit('unequip-armor', slot)"
            >
              ✕
            </button>
          </template>
          <span
            v-else
            class="text-neutral-600"
          >—</span>
        </div>
      </div>

      <div class="min-w-0 border-b border-neutral-800 py-0.5">
        <span class="whitespace-nowrap text-xs text-neutral-500 uppercase">
          W ręce
        </span>
        <div class="flex min-w-0 items-center gap-2.5 whitespace-nowrap">
          <button
            v-if="heldTool"
            type="button"
            class="min-w-0 truncate hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            :title="firstUpperCase(heldLabel ?? ITEM_DEFS[heldTool].label)"
            @click="emit('select-held')"
          >
            {{ firstUpperCase(heldLabel ?? ITEM_DEFS[heldTool].label) }}
          </button>
          <span
            v-else
            class="text-neutral-600"
          >—</span>
          <button
            v-if="heldTool"
            type="button"
            class="shrink-0 text-xs text-neutral-500 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Odłóż z ręki"
            @click="emit('unequip')"
          >
            ✕
          </button>
        </div>
      </div>

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

      <div class="min-w-0 border-b border-neutral-800 py-0.5">
        <span class="whitespace-nowrap text-xs text-neutral-500 uppercase">
          Tarcza
        </span>
        <div class="text-neutral-600">
          N/A
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

<script setup lang="ts">
import { computed } from 'vue'
import type { LoadoutStatView } from '../../../items/equipmentPreview'
import type { PrimaryWeaponChoice } from '../../../items/primaryWeapons'
import type { EquipmentSlotView } from './equipmentPanelTypes'
import {
  EQUIPMENT_SLOT_LABEL,
  EQUIPMENT_SLOTS,
  type EquipmentSlot,
} from '../../../items/equipment'
import { ITEM_DEFS, type ItemKind } from '../../../items/items'
import LoadoutSummary from './LoadoutSummary.vue'
import QualityTag from './QualityTag.vue'

const props = defineProps<{
  slots: readonly EquipmentSlotView[]
  heldTool: ItemKind | null
  heldLabel: string | null
  primaryMelee: PrimaryWeaponChoice | null
  primaryRanged: PrimaryWeaponChoice | null
  primaryMeleeLabel: string | null
  primaryRangedLabel: string | null
  ammoLines: readonly string[]
  loadoutCurrent: LoadoutStatView
  loadoutDelta?: LoadoutStatView | null
  loadoutContext: string
  compareInstanceId?: string | null
}>()

const emit = defineEmits<{
  'select-slot': [slot: EquipmentSlot, instanceId: string]
  'unequip-armor': [slot: EquipmentSlot]
  'unequip-held': []
  'select-held': []
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
        class="border-b border-neutral-800 py-0.5"
      >
        <span class="inline-flex items-center gap-1 text-xs text-neutral-500 uppercase">
          {{ EQUIPMENT_SLOT_LABEL[slot] }}
        </span>
        <div class="flex flex-wrap items-center gap-1">
          <template v-if="bySlot.get(slot)?.instanceId">
            <button
              type="button"
              class="mr-1 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              :class="compareInstanceId === bySlot.get(slot)!.instanceId ? 'text-amber-200' : 'text-neutral-200'"
              @click="emit('select-slot', slot, bySlot.get(slot)!.instanceId!)"
            >
              {{ bySlot.get(slot)!.label }}
            </button>
            <QualityTag
              v-if="bySlot.get(slot)!.qualityLabel"
              :label="bySlot.get(slot)!.qualityLabel!"
            />
            <button
              type="button"
              class="text-xs text-neutral-500 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
        <!-- D4: future under/outer layer row keeps stable space -->
        <div class="mt-0.5 flex items-center gap-2 text-[10px] text-neutral-500">
          <span>Warstwa</span>
          <button
            type="button"
            disabled
            class="cursor-not-allowed opacity-5"
            aria-describedby="equipment-layer-reason"
          >
            under/outer
          </button>
        </div>
      </div>

      <div class="border-b border-neutral-800 py-0.5">
        <span class="text-xs text-neutral-500 uppercase">
          W ręce
        </span>
        <div class="flex flex-wrap items-center gap-1">
          <button
            v-if="heldTool"
            type="button"
            class="mr-1 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            @click="emit('select-held')"
          >
            {{ heldLabel ?? ITEM_DEFS[heldTool].label }}
          </button>
          <span
            v-else
            class="mr-1 text-neutral-600"
          >—</span>
          <button
            v-if="heldTool"
            type="button"
            class="text-xs text-neutral-500 hover:text-neutral-100"
            aria-label="Odłóż trzymany przedmiot"
            @click="emit('unequip-held')"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="border-b border-neutral-800 py-0.5">
        <span class="text-xs text-neutral-500 uppercase">
          Podst. wręcz
        </span>
        <div class="text-neutral-200">
          {{ primaryLabel(primaryMelee, primaryMeleeLabel) }}
        </div>
      </div>

      <div class="border-b border-neutral-800 py-0.5">
        <span class="text-xs text-neutral-500 uppercase">
          Podst. dystans
        </span>
        <div class="text-neutral-200">
          {{ primaryLabel(primaryRanged, primaryRangedLabel) }}
        </div>
      </div>

      <div class="border-b border-neutral-800 py-0.5">
        <span class="text-xs text-neutral-500 uppercase">
          Tarcza
        </span>
        <div class="flex items-center gap-2">
          <button
            type="button"
            disabled
            class="cursor-not-allowed opacity-5"
            aria-describedby="equipment-shield-reason"
          >
            Załóż
          </button>
          <span
            id="equipment-shield-reason"
            class="text-[10px] text-neutral-500"
          >niedostępne</span>
        </div>
      </div>
    </div>

    <p
      id="equipment-layer-reason"
      class="mt-1 text-[10px] text-neutral-500"
    >
      Warstwy zbroi — niedostępne (brak mechaniki).
    </p>

    <div
      v-if="ammoLines.length > 0"
      class="mt-2 text-xs text-neutral-400"
    >
      <div class="mb-0.5 text-neutral-500 uppercase">
        Amunicja
      </div>
      <ul>
        <li
          v-for="line in ammoLines"
          :key="line"
        >
          {{ line }}
        </li>
      </ul>
    </div>

    <LoadoutSummary
      class="mt-3"
      :current="loadoutCurrent"
      :delta="loadoutDelta"
      :context="loadoutContext"
    />
  </section>
</template>

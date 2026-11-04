<script setup lang="ts">
import { firstUpperCase } from '@/lib/firstUpperCase'
import type { EquipmentCellRow } from './equipmentPanelTypes'

/** One panel cell: anatomy label plus one row per layer (Spód / Wierzch) or a single held/shield row.
 * @domain ui-input */
defineProps<{
  label: string
  rows: readonly EquipmentCellRow[]
}>()
defineEmits<{ select: [row: EquipmentCellRow], unequip: [row: EquipmentCellRow] }>()
</script>

<template>
  <div
    class="min-w-0 rounded border border-neutral-800 p-2"
    role="group"
    :aria-label="label"
  >
    <span class="text-xs text-neutral-500 uppercase">{{ label }}</span>
    <div
      v-for="row in rows"
      :key="row.position ?? label"
      class="flex min-w-0 items-center gap-2 rounded px-1"
      :class="row.highlighted ? 'ring-2 ring-primary' : ''"
      :data-position="row.position ?? undefined"
    >
      <span
        v-if="row.layerLabel"
        class="w-14 shrink-0 text-[11px] text-neutral-500"
      >{{ row.layerLabel }}</span>
      <template v-if="row.state === 'worn' && row.itemLabel">
        <button
          type="button"
          class="min-w-0 truncate hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="row.compared ? 'text-amber-200' : 'text-neutral-200'"
          :title="firstUpperCase(row.itemLabel)"
          @click="$emit('select', row)"
        >
          {{ firstUpperCase(row.itemLabel) }}
        </button>
        <button
          type="button"
          class="shrink-0 text-xs text-neutral-500 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :aria-label="`Zdejmij ${row.itemLabel}${row.layerLabel ? ` (${row.layerLabel.toLowerCase()})` : ''}`"
          @click="$emit('unequip', row)"
        >
          ✕
        </button>
      </template>
      <span
        v-else
        class="min-w-0 truncate text-neutral-600"
        :class="row.state === 'unavailable' ? '' : 'text-sm'"
      >{{ row.state === 'unavailable' ? 'N/A' : row.emptyText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoadoutStatView } from '../../../items/equipmentPreview'
import { DAMAGE_CHANNEL_LABELS, DAMAGE_CHANNELS } from '../../../items/armorProtectionDisplay'
import { EQUIPMENT_SLOT_LABEL, EQUIPMENT_SLOTS } from '../../../items/equipment'

/** Expandable 7 x 3 table of local resistance per anatomical region (under + outer composed). Display only.
 * @domain ui-input */
defineProps<{
  current: LoadoutStatView
  delta?: LoadoutStatView | null
}>()

function percent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`
}

function deltaText(fraction: number): string {
  const rounded = Math.round(fraction * 100)
  if (rounded === 0) return ''
  return rounded > 0 ? `+${rounded}%` : `−${Math.abs(rounded)}%`
}
</script>

<template>
  <table
    class="w-full text-left text-sm tabular-nums"
    data-testid="protection-table"
  >
    <caption class="sr-only">
      Lokalna odporność pancerza w każdym regionie ciała (spód i wierzch razem)
    </caption>
    <thead>
      <tr class="text-xs text-neutral-500">
        <th scope="col">
          Region
        </th>
        <th
          v-for="channel in DAMAGE_CHANNELS"
          :key="channel"
          scope="col"
        >
          {{ DAMAGE_CHANNEL_LABELS[channel] }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="slot in EQUIPMENT_SLOTS"
        :key="slot"
        class="border-t border-neutral-800"
      >
        <th
          scope="row"
          class="py-0.5 font-normal text-neutral-400"
        >
          {{ EQUIPMENT_SLOT_LABEL[slot] }}
        </th>
        <td
          v-for="channel in DAMAGE_CHANNELS"
          :key="channel"
        >
          {{ percent(current.protection[slot][channel]) }}
          <span
            v-if="delta && deltaText(delta.protection[slot][channel])"
            class="ml-1 text-xs"
            :class="delta.protection[slot][channel] > 0 ? 'text-good' : 'text-warn'"
          >{{ deltaText(delta.protection[slot][channel]) }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

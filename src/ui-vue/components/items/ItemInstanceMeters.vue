<script setup lang="ts">
import QualityTag from './QualityTag.vue'
import StatBar from './StatBar.vue'
import { TONE_TEXT } from './meters'
import type { DetailMeterRow } from './buildItemDetailPresentation'

defineProps<{
  meters: DetailMeterRow[]
}>()
</script>

<template>
  <div
    v-if="meters.length > 0"
    class="flex flex-col gap-2 text-xs text-neutral-400"
  >
    <div
      v-for="(row, i) in meters"
      :key="`${row.label}-${i}`"
      class="grid grid-cols-[5.5rem_minmax(6rem,14rem)_auto] items-center gap-x-3 gap-y-1.5"
    >
      <span>{{ row.label }}</span>
      <template v-if="row.unavailable">
        <span class="col-span-2 text-neutral-500 italic">— niedostępne —</span>
      </template>
      <template v-else-if="row.ratio == null && row.title">
        <div class="col-span-2 justify-self-start">
          <QualityTag :label="row.title" />
        </div>
      </template>
      <template v-else-if="row.ratio != null">
        <StatBar
          :value="row.ratio"
          :tone="row.tone"
          :title="row.title"
        />
        <span
          class="tabular-nums"
          :class="TONE_TEXT[row.tone]"
        >{{ Math.round(row.ratio * 100) }}%</span>
      </template>
    </div>
  </div>
</template>

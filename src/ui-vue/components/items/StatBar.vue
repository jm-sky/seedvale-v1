<script setup lang="ts">
import { computed } from 'vue'
import { type MeterTone, TONE_BAR } from './meters'

/** Thin 0..1 meter matching V3 StatBar chrome (no Reka). */
const props = withDefaults(defineProps<{
  value: number
  tone?: MeterTone
  title?: string
}>(), { tone: 'neutral', title: undefined })

const percent = computed(() => {
  const raw = typeof props.value === 'number' && Number.isFinite(props.value) ? props.value : 0
  return Math.round(Math.min(1, Math.max(0, raw)) * 100)
})
</script>

<template>
  <span
    class="relative block h-1.5 w-full overflow-hidden rounded bg-neutral-800"
    role="meter"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="title ?? `${percent}%`"
    :title="title ?? `${percent}%`"
  >
    <span
      class="block h-full rounded"
      :class="TONE_BAR[tone]"
      :style="{ width: `${percent}%` }"
    />
  </span>
</template>

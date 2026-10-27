<script setup lang="ts">
import { computed } from 'vue'

/** Thin 1 px underline meter: dark track plus a bright fill (V3 StatUnderline). */
const props = defineProps<{
  value: number
  title?: string
}>()

const percent = computed(() => Math.round(Math.min(1, Math.max(0, props.value)) * 100))
</script>

<template>
  <span
    class="relative mt-0.5 block h-px w-full bg-neutral-800"
    role="meter"
    :aria-valuenow="percent"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="title ?? `${percent}%`"
    :title="title ?? `${percent}%`"
  >
    <span
      class="absolute inset-y-0 left-0 bg-neutral-400"
      :style="{ width: `${percent}%` }"
    />
  </span>
</template>

<script setup lang="ts">
/**
 * V3 ScaledValue look: bold value + dimmer `/ max`.
 * @domain ui
 */
defineProps<{
  value: string
  max: string
  size?: 'lg' | 'md'
}>()
</script>

<template>
  <span class="tabular-nums whitespace-nowrap">
    <span
      class="font-semibold text-neutral-50"
      :class="size === 'lg' ? 'text-3xl' : 'text-sm'"
    >{{ value }}</span>
    <span
      class="ml-1 text-neutral-50/60"
      :class="size === 'lg' ? 'text-base' : 'text-[11px]'"
    >/ {{ max }}</span>
  </span>
</template>

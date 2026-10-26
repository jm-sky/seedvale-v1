<script setup lang="ts">
/**
 * Uppercase section label for a Quick Actions category drill-in.
 * @domain ui
 */
defineProps<{
  label: string
}>()
</script>

<template>
  <div class="text-[11px] font-semibold uppercase tracking-wide text-neutral-300">
    {{ label }}
  </div>
</template>

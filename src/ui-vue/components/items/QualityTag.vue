<script setup lang="ts">
defineProps<{
  label: string
  /** Optional tone class (border/text); default neutral outline. */
  toneClass?: string
}>()
</script>

<template>
  <span
    class="rounded border px-1.5 py-0.5 text-xs capitalize"
    :class="toneClass ?? 'border-neutral-600 text-neutral-300'"
  >
    {{ label }}
  </span>
</template>

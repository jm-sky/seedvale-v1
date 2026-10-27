<script setup lang="ts">
/**
 * Stage F (ui-input-044): V3 rounded-full compact trade tab.
 * @domain ui
 */
defineProps<{
  label: string
  active: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    :aria-pressed="active"
    class="rounded-full border px-3 py-1 text-sm"
    :class="active
      ? 'border-neutral-200 bg-neutral-100 text-neutral-900'
      : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>

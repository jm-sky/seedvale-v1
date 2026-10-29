<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  disabled?: boolean
  iconComponent: Component
}>()

const emit = defineEmits<{
  click: []
}>()

function onClick(): void {
  if (props.disabled) return
  emit('click')
}
</script>

<template>
  <button
    type="button"
    class="pointer-events-auto flex size-6 cursor-pointer items-center justify-center rounded border border-neutral-600/80 bg-black/60 text-neutral-100 hover:bg-black/80 hover:border-neutral-500/80 disabled:cursor-default disabled:opacity-40"
    :disabled
    @click="onClick"
  >
    <component
      :is="iconComponent"
      :size="14"
    />
  </button>
</template>

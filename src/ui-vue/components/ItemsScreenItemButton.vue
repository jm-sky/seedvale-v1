<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  label: string
  selected?: boolean
  disabled?: boolean
  destructive?: boolean
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  'click': []
}>()
</script>

<template>
  <button
    type="button"
    :class="cn(
      // V3 inventory action density: compact outline / primary chips in the card footer.
      'cursor-pointer rounded border border-neutral-500 px-3 py-1 text-sm text-neutral-100 hover:border-neutral-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none',
      selected && 'border-primary/50 bg-neutral-100 font-medium text-neutral-900 hover:bg-white hover:border-neutral-200',
      disabled && 'opacity-5',
      destructive && 'hover:border-bad/80 hover:text-bad',
      props.class,
    )"
    :disabled="disabled"
    @click="emit('click')"
  >
    {{ label }}
  </button>
</template>

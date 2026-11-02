<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'ghost' | 'danger'
  class?: HTMLAttributes['class']
  disabled?: boolean
  type?: 'button' | 'submit'
}>(), {
  variant: 'ghost',
  type: 'button',
  disabled: false,
  class: undefined,
})

const variantClass = computed(() => {
  if (props.variant === 'primary') {
    return 'border-primary/40 bg-primary text-neutral-950 hover:bg-primary/80'
  }
  if (props.variant === 'danger') {
    return 'border-red-400/40 bg-transparent text-red-300 hover:bg-red-400/10'
  }
  return 'border-white/15 bg-transparent hover:bg-white/10'
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="cn(
      'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md border px-3.5 py-2.5 text-sm [-webkit-tap-highlight-color:transparent] disabled:cursor-not-allowed disabled:opacity-50',
      variantClass,
      props.class,
    )"
  >
    <slot />
  </button>
</template>

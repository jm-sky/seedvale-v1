<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'


const { as = 'button', href = undefined, variant = 'filled', danger = false } = defineProps<{
  active?: boolean
  label: string
  as?: 'a' | 'button'
  href?: string
  variant?: 'filled' | 'outline'
  danger?: boolean
}>()

const tag = computed(() => as || 'button')

const variants = {
  filled: {
    common: 'cursor-pointer rounded-full border px-3 py-1 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    base: 'border-neutral-600 bg-neutral-800/50 text-neutral-300 hover:border-amber-700 hover:bg-neutral-800/70',
    active: 'border-amber-500 bg-amber-500 text-neutral-950 hover:border-amber-500/80 hover:bg-amber-500/90',
  },
  outline: {
    common: 'cursor-pointer rounded-md border px-2.5 py-1 text-xs',
    base: 'border-neutral-600 hover:border-amber-700 hover:bg-neutral-800',
    active: 'border-amber-400/60 bg-amber-900/30',
  },
}

const variantClasses = computed(() => variants[variant])
</script>

<template>
  <component
    :is="tag"
    :class="cn(variantClasses.common, active ? variantClasses.active : variantClasses.base, danger ? 'border-rose-700/60 hover:bg-rose-900/40 hover:text-rose-100' : '')"
    :aria-current="active ? 'page' : undefined"
    :href="href"
  >
    {{ label }}
  </component>
</template>

<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  title: string
  class?: HTMLAttributes['class']
}>(), {
  class: undefined,
})
</script>

<template>
  <section :class="cn('rounded-lg border border-white/10 bg-black/20 p-3', props.class)">
    <h2 class="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
      {{ title }}
    </h2>
    <slot />
  </section>
</template>

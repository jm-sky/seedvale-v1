<script setup lang="ts">
import { firstUpperCase } from '@/lib/firstUpperCase'

defineProps<{
  label: string
  itemLabel: string | null
  highlighted?: boolean
  compared?: boolean
  unavailable?: boolean
}>()
defineEmits<{ select: [], unequip: [] }>()
</script>

<template>
  <div
    class="min-w-0 rounded border border-neutral-800 p-2"
    :class="highlighted ? 'ring-2 ring-primary' : ''"
  >
    <span class="text-xs text-neutral-500 uppercase">{{ label }}</span>
    <div class="flex min-w-0 items-center gap-2.5">
      <template v-if="itemLabel && !unavailable">
        <button
          type="button"
          class="min-w-0 truncate hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="compared ? 'text-amber-200' : 'text-neutral-200'"
          :title="firstUpperCase(itemLabel)"
          @click="$emit('select')"
        >
          {{ firstUpperCase(itemLabel) }}
        </button>
        <button
          type="button"
          class="shrink-0 text-xs text-neutral-500 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :aria-label="`Zdejmij ${itemLabel}`"
          @click="$emit('unequip')"
        >
          ✕
        </button>
      </template>
      <span
        v-else
        class="text-neutral-600"
      >{{ unavailable ? 'N/A' : '—' }}</span>
    </div>
  </div>
</template>

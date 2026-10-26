<script setup lang="ts">
/**
 * Quick Actions chip / action row (Stage C MenuPanel-like chrome).
 * Unavailable: native `disabled` + muted-but-readable chrome (author rejected
 * literal opacity-5 here — chip label vanished while adjacent reason stayed).
 * Optional `reason` renders adjacent outside the control.
 * @domain ui
 */
import { cn } from '@/lib/utils'
import type { Component, HTMLAttributes } from 'vue'

const props = defineProps<{
  label: string
  cost?: string
  icon?: Component
  class?: HTMLAttributes['class']
  disabled?: boolean
  /** Readable reason adjacent to a disabled control (not inside the button). */
  reason?: string
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <!--
    Size to content + wrap in parent flex-wrap. Do NOT use flex-1/min-w-0 here:
    that collapses every chip to the same narrow strip and stacks labels.
  -->
  <div class="inline-flex max-w-full shrink-0 flex-col gap-0.5">
    <button
      type="button"
      :disabled="disabled"
      :title="disabled && reason ? reason : undefined"
      :aria-description="disabled && reason ? reason : undefined"
      :class="cn(
        'group inline-flex w-auto max-w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-white/15 bg-neutral-800/60 px-3.5 py-2.5 text-left text-sm text-neutral-50 shadow-sm hover:border-white/25 hover:bg-neutral-700/70',
        'disabled:cursor-not-allowed disabled:border-dashed disabled:border-white/25 disabled:bg-neutral-950/40 disabled:text-neutral-300 disabled:shadow-none disabled:hover:border-white/25 disabled:hover:bg-neutral-950/40',
        props.class)"
      @click="emit('click')"
    >
      <span class="inline-flex items-center gap-2 whitespace-nowrap">
        <component
          :is="icon"
          v-if="icon"
          class="size-4 shrink-0 opacity-80"
        />
        {{ label }}
      </span>
      <div
        v-if="cost"
        class="shrink-0 truncate rounded-md bg-neutral-950/50 px-2 py-0.5 font-mono text-xs text-neutral-300 group-disabled:text-neutral-400"
      >
        {{ cost }}
      </div>
    </button>
    <p
      v-if="disabled && reason"
      class="max-w-56 px-1 text-xs text-neutral-400"
    >
      {{ reason }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * Stage E (ui-input-043): ToastStack presentation leaf (V3-like tone borders).
 * @domain ui
 */
export type HudToastTone = 'info' | 'pickup' | 'error'
export type HudToastRow = {
  readonly id: number | string
  readonly text: string
  readonly variant: HudToastTone
  readonly fading?: boolean
}

defineProps<{
  rows: readonly HudToastRow[]
}>()

const TONE_CLASS: Record<HudToastTone, string> = {
  info: 'border-white/30',
  pickup: 'border-good/60',
  error: 'border-bad/60',
}
</script>

<template>
  <div
    aria-live="polite"
    class="flex flex-col items-center gap-1"
    data-testid="hud-toast-stack"
  >
    <div
      v-for="row in rows"
      :key="row.id"
      class="max-w-[min(92vw,22rem)] whitespace-pre-line rounded border bg-neutral-900/80 px-3 py-1 text-center text-sm text-neutral-50 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-opacity duration-300 ease-in-out"
      :class="[TONE_CLASS[row.variant], row.fading ? 'opacity-0' : 'opacity-100']"
    >
      {{ row.text }}
    </div>
  </div>
</template>

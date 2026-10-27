<script setup lang="ts">
/**
 * Stage E (ui-input-043): bottom gaze / interaction prompt chrome.
 * Keeps V1 E/R/V slot labels via `slotInputKey` — presentation only.
 * @domain ui
 */
import { type InteractionGazePrompt, slotInputKey } from '../../interaction/interactionView'

defineProps<{
  interactionPrompt: InteractionGazePrompt | null
  /** Legacy single-line prompt when structured interactionPrompt is absent. */
  fallbackPrompt: string | null
  highlighted: boolean
  progress: number | null
}>()
</script>

<template>
  <div
    class="pointer-events-none rounded-md border border-neutral-500/40 bg-neutral-900/80 px-3.5 py-1.5 text-[13px] text-neutral-50 shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
    :class="highlighted ? 'ring-1 ring-primary/80 shadow-[0_0_10px_2px_oklch(0.78_0.12_75_/_0.45)]' : ''"
    data-testid="hud-gaze-chip"
  >
    <template v-if="interactionPrompt">
      <span v-if="interactionPrompt.targetLabel">
        {{ interactionPrompt.targetLabel }}
      </span>
      <template
        v-for="(action, index) in interactionPrompt.actions"
        :key="`${action.slot}-${action.label}`"
      >
        <span v-if="index > 0 || interactionPrompt.targetLabel"> · </span>
        <span
          :class="{
            'text-neutral-400': !action.enabled,
            'text-warn': action.enabled && action.consequenceTone === 'caution',
            'text-bad': action.enabled && action.consequenceTone === 'negative',
          }"
        >
          [{{ slotInputKey(action.slot) }}] {{ action.label }}
          <span
            v-if="action.reasonLabel"
            :class="action.enabled && action.consequenceTone === 'caution' ? 'text-warn' : 'text-bad'"
          > — {{ action.reasonLabel }}</span>
        </span>
      </template>
      <span v-if="interactionPrompt.cycleHint">{{ interactionPrompt.cycleHint }}</span>
    </template>
    <template v-else-if="fallbackPrompt">
      {{ fallbackPrompt.startsWith('[') ? fallbackPrompt : `[E] ${fallbackPrompt}` }}
    </template>
    <div
      v-if="progress !== null"
      class="mt-1.5 h-1 w-32 overflow-hidden rounded-full bg-white/20"
    >
      <div
        class="h-full bg-primary transition-[width] duration-75 ease-linear"
        :style="{ width: `${Math.round(progress * 100)}%` }"
      />
    </div>
  </div>
</template>

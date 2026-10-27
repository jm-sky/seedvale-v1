<script setup lang="ts">
/**
 * Stage E (ui-input-043): NeedsReadout-like bars for all five V1 HUD needs.
 * Presentation-only — ratios 0–1 from V1 producers.
 * @domain ui
 */
import { computed } from 'vue'

export type HudNeedBar = {
  readonly id: string
  readonly label: string
  readonly value: number
  readonly color: string
}

const props = defineProps<{
  bars: readonly HudNeedBar[]
}>()

const PENALTY_BELOW = 0.25

const rows = computed(() =>
  props.bars.map((bar) => {
    const percent = Math.round(Math.max(0, Math.min(1, bar.value)) * 100)
    return {
      ...bar,
      percent,
      low: bar.value < PENALTY_BELOW,
    }
  }),
)
</script>

<template>
  <div
    class="mt-1.5 flex w-48 flex-col gap-1.5 rounded-md bg-neutral-900/70 px-3 py-2 select-none sm:w-52"
    data-testid="hud-needs-readout"
  >
    <div
      v-for="row in rows"
      :key="row.id"
      class="flex items-center gap-2"
    >
      <span class="w-[4.5rem] shrink-0 text-[11px] leading-none text-neutral-100/85">{{ row.label }}</span>
      <div
        role="progressbar"
        :aria-label="row.label"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-valuenow="row.percent"
        :data-testid="`need-${row.id}`"
        class="h-2 flex-1 overflow-hidden rounded bg-white/15"
      >
        <div
          class="h-full transition-[width] duration-200"
          :class="row.low ? 'bg-bad' : ''"
          :style="row.low ? { width: `${row.percent}%` } : { width: `${row.percent}%`, background: row.color }"
        />
      </div>
    </div>
  </div>
</template>

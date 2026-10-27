<script setup lang="ts">
/**
 * Stage E (ui-input-043): weight / held / ammo / condition chip with solid chrome
 * so it stays readable on bright sky/terrain.
 * Two-row grid: primary = weight · held; secondary = fps / condition / ammo.
 * @domain ui
 */
import { computed } from 'vue'

const props = defineProps<{
  weight: string
  held: string
  heldAmmo: string
  playerCondition: string
  fps: string
  showFps: boolean
}>()

const primaryParts = computed(() => [props.weight, props.held].filter(Boolean))
const showFpsLine = computed(() => Boolean(props.showFps && props.fps))
const hasSecondary = computed(
  () => showFpsLine.value || Boolean(props.playerCondition) || Boolean(props.heldAmmo),
)
const visible = computed(() => primaryParts.value.length > 0 || hasSecondary.value)
</script>

<template>
  <div
    v-if="visible"
    class="mt-1.5 flex w-48 flex-col gap-1 rounded-md bg-neutral-900/70 px-3 py-2 text-[12px] leading-snug text-neutral-100/90 select-none sm:w-52"
    data-testid="hud-carry-status"
  >
    <div
      v-if="primaryParts.length"
      class="wrap-break-word"
    >
      <template
        v-for="(part, index) in primaryParts"
        :key="`${index}-${part}`"
      >
        <span
          v-if="index > 0"
          class="px-1"
        > · </span>
        <span>{{ part }}</span>
      </template>
    </div>
    <div
      v-if="showFpsLine"
      class="wrap-break-word"
    >
      {{ fps }}
    </div>
    <div
      v-if="playerCondition"
      class="wrap-break-word text-warn"
    >
      {{ playerCondition }}
    </div>
    <div
      v-if="heldAmmo"
      class="wrap-break-word"
    >
      {{ heldAmmo }}
    </div>
  </div>
</template>

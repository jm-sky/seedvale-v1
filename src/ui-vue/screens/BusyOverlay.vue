<script setup lang="ts">
/**
 * Stage E (ui-input-043): busy overlay — warm chrome; abort wiring unchanged.
 * @domain ui
 */
import { isTouchDevice } from '../../input/isTouchDevice'
import HudBottomPanel from '../components/HudBottomPanel.vue'
import { abortBusy, ui } from '../store'

const touchDevice = isTouchDevice()
</script>

<template>
  <div
    v-if="ui.busy.visible"
    class="sv-hud pointer-events-none fixed inset-0 z-[12] flex items-center justify-center"
  >
    <div
      v-if="ui.busy.blurred"
      class="pointer-events-none absolute inset-0 bg-black/10 backdrop-blur-[2px] backdrop-grayscale backdrop-brightness-90"
    />
    <HudBottomPanel>
      {{ ui.busy.label }}
      <div
        v-if="ui.busy.progress !== null"
        class="mt-1.5 h-1 w-40 overflow-hidden rounded-full bg-white/20"
      >
        <div
          class="h-full bg-primary transition-[width] duration-100 ease-linear"
          :style="{ width: `${Math.round(ui.busy.progress * 100)}%` }"
        />
      </div>
      <button
        type="button"
        class="pointer-events-auto mt-2 cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-800/55 px-3 py-1 text-[13px] hover:bg-neutral-700/65"
        @click="abortBusy"
      >
        {{ touchDevice ? 'Przerwij' : 'Esc — przerwij' }}
      </button>
    </HudBottomPanel>
  </div>
</template>

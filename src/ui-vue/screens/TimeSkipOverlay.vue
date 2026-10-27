<script setup lang="ts">
/**
 * Stage E (ui-input-043): time-skip overlay — warm chrome; cancel wiring unchanged.
 * @domain ui
 */
import HudBottomPanel from '../components/HudBottomPanel.vue'
import { abortRest, abortTerrainPreparation, finishTimeSkipHide, ui } from '../store'
</script>

<template>
  <div
    v-if="ui.timeSkip.visible"
    class="sv-hud pointer-events-none fixed inset-0 z-[12] flex items-center justify-center"
  >
    <div
      class="pointer-events-none absolute inset-0 bg-black/10 opacity-0 backdrop-blur-[2px] backdrop-grayscale backdrop-brightness-90 transition-opacity duration-400 ease-in-out"
      :style="{ opacity: ui.timeSkip.fadeVisible ? ui.timeSkip.fadeStrength : 0 }"
      @transitionend="finishTimeSkipHide"
    />
    <HudBottomPanel>
      <span>{{ ui.timeSkip.label }}</span>
      <button
        v-if="ui.timeSkip.canCancelRest"
        type="button"
        class="pointer-events-auto cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-800/55 px-3 py-1 text-[13px] hover:bg-neutral-700/65"
        @click="abortRest()"
      >
        Esc
      </button>
      <button
        v-if="ui.timeSkip.canCancelTerrainPreparation"
        type="button"
        class="pointer-events-auto cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-800/55 px-3 py-1 text-[13px] hover:bg-neutral-700/65"
        @click="abortTerrainPreparation()"
      >
        Anuluj [Esc]
      </button>
    </HudBottomPanel>
  </div>
</template>

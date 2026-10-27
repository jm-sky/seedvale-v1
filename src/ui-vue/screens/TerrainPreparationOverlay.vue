<script setup lang="ts">
/**
 * Stage E (ui-input-043): terrain prep overlay — warm chrome; controls unchanged.
 * @domain ui
 */
import { isTouchDevice } from '../../input/isTouchDevice'
import HudBottomPanel from '../components/HudBottomPanel.vue'
import {
  abortTerrainPreparation,
  confirmTerrainPreparation,
  growTerrainPreparation,
  lowerTerrainPreparation,
  raiseTerrainPreparation,
  shrinkTerrainPreparation,
  ui,
} from '../store'

const touchDevice = isTouchDevice()

const btnClass =
  'cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-800/55 px-2 text-[13px] leading-6 hover:bg-neutral-700/65 disabled:cursor-default disabled:border-neutral-600/35 disabled:bg-neutral-800/30 disabled:text-neutral-400'
const actionBtnClass =
  'cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-800/55 px-3 py-1 text-[13px] hover:bg-neutral-700/65 disabled:cursor-default disabled:border-neutral-600/35 disabled:bg-neutral-800/30 disabled:text-neutral-400'
</script>

<template>
  <div
    v-if="ui.terrainPreparationPreview.visible"
    class="sv-hud pointer-events-none fixed inset-x-0 bottom-24 z-[12] flex justify-center"
  >
    <HudBottomPanel interactive>
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1">
          Rozmiar: {{ ui.terrainPreparationPreview.sizeLabel }}
          <button
            type="button"
            :class="btnClass"
            aria-label="Zmniejsz rozmiar"
            @click="shrinkTerrainPreparation"
          >
            −
          </button>
          <button
            type="button"
            :class="btnClass"
            aria-label="Zwiększ rozmiar"
            @click="growTerrainPreparation"
          >
            +
          </button>
        </span>
        <span class="flex items-center gap-1">
          Wysokość: {{ ui.terrainPreparationPreview.heightLabel }}
          <button
            type="button"
            :class="btnClass"
            aria-label="Obniż"
            @click="lowerTerrainPreparation"
          >
            ,
          </button>
          <button
            type="button"
            :class="btnClass"
            aria-label="Podwyższ"
            @click="raiseTerrainPreparation"
          >
            .
          </button>
        </span>
      </div>
      <div
        v-if="!ui.terrainPreparationPreview.valid && ui.terrainPreparationPreview.reasonLabel"
        class="text-[13px] text-bad"
      >
        {{ ui.terrainPreparationPreview.reasonLabel }}
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          :class="actionBtnClass"
          :disabled="!ui.terrainPreparationPreview.valid"
          @click="confirmTerrainPreparation"
        >
          Zatwierdź [E]
        </button>
        <button
          type="button"
          :class="actionBtnClass"
          @click="abortTerrainPreparation"
        >
          Anuluj [Esc]
        </button>
      </div>
      <div
        v-if="!touchDevice"
        class="text-[12px] text-neutral-300/70"
      >
        [Scroll]/[+/-] rozmiar · [,/.] wysokość · [E] zatwierdź · [Esc] anuluj
      </div>
    </HudBottomPanel>
  </div>
</template>

<script setup lang="ts">
/**
 * Stage E (ui-input-043): placement overlay — warm chrome only; handlers unchanged.
 * @domain ui
 */
import { computed } from 'vue'
import { formatPlacementRequirement } from '../../app/actions/placementRequirementView'
import { isTouchDevice } from '../../input/isTouchDevice'
import HudBottomPanel from '../components/HudBottomPanel.vue'
import {
  abortPlacementPreview,
  confirmPlacementPreview,
  rotatePlacementPreviewLeft,
  rotatePlacementPreviewRight,
  togglePlacementPreviewRepeat,
  ui,
} from '../store'

const touchDevice = isTouchDevice()

const reasonClass = computed(() => {
  if (ui.placementPreview.state === 'invalid') return 'text-bad'
  if (ui.placementPreview.state === 'preparation') return 'text-warn'
  return 'text-good'
})

const btnClass =
  'cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-800/55 px-3 py-1 text-[13px] hover:bg-neutral-700/65 disabled:cursor-default disabled:border-neutral-600/35 disabled:bg-neutral-800/30 disabled:text-neutral-400'
</script>

<template>
  <div
    v-if="ui.placementPreview.visible"
    class="sv-hud pointer-events-none fixed inset-x-0 bottom-24 z-[12] flex justify-center"
  >
    <HudBottomPanel interactive>
      <div>{{ ui.placementPreview.label }}</div>
      <div
        v-if="ui.placementPreview.reasonLabel"
        class="text-[13px]"
        :class="reasonClass"
      >
        {{ ui.placementPreview.reasonLabel }}
      </div>
      <ul
        v-if="ui.placementPreview.requirements.length"
        class="list-none pl-0 text-[12px] text-neutral-200/90"
      >
        <li
          v-for="requirement in ui.placementPreview.requirements"
          :key="requirement.kind"
        >
          {{ formatPlacementRequirement(requirement) }}
        </li>
      </ul>
      <div
        v-if="ui.placementPreview.supportsRotation"
        class="flex items-center gap-2"
      >
        <button
          type="button"
          :class="btnClass"
          aria-label="Obróć w lewo"
          @click="rotatePlacementPreviewLeft"
        >
          ↶
          <span
            v-if="!touchDevice"
            class="text-[11px] text-neutral-300/70"
          >[F]</span>
        </button>
        <button
          type="button"
          :class="btnClass"
          aria-label="Obróć w prawo"
          @click="rotatePlacementPreviewRight"
        >
          <span
            v-if="!touchDevice"
            class="text-[11px] text-neutral-300/70"
          >[G]</span>
          ↷
        </button>
      </div>
      <label
        v-if="ui.placementPreview.supportsRepeat"
        class="flex items-center gap-2 text-[13px]"
      >
        <input
          type="checkbox"
          :checked="ui.placementPreview.repeatEnabled"
          @change="togglePlacementPreviewRepeat"
        >
        Postaw kolejny
      </label>
      <div class="flex items-center gap-2">
        <button
          type="button"
          :class="btnClass"
          :disabled="!ui.placementPreview.canConfirm"
          @click="confirmPlacementPreview"
        >
          {{ ui.placementPreview.confirmLabel }}
        </button>
        <button
          type="button"
          :class="btnClass"
          @click="abortPlacementPreview"
        >
          Anuluj [Esc]
        </button>
      </div>
    </HudBottomPanel>
  </div>
</template>

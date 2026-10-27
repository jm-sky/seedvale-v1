<script setup lang="ts">
/**
 * Stage E (ui-input-043): lodging walk cancel — warm chrome.
 * @domain ui
 */
import { abortRest, ui } from '../store'
</script>

<template>
  <div
    v-if="ui.lodgingWalk.active"
    class="sv-hud pointer-events-none fixed inset-x-0 bottom-24 z-[12] flex justify-center"
  >
    <button
      type="button"
      class="pointer-events-auto cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-900/80 px-3 py-1 text-[13px] text-neutral-50 shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:bg-neutral-800/80"
      @click="abortRest()"
    >
      Anuluj [Esc]
    </button>
  </div>
</template>

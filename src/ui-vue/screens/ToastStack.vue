<script setup lang="ts">
/**
 * Stage E (ui-input-043): live toast host — presentation via HudToastStack leaf.
 * @domain ui
 */
import HudToastStack from '../components/HudToastStack.vue'
import { ui } from '../store'
</script>

<template>
  <!-- Deliberately above every other stacking tier (modals z-20/11, busy/
       time-skip/terrain-prep z-[12], MerchantScreen's compact drawer z-20)
       so a transient toast is never hidden behind whatever overlay happens
       to be open — plan ui-input-002 §4. Non-modal: not in `openStack`. -->
  <div
    class="sv-hud pointer-events-none fixed left-1/2 z-50 flex -translate-x-1/2 flex-col items-center"
    style="top: max(16px, env(safe-area-inset-top))"
  >
    <HudToastStack :rows="ui.toast.items" />
  </div>
</template>

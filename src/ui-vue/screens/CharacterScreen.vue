<script setup lang="ts">
import CharacterPanel from '../components/CharacterPanel.vue'
import { useOverlayScreen } from '../composables/useOverlayScreen'
import { closeCharacterScreen, isCharacterScreenOpen, ui } from '../store'

useOverlayScreen('character', isCharacterScreenOpen, closeCharacterScreen)

function onSelectSettlement(settlementId: string): void {
  ui.characterScreen.onSelectSettlement?.(settlementId)
}
</script>

<template>
  <div
    v-if="ui.characterScreen.open"
    class="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center bg-panel-backdrop p-4 backdrop-blur-[2px]"
    @click.self="closeCharacterScreen"
  >
    <CharacterPanel
      :hp="ui.characterScreen.hp"
      :stamina="ui.characterScreen.stamina"
      :vigor="ui.characterScreen.vigor"
      :hunger="ui.characterScreen.hunger"
      :thirst="ui.characterScreen.thirst"
      :presentation="ui.characterScreen.presentation"
      :reputation="ui.characterScreen.reputation"
      :badges="ui.characterScreen.badges"
      @close="closeCharacterScreen"
      @select-settlement="onSelectSettlement"
    />
  </div>
</template>

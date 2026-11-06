<script setup lang="ts">
import { ref, watch } from 'vue'
import UiButton from '@/components/UiButton.vue'
import UiPanel from '@/components/UiPanel.vue'
import { useOverlayScreen } from '../composables/useOverlayScreen'
import { useTouchScroll } from '../composables/useTouchScroll'
import { closePauseMenu, emitUiClick, isPauseMenuOpen, ui } from '../store'
import PauseMenuEntriesActions from './PauseMenuEntriesActions.vue'
import PauseMenuEntriesMain from './PauseMenuEntriesMain.vue'
import PauseMenuEntriesSaves from './PauseMenuEntriesSaves.vue'
import PauseMenuEntriesSettings from './PauseMenuEntriesSettings.vue'
import PauseMenuEntriesTools from './PauseMenuEntriesTools.vue'

const panel = ref<HTMLElement | null>(null)
const name = ref(ui.pauseMenu.playerName)
const currentScreen = ref<'main' | 'actions' | 'settings' | 'tools' | 'saves' | 'management'>('main')
const savesMode = ref<'save-as' | 'load' | 'new-game'>('load')

useOverlayScreen('pause-menu', isPauseMenuOpen, closePauseMenu)
useTouchScroll(panel)
watch(() => ui.pauseMenu.playerName, (value) => { name.value = value })
watch(() => ui.pauseMenu.open, (open) => {
  if (!open) currentScreen.value = 'main'
})
</script>

<template>
  <div
    v-if="ui.pauseMenu.open"
    class="pointer-events-auto fixed inset-0 z-11 flex items-center justify-center bg-panel-backdrop backdrop-blur-[2px]"
    data-test-id="pause-menu"
    @click.self="closePauseMenu"
  >
    <PauseMenuEntriesMain
      v-if="currentScreen === 'main'"
      @open-actions="currentScreen = 'actions'"
      @open-settings="currentScreen = 'settings'"
      @open-tools="currentScreen = 'tools'"
      @open-save-as="savesMode = 'save-as'; currentScreen = 'saves'"
      @open-management="currentScreen = 'management'"
    />
    <UiPanel v-if="currentScreen === 'management'">
      <UiButton
        class="mb-3 w-full"
        @click="emitUiClick(); currentScreen = 'main'"
      >
        Wróć
      </UiButton>
      <h2 class="mb-3 text-sm font-semibold text-primary">
        Zarządzanie grą
      </h2>
      <UiButton
        class="mb-2 w-full"
        @click="emitUiClick(); savesMode = 'load'; currentScreen = 'saves'"
      >
        Wczytaj
      </UiButton>
      <UiButton
        variant="danger"
        class="w-full"
        @click="emitUiClick(); savesMode = 'new-game'; currentScreen = 'saves'"
      >
        Nowa gra
      </UiButton>
    </UiPanel>
    <PauseMenuEntriesActions
      v-if="currentScreen === 'actions'"
      @close-actions="currentScreen = 'main'"
    />
    <PauseMenuEntriesSettings
      v-if="currentScreen === 'settings'"
      @close-settings="currentScreen = 'main'"
    />
    <PauseMenuEntriesTools
      v-if="currentScreen === 'tools'"
      @close-tools="currentScreen = 'main'"
    />
    <PauseMenuEntriesSaves
      v-if="currentScreen === 'saves'"
      :mode="savesMode"
      @close-saves="currentScreen = savesMode === 'save-as' ? 'main' : 'management'"
    />
  </div>
</template>

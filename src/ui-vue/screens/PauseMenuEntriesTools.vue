<script setup lang="ts">
import UiButton from '@/components/UiButton.vue'
import UiPanel from '@/components/UiPanel.vue'
import { TOOLS } from '../../tools/toolRegistry'
import { closePauseMenu, emitUiClick, ui } from '../store'

const emit = defineEmits<{
  (e: 'close-tools'): void
}>()

function openTool(path: string): void {
  emitUiClick()
  window.location.href = path
}
</script>

<template>
  <UiPanel>
    <UiButton
      class="mb-2 w-full"
      @click="emit('close-tools')"
    >
      Wróć
    </UiButton>

    <h2 class="mb-3 text-sm font-semibold text-primary">
      Narzędzia deweloperskie
    </h2>
    <UiButton
      class="mb-2 w-full"
      @click="closePauseMenu(); ui.pauseMenu.onVillagers?.()"
    >
      Mieszkańcy
    </UiButton>
    <UiButton
      class="mb-2 w-full"
      @click="ui.pauseMenu.onToggleGui?.()"
    >
      Panel debug
    </UiButton>
    <UiButton
      class="mb-3 w-full"
      @click="emitUiClick(); ui.pauseMenu.onRefresh?.()"
    >
      Odśwież stronę
    </UiButton>
    <div class="mb-3 border-t border-primary/20" />
    <UiButton
      v-for="tool in TOOLS"
      :key="tool.id"
      class="mb-2 w-full"
      @click="openTool(tool.path)"
    >
      {{ tool.label }}
      <span
        v-if="tool.description"
        class="ml-2 text-xs opacity-60"
      >{{ tool.description }}</span>
    </UiButton>
  </UiPanel>
</template>

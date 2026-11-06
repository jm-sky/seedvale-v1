<script setup lang="ts">
import { ref } from 'vue'
import UiButton from '@/components/UiButton.vue'
import UiPanel from '@/components/UiPanel.vue'
import { isTouchDevice } from '../../input/isTouchDevice'
import { closePauseMenu, emitUiClick, openSkillsScreen, setPauseSaveStatus, showToast, ui } from '../store'

const saveTimer = ref<number | null>(null)
const appVersion = __APP_VERSION__
const gitCommit = __GIT_COMMIT__
const buildDate = __BUILD_DATE__

const emit = defineEmits<{
  'open-actions': []
  'open-settings': []
  'open-tools': []
  'open-save-as': []
  'open-management': []
}>()

async function save(): Promise<void> {
  emitUiClick()
  const result = await ui.pauseMenu.onSave?.()
  // A rejected write (plan persistence-004 §6) must not claim success — the
  // old code showed "Zapisano" unconditionally regardless of the outcome.
  if (result && !result.ok) {
    showToast('Nie udało się zapisać gry.', 'error')
    return
  }
  const label = ui.pauseMenu.activeSaveName ? `Zapisano · ${ui.pauseMenu.activeSaveName}` : 'Zapisano'
  setPauseSaveStatus(label)
  if (saveTimer.value !== null) window.clearTimeout(saveTimer.value)
  saveTimer.value = window.setTimeout(() => setPauseSaveStatus(''), 1500)
}
function openQuestLog(): void { emitUiClick(); closePauseMenu(); ui.pauseMenu.onQuestLog?.() }
function openInventory(): void { emitUiClick(); closePauseMenu(); ui.pauseMenu.onInventory?.() }
function openCharacter(): void { emitUiClick(); closePauseMenu(); ui.pauseMenu.onCharacter?.() }
function openSkills(): void { emitUiClick(); closePauseMenu(); openSkillsScreen() }
function openMap(): void { emitUiClick(); closePauseMenu(); ui.pauseMenu.onWorldMap?.() }
function resume(): void { emitUiClick(); closePauseMenu() }
function openActions(): void { emitUiClick(); emit('open-actions') }
function openSettings(): void { emitUiClick(); emit('open-settings') }
function openTools(): void { emitUiClick(); emit('open-tools') }
</script>

<template>
  <UiPanel class="mx-4 border border-primary/25 p-4">
    <div class="mb-3 flex justify-between text-xs opacity-70">
      <span>Seed</span><span>{{ ui.pauseMenu.seed }}</span>
    </div>
    <section
      aria-label="Gra i zapis"
      class="grid grid-cols-2 gap-2"
    >
      <UiButton
        variant="primary"
        class="col-span-2 w-full font-semibold"
        @click="resume"
      >
        Wznów
      </UiButton>
      <UiButton
        class="min-w-0 flex-col"
        @click="save"
      >
        Zapisz
        <span
          v-if="ui.pauseMenu.saveStatus || ui.pauseMenu.activeSaveName"
          role="status"
          class="w-full truncate text-xs opacity-75"
          :title="ui.pauseMenu.saveStatus || ui.pauseMenu.activeSaveName"
        >{{ ui.pauseMenu.saveStatus || ui.pauseMenu.activeSaveName }}</span>
      </UiButton>
      <UiButton @click="emitUiClick(); emit('open-save-as')">
        Zapisz jako…
      </UiButton>
    </section>
    <nav
      aria-label="Postać i świat"
      class="my-3 grid grid-cols-2 gap-2 border-y border-primary/20 py-3"
    >
      <UiButton
        class="px-2"
        @click="openCharacter"
      >
        Postać [C]
      </UiButton>
      <UiButton
        class="px-2"
        @click="openSkills"
      >
        Umiejętności [U]
      </UiButton>
      <UiButton
        class="px-2"
        @click="openInventory"
      >
        Ekwipunek [I]
      </UiButton>
      <UiButton
        class="px-2"
        @click="openQuestLog"
      >
        Zadania [L]
      </UiButton>
      <UiButton
        class="col-span-2"
        @click="openMap"
      >
        Mapa [M]
      </UiButton>
    </nav>
    <nav
      aria-label="Menu pauzy"
      class="grid gap-2"
    >
      <UiButton
        class="justify-between"
        @click="openActions"
      >
        Akcje <span aria-hidden="true">›</span>
      </UiButton>
      <UiButton
        class="justify-between"
        @click="emitUiClick(); emit('open-management')"
      >
        Zarządzanie grą <span aria-hidden="true">›</span>
      </UiButton>
      <UiButton
        class="justify-between"
        @click="openSettings"
      >
        Ustawienia <span aria-hidden="true">›</span>
      </UiButton>
      <UiButton
        class="justify-between"
        @click="openTools"
      >
        Narzędzia deweloperskie <span aria-hidden="true">›</span>
      </UiButton>
    </nav>
    <div class="mt-3 border-t border-white/10 pt-2 text-center font-mono text-[10px] opacity-40">
      v{{ appVersion }} | {{ gitCommit }} | {{ buildDate }}
    </div>
    <div class="mt-1 text-center text-[11px] opacity-60">
      {{ isTouchDevice() ? 'Joystick — ruch · przeciągnij ekran — rozglądanie · dotknij poza oknem — zamknij' : 'WASD — ruch · mysz (klik) — rozglądanie · Esc — pauza' }}
    </div>
  </UiPanel>
</template>

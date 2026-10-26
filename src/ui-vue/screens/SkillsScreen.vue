<script setup lang="ts">
import { computed } from 'vue'
import type { SkillId } from '../../player/PlayerSkills'
import { listActionablePlayerSkills } from '../../interaction/targetedSkillAction'
import SkillsActionCards from '../components/SkillsActionCards.vue'
import { useOverlayScreen } from '../composables/useOverlayScreen'
import {
  closeSkillsScreen,
  emitUiClick,
  getSkillValue,
  getSkillXp,
  isSkillsScreenOpen,
  ui,
} from '../store'

useOverlayScreen('skills', isSkillsScreenOpen, closeSkillsScreen)

const skillRows = computed(() =>
  listActionablePlayerSkills().map((id) => ({
    id,
    value: getSkillValue(id),
    xp: getSkillXp(id),
  })),
)

function toggleSneak(): void {
  emitUiClick()
  ui.skillsScreen.onToggleSneak?.()
}

function selectTargeted(id: SkillId): void {
  emitUiClick()
  ui.skillsScreen.onSelectTargetedSkill?.(id)
  closeSkillsScreen()
}
</script>

<template>
  <div
    v-if="ui.skillsScreen.open"
    class="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center bg-panel-backdrop p-4 backdrop-blur-[2px]"
    @click.self="closeSkillsScreen"
  >
    <SkillsActionCards
      :skills="skillRows"
      :sneak-active="ui.skillsScreen.sneakActive"
      :selected-skill="ui.skillsScreen.selectedSkill"
      @close="closeSkillsScreen"
      @toggle-sneak="toggleSneak"
      @select-targeted="selectTargeted"
    />
  </div>
</template>

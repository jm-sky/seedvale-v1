<script setup lang="ts">
/**
 * Stage D D9 demo — same CharacterPanel / SkillsActionCards leaves as live screens.
 * Fixtures and callbacks are demo-local only (no world / save / WorldBundle).
 * @domain ui
 */
import { computed, ref } from 'vue'
import type { SkillId } from '../../../player/PlayerSkills'
import type { CharacterReputationView } from '../../store'
import CharacterPanel from '../../components/CharacterPanel.vue'
import SkillsActionCards from '../../components/SkillsActionCards.vue'
import DemoShell from '../DemoShell.vue'
import {
  characterCriticalFixture,
  characterHealthyFixture,
  DEMO_SCENARIOS,
  type DemoViewId,
  skillsFixture,
} from './fixtures'

const selectedId = ref<DemoViewId>('character-critical')
const log = ref<string[]>([])

const localSneak = ref(false)
const localSelected = ref<SkillId | null>(null)
const localSettlementId = ref<string | null>('s1')

const scenario = computed(() => DEMO_SCENARIOS.find((s) => s.id === selectedId.value) ?? DEMO_SCENARIOS[0])

const characterData = computed(() => {
  const base = selectedId.value === 'character-healthy'
    ? characterHealthyFixture()
    : characterCriticalFixture()
  const option = base.reputation.settlements.find((s) => s.settlementId === localSettlementId.value)
  const standing = base.reputation.selected
  const reputation: CharacterReputationView = {
    settlements: base.reputation.settlements,
    selectedSettlementId: localSettlementId.value,
    selected: option && standing
      ? {
          ...standing,
          settlementId: option.settlementId,
          settlementName: option.settlementName,
          settlementBadges: option.settlementId === 's1' ? standing.settlementBadges : [],
          renown: option.settlementId === 's1' ? standing.renown : 4,
        }
      : null,
  }
  return { ...base, reputation }
})

const skillsData = computed(() => {
  const mode = selectedId.value === 'skills-sneak-on' ? 'on' : 'off'
  const base = skillsFixture(mode)
  return {
    skills: base.skills,
    sneakActive: localSneak.value,
    selectedSkill: localSelected.value,
  }
})

function selectScenario(id: DemoViewId): void {
  selectedId.value = id
  log.value = []
  const skills = skillsFixture(id === 'skills-sneak-on' ? 'on' : 'off')
  localSneak.value = skills.sneakActive
  localSelected.value = skills.selectedSkill
  if (id.startsWith('character')) localSettlementId.value = 's1'
}

function resetDemo(): void {
  selectScenario('character-critical')
}

function pushLog(message: string): void {
  log.value = [`[demo] ${message}`, ...log.value].slice(0, 8)
}

function onSelectSettlement(settlementId: string): void {
  localSettlementId.value = settlementId
  pushLog(`Settlement → ${settlementId} (demo-local only)`)
}

function onToggleSneak(): void {
  localSneak.value = !localSneak.value
  pushLog(`Sneak → ${localSneak.value ? 'on' : 'off'} (demo-local only)`)
}

function onSelectTargeted(id: SkillId): void {
  localSelected.value = id
  pushLog(`Targeted skill → ${id} (demo-local only; would close live screen)`)
}
</script>

<template>
  <DemoShell
    current="character"
    title="Character (demo)"
  >
    <details class="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 text-sm">
      <summary class="cursor-pointer text-neutral-400 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        Demo controls
      </summary>
      <div class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="s in DEMO_SCENARIOS"
          :key="s.id"
          type="button"
          class="rounded-md border px-2.5 py-1 text-xs"
          :class="s.id === selectedId ? 'border-amber-400/60 bg-amber-900/30' : 'border-neutral-600 hover:bg-neutral-800'"
          @click="selectScenario(s.id)"
        >
          {{ s.label }}
        </button>
        <button
          type="button"
          class="rounded-md border border-neutral-600 px-2.5 py-1 text-xs hover:bg-neutral-800"
          @click="resetDemo"
        >
          Reset
        </button>
      </div>
      <ul
        v-if="log.length"
        class="mt-3 space-y-1 font-mono text-xs text-neutral-500"
      >
        <li
          v-for="(line, i) in log"
          :key="i"
        >
          {{ line }}
        </li>
      </ul>
    </details>

    <div class="flex w-full justify-center">
      <CharacterPanel
        v-if="scenario.kind === 'character'"
        :hp="characterData.hp"
        :stamina="characterData.stamina"
        :vigor="characterData.vigor"
        :hunger="characterData.hunger"
        :thirst="characterData.thirst"
        :presentation="characterData.presentation"
        :reputation="characterData.reputation"
        :badges="characterData.badges"
        :show-close="false"
        @select-settlement="onSelectSettlement"
      />
      <SkillsActionCards
        v-else
        :skills="skillsData.skills"
        :sneak-active="skillsData.sneakActive"
        :selected-skill="skillsData.selectedSkill"
        :show-close="false"
        @toggle-sneak="onToggleSneak"
        @select-targeted="onSelectTargeted"
      />
    </div>
  </DemoShell>
</template>

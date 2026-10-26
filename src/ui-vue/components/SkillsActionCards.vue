<script setup lang="ts">
/**
 * Stage D Skills [U] — actionable sneak + targeted, V3 skill-row chrome.
 * @domain ui
 */
import { X } from 'lucide-vue-next'
import { computed } from 'vue'
import { listActionablePlayerSkills } from '../../interaction/targetedSkillAction'
import { SKILL_LABEL, SKILL_USE, type SkillId } from '../../player/PlayerSkills'

const props = defineProps<{
  skills: readonly { id: SkillId, value: number, xp: number }[]
  sneakActive: boolean
  selectedSkill: SkillId | null
  showClose?: boolean
}>()

const emit = defineEmits<{
  close: []
  toggleSneak: []
  selectTargeted: [id: SkillId]
}>()

const SKILL_DISPLAY_MAX = 100

type SkillAccent = {
  bar: string
  selectedBorder: string
  selectedBg: string
  bullets: readonly string[]
  description?: string
}

const SKILL_ACCENT: Record<SkillId, SkillAccent> = {
  sneak: {
    bar: 'bg-emerald-400/80',
    selectedBorder: 'border-emerald-400/50 bg-emerald-400/15',
    selectedBg: 'bg-emerald-400 text-neutral-950',
    bullets: [],
    description: 'Wolniejszy ruch, trudniej Cię zauważyć zwierzętom. Rozwija się, gdy faktycznie się skradasz.',
  },
  survival: {
    bar: 'bg-amber-400/80',
    selectedBorder: '',
    selectedBg: '',
    bullets: [
      'Szybsze rozpalanie ogniska',
      'Szybsze rozstawianie namiotu',
      'Lepszy odpoczynek na samym kocu',
      'Bardziej sycące pieczone mięso',
    ],
  },
  traps: {
    bar: 'bg-sky-400/80',
    selectedBorder: 'border-sky-400/50 bg-sky-400/15',
    selectedBg: 'bg-sky-400 text-neutral-950',
    bullets: [
      'Zwierzęta rzadziej wypatrują zastawionej pułapki',
      'Poziom liczy się w chwili uzbrojenia pułapki',
      'Użyj na pułapce, aby ją sprawdzić',
    ],
  },
  defense: {
    bar: 'bg-rose-400/80',
    selectedBorder: '',
    selectedBg: '',
    bullets: [
      'Lepsza szansa na blok trzymanym przedmiotem',
      'Skuteczniejsza częściowa redukcja obrażeń',
    ],
  },
  archery: {
    bar: 'bg-lime-400/80',
    selectedBorder: '',
    selectedBg: '',
    bullets: ['Celniejsze strzały z łuku'],
  },
  riding: {
    bar: 'bg-violet-400/80',
    selectedBorder: '',
    selectedBg: '',
    bullets: [
      'Mniejsze ryzyko upadku z wierzchowca',
      'Mniejsze obrażenia przy upadku',
    ],
  },
  medicine: {
    bar: 'bg-teal-400/80',
    selectedBorder: 'border-teal-400/50 bg-teal-400/15',
    selectedBg: 'bg-teal-400 text-neutral-950',
    bullets: ['Leczenie ran i dolegliwości'],
  },
  repair: {
    bar: 'bg-orange-400/80',
    selectedBorder: 'border-orange-400/50 bg-orange-400/15',
    selectedBg: 'bg-orange-400 text-neutral-950',
    bullets: ['Naprawa narzędzi, pułapek i konstrukcji'],
  },
}

const actionableOrder = listActionablePlayerSkills()

const cards = computed(() => {
  const byId = new Map(props.skills.map((s) => [s.id, s]))
  return actionableOrder.flatMap((id) => {
    const row = byId.get(id)
    if (!row) return []
    const display = Math.round(row.value * 100)
    return [{
      id,
      use: SKILL_USE[id],
      label: SKILL_LABEL[id],
      display,
      share: Math.max(0, Math.min(1, display / SKILL_DISPLAY_MAX)),
      xp: Math.round(row.xp),
      accent: SKILL_ACCENT[id],
      sneakActive: id === 'sneak' && props.sneakActive,
      selected: props.selectedSkill === id,
    }]
  })
})

function onCardClick(id: SkillId, use: string): void {
  if (use === 'stance') emit('toggleSneak')
  else emit('selectTargeted', id)
}
</script>

<template>
  <div class="sv-skills flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/15 bg-(--surface-solid) text-neutral-50 shadow-2xl">
    <div class="flex items-center justify-between border-b border-white/15 px-4 py-2.5">
      <h1 class="text-lg font-semibold tracking-wide text-primary">
        Umiejętności
      </h1>
      <button
        v-if="showClose !== false"
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-md border border-white/15 bg-neutral-800/50 text-neutral-300 hover:bg-neutral-700/60"
        aria-label="Zamknij"
        @click="emit('close')"
      >
        <X class="size-4" />
      </button>
    </div>

    <div class="flex max-h-[min(36rem,calc(100dvh-8rem))] flex-col gap-2 overflow-y-auto p-4">
      <p class="px-1 text-xs text-neutral-400">
        Akcje celowane i skradanie — pełna lista umiejętności jest w Postać → Atrybuty i umiejętności.
      </p>
      <button
        v-for="card in cards"
        :key="card.id"
        type="button"
        class="w-full cursor-pointer rounded-lg border px-3 py-2.5 text-left transition-colors"
        :class="card.use === 'stance'
          ? (card.sneakActive ? card.accent.selectedBorder : 'border-white/15 bg-transparent hover:bg-white/5')
          : (card.selected ? card.accent.selectedBorder : 'border-white/15 bg-transparent hover:bg-white/5')"
        @click="onCardClick(card.id, card.use)"
      >
        <span class="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1">
          <span class="text-sm font-medium">{{ card.label }}</span>
          <span
            class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
            :class="card.use === 'stance'
              ? (card.sneakActive ? card.accent.selectedBg : 'border border-dashed border-white/25 bg-white/10 text-neutral-300')
              : (card.selected ? card.accent.selectedBg : 'border border-dashed border-white/25 bg-white/10 text-neutral-300')"
          >
            <template v-if="card.use === 'stance'">
              {{ card.sneakActive ? 'Aktywne' : 'Wyłączone' }}
            </template>
            <template v-else>
              {{ card.selected ? 'Wybrane' : 'Użyj' }}
            </template>
          </span>
          <span
            class="col-span-2 h-1.5 overflow-hidden rounded bg-white/10"
            aria-hidden="true"
          >
            <span
              class="block h-full rounded"
              :class="card.accent.bar"
              :style="{ width: `${card.share * 100}%` }"
            />
          </span>
          <span class="col-span-2 flex items-baseline justify-between text-xs text-neutral-400">
            <span class="tabular-nums">
              <span class="font-semibold text-neutral-100">{{ card.display }}</span>
              <span class="text-neutral-50/60"> / {{ SKILL_DISPLAY_MAX }}</span>
              <span class="ml-2 text-neutral-500">XP {{ card.xp }}</span>
            </span>
          </span>
        </span>
        <span
          v-if="card.accent.description"
          class="mt-2 block text-xs text-neutral-400"
        >
          {{ card.accent.description }}
        </span>
        <ul
          v-else
          class="mt-2 list-disc space-y-0.5 pl-4 text-xs text-neutral-400"
        >
          <li
            v-for="bullet in card.accent.bullets"
            :key="bullet"
          >
            {{ bullet }}
          </li>
        </ul>
      </button>
    </div>

    <div class="border-t border-white/10 px-4 py-2 text-[11px] text-neutral-500">
      U / Esc — zamknij
    </div>
  </div>
</template>

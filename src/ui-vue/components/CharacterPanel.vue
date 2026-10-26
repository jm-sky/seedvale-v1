<script setup lang="ts">
/**
 * Stage D Character presentation — V3 CharacterScreen look adapted to V1 data.
 * SPEA (4) / eight skills / V1 armor & reputation. No BodyDiagram, no CHA/INT.
 * @domain ui
 */
import {
  Activity,
  Brain,
  Droplets,
  Eye,
  Flag,
  Footprints,
  Hammer,
  HandHelping,
  Handshake,
  Heart,
  HeartHandshake,
  HeartPulse,
  Scale,
  Shield,
  Sparkles,
  Star,
  Utensils,
  Wind,
  X,
  Zap,
} from 'lucide-vue-next'
import { type Component, computed, ref } from 'vue'
import type { BadgeDef } from '../../badges/badges'
import type { CharacterPresentation } from '../../player/characterPresentation'
import type { ReputationDimension } from '../../reputation/ReputationManager'
import type { ModifierCategory } from '../../shared/effectivePhysicalAttributes'
import type { PhysicalAttributeId } from '../../shared/PhysicalAttributes'
import type {
  CharacterReputationView,
  CharacterSettlementOption,
} from '../store'
import { EQUIPMENT_SLOT_LABEL } from '../../items/equipment'
import { SKILL_LABEL, type SkillId } from '../../player/PlayerSkills'
import { reputationPresentation } from '../reputationPresentation'
import CharacterModifierBadge from './CharacterModifierBadge.vue'
import CharacterScaledValue from './CharacterScaledValue.vue'
import CharacterSettlementSelect from './CharacterSettlementSelect.vue'

export type CharacterTabId = 'state' | 'attributes' | 'reputation'
type StatBarView = { current: number, max: number }
type MeterTone = 'bad' | 'good' | 'warn'
type SkillCategory = 'combat' | 'field' | 'craft' | 'social'
/** Catalog row id: V1 SkillId or V3-only placeholder key. */
type CatalogSkillId =
  | SkillId
  | 'melee'
  | 'construction'
  | 'blacksmith'
  | 'woodcutting'
  | 'mining'
  | 'farming'
  | 'trade'

type CatalogAttrId = PhysicalAttributeId | 'charisma' | 'intelligence'

const props = defineProps<{
  hp: StatBarView
  stamina: StatBarView
  vigor: StatBarView
  hunger: StatBarView
  thirst: StatBarView
  presentation: CharacterPresentation
  reputation: CharacterReputationView
  badges: readonly BadgeDef[]
  showClose?: boolean
}>()

const emit = defineEmits<{
  close: []
  selectSettlement: [settlementId: string]
}>()

const ATTR_SEGMENTS = 10
const SKILL_DISPLAY_MAX = 100

const METER_TONE_BAR: Record<MeterTone, string> = {
  bad: 'bg-red-400/80',
  good: 'bg-emerald-400/80',
  warn: 'bg-amber-400/80',
}

const TABS: readonly { id: CharacterTabId, label: string }[] = [
  { id: 'state', label: 'Stan' },
  { id: 'attributes', label: 'Atrybuty i umiejętności' },
  { id: 'reputation', label: 'Reputacja' },
]

const activeTab = ref<CharacterTabId>('state')

/** V3 attribute order; V1 SPEA live, CHA/INT placeholder (opacity-50). */
const ATTR_CATALOG: readonly {
  id: CatalogAttrId
  v1Id: PhysicalAttributeId | null
  label: string
  icon: Component
}[] = [
  { id: 'strength', v1Id: 'strength', label: 'Siła', icon: Zap },
  { id: 'perception', v1Id: 'perception', label: 'Percepcja', icon: Eye },
  { id: 'endurance', v1Id: 'endurance', label: 'Wytrzymałość', icon: HeartPulse },
  { id: 'charisma', v1Id: null, label: 'Charyzma', icon: HeartHandshake },
  { id: 'intelligence', v1Id: null, label: 'Inteligencja', icon: Sparkles },
  { id: 'agility', v1Id: 'agility', label: 'Zręczność', icon: Footprints },
]

const ATTRIBUTE_LABEL: Record<PhysicalAttributeId, string> = {
  agility: 'Zręczność',
  endurance: 'Wytrzymałość',
  perception: 'Percepcja',
  strength: 'Siła',
}

const CONDITION_SECTION_LABEL: Record<ModifierCategory, string> = {
  effect: 'Efekty',
  fatigue: 'Zmęczenie',
  illness: 'Choroby',
  injury: 'Urazy',
}

const CONDITION_CATEGORY_ORDER: readonly ModifierCategory[] = [
  'illness',
  'injury',
  'fatigue',
  'effect',
]

/** V3 skill catalog + V1-only (defense, repair). Placeholders: opacity-50. */
const SKILL_CATALOG: readonly {
  id: CatalogSkillId
  v1Id: SkillId | null
  label: string
  category: SkillCategory
}[] = [
  { id: 'melee', v1Id: null, label: 'Walka wręcz', category: 'combat' },
  { id: 'archery', v1Id: 'archery', label: SKILL_LABEL.archery, category: 'combat' },
  { id: 'riding', v1Id: 'riding', label: SKILL_LABEL.riding, category: 'combat' },
  { id: 'defense', v1Id: 'defense', label: SKILL_LABEL.defense, category: 'combat' },
  { id: 'sneak', v1Id: 'sneak', label: SKILL_LABEL.sneak, category: 'field' },
  { id: 'survival', v1Id: 'survival', label: SKILL_LABEL.survival, category: 'field' },
  { id: 'traps', v1Id: 'traps', label: SKILL_LABEL.traps, category: 'field' },
  { id: 'medicine', v1Id: 'medicine', label: SKILL_LABEL.medicine, category: 'craft' },
  { id: 'construction', v1Id: null, label: 'Budowa', category: 'craft' },
  { id: 'blacksmith', v1Id: null, label: 'Kowalstwo', category: 'craft' },
  { id: 'woodcutting', v1Id: null, label: 'Drwalstwo', category: 'craft' },
  { id: 'mining', v1Id: null, label: 'Górnictwo', category: 'craft' },
  { id: 'farming', v1Id: null, label: 'Rolnictwo', category: 'craft' },
  { id: 'repair', v1Id: 'repair', label: SKILL_LABEL.repair, category: 'craft' },
  { id: 'trade', v1Id: null, label: 'Handel', category: 'social' },
]

const CATEGORY_ORDER: readonly SkillCategory[] = ['combat', 'field', 'craft', 'social']

const CATEGORY_LABEL: Record<SkillCategory, string> = {
  combat: 'Walka',
  field: 'Teren',
  craft: 'Rzemiosło',
  social: 'Społeczne',
}

const CATEGORY_ACCENT: Record<SkillCategory, { bar: string, text: string }> = {
  combat: { bar: 'bg-rose-400/80', text: 'text-rose-300' },
  field: { bar: 'bg-emerald-400/80', text: 'text-emerald-300' },
  craft: { bar: 'bg-amber-400/80', text: 'text-amber-300' },
  social: { bar: 'bg-sky-400/80', text: 'text-sky-300' },
}

type NeedRow = {
  key: string
  label: string
  current: number
  max: number
  percent: number
  tone: MeterTone
  icon: Component
}

function toneForShare(share: number): MeterTone {
  if (share <= 0.2) return 'bad'
  if (share < 0.5) return 'warn'
  return 'good'
}

const health = computed(() => {
  const share = props.hp.max > 0 ? props.hp.current / props.hp.max : 0
  return {
    current: Math.round(props.hp.current),
    max: Math.round(props.hp.max),
    share,
    tone: toneForShare(share),
  }
})

const needs = computed<NeedRow[]>(() => {
  const defs: { key: string, label: string, bar: StatBarView, icon: Component }[] = [
    { key: 'stamina', label: 'Kondycja', bar: props.stamina, icon: Activity },
    { key: 'vigor', label: 'Wigor', bar: props.vigor, icon: Wind },
    { key: 'hunger', label: 'Głód', bar: props.hunger, icon: Utensils },
    { key: 'thirst', label: 'Pragnienie', bar: props.thirst, icon: Droplets },
  ]
  return defs.map((d) => {
    const percent = d.bar.max > 0 ? (d.bar.current / d.bar.max) * 100 : 0
    return {
      key: d.key,
      label: d.label,
      current: Math.round(d.bar.current),
      max: Math.round(d.bar.max),
      percent,
      tone: toneForShare(percent / 100),
      icon: d.icon,
    }
  })
})

const conditionGroups = computed(() => {
  const conditions = props.presentation.conditions
  return CONDITION_CATEGORY_ORDER
    .map((category) => ({
      category,
      label: CONDITION_SECTION_LABEL[category],
      items: conditions.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0)
})

const equipment = computed(() => props.presentation.equipment)

const attributeRows = computed(() => {
  const byId = new Map(props.presentation.attributes.map((a) => [a.id, a]))
  return ATTR_CATALOG.map((def) => {
    const live = def.v1Id ? byId.get(def.v1Id) : undefined
    const available = live !== undefined
    const effective = live?.effective ?? 0
    const base = live?.base ?? 0
    return {
      id: def.id,
      label: def.label,
      icon: def.icon,
      available,
      effective,
      base,
      modifiers: live?.modifiers ?? [],
      segmentsFilled: available
        ? Math.max(0, Math.min(ATTR_SEGMENTS, Math.round(effective / 10)))
        : 0,
    }
  })
})

const skillGroups = computed(() => {
  const byId = new Map(props.presentation.skills.map((s) => [s.id, s]))
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABEL[category],
    accent: CATEGORY_ACCENT[category],
    rows: SKILL_CATALOG
      .filter((def) => def.category === category)
      .map((def) => {
        const live = def.v1Id ? byId.get(def.v1Id) : undefined
        const available = live !== undefined
        const value = live?.value ?? 0
        return {
          id: def.id,
          label: def.label,
          available,
          value,
          xp: live?.xp ?? 0,
          share: available ? Math.max(0, Math.min(1, value / SKILL_DISPLAY_MAX)) : 0,
        }
      }),
  })).filter((g) => g.rows.length > 0)
})

function formatSignedDelta(delta: number): string {
  return delta > 0 ? `+${delta}` : `−${Math.abs(delta)}`
}

function formatConditionEffects(effects: readonly { id: PhysicalAttributeId, delta: number }[]): string {
  return effects
    .map((effect) => `${ATTRIBUTE_LABEL[effect.id]} ${formatSignedDelta(effect.delta)}`)
    .join(' · ')
}

function formatEquipmentPercent(fraction: number): string {
  const percent = Math.round(fraction * 100)
  if (percent === 0) return '0%'
  return percent > 0 ? `+${percent}%` : `−${Math.abs(percent)}%`
}

function formatDamageReduction(fraction: number): string {
  return `${Math.round(fraction * 100)}%`
}

function formatEquippedSlot(itemLabel: string | null, qualityLabel: string | null): string {
  if (!itemLabel) return '—'
  return qualityLabel ? `${itemLabel} · ${qualityLabel}` : itemLabel
}

const REPUTATION_ROWS: readonly {
  key: ReputationDimension
  label: string
  icon: Component
  grammar: 'neuter' | 'feminine'
}[] = [
  { key: 'trust', label: 'Zaufanie', icon: Handshake, grammar: 'neuter' },
  { key: 'competence', label: 'Kompetencja', icon: Hammer, grammar: 'feminine' },
  { key: 'benevolence', label: 'Życzliwość', icon: HandHelping, grammar: 'feminine' },
  { key: 'courage', label: 'Odwaga', icon: Flag, grammar: 'feminine' },
  { key: 'integrity', label: 'Uczciwość', icon: Scale, grammar: 'feminine' },
]

const reputationRows = computed(() => {
  const rep = props.reputation.selected?.reputation
  if (!rep) return []
  return REPUTATION_ROWS.map((row) => {
    const value = rep[row.key]
    const presentation = reputationPresentation(value, row.grammar)
    return {
      ...row,
      value,
      levelLabel: presentation.label,
      toneClass: presentation.toneClass,
      chipClass: value < -25
        ? 'bg-red-400/10'
        : value > 25
          ? 'bg-emerald-400/10'
          : 'bg-white/10',
    }
  })
})

function onSelectSettlement(settlementId: string): void {
  emit('selectSettlement', settlementId)
}

function selectTab(id: CharacterTabId): void {
  activeTab.value = id
}
</script>

<template>
  <div class="sv-character flex h-[min(660px,calc(100dvh-2rem))] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/15 bg-(--surface-solid) text-neutral-50 shadow-2xl md:max-w-5xl">
    <div class="flex shrink-0 items-center justify-between border-b border-white/15 px-4 py-2.5">
      <h1 class="text-lg font-semibold tracking-wide text-primary">
        Postać
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

    <div
      class="flex shrink-0 flex-wrap gap-1 border-b border-white/10 px-3 pt-2 pb-2"
      role="tablist"
      aria-label="Postać"
    >
      <button
        v-for="tab in TABS"
        :key="tab.id"
        type="button"
        role="tab"
        class="rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors"
        :class="activeTab === tab.id
          ? 'bg-primary text-neutral-950'
          : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-200'"
        :aria-selected="activeTab === tab.id"
        @click="selectTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="min-h-0 flex-1 overflow-hidden p-4 sm:p-5">
      <!-- Stan — V3 State layout without BodyDiagram -->
      <div
        v-show="activeTab === 'state'"
        role="tabpanel"
        class="sv-character-scroll grid h-full items-start gap-x-8 gap-y-6 overflow-y-auto overscroll-contain lg:grid-cols-2"
      >
        <section
          aria-label="Zdrowie"
          class="flex flex-col gap-4"
        >
          <h2 class="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            <Heart class="size-5" />
            Zdrowie
          </h2>
          <div class="flex min-w-0 flex-col justify-center gap-2 px-2">
            <CharacterScaledValue
              :value="String(health.current)"
              :max="String(health.max)"
              size="lg"
            />
            <span
              class="h-2 overflow-hidden rounded bg-white/10"
              role="meter"
              :aria-valuenow="health.current"
              aria-valuemin="0"
              :aria-valuemax="health.max"
              aria-label="Zdrowie"
            >
              <span
                class="block h-full rounded"
                :class="METER_TONE_BAR[health.tone]"
                :style="{ width: `${health.share * 100}%` }"
              />
            </span>
            <p
              v-if="health.share <= 0.2"
              class="text-xs text-amber-300"
            >
              Stan krytyczny.
            </p>
            <p
              v-else
              class="text-xs text-neutral-400"
            >
              W dobrej formie.
            </p>
          </div>
        </section>

        <section aria-label="Potrzeby">
          <h2 class="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Potrzeby
          </h2>
          <ul class="divide-y divide-white/5">
            <li
              v-for="n in needs"
              :key="n.key"
            >
              <div class="grid w-full min-h-10 grid-cols-[1.25rem_6.5rem_1fr_auto] items-center gap-x-2 rounded-md px-2 py-1.5 sm:grid-cols-[1.25rem_8rem_1fr_auto] sm:gap-x-3">
                <component
                  :is="n.icon"
                  class="size-5 text-neutral-400"
                />
                <span class="truncate text-sm font-medium">{{ n.label }}</span>
                <span
                  class="h-1.5 overflow-hidden rounded bg-white/10"
                  aria-hidden="true"
                >
                  <span
                    class="block h-full rounded"
                    :class="METER_TONE_BAR[n.tone]"
                    :style="{ width: `${n.percent}%` }"
                  />
                </span>
                <CharacterScaledValue
                  :value="String(n.current)"
                  :max="String(n.max)"
                />
              </div>
            </li>
          </ul>
        </section>

        <section aria-label="Stan zdrowia">
          <h2 class="mb-1 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            <Brain class="size-5" />
            Stan zdrowia
          </h2>
          <p
            v-if="conditionGroups.length === 0"
            class="px-2 py-2 text-sm text-neutral-400"
          >
            Brak aktywnych efektów
          </p>
          <ul
            v-else
            class="divide-y divide-white/5"
          >
            <template
              v-for="group in conditionGroups"
              :key="group.category"
            >
              <li
                v-for="item in group.items"
                :key="item.sourceId"
                class="flex flex-col gap-0.5 px-2 py-2 text-sm"
              >
                <div class="flex items-baseline justify-between gap-3">
                  <span class="font-medium text-amber-300">
                    {{ item.label }}<span
                      v-if="item.severityLabel"
                      class="font-normal text-neutral-400"
                    > — {{ item.severityLabel }}</span>
                  </span>
                  <span class="text-[11px] uppercase tracking-wide text-neutral-500">{{ group.label }}</span>
                </div>
                <span class="text-xs text-neutral-400">{{ formatConditionEffects(item.effects) }}</span>
              </li>
            </template>
          </ul>
        </section>

        <section
          aria-label="Pancerz"
          class="lg:col-span-2"
        >
          <h2 class="mb-2 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            <Shield class="size-5" />
            Pancerz
          </h2>
          <div class="grid gap-x-8 gap-y-4 px-2 sm:grid-cols-2">
            <dl class="flex flex-col gap-1 text-sm">
              <div class="flex justify-between gap-2">
                <dt class="text-neutral-400">
                  Redukcja obrażeń
                </dt>
                <dd class="tabular-nums">
                  {{ formatDamageReduction(equipment.damageReduction) }}
                </dd>
              </div>
              <div class="flex justify-between gap-2">
                <dt class="text-neutral-400">
                  Koszt kondycji ataku
                </dt>
                <dd class="tabular-nums">
                  {{ formatEquipmentPercent(equipment.attackStaminaDelta) }}
                </dd>
              </div>
              <div class="flex justify-between gap-2">
                <dt class="text-neutral-400">
                  Odnowienie ataku
                </dt>
                <dd class="tabular-nums">
                  {{ formatEquipmentPercent(equipment.meleeRecoveryDelta) }}
                </dd>
              </div>
              <div class="flex justify-between gap-2">
                <dt class="text-neutral-400">
                  Prędkość ruchu
                </dt>
                <dd class="tabular-nums">
                  {{ formatEquipmentPercent(equipment.movementSpeedDelta) }}
                </dd>
              </div>
              <div class="flex justify-between gap-2">
                <dt class="text-neutral-400">
                  Koszt sprintu
                </dt>
                <dd class="tabular-nums">
                  {{ formatEquipmentPercent(equipment.sprintStaminaDelta) }}
                </dd>
              </div>
            </dl>
            <dl class="flex flex-col gap-1 text-sm">
              <div
                v-for="row in equipment.slots"
                :key="row.slot"
                class="flex justify-between gap-3"
              >
                <dt class="text-neutral-400">
                  {{ EQUIPMENT_SLOT_LABEL[row.slot] }}
                </dt>
                <dd class="truncate text-right">
                  {{ formatEquippedSlot(row.itemLabel, row.qualityLabel) }}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>

      <!-- Atrybuty i umiejętności — V3 two-column; skills column scrolls -->
      <div
        v-show="activeTab === 'attributes'"
        role="tabpanel"
        class="grid h-full min-h-0 items-stretch gap-6 overflow-hidden lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8"
      >
        <div class="sv-character-scroll min-h-0 overflow-y-auto overscroll-contain lg:overflow-visible">
          <section aria-label="Atrybuty">
            <h2 class="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Atrybuty
            </h2>
            <ul class="divide-y divide-white/5">
              <li
                v-for="row in attributeRows"
                :key="row.id"
                :class="row.available ? '' : 'opacity-50'"
              >
                <div
                  class="flex w-full min-h-10 flex-col gap-1 rounded-md px-2 py-1.5"
                  :aria-disabled="!row.available"
                >
                  <span class="flex flex-wrap items-center gap-2">
                    <component
                      :is="row.icon"
                      class="size-5 shrink-0 text-neutral-400"
                    />
                    <span class="flex-1 text-sm font-medium">{{ row.label }}</span>
                    <CharacterScaledValue
                      v-if="row.available"
                      :value="String(row.effective)"
                      :max="String(row.base)"
                    />
                    <span
                      v-else
                      class="text-xs tabular-nums text-neutral-400"
                    >— / —</span>
                    <CharacterModifierBadge
                      v-for="badge in row.modifiers"
                      :key="badge.category"
                      :category="badge.category"
                      :delta="badge.delta"
                    />
                  </span>
                  <span
                    class="flex gap-0.5"
                    aria-hidden="true"
                  >
                    <span
                      v-for="n in ATTR_SEGMENTS"
                      :key="n"
                      class="h-1.5 flex-1 rounded-sm"
                      :class="row.available && n <= row.segmentsFilled ? 'bg-primary' : 'bg-white/10'"
                    />
                  </span>
                </div>
              </li>
            </ul>
          </section>
        </div>

        <div class="sv-character-scroll flex min-h-0 flex-col gap-3.5 overflow-y-auto overscroll-contain pr-0.5">
          <section
            v-for="g in skillGroups"
            :key="g.category"
            :aria-label="g.label"
          >
            <h2
              class="mb-0.5 px-2 text-xs font-semibold uppercase tracking-wide"
              :class="g.accent.text"
            >
              {{ g.label }}
            </h2>
            <ul class="divide-y divide-white/5">
              <li
                v-for="r in g.rows"
                :key="r.id"
                :class="r.available ? '' : 'opacity-50'"
              >
                <div
                  class="grid w-full grid-cols-[6.5rem_1fr_auto] items-center gap-x-2 rounded-md px-2 py-0.5 sm:grid-cols-[9rem_1fr_auto] sm:gap-x-3"
                  :aria-disabled="!r.available"
                >
                  <span class="truncate text-sm font-medium leading-5">{{ r.label }}</span>
                  <span
                    class="h-1 overflow-hidden rounded bg-white/10"
                    aria-hidden="true"
                  >
                    <span
                      v-if="r.available"
                      class="block h-full rounded"
                      :class="g.accent.bar"
                      :style="{ width: `${r.share * 100}%` }"
                    />
                  </span>
                  <span class="inline-flex items-baseline gap-1.5 whitespace-nowrap tabular-nums">
                    <span class="inline-block min-w-[4.75rem] text-right">
                      <CharacterScaledValue
                        v-if="r.available"
                        :value="String(r.value)"
                        :max="String(SKILL_DISPLAY_MAX)"
                      />
                      <span
                        v-else
                        class="text-xs text-neutral-400"
                      >— / {{ SKILL_DISPLAY_MAX }}</span>
                    </span>
                    <span
                      class="text-neutral-600"
                      aria-hidden="true"
                    >|</span>
                    <span class="inline-block min-w-[9ch] text-right text-[11px] text-neutral-500">
                      {{ r.available ? `XP ${Math.round(r.xp)}` : 'XP —' }}
                    </span>
                  </span>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <!-- Reputacja — V3 card + bipolar meters -->
      <div
        v-show="activeTab === 'reputation'"
        role="tabpanel"
        class="sv-character-scroll flex h-full flex-col gap-4 overflow-y-auto overscroll-contain"
      >
        <p
          v-if="reputation.settlements.length === 0"
          class="text-sm text-neutral-400"
        >
          Brak lokalnej reputacji
        </p>
        <template v-else>
          <CharacterSettlementSelect
            :options="reputation.settlements as CharacterSettlementOption[]"
            :selected-settlement-id="reputation.selectedSettlementId"
            @select="onSelectSettlement"
          />
          <div
            v-if="reputation.selected"
            class="rounded-xl border border-white/10 bg-black/20 p-4"
          >
            <h2 class="mb-3 flex items-baseline gap-2 text-base font-semibold">
              {{ reputation.selected.settlementName }}
              <span class="inline-flex items-center gap-1 text-xs font-normal uppercase tracking-wide text-neutral-400">
                <Star class="size-3.5" />
                Rozpoznawalność {{ reputation.selected.renown }}
              </span>
            </h2>
            <ul class="flex flex-col gap-3">
              <li
                v-for="row in reputationRows"
                :key="row.key"
              >
                <div class="flex items-center gap-2 text-sm">
                  <component
                    :is="row.icon"
                    class="size-5"
                    :class="row.toneClass"
                  />
                  <span class="flex-1 font-medium">{{ row.label }}</span>
                  <span
                    class="rounded px-1.5 py-0.5 text-xs font-medium"
                    :class="[row.toneClass, row.chipClass]"
                  >{{ row.levelLabel }}</span>
                  <span class="w-9 text-right font-semibold tabular-nums">{{ row.value }}</span>
                </div>
                <span
                  class="relative mt-1.5 block h-2 w-full rounded bg-white/10"
                  role="meter"
                  :aria-valuenow="row.value"
                  aria-valuemin="-100"
                  aria-valuemax="100"
                  :aria-label="row.label"
                >
                  <span class="absolute inset-y-[-2px] left-1/2 w-px bg-white/40" />
                  <span
                    class="absolute inset-y-0 rounded"
                    :class="row.value < 0 ? 'bg-red-400/80' : 'bg-emerald-400/80'"
                    :style="row.value < 0
                      ? { right: '50%', width: `${Math.min(100, -row.value) / 2}%` }
                      : { left: '50%', width: `${Math.min(100, row.value) / 2}%` }"
                  />
                </span>
              </li>
            </ul>
            <div
              v-if="reputation.selected.settlementBadges.length > 0"
              class="mt-4 flex flex-col gap-1.5 border-t border-white/10 pt-3"
            >
              <div class="text-sm text-neutral-200">
                Znany tutaj z
              </div>
              <div
                v-for="badge in reputation.selected.settlementBadges"
                :key="badge.id"
                class="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-neutral-300"
                :title="badge.description"
              >
                <span class="mr-1">{{ badge.icon }}</span>
                <span>{{ badge.label }}</span>
              </div>
            </div>
          </div>
        </template>

        <div
          v-if="badges.length > 0"
          class="rounded-xl border border-white/10 bg-black/20 p-4"
        >
          <h2 class="mb-2 text-sm font-semibold">
            Znany z
          </h2>
          <div class="flex flex-col gap-1.5">
            <div
              v-for="badge in badges"
              :key="badge.id"
              class="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-neutral-300"
              :title="badge.description"
            >
              <span class="mr-1">{{ badge.icon }}</span>
              <span>{{ badge.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="shrink-0 border-t border-white/10 px-4 py-2 text-[11px] text-neutral-500">
      C / Esc — zamknij
    </div>
  </div>
</template>

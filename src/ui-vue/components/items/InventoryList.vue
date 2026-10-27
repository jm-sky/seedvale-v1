<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useItemCategoryLabels } from '@/composables/useItemCategoryLabels'
import type { PrimaryWeaponChoice } from '../../../items/primaryWeapons'
import { ITEM_METER_LABEL } from '../../../items/inventoryView'
import { isPrimaryMeleeAssignment, isPrimaryRangedAssignment } from '../../../items/primaryWeapons'
import {
  availableInventoryCategories,
  filterInventoryRows,
  type InventoryCategoryFilter,
  type InventoryPresentationRow,
  inventoryRowKey,
  type InventorySelection,
  type InventorySortMode,
  isSelectionVisible,
  selectionFromRow,
  selectionMatchesRow,
  sortInventoryRows,
} from './inventoryPresentation'
import { conditionTone } from './meters'
import QualityTag from './QualityTag.vue'
import StatBar from './StatBar.vue'

const props = defineProps<{
  rows: readonly InventoryPresentationRow[]
  selection: InventorySelection
  filter: InventoryCategoryFilter
  sortMode: InventorySortMode
  heldTool: string | null
  heldInstanceId: string | null
  primaryMelee: PrimaryWeaponChoice | null
  primaryRanged: PrimaryWeaponChoice | null
  equippedInstanceIds: readonly string[]
  /** Carrying line shown above filters when provided. */
  carryingLabel?: string | null
}>()

const emit = defineEmits<{
  select: [selection: Exclude<InventorySelection, null>]
  'update:filter': [filter: InventoryCategoryFilter]
  'update:sortMode': [mode: InventorySortMode]
  reveal: []
}>()

const { categoryLabel } = useItemCategoryLabels()
const listRef = ref<HTMLElement | null>(null)
const rowRefs = ref<Record<string, HTMLButtonElement | null>>({})

const SORT_LABEL: Record<InventorySortMode, string> = {
  category: 'Kategoria',
  name: 'Nazwa',
  qty: 'Ilość',
  weight: 'Waga',
}

const equippedSet = computed(() => new Set(props.equippedInstanceIds))

const availableCategories = computed(() => availableInventoryCategories(props.rows))

const visibleRows = computed(() =>
  sortInventoryRows(filterInventoryRows(props.rows, props.filter), props.sortMode),
)

const selectionOutsideFilter = computed(() =>
  props.selection != null && !isSelectionVisible(props.selection, visibleRows.value),
)

watch(
  () => props.filter,
  (filter) => {
    if (filter !== 'all' && !availableCategories.value.includes(filter as Exclude<InventoryCategoryFilter, 'all'>)) {
      emit('update:filter', 'all')
    }
  },
)

watch(availableCategories, (cats) => {
  if (props.filter !== 'all' && !cats.includes(props.filter as Exclude<InventoryCategoryFilter, 'all'>)) {
    emit('update:filter', 'all')
  }
})

function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`
}

function setRowRef(key: string, el: unknown): void {
  rowRefs.value[key] = (el as HTMLButtonElement | null) ?? null
}

function onSelect(row: InventoryPresentationRow): void {
  emit('select', selectionFromRow(row))
}

function onReveal(): void {
  emit('update:filter', 'all')
  emit('reveal')
  void nextTick(() => {
    if (!props.selection) return
    const key = inventoryRowKey(props.selection)
    rowRefs.value[key]?.focus()
    rowRefs.value[key]?.scrollIntoView({ block: 'nearest' })
  })
}

function assignmentBadges(row: InventoryPresentationRow): string[] {
  const badges: string[] = []
  if (row.type === 'instance') {
    if (equippedSet.value.has(row.instanceId)) badges.push('Założona')
    if (
      props.heldInstanceId === row.instanceId
      && props.heldTool === row.kind
    ) badges.push('W ręce')
    if (isPrimaryMeleeAssignment(row.kind, row.instanceId, props.primaryMelee)) {
      badges.push('Podst. wręcz')
    }
    if (isPrimaryRangedAssignment(row.kind, row.instanceId, props.primaryRanged)) {
      badges.push('Podst. dystans')
    }
  } else {
    if (props.heldTool === row.kind && props.heldInstanceId == null) badges.push('W ręce')
    if (props.primaryMelee?.kind === row.kind && props.primaryMelee.instanceId == null) {
      badges.push('Podst. wręcz')
    }
    if (props.primaryRanged?.kind === row.kind && props.primaryRanged.instanceId == null) {
      badges.push('Podst. dystans')
    }
  }
  return badges
}

function rowAriaLabel(row: InventoryPresentationRow): string {
  const parts = [row.displayName, `×${row.count}`, formatWeight(row.weightKg)]
  if (row.type === 'instance') {
    if (row.instance.qualityLabel) parts.push(row.instance.qualityLabel)
    else if (row.instance.meterKind && row.group.meterKind) {
      // Suppress armor/generic sort-only 100 as wear in the accessible name when meter is absent for armor.
      if (row.group.meterKind != null && !(row.instance.quality != null && row.instance.conditionPercent === 100 && row.instance.meterKind === 'condition' && row.instance.protectionPercent != null)) {
        if (!(row.instance.quality != null)) {
          parts.push(`${ITEM_METER_LABEL[row.instance.meterKind]} ${row.instance.conditionPercent}%`)
        }
      } else if (row.instance.sharpnessPercent != null) {
        parts.push(`Ostrość ${row.instance.sharpnessPercent}%`)
      } else if (row.instance.meterKind === 'fill' || row.instance.meterKind === 'durability' || (row.instance.meterKind === 'condition' && row.instance.quality == null)) {
        parts.push(`${ITEM_METER_LABEL[row.instance.meterKind]} ${row.instance.conditionPercent}%`)
      }
    }
    if (row.instance.sharpnessPercent != null) parts.push(`Ostrość ${row.instance.sharpnessPercent}%`)
    if (row.instance.liquid != null && row.instance.amountLitres != null) {
      parts.push(`${row.instance.liquid} ${row.instance.amountLitres} l`)
    }
  }
  parts.push(...assignmentBadges(row))
  return parts.join(', ')
}

function showMeter(row: InventoryPresentationRow): boolean {
  if (row.type !== 'instance') return false
  // Armor quality is not wear; generic identity 100 is not wear.
  if (row.instance.quality != null) return false
  if (row.instance.meterKind === 'condition' && row.instance.sharpnessPercent == null && row.instance.protectionPercent == null && row.instance.conditionPercent === 100) {
    // Identity-only / ranged plain — suppress fake wear bar.
    return false
  }
  return row.group.meterKind != null
}

function meterRatio(row: InventoryPresentationRow): number {
  if (row.type !== 'instance') return 0
  return Math.min(1, Math.max(0, row.instance.conditionPercent / 100))
}

defineExpose({
  focusSelectedRow: () => {
    if (!props.selection) return
    const key = inventoryRowKey(props.selection)
    rowRefs.value[key]?.focus()
  },
  listEl: listRef,
})
</script>

<template>
  <section class="flex min-h-0 flex-col gap-2">
    <div
      v-if="carryingLabel"
      class="text-[13px] text-neutral-400"
    >
      {{ carryingLabel }}
    </div>

    <div
      class="flex flex-wrap items-center gap-1"
      role="group"
      aria-label="Filtr kategorii"
    >
      <button
        type="button"
        class="min-h-11 rounded-full border px-2.5 py-0.5 text-xs sm:min-h-0"
        :class="filter === 'all'
          ? 'border-neutral-200 bg-neutral-100 text-neutral-900'
          : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'"
        :aria-pressed="filter === 'all'"
        @click="emit('update:filter', 'all')"
      >
        Wszystkie
      </button>
      <button
        v-for="cat in availableCategories"
        :key="cat"
        type="button"
        class="min-h-11 rounded-full border px-2.5 py-0.5 text-xs sm:min-h-0"
        :class="filter === cat
          ? 'border-neutral-200 bg-neutral-100 text-neutral-900'
          : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'"
        :aria-pressed="filter === cat"
        @click="emit('update:filter', cat)"
      >
        {{ categoryLabel[cat] }}
      </button>
    </div>

    <label class="flex items-center gap-2 text-xs text-neutral-400">
      <span>Sortuj</span>
      <select
        class="min-h-11 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-neutral-200 sm:min-h-0"
        :value="sortMode"
        aria-label="Sortowanie listy ekwipunku"
        @change="emit('update:sortMode', ($event.target as HTMLSelectElement).value as InventorySortMode)"
      >
        <option
          v-for="(label, mode) in SORT_LABEL"
          :key="mode"
          :value="mode"
        >
          {{ label }}
        </option>
      </select>
    </label>

    <div
      v-if="selectionOutsideFilter"
      class="rounded-md border border-amber-700/50 bg-amber-950/30 px-3 py-2 text-xs text-amber-100"
    >
      <p>Wybrany przedmiot jest poza filtrem.</p>
      <button
        type="button"
        class="mt-1 min-h-11 underline sm:min-h-0"
        @click="onReveal"
      >
        Pokaż zaznaczenie
      </button>
    </div>

    <ul
      ref="listRef"
      class="min-h-0 flex-1 divide-y divide-neutral-800 overflow-y-auto rounded-lg border border-neutral-800"
      role="list"
    >
      <li
        v-for="row in visibleRows"
        :key="row.key"
      >
        <button
          :ref="(el) => setRowRef(row.key, el)"
          type="button"
          class="flex w-full min-h-11 items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="selectionMatchesRow(selection, row) ? 'bg-neutral-800/70' : ''"
          :aria-current="selectionMatchesRow(selection, row) ? 'true' : undefined"
          :aria-label="rowAriaLabel(row)"
          @click="onSelect(row)"
        >
          <span class="min-w-0 flex-1">
            <span class="flex flex-wrap items-center gap-1.5">
              <span class="font-medium text-neutral-100">{{ row.displayName }}</span>
              <QualityTag
                v-if="row.type === 'instance' && row.instance.qualityLabel"
                :label="row.instance.qualityLabel"
              />
              <span
                v-for="badge in assignmentBadges(row)"
                :key="badge"
                class="rounded-full bg-primary/30 px-2 py-0.5 text-[11px] font-medium text-neutral-100"
              >{{ badge }}</span>
            </span>
            <span class="mt-0.5 block text-xs text-neutral-400">
              ×{{ row.count }} · {{ formatWeight(row.weightKg) }}
              <template v-if="row.type === 'instance' && row.instance.liquid != null">
                · {{ row.instance.liquid }} {{ row.instance.amountLitres?.toFixed(1) }} l
              </template>
              <template v-else-if="row.type === 'instance' && row.instance.amountLitres === 0 && row.instance.capacityLitres != null">
                · pusty
              </template>
            </span>
            <StatBar
              v-if="showMeter(row)"
              class="mt-1 max-w-[8rem]"
              :value="meterRatio(row)"
              :tone="conditionTone(meterRatio(row))"
              :title="row.type === 'instance' ? `${ITEM_METER_LABEL[row.instance.meterKind]} ${row.instance.conditionPercent}%` : undefined"
            />
          </span>
        </button>
      </li>
      <li
        v-if="visibleRows.length === 0"
        class="px-3 py-4 text-sm text-neutral-500"
      >
        Brak przedmiotów w tej kategorii.
      </li>
    </ul>
  </section>
</template>

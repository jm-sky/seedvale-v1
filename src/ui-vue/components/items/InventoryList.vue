<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useItemCategoryLabels } from '@/composables/useItemCategoryLabels'
import { firstUpperCase } from '@/lib/firstUpperCase'
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
import ItemTypeIcon from './ItemTypeIcon.vue'
import { conditionTone } from './meters'
import QualityTag from './QualityTag.vue'
import StatBar from './StatBar.vue'
import StatIcon from './StatIcon.vue'

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

function waterText(row: InventoryPresentationRow): string | null {
  if (row.type !== 'instance') return null
  const inst = row.instance
  if (inst.capacityLitres == null) return null
  if (inst.liquid == null || inst.amountLitres == null) {
    return inst.amountLitres === 0 ? 'pusty' : null
  }
  return `${inst.amountLitres.toFixed(1)} / ${inst.capacityLitres.toFixed(1)} l`
}

function rowAriaLabel(row: InventoryPresentationRow): string {
  const parts = [firstUpperCase(row.displayName), `×${row.count}`, formatWeight(row.weightKg)]
  if (row.type === 'instance') {
    if (row.instance.qualityLabel) parts.push(row.instance.qualityLabel)
    else if (showMeter(row)) {
      parts.push(`${ITEM_METER_LABEL[row.instance.meterKind]} ${row.instance.conditionPercent}%`)
    }
    if (row.instance.sharpnessPercent != null) parts.push(`Ostrość ${row.instance.sharpnessPercent}%`)
    const water = waterText(row)
    if (water) parts.push(water)
  }
  parts.push(...assignmentBadges(row))
  return parts.join(', ')
}

/** Real wear/fill meters only — never armor quality or identity-only 100. */
function showMeter(row: InventoryPresentationRow): boolean {
  if (row.type === 'instance') {
    if (row.instance.quality != null) return false
    if (row.instance.meterKind === 'fill') return true
    if (row.instance.sharpnessPercent != null) return true
    if (row.instance.meterKind === 'durability') return true
    if (row.instance.meterKind === 'condition') {
      // Traps/tents have real condition; plain identity 100 without other state does not.
      return row.instance.conditionPercent < 100 || row.kind.startsWith('trap') || row.kind === 'tent'
    }
    return false
  }
  // Group row: uniform real meter (e.g. stack of worn tools is rare; skip fake).
  return false
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

    <div class="flex flex-wrap items-center gap-2">
      <div
        class="flex min-w-0 flex-1 flex-wrap items-center gap-1"
        role="group"
        aria-label="Filtr kategorii"
      >
        <button
          type="button"
          class="rounded-full border px-2.5 py-0.5 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
          class="rounded-full border px-2.5 py-0.5 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          :class="filter === cat
            ? 'border-neutral-200 bg-neutral-100 text-neutral-900'
            : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'"
          :aria-pressed="filter === cat"
          @click="emit('update:filter', cat)"
        >
          {{ categoryLabel[cat] }}
        </button>
      </div>
      <select
        class="ml-auto shrink-0 rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-xs text-neutral-200"
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
    </div>

    <div
      v-if="selectionOutsideFilter"
      class="rounded-md border border-amber-700/50 bg-amber-950/30 px-3 py-2 text-xs text-amber-100"
    >
      <p>Wybrany przedmiot jest poza filtrem.</p>
      <button
        type="button"
        class="mt-1 underline"
        @click="onReveal"
      >
        Pokaż zaznaczenie
      </button>
    </div>

    <ul
      ref="listRef"
      class="min-h-0 flex-1 divide-y divide-white/10 overflow-y-auto overflow-x-hidden rounded-lg border border-neutral-800"
      role="list"
    >
      <li
        v-for="row in visibleRows"
        :key="row.key"
      >
        <button
          :ref="(el) => setRowRef(row.key, el)"
          type="button"
          class="flex w-full flex-col gap-1 px-3 py-1.5 text-left text-sm hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex-row sm:items-center sm:gap-2"
          :class="selectionMatchesRow(selection, row) ? 'bg-neutral-800/70' : ''"
          :aria-current="selectionMatchesRow(selection, row) ? 'true' : undefined"
          :aria-label="rowAriaLabel(row)"
          @click="onSelect(row)"
        >
          <span class="flex min-w-0 items-center gap-2 sm:contents">
            <ItemTypeIcon
              :kind="row.kind"
              :category="row.category"
              class="size-3.5 shrink-0 text-neutral-300"
              aria-hidden="true"
            />
            <span
              data-item-name
              class="min-w-0 flex-1 wrap-break-word text-neutral-100"
            >{{ firstUpperCase(row.displayName) }}</span>
          </span>
          <span class="flex flex-wrap items-center gap-x-2 gap-y-0.5 sm:contents">
            <QualityTag
              v-if="row.type === 'instance' && row.instance.quality"
              :quality="row.instance.quality"
            />
            <span
              v-if="row.count > 1"
              class="text-xs text-neutral-400 tabular-nums"
            >×{{ row.count }}</span>
            <span
              v-for="badge in assignmentBadges(row)"
              :key="badge"
              class="rounded border-transparent bg-emerald-900/60 px-1.5 text-[11px] text-emerald-300"
            >{{ badge }}</span>
            <span
              v-if="showMeter(row)"
              class="w-12 shrink-0"
            >
              <StatBar
                :value="meterRatio(row)"
                :tone="conditionTone(meterRatio(row))"
                :title="row.type === 'instance' ? `${ITEM_METER_LABEL[row.instance.meterKind]} ${row.instance.conditionPercent}%` : undefined"
              />
            </span>
            <span
              v-if="waterText(row)"
              class="shrink-0 text-xs text-neutral-400 tabular-nums"
            >{{ waterText(row) }}</span>
            <span class="shrink-0 text-right text-xs text-neutral-400 tabular-nums sm:w-16">
              <StatIcon
                name="weight"
                class="mr-0.5"
              />{{ formatWeight(row.weightKg) }}
            </span>
          </span>
        </button>
      </li>
      <li
        v-if="visibleRows.length === 0"
        class="px-3 py-6 text-center text-sm text-neutral-500"
      >
        Brak przedmiotów w tej kategorii.
      </li>
    </ul>
  </section>
</template>

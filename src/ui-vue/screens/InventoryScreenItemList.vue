<script setup lang="ts">
import { computed, ref } from 'vue'
import ItemsScreenItemButton from '@/components/ItemsScreenItemButton.vue'
import { useItemCategoryLabels } from '@/composables/useItemCategoryLabels'
import { isToolKind } from '../../items/HeldTool'
import { inventoryItemReadAction } from '../../items/inventoryItemReadAction'
import { type InventoryInstanceRow, ITEM_METER_LABEL } from '../../items/inventoryView'
import { isArmorCatalogKind, isMeleeToolKind, isRangedTool, isThrowableKind } from '../../items/itemCatalog'
import { itemDisplayName } from '../../items/itemDisplay'
import { isWeaponMaintenanceKind } from '../../items/itemInstances'
import { hasItemCategory, ITEM_DEFS, type ItemCategory, type ItemKind, primaryItemCategory } from '../../items/items'
import { isPrimaryMeleeAssignment, isPrimaryRangedAssignment } from '../../items/primaryWeapons'
import { trapKindForItem } from '../../world/animalTraps'
import QualityTag from '../components/items/QualityTag.vue'
import { useTouchScroll } from '../composables/useTouchScroll'
import { openQuantityDialog, ui } from '../store'

const props = defineProps<{
  /** When true, parent owns the outer panel (Stage B two-column). */
  embedded?: boolean
  compareInstanceId?: string | null
}>()

const panel = ref<HTMLElement | null>(null)

const { categoryLabel } = useItemCategoryLabels()

type CategoryFilter = 'all' | ItemCategory
type SortMode = 'category' | 'name' | 'qty'

const CATEGORY_ORDER: readonly ItemCategory[] = [
  'weapon', 'armor', 'tool', 'story', 'knowledge', 'food', 'utility', 'resource', 'other',
]
const SORT_LABEL: Record<SortMode, string> = { category: 'Kategoria', name: 'Nazwa', qty: 'Ilość' }

const filter = ref<CategoryFilter>('all')
const sortMode = ref<SortMode>('category')

const allItems = computed(() => ui.inventory.groups.map((group) => ({
  kind: group.kind,
  def: ITEM_DEFS[group.kind],
  displayName: itemDisplayName(group.kind),
  count: group.count,
  condition: group.condition,
  uniformConditionPercent: group.uniformConditionPercent,
  meterKind: group.meterKind,
  instances: group.instances,
  consumeUse: group.consumeUse,
  readAction: inventoryItemReadAction(group.kind),
})))

const availableCategories = computed(() => CATEGORY_ORDER.filter((cat) => allItems.value.some((item) => hasItemCategory(item.def, cat))))

const items = computed(() => {
  const filtered = filter.value === 'all'
    ? allItems.value
    : allItems.value.filter((item) => hasItemCategory(item.def, filter.value as ItemCategory))
  const sorted = [...filtered]
  if (sortMode.value === 'name') sorted.sort((a, b) => a.displayName.localeCompare(b.displayName, 'pl'))
  else if (sortMode.value === 'qty') sorted.sort((a, b) => b.count - a.count)
  else sorted.sort((a, b) => CATEGORY_ORDER.indexOf(primaryItemCategory(a.def)) - CATEGORY_ORDER.indexOf(primaryItemCategory(b.def)) || a.displayName.localeCompare(b.displayName, 'pl'))
  return sorted
})

function categoryLabels(def: (typeof allItems.value)[number]['def']): string {
  return def.categories.map((cat) => categoryLabel[cat]).join(' · ')
}

function conditionLabel(item: (typeof allItems.value)[number]): string | null {
  if (!item.meterKind) return null
  if (item.condition === 'mixed') return `${ITEM_METER_LABEL[item.meterKind]}: różne stany`
  if (item.condition === 'uniform' && item.uniformConditionPercent != null) {
    return `${ITEM_METER_LABEL[item.meterKind]} ${item.uniformConditionPercent}%`
  }
  return null
}

const emit = defineEmits<{
  'select-item': [item: ItemKind]
  'compare-instance': [instanceId: string]
  'compare-kind': [kind: ItemKind]
}>()

useTouchScroll(panel)

function formatWeight(kg: number): string { return `${kg.toFixed(1)} kg` }

function onDrop(kind: ItemKind, count: number): void {
  if (count <= 1) { ui.inventory.onDrop?.(kind, count); return }
  openQuantityDialog(`Wyrzuć: ${itemDisplayName(kind)}`, count, (amount) => ui.inventory.onDrop?.(kind, amount))
}
function onEquip(kind: ItemKind): void { ui.inventory.onEquip?.(kind) }
function onUnequip(): void { ui.inventory.onUnequip?.() }
function onConsume(kind: ItemKind): void { ui.inventory.onConsume?.(kind) }
function onThrow(kind: ItemKind): void { ui.inventory.onThrow?.(kind) }
function onRead(kind: ItemKind): void { ui.inventory.onRead?.(kind) }
function onPlaceTrap(kind: ItemKind): void {
  const trapKind = trapKindForItem(kind)
  if (trapKind) ui.inventory.onPlaceTrap?.(trapKind)
}
function onPlaceContainer(): void { ui.inventory.onPlaceContainer?.() }
function onPlaceTent(): void { ui.inventory.onPlaceTent?.() }

function resolvePrimaryInstanceId(kind: ItemKind, instances: readonly InventoryInstanceRow[]): string | null {
  if (!isWeaponMaintenanceKind(kind)) return null
  return instances[0]?.id ?? null
}

function isPrimaryMeleeItem(kind: ItemKind): boolean {
  const choice = ui.inventory.primaryMelee
  if (!choice || choice.kind !== kind) return false
  if (isWeaponMaintenanceKind(kind)) return true
  return isPrimaryMeleeAssignment(kind, null, choice)
}

function isPrimaryRangedItem(kind: ItemKind): boolean {
  const choice = ui.inventory.primaryRanged
  if (!choice || choice.kind !== kind) return false
  if (isWeaponMaintenanceKind(kind)) return true
  return isPrimaryRangedAssignment(kind, null, choice)
}

function canSetPrimaryMelee(kind: ItemKind): boolean {
  return isMeleeToolKind(kind) && !isPrimaryMeleeItem(kind)
}

function canSetPrimaryRanged(kind: ItemKind): boolean {
  return isRangedTool(kind) && !isPrimaryRangedItem(kind)
}

function setPrimaryMelee(kind: ItemKind, instances: readonly InventoryInstanceRow[]): void {
  ui.inventory.onSetPrimaryMelee?.(kind, resolvePrimaryInstanceId(kind, instances))
}

function setPrimaryRanged(kind: ItemKind, instances: readonly InventoryInstanceRow[]): void {
  ui.inventory.onSetPrimaryRanged?.(kind, resolvePrimaryInstanceId(kind, instances))
}

function isKindCompared(instances: readonly InventoryInstanceRow[]): boolean {
  if (!props.compareInstanceId) return false
  return instances.some((row) => row.id === props.compareInstanceId)
}

function armorQualityLabel(instances: readonly InventoryInstanceRow[]): string | null {
  const labels = instances.map((row) => row.qualityLabel).filter(Boolean)
  if (labels.length === 0) return null
  const first = labels[0]!
  return labels.every((l) => l === first) ? first : 'różne'
}
</script>

<template>
  <div
    ref="panel"
    :class="embedded
      ? 'flex min-w-0 flex-col gap-3'
      : 'max-h-[calc(100dvh-32px)] w-full max-w-3xl overflow-y-auto rounded-[10px] bg-panel p-5 text-ink shadow-[0_12px_40px_rgba(0,0,0,0.45)]'"
    :style="embedded ? undefined : { touchAction: 'pan-y' }"
  >
    <h1
      class="text-lg font-semibold tracking-wide"
      :class="embedded ? 'text-neutral-100' : ''"
    >
      Ekwipunek
    </h1>
    <div
      class="text-[13px]"
      :class="embedded ? 'text-neutral-400' : 'opacity-75'"
    >
      Waga: {{ formatWeight(ui.inventory.totalWeight) }} / {{ formatWeight(ui.inventory.maxWeight) }}
      · Pojemność: {{ ui.inventory.totalSize.toFixed(2) }} / {{ ui.inventory.maxSize.toFixed(2) }}
      <span
        v-if="ui.inventory.heldTool"
        class="ml-2"
        :class="embedded ? 'text-neutral-300' : 'opacity-90'"
      >
        · w ręce: {{ ITEM_DEFS[ui.inventory.heldTool].label }}
      </span>
    </div>
    <div
      v-if="availableCategories.length > 1"
      class="flex flex-wrap items-center gap-1"
    >
      <button
        type="button"
        class="rounded-full border px-2.5 py-0.5 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        :class="filter === 'all'
          ? (embedded ? 'border-neutral-200 bg-neutral-100 text-neutral-900' : 'bg-primary/40 text-ink border-transparent')
          : (embedded ? 'border-neutral-700 text-neutral-300 hover:border-neutral-500' : 'bg-white/5 opacity-70 hover:opacity-100 border-transparent')"
        @click="filter = 'all'"
      >
        Wszystko
      </button>
      <button
        v-for="cat in availableCategories"
        :key="cat"
        type="button"
        class="rounded-full border px-2.5 py-0.5 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
        :class="filter === cat
          ? (embedded ? 'border-neutral-200 bg-neutral-100 text-neutral-900' : 'bg-primary/40 text-ink border-transparent')
          : (embedded ? 'border-neutral-700 text-neutral-300 hover:border-neutral-500' : 'bg-white/5 opacity-70 hover:opacity-100 border-transparent')"
        @click="filter = cat"
      >
        {{ categoryLabel[cat] }}
      </button>
      <select
        v-model="sortMode"
        class="ml-auto rounded border px-2 py-0.5 text-xs"
        :class="embedded ? 'border-neutral-700 bg-neutral-900 text-neutral-200' : 'bg-white/5'"
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

    <ul
      class="divide-y overflow-hidden rounded-lg border"
      :class="embedded ? 'divide-white/10 border-neutral-700' : 'divide-white/10 border-white/10'"
    >
      <li
        v-if="items.length === 0"
        class="px-3 py-6 text-center text-sm"
        :class="embedded ? 'text-neutral-500' : 'opacity-60'"
      >
        {{ allItems.length === 0 ? 'Ekwipunek jest pusty.' : 'Brak przedmiotów w tej kategorii.' }}
      </li>
      <li
        v-for="item in items"
        :key="item.kind"
        class="flex flex-col gap-1 px-3 py-1.5 text-sm"
        :class="[
          embedded ? 'hover:bg-white/5' : 'bg-white/5 mb-0',
          isKindCompared(item.instances) ? 'bg-neutral-800/70' : '',
          ui.inventory.heldTool === item.kind ? 'ring-1 ring-primary/40' : '',
        ]"
      >
        <button
          type="button"
          class="flex w-full cursor-pointer items-baseline justify-between gap-2 text-left hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          @click="emit('select-item', item.kind)"
        >
          <span class="min-w-0 flex-1 font-semibold wrap-break-word">
            <span>{{ item.count }} × {{ item.displayName }}</span>
            <QualityTag
              v-if="isArmorCatalogKind(item.kind) && armorQualityLabel(item.instances)"
              class="ml-1.5 align-middle"
              :label="armorQualityLabel(item.instances)!"
            />
            <span
              v-if="conditionLabel(item)"
              class="ml-1.5 text-[11px] font-normal opacity-70"
            >{{ conditionLabel(item) }}</span>
            <span
              v-if="isPrimaryMeleeItem(item.kind) || isPrimaryRangedItem(item.kind)"
              class="ml-1.5 rounded-full bg-primary/30 px-2 py-0.5 text-[10px] font-medium"
            >
              Podstawowa
            </span>
          </span>
          <span class="shrink-0 text-[11px] uppercase tracking-wide opacity-60">
            {{ categoryLabels(item.def) }}
          </span>
        </button>
        <div
          class="text-xs"
          :class="embedded ? 'text-neutral-400' : 'opacity-70'"
        >
          {{ formatWeight(item.def.weight) }} szt. · {{ formatWeight(item.def.weight * item.count) }} razem
        </div>
        <div class="mt-1 flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap items-center justify-start gap-2">
            <ItemsScreenItemButton
              v-if="isArmorCatalogKind(item.kind) && item.instances.length > 0"
              class="min-h-0 py-1"
              label="Porównaj"
              @click="emit('compare-kind', item.kind)"
            />
            <ItemsScreenItemButton
              v-if="item.consumeUse"
              class="min-h-0 py-1"
              :label="item.consumeUse.reasonLabel ? `${item.consumeUse.label} — ${item.consumeUse.reasonLabel}` : item.consumeUse.label"
              :disabled="!item.consumeUse.enabled"
              @click="onConsume(item.kind)"
            />
            <ItemsScreenItemButton
              v-if="isThrowableKind(item.kind)"
              class="min-h-0 py-1"
              label="Rzuć"
              @click="onThrow(item.kind)"
            />
            <ItemsScreenItemButton
              v-if="item.readAction"
              class="min-h-0 py-1"
              :label="item.readAction.label"
              @click="onRead(item.kind)"
            />
            <ItemsScreenItemButton
              v-if="trapKindForItem(item.kind)"
              class="min-h-0 py-1"
              label="Zastaw"
              @click="onPlaceTrap(item.kind)"
            />
            <ItemsScreenItemButton
              v-if="item.kind === 'chest'"
              class="min-h-0 py-1"
              label="Postaw"
              @click="onPlaceContainer"
            />
            <ItemsScreenItemButton
              v-if="item.kind === 'tent'"
              class="min-h-0 py-1"
              label="Rozstaw"
              @click="onPlaceTent"
            />
            <ItemsScreenItemButton
              v-if="isToolKind(item.kind) && ui.inventory.heldTool !== item.kind"
              class="min-h-0 py-1"
              label="Weź"
              @click="onEquip(item.kind)"
            />
            <ItemsScreenItemButton
              v-if="ui.inventory.heldTool === item.kind"
              class="min-h-0 py-1"
              label="Odłóż"
              @click="onUnequip"
            />
            <ItemsScreenItemButton
              v-if="canSetPrimaryMelee(item.kind)"
              class="min-h-0 py-1"
              label="Ustaw podstawową"
              @click="setPrimaryMelee(item.kind, item.instances)"
            />
            <ItemsScreenItemButton
              v-if="canSetPrimaryRanged(item.kind)"
              class="min-h-0 py-1"
              label="Ustaw podstawową"
              @click="setPrimaryRanged(item.kind, item.instances)"
            />
          </div>
          <div class="flex items-center justify-end gap-2">
            <ItemsScreenItemButton
              class="min-h-0 py-1"
              label="Wyrzuć"
              destructive
              @click="onDrop(item.kind, item.count)"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

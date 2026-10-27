<script setup lang="ts">
/**
 * Stage F (ui-input-044): V3 TradeFilterBar chrome + V1 capability dropdown / price·sort selects.
 * @domain ui
 */
import { computed } from 'vue'
import { useItemCategoryLabels } from '@/composables/useItemCategoryLabels'
import type { CapabilityFilter, CategoryFilter, PriceFilter, TradeFilters, TradeSortMode } from '../composables/useMerchantTradeState'
import { CAPABILITY_LABEL, type ItemCapability } from '../../items/itemCatalog'
import MerchantFilterDropdown from './MerchantFilterDropdown.vue'

const props = defineProps<{
  modelValue: TradeFilters
  availableCapabilities: readonly ItemCapability[]
  sortOptions: readonly { id: TradeSortMode, label: string }[]
  /** Distinguishes BUY vs OFFER Esc-stack ids for the capability menu. */
  side: 'buy' | 'offer'
}>()

const emit = defineEmits<{
  'update:modelValue': [TradeFilters]
}>()

const { categoryLabel } = useItemCategoryLabels()

const categoryChips: { id: CategoryFilter, label: string }[] = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'weapon', label: categoryLabel.weapon },
  { id: 'armor', label: categoryLabel.armor },
  { id: 'tool', label: categoryLabel.tool },
  { id: 'story', label: categoryLabel.story },
  { id: 'knowledge', label: categoryLabel.knowledge },
  { id: 'food', label: categoryLabel.food },
  { id: 'utility', label: categoryLabel.utility },
  { id: 'resource', label: categoryLabel.resource },
  { id: 'other', label: categoryLabel.other },
]

const capabilityOptions = computed(() => [
  { id: 'all' as CapabilityFilter, label: 'Dowolna zdolność' },
  ...props.availableCapabilities.map((id) => ({ id: id as CapabilityFilter, label: CAPABILITY_LABEL[id] })),
])

const capabilityOverlayId = computed(() => `merchant-capability-${props.side}`)

const priceOptions: { id: PriceFilter, label: string }[] = [
  { id: 'all', label: 'Każda cena' },
  { id: 'low', label: '≤10c' },
  { id: 'mid', label: '11–25c' },
  { id: 'high', label: '>25c' },
]

const selectClass = 'rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-xs text-neutral-200'

function pillClass(active: boolean): string {
  return active
    ? 'border-neutral-200 bg-neutral-100 text-neutral-900'
    : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
}

function update(patch: Partial<TradeFilters>): void {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <div class="flex flex-wrap gap-1">
      <button
        v-for="chip in categoryChips"
        :key="chip.id"
        type="button"
        :aria-pressed="modelValue.category === chip.id"
        class="rounded-full border px-2.5 py-0.5 text-xs"
        :class="pillClass(modelValue.category === chip.id)"
        @click="update({ category: chip.id })"
      >
        {{ chip.label }}
      </button>
    </div>
    <div class="flex flex-wrap items-center gap-1">
      <input
        type="search"
        placeholder="Szukaj…"
        aria-label="Szukaj"
        class="min-w-24 flex-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-xs text-neutral-100 placeholder:text-neutral-500"
        :value="modelValue.search"
        @input="update({ search: ($event.target as HTMLInputElement).value })"
      >
      <MerchantFilterDropdown
        v-if="capabilityOptions.length > 1"
        :model-value="modelValue.capability"
        :options="capabilityOptions"
        menu-label="Zdolność"
        :overlay-id="capabilityOverlayId"
        @update:model-value="update({ capability: $event as CapabilityFilter })"
      />
      <select
        :class="selectClass"
        aria-label="Cena"
        :value="modelValue.price"
        @change="update({ price: ($event.target as HTMLSelectElement).value as PriceFilter })"
      >
        <option
          v-for="p in priceOptions"
          :key="p.id"
          :value="p.id"
        >
          {{ p.label }}
        </option>
      </select>
      <select
        :class="selectClass"
        aria-label="Sortuj"
        :value="modelValue.sort"
        @change="update({ sort: ($event.target as HTMLSelectElement).value as TradeSortMode })"
      >
        <option
          v-for="s in sortOptions"
          :key="s.id"
          :value="s.id"
        >
          {{ s.label }}
        </option>
      </select>
    </div>
  </div>
</template>

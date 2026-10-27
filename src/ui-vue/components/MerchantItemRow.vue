<script setup lang="ts">
/**
 * Stage F (ui-input-044): V3 TradeRow-like dense row with always-visible steppers.
 * Emits keep V1 kind/instanceId contracts.
 * @domain ui
 */
import { computed } from 'vue'
import type { ItemKind } from '../../items/items'
import { formatCoins } from '../lib/formatCoins'

const props = defineProps<{
  kind: ItemKind
  label: string
  price: number
  /** Current quantity already in the transaction basket for this kind (0 = not added). */
  committedCount: number
  /** Upper bound for the stepper (owned count for OFFER); `null` = unbounded (BUY, capped only by coins). */
  maxCount: number | null
  ownedCount?: number
  instanceId?: string
  /** Row shown but cannot be added (no trade price). */
  disabled?: boolean
  disabledReason?: string
}>()

const emit = defineEmits<{
  commit: [kind: ItemKind, quantity: number, instanceId?: string]
  clear: [kind: ItemKind, instanceId?: string]
  'open-details': [kind: ItemKind, instanceId?: string]
}>()

const stepperClass = 'grid size-6 place-items-center rounded border border-neutral-600 bg-transparent px-0 py-0 text-xs leading-none text-neutral-200 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-neutral-600'

const effectiveMax = computed(() => {
  if (props.maxCount == null) return Number.POSITIVE_INFINITY
  return Math.max(0, Math.floor(props.maxCount))
})

function set(next: number): void {
  if (props.disabled) return
  const floored = Math.max(0, Math.floor(next))
  const capped = props.maxCount != null ? Math.min(props.maxCount, floored) : floored
  if (capped <= 0) emit('clear', props.kind, props.instanceId)
  else emit('commit', props.kind, capped, props.instanceId)
}

function decrease(): void {
  set(props.committedCount - 1)
}

function add(): void {
  set(props.committedCount + 1)
}

function addAll(): void {
  if (props.maxCount == null || props.maxCount <= 0) return
  set(props.maxCount)
}

const addLabel = computed(() => {
  if (props.disabled) return `${props.label}: brak ceny handlu`
  return props.committedCount > 0 ? `Zwiększ ${props.label}` : `Dodaj ${props.label}`
})
</script>

<template>
  <li
    class="flex items-center gap-2 px-3 py-1.5 text-sm"
    :class="{
      'bg-primary/10': committedCount > 0,
      'opacity-60': disabled,
    }"
  >
    <button
      type="button"
      class="min-w-0 flex-1 text-left text-neutral-100 hover:underline"
      :title="disabled && disabledReason ? disabledReason : 'Szczegóły'"
      @click="emit('open-details', kind, instanceId)"
    >
      <span class="font-medium capitalize">{{ label }}</span>
      <span
        v-if="committedCount > 0"
        class="ml-1 text-xs text-neutral-400 tabular-nums"
      >×{{ committedCount }}</span>
    </button>
    <span
      v-if="ownedCount != undefined && ownedCount > 0"
      class="text-xs text-neutral-400 tabular-nums"
      title="Posiadasz"
    >własne {{ ownedCount }}</span>
    <span class="shrink-0 text-right text-xs text-neutral-200 tabular-nums sm:w-24">
      <template v-if="price > 0">{{ formatCoins(price) }}</template>
      <template v-else>
        —
        <span
          v-if="disabled && disabledReason"
          class="mt-0.5 block text-[10px] leading-tight text-neutral-400 normal-case"
        >{{ disabledReason }}</span>
      </template>
    </span>
    <span class="flex w-20 shrink-0 items-center justify-end gap-1">
      <template v-if="committedCount > 0">
        <button
          type="button"
          :class="stepperClass"
          :aria-label="`Zmniejsz ${label}`"
          :disabled="disabled"
          @click="decrease"
        >
          −
        </button>
        <span class="min-w-5 text-center text-xs tabular-nums">{{ committedCount }}</span>
      </template>
      <button
        type="button"
        :class="stepperClass"
        :disabled="disabled || committedCount >= effectiveMax"
        :aria-label="addLabel"
        :title="disabled ? (disabledReason ?? 'Brak ceny handlu') : (committedCount > 0 ? 'Jeszcze jeden' : 'Dodaj do transakcji')"
        @click="add"
      >
        +
      </button>
      <button
        v-if="maxCount != null && maxCount > 1 && committedCount === 0"
        type="button"
        :class="[stepperClass, 'w-auto px-1.5']"
        :disabled="disabled"
        :aria-label="`Dodaj wszystkie ${label}`"
        title="Wszystkie"
        @click="addAll"
      >
        all
      </button>
    </span>
  </li>
</template>

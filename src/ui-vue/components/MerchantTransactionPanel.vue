<script setup lang="ts">
/**
 * Stage F (ui-input-044): V3 TransactionPanel chrome; V1 Handluj + Polish summary.
 * @domain ui
 */
import { ref } from 'vue'
import type { ItemKind } from '../../items/items'
import { useTouchScroll } from '../composables/useTouchScroll'
import { formatCoins } from '../lib/formatCoins'

export type TransactionLine = {
  kind: ItemKind
  label: string
  count: number
  totalValue: number
  instanceId?: string
}

const props = defineProps<{
  purchases: readonly TransactionLine[]
  offerItems: readonly TransactionLine[]
  /** Positive = "To pay", negative = "You receive", 0 = nothing to settle. */
  netCoins: number
  coins: number
  canTrade: boolean
  /** Why Handluj is disabled (amber); optional. */
  problem?: string
}>()

const emit = defineEmits<{
  trade: []
  'remove-purchase': [kind: ItemKind, instanceId?: string]
  'remove-offer': [kind: ItemKind]
}>()

const list = ref<HTMLElement | null>(null)
useTouchScroll(list)

function afterTrade(): number {
  return props.coins - props.netCoins
}

const removeClass = 'border-transparent bg-transparent px-0 py-0 text-xs text-neutral-500 hover:text-neutral-100'
const netLabel = () => {
  if (props.netCoins > 0) return 'Do zapłaty'
  if (props.netCoins < 0) return 'Otrzymasz'
  return 'Równo'
}
</script>

<template>
  <section class="flex min-h-0 flex-col gap-2">
    <h2 class="shrink-0 text-lg font-semibold text-neutral-100">
      Transakcja
    </h2>
    <div
      ref="list"
      class="max-h-72 min-h-16 flex-1 space-y-2 overflow-y-auto"
      style="touch-action: pan-y"
    >
      <p
        v-if="purchases.length === 0 && offerItems.length === 0"
        class="text-sm text-neutral-500"
      >
        Wybierz towary do kupienia lub oferowane przedmioty.
      </p>
      <div v-if="purchases.length > 0">
        <p class="mb-1 text-xs text-neutral-500">
          BUY
        </p>
        <div
          v-for="line in purchases"
          :key="`buy-${line.instanceId ?? line.kind}`"
          class="flex items-center justify-between gap-2 rounded bg-neutral-800/60 px-2 py-1 text-sm"
        >
          <span class="min-w-0 truncate capitalize text-neutral-100">{{ line.label }} ×{{ line.count }}</span>
          <span class="flex shrink-0 items-center gap-2">
            <span class="text-xs text-neutral-300 tabular-nums">{{ formatCoins(line.totalValue) }}</span>
            <button
              type="button"
              :class="removeClass"
              :aria-label="`Usuń ${line.label}`"
              @click="emit('remove-purchase', line.kind, line.instanceId)"
            >
              ✕
            </button>
          </span>
        </div>
      </div>
      <div v-if="offerItems.length > 0">
        <p class="mb-1 text-xs text-neutral-500">
          OFFER
        </p>
        <div
          v-for="line in offerItems"
          :key="`offer-${line.kind}`"
          class="flex items-center justify-between gap-2 rounded bg-neutral-800/60 px-2 py-1 text-sm"
        >
          <span class="min-w-0 truncate capitalize text-neutral-100">{{ line.label }} ×{{ line.count }}</span>
          <span class="flex shrink-0 items-center gap-2">
            <span class="text-xs text-neutral-300 tabular-nums">−{{ formatCoins(line.totalValue) }}</span>
            <button
              type="button"
              :class="removeClass"
              :aria-label="`Usuń ${line.label}`"
              @click="emit('remove-offer', line.kind)"
            >
              ✕
            </button>
          </span>
        </div>
      </div>
    </div>

    <dl class="space-y-1 border-t border-neutral-800 pt-2 text-sm">
      <div class="flex justify-between text-neutral-100">
        <dt>{{ netLabel() }}</dt>
        <dd class="font-semibold tabular-nums">
          {{ formatCoins(Math.abs(netCoins)) }}
        </dd>
      </div>
      <div class="flex justify-between text-xs text-neutral-400">
        <dt>Twoja sakiewka</dt>
        <dd class="tabular-nums">
          {{ formatCoins(coins) }}
        </dd>
      </div>
      <div class="flex justify-between text-xs text-neutral-400">
        <dt>Po transakcji</dt>
        <dd class="tabular-nums">
          {{ formatCoins(afterTrade()) }}
        </dd>
      </div>
    </dl>
    <p
      v-if="problem"
      id="merchant-transaction-problem"
      class="text-xs text-amber-400"
    >
      {{ problem }}
    </p>
    <button
      type="button"
      class="w-full rounded-md border border-neutral-600 bg-primary/90 px-3 py-1.5 text-sm font-medium text-neutral-950 hover:bg-primary disabled:cursor-not-allowed disabled:border-neutral-700 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:opacity-100"
      :disabled="!canTrade"
      :aria-describedby="problem ? 'merchant-transaction-problem' : undefined"
      @click="emit('trade')"
    >
      {{ canTrade ? '✓ Handluj' : '🔒 Handluj' }}
    </button>
  </section>
</template>

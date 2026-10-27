<script setup lang="ts">
/**
 * Stage F D9 demo — same merchant presentation leaves as live MerchantScreen.
 * Fixtures and callbacks are demo-local only (no world / save / WorldBundle).
 * @domain ui
 */
import { computed, ref, watch } from 'vue'
import { hasItemKindCategory, type ItemKind } from '../../../items/items'
import MerchantFilterBar from '../../components/MerchantFilterBar.vue'
import MerchantItemRow from '../../components/MerchantItemRow.vue'
import MerchantTabButton from '../../components/MerchantTabButton.vue'
import MerchantTransactionPanel, { type TransactionLine } from '../../components/MerchantTransactionPanel.vue'
import {
  type CapabilityFilter,
  type TradeFilters,
  useMerchantTradeState,
} from '../../composables/useMerchantTradeState'
import { formatCoins } from '../../lib/formatCoins'
import DemoShell from '../DemoShell.vue'
import { DEMO_SCENARIOS, type DemoViewId } from './fixtures'

const selectedId = ref<DemoViewId>('merchant-stock')
const log = ref<string[]>([])
const compact = ref(false)
const activeContext = ref<'buy' | 'offer'>('buy')
const drawerOpen = ref(false)

const {
  buyFilters, offerFilters, transaction, resetAll,
  setPurchaseCount, setPurchaseInstance, setOfferCount,
  matchesCategory, matchesCapability, matchesPrice, matchesSearch, sortRows,
} = useMerchantTradeState()

const scenario = computed(() => DEMO_SCENARIOS.find((s) => s.id === selectedId.value) ?? DEMO_SCENARIOS[0])

const BUY_SORT_OPTIONS = [
  { id: 'name' as const, label: 'Nazwa' },
  { id: 'price-asc' as const, label: 'Cena ↑' },
  { id: 'price-desc' as const, label: 'Cena ↓' },
  { id: 'weight' as const, label: 'Waga' },
]
const OFFER_SORT_OPTIONS = [
  ...BUY_SORT_OPTIONS,
  { id: 'condition' as const, label: 'Stan' },
]

watch(selectedId, () => {
  resetAll()
  activeContext.value = 'buy'
  drawerOpen.value = false
  log.value = []
})

function selectScenario(id: DemoViewId): void {
  selectedId.value = id
}

function resetDemo(): void {
  selectScenario('merchant-stock')
  compact.value = false
}

function pushLog(message: string): void {
  log.value = [`[demo] ${message}`, ...log.value].slice(0, 8)
}

const buyCapabilities = computed(() => {
  const set = new Set<Exclude<CapabilityFilter, 'all'>>()
  for (const row of scenario.value.buyRows) {
    for (const cap of row.capabilities) set.add(cap)
  }
  return [...set]
})

const offerCapabilities = computed(() => {
  const set = new Set<Exclude<CapabilityFilter, 'all'>>()
  for (const row of scenario.value.offerRows) {
    for (const cap of row.capabilities) set.add(cap)
  }
  return [...set]
})

function filterBuy(filters: TradeFilters) {
  const rows = scenario.value.buyRows.flatMap((row) => {
    if (!matchesCategory(row.kind, filters, hasItemKindCategory)) return []
    if (!matchesCapability(row.capabilities, filters)) return []
    if (!matchesPrice(row.price, filters)) return []
    if (!matchesSearch(row.label, filters)) return []
    return [{
      kind: row.kind,
      label: row.label,
      price: row.price,
      weight: 1,
      conditionPercent: null as number | null,
      instanceId: row.instanceId,
      maxCount: row.maxCount,
      ownedCount: row.ownedCount,
    }]
  })
  return sortRows(rows, filters.sort)
}

function filterOffer(filters: TradeFilters) {
  const rows = scenario.value.offerRows.flatMap((row) => {
    if (!matchesCategory(row.kind, filters, hasItemKindCategory)) return []
    if (!matchesCapability(row.capabilities, filters)) return []
    if (!matchesPrice(row.price, filters)) return []
    if (!matchesSearch(row.label, filters)) return []
    return [{
      kind: row.kind,
      label: row.label,
      price: row.price,
      weight: 1,
      conditionPercent: null as number | null,
      ownedCount: row.ownedCount,
    }]
  })
  return sortRows(rows, filters.sort)
}

const buyRows = computed(() => filterBuy(buyFilters))
const offerRows = computed(() => filterOffer(offerFilters))

const purchaseLines = computed<TransactionLine[]>(() => {
  const stack = (Object.entries(transaction.purchases) as [ItemKind, number][])
    .filter(([, count]) => count > 0)
    .map(([kind, count]) => {
      const row = scenario.value.buyRows.find((r) => r.kind === kind && !r.instanceId)
      return {
        kind,
        label: row?.label ?? kind,
        count,
        totalValue: (row?.price ?? 0) * count,
      }
    })
  const instances = transaction.purchaseInstanceIds.flatMap((instanceId) => {
    const row = scenario.value.buyRows.find((r) => r.instanceId === instanceId)
    if (!row) return []
    return [{
      kind: row.kind,
      instanceId,
      label: row.label,
      count: 1,
      totalValue: row.price,
    }]
  })
  return [...stack, ...instances]
})

const offerLines = computed<TransactionLine[]>(() =>
  (Object.entries(transaction.offer) as [ItemKind, number][])
    .filter(([, count]) => count > 0)
    .map(([kind, count]) => {
      const row = scenario.value.offerRows.find((r) => r.kind === kind)
      return {
        kind,
        label: row?.label ?? kind,
        count,
        totalValue: (row?.price ?? 0) * count,
      }
    }),
)

const netCoins = computed(() => {
  const buy = purchaseLines.value.reduce((sum, line) => sum + line.totalValue, 0)
  const offer = offerLines.value.reduce((sum, line) => sum + line.totalValue, 0)
  return buy - offer
})

const canTrade = computed(() => purchaseLines.value.length > 0 || offerLines.value.length > 0)
const lineCount = computed(() => purchaseLines.value.length + offerLines.value.length)
const tradeProblem = computed(() => (canTrade.value ? undefined : 'Wybierz towary do kupienia lub oferowane przedmioty.'))

function onCommitPurchase(kind: ItemKind, quantity: number, instanceId?: string): void {
  if (instanceId) {
    setPurchaseInstance(instanceId, quantity > 0)
    pushLog(`BUY instance ${instanceId} → ${quantity > 0 ? 'in basket' : 'cleared'}`)
    return
  }
  const max = buyRows.value.find((row) => row.kind === kind && !row.instanceId)?.maxCount
  setPurchaseCount(kind, quantity, max)
  pushLog(`BUY ${kind} ×${quantity}`)
}

function onClearPurchase(kind: ItemKind, instanceId?: string): void {
  if (instanceId) setPurchaseInstance(instanceId, false)
  else setPurchaseCount(kind, 0)
  pushLog(`clear BUY ${instanceId ?? kind}`)
}

function onCommitOffer(kind: ItemKind, quantity: number): void {
  const max = offerRows.value.find((row) => row.kind === kind)?.ownedCount
  setOfferCount(kind, quantity, max)
  pushLog(`OFFER ${kind} ×${quantity}`)
}

function onClearOffer(kind: ItemKind): void {
  setOfferCount(kind, 0)
  pushLog(`clear OFFER ${kind}`)
}

function onTrade(): void {
  if (!canTrade.value) return
  pushLog(`Handluj (demo-local) net=${netCoins.value} — bez save`)
  transaction.purchases = {}
  transaction.purchaseInstanceIds = []
  transaction.offer = {}
  drawerOpen.value = false
}

function onBuyHorse(label: string): void {
  pushLog(`Kup konia „${label}” (demo-local only)`)
}
</script>

<template>
  <DemoShell
    current="merchant"
    title="Shop (demo)"
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
          :class="compact ? 'border-amber-400/60 bg-amber-900/30' : ''"
          @click="compact = !compact"
        >
          {{ compact ? 'Compact ON' : 'Compact OFF' }}
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

    <div
      class="sv-merchant mx-auto flex max-w-7xl flex-col overflow-hidden rounded-xl border border-white/15 bg-neutral-900/85 p-5 text-neutral-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
      :class="compact ? 'min-h-[32rem]' : 'min-h-[36rem]'"
    >
      <div class="mb-2 flex shrink-0 flex-wrap items-baseline justify-between gap-2 text-sm">
        <h2 class="text-base font-semibold tracking-wide text-primary">
          {{ scenario.title }}
        </h2>
        <p class="tabular-nums text-neutral-300">
          <span class="text-neutral-500">Sakiewka:</span> {{ formatCoins(scenario.coins) }}
        </p>
      </div>

      <div
        v-if="!compact"
        class="grid min-h-0 flex-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_18rem]"
      >
        <section class="flex min-h-0 min-w-0 flex-col gap-2">
          <h3 class="shrink-0 text-lg font-semibold">
            BUY
          </h3>
          <MerchantFilterBar
            v-if="scenario.buyRows.length > 0 || scenario.mode === 'merchant'"
            side="buy"
            class="shrink-0"
            :model-value="buyFilters"
            :available-capabilities="buyCapabilities"
            :sort-options="BUY_SORT_OPTIONS"
            @update:model-value="Object.assign(buyFilters, $event)"
          />
          <div
            v-if="scenario.horseOffers.length"
            class="flex shrink-0 flex-col gap-1.5"
          >
            <div
              v-for="(offer, i) in scenario.horseOffers"
              :key="`horse-${i}`"
              class="flex items-center justify-between gap-2 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2"
            >
              <div class="min-w-0">
                <p class="text-sm font-medium capitalize">
                  {{ offer.label }}
                </p>
                <p class="text-xs text-neutral-400">
                  {{ formatCoins(offer.price) }}
                </p>
                <p
                  v-if="offer.statusHint"
                  class="mt-1 text-xs text-neutral-300"
                >
                  {{ offer.statusHint }}
                </p>
              </div>
              <button
                v-if="offer.status === 'available'"
                type="button"
                class="shrink-0 rounded-md border border-neutral-600 px-2 py-1 text-xs"
                @click="onBuyHorse(offer.label)"
              >
                Kup
              </button>
              <span
                v-else
                class="shrink-0 rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-neutral-500"
              >
                Niedostępny
              </span>
            </div>
          </div>
          <ul class="min-h-0 flex-1 divide-y divide-neutral-800 overflow-y-auto rounded-lg border border-neutral-800">
            <li
              v-if="scenario.emptyBuyCopy || (buyRows.length === 0 && !scenario.horseOffers.length)"
              class="px-3 py-6 text-center text-sm text-neutral-500"
            >
              {{ scenario.emptyBuyCopy ?? 'Brak towarów w tej kategorii.' }}
            </li>
            <MerchantItemRow
              v-for="row in buyRows"
              :key="row.instanceId ?? row.kind"
              :kind="row.kind"
              :instance-id="row.instanceId"
              :label="row.label"
              :price="row.price"
              :committed-count="row.instanceId
                ? (transaction.purchaseInstanceIds.includes(row.instanceId) ? 1 : 0)
                : (transaction.purchases[row.kind] ?? 0)"
              :max-count="row.maxCount"
              :owned-count="row.ownedCount"
              @commit="onCommitPurchase"
              @clear="onClearPurchase"
              @open-details="(k, id) => pushLog(`details BUY ${k} ${id ?? ''}`)"
            />
          </ul>
        </section>

        <section class="flex min-h-0 min-w-0 flex-col gap-2">
          <h3 class="shrink-0 text-lg font-semibold">
            OFFER
          </h3>
          <MerchantFilterBar
            side="offer"
            class="shrink-0"
            :model-value="offerFilters"
            :available-capabilities="offerCapabilities"
            :sort-options="OFFER_SORT_OPTIONS"
            @update:model-value="Object.assign(offerFilters, $event)"
          />
          <ul class="min-h-0 flex-1 divide-y divide-neutral-800 overflow-y-auto rounded-lg border border-neutral-800">
            <li
              v-if="offerRows.length === 0"
              class="px-3 py-6 text-center text-sm text-neutral-500"
            >
              {{ scenario.offerRows.length === 0 ? 'Ekwipunek jest pusty.' : 'Brak towarów w tej kategorii.' }}
            </li>
            <MerchantItemRow
              v-for="row in offerRows"
              :key="row.kind"
              :kind="row.kind"
              :label="row.label"
              :price="row.price"
              :committed-count="transaction.offer[row.kind] ?? 0"
              :max-count="row.ownedCount"
              :owned-count="row.ownedCount"
              @commit="onCommitOffer"
              @clear="onClearOffer"
              @open-details="(k) => pushLog(`details OFFER ${k}`)"
            />
          </ul>
        </section>

        <section class="flex min-h-0 min-w-0 flex-col">
          <MerchantTransactionPanel
            :purchases="purchaseLines"
            :offer-items="offerLines"
            :net-coins="netCoins"
            :coins="scenario.coins"
            :can-trade="canTrade"
            :problem="tradeProblem"
            @trade="onTrade"
            @remove-purchase="onClearPurchase"
            @remove-offer="onClearOffer"
          />
        </section>
      </div>

      <div
        v-else
        class="flex min-h-0 flex-1 flex-col gap-2"
      >
        <nav class="flex shrink-0 gap-2">
          <MerchantTabButton
            label="BUY"
            :active="activeContext === 'buy'"
            @click="activeContext = 'buy'"
          />
          <MerchantTabButton
            label="OFFER"
            :active="activeContext === 'offer'"
            @click="activeContext = 'offer'"
          />
        </nav>
        <section
          v-if="activeContext === 'buy'"
          class="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden"
        >
          <MerchantFilterBar
            v-if="scenario.buyRows.length > 0 || scenario.mode === 'merchant'"
            side="buy"
            :model-value="buyFilters"
            :available-capabilities="buyCapabilities"
            :sort-options="BUY_SORT_OPTIONS"
            @update:model-value="Object.assign(buyFilters, $event)"
          />
          <ul class="min-h-0 flex-1 divide-y divide-neutral-800 overflow-y-auto rounded-lg border border-neutral-800">
            <MerchantItemRow
              v-for="row in buyRows"
              :key="row.instanceId ?? row.kind"
              :kind="row.kind"
              :instance-id="row.instanceId"
              :label="row.label"
              :price="row.price"
              :committed-count="row.instanceId
                ? (transaction.purchaseInstanceIds.includes(row.instanceId) ? 1 : 0)
                : (transaction.purchases[row.kind] ?? 0)"
              :max-count="row.maxCount"
              :owned-count="row.ownedCount"
              @commit="onCommitPurchase"
              @clear="onClearPurchase"
              @open-details="(k, id) => pushLog(`details BUY ${k} ${id ?? ''}`)"
            />
          </ul>
        </section>
        <section
          v-else
          class="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden"
        >
          <MerchantFilterBar
            side="offer"
            :model-value="offerFilters"
            :available-capabilities="offerCapabilities"
            :sort-options="OFFER_SORT_OPTIONS"
            @update:model-value="Object.assign(offerFilters, $event)"
          />
          <ul class="min-h-0 flex-1 divide-y divide-neutral-800 overflow-y-auto rounded-lg border border-neutral-800">
            <MerchantItemRow
              v-for="row in offerRows"
              :key="row.kind"
              :kind="row.kind"
              :label="row.label"
              :price="row.price"
              :committed-count="transaction.offer[row.kind] ?? 0"
              :max-count="row.ownedCount"
              :owned-count="row.ownedCount"
              @commit="onCommitOffer"
              @clear="onClearOffer"
              @open-details="(k) => pushLog(`details OFFER ${k}`)"
            />
          </ul>
        </section>
        <button
          type="button"
          class="flex shrink-0 items-center justify-between rounded-lg border border-neutral-500 bg-neutral-900 px-4 py-2 text-sm"
          @click="drawerOpen = true"
        >
          <span>Transakcja · {{ lineCount }}</span>
          <span class="tabular-nums">{{ formatCoins(Math.abs(netCoins)) }}</span>
        </button>
      </div>
    </div>

    <div
      v-if="compact && drawerOpen"
      class="fixed inset-0 z-30 flex items-end justify-center bg-black/60 sm:items-center"
      @click.self="drawerOpen = false"
    >
      <div class="sv-merchant w-[min(520px,calc(100vw-32px))] rounded-xl border border-white/15 bg-neutral-900/95 p-4">
        <button
          type="button"
          class="mb-2 ml-auto block text-sm text-neutral-400 hover:text-neutral-100"
          @click="drawerOpen = false"
        >
          Zamknij
        </button>
        <MerchantTransactionPanel
          :purchases="purchaseLines"
          :offer-items="offerLines"
          :net-coins="netCoins"
          :coins="scenario.coins"
          :can-trade="canTrade"
          :problem="tradeProblem"
          @trade="onTrade"
          @remove-purchase="onClearPurchase"
          @remove-offer="onClearOffer"
        />
      </div>
    </div>
  </DemoShell>
</template>

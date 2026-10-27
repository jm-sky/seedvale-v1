<script setup lang="ts">
/**
 * Stage F (ui-input-044): V3 Trade / Merchant chrome; V1 basket + settle ownership unchanged.
 * @domain ui
 */
import { computed, ref, watch } from 'vue'
import MerchantTabButton from '@/components/MerchantTabButton.vue'
import { ITEM_CATALOG, type ItemCapability } from '../../items/itemCatalog'
import { itemDisplayName } from '../../items/itemDisplay'
import { isInstanceBackedKind } from '../../items/itemInstances'
import { hasItemKindCategory, ITEM_DEFS, type ItemKind } from '../../items/items'
import { merchantPrice } from '../../items/tradeCatalog'
import MerchantFilterBar from '../components/MerchantFilterBar.vue'
import MerchantItemDetailsModal from '../components/MerchantItemDetailsModal.vue'
import MerchantItemRow from '../components/MerchantItemRow.vue'
import MerchantTransactionPanel, { type TransactionLine } from '../components/MerchantTransactionPanel.vue'
import { useCompactMerchantLayout } from '../composables/useCompactMerchantLayout'
import { useMerchantTradeState } from '../composables/useMerchantTradeState'
import { useOverlayScreen } from '../composables/useOverlayScreen'
import { useTouchScroll } from '../composables/useTouchScroll'
import { formatCoins } from '../lib/formatCoins'
import { npcGoodsBuyEmptyCopy } from '../lib/npcGoodsBuyEmptyCopy'
import { closeMerchant, isMerchantOpen, showToast, ui } from '../store'

useOverlayScreen('merchant', isMerchantOpen, closeMerchant)

const drawerOpen = ref(false)
useOverlayScreen('merchant-drawer', () => drawerOpen.value, () => { drawerOpen.value = false })

const detailsKind = ref<ItemKind | null>(null)
const detailsInstanceId = ref<string | undefined>(undefined)
useOverlayScreen('merchant-item-details', () => detailsKind.value !== null, () => {
  detailsKind.value = null
  detailsInstanceId.value = undefined
})

const {
  buyFilters, offerFilters, transaction, resetAll,
  setPurchaseCount, setPurchaseInstance, setOfferCount,
  matchesCategory, matchesCapability, matchesPrice, matchesSearch, sortRows,
} = useMerchantTradeState()
const { isCompact } = useCompactMerchantLayout()

const activeContext = ref<'buy' | 'offer'>('buy')

const merchantBody = ref<HTMLElement | null>(null)
useTouchScroll(merchantBody)

watch(() => ui.merchant.open, (open) => {
  if (!open) return
  resetAll()
  activeContext.value = 'buy'
  drawerOpen.value = false
  detailsKind.value = null
  detailsInstanceId.value = undefined
})

const coins = computed(() => ui.merchant.counts.coin ?? 0)
const horseOffers = computed(() => ui.merchant.horseOffers)
const hasHorseOffers = computed(() => horseOffers.value.length > 0)

/** Ordinary NPC household-goods session (plan settlements-npcs-033, barter
 *  extended by settlements-npcs-055) — no `MERCHANT_STOCK` catalog; BUY rows
 *  come from the live, quantity-limited `ui.merchant.npcStock` instead. The
 *  OFFER column is shared with Merchant sessions (settlements-npcs-055). */
const isNpcGoodsMode = computed(() => ui.merchant.mode === 'npcGoods')
const hasNpcGoodsStock = computed(() => ui.merchant.npcStock.length > 0)
const screenTitle = computed(() => (isNpcGoodsMode.value ? (ui.merchant.npc?.displayName ?? 'Handel') : 'Kupiec'))

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

const buyCapabilities = computed<ItemCapability[]>(() => {
  const set = new Set<ItemCapability>()
  for (const row of ui.merchant.npcStock) {
    for (const cap of ITEM_CATALOG[row.kind].capabilities ?? []) set.add(cap)
  }
  return [...set]
})

const offerableKinds = computed<ItemKind[]>(() => (Object.keys(ITEM_DEFS) as ItemKind[]).filter((kind) => {
  if (kind === 'shell' || kind === 'coin') return false
  return (ui.merchant.counts[kind] ?? 0) > 0
}))

const offerCapabilities = computed<ItemCapability[]>(() => {
  const set = new Set<ItemCapability>()
  for (const kind of offerableKinds.value) {
    for (const cap of ITEM_CATALOG[kind].capabilities ?? []) set.add(cap)
  }
  return [...set]
})

function conditionForOffer(kind: ItemKind): number | null {
  if (!isInstanceBackedKind(kind)) return null
  const group = ui.merchant.groups.find((entry) => entry.kind === kind)
  if (!group || group.instances.length === 0) return null
  if (group.condition === 'uniform') return group.uniformConditionPercent
  return group.instances.reduce((sum, inst) => sum + inst.conditionPercent, 0) / group.instances.length
}

const buyRows = computed(() => {
  const rows = ui.merchant.npcStock.flatMap((stock) => {
    if (!matchesCategory(stock.kind, buyFilters, hasItemKindCategory)) return []
    if (!matchesCapability(ITEM_CATALOG[stock.kind].capabilities, buyFilters)) return []
    if (!matchesPrice(stock.unitPrice, buyFilters)) return []
    const label = stock.qualityLabel
      ? `${itemDisplayName(stock.kind)} — ${stock.qualityLabel}`
      : itemDisplayName(stock.kind)
    if (!matchesSearch(label, buyFilters) && !matchesSearch(itemDisplayName(stock.kind), buyFilters)) return []
    return [{
      kind: stock.kind,
      instanceId: stock.instanceId,
      label,
      price: stock.unitPrice,
      weight: stock.weightKg ?? ITEM_DEFS[stock.kind].weight,
      conditionPercent: null as number | null,
      maxCount: stock.quantity as number | null,
    }]
  })
  return sortRows(rows, buyFilters.sort)
})

const npcGoodsEmptyCopy = computed(() => (
  isNpcGoodsMode.value ? npcGoodsBuyEmptyCopy(ui.merchant.npcStock.length, buyRows.value.length) : null
))

const offerRows = computed(() => {
  const unitOfferPrice = ui.merchant.pricing?.unitOfferPrice
  const rows = offerableKinds.value.flatMap((kind) => {
    const price = unitOfferPrice?.(kind) ?? 0
    if (!matchesCategory(kind, offerFilters, hasItemKindCategory)) return []
    if (!matchesCapability(ITEM_CATALOG[kind].capabilities, offerFilters)) return []
    if (!matchesPrice(price, offerFilters)) return []
    const label = itemDisplayName(kind)
    if (!matchesSearch(label, offerFilters)) return []
    return [{
      kind,
      label,
      price,
      weight: ITEM_DEFS[kind].weight,
      conditionPercent: conditionForOffer(kind),
    }]
  })
  return sortRows(rows, offerFilters.sort)
})

function ownedCount(kind: ItemKind): number {
  return ui.merchant.counts[kind] ?? 0
}

function onCommitPurchase(kind: ItemKind, quantity: number, instanceId?: string): void {
  if (instanceId) {
    setPurchaseInstance(instanceId, quantity > 0)
    return
  }
  const max = buyRows.value.find((row) => row.kind === kind && !row.instanceId)?.maxCount ?? undefined
  setPurchaseCount(kind, quantity, max)
}
function onClearPurchase(kind: ItemKind, instanceId?: string): void {
  if (instanceId) {
    setPurchaseInstance(instanceId, false)
    return
  }
  setPurchaseCount(kind, 0)
}
function onCommitOffer(kind: ItemKind, quantity: number): void {
  setOfferCount(kind, quantity, ownedCount(kind))
}
function onClearOffer(kind: ItemKind): void {
  setOfferCount(kind, 0)
}

function purchaseUnitPrice(kind: ItemKind, instanceId?: string): number {
  const row = instanceId
    ? ui.merchant.npcStock.find((entry) => entry.instanceId === instanceId)
    : ui.merchant.npcStock.find((entry) => entry.kind === kind && !entry.instanceId)
  if (row) return row.unitPrice
  return isNpcGoodsMode.value ? 0 : merchantPrice(kind) ?? 0
}

const purchaseLines = computed<TransactionLine[]>(() => {
  const stackLines = (Object.entries(transaction.purchases) as [ItemKind, number][])
    .filter(([, count]) => count > 0)
    .map(([kind, count]) => ({
      kind,
      label: itemDisplayName(kind),
      count,
      totalValue: purchaseUnitPrice(kind) * count,
    }))
  const instanceLines = transaction.purchaseInstanceIds.flatMap((instanceId) => {
    const stock = ui.merchant.npcStock.find((entry) => entry.instanceId === instanceId)
    if (!stock) return []
    const label = stock.qualityLabel
      ? `${itemDisplayName(stock.kind)} — ${stock.qualityLabel}`
      : itemDisplayName(stock.kind)
    return [{
      kind: stock.kind,
      instanceId,
      label,
      count: 1,
      totalValue: stock.unitPrice,
    }]
  })
  return [...stackLines, ...instanceLines]
})

const offerLines = computed<TransactionLine[]>(() => {
  const offerLineTotal = ui.merchant.pricing?.offerLineTotal
  return (Object.entries(transaction.offer) as [ItemKind, number][])
    .filter(([, count]) => count > 0)
    .map(([kind, count]) => ({
      kind,
      label: itemDisplayName(kind),
      count,
      totalValue: offerLineTotal?.(kind, count) ?? 0,
    }))
})

const netCoins = computed(() => {
  const instanceBuyCost = transaction.purchaseInstanceIds.reduce((sum, instanceId) => {
    const stock = ui.merchant.npcStock.find((entry) => entry.instanceId === instanceId)
    return sum + (stock?.unitPrice ?? 0)
  }, 0)
  if (isNpcGoodsMode.value) {
    const stackCost = (Object.entries(transaction.purchases) as [ItemKind, number][])
      .reduce((sum, [kind, count]) => (count > 0 ? sum + purchaseUnitPrice(kind) * count : sum), 0)
    const totalBuyCost = stackCost + instanceBuyCost
    return ui.merchant.pricing?.previewNetCoinsForCost(totalBuyCost, transaction.offer) ?? totalBuyCost
  }
  return ui.merchant.pricing?.previewNetCoins(transaction.purchases, transaction.offer, instanceBuyCost) ?? 0
})
const canTrade = computed(() => purchaseLines.value.length > 0 || offerLines.value.length > 0)
const lineCount = computed(() => purchaseLines.value.length + offerLines.value.length)
const trading = ref(false)
const tradeProblem = computed(() => {
  if (canTrade.value) return undefined
  return 'Wybierz towary do kupienia lub oferowane przedmioty.'
})

/** Ordinary NPC household stock can shrink while the screen sits open (a
 *  household production tick, or a prior purchase this session) — clamp the
 *  basket to what's still actually available rather than letting a stale
 *  quantity reach `onTrade`, mirroring the merchant catalog/owned-count
 *  staleness guard below (plan settlements-npcs-033 §4). The OFFER basket
 *  clamps against the player's own current counts, same as merchant mode
 *  (plan settlements-npcs-055) — it is no longer wiped just because the
 *  session is `npcGoods`. */
function clampStaleNpcGoodsTransaction(): boolean {
  let changed = false
  const nextPurchases: Partial<Record<ItemKind, number>> = {}
  for (const [kind, count] of Object.entries(transaction.purchases) as [ItemKind, number][]) {
    const row = ui.merchant.npcStock.find((entry) => entry.kind === kind)
    if (!row || row.quantity <= 0) { changed = true; continue }
    const clamped = Math.min(row.quantity, count)
    if (clamped !== count) changed = true
    nextPurchases[kind] = clamped
  }
  if (transaction.purchaseInstanceIds.length > 0) changed = true
  const nextOffer: Partial<Record<ItemKind, number>> = {}
  for (const [kind, count] of Object.entries(transaction.offer) as [ItemKind, number][]) {
    const owned = ownedCount(kind)
    if (owned <= 0) { changed = true; continue }
    const clamped = Math.min(owned, count)
    if (clamped !== count) changed = true
    nextOffer[kind] = clamped
  }
  if (changed) {
    transaction.purchases = nextPurchases
    transaction.purchaseInstanceIds = []
    transaction.offer = nextOffer
  }
  return changed
}

function clampStaleTransaction(): boolean {
  if (isNpcGoodsMode.value) return clampStaleNpcGoodsTransaction()
  let changed = false
  const nextPurchases: Partial<Record<ItemKind, number>> = {}
  for (const [kind, count] of Object.entries(transaction.purchases) as [ItemKind, number][]) {
    const row = ui.merchant.npcStock.find((entry) => entry.kind === kind && !entry.instanceId)
    if (!row || row.quantity <= 0 || merchantPrice(kind) == null) { changed = true; continue }
    const clamped = Math.min(row.quantity, count)
    if (clamped !== count) changed = true
    nextPurchases[kind] = clamped
  }
  const liveInstanceIds = new Set(
    ui.merchant.npcStock.flatMap((entry) => (entry.instanceId ? [entry.instanceId] : [])),
  )
  const nextInstanceIds = transaction.purchaseInstanceIds.filter((id) => liveInstanceIds.has(id))
  if (nextInstanceIds.length !== transaction.purchaseInstanceIds.length) changed = true
  const nextOffer: Partial<Record<ItemKind, number>> = {}
  for (const [kind, count] of Object.entries(transaction.offer) as [ItemKind, number][]) {
    const owned = ownedCount(kind)
    if (owned <= 0) { changed = true; continue }
    const clamped = Math.min(owned, count)
    if (clamped !== count) changed = true
    nextOffer[kind] = clamped
  }
  if (changed) {
    transaction.purchases = nextPurchases
    transaction.purchaseInstanceIds = nextInstanceIds
    transaction.offer = nextOffer
  }
  return changed
}

async function onTrade(): Promise<void> {
  if (trading.value) return
  if (clampStaleTransaction()) {
    showToast('Oferta się zmieniła — sprawdź transakcję ponownie.', 'error')
    return
  }
  trading.value = true
  try {
    const result = await ui.merchant.onSettleTransaction?.(
      transaction.purchases,
      transaction.offer,
      transaction.purchaseInstanceIds,
    ) ?? 'not_sold'
    if (result === 'ok') {
      transaction.purchases = {}
      transaction.purchaseInstanceIds = []
      transaction.offer = {}
      if (isCompact.value) drawerOpen.value = false
      return
    }
    if (result === 'cannot_afford') showToast('Za mało monet.', 'error')
    else if (result === 'full') showToast('Ekwipunek jest za ciężki.', 'error')
    else showToast('Nie da się przeprowadzić tej transakcji.', 'error')
  } finally {
    trading.value = false
  }
}

function onBuyHorse(offer: (typeof horseOffers.value)[number]): void {
  if (offer.status !== 'available') return
  const result = offer.onPurchase(transaction.offer)
  if (result === 'ok') {
    transaction.offer = {}
    if (isCompact.value) drawerOpen.value = false
    return
  }
  if (result === 'cannot_afford') showToast('Za mało monet.', 'error')
  else if (result === 'full') showToast('Ekwipunek jest za ciężki.', 'error')
  else showToast('Nie da się kupić tego konia.', 'error')
}

function openDetails(kind: ItemKind, instanceId?: string): void {
  detailsKind.value = kind
  detailsInstanceId.value = instanceId
}
</script>

<template>
  <div
    v-if="ui.merchant.open"
    class="pointer-events-auto fixed inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px] max-md:items-stretch max-md:p-2"
    @click.self="closeMerchant"
  >
    <div
      class="sv-merchant flex h-[min(760px,calc(100dvh-32px))] w-[min(1360px,calc(100vw-32px))] max-w-7xl flex-col overflow-hidden rounded-xl border border-white/15 bg-neutral-900/85 p-5 text-neutral-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)] max-md:h-[calc(100dvh-16px)] max-md:max-h-none max-md:w-full max-md:p-3"
      :class="isCompact ? 'shop-compact' : ''"
    >
      <div class="mb-2 flex shrink-0 flex-wrap items-baseline justify-between gap-2 text-sm">
        <h2 class="text-base font-semibold tracking-wide text-primary">
          {{ screenTitle }}
        </h2>
        <div class="flex flex-row items-center gap-3">
          <p class="tabular-nums text-neutral-300">
            <span class="text-neutral-500">Sakiewka:</span> {{ formatCoins(coins) }}
          </p>
          <button
            type="button"
            class="rounded-md border border-neutral-700 px-2 py-1 text-xs text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"
            @click="closeMerchant"
          >
            Zamknij
          </button>
        </div>
      </div>

      <div
        ref="merchantBody"
        class="flex min-h-0 flex-1 flex-col overflow-hidden"
        style="touch-action: pan-y"
      >
        <!-- Wide: three columns -->
        <div
          v-if="!isCompact"
          class="grid min-h-0 flex-1 items-start gap-6 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_18rem]"
        >
          <section class="flex min-h-0 min-w-0 flex-col gap-2">
            <h3 class="shrink-0 text-lg font-semibold">
              BUY
            </h3>
            <MerchantFilterBar
              v-if="!isNpcGoodsMode || hasNpcGoodsStock"
              side="buy"
              class="shrink-0"
              :model-value="buyFilters"
              :available-capabilities="buyCapabilities"
              :sort-options="BUY_SORT_OPTIONS"
              @update:model-value="Object.assign(buyFilters, $event)"
            />
            <div
              v-if="hasHorseOffers"
              class="flex shrink-0 flex-col gap-1.5"
            >
              <div
                v-for="(offer, horseIndex) in horseOffers"
                :key="`horse-${horseIndex}-${offer.label}`"
                class="flex flex-col gap-1 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="min-w-0">
                    <p class="text-sm font-medium capitalize text-neutral-100">
                      {{ offer.label }}
                    </p>
                    <p class="text-xs text-neutral-400">
                      {{ formatCoins(offer.price) }}
                      <span v-if="offer.status === 'available' && offer.previewNetCoins(transaction.offer) > 0">
                        · do zapłaty {{ formatCoins(offer.previewNetCoins(transaction.offer)) }}
                      </span>
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
                    class="shrink-0 rounded-md border border-neutral-600 px-2 py-1 text-xs text-neutral-200 hover:border-neutral-400"
                    @click="onBuyHorse(offer)"
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
            </div>
            <ul class="min-h-0 flex-1 divide-y divide-neutral-800 overflow-y-auto rounded-lg border border-neutral-800">
              <li
                v-if="isNpcGoodsMode ? npcGoodsEmptyCopy : (buyRows.length === 0 && !hasHorseOffers)"
                class="px-3 py-6 text-center text-sm text-neutral-500"
              >
                {{ isNpcGoodsMode ? npcGoodsEmptyCopy : 'Brak towarów w tej kategorii.' }}
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
                :owned-count="ownedCount(row.kind)"
                @commit="onCommitPurchase"
                @clear="onClearPurchase"
                @open-details="openDetails"
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
                {{ offerableKinds.length === 0 ? 'Ekwipunek jest pusty.' : 'Brak towarów w tej kategorii.' }}
              </li>
              <MerchantItemRow
                v-for="row in offerRows"
                :key="row.kind"
                :kind="row.kind"
                :label="row.label"
                :price="row.price"
                :committed-count="transaction.offer[row.kind] ?? 0"
                :max-count="ownedCount(row.kind)"
                :owned-count="ownedCount(row.kind)"
                :disabled="row.price <= 0"
                :disabled-reason="row.price <= 0 ? 'Brak ceny handlu.' : undefined"
                @commit="onCommitOffer"
                @clear="onClearOffer"
                @open-details="openDetails"
              />
            </ul>
          </section>

          <section class="flex min-h-0 min-w-0 flex-col">
            <MerchantTransactionPanel
              :purchases="purchaseLines"
              :offer-items="offerLines"
              :net-coins="netCoins"
              :coins="coins"
              :can-trade="canTrade && !trading"
              :problem="!canTrade ? tradeProblem : undefined"
              @trade="onTrade"
              @remove-purchase="onClearPurchase"
              @remove-offer="onClearOffer"
            />
          </section>
        </div>

        <!-- Compact: one list + in-flow transaction bar -->
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
              v-if="!isNpcGoodsMode || hasNpcGoodsStock"
              side="buy"
              class="shrink-0"
              :model-value="buyFilters"
              :available-capabilities="buyCapabilities"
              :sort-options="BUY_SORT_OPTIONS"
              @update:model-value="Object.assign(buyFilters, $event)"
            />
            <div
              v-if="hasHorseOffers"
              class="flex shrink-0 flex-col gap-1.5"
            >
              <div
                v-for="(offer, horseIndex) in horseOffers"
                :key="`horse-c-${horseIndex}-${offer.label}`"
                class="flex flex-col gap-1 rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2"
              >
                <div class="flex items-center justify-between gap-2">
                  <div class="min-w-0">
                    <p class="text-sm font-medium capitalize">
                      {{ offer.label }}
                    </p>
                    <p class="text-xs text-neutral-400">
                      {{ formatCoins(offer.price) }}
                    </p>
                  </div>
                  <button
                    v-if="offer.status === 'available'"
                    type="button"
                    class="shrink-0 rounded-md border border-neutral-600 px-2 py-1 text-xs"
                    @click="onBuyHorse(offer)"
                  >
                    Kup
                  </button>
                </div>
              </div>
            </div>
            <ul class="min-h-0 flex-1 divide-y divide-neutral-800 overflow-y-auto rounded-lg border border-neutral-800">
              <li
                v-if="isNpcGoodsMode ? npcGoodsEmptyCopy : (buyRows.length === 0 && !hasHorseOffers)"
                class="px-3 py-6 text-center text-sm text-neutral-500"
              >
                {{ isNpcGoodsMode ? npcGoodsEmptyCopy : 'Brak towarów w tej kategorii.' }}
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
                :owned-count="ownedCount(row.kind)"
                @commit="onCommitPurchase"
                @clear="onClearPurchase"
                @open-details="openDetails"
              />
            </ul>
          </section>

          <section
            v-else
            class="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden"
          >
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
                {{ offerableKinds.length === 0 ? 'Ekwipunek jest pusty.' : 'Brak towarów w tej kategorii.' }}
              </li>
              <MerchantItemRow
                v-for="row in offerRows"
                :key="row.kind"
                :kind="row.kind"
                :label="row.label"
                :price="row.price"
                :committed-count="transaction.offer[row.kind] ?? 0"
                :max-count="ownedCount(row.kind)"
                :owned-count="ownedCount(row.kind)"
                :disabled="row.price <= 0"
                :disabled-reason="row.price <= 0 ? 'Brak ceny handlu.' : undefined"
                @commit="onCommitOffer"
                @clear="onClearOffer"
                @open-details="openDetails"
              />
            </ul>
          </section>

          <button
            type="button"
            :aria-expanded="drawerOpen"
            class="flex shrink-0 items-center justify-between rounded-lg border border-neutral-500 bg-neutral-900 px-4 py-2 text-sm shadow-lg"
            @click="drawerOpen = true"
          >
            <span>Transakcja · {{ lineCount }} {{ lineCount === 1 ? 'pozycja' : 'pozycji' }}</span>
            <span class="tabular-nums text-neutral-300">
              {{ netCoins > 0 ? 'zapłać' : netCoins < 0 ? 'otrzymaj' : 'równo' }}
              {{ formatCoins(Math.abs(netCoins)) }}
            </span>
          </button>
        </div>
      </div>

      <div class="mt-3 shrink-0 text-[11px] text-neutral-500">
        Esc — zamknij
      </div>
    </div>

    <div
      v-if="isCompact && drawerOpen"
      class="pointer-events-auto fixed inset-0 z-30 flex items-end justify-center bg-black/60 sm:items-center"
      @click.self="drawerOpen = false"
    >
      <div class="sv-merchant flex max-h-[calc(100dvh-32px)] w-[min(520px,calc(100vw-32px))] flex-col rounded-xl border border-white/15 bg-neutral-900/95 p-4 text-neutral-100 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
        <div class="mb-2 flex items-center justify-between">
          <h2 class="sr-only">
            Transakcja
          </h2>
          <button
            type="button"
            class="ml-auto text-sm text-neutral-400 hover:text-neutral-100"
            @click="drawerOpen = false"
          >
            Zamknij
          </button>
        </div>
        <MerchantTransactionPanel
          :purchases="purchaseLines"
          :offer-items="offerLines"
          :net-coins="netCoins"
          :coins="coins"
          :can-trade="canTrade && !trading"
          :problem="!canTrade ? tradeProblem : undefined"
          @trade="onTrade"
          @remove-purchase="onClearPurchase"
          @remove-offer="onClearOffer"
        />
      </div>
    </div>

    <MerchantItemDetailsModal
      :kind="detailsKind"
      :instance-id="detailsInstanceId"
      @close="detailsKind = null; detailsInstanceId = undefined"
    />
  </div>
</template>

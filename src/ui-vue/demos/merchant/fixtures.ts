/**
 * Stage F merchant demo fixtures — presentation only; no world/save.
 * @domain ui
 */
import type { ItemCapability } from '../../../items/itemCatalog'
import type { ItemKind } from '../../../items/items'

export type DemoViewId =
  | 'merchant-stock'
  | 'npc-goods-empty'
  | 'capability-filter'
  | 'disabled-handluj'
  | 'horse-offer'

export type DemoBuyRow = {
  kind: ItemKind
  label: string
  price: number
  maxCount: number
  ownedCount: number
  instanceId?: string
  capabilities: readonly ItemCapability[]
}

export type DemoOfferRow = {
  kind: ItemKind
  label: string
  price: number
  ownedCount: number
  capabilities: readonly ItemCapability[]
}

export type DemoHorse = {
  label: string
  price: number
  status: 'available' | 'reserved'
  statusHint: string | null
}

export type DemoScenario = {
  id: DemoViewId
  label: string
  title: string
  mode: 'merchant' | 'npcGoods'
  coins: number
  buyRows: readonly DemoBuyRow[]
  offerRows: readonly DemoOfferRow[]
  horseOffers: readonly DemoHorse[]
  emptyBuyCopy: string | null
}

export const DEMO_SCENARIOS: readonly DemoScenario[] = [
  {
    id: 'merchant-stock',
    label: 'Kupiec — stock + OFFER',
    title: 'Kupiec',
    mode: 'merchant',
    coins: 40,
    buyRows: [
      { kind: 'bread', label: 'Chleb', price: 4, maxCount: 8, ownedCount: 1, capabilities: [] },
      { kind: 'iron_rod', label: 'Pręt żelazny', price: 18, maxCount: 3, ownedCount: 0, capabilities: [] },
      {
        kind: 'short_sword',
        label: 'Krótki miecz — zwykły',
        price: 55,
        maxCount: 1,
        ownedCount: 0,
        instanceId: 'demo-sword-1',
        capabilities: ['branch_trimming', 'meat_harvesting'],
      },
    ],
    offerRows: [
      { kind: 'apple', label: 'Jabłko', price: 2, ownedCount: 5, capabilities: [] },
      { kind: 'branch', label: 'Gałąź', price: 3, ownedCount: 12, capabilities: [] },
    ],
    horseOffers: [],
    emptyBuyCopy: null,
  },
  {
    id: 'npc-goods-empty',
    label: 'npcGoods — pusty BUY',
    title: 'Marta',
    mode: 'npcGoods',
    coins: 12,
    buyRows: [],
    offerRows: [
      { kind: 'apple', label: 'Jabłko', price: 1, ownedCount: 3, capabilities: [] },
    ],
    horseOffers: [],
    emptyBuyCopy: 'Nie mam teraz nic na sprzedaż.',
  },
  {
    id: 'capability-filter',
    label: 'Capability pills widoczne',
    title: 'Kupiec',
    mode: 'merchant',
    coins: 25,
    buyRows: [
      { kind: 'bread', label: 'Chleb', price: 4, maxCount: 5, ownedCount: 0, capabilities: [] },
      { kind: 'axe', label: 'Topór', price: 22, maxCount: 2, ownedCount: 1, capabilities: ['wood_chopping', 'prying'] },
      {
        kind: 'dagger',
        label: 'Sztylet',
        price: 14,
        maxCount: 1,
        ownedCount: 0,
        capabilities: ['branch_trimming', 'meat_harvesting'],
      },
    ],
    offerRows: [
      { kind: 'herb', label: 'Zioło', price: 2, ownedCount: 4, capabilities: [] },
    ],
    horseOffers: [],
    emptyBuyCopy: null,
  },
  {
    id: 'disabled-handluj',
    label: 'Handluj zablokowany',
    title: 'Kupiec',
    mode: 'merchant',
    coins: 5,
    buyRows: [
      { kind: 'bread', label: 'Chleb', price: 4, maxCount: 2, ownedCount: 0, capabilities: [] },
    ],
    offerRows: [],
    horseOffers: [],
    emptyBuyCopy: null,
  },
  {
    id: 'horse-offer',
    label: 'Horse card',
    title: 'Kupiec',
    mode: 'merchant',
    coins: 80,
    buyRows: [
      { kind: 'bread', label: 'Chleb', price: 4, maxCount: 4, ownedCount: 0, capabilities: [] },
    ],
    offerRows: [
      { kind: 'branch', label: 'Gałąź', price: 3, ownedCount: 6, capabilities: [] },
    ],
    horseOffers: [
      {
        label: 'Koń roboczy',
        price: 60,
        status: 'available',
        statusHint: null,
      },
      {
        label: 'Koń wierzchowy',
        price: 90,
        status: 'reserved',
        statusHint: 'Zarezerwowany przez innego nabywcę.',
      },
    ],
    emptyBuyCopy: null,
  },
]

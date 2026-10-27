import type { ItemKind } from '../../../items/items'
import type { DetailStatRow } from '../../components/items/buildItemDetailPresentation'
import type { BuildItemDetailPresentationInput } from '../../components/items/buildItemDetailPresentation'

export type DemoFixtureId = 'weapon' | 'armor' | 'food' | 'liquid' | 'unavailable'

export type DemoFixture = {
  id: DemoFixtureId
  label: string
  /** Demo-local action log labels (simulated; no live inventory). */
  actions: { id: string; label: string; disabled?: boolean; reason?: string }[]
  presentation: BuildItemDetailPresentationInput
}

const baseStats = (extra: DetailStatRow[] = []): DetailStatRow[] => [
  { group: 'main', label: 'Kategoria', value: 'demo' },
  ...extra,
  { group: 'body', label: 'Rozmiar', value: 'MD', icon: 'size' },
  { group: 'body', label: 'Waga', value: '1.0 kg', icon: 'weight' },
  { group: 'body', label: 'Materiał', value: '—', unavailable: true, icon: 'material' },
  { group: 'value', label: 'Trwałość', value: '—', unavailable: true, icon: 'durability' },
  { group: 'value', label: 'Wartość', value: '10c', icon: 'price' },
]

export const DEMO_FIXTURES: DemoFixture[] = [
  {
    id: 'weapon',
    label: 'Broń (topór)',
    actions: [
      { id: 'sharpen', label: 'Naostrz (0)', disabled: true, reason: 'Brak osełki' },
      { id: 'drop', label: 'Wyrzuć' },
    ],
    presentation: {
      kind: 'axe' satisfies ItemKind,
      title: 'Topór',
      meta: 'narzędzie · broń · ×1',
      description: 'Solidny topór do drewna i walki.',
      meterKind: 'durability',
      conditionPercent: 72,
      sharpnessPercent: 55,
      worthCoins: 10,
      showDpsPlaceholder: true,
      stats: baseStats([
        { group: 'main', label: 'Obrażenia', value: '12', icon: 'damage' },
        { group: 'main', label: 'Zasięg', value: '1.2 m', icon: 'reach' },
        { group: 'extra', label: 'Szybkość ataku', value: 'średni' },
      ]),
    },
  },
  {
    id: 'armor',
    label: 'Zbroja',
    actions: [
      { id: 'equip', label: 'Załóż' },
      { id: 'drop', label: 'Wyrzuć' },
    ],
    presentation: {
      kind: 'leather_armor' satisfies ItemKind,
      title: 'Skórzany pancerz',
      meta: 'pancerz · ×1',
      description: 'Lekka ochrona z garbowanej skóry.',
      qualityLabel: 'Zwykła',
      quality: 'common',
      worthCoins: 10,
      showArmorWearPlaceholder: true,
      showResistPlaceholders: true,
      stats: baseStats([
        { group: 'main', label: 'Slot', value: 'ciało', icon: 'slot' },
        { group: 'main', label: 'Ochrona', value: '18%', icon: 'armor' },
        { group: 'extra', label: 'Ruch', value: '−5%', icon: 'speedPenalty' },
      ]),
    },
  },
  {
    id: 'food',
    label: 'Jedzenie',
    actions: [
      { id: 'eat', label: 'Zjedz' },
      { id: 'drop', label: 'Wyrzuć' },
    ],
    presentation: {
      kind: 'apple' satisfies ItemKind,
      title: 'Jabłko',
      meta: 'pożywienie · ×3',
      description: 'Chrupiące jabłko z sadu.',
      worthCoins: 3,
      stackCount: 3,
      stats: [
        { group: 'main', label: 'Efekt', value: '+8 głodu', icon: 'nutrition' },
        { group: 'main', label: 'Świeżość', value: 'świeże' },
        { group: 'body', label: 'Waga', value: '0.2 kg', icon: 'weight' },
        { group: 'value', label: 'Ilość', value: '×3' },
        { group: 'value', label: 'Wartość', value: '1c', icon: 'price' },
      ],
    },
  },
  {
    id: 'liquid',
    label: 'Płyn (bukłak)',
    actions: [
      { id: 'drink', label: 'Wypij' },
      { id: 'drop', label: 'Wyrzuć' },
    ],
    presentation: {
      kind: 'waterskin_medium' satisfies ItemKind,
      title: 'Bukłak',
      meta: 'pojemnik · ×1',
      description: 'Worek na wodę.',
      meterKind: 'fill',
      conditionPercent: 60,
      worthCoins: 10,
      stats: baseStats([
        { group: 'main', label: 'Efekt', value: '+12 pragnienia', icon: 'water' },
      ]),
    },
  },
  {
    id: 'unavailable',
    label: 'Niedostępne (zepsute)',
    actions: [
      { id: 'eat', label: 'Zjedz', disabled: true, reason: 'Zepsute' },
      { id: 'drop', label: 'Wyrzuć' },
    ],
    presentation: {
      kind: 'raw_meat' satisfies ItemKind,
      title: 'Mięso',
      meta: 'pożywienie · ×1',
      description: 'Surowy kawałek mięsa.',
      worthCoins: 10,
      showDpsPlaceholder: false,
      stats: baseStats([
        { group: 'main', label: 'Efekt', value: '+10 głodu', icon: 'nutrition' },
        { group: 'main', label: 'Świeżość', value: 'zepsute' },
      ]),
    },
  },
]

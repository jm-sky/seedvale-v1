import type { DetailStatRow } from '../../components/items/buildItemDetailPresentation'
import type { BuildItemDetailPresentationInput } from '../../components/items/buildItemDetailPresentation'
import type { ItemKind } from '../../../items/items'

export type DemoFixtureId = 'weapon' | 'armor' | 'food' | 'liquid' | 'unavailable'

export type DemoFixture = {
  id: DemoFixtureId
  label: string
  /** Demo-local action log labels (simulated; no live inventory). */
  actions: { id: string; label: string; disabled?: boolean; reason?: string }[]
  presentation: BuildItemDetailPresentationInput
}

const baseStats = (extra: DetailStatRow[] = []): DetailStatRow[] => [
  { label: 'Kategoria', value: 'demo' },
  { label: 'Ilość', value: '×1' },
  { label: 'Waga', value: '1.0 kg' },
  { label: 'Wartość', value: '10 monet' },
  ...extra,
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
      showDpsPlaceholder: true,
      stats: baseStats([
        { label: 'Obrażenia', value: '12' },
        { label: 'Zasięg', value: '1.2 m' },
        { label: 'Szybkość ataku', value: 'średni' },
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
      qualityLabel: 'zwykła',
      showArmorWearPlaceholder: true,
      showResistPlaceholders: true,
      stats: baseStats([
        { label: 'Slot', value: 'ciało' },
        { label: 'Ochrona', value: '18%' },
        { label: 'Ruch', value: '−5%' },
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
      stats: [
        { label: 'Kategoria', value: 'demo' },
        { label: 'Ilość', value: '×3' },
        { label: 'Waga', value: '0.2 kg' },
        { label: 'Wartość', value: '3 monet' },
        { label: 'Efekt', value: '+8 głodu' },
        { label: 'Świeżość', value: 'świeże' },
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
      stats: baseStats([
        { label: 'Efekt', value: '+12 pragnienia' },
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
      showDpsPlaceholder: false,
      stats: baseStats([
        { label: 'Efekt', value: '+10 głodu' },
        { label: 'Świeżość', value: 'zepsute' },
      ]),
    },
  },
]

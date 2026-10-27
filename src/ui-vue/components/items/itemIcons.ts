/**
 * Display-only V3 donor SVG glyphs (docs/v3-donor/items/icons), adapted for V1 kinds/categories.
 * Inlined `?raw` so `currentColor` picks up text classes. No gameplay coupling.
 */
import type { ArmorQuality } from '../../../items/itemInstances'
import type { ItemCategory, ItemKind } from '../../../items/items'

const icons = import.meta.glob(
  '../../../../docs/v3-donor/items/icons/*.svg',
  { eager: true, import: 'default', query: '?raw' },
) as Record<string, string>

export type ItemStatIconName =
  | 'accuracy'
  | 'ammo'
  | 'armor'
  | 'capabilities'
  | 'class'
  | 'cooldown'
  | 'damage'
  | 'drawTime'
  | 'dps'
  | 'durability'
  | 'material'
  | 'nutrition'
  | 'price'
  | 'projectileSpeed'
  | 'range'
  | 'reach'
  | 'sharpness'
  | 'size'
  | 'skill'
  | 'slot'
  | 'speedPenalty'
  | 'stamina'
  | 'water'
  | 'weight'

const ITEM_CATEGORY_ICON_FILES: Readonly<Record<ItemCategory, string>> = {
  weapon: 'sword',
  armor: 'torso',
  tool: 'toolbox',
  resource: 'wood-pile',
  utility: 'basket',
  food: 'bread',
  knowledge: 'book-pile',
  story: 'scroll-quill',
  other: 'basket',
}

/** Kind → glyph basename; missing kinds fall back to category. */
const ITEM_ICON_FILES: Readonly<Partial<Record<ItemKind, string>>> = {
  knife: 'dagger',
  dagger: 'dagger',
  damascus_knife: 'dagger',
  short_sword: 'sword',
  long_sword: 'sword',
  damascus_short_sword: 'sword',
  damascus_long_sword: 'sword',
  obsidian_sword: 'sword',
  masterwork_sword: 'sword',
  axe: 'axe',
  hatchet: 'axe',
  battle_axe: 'axe',
  spear: 'spear',
  pitchfork: 'polearm',
  short_bow: 'bow',
  hunting_bow: 'bow',
  long_bow: 'bow',
  masterwork_hunting_bow: 'bow',
  crossbow: 'crossbow',
  arrow: 'arrow',
  broadhead_arrow: 'arrow',
  war_arrow: 'arrow',
  sickle: 'sickle',
  shears: 'shears',
  pickaxe: 'mining',
  shovel: 'spade',
  pan: 'saucepan',
  wooden_torch: 'torch',
  firestarter: 'flint-spark',
  tent: 'toolbox',
  trap_simple: 'wolf-trap',
  trap_good: 'wolf-trap',
  leather_armor: 'torso',
  chainmail: 'torso',
  leather_pauldron: 'shoulders',
  waterskin_empty: 'waterskin',
  waterskin_full: 'waterskin',
  waterskin_small: 'waterskin',
  waterskin_medium: 'waterskin',
  waterskin_large: 'waterskin',
  wooden_bucket: 'empty-wood-bucket',
  copper_bucket: 'empty-wood-bucket',
  bread: 'bread',
  roasted_meat: 'meat',
  raw_meat: 'meat',
  dried_meat: 'meat',
  cheese: 'bread',
  egg: 'bread',
  tomato: 'cabbage',
  mushroom: 'mushroom-gills',
  herb: 'herbs-bundle',
  mint: 'herbs-bundle',
  yarrow: 'herbs-bundle',
  bandage: 'bandage-roll',
  coin: 'coins',
  key: 'key',
  hide: 'animal-hide',
  coal: 'coal-pile',
  iron: 'metal-bar',
  iron_rod: 'metal-bar',
  copper: 'metal-bar',
  copper_ore: 'ore',
  stone: 'stone',
  branch: 'tree-branch',
  beam: 'planks',
  rope: 'rope-coil',
  blanket: 'blanket',
  saddlebags: 'saddle',
  treasure_map_dark_forest: 'scroll-quill',
}

const ITEM_STAT_ICON_FILES: Readonly<Record<ItemStatIconName, string>> = {
  accuracy: 'archery-target',
  ammo: 'arrow',
  armor: 'torso',
  capabilities: 'toolbox',
  class: 'crossed-swords',
  cooldown: 'hourglass',
  damage: 'sword',
  drawTime: 'hourglass',
  dps: 'lightning-arc',
  durability: 'heart-organ',
  material: 'ore',
  nutrition: 'meat',
  price: 'coins',
  projectileSpeed: 'arrow-flights',
  range: 'archery-target',
  reach: 'polearm',
  sharpness: 'sword',
  size: 'measure-tape',
  skill: 'skills',
  slot: 'torso',
  speedPenalty: 'boot-prints',
  stamina: 'heart-beats',
  water: 'water-drop',
  weight: 'weight',
}

function iconRaw(file: string): string {
  const path = Object.keys(icons).find((p) => p.endsWith(`/${file}.svg`))
  if (!path) return icons[Object.keys(icons)[0]!] ?? ''
  return icons[path]!
}

export function resolveItemCategoryIconSrc(category: ItemCategory): string {
  return iconRaw(ITEM_CATEGORY_ICON_FILES[category])
}

export function resolveItemKindIconSrc(kind: ItemKind, category: ItemCategory): string {
  const file = ITEM_ICON_FILES[kind]
  return file ? iconRaw(file) : resolveItemCategoryIconSrc(category)
}

export function resolveItemStatIconSrc(name: ItemStatIconName): string {
  return iconRaw(ITEM_STAT_ICON_FILES[name])
}

/** Quality tag colours — V3 QUALITY_TAG mapped onto V1 ArmorQuality. */
export const QUALITY_TAG: Record<ArmorQuality, string> = {
  poor: 'border-bad/50 text-bad',
  common: 'border-neutral-600 text-neutral-300',
  good: 'border-good/50 text-good',
  masterwork: 'border-primary/60 text-primary',
}

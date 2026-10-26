import type { Item, ItemCategory } from '@/game/data'

const icons = import.meta.glob('./icons/*.svg', { eager: true, import: 'default', query: '?raw' }) as Record<string, string>

/** Named glyphs shared by the item detail rows and other item-facing UI. */
export type ItemStatIconName =
  | 'ammo' | 'alsoWorksAs' | 'arc' | 'armor' | 'block' | 'canParry' | 'capabilities' | 'carryBonus' | 'class' | 'cooldown' | 'cures'
  | 'damage' | 'drawTime' | 'dps' | 'durability' | 'efficiency' | 'family' | 'gain' | 'heal' | 'illness' | 'lightRadius'
  | 'material' | 'nutrition' | 'parryWindow' | 'poison' | 'price' | 'projectileSpeed' | 'rarity' | 'range' | 'raw'
  | 'readsFrom' | 'reach' | 'resistBlunt' | 'resistCut' | 'resistPierce' | 'sharpness' | 'size' | 'skill' | 'skillCap' | 'slot'
  | 'speedPenalty' | 'spoil' | 'stacks' | 'stamina' | 'stopsBleeding' | 'thirst' | 'water' | 'waterCapacity' | 'weight'

/** Every current catalogue id is listed, even when its icon is a category fallback. */
export const ITEM_ICON_FILES: Readonly<Record<string, string>> = {
  knife: 'dagger', dagger: 'dagger', obsidian_knife: 'dagger', obsidian_dagger: 'dagger', damascus_dagger: 'dagger', ashgrove_dagger: 'dagger', kestrel_dagger: 'dagger',
  short_sword: 'sword', sword: 'sword', falchion: 'sword', long_sword: 'sword', pinewatch_longsword: 'sword', damascus_sword: 'sword', damascus_longsword: 'sword', obsidian_sword: 'sword', millbrook_shortsword: 'sword', harrow_shortsword: 'sword', fenmoor_sword: 'sword', ironvale_sword: 'sword', stonebridge_longsword: 'sword', greywatch_longsword: 'sword',
  hatchet: 'axe', axe: 'axe', battle_axe: 'axe', spear: 'spear', halberd: 'polearm', club: 'mace', mace: 'mace', war_hammer: 'hammer', staff: 'staff', sling: 'sling', short_bow: 'bow', hunting_bow: 'bow', long_bow: 'bow', composite_bow: 'bow', marlow_longbow: 'bow', yewmaster_longbow: 'bow', crossbow: 'crossbow',
  buckler: 'buckler', wooden_shield: 'round', iron_rimmed_shield: 'heater',
  padded_cap: 'head', leather_cap: 'head', mail_coif: 'head', iron_helm: 'head', full_helm: 'head', northpass_riders_helm: 'head',
  leather_pauldron: 'shoulders', ranger_pauldron: 'shoulders', iron_pauldrons: 'shoulders', plate_pauldrons_spiked: 'shoulders', plate_pauldrons_round: 'shoulders', thornwatch_pauldrons: 'shoulders',
  padded_jacket: 'torso', leather_jerkin: 'torso', studded_leather: 'torso', mail_shirt: 'torso', brigandine: 'torso', plate_cuirass: 'torso', stoneford_mail: 'torso', kingsbane_hauberk: 'torso', ravenmoor_cuirass: 'torso', marshal_cuirass: 'torso', saltmere_wardens_coat: 'torso',
  leather_bracers: 'forearms', iron_vambraces: 'forearms', plate_vambraces: 'forearms', blackpine_vambraces: 'forearms', leather_gloves: 'hands', studded_gloves: 'hands', plate_gauntlets: 'hands', fallowmere_gauntlets: 'hands', padded_hose: 'legs', leather_trousers: 'legs', mail_chausses: 'legs', plate_greaves: 'legs', ridgeguard_greaves: 'legs', leather_boots: 'feet', reinforced_boots: 'feet', plate_sabatons: 'feet',
  arrow: 'arrow', arrow_bodkin: 'arrow', arrow_blunt: 'arrow', bolt: 'bolt', bolt_heavy: 'bolt', bolt_blunt: 'bolt', sling_stone: 'stone',
  adze: 'toolbox', tent: 'toolbox', whetstone: 'toolbox', auger: 'drill', backpack: 'backpack', balance: 'kitchen-scale', bucket: 'empty-wood-bucket', chisel: 'chisel', fishing_net: 'fishing-net', fishing_rod: 'fishing-pole', flint: 'flint-spark', frame_saw: 'hand-saw', gathering_basket: 'basket', hammer: 'hammer', hoe: 'toolbox', iron_rake: 'rake', ladle: 'ladle', mallet: 'toolbox', maul: 'toolbox', pack_saddle_heavy: 'saddle', pack_saddle_light: 'saddle', pan: 'saucepan', pickaxe: 'mining', riding_saddle: 'saddle', rushlight: 'torch', sack: 'paper-bag-folded', sack_needle: 'sewing-needle', sewing_kit: 'toolbox', shears: 'shears', shovel: 'spade', sickle: 'sickle', snare: 'wolf-trap', square: 'toolbox', torch: 'torch', waterskin_s: 'waterskin', waterskin_m: 'waterskin', waterskin_l: 'waterskin', wedge: 'toolbox', wheelbarrow: 'wheelbarrow', wooden_cup: 'coffee-cup', wooden_shovel: 'spade',
  ale: 'beer-stein', apple: 'shiny-apple', bread: 'bread', cabbage: 'cabbage', carrot: 'carrot', cooked_fish: 'fish-cooked', mushroom: 'mushroom-gills', dried_fish: 'fish-smoking', dried_meat: 'meat', fish: 'fish-cooked', flour: 'flour', milk: 'jug',
  chamomile: 'herbs-bundle', mint: 'herbs-bundle', yarrow: 'herbs-bundle', arnica: 'herbs-bundle', hemlock: 'herbs-bundle', nightshade: 'herbs-bundle', bandage: 'bandage-roll', salve: 'healing',
  board: 'planks', bran: 'wheat', branch: 'tree-branch', charcoal: 'wood-pile', cloth: 'rolled-cloth', coal: 'coal-pile', firewood: 'wood-pile', grain: 'grain', hide: 'animal-hide', iron_ingot: 'metal-bar', iron_ore: 'ore', log: 'log', nail: 'nails', resin: 'wood-pile', rope: 'rope-coil', salt: 'salt-shaker', seed_grain: 'grain', stone: 'stone', tar: 'wood-pile', wooden_peg: 'wood-stick', wool: 'wool',
  primer_construction: 'book-cover', primer_medicine: 'open-book', primer_survival: 'scroll-quill', blanket: 'blanket', inn_key: 'key', ledger: 'archive-register',
}

/** The reasoned category-level matches used where the pack has no specific glyph. */
export const ITEM_ICON_FALLBACK_REASONS: Readonly<Record<string, string>> = {
  adze: 'No adze glyph is present in the supplied pack; use the tool category icon.',
  hoe: 'No hoe glyph is present in the supplied pack; use the tool category icon.',
  mallet: 'No mallet glyph is present in the supplied pack; use the tool category icon.',
  maul: 'No maul glyph is present in the supplied pack; use the tool category icon.',
  sewing_kit: 'The pack has no sewing kit; use the tool category icon rather than a sewing machine.',
  square: 'No carpenter square glyph is present in the supplied pack; use the tool category icon.',
  tent: 'No tent glyph is present in the supplied pack; use the tool category icon.',
  whetstone: 'No whetstone glyph is present in the supplied pack; use the tool category icon.',
  wedge: 'No wedge glyph is present in the supplied pack; use the tool category icon.',
  charcoal: 'The pack has no charcoal material glyph; use the resource category icon.',
  resin: 'The pack has no resin material glyph; use the resource category icon.',
  tar: 'The pack has no tar material glyph; use the resource category icon.',
}

/** Category glyphs are also used for future ids missing from ITEM_ICON_FILES. */
export const ITEM_CATEGORY_ICON_FILES: Readonly<Record<ItemCategory, string>> = {
  ammo: 'arrow', armor: 'torso', book: 'book-pile', food: 'bread', herb: 'herbs-bundle', medical: 'bandage-roll', misc: 'basket', resource: 'wood-pile', shield: 'heater', tool: 'toolbox', weapon: 'sword',
}

/** Keep these glyphs specific to the stat represented, with shared art where meanings overlap. */
export const ITEM_STAT_ICON_FILES: Readonly<Record<ItemStatIconName, string>> = {
  ammo: 'arrow', alsoWorksAs: 'toolbox', arc: 'heater', armor: 'torso', block: 'heater', canParry: 'shield-bash', capabilities: 'toolbox', carryBonus: 'backpack', class: 'crossed-swords', cooldown: 'hourglass', cures: 'healing',
  damage: 'sword', drawTime: 'hourglass', dps: 'lightning-arc', durability: 'heart-organ', efficiency: 'gears', family: 'torso', gain: 'upgrade', heal: 'heart-plus', illness: 'virus', lightRadius: 'torch',
  material: 'ore', nutrition: 'meat', parryWindow: 'hourglass', poison: 'poison', price: 'coins', projectileSpeed: 'arrow-flights', rarity: 'gems', range: 'archery-target', raw: 'meat',
  readsFrom: 'open-book', reach: 'polearm', resistBlunt: 'heater', resistCut: 'heater', resistPierce: 'heater', sharpness: 'sword', size: 'measure-tape', skill: 'skills', skillCap: 'skills', slot: 'torso',
  speedPenalty: 'boot-prints', spoil: 'hourglass', stacks: 'basket', stamina: 'heart-beats', stopsBleeding: 'bandage-roll', thirst: 'water-drop', water: 'water-drop', waterCapacity: 'water-drop', weight: 'weight',
}

function iconRaw(file: string): string {
  const raw = icons[`./icons/${file}.svg`]
  if (!raw) throw new Error(`Missing item icon asset: ${file}.svg`)
  return raw
}

export function resolveItemIconSrc(item: Pick<Item, 'id' | 'category'>): string {
  return iconRaw(ITEM_ICON_FILES[item.id] ?? ITEM_CATEGORY_ICON_FILES[item.category])
}

export function resolveItemCategoryIconSrc(category: ItemCategory): string {
  return iconRaw(ITEM_CATEGORY_ICON_FILES[category])
}

export function resolveItemStatIconSrc(name: ItemStatIconName): string {
  return iconRaw(ITEM_STAT_ICON_FILES[name])
}

/** Vite-resolved SVG strings, exported so tests can enforce full asset usage. */
export const ITEM_ICON_ASSET_URLS = icons

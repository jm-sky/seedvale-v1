/**
 * Game-icons.net glyph for an item's fine type (`groupOf`) with a category fallback.
 * SVGs are inlined (`?raw`) so `currentColor` picks up tier / text classes.
 */
import { groupOf } from './filters'
import arrowSvg from './icons/arrow.svg?raw'
import axeSvg from './icons/axe.svg?raw'
import boltSvg from './icons/bolt.svg?raw'
import bowSvg from './icons/bow.svg?raw'
import bucklerSvg from './icons/buckler.svg?raw'
import crossbowSvg from './icons/crossbow.svg?raw'
import daggerSvg from './icons/dagger.svg?raw'
import feetSvg from './icons/feet.svg?raw'
import forearmsSvg from './icons/forearms.svg?raw'
import hammerSvg from './icons/hammer.svg?raw'
import handsSvg from './icons/hands.svg?raw'
import headSvg from './icons/head.svg?raw'
import heaterSvg from './icons/heater.svg?raw'
import legsSvg from './icons/legs.svg?raw'
import maceSvg from './icons/mace.svg?raw'
import polearmSvg from './icons/polearm.svg?raw'
import roundSvg from './icons/round.svg?raw'
import shouldersSvg from './icons/shoulders.svg?raw'
import slingSvg from './icons/sling.svg?raw'
import spearSvg from './icons/spear.svg?raw'
import staffSvg from './icons/staff.svg?raw'
import stoneSvg from './icons/stone.svg?raw'
import swordSvg from './icons/sword.svg?raw'
import torsoSvg from './icons/torso.svg?raw'
import { ITEM_CATEGORY_ICON_FILES, resolveItemCategoryIconSrc, resolveItemIconSrc } from './itemIcons'
import type { Item, ItemCategory } from '@/game/data'

/** Fine groups from `groupOf` (weapon class, armour slot, shield class, ammo kind). */
export const ITEM_GROUP_ICON: Record<string, string> = {
  // weapons
  axe: axeSvg,
  bow: bowSvg,
  crossbow: crossbowSvg,
  dagger: daggerSvg,
  hammer: hammerSvg,
  mace: maceSvg,
  polearm: polearmSvg,
  sling: slingSvg,
  spear: spearSvg,
  staff: staffSvg,
  sword: swordSvg,
  // armour slots
  feet: feetSvg,
  forearms: forearmsSvg,
  hands: handsSvg,
  head: headSvg,
  legs: legsSvg,
  shoulders: shouldersSvg,
  torso: torsoSvg,
  // shields
  buckler: bucklerSvg,
  heater: heaterSvg,
  round: roundSvg,
  // ammo
  arrow: arrowSvg,
  bolt: boltSvg,
  stone: stoneSvg,
  // Goods groups use their declared category icons.
  ...Object.fromEntries(Object.keys(ITEM_CATEGORY_ICON_FILES).filter((id) => !['ammo', 'armor', 'shield', 'weapon'].includes(id)).map((id) => [id, resolveItemCategoryIconSrc(id as ItemCategory)])),
}

/** Shared category fallback for both type groups and catalogue ids. */
export const ITEM_CATEGORY_ICON = Object.fromEntries(Object.keys(ITEM_CATEGORY_ICON_FILES).map((id) => [id, resolveItemCategoryIconSrc(id as ItemCategory)])) as Record<ItemCategory, string>

export function resolveItemTypeIconSrc(item: Item): string {
  return resolveItemIconSrc(item)
}

/** Resolve by fine group, then category fallback. */
export function resolveGroupIconSrc(group: string, category?: ItemCategory): string {
  if (ITEM_GROUP_ICON[group]) return ITEM_GROUP_ICON[group]!
  if (category) return ITEM_CATEGORY_ICON[category]
  return ITEM_CATEGORY_ICON.weapon
}

export function itemTypeIconLabel(item: Item): string {
  return groupOf(item)
}

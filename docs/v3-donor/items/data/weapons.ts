/**
 * Weapons, ammo and shields. Stats from v2 (`game/data/items.ts`) where it has the item, v1 names and materials merged in.
 * Balance baseline: v2 scale (damage ~8-36, cooldown 0.5-1.5 s). Named tiers are compared at the same quality
 * (D-ITM-39): a masterwork is clearly above its ordinary steel counterpart, and a legendary is about 15–25% more
 * DPS than its masterwork unless burst, reach or range already carries part of that advantage. At most one
 * substantial combat cost. Quality scales damage only, so the tier ratio does not stack with the quality multiplier.
 * @domain items
 */
import type { AmmoItem, DamageType, ItemBase, MeleeWeapon, RangedWeapon, ShieldItem, SizeClass } from './types'

type MeleeInput = Omit<MeleeWeapon, 'availability' | 'category' | 'durability' | 'kind' | 'size' | 'tier'> &
  Partial<Pick<MeleeWeapon, 'availability' | 'durability' | 'size' | 'tier'>>
type RangedInput = Omit<RangedWeapon, 'availability' | 'category' | 'durability' | 'kind' | 'size' | 'tier'> &
  Partial<Pick<RangedWeapon, 'availability' | 'durability' | 'size' | 'tier'>>
type AmmoInput = Omit<AmmoItem, 'availability' | 'category' | 'durability' | 'size' | 'tier'> &
  Partial<Pick<AmmoItem, 'availability' | 'size'>>
type ShieldInput = Omit<ShieldItem, 'availability' | 'category' | 'tier'> & Partial<Pick<ShieldItem, 'availability' | 'tier'>>

const meleeSize = (reach: number): SizeClass => (reach <= 0.7 ? 'SM' : reach <= 1.1 ? 'MD' : reach <= 1.6 ? 'LG' : 'XL')

const melee = (w: MeleeInput): MeleeWeapon => ({
  availability: 'active',
  durability: 200,
  size: meleeSize(w.reach),
  tier: 'common',
  ...w,
  category: 'weapon',
  kind: 'melee',
})

const ranged = (w: RangedInput): RangedWeapon => ({
  availability: 'active',
  durability: 150,
  size: 'LG',
  tier: 'common',
  ...w,
  category: 'weapon',
  kind: 'ranged',
})

const ammo = (a: AmmoInput): AmmoItem => ({
  availability: 'active',
  size: 'XS',
  tier: 'common',
  ...a,
  category: 'ammo',
  durability: 1,
})

const shield = (s: ShieldInput): ShieldItem => ({
  availability: 'active',
  tier: 'common',
  ...s,
  category: 'shield',
})

const common = (
  id: string,
  name: string,
  material: ItemBase['material'],
  weight: number,
  price: number,
  origin: ItemBase['origin'],
  legacyIds?: ItemBase['legacyIds'],
) => ({ id, name, material, weight, price, origin, legacyIds })

export const MELEE_WEAPONS: readonly MeleeWeapon[] = [
  // --- Knives and daggers ---
  melee({
    ...common('knife', 'Knife', 'iron', 0.3, 19, 'merged', { v1: 'knife', v2: 'knife' }),
    description: 'A plain working knife. Cuts rope, meat and the occasional throat; poor against armour.',
    weaponClass: 'dagger', grip: 'one-handed', damage: 7, damageType: 'cut', cooldown: 0.6, sharpness: 0.7, stamina: 6,
    reach: 0.6, capabilities: ['cut'],
  }),
  melee({
    ...common('dagger', 'Dagger', 'steel', 0.4, 25, 'merged', { v1: 'dagger', v2: 'dagger' }),
    description: 'A slim fighting dagger with a stiff point. Quick, and the best of the small blades against armour gaps.',
    weaponClass: 'dagger', grip: 'one-handed', damage: 10, damageType: 'pierce', cooldown: 0.6, sharpness: 0.8, stamina: 7,
    reach: 0.7, capabilities: ['cut'],
  }),
  melee({
    ...common('obsidian_knife', 'Obsidian knife', 'obsidian', 0.25, 260, 'merged', { v1: 'obsidian_knife', v2: 'obsidian_knife' }),
    description: 'A knife knapped from volcanic glass. Cuts cleaner than steel, but a hard knock can shatter it.',
    weaponClass: 'dagger', grip: 'one-handed', damage: 8.5, damageType: 'cut', cooldown: 0.55, sharpness: 0.97, stamina: 5,
    reach: 0.55, durability: 90, capabilities: ['cut'],
  }),
  melee({
    ...common('obsidian_dagger', 'Obsidian dagger', 'obsidian', 0.35, 340, 'v2', { v2: 'obsidian_dagger' }),
    description: 'A glass-edged dagger of dark, banded stone. Razor sharp and brittle.',
    weaponClass: 'dagger', grip: 'one-handed', damage: 10.5, damageType: 'cut', cooldown: 0.55, sharpness: 0.95, stamina: 6,
    reach: 0.6, durability: 100, capabilities: ['cut'],
  }),
  melee({
    ...common('damascus_dagger', 'Damascus dagger', 'damascus', 0.4, 480, 'merged', { v1: 'damascus_knife', v2: 'damascus_dagger' }),
    description: 'A dagger of watered Damascus steel; the rippled blade holds an edge for months.',
    weaponClass: 'dagger', grip: 'one-handed', damage: 11, damageType: 'cut', cooldown: 0.55, sharpness: 1, stamina: 6,
    reach: 0.65, durability: 260, capabilities: ['cut'],
  }),
  melee({
    ...common('ashgrove_dagger', 'Ashgrove dagger', 'steel', 0.4, 320, 'v2', { v2: 'ashgrove_dagger' }),
    description: 'A river-guard captain\'s dagger with a fine, even edge.',
    weaponClass: 'dagger', grip: 'one-handed', damage: 12.6, damageType: 'pierce', cooldown: 0.6, sharpness: 0.95, stamina: 6,
    reach: 0.7, durability: 200, tier: 'masterwork', lore: 'Forged for a river-guard captain; the edge is fine and holds.', capabilities: ['cut'],
  }),
  melee({
    ...common('kestrel_dagger', 'Kestrel dagger', 'steel', 0.35, 650, 'v2', { v2: 'kestrel_dagger' }),
    description: 'Short and quick, and it wears out fast.',
    weaponClass: 'dagger', grip: 'one-handed', damage: 13.9, damageType: 'pierce', cooldown: 0.55, sharpness: 1, stamina: 6,
    reach: 0.7, durability: 170, tier: 'legendary', availability: 'unique', lore: 'A courier\'s blade that outlived three owners; quick and short, it wears out fast.', capabilities: ['cut'],
  }),

  // --- Swords ---
  melee({
    ...common('short_sword', 'Short sword', 'steel', 1.1, 70, 'merged', { v1: 'short_sword', v2: 'short_sword' }),
    description: 'A handy single-handed blade. Light and quick, a sidearm for soldiers and travellers alike.',
    weaponClass: 'sword', grip: 'one-handed', damage: 15, damageType: 'cut', cooldown: 0.8, sharpness: 0.8, stamina: 10,
    reach: 0.9, capabilities: ['cut'],
  }),
  melee({
    ...common('sword', 'Sword', 'steel', 1.4, 120, 'v2', { v2: 'sword' }),
    description: 'The standard arming sword: balanced, reliable, one hand free for a shield.',
    weaponClass: 'sword', grip: 'one-handed', damage: 19, damageType: 'cut', cooldown: 0.95, sharpness: 0.85, stamina: 12,
    reach: 1.1, capabilities: ['cut'],
  }),
  melee({
    ...common('falchion', 'Falchion', 'steel', 1.6, 90, 'new'),
    description: 'A broad single-edged blade with a heavy belly. Chops like an axe, cheap to make.',
    weaponClass: 'sword', grip: 'one-handed', damage: 18, damageType: 'cut', cooldown: 1.0, sharpness: 0.7, stamina: 12,
    reach: 0.95, availability: 'future', capabilities: ['cut'],
  }),
  melee({
    ...common('long_sword', 'Longsword', 'steel', 2, 200, 'merged', { v1: 'long_sword', v2: 'long_sword' }),
    description: 'A long two-handed blade. Reach and weight win fights, but they tire the arms.',
    weaponClass: 'sword', grip: 'two-handed', damage: 24, damageType: 'cut', cooldown: 1.2, sharpness: 0.85, stamina: 16,
    reach: 1.3, capabilities: ['cut'],
  }),
  melee({
    ...common('pinewatch_longsword', 'Pinewatch longsword', 'steel', 1.9, 520, 'v2', { v2: 'pinewatch_longsword' }),
    description: 'A single, deliberately made longsword with a keen, even edge.',
    weaponClass: 'sword', grip: 'two-handed', damage: 28, damageType: 'cut', cooldown: 1.1, sharpness: 1, stamina: 15,
    reach: 1.35, availability: 'unique', lore: 'Made once for the pine-watch of the northern pass; nobody has made its twin.', capabilities: ['cut'],
  }),
  melee({
    ...common('damascus_sword', 'Damascus sword', 'damascus', 1.3, 900, 'merged', { v1: 'damascus_short_sword', v2: 'damascus_sword' }),
    description: 'A single-handed blade of watered steel. Lighter and keener than any common sword.',
    weaponClass: 'sword', grip: 'one-handed', damage: 20, damageType: 'cut', cooldown: 0.9, sharpness: 1, stamina: 11,
    reach: 1.15, durability: 260, capabilities: ['cut'],
  }),
  melee({
    ...common('damascus_longsword', 'Damascus longsword', 'damascus', 2, 1500, 'v1', { v1: 'damascus_long_sword' }),
    description: 'An elite two-handed blade of Damascus steel: heavier and clearly more dangerous than a common longsword.',
    weaponClass: 'sword', grip: 'two-handed', damage: 26.5, damageType: 'cut', cooldown: 1.2, sharpness: 1, stamina: 15,
    reach: 1.35, durability: 260, capabilities: ['cut'],
  }),
  melee({
    ...common('obsidian_sword', 'Obsidian sword', 'obsidian', 1.5, 760, 'v1', { v1: 'obsidian_sword' }),
    description: 'A rare sword of volcanic glass. Wickedly sharp, but it will not survive hard use.',
    weaponClass: 'sword', grip: 'one-handed', damage: 19.5, damageType: 'cut', cooldown: 0.85, sharpness: 0.97, stamina: 11,
    reach: 1.1, durability: 90, capabilities: ['cut'],
  }),
  melee({
    ...common('millbrook_shortsword', 'Millbrook short sword', 'steel', 1.2, 450, 'v2', { v2: 'millbrook_shortsword' }),
    description: 'Hits harder than a common short sword, but tires the arm.',
    weaponClass: 'sword', grip: 'one-handed', damage: 17.6, damageType: 'cut', cooldown: 0.8, sharpness: 0.8, stamina: 11,
    reach: 0.9, tier: 'masterwork', lore: 'A militia smith\'s best piece; it hits harder but tires the arm.', capabilities: ['cut'],
  }),
  melee({
    ...common('harrow_shortsword', 'Harrow short sword', 'steel', 1.3, 900, 'v2', { v2: 'harrow_shortsword' }),
    description: 'Heavy and razor-edged; it swings slower than a short sword should.',
    weaponClass: 'sword', grip: 'one-handed', damage: 22.4, damageType: 'cut', cooldown: 0.85, sharpness: 1, stamina: 11,
    reach: 0.9, tier: 'legendary', availability: 'unique', lore: 'A heavy, razor-edged blade from a ruined watch post; it swings slower than a short sword should.', capabilities: ['cut'],
  }),
  melee({
    ...common('fenmoor_sword', 'Fenmoor sword', 'steel', 1.5, 600, 'merged', { v1: 'masterwork_sword', v2: 'fenmoor_sword' }),
    description: 'A master smith\'s sword, balanced to the grain of its steel; a little heavier than a common sword.',
    weaponClass: 'sword', grip: 'one-handed', damage: 22.3, damageType: 'cut', cooldown: 0.95, sharpness: 0.85, stamina: 13,
    reach: 1.1, tier: 'masterwork', lore: 'Balanced to the grain of its steel; a little heavier than a common sword.', capabilities: ['cut'],
  }),
  melee({
    ...common('ironvale_sword', 'Ironvale sword', 'steel', 1.6, 1200, 'v2', { v2: 'ironvale_sword' }),
    description: 'Long and keen, and hungry for stamina.',
    weaponClass: 'sword', grip: 'one-handed', damage: 26.8, damageType: 'cut', cooldown: 0.95, sharpness: 1, stamina: 14,
    reach: 1.2, tier: 'legendary', availability: 'unique', lore: 'Said to come from a drowned estate; long and keen, hungry for stamina.', capabilities: ['cut'],
  }),
  melee({
    ...common('stonebridge_longsword', 'Stonebridge longsword', 'steel', 2.1, 800, 'v2', { v2: 'stonebridge_longsword' }),
    description: 'A two-hander for a tall man: more bite, a little slower.',
    weaponClass: 'sword', grip: 'two-handed', damage: 28.2, damageType: 'cut', cooldown: 1.25, sharpness: 0.9, stamina: 17,
    reach: 1.3, tier: 'masterwork', lore: 'A two-hander for a tall man: more bite, a little slower.', capabilities: ['cut'],
  }),
  melee({
    ...common('greywatch_longsword', 'Greywatch longsword', 'steel', 2.4, 1600, 'v2', { v2: 'greywatch_longsword' }),
    description: 'Heavy and slow; it ends a fight in one blow if it lands.',
    weaponClass: 'sword', grip: 'two-handed', damage: 34, damageType: 'cut', cooldown: 1.3, sharpness: 1, stamina: 17,
    reach: 1.4, tier: 'legendary', availability: 'unique', lore: 'Heavy and slow, it ends a fight in one blow if it lands.', capabilities: ['cut'],
  }),

  // --- Axes ---
  melee({
    ...common('hatchet', 'Hatchet', 'iron', 1.3, 40, 'merged', { v1: 'hatchet', v2: 'small_axe' }),
    description: 'A compact one-handed axe. Chops firewood and, in a pinch, bone; a cheap fighting weapon.',
    weaponClass: 'axe', grip: 'one-handed', damage: 15, damageType: 'cut', cooldown: 0.95, sharpness: 0.6, stamina: 12,
    reach: 0.9, capabilities: ['chop'],
  }),
  melee({
    ...common('axe', 'Woodcutter\'s axe', 'iron', 1.8, 45, 'merged', { v1: 'axe', v2: 'axe' }),
    description: 'A felling axe with a steel bit. Made for trees, but it works as a weapon.',
    weaponClass: 'axe', grip: 'one-handed', damage: 16, damageType: 'cut', cooldown: 1.1, sharpness: 0.6, stamina: 14,
    reach: 1.1, capabilities: ['chop'],
  }),
  melee({
    ...common('battle_axe', 'Battle axe', 'steel', 3, 110, 'merged', { v1: 'battle_axe', v2: 'big_axe' }),
    description: 'A heavy two-handed bearded axe. Slow and tiring, and it splits shields as well as trees.',
    weaponClass: 'axe', grip: 'two-handed', damage: 28, damageType: 'cut', cooldown: 1.5, sharpness: 0.6, stamina: 22,
    reach: 1.3, capabilities: ['chop'],
  }),

  // --- Polearms and spears ---
  melee({
    ...common('spear', 'Spear', 'wood', 2, 35, 'merged', { v1: 'spear', v2: 'spear' }),
    description: 'An ash shaft with an iron head. Long reach for war and for hunting boar.',
    weaponClass: 'spear', grip: 'two-handed', damage: 17, damageType: 'pierce', cooldown: 1.1, sharpness: 0.7, stamina: 12,
    reach: 1.9,
  }),
  melee({
    ...common('halberd', 'Halberd', 'mixed', 3.2, 140, 'new'),
    description: 'An axe blade, a spike and a hook on a long shaft. Reaches over shields, but needs room and strong arms.',
    weaponClass: 'polearm', grip: 'two-handed', damage: 30, damageType: 'cut', cooldown: 1.6, sharpness: 0.65, stamina: 20,
    reach: 2.1, availability: 'future',
  }),

  // --- Blunt ---
  melee({
    ...common('club', 'Club', 'wood', 1.5, 6, 'v2', { v2: 'club' }),
    description: 'A knotted length of oak. The weapon of anyone who owns nothing else.',
    weaponClass: 'mace', grip: 'one-handed', damage: 11, damageType: 'blunt', cooldown: 1, sharpness: 0, stamina: 11,
    reach: 0.9,
  }),
  melee({
    ...common('mace', 'Mace', 'iron', 1.6, 60, 'new'),
    description: 'An iron-flanged head on a short haft. Dents helmets and the heads under them.',
    weaponClass: 'mace', grip: 'one-handed', damage: 16, damageType: 'blunt', cooldown: 1, sharpness: 0, stamina: 12,
    reach: 0.8, availability: 'future',
  }),
  melee({
    ...common('war_hammer', 'War hammer', 'iron', 2.5, 95, 'v2', { v2: 'war_hammer' }),
    description: 'A hammer head with a back spike. Slow, but breaks plate and the bones beneath.',
    weaponClass: 'hammer', grip: 'one-handed', damage: 22, damageType: 'blunt', cooldown: 1.3, sharpness: 0, stamina: 18,
    reach: 1.1,
  }),
  melee({
    ...common('staff', 'Staff', 'wood', 1.2, 3, 'v2', { v2: 'staff' }),
    description: 'A traveller\'s quarterstaff. Long reach, light blows; it keeps dogs and bandits at a distance.',
    weaponClass: 'staff', grip: 'two-handed', damage: 8, damageType: 'blunt', cooldown: 0.9, sharpness: 0, stamina: 8,
    reach: 1.6,
  }),
]

export const RANGED_WEAPONS: readonly RangedWeapon[] = [
  ranged({
    ...common('sling', 'Sling', 'leather', 0.2, 9, 'v1', { v1: 'sling', v2: 'sling' }),
    description: 'A leather pouch on two cords. Cheap, light and surprisingly deadly at a short distance.',
    weaponClass: 'sling', grip: 'one-handed', damage: 8, damageType: 'blunt', cooldown: 0.8, stamina: 5,
    range: 35, ammo: 'stone', drawTime: 0.7, projectileSpeed: 35, size: 'XS',
  }),
  ranged({
    ...common('short_bow', 'Short bow', 'wood', 0.8, 45, 'merged', { v1: 'short_bow', v2: 'short_bow' }),
    description: 'A light self bow. Fast to draw and easy to carry, but with the least punch of the bows.',
    weaponClass: 'bow', grip: 'two-handed', damage: 14, damageType: 'pierce', cooldown: 0.6, stamina: 6,
    range: 45, ammo: 'arrow', drawTime: 0.9, projectileSpeed: 45,
  }),
  ranged({
    ...common('hunting_bow', 'Hunting bow', 'wood', 1, 65, 'v1', { v1: 'hunting_bow' }),
    description: 'A balanced bow for deer and men. Good range and damage without the heavy draw of a longbow.',
    weaponClass: 'bow', grip: 'two-handed', damage: 18, damageType: 'pierce', cooldown: 0.75, stamina: 8,
    range: 52, ammo: 'arrow', drawTime: 1.1, projectileSpeed: 52, availability: 'future',
  }),
  ranged({
    ...common('long_bow', 'Longbow', 'wood', 1.2, 90, 'merged', { v1: 'long_bow', v2: 'long_bow' }),
    description: 'A tall yew bow with a heavy draw. Long range and the hardest hit of the common bows.',
    weaponClass: 'bow', grip: 'two-handed', damage: 22, damageType: 'pierce', cooldown: 0.9, stamina: 10,
    range: 60, ammo: 'arrow', drawTime: 1.4, projectileSpeed: 60,
  }),
  ranged({
    ...common('composite_bow', 'Composite bow', 'mixed', 1, 160, 'v2', { v2: 'composite_bow' }),
    description: 'Horn, sinew and wood glued into a short, powerful bow. Fast and strong, costly to make.',
    weaponClass: 'bow', grip: 'two-handed', damage: 20, damageType: 'pierce', cooldown: 0.7, stamina: 8,
    range: 58, ammo: 'arrow', drawTime: 1, projectileSpeed: 62, availability: 'future',
  }),
  ranged({
    ...common('marlow_longbow', 'Marlow longbow', 'wood', 1.2, 450, 'merged', { v1: 'masterwork_hunting_bow', v2: 'marlow_longbow' }),
    description: 'Seasoned yew with a stronger draw; arrows fly a little faster.',
    weaponClass: 'bow', grip: 'two-handed', damage: 25.9, damageType: 'pierce', cooldown: 0.9, stamina: 10,
    range: 62, ammo: 'arrow', drawTime: 1.5, projectileSpeed: 62, tier: 'masterwork', lore: 'Seasoned yew, stronger draw; an arrow flies a little faster.',
  }),
  ranged({
    ...common('yewmaster_longbow', 'Yewmaster longbow', 'wood', 1.4, 1000, 'v2', { v2: 'yewmaster_longbow' }),
    description: 'A war bow with a draw only a hunter\'s shoulders can hold.',
    weaponClass: 'bow', grip: 'two-handed', damage: 30.6, damageType: 'pierce', cooldown: 0.9, stamina: 11,
    range: 68, ammo: 'arrow', drawTime: 1.5, projectileSpeed: 70, tier: 'legendary', availability: 'unique', lore: 'A war bow with a draw only a hunter\'s shoulders can hold.',
  }),
  ranged({
    ...common('crossbow', 'Crossbow', 'mixed', 3.5, 180, 'merged', { v1: 'crossbow', v2: 'crossbow' }),
    description: 'A slow, heavy, powerful weapon. Anyone can use it after a day; reloading takes ages.',
    weaponClass: 'crossbow', grip: 'two-handed', damage: 30, damageType: 'pierce', cooldown: 3.5, stamina: 4,
    range: 80, ammo: 'bolt', drawTime: 0.2, projectileSpeed: 75, availability: 'future',
  }),
]

const ammoBase = (
  id: string,
  name: string,
  price: number,
  weight: number,
  origin: ItemBase['origin'],
  legacyIds?: ItemBase['legacyIds'],
) => ({ ...common(id, name, 'mixed', weight, price, origin, legacyIds) })

const ammoDamage = (ammoKind: AmmoItem['ammoKind'], damageBonus: number, damageType: DamageType = 'pierce') => ({
  ammoKind, damageBonus, damageType,
})

export const AMMO: readonly AmmoItem[] = [
  ammo({
    ...ammoBase('arrow', 'Arrow (broadhead)', 1, 0.03, 'merged', { v1: 'broadhead_arrow', v2: 'arrow' }),
    description: 'A broad iron head that cuts a wide wound. The everyday hunting and war arrow.', ...ammoDamage('arrow', 2),
  }),
  ammo({
    ...ammoBase('arrow_bodkin', 'Arrow (bodkin)', 2, 0.03, 'merged', { v1: 'war_arrow', v2: 'arrow_bodkin' }),
    description: 'A narrow, square-section point made to punch through mail.', ...ammoDamage('arrow', 5),
  }),
  ammo({
    ...ammoBase('arrow_blunt', 'Arrow (blunt)', 1, 0.03, 'v2', { v2: 'arrow_blunt' }),
    description: 'A wooden knob instead of a head. Stuns small game and spares the pelt.', ...ammoDamage('arrow', 0, 'blunt'),
    availability: 'future',
  }),
  ammo({
    ...ammoBase('bolt', 'Bolt', 2, 0.05, 'v2', { v2: 'bolt' }),
    description: 'A short, heavy crossbow quarrel with an iron head.', ...ammoDamage('bolt', 3), availability: 'future',
  }),
  ammo({
    ...ammoBase('bolt_heavy', 'Heavy bolt', 3, 0.07, 'v2', { v2: 'bolt_heavy' }),
    description: 'A weighted quarrel for the heaviest crossbows; it goes through shields.', ...ammoDamage('bolt', 7), availability: 'future',
  }),
  ammo({
    ...ammoBase('bolt_blunt', 'Blunt bolt', 2, 0.05, 'v2', { v2: 'bolt_blunt' }),
    description: 'A crossbow quarrel with a rounded head; stuns birds and small animals.', ...ammoDamage('bolt', 1, 'blunt'), availability: 'future',
  }),
  ammo({
    ...ammoBase('sling_stone', 'Sling stone', 0, 0.1, 'v2', { v2: 'sling_stone' }),
    description: 'A smooth river pebble. Free; there are always more.', ...ammoDamage('stone', 0, 'blunt'), size: 'XXS',
  }),
]

export const SHIELDS: readonly ShieldItem[] = [
  shield({
    ...common('buckler', 'Buckler', 'wood', 1, 25, 'new'),
    description: 'A small round shield held at arm\'s length. Quick to parry, but covers little.',
    size: 'MD', durability: 120, shieldClass: 'buckler', arcDeg: 90, reduction: 0.7, efficiency: 0.5, parryWindowS: 0.35, canParry: true,
    availability: 'future',
  }),
  shield({
    ...common('wooden_shield', 'Wooden shield', 'wood', 3.2, 35, 'v2', { v2: 'wooden_shield' }),
    description: 'A round plank shield with a leather rim. The usual protection of a farmer-turned-soldier.',
    size: 'LG', durability: 160, shieldClass: 'round', arcDeg: 140, reduction: 0.8, efficiency: 0.6, parryWindowS: 0.25, canParry: true,
  }),
  shield({
    ...common('iron_rimmed_shield', 'Iron-rimmed shield', 'mixed', 4, 90, 'v2', { v2: 'guard_shield' }),
    description: 'A heater shield with an iron rim and boss. Heavy, but the road-guard trusts it.',
    size: 'LG', durability: 200, shieldClass: 'heater', arcDeg: 150, reduction: 0.85, efficiency: 0.7, parryWindowS: 0.25, canParry: true,
    availability: 'quest-only',
  }),
]

/**
 * Armour. Torso anchors and the four tiered torso pieces are v2 values; v1 pauldrons, mail and leather armour merged in;
 * the other slots are filled so that every family has a coherent set (padded < leather < studded < mail < plate).
 * Resist is per damage type (cut / pierce / blunt); coverage weights per slot are in `loadout.ts`.
 * @domain items
 */
import type { ArmorFamily, ArmorItem, ArmorLayer, ArmorSlot, ItemBase, ItemMaterial, Resist } from './types'

interface ArmorInput {
  id: string
  name: string
  description: string
  slot: ArmorSlot
  family: ArmorFamily
  material: ItemMaterial
  weight: number
  price: number
  /** cut, pierce, blunt */
  resist: [number, number, number]
  speedPenalty: number
  layer?: ArmorLayer
  durability?: number
  tier?: ArmorItem['tier']
  lore?: string
  availability?: ArmorItem['availability']
  origin?: ItemBase['origin']
  legacyIds?: ItemBase['legacyIds']
}

const toResist = ([cut, pierce, blunt]: [number, number, number]): Resist => ({ blunt, cut, pierce })

const armor = (a: ArmorInput): ArmorItem => ({
  id: a.id,
  name: a.name,
  description: a.description,
  category: 'armor',
  material: a.material,
  tier: a.tier ?? 'common',
  weight: a.weight,
  size: a.weight >= 8 ? 'LG' : a.weight >= 1 ? 'MD' : 'SM',
  price: a.price,
  durability: a.durability ?? 300,
  availability: a.availability ?? 'active',
  origin: a.origin ?? 'new',
  legacyIds: a.legacyIds,
  lore: a.lore,
  slot: a.slot,
  layer: a.layer ?? 'outer',
  family: a.family,
  resist: toResist(a.resist),
  speedPenalty: a.speedPenalty,
})

export const ARMOR: readonly ArmorItem[] = [
  // --- Head ---
  armor({
    id: 'padded_cap', name: 'Padded cap', slot: 'head', family: 'padded', material: 'cloth', layer: 'under', weight: 0.3, price: 8,
    description: 'A quilted arming cap worn under a helmet; soaks up the blow that gets through.',
    resist: [0.15, 0.05, 0.2], speedPenalty: 0,
  }),
  armor({
    id: 'leather_cap', name: 'Leather cap', slot: 'head', family: 'leather', material: 'leather', weight: 0.6, price: 12,
    description: 'A stiff boiled-leather cap. Better than a bare head, not much better.',
    resist: [0.25, 0.1, 0.15], speedPenalty: 0, origin: 'v2', legacyIds: { v2: 'leather_cap' },
  }),
  armor({
    id: 'mail_coif', name: 'Mail coif', slot: 'head', family: 'mail', material: 'iron', weight: 0.9, price: 90,
    description: 'A hood of riveted iron rings that protects head, neck and shoulders from cuts.',
    resist: [0.55, 0.3, 0.1], speedPenalty: 0,
  }),
  armor({
    id: 'iron_helm', name: 'Iron helm', slot: 'head', family: 'plate', material: 'iron', weight: 2.2, price: 80,
    description: 'An open iron helmet with a brim; a soldier\'s standard.',
    resist: [0.7, 0.5, 0.3], speedPenalty: 0.01, origin: 'v2', legacyIds: { v2: 'iron_helm' },
  }),
  armor({
    id: 'full_helm', name: 'Full helm', slot: 'head', family: 'plate', material: 'steel', weight: 3.2, price: 220,
    description: 'A closed steel helmet with a visor. Stops almost everything, narrows the view and the breath.',
    resist: [0.8, 0.6, 0.4], speedPenalty: 0.02,
  }),

  // --- Shoulders ---
  armor({
    id: 'leather_pauldron', name: 'Leather pauldrons', slot: 'shoulders', family: 'leather', material: 'leather', weight: 0.7, price: 15,
    description: 'Light shoulder guards of leather: some protection at no cost to mobility.',
    resist: [0.2, 0.1, 0.1], speedPenalty: 0, origin: 'v1', legacyIds: { v1: 'leather_pauldron' },
  }),
  armor({
    id: 'ranger_pauldron', name: 'Ranger pauldrons', slot: 'shoulders', family: 'studded', material: 'leather', weight: 1, price: 28,
    description: 'Studded leather shoulder guards a tracker can draw a bow in.',
    resist: [0.3, 0.15, 0.15], speedPenalty: 0, origin: 'v1', legacyIds: { v1: 'ranger_pauldron' },
  }),
  armor({
    id: 'iron_pauldrons', name: 'Iron pauldrons', slot: 'shoulders', family: 'mail', material: 'iron', weight: 1.8, price: 45,
    description: 'Overlapping iron lames on leather straps; guard the shoulders against downward cuts.',
    resist: [0.4, 0.25, 0.2], speedPenalty: 0.01, origin: 'v2', legacyIds: { v2: 'pauldrons' },
  }),
  armor({
    id: 'plate_pauldrons_spiked', name: 'Spiked plate pauldrons', slot: 'shoulders', family: 'plate', material: 'steel', weight: 1.8, price: 110,
    description: 'Plate shoulders with a spike on each. Solid protection; the spikes keep grapplers honest.',
    resist: [0.55, 0.45, 0.25], speedPenalty: 0.01, origin: 'v1', legacyIds: { v1: 'knight_pauldron_spike' },
  }),
  armor({
    id: 'plate_pauldrons_round', name: 'Round plate pauldrons', slot: 'shoulders', family: 'plate', material: 'steel', weight: 2.1, price: 120,
    description: 'Heavy domed plate shoulders. The best shoulder protection on offer, still short of a full cuirass.',
    resist: [0.6, 0.45, 0.3], speedPenalty: 0.015, origin: 'v1', legacyIds: { v1: 'knight_pauldron_round' },
  }),

  // --- Torso ---
  armor({
    id: 'padded_jacket', name: 'Gambeson', slot: 'torso', family: 'padded', material: 'cloth', layer: 'under', weight: 3, price: 30,
    description: 'A quilted linen jacket. Worn alone it stops cuts and bruises; worn under mail it is half the armour.',
    resist: [0.2, 0.1, 0.25], speedPenalty: 0.01, origin: 'v2', legacyIds: { v2: 'padded_jacket' },
  }),
  armor({
    id: 'leather_jerkin', name: 'Leather jerkin', slot: 'torso', family: 'leather', material: 'leather', weight: 4, price: 50,
    description: 'A jacket of hardened leather. Balanced protection at modest cost to mobility.',
    resist: [0.3, 0.15, 0.15], speedPenalty: 0.02, origin: 'merged', legacyIds: { v1: 'leather_armor', v2: 'leather_jerkin' },
  }),
  armor({
    id: 'studded_leather', name: 'Studded leather', slot: 'torso', family: 'studded', material: 'leather', weight: 6, price: 90,
    description: 'Leather with iron studs riveted in. Better against blades than plain leather, and still light.',
    resist: [0.4, 0.25, 0.2], speedPenalty: 0.03, origin: 'v2', legacyIds: { v2: 'studded_leather' },
  }),
  armor({
    id: 'mail_shirt', name: 'Mail shirt', slot: 'torso', family: 'mail', material: 'iron', weight: 10, price: 240,
    description: 'A shirt of riveted iron rings. The best defence against cuts short of plate; heavy, and tiring to wear.',
    resist: [0.65, 0.35, 0.15], speedPenalty: 0.05, origin: 'merged', legacyIds: { v1: 'chainmail', v2: 'chainmail' },
  }),
  armor({
    id: 'brigandine', name: 'Brigandine', slot: 'torso', family: 'plate', material: 'mixed', weight: 11, price: 320,
    description: 'Small steel plates riveted inside a cloth coat. Resists arrows and blows better than mail, cuts slightly less.',
    resist: [0.6, 0.45, 0.3], speedPenalty: 0.06, availability: 'future',
  }),
  armor({
    id: 'plate_cuirass', name: 'Plate cuirass', slot: 'torso', family: 'plate', material: 'steel', weight: 12, price: 420,
    description: 'A steel breast- and backplate. Turns most blades and arrows; it is heavy and slows the wearer.',
    resist: [0.8, 0.6, 0.35], speedPenalty: 0.07, origin: 'v2', legacyIds: { v2: 'plate_cuirass' },
  }),
  armor({
    id: 'stoneford_mail', name: 'Stoneford mail', slot: 'torso', family: 'mail', material: 'steel', weight: 11, price: 700,
    description: 'Riveted rings, tighter than common; better against arrows and bolts, a little heavier.',
    resist: [0.7, 0.412, 0.17], speedPenalty: 0.06, tier: 'masterwork', origin: 'v2', legacyIds: { v2: 'stoneford_mail' },
    lore: 'Riveted rings, tighter than common; better against arrows and bolts, a little heavier.',
  }),
  armor({
    id: 'kingsbane_hauberk', name: 'Kingsbane hauberk', slot: 'torso', family: 'mail', material: 'steel', weight: 12.5, price: 1500, durability: 380,
    description: 'A double-ringed hauberk that turns spears, but it is heavy.',
    resist: [0.7, 0.432, 0.184], speedPenalty: 0.075, tier: 'legendary', availability: 'unique', origin: 'v2', legacyIds: { v2: 'kingsbane_hauberk' },
    lore: 'A double-ringed hauberk from a fallen garrison; it turns spears, but it is heavy.',
  }),
  armor({
    id: 'ravenmoor_cuirass', name: 'Ravenmoor cuirass', slot: 'torso', family: 'plate', material: 'steel', weight: 12.6, price: 1100,
    description: 'Well-hammered plate that spreads a blow; it wears like iron.',
    resist: [0.8, 0.67, 0.412], speedPenalty: 0.08, tier: 'masterwork', origin: 'v2', legacyIds: { v2: 'ravenmoor_cuirass' },
    lore: 'Well-hammered plate that spreads a blow; it wears like iron.',
  }),
  armor({
    id: 'marshal_cuirass', name: 'Marshal\'s cuirass', slot: 'torso', family: 'plate', material: 'steel', weight: 13.5, price: 2400, durability: 400,
    description: 'The breastplate of a long-dead marshal; it shrugs off maces, and slows its wearer.',
    resist: [0.85, 0.69, 0.431], speedPenalty: 0.095, tier: 'legendary', availability: 'unique', origin: 'v2', legacyIds: { v2: 'marshal_cuirass' },
    lore: 'The breastplate of a long-dead marshal; it shrugs off maces, and slows its wearer.',
  }),

  // --- One-of-a-kind, non-legendary armour ---
  armor({
    id: 'saltmere_wardens_coat', name: "Saltmere warden's coat", slot: 'torso', family: 'studded', material: 'mixed',
    weight: 7.4, price: 590, durability: 340, availability: 'unique',
    description: 'A close-fitted coat reinforced with hidden iron plates. Protects better than studded leather but yields to heavy blows.',
    resist: [0.51, 0.34, 0.23], speedPenalty: 0.045,
    lore: 'Made for a warden whose name has faded from the town rolls; the fit was never copied.',
  }),
  armor({
    id: 'northpass_riders_helm', name: "Northpass rider's helm", slot: 'head', family: 'plate', material: 'steel',
    weight: 2.7, price: 430, durability: 330, availability: 'unique',
    description: 'A close steel helmet with a reinforced brow. Better against piercing strikes than an open helm, but less protective than full plate.',
    resist: [0.76, 0.57, 0.33], speedPenalty: 0.016,
    lore: 'Its uneven brow was reshaped for one rider after a fall; no second helm was made to match.',
  }),

  // --- Forearms ---
  armor({
    id: 'leather_bracers', name: 'Leather bracers', slot: 'forearms', family: 'leather', material: 'leather', weight: 0.6, price: 20,
    description: 'Laced leather forearm guards; turn a glancing cut.',
    resist: [0.35, 0.2, 0.1], speedPenalty: 0, origin: 'v2', legacyIds: { v2: 'bracers' },
  }),
  armor({
    id: 'iron_vambraces', name: 'Iron vambraces', slot: 'forearms', family: 'mail', material: 'iron', weight: 1.1, price: 50,
    description: 'Iron tubes strapped over the forearms; good for taking a blow on the arm.',
    resist: [0.55, 0.35, 0.2], speedPenalty: 0.005,
  }),
  armor({
    id: 'plate_vambraces', name: 'Plate vambraces', slot: 'forearms', family: 'plate', material: 'steel', weight: 1.5, price: 110,
    description: 'Hinged steel arm armour that fits snugly and does not hamper the sword arm.',
    resist: [0.7, 0.5, 0.3], speedPenalty: 0.01,
  }),

  // --- Hands ---
  armor({
    id: 'leather_gloves', name: 'Leather gloves', slot: 'hands', family: 'leather', material: 'leather', weight: 0.3, price: 10,
    description: 'Plain work gloves. They keep the cold and the odd splinter out.',
    resist: [0.2, 0.1, 0.1], speedPenalty: 0, origin: 'v2', legacyIds: { v2: 'leather_gloves' },
  }),
  armor({
    id: 'studded_gloves', name: 'Studded gloves', slot: 'hands', family: 'studded', material: 'leather', weight: 0.5, price: 25,
    description: 'Gloves with iron studs across the knuckles and the back of the hand.',
    resist: [0.3, 0.2, 0.15], speedPenalty: 0,
  }),
  armor({
    id: 'plate_gauntlets', name: 'Plate gauntlets', slot: 'hands', family: 'plate', material: 'steel', weight: 1.2, price: 95,
    description: 'Articulated steel gauntlets. A fist in one can break a jaw.',
    resist: [0.65, 0.5, 0.3], speedPenalty: 0.01,
  }),

  // --- Legs ---
  armor({
    id: 'padded_hose', name: 'Padded hose', slot: 'legs', family: 'padded', material: 'cloth', layer: 'under', weight: 1.4, price: 18,
    description: 'Quilted leg wraps worn under mail or plate.',
    resist: [0.15, 0.05, 0.2], speedPenalty: 0,
  }),
  armor({
    id: 'leather_trousers', name: 'Leather trousers', slot: 'legs', family: 'leather', material: 'leather', weight: 1.8, price: 22,
    description: 'Tough trousers of cured hide; good against brambles and a knife on the thigh.',
    resist: [0.25, 0.1, 0.1], speedPenalty: 0.01, origin: 'v2', legacyIds: { v2: 'leather_trousers' },
  }),
  armor({
    id: 'mail_chausses', name: 'Mail chausses', slot: 'legs', family: 'mail', material: 'iron', weight: 4.5, price: 160,
    description: 'Mail leggings laced to the thigh. Heavy, but a leg wound can end a fight.',
    resist: [0.6, 0.3, 0.12], speedPenalty: 0.03,
  }),
  armor({
    id: 'plate_greaves', name: 'Plate greaves', slot: 'legs', family: 'plate', material: 'steel', weight: 5, price: 240,
    description: 'Steel plates for thigh and shin. The best leg protection and the heaviest.',
    resist: [0.75, 0.55, 0.32], speedPenalty: 0.04,
  }),

  // --- Unique armour accessories (one physical instance per item) ---
  armor({
    id: 'thornwatch_pauldrons', name: 'Thornwatch pauldrons', slot: 'shoulders', family: 'plate', material: 'steel',
    weight: 2.3, price: 510, durability: 350, availability: 'unique',
    description: 'Carefully curved steel shoulder guards deflect glancing cuts, but their weight taxes long marches.',
    resist: [0.66, 0.48, 0.33], speedPenalty: 0.021,
    lore: 'Their mismatched rivets mark repeated repairs to one old pair, never copied by the workshop.',
  }),
  armor({
    id: 'blackpine_vambraces', name: 'Blackpine vambraces', slot: 'forearms', family: 'plate', material: 'steel',
    weight: 1.7, price: 310, durability: 340, availability: 'unique',
    description: 'Reinforced forearm plates spread hard impacts, at the cost of a little extra arm weight.',
    resist: [0.74, 0.54, 0.35], speedPenalty: 0.015,
    lore: 'The inner leather bears a single armorer\'s mark; the plates were shaped for one wearer.',
  }),
  armor({
    id: 'fallowmere_gauntlets', name: 'Fallowmere gauntlets', slot: 'hands', family: 'plate', material: 'steel',
    weight: 1.35, price: 270, durability: 340, availability: 'unique',
    description: 'Close-jointed steel gloves protect the fingers without sacrificing grip, though they add weight.',
    resist: [0.69, 0.54, 0.34], speedPenalty: 0.012,
    lore: 'A smith fitted every joint to an unknown sword hand; its unusual finger lengths remain.',
  }),
  armor({
    id: 'ridgeguard_greaves', name: 'Ridgeguard greaves', slot: 'legs', family: 'plate', material: 'steel',
    weight: 5.4, price: 520, durability: 360, availability: 'unique',
    description: 'Thick, well-fitted leg plates resist cuts and thrusts but make running more tiring.',
    resist: [0.79, 0.59, 0.36], speedPenalty: 0.047,
    lore: 'A dented knee piece records a blow that its former owner survived; no matching pair was forged.',
  }),

  // --- Feet ---
  armor({
    id: 'leather_boots', name: 'Leather boots', slot: 'feet', family: 'leather', material: 'leather', weight: 1.2, price: 18,
    description: 'Hobnailed travelling boots. The right footwear makes the miles go faster.',
    resist: [0.2, 0.1, 0.1], speedPenalty: -0.03, origin: 'v2', legacyIds: { v2: 'leather_boots' },
  }),
  armor({
    id: 'reinforced_boots', name: 'Reinforced boots', slot: 'feet', family: 'studded', material: 'leather', weight: 1.6, price: 40,
    description: 'Boots with iron toecaps and shin strips.',
    resist: [0.3, 0.2, 0.15], speedPenalty: 0,
  }),
  armor({
    id: 'plate_sabatons', name: 'Plate sabatons', slot: 'feet', family: 'plate', material: 'steel', weight: 2, price: 85,
    description: 'Steel foot armour with articulated toes. Walks louder than it looks.',
    resist: [0.6, 0.45, 0.3], speedPenalty: 0.015,
  }),
]

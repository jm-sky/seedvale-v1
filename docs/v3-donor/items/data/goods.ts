/**
 * Goods (non-equipment items): tools, food, herbs, medical, resources, books and misc. Stats from v2 (`game/data/items.ts`)
 * where it has the entry; v2 numbers are converted to kg and copper as they are. Holds the items--006 seed entries and the
 * B2-6 port (TB-010 tools, TB-011 the rest; 68 reviewed drafts), so every id that NPC kits and stores name resolves (kitIds.test.ts).
 * B2-6a adds the three v2 herbs those kits never named (arnica, hemlock, nightshade). heal, poison and cures stay catalogue data.
 * Tools wear out (durability > 0) except consumable tools (torch, rushlight: stack, no wear, D-ITM-24); every other good keeps `durability: 1` (D-ITM-19).
 * Tools may have no capabilities yet (D-ITM-25).
 * @domain items
 */
import type { BookItem, FoodItem, HerbItem, ItemBase, MedicalItem, MiscItem, ResourceItem, ToolItem } from './types'

type GoodsInput<T extends ItemBase> = Omit<T, 'availability' | 'category' | 'durability' | 'origin' | 'tier'>
  & Partial<Pick<T, 'availability' | 'durability' | 'origin' | 'tier'>>

const tool = (t: GoodsInput<ToolItem>): ToolItem => ({
  availability: 'active',
  durability: 250,
  origin: 'new',
  tier: 'common',
  ...t,
  category: 'tool',
})

const food = (f: GoodsInput<FoodItem>): FoodItem => ({
  availability: 'active',
  durability: 1,
  origin: 'new',
  tier: 'common',
  ...f,
  category: 'food',
})

const herb = (h: GoodsInput<HerbItem>): HerbItem => ({
  availability: 'active',
  durability: 1,
  origin: 'new',
  tier: 'common',
  ...h,
  category: 'herb',
})

const medical = (m: GoodsInput<MedicalItem>): MedicalItem => ({
  availability: 'active',
  durability: 1,
  origin: 'new',
  tier: 'common',
  ...m,
  category: 'medical',
})

const resource = (r: GoodsInput<ResourceItem>): ResourceItem => ({
  availability: 'active',
  durability: 1,
  origin: 'new',
  tier: 'common',
  ...r,
  category: 'resource',
})

const book = (b: GoodsInput<BookItem>): BookItem => ({
  availability: 'active',
  durability: 1,
  origin: 'new',
  tier: 'common',
  ...b,
  category: 'book',
})

const misc = (m: GoodsInput<MiscItem>): MiscItem => ({
  availability: 'active',
  durability: 1,
  origin: 'new',
  tier: 'common',
  ...m,
  category: 'misc',
})

export const TOOLS: readonly ToolItem[] = [
  // basis: axe (1.8 kg, 45 copper) and chisel as woodworking tools
  tool({
    id: 'adze', name: 'Adze', material: 'iron', weight: 1.3, size: 'MD', price: 24,
    capabilities: ['chop'],
    description: 'A curved blade fixed across its handle, used to hew beams and smooth rough timber.',
    origin: 'new',
  }),
  // basis: hammer (1 kg, 20 copper); lighter iron hand tool
  tool({
    id: 'auger', name: 'Auger', material: 'iron', weight: 0.8, size: 'MD', price: 18,
    capabilities: [],
    description: 'A hand-turned boring tool for making clean holes in timber before pegs are fitted.',
    origin: 'new',
  }),
  tool({
    id: 'backpack', name: 'Backpack', material: 'leather', weight: 1.5, size: 'LG', price: 40,
    capabilities: [], carryBonusKg: 15,
    description: 'A sturdy leather pack with shoulder straps, leaving both hands free while travelling.',
    origin: 'v2', legacyIds: { v2: 'backpack' },
  }),
  // basis: trade tool; priced between hammer and sewing kit
  // 🟡 unsure: No matching v2 item; weight and price are estimates for portable market scales.
  tool({
    id: 'balance', name: 'Balance Scales', material: 'mixed', weight: 1.2, size: 'MD', price: 25,
    capabilities: [],
    description: 'A small pair of scales for weighing coins, herbs, and other goods at market.',
    origin: 'new',
  }),
  tool({
    id: 'bucket', name: 'Bucket', material: 'wood', weight: 1.2, size: 'MD', price: 12, capabilities: ['carry_water', 'scoop'], waterCapacityL: 8,
    description: 'A wooden pail, hooped with iron, that carries eight litres of water or scoops grain from a sack.',
    origin: 'v2', legacyIds: { v2: 'bucket' },
  }),
  // basis: whetstone (0.4 kg, 3 copper) and hammer (1 kg, 20 copper)
  tool({
    id: 'chisel', name: 'Chisel', material: 'iron', weight: 0.5, size: 'SM', price: 10,
    capabilities: [],
    description: 'A narrow iron-edged tool struck with a mallet to shape stone or trim wood.',
    origin: 'new',
  }),
  // basis: fishing_rod (0.6 kg, 18 copper)
  // 🟡 unsure: No v2 fishing_net entry; net weight and price are estimated above the fishing rod.
  tool({
    id: 'fishing_net', name: 'Fishing Net', material: 'organic', weight: 1.8, size: 'LG', price: 28,
    capabilities: ['fish'],
    description: 'A knotted hemp net cast into shallows or set across a narrow stream to catch fish.',
    origin: 'new',
  }),
  tool({
    id: 'fishing_rod', name: 'Fishing Rod', material: 'wood', weight: 0.6, size: 'MD', price: 18,
    durability: 120, capabilities: ['fish'],
    description: 'A slender rod with line and hook, used to draw fish from deep water.',
    origin: 'v2', legacyIds: { v2: 'fishing_rod' },
  }),
  tool({
    id: 'flint', name: 'Flint and Steel', material: 'mixed', weight: 0.1, size: 'XS', price: 8,
    capabilities: ['fire_start'],
    description: 'A sharp flint struck against steel to throw sparks into dry tinder.',
    origin: 'v2', legacyIds: { v2: 'flint' },
  }),
  // basis: saw (1.4 kg, 35 copper), scaled for a larger frame
  tool({
    id: 'frame_saw', name: 'Frame Saw', material: 'iron', weight: 2.2, size: 'LG', price: 32,
    capabilities: ['cut'],
    description: 'A taut blade held in a wooden frame, suited to sawing boards and thick timber.',
    origin: 'new',
  }),
  // basis: bucket (1.2 kg, 12 copper); lighter woven container
  tool({
    id: 'gathering_basket', name: 'Gathering Basket', material: 'organic', weight: 0.7, size: 'MD', price: 8,
    durability: 180, capabilities: [],
    description: 'A woven basket with a broad mouth for collecting berries, roots, and useful herbs.',
    origin: 'new',
  }),
  tool({
    id: 'hammer', name: 'Hammer', material: 'iron', weight: 1, size: 'SM', price: 20,
    capabilities: ['hammer'],
    description: 'A plain iron-headed hammer for driving pegs, setting nails, and fitting wooden joints.',
    origin: 'v2', legacyIds: { v2: 'hammer' },
  }),
  // basis: shovel (2.2 kg, 30 copper), reduced for a lighter farming implement
  tool({
    id: 'hoe', name: 'Hoe', material: 'iron', weight: 1.6, size: 'MD', price: 22,
    capabilities: ['dig'],
    description: 'A broad blade on a long handle for breaking soil and drawing earth around crops.',
    origin: 'new',
  }),
  // basis: shovel (2.2 kg, 30 copper)
  // 🟡 unsure: No v2 rake entry; dig is the closest existing capability, though raking may merit its own capability.
  tool({
    id: 'iron_rake', name: 'Iron Rake', material: 'iron', weight: 1.8, size: 'LG', price: 26,
    capabilities: ['dig'],
    description: 'A long-handled rake with iron teeth for levelling beds and gathering stones from soil.',
    origin: 'new',
  }),
  // basis: wooden cup, treated as a small carved wooden utensil
  tool({
    id: 'ladle', name: 'Ladle', material: 'wood', weight: 0.25, size: 'SM', price: 3,
    durability: 180, capabilities: [],
    description: 'A deep wooden scoop for serving broth from a cooking pot without spilling it.',
    origin: 'new',
  }),
  // basis: hammer (1 kg, 20 copper), lighter wooden striking tool
  tool({
    id: 'mallet', name: 'Mallet', material: 'wood', weight: 0.7, size: 'SM', price: 8,
    capabilities: ['hammer'],
    description: 'A wooden-headed mallet delivers firm blows without marring chisels or delicate fittings.',
    origin: 'new',
  }),
  // basis: hammer (1 kg, 20 copper) and log-splitting use
  // 🟡 unsure: No v2 maul entry; weight and price reflect a heavy wooden splitting tool.
  tool({
    id: 'maul', name: 'Maul', material: 'wood', weight: 3.5, size: 'XL', price: 18,
    capabilities: ['chop'],
    description: 'A heavy wooden splitting maul drives wedges into logs for firewood and building timber.',
    origin: 'new',
  }),
  tool({
    id: 'pack_saddle_heavy', name: 'Heavy Pack Saddle', material: 'leather', weight: 6, size: 'LG', price: 70,
    capabilities: [], saddle: { kind: 'pack', capacityKg: 65 },
    description: 'A reinforced saddle frame for a pack animal carrying bulky loads over rough tracks.',
    origin: 'v2', legacyIds: { v2: 'pack_saddle_heavy' },
  }),
  tool({
    id: 'pack_saddle_light', name: 'Light Pack Saddle', material: 'leather', weight: 4, size: 'LG', price: 40,
    capabilities: [], saddle: { kind: 'pack', capacityKg: 35 },
    description: 'A light saddle frame that lets a sure-footed animal carry modest travelling goods.',
    origin: 'v2', legacyIds: { v2: 'pack_saddle_light' },
  }),
  tool({
    id: 'pan', name: 'Pan', material: 'iron', weight: 1.5, size: 'MD', price: 30,
    capabilities: ['cook_vessel'],
    description: 'A shallow iron pan for roasting food over coals or an open hearth.',
    origin: 'v2', legacyIds: { v2: 'pan' },
  }),
  tool({
    id: 'pickaxe', name: 'Pickaxe', material: 'iron', weight: 3, size: 'LG', price: 55,
    capabilities: ['mine'],
    description: 'A heavy iron pick breaks hard ground and stone where a spade cannot bite.',
    origin: 'v2', legacyIds: { v2: 'pickaxe' },
  }),
  tool({
    id: 'riding_saddle', name: 'Riding Saddle', material: 'leather', weight: 6, size: 'LG', price: 60,
    capabilities: [], saddle: { kind: 'riding' },
    description: 'A shaped leather saddle secured with girths for a rider travelling on horseback.',
    origin: 'v2', legacyIds: { v2: 'riding_saddle' },
  }),
  // basis: torch (0.6 kg, 3 copper, light radius 14 m), scaled down
  // 🟡 unsure: No v2 rushlight entry; light radius and durability are estimates for a simple fat-dipped rush.
  tool({
    id: 'rushlight', name: 'Rushlight', material: 'organic', weight: 0.1, size: 'XS', price: 1,
    durability: 1, capabilities: ['light'], lightRadiusM: 3, consumable: true,
    description: 'A dried rush dipped in fat, giving a small, wavering light indoors.',
    origin: 'new',
  }),
  // basis: backpack (1.5 kg, 40 copper, carry bonus 15 kg), simpler container
  tool({
    id: 'sack', name: 'Sack', material: 'organic', weight: 0.3, size: 'MD', price: 4,
    durability: 180, capabilities: [], carryBonusKg: 8,
    description: 'A coarse woven sack for carrying grain, gathered roots, or small trade goods.',
    origin: 'new',
  }),
  // basis: sewing_kit (0.3 kg, 15 copper)
  tool({
    id: 'sack_needle', name: 'Sack Needle', material: 'iron', weight: 0.05, size: 'XXS', price: 2,
    capabilities: ['sew'],
    description: 'A long, stout needle for stitching torn sacks and closing filled grain bags.',
    origin: 'new',
  }),
  tool({
    id: 'sewing_kit', name: 'Sewing Kit', material: 'mixed', weight: 0.3, size: 'SM', price: 15,
    capabilities: ['sew'],
    description: 'A small roll of needles, thread, and awls for mending garments and leather goods.',
    origin: 'v2', legacyIds: { v2: 'sewing_kit' },
  }),
  tool({
    id: 'shears', name: 'Shears', material: 'iron', weight: 0.6, size: 'SM', price: 22,
    capabilities: ['cut'],
    description: 'A pair of iron blades joined at the hinge, used to shear wool from sheep.',
    origin: 'v2', legacyIds: { v2: 'shears' },
  }),
  tool({
    id: 'shovel', name: 'Shovel', material: 'iron', weight: 2.2, size: 'LG', price: 30, capabilities: ['dig'],
    description: 'A spade with an iron blade and an ash handle, for digging, ditching and moving earth.',
    origin: 'v2', legacyIds: { v2: 'shovel' },
  }),
  tool({
    id: 'sickle', name: 'Sickle', material: 'iron', weight: 0.7, size: 'SM', price: 20,
    capabilities: ['cut'],
    description: 'A short curved blade for cutting grain stalks and gathering a harvest by hand.',
    origin: 'v2', legacyIds: { v2: 'sickle' },
  }),
  tool({
    id: 'snare', name: 'Snare', material: 'organic', weight: 0.6, size: 'SM', price: 12,
    capabilities: [],
    description: 'A cord loop set along a game trail, tightened by the animal\'s own movement.',
    origin: 'v2', legacyIds: { v2: 'snare' },
  }),
  // basis: chisel (0.5 kg, 10 copper), small woodworking hand tool
  tool({
    id: 'square', name: 'Carpenter\'s Square', material: 'wood', weight: 0.3, size: 'SM', price: 6,
    capabilities: [],
    description: 'A right-angled carpenter\'s square helps mark true corners when fitting boards and beams.',
    origin: 'new',
  }),
  // Camping shelter; numbers provisional (no v2 tent). Cloth + poles, sized for travel with a pack.
  tool({
    id: 'tent', name: 'Tent', material: 'cloth', weight: 4.0, size: 'LG', price: 55,
    capabilities: [],
    description: 'A canvas shelter with poles and pegs, pitched for a dry night on the road.',
    origin: 'new',
  }),
  tool({
    id: 'torch', name: 'Torch', material: 'organic', weight: 0.6, size: 'MD', price: 3,
    durability: 1, capabilities: ['light', 'fire_start'], lightRadiusM: 14, consumable: true,
    description: 'A resinous wooden brand burns brightly to light a path or kindle a fire.',
    origin: 'v2', legacyIds: { v2: 'torch' },
  }),
  tool({
    id: 'waterskin_m', name: 'Waterskin (M)', material: 'leather', weight: 0.3, size: 'SM', price: 10,
    capabilities: ['carry_water'], waterCapacityL: 4,
    description: 'A sewn leather flask with a stopper, carried on the belt for water on the road.',
    origin: 'v2', legacyIds: { v2: 'waterskin_m' },
  }),
  // basis: v2 items.ts waterskin_s (2 L, 0.2 kg, 6 copper, SM) and waterskin_l (7 L, 0.5 kg, 16 copper, MD), same leather flask.
  tool({
    id: 'waterskin_s', name: 'Waterskin (S)', material: 'leather', weight: 0.2, size: 'SM', price: 6,
    capabilities: ['carry_water'], waterCapacityL: 2,
    description: 'A small leather flask for a short walk, carried on the belt.',
    origin: 'v2', legacyIds: { v2: 'waterskin_s' },
  }),
  tool({
    id: 'waterskin_l', name: 'Waterskin (L)', material: 'leather', weight: 0.5, size: 'MD', price: 16,
    capabilities: ['carry_water'], waterCapacityL: 7,
    description: 'A large leather flask for long journeys, slung over the shoulder.',
    origin: 'v2', legacyIds: { v2: 'waterskin_l' },
  }),
  // basis: iron_wedge (0.8 kg, 6 copper, quest-only)
  tool({
    id: 'wedge', name: 'Wedge', material: 'iron', weight: 0.8, size: 'XS', price: 6,
    capabilities: [],
    description: 'A tapered iron block driven into timber to split logs along the grain.',
    origin: 'new',
  }),
  // Numbers from goods.ts chisel basis note: whetstone (0.3 kg, 3 copper).
  tool({
    id: 'whetstone', name: 'Whetstone', material: 'mineral', weight: 0.3, size: 'XS', price: 3,
    capabilities: ['sharpen'],
    description: 'A flat abrasive stone for honing blades and keeping an edge keen.',
    origin: 'new',
  }),
  tool({
    id: 'wheelbarrow', name: 'Wheelbarrow', material: 'wood', weight: 14, size: 'XL', price: 40,
    durability: 300, capabilities: [], cart: { capacityKg: 80, speedMult: 0.8 },
    description: 'A single-wheeled barrow lets one worker move heavy loads along paths and yardways.',
    origin: 'v2', legacyIds: { v2: 'wheelbarrow' },
  }),
  // basis: bucket (1.2 kg, 12 copper), scaled to a small wooden vessel
  // 🟡 unsure: No v2 wooden cup entry; capacity and price are estimates for a small drinking vessel.
  tool({
    id: 'wooden_cup', name: 'Wooden Cup', material: 'wood', weight: 0.15, size: 'XS', price: 2,
    durability: 180, capabilities: [], waterCapacityL: 0.25,
    description: 'A small turned wooden cup for drinking water, ale, or broth at table or camp.',
    origin: 'new',
  }),
  // basis: shovel (2.2 kg, 30 copper), lighter wooden version
  tool({
    id: 'wooden_shovel', name: 'Wooden Shovel', material: 'wood', weight: 1.4, size: 'MD', price: 8,
    durability: 180, capabilities: ['dig'],
    description: 'A broad wooden blade moves loose earth, ash, and grain, but wears faster than iron.',
    origin: 'new',
  }),
]

export const FOOD: readonly FoodItem[] = [
  // v2 has no plain ale (its `small_beer` is quest-only); numbers follow `small_beer`, slightly lighter.
  food({
    id: 'ale', name: 'Ale', material: 'organic', weight: 1, size: 'SM', price: 6, nutrition: 4, waterPoints: 12, spoilH: 24 * 20,
    description: 'Thin brown ale brewed in the village. It quenches thirst better than it fills the belly.',
  }),
  food({
    id: 'apple', name: 'Apple', material: 'organic', weight: 0.2, size: 'SM', price: 2,
    nutrition: 8, waterPoints: 3, spoilH: 240,
    description: 'A crisp orchard fruit, carried for a quick bite on the road.',
    origin: 'v2', legacyIds: { v2: 'apple' },
  }),
  food({
    id: 'bread', name: 'Bread', material: 'organic', weight: 0.5, size: 'SM', price: 6, nutrition: 25, spoilH: 24 * 4,
    description: 'A round loaf of rye bread, dense and filling, baked in the village oven.',
    origin: 'v2', legacyIds: { v2: 'bread' },
  }),
  food({
    id: 'cabbage', name: 'Cabbage', material: 'organic', weight: 1, size: 'SM', price: 3,
    nutrition: 14, spoilH: 360,
    description: 'A firm head of leaves that keeps well in a cool cellar.',
    origin: 'v2', legacyIds: { v2: 'cabbage' },
  }),
  food({
    id: 'carrot', name: 'Carrot', material: 'organic', weight: 0.15, size: 'SM', price: 1, nutrition: 7, spoilH: 24 * 12,
    description: 'A bright orange root, sweet when raw and good for a quick bite on the road.',
    origin: 'v2', legacyIds: { v2: 'carrot' },
  }),
  // basis: dried_meat
  // 🟡 unsure: Copies v2 dried_meat values as the closest preserved-food basis; v2 has no dried_fish entry.
  food({
    id: 'dried_fish', name: 'Dried fish', material: 'organic', weight: 0.4, size: 'SM', price: 14,
    nutrition: 24, spoilH: 960,
    description: 'Fish cured by air and smoke for journeys when fresh catch would soon spoil.',
    origin: 'new',
  }),
  food({
    id: 'dried_meat', name: 'Dried meat', material: 'organic', weight: 0.4, size: 'SM', price: 14,
    nutrition: 24, spoilH: 960,
    description: 'Thin strips of meat dried for travel and storage through lean days.',
    origin: 'v2', legacyIds: { v2: 'dried_meat' },
  }),
  food({
    id: 'fish', name: 'Fish', material: 'organic', weight: 0.6, size: 'SM', price: 4,
    nutrition: 14, spoilH: 20, raw: true, illnessChance: 0.15,
    description: 'A fresh river catch that should be cooked or preserved soon after landing.',
    origin: 'v2', legacyIds: { v2: 'fish' },
  }),
  // basis: v2 cooked_fish (game/data/items.ts), output of grill_fish at a player campfire (crafting--001 F9). Freshness: dated batches, deadline set at cooking (D-ITM-38, M5 food batches).
  food({
    id: 'cooked_fish', name: 'Grilled fish', material: 'organic', weight: 0.5, size: 'SM', price: 8,
    nutrition: 30, spoilH: 48,
    description: 'A fish grilled over an open fire, firm and ready to eat.',
    origin: 'v2', legacyIds: { v2: 'cooked_fish' },
  }),
  // basis: v2 mushroom (game/data/items.ts). Gathered from the wild (crafting F8a); no eat effect lands here (PLAYER_EAT_ENABLED untouched,
  // sickness belongs to the illness slice). 🟡 values copied from v2.
  food({
    id: 'mushroom', name: 'Mushroom', material: 'organic', weight: 0.1, size: 'XS', price: 2,
    nutrition: 5, spoilH: 48, illnessChance: 0.05,
    description: 'A wild mushroom from the woodland floor, edible but not safe to eat without care.',
    origin: 'v2', legacyIds: { v2: 'mushroom' },
  }),
  // basis: grain
  // 🟡 unsure: Based on v2 grain; milling changes weight and value.
  food({
    id: 'flour', name: 'Flour', material: 'organic', weight: 1, size: 'SM', price: 4,
    nutrition: 18, spoilH: 96,
    description: 'Finely ground grain ready for dough, thickening broth or baking at home.',
    origin: 'new',
  }),
  food({
    id: 'milk', name: 'Milk', material: 'organic', weight: 1, size: 'SM', price: 3,
    nutrition: 8, waterPoints: 10, spoilH: 48,
    description: 'Fresh milk from the pail, nourishing but quick to sour without cool storage.',
    origin: 'v2', legacyIds: { v2: 'milk' },
  }),
]

export const HERBS: readonly HerbItem[] = [
  herb({
    id: 'chamomile', name: 'Chamomile', material: 'organic', weight: 0.05, size: 'XS', price: 3,
    nutrition: 1, spoilH: 144, heal: 6, poison: 0, cures: true, rarity: 'common',
    description: 'A mild flowering herb gathered for soothing infusions and simple remedies.',
    origin: 'v2', legacyIds: { v2: 'chamomile' },
  }),
  herb({
    id: 'mint', name: 'Mint', material: 'organic', weight: 0.05, size: 'XS', price: 2, heal: 4, cures: true, rarity: 'common', spoilH: 24 * 6, nutrition: 1,
    description: 'A common garden herb with a sharp scent. Brewed as a tea, it settles a sour stomach and clears the head.',
    origin: 'v2', legacyIds: { v2: 'mint' },
  }),
  herb({
    id: 'yarrow', name: 'Yarrow', material: 'organic', weight: 0.05, size: 'XS', price: 6,
    nutrition: 1, spoilH: 144, heal: 14, poison: 0, cures: false, rarity: 'medium',
    description: 'A bitter meadow herb gathered by healers for treating cuts and other common ailments.',
    origin: 'v2', legacyIds: { v2: 'yarrow' },
  }),
  herb({
    id: 'arnica', name: 'Arnica', material: 'organic', weight: 0.05, size: 'XS', price: 18,
    nutrition: 1, spoilH: 24 * 6, heal: 28, rarity: 'rare',
    description: 'A yellow flower of the high slopes, dried by healers for deep bruises and stubborn hurts.',
    origin: 'v2', legacyIds: { v2: 'arnica' },
  }),
  herb({
    id: 'hemlock', name: 'Hemlock', material: 'organic', weight: 0.05, size: 'XS', price: 4,
    nutrition: 1, spoilH: 24 * 6, heal: 0, poison: 25, rarity: 'medium',
    description: 'A tall spotted plant of wet ditches. The leaves resemble a pot herb, and a careless hand would pay for the error.',
    origin: 'v2', legacyIds: { v2: 'hemlock' },
  }),
  herb({
    id: 'nightshade', name: 'Nightshade', material: 'organic', weight: 0.05, size: 'XS', price: 10,
    nutrition: 1, spoilH: 24 * 6, heal: 0, poison: 45, rarity: 'rare',
    description: 'Glossy black berries from a shaded thicket. Those who know the plant leave them on the stem.',
    origin: 'v2', legacyIds: { v2: 'nightshade' },
  }),
]

export const MEDICAL: readonly MedicalItem[] = [
  medical({
    id: 'bandage', name: 'Bandage', material: 'cloth', weight: 0.1, size: 'XS', price: 6, heal: 15,
    description: 'A strip of clean linen for binding a wound and slowing the bleeding.',
    origin: 'v2', legacyIds: { v2: 'bandage' },
  }),
  medical({
    id: 'salve', name: 'Herbal salve', material: 'organic', weight: 0.2, size: 'XS', price: 20,
    heal: 35,
    description: 'A thick preparation of herbs and fat spread over wounds and irritated skin.',
    origin: 'v2', legacyIds: { v2: 'salve' },
  }),
]

export const RESOURCES: readonly ResourceItem[] = [
  // basis: log
  // 🟡 unsure: Derived from v2 log; sawn-board weight and price are provisional.
  resource({
    id: 'board', name: 'Board', material: 'wood', weight: 6, size: 'LG', price: 12,
    description: 'A sawn plank used for doors, roofs and sturdy household fittings.',
    origin: 'new',
  }),
  // basis: grain
  // 🟡 unsure: Based on v2 grain; milling yield and value are not defined.
  resource({
    id: 'bran', name: 'Bran', material: 'organic', weight: 0.3, size: 'SM', price: 1,
    description: 'The coarse husks left after grain is milled, kept for animal feed or rough porridge.',
    origin: 'new',
  }),
  resource({
    id: 'branch', name: 'Branch', material: 'wood', weight: 1.2, size: 'MD', price: 1,
    description: 'A fallen limb gathered for kindling, quick repairs or rough tools.',
    origin: 'v2', legacyIds: { v2: 'branch' },
  }),
  // basis: coal
  // 🟡 unsure: Based on v2 coal; charcoal is a wood-derived fuel and its value is provisional.
  resource({
    id: 'charcoal', name: 'Charcoal', material: 'wood', weight: 2, size: 'SM', price: 4,
    description: 'Blackened wood made in a covered kiln, prized for a hot and steady fire.',
    origin: 'new',
  }),
  resource({
    id: 'cloth', name: 'Cloth', material: 'cloth', weight: 0.5, size: 'SM', price: 8,
    description: 'Woven fabric sold by the length for garments, coverings and household mending.',
    origin: 'v2', legacyIds: { v2: 'cloth' },
  }),
  resource({
    id: 'coal', name: 'Coal', material: 'mineral', weight: 2, size: 'SM', price: 4,
    description: 'A lump of black fuel that burns hotter than ordinary firewood.',
    origin: 'v2', legacyIds: { v2: 'coal' },
  }),
  // basis: branch
  // 🟡 unsure: Based on v2 branch; bundle weight and price are estimates.
  resource({
    id: 'firewood', name: 'Firewood', material: 'wood', weight: 4, size: 'MD', price: 3,
    description: 'Split logs and dry sticks bundled for the hearth or cooking fire.',
    origin: 'new',
  }),
  resource({
    id: 'grain', name: 'Grain', material: 'organic', weight: 1, size: 'SM', price: 3,
    description: 'A measure of harvested kernels kept for milling or sowing when the season turns.',
    origin: 'v2', legacyIds: { v2: 'grain' },
  }),
  resource({
    id: 'hide', name: 'Hide', material: 'leather', weight: 3, size: 'MD', price: 15,
    description: 'A stripped animal hide prepared for tanning, coverings or sturdy leather goods.',
    origin: 'v2', legacyIds: { v2: 'hide' },
  }),
  resource({
    id: 'iron_ingot', name: 'Iron ingot', material: 'iron', weight: 2, size: 'SM', price: 30,
    description: 'A smelted bar of iron ready for a smith to shape into useful goods.',
    origin: 'v2', legacyIds: { v2: 'iron_ingot' },
  }),
  resource({
    id: 'iron_ore', name: 'Iron ore', material: 'mineral', weight: 3, size: 'SM', price: 8,
    description: 'Rough ore dug from the earth and carried to a furnace for smelting.',
    origin: 'v2', legacyIds: { v2: 'iron_ore' },
  }),
  resource({
    id: 'log', name: 'Log', material: 'organic', weight: 18, size: 'LG', price: 12,
    description: 'A felled trunk of oak or ash, too heavy to carry far. Split it for firewood or planks.',
    origin: 'v2', legacyIds: { v2: 'log' },
  }),
  // basis: iron_ingot
  // 🟡 unsure: Based on v2 iron_ingot; individual nail weight and price are provisional.
  resource({
    id: 'nail', name: 'Nail', material: 'iron', weight: 0.02, size: 'XXS', price: 1,
    description: 'A hand-forged iron spike used to fasten boards and join timber.',
    origin: 'new',
  }),
  resource({
    id: 'resin', name: 'Resin', material: 'organic', weight: 0.2, size: 'XS', price: 5,
    description: 'Sticky tree resin gathered for sealing joints, mending vessels and making pitch.',
    origin: 'v2', legacyIds: { v2: 'resin' },
  }),
  resource({
    id: 'rope', name: 'Rope', material: 'organic', weight: 1.5, size: 'MD', price: 10,
    description: 'Twenty ells of tarred hemp rope. It hoists, lashes and binds almost anything.',
    origin: 'v2', legacyIds: { v2: 'rope' },
  }),
  resource({
    id: 'salt', name: 'Salt', material: 'mineral', weight: 0.3, size: 'XS', price: 4,
    description: 'White crystals used to season meals and preserve meat or fish for storage.',
    origin: 'v2', legacyIds: { v2: 'salt' },
  }),
  // basis: grain
  // 🟡 unsure: Based on v2 grain; seed selection has no separate v2 price.
  resource({
    id: 'seed_grain', name: 'Seed grain', material: 'organic', weight: 1, size: 'SM', price: 4,
    description: 'Carefully kept kernels reserved for sowing rather than grinding into meal.',
    origin: 'new',
  }),
  resource({
    id: 'stone', name: 'Stone', material: 'mineral', weight: 3, size: 'SM', price: 1,
    description: 'A solid piece of quarried or gathered rock for walls, hearths and foundations.',
    origin: 'v2', legacyIds: { v2: 'stone' },
  }),
  resource({
    id: 'tar', name: 'Tar', material: 'organic', weight: 0.4, size: 'SM', price: 9,
    description: 'A dark, sticky distillate used to seal timber, rope and the seams of boats.',
    origin: 'v2', legacyIds: { v2: 'tar' },
  }),
  // basis: branch
  // 🟡 unsure: Based on v2 branch; peg dimensions and price are provisional.
  resource({
    id: 'wooden_peg', name: 'Wooden peg', material: 'wood', weight: 0.05, size: 'XXS', price: 1,
    description: 'A small shaped peg driven into timber joints where iron nails are unnecessary.',
    origin: 'new',
  }),
  resource({
    id: 'wool', name: 'Wool', material: 'cloth', weight: 1, size: 'SM', price: 6,
    description: 'A fleece shorn from sheep and kept for spinning into yarn or felt.',
    origin: 'v2', legacyIds: { v2: 'wool' },
  }),
]

export const BOOKS: readonly BookItem[] = [
  book({
    id: 'primer_construction', name: 'Builder\'s Primer', material: 'paper', weight: 0.6, size: 'XS', price: 30,
    skill: 'construction', min: 0, cap: 20, gain: 5,
    description: 'A practical primer on raising walls, setting frames and keeping a roof sound.',
    origin: 'v2', legacyIds: { v2: 'primer_construction' },
  }),
  book({
    id: 'primer_medicine', name: 'Primer of Healing', material: 'paper', weight: 0.6, size: 'XS', price: 30,
    skill: 'medicine', min: 0, cap: 20, gain: 5,
    description: 'A short guide to common wounds, useful herbs and the care of the sick.',
    origin: 'v2', legacyIds: { v2: 'primer_medicine' },
  }),
  book({
    id: 'primer_survival', name: 'Primer of the Wilds', material: 'paper', weight: 0.6, size: 'XS', price: 30,
    skill: 'survival', min: 0, cap: 20, gain: 5,
    description: 'A well-thumbed primer on foraging, camping and fishing. Reading it teaches the basics of surviving outdoors.',
    origin: 'v2', legacyIds: { v2: 'primer_survival' },
  }),
]

// v2 has no inn key; numbers follow its quest objects (`miles_mark`: weight 0.05, price 0, quest-only).
export const MISC: readonly MiscItem[] = [
  misc({
    id: 'blanket', name: 'Blanket', material: 'cloth', weight: 1.5, size: 'MD', price: 12,
    description: 'A thick woollen covering carried on journeys or spread over a cold bed.',
    origin: 'v2', legacyIds: { v2: 'blanket' },
  }),
  misc({
    id: 'inn_key', name: 'Inn key', material: 'iron', weight: 0.05, size: 'XXS', price: 0, availability: 'quest-only',
    description: 'A heavy iron key to a room at the inn, with the innkeeper\'s tag still on the ring.',
  }),
  // basis: account_book
  // 🟡 unsure: No ledger entry exists in v2; account_book is quest-only and worth zero, so this ordinary ledger's price is provisional.
  misc({
    id: 'ledger', name: 'Ledger', material: 'paper', weight: 0.4, size: 'XS', price: 15,
    availability: 'active',
    description: 'A merchant\'s bound book for recording debts, payments and goods exchanged.',
    origin: 'new',
  }),
]

export const GOODS: readonly (MiscItem | BookItem | FoodItem | HerbItem | MedicalItem | ResourceItem | ToolItem)[] = [
  ...TOOLS, ...FOOD, ...HERBS, ...MEDICAL, ...RESOURCES, ...BOOKS, ...MISC,
]

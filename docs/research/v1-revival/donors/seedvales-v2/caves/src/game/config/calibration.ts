/**
 * Calibration constants — single place to tune time, space and needs.
 * Units are explicit in names: `_M` metres, `_S` gameplay seconds, `_H` calendar hours, `_MPS` m/s.
 * @domain config
 */

/** Real (gameplay) seconds per one calendar day at normal speed. */
export const REAL_SECONDS_PER_DAY = 3600
/** Calendar runs this many times faster than gameplay seconds. */
export const CALENDAR_SPEED = 86400 / REAL_SECONDS_PER_DAY // 24
export const DAYS_PER_MONTH = 5
export const MONTHS_PER_YEAR = 12
export const DAYS_PER_YEAR = DAYS_PER_MONTH * MONTHS_PER_YEAR // 60 (vision typo 70 corrected)
export const DAYS_PER_SEASON = DAYS_PER_YEAR / 4 // 15
/** New game starts on day 3 of spring at 07:00. */
export const START_CALENDAR_S = 2 * 86400 + 7 * 3600

export const WALK_SPEED_MPS = 1.5
/** The player's normal pace (a brisk walk: the walk clip played faster): faster than the villagers' walk so crossing the world does not feel slow (playtest--001 D1a). */
export const PLAYER_PACE_MPS = 2.75
/** The player's normal pace plays the walk clip faster by this factor (the clip is authored for the villagers' 1.5 m/s walk). */
export const PLAYER_WALK_ANIM_SCALE = PLAYER_PACE_MPS / WALK_SPEED_MPS
export const RUN_SPEED_MPS = 4.0
/** The player's run (+25% on the old 4.0, playtest 2026-10-08); villagers and companions keep RUN_SPEED_MPS. */
export const PLAYER_RUN_SPEED_MPS = 5.0
/** Running stops at this stamina and resumes only once it has recovered to RUN_RESUME_STAMINA (hysteresis: no run/walk flicker at the limit). */
export const RUN_MIN_STAMINA = 5
export const RUN_RESUME_STAMINA = 50
export const SNEAK_SPEED_MPS = 0.9
/**
 * The player's (and villagers') swimming pace (playtest 2026-10-07: 0.8 m/s felt like crawling along the bottom). 1.3 m/s is
 * a steady breaststroke: a 20 m wide river in ~15 s, a 50 m lake arm in ~40 s on one stamina bar (STAMINA.swimPerS).
 * Wading (depth WADE_SLOW_DEPTH_M..SWIM_DEPTH_M) is the walk pace x WADE_SPEED_MUL (~1.5 m/s), so swimming is a little slower than wading.
 */
export const SWIM_SPEED_MPS = 1.3
export const ROAD_SPEED_BONUS = 1.1
/**
 * Worlds up to generator v17: home → nearest settlement route target = one villager day's march (16 h = 40 real min × 1.5 m/s).
 * Kept only so existing worlds regenerate identically (D-SAVE-9); new worlds use DAY_MARCH_M.
 */
export const DAY_MARCH_M_GEN17 = 16 * (REAL_SECONDS_PER_DAY / 24) * WALK_SPEED_MPS // 3600
/**
 * Home → nearest settlement route target for new worlds (generator v18+, D-WORLD-12, user 2026-10-07: "an hour of holding Up is
 * too long"): half the old day's march, ~1800 m ≈ 13.6 real min at the player's pace (PLAYER_PACE_MPS), ~20 min at the villagers' walk.
 * The vision's "nearest neighbour ≈ one day's march" is kept as a feel, not as a metric distance.
 */
export const DAY_MARCH_M = DAY_MARCH_M_GEN17 / 2 // 1800
/** Route target the generator of a given version used (the world layout depends on it). */
export const dayMarchM = (genVersion: number): number => (genVersion <= 17 ? DAY_MARCH_M_GEN17 : DAY_MARCH_M)

/** Water depth thresholds. */
/** Generator design ceiling for wading: fords stay <= BANK.fordDepthM <= this, beach shelves reach it ~5 m out (not used by movement: the wading slowdown is WADE_SLOW_DEPTH_M / WADE_SPEED_MUL). */
export const WADE_DEPTH_M = 0.5
export const SWIM_DEPTH_M = 1.2
/** Walking through water deeper than this (but not swimming) slows the walk by WADE_SPEED_MUL. */
export const WADE_SLOW_DEPTH_M = 0.3
export const WADE_SPEED_MUL = 0.7

/**
 * Swimmers float (D-MOVE-2, 2026-10-07): in water deeper than SWIM_DEPTH_M an actor's origin sits this far below the
 * surface instead of on the bed (never below the bed). The Swim_Fwd/Swim_Idle clips are authored around the root
 * (pelvis 0.08 / 0.33 m below it), so a human root just under the surface keeps the head and back at the water line.
 * Animals (Walk clip) sink by their height x animalFloatK: a dog's back stays at the surface, a horse wades until it floats.
 */
export const SWIM = {
  humanFloatM: 0.1,
  animalFloatK: 0.85,
} as const

/**
 * River/lake bank profile (render--008 step 4, GEN 15). Shapes the world: changing a value after release needs a
 * GEN_VERSION bump. Lengths in metres, slopes are rise/run.
 */
export const BANK = {
  /** Distance from the shoreline where the profile has fully faded back to the coarse grid height. */
  landM: 26,
  /** Beach: width of the sand shelf before it fades (cut banks fade from 2 m). */
  beachWidthM: 4.5,
  /** Beach land slope above the surface. */
  beachSlope: 0.05,
  /** Cut bank: horizontal length of the vertical-ish face. */
  cutFaceM: 1.5,
  /** Cut bank height above the surface for the shallowest / deepest channel. */
  cutMinM: 0.3,
  cutMaxM: 0.5,
  /** Underwater slope (depth per metre out) of a beach / of a cut bank. */
  uwBeachSlope: 0.08,
  uwCutSlope: 0.6,
  /** Band beyond landM in which the detail noise fades back in. */
  quietM: 2,
  /** Minimum land freeboard above the water surface. */
  freeboardM: 0.05,
  /** Ford channel depth ceiling (<= WADE_DEPTH_M) and the zone length around a crossing. */
  fordDepthM: 0.4,
  fordZoneM: 12,
  /** Bridge abutment zone around the crossing axis. */
  bridgeZoneM: 6,
  /** Bend curvature (cross of unit flow vectors) from which the outside is cut and the inside beach. */
  curvMin: 0.25,
  /** Cells walked up/down the river to measure curvature. */
  curvSteps: 4,
  /** A beach needs land no higher than this above the surface within 2 cells, else it becomes a cut. */
  beachReliefM: 2.5,
  /** Grid land next to inland water is raised to at least surface + this. */
  bankRaiseM: 0.3,
  /** Narrow streams (nominal width <= 6) never exceed this depth (wadeable); widened rivers are at least wideMinDepthM deep in the middle. */
  narrowMaxDepthM: 1.1,
  wideMinDepthM: 1.3,
} as const

/**
 * Needs are 0..100 where 100 = fully satisfied. Drain per calendar hour.
 * Calibrated so that a full day (24 h) = 60 real minutes needs ~2 meals and ~3 drinks.
 */
export const NEEDS = {
  thirstDrainPerH: 100 / 20, // empty after 20 h
  hungerDrainPerH: 100 / 30, // empty after 30 h (hunger is weaker than thirst)
  /** Vigor: lasts ~19 h of marching (vision §9.2: 18–20 h). */
  vigorDrainWalkPerH: 100 / 19,
  vigorDrainIdlePerH: 100 / 40,
  vigorDrainWorkPerH: 100 / 16,
  /** Recovery per calendar hour of sleep at comfort 1.0 (8 h to full). */
  vigorSleepPerH: 100 / 8,
  vigorRestPerH: 100 / 30,
  socialDrainPerH: 100 / 36,
  /** Penalties begin below this level. */
  penaltyBelow: 25,
  /** Hours of activity allowed at 0 vigor before collapse (vision: ~24 h). */
  exhaustionMaxH: 24,
}

export const STAMINA = {
  max: 100,
  regenPerS: 12,
  sprintPerS: 10,
  /** Swimming at SWIM_SPEED_MPS: one full bar lasts 40 s (~52 m), then the swimmer starts drowning (was 4/s at 0.8 m/s = 20 m). */
  swimPerS: 2.5,
  meleeSwing: 12,
  bowDrawPerS: 8,
}

/** Player ranged aim assist (skill over reflexes): cone half-angle (deg) = base + skill share of coneSkill, correction share = strengthBase..1 with skill, lead share of target motion at skill 100, residual spread (rad) at spreadRefM. */
export const RANGED_AIM = {
  maxRangeM: 80,
  coneBaseDeg: 8,
  coneSkillDeg: 17,
  strengthBase: 0.5,
  leadMax: 0.9,
  spreadRad: 0.03,
  spreadRefM: 40,
}

/** Combat target lock (combat--001, D-COMBAT-1): transient, assist-only; free camera stays the default. */
export const COMBAT_LOCK = {
  /** Candidates within this distance (m) of the player. */
  rangeM: 25,
  /** A lock is dropped beyond this distance (hysteresis over rangeM). */
  dropRangeM: 32,
  /** Seconds an undetected target stays locked (corner flicker) before the lock is dropped as lost. */
  lostGraceS: 1.5,
  /** Cycling prefers targets inside this camera cone (full angle, degrees); others rank after. */
  coneDeg: 150,
  /** The lock survives the target being off-screen (angle from the camera yaw, degrees) for this long (s) before dropping. */
  lookAwayDeg: 120,
  lookAwayGraceS: 5,
  /** Camera yaw assist: max rate (rad/s) and the pause after manual look input (s). */
  cameraRateRadS: 1.4,
  cameraGraceS: 0.9,
  /** Unlocked melee: the swing turns the player toward the best target by at most this much (degrees). */
  softAssistDeg: 15,
  /** Score penalties by class (lower score ranks first). */
  classPenalty: { threat: 0, dangerous: 10, neutral: 25 },
} as const

/** Stack identity of condition-bearing items (items--001 / economy--004, D-ITEM-1): stacks merge only within these tolerances and are never averaged. */
export const ITEM_BATCH = {
  /** Food whose remaining freshness differs by more than this (hours) stays in a separate batch; a merged batch keeps the older value (never extends shelf life; 12 h ≈ half a day of production, 4 h made the caravan worst-case test lose a trade because spoilage is no longer refreshed by averaging). */
  freshTolH: 12,
  /** Durability values within this (points) merge; the merged stack keeps the lower value. */
  durTol: 0.5,
} as const

/** Fishing with a rod (RES-06): gameplay seconds per cast, catch chance = base + survival × perSkill (capped), minimum water depth (m), rod wear per cast. */
export const FISHING = { castS: 18, baseChance: 0.35, perSkill: 0.004, maxChance: 0.85, minDepth: 0.6, wear: 1 } as const

/** Skill training per craft (C-06): ceiling = base + per-second × recipe time (+ minSkill); above it the amount drops. */
export const CRAFT_TRAIN = { amount: 2, aboveCeiling: 0.4, baseCeiling: 20, ceilingPerS: 2.5 } as const

/** Skill books (SKILL-02): gameplay seconds of one reading (kept short, 5-10 s). */
export const BOOKS = { readTimeS: 8 } as const

/** Weapon edge (combat--005, D-COMBAT-4): dulling by use, sharpening with a whetstone. */
export const EDGE = {
  /** Largest damage loss of a fully dull blade (fraction): cut hurts most, pierce less, blunt none. */
  cutPenalty: 0.4,
  piercePenalty: 0.15,
  /** Edge lost per hit that connects. */
  dullPerHit: { cut: 0.012, pierce: 0.007 },
  /** A blade never gets duller than this (still usable). */
  floor: 0.05,
  /** One sharpening restores this share of the weapon's maximum edge (and takes `sharpenTimeS` of gameplay time). */
  sharpenGain: 0.5,
  sharpenTimeS: 6,
} as const

/** Walkability: the steepest uphill rise/run a step may have (~50°); steeper faces are inaccessible (peaks). Downhill is not limited. */
export const TRAVERSE = { maxUphillRise: 1.2 } as const

/** Jump (combat--004, D-MOVE-1): small grounded traversal jump, gameplay seconds. */
export const JUMP = {
  /** Take-off speed (m/s) and gravity (m/s²): apex ≈ 0.66 m, air time ≈ 0.73 s. */
  vy: 3.6,
  gravity: 9.8,
  staminaCost: 8,
  /** While airborne a rise is only passable when the feet are within this much of the destination terrain (m). */
  lipClearM: 0.05,
  /** A short lip is jumpable only when the terrain this far (m) beyond it is not a sustained face (gradient above TRAVERSE.maxUphillRise). */
  probeM: 2,
} as const

/** Combat dodge (combat--003, D-COMBAT-3): real, collision-aware displacement, no i-frames. */
export const DODGE = {
  distanceM: 1.5,
  durationS: 0.22,
  staminaCost: 18,
  /** No new dodge for this long after a dodge started (s). */
  recoveryS: 0.55,
  /** Right after a swing the player is committed this long (s) and cannot dodge. */
  strikeCommitS: 0.25,
  /** Dodge is refused in water deeper than this (m). */
  maxWaterM: 0.3,
} as const

/** Block and parry (combat--002, D-COMBAT-2): all tuning in one place. */
export const DEFENCE = {
  /** Defence by equipment class: front arc (full angle, degrees), share of raw damage a block removes, stamina efficiency (lower = cheaper), parry window (s from guard start). */
  shield: { arcDeg: 140, reduction: 0.8, efficiency: 0.6, parryWindowS: 0.25, canParry: true },
  oneHanded: { arcDeg: 100, reduction: 0.5, efficiency: 1, parryWindowS: 0.2, canParry: true },
  twoHanded: { arcDeg: 80, reduction: 0.55, efficiency: 1.3, parryWindowS: 0.15, canParry: true },
  unarmed: { arcDeg: 70, reduction: 0.25, efficiency: 1.6, parryWindowS: 0.1, canParry: false },
  /** Defender stamina per point of incoming raw damage (× efficiency); a parry costs `parryCostMul` of that. */
  staminaPerDamage: 1.2,
  parryCostMul: 0.6,
  /** Guard stays down this long after the stamina ran out (s). */
  guardBreakS: 2,
  /** A parried attacker cannot swing again for this long (s, added to `attackReadyAt`). */
  parryAttackerDelayS: 0.9,
  /** Durability lost by the blocking item per defended hit. */
  wearPerBlock: 1,
  /** Heavy animals: their attacks can be blocked but never parried by ordinary weapons (a shield may still parry a boar, never a bear/moose). */
  heavyAnimals: ['bear', 'boar', 'moose', 'stag', 'horse', 'cow'] as readonly string[],
  shieldParriesHeavy: ['boar', 'stag', 'cow', 'horse'] as readonly string[],
} as const

export const COMBAT = {
  /** Player knock-out: stand up after, protected (ignored by enemies) for. Gameplay seconds. */
  koStandUpS: 3,
  koProtectionS: 120,
  /** Player-owned animal at 0 HP: collapsed time and the immunity window that follows (s). */
  ownedFallS: 20,
  ownedProtectS: 90,
  /** NPCs survive down to this HP (vision §28). */
  npcDeathHp: -20,
  hpRegenPerH: 4,
  bandageHeal: 15,
}

/** Settlement treasury at world start (copper) — the only initial money besides NPC/player purses (D-ECON-1). */
export const TREASURY_START = { SM: 150, MD: 300, LG: 600 } as const

/**
 * Blacksmith orders (CRAFT-02, review 013 M-09): price = max(resale floor, replacement value of the reserved inputs +
 * labour), labour = craft time (s) × labourPerS. The smith never sells below what the materials cost; the resale floor
 * (an exceptional-quality result at the best price any NPC would pay) keeps order → sell loops from paying (D-ECON-5).
 */
export const ORDER = { labourPerS: 0.5 }

/** Daily settlement tax on NPC purses above `exempt` copper (money recirculates to the treasury). */
export const TAX = { rate: 0.03, exempt: 20 }

/** Caravan: fee the home settlement's treasury pays its trader per trip (base + per unit moved). */
export const CARAVAN_FEE = { base: 5, perUnit: 1, maxUnits: 12 }

/**
 * Goods trade between settlements (TRADE-03): at departure the trader buys tools the home smith holds above `keepTools`
 * (at `buyShare` of the price, from the trader's purse); the destination warehouse takes them up to `warehouseWants` of
 * each tool and its treasury pays `sellShare` of the price. Margin = sellShare - buyShare, paid by the destination.
 */
/** Tools a smith keeps in stock without an order (also what caravans carry between settlements). */
export const SMITH_TOOL_IDS = ['knife', 'axe', 'shovel', 'hammer', 'pickaxe']

/**
 * Warehouse-to-warehouse goods a caravan carries (TRADE-03): a surplus above `keep` moves up to `max` per trip in both
 * directions (ledger moves only, nothing is created). Ore, coal and cloth are the scarce ones, so they keep less.
 */
export const CARAVAN_WAREHOUSE_GOODS: readonly { id: string; keep: number; max: number; balance?: boolean }[] = [
  ...['log', 'stone', 'iron_ingot', 'grain', 'bread', 'wool', 'hide', 'dried_meat'].map((id) => ({ id, keep: 10, max: 6 })),
  // `balance`: only from the fuller warehouse to the emptier one, at most half the difference (no ping-pong).
  ...['iron_ore', 'coal', 'cloth'].map((id) => ({ id, keep: 4, max: 4, balance: true })),
]

/**
 * Caravan trader tiers (TRADE-03b, decided by a Sonnet default): a trader's tier follows the animals its household
 * actually owns (adult, alive, not bought by the player). Capacity multiplier on every per-trip amount.
 * On foot is the poor tier, a donkey with packs the middle one, a horse the best one (the escort guard is later).
 */
export const CARAVAN_TIERS = { foot: 1, donkey: 2, horse: 3 } as const
export type CaravanTier = keyof typeof CARAVAN_TIERS
/** Walking speed of a trader on a trip by tier (TRADE-03b): a donkey keeps pace, a horse lets the trader ride on. */
export const CARAVAN_TIER_SPEED = { foot: 1, donkey: 1, horse: 1.2 } as const satisfies Record<CaravanTier, number>

export const CARAVAN_GOODS = { keepTools: 3, maxPerTrip: 3, buyShare: 0.6, sellShare: 0.8, warehouseWants: 2, wearEveryDays: 2, upkeepKeep: 1, upkeepReserve: 260 }

/**
 * Smith raw-material supply (economy--002 step 0, D-ECON-9): no NPC mines, so a carter from the settlement's ore claim
 * tops the smith's store up to `ore`/`coal` once a day (ledger source `ore_delivery`). The smith pays the treasury
 * `priceShare` of the list price — the same treasury that buys the smith's tools, so money circulates and nothing is minted.
 */
export const ORE_SUPPLY = { ore: 6, coal: 4, priceShare: 0.5 }

/**
 * Working tools wear out (D-ECON-9): every `everyDays` (staggered by NPC id) a worker's profession tool is worn out
 * (ledger sink `tool_wear`) and replaced by one bought from the home smith at `priceShare` of the list price — demand
 * that follows the work itself. Only when the smith has one in stock and the worker can pay; otherwise the old tool is kept.
 */
export const TOOL_WEAR = { everyDays: 10, priceShare: 0.4, tool: { farmer: 'shovel', woodcutter: 'axe', hunter: 'knife', herbalist: 'knife', shepherd: 'knife' } as Partial<Record<string, string>> }

/**
 * Caravan provisions in nutrition points (a bread is 25, a hunger bar is 100; a trader loses ~55 a day): packed at departure
 * (household store, home warehouse, then bought from a household; moved, not created, D-NPC-6) — enough for the outbound leg.
 * The return leg is stocked at the destination to `CARAVAN_RETURN_NUTRITION`. A caravan only departs when `CARAVAN_MIN_NUTRITION` can be had.
 */
export const CARAVAN_PROVISIONS = 200
export const CARAVAN_RETURN_NUTRITION = 100
export const CARAVAN_MIN_NUTRITION = 100

/**
 * Household baking (review 015 row 1d): farmers' grain is not edible; a household member turns it into bread at home
 * (recipe `bread`: `grainPerBread` grain -> 1 bread), `durS` gameplay seconds per loaf.
 */
export const BAKE = { grainPerBread: 3, durS: 12 }

/** Days for a sheep's wool to regrow after shearing. */
export const WOOL_REGROW_DAYS = 10

/**
 * AI decision cadence (AI-01): perception/decisions every `baseS` gameplay seconds × species
 * `decisionS` × state (tired ×tiredMul). Critical events (hits, shots, calls for help) force an
 * immediate decision for actors within the alert radius (m).
 */
export const DECISION = { baseS: 1, tiredMul: 1.5, alertHitM: 30, alertShotM: 30, alertHelpM: 60 }

/**
 * Wild animals' fear (FAUNA-07), distances in m; exceptions: young nearby, own den, starving predator.
 * Prey/vermin bolt when a person is within preyDetectFrac x perception, for preyFleeS s, and stop once preySafeM from the threat
 * (playtest: they fled too fast and too far, so game was almost never seen).
 */
export const FEAR = { humanM: 16, aggressiveAttackM: 6, fireM: 14, penM: 10, desperateHungerH: 40, protectYoungM: 25, protectDenM: 30, preyDefendM: 6, suppressS: 45, preyDetectFrac: 0.6, preyFleeS: 6, preySafeM: 35 }

/**
 * Roasting (FOOD-03): calendar minutes per batch, pieces at once (bare fire 1 / pan or pot / spit), spit must
 * stand within spitM of the fire; cooked freshness keeps at least minFreshFrac of its shelf life.
 */
export const ROAST = { calMin: 30, vesselSlots: 2, spitSlots: 5, spitM: 3, minFreshFrac: 0.2 }

/** A spit lashed within rangeM of a stone hearth takes mul of the normal build time and matMul of the materials (FIRE-02, D-FIRE-3). */
export const HEARTH_SPIT = { mul: 0.5, matMul: 0.5, rangeM: 3 }

/** Open (non-hearth) campfires burn their fuel faster in rain / storm (D-FIRE-3); a hearth is sheltered. */
export const OPEN_FIRE_WEATHER_MUL = { rain: 1.5, storm: 2 } as const

/** Food below this share of its shelf life is spoiled (extra illness chance when eaten). */
export const SPOILED_FRAC = 0.15

/**
 * Warehouse goodwill (D-ECON-4): helpfulness = value / `coinsPerPoint` per deposit (only from `minValue`
 * coins, at most `maxPerDeposit`); taking goods out costs the same rate without the cap or threshold,
 * so depositing and taking back never gains anything.
 */
export const WAREHOUSE = { coinsPerPoint: 20, minValue: 10, maxPerDeposit: 3 }

/** Fog of war (MAP-01): map cell size (m) and how far around the player the map gets revealed (m). */
export const FOG = { cellM: 64, revealM: 180 }

/**
 * Caves (WORLD-05). All metres. `cell` is the cave grid resolution; `block` the terrain-hole granularity
 * (= the LOD-0 terrain quad). Tunnel/chamber heights leave room for the third-person camera (target +1.6 m).
 */
export const CAVE = {
  cell: 1,
  block: 2,
  tunnelRadius: 2,
  chamberRadius: [5, 7] as const,
  tunnelHeight: 3.8,
  chamberHeight: 5.6,
  /** Rock that must stay above a roofed cell; shallower cells are open to the sky (the entrance cutting). */
  minCover: 1.2,
  /** Floor descent per metre of tunnel while it is still below the first {@link maxDepth} metres. */
  rampSlope: 0.24,
  maxDepth: 7,
  /** Safety margin: the generator assumes the surface is this much lower than the grid says (micro-detail). */
  surfaceMargin: 0.8,
  /** Longest cutting (tunnel length that may still be open to the sky). */
  maxCuttingM: 26,
  /** Steepest floor step (m) the player may climb between neighbouring cells; also the mouth tolerance. */
  stepM: 0.8,
  /** Render streaming distance (m). */
  showM: 260,
} as const

/** Carts (TRANS-01): steepest rise per metre a pushed cart can climb, deepest water (m) it can cross. */
export const CART = { maxRise: 0.32, maxWaterM: 0.25 }

/** Rocks (RES-07): boulders (scale ≥ boulderScale) break into chunks; a chunk breaks into `chunkStones` stones. */
export const ROCK = { boulderScale: 2, chunkStones: 4, strikeS: 6, breakS: 4 }

/** Eating carrion takes time (FAUNA-08): gameplay seconds per portion of meat, hunger hours satisfied per portion. */
export const CARRION = { eatS: 25, hungerPerMeat: 15, lureEatS: 6 }

/**
 * Blood traces (TRACE-01): intensity 0..1 per hit (dmg / dmgFull), merged within mergeM, decaying per
 * calendar hour (×rainMul in rain/storm), at most `max` kept; predators smell them within smellM × intensity.
 */
export const TRACE = { dmgFull: 20, mergeM: 1.5, decayPerH: 0.05, rainMul: 4, max: 300, smellM: 70 }

/**
 * Fires and torches (FIRE-01..03, plan survival--001). All durations are calendar hours (world-calendar domain):
 * at 24x a branch burns ~1.7 real minutes. fuelCapH = most fuel a fire holds; levelFullH = fuel at which the flame is at
 * full size (fireLevel 1), levelMin = flame size of a nearly spent fire; ash fades like blood but slower (x ashRainMul in rain).
 * tendBelowH = guard feeds the settlement hearth below this; fallbackBelowH = any NPC steps in below this.
 */
export const FIRE = {
  fuelCapH: 24,
  branchH: 0.7,
  logH: 2.5,
  starterBranches: 3,
  hearthStones: 4,
  levelFullH: 6,
  levelMin: 0.2,
  ashFadePerH: 1 / 12,
  ashRainMul: 3,
  tendBelowH: 6,
  fallbackBelowH: 2,
  settlementStartH: 12,
  tendHoldCalS: 3600,
  carryMax: 10,
}

/** Standing / thrown torch: calendar hours of burn time while lit. */
export const TORCH = { burnH: 5 }

/** Snares (survival--002): catch radius (m), largest body height (m) that fits, and the notice chance terms (see `noticeChance`). */
export const TRAP = { radius: 0.9, maxHeight: 0.5, baseNotice: 0.35, perceptionWeight: 0.5, skillWeight: 0.5, minNotice: 0.05, maxNotice: 0.9, nightMul: 0.7 }

/** FIRE-04: fuel that refuels a standing torch (calendar hours of burn per unit); resin and tar are crafted from branches / logs. */
export const TORCH_FUEL: Record<string, number> = { tar: 4, resin: 3, cloth: 2.5, wool: 1 }

/** Predator hunting: chase limit (gameplay s), give-up distance (× perception), retry cooldown (gameplay s). */
export const HUNT = {
  chaseMaxS: 40,
  giveUpPerception: 1.6,
  cooldownS: 90,
}

/** Time acceleration for sleep and long work (whole simulation). */
export const ACCEL = {
  sleep: 40,
  longWork: 20,
  roadAutopilot: 6,
  /** Autopilot over open ground (no road under the feet): slower than on a road. */
  offroadAutopilot: 4,
}

/** Area levelling (build--001 S4-2): hours of work per m³ moved, stone per m³ of net fill (matches the raise brush), feathered rim (m). */
export const LEVEL = {
  hoursPerM3: 0.25,
  stonePerM3: 0.7,
  rimM: 2,
  minSize: 4,
  maxSize: 12,
  /** Largest height change (m) of a plot against its centre height. */
  maxChangeM: 1.5,
  /** Largest height change (m) at any one point of a plot. */
  maxCellChangeM: 2.5,
}

/** Simulation LOD: update interval in gameplay seconds by distance to player. */
export const SIM_LOD = [
  { maxDist: 180, interval: 0.1 },
  { maxDist: 700, interval: 0.5 },
  { maxDist: Infinity, interval: 3 },
] as const

export const FOOD = {
  /** Container storage slows spoilage by this factor. */
  chestSpoilFactor: 0.5,
  corpseRotH: 6,
  /** Carrion (rotting, flies) lasts until this age (h); then only bones remain until `corpseBonesAfterH`. */
  corpseCarrionEndH: 30,
  corpseBonesAfterH: 48,
}

/**
 * Trade with any NPC (TRADE-02): what a household keeps for itself and never sells.
 * Food reserve per household member; work kit and the main weapon are always kept.
 */
/**
 * Trade (TRADE-02): food reserve kept per household member; an NPC farther than `homeReachM` from its house
 * trades only from/into its own pack; buy price multiplier bounds (sell prices stay below the lowest buy price).
 */
export const TRADE = { foodReservePerMember: 3, homeReachM: 150, minBuyMul: 0.95, plentyScarcity: 0.9 }

/**
 * Gifts (SOC-01): opinion gain = clamp(base + perLog·log2(1 + value/valueUnit)) × preference × personality,
 * divided by (1 + gifts already given today). Wanted item ×wantedMul, liked category ×likedMul.
 */
export const GIFT = { base: 1, perLog: 4, valueUnit: 5, maxGain: 25, wantedMul: 2, likedMul: 1.4 }

/**
 * Companions (COMP-01/02/03). Daily wage (copper) = base + skill·perSkill, × risk and task multipliers.
 * Travelling together within bondM raises opinion by bondPerH per calendar hour (up to bondCap).
 */
export const COMPANION = {
  wageBase: 6,
  wagePerSkill: 0.15,
  riskMul: { low: 1, medium: 1.6, high: 2.6 },
  taskMul: { escort: 1, guard: 1.3 },
  followM: 3.5,
  catchUpM: 12,
  bondM: 30,
  bondPerH: 0.5,
  bondCap: 60,
  killBond: 2,
  maxCompanions: 3,
  /** Provisions packed from the household store on hiring/joining (meals per day, cap; free companions: days). */
  foodPerDay: 2,
  maxProvisions: 8,
  freeProvisionDays: 2,
  /** Beyond this distance from home a companion lives from its pack (no walking home to eat). */
  awayM: 150,
  /** Away from home: water farther than this is not worth leaving the player for. */
  awayDrinkM: 60,
  /** Stuck while following: pause following (s), repeat the message at most this often (s). */
  stuckWaitS: 8,
  stuckMsgS: 60,
  /** Hunger below which a companion with an empty pack leaves for home. */
  starveLeave: 5,
}

/** Character variety (CHAR-01): body scale jitter (fractions), hair colours (multiplied onto the hair texture), cloth tints. */
export const CHARACTER_LOOK = {
  scaleXZ: 0.05,
  scaleY: 0.1,
  hair: [0xe6c27a, 0x7a5230, 0x262220, 0xb4512a, 0xb8b8b8] as const, // blond, brown, black, red, grey
  cloth: [0xffffff, 0xcfe6c0, 0xbfd2ee, 0xe8d3b0] as const, // neutral, green, blue, sand
}

/** Transport animals (transport--001 step 1): purchase prices in coins for an adult horse / donkey. */
export const TRANSPORT = { horsePrice: 130, donkeyPrice: 70 }

/** Follow/Stay for an owned transport animal: trail 3–5 m behind (run from runFromM), a critical need (thirst above drinkEveryH × criticalMul, hunger above hungerTripH) sends it on a trip first, Stay leash. */
export const FOLLOW = { minM: 3, maxM: 5, runFromM: 14, criticalMul: 1.5, hungerTripH: 14, grazeSteps: 3, tripM: 120, stayLeashM: 8 }

/** Dog rescue (animals--001): the medicine test to treat the wounded dog and how badly hurt it starts. */
export const DOG_RESCUE = { baseChance: 0.35, perSkill: 0.006, maxChance: 0.95, woundShare: 0.7, leashM: 2 }

/** Owned dog treasure sense (animals--001): detection radius (m), randomised rescan cooldown (s), Stay radius (m), dig time (s). */
export const DOG_SENSE = { detectM: 10, cooldownS: [60, 180] as const, stayRadiusM: 3, digS: 6, arriveM: 0.5 }

/** The player can order a search ("Search!"), so the dog's own initiative is rarer: its rescan cooldown is multiplied; the order has its own short retry delay (s, transient). */
export const DOG_SEARCH_ORDER = { autoCooldownMul: 2.5, retryS: 8 }

/** Owned dog foraging (animals--001): hunger (h) that sends it looking for food, near/far search radii (m, also the hare range), the mouse dig (s, chance, hunger it removes, cooldown, min distance between digs). */
export const DOG_FORAGE = { hungryH: 10, nearM: 10, farM: 25, digS: 5, mouseChance: 0.45, mouseHunger: 8, digCooldownS: 90, digSpreadM: 6, retryS: 5 }

/** Riding (transport--001 step 4): travel speeds in m/s (walk / run), reach for mounting, the deepest water a horse enters, horse stamina drained per second of running (at or below minStamina it walks for windedS seconds). */
/** A galloping horse must outrun the player even on a Fleetfoot tonic (run 5.0 m/s × 2 = 10): 13.75 m/s with a riding saddle, 11.7 bareback; the walk (4.25) beats the player's plain pace. */
export const MOUNT = { walkMps: 4.25, runMps: 13.75, reachM: 2.5, maxDepthM: 0.8, runDrain: 12, minStamina: 5, windedS: 6, /** Bareback riding: slower and more tiring than with a riding saddle (the saddle is the bonus). */ barebackSpeed: 0.85, barebackDrain: 1.3 }

/** Equipment maintenance (G-06): the smith repairs worn gear for a labour fee plus a material that leaves the world. */
export const REPAIR = {
  /** Only gear below this share of its durability is offered for repair (no busywork). */
  threshold: 0.7,
  /** Labour fee = item price × missing share × this. */
  labourShare: 0.25,
  /** One unit of material per this share of missing durability (rounded up). */
  missingPerUnit: 0.5,
  /** Armour made of these needs another material than the default hide. */
  materialOverride: { chainmail: 'iron_ingot', plate_cuirass: 'iron_ingot', iron_helm: 'iron_ingot', pauldrons: 'iron_ingot', padded_jacket: 'cloth', staff: 'branch', club: 'branch', short_bow: 'branch', long_bow: 'branch', composite_bow: 'branch' } as Record<string, string>,
} as const

/**
 * Field upkeep (D-FIELD-1): weeds and washed-out furrows wear a field down (`wearPerH` durability points per calendar hour, about
 * a month from 100 to 30). Growth is scaled by 1 - slowdown × (1 - durability/100); the farmer's tending adds `tendMend` points per
 * session, so worked fields stay tidy. The player mends one by hand in `weedS` seconds, with no tool or material.
 */
export const FIELD = { wearPerH: 0.05, slowdown: 0.5, tendMend: 1.5, weedS: 15 } as const

/**
 * Gratitude for mended property (D-SOCIAL-1): the player repairs a building that belongs to a household or the settlement.
 * Only a repair that restores at least `minRestored` points of a building worn below `maxBefore` counts, so a quick top-up of an
 * intact wall earns nothing; wear itself (0.1 per calendar hour) keeps the supply of grateful repairs bounded.
 */
export const THANKS = {
  minRestored: 15,
  maxBefore: 75,
  /** Opinion of each household member = base + restored × perPoint (capped). */
  opinionBase: 2,
  opinionPerPoint: 0.1,
  opinionMax: 6,
  /** Helpfulness reputation in the settlement for a household's / the settlement's building. */
  repHousehold: 1,
  repSettlement: 2,
  /** Chance that the first talk afterwards brings a small gift; otherwise only warm words. */
  rewardChance: 0.5,
  rewardCoins: [3, 8] as const,
  /** Food from the household's own store is preferred to coins. */
  rewardItems: ['bread', 'egg', 'apple', 'berries'] as const,
} as const

/**
 * MAP-02 player perception of NPCs and animals (D-MAP-2, Sonnet default). Range = base × Perception factor × light × weather × target size;
 * an actor beyond it, behind a wall or on another cave layer is unknown to the player, a lost contact lingers as a ghost.
 */
export const PERCEPTION = {
  baseRangeM: 75,
  /** Range factor = perBase + perStep × Perception attribute (5 → 1.0). */
  perBase: 0.75,
  perStep: 0.05,
  /** Fraction of the range left in full darkness (daylight 0). */
  nightFactor: 0.3,
  /** Fraction of the range underground (dim cave light, no weather); cave walls block sight. */
  caveFactor: 0.3,
  fogLoss: 0.5,
  precipLoss: 0.3,
  /** Smallest share of the range for tiny animals (rat); humans use 1 (children 0.9). */
  minSizeFactor: 0.35,
  /** Within this distance an actor is detected without line of sight (touch). */
  closeM: 4,
  /** A person is recognised by name within this share of the range, else shown as a stranger. */
  recogShare: 0.45,
  /** Seconds a lost contact stays at its last-known position. */
  lastKnownS: 45,
  /** Seconds between contact updates (render and overlays read the cache). */
  intervalS: 0.25,
  ghostOpacity: 0.5,
  /** Night light bonus (D-MAP-2 j): a target near a burning fire / holding a torch is seen as at this light level (daylight 1). */
  litLight: 0.7,
  fireLightM: 8,
  /** The player's own lit torch lights targets within this distance. */
  ownTorchM: 10,
  /** Player vigor below this shrinks the range by tiredFactor. */
  tiredVigor: 25,
  tiredFactor: 0.85,
} as const

/** Vermin (rats) bite back sometimes: per decision, when a person is this close. */
export const VERMIN = { biteChance: 0.25, biteRangeM: 3, biteS: 6 }

/**
 * Generated (deterministic) world foundation. Immutable after generation; cached per seed+version.
 * @domain world
 * @subdomain world-gen
 */

/** Generator version of new worlds. v18 (D-WORLD-12): settlements half as far apart as v17. */
export const GEN_VERSION = 18
/**
 * Generator versions this build can still generate (D-SAVE-9): an existing save regenerates its world with the version it was made
 * with, so older layouts stay reachable. Only the version-dependent parameters differ (`centres.ts` `centreParams`).
 */
export const GEN_VERSIONS = [17, 18] as const
export const WORLD_SIZE_M = 8192
export const CELL_M = 8
export const GRID_N = WORLD_SIZE_M / CELL_M + 1 // vertices per side
export const SEA_LEVEL = 0
export const CHUNK_M = 128

export const Biome = {
  Ocean: 0,
  Beach: 1,
  Meadow: 2,
  Steppe: 3,
  Swamp: 4,
  ForestDeciduous: 5,
  ForestMixed: 6,
  ForestConifer: 7,
  Mountain: 8,
  Snow: 9,
  Water: 10,
  /** WORLD-06a: dry sandy/stony scrub in the hottest, driest band (GEN 15, stage-2 batch). */
  Desert: 11,
} as const
export type BiomeId = (typeof Biome)[keyof typeof Biome]

/** Settlement sizes the generator produces (a bigger tier needs a generator + content contract first, review 013 M-07). */
export type SettlementSize = 'SM' | 'MD' | 'LG'

export type StructureKind =
  | 'house'
  | 'well'
  | 'campfire'
  | 'noticeboard'
  | 'warehouse'
  | 'market'
  | 'inn'
  | 'field'
  | 'pen'
  | 'anvil'
  | 'forge'
  | 'woodpile'
  | 'dryrack'
  | 'herbgarden'
  | 'torchpost'
  | 'trough'
  | 'palisade'
  | 'shed'
  | 'bridge'
  /** Roasting spit over a campfire (FOOD-03). */
  | 'spit'

export type ProfessionId =
  | 'farmer'
  | 'woodcutter'
  | 'hunter'
  | 'guard'
  | 'herbalist'
  | 'trader'
  | 'blacksmith'
  | 'shepherd'

export interface GenStructure {
  id: string
  kind: StructureKind
  x: number
  z: number
  /** Rotation around Y (radians). */
  rot: number
  /** Footprint half-sizes (m) for collision/flattening. */
  hw: number
  hd: number
  settlementId: number
  householdIdx?: number
}

export interface GenHousehold {
  idx: number
  profession: ProfessionId
  houseId: string
  members: number
}

export interface GenSettlement {
  id: number
  name: string
  size: SettlementSize
  x: number
  z: number
  y: number
  radius: number
  households: GenHousehold[]
}

export interface GenRoad {
  id: number
  from: number
  to: number
  points: { x: number; z: number }[]
  length: number
  crossings: { x: number; z: number; kind: 'ford' | 'bridge'; rot: number; span: number }[]
}

export type DenSpecies = 'wolf' | 'fox' | 'bear' | 'boar' | 'deer' | 'hare' | 'rat'

export interface GenDen {
  id: string
  species: DenSpecies
  x: number
  z: number
  /** Herd/pack size at start. */
  count: number
}

export type OreKind = 'coal' | 'iron' | 'copper' | 'gold'

export interface GenDeposit {
  id: string
  ore: OreKind
  x: number
  z: number
  radius: number
  /** 0..1 chance multiplier. */
  richness: number
}

export type LandmarkKind = 'stone_circle' | 'house_ruin' | 'estate_ruin' | 'shipwreck' | 'boat_wreck' | 'chapel_ruin' | 'watch_tower_ruin'

/** Static point of interest (WORLD-11); rendered from `landmarks.glb`, discovered through the map. */
export interface GenLandmark {
  id: string
  kind: LandmarkKind
  /** English proper name, e.g. "The Hollow Stones". */
  name: string
  x: number
  z: number
  /** Rotation around Y (radians). */
  rot: number
  /** Footprint radius (m): where the pieces lie and the discovery distance. */
  radius: number
}

export type GraveKind = 'plain' | 'tomb'

/** One grave of a cemetery (settlement--002): a plain headstone grave or a larger tomb with higher loot potential later. */
export interface GenGrave {
  id: string
  kind: GraveKind
  x: number
  z: number
  /** Rotation around Y (radians); the headstone faces the cemetery entrance. */
  rot: number
  /** Collider half-sizes (m) in the grave's own frame. */
  hw: number
  hd: number
  /** Family name on the stone (from the profession surname pool); no genealogy yet. */
  surname: string
}

/** Cemetery beside a settlement (D-CEM-1): static generated data, size by settlement class. */
export interface GenCemetery {
  id: string
  settlementId: number
  x: number
  z: number
  /** Rotation around Y; local +Z points at the entrance (towards the settlement). */
  rot: number
  /** Half-sizes of the plot in its own frame (m). */
  hw: number
  hd: number
  graves: GenGrave[]
}

export type CaveSize = 'small' | 'medium' | 'large'

/**
 * Cave (WORLD-05): a tunnel/chamber chain entered through a cutting in a mountain slope. Only this compact
 * descriptor is generated and cached; floor/ceiling grids are derived on demand (`world/caveShape.ts`).
 */
export interface GenCave {
  id: string
  /** English proper name, e.g. "Wolfmaw Cave". */
  name: string
  size: CaveSize
  /** Entrance (start of the spine) and the direction into the mountain (radians, atan2(dx, dz)). */
  x: number
  z: number
  yaw: number
  /** Floor height at the entrance (m); the floor descends from here along the spine. */
  y0: number
  /** Flat [x, z, radius, …] spine points ~6 m apart; a radius above the tunnel radius marks a chamber. */
  spine: number[]
}

export interface WorldData {
  version: number
  seed: number
  size: number
  cell: number
  n: number
  /** Terrain height after carving/flattening (m). */
  height: Float32Array
  /** Water surface height or -Infinity when dry. Ocean handled via SEA_LEVEL. */
  water: Float32Array
  /** 1 = river cell, 2 = lake cell. */
  waterKind: Uint8Array
  biome: Uint8Array
  /** 0..255 — how much micro-detail is suppressed (roads, settlements). */
  flat: Uint8Array
  /** Signed distance to the shoreline, `128 + round(d / 0.25)` (d > 0 land, < 0 water; m). Meaningful where `shoreSurf` is finite. */
  shoreD: Uint8Array
  /** Water surface of the nearest inland water vertex; NaN where there is no bank data (sea, far from water). */
  shoreSurf: Float32Array
  /** Bank kind blend: 0 beach ... 255 cut bank. */
  bank: Uint8Array
  /** Channel depth of the nearest inland water vertex in 2 cm units (0..5.1 m). */
  chan: Uint8Array
  /** 0..255 road presence for rendering tint. */
  road: Uint8Array
  moisture: Float32Array
  settlements: GenSettlement[]
  structures: GenStructure[]
  roads: GenRoad[]
  dens: GenDen[]
  deposits: GenDeposit[]
  landmarks: GenLandmark[]
  caves: GenCave[]
  cemeteries: GenCemetery[]
  homeSettlement: number
  spawn: { x: number; z: number }
  /** Wall-clock generation time of THIS run (not stored in the cache; 0 on cache hit). */
  genMs: number
}

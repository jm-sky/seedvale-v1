import type { WorldLocationKind } from '../../world/locations/worldLocationTypes'

/** Fog / unknown terrain — do not reveal biome underneath. */
export const MAP_FOG_FILL = '#16130f'
/** `MAP_FOG_FILL` as RGB for the raster fog mask. */
export const MAP_FOG_RGB: readonly [number, number, number] = [0x16, 0x13, 0x0f]
export const MAP_UNAVAILABLE_FILL = '#0e0c09'
/** Canonical river stroke on the raster maps. */
export const MAP_RIVER_STROKE = '#4a82bc'

function hexRgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Raster base colour per `MapRasterClass` code (V3-derived tones, plan
 *  ui-input-046), flattened `r,g,b` triples; index 0 (`None`) is unused. */
const RASTER_CLASS_HEX = [
  '#000000', // None
  '#28466e', // Ocean
  '#3c6ea0', // InlandWater
  '#d2c38c', // Shore
  '#78736e', // Mountain
  '#6e963c', // Meadow
  '#3c642d', // Forest
  '#cdb889', // Desert
  '#505a32', // Swamp
]
export const MAP_RASTER_CLASS_RGB: Uint8Array = Uint8Array.from(RASTER_CLASS_HEX.flatMap(hexRgb))

/** Stable per-slot colour (plan world-012 §13 "Każdy cel ma osobny
 *  kolor/slot") — index 0 unused, slots are 1-3 (`NavigationTargetEntry.slot`). */
export const TARGET_SLOT_COLORS: readonly string[] = ['', '#e0b34a', '#4ac8e0', '#e0578a']

export function targetSlotColor(slot: number): string {
  return TARGET_SLOT_COLORS[slot] ?? TARGET_SLOT_COLORS[1]!
}

/** Per-kind marker colour (world-012 map-markers follow-up) — shared by the
 *  canvas marker fill (`drawMap.ts`) and the DOM kind badge
 *  (`WorldMapScreen.vue`) so a kind reads the same colour everywhere on the
 *  map. Distinct from `TARGET_SLOT_COLORS`, which marks *navigation target*
 *  slot, not location kind — a target overrides this colour on the canvas. */
export const LOCATION_KIND_COLOR: Record<WorldLocationKind, string> = {
  settlement: '#e0b34a',
  cave: '#9b7fd4',
  cemetery: '#9a9a9a',
  lake: '#3f9fd1',
  mountainPeak: '#6f8f52',
  ruins: '#a68b6a',
  abandonedMine: '#c4a35a',
  searchArea: '#6d8f5a',
}

/** Fallback for a marker whose kind can't be resolved from its id (should
 *  not happen for a real `WorldLocation`, see `worldLocationKindFromId`). */
export const LOCATION_KIND_COLOR_FALLBACK = '#e0b34a'

export function locationKindColor(kind: WorldLocationKind | null): string {
  return kind ? LOCATION_KIND_COLOR[kind] : LOCATION_KIND_COLOR_FALLBACK
}

/** Small glyph drawn on the canvas marker itself (plain text via
 *  `ctx.fillText`, not an `<img>`/SVG — canvas can't render the Lucide
 *  components used for the same kinds in `worldLocationDisplay.ts`). Native
 *  emoji colour gives markers a second, colour-independent cue (avoid
 *  relying on fill colour alone). */
export const LOCATION_KIND_EMOJI: Record<WorldLocationKind, string> = {
  settlement: '🏘️',
  cave: '🕳️',
  cemetery: '⚰️',
  lake: '💧',
  mountainPeak: '⛰️',
  ruins: '🏚️',
  abandonedMine: '⛏️',
  searchArea: '🌲',
}

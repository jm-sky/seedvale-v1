import type { MapConfidence, MapKnownLocation } from '../../world/map/mapTypes'

/** Mine ↔ backing cave ids for shared-anchor map presentation (ui-input-026). */
export type AbandonedMineBinding = {
  mineId: string
  caveLocationId: string
}

export type MapLocationLabelPresentation = {
  location: MapKnownLocation
  /** When false, skip marker square/emoji at the anchor (semantic suppression). */
  showMarker: boolean
  labelText: string | null
  labelOffsetX: number
  labelOffsetY: number
  showLabel: boolean
}

type ScreenRect = { left: number, top: number, right: number, bottom: number }

const LABEL_FONT_PX = 12
const LABEL_PAD_X = 4
const LABEL_PAD_Y = 2

/** Default below-marker label offset (matches `drawMap.ts` baseline `y + 8`). */
const DEFAULT_LABEL_OFFSET_Y = 8

/** Bounded deterministic offsets tried after the default position. */
const LABEL_OFFSET_CANDIDATES: readonly { dx: number, dy: number }[] = [
  { dx: 0, dy: DEFAULT_LABEL_OFFSET_Y },
  { dx: 0, dy: -18 },
  { dx: 52, dy: DEFAULT_LABEL_OFFSET_Y },
  { dx: -52, dy: DEFAULT_LABEL_OFFSET_Y },
  { dx: 0, dy: 22 },
  { dx: 52, dy: -10 },
  { dx: -52, dy: -10 },
]

const CONFIDENCE_RANK: Record<MapConfidence, number> = {
  estimated: 0,
  discovered: 1,
  confirmed: 2,
}

function rectsOverlap(a: ScreenRect, b: ScreenRect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
}

function labelTextRect(
  anchorX: number,
  anchorY: number,
  textWidth: number,
  offsetX: number,
  offsetY: number,
): ScreenRect {
  const halfW = textWidth / 2 + LABEL_PAD_X
  const top = anchorY + offsetY - LABEL_PAD_Y
  const bottom = top + LABEL_FONT_PX + LABEL_PAD_Y * 2
  const cx = anchorX + offsetX
  return {
    left: cx - halfW,
    right: cx + halfW,
    top,
    bottom,
  }
}

/**
 * Cave location ids whose marker+label should be hidden when the bound mine
 * is also visible (shared entrance anchor).
 *
 * @domain ui-input
 */
export function suppressedCaveLocationIdsForMineBinding(
  locations: readonly MapKnownLocation[],
  binding: AbandonedMineBinding | null,
): Set<string> {
  if (!binding) return new Set()
  const ids = new Set(locations.map((l) => l.id))
  if (ids.has(binding.mineId) && ids.has(binding.caveLocationId)) {
    return new Set([binding.caveLocationId])
  }
  return new Set()
}

function layoutPriority(
  location: MapKnownLocation,
  activeTargetIds: ReadonlySet<string>,
  binding: AbandonedMineBinding | null,
): number {
  let score = 0
  if (activeTargetIds.has(location.id)) score += 1_000_000
  if (binding && location.id === binding.mineId) score += 100_000
  score += CONFIDENCE_RANK[location.state] * 1_000
  return score
}

/**
 * Resolves per-location marker visibility and label placement for the world map.
 * Presentation-only — does not mutate locations or affect hit-testing.
 *
 * @domain ui-input
 */
export function resolveMapLocationLabelPresentations(
  locations: readonly MapKnownLocation[],
  activeTargetIds: ReadonlySet<string>,
  binding: AbandonedMineBinding | null,
  markerCanvasOf: (location: MapKnownLocation) => { x: number, y: number },
  measureTextWidth: (text: string) => number,
): MapLocationLabelPresentation[] {
  const suppressedCaveIds = suppressedCaveLocationIdsForMineBinding(locations, binding)
  const withLabels = locations
    .filter((loc) => !suppressedCaveIds.has(loc.id))
    .map((loc) => ({
      location: loc,
      showMarker: true,
      labelText: loc.label ?? null,
    }))

  const labelCandidates = withLabels
    .filter((e) => e.labelText != null && e.labelText.length > 0)
    .map((e) => e.location)
    .sort((a, b) => {
      const pa = layoutPriority(a, activeTargetIds, binding)
      const pb = layoutPriority(b, activeTargetIds, binding)
      if (pa !== pb) return pb - pa
      return a.id.localeCompare(b.id)
    })

  const acceptedRects: ScreenRect[] = []
  const placementById = new Map<string, { offsetX: number, offsetY: number, showLabel: boolean }>()

  for (const loc of labelCandidates) {
    const text = loc.label!
    const textWidth = measureTextWidth(text)
    const { x, y } = markerCanvasOf(loc)
    let placed = false
    for (const { dx, dy } of LABEL_OFFSET_CANDIDATES) {
      const rect = labelTextRect(x, y, textWidth, dx, dy)
      if (!acceptedRects.some((r) => rectsOverlap(rect, r))) {
        acceptedRects.push(rect)
        placementById.set(loc.id, { offsetX: dx, offsetY: dy, showLabel: true })
        placed = true
        break
      }
    }
    if (!placed) {
      placementById.set(loc.id, { offsetX: 0, offsetY: DEFAULT_LABEL_OFFSET_Y, showLabel: false })
    }
  }

  return withLabels.map((entry) => {
    const placement = placementById.get(entry.location.id)
    return {
      location: entry.location,
      showMarker: entry.showMarker,
      labelText: entry.labelText,
      labelOffsetX: placement?.offsetX ?? 0,
      labelOffsetY: placement?.offsetY ?? DEFAULT_LABEL_OFFSET_Y,
      showLabel: placement?.showLabel ?? (entry.labelText != null),
    }
  })
}

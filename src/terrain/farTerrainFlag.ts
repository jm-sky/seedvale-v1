/** Default far-ring radius (m) for `?farTerrain=1` (plan world-terrain-066: 600 default; 800 / 1000 optional). */
export const DEFAULT_FAR_TERRAIN_RADIUS = 600
export const MIN_FAR_TERRAIN_RADIUS = 400
export const MAX_FAR_TERRAIN_RADIUS = 1000

/**
 * Parses `?farTerrain`: absent / `0` / `false` / `no` / `off` → `null` (feature off, default); bare / `1` / `true` /
 * `yes` → {@link DEFAULT_FAR_TERRAIN_RADIUS}; any other integer → that radius clamped to 400–1000 m.
 *
 * @domain world-terrain
 */
export function parseFarTerrainFlag(raw: string | null, present: boolean): number | null {
  if (!present) return null
  if (raw === null || raw.trim() === '') return DEFAULT_FAR_TERRAIN_RADIUS
  const v = raw.trim().toLowerCase()
  if (v === '0' || v === 'false' || v === 'no' || v === 'off') return null
  if (v === '1' || v === 'true' || v === 'yes') return DEFAULT_FAR_TERRAIN_RADIUS
  const n = Number.parseInt(v, 10)
  if (!Number.isFinite(n) || n < 1) return null
  return Math.min(MAX_FAR_TERRAIN_RADIUS, Math.max(MIN_FAR_TERRAIN_RADIUS, n))
}

/** Far-ring radius from the page URL, or `null` (flag off, or no `window`, e.g. under Node). */
export function farTerrainRadiusFromUrl(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const p = new URLSearchParams(window.location.search)
    return parseFarTerrainFlag(p.get('farTerrain'), p.has('farTerrain'))
  } catch {
    return null
  }
}

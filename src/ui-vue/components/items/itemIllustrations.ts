import type { ItemKind } from '../../../items/items'

/**
 * Display-only illustration URLs from staged V3 donor PNGs.
 * Keys that exist as `docs/v3-donor/items/illustrations/<kind>.png` resolve via Vite glob.
 */
const illustrationModules = import.meta.glob(
  '../../../../docs/v3-donor/items/illustrations/*.png',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

const byBasename = new Map<string, string>()
for (const [path, url] of Object.entries(illustrationModules)) {
  const base = path.split('/').pop()?.replace(/\.png$/i, '')
  if (base) byBasename.set(base, url)
}

/** Optional aliases when V1 kind id ≠ donor illustration basename. */
const ALIASES: Partial<Record<ItemKind, string>> = {
  waterskin_small: 'waterskin_m',
  waterskin_medium: 'waterskin_m',
  waterskin_large: 'waterskin_m',
  waterskin_full: 'waterskin_m',
  waterskin_empty: 'waterskin_m',
  leather_armor: 'leather_jerkin',
}

export function resolveItemIllustrationSrc(kind: ItemKind): string | null {
  const alias = ALIASES[kind]
  if (alias) {
    const aliased = byBasename.get(alias)
    if (aliased) return aliased
  }
  return byBasename.get(kind) ?? null
}

/**
 * Money formatting for Trade / Merchant presentation (Stage F follow-up).
 * Port of V3 `src/game/data/items/format.ts` — 1 inventory `coin` = 1 copper.
 * @domain ui
 */

/** 100 copper = 1 silver, 100 silver = 1 gold. */
export function formatCoins(copper: number): string {
  if (copper <= 0) return '0c'
  const g = Math.floor(copper / 10000)
  const s = Math.floor((copper % 10000) / 100)
  const c = copper % 100
  return [g ? `${g}g` : '', s ? `${s}s` : '', c ? `${c}c` : ''].filter(Boolean).join(' ')
}

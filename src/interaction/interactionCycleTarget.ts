/** Pure helpers for non-combat Tab cycle commitment (plan ui-input-028). */

export function resolveCycleCommittedTarget<T>(
  candidates: readonly T[],
  committedKey: string | null,
  stableKey: (candidate: T) => string,
): T | null {
  if (!committedKey) return null
  return candidates.find((candidate) => stableKey(candidate) === committedKey) ?? null
}

export function advanceCycleCommittedKey<T>(
  candidates: readonly T[],
  committedKey: string | null,
  stableKey: (candidate: T) => string,
): string | null {
  if (candidates.length === 0) return null
  const currentIndex = committedKey
    ? candidates.findIndex((candidate) => stableKey(candidate) === committedKey)
    : -1
  const nextIndex = currentIndex >= 0
    ? (currentIndex + 1) % candidates.length
    : 0
  return stableKey(candidates[nextIndex]!)
}

export function cycleHintPosition<T>(
  candidates: readonly T[],
  target: T | null,
  stableKey: (candidate: T) => string,
): { position: number, total: number } | null {
  if (!target || candidates.length <= 1) return null
  const index = candidates.findIndex((candidate) => stableKey(candidate) === stableKey(target))
  if (index < 0) return null
  return { position: index + 1, total: candidates.length }
}

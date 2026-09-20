/**
 * Stable identifier for one predefined authored world consequence, e.g.
 * `outpost:forest-road-01`. Must be compile-time/content-stable — never
 * derived from runtime creation order, `Date.now()`, stream-in order or
 * quest stage index.
 *
 * @domain world
 */
export type AuthoredWorldConsequenceId = string

/**
 * Static authored metadata for one predefined world consequence. Carries
 * only routing/validation metadata — never arbitrary runtime payload
 * (positions, HP, inventory, construction progress, schedules, quest
 * scripting). Concrete domain state belongs to whatever materializes the
 * consequence, not to this definition.
 *
 * @domain world
 */
export type AuthoredWorldConsequenceDefinition = {
  id: AuthoredWorldConsequenceId
}

/**
 * Read/write contract for the activation registry (plan world-031). Owns
 * exactly one fact per id — activated or not — and nothing about the
 * concrete domain object a consumer materializes from it.
 *
 * @domain world
 */
export type AuthoredWorldConsequenceRegistry = {
  /** Read-only activation query for domain/composition consumers. */
  isActive: (id: AuthoredWorldConsequenceId) => boolean
  /** Set-like: first call for `id` stores it and returns `true`; every
   *  later call is a no-op and returns `false`. Throws for an id without a
   *  predefined definition — a typo must never create an unknown persisted
   *  activation string. */
  activate: (id: AuthoredWorldConsequenceId) => boolean
  /** Deterministically ordered plain ids for `SaveData`/rebuild carry. */
  snapshot: () => readonly AuthoredWorldConsequenceId[]
  /** Read-only definition lookup for routing/materialization. */
  getDefinition: (id: AuthoredWorldConsequenceId) => AuthoredWorldConsequenceDefinition | undefined
}

/**
 * Production authored consequence catalog. Empty in V1 (world-031 is only
 * the foundation) — concrete outpost/farm/road-stop definitions are added
 * by the content plans that consume this registry.
 *
 * @domain world
 */
export const AUTHORED_WORLD_CONSEQUENCE_DEFINITIONS: readonly AuthoredWorldConsequenceDefinition[] = []

/**
 * Constructs the world-owned activation registry (plan world-031),
 * restoring `initialActiveIds` (from `SaveData.authoredWorldConsequences`
 * on a fresh boot, or the previous bundle's `snapshot()` on an in-session
 * `rebuildWorldBundle()`). `definitions` defaults to the production catalog;
 * tests may pass fixture definitions instead.
 *
 * Throws if `definitions` contains a duplicate id, or if a restored id has
 * no matching definition — both are fail-closed: a stale/malformed id must
 * never become silent orphan state.
 *
 * @domain world
 */
export function createAuthoredWorldConsequenceRegistry(
  initialActiveIds: readonly AuthoredWorldConsequenceId[] = [],
  definitions: readonly AuthoredWorldConsequenceDefinition[] = AUTHORED_WORLD_CONSEQUENCE_DEFINITIONS,
): AuthoredWorldConsequenceRegistry {
  const byId = new Map<AuthoredWorldConsequenceId, AuthoredWorldConsequenceDefinition>()
  for (const definition of definitions) {
    if (byId.has(definition.id)) {
      throw new Error(`Duplicate authored world consequence definition id: ${definition.id}`)
    }
    byId.set(definition.id, definition)
  }

  const active = new Set<AuthoredWorldConsequenceId>()
  for (const id of initialActiveIds) {
    if (!byId.has(id)) {
      throw new Error(`Unknown authored world consequence id restored from save: ${id}`)
    }
    active.add(id)
  }

  return {
    isActive: (id) => active.has(id),
    activate(id) {
      if (!byId.has(id)) {
        throw new Error(`Unknown authored world consequence id: ${id}`)
      }
      if (active.has(id)) return false
      active.add(id)
      return true
    },
    snapshot: () => [...active].sort(),
    getDefinition: (id) => byId.get(id),
  }
}

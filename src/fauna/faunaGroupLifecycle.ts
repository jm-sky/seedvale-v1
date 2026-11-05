import {
  type PreySpawner,
  type SavedSpawnPointState,
  snapshotSpawnPointState,
  tickSpawnPointRecovery,
  updateDepletedSpawnerRecovery,
  updateSpawners,
} from './AnimalSpawner'
import { ordinaryHabitatCapacity } from './persistentOccupants'
/**
 * Habitat-group lifecycle bookkeeping for `createFauna` (plan fauna-050 F2).
 *
 * A habitat group is a *projection* inside the one fauna registry: when it is
 * unloaded, only each spawner's lifecycle state is kept (the "carried" map);
 * individuals are not persisted. This module owns the pure parts:
 *
 * - `CarriedSpawnerStore` — carried states + the save-time union with live spawners,
 * - `catchUpSpawnerLifecycle` — lazy day catch-up on materialization (same rules as
 *   continuous ticking, stepped in small day quanta),
 * - `isGroupEngaged` / timeout constants — engaged-agent hysteresis for dematerialization.
 *
 * No Three.js, no globals: everything is unit-testable without GLB loading.
 */
import { effectiveMaxPreyCount } from './wolfDenScenario'

/** Input describing one non-home habitat group (settlement id doubles as group id, so
 *  spawner ids keep the `spawnerId()` scheme). Wilderness cells reuse it in F4. */
export type FaunaHabitatGroupInput = {
  groupId: string
  center: { x: number, z: number }
  footprintRadius: number
  /** Predator-den ring past the footprint (`predatorDenRingForBelt`); omitted = home ring. */
  denRing?: readonly [number, number]
}

/** Step used by the lazy catch-up. Small enough that the result matches per-frame
 *  ticking to within one quantum (leftover timer fractions), large enough to be cheap. */
export const CATCH_UP_STEP_DAYS = 0.25
/** Catch-up never simulates more than this many in-game days; every lifecycle cycle
 *  (21-day recovery + recolonization) reaches its fixed point well inside it. */
export const MAX_CATCH_UP_DAYS = 120
/** A group whose agents are engaged delays dematerialization at most this long (real seconds). */
export const ENGAGED_DEMATERIALIZE_TIMEOUT_SEC = 20

/** Runtime-only data captured at dematerialization (never part of the save shape). */
export type CarriedSpawnerRuntime = {
  /** `elapsedDays` when the owning group was dematerialized. */
  atDays: number
  /** Live bound animals at that moment (they were disposed with the group). */
  boundCount: number
  /** Short timer that `SavedSpawnPointState` deliberately omits; kept so catch-up is continuous. */
  daysSinceLastRespawn: number
}

export type CarriedSpawnerEntry = {
  saved: SavedSpawnPointState
  /** Absent for entries that came from a save file / rebuild carry (no catch-up, full-fill rules). */
  runtime?: CarriedSpawnerRuntime
}

/** One persisted spawner row (`SaveSpawnPoint`-compatible). */
export type SpawnerSnapshotRow = SavedSpawnPointState & { id: string }

/**
 * Spawner lifecycle states of groups that are not currently materialized, plus the
 * union logic for saving. The store is the *only* place unmaterialized state lives.
 */
export class CarriedSpawnerStore {
  private readonly entries = new Map<string, CarriedSpawnerEntry>()

  constructor(initial?: ReadonlyMap<string, SavedSpawnPointState>) {
    if (initial) for (const [id, saved] of initial) this.entries.set(id, { saved })
  }

  has(id: string): boolean {
    return this.entries.has(id)
  }

  size(): number {
    return this.entries.size
  }

  /** Removes and returns the entry (a spawner is about to become live and owns its state). */
  take(id: string): CarriedSpawnerEntry | undefined {
    const entry = this.entries.get(id)
    this.entries.delete(id)
    return entry
  }

  /** Records a live spawner's state when its group is dematerialized. */
  carry(spawner: PreySpawner, boundCount: number, atDays: number): void {
    this.entries.set(spawner.id, {
      saved: snapshotSpawnPointState(spawner),
      runtime: { atDays, boundCount, daysSinceLastRespawn: spawner.daysSinceLastRespawn },
    })
  }

  /**
   * Union of live and carried spawner states for the save. Live wins on an id clash
   * (cannot happen via `take`, but a stale carried row must never shadow a live one).
   * Live rows keep their given order; carried rows follow, sorted by id for determinism.
   */
  snapshot(live: readonly PreySpawner[]): SpawnerSnapshotRow[] {
    const rows: SpawnerSnapshotRow[] = live.map((s) => ({ id: s.id, ...snapshotSpawnPointState(s) }))
    const liveIds = new Set(live.map((s) => s.id))
    const carriedIds = [...this.entries.keys()].filter((id) => !liveIds.has(id)).sort()
    for (const id of carriedIds) rows.push({ id, ...this.entries.get(id)!.saved })
    return rows
  }
}

/**
 * Lazy catch-up of one just-restored spawner for the in-game time its group was
 * unloaded. Uses the production lifecycle functions (`updateSpawners`,
 * `updateDepletedSpawnerRecovery`, `tickSpawnPointRecovery`) in `CATCH_UP_STEP_DAYS`
 * quanta, with a *virtual* bound count in place of live agents, so the result matches
 * continuous ticking. Mutates `spawner`; returns the virtual bound count to materialize.
 *
 * 🟡 The daily `disabled/recovering` check uses the bound count as its "nearby same-kind
 * animals" proxy (live code counts animals within `SPAWNER_RADIUS`).
 *
 * @domain fauna
 */
export function catchUpSpawnerLifecycle(
  spawner: PreySpawner,
  runtime: CarriedSpawnerRuntime,
  nowDays: number,
  reservedPersistentSlots = 0,
): number {
  spawner.daysSinceLastRespawn = runtime.daysSinceLastRespawn
  let bound = runtime.boundCount
  const elapsed = Math.min(MAX_CATCH_UP_DAYS, Math.max(0, nowDays - runtime.atDays))
  // Same day-index convention as the live daily recovery check (floor of world days).
  let lastCheckDay = Math.floor(runtime.atDays)
  const reserved = reservedPersistentSlots > 0 ? new Map([[spawner.id, reservedPersistentSlots]]) : undefined
  const getBound = (): number => bound
  const onRespawn = (): boolean => {
    bound++
    return true
  }
  // Clamp to the ordinary cap so a stale bound never exceeds what the habitat holds.
  const cap = ordinaryHabitatCapacity(effectiveMaxPreyCount(spawner), reservedPersistentSlots)
  bound = Math.min(bound, cap)

  let done = 0
  while (done < elapsed - 1e-9) {
    const step = Math.min(CATCH_UP_STEP_DAYS, elapsed - done)
    done += step
    const t = runtime.atDays + done
    updateSpawners([spawner], step, getBound, onRespawn, reserved)
    updateDepletedSpawnerRecovery([spawner], step, getBound, onRespawn, reserved)
    const day = Math.floor(t)
    if (day !== lastCheckDay) {
      lastCheckDay = day
      if (spawner.state === 'disabled' || spawner.state === 'recovering') {
        tickSpawnPointRecovery(spawner, t, bound)
      }
    }
  }
  return bound
}

/** Minimal view of a group's agent for the hysteresis check. */
export type GroupAgentEngagement = {
  isDead: () => boolean
  /** True while the agent is combat/chase/trip/player-led (`updateImportance === 'immediate'`). */
  isEngaged: () => boolean
}

/** A group may be dematerialized only while none of its living agents is engaged. */
export function isGroupEngaged(agents: readonly GroupAgentEngagement[]): boolean {
  for (const a of agents) {
    if (!a.isDead() && a.isEngaged()) return true
  }
  return false
}

/**
 * Number of animals to create for one spawner on materialization:
 * carried-with-runtime -> the virtual bound count after catch-up (individuals are not
 * persisted, so survivors are re-created, not remembered); otherwise (fresh / loaded
 * from a save) the existing rule — full ordinary capacity if `active`, else none.
 */
export function materializedPopulation(
  spawner: PreySpawner,
  virtualBound: number | undefined,
  reservedPersistentSlots = 0,
): number {
  if (virtualBound !== undefined) {
    return Math.min(virtualBound, ordinaryHabitatCapacity(effectiveMaxPreyCount(spawner), reservedPersistentSlots))
  }
  return spawner.state === 'active' ? ordinaryHabitatCapacity(spawner.maxPreyCount, reservedPersistentSlots) : 0
}

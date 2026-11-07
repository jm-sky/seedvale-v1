import type { RoadCorridorSegment } from '../terrain/chunkHeightmap'
import { type PreySpawner, type SavedSpawnPointState, snapshotSpawnPointState } from './AnimalSpawner'
import { ordinaryHabitatCapacity } from './persistentOccupants'
/**
 * Habitat-group lifecycle bookkeeping for `createFauna` (plan fauna-050 F2).
 *
 * A habitat group is a *projection* inside the one fauna registry: when it is
 * unloaded, only each spawner's lifecycle state is kept (the "carried" map);
 * individuals are not persisted. This module owns the pure parts:
 *
 * - `CarriedSpawnerStore` — carried states + the save-time union with live spawners,
 * - the dormant catch-up itself is `advanceWildHabitat` (`wildHabitatAdvance.ts`, C3),
 * - `isGroupEngaged` / timeout constants — engaged-agent hysteresis for dematerialization.
 *
 * No Three.js, no globals: everything is unit-testable without GLB loading.
 */

/** Input describing one non-home habitat group (settlement id doubles as group id, so
 *  spawner ids keep the `spawnerId()` scheme). Wilderness cells reuse it in F4. */
export type FaunaHabitatGroupInput = {
  groupId: string
  center: { x: number, z: number }
  footprintRadius: number
  /** Predator-den ring past the footprint (`predatorDenRingForBelt`); omitted = home ring. */
  denRing?: readonly [number, number]
  /** Road corridors queried around this group's own anchor (`groupRoadQueryExtent`); omitted = none. */
  roadSegments?: readonly RoadCorridorSegment[]
}

/** A group whose agents are engaged delays dematerialization at most this long (real seconds). */
export const ENGAGED_DEMATERIALIZE_TIMEOUT_SEC = 20

export type CarriedSpawnerEntry = {
  /** Includes the lifecycle cursor `advancedAtDays` (set at dematerialization, fauna-050 C3). */
  saved: SavedSpawnPointState
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

  /** Mutable view of a carried entry (dormant death accounting, fauna-050 C3). */
  peek(id: string): CarriedSpawnerEntry | undefined {
    return this.entries.get(id)
  }

  /** Removes and returns the entry (a spawner is about to become live and owns its state). */
  take(id: string): CarriedSpawnerEntry | undefined {
    const entry = this.entries.get(id)
    this.entries.delete(id)
    return entry
  }

  /** Records a live spawner's state when its group is dematerialized. */
  carry(spawner: PreySpawner, atDays: number): void {
    spawner.advancedAtDays = atDays
    this.entries.set(spawner.id, { saved: snapshotSpawnPointState(spawner) })
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
 * Number of animals to create for one spawner on a first materialization (no durable records yet):
 * full ordinary capacity if `active`, else none. A group whose records exist is restored through
 * `advanceWildHabitat` instead (fauna-050 C3).
 */
export function materializedPopulation(spawner: PreySpawner, reservedPersistentSlots = 0): number {
  return spawner.state === 'active' ? ordinaryHabitatCapacity(spawner.maxPreyCount, reservedPersistentSlots) : 0
}

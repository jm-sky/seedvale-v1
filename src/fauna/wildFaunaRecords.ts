import type { AnimalSaveState } from './AnimalAgent'
import type { WildAnimalSex } from './animalDefs'
import type { AnimalVariant } from './animalVariants'
import type { PersistentOccupantSaveRecord } from './persistentOccupants'

/**
 * @domain fauna
 * @system wild-fauna-records
 * @role Durable identity + persistence shape of generated wild individuals
 *  (plan fauna-050 C1/C2). Pure data and registry operations — no Three.js,
 *  no agents. `createFauna` owns the live projection (an `AnimalAgent` is the
 *  projection of exactly one record); this module owns ids, the record shape,
 *  the "group initialised" markers and the sorted save snapshot.
 */

/** How a generated individual came to exist. */
export type WildRecordOrigin = 'ring' | 'fill' | 'birth' | 'immigrant'

/** Generated wild individual (C1.3): the declared-occupant row plus lifecycle fields. */
export type WildFaunaRecord = PersistentOccupantSaveRecord & {
  origin: WildRecordOrigin
  sex: WildAnimalSex
  herdId?: string
  variant?: AnimalVariant
  humanTaste?: boolean
  /** World-days up to which `state` has been advanced (C3 cursor). */
  advancedAtDays: number
}

/** Marker that a habitat group's initial ring/fill population exists (C1.2): from then on
 *  an absent record means *removed* and the initial population is never replayed. */
export type WildFaunaGroupRow = {
  id: string
  initializedAtDays: number
}

export type WildFaunaSnapshot = {
  groups: WildFaunaGroupRow[]
  records: WildFaunaRecord[]
}

export const EMPTY_WILD_FAUNA_SNAPSHOT: WildFaunaSnapshot = { groups: [], records: [] }

/** Id of the `index`-th planned ring individual of group `groupId` (C1.2). */
export function ringAnimalId(groupId: string, index: number): string {
  return `${groupId}:ring:r${index}`
}

/** Id of the `seq`-th individual created at spawner `spawnerId` (initial fill, respawn, birth). */
export function birthAnimalId(spawnerId: string, seq: number): string {
  return `${spawnerId}:b${seq}`
}

/** Habitat id of a group's ring individuals (C1.2). */
export function ringHabitatId(groupId: string): string {
  return `${groupId}:ring`
}

/** Sex draw (C1.4): `roll` is a `[0,1)` event-keyed value; a forced-female ring mother wins. */
export function wildSexFromRoll(roll: number, forceFemale = false): WildAnimalSex {
  if (forceFemale) return 'female'
  return roll < 0.5 ? 'female' : 'male'
}

/**
 * Registry of generated wild records plus initialised-group markers.
 * One owner per `createFauna` instance; `serialize()` is the only save path
 * (rebuild uses it too, so there is no second snapshot shape).
 */
export class WildFaunaRegistry {
  private readonly records = new Map<string, WildFaunaRecord>()
  private readonly groups = new Map<string, WildFaunaGroupRow>()

  constructor(initial?: WildFaunaSnapshot) {
    for (const g of initial?.groups ?? []) this.groups.set(g.id, { ...g })
    for (const r of initial?.records ?? []) this.records.set(r.animalId, r)
  }

  isGroupInitialized(groupId: string): boolean {
    return this.groups.has(groupId)
  }

  markGroupInitialized(groupId: string, atDays: number): void {
    if (!this.groups.has(groupId)) this.groups.set(groupId, { id: groupId, initializedAtDays: atDays })
  }

  has(animalId: string): boolean {
    return this.records.has(animalId)
  }

  get(animalId: string): WildFaunaRecord | undefined {
    return this.records.get(animalId)
  }

  /** Inserts or replaces by durable id (a record is refreshed on demote/save). */
  set(record: WildFaunaRecord): void {
    this.records.set(record.animalId, record)
  }

  /** Removal without a tombstone: ids are never reused (C1.2). */
  remove(animalId: string): boolean {
    return this.records.delete(animalId)
  }

  size(): number {
    return this.records.size
  }

  /** Records of one habitat, in id order. */
  forHabitat(habitatId: string): WildFaunaRecord[] {
    return [...this.records.values()].filter((r) => r.habitatId === habitatId).sort(byAnimalId)
  }

  all(): WildFaunaRecord[] {
    return [...this.records.values()].sort(byAnimalId)
  }

  /** Dormant records whose stored position lies in the disk (C1.8 positional activation). */
  inDisk(cx: number, cz: number, radius: number, isDormant: (animalId: string) => boolean): WildFaunaRecord[] {
    const r2 = radius * radius
    return this.all().filter((r) => {
      if (!isDormant(r.animalId)) return false
      const dx = r.state.x - cx
      const dz = r.state.z - cz
      return dx * dx + dz * dz <= r2
    })
  }

  serialize(): WildFaunaSnapshot {
    return {
      groups: [...this.groups.values()].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)),
      records: this.all(),
    }
  }
}

function byAnimalId(a: WildFaunaRecord, b: WildFaunaRecord): number {
  return a.animalId < b.animalId ? -1 : a.animalId > b.animalId ? 1 : 0
}

/** Builds a record from a live individual's snapshot (demote / save). */
export function wildRecordFrom(
  base: Pick<WildFaunaRecord, 'habitatId' | 'occupantKey' | 'animalId' | 'kind' | 'origin' | 'sex' | 'herdId' | 'variant' | 'humanTaste'>,
  state: AnimalSaveState,
  advancedAtDays: number,
): WildFaunaRecord {
  return { ...base, state, advancedAtDays }
}

/** World-owned ash marks left after a used player fire is dismantled
 *  (plan items-player-058). Authoritative records use absolute game days;
 *  the overlay is a projection, never persisted. */

import type { HeightSampler } from '../player/PlayerController'
import {
  createFireResidueOverlaySystem,
  type FireResidueOverlayPlacement,
} from '../terrain/fireResidueOverlay'
import type { Scene } from 'three'

export const FIRE_RESIDUE_LIFETIME_DAYS = 1

export type FireResidueRecord = {
  id: string
  x: number
  z: number
  createdAtDay: number
  expiresAtDay: number
}

export type FireResidues = {
  add: (x: number, z: number, nowDays: number) => FireResidueRecord
  nodes: () => readonly FireResidueRecord[]
  reconcile: (nowDays: number) => void
  dispose: () => void
}

let nextResidueId = 0

export function fireResidueExpiresAt(createdAtDay: number): number {
  return createdAtDay + FIRE_RESIDUE_LIFETIME_DAYS
}

export function isFireResidueActive(record: FireResidueRecord, nowDays: number): boolean {
  return nowDays < record.expiresAtDay
}

function hash01(id: string, salt: number): number {
  let h = (salt * 374761393) | 0
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(h ^ id.charCodeAt(i), 16777619)
  }
  h = (h ^ (h >>> 13)) * 1274126177
  h = h ^ (h >>> 16)
  return (h >>> 0) / 4294967296
}

function placementFor(record: FireResidueRecord): FireResidueOverlayPlacement {
  return {
    x: record.x,
    z: record.z,
    rotation: hash01(record.id, 0x517cc1b7) * Math.PI * 2,
    scale: 0.85 + hash01(record.id, 0x27d4eb2f) * 0.45,
  }
}

function earliestExpiry(records: readonly FireResidueRecord[]): number | null {
  if (records.length === 0) return null
  let next = records[0]!.expiresAtDay
  for (let i = 1; i < records.length; i++) {
    const expires = records[i]!.expiresAtDay
    if (expires < next) next = expires
  }
  return next
}

/**
 * Sparse player-created ash collection. Expiry is checked lazily against a
 * cached earliest `expiresAtDay` so ordinary frames do not scan the list.
 */
export function createFireResidues(
  scene: Scene,
  sampleHeight: HeightSampler,
  initial: readonly FireResidueRecord[] = [],
  nowDays = 0,
): FireResidues {
  const overlay = createFireResidueOverlaySystem(sampleHeight)
  scene.add(overlay.group)
  const records: FireResidueRecord[] = initial
    .filter((record) => isFireResidueActive(record, nowDays))
    .map((record) => ({ ...record }))
  let nextExpiryDay = earliestExpiry(records)

  const syncOverlay = (): void => {
    overlay.sync(records.map(placementFor))
  }

  syncOverlay()

  const reconcile = (currentDays: number): void => {
    if (nextExpiryDay === null || currentDays < nextExpiryDay) return
    let changed = false
    for (let i = records.length - 1; i >= 0; i--) {
      if (isFireResidueActive(records[i]!, currentDays)) continue
      records.splice(i, 1)
      changed = true
    }
    nextExpiryDay = earliestExpiry(records)
    if (changed) syncOverlay()
  }

  return {
    add(x, z, currentDays) {
      reconcile(currentDays)
      const createdAtDay = currentDays
      const record: FireResidueRecord = {
        id: `ash:${Date.now()}:${nextResidueId++}`,
        x,
        z,
        createdAtDay,
        expiresAtDay: fireResidueExpiresAt(createdAtDay),
      }
      records.push(record)
      nextExpiryDay = earliestExpiry(records)
      syncOverlay()
      return record
    },
    nodes: () => records,
    reconcile,
    dispose() {
      overlay.dispose()
      records.length = 0
      nextExpiryDay = null
    },
  }
}

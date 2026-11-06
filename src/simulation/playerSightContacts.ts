import type { SightResult } from '../world/sight/querySight'

/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — transient per-world store of player-facing sight
 *  contacts: per-actor `seen`/`concealed` state (with a short blocked grace)
 *  and last-known billboards. Pure, never saved, no Three.js.
 */

export type SightBillboardVariant = 'human' | 'largeAnimal' | 'smallAnimal'
export type PlayerContactState = 'seen' | 'concealed'

export type PlayerSightContactConfig = {
  concealGraceSec: number
  expireNearM: number
  expireFarM: number
  expireAgeSec: number
}

export const DEFAULT_PLAYER_SIGHT_CONTACT_CONFIG: PlayerSightContactConfig = {
  concealGraceSec: 0.2,
  expireNearM: 3,
  expireFarM: 50,
  expireAgeSec: 60,
}

export type ContactPose = { x: number, y: number, z: number, yaw: number }

export type LastKnownContact = ContactPose & {
  actorId: string
  variant: SightBillboardVariant
  createdAtSec: number
  contextKey: string
}

export type PlayerSightContacts = {
  /** One evaluation result for an actor. Returns the resulting state. */
  observe: (
    actorId: string,
    result: SightResult,
    pose: ContactPose,
    variant: SightBillboardVariant,
    contextKey: string,
    nowSec: number,
  ) => PlayerContactState
  isConcealed: (actorId: string) => boolean
  /** Expiry pass (once per frame). */
  tick: (nowSec: number, playerX: number, playerZ: number, playerContextKey: string) => void
  /** Death/despawn/unload/corpse: drop actor state and its billboard. */
  forget: (actorId: string) => void
  /** Drop every actor not in `liveIds`. */
  retainOnly: (liveIds: ReadonlySet<string>) => void
  /** Stable array; identity changes only when the set changes. */
  lastKnown: () => readonly LastKnownContact[]
  /** Bumps when the last-known set changes. */
  revision: () => number
  clear: () => void
}

type ActorEntry = {
  concealed: boolean
  blockedSinceSec: number | null
  hasClear: boolean
  clearPose: ContactPose
  clearVariant: SightBillboardVariant
  clearContextKey: string
}

export function createPlayerSightContacts(
  config: PlayerSightContactConfig = DEFAULT_PLAYER_SIGHT_CONTACT_CONFIG,
): PlayerSightContacts {
  const actors = new Map<string, ActorEntry>()
  const billboards = new Map<string, LastKnownContact>()
  let snapshot: readonly LastKnownContact[] = []
  let rev = 0
  let dirty = false

  const dropBillboard = (id: string): void => {
    if (billboards.delete(id)) dirty = true
  }
  const flush = (): void => {
    if (!dirty) return
    dirty = false
    snapshot = Array.from(billboards.values())
    rev++
  }

  return {
    observe(actorId, result, pose, variant, contextKey, nowSec) {
      let e = actors.get(actorId)
      if (!e) {
        e = {
          concealed: false,
          blockedSinceSec: null,
          hasClear: false,
          clearPose: { x: 0, y: 0, z: 0, yaw: 0 },
          clearVariant: variant,
          clearContextKey: contextKey,
        }
        actors.set(actorId, e)
      }
      if (result === 'clear') {
        e.concealed = false
        e.blockedSinceSec = null
        e.hasClear = true
        e.clearPose.x = pose.x
        e.clearPose.y = pose.y
        e.clearPose.z = pose.z
        e.clearPose.yaw = pose.yaw
        e.clearVariant = variant
        e.clearContextKey = contextKey
        dropBillboard(actorId)
      }
      else if (result === 'unknown') {
        e.concealed = false
        e.blockedSinceSec = null
        dropBillboard(actorId)
      }
      else if (!e.concealed) {
        e.blockedSinceSec ??= nowSec
        if (nowSec - e.blockedSinceSec >= config.concealGraceSec) {
          e.concealed = true
          if (e.hasClear && !billboards.has(actorId)) {
            billboards.set(actorId, {
              actorId,
              variant: e.clearVariant,
              x: e.clearPose.x,
              y: e.clearPose.y,
              z: e.clearPose.z,
              yaw: e.clearPose.yaw,
              createdAtSec: nowSec,
              contextKey: e.clearContextKey,
            })
            dirty = true
          }
        }
      }
      flush()
      return e.concealed ? 'concealed' : 'seen'
    },
    isConcealed: id => actors.get(id)?.concealed === true,
    tick(nowSec, playerX, playerZ, playerContextKey) {
      for (const [id, b] of billboards) {
        const d = Math.hypot(b.x - playerX, b.z - playerZ)
        if (
          d < config.expireNearM
          || d > config.expireFarM
          || nowSec - b.createdAtSec >= config.expireAgeSec
          || b.contextKey !== playerContextKey
        ) dropBillboard(id)
      }
      flush()
    },
    forget(id) {
      actors.delete(id)
      dropBillboard(id)
      flush()
    },
    retainOnly(liveIds) {
      for (const id of Array.from(actors.keys())) {
        if (!liveIds.has(id)) {
          actors.delete(id)
          dropBillboard(id)
        }
      }
      flush()
    },
    lastKnown: () => snapshot,
    revision: () => rev,
    clear() {
      actors.clear()
      if (billboards.size > 0) {
        billboards.clear()
        dirty = true
      }
      flush()
    },
  }
}

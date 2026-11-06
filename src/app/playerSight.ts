import type { NpcAgent } from '../ai/NpcAgent'
import type { AnimalAgent } from '../fauna/AnimalAgent'
import type { Settlement } from '../settlement/createSettlement'
import type { WorldSpatialContext } from '../world/spatialContext'
import { NPC_HEIGHT } from '../ai/NpcAgent'
import { ANIMAL_SIGHT_BODY_CLASS } from '../fauna/animalDefs'
import { writeActorSightSamples } from '../render/actorSightSamples'
import { createLastKnownBillboards } from '../render/lastKnownBillboards'
import {
  createPlayerSightContacts,
  type SightBillboardVariant,
} from '../simulation/playerSightContacts'
import {
  createSightQueryOut,
  querySight,
  type SightResult,
  type SightWorld,
} from '../world/sight/querySight'
import type { Object3D } from 'three'

/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — per-world player sight controller: evaluates
 *  character-eye line of sight to loaded NPCs/animals on a distance-tiered
 *  cadence, drives the contact state machine, applies model/label
 *  concealment and syncs last-known billboards. Presentation/information
 *  only — reads simulation state, never writes it, never reads the camera.
 */

/** Actors farther than this are not evaluated (state `unknown` → shown). */
export const PLAYER_SIGHT_EVAL_RANGE_M = 55
/** Character eye above the player's feet (`PLAYER_HEIGHT` 1.8 m). */
export const PLAYER_SIGHT_EYE_HEIGHT_M = 1.65
const NEAR_TIER_M = 15
const MID_TIER_M = 30
/** Cache quantum (m) for observer/target poses. */
const POSE_QUANTUM_M = 0.2
const REAPPLY_INTERVAL_SEC = 0.5
const RETAIN_INTERVAL_FRAMES = 30
const SAMPLE_CAPACITY = 8

type Xyz = { x: number, y: number, z: number }

export type PlayerSightUpdateInput = {
  nowSec: number
  /** Player feet position (live, not copied). */
  playerPosition: Xyz
  playerContext: WorldSpatialContext
  settlements: readonly Settlement[]
  detachedLivestock: readonly AnimalAgent[]
  wildFauna: readonly AnimalAgent[]
  /** Mounted animal id (exempt while ridden). */
  mountedAnimalId: string | null
  /** NPC in dialogue/trade with the player (exempt while it lasts). */
  interactingNpcId: string | null
  resolveContextAt: (x: number, y: number, z: number) => WorldSpatialContext
}

export type PlayerSightStats = {
  evaluated: number
  queries: number
  cacheHits: number
  concealed: number
  billboards: number
  cpuMs: number
}

export type PlayerSight = {
  /** Once per frame, after settlements/fauna update, before render. */
  update: (input: PlayerSightUpdateInput) => void
  /** False while the NPC is concealed from the character (labels, dots, gaze, lock). */
  isNpcDisclosed: (npcId: string) => boolean
  isAnimalDisclosed: (animalId: string) => boolean
  enabled: () => boolean
  stats: () => Readonly<PlayerSightStats>
  /** Reveals everything and drops all contacts (WorldBundle rebuild/dispose). */
  dispose: () => void
}

type CacheEntry = {
  ox: number, oy: number, oz: number
  tx: number, ty: number, tz: number
  revision: number
  contextKey: string
  result: SightResult
  phase: number
  lastReapplySec: number
}

type SightAgent = {
  mesh: Object3D
  setSightConcealed: (concealed: boolean) => void
  reapplySightConcealment: () => void
  isSightConcealed: () => boolean
}

function contextKeyOf(context: WorldSpatialContext): string {
  return context.kind === 'surface' ? 'surface' : `cave:${context.caveId}`
}

function stablePhase(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return h & 3
}

const q = (v: number): number => Math.round(v / POSE_QUANTUM_M)

/** `?sight=0` disables Stage 1 (runtime switch until §2/§4 pass). */
export function isPlayerSightEnabledFromUrl(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return new URLSearchParams(window.location.search).get('sight') !== '0'
  } catch {
    return true
  }
}

/** Creates the controller for one `WorldBundle`. `billboardParent` = scene. */
export function createPlayerSight(
  world: SightWorld,
  billboardParent: Object3D,
  options: { enabled: boolean },
): PlayerSight {
  const enabled = options.enabled
  const contacts = createPlayerSightContacts()
  const billboards = enabled ? createLastKnownBillboards(billboardParent) : null
  const cache = new Map<string, CacheEntry>()
  const touched = new Map<string, SightAgent>()
  const liveIds = new Set<string>()
  /** Corpses are evaluated for model/info concealment only: no contact state
   *  machine, no last-known billboard (a corpse never moves). */
  const corpseKeys = new Set<string>()
  const concealedCorpses = new Set<string>()
  const samples = new Float32Array(SAMPLE_CAPACITY * 3)
  const out = createSightQueryOut()
  const observer = { x: 0, y: 0, z: 0, context: { kind: 'surface' } as WorldSpatialContext }
  const pose = { x: 0, y: 0, z: 0, yaw: 0 }
  const stats: PlayerSightStats = { evaluated: 0, queries: 0, cacheHits: 0, concealed: 0, billboards: 0, cpuMs: 0 }
  let frame = 0
  let lastBillboardRevision = -1

  const evaluate = (
    key: string,
    agent: SightAgent,
    variant: SightBillboardVariant,
    exempt: boolean,
    input: PlayerSightUpdateInput,
    animal: AnimalAgent | null,
    corpse = false,
  ): void => {
    liveIds.add(key)
    const p = agent.mesh.position
    const dx = p.x - observer.x
    const dz = p.z - observer.z
    const dist = Math.hypot(dx, dz)
    let entry = cache.get(key)
    if (!entry) {
      entry = {
        ox: NaN, oy: NaN, oz: NaN, tx: NaN, ty: NaN, tz: NaN,
        revision: -1, contextKey: 'surface', result: 'unknown', phase: stablePhase(key), lastReapplySec: 0,
      }
      cache.set(key, entry)
    }
    let result: SightResult
    if (exempt) {
      result = 'clear'
    } else if (dist > PLAYER_SIGHT_EVAL_RANGE_M) {
      result = 'unknown'
    } else {
      const due = dist < NEAR_TIER_M
        || (dist < MID_TIER_M ? ((frame + entry.phase) & 1) === 0 : ((frame + entry.phase) & 3) === 0)
      const revision = world.blockers.revision()
      const ox = q(observer.x)
      const oy = q(observer.y)
      const oz = q(observer.z)
      const tx = q(p.x)
      const ty = q(p.y)
      const tz = q(p.z)
      const fresh = entry.revision === revision
        && entry.ox === ox && entry.oy === oy && entry.oz === oz
        && entry.tx === tx && entry.ty === ty && entry.tz === tz
      if (fresh) {
        stats.cacheHits++
      } else if (due || entry.revision === -1) {
        const targetContext = input.resolveContextAt(p.x, p.y, p.z)
        const count = writeSamplesFor(agent, animal)
        querySight(world, observer, targetContext, samples, count, PLAYER_SIGHT_EVAL_RANGE_M, out)
        stats.queries++
        entry.ox = ox
        entry.oy = oy
        entry.oz = oz
        entry.tx = tx
        entry.ty = ty
        entry.tz = tz
        entry.revision = revision
        entry.result = out.result
        entry.contextKey = contextKeyOf(targetContext)
      }
      // Not due: keep the last result (staggered mid/far tiers).
      result = entry.result
      stats.evaluated++
    }
    pose.x = p.x
    pose.y = p.y
    pose.z = p.z
    pose.yaw = agent.mesh.rotation.y
    let concealed: boolean
    if (corpse) {
      concealed = result === 'blocked'
      if (concealed) concealedCorpses.add(key)
      else concealedCorpses.delete(key)
    } else {
      concealed = contacts.observe(key, result, pose, variant, entry.contextKey, input.nowSec) === 'concealed'
    }
    if (concealed !== agent.isSightConcealed()) {
      agent.setSightConcealed(concealed)
      entry.lastReapplySec = input.nowSec
    } else if (concealed && input.nowSec - entry.lastReapplySec >= REAPPLY_INTERVAL_SEC) {
      agent.reapplySightConcealment()
      entry.lastReapplySec = input.nowSec
    }
    if (concealed) {
      stats.concealed++
      touched.set(key, agent)
    }
  }

  const writeSamplesFor = (agent: SightAgent, animal: AnimalAgent | null): number => {
    const p = agent.mesh.position
    const yaw = agent.mesh.rotation.y
    if (animal) {
      const h = animal.sightBodyHeight()
      return writeActorSightSamples(samples, p.x, p.y, p.z, yaw, h, h * 0.3, h * 0.6, 'quadruped')
    }
    return writeActorSightSamples(samples, p.x, p.y, p.z, yaw, NPC_HEIGHT, 0.25, 0.15, 'biped')
  }

  /** Alive → dead transition: drop the contact + last-known billboard once
   *  (the evaluation cache entry stays — the corpse keeps its pose). */
  const enterCorpse = (key: string): void => {
    if (corpseKeys.has(key)) return
    corpseKeys.add(key)
    contacts.forget(key)
  }

  /** Dead → alive (resurrection): resume the normal contact path. */
  const leaveCorpse = (key: string): void => {
    if (!corpseKeys.delete(key)) return
    concealedCorpses.delete(key)
  }

  const evalAnimal = (animal: AnimalAgent, input: PlayerSightUpdateInput): void => {
    const key = `animal:${animal.animalId}`
    if (animal.isDead()) {
      // Finalised corpse (root hidden by its lifecycle) — nothing to conceal.
      if (!animal.mesh.visible) return
      enterCorpse(key)
      evaluate(key, animal, 'smallAnimal', false, input, animal, true)
      return
    }
    leaveCorpse(key)
    const small = ANIMAL_SIGHT_BODY_CLASS[animal.def.kind] === 'small'
    evaluate(key, animal, small ? 'smallAnimal' : 'largeAnimal', animal.animalId === input.mountedAnimalId, input, animal)
  }

  const evalNpc = (npc: NpcAgent, input: PlayerSightUpdateInput): void => {
    const key = `npc:${npc.id}`
    if (npc.health.dead) {
      if (!npc.mesh.visible) return
      enterCorpse(key)
      evaluate(key, npc, 'human', false, input, null, true)
      return
    }
    leaveCorpse(key)
    evaluate(key, npc, 'human', npc.id === input.interactingNpcId, input, null)
  }

  const isConcealedKey = (key: string): boolean => contacts.isConcealed(key) || concealedCorpses.has(key)

  const revealAll = (): void => {
    for (const [, agent] of touched) {
      if (agent.isSightConcealed()) agent.setSightConcealed(false)
    }
    touched.clear()
    cache.clear()
    corpseKeys.clear()
    concealedCorpses.clear()
    contacts.clear()
    billboards?.sync(contacts.lastKnown())
  }

  return {
    update(input) {
      if (!enabled) return
      const t0 = performance.now()
      frame++
      stats.evaluated = 0
      stats.queries = 0
      stats.cacheHits = 0
      stats.concealed = 0
      liveIds.clear()
      touched.clear()
      observer.x = input.playerPosition.x
      observer.y = input.playerPosition.y + PLAYER_SIGHT_EYE_HEIGHT_M
      observer.z = input.playerPosition.z
      observer.context = input.playerContext
      for (const settlement of input.settlements) {
        for (const npc of settlement.npcs) evalNpc(npc, input)
        for (const animal of settlement.livestock) evalAnimal(animal, input)
        for (const animal of settlement.rats) evalAnimal(animal, input)
      }
      for (const animal of input.detachedLivestock) evalAnimal(animal, input)
      for (const animal of input.wildFauna) evalAnimal(animal, input)
      if (frame % RETAIN_INTERVAL_FRAMES === 0) {
        contacts.retainOnly(liveIds)
        for (const key of cache.keys()) if (!liveIds.has(key)) cache.delete(key)
        for (const key of corpseKeys) {
          if (liveIds.has(key)) continue
          corpseKeys.delete(key)
          concealedCorpses.delete(key)
        }
      }
      contacts.tick(input.nowSec, input.playerPosition.x, input.playerPosition.z, contextKeyOf(input.playerContext))
      if (contacts.revision() !== lastBillboardRevision) {
        lastBillboardRevision = contacts.revision()
        billboards?.sync(contacts.lastKnown())
      }
      stats.billboards = contacts.lastKnown().length
      stats.cpuMs = performance.now() - t0
    },
    isNpcDisclosed: (npcId) => !enabled || !isConcealedKey(`npc:${npcId}`),
    isAnimalDisclosed: (animalId) => !enabled || !isConcealedKey(`animal:${animalId}`),
    enabled: () => enabled,
    stats: () => stats,
    dispose() {
      revealAll()
      billboards?.dispose()
    },
  }
}

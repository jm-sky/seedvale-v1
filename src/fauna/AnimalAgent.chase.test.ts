// @vitest-environment jsdom
import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import { DRY_WATER_SAMPLE } from '../terrain/waterSample'
import { type Collider, colliderContainsPoint } from '../world/collision'
import { caveSpatialContext, WORLD_SPATIAL_CONTEXT_SURFACE } from '../world/spatialContext'
import { AnimalAgent, type AnimalKind } from './AnimalAgent'
import { ANIMAL_DEFS } from './animalDefs'
import { biteSharesSpatialContext, HUMAN_BITE_MAX_DY, HUMAN_BITE_RANGE } from './humanBite'

/** fauna-051 §A — chase through existing `chaseNav`/`stepNavRescue`, bite contact, closure measurements. */

type Player = (t: number) => { x: number, z: number }
type SimOptions = {
  kind?: AnimalKind
  colliders?: readonly Collider[]
  player: Player
  seconds?: number
  animalId?: string
}
type SimResult = {
  bites: number
  firstBiteSec: number | null
  finalDist: number
  minDist: number
  staminaFraction: number
  inCollider: boolean
  exhaustedAtSec: number | null
}

const DT = 0.05

/** Perception (notice cone/roll) is not under test: hold the predator alert so
 *  `playerActive` stays true and the retaliation/pursuit path is exercised. */
function holdAlert(agent: AnimalAgent): void {
  (agent as unknown as { alertTimer: number }).alertTimer = 5
}

function makeAgent(kind: AnimalKind, animalId: string, colliders: readonly Collider[]): AnimalAgent {
  const agent = new AnimalAgent({
    def: ANIMAL_DEFS[kind],
    animalId,
    sampleHeight: () => 0,
    waterLevel: -10,
    sampleLocalWater: () => DRY_WATER_SAMPLE,
    collidersNear: () => colliders,
    x: 0,
    z: 0,
  })
  // Face +X (forward = (-sin yaw, -cos yaw)) so the player at +X is inside the notice cone.
  agent.mesh.rotation.y = -Math.PI / 2
  // Consume the cadence prime tick (a fresh agent's first update banks 1 s of dt) with no player around.
  agent.update({ dt: DT, others: [agent], observerPos: new THREE.Vector3(1000, 0, 1000), dayFactor: 1, forestFactor: 0, litFires: [] })
  agent.mesh.position.set(0, agent.mesh.position.y, 0)
  return agent
}

function simulate(opts: SimOptions): SimResult {
  const colliders = opts.colliders ?? []
  const wolf = makeAgent(opts.kind ?? 'wolf', opts.animalId ?? 'wolf-chase', colliders)
  const seconds = opts.seconds ?? 20
  let bites = 0
  let firstBiteSec: number | null = null
  let minDist = Infinity
  let inCollider = false
  let exhaustedAtSec: number | null = null
  const staminaOf = () => (wolf as unknown as { life: { stamina: { current: number, max: number } } }).life.stamina
  const observer = new THREE.Vector3()
  // Provoke once so the animal retaliates (provocation window 8 s; re-provoked below).
  for (let t = 0; t < seconds; t += DT) {
    if (Math.abs(t % 6) < DT) wolf.takeDamage(0.01, 'player')
    const p = opts.player(t)
    observer.set(p.x, 0, p.z)
    holdAlert(wolf)
    wolf.update({
      dt: DT,
      others: [wolf],
      observerPos: observer,
      dayFactor: 1,
      forestFactor: 0,
      litFires: [],
      onHumanHit: () => {
        bites++
        firstBiteSec ??= t
      },
    })
    minDist = Math.min(minDist, Math.hypot(p.x - wolf.mesh.position.x, p.z - wolf.mesh.position.z))
    if (exhaustedAtSec === null && staminaOf().current <= 0) exhaustedAtSec = t
    if (colliders.some((c) => colliderContainsPoint(c, wolf.mesh.position.x, wolf.mesh.position.z))) inCollider = true
  }
  const end = opts.player(seconds)
  const stamina = (wolf as unknown as { life: { stamina: { current: number, max: number } } }).life.stamina
  return {
    bites,
    firstBiteSec,
    finalDist: Math.hypot(end.x - wolf.mesh.position.x, end.z - wolf.mesh.position.z),
    minDist,
    staminaFraction: stamina.current / stamina.max,
    inCollider,
    exhaustedAtSec,
  }
}

const standing: Player = () => ({ x: 8, z: 0 })
const walking: Player = (t) => ({ x: 8 + 6 * t, z: 0 })
const sprinting: Player = (t) => ({ x: 8 + 10.8 * t, z: 0 })

describe('human chase bite contact (fauna-051 §A)', () => {
  it('uses a human-bite constant of its own (centre-to-centre 0.8 m)', () => {
    expect(HUMAN_BITE_RANGE).toBe(0.8)
  })

  it('bites a standing human, bounded by the 0.6 s cooldown', () => {
    const r = simulate({ player: standing, seconds: 6 })
    expect(r.firstBiteSec).not.toBeNull()
    expect(r.bites).toBeGreaterThan(0)
    expect(r.bites).toBeLessThanOrEqual(Math.floor((6 - (r.firstBiteSec ?? 0)) / 0.6) + 1)
  })

  it('never lands a bite on a sprinting human it cannot catch', () => {
    const r = simulate({ player: sprinting, seconds: 12 })
    expect(r.bites).toBe(0)
    expect(r.finalDist).toBeGreaterThan(HUMAN_BITE_RANGE)
  })

  it('routes around a wall between wolf and standing player and bites without entering the collider', () => {
    const wall: Collider = { type: 'obb', x: 4, z: 0, halfWidth: 1.5, halfDepth: 2.5, rotationY: 0 }
    const r = simulate({ player: standing, seconds: 25, colliders: [wall] })
    if (process.env.SEEDVALE_CHASE_REPORT) process.stdout.write(`wall: ${JSON.stringify(r)}\n`)
    expect(r.inCollider).toBe(false)
    expect(r.bites).toBeGreaterThan(0)
  })

  it('is deterministic for identical inputs', () => {
    expect(simulate({ player: walking, seconds: 3 })).toEqual(simulate({ player: walking, seconds: 3 }))
  })

  it('claims chaseNav for the player and releases it on hydrate', () => {
    const wolf = makeAgent('wolf', 'wolf-release', [])
    const internals = wolf as unknown as { humanChaseNavKey: string | null }
    wolf.takeDamage(1, 'player')
    holdAlert(wolf)
    wolf.update({ dt: DT, others: [wolf], observerPos: new THREE.Vector3(10, 0, 0), dayFactor: 1, forestFactor: 0, litFires: [] })
    expect(internals.humanChaseNavKey).toBe('player')
    wolf.hydrate(wolf.snapshot())
    expect(internals.humanChaseNavKey).toBeNull()
  })

  it('releases chaseNav when the branch changes away from the chase', () => {
    const wolf = makeAgent('wolf', 'wolf-release-2', [])
    const internals = wolf as unknown as { humanChaseNavKey: string | null }
    wolf.takeDamage(1, 'player')
    holdAlert(wolf)
    wolf.update({ dt: DT, others: [wolf], observerPos: new THREE.Vector3(10, 0, 0), dayFactor: 1, forestFactor: 0, litFires: [] })
    expect(internals.humanChaseNavKey).toBe('player')
    // Player far away and provocation expired: the chase branch ends.
    for (let i = 0; i < 400; i++) {
      wolf.update({ dt: 0.1, others: [wolf], observerPos: new THREE.Vector3(1000, 0, 1000), dayFactor: 1, forestFactor: 0, litFires: [] })
    }
    expect(internals.humanChaseNavKey).toBeNull()
  })
})

describe('chaseNav target ownership (fauna-051 §A1)', () => {
  type NavInternals = {
    chaseNav: { active: boolean, waypoints: { x: number, z: number }[], index: number }
    bindHumanChaseNav: (key: string) => void
    releaseHumanChaseNav: () => void
  }
  const arm = (n: NavInternals) => {
    n.chaseNav.active = true
    n.chaseNav.waypoints = [{ x: 1, z: 1 }]
  }

  it('drops a route computed for another target when the target changes', () => {
    const n = makeAgent('wolf', 'wolf-nav', []) as unknown as NavInternals
    n.bindHumanChaseNav('npc-a')
    arm(n)
    n.bindHumanChaseNav('npc-a')
    expect(n.chaseNav.active).toBe(true)
    n.bindHumanChaseNav('npc-b')
    expect(n.chaseNav.active).toBe(false)
  })

  it('drops a leftover prey-hunt route when a human chase begins, and on release', () => {
    const n = makeAgent('wolf', 'wolf-nav-2', []) as unknown as NavInternals
    arm(n)
    n.bindHumanChaseNav('player')
    expect(n.chaseNav.active).toBe(false)
    arm(n)
    n.releaseHumanChaseNav()
    expect(n.chaseNav.active).toBe(false)
  })
})

describe('attack-time spatial bite check (fauna-051 §A3)', () => {
  const surface = () => WORLD_SPATIAL_CONTEXT_SURFACE
  it('allows same-context bites', () => {
    expect(biteSharesSpatialContext(surface, { x: 0, y: 0, z: 0 }, { x: 0.5, y: 0.3, z: 0 })).toBe(true)
  })
  it('rejects a bite across surface and cave at the same XZ', () => {
    const resolver = (_x: number, y: number) => (y < -5 ? caveSpatialContext('c1') : WORLD_SPATIAL_CONTEXT_SURFACE)
    expect(biteSharesSpatialContext(resolver, { x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 })).toBe(true)
    expect(biteSharesSpatialContext(resolver, { x: 0, y: -4.5, z: 0 }, { x: 0, y: -5.5, z: 0 })).toBe(false)
  })
  it('rejects different caves and large vertical separation (bridge)', () => {
    const byX = (x: number) => caveSpatialContext(x < 0 ? 'a' : 'b')
    expect(biteSharesSpatialContext(byX, { x: -1, y: 0, z: 0 }, { x: 1, y: 0, z: 0 })).toBe(false)
    expect(biteSharesSpatialContext(surface, { x: 0, y: 0, z: 0 }, { x: 0, y: HUMAN_BITE_MAX_DY + 0.1, z: 0 })).toBe(false)
  })
})

describe('closure measurements (fauna-051 §A2); printed with SEEDVALE_CHASE_REPORT=1', () => {
  it('reports closure for standing / walking / sprinting players', () => {
    const rows: string[] = []
    for (const kind of ['wolf', 'bear'] as const) {
      for (const [name, player] of [['standing', standing], ['walking 6 m/s', walking], ['sprinting 10.8 m/s', sprinting]] as const) {
        const r = simulate({ kind, player, seconds: 20 })
        rows.push(`${kind} vs ${name}: bites=${r.bites} firstBite=${r.firstBiteSec?.toFixed(2) ?? '-'}s minDist=${r.minDist.toFixed(2)} finalDist=${r.finalDist.toFixed(2)} stamina=${(r.staminaFraction * 100).toFixed(0)}% exhaustedAt=${r.exhaustedAtSec?.toFixed(1) ?? '-'}s`)
      }
    }
    if (process.env.SEEDVALE_CHASE_REPORT) process.stdout.write(`${rows.join('\n')}\n`)
    expect(rows).toHaveLength(6)
  })
})

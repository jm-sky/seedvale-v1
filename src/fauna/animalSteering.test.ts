// @vitest-environment jsdom
import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import { DRY_WATER_SAMPLE } from '../terrain/waterSample'
import { AnimalAgent, type AnimalAgentDeps } from './AnimalAgent'
import { ANIMAL_DEFS } from './animalDefs'
import { ANIMAL_TURN_RATE_RAD_PER_SEC, shortestYawDelta, turnYawToward } from './animalSteering'

function makeDeps(overrides: Partial<AnimalAgentDeps> = {}): AnimalAgentDeps {
  return {
    def: ANIMAL_DEFS.horse,
    animalId: 'steer-horse',
    sampleHeight: () => 0,
    waterLevel: -10,
    sampleLocalWater: () => DRY_WATER_SAMPLE,
    collidersNear: () => [],
    x: 0,
    z: 0,
    ...overrides,
  }
}

type Priv = {
  steerToward: (dest: THREE.Vector3, speed: number, dt: number) => void
  isWalkable: (x: number, z: number) => boolean
  moving: boolean
  target: THREE.Vector3
  wanderTimer: number
}

const priv = (a: AnimalAgent) => a as unknown as Priv

describe('animalSteering helpers', () => {
  it('shortestYawDelta wraps across ±π', () => {
    expect(shortestYawDelta(Math.PI - 0.1, -Math.PI + 0.1)).toBeCloseTo(0.2)
    expect(shortestYawDelta(0, Math.PI * 2)).toBeCloseTo(0)
  })

  it('turnYawToward never turns by more than maxDelta and reaches small deltas exactly', () => {
    expect(turnYawToward(0, Math.PI, 0.3)).toBeCloseTo(0.3)
    expect(turnYawToward(0, -Math.PI / 2, 0.3)).toBeCloseTo(-0.3)
    expect(turnYawToward(0, 0.1, 0.3)).toBeCloseTo(0.1)
  })
})

describe('AnimalAgent.steerToward (fauna oscillation fix)', () => {
  it('a fully blocked step neither reports moving nor rotates the body', () => {
    const horse = new AnimalAgent(makeDeps())
    priv(horse).isWalkable = () => false
    horse.mesh.rotation.y = 0.7
    // Alternating targets on opposite sides used to flip the yaw every tick.
    for (let i = 0; i < 20; i++) {
      priv(horse).steerToward(new THREE.Vector3(i % 2 ? 10 : -10, 0, 0), 2, 1 / 60)
      expect(priv(horse).moving).toBe(false)
    }
    expect(horse.mesh.rotation.y).toBe(0.7)
    expect(horse.mesh.position.x).toBe(0)
  })

  it('an unblocked step moves, reports moving and turns at a bounded rate', () => {
    const horse = new AnimalAgent(makeDeps())
    horse.mesh.rotation.y = 0
    const dt = 1 / 60
    priv(horse).steerToward(new THREE.Vector3(-10, 0, 0), 2, dt) // behind-left: ~-90°
    expect(priv(horse).moving).toBe(true)
    expect(horse.mesh.position.x).toBeLessThan(0)
    expect(Math.abs(horse.mesh.rotation.y)).toBeCloseTo(ANIMAL_TURN_RATE_RAD_PER_SEC * dt, 5)
  })

  it('a target flipping every tick wobbles by at most one turn step, never a 180° snap', () => {
    const horse = new AnimalAgent(makeDeps())
    const dt = 1 / 60
    let prev = horse.mesh.rotation.y
    for (let i = 0; i < 60; i++) {
      priv(horse).steerToward(new THREE.Vector3(i % 2 ? 50 : -50, 0, 0), 2, dt)
      const step = Math.abs(shortestYawDelta(prev, horse.mesh.rotation.y))
      expect(step).toBeLessThanOrEqual(ANIMAL_TURN_RATE_RAD_PER_SEC * dt + 1e-9)
      prev = horse.mesh.rotation.y
    }
  })

  it('a large behaviour dt still completes a re-aim in one step (cadence-throttled animals)', () => {
    const horse = new AnimalAgent(makeDeps())
    horse.mesh.rotation.y = Math.PI
    priv(horse).steerToward(new THREE.Vector3(0, 0, 20), 2, 0.5)
    expect(shortestYawDelta(horse.mesh.rotation.y, 0)).toBeCloseTo(0, 5)
  })
})

describe('AnimalAgent area bound vs wander (fauna oscillation fix)', () => {
  const paddockStay = {
    settlementId: 'home',
    slotIndex: 0,
    x: 0,
    z: 0,
    radius: 10,
    entranceX: 10,
    entranceZ: 0,
    entranceWidth: 2.4,
    hayX: -3,
    hayZ: 3,
  }

  it('a paddock horse pushed back by the leash reports idle, keeps its facing and re-picks its wander target', () => {
    const horse = new AnimalAgent(makeDeps({ animalId: 'paddock-horse', paddockStay }))
    horse.life.hunger = 0
    horse.life.thirst = 0
    horse.mesh.position.set(0, 0, 10)
    horse.mesh.rotation.y = 0.3
    priv(horse).target.set(0, 0, 40) // outside the fence
    priv(horse).wanderTimer = 100
    horse.update({
      dt: 1,
      others: [],
      observerPos: new THREE.Vector3(1000, 0, 1000),
      dayFactor: 1,
      forestFactor: 0,
      litFires: [],
    })
    expect(Math.hypot(horse.mesh.position.x, horse.mesh.position.z)).toBeLessThanOrEqual(10 + 1e-6)
    expect(horse.getDebugInfo().moving).toBe(false)
    expect(horse.mesh.rotation.y).toBeCloseTo(0.3, 6)
    expect(priv(horse).wanderTimer).toBeLessThan(100) // retargeted (re-picked in-band) instead of pushing again
  })
})

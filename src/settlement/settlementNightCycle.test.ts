import * as THREE from 'three'
import { describe, expect, it, vi } from 'vitest'
import { createHouseLight } from './houseLighting'
import {
  createSettlementNightCycle,
  NIGHT_FIRE_THRESHOLD,
  shouldAutoLightNightFire,
} from './settlementNightCycle'

/** Minimal lantern with the real GLB material names (`ElwFor_Lantern_*`) — no disk/DOM needed. */
function makeGlbLantern(): THREE.Group {
  const g = new THREE.Group()
  for (const [name, color] of [['ElwFor_Lantern_Brown', 0x4b3319], ['ElwFor_Lantern_Light', 0xffc20a]] as const) {
    const mat = new THREE.MeshStandardMaterial({ name, color })
    mat.userData.sharedGpu = true
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), mat))
  }
  return g
}

function fakeFire(initiallyLit: boolean) {
  let lit = initiallyLit
  const light = vi.fn((_source?: string) => {
    lit = true
  })
  return {
    isLit: () => lit,
    light,
  } as unknown as import('./VillageFire').VillageFire
}

function fakeTorch() {
  return { setLit: vi.fn(), isLit: () => false } as unknown as import('./props').VillageTorch
}

function fakeTorchEntry(id = 'settlement:village-torch:test', torch = fakeTorch()) {
  return { id, torch }
}

function fakeHouseLight() {
  return { setNightIntensity: vi.fn() } as unknown as import('./props').HouseLight
}

describe('shouldAutoLightNightFire', () => {
  it('is stable for a fixed (seed, nightIndex, size) and varies across nightIndex', () => {
    const a = shouldAutoLightNightFire(12345, 1, 'XL')
    const b = shouldAutoLightNightFire(12345, 1, 'XL')
    expect(a).toBe(b)

    const results = new Set<boolean>()
    for (let i = 1; i <= 20; i++) results.add(shouldAutoLightNightFire(12345, i, 'MD'))
    expect(results.size).toBe(2)
  })

  it('OUTPOST/SM never light, XL always lights', () => {
    for (let i = 1; i <= 10; i++) {
      expect(shouldAutoLightNightFire(999, i, 'OUTPOST')).toBe(false)
      expect(shouldAutoLightNightFire(999, i, 'SM')).toBe(false)
      expect(shouldAutoLightNightFire(999, i, 'XL')).toBe(true)
    }
  })
})

describe('createSettlementNightCycle', () => {
  it('rolls fire autolight and toggles torches exactly on the upward crossing of the threshold', () => {
    const fire = fakeFire(false)
    const torch = fakeTorch()
    const cycle = createSettlementNightCycle({
      settlementSeed: 1,
      size: 'XL',
      fire,
      villageTorches: [fakeTorchEntry('t1', torch)],
      houseLights: [],
    })

    cycle.apply(NIGHT_FIRE_THRESHOLD - 0.1)
    expect(torch.setLit).not.toHaveBeenCalled()
    expect(fire.light).not.toHaveBeenCalled()

    cycle.apply(NIGHT_FIRE_THRESHOLD + 0.1)
    expect(torch.setLit).toHaveBeenCalledTimes(1)
    expect(torch.setLit).toHaveBeenCalledWith(true)
    expect(fire.light).toHaveBeenCalledTimes(1)
    expect(fire.light).toHaveBeenCalledWith('night')

    cycle.apply(NIGHT_FIRE_THRESHOLD + 0.2)
    expect(torch.setLit).toHaveBeenCalledTimes(1)
    expect(fire.light).toHaveBeenCalledTimes(1)
  })

  it('extinguishes torches exactly on the downward crossing', () => {
    const torch = fakeTorch()
    const cycle = createSettlementNightCycle({
      settlementSeed: 1,
      size: 'MD',
      fire: undefined,
      villageTorches: [fakeTorchEntry('t1', torch)],
      houseLights: [],
    })

    cycle.apply(NIGHT_FIRE_THRESHOLD + 0.1)
    expect(torch.setLit).toHaveBeenCalledWith(true)

    cycle.apply(NIGHT_FIRE_THRESHOLD - 0.1)
    expect(torch.setLit).toHaveBeenCalledWith(false)
    expect(torch.setLit).toHaveBeenCalledTimes(2)
  })

  it('applies house-light intensity on every call', () => {
    const light = fakeHouseLight()
    const cycle = createSettlementNightCycle({
      settlementSeed: 1,
      size: 'SM',
      fire: undefined,
      villageTorches: [],
      houseLights: [light],
    })

    cycle.apply(0.2)
    cycle.apply(0.8)
    expect(light.setNightIntensity).toHaveBeenNthCalledWith(1, 0.2)
    expect(light.setNightIntensity).toHaveBeenNthCalledWith(2, 0.8)
  })

  it('does not re-roll an already-lit fire', () => {
    const fire = fakeFire(true)
    const cycle = createSettlementNightCycle({
      settlementSeed: 1,
      size: 'XL',
      fire,
      villageTorches: [],
      houseLights: [],
    })
    cycle.apply(NIGHT_FIRE_THRESHOLD - 0.1)
    cycle.apply(NIGHT_FIRE_THRESHOLD + 0.1)
    expect(fire.light).not.toHaveBeenCalled()
  })
})

describe('createSettlementNightCycle + real house lamps (IMP-009)', () => {
  const lampState = (l: import('./props').HouseLight) => {
    const lights: THREE.PointLight[] = []
    let glass: THREE.Material | null = null
    l.object.traverse((o) => {
      if ((o as THREE.PointLight).isPointLight) lights.push(o as THREE.PointLight)
      const m = o as THREE.Mesh
      if (m.isMesh && (m.material as THREE.Material).name.endsWith('_Light')) glass = m.material as THREE.Material
    })
    return { lights, glass: glass as THREE.MeshStandardMaterial | null }
  }

  it('flips the lamp in one step at the threshold, with no fade (t=0.6 off, 0.61 on)', () => {
    const lamp = createHouseLight(1, 1, 0, 'wall', makeGlbLantern())
    const cycle = createSettlementNightCycle({ settlementSeed: 1, size: 'SM', fire: undefined, villageTorches: [], houseLights: [lamp] })
    const seen: number[] = []
    for (const t of [0, 0.5, 0.6, 0.61, 1, 0.6, 0.3]) {
      cycle.apply(t)
      const { lights, glass } = lampState(lamp)
      const on = t > NIGHT_FIRE_THRESHOLD
      for (const l of lights) expect(l.visible).toBe(on)
      expect(lights.every((l) => (l.intensity > 0) === on)).toBe(true)
      expect(glass!.emissiveIntensity > 0).toBe(on)
      if (on) seen.push(...lights.map((l) => l.intensity))
    }
    // t=0.61 and t=1 give identical intensities
    expect(seen.slice(0, 2)).toEqual(seen.slice(2, 4))
  })
})

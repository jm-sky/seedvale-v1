import * as THREE from 'three'
import { describe, expect, it } from 'vitest'
import { disposeObject3D } from '../assets/loadGltf'
import { createHouseLight } from './houseLighting'

function lantern(): THREE.Group {
  const g = new THREE.Group()
  for (const [name, color] of [['ElwFor_Lantern_Grey', 0x3d3d3d], ['ElwFor_Lantern_Light', 0xffc20a]] as const) {
    const m = new THREE.MeshStandardMaterial({ name, color })
    m.userData.sharedGpu = true
    g.add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), m))
  }
  return g
}

const glassOf = (root: THREE.Object3D) => {
  let out: THREE.MeshStandardMaterial | null = null
  root.traverse((o) => {
    const m = o as THREE.Mesh
    if (m.isMesh && (m.material as THREE.Material).name.endsWith('_Light')) out = m.material as THREE.MeshStandardMaterial
  })
  return out as unknown as THREE.MeshStandardMaterial
}
const lightsOf = (root: THREE.Object3D) => {
  const out: THREE.PointLight[] = []
  root.traverse((o) => { if ((o as THREE.PointLight).isPointLight) out.push(o as THREE.PointLight) })
  return out
}

describe('createHouseLight two-state contract (IMP-009)', () => {
  it('starts extinguished: dark glass, hidden lights', () => {
    const l = createHouseLight(1, 1, 0, 'wall', lantern())
    expect(glassOf(l.object).emissiveIntensity).toBe(0)
    expect(lightsOf(l.object).every((p) => !p.visible && p.intensity === 0)).toBe(true)
  })

  it.each([[0, false], [0.5, false], [0.6, false], [0.61, true], [1, true]])('t=%s lit=%s', (t, lit) => {
    const l = createHouseLight(1, 1, 0, 'wall', lantern())
    l.setNightIntensity(t)
    expect(glassOf(l.object).emissiveIntensity > 0).toBe(lit)
    for (const p of lightsOf(l.object)) {
      expect(p.visible).toBe(lit)
      expect(p.intensity > 0).toBe(lit)
    }
  })

  it('keeps the previous lit intensities and snaps back off without interpolation', () => {
    const l = createHouseLight(1, 1, 0, 'wall', lantern())
    l.setNightIntensity(0.61)
    const a = lightsOf(l.object).map((p) => p.intensity)
    l.setNightIntensity(1)
    expect(lightsOf(l.object).map((p) => p.intensity)).toEqual(a)
    expect(a.sort()).toEqual([2, 2.5])
    l.setNightIntensity(0.6)
    expect(lightsOf(l.object).every((p) => p.intensity === 0 && !p.visible)).toBe(true)
  })

  it('never mutates the shared template material; lamps swap shared on/off materials', () => {
    const tpl = lantern()
    const tplGlass = glassOf(tpl)
    const before = tplGlass.clone()
    const a = createHouseLight(1, 1, 0, 'wall', tpl)
    const b = createHouseLight(1, -1, 0, 'wall', tpl)
    a.setNightIntensity(1)
    expect(glassOf(a.object).emissiveIntensity).toBeGreaterThan(0)
    expect(glassOf(b.object).emissiveIntensity).toBe(0) // other instance unaffected
    expect(tplGlass.color.getHex()).toBe(before.color.getHex())
    expect(tplGlass.emissiveIntensity).toBe(before.emissiveIntensity)
    expect(glassOf(a.object)).not.toBe(tplGlass)
    disposeObject3D(a.object) // template + shared pair are sharedGpu → must not throw or free
    expect(glassOf(b.object).userData.sharedGpu).toBe(true)
  })

  it('procedural fallback switches the box lamp colour between two states', () => {
    const l = createHouseLight(1, 0, 2, 'wall', null)
    const lampColor = () => {
      let c = 0
      l.object.traverse((o) => {
        const m = o as THREE.Mesh
        if (m.isMesh && (m.material as THREE.MeshBasicMaterial).color.getHex() !== 0x6b4226) c = (m.material as THREE.MeshBasicMaterial).color.getHex()
      })
      return c
    }
    const off = lampColor()
    l.setNightIntensity(0.61)
    const on = lampColor()
    expect(on).not.toBe(off)
    l.setNightIntensity(1)
    expect(lampColor()).toBe(on)
    l.setNightIntensity(0.6)
    expect(lampColor()).toBe(off)
    expect(lightsOf(l.object).every((p) => !p.visible)).toBe(true)
  })
})

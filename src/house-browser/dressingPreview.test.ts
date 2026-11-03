import { describe, expect, it } from 'vitest'
import type { Role } from '../ai/characters'
import { HOME_HOUSE_DEFINITIONS } from '../assets/houseDefinitionExample'
import { householdYardPlanFor } from '../settlement/householdYard'
import { professionDressingFor } from '../settlement/professionDressing'
import { buildPreviewFamily, previewPlacements } from './dressingPreview'
import { HOUSE_BROWSER_PROFESSIONS } from './houseBrowserTypes'
import { defaultLampFor } from './lampPreview'

const ROLES = HOUSE_BROWSER_PROFESSIONS.filter((p) => p !== 'none') as Role[] & string[]

describe('dressing preview', () => {
  it('matches the game algorithm with the definition lamp and is deterministic', () => {
    for (const def of HOME_HOUSE_DEFINITIONS) {
      const lamp = defaultLampFor(def)
      for (const role of ROLES) {
        const yard = householdYardPlanFor(def.footprint, 0, 0, 0, 'MD', 1)
        const direct = professionDressingFor(buildPreviewFamily(role), 0, def, yard, 1)
        const a = previewPlacements(def, role as never, lamp)
        expect(a).toEqual(direct)
        expect(previewPlacements(def, role as never, lamp)).toEqual(a)
      }
    }
  })

  it('does not mutate the shared definition when overriding the lamp', () => {
    const def = HOME_HOUSE_DEFINITIONS[0]!
    const before = JSON.stringify(def.lamp)
    previewPlacements(def, 'guard', { x: 1, y: 2, z: -3, style: 'wall', yawDeg: null })
    previewPlacements(def, 'guard', null)
    expect(JSON.stringify(def.lamp)).toBe(before)
  })

  it('lamp defaults come from the definition', () => {
    for (const def of HOME_HOUSE_DEFINITIONS) {
      const d = defaultLampFor(def)
      if (def.lamp) {
        expect([d.x, d.y, d.z, d.style]).toEqual([def.lamp.mount.x, def.lamp.mount.y, def.lamp.mount.z, def.lamp.style])
      }
      expect(Number.isFinite(d.x + d.y + d.z)).toBe(true)
    }
  })
})

describe('cottage-6x4-b lamp', () => {
  it('uses the hand-tuned mount and front-facing yaw', () => {
    const def = HOME_HOUSE_DEFINITIONS.find((d) => d.id === 'cottage-6x4-b')!
    expect(defaultLampFor(def)).toEqual({ x: -2, y: 2.51, z: -2.22, style: 'wall', yawDeg: 180 })
  })
})

import { describe, expect, it } from 'vitest'
import {
  BLACKSMITH_CHAINMAIL_PRODUCTION,
  BLACKSMITH_IRON_ROD_PRODUCTION,
  BLACKSMITH_KNIFE_PRODUCTION,
  BLACKSMITH_BATTLE_AXE_PRODUCTION,
  BLACKSMITH_MASTERWORK_SWORD_PRODUCTION,
} from '../economy/production'
import { Inventory } from '../items/Inventory'
import {
  artisanCanCraft,
  artisanMaterialDepositValue,
  missingArtisanMaterials,
  resolveArtisanCraft,
  resolveArtisanCraftedQuality,
} from './artisanCraft'
import type { ArtisanProfile } from './artisanProfile'
import { ARTISAN_SPECIALIZATION_BONUS, effectiveArtisanSkill } from './artisanProfile'

function profile(overrides: Partial<ArtisanProfile> = {}): ArtisanProfile {
  return {
    baseSkill: 50,
    experience: 0,
    specializations: [],
    exclusive: false,
    ...overrides,
  }
}

describe('artisan craft capability (plan settlements-npcs-056)', () => {
  it('blocks recipes below minSkill', () => {
    const novice = profile({ baseSkill: 16 })
    expect(artisanCanCraft(novice, BLACKSMITH_KNIFE_PRODUCTION)).toBe(false)
    expect(resolveArtisanCraft(novice, BLACKSMITH_KNIFE_PRODUCTION).reason).toBe('insufficient-skill')
  })

  it('allows baseline recipes when skill is enough, even without the matching spec', () => {
    const smith = profile({ baseSkill: 50, specializations: ['armor'] })
    expect(artisanCanCraft(smith, BLACKSMITH_KNIFE_PRODUCTION)).toBe(true)
    expect(resolveArtisanCraft(smith, BLACKSMITH_KNIFE_PRODUCTION).prefersToCraft).toBe(false)
  })

  it('gates exclusive recipes only for exclusive specialists of another category', () => {
    const exclusiveArmor = profile({
      baseSkill: 80,
      specializations: ['armor'],
      exclusive: true,
    })
    expect(artisanCanCraft(exclusiveArmor, BLACKSMITH_CHAINMAIL_PRODUCTION)).toBe(true)
    expect(artisanCanCraft(exclusiveArmor, BLACKSMITH_BATTLE_AXE_PRODUCTION)).toBe(false)
    expect(resolveArtisanCraft(exclusiveArmor, BLACKSMITH_BATTLE_AXE_PRODUCTION).reason)
      .toBe('exclusive-gate')

    const generalist = profile({ baseSkill: 90, specializations: ['armor'], exclusive: false })
    expect(artisanCanCraft(generalist, BLACKSMITH_MASTERWORK_SWORD_PRODUCTION)).toBe(true)
  })

  it('matching specialization raises effective skill used for the recipe', () => {
    const smith = profile({ baseSkill: 40, specializations: ['swords'] })
    const craft = resolveArtisanCraft(smith, BLACKSMITH_KNIFE_PRODUCTION)
    expect(craft.effectiveSkill).toBe(effectiveArtisanSkill(smith, 'swords'))
    expect(craft.effectiveSkill).toBe(40 + ARTISAN_SPECIALIZATION_BONUS)
    expect(craft.prefersToCraft).toBe(true)
  })
})

describe('artisan quality (plan settlements-npcs-056)', () => {
  it('is stable for a given event identity', () => {
    const a = resolveArtisanCraftedQuality({ effectiveSkill: 72, difficulty: 45, eventId: 'order:1' })
    const b = resolveArtisanCraftedQuality({ effectiveSkill: 72, difficulty: 45, eventId: 'order:1' })
    expect(a).toBe(b)
  })

  it('shifts toward better quality as effective skill rises', () => {
    const tally = (skill: number) => {
      let score = 0
      for (let i = 0; i < 120; i++) {
        const quality = resolveArtisanCraftedQuality({
          effectiveSkill: skill,
          difficulty: 50,
          eventId: `q:${i}`,
        })
        score += quality === 'masterwork' ? 3 : quality === 'good' ? 2 : quality === 'common' ? 1 : 0
      }
      return score
    }
    expect(tally(90)).toBeGreaterThan(tally(25))
  })
})

describe('artisan material deposit', () => {
  it('equals current tradeValue of required inputs', () => {
    expect(artisanMaterialDepositValue(BLACKSMITH_IRON_ROD_PRODUCTION)).toBe(2 * 6 + 4)
    expect(artisanMaterialDepositValue(BLACKSMITH_KNIFE_PRODUCTION)).toBe(6 + 4)
  })

  it('reports missing stock and item inputs without mutating owners', () => {
    const inventory = new Inventory({ iron_rod: 0 })
    const missing = missingArtisanMaterials(
      BLACKSMITH_IRON_ROD_PRODUCTION,
      () => 0,
      inventory,
    )
    expect(missing).toEqual([
      { kind: 'iron', amount: 2, have: 0, owner: 'stock' },
      { kind: 'coal', amount: 1, have: 0, owner: 'stock' },
    ])
    expect(inventory.count('iron_rod')).toBe(0)
  })
})

import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PLAYER_UBC_ANIMATION_URL, PLAYER_UBC_PEASANT_URL, PLAYER_UBC_RANGER_URL, PLAYER_UBC_WIZARD_URL } from '../player/playerVisualPreset'
import {
  NPC_CLOTHING_HUE,
  NPC_HAIR_COLOR,
  NPC_UBC_BEARD_URL,
  NPC_UBC_FEMALE_PEASANT_URL,
  NPC_UBC_FEMALE_RANGER_URL,
  NPC_UBC_FEMALE_WIZARD_URL,
  NPC_UBC_HAIR_1_URL,
  NPC_UBC_HAIR_2_URL,
  NPC_UBC_HAIR_LONG_URL,
  NPC_UBC_HAIR_SIMPLE_URL,
  NPC_UBC_KNIGHT_TINT_URL,
  NPC_UBC_MALE_BLACKSMITH_URL,
  NPC_UBC_MALE_KNIGHT_UNHELMETED_URL,
  NPC_UBC_MALE_WOODCUTTER_URL,
  NPC_UBC_PEASANT_TINT_URL,
  NPC_UBC_RANGER_TINT_URL,
  NPC_UBC_WIZARD_TINT_URL,
  NPC_UBC_WOODCUTTER_TINT_URL,
  resolveNpcAppearance,
  ubcVariantModelUrl,
} from './npcAppearance'

const ANNA = 'home:npc:0'
const PIOTR = 'home:npc:1'
const KASIA = 'home:npc:2'

describe('resolveNpcAppearance', () => {
  it('maps adult farmer to Peasant UBC and adult male woodcutter to custom GLB', () => {
    const anna = resolveNpcAppearance({
      age: 34,
      gender: 'female',
      npcId: ANNA,
      role: 'farmer',
      treeIndex: 0,
    })
    expect(anna.outfit).toBe('peasant')
    expect(anna.modelUrl).toMatch(/female_peasant/)
    expect(anna.animationUrl).toBe(PLAYER_UBC_ANIMATION_URL)
    expect(anna.tintUrl).toBe(NPC_UBC_PEASANT_TINT_URL)
    expect(Object.values(NPC_HAIR_COLOR)).toContain(anna.hairColor)
    expect(Object.values(NPC_CLOTHING_HUE)).toContain(anna.clothingHue)

    const piotr = resolveNpcAppearance({
      age: 36,
      gender: 'male',
      npcId: PIOTR,
      role: 'woodcutter',
      treeIndex: 1,
    })
    expect(piotr.outfit).toBe('peasant')
    expect(piotr.modelUrl).toBe(NPC_UBC_MALE_WOODCUTTER_URL)
    expect(piotr.animationUrl).toBe(PLAYER_UBC_ANIMATION_URL)
    expect(piotr.tintUrl).toBeNull()
    expect(piotr.clothingHue).toBe(NPC_CLOTHING_HUE.identity)
    expect(Object.values(NPC_HAIR_COLOR)).toContain(piotr.hairColor)
  })

  it('maps adult male blacksmith/woodcutter to custom GLBs without outfit tint', () => {
    const smith = resolveNpcAppearance({
      age: 40,
      gender: 'male',
      npcId: 'forge:npc:1',
      role: 'blacksmith',
      treeIndex: 1,
    })
    expect(smith.outfit).toBe('peasant')
    expect(smith.modelUrl).toBe(NPC_UBC_MALE_BLACKSMITH_URL)
    expect(smith.animationUrl).toBe(PLAYER_UBC_ANIMATION_URL)
    expect(smith.tintUrl).toBeNull()
    expect(smith.clothingHue).toBe(NPC_CLOTHING_HUE.identity)
    expect(Object.values(NPC_HAIR_COLOR)).toContain(smith.hairColor)
    expect(['bald', 'simple']).toContain(smith.hair)
    expect(typeof smith.beard).toBe('boolean')

    const cutter = resolveNpcAppearance({
      age: 38,
      gender: 'male',
      npcId: 'woods:npc:2',
      role: 'woodcutter',
      treeIndex: 2,
    })
    expect(cutter.outfit).toBe('peasant')
    expect(cutter.modelUrl).toBe(NPC_UBC_MALE_WOODCUTTER_URL)
    expect(cutter.animationUrl).toBe(PLAYER_UBC_ANIMATION_URL)
    expect(cutter.tintUrl).toBeNull()
    expect(cutter.clothingHue).toBe(NPC_CLOTHING_HUE.identity)
    expect(Object.values(NPC_HAIR_COLOR)).toContain(cutter.hairColor)
    expect(['simple', 'long']).toContain(cutter.hair)
  })

  it('keeps female blacksmith/woodcutter on Peasant UBC with role sidecars', () => {
    const smith = resolveNpcAppearance({
      age: 35,
      gender: 'female',
      npcId: 'forge:npc:3',
      role: 'blacksmith',
      treeIndex: 3,
    })
    expect(smith.outfit).toBe('peasant')
    expect(smith.modelUrl).toMatch(/female_peasant/)
    expect(smith.modelUrl).not.toBe(NPC_UBC_MALE_BLACKSMITH_URL)
    expect(smith.tintUrl).toBe(NPC_UBC_PEASANT_TINT_URL)
    expect(smith.hairAttachmentUrl).toBeNull()
    expect(smith.beardAttachmentUrl).toBeNull()
    expect(Object.values(NPC_CLOTHING_HUE)).toContain(smith.clothingHue)

    const cutter = resolveNpcAppearance({
      age: 33,
      gender: 'female',
      npcId: 'woods:npc:4',
      role: 'woodcutter',
      treeIndex: 4,
    })
    expect(cutter.outfit).toBe('peasant')
    expect(cutter.modelUrl).toMatch(/female_peasant/)
    expect(cutter.modelUrl).not.toBe(NPC_UBC_MALE_WOODCUTTER_URL)
    expect(cutter.tintUrl).toBe(NPC_UBC_WOODCUTTER_TINT_URL)
    expect(cutter.hairAttachmentUrl).toBeNull()
    expect(cutter.beardAttachmentUrl).toBeNull()
  })

  it('keeps child blacksmith/woodcutter on Peasant UBC fallback', () => {
    const childSmith = resolveNpcAppearance({
      age: 12,
      gender: 'male',
      npcId: 'forge:npc:child',
      role: 'blacksmith',
      treeIndex: 0,
    })
    expect(childSmith.outfit).toBe('peasant')
    expect(childSmith.modelUrl).toMatch(/peasant/)
    expect(childSmith.modelUrl).not.toBe(NPC_UBC_MALE_BLACKSMITH_URL)
    expect(childSmith.tintUrl).toBe(NPC_UBC_PEASANT_TINT_URL)
    expect(childSmith.hairAttachmentUrl).toBeNull()
    expect(childSmith.beardAttachmentUrl).toBeNull()

    const childCutter = resolveNpcAppearance({
      age: 10,
      gender: 'female',
      npcId: 'woods:npc:child',
      role: 'woodcutter',
      treeIndex: 1,
    })
    expect(childCutter.outfit).toBe('peasant')
    expect(childCutter.modelUrl).toMatch(/peasant/)
    expect(childCutter.modelUrl).not.toBe(NPC_UBC_MALE_WOODCUTTER_URL)
    expect(childCutter.tintUrl).toBe(NPC_UBC_PEASANT_TINT_URL)
    expect(childCutter.hairAttachmentUrl).toBeNull()
    expect(childCutter.beardAttachmentUrl).toBeNull()
  })

  it('selects custom profession hair/beard deterministically from npcId', () => {
    const opts = {
      age: 40,
      gender: 'male' as const,
      npcId: 'forge:stable:7',
      role: 'blacksmith' as const,
      treeIndex: 7,
    }
    const a = resolveNpcAppearance(opts)
    const b = resolveNpcAppearance(opts)
    expect(a).toEqual(b)
    expect(a.hair).toBe(b.hair)
    expect(a.beard).toBe(b.beard)
    expect(a.hairAttachmentUrl).toBe(b.hairAttachmentUrl)
    expect(a.beardAttachmentUrl).toBe(b.beardAttachmentUrl)
  })

  it('limits blacksmith hair to bald|simple and woodcutter to simple|long', () => {
    const smithHairs = new Set<string>()
    const cutterHairs = new Set<string>()
    for (let i = 0; i < 80; i++) {
      const smith = resolveNpcAppearance({
        age: 40,
        gender: 'male',
        npcId: `forge:pool:${i}`,
        role: 'blacksmith',
        treeIndex: i,
      })
      const cutter = resolveNpcAppearance({
        age: 40,
        gender: 'male',
        npcId: `woods:pool:${i}`,
        role: 'woodcutter',
        treeIndex: i,
      })
      smithHairs.add(smith.hair)
      cutterHairs.add(cutter.hair)
      expect(['bald', 'simple']).toContain(smith.hair)
      expect(['simple', 'long']).toContain(cutter.hair)
    }
    expect(smithHairs.has('bald')).toBe(true)
    expect(smithHairs.has('simple')).toBe(true)
    expect(smithHairs.has('long')).toBe(false)
    expect(cutterHairs.has('simple')).toBe(true)
    expect(cutterHairs.has('long')).toBe(true)
    expect(cutterHairs.has('bald')).toBe(false)
  })

  it('keeps beard independent of hair, including bald+beard', () => {
    let baldWithBeard = false
    let baldWithoutBeard = false
    let hairedWithBeard = false
    let hairedWithoutBeard = false
    for (let i = 0; i < 200; i++) {
      const look = resolveNpcAppearance({
        age: 45,
        gender: 'male',
        npcId: `forge:beard:${i}`,
        role: 'blacksmith',
        treeIndex: i,
      })
      if (look.hair === 'bald') {
        if (look.beard) baldWithBeard = true
        else baldWithoutBeard = true
        expect(look.hairAttachmentUrl).toBeNull()
        expect(look.beardAttachmentUrl).toBe(look.beard ? NPC_UBC_BEARD_URL : null)
      } else {
        if (look.beard) hairedWithBeard = true
        else hairedWithoutBeard = true
        expect(look.hairAttachmentUrl).toBe(NPC_UBC_HAIR_SIMPLE_URL)
        expect(look.beardAttachmentUrl).toBe(look.beard ? NPC_UBC_BEARD_URL : null)
      }
    }
    expect(baldWithBeard).toBe(true)
    expect(baldWithoutBeard).toBe(true)
    expect(hairedWithBeard).toBe(true)
    expect(hairedWithoutBeard).toBe(true)
  })

  it('maps bald to no hair attachment and simple/long to runtime hair URLs', () => {
    const looks = Array.from({ length: 60 }, (_, i) => resolveNpcAppearance({
      age: 35,
      gender: 'male',
      npcId: `attach:map:${i}`,
      role: i % 2 === 0 ? 'blacksmith' : 'woodcutter',
      treeIndex: i,
    }))
    for (const look of looks) {
      if (look.hair === 'bald') {
        expect(look.hairAttachmentUrl).toBeNull()
      } else if (look.hair === 'simple') {
        expect(look.hairAttachmentUrl).toBe(NPC_UBC_HAIR_SIMPLE_URL)
      } else if (look.hair === 'long') {
        expect(look.hairAttachmentUrl).toBe(NPC_UBC_HAIR_LONG_URL)
      }
      expect(look.beardAttachmentUrl).toBe(look.beard ? NPC_UBC_BEARD_URL : null)
    }
  })

  it('uses custom male model only for the matching adult male profession', () => {
    expect(resolveNpcAppearance({
      age: 40, gender: 'male', npcId: 'a', role: 'blacksmith', treeIndex: 0,
    }).modelUrl).toBe(NPC_UBC_MALE_BLACKSMITH_URL)
    expect(resolveNpcAppearance({
      age: 40, gender: 'male', npcId: 'b', role: 'woodcutter', treeIndex: 0,
    }).modelUrl).toBe(NPC_UBC_MALE_WOODCUTTER_URL)
    expect(resolveNpcAppearance({
      age: 40, gender: 'male', npcId: 'c', role: 'farmer', treeIndex: 0,
    }).modelUrl).not.toBe(NPC_UBC_MALE_BLACKSMITH_URL)
    expect(resolveNpcAppearance({
      age: 40, gender: 'male', npcId: 'd', role: 'farmer', treeIndex: 0,
    }).hairAttachmentUrl).toBeNull()
  })

  it('maps adult hunter to Ranger UBC with a tint the player does not use', () => {
    const hunter = resolveNpcAppearance({
      age: 30,
      gender: 'male',
      npcId: 'home:npc:4',
      role: 'hunter',
      treeIndex: 4,
    })
    expect(hunter.outfit).toBe('ranger')
    expect(hunter.modelUrl).toMatch(/male_ranger/)
    expect(hunter.animationUrl).toBe(PLAYER_UBC_ANIMATION_URL)
    expect(hunter.tintUrl).toBe(NPC_UBC_RANGER_TINT_URL)
    expect(Object.values(NPC_HAIR_COLOR)).toContain(hunter.hairColor)

    const huntress = resolveNpcAppearance({
      age: 28,
      gender: 'female',
      npcId: 'woods:npc:5',
      role: 'hunter',
      treeIndex: 5,
    })
    expect(huntress.outfit).toBe('ranger')
    expect(huntress.modelUrl).not.toMatch(/_simple|_buzzed|_buns/)
    expect(huntress.modelUrl).not.toBe(NPC_UBC_FEMALE_RANGER_URL)
    expect(huntress.modelUrl).toBe('/models/characters/ubc/npc/female_ranger_long.glb')
    expect(huntress.tintUrl).toBe(NPC_UBC_RANGER_TINT_URL)
  })

  it('maps adult male guard to a single unhelmeted Knight UBC', () => {
    const marek = resolveNpcAppearance({
      age: 32,
      gender: 'male',
      npcId: 'home:npc:3',
      role: 'guard',
      treeIndex: 3,
    })
    expect(marek.outfit).toBe('knight')
    expect(marek.modelUrl).toBe(NPC_UBC_MALE_KNIGHT_UNHELMETED_URL)
    expect(marek.animationUrl).toBe(PLAYER_UBC_ANIMATION_URL)
    expect(marek.tintUrl).toBe(NPC_UBC_KNIGHT_TINT_URL)
    expect(Object.values(NPC_HAIR_COLOR)).toContain(marek.hairColor)
    expect(Object.values(NPC_CLOTHING_HUE)).toContain(marek.clothingHue)

    const otherGuard = resolveNpcAppearance({
      age: 40,
      gender: 'male',
      npcId: 'closed:npc:8',
      role: 'guard',
      treeIndex: 8,
    })
    expect(otherGuard.outfit).toBe('knight')
    expect(otherGuard.modelUrl).toBe(NPC_UBC_MALE_KNIGHT_UNHELMETED_URL)
  })

  it('maps adult trader to Wizard UBC', () => {
    const kasia = resolveNpcAppearance({
      age: 28,
      gender: 'female',
      npcId: KASIA,
      role: 'trader',
      treeIndex: 2,
    })
    expect(kasia.outfit).toBe('wizard')
    expect(
      kasia.modelUrl === '/models/characters/ubc/npc/female_wizard_long.glb'
      || kasia.modelUrl === '/models/characters/ubc/npc/female_wizard_buns.glb',
    ).toBe(true)
    expect(kasia.animationUrl).toBe(PLAYER_UBC_ANIMATION_URL)
    expect(kasia.tintUrl).toBe(NPC_UBC_WIZARD_TINT_URL)

    for (let i = 0; i < 16; i++) {
      const trader = resolveNpcAppearance({
        age: 28,
        gender: 'female',
        npcId: `market:npc:${i}`,
        role: 'trader',
        treeIndex: i,
      })
      expect(trader.modelUrl).not.toMatch(/_simple|_buzzed/)
      expect(trader.modelUrl).not.toBe(NPC_UBC_FEMALE_WIZARD_URL)
      expect(
        trader.modelUrl.endsWith('female_wizard_long.glb')
        || trader.modelUrl.endsWith('female_wizard_buns.glb'),
      ).toBe(true)
    }

    const maleTrader = resolveNpcAppearance({
      age: 40,
      gender: 'male',
      npcId: 'home:npc:3',
      role: 'trader',
      treeIndex: 3,
    })
    expect(maleTrader.modelUrl).toMatch(/male_wizard/)
  })

  it('keeps hair color stable for the same npcId across farmer vs woodcutter', () => {
    const shared = {
      age: 34,
      gender: 'male' as const,
      npcId: 'field:npc:4',
      treeIndex: 4,
    }
    const farmer = resolveNpcAppearance({ ...shared, role: 'farmer' })
    const woodcutter = resolveNpcAppearance({ ...shared, role: 'woodcutter' })
    expect(farmer.modelUrl).not.toBe(woodcutter.modelUrl)
    expect(woodcutter.modelUrl).toBe(NPC_UBC_MALE_WOODCUTTER_URL)
    expect(farmer.hairColor).toBe(woodcutter.hairColor)
    expect(farmer.tintUrl).toBe(NPC_UBC_PEASANT_TINT_URL)
    expect(woodcutter.tintUrl).toBeNull()
    expect(woodcutter.clothingHue).toBe(NPC_CLOTHING_HUE.identity)
  })

  it('is deterministic for a given npcId', () => {
    const opts = {
      age: 30,
      gender: 'male' as const,
      npcId: 'stable:npc:7',
      role: 'farmer' as const,
      treeIndex: 7,
    }
    expect(resolveNpcAppearance(opts)).toEqual(resolveNpcAppearance(opts))
  })

  it('is deterministic for custom male blacksmith without persistence', () => {
    const opts = {
      age: 42,
      gender: 'male' as const,
      npcId: 'stable:npc:smith',
      role: 'blacksmith' as const,
      treeIndex: 7,
    }
    expect(resolveNpcAppearance(opts)).toEqual(resolveNpcAppearance(opts))
    expect(resolveNpcAppearance(opts).modelUrl).toBe(NPC_UBC_MALE_BLACKSMITH_URL)
    expect(resolveNpcAppearance(opts).tintUrl).toBeNull()
  })

  it('spreads male farmer looks across more than one mesh', () => {
    const urls = new Set<string>()
    let sawBeard = false
    let sawBare = false
    for (let i = 0; i < 32; i++) {
      const look = resolveNpcAppearance({
        age: 30,
        gender: 'male',
        npcId: `spread:npc:${i}`,
        role: 'farmer',
        treeIndex: i,
      })
      urls.add(look.modelUrl)
      if (look.modelUrl.includes('_beard')) sawBeard = true
      else sawBare = true
    }
    expect(urls.size).toBeGreaterThan(1)
    expect(sawBeard).toBe(true)
    expect(sawBare).toBe(true)
  })

  it('never assigns a beard variant or short hair to women', () => {
    for (let i = 0; i < 40; i++) {
      const look = resolveNpcAppearance({
        age: 28,
        gender: 'female',
        npcId: `village:npc:${i}`,
        role: i % 2 === 0 ? 'farmer' : 'trader',
        treeIndex: i,
      })
      expect(look.modelUrl).not.toMatch(/_beard|_simple|_buzzed/)
    }
  })

  it('never requests male buns or female ranger buns GLBs', () => {
    for (let i = 0; i < 48; i++) {
      const male = resolveNpcAppearance({
        age: 30,
        gender: 'male',
        npcId: `nobuns:male:${i}`,
        role: i % 3 === 0 ? 'farmer' : i % 3 === 1 ? 'trader' : 'hunter',
        treeIndex: i,
      })
      expect(male.modelUrl).not.toMatch(/_buns/)

      const huntress = resolveNpcAppearance({
        age: 28,
        gender: 'female',
        npcId: `nobuns:huntress:${i}`,
        role: 'hunter',
        treeIndex: i,
      })
      expect(huntress.modelUrl).not.toMatch(/female_ranger_buns/)
      expect(huntress.modelUrl).toBe('/models/characters/ubc/npc/female_ranger_long.glb')
    }
  })

  it('reuses player default GLBs for the baked npc-039 / hunter combos', () => {
    expect(ubcVariantModelUrl('male', 'peasant', 'simple', false)).toBe(PLAYER_UBC_PEASANT_URL)
    expect(ubcVariantModelUrl('female', 'peasant', 'long', false)).toBe(NPC_UBC_FEMALE_PEASANT_URL)
    expect(ubcVariantModelUrl('male', 'wizard', 'simple', false)).toBe(PLAYER_UBC_WIZARD_URL)
    expect(ubcVariantModelUrl('male', 'ranger', 'simple', false)).toBe(PLAYER_UBC_RANGER_URL)
    expect(ubcVariantModelUrl('female', 'wizard', 'long', false)).toBe(
      '/models/characters/ubc/npc/female_wizard_long.glb',
    )
    expect(ubcVariantModelUrl('female', 'ranger', 'long', false)).toBe(
      '/models/characters/ubc/npc/female_ranger_long.glb',
    )
    expect(ubcVariantModelUrl('male', 'peasant', 'simple', true)).toBe(
      '/models/characters/ubc/npc/male_peasant_simple_beard.glb',
    )
    expect(ubcVariantModelUrl('female', 'wizard', 'buns', false)).toBe(
      '/models/characters/ubc/npc/female_wizard_buns.glb',
    )
    expect(ubcVariantModelUrl('male', 'ranger', 'long', true)).toBe(
      '/models/characters/ubc/npc/male_ranger_long_beard.glb',
    )
    expect(ubcVariantModelUrl('male', 'knight', 'simple', false)).not.toMatch(/male_knight\.glb$/)
    expect(ubcVariantModelUrl('male', 'knight', 'simple', false)).not.toBe(
      NPC_UBC_MALE_KNIGHT_UNHELMETED_URL,
    )
  })

  it('ships every baked variant GLB and hair sidecar', () => {
    const maleHairs = ['simple', 'long', 'buzzed'] as const
    const femaleHairs = ['long', 'buns'] as const
    for (const outfit of ['peasant', 'wizard', 'ranger'] as const) {
      for (const hair of maleHairs) {
        for (const beard of [false, true]) {
          const url = ubcVariantModelUrl('male', outfit, hair, beard)
          expect(existsSync(`public${url}`), url).toBe(true)
        }
      }
      for (const hair of femaleHairs) {
        if (hair === 'buns' && outfit === 'ranger') continue
        const url = ubcVariantModelUrl('female', outfit, hair, false)
        expect(existsSync(`public${url}`), url).toBe(true)
      }
    }
    expect(existsSync(`public${NPC_UBC_HAIR_1_URL}`)).toBe(true)
    expect(existsSync(`public${NPC_UBC_HAIR_2_URL}`)).toBe(true)
    expect(existsSync('public/models/characters/ubc/npc_ranger.webp')).toBe(true)
    expect(existsSync(`public${NPC_UBC_MALE_KNIGHT_UNHELMETED_URL}`)).toBe(true)
    expect(existsSync(`public${NPC_UBC_KNIGHT_TINT_URL}`)).toBe(true)
    expect(existsSync(`public${NPC_UBC_MALE_BLACKSMITH_URL}`)).toBe(true)
    expect(existsSync(`public${NPC_UBC_MALE_WOODCUTTER_URL}`)).toBe(true)
    expect(existsSync(`public${NPC_UBC_HAIR_SIMPLE_URL}`)).toBe(true)
    expect(existsSync(`public${NPC_UBC_HAIR_LONG_URL}`)).toBe(true)
    expect(existsSync(`public${NPC_UBC_BEARD_URL}`)).toBe(true)
  })

  it('never assigns grey hair to an adult NPC under 50', () => {
    for (const age of [18, 25, 34, 49]) {
      for (let i = 0; i < 40; i++) {
        const look = resolveNpcAppearance({
          age,
          gender: i % 2 === 0 ? 'male' : 'female',
          npcId: `young:npc:${age}:${i}`,
          role: 'farmer',
          treeIndex: i,
        })
        expect(look.hairColor).not.toBe(NPC_HAIR_COLOR.grey)
      }
    }
  })

  it('can assign grey hair to a 50-59 year old NPC, roughly at the documented rate', () => {
    const sampleSize = 400
    let greyCount = 0
    for (let i = 0; i < sampleSize; i++) {
      const look = resolveNpcAppearance({
        age: 50 + (i % 10),
        gender: i % 2 === 0 ? 'male' : 'female',
        npcId: `midlife:npc:${i}`,
        role: 'farmer',
        treeIndex: i,
      })
      if (look.hairColor === NPC_HAIR_COLOR.grey) greyCount++
    }
    // ~15% target; wide bounds keep this non-flaky while still catching a broken roll.
    expect(greyCount).toBeGreaterThan(0)
    expect(greyCount).toBeLessThan(sampleSize * 0.35)
  })

  it('gives a 60+ NPC a clearly higher grey-hair rate than a 50-59 NPC', () => {
    const sampleSize = 400
    const countGrey = (ageOf: (i: number) => number): number => {
      let count = 0
      for (let i = 0; i < sampleSize; i++) {
        const look = resolveNpcAppearance({
          age: ageOf(i),
          gender: i % 2 === 0 ? 'male' : 'female',
          npcId: `senior:npc:${i}`,
          role: 'woodcutter',
          treeIndex: i,
        })
        if (look.hairColor === NPC_HAIR_COLOR.grey) count++
      }
      return count
    }
    const midlifeGrey = countGrey(i => 50 + (i % 10))
    const seniorGrey = countGrey(i => 60 + (i % 20))
    // ~15% vs ~75% target; loose bounds avoid flakiness while asserting the ordering.
    expect(seniorGrey).toBeGreaterThan(sampleSize * 0.5)
    expect(seniorGrey).toBeGreaterThan(midlifeGrey)
  })

  it('is deterministic for the same npcId + age, including hair color', () => {
    const opts = {
      age: 62,
      gender: 'female' as const,
      npcId: 'stable:npc:senior',
      role: 'trader' as const,
      treeIndex: 9,
    }
    expect(resolveNpcAppearance(opts)).toEqual(resolveNpcAppearance(opts))
  })

  it('still assigns non-grey hair color, hue and hair-kind variety for a 60+ NPC', () => {
    const hairColors = new Set<number>()
    const hues = new Set<number>()
    for (let i = 0; i < 60; i++) {
      const look = resolveNpcAppearance({
        age: 65,
        gender: 'male',
        npcId: `elder:npc:${i}`,
        role: 'farmer',
        treeIndex: i,
      })
      expect(Object.values(NPC_HAIR_COLOR)).toContain(look.hairColor)
      expect(Object.values(NPC_CLOTHING_HUE)).toContain(look.clothingHue)
      hairColors.add(look.hairColor)
      hues.add(look.clothingHue)
    }
    expect(hairColors.size).toBeGreaterThan(1)
    expect(hues.size).toBeGreaterThan(1)
  })

  it('maps every adult role to UBC and never returns modular', () => {
    const roles = [
      'farmer', 'woodcutter', 'guard', 'trader', 'miner', 'fisher',
      'hunter', 'blacksmith', 'shepherd', 'textile_worker', 'herbalist',
    ] as const
    const expectedOutfit: Record<(typeof roles)[number], string> = {
      farmer: 'peasant',
      woodcutter: 'peasant',
      miner: 'peasant',
      fisher: 'peasant',
      blacksmith: 'peasant',
      shepherd: 'peasant',
      textile_worker: 'peasant',
      herbalist: 'peasant',
      trader: 'wizard',
      hunter: 'ranger',
      guard: 'knight',
    }
    for (const role of roles) {
      for (const gender of ['male', 'female'] as const) {
        const look = resolveNpcAppearance({
          age: 30,
          gender,
          npcId: `role:${role}:${gender}`,
          role,
          treeIndex: 0,
        })
        expect(look.outfit, `${role}/${gender}`).toBe(expectedOutfit[role])
        expect(look.animationUrl).toBe(PLAYER_UBC_ANIMATION_URL)
        expect(look.modelUrl).toMatch(/\/models\/characters\/ubc\//)
      }
    }
  })

  it('maps female guards to Knight UBC and children to scaled Peasant UBC', () => {
    const femaleGuard = resolveNpcAppearance({
      age: 30,
      gender: 'female',
      npcId: 'watch:npc:2',
      role: 'guard',
      treeIndex: 2,
    })
    expect(femaleGuard.outfit).toBe('knight')
    expect(femaleGuard.modelUrl).toMatch(/female_knight/)
    expect(femaleGuard.animationUrl).toBe(PLAYER_UBC_ANIMATION_URL)
    expect(femaleGuard.tintUrl).toBe(NPC_UBC_KNIGHT_TINT_URL)

    const childFarmer = resolveNpcAppearance({
      age: 12,
      gender: 'female',
      npcId: ANNA,
      role: 'farmer',
      treeIndex: 0,
    })
    expect(childFarmer.outfit).toBe('peasant')
    expect(childFarmer.modelUrl).toMatch(/peasant/)
    expect(childFarmer.animationUrl).toBe(PLAYER_UBC_ANIMATION_URL)
    expect(childFarmer.tintUrl).toBe(NPC_UBC_PEASANT_TINT_URL)

    const childHunter = resolveNpcAppearance({
      age: 12,
      gender: 'male',
      npcId: 'home:npc:4',
      role: 'hunter',
      treeIndex: 4,
    })
    expect(childHunter.outfit).toBe('peasant')
    expect(childHunter.modelUrl).toMatch(/peasant/)
  })
})

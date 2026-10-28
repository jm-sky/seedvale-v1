import { describe, expect, it } from 'vitest'
import { ANIMS_URL, bodyUrl } from '../characters/characterFiles'
import {
  NPC_CLOTHING_HUE,
  NPC_HAIR_COLOR,
  NPC_WOODCUTTER_CLOTH_TINT,
  resolveNpcAppearance,
} from './npcAppearance'

const ANNA = 'home:npc:0'
const PIOTR = 'home:npc:1'
const KASIA = 'home:npc:2'

describe('resolveNpcAppearance', () => {
  it('maps adult female farmer to Peasant_Boots and male woodcutter to the authored Woodcutter', () => {
    const anna = resolveNpcAppearance({
      age: 34,
      gender: 'female',
      npcId: ANNA,
      role: 'farmer',
      treeIndex: 0,
    })
    expect(anna.outfit).toBe('Peasant_Boots')
    expect(anna.kit.sex).toBe('Female')
    expect(anna.kit.garments).toEqual(['PeasantSkirt'])
    expect(anna.modelUrl).toBe(bodyUrl('Female', 'Peasant_Boots'))
    expect(anna.animationUrl).toBe(ANIMS_URL)
    expect(Object.values(NPC_HAIR_COLOR)).toContain(anna.hairColor)
    expect(Object.values(NPC_CLOTHING_HUE)).toContain(anna.clothingHue)

    const piotr = resolveNpcAppearance({
      age: 36,
      gender: 'male',
      npcId: PIOTR,
      role: 'woodcutter',
      treeIndex: 1,
    })
    expect(piotr.outfit).toBe('Woodcutter')
    expect(piotr.kit.clothTint).toBeNull()
    expect(piotr.modelUrl).toBe(bodyUrl('Male', 'Woodcutter'))
    expect(piotr.animationUrl).toBe(ANIMS_URL)
    expect(piotr.family).toBe('woodcutter')
  })

  it('maps adult male farmer to the authored Farmer (hat, leg wraps)', () => {
    const farmer = resolveNpcAppearance({ age: 41, gender: 'male', npcId: 'farm:npc:3', role: 'farmer', treeIndex: 3 })
    expect(farmer.outfit).toBe('Farmer')
    expect(farmer.modelUrl).toBe(bodyUrl('Male', 'Farmer'))
    expect(farmer.kit.garments).toEqual([])
  })

  it('keeps the previous looks where no authored body exists (women, children)', () => {
    const wife = resolveNpcAppearance({ age: 33, gender: 'female', npcId: 'wood:npc:2', role: 'woodcutter', treeIndex: 2 })
    expect(wife.outfit).toBe('Peasant')
    expect(wife.kit.clothTint).toBe(NPC_WOODCUTTER_CLOTH_TINT)
    expect(wife.kit.garments).toEqual(['PeasantSkirt'])
    const boy = resolveNpcAppearance({ age: 9, gender: 'male', npcId: 'farm:npc:7', role: 'farmer', treeIndex: 7 })
    expect(boy.outfit).toBe('Peasant')
    const lad = resolveNpcAppearance({ age: 9, gender: 'male', npcId: 'wood:npc:7', role: 'woodcutter', treeIndex: 7 })
    expect(lad.outfit).toBe('Peasant')
    expect(lad.kit.clothTint).toBeNull()
  })

  it('maps adult male blacksmith to Blacksmith with Round head and beard', () => {
    const smith = resolveNpcAppearance({
      age: 40,
      gender: 'male',
      npcId: 'forge:npc:1',
      role: 'blacksmith',
      treeIndex: 1,
    })
    expect(smith.outfit).toBe('Blacksmith')
    expect(smith.kit.head).toBe('Round')
    expect(smith.kit.beard).toBe(true)
    expect(smith.modelUrl).toBe(bodyUrl('Male', 'Blacksmith'))
    expect(smith.family).toBe('blacksmith')
    expect(['bald', 'Parted']).toContain(smith.hair)
  })

  it('coerces female blacksmith/hunter to Peasant + skirt; trader to Wizard + skirt', () => {
    const smith = resolveNpcAppearance({
      age: 35,
      gender: 'female',
      npcId: 'forge:npc:3',
      role: 'blacksmith',
      treeIndex: 3,
    })
    expect(smith.outfit).toBe('Peasant')
    expect(smith.kit.garments).toEqual(['PeasantSkirt'])
    expect(smith.modelUrl).toBe(bodyUrl('Female', 'Peasant'))

    const huntress = resolveNpcAppearance({
      age: 28,
      gender: 'female',
      npcId: 'hunt:npc:1',
      role: 'hunter',
      treeIndex: 5,
    })
    expect(huntress.outfit).toBe('Peasant')
    expect(huntress.kit.garments).toEqual(['PeasantSkirt'])

    const trader = resolveNpcAppearance({
      age: 40,
      gender: 'female',
      npcId: KASIA,
      role: 'trader',
      treeIndex: 2,
    })
    expect(trader.outfit).toBe('Wizard')
    expect(trader.kit.garments).toEqual(['PeasantSkirt'])
    expect(trader.modelUrl).toBe(bodyUrl('Female', 'Wizard'))
  })

  it('maps guard to Knight_Cloth and hunter to Ranger_NoHood for males', () => {
    const guard = resolveNpcAppearance({
      age: 30,
      gender: 'male',
      npcId: 'gate:npc:1',
      role: 'guard',
      treeIndex: 1,
    })
    expect(guard.outfit).toBe('Knight_Cloth')
    expect(guard.kit.garments).toEqual([])

    const hunter = resolveNpcAppearance({
      age: 30,
      gender: 'male',
      npcId: 'hunt:npc:2',
      role: 'hunter',
      treeIndex: 2,
    })
    expect(hunter.outfit).toBe('Ranger_NoHood')
  })

  it('forces children onto Peasant (+ skirt for girls)', () => {
    const boy = resolveNpcAppearance({
      age: 10,
      gender: 'male',
      npcId: 'home:npc:child:m',
      role: 'blacksmith',
      treeIndex: 0,
    })
    expect(boy.outfit).toBe('Peasant')
    expect(boy.kit.beard).toBe(false)

    const girl = resolveNpcAppearance({
      age: 10,
      gender: 'female',
      npcId: 'home:npc:child:f',
      role: 'hunter',
      treeIndex: 1,
    })
    expect(girl.outfit).toBe('Peasant')
    expect(girl.kit.garments).toEqual(['PeasantSkirt'])
  })

  it('is deterministic for the same npcId', () => {
    const opts = {
      age: 40,
      gender: 'male' as const,
      npcId: 'forge:npc:stable',
      role: 'blacksmith' as const,
      treeIndex: 1,
    }
    expect(resolveNpcAppearance(opts)).toEqual(resolveNpcAppearance(opts))
  })

  it('skirts herbalist women', () => {
    const look = resolveNpcAppearance({
      age: 42,
      gender: 'female',
      npcId: 'herb:npc:1',
      role: 'herbalist',
      treeIndex: 1,
    })
    expect(look.outfit).toBe('Herbalist')
    expect(look.kit.garments).toEqual(['PeasantSkirt'])
  })

  it('gives women Long or Buns hair only (no BuzzedFemale)', () => {
    const styles = new Set(
      Array.from({ length: 40 }, (_, i) => resolveNpcAppearance({
        age: 30,
        gender: 'female',
        npcId: `town:npc:f:${i}`,
        role: 'farmer',
        treeIndex: i,
      }).kit.hair),
    )
    expect([...styles].every((h) => h === 'Long' || h === 'Buns')).toBe(true)
    expect(styles.has('Long')).toBe(true)
  })

  it('gives adult male blacksmith a beard and sometimes other men too', () => {
    const smith = resolveNpcAppearance({
      age: 40,
      gender: 'male',
      npcId: 'forge:npc:beard',
      role: 'blacksmith',
      treeIndex: 1,
    })
    expect(smith.kit.beard).toBe(true)
    expect(smith.kit.hair === null || smith.kit.hair === 'Parted').toBe(true)

    const beards = Array.from({ length: 40 }, (_, i) => resolveNpcAppearance({
      age: 35,
      gender: 'male',
      npcId: `town:npc:m:${i}`,
      role: 'farmer',
      treeIndex: i,
    }).kit.beard)
    expect(beards.some(Boolean)).toBe(true)
    expect(beards.some((b) => !b)).toBe(true)
  })
})

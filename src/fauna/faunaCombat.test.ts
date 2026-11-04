import { describe, expect, it } from 'vitest'
import type { AnimalAgent } from './AnimalAgent'
import { ANIMAL_DEFS } from './animalDefs'
import { combatTargetForAnimal, createHealthState, damageFor, damageVsHuman, faunaPhysicalHit, HUMAN_ATTACK_PROFILE, isMeleeTool, MAX_HP } from './faunaCombat'

/** Narrow fake covering only what `combatTargetForAnimal` touches — a full
 *  `AnimalAgent` needs a GLTF/scene graph this test doesn't want. */
function fakeAnimal(overrides: { dead?: boolean, x?: number, z?: number } = {}): AnimalAgent & { damages: [number, string | undefined][] } {
  const damages: [number, string | undefined][] = []
  const dead = overrides.dead ?? false
  return {
    animalId: 'wolf-1',
    mesh: { position: { x: overrides.x ?? 3, z: overrides.z ?? 4 } },
    isDead: () => dead,
    takeDamage: (amount: number, source?: 'npc' | 'player') => damages.push([amount, source]),
    damages,
  } as unknown as AnimalAgent & { damages: [number, string | undefined][] }
}

describe('faunaCombat (createHealthState re-exported from shared, MAX_HP/damageFor fauna-local)', () => {
  it('createHealthState still builds a full-health state after the shared/ extraction', () => {
    expect(createHealthState(MAX_HP.wolf)).toEqual({ maxHp: 50, currentHp: 50, dead: false })
  })

  it('has a MAX_HP entry for every animal kind', () => {
    expect(MAX_HP).toEqual({
      wolf: 50,
      fox: 25,
      deer: 30,
      stag: 40,
      rabbit: 10,
      duck: 8,
      boar: 35,
      bear: 150,
      horse: 80,
      donkey: 55,
      cow: 70,
      sheep: 22,
      chicken: 6,
      rooster: 7,
      dog: 40,
      rat: 6,
    })
  })

  it('looks up predator/prey damage, falling back to the default', () => {
    expect(damageFor('wolf', 'deer')).toBe(15)
    expect(damageFor('fox', 'stag')).toBe(6)
    expect(damageFor('wolf', 'fox')).toBe(8) // no table entry -> DEFAULT_DAMAGE
  })

  it('gives dogs 2 damage vs rats, not enough to one-shot full health (plan quests-progression-013 §13)', () => {
    expect(damageFor('dog', 'rat')).toBe(2)
    expect(damageFor('dog', 'rat')).toBeLessThan(MAX_HP.rat)
  })

  it('looks up predator→human damage (plan 056)', () => {
    expect(damageVsHuman('wolf')).toBe(12)
    expect(damageVsHuman('fox')).toBe(6)
    expect(damageVsHuman('boar')).toBe(8) // no table entry -> DEFAULT_DAMAGE
  })

  it('gives bear (plan 188) higher HP and damage than wolf, the previous strongest predator', () => {
    expect(MAX_HP.bear).toBeGreaterThan(MAX_HP.wolf)
    expect(damageFor('bear', 'deer')).toBeGreaterThan(damageFor('wolf', 'deer'))
    expect(damageVsHuman('bear')).toBeGreaterThan(damageVsHuman('wolf'))
  })

  it('flags melee-capable tools via ITEM_CATALOG (plan 123 — damage/timing assertions moved to playerMelee.test.ts)', () => {
    expect(isMeleeTool('long_sword')).toBe(true)
    expect(isMeleeTool('axe')).toBe(true)
    expect(isMeleeTool('pitchfork')).toBe(true)
    expect(isMeleeTool('sickle')).toBe(true)
    expect(isMeleeTool('knife')).toBe(true)
    expect(isMeleeTool('shovel')).toBe(true)
    expect(isMeleeTool('damascus_knife')).toBe(true)
    expect(isMeleeTool('damascus_short_sword')).toBe(true)
    expect(isMeleeTool('damascus_long_sword')).toBe(true)
    expect(isMeleeTool('masterwork_sword')).toBe(true)
    expect(isMeleeTool('obsidian_sword')).toBe(true)
    expect(isMeleeTool('battle_axe')).toBe(true)
    expect(isMeleeTool('pickaxe')).toBe(false)
    expect(isMeleeTool('firestarter')).toBe(false)
    expect(isMeleeTool(null)).toBe(false)
  })
})

describe('combatTargetForAnimal (plan 177)', () => {
  it('exposes id, position and alive state from the live agent', () => {
    const animal = fakeAnimal({ x: 3, z: 4 })
    const target = combatTargetForAnimal(animal)
    expect(target.ref).toEqual({ id: 'wolf-1', kind: 'animal' })
    expect(target.getPosition()).toEqual({ x: 3, z: 4 })
    expect(target.isAlive()).toBe(true)
  })

  it('reports no position and not alive once the animal is dead', () => {
    const animal = fakeAnimal({ dead: true })
    const target = combatTargetForAnimal(animal)
    expect(target.getPosition()).toBeNull()
    expect(target.isAlive()).toBe(false)
  })

  it('routes applyDamage through takeDamage with source "npc"', () => {
    const animal = fakeAnimal()
    combatTargetForAnimal(animal).applyDamage({ amount: 12, damageType: 'cut', source: 'melee', attackerId: 'npc:1' })
    expect(animal.damages).toEqual([[12, 'npc']])
  })
})

describe('fauna → human typed hits (065 S3)', () => {
  const species = Object.keys(ANIMAL_DEFS) as (keyof typeof ANIMAL_DEFS)[]

  it('maps every species that can reach the human-damage callback explicitly', () => {
    expect(Object.keys(HUMAN_ATTACK_PROFILE).sort()).toEqual([...species].sort())
    for (const kind of species) {
      const hit = faunaPhysicalHit(kind, 7, `${kind}:1`)
      expect(['low-bite', 'large-maul']).toContain(hit.profile)
      expect(['cut', 'pierce', 'blunt']).toContain(hit.damageType)
      expect(hit).toMatchObject({ amount: 7, source: 'fauna', attackerId: `${kind}:1`, blockable: true })
      expect(hit.forcedLocation).toBeUndefined()
    }
  })

  it('bear is large-maul/cut; small biters are low-bite/pierce', () => {
    expect(faunaPhysicalHit('bear', 22, 'bear:1')).toMatchObject({ profile: 'large-maul', damageType: 'cut' })
    for (const kind of ['wolf', 'fox', 'dog', 'rat'] as const) {
      expect(faunaPhysicalHit(kind, 6, `${kind}:1`)).toMatchObject({ profile: 'low-bite', damageType: 'pierce' })
    }
  })

  it('uses the stable animal id, never a shared "fauna" key, as the attacker identity', () => {
    expect(faunaPhysicalHit('wolf', 12, 'wolf:a').attackerId).toBe('wolf:a')
    expect(faunaPhysicalHit('wolf', 12, 'wolf:b').attackerId).not.toBe(faunaPhysicalHit('wolf', 12, 'wolf:a').attackerId)
  })
})

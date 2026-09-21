import { describe, expect, it } from 'vitest'
import { Inventory } from '../items/Inventory'
import { resolveNpcAmmoKind, resolveNpcMeleeWeapon, resolveNpcRangedWeapon } from './npcCombat'
import {
  defaultWeaponForRole,
  ensureKnifeCarried,
  isNpcLoadoutBelonging,
  seedDefaultRoleWeapon,
  seedGuardCrossbowLoadout,
  seedHunterStartingArrows,
  seedHunterSupplies,
  seedInitialPersonalBelongingsIfNeeded,
  seedShepherdPrimaryWeapon,
  seedShepherdShears,
  seedShepherdSlingLoadout,
  selectShepherdPrimaryWeapon,
  SHEPHERD_PRIMARY_WEAPON_KINDS,
} from './npcLoadout'

describe('defaultWeaponForRole', () => {
  it('maps roles to their default melee weapon', () => {
    expect(defaultWeaponForRole('woodcutter')).toBe('axe')
    expect(defaultWeaponForRole('guard')).toBe('long_sword')
    expect(defaultWeaponForRole('farmer')).toBe('knife')
  })

  it('maps hunter to a default ranged weapon (plan 178)', () => {
    expect(defaultWeaponForRole('hunter')).toBe('hunting_bow')
  })

  it('falls back to knife for roles without their own default weapon', () => {
    expect(defaultWeaponForRole('trader')).toBe('knife')
    expect(defaultWeaponForRole('miner')).toBe('knife')
    expect(defaultWeaponForRole('fisher')).toBe('knife')
    expect(defaultWeaponForRole('blacksmith')).toBe('knife')
  })
})

describe('seedDefaultRoleWeapon', () => {
  it('seeds a woodcutter with an axe', () => {
    const carried = new Inventory(undefined, 5)
    seedDefaultRoleWeapon(carried, 'woodcutter')
    expect(carried.holdsAny('axe')).toBe(true)
    expect(resolveNpcMeleeWeapon(carried, 'woodcutter')?.kind).toBe('axe')
  })

  it('seeds a guard with a long sword', () => {
    const carried = new Inventory(undefined, 5)
    seedDefaultRoleWeapon(carried, 'guard')
    expect(carried.holdsAny('long_sword')).toBe(true)
    expect(resolveNpcMeleeWeapon(carried, 'guard')?.kind).toBe('long_sword')
  })

  it('seeds a farmer with a knife', () => {
    const carried = new Inventory(undefined, 5)
    seedDefaultRoleWeapon(carried, 'farmer')
    expect(carried.holdsAny('knife')).toBe(true)
    expect(resolveNpcMeleeWeapon(carried, 'farmer')?.kind).toBe('knife')
  })

  it('falls back to a knife for a trader/miner/fisher (animal-threat diagnostics task)', () => {
    const carried = new Inventory(undefined, 5)
    seedDefaultRoleWeapon(carried, 'trader')
    expect(carried.holdsAny('knife')).toBe(true)
    expect(resolveNpcMeleeWeapon(carried, 'trader')?.kind).toBe('knife')
  })

  it('does not add a second weapon when the default is already carried', () => {
    const carried = new Inventory(undefined, 5)
    seedDefaultRoleWeapon(carried, 'guard')
    seedDefaultRoleWeapon(carried, 'guard')
    expect(carried.countInstances('long_sword')).toBe(1)
  })

  it('seeds a hunter with a ranged-capable bow', () => {
    const carried = new Inventory(undefined, 5)
    seedDefaultRoleWeapon(carried, 'hunter')
    expect(carried.holdsAny('hunting_bow')).toBe(true)
    expect(resolveNpcRangedWeapon(carried, 'hunter')?.kind).toBe('hunting_bow')
  })
})

describe('seedHunterSupplies (plan 178)', () => {
  it('seeds a knife and starting arrows so a fresh hunter can both fight and harvest', () => {
    const carried = new Inventory(undefined, 5)
    seedDefaultRoleWeapon(carried, 'hunter')
    seedHunterSupplies(carried)
    expect(carried.hasCapability('meat_harvesting')).toBe(true)
    const ranged = resolveNpcRangedWeapon(carried, 'hunter')
    expect(ranged).not.toBeNull()
    expect(resolveNpcAmmoKind(carried, ranged!.ranged)).toBe('arrow')
  })

  it('is idempotent — running it twice does not add a second knife or double the arrows', () => {
    const carried = new Inventory(undefined, 5)
    seedHunterSupplies(carried)
    const arrowsAfterFirst = carried.count('arrow')
    seedHunterSupplies(carried)
    expect(carried.countInstances('knife')).toBe(1)
    expect(carried.count('arrow')).toBe(arrowsAfterFirst)
  })
})

describe('ensureKnifeCarried', () => {
  it('gives a woodcutter a knife alongside their axe (animal-threat diagnostics task)', () => {
    const carried = new Inventory(undefined, 5)
    seedDefaultRoleWeapon(carried, 'woodcutter')
    ensureKnifeCarried(carried)
    expect(carried.holdsAny('axe')).toBe(true)
    expect(carried.holdsAny('knife')).toBe(true)
  })

  it('is idempotent — running it twice does not add a second knife', () => {
    const carried = new Inventory(undefined, 5)
    ensureKnifeCarried(carried)
    ensureKnifeCarried(carried)
    expect(carried.countInstances('knife')).toBe(1)
  })
})

describe('isNpcLoadoutBelonging (plan npc-010)', () => {
  it('does not treat arrows as hunter loadout belongings', () => {
    expect(isNpcLoadoutBelonging('arrow', 'hunter')).toBe(false)
    expect(isNpcLoadoutBelonging('hunting_bow', 'hunter')).toBe(true)
    expect(isNpcLoadoutBelonging('knife', 'hunter')).toBe(true)
    expect(isNpcLoadoutBelonging('shears', 'shepherd')).toBe(true)
    expect(isNpcLoadoutBelonging('shears', 'farmer')).toBe(false)
  })

  it('treats a shepherd primary defensive weapon as a loadout belonging (plan npc-047)', () => {
    expect(isNpcLoadoutBelonging('spear', 'shepherd')).toBe(true)
    expect(isNpcLoadoutBelonging('pitchfork', 'shepherd')).toBe(true)
    expect(isNpcLoadoutBelonging('axe', 'shepherd')).toBe(true)
    expect(isNpcLoadoutBelonging('spear', 'farmer')).toBe(false)
  })

  it('treats guard crossbow+bolts and shepherd sling as loadout belongings, but never shepherd stone (plan items-player-059)', () => {
    expect(isNpcLoadoutBelonging('crossbow', 'guard')).toBe(true)
    expect(isNpcLoadoutBelonging('bolt', 'guard')).toBe(true)
    expect(isNpcLoadoutBelonging('crossbow', 'shepherd')).toBe(false)
    expect(isNpcLoadoutBelonging('sling', 'shepherd')).toBe(true)
    // Same reason arrows stay out for hunter — stone stays the ordinary
    // shared renewable resource, not a protected personal belonging.
    expect(isNpcLoadoutBelonging('stone', 'shepherd')).toBe(false)
    expect(isNpcLoadoutBelonging('sling', 'guard')).toBe(false)
  })
})

describe('seedInitialPersonalBelongingsIfNeeded (plan settlements-npcs-026)', () => {
  it('seeds role belongings once on first creation and never reseeds', () => {
    const inventory = new Inventory()
    const state = { needsInitialPersonalLoadout: true }
    seedInitialPersonalBelongingsIfNeeded(inventory, 'woodcutter', state, 'npc:1')
    expect(inventory.holdsAny('axe')).toBe(true)
    expect(inventory.holdsAny('knife')).toBe(true)
    expect(state.needsInitialPersonalLoadout).toBe(false)
    const axeCount = inventory.countInstances('axe')
    seedInitialPersonalBelongingsIfNeeded(inventory, 'woodcutter', state, 'npc:1')
    expect(inventory.countInstances('axe')).toBe(axeCount)
  })

  it('does not seed a restored empty inventory (legacy save)', () => {
    const inventory = new Inventory()
    const state = { needsInitialPersonalLoadout: false }
    seedInitialPersonalBelongingsIfNeeded(inventory, 'guard', state, 'npc:1')
    expect(inventory.isEmpty()).toBe(true)
  })
})

describe('seedShepherdShears (plan fauna-004)', () => {
  it('gives a shepherd shears once and is idempotent', () => {
    const inventory = new Inventory()
    seedShepherdShears(inventory)
    expect(inventory.hasCapability('shearing')).toBe(true)
    expect(inventory.count('shears')).toBe(1)
    seedShepherdShears(inventory)
    expect(inventory.count('shears')).toBe(1)
  })

  it('seeds shears with the initial personal loadout', () => {
    const inventory = new Inventory()
    const state = { needsInitialPersonalLoadout: true }
    seedInitialPersonalBelongingsIfNeeded(inventory, 'shepherd', state, 'npc:shepherd-1')
    expect(inventory.hasCapability('shearing')).toBe(true)
    expect(state.needsInitialPersonalLoadout).toBe(false)
  })
})

describe('selectShepherdPrimaryWeapon / seedShepherdPrimaryWeapon (plan npc-047)', () => {
  it('always picks one of the three weighted primary kinds', () => {
    for (let i = 0; i < 50; i++) {
      expect(SHEPHERD_PRIMARY_WEAPON_KINDS).toContain(selectShepherdPrimaryWeapon(`npc:${i}`))
    }
  })

  it('is deterministic for the same npc id and varies across ids', () => {
    expect(selectShepherdPrimaryWeapon('npc:stable-id')).toBe(selectShepherdPrimaryWeapon('npc:stable-id'))
    const picks = new Set(Array.from({ length: 30 }, (_, i) => selectShepherdPrimaryWeapon(`npc:${i}`)))
    expect(picks.size).toBeGreaterThan(1)
  })

  it('seeds exactly one primary weapon instance, independent of knife', () => {
    const inventory = new Inventory()
    seedShepherdPrimaryWeapon(inventory, 'npc:shepherd-2')
    const carried = SHEPHERD_PRIMARY_WEAPON_KINDS.filter((kind) => inventory.holdsAny(kind))
    expect(carried).toHaveLength(1)
    expect(inventory.holdsAny('knife')).toBe(false)
  })

  it('is idempotent — does not duplicate or reroll the primary weapon', () => {
    const inventory = new Inventory()
    seedShepherdPrimaryWeapon(inventory, 'npc:shepherd-3')
    const picked = SHEPHERD_PRIMARY_WEAPON_KINDS.find((kind) => inventory.holdsAny(kind))!
    seedShepherdPrimaryWeapon(inventory, 'npc:shepherd-3')
    expect(inventory.countInstances(picked)).toBe(1)
    expect(SHEPHERD_PRIMARY_WEAPON_KINDS.filter((kind) => inventory.holdsAny(kind))).toHaveLength(1)
  })

  it('gives every newly generated shepherd a knife plus exactly one primary weapon', () => {
    const inventory = new Inventory()
    const state = { needsInitialPersonalLoadout: true }
    seedInitialPersonalBelongingsIfNeeded(inventory, 'shepherd', state, 'npc:shepherd-4')
    expect(inventory.holdsAny('knife')).toBe(true)
    expect(SHEPHERD_PRIMARY_WEAPON_KINDS.filter((kind) => inventory.holdsAny(kind))).toHaveLength(1)
  })

  it('reconstruction does not reroll or duplicate knife/primary/shears', () => {
    const inventory = new Inventory()
    const state = { needsInitialPersonalLoadout: true }
    seedInitialPersonalBelongingsIfNeeded(inventory, 'shepherd', state, 'npc:shepherd-5')
    const picked = SHEPHERD_PRIMARY_WEAPON_KINDS.find((kind) => inventory.holdsAny(kind))!
    // Reconstruction: `needsInitialPersonalLoadout` is already false, same as a real reload.
    seedInitialPersonalBelongingsIfNeeded(inventory, 'shepherd', state, 'npc:shepherd-5')
    expect(inventory.countInstances('knife')).toBe(1)
    expect(inventory.countInstances(picked)).toBe(1)
    expect(inventory.count('shears')).toBe(1)
  })
})

describe('seedHunterStartingArrows', () => {
  it('adds starting arrows to the transient carrier without a knife', () => {
    const carried = new Inventory(undefined, 5)
    seedHunterStartingArrows(carried)
    expect(carried.count('arrow')).toBe(6)
    expect(carried.holdsAny('knife')).toBe(false)
  })
})

describe('seedGuardCrossbowLoadout (plan items-player-059 §10)', () => {
  it('gives a real but partial fraction of guards a crossbow, deterministically per npc id', () => {
    let hits = 0
    for (let i = 0; i < 200; i++) {
      const inventory = new Inventory()
      seedGuardCrossbowLoadout(inventory, `npc:guard:${i}`)
      if (inventory.holdsAny('crossbow')) {
        hits++
        expect(inventory.count('bolt')).toBe(6)
      } else {
        expect(inventory.count('bolt')).toBe(0)
      }
    }
    expect(hits).toBeGreaterThan(0)
    expect(hits).toBeLessThan(200)
  })

  it('is deterministic and idempotent for the same npc id', () => {
    const a = new Inventory()
    seedGuardCrossbowLoadout(a, 'npc:guard:stable')
    const gotCrossbow = a.holdsAny('crossbow')
    seedGuardCrossbowLoadout(a, 'npc:guard:stable')
    expect(a.holdsAny('crossbow')).toBe(gotCrossbow)
    expect(a.count('crossbow')).toBeLessThanOrEqual(1)

    const b = new Inventory()
    seedGuardCrossbowLoadout(b, 'npc:guard:stable')
    expect(b.holdsAny('crossbow')).toBe(gotCrossbow)
  })

  it('is additional to, never a replacement for, the default long_sword', () => {
    const inventory = new Inventory()
    seedDefaultRoleWeapon(inventory, 'guard')
    seedGuardCrossbowLoadout(inventory, 'npc:guard:additional')
    expect(inventory.holdsAny('long_sword')).toBe(true)
  })
})

describe('seedShepherdSlingLoadout (plan items-player-059 §12)', () => {
  it('gives a real but partial fraction of shepherds a sling, deterministically per npc id', () => {
    let hits = 0
    for (let i = 0; i < 200; i++) {
      const inventory = new Inventory()
      seedShepherdSlingLoadout(inventory, `npc:shepherd-sling:${i}`)
      if (inventory.holdsAny('sling')) {
        hits++
        expect(inventory.count('stone')).toBe(4)
      } else {
        expect(inventory.count('stone')).toBe(0)
      }
    }
    expect(hits).toBeGreaterThan(0)
    expect(hits).toBeLessThan(200)
  })

  it('is deterministic and idempotent for the same npc id', () => {
    const a = new Inventory()
    seedShepherdSlingLoadout(a, 'npc:shepherd-sling:stable')
    const gotSling = a.holdsAny('sling')
    seedShepherdSlingLoadout(a, 'npc:shepherd-sling:stable')
    expect(a.holdsAny('sling')).toBe(gotSling)
    expect(a.count('sling')).toBeLessThanOrEqual(1)
  })

  it('never changes the existing shepherd primary melee weapon roll', () => {
    const withSling = new Inventory()
    seedShepherdPrimaryWeapon(withSling, 'npc:shepherd-both')
    const primaryBefore = SHEPHERD_PRIMARY_WEAPON_KINDS.find((kind) => withSling.holdsAny(kind))
    seedShepherdSlingLoadout(withSling, 'npc:shepherd-both')
    const primaryAfter = SHEPHERD_PRIMARY_WEAPON_KINDS.find((kind) => withSling.holdsAny(kind))
    expect(primaryAfter).toBe(primaryBefore)
  })
})

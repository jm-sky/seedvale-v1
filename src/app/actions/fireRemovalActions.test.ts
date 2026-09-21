import { describe, expect, it, vi } from 'vitest'
import type { VillageFire } from '../../settlement/VillageFire'
import type { PlayerActionContext } from './actionContext'
import { FIRE_PIT_STONE_COST } from '../userActions'
import {
  createFireRemovalActions,
  isPlacedFireDismantleShortcut,
} from './fireRemovalActions'

function fireStub(lit: boolean): VillageFire {
  return { isLit: () => lit } as VillageFire
}

function makeCtx(opts: {
  entry?: {
    id: string
    x: number
    z: number
    kind: 'simple' | 'pit' | 'pile'
    grate: boolean
    hasBurned: boolean
    habitatBurn?: boolean
    lit?: boolean
  } | null
}) {
  const grantItem = vi.fn()
  const addResidue = vi.fn()
  const remove = vi.fn(() => true)
  const entry = opts.entry
    ? {
      ...opts.entry,
      habitatBurn: opts.entry.habitatBurn === true,
      fire: fireStub(opts.entry.lit === true),
      everLit: false,
      unlitSeconds: 0,
    }
    : undefined
  const ctx = {
    bundle: {
      placedFires: {
        find: (id: string) => (entry && entry.id === id ? entry : undefined),
        remove,
      },
      fireResidues: { add: addResidue },
    },
    busy: { isActive: () => false },
    timeSkip: { isActive: () => false },
    restCamp: { isActive: () => false },
    dayNight: { elapsedDays: 4.5 },
    grantItem,
    hud: { setInventoryWeight: vi.fn() },
    inventory: { totalWeight: () => 0, maxWeight: () => 100 },
    onInventoryChanged: vi.fn(),
    syncQuickActionAvailability: vi.fn(),
    toast: { show: vi.fn() },
  } as unknown as PlayerActionContext
  return { ctx, grantItem, addResidue, remove, toast: ctx.toast }
}

describe('createFireRemovalActions (plan items-player-058)', () => {
  it('previews simple without salvage and pit with FIRE_PIT_STONE_COST', () => {
    const simple = createFireRemovalActions(makeCtx({
      entry: { id: 'f1', x: 1, z: 2, kind: 'simple', grate: false, hasBurned: true },
    }).ctx).previewPlacedFireRemoval('f1')
    expect(simple).toMatchObject({ fireKind: 'simple', salvageCount: 0, canReceive: true, actionLabel: 'Usuń ognisko' })

    const pit = createFireRemovalActions(makeCtx({
      entry: { id: 'f2', x: 1, z: 2, kind: 'pit', grate: false, hasBurned: false },
    }).ctx).previewPlacedFireRemoval('f2')
    expect(pit).toMatchObject({
      fireKind: 'pit',
      salvageCount: FIRE_PIT_STONE_COST,
      canReceive: true,
      actionLabel: 'Rozbierz palenisko',
    })
  })

  it('blocks pit+grate and ignores pile/missing', () => {
    const grate = createFireRemovalActions(makeCtx({
      entry: { id: 'f3', x: 0, z: 0, kind: 'pit', grate: true, hasBurned: true },
    }).ctx).previewPlacedFireRemoval('f3')
    expect(grate).toMatchObject({ canReceive: false, reasonLabel: 'Najpierw zdemontuj ruszt.' })

    const pile = createFireRemovalActions(makeCtx({
      entry: { id: 'f4', x: 0, z: 0, kind: 'pile', grate: false, hasBurned: false },
    }).ctx).previewPlacedFireRemoval('f4')
    expect(pile).toBeNull()

    const missing = createFireRemovalActions(makeCtx({ entry: null }).ctx).previewPlacedFireRemoval('gone')
    expect(missing).toBeNull()
  })

  it('commits pit salvage and residue only when hasBurned, once', () => {
    const used = makeCtx({
      entry: { id: 'pit-used', x: 3, z: 4, kind: 'pit', grate: false, hasBurned: true },
    })
    const actions = createFireRemovalActions(used.ctx)
    expect(actions.commitPlacedFireRemoval('pit-used')).toBe(true)
    expect(used.remove).toHaveBeenCalledTimes(1)
    expect(used.grantItem).toHaveBeenCalledWith('stone', FIRE_PIT_STONE_COST)
    expect(used.addResidue).toHaveBeenCalledWith(3, 4, 4.5)

    used.remove.mockReturnValueOnce(false)
    expect(actions.commitPlacedFireRemoval('pit-used')).toBe(false)
    expect(used.grantItem).toHaveBeenCalledTimes(1)
    expect(used.addResidue).toHaveBeenCalledTimes(1)
  })

  it('does not create residue for a never-used pit and grants no branches for simple', () => {
    const cold = makeCtx({
      entry: { id: 'pit-cold', x: 0, z: 1, kind: 'pit', grate: false, hasBurned: false },
    })
    expect(createFireRemovalActions(cold.ctx).commitPlacedFireRemoval('pit-cold')).toBe(true)
    expect(cold.grantItem).toHaveBeenCalledWith('stone', FIRE_PIT_STONE_COST)
    expect(cold.addResidue).not.toHaveBeenCalled()

    const simple = makeCtx({
      entry: { id: 'simple', x: 2, z: 2, kind: 'simple', grate: false, hasBurned: true },
    })
    expect(createFireRemovalActions(simple.ctx).commitPlacedFireRemoval('simple')).toBe(true)
    expect(simple.grantItem).not.toHaveBeenCalled()
    expect(simple.addResidue).toHaveBeenCalledTimes(1)
  })

  it('does not commit when a grate is present', () => {
    const blocked = makeCtx({
      entry: { id: 'grate', x: 0, z: 0, kind: 'pit', grate: true, hasBurned: true },
    })
    expect(createFireRemovalActions(blocked.ctx).commitPlacedFireRemoval('grate')).toBe(false)
    expect(blocked.remove).not.toHaveBeenCalled()
    expect(blocked.grantItem).not.toHaveBeenCalled()
  })
})

describe('isPlacedFireDismantleShortcut (plan items-player-058)', () => {
  it('overrides only player simple/pit while a soil_digging tool is held', () => {
    expect(isPlacedFireDismantleShortcut({ kind: 'placed', id: 'a', fireKind: 'simple' }, 'shovel')).toBe(true)
    expect(isPlacedFireDismantleShortcut({ kind: 'placed', id: 'a', fireKind: 'pit' }, 'shovel')).toBe(true)
    expect(isPlacedFireDismantleShortcut({ kind: 'placed', id: 'a', fireKind: 'pile' }, 'shovel')).toBe(false)
    expect(isPlacedFireDismantleShortcut({ kind: 'placed', id: 'a', fireKind: 'simple' }, 'axe')).toBe(false)
    expect(isPlacedFireDismantleShortcut({ kind: 'placed', id: 'a', fireKind: 'simple' }, null)).toBe(false)
    expect(isPlacedFireDismantleShortcut({ kind: 'settlement' }, 'shovel')).toBe(false)
  })
})

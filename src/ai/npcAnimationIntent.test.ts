import { describe, expect, it } from 'vitest'
import type { Role } from './characters'
import type { ActionId } from './npcAction'
import {
  isBulkyCargo,
  isBulkyCargoPresentation,
  resolveNpcAnimationIntent,
  type ResolveNpcAnimationIntentInput,
} from './npcAnimationIntent'

const ALL_ACTION_IDS: readonly ActionId[] = [
  'chop',
  'conversation',
  'deposit',
  'drink',
  'eat',
  'exchange',
  'fish',
  'harvest',
  'heal',
  'mine',
  'plant',
  'sharpen',
  'shear',
  'shelter',
  'social',
  'work',
  'approachPlayer',
  'bury',
  'cleanAnimalCorpse',
  'visitGrave',
  'accompany',
  'travel',
  'waterGarden',
]

function base(overrides: Partial<ResolveNpcAnimationIntentInput> = {}): ResolveNpcAnimationIntentInput {
  return {
    phase: 'choose',
    actionKind: null,
    chainKind: null,
    role: 'farmer',
    moving: false,
    run: false,
    bulkyCargo: false,
    ...overrides,
  }
}

describe('isBulkyCargo', () => {
  it('accepts branch and beam only', () => {
    expect(isBulkyCargo({ holdsAny: (k) => k === 'branch' })).toBe(true)
    expect(isBulkyCargo({ holdsAny: (k) => k === 'beam' })).toBe(true)
    expect(isBulkyCargo({ holdsAny: (k) => k === 'berries' })).toBe(false)
    expect(isBulkyCargo({ holdsAny: (k) => k === 'iron' })).toBe(false)
  })
})

describe('isBulkyCargoPresentation', () => {
  it('detects inventory wood/beams on carried or transportCargo', () => {
    expect(isBulkyCargoPresentation({
      carried: { holdsAny: (k) => k === 'beam' },
      actionKind: null,
      chainKind: null,
    })).toBe(true)
    expect(isBulkyCargoPresentation({
      transportCargo: { holdsAny: (k) => k === 'branch' },
      actionKind: 'travel',
      chainKind: null,
    })).toBe(true)
  })

  it('treats chop→deposit as bulky even without inventory', () => {
    expect(isBulkyCargoPresentation({
      actionKind: 'deposit',
      chainKind: 'chop',
    })).toBe(true)
  })

  it('treats wood exchange→deposit as bulky via activeNeed', () => {
    expect(isBulkyCargoPresentation({
      actionKind: 'deposit',
      chainKind: 'exchange',
      activeNeed: 'wood',
    })).toBe(true)
    expect(isBulkyCargoPresentation({
      actionKind: 'deposit',
      chainKind: 'exchange',
      activeNeed: 'food',
    })).toBe(false)
  })

  it('does not treat ordinary food inventory as bulky', () => {
    expect(isBulkyCargoPresentation({
      carried: { holdsAny: (k) => k === 'berries' },
      actionKind: 'deposit',
      chainKind: 'harvest',
    })).toBe(false)
  })
})

describe('resolveNpcAnimationIntent', () => {
  it('maps every ActionId while stationary busy', () => {
    const expected: Record<ActionId, string> = {
      chop: 'chopTree',
      harvest: 'farmHarvest',
      plant: 'farmPlant',
      waterGarden: 'farmWater',
      eat: 'consume',
      conversation: 'talk',
      mine: 'mine',
      fish: 'fish',
      work: 'interact',
      drink: 'interact',
      deposit: 'interact',
      exchange: 'interact',
      sharpen: 'interact',
      shear: 'interact',
      bury: 'interact',
      cleanAnimalCorpse: 'interact',
      visitGrave: 'interact',
      heal: 'interact',
      shelter: 'interact',
      social: 'interact',
      approachPlayer: 'interact',
      accompany: 'interact',
      travel: 'interact',
    }
    for (const actionKind of ALL_ACTION_IDS) {
      const intent = resolveNpcAnimationIntent(base({
        phase: 'execute',
        actionKind,
        moving: false,
      }))
      expect(intent, actionKind).toBe(expected[actionKind])
    }
  })

  it('uses fixKneeling for herbalist/textile/blacksmith/hunter generic work', () => {
    const roles: Role[] = ['herbalist', 'textile_worker', 'blacksmith', 'hunter']
    for (const role of roles) {
      expect(resolveNpcAnimationIntent(base({
        phase: 'execute',
        actionKind: 'work',
        role,
      }))).toBe('fixKneeling')
    }
    for (const role of ['trader', 'miner', 'fisher', 'shepherd', 'farmer', 'woodcutter', 'guard'] as Role[]) {
      expect(resolveNpcAnimationIntent(base({
        phase: 'execute',
        actionKind: 'work',
        role,
      }))).toBe('interact')
    }
  })

  it('prefers stationary busy action over stale moving=true', () => {
    expect(resolveNpcAnimationIntent(base({
      phase: 'execute',
      actionKind: 'harvest',
      moving: true,
      run: true,
      bulkyCargo: true,
    }))).toBe('farmHarvest')
  })

  it('selects run over walkCarry over walk', () => {
    expect(resolveNpcAnimationIntent(base({
      moving: true,
      run: true,
      bulkyCargo: true,
    }))).toBe('run')
    expect(resolveNpcAnimationIntent(base({
      moving: true,
      bulkyCargo: true,
    }))).toBe('walkCarry')
    expect(resolveNpcAnimationIntent(base({
      moving: true,
    }))).toBe('walk')
  })

  it('returns layToIdle while sleeping and idle otherwise', () => {
    expect(resolveNpcAnimationIntent(base({ phase: 'sleep' }))).toBe('layToIdle')
    expect(resolveNpcAnimationIntent(base({ phase: 'choose' }))).toBe('idle')
  })

  it('uses sitTalk / sitIdle only when already seated', () => {
    expect(resolveNpcAnimationIntent(base({
      phase: 'execute',
      actionKind: 'conversation',
      seated: true,
    }))).toBe('sitTalk')
    expect(resolveNpcAnimationIntent(base({
      phase: 'execute',
      actionKind: 'social',
      seated: true,
    }))).toBe('sitIdle')
  })

  it('does not consult role for concrete ActionIds', () => {
    expect(resolveNpcAnimationIntent(base({
      phase: 'execute',
      actionKind: 'mine',
      role: 'herbalist',
    }))).toBe('mine')
    expect(resolveNpcAnimationIntent(base({
      phase: 'execute',
      actionKind: 'chop',
      role: 'blacksmith',
    }))).toBe('chopTree')
  })
})

import { describe, expect, it } from 'vitest'
import { AUTHORED_STARTER_DAMAGE_CONDITION, pristineStructureState } from '../settlement/structureCondition'
import { AUTHORED_REPAIR_DELIVERIES, isAuthoredRepairTargetIntact } from './authoredRepairDeliveries'

describe('AUTHORED_REPAIR_DELIVERIES (plan quests-progression-073)', () => {
  it('routes Piotr\'s private deliveries to his household', () => {
    expect(AUTHORED_REPAIR_DELIVERIES['drewno-na-naprawe']).toEqual({
      owner: 'household',
      structureIdKind: 'householdFence',
    })
    expect(AUTHORED_REPAIR_DELIVERIES['kamienie-dla-piotra']).toEqual({
      owner: 'household',
      structureIdKind: 'residentialFoundation',
    })
    expect(AUTHORED_REPAIR_DELIVERIES['drewno-dla-piotra']).toEqual({
      owner: 'household',
      structureIdKind: 'loggingWagon',
    })
  })

  it('routes Anna\'s communal delivery to the settlement economy', () => {
    expect(AUTHORED_REPAIR_DELIVERIES['drewno-dla-anny']).toEqual({
      owner: 'settlementEconomy',
      structureIdKind: 'communalFence',
    })
  })
})

describe('isAuthoredRepairTargetIntact (plan quests-progression-077)', () => {
  const settlementId = 'home'
  const structureId = 'household-fence-0'

  it.each(Object.entries(AUTHORED_REPAIR_DELIVERIES))(
    '%s: a missing stored record is never intact, even though resolve() would be pristine',
    (_questId, target) => {
      expect(isAuthoredRepairTargetIntact(target, undefined, 0)).toBe(false)
    },
  )

  it.each(Object.entries(AUTHORED_REPAIR_DELIVERIES))(
    '%s: a stored starter-damage record is not intact',
    (_questId, target) => {
      const damaged = {
        ...pristineStructureState(settlementId, structureId, 0),
        condition: AUTHORED_STARTER_DAMAGE_CONDITION,
        autonomousRepairReserved: true,
      }
      expect(isAuthoredRepairTargetIntact(target, damaged, 0)).toBe(false)
    },
  )

  it.each(Object.entries(AUTHORED_REPAIR_DELIVERIES))(
    '%s: a stored fully-repaired record is intact',
    (_questId, target) => {
      const repaired = pristineStructureState(settlementId, structureId, 0)
      expect(isAuthoredRepairTargetIntact(target, repaired, 0)).toBe(true)
    },
  )
})

import { describe, expect, it } from 'vitest'
import { AUTHORED_REPAIR_DELIVERIES } from './authoredRepairDeliveries'

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

import { describe, expect, it } from 'vitest'
import { projectInventoryRows } from '../../components/items/inventoryPresentation'
import { cloneScenario, DEMO_SCENARIOS } from './fixtures'

describe('inventory-list demo fixtures', () => {
  it('builds hybrid rows for every scenario without exploding stacks', () => {
    for (const scenario of DEMO_SCENARIOS) {
      const rows = projectInventoryRows(scenario.groups)
      expect(rows.length).toBeLessThan(500)
      if (scenario.id === 'large-stack') {
        const arrow = rows.find((r) => r.kind === 'arrow')
        expect(arrow?.type).toBe('group')
        expect(arrow?.count).toBe(10_000)
      }
      if (scenario.id === 'full-bag') {
        expect(rows.some((r) => r.type === 'instance' && r.kind === 'leather_armor')).toBe(true)
        expect(rows.filter((r) => r.kind === 'leather_armor').length).toBe(3)
      }
    }
  })

  it('cloneScenario deep-copies groups', () => {
    const a = cloneScenario('full-bag')
    const b = cloneScenario('full-bag')
    expect(a.groups).not.toBe(b.groups)
    expect(a.groups[0]?.instances).not.toBe(b.groups[0]?.instances)
  })
})

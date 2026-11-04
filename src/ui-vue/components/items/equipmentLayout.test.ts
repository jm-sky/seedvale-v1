import { describe, expect, it } from 'vitest'
import { EQUIPMENT_SLOTS } from '../../../items/equipment'
import { EQUIPMENT_LAYOUT } from './equipmentLayout'

describe('anatomical equipment layout', () => {
  it('has all seven real slots, held and shield exactly once', () => {
    const keys = EQUIPMENT_LAYOUT.map(cell => cell.key)
    expect(new Set(keys).size).toBe(keys.length)
    expect([...keys].sort()).toEqual([...EQUIPMENT_SLOTS, 'held', 'shield'].sort())
    expect(keys).toEqual(['head', 'shoulders', 'body', 'forearms', 'hands', 'legs', 'feet', 'held', 'shield'])
    expect(EQUIPMENT_LAYOUT.find(cell => cell.key === 'forearms')?.label).toBe('Przedramiona')
  })
})

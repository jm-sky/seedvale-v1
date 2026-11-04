import { describe, expect, it } from 'vitest'
import type { EquipmentPositionKey } from '../../../items/equipmentTypes'
import type { EquipmentSlotView } from './equipmentPanelTypes'
import { EQUIPMENT_POSITIONS, EQUIPMENT_SLOTS } from '../../../items/equipment'
import { buildArmorCellRows, EMPTY_ROW_TEXT, EQUIPMENT_LAYOUT, NO_COMPATIBLE_ROW_TEXT } from './equipmentLayout'

function view(position: EquipmentPositionKey, label: string | null, instanceId: string | null): EquipmentSlotView {
  const [slot, layer] = position.split(':') as [EquipmentSlotView['slot'], EquipmentSlotView['layer']]
  return { position, slot, layer, instanceId, label, quality: null, qualityLabel: label ? 'dobry' : null }
}

describe('anatomical equipment layout', () => {
  it('has all seven real slots, held and shield exactly once', () => {
    const keys = EQUIPMENT_LAYOUT.map(cell => cell.key)
    expect(new Set(keys).size).toBe(keys.length)
    expect([...keys].sort()).toEqual([...EQUIPMENT_SLOTS, 'held', 'shield'].sort())
    expect(keys).toEqual(['head', 'shoulders', 'body', 'forearms', 'hands', 'legs', 'feet', 'held', 'shield'])
    expect(EQUIPMENT_LAYOUT.find(cell => cell.key === 'forearms')?.label).toBe('Przedramiona')
  })

  it('exposes every one of the 14 positions exactly once, anatomy first, under before outer', () => {
    const flat = EQUIPMENT_LAYOUT.flatMap(cell => cell.positions)
    expect(new Set(flat).size).toBe(14)
    expect([...flat].sort()).toEqual([...EQUIPMENT_POSITIONS].sort())
    expect(flat.slice(0, 6)).toEqual(['head:under', 'head:outer', 'shoulders:under', 'shoulders:outer', 'body:under', 'body:outer'])
    expect(EQUIPMENT_LAYOUT.filter(cell => ['held', 'shield'].includes(cell.key)).every(cell => cell.positions.length === 0)).toBe(true)
  })
})

describe('buildArmorCellRows', () => {
  const body = EQUIPMENT_LAYOUT.find(cell => cell.key === 'body')!
  const ctx = {
    slots: [view('body:under', 'Pikowana kurta', 'u1'), view('body:outer', null, null)],
    positionsWithCandidates: new Set<EquipmentPositionKey>(['body:outer']),
    highlightPosition: 'body:outer' as EquipmentPositionKey,
    compareInstanceId: 'u1',
  }

  it('returns under then outer rows with exact-position state', () => {
    const rows = buildArmorCellRows(body, ctx)
    expect(rows.map(r => r.position)).toEqual(['body:under', 'body:outer'])
    expect(rows.map(r => r.layerLabel)).toEqual(['Spód', 'Wierzch'])
    expect(rows[0]).toMatchObject({ state: 'worn', itemLabel: 'Pikowana kurta', compared: true, highlighted: false })
    expect(rows[1]).toMatchObject({ state: 'empty', emptyText: EMPTY_ROW_TEXT, highlighted: true, compared: false })
  })

  it('tells an empty row apart from one nothing owned could fill', () => {
    const rows = buildArmorCellRows(body, { ...ctx, positionsWithCandidates: new Set() })
    expect(rows[1]!.emptyText).toBe(NO_COMPATIBLE_ROW_TEXT)
  })
})

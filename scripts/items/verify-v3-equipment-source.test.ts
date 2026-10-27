import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { MeleeWeapon, V3EquipmentDefinition } from '../../src/items/v3Equipment/types'
import { V3_EQUIPMENT_DEFINITIONS } from '../../src/items/v3Equipment/catalogue'
import { assertSourceEqual, readReviewedIds, resolvePinnedDefinitions, verifyDefinitions, verifySource } from './verify-v3-equipment-source'

const expected = resolvePinnedDefinitions()
const copy = () => structuredClone(expected) as V3EquipmentDefinition[]

describe('pinned V3 equipment source verification', () => {
  it('parses reviewed Markdown with LF or CRLF without changing pinned source bytes', () => {
    const mapping = readFileSync(new URL('../../docs/research/v1-revival/2026-10-27--equipment-id-mapping.md', import.meta.url), 'utf8').replaceAll('\r\n', '\n')
    expect(readReviewedIds(mapping)).toHaveLength(87)
    expect(readReviewedIds(mapping.replaceAll('\n', '\r\n'))).toEqual(readReviewedIds(mapping))
    expect(() => readReviewedIds('missing')).toThrow(/missing the All definitions section/)
  })
  it('verifies original source blobs, donor types and every imported field without an external checkout', { timeout: 30_000 }, () => {
    verifySource()
  })

  it('does not mutate either input', () => {
    const sourceBefore = structuredClone(expected)
    verifyDefinitions(V3_EQUIPMENT_DEFINITIONS, expected)
    expect(expected).toStrictEqual(sourceBefore)
  })

  it('rejects a duplicate canonical ID within a family', () => {
    const actual = copy()
    actual[1] = actual[0]!
    expect(() => verifyDefinitions(actual, expected)).toThrow(/duplicate canonical ID/)
  })

  it('rejects a duplicate canonical ID across families', () => {
    const actual = copy()
    actual[30] = { ...actual[30]!, id: actual[0]!.id }
    expect(() => verifyDefinitions(actual, expected)).toThrow(/duplicate canonical ID/)
  })

  it('rejects a missing record', () => {
    expect(() => verifyDefinitions(copy().slice(1), expected)).toThrow(/missing canonical IDs: knife/)
  })

  it('rejects an unexpected record', () => {
    const actual = [...copy(), { ...expected[0]!, id: 'unexpected' }]
    expect(() => verifyDefinitions(actual, expected)).toThrow(/unexpected canonical IDs: unexpected/)
  })

  it('rejects a single modified numeric property', () => {
    const actual = copy()
    actual[0] = { ...actual[0] as MeleeWeapon, damage: 7.01 }
    expect(() => verifyDefinitions(actual, expected)).toThrow(/knife.damage: source value differs/)
  })

  it('rejects a modified nested resistance', () => {
    const actual = copy()
    const index = actual.findIndex(item => item.id === 'padded_cap')
    const armor = actual[index]!
    if (armor.category !== 'armor') throw new Error('Expected armor fixture')
    actual[index] = { ...armor, resist: { ...armor.resist, cut: 0.151 } }
    expect(() => verifyDefinitions(actual, expected)).toThrow(/padded_cap.resist.cut/)
  })

  it('rejects a missing optional key with a defined value', () => {
    const actual = copy()
    const index = actual.findIndex(item => item.id === 'ashgrove_dagger')
    const { lore: _lore, ...withoutLore } = actual[index]!
    actual[index] = withoutLore
    expect(() => verifyDefinitions(actual, expected)).toThrow(/ashgrove_dagger: own property keys/)
  })

  it('rejects a present-but-undefined key becoming absent', () => {
    const actual = copy()
    const index = actual.findIndex(item => item.id === 'padded_cap')
    expect(Object.hasOwn(actual[index]!, 'lore')).toBe(true)
    expect(actual[index]!.lore).toBeUndefined()
    const { lore: _lore, ...withoutLore } = actual[index]!
    actual[index] = withoutLore
    expect(() => verifyDefinitions(actual, expected)).toThrow(/padded_cap: own property keys/)
  })

  it('rejects adding an absent optional key with undefined', () => {
    const actual = copy()
    expect(Object.hasOwn(actual[0]!, 'lore')).toBe(false)
    actual[0] = { ...actual[0]!, lore: undefined }
    expect(() => verifyDefinitions(actual, expected)).toThrow(/knife: own property keys/)
  })

  it('distinguishes null from undefined', () => {
    expect(() => assertSourceEqual({ lore: null }, { lore: undefined }, 'fixture')).toThrow(/fixture.lore/)
  })

  it('rejects a reordered array (synthetic multi-capability fixture)', () => {
    // The pinned donor capability arrays have only one entry. Exercise the same
    // validator with two entries so an accidental array sort cannot pass unnoticed.
    const source = copy()
    source[0] = { ...source[0] as MeleeWeapon, capabilities: ['cut', 'chop'] }
    const actual = structuredClone(source)
    actual[0] = { ...actual[0] as MeleeWeapon, capabilities: ['chop', 'cut'] }
    expect(() => verifyDefinitions(actual, source)).toThrow(/knife.capabilities.0/)
  })

  it('rejects reordered definitions', () => {
    const actual = copy()
    ;[actual[0], actual[1]] = [actual[1]!, actual[0]!]
    expect(() => verifyDefinitions(actual, expected)).toThrow(/canonical ID ordering drift/)
  })

  it('rejects an incorrect family count even with the same ID set', () => {
    const actual = copy()
    actual[0] = { ...actual[30]!, id: actual[0]!.id }
    expect(() => verifyDefinitions(actual, expected)).toThrow(/family count drift: melee/)
  })
})

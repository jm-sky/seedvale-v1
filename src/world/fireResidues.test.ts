import { Scene } from 'three'
import { describe, expect, it } from 'vitest'
import {
  createFireResidues,
  FIRE_RESIDUE_LIFETIME_DAYS,
  fireResidueExpiresAt,
  type FireResidueRecord,
  isFireResidueActive,
} from './fireResidues'

describe('fire residue expiry (plan items-player-058)', () => {
  it('expires exactly one world day after creation', () => {
    expect(FIRE_RESIDUE_LIFETIME_DAYS).toBe(1)
    expect(fireResidueExpiresAt(12.25)).toBe(13.25)
  })

  it('is active strictly before expiresAtDay', () => {
    const record: FireResidueRecord = {
      id: 'ash:1',
      x: 0,
      z: 0,
      createdAtDay: 2,
      expiresAtDay: 3,
    }
    expect(isFireResidueActive(record, 2)).toBe(true)
    expect(isFireResidueActive(record, 2.99)).toBe(true)
    expect(isFireResidueActive(record, 3)).toBe(false)
    expect(isFireResidueActive(record, 10)).toBe(false)
  })

  it('add creates one record and reconcile drops it after expiry and after a large jump', () => {
    const residues = createFireResidues(new Scene(), () => 0, [], 4)
    residues.add(8, -3, 4)
    expect(residues.nodes()).toHaveLength(1)
    residues.reconcile(4.5)
    expect(residues.nodes()).toHaveLength(1)
    residues.reconcile(5)
    expect(residues.nodes()).toHaveLength(0)

    residues.add(1, 1, 10)
    residues.reconcile(40)
    expect(residues.nodes()).toHaveLength(0)
    residues.dispose()
  })

  it('does not restore expired records from an initial snapshot', () => {
    const residues = createFireResidues(new Scene(), () => 0, [
      { id: 'ash:old', x: 0, z: 0, createdAtDay: 1, expiresAtDay: 2 },
      { id: 'ash:live', x: 2, z: 2, createdAtDay: 3, expiresAtDay: 4 },
    ], 3)
    expect(residues.nodes().map((entry) => entry.id)).toEqual(['ash:live'])
    residues.dispose()
  })
})

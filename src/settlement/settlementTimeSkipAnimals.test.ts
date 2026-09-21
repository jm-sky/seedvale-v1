import { describe, expect, it } from 'vitest'
import { visitUniqueAnimalsById } from './settlementTimeSkipAnimals'

describe('visitUniqueAnimalsById (plan world-034)', () => {
  it('fans out livestock, rats and detached animals exactly once', () => {
    const seen: string[] = []
    const livestock = [{ animalId: 'sheep-1' }, { animalId: 'cow-1' }]
    const rats = [{ animalId: 'rat-1' }]
    const detached = [{ animalId: 'horse-1' }]
    visitUniqueAnimalsById([livestock, rats, detached], (animal) => {
      seen.push(animal.animalId)
    })
    expect(seen).toEqual(['sheep-1', 'cow-1', 'rat-1', 'horse-1'])
  })

  it('does not double-apply catch-up when the same animalId appears in two collections', () => {
    const seen: string[] = []
    const livestock = [{ animalId: 'horse-1' }]
    const detached = [{ animalId: 'horse-1' }, { animalId: 'horse-2' }]
    visitUniqueAnimalsById([livestock, detached], (animal) => {
      seen.push(animal.animalId)
    })
    expect(seen).toEqual(['horse-1', 'horse-2'])
  })
})

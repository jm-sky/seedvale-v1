/**
 * Settlement-owned animal catch-up membership (plan world-034).
 *
 * Authoritative identity is collection membership + `animalId`, never
 * `AnimalDef.role` (sheep/chicken may be `prey` while still livestock).
 * Wild `Fauna.agents` are a separate pool and must not be mixed in.
 *
 * @domain world
 */

export function visitUniqueAnimalsById<T extends { animalId: string }>(
  collections: Iterable<Iterable<T>>,
  visit: (animal: T) => void,
): void {
  const seen = new Set<string>()
  for (const collection of collections) {
    for (const animal of collection) {
      if (seen.has(animal.animalId)) continue
      seen.add(animal.animalId)
      visit(animal)
    }
  }
}

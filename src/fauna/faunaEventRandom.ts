import { settlementFaunaSiteRandom } from './settlementFaunaHabitats'

/**
 * Entity/event-keyed random stream (fauna-050 C4, notes § C1.6).
 *
 * A fresh stream for `(worldSeed, key)`: the same key always yields the same
 * sequence, independent of group materialization order, frame partitioning or
 * save/load. Callers pick a stable key from durable identity
 * (`life:<animalId>`, `birth:<habitatId>:<seq>`, `rabies:<a>:<b>:<minute>` ...).
 * One-shot draws take `faunaEventRandom(seed, key)()`; the only long-lived
 * stream is the per-agent `wander:<animalId>` one (cursor not persisted).
 */
export function faunaEventRandom(worldSeed: number, key: string): () => number {
  return settlementFaunaSiteRandom(worldSeed, key)
}

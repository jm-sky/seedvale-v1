import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'slad-przy-monolicie',
  version: 'v1',
  title: 'Ślad przy monolicie',
  titleEn: 'Trail by the Monolith',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Anna',
  place: 'monolith landmark (bound at runtime through deferred world knowledge)',
  category: 'investigation',
  difficulty: 'medium',
  prerequisites: [],
  rewards: ['relation Anna +2'],
  sourceFlags: {
    stages: 2,
    outcomes: 'reported, route_lost',
  },
  derived: ['titleEn', 'category', 'difficulty', 'place'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-047-deferred-world-knowledge-and-location-research.md',
    ],
  },
  notes: [
    'Built by buildLandmarkQuests (quests.ts ~2545-2727); always offered, not gated by the landmark resolver.',
    'Uses the deferred world-knowledge path (plan quests-progression-047): Anna needs about one hour (WORLD_KNOWLEDGE_HOUR_DAYS) before the route is known.',
    'No abandonment block in the builder; abandonment behaviour is not recorded here (❓).',
  ],
}

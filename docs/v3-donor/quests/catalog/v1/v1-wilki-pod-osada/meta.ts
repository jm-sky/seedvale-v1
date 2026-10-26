import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'wilki-pod-osada',
  version: 'v1',
  title: 'Wilki pod osadą',
  titleEn: 'Wolves Under the Settlement',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Anna',
  place: null,
  category: 'hunting',
  difficulty: 'hard',
  prerequisites: [],
  rewards: [
    'relation Anna +2',
    'reputation competence +20, courage +22, benevolence +8',
    'renown +35',
  ],
  sourceFlags: {
    stages: 1,
    outcomes: 'reported',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-007-wolves-approach-settlement.md',
    ],
  },
  notes: [
    'QUESTS array entry, quests.ts line 2170. Objective destroy_spawn_point uses WOLF_DEN_ID.',
    'The generated world:wolf-den-pressure opportunity (opportunities/settlementQuestOpportunities.ts) uses the same wolf-den title; the two are not verified to be the same quest.',
  ],
}

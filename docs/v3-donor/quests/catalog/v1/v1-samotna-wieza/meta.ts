import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'samotna-wieza',
  version: 'v1',
  title: 'Samotna wieża',
  titleEn: 'Lonely Tower',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Piotr',
  place: 'tower landmark in view of the settlement (resolved at world setup)',
  category: 'investigation',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['relation Piotr +1'],
  sourceFlags: {
    stages: 1,
    outcomes: 'reported',
  },
  derived: ['titleEn', 'category', 'difficulty', 'place'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
  },
  notes: [
    'Built by buildLandmarkQuests (quests.ts ~2545). Only added when resolve("tower") finds a landmark this session.',
  ],
}

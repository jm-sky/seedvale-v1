import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'stare-ruiny',
  version: 'v1',
  title: 'Stare ruiny',
  titleEn: 'Old Ruins',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Piotr',
  place: 'smallRuins landmark (resolved at world setup)',
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
    'Built by buildLandmarkQuests (quests.ts ~2545). Only added when resolve("smallRuins") finds a landmark this session.',
  ],
}

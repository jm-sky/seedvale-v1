import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'shells-dla-kasi',
  version: 'v1',
  title: 'Muszle dla Kasi',
  titleEn: 'Shells for Kasia',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Kasia',
  place: null,
  category: 'gathering',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['relation Kasia +1'],
  sourceFlags: {
    stages: 1,
    outcomes: 'delivered',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
  },
  notes: ['QUESTS array entry, quests.ts line 1781.'],
}

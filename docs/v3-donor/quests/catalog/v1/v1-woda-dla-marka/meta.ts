import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'woda-dla-marka',
  version: 'v1',
  title: 'Woda dla Marka',
  titleEn: 'Water for Marek',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Marek',
  place: null,
  category: 'delivery',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['coin x5 (shown)', 'relation Marek +1'],
  sourceFlags: {
    stages: 1,
    outcomes: 'delivered',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
  },
  notes: ['QUESTS array entry, quests.ts line 1807.'],
}

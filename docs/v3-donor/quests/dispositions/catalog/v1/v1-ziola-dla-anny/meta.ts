import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'ziola-dla-anny',
  version: 'v1',
  title: 'Zioła dla Anny',
  titleEn: 'Herbs for Anna',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Anna',
  place: null,
  category: 'gathering',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['coin x8 (shown)'],
  sourceFlags: {
    stages: 1,
    outcomes: 'delivered',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
  },
  notes: ['QUESTS array entry, quests.ts line 1976.'],
}

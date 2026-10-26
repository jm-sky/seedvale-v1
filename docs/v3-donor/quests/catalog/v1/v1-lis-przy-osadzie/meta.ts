import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'lis-przy-osadzie',
  version: 'v1',
  title: 'Lis przy osadzie',
  titleEn: 'Fox by the Settlement',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Marek',
  place: null,
  category: 'hunting',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['coin x20 (shown)', 'reputation competence +3', 'reputation courage +3', 'renown +3'],
  sourceFlags: {
    stages: 1,
    outcomes: 'reported',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
  },
  notes: ['QUESTS array entry, quests.ts line 2070.'],
}

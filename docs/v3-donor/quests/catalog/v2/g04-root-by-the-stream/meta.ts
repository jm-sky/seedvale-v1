import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'G04',
  version: 'v2',
  title: 'Root by the Stream',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'B-grok',
  scope: 'retained',
  implemented: true,
  giver: 'Dora Herbert',
  place: 'H, marsh',
  scale: 'medium',
  category: 'delivery',
  difficulty: 'medium',
  prerequisites: [
    'day 3 or later',
    'Dora alive',
  ],
  rewards: [
    'ontime: pay 20 from Dora if the advance flag is 10, otherwise 30; rep helpfulness+10',
    'late: pay 5 from Dora if the advance flag is 10, otherwise 15; rep helpfulness+5',
    'failed: none',
  ],
  sourceFlags: { stages: 2, endings: 3, deadlineHours: 48 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/g04.ts',
    tests: ['SeedVales-v2/src/game/sim/questG04.test.ts'],
    docs: ['catalog/v2/g04-root-by-the-stream/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'G03',
  version: 'v2',
  title: 'Night Torches',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'B-grok',
  scope: 'retained',
  implemented: true,
  giver: 'Mark Hornblower',
  place: 'H',
  scale: 'small',
  category: 'delivery',
  difficulty: 'easy',
  prerequisites: [
    'day 3 to 10',
    'posts 1 or more',
  ],
  rewards: [
    'together: pay 15 from home treasury; rep helpfulness+10 honesty+5',
    'show: pay 15 from home treasury; rep helpfulness+8',
    'tell: pay 15 from home treasury; rep honesty+5',
    'markSolved: none',
  ],
  sourceFlags: { stages: 4, endings: 4 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/g03.ts',
    tests: ['SeedVales-v2/src/game/sim/questG03.test.ts'],
    docs: ['catalog/v2/g03-night-torches/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

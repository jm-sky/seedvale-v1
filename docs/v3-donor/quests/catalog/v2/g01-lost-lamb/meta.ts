import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'G01',
  version: 'v2',
  title: 'Lost Lamb',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'B-grok',
  scope: 'retained',
  implemented: true,
  giver: 'Molly Lambert',
  place: 'H',
  scale: 'small',
  category: 'investigation',
  difficulty: 'easy',
  prerequisites: [
    'day 1 to 5',
    'not near the pen (r=40)',
  ],
  rewards: [
    'evidence: pay 15 and give 2 wool from Molly; rep helpfulness+10',
    'paid: pay 25 and give 2 wool from Molly; rep helpfulness+5',
    'taken_back: pay 15 and give 2 wool from Molly; rep helpfulness+8 courage+3',
    'guard: pay 15 and give 2 wool from Molly; rep helpfulness+8',
    'sold: none (Pip is lost)',
  ],
  sourceFlags: { stages: 4, endings: 5 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/g01.ts',
    tests: ['SeedVales-v2/src/game/sim/questG01.test.ts'],
    docs: ['catalog/v2/g01-lost-lamb/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

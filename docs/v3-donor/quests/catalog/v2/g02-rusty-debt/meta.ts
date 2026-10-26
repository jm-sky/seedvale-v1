import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'G02',
  version: 'v2',
  title: 'Rusty Debt',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'B-grok',
  scope: 'retained',
  implemented: true,
  giver: 'Bernard Smith',
  place: 'V <-> H',
  scale: 'medium',
  category: 'trade',
  difficulty: 'medium',
  prerequisites: [
    'visited V',
    'treasury at 35 or more (which treasury: not stated)',
  ],
  rewards: [
    'settled30: rep honesty+5 (H, V)',
    'mended: rep helpfulness+8 honesty+5 (H, V)',
    'returned: player gives 1 plowshare to Bernard\'s store',
    'pressured: rep courage+3',
    'abandoned: none',
  ],
  sourceFlags: { stages: 4, endings: 5 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/g02.ts',
    tests: ['SeedVales-v2/src/game/sim/questG02.test.ts'],
    docs: ['catalog/v2/g02-rusty-debt/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
  notes: [
    '❓ treasury named in the gte-35 start condition is not stated',
  ],
}

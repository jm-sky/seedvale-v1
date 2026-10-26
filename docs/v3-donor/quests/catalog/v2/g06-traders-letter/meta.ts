import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'G06',
  version: 'v2',
  title: 'The Trader\'s Letter',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'B-grok',
  scope: 'retained',
  implemented: true,
  giver: 'Stephen Chapman',
  place: 'H -> V',
  scale: 'medium',
  category: 'trade',
  difficulty: 'medium',
  prerequisites: [
    'visited V',
    'Stephen opinion 10 or more, or quest q09 done (started)',
  ],
  rewards: [
    'agreed: pay 10 from Stephen; letter consumed',
    'capped: pay 12 from Stephen; rep helpfulness+5 (H, V); letter consumed',
    'refused: pay 10 from Stephen; letter consumed',
    'public: pay 10 from Stephen and 10 from V treasury; rep honesty+10 renown+5 (H, V); letter consumed',
    'late: none (letter consumed)',
  ],
  sourceFlags: { stages: 3, endings: 5 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/g06.ts',
    tests: ['SeedVales-v2/src/game/sim/questG06.test.ts'],
    docs: ['catalog/v2/g06-traders-letter/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

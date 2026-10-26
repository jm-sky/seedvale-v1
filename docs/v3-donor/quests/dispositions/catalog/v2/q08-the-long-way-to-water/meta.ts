import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q08',
  version: 'v2',
  title: 'The Long Way to Water',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'A-codex-1',
  scope: 'deferred-implemented',
  implemented: true,
  giver: 'Elspeth Shepherd',
  place: 'V',
  scale: 'medium',
  category: 'other',
  difficulty: 'medium',
  prerequisites: [
    'visited V',
  ],
  rewards: [
    'trough: give 3 wool from Elspeth\'s store; pay 15 from V treasury; rep helpfulness+6 (V)',
    'well: pay 40 from V treasury; rep helpfulness+10 (V)',
    'rota: pay 10 from V treasury; rep helpfulness+3 (V)',
    'dropped: none',
  ],
  sourceFlags: { stages: 3, endings: 4 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q08.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ08.test.ts'],
    docs: ['catalog/v2/q08-the-long-way-to-water/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

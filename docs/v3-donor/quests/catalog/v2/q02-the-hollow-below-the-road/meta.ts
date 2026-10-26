import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q02',
  version: 'v2',
  title: 'The Hollow Below the Road',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'A-codex-1',
  scope: 'deferred-implemented',
  implemented: true,
  giver: 'Edith Fowler',
  place: 'V lower road',
  scale: 'medium',
  category: 'hunting',
  difficulty: 'medium',
  prerequisites: [
    'visited V',
  ],
  rewards: [
    'clear: pay 40 from V treasury; rep courage+5 helpfulness+5 (V)',
    'reroute: pay 22 from V treasury; give 2 bread from Bridget\'s store; rep helpfulness+6 (V)',
    'watch: rep helpfulness+4 (V)',
    'settled: none',
  ],
  sourceFlags: { stages: 5, endings: 4 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q02.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ02.test.ts'],
    docs: ['catalog/v2/q02-the-hollow-below-the-road/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

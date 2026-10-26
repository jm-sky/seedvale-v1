import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'G08',
  version: 'v2',
  title: 'Well and Rumor',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'B-grok',
  scope: 'retained',
  implemented: true,
  giver: 'Ralph Fieldman',
  place: 'H (V optional)',
  scale: 'medium',
  category: 'investigation',
  difficulty: 'medium',
  prerequisites: [
    'day 4 or later',
    'Tom alive',
  ],
  rewards: [
    'truth: pay 25 from H treasury; rep honesty+10',
    'quiet: pay 20 from H treasury; give 1 small_beer from Tom\'s store; rep helpfulness+10',
    'accusation: rep honesty-15 (H, V); V price multiplier 1.2 for 30 days',
    'traced: none (heal effect only)',
  ],
  sourceFlags: { stages: 3, endings: 4 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/g08.ts',
    tests: ['SeedVales-v2/src/game/sim/questG08.test.ts'],
    docs: ['catalog/v2/g08-well-and-rumor/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

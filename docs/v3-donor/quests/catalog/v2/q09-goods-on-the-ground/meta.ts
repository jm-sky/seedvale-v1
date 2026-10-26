import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q09',
  version: 'v2',
  title: 'Goods on the Ground',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'A-codex-1',
  scope: 'deferred-implemented',
  implemented: true,
  giver: 'Stephen Chapman',
  place: 'H',
  scale: 'small',
  category: 'trade',
  difficulty: 'easy',
  prerequisites: [
    'day 3 or later',
  ],
  rewards: [
    'barter: pay 10 from Stephen; rep helpfulness+10',
    'consign: Stephen pays Molly 12 and Miles 18, then 10 to player; Molly and Miles pay player 5 each; rep helpfulness+12',
    'order: grant 2 iron_ingot to Stephen\'s purse; rep helpfulness+5',
    'stalled: none',
  ],
  sourceFlags: { stages: 2, endings: 4 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q09.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ09.test.ts'],
    docs: ['catalog/v2/q09-goods-on-the-ground/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

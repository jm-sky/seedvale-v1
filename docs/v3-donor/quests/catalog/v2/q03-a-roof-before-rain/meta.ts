import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q03',
  version: 'v2',
  title: 'A Roof Before Rain',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'A-codex-1',
  scope: 'retained',
  implemented: true,
  giver: 'Miles Hewer',
  place: 'H',
  scale: 'small',
  category: 'repair',
  difficulty: 'easy',
  prerequisites: [
    'Miles\'s house durability below 60',
  ],
  rewards: [
    'repair: rep helpfulness+4 and give 6 branch from the common store (only if the player contributed); 2 logs from the common store consumed',
    'repair and lean_to: Lucy\'s thanks, 2 bread and 1 milk, or 10 c from Miles (player choice)',
    'lean_to: rep helpfulness+3',
    'repair_npc, prop, family: no reward',
  ],
  sourceFlags: { stages: 4, endings: 5 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q03.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ03.test.ts'],
    docs: ['catalog/v2/q03-a-roof-before-rain/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

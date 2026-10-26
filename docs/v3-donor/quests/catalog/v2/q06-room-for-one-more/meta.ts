import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q06',
  version: 'v2',
  title: 'Room for One More',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'A-codex-1',
  scope: 'retained',
  implemented: true,
  giver: 'Miles Hewer',
  place: 'H -> V -> H',
  scale: 'medium',
  category: 'delivery',
  difficulty: 'medium',
  prerequisites: [
    'visited V',
    'day 3 or later',
  ],
  rewards: [
    'paid: player pays 20 to Matthew (hired for four days); rep helpfulness+3',
    'free: rep helpfulness+3',
    'solo: pay 5 from Miles to player',
    'dropped: none',
  ],
  sourceFlags: { stages: 3, endings: 4 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q06.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ06.test.ts'],
    docs: ['catalog/v2/q06-room-for-one-more/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
  notes: [
    '❓ design table (designs-README) names Matthew Hewer as giver; code and design header say Miles (slot miles). Miles Hewer used',
  ],
}

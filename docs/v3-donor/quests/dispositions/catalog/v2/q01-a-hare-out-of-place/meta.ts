import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q01',
  version: 'v2',
  title: 'A Hare Out of Place',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'A-codex-1',
  scope: 'deferred-implemented',
  implemented: true,
  giver: 'Jacob Bowman',
  place: 'H',
  scale: 'small',
  category: 'hunting',
  difficulty: 'easy',
  prerequisites: [
    'day 2 or later',
    'no threat within r=400',
  ],
  rewards: [
    'pelt: pay 20 from Stephen to player; pay 15 from player to Luke; rep helpfulness+5 courage+2',
    'ordinary: pay 6 from Stephen to player; rep helpfulness+3',
    'watch: give 10 arrow and 2 dried_meat from Jacob\'s store; rep helpfulness+3 renown+2',
    'faded: none',
  ],
  sourceFlags: { stages: 3, endings: 4 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q01.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ01.test.ts'],
    docs: ['catalog/v2/q01-a-hare-out-of-place/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

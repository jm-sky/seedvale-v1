import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q11',
  version: 'v2',
  title: 'The Bell in Blackwater',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'C-codex-treasure',
  scope: 'retained',
  implemented: true,
  giver: 'Eve Boatwright',
  place: 'marsh near V',
  scale: 'treasure',
  category: 'treasure',
  difficulty: 'hard',
  prerequisites: [
    'visited V',
    'anchor "chapel" exists',
  ],
  rewards: [
    'crossing: rep helpfulness+10 (V)',
    'sale: 130 c to player (journal: bell and bars sold for 470 c); rep helpfulness+4 (V)',
    'investor: 40 c now and a weekly toll share (journal); rep helpfulness+8 renown+3 (V)',
  ],
  sourceFlags: { stages: 5, endings: 3 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q11.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ11.test.ts'],
    docs: ['catalog/v2/q11-bell-in-blackwater/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
  notes: [
    '❓ coin amounts of sale and investor are journal text; the code has only rep effects',
  ],
}

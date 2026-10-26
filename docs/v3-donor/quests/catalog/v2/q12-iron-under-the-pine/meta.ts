import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q12',
  version: 'v2',
  title: 'The Iron Under the Pine',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'C-codex-treasure',
  scope: 'retained',
  implemented: true,
  giver: 'Duncan Wakeman',
  place: 'mountains beyond T',
  scale: 'treasure',
  category: 'treasure',
  difficulty: 'hard',
  prerequisites: [
    'visited T',
    'anchor "tower" exists',
  ],
  rewards: [
    'guard: 40 c from T and an armoury piece from Willa (journal); rep helpfulness+8 courage+3 (T)',
    'sale: about a quarter of 500 c from Willa (journal); rep helpfulness+4 (T)',
    'carry: keeps the Pinewatch Longsword (journal); rep renown+6 courage+4 (T)',
    'dropped: none',
  ],
  sourceFlags: { stages: 5, endings: 4 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q12.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ12.test.ts'],
    docs: ['catalog/v2/q12-iron-under-the-pine/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
  notes: [
    '❓ coin and item rewards are journal text; the code has only rep effects',
  ],
}

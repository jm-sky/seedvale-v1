import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q05',
  version: 'v2',
  title: 'The Map That Missed the River',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'A-codex-1',
  scope: 'retained',
  implemented: true,
  giver: 'Rosalind Marchant',
  place: 'V-T valley',
  scale: 'treasure',
  category: 'treasure',
  difficulty: 'hard',
  prerequisites: [
    'visited T',
    'anchor "circle" exists',
  ],
  rewards: [
    'family: rep helpfulness+6 (T); a third of the treasure in coin (journal)',
    'ford: a third of the treasure in coin (journal)',
    'keep_gem: rep helpfulness+4 (T); an emerald as your share (journal)',
  ],
  sourceFlags: { stages: 5, endings: 3 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q05.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ05.test.ts'],
    docs: ['catalog/v2/q05-the-map-that-missed-the-river/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
  notes: [
    '❓ amount of "a third in coin" (family, ford) is not in the code',
  ],
}

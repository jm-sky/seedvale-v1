import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q04',
  version: 'v2',
  title: 'The Handle Remembers',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'A-codex-1',
  scope: 'deferred-implemented',
  implemented: true,
  giver: 'Sophie Smith',
  place: 'V',
  scale: 'small',
  category: 'repair',
  difficulty: 'easy',
  prerequisites: [
    'visited V',
  ],
  rewards: [
    'forged: if a new hammer was ordered, grant 1 hammer and pay 8 from Sophie; otherwise the old hammer is repaired; rep helpfulness+6 (V)',
    'keepsake: give 1 bread from Sophie\'s store',
    'stalled: none',
  ],
  sourceFlags: { stages: 3, endings: 3 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q04.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ04.test.ts'],
    docs: ['catalog/v2/q04-the-handle-remembers/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

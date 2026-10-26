import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q07',
  version: 'v2',
  title: 'Six Bowls, One Pan',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'A-codex-1',
  scope: 'retained',
  implemented: true,
  giver: 'Lucy Hewer',
  place: 'H',
  scale: 'small',
  category: 'social',
  difficulty: 'easy',
  prerequisites: [
    'quest q03 done (started), or Lucy opinion 10 or more',
  ],
  rewards: [
    'together, shifts, doorstep: no reward effects in code',
    'together: Mark lets the player take a torch from the rack by the gate once a day (journal only)',
  ],
  sourceFlags: { stages: 3, endings: 3 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q07.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ07.test.ts'],
    docs: ['catalog/v2/q07-six-bowls-one-pan/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
  notes: [
    '❓ torch-rack access exists only in journal text',
  ],
}

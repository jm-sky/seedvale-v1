import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q14',
  version: 'v2',
  title: 'Weeds on the Hill',
  status: 'verification needed',
  origin: 'v2-authored',
  implemented: true,
  giver: 'ruth',
  place: 'H',
  category: 'other',
  difficulty: 'easy',
  prerequisites: [
    'cemetery anchor exists',
    'day 3 or later',
  ],
  rewards: [
    'tended: pay 20 from H treasury; rep helpfulness+6',
    'desecrated: no reward (Ruth will not forgive)',
  ],
  sourceFlags: { stages: 3, endings: 2, tidyGoal: 5 },
  derived: ['category', 'difficulty', 'place'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q14.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ14.test.ts'],
    docs: ['catalog/v2/q14-weeds-on-the-hill/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
  notes: [
    '❓ Ruth\'s full name is not in the repo (slot id only)',
    '❓ no design doc and no design-table entry: pack, scope and scale unknown (scale and scope omitted)',
    '❓ place H is taken from the source header ("an elder of {H}") and difficulty easy is a guess (no scale)',
  ],
}

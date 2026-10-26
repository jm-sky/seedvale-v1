import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'G05',
  version: 'v2',
  title: 'Disputed Oak',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'B-grok',
  scope: 'deferred-implemented',
  implemented: true,
  giver: 'Miles Hewer',
  place: 'H/V boundary',
  scale: 'medium',
  category: 'social',
  difficulty: 'medium',
  prerequisites: [
    'visited V',
  ],
  rewards: [
    'shared: pay 12 from H and 12 from V; rep helpfulness+8 (H, V)',
    'for_h: pay 15 from H; rep honesty+5 (H) and honesty-5 (V)',
    'for_v: pay 15 from V; rep honesty+5 (V)',
    'felled_at_night: rep honesty-20 (H, V)',
    'dropped: none',
  ],
  sourceFlags: { stages: 3, endings: 5 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/g05.ts',
    tests: ['SeedVales-v2/src/game/sim/questG05.test.ts'],
    docs: ['catalog/v2/g05-disputed-oak/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
}

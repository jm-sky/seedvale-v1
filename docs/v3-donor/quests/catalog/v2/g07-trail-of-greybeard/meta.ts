import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'G07',
  version: 'v2',
  title: 'Trail of the Grey Wolf',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'B-grok',
  scope: 'retained',
  implemented: true,
  giver: 'Jacob Bowman',
  place: 'H forest',
  scale: 'medium',
  category: 'hunting',
  difficulty: 'medium',
  prerequisites: [
    'day 2 or later',
    'posts 1 or more',
  ],
  rewards: [
    'kill: pay 30 from H treasury; rep courage+10',
    'drive: pay 20 from H treasury; rep courage+5 helpfulness+5',
    'poison: pay 20 from H treasury',
    'gaveUp: none',
  ],
  sourceFlags: { stages: 2, endings: 4 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/g07.ts',
    tests: ['SeedVales-v2/src/game/sim/questG07.test.ts'],
    docs: ['catalog/v2/g07-trail-of-greybeard/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
  notes: [
    '❓ design file title "Trail of Greybeard" differs from code title "Trail of the Grey Wolf"; code title used',
  ],
}

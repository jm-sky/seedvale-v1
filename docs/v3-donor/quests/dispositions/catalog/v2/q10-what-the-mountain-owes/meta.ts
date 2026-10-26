import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q10',
  version: 'v2',
  title: 'What the Mountain Owes',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'A-codex-1',
  scope: 'deferred-not-built',
  implemented: false,
  giver: 'Agnes Collier',
  place: 'beyond T',
  scale: 'large',
  category: 'story',
  difficulty: 'epic',
  prerequisites: [
    'needs QUEST-03 engine, cave/adit WORLD-05, outpost SET-04, miner NPC-06 (all deferred)',
  ],
  rewards: [],
  sourceFlags: { stages: 4, endings: 3 },
  derived: ['category', 'difficulty'],
  sources: {
    // Design only: no code in SeedVales v2 (deferred by D-PLAN-11).
    definition: 'SeedVales-v2/src/game/data/quests/index.ts',
    docs: ['catalog/v2/q10-what-the-mountain-owes/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
  notes: ['❓ not built; sources.definition points at the quest list where Q10 is absent. Rewards not extracted from the design doc.'],
}

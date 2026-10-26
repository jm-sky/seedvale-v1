import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'story:lost-treasure-chronicles:elder:winter',
  version: 'v1',
  title: 'Przygotowania do zimy',
  titleEn: 'Preparing for Winter',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'gathering',
  difficulty: 'easy',
  prerequisites: [],
  rewards: [
    'material_help: relation elder +1, benevolence +2',
    'neighbor_help: relation elder +2, relation helper +1, trust +1',
  ],
  sourceFlags: {
    stages: 1,
    outcomes: 'material_help, neighbor_help',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/lostTreasureChroniclesElder.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-037-lost-treasure-chronicles-elder-trust-foundation.md',
      'roadmaps/v1/quests-lost-something-chronicles.md',
    ],
  },
  notes: [
    'Builder: buildLostTreasureChroniclesElderQuests at line 108 (returns winter and dispute). Elder and helper NPCs are resolved at runtime.',
    'Material path needs LOST_TREASURE_CHRONICLES_WINTER_BRANCH_COUNT = 6 branches. Neighbour path needs a talk with the helper. Stage mode not traced (❓).',
  ],
}

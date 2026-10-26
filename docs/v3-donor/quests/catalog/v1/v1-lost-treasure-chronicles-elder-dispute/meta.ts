import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'story:lost-treasure-chronicles:elder:dispute',
  version: 'v1',
  title: 'Stara uraza',
  titleEn: 'Old Grudge',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'social',
  difficulty: 'medium',
  prerequisites: ['quest_outcome story:lost-treasure-chronicles:elder:winter: material_help or neighbor_help'],
  rewards: [
    'support_elder: relation elder +2, relation counterpart -1, trust +1, competence +1',
    'reconcile: relation elder +1, relation counterpart +1, benevolence +2, integrity +1',
  ],
  sourceFlags: {
    stages: 3,
    outcomes: 'support_elder, reconcile',
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
    'Second quest built by buildLostTreasureChroniclesElderQuests (line 108). Elder and counterpart are resolved at runtime; the dispute is about a borrowed axe.',
  ],
}

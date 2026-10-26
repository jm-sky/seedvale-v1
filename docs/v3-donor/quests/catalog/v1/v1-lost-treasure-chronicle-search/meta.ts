import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'story:lost-treasure-chronicles:chronicle-search',
  version: 'v1',
  title: 'Zakodowana kronika',
  titleEn: 'Encoded Chronicle',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'investigation',
  difficulty: 'medium',
  prerequisites: ['quest_outcome story:lost-treasure-chronicles:elder:winter: material_help or neighbor_help'],
  rewards: [
    'chronicle_acquired: relation elder +1, relation archaeologist +1 (the encoded chronicle is a story item, not a coin reward)',
  ],
  sourceFlags: {
    stages: 3,
    outcomes: 'chronicle_acquired',
    exposure: 'story',
    priority: 22,
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/lostTreasureChronicleSearch.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-038-lost-treasure-chronicles-archaeologist-and-chronicle-search.md',
      'roadmaps/v1/quests-lost-something-chronicles.md',
    ],
  },
  notes: [
    'Builder: buildLostTreasureChronicleSearchQuests at line 355 (returns this quest and cemetery-favour). Giver (elder), archaeologist and caretaker are resolved at runtime.',
    'Two leads (grave on the cemetery, ruins landmark) are resolved at composition. Lead strength is basic or strong (resolveChronicleSearchLead).',
  ],
}

import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'story:lost-treasure-chronicles:cemetery-favour',
  version: 'v1',
  title: 'Porządek na cmentarzu',
  titleEn: 'Order in the Cemetery',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'gathering',
  difficulty: 'easy',
  prerequisites: ['quest_outcome story:lost-treasure-chronicles:elder:winter: material_help or neighbor_help'],
  rewards: ['grave_access_granted: relation caretaker +1, trust +1'],
  sourceFlags: {
    stages: 1,
    outcomes: 'grave_access_granted',
    exposure: 'story',
    priority: 8,
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/lostTreasureChronicleSearch.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-038-lost-treasure-chronicles-archaeologist-and-chronicle-search.md',
    ],
  },
  notes: [
    'Second quest built by buildLostTreasureChronicleSearchQuests (line 355). Caretaker name is resolved at runtime.',
    'Grants access to one grave for the chronicle search quest.',
  ],
}

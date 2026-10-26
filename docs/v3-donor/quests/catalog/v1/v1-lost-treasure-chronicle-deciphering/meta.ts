import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'story:lost-treasure-chronicles:chronicle-deciphering',
  version: 'v1',
  title: 'Odczytanie kroniki',
  titleEn: 'Deciphering the Chronicle',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'investigation',
  difficulty: 'medium',
  prerequisites: ['quest_outcome story:lost-treasure-chronicles:chronicle-search: chronicle_acquired'],
  rewards: [
    'chronicle_deciphered_paid: relation specialist +1; pays 35 coins (fee, a cost not a reward)',
    'chronicle_deciphered_favour: relation specialist +2, benevolence +1 (requires recovering and returning the specialist glossary)',
  ],
  sourceFlags: {
    stages: 4,
    outcomes: 'chronicle_deciphered_paid, chronicle_deciphered_favour',
    exposure: 'story',
    priority: 23,
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/lostTreasureChronicleDeciphering.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-039-lost-treasure-chronicles-chronicle-deciphering-and-specialist.md',
      'roadmaps/v1/quests-lost-something-chronicles.md',
    ],
  },
  notes: [
    'Builder: buildLostTreasureChronicleDecipheringQuest at line 161. The specialist settlement reveals a location on the way.',
    'Fee constant LOST_TREASURE_DECIPHERING_FEE = 35. Glossary (chronicle_reference) lives in a chest at the specialist settlement edge.',
    'Stage objective types for the first stage were not traced.',
  ],
}

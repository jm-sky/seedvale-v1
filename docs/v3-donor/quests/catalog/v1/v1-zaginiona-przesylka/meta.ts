import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'zaginiona-przesylka',
  version: 'v1',
  title: 'Zaginiona przesyłka',
  titleEn: 'Lost Parcel',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Kasia',
  place: 'rock cave near the settlement ({cavePlace} token, direction-phrased at composition)',
  category: 'delivery',
  difficulty: 'medium',
  prerequisites: [],
  rewards: [
    'returned_sealed: coin x15 (hidden), relation Kasia +2, trust +5, integrity +6, renown +3',
    'turned_over_to_guard: bandage x2 (hidden), relation Kasia -1, relation Marek +2, competence +4, courage +2, integrity +1, renown +2',
  ],
  sourceFlags: {
    stages: 2,
    outcomes: 'returned_sealed, turned_over_to_guard',
  },
  derived: ['titleEn', 'category', 'difficulty', 'place'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-005-authored-rpg-quests.md',
      '../reference/quests/progression-plans/v1/quests-progression-050-socially-consequential-quest-dialogue.md',
    ],
  },
  notes: [
    'QUESTS array entry, quests.ts line 2203. Cave bound by bindExactCaveQuests.',
    'Stage 2 is a talk_to_npc_choice between Kasia and Marek; each branch has its own outcome and reactions.',
  ],
}

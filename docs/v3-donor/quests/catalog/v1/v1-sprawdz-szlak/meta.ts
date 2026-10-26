import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'sprawdz-szlak',
  version: 'v1',
  title: 'Sprawdzenie skalnej groty',
  titleEn: 'Checking the Rock Cave',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Kasia',
  place: 'rock cave near the settlement ({cavePlace} token, direction-phrased at composition)',
  category: 'investigation',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['coin x12 (shown)'],
  sourceFlags: {
    stages: 1,
    outcomes: 'reported',
  },
  derived: ['titleEn', 'category', 'difficulty', 'place'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
  },
  notes: [
    'QUESTS array entry, quests.ts line 2040. Cave is bound by bindExactCaveQuests (quests.ts ~2862) using CAVE_BOUND_QUEST_IDS.',
    'Place is inferred from the {cavePlace} token and the landmark wording; exact cave is resolved at runtime.',
  ],
}

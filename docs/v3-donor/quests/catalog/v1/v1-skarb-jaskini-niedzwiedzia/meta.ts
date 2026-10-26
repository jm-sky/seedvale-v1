import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'skarb-jaskini-niedzwiedzia',
  version: 'v1',
  title: 'Stary skarb w jaskini',
  titleEn: 'Old Treasure in the Cave',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Marek',
  place: 'bear cave (direction phrase from the settlement, bound at composition)',
  category: 'treasure',
  difficulty: 'epic',
  prerequisites: [],
  rewards: [
    'treasure_kept: whole treasure kept (no quest reward listed)',
    'treasure_returned: coin (hidden, amount from treasureMapBearCaveReturnPayout), relation Marek +2, trust +4, integrity +3, renown +4',
  ],
  sourceFlags: {
    stages: 5,
    outcomes: 'treasure_kept, treasure_returned',
    abandonmentAllowed: false,
  },
  derived: ['titleEn', 'category', 'difficulty', 'place'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-008-treasure-map-bear-cave.md',
      '../reference/quests/progression-plans/v1/quests-progression-033-quest-offer-selection-prioritization-and-abandonment.md',
    ],
  },
  notes: [
    'Built by buildTreasureMapBearCaveQuest (quests.ts ~2915) and bound by bindTreasureMapBearCaveQuest (~2996); the offer and stage texts use the cavePlace phrase.',
    'Difficulty epic is inferred from five stages, a grave search, a bound cave and a sealed casket (❓ not stated in source).',
  ],
}

import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'drewno-dla-piotra',
  version: 'v1',
  title: 'Drewno dla Piotra',
  titleEn: 'Wood for Piotr',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Piotr',
  place: null,
  category: 'repair',
  difficulty: 'easy',
  prerequisites: [
    'any of: quest_outcome sporne-drewno: prioritize_piotr',
    'any of: quest_outcome drewno-dla-anny: delivered_to_anna',
  ],
  rewards: ['coin x8 (shown)', 'relation Piotr +1', 'already_repaired: no reward'],
  sourceFlags: {
    stages: 1,
    outcomes: 'delivered_to_piotr, already_repaired',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-005-authored-rpg-quests.md',
      '../reference/quests/progression-plans/v1/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md',
    ],
  },
  notes: ['QUESTS array entry, quests.ts line 2402. Offer line states the payment of 8 coins.'],
}

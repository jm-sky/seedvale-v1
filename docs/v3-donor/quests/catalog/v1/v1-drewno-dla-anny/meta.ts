import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'drewno-dla-anny',
  version: 'v1',
  title: 'Drewno dla Anny',
  titleEn: 'Wood for Anna',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Anna',
  place: null,
  category: 'repair',
  difficulty: 'easy',
  prerequisites: [
    'any of: quest_outcome sporne-drewno: prioritize_anna',
    'any of: quest_outcome drewno-dla-piotra: delivered_to_piotr',
  ],
  rewards: ['seed_carrot x3 (hidden)', 'relation Anna +1', 'already_repaired: no reward'],
  sourceFlags: {
    stages: 1,
    outcomes: 'delivered_to_anna, already_repaired',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md',
      '../reference/quests/progression-plans/v1/quests-progression-077-authored-starter-repair-initialization-and-intact-state-semantics.md',
    ],
  },
  notes: ['QUESTS array entry, quests.ts line 2352. Availability is an any-of over two quest outcomes.'],
}

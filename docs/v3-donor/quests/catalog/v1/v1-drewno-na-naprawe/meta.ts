import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'drewno-na-naprawe',
  version: 'v1',
  title: 'Drewno na naprawę',
  titleEn: 'Wood for Repairs',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Piotr',
  place: null,
  category: 'repair',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['coin x8 (shown)', 'relation Piotr +1', 'already_repaired: no reward'],
  sourceFlags: {
    stages: 1,
    outcomes: 'delivered, already_repaired',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md',
      '../reference/quests/progression-plans/v1/quests-progression-077-authored-starter-repair-initialization-and-intact-state-semantics.md',
    ],
  },
  notes: ['QUESTS array entry, quests.ts line 1940. Has alreadyRepaired* offer and reminder lines.'],
}

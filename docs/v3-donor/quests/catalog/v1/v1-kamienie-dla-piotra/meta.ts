import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'kamienie-dla-piotra',
  version: 'v1',
  title: 'Kamienie dla Piotra',
  titleEn: 'Stones for Piotr',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Piotr',
  place: null,
  category: 'repair',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['coin x9 (shown)', 'relation Piotr +1', 'already_repaired: no reward'],
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
  notes: ['QUESTS array entry, quests.ts line 2003. Has alreadyRepaired* offer and reminder lines.'],
}

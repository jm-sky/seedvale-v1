import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'plaga-szcurow',
  version: 'v1',
  title: 'Plaga szczurów',
  titleEn: 'Rat Plague',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Marek',
  place: null,
  category: 'other',
  difficulty: 'medium',
  prerequisites: [],
  rewards: [
    'relation Marek +2',
    'reputation competence +4, benevolence +3',
    'renown +5',
  ],
  sourceFlags: {
    stages: 1,
    outcomes: 'infestation_cleared',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-006-settlement-rat-infestation.md',
      '../reference/quests/progression-plans/v1/quests-progression-013-rat-infestation-nest-and-reproduction.md',
    ],
  },
  notes: [
    'QUESTS array entry, quests.ts line 2496. Objective resolve_storage_rat_infestation: repair storage, destroy nest, reduce living rats to at most one.',
    'Runtime helper for the same infestation: seedvale-v1/src/quests/settlementRatInfestation.ts (snapshot and reminder helper, not a quest definition).',
  ],
}

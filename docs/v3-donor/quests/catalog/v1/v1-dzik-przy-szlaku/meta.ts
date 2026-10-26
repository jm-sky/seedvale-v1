import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'dzik-przy-szlaku',
  version: 'v1',
  title: 'Dzik przy szlaku',
  titleEn: 'Boar by the Trail',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Marek',
  place: null,
  category: 'hunting',
  difficulty: 'hard',
  prerequisites: ['renown minimum 10'],
  rewards: [
    'book_defense_intermediate x1 (hidden)',
    'relation Marek +2',
    'reputation competence +6, courage +6, benevolence +2',
    'renown +8',
  ],
  sourceFlags: {
    stages: 2,
    outcomes: 'boar_removed',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-070-boar-at-the-medicinal-meadow-systemic-settlement-problem.md',
      '../reference/quests/progression-plans/v1/quests-progression-005-authored-rpg-quests.md',
    ],
  },
  notes: ['QUESTS array entry, quests.ts line 2452. Kill target is a boar (kind boar).'],
}

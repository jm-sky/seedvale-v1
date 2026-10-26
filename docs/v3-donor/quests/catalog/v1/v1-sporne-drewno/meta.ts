import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'sporne-drewno',
  version: 'v1',
  title: 'Sporne drewno',
  titleEn: 'Disputed Wood',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Anna',
  place: null,
  category: 'social',
  difficulty: 'medium',
  prerequisites: [],
  rewards: [
    'prioritize_anna: relation Anna +1, benevolence +3, trust +1, renown +2',
    'prioritize_piotr: relation Piotr +1, competence +3, trust +1, renown +2',
  ],
  sourceFlags: {
    stages: 2,
    outcomes: 'prioritize_anna, prioritize_piotr',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md',
      '../reference/quests/progression-plans/v1/quests-progression-005-authored-rpg-quests.md',
    ],
  },
  notes: ['QUESTS array entry, quests.ts line 2290. Both outcomes are complete; the choice decides which NPC gets wood first.'],
}

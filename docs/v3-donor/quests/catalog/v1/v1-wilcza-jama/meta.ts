import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'wilcza-jama',
  version: 'v1',
  title: 'Wilcza jama',
  titleEn: 'Wolf Den',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Anna',
  place: null,
  category: 'hunting',
  difficulty: 'hard',
  prerequisites: ['relation Anna minimum trusted', 'quest_outcome grozny-wilk: reported'],
  rewards: [
    'obsidian_sword x1 (shown)',
    'relation Anna +3',
    'reputation competence +15, courage +18, benevolence +6',
    'renown +25',
  ],
  sourceFlags: {
    stages: 1,
    outcomes: 'reported',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-007-wolves-approach-settlement.md',
      '../reference/quests/progression-plans/v1/quests-progression-004-quest-availability-and-prerequisites.md',
    ],
  },
  notes: ['QUESTS array entry, quests.ts line 2134. Objective clear_wolf_den uses WOLF_DEN_ID.'],
}

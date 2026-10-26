import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'grozny-wilk',
  version: 'v1',
  title: 'Groźny wilk',
  titleEn: 'Dangerous Wolf',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Anna',
  place: null,
  category: 'hunting',
  difficulty: 'hard',
  prerequisites: ['relation Anna minimum trusted'],
  rewards: [
    'damascus_long_sword x1 (shown)',
    'relation Anna +2',
    'reputation competence +10, courage +12, benevolence +4',
    'renown +15',
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
  notes: ['QUESTS array entry, quests.ts line 2099. Kill target is a dangerous wolf (kind wolf, dangerous true).'],
}

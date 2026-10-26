import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'rpg:suspicious-transport:<settlementId>:<counterpartId>',
  version: 'v1',
  title: 'Podejrzany transport',
  titleEn: 'Suspicious Transport',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'investigation',
  difficulty: 'medium',
  prerequisites: [],
  rewards: [
    'keep_quiet: coin x8 (hidden), relation giver +2, relation counterpart -1, trust +1, integrity -1, renown +1',
    'report_it: relation counterpart +2, relation giver -1, integrity +4, courage +2, renown +2',
    'keep_goods: relation giver -1, relation counterpart -1, trust -2, integrity -2, renown +1',
  ],
  sourceFlags: {
    stages: 3,
    outcomes: 'keep_quiet, report_it, keep_goods',
    abandonmentAllowed: false,
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/suspiciousTransportCaveCache.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-024-suspicious-transport-natural-cave-cache.md',
      '../reference/quests/progression-plans/v1/quests-progression-017-rpg-settlement-quest-matrices.md',
    ],
  },
  notes: [
    'Template id: the quest id is built with rpgQuestId("suspicious-transport", settlementId, counterpart.id) (line 119). Giver and counterpart are chosen at runtime.',
    'Builder: buildSuspiciousTransportCaveCacheQuest at line 169. Runtime wiring is in suspiciousTransportCaveCacheRuntime.ts (not a quest definition).',
  ],
}

import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'world:dungeon-bandit:<settlementId>:<caveId>:<giverNpcId>:<claimantNpcId>',
  version: 'v1',
  title: 'Skrytka bandytów',
  titleEn: 'Bandits\' Stash',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'treasure',
  difficulty: 'hard',
  prerequisites: [],
  rewards: [
    'return_marked_property: relation claimant +3, trust +4, integrity +5, benevolence +4, renown +2',
    'give_evidence_to_guard: relation claimant +1, competence +5, integrity +4, renown +4',
    'keep_marked_property: relation claimant -2, trust -2, integrity -4, renown +1',
    'Deep stash contents (source DEEP_STASH_SUPPLY): coin x18, ruby small x1, bandage x2',
    'Side caches (up to 2, SIDE_CACHE_SUPPLY): coin x6, bandage x1 each',
  ],
  sourceFlags: {
    stages: 3,
    outcomes: 'return_marked_property, give_evidence_to_guard, keep_marked_property',
    abandonmentAllowed: false,
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/dungeonBanditTreasure.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-026-dungeon-bandit-treasure.md',
      '../reference/quests/progression-plans/v1/quests-progression-041-lost-treasure-chronicles-dungeon-binding-and-persistent-collapsed-access.md',
    ],
  },
  notes: [
    'Template id; runtime id from dungeonBanditQuestId (line 82).',
    'Builder: buildDungeonBanditTreasureQuest at line 375. The side caches are separate reservations and are not quest outcomes.',
    'Runtime wiring is in dungeonBanditTreasureRuntime.ts (not a quest definition).',
  ],
}

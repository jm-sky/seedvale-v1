import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'world:old-bones:<settlementId>:<caveId>',
  version: 'v1',
  title: 'Stare kości',
  titleEn: 'Old Bones',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'investigation',
  difficulty: 'medium',
  prerequisites: [],
  rewards: [
    'return_to_first_claimant: relation claimant A +3, trust +4, benevolence +5, integrity +3, renown +3',
    'give_to_second_claimant (only with a second claimant): relation claimant B +2, relation claimant A -2, trust +1, benevolence +2, integrity +1, renown +2',
    'keep_signet: relation claimant A -1 (and B -1 if present), trust -1, integrity -2, renown +1',
    'Remains contents (source REMAINS_SUPPLY): coin x4, bandage x1',
  ],
  sourceFlags: {
    stages: 4,
    outcomes: 'return_to_first_claimant, give_to_second_claimant, keep_signet',
    abandonmentAllowed: false,
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/oldBonesAdventureCave.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-025-adventure-cave-old-bones.md',
      '../reference/quests/progression-plans/v1/quests-progression-035-story-item-inventory-and-cave-location-clarity.md',
    ],
  },
  notes: [
    'Template id; runtime id from oldBonesQuestId (world:old-bones:<settlementId>:<caveId>).',
    'Builder: buildOldBonesAdventureCaveQuest at line 295. Stage count is 3 base stages plus one decision stage (4) when only one claimant; a second claimant adds a stage and one outcome.',
    'Runtime wiring is in oldBonesAdventureCaveRuntime.ts (not a quest definition).',
  ],
}

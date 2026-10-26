import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'world:lost-hunter:<settlementId>:<caveId>',
  version: 'v1',
  title: 'Zaginiony myśliwy',
  titleEn: 'Missing Hunter',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'investigation',
  difficulty: 'medium',
  prerequisites: [],
  rewards: [
    'return_bow_to_family: coin x4 (hidden), relation giver +3, trust +5, benevolence +6, integrity +3, renown +4',
    'report_fate_keep_bow: relation giver +1, trust +1, benevolence +2, renown +2',
  ],
  sourceFlags: {
    stages: 4,
    outcomes: 'return_bow_to_family, report_fate_keep_bow',
    abandonmentAllowed: false,
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/lostHunterNaturalCave.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-023-lost-hunter-natural-cave.md',
    ],
  },
  notes: [
    'Template id; the runtime id is built by lostHunterQuestId (world:lost-hunter:<settlementId>:<caveId>).',
    'Giver and witness NPCs are picked at runtime by selectLostHunterNpcs; fallback names are "Rodzina" and "Świadek" (❓ real names not in source).',
    'Builder: buildLostHunterNaturalCaveQuest at line 196. Runtime wiring is in lostHunterNaturalCaveRuntime.ts (not a quest definition).',
  ],
}

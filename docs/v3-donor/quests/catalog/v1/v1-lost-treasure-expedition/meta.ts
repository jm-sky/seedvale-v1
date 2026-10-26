import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'world:lost-treasure-expedition:<settlementId>:<caveId>[:<sponsorNpcId>[:<stakeholderNpcId>]]',
  version: 'v1',
  title: 'Zaginiona wyprawa po skarb',
  titleEn: 'Lost Treasure Expedition',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'treasure',
  difficulty: 'epic',
  prerequisites: [],
  rewards: [
    'journal_to_family: relation stakeholder +3, trust +4, benevolence +5, integrity +3, renown +2',
    'journal_to_sponsor: coin x25 (shown), relation sponsor +3, relation stakeholder -1 (if present), competence +3, integrity +2, renown +3',
    'keep_journal_and_treasure: relation sponsor -2, relation stakeholder -2 (if present), trust -2, integrity -3, renown +1',
    'Camp container: coin x4, bandage x1',
    'Journal pack container: coin x6',
    'Evidence container: coin x8, bandage x1',
    'Final treasure container: coin x50, ruby medium x1',
  ],
  sourceFlags: {
    stages: 7,
    outcomes: 'journal_to_family, journal_to_sponsor, keep_journal_and_treasure',
    abandonmentAllowed: false,
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/lostTreasureExpedition.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-027-lost-treasure-expedition.md',
      '../reference/quests/progression-plans/v1/quests-progression-079-lost-treasure-expedition-external-sponsor-flow.md',
    ],
  },
  notes: [
    'Template id; runtime id from lostTreasureExpeditionQuestId (line 113). Sponsor and stakeholder NPCs are picked at runtime.',
    'Builder: buildLostTreasureExpeditionQuest at line 535. Stage count 7 assumes the stakeholder stage is present; without a stakeholder it is one fewer (❓ exact count not traced).',
    'Runtime wiring is in lostTreasureExpeditionRuntime.ts (not a quest definition).',
  ],
}

import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'hunters-brotherhood-intro:<homeSettlementId>:<inviterNpcId>',
  version: 'v1',
  title: 'Krąg myśliwych',
  titleEn: 'Circle of Hunters',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'profession',
  difficulty: 'easy',
  prerequisites: ['quest_outcome hunter-profession (hunter III): hunter_iii_complete'],
  rewards: ['relation inviter +1', 'relation master +1'],
  sourceFlags: {
    stages: 1,
    outcomes: 'hunters_brotherhood_joined',
    exposure: 'story',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/huntersBrotherhoodIntroduction.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-048-hunters-brotherhood-introduction-and-membership.md',
      'roadmaps/v1/quests-hunters-brotherhood.md',
    ],
  },
  notes: [
    'Template id; runtime id from huntersBrotherhoodIntroductionQuestId (line 64). Giver (inviter) and the three circle NPCs are resolved at runtime by resolveHuntersBrotherhoodBinding.',
    'Materializer: materializeHuntersBrotherhoodIntroductionQuest at line 144. Builder entry point at line 218.',
  ],
}

import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'hunters-brotherhood-investigation:<homeSettlementId>:<inviterNpcId>:<spawnerId>',
  version: 'v1',
  title: 'Niepokojące łowisko',
  titleEn: 'Troubling Hunting Ground',
  status: 'verification needed',
  origin: 'v1-module',
  implemented: true,
  giver: null,
  place: null,
  category: 'profession',
  difficulty: 'easy',
  prerequisites: ['quest_outcome hunters-brotherhood-intro: hunters_brotherhood_joined'],
  rewards: ['relation master +1', 'reputation competence +2, trust +2', 'renown +2'],
  sourceFlags: {
    stages: 1,
    outcomes: 'brotherhood_investigation_complete',
    exposure: 'story',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/huntersBrotherhoodInvestigation.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-049-hunters-brotherhood-hunting-ground-investigation.md',
      'roadmaps/v1/quests-hunters-brotherhood.md',
    ],
  },
  notes: [
    'Template id; runtime id from huntersBrotherhoodInvestigationQuestId (line 26). The spawner is a deer thicket chosen by selectHuntingGroundSpawnerId from habitat pressure.',
    'Returns undefined (no quest) when no bound-settlement deer thicket has a meaningful problem (plan quests-progression-049).',
    'Materializer: materializeHuntersBrotherhoodInvestigationQuest at line 207. Entry point at line 272.',
  ],
}

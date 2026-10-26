import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'zapomniany-cmentarz',
  version: 'v1',
  title: 'Zapomniany cmentarz',
  titleEn: 'Forgotten Cemetery',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Kasia',
  place: 'cemetery landmark at the edge of the village (resolved at world setup)',
  category: 'investigation',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['relation Kasia +1'],
  sourceFlags: {
    stages: 1,
    outcomes: 'reported',
  },
  derived: ['titleEn', 'category', 'difficulty', 'place'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
  },
  notes: [
    'Built by buildLandmarkQuests (quests.ts ~2545). Only added when resolve("cemetery") finds a landmark this session.',
    'Whether this landmark is the same cemetery used by skarb-jaskini-niedzwiedzia or the chronicle quests was not checked (❓).',
  ],
}

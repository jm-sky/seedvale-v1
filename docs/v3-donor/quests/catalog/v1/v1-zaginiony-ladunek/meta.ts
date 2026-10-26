import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'zaginiony-ladunek',
  version: 'v1',
  title: 'Zaginiony ładunek',
  titleEn: 'Missing Cargo',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Marek',
  place: 'shipwreck landmark on the coast (resolved at world setup)',
  category: 'investigation',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['relation Marek +1'],
  sourceFlags: {
    stages: 1,
    outcomes: 'reported',
  },
  derived: ['titleEn', 'category', 'difficulty', 'place'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
  },
  notes: [
    'Built by buildLandmarkQuests (quests.ts ~2545). Only added when resolve("shipwreck") finds a landmark this session.',
  ],
}

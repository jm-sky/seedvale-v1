import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'wilki-u-kupca',
  version: 'v1',
  title: 'Wilki u kupca',
  titleEn: 'Wolves at the Merchant',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Kasia',
  place: null,
  category: 'hunting',
  difficulty: 'hard',
  prerequisites: [],
  rewards: [
    'merchant horse (animal reward, id passed at composition) (shown)',
    'relation Kasia +2',
    'reputation competence +8, courage +10',
    'renown +8',
    'horse_lost (failed): horse died, no reward',
  ],
  sourceFlags: {
    stages: 1,
    outcomes: 'reported, horse_lost',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-012-horse-acquisition-merchant-purchase-and-quest-reward.md',
    ],
  },
  notes: [
    'Built by buildHorseAcquisitionQuest(horseRewardAnimalId) (quests.ts ~2778). Omitted at composition when the home settlement has no merchant horse target this session.',
    'Objective destroy_spawn_point uses WOLF_DEN_ID, same den as wilcza-jama and wilki-pod-osada.',
  ],
}

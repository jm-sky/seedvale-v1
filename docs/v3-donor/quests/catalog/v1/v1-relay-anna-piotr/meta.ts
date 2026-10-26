import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'relay-anna-piotr',
  version: 'v1',
  title: 'Wiadomość dla Piotra',
  titleEn: 'Message for Piotr',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Anna',
  place: null,
  category: 'social',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['relation Anna +1', 'relation Piotr +1'],
  sourceFlags: {
    stages: 1,
    outcomes: 'delivered',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
  },
  notes: ['QUESTS array entry, quests.ts line 1749.'],
}

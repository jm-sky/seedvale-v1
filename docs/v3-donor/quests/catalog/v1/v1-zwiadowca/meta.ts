import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'zwiadowca',
  version: 'v1',
  title: 'Zwiad okolicy',
  titleEn: 'Scouting the Area',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Piotr',
  place: null,
  category: 'investigation',
  difficulty: 'medium',
  prerequisites: [],
  rewards: ['relation Piotr +1', 'integrity -2 (dialogue lie branch)', 'relation Piotr -1 (lie branch, acquainted or lower)'],
  sourceFlags: {
    stages: 3,
    outcomes: 'reported',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-018-quest-playtest-reachability-and-dialogue-conflicts.md',
    ],
  },
  notes: [
    'QUESTS array entry, quests.ts line 1834. Stage 2 is spot_animal (stag, range 16); a dialogue action lets the player claim the stag was seen.',
    'Stage 2 comment: a dialogue with Piotr while the stage is active counts as proof the spot did not happen (plan quests-progression-018).',
  ],
}

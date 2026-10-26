import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'mapa-do-skarbu',
  version: 'v1',
  title: 'Mapa do skarbu',
  titleEn: 'Treasure Map',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Piotr',
  place: 'ruins deep in the dark forest (map hidden at a {mapSourcePlace} place)',
  category: 'treasure',
  difficulty: 'hard',
  prerequisites: ['relation Piotr minimum acquainted'],
  rewards: ['relation Piotr +2', 'reputation competence +6, courage +8', 'renown +6', 'container contents of the ruins chest (❓ not listed in the builder)'],
  sourceFlags: {
    stages: 3,
    outcomes: 'reported',
  },
  derived: ['titleEn', 'category', 'difficulty', 'place'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-009-dark-forest-ruins-treasure-map.md',
    ],
  },
  notes: [
    'Built by buildDarkForestTreasureQuest (quests.ts ~2731). Treasure map and chest are placed at composition; {mapSourcePlace} is replaced by a cave or cemetery phrase.',
    'Not in the QUESTS array; added at composition with the other builder quests (❓ exact composition site not traced).',
  ],
}

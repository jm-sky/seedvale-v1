import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'zagubiona-owca',
  version: 'v1',
  title: 'Zagubiona owca',
  titleEn: 'Lost Sheep',
  status: 'verification needed',
  origin: 'v1-static',
  implemented: true,
  giver: 'Anna',
  place: null,
  category: 'investigation',
  difficulty: 'easy',
  prerequisites: [],
  rewards: ['coin x10 (shown)', 'relation Anna +1', 'failed outcome: sheep died (no reward)'],
  sourceFlags: {
    stages: 1,
    outcomes: 'found_and_reported, sheep_died',
  },
  derived: ['titleEn', 'category', 'difficulty'],
  sources: {
    definition: 'seedvale-v1/src/quests/quests.ts',
    docs: [
      '../reference/quests/progression-plans/v1/quests-progression-075-lost-livestock-report-lifecycle-and-truthful-quest-journal.md',
      '../reference/quests/progression-plans/v1/quests-progression-030-external-resolution-and-real-problem-offering.md',
    ],
  },
  notes: [
    'QUESTS array entry, quests.ts line 1907.',
    'Source comment: the accept hook may start a real fauna stray (QuestLifecycleHooks.onAnimalTargetBound, plan quests-progression-030); generated world:lost-livestock quests must not.',
  ],
}

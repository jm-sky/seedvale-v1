import type { QuestMeta } from '../../../schema'

export const meta: QuestMeta = {
  id: 'Q13',
  version: 'v2',
  title: 'The Ash House Vault',
  status: 'verification needed',
  origin: 'v2-authored',
  pack: 'C-codex-treasure',
  scope: 'deferred-implemented',
  implemented: true,
  giver: 'Irene Taylor',
  place: 'ruin near T',
  scale: 'treasure',
  category: 'treasure',
  difficulty: 'hard',
  prerequisites: [
    'visited T',
    'anchor "ash" exists',
  ],
  rewards: [
    'rebuild: free bed at the Ash House waystation (message only)',
    'clear_debts: none in code',
    'sell: 50 c on top of the share (journal only)',
  ],
  sourceFlags: { stages: 5, endings: 3 },
  derived: ['category', 'difficulty'],
  sources: {
    definition: 'SeedVales-v2/src/game/data/quests/q13.ts',
    tests: ['SeedVales-v2/src/game/sim/questQ13.test.ts'],
    docs: ['catalog/v2/q13-ash-house-vault/README.md', 'plans/quests--003--remaining-authored-quests.md'],
  },
  notes: [
    '❓ the 50 c in "sell" has no pay effect in the code',
  ],
}

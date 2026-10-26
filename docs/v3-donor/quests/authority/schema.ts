/**
 * Metadata schema for the quest catalog (docs/quests/catalog/<version>/<id>/meta.ts).
 * Documentation only: docs/ is excluded from tsc, ESLint and vitest.
 *
 * Rule: a value copied from a source project is "sourced"; a value inferred by an agent
 * is listed in `derived` (🟡 AI assumption). Unknown values are `null` (❓ open).
 */

export type QuestVersion = 'v1' | 'v2'

/** Same vocabulary as docs/guidelines/directory-structure.md. */
export type QuestStatus = 'draft' | 'todo' | 'planned' | 'in progress' | 'done' | 'verification needed'

/** How the quest is defined in the source project. */
export type QuestOrigin =
  | 'v1-static' // QUESTS in seedvale-v1/src/quests/quests.ts
  | 'v1-module' // dedicated authored module in seedvale-v1/src/quests/*.ts
  | 'v2-authored' // AUTHORED_QUESTS in SeedVales-v2/src/game/data/quests

/** v2 design pack the quest came from. */
export type QuestPack = 'A-codex-1' | 'B-grok' | 'C-codex-treasure'

/** Scope decision for v2 (docs/quests/plans/quests--003 §0a, D-PLAN-11). */
export type QuestScope = 'retained' | 'deferred-implemented' | 'deferred-not-built'

/** Inferred, not present in the originals. */
export type QuestCategory =
  | 'delivery'
  | 'gathering'
  | 'hunting'
  | 'investigation'
  | 'repair'
  | 'trade'
  | 'treasure'
  | 'social'
  | 'story'
  | 'profession'
  | 'other'

/** Inferred from v2 tier/scale or v1 objectives; not present in the originals. */
export type QuestDifficulty = 'easy' | 'medium' | 'hard' | 'epic'

/** v2 design-doc scale (as written in the docs). */
export type QuestScale = 'small' | 'medium' | 'treasure' | 'large'

/** Fields of QuestMeta whose value was inferred rather than copied. */
export type QuestDerivedField = 'category' | 'difficulty' | 'titleEn' | 'giver' | 'place' | 'rewards'

export interface QuestSources {
  /** Quest definition, relative to docs/comparison/code. */
  definition: string
  /** Tests, relative to docs/comparison/code. */
  tests?: readonly string[]
  /** Design doc / roadmap / plans in this repo, relative to docs/quests. */
  docs?: readonly string[]
}

export interface QuestMeta {
  /** Original id from the source project (v1 `zagubiona-owca`, v2 `Q03`/`G01`). */
  id: string
  version: QuestVersion
  /** Title as in the source (v1 Polish, v2 English). */
  title: string
  /** English working title for Polish originals; 🟡 translation. */
  titleEn?: string
  status: QuestStatus
  origin: QuestOrigin
  pack?: QuestPack
  scope?: QuestScope
  /** Built in the source project (v2: Q10 is not). null = ❓ unknown. */
  implemented: boolean | null
  giver: string | null
  /** v2 place code (H settlement, V village, T town) or free text for v1. */
  place: string | null
  scale?: QuestScale
  category: QuestCategory
  difficulty: QuestDifficulty
  /** Prerequisites as written in the source (quest outcome, relation, reputation...). */
  prerequisites: readonly string[]
  /** Rewards / consequences as written in the source. */
  rewards: readonly string[]
  /** Original schema flags worth keeping (urgency, exposure, priority, deadlineHours...). */
  sourceFlags?: Readonly<Record<string, string | number | boolean>>
  derived: readonly QuestDerivedField[]
  sources: QuestSources
  /** Free-form open questions (❓). */
  notes?: readonly string[]
}

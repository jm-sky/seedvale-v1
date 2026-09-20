# Implementation Notes: quests-progression-072 — Invalidated quest restore metadata continuity

Recon baseline: verified on `main` 2026-09-20. Scope is metadata continuity when an **active** wild-animal-bound quest becomes `invalidated` during **constructor restore**. Do not add wild fauna persistence or a restoration subsystem.

**Implementation (2026-09-20):** Wild restore invalidation in `QuestManager` constructor now builds from `runtimeProgress(restored)`, strips `stageCount` / `stageSlotProgress`, and writes via `setQuestState()` so journal, dialogue cooldowns, and observation survive. `invalidateStaleAnimalTargets()` already used `setQuestState()` and needed no change. Tests extended in `QuestManager.test.ts`.

## Current implementation

### Restore pipeline

`SaveData.quests.progress` → `createApp.ts` → `new QuestManager(defs, …, initial)`.

Constructor sequence (`src/quests/QuestManager.ts` ~665–696):

1. Seed every materialized def as `{ state: 'not_offered', stageIndex: 0 }`.
2. For each saved entry with matching def id:
   - `restored = normalizeRestoredProgress(def, entry)` — preserves journal, worldKnowledge, dialogueCooldowns, observation, stage progress fields, suppression, outcome migration for terminal states.
   - If `restored.state === 'active'` and current stage has `kill_target_animal` / `find_animal` slots:
     - **Livestock** (`LIVESTOCK_KINDS`): `states.set(id, runtimeProgress(restored))` + `bindAnimalTargetIfNeeded()`.
     - **Ordinary wild:** direct `states.set(id, { state: 'invalidated', stageIndex: restored.stageIndex })` then `continue` — **skips** `runtimeProgress()` and **`setQuestState()`**.

`animalTargets` is runtime-only (never persisted). Wild restore intentionally does not rebind (`resolveAnimalTarget` could attach a different individual). Livestock rebinding is deterministic via household/spawn identity (existing tests in `QuestManager.test.ts`).

### Rebuild pipeline (aligned meaning, different code path)

`createApp.ts::rebuildWorld()` (~2747) calls `questManager.invalidateStaleAnimalTargets()` when not doing New Game `reset()`.

`invalidateStaleAnimalTargets()` (~1843–1867):

- Scans **active** quests with bound wild (non-livestock) animal targets.
- Clears stale bindings via `clearAnimalTargetsForQuest()`.
- Sets `{ state: 'invalidated', stageIndex: s.stageIndex }` through **`setQuestState()`**, which merges durable fields from the **current active runtime** (`journal`, `worldKnowledge`, `dialogueCooldowns`, `observation` — see ~730–757).

### Asymmetry (root cause of the defect)

| Path | Metadata source when invalidating | Result today |
| --- | --- | --- |
| Mid-session rebuild | `setQuestState()` merges from active runtime | Durable metadata **preserved** |
| Save/load restore | Raw `states.set` after seed `not_offered` | Normalized save metadata **discarded** |

The restore branch correctly invalidates lifecycle and avoids wild rebind, but it does not apply the same transition contract as `setQuestState()` / rebuild invalidation.

Relevant wild restore branch (~687–689):

```ts
this.states.set(entry.id, { state: 'invalidated', stageIndex: restored.stageIndex })
```

Tests proving invalidation without metadata assertions: `QuestManager.test.ts` “invalidates an active wild-fauna-kind quest (wolf) on restore” (~785), “invalidates an active wild boar binding on restore and rebuild” (~1912).

## Exact files and symbols

| File | Symbols |
| --- | --- |
| `src/quests/QuestManager.ts` | Constructor restore loop; `normalizeRestoredProgress()`; `runtimeProgress()`; `setQuestState()`; `bindAnimalTargetIfNeeded()`; `invalidateStaleAnimalTargets()`; `clearAnimalTargetsForQuest()`; `reset()`; `exportProgress()`; `animalTargets` |
| `src/quests/quests.ts` | `QuestProgressEntry`, `QuestState`, `questStageObjectiveSlots()` |
| `src/settlement/livestock.ts` | `LIVESTOCK_KINDS` |
| `src/quests/QuestManager.test.ts` | Restore/rebuild/reset regressions |

No `saveData.ts` changes — optional fields already validated.

## State ownership

- **Persisted / durable:** `QuestProgressEntry` fields owned by `QuestManager` export/restore (`journal`, `worldKnowledge`, `dialogueCooldowns`, `observation`, lifecycle, terminal outcome when applicable).
- **Runtime-only:** `animalTargets`, `feedContributionIds` — must stay empty/unbound for wild invalidate-on-restore.
- **Fauna:** owns real animal identity; restore must not trust wild `animalId` across sessions.

## Contracts to reuse (do not duplicate)

### `normalizeRestoredProgress(def, entry)`

Single save-compatibility normalization entry point (~3232). Wild invalidation must start from its output, not re-derive metadata from `QuestDef` authorship.

### `runtimeProgress(entry)`

Maps persisted entry → `QuestRuntimeProgress` (~3154), including metadata collections. Use as the base snapshot before converting lifecycle to `invalidated`.

### `setQuestState(id, value)`

Transition merge contract (~730–757): preserves non-empty journal/worldKnowledge/dialogueCooldowns and observation when omitted from `value`. Contrasts with `reset()` (~710–718), which intentionally bypasses merge.

### `invalidateStaleAnimalTargets()`

In-session counterpart for wild identity loss after fauna rebuild. After this plan, restore and rebuild should produce the same **exported** durable metadata for the same pre-invalidation saved entry (lifecycle `invalidated`, same `stageIndex`, no resumable stage counters, no wild bind).

Optional: extract a **private** helper used by both restore wild branch and `invalidateStaleAnimalTargets()` only if it avoids duplicating field-clear rules — not a new service or registry.

## Implementation decision

When restore classifies an active animal-bound stage as untrustworthy wild:

1. Start from `const restored = normalizeRestoredProgress(def, entry)` (already computed).
2. Build runtime snapshot: `runtimeProgress(restored)` **or** equivalent durable copy.
3. Strip **continuation-only** active progress that must not imply resumability after invalidation:
   - omit / clear `stageCount`
   - omit / clear `stageSlotProgress`
   - do **not** write `animalTargets` (restore wild path already skips bind; no `clearAnimalTargetsForQuest` required unless a future path pre-bound — currently none on restore)
4. Apply lifecycle `invalidated` with preserved `stageIndex` (keep current history/debug semantics).
5. Commit through **`setQuestState()`** (preferred) so merge rules match rebuild, **or** set full runtime object including durable fields explicitly if clearer.

Do **not**:

- call `applyOutcome()` — `invalidated` is not a quest outcome;
- grant rewards, relations, reputation side effects;
- persist wild `animalId`;
- preserve active-stage counters as resumable state.

### Fields

| Preserve | Drop / omit on invalidate |
| --- | --- |
| `journal`, `worldKnowledge`, `dialogueCooldowns`, `observation` | `stageCount`, `stageSlotProgress` |
| `stageIndex` (restored) | runtime `animalTargets` |
| — | invented `resolvedOutcomeId` |

`offerSuppressedUntilDay` applies only to `not_offered`; not relevant for active→invalidated restore.

`exportProgress()` only exports `stageCount` / `stageSlotProgress` for `active` (~3120–3128), so cleared counters will not reappear in saves after invalidation.

### Shared helper (optional)

If restore and `invalidateStaleAnimalTargets()` both need identical “strip counters + invalidate + preserve durable fields” logic, a private method on `QuestManager` is sufficient:

```text
toInvalidatedWildProgress(from: QuestRuntimeProgress): QuestRuntimeProgress
```

Narrow scope — no new persistence shape.

## Duplication / identity guard

- Same `questId`; no second quest row.
- No wild rebind on restore; `onInteractObjective` for arbitrary same-kind animal must not advance quest (existing tests).
- Livestock path unchanged: `runtimeProgress(restored)` + `bindAnimalTargetIfNeeded()`.
- Constructor still skips entries where `!states.has(entry.id)` (def not materialized).

## Change order

1. Add failing restore tests with journal/worldKnowledge/dialogueCooldowns/observation on active wild quests **before** code change.
2. Fix wild restore branch to preserve durable metadata and drop continuation fields.
3. Align `invalidateStaleAnimalTargets()` if helper extraction reduces drift (rebuild may already preserve via merge — add test asserting parity).
4. Confirm `reset()` still clears all metadata and bindings.
5. No persistence schema changes.

## Regression tests

Extend `src/quests/QuestManager.test.ts`:

1. Active wild `kill_target_animal` restore → `invalidated` (existing behavior).
2. Active wild `find_animal` restore → `invalidated`.
3. Persisted `journal` survives restore invalidation.
4. `worldKnowledge`, `dialogueCooldowns`, `observation` survive when present on saved active entry.
5. Active `stageCount` / `stageSlotProgress` **not** present in runtime/export after invalidation.
6. No wild `animalTargets` binding; animal death/found objectives no-op (extend existing wolf/boar tests).
7. Livestock active restore still rebinds and completes (existing sheep tests).
8. `invalidateStaleAnimalTargets()` preserves durable metadata when invalidating wild binding (mirror restore).
9. `reset()` clears journal/worldKnowledge/dialogueCooldowns/observation and `animalTargets`.

Use minimal fixtures (`homeQuest('dzik-przy-szlaku')`, `wolfDef`, `makeRestoredManager`) already in file.

## Persistence / save compatibility

- No version bump or migration.
- Saves already store optional metadata fields.
- Change only stops dropping normalized fields at restore invalidation boundary.
- `animalTargets` remains absent from save data.

## Guardrails

- Do not persist ordinary wild individual IDs.
- Do not invalidate livestock restore/rebind semantics.
- Do not route through outcome resolution or reward pipelines.
- Do not preserve active counters as resumable progress.
- Do not alter `reset()` metadata clearing.
- No parallel restoration registry; no `quests-progression-069` scope.

## Manual verification

User-owned browser only:

1. Active wild-bound quest with visible journal/context → save/reload → `invalidated` with history still visible where UI shows it.
2. Kill/find new same-species animal → quest does not advance.
3. Livestock-bound quest → save/reload → still active/completable.
4. New Game → prior metadata gone.

## Out of scope

- Wild fauna identity persistence / fauna save schema.
- Quest outcome or UI redesign.
- Generated opportunity retention (`quests-progression-071`).
- Offer pacing (`quests-progression-069`).
- Changing when invalidation triggers (only **how** state is written once triggered).

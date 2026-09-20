# Implementation Notes: quests-progression-071 — Generated opportunity retention semantics

Recon baseline: verified on `main` 2026-09-20. Scope is **only** which saved generated quest IDs force definition rematerialization at composition. Do not expand into `quests-progression-069`, authored quests, or a second persistence registry.

## Current implementation

### What a “generated opportunity” is

Generated opportunities are **not** a persisted collection. They are lightweight records (`SettlementQuestOpportunity` / `RpgQuestOpportunity` in `src/quests/opportunities/worldQuestOpportunityTypes.ts`) built during **`createApp()` composition only**, then materialized into normal `QuestDef` objects and merged into `questDefs`:

```text
initialSave?.quests.progress
→ createApp.ts (persistedQuestIds — currently every entry.id)
→ per home settlement:
     buildWorldDrivenSettlementQuests()
       → collectSettlementQuestOpportunities()  // wolf-den, lost-livestock, injured-cow
       → collectRpgQuestOpportunities()         // RPG matrices
       → selectSettlementQuestOpportunities()
       → materializeSettlementQuestOpportunity() / materializeRpgQuestOpportunity()
     buildHunterProfessionQuests()
     buildGuardEveningDutyQuest()
→ opportunityQuestDefs
→ questDefs = [...authoredQuestDefs, ...opportunityQuestDefs]
→ new QuestManager(questDefs, …, { progress: initialSave.quests.progress })
```

Authored / binding-driven quests (`lostHunter`, `dungeonBandit`, chronicles, etc.) are appended to `opportunityQuestDefs` but **do not** consume `persistedQuestIds`; they use their own binding caches. This plan touches only the three builder paths that accept `persistedQuestIds`.

### Lifetime and “cleanup”

| Layer | Lifetime | Removal |
| --- | --- | --- |
| Lightweight opportunity records | Single `createApp()` pass | Discarded after materialization |
| Materialized `QuestDef` | App-level `QuestManager.defs` until next full app boot | Not re-selected on in-session `WorldBundle` rebuild |
| Runtime progress | `QuestManager.states` | `reset()` (New Game); terminal transitions; export on save |

There is no background TTL or opportunity registry. “Stale opportunity” in the defect sense means: a **pristine** progress row in the save file still forces the same generated ID through collectors/selection on the **next cold boot**, even though the player never engaged with that quest.

### Save/load interaction (the defect)

`QuestManager.exportProgress()` (`src/quests/QuestManager.ts`) emits one `QuestProgressEntry` per **materialized** definition, including untouched defaults:

```ts
{ id, state: 'not_offered', stageIndex: 0 }
```

`src/app/saveState.ts::buildSaveData()` persists that array verbatim.

On reload, `src/app/createApp.ts` (line ~1455) currently does:

```ts
const persistedQuestIds = initialSave?.quests.progress.map((entry) => entry.id)
```

Downstream consumers treat **every** saved ID as requiring reconstruction/preference:

- `selectSettlementQuestOpportunities()` — persisted IDs are taken first with `ignoreLimit = true`; RPG matrix slots are reserved by the first selected matrix candidate (`src/quests/opportunities/settlementQuestSelection.ts`).
- `collectRpgQuestOpportunities()` — parses persisted RPG IDs and calls `reconstructRpgOpportunity()` even when no live candidate exists (`src/quests/opportunities/rpgQuestMatrices.ts`).
- `collectSettlementQuestOpportunities()` — reconstructs wolf-den / lost-livestock / injured-cow IDs from persisted IDs when live sources are absent (`src/quests/opportunities/settlementQuestOpportunities.ts`).
- `buildHunterProfessionQuests()` — `persisted.has(hunterIIIId)` can force step III materialization intent (`src/quests/opportunities/hunterProfessionQuests.ts`).
- `buildGuardEveningDutyQuest()` — materializes when `persisted.has(id)` even if evening preconditions fail (`src/quests/opportunities/guardProfessionQuests.ts`).

**Loss vs staleness:**

- **Over-retention (bug):** materialized-but-pristine generated quest → saved → reload pins old RPG matrix candidate / world-driven ID though selection would pick a fresh eligible candidate today.
- **Under-retention (must not regress):** meaningful progress/metadata/terminal history **must** still reconstruct by deterministic ID when live sources changed or disappeared (covered by existing tests such as `rpgQuestMatrices.test.ts` “reconstructs… after landmark no longer live-eligible” and “always rematerializes a persisted generated id even after the live source disappears”).

### Offer / suppression / acceptance / external resolution

All of these run **after** composition inside `QuestManager`:

- **Offer admission:** `not_offered` → `offered` / suppression checks via `offerSuppressedUntilDay` and decline path `declineOffer()` (`QuestManager`).
- **Suppression:** decline sets `not_offered` + `offerSuppressedUntilDay` (exported only for `not_offered`). Retention predicate **must** treat suppressed `not_offered` as retention-worthy so the same generated definition (and giver binding) survives reload.
- **Acceptance:** `offered` → `active`; stage progress may add `stageCount` / `stageSlotProgress` while `active`.
- **External / world resolution:** terminal `complete` / `failed` with optional `resolvedOutcomeId`; `abandoned` / `invalidated` without outcome id per `QuestProgressEntry` contract (`src/quests/quests.ts`). Terminal/history entries must retain definition identity for journal/history consumers.

Composition retention filtering does **not** change any of this runtime behavior.

### In-session rebuild

`QuestManager` and `questDefs` survive ordinary `rebuildWorld()` (`src/app/createApp.ts`). Generated opportunities are **not** re-collected mid-session. Plan scope is cold boot / save-load composition only.

## Exact files and symbols

| File | Role |
| --- | --- |
| `src/app/createApp.ts` | Derives `persistedQuestIds`; passes to generated builders (~1478, ~1492, ~1507, ~1563). |
| `src/app/saveState.ts` | `buildSaveData()` → `exportProgress()` (unchanged). |
| `src/quests/quests.ts` | `QuestProgressEntry`, `QuestState`, field semantics. |
| `src/quests/QuestManager.ts` | `exportProgress()`, restore constructor (unchanged by this plan). |
| `src/quests/opportunities/worldQuestMaterialization.ts` | `buildWorldDrivenSettlementQuests()`. |
| `src/quests/opportunities/settlementQuestSelection.ts` | `selectSettlementQuestOpportunities()`. |
| `src/quests/opportunities/settlementQuestOpportunities.ts` | `collectSettlementQuestOpportunities()`. |
| `src/quests/opportunities/rpgQuestMatrices.ts` | `collectRpgQuestOpportunities()`, `parseRpgQuestId`, `reconstructRpgOpportunity`. |
| `src/quests/opportunities/hunterProfessionQuests.ts` | `buildHunterProfessionQuests()`. |
| `src/quests/opportunities/guardProfessionQuests.ts` | `buildGuardEveningDutyQuest()`. |
| `src/quests/opportunities/rpgQuestMatrices.test.ts` | RPG reconstruction / selection regressions. |
| `src/quests/opportunities/settlementQuestOpportunities.test.ts` | World-driven persisted ID regressions. |

**New symbol (planned):** pure helper, e.g. `requiresGeneratedOpportunityRetention(entry: QuestProgressEntry): boolean`, placed in a small module importable from `createApp.ts` without pulling opportunity collectors into app layer — e.g. `src/quests/opportunities/generatedOpportunityRetention.ts` or adjacent to `quests.ts` if types-only dependency is preferred. Add `@domain quests-progression` JSDoc for preflight.

## State ownership

- **`QuestManager`:** authoritative runtime + exported `QuestProgressEntry[]`.
- **`createApp.ts`:** composition-only decision: which saved **generated** IDs require definition continuity on this boot.
- **Collectors/materializers:** deterministic ID parse/reconstruct; no lifecycle ownership.
- **World/fauna/settlement sources:** authoritative for **live** candidates only; must not erase persisted history when retention says reconstruct.

Do **not** add a generated-opportunity save table, cache, or parallel quest state.

## Implementation decision

Introduce **one** composition-level predicate answering: *would dropping this generated definition lose meaningful persisted continuity?*

**Pristine (non-retaining)** — all must hold:

- `state === 'not_offered'`
- `stageIndex === 0`
- `resolvedOutcomeId === undefined`
- `stageCount === undefined`
- `stageSlotProgress === undefined` or empty / no slot with progress (mirror export semantics: treat `{}` as non-retaining)
- `offerSuppressedUntilDay === undefined`
- `journal` absent or empty
- `worldKnowledge` absent or empty
- `dialogueCooldowns` absent or empty
- `observation === undefined`

**Retention-worthy (conservative):** any deviation from pristine above; additionally any lifecycle state other than pristine `not_offered` at stage 0, including at minimum:

- `offered`, `active`, `ready_to_report`
- terminal: `complete`, `failed`, `abandoned`, `invalidated`
- `not_offered` with decline suppression or any durable metadata
- non-zero `stageIndex`, `stageCount`, or meaningful `stageSlotProgress`

Do **not** special-case quest families in the predicate. Authored quests are unaffected (they are not filtered through this seam).

In `createApp.ts`, replace unconditional `.map((entry) => entry.id)` with IDs from entries where the predicate is true (for generated retention only — the saved progress array passed to `QuestManager` remains the full `initialSave.quests.progress`).

Pass the **same filtered ID list** to all four existing `persistedQuestIds` call sites in the home-settlement loop.

Do **not** change `QuestManager.exportProgress()`.

### Save-file pruning (expected side effect)

On the next save after reload, `exportProgress()` only emits rows for **currently materialized** defs. Pristine generated quests that are no longer rematerialized will **drop out** of `quests.progress` naturally. No migration or explicit save scrubbing is required; this is composition interpretation, not schema change.

### Pre-existing quirk (out of scope)

`buildHunterProfessionQuests()` uses `needIII = persisted.has(hunterIIIId)` but returns early without materializing III when `!thicket` (`if (thicket || needIII) { if (!thicket) return defs }`). Retention fixes pinning of pristine IDs; fixing hunter-III-without-thicket reconstruction is a separate issue unless tests prove this plan regresses it.

## Change order

1. Add predicate + unit tests (exported or via dedicated describe).
2. Wire filtered IDs in `createApp.ts` (single derivation, four call sites).
3. Extend opportunity selection/reconstruction tests for pristine vs meaningful RPG/world-driven cases.
4. Do not alter collector ranking/caps/matrix rules except via corrected input IDs.

## Regression tests

Minimum automated coverage:

1. Pristine generated `not_offered` / stage 0 / no optional fields → **not** in retention set.
2. `offered`, `active`, `ready_to_report` → retained.
3. Terminal `complete`, `failed`, `abandoned`, `invalidated` → retained.
4. `not_offered` + `offerSuppressedUntilDay` → retained.
5. `not_offered` + each metadata family (`journal`, `worldKnowledge`, `dialogueCooldowns`, `observation`) → retained.
6. Non-default `stageIndex`, `resolvedOutcomeId`, `stageCount`, meaningful `stageSlotProgress` → retained.
7. RPG: previously selected but pristine candidate does **not** block a fresh matrix candidate after reload; meaningful RPG progress still reconstructs same ID.
8. Declined generated offer keeps same ID/suppression across reload (no matrix rotation bypass).
9. World-driven persisted ID still reconstructs when live source gone (existing tests should keep passing).

Prefer extending `rpgQuestMatrices.test.ts`, `settlementQuestOpportunities.test.ts`, and selection tests over new broad fixtures.

## Persistence / save compatibility

- No `CURRENT_SAVE_VERSION` bump.
- No migration.
- Older saves: pristine rows may remain in file until next export; they stop affecting composition immediately after this change.
- Meaningful rows continue to reconstruct via existing deterministic IDs.

## Guardrails

- No `quests-progression-069` pacing changes.
- No authored-quest persistence semantic changes.
- No second opportunity persistence store.
- No per-collector “persisted” definitions — filter once at composition.
- Do not remove meaningful history because live sources disappeared.
- Keep deterministic generated ID formats unchanged.

## Manual verification

User-owned browser checks only (do not run as implementation agent):

1. RPG candidate visible but never offered → save/reload → matrix not pinned to stale untouched candidate when a fresh candidate should win.
2. Decline generated offer → save/reload during suppression → same quest id still suppressed, not rotated.
3. Accept/start generated quest → save/reload after world change → same quest/history returns.

## Out of scope

- `quests-progression-069` offer pacing/gating.
- Opportunity caps, ranking, matrix ordering policy.
- Redesigning `exportProgress()` or save pruning policy beyond natural export behavior.
- Hunter III / thicket edge case fix.
- New generated quest types, UI, broad quest audit.
- `quests-progression-072` (invalidated restore metadata).

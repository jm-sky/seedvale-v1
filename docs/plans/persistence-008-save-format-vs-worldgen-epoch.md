# Plan: Save format vs worldgen epoch (v57) and pre-Revival save refusal

**Created:** 2026-10-30  
**Status:** `done` ✅
**Priority:** high · **Effort:** M  
**Depends on:** none  
**Domain:** `persistence`  
**Subdomains:** `save-schema` `save-slots` `worldgen`  
**Type:** `infrastructure`  
**Roadmap:** V1 Revival queue Q8 (implementation gated on P1 exit, see Scheduling) · Strategic Brief D1 (approved) · Master Roadmap P2 step (i)

## Problem

A save is only meaningful against the world it was made in, but `SaveData` carries no worldgen identity. Its version (`CURRENT_SAVE_VERSION = 56`, `src/persistence/saveData.ts`) describes the **format** of the persisted fields; the geography those fields point at (settlement positions and IDs, roads, cemeteries, chunk item placements, tree IDs, location geometry) is deterministic reconstruction from `config.seed` plus the **generator code**. After an incompatible generator change (P2 epoch: settlement spacing/routes, procedural cemeteries — brief D3), a v56 save would pass `loadStoredSave()` as `ok` and silently restore NPCs, transport checkpoints, graves, player buildings and terrain deltas onto moved geography ([strategy audit §3.2 #1](../research/v1-revival/2026-10-27--revival-audit--strategy-architecture.md)).

Bumping a worldgen cache namespace does not help: the cache is disposable acceleration, outside `SaveData` by design ([persistence.md — Worldgen cache](../state/persistence.md#worldgen-cache)). Bumping `CURRENT_SAVE_VERSION` for every generator change would conflate the two axes: each format bump would either force a new game or pretend a migration can fix geography it cannot.

**D1 (approved):** separate save-format evolution from explicit worldgen compatibility; v57 is the proposal; clearly refuse incompatible pre-Revival saves with an understandable message; compatible new saves must round-trip.

## Implementation (2026-10-30, queue Q27)

Landed as one commit (steps 1–5 together): `worldgenEpoch.ts` (`WORLDGEN_EPOCH = 0`, checklist in its JSDoc), `SaveConfig.worldgenEpoch` + fail-closed validation, `CURRENT_SAVE_VERSION = 57` with `migrateSaveV56ToV57`, `loadStoredSave(value, { worldgenEpoch })` epoch step and `'incompatible-world'` result, `inspectStoredSave(..., options)` passthrough, `UnhealthySaveEntry` type with `worldgenEpoch`, direction-aware `unhealthySaveStatusLabel(entry)` used by `StartScreen.vue` / `PauseMenuEntriesSaves.vue`, `saveDb` diagnostic kind, `saveState.ts` writes the epoch. Behaviour-neutral for existing saves at epoch 0.

Tests: plan §Tests 1–5, 7, 8, 9, 10 in `saveData.test.ts`, `saveSlots.test.ts`, `saveDb.test.ts`. Test 6 (`createSaveState()` round-trip) has no harness — `saveState.ts` needs a live runtime; covered instead by `saveDb` create → read of a current-epoch save (outgoing validation + load) and `tsc` on the snapshot literal. Verification: `vue-tsc --noEmit`, eslint, `vitest src/persistence src/app` green. **Author 2026-10-30:** accepted without the browser check.

Note for Q28: settlement names already changed in `b4e30641` (before this plan landed), so saves made between that commit and this one are labelled epoch 0 like older ones. Whether the Revival bump `0 → 1` should treat that as part of the batch is the author's epoch-scope decision (D3/Q28).

## Current code (verified 2026-10-30, `cef767da`)

| Concern | Owner | Fact |
| --- | --- | --- |
| Format version | `saveData.ts` `CURRENT_SAVE_VERSION` | `56`; single source, imported by `src/app/saveState.ts:176`. |
| Migration chain | `saveData.ts` `SAVE_MIGRATIONS` + `migrateStoredSave()` | v1→v56, one pure step per version, fails closed on missing/throwing step. History starts at the v1 hard cut (plan 201). |
| Load pipeline | `saveData.ts` `loadStoredSave()` → `StoredSaveResult` | `ok` · `invalid` · `migration-failed` · `unsupported-version`; validation by `isSaveData()` after migration. |
| Slot status layer | `saveSlots.ts` `inspectStoredSave()`, `UnhealthySaveStatus`, `unhealthySaveStatusLabel()` | Labels `Uszkodzony` / `Nieudana migracja` / `Nieobsługiwana wersja`; rendered as "… — nie można wczytać" in `StartScreen.vue:180` and `PauseMenuEntriesSaves.vue:229`, with `Usuń` still available. |
| Storage consumers | `saveDb.ts` (`readAllSlots`, `migrateLegacyIfNeeded`, `readSave`, `listSaveManagementEntries`, write guard) | Every non-`ok` status is surfaced or logged, never deleted (only `invalid` legacy `'current'` rows are discarded); writes refuse to overwrite a slot whose stored record is not `ok` (`invalid-existing-slot`). |
| World config in save | `SaveConfig` (`seed`, `terrain`, `sky`, `player`, `settlements`); validated by `isSaveConfig()` | Fields are applied one by one in `createApp.ts:544–561` (`applyStored*`), so an added field does not leak into `WorldConfig`. |
| Worldgen cache | `worldgenCacheDb.ts` + per-namespace owners + `worldgenFingerprint.ts`; boot fixture `worldgenFixture.ts` (tools-020) | Per-namespace version + fingerprint; mismatch = cache miss. Unrelated to `SaveData`. |

## Design

### 1. Two independent axes

| Axis | Constant | Bumped when | Old value on load |
| --- | --- | --- | --- |
| **Save format** | `CURRENT_SAVE_VERSION` (`saveData.ts`) | The persisted representation or semantics of `SaveData` change. | Migrated forward by `SAVE_MIGRATIONS` as today. |
| **Worldgen epoch** | `WORLDGEN_EPOCH` (new, `src/persistence/worldgenEpoch.ts`) | A deterministic generator change moves geography or identity that persisted state refers to (checklist §5). | **Never migrated.** Not equal → refused with a dedicated status. |

A format bump never forces a new game; an epoch bump never needs a format bump. Later schema changes (e.g. equipment E2, Master Roadmap X1) bump the format normally and carry the epoch through untouched.

### 2. v57 representation

- `SaveConfig.worldgenEpoch: number` — a non-negative integer, required at v57. It sits in `config` because it is part of the world's identity (next to `seed`), not of player state.
- `isSaveConfig()` rejects a missing, non-integer or negative value (current-version saves fail closed, as with `SavePlayer.health`).
- `saveState.ts` writes `worldgenEpoch: WORLDGEN_EPOCH`. `createApp.ts` ignores it (no `applyStored*` needed — the running build always generates its own epoch).
- **Migration v56 → v57:** sets `config.worldgenEpoch = 0` — the pre-Revival epoch. The migration **succeeds**: the format question ("can this build read the fields?") and the world question ("was it made in this world?") stay separate, which is the point of D1. This replaces the audit's earlier proposal of a deliberately failing migration, which would have labelled pre-Revival saves `Nieudana migracja` and been indistinguishable from a real bug.
- Value semantics: `0` = every save made before persistence-008 (all of them were generated by the pre-Revival generator). `WORLDGEN_EPOCH` starts at `0` when this plan lands (no generator change yet — every existing save stays loadable) and becomes `1` in the first incompatible P2 generator commit.

### 3. Compatibility check and new status

`loadStoredSave()` gains one step after migration + `isSaveData()`:

```text
detect version → (> current: unsupported-version)
→ migrate chain → (fail: migration-failed)
→ isSaveData → (fail: invalid / migration-failed)
→ data.config.worldgenEpoch !== WORLDGEN_EPOCH → { status: 'incompatible-world', version, worldgenEpoch }
→ ok
```

- New `StoredSaveResult` member `{ status: 'incompatible-world', version: number, worldgenEpoch: number }`; `UnhealthySaveStatus` and `InspectedSaveSlot` extend with it, using the existing union types (no parallel validator — audit §2 "Refuse incompatible saves").
- **Both directions refuse:** an older epoch (pre-Revival) and a newer epoch (save from a newer build opened in an older one). The label distinguishes them so the player is not told to start over when they merely run an old build:
  - `worldgenEpoch < WORLDGEN_EPOCH`: **`Świat sprzed aktualizacji — zacznij nową grę`**
  - `worldgenEpoch > WORLDGEN_EPOCH`: **`Zapis z nowszej wersji świata`**
  
  `unhealthySaveStatusLabel()` takes the entry (or the epoch pair) instead of only the status so it can choose; the UI keeps the existing "— nie można wczytać" suffix and `Usuń`. Exact wording is a UI string; the author may adjust it at review without changing the contract.
- The check runs only on a schema-valid save, so an incompatible-world slot still shows its name, seed and day (the envelope name is recovered as for the other unhealthy statuses; `toSaveManagementEntry` may additionally expose `seed`/`elapsedDays` read from the validated data — optional, UI polish).
- `saveDb.ts` consumers need no new branches: every `status !== 'ok'` path already surfaces/logs instead of loading or deleting. `logSaveDiagnostic` gains the new kind. `migrateLegacyIfNeeded()` keeps an incompatible legacy `'current'` row (only `invalid` is discarded).
- **Write guard:** an incompatible-world slot is non-`ok`, so the existing guard refuses to overwrite it (`invalid-existing-slot`). Intended: a new game always gets a new slot (`beginNewSave()`), and the player removes the old one explicitly with `Usuń`. No silent clobbering of a save the player might want to keep for an old build.
- **`Kontynuuj`** stays hidden when only unhealthy rows exist (`StartScreen.vue`, ui-input-011 §3) — an incompatible save never auto-loads at boot.

### 4. What does not change

- Worldgen cache namespaces keep their own versions/fingerprints. `WORLDGEN_EPOCH` is **not** mixed into cache fingerprints: a generator change still bumps exactly the affected namespaces (CLAUDE.md determinism rule), and a namespace bump alone never bumps the epoch. The boot fixture (tools-020) is re-exported for changed namespaces; its own check script detects stale records.
- Seed library (`seedDb`/`seedRecord`) stores names and usage only; same seed in a new epoch is simply a different world — no record change.
- In-session `WorldBundle` rebuild is unaffected (same build, same epoch).
- No migration of geography: there is no step that "moves" an old save onto new settlement positions. Semantic incompatibility is refused, never repaired ([Master Roadmap P2 acceptance](../research/v1-revival/2026-10-27--master-revival-roadmap.md)).

### 5. Epoch bump checklist (for every generator change)

Bump `WORLDGEN_EPOCH` when a deterministic generator change alters any input the persisted state below refers to. Comment next to the constant lists this table's rows; each row names the persisted reference and the generator it depends on.

| Persisted reference (SaveData) | Depends on generator | Typical trigger |
| --- | --- | --- |
| Settlement IDs / economies / households / `structureStates` / land ownership | settlement grid + `generateSettlementDef()` / `VillagePlan` | `SETTLEMENT_GRID_STEP`, placement, layout |
| NPC states, relationships, transport/expedition checkpoints, travel positions | NPC identity + settlement plans + roads | spacing, routes, family/roster generation |
| `graves`, cemetery-related quest/progress state | cemetery assignment / layout | procedural cemeteries |
| `terrainModifications`, player buildings, placed objects (positions) | terrain heightmap/biomes/rivers/roads | terrain or hydrology rule change |
| `collectedItemIds`, `renewableWorldItems`, `consumedWorldPickupIds` | chunk item placement IDs | placement algorithm / ID scheme |
| `treeOverrides` | vegetation placement IDs | tree placement / ID scheme |
| resource-deposit depletion, grass-forage patches, fauna spawn-point FSM, `persistentHabitatOccupants` | deposit/patch/spawn/habitat placement | placement / ID scheme |
| map discovery, location discovery/knowledge, cave positions (player `y` seed) | world locations, caves | location/cave generation |

Rules:

- **Bump** when an existing seed would place any of these somewhere else, give them different IDs, or drop/add them.
- **Do not bump** for changes that keep every persisted reference valid: visuals/shaders/LOD, density of non-persisted decoration, performance changes with identical output (P1 slices), new optional content that old saves simply lack.
- **One coordinated epoch (D3):** the P2 batch (spacing/routes, cemeteries, and names only if D2 is approved) bumps `0 → 1` **once**, in its first generator-changing commit; later commits of the same batch reuse epoch 1. Saves started on `main` between batch commits are dev saves and may mismatch; the author starts the real post-Revival game after the batch is closed. A later incompatible change after that bumps again.
- When unsure, bump: a refused save is visible; a silently mismatched one is a correctness bug.

## Implementation steps (one commit each, P2)

1. `src/persistence/worldgenEpoch.ts`: `WORLDGEN_EPOCH = 0` with JSDoc (axis definition, §5 checklist, D3 batching rule).
2. `saveData.ts`: `SaveConfig.worldgenEpoch`, `isSaveConfig()` validation, `CURRENT_SAVE_VERSION = 57`, `migrateSaveV56ToV57` (`config.worldgenEpoch = 0`), registry entry `56:`.
3. `saveData.ts` `loadStoredSave()` epoch step + `StoredSaveResult` member; `saveSlots.ts` status/label/entry types; `saveDb.ts` diagnostic kind; `StartScreen.vue` / `PauseMenuEntriesSaves.vue` label call.
4. `saveState.ts` writes `worldgenEpoch`.
5. Docs: `docs/architecture/ARCHITECTURE.md#save-schema` (field + version), `docs/state/persistence.md` (two-axis section in "Migrations/versioning", fifth slot status), CLAUDE.md determinism bullet ("bump `WORLDGEN_EPOCH` per its checklist in addition to the affected cache namespaces"), STATE.md if it names the version.

Steps 1–4 land together if splitting would leave `main` writing v57 without the check; at `WORLDGEN_EPOCH = 0` the whole change is behaviour-neutral for existing saves.

## Tests

`src/persistence/saveData.test.ts` (existing "schema versioning and migration pipeline" block) and `saveSlots.test.ts`, `saveDb.test.ts`:

1. v56 fixture → `loadStoredSave` → `ok` with `config.worldgenEpoch === 0` while `WORLDGEN_EPOCH = 0`.
2. Same v56 fixture with the epoch under test set to `1` → `incompatible-world`, `version: 56`, `worldgenEpoch: 0`; not `migration-failed`. (Make the expected epoch injectable — e.g. `loadStoredSave(value, { worldgenEpoch })` defaulting to `WORLDGEN_EPOCH` — mirroring how `migrateStoredSave` takes its registry, so tests do not patch a module constant.)
3. Oldest supported fixture (v1) walks the whole chain and lands on epoch 0 (same refusal at epoch 1).
4. v57 save with a newer epoch → `incompatible-world` with the "newer" label.
5. Current-version v57 save missing/negative/fractional `worldgenEpoch` → `invalid` (fails closed).
6. Round-trip: `createSaveState()` snapshot output (v57, current epoch) → store → `loadStoredSave` → `ok`, deep-equal on `config`.
7. Migration step v56→v57 is pure (input not mutated) and touches only `config.worldgenEpoch` and `version`.
8. `inspectStoredSave` keeps the envelope name for an incompatible-world slot; `sortSaveManagementEntries` places it with the unhealthy rows; label text per direction.
9. `saveDb`: `readSave` of an incompatible-world active slot returns `null` (boot does not load it); `listSaveManagementEntries` surfaces it; `writeSave` over it returns `invalid-existing-slot` and leaves the bytes unchanged; legacy `'current'` incompatible row is kept, not deleted.
10. Future-format guard still wins: `version > CURRENT_SAVE_VERSION` → `unsupported-version`, regardless of epoch.

Verification: `npx tsc --noEmit`, targeted `vitest` for `src/persistence/`, `pnpm run lint:fix`. Browser check (author, §2 of the queue): with a pre-plan save in the profile, start screen shows the slot as loadable at epoch 0; after a local `WORLDGEN_EPOCH = 1` build it shows the refusal label, `Kontynuuj` hidden, `Usuń` works, a new game saves and continues normally.

## Scheduling and gates

- **D4:** this change adds no per-frame or worldgen work, but it is runtime save-pipeline behaviour outside A/B/C/D/E. It lands at **P2 step (i)**, after P1 exit, before the first incompatible generator commit (Master Roadmap §P2). Landing it earlier would need a recorded D4 exception; there is no correctness pressure for that while `WORLDGEN_EPOCH` would stay `0`.
- The epoch bump `0 → 1` belongs to the first P2 generator commit (spacing or cemeteries), not to this plan.

## Out of scope

- Any generator change (spacing, cemeteries, names — D2 still open).
- Migrating or "rebasing" old saves onto a new world.
- Per-feature compatibility flags or partial loading of an old save (e.g. keep inventory, drop world state). Possible future idea; not approved.
- Cache namespace redesign or global cache invalidation.

## Open questions for the author

None blocking the plan. The refusal labels (§3) are proposals; the author may reword them at review.

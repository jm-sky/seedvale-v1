# Review 027 — V3 equipment catalogue Stage 3 compatibility

**Date:** 2026-10-27  
**Status:** `done` (static review; execution limitations below)  
**Verdict:** **READY WITH CONDITIONS** for **Stage 4 planning only**. Not permission to implement or activate Stage 4.  
**Findings:** **0 P0 · 0 P1 · 2 P2 · 2 P3**.

## 1. Scope and revisions

- V1: `jm-sky/seedvale-v1`, Stage 3 implementation [`e44932dd61b199fe1b6df4f95fd4dbc2ff90be11`](https://github.com/jm-sky/seedvale-v1/commit/e44932dd61b199fe1b6df4f95fd4dbc2ff90be11). Reviewed `main` baseline: `6fb20d12d213021a3672a01676a0049eac5cccb9` (five later commits; review publication uses an optimistic branch-head check).
- Donor: `jm-sky/seedvale` at **`907e17cd2ad487547a25a1f928b2770348183d75`**. The donor source revision remains pinned; the current donor `main` was observed at this revision.
- Read: `CLAUDE.md`, `STRATEGIC-BRIEF.md`, equipment recon, complete ID mapping, property matrix, Stage 1–3 notes, existing review conventions; implementation, contracts, tests, verifier, fixtures, CI, V1 `items.ts`, `itemCatalog.ts`, `Inventory.ts`, `equipment.ts`, `itemInstances.ts` and related item/NPC selection boundaries. Inspected Stage 3 changed-file list and the later-main comparison.
- No runtime source modified as part of this review.

## 2. Independent verification and evidence

| Area | Independent observation |
| --- | --- |
| Canonical coverage | Connector-based text comparison of `compatibility.ts` policy, `catalogue.ts` records and `equipment-id-mapping.md`: **87/87**, same order and IDs; 87 unique catalogue IDs and 87 mapping rows. |
| Classification | Exact baseline agreement for **17 existing / 9 adapt / 27 new / 4 conflict / 30 deferred**. Note: passing the baseline comparison does **not** mean the validator prevents future policy drift (P2-1). |
| Targets | 29 declared V1 target/candidate strings; all belong to current `ItemKind`. No many-to-one duplicates among the 29. **25 verified projections**, **4 candidates/conflicted targets**, plus the missing `obsidian_knife` historical claim without a target. The validator also checks `ITEM_DEFS` and `ITEM_CATALOG` existence and actual roles. |
| Properties | `PROPERTY_CLASSES` contains **46 unique paths**: 41 donor top-level keys plus two legacy namespaces and three named resistances. `propertyPaths` checks own keys and nested properties, including own `undefined`. The original resolved donor values stay in the frozen catalogue; metadata is not an automatic conversion. |
| Donor pin | Independently fetched the **Git tree at the exact donor SHA**; all five file blob SHAs agree with `scripts/items/fixtures/v3-equipment/manifest.json` (types `3d94565`, weapons `a6de03c`, armor `584c9cb`, catalog `217aeac`, character types `53b7bff`). This establishes source-fixture **commit membership**, not a fresh execution of the 87-record resolver. |
| Isolation | Stage 3 commit changes only the isolated `src/items/v3Equipment/` code/tests plus verifier, CI and docs; not the active `ItemKind` union, `ITEM_DEFS`, `ITEM_CATALOG`, `Inventory`, equipment, combat, NPC, acquisition or persistence implementations. The later main comparison includes separate player/Inventory UI work: it is not attributable to Stage 3. |
| Dependency direction | Inert source `types/catalogue/provenance` has no gameplay runtime imports. `compatibility → catalogue/propertyCompatibility`, `validation → compatibility/catalogue`; only `adapter → itemCatalog/items` loads authoritative V1 values. `items.ts` itself imports Three.js/asset modules, so importing the adapter in a future gameplay path is **not** cost-free. No new production consumer was found in the inspected boundaries. The `contracts.test.ts` source scan is designed to reject any external production `v3Equipment` importer; not executed in this review. |
| Activation boundary | `projectV3Equipment` uses only canonical catalogue lookup, returns frozen wrappers, references original V1 objects without copying numeric tuning, and never registers kinds or issues items. Source `availability` and `tier` are not activation gates. |

**Identity decisions (verified fail-closed in the authored policy):** `arrow` is a conflict with historical `broadhead_arrow` (not canonical V1 `arrow`), while `arrow_bodkin → war_arrow` is a separate verified reference. `marlow_longbow → masterwork_hunting_bow` and `fenmoor_sword → masterwork_sword` stay blocked conflicts; `obsidian_knife` has no V1 target; `sling_stone → stone` stays an unverified blocked candidate. Current V1 ordinary/broadhead/war ammo counts, bonus policies, stone resource/throwable use and original bow/sword rewards are not converted. Armor `torso → body` and `shoulders → arms` checks only describe *existing* profiles; `forearms`, `under` layering and typed resistance are not projected. `items-player-044` remains planned.

## 3. Confirmed defects — ordered by severity

### P2-1 — Policy classification integrity is not independently enforced

**Code:** [`validation.ts:63–113`](../../src/items/v3Equipment/validation.ts), [`compatibility.ts:21–114`](../../src/items/v3Equipment/compatibility.ts), [`compatibility.test.ts:19–25`](../../src/items/v3Equipment/compatibility.test.ts).

**Evidence:** Validation checks that a classification is *a valid enum value* and verifies target/identity shape; for no-target `new` and `deferred` entries it does **not** check the reviewed action against an independent expected mapping. For example, swapping `padded_cap: new` with `falchion: deferred` satisfies the no-target, blocked, inactive and nonempty-decision rules and preserves global category totals. The current regression checks correct counts **only on the original manifest**. `verifiedRevision` and evidence prose are compared to locally authored literals, not dynamically proven provenance.

**Impact:** Later edits can silently change the Stage 4 candidate set without invalidating `validateEquipmentCompatibility`, even though the baseline manifest itself is currently correct. The validator provides independent **structural V1 target checks**, but not fully independent **reviewed classification approval**. This is a remaining F2 limitation, not evidence of activated gameplay.

**Minimal action:** Add a deterministic independent fixture of reviewed `ID → classification / approved target-role` expectations (e.g. parsed and verified mapping fixture), and negative tests that swap `new/deferred` while keeping totals. Keep semantic approval explicitly human-owned; do not turn metadata into activation authority.

**Stage 4:** Does not block planning; **must be resolved before relying on the manifest to select items for implementation**.

### P2-2 — Malformed manifest shape can throw instead of returning a fail-closed conflict

**Code:** [`validation.ts:74–85`](../../src/items/v3Equipment/validation.ts), [`adapter.ts:25–37`](../../src/items/v3Equipment/adapter.ts).

**Evidence:** The validator directly dereferences `entry.historicalAliases.v1`, `entry.properties.length`, `entry.evidence.sourceId` and `entry.evidence.checks.join(',')` without shape guards. A runtime-supplied malformed entry (e.g. `evidence: undefined` or `checks: undefined`, possible despite a TypeScript signature through JS/unchecked input) throws a `TypeError`. The adapter never catches it, despite its intended `conflict + errors` result for invalid manifests. Existing negatives mutate valid, fully shaped entries, not structurally malformed input.

**Impact:** An invalid manifest can cause an exception and interrupt consumers, though it does not issue/register items. The current frozen built-in manifest is valid; this is a contract-hardening defect, not a current user-facing gameplay regression.

**Minimal action:** Narrow runtime shape checks before nested access, returning diagnostic errors; test null/missing/wrong-type nested evidence, aliases, properties and decisions. Preserve strict no-projection behavior.

**Stage 4:** Does not block planning; correct before exposing the adapter to runtime-supplied policies or new gameplay consumers.

## 4. Risks and test debt (not confirmed gameplay defects)

### P3-1 — Global fail-closed invalidation lacks an explicit per-entry regression

**Code:** [`adapter.ts:31–33`](../../src/items/v3Equipment/adapter.ts), [`validation.ts:63–113`](../../src/items/v3Equipment/validation.ts).

**Evidence:** Every known-ID lookup validates the **entire** supplied manifest. A defect in an unrelated row (e.g. a broken `mail_shirt` alias) makes `projectV3Equipment('knife')` return a `conflict`. This is conservatively fail-closed and may be intentional, but the notes do not clearly say failures are *global*, and existing tests corrupt the requested row/whole catalog rather than expressly testing an unrelated row. Repeated all-entry scanning per lookup is also a future hot-path concern, not a current benchmarked regression.

**Minimal action:** Document global invalidation and add an unrelated-entry negative test. For Stage 4, decide explicitly whether validation is a one-time manifest gate or a per-query operation; do not casually introduce partial fallback.

**Stage 4:** No planning blocker.

### P3-2 — Provenance automation/remote CI evidence remains limited

**Code:** [`verify-v3-equipment-source.ts:22–34, 205–215`](../../scripts/items/verify-v3-equipment-source.ts), [`.github/workflows/ci.yml:20–29`](../../.github/workflows/ci.yml), [`tsconfig.equipment-verification.json`](../../tsconfig.equipment-verification.json).

**Evidence:** `--git-tree` genuinely checks repository origin, pinned commit object and source-path blob membership; it is optional and not part of CI's equipment-contract step. Default CI source fidelity compares locally pinned fixture bytes; this alone cannot prove a Git commit owns those blobs. This review independently resolved the five blobs at the pinned Git tree, closing *current-pin evidence*, not automated provenance for future pins. GitHub check-runs and workflow-runs queries at reviewed SHAs returned no attestable runs, so remote CI PASS cannot be claimed.

**Minimal action:** Record/repeat a pinned tree-membership audit on source-pin changes (CI with a verified donor object, or a documented exact-SHA GitHub check). Retain the existing focused `tsc` CI step.

**Stage 4:** No planning blocker for the current unchanged donor pin.

## 5. Previous issue closure

- **F2:** **Partially closed.** Existing V1 target existence, categories, configurations, explicit melee family table, ammo consumers, aliases, collision and fail-closed projections are checked against executable V1 data. Baseline classification integrity and `verifiedRevision`/evidence statements are not independently attested by the validator (P2-1). Do not describe historical ancestry as gameplay equivalence.
- **Stage 2 P3-A (Git provenance):** **Current pin externally verified** by all five actual donor Git-tree blobs; optional local `--git-tree` command exists. It failed in the implementer's environment because the donor checkout lacked the old commit object. No automated CI membership check (P3-2).
- **Stage 2 P3-B (focused TypeScript in CI):** **Configuration present.** `tsconfig.equipment-verification.json` includes the new sources/tests and verifier; `ci.yml` invokes it. No independent CI execution result observed.

## 6. Tests and limitations

**Independently performed in this review:** GitHub source/tree/revision and commit-diff inspection; programmatic text comparisons of all **87** policy rows against all **87** catalogue canonical IDs and all **87** reviewed mapping rows, 29 target strings against current `ItemKind`, duplicate targets, and 46 declared property paths; exact pinned Git-tree blob verification.

**Not executed here:** Vitest, TypeScript, ESLint, standalone source-fidelity resolver, build, gameplay/browser tests. The GitHub connector offers repository content and Git objects but **no V1 checkout, installed dependencies or test runner**; there is no usable local V1 working tree in this session. Do not confuse static verification with executed tests. At implementation time, Stage 3 notes record **7 suites / 154 passing tests**, focused `tsc`, full app typecheck, scoped ESLint and offline fidelity PASS; these are **author-reported historical results**, not independently rerun or supported by a retrieved CI success attestation. No runtime, GPU, combat/save, visual or performance verification is claimed.

**Coverage assessment:** Positive tests cover target references, frozen/unchanged objects, canonical-only lookup, all 87 results and inert flags. Negative tests cover missing/duplicate donor and policy IDs, missing V1 targets, changed categories/slots/ammo consumers, alias and evidence token edits, conflicting targets/projections and incomplete property coverage. Source tests cover field-level value/own-key mutation. Gaps: classification swaps preserving counts (P2-1), malformed structural input (P2-2), and unrelated-row invalidation (P3-1). Existing isolation test scans production TS/Vue, but was not rerun on current main. No accidentally active new kind was found in Stage 3's file changes.

## 7. Stage 4 planning readiness

**READY WITH CONDITIONS — planning only.** Stages 1–3 preserve source identity and original V1 authority adequately for bounded Stage 4 design without wholesale redesign. Correct P2 issues before trusting new candidate selection or making this adapter a gameplay admission gate; P3 gaps should be closed with focused tests/documentation. Stage 4 implementation and the selection of *which* items to activate **are not approved**.

Any separately approved Stage 4 scope needs: authored `ItemKind` / `ITEM_DEFS` / `ITEM_CATALOG` entries and full tuned melee/ranged/armor/visual profiles, owned item/instance/held/equipment integration, player and NPC symmetry, explicit stock/trade/artisan/loot/reward paths, save/restore and old-save compatibility, tested eligibility/identity, and no donor automatic obtainability. Preserve V1 timing, damage, ammo selection, item identity and existing Inventory/hybrid three-panel UI. V3 shield, layered armor, quality/edge/condition, typed resistances and other future mechanics remain inert unless separately specified. Do not import V3 item authority or general crafting.

## 8. Minimal corrective handoff

1. **P2-1:** independently lock the reviewed classification/action baseline and add paired drift regressions. Keep decisions and projection approval distinct.
2. **P2-2:** robust structural validation and a no-throw `conflict` return for malformed manifests; add malformed-input negatives.
3. **P3-1:** specify/test global invalidation and avoid per-item revalidation inside a future frame/tick loop.
4. **P3-2:** preserve exact donor membership evidence for changes of source pin, and obtain independent CI test evidence when available.

Corrections belong in a separate task; this review changes no implementation.

## 9. Explicitly unresolved author decisions

- `arrow / broadhead_arrow / war_arrow`: future mapping, ammo preference and save/stock identity must preserve V1 distinctions.
- `marlow_longbow / masterwork_hunting_bow` and `fenmoor_sword / masterwork_sword`: reward roles, progression, balance and canonical identity.
- Missing historical `obsidian_knife`; proposed `sling_stone / stone` resource/throw/sling identity.
- Which new V3 items actually enter Stage 4, and via which authored acquisition routes; unique/quest constraints.
- `items-player-044`: `shoulders` / `forearms` split and old `arms` saves; armor under/outer occupation, typed protection, player/NPC parity, quality/condition and visual timing. The existing planned slot work is not implemented by Stage 3.

# Equipment catalogue — Stage 3 implementation notes

**Created at:** 2026-10-27\
**Created by:** ChatGPT Codex\
**Status:** Stage 3 implemented and technically verified. Inert compatibility only; equipment migration remains incomplete. Stage 4 is not implemented or approved.

Continues [Stage 2](./2026-10-27--equipment-catalogue-stage-2-implementation-notes.md). The [recon](./2026-10-27--equipment-catalogue-recon.md), [ID mapping](./2026-10-27--equipment-id-mapping.md) and [property matrix](./2026-10-27--equipment-property-matrix.md) own the detailed semantic analysis.

## Starting state and preservation

V1 was on `main`, HEAD `7db3382b8d6a49d428ae5d68733aee31b28437a4`, with no staged, unstaged or untracked changes. Reviewed the Stage 1 and Stage 2 file lists (`d1087ec8`, `890b58ff`), required research, current item/instance/Inventory/equipment contracts and existing verification tests. Current Inventory remains the authoritative implementation. No commit, push, PR, checkout, reset, stash or cleanup was performed.

The donor pin remains **`907e17cd2ad487547a25a1f928b2770348183d75`**. Provenance, immutable catalogue, definition types and fixture SHA metadata are unchanged. Local donor HEAD is now `6c9c4a53c97adff7e845b47044506cdb8314bf57`, with a clean worktree; that Git database lacks the pinned commit object. No newer donor source was imported and no donor files or refs were changed.

Windows `core.autocrlf=true` had checked the five fixture sources out as CRLF. Added a fixture-only LF `.gitattributes` rule and restored their original LF bytes, first checking each reconstructed blob against its existing SHA. The five resulting blobs match both V1 HEAD and the pinned manifest; there is no source-content diff. The verifier still hashes exact bytes. Research Markdown parsing alone now accepts LF and CRLF.

## Manifest, properties and adapter

- [compatibility.ts](../../../src/items/v3Equipment/compatibility.ts): explicit, typed policy for **87/87** canonical IDs: **17 existing, 9 adapt, 27 new, 4 conflict, 30 deferred**. `CanonicalV3Id` is derived from the authored policy keys; executable comparison against the independent catalogue proves exhaustive coverage. Invalid policy tuple combinations are rejected by TypeScript. Every expanded entry is frozen, carries source/V1 revisions, source-version historical aliases, traceable source/target identity evidence, unresolved decisions and integration dependencies. Projection permission is explicit in target-bearing policy rows, independent of ancestry. Activation is always `inactive`.
- **25 verified references** (17 existing + 8 adapt) may return the original V1 profile. Four additional relationships are candidates only: Arrow, Marlow, Fenmoor and sling stone. Missing historical obsidian knife has no current target. This distinction accounts for the mapping's 29 proposed current target strings without claiming that all 29 are safe projections.
- [propertyCompatibility.ts](../../../src/items/v3Equipment/propertyCompatibility.ts): one closed typed property-class map, covering all 41 top-level keys and named nested fields. Each definition accounts for exactly its own keys, including own undefined keys. Classification is conservative: display text is preserved without a localization conversion, mixed slot/physical semantics use conflict, and future mechanics remain unavailable. No field marked adapted is automatically consumed. Full donor values remain accessible through the independent source catalogue. An empty decision `affectedProperties` list denotes a whole-definition decision; armor additionally names slots/layers/resistance and `items-player-044`.
- [validation.ts](../../../src/items/v3Equipment/validation.ts): pure structural checks against supplied read-only V1 definitions/catalogue. Checks source/manifest identity and uniqueness, property coverage/classes, actual target existence and `kind`, item categories, held melee/ranged configuration, independently listed melee families, ranged/ammo consumers and existing armor slot roles. Historical claims must match the actual source metadata. Arrow's canonical collision, the four conflicts, candidate stone relationship, ambiguous targets and multiple donors targeting one V1 kind fail closed. No shared-target policy has been approved; all many-to-one mappings are rejected.
- [adapter.ts](../../../src/items/v3Equipment/adapter.ts): `projectV3Equipment(id, v1?, manifest?)` accepts canonical lookup strings only, returning `existing-v1-profile`, `new-candidate`, `deferred`, `conflict` or `unknown-id`. The original classification remains in `compatibility` (including `adapt`). Invalid policy/target validation returns a conflict with diagnostics; unknown IDs have no fallback. A blocked verified relationship yields deferred. The adapter is deterministic, never registers an item and performs no numerical conversions or recurring work.

Existing profile results borrow the complete `ITEM_DEFS` and `ITEM_CATALOG` objects through deeply readonly TypeScript views. Only owned result wrappers are frozen; the adapter never freezes, copies over or mutates existing V1 authorities. The sole runtime imports from V1 are in the adapter. Source types/catalogue/provenance remain independent of V1 gameplay imports. No production source outside this isolated module imports the compatibility layer; the isolation test enforces this, including on Windows paths.

## Identity decisions and validation limits (F2)

Verified ancestry/category/family means a compatible reference to an existing V1 identity, **not gameplay equivalence**. Family membership is checked against current executable V1 contracts and explicit identity-family assertions; it is not inferred from a nonempty evidence string. Source fidelity is established separately by the original-source verifier, not by the `source-preserved` label. Revision metadata records the review baseline; it does not prove semantic equivalence or approve later V1 edits.

The following remain human decisions: Arrow versus broadhead identity; Marlow reward/bow role, timing and range; Fenmoor material/tier/balance; the absent obsidian knife; candidate sling-stone/resource reuse; complete new profiles and acquisition selection; economy, quality, condition and timing/units; armor layers/typed protection and the shoulder/forearm split owned by `items-player-044`. Forearms are never projected into arms. Shoulder/torso role comparisons in validation describe existing targets only and export no equipment-slot conversion. No typed resistance becomes scalar mitigation. Availability/tier never grant activation.

## Verification and review debt

Commands executed from the V1 root using installed local tools:

```powershell
node node_modules/vitest/vitest.mjs run src/items/v3Equipment scripts/items/verify-v3-equipment-source.test.ts src/items/Inventory.test.ts src/items/equipment.test.ts src/items/itemCatalog.test.ts
node node_modules/typescript/bin/tsc --project tsconfig.equipment-verification.json
node node_modules/vue-tsc/bin/vue-tsc.js --noEmit
node node_modules/eslint/bin/eslint.js src/items/v3Equipment/adapter.ts src/items/v3Equipment/compatibility.ts src/items/v3Equipment/propertyCompatibility.ts src/items/v3Equipment/validation.ts src/items/v3Equipment/compatibility.test.ts src/items/v3Equipment/contracts.test.ts scripts/items/verify-v3-equipment-source.ts scripts/items/verify-v3-equipment-source.test.ts
node --import tsx scripts/items/verify-v3-equipment-source.ts
node --import tsx scripts/items/verify-v3-equipment-source.ts --git-tree D:/Projekty/private/seedvale
git diff --check
```

Results: focused Stage 2/3 and Inventory/equipment/catalogue regressions **7 suites / 154 tests PASS**; focused TypeScript **PASS**; full application typecheck **PASS**; scoped ESLint **PASS**; standalone source fidelity **PASS**: 87/87 ordered records, all 41 keys/own-key distinctions and values, 26 type/domain equalities and five typed exports. Diff whitespace check **PASS**. Negative tests alter real V1 category/configuration/slot/ammo consumers, remove targets, forge identity/evidence/projection metadata, duplicate IDs/targets and corrupt property coverage. Positive tests cover the named aliases, protected conflicts, native V1 equipment, stable references and unchanged inventory arrow counts. No browser, visual, combat execution or GPU verification is claimed.

Initial verification failures were resolved without weakening assertions: fixture blob mismatch caused by CRLF checkout, then the Markdown section parser's LF-only delimiter. Added LF/CRLF parser regression coverage. `pnpm claude:preflight equipment-catalogue` failed at the package-manager store lock in the sandbox. The direct installed equivalent (`node --import tsx scripts/claude/pre-implementation.ts equipment-catalogue`) then reported `Plan not found`; this task is a research-stage brief, not an indexed plan. Required documents and targeted source were inspected directly. Vitest/tsx required execution outside the sandbox because it blocks esbuild child processes; approval review allowed them.

**P3-B resolved:** [focused tsconfig](../../../tsconfig.equipment-verification.json) includes the source contracts, tests and script verifier. The existing [CI workflow](../../../.github/workflows/ci.yml) now runs `pnpm exec tsc --project tsconfig.equipment-verification.json` as a separate narrow step. Local execution passed; remote CI has not been run for these uncommitted changes.

**P3-A:** added `--git-tree` to the verifier for a reproducible origin/commit/path/blob membership check, permitting a newer donor HEAD without altering it. This local command **FAILED**, explicitly because the pinned commit object is absent (`unknown revision ...^{commit}`); it is not reported as a PASS. Instead, independently read all five paths through the GitHub connector Contents API at the exact pin; every returned blob SHA matches the unchanged fixture manifest:

| Path at pinned revision | Verified blob SHA |
| --- | --- |
| [items/types.ts](https://github.com/jm-sky/seedvale/blob/907e17cd2ad487547a25a1f928b2770348183d75/src/game/data/items/types.ts) | `3d945658772c450f4832b31276af2b96bf20a5cf` |
| [items/weapons.ts](https://github.com/jm-sky/seedvale/blob/907e17cd2ad487547a25a1f928b2770348183d75/src/game/data/items/weapons.ts) | `a6de03c815af43b4e39f79027748b8b8d2a83858` |
| [items/armor.ts](https://github.com/jm-sky/seedvale/blob/907e17cd2ad487547a25a1f928b2770348183d75/src/game/data/items/armor.ts) | `584c9cbf9cc612f735e21af2d73a6d6669b47231` |
| [items/catalog.ts](https://github.com/jm-sky/seedvale/blob/907e17cd2ad487547a25a1f928b2770348183d75/src/game/data/items/catalog.ts) | `217aeac6533fb0495fec8b768af7dc77ffe4c5f3` |
| [character/types.ts](https://github.com/jm-sky/seedvale/blob/907e17cd2ad487547a25a1f928b2770348183d75/src/game/data/character/types.ts) | `53b7bff4036da23aa5f66ab7ce7c15ac0a86ae05` |

Current-pin membership is therefore independently verified through GitHub. Offline fixture verification alone still does not prove commit membership; keep this limitation explicit. Every future donor-pin update must independently verify all five blobs at the reviewed commit using Git-tree membership or exact-ref GitHub checks before changing metadata. No automatic network fallback or metadata update was added to the offline verifier.

## Stage 4 prerequisites

**READY WITH CONDITIONS** for separate Stage 4 planning/review, not activation approval. Resolve the relevant identity decisions and select an explicit integration scope. Author missing V1 profiles and acquisition/persistence contracts before any new runtime kind. Reconcile armor with `items-player-044` and shared player/NPC protection. Retain the source/compatibility/gameplay authority boundaries and independently verify provenance for any pin change.

Active V1 item values, acquisition, combat/equipment behavior, Inventory physical operations and its three-panel/hybrid-row UI are unchanged. No persistence schema change, save migration, new obtainable item or Stage 4 implementation is included.

## Corrective pass — Review 027 (2026-10-27)

**Scope:** isolated Stage 3 corrections, based on [Review 027](../../reviews/2026-10-27--027--v3-equipment-catalogue-stage-3-review.md). Starting checkout: clean `main`, `8b8c3034175e4a55a7631b05884db606cd089d82`; no staged, unstaged or untracked work to preserve. The environment initially had no repository; a sparse checkout includes all source, scripts and documentation. Current source was inspected before editing. The independent review remains unchanged. Stage 4 is neither implemented nor approved.

| Finding | Resolution and evidence |
| --- | --- |
| **P2-1: classification/identity integrity — resolved** | `compatibility.ts::matchesReviewedPolicy` compares each supplied entry against the private, explicit reviewed `POLICY` table, independently of the supplied expanded manifest. It checks classification, verified target versus candidate target, identity relation and exact projection permission. No second expanded manifest is maintained. Tests compare all 87 policy rows with the independent research mapping, reject every alternative classification for every ID, the totals-preserving padded-cap/falchion swap, internally consistent knife-to-new reclassification, verified-target replacement, candidate replacement and forged permissions. |
| **P2-2: malformed manifest — resolved** | `validation.ts::hasEntryShape` narrows `unknown` containers/entries before nested reads. Missing/malformed aliases, evidence/checks, target members, properties, decisions and dependencies return entry/field diagnostics. `projectV3Equipment` accepts `unknown` policy data and returns the existing inactive `conflict` plus `errors` shape on validation failure. There is no catch-all, normalization, registration or fallback projection. Missing required verified targets also fail the policy/target checks. Tests cover null entries, invalid containers, missing fields, nested wrong types and duplicate IDs. |
| **P3-1: global invalidation — resolved** | Deliberately retain the whole-manifest integrity gate for every known-ID lookup. An unrelated malformed `mail_shirt` blocks an otherwise valid `knife` projection with `mail_shirt: invalid or missing evidence`, without throwing or returning a profile. This prevents partial admission under a damaged policy. Trade-off: one defect blocks every known ID and validation scans all rows per query. This isolated adapter has no production consumer; future integration must separately decide a validated lifecycle boundary before hot-path use. Unknown canonical IDs still return `unknown-id` before manifest validation. |
| **P3-2: provenance/CI — local resolution; remote execution tracked separately** | New `fixtures/v3-equipment/git-tree-proof.json` contains the actual pinned commit object and six raw ancestor trees (base64), captured from the donor Git object database. `verifyPinnedTreeProof` hashes the commit against the pinned revision, then hashes and traverses each ancestor tree to the five exact path/blob pairs. `readPinnedSources` requires this proof before checking the original fixture bytes. Matching revision labels alone cannot pass. Tests reject forged commit content, changed tree bytes and missing intermediate evidence. CI retains its explicit focused `tsc` step and adds an explicit offline source-fidelity/membership step. |

### Policy authority and future changes

The reviewed policy remains **17 existing / 9 adapt / 27 new / 4 conflict / 30 deferred**, covering **87/87** definitions. Historical ancestry is distinct from verified current V1 identity; canonical name equality and evidence prose do not approve a projection. All four conflicts and the sling-stone candidate remain blocked. Existing profiles are borrowed by reference; all 25 references are checked against the original V1 objects. Even lowering a reviewed projection permission now requires a baseline change, rather than being silently accepted as a caller override.

Intentional future policy evolution must explicitly review each changed ID, classification, target/candidate role, identity evidence and projection permission against current V1 source. Record the human decision in the mapping/owning implementation notes, then update `POLICY` and the corresponding positive/negative tests together. Updating an evidence string or merely rebalancing classification totals is insufficient. This workflow permits reviewed evolution; it does not grant gameplay admission or Stage 4 approval.

The content-addressed proof establishes membership in the already approved commit; it is not a signature or approval of a different donor pin. For any separately authorized pin change, fetch the exact reviewed donor commit, capture its raw `git cat-file commit <sha>` text and each raw `git cat-file tree <ancestor-sha>` buffer needed by the five source paths (base64 in the proof), and independently review the resulting path/blob relationships before changing provenance/fixtures. Never regenerate this proof from imported catalogue values. The current donor revision, five source fixtures and blob manifest are unchanged.

### Verification commands and outcomes

Executed from the V1 checkout with Node **24.19.0** and installed dependencies:

```sh
node node_modules/vitest/vitest.mjs run src/items/v3Equipment scripts/items/verify-v3-equipment-source.test.ts src/items/Inventory.test.ts src/items/equipment.test.ts src/items/itemCatalog.test.ts
node node_modules/typescript/bin/tsc --project tsconfig.equipment-verification.json
node node_modules/vue-tsc/bin/vue-tsc.js --noEmit
node node_modules/eslint/bin/eslint.js src/items/v3Equipment/adapter.ts src/items/v3Equipment/compatibility.ts src/items/v3Equipment/validation.ts src/items/v3Equipment/compatibility.test.ts scripts/items/verify-v3-equipment-source.ts scripts/items/verify-v3-equipment-source.test.ts
node --import tsx scripts/items/verify-v3-equipment-source.ts
node --import tsx scripts/items/verify-v3-equipment-source.ts --git-tree /tmp/seedvale-equipment-donor
git diff --check
```

Results: **7 suites / 196 tests PASS**; focused TypeScript **PASS**; application typecheck **PASS**; scoped ESLint **PASS**; offline fidelity and commit membership **PASS** (87 records, all own keys/values, 26 type/domain equalities and five typed exports); independent live Git-tree audit **PASS** for all five blobs at `907e17cd2ad487547a25a1f928b2770348183d75`; whitespace check **PASS**. Existing Stage 2 source-fidelity assertions remain intact. The production-import isolation test passes. CI configuration actually invokes `pnpm exec tsc --project tsconfig.equipment-verification.json` and now `pnpm exec tsx scripts/items/verify-v3-equipment-source.ts`; both have local passing equivalents above. No network access or donor credentials are needed for ordinary tests or these CI checks. Remote CI completion is unverified at documentation time; local results are not a remote CI attestation.

The live Git-tree audit used a fresh bare donor object database, not a newer donor checkout:

```sh
git init --bare /tmp/seedvale-equipment-donor
git -C /tmp/seedvale-equipment-donor remote add origin https://github.com/jm-sky/seedvale.git
git -C /tmp/seedvale-equipment-donor fetch --depth 1 --filter=blob:none origin 907e17cd2ad487547a25a1f928b2770348183d75
```

Preparation limitations: the default package-store path was unavailable; dependency installation succeeded with `XDG_DATA_HOME=/tmp/seedvale-pnpm XDG_CACHE_HOME=/tmp/seedvale-cache pnpm install --frozen-lockfile --store-dir /tmp/seedvale-store`. Direct preflight (`node --import tsx scripts/claude/pre-implementation.ts equipment-catalogue`) reports `Plan not found`, as this is a research-stage task rather than an indexed plan; required context and targeted source/tests were read directly. The sandbox blocked child Git execution in the live audit; the same exact command passed with the authorized execution boundary. An initial focused TypeScript diagnostic in the new verifier was fixed with an explicit `string` annotation and rerun successfully. No browser/GPU/full-world benchmarks or gameplay acceptance are claimed.

Changed files: `compatibility.ts` (`matchesReviewedPolicy`), `validation.ts` (`hasEntryShape`, `validateEquipmentCompatibility`), `adapter.ts` (`projectV3Equipment`), `compatibility.test.ts`, verifier and verifier tests, the new Git proof fixture, `.github/workflows/ci.yml`, and this note. `compatibilityTypes.ts`, `propertyCompatibility.ts` and the focused tsconfig required no changes.

All 87 donor definitions, source pin, active `ItemKind`, `ITEM_DEFS`, `ITEM_CATALOG`, Inventory/UI, combat, NPC equipment, economy/acquisition and persistence remain unchanged. Remaining semantic decisions listed above still belong to separately authorized later work. These corrections close the Stage 3 technical findings locally, without approving Stage 4.

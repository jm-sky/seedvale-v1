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

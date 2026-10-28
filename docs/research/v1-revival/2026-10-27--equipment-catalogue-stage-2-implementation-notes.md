# Equipment catalogue — Stage 2 implementation notes

**Created at:** 2026-10-27\
**Created by:** ChatGPT Codex\
**Status:** Stage 2 implemented and technically verified. Inert preservation only; overall equipment integration remains incomplete. Stage 3 has not been implemented.

Continues [Stage 1](./2026-10-27--equipment-catalogue-stage-1-implementation-notes.md), using its existing types and provenance. The [recon](./2026-10-27--equipment-catalogue-recon.md), [reviewed ID mapping](./2026-10-27--equipment-id-mapping.md) and [property matrix](./2026-10-27--equipment-property-matrix.md) retain ownership of compatibility analysis and unresolved gameplay decisions.

## Source and initial state

- V1 branch `main`, initial HEAD `18a300748e7dc10f37fea72771bdbb723f1173fe`; clean index, tracked worktree and untracked-file list. Reviewed V1 `62e9196e1740df0777f7d18ee57546d2a9dfcda1` and Stage 1 commit `d1087ec8b753efbf607af17c3b6a42ef49257adf` exist locally. Two later commits changed dependencies/lint configuration and Inventory details; current files were authoritative and preserved.
- Donor `jm-sky/seedvale-v3`: clean local HEAD **`907e17cd2ad487547a25a1f928b2770348183d75`**, exactly matching Stage 1 provenance. No source-pin change. The four source paths remain byte-identical to recon **`94c464739d46afb982949fd6ed96b0d74d265b10`**. This does not claim a freshly fetched donor remote HEAD.
- Stage 1's six introduced files were inspected; only its verifier, contract tests and provenance comment changed. The provenance values, definition types and compatibility contracts are unchanged.

## Imported data and API

| Family | Resolved definitions |
| --- | ---: |
| Melee weapons | 30 |
| Ranged weapons | 8 |
| Armor | 39 |
| Shields | 3 |
| Ammunition | 7 |
| Total / unique canonical IDs | **87 / 87** |

[catalogue.ts](../../../src/items/v3Equipment/catalogue.ts) contains explicit typed resolved records, extracted once from the pinned constructor exports. It exports only `V3_EQUIPMENT_DEFINITIONS: readonly V3EquipmentDefinition[]` and `findV3EquipmentDefinition(id): V3EquipmentDefinition | undefined`. Enumeration follows donor `catalog.ts` equipment order: melee, ranged, shields, armor, ammunition, preserving each family's array order. A private canonical-ID map returns the same frozen records. Historical `legacyIds` never act as aliases; no V1 projection or registration exists.

All **41 distinct top-level definition keys**, original text, enums, numbers, nested legacy IDs, named resistances and ordered capability arrays survive. Constructor defaults are materialized (including durability, size, tier, availability, armor layer/origin and ammo damage type); armor's input resistance tuple becomes the original named `blunt/cut/pierce` object. Own properties with `undefined` remain explicit literals: for example, `padded_cap` owns both `legacyIds` and `lore` with undefined values, while `knife` has no own `lore` property. No JSON data round trip or null substitution is used.

Recursive freezing visits all owned nested objects and arrays once at module initialization. Stage 1 readonly types protect the public API at compile time. Tests recursively check every object and attempt replacement, deletion and addition, as well as array mutation. There are no external runtime imports, donor checkout/network/filesystem dependencies in the production catalogue, or recurring transformations.

## Reproducible verification (F1)

The existing [source verifier](../../../scripts/items/verify-v3-equipment-source.ts) now compares all imported records with independently evaluated original constructors. Its default source is [fixtures/v3-equipment](../../../scripts/items/fixtures/v3-equipment/README.md): byte-exact pinned donor files plus their Git blob IDs in `manifest.json`. Snapshots are original source text, not resolved output generated from the imported catalogue. The additional original `character/types.ts` is a compile-only dependency of donor `items/types.ts`; no character behavior or goods runtime is imported. `catalog.ts` is audited as source text and never evaluated.

The verifier checks fixture blobs, source revision, 26 type/domain equalities, equipment-union equality and five typed exports. It independently reads all 87 expected IDs from the reviewed mapping, rejects duplicate/missing/unexpected IDs, requires exact ordering and per-family counts, and recursively compares every own key and value using `Reflect.ownKeys` and strict assertions. VM objects are copied into local plain objects/arrays without losing own undefined keys. Failures report a canonical ID and field path, such as `padded_cap.resist.cut`, or an identity/count/source-blob diagnostic; the process exits nonzero. Hashes supplement field-level comparison rather than replace it.

Passing a donor path adds strict checks for its exact HEAD, repository origin, working-tree bytes, pinned blobs and recon baseline. An invalid or newer checkout fails; it never falls back to another revision. Default verification needs only the V1 checkout and installed dev dependencies, and runs in the focused Vitest suite, including in CI.

Commands executed successfully from V1 root (installed local binaries; equivalent `pnpm exec` forms may also be used):

```sh
./node_modules/.bin/vitest run src/items/v3Equipment scripts/items/verify-v3-equipment-source.test.ts src/items/Inventory.test.ts src/items/equipment.test.ts src/items/itemCatalog.test.ts
./node_modules/.bin/tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution bundler --verbatimModuleSyntax --allowImportingTsExtensions --noUnusedLocals --noUnusedParameters src/items/v3Equipment/*.ts scripts/items/verify-v3-equipment-source.ts scripts/items/verify-v3-equipment-source.test.ts
./node_modules/.bin/vue-tsc --noEmit
./node_modules/.bin/eslint src/items/v3Equipment scripts/items/verify-v3-equipment-source.ts scripts/items/verify-v3-equipment-source.test.ts
node --import tsx scripts/items/verify-v3-equipment-source.ts
node --import tsx scripts/items/verify-v3-equipment-source.ts /home/madeyskij/projects/private/seedvale
```

Results: **6 suites / 132 tests passed**; focused TypeScript, full application typecheck and scoped ESLint passed. Both verifier modes confirm **87/87 unique records, complete field-level equality and all 41 keys**, including optional-key presence, nested values and constructor defaults. Negative tests cover within/across-family duplicates, missing/unexpected records, a single numeric change, nested resistance, missing defined optional keys, undefined-to-absent and absent-to-undefined changes, null versus undefined, reordered records, reordered arrays and wrong family counts. Multi-entry capability ordering uses a synthetic fixture because pinned source capability arrays each have one entry.

The local-donor audit required sandbox escalation for Git subprocesses. `pnpm exec` initially attempted an automatic dependency installation and failed opening its store database; direct installed binaries completed checks without dependency changes. The context preflight could not resolve the research recon as a plan (`Plan not found`); required documents and targeted source boundaries were read directly. The historical Stage 1 full-typecheck failure does not reproduce on this starting tree. No browser, visual, combat execution or performance result is claimed.

## Isolation, F3 and Stage 3 prerequisites

The F3 assertion now uses distributive `KeysOfUnion<T>` to exclude instance state from every definition variant; a synthetic one-variant `edge` addition proves the guard sees union-only fields. Definition durability and base sharpness retain their original source meanings.

An import-isolation test scans production TS/Vue sources for consumers outside this module. No production gameplay system imports the catalogue. Inventory UI/migration files, V1 definitions/capabilities/prices/physical values, item instances, combat/NPC/economy/acquisition and persistence remain byte-identical to the initial tree. Existing Inventory/equipment/catalogue regression suites pass. No item gains or loses capabilities; no save-schema change or activation mechanism exists.

No data/count deviation from research was found. The explicit undefined-property distinction and checked-in source fixtures make its lossless-preservation requirement concrete.

**Stage 3 readiness: READY for a separately authorized adapter/validation stage.** F2 remains deliberately deferred: compatibility evidence and `verifiedRevision` are declarative. Stage 3 must establish manifest completeness, target/evidence validation, alias precedence and deterministic fail-closed projection without automatic registration. Arrow, Marlow/Fenmoor, missing historical obsidian knife, armor slots/layers, quality/condition, balance/units and acquisition decisions remain unresolved as recorded in the existing mapping and matrix. This stage settles none of them and grants no runtime activation approval.

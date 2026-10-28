# Equipment catalogue — Stage 1 implementation notes

**Created at:** 2026-10-27\
**Created by:** ChatGPT Codex\
**Status:** Stage 1 implemented and technically verified within the limits below. No catalogue records imported, runtime activation, or approval of subsequent stages.

Implements architecture **B** from the [recon](./2026-10-27--equipment-catalogue-recon.md#4-architecture-comparison-and-recommendation). The [property matrix](./2026-10-27--equipment-property-matrix.md) and [ID mapping](./2026-10-27--equipment-id-mapping.md) retain ownership of compatibility analysis and unresolved decisions. This note does not turn those proposed mappings into policy.

## Files and contracts

All six files are new; no existing files were edited.

| File | Responsibility |
| --- | --- |
| [types.ts](../../../src/items/v3Equipment/types.ts) | Five equipment variants using original `category` and weapon `kind` discriminants; exact source fields, enum domains and optionality, with deeply readonly nested legacy IDs, capabilities and named resistances. |
| [provenance.ts](../../../src/items/v3Equipment/provenance.ts) | Frozen source/schema metadata, original units and approved family counts. `schemaVersion: 1` and `catalogueVersion: v3-equipment-87` are preservation identifiers, not save versions. |
| [compatibilityTypes.ts](../../../src/items/v3Equipment/compatibilityTypes.ts) | Existing/adapted/new-candidate/conflict/deferred result contracts. Mandatory `activation: inactive`; verified targets use V1 `ItemKind` plus revision/evidence. Conflicts require a nonempty decision list. Closed property paths carry compatibility and required/verified source preservation status. |
| [contracts.test.ts](../../../src/items/v3Equipment/contracts.test.ts) | Synthetic fixtures and positive/negative type assertions; discrimination, all 41 keys, optionality, named resistances, immutability, inactive policy and import isolation checks. |
| [verify-v3-equipment-source.ts](../../../scripts/items/verify-v3-equipment-source.ts) | Opt-in read-only local donor audit: revision/path drift checks, TypeScript equality checks and resolved export counts. Uses temporary compiler input outside the repo and evaluates only pure weapons/armor constructors in a bounded VM. |
| This note | Implementation evidence and next-stage prerequisites. |

The source tier is not V1 armor quality. Definition durability/edge are not mutable condition. Historical IDs are not verified mappings. The complete `ItemCategory` domain is retained for exact donor-type comparison; the equipment union admits only equipment. No goods interfaces, instance contracts, conversion logic, aliases or adapter implementation were added.

## Source revisions and preservation boundary

- Target: `jm-sky/seedvale-v1`, local HEAD `e8ded5f85d581bbc21f3a886dc56a5ae83de4e94`.
- Donor: `jm-sky/seedvale-v3`, local HEAD `907e17cd2ad487547a25a1f928b2770348183d75`; clean when inspected. No fetch/pull or claim about latest remote main.
- Recon donor pin: `94c464739d46afb982949fd6ed96b0d74d265b10`. HEAD advanced, but `src/game/data/items/{types,weapons,armor,catalog}.ts` are byte-identical to that pin and the inspected working tree. No equipment baseline drift.
- Resolved counts: melee **30**, ranged **8**, armor **39**, shields **3**, ammunition **7**, total **87**. Defaults are checked via resolved constructor exports, not text ID counts. Resolved keys: **41**.
- Initial target status/diff (including staged/untracked files) was clean. Current [Inventory handoff](./2026-10-27--inventory-hybrid-implementation-handoff.md) and its linked contract/prompt were read; current tracked implementation remains authoritative. A checksum snapshot of every initially tracked file confirmed byte-for-byte preservation, including Inventory UI, views, wiring and item/runtime definitions. The separately appearing untracked `docs/plans/ui-input-045-equipment-body-layout.md` belongs to concurrent work and was left untouched.

`types.ts` and `provenance.ts` have no imports. `compatibilityTypes.ts` imports only types: the local definition union and existing V1 `ItemKind`. Emitted production modules have no runtime imports; only provenance freezes literal metadata. No startup path imports this module. Inventory, Three.js, Vue, combat, economy, persistence and world simulation are never initialized. V1 retains all runtime ownership; no ItemKind, ITEM_DEFS, ITEM_CATALOG, acquisition or save change occurred.

## Verification

Passed:

```sh
pnpm exec vitest run src/items/v3Equipment/contracts.test.ts src/items/Inventory.test.ts src/items/equipment.test.ts src/items/itemCatalog.test.ts
pnpm exec tsc --noEmit --strict --skipLibCheck --target ES2022 --module ESNext --moduleResolution bundler --verbatimModuleSyntax --allowImportingTsExtensions src/items/v3Equipment/contracts.test.ts scripts/items/verify-v3-equipment-source.ts
pnpm exec eslint src/items/v3Equipment scripts/items/verify-v3-equipment-source.ts
node --import tsx scripts/items/verify-v3-equipment-source.ts /home/madeyskij/projects/private/seedvale
```

Results: **4 suites / 113 tests passed**, including **8 Stage 1 tests**; focused TypeScript and ESLint clean. The donor audit checked **26 type/domain equalities** (normalizing only readonly structure), exact equipment-union equality, assignability of all five actual exports, approved counts, 41 resolved keys and source identity at both pins. It copies no records into V1 and imports no donor runtime into application code. The audit's Git subprocess required a sandbox escalation; the check then passed.

`pnpm type-check` was also executed: **fails on five pre-existing TS2345 Object3D/Group mismatches** in `src/tools/assetBrowser/viewer/mountCompareGarments.test.ts` (44, 77, 99, 100, 115). No Stage 1 diagnostics. That file is checksum-identical to the initial tree; the Inventory handoff already records this unrelated limitation. No browser, GPU, world benchmark or build was needed for this isolated stage.

The context preflight could not resolve the research recon as a plan (`Plan not found`); required documents and targeted source boundaries were read directly. The `tsx` CLI initially hit sandbox IPC restrictions; `node --import tsx` avoided that CLI dependency. Final review included new-file diffs, whitespace checks, no external runtime importers and tracked-file checksum preservation.

## Stage 2 readiness and unresolved decisions

The source contract can accept all five donor exports without redesign. A separately authorized Stage 2 can preserve the **87 resolved immutable records**, keyed by their source IDs and this provenance, without registering them in V1. Revalidate revision/path drift first; recursively compare every value and optional property presence, constructor defaults, legacy namespaces, canonical uniqueness and counts. Freeze copied nested data and extend the isolation test's Stage 1 file allowlist for the actual catalogue module. The current audit establishes type/count/source parity, not a recursive value comparison against a copied catalogue (none exists).

No equipment-contract deviation from the recon. Stage 1 intentionally cannot represent approved activation; any future activation authority needs a separate explicit runtime contract. Arrow/Marlow/Fenmoor identity conflicts, absent historical obsidian knife, slot/layer semantics, quality/wear, balance/units and acquisition remain decisions owned by the existing research. They do not block inert Stage 2 preservation and are not settled here. Stage 2/3 were not implemented, approved or scheduled.

# Implementation Notes: Flora functional candidate pools

**Reviewed:** 2026-09-21  
**Plan:** `world-terrain-049-flora-functional-candidate-pools.md`  
**Status:** `implementation notes`  
**Source of truth:** current code on `main`.

## Current code reality

- All forage placement lives in `src/terrain/chunkItems.ts::computeChunkItems()`. Shell/stone, flora and coins are already independent streams (separate salts + id prefixes). Copy that pattern; do not invent a parallel generator.
- Flora loop today: salt `0x5b2e1`, ids `cx:cz:f{i}`, `FLORA_CANDIDATES_PER_CHUNK = 6`, `FLORA_KEEP_SCALE = 0.5`, one weighted roll over 12 kinds.
- Medicinal weights and ecology formulas already exist in that loop — move them into the medicinal pool unchanged unless a statistical test forces a tiny keep-scale tweak.
- Renewable overlay: `src/terrain/renewableWorldItems.ts` — do not touch respawn table or depletion API.
- Off-screen / Herbalist path: `proceduralChunkItems()` → same `computeChunkItems`. New prefixes automatically participate.
- Cached tiles include `items`: bump `CHUNK_TILE_CACHE_VERSION` in `src/terrain/chunkTileWorldgenCache.ts` (currently `4`). Add a `v5:` changelog line for this plan.

## Ownership

Keep everything inside `chunkItems.ts` plus the cache version bump and tests. No new module unless a shared helper for “sample position + water/slope reject” becomes clearly duplicated four times and hurts readability — prefer a small local helper in the same file over a new abstraction.

## Concrete pool contract

| Pool | Candidates | Keep scale starting point | Salt | Id |
|------|------------|---------------------------|------|----|
| Forest-floor | 5 | ~0.5 (legacy) | `0x5b2e1` | `f{i}` |
| Medicinal | 3 | ~0.45–0.55 | new, e.g. `0x7a41c` | `h{i}` |
| Open flora | 2 | ~0.5 | new, e.g. `0x3e9b2` | `o{i}` |
| Rare/heavy | 1 | keep chance only when `beamWeight > 0` | new, e.g. `0x1d80f` | `w{i}` |

Salts must not collide with existing `0x17e51` / `0x5b2e1` / `0x9c31a`.

Forest-floor kind roll: mushroom, branch, cone, berries, nuts only (same weight formulas as today, minus removed kinds).

Medicinal kind roll: mint, yarrow, herb, poisonous_herb only.

Open flora: flower, flax.

Rare: if near tree and pass keep, emit `beam`; otherwise skip. Do not give beam open-ground weight.

## ID / save pitfalls

Narrowing `fN` remaps kind for a given `fN` index. Do not add SaveData migration. Document acceptance in the plan.

`isWorldItemPlacementAvailable`: renewable overrides only apply when `placement.kind` is renewable — stale mint overrides on an `fN` that is now mushroom are harmless no-ops. The painful case is `collectedItemIds` permanently hiding a remapped slot; accepted with cache bump.

Do not reuse `fN` indices for medicinal after extraction — medicinal must be `hN`.

## Economy calibration

Before tuning keep scales, optionally record a quick deterministic baseline count of mint/yarrow/herb over the same sample the tests will use (e.g. 120 moist forest chunks). After the split:

- mint should remain ≫ herb,
- moist sample should show mint more often than the pre-split shared-pool competition implied (dedicated slots),
- hard cap: medicinal pool never emits more than its candidate budget per chunk (3).

Prefer adjusting medicinal `KEEP_SCALE` over raising candidate counts if density runs hot.

## Tests

Extend `src/terrain/chunkItems.test.ts`:

1. medicinal placements match `h\\d+`,
2. flower/flax match `o\\d+`,
3. beam matches `w\\d+` and only near trees,
4. forest-floor kinds still use `f\\d+`,
5. existing mint ≫ herb statistical test still passes (ids now `hN`),
6. determinism unchanged for fixed seed/chunk,
7. optional: over a dry open sample, yarrow appears; over moist open, mint appears without requiring forest-floor kinds to lose slots.

Leave `renewableWorldItems.test.ts` alone unless a prefix assumption breaks (it uses synthetic `f1` ids only as overlay keys).

## Implementation order

1. Bump `CHUNK_TILE_CACHE_VERSION` to 5 with changelog comment.
2. Refactor flora loop into four pool loops (extract shared water/slope sampling helper if it reduces duplication).
3. Update JSDoc on `computeChunkItems` to list pools/prefixes.
4. Update tests.
5. Run focused chunkItems tests + `tsc --noEmit`.

## Relation to world-terrain-042

042 notes previously said “leave `fN` intact; add `mN` for patches.” After this plan lands, amend 042:

- `Depends on: world-terrain-049`,
- scattered medicinal = `hN`,
- patch stream remains a separate `mN` with own salt,
- do not re-merge medicinal into forest-floor.

Do not implement meadow suitability/lookup in this plan.

## Model

Primary: Composer (localized refactor in one known file + tests). Fallback: Sonnet.

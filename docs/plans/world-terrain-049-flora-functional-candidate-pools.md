# Plan: Flora functional candidate pools

**Created:** 2026-09-21
**Status:** `done` ✅
**Type:** feature
**Priority:** medium · **Effort:** S
**Depends on:** none
**Domain:** `world-terrain`
**Subdomains:** `vegetation` `terrain` `resources`
**Tags:** `flora` `herbs` `chunk-items` `world-generation` `forage`
**Roadmap:** -
**Model:** Composer, Sonnet
**Implemented at:** 2026-09-21

## Goal

Stop semantically different world forage kinds from competing for the same sparse candidate slots in `computeChunkItems()`.

Today one flora pool (`FLORA_CANDIDATES_PER_CHUNK = 6`, shared weighted roll) covers forest-floor finds, medicinal herbs, open flora and rare deadwood. That makes e.g. mint hard to notice on suitable moist ground because branch/nuts/berries can claim the same slots.

Split into small, independent, deterministic functional pools with bounded budgets — without a carpet spawn and without a large global supply buff.

## Current baseline

`src/terrain/chunkItems.ts::computeChunkItems()` already owns three independent streams:

```text
shell/stone  → cx:cz:{i}   salt 0x17e51
flora        → cx:cz:f{i}  salt 0x5b2e1   (12 kinds, 6 candidates)
coins        → cx:cz:c{i}  salt 0x9c31a
```

Medicinal biome weights already encode the intended ecology (mint moist low/med, yarrow open meadow, rare herb forest/shade/moisture, poisonous swamp/shade). Renewable lifecycle for `mint` / `yarrow` / `herb` lives in `renewableWorldItems.ts` and must stay unchanged.

Herbalist gathering already consumes ordinary `ItemPlacement` records via `herbalGathering.ts` → `ChunkManager.findNearestWorldItem(s)`.

## Scope

### 1. Functional pools inside `computeChunkItems`

Extend the existing independent-pool pattern. Do not add a manager, registry or second placement pipeline.

| Pool | Id prefix | Budget | Kinds |
|------|-----------|--------|-------|
| Forest-floor | `fN` (legacy salt `0x5b2e1`) | 5 | mushroom, branch, cone, berries, nuts |
| Medicinal | `hN` (new salt) | 3 | mint, yarrow, herb, poisonous_herb |
| Open flora | `oN` (new salt) | 2 | flower, flax |
| Rare/heavy | `wN` (new salt) | 1 | beam (near-tree only) |

Reuse the same physical gates (water, slope) and the same biome / tree-proximity inputs. Each pool has its own RNG stream, keep scale and kind roll.

### 2. Identity and cache

- New pools use new id prefixes so they never collide with existing `fN` / `cN` / numeric shell-stone ids in `collectedItemIds` / renewable overrides.
- Narrowing the legacy `fN` kind set remaps kind↔`fN` for existing saves — accepted for in-dev worldgen (same class of change as historical flora kind additions).
- Bump `CHUNK_TILE_CACHE_VERSION` in `chunkTileWorldgenCache.ts` so old cached tiles miss cleanly.
- No SaveData migration, no meadow/patch registry.

### 3. Economy / density

Goal is category isolation and terrain readability, not carpet density.

- Dedicated medicinal slots so mint/yarrow do not compete with forest-floor forage.
- Per-pool keep scales keep total placements bounded.
- On suitable moist/open terrain, medicinal finds should be noticeably more discoverable than today; global medicinal supply must not explode.
- `herb` remains materially rarer than mint/yarrow inside the medicinal pool.
- Preserve scattered single finds (no requirement that every herb live in a patch — patches are `world-terrain-042`).

### 4. Ecology preserved

Keep (and only tune within pools if tests require):

- mint — moist low/medium, open bias vs dense canopy,
- yarrow — open meadow (anti-desert/swamp/ridge),
- herb — rarer forest-edge / shade / moisture,
- poisonous_herb — swamp / shady floor,
- beam — near-tree only.

### 5. Follow-up contract for `world-terrain-042`

```text
scattered medicinal = hN pool (this plan)
+
herb-rich patches = bounded mN stream when suitability qualifies (042)
+
global medicinal budget compensation in 042
```

042 must not re-split base pools. It builds hotspots on top of this foundation.

## Non-goals

- medicinal meadow suitability / lookup / `mN` patches (`world-terrain-042`),
- new 3D models,
- quest-specific spawns,
- SaveData for placement identity,
- changing renewable respawn days,
- Herbalist planner/AI changes,
- crafting/economy rebalance beyond placement density,
- blindly raising a single shared `FLORA_CANDIDATES_PER_CHUNK`.

## Implementation guidance

Prefer extending `chunkItems.ts` only. Add JSDoc on the pool constants/helpers where useful for preflight (`@domain world-terrain`).

Bump chunk-tile cache version with a one-line changelog comment.

Do not run browser verification; the user owns that.

## Verification

Automated:

- determinism of placements for fixed seed/chunk,
- medicinal ids use `hN`, open flora `oN`, beam `wN`, forest-floor remains `fN`,
- mint ≫ herb under moist forest conditions,
- beam only near trees,
- representative sample: medicinal density on suitable terrain improves without unbounded per-chunk counts,
- `npx tsc --noEmit`, focused `chunkItems` tests.

Manual (user):

1. moist clearings show mint more often during normal exploration,
2. forest floor still has mushrooms/branches/berries without herb carpet,
3. collection/respawn for mint/yarrow/herb unchanged,
4. no obvious chunk-gen cost spike.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

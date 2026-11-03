# Q96 — "Water world" around the home settlement (kick-off for a fresh session)

**Created:** 2026-11-03 (Sonnet session handoff) · **Seed:** `415424794` · **Model:** O (cross-system: hydrology 058 + vegetation/props + roads). **Author feedback (dev server, screenshots `_temp/screenshots/water-world (1).png`, `(2).png`):**

1. There are still far too many lakes around the home settlement; **they were not there before** (before Q77/Q78 the small basins were invisible).
2. Trees stand on the beach close to the sea; a hay stack (stóg siana) ended up almost in the water.
3. Probably too few roads because of all the water around (roads cannot cross it).

## What I (previous session) already know

- Lakes come from `src/terrain/worldHydrology.ts` (058 H1): `lakeMinCells: 80`, `lakeMinDepthM: 0.3` → ~264 lakes per seed (median 0.9 ha). Visible since L2 (Q78, `createChunkWater` per-level planes). Measured with `pnpm exec tsx scripts/perf/census-rivers.ts --model=global --seeds=415424794,42` (temporary values, reverted):

| `lakeMinCells` | lakes (seed 415424794) | median | filled pits (% land) |
| --- | --- | --- | --- |
| 80 (now) | 264 | 0.9 ha | 3.6 |
| 300 | 45 | 3.7 ha | 8.3 |
| 600 | 20 | 6.4 ha | 10 |

  Filled pits = flattened terrain bowls; more of them as lakes shrink. The author said 300 is *still too many* around home → probably needs 600+ and/or a depth threshold, or a rule keeping lakes away from the home area. §3 has an OPEN entry "Q73 water world" (options a–d); the author has not chosen yet — **ask with the screenshot evidence, recommend ≥ 600 plus measuring `lakeMinDepthM` 0.6**.
- Trees on the beach / hay stack near water: the L1 wet rule (`waterSurface.ts`, `WET_EPS`, land view `sampleLandHeight`) covers lakes; **sea-shore margins stay relative to sea level** (notes L1 audit (b)) — check `chunkVegetation` (riparian eps 0.25 m), tree/prop placement margin on beaches, and the hay stack (settlement/farm prop; find it in `src/settlement/props.ts` / field dressing) — likely a prop position that is checked at the centre only, like the Q94 object-disc problem (fixed in `defe54dc` for plan discs, **not** for runtime props → Q95 census is the right place).
- Roads: check connectivity census (`pnpm worldgen:roads:census` or the Q44 census scripts, see Q44 plan §5) on seed 415424794 after lakes are reduced; Q84-a (river-enclosed road-less settlement) is related.

## Suggested order

1. Reproduce: `?seed=415424794`, home settlement (≈ (60, −5)); count lake bodies within 300 m / 600 m of home (script over `computeWorldHydrology` lakes, not eyeballing).
2. Ask the author the lake-size question (Polish, short, with numbers) — or propose a measured candidate (e.g. `lakeMinCells` 600 + `lakeMinDepthM` 0.6) and show counts within 600 m of home.
3. Apply the lake change (hydrology cache namespace + fingerprint bump; epoch 1 stays — Q80 re-exports fixtures afterwards). Re-take `census-rivers --model=global`, settlement + access census (`pnpm worldgen:access:census`), road census.
4. Beach trees + hay stack: find the placement code, apply a shore margin (land view + sea margin), census, tests.
5. Roads: report counts before/after; do not redesign routing here (Q61+).
6. Update queue (§1 row Q96, §2 browser check entry, §3), commit + push.

## Done when

Home area on seed 415424794 no longer looks like a swamp (author judgement → §2), lake count near home agreed with the author, no tree/prop within the shore margin in the census, road connectivity not worse (ideally better).

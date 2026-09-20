# Implementation Notes: world-036 — Lightweight unloaded shipwreck and tower lookup

## Ownership and reuse

Keep placement ownership in `src/terrain/chunkEnvironment.ts`, next to `resolveClassicLandmarkPlacement()`. Extract only the shared pure placement logic needed by `tower` and `shipwreck`; do not add a registry/manager or move unrelated `boat` / `oldTree` / `wagon` logic.

Normal streamed generation and unloaded lookup must call the same resolver(s). Keep the current placement-array order in `computeChunkEnvironment()`: tower before old tree, shipwreck after old tree.

Relevant files:

- `src/terrain/chunkEnvironment.ts` — current authoritative tower/shipwreck RNG, gates and placement fields.
- `src/terrain/chunkHeightmap.ts` — `computeChunkTexel()` + `createLocalTerrainSampler()`.
- `src/terrain/unloadedLandmarkLookup.ts` — lightweight/full routing and `isLightweightUnloadedLandmark()`.
- `src/terrain/chunkManager.ts` — loaded-vs-unloaded lookup and perf labels; no structural change needed.
- `src/terrain/worldKnowledgeScan.ts` — worker consumer of the lightweight-kind predicate; requires matching corridor gather.
- Tests: `chunkEnvironment.test.ts`, `chunkHeightmap.test.ts`, `chunkManager.test.ts`, `worldKnowledgeScan.test.ts`.

## Exact placement inputs to preserve

### Tower

Current RNG stream:

- chunk salt `9`, xor salt `0x82b59`;
- chance `0.006`;
- margin `4`;
- candidate `x/z` are the first two RNG calls.

Terrain/data inputs:

- height;
- continentalness;
- mountain ridge;
- road tint;
- `params.roadSegments`;
- `params.clearings` and `params.regional`.

Acceptance is the current coastal-or-mountain rule, then water/road gates, five-point footprint slope check (`TOWER_FOOTPRINT_RADIUS = 3.2`, max slope `0.6`), road-footprint clearance, village-clearance rejection and finally the chance roll.

On success preserve the current RNG order: scale → rotation → variant. Variant still depends on whether the accepted candidate was coastal.

### Shipwreck

Current RNG stream:

- chunk salt `11`, xor salt `0xa4e17`;
- chance `0.003`;
- margin `6`;
- candidate `x/z` are the first two RNG calls.

Terrain/data inputs:

- height;
- continentalness;
- road tint;
- `params.roadSegments`;
- `params.clearings` and `params.regional`.

The footprint probe is center + four cardinal samples at `SHIPWRECK_FOOTPRINT_RADIUS * 0.55`. Preserve the existing coastal-band, shallow-water/shore-hit counts and per-sample slope rejection exactly. Rotation uses the continentalness gradient sampled at ±2.5 world units through the existing `shoreYawAt` semantics.

On success preserve scale → rotation-jitter → variant RNG order.

Neither kind depends on vegetation, biome/moisture, previous environment placements or persistence.

## Lightweight terrain view

`ChunkTexel` already contains `continentalness`. The smallest required extension is therefore:

- add `continentalnessAt` to `LocalTerrainSampler`;
- implement it through the existing lazy `computeChunkTexel()` cache + apron bilinear interpolation.

Do **not** use raw `sampleContinentalnessAt()` inside the resolver: full generation reads the apron grid through bilinear sampling, so raw analytic sampling would create a parity seam.

Do not extend `createWorldTerrainSampler()`. The existing `heightAt`, `roadTintAt`, `mountainRidgeAt` plus new `continentalnessAt` are sufficient.

The road-footprint, village-clearance, coastal-band, slope-footprint and shore-yaw helpers currently live as closures inside `computeChunkEnvironment()`. Lift only the helpers required by tower/shipwreck to module-level pure helpers (or encapsulate them inside the shared resolver). Avoid refactoring the other landmark families as part of this plan.

## Unloaded lookup and worker coupling

After the resolvers are shared, route `tower` and `shipwreck` through `resolveUnloadedLandmark()` + `createLocalTerrainSampler()` and include them in `isLightweightUnloadedLandmark()`.

Important: that predicate is also the allow-list used by `WorldKnowledgeResearch`. Once these two kinds become lightweight, `src/terrain/worldKnowledgeScan.ts` will start scanning them.

Current `worldKnowledgeGatherFor()` reconstructs corridors only for cemetery/classic landmarks:

```ts
includeCorridors: includeCemetery || lightweight.some(isClassicLandmarkKind)
```

That is insufficient for tower/shipwreck because both read `roadSegments`, `clearings` and `regional`. Update this decision so either kind requests per-chunk corridors while still leaving `includeCemetery = false`. Do not add settlement/corridor gathering on the main thread; `chunkParamsForWorldKnowledgeScan()` already reconstructs the required inputs inside the worker.

Keep the existing unloaded river contract: `ChunkManager.findLandmarkNear()` uses `paramsFor(coord, [])`, and worker reconstruction also leaves `riverSegments` empty. Do not pull hydrology into this plan.

## Tests that matter

- `chunkEnvironment.test.ts`: resolver vs `computeChunkEnvironment()` parity for real tower and shipwreck hits and misses; compare full placement (`id/x/z/scale/rotationY/variant`). Cover the coastal/footprint rejection path, not only a successful seed.
- `chunkHeightmap.test.ts`: extend local-sampler parity to `continentalnessAt`.
- `chunkManager.test.ts`: tower + shipwreck must not call `computeChunkTile()`. The existing test that uses `tower` as the “remaining full-generation kind” must switch to a genuinely remaining kind such as `boat` or `oldTree`.
- `worldKnowledgeScan.test.ts`: assert tower/shipwreck request corridors without cemetery data, and add worker-vs-`resolveUnloadedLandmark()` parity for at least one representative hit. This catches the otherwise easy-to-miss `worldKnowledgeGatherFor()` discrepancy.
- Existing loaded lookup and `ringChunkOffsets()` tests stay unchanged.

Because shipwreck is rare and coast-constrained, search deterministic seed/chunk ranges in tests rather than relying on chunk `0,0` to produce a hit. Keep the scan bounded and assert that a hit was actually found.

## Suggested implementation order

1. Extend `LocalTerrainSampler` with continentalness and prove full-tile parity.
2. Extract tower/shipwreck resolver(s), switch `computeChunkEnvironment()` onto them and prove exact output parity.
3. Wire unloaded lookup and lightweight classification.
4. Update `worldKnowledgeGatherFor()` and its worker tests.
5. Update the landmarks paragraph in `docs/state/terrain-and-world-generation.md`, then run targeted tests/typecheck/lint/build.

No worldgen cache version bump is needed if the shared extraction is bit-identical and placement rules do not change.

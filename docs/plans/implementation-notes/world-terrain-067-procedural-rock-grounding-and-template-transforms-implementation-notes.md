# Implementation notes: Procedural rock grounding and prepared-template transforms

Plan: [world-terrain-067](../world-terrain-067-procedural-rock-grounding-and-template-transforms.md).

## Evidence boundary

Recon baseline: `94d56096`, local `main`, remote `jm-sky/seedvale-v1`, 2026-11-06. Repository was unchanged by the investigation. These are code/geometry findings, not browser acceptance. Recheck current source before implementation. The original screenshot and camera pose were not attached; do not assign the distant bright gap to a mechanism without reproduction.

The Strategic Brief's identity/lifecycle and performance boundaries apply. `docs/STATE.md` routes terrain state to `docs/state/terrain-and-world-generation.md`; do not update current-state docs to describe this proposed behaviour as implemented.

## Ownership and integration points

| Owner | Relevant symbols and relationships |
| --- | --- |
| `src/terrain/chunkHeightmap.ts` | `computeChunkTexel` applies regional smoothing → corridor/clearing shaping → river shaping. `computeChunkTile` stores `heights` and true `floorHeights`; the former can be water-covered. `apronOriginWorld`, `apronGridWeights`, `sampleApronGridWeighted` own the regular apron lattice. |
| `src/terrain/chunkEnvironment.ts` | `computeChunkEnvironment` deterministically emits placements, including stable mineable resource IDs. Rocks accept rougher terrain than logs; slope rejection is not footprint fitting. Preserve RNG consumption, variant and acceptance rules. |
| `src/terrain/chunkMeshData.ts` | `computeChunkMeshData` samples `floorHeights` at core vertices. |
| `src/terrain/buildChunkGeometry.ts` | `buildRegularGeometry` uses `PlaneGeometry` rotated −π/2; its cell diagonal is between h10 and h01. `buildCutGeometry` handles cave cutouts separately. |
| `src/terrain/chunkManager.ts` | `attachChunkContent` creates tile-local bilinear samplers. `GLB_ENV_KINDS` includes `largeRock`, `rockCluster`, `fallenLog`; `rockOutcrop` follows procedural environment construction. `addRockOverride`/`refreshRockVisual` project mined rocks with procedural constructors, not the original GLB. |
| `src/render/instancedProps.ts` | `instanceWorldMatrix`, `flattenPropTemplate`, `buildInstancedProps`: shared primitive geometry/materials, one bucket per species/primitive, same logical instance index across primitives. |
| `src/terrain/vegetationRegionBatcher.ts` | `setChunkPlacements` copies contributions, `clearChunkPlacements` deletes them and rebuilds the region. `ChunkManager.unload` invokes cleanup. |
| `src/settlement/propUtils.ts` | `TerrainSampler`, `sampleLocalTerrain`, `applyTerrainTilt`, `rotateOffsetY`, `placeOnGround`, `clonePropWithYaw`. Sampling and orientation policy are deliberately separate. |
| `src/settlement/decorProps.ts` | `TerrainPlacementContext` already serves monoliths, stone circles, ruins and cemetery elements. `createRockOutcrop` currently has no terrain context; it merges separate shards before placement. |

## Prepared-transform defect

`src/assets/loadGltf.ts::prepareProp` and `preparePropFitMax` put centring/foot corrections in the template root's position after fitting scale. `instanceWorldMatrix` copies that root position, changes scale/yaw, then sets translation to placement + unchanged root offset. `clonePropWithYaw` followed by `placeOnGround` does the same.

For the common neutral prepared root, current composition is conceptually `T(world + offset) · R(yaw) · S(instance) · S(prepared)`. The centring translation must participate inside placement rotation/scale, conceptually `T(world) · R(yaw) · S(instance) · T(offset) · S(prepared)`. Preserve any existing non-neutral root transforms; do not assume every caller has an identity root quaternion.

The existing instancing test deliberately uses the clone path as its oracle. It proves parity, not correct centring/foot placement. Retain parity coverage and add independent geometric assertions.

Scope correction at the natural-template/placement boundary. A neutral placement wrapper around a prepared root or an equivalent composed matrix can express the correct order; inspect clone callers and flatten-root exclusion before selecting the smaller coherent implementation. Do not globally change foundation/fixture offsets. Keep prepared templates immutable once their flatten cache has been populated (`WeakMap` by root identity).

### Measured real assets

GLBs were decoded with Three's `GLTFLoader` and `MeshoptDecoder`; material/image references were removed in memory only for headless geometry measurement. Preparation used production-equivalent bbox fitting; the production `prepareProp`/`buildInstancedProps` functions were also exercised in a temporary diagnostic.

- `ROCK_CLUSTER_SPECS` height is 0.9 m. Prepared `rock_cluster_a.glb` bbox spans approximately 9.776 × 0.9 × 11.61 m.
- Its prepared root offset is approximately `(−0.939264, 0.123595, 3.173738)` m. At yaw π/3 and scale 1, transformed bbox centre X/Z is approximately `(−3.218, 0.773)` relative to the sampled anchor. This bbox is a diagnostic bound, not the exact stone support surface.
- `rock_c.glb`, target height 1 m, has prepared Y correction ≈0.107932 m; instance scale 0.6 leaves bbox minimum ≈0.043173 m above ground on a plane. Larger scales can instead bury its base.

Do not infer the intended cluster size from these measurements or silently replace height fitting with max-axis fitting.

## Triangle-grounding contract

For normalized cell coordinates `u`, `v`, with heights h00, h10, h01, h11, the regular mesh interpolates:

- `u + v <= 1`: `h00 + u*(h10-h00) + v*(h01-h00)`;
- otherwise: `h11 + (1-u)*(h01-h11) + (1-v)*(h10-h11)`.

Verify the formula against production geometry, including negative coordinates and cutout behaviour. Reuse apron indexing; keep `sampleApronGrid` bilinear for existing scalar-field/worldgen consumers. `createLocalTerrainSampler` explicitly promises parity with that bilinear contract, so changing it globally would break its meaning.

Production mesh/raycast diagnostic with a 1 m cell `[1,0;0,1]`: centre ray hit Y=0, bilinear Y=0.5. This is a synthetic discriminating case, not a measured mountain error distribution. On an affine plane there is no discrepancy. Magnitude depends on the cell's mixed height difference, not slope alone.

## Outcrop failure and implementation traps

`94d56096` introduced `src/terrain/rockOutcrops.ts` and `createRockOutcrop`. Outcrops are decorative, with no resource ID; `scale` means height in metres. The generator has centre dryness/road checks and summit eligibility, not a footprint slope-support check. Preserve descriptor/chunk seeded draws and half-open ownership.

`createRockOutcrop(6, 0.5)` makes four shards, each shifted laterally and locally tilted. With group yaw 1 rad on `terrainY = −0.5*x`, one shard's minimum vertex clearance is approximately +0.733126 m: the entire shard is above the plane. The full group still intersects terrain. The old test only checks the full group's bbox minimum below zero and therefore misses this case.

Resolve shard world offsets before merging, as existing landmark constructors do. Sampling one shard centre is the starting point, not proof of support across a curved footprint. Retain existing local shape rotations while applying any bounded terrain orientation. Avoid double yaw. Test burial/contact per component and preserve one merged mesh per outcrop.

## Cluster, mining and boundary pitfalls

- Inspect the actual GLB's connected components before prescribing a decomposition. Multiple disconnected stones may share a primitive; mesh-node count alone does not identify stones.
- `buildInstancedProps` currently gives one logical placement the same instance index across all primitive buckets. Reusable stone primitives/support transforms can preserve that property. Do not emit arbitrary duplicate-key placements: `removeByKey` finds only the first occurrence per bucket.
- Mining overrides use `createLargeRock`/`createRockCluster`, so fixing the GLB matrix alone does not establish grounding or visual continuity after mining. Resource/collider position remains owned by generated placement and resource state, never by transient mesh identity.
- Apron sampling clamps indices. A roughly 10–12 m cluster can require support probes beyond a one-cell apron. A clamped sample is not canonical terrain at the actual footprint point. Reuse shaped-terrain machinery, not raw analytical fallback, and avoid neighbour-residency-dependent placement.
- Pure visual reconstruction must not move generated X/Z or persisted identity. A broader cache/epoch change is needed only if the implementation actually changes the corresponding generated/persisted semantics.

## Missing-terrain investigation boundary

Mesh finalization precedes content finalization; unload removes both mesh and region contribution. No stale-contribution defect was found in this path. Regular geometry bounds are computed lazily by Three when needed; a production raycast probe yielded correct bounds after setting terrain heights. Do not claim a tall-terrain bounds regression without a failing reproduction.

`src/terrain/farTerrainFlag.ts` defaults the far ring off. `farTerrain.ts` reads `terrainResidency`, discards fragments above attached near meshes and uses a coarse far grid. Its canopy retention above resident chunks was disabled in `29fc832d`. `terrainVisualHorizon.ts` changes fog reach when the far ring is enabled. Existing code/comments and old screenshots are not proof of a current hole.

Compare near-mesh ray hits, far-mesh ray hits, residency, cutouts and fog in one recorded frame. The wide/displaced cluster may extend beyond its owning chunk even when cleanup is correct. Resolve the actual symptom in its owner before choosing a fix.

## Verification baseline and routing

Investigation ran these existing suites: `src/render/instancedProps.test.ts`, `src/terrain/vegetationRegionBatcher.test.ts`, `src/terrain/chunkMeshData.test.ts`, `src/terrain/farTerrain.test.ts`, `src/terrain/terrainVisualHorizon.test.ts`, `src/terrain/rockOutcrops.test.ts`, `src/settlement/rockOutcrop.test.ts`, `src/settlement/decorProps.test.ts`: **8 files / 63 tests passed**. No browser acceptance or full build was performed for the investigation.

Suggested implementation order: capture G0 in parallel with geometry-test preparation; fix and verify transform order; add triangle grounding with mesh-oracle tests; ground outcrop shards; measure and repair residual cluster/boulder footprint cases; verify mining/lifecycle and recorded browser scenes. Do not broaden testing repeatedly without a changed risk.

Use `pnpm claude:preflight world-terrain-067` before implementation. The plan's `Model: Opus, Sonnet` follows PLANNING's closed vocabulary: prefer Opus for combined component/boundary contracts, Sonnet for bounded slices. Sol can finalize the repair plan; Astra is conditional on a newly demonstrated cross-system authority change.

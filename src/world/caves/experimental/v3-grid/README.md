# V3 grid cave reference

Created: 2026-10-29. Status: inactive source reference, with no production caller.

Imported from sibling repository `seedvale-v3`, revision
`47733d6ba0fe96d4607be22c470c7331c76c2c5c` (source working tree was clean).
V3's source comments identify this as the V2-derived system. V2 provenance is
reported by those comments; this import was checked against V3, not V2.
V1 remains authoritative for cave identity, generation, persistence and runtime behavior.

## Files and dependencies (verified from source)

All original paths below are relative to the V3 repository root.

| Local file | Exact original path | Responsibility and dependencies |
| --- | --- | --- |
| `gen/caves.ts` | `src/game/world/gen/caves.ts` | Seeded mountain-slope placement, main routes, dead-end branches and geometry validation; uses local config, types, RNG, sampling and shape modules. |
| `caveShape.ts` | `src/game/world/caveShape.ts` | Descriptor-to-grid conversion, floor/ceiling sampling, entrance cutting/collar patch and patch cache; uses local config, types, noise and string hash. |
| `render/caveMesh.ts` | `src/game/render/caveMesh.ts` | Floor and shell triangulation, explicit walls/lintels, displacement, UVs, colors and normals; uses local shape module and existing `three`. Returns geometries, not scene objects. |
| `caveTypes.ts` | `src/game/world/types.ts` | Extracted `WorldWindow`, `CaveSize`, `GenCaveBranch`, `GenCave` and `Biome.Mountain = 8`. |
| `caveConfig.ts` | `src/game/config/world.ts` | Extracted `CAVE`, `SEA_LEVEL`, sandbox spacing/edge margin and continent cave count/spacing. |
| `grid.ts` | `src/game/world/grid.ts` | Extracted `idx`, `sampleGrid`, `nearestCell`; window-relative terrain/biome sampling. |
| `rng.ts` | `src/game/core/rng.ts` | Extracted Mulberry32 state/constructor/next/range/int, `hashInts`, `hashString`, and the three cave stream salts. |
| `noise.ts` | `src/game/core/noise.ts` | Extracted simplex `Noise2D` constructor/get/fbm and supporting constants; uses local RNG. |

## Copy adaptations

The three principal modules are complete copies with source headers and local
import paths. Shared modules were reduced to the declarations listed above;
unused RNG methods, noise ridge methods, biome ids, world fields, river types,
heap/cropping helpers, unrelated salts and configuration were omitted. Retained
function bodies and constants are unchanged. Original comments remain, including
references to V3 decisions and callers that are not part of this directory.
`CAVE` remains intact, including its currently unused `cell`, `stepM` and
`showM` fields, to preserve the original cave configuration boundary.

There are no imports of V1 production cave modules, exports added to production
barrels, configuration changes, new dependencies, adapters or runtime registration.
Three.js is the only external package dependency and already exists in V1.

## Representation comparison (verified from V1 and V3 source)

V3 stores a compact descriptor: entrance/yaw/`y0`, flat XZ-radius spine points,
and optional branches indexed into that spine. Floor elevation is derived from
arc length, capped descent and seeded noise; clearance is derived from radius and
cave size. It builds 1 m cells with closed/under-rock/sky flags, vertex floor and
ceiling arrays, and a separate cutting mask. Sky openings align to 2 m terrain
blocks with a collar. The mesh emits explicit wall columns, lintels and an
entrance patch, then applies visual bulges, a ceiling dome and normal smoothing.

V1's production `../../caveHeightfieldRepresentation.ts` instead derives two
continuous heightfields from `CaveTopology`, using a default 0.3 m sampling grid.
The sign of `ceilingY - floorY` defines the void; no authoritative inside mask is
stored. `../../caveHeightfieldMesh.ts` uses marching squares on that gap and
shares floor/ceiling rim vertices, forming the wall where the fields meet rather
than adding a separate boundary-wall pass. `../../../createCaves.ts` retains
production topology/heightfields for gameplay queries and presentation. Both
approaches are 2.5D XZ representations, not general stacked 3D cave volumes.
Some historical source comments describe earlier migration stages; the current
`createCaves.ts` call sites establish production heightfield use.

## Potential connection to dungeon topology (hypotheses, not implemented)

V1's `../../dungeonTopology.ts` already produces `CaveTopology` with centerlines,
node widths/heights, two junctions, side branches and stable semantic node ids.
Those centerlines and widths could provide shape input for a separate visual
experiment. This is only a candidate correspondence: V3 descriptors cannot
preserve V1's explicit centerline Y values, independent heights, semantic ids,
shelves, overhangs or pool intent. V3 branch routes start after their junction;
`caveSegments` pairs points within each route and does not insert a segment from
the junction to the first branch point. That behavior is preserved here.

V1 dungeon validation includes semantic reachability, footprint limits and pool
acceptance. V3 placement/validation is a separate mountain-slope recipe and is
not evidence that a V1 dungeon satisfies either system's contracts. No mapping
or change to identity, seeded streams, save data or queries has been made.

## Exclusions and limitations

- `src/game/world/caves-v1/` and `src/game/render/caves-v1/` were not imported:
  these are V1-derived implementations, outside this task's target.
- `caveField.ts`, terrain query/cutout code, navigation/collision, session indexes,
  chunk streaming, materials, textures, props and gameplay were not imported:
  none is a dependency of the retained generation/grid/mesh implementation.
  The caller must eventually supply terrain/window data and own geometries and
  their disposal; the imported mesh alone does not cut V1 terrain.
- V3 tests were not copied: the selected scope is reference source, and its
  wider fixture/world dependencies are not needed to read or type-check it.
- The existing algorithm assumes 1 m cells and 2 m blocks in several loops;
  changing `CAVE.cell`/`block` alone does not generalize the implementation.
- Placement targets mountain slopes, not authored mines, crypts or rectilinear
  complexes. Suitability for those visual styles remains unverified.
- Vertex displacement is presentation detail, not an authoritative collision
  surface. Grid sampling, mesh normals/winding and mouth seam behavior have not
  been validated against V1 terrain or movement.
- Independent room heights, stacked passages, arbitrary graph loops, coordinate
  conversion, terrain alignment, lighting/material ownership and preservation of
  V1 traversal/content semantics remain unresolved integration questions.

## Static verification

Both the baseline and post-import V1 `vue-tsc --noEmit` checks passed with zero
TypeScript errors. A focused `tsc --noEmit` check using V1's compiler options
and only this directory as input also passed. Source-body comparison confirmed
that the complete generation, shape and mesh modules match V3 after removing
the new header and normalizing import paths. A TypeScript-resolved import audit
found 12 internal edges, no inbound production references, no unresolved imports
and no relative imports escaping this directory. The existing asset-only Vite
globs do not include this directory. The change adds only files here; no
production files were modified. Whitespace checks passed. No performance
benchmarks, browser checks or gameplay verification were performed.

Suggested next experiment (subject to review): inspect an offline mesh from one
fixed V3 descriptor to assess whether its explicit wall profile is a useful
visual direction for artificial underground spaces.

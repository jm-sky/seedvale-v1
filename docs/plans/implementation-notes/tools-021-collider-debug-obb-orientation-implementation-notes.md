# Implementation notes — Debug OBB orientation

[Plan](../tools-021-collider-debug-obb-orientation.md) · Source reviewed at `c78db12c`.

## Coordinate frames and edit site

- In `src/world/collision.ts`, `toObbLocal` and `obbLocalToWorld` define the math frame. At collider yaw a, the world XZ basis of its local +X and +Z is (cos a, sin a) and (−sin a, cos a). Positive Three.js Y yaw sends +X toward −Z. Therefore the box quaternion in `src/debug/colliderInstancedVisual.ts:createColliderInstancedVisual().setInstances` needs angle **−collider.rotationY** about its existing +Y axis.
- `src/settlement/settlementPalisade.ts:fencePlacementColliders` already converts visual placement yaw with `0 - placement.rotationY`. `settlementPalisadeColliders` delegates to it. Existing tests use rotated placement geometry and check gates. Changing either producer or resolver to compensate would break physical fences.
- Apply the sign at the existing OBB quaternion assignment, after optional transform and before `Matrix4.compose`. Leave XZ centre, OBB Y = 0, full widths (2 × half-extents), height and cylinder Y = height/2 intact. Scratch objects live outside the loop. `colliderDebugView.ts` calls this renderer each active frame. Keep the two mesh counts, independent caps (1024 by default), dirty flags and disposal path.

## House Browser boundary

`src/house-browser/houseBrowserScene.ts:refreshColliders` reads `buildAssemblyCollidersWorld` after applying door state. `colliderPreview.ts:createColliderPreview` caches colliders, sets cap 256, inflates copies on collider/padding changes and toggles mesh visibility directly. Padding adds metres to each half-extent/radius and preserves centre/yaw. Keep sign conversion out of both callers.

`src/settlement/houseBuilder.ts:transformHouseCollidersToWorld` transforms centres using Three.js yaw but emits OBB angle `collider.rotationY + yaw`. At oblique root yaw these conventions can disagree with visible walls. Physics is the oracle for this overlay. A straight-on preview with cardinal wall orientations can hide the discrepancy. If visible mesh and physical probes disagree, record the assembly/yaw, door state and probe result separately. Do not compensate per house.

## Matrix regression without WebGL

Use a real Three.js `Scene`, `createColliderInstancedVisual`, `setInstances` and `obbMesh.getMatrixAt`. For a translated thin box, transform normalized geometry samples (x near ±0.5, z = 0 and vice versa) through the **actual instance matrix**. Check the translated origin, both scaled basis directions and inside/outside samples against `colliderContainsPoint`. Use small insets either side of the boundary and float tolerances for the Float32 instance matrix. The old sign must fail at ±π/4. At π/2 the rectangle footprint is unchanged by sign reversal, so containment alone cannot distinguish the directed bases. Read a circle matrix as a control. A second rebuild with fewer colliders should shrink counts.

`src/house-browser/colliderPreview.test.ts` currently exercises only `inflateCollider`. Add a preview-path case using a rotated OBB, nonzero padding and a frozen input. Read the named scene mesh `house-browser-collider-preview-obb`, check the padded footprint and verify input immutability. Keep the shared renderer regression separate so failures localize.

Run the new shared-renderer test plus `pnpm exec vitest run src/house-browser/colliderPreview.test.ts src/settlement/settlementPalisade.test.ts src/settlement/houseBuilder.test.ts src/world/collision.test.ts`.

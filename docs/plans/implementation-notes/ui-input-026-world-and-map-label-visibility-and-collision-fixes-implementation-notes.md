# Implementation notes: ui-input-026 world and map label visibility and collision fixes

## Exact ownership and seams

### Corpse world-label path

Use the existing shared label controller; do not add a corpse-specific label object.

Relevant symbols:

- `src/ui/labelDistance.ts`
  - `labelOpacityForDistance(distance, near?, far?)`
  - `barsVisibleForDistance(distance, near?)`
- `src/ui/agentStatusLabel.ts`
  - `AgentStatusLabelController`
  - `createAgentStatusLabelController()`
  - `updateAgentLabelDistanceState()`
  - controller-local `distanceState`
  - `settleAtZeroHp()`
- `src/fauna/AnimalAgent.ts`
  - `tickPresentation()`
  - dead branch in `update()`
  - `collapse()`
  - `harvestMeat()`
  - hydrate/revive paths that directly manipulate `labelController.el.style.display`

The defect is lifecycle-specific, not a distance-policy bug. Live fauna computes `distance = this.mesh.position.distanceTo(observerPos)` in `tickPresentation()` and passes it to `labelController.sync()`. The dead branch in `AnimalAgent.update()` advances corpse decay and possibly the death animation, then returns before `tickPresentation()`. `collapse()` only calls `settleAtZeroHp()`, which hides bars/zeros HP but leaves the last label opacity untouched.

### Recommended controller contract

Add one narrow controller method for distance-only refresh rather than calling `sync()` with fake bar/observation data.

Suggested shape:

`syncDistance(mesh, distance, shadowDistance, gazeFactor?, showBarsOverride?)`

or a corpse-specific wrapper only if it still delegates to `updateAgentLabelDistanceState()`. Prefer the generic distance-only name because the operation is already controller-owned and may be useful to any presentation state that intentionally skips full content sync.

Important details:

- The method must reuse the controller's existing private `distanceState`.
- It should delegate to `updateAgentLabelDistanceState()`; do not duplicate opacity quantization, shadow logic or 20/32 thresholds.
- Corpse callers should force bars hidden if needed, rather than allowing `barsVisibleForDistance()` to re-show them when returning close. `settleAtZeroHp()` currently writes `barsEl.style.display = 'none'`, but a later distance-only update with no override could re-enable bars because `updateAgentLabelDistanceState()` owns `barsVisible`.
- The corpse path does not need observation resolution, name rewriting, animation selection or bar percentage updates.
- Preserve the existing DOM write guards/quantized opacity behavior.

### Dead-branch integration

In `AnimalAgent.update()`, while `health.dead` is true and before the branch returns:

1. keep the current corpse lifecycle/death-animation work unchanged;
2. compute observer distance from the existing `observerPos` argument;
3. run only the new distance refresh;
4. keep bars hidden;
5. return as today.

Do not move `tickPresentation()` above the dead guard.

Harvested-remains behavior is already explicit: `harvestMeat()` sets `labelController.el.style.display = 'none'`, and hydrate of harvested remains does the same. Distance refresh must not make an element hidden by `display:none` visible. The controller method should only update opacity/bar state, not top-level display.

Revive/hydrate considerations:

- revive code sets `labelController.el.style.display = ''`; normal live `tickPresentation()` resumes afterwards, so no separate reset path should be necessary if the same controller state is retained;
- hydrated dead, unharvested animals call `settleAtZeroHp()` and then enter the same dead update branch, which should correct opacity on their first update;
- hydrated harvested remains stay display-none and should remain unaffected.

## Map mine/cave semantic overlap

### Existing truth

The mine and cave must remain distinct authoritative locations.

Relevant symbols:

- `src/world/caves/abandonedMineLandmark.ts`
  - `AbandonedMineLandmark { mineId, caveId, x, z, caveSource }`
  - existing-cave mine uses the selected cave's entrance coordinates;
  - guaranteed-site mine creates/binds a production cave and also shares that entrance.
- `src/world/createCaves.ts`
  - `Caves.abandonedMine(): AbandonedMineLandmark | null`
- `src/world/locations/worldLocationCatalog.ts`
  - `WorldLocationCatalog.abandonedMine()` currently returns only projected `WorldLocation`;
  - `caveLocationFromCaveId()` emits id `cave:<caveId>`;
  - `abandonedMineLocation()` emits the separate `mineId`;
  - both are included by landmark query paths.
- `src/world/map/mapData.ts`
  - `MapData.catalog` is already publicly exposed to the renderer;
  - `knownLocations()` projects knowledge entries without merging them.
- `src/ui-vue/lib/drawMap.ts`
  - `drawWorldMapFrame()` receives `MapKnownLocation[]` from `mapData.knownLocations(viewport)`;
  - marker/emoji/label rendering all happen in the same loop;
  - `findLocationAtCanvasPoint()` independently queries true locations and should stay untouched.

### Required read-only relationship seam

Do not identify the backing cave by equal coordinates.

The renderer currently cannot recover `caveId` from `WorldLocationCatalog.abandonedMine()` because that API intentionally projects the landmark down to `WorldLocation`. Add the smallest read-only semantic seam at the catalog/map boundary.

Preferred option:

- add a `WorldLocationCatalog` method such as
  `abandonedMineBinding(): { mineId: string, caveLocationId: string } | null`
  derived directly from `deps.getAbandonedMine?.()`;
- `caveLocationId` should be exactly `cave:${mine.caveId}`, so renderer code does not need to know cave-id formatting beyond consuming the returned stable map location id.

This is preferable to:
- exposing `Caves` to `drawMap.ts`;
- adding `caveId` to every `WorldLocation` / `MapKnownLocation`;
- coordinate matching;
- mutating `LocationKnowledge`.

Keep the existing `abandonedMine()` method for callers that need the projected location; the new seam is relationship metadata only.

## Map presentation resolution

Implement presentation filtering/layout in or beside `src/ui-vue/lib/drawMap.ts`, because authoritative map data and hit-testing should remain unchanged.

A useful small helper can take:

- visible `MapKnownLocation[]`,
- active target ids/slots,
- abandoned-mine binding,
- current `WorldMapView`,
- canvas dimensions,
- a text-measure function or `CanvasRenderingContext2D`.

It should return presentation entries with:
- original location reference/id,
- marker visibility,
- label text,
- label draw offset or hidden state,
- stable priority.

### Semantic suppression first

Before generic collision layout:

- if both `mineId` and its exact `caveLocationId` are in the visible known-location set, suppress the cave marker/label presentation at that shared anchor and retain the mine presentation;
- do not remove either entry from `LocationKnowledge` or `MapData`;
- do not suppress unrelated locations merely because their coordinates match;
- if only one of the pair is known/visible, draw that one normally.

Because the plan says the mine owns presentation at the backing entrance, suppressing the cave marker as well as its text is the cleanest result. The cave remains selectable/resolvable through systems using its id; map click hit-testing should continue to operate on authoritative locations. At an exactly shared point, current nearest-distance hit-testing has an unavoidable tie based on iteration order; do not redesign selection semantics unless tests reveal a regression caused by this presentation-only change.

### Generic label collision

Do not build a general layout engine.

Recommended bounded strategy:

1. Build deterministic label candidates for locations that still have a label after semantic suppression.
2. Compute priority once:
   - active navigation target first;
   - abandoned mine / semantic primary next;
   - confidence: `confirmed` > `discovered` > `estimated`;
   - stable `id.localeCompare` tie-break.
3. Sort by that priority.
4. For each candidate, try a fixed small list of label offsets around the true marker, e.g. current below-marker position first, then a few vertical/horizontal alternatives.
5. Use `ctx.measureText()` plus the known 12px font height/padding to build a screen-space rectangle.
6. Accept the first non-overlapping rectangle against already accepted higher-priority labels; if none fits, hide only the text.
7. Marker coordinates never move.

Keep the offset list constant and small so layout is deterministic and bounded. Visible known locations are already viewport-bounded and the full map is drawn only while open, so a simple accepted-rectangles scan is adequate; avoid introducing spatial indexing or persistent caches for this fix.

Important rendering order:

- set the map-label font before measuring;
- calculate layout before the marker/label draw loop or in a preparatory helper;
- preserve existing area-radius, confidence marker style, emoji, colors and target-slot colors;
- label shadow/background double-draw must use the same resolved offset;
- target color affects marker color, not collision geometry.

## Minimap

`src/ui-vue/lib/drawMinimap.ts` does not need the generic world-map label layout.

Current nearby POIs are marker-only. Text is drawn only for active navigation targets. Unless implementation/testing demonstrates the exact mine/cave pair can generate duplicate target labels in a supported multi-target scenario, keep minimap unchanged. Do not broaden scope pre-emptively.

## Tests and best seams

### Label controller / fauna

Prefer direct tests around the controller distance operation and a focused `AnimalAgent` death-path test if existing test setup already makes that cheap.

Assertions that matter:

- distance-only refresh uses the same opacity policy as live sync;
- corpse bars stay hidden after moving back inside 20 units;
- opacity reaches 0 beyond 32 and returns when observer comes back;
- top-level `display:none` from harvested remains is not changed.

Avoid tests that only duplicate `labelOpacityForDistance()`'s existing pure math.

### Map layout

Prefer extracting pure/small exported helpers from `drawMap.ts` only if that materially simplifies tests. Good unit-test inputs are arrays of `MapKnownLocation` plus a binding/target set and deterministic text metrics.

Test separately:

1. semantic pair resolution:
   - mine + exact backing `cave:<caveId>` -> mine presentation wins;
   - same coordinates but different cave id -> no semantic suppression;
   - only cave known -> cave visible;
   - only mine known -> mine visible.
2. collision placement:
   - stable output regardless of input order after deterministic sort;
   - active target gets first placement;
   - confidence ordering works after target priority;
   - lower-priority text hides if all fixed offsets collide.
3. existing `findLocationAtCanvasPoint()` tests should remain authoritative-coordinate based; do not make it consume label rectangles.

### Catalog relationship contract

If adding `abandonedMineBinding()`, add a small catalog test showing it returns the mine id plus exact prefixed cave location id and returns `null` when there is no landmark. No persistence or world-generation tests are needed for this presentation contract.

## Implementation order

1. Add the controller distance-only API and corpse dead-branch call; tests.
2. Add the catalog read-only mine↔cave relationship seam; test it.
3. Add semantic map presentation suppression using that seam.
4. Add deterministic fixed-offset collision handling and tests.
5. Run focused tests first, then normal typecheck/build/test commands required by `CLAUDE.md`.
6. Leave browser verification to the user.

## Pitfalls

- Do not call full `AgentStatusLabelController.sync()` from the corpse branch with dummy observation data.
- Do not let distance refresh re-show corpse bars.
- Do not introduce a corpse-specific fade threshold.
- Do not hide the backing cave globally in `WorldLocationCatalog`; other systems still need it.
- Do not deduplicate locations by coordinates.
- Do not mutate `MapKnownLocation.x/z` to solve text overlap.
- Do not make hit-testing depend on label offsets.
- Do not move this work into Vue reactive state; the existing canvas path is imperative by design.
- Do not run `pnpm docs:sync` manually; repository automation owns generated documentation updates.

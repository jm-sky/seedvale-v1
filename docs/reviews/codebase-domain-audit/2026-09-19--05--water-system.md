# Codebase domain audit 05 — Water system

**Reviewed:** 2026-09-20  
**Area:** Water system  
**Source of truth:** current `main` code  
**Master:** `tools-018-codebase-domain-and-flow-audit-master.md`  
**Result:** ⚠️ reviewed with unresolved high findings

## 1. Scope

Reviewed the implemented water system end-to-end:

- procedural ocean/lake/river generation and streamed water presentation;
- local physical-water sampling and water-body classification;
- shoreline interaction, quality and drinkability;
- player swimming/wading, NPC water use and fauna traversal/hydration;
- settlement wells, player-built wells, household water, settlement/player troughs;
- finite-water mutation, save/load and WorldBundle rebuild continuity;
- river/ford/bridge interaction with terrain;
- water mirror/reflection predicates and recurring query cost.

This review reports only correctness, architecture, lifecycle/persistence and performance findings. Missing features and subjective gameplay/visual differences are not findings.

## 2. Entry points and state owners

### Physical natural water

`src/terrain/waterSample.ts::sampleLocalWater` is the shared physical-water sample used by fauna traversal. It combines:

- the local river gameplay segment, including river `waterH` / `bedH` and ford floor override;
- otherwise the global flat `config.waterLevel` over the sampled terrain/floor.

Its result is physical geometry only: `present`, `waterSurfaceHeight`, `floorHeight`, `depth`. It does not own drinkability.

`ChunkManager.sampleLocalWater()` is the runtime adapter. For terrain/floor it delegates to `readField()`; for rivers it only uses the owning loaded chunk's retained `riverGameplaySegments`.

### Water-body identity and shoreline interaction

`src/terrain/waterBodyKind.ts` and `src/app/interactables.ts::resolveWaterBodyShore` form a separate classification path:

```text
flat-water shore probe
→ oceanMix => ocean/lake
else
→ ChunkManager.riverShoreDistance()
→ ChunkManager.riverShorePoint()
→ river
```

This path creates the synthetic `waterEdge` interaction candidate every frame.

### Quality / drinkability

`src/world/WaterSource.ts` owns the interaction-level contract:

- well → `safe`;
- lake → `unsafe`;
- ocean → `undrinkable`;
- river → production interaction resolves contextually through `RiverWaterQualityResolver`.

`src/world/riverWaterQualityResolver.ts` composes river hydrology and deterministic settlement proximity. Missing hydrology context fails closed to `unsafe`.

### Stored / finite water

There are three distinct authoritative stores, intentionally representing different things:

- `Household.water: WaterReserve` — household scalar reserve;
- `PlayerTroughRecord.waterLitres` — finite player-built trough storage;
- liquid-container item instances — carried water.

Player-built well records own construction/depth/protection state, not a finite water volume. Settlement wells are world sources, likewise not finite reservoirs.

### Presentation

- `ChunkManager` owns streamed lake/river meshes.
- `WorldOcean` owns the ocean projection and shared `WaterMirror`.
- `vegetationRegionBatcher` receives per-chunk reflection visibility and projects it to regional instanced groups.

Presentation is not the authoritative source for drinkability or finite water state.

## 3. Flows traced

### Natural physical water

```text
terrain/hydrology generation
→ chunk river chains / gameplay segments
→ ChunkManager.sampleLocalWater(x,z)
→ terrain/waterSample.sampleLocalWater(...)
→ river wins overlap, else flat waterLevel
→ fauna traversal / drowning / water movement
```

### Player shoreline drink/fill/fishing

```text
gameLoop every frame
→ buildInteractables()
→ resolveWaterBodyShore()
→ flat shore probe OR riverShoreDistance + riverShorePoint
→ resolve kind
→ riverWaterQuality.resolve(...) when river
→ WaterSource
→ waterEdge interaction
→ survival action / container fill / fishing route
```

### NPC household water

```text
need/strategy selection
→ household.water.has(...)
→ travel/action completion
→ household.water.remove(...)
→ relieveNeed(...)
```

Time-skip has a separate coarse branch in `NpcAgent.resolveTimeSkip()`.

### Fauna water

```text
thirst
→ stored trough / household trough candidates
→ natural-water candidate
→ shore probe / water-body kind
→ sampleLocalWater for traversal depth
→ consume finite trough OR drink natural water
```

### Finite trough

```text
PlayerTroughRecord.waterLitres
→ queryAvailableNear / isAvailable
→ consumeWater(id, litres)
→ boolean success + decrement + visual sync
→ SaveData.playerTroughs
→ restore / rebuild
```

### Reflection

```text
gameLoop
→ WorldOcean.renderMirror()
→ WaterMirror.render()
→ cadence / enabled / camera-height guards
→ shared 128² reflection render target

chunk distance / reflection budget
→ syncReflectionVisibility()
→ regional anyReflectionVisible()
→ reflection render layer
```

## 4. Findings

### F05-1 — high — player swimming uses the global water plane instead of canonical local physical water

**Affected flow:** river generation → physical water → player traversal/swimming.

**Files / symbols:**

- `src/player/PlayerController.ts::worldWaterOwnsVertical`
- `src/player/PlayerController.ts::updateVerticalMotion`
- `src/player/worldWaterEligibility.ts::swimFeetY`
- `src/terrain/chunkManager.ts::sampleLocalWater`
- `src/terrain/waterSample.ts::sampleLocalWater`

**Code evidence:**

`PlayerController` receives `sampleHeight`, `sampleFloor` and one scalar `waterLevel`. Its world-water check starts with:

```ts
if (ground.height > this.waterLevel) return false
```

and swimming places the player relative to:

```ts
swimFeetY(this.waterLevel, this.sampleFloor(x, z))
```

It does not receive or call `ChunkManager.sampleLocalWater()`.

By contrast, river physical water is represented with per-segment `waterH` and `bedH`, and `sampleLocalWater()` explicitly returns that local river surface before the flat-water fallback.

**Why wrong / fragile:**

A rendered/physical river can exist above the global ocean/lake plane while player swimming logic sees no world water there. Player and fauna therefore do not share the same physical-water authority. The result depends on actor type rather than world state.

This is not a request for more sophisticated swimming; it is a current source-of-truth disagreement.

**Affected consumers:** player traversal/swimming/wading; river/ford movement integration.

**Owner domain:** `world-terrain` with player consumer integration.

**Existing plan coverage:** none. `world-terrain-044` owns runtime ground/missing-ground semantics and explicitly defers `sampleLocalWater()` water semantics to the water audit.

**Recommended action:** new `world-terrain-045-canonical-local-water-player-traversal.md`. Make detailed player water ownership consume the same local physical-water sample as other detailed actors, while preserving cave/spatial-context arbitration.

---

### F05-2 — high — fauna natural-water eligibility can reject real rivers before the river classifier runs

**Affected flow:** fauna thirst → natural water target → river drinking.

**Files / symbols:**

- `src/fauna/animalForaging.ts::isDrinkableNaturalShorePoint`
- `src/fauna/animalNaturalWater.ts::createNaturalWaterKindAt`
- `src/terrain/waterBodyKind.ts::shoreProbeHits`
- `src/terrain/chunkManager.ts::riverShoreDistance`

**Code evidence:**

`createNaturalWaterKindAt()` can classify a river using `riverShoreDistance`.

However `isDrinkableNaturalShorePoint()` first requires:

```ts
shoreProbeHits(x, z, ctx.sampleHeight, ctx.waterLevel) !== 0
```

and returns `false` before asking `naturalWaterKindAt` if that flat-water probe has no hit.

`shoreProbeHits` only detects terrain at/below the global `waterLevel`; it does not use local river `waterH`.

**Why wrong / fragile:**

The river-aware classifier is unreachable for ordinary elevated river banks that do not also look like an ocean/lake shoreline under the global plane. Wild fauna can therefore fail to select a physically present river even though the same fauna traversal layer can sample that river correctly once a target exists.

**Affected consumers:** wild fauna hydration and domestic-animal natural-water fallback.

**Owner domain:** `world-terrain` query semantics, consumed by `fauna`.

**Existing plan coverage:** no focused current plan. `fauna-029` covers route preference/corpse time, not this eligibility gate.

**Recommended action:** cover in new `world-terrain-046-unified-water-shore-query-and-river-hotpath.md`; migrate fauna natural-water targeting to one water-body shore query instead of pre-gating river detection with the flat-water probe.

---

### F05-3 — medium — shoreline classification disagrees with the physical-water overlap rule

**Affected flow:** shoreline discovery → kind → drinkability/fishing prompt.

**Files / symbols:**

- `src/terrain/waterSample.ts::sampleLocalWater`
- `src/terrain/waterBodyKind.ts::resolveWaterBodyKind`
- `src/app/interactables.ts::resolveWaterBodyShore`

**Code evidence:**

Physical `sampleLocalWater()` checks river segments first, so river wins when river and flat-water domains overlap.

Interaction classification does the opposite: `resolveWaterBodyShore()` accepts the first flat-water shore probe and classifies it as ocean/lake; only when that probe fails does it query river distance/point.

**Why wrong / fragile:**

At river mouths or other overlap locations, two canonical-looking query paths can assign different water-body identities to the same local world state. That affects `WaterSource.quality`, warnings, ocean drink blocking and fishing interaction semantics.

**Affected consumers:** player water interaction, contextual river quality, fishing.

**Owner domain:** `world-terrain`.

**Existing plan coverage:** none focused.

**Recommended action:** include in `world-terrain-046`; define one precedence/shore result carrying the actual kind and point instead of independently composing flat and river probes.

---

### F05-4 — medium — per-frame water interaction repeats whole-loaded-chunk river scans

**Affected flow:** frame → interaction candidate discovery → river shore / quality.

**Files / symbols:**

- `src/app/gameLoop.ts` — per-frame `buildInteractables()`;
- `src/app/interactables.ts::resolveWaterBodyShore`;
- `src/terrain/chunkManager.ts::riverShoreDistance`;
- `src/terrain/chunkManager.ts::riverShorePoint`;
- `src/terrain/chunkManager.ts::riverWaterContext`;
- `src/world/riverWaterQualityResolver.ts::resolve`.

**Code evidence:**

When no flat shore is found, every frame `resolveWaterBodyShore()` calls `riverShoreDistance()`, which scans all loaded chunks.

If the player is near a river it then calls `riverShorePoint()`, performing another loaded-chunk scan.

For a river interaction, `RiverWaterQualityResolver.resolve()` calls `riverWaterContext()` before checking its cache key, causing a third loaded-chunk scan. The cache avoids repeated settlement classification, but not the hydrology scan needed to discover the key.

All three queries independently locate the nearest river data.

**Why wrong / fragile:**

This duplicates the same spatial search in a recurring frame path and scales with loaded chunk count. It also makes it harder to guarantee that distance, point and hydrology context describe the same selected segment.

The existing `world-017` implementation notes explicitly called out `buildInteractables()` as per-frame and required avoiding expensive repeated hydrology there.

**Affected consumers:** interaction candidate building; river quality.

**Owner domain:** `world-terrain`.

**Existing plan coverage:** completed `world-017` established the intended contract but is no longer an active implementation owner; `fauna-033` optimizes animal hot paths, not this player interaction path.

**Recommended action:** `world-terrain-046`: expose one bounded river/water-shore result containing distance/point/context or a stable key, then reuse it for classification and quality. Do not add a new global river index unless measurement proves retained chunk-local lookup cannot satisfy the bound.

---

### F05-5 — medium — missing owning chunk silently removes river state from `sampleLocalWater()`

**Affected flow:** local physical-water query → stream boundary / generating chunk → traversal.

**Files / symbols:**

- `src/terrain/chunkManager.ts::sampleLocalWater`
- `src/terrain/chunkManager.ts::readField`
- `src/terrain/waterSample.ts::sampleLocalWater`
- `docs/plans/archive/world-terrain-044-runtime-ground-query-authority-and-missing-chunk-fallbacks.md`

**Code evidence:**

For a missing owning chunk, `readField()` can return analytical height/floor fallback. But river data is assembled as:

```ts
const riverSegments = rec?.riverGameplaySegments ?? []
```

so the same query can use fallback terrain while unconditionally treating the river set as empty.

Lake/ocean presence may still be inferred from `waterLevel`; river presence cannot.

**Why wrong / fragile:**

The result is neither an explicit "water sample unavailable" nor a complete streaming-independent water sample. Residency can change the answer from river-present to no-river without an explicit unavailable state.

**Affected consumers:** fauna traversal and any future detailed consumer of `sampleLocalWater`; player after F05-1 is fixed.

**Owner domain:** `world-terrain`.

**Existing plan coverage:** `world-terrain-044` explicitly identifies this mixed water case but deliberately leaves it for a water follow-up; it does not implement the water policy itself.

**Recommended action:** include in `world-terrain-045`, aligned with `world-terrain-044`'s explicit resident-runtime query semantics. Detailed movement should never interpret missing river authority as proof of dry ground.

---

### F05-6 — high — NPC household-water relief can succeed after finite water disappeared

**Affected flow:** NPC need selection → finite household water → action completion.

**Files / symbols:**

- `src/ai/NpcAgent.ts::beginNeed`
- `src/settlement/household.ts::WaterReserve.remove`
- `src/ai/Needs.ts::relieveNeed`

**Code evidence:**

Strategy selection checks `household.water.has(...)`, but the later action completion calls a clamping `WaterReserve.remove()` returning `void`, then relieves thirst unconditionally.

Between selection and completion another NPC/animal can consume the reserve.

**Why wrong / fragile:**

Selection-time availability is advisory, but completion is treated as success even when the authoritative resource transaction can no longer be satisfied. This violates finite-water conservation.

**Affected consumers:** NPC household-water need satisfaction; all callers affected by the shared `WaterReserve.remove` contract when it is upgraded.

**Owner domain:** `npc` / household resource transaction.

**Existing plan coverage:** fully covered by planned high-priority `npc-059-need-action-result-revalidation-and-atomic-relief.md`, which explicitly changes `WaterReserve.remove` to expose success and audits animal/NPC water callers.

**Recommended action:** implement `npc-059`; do not create a water-specific duplicate plan.

---

### F05-7 — high — NPC time-skip has a parallel water mutation path with weaker conservation semantics

**Affected flow:** time-skip → NPC thirst/water duty → household reserve.

**Files / symbols:**

- `src/ai/NpcAgent.ts::resolveTimeSkip`
- `src/settlement/SettlementsManager.ts::resolveTimeSkip`
- `src/settlement/household.ts::WaterReserve`

**Code evidence:**

The current time-skip branch can remove household water then relieve thirst, and `waterDuty` directly adds household water without a physical/source transaction.

This was already confirmed by area 02 and revalidated here because it is part of the finite-water flow.

**Why wrong / fragile:**

Detailed simulation and time-skip do not conserve water through the same authoritative transaction semantics. Fidelity mode can determine whether water had a real source.

**Affected consumers:** NPC needs and household finite water during time-skip.

**Owner domain:** `npc` time-skip semantics.

**Existing plan coverage:** fully covered by `npc-058-time-skip-resource-and-interrupt-parity.md`.

**Recommended action:** implement `npc-058`; no duplicate plan.

---

### F05-8 — medium — water mirror still renders without a water-visibility/relevance predicate

**Affected flow:** frame rendering → water reflection pass.

**Files / symbols:**

- `src/app/gameLoop.ts`
- `src/world/createOcean.ts::WorldOcean.renderMirror`
- `src/world/waterMirror.ts::WaterMirror.render`

**Code evidence:**

`WaterMirror.render()` gates on enabled/disposed, cadence, camera side and camera type, but not whether reflective water contributes to the current camera view.

This was already confirmed in area 06. The current cadence function itself is not an always-true predicate.

**Why wrong / fragile:**

A full extra scene submit can occur when the reflection cannot contribute to the beauty frame.

**Affected consumers:** render performance only; no simulation authority.

**Owner domain:** `world-terrain` rendering.

**Existing plan coverage:** `world-terrain-015-water-reflection-content-budget.md` already owns this measurement-gated optimization.

**Recommended action:** keep it in `world-terrain-015`; no new mirror plan.

## 5. Architecture observations

### There is no single canonical "water query" for every meaning

That is partly correct: physical occupancy/depth and drinkability are different concepts and should not be collapsed.

The problematic split is narrower:

- physical detailed traversal should share one local-water authority;
- shoreline/body identity should share one classification result;
- quality should consume the selected body/context rather than rediscovering it.

A giant `WaterManager` would make ownership worse, not better.

### `WaterSource` quality defaults are currently safe in production call sites, but the API is a footgun

`createWaterSource('river')` has a context-free `safe` fallback for tests/general construction. Production shoreline interaction special-cases river and injects contextual quality, and no production misuse was found.

Therefore this is not a current finding. When `world-terrain-046` centralizes the selected river context, prefer making it harder for a production caller to accidentally resurrect blanket-safe river semantics.

### Well / trough authority is coherent

No duplicate authoritative state was found for player wells or player troughs:

- player-well records persist construction/depth/protection state and runtime visuals/colliders are projections;
- `PlayerTroughRecord.waterLitres` is the finite authority;
- `createPlayerTroughs.consumeWater()` revalidates and returns a boolean before decrementing;
- trough water visual state derives from the record after each mutation;
- save/load and WorldBundle rebuild carry the record values.

Household water also persists through `HouseholdSnapshot.water`; current save state writes `snapshotHouseholds()`, and in-session rebuild carries the same snapshot. The older "household water resets" defect was fixed by plan 197 and is not current.

### Unsafe is not the same as undrinkable

Current `WaterSource` semantics deliberately allow `unsafe` lake/contextual-river water while blocking `undrinkable` ocean water. A consumer allowing `unsafe` water is therefore not automatically a drinkability bug.

### Fords and bridges are distinct

The river physical sample applies ford floor projection while preserving river surface/depth. Bridge decks remain movement-surface projection, not "water removed under bridge". That ownership split is correct and should survive F05-1/F05-5.

### Mirror predicate class checked

The known failure class was checked directly.

`vegetationRegionBatcher.anyReflectionVisible()` uses `rec.chunkReflectionVisible.get(ck) ?? true`, but the fallback is fail-open only for a contributing chunk with no reported state. Explicit `false` values are respected, and all contributing chunks false produces false. The prior always-true shape is not present.

`WaterMirror.shouldRenderMirror()` also has no `|| true` / constant-result fallback.

## 6. Cross-domain dependencies / follow-ups

- `world-terrain-044` should define the compatible runtime-ground unavailable semantics used by `world-terrain-045`; do not solve missing terrain/water authority with separate fallback conventions.
- `npc-059` owns detailed finite household-water transaction success.
- `npc-058` owns time-skip water/resource parity.
- `world-terrain-015` owns reflection relevance/content budgeting.
- Fauna should consume the shared shore/local-water contracts from `world-terrain-045/046`; do not create a second fauna hydrology model.
- Area 08 navigation/movement should treat bridges/fords as consumers/projections around the water authority rather than redefining water presence.

## 7. Existing plans that already cover findings

- `world-terrain-044-runtime-ground-query-authority-and-missing-chunk-fallbacks.md` — adjacent prerequisite/contract for F05-5, but explicitly defers the water fix.
- `npc-059-need-action-result-revalidation-and-atomic-relief.md` — F05-6.
- `npc-058-time-skip-resource-and-interrupt-parity.md` — F05-7.
- `world-terrain-015-water-reflection-content-budget.md` — F05-8.
- completed `world-017-contextual-river-water-safety.md` — contextual quality foundation; F05-4 shows its selected-river lookup is still unnecessarily rediscovered in the per-frame interaction path.
- `fauna-033-animal-movement-query-hotpath-performance.md` — related fauna movement optimization, but not the shoreline interaction scans or river target gate found here.

## 8. New plans required

Created:

1. `docs/plans/archive/world-terrain-045-canonical-local-water-player-traversal.md`
   - F05-1;
   - F05-5;
   - shares runtime availability semantics with `world-terrain-044`.

2. `docs/plans/archive/world-terrain-046-unified-water-shore-query-and-river-hotpath.md`
   - F05-2;
   - F05-3;
   - F05-4.

No plans were created for F05-6/F05-7/F05-8 because existing plans already own them.

## 9. Verification limits

This was a static code/architecture review of current `main`.

Not performed:

- browser/gameplay verification;
- production-code changes;
- automated test execution;
- performance benchmark execution;
- `pnpm docs:sync`.

The findings are based on current control flow, state ownership and query composition. Performance magnitude for F05-4 still requires measurement after or during implementation, but the repeated per-frame full-loaded-chunk scans themselves are directly present in code.

## 10. Master status update

Area 05 should be marked:

**⚠️ reviewed with unresolved high/critical findings**

Follow-up owners:

- new `world-terrain-045`;
- new `world-terrain-046`;
- existing `npc-059`;
- existing `npc-058`;
- existing `world-terrain-015`;
- adjacent `world-terrain-044`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

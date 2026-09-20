# Codebase domain audit 08 — Navigation & movement surface

**Reviewed:** 2026-09-20  
**Area:** Navigation & movement surface  
**Source of truth:** current `main` code  
**Master:** `tools-018-codebase-domain-and-flow-audit-master.md`  
**Result:** ⚠️ reviewed with unresolved high findings

## 1. Scope

Reviewed implemented navigation/movement flows for correctness, architecture, lifecycle and performance:

- player, NPC, wild fauna and domestic-animal traversal;
- shared ground/slope/collider contracts;
- local A* route requests, arrival, stuck detection, recovery and target replacement;
- roads, declared fords and bridge decks;
- chunk residency/rebuild effects on movement queries;
- detailed ↔ off-screen/time-skip movement continuity;
- cave/surface seams requested during this review: player save/load in a cave and predator/prey/player perception across the cave roof.

Missing navigation features and subjective pathfinding quality are not findings.

## 2. Entry points and state owners

### Movement ground

`ChunkManager.sampleHeight` owns terrain-only runtime sampling. `sampleBridgeDeck` projects declared `RoadBridgeSpec`; `sampleSurfaceGround` returns bridge deck first, otherwise terrain.

Cave ground remains intentionally separate. Player arbitration is cave-first in `PlayerController.groundAt()`; NPC/fauna cave movement uses cave-scoped queries rather than pretending cave floor is terrain.

### Local navigation

`src/navigation/navigation.ts::findPath` is a shared, Three.js-free, bounded local A* used by `NpcAgent` and `AnimalAgent`. It owns route calculation only.

`NavigationQuery.isWalkable` is caller-owned authority. The navigation layer never rebuilds water/collider semantics itself. `sampleHeight` is reused for slope validation.

### Locomotion / collision

`terrain/slopeConstraint.ts::stepWithSlopeAndCollision` is shared by player-adjacent walking code, NPC and animal locomotion. It applies the common finite-difference slope rule and three-step full/X/Z movement fallback.

Static collision geometry remains owned by `ColliderRegistry`; actor walkability decides which colliders/water rules apply.

### Recovery

`ai/npcMovementWatchdog.ts` is shared by NPC/fauna recovery semantics. It escalates boundedly:

```text
low progress
→ repath
→ local escape
→ abandon
→ repeated abandon → emergency recovery
```

New destinations reset current strikes/stage. Route/path state is transient execution state, not persisted identity.

## 3. Flows traced

### Player

```text
input
→ PlayerController.update
→ cave-aware groundAt / surface sampleSurfaceGround
→ shared slope probe
→ collider/cave-horizontal resolution
→ vertical grounding/water rules
→ final transform
```

The player does not use the local A*. This is deliberate: direct input is the movement authority.

### NPC

```text
decision / schedule / action destination
→ startAction / committed target
→ steerWithRescue
→ direct steerTo
→ current slope + walkability
→ if genuinely stuck: findPath via current isWalkableExterior
→ transient waypoints
→ ordinary locomotion revalidates every step
→ final real-destination arrival
→ execute / choose
```

A repath never replaces the semantic destination. Repath waypoints cannot report arrival at the real action target.

### Fauna / domestic animals

Wild fauna, settlement livestock and detached/player-owned livestock use the same `AnimalAgent` locomotion mechanisms. Autonomous intent differs, but the physical movement path remains shared:

```text
behaviour target
→ steerToward
→ shared slope/collision step
→ AnimalAgent.isWalkable
→ local water classification + collider query
→ optional bounded navigation rescue
```

Mounted movement is still executed by the animal movement authority rather than a second player-only terrain system.

### Roads / fords / bridges

```text
road routing
→ canonical RoadRoute.crossings
→ ford OR bridge declaration
→ ford: terrain/river projection
→ bridge: deterministic RoadBridgeSpec
→ terrain road-shaping suppression under deck
→ ChunkManager bridge-aware movement surface
→ player/NPC/fauna consume the same deck geometry
```

Roads are terrain shaping, not a parallel walkability layer. A ford is a declared river crossing projected into terrain/water. A bridge deck is intentionally separate movement ground above continuous river terrain/water.

### Route invalidation / world changes

There is no persisted route epoch for bounded local paths. Current code does not require one for correctness: every waypoint is executed through live slope/walkability/collision checks. If terrain/collider state changes after a route was computed, the stale waypoint cannot force movement through the newly-invalid step; lack of progress feeds the existing watchdog and repath path.

### Off-screen / time skip

NPC long-distance travel persists semantic destination + last position + timing in `NpcAuthoritativeState.travel`; local A* waypoints/watchdog state remain transient.

Fauna time-skip deliberately advances life/age, not physical movement.

NPC time-skip is different: surface NPCs are directly placed at a derived schedule target, and off-screen travel reification directly materializes interpolated X/Z. That path exposes F08-01 below.

## 4. Findings

### F08-01 — high — NPC time-skip and travel reification can materialize on a surface live locomotion would reject

**Flow:** active/scheduled or committed travel → time skip/off-screen progress → reification/final placement → resumed detailed simulation.

**Files / symbols:**

- `src/ai/NpcAgent.ts::resolveTimeSkip`
- `NpcAgent.catchUpCommittedTravel`
- `NpcAgent.applyTimeSkipPlacement`
- `src/ai/npcMovementRecovery.ts::placeNpcAfterTimeSkip`
- `NpcAgent.isWalkableExterior`
- `terrain/slopeConstraint.ts::stepWithSlopeAndCollision`

**Code evidence:**

For a surface NPC, `placeNpcAfterTimeSkip()` returns the chosen schedule target X/Z and only samples height. It does not run the destination through collider/water/walkability validation.

Committed-travel catch-up similarly calls `reifyNpcTravel(...)` and sets the live mesh at the interpolated/terminal X/Z with sampled height only.

Live locomotion would instead pass each attempted step through slope plus actor walkability/collision rules.

**Why wrong / fragile:**

The coarse/off-screen path can cross the same authority boundary with weaker rules than detailed movement. A target/interpolated point that became occupied by a collider, invalid water surface or otherwise unwalkable can be accepted solely because it has a height.

This is not an argument for replaying pathfinding during time skip. The defect is final detailed materialization without the existing live-surface validity contract.

**Affected consumers:** all NPCs using schedule catch-up or generic committed travel, including expedition/accompany/transport consumers after reification.

**Owner domain:** `npc`.

**Existing plan coverage:** `npc-058` owns resource/interrupt parity but explicitly preserves current schedule-derived final placement. `settlements-npcs-028` owns travel continuity but does not validate the live reification surface. No existing plan owns this defect.

**Recommended action:** new `npc-061-time-skip-and-reification-surface-placement-validity.md`. Reuse existing surface walkability/collider semantics at the detailed-materialization boundary; do not execute local A* or every skipped movement step.

---

### F08-02 — high — player save/load inside a closed cave loses the vertical/spatial identity needed to restore the cave floor

**Flow:** player in cave → save → reload → player position restore → ground arbitration.

**Files / symbols:**

- `src/app/saveState.ts::buildSaveData`
- `src/persistence/saveData.ts::SavePlayer`
- `src/app/createApp.ts` initial-save player restore
- `src/player/PlayerController.ts::setPosition`
- `PlayerController.groundAt`
- `Caves.queryGround` / `Caves.spatialContextAt`

**Code evidence:**

`SavePlayer` persists `x`, `z`, yaw/pitch and optional mount id, but no Y.

`buildSaveData()` serializes only the player's X/Z from the live mesh.

Initial restore calls:

```ts
player.setPosition(initialSave.player.x, initialSave.player.z)
```

without a saved `groundQuerySeedY`.

`setPosition()` then calls `snapToGround()`. Cave-vs-surface selection in `groundAt()` is intentionally Y-aware:

```ts
this.caveGround(x, this.mesh.position.y, z)
```

because the same X/Z can mean hillside or cave floor.

**Why wrong / fragile:**

The persistence schema discards a coordinate that the authoritative spatial resolver requires. On reload the player's constructor/current Y, not the saved underground position, seeds cave-ground arbitration, so a closed-cave save can restore to the surface/incorrect layer at the same X/Z.

Persisting a separate cave-context flag would be the wrong fix; current XYZ + cave world semantics are already the authority.

**Affected consumers:** player restore, cave ground/collision, interaction/combat spatial filtering immediately after load, cave audio/fog after restore.

**Owner domain:** `persistence` (consuming player/world cave semantics).

**Existing plan coverage:** completed `world-027` established XYZ-derived `WorldSpatialContext` and explicitly says not to persist context, but it does not persist player Y. Area 07 did not have a focused owner for this seam.

**Recommended action:** new `persistence-006-player-cave-position-save-load-continuity.md`: persist a vertical position/seed, migrate old saves with legacy surface fallback, and restore after cave/world ground queries are available.

---

### F08-03 — high — fauna/human/predator-prey perception still uses XZ-only proximity and can react through a closed cave roof

**Flow:** local candidate composition → predator/prey/player/NPC sensing → decision → chase/flee/attack.

**Files / symbols:**

- `src/fauna/faunaProximity.ts`
- `src/fauna/AnimalAgent.ts` nearby predator/prey/player/NPC resolution
- `src/fauna/predatorHumanDecision.ts::countNearbyHumans`
- `src/fauna/faunaDecision.ts`
- `src/app/gameLoop.ts` fauna/NPC candidate composition
- `src/world/spatialContext.ts`
- `Caves.spatialContextAt`

**Code evidence:**

The fauna proximity index buckets only `mesh.position.x/z`; exact candidate distance is also XZ-only.

`countNearbyHumans()` explicitly measures XZ distance.

`gameLoop.ts` builds nearby NPC candidates as `{ id, x, z }`, and passes the player's position into fauna awareness without a same-space gate.

The completed `world-027` plan already identified AI/perception as a follow-up: interaction and player combat were isolated by `WorldSpatialContext`, while full fauna/NPC awareness was intentionally out of scope.

**Why wrong / fragile:**

A predator inside a closed cave and a prey/player/NPC on the hillside above can become perception candidates solely because their X/Z overlap. The reverse leak is equally possible. That can trigger chase/flee/attack pressure across solid rock and can feed secondary alert/guard logic.

A naive strict same-context filter alone would overcorrect near the cave mouth: an animal just inside should be able to notice an approaching actor just outside before the actor crosses the boundary.

**Affected consumers:** wild predator/prey sensing, predator→player aggression, predator→NPC pressure, predator→livestock prey acquisition, prey alerts, dog/guard reactions that consume those threat sets.

**Owner domain:** `fauna`, reusing world-owned spatial identity.

**Existing plan coverage:** none. `world-027` explicitly defers AI/perception. `fauna-042` owns proximity scan cost, not spatial-domain semantics.

**Recommended action:** new `fauna-045-cave-surface-perception-boundary-and-entrance-awareness.md`. Resolve current context from physical XYZ, reject closed-roof cross-context candidates by default, but allow a bounded same-cave entrance/mouth awareness seam so detection can begin before entry. Do not use habitat binding as current context and do not add per-pair world-wide cave scans.

## 5. Existing findings integrated without duplication

### Runtime ground unavailable / missing chunk

Area 04 already confirmed that detailed movement can silently downgrade from canonical runtime ground to analytical fallback when a chunk is missing/generating, including loss of bridge/runtime modifications. This affects player/NPC/fauna movement and slope probes.

Owner: `world-terrain-044-runtime-ground-query-authority-and-missing-chunk-fallbacks.md`.

Area 08 does not create another plan.

### Water traversal

Area 05 already owns canonical player local-water traversal and unified water/shore query work in `world-terrain-045` / `world-terrain-046`. Fauna water preference/physical traversal is already represented by `fauna-029`.

No duplicate water-navigation finding is created here.

### Interaction destinations near colliders

`npc-007-interaction-destination-approach.md` already owns the A* exterior-goal vs destination-aware final-approach seam. Current movement still routes final action arrival through the real destination rather than a rescue waypoint.

No duplicate finding.

## 6. Architecture observations

- There is one shared movement-ground projection for outdoor bridge traversal, but intentionally no universal one-size-fits-all `isWalkable`: player, NPC and animal abilities differ. The healthy contract is shared physical ground + actor-owned walkability.
- Player/NPC/fauna share slope rules. NPC/fauna share bounded local navigation. Domestic animals are not a locomotion fork; they remain `AnimalAgent`.
- Ford and bridge semantics come from declared road crossings. Runtime movement does not reclassify a river crossing independently.
- Local route state is transient and cleaned on destination/action changes. No stale-path persistence across WorldBundle rebuild/save-load was found.
- A stale local path after a live world change is safety-bounded because actual locomotion revalidates every step; it may become inefficient/stuck and repath, but it does not authorize the old surface.
- Watchdog escalation is bounded. No unbounded retry loop was found.
- No generic false-arrival path was found: NPC rescue waypoint completion does not masquerade as arrival at the semantic destination.

## 7. Performance review

### Bounded A* implementation

`findPath()` allocates Maps/Sets/arrays per request and finds the lowest-f open node with a linear scan. Worst-case work is therefore not ideal, but requests are capped at 1500 visited nodes and are triggered by direct-route failure/stuck recovery rather than every frame.

**Expected ROI of optimizing now:** low/unknown.  
**Implementation risk:** medium; changing search containers/simplification can alter routes.  
**Benchmark required before implementation:** yes. Use existing `navigationStats` path requests/search ms/visited nodes/repaths. No plan created without evidence.

### Movement probe hot path

Animal movement can perform a slope sample plus up to three water/collider walkability probes per movement step. This is a real recurring cost, but current optimization ownership already exists:

- `fauna-028` cadence;
- `fauna-033` water/collider diagnostics and cached river gameplay segments;
- conditional collider-allocation work is explicitly benchmark-gated.

**Expected ROI:** potentially high for large fauna counts, already tracked.  
**Implementation risk:** medium.  
**Benchmark before further work:** required by existing plan.

No second optimization plan is created.

## 8. Cross-domain dependencies / follow-ups

- Area 07 cave authority remains the source for `spatialContextAt`; F08-02/F08-03 consume it rather than introducing another cave-space model.
- Area 03 persistence should treat F08-02 as owned by `persistence-006`.
- Area 16 fauna should treat F08-03 as owned by `fauna-045`.
- Area 19 player systems should not rediscover cave position persistence separately.
- `world-035` remains the planned shared regional road-itinerary layer. Its absence is not reported as a defect; current off-screen travel intentionally uses coarse duration/interpolation.
- Implementing `world-terrain-044` should precede any attempt to make detailed movement trust residency-sensitive ground more strongly.

## 9. Existing plans that already cover findings / dependencies

Existing relevant owners:

- `world-terrain-044-runtime-ground-query-authority-and-missing-chunk-fallbacks.md` — inherited detailed-ground defect;
- `npc-007-interaction-destination-approach.md` — interaction/collider final approach;
- `npc-058-time-skip-resource-and-interrupt-parity.md` — time-skip cleanup/resource parity, but not F08-01 placement;
- `fauna-029-animal-water-route-preference-and-corpse-world-time.md` — autonomous water route preference;
- `fauna-033-animal-movement-hot-path-performance.md` — measured movement hot-path optimization;
- `world-035-regional-road-travel-itinerary-and-adaptive-traveller-execution.md` — planned regional itinerary architecture, not a current defect.

## 10. New plans required

Created:

1. `npc-061-time-skip-and-reification-surface-placement-validity.md` — F08-01.
2. `persistence-006-player-cave-position-save-load-continuity.md` — F08-02.
3. `fauna-045-cave-surface-perception-boundary-and-entrance-awareness.md` — F08-03.

## 11. Verification limits

This was a focused static code-flow review of current `main`.

Not performed:

- browser/manual verification;
- production-code changes;
- performance benchmark execution;
- `pnpm docs:sync`.

No gameplay correctness is claimed beyond the code evidence above.

## 12. Master status update

Area 08 should be marked:

**⚠️ reviewed with unresolved high/critical findings**

Follow-up owners:

- existing `world-terrain-044`;
- new `npc-061`;
- new `persistence-006`;
- new `fauna-045`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

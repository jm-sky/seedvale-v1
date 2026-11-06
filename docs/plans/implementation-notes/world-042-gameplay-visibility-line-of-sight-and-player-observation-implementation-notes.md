# Implementation notes: world-042 — gameplay visibility, character LOS and last-known contacts

**Plan:** [world-042](../world-042-gameplay-visibility-line-of-sight-and-player-observation.md)
**Recon baseline:** `main` at `2c24b320` (2026-11-05), static code reading; no runtime, tests or benchmarks in this session. Astra's review pin was `72f33bbb`; its findings were re-checked below and still hold unless noted. Code remains authoritative if `main` advances.

## Current-code reality

### Information leaks (verified)

| Path | Symbol | What leaks |
| --- | --- | --- |
| `src/simulation/observation.ts` | `resolveObservationLevel`, `resolveStableObservationLevel` | Perception × distance only; no light, cover, LOS or spatial context. Downgrade hysteresis 0.75 m would carry a label through a wall. |
| `src/fauna/AnimalAgent.ts` | `tickPresentation` (~l.2634) → `labelController.sync(...)`; dead path `syncDistance` (~l.3517) | Distance is 3D `mesh.position.distanceTo(observerPos)`; no context → **A7 bug**. Agents also write `labelController.el.style.display` directly (~l.2167, 3106, 3202) — concealment would be overwritten; centralise first. |
| `src/ai/NpcAgent.ts` | presentation block (~l.3850–3890), `questMarker` passed even at `none` level | Same as fauna; quest icon visible at `none`. |
| `src/ui/agentStatusLabel.ts` | `createAgentStatusLabelController`, `resolveAgentLabelObservationPresentation`, `updateAgentLabelDistanceState` | `none` branch still returns `questMarker`. Distance-state also owns `setSubtreeCastShadow` (shadow-distance gate) — suppressing the label must **not** skip this. |
| `src/ui-vue/lib/drawMinimap.ts` | `drawMinimapFrame` loop over `settlement.npcs` (~l.157) | NPC dots from `npc.mesh.position`, no eligibility. Fauna has no dots. |
| `src/interaction/findInteractionTarget.ts` | `rankInGaze`, `pickInGaze` | Distance/facing only. Interactables are already filtered by `filterInteractablesSameSpatialContext` in `gameLoop.ts` (~l.1303). |
| `src/player/playerCombat.ts` | `collectLivingCombatTargets`, `collectRangedAnimalCandidates` | Range + spatial context, no LOS; `resolveRangedAimYaw` tracks the live position of a locked candidate. |

### Seams to reuse

- **Render layer:** `src/world/waterMirror.ts` — `AGENT_RENDER_LAYER = 2`, `assignRenderLayer(root, layer)` (traverses); `NpcAgent` (~l.1949) and `AnimalAgent` assign it. `src/app/renderStack.ts` (~l.91) enables it on the main camera; `src/world/createLights.ts` (~l.85) on `sun.shadow.camera`. The water mirror renders layer 0 only, so agents are already not reflected (no reflection leak). Add one `SIGHT_CONCEALED_LAYER` next to these constants; do **not** enable it on the shadow camera — concealed actors cast no shadow (author A8). **Verify in three 0.185** that `CSS2DRenderer` hides children whose layers fail `camera.layers` (it tests `object.layers.test(camera.layers)`); if not, use the label controller's `concealed` flag only.
- **Root visibility owners:** `hideLivingVisual` / `showLivingVisual` (fauna), `NpcAgent.concealCorpsePresentation`, `hasLootableCorpse` reading root `mesh.visible`. Do not touch.
- **Optional-node visibility:** `src/render/agentPresentationVisibility.ts` (never touches layers/root) — put the concealment helper beside it with the same "cached node list, no traversal per apply" rule. Equipment/hair re-attach paths (`assembleCharacter.rebindAllSkinned`, NPC equipment changes) must apply the current layer to new meshes.
- **Cull bounds:** `src/render/actorCullBounds.ts::installActorCullBounds` — source for semantic sample points (sphere centre/radius) without CPU skinning.
- **Segment march:** `src/player/cameraBoom.ts::resolveCameraBoom` — terrain steps via `sampleHeight`, cave `occupancyAt`. Extract the terrain/occupancy march into the sight module (camera keeps its own collider pull-in; do not change camera behaviour).
- **Caves:** `src/world/createCaves.ts` — `spatialContextAt` (scans all runtimes per call — call once per actor per tick, not per pair), `v2ByCaveId` for O(1) per-cave lookups; entrance corridor per fauna-045 notes (`CaveHeightfieldRepresentation.entrance`, `deriveMouthGeometry`, `mouthAlong`/`mouthLateral`, `openSky`).
- **House geometry:** `src/settlement/houseBuilder.ts` — `openingLocalPose(def, opening)` (single source of truth for door/window poses), `wallTopY`, `buildHouseWallCollidersLocal` (movement only; window wall = full OBB). Sight blockers are a sibling builder from the same `HouseDefinition`, registered with the colliders' lifecycle in `createSettlement`. Doors: `settlement/houseDoors.ts` — logical open state is driven by **observer proximity** (`HOUSE_DOOR_OPEN_DISTANCE` 2.6 m); use the logical state (open while animating), not the leaf mesh.
- **Collider grid:** `src/world/collision.ts::createColliderRegistry` — 3×3 point query only; sight needs a segment cell walk with extent-aware insertion. Generalise the bucket code rather than copy it.
- **Perception:** `src/fauna/playerAwareness.ts` — `effectiveNoticeRange`, `detectionProbability`, `isPlayerNoticed`, `PlayerStealthState`, `sneakDetectionMultiplier`; `AnimalAgent.senseEnvironment` (~l.4321) with `forestFactor` sampled at the **animal's** position (`createFauna.ts` ~l.1448) and `litFires`.
- **Light owners:** `src/player/PlayerTorch.ts::isLit`, placed fires (`litFires` from `createApp.ts`), settlement torches (`quests/settlementLightLookup.ts` snapshot shape shows the owner). `world/pointLightBudget.ts` may hide real lights — never read lights for gameplay.

## Recommended order inside Stage 1

1. Pure `src/world/sight/` query + tests with synthetic blockers (no game wiring).
2. Producers: terrain + caves, then houses (walls/roof/openings/doors), palisades, large rocks.
3. Contact store + state machine (pure, tested), then agent wiring behind a runtime switch.
4. Consumers: label controller `concealed` flag → minimap → gaze/inspect/touch → combat lock/aim.
5. Billboard helper last (visual), then measurement.

## Tests to add

- `src/world/sight/*.test.ts`: wall blocks; window transmits; open door transmits, closed blocks; low wall vs elevated observer; roof blocks from above; ridge blocks, crest clears; cave roof blocks both ways; matching mouth corridor clears; cave A ≠ cave B; segment crossing a blocker whose centre is outside the endpoints' cells; `unknown` when a producer is missing.
- State machine: grace before conceal, instant reveal, one billboard per id, frozen position under target movement, expiry rules, cleared on death/unload/rebuild/context change.
- Consumers: label hidden incl. quest/shop icons, shadow-distance gate still applied; minimap dot gated; gaze/lock/aim gated and revalidated at execution; free hit/projectile unaffected.
- Invariance: fixed seed `415424794`, N steps with sight on/off and different camera yaw → identical NPC/fauna state hashes.
- Stage 0: label context gate cases from the plan.

## Regression watch-list

A1′ cull bounds and picking; Q20 shared skeletons; agent presentation LOD optional nodes; corpse concealment/loot; label shadow-distance gate; dialogue/trade with a concealed NPC; mounted animal (exempt); livestock in pens/barns; dogs following the player; NPCs entering houses (doors close behind them only when the player is far — door state is player-driven); cave follow camera; Q16 `?actorCohort` mask (must still restore flags when both run).

## Do not

Run `pnpm docs:sync` from a task that did not change generated inputs; persist contacts; bump `CURRENT_SAVE_VERSION`, worldgen caches or `WORLDGEN_EPOCH`; use rendered meshes or raycasts against the scene as the AI authority.

## Stage 0 implemented (Q155, 2026-11-05)

Technically verified (type-check, lint, `src/fauna src/ai src/ui src/world src/simulation` green); **not browser-verified** (no cave screenshot taken; goes to the author's check list).

- **`canPerceiveAcrossEntrance(caveId, a, b)`** now exists on `Caves` (`createCaves.ts`), backed by pure `isInsideEntranceAwarenessCorridor` in `world/caves/mouthCarve.ts` (consts `ENTRANCE_AWARENESS_*`: 10 m outward / 10 m inward of the mouth plane, aperture half-width + 1.5 m lateral, -2 m / +2 m vertical around floor/ceiling). Both positions must be in the corridor; O(1) via `v2ByCaveId`. `spatialContextAt` is unchanged (mouth stays `surface`). **fauna-045 must reuse this, not add another** (its corridor numbers are untuned guesses; change the constants once for both consumers).
- **Gate:** `simulation/observationSpatial.ts` (`PlayerLabelSpatialView`, `isActorInfoSpatiallyVisible`): same context visible; cave A vs B hidden; surface vs cave only via the mouth corridor keyed by the cave-side id. The view travels on `PlayerObservationInput.labelSpatial` (optional; undefined = old behaviour). `gameLoop.ts` builds it once per frame (one `spatialContextAt` for the player; the object is added to the already per-frame `getPlayerObservation()` result).
- **Consumers:** `AnimalAgent.syncLabelSpatialVisibility` (presentation tick and corpse path) and the `NpcAgent` presentation block resolve the actor context only when `distance < LABEL_FADE_FAR` (32 m, now exported from `ui/labelDistance.ts`). No per-pair scans.
- **Controller owns `display`:** `AgentStatusLabelController.setHidden(reason: 'lifecycle' | 'spatial', hidden)` is the only writer of the label root's `display`; the three direct `el.style.display` writes in `AnimalAgent` (revive, harvested remains) now use `'lifecycle'`. Hiding the root also hides the highlight glow (class state is kept; `setHighlighted` itself is unchanged). Shadow-distance gating in `sync`/`syncDistance` still runs while hidden.
- **Not covered (Stage 1):** gaze/Tab target selection and minimap dots can still pick a cave actor; only label + highlight visuals are gated.
- Cost: per in-range actor per presentation tick, one `spatialContextAt` (scan over loaded cave runtimes) + at most one O(1) corridor test when contexts differ; per frame one extra player `spatialContextAt` and one small object.

## Stage 1 implemented (Q156, 2026-11-06)

Technically verified (type-check, lint, full `pnpm run test` 804 files / 9479 tests, build). Browser: boot smoke only (WSL Chrome/D3D12, Vite dev, `?seed=415424794` and `&sight=0`, CDP click on „Rozpocznij”, 30 s in the home village: game runs, labels/HUD/minimap render, no exception from sight code; the intermittent `chunkWorkerPool` worker-error / `App.vue` dynamic-import failures seen in both arms are the known Vite-dev module-graph load aborts, Q80) — the LOS acceptance cases (wall, door, window, corner, ridge, cave mouth) and the billboard look are **not** browser-verified.

- **Sight query** `src/world/sight/`: `querySight.ts` (context gate with Stage 0 corridor semantics → range → optional `isAreaReady` → per sample, first clear wins: registered blockers, then terrain march surface↔surface (1 m steps, 4–64) or cave-occupancy march same cave (0.75 m steps); cross-context pairs inside the mouth corridor skip the marches). `sightBlockers.ts` = primitives (`SightPanel` OBB prism with finite Y and apertures, `SightCylinder`) + per-bundle registry with an **extent-aware** 16 m grid and a revision counter. The collider registry (`collision.ts`, centre-bucketed 3×3 query) was **not** generalised — its point-query contract is different and changing it would touch movement; the sight grid is a separate ~40-line index (deviation from "generalise, not copy", recorded here).
- **Producers** (same lifecycle as colliders; `WorldBundle.sightBlockers`, cleared on dispose/rebuild): settlement houses + storehouse + palisades in `createSettlement.registerSettlementColliders()` (re-run on logical door change → open door = aperture, closed = leaf panel); player palisades (`palisade:<id>`), completed residential buildings (`residential:<id>`, leaves treated as closed — no door controller); chunk `largeRock`/`tower`/`shipwreck` cylinders (`chunk:<key>`, effective mineable kind). Rail fences (pasture/paddock/yard), trees, bushes, rock clusters never block. Approximations (🟡, comments in code): window cutouts from the fill parts' audit dims minus frame (wide ±0.7 m, thin ±0.3 m, y 1.05–2.45); door 0.65 m × 2.1 m; roof = flat slab footprint + 0.3 m overhang, `[wallTop, wallTop + 1.5]`; rock height 1.2 × collision radius; tower 10 m, shipwreck 4.5 m; player palisade solid 1.5 m.
- **Controller** `src/app/playerSight.ts` (`WorldBundle.playerSight`, `?sight=0` disables): observer = player feet + 1.65 m eye (never the camera); NPCs, livestock, rats, detached livestock, wild fauna ≤ 55 m; tiers < 15 m every frame, < 30 m every 2nd, else every 4th (stable per-id phase); per-actor cache keyed by 0.2 m-quantised observer/target pose + blocker revision. Samples `render/actorSightSamples.ts` (biped 7, quadruped 6, from `NPC_HEIGHT` / `AnimalAgent.sightBodyHeight()`; no skinning). Exempt: mounted animal, NPC in dialogue/trade (`store.playerInteractingNpcId`). Dead actors are revealed and forgotten.
- **State machine** `simulation/playerSightContacts.ts`: reveal instant, conceal after 0.2 s continuous `blocked`; `unknown` → shown (no billboard); one frozen billboard per id at the last clear pose; expiry < 3 m, > 50 m, 60 s, player context ≠ billboard context, re-acquire, death/unload (`retainOnly` every 30 frames), dispose. Never saved.
- **Concealment**: `NpcAgent`/`AnimalAgent.setSightConcealed` → whole subtree to `SIGHT_CONCEALED_LAYER = 5` (`render/actorSightConcealment.ts`, constant in `world/waterMirror.ts`; enabled on neither the main nor the shadow camera → no shadow, A8) + label `setHidden('sight')`; `reapplySightConcealment` every 0.5 s while concealed covers meshes attached later (GLB swap, pack, equipment). Root `visible` untouched.
- **Stage 0 bug fixed on the way:** `CSS2DRenderer.render` rewrites the CSS2D element's `style.display` every frame from its own frustum/layer test, so Stage 0's `display`-only `setHidden` was overwritten next frame (cave/surface labels very likely still showed in the browser). `setHidden` now also sets the label object's `visible` (the renderer then hides the subtree). Q155's §2 check stays open.
- **Consumers**: `filterInteractablesSightDisclosed` → gaze/inspect/touch/Quick Actions/soft-lock resolution (`gazeInteractables` in `gameLoop`); melee hit candidates keep the unfiltered list. `filterLivingTargetsSightDisclosed` → Tab/soft lock (an existing lock on a now-concealed actor drops via the existing `findLivingTargetById` check). `filterRangedCandidatesSightDisclosed` → aim yaw + reticle only; projectile hit tests keep the unfiltered list. Minimap NPC dots filtered. Consumers read last frame's state (sight runs after NPC/fauna update, before minimap/render).
- **Billboards** `render/lastKnownBillboards.ts`: one procedural canvas atlas (human / large quadruped / small animal, blurred grey), three shared `SpriteMaterial`s, opacity 0.3, depth-test, no depth write, bottom-anchored, pooled, `AGENT_RENDER_LAYER` (not mirrored).
- **Tests**: core + producers (`src/world/sight/*.test.ts`), contacts, samples, concealment, billboards, label `sight` reason, `src/app/playerSight.test.ts` incl. **simulation invariance** (6 real `AnimalAgent`s, 300 steps, seeded `Math.random` 415424794: sight off / on behind a wall / on with a different player path → identical position/yaw/dead/`visible` snapshots).
- **Cost (vitest/jsdom on WSL, relative only — not a frame benchmark):** 60 NPC + 20 animal fake agents, 600 frames: dense village (40 real house blocker sets) p50 0.063 ms / p95 0.176 ms / max 1.5 ms, ~10 queries/frame, 76 % cache hits; open hilly terrain p50 0.027 / p95 0.053 ms; cave tube p50 0.034 / p95 0.099 ms. In-game `settlement-heavy` CPU p50/p95 and frame p95 not measured → queue §4.
- **Not done / limits:** no chunk readiness API, so `isAreaReady` is unset (unloaded terrain falls back to analytic height); actors > 55 m are never concealed (minimap dots far away unchanged); Q16 `?actorCohort=mask` + sight together not checked.

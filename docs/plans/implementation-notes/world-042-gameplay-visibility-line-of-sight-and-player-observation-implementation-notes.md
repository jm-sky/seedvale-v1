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

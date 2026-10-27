# NPC-064 — Spatial state recon and ownership map

**Date:** 2026-10-27  
**Status:** research complete; implementation not started  
**Source:** local V1 `main`, `jm-sky/seedvale-v1`, inspected commit `d70b5c074955143090cb531ac80c08f6d065f4e8`. The working tree was clean at entry. `origin/main` locally resolves to `8fce1429619eb8bf5f6297b09e6b854131862274`; no fetch, pull or remote freshness claim. Source references below are relative to the inspected commit.  
**Implementation owner:** [npc-064 parent plan](../plans/npc-064-agent-performance-spatial-state-seam.md).

## Findings confirmed in current source

1. `NpcAgent` owns detailed movement, decisions, action lifecycle and transient execution. Its live position and gameplay yaw currently reside in `mesh.position` / `mesh.rotation.y`. There is no separate live position field. `readonly mesh` prevents replacing the property, not mutating its transform ([NpcAgent.ts:1209](../../src/ai/NpcAgent.ts#L1209)). Keep the coordinator.
2. Existing plain [`Vec3` / `copyVec3`](../../src/simulation/types.ts#L16) and [`NpcMovementTarget`](../../src/ai/npcMovementTarget.ts#L16) are sufficient for the seam. A committed target is a destination snapshot, **not** current position. `resolveCurrentSpatialContext()` derives membership from actual XYZ through world queries; it is not inferred from the target or mesh visibility ([4334](../../src/ai/NpcAgent.ts#L4334)).
3. Constructor initialization is home XYZ followed by sampled surface Y; active corpse XZ/yaw takes precedence over travel; living travel reifies XZ and samples Y ([1873](../../src/ai/NpcAgent.ts#L1873), [1936](../../src/ai/NpcAgent.ts#L1936)). The fallback capsule body has a child-only `body.position.y = 0.75` (2017); wrapper position remains the ground point. Preserve that visual offset outside canonical XYZ. No universal current-position persistence exists for ordinary residents. Changing that is outside this refactor.
4. `travel` is an existing detailed/offscreen handoff checkpoint: no `execution` means detailed execution owns progress. `syncAccompanyTravelCheckpoint()` stamps current XZ for save/rebuild; stream-out starts an execution clock; offscreen resolution progresses that record; constructor/time-skip reification consumes it. It must not become a second detailed position updated back into the agent each frame ([npcState.ts:90](../../src/settlement/npcState.ts#L90), [NpcAgent.ts:4188](../../src/ai/NpcAgent.ts#L4188), [npcTravel.ts](../../src/ai/npcTravel.ts)).
5. Crowd impulses are computed before updates, applied **after each agent's update**, then social pairing and livestock consume positions. A synchronization only at the end of `NpcAgent.update()` misses separation ([createSettlement.ts:1643](../../src/settlement/createSettlement.ts#L1643)). Preserve this ordering, including existing Y timing: separation does not automatically resample surface ground.
6. Gameplay facing is the existing yaw, forward `(sin(yaw), cos(yaw))`. Incoming defense converts by `+ Math.PI`; ranged aim also has a coincident-target fallback. Do not normalize or change conventions ([npcCombat.ts:410](../../src/ai/npcCombat.ts#L410), [NpcAgent.ts:2738](../../src/ai/NpcAgent.ts#L2738)). Fallback corpse roll `rotation.z = PI/2` is presentation only ([3062](../../src/ai/NpcAgent.ts#L3062)). Animation targets the child root, not the wrapper spatial owner ([1870](../../src/ai/NpcAgent.ts#L1870), [1880](../../src/ai/NpcAgent.ts#L1880)).
7. Living simulation has no `mesh.visible`/frustum gate in `update()`. **Qualification:** corpse loot eligibility and corpse lifecycle currently do consult `mesh.visible` ([2233](../../src/ai/NpcAgent.ts#L2233), [2260](../../src/ai/NpcAgent.ts#L2260)). Preserve those existing semantics here; do not claim the entire NPC lifecycle is visibility independent or fix that coupling incidentally. Test hidden **living** agents separately from deliberately concealed corpses.
8. Historical reviews correctly recommend keeping agent coordination but contain obsolete sizes, signatures and extraction proposals. Current NPC deps object, animation owner and pure movement helpers already exist; fauna has completed much of `fauna-017`. Historical line numbers are not migration instructions.

## Dependency and mutation map

Categories: **S** simulation, **P** presentation, **L** lifecycle, **D** persistence/checkpoint, **X** external integration. Mixed rows explicitly identify the boundary. All source lines refer to the inspected SHA; the complete internal access inventory follows below.

| Path / exact owner | Category | Present dependency and migration contract |
| --- | --- | --- |
| `NpcAgent.constructor`, `create`, `createCapsuleFallback` (1873–1954) | L/S/P | All initial position writes are in constructor; async/fallback factories converge here. Preserve home → corpse or living travel precedence, sampling calls, identity and immediate pose before publication. NPC wrapper Y is ground; do not import AnimalAgent capsule offsets. |
| `createSettlement.materializeSettlementResident` (1316–1377), resident/visitor branches (1380–1525); `npcPresentationOwner` | L/X | Ownership gate precedes construction; scene registration follows it. Founded residency and merchant visiting owner stay unchanged. No production external direct NPC transform writer found; settlement calls public movement methods. |
| `SettlementsManager.unload` (1291), `resolveTravelAndTransportCheckpoints` (1393), `resolveTimeSkip` (1416), `snapshotNpcStates` (1568) | L/D | Handoff before dispose; offscreen checkpoint resolution excludes detailed execution in travel helper; loaded skip delegates to each agent. Snapshot stamps live checkpoint then serializes registry. No new registry or always-on offscreen live agent. |
| `app/saveState.buildSaveData` (340), `app/worldBundle.rebuildWorldBundle` (2731) | D/L/X | Both use manager snapshot. Preserve existing schema and reset/new-world policy; runtime spatial field is not serialized. Rebuild is world lifetime boundary, not a promise to restore every transient movement detail. |
| `SettlementsManager.beginOffscreenTransportHandoff` (1267), `resolveMerchantJourneyCheckpoints` (1377), detached pack targeting (1503), `dispatchReadyExpedition` (1581) | D/S/X | Direct NPC XZ reads seed duration, return origin, pack-follow targets and expedition origin. Migrate all four reads. Keep copied map values, qualified pack identity and one executor. |
| `steerTo`, `applyMovementGroundY`, `resolveSteerTarget`, `isWalkable`, `collidersNearAtHeight`, `isWalkableCaveColliders`, `applyRimDestination` | S | Horizontal result writes, Y write, collider Y filtering, bypass/rim inputs; preserve `ARRIVE`, health/locomotion speed, sample order and water threshold `waterLevel + WATER_MARGIN`. Runtime surface sampler availability and analytical fallback stay exactly as wired. |
| `npcMovementTarget`, `npcMovementRoute`, `npcCaveLocomotion`, `npcMovementRecovery`, `terrain/slopeConstraint` | S | Already operate on structural points/results; no state authority to move into them. Preserve committed final target/context, mouth confirmation from world XYZ, cave floor Y, diagonal/X/Z candidate order, null resident-ground hold and missing cave-floor behavior. `slopeConstraint` is algorithmically Three-free but imports sampler types from `PlayerController`; do not widen the type cleanup. |
| `applySeparation` (7339), `npcCrowd.run` (62–95), `createSettlement.update` (1655) | S/X | Only public ordinary spatial mutation is validated separation. Crowd structural input currently embeds `mesh.position`; change to spatial API without new snapshots per pair or scan/order changes. Preserve XZ-only surface nudge and cave acceptance. |
| `tickWatchdog`, `attemptNavRepath`, `attemptBlindRepath`, `attemptLocalEscape`, `emergencyTeleport` | S | Watchdog reads live XZ; local escape and emergency teleport write XZ/XYZ; destinations/repath scratch remain distinct. Cave recovery suppresses surface fallback; retain random calls and fallback order. |
| `resolveTimeSkip`, `catchUpCommittedTravel`, `applyTimeSkipPlacement`, `holdCavePositionForTimeSkip` | S/L/D | Schedule/travel can replace XYZ; cave/mouth skip holds cave-valid position. Preserve interrupted action/queue teardown before placement, duration/survival checkpoints and movement reset. Do not implement the separate surface-placement proposals of `npc-061`. |
| `takeDamage`, `applyIncomingCombatDamage`, `tickMeleeCombat`, `tickRangedCombat`, `tickRangedAttackCycle`, `die` | S/L/P/D | Range, yaw, shot origin, fleeing, blood/death XZ/yaw and blocked travel stamp. Facing writes are simulation even when player-facing. Death animation/roll remain presentation; do not reset roll during projection. |
| `update`, need/work/follow/escort/payment/burial/sanitation methods in inventory | S | Threat perception, well orientation, player proximity, delivery eligibility, destination distances, action origins and helper contexts all consume live position. Preserve XZ vs XYZ distance semantics, including `distanceTo` sites. |
| `socialBehaviour.advanceSocialPairing`, `NpcAgent.socialCandidate` (6972) | S/X | Social helper uses place/eligibility, no direct transform. Position dependency is internal idle activity selection (`resolveIdleActivity`, 5420); do not add a new proximity policy to pairing. |
| `player/playerCombat` (123–134), `app/interactables` (553, 933–946) | S/X/P | Live NPC position feeds range, gaze candidate anchor, spatial-context and target payloads. Keep living/dead branches and revalidation timing. Payload position currently aliases a live vector: use a stable read-only live view rather than a stale snapshot. Animal branches untouched. |
| `app/gameLoop` (277, 847, 2852), `debug/npcDebugApi` (801,809) | X/S/P | Diagnostics, NPC shadow proximity, NPC→fauna candidate projection, live debug anchors. `gameLoop` 3029 cart pose and `createApp` 1956 are **animals**, not NPCs. Migrate only NPC branches. |
| `ui-vue/lib/drawMinimap` (142), `ui-vue/store` (821), `app/createApp` (1968) | P/X | NPC map marker and dialogue/quest voice position. Audio already accepts structural `WorldSoundPosition`; no Vector3 adapter required. |
| `beginConversation`, `tickPendingConversationVoiceCue`, `requestBark`, `playReactionSound`, combat sounds | P | Feed structural live position to existing sound seams; do not change cue timing/random selection/admission. `audio/createWorldAudio` computes attenuation/context at playback. |
| `update` presentation tail, `updateDebugLabel`, animation/label controllers | P | Distance and gaze use canonical point; label attaches to wrapper, animation to child root. Visibility/LOD/shadows are presentation policies; keep cadence and controller inputs. Render-only code can retain the mesh for labels/scene ownership, never use it to infer simulation position after switch. |

### Exhaustive internal transform access inventory

Method inventory from TypeScript AST `PropertyAccessExpression` scan for `this.mesh.position` / `this.mesh.rotation`, grouped by owning method, with manual read/write inspection. This includes aliases (`p` in context resolution; `pos` in emergency recovery), vector operations and sound arguments; comments excluded. Line lists below make the internal migration auditable rather than relying on a few representative movement functions. Writes are enumerated separately after the table. Other fields (`target`, `tmp`, `home`, route points) are not current-position authority.

| Method | Access lines |
| --- | --- |
| `constructor` | 1873, 1874, 1939, 1940, 1945 |
| `createInspectionSnapshot` | 2061 |
| `takeDamage` | 2393, 2398, 2399, 2400 |
| `applyIncomingCombatDamage` | 2434, 2435, 2436 |
| `tickMeleeCombat` | 2616, 2617, 2645, 2656, 2659, 2660 |
| `tickRangedAttackCycle` | 2738, 2739, 2746, 2747, 2761 |
| `tickRangedCombat` | 2806, 2807, 2820, 2835 |
| `fleeFromThreat` | 2950, 2951, 2956, 2958 |
| `die` | 3033, 3062 |
| `update` | 3184, 3185, 3226, 3227, 3233, 3234, 3240, 3241, 3250, 3265, 3489, 3490, 3492, 3581, 3591, 3683, 3684, 3685, 3719, 3736, 3737 |
| `catchUpCommittedTravel` | 3877, 3889, 3896 |
| `applyTimeSkipPlacement` | 3934, 3935, 3936, 3946 |
| `holdCavePositionForTimeSkip` | 3950 |
| `startAccompany` | 4150 |
| `setAccompanyMode` | 4169 |
| `syncAccompanyTravelCheckpoint` | 4191 |
| `beginOffscreenTravelHandoff` | 4205 |
| `updateDebugLabel` | 4277 |
| `resolveCurrentSpatialContext` | 4335 |
| `rebuildComposedRoute` | 4360, 4361, 4362 |
| `stepComposedRoute` | 4388, 4389, 4390 |
| `applyMovementGroundY` | 4413, 4414, 4415, 4419, 4424, 4428, 4429, 4430 |
| `beginCollapseSleep` | 4506, 4507 |
| `beginNeed` | 4736, 4880, 4918, 4919 |
| `computeFoodStrategyCandidates` | 5031, 5033 |
| `beginRealFoodGathering` | 5116 |
| `attemptHuntKill` | 5195 |
| `professionContext` | 5305, 5306, 5358 |
| `resolveIdleActivity` | 5420 |
| `tryResolveEscortService` | 5556 |
| `voluntaryJoinContext` | 5599, 5600 |
| `tryProposeVoluntaryJoin` | 5718, 5719, 5730, 5731, 5749, 5750, 5759 |
| `tryPursueAccompany` | 5777 |
| `tryPursueCommittedTravel` | 5802, 5815 |
| `tryDeliverPlayerFollowUp` | 5874, 5875, 5880, 5881, 5891 |
| `tryRequestWorkPayment` | 5940, 5941, 5952, 5953, 5962 |
| `completePaymentApproach` | 5974, 5975 |
| `tryAcceptWorkContractOpportunity` | 6006, 6007 |
| `prepareWorkContractProvisions` | 6044, 6045 |
| `prepareEscortProvisions` | 6136, 6137 |
| `burialPressureCandidate` | 6632 |
| `animalCorpseCleanupPressureCandidate` | 6791 |
| `beginConversation` | 7010 |
| `tickPendingConversationVoiceCue` | 7063 |
| `requestBark` | 7138 |
| `playReactionSound` | 7162, 7165 |
| `collidersNearAtHeight` | 7178 |
| `isWalkableCaveColliders` | 7193, 7194 |
| `applyRimDestination` | 7212 |
| `resolveSteerTarget` | 7250, 7251 |
| `steerTo` | 7269, 7270, 7276, 7283, 7284, 7285, 7293, 7294, 7308, 7309, 7318, 7319, 7327, 7328 |
| `applySeparation` | 7342, 7343, 7351, 7358, 7359, 7364, 7365, 7370, 7371, 7376, 7377, 7379, 7381 |
| `tickWatchdog` | 7431 |
| `attemptNavRepath` | 7539 |
| `attemptBlindRepath` | 7573, 7574, 7578, 7579 |
| `attemptLocalEscape` | 7606, 7607, 7608, 7614, 7620, 7621, 7623, 7624, 7630, 7631 |
| `emergencyTeleport` | 7686, 7702, 7703, 7704, 7711, 7712, 7713 |

### Complete write ledger

- **Position, constructor:** 1873 copy home; 1874 sampled Y; 1939 active corpse XYZ; 1945 living travel XYZ.
- **Position, travel/skip:** 3889 reified XYZ; 3896 reached/blocked XYZ; 3946 placement XYZ.
- **Position, ground:** 4419 cave floor Y; 4424 mouth route fallback Y; 4428 surface Y.
- **Position, steering:** 7293–7294 cave XZ; 7327–7328 surface XZ.
- **Position, separation:** 7358–7359 full cave XZ; 7364–7365 cave X-only accepted result; 7370–7371 cave Z-only accepted result; 7376–7381 surface diagonal/X/Z increments. Do not discard resolver-returned second coordinates on axis trials.
- **Position, recovery:** 7614 cave escape XYZ; 7630–7631 surface escape XZ; 7702–7704 picked emergency XYZ; 7711–7713 emergency fallback XYZ.
- **Gameplay yaw:** constructor corpse restore 1940; melee 2645; ranged 2820; well 3492; look-at-player 3685; steer 7276.
- **Presentation roll:** `die()` 3062 only. No NPC wrapper pitch writes found. Do not promote roll or animation bone transforms into gameplay facing.
- **External:** no direct production writes to NPC mesh position/rotation found in repository source. The external spatial writer is `createSettlement.update → applySeparation`; skip and constructor paths enter through NPC methods. Debug teleport in `npcDebugApi` moves the **player** to an NPC anchor, not the NPC.

### Tests and coverage gaps

Existing real-agent tests: [`NpcAgent.timeSkip.test.ts`](../../src/ai/NpcAgent.timeSkip.test.ts) constructs fallback agents, interrupts action/queue/conversation and checks committed-travel X movement; lines 282–287 read mesh directly. [`NpcAgent.combatMode.test.ts`](../../src/ai/NpcAgent.combatMode.test.ts) drives private combat ticks; [`npcPlayerReactionVoice.test.ts`](../../src/ai/npcPlayerReactionVoice.test.ts) constructs agents. These provide reusable construction patterns, not full movement/pose parity coverage.

No direct writes to **real NPC** mesh position/rotation were found in current tests. `npcCrowd.test.ts:5` has mutable structural mesh fixtures; `npcDialogueOpen/Trade/Voice.test.ts` and `playerCombat.test.ts:175` have mesh-position NPC stubs. Migrate their input contracts with their production consumers. Do not misreport AnimalAgent test writes as NPC writes. Future baseline tests may temporarily set NPC transforms to arrange a case; list them explicitly and move setup to typed private test access to the centralized writer before authority switches. Keep deliberate render-tampering tests as exceptions.

`npcMovementSurfaceRegression`, `npcMovementCaveIntegration`, `npcMovementRecovery`, `npcCaveLocomotion`, `npcMovementRoute` and `npcMovementTarget` exercise helper contracts. Even the cave “Integration” test composes helpers/topology rather than running the real `NpcAgent` loop. Add agent-level surface/cave/mouth/ground, separation-after-update, yaw/defense and reconstruction tests. Current manager tests do not establish full NPC stream-out → reconstruction → save/rebuild spatial parity; add a focused handoff harness, not an entire world bootstrap dependency.

Retain existing `npcTravel`, `npcOffscreenSurvival`, `npcState`, `npcPresentationOwner`, `npcPostDeath`, `socialBehaviour`, `npcCombat`, `slopeConstraint`, `navigation`, `playerCombat`, audio/voice and dialogue tests as relevant regression oracles. Extend existing suites when ownership matches; new real-agent tests belong in `NpcAgent.spatial.test.ts` and `NpcAgent.spatialLifecycle.test.ts`.

## Bounded AnimalAgent comparison

**Recommendation: NPC first, after stronger NPC regression coverage.** Animal tests are broader (`AnimalAgent.test.ts`, `animalCaveJourney`, `animalCorpse`, `faunaProximity`, `mountActions`, `livestock`), but they cover a materially more complicated seam:

- [`AnimalAgent.driveMounted`](../../src/fauna/AnimalAgent.ts#L2459) is a second movement entry point with early returns and a shared simulation/presentation tail; riding bypasses autonomous bounds. Mount actions copy pose into the player; carts consume animal yaw. Existing `fauna-017` tail and corpse extractions must not be repeated.
- [`snapshot` / `hydrate`](../../src/fauna/AnimalAgent.ts#L2989) persist XZ/yaw on every livestock individual. [`livestock.ts`](../../src/settlement/livestock.ts#L216) captures before stream-out; merchant horse creation writes yaw directly (809). [`createFauna`](../../src/fauna/createFauna.ts#L1280) restores persistent cave inhabitants before ticking, while ordinary wild animals reconstruct differently.
- [`snapY` / `settleRootForRemains`](../../src/fauna/AnimalAgent.ts#L6366) distinguish model ground from capsule center (`0.45 * scale`), swimming water height, cave containment and corpse Y. [`interactionPosition`](../../src/fauna/AnimalAgent.ts#L3297) intentionally derives a tipped corpse's visual interaction anchor with `localToWorld`.
- Fauna's derived proximity grid, corpse host helpers, grazing/carcass claims, household ownership and mount/livestock persistence widen the mutation and alias surface. Tests directly reposition fauna (`AnimalAgent.test`, `animalCaveJourney.test`, `faunaProximity.test`, `animalCorpse.test`, `mountActions.test`, `foreignProperty.test`) and must be audited in a later fauna task.

Reusable lessons: field-specific authority ledger, read-only structural views, complete writer centralization, projection independent of LOD, same-call parity tests and travel/lifecycle handoff tests. No shared agent registry, generic movement engine, cadence change or fauna implementation plan is justified here.

## Existing contracts and optional donor evidence

Read as context: [NPC historical review](2026-09-03--NpcAgent-refactor-review.md), [animal historical review](2026-09-03--AnimalAgent-refactor-review.md), [September follow-ups](2026-09-21--agent-performance-and-simulation-boundary-followups.md), [refactoring ledger](../REFACTORING.md), [NPC state](../state/npc.md), [fauna state](../state/fauna.md), [architecture](../architecture/ARCHITECTURE.md), [revival R2](../research/v1-revival/2026-10-25--002--architecture-and-simulation.md), [ARCH-03/13 matrix](../research/v1-revival/2026-10-26--007--unified-candidate-matrix.md#arch-13), [fauna-017 notes](../plans/implementation-notes/fauna-017-animal-agent-refactor-implementation-notes.md).

Bounded local donor check: V2 `../SeedVales/scripts/check-layers.mjs` at `9ba54815493b886eb1bdce032f5209aeb2856c37` demonstrates import guards; V3 `../../src/game/sim/agents/registry.ts` at `94c464739d46afb982949fd6ed96b0d74d265b10` couples registry moves to a derived grid. The useful technique is checking a narrow dependency boundary, not copying a registry, insertion-order machinery or Near/Mid/Far ownership. V1 does not need a new spatial index for this task. No donor performance benefit is claimed.

## Verification actually performed

On 2026-10-27, `pnpm exec vitest run` with these 12 explicit files passed: `src/ai/{NpcAgent.timeSkip,NpcAgent.combatMode,npcMovementSurfaceRegression,npcMovementCaveIntegration,npcMovementRoute,npcMovementTarget,npcCrowd,npcTravel,npcOffscreenSurvival}.test.ts` and `src/settlement/{npcState,npcPresentationOwner,npcPostDeath}.test.ts`: **12 files / 136 tests passed**, 5.94 s reported. This is the unchanged-code baseline, not new regression coverage or implementation acceptance.

No typecheck, build, full suite, browser session, gameplay soak or performance benchmark was run. This research changes documentation only. Browser acceptance remains required during implementation, with existing [browser benchmarking guidance](../performance/agent-browser-benchmarking.md) if measuring costs; no headless browser was launched.

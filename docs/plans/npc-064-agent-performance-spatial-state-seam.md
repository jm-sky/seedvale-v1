# Plan: Agent Performance — Spatial State Seam

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** refactor
**Priority:** medium · **Effort:** XL
**Depends on:** -
**Domain:** `npc`
**Subdomains:** `lifecycle` `movement`
**Tags:** `agent-performance` `architecture` `rendering` `spatial-state`

## Plan history and execution status

- **2026-09-21:** original draft established a small runtime spatial seam, one authority, presentation-only visibility, preserved save/offscreen contracts, NPC/fauna scope selection after recon, and no ECS or broad agent rewrite. This direction remains intact; the former open recon section is resolved by the report below. Original draft and wording remain available in Git history.
- **2026-10-27:** fresh local V1 `main` recon at **`d70b5c074955143090cb531ac80c08f6d065f4e8`**. Expanded into bounded Composer tasks; effort changed from M to XL because the complete migration spans several commits. **No runtime implementation is complete or authorized by this document.** Retain draft status for the parent because later tasks have explicit test/manual gates; the first baseline task was executable after recon. The recon assignment authorized documentation only; later Stage 0A work and its focused commit were separately authorized. No push is authorized.

- **2026-10-27, Stage 0A:** test-only characterization implemented against `68fe0ec38f572bab24db8a4ad5b19b9d4b9cf447`; no NPC/movement runtime diff from the recon SHA. After review corrections: **21 new tests; Stage 0A bundle 9 files / 127 tests passed**, focused lint passed. Global type-check has five pre-existing asset-browser test errors, recorded in the [implementation notes](implementation-notes/npc-064-agent-performance-spatial-state-seam-implementation-notes.md). Manual motion/crowd/cave/combat reference clips remain required before Stage 3A. Stage 0B is next; the spatial refactor itself is not implemented.

The [recon report and complete transform access/write ledger](../reviews/2026-10-27--npc-064-spatial-state-recon.md) is the evidence owner. Read it with this plan; Cursor should not repeat the whole architectural recon. At each session, inspect the diff since the pinned SHA only for changed owners/callers. Historical September reviews are context, not current-code authority.

## Outcome and boundaries

Transition detailed NPC execution from `NpcAgent → mesh.position / rotation.y` to `NpcAgent → private canonical runtime position / facingYaw → presentation`. Keep `NpcAgent` as coordinator. First introduce access and mutation seams while the mesh remains authoritative, then switch **position and yaw in separate commits**, after consumers and writers are migrated. No shadow simulation, bidirectional synchronization or temporary independent positions.

In scope: current NPC spatial reads/writes, external NPC consumers, constructor/reconstruction/skip/handoff, same-call render projection, regression tests and narrowly scoped dependency guards.

Out of scope throughout: behavior fixes (including `npc-061` placement validity and current corpse-visibility coupling), AI/routines/needs/action policy changes, pathfinding algorithms, collision/ground/water rules, RNG changes, cadence/LOD/streaming changes, ECS, registries, universal persistence, mesh removal, whole-agent headless execution, AnimalAgent implementation and unrelated optimizations. Do not reduce line counts as an acceptance criterion. Do not mark the refactoring ledger completed during planning.

## Recommended architecture (proposal, not existing implementation)

### Ownership and types

- **Detailed runtime:** private `NpcAgent` field owns mutable plain `Vec3` position; later the same agent owns numeric `facingYaw`. It has exactly the live agent's lifetime. `NpcStateRegistry` remains stable identity/persistent domain owner; no new registry or serializable `position` field.
- Reuse `Vec3` from `src/simulation/types.ts`; define narrow `NpcSpatialReader` in a proposed `src/ai/npcSpatial.ts` with `getPosition(): Readonly<Vec3>` and `getFacingYaw(): number`. If a pose type is needed, use `{ position: Readonly<Vec3>, facingYaw: number }`; no Euler, quaternion or Three imports. Do not create a generic entity abstraction.
- **Read API:** `getPosition()` returns one stable, plain, read-only **live view**, not a per-call snapshot or raw Vector3. Use a once-created frozen object with x/y/z getters delegating to the current private backing accessor. It must expose no vector mutation methods and must not permit property writes, including through a cast. Initialize it before publication, after required constructor fields exist. Explicit copies (`copyVec3`, `{x,z}`) are still required at checkpoint/route/inspection snapshot boundaries. Do not cache a view beyond agent disposal or across rebuild; resolve by stable ID again.
- The view initially forwards to the mesh. After switch it forwards to the private plain position. This is an access boundary, **not** another stored position. `getFacingYaw()` initially reads the mesh scalar, then the private scalar. Public reader behavior remains stable through both commits.
- **Mutation API:** private `writePosition(x,y,z)`, `writePositionXZ(x,z)`, `writePositionY(y)`, `writeFacingYaw(yaw)` centralize storage and projection, without sampling, collision, RNG, path resets, checkpoint writes or action effects. Names are proposals. Keep `applySeparation(dx,dz)` as the public validated movement entry. Existing movement/action commands remain public; no unrestricted public teleport/setPosition API is needed by current production callers. Test setup may use a typed private-access harness, following existing agent tests.
- Preserve current yaw convention and values exactly, including atan2 signed values and coincident ranged fallback. No normalization or `+PI` in the projection. Corpse roll, bones, model scaling, label offsets and animation stay presentation state.

### One-way presentation synchronization

`writePosition*` changes canonical storage, then synchronously projects numeric XYZ through one private `syncPresentationPosition()`; `writeFacingYaw` does the same through `syncPresentationFacing()`. The position projection copies numbers; the facing projection changes **only** `mesh.rotation.y`. Never assign a whole Euler or clear corpse roll. No interpolation or visual offset is introduced. NPC wrapper position is currently world ground XYZ (unlike animal capsule-center Y).

Use synchronous projection at each existing write boundary initially. This preserves same-call consumers, callbacks, constructor pose, skip placement and separation after update without adding a global frame pass, dirty queue or synchronization timer. Projection must not depend on `visible`, camera, presentation importance or label cadence. Never copy mesh back into runtime state after initialization. If someone externally tampers with the mesh after switch, simulation ignores it; explicit projection or the next spatial write repairs the pose. Ordinary parity is guaranteed at sanctioned mutations, not arbitrary tampering between them.

Cost: one plain XYZ field set plus a numeric Three position copy per mutation, plus getter indirection for reads; no per-query point allocation, world scan or per-frame snapshot. A moving NPC can write yaw, XZ and Y and then receive separation in the same tick. Keep this bounded extra copying first; measure representative settlement cost before considering dirty batching. Do not promise an FPS gain. Retaining structural live views avoids changing interaction payload freshness and O(n²) crowd allocations.

### Travel and lifecycle authority handoff

| Phase | Spatial authority | Permitted transfer |
| --- | --- | --- |
| Ordinary detailed resident | Private runtime position (after 4A) | Existing home initialization; ordinary residents do not gain universal position saves. |
| Detailed accompanying / committed traveller | Runtime position; `travel` stores continuity/intent | Existing checkpoint seam copies XZ to `travel`; checkpoint never drives every detailed tick. |
| Stream-out | Live agent until handoff | Existing `beginOffscreenTravelHandoff` stamps XZ and execution before dispose; runtime field dies with agent. |
| Offscreen | Existing travel/execution checkpoint | Existing checkpoint/survival/arrival resolver advances it; no offscreen `NpcAgent` or duplicate clock. |
| Reification | Existing travel resolver, then new runtime position | Constructor consumes reified XZ, samples Y as today and keeps/clears travel under existing rules. No old runtime position is retained. |
| Save/rebuild while detailed | Runtime → existing checkpoint → existing snapshot | Manager snapshot sync then registry serialization; `worldBundle` and `saveState` use the same seam. No save schema bump. |
| Time-skip while loaded | Existing skip/travel resolver, then runtime position | Cave/mouth hold and surface schedule/travel placement preserve current ordering and samples. |
| Death / reconstructed active corpse | Existing `postDeath` record owns durable death XZ/yaw | Live death copies canonical pose once; constructor restores that pose before `die(true)`; roll/animation never write back to gameplay state. |

`npcPresentationOwner` remains the resident/visitor materialization gate. Streaming selects detailed fidelity; it does not erase identity or provision/cargo state. Camera-hidden living agents execute the same spatial rules. This seam enables independent spatial consumers/tests; it does **not** make all NPC construction or simulation Three-free.

## Common Composer execution contract

Each task below is one session and one reviewable commit **when separately authorized to implement/commit**. These are sections of the existing parent, not competing plan IDs. Every task inherits the scope exclusions, invariants and checks here; task-specific additions follow. Before implementation run `pnpm claude:preflight npc-064` per `CLAUDE.md`, then read the named owners and preceding acceptance evidence. Do not implement a later section in the same session.

**Always preserve:** decisions/needs/jobs/action lifecycle; movement speed and numeric/query order; route commitment, water/collision/ground authority, cave context and recovery; combat/interaction ranges and yaw; household/travel/cargo continuity; time-skip semantics; save schema/legacy behavior; identity and world ownership; cadence and presentation LOD. Introduce **zero** random calls and do not reorder existing ones. Existing deterministic guarantees are scoped, not full runtime replay.

**Automated checks:** run the named stage tests with `pnpm exec vitest run <files>`, plus `pnpm run type-check` for any API/runtime change. Run `pnpm run build` for consumer rewiring and projection changes (2A, 2B, 4A, 4B). Final 4C runs full `pnpm test`, type-check and build. Use lint on touched TS files without automatic unrelated fixes. Existing broad failures must be recorded against unchanged baseline, never silently repaired in this refactor. Tests should check externally observable motion/pose/handoff behavior, not mirror setter implementation.

**Manual protocol M:** record before/after seed/save, NPC IDs, world time, route, renderer/asset family (GLB and capsule fallback), settings and elapsed inputs. Observe walking/turning, blocked/steep/water approach, crowd at well, cave entry/interior/exit, combat/defense, dialogue range/audio, death and reloaded corpse, merchant visitor/pack follower, stream-out/in, save/load/rebuild, skip and accompany stay/follow. Use existing NPC inspector/trace and debug APIs to observe identity, route and checkpoint; supplement with paired captures. Do not add a production debug API solely for test convenience. Inspect with the camera turned away as well. Automate stable spatial comparisons; manual checks cover assets/animation/visual alignment. No headless browser is required by default; consult repository browser workflow if later automating.

**Rollback:** stop at the failed stage, preserve evidence, and revert only that stage's authorized commit while no downstream task has landed. If downstream commits exist, revert dependents in reverse order. No hard reset, no schema rollback, no dual-write compatibility mode. Keep useful regression tests. Documentation must distinguish implemented, technically verified and manually verified.

## Stage 0A — Real-agent motion and facing baseline

**Objective / rationale:** protect actual agent spatial execution before adding abstractions; helper tests alone do not cover read/write wiring. **Complexity:** M–L, one test-only commit. **Prerequisites:** none. **Scope/files:** add `src/ai/NpcAgent.spatial.test.ts`; reuse the jsdom/fallback construction pattern in `NpcAgent.timeSkip.test.ts` / `NpcAgent.combatMode.test.ts`, and existing `npcCaveLocomotion` / `npcMovementCaveIntegration` query fixtures. No runtime edits or shared fixture extraction unrelated to this task.

**Steps:** (1) create a deterministic flat-ground fallback agent and typed private harness for selected movement/recovery calls; stub random only where existing code consumes it, recording draw count. (2) Assert exact expected displacement, orientation, arrival/no-move, surface-Y sampling and query order for walk, blocked diagonal/X/Z and resident-ground unavailable cases. (3) Exercise real-agent cave steering, mouth crossing and floor hold with injected world queries; verify final target survives intermediate legs. (4) Apply public separation after `update`, assert immediate XYZ and preserve delayed surface-Y resampling. (5) Cover well/look/combat facing, defensive front/back result, coincident ranged fallback and tipped-death roll. Assert action/RNG traces at controlled checkpoints, not complete nondeterministic sessions.

**Regression:** new suite plus `npcMovementSurfaceRegression`, `npcCaveLocomotion`, `npcMovementCaveIntegration`, `npcMovementRoute`, `npcCrowd`, `npcCombat`, `NpcAgent.combatMode`, `slopeConstraint`. Read all test names under `src/ai/`, `src/terrain/` from the recon. **Manual:** record M motion/crowd/cave/combat reference clips before stage 3A; automated test-only work does not require a browser run to land.

**Acceptance:** tests fail if real movement writes or facing conversion are removed/swapped; cover post-update separation and cave vs surface Y; no runtime diff. This is characterization, not a behavior fix. **Risk/mitigation:** unstable wandering/asset loads — select controlled phases, missing-model fallback and local query stubs, matching existing tests; never change RNG policy to stabilize tests. **Rollback:** remove/revert only this new suite, retaining recorded baseline. **Commit boundary:** `test(npc): characterize live movement and facing for npc-064`.

## Stage 0B — Lifecycle and checkpoint baseline

**Objective / rationale:** protect all non-frame writers and authority transfers. **Complexity:** L, test-only commit. **Prerequisite:** 0A construction pattern. **Scope/files:** new `src/ai/NpcAgent.spatialLifecycle.test.ts`; extend `NpcAgent.timeSkip.test.ts`, `npcTravel.test.ts`, `src/settlement/npcState.test.ts` and `npcPresentationOwner.test.ts` only where missing cases belong. No manager extraction or runtime lifecycle changes.

**Steps:** (1) Construct ordinary resident, living travel reification, dead active corpse and dead legacy/terminal fixtures; capture XYZ/yaw precedence and existing sample call counts. (2) Use real agent `syncAccompanyTravelCheckpoint` → registry serialize/restore → new agent; assert exact XZ, intent, purpose, provision/cargo and identity continuity and current Y reconstruction. (3) Handoff through `beginOffscreenTravelHandoff` → existing offscreen resolver → new agent; assert one progress executor, no double catch-up and no home reset for committed travel. (4) Assert save/rebuild use the same snapshot contract; ordinary resident with no travel still has no universal saved pose. (5) Exercise surface skip, committed travel skip, cave/mouth hold, death during travel, and visitor ownership selection. Use a bounded harness for manager snapshot/handoff ordering, mocking heavy settlement creation if necessary; include a manager-wiring assertion in this suite so a test of helpers alone cannot pass a missing handoff.

**Regression:** new suite, `NpcAgent.timeSkip`, `npcTravel`, `npcOffscreenSurvival`, `npcState`, `npcPresentationOwner`, `npcPostDeath`; existing `worldBundle.terrainModificationRebuild` is ancillary lifecycle coverage, not NPC pose proof. **Manual:** record M stream/reload/skip/corpse/visitor baseline before 3B.

**Acceptance:** no new save field; detailed checkpoint cannot overwrite live progress; offscreen is advanced once; correct reconstruction branch wins. New tests detect stale render checkpoint capture and missing snapshot sync. **Risk/mitigation:** full world fixtures too costly — test real agent/state/resolver plus actual manager wiring with bounded injected/mocked construction; do not claim an end-to-end browser rebuild from that harness. **Rollback:** test-only revert. **Commit boundary:** `test(npc): lock spatial checkpoint and reification contracts`.

## Stage 1 — Read-only structural NPC spatial API

**Objective / rationale:** create a small access seam while retaining mesh authority. **Complexity:** M. **Prerequisites:** 0A and 0B green. **Scope/files:** proposed `src/ai/npcSpatial.ts`, `NpcAgent.ts` public reader methods/view backing, `NpcAgent.spatial.test.ts`; no callers or writers migrate yet.

**Steps:** (1) Add Three-free `NpcSpatialReader` using existing `Vec3`. (2) Add stable frozen getter-based plain position view and scalar facing read, documenting live-view lifetime and explicit snapshot copies. (3) Keep backing reads mesh-based; create no stored pose/shadow state. (4) Add public-method JSDoc with `@domain npc` and type-level checks for a structural reader without mesh.

**Regression:** assert view reference stability, current x/y/z after existing movement/separation/skip, scalar yaw, no `.set/.copy/.add` methods, runtime write rejection through cast and no save payload change; 0A/0B suites. **Manual:** optional smoke; no projection changed.

**Acceptance:** existing outputs identical, caller-visible contract imports no Three, no per-query allocations or second authority. **Risk/mitigation:** a `Readonly<Vector3>` still leaks mutators — return the plain facade, not the vector; copy only for actual snapshots. **Rollback:** API-only revert before consumers land. **Commit boundary:** `refactor(npc): expose read-only live spatial view`.

## Stage 2A — Simulation and lifecycle external readers

**Objective / rationale:** stop external gameplay/checkpoint code depending on render transforms before switching authority. **Complexity:** L; bounded replacements across known callers. **Prerequisite:** 1. **Scope/files/functions:** `npcCrowd.ts: NpcCrowdAgent/run`, `createSettlement.ts:update` NPC candidate map, `SettlementsManager.ts:beginOffscreenTransportHandoff/resolveMerchantJourneyCheckpoints/update detached follow targets/dispatchReadyExpedition`, `player/playerCombat.ts:collectLivingCombatTargets` NPC branch, `app/interactables.ts` NPC range/revalidation/payload branches, `app/gameLoop.ts` NPC→fauna candidate map (2852). Corresponding tests `npcCrowd.test`, `playerCombat.test`, `NpcAgent.spatialLifecycle.test`; add focused NPC consumer tests alongside existing `interactables` tests if required. Leave all animal/player branches intact.

**Steps:** (1) Change crowd structural input to `getPosition` and migrate mock shapes, keeping reusable result buffers and pair order. (2) Replace the four manager XZ reads and settlement/fauna projection. (3) Replace player combat and interaction NPC reads, including the `payload.npc` alias, candidate anchor and spatial-context query; retain live views where old payloads were live. (4) Keep `{x,z}` map/checkpoint snapshots copied exactly as before. Update NPC combat test stub at `playerCombat.test.ts:175` without changing the animal fixture.

**Regression:** `npcCrowd`, `playerCombat`, existing `app/interactables*.test.ts`, 0A/0B, `npcTravel`, `npcPresentationOwner`; add consumer mocks where API position differs from decoy mesh position, proving ranges/checkpoints use API, and a retained payload view follows a later move. Assert exact crowd pushes, checkpoint origins and context Y. Run common type-check/build.

**Manual:** M crowd, combat/interactions, merchant pack-follow and expedition/visitor stream continuity. **Acceptance:** no gameplay/lifecycle direct NPC transform reader remains in this scope; all old scan orders/ranges unchanged. **Risk/mitigation:** replacements confuse animal `agent` with NPC — use the recon owner map, inspect types and diff each mixed branch. **Rollback:** revert this consumer commit; reader API still mesh-backed. **Commit boundary:** `refactor(npc): migrate gameplay and checkpoint spatial consumers`.

## Stage 2B — Presentation and diagnostic external readers

**Objective / rationale:** close remaining external position access and avoid stale render anchors. **Complexity:** M. **Prerequisite:** 2A (same API; sequential review avoids mixed gameLoop edits). **Scope/files/functions:** `app/gameLoop.ts` NPC diagnostic (277) and NPC shadow-distance callback (847), `debug/npcDebugApi.ts` NPC anchor branches (801/809), `ui-vue/lib/drawMinimap.ts` NPC markers, `ui-vue/store.ts` dialogue voice, `app/createApp.ts` quest voice. Test stubs in `npcDialogueOpen/Trade/Voice.test.ts`; existing debug API tests.

**Steps:** (1) Replace NPC positional reads with spatial API; keep `mesh` for scene/shadow object operations where required. (2) Pass structural point straight to existing audio API; do not wrap it in a new Vector3. (3) Migrate narrow NPC stubs, add decoy-render position cases for map/audio/debug where a focused test can reach the consumer. (4) Re-run repository search, manually classifying NPC vs animal/player transforms, destructuring and aliases. Record permitted render-only mesh uses.

**Regression:** dialogue voice/open/trade, `debug/npcDebugApi`, `audio/npcVoicePlayback` tests if present (otherwise existing voice integration tests), `audio/worldAudioSpatial`, 0A/0B. Verify map coordinate calculation and shadow proximity use canonical coordinates with a lightweight caller fixture; no entire rendering harness. **Manual:** minimap, spoken dialogue/quest voice, label/shadow and debug-jump-to-NPC in M. **Acceptance:** no external NPC positional/facing dependence remains; snapshots versus live views retain prior semantics. **Risk/mitigation:** return-value aliases in interaction/audio — retain live view; do not allocate/capture a stale snapshot. **Rollback:** revert this commit; 2A remains valid. **Commit boundary:** `refactor(npc): migrate presentation and diagnostic position readers`.

## Stage 3A — Centralize frame movement and recovery writes

**Objective / rationale:** funnel movement into storage primitives while preserving mesh authority. **Complexity:** M–L. **Prerequisites:** 0A/0B, 2B; baseline motion clips recorded. **Scope/files:** `NpcAgent.ts:steerTo/applySeparation/applyMovementGroundY/attemptLocalEscape/emergencyTeleport`; `NpcAgent.spatial.test.ts`. Add the four private writers defined above; leave constructor/skip/yaw migration to 3B.

**Steps:** (1) Implement position writers as mesh-only assignments, without shadow position or new effects. (2) Replace all movement/ground/separation/recovery writes in the recon ledger, including both coordinates returned by cave resolver axis trials. (3) Preserve every sampling/collision/route/watchdog call, order and early return. Combine adjacent numeric assignments only when no callback/read occurs between them. (4) Move baseline test arrangement writes in this scope to typed private writer access; assert immediate pose after public separation and direct recovery calls.

**Regression:** 0A/0B plus `npcMovementWatchdog`, `npcMovementRecovery`, `npcMovementSurfaceRegression`, `npcCaveLocomotion`, `npcMovementCaveIntegration`, `slopeConstraint`, `navigation`. Assert ordinary XYZ matches pre-change traces, cave Y never uses surface fallback and surface separation does not gain immediate Y correction. **Manual:** M motion/cave/crowd/recovery subset. **Acceptance:** only constructor/skip and explicit yaw/roll exceptions remain outside primitives; mesh is still sole live authority; no path/RNG/sample changes. **Risk/mitigation:** helper inadvertently resamples ground or resets routes — storage primitives must be side-effect-limited; inspect query and action traces. **Rollback:** revert writer call replacements and primitives as one commit. **Commit boundary:** `refactor(npc): centralize movement and recovery position writes`.

## Stage 3B — Centralize initialization, skip and facing writes

**Objective / rationale:** complete writer coverage before authority changes. **Complexity:** M. **Prerequisite:** 3A; lifecycle/corpse reference observations recorded. **Scope/files:** `NpcAgent.ts:constructor/catchUpCommittedTravel/applyTimeSkipPlacement/tickMeleeCombat/tickRangedCombat/update well and lookAtPlayer/steerTo`; add mesh-backed private yaw writer. `die()` roll remains explicit presentation exception. `NpcAgent.spatialLifecycle.test.ts`, `NpcAgent.spatial.test.ts`, `NpcAgent.combatMode.test.ts`.

**Steps:** (1) Route home, corpse and travel constructor positions, skip/travel reification and every gameplay yaw write through primitives. Initialize constructor dependencies in an order safe for first writes; retain original sampling calls and death-before-travel precedence. (2) Preserve roll and animation paths untouched. (3) Audit all writes from the recon ledger, including `.copy`, `.set`, component assignment/increment and alias mutation; scan repo/test writes again. (4) Migrate any temporary baseline test setup to private primitives; production still exposes only validated commands.

**Regression:** 0A/0B, `NpcAgent.combatMode`, `npcCombat`, `npcTravel`, `npcOffscreenSurvival`, `npcPostDeath`, `npcPresentationOwner`. Assert same-call constructor/skip pose and yaw, death pose immediately on reconstruction, yaw front/back defense, no extra corpse loot or changed provision/cargo. **Manual:** M skip/reload/rebuild, corpse, GLB/fallback and combat-facing subset. **Acceptance:** all canonical-position writes are in position primitives; all gameplay yaw writes in yaw primitive; roll is clearly separate; no state mirror yet. **Risk/mitigation:** accidental resetting corpse Euler or skipping projection on an early return — assert roll and immediate external pose after each lifecycle entry. **Rollback:** revert this commit without changing schema/state. **Commit boundary:** `refactor(npc): centralize lifecycle placement and gameplay facing`.

## Stage 3C — Migrate internal spatial reads

**Objective / rationale:** make the later storage switch small and auditable. **Complexity:** L, one mechanical but carefully reviewed file migration. **Prerequisite:** 3B. **Scope/files:** every method in the recon internal access inventory in `NpcAgent.ts`, excluding primitive mesh backing and presentation roll; `npcCombat.ts` comments describing passed yaw; `NpcAgent.spatial*.test.ts`. No decision extraction or broad vector cleanup.

**Steps:** (1) Replace internal position/yaw reads with reader methods or their private backing accessors, keeping copies at snapshot boundaries. Cover context, checkpoints, damage/death, combat fallback, perception, action producers, escort/payment/work/burial, recovery and audio, not only locomotion. (2) Replace `mesh.position.distanceTo` at update distance and idle social-distance checks with a structural XYZ distance operation preserving Three's arithmetic (`sqrt(dx*dx + dy*dy + dz*dz)`); do not change to XZ or square a threshold as an optimization. Use a small local helper only if needed; no general math library. (3) Keep vector scratch/destinations internal and Three-backed where current helper signatures still require them. (4) Read the complete inventory against the diff, including `p` and `pos` aliases. Update tests to use API for simulation assertions while keeping explicit mesh parity assertions.

**Regression:** 0A/0B and relevant `npcProfessionWork`, `npcLogistics`, `npcDestinationThreat`, `socialBehaviour`, `NpcAgent.combatMode`, `npcPlayerReactionVoice`, `npcCombat`, plus stage 2 consumer tests. Assert boundary distances at equal/just-inside/just-outside radii, with nonzero Y where previously XYZ; compare controlled action/query/RNG traces. **Manual:** M ordinary routine, needs/work and social/accompany behavior, combat/voice subset. **Acceptance:** only approved mesh-backed accessors/writers and render-only operations touch NPC transforms; all gameplay reads are through seam; still no plain stored position. **Risk/mitigation:** replacing methods changes distance/freshness or shallow readonly leaks — explicit numeric and retained-view tests, no new snapshot policy. **Rollback:** revert read migration; centralized writers survive. **Commit boundary:** `refactor(npc): route internal spatial reads through the seam`.

## Stage 4A — Switch position authority only

**Objective / rationale:** make canonical XYZ independent from rendering without coupling it to the facing switch. **Complexity:** M implementation, high acceptance sensitivity. **Prerequisites:** stages through 3C green, source ledger rechecked, all relevant earlier manual comparisons recorded and no unexplained divergence. **Scope/files:** `NpcAgent.ts` position field/backing accessor/three position primitives and new `syncPresentationPosition`; `NpcAgent.spatial.test.ts` / `NpcAgent.spatialLifecycle.test.ts`. No consumer, algorithm, yaw or persistence changes.

**Steps:** (1) Allocate private mutable plain `Vec3` with constructor initial values in the same home → sampled-Y → corpse/travel order; do not take a per-frame mesh snapshot. The home point can seed the field directly before the first writer, preserving sample order. (2) Make the reader facade delegate to that field. (3) Change the three position primitives to update the field then copy numeric XYZ to mesh synchronously via one projection method. (4) Remove mesh-backed position access outside projection; keep mesh yaw authoritative until 4B. (5) Add render tampering/detachment tests and authority-specific negative checks. No runtime feature flag or bidirectional fallback.

**Regression:** all motion/lifecycle tests and stages 2 consumer tests. Assert canonical/render XYZ after every ordinary mutation path, including same-tick separation, private recovery, constructor, skip and reification; use `1e-9` tolerance for computed coordinates and exact equality for direct copies. Deliberately change mesh XYZ between calls: range, checkpoint, context, route and next movement must use canonical XYZ; explicit projection restores mesh without reading it. Repeat controlled living-agent updates with `mesh.visible=false` and removed parent; canonical motion/action/query/RNG traces equal the visible fixture. Test frozen/dead early returns preserve pose; do not require arbitrary mesh tampering to repair on an update that performs no spatial write. Common type-check/build required.

**Manual:** M surface/steep/water/cave, separation, skip/reload/rebuild and range/voice/map/corpse alignment with both fallback and GLB. Observe from/away from camera. **Acceptance:** exactly one canonical XYZ; no mesh→runtime import after initial construction; no render gate in projection; exact handoff/save schema parity. **Risk/mitigation:** stale pose after an out-of-update mutation — immediate writer projection, test each ledger entry; increased copy cost — no allocations/scans, compare representative settlement frame/CPU evidence without unrelated tuning. **Rollback:** revert this field/backing/projection commit to mesh authority; prior writer/read APIs remain valid. Never restore via a permanent mesh→state copy loop. **Commit boundary:** `refactor(npc): make runtime position authoritative`.

## Stage 4B — Switch gameplay facing authority

**Objective / rationale:** complete canonical spatial pose in a separately verifiable change. **Complexity:** S–M, high combat/visual sensitivity. **Prerequisite:** 4A automated and manual acceptance. **Scope/files:** `NpcAgent.ts` private `facingYaw`, facing getter/writer, new `syncPresentationFacing`; `NpcAgent.spatial.test.ts`, `NpcAgent.combatMode.test.ts` and defense assertions. XYZ authority stays unchanged.

**Steps:** (1) Initialize plain numeric yaw to current wrapper default `0`, restoring corpse yaw via the existing constructor branch. (2) Switch getter/writer backing to that scalar; synchronously set only `mesh.rotation.y`. (3) Keep combat conversion in `npcCombat` and arrow yaw math unchanged. (4) Verify no retained rotation alias drives defense/death. Leave root roll, animations and scale outside canonical pose.

**Regression:** all spatial suites, `NpcAgent.combatMode`, `npcCombat`, `npcPostDeath`, player target/interaction tests. Assert facing and rendered yaw agree after steering, both combat modes, well/look and corpse restore. Tamper render yaw/roll: defense and death checkpoint use canonical yaw; projection corrects yaw while preserving corpse roll; coincident-target fallback uses unchanged facing convention. No additional RNG draws. Common type-check/build.

**Manual:** M turns, frontal/rear defense, ranged shots, well/player orientation and fresh/reloaded corpse with GLB and capsule fallback. **Acceptance:** runtime field owns gameplay yaw, XYZ remains canonical, presentation-only roll cannot change facing, corpse animation not reset by projection. **Risk/mitigation:** `+PI` migration or full Euler reset — tests of actual defense outcomes and roll, reviewed numeric assignments. **Rollback:** revert only yaw authority commit; canonical XYZ remains valid. **Commit boundary:** `refactor(npc): make gameplay facing independent of render rotation`.

## Stage 4C — Guard the seam and close verification

**Objective / rationale:** prevent reintroduction and document the boundary actually achieved. **Complexity:** M plus manual verification time. **Prerequisites:** 4B accepted. **Scope/files:** proposed `src/ai/npcSpatialBoundary.test.ts`; update `docs/state/npc.md`, `docs/architecture/ARCHITECTURE.md` simulation/presentation paragraph, this plan's execution status and a new `docs/plans/implementation-notes/npc-064-agent-performance-spatial-state-seam-implementation-notes.md`. Update manual `CODE_INDEX` ownership entry if needed, never generated sections. No runtime optimization or AnimalAgent edits.

**Steps:** (1) Add a narrow source/import boundary assertion: `npcSpatial.ts` has no Three/runtime presentation import; NPC internal transform access is allowed only in numeric projection and explicit corpse roll/presentation paths. Use a syntax-aware check for owning method/alias if necessary, not a repository-wide regex banning animal/player meshes. Protect `npcCrowd` structural contract too. (2) Re-run external NPC consumer audit using the report, including test fixtures and retained aliases; record allowed render-only uses. (3) Run full checks and finish M acceptance evidence, including lifecycle comparisons not covered by tests. (4) Write implementation notes with per-stage commit/test/manual evidence and actual remaining limitations. Mark parent `verification needed` while required manual evidence is missing; `done` only after it exists. Do not update state docs to claim complete headless execution.

**Regression:** full `pnpm test`, type-check, build, touched-file lint; guard must fail for a new simulation-side `mesh.position` read and must allow corpse roll. **Manual:** complete M, paired parity evidence and equivalent settlement workload check for unacceptable synchronization overhead; follow existing browser guidance, record hardware/settings before making any performance claim.

**Acceptance:** all stages individually reviewable, no new spatial authority/registry/save field, no unexplained behavior/visual divergence, documented technical/manual distinction. **Risk/mitigation:** guard overclaims full decoupling — deliberately narrow scope and explicit exceptions; mixed corpse visibility stays documented. **Rollback:** revert guard/docs commit without runtime effects; actual runtime regressions revert the responsible authority stage plus dependents. **Commit boundary:** `test(npc): guard spatial ownership and document projection boundary`.

## Composer readiness matrix

“Ready” means planning inputs are sufficient for the stated session, not that implementation has been approved or tests already added. Later conditional stages must not skip predecessors.

| Order | Task | Session size | Ready now? | Required evidence before starting / landing |
| --- | --- | --- | --- | --- |
| 1 | 0A motion/facing baseline | M–L | **Implemented; targeted checks passed** | 21 new tests; bundle 9 files / 127 tests passed. Global type-check baseline errors recorded in notes. Record motion reference before 3A. |
| 2 | 0B lifecycle/checkpoint baseline | L | **Yes: next task** | Reuse 0A fixture pattern; add bounded real-agent/manager handoff coverage. |
| 3 | 1 reader API | M | Conditional | 0A/0B added and green; immutable live-view contract tests. |
| 4 | 2A simulation/lifecycle consumers | L | Conditional | Stage 1; decoy-mesh consumer tests, checkpoint/interaction freshness, type-check/build. |
| 5 | 2B presentation/debug consumers | M | Conditional | 2A; audio/map/debug/shadow checks, type-check/build, manual presentation smoke. |
| 6 | 3A movement/recovery writers | M–L | Conditional | All baselines plus motion reference; real cave/separation/recovery parity. |
| 7 | 3B lifecycle/yaw writers | M | Conditional | 3A; lifecycle reference, constructor/skip/death/defense parity. |
| 8 | 3C internal reads | L | Conditional | Complete central writer ledger; threshold/Y, action/query/RNG trace regression. |
| 9 | 4A canonical position | M + manual gate | **Not yet** | All prior automated/manual gates; same-call pose and render-independence tests, lifecycle handoff proof. |
| 10 | 4B canonical yaw | S–M + manual gate | **Not yet** | 4A accepted; actual defense/arrow/death and roll evidence. |
| 11 | 4C boundary/acceptance | M + manual gate | Conditional on 4B | Full tests/type-check/build; completed M and written evidence. |

This revises the original six-stage hypothesis into **11 bounded sessions**: two baseline tasks, one read API, two external-reader tasks, three centralization/read-migration tasks, two authority switches and one closure task. Stages 4A/4B switch separate fields atomically; neither leaves competing authorities for a field. All sessions must remain within one commit; if a baseline harness cannot fit, stop with a named coverage gap and split that test-only task before proceeding, never enlarge the authority-switch commit.

## Unresolved risks and future work

**Implementation gates, not optional cleanup:** real-agent cave/mouth and recovery coverage, manager snapshot/handoff wiring tests, retained interaction view freshness, GLB/fallback visual acceptance, death roll versus facing, and representative copy/getter overhead. The first two baseline stages are designed to resolve these. A passing build alone cannot resolve them. Manual observations have **not** yet been collected in this planning task.

**Existing limitations to preserve:** corpse visibility participates in loot/lifecycle; ordinary residents do not universally persist pose; travel persistence stores XZ, reconstitutes Y and does not persist detailed yaw; runtime movement is not globally deterministic replay; mesh creation and animation remain required. Hidden living-agent equivalence does not promise universal NPC headless operation or visibility-independent corpse processing.

**Future work, not part of these commits:** bounded AnimalAgent recon only if later requested, possible measured batching of projection, optional broader ARCH-03 import enforcement after proven seams, eventual render-object reconstruction independent of agent lifetime. Keep `npc-061` and the existing `npc-063`/render-LOD/offscreen continuity plans separate. No new backlog items are created here. NPC-first is the recommended migration; fauna's broader test suite does not outweigh mounted/corpse/habitat/persistence complexity.

## Original Stage 0A handoff (targeted checks complete)

> Implement **npc-064 Stage 0A only** against current V1 `main`. Run the repository preflight, read this plan and the linked 2026-10-27 recon, then add `src/ai/NpcAgent.spatial.test.ts` using existing jsdom/fallback-agent patterns. Characterize real-agent surface/cave/mouth movement, resident-ground hold, separation after update, recovery, gameplay yaw/defense and corpse roll with controlled inputs and unchanged RNG consumption. Run the named Stage 0A suites. Do not change runtime code, create spatial APIs, switch authority, fix behavior, edit fauna, commit or push without separate authorization. Report passing checks, missing coverage and manual reference observations still needed before Stage 3A.

## Next task to give Cursor Composer

> Implement **npc-064 Stage 0B only**. Read the implementation notes and run the repository preflight, then add the lifecycle/checkpoint characterization specified above. Exercise real NPC initialization, detailed/offscreen handoff, registry serialization/reification, loaded time-skip and actual manager snapshot/handoff wiring. Preserve existing schema, identity, purpose, provisions and cargo semantics. No runtime changes, spatial API, behavior fixes or fauna edits. Run the Stage 0B regressions and report remaining manual evidence. Do not commit or push without separate authorization for that stage.

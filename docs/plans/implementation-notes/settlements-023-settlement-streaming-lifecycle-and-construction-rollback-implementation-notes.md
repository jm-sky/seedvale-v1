# Implementation Notes: Settlement async streaming lifecycle and construction rollback

Plan: `settlements-023-settlement-streaming-lifecycle-and-construction-rollback.md`  
Reviewed against `main`: 2026-10-28 (`fc8a8bf3`). Runtime matches review 028's pinned `0d4c2b2b` except `src/settlement/props.ts` (instanced V2 wood-pile tiers, `4347c274`): only extra awaits inside `buildSettlementProps`, no new global side effects before return; shared tier geometry is protected by `sharedGpu`.  
Review: `docs/reviews/2026-10-28--028--settlements-023-streaming-lifecycle-plan-review.md` (R1–R6).

Line numbers below are from `fc8a8bf3` (manager/factory/NpcAgent unchanged since `a5df9879`); re-grep the symbol before editing. "Confirmed" = read in source during finalization. "Unverified" = inferred, check before relying on it.

## Scope fence

In scope: audit F1 (pending residency) and F6 (partial construction), plus the review-required pieces: same-ID ownership, pre-acceptance travel write, helper-local cleanup, late fence continuation, acceptance/notification errors.

Out of scope (do not touch): benchmark readiness/fingerprints (F2/F3), vegetation LOD (F4), cache read amplification (F5), presentation-owner transitions across awaits (F7), grass request identity (F8), `world-039` whole-bundle failure cleanup, `persistence-007` New Game ordering, radii/hysteresis values, worldgen, save schema, eager-neighbor startup cost (recorded in `LOOSE-ENDS.md`). If a test exposes an F7 defect, record it; do not fix it here.

## Verified baseline

### Manager (`src/settlement/SettlementsManager.ts`, `createSettlementsManager`, async, 422)

- `type Entry = { def, settlement, pendingPromise }` (155). `entries: Map<string, Entry>` (911). No generation token; same-ID replacement is impossible today only because pending entries are never removed by distance.
- Radii are injected: `SETTLEMENT_LOAD_RADIUS = 300`, `SETTLEMENT_UNLOAD_RADIUS = 420` (`src/app/worldBundle.ts:279-282`). `recheckDistance = loadRadius * 0.25` = 75 (1159). `lastCheckX/Z` start at `Infinity`, so the first `update` always rechecks.
- `update(...)` (around 1440) receives `playerPos` every frame, but only rechecks after ≥75 units of movement. **No latest-player-position field exists**; add one (two numbers, written every `update`). `lastNowDays` / `lastDayLengthSec` (905-906) and `currentNowDays()` (907) already exist for latest time inputs.
- `recheck` (1306): loads at `dist <= loadRadius`; unload loop `continue`s for `isHome || pendingPromise` (1318), unloads at `dist > unloadRadius` (1320). Ends with `resolveTravelAndTransportCheckpoints` (1393), which advances **every** `npcStates` record's off-screen travel. Unchanged by this plan.
- `ensureLoaded` (1161): `entries.has(id)` refusal; creates entry, `syncMidpoints()`, home-only damage seeding, then `waitForChunks → createSettlement → then(accept) → catch(delete) → finally(clear pending via entries.get)`. The `.then` uses `entries.get(def.id)` (not the captured entry), assigns `cur.settlement`, then `reclaimDetachedHouseholdLivestock`, `setDayNight(lastDayNight)`, transport `clearExecution` loop over `settlement.npcs`, `onSettlementAvailable`. Shared `.catch` deletes the entry even if `cur.settlement` was already assigned (R5, confirmed).
- Home path (1072-1100): `homeReadyPromise = createSettlement(...).then(...)` with its own `disposed` check, assigns `homeSettlement`, sets/creates the entry, reclaim, day/night, `syncMidpoints`, notification, returns settlement. Home entry is created with `pendingPromise` = swallowed `homeReadyPromise`. **Home acceptance does not run the transport `clearExecution` loop** — keep that difference unless you deliberately unify it (if you unify, note it; it is an existing behaviour difference, not a goal of this plan).
- Eager neighbors: `neighborsFor({0,0}).slice(0, EAGER_NEIGHBOR_COUNT=2)` → `ensureLoaded` (1214), regardless of player position. Ring-1 neighbors are ~280–400+ units from home (`SETTLEMENT_GRID_STEP = 280` plus jitter), so they can exceed `unloadRadius`.
- `unload` (1291): agriculture stamp, `livestock.capture`, `rats.capture`, `beginOffscreenTransportHandoff`, per-NPC `beginOffscreenTravelHandoff`, `dispose`, `entries.delete`, `syncMidpoints`. Accepted runtimes only.
- `reclaimDetachedHouseholdLivestock` (794) moves detached animals into `settlement.livestock` and `livestock.upsert`s them. It is an authoritative transfer: after it runs, the runtime must never be discarded speculatively (disposal would destroy reclaimed animals). Hence assign first, reclaim after.
- `dispose()` (1722): sets `disposed`, disposes detached livestock, every `entry.settlement`, midpoints, then clears all registries. Pending continuations currently notice only through `entries.get(...) == null`.
- `syncMidpoints` (around 1130) derives midpoint signposts from `entries` (pending entries count). Any entry deletion must be followed by `syncMidpoints()`.

### Factory (`src/settlement/createSettlement.ts`, `createSettlement`, 547)

Acquisition order (all confirmed):

| Line | Acquisition | Current release in `dispose()` (1739) |
| --- | --- | --- |
| 687 | `await buildSettlementProps(...)` returns `group` (helper has no scene/global side effects before return; it awaits `plantEntrancePalisade` into its own detached group) | — |
| 729 | `scene.add(group)` | `disposeSettlementGroup(group)` + `removeFromParent` |
| 833 | `pointLightBudget.registerSubtree(group)` | `unregisterSubtree(group)` |
| 853 | `registerSettlementColliders()` → `registerColliders(def.id, …)` | `clearColliders(def.id)` |
| 868 | `forest.lifecycle.registerPresence` per `landmarks.trees` (keyed by tree id) | `unregisterPresence(tree.id)` |
| 919-943 | authoritative: `householdRegistry.getOrCreate`, `resolveSettlementAgricultureCatchUp` (idempotent) | none (must stay) |
| 985 | `await spawnLivestock(...)` (helper: `await ensureLivestockTemplates()` at 695, then synchronous `scene.add` at 759/782/813/864, returns at 868) | `disposeLivestock(livestock)` |
| 1038 | `await createSettlementRats(...)` (helper: template await 273, then synchronous `spawnOne` → `scene.add` 298) | `rats.dispose()` |
| 1062 | `await createSettlementSignposts(...)` (helper adds namepost prop + CSS2D label to `group` at ~133, then `await loadPropTemplates` for the dock) | `signposts.dispose()` |
| 1381 | resident `Promise.all(materializeSettlementResident)`; each `scene.add(agent.mesh)` at 1376 as it resolves | per-agent `dispose` + `removeFromParent` |
| 1493 | visitor `Promise.all`, then `agents.push(...visitorAgents)` | same |
| 1541 | `group.add(pile)` (group-owned) | via group |

- `let agents: NpcAgent[]` (1236), `let livestock`, `let signposts`; `rats` is `const`.
- `materializeSettlementResident` (1292) performs idempotent authoritative init before `NpcAgent.create`: `npcStateRegistry.getOrCreate`, starting wealth, artisan profile, merchant stock, expired-corpse finalization. All idempotent → keep, do not undo on failure.
- Persistence accessors used by spawn are read-only (`LivestockPersistence.getSaved/getRemoved`, `livestock.ts:165`). Rats' persistence: assumed read-only by the same pattern — **unverified**, check `SettlementRatsDeps.ratPersistence` before relying on it.
- `syncAuthoredRepairPresentation` (1572): two `void plantEntrancePalisade(group, …).then(mesh => { visuals.x = mesh; registerSettlementColliders() })` (1602, 1616). `plantEntrancePalisade` (`settlementPalisade.ts:359`) awaits a template, builds an instanced group and `group.add`s it. No lifetime check anywhere (R4 confirmed). Only these two call sites are runtime-late; the five `props.ts` call sites (1945-2054) run during construction into a detached group.
- `houseDoors.update(...)` also calls `registerSettlementColliders()` from `update` (1729); `update` is never called after dispose, so no guard needed there.

### Registries keyed by stable ID (R1)

- `createColliderRegistry` (`src/world/collision.ts:275`): `setColliders(ownerKey)` replaces, `clearColliders(ownerKey)` deletes by key — no instance token.
- `treeLifecycle.registerPresence/unregisterPresence` (`src/world/treeLifecycle.ts:873`) keyed by tree id.
- `pointLightBudget.registerSubtree/unregisterSubtree` keyed by the group object (instance-safe).

Keyed registries are safe only if two live instances of one settlement ID never overlap. D1 guarantees that structurally; do **not** change the collider/forest APIs.

### NPC travel (R2)

- `NpcAgent.create` is called **only** from `createSettlement.materializeSettlementResident` (1355) (confirmed by grep). The constructor runs after the model await inside `create` (`new NpcAgent(...)` at 1997 / capsule fallback 2020).
- Constructor (`src/ai/NpcAgent.ts` 1943-1952): if alive and `npcState.travel`, `reifyNpcTravel(travel, forest.getWorldDays())` (pure, `npcTravel.ts:198`), places the mesh, then **writes** `npcState.travel = accompanyCommitment || keepsNpcTravelAfterReify(reified) ? reified : null`. This drops `execution` (off-screen clock), and drops ordinary non-purpose travel entirely. It is the only direct `npcState.*` assignment in the constructor (awk over 1716-1955); method calls made from the constructor were not traced exhaustively — see residual risks.
- `NpcAgent.dispose` (3967) does not restore anything.
- Off-screen progression: `resolveNpcTravelCheckpoint` (`src/ai/npcTravelCheckpoint.ts:35`) advances any record with `execution`; it runs from `recheck` and `resolveTimeSkip` over all `npcStates`, independent of presentation. A record left untouched during a pending build keeps progressing correctly.
- Other `travel.execution` readers in `NpcAgent` (2152 debug snapshot, 4316 debug text, `catchUpCommittedTravel` 3868) only run for live/ticked agents.

## Decisions and mechanisms (from plan D1–D5)

### D1 — retain-until-settled (manager)

- Keep the pending skip in `recheck`. Do not delete or replace pending entries by distance. This is what makes "one resource-producing factory per ID until rollback settles" true without a draining queue: the entry occupies the ID until its whole promise chain (including factory rollback, which completes before the factory promise rejects — see D5) has settled.
- Add one small pure predicate (export it for tests, JSDoc `@domain settlements`), for example `shouldAcceptSettlementResidency({ isHome, isEagerStartup, dist, distPlayerToHome, playerKnown, loadRadius, unloadRadius })`:
  - home → accept;
  - `dist <= unloadRadius` → accept (band retained, equality retained);
  - `isEagerStartup && (!playerKnown || distPlayerToHome <= loadRadius)` → accept;
  - otherwise reject.
- Store `eagerStartup: true` on entries created by the eager loop (add an optional field to `Entry`, or pass a flag into `ensureLoaded`). After acceptance, eager entries follow the ordinary `recheck` unload rule — exactly today's behaviour at home.
- Evaluate the predicate with the latest observed player position at two points: right after `waitForChunks` (reject → delete entry + `syncMidpoints`, no factory started) and at factory completion (reject → speculative discard, see below).
- Liveness check for every continuation: `!disposed && entries.get(def.id) === entry`. In `finally`, clear `entry.pendingPromise` on the **captured** entry; never `entries.get(id)`.
- `ensureLoaded` should early-return when `disposed`.
- Do not add forced rechecks, anchor resets or per-frame scans. Re-entry after a discard is the ordinary unloaded state under the existing 75-unit granularity (the same as after a normal unload).

### D2 — travel commit at acceptance (NpcAgent + manager)

- Split the constructor block: keep mesh placement from the pure `reifyNpcTravel` result; remove the `npcState.travel =` write.
- Add a public method on `NpcAgent` (JSDoc `@domain npc`; name suggestion `commitDetailedTravelOwnership(nowDays: number)`), idempotent, which: returns if dead or no `npcState.travel`; re-reifies from the **current** `npcState.travel` at `nowDays`; repositions the mesh with `sampleHeight`; applies the same keep/null rule as today (`accompanyCommitment || keepsNpcTravelAfterReify`). Guard against running twice (a boolean on the agent).
- Manager acceptance calls it for every `settlement.npcs` entry with `currentNowDays()`, in the same loop as the transport `clearExecution` handoff (streamed path) and also on the home path. Before acceptance no agent is ticked (`entry.settlement` unset ⇒ `update`/`setDayNight`/`resolveTimeSkip` skip it), so the deferred write is safe.
- If off-screen resolution blocked/arrived the record during construction, the commit sees that state. If travel became `null` meanwhile, the agent keeps its construction placement — acceptable; note it in tests.
- Discard path: dispose only. No `beginOffscreenTravelHandoff`, no transport `beginOffscreenExecution`, no agriculture stamp, no animal capture.

### D3 — late fence guard (factory)

- Add `let alive = true` to the `createSettlement` closure; `dispose()` sets it false first.
- `plantEntrancePalisade(group, placements, instanceName, isAlive?: () => boolean)`: after `await loadPropOrFallback(...)`, `if (isAlive && !isAlive()) return null` before `buildInstancedProps`/`group.add`. The `props.ts` callers keep the old signature.
- In both `.then` continuations in `syncAuthoredRepairPresentation`: `if (!alive) { if (mesh) { mesh.removeFromParent(); disposeObject3D(mesh) } return }` before assigning visuals or registering colliders. Do not re-arm `*NeedsRestorePlant`.

### D4 — acceptance helper (manager)

One local helper used by home and streamed paths, roughly `acceptSettlement(entry, settlement, opts)`:

1. `entry.settlement = settlement` (and `homeSettlement` for home): ownership transferred; from here normal `unload`/`dispose` owns cleanup.
2. In one try/catch that logs (`console.error('[SettlementsManager] …', id, err)`) and does **not** delete or dispose: `reclaimDetachedHouseholdLivestock`, `setDayNight(lastDayNight)`, travel commit (D2), transport `clearExecution` (streamed path as today), `syncMidpoints` (home).
3. `onSettlementAvailable` in its own try/catch; log only.

Rename/split the current shared `.catch` so it handles **only** factory rejection or pre-factory failure (no settlement returned): log (skip the log when the entry is stale), `if (entries.get(id) === entry) { entries.delete(id); syncMidpoints() }`. A stale completed result is disposed in the `.then` before acceptance and never reaches that catch.

`homeReady`: still rejects on factory rejection and on `disposed`; resolves with the accepted settlement even if step 2 or 3 logged an error.

### D5 — factory rollback (factory + helpers)

- Make `livestock`, `rats`, `signposts` nullable `let`s initialized `undefined`, `agents` initialized `[]`, and track `sceneAttached`, `lightsRegistered`, `collidersRegistered`, `forestRegistered` booleans (or equivalent nullable handles) as each acquisition happens.
- One `releaseAcquired()` closure, idempotent via `released` flag, releasing in reverse order of the table above and skipping missing parts. Returned `dispose()` = set `alive = false` (D3) + `releaseAcquired()`. Wrap everything from `scene.add(group)` to the `return` in `try { … } catch (err) { releaseAcquired(); throw err }`. Put the `buildSettlementProps` call inside a narrow try that disposes the returned group if a later synchronous step before `scene.add` throws (cheap; not strictly needed).
- Batches: replace both `Promise.all` calls with `Promise.allSettled`; push every fulfilled non-null agent into `agents` in input order (deterministic), then throw the first rejection reason. `bootMarkEnd('npcCreation')` stays in `finally`.
- Helper-local contracts (each a small try/catch, no framework):
  - `spawnLivestock`: if the synchronous attach section throws, dispose + `removeFromParent` the agents already created, rethrow.
  - `createSettlementRats`: same around the `spawnOne`/`spawnNew` loops.
  - `createSettlementSignposts`: if anything after the first `createLabeledProp` throws, `disposeLabeledProp(inst)` each created instance (removes CSS2D label object and DOM element; props stay group-owned), rethrow. CSS2D elements are **not** removed when an ancestor group is detached — this is why the label release is explicit.
- Most asset loads have fallbacks (`loadPropOrFallback`, capsule fallback in `NpcAgent.create`), so ordinary asset failure rarely rejects. Inject failures through module mocks, not by breaking asset URLs.
- Shared GPU safety: `disposeObject3D` skips `userData.sharedGpu` geometry/materials (`src/assets/loadGltf.ts`). Do not add direct `geometry.dispose()` calls in rollback.

## Safe implementation sequence

1. **Stage A tests first** (failing on current code where the bug is reachable): pure predicate tests; manager tests for stationary post-teleport completion and sub-threshold movement; factory tests for partial failure with a late sibling. Same-ID successor tests are invariant tests (not reproducible on old code, R6).
2. **D5 + D3** (factory-only, no manager behaviour change). Land-able alone: every existing path still works, failures now clean up.
3. **D2** (NpcAgent constructor split + method) together with **D4** (manager acceptance helper calling it). Must land together: removing the constructor write without the acceptance call would leave accepted agents with off-screen `execution` still set.
4. **D1** (latest position, predicate, pre-factory and completion checks, captured-entry continuations, `disposed` guards, eager flag). Requires steps 2–3 already in place, because discards rely on the factory dispose and on no pre-acceptance travel mutation.
5. Stage D integration tests, `npx tsc --noEmit`, targeted `pnpm vitest run src/settlement src/ai/npcTravel*`, then full `pnpm run test`, `pnpm run lint:fix`, `pnpm docs:sync`; then manual browser check (travel, teleport away mid-build, return, home startup, world rebuild).

Do not ship step 4 before steps 2–3.

## Race scenarios to cover

| Schedule | Expected |
| --- | --- |
| Build starts; player teleports beyond 420; build completes with no further movement | Discarded at completion; `dispose` called once; no notification; entry and midpoints removed. |
| Player moves < 75 units from the last check point but crosses 420 before completion | Discarded (latest position, not `lastCheckX/Z`). |
| Completion at exactly 420 / inside band 300–420 | Accepted. |
| Player leaves beyond 420 and returns inside 300 before completion | Accepted by the same entry; exactly one factory call for the ID. |
| Player beyond 420 when `waitForChunks` resolves | No factory call; entry deleted. |
| Manager `dispose()` during `waitForChunks` / during factory | No factory start / result disposed; no registry writes after dispose. |
| Eager neighbor beyond 420 while player is at home | Accepted (startup exception), unloaded by the first later `recheck`. |
| Same eager neighbor when the player position is known and > 300 from home | Discarded. |
| Factory rejects after group attached and colliders registered | Group removed, light subtree unregistered, `clearColliders(def.id)` called, forest presence unregistered; entry deleted only after rollback; re-entry builds again. |
| Resident A rejects while resident B still pending; B resolves later | Factory promise settles only after B; B disposed and detached; no scene child left after flushing microtasks. |
| Visitor batch rejects after residents attached | All residents and fulfilled visitors disposed. |
| Helper rejects before returning (livestock/rats/signposts attach section) | Helper-local cleanup; no scene child or DOM label left. |
| Rejected/discarded build containing an NPC with off-screen `execution` (ordinary and purpose-backed) | `npcState.travel` deep-equal to its off-screen-progressed value; `execution` still present; a later `resolveNpcTravelCheckpoint` / time-skip during the build still advances it. |
| Accepted build with the same NPC | After acceptance `execution` removed, mesh at interpolated point for acceptance-time `nowDays`; transport `execution` cleared only now. |
| Throwing `onSettlementAvailable` | Settlement stays in `entries`, still updated and later unloaded normally; one notification attempt. |
| Throwing pre-notification step (e.g. stubbed `setDayNight`) | Same as above, error logged. |
| Home notification throws | `homeReady` resolves. |
| Home factory rejects | `homeReady` rejects; no residue. |
| Fence restore pending, settlement disposed, template resolves | No mesh in group, no `registerColliders(def.id)` call after dispose. |
| Fence late completion after a successor of the same ID registered colliders | Successor colliders unchanged. |

## Test seams and fixtures (verified that none exist yet)

- No `SettlementsManager.test.ts` or `createSettlement.test.ts` exists. Create them next to the sources.
- Default vitest environment is node; use `// @vitest-environment jsdom` per file when DOM/CSS2D labels are involved (pattern: `settlementSignposts.test.ts`).
- Module mocking precedent: `vi.mock(path, async (importOriginal) => …)` in `src/world/createCaves.test.ts:40`.
- Manager tests: `vi.mock('./createSettlement', …)` with a deferred-promise factory returning a minimal fake `Settlement` (spy `dispose`, `npcs` with spy `commitDetailedTravelOwnership`, `livestock`/`rats` arrays, `setDayNight`, `update`). `waitForChunks` is a constructor parameter — pass a deferred. Stub `RegionParams`/`TerrainSamplers` the way `src/settlement/settlementNameUniqueness.test.ts:28-70` does. The manager constructor signature is long; a local `makeManager(overrides)` helper in the test file is expected. Fixture cost is the main uncertainty: if `defFor` with stubbed samplers cannot produce deterministic home/neighbor defs cheaply, test the predicate and continuation logic through the smallest exported seam instead, and say so in the verification notes — do not add a production-side injection framework.
- Factory tests: `vi.mock` `./props` (`buildSettlementProps` returning a real `Group` with landmarks fixture), `./livestock`, `./rats`, `./settlementSignposts`, `../ai/NpcAgent` (controllable `create`). Assert scene children, `registerColliders`/`clearColliders` calls, light budget calls, and agent `dispose` counts. **Unverified:** whether `createSettlement`'s other imports are cheap enough to load in vitest; if not, isolate the batch helper and `releaseAcquired` behind small exported functions and test those, plus one coarse smoke test.
- Travel tests can use the real `reifyNpcTravel`/`resolveNpcTravelCheckpoint`; for the NpcAgent method, a capsule-fallback agent may suffice — check existing `NpcAgent` test helpers (`grep -rl "NpcAgent" src/**/*.test.ts`) before writing a new one.
- Existing `livestock.test.ts`, `rats.test.ts`, `settlementAgriculture.test.ts`, `settlementSignposts.test.ts` stay; they do not replace manager/factory tests.

## Pitfalls

- Using `entries.get(def.id)` in a continuation instead of the captured `entry` reintroduces the R1 class of bug once anything else ever deletes entries.
- Calling `unload()` on a discarded runtime would stamp agriculture, overwrite saved animal snapshots with speculative ones, and start off-screen transport/travel clocks from construction positions. Discard = `settlement.dispose()` only.
- Running reclaim before `entry.settlement` assignment, or discarding after reclaim, destroys reclaimed detached livestock.
- `clearColliders(def.id)` from a rollback that never registered colliders is harmless today (no successor can exist under D1) but guard it with the acquisition flag anyway.
- Don't restore whole `NpcStateRegistry` snapshots or add registry journals.
- Keep `Promise.allSettled` result order equal to input order (agent array order feeds deterministic presentation like crowd passes).
- `homeReady` consumers (`app/worldBundle.ts` deferred item spawners/drying racks/hives) rely on rejection on failure — keep it.
- Manager `dispose()` clears authoritative registries intentionally (world teardown); factory failure must never clear them.

## Residual risks

- Other pre-acceptance side effects inside `NpcAgent` construction via helper calls (labels, queue joins, relationship hooks) were not traced exhaustively; only the direct `npcState.travel` write is confirmed. `dispose()` already calls `leaveActiveQueue` and `labelController.dispose`. If a test reveals another authoritative write, move it behind the same commit method.
- Off-screen checkpoint resolution during a pending build can change where an NPC should be presented (arrival at another settlement, residency changes). That is audit F7 territory; record, don't fix.
- Rats persistence read-only assumption (see baseline).
- Manager fixture complexity may force narrower seams than ideal; report which scenarios were integration-tested and which only unit-tested.

## Documentation to update during implementation

- `docs/STATE.md` Settlements/NPCs section: one line on the retain-until-settled pending policy, commit-at-acceptance travel ownership, and factory rollback.
- Plan status → `verification needed` after automated checks; browser checks reported separately.
- JSDoc (`@domain settlements` / `@domain npc`) on the residency predicate, acceptance helper, `releaseAcquired`-owning factory contract and the new `NpcAgent` commit method.
- `pnpm docs:sync` for generated maps.

**Model:** Opus first (multi-file async lifecycle with ordering-sensitive authoritative handoffs); Sonnet as the fallback for isolated steps such as D3/D5 helper-local cleanup and the pure predicate tests.

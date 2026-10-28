# Independent review: settlements-023 streaming lifecycle and rollback

**Date:** 2026-10-28  
**Status:** `done` (documentation review; implementation remains unapproved)  
**Repository / branch:** `jm-sky/seedvale-v1` / `main`  
**Inspected revision:** `0d4c2b2b3c241b17f096e66f54cb6b686fda617c`  
**Plan:** [settlements-023](../plans/settlements-023-settlement-streaming-lifecycle-and-construction-rollback.md)  
**Method:** pinned source and test-source inspection through GitHub Connector. No runtime edits, implementation notes, automated test execution, browser run or performance measurements.

## Verdict

**Changes required before implementation approval.** The plan selects the correct owners and correctly separates production lifecycle repair from benchmark certification. Audit F1 (pending residency) and F6 (failed partial construction) are confirmed source defects. The plan's broad invariants are sound, but publication guards alone do not protect keyed resources or authoritative travel state. Stage B must not be shipped as an isolated pending-entry deletion change.

This review uses ordinary production severity: P0 catastrophic/release-critical, P1 high correctness impact, P2 bounded correctness/verification gap, P3 precision/maintenance. The original [determinism audit](../performance/audits/2026-10-28--deep-determinism-and-benchmark-reproducibility.md) explicitly used mission-specific P0 labels for F1/F6; those labels do not establish a newly reproduced emergency. No P0 is established here. Findings below concern omissions in the plan; where the underlying code mechanism is confirmed but a proposed implementation would be needed to trigger a new race, that distinction is explicit.

## Findings

### R1 — P1: entry validity does not protect same-ID resource ownership

**Evidence:** `src/settlement/SettlementsManager.ts:ensureLoaded` (1161–1209), `unload` (1291–1304); `src/settlement/createSettlement.ts:registerSettlementColliders` (835–853), returned `dispose` (1739–1753); `src/world/collision.ts:createColliderRegistry` (275–316). Colliders replace and clear by `def.id`, without an instance token. Forest presence is similarly keyed: `src/world/treeLifecycle.ts:registerPresence/unregisterPresence` (873–885). Light registration, in contrast, uses the particular group.

**Schedule:** invalidate build A, allow same-ID build B to start before A settles; B registers its colliders; A succeeds stale and its manager calls `A.dispose()`, or A's rollback clears its registrations. `clearColliders(def.id)` removes B's colliders. Shared authoritative NPC objects and animals can also overlap while both factories run, even if A is never accepted into the map. Forest presence has the same risk when overlapping builds include home trees; normal non-home builds do not plant that forest belt.

**Classification:** keyed replacement/deletion behavior is confirmed. This same-ID overlap is a **conditional implementation risk**, not a demonstrated ordinary leave/re-enter bug in current main, which skips pending entries during unload. The plan permits invalidation/replacement but does not require resource exclusion beyond map identity.

**Minimal correction:** require at most one resource-producing factory per settlement ID until the old attempt and its cleanup settle, remembering renewed demand so rapid re-entry eventually loads it. Alternatively, prove generation-owned registration/removal and no overlapping NPC/animal presentation. Prefer local serialization over changing global collider/forest APIs. A stale continuation must not start a factory after its chunk wait has become obsolete. Test successor colliders remain queryable after every old completion/cleanup, not just that the map still contains B.

### R2 — P1: rejected presentation can already consume authoritative offscreen travel

**Evidence:** `createSettlement.ts:materializeSettlementResident` (1316–1378) passes the registry's live state into `NpcAgent.create`. `src/ai/NpcAgent.ts:constructor` (1930–1952) reifies `npcState.travel` and replaces it, potentially with null, before the factory returns. `src/ai/npcTravel.ts:reifyNpcTravel` (198–208) removes execution timing from the returned checkpoint; `keepsNpcTravelAfterReify` (140–142) retains only commitment/reached/blocked cases. `NpcAgent.dispose` (3967–3973) does not restore offscreen ownership. Manager `ensureLoaded` clears transport execution only after success, but that is a different field and a later boundary.

**Schedule:** seed a real offscreen travel checkpoint; materialize a resident; reject the settlement for current distance, or fail a later resident/visitor; dispose the result. The NPC has no accepted detailed owner, yet its earlier offscreen execution may already have been consumed. With a purpose-backed trip the record can remain while losing its execution clock; merely asserting the NPC ID survives misses this.

**Classification:** the pre-acceptance state mutation and absence of compensating disposal are **confirmed**. Lost progression in a controlled rejected-build schedule is source-supported, not browser-reproduced. This is not audit F7's journey/residency-owner change across an await: it applies even when the selected presentation owner never changes.

**Minimal correction:** separate speculative presentation preparation from committing detailed travel ownership, or provide narrowly owned compensation that respects concurrent authoritative progression. Do not restore a wholesale old registry snapshot over newer simulation. Cover ordinary and purpose-backed travel, sibling failure and distance rejection. Require offscreen progression to remain available until an accepted detailed owner takes it. No broad travel-system rewrite is needed.

### R3 — P2: factory-wide cleanup cannot reach resources hidden in a rejected helper

**Evidence:** `src/settlement/props.ts:buildSettlementProps` creates its group at 867, fills it across many awaits and returns it only at the end; `createSettlement.ts` obtains it at 687–728. `src/settlement/livestock.ts:spawnLivestock` awaits templates at 695, then creates/adds multiple agents at 759/782/813/864 and returns the array at 868. `src/settlement/rats.ts:createSettlementRats/spawnOne` (272–311) similarly attaches agents before returning the controller. `settlementSignposts.ts:createSettlementSignposts` (111–149) creates a CSS2D label before its dock await.

**Classification:** private partial-resource ownership is **confirmed**; exceptions after partial allocation are conditional failure paths, not observed model/network failures. NPC, livestock, rat and many prop asset failures have fallbacks, so rejecting an arbitrary asset promise does not necessarily exercise rollback.

**Minimal correction:** specify the helper contract: locally release unreturned acquisitions on rejection, or register ownership with the construction scope immediately on acquisition. Do not require a new generic transaction framework. An outer catch with only completed helper results is insufficient. Keep agent collection incremental for both resident and visitor batches; assignment after fail-fast `Promise.all` loses already resolved agents. Wait for or safely contain all outstanding siblings before declaring cleanup complete.

### R4 — P2: successful runtime disposal has a known late fence continuation

**Evidence:** `createSettlement.ts:syncAuthoredRepairPresentation` launches unawaited `plantEntrancePalisade` operations at 1601–1623. `src/settlement/settlementPalisade.ts:plantEntrancePalisade` (359–369) awaits a template and then adds the new mesh to the supplied group. The caller's continuation subsequently invokes `registerSettlementColliders`. Returned `Settlement.dispose` has no lifetime flag.

**Schedule:** restore a home household/communal fence, dispose/rebuild the world before its template resolves, then resolve it. The old group has been removed/disposed, but the helper adds a newly allocated mesh to it and the caller registers old colliders. A guard only in the caller's `.then` is too late to stop that attachment.

**Classification:** unguarded continuation is **confirmed**; post-disposal residue is conditional on that repair/disposal schedule and has not been executed here. It is an existing successful-runtime cleanup gap, not a new resident Promise.all leak.

**Minimal correction:** cover this narrowly in settlement lifetime cleanup, including disposal of a late mesh and suppression of collider registration. Check lifetime before helper attachment or keep late-result ownership until disposal. Do not expand into authored-repair gameplay. Test world teardown with both fence operations pending.

### R5 — P2: post-factory acceptance exceptions bypass factory rollback

**Evidence:** `SettlementsManager.ts:ensureLoaded` assigns `cur.settlement` before `reclaimDetachedHouseholdLivestock`, `setDayNight`, transport handoff and `onSettlementAvailable` (1183–1199). Its shared catch (1201–1204) deletes the entry without disposing that returned result. The initial `homeReadyPromise` branch (1076–1090) has a separate acceptance path.

**Classification:** exception-to-deletion path is **confirmed**; no evidence establishes that the present callback normally throws. Injected acceptance failure can nevertheless lose manager ownership of a completed runtime, and a factory catch cannot clean resources after return.

**Minimal correction:** distinguish construction rejection from manager acceptance/notification failure. Until ownership transfer completes, the manager must retain a cleanup reference; once accepted, notification failure must not orphan the settlement or undo already committed handoffs blindly. Specify notification semantics and test a throwing notification plus one failing pre-notification acceptance operation. Keep the initial home path under the same resource guarantee without converting `homeReady` failure to success.

### R6 — P3: current same-ID race is overstated as an existing ordinary re-entry defect

**Evidence:** plan Context bullet 2; `SettlementsManager.ts:recheck` skips `pendingPromise` (1318), `ensureLoaded` refuses existing IDs (1162), and `dispose` clears entries (1733). No public ordinary stream-out path invalidates a pending entry today.

**Classification:** missing identity checks are confirmed; ordinary pending leave/re-enter replacement is **not established on current main**. It becomes directly reachable if Stage B starts deleting pending entries. The original audit's warning correctly presents naive invalidation as the trigger.

**Minimal correction:** label this as a latent weakness / regression constraint. Stage A must reproduce current F1 and partial-failure behavior on old code; successor-entry tests prove the new invalidation policy. Do not claim every new regression test necessarily fails on the old public lifecycle. The plan's context was corrected accordingly.

## Verification assessment and required acceptance matrix

Stage A/D has the right categories but is not yet an adequate oracle. A fake complete `Settlement` can prove map guards while missing every resource and state mutation above. No dedicated `SettlementsManager.test.ts` or `createSettlement.test.ts` exists in the inspected tree. Add focused tests at those owners, using the real manager and at least a real construction path with controlled lower-level dependencies. New filenames are recommendations, not claims of existing seams.

| Scenario | Required assertion beyond final counts |
| --- | --- |
| Resolve before/after out-of-range movement; stationary completion | Correct accepted IDs, rejection cleanup, zero availability notification for rejected result; already accepted runtime uses ordinary unload/handoffs exactly once |
| Position moves less than the 75-unit recheck threshold | Completion uses latest observed coordinates and current world time/day length, not `lastCheckX/Z`; use a case that crosses unloadRadius within that small movement |
| Hysteresis boundaries | Initial discovery only at/below loadRadius; retain an existing eligible attempt/runtime in the band; unload strictly beyond unloadRadius; equality retained; startup eager neighbors remain an explicit home-policy exception |
| Rapid A → away → A; old success/rejection/finally | Latest demand eventually materializes; no duplicate live NPCs/animals even transiently; old cleanup cannot erase successor colliders/registrations; midpoint signs converge with entry policy |
| Obsolete chunk wait; teardown before factory start | No new factory/state seeding after invalidation/disposal; initial home and streamed paths both covered |
| Failure inside helper, resident batch and visitor batch | Capture already acquired resources even when helper never returns; resolve a late sibling after initial failure and flush continuations; no later scene attachment or unhandled rejection |
| Shared ownership and repeated cleanup | Agent-owned GPU/labels disposed once; group-owned props disposed once; sign labels detached without separately freeing group props; shared cached GPU/templates not freed; later successful load reuses assets |
| Authoritative preservation | Same NPC/household/economy identity; no repeated bootstrap grants; agriculture catch-up not duplicated or stamped as detailed activity by an unaccepted runtime |
| Animal preservation | Saved livestock/rat IDs, state and tombstones preserved; detached player-owned / merchant-pack individuals not respawned or captured from a rejected speculative runtime |
| Travel/transport | Seed a nonterminal cargo order and generic/purpose-backed travel; preserve execution/cargo while rejected, clear reverse execution only for acceptance, capture detailed positions on ordinary unload; continue offscreen clock, including a time-skip during construction |
| Home success/failure and world rebuild | Home pinned regardless of distance; `homeReady` resolves only with accepted full runtime and still rejects on failure/disposal; no late work repopulates cleared old registries; do not demand every home promise field becomes null without intentionally changing that contract |
| Repair continuation / notification throws | No late fence GPU/collider residue; no orphan after acceptance exception; no duplicate notification for a single accepted materialization |

Existing `livestock.test.ts` exercises registry round-trips/tombstones/detachment, `rats.test.ts` mainly pure population/reconciliation rules, `settlementAgriculture.test.ts` catch-up/idempotence, and `settlementSignposts.test.ts` normal labels/disposal. Retain them, but they do not prove manager/factory integration. The signpost test explicitly notes that DOM-only counts can falsely pass without CSS2D rendering: traverse the Three.js graph as well as DOM labels. Resource tests should assert expected surviving successor resources, not globally empty registries that also contain legitimate home/shared resources.

Use deterministic deferred promises and actual order assertions. Browser travel/teleport/rebuild checks complement these tests; they cannot replace controlled race schedules. No tests or browser checks were run for this documentation-only review.

## Simulation and scope boundaries

- Normal `unload` (1291–1304) stamps agriculture, captures livestock/rats, begins offscreen transport, and hands NPC travel off before disposal. Preserve that order for a previously accepted runtime.
- An unaccepted result is different: no loaded simulation tick has run, but construction has already performed idempotent authoritative initialization and agriculture catch-up (`createSettlement.ts` 919–943), and NPC reification is not read-only. Do not blindly call normal `unload` on every rejected partial result, overwrite newer animal snapshots, or stamp elapsed agriculture as if it ran detailed simulation.
- Manager-wide `dispose` intentionally clears its authoritative registries; ordinary recoverable factory failure must not. Preserve world teardown/reset ownership rather than adding global registry restoration.
- `settlements-022` Stage C/D already requests shared race-safe lifecycle. Keep 023 the current procedural correction; recommend an explicit reuse/order link in 022 after approval, without introducing a dependency cycle or founded-runtime types in 023.
- Archived `settlements-021` supplies current resident/visitor identity reuse; do not fork it. Audit F7 remains separate except where tests demonstrate a concrete integration blocker.
- `world-039-lifecycle-fresh-world-failure-cleanup` owns whole fresh-bundle cleanup after background failure; `persistence-007` owns New Game save/transition ordering. Settlement-local guarantees must compose with them, but 023 must not redesign those transactions or wait for them as prerequisites.
- No evidence calls for a save migration, worldgen version bump, global abort API, per-frame settlement scan, full registry transaction journal or new streaming manager.

## Documentation corrections applied vs author decisions

**Applied corrections:** qualified the current same-ID claim; added required protection against overlapping same-ID resource ownership, pre-factory stale continuations, speculative travel handoff, helper-local partial ownership, late repair continuations and manager acceptance exceptions; expanded concrete verification expectations. Plan status stays `draft`. These are review corrections to requirements, not runtime decisions or implementation notes.

**Recommendations requiring author approval before runtime work:**

1. Choose pending handling: retain/mark obsolete work until settled, or invalidate early with per-ID draining and remembered renewed demand. Recommended minimum is no overlapping resource-producing factories for one ID. Do not leave rapid re-entry dependent on another 75-unit movement.
2. Choose the narrow boundary for committing detailed NPC travel ownership; require proof that a discarded presentation leaves no ownerless execution. Do not accept a fix that merely preserves IDs.
3. Approve the small successful-runtime fence lifetime guard as part of 023, or assign an explicit prerequisite follow-up; it must not disappear from teardown acceptance.
4. Approve the lifecycle reuse/order link from 022, and decide the acceptance/notification error policy. Retaining an already accepted runtime on notification-only failure is the smallest suggested policy.

A separately reviewable Stage B commit is reasonable only if its tests prove no overlap/resource loss and discarded-build travel continuity; otherwise land the relevant factory safeguards with it. Do not interpret this review as authorization to implement.

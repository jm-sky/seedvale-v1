# Plan: Settlement async streaming lifecycle and construction rollback

**Created:** 2026-10-28
**Status:** `draft` 📝
**Type:** bug
**Priority:** high · **Effort:** XL
**Depends on:** -
**Domain:** `settlements`
**Subdomains:** `population`
**Tags:** `streaming` `lifecycle` `simulation` `performance`

## Context and evidence

The [2026-10-28 determinism audit](../performance/audits/2026-10-28--deep-determinism-and-benchmark-reproducibility.md) established two **production** defects by source inspection (F1 and F6); their occurrence in the historical benchmark samples was not proved. This plan corrects gameplay/world lifecycle behavior independently of benchmark tooling.

At the inspected source revision (`4c5a6c15`, unchanged in runtime through audit commit `9a74103e`):

- `src/settlement/SettlementsManager.ts:recheck` skips pending non-home entries when checking the unload radius. A build completed after teleport/travel can be published outside the residency policy, with no further recheck until the player travels another `loadRadius * 0.25` (75 units under current settings).
- `SettlementsManager.ts:ensureLoaded` checks only that an entry with the same ID exists. This is a latent identity weakness: current `recheck` skips pending entries, so ordinary pending leave/re-enter replacement is not established on current main. If pending entries are invalidated to correct residency, an earlier promise can act on a *replacement* entry; success/catch/finally must all be guarded.
- `src/settlement/createSettlement.ts:createSettlement` attaches props and other presentation resources before awaiting later construction phases. In particular, resident agents may be attached as their individual `NpcAgent.create` operations resolve. Rejection after partial attachment lacks a factory-wide rollback, and `Promise.all` rejection does not mean sibling tasks have stopped.
- `SettlementsManager.ts:unload` performs authoritative agriculture/livestock/rat capture and transport/NPC offscreen handoffs before disposing a *completed* settlement; disposal must preserve that contract. Home is deliberately pinned regardless of distance.

The existing [`settlements-022`](./settlements-022-founded-settlement-live-runtime-and-streaming.md) contains broader future founded-settlement streaming requirements, including a similar async-safety invariant. This plan is an **independent prerequisite-quality correction of the currently implemented procedural path**, not a dependency on implementing `settlements-022`. Future work should reuse the corrected lifecycle rather than build a second one.

## Goal

Make streaming and construction failure-safe for current procedural settlements so that:

1. A non-home settlement cannot remain published outside the unload policy merely because its build finished after the player's last distance recheck.
2. An obsolete async operation cannot publish into, delete, clear pending state on, or otherwise mutate a replacement entry with the same settlement ID.
3. Any failed or obsolete partial settlement construction releases all factory-owned live presentation/collider/registration resources, even when sibling work finishes after the first rejection.
4. Successful resident settlement streaming continues preserving authoritative NPC identities, economies, households, agriculture, livestock, rats, transport and travel progression.

This is **correctness work**, not a change to world generation, population policy or NPC simulation fidelity.

## Scope and stages

### Stage A — Controlled lifecycle regression evidence

- Add small, deterministic deferred-promise tests reproducing finish-before/after movement out of range, stationary post-teleport completion, quick leave/re-enter with the same ID, manager disposal during construction, and an obsolete rejection/finally running after replacement.
- Distinguish pending entries, completed live settlements, and the pinned home. Capture existing handoff effects in assertions; do not infer the intended roster from the historical `69/69/53` counts.
- Use current test seams where viable; any new injection seam must be narrow and production-neutral. Do not introduce a parallel streaming manager for tests.

### Stage B — Settlement manager publication and residency lifecycle (F1)

- Define one entry-lifetime validity rule for every async continuation (success, failure and finalization), using captured entry identity or an equivalent generation token **plus** manager lifetime.
- Reconcile latest player position and existing load/unload hysteresis at completion. A completed non-home entry beyond `unloadRadius` must be disposed/rejected promptly without waiting for another 75-unit movement. Between `loadRadius` and `unloadRadius`, retain legitimate hysteresis rather than forcing an immediate unload.
- Handle out-of-range **pending** work without allowing a later completion to resurrect it. Avoid a simplistic `entries.delete(id)` that permits a stale continuation to act on a new entry.
- Preserve the always-loaded home path and existing eager-neighbor startup semantics at the home position. After teleport, no eager-neighbor exception may retain an invalid distant build.
- Preserve current detailed-to-offscreen handoff behavior for successfully published settlements, and only perform reverse offscreen-to-detailed handoff for successfully accepted materializations. Do not erase authoritative registries or dispose shared assets prematurely.
- Keep bounded movement-based checks; adding a permanent per-frame full-settlement scan is not the solution.

### Stage C — Factory-owned rollback for partial construction (F6)

- Make `createSettlement` own the cleanup of resources it acquired/attached prior to returning a `Settlement`, including props, agent meshes, livestock, rats, signposts, colliders, forest/presence and light-budget registrations where applicable.
- Make failure/cancellation cleanup safe across awaited stages. If one resident construction fails while other resident promises remain outstanding, no later sibling may attach orphaned resources after rollback. Coordinate settlement-scoped concurrent work (or its cancellation/settlement) before final cleanup; do not rely on fail-fast `Promise.all` alone.
- Use the existing successful `Settlement.dispose`/resource-disposal mechanisms where possible, but distinguish partially initialized resources and ownership. Avoid double dispose and disposal of shared cached templates/materials.
- Preserve authoritative `NpcStateRegistry`, household and economy state through a recoverable presentation failure. Failures must not silently replace generated definitions or clear persistent identity.
- A stale *successfully completed* factory result may still be disposed by the manager; a factory **rejection after partial publication** must be cleaned up by the factory. Keep these responsibilities separate.

### Stage D — Focused integration verification

- Repeat Stage A schedules against the complete manager + construction behavior, including error injection after scene attachment and at least one late resident completion.
- Check recovery on subsequent re-entry, normal startup at home, travel/teleport back and forth, rapid world dispose/rebuild, and repeated failed attempts.
- Verify no residual scene children/agent presentations, colliders, owned animal presentations, relevant registrations or pending markers after stale/failure paths; no duplicate live NPC IDs after re-entry.
- Verify successful loads still produce exactly one `onSettlementAvailable` notification per accepted materialization, keep NPC/household IDs stable and preserve livestock/rat capture and transport/NPC offscreen handoffs. Distinguish intended in-session histories from re-created presentations.
- Run relevant automated regression suites, plus a bounded manual browser check of normal travel, teleport, settlement interactions and returning to the same village. Runtime/browser checks must be reported as performed, not inferred from static review.

## Constraints and non-goals

- Keep `SettlementsManager` the owner of streaming residency and completed-runtime handoffs; `createSettlement` owns cleanup during unsuccessful construction.
- Preserve existing radii, hysteresis, eager-neighbor policy at startup, home pinning, world seed/settlement definitions, stable NPC IDs and full living-world simulation.
- No blanket cancellation of global workers or introduction of abort APIs without an actual supported cancellation seam.
- No new persistence schema, worldgen epoch, globally frozen simulation, global RNG seeding or broad ownership refactor.
- **Explicitly out of scope:** benchmark readiness/fingerprints/window boundaries (audit F2/F3), historical `69/69/53` attribution, FPS tests and baseline recertification.
- Vegetation LOD order (F4), generic cache read amplification (F5), NPC presentation-owner transition reconciliation (F7), and grass request identity (F8) remain **separate follow-up candidates**, not silently bundled into this settlement-lifecycle fix. If Stage A–D tests expose an F7 defect, record and scope it explicitly rather than broadening this plan.
- D4 Performance-First remains in effect. This is a critical production correctness exception, not permission for unrelated rendering/worldgen integration. Record runtime/workload impact before using old performance evidence again.

## Completion criteria

- Controlled tests prove the old deferred-completion defect and pass for both resolution orders and fast same-ID re-entry.
- Pending obsolete operations cannot mutate a successor entry, including catch/finally and manager teardown.
- A successful completed out-of-range non-home build is not retained for lack of player movement.
- Injected post-attachment failure leaves no factory-owned scene/collider/agent/resource residue, including delayed sibling completion.
- Existing home startup, ordinary load/unload hysteresis, authoritative state and offscreen handoff behavior stay intact.
- Scoped tests and manual checks are documented with explicit failures/limitations, without benchmark performance claims.

## Independent review corrections (2026-10-28)

See [independent review 028](../reviews/2026-10-28--028--settlements-023-streaming-lifecycle-plan-review.md) for pinned evidence, severity, acceptance matrix and recommendations requiring author approval. The following clarify required correctness; they do not authorize runtime work or prescribe a new architecture.

- **Entry lifetime and resource lifetime:** guard continuations before starting a factory after `waitForChunks`, as well as after factory completion. Same-ID entry identity alone does not protect resources registered by stable ID. An obsolete factory/cleanup must not overlap a successor in a way that removes its colliders/forest presence or duplicates NPC/animal presentation. Prefer one resource-producing factory per settlement ID until old cleanup settles; remember renewed demand so rapid re-entry completes without another movement threshold. Any alternative must prove equivalent ownership isolation.
- **Latest residency inputs:** completion must use latest observed player coordinates, world time and day length, including movement smaller than the recheck threshold. Last distance-recheck coordinates are insufficient. Preserve exact radius boundary semantics and distinguish normal hysteresis from the deliberate startup eager-neighbor exception.
- **Speculative simulation ownership:** `NpcAgent` construction currently reifies/mutates authoritative travel before manager acceptance. A rejected/failed presentation must not consume offscreen execution without a detailed owner. Establish a narrow acceptance/compensation boundary that preserves concurrent progression; never restore whole old registry snapshots. This is required independently of audit F7 owner changes across awaits.
- **Helper-owned partial acquisition:** cover resources allocated inside helpers that reject before returning their group/list/controller. Outer factory cleanup cannot release handles it never received. Include `buildSettlementProps`, livestock, rats, sign labels, and both resident and travelling-visitor batches. Use local cleanup or immediate construction-scope ownership; no generic transaction framework is required.
- **Successful-runtime late work:** the existing authored-fence restoration path in `syncAuthoredRepairPresentation` can attach through `plantEntrancePalisade` after disposal and then register old colliders. Teardown acceptance must cover this narrow lifetime gap, including attachment inside the helper. Keep authored-repair gameplay outside scope.
- **Manager acceptance failures:** separate factory rejection from exceptions after a complete result returns (reclaim, day/night, handoff, notification). Retain a cleanup owner across acceptance; a shared catch must not delete the only entry for a completed runtime without disposing or retaining it coherently. Apply resource guarantees to the separate initial `homeReady` path, preserving rejection semantics.
- **Handoff distinction:** ordinary unload of an accepted runtime preserves the existing capture/handoff sequence. Discarding speculative construction must not stamp detailed agriculture, overwrite newer livestock/rat snapshots, reclaim detached animals or clear transport execution as if accepted. Preserve idempotent authoritative initialization/catch-up already committed by construction.

Verification additions to Stages A/D and completion criteria:

- Assert surviving successor colliders/registrations after old success, failure and cleanup; assert no transient duplicate NPC/animal presentations and eventual reload after quick re-entry.
- Inject failure inside a helper before its result is returned, after an attached resident, and during the visitor batch; resolve late siblings after the first failure and check again.
- Seed ordinary and purpose-backed offscreen travel plus cargo/transport execution; verify continuity after rejection/failure and across time-skip during construction. IDs alone are insufficient.
- Check latest-position completion inside a sub-threshold movement, exact hysteresis boundaries, eager startup/home policy, midpoint cleanup, disposal before factory start, and initial home failure.
- Check exactly-once instance-owned disposal, shared GPU/template survival, labels in the Three.js graph as well as DOM, late fence work, and a throwing acceptance/notification operation.
- Current-bug tests must reproduce F1/F6 on old code; tests for the new invalidation policy need not fail on a currently unreachable same-ID replacement schedule. Existing helper unit tests do not substitute for real manager/factory integration.

**Author decisions still open:** pending invalidation/draining policy; narrow detailed-travel commit boundary; inclusion or explicit prerequisite ownership of the small fence lifetime guard; notification-only failure policy; explicit lifecycle reuse/order link in `settlements-022`. No decision is silently approved by these corrections. Whole fresh-world failure cleanup remains with `world-039`; New Game transition/save ordering remains with `persistence-007`.

## Implementation-note handoff / review questions

Before implementation, independently review the feasible cleanup boundary across `createSettlement`, `spawnLivestock`, `createSettlementRats`, signposts, NPC materialization and forest/collider ownership. Verify whether any helper attaches asynchronously after its returned promise and requires its own local guard. Establish a minimal failure-injection seam and existing test-file locations; do not invent them.

Resolve whether to invalidate pending entries at the distance recheck or let them finish and reject at publication. Both are acceptable only if same-ID resource ownership, renewed demand, speculative travel continuity, midpoints, home policy and cleanup are correct. A separately reviewable Stage B change may land only with evidence of no resource overlap/leakage and preserved rejected-build travel continuity; otherwise include the necessary factory safeguards in that change.

During implementation, add/adjust JSDoc for important public/architectural lifecycle functions as needed for preflight discovery; prefer `@domain settlements` on new stable ownership seams.

**Plan status:** draft; independent review completed with corrections and open author decisions. Implementation notes have not been created. Plan creation does not authorize runtime implementation.

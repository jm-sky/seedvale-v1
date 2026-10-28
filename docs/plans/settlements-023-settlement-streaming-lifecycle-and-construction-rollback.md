# Plan: Settlement async streaming lifecycle and construction rollback

**Created:** 2026-10-28
**Status:** `draft`
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
- `SettlementsManager.ts:ensureLoaded` checks only that an entry with the same ID exists. An earlier promise can therefore act on a *replacement* entry after leave/re-enter; its catch/finally can delete or alter replacement state.
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

## Implementation-note handoff / review questions

Before implementation, independently review the feasible cleanup boundary across `createSettlement`, `spawnLivestock`, `createSettlementRats`, signposts, NPC materialization and forest/collider ownership. Verify whether any helper attaches asynchronously after its returned promise and requires its own local guard. Establish a minimal failure-injection seam and existing test-file locations; do not invent them.

Resolve whether to invalidate pending entries at the distance recheck or let them finish and reject at publication. Both are acceptable only if same-ID replacement races, midpoints, home policy and cleanup are correct. Confirm whether an intermediate, separately reviewable Stage B change can land without creating unrecoverable partial-construction leakage.

During implementation, add/adjust JSDoc for important public/architectural lifecycle functions as needed for preflight discovery; prefer `@domain settlements` on new stable ownership seams.

**Plan status:** draft pending independent review and implementation notes. Plan creation does not authorize runtime implementation.

# Player / World Lifecycle Audit — Follow-ups

**Date:** 2026-09-21  
**Scope:** player lifecycle, persistence/save/load, world rebuild/reset, terrain/water queries, traversal, player-created world objects, world audio lifecycle.

This file records findings from the cross-cutting lifecycle audit that were **not** promoted to the five dedicated `lifecycle-*` draft plans.

Dedicated plans created from the highest-ROI findings:

- `persistence-007-lifecycle-new-game-rebuild-failure-safety.md`
- `world-039-lifecycle-fresh-world-failure-cleanup.md`
- `items-player-061-lifecycle-mounted-livestock-reference.md`
- `world-terrain-051-lifecycle-resident-ground-authority-completion.md`
- `world-terrain-052-lifecycle-resident-local-water-agent-authority.md`

## Remaining findings

### 1. Spatial audio context can become stale across async buffer loading

**Area:** world audio lifecycle  
**Relevant code:** `src/audio/createWorldAudio.ts` — `playAtCancelable()`, `playOnceCancelable()`, spatial-context resolver.

`playAtCancelable()` checks listener/source spatial compatibility before starting the asynchronous buffer load. When an uncached sound finishes loading, playback is gated by disposed/cancelled state, but the spatial context is not resolved again immediately before playback.

Logical edge case:

1. a surface sound is requested while listener and source are spatially compatible,
2. its buffer is not cached and loads asynchronously,
3. during the load the player moves into a cave or another isolated spatial context,
4. the one-shot starts after loading using the earlier compatibility decision.

**Direction:** reuse the existing spatial resolver/compatibility predicate and revalidate immediately before creating/starting the spatial source. Do not add a second cave/audio context model.

**Priority:** important but lower ROI than the five lifecycle plans; likely a small follow-up to `world-037` / `world-038`.

### 2. General partial-construction cleanup in `buildWorldSystems()` remains incomplete

**Area:** world rebuild lifecycle  
**Relevant code:** `src/app/worldBundle.ts` — `buildWorldSystems()`.

There is already a Loose End from 2026-09-20 covering this: synchronous throws later in the large construction sequence can leak resources allocated earlier in the same construction attempt.

The new `world-039-lifecycle-fresh-world-failure-cleanup.md` intentionally covers a narrower confirmed seam: a fully returned `built.bundle` whose `backgroundReady` later rejects before publication.

**Direction:** keep these scopes distinct. If broader construction failure hardening becomes necessary, use a bounded disposer stack/transaction inside `buildWorldSystems()` rather than expanding every caller with ad-hoc cleanup.

### 3. Failure-state logging/recovery wording does not fully match runtime semantics

**Area:** diagnostics / world rebuild lifecycle  
**Relevant code:** `src/app/createApp.ts` around failed rebuild handling.

Current comments/logging imply normal simulation remains paused “until a new rebuild succeeds”. The current lifecycle appears closer to a sticky failed state where an ordinary retry is not necessarily a supported recovery path.

This is primarily a correctness-of-diagnostics issue, not the root lifecycle bug.

**Direction:** after `persistence-007` / `world-039` recon, align the log/comment with the actual supported recovery model. Do not add retry machinery solely to make the message true.

**Priority:** minor.

### 4. Stale PlayerController persistence comments

**Area:** player lifecycle documentation  
**Relevant code:** `src/player/PlayerController.ts`.

Some comments still describe player HP as runtime-only / non-persistent even though current save state persists health consequences and restores them during boot.

**Direction:** update comments when touching the relevant code. Current runtime behavior is the source of truth.

**Priority:** minor.

## Findings that looked sound in the audit

These do not currently need plans, but are useful invariants for future lifecycle work:

- cave-position restore revalidates saved Y through current cave/world ground authority instead of blindly restoring an absolute Y;
- player HP / physical injury have explicit persistence and New Game reset ownership;
- same-world terrain rebuild carries only player terrain modifications while deterministic system modifications are regenerated;
- player-created objects use explicit snapshot/carry/reset ownership through WorldBundle rebuild;
- campfire dismantle + ash residue lifecycle has persisted `hasBurned`, one-day residue expiry and same-world/New Game semantics;
- `WorldAudio` itself is app-lifetime rather than WorldBundle-lifetime, with listener cleanup and late-bound access to current cave state, avoiding duplicate audio ownership across rebuilds.

## Revisit criteria

Promote an item here to a dedicated plan only when:

- it gains a reproducible gameplay/correctness impact,
- implementation requires more than a local bounded fix,
- or it becomes a dependency for another planned lifecycle change.

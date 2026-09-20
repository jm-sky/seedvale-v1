# Plan: Time-skip and reification surface placement validity

**Created:** 2026-09-20
**Status:** `planned` 📋
**Type:** bug
**Priority:** high · **Effort:** M
**Depends on:** world-terrain-044
**Domain:** `npc`
**Subdomains:** `behavior` `lifecycle`
**Tags:** `movement` `time-skip` `travel`
**Roadmap:** -

## Problem

Detailed NPC locomotion validates movement through the current shared slope/walkability/collider pipeline, but coarse placement does not.

Current surface time-skip placement resolves a schedule X/Z and calls `sampleHeight`. Generic committed-travel catch-up/reification similarly materializes the interpolated/terminal X/Z with sampled height.

Therefore time-skip/off-screen reification can place an NPC at a point live movement would reject because of current water/collider/runtime-ground state.

`npc-058` fixes resource/interrupt parity but intentionally preserves current placement semantics; this plan owns only the movement-surface seam.

## Goal

Make detailed materialization after time-skip/off-screen travel obey the same surface-validity contract as live NPC movement without replaying pathfinding or every skipped movement step.

## Implementation

### 1. One placement-validation seam

Extract/reuse the smallest NPC-owned surface validity primitive representing the relevant live rules:

- canonical resident movement ground availability;
- actor water rule;
- collider clearance at the resolved Y;
- slope/step validity where applicable.

Do not create a second collider/water classifier.

Coordinate with `world-terrain-044`: detailed materialization must not treat analytical fallback as canonical runtime movement ground when the required resident surface is unavailable.

### 2. Time-skip final placement

For surface `placeNpcAfterTimeSkip`:

```text
semantic schedule target
→ resolve valid detailed surface placement
→ place
OR
→ deterministic bounded fallback/hold
```

A failed validation must not silently place inside water/collision.

Do not run local A* over the skipped interval.

### 3. Off-screen travel reification

Keep `NpcTravelContinuity` as spatial/time authority.

At the moment a remote position becomes a live `NpcAgent`, validate the materialization point. If resident runtime surface is not yet available, defer/hold detailed placement rather than substituting a weaker surface contract.

Do not change ETA/interpolation math unless needed for the validation handoff.

### 4. Bounded fallback

Reuse existing NPC local-safe-point/collider helpers where possible. Any fallback must be bounded, deterministic where authoritative state is affected, and must not teleport to home merely because the current destination is invalid.

Cave/mouth behavior remains unchanged: `placeNpcAfterTimeSkip` already holds cave-valid XYZ and must not surface-project underground NPCs.

## Relevant files / symbols

- `src/ai/NpcAgent.ts::resolveTimeSkip`
- `NpcAgent.catchUpCommittedTravel`
- `NpcAgent.applyTimeSkipPlacement`
- `NpcAgent.isWalkableExterior`
- `src/ai/npcMovementRecovery.ts::placeNpcAfterTimeSkip`
- `src/ai/npcTravel.ts`
- `src/terrain/slopeConstraint.ts`
- `src/world/collision.ts`
- runtime-ground contract from `world-terrain-044`

## Tests

Cover:

1. schedule target inside a collider is not accepted by time-skip placement;
2. invalid local water target is not accepted;
3. valid surface target preserves current behavior;
4. missing/not-ready runtime ground does not silently downgrade to analytical placement;
5. off-screen mid-route reification validates before live materialization;
6. cave/mouth time skip still holds the current cave-valid endpoint;
7. no local A* replay is introduced during time skip.

## Guardrails

- no per-frame off-screen NPC simulation;
- no second travel registry;
- no global navmesh;
- no replay of skipped local paths;
- no home teleport fallback;
- no cave-to-surface projection;
- reuse `world-terrain-044` movement-ground semantics rather than inventing another availability API.

## Verification

Automated tests own placement validity and cave regression. Browser/manual verification belongs to the User.

Do not run `pnpm docs:sync`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

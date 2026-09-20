# Plan: Cave/surface perception boundary and entrance awareness

**Created:** 2026-09-20
**Status:** `planned` 📋
**Type:** bug
**Priority:** high · **Effort:** M
**Depends on:** ~~world-027~~, ~~fauna-042~~
**Domain:** `fauna`
**Subdomains:** `predation` `prey` `habitat`
**Tags:** `caves` `perception` `spatial-context`
**Roadmap:** -

## Problem

Player interaction/combat already uses world-owned `WorldSpatialContext`, but fauna perception still largely reduces proximity to X/Z:

- `faunaProximity` indexes and measures X/Z;
- predator/prey target selection consumes those candidates;
- predator→player inputs use XZ distance;
- nearby NPC/human candidate composition omits spatial context.

A cave resident and an actor on the surface directly above can therefore notice/react to each other through solid cave rock.

The fix must not become a strict portal switch that makes actors completely unaware until the exact frame the other actor crosses the cave boundary. Near a real entrance/mouth, early detection before entry is desirable.

## Goal

Use the existing physical XYZ-derived `WorldSpatialContext` to isolate closed cave/surface perception while preserving a bounded, explicit entrance-awareness seam.

## Perception contract

Use three cases:

```text
same spatial context
→ ordinary current perception

different context with no shared cave entrance relationship
→ not a local perception candidate

surface ↔ cave:<id> near that cave's open entrance/mouth
→ bounded entrance awareness
→ ordinary decision system may react before boundary crossing
```

Entrance awareness is a perception exception, not movement permission. A predator must still use existing cave/surface traversal to reach the target.

## Implementation

### 1. Current context comes from physical XYZ

Reuse `Caves.spatialContextAt(x, y, z)`.

Do not use `AnimalCaveContext`/habitat binding as current context: cave residents can physically travel onto the surface while retaining their home binding.

Do not persist context.

### 2. Compose context once, not per pair

Avoid turning the existing proximity optimization back into a global-scan hot path.

Prefer resolving/caching current context once per live actor for the fauna pass (or an equivalent bounded frame snapshot), then filtering the already-local proximity candidates.

The cave heightfield remains authority; any cache is derived and frame-local.

### 3. Entrance awareness

Expose/reuse the minimal world-owned cave entrance information necessary to answer whether a surface actor and cave:<id> actor are both near the same open mouth/transition.

Requirements:

- bounded radius/corridor, not distance to any cave in the world;
- exact cave id;
- open-sky mouth/entrance semantics from current Cave V2;
- no presentation-state dependency;
- no full topology/pathfinding per perception pair.

Do not classify arbitrary close X/Z across a roof as entrance awareness.

### 4. Apply before decision scoring

Filter/contextualize candidates before:

- predator→prey selection;
- prey immediate predator detection;
- predator→player aggression/fear;
- predator→NPC targeting;
- predator→livestock hunting;
- nearby-human crowd count when those humans are spatially separated by cave rock;
- secondary alert/guard inputs whose source threat is cross-space invalid.

Keep `faunaDecision.ts` and `predatorHumanDecision.ts` as decision scorers; spatial eligibility belongs before scoring.

### 5. Domestic animals

Livestock/dogs use `AnimalAgent` and must consume the same context policy. Do not create a livestock-only cave rule.

## Relevant files / symbols

- `src/world/spatialContext.ts`
- `src/world/createCaves.ts::spatialContextAt`
- cave entrance/topology query seam
- `src/fauna/faunaProximity.ts`
- `src/fauna/AnimalAgent.ts`
- `src/fauna/predatorHumanDecision.ts`
- `src/fauna/faunaDecision.ts`
- `src/fauna/createFauna.ts`
- `src/app/gameLoop.ts`
- settlement livestock candidate composition

## Tests

1. cave predator + surface prey directly above closed roof do not detect each other;
2. surface predator + cave prey directly below do not detect each other;
3. cave predator does not attack/flee from surface player through closed roof;
4. surface predator does not target cave player through closed roof;
5. same-context surface and cave encounters keep current behavior;
6. surface actor approaching the matching cave mouth can be perceived by a cave actor before crossing the spatial boundary;
7. entrance awareness for cave A cannot expose actors through cave B;
8. a cave resident physically on the surface is treated as surface despite its habitat binding;
9. candidate scans remain bounded and do not add per-pair global cave scans.

## Performance

Expected runtime effect should be neutral-to-positive candidate rejection if context is resolved once per actor/pass.

Do not add a new per-pair `Caves.spatialContextAt` global scan. If current cave-count lookup cost becomes material, use a derived cave-bounds accelerator under world ownership, not fauna-owned geometry.

## Guardrails

- no second spatial-context type;
- no habitat-binding-as-current-location shortcut;
- no cave presentation checks;
- no line-of-sight raycast per pair;
- no full cave topology pathfinding in perception;
- no special-case quest predator logic;
- no movement teleport at the entrance.

Do not run `pnpm docs:sync`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

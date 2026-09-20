# Plan: Cave-aware dropped-item continuity

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** high · **Effort:** M  
**Depends on:** ~~world-027~~  
**Domain:** `items-player`  
**Type:** `bug`  
**Roadmap:** -

## Problem

`DroppedItem` stores only X/Z and is always grounded through the surface `sampleHeight`. Interaction also classifies ordinary item payloads as `surface`.

A drop created while the source is in a cave can therefore appear on the terrain above the cave, become unreachable because cave/surface interaction filtering rejects it, and reconstruct on the surface after save/load or WorldBundle rebuild.

This affects ordinary inventory drops, overflow drops, projectile misses and NPC corpse-loot handoff. The completed `world-027` spatial-context work explicitly recorded this as an out-of-scope follow-up.

## Goal

Make the existing generic `DroppedItems` lifecycle preserve the item's actual world spatial domain across:

```text
drop
→ falling/ground placement
→ interaction
→ fauna/world consumption
→ save
→ rebuild/load
→ pickup
```

Do not create a cave-specific item registry.

## Current ownership

Keep:

- `src/items/createDroppedItems.ts` as the dropped-item owner;
- `WorldSpatialContext` as the shared surface/cave identity contract;
- `Caves` / terrain as ground authorities;
- app/world composition as the place where those authorities are injected;
- `interactables.ts` as a projection of the item's authoritative record.

## Implementation

### 1. Extend the dropped-item record

Persist enough information to reconstruct a cave drop without reclassifying it as surface.

Preferred shape is semantically:

```ts
type DroppedItem = {
  ...
  y?: number
  spatialContext?: WorldSpatialContext
}
```

Backward-compatible absent fields mean the existing surface record.

For a cave drop, Y and cave context are durable world-position state, not presentation state.

Use the repository's current save schema/migration conventions if `DroppedItem` is wrapped by a separate save DTO at implementation time.

### 2. Make drop creation context-aware

Do not infer cave identity from X/Z.

Update the smallest shared drop API so callers that already know spatial context can provide it. Avoid growing positional arguments indefinitely; an options object is acceptable if current call-site ergonomics justify it.

At minimum cover:

- player inventory drop;
- inventory/reward overflow at player position;
- projectile miss/expiry using the projectile's captured spatial context from `world-027`;
- NPC corpse-loot handoff using the corpse/NPC current spatial context;
- any other real production caller capable of running underground.

Surface-only producers can keep the surface default.

### 3. Inject canonical grounding

`createDroppedItems` must not import or own `Caves`.

Inject the smallest read-only placement/ground contract from composition so:

- surface drops preserve current terrain grounding;
- cave drops resolve against the matching cave id / cave floor;
- a missing cave authority does not silently place the item on the surface;
- initial restore uses persisted cave Y/context without first snapping through surface terrain.

Reuse existing `Caves.queryGroundIn` / shared world-ground semantics where appropriate.

### 4. Preserve context during falling and terrain settling

The falling path currently compares against surface `sampleHeight`.

Make its landing ground domain-aware.

`settleNear()` is triggered by surface terrain modification. It must not accidentally re-arm cave items against surface ground merely because their X/Z overlaps the modified terrain.

### 5. Interaction and pickup

`src/app/interactables.ts::spatialContextForPayload` must use the dropped item's stored context rather than the default surface branch.

Grouping must never merge dropped items from different spatial contexts merely because X/Z is close.

Pickup keeps the existing stable item-instance/freshness continuity.

### 6. Fauna/world consumers

Audit dropped-food attraction/consumption and any ID-based world-item consumers.

A cave drop must not become a surface animal target through an X/Z-only projection. Reuse the shared spatial-context equality/route semantics; do not add a fauna-specific cave flag.

### 7. Rebuild / save-load

Required invariant:

```text
cave drop at cave:X + XYZ
→ save/rebuild/load
→ same id + item payload
→ cave:X + same valid underground placement
```

Do not persist Three.js objects, cave runtime handles or heightfields.

### 8. Tests

Add focused automated coverage for:

1. surface drop remains backward-compatible;
2. cave drop spawns/lands on cave ground, not surface terrain;
3. save/restore preserves cave id + vertical placement;
4. same-world rebuild does not move cave drop to surface;
5. interaction from cave sees the cave drop while surface player does not;
6. two same-X/Z drops in different spatial contexts are not grouped together;
7. projectile miss inside cave preserves projectile context;
8. NPC corpse-loot handoff inside cave preserves context;
9. surface terrain `settleNear` does not re-ground cave items;
10. existing item-instance and food freshness round trips remain unchanged.

## Guardrails

- No cave-specific dropped-item manager.
- No second spatial-context type.
- Do not infer cave membership from X/Z alone.
- Do not persist runtime cave objects.
- Do not weaken `world-027` cross-space interaction filtering to make old drops reachable.
- Do not redesign item physics.
- Do not run browser verification; User owns browser verification.

Add JSDoc with `@domain items-player` to any new public placement/context seam whose ownership is not obvious.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

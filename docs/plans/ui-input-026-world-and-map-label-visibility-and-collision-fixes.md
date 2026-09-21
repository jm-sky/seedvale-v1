# Plan: World and map label visibility and collision fixes

**Created:** 2026-09-20
**Status:** `done` ✅
**Type:** fix
**Priority:** high · **Effort:** S
**Depends on:** none
**Domain:** `ui-input`
**Subdomains:** `hud` `feedback`
**Tags:** `labels` `map` `fauna` `locations`
**Roadmap:** -
**Model:** Sonnet, Composer

## Problem

Two label-presentation defects currently reduce readability and expose stale presentation state:

1. A dead animal can keep a visible world-space name label far beyond the normal fauna label range. Live fauna labels are distance-faded through the shared `AgentStatusLabelController`, but dead fauna returns from `AnimalAgent.update()` before the normal presentation tick. The corpse therefore retains the last opacity computed while it was alive.
2. The world map can render two labels at the same screen position for semantically colocated locations. The abandoned mine intentionally binds to a production cave and can share its entrance coordinates, while `WorldLocationCatalog` exposes both the cave and the mine as distinct known locations. `drawWorldMapFrame()` currently renders every known-location label directly with no semantic suppression or collision handling.

The fixes must preserve existing simulation ownership and avoid introducing a second location registry or a full presentation tick for dead fauna.

## Current code

### Fauna world labels

Relevant ownership and call sites:

- `src/ui/labelDistance.ts`
  - shared distance policy;
  - labels are fully readable to 20 world units and fade to zero by 32.
- `src/ui/agentStatusLabel.ts`
  - `AgentStatusLabelController.sync()` applies distance-derived opacity;
  - `settleAtZeroHp()` only zeroes HP/hides bars and does not update label opacity.
- `src/fauna/AnimalAgent.ts`
  - `tickPresentation()` computes observer distance and calls `labelController.sync()`;
  - dead animals enter the corpse branch in `update()` and return before `tickPresentation()`;
  - `collapse()` calls `settleAtZeroHp()`, leaving the existing name label DOM attached.

### World-map location labels

Relevant ownership and call sites:

- `src/world/caves/abandonedMineLandmark.ts`
  - `AbandonedMineLandmark` has distinct `mineId` and `caveId`;
  - an abandoned mine may intentionally reuse an existing eligible cave;
  - mine coordinates are the representative cave entrance coordinates.
- `src/world/locations/worldLocationCatalog.ts`
  - cave and abandoned-mine identities are projected as separate `WorldLocation` records;
  - `landmarksInRange()` / `stableLandmarksInRange()` may include both.
- `src/world/map/mapData.ts`
  - known locations remain separate map records and retain their stable ids.
- `src/ui-vue/lib/drawMap.ts`
  - `drawWorldMapFrame()` draws markers and labels independently for every known location;
  - no label-layout or same-anchor suppression exists.
- `src/ui-vue/lib/drawMinimap.ts`
  - nearby POIs are marker-only except active navigation-target labels; changes here should be limited to cases actually affected by the same overlap contract.

## Scope

### 1. Keep corpse labels distance-correct

Extend the existing fauna label presentation path so a dead, unharvested animal cannot retain stale label opacity after death.

Requirements:

- reuse the existing `labelOpacityForDistance()` / shared label controller policy;
- do not resume the full live `tickPresentation()` for corpses;
- do not tick locomotion animation, observation resolution, needs bars or other live-only presentation work just to refresh opacity;
- corpse label distance visibility must continue to react to the observer position while the corpse remains represented;
- harvesting/remains paths that already hide the label must remain hidden;
- revive/hydrate paths must restore the normal live-label path cleanly;
- the fix must not create a parallel corpse label DOM object.

Preferred ownership:

- expose the smallest reusable distance-only operation from `AgentStatusLabelController` if the current public shape cannot update opacity without the full `sync()`;
- call it from the existing dead/corpse branch in `AnimalAgent.update()`.

### 2. Resolve semantically colocated map locations before label drawing

Treat an abandoned mine bound to a cave as one physical map anchor for presentation while keeping both world identities intact.

Requirements:

- do not merge, delete or rewrite `WorldLocation`, `LocationKnowledge`, navigation targets or cave/mine semantic ids;
- when an `abandonedMine` location and its backing cave refer to the same physical entrance, the map must not draw two labels on top of each other;
- the abandoned-mine presentation is the primary visible map label/marker for that shared anchor;
- the cave remains independently resolvable by its stable id for systems that need cave identity;
- use the explicit `AbandonedMineLandmark.caveId` relationship rather than generic coordinate coincidence to identify this specific ownership case;
- keep the resolution at the map/presentation boundary or in a small reusable map-location presentation helper, not in world generation or authoritative location state.

### 3. Add bounded generic label collision handling

After semantic mine/cave suppression, prevent unrelated nearby POI labels from becoming unreadable when their projected text rectangles overlap.

Requirements:

- collision handling is presentation-only and deterministic for the same visible locations/view;
- markers remain at their true coordinates;
- prefer small vertical/horizontal label offsets or selective label suppression over moving authoritative points;
- do not perform unbounded iterative layout;
- keep complexity bounded by the small visible known-location set; avoid per-frame allocations beyond what the world-map overlay already tolerates;
- priority should be stable and explicit, for example:
  1. active navigation target,
  2. semantic primary location such as abandoned mine,
  3. confirmed over discovered/estimated,
  4. deterministic id tie-break;
- a hidden/offset label must not change click hit-testing, which continues to use actual location coordinates.

The implementation may keep this helper local to `drawMap.ts` if no second consumer benefits from it. Do not create a general-purpose UI layout subsystem for this fix.

## Architectural decisions

1. **Simulation truth stays unchanged.** Cave and mine remain separate semantic locations. The map decides how colocated semantic identities are presented.
2. **The abandoned mine owns presentation at its cave entrance.** The underlying cave is infrastructure for that landmark, so duplicate map labels are not useful information.
3. **Corpse lifecycle stays cheap.** Dead animals receive only the label-distance work necessary to avoid stale DOM presentation; they must not re-enter live animation/observation presentation.
4. **Shared distance policy remains authoritative.** Do not introduce corpse-specific magic distances when `labelDistance.ts` already owns fauna/NPC label fade.
5. **Marker collision and text collision are different.** The plan primarily guarantees readable labels. Marker clustering/replacement is only needed for the explicit mine/cave shared-anchor case.

## Likely files

Primary:

- `src/ui/agentStatusLabel.ts`
- `src/fauna/AnimalAgent.ts`
- `src/ui-vue/lib/drawMap.ts`

Potential supporting files only if needed by the chosen small contract:

- `src/world/map/mapData.ts`
- `src/world/map/mapTypes.ts`
- `src/world/locations/worldLocationCatalog.ts`
- `src/world/caves/abandonedMineLandmark.ts`
- relevant unit-test files beside these modules

Avoid changing authoritative world-location generation merely to fix map presentation.

## Tests

Add focused automated coverage for the underlying contracts.

### Corpse label

Cover at least:

- a live label follows the existing 20/32 distance policy;
- after death, moving the observer beyond the far threshold updates the corpse label to hidden/zero opacity;
- returning within range restores the corpse label if the corpse still has a visible label;
- harvested remains stay hidden;
- no live-only presentation state needs to run for the corpse-distance update.

Prefer testing a small controller/helper rather than requiring a full rendered game world when practical.

### Map labels

Cover at least:

- a mine bound to cave `X` and the `cave:X` map location produce one visible shared-anchor presentation, with the mine primary;
- an unrelated cave at another position remains visible;
- coordinate coincidence alone does not destroy semantic records;
- generic overlapping labels resolve deterministically;
- active navigation-target label priority is preserved;
- map click hit-testing still resolves locations from true coordinates rather than label offsets.

## Manual verification

User verifies in browser:

1. Kill a rat near the player, confirm its label is readable nearby, then move farther than the normal fauna label range; the corpse label must disappear instead of remaining visible at long distance.
2. Return toward the same unharvested corpse; the label should follow the normal distance fade/visibility contract.
3. Harvest/remove the corpse and confirm no stale label remains.
4. Discover/inspect an abandoned mine that shares its entrance with its backing cave. On the world map there should be one readable primary label at that point, not two labels on top of each other.
5. Inspect an area containing several nearby known POIs and confirm labels remain readable without changing marker positions or click targets.
6. Confirm navigation-target highlighting still identifies the correct location.

## Non-goals

- changing fauna corpse simulation, decay duration or persistence;
- changing the 20/32 world-label distance thresholds;
- redesigning NPC/fauna observation or perception;
- merging cave and abandoned-mine authoritative identities;
- changing cave generation or abandoned-mine placement;
- replacing the world map renderer;
- general marker clustering for dense settlements/NPCs;
- minimap redesign;
- unrelated label typography/style changes.

## Implementation guidance

Keep the change small and reuse current contracts. Add JSDoc with an appropriate `@domain` tag to any new public/architectural helper whose ownership would otherwise be unclear to preflight tooling.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Plan: World map player heading arrow

**Created:** 2026-09-21
**Status:** `verification needed` 🔍 (implemented 2026-09-21 — browser checks are user-owned)
**Model:** Sonnet, Composer
**Priority:** medium · **Effort:** S
**Depends on:** none
**Domain:** `ui-input`
**Type:** `polish`
**Subdomains:** `hud` `menus`
**Tags:** `world-map` `player-marker` `heading`
**Roadmap:** -

## Goal

Make the player arrow on the north-up full world map point in the direction the player is looking instead of always pointing toward canvas north.

The arrow represents **look heading (yaw)**, not movement direction. Walking backward or strafing must not change the represented heading.

## Current state

- `src/ui-vue/lib/drawMap.ts::drawWorldMapFrame()` draws the full world map north-up and renders the player as a fixed triangle pointing toward canvas up.
- `src/input/MouseLook.ts::LookState.yaw` already owns the player's look yaw.
- The minimap already receives yaw and is intentionally **heading-up**: `drawMinimapFrame()` rotates world content by yaw and keeps the player triangle fixed upward. Do not change that behavior.
- `src/ui-vue/store.ts` currently stores only `playerX` / `playerZ` for the world-map snapshot; `openWorldMap()` / `toggleWorldMap()` do not carry heading.

## Scope

1. Extend the existing world-map presentation state with the player's look yaw.
2. At every existing world-map open/toggle call site, pass the same authoritative `mouseLook.state.yaw` used by camera/minimap behavior. Do not derive heading from velocity, player mesh rotation, last movement, or camera position.
3. Extend `drawWorldMapFrame()` with player yaw and rotate only the player marker on the north-up map.
4. Preserve the existing world-to-canvas convention:
   - world `-Z` / north = canvas up,
   - yaw `0` must point the arrow north/up,
   - positive/negative yaw must map consistently with the existing minimap/camera convention.
5. Keep marker size, position, map pan/zoom, north marker, fog/discovery and navigation-target rendering unchanged.

## Relevant files / integration points

- `src/input/MouseLook.ts` — authoritative `LookState.yaw`; reuse only, no new heading state here.
- `src/app/gameLoop.ts` — existing world-map toggle path and access to `mouseLook`; forward yaw alongside player position.
- `src/ui-vue/store.ts` — `worldMap` UI state plus `openWorldMap()` / `toggleWorldMap()`; add yaw to the existing snapshot contract rather than creating another store.
- `src/ui-vue/screens/MinimapScreen.vue` — clicking the minimap also opens the world map; its open path must provide the last known heading as well as position. Extend the existing minimap snapshot if needed instead of introducing a separate per-frame Vue state.
- `src/ui-vue/lib/drawMinimap.ts` — already receives authoritative yaw each frame. If the minimap-click path needs heading, retain the latest yaw next to `lastMinimapPlayer()` (or extend that snapshot) so the world map opens with the same heading.
- `src/ui-vue/screens/WorldMapScreen.vue` — pass stored world-map yaw into `drawWorldMapFrame()`.
- `src/ui-vue/lib/drawMap.ts` — render the player triangle from yaw on the north-up canvas.

## Ownership / lifecycle

Yaw remains owned by `MouseLook.state`. The map UI stores only the heading snapshot required to render the modal after gameplay input has been released/paused. Do not make the map a second authority for player orientation.

The full map does not need a new per-frame subscription solely for this marker. Capture the current yaw when the map opens, matching the existing position snapshot lifecycle. If existing behavior later allows look direction to change while the full map remains open, that should use the same snapshot/update seam rather than independent orientation logic.

## Implementation constraints

- Reuse the existing yaw convention; do not add compass-degree conversion unless required purely inside drawing math.
- Do not rotate the full world map. It remains north-up.
- Do not alter minimap heading-up behavior.
- Do not infer facing from movement; stationary players must still have a meaningful arrow direction.
- Avoid new reactive once-per-frame state.
- Keep the change UI-only; no persistence/save migration is needed.
- Add focused tests for the yaw-to-arrow direction calculation if the drawing math is extracted into a testable helper. Prefer a small pure helper over canvas-pixel snapshot tests.
- Add JSDoc to any new shared/public heading helper or snapshot contract where it improves preflight discovery; use `@domain ui-input` when appropriate.

## Verification

Automated:
- typecheck/build/tests covering touched map helpers and call-site contracts,
- verify all `openWorldMap()` / `toggleWorldMap()` call sites compile with the heading argument,
- verify cardinal yaw cases map to expected north/east/south/west arrow directions.

Manual browser verification by the user:
- face north, east, south and west before opening the full map; arrow follows the look direction,
- rotate without moving, open map; arrow reflects the new heading,
- walk backward/strafe and open map; arrow still represents look direction rather than travel direction,
- open the full map by its normal shortcut and by clicking the minimap; both show the same correct heading,
- minimap behavior remains unchanged.

## Non-goals

- Rotating the world map with the player.
- Changing minimap orientation.
- Showing pitch/vertical look direction.
- Reworking player/camera orientation ownership.
- Persisting map heading in save data.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

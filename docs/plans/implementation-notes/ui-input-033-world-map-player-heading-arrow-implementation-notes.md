# Implementation Notes: World map player heading arrow

## Recon

The plan matches the current architecture, with two corrections:

- There are **three** real world-map open paths to update, not only the game-loop toggle:
  - `src/app/gameLoop.ts` — keyboard/minimap binding calls `vueUi.toggleWorldMap(...)`;
  - `src/app/createApp.ts` — pause-menu `onWorldMap` calls `vueUi.openWorldMap(...)`;
  - `src/ui-vue/screens/MinimapScreen.vue` — minimap click calls `openWorldMap(...)`.
- `drawMinimap.ts::lastMinimapPlayer()` currently retains only `x/z`, even though `updateRegisteredMinimap(..., yaw)` already receives authoritative yaw every frame. Extend that existing snapshot to include yaw; do not add Vue per-frame state.

## Concrete implementation

- `src/ui-vue/store.ts`
  - Extend `WorldMapState` and `ui.worldMap` with `playerYaw`.
  - Change `openWorldMap(playerX, playerZ, playerYaw)` and `toggleWorldMap(playerX, playerZ, playerYaw)`; snapshot all three values only when opening.
  - Yaw remains presentation state only. Do not persist it here or normalize it for storage.

- `src/app/gameLoop.ts`
  - Pass `mouseLook.state.yaw` to the existing `toggleWorldMap` call.

- `src/app/createApp.ts`
  - The pause-menu `onWorldMap` path bypasses `gameLoop.ts`; pass `mouseLook.state.yaw` here too.

- `src/ui-vue/lib/drawMinimap.ts` + `MinimapScreen.vue`
  - Retain `lastPlayerYaw` in `updateRegisteredMinimap()`.
  - Prefer extending `lastMinimapPlayer()` to return `{ x, z, yaw }` rather than adding a second getter. The click path then forwards the same last-drawn position/yaw snapshot to `openWorldMap`.

- `src/ui-vue/screens/WorldMapScreen.vue`
  - Pass `ui.worldMap.playerYaw` into `drawWorldMapFrame()`. Existing repaint/open lifecycle is sufficient; no watcher or frame subscription is needed.

- `src/ui-vue/lib/drawMap.ts`
  - Keep `worldToCanvas()`, viewport math and the north-up map untouched.
  - Convert yaw directly to the canvas direction using the same convention already proven by `drawMinimapFrame()`: **`dirX = -sin(yaw)`, `dirY = -cos(yaw)`**. This gives yaw `0` = north/up and follows the existing MouseLook/minimap sign convention.
  - Draw only the player triangle with that direction. A small pure exported/helper function for yaw → canvas direction is worthwhile because the cardinal cases can be unit-tested without mocking Canvas; do not introduce compass degrees or a general orientation subsystem.
  - Reuse the existing marker dimensions (tip 7 px, rear corners ±5 px) so this remains orientation-only polish.

## Tests / traps

- Add focused cardinal-direction tests for the pure yaw conversion: `0` → up, `π/2` → left, `π` → down, `-π/2` → right, matching the current MouseLook/minimap transform. Use epsilon comparisons.
- Search all `openWorldMap(` / `toggleWorldMap(` call sites after changing signatures; the pause-menu path in `createApp.ts` is easy to miss.
- Do not reuse player mesh rotation: `MouseLook.state.yaw` is the requested authority and can represent heading while stationary.
- Do not modify minimap rotation, north-rim marker, map pan/zoom, discovery/fog, navigation targets, save schema, or pointer-lock lifecycle.

No unfinished dependency blocks this plan. This is a small UI-only change with localized contracts.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

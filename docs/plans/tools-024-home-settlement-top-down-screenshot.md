# Plan: Home-settlement top-down screenshot

**Created:** 2026-11-04
**Status:** `planned`
**Type:** infrastructure
**Priority:** medium · **Effort:** S
**Depends on:** -
**Domain:** `tools`
**Subdomains:** `development` `diagnostics`
**Tags:** `settlement` `layout` `screenshot` `fly`
**Model:** Sonnet

## Goal

One command produces a **reproducible, north-up, straight-down PNG of the home settlement** (houses, plaza, roads/paths) for a given seed, so layout changes (village planner, roads Q44, palisade, pasture) can be compared before/after by eye or side by side. Fixed scale and framing per run parameters, so two shots from different commits are directly comparable.

Diagnostic only. No gameplay, worldgen, save or performance-path changes.

## Verified starting point (2026-11-04)

- `src/debug/flyCam.ts`: `?fly[=<agl>]` free-flight observer; `&flyPose=x,z,h,yaw,pitch`. `main.ts` boots `?fly` as a fresh world from `?seed=` (no save, no start screen); `createApp.ts:3722` disables autosave in fly mode. The hidden player rides on the ground under the camera, so chunk/settlement streaming follows the camera.
- `flyCam.update` builds `camera.lookAt(x - sin(yaw)·cos(pitch), y + sin(pitch), z - cos(yaw)·cos(pitch))` — at pitch = −π/2 the view direction is parallel to `camera.up` (0,1,0) and `lookAt` degenerates. A top-down mode must handle this (see §2).
- `src/debug/debugMode.ts` `isSystemEnabled` / `?debugDisableSystems=` already switches off `npcs`, `animals`, `weather` (clouds via `createSky.ts:97`, precipitation, ground fog), `grass`, `trees`, `playerModel`. **Reuse it; do not add per-system query params.**
- `src/world/dayNight.ts` `parseTimeOfDayFromUrl`: `?hour=12` pins the clock.
- `bundle.settlementsManager.getHomeDef()` gives home `x, z` (`SettlementDef`, `settlementGenerator.ts`).
- `window.__seedvaleReady = true` is set after the first world build (`createApp.ts:~3910`); it does **not** mean streaming around a moved camera is idle.
- `scripts/perf/run-benchmark-series.mjs` already drives native Chrome over CDP (fresh profile, WSL `d3d12` flags, `Runtime.evaluate`). The capture script follows the same pattern.

## Scope and design

1. **`flyPose=home`** (in `readFlyConfig`): pose resolved at init from `getHomeDef()` instead of literal coordinates. Optional suffix `flyPose=home,<agl>` overrides the height. `flyCam` needs a small resolver injected at creation (e.g. `resolveHome?: () => { x, z }`), wired in `gameLoop.ts:772` — do not import settlement code into `flyCam.ts`.
2. **Top-down camera** `?flyTop` (or implied by `flyPose=home`): yaw 0, pitch straight down, **north-up** (state in JSDoc which world axis is "up" on the image; pick so the image matches the in-game world map orientation). Fix the `lookAt` degeneracy by setting `camera.up` to the horizontal forward vector (or a fixed `(0,0,-1)`) while top-down, and restore it on dispose. Mouse look must not drift the shot: in top-down mode ignore look input (WASD/Space/Z may stay for manual use).
3. **Fixed framing.** Default AGL constant (e.g. 220 m — implementer verifies the whole home village incl. palisade/pasture fits at 1600×1600 with the default FOV), overridable via `flyPose=home,<agl>`. Optional `?flyFov=<deg>` (e.g. 30) for a near-orthographic look from higher up; make sure `camera.far` covers the altitude. Scale must not depend on village size (comparability) — no auto-fit.
4. **Fog / sky.** Check whether scene `Fog` (day/night + weather overlay) washes out the ground at the chosen AGL. If it does, add one name `fog` to `DebugSystemName` and honour it where scene fog is applied (`gameLoop.ts` ~L334) — same central switch, not a new param.
5. **Readiness hook** `window.__seedvaleFlyShotReady(): boolean` (registered only in fly mode, removed on dispose): true when `__seedvaleReady`, the camera is at its pose, chunk-manager has no pending/in-flight work around the player and home-settlement buildings are loaded, and that has held for N consecutive frames (e.g. 30). Find the existing pending-work/loaded queries on `chunkManager` and `settlementsManager`; add a tiny accessor only if none exists.
6. **Capture script** `scripts/tools/settlement-shot.mjs`:
   `node scripts/tools/settlement-shot.mjs <vitePort> <seed> <out.png> [--agl N] [--fov D] [--keep trees] [--hour H] [--size 1600]`
   - URL: `/?seed=<seed>&fly&flyPose=home[,agl]&flyTop&hour=12&debugDisableSystems=npcs,animals,weather,grass,playerModel[,trees][,fog]&gui=0`. Trees off by default (canopies hide houses); `--keep trees` keeps them.
   - Fresh Chrome profile (no localStorage graphics/world overlay), square window, same WSL GPU flags as the benchmark runner. Share the CDP helpers with `run-benchmark-series.mjs` by extracting them into a small module (e.g. `scripts/lib/cdp.mjs`) if that stays trivial; otherwise copy minimally — do not refactor the benchmark runner beyond the import.
   - Wait for `__seedvaleFlyShotReady()` (timeout → non-zero exit, no partial PNG), hide all DOM except the WebGL canvas (injected CSS), `Page.captureScreenshot` PNG, write file. Print seed, git SHA, URL and home `x,z` (expose via the ready hook or a sibling getter) so the shot is traceable.
   - `package.json` alias `tools:settlement-shot`.
7. **Docs.** `docs/CODE_INDEX.md` routing line if there is a debug/tools section, fly-mode params in the owning state doc (where `?fly` is already documented — grep), a short usage block in this plan's implementation notes.

## Constraints and non-goals

- No change to normal play: everything gated by `?fly`. No new per-frame work outside fly mode.
- No orthographic camera / separate renderer / offscreen pipeline — the existing perspective camera with narrow FOV is enough.
- No image diffing, overlays or annotations (follow-up if wanted).
- Do not edit `src/` while a benchmark is running.

## Done when

- Unit tests: `readFlyConfig` parses `flyPose=home`, `flyPose=home,300`, `flyTop`, `flyFov`; top-down camera basis is non-degenerate (camera looks along −Y, image up = chosen north).
- `pnpm run type-check`, `lint:fix`, relevant `vitest` green.
- **Browser-verified:** the script produces a PNG for seed `415424794` with the whole home village visible, no NPCs/animals/clouds/HUD; run it twice → visually identical framing. Commit the two reference shots (`415424794` and `42`) under `docs/research/v1-revival/settlement-shots/` (sibling of tools-023's `continent-previews/`) and link them from the implementation notes.
- If the browser run cannot be done in-session, mark implemented/technically verified and add a queue §2 row.

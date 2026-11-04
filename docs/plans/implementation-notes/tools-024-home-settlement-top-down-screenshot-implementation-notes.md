# Implementation notes — tools-024 home-settlement top-down screenshot

## What landed

- `src/debug/flyCam.ts`: `readFlyConfig` parses `flyPose=home[,agl]` (resolved at init through an injected `FlyShotHooks.resolveHome`), `flyTop` (implied by `flyPose=home`) and `flyFov`. `aimFlyCamera()` (exported, unit-tested) points the camera straight down with `camera.up = (0,0,-1)`, avoiding the `lookAt` degeneracy; look input and yaw are ignored in top mode. `camera.far` is raised with altitude; `up`/`fov`/`far` are restored on dispose.
- `src/app/gameLoop.ts`: injects the home resolver (`settlementsManager.getHomeDef()` x,z) and a streaming probe (`chunkManager.loadedChunkCount()` signature + `settlementsManager.home !== null`); fog is pushed out of range when `fog` is disabled.
- `src/debug/debugMode.ts`: new `DebugSystemName` `fog` (reuses `?debugDisableSystems=`). Needed: at 150-220 m the scene fog turned the whole frame into flat fog colour.
- `window.__seedvaleFlyShotReady()` (fly mode only): `__seedvaleReady` + home settlement built + loaded-chunk count unchanged for 30 frames. `window.__seedvaleFlyShotInfo()` returns home x,z, camera position, AGL, FOV for traceability.
- `scripts/tools/settlement-shot.mjs` + `package.json` alias `tools:settlement-shot` (CDP helpers copied minimally, benchmark runner untouched).
- Tests: `src/debug/flyCam.test.ts`.

## Usage

```text
pnpm dev                                   # note the port (5577 by default)
pnpm tools:settlement-shot 5577 415424794 docs/research/v1-revival/settlement-shots/home-415424794.png
  [--agl 150] [--fov 30] [--keep trees,fog] [--hour 12] [--size 1600] [--timeout 180]
```

URL it opens: `/?seed=<seed>&fly&flyPose=home[,agl]&flyTop&hour=12[&flyFov=D]&debugDisableSystems=npcs,animals,weather,grass,playerModel,trees,fog`. Exit code non-zero (no PNG) on timeout or software rasterizer.

## Defaults and orientation

- Default AGL **150 m**, FOV 60 (camera default) -> ~173 m ground footprint at 1600x1600. 220 m made the village only ~20% of the frame width.
- **North-up**: image up = world -Z, image right = +X (yaw 0 forward is -Z).
- Perspective camera, so tall buildings lean slightly away from the centre; use `--fov 30 --agl 300` for a flatter look.

## Verification

- Implemented: yes.
- Technically verified: `pnpm run type-check`, `pnpm run lint:fix`, `pnpm vitest run src/debug` (config parsing, camera basis looking along -Y with image-up -Z).
- Browser-verified (WSL2 Chrome, D3D12, against the already-running dev server on :5577): seed 415424794 (home x=13.8 z=-13.2) twice and seed 42 (home x=8.5 z=22.7). Observed: houses, paths, farm plots, coast and river visible; no NPCs, animals, clouds, HUD or fog wash-out; both 415424794 runs show identical framing and terrain/building placement. References: `docs/research/v1-revival/settlement-shots/home-415424794.png`, `home-42.png`.

## Known limits

- `trees` in `debugDisableSystems` does not remove every tree: some canopies/dead trees still render (seed 42 village is partly hidden by them). Other tree render buckets are outside this plan's scope.
- Pixel-identical PNGs are not guaranteed (animated tree sway/shadow noise); framing and layout are.
- Distant terrain at the frame edge is lower LOD (blurrier) and a dark ocean disc / sky dome is visible beyond the coast.

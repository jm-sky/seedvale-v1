# Plan: Snow patch thresholds and grass burial

**Created:** 2026-10-26
**Status:** `verification needed` 🔍
**Implemented at:** 2026-10-26
**Type:** feature
**Priority:** medium · **Effort:** M
**Depends on:** ~~133~~
**Domain:** `world-terrain`
**Subdomains:** `terrain` `vegetation` `rendering`
**Tags:** `snow` `grass` `shader` `weather`
**Roadmap:** -

## Goal

Drive gradual, spatially coherent snow accumulation and melting across terrain and grass from V1's existing `computeSurfaceWeather().snowAmount`, adapting V3's world-anchored threshold field (VIS-07 / R3 C11). Do not replace weather simulation or the grass placement system.

## Current state / recon

- `computeSurfaceWeather` already yields deterministic global `wetness` / `snowAmount`.
- Terrain uses a soft continuous albedo blend (`uSnowAmount × flat × noise`) in `buildChunkGeometry.ts`.
- Grass (`grass.ts`) has day/night and wind uniforms but no snow burial.
- V3 donor: `snowField.ts` threshold model, terrain snow bias, grass bury/frost — presentation only.

## Scope

1. Port adapted snow threshold field into `src/terrain/snowField.ts` (TS + GLSL twins, inline lattice hash).
2. Replace soft terrain snow cover with monotone patch reveal; suppress wet/puddle under snow; keep wetness when snow is absent.
3. Shader-level grass burial + tip frost on the shared grass material; near/mid/far LOD share one program.
4. Share the same `uSnowAmount` uniform object between terrain and grass.
5. Optional `?snow=<0..1>` debug override on the existing surface-weather push path.

## Constraints

- Keep `computeSurfaceWeather` as snow-mass authority; no V3 weather machine; no 5s presentation step.
- Cover field must be world-anchored and camera-independent (`detail = 1`, no view-distance bias fades).
- Flat / steep / altitude biases only (no litter/worn — V1 has no cover map).
- No grass geometry regeneration; no new save fields; no tree/roof/character snow; no new precipitation.

## Non-goals

- Seasonal ground/grass palettes (`world-terrain-009`).
- Crown/bush snow, wind coherence, particles, new weather types.
- V3 grass system replacement.

## Verification

### Automated

- Monotone accumulate/retreat at fixed positions; world-anchor stability; coverage-band fractions.
- Terrain/grass coverage consistency helpers; deterministic twin evaluation.
- Existing weather and grass placement tests remain green; typecheck/build pass.

### Browser / manual

Fixed seed + camera via `?snow=` steps 0 / light / medium / heavy / melt / clear. Confirm terrain↔grass agreement, no chunk-boundary popping, no floating grass, rain/clear intact. Report UNVERIFIED if GPU/browser unavailable.

**2026-10-26:** automated tests + `vite build` passed; browser/FPS **UNVERIFIED**.

# Implementation notes: world-037 — Audio spatial context isolation

Recon baseline: current `main` (2026-09-21), including audit 22 and completed `world-027`.

## Current-code conclusions

- The audit finding is still present. `src/audio/createWorldAudio.ts::playAtCancelable()` derives only distance. Missing `position.y` is replaced with listener Y, so an X/Z-only source has no independent vertical or cave identity.
- The plan names `src/world/worldSpatialContext.ts`, but the implemented canonical contract is `src/world/spatialContext.ts`: `WorldSpatialContext`, `WORLD_SPATIAL_CONTEXT_SURFACE`, `caveSpatialContext()`, `spatialContextsEqual()`.
- Cave membership for gameplay identity is already owned by `Caves.spatialContextAt(x,y,z)`. It is stateless, derives `surface | cave(caveId)` from actual XYZ, and intentionally reports the open-sky cave mouth as `surface`.
- Do not use `Caves.queryInterior(..., 'player')` for one-shot gating. That signal is intentionally hysteretic for ambience/fog and does not carry same-cave identity. Existing ambient/weather cave mixing should remain unchanged.
- `WorldAudio` is app/session-owned, created in `createApp.ts` before `createWorldBundle()`, and survives `WorldBundle` rebuilds. Any cave-context dependency therefore must be late-bound and read the current `bundle.caves` at playback time; do not capture the initial `Caves` instance.

## Recommended contract

Keep the change at the `WorldAudio` boundary.

1. Extend `WorldSoundPosition` only as much as needed to represent either:
   - real XYZ (`y` present), from which the injected resolver can derive context; or
   - an explicit `WorldSpatialContext` for legitimate X/Z-only synthetic/surface-owned sources.
2. Inject one `resolveSpatialContextAt(x,y,z)` provider into `createWorldAudio()` (or an equivalent narrow provider). The provider should be late-bound in `createApp.ts` because audio is constructed before the world bundle.
3. In `playAtCancelable()`:
   - resolve listener context from the listener's real world XYZ;
   - resolve source context from explicit context first, otherwise from source XYZ when Y exists;
   - reject before distance calculation when both contexts are known and `spatialContextsEqual()` is false;
   - then keep the existing distance/max-distance/gain path unchanged.
4. Keep unknown-context fallback explicit and backward-compatible (distance-only), but migrate every known world source that currently lacks Y/context. Unknown must not become a hidden substitute for "surface".

A small pure helper for the compatibility decision is worthwhile because the important cases are semantic, not WebAudio behavior. It should cover same surface, same cave id, different cave ids, surface↔cave, and unknown fallback.

## Composition / lifetime

`createApp.ts` cannot directly close over a not-yet-initialized `bundle` at `createWorldAudio(camera)` construction time. Use the same late-binding pattern already common in this file: an indirection whose target is assigned after the initial bundle exists, while the callable itself remains stable.

After initial world creation, have that resolver read `bundle.caves.spatialContextAt(...)` lazily. This is important for `rebuildWorldBundle()`: audio must automatically follow the replacement cave runtime without re-creating `WorldAudio`.

Do not move `WorldAudio` into `WorldBundle`.

## Call-site audit: confirmed cases

Mesh-backed sources are already in good shape because they pass live `Vector3` positions with Y: NPC voice/barks, most fauna vocalization and combat helpers. Once `WorldAudio` owns context resolution, those callers should not learn about `Caves`.

Known X/Z-only seams on current `main` that need deliberate treatment:

- `src/app/actions/gatheringActions.ts` — fishing cast;
- `src/app/actions/groundActions.ts` — mine/dig action sounds;
- `src/app/actions/placementActions.ts` — well construction;
- `src/app/createApp.ts::onAnimalDeathSound` — currently drops Y before calling `playAnimalCombatDeath`;
- `src/audio/ambientEvents.ts` — owl source is a transient player-relative X/Z offset, not persistent world truth.

Prefer forwarding an already-known real Y when it exists. For inherently surface-owned actions, explicit `WORLD_SPATIAL_CONTEXT_SURFACE` is clearer than inventing Y. For the owl, preserve its current ambient ownership: it is already suppressed while cave ambience is active, so give it an explicit compatible context rather than adding a cave query inside `ambientEvents.ts`.

Do a final repo search for `PlayAt`, `PlayAtCancelable`, `.playAt(` and helper calls before implementation; the list above is representative, not a substitute for that search.

## Pitfalls

- Do not compare `WorldSpatialContext` objects by reference; use `spatialContextsEqual()`.
- Do not treat all caves as one context. `caveId` matters: cave A must not hear cave B merely because both are underground.
- Do not derive source context from listener Y. That is the current bug.
- Do not sample terrain height merely to manufacture Y for a cave-capable source; use authoritative source XYZ or explicit known context.
- Keep `playOnce()` entirely outside this mechanism; UI/inventory/global non-world sounds are intentionally non-spatial.
- Do not fold `world-038` lifecycle/cache work into this plan.
- Preserve `maxDistance` semantics (notably wolf howl) and the current start-time-only gain model.

## Tests

Prefer focused unit coverage in/near `createWorldAudio.test.ts` or a small pure spatial-audio helper test. Mock/avoid browser AudioContext where possible.

Minimum useful cases:

- surface→surface allowed;
- same `caveId` allowed;
- different cave ids rejected;
- surface↔cave rejected both ways;
- unknown-context fallback behaves exactly as documented;
- compatible playback still uses existing `distanceGain()` and custom `maxDistance`.

No browser verification by the implementation agent.

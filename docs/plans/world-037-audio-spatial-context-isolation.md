# Plan: Audio spatial context isolation

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** medium · **Effort:** S  
**Depends on:** ~~world-027~~  
**Domain:** `world`  
**Subdomains:** `simulation` `places`  
**Tags:** `audio` `caves` `spatial-context`  
**Type:** `fix`  
**Roadmap:** -

## Goal

Prevent world one-shot audio from leaking between incompatible surface/cave spaces while keeping the existing shared `WorldAudio` mixer, distance attenuation and consumer APIs as intact as practical.

This is a correctness fix for spatial identity, not a request for HRTF, stereo panning or a new audio engine.

## Confirmed current problem

Audit 22 verified that `WorldAudio.playAt()` / `playAtCancelable()` only calculate start-time distance.

- They do not consume the canonical world spatial context introduced by world-027.
- A missing source `y` is replaced with listener Y, making that trigger XZ-only.
- Even sources with Y can be accepted through a cave roof because physical distance alone is the only validity rule.
- NPC voice, fauna vocalization, action/combat and other world one-shots all reuse this shared path.

The cave ambient/weather paths already receive the authoritative player cave-interior state and must remain the reference for environment ownership; do not introduce a second cave detector.

## Scope

1. Define the smallest source/listener spatial-context contract needed by world audio.
2. Reuse current `WorldSpatialContext` / cave authority rather than duplicating cave membership.
3. Gate world one-shots when source and listener are in incompatible spaces.
4. Audit call-sites that currently provide only `{ x, z }`; supply real Y/context where the source is genuinely world-located and available.
5. Preserve ordinary distance attenuation after the context gate.
6. Preserve `playOnce()` for non-world/UI sounds.
7. Add pure/unit coverage for surface↔surface, cave↔same-cave, surface↔cave and missing-context fallback decisions.

## Architectural decisions

- Do **not** create an audio-specific cave registry.
- Do **not** require `THREE.PositionalAudio`; the current gain-at-trigger implementation may remain.
- Do **not** attach persistent Audio nodes to NPC/fauna meshes.
- Prefer a narrow injected context resolver/provider at the `WorldAudio` boundary over teaching each sound helper about `Caves`.
- Missing/unknown context must have an explicit policy. Do not silently interpret unknown Y/context as “same space” for call-sites that are known world sources.
- UI/inventory sounds remain non-spatial and must not be affected.
- Keep simulation independent of audio: audio must query presentation context, never mutate world state.

## Files / symbols to inspect first

- `src/audio/createWorldAudio.ts`
  - `WorldSoundPosition`
  - `PlayAt`
  - `PlayAtCancelable`
  - `playAtCancelable()`
- `src/world/worldSpatialContext.ts` and world-027 implementation
- `src/app/createApp.ts` / `src/app/gameLoop.ts` for composition and current player cave context
- representative callers:
  - `src/audio/npcVoicePlayback.ts`
  - `src/audio/animalSounds.ts`
  - `src/audio/actionSounds.ts`
  - `src/app/actions/groundActions.ts`

Use repo search for all `PlayAt` / `worldAudio.playAt` call-sites before changing the contract.

## Non-goals

- subjective audio tuning,
- new sound assets,
- music,
- HRTF/full positional panning,
- occlusion/reverb simulation,
- changing NPC/fauna behaviour,
- redesigning world-027 spatial context,
- replacing the shared WorldAudio bus/mixer.

## Verification

Automated:

- context compatibility is pure/testable;
- surface source is rejected for cave listener and vice versa;
- compatible same-space sources retain current distance gain;
- existing max-distance overrides (for example wolf howl) still work;
- UI/non-world `playOnce` is unchanged;
- type-check and focused audio/cave tests.

Manual browser verification is performed by the User:

- stand in a cave below nearby surface NPC/fauna/action activity — incompatible surface one-shots do not leak through the roof;
- exit the cave — normal nearby audio resumes;
- same-space cave/world sounds remain audible at expected distance;
- NPC/fauna/action audio outside caves behaves as before.

Add JSDoc to any new public spatial-audio contract when it materially improves preflight discovery; use `@domain world`.

Do not run browser verification.  
Do not run `pnpm docs:sync`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Plan: WorldAudio async lifecycle and cache recovery

**Created:** 2026-09-20  
**Status:** `verification needed` 🔍  
**Priority:** medium · **Effort:** S  
**Depends on:** none  
**Domain:** `world`  
**Subdomains:** `simulation`  
**Tags:** `audio` `lifecycle` `loading` `cache`  
**Type:** `fix`  
**Roadmap:** -
**Model:** Sonnet, Composer

## Goal

Make `WorldAudio.dispose()` terminal for all audio work it owns and allow a later request to recover from a transient audio load/decode failure without losing the existing per-URL in-flight/success cache.

## Confirmed current problems

Audit 22 verified two issues in `src/audio/createWorldAudio.ts`.

### 1. Pending/playing one-shots are not owned by WorldAudio teardown

Loops are tracked in `activeLoops`, but one-shots are not.

A pending `playOnceCancelable()` can resolve after `WorldAudio.dispose()` and still call `sound.play()`. Fire-and-forget `playOnce()` discards the only stop handle, so teardown cannot explicitly stop/disconnect it.

Disconnected buses usually make this inaudible, but the owner still creates WebAudio work after disposal and already-started fire-and-forget clips are not explicitly terminated.

### 2. A rejected buffer promise is cached permanently

`bufferCache` stores `Promise<AudioBuffer>` and never evicts failures. One transient fetch/decode failure therefore makes every later request for that URL reuse the same rejection until the JS module/session is recreated.

## Scope

1. Give one-shots explicit bounded ownership under a WorldAudio instance:
   - pending load/decode callbacks must observe disposed/stale state;
   - active one-shots must be stoppable/disconnectable from owner teardown;
   - naturally ended sounds must remove themselves from tracking.
2. Preserve per-call `ActiveSound.stop()` semantics for interruptible consumers.
3. Harden `loadBuffer(url)` so:
   - concurrent requests still share one in-flight promise;
   - successful buffers stay cached;
   - a rejected promise removes only itself from the cache, permitting a later retry.
4. Keep the module/shared buffer-cache benefit unless implementation recon proves an app-owned cache is required for correctness.
5. Add focused unit coverage with mocked audio/loader seams; do not require browser AudioContext tests.

## Architectural decisions

- One lifecycle owner: `WorldAudio`. Do not add separate one-shot registries in NPC/fauna/action helpers.
- A dispose/generation guard and a small active-one-shot set are acceptable; do not build a generic resource manager.
- Avoid double-disconnect/double-stop hazards: `stop()`, natural `onEnded` and owner `dispose()` must be idempotent with respect to registry cleanup.
- A stale async callback after dispose must perform no `play()`.
- Cache rejection eviction must be identity-safe: an older rejected promise must not delete a newer retry entry if the implementation can overlap generations.
- Do not change audio volumes, spatial rules or sound-selection logic in this plan.
- Do not introduce a second `AudioContext` or loader stack.

## LoadingManager note

Current Three r185 behaviour is verified:

- `new AudioLoader()` defaults to `THREE.DefaultLoadingManager`;
- decode registers `<url>#decode` as a manager item.

Seedvale currently has no app callback consumer of that manager, so this plan must **not** introduce a custom `LoadingManager` merely to remove the marker. Only change manager ownership if implementation recon finds a concrete lifecycle/test requirement.

## Files / symbols to inspect first

- `src/audio/createWorldAudio.ts`
  - module `audioLoader`
  - `bufferCache`
  - `loadBuffer()`
  - `createLoop()`
  - `playOnceCancelable()`
  - `playOnce()`
  - `playAtCancelable()`
  - `dispose()`
- `src/app/createApp.ts` teardown ordering
- interruptible consumers:
  - `src/ai/NpcAgent.ts`
  - `src/app/gameLoop.ts` bow-draw lifecycle

## Non-goals

- cave/surface spatial isolation — `world-037`;
- new audio assets or tuning;
- music;
- changing NPC voice semantics;
- changing fauna vocalization policy;
- broad LoadingManager/startup-screen refactor;
- clearing successful decoded buffers on every WorldBundle rebuild.

## Verification

Automated tests should prove:

1. two concurrent loads for one URL share one loader/decode request;
2. successful result remains cached;
3. failed result is evicted and a later request retries;
4. disposed pending one-shot never calls `play()` after its buffer resolves;
5. owner dispose stops/disconnects currently active one-shots;
6. natural end removes tracking without making later owner dispose unsafe;
7. explicit `ActiveSound.stop()` remains idempotent;
8. existing loop stale-load guard remains correct.

Run focused Vitest + type-check as appropriate during implementation.

Manual browser verification is performed by the User; the implementation agent must not run browser verification.

Do not run `pnpm docs:sync`.

## Implementation status (2026-09-21)

Implemented on `main`: one-shot owner tracking + dispose guards, rejected `loadBuffer` cache eviction, `createWorldAudio.test.ts` lifecycle/cache coverage. Spatial gating from world-037 preserved. Automated checks pass; browser verification pending (user).

> **Zrób git commit i push do main, rebase jeżeli trzeba**

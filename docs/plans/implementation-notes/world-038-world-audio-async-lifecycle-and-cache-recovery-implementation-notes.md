# Implementation notes: world-038 — WorldAudio async lifecycle and cache recovery

Recon baseline: current main (2026-09-21), including audit 22. The two defects in the plan are still present in src/audio/createWorldAudio.ts.

## Current ownership / lifecycle

- WorldAudio is app/session-owned in createApp.ts, not part of WorldBundle; bundle rebuilds deliberately reuse the same listener, buses and module-level decoded-buffer cache. Keep that boundary.
- Full app teardown already disposes ambientAudio, fireAudio and weatherAudio, clears UI/NPC audio callbacks, then calls worldAudio.dispose(). No caller-side registry is needed.
- Loops already use activeLoops.has(entry) as their stale-load guard. One-shots need equivalent owner lifetime semantics; do not move this responsibility into NPC/fauna/action helpers.
- Existing interruptible consumers must keep their handles: gameLoop.ts owns bowDrawSound; NpcAgent owns playerReactionVoice and stopPlayerReactionVoice(). Owner teardown stopping a sound must make a later consumer .stop() harmless.

## Recommended one-shot shape

Keep this local to createWorldAudio().

Use a small tracked entry per requested one-shot, e.g. an activeOneShots set whose entry owns the THREE.Audio and one idempotent cleanup/stop path. Register the entry before loadBuffer() so pending requests are also owner-owned.

Important semantics:

- The async success callback should first check that the entry is still live (and/or the WorldAudio instance is not disposed) before setBuffer()/play().
- Natural sound.onEnded should remove the entry and disconnect exactly once.
- Returned ActiveSound.stop() should remove the entry, stop only when playing, and disconnect; repeated calls are no-ops.
- WorldAudio.dispose() should invalidate the instance first, then drain active/pending one-shots through the same idempotent cleanup path before disconnecting buses/listener.
- After dispose(), public playback calls should not create new WebAudio work. A disposed guard at createLoop() / playOnceCancelable() is preferable to relying only on callbacks; return the existing no-op handles where required.
- For a load rejection, remove/disconnect the one-shot entry as well as logging the warning. Otherwise a failed pending request would remain in the owner set until app teardown.

Do not add per-frame work for one-shots. update() should remain loop-only.

For loops, preserve the existing stale-load mechanism, but make post-dispose createLoop() inert as above. Existing loop-handle dispose() currently calls sound.stop() unconditionally; avoid broad unrelated refactoring unless tests expose a Three.js double-stop issue.

## Buffer cache recovery

Keep audioLoader and bufferCache module-level. This is intentional across WorldAudio instances and WorldBundle rebuilds.

Implement rejection eviction around the exact promise inserted into the map:

- create the load promise;
- store that exact promise under url;
- attach rejection handling that deletes only when bufferCache.get(url) === thatPromise;
- rethrow so existing caller catch paths still log/handle failure.

This preserves one in-flight request per URL, permanent successful caching, retry after transient failure, and identity safety if a newer entry ever replaces the failed one.

Do not clear successful cache entries in WorldAudio.dispose(), and do not introduce a custom LoadingManager; current Seedvale code has no consumer of DefaultLoadingManager progress.

## Test seam

Current audio coverage only has the pure src/audio/distanceGain.test.ts; there is no WorldAudio lifecycle test harness. Avoid real browser AudioContext.

Prefer a narrow injectable/module-private test seam for loader + Audio/AudioListener construction, or Vitest mocks for three, sufficient to observe loadAsync, play, stop, disconnect and onEnded. Do not expose production cache-reset APIs merely for tests if module isolation/reset can provide a fresh cache.

High-value cases beyond the plan checklist:

- failed one-shot is removed from owner tracking and does not make later dispose() double-clean it;
- calling a previously returned ActiveSound.stop() after owner dispose() is harmless;
- playback requested after owner dispose() is inert;
- rejection eviction does not delete a replacement promise.

## Interaction with world-037

world-037 also changes createWorldAudio.ts / playAtCancelable(). Keep world-038 ownership/cache logic independent of spatial-context gating. If world-037 lands first, preserve its early no-op rejection path and late-bound spatial resolver; do not duplicate or undo that work.

## Scope guardrails

No createApp.ts teardown reorder is required by current code. No persistence/save change, no WorldBundle change, no audio asset/tuning change, no worker, no new generic resource manager.

No browser verification by the implementation agent.

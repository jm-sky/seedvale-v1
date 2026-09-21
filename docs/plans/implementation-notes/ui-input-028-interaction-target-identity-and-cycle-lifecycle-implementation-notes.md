# Implementation notes: ui-input-028 — Interaction target identity and cycle lifecycle

**Plan:** `docs/plans/ui-input-028-interaction-target-identity-and-cycle-lifecycle.md`  
**Recon basis:** current `main`, 2026-09-21

## Current-code decisions

### 1. Non-combat cycle commitment must be a stable key, not an index

Current `gameLoop.ts` keeps:

- `cycleActive: boolean`
- `cycleIndex: number`
- `gazeStableTargetKey: string | null`

and rebuilds `cycleCandidates` every frame from `rankInGaze(...).map(entry => entry.candidate)`. The bug is real: while `cycleActive` is true, `target = cycleCandidates[cycleIndex]`, so candidate insertion/removal/reordering can silently retarget without Tab.

Use `interactableStableKey()` as the committed identity. Keep the current ranked array only as ordering. Each frame:

- resolve the committed key against current `cycleCandidates`;
- if absent, clear cycle commitment and fall back to ordinary gaze/skill targeting that frame;
- when Tab is pressed and the committed key still exists, advance from its **current** index;
- when no valid commitment exists, start from ranked index 0.

Do not retain a numeric index as authority. A local derived index is fine for display/advance.

A small pure helper in `src/interaction/` is justified if needed for tests (resolve key + advance key); do not turn it into a manager or second state owner.

### 2. Cycle hint must follow resolved identity

The current hint uses `cycleIndex + 1` directly.

After the refactor, derive the shown position by locating the currently resolved target/key in the current ranked candidates. Do not show a stale slot after churn. If the selected target is outside `cycleCandidates` (for example a targeted-skill screen pick / dig fallback), avoid inventing an index.

### 3. Rebuild lifecycle seam already exists — use it directly

`world-033` is implemented on current `main`.

`createApp.ts::rebuildWorld()` now:

1. claims `worldRebuildLifecycle.beginRebuild()`;
2. cancels active player intent;
3. currently calls `gameLoop.forgetHighlight()`;
4. rebuilds;
5. resumes only after a `'published'` outcome.

So replace/extend the existing `forgetHighlight()` seam rather than adding another rebuild hook or generation signal. The new GameLoop method should clear all interaction-selection runtime state before the old bundle is disposed:

- non-combat committed cycle key;
- `gazeStableTargetKey`;
- highlighted runtime reference **without requiring mutation of the old agent** (preserve the intent of current `forgetHighlight()`);
- `playerCombat.setWorldCycleActive(false)`;
- `playerCombat.setWorldCycleIndex(0)`.

Do **not** reset `playerCombat.softLockId()` or `livingCycleIndex()` under this plan; those are the living-combat targeting path the plan explicitly preserves.

`PlayerCombat` is long-lived and its world-cycle fields currently survive rebuild, so this reset is necessary rather than speculative.

### 4. Remove the second highlight target selection

Current `gameLoop.ts` builds an agent-only `gazeCandidates` list and calls a second `pickInGaze()`, then falls back from `interactableAgent(target)` to that independently picked agent.

Delete that fallback. Highlight must project from the already-selected semantic `target`:

- normal mode: `interactableAgent(target)`;
- targeted-skill mode: keep the current guard that requires a valid `skillAction`;
- non-agent target (well, prop, etc.): highlight `null`.

This keeps prompt, dispatch and highlight on one target and also removes one redundant per-frame gaze ranking pass.

### 5. Preserve the existing selection pipeline

Do not alter:

- `buildInteractables()` ownership or ephemeral adapters;
- `filterInteractablesSameSpatialContext()`;
- `rankInGaze()` ordering, `isActionable`, stable-key tie-breaks or per-candidate `interactRange`;
- `pickInGaze()` hysteresis for ordinary gaze;
- mounted `target = null`;
- targeted-skill screen picking;
- domain dispatch/validation.

The cycle key is only a runtime commitment layered over the existing ranked list.

## Files / symbols that matter

- `src/app/gameLoop.ts`
  - `cycleActive/cycleIndex` block around non-combat Tab handling;
  - `gazeStableTargetKey`;
  - `gazeCandidates` + second `pickInGaze()`;
  - `interactableAgent()`;
  - `GameLoop.forgetHighlight()`.
- `src/interaction/interactionView.ts::interactableStableKey()` — canonical semantic identity; reuse as-is.
- `src/interaction/findInteractionTarget.ts::rankInGaze()/pickInGaze()` — ordering + gaze hysteresis; do not fork.
- `src/player/playerCombat.ts` — long-lived `worldCycleActive/worldCycleIndex`; no dedicated reset API exists today.
- `src/app/createApp.ts::rebuildWorld()` — already-established world-033 invalidation point.
- `src/app/worldRebuildLifecycle.ts` — read-only context for this task; do not modify unless implementation reveals a real lifecycle defect.

## Tests

Prefer testing the stable-cycle transition logic as pure data rather than instantiating `createGameLoop()`.

Required cases:

1. committed B + A disappears/reorders → B remains committed;
2. committed B disappears → commitment clears, no numeric-slot retarget;
3. new candidate sorts before B → B remains committed;
4. Tab advances from B's **current** position;
5. rebuild reset clears non-combat cycle key, gaze hysteresis key and PlayerCombat world-cycle state.

Keep existing `findInteractionTarget.test.ts` hysteresis/ranking coverage unchanged. For the mixed NPC + well regression, the implementation should make it structurally true by removing the second agent-only pick; add a focused helper test only if this can be done without heavy GameLoop mocking.

## Pitfalls

- Do not use object identity for cycle continuity: `Interactable` instances are rebuilt every frame.
- Do not keep both key and index as competing authorities.
- Do not clear the commitment merely because sort order changed; only disappearance/ineligibility invalidates it.
- Do not reuse `gazeStableTargetKey` as the active cycle owner. Gaze hysteresis and explicit Tab commitment are different state with different invalidation semantics.
- Do not add a world-rebuild callback registry for this; `createApp.ts` already owns the required reset call-site.

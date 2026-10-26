# Implementation notes: world-033 — WorldBundle rebuild transaction and lifecycle safety

**Plan:** `docs/plans/archive/world-033-worldbundle-rebuild-transaction-and-lifecycle-safety.md`
**Recon basis:** current `main`, 2026-09-20

## Decision

Fix this at the two seams the plan names — `rebuildWorldBundle()`'s publish step and `createApp.ts`'s composition root — and nowhere else. No second world-state owner, no per-subsystem `if (rebuilding)` guards.

1. `rebuildWorldBundle()` (`src/app/worldBundle.ts`) becomes a real transaction: build the fresh world, re-check the caller's staleness predicate **right before** `Object.assign(bundle, fresh)`, and return a `WorldBundleRebuildOutcome` (`'published' | 'stale' | 'failed'`) instead of assuming success. `'stale'`/`'failed'` dispose the fresh world (or whatever of it exists) and never touch `bundle`.
2. `createApp.ts` gets one lifecycle signal, extracted as a small pure state machine (`src/app/worldRebuildLifecycle.ts`, plan-suggested — the "small extracted lifecycle/transaction coordinator" the plan's Tests section asks for so it's unit-testable without Three.js). `gameLoop.tick()` reads it through one `isWorldValid()` gate at the top of the frame; `rebuildWorld()` reads/owns state transitions; app teardown always wins.

## Verified ownership and confirmed failure modes

Re-verified all three of the plan's "Confirmed failure modes" against current code (not the audit finding IDs — those predate several unrelated refactors):

1. **Teardown during rebuild could publish after disposal.** `rebuildWorldBundle()` had no staleness check at all before `Object.assign(bundle, fresh)` — only `buildWorldSystems()`'s own internal check (right before its deferred background phase assigns fauna/item spawners/drying racks/hives onto its own local fresh-bundle-under-construction) existed, and that only ever disposed those 4 deferred systems, never the ~20 other critical-path fields of the fresh bundle. Confirmed exploitable: app teardown increments `worldGeneration` and calls `disposeWorldBundle(bundle)` unconditionally, with no read of an in-flight rebuild's state at all.
2. **Runtime ticks through the invalid rebuild window.** Confirmed: nothing gated `gameLoop.tick()`; `rebuilding` (the old boolean) was `createApp.ts`-local and never reached the render loop.
3. **Build/background failure leaves no valid published world.** Confirmed both ways:
   - `buildWorldSystems()`'s background-phase `catch` (existing code) disposes only the 4 deferred systems it was building, then rethrows — the already-built critical-path fields (chunkManager, ocean, settlementsManager, caves, …) leaked.
   - `rebuildWorld()`'s `try { … } finally { rebuilding = false }` had no `catch` — a rejection unwound past it, and `finally` cleared `rebuilding` regardless, so a subsequent call could resume "normal" `rebuildWorld()` re-entrance bookkeeping even though `bundle` was left pointing at already-disposed old fields (the very first thing `rebuildWorldBundle()` does is dispose the bundle it's about to replace, unconditionally, before building anything fresh).

Also found one **concrete, already-reachable partial-allocation leak** during recon of `buildWorldSystems()`'s ~700-line synchronous critical path (plan requirement D explicitly asks to check for this): `waterMirror`/`chunkManager` are constructed, then the very next step throws (`home settlement (0,0) failed to resolve for treasure site`) with neither ever disposed. Fixed at the throw site (see below). A *general* disposer-stack across the rest of that 700-line function (in case some other call in it throws) was deliberately **not** attempted — logged to `docs/plans/LOOSE-ENDS.md` instead, to keep this plan scoped to the rebuild *transaction* rather than general construction-failure hardening of a function this plan doesn't otherwise touch.

`createWorldBundle()` (fresh boot) needed no equivalent transaction change: it has no prior stable `bundle` to reconcile against — the object `buildWorldSystems()` returns *is* `bundle` from the caller's very first assignment (`createApp.ts`), so `buildWorldSystems()`'s existing internal staleness check (disposing the 4 deferred systems, never assigning them) is already sufficient there; a torn-down-mid-boot app's teardown disposes the one real bundle object directly. This matches the plan's own framing — the startup-stub/readiness path is `world-003`'s, not this plan's.

## Exact changes

### `src/app/worldBundle.ts`

- The `home settlement (0,0)` throw now disposes `waterMirror`/`chunkManager` first (only two live resources at that point; ocean, which would otherwise own `waterMirror`'s disposal, doesn't exist yet).
- `rebuildWorldBundle()` now returns `Promise<WorldBundleRebuildOutcome>`:
  - wraps the `buildWorldSystems()` call + `await backgroundReady` in `try/catch`; on catch, disposes `fresh` if it exists and returns `'failed'`;
  - re-checks `isStale()` right before publication; if stale, `disposeWorldBundle(fresh)` (safe even though `buildWorldSystems()`'s own internal check may have already disposed the 4 deferred systems and left them as inert stubs in `fresh` — their `dispose()` is a no-op) and returns `'stale'`;
  - otherwise `Object.assign(bundle, fresh)` and returns `'published'`, unchanged from before.
- No change to `buildWorldSystems()`'s own internal background-phase staleness check, `createWorldBundle()`, or `disposeWorldBundle()` — all reused as-is.

### `src/app/worldRebuildLifecycle.ts` (new)

Small pure state machine: `'running' | 'rebuilding' | 'disposed' | 'rebuild-failed'`, with `beginRebuild()` (claims the slot, `false` if not `'running'`), `completePublished()`, `completeStale()` (no-op — whatever pre-empted the rebuild already owns the resulting state), `completeFailed()` (sticky, never downgrades `'disposed'`), `dispose()` (terminal, always wins), and `isValid()`/`state()` readers. Unit-tested in `worldRebuildLifecycle.test.ts` without touching Three.js/`createApp`.

### `src/app/createApp.ts`

- `rebuildWorld()` uses `worldRebuildLifecycle.beginRebuild()` in place of the old `rebuilding` boolean guard (same duplicate-request exclusion, now also blocking re-entrance once `'disposed'`/`'rebuild-failed'`).
- After `rebuildWorldBundle()` resolves, branches on the returned outcome: `'published'` → `completePublished()` then the existing post-rebuild continuation (map projection, cache activation, `PlayerController.setGround`, prewarm, pause-menu seed, …) runs exactly as before; `'stale'`/`'failed'` → `completeStale()`/`completeFailed()` (+ one `console.error` for `'failed'`) and `return` — none of that continuation runs.
- The returned teardown callback calls `worldRebuildLifecycle.dispose()` as its very first statement (before `renderLoop.dispose()`), so a paused in-flight `rebuildWorldBundle()` sees `'disposed'` the moment it resumes.
- `createGameLoop({ …, isWorldValid: worldRebuildLifecycle.isValid })`.

### `src/app/gameLoop.ts`

- `GameLoopDeps.isWorldValid: () => boolean` (new, required).
- `tick()` gates immediately after draining the frame's `timer` delta: `if (!isWorldValid()) return` — one check at the composition-root render-loop boundary, before any `bundle`-touching simulation or input-driven action dispatch. No render call either (browser keeps the last valid frame) — simplest correct "static state" per the plan's own allowance, and avoids reasoning about which render-path calls (e.g. `bundle.ocean.renderMirror`) are safe against a bundle mid-replacement.

## Tests

- `src/app/worldRebuildLifecycle.test.ts` (new): successful rebuild returns to `running`; duplicate `beginRebuild()` excluded while rebuilding; teardown during rebuild wins and a subsequent `completeStale()` never resurrects `running`; a failed rebuild is sticky (blocks both `isValid()` and further `beginRebuild()`); teardown after a failed rebuild still wins (never downgraded back to `'rebuild-failed'`). Covers plan verification items 1–5 at the state-machine level.
- Items 6 (rebind exactly once) and 7 (New Game vs. same-world rebuild reset differences) are unchanged existing `createApp.ts` continuation code, gated but not restructured by this plan — left to manual/integration verification per the plan's own allowance, since exercising them would require the same heavy Three.js/`createApp` mocking the plan explicitly says to avoid.
- `npx tsc --noEmit`, `pnpm run lint:fix`, `pnpm run build`, and the full `vitest run` suite were run. One pre-existing failure (`src/ai/npcProfessionWork.test.ts`, transport-order state assertions) reproduces identically on a clean checkout of this branch before these changes — unrelated to this plan, not touched.

## Manual verification

Per the plan, performed by the user in-browser, not this session:

1. same-world terrain/config rebuild;
2. pause-menu New Game;
3. ordinary play immediately before/after a rebuild;
4. a controlled failure/cancellation path if a safe dev/test seam exists (none was added — the plan didn't ask for one).

## Out of scope

- General disposer-stack hardening of `buildWorldSystems()`'s full critical path against an arbitrary throw (logged to `docs/plans/LOOSE-ENDS.md`).
- `world-003`'s startup-stub/readiness consumers.
- Persistence/SaveData redesign, off-screen/time-skip semantics, replacing the stable `WorldBundle` container, unrelated `createApp.ts` refactors.

/** The composition root's single rebuild lifecycle signal (plan world-033),
 *  extracted as a small pure state machine so it can be unit-tested without
 *  the Three.js-heavy machinery `createApp.ts`/`worldBundle.ts` need. Not a
 *  second world-state owner — `createApp.ts` still owns `bundle` and
 *  `worldGeneration` (the staleness/epoch identity a specific in-flight
 *  rebuild checks itself against); this only owns the coarser question of
 *  whether `bundle` is currently safe for normal per-frame simulation to
 *  touch, and whether a new rebuild may start.
 *
 * @domain world
 * @system world-rebuild-lifecycle
 * @role Single owner of the running/rebuilding/disposed/rebuild-failed state gating `gameLoop.tick()` and `rebuildWorld()` re-entrance.
 * @lifecycle rebuild
 */
export type WorldLifecycleState = 'running' | 'rebuilding' | 'disposed' | 'rebuild-failed'

export type WorldRebuildLifecycle = {
  state: () => WorldLifecycleState
  /** True only while `bundle` is a valid, fully-published world safe for
   *  normal per-frame simulation to read/mutate — the single signal
   *  `gameLoop.tick()` gates on. */
  isValid: () => boolean
  /** Claims the rebuild slot for a new `rebuildWorld()` call. Returns `false`
   *  (and claims nothing) if a rebuild is already running, the app has torn
   *  down, or a previous rebuild's fresh-build failed terminally — the
   *  caller must return immediately without touching `bundle`. */
  beginRebuild: () => boolean
  /** The in-flight rebuild published its fresh world successfully — normal
   *  simulation may resume. */
  completePublished: () => void
  /** The in-flight rebuild was pre-empted (a newer generation superseded it,
   *  or the app tore down) — a no-op here since whatever pre-empted it
   *  already owns the resulting state (`dispose()` below, in practice); never
   *  resurrects `'running'`. */
  completeStale: () => void
  /** The in-flight rebuild's fresh-build genuinely failed — sticky unless
   *  the app has already torn down: `bundle` is left on its already-disposed
   *  old fields, so neither normal ticking nor a further rebuild attempt may
   *  resume against it. */
  completeFailed: () => void
  /** App teardown. Terminal and always wins, however it races completion of
   *  an in-flight rebuild. */
  dispose: () => void
}

export function createWorldRebuildLifecycle(): WorldRebuildLifecycle {
  let state: WorldLifecycleState = 'running'
  return {
    state: () => state,
    isValid: () => state === 'running',
    beginRebuild: () => {
      if (state !== 'running') return false
      state = 'rebuilding'
      return true
    },
    completePublished: () => { state = 'running' },
    completeStale: () => {},
    completeFailed: () => {
      if (state !== 'disposed') state = 'rebuild-failed'
    },
    dispose: () => { state = 'disposed' },
  }
}

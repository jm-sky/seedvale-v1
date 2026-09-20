# Implementation Notes: Approximate Startup Loading Progress

**Reviewed:** 2026-09-20  
**Plan:** `ui-input-032-approximate-startup-loading-progress.md`

## Recon result

This is a deliberately local follow-up to completed `ui-input-022`. The current code already has the semantic startup-stage contract needed for approximate progress; implementation should not add a new reporting path.

Primary implementation can stay in `src/ui/createLoadingScreen.ts`. Existing stage emission in `src/app/createApp.ts` / `src/app/worldBundle.ts` should be treated as read-only unless current code changes before implementation.

## Existing ownership to reuse

`src/ui/createLoadingScreen.ts` currently owns:

- exported `StartupLoadingStage = 'terrain' | 'world' | 'player' | 'render' | 'ready'`;
- `STAGE_DETAIL_LABELS`;
- `LoadingScreen.setStage(stage)`;
- cached `headline` and `detail` DOM elements;
- `currentStage` and `hidden` lifecycle guards;
- the overlay fade/removal in `hide()`.

`setStage()` already has the correct production update seam:

```text
if hidden or same stage -> return
currentStage = stage
detail.textContent = STAGE_DETAIL_LABELS[stage]
```

Extend this seam rather than adding `setProgress()`, callbacks, events or mutable percentage ownership elsewhere.

## Verified stage call sites

Code search shows production `loadingScreen.setStage(...)` calls are owned by `src/app/createApp.ts`. The startup contract also reaches `src/app/worldBundle.ts` through the stage type established by `ui-input-022`.

The end of boot is already correctly ordered:

```text
loadingScreen.setStage('render')
await prewarmRenderPrograms(...)
...
loadingScreen.setStage('ready')
renderLoop.start()
loadingScreen.hide()
```

Therefore `ready -> 100%` is tied to the existing readiness boundary and must not be moved after `hide()` or replaced by a timer.

Do not add extra stage calls merely to make percentage movement appear smoother.

## Percentage mapping decision

Keep one exhaustive mapping adjacent to `STAGE_DETAIL_LABELS`:

```text
terrain -> 10
world   -> 35
player  -> 60
render  -> 85
ready   -> 100
```

Use `Record<StartupLoadingStage, number>` so adding/removing a stage produces a TypeScript completeness check for both label and percentage mappings.

These are presentation estimates, not telemetry. Do not derive them from elapsed time, number of stages, chunk count, asset count or historical boot timings.

## DOM shape

Prefer keeping the headline text node stable and adding a small dedicated percentage element rather than rebuilding headline HTML/string content on every stage.

Recommended ownership inside `createLoadingScreen()`:

```text
root
├─ spinner
├─ headline row / existing headline
│  └─ approximate percentage
└─ detail
```

Exact wrapper choice should follow the existing CSS with minimal markup churn. Cache the percentage element exactly like `detail`; `setStage()` should perform only direct `textContent` writes.

The existing loader CSS is in `index.html` (code search finds `.seedvale-loading__detail` there). Touch it only if needed for spacing/alignment. Do not migrate startup styles or loader ownership into Vue/Tailwind as part of this plan.

## Monotonicity

The normal semantic stage sequence is already monotonic, but the plan requires defensive non-regression.

Do not introduce an independent externally writable progress state. A tiny internal numeric `displayedProgress` initialized below the first mapped value is sufficient if needed:

```text
next = STAGE_PROGRESS[stage]
displayedProgress = max(displayedProgress, next)
```

The detail label should still follow the actual semantic stage. The monotonic guard applies to the displayed percentage only; it must not suppress a legitimate stage-label update if a caller ever emits stages out of order.

Keep the existing duplicate-stage and hidden guards.

## Important correction to the source plan wording

The source plan says “no new call sites should be required solely for percentage updates”; current recon confirms this can be stronger: **no new progress call sites are needed**. Existing semantic stage calls are sufficient.

Likewise, do not modify `src/app/worldBundle.ts` just for this plan unless implementation-time recon shows the `ui-input-022` contract has changed.

## Boundaries not to cross

Do not touch for progress reporting:

- `src/shared/bootMark.ts`;
- chunk worker messages or `waitForChunks()`;
- GLTF/asset-loader progress callbacks;
- settlement/NPC/fauna population counts;
- `prewarmRenderPrograms()` internals;
- render-loop scheduling;
- critical/background startup split.

No timers, interpolation, forced paint, `requestAnimationFrame`, artificial `await` or delay. A fast stage is allowed to be barely visible.

## Verification focus

Implementation-agent checks:

1. `StartupLoadingStage` remains the sole external progress input.
2. Both mappings are exhaustive over the same stage union.
3. Only `ready` maps to 100.
4. Percentage cannot visually decrease.
5. `setStage()` remains O(1), synchronous and harmless after `hide()`.
6. Diff contains no new startup scheduling, worker protocol, timer or polling changes.
7. Run `npx tsc --noEmit`, `pnpm run lint:fix`, `pnpm run build` and relevant existing tests.

Browser verification belongs to the User. The implementation agent should not run browser verification.

## Model recommendation

**Composer, Sonnet**

The implementation is tightly scoped to one small UI module, with at most a minor CSS edit. Recon resolves ownership, call sites and architecture; Composer should be sufficient, with Sonnet as the low-risk fallback.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

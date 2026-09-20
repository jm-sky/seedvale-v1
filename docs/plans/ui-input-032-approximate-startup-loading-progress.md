# Plan: Approximate Startup Loading Progress

**Created:** 2026-09-20
**Status:** `planned` 📋
**Priority:** medium · **Effort:** S
**Depends on:** ~~ui-input-022~~
**Domain:** `ui-input`
**Type:** `polish`
**Subdomains:** `feedback`
**Tags:** `loading` `startup` `progress`
**Roadmap:** -
**Model:** Composer, Sonnet

## Goal

Extend the existing coarse startup-stage loader with a lightweight, approximate percentage so the player can tell roughly how far startup has progressed.

Example:

```text
Budowanie świata… 55%
Przygotowywanie postaci…
```

The percentage is intentionally an orientation aid, not a measurement of elapsed work. It should reuse the stage boundaries already introduced by `ui-input-022`, add effectively no startup cost, never move backwards, and reach 100% only when the existing startup path is actually ready to hand control to gameplay.

## Current state

- `src/ui/createLoadingScreen.ts` owns the vanilla-DOM startup overlay and exposes `setStage(stage)` plus `hide()`.
- `StartupLoadingStage` is currently `terrain | world | player | render | ready`, with one central label mapping.
- `setStage()` already ignores duplicate stage assignments and calls after `hide()`.
- `src/app/createApp.ts` drives the existing stage transitions at real boot boundaries and switches to `render` before `prewarmRenderPrograms()`, then `ready` immediately before starting the render loop and hiding the overlay.
- `ui-input-022-lightweight-startup-loading-stages.md` deliberately avoided a progress engine. This follow-up changes that decision only for a fixed, stage-derived approximate percentage; it must not introduce per-asset/per-chunk progress tracking or change startup scheduling.

## Scope

### 1. Derive approximate progress from the existing startup stages

Keep `StartupLoadingStage` as the source of truth. Add one central stage-to-progress mapping in `src/ui/createLoadingScreen.ts`.

Use coarse fixed values rather than timing, polling or work-unit accounting. Initial suggested values:

- `terrain` → 10%
- `world` → 35%
- `player` → 60%
- `render` → 85%
- `ready` → 100%

These values are UX estimates and may be adjusted during implementation if the current call sites make a different distribution more representative.

Do not create a second independently mutable progress state that can drift from the stage.

### 2. Show the percentage in the existing loader

Extend the existing loading-screen DOM with the smallest possible presentation change.

Preferred presentation:

```text
Budowanie świata… 60%
Przygotowywanie postaci…
```

The percentage may be a dedicated child node if that keeps styling/updates cleaner, but the loader remains vanilla DOM and retains its current ownership and fade lifecycle.

The existing `setStage(stage)` call should update both:

- the detail label;
- the stage-derived percentage.

No new call sites should be required solely for percentage updates.

### 3. Preserve monotonic and truthful lifecycle semantics

- displayed progress must never decrease;
- duplicate stage assignments remain no-ops;
- calls after `hide()` remain harmless;
- 100% belongs only to `ready`;
- do not animate fake progress between stage values;
- do not delay `hide()` merely to make 100% visible for a minimum duration.

If startup exits or fails before `ready`, do not manufacture 100%.

## Architecture decision

This is **not** a generic progress framework.

Reuse the semantic stage API from `ui-input-022` and derive the approximate percentage locally in the loading UI. The composition root continues to report what phase startup is in; it does not calculate presentation percentages.

This keeps ownership clear:

```text
createApp/world startup
    → semantic StartupLoadingStage
    → createLoadingScreen
        → label + approximate %
```

Do not couple the loader to `bootMark`, worker messages, asset counts, chunk counts, NPC counts or elapsed time.

## Relevant files

Primary:

- `src/ui/createLoadingScreen.ts` — stage type, labels, approximate progress mapping and DOM update.
- startup-loader styles used by `.seedvale-loading__text` / `.seedvale-loading__detail` — only if a small spacing/alignment adjustment is needed.

Verify, but avoid changing unless current code requires it:

- `src/app/createApp.ts` — existing `setStage()` call sites should remain sufficient.
- `src/app/worldBundle.ts` — existing semantic stage callback/boundaries from `ui-input-022`; no percentage ownership here.
- `docs/plans/ui-input-022-lightweight-startup-loading-stages.md`
- `docs/plans/implementation-notes/ui-input-022-lightweight-startup-loading-stages-implementation-notes.md`

## Performance guardrails

- no timers, polling, RAF loops or observers for progress;
- no elapsed-time estimation;
- no worker protocol changes;
- no per-chunk, per-NPC or per-asset reporting;
- no new awaits, yields or artificial delays;
- no startup scheduling changes;
- no new dependency;
- only O(1) DOM writes at the handful of existing stage transitions.

## Non-goals

- Accurate percentage of total CPU/GPU/loading work.
- Estimating remaining seconds.
- Smooth interpolation between stage percentages.
- Instrumenting individual models, settlements, fauna, chunks or workers.
- Reworking startup architecture.
- Optimizing startup duration.
- Replacing the existing spinner or detail-stage text.

## Implementation order

1. Confirm current `setStage()` call sites still match the five-stage contract.
2. Add the fixed progress mapping next to the existing stage-label mapping.
3. Extend the loader presentation and update it from `setStage()`.
4. Enforce monotonic display defensively without creating an independent progress API.
5. Run static/build checks and confirm no startup scheduling/protocol code changed.

Add JSDoc only if an architectural/public helper is introduced; use `@domain ui-input` where useful for preflight discovery.

## Verification

Automated:

- `npx tsc --noEmit`
- `pnpm run lint:fix`
- `pnpm run build`
- relevant existing tests

Code review checks:

- progress is derived from `StartupLoadingStage`;
- no timer/polling/work-unit machinery was added;
- no worker protocol or startup-await changes;
- values are monotonic and only `ready` maps to 100%.

Manual browser verification by the User:

- fresh startup shows an approximate percentage alongside the existing stage text;
- percentage advances when the visible stage advances;
- percentage never moves backwards;
- the final stage reaches 100% without delaying gameplay;
- loader still fades/removes at the same readiness point;
- Continue/load follows the same safe behavior.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Plan: Debug tooling lifecycle ownership

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** medium · **Effort:** S  
**Depends on:** none  
**Domain:** `tools`  
**Subdomains:** `debug` `diagnostics`  
**Type:** `fix`  
**Roadmap:** -

## Problem

Area 25 audit confirmed two related lifecycle defects in shared diagnostics:

1. `window.seedvale.debug` has no app-level teardown and can retain closures to a disposed `WorldBundle`/player/managers.
2. `src/shared/bootMark.ts` keeps one module-global append-only mark list and `bootMarkEnd()` resolves the oldest matching start, so repeated constructions produce stale timing results.

Both are development-tooling state that currently lacks an explicit owner matching the app/session lifecycle.

## Scope

### DevTools global ownership

Update `src/debug/npcDebugApi.ts::installNpcDebugApi()` so installation has an explicit teardown contract.

The disposer must:

- remove only the exact debug API instance installed by that app;
- avoid deleting/replacing a newer API if ownership has already changed;
- leave unrelated future `window.seedvale` fields intact;
- make a non-debug/admin app boot unable to inherit an old app's mutation surface after the old app has been disposed.

Wire that disposer into the existing `createApp.ts` returned teardown next to other app-owned debug/UI handles.

Do not change debug command semantics and do not introduce another global namespace.

### Boot-mark session/pairing ownership

Update `src/shared/bootMark.ts` so repeated use of the same `group/name` does not resolve against an older invocation.

Prefer a small explicit ownership mechanism such as a start token or current/latest unmatched mark. Ensure stored diagnostic data is bounded to the relevant app/session lifecycle rather than growing forever.

Preserve:

- `?bootMark` gating;
- effectively no work when boot marking is disabled;
- existing call-site ergonomics where practical;
- console summary usefulness.

If a reset/session handle is introduced, own it from `createApp.ts`; do not add a second diagnostics manager.

## Relevant files / symbols

- `src/debug/npcDebugApi.ts`
  - `installNpcDebugApi()`
  - `SeedvaleDebugApi`
- `src/app/createApp.ts`
  - debug API installation
  - returned teardown
- `src/shared/bootMark.ts`
  - module `bootMarks`
  - `useBootMark()`
  - `bootMark()`
  - `bootMarkEnd()`
  - `bootMarksSummary()`
- `src/world/createCaves.ts` — repeated consumer; should not need domain-specific workaround
- tests around debug API / boot marks

## Constraints

- No simulation/domain state may move into tooling.
- Keep `WorldBundle` rebuild behaviour: the live stable bundle façade may continue to serve the installed API during one app instance.
- Full app disposal is the new hard invalidation boundary.
- Debug mutations must continue to call existing authoritative domain APIs.
- Do not broaden `debugDisableSystems`, admin/debug semantics or config behaviour in this plan.
- No per-frame scans, timers or listeners should be introduced.
- Add JSDoc to any new public lifecycle handle where it clarifies ownership; use `@domain tools` where helpful for preflight discovery.

## Verification

Automated:

- add a focused debug-API lifecycle test: install → dispose removes its own API;
- prove an older disposer does not remove a newer installation;
- prove a non-debug install remains a no-op and does not create a surface;
- add boot-mark tests for repeated identical `group/name` pairs and bounded/reset lifecycle;
- run targeted tests, TypeScript and lint/build checks appropriate to the touched files.

Manual browser verification is performed by the User, not the implementing AI.

Do not run `pnpm docs:sync` manually.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

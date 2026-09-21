# Plan: Lifecycle — Fresh World Failure Cleanup

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** fix
**Priority:** high · **Effort:** XS
**Depends on:** ~~world-033~~
**Domain:** `world`
**Subdomains:** `simulation`
**Tags:** `lifecycle` `world-rebuild` `dispose`

## Cel

Zapewnić dokładnie-jednoznaczny cleanup fresh `WorldBundle`, gdy krytyczna budowa zakończyła się sukcesem, ale późniejszy `backgroundReady` odrzuci Promise przed publikacją.

## Problem

`rebuildWorldBundle()` ma canonical cleanup dla stale fresh world, ale failure po przypisaniu `fresh = built.bundle` może wyjść przez `catch` bez `disposeWorldBundle(fresh)`.

Taki świat nie zostaje opublikowany do stabilnego `bundle`, więc późniejszy app teardown nie ma canonical reference do jego zasobów.

## Zakres draft

Po reconie plan powinien ustalić:

- wszystkie failure points między `buildWorldSystems()` a publikacją przez `Object.assign(bundle, fresh)`,
- ownership częściowo i w pełni zbudowanego fresh bundle,
- exactly-once cleanup dla fresh bundle przy rejected `backgroundReady`,
- relację z wewnętrznym stale cleanup deferred background systems,
- test seam pozwalający potwierdzić brak double-dispose i brak resource leak.

## Guardrails

- Reuse wyłącznie canonical `disposeWorldBundle()` i istniejący transaction model z `world-033`.
- Nie publikować częściowo gotowego świata.
- Nie próbować przywracać disposed starego bundle.
- Cleanup musi być exactly-once również przy stale/app teardown race.
- Bez szerokiego refactoru `buildWorldSystems()`.
- Dodać JSDoc do ważnych nowych lifecycle contracts; gdy pomaga preflightowi użyć `@domain world`.

## Out of scope

- New Game save identity / save ordering — osobny plan `persistence-007`,
- recovery UI po failed rebuildzie,
- redesign background initialization,
- browser verification przez AI.

## Verification

AI agent: focused tests failure-after-fresh-allocation, stale race, dispose exactly once, typecheck/build.

## Recon do wykonania przed przejściem na planned

Uzupełnić o dokładny ownership `built.bundle` / `backgroundReady`, które systemy deferred phase mogą już istnieć przy rejection i jakie dispose paths wykonuje obecny stale guard.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

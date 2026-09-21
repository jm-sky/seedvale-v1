# Plan: Lifecycle — New Game Rebuild Failure Safety

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** fix
**Priority:** high · **Effort:** S
**Depends on:** ~~persistence-004~~, ~~world-033~~, ~~items-player-056~~
**Domain:** `persistence`
**Subdomains:** `save-data` `storage`
**Tags:** `lifecycle` `new-game` `world-rebuild`

## Cel

Domknąć transakcyjny lifecycle New Game tak, aby nowy save nie mógł zostać zapisany po nieudanym albo stale world rebuildzie i aby transition nie zostawiał częściowo przełączonej save identity.

## Problem

Aktualny `onNewGame` czeka na `rebuildWorld(true)`, ale `rebuildWorld()` konsumuje wynik `rebuildWorldBundle()` wewnętrznie. Failure może więc zakończyć async call bez propagacji błędu do New Game orchestration, po czym finalny `saveNow('new-game-transition')` nadal może zostać wykonany.

To tworzy ryzyko zapisania mieszanego stanu: nowy seed / częściowo wyzerowany app state / disposed stary WorldBundle.

## Zakres draft

Po reconie plan powinien ustalić:

- jawny outcome kontraktu `rebuildWorld()` dla callerów transition,
- kiedy New Game może utworzyć pierwszy save nowej identity,
- co dzieje się z pending `beginNewSave()` przy failed/stale rebuildzie,
- które resety app-owned transient player state muszą zakończyć się przed pierwszym nowym save,
- czy świeżo dodane session transients, np. `PlayerThrow`, wymagają owner-level resetu w New Game,
- jak zachować istniejące `runExclusive()`, autosave suspension i write ordering.

## Guardrails

- Reuse `WorldBundleRebuildOutcome`, `worldRebuildLifecycle`, `runExclusive()` i istniejący save transition contract.
- Nie tworzyć drugiej maszyny stanów New Game.
- Nie zapisywać nowej identity, jeśli fresh world nie został opublikowany.
- Same-world rebuild nie może resetować player/session state przeznaczonego do zachowania.
- Nie rozszerzać tego planu o cleanup zasobów fresh WorldBundle — osobny plan `world-039`.
- Dodać JSDoc do nowych publicznych/architektonicznych lifecycle seams, gdy pomaga preflightowi; użyć `@domain persistence` tam, gdzie ma sens.

## Out of scope

- ogólny redesign save slots,
- zmiana gameplayowych wartości resetowanych na New Game,
- implementacja world-build resource cleanup,
- browser verification przez AI.

## Verification

AI agent: testy transition outcome, save ordering i reset seams, typecheck/build. Użytkownik: ręcznie New Game + wymuszony/zasymulowany failure path jeśli dostępny debug seam.

## Recon do wykonania przed przejściem na planned

Uzupełnić o dokładne call-sites `onNewGame`, `rebuildWorld`, `beginNewSave`, `saveNow`, aktualny failure/stale contract oraz listę app-owned transient state tworzonych po `items-player-056`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Plan: Agent Performance — Off-Screen Pack Animal Continuity

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** fix
**Priority:** high · **Effort:** M
**Depends on:** ~~settlements-npcs-048~~
**Domain:** `settlements-npcs`
**Subdomains:** `logistics` `schedules`
**Tags:** `agent-performance` `merchant` `livestock` `off-screen`

## Cel

Zapewnić spójny lifecycle zwierzęcia jucznego podróżującego z merchantem przy przejściu detailed ↔ off-screen, bez autonomicznego rozjazdu pozycji i bez utrzymywania niepotrzebnej detailed simulation.

## Dlaczego

To jednocześnie temat correctness i performance. Jeśli merchant przechodzi na off-screen journey execution, pack animal nie powinien pozostawać niezależnym detailed agentem bez wiarygodnego targetu/authority.

## Zakres draft

Po reconie plan powinien ustalić:

- canonical ownership merchant ↔ pack animal,
- które dane muszą przeżyć stream-out / rebuild / save-load,
- kto jest authority pozycji i stanu pack animal off-screen,
- jak pack animal wraca do detailed `AnimalAgent` przy reifikacji merchanta,
- jak uniknąć podwójnego tickowania lub osobnego równoległego registry,
- jak zachować canonical livestock identity.

## Guardrails

- Reuse identity i ownership z `settlements-npcs-048`.
- Nie tworzyć mount-only ani merchant-only konkurencyjnego systemu livestock identity.
- Nie symulować szczegółowego ruchu zwierzęcia off-screen, jeśli wystarcza stan pochodny od journey.
- Zachować world continuity bez teleportacyjnych artefaktów przy reifikacji.
- Rozwiązanie ma działać bez gracza i kamery.
- Dodać JSDoc do ważnych nowych publicznych/architektonicznych funkcji lub klas; gdy pomaga preflightowi, użyć `@domain settlements-npcs`.

## Out of scope

- przebudowa całego merchant journey system,
- redesign domestic animal AI,
- player mounts,
- nowe UI dla merchantów,
- szeroka optymalizacja wszystkich livestock.

## Verification

AI agent: unit/integration tests, typecheck/build. Użytkownik: browser verification continuity podczas stream-out/in i podróży.

## Recon do wykonania przed przejściem na planned

Uzupełnić o aktualne merchant journey state, detached livestock ownership, reification call-sites i istniejące off-screen execution contracts.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

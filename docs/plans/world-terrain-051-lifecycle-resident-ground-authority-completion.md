# Plan: Lifecycle — Resident Ground Authority Completion

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** fix
**Priority:** high · **Effort:** S
**Depends on:** ~~world-terrain-044~~
**Domain:** `world-terrain`
**Subdomains:** `terrain` `chunks`
**Tags:** `lifecycle` `ground-query` `fauna` `player`

## Cel

Domknąć resident/runtime ground authority w pozostałych detailed movement consumers, które nadal mogą korzystać z analytical fallbacku mimo obecności canonical nullable runtime ground contract.

## Problem

`world-terrain-044` wprowadził `sampleRuntimeSurfaceGround` / `sampleResidentSurfaceGround` oraz nullable-safe movement primitives dla Playera, NPC i większości fauny/livestock.

Pozostały co najmniej dwa wyjątki wykryte w audycie:

- settlement rats nie są w pełni przepięte na resident ground,
- mounted stability/fall slope w `mountActions` nadal próbuje używać analytical `sampleHeight`, mimo że sam ruch mounta może używać resident movement surface.

Może to dawać inne znaczenie podłoża dla ruchu i dla oceny jego bezpieczeństwa, np. na bridge deck albo streaming frontier.

## Zakres draft

Po reconie plan powinien ustalić:

- wszystkie produkcyjne `AnimalAgent` construction paths bez resident sampler,
- aktualny rat movement path,
- mounted `checkStability` / slope sampling authority,
- zachowanie przy unavailable resident sample,
- zgodność bridge/runtime modifications/cave arbitration tam, gdzie dotyczy,
- czy istnieją jeszcze inne detailed movement call-sites pozostawione na permissive analytical fallback.

## Guardrails

- Reuse `RuntimeGroundSampler`, `sampleResidentSlope()`, `stepWithSlopeAndCollisionResident()` i istniejące nullable semantics.
- Missing/not-ready runtime chunk oznacza unavailable/hold/retry, nie fabricated analytical ground.
- Nie zmieniać worldgen/off-screen analytical samplers, jeśli nie są detailed live movement.
- Nie tworzyć drugiego ground-query abstraction.
- Nie mieszać tego planu z local-water authority — osobny `world-terrain-052`.
- Dodać JSDoc do ważnych nowych publicznych seams; gdy pomaga preflightowi użyć `@domain world-terrain`.

## Out of scope

- water traversal,
- nowe bridge mechanics,
- pathfinding redesign,
- performance throttling agentów,
- browser verification przez AI.

## Verification

AI agent: rat streaming-frontier tests, mounted slope/bridge tests, unavailable-sample behavior, typecheck/build. Użytkownik: jazda przez most i szybki traversal przy streamingu.

## Recon do wykonania przed przejściem na planned

Uzupełnić o wszystkie production construction sites `AnimalAgent`, rat deps chain, `MountActions.checkStability` oraz dokładne resident slope semantics.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

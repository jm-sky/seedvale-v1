# Plan: Lifecycle — Resident Local Water Agent Authority

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** fix
**Priority:** high · **Effort:** M
**Depends on:** ~~world-terrain-044~~, ~~world-terrain-045~~
**Domain:** `world-terrain`
**Subdomains:** `terrain` `chunks`
**Tags:** `lifecycle` `water` `fauna` `npc`

## Cel

Rozszerzyć resident/runtime local-water availability semantics z Playera na detailed NPC/fauna/livestock consumers, tak aby live agents używali tej samej fizycznej odpowiedzi i tej samej semantyki unavailable na granicach streamingu.

## Problem

`world-terrain-045` dał Playerowi canonical `sampleRuntimeLocalWater()` / `sampleResidentLocalWater()`: brak gotowego owning chunku zwraca `null`, a nie fabricated dry/wet fallback.

Fauna/livestock oraz część settlement agent paths nadal korzystają z always-available `sampleLocalWater()`, które może użyć analytical/runtime hybrid fallbacku. Fizyczny water sample jest wspólny, ale authority/availability semantics nie są jeszcze wspólne.

## Zakres draft

Po reconie plan powinien ustalić:

- które detailed agent decisions/movement/swimming/drowning/foraging czytają `sampleLocalWater`,
- które z nich wymagają resident nullable contract, a które są poprawnie analytical/off-screen,
- dependency plumbing dla NPC/fauna/livestock/rats,
- co ma zrobić agent przy `null` podczas ruchu lub water-state transition,
- jak zachować istniejące river/ford/bridge/cave semantics,
- czy natural-water-kind/drink-source queries pozostają osobnym classification seam.

## Guardrails

- Reuse `sampleRuntimeLocalWater()`, `sampleResidentLocalWater()` i `LocalWaterSample`.
- Jedna fizyczna definicja local water; żadnego nowego water systemu.
- Detailed live simulation nie może interpretować unavailable jako dry.
- Off-screen/worldgen analytical queries mogą pozostać always-available, jeśli ich kontrakt tego wymaga.
- Nie uzależniać simulation od render visibility/camera.
- Zachować fauna water ability/risk behavior; plan zmienia authority/availability, nie balancing.
- Dodać JSDoc do ważnych nowych publicznych seams; gdy pomaga preflightowi użyć `@domain world-terrain`.

## Out of scope

- nowe water quality/drinking rules,
- zmiana parametrów drowning/crossing risk,
- shoreline visual rendering,
- resident ground completion (`world-terrain-051`),
- browser verification przez AI.

## Verification

AI agent: resident unavailable tests dla detailed agentów, elevated river/ford/bridge regression, cave exclusion gdzie dotyczy, typecheck/build. Użytkownik: obserwacja agentów na rzece i przy streaming frontier.

## Recon do wykonania przed przejściem na planned

Uzupełnić o konkretne `sampleLocalWater` call-sites, klasyfikację detailed vs analytical/off-screen consumerów, deps chain przez `createFauna`, `SettlementsManager`, livestock/rats i istniejące test fixtures.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

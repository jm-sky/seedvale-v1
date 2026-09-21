# Plan: Agent Performance — Fauna Village Query Scaling

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** optimization
**Priority:** medium · **Effort:** S
**Depends on:** ~~fauna-042~~
**Domain:** `fauna`
**Subdomains:** `population` `behavior`
**Tags:** `agent-performance` `spatial-query` `settlements` `scaling`

## Cel

Ograniczyć pozostałe fauna × settlement/village broad scans tam, gdzie koszt rośnie wraz z liczbą agentów i załadowanych osad, bez budowania kolejnego ogólnego systemu spatial indexing.

## Dlaczego

`fauna-042` usunął najważniejszy problem proximity/population scans. Pozostałe village candidate checks nie są obecnie największym kosztem CPU, ale mają niekorzystny kształt skalowania i mogą stać się istotne wraz ze wzrostem świata.

## Zakres draft

Po reconie plan powinien ustalić:

- które fauna paths iterują po wszystkich loaded villages/settlements,
- jak często są wykonywane,
- które wymagają nearest/bounded query, a które mogą działać niższą częstotliwością,
- czy istniejący world/settlement spatial mechanism można reuse,
- czy optymalizacja ma dziś wystarczające ROI, aby ją wdrażać.

## Gate ROI

Jeśli aktualne benchmarki i recon pokażą, że koszt jest nadal marginalny i nie ma małej zmiany o dobrym ROI, poprawnym wynikiem jest pozostawienie implementacji bez zmian i zachowanie planu jako późniejszego scaling work.

## Guardrails

- Nie budować drugiego fauna proximity index obok mechanizmu z `fauna-042`.
- Preferować reuse istniejącej wiedzy przestrzennej świata/osad.
- Zachować exact predicates po bounded candidate selection.
- Nie zmieniać zachowania predator/prey, habitat, water ani settlement avoidance.
- Nie uzależniać symulacji od kamery.
- Unikać per-frame allocations.
- Dodać JSDoc do ważnych nowych publicznych/architektonicznych funkcji lub klas; gdy pomaga preflightowi, użyć `@domain fauna`.

## Out of scope

- dalszy ogólny fauna proximity rewrite,
- render LOD,
- population redesign,
- habitat generation,
- settlement streaming redesign.

## Verification

AI agent: unit/performance instrumentation checks, typecheck/build. Użytkownik: benchmarki browserowe, jeśli po reconie plan przejdzie Gate ROI.

## Recon do wykonania przed przejściem na planned

Uzupełnić o konkretne call-sites, liczbę candidate checks z aktualnych benchmarków, istniejące settlement/world indexes i minimalny mechanizm bounded lookup.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

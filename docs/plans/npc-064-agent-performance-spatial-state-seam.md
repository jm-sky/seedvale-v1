# Plan: Agent Performance — Spatial State Seam

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** refactor
**Priority:** medium · **Effort:** M
**Depends on:** -
**Domain:** `npc`
**Subdomains:** `lifecycle`
**Tags:** `agent-performance` `architecture` `rendering` `spatial-state`

## Cel

Wprowadzić mały, jawny kontrakt runtime spatial state dla agentów tak, aby simulation position nie musiała długoterminowo być utożsamiona z `Object3D.position`.

## Dlaczego

Obecne presentation-only ukrywanie może być bezpieczne, ale pełne odmaterializowanie render objectu lub bardziej agresywne far-agent presentation wymaga granicy między canonical runtime position a Three.js presentation transform.

## Zakres draft

To ma być **pierwszy mały seam**, nie migracja całego NPC/fauna runtime.

Po reconie plan powinien wybrać najmniejszy zakres, który:

- definiuje authority live position poza bezpośrednim odczytem render objectu,
- synchronizuje presentation z runtime state w jednym kierunku,
- nie zmienia gameplayu ani pathfindingu,
- pozwala późniejszym planom stopniowo usuwać zależności symulacji od `Object3D`,
- nie tworzy drugiego konkurencyjnego źródła pozycji.

## Guardrails

- Jeden canonical spatial authority.
- Bez globalnego ECS/refactoru wszystkich agentów.
- Bez migracji NPC i fauny naraz, jeśli nie jest to potrzebne do spójnego pierwszego kroku.
- Nie duplikować position state bez jasno określonej synchronizacji i ownership.
- Camera/render visibility nie może wpływać na spatial state.
- Zachować deterministyczne zachowanie i istniejące save/off-screen contracts.
- Dodać JSDoc do ważnych nowych publicznych/architektonicznych funkcji lub klas; gdy pomaga preflightowi, użyć `@domain npc`.

## Out of scope

- pełny render/simulation split całego engine,
- ECS migration,
- nowe HLOD/proxy agents,
- zmiana settlement streaming,
- zmiana AI/decision system.

## Verification

AI agent wykonuje testy regresyjne, typecheck/build. Użytkownik sprawdza browser movement/reification tylko po implementacji.

## Recon do wykonania przed przejściem na planned

Ustalić dokładnie, które systemy czytają/piszą `mesh.position`, gdzie istnieje najlepszy ownership seam i czy pierwszy krok powinien objąć NPC, faunę czy wspólny mały typ/runtime contract.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

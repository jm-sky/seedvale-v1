# Plan: Agent Performance — Render Census and LOD

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** optimization
**Priority:** high · **Effort:** M
**Depends on:** ~~world-terrain-041~~
**Domain:** `world-terrain`
**Subdomains:** `rendering`
**Tags:** `agent-performance` `npc` `fauna` `lod`

## Cel

Zmniejszyć koszt renderowania NPC i fauny przez rozszerzenie istniejącego presentation-only LOD/cullingu, bez wpływu na symulację, lifecycle agentów ani world state.

## Dlaczego

Aktualne benchmarki wskazują NPC + fauna jako najsilniejszy pojedynczy kandydat do poprawy FPS. Ten plan ma najpierw ustalić, które elementy renderingu agentów generują koszt, a dopiero potem rozszerzyć istniejące mechanizmy o najmniejszą zmianę o wysokim ROI.

## Zakres draft

Po reconie plan powinien ustalić:

- koszt według rodzin assetów i typów agentów,
- udział skinned meshes, draw calls, triangles, animation/presentation,
- zachowanie w near / mid / far,
- które części agentów można bezpiecznie ograniczać lub ukrywać,
- jak rozszerzyć istniejący agent presentation LOD zamiast tworzyć równoległy visibility system,
- jakie reguły ważności muszą wymuszać pełną prezentację.

## Guardrails

- Rendering nie może sterować symulacją.
- `visible`, frustum/camera state ani presentation LOD nie mogą decydować o istnieniu lub update symulacji.
- Reuse istniejących mechanizmów z `world-terrain-041`.
- Bez nowego globalnego managera visibility, jeśli obecne mechanizmy wystarczą.
- Bez model swapping/HLOD zanim pomiar nie pokaże, że prostszy LOD jest niewystarczający.
- Nie optymalizować na podstawie samej liczby obiektów — decyzje muszą wynikać z benchmarków/census.
- Dodać JSDoc do ważnych nowych publicznych/architektonicznych funkcji lub klas; gdy pomaga preflightowi, użyć `@domain world-terrain`.

## Out of scope

- zmiana decyzji/needs/movement NPC,
- zmiana fauna simulation cadence,
- streaming/despawn agentów,
- oddzielenie simulation position od `Object3D`,
- szeroki refactor asset pipeline.

## Verification

AI agent wykonuje odpowiednie testy/typecheck/build. Browser benchmark i manualne sprawdzenie poppingu/cullingu wykonuje użytkownik.

## Recon do wykonania przed przejściem na planned

Uzupełnić plan o aktualne pliki, symbole, ownership presentation state, asset families, benchmark baseline i konkretny mechanizm o najwyższym ROI.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

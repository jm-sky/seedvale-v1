# Plan: Agent Performance — Render Census and LOD

**Created:** 2026-09-21
**Status:** `in progress` 🔄
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

## Slice A1′ — konserwatywne bounds dla NPC skinned meshes (autoryzowane 2026-10-28)

Źródło: `docs/research/v1-revival/2026-10-27--revival-audit--npc-fauna-rendering.md` (A1′). Ten plan pozostaje właścicielem (domain `world-terrain`, rendering). Rekon historyczny (2026-09) zastąpiony audytem rewival; zweryfikowano na `beb17519`.

**Stan zweryfikowany w kodzie:**

- `src/characters/assembleCharacter.ts::rebindAllSkinned` ustawia `frustumCulled=false` na przypiętych head/hair/eq (współdzielone z graczem — `PlayerController`, więc **nie** zmieniamy go tam).
- Body GLB meshes miały natywny culling z leniwą sferą z pierwszej pozy.
- `NpcAgent.create` → `assembleCharacter` (kit) lub `loadGltfAnimated` (legacy) → `new NpcAgent` → konstruktor (`prepareProp`, wrapper, `member.scale`). Capsule fallback: brak skinned meshes.

**Implementacja:**

- `src/render/actorCullBounds.ts::installActorCullBounds(root)` — jedna współdzielona sfera na aktora (środek = unia bind-pose boxów skinned meshes, promień = półprzekątna + wysokość), liczona w przestrzeni `root`, zapisywana per mesh w jego lokalnej przestrzeni. Ustawia tylko `boundingSphere`/`frustumCulled`; nigdy `visible`. Nieznane bounds → `frustumCulled=false` (fail open).
- Jedno wywołanie: `NpcAgent` constructor, zaraz po utworzeniu wrappera, przed startem animacji (pokrywa kit i legacy; capsule = no-op).
- Testy: `src/render/actorCullBounds.test.ts`.

**Poza zakresem (wymaga osobnej zgody):** A2′ fauna, A5′ eyes/eyebrows LOD, A0b, A3, A6, A7, settlement/grass, benchmarki, zmiany `settlements-023`. Gracz (`PlayerController`/`ubcAccessoryBind`) bez zmian.

**Weryfikacja:** AI — type-check, lint, testy jednostkowe, build. Autor — browser: obrót kamery, krawędzie frustum, walk/attack/sleep, death/corpse, cienie z bliska, kit i legacy NPC. Popping/znikające części/złe cienie = failure → revert commita.

**Liczniki do pomiaru (później, porównywalna scena/kamera, 3 powtórzenia):** `main.byBucket npcFamily:*` (spadek), render p50/p95 (nie gorzej), shadow submissions (bez zmiany przy casterach ≤36 m).

## Verification

AI agent wykonuje odpowiednie testy/typecheck/build. Browser benchmark i manualne sprawdzenie poppingu/cullingu wykonuje użytkownik.

## Recon do wykonania przed przejściem na planned

Uzupełnić plan o aktualne pliki, symbole, ownership presentation state, asset families, benchmark baseline i konkretny mechanizm o najwyższym ROI.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

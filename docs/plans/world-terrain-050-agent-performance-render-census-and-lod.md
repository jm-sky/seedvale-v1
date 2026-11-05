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
- Follow-up po [review A1′](../reviews/2026-10-28--029--world-terrain-050-a1-skinned-mesh-culling-review.md): F1–F3 poprawione; kontrakt transformacji, regresje i próbkowanie rzeczywistych animacji kit/legacy opisano w [implementation notes](implementation-notes/world-terrain-050-agent-performance-render-census-and-lod-implementation-notes.md).

**Poza zakresem (wymaga osobnej zgody):** A2′ fauna, A5′ eyes/eyebrows LOD, A0b, A3, A6, A7, settlement/grass, benchmarki, zmiany `settlements-023`. Gracz (`PlayerController`/`ubcAccessoryBind`) bez zmian.

**Weryfikacja:** AI — type-check, lint, testy jednostkowe, build. Autor — browser: obrót kamery, krawędzie frustum, walk/attack/sleep, death/corpse, cienie z bliska, kit i legacy NPC. Popping/znikające części/złe cienie = failure → revert commita.

**Liczniki do pomiaru (później, porównywalna scena/kamera, 3 powtórzenia):** `main.byBucket npcFamily:*` (spadek), render p50/p95 (nie gorzej), shadow submissions (bez zmiany przy casterach ≤36 m).

## Gameplay visibility / detection — author direction (2026-11-05; Astra → Opus review pending)

**Product requirement, not merely a performance optimization:** NPCs and animals, including hostile actors, must not be revealed to the player through solid walls, around opaque corners or behind other fully obstructing world geometry. The current frustum/LOD work does **not** satisfy this requirement. See [NPC/fauna visibility V2 assessment](../research/v1-revival/2026-10-30--npc-fauna-visibility-v2-analysis.md) for the distinction between native frustum culling, camera occlusion and sensory perception. This section captures author intent for review; it does **not** authorize implementation or change the status of existing A1′ work.

### Expected gameplay behavior

- **Physical visibility:** buildings, walls, corners, rocks and terrain should block direct sight where their actual opaque geometry does. A partly exposed actor must remain partly visible; do not hide the entire model because a single center ray is blocked. Consider doorways, windows, height differences, thin/transparent geometry and moving blockers to avoid false hiding or popping.
- **Light / distance / stealth:** add **lightweight** detection modifiers for darkness versus light sources, distance, and stealth (e.g. crouching, slower movement or cover). Keep the effect subtle, explainable and testable; no hard-coded detection ranges or thresholds are approved yet.
- **No magical invisibility:** a physically visible actor on open ground must not disappear simply because a gameplay detection check fails. Distinguish visual rendering from awareness, identification, targeting/UI indicators and any optional last-known contacts. Do not add V2 ghost placeholders or a wholesale perception port by default.
- **AI perception is a separate contract:** whether NPCs/animals see, hear or remember the player/each other requires its own assessment against existing V1 AI/fauna perception. Camera visibility must not directly dictate NPC decisions or autonomous world simulation.
- **Presentation must not own simulation/lifecycle:** preserve entity identity, movement, offscreen simulation, persistence, corpses/loot, shadow behavior and existing `mesh.visible` ownership. Gameplay LOS must not accidentally despawn actors or suppress their authoritative updates.

### Review / planning handoff

1. **Astra:** assess the desired player-facing behavior, separate physical occlusion from detection/awareness and propose the smallest coherent V1 integration, including whether gameplay visibility belongs in a distinct cross-domain plan rather than inside the performance-only `world-terrain-050` implementation scope.
2. **Opus:** verify actual V1 rendering, geometry/collision, player observation and NPC/fauna perception ownership in code; identify architectural boundaries, partial-occlusion correctness, cache/invalidation, test scenarios and regression/performance risks. Compare V2 mechanisms only as selective reference.
3. **Before implementation:** specify observable acceptance cases (fully hidden behind opaque wall; emergence around corner; partially exposed silhouette; open terrain at day/night and near/far; stealth and light-source interaction; doors/windows/terrain; UI/targeting; AI and save/load unaffected). Benchmark rendering optimization separately from gameplay correctness.

**Scope boundary:** the performance culling experiment in the linked assessment remains optional and measurement-gated. The gameplay requirement is independent of whether removing occluded draws improves FPS. No gameplay LOS/detection code is approved by this amendment.

## Verification

AI agent wykonuje odpowiednie testy/typecheck/build. Browser benchmark i manualne sprawdzenie poppingu/cullingu wykonuje użytkownik.

## Recon do wykonania przed przejściem na planned

Uzupełnić plan o aktualne pliki, symbole, ownership presentation state, asset families, benchmark baseline i konkretny mechanizm o najwyższym ROI.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

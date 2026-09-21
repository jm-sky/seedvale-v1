# Plan: Agent presentation render LOD

**Created:** 2026-09-17
**Status:** `planned` 📋
**Model:** Sonnet, Composer
**Type:** optimization
**Priority:** high · **Effort:** M
**Depends on:** -
**Domain:** `world-terrain`
**Subdomains:** `rendering`
**Tags:** `npc` `fauna` `lod` `performance`

## Cel

Zmniejszyć główny koszt renderowania NPC oraz fauna/livestock przez prosty, współdzielony presentation LOD oparty o istniejącą hierarchię modeli. Nie zmieniać symulacji, identity ani lifecycle agentów.

## Evidence / decyzja z reconu

Świeży `settlement-heavy` (2026-09-21, benchmark 030):

- NPC: **511 main-pass draws / 1.16M triangles**,
- fauna: **399 main-pass draws / 152.2k triangles**,
- razem: **910 main-pass draws**,
- shadow casters agentów: tylko **22 NPC + 10 fauna draws**,
- `hide-npc-fauna`: RENDER **23.3 → 14.4 ms** (~9 ms exposed),
- `no-shadows`: RENDER **23.3 → 19.6 ms** dla całej sceny.

Gate „czy to głównie shadows?” jest więc już rozstrzygnięty: **nie**. Agent main-pass submissions są wystarczająco duże, żeby kontynuować. Nie powtarzać tego investigation w implementacji.

Aktualny kod daje stabilne seamy:

- `src/ai/NpcAgent.ts` — stabilny root NPC, skinned GLB, `NPC_SHADOW_DISTANCE = 36`; komentarz w kodzie wskazuje ~9 skinned submeshes/NPC jako istotny submit cost,
- `src/fauna/AnimalAgent.ts` — stabilny root zwierzęcia, GLB/procedural fallback, animacje i corpse lifecycle,
- `src/assets/loadGltf.ts` — obecny animated clone path,
- `src/world/waterMirror.ts` — `AGENT_RENDER_LAYER` / `assignRenderLayer()`,
- `src/fauna/animalUpdateCadence.ts` — osobna polityka CPU cadence; nie jest render LOD,
- `src/perf/sceneCensus.ts` — istniejący benchmark/debug census.

Repo nie ma zweryfikowanej rodziny low-poly agent assets. Dlatego **v1 nie robi model swappingu**.

## Zakres

### 1. Minimalny benchmark-only agent detail census

Rozszerzyć istniejącą diagnostykę tylko o dane potrzebne do bezpiecznego wyboru optional presentation nodes:

- NPC / livestock / wild fauna,
- liczba renderable i skinned meshes na agenta,
- draws i triangles,
- model/asset family, jeśli jest dostępna bez nowego runtime registry,
- distance bands,
- top families według draw count.

Diagnostyka ma działać tylko w benchmark/debug path. Bez stałego per-frame scene traversal.

Celem census nie jest ponowne udowadnianie problemu, lecz wskazanie **które istniejące child meshes można bezpiecznie wyłączyć w mid/far**.

### 2. Shared presentation level

Dodać mały, czysty kontrakt współdzielony przez NPC i fauna:

- `near` — pełna obecna prezentacja,
- `mid` — opcjonalne, niesylwetkowe child meshes mogą być ukryte,
- `far` — dalsza redukcja tylko jeśli aktualna hierarchia modelu pozwala zrobić to bez utraty czytelnej sylwetki.

Distance policy ma być niezależna od simulation cadence. Bliski/ważny agent zawsze pozostaje `near`.

Nie tworzyć globalnego LOD managera ani rejestru important agents.

### 3. Existing-hierarchy adapter

Po zbudowaniu modelu agent może jednorazowo cache'ować child nodes dopuszczone do redukcji. Zmiana poziomu ma tylko przełączać cached `.visible` przy zmianie levelu.

Guardrails:

- żadnego pełnego traversal modelu co klatkę,
- żadnego material cloning na transition,
- żadnej zmiany geometry/skeleton,
- żadnego runtime decimation,
- żadnego model swappingu w v1,
- jeśli dana rodzina nie ma bezpiecznych optional nodes — zostawić ją bez redukcji.

Nie zakładać nazw child nodes bez potwierdzenia przez aktualną hierarchię/census.

### 4. Importance — tylko lokalnie dostępne sygnały

`important` wymusza `near`, ale v1 korzysta wyłącznie z sygnałów dostępnych już w ownerze/callerze bez nowych cross-system dependencies.

Obowiązkowo zachować full presentation dla:

- bezpośrednio bliskich agentów,
- mounted animal,
- player-coupled/led animal, jeśli sygnał jest już lokalnie dostępny,
- combat/flee/interaction target tylko tam, gdzie owner już zna ten stan.

Nie dodawać centralnego registry dla dialogue/combat/quest importance.

### 5. Lifecycle

LOD nie może zmieniać:

- `NpcAgent` / `AnimalAgent` identity,
- simulation state,
- collider/interaction identity,
- persistence identity,
- animation owner/mixer,
- `AGENT_RENDER_LAYER`,
- corpse semantics.

W szczególności fauna `hideLivingVisual()` / `showLivingVisual()` pozostaje nadrzędne wobec presentation LOD.

## Architektoniczne decyzje

- Jedna pure policy `AgentPresentationLevel` dla NPC i fauna.
- NPC/fauna mogą mieć małe adaptery hierarchy, ale nie osobne polityki LOD.
- Simulation cadence i render LOD pozostają rozdzielone.
- V1 = **visibility budget istniejących child meshes**, nie asset/model LOD.
- Explicit low-poly model swapping jest osobnym przyszłym krokiem wymagającym assetów i animation rebind contract.
- Nowe ważne/public API: JSDoc + `@domain world-terrain`.

## Non-goals

- low-poly asset production lub model swapping,
- animation mixer rebinding,
- zmiana AI/needs/decision cadence,
- spatial grid,
- impostory,
- GPU skinning rewrite,
- runtime decimation,
- global visibility manager,
- multiplayer replication.

## Verification

AI agent:

- unit tests pure LOD policy,
- test adaptera na syntetycznej hierarchy,
- type-check/lint/test/build,
- bez browser verification.

Użytkownik:

- `?benchmark=settlement-heavy` przed/po,
- porównać agent draws/triangles, total draws, RENDER avg/p95, FPS/frame p95,
- przejść far → mid → near przez osadę,
- sprawdzić NPC, livestock, wild fauna, mount/led animal, combat oraz death/corpse,
- sprawdzić popping i poprawne odtworzenie pełnego modelu po powrocie do near.

## Success gate

Utrzymać production LOD tylko jeśli redukuje istotną liczbę **main-pass** agent submissions/triangles i daje mierzalny zysk bez regresji bliskiej prezentacji.

Jeśli aktualne hierarchy nie mają wystarczająco bezpiecznych optional nodes, zakończyć na census + udokumentowanym wymaganiu low-poly assets. Nie budować proxy/impostor/model-swap systemu w tym planie.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

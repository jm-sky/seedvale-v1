# Implementation notes — Agent presentation render LOD

**Plan:** `world-terrain-041-agent-presentation-render-lod.md`  
**Status:** implemented on `main` (2026-09-21); awaiting user browser/benchmark verification  
**Model:** Sonnet, Composer

## As implemented

- `src/render/agentPresentationLod.ts`: the shared pure policy —
  `resolveAgentPresentationLevel({ distance, important })` returns
  `'near' | 'mid' | 'far'`. Thresholds are new, explicit constants
  (`AGENT_PRESENTATION_NEAR_DISTANCE_M = 18`,
  `AGENT_PRESENTATION_MID_DISTANCE_M = 36`) — not imports from
  `animalUpdateCadence.ts`. `important` always forces `near`.
- `src/render/agentPresentationVisibility.ts`: `createAgentPresentationVisibility(optionalNodes)`
  returns `null` for an empty node list (a family with nothing safe stays full
  automatically, no adapter allocated), otherwise a tiny `{ applyLevel }`
  object that toggles only those cached nodes' `.visible`, no-ops on a
  repeated same-level call, and never touches root/material/geometry/layers.
- **Node-selection finding (the plan's required gate):** confirmed by
  reading `NpcAgent.ts`/`npcAppearance.ts`/`AnimalAgent.ts` — no runtime
  probing was possible/needed since these are named, source-level
  attachment points, not guesses.
  - NPC: only the two custom adult-male profession stems (blacksmith,
    woodcutter) attach separate hair/beard meshes at runtime, named
    `ubcHairAttachment` / `ubcBeardAttachment` (`NpcAgent.attachUbcHairAttachments`).
    Every other NPC family (all baked UBC outfit variants — peasant/wizard/
    ranger/knight, both genders) bakes hair into the body mesh — no
    independent optional node exists for them, so they get no adapter and
    stay `near`-only forever, per the plan's "family without a safe rule
    stays full" guardrail.
  - Fauna: `AnimalAgent`'s GLB/procedural models expose no equivalent named
    optional child (the only runtime-attached extra is the saddlebags pack
    visual, which is gameplay state, not a non-silhouette LOD candidate, and
    stays out of scope). **No fauna optional nodes were registered — v1
    ships NPC-only**, matching "family without a safe rule stays full" and
    the plan's permission to end at census + documented asset requirement
    for the family that has nothing to give.
- `NpcAgent.ts`: added `presentationVisibility: AgentPresentationVisibility | null`,
  populated once at construction from `root.getObjectByName('ubcHairAttachment' | 'ubcBeardAttachment')`
  (present only for the two custom stems). `update()` resolves the level
  from the observer `distance` it already computes for the label/observation
  system, with `important = this.phase === 'combat'` (the only locally-known
  signal from the plan's importance list that applies to NPCs — no
  mounted/led-animal analogue exists for `NpcAgent`).
- `npcAppearance.ts`: added a `family: string` field to `NpcAppearance`
  (outfit family, or the custom stem's role) — diagnostic-only, read by the
  census, not a new registry. `NpcAgent.create()` tags
  `mesh.userData.npcFamily` from it (mirrors `AnimalAgent`'s existing
  `mesh.userData.animalKind`).
- `src/perf/sceneCensus.ts`: added `censusAgentDetail(scene, observerPos, camera?)`
  — benchmark-only, extends the existing census module rather than adding a
  parallel one. For every `npc`/`fauna` root, buckets by asset family
  (`npcFamily`/`animalKind`) and by the same near/mid/far distance bands the
  policy uses, with mesh/skinned-mesh/draw/triangle totals per bucket.
  `cameraRelevantAgents` is a bounded point-in-frustum estimate (agent root
  world position only, no bounding sphere/occlusion) computed from the
  benchmark camera's own `projectionMatrix`/`matrixWorldInverse` — `0`
  whenever no camera is supplied. Runs once per benchmark session, not
  per-frame.
- `src/perf/benchmark.ts` / `createApp.ts`: `BenchmarkHost` gained a
  `camera: Camera` field (wired from the app's existing, never-replaced
  `camera`, same lifetime rule as `scene`) and `player.mesh.position`'s type
  widened to include `y` (real `Vector3`, was `{x,z}`-only). The benchmark
  run now also computes `agentDetail` and threads it through
  `buildReport`/`PerfReportJson`/`formatReport` (new "Agent detail" report
  section, families sorted by draw calls, bands in near→far order).
- Tests: `src/render/agentPresentationLod.test.ts` (boundaries, `important`
  override, determinism), `src/render/agentPresentationVisibility.test.ts`
  (synthetic `Object3D` hierarchy: null-for-empty, hides only owned nodes,
  restores on `near`, same-level no-op, layers untouched), and a
  `censusAgentDetail` describe block added to the existing
  `src/perf/sceneCensus.test.ts` (family grouping, distance bands, skinned
  vs. ordinary mesh counts, excludes agents with nothing currently
  renderable, camera-relevance on/off).
- Verification run: `npx tsc --noEmit`, `pnpm run lint:fix` (auto-fixed
  import ordering only), `pnpm test` (full suite, 8250 tests), `pnpm run
  build` — all clean. No browser verification performed (user does this
  manually).

## What the user's benchmark decides

This is a narrow v1 by design (only 2 of ~11 NPC professions have anything
to hide, and only hair/beard — non-silhouette but small). The plan's success
gate applies as written: if `?benchmark=settlement-heavy` shows no
measurable NPC draw/RENDER-time improvement, the right next step is to
revert or leave this mechanism as-is without extending it — not to widen
node selection with guessed names, and not to build fauna/model-swap LOD to
compensate. The "Agent detail" report section's per-family draw-call numbers
are exactly what settles that call.

## Recon conclusion

Nie zaczynaj od szerokiego investigation ani projektowania model-swap LOD.

Benchmark `2026-09-21--030--benchmark-settlement-heavy.md` już rozstrzyga najważniejszy gate:

- scene census one-pass estimate: NPC **511 draws / 1.16M tris**, fauna **399 draws / 152.2k tris**; to render-eligible hierarchy estimate, **nie faktyczne camera/frustum submissions**,
- shadow census: NPC **22 draws**, fauna **10 draws**,
- `hide-npc-fauna`: RENDER **23.3 → 14.4 ms**,
- `no-shadows` dla całej sceny: **23.3 → 19.6 ms**.

Agent cost nie jest przede wszystkim problemem shadow-pass. Production work może przejść bez ponownego Gate A. Jednocześnie `censusScene()` nie robi camera/frustum attribution, więc nie wolno traktować 511+399 jako faktycznie wysłanych draw calls.

Najprostszy bezpieczny v1 to:

```text
benchmark-only hierarchy census
→ pure shared near/mid/far policy
→ per-owner cached optional child visibility
→ benchmark
→ stop, jeśli hierarchy nie daje sensownej redukcji
```

Nie ma zweryfikowanych low-poly variants, więc **nie implementuj model swappingu**.

## Current seams to reuse

### `src/perf/sceneCensus.ts`

Już ma:

- `classifyObject()` z bucketami `npc` / `fauna`,
- `censusScene()`,
- `censusShadowCasters()`,
- draw-call i triangle counting,
- effective visibility handling.

Rozszerz ten istniejący benchmark/debug mechanism albo dodaj mały helper obok niego. Nie twórz drugiego normal-runtime census systemu.

Detail census ma odpowiedzieć tylko:

1. ile renderable/skinned child meshes przypada na agent/model family,
2. które family generują najwięcej draws,
3. jak wygląda rozkład po distance bands,
4. które z tych agentów są camera/frustum-relevant dla benchmark view, jeśli da się to policzyć bounded w benchmark path,
5. które child nodes są realnymi kandydatami do optional presentation.

Nie trzeba ponownie mierzyć, czy shadows dominują.

### `src/ai/NpcAgent.ts`

NPC ma stabilnego ownera/root i obecny animated GLB lifecycle. Zachowaj go.

Istotne fakty:

- `NPC_SHADOW_DISTANCE = 36`,
- komentarz przy nim dokumentuje około **9 skinned submeshes × NPC** jako wcześniejszy submit problem,
- render layer korzysta z `AGENT_RENDER_LAYER` / `assignRenderLayer()`,
- animation lifecycle korzysta z `createAgentAnimationSet()`,
- appearance/model hierarchy różni się między rodzinami NPC.

Nie zmieniaj `this.mesh` identity i nie rebindowuj skeleton/mixer.

Po finalnym zbudowaniu presentation hierarchy można **raz** zebrać referencje do optional nodes. Później transition ma używać tylko cached references.

### `src/fauna/AnimalAgent.ts`

Ten sam ogólny wzorzec ownership: stabilny agent + presentation child.

Zachowaj istniejące:

- `FAUNA_SHADOW_DISTANCE`,
- `AGENT_RENDER_LAYER`,
- `createAgentAnimationSet()`,
- living/corpse presentation lifecycle,
- procedural/capsule fallback.

Szczególnie nie łam `hideLivingVisual()` / `showLivingVisual()`. LOD nie może przywrócić living child, gdy corpse lifecycle go ukrył.

Fallback bez sensownych optional nodes może pozostać zawsze `near`/full.

### `src/fauna/animalUpdateCadence.ts`

Nie reużywaj `AnimalUpdateImportance` jako render LOD authority.

Ten moduł steruje częstotliwością CPU work:

- `resolveAnimalUpdateImportance()`,
- `animalBehaviourIntervalSec()`,
- `animalPresentationIntervalSec()`.

Można wykorzystać ten sam już policzony observer distance w miejscu integracji, jeśli jest lokalnie dostępny, ale policy i state muszą pozostać osobne.

## Concrete v1 design

### 1. Pure policy

Preferowany plik:

`src/render/agentPresentationLod.ts`

Minimalny kontrakt:

```ts
export type AgentPresentationLevel = 'near' | 'mid' | 'far'

export type AgentPresentationLodInput = {
  distance: number
  important: boolean
}

export function resolveAgentPresentationLevel(
  input: AgentPresentationLodInput,
): AgentPresentationLevel
```

Nie dodawaj camera/frustum/object references do pure policy.

`important=true` zawsze daje `near`.

Thresholds są renderowymi thresholdami, nie aliasami fauna cadence. Wybierz jawne stałe w tym module i pokryj boundary tests. Jeśli podczas browser verification wyjdzie oscillation, dopiero wtedy dodaj hysteresis.

### 2. Adapter = cached visibility only

Nie potrzebujemy ogólnego frameworka adapterów. Mały helper wystarczy, jeśli usuwa duplikację między ownerami.

Semantyka:

- construction: dostaje jawnie wybrane optional `Object3D[]`,
- `applyLevel()` robi pracę tylko przy zmianie levelu,
- `near` przywraca wszystkie nodes należące do LOD budget,
- `mid/far` ukrywa tylko nodes potwierdzone jako niesylwetkowe,
- nie dotyka root visibility,
- nie traversuje hierarchy podczas update,
- nie mutuje material/geometry/layers/skeleton.

Nie zapisuj globalnego „original visibility” dla całego modelu. Cache dotyczy wyłącznie nodes, które ten LOD mechanizm rzeczywiście posiada; inaczej łatwo wejść w konflikt z corpse/equipment lifecycle.

### 3. Node selection

To jest jedyny fragment, którego nie należy zgadywać przed census. **Najpierw priorytetyzuj rodziny widoczne/relewantne dla benchmark camera**, nie rodziny dominujące tylko w pełnym scene graph.

Kandydaci mogą obejmować włosy, zarost, drobne accessories/equipment lub inne niesylwetkowe child meshes, ale **tylko jeśli aktualna hierarchy potwierdzi, że ich ukrycie jest niezależne**.

Nie używaj heurystyki typu „każdy child o małej liczbie triangles” ani przypadkowego node-name matching dla wszystkich assetów.

Preferuj jawne per-family selection z małą liczbą znanych reguł. Family bez bezpiecznej reguły pozostaje full.

Jeśli census pokaże, że większość kosztu siedzi w niepodzielnym body/outfit mesh i optional nodes dają mało draws, zatrzymaj production część. To oznacza potrzebę prawdziwych low-poly assets, nie potrzebę bardziej skomplikowanego runtime systemu.

## Importance integration

Nie buduj centralnego registry.

NPC/fauna owner może przekazać `important` tylko z sygnałów, które już zna lokalnie.

Minimum:

- bardzo mały distance → policy i tak wybierze `near`,
- mounted animal → `important`,
- player-coupled/led animal → `important`, jeśli stan jest już lokalny.

Combat/flee/interaction/dialogue mogą wymuszać `near` tylko tam, gdzie sygnał jest dostępny bez importowania nowych managerów. Brak sygnału w v1 jest lepszy niż nowa zależność między domenami.

## Update placement

Nie dodawaj agent LOD traversal/update do `gameLoop.ts`.

LOD level aktualizuj w istniejącym owner presentation/update path, gdzie observer distance jest już dostępny lub tani do uzyskania.

Per tick dozwolone:

- distance/importance resolve,
- porównanie z last level,
- przy transition kilka cached `.visible` assignments.

Per tick niedozwolone:

- `traverse()`,
- arrays/maps budowane od nowa,
- material cloning,
- skeleton/model rebuild.

## Explicitly out of v1

Nie implementuj:

- alternate GLB loading,
- low-poly model variants,
- swapping skinned roots,
- AnimationMixer rebind,
- runtime mesh simplification,
- impostors,
- global visibility manager,
- osobnych NPC/fauna LOD policies.

To są osobne problemy. Obecny plan ma sprawdzić, ile można odzyskać tanim visibility budgetem.

## Tests

### `src/render/agentPresentationLod.test.ts`

Pokryj:

- near/mid/far boundaries,
- `important` → near,
- deterministic/stateless behaviour.

### visibility helper

Na synthetic `Object3D` hierarchy:

- near przywraca owned optional nodes,
- mid/far ukrywa właściwy subset,
- root pozostaje nietknięty,
- repeated same-level apply jest no-op,
- layers nie są zmieniane.

Nie buduj ciężkich `NpcAgent` / `AnimalAgent` integration tests tylko dla pokrycia prostego helpera.

## Implementation order for Sonnet

1. Przeczytaj tylko wskazane wyżej seams + aktualne benchmark integration call-sites.
2. Dodaj bounded detail census i ustal realne model families/optional nodes.
3. Jeśli optional nodes mają materialny draw budget, dodaj pure policy + tests.
4. Dodaj cached visibility integration do NPC i fauna tylko dla potwierdzonych families.
5. Uruchom targeted tests, potem type-check/lint/build.
6. Nie wykonuj browser verification.
7. Jeśli census nie daje sensownego R2, zakończ bez proxy/model-swap i zapisz wynik jako asset requirement.

## User browser verification

`?benchmark=settlement-heavy` przed/po:

- NPC/fauna draws i triangles,
- total draws,
- RENDER avg/p95,
- FPS i frame p95.

Manualnie:

- far → mid → near,
- NPC z różnymi appearance families,
- livestock i wild fauna,
- mount/led animal,
- combat/flee,
- death/corpse,
- powrót do near: pełne hair/equipment/body bez resetu animacji.

## Success criterion

Liczy się realny benchmark gain oraz redukcja camera-relevant agent render budget. Sam spadek scene-census draws/triangles nie wystarcza, bo census nie jest renderer submission counterem.

Jeśli visibility-only v1 usuwa mało draws albo nie poprawia benchmarku, revert/nie rozszerzaj mechanizmu. Następny krok powinien wtedy dotyczyć assetów lub osobnego, świadomie zaplanowanego skinned-model LOD — nie rozbudowy tego planu.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

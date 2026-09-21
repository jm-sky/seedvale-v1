# Plan: UBC NPC runtime material darkness and authored outfit preservation

**Created:** 2026-09-21
**Status:** `planned` 📋
**Priority:** high · **Effort:** M
**Depends on:** ~~tools-017~~, ~~npc-055~~
**Domain:** `npc`  
**Type:** `bug`  
**Tags:** `ubc` `appearance` `materials` `rendering`  
**Roadmap:** -

## Cel

Zdiagnozować i poprawić runtime wygląd materiałów UBC NPC tak, aby:

- authored custom profession GLB (obecnie Blacksmith/Woodcutter) zachowywały własne materiały i tekstury zamiast być przypadkowo nadpisywane przez standardowy tint/hue pipeline;
- zwykłe UBC warianty nadal korzystały z obecnego deterministycznego tint/hair/clothing-hue systemu;
- postacie nie były sztucznie czarne lub nadmiernie ciemne względem poprawnego wyglądu źródłowego/finalnego GLB;
- poprawka nie rozjaśniała globalnie terenu, nieba, budynków ani innych obiektów świata;
- hair/beard runtime attachments z tools-017 pozostały bez zmian funkcjonalnych.

Najpierw doprowadzić NPC do poprawnego stanu. Player UBC ma podobny objaw ciemności, ale jego runtime material pipeline nie jest częścią implementacji tego planu; wyniki investigation mają jedynie wskazać, czy później można reuse tego samego rozwiązania.

## Zaobserwowany problem

Manualne testy 2026-09-21 wykazały kilka różnych objawów.

### 1. Finalne GLB są poprawne poza gameplay runtime

`public/models/characters/ubc/npc/male_blacksmith.glb` wygląda poprawnie przy bezpośredniej inspekcji modelu.

W grze część ubrań NPC była jednak czarna lub bardzo ciemna.

To zawęża problem: asset-build tools-017 nie jest automatycznie winny tylko dlatego, że objaw pojawia się na custom Blacksmith/Woodcutter.

### 2. Wyłączenie runtime clone/tint wyraźnie poprawiło wygląd

W `NpcAgent.create()` zakomentowanie:

```ts
cloneOutfitMaterials(scene)
if (tintUrl) await applyOutfitTint(scene, tintUrl)
```

dało dużą poprawę widocznych materiałów NPC.

Nie zostało jednak jeszcze jednoznacznie ustalone, czy przyczyną jest sam clone, późniejsza modyfikacja materiału oznaczonego przez clone, sidecar tint, shared/cache interaction, czy kombinacja tych kroków.

### 3. `applyHairColor` i `applyClothingHue` nie potwierdziły się jako główna przyczyna

Manualne testy nie wykazały, aby wyłączenie tych operacji rozwiązywało główny problem.

Nie należy więc usuwać istniejącego hair-color / clothing-hue systemu bez dalszego dowodu.

### 4. PBR quick tests nie rozwiązały problemu

Runtime inspection przykładowych materiałów pokazał m.in.:

```text
MI_Peasant
color: ffffff
map: T_Peasant_BaseColor
metalness: 1
metalnessMap: true
roughness: 1
roughnessMap: true
normalMap: true
```

Testy z:

- `metalness = 0`;
- `vertexColors = false`;

nie dały istotnej lub jednoznacznej poprawy.

Nie utrwalać tych zmian jako fix bez dalszego investigation.

### 5. Model test także pokazuje zbyt ciemne części ubrania

W `?modelTest&model=ubc/npc/male_blacksmith&anims=ubc/ual_humanoid`:

- ciemny fartuch Blacksmitha wygląda zgodnie z authoringiem;
- spodnie, rękawy i bluzka są wizualnie za ciemne.

To oznacza, że pozostały problem nie zależy wyłącznie od pełnego gameplay world lighting.

### 6. Global exposure potwierdziło problem jasności, ale nie jest rozwiązaniem

Repo renderer używa:

```ts
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 0.88
```

Test `toneMappingExposure = 1.2` poprawił czytelność postaci, ale cały świat stał się za jasny.

Wniosek: nie naprawiać problemu globalnym exposure.

### 7. Agent-only fill light nie jest właściwym kierunkiem

Próba dodatkowego fill light dla agentów rozjaśniła również świat.

Nie dodawać osobnego światła jako obejścia tego problemu.

### 8. Aktualny main zawiera tymczasowe eksperymenty investigation

`src/assets/ubcOutfitMaterials.ts` ma obecnie `fixOutfitMeshDarkness()`, które:

- ustawia `metalness = 0` dla UBC outfit materials;
- dla każdego materiału z `map` ustawia tę mapę również jako `emissiveMap`;
- dodaje `emissive = 0x181818`.

`NpcAgent.create()` wywołuje je obecnie przez:

```ts
scene.traverse((obj) => fixOutfitMeshDarkness(obj))
```

oraz zawiera debugowy `DEBUG_TINT_OUTFIT_MATERIALS = false`, zakomentowane `cloneOutfitMaterials(scene)` i warunkowy tint.

To jest stan investigation, nie docelowa architektura. Plan ma zakończyć się usunięciem tymczasowych eksperymentów albo zastąpieniem ich potwierdzonym, wąskim rozwiązaniem.

## Aktualny kontrakt appearance

`src/ai/npcAppearance.ts::resolveNpcAppearance()` pozostaje authoritative resolverem wyglądu NPC.

Custom adult-male Blacksmith/Woodcutter już deklarują właściwą intencję:

- custom `modelUrl`;
- `tintUrl: null`;
- identity `clothingHue`;
- runtime hair/beard attachments;
- deterministyczny hair color.

Komentarz w resolverze mówi wprost, że custom stems mają zachować authored outfit materials.

Problem polega na tym, że `NpcAgent.create()` nadal ma wspólny post-load material pipeline dla różnych klas UBC assetów i nie ma jawnego kontraktu określającego, czy outfit może być runtime-mutowany.

## Investigation

### A. Ustalić dokładny krok powodujący czernienie / zmianę authored materials

Dla co najmniej:

- `male_blacksmith.glb` — custom authored stem;
- `male_woodcutter.glb` — custom authored stem;
- Peasant baked/default NPC;
- Ranger baked/default NPC;

porównać materiał przed i po każdym kroku:

1. bezpośrednio po `loadGltfAnimated(modelUrl)`;
2. po `cloneOutfitMaterials(scene)`;
3. po `applyOutfitTint()`;
4. po `applyClothingHue()`;
5. po runtime hair/beard attachment;
6. po `applyHairColor()`.

Porównywać co najmniej:

- material identity/name;
- `color`;
- `map` identity + colorSpace;
- `normalMap`;
- `metalness`, `metalnessMap`;
- `roughness`, `roughnessMap`;
- `emissive`, `emissiveMap`;
- `vertexColors`;
- relevant `userData` flags;
- czy material/texture pozostaje współdzielony z cached GLTF root.

Nie zakładać, że dwa wyłączone naraz kroki oznaczają, że oba są winne.

### B. Sprawdzić cache/shared-material semantics

`loadGltf.ts` trzyma cached GLTF root i zwraca `SkeletonUtils.clone()`.

Zweryfikować dokładnie:

- które material/texture references są współdzielone między clone'ami;
- dlaczego `cloneOutfitMaterials()` jest obecnie potrzebne dla tintowanych NPC/player;
- czy custom stems w ogóle powinny klonować outfit materials;
- czy mutacja tint/hue jednego NPC może wpływać na innego NPC lub playera;
- czy `disposeOutfitMaterialClones()` i `sharedGpu` flags pozostają poprawne po rozdzieleniu ścieżek.

### C. Rozdzielić authored-material od tintable-material contract

Nie używać przypadkowo `tintUrl === null` jako jedynej semantyki, jeśli może oznaczać również zwykły UBC bez sidecara.

Jeżeli recon potwierdzi potrzebę, dodać jawny derived appearance contract, np. semantyczne pole w `NpcAppearance`:

```ts
outfitMaterialMode: 'authored' | 'tintable'
```

lub równie mały odpowiednik zgodny z istniejącą architekturą.

Docelowo:

- custom authored Blacksmith/Woodcutter: nie zamieniać outfit BaseColor map, nie nadpisywać authored material factors tylko po to, by przejść przez standardowy UBC tint pipeline;
- standard UBC variants: zachować istniejący clone/tint/hue behavior;
- runtime hair/beard pozostają niezależną warstwą i nadal mogą korzystać z hair-color pipeline.

Nie hardcodować nazw konkretnych profesji w `NpcAgent`, jeżeli resolver appearance może dostarczyć właściwą semantykę.

### D. Ustalić przyczynę pozostałej ciemności bez globalnego rozjaśniania świata

Po usunięciu problemu material overrides zbudować czysty baseline i porównać:

- custom Blacksmith w repo `modelTest`;
- standard UBC NPC w `modelTest`;
- te same klasy assetów w gameplay daylight.

Sprawdzić w szczególności różnice między poprawnym zewnętrznym/asset preview a repo runtime:

- tone mapping i exposure;
- obecność/brak environment/IBL w preview;
- material color-space interpretation;
- normal map conventions;
- metallic/roughness texture channels;
- vertex colors;
- authored `baseColorFactor`;
- ewentualne post-processing różnice.

Globalne `toneMappingExposure` ma pozostać ustawieniem świata; nie podnosić go tylko po to, żeby naprawić UBC.

Nie dodawać emissive/self-light ani specjalnego character fill light bez pomiaru/porównania potwierdzającego, że to właściwy model prezentacji.

## Implementacja po investigation

Po ustaleniu przyczyny wdrożyć najmniejszą poprawkę w istniejącym pipeline.

Preferowany ownership:

- `npcAppearance.ts` — deklaruje semantykę resolved appearance;
- `ubcOutfitMaterials.ts` — posiada material clone/tint/hue helpers i ewentualny jawny prepare helper;
- `NpcAgent.ts` — tylko orkiestruje resolved appearance; nie powinien zawierać rozrastającej się listy profession-specific material wyjątków.

Jeżeli potrzebny jest nowy helper typu `prepareNpcOutfitMaterials(root, mode, ...)`, powinien reuse istniejące funkcje zamiast tworzyć drugi system materiałów.

Dodać JSDoc z `@domain npc` dla nowego publicznego/architektonicznego kontraktu, jeśli powstanie.

## Cleanup wymagany w ramach planu

Po zakończeniu investigation:

- usunąć `DEBUG_TINT_OUTFIT_MATERIALS`, jeśli nie jest trwałym narzędziem diagnostycznym;
- usunąć zakomentowany kod debug z `NpcAgent.create()`;
- usunąć `fixOutfitMeshDarkness()`, jeżeli jego zachowanie nie zostanie potwierdzone jako właściwa część rozwiązania;
- nie zostawiać globalnego emissive ani `metalness = 0` jako nieudokumentowanego workaroundu;
- przywrócić czytelny, testowalny flow material preparation.

## Spodziewane pliki

Główne:

```text
src/ai/NpcAgent.ts
src/ai/npcAppearance.ts
src/ai/npcAppearance.test.ts
src/assets/ubcOutfitMaterials.ts
```

Możliwe po potwierdzeniu zakresu:

```text
src/assets/loadGltf.ts
src/debug/createModelTestScene.ts
src/player/PlayerController.ts   # tylko recon/shared-contract check, bez player fix
docs/STATE.md
docs/plans/implementation-notes/
```

Nie zmieniać asset-build scripts ani finalnych GLB, chyba że investigation wykaże konkretny błąd danych w assetach.

## Testy automatyczne

Dodać testy na poziomie pure/material helpers tam, gdzie możliwe, obejmujące:

1. authored mode nie podmienia BaseColor map ani authored color/material factors;
2. tintable mode nadal klonuje materiał przed per-NPC mutation;
3. tint jednego clone'a nie mutuje shared cached material drugiego NPC;
4. clothing hue działa tylko w ścieżce, która świadomie go obsługuje;
5. runtime hair color / attachment behavior pozostaje bez regresji;
6. custom Blacksmith/Woodcutter resolver zwraca authored-material semantics;
7. female/children oraz standard role variants pozostają na dotychczasowym tintable path.

Uruchomić focused tests oraz właściwe repo technical checks.

## Weryfikacja manualna

User wykonuje browser verification.

Sprawdzić co najmniej:

- Blacksmith: fartuch pozostaje celowo ciemny, ale spodnie/rękawy/bluzka zachowują authored kolory i czytelne światło;
- Woodcutter: suspenders/outfit bez czarnych lub zgubionych tekstur;
- zwykły Peasant NPC: sidecar tint nadal działa;
- Ranger NPC: sidecar tint nadal działa;
- hair/beard runtime: kolor, skinning i pozycja bez regresji;
- daylight oraz ciemniejsza pora dnia;
- `modelTest` vs gameplay dla tego samego assetu.

Agent nie wykonuje browser verification.

## Poza zakresem

- globalna zmiana ekspozycji/tone mapping świata;
- przebudowa day/night lighting;
- specjalne światła sceny tylko dla NPC jako workaround;
- player UBC material fix — osobny follow-up po ustabilizowaniu NPC;
- przebudowa tools-017 asset composer bez dowodu błędu w finalnym GLB;
- zmiany hair/beard pools, profession mapping lub persistence appearance;
- zmiany NPC AI/simulation.

## Guardrails

- Current code > plan; jeżeli dalszy recon obali którąś hipotezę, poprawić plan/implementation notes zamiast wymuszać hipotezę.
- Nie maskować problemu przez globalne rozjaśnienie świata.
- Nie bake'ować korekty jasności do tekstur bez potwierdzenia, że problem jest w assetach.
- Nie tworzyć osobnego renderer/material managera dla NPC.
- Custom authored profession stems muszą zachować authored visual intent.
- Standard UBC variants muszą zachować istniejącą deterministyczną różnorodność tint/hair/hue.
- Nie uruchamiać `pnpm docs:sync`; workflow repo aktualizuje indeksy.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Seedvale — Woda

**Purpose:** źródło prawdy dla wody (ocean + jeziora / cieki śródlądowe): stan techniczny i wizualny, standing decisions, hydrologia rzek.

**Nie jest:** planem implementacji ([plans/](../plans/README.md)), logiem całej grafiki ([GRAPHICS.md](../architecture/GRAPHICS.md) — tam zostają kontrakty G4–G6), ani katalogiem assetów.

**Last verified:** 2026-11-03 against code (global hydrology 058 H1–L2, Q96, Q80 legacy removal; Architecture, W13, Rivers and the query contract re-checked; river/lake browser checks still open — see Otwarte and queue §2)

Gdy ten plik rozjeżdża się z kodem — **wygrywa kod**, potem aktualizujemy ten dokument.

PNG całej sieci rzek/jezior kontynentu (headless, do porównań przed/po): [tools/world-inspection.md](../tools/world-inspection.md#continent-preview-tools-023).

---

## Jak używać

1. Przed zmianą oceanu, jezior, brzegu, `waterLevel` albo `bodyScale` — przeczytaj **Standing decisions** i **Stan obecny**.
2. Kontrakty renderu (depthWrite, mirror RT, foliage) zostają w [GRAPHICS.md](../architecture/GRAPHICS.md) G4–G6; szczegóły domeny wody są tutaj.
3. Po decyzji użytkownika albo zweryfikowanym fixie — zaktualizuj stan / decyzje tutaj; szczegóły implementacji/historia zostają w planie/issue, nie tutaj.
4. Issue/plan mogą szczegółować pracę; trwała reguła ląduje tutaj.

Status wiedzy: `✅` potwierdzone w przeglądarce · `🔧` zaimplementowane, bez browser check · `📝` decyzja / kierunek · `❓` otwarte.

---

## Standing decisions

Trwałe reguły. Zmiana = aktualizacja tej tabeli (historia decyzji zostaje w planie/issue, nie tutaj).

| ID | Decyzja | Skutek |
|----|---------|--------|
| W1 | **Jedna rodzina shadera, dwa strojenia** (jezioro / ocean). Bez `Water.js`, bez SSR / refrakcji / trzeciego mesha. | faza 2–3 planu 098 ✅ |
| W2 | Ocean = **jeden** plane, follow gracza, **nie** per-chunk. | G5 (geometria). Shader = `waterMaterial.ts` |
| W3 | Woda: `transparent: true`, **`depthWrite: false`**. Nie łączyć transparent + depthWrite + wysokiego `renderOrder`. | G4, issue [022](../issues/2026-08-12--022--ocean-through-tree-foliage.md) |
| W4 | Liście GLTF `BLEND` → opaque `alphaTest` cutout. Korony piszą depth, woda nie. | G3 |
| W5 | Chunk water maskuje się heightmapą (`vCover`). `bodyScale` 1 = strojenie oceanu (nie discard). | W8 + faza 2 ✅ |
| W6 | **Performance jest constraint.** Lustro sceny = **jeden** wspólny pass (nie per-chunk). Wyłącznik w Vue. Mirror RT mały (**128²**), max **30 Hz**, bez NPC/fauny. | G2; G5; plan 113 |
| W7 | Weryfikacja wizualna = **przeglądarka**, nie sam `tsc`/lint/build. | G8 |
| W8 | **Ocean tylko morze / wybrzeże.** Śródlądowe jeziora, stawy i cieki nigdy nie używają materiału oceanu, niezależnie od powierzchni w chunku. | issue [028](../issues/2026-08-13--028--inland-water-dual-material.md) ✅ |
| W9 | **Lustro sceny** (planar, jedna RT) na jeziorach **i** oceanie, z opcją wyłączenia w Vue (Pauza → Świat / Grafika) + `seedvale:graphics:v1`. Off → niebo + specular, **zero** extra passu. Default: włączone. | `waterMirror.ts`; faza 3 ✅ |
| W10 | Przezroczystość **z głębokości** (`floorHeights`): przy brzegu widać piasek, w głębi gęstsza/ciemniejsza. Nie akwarium, nie prawie-opaque. | faza 2 ✅ |
| W11 | Brzeg: miękki fade + linia piany z maski + mokry piasek na terenie. | faza 2 ✅ |
| W12 | Ruch: jezioro = drobne zmarszczki world-space; ocean = wolniejsza, większa fala. Rzeki (od planu 181) mają **własny**, osobny lekki materiał (`riverWaterMaterial.ts`) — nie tę samą rodzinę shadera co jezioro/ocean, choć reużywa jego dzień/noc uniform-setterów bez zmian. | faza 2 ✅; rzeki: plan 181 |
| W13 | **Jedna globalna hydrologia na świat** (plan 058): `computeWorldHydrology` liczy raz cały skończony kontynent (sieć łańcuchów rzek, jeziora, warstwa korekty terenu); identyfikuje ją `RawSampleParams.hydrologyId`, brak instalacji = twardy błąd (żadnego cichego fallbacku). Hydrologia czyta **tylko** nieskorygowane podłoże (`sampleRawFloorUncorrected`) — nigdy skorygowany teren, osad, dróg ani `waterH` (brak cyklu). Rzeki to geometria osobna od jezior/oceanu: 256 m "river tile" jest **widokiem** (przycięciem) globalnych łańcuchów, nie osobną analizą. Korekta (wypełnione doły +, przecięte przełęcze −) jest częścią `sampleRawTexel`, więc `sampleFloorAt`/gameplay widzą hydrologię; carving kanału (plan 189) tylko obniża. Wodospady = sygnał renderowania (`aFall`). Pełna parytetowość shadera rzeka/jezioro/ocean pozostaje odłożona; flow/jeziora/łańcuchy liczą się na main thread (~0.6 s w Node), na workerach tylko próbkowanie podłoża. | plan [058](../plans/world-terrain-058-finite-continent-and-global-hydrology.md), [notes](../plans/implementation-notes/world-terrain-058-finite-continent-and-global-hydrology-implementation-notes.md), [terrain-and-world-generation.md](../state/terrain-and-world-generation.md) |
| W14 | **Woda ≠ „poniżej morza”.** Jezioro leży ponad `waterLevel`; pytanie „czy tu jest woda” rozstrzyga reguła `h − floorH > WET_EPS` (`terrain/waterSurface.ts` `isWetFloor`), nie porównanie z `waterLevel` (to opisuje tylko morze). Wybór zapytania: tabela poniżej. | plan 058 L1, [review 030](../reviews/2026-11-03--030--geography-hydrology-architecture-review.md) |

---

## Kierunek wizualny (zaakceptowany 2026-08-13)

Rozmowa: pół-realistyczna, trochę przezroczysta, bez ciężkiego CPU/GPU. Potem doprecyzowanie: lustro sceny **tak**, ale z wyłącznikiem.

| | Śródlądzie (jezioro / staw / ciek) | Ocean (tylko wybrzeże / morze) |
|--|-------------------------------------|--------------------------------|
| Shader | ta sama rodzina | ta sama rodzina, inne uniformy |
| Kolor | jaśniejszy, płytszy cyan/zieleń | ciemniejszy teal, większa „masa” |
| Fale | drobne zmarszczki, `world.xz` | wolniejszy, większy swell |
| Maskowanie | heightmap `vCover` (jak dziś) | shore fade na singleton plane (issue 003) |
| Głębokość | `floorHeights` → alpha + kolor | to samo na styku z lądem; otwarte morze gęstsze |
| Brzeg | fade + piana + mokry piasek | fade + piana + mokry piasek |
| Odbicia | wspólne lustro 128² @ 30 Hz, albo sky+spec gdy off | to samo lustro / ten sam fallback |
| Nurt | nie teraz | n/d |

**Koszt lustra:** jeden extra render sceny, throttled to 30 Hz, without NPC/fauna. Wyłączenie w menu ma być realnym spadkiem GPU (pass w ogóle nie startuje). Miejsce UI: Pauza → **Świat**, sekcja grafiki (obok flat shading); persist jak AO/bloom (`seedvale:graphics:v1`). lil-gui zostaje debugowym odpowiednikiem.

**Świadomie nie:** SSR, refrakcja, caustics, flow rzek, mesh per basen, powiększanie mirror > 256².

---

## Architektura

```text
terrain params ──► hydrologyId (seed, WORLD_HYDROLOGY_VERSION, options, terrain inputs)
boot stage `worldHydrology` (worldHydrologyRuntime.ts, before the chunk manager):
  registry → IndexedDB `hydrology` (also a boot-fixture namespace) → compute:
  raw floor in 12 row strips on the worker pool → computeWorldHydrology (main thread)
  → installWorldHydrology (main) + installHydrology (every chunk worker); one world retained
        ↓
heightmap (worker): sampleRawTexel = uncorrected floor + hydrology correction
  heights[]      — max(floorH, waterH): ląd + pokrywa (sea level albo poziom jeziora), clamp dla walk/mask
  floorHeights[] — prawdziwa (skorygowana) wysokość: mesh terenu + shader głębokości + pływanie
        ↓
detectWaterBodies()  — BFS 4-sąsiedztwo w obrębie JEDNEGO chunka (+ apron), grupowanie po poziomie powierzchni
        ↓
computeBodyScale()   — 0 ląd · jezioro < 0.9 · 1.0 ocean (kontynentalność)
        ↓
src/world/waterMaterial.ts     jedna rodzina ShaderMaterial (uOcean 0..1)
        ↓
src/world/waterMirror.ts       jeden RT (default 256²) @ 30 Hz; y = waterLevel; hide water (layer 1) + agents (layer 2)
        ↓
┌───────────────────────────────────┬─────────────────────────────────────┐
│ createChunkWater (per chunk)      │ createOcean (singleton, WorldBundle)│
│ jedna plane na poziom wody: morze │ uOcean = 1, bez heightmapy          │
│ (lustro) + każde jezioro (bez     │ radial fade poza loadRadius         │
│ lustra, maska wysokości poziomu)  │ fale world.xz (swell)               │
│ y = level + 0.07, order 1         │ y = waterLevel + 0.02, order 0      │
│ PlaneGeometry chunkSize, ≤256 seg.│ Plane + 64 seg., follow(player)     │
└───────────────────────────────────┴─────────────────────────────────────┘
rzeki: worldHydrology chains → riverTileCache (ref-counted clip per 256 m tile) → createRiverWater (wstążka per chunk)
       + applyRiverChannel (carving) + riverQuery (placement, analityczny) — osobny materiał `riverWaterMaterial.ts`
```

Klasyfikacja oceanu: `continentalness` vs `oceanThreshold` / `coastThreshold` (`oceanMixAt`). Pole stawu w chunku **nie** promuje go na ocean. `lakeScaleFor` jest capowane do `LAKE_SCALE_MAX` 0.85.

Ocean powstaje w `rebuildWorldBundle()`; rozmiar plane = `(unloadRadius * 2 + 4) * chunkSize`. Singleton jest schowany wewnątrz `loadRadius * chunkSize` (chunk water rysuje brzeg). `gameLoop` woła `ocean.follow(player.xz)`, `ocean.update(dt)` i `ocean.renderMirror()` przed composerem. Jeziora: `ChunkManager` tworzy/niszczy mesh przy streamie chunka; `update(dt)` + `setDayNight` idą przez `chunkManager`. Lustro: `postProcessing.waterReflections` (default on); off = `uReflections = 0` i brak passu.

---

## Stan obecny

### Techniczny

| Element | Jak jest |
|---------|----------|
| `waterLevel` | `WorldConfig.terrain.waterLevel`, default **0.45**; GUI live (rebuild) |
| `bodyScale` | 0 ląd; inland `min(lakeScaleFor(area), 0.85)`; 1 = ocean (`oceanMixAt` > 0.9) |
| Mesh terenu pod wodą | `floorHeights` — wanna pod taflą; `heights` zostaje clampem dla maski / trawy / `sampleHeight` |
| Batymetria | `floorHeights` → mesh + shader (`depth = waterLevel - floorH`) + pływak / ambient |
| Maska chunk water | `vCover` z heightmapy; `discard` gdy `< 0.02`. Komórki oceanu **rysowane** (nie discard). Jezioro: osobna plane na poziom, maska wysokości własnego poziomu (`maskHeightsForLakeLevel`) |
| Fale | 3–4 sine w **world.xz**; jezioro drobne zmarszczki, ocean wolniejszy swell (`mix` z `vOcean`) |
| Foam | z `1 - vCover` + `fwidth(vCover)` przy brzegu, nie z amplitudy fali |
| Kolor | `mix(shallow, deep, depthT)` + fresnel; palety jezioro vs ocean |
| Paleta dzień/noc | `setWaterDayNight(dayFactor, sunDirection)` lerp 6 kolorów + sun specular |
| Shader | `src/world/waterMaterial.ts` — jeden program-ród, `USE_CHUNK_MASK` na jeziorach |
| Ocean singleton | ten sam shader, `uOcean = 1`; radial fade poza `loadRadius`; lustro (`waterMirror.ts`, rozmiar niżej) |
| Rozdzielczość odbić | `WorldConfig.postProcessing.waterReflectionSize` ∈ {128, 256 (default), 512, 1024}; live `WaterMirror.setSize`; Vue Pauza → Świat → Grafika; lil-gui |
| Toggle odbić | `WorldConfig.postProcessing.waterReflections`; Vue Pauza → Świat → Grafika; lil-gui Post-processing; `seedvale:graphics:v1` |
| Mokry piasek | terrain fragment: przyciemnienie albedo w paśmie `waterLevel` .. `+0.4` |
| Szwy chunków | mesh wody = `chunkSize` (bez overlap 1.02); faza fal wspólna (world-space) |
| Gameplay | NPC/drogi/namiot/kopanie **odrzucają** wodę; gracz pływa (cap głębokości). Fauna (plan [fauna-015](../plans/archive/fauna-015-animal-water-traversal-wading-swimming-and-drowning.md)) już nie traktuje wody jako twardej ściany — `terrain/waterSample.ts`'s `sampleLocalWater()` (jezioro/ocean z `floorHeights`, rzeka z kanonicznych `waterH`/`bedH`) + `fauna/waterTraversal.ts`'s czysty klasyfikator dry/wading/swimming/blocked (głębokość skalowana z `AnimalDef.scale`, minimalna deklaratywna `AnimalDef.water` capability — kaczka pływa tanio, gatunek bez `canSwim` nie wchodzi w głęboką wodę) zasilają `AnimalAgent.isWalkable()`, dzielone 1:1 przez autonomiczny i dosiadany ruch. Pływanie zużywa istniejącą staminę (`tickAnimalLife`'s `swimExertion`); wyczerpanie podczas `swimming` (nie `wading`/`dry`) odbiera HP przez istniejący `damageHealth`/death lifecycle. Picie zwierząt = plan [094](../plans/archive/2026-08-13--094--fauna-food-water-for-satiety-hydration.md), nie render |

Wejścia kodu:

```text
src/world/waterMaterial.ts
src/world/waterMirror.ts
src/world/createOcean.ts
src/world/createWater.ts
src/terrain/waterBodies.ts
src/terrain/waterSurface.ts        isWetFloor (water covers a point: sea + lake), WET_EPS
src/terrain/waterSample.ts         sampleLocalWater (physical: sea + lake + river)
src/terrain/terrainClassification.ts  isFloorBelowSea (sea-only, map/catalog)
src/terrain/chunkHeightmap.ts      detect + bodyScale + clamp heights
src/terrain/chunkManager.ts        createChunkWater / update / setDayNight
src/terrain/buildChunkGeometry.ts  mesh z floorHeights (wanna); mokry piasek (uWaterLevel)
src/app/worldBundle.ts             createOcean
src/app/gameLoop.ts                follow + setDayNight
src/terrain/biomeColors.ts         pas piasku / dna (smoothstep, issue 001)
src/player/PlayerController.ts     pływanie po floorHeights
```

### Rzeki (cieki śródlądowe, plany 181/189, globalna hydrologia 058)

Rzeki to przycięte globalne łańcuchy zainstalowanej hydrologii: `worldHydrology.ts` (czysty, deterministyczny, worker-safe; D8 flow na siatce 8 m całego kontynentu, naprawa dołków przez korektę, jeziora, łańcuchy) → `riverNetwork.ts` `computeRiverTile` = widok kafla 256 m (`riverChainClip.ts`, przycięcie do rect rdzenia; wszystkie punkty świata należą do dokładnie jednego kafla). `UNCONDITIONED_HYDROLOGY_ID` = surowe podłoże bez sieci wodnej (testy/narzędzia; brak rzek, jezior, korekty). Historia per-tile (D8 per kafel + halo, dry-sink repair, ciągłość ujścia, diagnostyka terminali) została usunięta w Q80 — zob. plan [058](../plans/world-terrain-058-finite-continent-and-global-hydrology.md), [notes](../plans/implementation-notes/world-terrain-058-finite-continent-and-global-hydrology-implementation-notes.md) i archiwalne plany 006/011/013.

Boot/instalacja: `RawSampleParams.hydrologyId` wchodzi do każdego fingerprintu cache'u. Zmiana wyniku algorytmu wymaga bumpa `WORLD_HYDROLOGY_VERSION` (+ re-eksport fixtures; pilnuje tego golden-hash test w `worldHydrology.test.ts`). Pool/workery trzymają hydrologię **jednego** świata (`retainOnlyWorldHydrology`, replace semantics `installHydrology`); ładunek ≈ 5.1–5.2 MiB na kopię (main + każdy worker; 6.6–6.8 MiB przed 061 H1).

Spływ z makroklimatu (plan 061 H1, Q121): każda komórka lądu wnosi do akumulacji wagę `runoffFrom(T, P)` (`macroClimate.ts`, ≈ 1 typowo, 0.15–2; chłodna/mokra północ więcej, ciepłe południe mniej), więc `accumulation` liczy **komórki efektywne** (powierzchnia ważona spływem / 64 m²), nie surowe. Wejście buduje zawsze `worldHydrologyGridFor(params, floor)` (boot, narzędzia, census) — brak `runoff` = jednolite 1 tylko w syntetycznych testach. Próg cieku stałego `DEFAULT_RIVER_THRESHOLDS.stream` = 96 (6144 m² efektywnych; było 15 surowych) = też zero `flowFactor`, więc źródło zaczyna się cienką nitką; saturacja szerokości (`majorRiver`) bez zmian. Wynik: ≈ −50 % długości cieków vs S0. Suche doliny (dry drainage, H2) **jeszcze nie istnieją** — cieki poniżej progu po prostu nie są łańcuchami. Jeziora (`lakeMinCells` 600, Q96) są w warstwie danych terenu (`waterH`) i w widoku „land view” (`sampleLandHeight`), nie w osobnym systemie.

`src/terrain/riverTileCache.ts` zwraca kafel jako tani clip na main thread (bez prefetchu; `stats.syncMsMax` do obserwacji) i reference-countuje go po załadowanych chunkach (store ≤ 12 zwolnionych kafli); `ChunkManager` attach/dispose per-chunk river ribbon (`src/world/riverGeometry.ts`'s `clipChainToRect`/`buildRiverRibbonGeometry`) razem z `WorldWater`. Szerokość wstążki pochodzi z eased `flowFactor()` (0..1) z `widthFromAccumulation()`, więc małe strumienie są wizualnie subtelniejsze niż główne rzeki; per-vertex `aFlow` pozwala fragment shaderowi (`riverWaterMaterial.ts`) zmiękczać alpha brzegu/foam/streak.

River channel carving (plan 189, kanoniczny przekrój — plan world-terrain-010) dodaje trzeci `computeChunkTile` terrain-modifier stage (`chunkHeightmap.ts`'s `applyRiverChannel`, po roads/clearings) — `riverNetwork.ts`'s `riverChannelSegmentsNear` zamienia ten sam kanoniczny, już-zmeandrowany łańcuch (który renderuje wstążka wody) na `RiverChannelSegment[]`. Zamiast jednego `halfWidth`/`depth`, segment niesie osobno: `waterHalfWidth` (wąska szerokość wody — ta sama co `widthFromAccumulation`, i to ona napędza `nearestRiverBankDistance`/gameplay "water edge") i szerszy `channelHalfWidth` (krawędź brzegu, `waterHalfWidth` + flow-scaled margines — celowa przestrzeń na czytelny brzeg + roślinność nadwodną), plus `bedH`/`waterH` per endpoint. `waterH = elevation - exposedBankFromFlow(flow)` i `bedH = waterH - submergedDepthFromFlow(flow)` — oba budżety (`EXPOSED_BANK_MIN/MAX` 0.15–0.8 m, `SUBMERGED_DEPTH_MIN/MAX` 0.12–1.6 m) są niezależne i zawsze dodatnie, więc inwariant `bedY < waterY < bankTopY` i `waterWidth < channelWidth` trzyma się z konstrukcji, nawet dla ledwo-sklasyfikowanego strumienia. `applyRiverChannel`'s `riverChannelCandidate` liczy teraz kawałkowy przekrój po `dist` (płaskie dno → podwodne zbocze do `waterH` → wynurzony brzeg do `floorH` tego samego teksela), nie jeden stały `bedH` + zewnętrzny falloff. Channel bed height jest ściśle malejące w dół rzeki z konstrukcji (D8 elevation ściśle maleje, accumulation nigdy nie maleje — udowodnione w testach), więc nie potrzeba osobnego passu korekcji monotoniczności. Carving tylko obniża teren (`Math.min(...)`), nigdy nie podnosi.

Wstążka wody (`riverGeometry.ts`) **nie** sampluje już renderowanego terenu — Y liczy `canonicalWaterHeight(point)` (`= elevation - exposedBankFromFlow(flow)`), czysta funkcja hydrologii punktu, deterministyczna i ciągła między chunkami tak samo jak `elevation`/`accumulation`. `RIVER_SURFACE_OFFSET` to teraz tylko epsilon anty-z-fighting (0.02, nie 0.2) — przed plan world-terrain-010 ten sam stały offset *był* efektywną głębokością małych strumieni (`MIN_CHANNEL_DEPTH` 0.15 < offset 0.2), co dawało wodę na/ponad otaczającym terenem ("blue ribbon"); teraz `exposedBankFromFlow` gwarantuje minimalny recessed dystans niezależnie od offsetu.

Rzeki **nie** zmieniają `sampleFloorAt`/gameplay terrain poza samym carvingiem powyżej (korekta hydrologii jest osobną warstwą, liczoną z nieskorygowanego podłoża). Wodospady (plan 181, Etap 7 dokończenie 2026-08-25) są renderowane bez osobnej geometrii/systemu: `riverGeometry.ts`'s `waterfallFactor()` liczy per-vertex rise-over-run między kolejnymi punktami tej samej już-wyciętej per-chunk `run` (z ich własnej cached `elevation`, bez dodatkowego samplowania), zapisywane jako nowy `aFall` attribute obok `aFlow`; `riverWaterMaterial.ts` miesza wstążkę w stronę prawie-opaque piany + szybszy, wielokierunkowy wzór "mgły" przy stromym spadku. Pełny shader/rendering parity z jeziorem/oceanem (reflection binding, depth-based foam) i asymetryczne (lewy≠prawy) profile brzegów pozostają świadomie odłożone bez pomiarowego uzasadnienia (patrz [plans/LOOSE-ENDS.md](../plans/LOOSE-ENDS.md)). Browser verification kanonicznego przekroju jeszcze nie zrobiony (plan world-terrain-010).

**Integracja rzek z resztą worldgenu (2026-09-06).** Rzeki są teraz respektowane przez placement osad, fauny i przez drogi — wszędzie przez tę samą kanoniczną geometrię (`RiverChannelSegment[]`), nigdy przez drugą reprezentację:

- **Osady.** `terrain/riverQuery.ts` (`createRiverQuery(sampleParams)`) to analityczny seam "jaka geometria rzeki jest w tym pudełku" dla placementu, który działa niezależnie od streamingu chunków (dlatego świadomie osobny od reference-counted `riverTileCache.ts`; oba czytają ten sam widok globalnych łańcuchów przez `computeRiverTile`, więc nie mogą się rozjechać). Query jest rejestrowane world-scoped w `settlementPlanCache.ts` (`setSettlementRiverQuery`) — cache defów jest world-scoped i "pierwszy pytający wygrywa", więc pole w kontekście dałoby layout zależny od tego, kto zapytał pierwszy. `riverQuery` czyta też listę głów strumieni (`headsNear`, plan 058 H4; `findSettlementSite` odsuwa plac od głowy o 24 m). `settlementGenerator.ts` rozwiązuje segmenty **raz na osadę** (pudełko = najszersze site-search + footprint) i podaje je do `findSettlementSite` (twardy reject placu o `SITE_RIVER_CLEARANCE` = 8 m) i `planVillageLayout` (każdy plot odrzucany przez `footprintOverlapsRiver(segments, x, z, radius + 1)` — **footprint, nie punkt środkowy**). Ostatnia deska ratunku w `pickPlot` (bezwarunkowa z definicji) dostała `pushOutOfRiver` — krokowe wypchnięcie promieniowo od centrum wioski. Wioska nadal może stać **przy** rzece i wokół niej; zabroniony jest tylko aktywny kanał.
- **Ford i most (droga × rzeka, plan world-terrain-023, 2026-09-14).** Routing zna rzeki i sam decyduje o każdym przecięciu. `settlement/roadRiverCrossing.ts` jest jedyną instancją decyzyjną: `riverHitsOnEdge()` testuje **krawędzie** A* (nie węzły — 9-metrowy krok przeskoczyłby 3-metrowy strumień między dwoma suchymi węzłami) przeciw kanonicznemu footprintowi wody, `evaluateRoadRiverCrossing()` klasyfikuje trafienie jako `ford` (tani), `bridge` (drogi — ~240 + 14/m rozpiętości) albo odrzuca krawędź (za długie przęsło, zbyt skośne przejście, most na ścieżce do minor location — `path` jest w V1 wyłącznie ford-only). Dzięki temu dobry bród kilkaset metrów dalej wygrywa z niepotrzebnym mostem tym samym modelem kosztu A*, a nieobsługiwalne przejście wymusza objazd albo brak trasy — nigdy „gołej” drogi w rzece. Ford wymaga **i** szerokości (< 9 m wody), **i** głębokości (≤ 1.1 m) — wąski, ale głęboki kanał nie zostaje brodem.

  Wynikiem trasy jest `RoadRoute { points, segments, kind, crossings }` w tym samym, symetrycznym `routeCache` (trasa liczona w kanonicznej orientacji po posortowanych id osad, żeby kolejność pytających nie zmieniała worldgenu). Ten `routeCache` może zostać zhydratowany z disposable namespace `road-routes` (plan world-terrain-029) — hydracja odtwarza kanoniczny wynik łącznie z `crossings` i nie reklasyfikuje brodów/mostów. Kanoniczne rekordy `RoadRiverCrossing` są wyprowadzane z **finalnej** polilinii (po meandrze i kotwicach przecięć, przed wygładzaniem profilu), więc invariant „każde przecięcie ma dokładnie jeden rekord i odwrotnie" trzyma się z konstrukcji; kotwice przecięć i ich punkty dojścia są zablokowane przed meandrem, a rozjazd topologii deterministycznie cofa geometrię do wariantu bez meandra.

  `terrain/riverFord.ts` nie decyduje już o niczym — zostaje przy matematyce kształtowania: `FordProjection` (zorientowana elipsa wokół kotwicy przecięcia), `fordInfluenceAt()` i `fordBedHeight()`. `roadNetwork.fordsNear()` rzutuje zadeklarowane brody do `ChunkTileParams.fordProjections` (te same worker-safe liczby co `RoadCorridorSegment[]`), a `applyRiverChannel` podnosi dno do `waterH - 0.12` **tylko** wewnątrz takiego footprintu — przypadkowe nałożenie drogi na rzekę bez rekordu zostawia kanał całkowicie naturalny. Ten sam `fordBedHeight` czyta `sampleLocalWater()` (przez `ChunkRecord.fordProjections`), więc gameplayowa głębokość zgadza się z ukształtowanym terenem. Kanoniczna `waterH` i wstążka wody pozostają nietknięte — hydrologia nie zależy od dróg. Rekord `kind = 'bridge'` ma teraz deterministyczną projekcję runtime (plan world-terrain-033). `terrain/roadBridge.ts` — worker-safe `RoadBridgeSpec` (pozycja/yaw/span/width/deckY) plus jedyny wspólny test footprintu (`isOnBridgeDeck`/`bridgeDeckYAt`), którego używają prezentacja, kalkulacja terenu i ground query, żeby nigdy się nie rozjechały. `roadNetwork.bridgeSpecOf()` (analog `fordProjectionOf`) czyta profil trasy (`RoutePoint.hs` najbliższy kotwicy) zamiast ponownie samplować teren/wodę — `deckY` to ten profil, podniesiony tylko gdy trzeba utrzymać clearance nad `waterH`. `bridgesNear()` (analog `fordsNear()`, ale z dedupem po `id` i stabilnym sortowaniem — most to runtime identity, nie tylko wpływ kształtowania) rzutuje `RoadBridgeSpec[]` do `ChunkTileParams.bridgeProjections`; wewnątrz footprintu decku `chunkHeightmap.ts` wygasza wkład korytarza drogi (wysokość i tint) zamiast budować groblę pod mostem — kanoniczne cięcie rzeki (etap 3) i kształtowanie dojazdów poza przęsłem są nietknięte. `ChunkManager` retencjonuje `bridgeSpecs` per chunk (jak `fordProjections`) i buduje prezentację (`world/createBridge.ts` — tania płyta + poręcze + filary, współdzielona geometria/materiał) wyłącznie w chunku właścicielu (`worldToChunk(spec.x, spec.z)`), więc most rozciągnięty na dwa chunki nigdy nie powstaje podwójnie. Deck nigdy nie jest kolizją (`world/collision.ts` nie ma podłogi) — `ChunkManager.sampleBridgeDeck`/`sampleSurfaceGround` to współdzielony query ruchu (teren + deck), z którego korzysta `PlayerController` (przed cave, potem deck, potem teren) oraz `NpcAgent`/`AnimalAgent` przez lokalnie skomponowany `sampleHeight`/`sampleLocalWater` (most nie zmienia hydrologii — na decku `sampleLocalWater` po prostu nie widzi wody pod spodem).

- **Fauna.** `createFauna` przyjmuje `ChunkManager.riverShoreDistance`; `clearsRiverChannel(distance, clearance)` (czysta, eksportowana) gatuje **każdy** dziki spawn (`SPAWN_RIVER_CLEARANCE` 1.5 m) i osobno każdy habitat spawn point przez `spawnerSiteOk` (`SPAWNER_RIVER_CLEARANCE` 6 m) — generycznie dla wszystkich `SPAWNER_SPECS`, nigdy wyjątek per-gatunek. Bez `riverShoreDistance` (testy) zachowanie jest jak wcześniej.
- **Shader.** `riverWaterMaterial.ts` zamienił regularne `fract(vUv.y * 0.18 - uTime * 0.9)` streaki (czytane jako równomiernie rozstawione białe poprzeczki = szwy segmentów) na dwie oktawy taniego value noise, samplowane znacznie rzadziej wzdłuż nurtu niż w poprzek, więc refleks jest wyciągnięty wzdłuż prądu i nieregularny. `aFlow` i wodospadowa ścieżka `vFall` nietknięte.

Nadwodna/przybrzeżna roślinność (plan world-terrain-010, Fazy 4/6): `chunkVegetation.ts`'s `riparianPatches()` to osobny, ograniczony budżetowo pass (nie tylko podbite prawdopodobieństwo `reed` w zwykłej pętli) — patche trzcin/paproci-krzewów/drzew wzdłuż pasma `nearestRiverBankDistance`/istniejącego pasma linii brzegowej jeziora. `lilyPatches()` dokłada nowy `VegetationKind: 'lily'` (`LILY_SPECS`, `nature/lilypad_01.glb` — fit `preparePropFitMax`, nie zwykły height-fit) tylko na płytkiej wodzie śródlądowej (`bodyScale` 0 < x < 0.9, nigdy ocean, nigdy wewnątrz kanału rzeki). Gęste klastry trzcin (osobne merged-mesh assety) i seaweed przybrzeżny (Fazy 5/7) **nie** zostały dodane — brak gotowych assetów, nikt ich w tej turze nie autorował.

Wejścia kodu:

```text
src/terrain/worldHydrology.ts         pure global hydrology (+ WORLD_HYDROLOGY_VERSION)
src/terrain/worldHydrologyStore.ts    install map, correction/lake/stream-head samplers
src/terrain/worldHydrologyRegistry.ts hydrologyIdFor, public install API
src/terrain/worldHydrologyRuntime.ts  boot install (registry → cache → compute), single-world retention
src/terrain/worldHydrologyCache.ts    IndexedDB namespace `hydrology`
src/terrain/riverChainClip.ts         clip of global chains to a tile rect
src/terrain/riverNetwork.ts           tile view, width/depth, canonical heights, channel segments
src/terrain/riverTileCache.ts
src/world/riverGeometry.ts
src/world/riverWaterMaterial.ts
src/world/createRiverWater.ts
src/terrain/chunkHeightmap.ts      applyRiverChannel (carving stage) + projekcja fordu
src/terrain/riverFord.ts           FordProjection / fordInfluenceAt / fordBedHeight
src/settlement/roadRiverCrossing.ts  kanoniczna klasyfikacja ford/bridge (world-terrain-023)
src/terrain/riverQuery.ts          analityczny river lookup dla placementu
src/terrain/chunkVegetation.ts     riparianPatches / lilyPatches (plan world-terrain-010)
```

Implementacja P0–P1 (unifikacja materiału jezioro/ocean, depth fade, brzeg, fale, wspólne lustro) jest zakończona. Pełna implementation history (issue-by-issue fixes, phase completions, screenshot diagnoses) jest przeniesiona z tego dokumentu — zob. plan [098](../plans/archive/2026-08-13--098--water-unified-shader-shore-reflections.md) oraz issues [001](../issues/2026-08-07--001--water-shore-color-banding.md)/[002](../issues/2026-08-07--002--water-daynight-integration.md)/[003](../issues/2026-08-07--003--ocean-shoreline-artifacts.md)/[009](../issues/2026-08-10--009--ocean-normal-map-reflection-blotches.md)/[022](../issues/2026-08-12--022--ocean-through-tree-foliage.md)/[028](../issues/2026-08-13--028--inland-water-dual-material.md). Jedyna wciąż aktualna, forward-looking pozycja: SSR/refrakcja/caustics/mirror > 256² — świadomie **nie**.

---

## Water/land query contract

Which question → which function (review 030; verified against code 2026-11-03). Do not compare a height against `waterLevel` to ask "is there water" — that only describes the sea.

| Question | Use | Covers |
| --- | --- | --- |
| Is there water here, how deep, what kind (movement, swimming, fauna, drinking)? | `sampleLocalWater` (via `ChunkManager` / `WorldBundle`) | sea + lake + river (river wins), fords, bridges |
| Can I place a static object / site / plot here (dry land)? | `sampleLandHeight[At]` **and** a river check (`footprintOverlapsRiver` / `riverShoreDistance`) | land view: sea + lake → `waterLevel`; rivers are **not** in the land view |
| Is this chunk texel wet (worker arrays)? | `isWetFloor(heights[i], floorHeights[i])` (`waterSurface.ts`) | sea + lake |
| Is this near the sea / coastal (beach, shells, ocean tint)? | `waterLevel` comparisons, `isWaterOrShore`, `sandBandAt`, `oceanMixAt` | sea only, by design |
| Is the floor below sea level (map/catalog classification)? | `isFloorBelowSea` (`terrainClassification.ts`) | sea only — the world-location catalog still reads lakes as land (queue Q106) |
| Walking / object Y | `sampleHeight` / `sampleSurfaceGround` | true surface (never the land view) |

## Physical water query & WaterSource

`terrain/waterSample.ts`'s `sampleLocalWater()` jest jedyną, współdzieloną odpowiedzią "czy i jaka woda jest fizycznie w tym punkcie" (jezioro/ocean z `floorHeights`, rzeka z kanonicznych `waterH`/`bedH` — rzeka zawsze wygrywa gdy oba nakładają się). Główny konsument: `fauna/waterTraversal.ts`'s czysty klasyfikator dry/wading/swimming/blocked, dzielony 1:1 przez autonomiczny i dosiadany ruch fauny (zob. [fauna.md](./fauna.md#behaviour)).

`world/WaterSource.ts` to osobna, współdzielona abstrakcja drink/fill nad `well`/`lake`/`river`/`ocean` — nie ta sama warstwa co `sampleLocalWater()` (fizyczna obecność wody), tylko kontrakt "czy i jak można z tego pić/napełnić". Każde źródło niesie `WaterQuality` (`safe`/`unsafe`/`undrinkable`) i opcjonalny `consumptionRisk`. Studnia jest zawsze `safe`, ocean zawsze `undrinkable`, jezioro zawsze `unsafe` (ostrzeżenie, bez systemu chorób). Jakość rzeki jest **kontekstowa**: `WorldBundle.riverWaterQuality` (`riverWaterQualityResolver.ts`) klasyfikuje punkt poboru na podstawie hydrologii (elevation/accumulation) i bliskości osady — fail-closed do `unsafe` gdy kontekst nie jest dostępny. `createWaterSource('river')` zwraca `safe` tylko jako domyślny fallback dla testów; produkcyjna ścieżka drink/fill przez `app/interactables.ts` zawsze woła resolver. Jedyny obecny `consumptionRisk` to nieprzykryta studnia gracza (zob. [player-systems.md](./player-systems.md#player-built-wells-plan-127-groundwaterprotection-by-plan-world-004)). Konsumenci: akcje gracza (`app/actions/survivalActions.ts`), `app/interactables.ts`, gospodarstwa (`Household.water` dla ludzi i zwierząt domowych, zob. [settlements.md](./settlements.md#gospodarstwa-plan-069)), `items/itemCatalog.ts`, oraz `persistence/saveData.ts` (tylko rekord studni gracza — sam `WaterSource` jest zawsze rekonstruowany, nigdy zapisywany wprost).

## Persistence

Teren/hydrologia/geometria wody są deterministyczną rekonstrukcją `(seed, region params)` — nigdy nie persystowane w saveach (IndexedDB `hydrology` i boot fixture to wyłącznie cache obliczeń, wyprowadzany z `hydrologyId`). Persystowany jest tylko stan zbudowany przez gracza (rekord studni, `SaveData.playerWells`, z `waterDepth`/`waterKind` zamrożonym raz przy postawieniu). Cache'e wewnątrzsesyjne (`riverTileCache`, brak analogicznego cache'u dla jezior/oceanu) są zwykłymi, nietrwałymi cache'ami nad czystymi funkcjami — nigdy źródłem prawdy. Zob. [persistence.md](./persistence.md) po pełną klasyfikację.

---

## Otwarte

| Temat | Status | Link |
|-------|--------|------|
| Blotches w lustrze oceanu | `verification needed` | issue [009](../issues/2026-08-10--009--ocean-normal-map-reflection-blotches.md) — pass 256² wrócił w fazie 3; nie zagęszczać detail normals |
| Artefakty oceanu na telefonie | notatka | [plans/README.md](../plans/README.md) Quick notes; wyłączenie odbić (W9) |
| Rzeki: browser/perf verification | `verification needed` | plany [181](../plans/archive/2026-08-21--181--natural-mountains-and-rivers.md) / [189](../plans/archive/2026-08-21--189--river-channel-carving.md) |
| Rzeki: pełna parytetowość z jeziorem/oceanem | `todo`, świadomie odłożone bez pomiarowego uzasadnienia | [plans/LOOSE-ENDS.md](../plans/LOOSE-ENDS.md) |
| Rzeki/jeziora po 058: browser check (ciągłość strumienia do zatoki, wstążka vs skorygowany teren, szwy na zbiegach) | `verification needed` | queue §2 (Q77/Q78), Q92/Q98 |
| Katalog lokacji widzi jeziora jako ląd | `todo` | queue Q106 |

---

## Powiązane

- [GRAPHICS.md](../architecture/GRAPHICS.md) — G3–G6, log 2026-08-12
- [state/terrain-and-world-generation.md](../state/terrain-and-world-generation.md) — teren/chunki/mountains (rzeki żyją tutaj, nie tam); terrain-side ownership seamów rzeki↔osada/droga/fauna
- [fauna.md](./fauna.md) — konsumpcja `sampleLocalWater()` przez `waterTraversal.ts` (dry/wading/swimming/blocked)
- [settlements.md](./settlements.md) — river placement rejection przy siting/plot; `household.water` jako konsument `WaterSource`
- [player-systems.md](./player-systems.md) — studnie gracza, drink/fill akcje
- [persistence.md](./persistence.md) — pełna klasyfikacja persystencji
- [STATE.md](../STATE.md) — WorldBundle.ocean, skrót ocean/jeziora
- [reviews/2026-08-07--001--water-quality.md](../reviews/2026-08-07--001--water-quality.md)
- [architecture/performance-and-workers.md](../architecture/performance-and-workers.md)

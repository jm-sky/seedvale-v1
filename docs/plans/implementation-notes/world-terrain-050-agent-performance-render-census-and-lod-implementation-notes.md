# world-terrain-050 — implementation notes

## 2026-10-28 — poprawki po review A1′

Zakres: F1–F3 z [review 029](../../reviews/2026-10-28--029--world-terrain-050-a1-skinned-mesh-culling-review.md). Zmiany dotyczą wyłącznie bounds i testów NPC; bez nowej pracy per-frame.

- **F1:** `installActorCullBounds` obsługuje translację, obrót, skalę jednorodną i odbicie. Sprawdza root→world, mesh→root i mesh→world; niejednorodna skala i shear wyłączają culling (dla błędnego root — cały aktor, dla mesha — ten mesh). Niewielki zapas promienia pokrywa tolerancję numeryczną testu podobieństwa macierzy. Późniejsze transformacje wrappera/przodków muszą zachować kontrakt, a mesh→root musi pozostać stałe; nie ma walidacji per-frame.
- **F2:** przed inwersją sprawdzane są skończoność, odwracalność i minimalna skala. Przed zapisem sfery sprawdzane są również odwrotność, środek i promień. Niepoprawny box po transformacji nie zatruwa unii rodzeństwa.
- **F3:** testy używają wyłącznie `getVertexPosition` i sprawdzają wszystkie wierzchołki po ruchu kości. Test krawędzi frustum potwierdza widoczny animowany koniec przy środku sfery poza obrazem.
- Pomiar instalacyjnego boxa używa tymczasowego pola `boundingBox` i przywraca poprzednią wartość również po wyjątku. Helper nie pozostawia nowego statycznego boxa używanego później przez raycast.

Testy regresji obejmują kontrprzykład skal z F1, częściowo zerową skalę z poprawnym rodzeństwem, NaN/Infinity, shear od przodka, odbicie, niezależne rigi, powtórną instalację, zachowanie istniejących boxów oraz dwa niezależne frusta kamery i światła.

`src/render/actorCullBounds.assets.test.ts` korzysta z rzeczywistych GLB i produkcyjnego `assembleCharacter`; zastępuje jedynie transport plików odczytem z dysku i pomija materiały, aby skinning CPU nie wymagał DOM/GPU. Dla obu płci Peasant z head/hair (żeńska także PeasantSkirt, męska także beard) sprawdza wszystkie wierzchołki w 17 próbkach każdego z klipów Walk_Loop, Sprint_Loop, Sword_Attack, Sitting_Idle_Loop, Death01, Fixing_Kneeling i Interact, włącznie z końcową klatką. Legacy Worker: Walk, Run, Sword_Slash, Interact i Death. Dodatkowo sprawdza `SkeletonUtils.clone` po instalacji i bezpośrednie osadzenie końcowej pozy śmierci przez produkcyjny animation set.

W aktualnym kicie brak LayToIdle; sprawdzono zachowanie bieżącej animacji idle, zgodne z fallbackiem `NpcAgent.beginSleepPose`/`syncAnimation`. Nie jest to test wykonania całego lifecycle NPC.

Weryfikacja techniczna: 45/45 testów w `actorCullBounds.test.ts`, `actorCullBounds.assets.test.ts`, `agentAnimationSet.test.ts` i `characterAssets.onDisk.test.ts`; lint zmienionych plików; `pnpm run build` (type-check i produkcyjny build Vite) — PASS, z ostrzeżeniem Vite o dużych chunkach. Próbkowanie klipów nie stanowi dowodu dla dowolnych animacji, morphów ani animowanych skal. Zmiana geometrii/rigu/składu aktora wymaga ponownej instalacji.

Manualny browser check poppingu, przejść animacji, unload/reload i rzeczywistego shadow pass pozostaje po stronie autora zgodnie z planem. Nie wykonywano benchmarków ani pomiarów FPS/GPU.

# Ściany domów: ukośne pasy (shadow acne) przesuwające się podczas chodzenia

**Status:** `verification needed`
**Created:** 2026-10-30
**Źródło:** zgłoszenie autora — na tynku domów ukośne, powtarzające się pasy; przesuwają się przy chodzeniu postaci, nie przy obrocie kamery; znikają całkowicie z `?debugNoShadows=1`.
**D4:** krytyczna poprawka wizualna; workload nie rośnie (shadow pass rasteryzuje jedną stronę części domów zamiast obu; snapping to kilka operacji CPU w `follow()`). Brak nowych passów, programów i draw calli.

## Przyczyna (kod + assety, 2026-10-30)

1. **Wszystkie materiały megakit są `doubleSided`** (każdy GLB w `public/models/settlement/megakit/`, w tym `MI_Plaster`, `MI_Brick`, `MI_UnevenBrick`, `MI_RoundTiles`, `MI_WoodTrim`). three r185 (`WebGLShadowMap.getDepthMaterial`) renderuje materiał `DoubleSide` do shadow mapy **obiema stronami** — więc oświetlone lico ściany samo trafia do mapy głębi (dla `FrontSide` three renderuje tylko tylne ściany, co samo chroni przed acne).
2. **Bias za mały na stok ściany.** Mapa 1024² na frustum 160 m → texel ≈ 0.156 m. Dla pionowej ściany przy słońcu `(40, 70, 30)` (elewacja ≈ 54°) różnica głębi w obrębie jednego texela to ≈ 0.156·tan θ ≈ 0.15–0.25 m (więcej dla ścian ustawionych bokiem do słońca), a `shadow.bias = -0.0002` na zakresie `far − near = 199` daje ≈ 4 cm. Lico na zmianę wypada „za” i „przed” zapisaną głębią → pasy samocienia. Ukośne, bo siatka texeli światła jest rzutowana skośnie na pionową ścianę.
3. **Pasy pływają z graczem, nie z kamerą.** `WorldLights.follow()` przesuwała frustum cienia płynnie za graczem (bez przyciągania do siatki texeli), więc granice texeli — a z nimi pasy acne — przesuwały się po świecie przy każdym kroku. Obrót kamery nie rusza kamery cienia, stąd brak efektu.

Teren/roślinność nie mają tego problemu w tej skali: teren nie rzuca cienia na siebie (review 005), a geometria `FrontSide` dostaje back-face rendering.

## Rozważone rozwiązania

| Opcja | Ocena |
| --- | --- |
| Większy `shadow.bias` | Globalny; żeby pokryć ~0.25 m stoku trzeba ≈ 6× więcej — peter-panning (cienie odklejone od podstaw NPC/propów) w całym świecie. Odrzucone. |
| `shadow.normalBias` ≈ 1 texel | Globalny, dobrze działa na acne, ale przesuwa próbkowanie wszystkich odbiorników o ~0.15 m (cieńsze/odsunięte cienie pni, NPC, płotów) — zmiana wyglądu poza domami. Odrzucone jako niepotrzebnie szerokie. |
| `receiveShadow = false` dla części domów | Zero acne i mniej próbek PCF, ale **wnętrza tracą cień**: podłoga i wewnętrzna strona ściany zwróconej do słońca byłyby oświetlone słońcem przez dach/ściany (gracz wchodzi do domów); domy w cieniu drzew „świecą”. Odrzucone. |
| **`material.shadowSide = BackSide` dla nieprzezroczystych części domów** | Ściany to płyty (~0.20 m, lico + tył; zweryfikowane na geometrii `wall_plaster_*`), dachówki/szczyty mają grubość. Do mapy trafia tylna strona — lico leży ≥ 0.2 m przed zapisaną głębią, więc acne znika niezależnie od stoku; domy dalej rzucają cień i odbierają cienie (okapy, drzewa, sąsiednie domy, wnętrza). Shadow pass rasteryzuje mniej. **Wybrane.** |
| **Snapping frustum do texeli w `follow()`** | Standardowa poprawka „shimmeringu” — siatka texeli stoi w miejscu w świecie, krawędzie cieni nie pełzają przy chodzeniu. Koszt pomijalny. **Wybrane (uzupełnienie).** |

## Fix (2026-10-30)

- `src/settlement/houseBuilder.ts` — `applyHouseShadowSide()` wołane w `loadHousePartTemplates()` (jedyna ścieżka ładowania części domów: osady, `createResidentialBuildings`, house browser). Ustawia `shadowSide = BackSide` dla materiałów `DoubleSide`, które nie są `transparent` (szyby) ani `alphaTest` (pnącza — pojedyncze karty, które inaczej przestałyby rzucać cień). Materiały są współdzielone z cache GLTF; ładują je tylko części domów.
- `src/world/createLights.ts` — `follow()` przyciąga środek frustum do całych texeli w przestrzeni światła (osie prawo/góra kamery cienia, liczone jak w `LightShadow.updateMatrices`); kierunek słońca, rozmiar frustum i `bias` bez zmian. Rozmiar texela czytany z bieżącego `mapSize` (512/1024, plan 103).

Bez zmian: `shadow.bias`, rozmiar mapy/frustum, `PCFShadowMap`, budżet odświeżania cienia (plan 145), cienie innych obiektów.

## Weryfikacja

- Technicznie: `vitest` — nowe testy `createLights.test.ts` (siatka texeli stała w świecie dla 512²/1024², kierunek słońca zachowany, środek frustum ≤ ½ texela od gracza) i `houseBuilder.test.ts` (`shadowSide` tylko dla nieprzezroczystych `DoubleSide`); `src/settlement src/world src/render src/house-browser` 2872/2872 (5 workerów nie wystartowało przez brakujący w `node_modules` pakiet `is-potential-custom-element-name` jsdom — środowisko, niezwiązane). `eslint` czysty, `pnpm run build` OK, `tsc --noEmit` — tylko istniejące wcześniej błędy w `src/ui-vue/demos/hud/fixtures.ts`.
- **Wizualnie: nie zweryfikowane w przeglądarce.** Zadanie autora (kolejka §2): `?seed=415424794` w osadzie w ciągu dnia — chodzić wzdłuż domów: brak pasów na tynku/cegle/dachach; domy dalej rzucają cień na ziemię; okapy i drzewa nadal cieniują ściany; wnętrze domu (podłoga, ściany) bez plam słońca przechodzącego przez dach/ściany; krawędzie cieni nie pełzają podczas chodzenia; porównanie z `?debugNoShadows=1`.

## Ograniczenia

- Pojedyncze płaszczyzny `DoubleSide` w częściach domów zwrócone licem do słońca (np. pas `MI_Brick` przyklejony do tynku) nie rzucają już własnego cienia — leżą na ścianie, więc wizualnie bez znaczenia.
- Pozostałe budynki spoza megakit (`hut_*`, `towncenter` itd., też `doubleSided`) nie są ładowane przez `loadHousePartTemplates` — jeśli pojawią się w świecie z tym samym objawem, ta sama funkcja do nich pasuje.

## Pliki

- `src/settlement/houseBuilder.ts`, `src/settlement/houseBuilder.test.ts`
- `src/world/createLights.ts`, `src/world/createLights.test.ts`

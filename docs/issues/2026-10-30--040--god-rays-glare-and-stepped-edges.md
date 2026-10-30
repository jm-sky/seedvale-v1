# God rays: oślepianie przy niskim słońcu + schodkowe krawędzie promieni

**Status:** `verification needed`
**Created:** 2026-10-30
**Źródło:** zgłoszenie autora (prompt przygotowany przez GPT) — oślepianie przy patrzeniu w nisko położone słońce, poszarpane/stopniowane krawędzie promieni.
**Powiązane:** [issue 016](./2026-08-11--016--god-rays-mountain-whiteout.md) (whiteout, clamp `0.2`), [issue 033](./2026-08-17--033--bloom-whiteout-threejs-185-upgrade.md) (bloom po three r18x).
**D4:** zmiana shadera post-process na prośbę autora (jakość, nie wydajność) — ta sama liczba tapów (32), brak nowych passów/buforów; kilka operacji ALU na tap. Zapisana jako wyjątek; A/B GPU w §4 kolejki.

## Diagnoza (kod, 2026-10-30)

Pipeline bez zmian: `AO → SMAA → Bloom (½ res) → GodRays → GradedOutput (ACES 0.88 + grade)`. God rays działają na liniowym, nie-ztonemapowanym HDR.

| Składnik | Wkład w oślepianie |
| --- | --- |
| HDR sky (Preetham, `mieCoefficient 0.004`) | Tarcza słońca i halo Mie mają luminancję ≫ 1 — biały dysk/halo po ACES jest naturalny i **nie** pochodzi z god rays. Bez zmian. |
| Bloom | `bloomStrength 0.02`, `threshold 0.95` (liniowy HDR), ½ res — wkład pomijalny przy obecnych ustawieniach (po issue 033). Bez zmian. |
| God rays (stary shader) | **Główny winowajca dużego jasnego welonu.** Suma 32 tapów `samp·bright·decay^i·0.4` na surowym HDR — dla nieba lum ≈ 1.2–20 przekracza clamp `0.2` niemal zawsze. Model numeryczny (1D, ścieżka niebo/okluder): wynik = **0.200** przy 100 %, 75 %, 50 % i 25 % oświetlonej ścieżki; nawet **jeden** tap tarczy słońca (lum 50) daje pełne 0.200. Efekt: płaski plateau +0.2 liniowo na wszystkim, co „widzi” słońce — ciemny piksel 0.05 → po ACES ok. 0.036 → 0.331 (≈9×). Postacie/drzewa tracą kontrast, a smugi nie mają gradacji (wszystko nasycone). |

Ząbkowanie / stopniowanie:

1. **Banding próbkowania** — 32 tapy w stałych pozycjach, krok `0.9·|uv−sun|/32` (np. 0.014 UV ≈ 27 px przy 1920 px dla piksela 0.5 UV od słońca) → koncentryczne schodki.
2. **Fireflies HDR** — pojedynczy tap w tarczy słońca przełącza piksel między 0 a pełnym clampem → twarde krawędzie przy sylwetkach.
3. **Twardy `min()` per kanał** — granica plateau to nieciągłość pochodnej (widoczna krawędź), dodatkowo spłaszcza barwę do bieli.

**Render scale:** composer działa na `logicalSize × min(dpr, pixelRatioCap)` (preset low 1 / medium 1.5 / high 2), god rays na pełnej rozdzielczości composera. Krok tapu jest stały w UV, więc schodki mają ten sam rozmiar ekranowy niezależnie od skali; koszt rośnie liniowo z liczbą pikseli (32 fetchy half-float/piksel). Niższa skala (low) daje bardziej aliasowane sylwetki na wejściu.

**SMAA:** przesunięcie za god rays **nie** pomaga — schodki to niska częstotliwość (krok tapu), nie aliasing geometrii; SMAA przed god rays daje promieniom już wygładzone sylwetki. SMAA na liniowym HDR (przed tonemappingiem) wykrywa krawędzie gorzej niż na sRGB — przeniesienie za `OutputPass` dotyczyłoby AA całej sceny (osobny kandydat, poza zakresem).

## Fix (2026-10-30)

`src/render/godRaysShader.ts` (domyślnie, flaga `?godRaysSoft=0` = stary shader do A/B):

1. Każdy tap ograniczony do luminancji 1 (`samp / max(lum, 1)`) — tarcza słońca nie dominuje sumy (brak fireflies).
2. Suma znormalizowana przez szereg `decay` → ułamek oświetlonej ścieżki 0…1 (prawdziwa gradacja smug).
3. Miękkie ramię `0.2·(1 − exp(−x/0.2))` zamiast twardego `min(…, 0.2)` — ten sam sufit 0.2 (zabezpieczenie issue 016 zachowane).
4. Jitter pierwszego tapu per piksel (interleaved gradient noise) — banding → drobne ziarno, bez nowych tapów.

Model numeryczny (ten sam co wyżej; stary → nowy, `exposure 0.22`, `intensity 1`): pełna ścieżka 0.200 → 0.147; 75 % 0.200 → 0.107; 50 % 0.200 → 0.066; 25 % 0.200 → 0.030; jeden tap słońca 0.200 → 0.006; `intensity 0.5` 0.200 → 0.097. Wynik nie zależy już od luminancji HDR nieba.

Bez zmian: liczba tapów 32, kolejność passów, `godRaysExposure`/bloom/ekspozycja/atmosfera, fade elewacji/facing/off-screen w `updateGodRays`, wyłączanie passu przy `intensity ≤ 0.001`.

## Weryfikacja

- Technicznie: `eslint` czysty, `vitest src/render src/perf/flags` 164/164. `tsc --noEmit` — tylko istniejące wcześniej błędy w `src/ui-vue/demos/hud/fixtures.ts`. GLSL nie jest kompilowany w testach — kompilacja shadera potwierdzi się dopiero w przeglądarce.
- **Wizualnie / GPU: nie zweryfikowane.** Zadanie autora (kolejka §2/§4): `?seed=415424794&time=06:25` i `&time=17:35` (szczyt god rays przy `elev ≈ 0.08–0.12`), z ziemi i z wyżyny, patrząc w słońce; porównać domyślne vs `&godRaysSoft=0`: widoczność postaci/terenu/drzew, krawędzie smug podczas obrotu kamery (ziarno zamiast schodków), siła smug. GPU: ta sama pozycja/kamera, `?perf`, RENDER/GPU ms obu ramion (żaden benchmark nie ustawia świtu/zmierzchu, więc to A/B ręczne).

## Ograniczenia / kandydaci na później

- Ziarno jittera jest statyczne w przestrzeni ekranu — przy ruchu kamery może delikatnie „pływać” na krawędziach smug; bez TAA nie da się go uśrednić w czasie.
- Brak prawdziwej okluzji (depth) — jasne nie-niebo powyżej progu `0.75` (np. oświetlone ściany) nadal może zasilać promienie.
- Promienie dodają światło także do bliskich okluderów (postaci); fizycznie in-scatter zależy od odległości — wymagałoby głębi (osobny pass/bufor, poza zakresem).
- God rays na ½ res + upsample (tańsze i gładsze) oraz SMAA za tonemappingiem — osobne kandydaty, wymagają A/B.

## Pliki

- `src/render/godRaysShader.ts`
- `src/render/createPostProcessing.ts`
- `src/perf/flags.ts` (`isGodRaysSoftEnabled`)

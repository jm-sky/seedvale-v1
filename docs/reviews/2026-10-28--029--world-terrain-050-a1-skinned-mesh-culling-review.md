# A1′ — independent NPC skinned-mesh culling review

Data: 2026-10-28. Właściciel: [world-terrain-050](../plans/world-terrain-050-agent-performance-render-census-and-lod.md). Status review: `done`.

## Executive verdict

**PASS WITH FOLLOW-UPS.** Nie znaleziono blokującego P0/P1 w sprawdzonej zwykłej ścieżce NPC. Autor może przystąpić do weryfikacji wizualnej; nie jest to jeszcze akceptacja wydajności ani potwierdzenie wszystkich animacji. Są trzy potwierdzone P2: ograniczenia transformacji, niepełna obsługa macierzy osobliwych i podwójny skinning w testach. Nie znaleziono dowodu poppingu obecnego kitu.

Zakres: commit `e76f3f9c6136535b665f16ff74552cd0db779da5` względem rodzica `beb17519`, aktualny lokalny `main` `43a667e0`. Nowszy commit zmienia dokumentację archiwalnych planów, bez zmian `src`. Przeczytano `CLAUDE.md`, cały plan, audyt NPC/fauny z 2026-10-27, wskazane cztery pliki i bezpośrednie zależności. Nie zmieniano implementacji, testów, benchmarków ani statusu planu.

## Findings — od najważniejszych

### F1 — P2: konwersja sfery nie gwarantuje konserwatywności dla złożonych skal

**Lokalizacja:** `src/render/actorCullBounds.ts:90–93` (również założenie przestrzeni w `:31–34`). **Confidence: confirmed** dla kontrprzykładu; wystąpienie w obecnym runtime NPC niepotwierdzone.

Promień lokalny `R / maxScale(meshToRoot)` odtwarza promień R przy jednorodnej transformacji wrappera i stałej transformacji mesh→root. Nie jest to jednak sfera zawierająca odwrotny obraz całej sfery root przy skali niejednorodnej. Iloczyn skal przy późniejszym `Sphere.applyMatrix4` nie musi rozkładać się na iloczyn `getMaxScaleOnAxis` obu macierzy.

Kontrprzykład liczbowy sprawdzony w zainstalowanym Three: mesh→root = diag(10,1,1), root→world = diag(1,10,1), wycentrowany root-box o rozmiarze (0.02,2,0.02). R = 3.000099995; lokalny promień = R/10, światowy = R. Wierzchołek root (0,1,0) leży w world (0,10,0), poza sferą już przy instalacji. Taki box można uzyskać geometrią o lokalnej szerokości 0.002 i wysokości 2. Frustum obejmujące ten wierzchołek, ale odległe od środka o ponad R, odrzuci obiekt.

Dodatkowo `getMaxScaleOnAxis` to największa długość kolumny, nie norma spektralna: diag(10,1,1) × rotZ(45°) daje 7.106335 zamiast maksymalnego rozciągnięcia 10. Zagnieżdżona skala niejednorodna i obrót mogą więc tworzyć shear. Samo zastąpienie dzielenia przez max dzieleniem przez min nie rozwiązuje wszystkich późniejszych ograniczeń natywnego Three przy shear.

**Konsekwencja:** możliwe znikanie geometrii/cienia przy takich transformacjach. Nie jest to dowód błędu obecnego standardowego wrappera: `prepareProp` mnoży skalę przez skalar, `member.scale` jest skalarem; badany `Male_Peasant.glb` nie ma niejednorodnych skal węzłów.

**Minimum:** jawnie ograniczyć kontrakt i fail-open dla nieobsługiwanej skali/shear, zamiast obiecywać dowolne transformacje; dodać powyższy test. Dla wsparcia ogólnego przypadku potrzebna jest analiza pełnej transformacji świata, nie wyłącznie odwrotności mesh→root.

### F2 — P2: kontrola największej osi nie wykrywa częściowo osobliwej macierzy

**Lokalizacja:** `src/render/actorCullBounds.ts:43–44,62–66,90–93`. **Confidence: confirmed.**

Macierz diag(0,1,1) ma maxScale=1 i przechodzi `MIN_SCALE`. Three `Matrix4.invert()` dla det=0 zwraca macierz zerową, bez wyjątku. Przekształcenie środka przez tę odwrotność daje niefinitywne współrzędne (`Vector3.applyMatrix4`, dzielenie przez w=0). Helper może zapisać niepoprawną sferę i oznaczyć mesh jako culled, jeśli rodzeństwo dostarczy poprawną obwiednię. Test sprawdza jedynie skalę (0,0,0), którą maxScale faktycznie wykrywa. Osobliwy root również nie ma jawnej kontroli; często prowadzi do pustej/niefinitywnej obwiedni i fallbacku, ale nie należy polegać na tym efekcie ubocznym.

**Konsekwencja:** złamany kontrakt „unknown → always drawn”, niepoprawna sfera; nie wykazano poppingu standardowych NPC z dodatnią skalą. **Minimum:** kontrolować skończoność i odwracalność macierzy przed inwersją oraz wynikowy środek/promień; fallback per mesh (lub cały aktor dla błędnego root). Test częściowej skali zerowej z poprawnym rodzeństwem.

### F3 — P2: testy animowane nakładają skinning dwukrotnie

**Lokalizacja:** `src/render/actorCullBounds.test.ts:94–96,110–112`. **Confidence: confirmed.**

W Three 0.185.1 `SkinnedMesh.getVertexPosition()` już wywołuje `applyBoneTransform()`. Kolejne jawne wywołanie deformuje punkt drugi raz. Test „lying pose” sprawdza pojedynczy błędnie wyliczony punkt; test rigid-tip ma kości w pozycji spoczynkowej, więc druga transformacja jest zasadniczo tożsamością i nie wykrywa pomyłki.

**Konsekwencja:** zielony test nie dowodzi zawierania rzeczywistej animowanej geometrii. **Minimum:** używać wyłącznie `getVertexPosition`, sprawdzić wszystkie wierzchołki po rzeczywistym ruchu kości i wykonać test frustum na krawędzi obrazu po animacji.

## Bounding-sphere mathematical assessment

`computeBoundingBox` w tej wersji Three iteruje wierzchołki przez `getVertexPosition`, uwzględniając aktualny skinning i morph targets. Nie jest to surowy geometry-box. `root.updateMatrixWorld(true)` przed pętlą zapewnia macierze potomków w normalnym wywołaniu na świeżym wrapperze; `skeleton.update()` aktualizuje bufor kości, choć CPU `applyBoneTransform` korzysta bezpośrednio z macierzy kości. Instalacja przed mixerem daje aktualną pozę załadowanego modelu, zwykle rest pose, nie wymusza formalnie bind pose. Brakujące kości spoza drzewa nie otrzymają tutaj aktualizacji swoich rodziców — to ograniczenie uszkodzonego rebindu, nie wykazany nowy błąd poprawnego kitu.

Transformacja boxa przez inverse(root.world) × mesh.world i unia boxów są poprawne dla skończonych macierzy odwracalnych. Półprzekątna zawiera całą obwiednię instalacyjną. Dodanie jej wysokości daje zapas dokładnie H na odległość od tej obwiedni; nie daje dowodu dla dowolnej animacji. Przykład: box wysokości 2 i szerokości 0.02 daje R≈3; translacja kości o 10 jednostek może wynieść geometrię poza sferę. Również animowane skale, morph targets lub translacje korzenia klipu mogą naruszyć zapas. **To ryzyko/ograniczenie, nie potwierdzony defect istniejącego klipu.** Nie ma powodu wymagać redesignu zamiast sprawdzenia faktycznie używanych klipów.

Translacja, obrót i jednorodna skala wrappera po instalacji zachowują obwiednię; sztywny tip zwłok obraca też jej środek. Stałe różnice translacji/obrotu/jednorodnej skali rebound meshes nie dają różnych światowych sfer. Odbicie z jednakowymi modułami skal również działa. Ogólne skale/shear: F1. Animowanie lokalnego transformu samego mesha może przesunąć jego sferę względem reszty aktora; helper nie jest na to odporny. Nie potwierdzono takiego zachowania aktualnych klipów.

Brak skeletonu, brak position/skin attributes lub nieprawidłowy aktywny indeks kości zwykle rzucają w bloku try → fallback. Pusty box jest odrzucany. NaN/Infinity w boxie prowadzą do fallbacku; niefinitywna macierz może także zatruć wspólną unię i wyłączyć culling rodzeństwa (bezpieczne, koszt wydajności). Nie ma walidacji semantyki wag czy poprawności rigu; skończony box uszkodzonego modelu nie dowodzi jego animacyjnej poprawności. F2 opisuje lukę w walidacji transformów.

Sfery i boxy są własnością instancji SkinnedMesh, geometria nie jest modyfikowana. Klony SkeletonUtils nie dzielą instalowanej sfery. Powtórne wywołanie nadpisuje bounds na podstawie aktualnej pozy; jest stabilne dla tej samej pozy, ale nie przywraca automatycznie pozy spoczynkowej.

## Three.js native culling and shadows

Źródła lokalne: `node_modules/three/src/objects/SkinnedMesh.js` (`computeBoundingBox`, `getVertexPosition`, `updateMatrixWorld`, `raycast`), `math/Frustum.js:146–165`, `math/Sphere.js` (`applyMatrix4`), `math/Matrix4.js:762,815`, `renderers/WebGLRenderer.js:1885`, `renderers/webgl/WebGLShadowMap.js:505–520`, `renderers/webgl/WebGLObjects.js:46–55`. Lockfile i installed package: **0.185.1**; manifest ma zakres `^0.185.1`, lockfile ustala konkretną wersję.

Frustum używa `object.boundingSphere`, liczy ją tylko gdy null, a następnie transformuje przez bieżące `matrixWorld`. Mixer, skeleton.update i updateMatrixWorld nie przeliczają ręcznej sfery. Nie znaleziono nowej ścieżki NPC, która ją nadpisuje. Jawne późniejsze `computeBoundingSphere()` zastąpiłoby ją; to wymagałoby ponownej instalacji.

Shadow pass przechodzi scenę niezależnie i testuje frustum światła, nie wynik testu kamery. Off-camera caster nadal rzuca potrzebny cień, o ile jest visible, na właściwej warstwie, ma castShadow i pozostaje w istniejącym progu 36 m. A1′ nie zmienia tych warunków. Poprawność geometrii sfery obowiązuje także dla cienia: F1 i niezweryfikowane ekstremalne pozy mogą dotyczyć obu przejść. Nie ma nowego camera-owned visible gate.

Efekt uboczny: helper zapisuje również `boundingBox`; `SkinnedMesh.raycast` używa go jako wstępnego testu, więc nieruchomy box może odrzucać animowaną geometrię. Nie znaleziono gameplayowego raycastu NPC; istnieje debug camera-mesh raycast. To ograniczenie diagnostyki, nie blokujący błąd interakcji NPC.

## NPC lifecycle / integration

`NpcAgent.ts:1866–1879`: po ukończonym await assembly/rebind, normalizacji prepareProp, wrapperze i member.scale; przed animacją (`:1880–1906`) i przed rehydracją zwłok (`die(true)`). Kit i legacy trafiają w ten sam konstruktor (`:1987–2040`); kapsuła nie ma skinned meshes. Umieszczenie późniejszej translacji home po instalacji jest poprawne.

Nie znaleziono w aktualnej ścieżce NPC wymiany wyglądu/garment meshes po tym punkcie. Inventory/equipment nie oznacza automatycznie przebudowy modelu NPC. Przyszła wymiana geometrii, dodanie meshów lub zmiana rigu wymaga ponownej instalacji dla całego aktora; sam nowy mesh nie dziedziczy obwiedni. Rebuild/unload/reload tworzy nową instancję i ponawia konstruktor. Brak rejestru, zasobu GPU ani osobnego dispose; nie znaleziono konfliktu z settlements-023. `visible`, corpse concealment/expiry i decyzje symulacji pozostają poza helperem.

## Test coverage / minimal recommendations

Uruchomiono wyłącznie istniejący `pnpm exec vitest run src/render/actorCullBounds.test.ts`: **9/9 pass**. To test jednostkowy, nie benchmark. Nie dodano testów.

Najmniejszy użyteczny zestaw follow-up:

1. Naprawić F3; wszystkie wierzchołki po ruchu kości, plus rzeczywisty frustum przy widocznym końcu kończyny i środku za płaszczyzną.
2. Jeden test F1 oraz częściowa skala zerowa z rodzeństwem (F2); sprawdzić jawny fallback. Obrót pod niejednorodnie skalowanym rodzicem i odbicie uzupełniają kontrakt.
3. Jeden reprezentatywny assembled kit z head/hair/skirt: próbkowanie używanych walk/attack/sit/death/work clips, aktualizacja world matrices i sprawdzenie wszystkich wierzchołków. Dodać dostępny legacy rig z inną hierarchią. Brak odpowiedniego sleep clip zweryfikować przez faktyczny fallback prezentacji.
4. Dwa niezależne frusta: odrzucenie kamery i akceptacja światła dla tego samego caster; uzupełnia kontrola wizualna realnego shadow pass.

Obecny fixture ma dwa Skeleton obiekty, ale te same kości; nie sprawdza dwóch niezależnych rigów. Shared geometry i niezależność aktorów mają testy. Brakuje klonowania po instalacji, powtórnego wywołania, częściowych macierzy osobliwych, legacy GLB i frustum po animacji. Te luki nie są same w sobie potwierdzeniem błędu runtime.

## Performance plausibility

Źródło liczb: [audyt NPC/fauna](../research/v1-revival/2026-10-27--revival-audit--npc-fauna-rendering.md), diagnostyczny smoke 032, nie nowy pomiar. 352 main NPC submissions przy 520 census meshes; około 240 przypisywano wcześniej uncullable rebound head/eyes/eyebrows/hair/garment (oszacowanie audytu). A1′ obejmuje te rodziny i zastępuje także dotychczasowe lazy bounds body/legacy. Może zatem usunąć zbędne main submissions NPC za kamerą.

Dla humanoida wysokości 1.7 m promień będzie orientacyjnie 2.6 m lub większy zależnie od szerokości. Utrzymuje więcej meshów przy krawędzi obrazu niż ciasne bounds; może nawet zwiększyć body submissions względem starej małej sfery. Nie oznacza braku korzyści: aktor daleko za kamerą lub odpowiednio z boku nadal zostanie odrzucony. Sam Far >36 m nie oznacza offscreen. W audycie 49/53 NPC jest Far; nie wolno przeliczać tego wprost na oszczędność.

Koszt instalacji to pełna pętla po wierzchołkach każdego skinned mesha i aktualizacje skeletonów, plus alokacje boxów/macierz/mapy. Dotychczas uncullable części nie płaciły lazy sphere computation, więc construction CPU rośnie; bez pomiaru nie wiadomo o ile. Brak nowej pętli per-frame. Mixer i aktualizacja sceny nadal działają; odrzucone we wszystkich passach meshe mogą uniknąć renderer-owned skeleton update/upload, nie aktualizacji animacji. Shadow submissions mogą spaść dla obiektów poza frustum światła lub wzrosnąć dla body przez większe bounds. Audyt notował 32 NPC shadow submissions na refresh, z zachowanym gate 36 m. Nie obiecujemy identycznych liczników ani mierzalnego FPS/GPU zysku.

## Author visual verification and limitations

- Kit obu płci, head variants, hair/beard/skirt oraz dostępny legacy; także mniejszy member.scale.
- Powolny obrót kamery i przejście przez każdą krawędź frustum: walk/run, attack, sit, work/kneel, sleep/fallback oraz przejścia między klipami.
- Śmierć od początku do końca, rigid-tip fallback, corpse po unload/reload; brak znikających części.
- NPC ≤36 m poza obrazem rzucający widoczny cień; obrót kamery bez zaniku cienia. Oddzielnie granice frustum światła.
- Szybkie stream-in/out i ponowne wejście: wszystkie części i skale zgodne, brak wyjątków.

Nie uruchamiano przeglądarki ani benchmarku. Nie próbkowano rzeczywistych animacji na assembled modelach i nie wyliczono maksymalnych ekstremów klipów. Inspekcja GLB JSON objęła strukturę Male_Peasant i listę anims.glb, nie wszystkie legacy assets. Nie potwierdzono aktualnego wystąpienia transformów F1/F2. Matematyka jest konserwatywna dla pozy instalacyjnej w opisanym typowym kontrakcie transformacji; konserwatywność całej animacji pozostaje warunkowa. Wizualna weryfikacja jest kolejnym właściwym krokiem, a nie formalnością po zielonych unit testach.

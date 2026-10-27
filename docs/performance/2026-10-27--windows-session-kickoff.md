# Kick-off — SeedVale V1 perf, sesja pod Windows (natywny Arc)

**Created:** 2026-10-27 · Claude Code (Sonnet 5.5) · repo `jm-sky/seedvale-v1`, branch `main`
Wklej poniższy blok jako pierwszy prompt nowej sesji Claude Code uruchomionej w katalogu repo na Windows.

---

Kontynuujemy SeedVale V1 po benchmarkach A0a/B0/C0 (commit `6fb20d12` + diagnoza GL). Pracujemy **na natywnym Windows z Intel Arc** (Chrome, ANGLE/D3D11) — to jest docelowa ścieżka referencyjna; poprzednie pomiary były z WSL2 (Mesa D3D12→GL) i mają status `diagnostic`.

**Przeczytaj najpierw (tylko to):** `CLAUDE.md`, `docs/performance/results/2026-10-27--051--a0a-b0-c0-baseline-summary.md`, `docs/performance/audits/2026-10-27--gl-invalid-operation-diagnosis.md`, `docs/performance/2026-10-27--arc-baseline-runbook.md`, odpowiedni kod (`src/perf/benchmark.ts`, `src/perf/isolationProbe.ts`, `src/perf/gpuTimer.ts`, `src/input/MouseLook.ts`, `src/player/PlayerController.ts` — syncCamera).

**Cel:** poprawić wiarygodność benchmarków bez optymalizowania gameplayu/renderingu. Nie zmieniaj mechanik, deterministycznej symulacji, lifecycle NPC ani architektury renderera bez uzasadnienia. Nie oznaczaj A/B/C jako READY bez spełnienia warunków akceptacji z runbooka.

**Stan (co już wiemy):**
- GL_INVALID_OPERATION: pass = water mirror (`waterMirror.ts:146`), sampler `directionalShadowMap[0]` (`sampler2DShadow`) dostaje domyślną teksturę 1×1 RGBA, bo mirror (`gameLoop.ts:3127`) renderuje się przed pierwszym odświeżeniem cieni (`:3147`). Prawdopodobnie tylko pierwsze klatki; **nieweryfikowane**, czy występuje w oknie pomiarowym. Poprawka aplikacji = tylko propozycja (audit), wymaga mojej zgody.
- Population: w `settlement-heavy` NPC rosną 4/19→53 w oknie 30 s → brak stabilnego obciążenia.
- Kamera: pointer lock niedostępny pod automatyzacją (WSLg); trzeba hooka pozy/rotacji kamery bez pointer lock.
- `isolation`: wartości bez sensu (np. `no-postprocessing` = 3593 ms, liczne `0.0`).
- GPU timer: `unavailable` mimo dostępnego rozszerzenia (na WSL).
- Nieprzypisane skoki klatek 0,7–1,5 s (settlement-heavy, stream).

**Zadania (etapami: recon → minimalna poprawka → test → następny; małe testy diagnostyczne, NIE pełne 18 benchmarków):**
1. GL: sprawdź na natywnym Windows (a) czy błąd występuje, (b) ile błędów i **kiedy względem startu/końca okna 30 s**. Użyj *lekkiej* diagnostyki (patrz audit: tylko pierwsze ~120 klatek po `ready` albo co N-ty draw). Diagnozę oddziel od poprawki; poprawka (opcje A/B z auditu) dopiero po mojej akceptacji.
2. Deterministyczny gate stabilności populacji NPC przed oknem pomiarowym (timeout + jawny status failure w raporcie). Nie zamrażaj symulacji, nie zmieniaj populacji.
3. Kontrolowana poza/rotacja kamery dla benchmarku bez pointer lock, przez istniejący system kamery (yaw/pitch/distance w `MouseLook` state / `PlayerController.syncCamera`).
4. Isolation: znajdź i napraw tylko *udowodnione* błędy pomiarowe (zera, 3593 ms, okna 150/400 ms, GPU drain).
5. GPU timer: sprawdź czy działa na natywnym Windows; status ma być jawny (supported/resolved/disjoint).
6. Trace Chrome (`pnpm trace:analyze` / `scripts/trace_analyzer`) dla `settlement-heavy` i `stream`, żeby przypisać długie klatki do operacji — jeśli środowisko pozwala.

**Uwaga operacyjna (WSL już padał dwa razy):** jedna karta Seedvale naraz; ciężkie runy szeregować; 30 s przerwy przed/po każdym runie; **zapisuj wyniki etapami na dysk**, nie na końcu; nie włączaj per-draw `getError()` na całym 30 s oknie. Uruchamianie: `PORT=5577 pnpm run dev` (restart po checkout, żeby SHA się zgadzał), fresh profil przeglądarki, `?benchmark=<id>`; fire-and-forget + polling `window.__benchRunning` (runbook). `hardwareClass: target-gpu` tylko na zweryfikowanym Arc natywnym.

**Zakończenie:** zapisz wyniki, dowody, ograniczenia i blokery w repo (`docs/performance/…`), uruchom `pnpm run test && pnpm run type-check && pnpm run lint && pnpm run build`, commit + push na `main` (bez force push). Na końcu podaj po polsku: root causes, zmienione pliki, wyniki testów, nierozwiązane problemy, SHA commita.

# Implementation Notes: world-034 — Time-skip clock exactness and catch-up coverage

**Reviewed:** 2026-09-20  
**Source:** current `main` codebase + `docs/STATE.md` + `docs/plans/PLANNING.md` + plan + simulation/living-world audits

## Najważniejsze ustalenia z reconu

- Defekt zegara z planu jest aktualny. `gameLoop.ts` wywołuje `timeSkip.tick(dt)` przed `tickDayNight(dayNight, dt)`; kończący tick w `timeSkip.ts` przywraca `previousMultiplier` przed późniejszym `tickDayNight`. Catch-up dostaje pełne `skip.hours`, ale zegar końcową klatkę liczy już normalnym mnożnikiem.
- `DayNightState.elapsedDays` / `timeOfDay` pozostają jedyną władzą World Time. Nie dodawać korekcyjnego zegara ani bezpośredniego trwałego licznika w `TimeSkip`.
- `SettlementsManager.resolveTimeSkip()` nie jest już tylko replayem NPC: poza live NPC uruchamia agriculture stamp i checkpointy travel/transport/merchant. `npc-058-time-skip-resource-and-interrupt-parity.md` osobno naprawia resource/interrupt semantics. World-034 ma przekazać tym ścieżkom poprawny, dokładnie jeden interwał, ale nie rozwiązywać ich logiki zasobów.
- `AnimalAgent.resolveTimeSkip(elapsedSeconds)` jest właściwym wspólnym prymitywem dla wild/livestock/rats: live agent → `tickAnimalLife` + `advanceAge`; corpse → tylko `settleDeathPose()`. Po `fauna-029` corpse age wynika z `deathAtDays` vs `elapsedDays`; nie dodawać catch-up sekund dla corpse.
- `Fauna.resolveTimeSkip()` iteruje wyłącznie własne wild `agents`. Loaded `Settlement.livestock`, `Settlement.rats` i managerowe `detachedLivestock` są oddzielnymi live kolekcjami `AnimalAgent` i obecnie nie dostają catch-up.

## Decyzja: handshake zegara

Najmniejszy bezpieczny wariant to rozdzielić **czas reprezentowany przez bieżącą klatkę skipu** od momentu przywrócenia normalnego mnożnika.

Preferowany kontrakt:

1. `TimeSkip.tick(dt)` wylicza, ile realnych sekund z tej klatki nadal należy do aktywnego skipu: `consumedSec = min(dt, remainingSec)`.
2. Clock advance dla skipu ma użyć dokładnie `consumedSec` przy skip multiplierze; nadmiar klatki po zakończeniu może być liczony normalnie albo odłożony do zwykłego `tickDayNight` — ale suma ma być dokładna i niezależna od frame partition.
3. Dopiero po rozliczeniu części skipowej przywrócić `previousMultiplier` i wygenerować completion/catch-up event.
4. Catch-up owners dostają **rzeczywiście ukończony interwał**, nie wartość zależną od finalnego `dt`.

Nie rób `dayNight.elapsedDays += hours / 24` bezpośrednio w `timeSkip.ts`; zachowaj `tickDayNight()` jako jedyny seam mutujący zegar. Jeśli potrzebny jest jawny helper do częściowego ticku, powinien nadal przechodzić przez `tickDayNight(state, dt)` z kontrolowanym mnożnikiem.

### Cancellation

Obecne `cancel()` tylko przywraca multiplier i gubi informację o części już wykonanej. Dla testowalnej exactness warto, aby `TimeSkip` śledził completed/remaining interval i pozwalał callerowi rozliczyć tylko część wykonaną przed cancel. Nie wolno przy cancel dopisać całego `hours`.

Uwaga: `restActions` używa `progress()`; zachować monotoniczny `0..1` kontrakt oparty o tę samą wartość remaining/completed.

## Animal catch-up fan-out

Dodaj fan-out w `SettlementsManager.resolveTimeSkip()`, obok istniejącego live-NPC replay:

- dla każdego materialized settlement: `settlement.livestock`;
- dla każdego materialized settlement: `settlement.rats`;
- managerowe `detachedLivestock`.

Każdemu agentowi wywołaj istniejące `AnimalAgent.resolveTimeSkip(gameHoursToRealSeconds(hours, dayLengthSec))`.

Nie używaj `AnimalDef.role` do klasyfikacji. Sheep/chicken/rooster mogą mieć role `prey`, mimo że są settlement livestock; autorytetem jest membership w kolekcji.

### Deduplication

Transfer ownership/streaming może zmieniać membership. Fan-out powinien mieć jeden lokalny `Set<string>` po `animalId` dla **settlement-owned + detached** kolekcji i procesować pierwszy napotkany live obiekt dokładnie raz. Nie deduplikować z wild `Fauna.agents`: te pule mają osobne ownership i nie powinny współdzielić authoritative instance.

Nie twórz nowego globalnego registry zwierząt tylko na potrzeby skipu.

## Kolejność completion w `gameLoop.ts`

Po naprawie handshake zachowaj zasadę:

```text
exact clock interval committed
→ settlement/NPC/animal/off-screen catch-up exactly once
→ normal detailed ticking resumes
```

Obecny komentarz przy `resolveOffscreenTransportArrivals(..., dayNight.elapsedDays)` zakłada już post-skip `elapsedDays`; po zmianie kolejności ten warunek musi pozostać prawdziwy.

Player needs są wyjątkiem live-ticked przez scaled `worldDt`; nie dodawać im drugiego lump catch-up.

## Testy, które dają największą wartość

- Nowy focused test dla `createTimeSkip + DayNightState`: ten sam skip przy różnych partycjach klatek (np. 1/60 i 0.05 s, z niepodzielną ostatnią klatką) kończy na tym samym `elapsedDays` i `timeOfDay`.
- Case z finalnym `dt > remainingSec`: dokładnie `N / 24` dnia skipu, bez utraty finalnego fragmentu i bez overrun.
- Cancel po części skipu: tylko wykonany fragment czasu, multiplier przywrócony, brak `justFinished`/pełnego catch-up.
- Narrow manager fan-out test: livestock + rat + detached dostają po jednym `resolveTimeSkip`; ten sam `animalId` widoczny przy przejściu kolekcji nie jest liczony dwa razy.
- Istniejące `AnimalAgent.test.ts` wystarcza do semantyki samego per-agent catch-up; nie testować ponownie metabolizmu w manager fan-out.

## Nie wciągać do world-034

- free food/wood i agriculture stamping podczas NPC skipu — `npc-058`;
- surface/cave placement po replay NPC — `npc-061`;
- off-screen symulacji ruchu/AI;
- zmian persistence klas wild/livestock/rats;
- corpse catch-up sekund po `fauna-029`.

## Prawdopodobne pliki do zmiany

- `src/world/timeSkip.ts`
- `src/app/gameLoop.ts`
- `src/settlement/SettlementsManager.ts`
- focused test dla time-skip/clock
- focused test fan-out managera lub mały wydzielony pure helper, jeśli pełny manager fixture okaże się zbyt ciężki

`src/world/dayNight.ts` powinien pozostać semantycznie bez zmian, chyba że minimalny helper jest potrzebny do jawnego częściowego advance przez istniejący `tickDayNight`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

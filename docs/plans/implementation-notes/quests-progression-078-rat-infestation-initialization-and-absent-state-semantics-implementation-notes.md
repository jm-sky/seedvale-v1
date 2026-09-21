# Implementation Notes: Rat infestation initialization and absent-state semantics

**Reviewed:** 2026-09-21  
**Source:** current `main` codebase + `docs/STATE.md` + `docs/plans/PLANNING.md` + `quests-progression-078-rat-infestation-initialization-and-absent-state-semantics.md` + plan 013 implementation

## Najważniejsze ustalenia z reconu

- Sam fresh-game bootstrap jest już poprawnie ustawiony: `createApp.ts` przekazuje do `createWorldBundle(...)` `initialSave === undefined`, a `createSettlementsManager()` seeduje `SEEDED_RAT_INFESTATION` synchronicznie po wyznaczeniu `homeDef`, przed async budową home settlement.
- Realna luka restore to `createApp.ts`: każdy istniejący save przekazuje `seedHomeStorageInfestation = false`, także save bez `storageInfestation`. Taki save tworzy pusty sparse registry i dokładnie wpada w regresję z planu. Najmniejsza poprawka bootstrapu to traktować **brak całego persisted pola** jako potrzebę inicjalizacji authored home problemu, np. na poziomie composition root przez `initialSave?.storageInfestation === undefined`. Nie seedować, gdy pole istnieje — również gdy jest pustym obiektem lub zawiera partial/resolved home record.
- Same-seed `rebuildWorldBundle()` już robi właściwą rzecz dla poprawnego runtime: bierze `snapshotStorageInfestation()` i jawnie ustawia `seedHomeStorageInfestation: false`. Tego nie zmieniać; rebuild ma przenosić fakty, nie ponownie uruchamiać authored bootstrap.
- `RatInfestationRegistry.get()` celowo spłaszcza absence do `NO_RAT_INFESTATION`. Nie zmieniać tego kontraktu dla ordinary settlements. Potrzebny jest drugi, wąski seam obecności rekordu.

## Zalecany seam obecności

Dodaj obecność na właścicielu stanu, nie w questach:

- `src/settlement/ratInfestation.ts`: `has(settlementId): boolean` albo nullable `getRecorded(settlementId)`; preferowane `has`, bo quest potrzebuje tylko rozróżnienia absent/present, a istniejące read seams nadal mogą używać `get()`.
- `src/settlement/SettlementsManager.ts`: wystaw `hasRatInfestation(settlementId)` delegujące do registry.
- `src/quests/settlementRatInfestation.ts`: rozszerz narrow snapshot o `exists: boolean`. `isSettlementRatInfestationResolved()` musi zaczynać od `snapshot.exists`; reminder dla `exists === false` powinien być fail-closed i nie mówić, że problem rozwiązano.
- `src/quests/QuestManager.ts`: domyślny `NO_SETTLEMENT_RAT_INFESTATION` musi zwracać `exists: false`. Nie dodawaj specjalnych warunków w `pollSettlementRatInfestationObjectives()` ani `maybeAdvanceResolvedStorageRatInfestation()`; oba powinny nadal korzystać z jednego pure predicate.
- `src/app/createApp.ts`: composition adapter składa snapshot z `hasRatInfestation`, `isStorageDamaged`, `isNestDestroyed` i `countAliveRats`.

To zachowuje zależność `QuestManager -> SettlementRatInfestationSnapshot`, bez importowania settlement/fauna do quest managera.

## Ważna pułapka: runtime szczurów

`SettlementsManager.countAliveRats()` zwraca `0`, gdy settlement nie jest jeszcze zmaterializowany. Home settlement buduje się asynchronicznie (`homeReady`), więc nie należy interpretować samego `aliveRatCount = 0` jako dowodu gotowości physical rat runtime.

Dla authored seedu `storageDamaged=true` i `nestDestroyed=false` już blokują completion przed `homeReady`. Po dodaniu `exists` missing record również będzie fail-closed. Nie wprowadzaj osobnego questowego `runtimeReady`, chyba że test wykaże realną ścieżkę, w której istniejący resolved registry jest obserwowany przed materializacją szczurów i może błędnie zakończyć aktywny quest. Wtedy readiness powinno pochodzić z settlement/runtime seam, nie z flagi questa.

`createSettlementRats()` nie seeduje pełnej populacji natychmiast; populacja dochodzi przez istniejący bucketed reconciliation. Nie dodawaj quest-specific spawnów ani synchronicznego tworzenia szczurów tylko dla tego fixa.

## Persistence / legacy saves

`SaveData.storageInfestation` jest nadal optional. To jest istotne: absence całego pola oznacza legacy/pre-infestation save i obecny `initialSave === undefined` tego nie obsługuje.

Nie jest potrzebny nowy format save ani version bump, jeśli zmiana ograniczy się do bootstrapu brakującego pola i read-only `exists`. Po pierwszym save poprawiony runtime zapisze normalny `storageInfestation`.

Historycznie ukończony quest pozostaje ukończony przez persisted quest progress; `QuestManager` nie repolluje completed questów przy restore. Seedowanie authored world problemu dla legacy save bez pola nie może przepisywać historycznego quest outcome.

## Testy o najwyższej wartości

- `src/settlement/ratInfestation*.test.ts`: `has(home) === false` dla pustego registry, true po `seed`, true również dla resolved record; `get()` nadal zwraca `NO_RAT_INFESTATION` dla absence.
- `src/quests/settlementRatInfestation.test.ts`: `exists:false` + 0/1 rats nigdy nie jest resolved; `exists:true` zachowuje dotychczasową tabelę warunków.
- `src/quests/QuestManager.test.ts`: injected absent snapshot nie kończy objective ani przez explicit poll, ani przez giver/reminder catch-up path (`maybeAdvanceResolvedStorageRatInfestation`).
- Bootstrap test na możliwie wąskim seamie: fresh world oraz restore bez `storageInfestation` seedują home; restore z active/partial/resolved record nie seeduje ponownie.
- Rebuild: snapshot active/partial/resolved przechodzi 1:1; `seedHomeStorageInfestation` pozostaje false.

## Kolejność implementacji

1. Dodać registry/manager presence seam.
2. Dodać `exists` do snapshotu i fail-closed predicate/default lookup.
3. Podłączyć `exists` w `createApp.ts`.
4. Poprawić restore bootstrap z „fresh app only” na „brak persisted infestation field”.
5. Uzupełnić narrow tests; dopiero jeśli testy pokażą problem readiness, rozszerzać runtime seam.

Nie zmieniać rat ecology, nest presentation, repair/destroy actions ani save schema bez konkretnej regresji wymagającej takiej zmiany.

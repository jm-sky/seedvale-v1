# Plan: Rat infestation initialization and absent-state semantics

**Created:** 2026-09-21
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** S
**Depends on:** ~~quests-progression-013~~
**Domain:** `quests-progression`
**Subdomains:** `quests`
**Tags:** `rats` `infestation` `world-state` `lifecycle`
**Roadmap:** -

## Cel

Naprawić lifecycle authored problemu „Plaga szczurów”, aby quest nie mógł zostać uznany za rozwiązany, gdy authoritative infestation w ogóle nie istnieje.

Infestacja ma być realnym stanem świata przed obserwacją przez quest: uszkodzony magazyn, intact rat nest oraz rzeczywista populacja szczurów. Quest pozostaje wyłącznie obserwatorem i kończy się dopiero po faktycznym spełnieniu istniejących warunków rozwiązania.

## Potwierdzona regresja

`RatInfestationRegistry` jest sparse. Brak wpisu jest obecnie odczytywany przez `get()` jako `NO_RAT_INFESTATION`:

```text
{ storageDamaged: false, nestDestroyed: true }
```

To jest poprawna semantyka dla zwykłej osady bez infestacji, ale nie dla authored problemu, który powinien istnieć.

Questowy evaluator uznaje infestację za rozwiązaną, gdy:

```text
!storageDamaged && nestDestroyed && aliveRatCount <= 1
```

W efekcie:

```text
missing infestation record
→ NO_RAT_INFESTATION
→ storageDamaged=false + nestDestroyed=true
→ przy 0–1 szczurach SettlementRatInfestationSnapshot wygląda jak rozwiązany
→ polling QuestManager kończy problem bez działania gracza
```

Istniejący `SEEDED_RAT_INFESTATION` ma właściwą semantykę aktywnego problemu: damaged storage + intact nest. Błąd leży w gwarancji inicjalizacji/obecności oraz w tym, że narrow quest observation nie rozróżnia „nie istnieje” od „istniało i zostało rozwiązane”.

## Zakres

### 1. Rozdzielić absence od resolved infestation

Nie zmieniać globalnej semantyki `NO_RAT_INFESTATION` dla ordinary settlements.

Dodać/wykorzystać wąski read-only seam pozwalający rozpoznać, czy dla `settlementId` istnieje authoritative `RatInfestationState`.

`SettlementRatInfestationSnapshot` / jego composition-root adapter nie może przekładać brakującego authored recordu na stan spełniający completion predicate. Preferować jawny sygnał obecności (`exists`/nullable lookup) na narrow seamie zamiast quest-owned flag.

Completion pozostaje oparty na realnych world facts i może być true wyłącznie dla istniejącej infestacji.

### 2. Zagwarantować authored infestation przed quest observation

Zachować world ownership:

```text
RatInfestationRegistry / SettlementsManager
  owns storage damage + nest state

settlement rats
  owns physical rat population

QuestManager
  only observes SettlementRatInfestationSnapshot
```

Authored home infestation musi zostać zseedowana przez istniejący `seedHomeStorageInfestation` / jego aktualny odpowiednik przed możliwością skutecznego pollingu odpowiadającego jej questa.

Reuse `SEEDED_RAT_INFESTATION`; nie tworzyć quest-specific infestation state i nie seedować świata z `QuestManager`.

Jeżeli aktualny trigger jest wyliczany w composition root, poprawić jego lifecycle/ordering tam, gdzie powstaje authored world problem, zamiast dodawać fallback w evaluatorze.

### 3. Zweryfikować bootstrap ordering

Docelowy kontrakt:

```text
new game / restore
→ home settlement identity
→ restore persisted infestation OR seed authored infestation when appropriate
→ settlement runtime / physical nest + rats
→ quest offer/acceptance
→ SettlementRatInfestationSnapshot
→ QuestManager polling
```

Sprawdzić fresh world, normal save/load oraz same-seed `rebuildWorldBundle()`.

Nie reseedować infestacji, jeżeli istnieje persisted record — także po częściowym lub pełnym rozwiązaniu. Rebuild ma przenosić istniejący registry snapshot, nie odtwarzać problemu od zera.

### 4. Zachować physical problem z planu 013

Fix nie może sprowadzać się tylko do blokady completion.

Na świeżym authored problemie muszą nadal istnieć kontrakty wdrożone przez `quests-progression-013`:

- `storageDamaged = true`;
- `nestDestroyed = false`;
- deterministic physical nest w settlement presentation;
- rzeczywiste szczury zarządzane przez settlement rat lifecycle;
- infestation replenishment zgodnie z istniejącym nest/storage/dog contractem.

Jeżeli bootstrap może wystawić quest zanim physical settlement runtime jest gotowy, snapshot ma pozostać fail-closed do czasu materializacji wymaganych authoritative facts; nie fabrykować solved state.

### 5. Completion pozostaje actor-neutral

Nie dodawać kill countera ani quest-side progress flags.

Istniejący warunek rozwiązania pozostaje:

```ts
!snapshot.storageDamaged
  && snapshot.nestDestroyed
  && snapshot.aliveRatCount <= 1
```

z dodatkową gwarancją, że snapshot reprezentuje istniejącą infestację.

Naprawa magazynu, zniszczenie gniazda i redukcja populacji mogą być wykonane przez istniejące world/systemic mechanisms; quest obserwuje wynik.

## Relevant code

Zweryfikowane punkty wejścia:

- `src/settlement/ratInfestation.ts` — `RatInfestationState`, `NO_RAT_INFESTATION`, `SEEDED_RAT_INFESTATION`, sparse registry;
- `src/settlement/SettlementsManager.ts` — registry ownership, `seedHomeStorageInfestation`, snapshot/read/mutation seams;
- `src/settlement/rats.ts` — physical rat population/reconciliation;
- `src/quests/settlementRatInfestation.ts` — `SettlementRatInfestationSnapshot`, pure completion/reminder contract;
- `src/quests/QuestManager.ts` — rat-infestation polling;
- `src/app/worldBundle.ts` — create/load/rebuild threading, `initialStorageInfestation`, `seedHomeStorageInfestation`, carried infestation snapshot;
- save/load wiring for infestation and rat persistence;
- `docs/plans/quests-progression-013-rat-infestation-nest-and-reproduction.md` and its implementation notes.

Kod jest source of truth; podczas implementacji należy ponownie sprawdzić aktualne nazwy call-sites po ewentualnych równoległych zmianach.

## Guardrails

- Nie zmieniać ordinary `missing → NO_RAT_INFESTATION` w globalne „active infestation”.
- Nie uznawać braku authoritative recordu za dowód rozwiązania authored problemu.
- Nie seedować infestacji z `QuestManager`.
- Nie tworzyć drugiego registry ani quest-owned `isInfested`/`isResolved`.
- Nie reseedować rozwiązanej lub częściowo rozwiązanej infestacji po save/load, stream-in ani same-seed rebuild.
- Nie tworzyć szczurów lub nest props bezpośrednio z questa.
- Nie zmieniać istniejącej ekologii/replenishment z planu 013 poza tym, co jest konieczne dla poprawnego bootstrapu.
- Ważne nowe publiczne/architektoniczne seamy opisać JSDoc; użyć `@domain quests-progression` tam, gdzie pomaga preflight discovery.

## Automated verification

Dodać regresje obejmujące co najmniej:

1. missing infestation record + 0 rats nie spełnia authored quest completion;
2. missing infestation record + 1 rat również nie spełnia completion;
3. ordinary settlement bez infestacji nadal zachowuje semantykę `NO_RAT_INFESTATION`;
4. fresh authored home world seeduje dokładnie `SEEDED_RAT_INFESTATION` przed quest observation;
5. seeded problem daje `storageDamaged=true`, `nestDestroyed=false` i nie jest resolved;
6. samo wybicie/redukcja szczurów nie rozwiązuje problemu;
7. sama naprawa storage nie rozwiązuje problemu;
8. samo zniszczenie nest nie rozwiązuje problemu;
9. dopiero existing infestation + repaired storage + destroyed nest + `aliveRatCount <= 1` jest resolved;
10. save/load aktywnej infestacji zachowuje state i nie reseeduje;
11. save/load częściowo rozwiązanej infestacji zachowuje dokładne world facts;
12. save/load rozwiązanej infestacji nie reaktywuje problemu;
13. same-seed `WorldBundle` rebuild zachowuje active/partial/resolved state bez reseedu;
14. fresh/new-world lifecycle seeduje authored infestation ponownie dla nowego świata;
15. polling `QuestManager` przed gotowością authored infestation jest fail-closed i nie kończy questa.

Preferować testy narrow contracts i bootstrap lifecycle zamiast szerokiego integration testu wymagającego renderingu.

## Manual verification

Browser verification wykonuje User.

Po implementacji na świeżej grze sprawdzić, że „Plaga szczurów” rzeczywiście zaczyna się z uszkodzonym magazynem, istniejącym gniazdem i szczurami, a quest nie przechodzi do resolved bez wykonania wymaganych world actions.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

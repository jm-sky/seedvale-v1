# Implementation Notes: quests-progression-077 — Authored starter repair initialization and intact-state semantics

## Review finding

Plan jest trafny, ale aktualny codebase ujawnia konkretną przyczynę regresji, którą implementacja powinna naprawić bez rozszerzania zakresu:

- `SettlementStructureStateRegistry.get()` już istnieje i rozróżnia **brak stored record** od `resolve()` → pristine. Nie dodawać drugiego lookupu w registry.
- `createApp.ts:isAuthoredRepairTargetIntact` używa dziś `SettlementsManager.getStructureSnapshot()`, więc missing record staje się `condition=100` i błędnie wybiera `already_repaired`.
- ważniejsze: komentarz/implementacja w `SettlementsManager.ensureLoaded()` sugeruje, że starter damage jest seedowany dla home, ale **home nie przechodzi przez `ensureLoaded()` przy initial boot**. Home jest budowany bezpośrednio przez `createSettlement(homeDef, ...)`; seeding znajduje się tylko w `ensureLoaded(def)`. To jest realny ordering bug planu 073.

## Zalecana implementacja

### 1. Naprawić bootstrap u właściciela stanu

Wyciągnąć mały helper typu `seedHomeAuthoredRepairDamageIfNeeded(homeDef)`, który:
- używa `resolveAuthoredRepairStructureIds(homeDef.plan)`;
- seeduje wszystkie 4 targety przez istniejący `seedAuthoredRepairDamageIfNeeded()`;
- pozostaje idempotentny dzięki `structureStates.get()`.

Wywołać go **przed initial `createSettlement(homeDef, ...)`**, tak aby presentation i quest observation od początku widziały authoritative damage.

Jeżeli `ensureLoaded()` nadal może materializować home w jakimś lifecycle, nie duplikować listy czterech targetów — użyć tego samego helpera.

### 2. Dodać tylko manager-level stored-state observation

Registry ma już właściwy `get()`; brak jedynie wąskiego publicznego seamu przez `SettlementsManager`.

Preferowane API:
`getStoredStructureState(settlementId, structureId): SettlementStructureState | undefined`

To ma być read-only passthrough do `structureStates.get()`, z JSDoc jasno odróżniającym go od `getStructureSnapshot()` (`missing → pristine`).

Nie zmieniać semantyki `getStructureSnapshot()` ani `resolve()`.

### 3. Intact check

W `createApp.ts:isAuthoredRepairTargetIntact`:
- rozwiązać stable structure id tak jak obecnie;
- pobrać **stored** state;
- missing → `false`;
- istniejący state → użyć istniejącego `isStructureRepairProblem(policy, state, nowDays)`.

Nie używać reservation jako proxy dla damaged/intact. Po delivery reservation jest poprawnie `false`, choć target może nadal być uszkodzony.

## Persistence / rebuild

`structureStates` są już sparse-persisted i carry/restore przez istniejący `snapshotStructureStates()` / WorldBundle wiring. Kluczowa zasada pozostaje: seeding tylko gdy `get()` zwraca `undefined`.

To zachowuje:
- damaged + reserved po save/load/rebuild;
- repaired stored state po save/load/rebuild bez ponownego damage;
- fresh world z pustym registry → ponowny starter damage.

Nie dodawać save version ani quest flag.

## Testy o najwyższej wartości

Skupić się na regresjach, nie przepisywać całej macierzy planu:

1. initial home bootstrap: przed/na wejściu do presentation wszystkie 4 targety mają stored `AUTHORED_STARTER_DAMAGE_CONDITION` + reservation;
2. manager stored lookup: missing pozostaje `undefined`, podczas gdy zwykły `getStructureSnapshot()` nadal daje pristine;
3. quest lifecycle: missing authored state nie daje `already_repaired`; realnie repaired stored state daje;
4. persisted repaired target nie jest reseedowany przy reconstruction;
5. istniejące testy reservation/delivery/NPC repair z 073 powinny pozostać źródłem prawdy — dopisywać nowe tylko tam, gdzie obecna regresja nie jest pokryta.

## Pułapki

- Nie naprawiać problemu wyłącznie w `QuestManager`; tam nie ma ownershipu structure state.
- Nie seedować w `isAuthoredRepairTargetIntact` — observation nie może mutować świata.
- Nie uznawać `autonomousRepairReserved === false` za repaired.
- Nie używać `snapshotStructureStates()` do pojedynczego lookupu; manager powinien delegować do registry `get()`.
- Przy poprawce bootstrapu sprawdzić direct-home path osobno od streamed `ensureLoaded()`; obecny komentarz przy `ensureLoaded()` jest mylący względem faktycznego initial-home call-site.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

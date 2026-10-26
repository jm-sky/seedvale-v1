# Plan: Lost livestock report lifecycle and truthful quest journal

**Created:** 2026-09-21
**Status:** `verification needed` 🔍
**Type:** bug
**Priority:** high · **Effort:** S
**Depends on:** ~~quests-progression-030~~
**Domain:** `quests-progression`
**Subdomains:** `quests`
**Tags:** `lost-livestock` `quest-journal`

## Goal

Naprawić lifecycle questa „Zagubione zwierzę”, aby odkrycie stanu zwierzęcia w świecie nie było utożsamiane z poinformowaniem NPC.

Po znalezieniu żywego zwierzęcia / jego powrocie albo po zbadaniu zwłok gracz ma najpierw uzyskać wiedzę i zakończyć objective, a quest ma przejść do `ready_to_report`. Terminalny outcome `live_return` / `dead_confirmed` ma zostać zastosowany dopiero podczas rzeczywistej rozmowy z giverem.

Quest Journal nie może przypisywać NPC wypowiedzi, której NPC faktycznie nie wypowiedział.

## Current bug

Aktualny `QuestManager.pollLostLivestockSources()` bezpośrednio mapuje:

- `returned` → `applyOutcome(..., live_return)`,
- `corpse-inspected` → `applyOutcome(..., dead_confirmed)`.

To omija istniejący `ready_to_report` i report dialogue. `applyOutcome()` zapisuje terminalny journal result z `speakerNpcId` givera, więc automatyczny polling może utworzyć wpis wyglądający jak wypowiedź NPC bez żadnej interakcji gracza z tym NPC.

Materializowany lost-livestock quest już posiada `reportPromptLine`, `reportPlayerLine` i `reportLine`; naprawa ma wykorzystać istniejący report lifecycle zamiast tworzyć równoległy mechanizm.

Potwierdzony przypadek gameplay: gracz znalazł zwłoki owcy, zbadał je i **nie wrócił do Anny**, a quest mimo to został automatycznie rozstrzygnięty i w historii pojawiła się wypowiedź przypisana Annie. To jest bezpośrednia regresja tego kontraktu: `corpse-inspected` oznacza wiedzę/obserwację gracza i completion objective, nie rozmowę z giverem.

## Lifecycle boundaries

Implementacja ma jawnie zachować rozdział:

```text
world knowledge / observation
→ objective completion
→ ready_to_report
→ rzeczywista player ↔ NPC interaction
→ terminal outcome / complete
```

`corpse-inspected` i `returned` mogą dostarczyć wiedzę świata oraz spełnić objective bez żadnej implikacji, że giver tę wiedzę już posiada. `ready_to_report` oznacza właśnie tę granicę.

## Desired lifecycle

### Zwierzę martwe

```text
corpse-inspected
→ recover_lost_livestock objective complete
→ ready_to_report
→ rzeczywista rozmowa z giverem
→ dead_confirmed
→ complete + consequences + journal
```

Samo zbadanie zwłok nie może zastosować `dead_confirmed`, relacji, reputacji ani NPC result dialogue.

### Zwierzę żywe / returned

```text
returned
→ recover_lost_livestock objective complete
→ ready_to_report
→ rzeczywista rozmowa z giverem
→ live_return
→ complete + consequences + journal
```

Stan świata pozostaje własnością fauny. Quest tylko obserwuje snapshot i przekłada go na progress/report.

### Unavailable

`unavailable` pozostaje world-driven terminal failure, jeżeli nie istnieje sensowny report do wykonania. Automatyczne zakończenie nie może jednak fabrykować wypowiedzi givera. Journal ma przedstawiać taki wynik jako obserwację/systemowy rezultat albo nie tworzyć speaker-attributed dialogue.

## Scope

1. **`src/quests/QuestManager.ts`**
   - zmienić `pollLostLivestockSources()`, aby `returned` i `corpse-inspected` kończyły `recover_lost_livestock` objective i prowadziły do istniejącego `ready_to_report`, zamiast bezpośrednio wywoływać `applyOutcome()`;
   - zachować fauna snapshot jako źródło prawdy; nie dodawać quest-local kopii `lost/dead/returned`;
   - przy report interaction wybrać właściwy outcome na podstawie aktualnego/utrwalonego przez istniejący lifecycle rozstrzygnięcia source, bez możliwości zmiany branchu na niewłaściwy między discovery i report;
   - zachować wspólny terminal path `applyOutcome()` dla rewards/consequences/exact-once;
   - oddzielić journal event będący rzeczywistą wypowiedzią NPC od terminalnego wyniku wywołanego automatycznie przez świat. Nie przypisywać `speakerNpcId` automatycznemu resultowi tylko dlatego, że quest ma givera.

2. **`src/quests/opportunities/worldQuestMaterialization.ts`**
   - utrzymać jeden generated lost-livestock quest i istniejące outcome IDs;
   - dostosować report text/branching tylko jeśli jest to potrzebne, aby rozmowa po `returned` i po `corpse-inspected` miała prawdziwą semantykę;
   - nie przenosić ownershipu stanu zwierzęcia do questa.

3. **`src/quests/opportunities/settlementQuestOpportunities.ts`**
   - zachować `live_return`, `dead_confirmed`, `unavailable` jako stabilne outcome IDs;
   - zmieniać tylko kontrakt snapshot/outcome mapping, jeśli wymaga tego report lifecycle; bez nowego równoległego status systemu.

4. **Journal/result path**
   - przejrzeć call-sites `applyOutcome()` z automatycznego pollingu (`pollWorldDrivenSources()`, lost livestock i podobne);
   - wprowadzić najmniejszą wspólną regułę: tylko faktyczna interakcja/dialog może tworzyć journal note z NPC jako speakerem;
   - automatyczny world outcome może nadal kończyć quest, ale nie może udawać rozmowy.

5. **Tests**
   - rozszerzyć `src/quests/QuestManager.test.ts` o lifecycle i journal regression coverage.

## Architectural decisions

- Reuse `ready_to_report`; nie dodawać nowego `ready_to_tell_npc` ani osobnego FSM dla lost livestock.
- Fauna/source snapshot pozostaje authoritative dla fizycznego losu zwierzęcia.
- Quest state posiada wyłącznie lifecycle/progress potrzebny do zadania.
- `applyOutcome()` pozostaje jednym terminalnym pipeline dla konsekwencji.
- NPC dialogue jest zdarzeniem interakcji, nie prezentacją dowolnego terminalnego state transition.
- Nie naprawiać problemu przez filtrowanie fałszywego wpisu wyłącznie w `QuestLogScreen.vue`; UI ma renderować prawdziwe dane, a nie zgadywać ich semantykę.
- Dodać/uzupełnić JSDoc z `@domain quests-progression` przy ważnym zmienionym kontrakcie lifecycle/journal, jeśli poprawi to preflight discovery.

## Persistence

Preferować brak migracji save.

Istniejące terminalne questy pozostają terminalne i nie są cofane do `ready_to_report`.

Save wykonany po discovery, ale przed reportem, musi po reloadzie zachować możliwość poprawnego zaraportowania właściwego branchu bez ponownego naliczenia konsekwencji. Jeśli obecny `ready_to_report` nie zachowuje wystarczającej informacji do rozróżnienia `live_return` od `dead_confirmed`, użyć najmniejszego istniejącego mechanizmu progress/outcome intent zamiast kopiowania pełnego fauna snapshotu do questa.

## Non-goals

- przebudowa całego Quest Journal UI;
- naprawa osobnego błędu formatowania dnia/godziny;
- redesign authored `zagubiona-owca` vs generated lost-livestock;
- zmiana fauna stray/corpse lifecycle;
- nowe rewards;
- ogólna przebudowa wszystkich quest outcomes poza wspólnym zabezpieczeniem przed fałszywą wypowiedzią NPC.

## Verification

Automated:

- accept lost-livestock → `corpse-inspected` → poll: `ready_to_report`, brak `resolvedOutcomeId`, brak terminalnych consequences i brak result note przypisanego giverowi;
- zmienić istniejący regression test, który obecnie oczekuje `complete` bezpośrednio po `lostLookup('corpse-inspected')` + `pollLostLivestockSources()`; nowy kontrakt ma oczekiwać `ready_to_report` aż do faktycznego report interaction;
- następna rzeczywista rozmowa z giverem oferuje report, a jej wybór stosuje dokładnie `dead_confirmed`, kończy quest i nalicza consequences dokładnie raz;
- analogicznie `returned` → `ready_to_report` → report → `live_return`;
- save/export + restore pomiędzy discovery a reportem zachowuje właściwy branch;
- `unavailable` może zakończyć quest automatycznie, ale nie tworzy journal note wyglądającego jak wypowiedź NPC;
- ponowne polling/interakcje po terminalnym outcome nie dublują consequences ani journal result;
- istniejący world-driven external resolution nadal działa;
- Quest Log nadal renderuje journal w kolejności zapisanych zdarzeń.

Manual browser verification — wykonuje User:

1. Przyjąć „Zagubione zwierzę”.
2. Znaleźć i zbadać zwłoki.
3. Sprawdzić, że quest wskazuje powrót/raport do givera i nie jest jeszcze zakończony.
4. Sprawdzić Quest Log: brak wypowiedzi givera, której rozmowa jeszcze nie odbyła.
5. Wrócić do givera i zaraportować zwłoki.
6. Dopiero po rozmowie quest ma zostać zakończony, a właściwa wypowiedź NPC ma pojawić się w historii.

## Risks

- Jeśli branch `live_return` / `dead_confirmed` jest wybierany dopiero z live snapshotu w chwili reportu, stan świata może zmienić się między discovery a rozmową. Implementacja musi zachować semantykę tego, co gracz faktycznie odkrył, używając istniejącego lifecycle/progress contractu lub minimalnego branch intentu.
- Globalna zmiana journal result speaker semantics może wpłynąć na inne questy. Ograniczyć zmianę do jednoznacznego rozróżnienia interaction-authored speech vs automatic world resolution i pokryć oba przypadki testami.
- Nie wolno cofnąć napraw z `quests-progression-030`: generated lost-livestock nadal obserwuje realny fauna-owned incident i nie uruchamia go sam.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

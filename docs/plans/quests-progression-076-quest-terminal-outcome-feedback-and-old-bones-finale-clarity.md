# Plan: Quest terminal outcome feedback and Old Bones finale clarity

**Created:** 2026-09-21
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** M
**Depends on:** ~~quests-progression-002~~, ~~quests-progression-021~~, ~~quests-progression-051~~
**Domain:** `quests-progression`
**Subdomains:** `quests` `rewards`
**Tags:** `outcomes` `feedback` `dialogue` `quest-log`
**Roadmap:** `quests-and-reputation.md`

## Cel

Sprawić, aby terminalny wybór w queście dawał graczowi jednoznaczny finał bez tworzenia specjalnego toastu tylko dla jednego questa.

Pierwszy regresyjny przypadek to `Stare kości`: po przekazaniu sygnetu claimantowi gracz ma rozumieć, że historia się zakończyła, jaki był wynik decyzji oraz — tam, gdzie system potrafi to wiarygodnie przedstawić — jakie jawne nagrody lub konsekwencje zostały zastosowane.

Rozdzielić:

1. authored copy finału `Stare kości`,
2. wspólną prezentację terminalnego `complete` / `failed`.

## Recon — stan na main

### Stare kości

`src/quests/oldBonesAdventureCave.ts` ma trzy terminalne outcomes:

- `return_to_first_claimant`,
- `give_to_second_claimant` gdy istnieje claimant B,
- `keep_signet`.

Każda finalna `dialogueAction` używa konkretnego `physicalOutcomeId` i `requireItemInstanceId`. Nie jest to zwykły count-based item turn-in.

Composition root w `src/app/createApp.ts` obsługuje fizyczny outcome. Dla oddania sygnetu:

1. `canResolve()` sprawdza dokładną instancję `signetInstanceId`,
2. sprawdza żywego docelowego NPC i miejsce w jego `personalInventory`,
3. `onResolve()` wywołuje `giveItemInstanceToNpc()`,
4. ta sama instancja opuszcza player `Inventory` i trafia do NPC.

`keep_signet` celowo nie przenosi instancji.

Testy `src/quests/oldBonesAdventureCave.test.ts` już pokrywają exact-instance gate, outcome IDs, część reakcji dialogowych i relacji. Nie zastępować tego flow nową logiką przedmiotów.

### Terminalny lifecycle

`QuestManager.resolveStageDialogueActions()` dla `physicalOutcomeId` wykonuje istniejący wspólny flow:

```text
validate physical outcome
→ journal progress/reaction
→ effects / reaction consequences
→ physicalOutcome.onResolve(...)
→ resolveQuest(...)
→ applyOutcome(...)
```

`QuestManager.applyOutcome()` jest authoritative terminal seam:

```text
state + resolvedOutcomeId
→ result journal
→ cleanup
→ effects
→ reward grant
→ consequences
→ complete sound
```

Nie tworzyć drugiego ownera completion ani per-quest terminal pipeline.

Problem prezentacyjny: po `resolveQuest()` stage dialogue nadal zwraca do live dialogue wybraną `npcLine` / reaction line. `QuestOutcome.resultText` jest dostępny jako wynik systemowy, ale nie zastępuje automatycznie wypowiedzi NPC.

To rozdzielenie jest poprawne: naturalna wypowiedź NPC i systemowe podsumowanie outcome są różnymi rzeczami.

### Istniejący presentation contract

`QuestManager.list()` już wystawia przez `QuestListEntry`:

- `state`,
- `resolvedOutcomeId`,
- `resultText`,
- `promisedReward`,
- `notes`.

`resultPresentation()` bierze `resolveResultText`, następnie `resultText`, a dla legacy complete fallbackuje do `reportLine`.

`QuestLogScreen.vue` obecnie nie renderuje `selectedEntry.resultText`. Terminalne questy trafiają przez `questLogBuckets.ts` do `Historia`, więc wynik istnieje w DTO, ale znika w details UI.

`promisedReward` jest celowo tylko preview dla nieterminalnego questa i staje się `null` po resolution. Nie używać go do rekonstruowania wypłaconej nagrody po fakcie.

`applyOutcome()` odtwarza istniejący completion sound, ale nie ma wspólnego tekstowego terminal feedbacku. Sam dźwięk nie komunikuje outcome, nagrody ani konsekwencji.

## Zakres

### 1. Dopracować authored finały `Stare kości`

W `src/quests/oldBonesAdventureCave.ts` poprawić finalne `npcLine` / reaction copy dla A, B i keep tak, aby każda odpowiedź brzmiała jak zamknięcie rozmowy i była zgodna z faktycznym outcome.

Szczególnie wariant B nie może kończyć się semantycznie na „dobrze, że mnie wysłuchałeś”. Powinien potwierdzać przyjęcie sygnetu i domknięcie sporu z perspektywy mówiącego, bez dopisywania nowych faktów rodu.

Zachować istniejące relation-gated reactions z planu `quests-progression-052`; zmienić copy, nie gating ani consequences.

`resultText` każdego outcome ma pozostać krótkim, systemowym opisem faktycznego wyniku, odrębnym od NPC speech.

### 2. Pokazać terminalny wynik we wspólnym Quest Log

Rozszerzyć istniejące Details w `src/ui-vue/screens/QuestLogScreen.vue` o sekcję wyniku dla terminalnych wpisów, używając wyłącznie `QuestListEntry.resultText`.

Vue nie może lookupować `QuestDef`, interpretować outcome IDs ani odtwarzać konsekwencji.

Dla `complete` / `failed` / `abandoned`, jeśli `resultText` istnieje, details powinny jednoznacznie pokazywać stan oraz tekst wyniku. `invalidated` pozostaje bez zmyślonego result text, jeśli domena go nie dostarcza.

Nie zmieniać bucketów `Bieżące / Oferty / Historia`.

### 3. Wspólny natychmiastowy terminal feedback

Dodać jeden presentation seam dla nowo zastosowanego terminalnego outcome, zamiast specjalnego przypadku `Stare kości`.

Feedback ma być uruchamiany tylko wtedy, gdy `applyOutcome()` faktycznie zastosował nowy `complete` lub `failed` outcome. Musi używać presentation DTO/eventu przygotowanego przez quest domain, nie pozwalać UI interpretować `QuestDef`.

Minimalny payload powinien pozwalać UI pokazać:

- tytuł questa,
- terminalny stan,
- resolved `resultText`,
- faktycznie przyznaną jawną nagrodę, jeśli outcome ma `reward.visibility === 'shown'`.

Nie rekonstruować relacji/reputation przez diff globalnego stanu w Vue.

Jeżeli obecny wspólny HUD/notification surface ma już właściwy mechanizm krótkich gameplay notifications, podłączyć do niego terminal quest presentation. Jeżeli nie ma odpowiedniego surface, dodać najmniejszy wspólny quest-resolution surface w warstwie UI, nadal z jednym quest-domain eventem i bez logiki per quest.

Completion sound pozostaje istniejącym niezależnym audio feedbackiem.

### 4. Konsekwencje społeczne

Nie ujawniać automatycznie wszystkich surowych delt typu `trust +1`, `benevolence +2`, `relation -2` tylko dlatego, że są w `QuestConsequences`.

W tym planie:

- `resultText` opisuje narracyjny wynik,
- shown reward może być pokazana liczbowo,
- relacje/reputation pozostają stosowane przez istniejący `applyConsequences()`,
- ich osobna prezentacja jest poza zakresem, chyba że recon podczas implementacji znajdzie już istniejący wspólny, player-facing consequence DTO dokładnie do tego celu.

Nie tworzyć nowego parallel consequence log tylko dla terminalnego popupu.

## Ownership i integracja

Zachować ownership:

```text
QuestDef / QuestOutcome
        ↓
QuestManager.applyOutcome()
        ├─ authoritative state/reward/consequences
        ├─ journal
        └─ terminal presentation event/DTO
                    ↓
             existing UI store/surface
```

Quest Log nadal pobiera stan z `QuestManager.list()`.

Nie przenosić quest logic do Vue i nie importować UI do `QuestManager`. Wpięcie prezentacji ma korzystać z injected lifecycle/presentation hook analogicznie do istniejących integration seams.

Jeśli dodawany jest publiczny lub architektonicznie ważny hook/DTO, dodać zwięzły JSDoc z `@domain quests-progression`.

## Relevant files

Primary:

```text
src/quests/oldBonesAdventureCave.ts
src/quests/oldBonesAdventureCave.test.ts
src/quests/QuestManager.ts
src/quests/QuestManager.test.ts
src/ui-vue/screens/QuestLogScreen.vue
src/ui-vue/lib/questLogBuckets.ts
src/ui-vue/store.ts
src/app/createApp.ts
```

Podczas implementation recon znaleźć istniejący shared notification/HUD surface i jego testy; nie zakładać nazwy pliku bez sprawdzenia aktualnego kodu.

Contracts:

```text
src/quests/quests.ts
src/ui/createQuestLog.ts
```

Related completed work:

```text
quests-progression-002  outcomes/rewards/consequences
ui-input-021            Quest Log details/journal
quests-progression-051  authored narrative polish
quests-progression-052  socially consequential dialogue
```

## Testy

### Quest mechanics — regresja Stare kości

Dla każdego A / B / keep potwierdzić:

1. właściwy `resolvedOutcomeId`,
2. `state === complete`,
3. exact signet instance:
   - A/B: znika z player inventory i trafia do właściwego NPC,
   - keep: pozostaje u gracza,
4. rewards/effects/consequences są stosowane dokładnie raz,
5. ponowne/stale callback nie duplikuje outcome ani konsekwencji.

Dla B jawnie pokryć relacje obu claimantów i social consequence przez istniejący injected test seam.

### Dialogue

- finalne A/B/keep reply assertions aktualizować do nowego copy;
- relation-gated reactions nadal wybierają ten sam wariant semantyczny;
- dialog nie udaje systemowego reward/result summary.

### Shared terminal feedback

Testy `QuestManager` / integration:

- `complete` emituje presentation dokładnie raz po skutecznym `applyOutcome`,
- `failed` analogicznie,
- stale/drugi resolve nie emituje ponownie,
- restore terminalnego questa nie emituje nowego feedbacku,
- payload ma właściwy title/state/resultText,
- tylko `shown` reward trafia do presentation; hidden reward nie jest ujawniana,
- brak `resultText` korzysta z istniejącej semantyki `resultPresentation()`, bez surowego outcome ID.

### Quest Log

- terminalne details renderują `resultText`,
- aktywny quest nie pokazuje terminal result,
- Historia/buckety pozostają bez zmian,
- brak `resultText` nie zostawia pustego nagłówka/sekcji.

## Non-goals

- zmiana outcome IDs lub quest stages,
- zmiana ekonomii/reward values,
- zmiana relation/reputation math,
- nowy history/reputation ledger,
- specjalny toast tylko dla `Stare kości`,
- automatyczne ujawnianie hidden rewards,
- przebudowa całego dialogue UI,
- zmiana fizycznego transferu item instance,
- browser verification przez AI.

## Weryfikacja

Automatycznie:

1. focused tests dla `oldBonesAdventureCave`, `QuestManager` i zmienionego UI/presentation surface,
2. `validateQuestDefinitions()`,
3. TypeScript/lint/build zgodnie z aktualnym repo workflow,
4. istniejące quest tests bez osłabiania behavioral assertions.

Manualnie przez użytkownika:

1. zakończyć `Stare kości` przez A, B i keep,
2. sprawdzić, że końcowa wypowiedź brzmi terminalnie,
3. sprawdzić natychmiastowy wspólny feedback outcome,
4. otworzyć `Historia → Stare kości` i sprawdzić trwały `resultText`,
5. potwierdzić fizyczne położenie sygnetu dla każdego wyboru.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

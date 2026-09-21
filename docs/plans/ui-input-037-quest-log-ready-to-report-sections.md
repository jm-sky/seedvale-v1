# Plan: Quest log ready-to-report sections

**Created:** 2026-09-21
**Status:** `planned` 📋
**Type:** polish
**Model:** Sonnet, Composer
**Priority:** medium · **Effort:** S
**Depends on:** ~~ui-input-017~~
**Domain:** `ui-input`
**Subdomains:** `menus` `feedback`
**Roadmap:** `quests-and-reputation.md`

## Goal

Sprawić, aby gracz od razu widział zadania, których bieżący etap jest wykonany i które można zgłosić NPC, bez dodawania nowego stanu questów ani równoległego modelu UI.

## Current state

`QuestManager.list()` już wystawia autorytatywny `QuestListEntry.state`. `projectQuestLog()` w `src/ui-vue/lib/questLogBuckets.ts` łączy `ready_to_report` i `active` w bucket `current`, przy czym `ready_to_report` jest już sortowane przed `active`. `QuestLogScreen.vue` pokazuje label `do zgłoszenia` i lekko wyróżnia taki wiersz.

Problem jest prezentacyjny: przy większej liczbie bieżących questów stan gotowy do zgłoszenia nadal łatwo przeoczyć.

## Scope

### Bieżące: dwie pionowe sekcje

Zachować istniejące zakładki `Bieżące / Oferty / Historia`. W zakładce `Bieżące` renderować **dwie sekcje jedna pod drugą**, w tej kolejności:

1. **Do oddania (N)** — wyłącznie wpisy `ready_to_report`.
2. **Aktywne (N)** — wyłącznie wpisy `active`.

`Do oddania` zawsze znajduje się nad `Aktywne`. Nie dodawać osobnej zakładki ani filtra wymagającego przełączania widoku. Pustej sekcji nie trzeba renderować; jeśli obie są puste, zachować komunikat o braku zadań.

### Czytelność wpisu gotowego do zgłoszenia

Wpis `ready_to_report` ma być rozpoznawalny bez czytania całej karty:

- zachować lub wzmocnić istniejące wizualne wyróżnienie;
- dodać jednoznaczny tekst/badge `DO ODDANIA`;
- pokazać `Wróć do: <giverName>`;
- nie opierać znaczenia wyłącznie na kolorze.

Dla zwykłych `active` zachować bieżący objective/stage presentation.

## Architecture

Źródło prawdy pozostaje bez zmian:

`QuestManager.list() -> QuestListEntry.state -> projectQuestLog() -> QuestLogScreen.vue`.

Rozdzielenie `current` na `ready_to_report` i `active` jest wyłącznie projekcją prezentacyjną. Preferować rozszerzenie `src/ui-vue/lib/questLogBuckets.ts` zamiast filtrowania tych samych wpisów ad hoc w kilku miejscach Vue.

Nie dodawać:

- nowego `QuestState`;
- persisted kategorii UI;
- heurystyk po quest ID, objective lub prerequisites;
- dodatkowego lookupu NPC, jeśli wystarcza istniejące `giverName`;
- zmian w `QuestManager`, jeśli aktualne DTO dostarcza potrzebne dane.

Jeśli powstanie nowy istotny/publiczny helper projekcji, dodać krótki JSDoc (z `@domain ui-input` tam, gdzie pomaga preflightowi).

## Relevant files

- `src/ui-vue/screens/QuestLogScreen.vue`
- `src/ui-vue/lib/questLogBuckets.ts`
- `src/quests/QuestManager.ts`
- `src/quests/quests.ts`

## Tests

Rozszerzyć testy projekcji Quest Log tak, aby potwierdzić:

- `ready_to_report` trafia do sekcji `Do oddania`;
- `active` trafia do sekcji `Aktywne`;
- wpis nie pojawia się w obu sekcjach;
- kolejność sekcji nie zależy od kolejności wejściowych entries;
- `offered`, historia i ukryte `not_offered` zachowują dotychczasową semantykę;
- count zakładki `Bieżące` nadal oznacza sumę obu sekcji.

## Manual verification

User sprawdza w przeglądarce:

1. kilka `active` + jeden `ready_to_report`: `Do oddania` jest nad `Aktywne`;
2. kilka `ready_to_report`: wszystkie są razem i mają czytelne `Wróć do`;
3. brak `ready_to_report`: nie ma pustej sekcji `Do oddania`;
4. przejście `active -> ready_to_report` przenosi wpis między sekcjami;
5. po zgłoszeniu quest znika z `Do oddania` zgodnie z nowym stanem;
6. `Oferty` i `Historia` działają jak wcześniej.

## Out of scope

- HUD quest tracker i map markers;
- zmiana quest lifecycle lub warunków `ready_to_report`;
- persistence;
- redesign całego Quest Log;
- sortowanie według odległości od NPC;
- automatyczne zgłaszanie lub kończenie questów.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

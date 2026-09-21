# Plan: Quest dialogue offer / active context separation

**Created:** 2026-09-21
**Status:** `planned` 📋
**Priority:** high · **Effort:** S
**Depends on:** ~~ui-input-024~~, ~~quests-progression-034~~
**Domain:** `ui-input`
**Type:** `fix`
**Subdomains:** `menus` `interaction` `feedback`
**Tags:** `npc-dialogue` `quests` `quest-lifecycle`
**Model:** Sonnet, Composer
**Roadmap:** -

## Goal

Rozdzielić questowe ścieżki w dialogu NPC zgodnie z ich znaczeniem:

- `Może w czymś ci pomóc?` pokazuje wyłącznie **nowe oferty questów**,
- `Aktywne zadania` pokazuje wyłącznie **questy już przyjęte / wymagające dalszej interakcji**,
- report/hand-in oraz required talk/action pozostają dostępne jako priorytetowe shortcuty na root, ale są także osiągalne przez `Aktywne zadania`,
- rezygnacja typu `Przykro mi, jednak nie dam rady ci pomóc.` pozostaje wewnątrz konkretnego aktywnego questa,
- nie tworzyć drugiego quest state, drugiego dialogue-tree engine ani kopii lifecycle logic w Vue.

Docelowa semantyka:

```text
Może w czymś ci pomóc?
  -> offer

Aktywne zadania
  -> active
  -> required-action
  -> report
  -> quest-scoped progress / choices / abandon
```

## Current behaviour

Plan `ui-input-024` dodał poprawny read-only presentation contract:

- `QuestDialoguePreviewKind = 'report' | 'required-action' | 'active' | 'offer'`,
- `QuestManager.previewNpcDialogue(npcId)`,
- root shortcuts dla `report` i `required-action`,
- `Aktywne sprawy` oparte o preview `kind === 'active'`,
- live `QuestDialoguePreviewEntry.resolve()`.

Jednocześnie `src/ui-vue/store.ts::openNpcDialogueMenu()` nadal wiąże:

```ts
state.resolveQuestHelp = () => questManager.onInteract(npc.id)
```

a `NpcDialogueMenu.vue` wywołuje tę ścieżkę po wybraniu:

```text
Może w czymś ci pomóc?
```

`QuestManager.onInteract(npcId)`:

1. uruchamia `admitOffersForGiver(npcId)`,
2. zbiera `resolveNpcQuestContribution()` dla wszystkich definicji,
3. agreguje jednocześnie:
   - oferty,
   - aktywne przypomnienia,
   - report/hand-in,
   - required talk/action,
   - quest-scoped abandon.

W efekcie prezentacyjne rozdzielenie menu nie jest pełnym rozdzieleniem questowych contextów: ścieżka `help` może nadal zawierać aktywne questy.

Dodatkowo `Aktywne sprawy` filtruje obecnie wyłącznie `kind === 'active'`, więc `report` i `required-action` są dostępne jako root shortcuts, ale nie należą do tej sekcji mimo że są lifecycle'owo aktywnymi zadaniami gracza.

## Target UX

### `Może w czymś ci pomóc?`

Ta pozycja służy wyłącznie odkrywaniu / przyjmowaniu nowych questów od NPC.

Powinna prezentować:

- `not_offered` questy aktualnie wybrane przez istniejącą offer admission / exposure policy,
- już `offered` questy, które nadal można przyjąć,
- wiele ofert jako existing topic picker z tytułami questów.

Nie może prezentować:

- aktywnych reminderów,
- generic abandon,
- report/hand-in,
- required talk/action,
- aktywnych questów od tego samego givera,
- aktywnych questów innego givera, dla których NPC jest targetem.

Samo otwarcie NPC menu nadal nie może admitować ofert. Admission może nastąpić dopiero po świadomym kliknięciu `Może w czymś ci pomóc?`.

### `Aktywne zadania`

Zmienić label z `Aktywne sprawy` na:

```text
Aktywne zadania
```

Sekcja obejmuje quest contexts klasyfikowane przez istniejącą presentation layer jako:

- `active`,
- `required-action`,
- `report`.

Każdy wpis prowadzi do konkretnego live quest contextu przez istniejący `QuestDialoguePreviewEntry.resolve()`.

Dla aktywnego questa givera może to prowadzić do:

- reminder/progress line,
- authored dialogue actions,
- generic abandon, jeżeli polityka questa na to pozwala.

Dla foreign quest target może to prowadzić do:

- `talk_to_npc`,
- `talk_to_npc_choice`,
- innych wymaganych działań.

### Root shortcuts

Zachować obecne priorytetowe shortcuty:

- `✓ <quest title>` dla `report`,
- `? <quest title>` dla `required-action`.

Nie usuwać ich tylko dlatego, że te same questy są dostępne przez `Aktywne zadania`.

Root shortcut jest szybkim wejściem do "actionable now"; `Aktywne zadania` jest pełnym quest-context entry pointem.

### Back navigation

Zachować maksymalnie jeden dodatkowy poziom kategorii.

Wymagane zachowanie:

```text
Sprawy i pomoc
  -> Może w czymś ci pomóc?
      -> oferta
      -> Wróć -> oferta picker / Sprawy i pomoc

  -> Aktywne zadania
      -> quest
      -> Wróć -> Aktywne zadania
      -> Wróć -> Sprawy i pomoc
```

Nie tworzyć rekurencyjnego routera dialogowego.

## Architecture

### QuestManager remains authoritative

`QuestManager` pozostaje właścicielem:

- lifecycle,
- offer admission,
- availability,
- giver capacity,
- classification,
- quest contribution resolution,
- topic-scoped abandon.

Vue nie może interpretować:

- `QuestState`,
- `stageIndex`,
- objective types,
- giver ids,
- offer policy.

### Reuse `previewNpcDialogue()`

Nie dodawać drugiego classification systemu.

Istniejące:

```ts
previewNpcDialogue(npcId)
  -> QuestDialoguePreviewEntry[]
  -> kind: report | required-action | active | offer
```

jest źródłem semantycznego podziału UI.

### Add scoped dialogue resolution

Obecne `onInteract(npcId)` pozostaje istniejącym ogólnym quest interaction API dla call-site'ów, które naprawdę potrzebują pełnej agregacji.

Dla dialogowego menu dodać minimalny scoped entry point w `QuestManager`, semantycznie np.:

```ts
resolveNpcDialogueContexts(
  npcId: NpcId,
  scope: 'offers' | 'active',
): QuestDialogOverride | null
```

Nazwy mogą zostać dopasowane do codebase, ale kontrakt ma być jeden i explicit.

#### Scope `offers`

- świadome wejście gracza może uruchomić `admitOffersForGiver(npcId)`,
- po admission resolver agreguje wyłącznie contexty klasyfikowane jako `offer`,
- przy wielu ofertach reuse `QuestDialogTopic` + live `resolve()`,
- nie wolno przepuszczać active/report/required-action.

#### Scope `active`

Preferowane rozwiązanie UI nadal korzysta z `previewNpcDialogue()` i per-entry live `resolve()`, bo wpisy są już rozdzielone i zatytułowane.

Jeżeli wspólny scoped resolver uprości istniejący back/picker flow, może obsługiwać również `active`, ale nie jest wymagane tworzenie agregatora tylko po to, by zastąpić działający preview picker.

### Shared aggregation helper

Jeżeli obecne `onInteract()` zawiera logikę agregacji, której potrzebuje offer-only path, wydzielić minimalny helper przyjmujący już wybrane quest contexts.

Np. semantycznie:

```ts
aggregateNpcQuestContexts(contexts)
```

Helper może współdzielić:

- immediate actions,
- topic-scoped actions,
- topic generation,
- deterministic ordering.

Nie kopiować tej logiki do osobnej metody offer-only.

### Offer admission boundary

To jest najważniejszy guardrail:

- `previewNpcDialogue()` pozostaje read-only,
- samo `openNpcDialogueMenu()` pozostaje read-only względem offer admission,
- kliknięcie `Może w czymś ci pomóc?` jest świadomą interakcją i może admitować oferty,
- `Aktywne zadania` nie może admitować nowych ofert.

## Relevant files

Primary:

- `src/quests/QuestManager.ts`
  - `QuestDialoguePreviewKind`,
  - `QuestDialoguePreviewEntry`,
  - `resolveNpcQuestContribution()`,
  - `onInteract()`,
  - `previewNpcDialogue()`,
  - `classifyNpcDialoguePreview()`,
  - `admitOffersForGiver()`,
  - existing topic aggregation.
- `src/ui-vue/store.ts`
  - `NpcDialogueMenuState`,
  - `openNpcDialogueMenu()`,
  - `resolveNpcDialogueHelp()`,
  - `getNpcDialogueQuestPreview()`,
  - `applyNpcDialogueQuestOverride()`.
- `src/ui-vue/NpcDialogueMenu.vue`
  - `questPreview`,
  - `activeMatters`,
  - `selectTopic('help')`,
  - `selectActiveMatter()`,
  - `helpBack()`,
  - `activeMattersOrigin`,
  - labels and navigation.

Tests:

- `src/quests/QuestManager.test.ts`,
- `src/ui-vue/npcDialogueOpen.test.ts`,
- lightweight existing Vue/presentation tests only if already suitable.

Related plans:

- `ui-input-024-npc-dialogue-grouping-and-quest-priority.md`,
- `quests-progression-034-quest-giver-cap-markers-dialogue-and-target-lifecycle.md`,
- existing multi-context dialogue work from quests-progression-020.

## Implementation stages

1. Extract/reuse the minimum context aggregation helper from `onInteract()` if needed so scoped offer resolution and the existing general path do not duplicate topic/action arbitration.
2. Add a deliberate offer-only QuestManager entry point:
   - perform existing giver offer admission,
   - collect only offer contexts,
   - preserve deterministic existing offer order,
   - preserve live `QuestDialogTopic.resolve()`.
3. Add QuestManager tests proving offer-only resolution never contains active/report/required-action contexts.
4. Wire `state.resolveQuestHelp` in `openNpcDialogueMenu()` to the new offer-only resolver instead of generic `onInteract()`.
5. Rename `Aktywne sprawy` → `Aktywne zadania`.
6. Change active quest picker source from only `kind === 'active'` to:
   - `active`,
   - `required-action`,
   - `report`.
7. Preserve root report / required-action shortcuts.
8. Verify navigation origin/back behaviour for:
   - offers,
   - active reminder,
   - report,
   - required talk,
   - multi-quest picker.
9. Add focused store/UI regression tests without introducing a new UI test framework.

## Verification

Automated:

1. NPC with one new offer and one active abandonable quest:
   - offer resolver returns only the offer,
   - active quest is absent from offer topics/actions.
2. Same NPC:
   - `previewNpcDialogue()` exposes active quest as `active`,
   - active picker resolves it and exposes its topic-scoped abandon action.
3. NPC with simultaneous `report` + new offer:
   - offer path shows only new offer,
   - report remains root shortcut,
   - report also appears under `Aktywne zadania`.
4. NPC required by another giver's `talk_to_npc` plus own new offer:
   - help/offer path shows own offer only,
   - `Aktywne zadania` includes the foreign quest required-action.
5. Opening NPC dialogue alone does not transition `not_offered -> offered`.
6. Opening `Aktywne zadania` does not transition `not_offered -> offered`.
7. Clicking `Może w czymś ci pomóc?` may perform the existing offer admission.
8. Multiple offers still use titled quest topics and deterministic ordering.
9. Multiple active quests remain individually reachable.
10. Abandon remains scoped to the selected active quest and never appears in the offer branch.
11. Existing `onInteract()` behaviour for non-menu consumers remains covered and unchanged unless explicitly migrated.

Manual browser verification — User:

1. NPC ma nową ofertę + aktywny quest:
   - `Może w czymś ci pomóc?` pokazuje tylko nową ofertę.
2. `Aktywne zadania` pokazuje aktywny quest i po wejściu można zobaczyć m.in. `Przykro mi, jednak nie dam rady ci pomóc.`.
3. Quest gotowy do oddania:
   - `✓ <quest>` jest na root,
   - ten sam quest jest też pod `Aktywne zadania`.
4. Quest wymagający rozmowy:
   - `? <quest>` jest na root,
   - ten sam quest jest też pod `Aktywne zadania`.
5. NPC ma kilka nowych ofert:
   - wszystkie są rozróżnialne tytułem,
   - żadna aktywna sprawa nie przecieka do tego pickera.
6. Sprawdź `Wróć`:
   - oferta → picker/grupa,
   - aktywny quest → `Aktywne zadania` → `Sprawy i pomoc`.
7. Zamknięcie menu bez wejścia w `Może w czymś ci pomóc?` nie powinno wystawić nowej oferty.

## Non-goals

- redesign quest lifecycle,
- nowy quest state,
- nowy dialogue tree engine,
- zmiana giver capacity,
- zmiana offer ranking/exposure policy,
- zmiana markerów questowych,
- zmiana authored quest textów,
- zmiana Quest Logu,
- persistence stanu nawigacji dialogu,
- usuwanie root shortcuts dla actionable questów,
- ogólny refactor `QuestManager`,
- LLM-generated dialogue.

## Guardrails

- `QuestManager` pozostaje ownerem quest semantics.
- Vue renderuje semantic presentation contract; nie interpretuje lifecycle.
- Reuse `QuestDialoguePreviewEntry`, `QuestDialogOverride`, `QuestDialogTopic`, `resolveNpcQuestContribution()` i topic-scoped abandon.
- Nie wywoływać generic `onInteract()` z offer-only UI path po implementacji tego planu.
- Nie mutować ofert podczas read-only preview ani podczas samego otwarcia NPC menu.
- Nie duplikować context aggregation.
- Nie usuwać istniejącego generic `onInteract()` bez sprawdzenia wszystkich call-site'ów.
- Zachować deterministic ordering z quest layer.
- Dla nowego publicznego scoped resolvera dodać krótki JSDoc z `@domain quests-progression`; dla istotnego reusable UI helpera użyć `@domain ui-input`.
- Browser/manual verification wykonuje User, nie AI agent.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

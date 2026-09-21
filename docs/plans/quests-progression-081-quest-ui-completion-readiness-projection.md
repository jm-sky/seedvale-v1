# Plan: Quest/UI — Completion Readiness Projection

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** fix
**Priority:** high · **Effort:** S
**Depends on:** ~~quests-progression-075~~, ~~ui-input-037~~
**Domain:** `quests-progression`
**Subdomains:** `quests`
**Tags:** `quest-ui` `journal` `ready-to-report` `dialogue`

## Cel

Ujednolicić znaczenie „Do oddania” między Quest Logiem, markerem NPC i rzeczywistymi akcjami dialogowymi, bez dodawania nowego persisted `QuestState`.

## Problem

`QuestManager` ma już szerszą semantykę „giver ma akcję ukończenia teraz” niż samo `state === 'ready_to_report'`.

W szczególności `hasGiverCompletionActionNow()` uwzględnia:
- `ready_to_report`,
- aktywny `gather_item`, gdy wymagane przedmioty są już w ekwipunku,
- authored repair zakończony wcześniej przez gracza (`alreadyRepairedGatherAction()`).

Marker/dialog może więc poprawnie pokazać możliwość zakończenia zadania, podczas gdy `projectQuestLog()` nadal klasyfikuje taki quest do „Aktywne”, ponieważ patrzy wyłącznie na `QuestListEntry.state`.

## Kierunek

Rozszerzyć questowy read-model o derived, niepersistowaną informację opisującą bieżącą możliwość zakończenia/reportu u givera.

Preferowany ownership:

```
QuestManager live state + inventory/world predicates
→ QuestManager.list() derived completion readiness
→ questLogBuckets
→ QuestLogScreen
```

Vue nie może odtwarzać reguł gather hand-in, authored repair ani report branching.

## Istniejące mechanizmy do reuse

- `QuestManager.hasGiverCompletionActionNow()`
- `QuestManager.gatherHandInSlot()`
- `QuestManager.alreadyRepairedGatherAction()`
- `QuestManager.list()` / `QuestListEntry`
- `projectQuestLog()`
- istniejąca sekcja „Do oddania” z `ui-input-037`

## Zakres draft

Po reconie doprecyzować:
- nazwę i kontrakt derived pola w `QuestListEntry`,
- czy „Do oddania” ma obejmować wszystkie realne giver-completion actions, czy tylko report/hand-in,
- jak zachować `state` jako lifecycle authority, a readiness jako read-model,
- testy synchronizacji marker ↔ dialog ↔ Quest Log po zmianie inventory/world state.

## Guardrails

- Nie dodawać nowego `QuestState`.
- Nie persistować presentation readiness.
- Nie duplikować reguł questów w Vue.
- Nie specjalizować po quest id.
- Execution nadal musi rewalidować live state przy wyborze akcji.
- Dodać JSDoc do istotnego publicznego read-model/seam, jeśli pomaga preflightowi (`@domain quests-progression`).

## Verification

AI agent: focused unit tests dla projection/readiness, gather hand-in i early-repair cases; typecheck. Użytkownik: manualnie sprawdza przenoszenie wpisu między „Aktywne” i „Do oddania” oraz zgodność z markerem/dialogiem.

## Recon do wykonania przed przejściem na planned

Zweryfikować wszystkie call-site’y `hasGiverCompletionActionNow()`, `labelMarker()`, `list()` i `projectQuestLog()` oraz ustalić minimalny kontrakt DTO bez rozszerzania lifecycle state machine.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

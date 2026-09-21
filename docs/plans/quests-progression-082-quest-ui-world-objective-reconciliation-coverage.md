# Plan: Quest/UI — World Objective Reconciliation Coverage

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** fix
**Priority:** high · **Effort:** M
**Depends on:** ~~quests-progression-078~~, ~~quests-progression-080~~
**Domain:** `quests-progression`
**Subdomains:** `quests`
**Tags:** `quest-ui` `quest-lifecycle` `world-state` `reconciliation`

## Cel

Domknąć wspólną ścieżkę catch-up dla queryable world-state objectives, tak aby stage entry, restore i normalne mutacje świata prowadziły do tej samej semantyki questa.

## Problem

`quests-progression-080` wprowadził `reconcileActiveWorldObjectives()` i stage-entry reconciliation dla objectives, których prawdę można odczytać z authoritative world/inventory state.

Nie wszystkie takie objectives są jednak objęte wspólnym mechanizmem. `resolve_storage_rat_infestation` nadal korzysta z osobnych ścieżek:
- `pollSettlementRatInfestationObjectives()`,
- `maybeAdvanceResolvedStorageRatInfestation()` podczas dialogu.

Po restore lub wejściu w stage świat może więc już spełniać objective, ale quest pozostaje `active` do czasu kolejnego domain eventu albo rozmowy z giverem.

To samo należy sprawdzić dla innych queryable objectives, zwłaszcza `light_settlement_fires`, aby nie utrwalać wzorca „każdy objective pamięta własny catch-up lifecycle”.

## Kierunek

Rozdzielić jasno trzy klasy objective/source semantics:

1. **queryable world-state objectives** — mogą być bezpiecznie reconciled z authoritative snapshot;
2. **event/action objectives** — wymagają rzeczywistego działania i nie wolno ich retroaktywnie zaliczać;
3. **world-driven source lifecycle** — availability/invalidation/external resolution problemu, niezależne od objective completion.

Rozszerzyć istniejący `reconcileActiveWorldObjectives()` / `isWorldObjectiveSatisfied()` zamiast tworzyć kolejny poller.

## Istniejące mechanizmy do reuse

- `QuestManager.reconcileActiveWorldObjectives()`
- `QuestManager.isWorldObjectiveSatisfied()`
- `QuestManager.completeObjectiveSlot()`
- `QuestManager.advanceStage()`
- `QuestManager.pollSettlementRatInfestationObjectives()`
- `QuestManager.recheckSettlementLightObjectives()`
- `isSettlementRatInfestationResolved()`
- `SettlementRatInfestationSnapshot.exists` — brak rekordu pozostaje unresolved zgodnie z `quests-progression-078`

## Zakres draft

Po reconie ustalić:
- pełną listę objectives, które są naprawdę queryable i deterministyczne,
- które obecne pollery są ingress notification, a które duplikują reconciliation,
- restore/new-stage ordering,
- zachowanie unavailable/absent semantics per domain,
- czy istniejące publiczne notify/poll methods pozostają jako trigger wspólnego reconciliation czy mogą zostać uproszczone.

## Guardrails

- World state pozostaje authority; nie dodawać quest-local kopii rat/storage/light state.
- Nie retroaktywnie zaliczać `talk_to_npc`, choice, explicit interaction ani innych action-driven objectives.
- Nie mieszać objective completion z generated source availability/external resolution.
- Brak infestation record nie może oznaczać completion.
- Nie robić szerokiego refactoru całego `QuestManager`; najmniejsza wspólna ścieżka.
- Ważne publiczne helpers/seams udokumentować JSDoc, jeśli pomaga preflightowi (`@domain quests-progression`).

## Verification

AI agent: restore + stage-entry tests dla już-spełnionych objectives, rat absent/resolved regressions, lights unavailable/resolved regressions, brak auto-completion dla action objectives; typecheck. Użytkownik: manualnie sprawdza journal/marker po load oraz po wejściu w stage.

## Recon do wykonania przed przejściem na planned

Zmapować wszystkie `QuestObjective` typy względem `isWorldObjectiveSatisfied()`, obecnych poll/notify methods i source lookups; sklasyfikować każdy jako queryable, event/action albo source lifecycle.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

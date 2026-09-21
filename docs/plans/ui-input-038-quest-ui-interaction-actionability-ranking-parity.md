# Plan: Quest/UI — Interaction Actionability Ranking Parity

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** fix
**Priority:** high · **Effort:** S
**Depends on:** ~~ui-input-015~~, ~~ui-input-028~~, ~~ui-input-029~~
**Domain:** `ui-input`
**Subdomains:** `interaction` `input`
**Tags:** `quest-ui` `targeting` `actionability` `gaze`

## Cel

Sprawić, aby candidate ranking i właściwy interaction prompt używały tej samej live definicji „actionable”, bez tworzenia drugiego eligibility systemu.

## Problem

`gameLoop.ts` przekazuje do `rankInGaze()`:

```ts
isActionable: isInteractableActionable
```

`isInteractableActionable()` buduje jednak `InteractionView` bez pełnego live `InteractionViewContext`.

Właściwy prompt chwilę później korzysta z callbacków takich jak:
- `describeWellWork`,
- `describeWellRoofRepair`,
- `describePalisadeWork`,
- `describeStandingTorchWork`,
- `describePlayerTroughWork`,
- `describeResidentialWork`,
- consequence/targeted-skill context.

Dla części targetów brak callbacka ma permissive fallback, więc ranking może uznać target za actionable, a finalny prompt pokazać akcję disabled.

## Kierunek

Zbudować jeden live read-only `InteractionViewContext` (lub minimalny odpowiednik potrzebny do eligibility) i używać go zarówno dla:
- gaze ranking actionability,
- final interaction presentation.

Preferować closure nad istniejącym `buildInteractionView()`, zamiast nowego `canInteract(target)` z równoległymi regułami.

Execution pozostaje w istniejących handlerach i nadal rewaliduje live state.

## Istniejące mechanizmy do reuse

- `buildInteractionView()`
- `isInteractableActionable()`
- `InteractionViewContext`
- `rankInGaze()` / `pickInGaze()`
- `interactableStableKey()`
- istniejący final prompt context w `gameLoop.ts`

## Zakres draft

Po reconie doprecyzować:
- które pola `InteractionViewContext` realnie wpływają na ranking eligibility,
- czy targeted-skill override powinien wpływać na normalny gaze ranking czy pozostać osobną warstwą,
- czy consequence tone jest wyłącznie presentation i nie powinien wpływać na actionable,
- sposób uniknięcia podwójnego kosztownego domain query w jednym frame.

## Guardrails

- Nie zmieniać kolejności centeredness/distance/stable-key poza poprawą actionability truth.
- Nie dodawać drugiego action registry.
- Nie przenosić domain mutation do interaction layer.
- Nie utrwalać target state między frame’ami.
- Zachować `ui-input-028` stable target lifecycle i rebuild invalidation.
- Unikać wielokrotnego wykonywania kosztownych describe/query callbacks per candidate; jeśli trzeba, derived view można policzyć raz i reuse w obrębie frame.
- Dodać JSDoc do ważnego publicznego helpera/seam, jeśli pomaga preflightowi (`@domain ui-input`).

## Out of scope

Stable identity grup dropped items nie jest częścią tego planu. Ten temat podpada pod istniejący kontrakt `ui-input-028` i powinien być rozpatrzony jako ewentualne domknięcie tamtego lifecycle, nie przez równoległy targeting system.

## Verification

AI agent: focused tests, gdzie target jest rankingowo disabled/enabled zgodnie z tym samym live contextem co prompt; regressions dla well/construction/torch; typecheck. Użytkownik: crowded interaction spot — ranking nie preferuje obiektu, którego widoczna primary/alternate action jest faktycznie zablokowana.

## Recon do wykonania przed przejściem na planned

Prześledzić tworzenie finalnego `InteractionViewContext` w `gameLoop.ts`, wszystkie callbacki `describe*` oraz koszt ich wywołania; ustalić najmniejszą wspólną projection seam.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

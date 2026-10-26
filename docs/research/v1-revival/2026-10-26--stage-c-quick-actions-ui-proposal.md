# Stage C — Quick Actions UI proposal (`QuickActionsScreen`)

**Created at:** 2026-10-26  
**Created by:** Cursor (Composer)  
**Updated at:** 2026-10-26  
**Updated by:** Cursor (Composer)  
**Status:** **IMPLEMENTED — visual PASS** (author 2026-10-26). Accepted earlier same day (D5 = MenuPanel-like V3 look; reposition OK). Plan: `ui-input-041-stage-c-quick-actions-v3-reskin`. Live reskin + D9 demo `quick-actions-demo.html`; recent actions, category header, muted readable disabled chrome (author rejected literal `opacity-5` on QA chips — label vanished) accepted.

**Target:** `jm-sky/seedvale-v1` (`legacy/seedvale`)  
**Design donor:** V3 `menu/MenuPanel.vue` chrome + warm Stage A/B tokens only — **no** donor Quick Actions component; do not copy CraftPanel / InteractPrompt / ItemsShell / ConversationPanel.

## Podsumowanie dla autora (PL)

Stage C przeprojektowuje **tylko wygląd** Quick Actions (12 kategorii → lista akcji) na look **jak V3 MenuPanel** (ciepłe tokeny scoped), z **dozwolonym repositioningiem** do wycentrowanego overlay. Katalog, eligibility, handlery, Q/Esc/pointer-lock i Pause→Akcje bez zmian. Niedostępne akcje: native `disabled` + wyciszony czytelny chrome + powód obok (w Ostatnie: tooltip zamiast subtitla). Demo D9 na tych samych leafach.

**Zaakceptowane 2026-10-26** (autor): D5 = look V3/MenuPanel; reposition OK; Stage A/B visual PASS; Stage C visual PASS (w tym recent, header, disabled chrome).

---

## Reading route and pins

- [UI migration research / decision register](./2026-10-26--ui-migration-research.md)  
- [Draft Stage C](./2026-10-26--ui-migration-draft-stages.md#4-stage-c--quick-actions-visual-migration-without-a-donor-menu)  
- Stage A/B: proposals + `ui-input-039` / `ui-input-040` (visual PASS accepted 2026-10-26)

**Author decisions (do not re-ask):** D0/D1/D2/D3/D4/D6/D9; **D5 Stage C** = MenuPanel-like V3 look + warm scoped tokens; reposition allowed.

## 1. Layout (D5 + reposition)

```
[open] dimmed backdrop (pointerdown.self → close; Esc/Q unchanged)
┌─ Szybkie działania ✕ ───────────────────┐  centered MenuPanel card
│ [Budowa] [Ogień] … (visible cats)       │  root chips
│ or drill-in: [← Wróć] + LABEL           │
│ [action][cost]                          │
│ [disabled] opacity-5 + reason adjacent  │
└─────────────────────────────────────────┘
FAB Skills / weapons / Zap: remain usable; light warm restyle OK.
```

Two-level navigation unchanged: root categories → drill-in actions + Wróć. Category reset on close preserved.

## 2. Categories and boundary (unchanged wiring)

Twelve category ids: `budowa`, `ogien`, `lopata`, `teren`, `pulapki`, `sadzenie`, `wedkarstwo`, `czekaj`, `skrzynia`, `odpoczynek`, `przetrwanie`, `zlecenia`. Visibility/eligibility from existing producers. Fire catalog via `playerQuickActions.visibleFireActions` + `missing` → reason text. No second registry/dispatcher/recipe source.

**Owned presentation files:** `QuickActionsScreen.vue`, `QuickActionsButton.vue`, `QuickActionsGroup.vue`, `QuickActionsGroupLabel.vue`, scoped `.sv-quick-actions` in `tailwind.css`.

**Read-only:** `playerQuickActions.ts` (export reason formatter only if needed), `ui.quickActions`, `createQuickActions.ts`, `createApp` open/close/availability, Pause-menu Actions handlers.

## 3. Unavailability (D4 adapted for QA chips)

- Native `disabled` + no dispatch.
- Author visual PASS rejected literal `opacity-5` on QA chips (label/border vanished; reason stayed). Disabled chrome = dashed border + muted readable label/cost.
- Adjacent readable reason outside the control in category drill-in (fire: `missing`; other flags/costs). Root **Ostatnie** uses compact chips + `title` tooltip (no subtitle — avoided uneven wrap gaps).
- Do not hide V1 actions because there is no donor component.

## 4. D9 demo

Standalone Vite entry `quick-actions-demo.html` + `src/ui-vue/demos/quick-actions/`: shared Button/Group leaves; fixtures for root chips, one populated category, one disabled+reason; labeled demo-local callbacks; no world/save/WorldBundle.

## 5. Acceptance / verification

Per draft-stages §4: all twelve categories reachable under same eligibility; open does not execute; single execution with real resource/busy checks; Esc/Q/pointer-lock; placement/cancel/rest/hire/contract; Pause Actions shared handlers. Focused type-check/lint + existing fire/availability tests. Author screenshots for Stage C visual PASS.

## 6. Out of scope

New catalog entries, crafting overhaul, dialogue, character/HUD/trade/map, inventory beyond token reuse, Stage A/B re-litigation, schema/save, global reskin.

## 7. Closure

**Accepted for implementation** 2026-10-26 by the author. Active plan: `ui-input-041-stage-c-quick-actions-v3-reskin`.

# Plan: Stage C — Quick Actions V3 MenuPanel reskin

**Created:** 2026-10-26
**Status:** `done` ✅
**Implemented at:** 2026-10-26
**Closed:** 2026-10-26 — author visual PASS (centered MenuPanel QA; recent; category header; muted disabled chrome, not opacity-5)
**Type:** polish
**Priority:** high · **Effort:** M
**Depends on:** ~~ui-input-039~~ ~~ui-input-040~~
**Domain:** `ui-input`
**Subdomains:** `quick-actions` `presentation`
**Tags:** `v1-revival` `stage-c` `quick-actions` `d5` `d4` `d9`

## Cel

Przeprojektować wygląd Quick Actions na look **jak V3 MenuPanel** (ciepłe scoped tokeny), z wycentrowanym overlay (reposition dozwolony), przy zachowaniu V1 katalogu/eligibility/handlerów, Q/Esc/pointer-lock oraz Pause→Akcje. Unavailable: `disabled` + muted readable chrome + adjacent reason (Ostatnie: tooltip). Demo D9 na tych samych leafach.

## Autorytet

- Zaakceptowana propozycja: [2026-10-26--stage-c-quick-actions-ui-proposal.md](../research/v1-revival/2026-10-26--stage-c-quick-actions-ui-proposal.md) (ACCEPTED 2026-10-26; D5=MenuPanel-like; reposition OK).
- Kontrakt: [draft-stages §4](../research/v1-revival/2026-10-26--ui-migration-draft-stages.md#4-stage-c--quick-actions-visual-migration-without-a-donor-menu).
- Decyzje: D0/D4/D5(Stage C)/D6/D9.

## Zakres

- `QuickActionsScreen.vue` — MenuPanel chrome, backdrop, centered card, `.sv-quick-actions`.
- Reskin `QuickActionsButton` / `Group` / `GroupLabel`; additive `reason?` for D4.
- Scoped `.sv-quick-actions` warm tokens in `tailwind.css` (mirror A/B; no global reskin).
- Export/format fire `missing` reasons for adjacent labels (presentation only).
- Standalone demo Vite entry (root + populated + disabled fixtures).

## Poza zakresem

New catalog entries, crafting overhaul, dialogue, character/HUD/trade/map, inventory beyond token reuse, registry/dispatcher/recipe changes, schema/save, global reskin.

## Guardrails

- Twelve categories; never hide V1 actions for missing donor component.
- Unavailable: `disabled` + muted readable chrome + adjacent reason (not literal opacity-5 on chips); no dispatch when disabled.
- D6: Q/Esc/pointer-lock/category nav unchanged; Pause Actions shares handlers.
- Do not import CraftPanel / InteractPrompt / ItemsShell / ConversationPanel.
- Important public helpers keep JSDoc with `@domain ui` when added for preflight.

## Verification

- `pnpm type-check`; focused lint; existing playerQuickActions/availability tests; `pnpm build` if entry/styles.
- Browser (autor): missing-material fire + no dispatch; real fire consume; placement/cancel; Q under pointer lock; Esc; Pause Actions; narrow scroll; screenshots — visual PASS only after author verdict.
- Demo: no world bootstrap; shared leaves; no save writes.

## Rollback

Revert Stage C presentation commit; catalog/handlers/save intact.

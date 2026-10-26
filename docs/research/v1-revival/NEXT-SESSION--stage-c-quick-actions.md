# Sesja: Stage C — Quick Actions visual migration (D5 mockup first)

Kontynuacja V1 revival UI po Stage B (`ui-input-040`). Stage A/B live + demo wylądowały; **visual PASS A/B nadal wymaga screenshotów autora** — nie twierdź PASS bez werdyktu.

## Wejście (kolejność)
1. `legacy/seedvale/docs/research/v1-revival/2026-10-26--ui-migration-draft-stages.md` §4 (Stage C)
2. Skrót decyzji: `2026-10-26--ui-migration-research.md` §5 — D0/D1/D2/D3/D4/D5(A+B)/D9 ustalone; **D5 dla Quick Actions otwarte** (brak donor QA component)
3. Stage B proposal (status): `2026-10-26--stage-b-inventory-list-equipment-ui-proposal.md` + plan `ui-input-040`
4. V1 sources: `QuickActionsScreen.vue`, `QuickActionsButton/Group/GroupLabel`, `playerQuickActions.ts`, `ui.quickActions`, `createQuickActions.ts` — preserve wiring
5. Donor look only: `menu/MenuPanel.vue` + item section spacing/tokens — **nie** CraftPanel / InteractPrompt / ItemsShell / ConversationPanel

Cel: `jm-sky/seedvale-v1` (`legacy/seedvale`). V1 catalog/availability/handlers = authoritative. Reuse Stage A/B warm tokens where they fit; nie psuj inventory.

## Zasady
- DRAFT ≠ zatwierdzenie. Milczenie ≠ zgoda. **Najpierw konsultacja D5** z konkretnym mockupem kategorii/akcji (jak Stage A zrobiło D5, Stage B D2) — bez implementacji UI Stage C do jawnej akceptacji.
- Nie migruj V3 dialogue. Nie zmieniaj registry/dispatcher/recipe sources. Zachowaj 12 kategorii, eligibility, placement/cancel/rest/hire/contract, Q/Esc/pointer-lock, Pause-menu Actions sharing.
- D4: `disabled` + dokładnie `opacity-5` + powód; nie ukrywaj V1 actions bo brak donor component.
- D6: V1 keys/navigation bez zmian.

## Zadanie tej sesji
1. **Najpierw zapytaj autora o D5** (look/layout Quick Actions): konkretny ASCII/mockup kategorii + akcji; czy look MenuPanel-like / inventory tokens / inny; czy repositioning dozwolony. Zbierz w jednej turze. Potwierdź też czy Stage A/B visual PASS już jest.
2. Jeśli autor odrzuca / zmienia: tylko dokument propozycji Stage C (DRAFT), bez kodu.
3. Jeśli autor zatwierdza:
   - Oznacz propozycję ACCEPTED (data + kto).
   - Utwórz plan V1 `ui-input-041-stage-c-…` (preflight wg CLAUDE.md / plan index).
   - Dopiero potem implementuj wg draft-stages §4 (focused checks; visual PASS tylko po screenshotach autora).
4. Handoff ≤15 linii; nie ruszaj character tab / HUD / trade / map / global reskin / inventory poza reuse tokenów.

## Out of scope
New action catalog entries, crafting overhaul, dialogue, Stage A/B re-litigation, schema/save.

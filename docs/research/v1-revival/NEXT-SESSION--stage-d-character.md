# Sesja: Stage D — Character / skills visual migration (D3 layout + D5 mockup first)

Kontynuacja V1 revival UI po Stage C (`ui-input-041`, visual PASS). Stage A/B/C live + demos wylądowały z author visual PASS.

## Wejście (kolejność)
1. `legacy/seedvale/docs/research/v1-revival/2026-10-26--ui-migration-draft-stages.md` §5 (Character/skills — later slice, not pre-approved)
2. Skrót decyzji: `2026-10-26--ui-migration-research.md` §5 — D0/D1/D2/D3(mechanics)/D4/D5(A+B+C)/D9 ustalone; **D3 character tab layout** i **D5 Character** otwarte; D7/D8 open for other screens
3. Stage C closure: `2026-10-26--stage-c-quick-actions-ui-proposal.md` + plan `ui-input-041` (done / visual PASS)
4. V1 sources: Character screen / skills (U), SPEA/base/effective/XP/conditions/reputation/badges — preserve wiring and actionable skill controls
5. Donor look only: V3 character tabs/sections presentation — adapt to V1 data; no body-wound heatmap unless separately approved

Cel: `jm-sky/seedvale-v1` (`legacy/seedvale`). V1 character/skills semantics = authoritative. Reuse Stage A/B/C warm tokens where they fit.

## Zasady
- DRAFT ≠ zatwierdzenie. Milczenie ≠ zgoda. **Najpierw konsultacja D3 layout + D5** z konkretnym mockupem (jak Stage A/B/C) — bez implementacji UI do jawnej akceptacji.
- Nie migruj V3 dialogue (D0). Nie zmieniaj skill formulas / SPEA math / save schema.
- D4: unavailable stay rendered; for dense chips prefer muted readable chrome if opacity-5 makes labels unreadable (Stage C precedent) — confirm with author.
- D6: V1 keys/navigation (U etc.) bez zmian.

## Zadanie tej sesji
1. **Najpierw zapytaj autora** o D3 character layout + D5 look (ASCII/mockup; tabs/sections; which V1 fields stay; injury viz?). Potwierdź kolejność vs HUD/trade jeśli chce inną ścieżkę.
2. Jeśli odrzuca / zmienia: tylko dokument propozycji Stage D (DRAFT), bez kodu.
3. Jeśli zatwierdza: ACCEPTED → plan `ui-input-042-stage-d-…` → implement per draft §5 + D9 demo; visual PASS tylko po screenshotach autora.
4. Handoff ≤15 linii; nie ruszaj HUD / trade / map / Quick Actions / inventory poza reuse tokenów.

## Out of scope
Dialogue port, new attributes, layered armor mechanics, schema/save, Stage A/B/C re-litigation.

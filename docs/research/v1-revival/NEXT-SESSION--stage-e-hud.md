# Sesja: Stage E — HUD visual migration (D5/D7 consultation first)

Kontynuacja V1 revival UI po Stage D (`ui-input-042`, visual PASS). Stage A/B/C/D live + demos wylądowały z author visual PASS.

## Wejście (kolejność)
1. `legacy/seedvale/docs/research/v1-revival/2026-10-26--ui-migration-draft-stages.md` §5 (HUD — later slice, not pre-approved)
2. Skrót decyzji: `2026-10-26--ui-migration-research.md` §5 — D0/D1/D2/D3/D4/D5(A–D)/D6/D9 ustalone; **D5 HUD** i **D7 compass/placement** otwarte; D8 open for scheduling
3. Stage D closure: `2026-10-26--stage-d-character-skills-ui-proposal.md` + plan `ui-input-042` (done / visual PASS)
4. V1 sources: HUD clock/weather/needs, toast, mounted/leading/primary/aim, E/R/V/hold/release/cycle — preserve wiring and controls
5. Donor look only: V3 HUD / ClockWeather / NeedsReadout / CompassStrip / ToastStack presentation — adapt to V1 producers; one-use donor prompt cannot replace V1 controls

Cel: `jm-sky/seedvale-v1` (`legacy/seedvale`). V1 HUD semantics = authoritative. Reuse Stage A–D warm tokens where they fit.

## Zasady
- DRAFT ≠ zatwierdzenie. Milczenie ≠ zgoda. **Najpierw konsultacja D5 HUD look + D7 placement/compass** z konkretnym mockupem (jak Stage A–D) — bez implementacji UI do jawnej akceptacji.
- Nie migruj V3 dialogue (D0). Nie zmieniaj climate/needs producers / save schema.
- D4: unavailable stay rendered; dense chips prefer muted readable chrome if opacity-5 unreadable (Stage C/D precedent) — confirm with author.
- D6: V1 keys/navigation (E/R/V etc.) bez zmian.
- Jeśli autor woli **Trade** zamiast HUD: przełącz scope na draft §5 Trade (basket/transaction visuals; V1 `onSettleTransaction` owner) — ten sam proces konsultacji D5.

## Zadanie tej sesji
1. **Najpierw zapytaj autora** o D5 HUD look + D7 (placement/compass?); ASCII/mockup; które V1 HUD elementy zostają. Potwierdź kolejność vs trade jeśli chce inną ścieżkę.
2. Jeśli odrzuca / zmienia: tylko dokument propozycji Stage E (DRAFT), bez kodu.
3. Jeśli zatwierdza: ACCEPTED → plan `ui-input-043-stage-e-…` → implement per draft §5 + D9 demo; visual PASS tylko po screenshotach autora.
4. Handoff ≤15 linii; nie ruszaj Character / inventory / Quick Actions / trade poza reuse tokenów (chyba że Stage E = Trade).

## Out of scope
Dialogue port, Character/inventory/QA re-litigation, schema/save, new climate math, wholesale map/menu (D7 blocks those separately).

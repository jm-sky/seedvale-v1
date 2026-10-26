# Plan: Stage D — Character / skills V3 reskin

**Created:** 2026-10-26  
**Status:** `done` ✅  
**Implemented at:** 2026-10-26  
**Closed:** 2026-10-26 — author visual PASS (V3 Character layout on V1 data; placeholders; 660px shell; skills scroll; inline XP)  
**Type:** polish  
**Priority:** high · **Effort:** M  
**Depends on:** ~~ui-input-039~~ ~~ui-input-040~~ ~~ui-input-041~~  
**Domain:** `ui-input`  
**Subdomains:** `character` `skills` `presentation`  
**Tags:** `v1-revival` `stage-d` `character` `skills` `d5` `d4` `d9`

## Cel

Przeprojektować wygląd Postać **[C]** (3 taby: Stan+pancerz, Atrybuty i umiejętności, Reputacja) i Umiejętności **[U]** (actionable cards) na look jak V3 Character + warm scoped tokeny A/B/C, bez BodyDiagram, bez zmiany SPEA/skill math / save / kluczy. Demo D9 na tych samych leafach.

## Autorytet

- Zaakceptowana propozycja: [2026-10-26--stage-d-character-skills-ui-proposal.md](../research/v1-revival/2026-10-26--stage-d-character-skills-ui-proposal.md) (ACCEPTED 2026-10-26).
- Kontrakt: [draft-stages §5](../research/v1-revival/2026-10-26--ui-migration-draft-stages.md#5-later-slices-and-release-gates).
- Decyzje: D0/D3(mechanics+layout)/D4/D5(Stage D)/D6/D9.

## Zakres

- `CharacterScreen.vue` + presentation leaf — local tabs; Pancerz under Stan; warm `.sv-character`.
- `SkillsScreen.vue` + actionable cards leaf — warm `.sv-skills`; preserve sneak/targeted handlers.
- Style-only: `CharacterSection`, `CharacterModifierBadge`, `CharacterSettlementSelect` as needed.
- Scoped tokens in `tailwind.css` (mirror A/B/C; no global reskin).
- Standalone demo Vite entry + fixtures.

## Poza zakresem

Dialogue, HUD/trade/map/menu, QA/inventory beyond token reuse, BodyDiagram, layered armor, new attributes, schema/save, formulas, A/B/C re-litigation.

## Guardrails

- V1 SPEA / eight skills / XP / five rep dims / six armor slots stay authoritative.
- No Reka / donor Tabs / second overlay owner; `useOverlayScreen` only.
- D6: C/U/Esc unchanged.
- D4: muted readable chrome for dense disabled chips.
- No BodyDiagram / fake CHA/INT / wound heatmap.

## Verification

- `pnpm type-check`; focused lint; `pnpm build` if entry/styles.
- Browser (autor): C/U open/close; sneak + targeted Use; settlement; critical bars; screenshots — visual PASS only after author verdict.
- Demo: no world bootstrap; shared leaves; no save writes.

## Rollback

Revert Stage D presentation commit; handlers/presentation builders/save intact.

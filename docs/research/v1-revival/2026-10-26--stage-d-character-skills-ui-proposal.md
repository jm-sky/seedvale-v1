# Stage D — Character / skills UI proposal (`CharacterScreen` + `SkillsScreen`)

**Created at:** 2026-10-26  
**Created by:** Cursor (Composer)  
**Updated at:** 2026-10-26  
**Updated by:** Cursor (Composer)  
**Status:** **IMPLEMENTED — visual PASS** (author 2026-10-26). D3/D5 accepted earlier same day; V3-fidelity layout + V3-only attr/skill placeholders (opacity-50), fixed 660px shell, slim skills scroll, inline `value | XP`. Plan: `ui-input-042-stage-d-character-skills-v3-reskin`.

**Target:** `jm-sky/seedvale-v1` (`legacy/seedvale`)  
**Design donor:** V3 `game/ui/character/*` tabs/sections chrome only — adapt to V1 SPEA/skills/XP/reputation; **no** BodyDiagram / dialogue / donor attribute model.

## Podsumowanie dla autora (PL)

Stage D przeprojektowuje **wygląd** ekranów Postać **[C]** i Umiejętności **[U]** na look jak V3 Character (taby + sekcje + warm tokeny A/B/C), przy zachowaniu V1 danych i handlerów. **[C]** = trzy taby (Stan+pancerz, Atrybuty i umiejętności, Reputacja). **[U]** osobno = actionable sneak + targeted. Bez heatmapy ran, bez zmiany SPEA/skill math / save. Demo D9 na tych samych leafach.

**Zaakceptowane 2026-10-26** (autor): D3 = C 3 taby + U osobno; D5 = V3 Character chrome + warm tokens; Pancerz w Stan; BodyDiagram out; D4 muted readable chrome; Character przed HUD/trade. **Visual PASS** tego samego dnia (placeholders CHA/INT + V3-only skills; wysokość 660px; skills scroll; XP inline).

---

## Reading route and pins

- [UI migration research / decision register](./2026-10-26--ui-migration-research.md)  
- [Draft later slices §5](./2026-10-26--ui-migration-draft-stages.md#5-later-slices-and-release-gates)  
- Stage A/B/C: proposals + `ui-input-039` / `040` / `041` (visual PASS)

**Author decisions (do not re-ask):** D0/D1/D2/D3(mechanics)/D4/D6/D9; **D3 Character layout** = three tabs on C + separate U; **D5 Stage D** = V3 Character-like + warm scoped tokens; BodyDiagram out.

## 1. Layout (D3 + D5)

```
[C] Postać ✕  (.sv-character warm tokens)
┌─ [Stan] [Atrybuty i um.] [Reputacja] ─┐
│ Stan: needs bars + conditions          │
│       + Pancerz (efekty + 6 slotów)    │
│ Attr: SPEA effective/base + badges     │
│       8 skills value% + XP (read-only) │
│ Rep: settlement · 5 dims · badges      │
└────────────────────────────────────────┘

[U] Umiejętności ✕  (.sv-skills)
┌─ karty: Skradanie (toggle)             │
│  Pułapki / Medycyna / Naprawa (Użyj)   │
│  level bar · opis · Doświadczenie: xp  │
└────────────────────────────────────────┘
```

Local tab strip only (`role=tab`) — no Reka / donor Tabs / second overlay owner. `useOverlayScreen` remains sole stack owner. C/U/Esc unchanged (D6).

## 2. Boundary (unchanged wiring)

**Owned presentation:** `CharacterScreen.vue`, `SkillsScreen.vue`, presentation leaves (`CharacterPanel` / `SkillsActionCards` or equivalent), `CharacterSection`, `CharacterModifierBadge`, `CharacterSettlementSelect` (style), scoped `.sv-character` / `.sv-skills` in `tailwind.css`.

**Read-only:** `characterPresentation.ts`, `PlayerSkills.ts`, `store` character/skills, `createApp` open/refresh/configure*, `Keyboard` C/U, `targetedSkillAction`, reputation/badges producers.

## 3. Unavailability (D4 adapted)

- Native `disabled` + no dispatch where controls exist.
- Dense chips: muted readable chrome (Stage C precedent), not literal `opacity-5`.
- Missing data: stable labeled empty / `—` placeholders; never fabricate SPEA/CHA/INT or wound heatmap.

## 4. D9 demo

Standalone Vite entry `character-skills-demo.html` + `src/ui-vue/demos/character-skills/`: shared presentation leaves; fixtures for Stan (critical + conditions), SPEA+modifiers, 8 skills+XP, reputation/badges, skills actionable (sneak on/off, targeted selected); labeled demo-local callbacks; no world/save/WorldBundle.

## 5. Acceptance / verification

Per draft §5: preserve SPEA/base/effective/XP/conditions/reputation/badges and U actionable controls; test stealth/targeted execution. Focused type-check/lint + `pnpm build` if entries/styles. Author screenshots of three C tabs + U for visual PASS.

## 6. Out of scope

Dialogue, HUD/trade/map/menu, Quick Actions/inventory beyond token reuse, BodyDiagram, layered armor, new attributes, schema/save, skill formulas, A/B/C re-litigation.

## 7. Closure

**Accepted for implementation** 2026-10-26 by the author. **Visual PASS** 2026-10-26. Plan: `ui-input-042-stage-d-character-skills-v3-reskin` (closed).

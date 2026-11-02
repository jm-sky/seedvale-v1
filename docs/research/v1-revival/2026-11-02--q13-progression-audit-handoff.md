# Q13 — Progression subdomain: focused audit handoff

**Date:** 2026-11-02  
**Scope:** `quests-progression` / `progression`, batch 1 only  
**Status:** read-only audit findings for Opus integration; **not** implementation authorization  
**Owner of Q13 integration:** Claude Opus

## Authority and reuse

Read together with [Q13 working author decisions](./2026-10-30--q13-author-decisions-working.md), [approved 25 Vision decisions](./2026-10-29--vision-alignment-v1-v3.md), [Strategic Brief](./STRATEGIC-BRIEF.md), [queue Q13](./AUTONOMOUS-SESSION-QUEUE.md), and [plan index](../../plans/README.md). Reuse the already-approved 2026-10-30 decision: skill learning through practice, teachers and books; no global character EXP/levels; per-skill internal XP may remain but **must not appear in UI**. No skill-internals rewrite is authorized.

## Audited plans

| Plan | Document status | Finding |
|---|---|---|
| [`quests-progression-001`](../../plans/archive/quests-progression-001-reputation-and-renown-foundation.md) | `verification needed` (archived) | Compatible with Vision #13: per-settlement reputation/renown separate from personal relationships and skill progression. Runtime `ReputationManager` and unit tests found. Manual verification not asserted. |
| [`quests-progression-059`](../../plans/archive/quests-progression-059-settlement-known-deeds-and-reputation-badges.md) | `verification needed` (archived) | Compatible in principle with Vision #01/#13: local known-deed history and optional social consequences, not universal EXP. Plan/code semantic gap in how community knowledge is established; see author decision below. |
| [`quests-progression-066`](../../plans/quests-progression-066-elder-knowledge-and-teaching.md) | `draft` | Direction compatible with Vision #13/#15: NPC teaching through existing `PlayerSkills`, no `ElderXP` or parallel progression; no LLM gameplay. Draft does not authorize implementation. |

Adjacent dependency inspected: [`quests-progression-002`](../../plans/archive/quests-progression-002-quest-outcomes-rewards-and-consequences.md) explicitly removes global quest EXP, without replacing skill XP. Current `QuestManagerInitial` contains `progress` and `relations`, not global EXP. Adjacent plan [`ui-input-042`](../../plans/ui-input-042-stage-d-character-skills-v3-reskin.md) recorded earlier author acceptance of inline XP; the later 2026-10-30 Q13 author decision supersedes that aspect.

**Deferred, not audited comprehensively:** `quests-progression-047`, `048` and the remaining progression-tagged plan inventory. Do not infer approval of other plans.

## Findings and minimal suggested corrections

### F1 — High: raw skill XP appears in player UI (confirmed code conflict)

**Authority:** Vision #13 + 2026-10-30 Q13 working author decision.

- `src/ui-vue/components/SkillsActionCards.vue` renders `XP {{ card.xp }}`.
- `src/ui-vue/components/CharacterPanel.vue` renders `XP ${Math.round(r.xp)}` (or `XP —`).
- `src/ui-vue/screens/SkillsScreen.vue`, `src/ui-vue/store.ts`, and `src/player/characterPresentation.ts` pass along underlying XP values.
- `src/player/PlayerSkills.ts` explicitly has eight independent skills and a per-skill XP curve, without global character levels. `src/player/PlayerSkills.test.ts` covers the skill curve/award path.
- `src/items/books.ts::readBook()` raises skill through `raiseSkillToValue()`, with `src/items/books.test.ts` covering learned/known/too-low outcomes.

**Propose:** hide XP numbers in **both** screens while preserving skill values and existing bars. Keep underlying per-skill XP, calculations, persistence and public mutation paths unchanged. Check the affected UI tests/fixtures when eventually authorized. This is a proposed correction, **not** an approved code change.

**Dependencies:** `ui-input-042`, `PlayerSkills`, `CharacterPanel.vue`, `SkillsActionCards.vue`, skill UI projections.

### F2 — Medium: locally known deeds without explicit social-exposure evidence (plan/code gap; not proven Vision conflict)

**Authority:** Vision #01/#13 and `quests-progression-059` §§2/5.

- Plan `059` specifies socially-known acts rather than magic observation.
- `src/app/actions/survivalActions.ts` emits `onPlayerAnimalCorpseBuried` after a successful burial.
- `src/app/createApp.ts` resolves containing settlement by coordinates and calls `badges.recordAnimalCorpseBuried(settlementId)`; no witness/news gate is present in this path.
- `src/badges/badges.ts` and `src/badges/badges.test.ts` verify threshold/one-shot behavior, but do not prove the action was socially observed.
- Other badge producers have narrower validation: successful settlement-affiliated treatment; grave disturbance only after social exposure.

**Explicit author decision (2026-11-02): option C — defer.** Preserve current runtime behavior. Do **not** add witness or knowledge-propagation mechanics now. Record the plan/code semantics as an **open product/design question** for later Q13 integration; do not label it a confirmed Vision violation and do not auto-create implementation tasks.

### F3 — No verified conflict: NPC teaching proposal

`quests-progression-066` proposes books/teachers using existing authoritative skill APIs, bounded/idempotent learning, real NPC eligibility and relationship gates. `PlayerSkills.ts` and `books.ts` confirm reusable mutation paths, but **NPC teaching itself was not verified as implemented**.

**Propose:** when Opus reconciles the draft, clarify that its `bounded XP` is internal, skill-specific, non-UI XP. Validate concrete teacher capability and skill catalog before any separately approved implementation; do not create a new progression subsystem.

## Verification and limits

Static GitHub connector inspection of plans, implementation notes, source and selected unit tests only. **No test execution, browser verification or performance measurement.** `verification needed` status is not treated as proof that manual verification passed. Current code overrides older implementation notes where they differ.

## Handoff for Opus

1. Add F1 to Q13 as a **confirmed, high-priority presentation mismatch** with an already decided direction; propose a minimal UI-only correction after separate authorization.
2. Carry F2 as **author-deferred (option C)**, retaining current known-deed behavior; do not broaden this into a witness-system workstream.
3. Carry F3 as aligned draft intent, **not approved scope**.
4. Continue later with a separate small batch (`047`/`048` or other clearly progression-scoped plans), avoiding general quests/rewards expansion without agreement.

**No plan, queue, source or tests were changed as part of this audit.** This document is a handoff, not a modification of Q13's task status.

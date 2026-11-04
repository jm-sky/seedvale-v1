# Side initiative — Items Stage 4 × Combat & Armor (coordination index)

**Created:** 2026-11-04 · **Owner:** Claude Opus 5.5 (architecture) · **Executor:** GPT-6 Sol (author decision, 2026-11-04)
**Status:** author decisions approved; Wave 1 startable; dependency, asset and Opus gates remain
**Relation to the Revival roadmap:** independent side initiative running **in parallel**. It does not change the Master Roadmap phase order, the [Autonomous Session Queue](./AUTONOMOUS-SESSION-QUEUE.md) priorities or the geography work. Its tasks are tracked **here**, not as queue rows; only its open author questions are mirrored in queue §3. Revival rules still apply (determinism, ownership, save/epoch discipline, performance measurement, no FPS claims).

## 1. Read first

1. [Review 032 — architecture reconciliation](../../reviews/2026-11-04--032--items-stage-4-and-combat-armor-architecture-review.md): critical findings F1–F11 and binding resolutions. **Where it disagrees with an older document, review 032 wins.**
2. The plan + implementation notes you are executing (§3).
3. Design references (read the cited sections only): [Stage 4 A1–A10](./2026-10-28--equipment-stage-4-approved-author-decisions.md) (binding product decisions), [Stage 4 proposal](./2026-10-27--equipment-stage-4-implementation-proposal.md) (P-stages, issuance design, policy evolution), [87-row integration matrix](./2026-10-27--equipment-stage-4-integration-matrix.md) (per-item identity/tier/source class), [Combat & Armor proposal](./2026-11-04--combat-armor-redesign-proposal.md) (formulas, tables, S-stages).

## 2. Authorization (2026-11-04)

- **Stage 4 runtime work within A1–A10:** authorized as the bounded slices of items-player-062/063/064. The old D4 freeze is closed (Strategic Brief, 2026-10-30) and no longer gates it.
- **Combat runtime:** authorized within the approved plans. Q-IC1–Q-IC4 were approved by the author on 2026-11-04; remaining dependency/review gates still apply.
- **items-player-044 mechanics** (approved by A6) and **ui-input-045** (approved layout) are authorized; 044 visuals wait for assets (Q-IC4).
- Not authorized anywhere: shields/parry/offhand (A7), human-target combat, armor durability, per-limb wounds, wholesale donor activation, new economy architecture, deferred items (falchion, composite_bow, arrow_blunt).

## 3. Plans

| Plan | Scope | Gate | Status |
| --- | --- | --- | --- |
| [items-player-044](../../plans/items-player-044-shoulder-and-forearm-equipment-slots.md) ([notes](../../plans/implementation-notes/items-player-044-shoulder-and-forearm-equipment-slots-implementation-notes.md)) | **044-M:** `arms`→`shoulders` + `forearms`, v-next save migration, leather/steel bracers (scalar interim), labels, stock. **044-V:** bracer visuals | M: approved Q-IC4 · V: valid skinned GLBs | 044-M complete (2026-11-04); 044-V awaits assets |
| [ui-input-045](../../plans/ui-input-045-equipment-body-layout.md) | Unlayered anatomical equipment grid, real shoulders/forearms cells | after 044-M | implemented, technically verified; browser checks pending (2026-11-04) |
| [items-player-062](../../plans/items-player-062-stage-4-weapon-ammunition-and-shield-intake.md) ([notes](../../plans/implementation-notes/items-player-062-stage-4-weapon-ammunition-and-shield-intake-implementation-notes.md)) | Stage 4 P0/P1/P2/P3/P6/P8: policy evolution, 17 melee + 2 bows, 3 ammo, 3 inventory-only shields, deferred tracking | 065 S1 complete | W0–W5 complete (implemented, technically verified; browser checks pending); review 033 R1–R3 resolved, F2 family prices approved; twenty-five-kind no-source guard green |
| [items-player-063](../../plans/items-player-063-upper-tier-singleton-issuance-ledger.md) ([notes](../../plans/implementation-notes/items-player-063-upper-tier-singleton-issuance-ledger-implementation-notes.md)) | Stage 4 P7a: world issuance ledger for the 14 A8 identities | none (Opus review before any source uses it) | implemented and technically verified (2026-11-04); no source enabled; R-A still required before 064 U |
| [items-player-064](../../plans/items-player-064-stage-4-living-world-sources-and-npc-weapon-use.md) ([notes](../../plans/implementation-notes/items-player-064-stage-4-living-world-sources-and-npc-weapon-use-implementation-notes.md)) | Stage 4 P7b: finite merchant/household/reward sources, NPC weapon/ammo use; upper-tier slice U | ordinary: per-profile 062; U: 063 + Opus review | planned |
| [npc-067](../../plans/npc-067-combat-correctness-prelude.md) ([notes](../../plans/implementation-notes/npc-067-combat-correctness-prelude-implementation-notes.md)) | Projectile earliest-hit, NPC ready-weapon defense, fauna source identity, NPC exact-instance weapon condition | none | P1–P4 implemented and technically verified; browser check pending (2026-11-04) |
| [items-player-065](../../plans/items-player-065-layered-anatomical-armor-and-typed-physical-damage.md) ([notes](../../plans/implementation-notes/items-player-065-layered-anatomical-armor-and-typed-physical-damage-implementation-notes.md)) | Combat S1 (pure types/math, `damageType` tagging) · S2 (layered state + save) · S3 (shared incoming-hit resolver) | author gates approved; S2/S3 retain dependencies + R-B | S1 complete (2026-11-04); S2/S3 pending dependencies on Wave 2 branch |
| [items-player-066](../../plans/items-player-066-layered-armor-catalogue-acquisition-and-balance.md) ([notes](../../plans/implementation-notes/items-player-066-layered-armor-catalogue-acquisition-and-balance-implementation-notes.md)) | Combat S4/S7: first armor batch (typed rebalance + 7 new kinds incl. padding), sources/recipes; brigandine; remaining donor armor batches; balance closure | author gates approved; after 065 S3 | planned |
| [ui-input-048](../../plans/ui-input-048-layered-equipment-panel-and-protection-stats.md) ([notes](../../plans/implementation-notes/ui-input-048-layered-equipment-panel-and-protection-stats-implementation-notes.md)) | Combat S5: Under/Outer rows, truthful local/expected protection, preview, hit feedback | after 066 A | planned |
| [npc-068](../../plans/npc-068-npc-layered-armor-use-provisioning-and-restrictions.md) ([notes](../../plans/implementation-notes/npc-068-npc-layered-armor-use-provisioning-and-restrictions-implementation-notes.md)) | Combat S6: NPC derived layered kit + cache, restrictions incl. offscreen travel; guard kits | cache/restrictions: after first release · kits: Q-IC3 approved | planned |

Deferred, no plan yet: combat **S8** appearance for new armor pieces (needs skinned assets + D11 governance); A8 reappearance policy; shields/parry/dodge/durability (C4 boundary).

## 4. Parallel work lanes and file ownership

### 4.1 Waves (dependency order)

```text
Wave 1 — no author input needed
  065 S1 (pure types + damageType tagging) ──┬─> 062 policy + melee batches ─> 062 ranged/ammo ─> 062 shields
  044-M (slot split + migration) ────────────┤        (serialize with 044-M on catalog files)
                                             ├─> 045 layout (after 044-M)
  063 ledger (isolated; parallel-safe) ──────┘
  npc-067 prelude (after 062 melee NPC-family slice, same npcCombat.ts)

Wave 2 — after Q-IC1 + Q-IC2, on integration branch `side/combat-layered-release`
  065 S2 ─> 065 S3 ─> 066 A (first batch) ─> 048 UI ─> Opus review ─> merge = first player release

Wave 3
  npc-068 (cache/restrictions; kits after Q-IC3)   ∥   064 ordinary sources (per profiled item)
  066 B (brigandine, then donor armor batches)     ─>  064 U (upper-tier; after 063 + Opus review)

Wave 4
  066 C balance closure (author playtest) · 044-V / S8 visuals when assets exist
```

**Why an integration branch for Wave 2:** combat proposal §11 forbids releasing typed damage with old global-protection labels and forbids a permanent dual armor mode. 065 S2 changes the save shape, so the four stages must reach `main` together. The branch rebases on `main` regularly; this is the only sanctioned exception to "work on main" in this initiative.

### 4.2 Hot files — never edited by two concurrent sessions

| File(s) | Lanes touching it | Rule |
| --- | --- | --- |
| `src/items/itemCatalog.ts`, `items.ts`, `itemInstances.ts`, `tradeCatalog.ts` | 044, 062, 065 S1/S2, 066 | append-only rows per slice; one session at a time; 065 S1 first |
| `src/items/equipment.ts`, `armorItemInstances.ts`, `equipmentPreview.ts` | 044, 065, 066, 048 | 044-M lands before Wave 2 starts |
| `src/ai/npcCombat.ts`, `npcLoadout.ts`, `NpcAgent.ts` | 062 (NPC weapon families), npc-067, 064, 065 S3, npc-068 | serialize: 062 melee → npc-067 → 065 S3 → 064/npc-068 |
| `src/app/gameLoop.ts`, `src/combat/projectile.ts`, `player/playerRanged.ts` | 062 ranged/ammo, npc-067, 065 S3 | 062 ranged lands before 065 S3 begins |
| `src/persistence/saveData.ts` (+ `npcState`, `saveState`, `createApp`) | 044, 063, 065 S2, (npc-068 if a latch changes) | **save-migration token** (§4.3) |
| `src/items/v3Equipment/*` | 044 (slot projection), 062 (policy evolution) | 044 first; policy + tests change together |
| `src/ui-vue/components/items/*` | 045, 048 | 045 before 048 |

### 4.3 Save-migration token

- At most one **unmerged** migration-bearing change exists against `main` at a time. Version = `CURRENT_SAVE_VERSION + 1` read **after** `git pull --rebase`, never a number written in a plan.
- The Wave 2 branch carries its migration at the tip and **renumbers it on every rebase** (re-run its fixtures). Main-lane migrations (044, 063) do not wait for it.
- No migration in this initiative bumps `WORLDGEN_EPOCH` (no geography/entity-identity change).
- Every migration: `loadStoredSave` fixtures for the previous version and the new one; never "repair" corrupt data into accepted state.

## 5. Session protocol for GPT-6 Sol

1. `git pull --rebase origin main`. Read this index §2–§6, then the plan and its notes. Run `pnpm claude:preflight <plan-id>`.
2. Take the next slice whose gate is open and whose hot files are not held by another active session (§4.2). Do not combine slices from different plans in one commit.
3. Code is authoritative: if a cited symbol moved, adapt and note it in the plan's implementation notes (dated). Out-of-scope findings → `docs/plans/LOOSE-ENDS.md`.
4. Verify with the smallest relevant set (`pnpm vitest run <paths>`, `pnpm run type-check`, `pnpm run lint:fix`, `pnpm run build` at slice end). Distinguish implemented / technically verified / browser-verified; browser checks you cannot do go to the plan's "Manual verification" list and queue §2.
5. Commit + push per slice; update the **Status** column in §3 and the plan's `Status` when a plan completes. Do not edit the Revival queue rows.
6. A product question (visual compromise, dropped/reduced feature, balance direction beyond the approved tables) → stop that slice, add it to §6 here and to queue §3 in Polish with short options, continue with another open slice.
7. Performance-relevant slices (NPC armor cache, per-hit work, stock seeding): run the named focused check; landing needs WSL A/B only if the plan marks it; never claim FPS gains.

## 6. Author decisions

**All four approved by the author, 2026-11-04.** Binding record: [Strategic Brief](./STRATEGIC-BRIEF.md). Values are playtest baselines. Q-IC4 opens mechanics only; visuals still need valid skinned assets.

| ID | Question | Recommendation | Unblocks |
| --- | --- | --- | --- |
| **Q-IC1** (= C1 / D5) | Seven exclusive body regions, one sampled location per hit, under/outer layers, cut/pierce/blunt resistance; padding becomes wearable under-armor in this track (A6 successor) | **APPROVED 2026-11-04** | 065 S2/S3, 066, 048 |
| **Q-IC2** (= C2 / D6) | Balance policy: torso armor stops protecting other regions (mail-only reference pierce 32 % → 15.75 % expected); proposed resist/restriction tables as playtest starting point; trap = hands/cut unblockable, mount fall = legs-weighted blunt with armor; no location damage multipliers | **APPROVED 2026-11-04**, numbers tuned after playtest (066 C) | 065 S3, 066 |
| **Q-IC3** (= C3 / D7) | Guard armor kits only at genuine first NPC creation by settlement size; no retroactive kits in existing saves; no civilian auto-armor | **APPROVED 2026-11-04** | npc-068 kits |
| **Q-IC4** | Ship 044 bracers mechanically now without a visible mesh (runtime GLBs were removed in `e8d4a463c`); visuals when you deliver valid skinned GLBs | **APPROVED 2026-11-04** | 044-M; 044-V waits for assets |

If Q-IC1 or Q-IC2 is declined: do **not** substitute global scalar protection behind an anatomical UI. Fallback per review 032 F2 (padding → inventory-only, Stage 4 P4/P5 scalar armor reopens) and Opus revises the rejected mechanic. If Q-IC3 is declined: npc-068 ships derived wear/restrictions only, no kits.

Not needed now: A8 destruction/reappearance policy — asked only before 064 slice U enables an upper-tier source; until then claims are permanent tombstones.

## 7. Required Opus / Astra involvement

- **Opus review R-A** — 063 ledger protocol + its enabled-issuer list, before 064 slice U (Stage 4 proposal: independent review is an acceptance condition).
- **Opus review R-B** — Wave 2 branch before merge (065 S2/S3 + 066 A + 048): formulas vs proposal fixtures, migration chain, preview = actual.
- **Opus spot review** — first 062 melee batch's authored profiles (sets the envelope for the remaining batches); optional afterwards.
- **Astra:** not required. Only if Q-IC1/Q-IC2 is rejected and the mechanic needs redesign, or if any slice needs new NPC spoken lines (none planned).

## 8. Implementation handoff — 2026-11-04

Completed on main: 065 S1; 044-M (save v58); 045 layout (technical verification, browser pending); 062 W0–W5; 063 ledger with guarded acquisition and save migration; npc-067 P1–P4. Focused test results and manual gaps live in each plan's notes. No layered runtime or upper-tier issuer is released. WORLDGEN_EPOCH remains unchanged.

**Current handoff:** review 033 R1–R3 and F2–F5 are resolved: W2a merchant candidates removed, no-source guard extended through W2b, Common prices re-anchored, sword defense/mass and catalog documentation corrected. W2c/W2d are complete (melee batch done); 062 is complete (W0–W5); the next initiative step is Wave 2 (065 S2 on `side/combat-layered-release`) in the documented order. 063 infrastructure is implemented with no production issuer; **Opus R-A is still required before 064 U**. npc-067 P2/P4 are implemented (ready-weapon defense, exact-instance condition/wear and missing-weapon cancellation); browser smoke checks remain pending. 062 is complete, so 065 S2 may start; use `side/combat-layered-release`, then 066 A + 048 + R-B before integration. 044-V still waits for valid skinned GLBs. No Revival queue priorities or geography work changed.

### Review 033 R1 correction — 2026-11-04

The initial W2a no-source claim was false: `MERCHANT_STOCK` enabled acquisition. R1 removes those four candidates while retaining prices and existing save ownership. A shared 062 no-source guard sweeps ordinary/premium/home pools and generated assortments. With R1 green and on main, W2b is GO. Historical review verdict above refers to the pre-correction baseline.

### Coordinated verification — 2026-11-04

`pnpm vitest run src/items src/settlement src/persistence src/ai/npcCombat.test.ts src/ai/NpcAgent.combatMode.test.ts src/player/playerMelee.test.ts src/app/interactables.test.ts src/combat/incomingHumanHit.test.ts`: **166 files / 2425 tests pass**. The final restricted-drop validation hardening is also checked by the four affected ledger/transfer/save suites (**200 tests pass**). Vue type-check, scoped ESLint and `pnpm run build` pass; `pnpm docs:sync` regenerates plan/navigation/symbol/dependency indexes. No browser/gameplay PASS or performance gain is claimed. Manual 062 weapon and 067 guard checks are queued in the Revival queue §2; ammunition checks belong to future W3. No upper-tier issuer or layered combat runtime was enabled.

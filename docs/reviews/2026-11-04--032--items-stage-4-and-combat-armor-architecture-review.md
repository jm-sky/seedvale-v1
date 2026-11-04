# Review 032 — Items Stage 4 × Combat & Armor: architecture reconciliation

**Date:** 2026-11-04
**Reviewer:** Claude Opus 5.5 (lead architect, side initiative)
**Scope:** [Stage 4 approved decisions A1–A10](../research/v1-revival/2026-10-28--equipment-stage-4-approved-author-decisions.md), [Stage 4 implementation proposal P0–P8](../research/v1-revival/2026-10-27--equipment-stage-4-implementation-proposal.md), [Combat & Armor redesign proposal S0–S8](../research/v1-revival/2026-11-04--combat-armor-redesign-proposal.md) (Astra), [items-player-044](../plans/items-player-044-shoulder-and-forearm-equipment-slots.md) + notes, [ui-input-045](../plans/ui-input-045-equipment-body-layout.md), [Q13 armor audit](../research/v1-revival/2026-11-02--q13-items-player-items-equipment-audit.md).
**Baseline:** V1 `main` @ `fe49547f` (local; `git pull` unavailable in this session — remote access denied, so later remote commits were not seen).
**Coordination:** [Items & Combat side-initiative index](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md).
**Evidence:** static source inspection of the anchors named below; no tests, browser or performance runs. Status markers: ✅ verified in code · 🟡 Opus resolution (routine technical decision) · ❓ author decision.

## 1. Verdict

The two designs are **compatible in direction but not in sequencing or data model**. Stage 4 was written against the scalar six-slot armor model ("no layering, typed damage/resist… is activated"); the combat proposal replaces exactly that model. Executed as written, Stage 4 P4/P5/P6 would author ~33 scalar armor/underlayer profiles and an inventory-only padding representation that the combat track must immediately re-author and migrate. 044's save plan would also reject every current save. With the resolutions below, both workstreams become one dependency graph with three lanes, no duplicated owner, and only the combat-mechanics product gates (C1–C3) plus one asset question left for the author.

The combat proposal's verified baseline claims hold at `fe49547f` (save v57, `arms` slot, global multiplicative armor, first-carried NPC defense, `'fauna'` attacker key, perpendicular-distance projectile pick, private `defenseAttempt`). Its design stands; corrections are about sequencing, ownership and two factual errors.

## 2. Critical findings

### F1 — Critical: 044's runtime-only `arms` remap would reject every current save ✅ → 🟡 resolved

`isPlayerEquipmentField()` (`src/persistence/saveData.ts:1077`) returns `false` for any key that is not `isEquipmentSlot(key)`; `loadStoredSave` runs `migrateStoredSave` → validation. After the union drops `arms`, a v57 save with `playerEquipment.arms` fails structural validation **before** `createEquipmentState()` is ever called. The 044 plan's "narrow migration in `createEquipmentState`" therefore never runs; the save is refused.

**Resolution:** 044 adds a real `SAVE_MIGRATIONS` entry `v57 → v58` (next free number at commit time): `arms` → `shoulders` (explicit valid `shoulders` wins; validate against migrated player instance rows; never to `forearms`); `createEquipmentState` gets no legacy branch. Combat proposal §10.1 already said this; now bound into 044.

### F2 — High: Stage 4 P4/P5 (scalar outer armor) and P6 padding conflict with the combat model ✅ → 🟡 resolved

Stage 4 P4 authors scalar `damageReduction` for 30 armor targets in today's six slots; P6 registers `padded_cap/jacket/hose` as count-backed inventory goods "prefer count-backed unless a concrete approved use needs instance support". The combat track (§3, §5) needs every armor piece as an instance-backed `ArmorKind` with `layer` and `resist{cut,pierce,blunt}`; padding is its core under-layer content. Landing P4/P6 first creates (a) scalar profiles nobody ships, (b) a count→instance save migration for padding — the "data-model dead end" A6 explicitly forbids.

**Resolution:**
- **All donor armor admission moves to the combat track** ([items-player-066](../plans/items-player-066-layered-armor-catalogue-acquisition-and-balance.md)). No donor armor kind ever gets a scalar `damageReduction` profile. Stage 4 P4/P5 are superseded as stages; their per-item matrix rows stay the authority for identity, tier and source class.
- **Padding is not registered as inventory-only goods.** It is registered once, as instance-backed `under`-layer armor, when the layered contract exists. Until then it stays inert donor metadata (A6 "inventory-only, no protection for now" is satisfied: it gives no protection; it is simply not yet obtainable).
- Stage 4 P6 shrinks to the **three shields** (A7) — still inventory-only goods.
- If the author **rejects C1** (layers), padding falls back to Stage 4 P6 (inventory-only instance-backed armor kinds with no wearable permission) and P4/P5 reopen with scalar profiles. This fallback is recorded, not pre-built.

### F3 — High: 044 visuals have no runtime assets ✅ → ❓ author

Commit `e8d4a463c` removed both `public/models/characters/ubc/accessories/male_{leather,steel}_bracers.glb` (30 / 61 MB, unskinned per the 044 plan's own blocker). The tree now has only the four pauldron accessories and a 27 MB `docs/blender/sources/male_steel_bracers.glb` source (skinning unverified). The 044 notes' "user has already prepared final GLBs — do not regenerate" is false at this baseline.

**Resolution:** split 044's Definition of Done: **044-M** (slot split, migration, two bracer kinds, UI labels, stock) ships without bracer appearance — bracers are mechanically active, the character shows no bracer mesh, details say so; **044-V** (bracer visuals) waits for author-delivered skinned GLBs. Because this ships a piece without its appearance, it is a visual compromise → **author question Q-IC4** (recommendation: accept). 044-M does not wait for the answer's visual half; it waits only for "yes, ship mechanics first".

### F4 — High: shared hot files and save versions make naive parallel execution unsafe ✅ → 🟡 resolved

Both tracks edit `itemCatalog.ts`, `items.ts`, `itemInstances.ts`, `npcCombat.ts`, `gameLoop.ts`, `saveData.ts`. At least four migrations are expected (044, issuance ledger, layered positions + hit ordinals, possibly NPC kit latch). Two sessions each appending "v58" corrupt the chain.

**Resolution:** lane/file-ownership table and the **save-migration token** rule in the [index §4](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md#4-parallel-work-lanes-and-file-ownership): at most one unmerged migration-bearing branch at any time; version = `CURRENT_SAVE_VERSION + 1` at commit time after `git pull --rebase`; no reserved numbers in plans.

### F5 — Medium: `damageType` contract must exist before Stage 4 weapons land 🟡

Combat §6.1 makes `damageType` required on every melee/ranged/throwable config with an exhaustive test. Stage 4 P2/P3 add ~22 weapon/ammo configs. If they land first without the field, S3 must retro-tag them; if S1 makes it required first, Stage 4 must know the vocabulary.

**Resolution:** [items-player-065](../plans/items-player-065-layered-anatomical-armor-and-typed-physical-damage.md) **S1** lands first and is ungated: `DamageType` + optional `damageType` on `MeleeConfig`/ranged/ammo/throw payloads, tagging all existing configs per §6.1, with a test that every active config is tagged. Stage 4 weapon slices author the field from day one (halberd cut, mace blunt, bolt_heavy pierce, bolt_blunt blunt, sling_stone blunt; others per authored family). S1 changes no runtime behaviour (nothing reads the field until S3).

### F6 — Medium: Stage 4 documents' D4 gating is obsolete; implementation authorization is new ✅ → 🟡

Stage 4 records "runtime implementation NOT approved" and "D4 blocks". D4 closed 2026-10-30 (Strategic Brief). The author launched both workstreams on 2026-11-04 with implementation delegated to GPT-6 Sol.

**Resolution:** Stage 4 runtime work within A1–A10 is authorized as bounded plan slices (062–064). Combat runtime is authorized only where it does not depend on C1–C3 (065 S1, [npc-067](../plans/npc-067-combat-correctness-prelude.md)); everything else is gated on the named decision. D4 language is replaced by the standing rule: performance-relevant changes are revertable and measured (WSL baseline first), no FPS claims.

### F7 — Medium: correctness fixes in the combat proposal are independent of C1–C3 🟡

§6.2 (NPC exact-instance weapon condition), §6.4 (NPC defense from carried bag item: `resolveNpcDefenseConfig()` returns the first `DEFENSE_CAPABLE_KINDS` entry held — `src/ai/npcCombat.ts:290`), §6.5 (`sweptProjectileHit()` picks min perpendicular distance, `src/combat/projectile.ts:72`), §4.4 source identity (`attackerKey: 'fauna'` at `src/app/gameLoop.ts:2997,3031`) are bugs/plumbing under today's rules. Packaging them inside the gated S3 would stall them.

**Resolution:** extracted into [npc-067 combat correctness prelude](../plans/npc-067-combat-correctness-prelude.md), save-free, startable now. The durable incoming-hit ordinal stays in 065 S2 (it is a save change and replaces `NpcAgent.defenseAttempt` together with the location roll).

### F8 — Low: historical v37→v38 migration iterates live `EQUIPMENT_SLOTS` ✅ → 🟡 (severity corrected)

`saveData.ts:4375` loops the current union. Combat §2 rates this as a data-loss risk. In practice every pre-v57 save carries `worldgenEpoch: 0` (v56→v57 migration) and is refused as `incompatible-world` (Brief: pre-Revival compatibility not required). Still, a historical migration must not change meaning when the union changes — **freeze a local six-slot constant in 044**; cost is three lines. No full-chain v37 fixture is required beyond what exists; v57→v58 fixtures are mandatory.

### F9 — Low: `v3Equipment/validation.ts:39` projects donor `shoulders` → `arms` ✅ → 🟡

Must flip to `shoulders` in 044 (and accept `forearms`), with Stage 3 policy tests updated in the same commit, per Stage 4 proposal §"A6 slots". Never project forearms into shoulders.

### F10 — Low: ui-input-045 assumes `arms` + placeholder forearms 🟡

045 is approved and unlayered. Executing it before 044 builds a placeholder cell that 044 immediately replaces. **Resolution:** 045 runs after 044-M with real `shoulders`/`forearms` cells (same approved grid, labels Naramienniki/Przedramiona); still unlayered. Layer rows belong to the successor [ui-input-048](../plans/ui-input-048-layered-equipment-panel-and-protection-stats.md).

### F11 — Low: deterministic NPC kit IDs vs existing ID minting ✅ → 🟡

`createItemInstanceId()` is `item:${Date.now()}:${n}` (`src/items/itemInstances.ts:242`); `createArmorInstance(kind, quality, id?)` already accepts an explicit ID. Combat §7.2's `npc-start-armor-v1:<npcId>:<position>` IDs need no new mechanism — pass the ID. Lexical-ID tie-breaks in NPC armor selection then stay stable across sessions.

## 3. Resolved conflicts (summary table)

| Topic | Stage 4 said | Combat said | Binding resolution |
| --- | --- | --- | --- |
| Slot set | 044 owns `shoulders`/`forearms` | seven slots, `arms`→`shoulders` | 044-M first, own migration (F1); combat S2 migrates `slot` → `slot:layer` keys later |
| Save versions | "coordinate D1, no number chosen" | N→N+1 at implementation | migration token, no reserved numbers (F4) |
| Padding | P6 inventory-only goods | under-layer armor | combat track only, instance-backed; unregistered until 065 S2 (F2) |
| Outer donor armor | P4/P5 scalar | typed resist | 066 batches, typed only (F2) |
| Shields | P6 inventory-only | Shield N/A, no DefenseConfig | 062 inventory-only goods; A7 unchanged |
| Brigandine | P4 (A9) | follow-up after first batch | 066 slice B (after first batch), typed |
| Weapons/ammo | P2/P3 | `damageType` tagging | 062, authoring `damageType` from 065 S1 (F5) |
| Upper-tier (A8) | P7a ledger | none introduced | 063 ledger; upper-tier armor admitted by 066 but sourced only via 064 after 063 |
| NPC equipment | P7b weapon candidates/distribution | S6 guard armor kits | 064 owns NPC **weapon** use; npc-068 owns NPC **armor** kits/restrictions |
| Steel/leather bracers | 044 scalar .02/.04 | typed rows in first batch | 044-M scalar interim; 066 re-authors typed |
| NPC defense source | — | ready weapon, not bag | npc-067 now (F7) |
| D4 | blocks runtime | lifted | F6 |

## 4. Remaining author decisions

Exactly four; recorded in the [index §6](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md#6-author-decisions) and queue §3. All other open items in the source documents are resolved above or are per-slice tuning.

- **Q-IC1 = C1 / D5** anatomy + two layers + typed resist; padding wearable (A6 successor).
- **Q-IC2 = C2 / D6** balance policy incl. torso-only coverage loss, trap/fall, proposed tables as playtest starting point.
- **Q-IC3 = C3 / D7** guard kits at genuine first creation only.
- **Q-IC4** 044 bracers mechanics-first without visuals.

Deferred (not needed until upper-tier sources, 064 slice U): A8 destruction/reappearance policy. Default until then: non-reissuable tombstone (Stage 4 proposal §Lifecycle), which needs no decision.

## 5. Not changed by this review

A1–A10; the combat formulas/tables (only sequencing and ownership); main Revival roadmap/queue priorities; plan statuses other than 044/045 text corrections; any runtime code.

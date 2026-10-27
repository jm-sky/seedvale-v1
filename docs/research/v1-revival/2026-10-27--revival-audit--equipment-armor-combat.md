# V1 Revival Audit — Equipment, Armor & Combat Integration

**Created:** 2026-10-27\
**Created by:** Claude Opus 5.5 (subagent, one of five parallel specialist auditors)\
**Status:** research — not approved scope. No runtime code, plan or save change. Not committed by the author of this file.

**Pins.** V1 (foundation, authoritative) `c460b224eadfa395e400da3413815327530adaf7`. V3 donor `907e17cd2ad487547a25a1f928b2770348183d75` (local HEAD; equals the catalogue fixture pin). V2 = `legacy/SeedVales` inside the V3 checkout, nested git `9ba54815493b886eb1bdce032f5209aeb2856c37` (same as R4's V2 pin). `legacy/seedvale` inside V3 is a nested checkout of **V1 itself** at `c460b224` [measured: `git log`], not a donor.

**Labels.** [code] = read in source at the pins above; [doc] = stated in a document; [measured] = command output in this session; [hypothesis] = inference/recommendation. No tests, build, browser or gameplay run in this audit.

**Scope / relation to existing recon.** Verifies and extends — does not repeat — the [UI/equipment comparison](./2026-10-26--ui-equipment-v1-v3-comparison.md), [catalogue recon](./2026-10-27--equipment-catalogue-recon.md), [ID mapping](./2026-10-27--equipment-id-mapping.md), [property matrix](./2026-10-27--equipment-property-matrix.md), Stage [1](./2026-10-27--equipment-catalogue-stage-1-implementation-notes.md)/[2](./2026-10-27--equipment-catalogue-stage-2-implementation-notes.md)/[3](./2026-10-27--equipment-catalogue-stage-3-implementation-notes.md) notes and [R4](./2026-10-25--004--gameplay-systems.md). Brief authority: [STRATEGIC-BRIEF §3 "UI and equipment"](./STRATEGIC-BRIEF.md) (layers + body-area protection **selected**; shared player/NPC rules where combat exists; current controls; no new general crafting; acquisition via trade/artisans/loot/rewards; no whole catalogue; mechanics + UI before appearance).

---

## 1. Verified implementation state

### 1.1 V1 — what actually runs

| Mechanism | Current V1 behaviour | Evidence |
|---|---|---|
| Slots | 6 unlayered slots `head/body/arms/hands/legs/feet`; one owned instance per slot; stale refs resolve empty; one instance cannot fill two slots. | [code] `src/items/equipment.ts:EquipmentSlot`, `createEquipmentState`, `liveValidArmorInstance` |
| Armor content | Exactly 6 armor kinds: `leather_armor`, `chainmail` (body); 4 pauldrons (arms). Head/hands/legs/feet have **no** item. | [code] `src/items/itemInstances.ts:ARMOR_KIND_LIST`; `src/items/itemCatalog.ts` armor blocks ~L1025–1125 |
| Layers | None. `ArmorConfig` has `slot` + scalar `damageReduction` + 4 optional restriction multipliers. | [code] `itemCatalog.ts:ArmorConfig` |
| Body-area protection | None. Every worn piece reduces **every** physical hit: `incomingDamageMultiplier = Π(1 − r_i)`. Hit location is never computed. | [code] `equipment.ts:composeEquipmentModifiers` |
| Balance numbers | Body: leather 0.18, chainmail 0.32; pauldrons 0.03/0.05/0.07/0.08. Restrictions e.g. chainmail stamina ×1.28, recovery ×1.22, move ×0.90, sprint ×1.40. Quality: protection ×0.85/1/1.1/1.2 (poor/common/good/masterwork), piece cap 0.85; weight ×1.2/1/0.9/0.8; penalty strength 1.35/1/0.75/0.5. | [code] `itemCatalog.ts`; `src/items/armorItemInstances.ts:QUALITY_TUNING`, `MAX_PIECE_DAMAGE_REDUCTION`, `resolveEffectiveArmorPiece` |
| Damage pipeline (player) | raw → active held-item directional block (`resolveDefense`: front arc dot 0.2, deterministic hash roll, full/partial) → × `incomingDamageMultiplier` → HP → injury. Starvation/dehydration bypass armor by omitting modifiers. | [code] `src/player/playerDamage.ts:applyPlayerDamage`, `tickPlayerStarvationDamage`; `src/combat/defenseResolver.ts:resolveDefense` |
| Damage pipeline (NPC) | Same order: `resolveDefense` (skill 0) → × derived armor multiplier → `takeDamage`. | [code] `src/ai/npcCombat.ts:resolveIncomingNpcDamage`; `src/ai/NpcAgent.ts:applyIncomingCombatDamage` |
| Damage types / resistances | None anywhere (weapons, fauna, armor). | [code] no `dmgType`/resist in `src/combat`, `src/fauna`, `itemCatalog.ts` (grep) |
| Who actually gets hit by whom | **Only fauna → player** (`gameLoop.ts` ~L2943) and **fauna → NPC** (`gameLoop.ts` ~L2982, the only caller of `applyIncomingCombatDamage`). Player/NPC attacks target animals only: `CombatTargetHandle` is built only by `fauna/faunaCombat.ts:combatTargetForAnimal`; player melee applies damage only to `animal.takeDamage`. Mount/container hazards also call `applyPlayerDamage` (`app/actions/mountActions.ts`, `containerActions.ts`). | [code] |
| Player equipment | Explicit `EquipmentState`; `resolveEquipmentModifiers` computed once per frame in `gameLoop.ts:1029`, reused for movement, sprint, melee stamina/recovery, damage. | [code] |
| NPC equipment | No persistent NPC equipment. `resolveNpcArmorEquipment(personalInventory)` derives best effective piece per slot per hit (ties: kind, id). Restrictions **not** applied to NPCs. | [code] `npcCombat.ts:pickBestArmorInstance`, `resolveNpcArmorEquipment`; [doc] `docs/state/combat.md` "Derived NPC worn armor" |
| Do NPCs own armor in practice? | No seeding path puts armor in an NPC's `personalInventory`: `createArmorInstance` callers are merchant stock, blacksmith **household** stock, artisan order output, trade purchase, demo fixtures. Guard loadouts are weapons only. So shared rules exist but are rarely exercised. | [code] `settlement/merchantTrade.ts:660`, `householdProfessionStock.ts:330` (`Household.items`), `artisanOrders.ts:187`, `items/trade.ts:213`, `ai/npcLoadout.ts`; "rarely exercised" = [hypothesis] |
| Quality / condition / durability | Armor: quality only, no durability/condition. Melee: durability+sharpness 0..1 (durability never disables). Ranged: identity only. No shields. | [code] `itemInstances.ts`; [doc] recon §3 (verified unchanged) |
| Acquisition of armor | Merchant finite stock with generated quality (home overlay: `poor` leather pauldron), Blacksmith household specialist stock, artisan custom orders (`production.ts` `blacksmith.chainmail`, armor specialization), NPC barter. **No armor in loot, treasure, containers, quests or rewards.** | [code] grep of `src/world`, `src/quests`, `treasureGameplay.ts`, `createItemSpawners.ts`, `authoredWorldPickups.ts` → no armor refs |
| UI | Equipment panel / item details / Character screen show `damageReduction` from the same resolver (`characterPresentation.ts:131` = `1 − incomingDamageMultiplier`); `equipmentPreview.ts:previewEquipLoadout` diffs via `resolveEquipmentModifiers`. Truthful today because protection is global. | [code] |
| Save | `CURRENT_SAVE_VERSION = 56`; `SaveData.playerEquipment?: Partial<Record<EquipmentSlot,string>>`; validator `isPlayerEquipmentField` **rejects any key not in `EQUIPMENT_SLOTS`**. Armor instances persist `{id, kind, quality}`; NPC belongings via `npcStates[].personalInventory`. Forward-only `SAVE_MIGRATIONS`; only `version > CURRENT` is refused. | [code] `src/persistence/saveData.ts:762, 813, 1071, 4415, 4527` |
| Appearance | `body` kind → outfit preset; `arms` → UBC pauldron overlay. | [code] `app/createApp.ts:1154`, `player/playerVisualPreset.ts:177`, `player/playerEquipmentVisual.ts` |

### 1.2 V3 catalogue transfer inside V1 — inert vs wired

| Piece | State | Evidence |
|---|---|---|
| `src/items/v3Equipment/{types,provenance,catalogue}.ts` | 87 resolved donor definitions, frozen, provenance-pinned to `907e17cd`. **Inert data.** | [code]; [doc] Stage 2 notes |
| `compatibility.ts` / `propertyCompatibility.ts` / `validation.ts` / `adapter.ts` | Policy for 87/87 IDs (17 existing, 9 adapt, 27 new, 4 conflict, 30 deferred); `projectV3Equipment()` returns `existing-v1-profile`/`new-candidate`/`deferred`/`conflict`/`unknown-id`; `activation` always `inactive`. | [code] `compatibility.ts:POLICY`; [doc] Stage 3 notes |
| Runtime consumers | **None.** No production file outside `v3Equipment/` imports it (isolation test). No V1 ItemKind, catalogue row, stock, save field or UI reads it. | [doc] Stage 3 notes; [code] grep confirms only tests import |
| Armor policy relevant here | Existing/adapt to V1: `leather_pauldron`, `ranger_pauldron`, `plate_pauldrons_spiked→knight_pauldron_spike`, `plate_pauldrons_round→knight_pauldron_round`, `leather_jerkin→leather_armor`, `mail_shirt→chainmail`. "new": padded_cap, leather_cap, mail_coif, iron_helm, full_helm, iron_pauldrons, padded_jacket, studded_leather, plate_cuirass, leather_bracers, iron/plate_vambraces, leather/studded gloves, plate_gauntlets, padded_hose, leather_trousers, mail_chausses, plate_greaves, leather/reinforced boots, plate_sabatons. All unique/legendary armor and shields deferred. | [code] `compatibility.ts` |
| Donor values for the 8 brief candidates | `[cut,pierce,blunt]`: padded_jacket torso/under .20/.10/.25; padded_cap head/under .15/.05/.20; iron_helm head/outer .70/.50/.30; leather_bracers forearms/outer .35/.20/.10; leather_gloves hands/outer .20/.10/.10; padded_hose legs/under .15/.05/.20; leather_trousers legs/outer .25/.10/.10; leather_boots feet/outer .20/.10/.10, speedPenalty −0.03. | [code] `v3Equipment/catalogue.ts` |

### 1.3 V3 and V2 — runtime vs library vs UI vs docs

| Donor element | Classification | Evidence |
|---|---|---|
| V3 `loadout.ts` (`ARMOR_SLOT_COVERAGE` torso .35/legs .20/head .12/shoulders .10/feet .10/forearms .08/hands .05; `stackResist = 1−(1−a)(1−b)`; `computeLoadout` coverage-weighted average) | **Library + UI-only.** Consumers: `game/ui/items/EquipmentPanel.vue`, `game/ui/character/StatePanel.vue`, `items-browser/LoadoutPanel.vue`. File header: weights are "a proposal" (D-ITM-5). | [code] V3 `src/game/data/items/loadout.ts:1-20` + grep |
| V3 `inventory.ts:takeHit/strikeWithWeapon/blockWithShield`, `condition.ts` wear | **Demo-only.** Only callers: `inventory-demo/InventoryDemo.vue`, `shop-demo/ShopDemo.vue`. | [code] grep |
| V3 live damage pipeline | **Absent.** `src/game/sim/player/playerVitals.ts` etc. have no damage application. | [code] grep (`damage`/`applyDamage` in `src/game/sim` → none) |
| V3 `docs/decisions/combat-system-contract.md` §3/§5, C08 | **Design doc.** Per-part region blend: head→head; gut→torso; torso→80% torso/20% shoulders; arms→60% forearms/20% hands/20% shoulders; legs→80% legs/20% feet; "do not additionally apply `computeLoadout` average". | [doc] L115–117, L204 |
| V3 `npc/guardEquipment.ts` | Real kit-selection **policy**, not proof of combat. | [doc] recon §2 |
| **V2 `sim/combat.ts:applyDamage` + `armorResist`** | **Working runtime mechanic** (the only live layered body-part armor in any repo): weighted random part `PART_TABLE` (torso 38, gut 14, head 10, l/r arm 10, l/r leg 9); `PART_ARMOR` maps part→slots (torso→torso+shoulders, arm→forearms+hands+shoulders, leg→legs+boots); for each slot × `under/outer`, `pass *= 1 − min(0.9, resist[type] × qualityMult)`; wears every contributing piece 0.3/hit; `dur ≤ 0` piece ignored. Shared by player and NPC humans; animals have no armor. | [code] V2 `src/game/sim/combat.ts:33-44, 82-104` |
| V2 per-part HP | `vitals.parts` with `PART_W` (head 1.6, gut 1.25 …). | [code] V2 `sim/vitals.ts:14` |
| V2 NPC armor choice | `armorScore = mean(resist) × quality`; `wearBetterArmor` on receipt. | [code] V2 `sim/inventory.ts:185-195` |
| V2 weakness for reuse | Uses `sim.rng` (seeded but order-dependent), stacks **full** shoulder+forearm+hand protection on every arm hit (exactly what the V3 contract later warns against), wears on every hit, player-specific KO rules interleaved. | [code]; critique = [hypothesis] |

---

## 2. Reusable V1/V2/V3 solutions — verdicts

Cost: S ≈ one focused Cursor slice; M ≈ 2–3 slices; L ≈ needs its own plan series.

| Mechanism | Verdict | Rationale | Cost |
|---|---|---|---|
| Inventory ownership, instance identity, transfer, capacity | **KEEP V1** | Single owner for player/NPC/household/merchant; V3 inventory is warning-only. [code] | — |
| `EquipmentState` (instance refs per slot, live-validation, no ghosts) | **EXTEND V1** | Add `layer` dimension and the 044 slot split; keep instance-ref model. | M |
| Slot set | **ADAPT V3 / via items-player-044** | 7 slots = V3 set with V1 name `body` (≙ torso), `shoulders`, `forearms`. Existing pauldrons → `shoulders` (044). | S (inside the M above) |
| Layers `under/outer` | **ADAPT V3 data contract** | Per-piece `layer` in `ArmorConfig`; at most one piece per (slot, layer). Donor stacking rule `1−(1−a)(1−b)` = V1's existing multiplicative composition, so no new math. | S |
| Body-area hit resolution | **BUILD NEW (V1-owned), informed by V2 runtime + V3 contract** | Neither donor is directly portable: V2 is RNG/order-dependent and over-stacks; V3 has no runtime. Small pure function in `src/combat/`. | S |
| Deterministic roll | **KEEP V1** pattern | Reuse `defenseBlockRoll(defenderId, attackerKey, attempt)` hashing with a distinct salt for the area roll; same `attempt` counter (`player.nextDefenseAttempt`, `NpcAgent.defenseAttempt`). [code] | S |
| Active held-item defense (`resolveDefense`) | **KEEP V1** | Brief keeps current controls; no parry/dodge. Remains first in order. | — |
| Damage types cut/pierce/blunt | **ADAPT V3 data, later (optional)** | Requires tagging every V1 melee/ranged config and each fauna attack; donor typed resist kept inert until then. See D2. | M |
| Armor quality | **KEEP V1** | 4 tiers, single resolver shared by UI & combat; donor quality names/multipliers differ (×1.15/×1.3, cap .95). | — |
| Armor durability / condition / repair | **Defer → later ADAPT V3 `condition.ts` semantics** | Not selected by brief; adds save payload, repair UI, NPC wear. | M–L |
| Restriction multipliers (stamina/recovery/move/sprint) | **KEEP V1** | Per-piece; needs a bound test once 14 positions can stack. NPC parity not required by brief (protection only). | S (test) |
| NPC armor derivation | **EXTEND V1** | Best piece per (slot, layer) from `personalInventory`, ranked by effective reduction; unchanged "no persisted NPC loadout" invariant. | S |
| NPC armor provisioning (guards etc.) | **ADAPT V3 policy idea (`guardEquipment.ts`)** into V1 `npcLoadout.ts` seeding | Without it, the shared rule has no observable NPC users. See D5. | S–M |
| Comparison/preview | **EXTEND V1** `equipmentPreview.ts` + `characterPresentation.ts`; **ADAPT V3 presentation** (LoadoutSummary/delta layout) | Must show per-area protection + expected average from the **same** resolver as combat. | M |
| Equipment panel body layout | **EXTEND** `ui-input-045` | 045 is locked to "no layers"; a layered variant follows the model change. | S |
| V3 catalogue manifest/adapter | **KEEP (V1-landed) and consume** | Use `projectV3Equipment` `new-candidate` rows as provenance input for authored V1 profiles; never runtime-import resist values. | S per batch |
| Trade, merchant stock, artisan orders, NPC barter | **KEEP V1, add rows** | Add new kinds to existing stock/production tables. | S–M |
| Loot / rewards for armor | **EXTEND V1** | No armor loot today; add to existing container/treasure tables and quest reward owners. | S–M |
| Save of equipment | **EXTEND V1** + one bump | See §4.5. | S |
| V2 per-part HP / bleeding / KO | **Reject for this scope** | Changes health model wholesale; not selected. | — |
| Shields, two-handed grip, parry | **Reject for this scope** | Brief: no new parry/dodge; shields would be a new defense feature. | — |

---

## 3. Problems, limits, risks

1. **Body-area protection lowers average protection of today's kits** [hypothesis, arithmetic]. With V3 coverage weights, a chainmail-only wearer protected only on body hits (~0.35–0.5 of hits) gets ~0.11–0.16 expected reduction vs. 0.32 today unless per-piece values rise. Rebalancing existing 6 pieces is unavoidable; needs D3.
2. **Restriction stacking** [hypothesis]: 7 slots × 2 layers × multiplicative penalties can produce extreme sprint/stamina costs (chainmail alone ×1.40 sprint). Needs a full-heavy-kit bound test and authored values.
3. **Save validator vs plan 044** [code + doc]: `isPlayerEquipmentField` rejects unknown slot keys; once `arms` leaves `EquipmentSlot`, every existing save with `arms` fails *validation* before 044's proposed `createEquipmentState` legacy remap ever runs. 044's "no versioned migration" approach is therefore not viable as written; V1 CLAUDE.md also requires a bump when persisted semantics change.
4. **Shared rules are nominal for NPCs** [code + hypothesis]: no NPC normally owns armor (household stock ≠ personal inventory), so player/NPC parity cannot be observed without provisioning (D5).
5. **Combat surface is small** [code]: only fauna→human hits exist. Fauna attack height/species does not inform location. A uniform table means wolves hit heads as often as legs — acceptable initially, flagged D7.
6. **UI truthfulness regression risk** [code]: `characterPresentation.ts:131` and `equipmentPreview.ts` compute "damage reduction" from the global multiplier. After the change a single scalar is no longer the real effect; UI must show per-area + expected value from the combat resolver, or it violates the brief ("displays must reflect actual effects").
7. **Two resolvers drift** [code]: player and NPC pipelines are duplicated (`applyPlayerDamage` vs `resolveIncomingNpcDamage`) with identical ordering. Adding area logic twice risks divergence; extract one shared seam.
8. **Appearance mismatch** [doc]: new slots/pieces will be invisible until 037/044 visual work; accepted by brief as transitional. `createApp.ts:1154` hardcodes `'arms'` → must move to `'shoulders'` in the same slice as the slot split or overlays vanish.
9. **Catalogue ID conflicts** [doc]: arrow/broadhead, Marlow, Fenmoor, obsidian_knife unresolved — irrelevant for armor-first stages, but block any weapon import.
10. **Determinism** [code]: a second hash draw must use a distinct salt so it is independent of the block roll; otherwise block outcome and hit area correlate.
11. **Docs drift** (see §7 contradictions) may mislead future agents into assuming player→NPC damage exists.

---

## 4. Recommended architecture and alternatives

### 4.1 Ownership (where code lives)

| Concern | Owner (existing file unless marked new) |
|---|---|
| Slot/layer unions, worn-position state, NPC derivation helper | `src/items/equipment.ts` (`EquipmentSlot` 7 values, new `ArmorLayer = 'under' \| 'outer'`, `EquipmentPosition = { slot, layer }`, `EquipmentPositionKey` union e.g. `'body:outer'`) |
| Per-piece effective stats (quality) | `src/items/armorItemInstances.ts:resolveEffectiveArmorPiece` (unchanged formula; add `layer`) |
| Piece data | `src/items/itemCatalog.ts:ArmorConfig` (+ `layer`; keep scalar `damageReduction` until D2) |
| Hit-area table + deterministic area roll | **new** `src/combat/hitArea.ts` (pure, no imports from items) |
| Shared incoming-hit pipeline for humans | **new** `src/combat/incomingHumanHit.ts`: `resolveIncomingHumanHit({ amount, defense, defenseSkill, inArc, defenderId, attackerKey, attempt, worn })` → `{ outcome, area, finalDamage, armorMultiplier }`. Called by `player/playerDamage.ts:applyPlayerDamage` and `ai/npcCombat.ts:resolveIncomingNpcDamage`. |
| Restrictions (movement/stamina) | stay in `EquipmentModifiers`; drop `incomingDamageMultiplier` from it (replaced by per-area query) |
| Display / comparison | `src/items/equipmentPreview.ts`, `src/player/characterPresentation.ts` — read `protectionByArea()` + `expectedProtection()` exported from the same module as the combat resolver |

### 4.2 Formula (scalar first)

For a hit that survives active defense: `area = rollArea(defenderId, attackerKey, attempt)`; `mult(area) = Π over positions mapped to area of (1 − r_eff(piece))`; `final = afterDefense × mult(area)`. Display: `E[mult] = Σ_area w_area × mult(area)`. Layers in the same slot stack multiplicatively (identical to V3 `stackResist` and to today's V1 composition) [code]. Keep per-piece cap 0.85; add a per-area floor test (e.g. mult ≥ 0.1) [hypothesis].

### 4.3 Area model — alternatives

| Option | Description | Pros | Cons |
|---|---|---|---|
| **A (recommended)** slot-direct | Area = equipment slot; weights = V3 `ARMOR_SLOT_COVERAGE` (body .35, legs .20, head .12, shoulders .10, feet .10, forearms .08, hands .05). | Simplest; 1:1 UI ("hit on legs → trousers+hose"); no blend; expected value trivially shown; easy tests. | Less anatomical; shoulders treated as an independent target. |
| B V3-contract blend | 5 parts (head/torso/gut/arms/legs, V2 weights) → weighted blend of regions per part. | Matches V3 accepted design; anatomical. | Second level of weights; harder to explain in UI; more tuning. |
| C expected-value only | No roll; apply `E[mult]` every hit. | Zero variance, cheapest. | Functionally a global scalar again — does not deliver the selected "body-area protection". |
| D V2 port | Part roll + full stacking of all mapped slots. | Proven runtime. | Over-stacks arm protection; RNG-order dependent; per-part HP coupling. |

### 4.4 Shared Player/NPC seam

One pure function (§4.1) for both; player passes `EquipmentState`, NPC passes `resolveNpcArmorEquipment(personalInventory)` extended to (slot, layer). Restriction effects stay player-only (brief requires comparable **protection**). Animals remain unarmored. Starvation/env damage keeps bypassing armor by not calling the human-hit resolver.

### 4.5 Save policy (proposal)

- **One** bump `56 → 57` for the combined slot split + layer shape (`playerEquipment` becomes `Partial<Record<EquipmentPositionKey, string>>`), with a forward migration: `body → body:outer`, `arms → shoulders:outer`, other existing keys `→ :outer`; unknown/invalid dropped. Cost S; uses the real pipeline; avoids the validator trap in §3.3 [hypothesis].
- New armor kinds need no bump (instances already `{id, kind, quality}`; kind validation uses `isArmorKind`) [code]. A later durability payload would be its own bump.
- Policy statement for the revival: *pre-revival saves are best-effort; new games must round-trip.* Keep migrations while cheap (as here); if a later revival change needs an expensive migration, add an explicit "minimum supported version" refusal rather than silent corruption — requires author OK (D4).

---

## 5. Proposed stages (Cursor-sized)

| # | Stage | Output | Depends | Owning plan |
|---|---|---|---|---|
| E1 | Protection spec + pure resolver | `combat/hitArea.ts`, `combat/incomingHumanHit.ts` with unit tests (weights sum to 1, deterministic roll, salt independence from block roll, layered stacking, empty area = 1). No wiring. | D1 | needs new plan per PLANNING.md (`items-player-062`, next free ID) |
| E2 | Slot split + layer model + save v57 | 044 slot split (pauldrons → `shoulders`), `ArmorConfig.layer`, `EquipmentState` keyed by position, `isPlayerEquipmentField` + migration, `createApp.ts` overlay key, Polish labels; UI equips into correct layer. Combat mitigation temporarily unchanged (old global multiplier over all worn positions) until E3. | E1 types | **items-player-044** (re-scope: add layers, replace its save section) |
| E3 | Wire resolver into player + NPC | Replace `incomingDamageMultiplier` use in `applyPlayerDamage` and `resolveIncomingNpcDamage` with shared seam; NPC derivation per position; delete duplicate ordering; debug log of area. | E1, E2 | new plan (same as E1, stage 2) |
| E4 | Truthful UI | `equipmentPreview`, `characterPresentation`, item details: per-area protection + expected average + deltas, from E1 module; layered body grid. | E3 | **ui-input-045** (follow-up revision) + E1 plan |
| E5 | Rebalance + first content batch | Re-author 6 existing pieces; add ~8 candidates (padded_jacket, padded_cap, iron_helm, leather_bracers, leather_gloves, padded_hose, leather_trousers, leather_boots) as V1 `ItemKind`/`ArmorKind`/`ITEM_DEFS`/`ITEM_CATALOG` using `projectV3Equipment` provenance; weights/size; icons/ground model fallback. | E2, D3, D9 | needs new plan (catalogue Stage 4) |
| E6 | Acquisition | Merchant/blacksmith stock rows & quality, artisan `ProductionDef`s, NPC barter allowlist, loot/treasure containers, ≥1 quest reward. | E5 | new plan (or E5 plan stage 2) |
| E7 | NPC provisioning | Deterministic role kits (guards first) seeded into `personalInventory` at creation (new games). | E3, E5, D5 | new plan in `settlements-npcs`/`npc` (ref npc-053) |
| E8 (opt) | Damage types | `dmgType` on Melee/Ranged configs + fauna attacks; per-piece typed resist; UI per type. | E3, D2 | needs new plan |
| E9 (defer) | Armor durability/repair, appearance of new pieces | — | D6 / 037, 044 visuals | 037 / later plans |

Recommended first three: **E1 → E2 → E3** (E1 and E2's type change can run in parallel once D1 is fixed).

---

## 6. Test / acceptance criteria

- **Resolver (E1):** area weights sum to 1; same `(defenderId, attackerKey, attempt)` → same area; area roll independent of block roll (distribution test over N attempts); two layers r=.2,.3 → mult .56; uncovered area → 1; quality applied once; per-piece cap respected.
- **Model/save (E2):** v56 save with `body` + `arms` loads into `body:outer` + `shoulders:outer`; `arms` never maps to `forearms`; new-game save → load → identical equipment positions, instance IDs, quality; invalid key rejected; one instance can't occupy two positions; overlay still shows pauldron after reload.
- **Shared rules (E3):** equal kits on player and NPC with equal `(attackerKey, attempt)` give identical `finalDamage`; armor never reduces starvation/dehydration; removing/transferring a piece changes the next hit; existing fauna-combat tests stay green.
- **UI (E4):** for each area, displayed protection equals `1 − mult(area)` from the combat module; preview delta equals post-equip resolver delta; expected value shown labelled as average, not per-hit guarantee.
- **Balance (E5):** documented table of expected protection for reference kits (none, leather body, chainmail body, light full kit, heavy full kit); heavy full kit restriction bound test; existing kinds keep IDs.
- **Acquisition (E6/E7):** each new piece obtainable via ≥1 existing route on a new game; trade transfers the exact instance; no armor minted on failed transfer; guard kits deterministic per seed and persist across save/load and `WorldBundle` rebuild.
- **Manual (author):** fauna fight with/without helmet shows head-hit differences in debug log; Character screen numbers match.

---

## 7. Decisions requiring author approval

| ID | Choice | Recommendation |
|---|---|---|
| D1 | Area model: (A) slot-direct sampled, (B) V3 anatomical blend, (C) expected value only | **A** — real per-hit areas, simplest UI and tests. |
| D2 | Damage types now or later | **Later (E8).** Scalar per piece first; under/outer still differ by value/weight/price. Typed resist kept inert in catalogue. |
| D3 | Balance target for existing kits | **Accept lower average protection for body-only kits** (full kit needed for today's level); vs. inflate body values to keep parity. |
| D4 | Save policy | **v57 forward migration** now; revival-wide rule "old saves best-effort, new games must round-trip", explicit min-version refusal allowed later only with notice. |
| D5 | NPC armor provisioning | **Guards get a deterministic light kit on new games** (e.g. padded_jacket + leather_cap/iron_helm by settlement size); others only via acquisition. |
| D6 | Armor durability/condition | **Defer**; not needed for layers/areas. |
| D7 | Fauna hit-area bias | **Uniform table first**; species/height bias (small animals → legs/feet) as later tuning. |
| D8 | Layer rules | Two layers per slot (under/outer); only slots with authored under-pieces offer under (head/body/legs initially). |
| D9 | First content batch | The 8 comparison candidates + rebalanced 6 existing; **exclude** plate, unique/legendary, shields, nails, NPC-only tools. |

### Contradictions with existing docs (found in this audit)

- `docs/state/combat.md` L21 says `applyIncomingCombatDamage` is the single path for "animal→NPC, NPC→NPC and player→NPC"; code has one caller (fauna, `gameLoop.ts:2982`), `CombatTargetHandle` exists only for animals, and the same doc's L98 says player→NPC damage is not wired. [code]
- `docs/state/combat.md` L58 lists "NPC equipment" as out of scope while L68 documents npc-053 derived NPC armor (stale sentence). [doc]
- `items-player-044` save section (runtime remap, no versioned migration) conflicts with `saveData.ts:isPlayerEquipmentField` key validation and CLAUDE.md's bump rule (§3.3). [code + doc]
- `ui-input-045` locks a no-layer layout; it needs a revision once E2 lands (dependency, not an error). [doc]
- Stage 3 notes say the local donor checkout lacked the pinned commit; at this audit the local V3 HEAD **is** `907e17cd` [measured], so `verify-v3-equipment-source.ts --git-tree` could now be re-run locally.

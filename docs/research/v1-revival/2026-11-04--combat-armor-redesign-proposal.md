# SeedVale V1 Revival — Combat & Armor Redesign Proposal

**Created:** 2026-11-04  
**Status:** technical design proposal for Claude Opus review; not runtime authorization  
**Workflow:** Astra design role → Claude Opus review/corrections/formal plans → Claude Sonnet implementation  
**Scope:** documentation only; no gameplay implementation in this commit.  
**Source baseline:** [V1 `89607ad6f8881aa12b45dc0c9ef2ed220561d065`](https://github.com/jm-sky/seedvale-v1/tree/89607ad6f8881aa12b45dc0c9ef2ed220561d065). Main rechecked at `ec0fa56b7d33393a690603f10bebaf69e4d861d1`: intervening changes concern tools documentation and roads/world caches, not the inspected combat/equipment owners.  
**Evidence:** GitHub source inspection and arithmetic verification. No build, gameplay, browser, asset-skinning or performance verification.

## 1. Recommended design and authority

Implement **seven slots, two layers, one sampled anatomical location per contact, three physical damage types and one pure incoming-human-hit resolver**. Keep V1 inventory ownership, quality, attack lifecycles, physical attributes, medicine, economy and save infrastructure.

The intended gameplay: padding helps against impact; mail favors cuts over blunt force; uncovered legs remain vulnerable despite excellent torso armor; complete kits cost stamina and mobility; NPCs receive protection only from real owned items and pay the same restrictions. Existing weapon reach/cadence, ranged accuracy/reload and injuries already provide depth.

This is a concrete implementation design with initial values and acceptance cases. It does **not** approve the open product decisions in §12. Opus should correct technical defects, prepare formal plans and bind the specified interfaces to then-current code without redesigning the mechanics.

Binding documents:

- [Strategic Brief](./STRATEGIC-BRIEF.md): layers/body protection selected, V1 authority, comparable human protection, current controls, no general player crafting; mechanics/UI may precede appearance. P1 freeze was lifted on 2026-10-30. Master-roadmap D5/D6/D7 remain open.
- [Stage 4 A1–A10](./2026-10-28--equipment-stage-4-approved-author-decisions.md): A6 shoulder/forearm split, padding inventory-only until separately approved layers; A7 shields inventory-only; A8 exceptional/legendary singleton identities; A9 selected future brigandine activation; A10 role-appropriate real goods.
- [Historical equipment/combat audit](./2026-10-27--revival-audit--equipment-armor-combat.md), [Stage 4 proposal](./2026-10-27--equipment-stage-4-implementation-proposal.md).
- [items-player-044](../../plans/items-player-044-shoulder-and-forearm-equipment-slots.md) and its [notes](../../plans/implementation-notes/items-player-044-shoulder-and-forearm-equipment-slots-implementation-notes.md) own slot/accessory work. [ui-input-045](../../plans/ui-input-045-equipment-body-layout.md) owns the approved **unlayered** body layout. Neither is silently expanded or marked done here.
- [Planning guide](../../plans/PLANNING.md), [plan index](../../plans/README.md), [metadata](../../plans/PLAN-METADATA.md), [CLAUDE.md](../../../CLAUDE.md), CODE_INDEX and relevant STATE sections were consulted. This research reserves no plan IDs.

**Excluded:** permission to attack inhabitants, NPC wars/bandits, per-limb HP, bleeding/fractures, new skill trees, armor durability, shield/offhand mechanics, active parry/dodge, universal crafting, wholesale donor activation, global shopping AI, new offscreen combat encounters and mesh/bone hit detection.

## 2. Verified V1 baseline and corrections

Paths are relative to the repository root; named symbols are the source evidence anchors.

| Owner | Current behavior | Design consequence |
|---|---|---|
| `src/items/equipment.ts` | Six slots head/body/arms/hands/legs/feet; inventory-owned instance references; `composeEquipmentModifiers` multiplies every piece's protection globally | Preserve ownership, replace global physical mitigation |
| `itemInstances.ts`, `itemCatalog.ts` | Six armor kinds: leather body, mail body, four pauldrons; no layers or typed resistance | Nine initial additions are new runtime admissions |
| `armorItemInstances.ts` | Quality protection ×.85/1/1.1/1.2; mass ×1.2/1/.9/.8; penalty strength 1.35/1/.75/.5; protection cap .85 | Keep rules, apply protection scale per channel |
| `player/playerDamage.ts`, `ai/npcCombat.ts` | Directional held-item defense → global armor → owner-specific HP/injury | Share pure resolution, retain owner effects |
| `combat/defenseResolver.ts` | Automatic block roll with front dot ≥.2; full/partial outcomes | Preserve controls; “active defense” is not a new button |
| `ai/npcCombat.ts` | Derived best armor per slot; defense picks first block-capable carried kind, not ready weapon | Fix bag-weapon defense; derive layers |
| `ai/npcLoadout.ts` | First-authoritative-creation weapons; guards sword plus 40% crossbow; shepherds may get sling; no armor grants | Add ordinary kits only at genuine creation |
| `ai/NpcAgent.ts` | Attack stamina/recovery exists; no armor restrictions; defense attempt runtime-local | Apply shared restrictions and durable incoming ordinal |
| `app/gameLoop.ts`, `fauna/AnimalAgent.ts`, `createFauna.ts` | Fauna→human incoming damage; both human paths pass generic attacker key `fauna`; player callback lacks animal ID | Forward stable source identity/species |
| `player/playerCombat.ts`, `combat/combatIntent.ts`, `fauna/faunaCombat.ts` | NPCs appear in target acquisition, but inspected live outgoing damage is animal-targeted | Acquisition is not permission or proof of human combat |
| `itemCatalog.ts`, `player/playerRanged.ts` | Crossbow and sling already active; crossbow reload 2.5 s; player bow release-gated | Preserve current ranged mechanics |
| `items/weaponMaintenance.ts`, `npcCombat.ts` | Player exact-instance sharpness; NPC melee returns kind/config and catalog damage | Close condition/instance parity in bounded slice |
| `shared/injurySeverity.ts`, `injuryRecovery.ts` | Scalar physical injury, serious ≥25% max HP, critical ≥55%; existing treatment/attribute effects | No second wound budget |
| `persistence/saveData.ts` | **Version 57**, real migrations, separate worldgen epoch refusal; strict equipment keys | v56 audit stale; migrate before validation |
| `equipmentPreview.ts`, `characterPresentation.ts`, `EquipmentPanel.vue` | Global reduction and flat grid at pin | Replace protection claims and extend UI |
| `settlement/merchantTrade.ts`, `householdProfessionStock.ts`, `artisanOrders.ts`, `economy/production.ts` | Finite real stock, custom orders, quality, separate ownership | Extend admission and real acquisition, not just labels |
| `ai/npcTradeAvailability.ts`, `settlement/npcPostDeath.ts` | Household positive allowlist; personal armor not saleable; full personal inventory corpse handoff | Retain personal protection reserve and exact loot IDs |
| `items/v3Equipment/*` | Immutable donor records and inactive projection policy | Author V1 rows; never use donor values as live authority |

Important discrepancies:

1. 044's runtime-only legacy remap is too late for strict save validation. Use the existing versioned migration chain, not another migration manager.
2. Historical **v37→v38 iterates current EQUIPMENT_SLOTS**. Freeze its historical six-slot interpretation before changing the union, or old saves can lose arms before reaching the new migration.
3. 044 notes claim public bracer GLBs exist. The inspected tree lacks both public runtime paths; it contains `docs/blender/sources/male_steel_bracers.glb` (~27 MB). This establishes existence only, not valid skinning. Do not promise ready runtime visuals or overwrite user-authored sources.
4. Runtime defense counters reset on reconstruction. A deterministic hash alone does not preserve sequence continuity.
5. A7 remains binding. No shield DefenseConfig or offhand slot.
6. Real padding activation needs approval of this separate successor layer project; linking this proposal does not change A6.
7. NPC damage-hook comments describe wider potential than the actual fauna caller. No human target activation is implied.

**Donor evidence boundary:** V1-local V3 catalog rows for padding, helmet, bracers, gloves, trousers, boots and brigandine were inspected directly; preserve all 87 records and provenance pin `907e17cd...`. V2 live stacking and V3 loadout-library behavior are referenced through the historical audit, not freshly verified donor repositories. Borrow useful slot/layer/resistance concepts; reject V2 full shoulder+forearm+hand stacking on one arm hit and order-dependent shared RNG. No donor engine transplant.

## 3. Equipment state and compatibility

### 3.1 Slots and coverage

Use `head | body | shoulders | forearms | hands | legs | feet`. Old arms becomes shoulders; donor torso maps to V1 body during authoring. One slot represents both sides: glove/bracer pairs and a pauldron assembly. No neck, wrist, belt, cloak, ring, back or separate left/right slots now.

Coverage is exclusive: body = torso/abdomen; shoulders = shoulder/upper-arm region; forearms = lower arms. A visually sleeved mail outfit does not silently protect other slots. Details must disclose this gameplay abstraction. Multi-region pieces require a later reviewed coverage/exclusion contract.

### 3.2 Proposed TypeScript contracts

Add dependency-light `src/items/equipmentTypes.ts` for shared slot/layer constants, avoiding catalog/equipment runtime cycles. Existing equipment.ts can re-export types. Damage primitives live in new `src/combat/damageTypes.ts`.

```ts
type EquipmentSlot =
  | 'head' | 'body' | 'shoulders' | 'forearms'
  | 'hands' | 'legs' | 'feet'
type ArmorLayer = 'under' | 'outer'
type EquipmentPositionKey = `${EquipmentSlot}:${ArmorLayer}`
type SavePlayerEquipment = Partial<Record<EquipmentPositionKey, string>>
type DamageType = 'cut' | 'pierce' | 'blunt'
type Resistance = Readonly<Record<DamageType, number>>

type ArmorConfig = {
  slot: EquipmentSlot
  layer: ArmorLayer
  resist: Resistance
  staminaCostMultiplier?: number
  meleeRecoveryMultiplier?: number
  movementSpeedMultiplier?: number
  sprintStaminaMultiplier?: number
}
type EffectiveArmorPiece = {
  instanceId: string
  slot: EquipmentSlot
  layer: ArmorLayer
  resist: Resistance
  weightKg: number
  staminaCostMultiplier: number
  meleeRecoveryMultiplier: number
  movementSpeedMultiplier: number
  sprintStaminaMultiplier: number
}
type EquipResult =
  | { ok: true; position: EquipmentPositionKey; replacedId: string | null }
  | { ok: false; reason: 'not-owned' | 'not-wearable' | 'invalid-position' }
```

These are proposed contracts, not existing symbols. ArmorItemInstance remains id/kind/quality. Save no catalog stats. EquipmentState remains references only: explicit getPosition/unequip(position), equip(instanceId, inventory) infers position. Avoid default-layer arguments hiding old consumers. equippedBodyArmor selects outer body, with under fallback only where supported by presentation.

Rules:

- All seven slots understand both layers; initial under items exist for head/body/legs only.
- One item per position; under+outer compatible. Every initial under item fits every outer item in its slot. No invented body-size/sex/profession/attribute locks.
- Outer works without padding; padding works alone. No hidden prerequisite.
- Same-position equip replaces only that reference; displaced item remains owned, with no transfer or weight change.
- Catalog fixes position: mail cannot go under plate; two outer pieces cannot stack.
- One instance cannot occupy two positions. Restore in canonical slot order, under then outer; discard invalid references without discarding items.
- Command and preview share position validation. Revalidate ownership at command commit.
- Sell/drop/transfer makes an instance immediately ineffective; live validation and normal sync remove stale references.
- Preview uses immutable instance/reference snapshots, never a second Inventory. Inert/inventory-only donor metadata is never equip permission.

**Acceptance:** two layers coexist; exact-position replacement; duplicate/stale/wrong-kind cases; equip never changes quantity/mass; pauldron IDs/quality survive rename; failed commands make no mutation.

## 4. Anatomical damage algorithm

### 4.1 Location profiles

Seven HitLocation values equal the slots. Existing XZ melee/projectile collision decides contact; then one location is sampled. This is not aimed anatomy, a mesh collision, per-limb HP or a headshot bonus.

Integer percentage weights:

| Profile | Head | Body | Shoulders | Forearms | Hands | Legs | Feet |
|---|---:|---:|---:|---:|---:|---:|---:|
| reference | 12 | 35 | 10 | 8 | 5 | 20 | 10 |
| low-bite | 2 | 25 | 8 | 10 | 5 | 35 | 15 |
| large-maul | 8 | 40 | 10 | 12 | 5 | 20 | 5 |
| fall | 10 | 30 | 0 | 0 | 0 | 60 | 0 |

Wolf/dog/fox and other small biting human attackers: low-bite/pierce. Bear: large-maul/cut, matching its current generic maul without new attack selection. Test an explicit mapping over every species capable of reaching the human-damage callback; no model-height inference. Future kick/ram = blunt, gore = pierce, without enabling new behavior.

Container blade trap: forced hands/cut, unblockable. Mount fall: fall/blunt, unblockable. Retain a physical armor interaction for falls instead of silently making all armor useless; this policy belongs in the balance approval. Starvation/dehydration/nonphysical damage bypass armor and location entirely.

### 4.2 Exact formula

```text
pieceR(type) = clamp(baseResist[type] * qualityProtectionScale, 0, .85)
pass(location,type) = (1 - underR) * (1 - outerR)
locationR = 1 - pass

postDefense = existing directional resolveDefense(rawDamage, readyWeapon, skill, ...)
finalDamage = postDefense * pass(location,type)
actualHpLoss = min(currentHp, finalDamage)
```

Missing layer = zero resistance. No additional global armor multiplier, coverage multiplier on actual hits, flat subtraction, penetration stat, minimum damage floor or conversion to blunt trauma. Float damage persists to HP; round only in UI. Existing attacker critical multiplier applies once upstream; no additional location multiplier.

Raw melee damage = existing catalog × sharpness × Strength × critical. Ranged = existing catalog+ammo bonus, then critical. Do not apply attacker modifiers again at the human target.

Expected UI protection is separate: `sum(locationWeight * locationR) / 100`, calculated for each damage channel/profile, before active defense. Never feed this expected value back into hit damage or collapse all channels into one unlabelled number.

Exact common-quality fixtures, no block:

- 20 cut at leather body .35 → **13 HP**; uncovered head → **20 HP**.
- 20 pierce at mail .45 + padding .10 → **9.9 HP**.
- 20 blunt at mail .15 + padding .25 → **12.75 HP**.
- Partial block .55 followed by mail+padding pierce → **4.455 HP**.
- Full block → 0 HP and physical injury.
- Mail-only reference pierce expected reduction = .35×.45 = **15.75%**, not old 32% global reduction. This change needs D6 approval.

### 4.3 Shared resolver and effects

New pure `combat/incomingHumanHit.ts`, `combat/hitLocation.ts`; no Three.js, Inventory or actor imports.

```ts
type PhysicalHit = {
  amount: number
  damageType: DamageType
  source: 'melee' | 'projectile' | 'fauna' | 'trap' | 'fall'
  attackerId: string
  profile: 'reference' | 'low-bite' | 'large-maul' | 'fall'
  forcedLocation?: EquipmentSlot
  blockable: boolean
}
type HumanHitContext = {
  defenderId: string
  incomingOrdinal: number
  defense: DefenseConfig | null
  defenseSkill: number
  inArc: boolean
  protection: Readonly<Record<EquipmentSlot, Resistance>>
}
type HumanHitResult = {
  outcome: DefenseOutcome
  attempted: boolean
  location: EquipmentSlot | null
  damageType: DamageType
  rawDamage: number
  postDefenseDamage: number
  armorPrevented: number
  finalDamage: number
}
function resolveIncomingHumanHit(hit: PhysicalHit, ctx: HumanHitContext): HumanHitResult
```

Target owner rejects nonfinite/negative inputs and dead/downed hits before reserving ordinal; zero does nothing. Valid positive contact reserves ordinal once; defense runs only if blockable/in arc. Full block returns null location, zero armorPrevented. Otherwise choose forced/sampled location and apply local resistance.

PlayerDamage and NpcAgent incoming wrappers call the same resolver but retain HP, injury, XP, downed/death, blood, sounds, threat/quest effects. Use a discriminated wrapper input for physical vs nonphysical damage; no bypass inferred from accidentally omitted modifiers.

Extend combat-only CombatTargetHandle.applyDamage to accept typed hit data; fauna adapter consumes amount and retains animal HP/death behavior. Keep noncombat takeDamage(number) with health owners. This metadata change must not introduce new human targets.

### 4.4 Deterministic state

Use V1 integer-hash style on framed fields, e.g. JSON.stringify([salt,defenderId,attackerId,ordinal]), distinct salt `armor-location-v1`. Convert unsigned hash /2^32, multiply by 100, select first cumulative boundary greater than roll. Block and location must be independently salted.

Persist one safe nonnegative integer incomingPhysicalHitOrdinal per human, not a global stream: player save/controller seam and NpcAuthoritativeState/snapshot. Increment once per accepted positive physical contact, including full block; never for misses, previews, deprivation, invalid/dead/downed contacts. Replace old private defenseAttempt rather than keeping two counters. Migration defaults 0; reconstruction resumes durable state.

Forward actual animal ID/species through AnimalAgent/createFauna and all settlement fauna callbacks; replace shared `fauna` attacker key. Environmental attacker identity uses stable trap/container ID or explicit mount-fall source ID.

Same ordered valid inputs + same durable state must yield the same outcome. This does not guarantee whole-world replay, persistence of mid-swing timers, or order independence for simultaneous hits on one defender. Keep existing chronology; no new offscreen attacks. Optional bounded cleanup in the same lifecycle slice: replace downed recovery Math.random with separately salted downing ordinal, preserving 1–5 recovery HP and 5 s duration; unrelated random systems remain outside scope.

**Acceptance:** formulas above, salted golden vectors, profile sums/boundaries, no cross-slot protection, equal player/NPC inputs equal outcomes, next result survives save/reification; lifecycle tests at 30/60/120 Hz produce one hit per attack edge.

## 5. Armor content and balancing

### 5.1 First batch and authored values

Keep six existing kinds; add **nine**: eight ordinary donor candidates plus V1 steel_bracers from 044. Total 15; brigandine is the specified follow-up (16). A9 selected brigandine, but did not waive mechanics/admission review.

Numbers are proposed **V1 common-quality baselines**, not currently active donor stats. Preserve existing six IDs, masses and prices.

| Kind | Position | Cut | Pierce | Blunt | New mass kg | Base coins | Restrictions profile |
|---|---|---:|---:|---:|---:|---:|---|
| leather_armor | body:outer | .35 | .22 | .18 | existing | 65 existing | leather-body |
| chainmail | body:outer | .65 | .45 | .15 | existing | 150 existing | mail-body |
| leather_pauldron | shoulders:outer | .25 | .15 | .12 | existing | 25 existing | light |
| ranger_pauldron | shoulders:outer | .35 | .22 | .16 | existing | 40 existing | ranger |
| knight_pauldron_spike | shoulders:outer | .60 | .42 | .25 | existing | 70 existing | metal-small |
| knight_pauldron_round | shoulders:outer | .65 | .45 | .30 | existing | 85 existing | metal-small |
| padded_cap | head:under | .15 | .05 | .20 | .3 | 8 | light |
| padded_jacket | body:under | .20 | .10 | .25 | 3 | 30 | padding-body |
| padded_hose | legs:under | .15 | .05 | .20 | 1.4 | 18 | padding-legs |
| iron_helm | head:outer | .65 | .45 | .25 | 2.2 | 80 | helmet |
| leather_bracers | forearms:outer | .35 | .20 | .10 | .5 | 20 | light |
| steel_bracers | forearms:outer | .55 | .38 | .22 | 1 | 45 | metal-small |
| leather_gloves | hands:outer | .20 | .10 | .10 | .3 | 10 | light |
| leather_trousers | legs:outer | .25 | .10 | .10 | 1.8 | 22 | leather-legs |
| leather_boots | feet:outer | .20 | .10 | .10 | 1.2 | 18 | light |
| brigandine, follow-up | body:outer | .60 | .50 | .30 | 11 | 260 | brigandine-body |

Steel_bracers is V1-authored, not a silent alias of donor iron_vambraces/plate_vambraces. Keep donor records intact/inactive. Boots give no imported negative-speed-penalty movement buff. Spikes give no retaliation damage.

Profiles author ordinary catalog fields; no profile manager. Order below: melee stamina / melee recovery / movement / sprint stamina.

| Profile | Multipliers |
|---|---|
| light | 1 / 1 / 1 / 1 |
| ranger | 1.02 / 1.02 / 1 / 1.04 |
| leather-body | 1.08 / 1.06 / .97 / 1.12 |
| mail-body | 1.20 / 1.15 / .94 / 1.25 |
| padding-body | 1.04 / 1.03 / .99 / 1.05 |
| padding-legs | 1.01 / 1.01 / .99 / 1.03 |
| helmet | 1.02 / 1.01 / .99 / 1.03 |
| metal-small | 1.03 / 1.02 / .995 / 1.04 |
| leather-legs | 1.01 / 1.01 / .99 / 1.03 |
| brigandine-body | 1.25 / 1.18 / .92 / 1.30 |

Mail costs decrease from current 1.28/1.22/.90/1.40 because real padding/limb pieces now add costs. Do not pile a complete kit onto old torso-only penalties.

### 5.2 Quality, restrictions and mass

Keep poor/common/good/masterwork manufacturing qualities, distinct from rarity. Apply existing protection scales and .85 piece cap per channel; penalty adjustment stays `1 + (base-1)*penaltyStrength`; mass goes through effectiveInstanceWeight once.

Multiply quality-adjusted piece restrictions, then clamp armor-only totals:

- melee stamina [1,1.80];
- melee recovery [1,1.50];
- movement [.75,1];
- sprint stamina [1,2.00].

Existing encumbrance/injury/attributes still compose separately afterward. Armor floor must not cancel those penalties. Equipped items stay in Inventory weight; no double count or worn-weight removal.

Ranged stamina multiplier = `1 + .5*(meleeStaminaMultiplier-1)`; use for player and NPC draw cost. Keep draw/reload times and accuracy unchanged. Display ranged exertion separately; do not silently apply melee recovery to bows.

Reference full mail kit: mail, ranger shoulders, leather bracers/gloves/trousers/boots, iron helm, all three padded under-pieces. At common quality it gives approximately **×1.3245 melee stamina, ×1.2448 recovery, ×.9030 movement, ×1.4916 sprint drain, ×1.1623 ranged stamina**.

Its reference expected armor protection is **50.18% cut / 31.605% pierce / 26.9875% blunt**. Low-bite expected values are **42.3925/24.415/23.9425%**. Local mail+padding torso is 72/50.5/36.25%. These arithmetic values were checked independently from the tables; future tests should compute from catalog and assert them.

### 5.3 Balance acceptance

Torso-only users intentionally lose global coverage. Do not hide this with HP multiplication, free equipment or near-immunity torso resistance. Lower costs, make inexpensive padding/legwear available, and obtain D6 acceptance.

Use 20 raw damage/no block/crit and 100 HP as test fixtures, not new global HP rules. Compare naked, leather-only, mail-only, padding-only, full leather, full mail and brigandine; all qualities, three channels and profiles. Report expected damage, local extrema, mass, attack costs and controlled-encounter hits-to-down. HP/expected damage is not exact discrete TTK.

Acceptance: no immunity; higher quality of the same item never worsens protection/costs; low-bite legwear is useful; padding supplies substantial blunt protection; brigandine improves pierce/blunt relative to mail at higher cost/mass but is not superior in every stat. Playtest tuning may change numbers, not secretly change formulas/coverage.

## 6. Combat, attributes and injuries

### 6.1 Preserve useful existing mechanics

Keep meleeAttack/playerMelee, range/arc, windup/hit/recovery, target acquisition, single hit edge and current controls. Initial integration leaves base damage/timing unchanged so armor can be evaluated independently.

Current anchors: knife 12 damage/1.6 range/4 stamina; short sword 18/2.1/7; long sword 28/2.6/12; spear 20/3/9; axe 20/2/10. Existing niches are sufficient without attack stances or combo trees.

Add required damageType to MeleeConfig and typed ranged/throwable payload authoring:

| Existing items/attacks | Type |
|---|---|
| knife, dagger, damascus_knife | pierce |
| spear, pitchfork | pierce |
| short/long swords, damascus swords, masterwork_sword, obsidian_sword | cut |
| hatchet, axe, battle_axe, sickle, shears | cut |
| shovel | blunt |
| arrow, war_arrow, bolt | pierce |
| broadhead_arrow | cut |
| sling stone and improvised stone throw | blunt |

Test all active melee/ranged/throwable configurations for explicit classification; new untagged configs fail tests. These are dominant attack types, not multiple stances. Preserve arrow +0 (A1), broadhead +4, war +8.

Future Stage 4: mace blunt, halberd cut, bolt_blunt blunt, bolt_heavy pierce, sling_stone blunt/slings-only. Do not activate these as prerequisites. Existing stone retains resource/throw/sling semantics; crossbow bolts never enter bows. Broader weapon admission stays in its owner.

### 6.2 Exact-instance NPC weapon parity

Extend NpcMeleeWeapon with instanceId:string|null. For maintenance-backed kinds, consider owned instances using condition-adjusted damage/cycle, existing role-family factor and ties by kind/ID. Count-backed tools retain null ID. Reuse sharpness curve and applySharpnessWear on the exact used instance, once per actual hit.

Revalidate at attack start; snapshot chosen config/identity. If removed before impact, cancel rather than strike with phantom gear; apply same held-instance rule to player. Preserve actual sharpness/condition across transfer/save. No weapon quality multiplier invented from armor quality, and no rarity inferred from an ID prefix.

### 6.3 Attributes and skills

Keep shared formulas and existing owners:

- Strength: .7 + .6*resolvedStrength; .5 neutral.
- Agility: recovery = baseRecovery*(1.2-.4*clamp01(agility))*armorRecovery; snapshot at start.
- Endurance: existing stamina/maxima; no additional damage resistance.
- Perception: existing consumers; no hidden armor penetration or headshot chance.
- Player defense skill: current up-to-.30 full-block bonus, up-to-.20 partial-effect bonus and caps.
- Player archery: existing accuracy and weapon skillAccuracyScale; keep weaker crossbow and zero sling scaling.
- NPC defense/archery input remains 0 where no existing progression exists. Shared rules do not require fabricated player-equivalent training.

No new melee/armor skill. XP only on existing successful actions, never on armor absorption, preview, misses or deprivation. Existing injury/medicine penalties remain.

### 6.4 Blocking and stamina

Keep existing probabilistic full/partial directional defense and arc .2. Fix NPC defense source:

- melee mode: validated selected melee weapon;
- ranged draw/recovery/reload: only that ranged weapon's defense (currently none), not bag sword;
- accepted close-range switch: ready melee weapon follows current mode transition;
- outside combat: normal validated melee selection is the defensive default for surprise contact;
- player: actual HeldTool/instance, not primary preference or inventory.

No new guard meter, block stamina charge, stagger or parry timing. Attack checks full armor-adjusted cost before start and pays once; no negative stamina. NPC combat-idle regeneration remains so heavy kits cannot softlock exhausted actors. Assess crossbow guard vulnerability rather than compensating with hidden skill buffs.

### 6.5 Ranged and projectile correctness

Keep player press/release, shared rangedLifecycle, crossbow reload/close-threat switch, exact ammo owner and miss recovery. Snapshot damageType on Projectile at fire time with damage/crit/ammo; later gear swaps cannot change a projectile. Synthetic thrown configs carry type too.

Inspected sweptProjectileHit chooses closest perpendicular distance and input-order ties. Correct to **earliest segment-circle intersection t**, then lexical stable ID. Solve quadratic, choose earliest root within [0,1], start-inside means t=0, zero-length checks containment, dead candidates excluded. Preserve radius .6 and cave/surface filters. A farther centered target must not win over a nearer intersection. This is bounded correctness, not new 3D ballistics or mesh collision.

Test tool switch/cancel/rebuild: no free shot, duplicate consumption, recovery after a successful hit, or changed ammo identity. Existing nonrefund of spent draw stamina remains. Typed metadata does not enable human targets.

### 6.6 Injuries and effects

Register actual HP lost after defense/armor with existing injury owner. Overkill cannot add more physical injury than HP loss; deprivation still adds none. Keep player downed vs NPC death, treatment gates and recovery.

Hit location is transient feedback, not a persisted wound diagnosis. Head contact does not imply concussion; legs do not add a second slowdown on top of existing injury effects. This avoids a parallel medical system.

Acceptance: naked baseline unchanged except explicit source/sequence and projectile-order fixes; condition/wear exact; equivalent player/NPC costs/resolution equal; no new target permissions; HP/injury/XP/wear/kill callbacks once only.

## 7. NPC equipment and world continuity

### 7.1 Derived loadout, not duplicate persistent state

Retain resolveNpcArmorEquipment(personalInventory), extending to slot/layer. Never wear household stock, merchant stock, work carried inventory or transport cargo.

Choose each position independently: score=.30*cut+.45*pierce+.25*blunt after quality; ties lower mass, lexical kind, lexical ID. Compatibility is uniform and coverage disjoint, so no combinatorial optimizer. Static weights favor common bite threats without camera/player conditions.

Receipt/removal immediately changes derived kit. Keep personal armor outside current personal-trade allowlist; explicitly add new kinds only to household sale policy. Corpse loot uses actual personal instances, not reconstructed role gear. Do not need a persisted NPC EquipmentState.

### 7.2 Concrete guard loadouts

Extend seedInitialPersonalBelongingsIfNeeded with a plain settlement-size/world-seed context supplied by creation/composition owners. No global world lookup from npcLoadout. Existing weapon salts/probabilities remain unchanged. New kit choices use independent salted stable hashes.

Initial armor IDs: deterministic namespace `npc-start-armor-v1:<npcId>:<position>`. No timestamp IDs or reissuance on appearance reconstruction.

| Size | Base kit | Outer torso | Extra pieces |
|---|---|---|---|
| OUTPOST/SM | padded cap/jacket/hose, leather boots | leather_armor | none |
| MD | same | 70% leather / 30% chainmail | leather_bracers; 50% iron_helm |
| LG/XL | same | chainmail | iron_helm, leather_bracers/gloves/trousers; 50% ranger_pauldron |

Independent stable draws except exclusive torso choice. Guard quality: OUTPOST/SM 40% poor/60% common; MD 15/75/10 poor/common/good; LG/XL 70% common/30% good. No starting Masterwork or exceptional/legendary armor. These kit weights do not replace merchant quality pools.

Grant only at genuine first authoritative-state creation, before clearing existing latch. Preflight capacity and add through Inventory APIs. If kit cannot fit alongside existing belongings, remove optional pieces in reverse table order, then outer torso, then hose; never delete weapons/food to force armor. Truncation is diagnostic, not a retry-on-stream-in trigger. Test that expected guard fixtures fit.

**Restored NPCs receive no free retroactive kits.** Current saves preserve property; gifts/transfers work normally. C3/D7 must approve this policy. First batch adds no civilian/hunter automatic armor; recipients still wear valid transferred pieces. No shopping AI, merchant-stock-as-clothing or blacksmith personal copy.

### 7.3 Restrictions and offscreen consistency

Same derived kit drives protection, melee cost/recovery, ranged cost, movement and sprint drain. Wire NpcAgent.steerTo and flee-run drain; do not multiply all profession work by armor attack costs.

Extend estimateOffscreenTravelDays with optional movementMultiplier=1: duration=existing estimate/multiplier. Pass through beginOffscreenNpcTravel and both generic/legacy transport handoff families. The inspected legacy transport handoff is in src/settlement/SettlementsManager.ts (estimateOffscreenTravelDays before beginOffscreenExecution); update it as well as the generic NPC travel callers. Existing arrivesAtDays snapshots duration; no second clock or per-frame rescheduling. Existing saved journeys keep captured ETA. A permitted gear mutation mid-travel checkpoints current position/survival then recomputes remaining travel once; never scale an already-scaled duration twice.

No new armor walking drain; existing offscreen walking-fatigue rule remains. Sprint penalty applies to actual detailed run/flee. No unseen attacks, gear regeneration or extra unloaded-world simulation. npcTravelCheckpoint/npcOffscreenSurvival and authoritative personalInventory retain ownership.

Acceptance: deterministic loadout independent of inventory order; gift/removal affects next hit; trade does not strip guard; corpse transfer/save/rebuild preserve IDs once; no reseed; movement applied once detailed/offscreen; no player-nearby condition or world scan.

## 8. Acquisition and progression

### 8.1 Ordinary sources

Coordinate ItemKind/ITEM_DEFS, ArmorKind/list, ITEM_CATALOG, instance parsers, trade price/eligibility, stock, recipes and UI. A price alone is not availability. Review Stage 4 admission policy but preserve all donor source metadata.

| Items | Source | Initial finite stock |
|---|---|---|
| padded cap/jacket/hose | general merchant, textile-worker household starter goods | one each per eligible textile household, common; merchant within existing budget |
| leather bracers/gloves/boots/trousers | hunter specialist stock, general merchant | one bracers+boots per hunter stock; gloves/trousers MD+ |
| iron_helm, steel_bracers | blacksmith household, custom orders | one bracers; helm MD+ or armor specialization |
| Existing six | preserve current sources | preserve poor starter leather pauldron |
| brigandine follow-up | armor-specialist order; LG/XL armor-biased stock | max one starter piece, stable 25% chance; no universal listing |

Extend merchant regional/material/premium sets: padding/gloves/boots basic, helm/steel bracers premium metal. Keep assortment capacity and existing guarantees; do not append every item to every trader. Ordinary quality uses settlementArmorQuality; smith output uses existing artisan quality. Textile padding initially common without invented textile skill profiles.

### 8.2 Concrete artisan recipes

Reuse ProductionDef, real inputs, deposit, specialization/skill, order completion and pickup.

| Output | Iron | Coal | Difficulty | Min skill | Specialization / exclusive |
|---|---:|---:|---:|---:|---|
| steel_bracers | 1 | 1 | 35 | 28 | armor / false |
| iron_helm | 2 | 1 | 45 | 38 | armor / false |
| brigandine | 5 | 2 | 75 | 68 | armor / true |

Brigandine also consumes 2 linen_material through existing itemInputs. Existing chainmail 4 iron/2 coal, difficulty70/min62 remains. Each output is one instance; stable completion event fixes quality once. Register in actual orderable recipes. Full pickup inventory retains reserved output/order; no loss/duplicate on retry.

First-batch leather/padding is finite stock, **not a claim of recurring domestic manufacture**. Renewable textile/leather recipes are separate reviewed supply work; no general crafting UI is necessary. Prices use current quality value .55/1/1.30/1.85 and existing merchant/social rounding/payment. Material deposit does not replace existing fee handling.

### 8.3 Loot, rewards and uniqueness

Initial armor loot comes from existing NPC corpse ownership transfer; do not enable/encourage inhabitant attacks or inject gear into all treasure tables. No new quest reward is fabricated. Later curated cache/reward additions must use their existing issuance owner once across reopen/reload and need a named quest/content owner.

All initial pieces are repeatable ordinary kinds; Masterwork manufacturing quality is not globally unique. A8 exceptional/legendary one-live-instance-per-identity remains binding. This project introduces none; future rare armor stays blocked on Stage 4's reviewed issuance/transfer/persistence solution. Scarce merchant probability is not singleton enforcement.

Acceptance: every admitted kind has a tested normal source; stock/money/IDs conserved; blocked trade/pickup atomic; no refill on reconstruction; no unsupported crafting controls; ordinary tables contain no singleton equipment.

## 9. UI, feedback and appearance

### 9.1 Anatomical layout

Use 045's approved body order. Its unlayered polish can ship independently; layered UI requires a successor plan, not silent scope expansion.

Desktop: head top; shoulders/body/held next; forearms/legs/shield-N/A next; hands/feet bottom. Each armor cell contains explicit Under/Outer rows with item, quality, details and remove for that exact position. No-content rows can say “No compatible items yet”. Narrow/keyboard order follows anatomy, under then outer. Keep primary melee/ranged choices, held weapon, AmmoSection and summary distinct. Shield remains disabled N/A.

EquipmentSlotView, command payloads and comparison highlighting become position-aware. Use shared components in isolated inventory demo; demo callbacks are not gameplay evidence.

### 9.2 Truthful statistics

Item details: local cut/pierce/blunt resistance, named coverage, layer, quality-adjusted mass and restrictions. “35% cut resistance — torso only”, never “35% damage reduction” without qualification.

Loadout summary:

1. Three expected protection channels under explicitly labelled Reference profile.
2. Optional UI-only profile choice Reference/Low bite/Large maul.
3. Expandable seven-region × three-channel values.
4. Melee/ranged stamina, melee recovery, movement/sprint effects and gear mass.
5. Actual carried weight separately; equipping does not remove weight.

Do not mix probabilistic block into armor summary. Held-weapon block chance/effect/facing context remains separate. Preview composes exact-position replacement with both layers using the combat derivation; shows displaced item and channel/restriction/mass deltas. Live and snapshot routes must agree. Stale candidate means unavailable with reason; no Vue-only protection math.

Affected existing owners: `src/items/equipmentPreview.ts`, `src/player/characterPresentation.ts`, `src/items/inventoryView.ts`, `src/app/inventoryWiring.ts`, `src/ui-vue/components/items/equipmentPanelTypes.ts`, `EquipmentPanel.vue`, `LoadoutSummary.vue`, `InventoryItemDetails.vue`, `inventoryPresentation.ts`, `collectArmorPreviewInstances.ts`; inventory/character screens and demo fixtures. 045's equipmentLayout/EquipmentSlotCell files are proposed, not present at baseline.

### 9.3 Combat feedback

Use committed HumanHitResult, never reroll. Distinguish full/partial block, armor prevented damage and HP loss. Optional compact player detail: “Legs · pierce · 10 HP lost · armor prevented 4”. Last player hit is sufficient; no per-NPC toast storm. Debug trace may keep a bounded 32-event ring.

No blood/hurt impact on full block. Keep NPC death and quest/social consequences with current owners, once after HP application. No new spoken NPC lines required.

### 9.4 Visual boundary

Preserve existing body preset and pauldrons through rename. The inspected createApp.ts syncArmsEquipmentVisual directly reads and applies 'arms'; rename that binding together with the slot contract, not in a later visual release. playerVisualPreset/playerEquipmentVisual/PlayerController and createApp synchronization must explicitly choose outer body and shoulders. Unsupported under-only/new pieces can remain mechanically active without new appearance, as already allowed, with truthful limitation.

Do not load large Blender source files as runtime fallback. Bracer/helmet/glove/leg visuals need actual skin, JOINTS_0/WEIGHTS_0, skeleton compatibility, all skinned nodes supported, no second mixer, bounds/picking/shadows/animation checks and existing asset budgets. Do not overwrite authored sources. NPC modular visuals are later D11/material-governed work reading the same derived kit, never granting protection from costume.

Acceptance: item/details/preview/character values match formulas; exact layer controls and keyboard/narrow flow; no clickable shield or leftover global armor claim; trade removal clears protection and available visual; renderer rebuilding cannot change identity/stats.

## 10. Persistence, architecture and performance

### 10.1 Schema migration

CURRENT_SAVE_VERSION is 57 at baseline. Use N→N+1 at implementation time, not a reserved 58. One release migration can add layered player references and incoming ordinals together. If 044 ships independently first, it needs its own real migration; later layers must accept that shipped intermediate shape.

```ts
playerEquipment?: Partial<Record<EquipmentPositionKey, string>>
playerIncomingPhysicalHitOrdinal?: number
// persisted npcStates[id], NpcStateSnapshot:
incomingPhysicalHitOrdinal?: number
```

Runtime normalizes absent counters to 0 and saves current values. Provided counters must be safe nonnegative integers, not NaN/fractions/overflow. Armor instances remain id/kind/quality.

Migration algorithm:

1. Read object-shaped legacy equipment; preserve unrelated save fields and worldgenEpoch.
2. head/body/hands/legs/feet → respective :outer; arms → shoulders:outer.
3. Valid explicit layered position wins; valid shipped intermediate shoulders wins over arms. If explicit shoulder reference is invalid, accept valid legacy arms. Validate against already migrated **player** instance rows, never another owner or new item.
4. Wrong-position/non-owned refs become empty, items remain. Duplicate refs use canonical order, under then outer. Existing historical body-kind conversion remains in its owning migration.
5. Initialize only absent counters; never reset stored counters.
6. Emit new keys only; run current schema validation then existing epoch check.
7. Persist only via ordinary later successful save, as loadStoredSave already does.

Freeze six-slot constants in historical v37→v38 and audit all old migration uses of current equipment arrays. Test through loadStoredSave, not just createEquipmentState. Unknown current keys/invalid structural values remain errors; semantic stale refs can resolve empty. Do not “repair” arbitrary corrupt saves into accepted state.

Plumbing: player next-attempt seam restores/exports via createApp/saveState; NPC counter moves from private NpcAgent field to NpcAuthoritativeState, snapshot clone/restore/export and saveData validator. Caches/UI profile/last-hit log remain transient. No WORLDGEN_EPOCH bump: no geography/entity identity changes, no restored-state gear regeneration.

New kind/quality parsing must work in player, NPC, household/merchant, drops, containers/carried containers and artisan output through existing instance serialization. Future-version and epoch refusal remain.

Acceptance: v37/v38/v56/v57 and any shipped 044 intermediate; IDs/quantities/quality/money preserved; no arms re-export; next block/location identical after save/reification; restored NPC no refill. Older binary refuses newer schema. Rollback after schema release retains readers in forward-compatible patch; do not decrement version or reinterpret new keys. Use pre-upgrade backup for old-binary verification.

### 10.2 Owners and dependency direction

| Concern | Existing owners to extend | New module |
|---|---|---|
| Catalog/quality/identity | items, itemInstances, itemCatalog, armorItemInstances | equipmentTypes |
| Worn validation/derived protection/restrictions | equipment | none |
| Physical types/location/pure hit resolution | defenseResolver callers | damageTypes, hitLocation, incomingHumanHit |
| Player command/HP/effects | inventoryWiring, playerDamage, gameLoop | none |
| NPC ready weapon/gear/AI execution | npcCombat, npcLoadout, NpcAgent | none |
| Fauna source payload | AnimalAgent, createFauna, settlement forwarding callbacks | none |
| Attack/projectile lifecycle | playerMelee/playerRanged, meleeAttack/rangedLifecycle/projectile | none |
| Saves | saveData, saveState, npcState, createApp, PlayerController | existing migration registry |
| Economy | tradeCatalog, merchantTrade, householdProfessionStock, npcTradeAvailability, production, artisanOrders | authored rows only |
| Offscreen restriction | npcTravel, transportOffscreen, existing handoff callers | optional speed parameter |
| UI/visuals | §9 owners | reviewed 045 layout/cell successor |

Use type-only edges and JSDoc/@domain for architectural helpers. No generic Combatant hierarchy, new inventory, event bus, equipment manager or second damage pipeline. Effects stay with target owners.

### 10.3 Derived cache contract

Player currently recomputes gear each frame. Fourteen positions are cheap, but NPC inventories must not be rescanned every movement frame.

Add a narrow runtime armorMutationRevision getter to Inventory. Successful armor add/remove/transfer/update/restore changes increment it; failures do not. Audit updateInstance, count migrations and bulk restore. No event-listener bus; all mutations stay controlled. EquipmentState has a selection revision.

Per-actor runtime snapshot key: Inventory object identity + armor revision + player selection revision where relevant. Snapshot holds worn IDs, effective pieces, 7×3 protection and restrictions. NPC cache dies with agent; offscreen authoritative calls derive on demand. At hit/command boundary validate cached worn IDs against actual ownership (bounded ≤14); stale IDs force recomputation. Newly added superior pieces are captured by revision. A cache is never authority.

Uncached pure initial slice is acceptable, but no per-frame NPC inventory scan in released integration. Test every mutation API, quality change, removed/readded item and reconstructed Inventory identity.

### 10.4 Performance and regression risks

One cached hit: constant-size defense, one hash, one local protection lookup. NPC selection is O(owned armor instances) on mutation, explicit tie reduction rather than sort. No world scan, extra meshes, worker, raycast or ongoing unloaded-world work.

Acceptance target: 500 loaded NPCs with unchanged inventories cause zero armor inventory rescans after cache warm-up. Record matched frame time/allocation before/after NPC integration on same device/scene; pure microbenchmarks can diagnose but cannot prove FPS gains. No absolute timing claim is made here. Keep integration reversible without reducing simulation or density.

| Risk | Minimal mitigation |
|---|---|
| Torso-only vulnerability jump | C2 approval, accessible padding/legs, lower torso costs, live encounters |
| NPCs lose work time or exhaust | bounded guard-only grants, retained regeneration, normal duty-cycle check |
| Costume implies false coverage | explicit local coverage label; later visual reconciliation |
| Old migration drops arms | historical constants + full-chain fixture |
| Removed gear protects one extra frame | revision + live boundary validation |
| Merchant budget excludes basics | seeded source tests and explicit admission |
| Corpse/rebuild duplicates gear | existing ownership handoff and conservation tests |
| Offscreen speed doubles/resets ETA | captured ETA, checkpoint remaining route once |

## 11. Independently verifiable implementation stages

Develop owner-bounded commits. Pure unused helpers/tests may land first when authorized. Schema/runtime/UI transition can be prepared on an integration branch, but **do not release new damage with old global protection labels**. No permanent dual armor mode.

| Stage | Work and principal files | Dependency | Exit criteria |
|---|---|---|---|
| S0 — Opus review/docs | Approval gates, 044 corrections, 045 successor, formal plans/notes | none | accepted scope, exact IDs/dependencies, source delta checked |
| S1 — Pure contracts/math | four new type/math modules; armor quality/derivation tests | S0 technical approval | exact fixtures/golden hashes, no world effects |
| S2 — State/save foundation | equipment, catalog type, saveData/npcState/saveState/createApp/controller; visual slot rename | S1 | full migrations and IDs, no lost arms, durable counter |
| S3 — Combat integration | playerDamage, npcCombat/NpcAgent, fauna callbacks, gameLoop, projectile/maintenance | S2 + C1/C2 | shared resolution, typed every attack, ready weapon, unchanged target permissions |
| S4 — Catalog/economy | nine kinds + six rebalances, costs, trade/stock/recipes | S3 + approved batch | every kind obtainable, exact instance/price/quality, padding not activated under old math |
| S5 — UI vertical completion | preview/character/inventory wiring, layered components/demo, feedback | S3/S4 + successor UI scope | no global claims, preview=actual, normal buy/equip/save flow; first player release |
| S6 — NPC real users/continuity | kits, cache/restrictions, creation context, locomotion/travel | S5 + C3 for grants | no refill, actual gear, same costs, corpse/travel/performance checks |
| S7 — Balance/regression closure | fixtures/results; brigandine separate follow-up slice | S5/S6 | manual encounters and review, actual outcomes documented |
| S8 — Appearance follow-up | player/NPC visuals + valid assets | stable mechanics + asset/D11 gates | skeleton/material/bounds/lifecycle visual acceptance |

S3 may split into human incoming, outgoing condition/type parity, projectile ordering. S6 may split into cache/cost continuity then provisioning. New kits must not precede coherent costs. S8 does not block the explicitly accepted temporary mechanics/UI-first release.

### 11.1 Automated tests

- **Equipment:** equipment.test/equipmentPreview.test; local protection, quality/caps, layered coexistence, exact replacement, stale/duplicate refs, no preview mutation, live/snapshot agreement.
- **Combat:** defense/critical/melee/ranged/projectile and npcCombat/NpcAgent.combatMode; player damage owner tests. Front/rear/full/partial; bag sword cannot block ranged; exhaustion recovery; one HP/injury/XP/wear/kill effect; source identity; reordered projectile candidates.
- **Persistence:** saveData/npcState full chain, historical constants, invalid current keys/counters, preserved epoch refusal, all instance owners, post-load ordinal.
- **Economy:** merchant/specialist/artisan/trade tests; real acquisition, no ordinary singleton items, exact money/stock, capacity failure atomic, output and pickup once after reload.
- **NPC/world:** npcLoadout/npcTradeAvailability/npcPostDeath, npcTravel/transport; creation-order independent kits; no grants after restore; personal vs household/work cargo; detailed/offscreen factor once; all cache mutation paths.

Run focused Vitest groups per slice, Vue type-check, scoped lint and build at integration using repository scripts. Use preflight for each formal plan. Broaden tests when failures/new dependencies justify it, not a full-suite rerun after every tiny commit. Update owning STATE/architecture docs only after implementation; this proposal is not a current-state update.

### 11.2 Manual/gameplay verification, seed 415424794

1. Normal buy/order/pickup, under+outer equip, compare/remove/transfer, save/reload; actual prices/capacity and disabled controls.
2. Controlled wolf/bear encounters: naked, torso-only, full leather/mail; committed region/type/damage, facing/block, no blood on full block, existing downed/medicine.
3. Crossbow guard switches to melee near threat, cannot borrow bag sword defense during reload, pays costs, recovers and resumes duty.
4. Gift a superior piece; next hit uses it. Legitimate removal/test fixture loses it immediately. Stream/rebuild/reload never refill.
5. NPC death/corpse/loot retains kit IDs once; no extra merchant copy or armor after death.
6. Mount fall and trap follow explicit physical policy; starvation/dehydration unaffected.
7. Desktop/narrow/keyboard inventory/character/demo; profiles/local stats labelled, shield N/A, visual limitations clear.
8. Matched populated scene checks cache scans, frame time/GC and streaming; no new render workload from mechanics.

Record automated, browser-observed, author-accepted and unverified results separately. None of these runtime checks was executed for this document.

## 12. Product approval gates and later extensions

| Gate | Recommendation | Enables |
|---|---|---|
| C1 — D5 anatomy/typed layers; A6 successor | Seven exclusive regions, sampled location, two layers, typed resistance; padding genuinely wearable in this separate project | S3–S5 activation, not retroactive change to Stage 4 |
| C2 — D6 balance | Accept torso-only coverage loss, proposed typed values/restrictions, species profiles and trap/fall policy; no location damage multipliers | Existing gear rebalance |
| C3 — D7 kits | §7 guard kits only at genuine first creation; no free retrofitting old saves or shopping AI | S6 automatic provisioning |
| C4 — boundary | Keep shields/parry/dodge/durability/per-limb wounds deferred; brigandine follows first ordinary batch | Scope clarity; A7 unchanged |

C1–C3 can be approved together after Opus review. They are product choices, not unresolved algorithms. If C3 declines, keep shared protection/costs and transfer-based NPC wear, omit kits. If C1/C2 declines, do not substitute global scalar protection behind an anatomical UI; return the specific rejected mechanic for revision.

Optional evaluation:

- **Shields:** worthwhile after ready-item semantics; future separate approval must define offhand ownership, two-hand conflict, directional/projectile block and stamina. A7 forbids current functionality.
- **Parry:** lower priority than reliable existing block feedback; needs input window/telegraphs and precedence with automatic block. Deferred.
- **Dodge:** requires input/animation/collision design; no invulnerability teleport or broad NPC navigation rewrite here.
- **Armor durability:** lowest priority initially; requires instance condition, repair economy/UI and NPC supply. Later wear only actually struck piece(s), exact-owner repair, same human rules. No V2-style wear on all slots or elapsed-time degradation.
- **Multi-region garments:** later authored coverage/exclusion design; not hidden sleeve protection.
- **Human opponents:** separate simulation/quest/product scope; typed handles do not authorize it.

## 13. Claude Opus Review & Implementation Handoff

### Architecture to retain

Inventory owns items; player references at most 14 positions; NPC kit derives from personalInventory. Catalog/quality resolves effective stats; pure incomingHumanHit resolves defense→one location→typed armor. HP/injury/death remain actor-owned. Weighted UI averages never enter damage. Durable incoming ordinal and stable source identity feed isolated hash rolls. Existing attack/medicine/economy/travel owners remain.

### Review before Sonnet

1. Recheck touched owners against source baseline; verify intervening changes. Verify arithmetic tables and catalog intake against A1–A10.
2. Resolve C1–C3 with author and record explicit approval separately. Do not mark this proposal or roadmap link as approval.
3. Correct 044 migration/asset notes with a dated correction; preserve its visual obligations. Keep 045 unlayered scope; create a successor for layers/protection presentation.
4. Trace historical migration references to current slots and all fauna callback forwarding, including settlement-owned animals. Do not change threat behavior while forwarding identity/type.
5. Verify exact-instance maintenance, ready-defense selection, interruptions and count-backed tools; no duplicate worn/held state.
6. Bind Inventory revision and both offscreen handoff families to then-current mutation/caller paths. The semantics above are fixed; this trace is implementation binding, not a new design exercise.
7. Allocate formal plan IDs from then-current PLANNING/index; do not reserve historical next IDs. Provide required metadata, dependencies, source symbols, verification and JSDoc requirements.
8. Link review/formal plans from this proposal and Revival navigation; do not reschedule unrelated roadmap work.

### Sonnet packages, files and verification

Use S1–S8 above, with S0 owned by Opus. Each handoff supplies accepted formulas/tables, exact owner cluster from §10, upstream contracts, schema impact, forbidden scope, focused tests and release boundary. Split large combat/NPC packages as specified. Keep first player schema/runtime/UI release coherent.

Mandatory owners: equipment/armorItemInstances/itemCatalog/itemInstances/items; playerDamage/npcCombat/NpcAgent; AnimalAgent/createFauna/gameLoop; saveData/npcState/saveState/createApp/PlayerController; equipmentPreview/characterPresentation/inventoryWiring; named UI/economy/travel consumers. Proposed new helpers are equipmentTypes, damageTypes, hitLocation and incomingHumanHit. No additional managers are required.

Require automated matrix, normal acquisition, full save round trip, exact item conservation, next-roll continuity, same actual/preview math, NPC travel/cost verification, matched performance evidence and explicit unavailable visuals. Passing TypeScript is not gameplay acceptance.

**Unresolved product decisions:** C1 anatomy/layers, C2 balance, C3 new-guard kits. C4 states recommended deferrals. Remaining empirical checks are gameplay feel, assets, browser behavior and performance; core algorithms/contracts are specified.

**This documentation deliverable neither implements gameplay nor changes existing approvals or plan statuses.**

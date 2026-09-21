# Plan: Artisan Skill, Specialization and Player Orders

**Created:** 2026-09-20  
**Status:** `verification needed` 🔍  
**Type:** feature  
**Priority:** high · **Effort:** L  
**Depends on:** ~~settlements-npcs-015~~, ~~settlements-npcs-016~~  
**Domain:** `settlements-npcs`  
**Subdomains:** `economy` `production` `professions`  
**Tags:** `artisan` `skill` `specialization` `orders`  
**Roadmap:** `economy-production`  
**Model:** Sonnet, Composer  
**Implemented at:** 2026-09-20 21:01

## Goal

Introduce persistent artisan capability for production professions and a first player-facing custom-order flow without creating a separate player crafting subsystem.

Core model:

```text
profession
+ artisan base skill
+ 0..N specializations
+ settlement-wide profession coverage
→ available products
→ autonomous-production preference
→ initial trade-stock bias
→ order eligibility
→ crafted-item quality
```

First vertical slice is Blacksmith-focused, but the capability model and order execution path must remain reusable by later professions.

The system must preserve world independence: the same artisan profile that affects player orders must also be usable by ordinary NPC production, stock generation and later autonomous economic behavior.

## Verified current architecture to reuse

Current `main` already provides the important seams:

- `src/economy/production.ts` owns shared `ProductionDef` recipe definitions and role lookup;
- `src/economy/productionExecutor.ts` owns synchronous all-or-nothing production commits;
- `src/economy/npcWork.ts` is the existing profession-work completion → economy mutation seam;
- `src/ai/npcProfessionWork.ts` owns profession work planners, including Blacksmith;
- `src/settlement/householdProfessionStock.ts` owns one-time profession specialist trade stock;
- `src/settlement/settlementArmorQuality.ts` owns settlement-size-driven armor quality weights used by specialist and merchant bootstrap;
- `src/settlement/merchantTrade.ts` already demonstrates specialization affinity / stock bias as a reusable design pattern;
- `Household.items`, NPC personal inventories and `SettlementEconomy` are existing authoritative storage owners;
- settlements-npcs-016 proves Blacksmith production should reuse normal profession work + shared production execution, not a second crafting scheduler.

Do not introduce a `PlayerCraftingManager`, second recipe registry, artisan-only inventory, or separate crafting tick.

## 1. Artisan profile

Add one persistent artisan capability record for production-capable NPCs.

Conceptually:

```ts
type ArtisanProfile = {
  baseSkill: number
  experience: number
  specializations: ArtisanSpecialization[]
}
```

Exact ownership/type location must follow existing NPC authoritative-state architecture found during implementation recon.

Rules:

- `baseSkill` is persistent and mutable;
- `experience` is reserved now so later skill-growth work does not require replacing the model;
- specialization is a separate axis from skill;
- `Role` remains profession identity; do not create role variants such as `swordsmith` or `armorer`;
- artisan profile must survive save/load and NPC runtime reconstruction;
- artisan profile must not belong to Vue/UI or transient `NpcAgent` state.

Skill growth itself is out of scope for this plan, but the stored model must not assume skill is immutable.

## 2. Initial skill scale

Use one bounded `0..100` scale.

Initial semantic bands:

| Band | Skill |
|---|---:|
| novice | 20–39 |
| average artisan | 40–55 |
| experienced | 56–69 |
| master | 70–84 |
| exceptional master | 85–94 |
| extraordinary | 95–100 |

Initial skill should be deterministic from stable world facts:

```text
settlement size
+ profession
+ relevant settlement/environment context
+ stable NPC identity
+ bounded seeded variation
```

Settlement size changes probability, not hard capability.

A small settlement may rarely contain an exceptional artisan. A large settlement should have a higher chance of stronger artisans but must not guarantee a master.

Do not infer skill from current stock contents or current wealth because those are mutable downstream state.

## 3. Base skill vs effective skill

Keep base capability separate from contextual crafting capability.

```text
effectiveSkill
= baseSkill
+ relevant specialization bonus
+ later bounded situational modifiers
```

V1 should normally use only:

```text
baseSkill + specialization bonus
```

Clamp effective skill to `0..100`.

This distinction is required so later experience can raise `baseSkill` without conflating permanent progression with specialization.

## 4. Specializations

Selected artisan professions can have `0..N` specializations.

Initial Blacksmith specialization vocabulary should be small and category-based, for example:

```text
swords
armor
tools
axes
```

Exact item/category mapping must reuse existing item/category data where practical instead of maintaining a long duplicate list.

A specialization may influence:

1. effective crafting skill for matching recipes;
2. initial trade-stock weighting;
3. autonomous production preference;
4. order/catalog presentation;
5. optional recipe eligibility only when the specialization is explicitly exclusive.

A normal specialization is a preference/bonus, not automatically a hard gate.

## 5. Settlement-wide Blacksmith coverage

Specializations must be assigned with settlement-wide coverage awareness, not independently per NPC.

### One Blacksmith

If a settlement has exactly one Blacksmith:

- that NPC must remain a generalist capable of producing the settlement's baseline Blacksmith categories;
- specialization may bias quality, stock and preference;
- specialization must not remove baseline weapon, armor and tool coverage;
- starter stock must retain useful variety rather than becoming a one-category shop.

Conceptually:

```text
blacksmithCount == 1
→ required generalist coverage
→ specializations are preference/bonus only
```

### Two or more Blacksmiths

If a settlement has `2+` Blacksmiths:

- allocate category coverage across the group first;
- individual Blacksmiths may then receive exclusive specialization restrictions;
- avoid independent rolls that produce several identical narrow specialists while leaving major settlement needs uncovered;
- allow overlap where useful, especially in large settlements, but coverage takes priority.

Conceptually:

```text
blacksmithCount >= 2
→ resolve settlement-wide category coverage
→ assign individual specialization sets
→ optional exclusive specialization gates
```

Examples:

```text
Blacksmith A
  skill 78
  swords, axes
  weapon-focused

Blacksmith B
  skill 71
  armor, tools
  armor/tool-focused
```

A third Blacksmith may be another specialist or a higher-skill generalist.

Do not make profession staffing depend on current player location or demand.

## 6. Specialization count and rarity

Keep specialization breadth bounded.

Suggested generation guideline:

- low/average artisans: usually 0–1;
- experienced/master artisans: usually 1–2;
- exceptional masters: may have 2–3;
- extraordinary artisans remain rare and may combine breadth with high skill.

This is a generation bias, not a hard rule that couples skill progression to automatic specialization unlocks.

Future skill growth must not automatically add or change specialization. Specialization progression is a separate later concern.

## 7. Craft capability and recipe difficulty

Separate:

```text
canCraft
prefersToCraft
effectiveSkill
```

A recipe should be able to define or resolve a difficulty/capability threshold without creating a second recipe system.

Target contract:

```text
ProductionDef
+ artisan capability metadata / resolver
→ eligibility + difficulty
```

Quality should ultimately resolve from:

```text
effective skill
+ recipe difficulty
+ bounded deterministic RNG
→ item quality
```

A simple knife and advanced armor must not have identical quality difficulty.

V1 may support only a small Blacksmith recipe set, but the data shape must not encode Blacksmith-specific branching into UI.

## 8. Quality integration

Current armor quality is settlement-size-primary through `settlementArmorQuality.ts`.

This plan should move artisan-made quality toward person-based capability while preserving the current settlement context as an upstream influence.

Preferred direction:

```text
settlement context
→ initial artisan skill distribution

artisan base skill
+ specialization
+ recipe difficulty
+ bounded seeded roll
→ produced quality
```

Do not maintain a permanently parallel “settlement quality” and “artisan quality” authority for newly crafted goods.

Existing merchant/specialist bootstrap quality may be adapted incrementally, but implementation should avoid unrelated migration of every historical stock path if not needed for the vertical slice.

The quality roll must be deterministic for a stable production/order event identifier so save/load or reconstruction cannot reroll the result.

## 9. Starting artisan materials

Fresh artisan households need a bounded starter material reserve so the first custom orders and autonomous production do not immediately require long-distance logistics.

Material quantities should derive from:

```text
profession
+ settlement size
+ local resource context
+ artisan specialization where relevant
```

Rules:

- seed once on genuine first construction/state initialization;
- never refill merely because stock becomes low;
- restored state keeps its real remaining quantities;
- use existing authoritative storage owners;
- bulk economic inputs stay in `SettlementEconomy` when that is already their authoritative representation;
- concrete item materials stay in existing inventory owners as appropriate;
- do not create `artisanMaterialsInventory`.

Specialization should bias both relevant starter materials and finished starter stock so an armor specialist does not begin with a sword-heavy inventory and mismatched inputs.

## 10. Initial artisan trade stock

Extend the existing `householdProfessionStock.ts` bootstrap rather than adding another shop inventory.

Inputs should include artisan capability:

```text
profession
+ settlement context
+ base skill
+ specializations
```

Stock goals:

- preserve useful category breadth for the only Blacksmith in a settlement;
- bias stock toward specialization categories;
- allow stronger artisans to have somewhat more advanced goods;
- keep settlement/environment bias from the existing stock resolver;
- use the same artisan profile later used by custom orders.

Example:

```text
single Blacksmith
skill 73
specialization swords

→ sword-biased stock
→ but still baseline armor + tools
```

For settlements with multiple Blacksmiths, exclusive specialists may have correspondingly narrower starter assortments because settlement-wide coverage is provided by the group.

## 11. Player custom-order catalog

The player must not see every `ItemKind`.

Orderable goods are derived from real production capability:

```text
profession recipes
∩ artisan canCraft
∩ skill/difficulty requirements
∩ specialization/exclusive gates
∩ required workplace capability
```

Specialization normally improves effectiveness/preference rather than blocking unrelated baseline recipes.

Example target behavior:

```text
skill ~50
→ simple knife / tools / basic sword

skill ~70
→ broader weapon and armor set

skill ~85+
→ advanced recipes become realistic

matching specialization
→ better effective skill / quality distribution
```

Exact thresholds are content calibration and should remain data-driven.

## 12. Order acceptance and deposit

V1 custom-order flow:

```text
interact with artisan
→ inspect available custom orders
→ choose one item
→ show required materials / deposit / rough completion information
→ confirm
```

At confirmation:

1. resolve current artisan capability;
2. resolve the production recipe;
3. verify required authoritative material stock exists;
4. calculate material value;
5. player pays a deposit equal to material value;
6. create the persistent order;
7. reserve or commit materials according to the existing production transaction contract;
8. artisan completes the order through normal profession work;
9. concrete output item is created only at production completion;
10. finished item becomes ready for pickup.

The player must not receive the item immediately at order acceptance.

## 13. Deposit semantics

Initial rule:

```text
deposit = current value of required materials
```

Keep V1 deliberately simple.

The deposit is payment for material commitment, not a magic recipe fee.

Where existing ordinary-NPC coin ownership from settlements-npcs-055 is available, money should transfer to a real owner rather than disappear.

Do not add:

- credit/debt;
- negotiation;
- dynamic labor rates;
- settlement tax;
- courier fees;
- rush fees.

A later plan may add labor payment/final balance without changing the basic order lifecycle.

## 14. Material shortage behavior

V1:

```text
materials available
→ order may be accepted

materials missing
→ order cannot be accepted
→ UI shows missing quantities
```

Example:

```text
Missing:
Iron ×3
Coal ×1
```

Do not add sourcing in this plan.

Specifically out of scope:

- player-supplied missing materials;
- courier procurement;
- automatic purchase from another settlement;
- transport-order generation;
- remote market sourcing;
- waiting order that silently becomes active later.

The order/material contract should nevertheless preserve explicit required-material data so later logistics work can supply the shortage without redesigning recipes or orders.

## 15. Production integration

Custom orders must use shared production.

Preferred flow:

```text
ArtisanOrder
→ existing ProductionDef
→ existing profession work scheduling
→ shared production executor
→ concrete output
```

Do not add:

- independent custom-order production timer;
- player-only recipe definitions;
- duplicate material consumption logic;
- instant item spawning;
- second Blacksmith work FSM.

The order acts as a production demand/commitment that existing profession work can satisfy.

Normal autonomous artisan work and custom order work should ultimately compete for the same artisan time rather than being simulated independently.

For V1 the scheduling policy may prioritize an accepted player order, but this priority must be explicit and bounded rather than implemented as a second scheduler.

## 16. Persistent order ownership

Orders need simulation-owned persistent state, not UI state.

Conceptual shape:

```ts
type ArtisanOrder = {
  id: string
  artisanNpcId: NpcId
  customer: 'player'
  productionId: string
  status: ArtisanOrderStatus
  createdAt: number
  paidMaterialCost: number
  requiredMaterials: ...
  outputInstanceId?: string
}
```

Initial statuses should remain minimal:

```text
accepted
in_progress
ready
collected
cancelled
```

The concrete output instance should not exist until production completes.

Orders must survive:

- save/load;
- settlement stream-out/in;
- NPC runtime reconstruction.

Exact persistent owner should be selected during implementation recon from current settlement/NPC authoritative-state architecture. Do not store order lifecycle in Vue or reconstruct it from shop stock.

## 17. Output ownership and pickup

Successful production creates one concrete output owned by an authoritative simulation inventory while waiting for pickup.

Prefer the artisan's existing household/personal ownership model unless current capacity/ownership contracts show a more appropriate existing owner.

The order stores the exact produced instance identity where the item is instance-backed.

Pickup must transfer the real item to the player exactly once.

Do not recreate the item at pickup and do not infer completion from item kind/count alone.

## 18. Future skill-growth seam

This plan does not implement progression, but must leave a clean event/result seam for a later plan:

```text
real completed production
→ artisan experience gain
→ possible baseSkill growth
```

Future growth should be driven by actual work, not player proximity.

Likely later inputs:

- recipe difficulty;
- successful completed production;
- diminishing returns for trivial recipes;
- master/apprentice or learning modifiers later.

Do not implement generic XP now.

The important V1 contract is that artisan profile is persistent and mutable and production completion can be identified without scanning history.

## 19. First vertical slice

Implement Blacksmith first.

Required Blacksmith slice:

- persistent artisan profile;
- deterministic initial skill;
- `swords / armor / tools / axes` specialization support;
- settlement-wide Blacksmith coverage policy;
- generalist behavior when only one Blacksmith exists;
- exclusive specialization allowed when `2+` Blacksmiths provide group coverage;
- specialization-biased starting stock;
- bounded starter material stock;
- several orderable existing Blacksmith recipes;
- material-cost deposit;
- persistent order;
- normal profession production;
- skill/specialization/difficulty quality resolution;
- exact finished-item pickup.

Keep underlying mechanisms generic enough for later Textile Worker, Herbalist, Hunter-related production and future artisan professions, but do not implement their content in this plan.

## 20. Performance and simulation constraints

No global per-frame artisan scans.

Generation-time work may inspect the settlement's known profession roster to resolve coverage.

Runtime order work should access only:

- the known artisan;
- its known settlement/household;
- explicit production/material owners;
- active orders relevant to that artisan.

Do not make custom production dependent on camera visibility.

Do not create a high-frequency economy tick for order progress.

## Tests

### Skill generation

- initial skill is deterministic for the same stable world/NPC inputs;
- skill remains within `0..100`;
- settlement size changes distributions without hard-locking quality tiers;
- restore does not reroll skill.

### Specialization and coverage

- one-Blacksmith settlement preserves baseline weapon + armor + tool capability regardless of specialization;
- one Blacksmith may have stock/preference bias without losing required breadth;
- two Blacksmiths may receive exclusive specialization sets;
- multi-Blacksmith generation covers required category set before optional overlap;
- deterministic generation cannot accidentally leave all Blacksmiths restricted to the same narrow category;
- specialization count remains bounded.

### Effective skill / quality

- matching specialization raises effective skill by the configured bounded amount;
- nonmatching specialization does not change base capability;
- effective skill clamps to `0..100`;
- recipe difficulty affects resulting quality distribution;
- stable order/production identity produces stable quality across reconstruction;
- higher effective skill statistically shifts quality upward in deterministic distribution tests.

### Starter stock/materials

- genuine first initialization seeds once;
- restore/rebuild never refills consumed materials or sold stock;
- single Blacksmith stock retains category variety;
- specialization biases matching goods/materials;
- multi-Blacksmith exclusive specialists may have narrower individual assortments while settlement-wide coverage remains intact.

### Orders

- unavailable recipe cannot be ordered;
- insufficient skill/capability cannot be ordered;
- missing materials blocks acceptance with no partial mutation;
- accepted order charges exactly material-value deposit;
- accepted order persists;
- output does not exist at acceptance;
- profession work completes through shared production execution;
- completion creates exactly one concrete item;
- ready item survives save/load;
- pickup transfers exact instance once;
- repeated pickup cannot duplicate output.

### Regression

Keep green:

- existing Blacksmith autonomous production from settlements-npcs-016;
- shared production executor atomicity;
- household specialist stock bootstrap;
- existing settlement/merchant armor quality paths not explicitly migrated by this plan;
- ordinary NPC trade ownership;
- save/load and NPC reconstruction.

## Acceptance criteria

- Production-capable Blacksmiths have a persistent mutable artisan profile.
- Initial skill uses the common `0..100` scale and deterministic settlement/NPC context.
- Base skill and effective skill are separate concepts.
- Specialization affects quality/stock/preference without automatically becoming a recipe gate.
- A settlement with one Blacksmith retains broad weapon, armor and tool coverage.
- Settlements with multiple Blacksmiths may assign exclusive specialists while preserving settlement-wide category coverage.
- Starter stock and starter materials derive from the same artisan profile and existing authoritative storage owners.
- Player can place a real Blacksmith order only for goods the artisan can actually produce.
- Order acceptance requires real materials and charges a deposit equal to material value.
- Orders use existing `ProductionDef`, profession work and shared production executor.
- Crafted quality depends on artisan effective skill, recipe difficulty and bounded deterministic RNG.
- Concrete output is produced at completion, persists and is transferred exactly once at pickup.
- Artisan state and orders survive save/load/reconstruction.
- Architecture is ready for later skill growth and logistics without implementing them now.
- No second recipe registry, crafting scheduler, crafting inventory or player-only production subsystem is introduced.
- Browser/manual verification remains the user's responsibility.

## Out of scope

- actual artisan skill/experience growth;
- specialization progression/respecialization;
- apprentices and teaching;
- player-supplied missing materials;
- courier/material procurement;
- inter-settlement sourcing;
- waiting/procurement order states;
- NPC→NPC custom orders;
- dynamic supply/demand pricing;
- negotiation;
- labor-price simulation;
- rush orders;
- crafting failure/material destruction;
- artisan fame/reputation;
- generic skill framework for every NPC action;
- broader migration of every existing merchant quality path;
- non-Blacksmith artisan content beyond reusable foundations.

## Follow-up plans

This plan intentionally leaves two substantial follow-ups separate:

1. **Artisan logistics / material procurement**
   - player-delivered missing materials;
   - courier/procurement choice;
   - local vs remote sourcing;
   - integration with existing transport/logistics orders;
   - explicit waiting/material-acquisition lifecycle.

2. **Artisan skill growth**
   - production-completion experience;
   - recipe-difficulty-weighted learning;
   - diminishing returns for trivial work;
   - base-skill progression;
   - potential specialization learning/progression as a separate decision.

Do not fold these into the first implementation.

## Likely implementation areas

Primary recon targets:

- `src/settlement/npcState.ts` / current authoritative NPC-state owner;
- `src/settlement/professionStaffing.ts`;
- `src/settlement/householdProfessionStock.ts`;
- `src/settlement/settlementArmorQuality.ts`;
- `src/economy/production.ts`;
- `src/economy/productionExecutor.ts`;
- `src/economy/npcWork.ts`;
- `src/ai/npcProfessionWork.ts`;
- existing inventory/trade pricing helpers for material valuation;
- persistence snapshot/schema only where the current authoritative NPC/order owner requires it;
- existing NPC interaction / Merchant-style UI seams for exposing the order flow without duplicating trade UI architecture.

Implementation recon must confirm exact state owner and UI integration files before coding.

Important new public architectural functions/types should receive useful JSDoc with `@domain settlements-npcs` where it improves preflight discovery.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Implementation Notes: Artisan Skill, Specialization and Player Orders

Source plan: `settlements-npcs-056-artisan-skill-specialization-and-player-orders.md`

## 1. Current architecture to preserve

The current code already has the correct production ownership split:

```text
NpcAgent profession planning
  → src/ai/npcProfessionWork.ts
  → thin completion adapter in src/economy/npcWork.ts
  → ProductionDef from src/economy/production.ts
  → executeProduction() in src/economy/productionExecutor.ts
  → SettlementEconomy and/or Household.items
```

Do not add a player-only crafting scheduler, separate recipe registry, artisan inventory, or timer-based crafting service.

Relevant existing symbols:

- `src/economy/production.ts`
  - `ProductionDef`
  - `productionDefById()`
  - `BLACKSMITH_IRON_ROD_PRODUCTION`
- `src/economy/productionExecutor.ts`
  - `preflightProductionInputs()`
  - `executeProduction()`
  - `ProductionResult`
- `src/economy/npcWork.ts`
  - `commitBlacksmithProduction()`
- `src/ai/npcProfessionWork.ts`
  - `planBlacksmithWork()`

Existing Blacksmith production from settlements-npcs-016 must remain the execution seam. Order work should become another reason for that profession planner to choose a concrete production action, not a parallel FSM.

## 2. Authoritative artisan state

Use `src/settlement/npcState.ts::NpcAuthoritativeState` as the owner of artisan capability.

This state already survives:

```text
settlement stream-out/in
→ same NpcStateRegistry entry

WorldBundle rebuild
→ SettlementsManager.snapshotNpcStates()
→ createNpcStateRegistry(initialNpcStates)

save/load
→ SaveData.npcStates
```

Add optional snapshot fields so pre-plan saves restore safely without synthesizing mutable history.

Recommended shape:

```ts
type ArtisanSpecialization = 'swords' | 'armor' | 'tools' | 'axes'

type ArtisanProfile = {
  baseSkill: number
  experience: number
  specializations: ArtisanSpecialization[]
  exclusiveSpecializations?: ArtisanSpecialization[]
}

type ArtisanOrderStatus =
  | 'accepted'
  | 'in_progress'
  | 'ready'
  | 'collected'
  | 'cancelled'

type ArtisanOrder = {
  id: string
  customer: 'player'
  productionId: string
  status: ArtisanOrderStatus
  createdAtDays: number
  paidMaterialCost: number
  requiredMaterials: ...
  outputInstanceId?: string
}
```

Prefer keeping the V1 artisan orders on the artisan's own `NpcAuthoritativeState` rather than introducing a new world-global order registry. The commitment is owned by one known NPC, the dialogue starts from that NPC, and the existing registry already gives direct lookup even while its `NpcAgent` is unloaded.

If implementation discovers a real cross-artisan query requirement not visible today, use a small world-owned registry patterned after work/transport commitments. Do not duplicate the same order both globally and on the NPC.

## 3. Deterministic initialization

Do not lazily create artisan profiles when the player opens dialogue or the order screen.

Initialize them during genuine NPC/settlement state creation, where stable inputs are available. Restore must reuse the persisted profile unchanged.

Inputs may use:

- stable `NpcId`;
- settlement seed/context;
- settlement `VillageSize`;
- role;
- deterministic settlement resource/terrain context already passed through settlement generation.

Use `createSeededRandom()` / the same deterministic hash style already used by `householdProfessionStock.ts`. Do not derive skill from current stock, coins, or current inventory.

Generation must clamp `baseSkill` to `0..100`.

## 4. Settlement-wide specialization coverage

`src/settlement/professionStaffing.ts::adultProfessionCoverage()` already provides generation-time adult profession counts.

Coverage assignment needs the actual Blacksmith NPC identities, not only the count. Resolve the settlement's Blacksmith roster once during materialization/generation and assign profiles deterministically in stable NPC-id order.

Rules:

- one Blacksmith: never give exclusive restrictions; specialization is only bonus/preference;
- 2+ Blacksmiths: allocate required category coverage first, then optional overlap;
- do not roll each NPC independently and repair missing categories afterward;
- the result must be independent of player/camera position.

Keep `Role = 'blacksmith'`; specialization is capability metadata, not a new profession enum.

## 5. Recipe metadata: extend ProductionDef, do not fork recipes

Current `ProductionDef` has only owners/inputs/outputs. It has no difficulty, artisan category, or orderability.

Add narrowly scoped optional metadata to the existing definition, for example:

```ts
artisan?: {
  category: ArtisanSpecialization
  difficulty: number
  orderable?: boolean
  minSkill?: number
}
```

Exact naming may differ, but keep the metadata on/next to `ProductionDef`, not in a UI-side catalog.

Important: existing recipes without artisan metadata must keep current behavior unchanged.

`productionDefById()` should remain the canonical persistent-id resolver for an `ArtisanOrder.productionId`.

## 6. Blacksmith recipe scope

Today the only real Blacksmith recipe in shared production is `blacksmith.iron_rod`. The plan therefore necessarily needs several additional existing-item Blacksmith `ProductionDef` entries for the first order slice.

Do not make every trade-stock item craftable automatically.

Choose a small explicit vertical slice from existing Blacksmith-relevant items and define real material costs for them. Reuse existing `ItemKind` and economic inputs. Keep recipe difficulty/category data-driven.

The catalog shown to the player must be:

```text
production defs for role
∩ orderable artisan metadata
∩ effective skill
∩ exclusive-specialization rules
∩ available workplace/context
```

Never enumerate all `ItemKind` from the UI.

## 7. Production executor boundary

`executeProduction()` currently atomically applies count-backed item outputs by calling `Inventory.applyRecipe()`. It does not create quality-bearing output instances based on an artisan event.

Do not hide quality generation inside generic `Inventory.applyRecipe()`.

Preferred direction:

1. keep `preflightProductionInputs()` as the common owner/input validation;
2. extend the shared production completion path only as much as needed to support an explicitly resolved concrete output instance;
3. generate artisan quality before final commit from stable production/order identity;
4. commit materials + concrete output exactly once.

If the chosen ordered outputs are all count-backed except armor, keep the new instance path narrow. Do not redesign unrelated production.

Atomicity requirement: a failed output insertion must not leave consumed stock/materials behind. Preserve the all-or-nothing contract of `executeProduction()`.

## 8. Quality authority

Current starter armor quality is settlement-context driven through:

- `src/settlement/settlementArmorQuality.ts::resolveSettlementArmorQuality()`;
- `src/settlement/householdProfessionStock.ts::armorQualityFor()`.

For newly crafted artisan output, add a person-based quality resolver rather than calling `resolveSettlementArmorQuality()` with fake parameters.

Recommended inputs:

```text
artisan baseSkill
+ matching specialization bonus
+ recipe difficulty
+ deterministic roll keyed by order/production event id
→ quality
```

Settlement size should influence initial `baseSkill`, not be a second permanent quality authority for newly crafted goods.

Existing bootstrap stock may continue using settlement quality where migration is unrelated. When Blacksmith starter stock is touched by this plan, pass the artisan profile into the resolver so newly seeded Blacksmith-specific stock and later orders agree directionally.

## 9. Starter stock and starter materials

`src/settlement/householdProfessionStock.ts` is the existing one-time household profession stock path:

- `resolveProfessionStarterGrants()`;
- `addStarterGrant()`;
- deterministic `specialistRng()`;
- output goes into `Household.items`.

Extend this path; do not create an artisan shop inventory.

Important ownership distinction:

- settlement bulk `iron` / `coal` stay in `SettlementEconomy`;
- concrete item materials/products stay in `Household.items` or another already-authoritative inventory;
- `personalInventory` remains the NPC's belongings and coin owner;
- `merchantStock` is Trader-only shop stock and is not the Blacksmith order store.

Starter material seeding must have a genuine-first-construction latch/condition. A restore/rebuild must never refill consumed materials.

For one-Blacksmith settlements, starter stock must retain baseline category breadth even when specialization biases quantities/quality.

## 10. Order acceptance transaction

Use live production preflight before acceptance.

Acceptance should be one transaction at gameplay/composition-root level:

```text
resolve artisan + live profile
→ productionDefById()
→ capability/orderability check
→ preflight required material owners
→ calculate material-value deposit
→ verify player coins
→ commit/reserve materials
→ transfer deposit to real NPC coin owner
→ append persistent ArtisanOrder
```

Do not create an order first and then discover that payment/material mutation failed.

For V1, the safest interpretation of the plan's "reserve or commit" wording is to consume/commit the required materials at acceptance, because current `executeProduction()` has no reservation ledger. This prevents autonomous production from spending the same material later.

If implementation instead introduces reservations, they must be first-class authoritative state understood by ordinary production preflight; do not create UI-only reservations.

The material-cost calculation should reuse existing item/trade valuation helpers where they cover the relevant kinds. Do not add a second price table only for orders.

Deposit coins should land in the artisan's `personalInventory`, matching current ordinary-NPC monetary ownership.

## 11. Scheduling accepted work

Extend `planBlacksmithWork()`, not `NpcAgent.update()` and not a new global tick.

A minimal policy:

```text
if artisan has accepted/in_progress player order that can run
  choose its ProductionDef with explicit bounded priority
else
  current autonomous Blacksmith behavior
```

The planner should inspect only that artisan's own active orders and known household/economy owners.

Transition `accepted → in_progress` when work genuinely starts, and `in_progress → ready` only after the shared production completion succeeds.

Never mark ready from elapsed UI time.

Order completion must be idempotent across reconstruction: a `ready` order must never execute its recipe again.

## 12. Output ownership and exact pickup

While waiting for pickup, the output must physically exist in one existing authoritative inventory.

Prefer `Household.items` for artisan-produced trade goods unless capacity/instance semantics require a more specific already-existing owner.

For instance-backed goods:

- create exactly one concrete instance at production completion;
- persist it through the owning inventory snapshot;
- store its exact id in `ArtisanOrder.outputInstanceId`;
- pickup transfers that exact instance to the player;
- set `collected` only after the transfer succeeds.

Do not recreate the item from `productionId` during pickup.

For count-backed output, consider making the first order slice instance-backed where quality matters. If a count-backed kind is used, the order still needs an exact reserved ownership mechanism so unrelated household stock cannot satisfy pickup accidentally.

## 13. Persistence

Because artisan profile/orders belong to `NpcAuthoritativeState`, extend:

- `NpcAuthoritativeState`;
- `NpcStateSnapshot`;
- `fromSnapshot()`;
- fresh-state creation;
- registry snapshot serialization;
- relevant `npcState.test.ts` round-trip tests.

`src/app/saveState.ts` already writes `bundle.settlementsManager.snapshotNpcStates()`; do not add a second top-level save field for artisan state.

`SaveData.npcStates` already carries the snapshot structure. Prefer additive optional fields so legacy saves restore with no artisan history. Only bump save version if current save schema validation requires it; do not bump merely because an optional nested field was added.

Fresh legacy NPCs that are production-capable but have no stored profile need one deterministic initialization path. Ensure that path cannot reroll on every stream/rebuild.

## 14. UI integration

Do not overload merchant stock semantics.

Current dialogue/trade path is:

- `src/app/inventoryWiring.ts::npcDialogueCanTrade()`;
- `resolveNpcTradeOffers()`;
- `vueUi.openMerchantFromDialogue(..., mode: 'npcGoods')`.

Orders are not "owned goods for sale", so do not inject orderable recipes into `resolveNpcTradeOffers()`.

Add a separate artisan action/topic from Blacksmith dialogue, but reuse the existing Vue facade/store/modal patterns for inventory/trade-style item rows, prices and confirmation.

UI receives a projected order view from gameplay logic; it must not own profile/order state or recompute capability from raw items.

Before commit, always re-resolve the live artisan/order/material state. A stale open screen must not bypass a material shortage, changed coin balance, death, or already-collected order.

## 15. Existing mechanisms worth reusing

- deterministic generation: `createSeededRandom()`;
- settlement profession coverage: `adultProfessionCoverage()`;
- owner-aware inventory: `Inventory`, `Household.items`, `personalInventory`;
- instance creation/transfer patterns: `createAcquiredInstance()`, armor instance helpers, current trade transaction code;
- production input validation: `preflightProductionInputs()`;
- recipe commit: `executeProduction()` / `commitBlacksmithProduction()`;
- persistent NPC lifecycle: `NpcStateRegistry` snapshots;
- social pricing/material valuation: current trade catalog/value helpers where applicable.

Do not reuse:

- `merchantStock` for Blacksmith orders;
- `NpcAgent.carried` for persistent ordered output;
- `TransportOrder` for crafting commitments;
- Vue store as simulation state.

## 16. Important pitfalls

1. **Current ProductionDef is not a quality-instance factory.** Preserve atomicity while adding the smallest explicit output-instance seam.
2. **Only iron rods are currently a Blacksmith shared recipe.** Order catalog requires real additional recipes; trade stock is not equivalent to production capability.
3. **Materials cannot be both "available" and still freely consumable after order acceptance.** Commit them at acceptance unless implementing a genuine shared reservation layer.
4. **Household stock is shared.** Exact-instance pickup must not identify output only by item kind.
5. **Profile seeding must be once-only.** A deterministic reroll is still wrong if mutable base skill/experience later exists.
6. **Single-Blacksmith specialization must not narrow baseline coverage.**
7. **Do not let save/load reroll quality.** Seed quality from stable order/production identity, not current time or mutable inventory counts.
8. **Do not make order progress camera-dependent.** Detailed execution may require a loaded NPC, but persistent status/ownership must survive streaming.
9. **NPC death/cancellation policy is not defined by the plan.** Keep V1 conservative: block new orders for dead NPCs and preserve existing paid/ready state rather than silently deleting value. Do not invent inheritance/refunds in this plan.
10. **Do not route ordinary autonomous Blacksmith output through player-order state.** Both paths share recipes/executor, not lifecycle records.

## 17. Suggested implementation order

1. Add artisan types/profile generation + NpcState persistence and tests.
2. Add settlement-wide Blacksmith specialization allocation.
3. Extend `ProductionDef` with artisan metadata and add the small Blacksmith recipe set.
4. Add effective-skill/capability + deterministic quality resolver tests.
5. Thread artisan profile into one-time Blacksmith starter stock/material seeding.
6. Add persistent artisan-order state + acceptance transaction.
7. Integrate active order selection into `planBlacksmithWork()` / `commitBlacksmithProduction()`.
8. Add concrete output ownership and exact pickup.
9. Add dialogue/Vue projection last, revalidating on every commit.
10. Run focused tests, then `npx tsc --noEmit`, `pnpm run lint:fix`, `pnpm run test`, `pnpm run build`.

Browser/manual verification remains with the User.

## 18. Focused tests

In addition to plan tests, explicitly cover these architecture boundaries:

- `NpcStateSnapshot` round-trip preserves profile, mutable experience, orders and exact output id;
- restore/rebuild does not reseed profile or starter materials;
- one Blacksmith remains generalist despite specialization;
- multi-Blacksmith coverage is deterministic in stable NPC-id order;
- old `ProductionDef` without artisan metadata behaves unchanged;
- accepting an order is atomic across coins + material commitment + order creation;
- autonomous work cannot double-spend committed order inputs;
- reconstruction during `in_progress` does not recreate output;
- reconstruction during `ready` does not execute production again;
- exact ready instance survives save/load and transfers once;
- stale UI callback cannot collect twice or accept after inputs/coins changed;
- existing settlements-npcs-016 Blacksmith iron-rod production remains green.

# Implementation Notes: settlements-npcs-055 — Ordinary NPC Barter and Offer

**Plan:** `docs/plans/archive/settlements-npcs-055-ordinary-npc-barter-and-offer.md`  
**Reviewed:** 2026-09-20  
**Status:** `planned` 📋  
**Source of truth:** current `main` code + docs.

## 1. Current code delta and exact blocker

The UI is already shared, but ordinary NPC trade is deliberately BUY-only.

### UI gate

`src/ui-vue/screens/MerchantScreen.vue`

Current ordinary-NPC mode:

- `isNpcGoodsMode = ui.merchant.mode === 'npcGoods'`;
- compact BUY/OFFER tabs are wrapped in `v-if="isCompact && !isNpcGoodsMode"`;
- desktop OFFER section is wrapped in `v-if="!isNpcGoodsMode && ..."`;
- `clampStaleNpcGoodsTransaction()` explicitly clears `transaction.offer`;
- `netCoins` for `npcGoods` currently returns purchase cost only and ignores OFFER.

Do not add a second screen. Remove only the mode-specific assumptions above and make ordinary sessions supply the pricing/settlement callbacks the existing OFFER path already expects.

### App-layer blocker

`src/app/inventoryWiring.ts`

Current `settleNpcGoodsTransaction()` immediately rejects any non-empty `offer`:

```ts
if ((Object.values(offer) as number[]).some((count) => count > 0)) return 'invalid_offer'
```

The remainder already does the important ordinary-NPC live revalidation:

- resolves current NPC;
- calls `resolveNpcTradeOffers(npc, settlementNpcs)`;
- resolves authoritative owner via `npcTradeSourceInventory(...)`;
- rebuilds live purchase lines with `npcSalePrice(...)`;
- commits through `settleOwnedGoodsPurchase()`;
- calls `afterTrade()`.

Keep this live-resolution shape. Replace the BUY-only commit primitive, not the surrounding ownership lookup.

## 2. Ownership and storage routing

### Personal inventory

`src/settlement/npcState.ts::NpcAuthoritativeState.personalInventory`

This is the authoritative persistent personal-belongings inventory. It:

- survives stream-out/in and `WorldBundle` rebuild;
- round-trips through `NpcStateSnapshot.personalInventory`;
- is the same object exposed by live `NpcAgent.personalInventory`;
- defaults to `new Inventory()`, i.e. current default max weight = **20 kg** and max size = `Infinity`.

Do not create a barter-specific NPC inventory.

### Household fallback

`src/settlement/household.ts::Household.items`

This is already the authoritative generic household item store.

Important current constructor:

```ts
new Inventory(..., Infinity, ..., Infinity, STORED_FOOD_DECAY)
```

So household item storage is intentionally unbounded by weight and size. This makes it the correct fallback owner when personal inventory would be overloaded.

Use routing semantics:

```text
player offered line / instance
→ personalInventory if entire line fits
→ else own Household.items
→ else reject only when no household exists
```

Do not split one stack line between personal and household. Resolve one destination per line/instance before mutation. This keeps transaction replay/debugging deterministic and avoids partial "some apples in pocket, some at home" behavior caused only by capacity arithmetic.

For multiple lines in one basket, capacity simulation must account for earlier lines routed to the same personal inventory. Do not call `canAdd` independently against the unchanged initial state and accidentally overbook the 20 kg capacity.

Recommended approach: pre-resolve a plain destination plan with cumulative weight/size deltas, then commit it.

## 3. Reuse generic inventory-transfer primitives

`src/items/inventoryTransfer.ts`

Use these existing ownership moves during commit:

- `transferInventoryCount(source, destination, kind, n, nowDays)`
- `transferInventoryInstance(source, destination, instanceId)`

These already preserve:

- FIFO freshness through `removeWithFreshness` / `addWithFreshness`;
- exact instance identity;
- condition/quality/liquid state;
- destination capacity checks.

Do not implement stack transfer with raw `remove()` + `add()` for offered player goods.

This is particularly important because ordinary NPC OFFER may include perishable food, and `Household.items` has a different decay modifier from carried inventories.

## 4. Transaction-core shape

`src/items/trade.ts`

Do not try to force this through existing `settleOwnedGoodsPurchase()` unchanged. That helper is asymmetric:

```text
NPC-owned goods → player
player coins → paymentDestination
```

It has no destination plan for player-offered goods and no real NPC payout constraint.

Add a focused shared primitive for mixed explicit-owner trade. A suitable contract is conceptually:

```ts
type OwnedGoodsPurchaseLine = {
  kind
  count
  unitPrice
  source
  instanceIds?
}

type OfferedGoodsDestination =
  | { type: 'personal', inventory: Inventory }
  | { type: 'household', inventory: Inventory }

type OfferedGoodsLine = {
  kind
  count
  value
  destination
  instanceIds?
}

settleOwnedGoodsBarterTransaction({
  player,
  purchaseLines,
  offeredLines,
  npcWallet,
  nowDays,
})
```

Exact names may differ, but keep the following ownership roles explicit:

- player inventory;
- per-line purchase source (personal or household);
- offered-item destination (personal or household);
- NPC wallet = interacting NPC `personalInventory`.

Do not hide any of these behind global lookups inside `trade.ts`.

### Atomicity

The current transfer helpers are individually safe but are **not a multi-inventory transaction/rollback framework**.

Therefore preflight everything before any ownership mutation:

- source quantities/instances;
- destination capacity for player purchases;
- destination capacity for offered lines;
- player coin availability when net > 0;
- NPC real coin availability when net < 0.

Only after all checks pass should transfer calls begin.

Since live inventories can only mutate synchronously on the main thread during this call, a complete preflight followed immediately by deterministic transfers is sufficient; do not build a generic rollback manager for this plan.

## 5. Offer valuation and accepted kinds

`src/items/tradeCatalog.ts`

Existing primitives:

- `tradeValue(kind)`
- `canSell(kind)`
- `sellPrice(kind, context)`
- `resolveInstanceSellPrice(...)`
- `SellPriceContext`
- `relationshipEffect()`
- `reputationEffect()`

`src/items/trade.ts`

Existing:

- `resolveOfferLineBuyback()`
- `resolveOfferBuyback()`
- internal `computeNetCoins()`

Prefer reusing the same offer valuation that the Merchant screen already displays.

Current merchant semantics have two buckets:

- sellable kinds → social/condition-adjusted buyback value;
- non-sellable barter-only kinds → `tradeValue`.

Before enabling ordinary NPC OFFER, verify each accepted barter-only kind is safe to persist in `personalInventory` / `Household.items`.

Do not accept `coin` as an OFFER row. `MerchantScreen.vue::offerableKinds` already excludes `coin` and `shell`; preserve intentional exclusions unless current shared trade tests prove shell should remain a barter-only input.

If ordinary-NPC acceptance needs to be narrower than Merchant acceptance, implement a small pure policy helper in trade/tradeCatalog code rather than profession-specific lists.

## 6. Net coin settlement must use real NPC money

Merchant settlement currently allows a negative `netCoins` to add coins to the player without a merchant wallet owner.

Do not reuse that mutation behavior for ordinary NPCs.

For ordinary NPC trade:

```text
netCoins > 0
player → NPC.personalInventory

netCoins < 0
NPC.personalInventory → player
```

If `npcWallet.count('coin') < -netCoins`, return `cannot_afford` and mutate nothing.

The NPC wallet is also one possible offered-item destination, so preflight its final weight state coherently:

- received offered goods may increase weight;
- received player coins may increase weight/size;
- payout coins reduce inventory load.

Use final-state capacity arithmetic rather than assuming each operation fits in isolation.

## 7. Starter coin initialization — do not reuse the loadout latch blindly

### Important current lifecycle

`src/settlement/npcState.ts`

Fresh state:

```ts
personalInventory: new Inventory()
needsInitialPersonalLoadout: true
```

Snapshot restore:

```ts
personalInventory: inventoryFromContents(snapshot.personalInventory)
needsInitialPersonalLoadout: false
```

`src/ai/NpcAgent.ts` calls:

```ts
seedInitialPersonalBelongingsIfNeeded(
  this.personalInventory,
  this.role,
  npcState,
  this.id,
)
```

`src/ai/npcLoadout.ts::seedInitialPersonalBelongingsIfNeeded()` then sets the latch false.

Do **not** simply add coins inside this function with only `role` and `npcId`: starter wealth also needs settlement size and age/life-stage, which are available at settlement materialization time and should not be re-looked up globally.

### Recommended seam

`src/settlement/createSettlement.ts::materializeSettlementResident()` already has, at the same call site:

- `def.size`;
- `input.member.character.role`;
- `input.member.age`;
- `npcStateRegistry.getOrCreate(...)`;
- genuine-fresh vs restored state signaled by the authoritative state's one-time initialization latch.

Add a narrow deterministic wealth resolver, preferably in a focused settlements-NPC module such as:

`src/settlement/npcStartingWealth.ts`

Conceptual API:

```ts
resolveNpcStartingCoins({
  npcId,
  size,
  role,
  age,
}): number
```

and seed from the same first-creation lifecycle before/with personal loadout initialization.

### Latch choice

Do not infer freshness from `personalInventory.count('coin') === 0`.

Do not refill after spending.

Best options, in order:

1. generalize `needsInitialPersonalLoadout` to a runtime-only first-personal-state initialization latch if the rename stays narrow and all call sites are trivial;
2. otherwise add a second runtime-only `needsInitialStartingWealth` boolean on `NpcAuthoritativeState`, set true only in `createNpcAuthoritativeState()` and false in `fromSnapshot()`.

A separate wealth latch is safer than coupling "coins seeded" to whether weapon seeding happened first.

It does **not** need persistence: snapshot restore must always set it false because the persisted `personalInventory` is authoritative.

## 8. Starter wealth resolver

Reuse existing facts only.

### Settlement size

`src/settlement/families.ts::VillageSize`

Use exact baseline table:

```text
OUTPOST  50
SM       75
MD      100
LG      125
XL      150
```

### Elder status

Do not create `isElder` state.

Reuse `src/settlement/npcPhysicalProfile.ts::lifeStageForAge(age)`, exactly as `npcSocialTitle.ts` and `families.ts` already do.

Treat `elderly | veryElderly` as the elder modifier input.

### Role modifier

`src/ai/characters.ts::Role` currently includes:

`woodcutter | farmer | guard | trader | miner | fisher | hunter | blacksmith | shepherd | textile_worker | herbalist`.

Keep role modifiers small and explicit.

Recommended V1 calibration:

```text
trader       +25
blacksmith   +15
guard        +5
all others    0
elder        +10
```

Clamp the final value to a narrow range, e.g. `40..180`.

This keeps MD ordinary residents around 100, satisfies the gameplay intent, and avoids inventing a full socioeconomic hierarchy.

If implementation chooses slightly different values after tests, keep the same shape and bounds; do not add randomness large enough to dominate settlement size.

### Determinism

There is no need for random jitter in V1. Size + role + elder status is already deterministic and understandable.

If a small jitter is added, isolate it by `npcId` with a dedicated salt; never consume settlement/family RNG streams.

## 9. UI pricing/session wiring

`src/ui-vue/store.ts::MerchantPricing`

The existing interface already contains everything the OFFER UI needs:

- `context`;
- `unitOfferPrice(kind)`;
- `offerLineTotal(kind, count)`;
- `previewNetCoins(...)`.

Do not create `NpcBarterPricing`.

`src/app/inventoryWiring.ts::createMerchantPricing(npc)` already builds these callbacks from the actual NPC social context and player inventory.

Generalize naming only if needed. The callback math can be reused for `npcGoods`, but ordinary-NPC preview must not imply unlimited payout money.

Add an ordinary-NPC preview clamp/indicator only if current transaction panel materially misleads the player when offer value exceeds NPC cash. The commit remains authoritative regardless.

Minimum acceptable V1: preview same valuation, commit returns `cannot_afford` if NPC cash is insufficient.

## 10. MerchantScreen changes

`src/ui-vue/screens/MerchantScreen.vue`

Required edits:

- allow compact OFFER tab in `npcGoods`;
- allow desktop OFFER column in `npcGoods`;
- ordinary layout becomes 3-column when not compact, same as Merchant unless horse/special layout requires no change;
- remove the code in `clampStaleNpcGoodsTransaction()` that treats any `transaction.offer` as stale solely because mode is `npcGoods`;
- clamp ordinary offers against current player-owned counts exactly like merchant mode;
- make `netCoins` call session pricing preview for `npcGoods` instead of returning purchase-only cost;
- leave `npcGoodsBuyEmptyCopy()` scoped to empty BUY stock only; it must not imply the whole trade session is unusable when OFFER is available.

Keep:

- horse offer rendering merchant-only;
- Merchant-specific stock semantics;
- NPC display-name screen title.

## 11. Household fallback and trade availability are separate concerns

Do not feed player-offered household fallback items into `resolveNpcTradeOffers()` automatically.

`src/ai/npcTradeAvailability.ts` controls what an NPC is willing/allowed to **sell to the player**, including reserves and profession stock.

Received player barter items entering `Household.items` are ownership state only.

They become sellable later **only if the existing trade-availability policy already allows that kind and quantity**.

This avoids creating a hidden instant-resale loop just because household storage received an item.

## 12. Tests to add first

### Starting wealth

Best location: new focused `npcStartingWealth.test.ts` + lifecycle assertions in `npcState.test.ts` / settlement materialization tests.

Cover:

- OUTPOST/SM/MD/LG/XL baselines;
- Trader > ordinary same settlement;
- Blacksmith > ordinary same settlement;
- elder modifier derived from `lifeStageForAge`;
- clamp bounds;
- same inputs → same coins;
- fresh state receives coins once;
- reconstruct same state → no duplicate coins;
- snapshot with 0 coins remains 0 after restore;
- snapshot with arbitrary remaining balance preserves exact balance.

### Mixed transaction core

Use `src/items/trade.test.ts`.

Cover:

- BUY only still works;
- OFFER only works if allowed;
- BUY + OFFER + remaining player coins;
- excess OFFER payout uses NPC-owned coins;
- NPC insufficient payout coins → no mutation;
- personal inventory fit → offered item lands personal;
- personal inventory over capacity → line lands household;
- no household + no personal capacity → no mutation;
- multiple offered lines cannot cumulatively overbook personal capacity;
- perishable stack transfer preserves freshness;
- instance-backed transfer preserves exact id/quality/condition;
- purchase source and offer destination may be the same household without corruption;
- source/reserve change before app-layer commit remains rejected.

### UI/app regression

`src/ui-vue/npcDialogueTrade.test.ts` plus focused MerchantScreen tests if present.

Cover:

- ordinary NPC opens `npcGoods` with non-null pricing;
- ordinary OFFER is accepted by app wiring;
- Trader still opens `merchant`;
- empty NPC BUY stock still opens trade;
- ordinary NPC offer basket is not erased by stale-clamp logic;
- merchant horse/barter regressions remain green.

## 13. Files likely to change

Primary:

- `src/items/trade.ts`
- `src/items/trade.test.ts`
- `src/items/inventoryTransfer.ts` only if a narrow helper is genuinely missing
- `src/app/inventoryWiring.ts`
- `src/ui-vue/store.ts`
- `src/ui-vue/screens/MerchantScreen.vue`
- `src/settlement/npcState.ts`
- `src/settlement/createSettlement.ts`
- `src/ai/npcLoadout.ts` only if the first-personal-state latch is generalized

Recommended new focused module:

- `src/settlement/npcStartingWealth.ts`
- `src/settlement/npcStartingWealth.test.ts`

Read/reuse:

- `src/items/tradeCatalog.ts`
- `src/items/inventoryTransfer.ts`
- `src/ai/npcTradeAvailability.ts`
- `src/settlement/household.ts`
- `src/settlement/npcPhysicalProfile.ts`
- `src/ai/characters.ts`.

## 14. Guardrails

- No second Merchant/NPC trade screen.
- No household wallet.
- No settlement treasury.
- No invisible barter sink.
- No coin refill based on low balance.
- No `count('coin') === 0` initialization heuristic.
- No new social-rank state model.
- No profession-specific barter transaction path.
- No automatic exposure of every received household item for resale.
- No raw remove/add for perishable barter transfer.
- No instance recreation.
- No browser verification by the AI agent.

Important new public architectural helpers should have JSDoc and `@domain settlements-npcs` where useful to preflight discovery.

## 15. Recommended implementation order

1. Add `npcStartingWealth` resolver + unit tests.
2. Wire one-time wealth seeding at authoritative NPC first-creation lifecycle + persistence regressions.
3. Add mixed explicit-owner barter transaction tests in `trade.test.ts`.
4. Implement pre-resolved offered-goods destinations and real NPC wallet settlement in `trade.ts`.
5. Reuse `inventoryTransfer.ts` for stack/instance moves.
6. Replace BUY-only `settleNpcGoodsTransaction()` path in `inventoryWiring.ts`, preserving live offer/source/reserve revalidation.
7. Pass existing pricing callbacks into `npcGoods`.
8. Remove `npcGoods` OFFER restrictions/stale clearing in `MerchantScreen.vue`.
9. Run focused trade/NPC-state/UI tests, then typecheck/lint/build/full repository checks required by the repo.
10. User performs browser verification.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

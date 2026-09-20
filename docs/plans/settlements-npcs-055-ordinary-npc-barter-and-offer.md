# Plan: Ordinary NPC Barter and Offer

**Created:** 2026-09-20
**Status:** `planned` 📋
**Priority:** high · **Effort:** M
**Depends on:** ~~settlements-npcs-033~~
**Domain:** `settlements-npcs`
**Type:** feature
**Subdomains:** `economy` `household`
**Tags:** `trade` `barter` `ownership`
**Roadmap:** -

## Goal

Enable the existing **OFFER / barter** side of the shared Merchant Screen for ordinary NPC trade sessions (`mode: 'npcGoods'`) without introducing a second trade subsystem or deleting offered player items.

Today the shared screen already supports mixed BUY + OFFER transactions for Traders, but ordinary NPC sessions are intentionally BUY-only:

- `src/ui-vue/screens/MerchantScreen.vue` hides the OFFER column/tab when `ui.merchant.mode === 'npcGoods'`;
- `src/app/inventoryWiring.ts::settleNpcGoodsTransaction()` rejects any non-empty player `offer`;
- `src/ui-vue/store.ts` documents `npcGoods` as BUY-only;
- plan `settlements-npcs-033` explicitly deferred ordinary-NPC barter until offered player goods had an authoritative destination.

This plan closes that ownership gap while preserving the current shared trade UI, live stock/reserve rules and ordinary NPC ownership model.

## Player-facing result

When trading with an ordinary NPC such as a Hunter, Blacksmith or Farmer:

- the same Merchant Screen shows **BUY** and **OFFER**;
- the player may combine offered goods and coins in one transaction;
- offered goods transfer to a real persistent NPC/household inventory;
- the transaction remains all-or-nothing;
- live stock, protected reserves, pricing and instance identity are revalidated at commit;
- empty NPC sell stock does not remove the OFFER side: the NPC may still accept player goods according to the acceptance policy.

Trader behavior and merchant specials remain unchanged.

## Current architecture to reuse

### Shared UI/session

`src/ui-vue/screens/MerchantScreen.vue`

Already owns:

- BUY and OFFER columns/tabs;
- player inventory-derived offer rows;
- mixed transaction basket;
- compact layout switching;
- transaction summary;
- stale-basket clamping;
- `onSettleTransaction(purchases, offer, instanceIds)`.

Do not fork the screen for ordinary NPCs.

`src/ui-vue/store.ts`

Existing `MerchantState` / `MerchantMode = 'merchant' | 'npcGoods'` is the session state boundary. Keep Vue state as plain data/callbacks; do not pass `Household`, state registries or settlement managers into Vue.

### Ordinary NPC stock and live ownership

`src/ai/npcTradeAvailability.ts`

Existing `resolveNpcTradeOffers()` and `npcTradeSourceInventory()` resolve ordinary NPC sellable goods, quantities and authoritative source ownership.

This remains authoritative for goods moving:

```text
NPC / Household → Player
```

Do not broaden sellable stock merely to implement barter.

### Transaction core

`src/items/trade.ts`

Existing mechanisms to extend/reuse:

- `settleOwnedGoodsPurchase()` for explicit-owner NPC → player transfer;
- merchant mixed transaction arithmetic;
- `resolveOfferBuyback()`;
- deterministic instance selection;
- stack + instance-backed transfer semantics;
- inventory/capacity preflight;
- shared trade result codes.

The new ordinary-NPC mixed transaction must live here (or be a narrow extension/extraction here), not in Vue.

### Pricing/social context

`src/items/tradeCatalog.ts` and `src/app/inventoryWiring.ts`

Reuse existing:

- `tradeValue()`;
- `sellPrice()`;
- `resolveOfferLineBuyback()`;
- `SellPriceContext`;
- relation/reputation-derived trade context.

Do not add profession-specific barter prices.

## Ownership decision

### Destination for player-offered goods

Ordinary NPC barter must not use the merchant behavior where offered goods can effectively disappear from world ownership.

Use one explicit recipient rule:

```text
player OFFER goods
→ interacting NPC personalInventory
```

The interacting NPC is the counterparty and already owns persistent `personalInventory`, including coin payment from ordinary NPC trade. This gives every accepted offered item one concrete, persistent owner without inventing a household wallet, settlement stock sink or generic market inventory.

Do **not** route offered items into `Household.items` in this plan. Household stock has production/reserve semantics and automatically mixing arbitrary player goods into it would blur production goods, reserves and shared-family ownership.

### Capacity

The recipient `personalInventory` must pass capacity preflight before any mutation.

If the NPC cannot accept all offered goods:

- return a typed trade failure using the existing trade result contract where practical;
- mutate neither player inventory, NPC/household sell stock, NPC inventory nor coins.

Do not silently drop overflow or redirect it to another owner.

## Acceptance policy

Not every player-owned item must automatically become acceptable barter.

Reuse the existing trade valuation/sellability policy used for the OFFER side where possible:

- `coin` is payment currency, not an offered item row;
- kinds already valid under existing merchant OFFER/buyback semantics remain candidates;
- preserve exclusions such as quest/private/non-tradeable items;
- instance-backed offered items must transfer exact instances;
- barter-only valuation (for kinds not sold for normal buyback coins) may contribute to payment only if the existing shared trade rules already support it.

If current `resolveOfferBuyback()` accepts a kind only because merchant trade can destroy/sink it without ownership, tighten the ordinary-NPC acceptance path rather than allowing ownership loss.

Prefer one explicit helper/policy such as:

```text
canNpcAcceptTradeOffer(kind)
```

only if the existing shared `canSell` / trade-value rules cannot express the required distinction cleanly.

Do not create profession-specific acceptance lists in V1.

## Transaction contract

Add/reuse one authoritative mixed ordinary-NPC transaction path with inputs conceptually equivalent to:

```text
buyer/player inventory
NPC goods source inventories
NPC payment/offer destination personalInventory
resolved live purchase lines
player offer basket / exact instances
current social pricing context
```

The commit sequence must preflight all participants first, then mutate once.

Required preflight:

1. interacting NPC still exists and is alive/available;
2. each requested NPC purchase row still resolves from `resolveNpcTradeOffers()`;
3. live owner/source inventory still holds requested quantity/instances;
4. protected reserve still allows the quantity;
5. current NPC sale price is re-resolved;
6. player offer quantities/instances still exist;
7. offered kinds are acceptable;
8. NPC `personalInventory` can receive all offered goods plus/minus coin effects;
9. player inventory can receive purchased goods and resulting coin delta;
10. net payment is affordable.

Then atomically:

```text
NPC/household goods → player
player offered goods → NPC personalInventory
coins → whichever side is owed the net balance
```

No partial mutations.

## Net settlement semantics

Preserve the existing mixed-transaction model rather than implementing two sequential transactions.

Conceptually:

```text
purchase total
- accepted offer value
= net coin delta
```

If offer value is lower than purchase cost:

- player pays the remaining coins to the interacting NPC.

If accepted sellable offer value exceeds purchase cost:

- the NPC may owe coins to the player **only if the NPC actually owns sufficient coins**.

Ordinary NPCs must not mint payout coins.

Therefore the ordinary-NPC path differs from the current merchant sink/source semantics:

- coin payment from player → NPC uses real `personalInventory`;
- coin payout from NPC → player requires real NPC coins;
- insufficient NPC coins blocks the transaction atomically.

This keeps the world economy ownership-preserving and prevents ordinary NPCs becoming infinite cash sources.

## UI changes

`src/ui-vue/screens/MerchantScreen.vue`

Remove the `npcGoods` presentation restriction that hides OFFER:

- compact BUY/OFFER tabs should be available in ordinary NPC sessions;
- desktop grid should include OFFER for ordinary NPC sessions;
- transaction panel should include both purchase and offer lines;
- `canTrade`, preview and reset behavior should work identically across modes.

Keep merchant-only features separately gated:

- horse offers;
- merchant catalog semantics;
- merchant-specific stock/pricing callbacks.

The screen title may remain the NPC display name for `npcGoods`.

### Offer price callbacks

Ordinary NPC sessions currently pass `pricing: null`. Extend the session so OFFER rows have authoritative preview pricing without turning `npcGoods` into merchant catalog mode.

Prefer reusing `MerchantPricing` or renaming/generalizing it only if needed. Avoid a parallel `NpcBarterPricing` interface with duplicate callbacks.

Preview is non-authoritative; commit still re-resolves current values.

## App wiring

`src/app/inventoryWiring.ts`

### Open

For an ordinary NPC:

- build current NPC sell stock as today;
- build current trade/social pricing callbacks for OFFER preview;
- open `npcGoods` with both BUY and OFFER capability.

### Commit

Replace the current guard:

```ts
if ((Object.values(offer) as number[]).some((count) => count > 0)) return 'invalid_offer'
```

with the mixed authoritative transaction flow.

Keep live re-resolution already used by `settleNpcGoodsTransaction()`.

### Refresh

After successful trade:

- rebuild player counts/groups;
- rebuild live NPC trade stock;
- keep ordinary NPC pricing callbacks current;
- clear or clamp stale basket state through the existing screen/session lifecycle.

Do not persist any UI transaction state.

## Instance-backed items

Player-offered weapons, armor, tools or other instance-backed items must preserve exact identity.

Do not:

- recreate instances;
- reset condition/quality;
- convert instances into stack counts.

Use concrete instance ids selected from the player's current inventory and transfer those exact instances into NPC `personalInventory`.

If the existing UI offer basket tracks only `kind -> count`, reuse the deterministic worst-condition selection already used by shared trade code unless the current Merchant screen already supplies explicit instance ids for OFFER. Do not add instance picking UI in this plan.

## Persistence and lifecycle

No new save schema should be required.

Persistence must derive from existing authoritative inventories:

- player Inventory;
- household/personal source inventories for goods sold to player;
- NPC `personalInventory` for received offer goods and coins.

Trade session state remains ephemeral.

Save/load, world rebuild and NPC streaming must not duplicate or reseed received barter goods.

## Performance

No new global scans or economy tick.

Barter work occurs only:

- when opening/refeshing the current trade session;
- when previewing the current basket;
- during commit-time revalidation.

Resolve only the interacting NPC and already-known household/source inventories.

## Tests

### Transaction core

Add focused tests proving:

- ordinary NPC mixed BUY + OFFER succeeds atomically;
- player offer goods move into NPC `personalInventory`;
- stack goods preserve exact counts;
- instance-backed goods preserve exact instance identity/condition;
- insufficient player coins after offer value → zero mutation;
- insufficient NPC coins when offer value exceeds purchase total → zero mutation;
- NPC destination full → zero mutation;
- player destination full → zero mutation;
- source stock/reserve changes before commit → zero mutation;
- stale/missing player offer item before commit → zero mutation;
- repeated commit cannot duplicate goods or coins.

### Valuation / policy

Prove:

- accepted ordinary-NPC offer kinds receive the same deterministic shared valuation expected by the trade model;
- excluded/non-tradeable kinds cannot enter the transaction;
- no deterministic buy→offer arbitrage is introduced for the same NPC/social context;
- ordinary NPC cannot mint coins for excess offer value.

### UI/session

Cover:

- `npcGoods` exposes OFFER on desktop;
- compact `npcGoods` exposes BUY/OFFER tabs;
- ordinary NPC offer price preview is populated;
- BUY-only empty stock still leaves OFFER usable when player has acceptable goods;
- successful commit refreshes both player and NPC stock state;
- Trader `merchant` behavior and specials remain unchanged.

### Regression

Keep green:

- `settlements-npcs-033` ordinary NPC purchase flow;
- Hunter/household protected reserve behavior;
- profession trade stock from 040;
- merchant stock and barter tests;
- horse purchase barter;
- save/load inventory tests.

## Acceptance criteria

- Ordinary NPC trade sessions show the existing OFFER/barter UI.
- Player can settle one mixed NPC purchase using acceptable goods plus coins.
- Every offered player item has an authoritative persistent owner after commit.
- Offered goods go to the interacting NPC's `personalInventory`.
- NPC payouts use real owned coins; no ordinary NPC coin minting.
- NPC sell stock still comes from existing live owner/reserve resolution.
- Stack and instance-backed ownership are preserved exactly.
- Commit is all-or-nothing across player inventory, NPC/household source stock, NPC personal inventory and coins.
- Merchant-specific stock and specials are unchanged.
- No second trade UI, transaction subsystem, market inventory, household wallet or save schema is introduced.
- Empty NPC sell stock does not disable the OFFER side.
- Browser verification is left to the user.

## Out of scope

- negotiation/minigame;
- profession-specific barter preferences;
- dynamic supply/demand;
- NPC↔NPC trade;
- household shared wallet;
- settlement treasury;
- automatically routing accepted goods into production/household stock;
- NPC resale of received player goods through production/economy systems;
- merchant caravans;
- credit/debt;
- item-by-item manual instance selection UI;
- broader refactor/rename of Merchant Screen unrelated to this capability.

## Likely implementation files

Primary:

- `src/items/trade.ts`
- `src/items/tradeCatalog.ts`
- `src/app/inventoryWiring.ts`
- `src/ui-vue/store.ts`
- `src/ui-vue/screens/MerchantScreen.vue`

Likely tests:

- `src/items/trade.test.ts` or current focused trade test modules;
- `src/ui-vue/npcDialogueTrade.test.ts`;
- focused Merchant Screen/session tests if currently present.

Read/reuse:

- `src/ai/npcTradeAvailability.ts`
- NPC state/personal inventory ownership and persistence code
- existing merchant transaction/horse barter tests.

Do not modify production recipes, profession work logic or household stock generation unless a test exposes a genuine ownership-contract bug required by this plan.

## Suggested implementation order

1. Add focused tests for ordinary-NPC offer ownership and net coin settlement.
2. Extend/extract the shared transaction core for mixed explicit-owner NPC trade.
3. Wire live revalidation and real NPC coin/offer ownership in `inventoryWiring.ts`.
4. Generalize ordinary-session pricing callbacks in `store.ts` / app wiring.
5. Remove `npcGoods` OFFER presentation gates in `MerchantScreen.vue`.
6. Add UI/session regressions and merchant regressions.
7. Run targeted tests, typecheck, lint/build and full repository-required checks.
8. Leave browser/manual verification to the user.

Important new public architectural helpers should receive JSDoc and `@domain settlements-npcs` where useful for preflight discovery.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

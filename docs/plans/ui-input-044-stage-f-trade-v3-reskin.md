# Plan: Stage F — Trade V3-identical reskin + V1 filters

**Created:** 2026-10-27  
**Status:** `verification needed` 🔍
**Implemented at:** 2026-10-27  
**Type:** polish  
**Priority:** high · **Effort:** M  
**Depends on:** ~~ui-input-039~~ ~~ui-input-040~~ ~~ui-input-041~~ ~~ui-input-042~~ ~~ui-input-043~~  
**Domain:** `ui-input`  
**Subdomains:** `merchant` `trade` `presentation`  
**Tags:** `v1-revival` `stage-f` `trade` `d5` `d4` `d9`

## Cel

Przeprojektować wygląd Merchant / npcGoods na look **identyczny** z V3 Trade* + warm scoped tokeny, zachowując V1 basket / settlement / horse / capability + price-tier filters. Demo D9 na wspólnych leafach. Bez zmiany schema/save.

## Autorytet

- Zaakceptowana propozycja: [2026-10-27--stage-f-trade-ui-proposal.md](../research/v1-revival/2026-10-27--stage-f-trade-ui-proposal.md) (ACCEPTED 2026-10-27).
- Kontrakt: [draft-stages §5](../research/v1-revival/2026-10-26--ui-migration-draft-stages.md#5-later-slices-and-release-gates).
- Decyzje: D0/D4/D5(Stage F = V3-identical)/D6/D9.

## Zakres

- `MerchantScreen.vue` — V3 grid (`1fr 1fr 18rem`), compact tabs + drawer bar; keep horse cards / npcGoods.
- `MerchantFilterBar.vue` — V3 structure: category pills + search + capability/price/sort selects (capability as dropdown to save vertical space).
- `MerchantItemRow.vue` — TradeRow-like always-visible steppers / committed `bg-primary/10`.
- `MerchantTransactionPanel.vue` — TransactionPanel-like summary + muted disabled Handluj.
- `MerchantTabButton.vue` — V3 rounded-full tabs.
- Scoped `.sv-merchant` in `tailwind.css`.
- Standalone demo `merchant-demo.html` + fixtures.

## Poza zakresem

Dialogue, Character/inventory/QA/HUD beyond token reuse, settlement owners, save schema, donor Account mutation, map/menu, artisan redesign, A–E re-litigation.

## Guardrails

- V1 `onSettleTransaction` / horse `onPurchase` / overlay stack stay authoritative.
- No second overlay owner; no donor Account payloads.
- D4: muted readable chrome for dense disabled chips.
- Polish copy + V1 category/capability/price semantics.

## Verification

- `pnpm type-check`; focused lint; `pnpm build` if entry/styles.
- Browser (autor): BUY/OFFER filters incl. capability + price select, basket settle, horse, npcGoods empty, Esc/stack — visual PASS only after author screenshots.
- Demo: no world bootstrap; shared leaves; no save writes.

## Rollback

Revert Stage F presentation (+ demo entry). Basket/settle/horse/save intact.

## Follow-ups (author 2026-10-27)

1. **Currency:** ~~open~~ **done** 2026-10-27 — presentation-only `formatCoins` (`coin` = copper); Stage F leaves + demo.
2. **Capability filter:** ~~open~~ **done** 2026-10-27 — custom dropdown (`MerchantFilterDropdown.vue`); price/sort remain `<select>`.

See [NEXT-SESSION--stage-f-followups.md](../research/v1-revival/NEXT-SESSION--stage-f-followups.md). Visual PASS still author.

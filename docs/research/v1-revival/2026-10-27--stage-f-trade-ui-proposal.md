# Stage F — Trade UI proposal (`MerchantScreen` + basket chrome)

**Created at:** 2026-10-27  
**Created by:** Cursor (Composer)  
**Updated at:** 2026-10-27  
**Updated by:** Cursor (Composer)  
**Status:** **IMPLEMENTED** (2026-10-27) — ACCEPTED earlier same day (D5 = V3-identical Trade look; V1 capability + price-tier on V3 filter chrome). Plan `ui-input-044-stage-f-trade-v3-reskin`. Visual PASS pending author screenshots.

**Target:** `jm-sky/seedvale-v1` (`legacy/seedvale`)  
**Design donor:** V3 `TradePanel` / `MerchantScreen` / `TradeColumn` / `TradeRow` / `TradeFilterBar` / `TransactionPanel` / `TransactionDrawer` presentation only — adapt to V1 basket; **never** apply donor Account / `commit(player, merchant)`.

## Podsumowanie dla autora (PL)

Stage F przeprojektowuje **wygląd** handlu (Merchant / npcGoods) na look **identyczny** z V3 Trade*, przy zachowaniu V1 basket / `onSettleTransaction` / horse / filtrów. Filter bar: V3 chrome (category pills + search + price/sort selects) **plus** drugi rząd capability pills (V1). Bez zmiany settlement / inventory / save. Demo D9 na wspólnych leafach.

**Zaakceptowane 2026-10-27** (autor): Stage F = Trade; D5 = dokładnie V3; capability + price tiers zachowane (price jako V3 `<select>`, capability jako pills); D4 muted readable chrome; D6 bez zmian kluczy/stack.

---

## Reading route and pins

- [UI migration research / decision register](./2026-10-26--ui-migration-research.md)  
- [Draft later slices §5](./2026-10-26--ui-migration-draft-stages.md#5-later-slices-and-release-gates)  
- Stage A–E: proposals + `ui-input-039`…`043` (visual PASS)

**Author decisions (do not re-ask):** D0/D1/D2/D3/D4/D5(A–E)/D6/D9; **D5 Stage F** = V3-identical Trade chrome + warm scoped tokens; V1 capability + price-tier semantics on V3 filter presentation; map/menu deferred.

## 1. Layout (D5)

```
Wide (C1) — .sv-merchant
┌──────────────────────────────────────────────────────────────┐
│ Kupiec | Imię NPC              Monety: N          [Zamknij]  │
├────────────────┬────────────────┬────────────────────────────┤
│ BUY            │ OFFER          │ Transakcja (~18rem)        │
│ [cat pills]    │ [cat pills]    │ BUY / OFFER lines + ✕      │
│ [Szukaj][cap]  │ [Szukaj][cap]  │ net / po transakcji        │
│ [cena][sort]   │ [cena][sort]   │ [✓ Handluj]                │
│ [Horse cards]  │ TradeRow-like  │                            │
│ TradeRow-like  │                │                            │
└────────────────┴────────────────┴────────────────────────────┘

Compact (M1): [BUY|OFFER] rounded-full tabs → one column →
  in-flow Transaction bar → drawer with TransactionPanel
```

## 2. Filter bar contract

```
[ category pills — V3 rounded-full; V1 ids + Polish labels ]
[ Search… ] [ capability <select> ] [ price <select> ] [ sort <select> ]
```

| Dimension | Presentation | Semantics |
| --- | --- | --- |
| Category | V3 pill row | V1 `CategoryFilter` |
| Capability | V3 `<select>` (hide when only `all`) | V1 `CapabilityFilter` + `CAPABILITY_LABEL` |
| Price | V3 `<select>` | V1 bands `all` / `low`≤10 / `mid` 11–25 / `high` >25 |
| Sort | V3 `<select>` | V1 `TradeSortMode` per BUY/OFFER |
| Search | V3 input | Existing V1 matchers |

Shell width: `max-w-7xl` / `min(1360px, …)` (author tweak after landing).

State: `useMerchantTradeState` (independent BUY/OFFER). No second basket.

## 3. Boundary (unchanged wiring)

**Owned presentation:** `MerchantScreen.vue`, `MerchantFilterBar.vue`, `MerchantItemRow.vue`, `MerchantTransactionPanel.vue`, `MerchantTabButton.vue`, drawer chrome, scoped `.sv-merchant` in `tailwind.css`.

**Read-only:** `useMerchantTradeState`, `inventoryWiring` settle/horse, `merchantTrade.ts`, `items/trade.ts`, store `configureMerchant` / open/refresh/close, Esc/`useOverlayScreen` (`merchant`, `merchant-drawer`, `merchant-item-details`), Polish copy, horse cards, npcGoods empty copy, `MerchantItemDetailsModal` (style-light only if needed).

## 4. Unavailability (D4 adapted)

- Native `disabled` + no dispatch where controls exist.
- Dense chips / locked Handluj: muted readable chrome (Stage C–E), not literal `opacity-5`.
- Rows with no trade price stay rendered when applicable; never hide V1 stock.

## 5. D9 demo

Standalone Vite entry `merchant-demo.html` + `src/ui-vue/demos/merchant/`: shared presentation leaves; fixtures for merchant stock, npcGoods empty, capability filter visible, cannot_afford / disabled Handluj, horse card (demo-local); labeled callbacks; no world/save/WorldBundle.

## 6. Acceptance / verification

Preserve exact identity purchases, finite goods/coins, NPC household fallback, social prices, horse purchase path, artisan sibling screen untouched. Focused type-check/lint + `pnpm build` if entries/styles. Author screenshots for visual PASS.

## 7. Out of scope

Dialogue (D0), Character/inventory/QA/HUD re-litigation, settlement/inventory/save schema, donor Account mutation, map/menu/D7, artisan redesign.

## 8. Closure

**Accepted for implementation** 2026-10-27 by the author. **Landed** 2026-10-27 (`ui-input-044`). Visual PASS after author screenshots of live Merchant + `merchant-demo.html`.

## 9. Follow-ups (author 2026-10-27)

1. **Currency:** **done** 2026-10-27 — UI-only `formatCoins` (`coin` = copper); no save/schema change.
2. **Capability filter:** **done** 2026-10-27 — custom dropdown (not `<select>`); price/sort stay native selects.

Kick-off / notes: [NEXT-SESSION--stage-f-followups.md](./NEXT-SESSION--stage-f-followups.md). Visual PASS still author screenshots.

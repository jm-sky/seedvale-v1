# Plan: Stage A — Item-details V3 reskin

**Created:** 2026-10-26
**Status:** `done` ✅
**Closed:** 2026-10-26 — author visual PASS
**Type:** polish
**Priority:** high · **Effort:** M
**Depends on:** -
**Domain:** `ui-input`
**Subdomains:** `inventory` `presentation`
**Tags:** `v1-revival` `stage-a` `item-details` `d5`

> **Inventory revision — 2026-10-27:** Historical completion/visual PASS below is retained. For the subsequent inventory revision, the [D2(c)/D5 contract](../research/v1-revival/2026-10-27--inventory-hybrid-three-panel-contract.md) supersedes the old kind-list, desktop two-column/nested-modal and unchanged-details-navigation constraints. Use its [Cursor handoff](../research/v1-revival/2026-10-27--inventory-hybrid-cursor-handoff.md). New implementation and visual acceptance remain pending; do not reopen or relabel this completed historical plan.

## Cel

Przeprojektować wyłącznie `InventoryScreenItemDetails` tak, by **wygląd karty był identyczny z V3 `ItemDetailCard`**, przy zachowaniu V1 pól, akcji, nawigacji lista↔szczegóły oraz callbacków `ui.inventory.on*`. Dodać niezależne demo D9 na tych samych komponentach prezentacji.

## Autorytet

- Zaakceptowana propozycja: [2026-10-26--stage-a-item-details-ui-proposal.md](../research/v1-revival/2026-10-26--stage-a-item-details-ui-proposal.md) (ACCEPTED 2026-10-26; D5 = V3-identical look).
- Kontrakt: [draft-stages §2](../research/v1-revival/2026-10-26--ui-migration-draft-stages.md#2-stage-a--one-real-item-details-slice).
- Decyzje: D0/D1/D3/D4/D9; D5 accepted as identical V3 card chrome + V1 data.

## Zakres

- Reskin `InventoryScreenItemDetails.vue`.
- Nowe leaves `src/ui-vue/components/items/` (ItemDetailCard, ItemInstanceMeters, StatBar, QualityTag) — props V1, look V3; bez `@/game/data` / donor stores / repair / QualityPicker.
- Pure adapter `buildItemDetailPresentation` + testy (Stan vs Napełnienie vs Ostrość vs armor-without-wear vs missing ≠ zero).
- Scoped `.sv-item-detail` tokeny w `tailwind.css`.
- Opcjonalne ilustracje z `docs/v3-donor/items/illustrations` (display-only).
- Standalone demo (Vite entry) z fixtures + lokalnymi callbackami.

## Poza zakresem

Stage B, character/HUD/trade/map, globalny reskin, V3 dialogue, zmiany `createApp` / `inventoryWiring` / save / schema, free Repair / QualityPicker.

## Guardrails

- Nawigacja i emit `return-to-list` bez zmian.
- D4: `disabled` + dokładnie `opacity-5` + powód obok; placeholdery DPS/wear/lore podpisane; nigdy sfabrykowane wartości.
- Brak mutacji inventory przy samym otwarciu/wyborze szczegółów.

## Verification

- `pnpm type-check`; focused lint; istniejące inventoryView/itemUse/equipment/weaponMaintenance + nowe testy adaptera; `pnpm build` jeśli entry/asset.
- Browser (autor): I → food/liquid/weapon/armor/book/utility; lista↔details; jedna realna akcja; screenshoty V1/adapted/V3 — visual PASS tylko po werdykcie autora.
- Demo: bez world bootstrap; te same komponenty; brak zapisu save.

## Rollback

Revert presentation commit; handlery nietknięte.

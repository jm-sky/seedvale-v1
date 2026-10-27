# Inventory D2(c)/D5 — implementation handoff

**Created at:** 2026-10-27  
**Created by:** Cursor (Composer)  
**Status:** Implementation landed in working tree; automated checks green for focused suites; **author visual PASS pending**. Historical Stage A/B visual PASS unchanged.  
**Updated at:** 2026-10-27 — detail `#controls` aligned with V3 `InstanceMeters` (QualityTag + Wartość/`formatCoins` + condition bars) under the description, before stats.  
**Updated at:** 2026-10-27b — detail stats grid mirrors V3 groups (`main`/`resist`/`body`/`value` + V1 `extra`): no `Ilość` on instance weapons; ammo = primary kind + owned sum; donor-only Klasa/Materiał/Trwałość/DPS as disabled placeholders.  
**Updated at:** 2026-10-27c — read-only **Amunicja** under EquipmentPanel „Założone” (V3 AmmoPanel placement; V1 auto fire order; no preference UI).  
**Base HEAD:** `58501504e1be06d49f36d5d31685d41daec0cc2e` (`test(npc): lock spatial checkpoint and reification contracts`)  
**Authority:** [three-panel contract](./2026-10-27--inventory-hybrid-three-panel-contract.md)

## Changed boundaries

| Area | Files |
| --- | --- |
| Hybrid projection | `src/ui-vue/components/items/inventoryPresentation.ts` (+ tests) |
| Shared leaves | `InventoryList.vue`, `InventoryItemDetails.vue`; `EquipmentPanel` selection-only + `AmmoSection`; `ItemDetailCard` optional Powrót; `ammoSectionView` |
| Live screen | `InventoryScreen.vue` V3 two-column ≥1200 (details above equipment) / narrow List–Details; thin adapters |
| View fields | `inventoryView.ts` liquid litres/content + `effectiveWeightKg` / carried liquid mass |
| Guards / lifecycle | `inventoryWiring.equipTool` explicit-ID reject before torch; `closeInventory` clears all callbacks; `invalidateWorldBoundUiSessions` closes inventory |
| D9 demo | `demos/inventory-list/{DemoApp,fixtures}` use shared leaves + real Inventory snapshots |

Untouched: NPC-064 docs/tests, Inventory save/schema, donor gameplay imports, exact-instance drop.

## Automated evidence

```sh
pnpm exec vitest run \
  src/items/inventoryView.test.ts \
  src/items/equipmentPreview.test.ts \
  src/items/HeldTool.test.ts \
  src/items/primaryWeapons.test.ts \
  src/items/itemUseView.test.ts \
  src/ui-vue/components/items/buildItemDetailPresentation.test.ts \
  src/ui-vue/components/items/inventoryPresentation.test.ts \
  src/ui-vue/components/items/inventoryHybridActions.test.ts \
  src/ui-vue/components/items/ammoSectionView.test.ts \
  src/app/inventoryWiring.equipToolGuard.test.ts \
  src/ui-vue/worldBoundUiSessions.test.ts \
  src/ui-vue/demos/inventory-list/fixtures.test.ts
```

**Result (2026-10-27):** 11 files, **76 tests passed**.

- `pnpm type-check`: existing unrelated errors in `mountCompareGarments.test.ts` only; no inventory UI diagnostics in filtered output.
- Focused ESLint on changed inventory paths: clean (0 errors).
- `pnpm build`: **not run** — Mon–Fri 08:30–14:30 Europe/Warsaw heavy-run window (12:20 CET at handoff).

## Layout note for screenshots

Desktop matches the V3 donor composition: **two columns** — list left; right column stacks **details above** `EquipmentPanel` / loadout. Shell width `max-w-7xl` (author: more room for the detail stats grid). Narrow (&lt;1200) keeps List/Details drill-down. Instance weapon/tool/armor rows use plain **Wyrzuć** (no „Działania na rodzaju” chrome); that section stays for drink/place/throw/read kinds.

## Pending author / manual gates

- [ ] Desktop 1366×768 / 1920×1080 three panels; empty center; independent scroll
- [ ] Breakpoint 1199/1200; narrow 390×844 / 844×390; 44px coarse targets
- [ ] Real equip/consume/drink/sharpen/drop/throw/placement/save-reload
- [ ] Keyboard/Esc/quantity priority; demo/live visual equality
- [ ] Author revised visual PASS (does **not** inherit Stage A/B)

## Polish author summary

Zaimplementowano hybrydową listę ekwipunku (osobne wiersze dla prawdziwych instancji, grupy dla stosów), wspólne komponenty listy/szczegółów/ekwipunku używane w grze i w demo. Desktop jak V3: **dwie kolumny** (lista | szczegóły nad założonym/loadout); poniżej 1200px drill-down. Zaznaczenie nic nie zmienia w świecie — akcje są tylko w szczegółach. Testy jednostkowe/DOM przeszły; **wygląd i przeglądarka czekają na autora**.

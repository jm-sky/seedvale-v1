# Implementation notes: Layered equipment panel and protection stats

**Plan:** `ui-input-048-layered-equipment-panel-and-protection-stats.md` · verified at `fe49547f` (2026-11-04, static).

## Owners (all exist at the baseline)

| Concern | File |
| --- | --- |
| Domain preview math (no Vue) | `src/items/equipmentPreview.ts` — switch to the 065 protection-snapshot builder; delete global-reduction code paths |
| View model | `src/items/inventoryView.ts`, `src/app/inventoryWiring.ts` (`unequipArmor(slot: EquipmentSlot = 'body')` at l.669 — the default argument must go; commands take an explicit position) |
| Character screen | `src/player/characterPresentation.ts` |
| Panel types | `src/ui-vue/components/items/equipmentPanelTypes.ts` |
| Panel / cells | `EquipmentPanel.vue`; after 045: `equipmentLayout.ts`, `EquipmentSlotCell.vue` (045 creates them) |
| Summary / details | `LoadoutSummary.vue`, `InventoryItemDetails.vue`, `inventoryPresentation.ts`, `collectArmorPreviewInstances.ts` |
| Demo fixtures | `src/ui-vue/demos/inventory-list/*`, `src/ui-vue/demos/character-skills/fixtures.ts` (still hard-codes `slot: 'arms'` at l.35/143 — 044 renames; this plan converts to positions) |

## Pitfalls

- Inventory UI sessions are world-bound; pending actions invalidate on world replacement — keep that contract when commands become position-aware.
- Exact-instance vs kind-group selection stays explicit (three-panel/hybrid-row contract, `docs/research/v1-revival/2026-10-27--inventory-hybrid-three-panel-contract.md`).
- Expected protection is a UI value only; never pass it into damage.
- Labels are Polish in UI (existing convention: `EQUIPMENT_SLOT_LABEL`); add layer labels next to it in `equipment.ts` (e.g. `Spód` / `Wierzch` — use what the author already sees in 045 if any; otherwise these, and list them in the manual check).

## Order

On the Wave 2 branch after 066 A: types/commands → panel rows → details → summary/profile switch → preview → hit feedback → demos.

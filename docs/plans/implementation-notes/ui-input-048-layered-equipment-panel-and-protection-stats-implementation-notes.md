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

## Implementation - 2026-11-04

All seven plan items on `main` after 065 S2/S3 and 066 A. UI text is Polish (existing convention); the plan's English wording maps to: Under/Outer = `Spód`/`Wierzch`, Reference/Low bite/Large maul = `Referencyjny`/`Gryzienie nisko`/`Potężny cios`, "No compatible items yet" = `Brak pasujących przedmiotów` (exact strings in `equipment.ts` `EQUIPMENT_LAYER_LABEL`, `armorProtectionDisplay.ts`, `equipmentLayout.ts`) - list them in the manual check.

- **Rows / commands.** `EQUIPMENT_LAYOUT` cells carry `positions` (under then outer); `buildArmorCellRows` (pure) builds the row models; `EquipmentSlotCell` renders one row per layer with remove for the exact position; `EquipmentPanel` emits `select-slot(position, id)` / `unequip-armor(position)`; shield row stays `N/A`; held/primary/AmmoSection untouched. `unequipArmor` lost its `body:outer` default. `buildEquipmentSlotViews` returns all 14 positions; the S2 "outer else under" display bridge is gone (also in `buildCharacterEquipmentSlotViews`, now 14 position rows with `positionLabel`).
- **Numbers.** No Vue-side protection math. `LoadoutStatView` (and `CharacterEquipmentView`) gained `expectedByProfile` (reference / low-bite / large-maul via `expectedProtectionByProfile` -> `combat/hitLocation.expectedProtection`), the 7x3 `protection` table and `rangedStaminaDelta` (`rangedStaminaMultiplierFor`); deltas are subtracted in `equipmentPreview.deltaView`. The profile switch and table expansion are component-local UI state only.
- **Preview.** `targetSlot` removed; `targetPosition` drives the highlight (`highlightPosition`). Context strings name the exact position (`Zastępuje (Tułów · Wierzch): X` / `Założenie: ... (pusta pozycja)`). Missing candidate or non-armor candidate -> `unavailableReason` shown in place of the context. Preview == post-equip stats pinned by `equipmentPreview.test.ts` (both variants) and 066 fixtures (50.18 / 31.605 / 26.9875 reference, low-bite 42.3925 / 24.415 / 23.9425) by `armorProtectionDisplay.test.ts`.
- **Details.** Armor rows: `Pozycja`, three `Odporność: <kanal>` rows (`35% - tylko tułów · wierzch`), melee stamina/recovery/movement/sprint, quality-adjusted mass (existing `Waga`). Merchant modal shows the coverage-qualified local label. Placeholder D4 resist rows only remain when no real rows exist.
- **Hit feedback.** `ui-vue/lastHitFeedback.ts` formats `PlayerController.getLastIncomingHit()` (`Nogi · kłucie · utracono 10 HP · pancerz powstrzymał 4`; `Blok czesciowy` prefix; `Blok calkowity` has no location). `gameLoop` pushes it once per new ordinal to `hud.setLastHit` (cleared after 8 s real time or on new game); shown in `HudCarryStatus`. No per-NPC toasts; the optional 32-event debug ring was skipped.
- **Removed.** The `Cut / pierce / blunt N/A` and `DPS . cena N/A` placeholders in the loadout summary; block chance is only mentioned as belonging to the held weapon. Grep shows no remaining global armor %/damage-reduction claim (the `SkillsActionCards` defense-skill text is the block skill, not armor).
- **Demos.** `character-skills` fixtures now run real catalog pieces through `resolveProtectionSnapshot` (no hand-written numbers); `inventory-list` full-bag wears `body:under` + `body:outer` and owns an `iron_helm`/`padded_cap` for empty-row/preview checks; HUD demo shows a last-hit line.
- **Verification (technical).** `pnpm vitest run src/ui-vue src/ui src/items src/player src/app src/combat` twice: 171 files / 1696 tests pass; `vue-tsc`, scoped ESLint and `pnpm run build` pass. Not browser-verified.
- **Manual (release, desktop + narrow + keyboard).** Inventory (`[I]`), Character screen, `inventory-list` demo: Under/Outer rows and Tab order (anatomy, spod then wierzch), remove per row, highlight of the exact target row when an armor item is selected, preview text/deltas equal to the numbers after equipping, profile switch + 7x3 table, stale-candidate message (drop the selected item via the invalidation demo scenario), last-hit HUD line after a wolf/bear/blade-trap hit and after a block.

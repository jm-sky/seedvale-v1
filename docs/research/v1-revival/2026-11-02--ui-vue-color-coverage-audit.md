# V1 Vue UI — color coverage audit and agent handoff

**Created:** 2026-11-02
**Status:** preliminary static inventory; full per-file color audit pending
**Scope:** V1 main, `src/ui-vue/**/*.vue` (98 files); CSS-first harmonization with V3's warm palette.

## Findings

- Migration stages A–E (`ui-input-039..043`) marked done with historical author visual PASS. Stage F (`044`) implemented; plan says verification needed although plan index mentions author visual PASS. Reconcile status.
- Revised D2(c)/D5 inventory is implemented with focused automated checks; independent author visual PASS not documented.
- Global `src/ui-vue/tailwind.css` defines warm panel/ink/primary/surface aliases and duplicated screen-scoped warm token sets under `.sv-merchant`, `.sv-hud`, `.sv-character`, `.sv-skills`, `.sv-dialogue`, etc.
- **Confirmed source targets:** `StartScreen.vue` uses `border-blue-400`, `bg-blue-500`; `WorldConfigScreen.vue` uses `border-blue-400`, `bg-blue-600`, `bg-blue-500`. These are old palette classes, not proof of a visual bug.
- `InventoryScreen.vue`, `QuickActionsScreen.vue`, `MerchantScreen.vue` use screen-scoped warm wrappers. `PauseMenu.vue`, `QuestLogScreen.vue`, `WorldMapScreen.vue`, `NotesScreen.vue`, `ContainerScreen.vue`, `SeedLibrary.vue` need color inheritance verification. Absence of those specific wrappers is not proof of incorrect styling.
- The prior V3→V1 compatibility mapping was NOT a full palette audit. No visual/browser validation was performed in this review.

## Coverage legend

**MIGRATION A/C/D/E** means covered by a historical migration plan, NOT independently proven color-consistent. **MIGRATION F** means shipped but plan-status reconciliation pending. **CONFIRMED legacy blue** means explicit source classes observed. **UNVERIFIED** means inspect before classifying. **SHARED** and **DEMO** mean check all call sites / parity.

## Exhaustive Vue file register

| Vue path | Preliminary status |
| --- | --- |
| `src/ui-vue/App.vue` | SHARED |
| `src/ui-vue/NpcDialogueMenu.vue` | UNVERIFIED |
| `src/ui-vue/components/CharacterModifierBadge.vue` | MIGRATION D |
| `src/ui-vue/components/CharacterPanel.vue` | MIGRATION D |
| `src/ui-vue/components/CharacterScaledValue.vue` | MIGRATION D |
| `src/ui-vue/components/CharacterSection.vue` | MIGRATION D |
| `src/ui-vue/components/CharacterSettlementSelect.vue` | MIGRATION D |
| `src/ui-vue/components/DialogueWindow.vue` | UNVERIFIED |
| `src/ui-vue/components/HudBottomPanel.vue` | MIGRATION E |
| `src/ui-vue/components/HudCarryStatus.vue` | MIGRATION E |
| `src/ui-vue/components/HudClockWeather.vue` | MIGRATION E |
| `src/ui-vue/components/HudGazeChip.vue` | MIGRATION E |
| `src/ui-vue/components/HudNeedsReadout.vue` | MIGRATION E |
| `src/ui-vue/components/HudToastStack.vue` | MIGRATION E |
| `src/ui-vue/components/InventoryScreenSection.vue` | UNVERIFIED |
| `src/ui-vue/components/ItemsScreenItemButton.vue` | UNVERIFIED |
| `src/ui-vue/components/MerchantFilterBar.vue` | MIGRATION F |
| `src/ui-vue/components/MerchantFilterDropdown.vue` | MIGRATION F |
| `src/ui-vue/components/MerchantItemDetailsModal.vue` | MIGRATION F |
| `src/ui-vue/components/MerchantItemRow.vue` | MIGRATION F |
| `src/ui-vue/components/MerchantTabButton.vue` | MIGRATION F |
| `src/ui-vue/components/MerchantTransactionPanel.vue` | MIGRATION F |
| `src/ui-vue/components/MinimapButton.vue` | UNVERIFIED |
| `src/ui-vue/components/QuickActionsButton.vue` | MIGRATION C |
| `src/ui-vue/components/QuickActionsGroup.vue` | MIGRATION C |
| `src/ui-vue/components/QuickActionsGroupLabel.vue` | MIGRATION C |
| `src/ui-vue/components/SeedPicker.vue` | UNVERIFIED |
| `src/ui-vue/components/SkillsActionCards.vue` | MIGRATION D |
| `src/ui-vue/components/SkillsHudButton.vue` | UNVERIFIED |
| `src/ui-vue/components/UiButton.vue` | SHARED |
| `src/ui-vue/components/UiPanel.vue` | SHARED |
| `src/ui-vue/components/inspection/ContractSection.vue` | UNVERIFIED |
| `src/ui-vue/components/inspection/InfoRow.vue` | UNVERIFIED |
| `src/ui-vue/components/inspection/InspectionActions.vue` | UNVERIFIED |
| `src/ui-vue/components/inspection/InspectionHeader.vue` | UNVERIFIED |
| `src/ui-vue/components/inspection/InspectionSectionBlock.vue` | UNVERIFIED |
| `src/ui-vue/components/inspection/LiquidContainerSection.vue` | UNVERIFIED |
| `src/ui-vue/components/inspection/MaterialsSection.vue` | UNVERIFIED |
| `src/ui-vue/components/inspection/ProgressBar.vue` | UNVERIFIED |
| `src/ui-vue/components/items/AmmoSection.vue` | MIGRATION A |
| `src/ui-vue/components/items/EquipmentPanel.vue` | MIGRATION A |
| `src/ui-vue/components/items/InventoryItemDetails.vue` | MIGRATION A |
| `src/ui-vue/components/items/InventoryList.vue` | MIGRATION A |
| `src/ui-vue/components/items/ItemDetailCard.vue` | MIGRATION A |
| `src/ui-vue/components/items/ItemInstanceMeters.vue` | MIGRATION A |
| `src/ui-vue/components/items/ItemTypeIcon.vue` | MIGRATION A |
| `src/ui-vue/components/items/LoadoutSummary.vue` | MIGRATION A |
| `src/ui-vue/components/items/QualityTag.vue` | MIGRATION A |
| `src/ui-vue/components/items/StatBar.vue` | MIGRATION A |
| `src/ui-vue/components/items/StatIcon.vue` | MIGRATION A |
| `src/ui-vue/components/items/StatUnderline.vue` | MIGRATION A |
| `src/ui-vue/components/ui/DemoButton.vue` | DEMO |
| `src/ui-vue/demos/DemoShell.vue` | DEMO |
| `src/ui-vue/demos/character-skills/DemoApp.vue` | DEMO |
| `src/ui-vue/demos/dialogue/DemoApp.vue` | DEMO |
| `src/ui-vue/demos/hud/DemoApp.vue` | DEMO |
| `src/ui-vue/demos/inventory-list/DemoApp.vue` | DEMO |
| `src/ui-vue/demos/item-details/DemoApp.vue` | DEMO |
| `src/ui-vue/demos/merchant/DemoApp.vue` | DEMO |
| `src/ui-vue/demos/quick-actions/DemoApp.vue` | DEMO |
| `src/ui-vue/screens/ActionConfirmOverlay.vue` | UNVERIFIED |
| `src/ui-vue/screens/ArtisanOrderScreen.vue` | UNVERIFIED |
| `src/ui-vue/screens/BusyOverlay.vue` | MIGRATION E |
| `src/ui-vue/screens/CharacterScreen.vue` | MIGRATION D |
| `src/ui-vue/screens/ContainerScreen.vue` | UNVERIFIED |
| `src/ui-vue/screens/FlavorDialog.vue` | MIGRATION E |
| `src/ui-vue/screens/HouseholdTransferScreen.vue` | UNVERIFIED |
| `src/ui-vue/screens/HudRightColumn.vue` | MIGRATION E |
| `src/ui-vue/screens/HudScreen.vue` | MIGRATION E |
| `src/ui-vue/screens/InventoryScreen.vue` | MIGRATION A |
| `src/ui-vue/screens/InventoryScreenItemDetails.vue` | MIGRATION A |
| `src/ui-vue/screens/InventoryScreenItemList.vue` | MIGRATION A |
| `src/ui-vue/screens/LodgingWalkOverlay.vue` | MIGRATION E |
| `src/ui-vue/screens/MerchantScreen.vue` | MIGRATION F |
| `src/ui-vue/screens/MinimapScreen.vue` | UNVERIFIED |
| `src/ui-vue/screens/NotesScreen.vue` | UNVERIFIED |
| `src/ui-vue/screens/NpcGiveItemScreen.vue` | UNVERIFIED |
| `src/ui-vue/screens/PauseMenu.vue` | UNVERIFIED |
| `src/ui-vue/screens/PauseMenuEntriesActions.vue` | UNVERIFIED |
| `src/ui-vue/screens/PauseMenuEntriesMain.vue` | UNVERIFIED |
| `src/ui-vue/screens/PauseMenuEntriesSaves.vue` | UNVERIFIED |
| `src/ui-vue/screens/PauseMenuEntriesSettings.vue` | UNVERIFIED |
| `src/ui-vue/screens/PauseMenuEntriesTools.vue` | UNVERIFIED |
| `src/ui-vue/screens/PlacementPreviewOverlay.vue` | MIGRATION E |
| `src/ui-vue/screens/QuantityDialog.vue` | UNVERIFIED |
| `src/ui-vue/screens/QuestLogScreen.vue` | UNVERIFIED |
| `src/ui-vue/screens/QuickActionsScreen.vue` | MIGRATION C |
| `src/ui-vue/screens/SeedLibrary.vue` | UNVERIFIED |
| `src/ui-vue/screens/SkillsScreen.vue` | MIGRATION D |
| `src/ui-vue/screens/StartScreen.vue` | MIGRATION CONFIRMED legacy blue |
| `src/ui-vue/screens/TerrainPreparationOverlay.vue` | MIGRATION E |
| `src/ui-vue/screens/TimeSkipOverlay.vue` | MIGRATION E |
| `src/ui-vue/screens/ToastStack.vue` | MIGRATION E |
| `src/ui-vue/screens/TouchChrome.vue` | UNVERIFIED |
| `src/ui-vue/screens/VillagersScreen.vue` | UNVERIFIED |
| `src/ui-vue/screens/WorldConfigScreen.vue` | MIGRATION CONFIRMED legacy blue |
| `src/ui-vue/screens/WorldInspectionScreen.vue` | UNVERIFIED |
| `src/ui-vue/screens/WorldMapScreen.vue` | UNVERIFIED |

## Agent continuation — proposed, not yet approved implementation

1. Read `docs/plans/README.md`, `PLANNING.md`, relevant A–F plans, [UI migration research](./2026-10-26--ui-migration-research.md), [compatibility matrix](./2026-10-26--ui-migration-compatibility-matrix.md) and [D2(c) contract](./2026-10-27--inventory-hybrid-three-panel-contract.md).
2. Inspect **all 98** Vue files and `src/ui-vue/tailwind.css`. Inspect legacy `src/ui/*.ts` and `src/house-browser/style.css` where active. Find hex/rgb/hsl/oklch literals, Tailwind fixed palette classes, inline and scoped styles; resolve actual token inheritance, selectors and ancestry. Classify each file `already-consistent`, `css-only`, `requires-vue-edit` or `out-of-scope`, with exact evidence and lines. Replace preliminary status column with verified results.
3. Separate semantic colors (HP, needs, errors, quality, map terrain, focus, disabled) from decorative UI. Preserve semantic distinctions and legibility.
4. Propose the smallest reversible **CSS-only** harmonization stage for approved scope. No blanket `!important` or universal neutral replacement. Identify unfixable-with-CSS components separately, with reasons; do not edit Vue without approval.
5. Test `pnpm type-check`, focused lint and `pnpm build` if changed; visual compare start/config, inventory, HUD, trade, character, quick actions, map, menus, dialogue and overlays at desktop and narrow widths. Browser/author visual PASS remains distinct from static review.
6. Before code implementation, create a correctly numbered `ui-input` plan under `docs/plans` per `PLANNING.md` if approved; ensure this index or revival roadmap links it.

**Scope guard:** This document is a handoff for completing color coverage analysis, not approval of a global reskin, gameplay changes or component restructuring.

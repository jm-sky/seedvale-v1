# V3 UI → V1: draft Cursor stages

**Created at:** 2026-10-26  
**Created by:** ChatGPT Sol  
**Status:** Provisional research output; D0/D1/D3/D4/D9 consultation answers incorporated. **Historical draft specifications: A–C delivered under later accepted proposals; later slices remain unapproved.**  
**Created for:** author consultation, then a bounded Cursor Grok/Composer implementation handoff.

Read the [inventory and decision register](./2026-10-26--ui-migration-research.md#5-author-decision-register) and [compatibility matrix](./2026-10-26--ui-migration-compatibility-matrix.md) first. These stages are candidate first slices, not a commitment to migrate every screen in three tasks. Keep later character, HUD, trade, map and menu migration in separate future slices after their decisions; no implicit cancellation or removal. V3 Player–NPC dialogue UI/UX is excluded by the author's explicit D0 decision. Leave V1 dialogue intact.

> **Readiness reconciliation — 2026-10-26:** Stages A–C are authorized and implemented; owning proposals/plans record author visual PASS. Earlier blanket “not approved”, screenshot-pending and execution-gate wording below is historical for those delivered slices, not a requirement to reopen them. Later Character/skills and other screens remain unapproved. The Stage C proposal overrides literal opacity-5 for Quick Actions chips only; preserve native disabled/no-dispatch and readable reasons. See the [dated handoff](./2026-10-26--opus-readiness-review.md).

## 1. Shared execution contract (after applicable author approval)

- Refresh affected V1/V3 `main` files against the report pins; follow V1 `CLAUDE.md` and current plan navigation. Do not overwrite concurrent model/weather/docs changes. Create a standard active plan and run its repository preflight only when implementation is actually authorized.
- Demonstration screens are required by D9: shared adapted components, isolated labeled fixtures/callbacks and no world bootstrap. Research/planning approval does not authorize implementation yet.
- V1 `src/app/createApp.ts`, `src/app/inventoryWiring.ts`, `src/items/Inventory.ts`, `src/items/equipment.ts`, `src/player/characterPresentation.ts`, `src/ui-vue/store.ts`, `src/input/Keyboard.ts` and WorldBundle remain authoritative. Read their relevant ranges; do not replace them with donor stores/hosts/commands.
- Donor `src/game/ui/items/InventoryScreen.vue` and `WorldInventoryScreen.vue` are reference layouts, not parents to transplant. No donor `@/game/data`, `game/sim`, `game/save`, `SceneSession`, `useSettings`, `useWorldMap` or composition root dependencies in migrated screens.
- Preserve all existing V1 controls and behavior in each touched screen. No gameplay, balance, item catalog, save schema, general crafting, parry/dodge, body wound health or armor mechanics work in these visual slices. Future selected layered/area armor has a separate contract and approval path.
- D4 is approved for planning: unavailable controls remain rendered with native disabled + exactly opacity-5; adjacent readable reason and dispatch guards are required. Missing data retains stable explicitly unavailable placeholder space; never use `0`, `100`, empty fabricated accounts or green body regions as substitutes. Existing V1 disabled controls retain reasons. Every active action calls a real V1 handler and reflects its result.
- Keep `useOverlayScreen`/store openStack and existing input gates as the single overlay owner. Use existing primitives with adapted styles first. Do not introduce a second stack via Reka or donor useModalLayer/useHotkeyPanel. If Reka is later selected, make the one-owner focus integration its own bounded task.
- Each stage ends with a focused docs/notes update, checks, an independent coherent commit and rollback point. Do not mark browser or visual acceptance from source/type checks. Use comparison screenshots before changing additional screens.

## 2. Stage A — one real item-details slice

**Author consultation:** D1 approved item details first; D3 current mechanics and D4 disabled + opacity-5 apply. Keep current V1 list→details and every action, change details presentation only. **D5 accepted 2026-10-26:** look identical to V3 `ItemDetailCard`; D6 retains existing behavior. **Implementation authorized** via accepted proposal + plan `ui-input-039-stage-a-item-details-v3-reskin`.

**Proposal (accepted):** [2026-10-26--stage-a-item-details-ui-proposal.md](./2026-10-26--stage-a-item-details-ui-proposal.md) — V3-identical look, field/action map, adapter boundary, §6 flags. Visual PASS of the built screen still needs author screenshots.

**Target files:**

- `src/ui-vue/screens/InventoryScreenItemDetails.vue` (primary owner).
- `src/ui-vue/components/InventoryScreenSection.vue`, `ItemsScreenItemButton.vue` only if the details leaf needs visual changes; preserve their public contracts for other callers.
- A screen-local presentation leaf/type beside those existing components if needed; no central adapter/store.
- `src/ui-vue/tailwind.css` only scoped palette aliases for the selected panel; do not reskin all screens inadvertently. Prefer existing `UiButton.vue`/`UiPanel.vue` contracts over new primitives.
- Read-only inputs: `src/items/inventoryView.ts`, `itemCatalog.ts`, `items.ts`, `itemDisplay.ts`, `itemUseView.ts`, `weaponMaintenance.ts`, `src/app/inventoryWiring.ts`, `src/app/createApp.ts:3162–3220` and store InventoryState.

**Donor files:** `src/game/ui/items/ItemDetailCard.vue`, `ItemDetailsModal.vue`, `InstanceMeters.vue`, `StatBar.vue`, `StatUnderline.vue`, `StatIcon.vue`, `ItemTypeIcon.vue`, `QualityTag.vue`, their pure icon helpers/static assets, and selected palette values in `src/css/style.css`. Read `statRows.ts` to identify formulas **to replace**, not import.

**Props/events and boundary:**

| Donor input/output | Proposed V1 adaptation |
| --- | --- |
| ItemDetailCard.item: Item | V1 detail sections built from selected ItemKind, actual InventoryGroupView and optional chosen real instance. Keep V1 labels/stats/capabilities; do not produce donor Item. |
| solid?/dialog?: boolean; controls/actions slots | Preserve desired styling/ARIA in existing V1 panel; keep all V1 controls in contextual sections. No new modal if current details is an in-panel view. |
| InstanceMeters.instance: ItemInstance | Real meterKind/conditionPercent/sharpnessPercent/qualityLabel/protection/restrictions. Armor/generic sort-only 100 never rendered as wear. |
| StatBar.value ratio; labels/tones | Actual meter percentage ÷100; finite data required before render. Existing known zero remains zero. |
| ItemDetailsModal close | Existing `return-to-list`/top details behavior, not closing inventory or a new donor dialog owner. |
| Use/drop/equip/read/sharpen/etc. | Existing V1 handlers remain unchanged. No donor model updates or command imports. |

**Author-approved D4 behavior:** keep selected detail layout stable. Unsupported donor-only controls (e.g. generic free repair) remain natively disabled + opacity-5 with a readable adjacent reason and no command dispatch. Unsupported armor wear/DPS/type resist/material/rarity values retain labeled unavailable placeholders, never numeric fillers. Keep every real V1 field/use active as allowed by its current requirements. Use a truthful generic icon if a matching approved asset is absent. Demo quality editing and general crafting are not implemented; any retained entry follows the same disabled rule. D4 does not authorize adding every demo control to the selected screen.

**Additional required deliverable — standalone demo (D9):** include a world-independent, clearly labeled item-details demonstration in the Stage A proposal. Reuse the exact adapted presentation components and styles used by the live screen. Specify its entry/build path after checking V1's existing Vite entry conventions; keep fixtures and demo-only callback wiring in a separate demo directory. Provide representative weapon, armor, food, liquid and unavailable-state fixtures using V1 view contracts, a fixture selector and reset. Simulated callbacks must be labeled and affect demo-local state only; no live Inventory/save/WorldBundle access and no donor gameplay owner. Missing mechanics remain unavailable with disabled + opacity-5 controls, rather than fabricated capability values. Subsequent selected screens receive their own demo coverage incrementally; no blanket port of donor sandbox navigation.

**Demo acceptance and verification:** launch the demo without world bootstrap; confirm identical shared presentation, fixture switching/reset, missing-value layout stability and disabled no-dispatch behavior. Compare demo and live screen under equivalent data/viewport. Verify opening/resetting a demo cannot read/write active game state or saves. Demo screenshots establish visual/component evidence only; retain the live gameplay and save/load checks below. Roll back demo entry/build changes with the isolated Stage A commit, without affecting world state.

**Acceptance:** same carried inventory before/after; all currently available details/actions accessible; exact instance equip/sharpen/sell still resolves correctly; drop still means current kind/quantity semantics; food freshness/species, liquid fill, book eligibility/capabilities, armor quality and restrictions remain visible. No persistent state change from opening/selecting/closing details.

**Focused automated verification:** V1 `pnpm type-check`; focused lint on changed Vue/TS; run existing relevant tests selected with `rg --files` for inventoryView/itemUse/equipment/weaponMaintenance. Add a small adapter test only for actual unit/semantic conversion: trap condition vs water fill vs weapon sharpness vs armor-without-wear, and missing vs real zero. Verify callbacks with the actual V1 signature; don't write tests that merely duplicate labels/styles. `pnpm build` once before handoff if imports/assets/styles changed.

**Browser verification:** open I; choose food, liquid vessel, weapon, armor, book and packed utility; compare list→details→back, Escape/backdrop and mouse. Use one real consume/equip/sharpen/drop/read operation and confirm actual inventory/HUD/game effect and refusals. Do not infer action correctness from a toast alone. Check 1366×768 plus 390×844 (or equivalent narrow viewport), long Polish labels, scroll and keyboard focus. Save/reload/reopen and verify fresh state. Capture original V1, adapted V1 and equivalent V3 details screenshots at the same viewport; V3 demo may prove design only. Author accepts look.

**Rollback:** revert this stage's isolated presentation commit; no save migration or world-data cleanup. Keep original handler ownership untouched, so rollback cannot lose items. If a shared token change affects other screens, reduce scope before acceptance rather than accepting the unintended reskin.

## 3. Stage B — inventory list and current equipment comparison

**Author gates:** Stage A accepted; D2 list/instance navigation, D3 approved current-mechanics transition, D4 approved stable unavailable controls/values, D6 input, D8 order. A separate future armor-mechanics plan is not a prerequisite for displaying **current** actual scalar effects. If the author prefers to wait for layers, leave this stage blocked rather than shipping future UI silently.

**Target files:** `src/ui-vue/screens/InventoryScreen.vue`, `InventoryScreenItemList.vue`, approved Stage A details leaf; optionally `components/InventoryScreenSection.vue`. Reuse store read-model from `createApp.refreshInventoryScreen`. A pure preview helper belongs beside existing equipment presentation/resolver ownership if needed; no second Inventory. Do not change persistent equipment shape.

**Donor files:** `items/InventoryList.vue`, `EquipmentPanel.vue`, `LoadoutSummary.vue`, `AmmoPanel.vue` (readout patterns only), `filters.ts` and icon helpers. Donor InventoryScreen script, `equip/drop/previewEquip/inventoryLoadout` and donor quality/condition formulas are excluded.

**Props/events and boundary:**

| Donor contract | V1 source / adaptation |
| --- | --- |
| InventoryList.inventory / selectedId / select(id) | Existing groups/counts and discriminated group-vs-instance selection; real identity IDs only for exact-instance actions. Preserve V1-only items and multicategory/capability information. |
| EquipmentPanel.inventory | ui.inventory.equippedSlots; HeldTool + heldInstanceId; primaryMelee/primaryRanged remain distinct. Current head/body/arms/hands/legs/feet only; body/pauldron labels may map visually after D3. |
| unequip(EquipmentRef) | onUnequipArmor(currentSlot) or onUnequip() for actual held item. Never clear primary assignments as a side effect. No layer/shield command until it exists. |
| LoadoutSummary.summary/preview/context | Current resolveEquipmentModifiers + CharacterEquipmentView; pure hypothetical equipment state over unchanged inventory. Show actual protection, attack stamina, recovery, movement, sprint and gear weight, before/after/deltas with labels. |
| AmmoPanel selection | Read actual ranged.ammoKinds/counts. No imported view-local selector presented as an operational combat preference. |

**D3/D4 behavior:** display current V1 slots and actual effects first. In the selected layout, future layer/area/type rows retain labeled unavailable space; unavailable controls remain disabled + opacity-5 until real mechanics/preview exist. No empty-but-operational future slot, zero DPS/resist or fake armor wear. Keep current valid empty slots truthful and all V1 restrictions visible. Exact equipment layout remains D2/D5-dependent.

**Acceptance:** every owned item remains discoverable; total mass AND size stay correct; all Stage A commands still work; all six current slot identities and separate hand/primary controls survive. Comparing an item never equips/removes it. Preview agrees numerically with actual current resolver after equip/unequip and uses exact quality/identity. Selection clears on lost item/new world. No free repair, synthetic instance, duplicate item or mutated read-model.

**Focused automated verification:** type-check/lint/build; existing equipment/armor/inventory/primary tests. Add preview cases for empty slot, replacing same slot, already worn, missing/stale ID, different quality and compositional restrictions, asserting source equipment/inventory unchanged. Callback tests confirm current slot/exact-ID routing, separate held/primary semantics and disabled guard. No new combat formula tests unless preview exposes an unresolved resolver discrepancy.

**Browser verification:** multiple same-kind/different-quality pieces; equip/compare/unequip; primary melee/ranged and X sheathing; quantity drop then physical pickup; nearly full mass/size; closed/reopened inventory; buy/acquire a piece through existing NPC trade/artisan route and observe same instance; new-save round trip. Verify I/C/U/Q interactions, typing, nested Escape and pointer lock. Screenshot equivalent equipment views and author-review transitional labels/empty slots. Existing gameplay tests and browser workflow effects are separate evidence; no frame-rate claim from this work.

**Rollback:** isolated Stage B commit restores previous list/layout and removes preview presentation/helper without changing stored equipment. Stage A remains independently usable. If schema change seems necessary, stop and route it to the separate mechanics plan, not this slice.

## 4. Stage C — Quick Actions visual migration without a donor menu

**Author gates:** D5 selected visual treatment, D6 existing key/navigation behavior, D8 order; show a concrete category/action mockup before approving material repositioning. This can run before Stage B if the author chooses; it depends on accepted primitives/tokens, not equipment mechanics.

**Target files:** `src/ui-vue/screens/QuickActionsScreen.vue`; `components/QuickActionsButton.vue`, `QuickActionsGroup.vue`, `QuickActionsGroupLabel.vue`. Preserve `src/ui-vue/playerQuickActions.ts`, `ui.quickActions`, `src/ui/createQuickActions.ts`, `src/app/createApp.ts` open/close/availability wiring and actual action modules. These are inputs, not a refactor target.

**Donor files:** visual language from `menu/MenuPanel.vue`, native button variant styles, item section spacing and CSS tokens. There is **no donor Quick Actions component**; do not copy `CraftPanel`, `InteractPrompt` or `ItemsShell` as a substitute. V3 ConversationPanel is explicitly excluded.

**Props/events and boundary:** existing QuickActionsButton/Group props stay V1. Category navigation remains UI-local; actual action callbacks and `ActionAvailability` stay in existing shared catalog/app wiring. Fire costs/missing reasons come from current producer, not new Vue calculations. Preserve placement/cancel/rest/hire/contract transitions and category reset on close. No second registry, dispatcher or material recipe source.

**Unavailability behavior:** preserve currently visible disabled actions and their reasons, including fire. Do not hide V1 actions because there is no donor component. Unavailable controls in the selected layout retain their place with disabled + opacity-5 and readable reasons; do not implement the missing mechanism. An explicit author decision is required before removing/reordering existing access paths.

**Acceptance:** all twelve existing categories and applicable actions remain reachable under the same eligibility rules. Opening does not execute. Execution runs once, checks current resources/target/busy state and changes actual world/inventory as before. Category back/reset, Escape, Q-close pointer-lock restoration and nested placement/cancellation work. Pause-menu Actions continues to share its current handlers and does not acquire a divergent recipe list.

**Focused automated verification:** type-check/focused lint; existing playerQuickActions/action availability tests and targeted catalog/handler coverage. Add only missing behavioral cases for disabled action no-dispatch and category reset if the presentation change affects them. Browser: missing-material fire reason, then real fire/material consumption; placement rotate/confirm/cancel; fishing equip; wait/rest cancellation; contract action; Q under pointer lock; mouse and narrow viewport scrolling. Reopen and repeat without duplicate execution. Screenshot root and one populated/one disabled category alongside the accepted V3 visual reference (not a fictional donor equivalent).

**Rollback:** revert Stage C presentation commit; catalog, costs and action owners remain intact. No save migration. A rejected mockup leaves current Quick Actions operational.

## 5. Later slices and release gates

These are research conclusions, **not executable fourth stages**:

- Character/skills: approve D3 layout first; adapt V3 tabs/sections to V1 SPEA/base/effective/XP/conditions/reputation/badges and preserve U actionable skill controls. Per-part injury visualization remains unconfirmed even after area armor. Test actual stealth/targeted skill execution.
- HUD: approve placement/compass D5/D7; real climate/temperature and needs already exist. Keep E/R/V/hold/release/cycle and mounted/leading/primary/aim controls. One-use donor prompt cannot replace them.
- Trade/transfers: reuse row/column/transaction visuals with the existing V1 basket/validated transaction owner. Verify exact identity, finite goods/coins, NPC household fallback, social prices, horse purchase and artisan pickup; never apply donor next Account payloads.
- Quest/maps/menus/settings: retain journal lifecycle/hand-ins, knowledge/targets, seed library, save classification, settings buses and all existing access paths. Donor map annotation and message history require D7; selected unavailable entry points retain disabled + opacity-5 rather than disappearing; no wholesale map/save/session import. Validate new-world/load with a modal open and with async operations pending.
- Dialogue: **do not port donor Player–NPC UI/UX**. Any later improvement is a separately agreed V1 design retaining all current action paths; no donor transcript/numbered-choice design assumed.

Before release of each approved stage: record source review, automated results, browser-observed actions, comparison screenshots and author visual verdict separately. Include untested workflows and unresolved product choices. Recheck stale callbacks after item/NPC removal, world replacement and save/load. An inactive control must be disabled both visually and in dispatch, and a missing callback must never appear enabled. No stage may claim approval merely because checks pass.


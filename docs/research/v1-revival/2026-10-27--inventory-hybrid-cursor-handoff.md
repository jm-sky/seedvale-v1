# Cursor handoff — V1 hybrid inventory and three-panel presentation

**Created at:** 2026-10-27

**Created by:** Codex (GPT-6)

**Status:** Complete implementation prompt; research session made no gameplay/UI implementation.

**Authority:** [D2(c)/D5 contract](./2026-10-27--inventory-hybrid-three-panel-contract.md)

Copy the complete prompt below into the later implementation session. The linked contract is part of the prompt's acceptance criteria; this document does not mark implementation or revised visual acceptance complete.

---

You are implementing a bounded V1 Inventory UI revision for Seedvale V1 revival in `jm-sky/seedvale-v1`. Use `jm-sky/seedvale` only as the V3 design donor. Read and follow repository agent instructions and documentation navigation. Author communication is Polish; technical code, documentation and handoff are English. Preserve concurrent changes.

Read `docs/research/v1-revival/2026-10-27--inventory-hybrid-three-panel-contract.md` completely. It is the current, implementation-ready D2(c)/D5 authority and includes the complete action/identity matrix and acceptance checklist. Read the supersession notes in the revival README, migration decision register and Stage A/B proposals/plans. Historical PASS applies to previous versions only. Do not reopen the following author decisions:

- D2(c): genuine identity/state-bearing items use instance rows; quantity goods use group rows according to actual V1 semantics.
- Desktop has InventoryList | ItemDetailCard | EquipmentPanel. Selection updates inline details; no nested desktop detail modal.
- Narrow layout may use List/Details drill-down with the same presentation.
- Clicking/selecting/comparing never equips, drops, consumes or otherwise mutates gameplay. All mutations require explicit detail actions.
- Preserve every current V1 action, Inventory authority, ownership, save, capability gate and gameplay mechanic. V3 supplies UX/visual patterns only.
- No armor layers, typed resistance, future D3/D4 mechanics or unrelated refactors. D9 requires the same presentation leaves in demo and live.

1. Verify the starting boundary before editing.

Research inspected V1 HEAD `9d97064967cb8ce4bc5625d0d7fa55ae98457e84` and V3 HEAD `94c464739d46afb982949fd6ed96b0d74d265b10`. These were local HEADs, not a claim about latest remote main. Recheck actual HEADs, remotes, status and bounded diffs; adapt to current source without reverting later work. At research start, V1 already had unrelated edits to `docs/plans/npc-064-agent-performance-spatial-state-seam.md`, its implementation notes and untracked `src/ai/NpcAgent.spatialLifecycle.test.ts`. Do not alter or stage them. Run the repository context preflight for the relevant implementation plan if required by CLAUDE.md; the correct Stage A filename is `ui-input-039-stage-a-item-details-v3-reskin.md`, not the absent shorter name.

Inspect these current V1 owners: `src/ui-vue/screens/InventoryScreen{,ItemList,ItemDetails}.vue`, `src/ui-vue/components/items/`, `src/items/{inventoryView,equipmentPreview,itemInstances,HeldTool,primaryWeapons}.ts`, `src/app/inventoryWiring.ts`, createApp's inventory handler object and **later placement handler overrides**, `src/ui/createInventoryScreen.ts`, `src/ui-vue/{store,mount,App}.ts`/`.vue`, useOverlayScreen, QuantityDialog and D9 demo components/fixtures. Source/test/config is authoritative for existing behavior. There is no donor inventory/command model to introduce.

Read V3 `src/game/ui/items/{InventoryScreen,InventoryList,ItemDetailCard,EquipmentPanel,LoadoutSummary}.vue` and `src/css/style.css`. Verified fact: the rich donor InventoryScreen itself has two columns, with details above equipment on its right; the requested three-column arrangement is an author-directed composition of its components. Preserve this distinction in evidence and screenshots.

2. Build the smallest shared read-only presentation.

Keep `buildInventoryGroups` and Inventory storage authoritative. Add a pure V1 projection that maps every existing `isInstanceBackedKind` member to its real IDs, one row each; all other positive counts to one row per kind. This covers maintained melee, reusable ranged, armor, liquids, traps, tents, keys and authored identity goods without treating all weapons/utilities alike. Never expand 10,000 arrows into individual rows. Food stays one kind group; freshness/species/relief explicitly describe next FIFO portion. No selectable synthetic food batches.

Use a single selection union: `{type:'instance',kind,instanceId} | {type:'group',kind} | null`. Derive selectedInstanceId/group kind and compareInstanceId; compare is the owned selected armor ID only. Exact instance detail stats/meters/actions must resolve that ID, never a representative sibling or first matching kind. Add optional actual liquid/amountLitres/capacityLitres and effective weight to existing read-only rows as needed; never derive content/litres from rounded fill or show armor/generic sort-only 100 as wear. Keep existing inventoryView consumers compatible.

Extract shared InventoryList and complete InventoryItemDetails presentation under `components/items/`, reusing ItemDetailCard/meters/buildItemDetailPresentation/EquipmentPanel/LoadoutSummary. Live screens become thin adapters for snapshot input and guarded callbacks. Shared leaves accept V1 view props and emit intents; they do not read global live store or own Inventory. Demo and live must use the same row and complete detail/action markup, not just matching colors or EquipmentPanel imports.

Preserve V1 multicategory filters and Category/Name/Quantity sort; add Weight as specified. Use deterministic tie-breakers, stable real row keys and exact assignment badges. Preserve selection when filtered out, show an outside-filter explanation/reveal control, and derive preview from **all** owned armor. Clear vanished/mismatched instance or zero-count group without selecting a sibling. Refresh existing IDs' state in place. Reopen starts unselected; responsive changes preserve current selection.

3. Implement the contract's layout and input behavior.

At >=1200 CSS px render three panels. Defaults: shell width min(96rem,100vw-2rem), height min(48rem,100dvh-2rem), padding/gap 1rem; columns minmax(16rem,1fr) minmax(22rem,1.25fr) minmax(18rem,1fr). Keep mass and size status visible. Each desktop panel has one scroll owner; list filters stay above rows; no nested scrolling card wrapper or selection-driven shell resize. Initial center says Wybierz przedmiot. Reuse V3's actual warm scoped tokens, compact rows, quality badges, real meters, illustration/stats/actions hierarchy and equipment density.

Below 1200 use one inventory overlay with internal List/Details pages: shared list and equipment on List, same full detail presentation on Details. Back and Esc from Details return to List; Esc from List closes; backdrop follows the same navigation. Inline desktop has no Powrót and Esc closes inventory. Preserve list scroll and focus return, no horizontal overflow, 44px coarse-pointer hit targets. Selecting an equipment/held/primary name selects exact live ID or genuine count group only. Empty slots do not equip. Move existing equipment unequip X capability to selected details.

Keep store openStack/useOverlayScreen/App Escape ownership. No donor modal/hotkey layer, Reka or extra global Escape handler. Quantity is higher priority than inventory, with inert underlying content and correct focus trap/restore. Desktop selection keeps focus on its button and offers accessible detail navigation; narrow selection focuses the detail heading. Native row buttons, aria-current, aria-pressed filters, labeled sort, readable state names and no nested interactive row controls. D4 inventory unavailable controls remain disabled + opacity-5 with adjacent readable reasons and handler guards; missing values stay labeled unavailable. Do not propagate Stage C's chip exception.

4. Preserve action semantics, especially identity limits.

Follow every row of the contract's action matrix. Equip armor, take exact maintained/ranged weapon, set primary, sharpen and conditional sell must use actual IDs. Put-away/take-off must revalidate hand/slot still belongs to selected item. Add a narrow app guard in inventoryWiring.equipTool: if an explicit ID is no longer owned with the same kind, reject **before** torch side effects or HeldTool fallback. Keep legacy no-ID behavior and other callers' HeldTool restore rules unchanged. Preserve explicit equip's existing noteEquipped behavior; selection must never reach it. No Inventory-screen Clear primary callback exists; do not invent it or clear primary through hand unequip.

Keep existing `onDrop(kind,amount)` unchanged. Group fallback is sufficient for this packet; **do not add exact-instance drop**. Instance details must have a separate Działania na rodzaju section with whole-kind live count, Wyrzuć z rodzaju… and the contract's readable warning that first inventory-ordered instances are dropped, not necessarily selection. Existing quantity workflow/default max/clamping and world-drop instance/food provenance remain. Capture kind+inventory session in pending confirm; prevent close/world change/invalidation from executing stale work. Do not map selected ID to onDrop(kind,1).

Liquid drinking also remains kind-level: first drinkable same-kind container, visibly labeled as group action even if the selected container is empty. Food uses next FIFO portion and existing spoiled gate. Trap/tent deployment is visibly a group action with existing automatic choice (lowest usable trap condition; lowest tent condition, then ID). Preserve createApp's final placementPreview handlers, confirm/cancel/rotation and capability gates. Preserve throw arming/toggling/close, skill-book vs treasure-map read routes, exact sharpen costs/errors, conditional merchant sale and all count tools/consumables. No new free repair, generic crafting, service entry or changed use/drop/placement callback identity.

Close inventory and clear all its callbacks at existing world-bound invalidation; clean up inventory-owned pending quantity work on close/unmount. Use existing session/open boundaries or a local token, not a new lifecycle service; do not cancel another screen's quantity dialog indiscriminately. No UI watcher may mutate gameplay or persisted state.

5. Finish D9 parity and meaningful verification.

Replace `demos/inventory-list/DemoApp.vue`'s separate list markup with shared list/detail/equipment leaves and the same projection. Keep `inventory-list-demo.html` and `item-details-demo.html` entries. Fixtures/reset/actions stay isolated and clearly simulated; no global live store, world bootstrap or save access. Include mixed-quality identical-kind armor, equal-quality distinct IDs, large stack, mixed FIFO food, empty/full/mixed-content liquids, worn gear, held vs primary and invalidation scenarios.

Baseline from research: six suites, 57 tests passed for inventoryView/equipmentPreview/HeldTool/primaryWeapons/itemUseView/buildItemDetailPresentation. That does not verify the new UI. Add focused behavior tests for projection complexity/stability, exact selected data, all matrix action dispatch/gates, preview nonmutation and resolver agreement, stale equip/slot safety, group-drop identity/copy and provenance, quantity/session invalidation, focus/Escape/resize and DOM demo/live parity. Use existing Vitest/jsdom/Vue mount facilities, avoiding a new test framework merely for style assertions. Run type-check, focused lint/tests and one build as appropriate under repository runtime restrictions. Use the complete acceptance checklist in contract §8; preserve existing mass/size and persistence behavior. No save migration is required.

Browser checks must cover 1366×768 / 1920×1080, 1199/1200 breakpoint, 390×844 / 844×390, keyboard and mouse, long Polish labels, independent scroll, actual action/world/HUD effects, save/reload/reopen and demo/live equality. Capture equivalent donor/live/demo references. Only the author grants revised visual PASS; do not inherit the historical Stage A/B result or claim screenshot verification from unit tests.

6. Deliver the bounded implementation handoff.

Implement only this accepted contract. No Inventory model replacement, save/schema/version/balance change, donor gameplay/store imports, future armor mechanics, unrelated NPC/performance edits or global reskin. If a verified incompatibility requires a material scope change, finish unaffected work and state the concrete blocker; do not silently remove capabilities. Routine reversible choices are yours.

Update owning documentation with actual changed boundaries, final HEAD, focused check results, screenshots and any pending manual/visual gate. Keep historical Stage A/B acceptance intact. Provide a concise Polish author summary of what changed, how tested and what remains unverified. Keep code and documentation changes in focused reversible boundaries; leave unrelated work untouched.

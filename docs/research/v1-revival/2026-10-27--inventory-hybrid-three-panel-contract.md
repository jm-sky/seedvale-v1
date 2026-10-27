# Inventory revision — D2(c) hybrid rows and D5 three-panel contract

**Created at:** 2026-10-27

**Created by:** Codex (GPT-6)

**Status:** Implementation-ready specification; author product decisions recorded; implementation and visual acceptance pending.

**Target:** `jm-sky/seedvale-v1` · **Design donor:** `jm-sky/seedvale`

**Companion:** [Complete Cursor implementation prompt](./2026-10-27--inventory-hybrid-cursor-handoff.md)

## 1. Authority, findings and evidence boundary

This contract records the author's 2026-10-27 instructions. It supersedes D2(a) with **D2(c)** and the former desktop two-column/nested-details-modal contract. Desktop is **InventoryList | ItemDetailCard | EquipmentPanel**. Selection never executes gameplay. Actions live in details. Comparison is preview-only. Mobile may use a drill-down wrapper around the same detail presentation. V1 Inventory, equipment, HeldTool, primaries, capability gates, gameplay and persistence remain authoritative. V3 supplies visual and interaction patterns, never its gameplay model.

Historical Stage A/B visual PASS on 2026-10-26 remains valid for the versions accepted then. It neither proves this revision nor establishes complete D9 parity. Do not rewrite those results as failures, or carry them forward as acceptance of the new layout. The new screenshot gate covers the revised list, shared detail surface, equipment panel and responsive composition together. This specification does not authorize implementing during the research session.

### Inspected revisions and boundaries

Verified local checkout HEADs on 2026-10-27:

| Repository | HEAD | Working tree before research edits |
| --- | --- | --- |
| V1, current workspace | `9d97064967cb8ce4bc5625d0d7fa55ae98457e84` (`Demo fixes`) | Existing changes only: `docs/plans/npc-064-agent-performance-spatial-state-seam.md`, its implementation notes, and untracked `src/ai/NpcAgent.spatialLifecycle.test.ts`. Preserve all three. |
| V3, ancestor checkout `/home/madeyskij/projects/private/seedvale` | `94c464739d46afb982949fd6ed96b0d74d265b10` | Clean. Read-only donor. |

Both `origin` URLs match the requested repositories. These are actual local HEADs, not assertions about latest GitHub main; no fetch/pull was performed. Before implementation, recheck HEAD, status and the bounded source diff; preserve any new concurrent edits. V1 has `CLAUDE.md` and no in-tree AGENTS.md; the ancestor AGENTS.md and donor startup guidance were also read. Navigation used `docs/README.md`, CODE_INDEX, STATE, plans index and the revival dossier.

Changed-file comparison against the original migration research pins (`4541513` V1; `8e3c9ba` V3): V1's three inventory screens, adapted item leaves, equipmentPreview and demo files changed/landed; `inventoryView.ts`, `inventoryWiring.ts` and `createInventoryScreen.ts` did not change in that bounded comparison. The five requested V3 components and `src/css/style.css` have no changes since the donor research pin. Current source was nevertheless read; historical proposals are not a substitute for that inspection.

### Findings with source references

Paths in this document are relative to V1 unless prefixed V3. [Original research](./2026-10-26--ui-migration-research.md), [compatibility matrix](./2026-10-26--ui-migration-compatibility-matrix.md), [draft stages](./2026-10-26--ui-migration-draft-stages.md), [equipment comparison](./2026-10-26--ui-equipment-v1-v3-comparison.md), Stage [A](./2026-10-26--stage-a-item-details-ui-proposal.md)/[B](./2026-10-26--stage-b-inventory-list-equipment-ui-proposal.md) and plans [039](../../plans/ui-input-039-stage-a-item-details-v3-reskin.md)/[040](../../plans/ui-input-040-stage-b-inventory-list-equipment.md) were consulted. Requested `ui-input-039-stage-a-item-details.md` does not exist; the verified canonical filename includes `-v3-reskin`.

| Observation | Evidence / implementation implication |
| --- | --- |
| Current V1 groups by kind, exposes row actions and opens nested details. Armor selection uses the first group instance for comparison. | [InventoryScreen](../../../src/ui-vue/screens/InventoryScreen.vue), [InventoryScreenItemList](../../../src/ui-vue/screens/InventoryScreenItemList.vue). Replace this presentation/navigation; do not preserve first-instance selection as a shortcut. |
| Details currently aggregates quality/condition buckets, then exposes per-ID controls; headline data can come from a representative sibling. | [InventoryScreenItemDetails](../../../src/ui-vue/screens/InventoryScreenItemDetails.vue). Resolve one selected instance before computing headline stats/actions. A kind representative is unsafe for instance details. |
| Real IDs already exist for armor, maintained melee weapons, reusable ranged weapons, liquids, traps, tents, keys and authored identity goods. Count goods and food batches use different authority. | [itemInstances](../../../src/items/itemInstances.ts), [inventoryView](../../../src/items/inventoryView.ts), [Inventory](../../../src/items/Inventory.ts). Derive rows from existing views, never mint Inventory IDs. |
| Pure resolver-backed armor preview already exists. | [equipmentPreview](../../../src/items/equipmentPreview.ts), [preview tests](../../../src/items/equipmentPreview.test.ts). Reuse snapshot helper with all owned armor, independently of filters. |
| Exact equip/primary/sharpen/sell paths exist; drop, drink, read and placement do not all select by ID. | [handler facade](../../../src/ui/createInventoryScreen.ts), [inventoryWiring](../../../src/app/inventoryWiring.ts), [createApp](../../../src/app/createApp.ts), [survivalActions](../../../src/app/actions/survivalActions.ts), [placementActions](../../../src/app/actions/placementActions.ts). Action scope must be visible. |
| HeldTool.equip accepts an invalid explicit ID by falling back to a sibling; equipTool extinguishes a torch before attempting equip. | [HeldTool](../../../src/items/HeldTool.ts), inventoryWiring `equipTool`. Add a narrow explicit-ID validation guard in the app handler before side effects; retain legacy no-ID equip behavior and domain fallback for other callers. |
| D9 list parity is incomplete today. | [inventory demo](../../../src/ui-vue/demos/inventory-list/DemoApp.vue) explicitly renders separate list markup and says only EquipmentPanel is shared. Extract the list and full detail presentation, including action chrome. |
| Actual V3 rich screen is **two columns**, with detail and equipment vertically stacked on the right. | [V3 InventoryScreen at inspected HEAD](https://github.com/jm-sky/seedvale/blob/94c464739d46afb982949fd6ed96b0d74d265b10/src/game/ui/items/InventoryScreen.vue). The new three-panel arrangement is an explicit author-directed adaptation, not a claim that this donor source already has three columns. |
| World-bound invalidation currently clears quantity callbacks but does not close inventory; closeInventory clears only some inventory callbacks. | [store](../../../src/ui-vue/store.ts) `invalidateWorldBoundUiSessions` / `closeInventory`. Include a bounded cleanup so selection and callbacks cannot survive a world change. No new lifecycle framework. |

**Blockers:** no unresolved product decision blocks the specified first revision. Exact-instance drop/use/placement is unavailable at current callback boundaries, but the explicit group-action fallback below resolves delivery without adding gameplay semantics. Pixel/visual equivalence remains unverified: this research ran no browser or screenshots. Future exact-instance actions would require a separate bounded contract, not silent callback substitution.

## 2. Final D2(c): row derivation and truthful data

Keep `InventoryGroupView[]` as the shared producer used by inventory/trade/containers. Add a pure UI projection; do not globally replace `buildInventoryGroups`, change persisted instances, or add a second Inventory model.

```ts
type InventorySelection =
  | { type: 'instance'; kind: ItemKind; instanceId: string }
  | { type: 'group'; kind: ItemKind }
  | null
// Presentation keys only: `instance:${instanceId}` and `group:${kind}`.
// selectedInstanceId / selectedGroupKind are derived from this union.
// compareInstanceId is derived from a currently owned selected armor instance.
```

| Actual V1 semantics | Rows and detail target |
| --- | --- |
| `isInstanceBackedKind(kind)` | One row per existing `groups[].instances[].id`, even when siblings share quality/condition. This is the existing semantic classification, not the broad `weapon`/`utility` category. Quantity = 1. |
| Maintained weapons (`WEAPON_MAINTENANCE_KINDS`) | Instance rows; actual durability and sharpness separately. |
| Reusable ranged weapons (`RANGED_WEAPON_KINDS`) | Instance rows despite having no maintenance state; IDs matter for held/primary ownership. No fake wear meter. |
| Armor (`ARMOR_KIND_LIST`) | Instance rows; exact quality, resolver-derived protection/restrictions/effective weight. Equal quality does not collapse physical IDs. Armor's sort-only 100 is never wear. |
| Traps and packed tents | Instance rows, actual condition. Deployment remains a separately labeled kind action with automatic backend choice. |
| Liquid containers (five existing liquid kinds) | Instance rows, actual liquid, amount/capacity litres and fill. Mixed water/milk/empty siblings never merge. Drinking remains kind-scoped, as specified below. |
| Keys and `IDENTITY_ONLY_ITEM_KINDS` | Instance rows. Use existing ID as stable identity; no invented rarity/quality or 100% condition. A short ID suffix may disambiguate identical labels; full ID remains accessible. |
| All other owned kinds with positive count | One group row per kind, including ammunition, coins, resources, quantity tools, consumables, books/maps or utilities when their actual V1 ownership is count-based. Never expand quantity N into N UI rows. |
| Perishable foods | One group row per kind, independent of batch count. Count is total quantity; freshness/species/use state describe **the next FIFO portion**, not every unit. No selectable batch IDs, arbitrary fresh-batch choice or inferred uniform freshness. |

Projection invariants: each positive owned kind appears; each real instance ID appears exactly once; count groups and instances never double-count. If a snapshot violates those invariants, refresh/disable affected commands and report the inconsistency rather than generating an ID or substituting a sibling. Unknown future instance-backed kinds retain generic identity rows without fabricated meters.

Liquids currently expose only fill percentages in `InventoryInstanceRow`. Extend that existing read-only row with optional `liquid`, `amountLitres`, `capacityLitres` populated by `buildLiquidContainerGroup`; mirror actual `LiquidContainerItemInstance` and `liquidContainerCapacity`. Do not infer litres or water/milk from a rounded percentage. Keep generic/armor meter compatibility in `inventoryView`; suppress their legacy 100 in the new UI adapter instead of changing trade/container behavior.

Group details show total quantity, unit mass and total group mass/size, applicable catalog facts and real action availability. Perishable details label freshness, source and relief as next-portion information; after consuming/dropping, recompute from refreshed FIFO. The existing snapshot refresh occurs on open and actions; inventory currently pauses simulation. Do not add a new clock/tick or save-backed freshness cache.

Instance details show only that instance's state/value and exact assignments; optionally show “N of this kind owned” as secondary context. No sibling bucket/action list masquerading as the selected item. Value labels distinguish reference value from actual merchant sale quote. For liquids, include contents in mass via existing weight authority; if a precise row weight needs another projection field, populate `effectiveWeightKg` with `effectiveInstanceWeight` rather than reconstructing liquid mass in Vue. Group totals never replace authoritative carrying totals.

### Filtering and stable order

Preserve V1 multicategory filtering (`hasItemCategory`) and existing category order: weapon, armor, tool, story, knowledge, food, utility, resource, other. Available filters derive from the complete owned projection; reset to All if the active category disappears. Category is the default sort. Keep Name and Quantity; add Weight to match the donor's useful heaviest-first interaction without deleting Quantity. Weight means total row weight; an instance is one unit. Comparison and assignments do not influence order.

Sort tuples: Category = category rank, Polish display name, kind, row key; Name = Polish display name, kind, row key; Quantity = descending row count, Polish display name, kind, row key; Weight = descending row mass, Polish display name, kind, row key. Use a fixed Polish collation for names and deterministic string tie-breakers for kind/ID. Never tie-break by array index, rounded condition or translated quality labels. Sorting/filtering does not mutate groups or clear a still-owned selection. A filtered-out selection keeps its details/preview and gets “Wybrany przedmiot jest poza filtrem” plus a reveal control that switches to All and scrolls to its row. Choosing another visible row replaces selection normally.

## 3. Selection, equipment and preview state machine

Keep selection, filters, sort, narrow-layout page and focus return target local to the screen/controller. Do not persist them. One discriminated selection prevents simultaneous instance/group targets. `compareInstanceId` is a computed alias: the selected owned armor instance's ID, otherwise null. There is no independently latched candidate and no “compare first instance of kind” operation.

| Event | Required UI transition | Gameplay dispatch |
| --- | --- | --- |
| Open / reopen inventory | No selection; middle dashed “Wybierz przedmiot”; current equipment and carrying totals visible; filter All/default Category. | None |
| Select instance row | Set exact ID+kind; detail updates inline on desktop, opens details page on mobile. Reset detail scroll for a different target. | None |
| Select armor | Same selection; automatically compute proposed loadout and delta for this exact candidate. | None |
| Select worn armor via list or equipment slot | Select actual owned ID; helper returns Already equipped, no proposed/delta. Slot click opens the same details. | None |
| Select non-armor or group | Clear armor candidate by derivation; show current loadout and neutral context. Group count/freshness remains reactive. | None |
| Select HeldTool / primary entry | If instance-backed, select live held/primary ID; if genuinely count-based, select kind group. Never default to sibling when an explicit ID is stale. Primary entries become selection buttons. | None |
| Select valid empty equipment slot | Keep selection; slot shows “Puste”; no auto-select/equip. Unavailable future cells remain disabled. | None |
| Filter/sort | Preserve owned selection and comparison. Revealing selection is UI-only. | None |
| Selected ID disappears, mismatches kind, or group count reaches zero | Clear selection and comparison; desktop empty state; mobile returns to list. Announce removal; do not select next sibling automatically. Cancel pending action bound to invalid target. | None |
| Same ID remains but state changes | Keep selection, recompute exact stats/actions/preview. Zero fill or changed read eligibility does not clear identity. | None |
| Explicit equip/unequip/sell/sharpen/use/drop succeeds | Existing owner refreshes snapshot; reconcile using rules above. Newly equipped candidate stays selected, becoming Already equipped. | Only the explicit action |
| Inventory closes / world rebuild / app dispose | Clear selection/preview, pending inventory-owned quantity callback and focus refs. No old-world callback may execute. | UI cleanup only |
| Cross responsive breakpoint | Preserve selection; selected target becomes narrow details page or desktop inline card. Keep focus on equivalent control or new detail heading; no synthetic row click. | None |

Current vs candidate: current comes only from live `equippedSlots` and **all** owned armor rows via `collectArmorPreviewInstances`. Proposed replaces the candidate's actual V1 slot in a temporary snapshot. Show current values and signed deltas plus explicit target/replaced label, including quality/ID disambiguation where equal names would be ambiguous. Already-worn/stale/non-armor cases have no proposed numbers, not a fake zero-delta equip proposal. Reuse `previewEquipLoadoutFromSnapshot`; do not change scalar formulas. Protection, attack stamina, melee recovery, movement, sprint stamina and worn gear weight remain the six real metrics. No weapon DPS, typed resistance, layers or shield mechanics.

Badges compare exact IDs for instance-backed equipment, HeldTool and primaries; kind+null only for count-based assignments. HeldTool is distinct from primary melee/ranged and drawn combat mode. Existing explicit taking a weapon may seed an unset primary through `noteEquipped`; preserve that V1 behavior. Merely selecting it must never call that path. `onUnequip()` clears the hand, not configured primaries. No existing Inventory-screen callback clears primary assignments; do not invent a Clear primary button or repurpose `onUnequip` for it.

## 4. Existing-action and identity compatibility matrix

All operational controls move to the shared details action region. Equipment slot/held names are selection controls; move their existing unequip X capability into exact selected details (do not delete it). Keep group-scoped controls visually separated from selected-instance controls and label their scope in readable text. UI uses existing optional callback capability gates as well as existing catalog/use gates; absent callback means unavailable, never a silent enabled no-op.

| Existing action / callback | Authoritative identity / behavior | New detail location and exact requirements |
| --- | --- | --- |
| Take tool/weapon: `onEquip(kind, instanceId?)` | Instance-backed tools/maintained and ranged weapons use ID; count tools use kind. HeldTool has fallback resolution today. | Selected-instance action passes exact ID; handler validates live ID+kind before torch/held/primary side effects. No-ID group action remains for count tools. Never pass `instances[0]` for selected gear. |
| Put away: `onUnequip()` | Current hand, no ID argument; no primary clear. | Offer only when selected exact ID equals live held ID, or selected count kind matches hand. Revalidate before dispatch so stale details cannot put a different item away. |
| Wear armor: `onEquipArmor(id)` | Existing equipment.equip validates owned armor/slot. | Exact selected armor only; same ID after refresh. No implicit call on selection or comparison. |
| Take off armor: `onUnequipArmor(slot)` | Slot-scoped; default body exists in handler. | Always pass actual catalog slot and recheck live slot still equals selected ID. Never omit slot/default to body. |
| Assign primary melee: `onSetPrimaryMelee(kind,idOrNull)` | Ownership checked by `inventoryOwnsPrimaryWeaponChoice`; melee capability gate. | Exact ID for instance-backed weapons, null for true count-kind tools. Correct stale sibling/primary badges by exact assignment helper. |
| Assign primary ranged: `onSetPrimaryRanged(kind,idOrNull)` | Same ownership rules and ranged catalog gate. | Exact ID for reusable ranged weapons, including plain instances without sharpness. Remove kind-level fallback for these instance rows. |
| Drop: `onDrop(kind,amount)` | `dropItems` clamps amount to live availability; for instance kinds removes first N in Inventory.getInstances order, unrelated to visible sort. World drops preserve full instance payload; count food uses removeWithFreshness/FIFO. | **Group scope only in this revision**, including inside instance details; see §5. No selected-ID claim or new exact-instance callback. |
| Eat/drink/heal/use: `onConsume(kind)` | Catalog consumable. Food removes next FIFO portion; relief/species/treatment remain survival-owned. Liquid selects first drinkable same-kind instance in inventory order, not selected ID. | Group action. For normal quantity consumables the selected group is the target. For liquid-instance details label “Wypij z rodzaju: …” with “Gra wybierze pierwszy pojemnik tego rodzaju, z którego można wypić.” Use group consumeUse, not selected fill alone. An empty selected container may coexist with an enabled **group** drink action. No claim to drink from it. |
| Read skill book: `onRead(kind)` | Catalog book and current skill determine enabled/reason; no physical-ID selection. | Details; preserve readUse reasons, learning result and actual book retention. If count-based group, normal Read; if identity-backed content, label kind scope. |
| Read treasure map: same `onRead(kind)` | createApp routes treasureMap to readTreasureMapItem; V1 world knowledge remains owner. | Preserve Odczytaj separately from skill-book eligibility. No donor map/knowledge owner. |
| Throw: `onThrow(kind)` | Closes inventory, toggles armed kind; world E resolves actual throw. Does not occupy HeldTool. | Details group-kind action; preserve close/toggle, refusal and aim flow; no throw during row selection. |
| Place trap: `onPlaceTrap(TrapKind)` | UI item kind maps through trapKindForItem; createApp's final handler starts placementPreview, not direct placement. At commit, lowest positive condition ratio then ID wins via selectInstanceToPlace. | “Zastaw z rodzaju: …”; adjacent “Gra wybierze najmniej sprawną działającą pułapkę tego rodzaju.” Keep placement preview/rotation/confirm/cancel/capability checks; never promise selected trap. |
| Place chest: `onPlaceContainer()` | Existing chest count and placement preview/owner. | “Postaw”; selected chest group context; preserve count/capacity/suitability checks and close transition. |
| Pitch tent: `onPlaceTent()` | Final handler starts tent preview. Actual owner selects lowest condition then ID, then revalidates/removes exact chosen tent at completion. | “Rozstaw z rodzaju: namiot”; adjacent “Gra wybierze namiot o najniższym stanie.” Selection never binds placement to the highlighted ID. |
| Sharpen: `onSharpen(id)` | Exact maintained weapon; `sharpenWeapon(...,'whetstone')`, cost/refusal/result and refresh remain owner. | Selected weapon only; preserve whetstone count, no-whetstone reason, already-max behavior, result errors. Grindstone remains world-only; no free repair/sharpen. |
| Sell instance: `onSellInstances([id])` | Exact selected ID; merchant-open gate, current V1 prices and TradeResult. | Preserve existing conditional merchant access, price and errors. No new always-available trade/service route. Do not replace with selling first kind instance. |
| Return/close and quantity confirm/cancel | Existing overlay and UI navigation; no Inventory mutation except confirmed explicit action. | Thin responsive wrappers, priority/focus rules in §6. |

Keep capability labels, melee/ranged damage/range/timing, ammo compatibility/count, catalog effect, book skill requirements/current/target, armor quality/protection/restrictions, actual condition/sharpness/fill, mass/size and reference value accessible. Do not omit V1 data just because the donor lacks it. Existing world-only repair, filling, grindstone, cooking and targeted skills remain their current routes; no new Inventory controls are required for them.

### 5. Drop decision: safe group fallback is sufficient initially

**Decision:** keep the existing callback and gameplay behavior for the first D2(c) delivery. Identity-specific drop is not a prerequisite, and adding it is outside this implementation packet. This deliberately limits a new affordance, not an existing V1 capability.

In quantity-group details show “Wyrzuć” and amount workflow. In instance details place it under **“Działania na rodzaju: <name> · ×<live total>”**, label **“Wyrzuć z rodzaju…”**, and show **“To działanie nie wskazuje zaznaczonej sztuki. Gra wyrzuci pierwsze sztuki tego rodzaju według kolejności ekwipunku.”** The quantity dialog repeats kind scope in its title. Never say “Drop selected”, never show selected quality/ID as the drop target, never cap to one merely because an instance row was selected. Available count is the live whole-kind count.

Use existing quantity dialog for count > 1 (default amount remains current max), immediate explicit drop for count = 1. Guard count <= 0; do not dispatch zero. Preserve per-unit world drops/provenance and inventory ordering. No UI removeInstance, unequip-before-drop, or synthetic drop IDs. After completion reconcile selection; if a different sibling was dropped, the selected instance remains selected.

Quantity confirmation captures kind+inventory-session token, not a row array index or global mutable selection. Revalidate current session/open state and live availability; if target vanished, selection invalidated, inventory closed or world changed, cancel. If availability shrank but remains positive, dispatch min(requested, live count), matching existing clamp behavior. Selection changes cannot redirect an already-open dialog; underlying screen is inert while it is open. Future exact-instance drop would require a separate ID-bearing app callback through facade/mount/store and validated world-drop serialization with focused losslessness tests; never implement it as `onDrop(kind,1)`.

## 6. D5 layout, navigation, focus and accessibility

D5 means the **actual V3 warm palette, compact selectable rows, quality/assignment badges, small labeled meters, card typography/illustration/stats/actions hierarchy, equipment grid and stable preview context**, adapted to real V1 data. It does not mean retaining V1's former layout merely because its colors resemble V3. It also does not import donor debug origin metadata, free repair, quality editing, global demo background or donor models. No new layers, resistance math, crafting, gameplay or save mechanics.

Donor references at the inspected HEAD: `src/game/ui/items/{InventoryScreen,InventoryList,ItemDetailCard,EquipmentPanel,LoadoutSummary}.vue` and `src/css/style.css`. Reuse existing scoped `.sv-inventory-stage-b` / `.sv-item-detail` tokens in V1 tailwind.css. Core donor density: `text-sm`, list `px-3 py-1.5`, `gap-2/3/4`, rounded-lg borders, card p-4/title text-xl, 2–3-column stats, 14rem illustration where it fits. Keep truthful Polish player labels and V1 multicategory/capability facts. Avoid expanding the selected item into a second inventory list within its card.

### Desktop: viewport width >= 1200 CSS px

Use a three-column shell: `minmax(16rem,1fr) minmax(22rem,1.25fr) minmax(18rem,1fr)`, gap 1rem; shell width `min(96rem, calc(100vw - 2rem))`, height `min(48rem, calc(100dvh - 2rem))`, padding 1rem. Use an explicit 1200px media query or Tailwind arbitrary min breakpoint; do not assume default lg=1024 provides enough space. At 1366×768, the three minimums plus gaps/padding fit with margin. These dimensions are reversible adaptation defaults, not measured donor geometry.

Outer shell is flex-column/min-h-0/overflow-hidden, with a stable close control and carrying mass **and size** status. The content grid is min-h-0/flex-1. Each panel has one overflow-y-auto region; list controls remain above its own scrolling rows. Detail and equipment scroll independently, with min-w-0 and wrapping long labels. Do not combine scrolling wrappers inside InventoryScreenItemDetails/ItemDetailCard. No content-driven resizing on filters/selection. Detail actions remain reachable at the end of its scroll; avoid a sticky action block that covers content. Empty selection keeps the middle panel space.

Item selection updates inline details with no nested overlay and no focus trap in the card. Mouse/keyboard selection keeps focus on its list/slot button; the detail region is labeled by its heading and offers a focusable heading or explicit jump-to-details control for keyboard access. Back/Powrót is hidden inline; inventory has an accessible close button. Esc closes inventory directly unless a higher-priority overlay is open.

### Narrow layout: width < 1200 CSS px

Use one inventory dialog with local List/Details navigation, no duplicated details component or second modal owner. List page contains the shared list and the equipment panel below it; a single outer page scroller owns narrow-layout scrolling. Selection switches to a details page using the same complete detail presentation; show Powrót plus close inventory control. Keep carrying totals accessible in shared chrome. Fit to `100dvh` with safe-area padding; no horizontal page overflow at 390px or landscape 844×390. Maintain a 44px interactive target on touch/coarse pointers without imposing desktop action density everywhere.

Selecting focuses the details heading; Back/Esc returns to the triggering row/slot and restores list scroll. Esc from List closes inventory. Backdrop click from Details returns to List; from List closes inventory. If the original control disappeared/was filtered out, focus the list heading/reveal control. All layout variants preserve the current V1 gameplay pause/input gates and close transitions for placement/throw/read overlays; no donor timer/hotkey stack.

### Overlay ownership and focus

Retain `useOverlayScreen`, store `openStack` and App's single Escape handler. Inventory is one overlay entry; narrow Details is an internal page. Quantity remains the existing top overlay; Esc/backdrop cancels quantity before navigating inventory. Inventory backdrop and quantity must not process the same click. Use explicit layering inventory z-20 and quantity z-30; the obsolete nested detail z-30 overlay is removed. Other global overlays retain their existing priority.

Apply `role=dialog`, `aria-modal=true` and title linkage to the active inventory wrapper. Only the active modal is focusable; background world/underlying inventory while quantity is open is inert. Trap Tab/Shift+Tab inside the active modal using existing focus utilities if present, otherwise a small local helper; do not add Reka or a second overlay registry. On close restore focus to its connected opener, preserving existing pointer-lock/input behavior (do not request pointer lock from a watcher). If opener is gone, use the existing game root focus fallback. On unmount remove local focus listeners.

Use native row buttons in a semantic list (do not add listbox roles unless implementing their full keyboard model). Tab reaches filters, sort, rows, details/actions and equipment selections; Enter/Space on a row **only selects**. No new arrow-key or delete/drop shortcut is required. Preserve global I/Esc and typing guards; no duplicate key registration. Give category buttons aria-pressed, sort an accessible label, selection aria-current, row accessible names with quality/real state/count/assignments/mass, and badges text beyond color. Avoid nested interactive row children. Announce selection/availability/removal concisely without re-reading the whole card. IDs/title/description links must be unique per mounted instance.

Preserve D4's existing selected unavailable fields (armor wear, DPS, lore, typed resistance) as labeled unavailable space, never numbers or full green meters. Existing future controls stay disabled + exactly opacity-5 with readable reasons outside them; no new future feature panel. Stage C's chip-specific exception does not silently extend to inventory. Real disabled actions retain native disabled, reason and no-dispatch guards. Non-interactive missing values are readable, not dimmed to 5%.

## 7. Minimal architecture and affected files

Keep the command route: `createApp.refreshInventoryScreen → createInventoryScreen facade → mount/store snapshot → InventoryScreen controller → shared leaves`, with explicit events returning through `ui.inventory.on*` to inventoryWiring/survival/placement. There is no donor command registry to port and no reason to introduce one. The owner snapshot is rebuilt on real actions; Vue never owns authoritative items or saves.

| File / bounded change | Purpose |
| --- | --- |
| `src/ui-vue/components/items/inventoryPresentation.ts` (new, name may follow local conventions) + focused tests | Pure discriminated row projection, stable ordering, exact selected-target resolution and detail/action descriptors. Reuse InventoryGroupView; presentation data only. |
| `src/ui-vue/components/items/InventoryList.vue` (new) | Shared V1-prop selectable hybrid list, filter/sort controls, real meters/badges. Props rows/selection/filter/sort/carrying view; emits select/filter/sort/reveal only, no gameplay imports/store. |
| `src/ui-vue/components/items/InventoryItemDetails.vue` (new) | Shared full detail presentation: ItemDetailCard + meters/stats + contextual action controls and group-scope explanation. Props resolved presentation/action state; emits explicit typed action intents. No game/store reads. |
| `src/ui-vue/screens/InventoryScreenItemList.vue` | Thin live adapter to shared list; remove row mutation handlers, `onCompareKind`, and kind-first primary resolution. |
| `src/ui-vue/screens/InventoryScreenItemDetails.vue` | Thin live adapter: resolve union selection and exact ID, build real stats/action availability, dispatch guarded explicit intents. No sibling representative/bucket logic. |
| `src/ui-vue/screens/InventoryScreen.vue` | Three panels, single selection, derived compare, responsive page/focus/scroll lifecycle. Route equipment/held/primary selection to same controller. |
| Existing `items/{ItemDetailCard,EquipmentPanel,LoadoutSummary,buildItemDetailPresentation,collectArmorPreviewInstances}` | Inline/narrow card chrome options, shared presentation reuse; equipment selection-only entries (unequip moved into details), primary selection events; optionally show proposed values alongside current/delta. Keep existing formulas and D4 placeholders. |
| `src/items/inventoryView.ts` + its tests | Add optional truthful liquid fields and resolver-derived row weight where needed; preserve existing group shape/consumers. No changes to Inventory authority. |
| `src/app/inventoryWiring.ts` + focused command test | Reject stale/mismatched **explicit** equip IDs before extinguishing torch or invoking HeldTool. Preserve normal no-ID behavior, exact other action paths and all drop behavior. |
| `src/ui-vue/store.ts`, local screen cleanup, `worldBoundUiSessions.test.ts` | Close inventory and clear **all inventory callbacks** on world-bound invalidation; cancel inventory-owned quantity work on close and unmount. Do not cancel unrelated screens' quantity operations via an unscoped global watcher. Reuse existing open/invalidation boundaries/session token. |
| `src/ui-vue/tailwind.css` | Scoped 1200px responsive composition, scroll/focus/touch styling; retain actual donor tokens. No global palette replacement. |
| `src/ui-vue/demos/inventory-list/{DemoApp.vue,fixtures.ts}` | Replace separate demo list markup with the exact shared list/full details/equipment leaves; same projection and state transitions, fixture-local reducer and logs only. Add scenarios below. |
| `src/ui-vue/demos/item-details/DemoApp.vue` / fixtures | Reuse full details leaf/action chrome where applicable; keep existing demo entry and independent local callbacks. |
| `src/ui/createInventoryScreen.ts`, `src/ui-vue/mount.ts`, `src/app/createApp.ts` | Inspect for integration; no action signature change is required. Touch only if a verified minimal focus/lifecycle integration requires it; document why. |

Prefer extracting presentational blocks from existing screens over building competing adapters. An optional small local selection/focus helper is justified if both demo/live need it; no central compatibility service/event bus. Existing D9 entries (`inventory-list-demo.html`, `item-details-demo.html`, corresponding main.ts and Vite inputs) remain usable; no new sandbox framework. Existing `buildItemDetailPresentation` remains the meter/unavailable/illustration helper, not a donor Item constructor.

Forbidden in this packet: changes to Inventory storage/serialization, item catalog/balance/capability definitions, equipment/quality formulas, primary/HeldTool persistence, save schema/version, NPC gear, trade policy, combat, generic repair, exact-instance consume/drop/placement, future D3/D4 mechanics, unrelated screens/refactors or donor runtime imports. Named new UI files are recommendations, not a mandate to split by line count. If existing code provides the same owner, extend it.

## 8. Verification and acceptance checklist

### Evidence from this research

At V1 `9d970649`, ran:

```sh
pnpm exec vitest run src/items/inventoryView.test.ts src/items/equipmentPreview.test.ts src/items/HeldTool.test.ts src/items/primaryWeapons.test.ts src/items/itemUseView.test.ts src/ui-vue/components/items/buildItemDetailPresentation.test.ts
```

Result: **6 files, 57 tests passed**. This is baseline evidence for existing view/preview/assignment/meter semantics only. No UI implementation, build, browser run, screenshot, new-action test or new visual PASS was performed. Existing tests already cover empty-slot preview, replacement agreement after real equip, already worn/stale candidate, nonmutation, poor armor quality, ranged ownership and use gating. They do not establish the new selection/action/DOM contract.

### Required automated checks during implementation

- [ ] Hybrid projection: mixed-quality same-kind armor produces separate exact rows/stats/weights; identical-quality IDs remain separate; maintained and plain ranged weapons, traps/tents/liquids/keys/story identities remain visible; category does not decide ownership granularity.
- [ ] A large stack (e.g. 10,000 arrows/coins) produces one group row; multiple food batches produce one group, count and next FIFO state; no count-sized array. Actual Inventory capacity tests use valid fixtures, not oversized illegal acquisitions.
- [ ] Food freshness/species/relief changes after FIFO consume/drop; spoiled FIFO cannot be bypassed by selecting a fresh sibling batch. Liquid fill/contents/litres are exact and group drink explanation/enable state handles empty-selected + drinkable-sibling correctly.
- [ ] Stable ties and multicategory filtering; filter hides selection without losing it; removed category resets All; sorting does not redirect callbacks; filtered equipment still contributes to preview.
- [ ] Selection of every row/slot/held/primary, reselection, filter, sort, Back/Esc and resize dispatches **zero gameplay callbacks** and leaves Inventory instances/counts/food, equipment/HeldTool/primaries/torch and saved state unchanged. Include frozen input snapshots and callback spies.
- [ ] Selected armor auto-previews exact quality; current vs proposed/delta agrees with actual V1 equip in a separate explicit-action test; already worn/no armor/stale candidate clears proposal. Cover all six scalar metrics and no source mutation.
- [ ] Exact action dispatch for armor, held, maintained/ranged primaries, sharpen/sell; stale explicit equip cannot fall back or extinguish torch, stale take-off cannot affect replacement slot/hand. Missing callbacks/disabled controls never dispatch.
- [ ] Group drop identity safety: with selected B and inventory order A,B, confirm one kind drop removes A and preserves B's selection; reverse visible sort has no effect. Copy explicitly states group scope. Existing serialized instance condition/quality/fill and food provenance survive drop/pickup. Dialog default amount/quantity clamp/cancel remain intact.
- [ ] Every matrix action remains reachable from details with the same capability/refusal gate; throw still toggles and closes, placement still enters preview, book/map routes distinct, sharpen cost/refusal and conditional sale preserved. Assert group actions never receive synthetic IDs.
- [ ] Invalidation: removed item clears selection, available-zero action disables, count change refreshes group; no silent sibling selection; quantity cannot target a new selection/session; inventory close/rebuild/dispose invalidates pending callbacks and all inventory handlers. Extend existing worldBoundUiSessions coverage with inventory.
- [ ] Real totals remain Inventory.totalWeight/maxWeight and totalSize/maxSize; no new acquisition admission/encumbrance rule; existing mass/size and equipment tests pass; no save schema change and a real save/reload roundtrip retains ownership/assignments.
- [ ] DOM tests mount shared Vue components with callback spies (use existing Vitest/jsdom and Vue createApp if no component-test library); verify inline vs narrow navigation, scope labels, native disabled, accessible names, focus return/trap, higher-priority quantity Escape, and zero nested desktop details modal. Test behavior, not a snapshot of implementation classes.
- [ ] Demo/live use identical list, full details/action and equipment leaves with equivalent input. Demo selection/reset/simulated actions only affect fixture state, never global live `ui.inventory`, WorldBundle or save. Compare rendered structure for identical fixtures; do not just assert import strings.

Run `pnpm type-check`, focused ESLint on changed Vue/TS, focused Vitest for new behavior plus existing `Inventory`, `inventoryView`, `equipment`, `equipmentPreview`, `HeldTool`, `primaryWeapons`, `itemUseView`, `foodItems`/`foodFreshness`, `liquidContainer`, `weaponMaintenance`, `books`, `inventoryItemReadAction`, trap/tent placement and world-bound session tests as touched. Run `pnpm build` once for changed component/style/entry integration when repository runtime restrictions allow. Record any environment failure precisely. Do not regenerate broad generated documentation or run unrelated suites for a documentation-only session.

### Required browser / visual scenarios

- [ ] Desktop 1366×768 and 1920×1080: List | Detail | Equipment simultaneously; initial empty center; exact armor selection, mixed quality and equipped badges; no modal on desktop; independent panel scroll and stable shell under empty/filter/long content.
- [ ] Breakpoint 1199/1200px and narrow 390×844 / 844×390: no horizontal overflow, safe-area fit, shared details with Back, equipment reachable, resize preserves target, correct scroll/focus and 44px coarse-pointer hit targets. Check enlarged text/zoom.
- [ ] Large ammo/resource stacks, mixed freshness/species FIFO foods, empty/water/milk containers, maintained weapons with different sharpness, plain ranged weapon, book/map, traps and tents. No false armor/generic 100% wear.
- [ ] HeldTool differs from primary melee and ranged. Selecting each only inspects. Explicit take/put away and assign primary still have the expected V1 effects; primary assignment survives ordinary hand unequip.
- [ ] Perform real equip/unequip, consume/drink, sharpen with/without whetstone, read, group quantity drop then pick up; conditional sale if its existing merchant-open context is available. Verify actual inventory/world/HUD effects, not just toast text. Test throw arm/cancel and placement confirm/cancel through existing preview.
- [ ] Mouse backdrop/Esc, keyboard Tab/Shift+Tab/Enter/Space, quantity overlay priority, removed selection and world replacement. No two Escape handlers or old-world dispatch.
- [ ] Save/reload/reopen after actions: authoritative IDs/food/liquids/assignments/carrying totals survive; selected/compare IDs start empty.
- [ ] Capture equivalent V3 donor component reference, revised live screen and D9 demo at the same viewport/data where comparable. State explicitly that three-column composition is author-directed. Confirm warm tokens, compact rows, actual selected-item hierarchy and equipment summary density. Author judges revised look; automated success is not visual PASS.

Rollback: isolated UI/projection/guard/cleanup changes can be reverted without migration or item conversion. Keep new behavioral tests with the code they verify. Record final HEAD, touched boundaries, automated results, screenshots and outstanding visual/manual gates in the implementation handoff; do not mark the old Stage A/B plans newly implemented a second time.

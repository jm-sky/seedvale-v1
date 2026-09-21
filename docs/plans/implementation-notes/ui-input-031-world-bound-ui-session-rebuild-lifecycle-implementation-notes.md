# Implementation Notes: ui-input-031 — World-bound UI session rebuild lifecycle

**Reviewed:** 2026-09-21  
**Baseline:** `main` @ `f42c5d20`

## Current lifecycle seam

`world-033` is already implemented. `createApp.ts::rebuildWorld()` starts with `worldRebuildLifecycle.beginRebuild()`, then cancels player intent and later calls `rebuildWorldBundle()`. Put UI-session invalidation **immediately after a successful `beginRebuild()` and before old world objects are disposed/awaited**. Do not add another generation flag/state machine.

Closing transient world-bound sessions at this point is preferable to rebinding them: there is no continuity requirement for dialogue/trade/transfer/confirmation UI, and it makes same-world rebuild and New Game use the same safe boundary.

## Store reset: clear references, not only visibility

Add one exported, idempotent store operation (forwarded through `src/ui-vue/mount.ts`) for world-bound session invalidation. It should reuse/reset existing state rather than duplicate close logic, but **must not trigger gameplay side effects** such as dialogue decline callbacks, farewell voice, confirmation callbacks, etc.

Current close helpers are insufficient as a group:

- `resetNpcDialogueMenu()` already clears `npc`, `settlement`, quest resolvers and transient snapshots; use its no-side-effect semantics.
- `closeMerchant()` clears the retained `NpcAgent` and stock/pricing snapshots.
- `closeVillagers()` only flips `open`; invalidation must also clear `entries` because they contain `Raw<NpcAgent>`. Container options can be cleared with the same session.
- `closeFlavorDialog()` only flips `open` and invokes `onClose`; invalidation must clear `actions` (callbacks may capture world targets) without invoking them. `onOpen/onClose` are configured app callbacks, not per-target actions; do not blindly erase configuration.
- `ActionConfirm.onConfirm` is per-session executable state and must be nulled. Also inspect `QuantityDialog.onConfirm`: it has the same arbitrary callback lifetime even though the source plan did not list it. Invalidate it when the callback can be world-bound; simplest safe policy is to close/reset these transient confirmation dialogs on every world rebuild.
- `containerScreen` is only a facade/read model; closing it is necessary, but the authoritative stale handle lives in its action controller (below).

Do **not** close app-owned screens just because they are open: Inventory, Quest Log, Character/Skills, Pause, World Config, map/minimap and HUD do not inherently own a WorldBundle runtime identity. World Inspection is already stable-id based and can remain open; `inspectionActions.ts` re-resolves `InspectionTargetRef { kind, id }` through current `ctx.bundle`.

## App-layer session handles also need invalidation

Store reset alone does not release all stale runtime references. Add narrow invalidation/reset methods to the owning action controllers where needed and call them from the same composition-root invalidation seam.

### `src/app/actions/containerActions.ts`

`openTransfer` is mostly stable-id based, but `{ kind: 'npcCorpse', npc }` retains the old `NpcAgent`; withdrawal/take-all later mutates `npc.getPostDeath()`. For this plan, prefer closing/resetting the transfer and setting `openTransfer = null` on rebuild rather than redesigning corpse identity/transaction semantics. Keep existing rollback/capacity logic untouched.

### `src/app/actions/householdResourceTransferActions.ts`

Current code retains `let activeHousehold: Household | null` and mutates it after resolving only the economy from the live bundle. This is the same mixed-generation hazard as corpse transfer and was not called out in the source plan. Include it: close the sheet and clear `activeHousehold` at rebuild. Do not add a household registry solely for this fix.

### `src/app/actions/npcItemTransferActions.ts`

This controller retains only `activeNpcId` and every mutation resolves current `NpcStateRegistry` via `bundle.settlementsManager.getNpcState(id)`; it is generation-safe by identity. Closing the transient give-item sheet on rebuild is still reasonable UX/session cleanup, but no runtime `NpcAgent` rebind is required.

### Artisan orders / ordinary NPC trade

`inventoryWiring.ts` artisan ordering already uses `activeArtisanNpcId` and re-resolves the session. Ordinary NPC trade does **not**: `settleNpcGoodsTransaction()` reads `ui.merchant.npc`, while `findSettlementForNpc()` checks membership against current settlement NPC objects. Closing merchant at rebuild is therefore the minimal correct fix; do not rewrite trade resolution in this plan.

## Mount/dispose detail

`mountVueUi()` forwards store calls through `FORWARDED_FNS`; add the invalidation function there. The store is module-scoped and survives Vue unmount, while `mount.ts::dispose()` currently only unmounts/removes DOM. Ensure app teardown invokes the same no-side-effect world-session reset (directly or through `VueUi.dispose()`) so old `NpcAgent`/callback references are not retained by the module store after unmount.

Queued calls before Vue mount preserve order, so a queued open followed by queued invalidation is safe; do not introduce a second queue/lifecycle mechanism.

## Composition-root ordering

Recommended order in `rebuildWorld()`:

1. `beginRebuild()`;
2. invalidate world-bound UI/controller sessions;
3. `cancelActivePlayerIntent()` / existing rebuild preparation;
4. existing `rebuildWorldBundle()` transaction and continuation.

Invalidation should be idempotent and does not need rollback if rebuild later fails: the old bundle is already not safe to resume after a failed world-033 transaction.

## Focused tests

Prefer pure/store/controller tests over mounting Vue:

- store invalidation clears NPC dialogue `npc/settlement`, merchant `npc`, Villagers runtime entries, Flavor actions, ActionConfirm/Quantity callbacks and visible flags; calling twice is harmless and does not execute decline/confirm/action callbacks;
- corpse transfer invalidation clears `openTransfer`; invoking configured container handlers afterward cannot mutate old post-death state or grant loot;
- household transfer invalidation clears `activeHousehold`;
- stable-id NPC give-item and World Inspection paths need no generation rebind; verify they do not retain a runtime agent;
- `VueUi.dispose()` leaves no module-store world-bound refs/callbacks;
- one composition-root test/seam assertion is enough to prove invalidation happens after `beginRebuild()` and before bundle replacement; do not build a browser-heavy `createApp` test unless necessary.

## Scope guard

Do not modify `worldRebuildLifecycle.ts`, add generation counters to Vue, create a global entity registry, or fold in `items-player-055`, `items-player-057` or `ui-input-028`. The key correction to the plan is that world-bound session ownership is split between the Vue store **and app action-controller closure state**; both must be cleared at the same existing world-033 boundary.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Codebase domain audit 23 — UI ↔ simulation contracts

**Reviewed:** 2026-09-20  
**Area:** 23 — UI ↔ simulation contracts  
**Scope:** code correctness, architecture, lifecycle/state synchronization, performance  
**Baseline:** `main` @ `3dbbc4f16e495f394d1d0ade9f39d6e207fbe674`  
**Result:** ⚠️ reviewed with unresolved high findings

## 1. Scope

Audited the contracts between authoritative simulation state and the HUD/Vue/DOM layers. Visual design, UX quality and missing screens are intentionally excluded.

Cross-checked area 01 (WorldBundle lifecycle), 18 (items/inventory), 19 (player systems), 20 (interaction/input) and 21 (quests/progression).

Traced:

- HUD + HP/stamina/needs;
- contextual interaction prompt and action dispatch;
- inventory/equipment;
- quest log, reputation and badges;
- NPC dialogue and merchant/trade UI;
- settlement/villager/world projections;
- animal/mount UI;
- world inspection / container transfer surfaces;
- debug GUI only where it shares the production rebuild contract.

## 2. Entry points and state owners

### Player / HUD

`PlayerController.health`, `PlayerController.needs`, skills, `Inventory`, `HeldTool`, `EquipmentState` and `PrimaryWeaponSelection` remain authoritative.

`src/ui/createHud.ts` is a facade over `src/ui-vue/store.ts`. HUD and Character Screen state are presentation mirrors. Current setters use cheap equality bails for recurring scalar pushes; the Character Screen only builds the heavier derived presentation while open.

No duplicate HP/stamina/needs authority was found.

### Interaction

`gameLoop.ts` acquires the current `Interactable`, `interactionView.ts` projects it, Vue renders the prompt, and dispatch returns through application/domain handlers.

Area 20 already owns target identity/cycling fixes. The World Inspection path is particularly sound: `createInspectionActions()` stores a stable `InspectionTargetRef` and re-resolves through the current `ctx.bundle` before refresh/action.

### Inventory / equipment

The inventory screen receives count/group/equipment snapshots and callbacks. Mutations route back through `inventoryWiring.ts` / action modules and then explicitly refresh HUD/UI projections.

No Vue-owned inventory quantity or equipment authority was found.

### Quests / reputation

`QuestManager`, `ReputationManager` and badge managers remain authoritative. Quest Log entries and Character reputation/badges are read models. NPC dialogue preview functions re-read `QuestManager` rather than owning quest state.

### World-bound UI sessions

Several UI states intentionally retain live runtime objects for an open session:

- `ui.npcDialogueMenu.npc: NpcAgent`;
- `ui.npcDialogueMenu.settlement: Settlement`;
- `ui.merchant.npc: NpcAgent`;
- Villagers entries retain `Raw<NpcAgent>`;
- NPC corpse container transfer retains `{ kind: 'npcCorpse', npc: NpcAgent }`;
- `FlavorDialog` / confirmation surfaces may retain executable callbacks.

Those references are safe only while their owning world generation remains current.

### Rebuild configuration

`WorldConfigScreen` and the debug GUI deliberately mutate the same authoritative `WorldConfig` object. Both invoke the same `onTerrainChange → rebuildWorld()` path.

This avoids duplicate configuration state, but it also means rebuild input is mutable while an asynchronous rebuild is in flight.

## 3. Flows traced

### HUD / character stats

```text
PlayerController health/needs
→ gameLoop
→ Hud facade
→ Vue store projection
→ HudScreen / CharacterScreen
```

The UI does not write these values back.

### Inventory / equipment

```text
Inventory / HeldTool / EquipmentState
→ inventoryView projection
→ InventoryScreen
→ configured handler
→ live inventory/equipment validation + mutation
→ HUD / inventory / quick-action refresh
```

The authoritative owner remains outside Vue.

### Interaction

```text
current world entities
→ buildInteractables / target selection
→ interactionView
→ Vue prompt
→ user action
→ gameLoop/application action boundary
→ live validation
→ authoritative mutation
→ next projection
```

The per-frame prompt projection is expected because gaze/target availability is itself frame-sensitive.

### World inspection

```text
Interactable
→ stable {kind,id} InspectionTargetRef
→ buildWorldInspection(current bundle)
→ Vue read model
→ action id
→ re-resolve current bundle by stable id
→ domain mutation
→ refresh/close
```

This is the preferred stale-safe pattern.

### NPC dialogue / trade

```text
live NpcAgent + Settlement
→ Vue store retains runtime references
→ dialogue/trade presentation
→ configured handler
→ mixed live-id re-resolution + retained runtime object use
→ mutation / refresh
```

This path becomes unsafe if the owning world is rebuilt while the session survives; see F23-1.

### World config → rebuild

```text
Vue/debug GUI mutates shared WorldConfig
→ onTerrainChange()
→ async rebuildWorld()
→ rebuildWorldBundle(..., config, ...)
→ publish fresh bundle
→ post-rebuild rebinds
```

A second mutation can occur while the first rebuild is awaiting world construction; see F23-2.

## 4. Findings

### F23-1 — HIGH — active world-bound UI sessions have no generation invalidation/rebind contract across WorldBundle rebuild

**Affected flow:** live world entity → open NPC/dialogue/trade/container/villager UI → WorldBundle rebuild → retained UI runtime reference/callback → post-rebuild action/read.

**Files / symbols:**

- `src/ui-vue/store.ts`
  - `NpcDialogueMenuState.npc`
  - `NpcDialogueMenuState.settlement`
  - `openNpcDialogueMenu()`
  - merchant `npc` state / `openMerchantFromDialogue()`
  - `refreshVillagers()`
  - `FlavorDialogState.actions`
- `src/app/actions/containerActions.ts`
  - `openTransfer`
  - `openNpcCorpse()`
  - corpse withdrawal/take-all handlers
- `src/app/inventoryWiring.ts`
  - `findSettlementForNpc()`
  - `buildNpcTradeStock()`
  - `settleNpcGoodsTransaction()`
- `src/app/createApp.ts::rebuildWorld`
- `src/app/worldBundle.ts::rebuildWorldBundle`

**Evidence:**

`openNpcDialogueMenu()` stores the concrete runtime objects:

```ts
state.npc = markRaw(npc)
state.settlement = settlement
```

Merchant transition deliberately carries the same concrete NPC into `ui.merchant.npc`.

The corpse-transfer controller stores a direct runtime NPC:

```ts
openTransfer = { kind: 'npcCorpse', npc }
```

and later withdrawal/take-all reads and mutates `openTransfer.npc.getPostDeath()`.

By contrast, ordinary containers and animal packs store stable IDs and re-resolve against the current `bundle`.

`rebuildWorld()` calls `gameLoop.forgetHighlight()` and rebuilds the stable bundle fields, but it has no corresponding invalidation/close/rebind step for active world-bound UI sessions. Rebuilt settlements/NPCs are new runtime objects.

The debug GUI shares the same production `onTerrainChange → rebuildWorld()` callback and can trigger the rebuild independently of Vue modal ownership, so the stale-session path is not merely theoretical test scaffolding.

**Why wrong / fragile:**

A presentation session can retain an object whose simulation owner has been disposed/reconstructed.

The strongest concrete case is NPC corpse transfer: after rebuild, a withdrawal can mutate the old corpse/post-death object while adding loot to the app-owned player Inventory. The reconstructed current-world corpse is a different runtime owner, so the action is no longer guaranteed to mutate the same authoritative state the UI now visually represents.

NPC trade has a similar mixed-generation risk: `settleNpcGoodsTransaction()` reads the retained old `NpcAgent`, while also querying the current `bundle.settlementsManager` by id. `findSettlementForNpc()` uses object identity membership, so an old agent cannot belong to the rebuilt settlement list.

This violates the project-wide stable-identity rule: world-bound UI should either close at generation change or retain stable IDs and re-resolve before every mutation.

**Affected consumers:**

- NPC dialogue;
- ordinary NPC and merchant trade;
- corpse loot transfer;
- Villagers projection;
- any FlavorDialog/confirmation action that closes over a world-owned runtime target;
- pointer-lock/modal state when such a session becomes invalid.

**Owner domain:** `ui-input`, with world lifecycle integration.

**Existing plan coverage:**

- `world-033` owns the rebuild transaction and invalid-world execution window, but does not define lifecycle of already-open UI sessions after fresh-world publication.
- `items-player-057` owns the analogous mounted `AnimalAgent` reference, not UI sessions.
- `ui-input-014` already demonstrates the correct stable-id + live re-resolution pattern for World Inspection.
- No existing plan owns world-bound UI session invalidation/rebind as a shared contract.

**Recommended action:**

Create `ui-input-031-world-bound-ui-session-rebuild-lifecycle.md`.

Prefer one composition-root generation-change hook that closes or explicitly re-resolves only world-bound sessions. Do not create a second world registry or copy simulation state into Vue.

---

### F23-2 — HIGH — rebuild-triggering UI mutates shared WorldConfig while concurrent rebuild requests are silently dropped

**Affected flow:** World Config/debug GUI edit → shared config mutation → async rebuild → second edit/request during rebuild → current-world publication.

**Files / symbols:**

- `src/ui-vue/store.ts::configureWorldConfigScreen`
- `src/ui-vue/screens/WorldConfigScreen.vue::applySeed/onFlatShadingChange`
- `src/ui/createDebugGui.ts` terrain controllers
- `src/app/createApp.ts::onTerrainChange`
- `src/app/createApp.ts::rebuildWorld`
- `src/app/worldBundle.ts::rebuildWorldBundle`

**Evidence:**

The Vue screen deliberately receives the same `WorldConfig` object used by simulation; `v-model` therefore mutates authoritative config before the rebuild callback runs.

The debug GUI mutates the same object.

The callback is fire-and-forget:

```ts
const onTerrainChange = () => {
  void rebuildWorld()
}
```

and `rebuildWorld()` silently ignores a concurrent request:

```ts
if (rebuilding) return
```

The first rebuild passes the mutable `config` object through asynchronous world construction. There is no Vue-visible rebuild lock and no immutable request snapshot.

Therefore a second edit can change values read by an already-running rebuild even though its own rebuild request is discarded. At completion there is no proof that the published world corresponds to one coherent committed configuration revision.

**Why wrong / fragile:**

The UI and simulation share one authoritative config object, but mutation and application are not one transaction. "Config value shown/stored" and "world built from that value" can diverge or be assembled from values changed at different times.

This is primarily lifecycle/correctness, not a request for a second UI copy of configuration.

**Affected consumers:**

- terrain/chunk/world construction using `config`;
- URL/persisted world config;
- graphics/world settings surfaces sharing the handler;
- post-rebuild systems that assume the published world matches current config.

**Owner domain:** `world` lifecycle transaction, with `ui-input` caller gating.

**Existing plan coverage:**

`world-033-worldbundle-rebuild-transaction-and-lifecycle-safety.md` is the correct owner: it already requires one explicit rebuild transaction, exclusion of duplicate rebuild requests, gating actions while the world is invalid, and success-only continuation. This finding should be incorporated there rather than creating a second rebuild coordinator.

**Recommended action:**

When implementing `world-033`, make rebuild input coherent as part of the transaction: either freeze/snapshot the rebuild-relevant config revision, or block/queue rebuild-relevant config mutation until the active transaction finishes. Do not merely keep the current early-return while allowing the shared input object to mutate.

**Performance:** event-driven, not per-frame. Expected performance ROI: negligible; correctness ROI: high. Benchmark not needed.

---

### F23-3 — HIGH — mounted HUD/action projection inherits the stale AnimalAgent lifecycle defect already found in area 19

**Affected flow:** mounted animal → HUD mounted projection/callback → WorldBundle rebuild → mount controller continues with old runtime agent.

**Files / symbols:**

- `src/app/actions/mountActions.ts::createMountActions`
- `src/ui/createHud.ts::setMounted`
- `src/ui-vue/store.ts::setHudMounted`
- `src/app/createApp.ts::rebuildWorld`

**Evidence:**

`MountActions` owns a direct `AnimalAgent` reference and installs the HUD dismount callback from that long-lived controller. Area 19 confirmed that rebuild does not detach/re-resolve that reference.

The Vue mounted state is only a projection, so the defect is not duplicate UI authority; it is a stale action/session boundary beneath that projection.

**Why wrong / fragile:**

UI can truthfully render "mounted" according to `MountActions` while the referenced animal belongs to the disposed world generation.

**Affected consumers:** HUD dismount action, riding movement/stamina, player position/camera, save projection.

**Owner domain:** `items-player`.

**Existing plan coverage:** fully covered by `items-player-057-mounted-player-lifecycle-and-restore-continuity.md`, depending on `world-033` and `settlements-npcs-048`.

**Recommended action:** do not create another UI plan for mount state. Implement `items-player-057` and let HUD remain a projection of the corrected mount owner.

## 5. Architecture observations

### Good: World Inspection uses the desired contract

`createInspectionActions()` keeps stable `{kind,id}` identity, rebuilds the read model from the current `ctx.bundle`, and closes when the entity no longer resolves. This should be the reference pattern for world-bound UI.

### Good: inventory/equipment UI is projection, not authority

Inventory quantities, held tool, armor slots and primary weapon selections are owned outside Vue. UI actions return through application/domain handlers, and mutations revalidate live inventory state.

### Good: quest/reputation UI does not own progression state

Quest Log, NPC quest previews, badges and reputation are projections over authoritative managers. No optimistic quest/reputation mutation in Vue was found.

### Good: interaction prompt is intentionally frame-sensitive

The gaze prompt follows a target whose distance/availability changes continuously. Per-frame projection is appropriate here; area 20/24 already own the expensive candidate-scan concerns.

### Performance: no new standalone performance finding

The recurring HUD/Character/Skills projections use scalar fields and equality bails, and expensive Character presentation is gated on the screen being open. No repeated full serialization/cloning of large simulation structures was found in the reviewed hot path.

World-bound list/read-model construction is predominantly open/refresh/event driven rather than every frame.

Expected ROI for further generic "eventify all HUD state" work is low without profiling; no benchmark-driven plan is justified by this audit.

## 6. Cross-domain dependencies / follow-ups

- **Area 01 / `world-033`:** central rebuild transaction must define when UI/world actions are blocked and must make rebuild input coherent.
- **Area 18:** inventory/container transaction fixes remain separate; F23-1 only addresses the stale generation/session identity problem.
- **Area 19 / `items-player-057`:** mounted state lifecycle is already owned there.
- **Area 20:** target identity/cycle plans remain the interaction-selection owner; do not fold those into UI session lifecycle.
- **Area 21:** quest/reputation authority remains sound; no new quest plan from this review.
- **`ui-input-014`:** reuse its stable-id/live-re-resolution pattern.

## 7. Existing plans that already cover findings

- `world-033-worldbundle-rebuild-transaction-and-lifecycle-safety.md` — F23-2 and the invalid-world portion of F23-1.
- `items-player-057-mounted-player-lifecycle-and-restore-continuity.md` — F23-3.
- `settlements-npcs-048-merchant-pack-animal-assignment-and-journey-continuity.md` — durable livestock identity dependency for F23-3.
- `ui-input-014-construction-status-and-context-actions.md` — existing good reference pattern, not a fix for F23-1.

## 8. New plans required

- `ui-input-031-world-bound-ui-session-rebuild-lifecycle.md` — focused owner for F23-1.

No other new plan is required.

## 9. Verification limits

Static code review only.

No browser verification was run. No `pnpm docs:sync` was run. No gameplay claim is marked verified from visual/manual behaviour.

The new/updated artifacts are documentation only; implementation findings were not changed.

## 10. Master status update

Area 23 should be marked:

**⚠️ reviewed with unresolved high/critical findings**

Follow-ups:

- `ui-input-031`
- `world-033`
- `items-player-057`

> **Zrób git commit i push do main, rebase jeżeli trzeba**

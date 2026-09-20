# Codebase domain audit 19 — Player systems

**Reviewed:** 2026-09-20  
**Area:** 19 — Player systems  
**Scope:** code correctness, architecture, lifecycle/persistence, performance  
**Baseline:** current `main`  
**Result:** ⚠️ reviewed with unresolved high findings

## 1. Scope

Audited only implemented player-system correctness, architecture, lifecycle/persistence and recurring runtime cost.

Traced:

- needs: world/input state → hunger/thirst/vigor/temperature-adjacent consequences → mutation → HUD → persistence;
- health/combat: incoming damage → HP/injury → downed → recovery → save/load;
- stamina: movement/action/riding → drain/regeneration → gating → HUD;
- equipment: inventory → held/equipped/primary state → combat/interaction → removal/switch → save/load;
- mounting: animal target → mount → riding → fall/downed/dismount → animal ownership → rebuild/save/load;
- player lifecycle: New Game → spawn → runtime → save/load → rebuild → downed recovery → New Game again.

Missing player features, balance, and design requests are intentionally excluded.

## 2. Entry points and authoritative owners

### Needs and stamina

`PlayerController.needs: PlayerNeeds` is authoritative.

- `PlayerController.update()` ticks sprint stamina on raw `dt`.
- `mountActions.update()` uses `tickRidingStamina()` while mounted; `PlayerController.update()` takes a mounted early return, so the two stamina paths do not double-tick.
- `gameLoop.ts` ticks hunger/thirst/vigor through `tickPlayerNeeds(..., worldDt, ...)`; time skip therefore advances survival needs through the same scaled simulation delta.
- HUD ratios are projected every frame from this state.
- hunger/thirst/vigor and deprivation durations persist; stamina is intentionally transient and starts full from `createPlayerNeeds()`.

No duplicate Vue/store authority was found.

### Health and injury

`PlayerController.health` is the authoritative `HealthState`. `PlayerController.injuryRecovery` owns the linked physical-injury state and references the same health object.

Incoming damage routes through `playerDamage.ts::applyPlayerDamage()`. HP 0 enters `PlayerController.enterDowned()` exactly once. The player does not currently have a separate corpse/death entity lifecycle.

HP/injury persistence is currently missing and is already owned by `items-player-050`.

### Equipment

- `Inventory` owns item existence.
- `HeldTool` owns the active hand selection and revalidates against Inventory.
- `EquipmentState` owns wearable slot choices but gameplay consumers resolve them against live Inventory, preventing ghost armor effects.
- `PrimaryWeaponSelection` owns persisted configured melee/ranged choices and revalidates with `syncWithInventory()`.
- `PlayerTorch` owns portable light burn state; current combat draw/sheathe integration preserves a lit wooden torch via belt carry and restores it only while still owned.

Vue/HUD state is projection, not item authority.

### Mounting

`mountActions.ts` owns the transient rider↔mount relationship:

- live `mount: AnimalAgent | null`;
- deferred `pendingRestoreId`;
- player mounted projection through `PlayerController.setMounted()`;
- animal mounted projection through `AnimalAgent.setMounted()`.

Animal HP, stamina, position and ownership remain on the `AnimalAgent` / persistent livestock system.

### Player lifecycle

`createApp.ts` owns boot/load and in-session New Game orchestration. `rebuildWorld(true)` resets many world/app-owned systems and repositions the existing `PlayerController` to the new home spawn rather than constructing a new player.

That reuse boundary is the source of F19-1.

## 3. Flows traced

### Needs

```text
world time / movement / physical work
→ PlayerNeeds pools
→ tickPlayerNeeds / tickPlayerStamina / physical-effort helpers
→ starvation/dehydration damage when severe
→ PlayerController.health
→ HUD projection
→ SaveData.playerNeeds (except stamina)
→ restorePersistedNeeds
```

Time-skip uses `worldDt` for hunger/thirst/vigor and does not separately replay the same needs, so no double-count was found.

### Health / combat / downed

```text
fauna/environment/starvation/fall
→ applyPlayerDamage
→ defense + HealthState
→ physical injury
→ HP == 0
→ enterDowned() once
→ melee/ranged/jump/sneak cancellation
→ tickDowned(worldDt)
→ applyDownedRecovery
→ normal control resumes
```

The combat attack machines are explicitly reset while downed. Ordinary world interaction is not globally blocked; see F19-3.

### Stamina

```text
on foot:
movement+sprint request
→ PlayerController.update(raw dt)
→ tickPlayerStamina
→ exhaustion gates sprint
→ HUD

mounted:
mount.update(raw dt)
→ AnimalAgent.driveMounted
→ tickRidingStamina
→ PlayerController mounted early-return
→ HUD
```

Fresh construction and `resetPlayerNeeds()` both restore stamina to max. Load intentionally does not persist stamina.

### Equipment

```text
Inventory
→ HeldTool / EquipmentState / PrimaryWeaponSelection ids
→ live ownership validation
→ player combat / interaction / defense
→ inventory mutation
→ syncWithInventory / live-valid equipment lookup
→ HUD / character projection
→ SaveData held/equipment/primary choices
```

Removed items do not remain a valid gameplay-active held/equipped item. No duplicate item owner was found.

### Mounting

```text
animal interactable
→ mount.tryMount
→ live AnimalAgent reference
→ animal.setMounted + player.setMounted
→ mount.update drives AnimalAgent
→ player seat transform
→ fall/death/downed/player dismount
→ exit()
→ optional persisted mountedAnimalId
```

Boot restore:

```text
SavePlayer.mountedAnimalId
→ pendingRestoreId
→ per-frame resolvePersistentAnimal
→ enter(restored agent)
```

Rebuild does not currently rebind the live reference; see F19-2.

### Player lifecycle

Boot/load constructs a fresh `PlayerController`, then restores persisted state.

In-session New Game instead does:

```text
beginNewSave
→ new seed
→ rebuildWorld(true)
→ reset selected world/app state
→ reuse existing PlayerController
→ resetPlayerNeeds only
→ setGround
→ home spawn setPosition
→ immediately save new slot
```

The start position reset is present. The player-owned state reset is incomplete; see F19-1.

## 4. Findings

### F19-1 — High — in-session New Game reuses PlayerController but resets only part of player-owned state

**Flow:** existing session → pause-menu New Game → `rebuildWorld(true)` → player reset → new save.

**Files / symbols:**

- `src/app/createApp.ts::rebuildWorld(resetCollectedItems)`
- `src/app/createApp.ts` pause-menu `onNewGame`
- `src/player/PlayerController.ts`
  - `health`
  - `injuryRecovery`
  - `skills`
  - `temporaryConditions`
  - `waterDrinkEventCount`
  - `unsafeFoodEventCount`
  - downed / pose / movement transient state
- `src/player/PlayerNeeds.ts::resetPlayerNeeds`

**Evidence:**

The New Game branch clears world state, inventory, torch, quests, reputation and several app-owned ledgers, then calls only:

```ts
resetPlayerNeeds(player.needs)
```

The existing `PlayerController` survives the rebuild. The branch does not reconstruct it and has no owner-level "fresh player" reset covering skills, temporary conditions/event counters, downed/transient controller state, or health/injury.

The same branch then relocates the player to the new home spawn and `onNewGame` immediately saves the new slot, so surviving state can become persisted under the new game.

**Why wrong / fragile:**

"New Game" creates a new world/save identity but retains selected state from the previous player runtime according to whichever fields happen to be manually cleared in `createApp.ts`. This is an incomplete lifecycle boundary and will keep drifting as player-owned fields are added.

The HP/injury subset is independently exposed by current non-persistence and is already covered by `items-player-050`; the broader New Game reset defect is not.

**Affected consumers:** PlayerController, skills, conditions, medicine/survival modifiers, deterministic poison/water rolls, HUD/character screen, newly created save.

**Owner domain:** `items-player` with composition-root orchestration.

**Existing plan coverage:** partial only. `items-player-050` explicitly requires New Game to start healthy but does not own the rest of PlayerController state.

**Recommended action:** new `items-player-056-player-new-game-runtime-state-reset.md`. Add one owner-level reset contract for player state and invoke it from the New Game transaction; keep persistence-specific HP/injury schema work in `items-player-050`.

---

### F19-2 — High — MountActions retains a transient AnimalAgent reference across WorldBundle rebuild

**Flow:** mounted horse → WorldBundle rebuild → old world disposal/reconstruction → next mount tick.

**Files / symbols:**

- `src/app/actions/mountActions.ts::createMountActions`
  - local `mount: AnimalAgent | null`
  - `update()`
  - `restoreMountedAnimalId()`
  - `mountedAnimalId()`
- `src/app/createApp.ts::rebuildWorld`
- `src/app/worldBundle.ts::rebuildWorldBundle`
- `src/app/createApp.ts::resolveMountAnimal`
- `src/settlement/SettlementsManager.ts` livestock capture/dispose/reconstruction

**Evidence:**

`MountActions` is created once for the app session and captures a direct `AnimalAgent` in `mount`.

`rebuildWorld(true|false)` rebuilds the `WorldBundle` and rebinds the player's ground callbacks, but does not dismount, clear, snapshot or re-resolve `MountActions.mount`.

The persistent-animal resolver is live-bundle based, but it is only used for initial/pending restore, not for an already-mounted reference after rebuild.

Settlement/fauna rebuild paths dispose/reconstruct runtime agents. The mount relation therefore has no explicit epoch/rebind contract even though it directly drives the agent and copies its seat transform every frame.

**Why wrong / fragile:**

A long-lived app-owned controller retains an object owned by a replaceable world runtime. This violates the same stable-bundle/rebuild boundary that other consumers solve with live accessors or explicit rebinds. Depending on which animal collection supplied the mount, post-rebuild code can operate on a disposed/replaced agent instead of the reconstructed persistent individual.

This is also a plausible root class for "horse disappears after rebuild" failures.

**Affected consumers:** ridden movement, horse mounted flag, player position/camera, riding stamina/XP, fall lifecycle, save snapshot.

**Owner domain:** `items-player`/mount integration, relying on `fauna` persistent identity and `world` rebuild transaction.

**Existing plan coverage:** `world-033` owns the generic WorldBundle rebuild transaction and explicitly requires current-world consumers to be rebound, but it does not define the mount relation's state/re-resolution contract. `settlements-npcs-048` owns persistent livestock identity collisions, not this direct-reference lifecycle.

**Recommended action:** new `items-player-057-mounted-player-lifecycle-and-restore-continuity.md`, depending on `world-033` and using the persistent-animal resolver rather than inventing a second mount registry.

---

### F19-3 — Medium — downed state blocks locomotion/combat but not the ordinary world-interaction dispatch

**Flow:** lethal player damage → downed/incapacitated → input → world action.

**Files / symbols:**

- `src/player/PlayerController.ts::enterDowned/isDowned/update`
- `src/app/gameLoop.ts` non-modal interaction dispatch
- `src/app/actions/actionContext.ts::isActionBlocked`
- individual action modules
- `src/app/actions/mountActions.ts::tryMount`
- `src/app/actions/leadActions.ts::tryLead`

**Evidence:**

`PlayerController` documents downed as "temporary incapacitation". Its own movement path early-returns and melee/ranged state machines are reset in `gameLoop.ts`.

However `isActionBlocked(ctx)` only checks busy/time-skip/rest-camp. It does not include `player.isDowned()`.

Mount and lead therefore add their own explicit downed checks, while the shared non-modal interaction path still builds/selects targets and can dispatch other ordinary world actions during the downed interval.

The archived plan that introduced downed requires attack cancellation and incapacity for combat actions, but there is no shared current contract preventing non-combat interaction mutations.

**Why wrong / fragile:**

The same incapacitation state has inconsistent action semantics depending on whether a particular action remembered to add its own guard. Adding more action modules increases the chance of divergence.

This is not a request for a new death system; it is a current input/lifecycle guard inconsistency.

**Affected consumers:** pickup/use, construction/resource/survival interactions, targeted skill actions, dialogue/container entry points where their local guard does not independently reject downed state.

**Owner domain:** `ui-input` at the shared player-action/input boundary.

**Existing plan coverage:** none. Area 20 reviewed interaction identity/routing but deliberately left player lifecycle to area 19.

**Recommended action:** new `ui-input-030-player-downed-action-input-gating.md`. Gate ordinary player world actions once at the shared dispatch/action-context boundary; keep allowed recovery/UI actions explicit.

---

### F19-4 — Medium — unresolved mounted restore intent is not represented by the save snapshot accessor

**Flow:** load save while mounted → async livestock materialization → save before reattach.

**Files / symbols:**

- `src/app/actions/mountActions.ts`
  - `pendingRestoreId`
  - `restoreMountedAnimalId()`
  - `mountedAnimalId()`
- `src/app/saveState.ts::getMountedAnimalId`
- `src/app/createApp.ts::resolveMountAnimal`

**Evidence:**

A loaded `mountedAnimalId` is copied to `pendingRestoreId` and retried every frame because livestock may materialize asynchronously.

But the exported accessor is:

```ts
mountedAnimalId: () => mount?.animalId ?? null
```

It ignores `pendingRestoreId`.

Therefore, until reattachment succeeds, a save snapshot serializes "not mounted". A manual/autosave in that window can erase the valid persisted mount intent even though the owner is explicitly still retrying it.

**Why wrong / fragile:**

The mount owner internally distinguishes "not mounted" from "restoring a persisted mounted relation", while its persistence projection collapses both to null. Persistence can therefore destroy state purely because reconstruction is asynchronous.

**Affected consumers:** SaveData.player.mountedAnimalId, Continue/Load, async livestock startup, any future rebuild-driven mount rebind.

**Owner domain:** `items-player` mount lifecycle with persistence projection.

**Existing plan coverage:** no focused coverage. `settlements-npcs-048` fixes identity namespace; it does not preserve pending mount restore intent.

**Recommended action:** cover together in `items-player-057-mounted-player-lifecycle-and-restore-continuity.md`.

---

### F19-5 — High — player HP and physical injury do not survive save/load

**Flow:** damage/injury → save → load → player reconstruction.

**Files / symbols:** `PlayerController.health`, `PlayerController.injuryRecovery`, `saveState.ts::buildSaveData`, `saveData.ts::SaveData`, `createApp.ts` restore.

**Evidence:** current schema version 50 persists needs, skills and temporary conditions but has no player HP/injury snapshot. Construction initializes full HP and zero injury.

**Why wrong / fragile:** save/load erases meaningful current health consequences while other player survival state survives.

**Affected consumers:** combat, medicine, character/HUD projections, survival continuity.

**Owner domain:** `items-player`.

**Existing plan coverage:** fully covered by `items-player-050-player-health-and-injury-persistence.md`.

**Recommended action:** implement `items-player-050`; no duplicate plan.

---

### F19-6 — High — cave position restore lacks the vertical coordinate required by the canonical ground resolver

**Flow:** cave position → save → load → `setPosition` → ground revalidation.

**Files / symbols:** `SavePlayer`, `saveState.ts::buildSaveData`, `createApp.ts`, `PlayerController.setPosition/groundAt`.

**Evidence:** current `SavePlayer` stores x/z/yaw/pitch but no Y. The ground resolver uses current/seed Y to distinguish cave floor from overlapping surface.

**Why wrong / fragile:** a cave save cannot reconstruct the same physical layer from X/Z alone.

**Affected consumers:** player transform, cave occupancy, collision/camera, subsequent interactions.

**Owner domain:** `persistence`.

**Existing plan coverage:** fully covered by `persistence-006-player-cave-position-save-load-continuity.md`.

**Recommended action:** implement `persistence-006`; no duplicate plan.

---

### F19-7 — High — player water traversal does not consume canonical local river water

**Flow:** world water → player vertical movement/swimming state.

**Files / symbols:** `PlayerController.worldWaterOwnsVertical/updateVerticalMotion`, `ChunkManager.sampleLocalWater`, `waterSample.ts`.

**Evidence:** area 05 confirmed player swimming is based on global `waterLevel` while canonical physical river water has local `waterH/bedH`.

**Why wrong / fragile:** actor type changes whether the same river is considered traversable/swimmable water; load/restore placement near water inherits the same authority split.

**Affected consumers:** player swimming/wading/vertical placement after movement/restore.

**Owner domain:** `world-terrain`.

**Existing plan coverage:** fully covered by `world-terrain-045-canonical-local-water-player-traversal.md`.

**Recommended action:** implement `world-terrain-045`; no duplicate plan.

---

### F19-8 — High — persisted mount identity is only a bare animalId although durable livestock identity is namespaced

**Flow:** persisted livestock identity → mountedAnimalId → restore resolver.

**Files / symbols:** `SavePlayer.mountedAnimalId`, `SettlementsManager.resolvePersistentAnimal`, `createApp.ts::resolveMountAnimal`.

**Evidence:** areas 03 and 17 confirmed persistent livestock identity is effectively origin settlement + animal id, while mount restore stores/resolves only the bare id. Deterministic ids can collide across settlements.

**Why wrong / fragile:** a saved mount reference cannot uniquely identify every durable animal the persistence layer can represent.

**Affected consumers:** mount restore, ownership transfer and merchant pack-animal lookup.

**Owner domain:** shared persistent livestock identity.

**Existing plan coverage:** covered by `settlements-npcs-048-merchant-pack-animal-assignment-and-journey-continuity.md`; area 17 explicitly treats this as incomplete verification of that plan rather than a reason for another identity plan.

**Recommended action:** complete `settlements-npcs-048`; `items-player-057` must consume the corrected identity contract rather than inventing a separate identifier.

## 5. Architecture observations

### Needs/stamina ownership is coherent

No duplicate stamina/needs store was found. PlayerController/PlayerNeeds own simulation state; HUD/Vue consume snapshots. Mounted stamina has a separate tick function but not a second state.

Stamina intentionally starts full on load and New Game. Current code does not expose the previously reported "new game starts below 100%" as a static state-initialization defect.

### Time-skip needs semantics are coherent

`worldDt` advances hunger/thirst/vigor through the ordinary needs tick. The explicit skip completion path does not also replay the same pools. Sleep then applies its documented rest restore. No double-count finding was confirmed.

### Equipment ownership is coherent

Held, wearable and primary-weapon state are selections over Inventory, not independent item ownership. Current live validation prevents removed items from continuing to grant held/equipment gameplay effects.

The handheld-torch draw/sheathe integration also preserves lit state without creating a second torch item owner. No new finding was created for `items-player-048`.

### UI projection is mostly live

Player needs/HP/character stats are projected from authoritative state during the loop. No independent Vue HP/stamina/needs authority was found.

A UI value can still be stale when its underlying player owner is wrongly retained across New Game; that is a consequence of F19-1, not a separate UI-store finding.

### New Game position reset exists

After `PlayerController.setGround(...)`, a genuine New Game computes the new home settlement spawn and calls `player.setPosition(homeSpawn.x, homeSpawn.z)`.

The earlier observed "New Game does not return to start" failure is therefore not present in current code.

### Ground/collision refresh after rebuild is explicit

Successful rebuild rebinds PlayerController ground/floor/water/collider/cave callbacks through `setGround()`, which re-snaps the current player transform. The remaining cave-save Y defect is persistence-006 rather than a missing ground rebind.

## 6. Cross-domain dependencies / follow-ups

- `items-player-050` and new `items-player-056` must agree on one New Game health/injury reset owner; do not add a second HP state.
- New `items-player-057` should use the `world-033` rebuild lifecycle seam and the corrected persistent livestock identity from `settlements-npcs-048`.
- `persistence-006` owns cave/surface restore position. Do not persist a parallel cave-id player state.
- `world-terrain-045` owns physical local-water authority for player traversal.
- `ui-input-028` already owns interaction selection state across rebuild. New `ui-input-030` should only gate actions by player incapacitation, not redesign target identity.
- Player health/downed consequences continue through the combat owner traced by area 15; no second death/corpse pipeline should be introduced.

## 7. Existing plans that already cover findings

- `items-player-050-player-health-and-injury-persistence.md` — F19-5 and the health/injury subset of New Game semantics.
- `persistence-006-player-cave-position-save-load-continuity.md` — F19-6.
- `world-terrain-045-canonical-local-water-player-traversal.md` — F19-7.
- `settlements-npcs-048-merchant-pack-animal-assignment-and-journey-continuity.md` — F19-8 persistent livestock identity.
- `world-033-worldbundle-rebuild-transaction-and-lifecycle-safety.md` — rebuild transaction/rebind foundation required by F19-2.
- `ui-input-028-interaction-target-identity-and-cycle-lifecycle.md` — adjacent rebuild target-selection cleanup; not a downed-input fix.
- `items-player-048-handheld-torch-retention-across-combat-weapon-draw.md` — torch retention already implemented/currently coherent; no duplicate finding.

## 8. New plans required

Created:

1. `items-player-056-player-new-game-runtime-state-reset.md`
   - F19-1.

2. `items-player-057-mounted-player-lifecycle-and-restore-continuity.md`
   - F19-2;
   - F19-4;
   - depends on/reuses `world-033` rebuild lifecycle and `settlements-npcs-048` identity work.

3. `ui-input-030-player-downed-action-input-gating.md`
   - F19-3.

No new plans were created for F19-5/F19-6/F19-7/F19-8 because current plans already own them.

## 9. Verification limits

Static code/architecture review only.

Not performed:

- browser/gameplay verification;
- production-code implementation;
- performance benchmark execution;
- `pnpm docs:sync`.

No new player-specific recurring O(N²) or full-world scan was confirmed. The pending mount restore currently performs a persistent-animal lookup every frame until resolution; this should disappear as part of the bounded restore lifecycle in `items-player-057`, but current scale/evidence does not justify a separate performance finding.

## 10. Master status update

Area 19 should be marked:

**⚠️ reviewed with unresolved high/critical findings**

Follow-up owners:

- new `items-player-056`;
- new `items-player-057`;
- new `ui-input-030`;
- existing `items-player-050`;
- existing `persistence-006`;
- existing `world-terrain-045`;
- existing `settlements-npcs-048`;
- existing `world-033`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

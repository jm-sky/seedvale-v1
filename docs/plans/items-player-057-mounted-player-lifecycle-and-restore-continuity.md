# Plan: Mounted player lifecycle and restore continuity

**Created:** 2026-09-20  
**Status:** `in progress` 🔄 — lifecycle correctness delivered against the existing bare-id identity; collision-safe identity blocked on `settlements-npcs-048` — see "Implementation status"  
**Priority:** high · **Effort:** S  
**Depends on:** ~~world-033~~, settlements-npcs-048 (plan file claims `verification needed`, but current code has not actually landed the canonical namespaced identity this plan needs — see "Implementation status")  
**Domain:** `items-player`  
**Type:** `fix`  
**Roadmap:** -
**Model:** Sonnet, Composer

## Problem

`mountActions.ts` owns the rider relation as a direct `AnimalAgent` reference plus a deferred `pendingRestoreId`.

Two lifecycle gaps exist:

1. a live `mount` reference survives an in-session `WorldBundle` rebuild even though the world can dispose/reconstruct the corresponding runtime animal;
2. while load restore is pending, `mountedAnimalId()` returns null because it only exports the live reference, so a save before async livestock materialization can erase the persisted mount relation.

The persistent livestock identity itself also has the known bare-id collision defect already owned by `settlements-npcs-048`. This plan must consume that corrected identity rather than invent another mount identity.

## Goal

Make the mounted-player relation explicit across:

```text
mount
→ save
→ load/pending restore
→ live reattach
→ WorldBundle rebuild
→ rebind/cancel/re-resolve
→ fall/downed/dismount
```

Never drive a disposed/replaced `AnimalAgent`, and never lose a valid persisted mounted relation merely because reconstruction is still pending.

## Ownership

Keep:

- animal position/HP/stamina/ownership on the persistent livestock/AnimalAgent owner;
- rider relation inside `MountActions`;
- player mounted locomotion projection on `PlayerController.setMounted()`;
- WorldBundle rebuild lifecycle in `world-033`;
- canonical durable livestock identity in `settlements-npcs-048`.

No mount registry and no duplicated horse state.

## Implementation

### 1. Represent relation identity separately from current runtime object

Inside `MountActions`, model the semantic mounted/restoring relation with the corrected durable animal reference/identity and treat the live `AnimalAgent` as a resolved runtime handle.

Do not use an object reference as the only durable meaning of "the player is mounted/restoring mount".

The exact durable ref shape should follow `settlements-npcs-048` once implemented. Do not hard-code another `originSettlementId + animalId` type if a canonical type already exists.

### 2. Preserve pending restore in save projection

The save accessor must return the durable mounted/restoring identity while either:

- a live valid mount is attached; or
- a valid restore/rebind is still pending.

A genuinely invalid/dead/missing terminal mount should clear the relation.

Do not persist timers, stability state, distance counters, UI callbacks or direct runtime references.

### 3. Add explicit rebuild lifecycle handling

Integrate with the central `world-033` rebuild transaction.

Before old-world animal owners are disposed, either:

- detach the runtime handle while retaining the durable mounted relation for re-resolution; or
- otherwise guarantee that the handle is never ticked through the invalid rebuild window.

After successful fresh publication, resolve the same persistent animal through the fresh bundle and reattach exactly once if still valid.

New Game must clear the relation rather than carrying it into the new world.

A failed/stale rebuild must follow `world-033`'s terminal lifecycle outcome without reviving an old handle.

### 4. Keep fall/downed/dismount exact

Preserve existing semantics:

- horse death → dismount;
- player downed → dismount;
- stability fall → dismount then player fall damage through `applyPlayerDamage`;
- conscious player dismount may refresh owned Stay anchor;
- no double `setMounted(false)` consequence;
- player and animal mounted projections agree after every exit.

### 5. Bound restore work

Pending restore currently retries the persistent-animal resolver every frame.

Once lifecycle correctness is fixed, prefer resolving at explicit livestock/world readiness or a bounded cadence if the existing async construction seam supports it cleanly. Do not create a worker or global animal index just for this.

Performance optimization is secondary to correctness and should not change restore semantics.

## Relevant files / symbols

- `src/app/actions/mountActions.ts`
- `src/app/createApp.ts::resolveMountAnimal`
- `src/app/createApp.ts::rebuildWorld`
- `src/app/worldBundle.ts::rebuildWorldBundle`
- `src/app/saveState.ts::getMountedAnimalId`
- `src/persistence/saveData.ts::SavePlayer`
- `src/settlement/SettlementsManager.ts::resolvePersistentAnimal`
- canonical persistent-livestock identity introduced/fixed by `settlements-npcs-048`

## Tests

1. mounted player → save → load → pending restore → same animal reattaches;
2. save while restore is still pending preserves the mounted relation;
3. same-world rebuild while mounted never ticks the disposed pre-rebuild agent;
4. successful rebuild reattaches the reconstructed same persistent animal exactly once;
5. New Game clears the old mounted relation;
6. dead/invalid mount clears pending/live relation and next save omits it;
7. fall → dismount → damage remains exact once;
8. downed while mounted exits cleanly;
9. conscious dismount still refreshes Stay only under the existing rule;
10. identity collision case resolves through the canonical namespaced livestock identity, not a bare id.

## Guardrails

- no second livestock registry;
- no second player position authority;
- no raw runtime object in SaveData;
- do not duplicate `world-033` rebuild transaction logic;
- do not duplicate `settlements-npcs-048` identity model;
- no browser verification by the AI agent;
- do not run `pnpm docs:sync`.

## Implementation status (2026-09-21)

**Scope delivered:** every lifecycle-correctness item this plan asks for, using the existing bare `animalId` identity (unchanged `SavePlayer.mountedAnimalId?: string`, no schema/migration work).

- `MountActions` now separates the durable relation from the live handle: the live `AnimalAgent` reference (`mount`) and the durable `pendingRestoreId` are tracked independently, and the save projection `mountedAnimalId()` returns the live id **or** the still-pending id, never silently `null` mid-resolution (fixes problem #2 from the plan).
- `detachForRebuild()` drops the live handle (and closes any in-flight foreign-property incident) while keeping the durable id as `pendingRestoreId`, so `update()`'s existing per-frame pending-restore resolution — unchanged, no duplicated state machine — re-resolves and reattaches the same persistent animal exactly once after a fresh `WorldBundle` publishes (fixes problem #1). A dead/non-mountable animal discovered this way now cleanly clears the player's mounted projection (`player.setMounted(false)` + HUD + toast) instead of leaving it stuck, since the player was already visually mounted going into that tick — the original boot-time pending-restore path is unaffected (it never sets `player.isMounted()` before resolution).
- `resetForNewGame()` clears both the live and pending relation immediately with none of `dismount()`'s gameplay consequences (no toast, no Stay refresh, no position offset) — consumed by `items-player-056`.
- `createApp.ts::rebuildWorld` calls `mount.detachForRebuild()` before every ordinary same-world rebuild's `rebuildWorldBundle()` (which synchronously disposes `bundle.settlementsManager`/`bundle.fauna` before this file regains control), and `mount.resetForNewGame()` + `lead.detach()` before a New Game's dispose. No second rebuild state machine was added — this reuses `world-033`'s existing `beginRebuild`/`completePublished`/`completeStale`/`completeFailed` gate verbatim; `gameLoop.tick()` (and therefore `mount.update()`) is already skipped for the whole invalid window, so the detached handle is never ticked mid-rebuild.
- Exit semantics (death/downed/fall/player dismount, Stay refresh rule, single `setMounted(false)`) are untouched.

**Scope deliberately not delivered — dependency gap, not an oversight:** test #10 (identity-collision resolution through a canonical namespaced reference). Recon before implementing confirmed `settlements-npcs-048` is marked `verification needed` in its own plan file but has **not** actually landed a collision-safe identity in current code: `SettlementsManager`/`livestock.ts`'s `PersistentLivestockContext.detachedById`/`detachedOriginById` and `resolveLivePersistentAnimal()` are still keyed by bare `animalId`, exactly as this plan's implementation notes flagged. Per this plan's own guardrails ("no second livestock registry", "do not duplicate `settlements-npcs-048`'s identity model"), inventing a mount-only namespaced type here was explicitly out of scope. Two settlements whose livestock collide on the same bare id are therefore still not disambiguated for mount save/restore/rebuild — this is the same pre-existing limitation `settlements-npcs-048` was supposed to close, now also documented at [persistence.md](../state/persistence.md#known-persistence-limitations) and [player-systems.md](../state/player-systems.md). Once `settlements-npcs-048` actually lands its canonical `PersistentLivestockRef`, `MountActions`'s durable relation and `SavePlayer.mountedAnimalId` should be migrated onto it (with a real `CURRENT_SAVE_VERSION` bump if the persisted shape changes) — do not treat that plan's current `verification needed` label as proof the type already exists; re-check `src/settlement/livestock.ts` first.

**Tests:** `mountActions.test.ts` gained coverage for the save-projection-while-pending, detach→reattach-on-fresh-resolve, dead-animal-after-rebuild-detach cleanup, and New-Game full clear (both live and pending-only cases). `tsc --noEmit`, `lint:fix`, `build`, and the full `vitest` suite (8041 tests) pass. Browser/manual verification (mount → in-session rebuild → still riding the same horse; mount → New Game → no stale relation) remains User-owned; `pnpm docs:sync` was run once for the combined three-plan delivery per the session's own instructions.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Implementation notes: items-player-057 — Mounted player lifecycle and restore continuity

**Plan:** `docs/plans/archive/items-player-057-mounted-player-lifecycle-and-restore-continuity.md`  
**Recon basis:** current `main`, 2026-09-20

## Recon conclusion

The plan is valid, but one dependency is not actually complete in current code.

`settlements-npcs-048` is marked `verification needed`, yet the identity contract required here is still missing: `PersistentLivestockContext.detachedById`, `detachedOriginById` and `resolveLivePersistentAnimal()` are keyed by bare `animalId`. Its implementation substituted collision rejection instead of introducing a canonical namespaced persistent-livestock reference.

Do **not** invent a mount-only `{ originSettlementId, animalId }` type. Finish/reuse the canonical persistent-livestock identity at the livestock owner first; 057 should then consume that type through `SettlementsManager`.

`world-033` is present and already gates `gameLoop.tick()` while a rebuild is invalid. That prevents ticking the stale mount during the destructive window, but it does **not** fix the mount after publication: the long-lived `MountActions` instance still holds the disposed pre-rebuild `AnimalAgent`.

## Current mount lifecycle

`src/app/actions/mountActions.ts` currently owns:

- `mount: AnimalAgent | null`;
- `pendingRestoreId: string | null`;
- `mountedAnimalId() => mount?.animalId ?? null`;
- per-frame pending resolution in `update()`.

Consequences confirmed from code:

1. saving during pending restore writes no mounted relation;
2. successful same-world rebuild resumes with `mount` still pointing at the old disposed agent;
3. `dismount()` cannot be used as a generic reset because `exit()` is a no-op when only a pending restore exists;
4. pending restore retries every frame.

## Recommended shape

Keep one semantic relation in `MountActions`:

```text
durableRef: PersistentLivestockRef | null
liveMount: AnimalAgent | null
```

Names are flexible; ownership is not.

- `durableRef !== null` means "mounted or legitimately waiting to re-resolve".
- `liveMount` is only the current-world handle.
- save projection returns `durableRef`, not data derived from `liveMount`.
- terminal invalidity/death/player dismount/fall/downed clears both.
- rebuild detaches only the runtime handle and retains the durable relation.

Do not persist stability timer, travelled distance, foreign-property incident state or callbacks.

## Persistent identity dependency

The implementation should not start the SaveData/mount ref conversion until the livestock owner exposes a collision-safe canonical identity and resolver.

Required livestock-side seam should be equivalent to:

```text
persistent ref -> exact live AnimalAgent for that origin
live persistent AnimalAgent -> exact persistent ref
```

Use the canonical type/API produced by the corrected `settlements-npcs-048`; do not reconstruct origin by calling the current bare-id `resolvePersistentAnimalOrigin(animalId)` after a separate lookup.

This also means the current `SavePlayer.mountedAnimalId?: string` is not sufficient for test #10. Once the shared ref exists, persist that canonical ref (rename the field if the shared persistence work chooses to; otherwise migrate the existing field deliberately). If the persisted representation changes, follow the existing `CURRENT_SAVE_VERSION` migration pipeline. Legacy bare-id saves need an explicit compatibility policy; do not silently guess between colliding origins.

## Rebuild integration

Use the existing `world-033` transaction; no second rebuild state machine.

Add narrow lifecycle methods on `MountActions` (names flexible), conceptually:

- before destructive same-world rebuild: clear `liveMount` projection without clearing the durable relation;
- after a `published` outcome: resolve the durable ref against the fresh `bundle.settlementsManager` and attach once when available;
- on New Game: clear the relation completely;
- on stale/failed/disposed outcome: never reattach to the old handle.

Important: the rebuild detach path must **not** run normal player dismount consequences. In particular it must not offset player position, show a toast, refresh Stay, or close/reopen foreign-property incidents as if the player voluntarily dismounted. It is lifecycle rebinding, not gameplay dismount.

After fresh publication, use the normal mount projection setup (`animal.setMounted(true)`, `player.setMounted(true)`, HUD/seat transform), but avoid treating restore/rebind as a new foreign-property use incident.

## Load / pending restore

Replace `restoreMountedAnimalId()` with the canonical ref equivalent.

The save accessor must return the durable ref while resolution is pending. A not-yet-materialized animal is not terminally missing.

Do not optimize correctness away. Current per-frame retry is acceptable as a temporary fallback. If a narrow readiness hook already exposed by settlement/livestock construction can trigger re-resolution, use it; otherwise use a small bounded cadence inside `MountActions`, not a new global index/worker/event bus.

## Exit semantics to preserve

Keep `exit()` gameplay behavior for actual live exits:

- death, downed and fall clear relation once;
- fall still calls `applyPlayerDamage()` after dismount;
- only conscious `reason === 'player'` may refresh owned Stay;
- `setMounted(false)` must happen once per live handle.

Add a separate internal "drop runtime handle for rebuild" path rather than overloading `exit('unavailable')`.

If a durable ref resolves to a dead/non-mountable persisted animal, clear the relation terminally. A temporary "not found yet" during asynchronous materialization must remain pending.

## Files to change

Primary:

- `src/app/actions/mountActions.ts` — split durable relation from live handle; explicit reset/rebuild hooks.
- `src/app/createApp.ts` — use canonical persistent-livestock resolver; call mount lifecycle hooks around `rebuildWorld()`; New Game clears instead of retaining.
- `src/app/saveState.ts` — getter type follows canonical mounted ref.
- `src/persistence/saveData.ts` — persisted mounted relation + validation/migration only if the canonical ref changes schema.

Dependency-owned, not 057-owned unless still unfinished when implementation starts:

- `src/settlement/livestock.ts`;
- `src/settlement/SettlementsManager.ts`.

Do not modify `worldBundle.ts` transaction logic for this plan; `world-033` already owns publication/stale/failure semantics.

## Focused tests

Highest-value coverage:

1. pending load restore is included in save data before livestock materializes;
2. same-world rebuild drops the old runtime handle before disposal and rebinds exactly once after fresh publication;
3. no gameplay dismount side effects occur during lifecycle rebind;
4. New Game clears both live and pending relation;
5. dead/non-mountable resolved animal clears pending relation;
6. fall/downed/player dismount retain existing one-shot consequences;
7. two origins with the same bare `animalId` restore the namespaced animal selected by the persisted canonical ref.

Prefer unit tests around `MountActions` with fake agents/resolver plus the smallest composition-root test needed for rebuild hook ordering. Browser verification remains User-owned.

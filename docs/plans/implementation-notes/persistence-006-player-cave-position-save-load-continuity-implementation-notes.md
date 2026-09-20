# Implementation Notes: Player cave position save/load continuity

## Current code facts

- `SavePlayer` in `src/persistence/saveData.ts` currently stores `x/z/yaw/pitch` plus optional `mountedAnimalId`; `src/app/saveState.ts::buildSaveData()` writes X/Z directly from `player.mesh.position`.
- Initial load in `src/app/createApp.ts` creates `PlayerController` only after the current `WorldBundle` and Cave V2 query functions exist, then calls `player.setPosition(initialSave.player.x, initialSave.player.z)`. No restore reordering is required for this fix.
- `PlayerController.setPosition(x, z, { groundQuerySeedY })` already exists. When supplied, it seeds `mesh.position.y`, then calls the normal `snapToGround()`; `groundAt()` delegates to the Y-aware Cave V2 `queryGround(x, y, z)`.
- Cave spatial identity remains derived: `Caves.spatialContextAt(x,y,z)` returns surface for open-sky mouth occupancy and cave context only for closed occupancy. Do not persist or restore `WorldSpatialContext`, `caveId`, or an inside-cave flag.

## Persistence decision

This is a persisted-representation change, so follow the repository's current schema contract rather than leaving the version bump conditional:

- bump `CURRENT_SAVE_VERSION` by one;
- add the next sequential migration and registry entry;
- migration must only advance the version and **must not synthesize Y** for legacy saves.

Add `y?: number` (or equivalently named vertical seed) to `SavePlayer`. New saves should always emit the live finite `player.mesh.position.y`; optionality exists only so migrated legacy saves retain the old behavior.

Update `isSavePlayer()` so missing Y is accepted, but a present Y must be a finite number. Do not default legacy Y to surface height in the migration because that would silently change the legacy restore contract and erase the distinction between “unknown vertical layer” and a real saved coordinate.

## Restore integration

In the existing initial-save block in `createApp.ts`:

- preserve the current yaw/pitch-before-position ordering;
- when saved Y is present, call the existing `setPosition(x, z, { groundQuerySeedY: y })`;
- when Y is absent, keep the exact current `setPosition(x, z)` path.

Do not assign `mesh.position.y` directly and do not trust saved Y as a final floor height. `setPosition()` must remain the revalidation boundary so stale/changed geometry is resolved by current Cave V2 ground semantics.

The current world/cave authority is already available before this call: `PlayerController.create()` receives `caveGroundQuery`, `caveFloorSampler`, occupancy and horizontal-resolver functions from the built bundle. Avoid extra waits for cave presentation; Cave V2 spatial queries are independent of streamed presentation.

## Mounted-player interaction

Mount restore happens later through `MountActions.restoreMountedAnimalId()`; once the animal resolves, `enter(..., 'restore')` sets the player's mounted projection/seat transform. Therefore persistence-006 should only restore the player's saved standalone position first and must not move mount ownership into persistence.

Related `items-player-057-mounted-player-lifecycle-and-restore-continuity.md` is still planned and owns pending/live mount identity and rebuild correctness. Do not couple this fix to that plan or redesign `mountedAnimalId`; keep the current mount restore call-site intact. If 057 lands first, adapt to its canonical mount relation but preserve the same rule: mount runtime owns the mounted transform once reattached.

## Tests with highest value

- `src/persistence/saveData.test.ts`: current save round-trips player Y; malformed/non-finite Y is rejected; previous-version save migrates successfully with `player.y === undefined`.
- Add a focused restore/ground regression at the narrowest existing player/cave test seam: same X/Z with a closed cave floor and surface above, saved cave Y selects the cave floor through `setPosition(...groundQuerySeedY)`.
- Pin legacy behavior separately: no saved Y follows the old `setPosition(x,z)` path rather than guessing a cave.
- Cover open-sky mouth using current Cave V2 semantics; do not encode an independent mouth rule in persistence.
- Mount coverage only needs to prove this change does not override the later mounted transform; leave pending-mount lifecycle cases to items-player-057.

## Pitfalls

- Do not use `sampleFloor(x,z)` on load: it is intentionally Y-blind and can select an underground floor for a surface save.
- Do not use `spatialContextAt()` as persisted state or as a replacement for ground arbitration.
- Do not add a cave-specific save object/store or a second restore phase.
- Do not change generic `setPosition(x,z)` semantics; several existing callers intentionally rely on its current behavior.
- No `docs:sync` and no browser verification by the implementation agent.

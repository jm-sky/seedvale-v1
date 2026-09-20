# Implementation Notes: Campfire decomposition and ash residue

**Plan:** `items-player-058-campfire-decomposition-and-ash-residue.md`  
**Reviewed:** 2026-09-20

## Current ownership and contracts

### Player-placed fires

`src/settlement/PlacedFires.ts` is the authoritative owner of freeform player fires.

Current persisted shape:

```ts
export type PlacedFire = {
  id: string
  x: number
  z: number
  kind: PlacedFireKind
  grate: boolean
}
```

Runtime `PlacedFireEntry` adds `VillageFire`, `everLit`, `unlitSeconds` and `habitatBurn`.

Important consequences:

- `everLit` is runtime-only and is reset by reconstruction, so it cannot answer “was this fire ever used?” after save/load;
- `nodes()` is the save-facing projection and already excludes habitat-burn fires via `isPlayerPlacedFire`;
- the existing private `despawn(id)` already owns the correct mesh/light cleanup sequence:
  `pointLightBudget.unregisterSubtree → removeFromParent → disposeObject3D → splice collection`;
- expose/reuse that lifecycle instead of writing another removal implementation.

Add persisted `hasBurned` to `PlacedFire`. Keep `everLit` only if its current automatic-despawn semantics still need it; do not overload it with persistence semantics.

When an existing fire becomes lit, make the authoritative record's `hasBurned` sticky. For a newly created `simple`, initialize it true because `place()` immediately lights it and adds fuel. Cold `pit`/ `pile` start false.

### Fire build costs

`src/app/userActions.ts` owns:

- `SIMPLE_FIRE_BRANCH_COST = 2`
- `FIRE_PIT_STONE_COST = 4`
- `GRATE_COST`

Recovery must import/reuse `FIRE_PIT_STONE_COST`; do not duplicate `4`.

Do not implement grate salvage in this plan. If a live `pit` has `grate === true`, removal preview/commit must reject it.

## Interaction identity gap

`src/interaction/Interactable.ts` currently models campfire as:

```ts
{ kind: 'campfire', position, promptLabel, fire: VillageFire }
```

`src/app/interactables.ts` builds both:

- entries from `placedFires.list()`;
- settlement fires.

The target therefore currently loses the stable `PlacedFire.id` and kind at the interaction boundary.

Extend the campfire variant with explicit source metadata. Keep settlement and placed identities distinct; do not infer a player fire later by comparing positions.

Also update `interactableStableKey()` in `src/interaction/interactionView.ts`: use placed fire id when available. Coordinate identity can remain for settlement campfires if they have no stable fire id at this seam.

Habitat-burn entries are present inside `PlacedFires.list()`, but are not player-built camps. Preserve the existing `isPlayerPlacedFire` rule when exposing dismantle identity.

## Existing [R] campfire routing

`src/app/interactables.ts` currently emits the lit prompt:

```ts
[E] Dołóż opał · [R] Upiecz mięso
```

`src/app/gameLoop.ts` has a dedicated `target.kind === 'campfire'` branch for ignite/refuel/cook.

Do not add a second key listener.

The cleanest integration is:

1. derive the structured alternate action in `interactionView.ts` from live target + held-tool context;
2. in the existing campfire dispatch branch, if the target is a supported player-placed fire and the held tool has `soil_digging`, route `altInteractPressed` to the dismantle action;
3. otherwise preserve current cooking routing unchanged.

Execution must revalidate. Presentation deciding that `[R]` means dismantle is not mutation authority.

When a grate blocks dismantle, keep `[R]` as a disabled dismantle action while the digging tool is held; do not silently fall back to cooking, because that would make prompt and execution disagree.

## Tool capability

Use the existing catalog capability seam:

```ts
hasItemCapability(ctx.heldTool.held(), 'soil_digging')
```

Relevant precedent:

- `src/app/actions/storageInfestationActions.ts` uses this exact check for shovel-like nest destruction;
- `src/app/interactables.ts` already derives `shovelHeld` using `soil_digging`;
- `src/items/itemCatalog.ts` documents `soil_digging` as the capability for moving earth.

Do not add a new item capability and do not check `kind === 'shovel'`.

## Suggested action owner

Do not put salvage/residue mutation inside `PlacedFires.remove()`.

Use an application-layer action at the existing player-action seam. A small `src/app/actions/fireRemovalActions.ts` is justified if keeping this in `userActions.ts` would couple inspection/game-loop wiring back into that UI/build-action module.

The action should expose two operations:

- a pure/lightweight preview/query for UI availability and recovery text;
- a commit by stable `PlacedFire.id`.

Commit order should be transactional:

1. find the live entry by id from `ctx.bundle.placedFires`;
2. reject missing/habitat-burn/unsupported kind/`pile`;
3. reject `grate === true`;
4. capture `kind`, `hasBurned`, x/z and salvage before deletion;
5. call the owner's removal path exactly once;
6. grant stone recovery through `ctx.grantItem('stone', FIRE_PIT_STONE_COST)`;
7. add residue only if captured `hasBurned`;
8. run normal inventory/HUD sync where needed.

Do not award salvage before successful removal.

The same commit function must be passed to Inspection and game-loop shortcut. Do not reproduce its body in either caller.

## Inspection seam

Current inspection plumbing:

- `src/app/inspection/inspectionTarget.ts` turns gaze `Interactable` into stable `InspectionTargetRef`;
- `src/app/inspection/worldInspectionView.ts` owns presentation-only target/action types;
- `src/app/inspection/buildWorldInspection.ts` builds the live read model;
- `src/app/actions/inspectionActions.ts` keeps only `{kind,id}`, re-resolves through current `ctx.bundle`, and uses generic danger confirmation.

Extend this existing seam with `placedFire`. Do not capture a `PlacedFireEntry` in the Vue callback.

Reuse `variant: 'danger'` and `confirmDanger(...)`.

A fire removal preview should provide at least:

- whether removal is allowed;
- blocker reason (notably grate);
- recovery copy for `pit`;
- current live fire kind/state needed by the read model.

After successful removal the inspection target no longer exists; close rather than refreshing stale state.

Settlement fires must continue returning no inspection target for this feature.

## Persistence

`src/app/saveState.ts::buildSaveData()` is the single SaveData assembly point and already serializes:

```ts
placedFires: bundle.placedFires.nodes().map((fire) => ({ ...fire }))
```

`src/app/createApp.ts` / `createWorldBundle` reconstruct world-owned collections directly from the supplied SaveData.

The plan changes persisted representation in two ways:

1. `PlacedFire.hasBurned`;
2. new fire-residue collection.

Therefore follow the repository's normal migration contract in `src/persistence/saveData.ts`:

- bump `CURRENT_SAVE_VERSION`;
- add exactly one next migration;
- migration defaults `fireResidues` to `[]`;
- normalize old placed fires with missing `hasBurned`.

Migration rule for old fires:

- old `simple`: `hasBurned = true` (a simple fire starts lit when created);
- old `pit` / `pile`: `hasBurned = false` because old saves contain no evidence that they were ever lit; prefer avoiding false ash over inventing history.

Do not restate the numeric save version in plan/docs.

Update validation for both new shapes and add migration/validation tests adjacent to current persistence tests.

## Fire residue owner

Do not use `TerrainModification.mode = 'scorch'`.

The current scorch path is terrain state that invalidates/rebuilds terrain data and is persisted as a player terrain modification. A one-day cosmetic world trace has different lifecycle/ownership.

Use a small world collection, preferably `src/world/fireResidues.ts`, with records containing absolute game-day expiry.

Suggested shape:

```ts
export type FireResidueRecord = {
  id: string
  x: number
  z: number
  createdAtDay: number
  expiresAtDay: number
}
```

Needed API:

- `add(x, z, nowDays)`;
- `nodes()`;
- `reconcile(nowDays)`;
- `dispose()`.

Generate stable unique ids using the same local/session id style used by other player-created sparse records; identity only needs to survive persistence/rebuild, not be seed-derived.

Keep expiry based on `dayNight.elapsedDays`.

Avoid an unconditional O(n) expiry scan every render frame. Cache the earliest expiry or call `reconcile` from bounded world-time lifecycle points. If the simplest integration needs a low-frequency check, keep it independent of render FPS.

WorldBundle owns the collection/runtime projection so same-world rebuild and save/load use one lifecycle boundary.

## Residue rendering

`src/terrain/bloodOverlay.ts` is the relevant rendering precedent:

- one fixed-capacity `InstancedMesh`;
- no mesh/material per trace;
- active representation rebuilt from trace records;
- ground placement uses a height sampler.

Reuse the pattern, not the blood domain/module itself.

A fire residue overlay can be simpler:

- flat/near-flat primitive;
- deterministic rotation/scale from residue id if visual variation is desired;
- one shared material;
- slight Y offset to avoid z-fighting;
- no interaction/collision.

Do not modify the terrain shader or chunk vertex-color scorch pipeline for this feature unless code recon during implementation disproves the lightweight overlay route.

## Time skip and expiry

The residue record uses absolute `expiresAtDay`, so normal progression and time skip share semantics.

Find the existing post-time-skip/world-time synchronization point and call `reconcile(dayNight.elapsedDays)` there. Also reconcile immediately after restoration so an expired saved record cannot render for one frame/session.

Do not build a separate timer based on real seconds.

## WorldBundle/rebuild safety

`WorldBundle` is replaced/rebuilt while app-owned closures can survive. Follow the existing rule in `PlayerActionContext`: resolve `ctx.bundle.<owner>` at call time.

Do not capture the original `placedFires` or residue owner in long-lived action callbacks.

For ordinary same-world rebuild, feed the current residue snapshot into the replacement bundle exactly once, analogous to other player-positioned sparse world objects. For New Game, reset it.

## Tests worth adding

Prefer pure/owner tests before UI tests:

1. `PlacedFires.remove` exact-once cleanup/no-op.
2. sticky `hasBurned` behavior.
3. migration for old simple vs pit.
4. fire-removal preview: simple/pit/grate/pile/missing.
5. commit exact-once salvage/residue.
6. residue expiry at boundary and after large time jump.
7. inspection target/ref/read-model for placed vs settlement fire.
8. `interactionView`: held `soil_digging` overrides alternate slot only for supported player fire.
9. dispatch test proving non-digging-tool campfire `[R]` still reaches cooking path.

## Implementation order

1. Extend `PlacedFire` persistence with `hasBurned` and add migration/tests.
2. Expose one public removal lifecycle in `PlacedFires`; route current despawn through it.
3. Add placed-fire identity to `Interactable` / `buildInteractables`.
4. Implement the shared fire-removal preview+commit action.
5. Add residue owner + persistence + lightweight overlay.
6. Wire Inspection to the shared action.
7. Wire `soil_digging` alternate-slot presentation and existing game-loop `[R]` dispatch.
8. Add focused tests and update current-state docs only where implementation makes them stale.

## Guardrails

- No generic dismantling framework.
- No settlement-fire removal.
- No `pile` removal.
- No grate salvage/removal in this plan.
- No hardcoded shovel identity.
- No terrain `scorch` for ash.
- No mesh/material per ash mark.
- No duplicate commit path between Inspection and shortcut.
- No stale runtime object capture across WorldBundle rebuild.
- No browser verification by AI.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

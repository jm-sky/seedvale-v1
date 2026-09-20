# Plan: Player cave position save/load continuity

**Created:** 2026-09-20
**Status:** `planned` 📋
**Type:** bug
**Priority:** high · **Effort:** S
**Model:** Sonnet, Composer
**Depends on:** ~~world-027~~
**Domain:** `persistence`
**Subdomains:** `save-data` `migration`
**Tags:** `player` `caves` `spatial-context`
**Roadmap:** -

## Problem

The player can occupy a closed Cave V2 floor at the same X/Z as surface terrain, and the existing ground resolver intentionally uses Y to distinguish those spaces.

Current `SavePlayer` stores X/Z but not Y. Restore calls `PlayerController.setPosition(x, z)`, which snaps using whatever Y the newly-created player currently has.

A save made underground therefore does not carry enough authoritative position data to select the same cave floor after reload.

Persisting `WorldSpatialContext` itself would duplicate derived world state. Current XYZ + cave heightfield semantics are already the correct authority.

## Goal

Preserve the player's physical cave/surface position across save/load by round-tripping the vertical coordinate needed by the existing Y-aware ground resolver.

## Implementation

### 1. Extend SavePlayer minimally

Add an optional persisted player Y (or equivalently named vertical ground-query seed) to the current save schema.

For new saves:

```text
player.mesh.position
→ x/y/z
→ SavePlayer
```

Do not persist a parallel `caveId`/inside-cave boolean.

### 2. Migration / old saves

Bump `CURRENT_SAVE_VERSION` only if required by the repository's schema rules and add the normal migration step.

Older saves without Y must keep the existing legacy surface-compatible restore behavior. Do not guess a cave from X/Z alone.

### 3. Restore ordering

Restore after the current world/cave spatial authority needed by `PlayerController.groundAt()` is available.

Use the saved Y as `setPosition(..., { groundQuerySeedY })` or the smallest equivalent existing seam, then let ordinary `snapToGround()` revalidate against the current deterministic cave heightfield.

Do not directly assign a saved cave floor as final trusted Y without revalidation.

### 4. Mounted player

Preserve the existing mount-restore ownership. If a valid mounted animal immediately becomes the player transform authority, avoid introducing a competing player-Y owner.

## Relevant files / symbols

- `src/persistence/saveData.ts::SavePlayer`
- `CURRENT_SAVE_VERSION` and migrations
- `src/app/saveState.ts::buildSaveData`
- `src/app/createApp.ts` initial player restore
- `src/player/PlayerController.ts::setPosition`
- `PlayerController.groundAt`
- `src/world/createCaves.ts::queryGround` / `spatialContextAt`

## Tests

1. save/restore on ordinary surface preserves current behavior;
2. closed cave floor with same X/Z as hillside restores to the cave floor;
3. old save without Y keeps legacy surface-compatible behavior;
4. invalid/stale vertical seed is revalidated by current cave/surface ground;
5. open-sky mouth follows current `spatialContextAt` semantics;
6. mounted restore does not create two competing transforms.

## Guardrails

- no persisted `WorldSpatialContext`;
- no cave-specific save slot/store;
- no cave-id guessing from X/Z;
- no presentation dependency;
- no browser verification by the implementation agent.

Do not run `pnpm docs:sync`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

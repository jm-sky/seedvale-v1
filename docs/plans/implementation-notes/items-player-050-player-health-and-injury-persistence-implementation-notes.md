# Implementation notes: items-player-050 Player health and injury persistence

**Plan:** `items-player-050-player-health-and-injury-persistence.md`

## Current codebase

- `PlayerController` remains the sole runtime owner: `health: HealthState` plus `injuryRecovery: InjuryRecoveryState`.
- `InjuryRecoveryState` is not only `physicalInjury`; it also carries optional `injuryRecoveryUpdatedAtDays`, used by `resolveInjuryRecovery()` for lazy elapsed-game-time recovery.
- `createSaveState().buildSaveData()` is the only save assembly point and already receives the live `player`.
- Restore currently happens immediately after `PlayerController.create()` in `createApp.ts`, before HUD/game-loop consumers are initialized. This is the correct integration point.
- Current schema baseline on reviewed `main`: `CURRENT_SAVE_VERSION = 52`, with exact chained migrations through `51 -> 52`. Re-check at implementation time.

## Persisted shape decision

Keep health consequences under `SavePlayer`; do not add a parallel top-level player-health record.

Persist:

```ts
health: {
  currentHp: number
  physicalInjury: number
  injuryRecoveryUpdatedAtDays?: number
}
```

The recovery anchor is required for continuity. Omitting it would restore the visible HP/injury amounts but cause `resolveInjuryRecovery()` to treat the loaded injury as legacy/unanchored and restart recovery timing at first use.

Do not persist `maxHp`, `dead`, derived injury severity, stamina, downed/combat execution state, or effective SPEA modifiers. `maxHp` is currently fixed by `PLAYER_MAX_HP`; `dead` must be reconstructed consistently from restored HP rather than trusted as another persisted authority.

## PlayerController restore seam

Prefer one small owner-local method, e.g. `restoreHealthConsequences(snapshot)`, rather than direct app mutations of both `health` and `injuryRecovery`.

It should:

- clamp `currentHp` to `[0, health.maxHp]`;
- set `health.dead = currentHp <= 0`;
- restore `physicalInjury` only within a valid finite range and preserve the invariant `0 <= physicalInjury <= maxHp - currentHp` for a living player;
- restore the optional recovery anchor unchanged after schema validation;
- mutate the existing shared `HealthState` object — never replace it, because `injuryRecovery.health` points to that same object.

Do not use generic healing/damage helpers for hydration: load is reconstruction, not gameplay and must not trigger treatment/recovery semantics.

A paired owner-local fresh-health reset helper is useful for downstream `items-player-056`, but do not broaden this plan into the full New Game reset orchestration owned by that plan.

## Save schema / migration

Because the new field is required for current-version saves, bump the then-current `CURRENT_SAVE_VERSION` and add exactly one next migration in `SAVE_MIGRATIONS`.

If baseline is still 52, this becomes `52 -> 53`.

Legacy migration must write an explicit healthy snapshot rather than leave the field absent:

- `currentHp`: current legacy full-health value. Since `maxHp` is not available inside migration data, use the stable current player base HP constant only if importing it here does not create a bad dependency; otherwise encode the legacy persisted semantic in a small persistence-local constant and test it against `PLAYER_MAX_HP`.
- `physicalInjury: 0`;
- no recovery anchor.

Current-schema validation must reject missing `player.health`, non-finite numbers, negative injury, negative HP, and malformed anchors. Do not silently normalize malformed current-version saves in `isSavePlayer()`; clamping belongs to the owner restore seam only for values that passed schema-level domain validation.

Important: existing validators often accept plain `number`; this field should explicitly use `Number.isFinite` because the plan requires malformed current-schema data to fail closed.

## Snapshot and restore wiring

In `src/app/saveState.ts`, serialize all three health-consequence fields from the same live owner read:

- `player.health.currentHp`;
- `player.injuryRecovery.physicalInjury`;
- optional `player.injuryRecovery.injuryRecoveryUpdatedAtDays`.

In `src/app/createApp.ts`, apply the owner-local restore immediately after `PlayerController.create()` and before `syncDerivedPhysicalCapabilities(...)`, HUD creation, treatment consumers, or the game loop.

Do not resolve lazy injury recovery during load. Restoring the saved anchor is enough; normal consumers can later call the existing `resolveInjuryRecovery()` against current `elapsedDays`, preserving offline/elapsed-world continuity according to the shared contract.

## New Game / lifecycle interaction

Current pause-menu New Game reuses the existing `PlayerController` and only calls `resetPlayerNeeds(player.needs)`; it does **not** currently reset health/injury. This is already tracked by dependent plan `items-player-056-player-new-game-runtime-state-reset.md`.

Therefore:

- do not claim current New Game already satisfies the plan;
- add only the minimal owner-level health reset seam if useful;
- let `items-player-056` own calling that seam as part of the complete fresh-player transaction;
- same-session ordinary `WorldBundle` rebuild must remain a no-op for health/injury because the player controller survives outside the bundle.

A test in 050 may cover the reset seam itself, but end-to-end pause-menu New Game behavior belongs to 056 unless 056 is implemented in the same change sequence.

## Tests worth adding/extending

Focus on the contracts most likely to regress:

- `SavePlayer` validator: required health snapshot in current schema; finite/range failures rejected.
- migration: pre-050 save becomes full HP + zero injury + no recovery anchor.
- save assembly: HP, injury and recovery anchor serialize together from the live player.
- owner restore: existing `HealthState` object identity is preserved and `dead` is derived from restored HP.
- round-trip: save -> load -> save preserves HP/injury/anchor.
- recovery continuity: after restore, `resolveInjuryRecovery()` uses the saved anchor rather than starting a new one.
- stamina remains absent from the new persisted shape.

Reuse `src/shared/injuryRecovery.test.ts` only for shared recovery math; persistence-specific tests should stay near existing `saveData` / save-state tests rather than expanding shared-domain tests.

## Pitfalls

- Do not derive `physicalInjury` from missing HP; deprivation damage deliberately allows missing HP without physical injury.
- Do not replace `player.health` during restore; `injuryRecovery.health` shares its object identity.
- Do not call `resolveInjuryRecovery()` as part of hydration.
- Do not make the new current-version field optional just to avoid a migration; the repository's fail-closed migration pipeline already exists for this case.
- Do not fold `items-player-056`'s broader New Game reset into this implementation.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Plan: Player health and injury persistence

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** medium · **Effort:** S  
**Depends on:** ~~items-player-045~~  
**Domain:** `items-player`  
**Type:** `bug`  
**Roadmap:** -

## Problem

Player HP and physical injury are meaningful survival/combat state, but current persistence omits both.

Current load constructs a fresh PlayerController with full HealthState and physicalInjury = 0. Continue/Load therefore heals the player and clears injury while NPC/livestock health consequences round-trip.

This is a persistence continuity defect, not a request to persist transient combat execution or stamina.

## Goal

Make save/load reconstruct the player's current health consequences without introducing a second health owner.

Persist HP and physical injury together so load cannot restore one side of the health/injury relationship while resetting the other.

## Current ownership

Keep the existing owners:
- src/player/PlayerController.ts::health — authoritative player HealthState;
- the existing player physical-injury state used by medicine/recovery;
- SaveData remains serialization only.

Do not introduce a second PlayerHealth manager or app-level mutable copy.

## Implementation

### 1. Save schema

Update src/persistence/saveData.ts.

Add a compact player health consequence snapshot under SavePlayer containing the durable values required to reconstruct current state, semantically:

    health: {
      currentHp: number
      physicalInjury: number
    }

Do not persist combat intent/attack phase, hit reactions, stamina or UI state.

Treat max HP as runtime capability unless current code at implementation time makes max HP itself mutable and continuity-relevant. Clamp restored currentHp against current runtime bounds rather than duplicating a derived max.

### 2. Versioning / migration

The reviewed baseline is save version 49, but implementation must use the then-current schema version.

Older saves have no historical HP/injury data, so migrate them explicitly to the legacy load behavior:
- full current HP;
- zero physical injury.

After the version bump, a missing health field in a current-version snapshot must not silently mean healthy.

Validate finite numeric ranges and reject malformed current-schema snapshots instead of normalizing arbitrary values.

### 3. Snapshot

Update src/app/saveState.ts::buildSaveData() to read the live player owner. HP and physical injury must be captured in the same snapshot operation.

### 4. Restore ordering

Update src/app/createApp.ts and, if needed, add the smallest owner-local PlayerController restore seam.

Required ordering:

    construct PlayerController
    → apply migrated/validated HP + physical injury
    → initialize/use gameplay consumers and HUD
    → resume simulation

Do not rely on a later UI tick to repair gameplay state.

### 5. New Game / rebuild semantics

- New Game remains full HP + zero injury.
- Same-session WorldBundle rebuild must not touch player health because PlayerController is not WorldBundle-owned.
- Load Save replaces current player health/injury with the loaded slot exactly once.

### 6. Tests

Add focused automated coverage:
1. damaged player → save → load restores the same HP;
2. injured player restores the same physical injury;
3. HP + injury serialize together;
4. older save migrates to full HP + zero injury;
5. malformed current-version values fail validation;
6. save → load → next save is stable;
7. New Game remains healthy;
8. stamina remains intentionally transient.

## Guardrails

- Do not persist combat execution state.
- Do not persist player stamina.
- Do not create a second health/injury authority.
- Do not add unrelated medicine/combat balancing.
- Do not broaden into NPC/livestock persistence.
- Do not run browser verification; User owns browser verification.

## Verification

Automated/static verification only: targeted saveData migration/validation tests, targeted app/player persistence tests where existing seams support them, and repository-required type/build checks.

Manual browser verification should later confirm: take damage + injury, save, Continue/Load, and verify HP/injury are unchanged.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

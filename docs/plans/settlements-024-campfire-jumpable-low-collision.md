# Plan: Jumpable low campfire collision

**Created:** 2026-10-30
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** M
**Depends on:** -
**Domain:** `settlements`
**Subdomains:** `buildings`
**Tags:** `collision` `campfire`

## Problem

Village firepit collision uses a horizontal `circle` without a vertical extent, effectively blocking player movement at every jump height. The player should be stopped by the solid firepit when walking and be able to jump over it. Cover player-built fires only where they actually register physical colliders; do not silently add obstacles to kinds without existing collision.

## Scope

- Trace authoritative village and placed-fire collider registration and disposal; check `src/settlement/settlementPropColliders.ts`, `PlacedFires.ts`, `propSpecs.ts`, and callers.
- Represent the solid firepit body (not flames) with appropriately low vertical bounds, using existing `Collider.minY/maxY` and `colliderActiveAtY`. Bounds must be in **world Y**, grounded against placement height/terrain, not merely a fixed absolute `maxY`.
- Verify player jump motion and collider query's height sampling: crossing must work only when the player physically clears the solid base. If checking just feet Y is insufficient for the intended jump clearance, investigate the minimal compatible change without altering unrelated cave or obstacle behavior.
- Confirm non-jumping movement stays blocked, player fire interactions remain reachable, and NPC/fauna collision/navigation behavior is consistent. Preserve deterministic simulation and existing ownership/lifecycle.

## Non-goals

No general physics engine, jump redesign, fire damage mechanic, wholesale NPC pathfinding changes or collision refactor.

## Verification

- Unit tests for firepit collider world-height and `colliderActiveAtY` below/above its bounds; include nonzero ground height and relevant fire variants.
- Focused movement/regression tests where possible: walking blocked; jump clears; ordinary obstacles and cave Y limits unchanged.
- Manual browser verification for settlement firepits and applicable player-built fires, including interaction and NPC/fauna behavior. Static inspection/tests do not count as manual PASS.
- Important public helpers should carry JSDoc and `@domain settlements` where appropriate.

## Revival scheduling

The Strategic Brief's D4 performance-first integration freeze remains in force. Planning and non-runtime tests are allowed; runtime integration requires D4 exit or a documented, authorized exception. This plan does not grant that exception.

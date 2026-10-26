# 025 — NPC react when player takes village farm tools

**Status:** `todo`  
**Related:** [plan 082](../plans/archive/2026-08-12--082--village-tool-props-and-temp-assets.md), [`MODELS.md`](../assets/MODELS.md) M08/M09  
**Current owner (2026-10-26):** concrete overlapping plan [`items-player-052`](../plans/items-player-052-settlement-tool-ownership-and-social-acquisition.md) — do not implement a second mechanism from this issue alone. Historical diagnosis below remains the original symptom report.

## Problem / desired behaviour

Home-village **pitchfork** / **sickle** spawn as one-time pickups near gardens
(plan 082). Taking them today is silent — they behave like any world item.

When the player **picks up** a village-owned farm tool (spawner id from the
settlement item pool), nearby NPCs should protest, e.g. bark/dialog
*„Hej! Co robisz!?”*, optionally with a small relation penalty.

## Out of scope for now

- Implementing the reaction here (prefer `items-player-052`).
- Held-hand visuals + melee for pitchfork/sickle (see
  [items CATALOG](../items/CATALOG.md) roadmap — same pattern as knife).

## Notes

- Spawner kinds: `pitchfork`, `sickle` in `createItemSpawners.ts`.
- Hook candidate: collect path in `gameLoop` / `interactables` when collecting
  from `itemSpawners` with those kinds (not player-dropped copies).

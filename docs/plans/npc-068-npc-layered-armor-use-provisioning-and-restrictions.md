# Plan: NPC layered armor use, restrictions continuity and guard provisioning

**Created:** 2026-11-04
**Status:** `planned` 📋 (N1–N2 after the first layered release; Q-IC3 approved 2026-11-04 for N3)
**Type:** feature
**Priority:** medium · **Effort:** M
**Depends on:** items-player-065, items-player-066
**Domain:** `npc`
**Subdomains:** `combat`
**Tags:** `v1-revival` `combat` `armor` `npc` `performance` `side-initiative`
**Model:** Opus, Sonnet
**Roadmap:** -

Executor: GPT-6 Sol. Coordination: [side-initiative index](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md). Design authority: [Combat & Armor proposal §7, §10.3–§10.4](../research/v1-revival/2026-11-04--combat-armor-redesign-proposal.md#7-npc-equipment-and-world-continuity).

## Slices

### N1 — Derived kit cache (performance-relevant)

Per-agent runtime snapshot keyed by Inventory identity + `armorMutationRevision` (from 065 S2): worn IDs, effective pieces, 7×3 protection, restrictions. Recompute only on revision change; validate cached worn IDs (≤ 14) against ownership at hit/command boundaries. Cache dies with the agent; offscreen authoritative calls derive on demand. Target: 500 loaded NPCs with unchanged inventories → zero armor inventory rescans after warm-up (counter test). Matched WSL frame-time/allocation check on `settlement-heavy` before/after; no FPS claim.

### N2 — Restrictions everywhere the NPC moves or fights

Same derived kit drives melee cost/recovery, ranged draw cost, movement (`NpcAgent.steerTo`), flee/run sprint drain. Offscreen: `estimateOffscreenTravelDays(…, movementMultiplier = 1)` → duration / multiplier, passed through `beginOffscreenNpcTravel` and **both** handoff families (generic NPC travel and the legacy transport handoff in `SettlementsManager`). Captured ETA is not rescaled; a gear change mid-travel checkpoints and recomputes remaining travel once. No new walking drain, no per-frame rescheduling.

### N3 — Guard kits at genuine first creation (gate Q-IC3)

Proposal §7.2 table by settlement size, independent salted draws, guard quality pools, IDs `npc-start-armor-v1:<npcId>:<position>` via `createArmorInstance(kind, quality, id)`. Grant only at first authoritative creation before clearing the existing latch; capacity truncation order per proposal; no retroactive kits for restored NPCs; no civilian auto-armor; existing weapon salts unchanged. Settlement size / seed context passed in by the creation owner — no global lookup from `npcLoadout`.

## Non-goals

Shopping AI, merchant stock as clothing, NPC armor visuals (S8/D11), human-target combat, persisted NPC equipment state.

## Verification

npcLoadout / npcTradeAvailability / npcPostDeath / npcTravel / transport tests; creation-order-independent kits; no grants after restore/stream-in/rebuild; corpse loot keeps exact IDs once; gift → next hit uses the piece; removal → next hit without it; offscreen factor applied once (detailed and offscreen). Manual (proposal §11.2 items 3–5, 8) on seed `415424794`.

Add JSDoc (`@domain npc`, `@system combat`) to the cache and kit helpers.

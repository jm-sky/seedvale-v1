# Plan: Combat correctness prelude — projectile order, ready-weapon defense, attacker identity, exact-instance NPC weapons

**Created:** 2026-11-04
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** M
**Depends on:** -
**Domain:** `npc`
**Subdomains:** `combat`
**Tags:** `v1-revival` `combat` `determinism` `side-initiative`
**Model:** Sonnet, Opus
**Roadmap:** -

Executor: GPT-6 Sol. Coordination: [side-initiative index](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md). Extracted from the [Combat & Armor proposal](../research/v1-revival/2026-11-04--combat-armor-redesign-proposal.md) by [review 032 F7](../reviews/2026-11-04--032--items-stage-4-and-combat-armor-architecture-review.md): these are bugs/plumbing under **today's** rules and need no author decision. **No save change** in this plan.

## Slices

### P1 — Projectile earliest-intersection hit (proposal §6.5)

`sweptProjectileHit()` (`src/combat/projectile.ts:72`) picks the candidate with minimum perpendicular distance, ties by input order. Replace with: earliest segment–circle intersection parameter `t ∈ [0,1]` (start-inside = 0; zero-length segment = containment test; dead candidates excluded), tie → lexical stable ID. Keep `PROJECTILE_HIT_RADIUS` (0.6) and cave/surface filters. Test: nearer-intersecting target beats farther centred target; reordered candidates give the same result; start-inside; zero-length.

### P2 — NPC defense from the ready weapon (proposal §6.4)

`resolveNpcDefenseConfig(carried)` (`src/ai/npcCombat.ts:290`) returns the first block-capable kind merely **held** in the inventory. Bind defense to the validated selected melee weapon in melee mode; during ranged draw/recovery/reload use the ranged weapon's defense (none today); after an accepted close-range switch, the ready melee weapon; outside combat, normal melee selection (surprise contact). Player stays on the actual held instance. No new guard meter, stamina charge or stagger.

### P3 — Stable attacker identity for fauna → human hits (proposal §4.4)

Both fauna → human paths pass `attackerKey: 'fauna'` (`src/app/gameLoop.ts:2997`, `:3031`); the player callback lacks the animal ID. Forward the actual animal ID and species through `AnimalAgent`/`createFauna` and every settlement-owned fauna forwarding callback, so `attackerKey` = stable animal ID and species is available for 065's profile mapping. Do not change threat/aggression behaviour. Defense roll inputs change only by the key value (document that block outcomes for identical encounters may differ from before — expected).

### P4 — Exact-instance NPC melee weapon condition (proposal §6.2)

`NpcMeleeWeapon = { kind, melee }` (`npcCombat.ts:43`) uses catalog damage. Add `instanceId: string | null`; for maintenance-backed kinds evaluate owned instances with condition-adjusted damage (existing sharpness curve), ties by kind then ID; apply `applySharpnessWear` once per actual hit on that instance. Revalidate at attack start, snapshot config + identity; if the instance is gone at impact, cancel the hit (same rule for the player's held instance). Count-backed tools keep `null`.

## Non-goals

Typed damage, hit locations, armor changes, durable hit ordinal (065 S2), human targets, new controls, shields (A7), NPC kits.

## Verification

Focused Vitest: `projectile` tests, `npcCombat.test.ts`, `NpcAgent` combat-mode tests, fauna callback tests, weapon maintenance tests. Attack-lifecycle test at 30/60/120 Hz: one hit per attack edge, one wear application. Manual (queue §2): seed `415424794`, a crossbow guard near a wolf — during reload it does not block with a bag sword; switches to melee at close range.

Rollback: each slice independent; no persisted data.

Add JSDoc (`@domain npc`, `@system combat`) to changed exported resolvers.

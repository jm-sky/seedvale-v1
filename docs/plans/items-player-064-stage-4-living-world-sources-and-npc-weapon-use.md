# Plan: Stage 4 living-world sources and NPC weapon use

**Created:** 2026-11-04
**Status:** `in progress` 🚧 (O1/O2/O3 implemented and technically verified 2026-11-07; O4, N1, U open)
**Type:** feature
**Priority:** medium · **Effort:** L
**Depends on:** items-player-062, items-player-063
**Domain:** `items-player`
**Subdomains:** `items` `inventory`
**Tags:** `v1-revival` `equipment` `stage-4` `economy` `merchant` `npc` `side-initiative`
**Model:** Opus, Sonnet
**Roadmap:** -

Executor: GPT-6 Sol. Coordination: [side-initiative index](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md). Design authority: [A10](../research/v1-revival/2026-10-28--equipment-stage-4-approved-author-decisions.md) and [Stage 4 proposal P7b](../research/v1-revival/2026-10-27--equipment-stage-4-implementation-proposal.md#p7--global-issuance-then-living-world-sources-and-npc-distribution). Dependency on 063 applies to slice **U** only.

## Goal

Make profiled Stage 4 items obtainable through **existing** finite V1 sources — Trader stock specializations, household profession starter stock, artisan orders where real recipes exist, authored rewards/discoveries — and let NPCs use suitable **owned** new weapons and compatible ammo. Living-world fit: profession, settlement size/terrain/resources, wealth/budget, scarcity.

Armor sources are **not** here: ordinary armor acquisition is owned by items-player-066; NPC armor provisioning by npc-068. Upper-tier **armor** identities still issue through slice U of this plan once 066 registers them.

## Slices

| Slice | Content | Gate |
| --- | --- | --- |
| **O1** | Ordinary weapons (`weapons-tools` Trader, Blacksmith household): exact kinds, finite quantity, regional/premium eligibility, price; no reseed of sold-out stock | per-kind 062 profile done |
| **O2** | Ammunition: `sling_stone` (Hunter household / general Trader), `bolt_heavy`/`bolt_blunt` (weapons-tools Trader / Blacksmith) | 062 W3b/W3c |
| **O3** | Masterwork-tier donor weapons: scarce (premium/regional), multiple specimens allowed | 062 batch done |
| **O4** | Shields as goods: ordinary trade only; `iron_rimmed_shield` keyed quest-reward source only if an existing quest owner can host it — otherwise leave unsourced and record | 062 W4 |
| **N1** | NPC weapon use: profession preference for new families, ammo compatibility, verification that NPCs use owned new gear (no kit grants beyond existing first-creation loadout rules) | 062 + npc-067 |
| **U** | Upper-tier sources (14 identities): limited specialist offers and authored rewards/discoveries through the 063 claim command only; pickups carry durable instance payloads | 063 + Opus review R-A; A8 reappearance policy asked first (index §6) |

## Rules

- Extend owners, never parallel ones: `merchantTrade.ts` finite stock + init latch, `householdProfessionStock.ts` first-construction grants, existing authored pickup/quest/container routes, existing artisan production only where actual inputs/recipes support the item (a stock grant is not production).
- No blanket catalog/loot injection; no global shopping AI; no invented wealth index — use existing purse/budget/settlement context and record any missing signal as a local task.
- Per slice record: `kind | source owner | eligibility | quantity | price | restock/initialization | NPC fit`. Same seed + source → same result.
- Upper-tier: one claim across all alternative sources; a merchant listing backed by real stock has already claimed its specimen; unmaterialized promises are not specimens.

## Verification

Seeded merchant/household tests (deterministic, finite, no reseed on reconstruction/reload), trade conservation (money/stock/IDs), capacity-failure atomicity, NPC selection tests with owned new weapons/ammo (`npcCombat.test.ts`, loadout tests), slice U: every enabled issuer exercised through the 063 test matrix. Manual: browse a weapons-tools Trader and a Blacksmith household on seed `415424794`, buy one new weapon + ammo, save/reload.

Add JSDoc (`@domain items-player`) to new source-eligibility helpers.

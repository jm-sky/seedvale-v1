# Plan: Upper-tier singleton issuance ledger (A8)

**Created:** 2026-11-04
**Status:** `in progress` 🔄 (ledger, persistence and bypass guards implemented 2026-11-04; Opus R-A remains required before 064 enables any upper-tier source)
**Type:** infrastructure
**Priority:** medium · **Effort:** M
**Depends on:** -
**Domain:** `items-player`
**Subdomains:** `items` `inventory`
**Tags:** `v1-revival` `equipment` `stage-4` `persistence` `uniqueness` `side-initiative`
**Model:** Opus, Sonnet
**Roadmap:** -

Executor: GPT-6 Sol. Coordination: [side-initiative index](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md). Design authority: [Stage 4 proposal §Global identity and issuance design](../research/v1-revival/2026-10-27--equipment-stage-4-implementation-proposal.md#global-identity-and-issuance-design) (P7a) — read it completely; this plan binds it to code and fixes scope.

## Goal

Guarantee A8: each of the 14 Unique/Exceptional and Legendary identities has **at most one live instance per world**, across player, NPC, merchant, household, containers, cargo, corpses, drops/pickups, save/load and rebuild. Provide one issuance command that every future upper-tier source must use. **No source is enabled by this plan** (items-player-064 slice U does that after Opus review R-A).

## Scope

1. **Restricted-identity list** — the 14 kinds from the [integration matrix](../research/v1-revival/2026-10-27--equipment-stage-4-integration-matrix.md) "U" rows, as one exported constant. Kinds not yet registered (armor rows owned by 066) are listed by ID and become active when registered; the ledger must not require registration order.
2. **World issuance ledger** — sparse `{ kind → { instanceId, issuanceKey, status: 'live' | 'destroyed' } }`, one per world, owned by the existing app/world persistence composition (retained across `WorldBundle` rebuild, captured/restored with the save, reset only by a new world). No item payload, quality or owner in the ledger.
3. **Issuance command** — `claim(kind, issuanceKey, destination)`: preflight ledger + destination capacity + source eligibility → create instance (existing instance factory) → commit receipt + ledger + caller's source marker atomically; on any failure restore all participants. Reentrant or repeated claims for an issued kind fail (or return the existing reference without adding).
4. **Bypass guards** — generic acquisition paths (`createAcquiredInstance`, catalog buy/grant, merchant stock seeding, household starter grants, authored pickups, debug/test grants) refuse restricted kinds unless called through the command. Enforced by a test that enumerates every acquisition entry point.
5. **Load integrity** — after migration, before world use: cross-domain scan of persisted owners (player/NPC personal inventories, household items, merchant stock, containers incl. carried, cargo, corpse loot, drops/pickups) for restricted kinds; reject the save with diagnostics on duplicate instance IDs, two instances of one restricted kind, or a ledger entry contradicting owners. Missing owner ≠ destruction. Runs once per load, not per frame.
6. **Save** — new field + migration (token rule, index §4.3). Migration from a ledger-less save: scan owners; if no restricted instances exist start empty; if some exist (only possible via debug), register them, rejecting duplicates.
7. **Destruction** — no automatic release. A claim becomes `destroyed` only via an explicit existing lifecycle event proven to destroy the specimen; until the A8 reappearance policy is decided, `destroyed` is a permanent tombstone (no reissue).

Non-goals: enabling any source, pricing, quest content, a central owner graph, renderer identity, per-frame scans, Masterwork uniqueness, cross-save transfers.

## Verification

The P7a test list from the Stage 4 proposal, scoped to what exists now: two issuers for one kind; repeated/reentrant claim; destination-full and payment-failure rollback; exact-ID transfer player↔NPC↔household↔container↔drop keeps one claim; equipment/held references are not extra specimens; NPC death → corpse loot keeps the ID; save before/after issuance; rebuild/unload in different orders; duplicate-ID-across-owners and two-IDs-one-kind load rejection preserving the previous save; ledger-less migration; new world resets. Use fixture issuers in tests; the bypass-guard test covers every real acquisition entry point.

Manual: none required (no player-visible change). Opus review R-A before 064 U.

Add JSDoc (`@domain items-player`, `@system equipment`) on the ledger type, the claim command and the load-integrity check.

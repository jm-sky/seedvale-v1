# Plan: Layered armor catalogue, ordinary acquisition and balance

**Created:** 2026-11-04
**Status:** `planned` 📋 (Q-IC1/Q-IC2 approved 2026-11-04; depends on 065 S3)
**Type:** feature
**Priority:** high · **Effort:** L
**Depends on:** items-player-065
**Domain:** `items-player`
**Subdomains:** `items` `inventory`
**Tags:** `v1-revival` `armor` `equipment` `stage-4` `economy` `balance` `side-initiative`
**Model:** Opus, Sonnet
**Roadmap:** -

Executor: GPT-6 Sol. Coordination: [side-initiative index](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md). Design authority: [Combat & Armor proposal](../research/v1-revival/2026-11-04--combat-armor-redesign-proposal.md) §5 (values), §8 (acquisition), §11.2. Per-item identity/tier/source class for donor armor: [integration matrix](../research/v1-revival/2026-10-27--equipment-stage-4-integration-matrix.md). This plan **owns all armor admission** formerly split across Stage 4 P4/P5/P6-padding ([review 032 F2](../reviews/2026-11-04--032--items-stage-4-and-combat-armor-architecture-review.md)).

## Slices

### A — First batch (Wave 2 on main, ships in the first player release)

- Re-author the six existing kinds + `leather_bracers`/`steel_bracers` (from 044) with `layer` + typed `resist` + restrictions exactly per proposal §5.1 tables; keep IDs, masses, prices.
- Register seven new ordinary kinds: `padded_cap`, `padded_jacket`, `padded_hose` (`under`), `iron_helm`, `leather_gloves`, `leather_trousers`, `leather_boots` (`outer`) — instance-backed `ArmorKind`s, proposal §5.1 rows. Donor records stay immutable; these are V1-authored rows that share the donor ID.
- Sources (proposal §8.1): padding → general Trader + textile-worker household starter goods; leather pieces → Hunter specialist stock + general Trader (gloves/trousers MD+); `iron_helm`/`steel_bracers` → Blacksmith household + orders. Recipes (§8.2): `steel_bracers` 1 iron/1 coal d35/min28, `iron_helm` 2/1 d45/min38, specialization `armor`. Leather/padding are finite stock only — no claim of domestic manufacture.
- Tests: proposal §5.2 reference full-mail-kit restriction products and expected protection values (50.18 / 31.605 / 26.9875 % reference; 42.3925 / 24.415 / 23.9425 % low-bite) computed **from the catalog**; every admitted kind has a tested normal source.

### B — Brigandine, then remaining donor armor batches (after first release)

- `brigandine` (A9): body/outer, proposal row; recipe 5 iron/2 coal + 2 `linen_material` (needs `itemInputs` — `blacksmithRecipe()` today builds iron/coal only; extend the helper or build the def directly), d75/min68, exclusive; LG/XL armor-biased stock max one starter piece (stable 25 %).
- Remaining ordinary/Masterwork donor armor (matrix "New outer armor targets" minus first batch) in family batches of ~4–6: author typed rows within the envelope set by batch A (same slot/material class → comparable resist; tier rule A8 overall, not per stat). Donor `iron_vambraces`/`plate_vambraces` stay distinct from `steel_bracers`.
- Upper-tier armor identities (e.g. `kingsbane_hauberk`, `marshal_cuirass`, `saltmere_wardens_coat`, `northpass_riders_helm`, `thornwatch_pauldrons`, `blackpine_vambraces`, `fallowmere_gauntlets`, `ridgeguard_greaves`): profiles may be registered here; **no source** — issuance only through items-player-064 slice U / 063.
- Multi-region garments are out of scope; each piece covers its one slot.

### C — Balance closure (author playtest)

Proposal §5.3 comparison matrix (naked, leather-only, mail-only, padding-only, full leather, full mail, brigandine × qualities × channels × profiles) as a generated research note; controlled encounters on seed `415424794` (§11.2 items 2–3). Number changes go through playtest feedback; formulas/coverage do not change. Author sign-off recorded in the index.

## Non-goals

Shields (A7), durability/repair, new crafting UI, civilian auto-armor, NPC kits (npc-068), donor stat conversion, global singleton enforcement for Masterwork.

## Verification

Catalog/instance/quality tests for every kind; trade/merchant/household/artisan tests (finite, deterministic, no reseed, capacity-failure atomic, output picked up once after reload); save round-trip for each new kind across player, NPC, household, merchant, drops, containers, artisan output. Manual: proposal §11.2 item 1 (buy/order/pickup, under+outer equip, compare/remove, save/reload) in the release check.

Add JSDoc (`@domain items-player`) to any new source-eligibility or recipe helper.

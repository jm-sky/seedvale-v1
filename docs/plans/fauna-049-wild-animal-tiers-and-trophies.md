# Plan: Wild animal difficulty tiers, trophies and social recognition

**Created:** 2026-10-31
**Status:** `planned` 📋
**Type:** feature
**Priority:** medium · **Effort:** XL
**Depends on:** -
**Domain:** `fauna`
**Subdomains:** `lifecycle` `population`
**Tags:** `gameplay` `combat` `economy` `persistence`
**Roadmap:** `quests-and-reputation.md`

## Goal

Give wild animals four escalating gameplay danger tiers and collectible species-specific hunting trophies. Trophies are valuable tradable goods, personal NPC gifts, and proof of hunting achievements presented to local Hunters for stronger settlement reputation and regional renown.

Preserve V1's autonomous fauna, authoritative item inventories, player↔NPC relations, settlement-scoped reputation and lazy social-news propagation. Implementation may be staged, with each stage independently verified.

## Agreed rules (author, 2026-10-31)

1. Four wild-animal difficulty tiers: `normal`, `alpha`, `dangerous`, `elite` (super-dangerous boss). Difficulty affects combat significance and distinctive presentation; precise stats, behavior and frequency require balance work.
2. Three trophy grades per species: ordinary (`normal`), special (`alpha` **and** `dangerous` share the same trophy kind), legendary (`elite` has its own unique trophy kind). One animal produces **at most one** trophy. If modifiers overlap, classify the trophy once at the highest effective tier, never duplicate rewards.
3. Every **wild** animal species should have a trophy definition; domestic/livestock animals do not gain hunting accolades under this feature.
4. Trophies are obtained through the existing knife-harvest/butchering action, not automatically on death. Drop probability is high and increases with the player's `Survival` skill; **70–95% is a provisional tuning range**, not final balance. Resolve the roll deterministically by animal identity and trophy grade; do not reroll on a failed action, stream transition or save/load.
5. Trophies can be sold as normal physical inventory goods. Their trade price scales with grade and species.
6. Trophies can be given as gifts to **any** eligible NPC for personal player↔NPC relation. Gift effectiveness should account for recipient preferences/profession; repeated identical gifts have diminishing returns and cannot be used for unbounded farming. Exact rules require balance.
7. A local Hunter accepts the **first newly recognized trophy kind** as proof of a deed, consumes exactly one physical item, and grants a substantial settlement reputation and renown bonus, stronger than an ordinary animal kill. The resulting news originates from the **Hunter's settlement**, and propagates more effectively to nearby settlements than ordinary kill news.
8. Each settlement may independently recognize a trophy kind **only until** it has locally accepted that type or knowledge of that achievement has arrived from elsewhere. Another uninformed settlement may recognize the same type independently. Once known locally, further copies are **trade/gift goods only**; there is no repeat Hunter reputation hand-in.
9. Ordinary kill consequences and quest-owned social outcomes must remain compatible: prevent unintended double rewards for the same quest act, but don't erase the explicitly intended incremental proof-of-deed reward without an authored rule.

## Verified V1 entry points

- `src/fauna/animalVariants.ts`: actual `AnimalVariant = 'normal' | 'alpha'`; wolf den's first occupant is alpha. `dangerous` today is an **orthogonal quest-applied trait** via `AnimalAgent.markDangerous()`, not a third value of `AnimalVariant`. Variant and dangerous modifiers compose via **per-field max**, not multiplication; `dangerSignificance` exposes effective significance. `elite` is not yet implemented.
- `src/fauna/AnimalAgent.ts`: creature identity, variant, dangerous trait, death/harvest and presentation lifecycle. `src/fauna/animalDefs.ts` owns the species catalog.
- `src/fauna/animalTrophyLoot.ts`: one deterministic adult-stag `antler` roll, actor-neutral 75% baseline plus up to 15 points from Survival; `src/fauna/animalHarvest.ts::harvestAnimalIntoInventory` is shared by player and NPC Hunter and awards meat, hide and extra loot. The existing `antler` item and trading price must be migrated/retained coherently.
- `src/app/actions/survivalActions.ts::startHarvestMeat`: player skill input, knife and inventory checks, busy-action/cancellation path.
- `src/items/items.ts`, `itemCatalog.ts`, `tradeCatalog.ts` and `Inventory.ts`: item identity/catalog, stacking, valuation and transfer; `src/app/inventoryWiring.ts` contains NPC trade transactions.
- `src/quests/QuestManager.ts::adjustRelation`: authoritative player↔NPC relation changes; `src/reputation/ReputationManager.ts`: settlement-scoped five reputation dimensions and renown.
- `src/reputation/animalDeeds.ts`: dangerous-animal kill signal and distance factors; `src/reputation/SocialNewsLedger.ts`: persisted event queue and idempotent per-event settlement catch-up, carrier relay factor 0.75, TTL 7 days, queue cap 256; application/loaded-settlement catch-up is wired in `src/app/createApp.ts`.
- `docs/plans/fauna-032-exceptional-animal-appearance-morphs.md` (draft) separately owns optional cosmetic morphs; do not conflate appearance rarity with danger.

## Architecture and staged scope

### A. Difficulty taxonomy and wildlife

Introduce one canonical, fauna-owned **effective difficulty tier** resolver while preserving the independent quest `dangerous` trait and existing save/quest contracts. Resolve existing `alpha` + quest-`dangerous` to at least `dangerous`; `elite` takes precedence. Do not blindly replace `AnimalVariant` with four enum values if that would break authored quest binding, existing wolf-den assignment or persistent animal restoration.

Define bounded per-tier HP, damage, speed, aggression/significance and presentation parameters; exceptional animal appearance profiles remain separate from combat difficulty. Establish deterministic, controlled elite spawning/identity and persistence where needed: an elite boss must not reroll into an ordinary wild spawn or respawn infinitely through stream unload. Preserve ordinary fauna population/needs/predator behavior. Do not require new fauna simulation loops or separate boss managers. New unique names/special behaviors are eligible only as explicit, bounded tier content rather than an unscoped boss framework.

### B. Trophy acquisition and item economy

Use a declarative species × trophy-grade mapping; no one-off `wolf_alpha` logic scattered through action/UI code. Resolve effective grade from fauna state at harvest. Route through the shared `harvestAnimalIntoInventory` path, with exactly one deterministic trophy roll per corpse. Determine how trophy yields behave when the meat occupies the last inventory capacity; do not silently consume a successful trophy when it cannot fit without a deliberate recoverability rule. Preserve corpse single-harvest and NPC Hunter behavior; document whether NPC-obtained trophies are kept, sold or deposited (avoid uncontrolled minting).

### C. Gifts and Hunter hand-in

Expose a generic physical-item gift interaction to living NPCs through the existing dialogue/action layer. Atomically remove the gifted item, adjust personal relation via `QuestManager.adjustRelation`, and persist only the minimal anti-farming record needed for diminishing returns. This is broader than hunting trophies and should admit ordinary gifts such as `flower`.

Expose an additional Hunter-only recognition action. Revalidate recipient profession, item ownership/count, recognition eligibility and state at commit time; consume one item and issue exactly one social consequence/news event on success. An ineligible repeat remains available for ordinary sale/gift, not trophy recognition.

### D. Known deeds and news propagation

Reuse `ReputationManager` and `SocialNewsLedger`, not a new reputation manager or NPC-by-NPC gossip engine. Extend the news event payload with a stable **achievement identity** (at minimum species + trophy grade), provenance and stronger Hunter-origin propagation policy. Deduplicate at the **settlement + achievement type** level, across **different events** and after event TTL expiry. Existing per-event `processedSettlementIds` is insufficient. Persist durable knowledge independently of short-lived pending news; an event reaching a settlement must mark the deed known even if its numeric consequence rounds to zero **only if** the design explicitly treats it as learned. Maintain a clear distinction between recognized knowledge and numeric reputation awarded.

On hand-in, issue local reputation/renown and let news reach already-loaded settlements and future streamed settlements lazily; avoid settlement-grid generation or global runtime scanning. Define event ordering and propagation rules for the case where the same trophy is independently recognized in several settlements before news converges. News must not reverse prior valid recognition, and must not pay twice afterward.

### E. Save, migration and compatibility

Persist new rare-individual tier/identity where seed-only reconstruction is inadequate; persist settlement achievement knowledge and any gift-repeat guard. Integrate with existing save/version, restore, new-game reset and `WorldBundle` rebuild contracts; do not assume ordinary wild fauna already persist (they generally do not). Respect current Revival worldgen/save epoch policy; explicitly assess compatibility before changing deterministic generated IDs or spawning rules.

## Constraints and non-goals

- No replacement of fauna AI, quest engine, item inventory, social news or trade architecture.
- No full NPC witness-by-witness gossip simulation.
- No second independent item ownership or trophy registry; tracking *knowledge* is different from tracking physical trophies.
- No loot farming by re-harvesting one corpse, duplicate hand-ins, reload or stream cycling.
- No extra per-frame global settlement scan; use bounded, event-driven/lazy work.
- No appearance changes that break `fauna-032` separation of cosmetic rarity and combat grade.
- Keep player hunting awards distinct from NPC autonomous hunting (an NPC Hunter harvesting a corpse must not mint a player deed).

## Verification / acceptance

1. Species-by-grade trophy mapping covers all wild `AnimalKind` values; domestic exclusions and normal/alpha/dangerous/elite classification tests, including overlapping alpha + dangerous.
2. Survival-based deterministic drop probability is monotone; a corpse cannot be rolled/harvested twice across save/load, interruption or streamed lifecycle.
3. Trading consumes goods/pays via existing economy; gifting removes exactly one item and changes only recipient relation with anti-farm limits.
4. Hunter hand-in requires a valid trophy; first valid hand-in pays once and consumes one. Repeat gives no social reward; another uninformed settlement may independently pay.
5. Known-achievement propagation prevents further rewards after remote knowledge arrives, including after news TTL expiry and across loaded/unloaded settlement catch-up, save/load, new game and world rebuild.
6. Stronger trophy propagation and ordinary-kill propagation are independently testable, with no settlement materialization on kill/hand-in.
7. Quest `dangerous` binding/death outcomes, alpha wolf den, elite persistence and ordinary animal behavior remain correct.
8. Targeted tests for inventory capacity, concurrent/duplicate dialogue commits, quest reward overlap and stable event identity.
9. Manual browser validation of harvesting, item labels, inventory/trade/gift/hunter dialogue, tier presentation and social feedback; performance assessment for dense wildlife/settlements.
10. Add JSDoc with `@domain fauna` (or actual owning domain) to important public resolvers and authoritative state APIs to aid preflight discovery.

## Implementation handoff

Implement in independently testable stages A–D, with persistence integrated at each authoritative-state boundary rather than postponed to the end. Before coding, inspect current implementation and existing related plans; create focused implementation notes per `PLANNING.md`. Quantitative balance (tier stats/rarity, final drop curve, gift weights, reputation multipliers) may be tuned with tests and author feedback without altering the rules above.

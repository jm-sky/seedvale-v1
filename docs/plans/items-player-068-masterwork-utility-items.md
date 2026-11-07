# Plan: Masterwork utility items

**Created:** 2026-11-07
**Status:** `draft` 📝
**Type:** feature
**Priority:** medium · **Effort:** XL
**Depends on:** -
**Domain:** `items-player`
**Subdomains:** `items` `tools` `inventory` `player-needs`
**Tags:** `gameplay` `economy` `persistence` `ui`
**Roadmap:** -
**Model:** Opus, Sonnet

## Authority and goal

Author-approved scope (2026-11-07): **seven masterwork utility variants** of existing ordinary items: `shovel`, `axe`, `pickaxe`, `tent`, `blanket`, `wooden_torch`, `pan`. Their ordinary equivalents remain unchanged except where required to support shared identity handling. Utility items have **only ordinary and masterwork** quality; do not extend the armor poor/common/good/masterwork ladder to them. Their benefits must be tangible, grounded, nonmagical, and visible in gameplay. These items are **rare but regularly attainable** through deterministic merchant offers, loot and existing reward mechanisms. Planning approval is not implementation authorization; this document stays `draft` pending implementation scheduling.

## Gameplay contract / initial balance

- All seven masterwork items weigh **80%** of their ordinary variant, using the **same existing `ItemKind`** and a per-instance utility quality marker. Preserve item gabarite/size and capability gates.
- Masterwork shovel: physical soil digging/leveling work executes at **1.5× normal speed** (duration divided by 1.5). **No durability for either ordinary or masterwork shovel**; do not add a fake endurance statistic.
- Masterwork pickaxe: eligible digging, leveling and deposit mining at **1.5× normal speed**. **No durability for either ordinary or masterwork pickaxe**.
- Masterwork axe: tree chopping at **1.5× normal speed**; **2× effective lifetime** against relevant existing weapon-maintenance wear, without modifying ordinary axe durability, shared sharpness semantics or combat damage. Keep the weapon-maintenance instance as the authority; do not create an independent tool HP pool.
- Masterwork tent: **2× endurance against existing condition degradation** (half ordinary condition loss), 20% less carried mass, and a **modest incremental camp-rest quality bonus** using the existing camp quality calculation, clamped to the current quality cap. Tent quality and condition survive placement, packing, repair, drop and save/restore.
- Masterwork blanket: 20% less mass and a modest incremental rest-quality bonus; no invented durability pool. A masterwork blanket is a **specific owned instance** used by the rest calculation, not a kind-wide passive aura; ensure ordinary and masterwork blankets cannot be accidentally aggregated into an all-masterwork benefit.
- Masterwork portable `wooden_torch`: 20% less mass and **1.5× portable burn lifetime**. Keep baseline brightness/range unless later approved; burning state and quality must remain tied to the correct instance. Do not silently affect standing torches, branch torches or lighting budgets.
- Masterwork `pan`: 20% less mass and **1.5× cooking action speed when the pan is actually the active cooking-capacity benefit**. Preserve established one-item bare-fire / two-item pan / four-item grate capacity; grate supersedes pan. No invented pan durability.
- For these bonuses, `+50% speed` means `duration / 1.5`, not `duration * 0.5`. The tent/blanket comfort increment is deliberately not a numeric final balance commitment: tune and document a bounded, non-stacking result against `campRest`'s current 0..1 quality cap during implementation, without rendering survival progression or bedroll/fire irrelevant. Torch burn and pan speed are first-pass tunings for playtest.

## Ownership and architecture constraints

1. Extend existing `ItemInstance`, `Inventory`, `HeldTool`, trade and persistence pipelines rather than introducing parallel kinds, an alternate inventory, or a second generalized equipment-quality system. The existing armor `ArmorQuality` semantics remain untouched.
2. Explicit masterwork utility instances must survive: purchase/sale (finite stock, no minting on UI open), NPC and container inventories, transfer, dropped items, loot, quest rewards, save/load, and new-game/rebuild lifecycles. Legacy count-backed ordinary shovel/pickaxe/blanket/torch/pan remain legal; migrate/normalize only what is necessary and avoid mass converting ordinary items without a contract.
3. For mixed ownership, the chosen masterwork instance must be explicit and stable. `HeldTool` must select the actual shovel/pickaxe/axe; blanket selection and pan use must not accidentally apply masterwork bonuses from unrelated inventory or inactive equipment.
4. Resolve bonuses from one shared, pure utility-quality policy; per-action entry points consume the resulting multipliers. Do not put independent magic numbers into several actions or Vue components.
5. Preserve deterministic and offscreen-safe source selection. Never use render proximity or UI opening as the source of authoritative drops/trader stock. No global fixed quota; control rarity by bounded reproducible source probabilities and finite stock.
6. Honor existing armor quality, weapon maintenance, camp wear, cooking, portable torch, item value and ownership constraints. Keep save compatibility, including older save data with no utility quality marker.
7. Provide readable quality name, actual mass and effects in player/merchant/inspection UI. Differentiate individual mixed-quality items and allow selecting/selling/dropping the intended instance.
8. Add focused JSDoc for new architectural/public interfaces and pure quality resolvers, preferably with `@domain items-player`.

## Slices

### A — Foundation and persistence

- Define `UtilityQuality = 'common' | 'masterwork'` for the seven eligible kinds only; avoid treating the existing named `masterwork_sword` as part of this system.
- Design instance/stack boundary for mixed variants: ordinary count rows continue to function; a masterwork is always a stable instance and the same `kind` can coexist as count + instance (including legacy saves). Validate, clone, serialize, restore, drop and transfer with no quality loss; ensure actual mass calculations and capacity checks use the instance where applicable.
- Centralized immutable tuning/resolvers for effective mass, work durations, axe wear, camp quality, torch burn and pan cooking speed. Test quality normalization and no-op ordinary path.

### B — Tools

- Make held-tool selection instance-aware for shovel and pickaxe without demanding per-item durability.
- Apply duration policy to **all applicable** shovel/pickaxe terrain actions and the tree harvest action, including alternative action entry points; do not silently speed combat animations, unrelated strength work or NPC production.
- Axe combat/maintenance state retains existing sharpness and durability units; quality reduces wear, not increases maximum normalized durability.

### C — Camp, portable light and cooking

- Preserve tent quality through `placedTents`' authoritative world record and packing lifecycle. Resolve slower condition wear with existing lazy weather updates and repair, without resetting deterioration history or recomputing from visual-only objects.
- Apply a bounded tent/blanket rest-quality delta after reading the actual owned/placed sources; clamp and show in explanation. Preserve ordinary behavior and cap.
- Tie portable torch quality to actual burn state and consumption; verify old stack-based torch ownership and hand-lit behavior. No changes to standing torches.
- Use actual masterwork pan instance only when pan is the effective capacity driver; maintain grate precedence and ordinary batch counts.

### D — Economy, systemic loot and rewards

- Seed reproducible, finite, **rare but recurrent** masterwork utility instances into relevant merchant inventories (appropriate specialization/settlement band). Keep ordinary starter supplies and existing premium-merchant outcome untouched; avoid reroll/reissuance on reopen, visiting or streaming.
- Add at least one deterministic contextual loot path and one existing quest reward/admitted reward-definition path, preserving one-shot consumption and save semantics. **Do not create new quest storylines, dialogue, voice content or landmark types**; only use current hooks after validating their payload capabilities.
- Set coherent instance-aware sell/buy prices and make scarcity meaningful without guaranteed early-game access or exploitably renewable acquisition. Avoid arbitrary global per-world cap; verify representative seeds for availability.

### E — UI, testing and verification

- Display quality/name/weight/actual bonuses on inventory details and merchant rows; support mixed ordinary + masterwork units, correct selection, buy/sell/drop and equip; retain current visuals/GLBs by default. No new 3D model requirement.
- Unit/integration coverage for serialization and legacy restores; mixed count+instance carrying/trade; determinism/rarity; all affected work actions; weapon-wear behavior; camp wear and comfort (including packing); portable burn and grate/pan cooking precedence. Include no-double-grant and no-duplication tests.
- Manual browser verification across purchase, usage, placement/packing, save/reload, drop/reclaim, merchant resale, reward/loot and gameplay feedback. This planning step cannot assert visual/runtime completion.

## Non-goals

- No utility `poor`/`good` quality, player crafting line or recipe materials, new NPC dialog/quests, named unique artifact system, supernatural stats, special terrain changes, additional armor/weapons, global unique issuance registry, deep merchant economy rewrite, new 3D assets, new durability for shovel/pickaxe/blanket/pan/torch.
- No broad NPC work-speed boosts, separate character skill changes or worldgen epoch change.

## Release gates

- **Gate A:** no corruption or duplication of instances, unchanged legacy ordinary items and armor saves; all quality/weight round trips tested.
- **Gate B:** all declared gameplay bonus paths are actually exercised and ordinary baselines remain identical; no unexpected effects on survival, combat or NPC simulation.
- **Gate C:** sources are deterministic, finite and reasonably accessible across sample worlds, without easy repeat farming.
- **Gate D:** browser/manual checks confirm legible UI, portable torch, placed tent quality, and core flow; any measured performance regression triaged.

## Links

- [Implementation notes](./implementation-notes/items-player-068-masterwork-utility-items-implementation-notes.md)
- [Planning guide](./PLANNING.md)
- [Revival Strategic Brief](../research/v1-revival/STRATEGIC-BRIEF.md)

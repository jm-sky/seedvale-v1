# Stage 4 — Approved author decisions A1–A10

**Date:** 2026-10-28  
**Status:** author-approved design decisions; runtime implementation NOT approved  
**Scope:** V3 equipment intake into SeedVale V1; 87 donor definitions  
**Authority:** explicit author decisions during Stage 4 discussion, superseding conflicting recommendations in the [decision dossier](./2026-10-27--equipment-stage-4-decision-dossier.md) and [candidate matrix](./2026-10-27--equipment-stage-4-integration-matrix.md). These older documents remain historical proposals until reconciled.

## Binding constraints

- V1-first: existing V1 combat, inventory, NPC, economy, UI, and persistence mechanisms own runtime semantics.
- All 87 original V3 equipment records and every property remain lossless and immutable, including properties unsupported by V1.
- New runtime mechanics (typed damage, layered armor, shields/parry/offhand) must be separately designed and approved.
- Other V3 goods (herbs, mint tea, resources, crafting products) are out of scope.
- Strategic Brief D4 PERFORMANCE-FIRST still blocks unrelated runtime/workload-affecting integration until the required rendering tracks and combined results are recorded. These decisions do not waive D4.

## Approved decisions

| ID | Author decision | Consequences / follow-up |
| --- | --- | --- |
| **A1** | V3 `arrow` maps to current V1 `arrow`, retaining V1 damage bonus **0**. V1 `broadhead_arrow` and `war_arrow` remain distinct, unchanged. | Keep donor +2 and historical alias only as inert source metadata; no count or save migration. |
| **A2** | Preserve V1 `masterwork_hunting_bow`; add `marlow_longbow` as a distinct rare bow with separately authored V1 ranged profile. | Do not convert V3 draw/range blindly. Preserve existing V1 reward and save identity. |
| **A3** | Preserve V1 `masterwork_sword`; add `fenmoor_sword` as distinct rare sword with independently authored V1 melee profile. | No historical rename or replacement. |
| **A4** | Add `obsidian_knife` as distinct item with authored V1 profile using existing knife mechanics. | No invented historical save migration. |
| **A5** | **Override dossier recommendation:** introduce `sling_stone` as distinct ammunition **for slings only**. | Preserve `stone` and its existing throwing/sling/resource semantics; new ammunition admission/consumption needs explicit compatibility checks. Do not automatically import donor damage bonus. |
| **A6** | Execute existing `items-player-044` slot ownership: `shoulders` and `forearms`, with legacy slot/save handling. `padded_cap`, `padded_jacket`, `padded_hose` remain **inventory-only** and give no protection for now. | **Long-term requirement:** add real layered armor, including under-armor; keep V3 layering metadata and avoid data-model dead ends. Layer mechanics are a separate project, not part of Stage 4 activation. |
| **A7** | All shields (`wooden_shield`, `iron_rimmed_shield`, `buckler`) remain **inventory-only**; no present blocking, parrying, offhand, or held defense. | Future shield combat functionality is a separate workstream. This **overrides** the dossier held-only shield proposal. |
| **A8** | Exceptional/Unique equipment is stronger in overall tier than Masterwork; Legendary is higher than Exceptional/Unique. **Unique = Exceptional** in rarity terminology. **Each distinct Exceptional/Unique and Legendary item is globally limited to one live instance per world.** Acquisition may include quests, authored discoveries/rewards, and **limited specialist merchant offers**. | Global identity/issuance and persistence must prevent duplicates across player, NPC, merchant, containers, drops, transfers, save/load/rebuild and alternate reward sources. Moving/selling does not create another copy. Tier superiority need not mean superiority in every individual stat. Review classification of all donor `unique` and Legendary items explicitly; source flags alone do not prove exact tier or available quest. |
| **A9** | Among nine V3 `future` not currently active in V1: **activate five** `halberd`, `mace`, `brigandine`, `bolt_heavy`, `bolt_blunt`; **defer three** `falchion`, `composite_bow`, `arrow_blunt`; `buckler` is inventory-only per A7. Existing V1 `hunting_bow`, `crossbow`, `bolt` stay active. | Five activation paths require V1-compatible authored profiles; ammo variants need explicit crossbow compatibility, selection, consumption and persistence tests. Donor `future` designation is retained in immutable source metadata; runtime admission policy is separate. Deferred records remain lossless and inert. |
| **A10** | Adopt the **living-world economy** approach: availability reflects profession, settlement, wealth, scarcity and world roles. NPCs should use appropriate equipment. Common items are more accessible; Masterwork scarce but not globally unique; Exceptional/Unique and Legendary follow A8 one-per-world, and can appear in limited specialist sales or curated sources. | Reuse V1 existing merchants, stock, profession/NPC/loadout systems; no blanket store/loot injection, random unique duplication, or new parallel economy. Specific item prices, sourcing and NPC tuning require per-slice review. No unapproved economy architecture overhaul. |

## Tier and uniqueness semantics

`Common / Standard < Masterwork < Unique / Exceptional < Legendary` describes intended **overall equipment tier** rather than a demand that every damage/defense statistic be monotonic. Masterwork may have multiple instances. For each **distinct item identity** classified as Unique/Exceptional or Legendary, the world-wide cardinality must never exceed one live instance. The mechanism for issuance, loss, reappearance policy and persistence requires explicit technical design and verification prior to enabling any such source. Do not assume current V1 implements that invariant.

## Reconciliation required before implementation

1. Amend Stage 4 candidate integration matrix and proposal to reflect **A5 distinct sling ammunition**, **A7 all shields inventory-only**, **A8 global singleton + specialist sales**, **A9 five active / three deferred / one inventory-only**, **A10 living-world distribution**, and **A6 future layer architecture goal**.
2. Audit Stage 3 compatibility policy implications before changing any manifest entry; approved source-to-runtime changes require independently reviewed policy baseline updates and regression tests, not an adapter bypass.
3. Reassess item counts in the candidate matrix. Historic category counts 17/9/27/4/30 are Stage 3 classifications, **not** approved runtime outcomes; the former 27/15/2/29/3/2/9 paths are also superseded where they conflict with these decisions.
4. Ensure all currently declared unique/legendary identities are inventoried and that ordinary NPC/merchant/drop generation cannot violate global singularity.
5. Keep Performance-First D4 and `items-player-044` dependencies explicit. Planning, tests and inert metadata work are not blanket authorization for gameplay merges.

**Implementation authorization:** none. No code changes, combat balance changes, items registration, runtime spawns, economy or save changes are approved by this decision record.

# V3 Equipment Catalogue → V1: Recon and Migration Boundaries

**Created at:** 2026-10-27\
**Created by:** ChatGPT Codex\
**Status:** Completed static research and mapping; architecture/stages are recommendations, not an approved implementation plan. No runtime activation or gameplay acceptance.

This extends the [focused equipment comparison](./2026-10-26--ui-equipment-v1-v3-comparison.md) and [R4](./2026-10-25--004--gameplay-systems.md), rather than replacing their UI research. Companion evidence: [all 87 ID mappings](./2026-10-27--equipment-id-mapping.md) and [property compatibility/preservation matrix](./2026-10-27--equipment-property-matrix.md). The [Strategic Brief](./STRATEGIC-BRIEF.md) remains the scope authority: retain V1 systems, current controls and existing acquisition; no general player crafting import. Preserving all equipment definitions is distinct from importing the whole donor goods catalogue or approving all equipment for acquisition.

## 1. Evidence and scope

Inspected local repositories: V1 `jm-sky/seedvale-v1`, HEAD `3131b0c29ce9586047e9b141ed5fdde43a0013cc`; donor V3 `jm-sky/seedvale`, HEAD `94c464739d46afb982949fd6ed96b0d74d265b10`. Both working trees were clean before documentation work. These are local source snapshots, not a claim that remote branches were freshly fetched. Revalidate affected paths if either source changes.

Read V1 `CLAUDE.md`, dossier README/Strategic Brief, relevant `CODE_INDEX.md` and `STATE.md` sections, and plan README/PLANNING/PLAN-METADATA conventions. This is a research artifact outside the plan queue; no `planned` record, generated plan index or runtime-state update is appropriate.

Source references below use repository-relative V1 links and commit-pinned donor links. **Confirmed** means source/extraction evidence; it does not mean browser or combat execution passed. Recommendations and decisions still needed are labeled separately.

| Evidence owner | Confirmed implementation / limitation |
| --- | --- |
| [V3 types](https://github.com/jm-sky/seedvale/blob/94c464739d46afb982949fd6ed96b0d74d265b10/src/game/data/items/types.ts), [weapons](https://github.com/jm-sky/seedvale/blob/94c464739d46afb982949fd6ed96b0d74d265b10/src/game/data/items/weapons.ts), [armor](https://github.com/jm-sky/seedvale/blob/94c464739d46afb982949fd6ed96b0d74d265b10/src/game/data/items/armor.ts), [catalog](https://github.com/jm-sky/seedvale/blob/94c464739d46afb982949fd6ed96b0d74d265b10/src/game/data/items/catalog.ts) | All requested paths exist. Constructors apply defaults; counting text IDs alone is insufficient to establish final property values. |
| [V3 curation comparison](https://github.com/jm-sky/seedvale/blob/94c464739d46afb982949fd6ed96b0d74d265b10/docs/comparison/items-equipment.md), [items--004](https://github.com/jm-sky/seedvale/blob/94c464739d46afb982949fd6ed96b0d74d265b10/docs/plans/items--004--equipment-data-and-browser.md) | Historical provenance and API limits. Their 81-entry/33-armor count is stale: six common-tier unique armor definitions now exist. Their historical “V1 quality: none” is also stale. |
| [V1 definitions](../../../src/items/items.ts), [gameplay catalogue](../../../src/items/itemCatalog.ts), [instances](../../../src/items/itemInstances.ts) | ItemKind union; labels/weights/size/categories in ITEM_DEFS; capabilities/tuning in ITEM_CATALOG; explicit maintained-melee/ranged/armor families. V1 items.ts also imports Three.js: do not import it as a runtime dependency of an inert donor-data layer. |
| [Inventory](../../../src/items/Inventory.ts), [equipment](../../../src/items/equipment.ts), [armor quality](../../../src/items/armorItemInstances.ts), [HeldTool](../../../src/items/HeldTool.ts) | One existing ownership system for player/NPCs, counts plus specialized instances. Equipment holds owned instance references; HeldTool and primary weapons are separate selections over that ownership. |
| [Melee lifecycle](../../../src/combat/meleeAttack.ts), [player melee](../../../src/player/playerMelee.ts), [ranged lifecycle](../../../src/combat/rangedLifecycle.ts), [player ranged](../../../src/player/playerRanged.ts), [projectiles](../../../src/combat/projectile.ts), [defense](../../../src/combat/defenseResolver.ts), [game loop](../../../src/app/gameLoop.ts) | Live V1 timing, geometry, stamina/vigor, manual release, explicit crossbow reload, swept projectile collisions, criticals, directional probabilistic defense. Donor cooldown/resistance numbers cannot silently replace these contracts. |
| [NPC combat](../../../src/ai/npcCombat.ts), [loadouts](../../../src/ai/npcLoadout.ts), [inventory wiring](../../../src/app/inventoryWiring.ts), [trade](../../../src/items/trade.ts), [prices](../../../src/items/tradeCatalog.ts) | Personal-inventory armor selection and role/profession weapon selection exist. NPC ammo has explicit source ownership. Existing trade transfers concrete instances; prices/social rules remain V1-owned. |
| [Merchant assortment](../../../src/settlement/merchantTrade.ts), [specialist stock](../../../src/settlement/householdProfessionStock.ts), [artisan craft](../../../src/settlement/artisanCraft.ts), [production](../../../src/economy/production.ts) | Finite merchant stock, specialist/household goods and artisan output/quality exist. Acquisition is more than adding a definition to a list. |
| [World spawners](../../../src/items/createItemSpawners.ts), [authored pickups](../../../src/items/authoredWorldPickups.ts), [treasure](../../../src/items/treasureGameplay.ts), [drops](../../../src/items/createDroppedItems.ts), [save schema](../../../src/persistence/saveData.ts), [save assembly](../../../src/app/saveState.ts) | Spawning/loot, consumed one-shot IDs, exact instance drops and persisted owners already exist. Current save version is 56; maintain those paths. |

Existing work to reuse, not duplicate: [items-player-030](../../plans/archive/items-player-030-multi-part-armor-and-equipment-quality.md), [039](../../plans/archive/items-player-039-ubc-runtime-pauldrons.md), [040](../../plans/archive/items-player-040-armor-quality-pricing-and-world-availability.md), [047](../../plans/archive/items-player-047-additional-compact-weapons-and-master-hunting-bow.md), [059](../../plans/archive/items-player-059-crossbow-sling-and-thrown-stones.md), [060](../../plans/archive/items-player-060-ranged-weapon-inventory-trade-and-use-integrity.md), and [npc-053](../../plans/archive/npc-053-profession-aware-weapon-choice-and-armor-use.md). Their implementation notes are historical recon; current source supersedes old count-backed ranged assumptions. The [inventory UX recon/review](../../reviews/ux/items-inventory-equipment-ux-recon.md), [domain audit 18](../../reviews/codebase-domain-audit/2026-09-19--18--items-inventory-and-world-items.md) and R4 supply lifecycle/navigation evidence, not a fresh PASS here.

The already [planned items-player-044](../../plans/items-player-044-shoulder-and-forearm-equipment-slots.md) owns the proposed arms split and leather/steel bracers. **It has not landed:** current runtime still has `arms`, no `forearms`, and six armor kinds. Reconcile future activation with that owner; `steel_bracers` is a planned V1 name, not a current ID or proven alias for V3 `iron_vambraces`/`plate_vambraces`.

## 2. Confirmed donor inventory and semantics

| Export | Count |
| --- | ---: |
| MELEE_WEAPONS | 30 |
| RANGED_WEAPONS | 8 |
| ARMOR | 39 |
| SHIELDS | 3 |
| AMMO | 7 |
| Equipment total | **87** |

Availability: **60 active, 12 future, 14 unique, 1 quest-only**. Tier: **73 common, 7 masterwork, 7 legendary**. Tier and availability are independent: seven common-tier entries are unique (Pinewatch sword plus six armor pieces); all seven legendary entries are unique. Masterwork entries are active but excluded from ordinary generated donor merchant stock.

Armor-slot counts: head 6, shoulders 6, torso 11, forearms 4, hands 4, legs 5, feet 3 (39 total). Historical aliases: 28 v1 claims (27 current targets, one absent), 57 v2 claims; no duplicates within either namespace.

Subcategories: melee `axe/dagger/hammer/mace/polearm/spear/staff/sword`; ranged `bow/crossbow/sling`; armor families `padded/leather/studded/mail/plate`, seven slots, under/outer; shields `buckler/round/heater`; ammo `arrow/bolt/stone`. Material is an explicit enum, not a recipe or protection multiplier. Weight is kg; reach/range m; times gameplay seconds; price copper (100 copper = 1 silver, 100 silver = 1 gold). V1 shares some primitive units, not the balance scale.

Constructor defaults: melee active/common/200 durability, size from reach; ranged active/common/150/LG; ammo active/common/1/XS; shields active/common with explicit durability/size; armor active/common/300/outer/new origin, size from weight. Preserve **resolved values and provenance**, not just object literals with defaults omitted. Armor input resistance tuple is `[cut,pierce,blunt]`, resolved to named keys. Six unique armor additions explain 81→87 without changing weapon/ammo counts.

Quality is instance data (`poor/average/good/exceptional`, ×0.85/1/1.15/1.3), not tier. `quality.ts` scales weapon damage, armor resist (cap .95), rounded durability and inverse weight. Ammo/shield damage bonus/block strength do not gain the same scaling simply because they carry quality; price scaling is a separate trade calculation. `condition.ts` separates absolute item durability from edge: broken weapons stop dealing damage, broken shields stop reducing, worn armor scales resist with a floor before zero at breakage. None of these donor outcomes is V1 activation authority.

### Data, library consumers and world gameplay are different

| V3 boundary | Observed status and migration implication |
| --- | --- |
| catalogue/UI | Names, description, classes, material, tier, lore, availability, origin/legacy IDs and numeric stats are browsable data. IDs resolve canonical catalogue entries; legacy metadata is not a save migration implementation. |
| `instance.ts`, `quality.ts`, `condition.ts` | Pure item transformations/normalization, mass/quality/edge/condition/repair calculations exist. `normalizeItemInstance` builds a new known-field shape; it is not a lossless unknown-field storage mechanism. |
| `loadout.ts`, `inventory.ts` | Seven-slot layered equips, two-handed/shield exclusions, weighted resist previews, inventory operations and wear helpers exist. Coverage weights (.35 torso/.20 legs/.12 head/.10 shoulders/.10 feet/.08 forearms/.05 hands) are provisional combat proposals. `takeHit` wears layers; it is not a damage resolver. |
| `ammo.ts` | Compatibility, deterministic selection and stale-observation-checked one-unit consumption exist. This is not a complete shot/reload/projectile transaction. |
| `trade.ts` | Prices consume quality/condition/edge; generated stock filters active/common; other availability/tier rows excluded. Generic `addItem` does not enforce obtainability or uniqueness. |
| `npc/guardEquipment.ts` | Real kit policy selects IDs, equips armor/weapon and explicitly permits otherwise-future crossbow/bolt. This exception is not permission to expose them globally. |
| `sim/items/heldItem.ts`, player kit, container/session save paths | Catalogue identity/condition are used by held presentation and owned inventory persistence. This demonstrates data-system dependence, not live equipment combat. |
| live combat | Search of current production TS callers found `strikeWithWeapon`, `takeHit`, `blockWithShield` defined in the data library, with no external live callers. Shield parry fields appear in UI; no live parry/hit resolver was established. Damage types, armor location resistance, arcs and combat timing remain catalogue/library or contract intent, not proven live combat. |

## 3. V1 capabilities to preserve

- **Ownership and capacity:** counts for fungible ammunition/resources; stable instances for 15 maintenance-melee kinds, 6 reusable ranged kinds and 6 armor kinds. Inventory enforces both mass and abstract size admission, includes quality-adjusted armor mass and liquid payload. Donor warning-only capacity and all-item instance rows must not replace it.
- **Combat:** V1 melee config requires damage/range/arcDot/windUp/hitWindow/recovery/staminaCost; hits resolve once at the window start, agility adjusts recovery, Strength/crit/edge affect damage. Ranged adds accuracy, critical parameters and optional reload/skill-scale/minimum safe reload distance. V3 lacks several required V1 fields. Keep V1 values for existing kinds.
- **Armor:** head/body/arms/hands/legs/feet are valid slots but only body/arms have concrete definitions. Unlayered pieces multiply remaining global damage, after active held defense; restrictions multiply separately. No typed incoming cut/pierce/blunt or hit-location resistance contract is present here. Adding another slot's generic reduction can buff every hit, not just that body area.
- **Quality and wear:** armor has poor/common/good/masterwork; protection ×.85/1/1.1/1.2 (piece cap .85), mass ×1.2/1/.9/.8, quality-adjusted restrictions. Melee durability and sharpness are normalized 0..1; durability does not disable broken weapons, sharpness uses the existing curve and flat maintenance profile. Ranged instances have identity only; armor has quality only. No general shield, armor durability or ammo quality lifecycle.
- **Defense:** existing held-item defense uses global facing dot .2, deterministic full-block chance and partial reduction plus defense skill. It is not a separately equipped shield or timed parry system.
- **NPCs:** armor derives best effective reduction per slot from personal inventory at incoming-hit time, stable ties by kind/ID. It reuses equipment validation/modifier resolution; no second persisted NPC equipment loadout. Incoming protection is shared; full movement/effort restriction parity is not demonstrated. New stat ranking must eventually be reconciled for typed/location damage.
- **Ammo:** V1 tries ordered `ammoKinds`; player fire adds ARROW_DAMAGE_BONUS (broadhead +4, war +8, ordinary arrow/bolt/stone default 0). NPC selection retains source-owner inventory. V3 arrow +2 and bolt +3 are not compatible numeric replacements. Preserve selection/spending/miss recovery in existing projectile flow.
- **Acquisition/UI:** `createAcquiredInstance`, generic transfers, finite merchant/specialist stock, production/artisan outputs, loot/reward/drop/one-shot pickup routes exist. UI actions continue through V1 callbacks and actual effects; inert donor stats must never be shown as active protection/DPS. Current three-panel/hybrid inventory contract supersedes older layout text.
- **Persistence:** Save v56 and Inventory serializers keep specialized known fields, not arbitrary extensions. `cloneItemInstance`/toSaveItemInstance/instancesFromJSON must be part of any later mutable-data change; bolting extra fields onto an instance loses them. Equipment and held/primary refs retain V1 IDs. Pre-revival save compatibility may be waived per brief, but explicit version/reset policy and new-save round trips remain required.

## 4. Architecture comparison and recommendation

| Criterion | A — Direct merge | B — V3 source definitions + V1 adapter | C — Extend V1 canonical contract |
| --- | --- | --- | --- |
| Lossless source preservation | Easy to accidentally flatten/drop fields; needs extra schema | Explicit typed donor source retains every field/default; projection may intentionally omit | Possible with namespaced source semantics; dangerous if shared names are reinterpreted |
| V1 compatibility | Touches high-fan-out catalogues immediately | Existing V1 contracts remain output boundary; explicit opt-in per ID | Changes union/serializers/readers across domains even for unused mechanics |
| Single source of truth | Blends conflicting meanings in one table | One authority for donor data; existing V1 authority for active mechanics; no duplicate inventory | One broad table, but mixed active/inert rules still need an activation boundary |
| Runtime overhead | Low lookup cost | Validate/build once; runtime consumes ordinary V1 definitions, no per-tick donor scans | Low lookup cost; wider records and more branching |
| Determinism | Depends on hidden merge precedence/defaults | Pure explicit projection/versioned policy, fail closed | Deterministic if activation/defaulting is explicit |
| Save migration risk | High if IDs/instances change implicitly | None for inert definitions; bounded later if a persisted shape/meaning changes | Higher shared-contract/normalizer blast radius |
| Future activation | Lost fields need rediscovery; data/mechanics tangled | Original values remain available; each mechanic can be approved independently | Good after stable semantic contracts exist |
| Maintenance / Composer delivery | Small apparent diff, expensive semantic review | Moderate upfront typing/mapping; small independently reviewable slices | Largest initial contract and integration burden |

**Recommendation: B.** Preserve a typed immutable donor catalogue and explicit compatibility manifest; project only approved items into existing V1 definition contracts. This is a **source-data authority**, not another authoritative runtime item, inventory, equipment, trade or combat system. Existing V1 kinds retain V1 tuning, ownership and acquisition. Do not represent 87 imported items as newly live V1 ItemKinds merely to store them.

Proposed ownership (paths are candidates, not files created in this session):

| Candidate boundary | Responsibility / permitted dependencies |
| --- | --- |
| `src/items/v3Equipment/types.ts` | Standalone `V3EquipmentDefinition` discriminated union, equipment-only subsets of source enums. Preserve literal enums, optionality and nested named resist/legacy objects. No Vue/Three/runtime inventory imports; type-only V1 imports belong in the adapter, not source schema. |
| `src/items/v3Equipment/catalogue.ts` | All 87 resolved immutable definitions with original IDs/values; provenance manifest records repository, source SHA, paths, export counts and schema revision. Deep-readonly data; validate/freeze in tests/dev as appropriate. No external checkout dependency or V3 barrel import. |
| `src/items/v3Equipment/compatibility.ts` | Exhaustive donor-ID keyed policy: existing target or no target, classification, unresolved decisions, approved field projections, activation/acquisition state. Preserve legacy strings but distinguish historical claims from verified targets. No generic legacy-name-first resolver. |
| `src/items/v3Equipment/adapter.ts` | Pure deterministic projection returning explicit `existing`, `candidate` or `deferred` results; existing results reference V1 definitions without overwriting them. New candidates require authored V1 profiles for missing/different semantics. No implicit all-items registration and no runtime fallback for unresolved values. |
| Existing `items.ts` / `itemCatalog.ts` | Continue owning active V1 presentation/physical and gameplay definitions. Later approved new kinds consume projection once at initialization/build time; never keep copied live stats in an independently edited table as well. Existing V1 data are compatibility overrides, explicitly owned/versioned as V1 policy. |
| Existing Inventory/equipment/HeldTool, combat/player/NPC, trade/production, persistence/UI | Remain the sole owners of their current responsibilities. Donor schema cannot invoke these systems or grant capabilities. |

Keep source fields stored even if no runtime projection exists. Source definition storage does **not** require adding data to every saved instance. If future V3-native quality/condition must vary per physical piece, extend V1's existing instance union with a typed, versioned payload and update its clone/save/transfer boundaries together; do not build a donor inventory or rely on unknown properties surviving serializers. A future payload may refer to donor ID/schema revision while preserving V1 instance identity. No save extension is necessary for the first inert catalogue stage.

For existing items, there are intentionally two different facts, never competing live authorities: “V3 source damage” and “active V1 damage”. UI must label a donor source browser as a reference; active equipment comparison uses only the V1 effective resolver. No averaging armor resistance, rescaling damage/range, splitting cooldown, renaming quality or deriving price from copper automatically.

## 5. Candidate stages for later Composer briefs

These are **not approved implementation work or a `planned` plan**. Opus retains contract/planning ownership under the brief. Each later brief should name owned/forbidden files and a focused check; do not combine data intake and mechanic activation.

| Candidate stage | Bounded output and checks / acceptance |
| --- | --- |
| 1. Catalogue/type preparation | Prepare equipment-only donor types, source-SHA/count manifest and explicit policy-result types in the isolated proposed directory. Tests: exhaustive discriminants/enums, no engine/UI imports, no runtime catalogue/save consumers. Acceptance: existing V1 definitions, sources and saved payloads unchanged; typecheck relevant files. |
| 2. Lossless donor preservation | Copy all 87 resolved definitions plus provenance. Tests compare every field recursively with the pinned donor exports, including constructor defaults, named resist order, optional metadata, six unique armor additions, all historical IDs and original strings. Assert unique canonical IDs and expected family/availability/tier counts. Acceptance: zero field omissions and zero new obtainable/live kinds. |
| 3. Adapter and validation | Implement exhaustive compatibility manifest and pure adapter; unresolved entries return deferred, not guessed profiles. Existing items resolve to unchanged V1 definitions. Tests: 87 policies, dangling/duplicate aliases, arrow collision, missing obsidian ID, Marlow/Fenmoor semantics, repeatable output and frozen source input. Acceptance: no auto-registration; deterministic output and no mutation. |
| 4. Safe runtime catalogue integration | After separate scope approval, choose a tiny allowlist. Add new kinds to existing ITEM_DEFS/ITEM_CATALOG only with authored complete V1 profiles; keep acquisition off. Tests compare all pre-existing definitions/physical values and simulate existing melee/ranged/equipment effects unchanged; negative tests for absent/incomplete profiles. Acceptance: no all-catalogue toggle, new capabilities or equipment rules merely from donor fields. |
| 5. Inventory/equipment/NPC/economy | Approve each obtainable item and exact source. Reuse createAcquiredInstance, family lists, generic transfer, current NPC selection and merchant/artisan/loot owners. Tests: mass+size admission; exact instance survives buy/equip/drop/pickup/give/sell; no payment on failed transfer; NPC next-hit recomputation; quality/production outputs; seeded stock unchanged except approved additions; restricted IDs never restock. Manual smoke: existing controls and acquisition. Slot/layer changes wait for stage 7's explicit contract. |
| 6. Persistence compatibility | Implement before any new persistent semantics can ship, even if development labels it stage 6. Cover clone/serialization/hydration, player+NPC+merchant+household/container/corpse/drop/transport/animal-pack owners as applicable. Tests: new save round trip preserves exact state/refs, repeated load no minting, unknown IDs fail explicit policy, staged save publication/rollback; old saves migrate or are explicitly rejected/reset under chosen policy. Pure data-only storage needs no save bump. |
| 7. Optional future mechanics | Separate contracts/approval for typed/location damage, armor layers/slot split, quality, durability breakage/repair, grip/shields/parry, ranged units/timing/ammo, economy/unique issuance. Reuse existing combat/equipment state owners. Tests: shared player/NPC protection, no double mitigation, deterministic outcomes/shot transactions, all layer/equip exclusions, truthful comparisons and versioned saved state. No activation merely because source values exist. |

Stage order is dependency guidance, not permission to ship stage 5 before persistence requirements. Stages 1–3 should have no live imports; their checks need no GPU/full-world benchmark. Runtime integration later needs feature-level focused tests/smoke; consequential combat/save contracts need their applicable review gates.

## 6. Risks and decisions still needed

1. **ID/meaning — high:** decide arrow vs broadhead mapping, Marlow longbow vs V1 hunting-bow role and Fenmoor material/tier identity. Historical `obsidian_knife` has no current target. Keep proposed aliases namespaced by source version; never rewrite saved kinds from names alone.
2. **Armor — high:** reconcile items-player-044 slot split with future layering/body-area damage contract. Decide incoming damage typing/coverage and NPC rule parity before consuming resist. V3 coverage averages must not become a second mitigation pass atop V1 armor.
3. **Balance/units/timing — high:** author complete V1 profiles for any newly live weapon. No universal metres→world units factor, cooldown decomposition, damage multiplier or scalar resist conversion is justified by current code.
4. **Quality/condition — high:** choose future source-native versus compatibility instance semantics; V1 masterwork quality is not V3 masterwork tier. Absolute durability→normalized condition preserves a ratio only, not donor breakage/edge/repair rules.
5. **Acquisition/economy — medium/high:** all 87 may be stored, but the initial obtainable allowlist remains undecided. `active` is donor policy, not V1 approval; future crossbow/bolt and hunting bow must not remove already-existing V1 sources. Unique/quest pieces need authored placement/reward and persistent once-only issuance, not generic stock. Preserve V1 economy, recipes and domestic tools.
6. **Persistence — high when activated:** brief permits a new game, but exact reset/version policy is still an explicit decision. Never silently reinterpret saved IDs, strip future mutable payloads or mint a replacement owner-local donor identity.
7. **Presentation — medium:** new armor can remain visually transitional per brief; item details/previews must distinguish inert source stats from active effects. Existing appearance/attachment system remains separate.

These decisions do not block the isolated inert-data preparation candidate. This recon does not settle them or request new gameplay scope.

## 7. Verification recorded

Executed a lightweight source extraction in `/tmp`: TypeScript transpilation/evaluation of donor weapons.ts and armor.ts with no application startup, and isolated extraction of V1 ITEM_CATALOG (imports stubbed only for unrelated water/injury constants; no game behavior inferred from those stubs). Checked all 87 resolved records, IDs, legacy references, categories, availability and tier totals against the complete mapping. Inspected source consumers to distinguish current functionality from historical plans. Enumerated every equipment contract property and all instance fields in the property matrix; B/C/D/E rows specify lossless storage and future activation prerequisites.

Documentation checks: exact mapping ID set equals donor export set, no duplicate rows; actual V1 targets exist; broken historical alias isolated; relative links/file scope/whitespace checked. No runtime code/game data changed; no tests/build/browser/GPU/gameplay acceptance claimed. No commit or PR. Mechanical validation: **PASS** — 87/87 unique mapped source IDs; all 41 definition keys covered by the property matrix; 29 existing V1 target strings validated; reverse check 34 V1 equipment kinds; 48 relative document links resolved; no duplicate legacy IDs per version; one explicitly flagged absent historical V1 claim (`obsidian_knife`). These are documentation/source checks, not runtime acceptance.

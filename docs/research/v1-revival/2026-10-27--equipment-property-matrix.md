# Equipment Property Compatibility and Lossless Preservation

**Created at:** 2026-10-27\
**Created by:** ChatGPT Codex\
**Status:** Static compatibility research; no implementation/activation approval.

Part of the [recon](./2026-10-27--equipment-catalogue-recon.md); [ID mappings](./2026-10-27--equipment-id-mapping.md) apply this contract to every definition. Source SHAs/evidence ownership are recorded in the recon. V3 type names below describe actual source types, not a proposed rename of V1 contracts.

## Reading the classes

**A — Direct:** compatible representation/meaning, but not permission to replace an existing V1 value. **B — Adapted:** a bounded deterministic structural conversion is possible. **C — Preserved:** source data stored but not consumed as V1 gameplay. **D — Future mechanics:** consuming it requires an explicit future gameplay contract. **E — Conflict:** current semantics disagree; an architectural/balance decision is required, not an automatic conversion.

Classes describe V1 compatibility, not whether a donor helper reads a field. A property may have a safe B structural mapping and a separate E gameplay meaning; those cases are explicit. Every B/C/D/E row below is preserved **losslessly in the typed immutable source definition**, including original units/enums/optionality. A runtime projection may omit it without loss because the source survives. No commented-out fields, opaque `any`, unknown-property pass-through or V1 normalizer is the preservation mechanism. “Lossless” here means original source values remain retrievable, not that different gameplay can be made equivalent.

## 1. Definition properties

V3 equipment is the discriminated union `MeleeWeapon | RangedWeapon | ArmorItem | ShieldItem | AmmoItem`. All common ItemBase fields are required except `legacyIds` and `lore`; nested legacy IDs are independently optional. Weapon capabilities are optional. The following covers **all 41 distinct top-level keys** present across the resolved equipment exports, as well as their nested fields.

| V3 property and type | Current V1 counterpart / support | Class | Lossless preservation and condition for later use |
| --- | --- | --- | --- |
| `id: string` | `ItemKind` literal union and keys in ITEM_DEFS/ITEM_CATALOG | B/E | Preserve source ID separately from target V1 kind. Explicit version-scoped manifest; never let alias lookup override a canonical collision. New runtime kinds require registration and identity/save policy. `arrow` is the named collision. |
| `name: string` | `ItemDef.label`, catalog label; current labels mostly Polish | B | Preserve original name; authored V1 label/localization mapping. Do not change ID or infer effects from wording. |
| `description: string` | optional ItemDef description | B | Preserve verbatim source text; V1 presentation may use adapted truthful wording. Claims about armor/damage/parry must be labeled inactive until mechanics support them. |
| `category: ItemCategory` narrowed to equipment literals | V1 `categories: readonly ItemCategory[]`; no shield/ammo category literal | B | Explicit weapon→weapon, armor→armor; ammo/shield presentation needs V1 category choice. Retain original discriminant even if UI groups differently. Category does not grant hold/equip/combat ability. |
| `material: ItemMaterial` | named variants/production inputs; no equivalent universal material contract | C/D | Store original enum. Future repair/recipe/quality effects require explicit resource mapping and rules. Never infer Damascus/obsidian multipliers from material alone. |
| `tier: 'common' \| 'masterwork' \| 'legendary'` | named kinds; armor instance quality also says masterwork | E | Keep separate source-tier namespace. Decide named rarity/issuance/balance; never substitute V1 armor quality or collapse named items into a quality upgrade. |
| `weight: number` (kg) | ITEM_DEFS weight, armor effectiveInstanceWeight, Inventory admission | A/E | Same kg representation; preserve donor baseline separately. Existing masses stay V1; changing a value affects carrying, transfers and economy. Quality-scaled weight formulas conflict (below). |
| `size: SizeClass` | identical six literal sizes and V1 abstract size-capacity units | A | Copy structurally only for an approved profile; keep existing V1 sizes otherwise. Donor constructors deriving size from reach/weight are not a replacement for authored V1 sizing. |
| `price: number` (copper) | MERCHANT_PRICES/fallback tradeValue in V1 coins, social/condition/quality logic | E | Preserve amount and currency metadata. No justified fixed copper→V1 economy conversion. Choose per-item V1 valuation/acquisition; preserve current barter, merchant cash/stock and price rules. |
| `durability: number` (base absolute item HP) | melee normalized 0..1 state; armor/ranged lack corresponding condition | E | Preserve maximum exactly; don't treat as current condition or copy into normalized state. Future max/current/breakage/repair/wear contract must cover actor/owner/save paths. Ammo convention is 1 and does not imply wear. |
| `availability: 'active' \| 'future' \| 'quest-only' \| 'unique'` | spawn flag, explicit stock/production/reward/loot lists | C/D | Preserve all four values. Separate V1 admission/issuance allowlist; donor active does not grant a source, future must not disable pre-existing V1 kinds. Unique needs persistent issuance policy; generic inventory addition is not uniqueness enforcement. |
| `origin: 'merged' \| 'new' \| 'v1' \| 'v2'` | no runtime counterpart | C | Preserve provenance verbatim; only research/diagnostics consume it. Never grant mechanics from origin. |
| `legacyIds?: { v1?: string; v2?: string }` | no generic donor-ID migration seam | C/E | Store both strings and absent fields. Validation distinguishes historical claims from verified current targets, checks per-version duplicates/dangling refs/collisions. No automatic save rename, particularly arrow and absent obsidian knife. |
| `lore?: string` | description/story UI but no universal lore contract | C | Preserve original string and absence; optional read-only source presentation. Any named reward/quest meaning needs authored V1 integration. |
| `kind: 'melee' \| 'ranged'` (weapons only) | config presence `melee`/`ranged`, maintenance/instance lists | B | Deterministic discriminant→candidate family, validated against V1 classification. Cannot supply missing melee/ranged fields or make every weapon a maintenance item. |
| `weaponClass: MeleeClass \| RangedClass` | V1 role/profession choice and concrete capability configs, no universal same enum | C/D | Preserve exact class; future selection/animation mapping authored independently. Do not change NPC ranking/skills because a class is present. |
| `grip: 'one-handed' \| 'two-handed'` | one HeldTool and primary choices, no donor weapon/shield exclusion model | D | Preserve both values. Future hand occupancy/exclusions must extend existing selection owners, cover equip swaps, NPCs, saves and UI displacement. |
| `damage: number` | melee/ranged config damage, Strength/crit/maintenance consumers | E | Preserve donor base damage; keep V1 values for existing kinds. New profiles need V1 balance, not a global scale. Matching a single value (e.g. short bow 14) does not equate full combat semantics. |
| `damageType: 'blunt' \| 'cut' \| 'pierce'` (weapons/ammo) | scalar damage; injury/body state is not this item damage-type contract | D | Store exact literal. Future hit payload/resistance/target rules must explicitly consume it, including ammo vs weapon precedence. No default cut or invented mixed percentages. |
| `cooldown: number` (gameplay seconds) | melee phases; ranged recovery + optional reload | E | Store whole duration. No valid automatic decomposition into windUp/hitWindow/recovery or crossbow reload. Later authored V1 timing profile is separate; donor DPS stays reference-only. |
| `stamina: number` | config staminaCost and actor need/vigor handling | B/E | Renaming is structural B; applying donor number is balance E. Preserve original; use V1 cost for existing kinds, authored values for new profiles. Do not alter vigor/day-length/equipment multipliers. |
| `capabilities?: ('chop' \| 'cut')[]` | ItemCapability operations, including wood_chopping/meat_harvesting/branch_trimming | B/E | Store exact array/absence. Explicit candidate mapping only: chop→wood_chopping is plausible; cut→two distinct V1 operations is not automatically authorized. Preserve V1 per-kind capabilities and required held/bag semantics. |
| `reach: number` (melee m) | melee.range max target-center XZ distance in world units | E | Store metres and original value; no universal factor. Knife V3 .6 vs V1 1.6; long sword 1.3 vs V1 2.6. Decide reach/target-radius interpretation and calibrate per profile; do not silently shorten attacks. |
| `sharpness: number` (melee base 0..1) | mutable weapon-instance sharpness 0..1 | E | Preserve base edge capability separately from current V1 edge state. V3 maxEdge depends on quality/type; V1 curve/wear/sharpening differ. Future explicit edge model and conversion, never copying a definition's sharpness into every saved instance. |
| `range: number` (ranged effective m) | RangedConfig range is maximum projectile travel | E | Preserve value and “effective” meaning. V3 bow 45–68 m and crossbow 80 vs V1 bow 11–20 units and crossbow 18; retain V1 ranges until approved calibration. |
| `ammo: 'arrow' \| 'bolt' \| 'stone'` | ordered ranged.ammoKinds ItemKind[] | B/E | Preserve source family; manifest can deterministically list compatible approved V1 kinds, retaining existing order. Family alone does not decide ordinary vs broadhead preference, resource stone identity or fallback behavior. |
| `drawTime: number` (s to full draw/sling swing) | player minimum hold/manual release vs NPC auto delay, crossbow aim prep | E | Preserve full-draw value. Same numeric unit, different trigger semantics; no automatic timing replacement. Retain cancel/refund and reload transaction behavior. |
| `projectileSpeed: number` (m/s) | ranged projectileSpeed in world units/s, geometric collisions | B/E | Preserve value/units. Numeric assignment only after the range/world-distance contract is accepted; test swept hits/miss recovery and actor timing. Existing V1 speed unchanged. |
| `ammoKind: 'arrow' \| 'bolt' \| 'stone'` (ammo) | accepted ItemKinds, ordinary count-backed ammo/resources | B | Explicit family→target ID registration. Keep original family, separate sling_stone from V1 stone and separate canonical arrow from broadhead alias ambiguity. No ammo quality/stack-instance import. |
| `damageBonus: number` (ammo) | ARROW_DAMAGE_BONUS; default 0 for missing V1 key | B/E | Flat addition is structurally compatible, values are not: donor arrow +2 vs V1 ordinary 0/broadhead +4; bodkin +5 vs war +8; bolt +3 vs 0. Preserve donor value; author/approve each projected delta and all firing consumers. |
| `shieldClass: 'buckler' \| 'heater' \| 'round'` | no shield equipment family | C/D | Preserve classifier; later equip/visual/role policy, not an implicit new held-tool subtype. |
| `arcDeg: number` (shield frontal degrees) | active defense uses global DEFENSE_FRONT_ARC_DOT .2 | E | Preserve original arc. A dot conversion is mathematical, but replacing a global defense arc with per-shield arcs changes gameplay; full-vs-half-angle convention and hand/defense ownership must be specified. This is not a melee attack arc. |
| `reduction: number` (shield block fraction) | defense.partialReduction plus probabilistic full/partial outcomes | E | Preserve value; no equality with V1 partialReduction. Decide block event/outcome, skill scaling and damage ordering before any use. |
| `efficiency: number` (share blocked damage not wearing shield) | no shield wear consumer | D | Store fraction unchanged. Later shield wear formula must define blocked amount/rounding/breakage and persist condition; don't convert to block chance. Current donor wear helper is flat, not full use of this field. |
| `parryWindowS: number` | no current timed parry lifecycle | D | Preserve duration, inert. Explicit future input/action window contract shared with combat; no UI control or timing activation now. |
| `canParry: boolean` | held items canBlock; no equivalent parry flag | D | Preserve boolean; never map to canBlock or grant parry from it. Needs the same future action/equipment contract as window. |
| `slot: 'head' \| 'shoulders' \| 'torso' \| 'forearms' \| 'hands' \| 'legs' \| 'feet'` | head/body/arms/hands/legs/feet | B/E | Structural torso→body and shoulders→current arms are explicit compatibility aliases; head/hands/legs/feet retain names. Forearms has no distinct live slot. Keep donor slot; reconcile items-player-044 split, do not merge shoulders+forearms into arms or discard one. |
| `layer: 'under' \| 'outer'` | one instance per V1 equipment slot | D | Preserve exact layer; future layered equip/replace/ownership/save/mitigation contract. Under piece must not become another global armor multiplier automatically. |
| `family: 'padded' \| 'leather' \| 'studded' \| 'mail' \| 'plate'` | armor-kind-specific reduction/restrictions, no same enum | C/D | Preserve source family. Read-only grouping is safe; any inferred restriction/protection/crafting ranking requires explicit rules. |
| `resist: Record<DamageType, number>` | one armor.damageReduction and multiplicative remaining damage | E | Preserve all three named numeric values (including cap semantics); no averaging, max, sum or coverage weighting conversion. Future incoming type/region/layer rules replace/extend the existing resolver deliberately, avoiding double mitigation. |
| `speedPenalty: number` (fraction, negative can speed up) | movementSpeedMultiplier plus separate stamina/recovery/sprint multipliers | E | Store sign/value exactly. V3 adds penalties across pieces; V1 multiplies speed multipliers and quality adjusts restrictions. `1 - penalty` per piece is not equivalence. Boots' negative penalty must not silently become a V1 buff. |

## 2. Type domains that must survive intake

| Type | Exact source domain |
| --- | --- |
| SizeClass | `LG`, `MD`, `SM`, `XL`, `XS`, `XXS` |
| ItemMaterial | `bone`, `cloth`, `damascus`, `iron`, `leather`, `mineral`, `mixed`, `obsidian`, `organic`, `paper`, `steel`, `wood` |
| DamageType | `blunt`, `cut`, `pierce` |
| MeleeClass | `axe`, `dagger`, `hammer`, `mace`, `polearm`, `spear`, `staff`, `sword` |
| RangedClass | `bow`, `crossbow`, `sling` |
| QualityName / QUALITY_MULT | `poor` .85; `average` 1; `good` 1.15; `exceptional` 1.3 |

Other exact enum domains appear in their property rows. A future equipment-only schema can exclude unrelated goods interfaces without dropping any equipment field. Keep `common/masterwork/legendary` tier entirely separate from the four quality names. No character SkillId import is needed for these five equipment variants.

## 3. Mutable instance properties and persistence

V3 `ItemInstance` includes fields beyond equipment (food/herbs/water); list them explicitly so copying the source interface does not imply unsupported V1 hydration. Static source-definition preservation alone does not migrate instances.

| V3 instance field | Current V1 equivalent | Class | Lossless strategy / activation requirement |
| --- | --- | --- | --- |
| `id: string` (inventory-local unique) | physical ItemInstance.id, exact refs across transfer/save | E | Keep source-owner namespace on any future import fixture; allocate/retain V1 physical identity through existing transfer/acquisition. Never reuse donor `iN` blindly or remint on load. Preserve old ID as provenance if importing actual instances later. |
| `itemId: string` | ItemInstance.kind / count map key | B/E | Explicit source-version alias policy; retain source ID if identity is imported. Apply no canonical-first or legacy-first string heuristic. |
| `quality: QualityName` | ArmorQuality only; melee/ranged/ammo have no generic quality | E | Preserve source quality in a typed future payload, alongside V1 quality if needed. Average↔common can label a neutral baseline, but good .15≠.10 and exceptional≠masterwork; no automatic many-to-one rename. |
| `durability: number` (current absolute HP) | melee normalized durability; armor/ranged absent | E | If importing instances later, store current and source max/quality/revision. Ratio alone loses source HP/rounding information; existing V1 serializer/cloner must explicitly retain payload. Breakage/repair remain disabled until approved. |
| `count: number` | inventory counts vs individual instance rows | B/E | Preserve exact positive integer; ammo becomes V1 count through explicit aggregation policy. Source ammo quality/edge/other distinguishing data would be lost by flattening; keep typed per-lot metadata or defer instance import until that storage contract is accepted. Nonstacking equipment stays one physical V1 instance. |
| `edge?: number` (0..1, absence means max) | melee instance.sharpness but different cap/curve | E | Preserve optional presence/value and source quality/base sharpness separately; needs explicit conversion/rules. Never use absent=edge 1 without source semantics. |
| `ageH?: number` (herbs) | food batch/provenance mechanisms differ; not equipment | C | Not emitted for valid equipment. Preserve schema knowledge as out-of-scope goods metadata; reject invalid equipment payload rather than silently apply it. Any later goods instance port requires its own research. |
| `expiresAtWorldS?: number` (food) | V1 food batches use acquiredAtDays/decay semantics | C/E | Not equipment. Do not copy time-domain conversions from this intake. If importing unrelated data later, preserve exact deadline and source calendar calibration, then specify conversion separately. |
| `waterL?: number` (waterskins) | liquid containers track liquid/amountLitres | C | Not equipment. No activation or loss needed for 87-definition preservation. Separate goods/container contract would retain amount and liquid meaning. |

Source definition versus instance durability/sharpness/quality must be distinct types/owners. For future mutable payloads, explicitly update `cloneItemInstance`, `toSaveItemInstance`, `Inventory.instancesFromJSON`, structural save validation, drops/transfers and migrations together; current code drops unrecognized fields. Source catalogue data stays outside saves, keyed by a stable schema revision if future instance semantics require it.

## 4. V1-required properties missing from V3

Absence of a donor field is not permission to delete or guess its V1 counterpart.

| V1 contract | Class / required action |
| --- | --- |
| melee.windUp, hitWindow, recovery, arcDot | **E:** retained for every existing kind. V3 has no melee arc and no phase breakdown. New weapons need explicitly authored profiles; do not split cooldown into arbitrary percentages. |
| ranged.accuracy, criticalChance/criticalMultiplier, skillAccuracyScale, reloadTime, minReloadDistance | **E:** keep existing V1 values/neutral defaults exactly as existing consumers define them. New ranged profiles must specify behavior and NPC/player support; V3 crossbow cooldown is not a reload contract. |
| defense.canBlock/baseBlockChance/partialReduction, global frontal threshold | **E:** existing weapon blocking stays active. Donor shields do not replace that authority. |
| armor.damageReduction, staminaCostMultiplier, meleeRecoveryMultiplier, movementSpeedMultiplier, sprintStaminaMultiplier | **E:** preserve V1 profiles and quality rules until an approved typed/layered armor contract integrates them. Donor data cannot reconstruct all five channels. |
| ItemDef categories array, labels, physical dimensions; holdable, modelUrl, spawn, operations | **B/C:** active V1 presentation/physics/actions stay V1-owned. Donor metadata can suggest candidate records, but assets, holdability, world spawning and capability grants need explicit mapping. |
| Merchant/social/barter values, NPC stock budgets, production materials/skill/quality, one-shot loot and quest ownership | **E/D:** keep existing systems. Availability/tier/lore/price are insufficient to produce these contracts. |
| Player/NPC target permissions, Strength/Agility/skills, vigor/time domains, projectile recovery | **E:** remain V1 authority; no V3 stat activates or removes these rules. |

## 5. Preservation checklist for a later implementation

Store every definition as the original resolved discriminated record, not a flattened V1 item with the rest commented out. Record donor SHA/source paths and schema revision; source-text snapshots or a hash manifest can accompany the typed resolved data for audit. Tests should compare original values recursively, all optional nested fields and defaults, including resistance tuple→named-key resolution. Unknown future fields should fail schema drift checks, not disappear silently.

Maintain a separate exhaustive per-ID compatibility/activation policy. Existing V1 profiles survive unchanged. Deferred/restricted/conflicting entries remain inspectable but yield no runtime definition without an approved complete profile. No unsupported field is thrown away; none is activated by storage. Original strings and numbers stay source facts, while adapted values are explicit V1 policy with separate names/units. This covers all B/C/D/E cases above without a second inventory or combat authority.

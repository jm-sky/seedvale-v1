# Complete V3 → V1 Equipment ID Mapping

**Created at:** 2026-10-27\
**Created by:** ChatGPT Codex\
**Status:** Complete static mapping of 87 definitions; proposed targets/actions are not registration, migration or acquisition approval.

See [recon/source pins](./2026-10-27--equipment-catalogue-recon.md) and [property matrix](./2026-10-27--equipment-property-matrix.md). Rows use resolved donor exports, including constructor defaults. All original definition fields must survive in typed inert source data regardless of row classification.

## Reading the table

- **Existing** = verified same current V1 ID/family, with different values allowed; **Adapt** = verified target through a historical or explicitly proposed alias; **New** = no current target, potentially representable with an authored V1 profile; **Conflict** = unsafe identity/semantic mapping requiring a decision; **Deferred** = no target and restricted availability/tier or a distinct unsupported mechanic. These classify proposed integration, not automatic obtainability.
- **Support** compares the complete donor definition with current V1 gameplay: Partial means a relevant live family exists but fields/semantics are unsupported; None means no usable equivalent contract (shield, separate forearm, under-layer). No row warrants Full for the entire donor contract. New weapon classes still require authored V1 tuning and selection/visual decisions.
- **ID compatibility:** Direct = same canonical string, not numeric equivalence; Alias = explicit proposed source-ID→existing-V1-kind relation; Migration required = no safe current identity target/registration. For new inert definitions this means *only if later activated/imported*, not a save migration now. No blanket alias resolver is recommended.
- **Availability/tier** reproduce source metadata. Active is not V1 admission. Existing V1 crossbow/bolt/hunting-bow sources stay V1-native despite donor future flags. Restricted/new entries remain inert until selected.
- **Dependencies:** I inventory/acquisition/held identity; C combat/projectiles/maintenance; N NPC choice/loadout; E trade/production/loot/rewards; P save/load/clone/transfer; U truthful UI/equipment/appearance. Dependency lists describe later activation scope; inert intake does not require modifying all these owners.

### Unsupported-property profiles (apply in full to each referenced row)

These name fields not currently consumed **with donor semantics**. V1 may already consume a different property with the same primitive name; see the matrix. Common **B0** on every row: source `origin`, `legacyIds`, `lore`, `material`, `tier`, `availability` have no equivalent general V1 gameplay contract; donor `price`/quality/wear and physical values are not approved runtime replacements. Source name/description/category remain preserved even if V1 presentation differs.

| Profile | Additional unsupported/different properties and required boundary |
| --- | --- |
| M | damage scale/type, reach units/geometry, cooldown vs phase timings, stamina tuning, grip/class, base sharpness vs mutable edge, absolute durability/breakage, capabilities mappings and generic quality. Existing V1 melee phase/arc/defense/maintenance values stay authoritative. |
| R | damage/type, effective range, cooldown/drawTime/manual-release/reload semantics, projectileSpeed calibration, stamina, grip/class, ammo-family expansion, generic quality/durability. V1 accuracy/crit/reload fields cannot be reconstructed from donor data. |
| A | typed resist vs scalar damageReduction, slot aliases, layer, family, absolute durability, quality rules, additive speedPenalty vs V1 restriction multipliers. Existing armor baseline stays V1-owned. |
| A-under | A plus no live under/outer co-occupancy; do not register as another global reduction piece. |
| A-forearm | A plus no separate forearms slot; reconcile existing items-player-044 rather than collapsing into arms. |
| S | whole shield slot/grip system; shieldClass, arcDeg, reduction, efficiency, canParry, parryWindowS, durability/quality; V1 weapon probabilistic defense is a different mechanic. |
| Q | ammo damageType, generic quality and source-instance stacking; donor damageBonus values and ammoKind identity/preference need explicit policy even though V1 has count-backed ammo and bonus lookup. Ammo durability=1 is an inert convention, not a breakage rule. |

## All definitions

| V3 ID | V1 ID (verified target or candidate) | Category / subtype | V3 availability / tier | legacyIds (v1; v2) | Classification | V1 gameplay support | ID compatibility | Unsupported V3 properties | Dependencies | Recommended action | Risk |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `knife` | `knife` | weapon / dagger | active / common | knife; knife | Existing | Partial | Direct | B0 + M | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `dagger` | `dagger` | weapon / dagger | active / common | dagger; dagger | Existing | Partial | Direct | B0 + M | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `obsidian_knife` | — (historical obsidian_knife absent) | weapon / dagger | active / common | obsidian_knife; obsidian_knife | Conflict | Partial | Migration required | B0 + M | I/C/N/E/P/U | Historical v1 alias is absent; preserve claim, no current target. Do not map to knife/damascus_knife. | High |
| `obsidian_dagger` | — | weapon / dagger | active / common | —; obsidian_dagger | New | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `damascus_dagger` | `damascus_knife` | weapon / dagger | active / common | damascus_knife; damascus_dagger | Adapt | Partial | Alias | B0 + M | I/C/N/E/P/U | Explicit source alias only; keep V1 target profile/physical identity. | Medium |
| `ashgrove_dagger` | — | weapon / dagger | active / masterwork | —; ashgrove_dagger | Deferred | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `kestrel_dagger` | — | weapon / dagger | unique / legendary | —; kestrel_dagger | Deferred | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `short_sword` | `short_sword` | weapon / sword | active / common | short_sword; short_sword | Existing | Partial | Direct | B0 + M | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `sword` | — | weapon / sword | active / common | —; sword | New | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `falchion` | — | weapon / sword | future / common | —; — | Deferred | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `long_sword` | `long_sword` | weapon / sword | active / common | long_sword; long_sword | Existing | Partial | Direct | B0 + M | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `pinewatch_longsword` | — | weapon / sword | unique / common | —; pinewatch_longsword | Deferred | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `damascus_sword` | `damascus_short_sword` | weapon / sword | active / common | damascus_short_sword; damascus_sword | Adapt | Partial | Alias | B0 + M | I/C/N/E/P/U | Explicit source alias only; keep V1 target profile/physical identity. | Medium |
| `damascus_longsword` | `damascus_long_sword` | weapon / sword | active / common | damascus_long_sword; — | Adapt | Partial | Alias | B0 + M | I/C/N/E/P/U | Explicit source alias only; keep V1 target profile/physical identity. | Medium |
| `obsidian_sword` | `obsidian_sword` | weapon / sword | active / common | obsidian_sword; — | Existing | Partial | Direct | B0 + M | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `millbrook_shortsword` | — | weapon / sword | active / masterwork | —; millbrook_shortsword | Deferred | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `harrow_shortsword` | — | weapon / sword | unique / legendary | —; harrow_shortsword | Deferred | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `fenmoor_sword` | `masterwork_sword` | weapon / sword | active / masterwork | masterwork_sword; fenmoor_sword | Conflict | Partial | Migration required | B0 + M | I/C/N/E/P/U | Historical masterwork_sword alias is not full semantic equivalence (one-handed steel/tier vs V1 named golden sword); preserve both profiles. | High |
| `ironvale_sword` | — | weapon / sword | unique / legendary | —; ironvale_sword | Deferred | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `stonebridge_longsword` | — | weapon / sword | active / masterwork | —; stonebridge_longsword | Deferred | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `greywatch_longsword` | — | weapon / sword | unique / legendary | —; greywatch_longsword | Deferred | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `hatchet` | `hatchet` | weapon / axe | active / common | hatchet; small_axe | Existing | Partial | Direct | B0 + M | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `axe` | `axe` | weapon / axe | active / common | axe; axe | Existing | Partial | Direct | B0 + M | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `battle_axe` | `battle_axe` | weapon / axe | active / common | battle_axe; big_axe | Existing | Partial | Direct | B0 + M | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `spear` | `spear` | weapon / spear | active / common | spear; spear | Existing | Partial | Direct | B0 + M | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `halberd` | — | weapon / polearm | future / common | —; — | Deferred | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `club` | — | weapon / mace | active / common | —; club | New | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `mace` | — | weapon / mace | future / common | —; — | Deferred | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `war_hammer` | — | weapon / hammer | active / common | —; war_hammer | New | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `staff` | — | weapon / staff | active / common | —; staff | New | Partial | Migration required | B0 + M | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `sling` | `sling` | weapon / sling | active / common | sling; sling | Existing | Partial | Direct | B0 + R | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `short_bow` | `short_bow` | weapon / bow | active / common | short_bow; short_bow | Existing | Partial | Direct | B0 + R | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `hunting_bow` | `hunting_bow` | weapon / bow | future / common | hunting_bow; — | Existing | Partial | Direct | B0 + R | I/C/N/E/P/U | Keep active V1 hunting bow; donor future flag does not disable it; no donor timing/range overwrite. | Medium |
| `long_bow` | `long_bow` | weapon / bow | active / common | long_bow; long_bow | Existing | Partial | Direct | B0 + R | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `composite_bow` | — | weapon / bow | future / common | —; composite_bow | Deferred | Partial | Migration required | B0 + R | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `marlow_longbow` | `masterwork_hunting_bow` | weapon / bow | active / masterwork | masterwork_hunting_bow; marlow_longbow | Conflict | Partial | Migration required | B0 + R | I/C/N/E/P/U | Historical hunting-bow alias conflicts with longbow role, slow draw and donor availability; keep V1 reward identity. | High |
| `yewmaster_longbow` | — | weapon / bow | unique / legendary | —; yewmaster_longbow | Deferred | Partial | Migration required | B0 + R | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `crossbow` | `crossbow` | weapon / crossbow | future / common | crossbow; crossbow | Existing | Partial | Direct | B0 + R | I/C/N/E/P/U | Keep V1 reload/aim/accuracy and sources; donor future/cooldown are separate policy. | Medium |
| `buckler` | — | shield / buckler | future / common | —; — | Deferred | None | Migration required | B0 + S | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | High |
| `wooden_shield` | — | shield / round | active / common | —; wooden_shield | Deferred | None | Migration required | B0 + S | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | High |
| `iron_rimmed_shield` | — | shield / heater | quest-only / common | —; guard_shield | Deferred | None | Migration required | B0 + S | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | High |
| `padded_cap` | — | armor / head/under/padded | active / common | —; — | New | None | Migration required | B0 + A-under | I/C/N/E/P/U | Preserve inert; layer occupancy/protection contract required before equipment integration. | High |
| `leather_cap` | — | armor / head/outer/leather | active / common | —; leather_cap | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `mail_coif` | — | armor / head/outer/mail | active / common | —; — | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `iron_helm` | — | armor / head/outer/plate | active / common | —; iron_helm | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `full_helm` | — | armor / head/outer/plate | active / common | —; — | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `leather_pauldron` | `leather_pauldron` | armor / shoulders/outer/leather | active / common | leather_pauldron; — | Existing | Partial | Direct | B0 + A | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `ranger_pauldron` | `ranger_pauldron` | armor / shoulders/outer/studded | active / common | ranger_pauldron; — | Existing | Partial | Direct | B0 + A | I/C/N/E/P/U | Preserve source; retain V1 profile, ID and acquisition. | Medium |
| `iron_pauldrons` | — | armor / shoulders/outer/mail | active / common | —; pauldrons | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `plate_pauldrons_spiked` | `knight_pauldron_spike` | armor / shoulders/outer/plate | active / common | knight_pauldron_spike; — | Adapt | Partial | Alias | B0 + A | I/C/N/E/P/U | Explicit source alias only; keep V1 target profile/physical identity. | Medium |
| `plate_pauldrons_round` | `knight_pauldron_round` | armor / shoulders/outer/plate | active / common | knight_pauldron_round; — | Adapt | Partial | Alias | B0 + A | I/C/N/E/P/U | Explicit source alias only; keep V1 target profile/physical identity. | Medium |
| `padded_jacket` | — | armor / torso/under/padded | active / common | —; padded_jacket | New | None | Migration required | B0 + A-under | I/C/N/E/P/U | Preserve inert; layer occupancy/protection contract required before equipment integration. | High |
| `leather_jerkin` | `leather_armor` | armor / torso/outer/leather | active / common | leather_armor; leather_jerkin | Adapt | Partial | Alias | B0 + A | I/C/N/E/P/U | Explicit leather_armor source alias; keep V1 scalar protection/quality/restrictions; resist/layer inert. | Medium |
| `studded_leather` | — | armor / torso/outer/studded | active / common | —; studded_leather | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `mail_shirt` | `chainmail` | armor / torso/outer/mail | active / common | chainmail; chainmail | Adapt | Partial | Alias | B0 + A | I/C/N/E/P/U | Explicit chainmail source alias; keep V1 scalar protection/quality/restrictions; resist/layer inert. | Medium |
| `brigandine` | — | armor / torso/outer/plate | future / common | —; — | Deferred | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `plate_cuirass` | — | armor / torso/outer/plate | active / common | —; plate_cuirass | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `stoneford_mail` | — | armor / torso/outer/mail | active / masterwork | —; stoneford_mail | Deferred | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `kingsbane_hauberk` | — | armor / torso/outer/mail | unique / legendary | —; kingsbane_hauberk | Deferred | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `ravenmoor_cuirass` | — | armor / torso/outer/plate | active / masterwork | —; ravenmoor_cuirass | Deferred | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `marshal_cuirass` | — | armor / torso/outer/plate | unique / legendary | —; marshal_cuirass | Deferred | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `saltmere_wardens_coat` | — | armor / torso/outer/studded | unique / common | —; — | Deferred | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `northpass_riders_helm` | — | armor / head/outer/plate | unique / common | —; — | Deferred | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `leather_bracers` | — | armor / forearms/outer/leather | active / common | —; bracers | New | None | Migration required | B0 + A-forearm | I/C/N/E/P/U | Preserve inert; no current forearms target. Reconcile items-player-044 slot/brace ownership before activation. | High |
| `iron_vambraces` | — | armor / forearms/outer/mail | active / common | —; — | New | None | Migration required | B0 + A-forearm | I/C/N/E/P/U | Preserve inert; no current forearms target. Reconcile items-player-044 slot/brace ownership before activation. | High |
| `plate_vambraces` | — | armor / forearms/outer/plate | active / common | —; — | New | None | Migration required | B0 + A-forearm | I/C/N/E/P/U | Preserve inert; no current forearms target. Reconcile items-player-044 slot/brace ownership before activation. | High |
| `leather_gloves` | — | armor / hands/outer/leather | active / common | —; leather_gloves | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `studded_gloves` | — | armor / hands/outer/studded | active / common | —; — | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `plate_gauntlets` | — | armor / hands/outer/plate | active / common | —; — | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `padded_hose` | — | armor / legs/under/padded | active / common | —; — | New | None | Migration required | B0 + A-under | I/C/N/E/P/U | Preserve inert; layer occupancy/protection contract required before equipment integration. | High |
| `leather_trousers` | — | armor / legs/outer/leather | active / common | —; leather_trousers | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `mail_chausses` | — | armor / legs/outer/mail | active / common | —; — | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `plate_greaves` | — | armor / legs/outer/plate | active / common | —; — | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `thornwatch_pauldrons` | — | armor / shoulders/outer/plate | unique / common | —; — | Deferred | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `blackpine_vambraces` | — | armor / forearms/outer/plate | unique / common | —; — | Deferred | None | Migration required | B0 + A-forearm | I/C/N/E/P/U | Preserve inert; no current forearms target. Reconcile items-player-044 slot/brace ownership before activation. Authored once-only issuance required. | High |
| `fallowmere_gauntlets` | — | armor / hands/outer/plate | unique / common | —; — | Deferred | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `ridgeguard_greaves` | — | armor / legs/outer/plate | unique / common | —; — | Deferred | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. Authored once-only issuance required. | Medium |
| `leather_boots` | — | armor / feet/outer/leather | active / common | —; leather_boots | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; donor negative speedPenalty is not approved V1 speed bonus. | Medium |
| `reinforced_boots` | — | armor / feet/outer/studded | active / common | —; — | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `plate_sabatons` | — | armor / feet/outer/plate | active / common | —; — | New | Partial | Migration required | B0 + A | I/C/N/E/P/U | Preserve inert; candidate only after complete V1 profile + source approval. | Medium |
| `arrow` | `broadhead_arrow` | ammo / arrow | active / common | broadhead_arrow; arrow | Conflict | Partial | Migration required | B0 + Q | I/C/N/E/P/U | Collision: donor canonical arrow vs legacy broadhead_arrow; keep BOTH V1 kinds, no global rename. Decision needed. | High |
| `arrow_bodkin` | `war_arrow` | ammo / arrow | active / common | war_arrow; arrow_bodkin | Adapt | Partial | Alias | B0 + Q | I/C/N/E/P/U | Proposed war_arrow alias; retain V1 +8, donor +5/type inert. No automatic stat conversion. | Medium |
| `arrow_blunt` | — | ammo / arrow | future / common | —; arrow_blunt | Deferred | Partial | Migration required | B0 + Q | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `bolt` | `bolt` | ammo / bolt | future / common | —; bolt | Existing | Partial | Direct | B0 + Q | I/C/N/E/P/U | Same current V1 bolt despite no v1 legacy claim; retain active V1 acquisition and +0, donor future/+3 inert. | Medium |
| `bolt_heavy` | — | ammo / bolt | future / common | —; bolt_heavy | Deferred | Partial | Migration required | B0 + Q | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `bolt_blunt` | — | ammo / bolt | future / common | —; bolt_blunt | Deferred | Partial | Migration required | B0 + Q | I/C/N/E/P/U | Preserve inert; no automatic stock, loot or registration. | Medium |
| `sling_stone` | `stone` | ammo / stone | active / common | —; sling_stone | Adapt | Partial | Alias | B0 + Q | I/C/N/E/P/U | Proposed stone adapter (not a legacyIds claim); retain V1 resource/throw/sling uses and count ownership. | Medium |

## Reconciliation and compatibility traps

Classification totals: Existing **17**, Conflict **4**, New **27**, Adapt **9**, Deferred **30** = **87**. These labels are not risk/approval verdicts. There are **29 proposed current V1 targets**, including the conflicted arrow/Marlow/Fenmoor targets; all target strings exist in current ITEM_CATALOG. The absent obsidian historical claim is deliberately not a target.

- **Canonical uniqueness:** all 87 donor IDs are distinct; legacy values are unique within each source-version namespace. Cross-version equal strings are normal and must not be collapsed.
- **Canonical overlap:** 18 donor canonical IDs exist in current V1. One is the arrow collision; same spelling is insufficient. Valid v1 legacy claims number 27 of 28 declared claims; obsidian_knife is the lone dangling current-V1 claim.
- **Historical renames:** damascus_dagger→damascus_knife, damascus_sword→damascus_short_sword, damascus_longsword→damascus_long_sword, fenmoor_sword→masterwork_sword, marlow_longbow→masterwork_hunting_bow, plate_pauldrons_spiked/round→knight_pauldron_spike/round, leather_jerkin→leather_armor, mail_shirt→chainmail, arrow_bodkin→war_arrow. These relations preserve ancestry; the matrix still forbids automatic value substitution.
- **Arrow:** V3 arrow damageBonus +2, legacy v1 broadhead_arrow; V1 arrow +0, broadhead_arrow +4, war_arrow +8. V3 arrow_bodkin +5. Store every donor record without merging V1 arrow/broadhead counts or changing consumption preference. The final donor-arrow target remains a decision, not a verified migration.
- **Marlow:** V3 range 62/draw 1.5 vs V1 masterwork_hunting_bow range 17/draw .38/accuracy .9; V1 is an exceptional reward, donor is active/masterwork. Keep V1 quest/reward identity and approved role until a deliberate redesign.
- **Missing obsidian knife:** source metadata claims v1 ancestry but current ItemKind/catalog has no obsidian_knife. This is evidence of historical drift, not permission to add one or rename another knife.
- **Native bolt / sling stone:** V1 bolt already exists without donor v1 legacy metadata. V1 stone is a broader resource and throwable, not a historical alias listed by V3. Mapping the donor family to stone must not overwrite its other uses, mass, size, price or spawn.
- **Named unique gear:** unique is not synonymous with legendary. Preserve Pinewatch and all six common-tier unique armor entries, their names/lore and restriction flags. A source-data layer is safe without an obtainability decision.

## V1 equipment outside this donor equipment set

Defined scope for this reverse check: every current V1 melee/ranged/armor config, plus bow/crossbow/sling ammo and throwable stone. That yields 17 melee-capable kinds + 6 ranged + 6 armor + 5 ammo/resource kinds = **34 distinct V1 kinds**. The proposed 29 targets leave the following five without an unambiguous donor-equipment representation. This does not inventory all V1 non-equipment goods.

| Current V1 ID | Current use | Donor relation / recommendation |
| --- | --- | --- |
| arrow | ordinary ammo, hunter production/resupply, stock, +0 bonus | Donor canonical spelling exists but historical arrow record points to broadhead. Keep ordinary V1 arrow native and distinct; do not collapse it into broadhead. |
| shovel | melee-capable soil-digging tool | Outside donor equipment arrays; keep V1-native combat and terrain/interaction capability. |
| pitchfork | maintained melee/profession/farming item | V3 goods may preserve a tool relation; no equipment definition here. Retain V1-native function, stock and role semantics. |
| sickle | maintained melee/harvest/profession tool | Keep V1-native; no weapons-array coverage does not justify removing melee support. |
| shears | melee-capable shearing tool, count-backed rather than maintained weapon | Keep V1-native shearing/melee behavior and lifecycle; do not classify every melee-capable tool as donor equipment. |

Pickaxe and other V1 tools also remain native; pickaxe has no current melee config and is outside this equipment reverse-check set. Jewelry/signets have no worn finger slot and are not donor weapon/armor/shield/ammo scope. Planned steel_bracers is not a current runtime kind. V3 goods and all unrelated V1 content remain outside this intake; this mapping removes nothing.

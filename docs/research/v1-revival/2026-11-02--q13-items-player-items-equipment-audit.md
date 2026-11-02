# Q13 — Older plans vs approved Vision: `items-player / items` (armor cluster)

**Date:** 2026-11-02  
**Status:** read-only audit findings for Opus reconciliation; **not** an author decision, implementation approval, plan update, or full subdomain audit.  
**Scope:** first bounded group of five armor/equipment plans. Remaining `items-player / items` plans have **not** been reconciled by this packet. Previous separate packet covered `quests-progression / progression`.

## Authority and boundaries

Compare with [25 approved Vision decisions](./2026-10-29--vision-alignment-v1-v3.md), especially **#22** (V1 combat baseline, layered/body-area protection), **#23** (materials, quality, durability, repair and NPC artisans; no complex automatic player crafting), **#11** (meaningful survival without tedious chores), and relevant **#19, #10/#12, #13, #24**. [Strategic Brief](./STRATEGIC-BRIEF.md) governs Revival; its **D5/D6 armor/body-hit balance questions remain unapproved**. Q13 owner is Opus. Older plans are not new author approvals.

Already available [V1/V3 UI and equipment comparison](./2026-10-26--ui-equipment-v1-v3-comparison.md) records detailed V1/donor differences and gaps. This audit **reuses** that recon rather than designing another protection contract. Sources also included [Q13 queue](./AUTONOMOUS-SESSION-QUEUE.md), [plan index](../../plans/README.md), [planning rules](../../plans/PLANNING.md), five plans, their [implementation notes](../../plans/implementation-notes/), and targeted current V1 code/tests.

## Plans reviewed

| Plan | Repository status | Reconciliation |
| --- | --- | --- |
| [items-player-029](../../plans/archive/items-player-029-wearable-armor-and-combat-equipment.md) — wearable armor | `verification needed`, archived | Aligned as an **initial body-armor slice**. Its explicit non-goals for durability, repair, extra slots and NPC armor do not negate later Vision requirements. |
| [items-player-030](../../plans/archive/items-player-030-multi-part-armor-and-equipment-quality.md) — multi-part armor, quality | `verification needed`, archived | Quality/instance ownership aligns with #23; six mutually exclusive slots and scalar effects are **not** final #22 layering/body-area protection. |
| [items-player-031](../../plans/archive/items-player-031-armor-category-and-character-defense-summary.md) — categories, defense summary | `done`, archived | Aligned UI summary of the **currently implemented** mechanics; not evidence that later region/layer requirements are complete. |
| [items-player-040](../../plans/archive/items-player-040-armor-quality-pricing-and-world-availability.md) — quality pricing/stock | `verification needed`, archived | Aligned quality-aware deterministic trade; merchant-generated quality is not automatically proof of artisan-produced physical goods. |
| [items-player-044](../../plans/items-player-044-shoulder-and-forearm-equipment-slots.md) — shoulders/forearms | `planned`, active | Compatible incremental slot/presentation change, **not** fulfillment of approved layered or body-area combat rules. Its dated GLB skinning/export blocker requires current asset verification before implementation. |

Archiving of `verification needed` plans does **not** establish browser/gameplay acceptance; see [archive snapshot 3](../../plans/archive/README.md#snapshot-3--2026-10-26).

## Findings (severity, evidence, minimal correction)

### F1 — High: six-slot scalar armor must not be mistaken for final region/layer protection (#22)

**Implemented (static source):** `src/items/equipment.ts` declares `head | body | arms | hands | legs | feet`, one owned armor instance per slot. `composeEquipmentModifiers()` multiplies whole-hit remaining-damage factors. `src/player/playerDamage.ts::applyPlayerDamage()` uses one `incomingDamageMultiplier` after directional active defense, without a struck-body-region parameter. `src/items/itemCatalog.ts::ArmorConfig` has scalar `damageReduction`, not hit coverage/layer. Tests in `src/items/equipment.test.ts` exercise body + arms composition.

**Planned:** `items-player-044` replaces `arms` with `shoulders` and introduces `forearms` with save compatibility. It still does not introduce `under/outer` layering or regional hit attribution.

**Minimal correction for Opus:** carry forward `029/030/031/044` only as incremental historical/possible implementation slices. State explicitly in any later armor owner that equipment slots, armor coverage regions, and layers are distinct contracts. Reuse Opus-owned D5/D6 and the existing equipment comparison; do not silently import V3 damage/armor authority or treat `044` as approval of the full contract.

### F2 — Medium: armor quality exists, armor durability/repairs are outstanding (#23)

**Implemented:** `src/items/itemInstances.ts::ArmorItemInstance` contains `id, kind, quality`, with `poor/common/good/masterwork`; no armor durability/condition field. `src/items/armorItemInstances.ts::resolveEffectiveArmorPiece()` adjusts protection, weight and restrictions by quality. Weapon maintenance has separate durability/sharpness types; do not confuse these with armor condition.

**Planned/older-plan non-goals:** `029/030/040` deliberately exclude armor durability/repair. This is a **staged omission**, not direct opposition to #23.

**Minimal correction:** explicitly track durability/maintenance/repair as a not-yet-delivered Vision outcome, distinct from permanent item quality. Avoid treating these archived slices as complete #23 or inventing a parallel inventory/instance owner. Exact wear/repair balance and player inconvenience have not been approved here.

### F3 — Medium: merchant quality stock is not end-to-end NPC artisan production (#23/#19)

**Implemented:** `src/settlement/merchantTrade.ts::resolveMerchantArmorQuality()` assigns deterministic quality at merchant stock initialization; `seedMerchantStockIfNeeded()` materializes concrete instances. `src/items/tradeCatalog.ts` prices quality-bearing armor instances. Separately, `src/settlement/artisanCraft.ts` defines material/skill gating and deterministic artisan quality via `resolveArtisanCraftedQuality()`; tests exist for both components.

**Not verified by this packet:** full production → owned output → merchant/ordinary NPC trade → player transfer flow for every armor item, and corresponding material accounting. A quality roll at merchant stock creation is **not** evidence that a skilled artisan made that instance.

**Minimal correction:** retain these existing seams, distinguish merchant assortment initialization from actual production, and verify the relevant integration path before claiming that #23's living-economy artisan origin is complete. Do not add a player crafting system to bridge the gap.

### F4 — Medium: aggregate armor penalties and NPC/player parity need later integration verification (#11/#22)

**Implemented:** `src/items/equipment.ts::composeEquipmentModifiers()` multiplies stamina, melee recovery, movement and sprint modifiers over worn pieces; this can increase the cumulative burden when slot count grows. `src/ai/npcCombat.ts::resolveNpcArmorEquipment()` derives NPC armor from owned items and `resolveIncomingNpcDamage()` applies the shared protection math; `npcCombat.test.ts` covers ownership, multi-slot damage protection and removal.

**Not verified:** full equivalence of NPC and player movement/effort penalties, nor browser-level feel under a future complete layered kit. Current tests do not establish those.

**Minimal correction:** later armor integration should test whole-kit penalties and eligible player/NPC hits with shared rules, without introducing incessant needs/maintenance chores or altering V1 combat controls outside approved scope.

## Confirmed alignments and other applicable decisions

- **#23:** current concrete instance identity and `poor/common/good/masterwork` quality, quality-adjusted pricing, and quality-aware inventory ownership align. Reviewed plans do **not** require automatic general player crafting.
- **#19/#24:** merchant quality selection is seeded and initialized once for finite persistent stock; this is compatible with a simulated economy and no real-time catch-up. This review did not audit the full economy or offscreen clock.
- **#22:** player and NPC both consume shared scalar reduction after active defense. This is a correct **baseline**, not layered/body-area completion.
- **#10/#12:** the current player damage path enters `downed` at zero HP; armor plans do not require routine fatal combat outcomes.
- **#11/#13:** no universal EXP/level or extra survival-chore requirement is introduced by the reviewed armor plans. Broader skills and player needs are out of this packet.

## Author decisions

**None newly required for this five-plan packet.** The author has approved the *direction* of layered/body-area armor, existing trade/artisan acquisition and no general player crafting. Opus still owns technical reconciliation and D5/D6; only a consequential combat feel, NPC parity, maintenance burden or visual compromise should be presented as a concrete author choice. Do not convert this audit into new implementation approval.

## Handoff to Opus

1. Preserve `029/030/031/040` as historical delivered/verification-qualified slices, not reactivated full work items.
2. Reconcile `044` narrowly: `arms → shoulders` save migration preserving item identity/quality, two coexistable slots, and explicit distinction between **slots** and future **protection regions/layers**. Re-check the source GLB blocker rather than assuming the dated note remains true.
3. Keep follow-up gaps visible: **regional/layered protection (high)**; **armor condition, maintenance and repair (medium)**; **end-to-end artisan provenance and NPC/player parity verification (medium)**. These are findings, **not** new approved plans or an implementation sequence.
4. Reuse the [existing equipment comparison](./2026-10-26--ui-equipment-v1-v3-comparison.md) for mechanics and donor boundaries; no need to redo its inventory/combat recon.
5. Q13 as a whole and other `items-player / items` plans **remain unreviewed by this packet**. Opus merges findings and controls Q13 status.

**Verification limits:** Static examination of current GitHub `main` plans, implementation notes, source and test definitions. No unit tests, browser gameplay, visual assets, benchmarks or production simulations were executed. No source, plan or Q13 status changes are authorized by this document.

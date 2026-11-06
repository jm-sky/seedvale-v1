# GA-003 - Items / player documentation consistency audit

- **Task:** GA-003, third documentation-vs-code slice. Jan Madeyski selected topic 2 (developer tooling), then topic 3 (items/player); this report covers topic 3 only.
- **Date:** 2026-11-06 (Europe/Warsaw, CET).
- **Repository / branch:** `jm-sky/seedvale-v1` / `main`.
- **Pinned SHA:** `3c249cb62ddde343be2b654fae43315a484f8054`.
- **Auditor / environment:** Grok Bot executor, native PowerShell on S661L; Windows checkout `D:\Projekty\private\seedvale-v1`.
- **Report lifecycle:** `review needed`.
- **Finding validation:** GA-003-F06/F07 both `unverified`; independent reviewer not assigned. F01/F02 remain in the [deferred-section pilot](./2026-11-06--GA-003--state-deferred-section.md); F03-F05 remain in [developer tooling](./2026-11-06--GA-003--dev-tooling.md).

## 1. Scope and preflight

Compare inventory-facing claims in [STATE.md](../../STATE.md):67-79 with the actual matching domain document, **[state/player-systems.md](../../state/player-systems.md)**. The domain index routes player survival/carry capacity there; no separate `docs/state/items.md` or `player.md` exists at the pin. Sample item consumption/cooking, skill data/book use, and Carry capacity, plus minimal ownership declarations needed to interpret STATE. Per-item catalog and combat are separate owners, not recursively added audit corpora.

**Stop condition:** claim ledger, candidate documentation findings, and audit queue/index updates. No runtime audit, implementation plan, priority changes, or full survival/building review.

### Checkout protection and method

- Started on `main` at the pin with exactly three pre-existing local changes: modified audit QUEUE/index and the untracked developer-tooling report. No source changes observed.
- **Pull skipped:** the existing unstaged audit docs prevent a clean `git pull --rebase` without first resolving them. No stash/autostash, reset, pull or rebase attempted. Remote-tracking `origin/main` matched HEAD; no fresh-fetch/current-remote claim.
- Read root AGENTS/CLAUDE, Grok README/QUEUE/index/tooling report, STATE/domain index/player-systems, Revival research index, Strategic Brief decision table, active session queue, matrix and relevant prior-review scope/findings. F01-F05 were assigned; this slice starts at F06.
- Recent path history includes `4a71b893` (layered armor), `11692956` (incoming human hit), `454af994` (equipment positions/resistance/revisions), plus intervening terrain/cave changes. Do not audit the changing combat seams merely because their files are adjacent.
- Source and tests outweigh notes/reviews, plans, state/architecture, and vision. Read implementations and positive call/consumer paths, not only absence searches. Tests below were **read, not run**.
- Rechecked HEAD/status before writing. Protected tooling-report SHA256: `528D684C0F896F3B30B54172DFF4F4363C1F13B0FA66EBB21097A17CB06DE2B3`. It is not edited; queue/index changes retain both prior slices and F01-F05.
- Native Windows Shell only; no WSL, browser, dev server, game, benchmark, tests, installation, commit, push or stash. No other agent launched. `rg` was unavailable; `git grep`, `git ls-files` and PowerShell reads sufficed.

### Collision / ownership record

| Owner / prior work | Matrix | Treatment |
| --- | --- | --- |
| Strategic Brief:46, Items x Combat D5-D7; items-player-062/064/065/066; Q150-Q154 / items-player-067 and fauna-051 | 18/20 | Exclude weapon balance, armor/layers/resistance, wear/sharpness, projectiles, hit/death pipelines, NPC combat gear and upper-tier source activation. Q150-Q152 technically landed; Q153-Q154 remain gated. Whole seam is not stable. |
| [Review 034](../../reviews/2026-11-05--034--items-player-067-fauna-051-combat-plans-review.md) | 11/18/20 | Reach/bite/calibration ownership; no repeated hit or animal-damage audit. |
| Q139/Q141-Q145, Q159-Q163; review 035 | 11/12/15 | Exclude fauna persistence, pack/mount lifecycle and horse behavior. Gift transfer stops before recipient use/equipment decisions. |
| Q155-Q158 observation work; review 036 / commissioned rendering-performance scope | 16/17/20/24 | Exclude appearance, animation, skeleton/armor attachments, gaze/visibility and targeting presentation. UI inspection is data/dispatch only. |
| Q13 [items/player armor reconciliation](../../research/v1-revival/2026-11-02--q13-items-player-items-equipment-audit.md) | 18/19/20 | Do not duplicate regions/quality/production/parity findings or decide gear direction. |
| [Historical domain audit 18](../../reviews/codebase-domain-audit/2026-09-19--18--items-inventory-and-world-items.md) | 14/15/18/24 | Existing pickup admission, payload mass, container-transfer atomicity, cave drop identity and grouping-cost findings are not reissued or independently validated. |
| Building/contracts, treasure/quest/cave content, full crafting | 14/19/21/25 | Adjacent but outside this bounded sample. Pilot F02 already narrowed broad trade/crafting wording. |
| GA-003 pilot + developer tooling | Same task, separate slices | Preserve their reports/index references and F01-F05. No prior finding is promoted by this audit. |

## 2. Claim ledger

All line references refer to the pinned snapshot; paths are repository-relative. **S** = `docs/STATE.md`, **P** = `docs/state/player-systems.md`. Repeated claims share a row unless a distinct contract is added. `supported (static)` is bounded code/test-assertion support, not a passing execution, runtime certification, or independent finding confirmation. `partial` needs qualification; `contradicted` has positive counterevidence. Exclusions are accounted for, not truth verdicts.

| # | Explicit claim / location | Verdict | Evidence or exclusion owner |
| --- | --- | --- | --- |
| 01 | S:69: Stages 1-3 isolated immutable catalogue, exhaustive compatibility and pure adapter; V1 definitions remain authoritative | **supported (static)** | `items/v3Equipment/catalogue.ts`:8-17 deep-freezes; `adapter.ts`:12-45 returns inactive projections/reference wrappers, not registrations; `compatibility.test.ts`:87-99 asserts all 87 IDs/targets; `contracts.test.ts`:176-188 guards production imports. Scoped to this layer, not denial of later native Stage 4 kinds (row 15). Static import search corroborates rather than solely proves isolation. |
| 02 | S:71: Inventory owns player/NPC items and is generic | **supported (static)** | `items/Inventory.ts`:171-219,426-455 owns count/instance/batch stores; :665-680,745-768 exports/restores contents. `app/createApp.ts`:1053-1059 restores player contents; `saveState.ts`:205-206,267 exports counts/instances/batches. `Inventory.test.ts`:47-63 asserts count/instance separation and round-trip. Not a full save/rebuild audit. |
| 03 | S:71: single held-tool slot owns in-hand selection | **supported (static)** | `items/HeldTool.ts`:95-145 validates Inventory ownership, replaces selection, clears on unequip/removal and re-resolves surviving instances; `HeldTool.test.ts`:8-38,58-78. This is the in-hand slot, not denial of separate worn armor/primary choices. No combat-effects verdict. |
| 04 | S:71: count/instance gifts go to a living NPC's personalInventory | **supported (static)** | `app/actions/npcItemTransfer.ts`:26-72 re-resolves stable recipient, rejects missing/dead/full, then calls `items/inventoryTransfer.ts`:19-53; UI action adapter `npcItemTransferActions.ts`:57-89. `npcItemTransfer.test.ts`:14-51,53-114 checks quantity/freshness/instance transfers and guards. Recipient equipment/use excluded. |
| 05 | S:71: NPC equipment derived at action time without persistent slots | **excluded (overlap)** | D7, items-player-064/065/066, matrix 18/20. |
| 06 | S:71: capabilities source **every** tool gate; no hand-written per-tool check remains | **partial** | Catalog core: `itemCatalog.ts`:2371-2397; `Inventory.ts`:462-474. Exception: `createApp.ts`:1134,3384 exact fishing-rod availability -> `QuickActionsScreen.vue`:349,373-377 visibility/prerequisite. **F06**. |
| 07 | S:71: UBC/outfit/pauldron/adventurer and animation/procedural pose behavior | **excluded (overlap)** | Character/rendering owners, matrix 16/17/24. |
| 08 | S:71: shared HealthState plus player stamina/vigor/hunger/thirst | **supported (static)** | `PlayerController.ts`:295-312,551-555 declares/constructs shared health, needs and skills; `gameLoop.ts`:2827-2832 reads four need pools plus HP. Existence/ownership only, not damage/injury/survival tuning. |
| 09 | S:71 / P:56: eight named skills, XP progression without levels/perks/points | **supported (static)** | `player/PlayerSkills.ts`:14-40,63-92,119-129 defines the exact skills and XP-derived values. Combat skills' existence says nothing about combat effects. |
| 10 | S:71 / P:58-60: targeted actions, Medicine injury/condition potency, forage discovery radius | **excluded (overlap)** | Injury/fauna/observation seams, Q155-Q158, matrix 11/19/20/24. Runtime selection/action-list data only are checked separately in rows 23-24. |
| 11 | S:71: actor-neutral contributeWork shared by Player/NPC construction | **excluded (scope)** | Canonical construction/work-contract section is a different ownership/lifecycle review, not traced here. |
| 12 | S:71: systemic treasure, exact keys, consumed pickups and explicit-Y cave chest/crate seams | **excluded (scope)** | World/quest/cave content/source lifecycles, matrix 14/21/25; not generic pickup atomicity. |
| 13 | S:71: force attempts, blade-trap damage and damage/fire resilience | **excluded (overlap)** | D5-D6 and incoming-hit owners, matrix 18/20. |
| 14 | S:71: merchant-horse warning, relation penalty and two-day grievance | **excluded (overlap)** | Mount/fauna/social consequence seam, matrix 12/22. |
| 15 | S:73: upper-tier ledger, unique instances/tombstones, durable-owner integrity and R-A source gate | **excluded (overlap)** | Active Stage 4/source-activation owners, items-player-062/063, Items x Combat. Isolated Stage 3 remains a distinct layer. |
| 16 | S:75,77-79: weapon numbers, maintenance/grindstone, combat/repair/durability/projectile gaps | **excluded (overlap)** | D5-D7, Q150-Q154, review 034, matrix 18/20. |
| 17 | P:48: food/water ordinary Inventory goods with catalog consumable flag | **supported (static)** | `app/actions/survivalActions.ts`:661-691 reads consumable data, checks freshness, removes inventory units and applies hunger/thirst relief. Liquid-container instances also have their own fill state. No water-geometry/health-treatment verdict. |
| 18 | P:52: flat recipes, inherited FIFO used-shelf-life/sourceSpecies, no spoilage rescue | **supported (static)** | `items/campfireCooking.ts`:16-29,37-43,82-94; `foodFreshness.ts`:267-305; live cooking `survivalActions.ts`:382-409. Fish is an additional distinct recipe, not a contradiction of P's meat examples (the domain also covers fishing). No separate crafting system inferred. |
| 19 | P:52: cooking capacity 1 bare / 2 carried pan / 4 grate, never pan+grate=6 | **supported (static)** | `campfireCooking.ts`:54-74 and `campfireCooking.test.ts`:23-75 explicitly assert capacities, grate precedence and inventory clamps. No cooking execution performed. |
| 20 | P:52: one-time persisted player-fire grate; cost 2 branch/2 stone/2 iron_rod | **supported (static)** | `app/userActions.ts`:53,193-216 re-resolves/validates before setting; `settlement/PlacedFires.ts`:102,196,263-270 stores/project flag and refuses repeats; `saveState.ts`:214 exports fire records. Visual/light behavior excluded. |
| 21 | P:52: iron_rod only from home trader; no production chain | **contradicted** | `economy/production.ts`:213-219 declares 2 iron + 1 coal -> 1 iron_rod; `npcProfessionWork.ts`:1082-1088 schedules completion; `economy/npcWork.ts`:71-82 calls shared executor. `npcTradeAvailability.ts`:84-90,224-243 exposes owned rods. **F07**. |
| 22 | P:56: XP persisted, value derived by shared curve, active runtime-only | **supported (static)** | `PlayerSkills.ts`:89-106,137-167,184-194; `saveState.ts`:256-264. Qualification: awardSkillXp is the completed-use award path, not literally every XP write. P:68 already describes the deliberate book/raiseSkillToValue path; restore/debug also write XP. No extra finding manufactured from that locally qualified wording. |
| 23 | P:58: targeted selection runtime-only and separate from active | **supported (static)** | `player/targetedSkillSelection.ts`:23-40 keeps closure-local selection with consumer guards; `PlayerSkills.ts`:184-194 resets active on restore. No pointer-lock/crosshair/gaze certification. |
| 24 | P:62: Skills Screen list derives from domain dispatch, not a Vue list | **supported (static)** | `interaction/targetedSkillAction.ts`:158-181 defines repair/traps/medicine and actionability; `ui-vue/screens/SkillsScreen.vue`:3-4,18-34 projects it and calls handlers. Rendered appearance not verified. |
| 25 | P:66: Survival shortens selected actions and improves roasted-meat hunger relief | **supported (static)** | `PlayerSkills.ts`:312-315,357-365; `survivalActions.ts`:276,686-689. Only these sampled non-combat effects; no stealth/fauna or all-consumer claim. |
| 26 | P:68: catalog book reading raises toward its target through XP; book remains | **supported (static)** | `items/books.ts`:37-65 checks metadata/thresholds and calls raiseSkillToValue; `inventoryWiring.ts`:572-590 routes feedback without removing the book. `books.test.ts`:17-46,89-104 asserts target/reread/no-lowering. No quest-reward lifecycle verdict. |
| 27 | P:184: body carry 14+strength*12; .5 -> 20kg, starting .6 -> 21.2 unrounded | **supported (static)** | `humanCarryCapacity.ts`:32-34; `PlayerController.ts`:138-143; `createApp.ts`:1053-1059. `humanCarryCapacity.test.ts`:10-26 and `Inventory.test.ts`:106-118 assert exact points. |
| 28 | P:184: Inventory Strength-agnostic, backpack additive, gabarite independent | **supported (static)** | `Inventory.ts`:188-197,228-234,344-371; `Inventory.test.ts`:73-113,332-374. Effective-Strength updates also flow through `gameLoop.ts`:2807; numeric constructor baseline does not mean frozen capacity. |
| 29 | P:186: carryCapacityBonus sums held counts; maxWeight derived/not saved | **supported (static)** | `Inventory.ts`:228-234 recomputes; `itemCatalog.ts`:1835-1843 declares backpack bonus; contents-only snapshots `Inventory.ts`:745-768 / `saveState.ts`:205-206. Multiple backpacks intentionally stack without equip slots. |
| 30 | P:177-186: item/liquid/carried-chest load feeds existing encumbrance | **supported (static)** | `Inventory.ts`:133-136,333-337 includes liquid mass; `gameLoop.ts`:2789 passes totalWeight+carriedWeightKg with maxWeight; `playerEncumbrance.ts`:32-39 computes load/capacity bands, not Strength directly. Not full container-transfer/movement certification. |
| 31 | P:21,188: armor summary, quality-aware weight and movement/encumbrance composition | **excluded (overlap)** | Changing items-player-064/065/066, matrix 18/20/24. Do not certify six-slot wording or armor effects here. |
| 32 | S:79: full Vue crafting deferred; custom orders use Blacksmith | **excluded (scope)** | Not re-audited; broad trade/crafting wording was already addressed by pilot F02. |

**Corpus limit:** selected P item/skill assertions are P:48-68 and Carry capacity P:174-188, with only minimal shared-state declarations from the earlier sections. Full SPEA/health/injury formulas, rest/lodging, busy cancellation, placement, wells/torches/houses/terrain preparation, planting, traps/fishing ecology, preservation stations, contracts, riding and corpse mechanisms are not exhaustively sampled. Row 20 checks only the directly claimed grate transaction. Counts are row granularity, not a whole-domain completeness percentage.

## 3. Candidate findings (all initially unverified)

### GA-003-F06 - universal tool-gate wording overlooks fishing Quick Actions

- **Validation:** `unverified`; **kind:** documentation overstatement / UI-data qualification. **Impact:** maintainers may assume declaring a compatible kind covers every availability surface; no currently broken fishing action demonstrated.
- **Disputed claim:** S:71: "`ITEM_CATALOG[kind].capabilities` is the single source of truth for every tool-requirement gate; there is no hand-written per-tool check left."
- **Affected symbols:** createApp::syncQuickActionAvailability and initial createQuickActions payload; store hasFishingRod; QuickActionsScreen::toolUnavailable; catalog fishing capability.
- **Code / call path:** `src/app/createApp.ts`:1134,3384 explicitly compute `inventory.has('fishing_rod', 1)`. `src/ui-vue/screens/QuickActionsScreen.vue`:349 uses this for category visibility; :373-377 explicitly makes it a tool prerequisite for category/recent actions. createApp:3429 also selects that exact rod, though selecting a concrete item is not itself the disputed requirement gate.
- **Counterevidence / alternatives:** actual held fishing gates are capability-driven (`gameLoop.ts`:2058, `interactables.ts`:1376); core queries in `itemCatalog.ts`:2371-2397 / `Inventory.ts`:462-474 exist. Only fishing_rod currently declares fishing (`itemCatalog.ts`:1507-1515), so both paths agree for current goods. Exact material/bait/provisioning recipes are intentional item requirements, not counted as tool-gate defects. If S intended only execution gates and excluded UI prerequisites, that narrower reading resolves the wording issue.
- **Confidence / limits:** high for existence of the exact-kind availability check; medium for whether S intended to cover it. Static only; no synthetic new rod, UI/browser reproduction or current missing-item claim.
- **Smallest independent verification / clarification:** trace the two payload assignments to toolUnavailable. If accepted, qualify universal wording to distinguish capability-driven action gates from this exact-kind Quick Actions prerequisite. Code unification would be separate unapproved work, not an implementation plan here.

### GA-003-F07 - current-state cooking reference retains trader-only iron-rod history

- **Validation:** `unverified`; **kind:** concrete documentation mismatch. **Impact:** readers seeking grate materials can miss an existing NPC processing/acquisition path; not proof any live Blacksmith currently has stock.
- **Disputed claim:** P:52: "`iron_rod` is a new processed-material `ItemKind`, deliberately separate from the raw `iron` resource, obtainable only from the home trader in this plan (no smelting/production chain)."
- **Affected symbols:** BLACKSMITH_IRON_ROD_PRODUCTION, planBlacksmithWork completion, commitBlacksmithProduction, resolveNpcTradeOffers, cooking/grate reference.
- **Positive code/test trace:** `src/economy/production.ts`:213-219 defines settlement-stock inputs iron:2/coal:1 and item output iron_rod:1. `src/ai/npcProfessionWork.ts`:1019-1020 checks live inputs; :1082-1088 schedules ordinary work with commitBlacksmithProduction completion. `src/economy/npcWork.ts`:71-82 calls executeProduction with household.items, so this is not merely an unused definition. `src/economy/productionExecutor.test.ts`:280-303 asserts exact input debit/output credit. `src/ai/npcTradeAvailability.ts`:84-90 allowlists household rods; :224-243 projects owned offers. `npcTradeAvailability.test.ts`:79-94 asserts offered rod quantities. S:53 also describes production-output trade.
- **Counterevidence / alternatives:** "in this plan" and matching old catalog notes (`itemCatalog.ts`:657-658) plausibly describe original plan-175 scope. However P:3,9 expressly defines a **current-state reference**, not a history log. This is a stale present-tense qualification, not an assertion of direct player smelting, unlimited inputs, guaranteed market stock, or every NPC selling arbitrary belongings. Raw iron and processed rods remain distinct.
- **Confidence / limits:** high for recipe/completion/trade-path mismatch. Tests read, not run; no live economic simulation, stock or timing observed. Trace ends at existing shared executor/offer boundary, not an economy or combat-artisan redesign.
- **Smallest independent verification / clarification:** compare P:52 with recipe -> scheduled profession completion -> shared executor -> explicit owned-stock offer test. If accepted, distinguish the historical trader shortcut from implemented NPC processing/owned-stock availability. No source/catalog-note correction is authorized by this report.

## 4. Negative results / verification limits

- Generic Inventory, count/instance separation, freshness, single held slot, guarded gifts, additive backpack capacity and liquid-inclusive load have positive current source/test support in the sampled flows. This is not independent acceptance of every old item-lifecycle finding or certification of every caller.
- No missing player inventory persistence, second UI-owned inventory, broken backpack stacking, lost gift or failing cook/book action established. Count APIs deliberately do not include instances; that is not a mismatch by itself.
- Stage 3 adapter remains inactive despite later native intake. No blanket "V3 intake absent" or stale-import finding. Book learning is already a documented exception to completed-action XP awards, not proof XP-only persistence is false.
- Tests/type-check/lint/build/browser/game/benchmark: **not run**. Only static reads/searches/status/history/hash guards. No runtime/visual/performance defect marked confirmed.
- Pull deliberately skipped because of protected dirty audit docs. No unresolved blocker prevented delivery. Only report/QUEUE/index authored; STATE/domain docs, src, plans, Revival queue and matrix untouched.

## 5. Metrics and validation handoff

| Mutually exclusive ledger verdict | Count |
| --- | ---: |
| supported (static) | 19 |
| partial | 1 |
| contradicted | 1 |
| unclear | 0 |
| excluded (overlap) | 8 |
| excluded (scope / already covered) | 3 |
| **Total rows** | **32** |

21 rows receive bounded static verdicts; 11 exclusions are accounted for, not verified truth. Nonsampled domain sections are listed after the ledger.

| Finding metric | Value |
| --- | --- |
| New findings | 2 (F06-F07) |
| Independently confirmed / rejected / unverified | 0 / 0 / 2 |
| Cumulative GA-003 including unchanged prior slices | 7; 0 / 0 / 7 at delivery |
| False-positive share rejected/(confirmed+rejected) | N/A (0 independently resolved) |
| Independent reviewer / method | Not assigned / not performed |
| Meaningful candidates | One tool-gate overstatement and one historical acquisition shortcut retained as current; no new runtime-defect claim |
| Scope violations | 0 identified; docs audit outputs only, no prohibited checks or parallel agent |
| Approximate independent-review effort | Not spent; estimated 15-20 minutes for two static traces, not measured reviewer time |

| ID | Status | Independent reviewer | Verification pending |
| --- | --- | --- | --- |
| GA-003-F06 | `unverified` | - | Decide whether universal wording includes Quick Actions; trace exact-kind UI availability versus capability execution. |
| GA-003-F07 | `unverified` | - | Compare current wording with recipe/completion/executor/owned offers; preserve historical-scope counterreading. |

Independent disposition is per finding. Acceptance would not approve documentation corrections, implementation, plans, priority changes, commits/pushes or another audit.

# GA-003 — STATE deferred-section consistency audit

- **Task:** GA-003 (first pilot), explicitly authorized by Jan Madeyski on 2026-11-06; Windows Shell execution confirmed in the same conversation.
- **Date:** 2026-11-06 (Europe/Warsaw, CET).
- **Repository / branch:** `jm-sky/seedvale-v1` / `main`.
- **Pinned SHA:** `a75dcdfb29cd95d9634f5c87f6943daa428f44be`.
- **Auditor / environment:** Grok Bot executor; native PowerShell on S661L, Windows checkout `D:\Projekty\private\seedvale-v1`. Model/provider identity is not asserted.
- **Report lifecycle:** `review needed`.
- **Finding validation:** GA-003-F01 and GA-003-F02 both `unverified`; no independent reviewer yet.

## 1. Scope, preflight and stopping criteria

Audit only [STATE.md lines 176–189](../../STATE.md#not-implemented--intentionally-deferred), against source/test contracts at the pinned SHA. Every one of its **12 bullets** is accounted for below. This is documentation evidence, not an implementation plan or a system-level review. Stop after recording the claim-level results and candidate findings and updating only the audit queue/index. Do not edit STATE, source, plans, Revival priorities or the System Review Matrix.

### Checkout and authorization

- Initial `git status --short --branch`: `## main...origin/main`, with no changed/untracked paths. `git rev-parse HEAD` returned the SHA above; branch was `main`.
- `git pull --rebase` was deliberately **not run** (optional); pin the already clean local snapshot rather than move the baseline. Remote freshness was not independently fetched or asserted.
- Read root `CLAUDE.md` / `AGENTS.md`, the Grok workspace rules, queue and report-index conventions; checked the Revival index, Strategic Brief decision section, live session queue and System Review Matrix. Only root agent-rule files were listed by Git.
- Rechecked clean status, branch and unchanged HEAD immediately before authoring. No cloud/parallel agent was launched, and no unrelated local edits were present. A clean tree is not proof that no agent exists elsewhere; this audit does not make that assertion.
- Native Windows Shell was used for checkout reads/writes. No WSL access, browser, dev server, benchmark, stash, commit or push. `rg` was unavailable; subsequent bounded searches used native `git grep` / PowerShell `Select-String`. No package installation was needed.

### Collision record and deliberate narrowing

| Active/prior work | Matrix areas | Treatment here |
| --- | --- | --- |
| Combat side track Q150–Q154; plans items-player-067 / fauna-051; [review 034](../../reviews/2026-11-05--034--items-player-067-fauna-051-combat-plans-review.md); Items × Combat side initiative | 20; related 18/17 | Bullets 1, 2, 8 and 9 excluded in full. No combat resolver, weapon wear, armor or projectile correctness audit. |
| Fauna-050 Q139/Q141–Q145 and review-035 response Q159–Q163, including upcoming durable wild records | 11, 12, 15 | Bullet 3 excluded; animal half of bullet 4 excluded. [Review 035](../../reviews/2026-11-06--035--continent-wide-wild-fauna-architecture-review.md) already owns the continuity seam. Do not turn planned record persistence into a current-code claim. |
| Geography program Q111–Q130, Q119/Q122 frozen inputs; far terrain Q146–Q148 (F1 landed, F2 look/direction deferred); commissioned geography/rendering/performance reviews | 01, 02, 16; review 031 | Bullet 11 excluded. No far-terrain or distant-mountain completion/visual verdict. Bullet 10 checks only the stable planar coordinate/boundary contract, not generator quality, relief or hydrology. |
| Q107 / Q13 shared-recipe crafting recon and merchant/economy reconciliation; open merchant plans | 07, 09, 10, 18 | Bullet 7 narrowed to existence and callsites of food export and player cooking, not economy completeness, trade balance, future crafting design or merchant failure semantics. |
| Voice/casting Q88–Q90/Q40 and weather remarks Q46 | 08, 22 | Bullet 5 checks social-place ownership and partner selection/outcome only, not new dialogue, casting, voice quality or future social simulation. |
| Quest/progression backlog; [quest architecture recon](../../reviews/2026-09-13--quest-system-architecture-recon.md) | 21 | Bullet 6 distinguishes current authored/rule-materialized definitions from LLM generation, without auditing quest design/completeness. |
| Existing UI migration/reskin work and [review 026](../../reviews/2026-10-26--026--v1-revival-cursor-technical-review.md) | 24 | Bullet 12 checks one real remaining DOM screen and a Vue adapter counterexample only; no UI/visual/browser review. |

Prior relevant evidence, not independent validation of this report: [NPC/social domain audit, 2026-09-19](../../reviews/codebase-domain-audit/2026-09-19--14--npc-social-households-and-dialogue.md), especially its memory/continuity boundaries; [Revival R4 gameplay research](../../research/v1-revival/2026-10-25--004--gameplay-systems.md), which already distinguishes general recipe crafting from cooking and NPC-mediated production. New runtime discoveries are not claimed.

History checked: path-scoped `git log` for STATE and selected source paths, plus deferred-claim text history. Relevant anchors include `8da9633d` (NPC personal inventory), `8a9d1a20` (inter-settlement food transport), `e2ffca2e` (travelling merchant), `0278c52c` (finite 12 × 12 km world), `f3f01284` / `f4e4fd28` (far-terrain changes), and `2797ac55` (later NPC save changes). Old wording is not evidence of a present defect; conclusions below use current source. No broad intervening-history completeness claim is made.

## 2. Method and verdict vocabulary

Extract the whole heading block; quote every bullet; navigate from CODE_INDEX to bounded current entry points, follow their consumers/serialization, read relevant test assertions, and check plausible narrower interpretations before emitting a finding. Evidence order: code/tests > reviews/notes > plans > state > vision.

`confirmed deferred` means the **inspected current implementation boundary supports the deferred statement**; it is not an independently confirmed finding, proof of feature absence throughout every possible extension, or runtime verification. `partial` means the compound/broad wording mixes implemented and deferred meanings. `contradicted (implemented)` would require the stated feature itself, not merely a related helper. `unclear` means insufficient bounded evidence. `excluded (overlap)` is no verdict on truth.

## 3. Per-bullet ledger (12/12 accounted for)

All line numbers refer to the pinned snapshot. Source links are repository-relative; use the pinned SHA when reviewing after later changes.

| # / STATE line | Exact deferred bullet | Verdict | Current evidence / boundary |
| --- | --- | --- | --- |
| 1 / 178 | Player melee/ranged cannot damage an NPC — only animals are hit-test candidates today; an `[E]` on an NPC opens dialogue instead. See [combat.md](../../state/combat.md). | **excluded (overlap)** | Combat Q150–Q154 / matrix 20. No source verdict. |
| 2 / 179 | Fauna's own outgoing attacks use a flat per-attacker-kind damage table rather than the shared melee/ranged/critical/defense pipeline — see [combat.md](../../state/combat.md) and [fauna.md](../../state/fauna.md). | **excluded (overlap)** | Combat/fauna encounter seam, matrix 20/11. No source verdict. |
| 3 / 180 | Individual ordinary wild fauna are never persisted (only the population is deterministically reconstructed); explicitly declared persistent habitat occupants are the sparse exception. Rats persist per individual plus a settlement infestation record. See [fauna.md](../../state/fauna.md#persistence-classes). | **excluded (overlap)** | Review 035; Q159–Q163 durable-record work / matrix 11/15. Neither approve the current claim nor substitute planned behavior. |
| 4 / 181 | NPC/animal execution state (pending action, pathfinding, combat intent, carried inventory) is never persisted and resets on every reconstruction. | **partial** | NPC transient execution/work `carried` remains explicitly distinct from persisted `personalInventory` and `transportCargo`: [npcState.ts](../../../src/settlement/npcState.ts):85–96, 106–111, 157–165, 279–301, 424–455. Save/rebuild consumers and round-trip assertions establish the implemented exceptions. Wording is ambiguous, not proof that transient execution is persisted. **F01**; animal half excluded. |
| 5 / 182 | Social Places beyond a settlement's own campfire; conversation partner selection/ranking by personality/traits/role/relationship; group conversations; social interaction memory entries. | **confirmed deferred** | [places.ts](../../../src/settlement/places.ts):56–83 wraps only the local campfire; production [createSettlement.ts](../../../src/settlement/createSettlement.ts):1042–1045, 1815. [socialBehaviour.ts](../../../src/ai/socialBehaviour.ts):71–87, 188–245 uses same-place lowest-id pairing and a two-party reservation; outcome changes a relationship, not a conversation-memory record. [NpcAgent.ts](../../../src/ai/NpcAgent.ts):7147–7201 has one partner and completion callback. Personality changes cooldown/outcome, **not partner rank**. Tests: [socialBehaviour.test.ts](../../../src/ai/socialBehaviour.test.ts):38–45, 226–255. Existing relationship/grave-visit/follow-up records are not generalized conversation memories. |
| 6 / 183 | LLM/AI-generated quests. | **confirmed deferred** | Read in its LLM/generative-AI sense. The live composition builds authored definitions and rule/materialized opportunities, then injects the array: [createApp.ts](../../../src/app/createApp.ts):1464–1466, 1568–1594, 1782, 2107–2111; [worldQuestMaterialization.ts](../../../src/quests/opportunities/worldQuestMaterialization.ts):312–345 has synchronous collect/select/materialize flow; [QuestManager.ts](../../../src/quests/QuestManager.ts):689–718 takes concrete `QuestDef[]`. Rule-generated quests **do exist**, e.g. deterministic assertions in [rpgQuestMatrices.test.ts](../../../src/quests/opportunities/rpgQuestMatrices.test.ts):204–208. Those are not evidence of LLM text generation. Bounded no-provider searches were corroborative, not proof of absence. |
| 7 / 184 | Inter-settlement trade and player crafting. | **partial** | Inter-settlement **food logistics** is implemented: [interSettlementFoodTransport.ts](../../../src/economy/interSettlementFoodTransport.ts):86–130 → [npcProfessionWork.ts](../../../src/ai/npcProfessionWork.ts):924–966, 975–991, 1328 → transport order / merchant-journey machinery. This does not establish a priced general market. Player cooking is implemented in [survivalActions.ts](../../../src/app/actions/survivalActions.ts):345–415; [campfireCooking.ts](../../../src/items/campfireCooking.ts):6–9 explicitly calls this a flat processing table, not a crafting system. General recipe crafting is not established by these paths. **F02** (qualification candidate, not a completed-trade/crafting claim). |
| 8 / 185 | Full combat system for the player — see [state/combat.md](../../state/combat.md) for exactly what exists vs. what's missing. | **excluded (overlap)** | Combat side initiative / matrix 20. “Full” is not independently defined or audited here. |
| 9 / 186 | Weapon repair/broken lifecycle, general tool durability (shovel/pickaxe), bow durability/sharpness, arrow recovery, 3D projectile visuals. | **excluded (overlap)** | Combat / item-maintenance / projectile seam, matrix 18/20/17. Exclude the whole compound bullet instead of selectively auditing changing weapon contracts. |
| 10 / 187 | Cube-sphere / fully spherical world architecture. | **confirmed deferred** | Current production shape is a finite planar XZ continent: [continentMask.ts](../../../src/terrain/continentMask.ts):5–15, 29–30; applied in [chunkHeightmap.ts](../../../src/terrain/chunkHeightmap.ts):528, 573, 636. [worldEdge.ts](../../../src/terrain/worldEdge.ts):21–31 tests/clamps X and Z independently, rather than wrapping a spherical surface. [continentMask.test.ts](../../../src/terrain/continentMask.test.ts):13–39 asserts finite-continent contracts. This is an architecture-presence check only; no geography quality or movement/runtime claim. |
| 11 / 188 | Distant background mountains. | **excluded (overlap)** | Geography/rendering Q146–Q148 and commissioned scope, matrix 01/16. Recent far-terrain commits make the wording a known overlap to leave with those owners, not a newly audited finding. |
| 12 / 189 | Full Vue migration of all existing UI. | **confirmed deferred** | One positive counterexample to “all migrated” is sufficient: production [createApp.ts](../../../src/app/createApp.ts):499 constructs [createLoadingScreen.ts](../../../src/ui/createLoadingScreen.ts):32–55, which builds/appends real DOM elements. Vue itself is mounted at createApp:621. Do **not** infer unmigrated screens from old paths alone: [createQuestLog.ts](../../../src/ui/createQuestLog.ts):14–28 and [createMinimap.ts](../../../src/ui/createMinimap.ts):16–21 are Vue compatibility facades. No comprehensive migration percentage or visual verdict. |

## 4. Candidate findings (all initially unverified)

### GA-003-F01 — “carried inventory” does not name the NPC persistence boundary precisely

- **Validation status:** `unverified`; **kind:** documentation ambiguity / partial mismatch; **impact:** low (onboarding and save-ownership interpretation), not a demonstrated save-loss defect.
- **Disputed claim:** STATE:181, quoted in ledger row 4: execution state, including “carried inventory”, “is never persisted and resets on every reconstruction.”
- **Affected paths/symbols:** `NpcAuthoritativeState`, `NpcStateSnapshot`, `fromSnapshot`, `createNpcStateRegistry.serialize`, `NpcAgent.personalInventory` / `transportCargo`; precise evidence below.
- **Current contract/evidence:** npcState:85–96 explicitly reserves private `carried` for transient work payload, while personal belongings and transport cargo have separate authoritative owners. Serialization at npcState:441–443 captures their contents; hydration at :295–297 reconstructs them. NpcAgent:1870–1871 references those same authoritative containers.
- **Callsites / actual usage:** [SettlementsManager.ts](../../../src/settlement/SettlementsManager.ts):1675–1680 returns `npcStates.serialize()`; [app/saveState.ts](../../../src/app/saveState.ts):345 places that snapshot in saved `npcStates`; [worldBundle.ts](../../../src/app/worldBundle.ts):2823, 2888 carries NPC snapshots across a non-reset rebuild. These are not unused snapshot helpers.
- **Test evidence read, not executed:** [npcState.test.ts](../../../src/settlement/npcState.test.ts):277–287 preserves meat/coin counts after serialize/hydrate; :299 onward covers physical belongings; :368–386 preserves cargo and freshness across reconstruction.
- **Alternatives/counterevidence checked:** “carried inventory” may mean exactly private `NpcAgent.carried`, not all held items. Under that narrow reading the code agrees; pending action/pathfinding/combat intent remain execution-local. Therefore **do not report that NPC FSM/path/combat execution is persisted**, and do not classify the entire bullet as contradicted. The animal half is excluded because of review 035.
- **Confidence:** high for the explicit container/save distinction; medium that the informal STATE wording warrants correction rather than reader clarification.
- **Smallest independent verification / wording candidate:** inspect the cited serialization/hydration and assertions at the pin; if approved, qualify “carried inventory” as “transient NPC work payload (`NpcAgent.carried`)”, with an explicit exception for `personalInventory` / `transportCargo`. No wording or code change was applied outside this report.

### GA-003-F02 — the trade/crafting blanket bullet needs narrower feature names

- **Validation status:** `unverified`; **kind:** documentation scope ambiguity / partial mismatch; **impact:** low (existing bounded capabilities can be overlooked), not a demonstrated economy or crafting failure.
- **Disputed claim:** STATE:184, “Inter-settlement trade and player crafting.”
- **Affected paths/symbols:** `matchInterSettlementFoodOpportunity`, `planTraderInterSettlementExport`, `planTraderWork`, `planProfessionWork`, `startCookAt`, `COOKING_RECIPES`.
- **Current contract/evidence:** interSettlementFoodTransport:86–130 matches source surplus and destination shortage to actual food kinds/quantity. npcProfessionWork:954–966 creates an A→B settlement-storage `TransportOrder`, starts the merchant journey and returns its execution action. The `trader` branch at :1328 reaches `planTraderWork`, whose :990–991 invokes export. Player `startCookAt` at survivalActions:345–415 revalidates inputs, removes food and adds cooked output; this is real processing, not a catalog-only recipe stub.
- **Callsites / ownership:** trader professions reach the order path above; cargo is NPC-owned, the order owns the delivery commitment, and [merchantJourney.ts](../../../src/settlement/merchantJourney.ts):5–11, 71–85, 107–150 handles visit/return semantics. The player cook-meal entry is wired in [createApp.ts](../../../src/app/createApp.ts):3334, 3436. No additional runtime integration claim is made.
- **Test evidence read, not executed:** [interSettlementFoodTransport.test.ts](../../../src/economy/interSettlementFoodTransport.test.ts):56–78 creates one A→B opportunity; [npcProfessionWork.test.ts](../../../src/ai/npcProfessionWork.test.ts):1297–1339 checks actual destination-bearing orders through `planProfessionWork`; [campfireCooking.test.ts](../../../src/items/campfireCooking.test.ts):24–40, 85–92 covers capacity and fish output selection.
- **Alternatives/counterevidence checked:** food export is **not evidence of priced commercial exchange, arbitrary goods trade, or a complete regional economy**. Cooking is **not general recipe crafting**: campfireCooking:6–9 expressly says “not a crafting system”. `Inventory.applyRecipe` consumers are production-executor/NPC paths, not evidence of a player recipe workflow. R4 research already makes the general-crafting distinction. A narrow reading of the bullet as “general trade/general recipe crafting” may therefore be correct; the issue is the missing qualification.
- **Confidence:** high that bounded food logistics/player processing exist; medium that the author's intended meaning of “trade” includes these capabilities. No blanket “implemented” verdict.
- **Smallest independent verification / wording candidate:** trace the cited Trader dispatch to its order, and inspect player cooking plus the explicit non-crafting comment. If accepted, distinguish “general/priced inter-settlement trade” and “general player recipe crafting” from already implemented food export/cooking. Do not promote this into an implementation task automatically.

## 5. Negative results, checks and limits

- No clear whole-bullet `contradicted (implemented)` verdict was justified within the non-overlapping scope. Two compound statements require qualification, not replacement with a claim of full feature completion.
- Existing campfire conversation, personality-dependent cooldown/outcome and persistent relationships are not counterexamples to deferred **partner ranking**, group conversations or a generic social-interaction memory store.
- Rule-generated quest definitions are not LLM-generated quests. Synchronous concrete-template/materialization flow is positive evidence; a no-match search for provider/network terms alone would not establish absence.
- Existing Vue imports/adapters do not establish full migration; the live DOM loading screen provides the relevant concrete boundary.
- **Tests actually run: not run.** Only the cited test source/assertions were inspected. No type-check, lint, build, save-roundtrip execution, game runtime, browser/visual or performance checks. Do not reuse historical passing-test claims as results of GA-003.
- No complete absence/dead-code claims, no findings on animal persistence, combat, far-terrain correctness or commissioned system-review scope. No implementation recommendations beyond the smallest documentation clarification needed to validate each finding.
- No blocker prevented the report. Exclusions are intentional scope protection, not successful verification. Audit-only scope leaves the workspace overview's historical “no runs authorized / index empty” text untouched because that file was not an authorized deliverable; the queue and report index record this run.

## 6. Pilot metrics and independent-validation handoff

### Claim-level coverage (mutually exclusive bullet counts)

| Verdict | Count |
| --- | ---: |
| confirmed deferred | 4 |
| contradicted (implemented) | 0 |
| partial | 2 |
| unclear | 0 |
| excluded (overlap) | 6 |
| **Total bullets accounted for** | **12** |

Bullet 4 counts once as `partial`: only its NPC wording was inspected; its animal half remains excluded. Excluded bullets are not counted as checked/confirmed truth. Four supported boundaries + two qualified compound statements = six substantively checked bullets; six others are ledgered/excluded.

| Finding-validation metric | Value |
| --- | --- |
| Findings emitted | 2 |
| Independently confirmed | 0 |
| Independently rejected | 0 |
| Unverified | 2 |
| False-positive share `rejected / (confirmed + rejected)` | **N/A until independent validation** (0 resolved findings) |
| Independent reviewer / method | Not assigned / not performed |
| Meaningful newly surfaced candidates | 2 summary-wording qualifications; **0 claimed new runtime discoveries**; underlying capabilities already documented elsewhere |
| Missed / unchecked claims | No omitted bullet; six full exclusions plus the animal half of row 4 not substantively checked; no full gameplay/system coverage |
| Scope violations | 0 identified; no runtime/source edits, parallel agents or prohibited verification |
| Approximate independent-review effort | Not yet spent; estimated 15–25 minutes to inspect the two bounded traces/tests and decide intended terminology (estimate, not measured reviewer time) |

### Per-finding validation log

| ID | Status | Independent reviewer | Validation method / evidence |
| --- | --- | --- | --- |
| GA-003-F01 | `unverified` | — | Awaiting review of NPC `carried` vs authoritative inventory meaning and snapshot consumers. |
| GA-003-F02 | `unverified` | — | Awaiting review of “trade/crafting” terminology against implemented food export and cooking boundaries. |

An independent reviewer may confirm or reject either wording concern without accepting any runtime claim. Report acceptance does not authorize documentation fixes, implementation, plan creation, priority changes or another audit.

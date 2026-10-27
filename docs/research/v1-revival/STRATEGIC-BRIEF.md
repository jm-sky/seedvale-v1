# Seedvale V1 Revival — Strategic Brief for Claude Opus 5.5

**Created at:** 2026-10-26  
**Created by:** ChatGPT Sol  
**Updated at:** 2026-10-27  
**Updated by:** Codex (approved-decision reconciliation)  
**Status:** Current author-agreed direction; Revival D1/D3/D4/D9 approved on 2026-10-27. Other roadmap proposals remain unapproved. Earlier author-authorized Cursor exceptions are recorded below and are subject to the current D4 integration freeze.  
**Target:** `jm-sky/seedvale-v1`

## 1. Start here: mandate and authority

Claude Opus 5.5 owns later coordination, detailed planning, AI-agent documentation optimization and technical review of Cursor changes. Its proposed phases, order, dependencies and verification criteria for **remaining work require author discussion and approval** before execution, except where the approved Revival decisions below settle direction or sequencing. The author separately authorized Cursor's NPC/player model transfer and shoulder repair, snow patches/grass burial, documentation cleanup and accepted UI slices A–C. These are bounded exceptions to the original Opus-first workflow, not blanket implementation approval. D4 now governs further integrations, including previously authorized work. After approval, routine technical decisions are autonomous; return to the author for scope changes or significant compromises, particularly degraded appearance, simplified simulation or omission of an agreed feature.

This brief records explicit author decisions from the strategic conversation. It is the entry point for revival scope, not a technical design or implementation acceptance report. Current code remains authoritative for what exists. Follow [CLAUDE.md](../../../CLAUDE.md) and use the repository's targeted navigation workflow.

Read this brief first. Consult the relevant research sections through §7 as needed; do not load the entire dossier by default or repeat broad reconnaissance. R1–R7 are evidence and candidates, **not an approved backlog**. Their older open author questions are answered only where this brief explicitly resolves them. Unmentioned candidates remain unselected, not rejected.

Astra/ChatGPT may coordinate bounded research, comparison and review, including GPT 6.1 Sol work, to prepare evidence. This does not transfer detailed implementation planning from Opus. Communicate with the author in Polish and use described survey choices for strategic questions; repository documentation remains English.

## Approved Revival decisions (2026-10-27)

This is the authoritative author decision record for **Master Roadmap D1/D3/D4/D9** (not the similarly numbered UI or area-audit questions). These are final strategic decisions; they do not approve every proposed mechanism or authorize implementation in this documentation task. Earlier unrelated author decisions remain in force, with further integration subject to D4.

| ID | Status | Author-approved direction |
| --- | --- | --- |
| **D1** | **APPROVED** | Prepare future `persistence-008`: separate save-format evolution from explicit `worldgenVersion` / epoch compatibility. Current code at V1 `c0595d1`: `CURRENT_SAVE_VERSION = 56` in [saveData.ts](../../../src/persistence/saveData.ts); **v57 is the current proposal**, not implemented. Clearly refuse incompatible pre-Revival saves with an understandable message; compatible new saves must round-trip correctly. Planning/documentation authorized; no immediate implementation or formal plan creation in this task. |
| **D3** | **APPROVED** | Coordinate incompatible generation changes into **one planned Revival epoch**, minimizing repeated new games. Settlement spacing/routes and procedural cemeteries are coordination examples, not blanket feature approval. D2 name mappings remain undecided. Keep unrelated UI, equipment, graphics and simulation outside this epoch; compatible fixes may proceed independently only when D4 permits. |
| **D4** | **APPROVED — PERFORMANCE-FIRST** | Complete **A NPC/fauna rendering, B settlement rendering/draw calls, C grass/flowers optimization** before unrelated performance-affecting integration. This **supersedes gated parallel lanes**; parallel work is optional, not a priority. Pause integrations that change the measured runtime/workload; documentation, research, architecture, formal planning, tests, non-runtime tooling, inert assets/data and isolated UI demos may continue only without benchmark effects. Other branch preparation is allowed, with merge deferred. Runtime armor, worldgen and atmosphere outside A/B/C wait. |
| **D9** | **APPROVED — V1 first** | **C0 credible baseline → CA1 remove filler generation outside its useful radius → CA2 cap generation/storage of instances that current LOD cannot submit → evaluate → consider V3 tiled backend only if evidence warrants.** No V3 prerequisite for CA1/CA2. Preserve V1 terrain/simulation authority, world identity/determinism, coverage/richness, fog/visibility, olive palette, intended softer blades and decorative billboard flowers. Appearance planning may continue; reduced density is not approved. V3 remains a conditional candidate. |

**D4 operating policy:** establish a stable reference build and certified A/B/C baseline with unrelated performance-affecting integrations paused. Preserve baseline SHA/device/configuration/workload/reports and reuse it while comparable; a new SHA alone does not invalidate it. Use focused regression tests during implementation, measure to decide meaningful keep/revert questions, batch independently reversible candidates in measurement sessions where practical, diagnose regressions selectively, and document a final combined result. No automatic full-suite rerun after every commit/stage or exception; never claim gains from incomparable versions/configurations.

Freeze exit requires the approved A/B/C scope **completed or explicitly closed**, appropriate technical and visual verification of accepted changes, and the combined performance result recorded. Optional ideas must not prolong the freeze indefinitely. Then other Revival implementation may resume with verification appropriate to its scope. Necessary critical correctness/security/blocking fixes may be exceptions: record why they cannot wait, workload impact, affected commit and whether a targeted measurement is actually needed. Detailed boundaries, entry/exit and benchmark handling: [Master Roadmap §4](./2026-10-27--master-revival-roadmap.md#4-strategy--performance-first) and [§10](./2026-10-27--master-revival-roadmap.md#10-benchmark-policy-and-intake).

**Still unapproved:** D2 names; D5/D6 body-hit/armor balance; D7 guard equipment; D8 reflections; D10 actor far detail; D11 outfit material/merge; D12 rescue-dog plan split; D13 small settlement details in reflections; D14 tree wind. Additional area-specific decisions remain open. A recommendation marked “Yes” is not approval.

## 2. Primary goals and preservation boundaries

**Primary goals:** smoother, more convenient play and improved atmosphere. D4 now gives A/B/C rendering performance the first implementation phase; unrelated performance-affecting Revival integration follows its completion.

- Reference device: author's **DELL Pro Premium with Intel Arc**. Exact GPU, resolution and settings remain to be recorded before measurements.
- Target: **50–60 FPS**, with roughly **45–60 FPS acceptable**, not at any visual cost. Evaluate travel stutters separately from average FPS; detailed measurement thresholds belong in Opus's proposed plan.
- Current V1 visibility distance and strong distance fog are acceptable. Increasing draw distance is not a goal.
- Accepted compromises: simpler distant objects and cheaper/lower-frequency shadows or reflections **without noticeable disturbances**. Reduced vegetation density has not been approved.
- Preserve V1's interconnected living-world behavior, concrete economy and ownership, character identity and atmosphere. No blanket architecture replacement or simplification of simulation is authorized by a performance goal.
- **Compatibility with pre-revival saves/worlds is not required; a new game is acceptable.** New games must still save/load correctly. This does not authorize arbitrary deletion of persistence infrastructure or silently accepting incompatible data; D1's dated record establishes the separate save-format/worldgen versioning direction; its detailed design remains future planning.
- Broad geography changes are permissible if they improve exploration, but are not an objective in themselves and do not select a donor generator.

## 3. Agreed product direction

### Geography and travel

V1 exploration is already a good baseline. Aim for approximately **10–15% longer comparable inter-settlement journeys**, primarily by slightly increasing settlement separation, while preserving a similar overall pace. This is an experiential target, not an instruction to scale every world coordinate or multiply the reported `280` settlement-grid pitch by 10–15%. Parameter selection requires comparable route/travel evidence; see the [completed comparison](./2026-10-26--clouds-settlement-spacing-comparison.md).

The author reports that existing animal and landmark distribution already populates the space. Longer travel should convey a larger world and may expose the player to more danger. **Do not invent a separate content-density or guaranteed-encounter program to fill the added distance.** Check route generation, crossings, transport, NPC travel and provisioning implications before choosing the change.

### Atmosphere, models and cemeteries

Priority atmosphere areas:
1. More convincing **water**, preserving the distinct character of lakes and rivers.
2. Coherent **wind** across grass, vegetation and water; tree motion is conditional on acceptable quality and cost.
3. Improved **settlements and characters** through selective model/outfit/detail replacement, retaining successful V1 assets, style and inhabitants' identities.

These remain selected product priorities; further runtime changes outside A/B/C are deferred under D4.

**Cemeteries:** improve them using V2 as the reference: individual graves with plaques and **one or more larger crypts**, with crypt count related to settlement size. Exact layout and sizing remain for Opus. Crypt interiors and additional quests have not been selected.

**Clouds — selected:** adapt V3 clouds into V1 **without an A/B comparison requirement**. Retain ordinary integration verification for weather transitions, day/night, atmosphere, lifecycle and obvious regressions. Performance improvement is unmeasured; do not claim a measured win or restore A/B as a prerequisite. Adapt the technique within V1 atmosphere ownership rather than importing the entire donor atmosphere.

A lightweight moon and stars aligned with world cardinal directions remain a desired future feature. Snow was not among the initial priorities, but the author separately authorized Cursor's snow patches/grass-burial slice. It is implemented with verification qualifications in [world-terrain-053](../../plans/world-terrain-053-snow-patch-thresholds-and-grass-burial.md); this does not select a broader winter program.

### UI and equipment

- **The UI should eventually follow V3's design**, delivered in stages, with one explicit exception: **do not migrate V3 Player–NPC dialogue UI/UX** (author decision, 2026-10-26); retain V1 dialogue, with any later visual redesign separately agreed. Reuse suitable Vue components where useful; retain V1 data and commands.
- **Quick Actions uses its own V1 adaptation**; Stage C borrows V3 MenuPanel chrome, not a donor Quick Actions system. Keep V1 categories/actions and interaction verification. No V3 conversation screen/design is selected.
- UI consultation selected **item details first** and **current V1 equipment mechanics**. Stages A–C are now implemented, with author visual PASS recorded in their owning proposals/plans; this is not proof of all gameplay checks. D2 selects kind-list + two-column list/equipment; Stage B's later nested details modal supersedes Stage A-only navigation descriptions. Unavailable controls retain their layout, native disabled state and truthful reasons. Original D4 uses `opacity-5`; **Stage C explicitly supersedes it for Quick Actions chips with muted readable chrome**, adjacent reasons (Recent: tooltip). Do not generalize that exception to every screen. Missing metrics remain labeled unavailable, never invented. Read the [newer decision register](./2026-10-26--ui-migration-research.md#5-author-decision-register) and accepted proposals before planning another screen.
- Equipment comparison is an expected benefit. Displays and previews must reflect actual game effects.
- **Layered armor and body-area protection are selected gameplay changes**, not only a body-diagram presentation.
- Player and NPC equipment must provide comparable protection under shared rules where combat exists.
- Preserve current combat controls initially; change only what the equipment/protection integration needs. Active parry/dodge and new permission to attack inhabitants are not automatically included.
- A transitional delivery is acceptable: **working equipment mechanics and UI first, matching character appearance later**. Visual mismatch is temporary; the exact final representation contract remains to be specified.
- Obtain new armor through existing trade, artisans, appropriate loot and rewards. **A new general player crafting system is outside the agreed scope.**
- Opus owns slots/layers/damage rules, balancing and integration design. No wholesale adoption of V3's item authority or combat model is implied. Do not import the whole V3 catalog: nails and unnecessary NPC-only tool additions are excluded. The [comparison's eight armor candidates](./2026-10-26--ui-equipment-v1-v3-comparison.md#selective-item-recommendations-and-exclusions) are recommendations, neither a mandatory list nor a limit.

- **Demonstration screens are also required** (author decision, 2026-10-26): reuse the same adapted UI components in isolated, clearly labeled demos without starting the world. Begin with item details; demo fixtures/simulated callbacks must not affect live game state or count as gameplay verification. See [D9 and the draft stages](./2026-10-26--ui-migration-research.md#standalone-demonstration-screens--author-scope-addition). A–C demos have landed under their accepted slices; later screen implementation still requires applicable approval.

### Voices, cast and selected stories

**First audio stage:** use suitable existing recordings, including newer batches and dedicated Mark Hornblower material. Missing recordings can remain text-only at this stage.

**Longer-term audio direction:** key NPC–player dialogue, short NPC–NPC exchanges, and vocalization varying with NPC/player relations and reputation. Derive behavior from actual relationship/reputation state; detailed coverage and production are not yet planned. English is optional and mixed languages are acceptable; no automatic conversion to English.

**Author-requested NPC voices/dialogue recon scope (2026-10-27; pending investigation, not an approved implementation plan):**

- Verify how actual NPC–player dialogue text and voice selection reflect relationships, reputation and quest state, including correctness and missing variations.
- Compare V1 NPC–NPC social conversations and campfire exchanges with V3 dialogue variants; identify selective adaptation candidates without replacing V1's conversation/runtime authority.
- Audit bark spacing, per-speaker and shared/global cooldowns, repeat suppression and cross-NPC deduplication, especially identical weather lines heard three times in different voices.
- Investigate and correct the reported rain bark occurring during snow; first verify weather-state mapping, transition behavior and trigger conditions.
- Evaluate richer weather-specific bark conditions and content (rain versus storm, fog, snow), conditional on the actual V1 weather model and available recordings.

**Sequencing:** Perform a bounded source/research recon first; capture findings and possible fixes without authorizing implementation. Keep voice/runtime wiring and any performance-affecting integration deferred under the approved D4 Performance-First freeze, following the roadmap's proposed P5 living-world content phase after P1 exit. This note does not alter approved decisions, roadmap phase order, or approve donor voice ports.


Retain the author preference for key names **Mark, Kate, Ann and Peter**. Confirm their identity mapping before renaming; preserve quest and character identity.

**Selected for early content stages:**
- **Wounded dog — ownership decision confirmed 2026-10-26:** use a separate, genuinely unowned rescue dog. Rescue/treatment is followed by earning trust and explicit adoption; treatment alone does not grant ownership. The resulting companion helps search for treasure, with state and progress surviving save/load. Reuse existing V1 animal mechanisms and suitable V2 rescue/search behavior. Do not take a household-owned dog or require an owner-return/release branch for this selected story. This resolves the ownership question in the [dog/elder/cemetery comparison](./2026-10-26--dog-elder-cemeteries-comparison.md); plan 058's household-owner opening is not the required route for this companion. Opus should reconcile overlapping plan scope without treating this decision as cancellation of unrelated household-dog work.
- Settlement elder as a **former adventurer, not the headman**, with his legendary sword at home. Characterization, dialogue and actual item ownership/placement must agree.

No order between these two stories has been approved. Their performance-affecting implementation follows the D4 phase.

**Later content goals:** two independent roaming groups with their quests: a knight and squire; a hunter father and son. They were explicitly deferred relative to the dog and elder, not discarded.

## 4. Evidence boundaries and traps

The initial strategy session used repository rules, README, R7, R6, the Author Feature Checklist and vision. The [dated readiness review](./2026-10-26--opus-readiness-review.md) subsequently reconciled completed reports, owning records and targeted source/commit evidence. Neither session performed a new gameplay/visual/GPU/listening acceptance campaign. Source implementation, historical technical checks, recorded author acceptance and author reports remain distinct.

R6/R7 support substantial interconnected V1 behavior, but not universal offscreen persistence or full replay determinism. Their major integration warnings remain relevant:
- V3 live Far behavior and abstract meals/work are not substitutes for V1's concrete commitments and goods.
- Richer V3 equipment/character demos do not supply a complete live combat/progression system.
- V3 trade is connected in-session, but donor purse/stock durability and fresh command validation have limitations.
- Tree wind was disabled with failed/inconclusive GPU evidence at the researched pin. Tree LOD/impostors are candidates, not proven wins at V1's shorter fog distance.
- Asset files, curated quest counts and recordings do not establish playable or accepted content.

Check current source only where freshness or an unresolved fact matters to a selected decision. Preserve explicit distinctions between source evidence, historical tests, new execution and author acceptance.

## 5. Completed preparation and current handoff

**Opus roadmap proposal, 2026-10-27:** [Master Revival Roadmap](./2026-10-27--master-revival-roadmap.md) proposes phases, dependencies, agent allocation and decisions D1–D14. Only D1/D3/D4/D9 are newly approved, as recorded in the dated decision record; the roadmap as a whole and its other proposals are not approved. D4 replaces its earlier gated-parallel-lanes strategy. Dated status note: UI Stages D–E have visual PASS and Stage F Trade is implemented (`ui-input-044`, verification needed), so §3/§5 references to A–C as the latest UI state are historical.

**Technical-review update, 2026-10-26:** the author subsequently assigned Astra the bounded review of delivered models, snow and UI A–C. See [Cursor technical review](../../reviews/2026-10-26--026--v1-revival-cursor-technical-review.md) for findings, executed checks and remaining limits. Earlier references here to Opus's future technical review now mean taking over these findings and targeted follow-ups, not repeating this review. Opus's planning and AI-agent documentation optimization ownership is unchanged.

The requested bounded comparisons are complete source research, not future assignments or implementation acceptance:

| Topic | Owning evidence |
| --- | --- |
| UI and equipment | [Comparison](./2026-10-26--ui-equipment-v1-v3-comparison.md), newer [UI decisions](./2026-10-26--ui-migration-research.md#5-author-decision-register), [compatibility matrix](./2026-10-26--ui-migration-compatibility-matrix.md), [draft stages](./2026-10-26--ui-migration-draft-stages.md). Accepted A–C proposals own delivered scope; the matrix is historical mapping, not current implementation status. |
| Dog, elder and cemeteries | [Completed comparison](./2026-10-26--dog-elder-cemeteries-comparison.md). Its former ownership question and owner-return checks are superseded for the selected unowned dog by §3. |
| Clouds and settlement spacing | [Completed comparison](./2026-10-26--clouds-settlement-spacing-comparison.md). Historical A/B selection advice is superseded by §3; travel calibration remains necessary. |
| Cleanup and current work | [Audit](./2026-10-26--documentation-backlog-audit.md), [archive Snapshot 3](../../plans/archive/README.md#snapshot-3--2026-10-26), then [readiness review](./2026-10-26--opus-readiness-review.md) for dated evidence and qualifications. |

**Preparatory ownership:** Astra / GPT 6.1 Sol reconcile facts, author decisions, statuses and navigation; Cursor performed the authorized cleanup. Snapshot 3 moved 402 implemented plans while retaining substantive residual work. Archive location does not mean gameplay acceptance. Implemented plans awaiting only manual checks may be archived with truthful status; do not reopen a large manual-check queue or require soak tests. Preserve unfinished scope, concrete defects and existing issue owners. Omission from revival neither cancels nor selects older work.

**Opus ownership:** optimize documentation specifically for AI agents—entry points, instruction hierarchy, navigation, bounded context loading and reduced duplication—using prepared evidence. This reconciliation session does not perform that optimization or redo Opus's future technical review. Review Cursor changes before making broader acceptance claims; use owning plans/notes rather than repeating broad recon. The readiness review is a dated handoff, not another permanent backlog or roadmap.

**Remaining UI preparation:** [Character/skills consultation](./NEXT-SESSION--stage-d-character.md) is a proposed next slice, not approval to implement or a revival-wide sequence. Its D3 layout/D5 treatment and applicable D7/D8 choices remain open. Preserve the author's [pending terrain/road textures and cave research suggestions](./README.md#additional-author-suggestions--pending-research) as research candidates, not implementation commitments.

## 6. Plan and acceptance expectations

Opus's proposal should explain why each phase serves the agreed goals, its dependencies, exclusions, relevant risks and completion evidence. Neither R7 table order nor an architecture-first sequence is prescribed.

Use scoped criteria, to be made concrete in that plan:
- Matched V1 workloads on the reference laptop; retain comparable content/simulation when claiming performance gains; assess travel stalls and visual compromises.
- Author-reviewed water, vegetation/wind, cloud and model scenes at the accepted visibility range, with relevant day/night/weather variation.
- UI actions retain V1 capabilities; conversation and Quick Actions receive real interaction checks rather than visual-only approval.
- Armor comparisons match actual effects; equivalent player/NPC protection behaves consistently; normal acquisition and new-save round trips work.
- The dog and elder have real actors/items/effects, durable selected state and no duplicated rewards or invented completion claims.
- Longer routes preserve coherent crossings, NPC/material transport and acceptable travel feel.

Open items include exact hardware/profile and baseline scenes; detailed armor/visual contracts; donor content readiness; name mapping; audio coverage and relation/reputation mapping; cemetery sizing; and post-performance phase details. The performance-first phase order is settled by D4. Clouds are selected without A/B; their performance benefit remains unmeasured, not an unresolved selection gate. These are not all author blockers: Opus should resolve technical facts and routine design within scope, asking only for consequential product choices.

## 7. Evidence routing

| Need | Read only the relevant material |
| --- | --- |
| Research status and original index | [Dossier README](./README.md) |
| Candidate status, preservation and dependencies | [R7](./2026-10-26--007--unified-candidate-matrix.md), especially §5–§6; exact candidate records as needed |
| Reconciled caveats | [R6](./2026-10-26--006--cross-report-review.md), §3 and §8 |
| Navigation, persistence, simulation/performance | [R2](./2026-10-25--002--architecture-and-simulation.md); R7 ARCH entries only when relevant |
| Geography, water, wind, trees, assets | [R3](./2026-10-25--003--world-and-visuals.md); R7 WORLD/VIS entries |
| Equipment and UI mechanics | [R4](./2026-10-25--004--gameplay-systems.md); R7 GAME-02, UX-01–UX-03 |
| Stories, voices, conversation and maps | [R5](./2026-10-25--005--content-and-player-experience.md); selected R7 CONTENT/UX entries |
| Original explicit author additions | [Author Feature Checklist](./2026-10-26--author-feature-checklist.md); this brief supplies later priorities and qualifications |

Maintain this brief as the concise decision entry point. Keep technical detail in its owning plan/research document and link it; do not duplicate the decision ledger across multiple handoffs.



# Seedvale V1 Revival — Strategic Brief for Claude Opus 5.5

**Created at:** 2026-10-26  
**Created by:** ChatGPT Sol  
**Updated at:** 2026-10-26  
**Updated by:** ChatGPT Sol  
**Status:** Current author-agreed direction; remaining-work sequence pending author approval. Author-authorized Cursor exceptions are recorded below.  
**Target:** `jm-sky/seedvale-v1`

## 1. Start here: mandate and authority

Claude Opus 5.5 owns later coordination, detailed planning, AI-agent documentation optimization and technical review of Cursor changes. Its proposed phases, order, dependencies and verification criteria for **remaining work require author discussion and approval** before execution. The author separately authorized Cursor's NPC/player model transfer and shoulder repair, snow patches/grass burial, documentation cleanup and accepted UI slices A–C. These are bounded exceptions to the original Opus-first workflow, not blanket implementation approval. After approval, routine technical decisions are autonomous; return to the author for scope changes or significant compromises, particularly degraded appearance, simplified simulation or omission of an agreed feature.

This brief records explicit author decisions from the strategic conversation. It is the entry point for revival scope, not a technical design or implementation acceptance report. Current code remains authoritative for what exists. Follow [CLAUDE.md](../../../CLAUDE.md) and use the repository's targeted navigation workflow.

Read this brief first. Consult the relevant research sections through §7 as needed; do not load the entire dossier by default or repeat broad reconnaissance. R1–R7 are evidence and candidates, **not an approved backlog**. Their older open author questions are answered only where this brief explicitly resolves them. Unmentioned candidates remain unselected, not rejected.

Astra/ChatGPT may coordinate bounded research, comparison and review, including GPT 6.1 Sol work, to prepare evidence. This does not transfer detailed implementation planning from Opus. Communicate with the author in Polish and use described survey choices for strategic questions; repository documentation remains English.

## 2. Primary goals and preservation boundaries

**Primary goals:** smoother, more convenient play and improved atmosphere. No fixed order between performance, atmosphere and UI has been approved.

- Reference device: author's **DELL Pro Premium with Intel Arc**. Exact GPU, resolution and settings remain to be recorded before measurements.
- Target: **50–60 FPS**, with roughly **45–60 FPS acceptable**, not at any visual cost. Evaluate travel stutters separately from average FPS; detailed measurement thresholds belong in Opus's proposed plan.
- Current V1 visibility distance and strong distance fog are acceptable. Increasing draw distance is not a goal.
- Accepted compromises: simpler distant objects and cheaper/lower-frequency shadows or reflections **without noticeable disturbances**. Reduced vegetation density has not been approved.
- Preserve V1's interconnected living-world behavior, concrete economy and ownership, character identity and atmosphere. No blanket architecture replacement or simplification of simulation is authorized by a performance goal.
- **Compatibility with pre-revival saves/worlds is not required; a new game is acceptable.** New games must still save/load correctly. This does not authorize arbitrary deletion of persistence infrastructure or silently accepting incompatible data; Opus should specify the version/reset policy.
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

These are priorities, not a mandated implementation order.

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

Retain the author preference for key names **Mark, Kate, Ann and Peter**. Confirm their identity mapping before renaming; preserve quest and character identity.

**Selected for early content stages:**
- **Wounded dog — ownership decision confirmed 2026-10-26:** use a separate, genuinely unowned rescue dog. Rescue/treatment is followed by earning trust and explicit adoption; treatment alone does not grant ownership. The resulting companion helps search for treasure, with state and progress surviving save/load. Reuse existing V1 animal mechanisms and suitable V2 rescue/search behavior. Do not take a household-owned dog or require an owner-return/release branch for this selected story. This resolves the ownership question in the [dog/elder/cemetery comparison](./2026-10-26--dog-elder-cemeteries-comparison.md); plan 058's household-owner opening is not the required route for this companion. Opus should reconcile overlapping plan scope without treating this decision as cancellation of unrelated household-dog work.
- Settlement elder as a **former adventurer, not the headman**, with his legendary sword at home. Characterization, dialogue and actual item ownership/placement must agree.

No order between these two stories, or ahead of other primary goals, has been approved.

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

Open items include exact hardware/profile and baseline scenes; detailed armor/visual contracts; donor content readiness; name mapping; audio coverage and relation/reputation mapping; cemetery sizing; and phase order. Clouds are selected without A/B; their performance benefit remains unmeasured, not an unresolved selection gate. These are not all author blockers: Opus should resolve technical facts and routine design within scope, asking only for consequential product choices.

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



# Seedvale V1 Revival — Strategic Brief for Claude Opus 5.5

**Created at:** 2026-10-26  
**Created by:** ChatGPT Sol  
**Updated at:** 2026-10-26  
**Updated by:** ChatGPT Sol  
**Status:** Author-agreed strategic direction; implementation plan and sequence pending author approval.  
**Target:** `jm-sky/seedvale-v1`

## 1. Start here: mandate and authority

Claude Opus 5.5 owns detailed planning, coordination and implementation. Its first deliverable is a proposed phased plan, order, dependencies and verification criteria **for discussion and author approval before implementation**. After approval, routine technical decisions are autonomous; return to the author for scope changes or significant compromises, particularly degraded appearance, simplified simulation or omission of an agreed feature.

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

V1 exploration is already a good baseline. Aim for approximately **10–15% longer comparable inter-settlement journeys**, primarily by slightly increasing settlement separation, while preserving a similar overall pace. This is an experiential target, not an instruction to scale every world coordinate.

The author reports that existing animal and landmark distribution already populates the space. Longer travel should convey a larger world and may expose the player to more danger. **Do not invent a separate content-density or guaranteed-encounter program to fill the added distance.** Check route generation, crossings, transport, NPC travel and provisioning implications before choosing the change.

### Atmosphere, models and cemeteries

Priority atmosphere areas:
1. More convincing **water**, preserving the distinct character of lakes and rivers.
2. Coherent **wind** across grass, vegetation and water; tree motion is conditional on acceptable quality and cost.
3. Improved **settlements and characters** through selective model/outfit/detail replacement, retaining successful V1 assets, style and inhabitants' identities.

These are priorities, not a mandated implementation order.

**Cemeteries:** improve them using V2 as the reference: individual graves with plaques and **one or more larger crypts**, with crypt count related to settlement size. Exact layout and sizing remain for Opus. Crypt interiors and additional quests have not been selected.

**Clouds — conditional preference:** likely reuse/adapt V3 clouds for a global effect and potentially lower cost. Neither their V1 performance advantage nor visual/weather compatibility is established by this decision. Validate the mechanism and relevant evidence before selecting it.

A lightweight moon and stars aligned with world cardinal directions remain a desired future feature. Snow improvements were not selected among the initial atmosphere priorities; this neither removes existing V1 snow nor approves a new winter program.

### UI and equipment

- **The whole UI should eventually follow V3's design**, delivered in stages. Reuse suitable Vue components where useful; Opus determines integration.
- **NPC conversation screen and Quick Actions need separate examination and completion/verification.** The author specifically flagged missing or untested areas; do not treat all V3 UI as a finished template.
- Equipment comparison is an expected benefit. Displays and previews must reflect actual game effects.
- **Layered armor and body-area protection are selected gameplay changes**, not only a body-diagram presentation.
- Player and NPC equipment must provide comparable protection under shared rules where combat exists.
- Preserve current combat controls initially; change only what the equipment/protection integration needs. Active parry/dodge and new permission to attack inhabitants are not automatically included.
- A transitional delivery is acceptable: **working equipment mechanics and UI first, matching character appearance later**. Visual mismatch is temporary; the exact final representation contract remains to be specified.
- Obtain new armor through existing trade, artisans, appropriate loot and rewards. **A new general player crafting system is outside the agreed scope.**
- Opus owns slots/layers/damage rules, balancing and integration design. No wholesale adoption of V3's item authority or combat model is implied.

### Voices, cast and selected stories

**First audio stage:** use suitable existing recordings, including newer batches and dedicated Mark Hornblower material. Missing recordings can remain text-only at this stage.

**Longer-term audio direction:** key NPC–player dialogue, short NPC–NPC exchanges, and vocalization varying with NPC/player relations and reputation. Derive behavior from actual relationship/reputation state; detailed coverage and production are not yet planned. English is optional and mixed languages are acceptable; no automatic conversion to English.

Retain the author preference for key names **Mark, Kate, Ann and Peter**. Confirm their identity mapping before renaming; preserve quest and character identity.

**Selected for early content stages:**
- Wounded dog encounter leading to a companion that helps search for treasure; companion state and progress must survive save/load.
- Settlement elder as a **former adventurer, not the headman**, with his legendary sword at home. Characterization, dialogue and actual item ownership/placement must agree.

No order between these two stories, or ahead of other primary goals, has been approved.

**Later content goals:** two independent roaming groups with their quests: a knight and squire; a hunter father and son. They were explicitly deferred relative to the dog and elder, not discarded.

## 4. Evidence boundaries and traps

This strategic session read repository rules, the dossier README, R7, R6, the Author Feature Checklist and the top-level vision. It did not execute game tests, GPU measurements, visual comparisons or listening checks, and did not independently re-audit application code. Implementation observations below are attributed to existing research at its recorded pins.

R6/R7 support substantial interconnected V1 behavior, but not universal offscreen persistence or full replay determinism. Their major integration warnings remain relevant:
- V3 live Far behavior and abstract meals/work are not substitutes for V1's concrete commitments and goods.
- Richer V3 equipment/character demos do not supply a complete live combat/progression system.
- V3 trade is connected in-session, but donor purse/stock durability and fresh command validation have limitations.
- Tree wind was disabled with failed/inconclusive GPU evidence at the researched pin. Tree LOD/impostors are candidates, not proven wins at V1's shorter fog distance.
- Asset files, curated quest counts and recordings do not establish playable or accepted content.

Check current source only where freshness or an unresolved fact matters to a selected decision. Preserve explicit distinctions between source evidence, historical tests, new execution and author acceptance.

## 5. Bounded preparation work agreed in principle

These comparisons are **proposed preparation, not completed findings**. No agents were launched or comparison reports produced by writing this brief. Start with UI/equipment, the largest selected mechanical expansion.

| Work packet | Required output |
| --- | --- |
| UI and equipment | Exact V1/V3 slot, layer, protection and comparison differences; reusable Vue surfaces; NPC conversation and Quick Actions gaps; existing authority and integration dependencies. |
| Selected content and cemeteries | Actual dog, elder/sword and V2 cemetery implementation; distinguish functioning behavior, authored content and missing mechanisms; identify adaptation boundaries. |
| Clouds and settlement spacing | V3 cloud mechanism and available cost evidence; V1 settlement-placement controls and implications of modestly longer journeys. No unsupported speedup claim. |

Keep each result short: pinned evidence, differences, dependencies, risks and decisions needed. Reuse R1–R7; do not produce competing full implementation plans or expand into unselected systems. Consolidation review should remove contradictions and implicit assumptions before Opus plans.

### Documentation audit and agent-facing cleanup — Opus owner

The author additionally requests a V1 documentation audit and cleanup, with AI-agent optimization owned by **Claude Opus 5.5**. This is preparation for reliable future sessions, not another broad application-code investigation. Opus should use its findings when proposing revival phases; a separate architecture rewrite is not implied.

- Review agent entry points, navigation indexes, current-state documents, plans and linked GitHub issues. Make authoritative scope, implementation status, historical evidence and unapproved proposals explicit, with bounded task-specific reading.
- Move old, completed plans to the repository's appropriate archive after checking completion evidence. Do not classify a plan as complete by age or title alone; preserve unresolved follow-ups and verification gaps, history and incoming links. Follow existing archive conventions where suitable.
- Inventory plans and issues still awaiting work. Record current status, remaining scope, dependencies, duplication and relationship to this brief. Link to the owning plan/issue rather than copying full content into a parallel backlog.
- Reconcile contradictions, stale instructions and ambiguities with current code and explicit author decisions. Research candidates are not commitments. Existing open work absent from this brief is not automatically cancelled or approved for revival.
- Resolve factual/documentation inconsistencies autonomously where evidence is sufficient. Bring genuine product conflicts, scope changes and significant compromises to the author; do not silently discard unfinished work or close issues solely to reduce noise.
- Remove redundant active guidance, repair navigation after moves, and keep historical reports clearly historical. Regenerate generated indexes rather than manually editing generated sections.

**Completion evidence:** a concise active-work index with source links and dispositions; completed plans archived with references repaired; a short conflict list showing resolved items and remaining author decisions; consistent agent entry points that route to current authority without requiring obsolete plans or all research reports. Check links and generated navigation affected by the cleanup. Prefer updating existing owning documents over creating another layer of audit reports. The audit and cleanup have not yet been performed.

## 6. Plan and acceptance expectations

Opus's proposal should explain why each phase serves the agreed goals, its dependencies, exclusions, relevant risks and completion evidence. Neither R7 table order nor an architecture-first sequence is prescribed.

Use scoped criteria, to be made concrete in that plan:
- Matched V1 workloads on the reference laptop; retain comparable content/simulation when claiming performance gains; assess travel stalls and visual compromises.
- Author-reviewed water, vegetation/wind, cloud and model scenes at the accepted visibility range, with relevant day/night/weather variation.
- UI actions retain V1 capabilities; conversation and Quick Actions receive real interaction checks rather than visual-only approval.
- Armor comparisons match actual effects; equivalent player/NPC protection behaves consistently; normal acquisition and new-save round trips work.
- The dog and elder have real actors/items/effects, durable selected state and no duplicated rewards or invented completion claims.
- Longer routes preserve coherent crossings, NPC/material transport and acceptable travel feel.

Open items include exact hardware/profile and baseline scenes; detailed armor/visual contracts; donor content readiness; name mapping; audio coverage and relation/reputation mapping; cemetery sizing; cloud benefit; and phase order. These are not all author blockers: Opus should resolve technical facts and routine design within scope, asking only for consequential product choices.

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

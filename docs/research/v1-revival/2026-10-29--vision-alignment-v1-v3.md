# SeedVale V1/V3 Vision Alignment — Author Decision Record

**Date:** 2026-10-29  
**Status:** 25 author-approved product vision decisions; not implementation authorization  
**Primary source of truth:** SeedVale V1. V2/V3 are references and potential selective donors, not replacements.

## Purpose and authority

This document consolidates explicit product choices from the V1/V3 vision-alignment discussion. It is **not** proof of implemented features, a coding task, approval of old plans, or authorization to transfer V3 architecture. The [Revival Strategic Brief](./STRATEGIC-BRIEF.md) remains authoritative for approved Revival scope and integration policy. Current V1 code/tests establish actual behavior. Quest Curation decisions remain in force. Before implementing older plans, a separately agreed Opus review should reconcile them with the updated vision and current V1 implementation.

## Decisions

| # | Area | Author-approved direction |
|---|---|---|
| 01 | Identity | Adventure-oriented RPG in a deeply simulated living world. Preserve V1's existing/planned autonomous simulation; exploration and questing lead player experience. |
| 02 | NPC autonomy / quests | NPCs solve everyday needs, work and travel independently. Do not add mechanisms resolving authored quest problems for the player without explicit author approval; any existing behavior is unverified. |
| 03 | World seeds | Multiple generated seeds using V1's generic world generator; optional bounded authored overlay or localized terrain for story landmarks, not a single canonical map. |
| 04 | World scale | Scalable territory and settlement count, enlarged incrementally by generator, streaming and simulation capability. No rigid product maximum; infinity not mandated. |
| 05 | Discovery | Clues from NPC rumours, treasure maps, found documents and rough directions. World place existence is separate from personal knowledge and physical discovery. |
| 06 | Travel | Manual walking/riding, physically simulated route autopilot with accelerated world time and danger interruption; possible later paid cart/transport services; no teleportation. |
| 07 | Authored adventure placement | Designed sites placed by the generator in appropriate locations in each procedural world, with bounded site-specific geography changes when necessary. |
| 08 | Player as settlement leader | May eventually lead an existing town or found one; sets goals carried out by autonomous NPCs rather than direct city-builder micromanagement. |
| 09 | NPC settlement founding | No general autonomous NPC town-founding feature. Existing towns can evolve, decline or have migration. Specific quest-driven town creation is permitted. |
| 10 | Human mortality in combat | Ordinary zero HP -> incapacitation; deliberate finishing can kill and is a serious crime. Untreated injuries, illness, hazards and predators may still kill under shared rules. |
| 11 | Survival intensity | Meaningful needs, weather, illness, wounds and expedition provisions, but not incessant chores; preserve the depth of NPC needs. |
| 12 | Player loss and death | Ordinary combat loss -> unconsciousness, injuries, recovery and time/resource consequences. Death possible only in exceptional serious circumstances; no mandatory permadeath, loading a save remains possible. |
| 13 | Progression | Learn skills by doing, teachers and books; no universal character level or general EXP. Progress also includes knowledge, equipment, relationships and reputation. |
| 14 | Setting | Grounded medieval realism with legends, superstition, ruins and seemingly supernatural mysteries with rational explanations; no real magic or fantasy monsters. |
| 15 | LLM | No LLM during gameplay; AI-assisted game development is allowed. |
| 16 | Multiplayer | Singleplayer only; no multiplayer roadmap, requirement or architectural readiness obligation. |
| 17 | Platforms | Desktop-first. Possible later mobile edition with adapted visuals and controls, not parallel platform parity. |
| 18 | Time pace | Configurable pace, initial default target around 12 real minutes per game day instead of eight. Exact controls remain open. |
| 19 | Money and economy | Physical goods and production remain real; controlled currency creation/removal may prevent economic deadlocks, no strict global money-conservation rule. |
| 20 | Companion animal mortality | Permanent death possible, with strong flee instinct and temporary adrenaline/stamina/speed escape protection. Selected important NPCs may receive escape protection or high Sneak Skill for inter-settlement travel; not immortality. |
| 21 | Human combat in quests | Some quests may require human fighting or incapacitation, but no quest must require killing a human. |
| 22 | Combat design | Current V1 combat is the baseline and reference; simple RPG controls. Selected V3 tactics may be evaluated individually, not transplanted wholesale. Layered/body-part armor direction preserved. |
| 23 | Equipment / craft | Rich materials, quality, durability, maintenance, repairs, sharpening and rare/masterwork items; NPC artisans create goods in genuine economy. No automatic complex player crafting. |
| 24 | When game closed | World time freezes with the game closed; no real-world catch-up. Off-screen NPC and town simulation continues while the game runs. |
| 25 | Audio | Natural ambience, weather, animals, settlement work and NPC voices; no music soundtrack. |

## Invariants

- **Adventure-first player experience; simulation-first world foundations.** Adventure priority never authorizes cutting autonomous world depth.
- Preserve authoritative deterministic simulation, off-screen settlement and independent traveller continuity, persistence and stable identities across streaming.
- Authored quests and emergent opportunities are complementary; use existing world entities and state instead of parallel quest-only substitutes when practical.
- Neither these decisions nor V3 reference material mandate wholesale replacement of V1 combat, terrain, item, NPC or quest systems.
- No automatic expansion of implementation scope, changes to Strategic Brief / Master Roadmap / plans, or bypassing performance-first integration controls.

## Open design and verification

1. Which individual characters receive escape feats or high Sneak Skill, and exact protection magnitude/duration.
2. Exact exceptional player-death conditions and treatment/recovery mechanics.
3. Available game-time settings and effects of accelerated travel on simulation.
4. Currency issuance/removal rules and safeguards for economy balance.
5. Whether V1 code already resolves any quest situations automatically — **not inspected in this vision session**; verify only when relevant, without inventing new behavior.

## Document ownership

The top-level [VISION.md](../../VISION.md) defines the product identity. [Domain vision documents](../../vision/README.md) detail boundaries and gameplay direction. This decision record documents author approval and reconciles future vision discussions; it does not replace technical plans or coding-agent implementation notes.

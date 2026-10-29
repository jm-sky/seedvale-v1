# Seedvale — Vision

**Purpose:** define why Seedvale exists, what kind of world it is meant to become, and the principles that should guide major design decisions. This document describes the vision and long-term direction, not the current implementation status.

Current implementation state belongs in [STATE.md](./STATE.md). Architecture belongs in [ARCHITECTURE.md](./architecture/ARCHITECTURE.md). Concrete priorities and plans belong in [ROADMAP.md](./ROADMAP.md) and [plans/README.md](./plans/README.md). Agent workflow belongs in [CLAUDE.md](../CLAUDE.md).

## Domain vision documents

Detailed domain-level vision is maintained in [`vision/`](./vision/).

These documents expand the principles of this document for individual systems and domains, including:

- NPCs and NPC AI,
- settlements,
- fauna,
- economy and resources,
- player systems,
- items,
- quests,
- agriculture,
- weather and world systems.

`VISION.md` remains the top-level vision. Domain documents should refine it, not contradict its core principles.

## 1. What Seedvale is

SeedVale is a browser-based **medieval adventure RPG and sandbox built around a deeply simulated, procedurally generated living world**. Authored adventures and exploration lead the player experience; autonomous world simulation remains foundational.

The world contains settlements, people, animals, resources, weather/time cycles and other systems that interact with one another. The player enters that world as one of its inhabitants. The world should not exist merely to provide content for the player: it should have its own rhythms, constraints, needs and consequences.

SeedVale is a **singleplayer** game, not an MMO, a theme-park quest treadmill or a conventional crafting grind. Authored adventures are central to play, while the world continues independently of them.

## 2. The central idea

> **Plant the seed. Watch the world grow.**

The core fantasy is to enter a world that feels as though it was already alive before the player arrived — and to leave it knowing that it will continue changing after the player walks away.

The player is not the chosen one and is not the centre of the simulation. The player can become important to particular people, places and events, but the world does not stop waiting for them.

The long-term goal combines **memorable designed adventures** with a world capable of **producing additional stories through its own behaviour**.

## 3. The world is the AI system

A central part of Seedvale's identity is that its intelligence should emerge from the simulation itself.

The world is generated procedurally, but procedural generation alone does not make it alive. The generated environment provides the conditions in which agents and systems can act:

```text
procedural world
      ↓
resources + places + settlements + environment
      ↓
agent simulation
      ↓
needs + personality + traits + abilities
      ↓
memory + relationships + goals
      ↓
decisions + actions
      ↓
consequences
      ↓
emergent events and stories
```

Needs, personality, abilities, relationships, memory and the environment should produce meaningful behaviour through ordinary deterministic game systems and authored content. **No LLM or generative AI is used at gameplay runtime**, including dialogue and quests. AI tools may assist game development outside runtime.

## 4. What the player becomes

The player's long-term role is that of a **full member of the world, without becoming its centre**.

The player should eventually be able to build a life in Seedvale: have a home or piece of land, own and use objects, develop relationships, participate in work and local economies, help or harm communities, and leave lasting consequences behind.

Those systems are not meant to turn Seedvale into a conventional player-centric survival game. The player's life is one life among many.

A player may build a farm while another NPC moves away. The player may become friends with one villager while two other villagers develop a relationship independently. A settlement may prosper or decline while the player is exploring somewhere else.

The player's story combines **authored adventures, personal choices and emergent consequences** inside the world's larger story. Eventually the player may lead an existing settlement or found a new one, setting goals that autonomous inhabitants pursue.

## 5. The experience we want

Seedvale should encourage the player to:

- wander rather than follow a prescribed route;
- recognise people by their character, behaviour and history rather than by quest markers;
- observe events that were not authored specifically for them;
- discover consequences rather than receive scripted exposition;
- become attached to places and people because they change over time;
- participate when they want to, and simply observe when they do not;
- wonder what happened while they were away.

The desired feeling is:

> **"I didn't know my world could do that."**

That feeling should come from interactions between systems **and** memorable authored adventures grounded in those systems.

## 6. The simulation layers

Seedvale's long-term simulation should grow as connected layers rather than as independent feature collections.

### World

The procedural world should provide meaningful geography, resources, settlements and environmental conditions. Terrain, water, vegetation, climate and other environmental systems should influence what can happen in a region.

SeedVale supports **multiple procedural world seeds**, not one canonical map. Its generic generator remains the foundation, while authored adventure sites may be placed in every world, including optional localized terrain shaping. World size and settlement capacity grow incrementally without a fixed product cap or a requirement for a technically infinite world.

### NPCs

NPCs should develop from the existing needs-driven model into increasingly complete agents.

A long-term agent can have:

- needs and priorities;
- personality and traits;
- abilities and limitations;
- work and daily routines;
- memory of relevant events;
- relationships with other characters;
- goals and changing circumstances;
- the ability to make decisions based on the current world rather than a fixed script.

The important progression is not "more dialogue lines". It is **more coherent behaviour over time**.

### Settlements

Settlements should become living communities rather than collections of NPCs and buildings.

The long-term direction includes multiple settlements, population changes, migration, local resources, work, relationships, cooperation, conflicts and dependencies between communities.

A settlement should be capable of changing because of what its inhabitants and environment do — not only because the player completed a quest there.

### Fauna

Animals should form an ecosystem with populations, predator/prey relationships, resources, movement and environmental pressures.

Fauna should continue to matter to the world even when the player is not watching it. The goal is not to simulate every animal at maximum detail at all times, but to preserve the consequences and continuity that make the ecosystem feel real.

### Player

Player systems should eventually include the tools needed to establish a meaningful life in the world: possessions, a home or land, building, farming or other productive activities, and deeper social/economic participation.

These systems should plug into the same world simulation rather than becoming a separate player-only game layered on top of it.

### Stories and quests

**Authored adventures and world-driven quests are first-class content.** Designed discoveries and stories can introduce their own starting situations while reusing authoritative world systems. NPCs autonomously solve ordinary needs and problems, but introducing new mechanisms that automatically resolve player-facing authored quests requires explicit author approval. Any existing automatic resolution behavior remains unverified. Quests may require fighting humans, but not killing them.

## 7. Design principles

### Adventure-first experience, simulation-first foundations

Exploration and authored adventures lead player experience. This never authorizes weakening, dropping or replacing deep autonomous simulation, including off-screen settlement and NPC activity.

### Simulate life, not collections of objects

The important question is not only whether a tree, NPC or animal exists. It is whether systems interact so that the world can change without direct player instruction.

### Extend existing couplings

When adding a feature, first ask whether it should extend an existing relationship:

```text
needs → behaviour → personality → dialogue → relationships → quests → world events
```

or another shared mechanism such as health/state, resources, persistence or world streaming.

Avoid creating parallel systems that solve the same conceptual problem in isolation.

### The player is part of the simulation

Player-facing systems should participate in the same world rules where practical. The world should not quietly switch from "simulation" to "theme park" whenever the player arrives.

### Consequences matter more than spectacle

A small change that persists and affects other systems is often more valuable than a large scripted feature that disappears when its scene ends.

### Simple systems first

Seedvale should prefer understandable, composable simulation mechanisms before expensive general-purpose solutions. More sophisticated AI should be introduced when it solves a problem that simpler systems can no longer handle well.

### The world must survive without the player

A system is stronger when it can continue producing meaningful state changes without requiring the player to trigger every step **while the game is running**. Closing the game pauses world time; there is no real-time offline catch-up.

## Visual direction — Stylized Realism

**Approved author direction (2026-10-28).** Seedvale aims for **stylized realism**: beautiful, believable medieval-world graphics, not full photorealism. Preserve the atmosphere and identity of V1.

- **Performance:** target **50–60 FPS** on the reference device (DELL Pro Premium with Intel Arc); **45–60 FPS** is acceptable. Evaluate **frametime stability and traversal stutters separately** from average FPS.
- **Living world:** pursue high visual quality **without simplifying or weakening the autonomous simulation**.
- **Materials:** realistic-looking textures (wood, stone, fabrics, bark and other appropriate surfaces) are a preferred, potentially cost-effective way to improve low-poly assets without increasing geometry complexity. Evaluate texture memory, material/draw-call cost and the final look; low-poly stylization is not itself a defect.
- **Visual focus keywords:** vegetation, lighting effects, fog, atmosphere, fire, water, wind.

These are visual goals, **not blanket approval for new effects, asset replacements or runtime implementation**. Performance changes must preserve existing world richness and follow the current Revival Performance-First constraints. Specific density changes and visual trade-offs require separate evidence and approval.

## 8. Long-term destination

The long-term Seedvale vision is a generated world populated by agents that are sufficiently coherent to develop their own lives.

A mature version of the game should make it possible for the player to:

1. enter a procedurally generated world;
2. meet people whose behaviour is shaped by who they are and what has happened to them;
3. watch settlements and ecosystems change over time;
4. establish a personal life and relationships within that world;
5. influence events without controlling the entire simulation;
6. leave an area and return later to discover consequences that happened in their absence;
7. experience designed adventures and unexpected world-driven stories.

The ultimate measure of success is whether the player remembers both **authored adventures and unscripted moments** with lasting consequences in a living world.

## 9. How to evaluate a new idea

Before adding a major feature, ask:

1. Does it make the world more alive or merely give the player another task?
2. Does it create or strengthen a meaningful interaction between existing systems?
3. Can it produce consequences that persist beyond the immediate interaction?
4. Does it help NPCs, settlements, fauna or the player behave like participants in the same world?
5. Does it preserve the idea that the world continues without the player?
6. Could established deterministic systems or authored content achieve the result without unnecessary parallel complexity?

If a feature makes the game larger but not more alive, it deserves extra scrutiny.

## 10. Approved product boundaries (2026-10-29)

- **Identity:** adventure-first player experience, simulation-first world foundations. NPCs, economy, fauna, settlements and persistent consequences retain their depth.
- **Setting:** grounded medieval realism, folklore, legends and explainable mysteries; no real magic or fantasy monsters.
- **Mode and platforms:** singleplayer only, desktop first; mobile may be adapted later. No multiplayer or multiplayer-readiness requirement.
- **Runtime:** no gameplay-time LLM; AI tools may assist development.
- **Exploration and travel:** clues, NPC rumours, maps, caves and authored places in multiple procedural worlds. Manual travel, riding and physical-route autopilot with accelerated time and interrupting danger; paid world transport is a possible later feature. No teleportation.
- **World time:** player-configurable, initially targeting about **12 real minutes per in-game day** instead of eight; world time stops when the game closes.
- **Player:** meaningful but not tedious survival, skill development through practice/teachers/books without universal levels/EXP; normal combat defeat causes incapacitation, exceptional death possible without required permadeath.
- **Settlement leadership:** player may eventually lead or found a settlement with autonomous NPC execution. Generic NPC settlement founding is excluded, except specific authored quest situations.
- **Combat:** preserve current V1 combat as the baseline. Human zero HP normally causes incapacitation, separate deliberate lethal finishing is a serious crime. Some quests may require combat but not human killing. Layered/body-area armor remains a target; tactical control additions are not automatically approved.
- **Economy and equipment:** real production, resources, storage and transport; controlled currency creation/removal is allowed. Rich equipment quality and NPC crafting, without automatically introducing deep player crafting.
- **Animal companions and key NPCs:** real mortality with escape-oriented stamina/adrenaline/speed protection for companions and selected key characters, plus high Sneak Skill for some key inter-settlement travellers. Protection is not immortality.
- **Audio:** natural world and NPC soundscape, no musical soundtrack.

These decisions establish **vision, not authorization to implement**. They do not modify Quest Curation, existing plans or Revival integration approvals. See [V1/V3 Vision Alignment decision record](./research/v1-revival/2026-10-29--vision-alignment-v1-v3.md).

# Seedvale Roadmap

**Updated:** 2026-10-29 (rewritten by Claude Opus 5.5 to match the 2026-10-29 Vision and the V1 Revival program; previous 2026-08-15 version is in git history)

Canonical, **short** product roadmap. It points to owners instead of repeating them:

| Need | Owner |
| --- | --- |
| Product identity and boundaries | [VISION.md](./VISION.md), especially §10 and *Visual direction* |
| Approved Revival decisions, D4 freeze, agent autonomy | [Strategic Brief](./research/v1-revival/STRATEGIC-BRIEF.md) |
| Phases P0–P6, dependencies, benchmark policy | [Master Revival Roadmap](./research/v1-revival/2026-10-27--master-revival-roadmap.md) |
| Current work order for agent sessions | [Autonomous Session Queue](./research/v1-revival/AUTONOMOUS-SESSION-QUEUE.md) |
| Plan status | [plans/README.md](./plans/README.md) |
| What the code actually does | [STATE.md](./STATE.md) |

`docs/roadmap/` (lowercase) is a frozen architecture-design session log, not a roadmap — see [docs/roadmap/README.md](./roadmap/README.md).

## Product direction

**Seedvale — Plant the seed. Watch the world grow.** A singleplayer, desktop-first, browser-based **adventure-oriented RPG in a deeply simulated living world**: adventure-first player experience, simulation-first world foundations. Grounded medieval realism with explainable mysteries; no gameplay-time LLM; no multiplayer. Full boundaries: [VISION §10](./VISION.md#10-approved-product-boundaries-2026-10-29).

Visual goal: **stylized realism** at 50–60 FPS (45–60 acceptable) on the reference Intel Arc laptop, with frametime stability judged separately.

## Current program: V1 Revival

V1 is the foundation; V2/V3 are selective donors only. Phases (detail and entry/exit in the Master Roadmap §5):

| Phase | Content | Status (2026-10-29) |
| --- | --- | --- |
| P0 | Stable reference + benchmark workflow | Operationally complete |
| **P1** | **Performance-First**: A NPC/fauna rendering, B settlement draw submissions, C grass/flowers (V1-first), D trees LOD | **Active** — D4 integration freeze in force; see [tracker snapshot](./research/v1-revival/2026-10-27--performance-three-track-roadmap.md#p1-status-snapshot-2026-10-29) |
| P2 | Save-format vs worldgen versioning (`persistence-008`) and one coordinated worldgen epoch (spacing/routes, cemeteries) | Planning allowed; implementation after P1 |
| P3 | Atmosphere: fog anchoring fix, waterways, shared wind, moon/stars | After P1 (clouds already delivered) |
| P4 | Layered/body-area armor mechanics → truthful equipment UI → appearance | After P1; D5–D7 open |
| P5 | Living-world content: voices stage 1, rescue dog, former-adventurer elder; later roaming groups | After P1 |
| P6 | Remaining UI/models; map raster (D4 exception, implemented) | Partly delivered |

Optional performance candidates waiting for an author decision (not scheduled): [performance tracker — optional post-P1 candidates](./research/v1-revival/2026-10-27--performance-three-track-roadmap.md#optional-post-p1-candidates-awaiting-author-decision).

Bounded D4 exceptions already on `main`: minimap/world-map raster (`ui-input-046`) and the V1 dialogue visual reskin. Everything else that changes runtime workload waits for P1 exit.

## Long-term themes (after Revival)

Directional only; check VISION before planning any of them.

- **Simulation coherence** — shared health/stamina/threat, NPC schedules and places, animal life, persistence and lifecycle boundaries; extend `needs → behaviour → personality → dialogue → relationships → quests → world events` rather than add parallel AI.
- **Settlements as real places** — identity, resource-aware layout, roads/landmarks in one pipeline, inter-settlement travel and trade; player may eventually lead or found a settlement (autonomous NPC execution).
- **Exploration and travel** — clues, rumours, maps, caves and authored sites placed per procedural seed; manual travel, riding, physical-route autopilot; no teleportation.
- **Player life** — skill-by-doing progression (no universal level/EXP), equipment quality/durability/repair, real economy; NPC artisans craft, **no general player crafting system**.
- **Domain observability** — hierarchical domain history → causal "why" → snapshots → animals → broader domains; baseline in [domain debug audit](./reviews/2026-08-31--domain-debug-and-verification-audit.md).
- **Large world** — current flat chunk grid with streaming; scale territory incrementally. No cube-sphere/infinite-world rewrite until streaming proves insufficient.

## Deliberately excluded

Multiplayer/netcode, gameplay-time LLM, WebGPU-first rendering, real magic/fantasy monsters, music soundtrack, teleportation, generic autonomous NPC town founding, wholesale replacement of V1 systems by V3.

## Planning rule

1. Revival work: follow the Strategic Brief and the Autonomous Session Queue.
2. Otherwise check [plans/README.md](./plans/README.md) for status and [STATE.md](./STATE.md) for what exists.
3. Prefer strengthening existing couplings or removing bottlenecks over new subsystems.

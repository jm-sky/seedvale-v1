# P2 — Author decisions for Q38, Q39, Q31/weather and Q42

**Date:** 2026-10-31  
**Status:** approved direction; implementation and visual acceptance remain pending  
**Authority:** author decision, recorded by ChatGPT. Supersedes conflicting provisional queue questions and Q29 proposals, not existing simulation/persistence invariants.

## Q39 — cemeteries

Reuse the existing **V2 cemetery layout and grave/crypt assets**, adapting them selectively to V1 rather than wholesale importing V2 runtime architecture. The exact `public/assets/parked/graveyard.glb` exists on both `jm-sky/seedvales-v2` and `jm-sky/seedvale-v3` main with identical Git blob SHA `a6ea99f88d3571bf424d7a447949814e21acb6db`. Source: [V2 asset](https://github.com/jm-sky/seedvales-v2/blob/main/public/assets/parked/graveyard.glb), [V3 build script](https://github.com/jm-sky/seedvale-v3/blob/main/scripts/assets/build-pack-pieces.mjs), [V2 renderer snapshot](https://github.com/jm-sky/seedvale-v3/blob/main/docs/comparison/code/SeedVales-v2/src/game/render/cemeteries.ts). The model absence was **local checkout only**, not an unavailable source. Opus must assess source model, V2 layout, licenses/attribution, mesh/material compatibility, and instanced/merged rendering before the formal plan; use GitHub connector or controlled asset retrieval. No need to request another asset pack from the author. Retain V1 canonical simulation, grave-slot/quest/treasure semantics, stable references, and D3 epoch/cache rules. Changes in cemetery layout/placement belong to epoch 1. No visual acceptance implied.

## Q38 — road routes and aesthetics

Expand Q38 beyond post-spacing connectivity validation: **improve road shapes, trajectories and visual quality** as well as broken/missing links. Opus first performs bounded V1 road generation/rendering recon and proposes a staged, measurable scope (route geometry, entrances, crossings, terrain/road appearance, NPC navigation), distinguishing generator/epoch changes from purely visual changes. Preserve road connectivity, determinism, travel simulation, bridges/fords and performance; do not redesign or move persisted references outside coordinated epoch 1 without an explicit compatibility decision. Sonnet/agent may implement verified bounded slices after the plan. This author decision supersedes the old “validation only unless a complaint exists” assumption. A major routing redesign is a planning/design gate, not permission for speculative rewrite.

## Q31 / Q40 — voice bank sequencing

Implement **stable per-NPC voice profiles first**, with maximal *compatible* V3 donor reuse and listening/transcript QC; **generate only missing approved recordings** afterwards. Do not import V3 `_b` clips into generic pools that can switch an NPC's timbre; no cross-profile audio fallback. A suitable clip must match intended weather, context, voice and actual spoken text. Existing voice audit [§12](./2026-10-31--npc-voices-dialogue-audit.md#12-author-decisions--approved-2026-10-31-supersedes-open-questions-in-11) remains authoritative on identity, English dialogue, personality, humor and truthful reactions. Reconcile the older 29-line Q31 script against donor inventory; it is **not** an unconditional 29-recording order. Q40 remains blocked until real compatible audio files are available; no invented manifest URLs. Opus should add a sequenced ready planning/recon task for voice casting/routing and donor QC; implementation follows explicit technical handoff.

## Q31-weather — contextual remarks

**Approve planning and staged implementation of contextual, non-shelter weather reactions now** (fog, light rain, clearing, first snow), rather than delaying the trigger until after recordings. Suggested `weather_remark` once per actual weather episode is a **candidate mechanism**, not a mandated trigger identity or exact cooldown. Opus/Sonnet must verify existing weather episode transitions, bark budgets, NPC eligibility and truthfulness; use real observed weather, avoid per-frame global scans, spam and claims unsupported by local conditions. Keep speech identity and recorded text aligned. Text-only/silence is acceptable if matching audio is missing. No new simulation authority in the voice layer.

## Q42 — profession-signature homes

Use V3 as the preferred **visual and asset donor**, adapt selectively to V1 existing household/yard/house ownership and rendering. Retain distinctive recognizable profession cues (e.g. hunter hides/antlers, guard shield/banner, fisher nets), deterministic household assignment, door/work-point/gate access and reasonable batched/instanced draw budgets. First inspect V3 via GitHub connector; absence of a local V3 checkout does not block read-only planning. No requirement to copy its architecture. If essential dressing needs more than the reserved 3×2 m profession slot, resolve the footprint before epoch 1 closes; placement-neutral adornment may follow later. Visual author approval and performance checks are still pending.

## Queue handoff / boundaries

- Q35 and Q43 remain immediately ready; Q37 follows both.
- Q38 still depends on the final Q37 layout; **Opus road recon/plan may start independently** and should produce an implementation handoff, not prematurely edit generators.
- Q39 model availability blocker is removed; an Opus formal-plan task can start now, implementation follows the plan and epoch coordination.
- Q42 is unblocked for Opus planning; separate implementation tasks depend on that plan and spatial constraints.
- Q31 voice architecture/donor planning and weather-trigger recon can proceed without audio files. Q40 remains blocked on actual recorded/donor assets.
- No runtime changes, visual sign-off, tests or performance claims are made by this decision record.

Keep this document linked from the [queue](./AUTONOMOUS-SESSION-QUEUE.md), [Strategic Brief](./STRATEGIC-BRIEF.md) and [Q29 epoch plan](./2026-10-30--q29-revival-epoch-batch-plan.md).

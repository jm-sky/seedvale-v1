# Plan: Gameplay visibility — character line of sight, concealment and last-known contacts

**Created:** 2026-11-05
**Status:** `planned` 📋
**Type:** feature
**Priority:** high · **Effort:** XL
**Depends on:** -
**Domain:** `world`
**Subdomains:** `simulation` `places`
**Tags:** `visibility` `line-of-sight` `perception` `stealth` `caves` `revival-p2`

> Stage gates below carry the real prerequisites: Stage 3 needs [fauna-045](fauna-045-cave-surface-perception-boundary-and-entrance-awareness.md); Stages 3–4 must not run in parallel with the fauna-051 combat track in `AnimalAgent.ts`. Implementation notes: [world-042 notes](implementation-notes/world-042-gameplay-visibility-line-of-sight-and-player-observation-implementation-notes.md) (verified against `main` `2c24b320`).

## Why

Author requirement (2026-11-05, recorded in [world-terrain-050 §Gameplay visibility](world-terrain-050-agent-performance-render-census-and-lod.md#gameplay-visibility--detection--author-direction-2026-11-05-astra--opus-review-pending)): actors must not be revealed through solid walls, around opaque corners or through the ground. [Astra's requirements review](world-terrain-050-agent-performance-render-census-and-lod.md#astra-requirements-review--2026-11-05) separated four contracts — physical camera visibility, player observation/information, AI perception and optional draw suppression — and recommended a distinct cross-domain plan. This is that plan. `world-terrain-050` stays performance-only; nothing here is justified by FPS.

## Author decisions (2026-11-05) — authoritative for this plan

| # | Decision | Consequence in this plan |
| --- | --- | --- |
| A1 | TPP camera: **hide models the character cannot see**, keep partially visible silhouettes. | Character-eye LOS drives model concealment (Stage 1). Any clear sample keeps the whole model rendered; depth testing still clips the camera image. This overrides Astra's "no body suppression" recommendation; "no magical invisibility" still holds for light/distance/stealth — only *geometry* conceals a model. |
| A2 | Staged: player first; NPC and fauna perception later, possibly separately. | Stages 0–2 = player; Stage 3 = fauna; Stage 4 = NPC. Player-only stages do not claim reciprocal stealth. |
| A3 | On loss of sight leave a **30 % opacity billboard at the last known position**, no tracking. Grey human/animal-shaped shadow or blurred model, **not** a 3D dome. | Stage 1 contact memory + silhouette billboard. Frozen coordinates, never updated from hidden movement. |
| A4 | Companions / quest actors: separate navigation indicator without revealing the current position (may come later). | Stage 5, contract only now. No LOS exemption for their body/label/dot. |
| A5 | Vegetation = **soft cover** reducing detectability. | Cover lowers detection/identification; it never conceals a model and never acts as an opaque box. |
| A6 | Torch: easier observation, but higher detectability. | Light term in player observation (Stage 2) and in AI detection of the carrier (Stage 3/4). |
| A7 | Fix animal labels visible through the ground between surface and caves. | Stage 0, a bug fix that ships first and becomes Stage 1's first early-out. |

## Verified starting point (summary — details in the notes)

- **Physical pixels are already correct.** Depth testing hides wall-occluded body pixels; the leaks are the TPP camera seeing what the character cannot, and **information overlays**: CSS2D labels (no depth test), minimap NPC dots, gaze/inspect and combat lock/aim assist.
- **Cave label bug (A7) root cause:** `AnimalAgent.tickPresentation` (and `NpcAgent`'s equivalent) resolve the label from `resolveStableObservationLevel({perception, distance})` only — 3D distance, no `WorldSpatialContext`. CSS2D labels draw through terrain, so a cave animal's label floats over the surface (and vice versa).
- **Concealment seam exists:** NPCs and animals already live on `AGENT_RENDER_LAYER` (`world/waterMirror.ts::assignRenderLayer`); the main camera (`app/renderStack.ts`) and the sun shadow camera (`world/createLights.ts`) enable it; CSS2D labels are children of the same subtree. Concealment can switch the actor subtree to a dedicated layer — never `mesh.visible` (corpse/loot authority, `hideLivingVisual`/`showLivingVisual`).
- **Segment-test precedents exist:** `player/cameraBoom.ts::resolveCameraBoom` already marches terrain (`sampleHeight`), cave occupancy (`occupancyAt`) and large XZ colliders along a segment. Movement colliders are **not** sight geometry (window walls are full OBBs; houses as 8 m cylinders) — reuse the marching pattern and producers, not the collider shapes.
- **Perception policy exists:** `fauna/playerAwareness.ts` (distance × facing × day/night × forest × `sneakDetectionMultiplier`) is the only stealth model; extend it. Player observation (`simulation/observation.ts`) has no light or cover input yet.
- **Cave seam:** fauna-045 notes define a world-owned `canPerceiveAcrossEntrance(caveId, a, b)` on `Caves` (O(1) via `v2ByCaveId`). Whichever plan lands first implements it once; the other reuses it.

## Architecture

### Ownership

| Concern | Owner | Notes |
| --- | --- | --- |
| Sight query (segment → `clear / blocked / unknown`) | `world` — new `src/world/sight/` module, wired and disposed by `WorldBundle` | Pure, headless, deterministic; no Three.js scene or rendered-mesh dependency. |
| Sight blocker data | Producers that already own the geometry: settlements (house walls/roofs/openings from `HouseDefinition` + `openingLocalPose`, palisades), terrain (`sampleHeight`, edits included), caves (occupancy + entrance corridor), large rocks | Registered/unregistered on the same load/unload lifecycle as their colliders. Grid traversal reuses the collider-registry bucket code (generalised, not copied) with **extent-aware** segment cell walk. |
| Player observation of an actor (seen / last-known / unknown, level) | `simulation/observation.ts` extended + a small per-world player contact store | Transient presentation/information state; **not saved**, cleared on WorldBundle rebuild, unload, death/despawn, spatial-context change. |
| Model concealment + label/overlay suppression | Agent presentation (`NpcAgent`/`AnimalAgent` presentation tail via a shared helper next to `render/agentPresentationVisibility.ts`) | Layer switch on a cached mesh list; label controller gains one composable `concealed` flag (no more direct `el.style.display` writes from agents). |
| Last-known billboard | Same contact store; one render helper (shared sprite materials, pooled) | Frozen position; at most one per actor id. |
| AI perception | `fauna/playerAwareness.ts` (+ `AnimalAgent.senseEnvironment`), later `ai/npcAnimalThreat.ts` | Consumes the same sight query; never consumes the player-camera concealment result. |

### Sight query contract (Stage 1, used by every later stage)

```text
querySight(observer: {x,y,z, context}, target samples: {x,y,z}[], options)
  → { result: 'clear' | 'blocked' | 'unknown', clearSamples: bitmask, reason, revision }
```

1. **Context gate first** (Stage 0 logic): different `WorldSpatialContext` → blocked, unless `canPerceiveAcrossEntrance` for the cave side's id.
2. **Range/early-out** before any geometry.
3. Per sample segment, stop at the first clear sample: terrain march (step bounded by distance, as in `cameraBoom`), cave occupancy march when inside a cave, then blocker primitives from the cells the segment crosses (deduplicated).
4. Blocker primitives have **finite height** and **apertures**: door gaps (open/closed from the house's logical door state — doors open by observer proximity, `settlement/houseDoors.ts`), windows transmit sight, low walls/fences block only below their top, roofs block from above. Trees, bushes, grass never block (soft cover only).
5. `unknown` when a needed producer has not loaded (streaming). Failure policy per consumer as in Astra §6: rendering → show; player information → no new disclosure; AI → not "absent".

### Concealment state machine (Stage 1)

```text
seen ──(all samples blocked for ≥ grace)──► concealed + last-known billboard at last clear pose
concealed ──(any sample clear)──► seen (instant; billboard removed)
billboard expires on: re-acquire · character sees the spot empty · max age · range/context exit · death/unload/rebuild
```

- Samples: 5–7 semantic points per actor (head, chest, pelvis, left/right shoulder extent, low body for quadrupeds) from the existing A1′ cull bounds / label height — no CPU skinning.
- Observer = character eye (player head height; lower when crouch exists), **not** the camera.
- Reveal fast, conceal slow (grace ≈ 0.15–0.25 s, to tune) — no popping at door frames or corners.
- Player's own mount and actors in dialogue/trade with the player are exempt while the interaction lasts.
- Everything the actor discloses is gated by the same state: body, label (all icons incl. quest/shop), highlight, minimap dot, gaze/inspect/touch/Quick Actions, Tab/soft lock and ranged aim tracking (revalidated at command execution). Physical hits, projectiles and damage stay independent.

## Stages

Each stage is independently committable and revertable (`?sight=0`-style runtime switch for Stages 1–2 until browser/Windows checks pass).

### Stage 0 — cave/surface label fix (A7) · S · bug

Gate NPC and animal **labels and highlight** by spatial context: show only if the actor's current context equals the player's, or `canPerceiveAcrossEntrance` holds for the matching cave mouth. Resolve the actor context only for actors already inside label range, once per presentation tick; player context once per frame (already computed in `gameLoop.ts`). Implement `canPerceiveAcrossEntrance` on `Caves` per the fauna-045 notes if fauna-045 has not landed.

Done when: tests for surface↔cave above/below closed roof (hidden), same context (unchanged), matching mouth (visible), cave A vs cave B (hidden); label `display` writes centralised in the controller; type-check, lint, focused tests; browser check on `?seed=415424794` at a cave with a resident animal (screenshots), else §2.

### Stage 1 — sight query + player model concealment + last-known billboard (A1, A3) · L

1. `src/world/sight/` query and blocker registry; producers for terrain, caves, house walls/roofs/doors/windows, palisades, large rocks.
2. Player contact store + concealment state machine for loaded NPCs and animals within the presentation range (frustum-intersecting first).
3. Concealment via a dedicated render layer on a cached mesh list; newly attached equipment/hair meshes inherit the current layer.
4. Billboard: grey human / small quadruped / large quadruped / bird silhouettes (one shared texture atlas, procedural or Blender-rendered), 30 % opacity, depth-tested, no depth write, no label, pooled.
5. Gate all information consumers listed above.

Done when: unit tests for every sight case below; state-machine and billboard lifecycle tests; consumer-gating tests; **simulation invariance test** (same seed/steps with sight on/off/camera rotated → identical NPC/fauna state); type-check, lint, tests, build; cost measured (below); browser check on the reference seed (house wall, door, window, corner, ridge, cave mouth) with screenshots; look/feel → §2.

### Stage 2 — player observation: light and soft cover (A5, A6 player side) · M

Add bounded, monotonic light and cover terms to `resolveObservationLevel` input (information level only; models never concealed by light/cover):

- **Light at target:** day/night factor plus nearby *actually lit* sources from their owners (`PlayerTorch.isLit`, placed fires, settlement torches/lanterns) — never active `PointLight`s (`world/pointLightBudget.ts` may hide them) or quality settings. A carried lit torch restores observation range around the player at night.
- **Soft cover at target:** sampled vegetation density along the sight segment (target end weighted), one term, clamped.

Done when: monotonicity/clamp tests, quality-preset invariance test, day/night/torch browser check; numbers proposed in notes and confirmed via §2 (no thresholds are approved yet).

### Stage 3 — fauna perception of the player (A2, A5, A6) · M · after fauna-045

Extend `playerAwareness.ts`/`AnimalAgent.senseEnvironment`: hard blocker → no new visual evidence (also at panic range); soft cover replaces the current observer-position-only `forestFactor` with one segment-sampled term (no double counting); lit torch at night raises the carrier's detectability. Hearing, damage, retained alertness unchanged. Sight scheduling on simulation time, deterministic order; same dt-partition test as fauna-051 Q152.

### Stage 4 — NPC perception (A2) · M · later, separate approval of scope

Classify `ai/npcAnimalThreat.ts` and other NPC sensing into sight / sound / damage / social knowledge; apply the sight query to the sight class only. Offscreen NPC↔fauna results must not depend on the camera.

### Stage 5 — companion / quest navigation indicator (A4) · S · later

Non-visual indicator (compass/edge marker) pointing to the **last known position or a coarse area**, never the live position; companion body/label/dot obey normal LOS. Needs its own UI proposal.

## Acceptance cases

| Case | Expected |
| --- | --- |
| Actor behind a solid house wall, any distance, friendly/hostile/owned | Model, label, dot, gaze, lock: hidden; billboard where last seen. |
| Corner emergence, head/shoulder past the corner | Model shows on the first clear sample; no flicker while walking along the edge. |
| Open/closed door, window, low wall/fence, player on higher ground | Follows apertures and heights, not movement colliders. |
| Ridge/hill between player and actor | Hidden; reappears at the crest without popping. |
| Cave animal under the player standing on the surface (and reverse) | Label and model hidden (Stage 0/1); matching mouth corridor visible; other caves never. |
| Actor in open terrain at night, far, player sneaking | Model always rendered; only information level changes (Stage 2). |
| Free swing / arrow at a concealed actor | Can still hit physically; no aim assist or lock. |
| Concealed actor moves | Billboard stays at the frozen point; no live updates leak. |
| Death, corpse, loot, unload/reload, save/load, WorldBundle rebuild, time-skip | No stale billboards, no resurrected corpses, root visibility untouched, no save change. |
| Camera rotation, graphics presets, `?sight=0` | Simulation outcomes identical. |
| Shadows | Per §3 decision; presentation layers always restored. |

## Performance and measurement

Recurring work = Stage 1 sight evaluation. Budget per frame: only actors within presentation range and frustum, early-out on context/range, early-out on first clear sample, distance-tiered cadence (near every presentation tick, mid/far staggered), cached per actor by pose/observer cell/blocker revision, no per-frame allocations. Expected cost well under 0.5 ms CPU in `settlement-heavy`; **measure** query count, cache hit rate, CPU p50/p95, allocations and frame p95 in open terrain, dense village and cave scenes (WSL A/B first, Windows Arc via queue §4; never mixed). Draw savings from concealed actors are a side effect — no FPS claim. While a benchmark runs, no `src/` edits.

## Non-goals / guardrails

- No GPU occlusion queries, depth readback or per-pixel eye-visibility map in this plan (possible later strict-silhouette alternative, see §3).
- No V2 ghost placeholder or perception port; V2 only as pattern reference (stable-ID contacts, frozen coordinates, expiry).
- No `mesh.visible` writes on actor roots; no change to corpse/loot lifecycle, AI cadence, offscreen simulation, streaming or persistence; no save version or worldgen cache/epoch bump.
- No hard-coded detection thresholds without author calibration; no stacking a second Sneak/forest multiplier.
- Q16 `occludedActorCohort` stays diagnostic; its sampled result is not a correctness oracle.

## Open author questions (also queue §3)

1. **Shadows of concealed actors** — (a) suppress (no information leak) [rec.]; (b) keep (physically correct, reveals actors behind walls).
2. **Billboard expiry** — (a) on re-acquire / seeing the empty spot / after ~60 s / leaving ~60 m range [rec.]; (b) only on re-acquire or seeing the spot; (c) other.
3. **Billboard form** — (a) shared grey silhouettes per body class [rec., cheap]; (b) per-species silhouettes rendered from the GLB in Blender; (c) blurred snapshot of the actual model (render target per contact, costlier).
4. **Partial-silhouette compromise** — with sample-based LOS the *whole* model is drawn as soon as one sample is clear (camera may show more of the body than the eye sees). (a) accept [rec.]; (b) plan a later strict per-fragment eye-visibility mask (GPU cost, separate measurement).

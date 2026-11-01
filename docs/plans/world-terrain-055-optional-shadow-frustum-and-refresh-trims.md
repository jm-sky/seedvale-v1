# Plan: Optional shadow frustum and refresh trims (settlement shadow pass)

**Created:** 2026-11-01
**Status:** `planned` 📋
**Type:** optimization
**Priority:** medium · **Effort:** S
**Depends on:** -
**Domain:** `world-terrain`
**Subdomains:** `lighting`
**Tags:** `rendering` `performance` `shadows`

> **Approved for implementation (author, 2026-11-01)** — see [Author decision](#author-decision-2026-11-01). Both slices change the image slightly (shadow coverage / shadow refresh rate), so each stays behind its flag, default off, until its own A/B and the author's visual OK. No FPS gain is claimed.

## Author decision (2026-11-01)

**Both S1 and S2, each with a separate A/B, in the next session** (queue Q50 → Q51). Never combine the two flags in one A/B arm; default flips are decided per slice after WSL A/B, Windows A/B and visual check.

## Goal

Cut the cost of the sun shadow pass in settlements with two small, independently revertable changes to existing owners, without touching settlement/actor lifecycle:

- **S1** — fit the shadow camera to what the player actually sees (forward-shifted, tighter frustum).
- **S2** — refresh the shadow map at half rate when the *only* reason to refresh is nearby NPC/fauna motion (player stationary).

## Evidence

[WSL settlement diagnosis 2026-10-31](../performance/results/2026-10-31--wsl-settlement-diagnosis.md) (n = 1, diagnosis only):

- `no-shadows` isolation: render −6.0 ms of 16.7 ms; draws 1832 → 1311.
- Shadow pass: **537 calls** vs 976 main. `settlement:decor` alone: **183 shadow calls vs 78 main** — the shadow camera submits ~2.3× more settlement trees than the player can see, because the frustum is a fixed ±80 m box centred on the player (half of it behind the camera).
- Shadow refresh runs every frame in settlements: `hasNearbyShadowCaster` is almost always `true` there ([negative-experiments review](../research/v1-revival/2026-10-29--performance-negative-experiments-review.md): `shadowRefreshFrames = frames`, 0 skipped).

What is **not** new here and stays out of scope: settlement-tree instancing/batching (lifecycle change, see diagnosis "Proposed next slice"), NPC/fauna shadow distance (`NPC_SHADOW_DISTANCE`/`FAUNA_SHADOW_DISTANCE` = 36 m, recon says do not reduce), shadow map size (plan 145 X5), further create-time `castShadow = false` cuts (world-terrain-038 closed them), reflections (D8/D13).

## Current code (verified 2026-11-01 at `357a0011`)

- `src/world/createLights.ts` — `SHADOW_FRUSTUM_HALF = 80` (ortho ±80, near 1 / far 200, fixed `SUN_OFFSET`), `follow(x, z)` centres the light on the given point with light-space texel snapping.
- `src/app/gameLoop.ts:2831` — `lights.follow(player.mesh.position.x, player.mesh.position.z)` every frame.
- `src/render/shadowBudget.ts` — plan 145 R1 pull-based refresh: refresh if stale ≥ 10 frames, or a nearby shadow caster exists, or the player moved > 0.05 m since the last refresh. `gameLoop.ts:3156–3171` feeds it the player position.
- Plan 145 **X3** rejected shrinking ±80 "without a benchmark showing ±80 catches excess geometry". The diagnosis above is that evidence (decor 183 shadow vs 78 main). V3 runs a 40 m half-extent ([R3 visuals](../research/v1-revival/2026-10-25--003--world-and-visuals.md), `sunShadow.ts`) — donor reference only.

## S1 — forward-shifted, tighter shadow frustum

Change (all in existing owners, no new module):

1. `createLights.ts`: make the half-extent a parameter of the lights object (`SHADOW_FRUSTUM_HALF` default stays 80 for the legacy arm); the texel size in `follow()` already derives from it.
2. `gameLoop.ts`: follow a point ahead of the player instead of the player itself — `centre = player.xz + cameraForwardXZ.normalized × SHADOW_FORWARD_OFFSET`. Starting values for the A/B: half-extent **56 m**, forward offset **24 m** (covers ~80 m ahead like today, ~32 m behind, ±56 m sideways; the light-space footprint along the sun azimuth is longer than the half-extent because the sun is oblique).
3. `shadowBudget`: pass the **shadow centre** instead of the player position, so a camera turn that moves the frustum also triggers a refresh (today only player movement does). No new dirty hooks.
4. Query flag `?shadowFrustum=legacy` restores ±80 centred on the player (same pattern as `?frameMatrixOnce=0`). Default **off (legacy)** until the WSL A/B green light and the author's visual OK.

Side effect (positive, still a visual change): texel size 160/1024 = 0.156 m → 112/1024 = 0.109 m, i.e. sharper near shadows at the same map size.

Risks to check: shadows missing at the side edges of a wide view at distance; shadow "edge" popping while turning the camera quickly; water-mirror reflections of the area behind/beside the player (the mirror pass reuses the sun shadow map); tall casters behind the camera whose shadow falls into view (covered by the 32 m back margin — verify at low sun in the evening fixture).

Expected structural effect (to measure, not claimed): fewer shadow-pass submissions for every static family (`decor`, `houseStatic`, vegetation, terrain chunks); actors unchanged (already 36 m-limited).

## S2 — half-rate shadow refresh for actor-only motion

Change in `src/render/shadowBudget.ts` (pure function + unit tests, owner of cadence per plan 145 / world-terrain-038):

- If the player/shadow centre moved → refresh every frame (unchanged).
- If the only trigger is `hasNearbyShadowCaster` → refresh every **2nd** frame (`framesSinceUpdate >= 1`).
- Stale cap (10 frames) unchanged.
- Flag `?shadowActorCadence=1` enables it; default off until A/B + visual OK.

Consistency: when the map is not re-rendered, three keeps the old `shadow.matrix` with the old map (it is updated inside `WebGLShadowMap.render`), so a skipped frame shows a coherent one-frame-old shadow, not a misaligned one — the same mechanism R1 already relies on.

Visual trade-off (author decision): NPC/animal shadows lag up to one frame while the player stands still (≈ 4–5 cm at walking speed and 30–35 FPS). Gain is limited to the stationary-player case (talking, trading, standing in a village; also the benchmark fixture if its camera is static — check before reading the numbers).

## Measurement (per slice, one variable per A/B)

- WSL `settlement` (fixture `tools-001-v1`), n = 3 per arm, A B B A. Structural: shadow-pass calls per family (`passSubmissions`), `shadowRefreshFrames`. Guards: frame p50/p95/p99, render p50, long frames. Also `forest` and `evening`/low-sun if a fixture exists, for S1 coverage.
- Then native Windows Arc A/B; revert if Windows regresses. Never mix WSL and Windows numbers.
- Browser/visual (author, `?seed=415424794`): default vs flag in a settlement at noon and at low sun; quick 360° camera turn; water edge with reflections; walking NPC shadows with the player standing (S2).

## Done when

Each slice: implemented behind its flag, unit tests (S1 centre/texel snap with a custom half-extent; S2 cadence decisions), type-check/lint/test/build green, WSL A/B report in `docs/performance/results/`, author keep/revert decision recorded here and in the queue. Flip the default only after both A/Bs and the visual OK.

## Non-goals

Cascaded shadow maps, static/dynamic shadow-map split, shadow map size change, new dirty hooks, NPC/fauna shadow distance, settlement tree instancing, reflections.

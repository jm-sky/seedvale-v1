# Improvement Inbox — SeedVale V1

Quick, untriaged observations from playtesting. These are **not approved plans**, verified root causes, or implementation commitments. Convert to a numbered issue or plan only after targeted recon, removing or cross-linking the entry to prevent duplicate ownership.

Status for every entry: `todo` (unverified). Created: 2026-10-29. IDs here (`IMP-...`) are local to the inbox and do not consume numbered issue IDs.

## IMP-001 — Fog sprites follow player movement
- **Observation:** Fog clumps/sprites appear to move away or drift with the moving character.
- **Investigate:** Compare V1 behavior and anchoring/position updates to V3; distinguish world-space fog from intended camera-relative effects.
- **Area:** atmosphere / world-terrain.

## IMP-002 — Some bushes are overly low-poly
- **Observation:** Certain bush models look visibly too low-poly.
- **Investigate:** Identify affected V1 assets and inspect the improved bush model reportedly present in V3; evaluate selective adaptation and render cost.
- **Area:** vegetation / world-terrain.

## IMP-003 — Swimming in visually shallow streams
- **Observation:** The player can enter swimming mode and become waist-deep in a stream that visually looks about 10 cm deep, appearing to sink into terrain.
- **Investigate:** Compare stream surface, terrain/riverbed elevation, water-depth calculation, swim thresholds and player visual/root positioning.
- **Expected:** Movement/swimming state and character placement match visually represented water depth.
- **Area:** world-terrain / items-player.
- **Status (2026-11-03):** root cause found — `PlayerController` took the swim branch for any eligible water sample with no depth gate (streams ~0.12 m deep included). Fixed (stage A): swimming now starts at depth 1.2 m and ends below 1.0 m (hysteresis, `nextSwimming` in `worldWaterEligibility.ts`); shallower water is waded as normal grounded locomotion, feet on the bed (`wadeFeetY`; lake/ocean ground is clamped to the water plane so the true floor is used there). `MAX_SWIM_DEPTH` (visual cap) unchanged; no worldgen/river changes. Stage B (riverbank bed vs carved terrain mismatch) not confirmed or implemented; **author in-game check pending** (stream centre/banks, ford, shallow lake edge, deep transition).

## IMP-004 — Distant cave entrances leave bright terrain holes
- **Observation:** At long range cave entrance geometry stops rendering while its terrain cutout remains visible, leaving a glowing white hole.
- **Investigate:** Cave entrance visibility, culling/LOD and streaming transitions versus terrain-hole masking.
- **Expected:** No uncovered bright terrain cutouts at any viewing distance.
- **Area:** world-terrain.
- **Related:** [existing cave-mouth issue 026](./2026-08-12--026--cave-mouth-flat-prop-not-a-hole.md) (different reported symptom; check overlap before creating a new issue).
- **Status (2026-10-30, Q10):** root cause found — the distant mouth proxy left an open band between the terrain cut edge and its fan, so low sight lines passed under the single-sided terrain to the sky. Fixed with a proxy skirt (D4 exception, workload-neutral); **author visual check pending**. See [Q10 recon](../research/v1-revival/2026-10-30--q10-cave-polish-recon.md).

## IMP-005 — Female Hunter offered primary hunter quest in home settlement
- **Observation:** A woman assigned as `Hunter` in the home settlement offered the hunter quest.
- **Author's desired behavior:** The principal hunter and primary hunter quest giver should be male; his wife has a supporting household role rather than being the principal hunter.
- **Investigate:** Role/profession generation, household assignments, quest-giver selection and Hunters Brotherhood authored roles. Treat the desired rule as an author content constraint to scope, not as an already-verified implementation contract.
- **Area:** settlements-npcs / quests-progression.

## IMP-006 — Player and NPC models look too dark in sunlight
- **Observation:** Player/NPC characters remain somewhat dark even when standing in direct sunlight; sun illumination is not perceptible.
- **Investigate:** Materials, normals, directional/ambient lights, shading, tone mapping and any character-specific rendering paths, using reproducible scene conditions.
- **Expected:** Characters visibly respond to sunlight without artificial brightness detached from environment lighting.
- **Area:** character rendering / npc / world.

## IMP-007 — Sheep have no Walk animation
- **Observation:** Sheep have a `Jump` animation but no `Walk` animation.
- **Candidate approaches:** Evaluate using `Jump` temporarily for locomotion, or author a dedicated `Walk` animation in Blender later. Neither approach is approved yet.
- **Investigate:** Current sheep GLB clips, animation state mapping and whether the jump clip is suitable for a walk loop.
- **Status (2026-11-03):** implemented — sheep (Idle + Jump only) loop `Jump` as walk via `walkClipFallbacks`. Awaiting author's visual check; dedicated Blender Walk still the long-term fix.
- **Area:** fauna / animation / assets.

## IMP-008 — Settlement animals sometimes move too fast
- **Observation:** Animals, including sheep, horses and dogs, sometimes walk too quickly around settlements.
- **Investigate:** Actual movement speeds and state transitions versus animation playback rate, species-specific tuning and settlement behavior; avoid changing authoritative locomotion solely to mask visual mismatch.
- **Status (2026-11-03):** implemented — `calmWalkSpeed` for sheep 1.2 / dog 1.9 / donkey 1.4 (horse 1.35 existing); owned Follow now walks and only runs (gallop clip, stamina) after falling >20 m behind (was always sprint speed on the Walk clip); locomotion clip playback rate follows real speed. Awaiting author's visual check.
- **Area:** fauna / settlements / animation.

## IMP-009 — House lamps should light only at night
- **Observation:** Lamps mounted on houses are lit during daytime.
- **Expected:** House lamps illuminate only at night, following authoritative world day/night state; keep visual emissions and actual light sources in sync.
- **Investigate:** Existing day/night controls, lamp materials and light lifecycle, including distant/streamed settlements and performance.
- **Status (2026-11-03):** implemented — cause: GLB lantern glass (`ElwFor_Lantern_Light`) is a plain lit yellow base colour with no emissive, so it looked "on" in daylight. `createHouseLight` is now strictly two-state at `NIGHT_FIRE_THRESHOLD` (glass swaps between shared on/off material clones; PointLights visible only when on). Awaiting author's visual check (day/night, browser not run by agent). Interior table lamp (`lamp.glb`) is a static mesh with no light — untouched.
- **Area:** settlements / world / rendering.

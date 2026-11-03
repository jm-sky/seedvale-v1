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
- **Area:** fauna / animation / assets.

## IMP-008 — Settlement animals sometimes move too fast
- **Observation:** Animals, including sheep, horses and dogs, sometimes walk too quickly around settlements.
- **Investigate:** Actual movement speeds and state transitions versus animation playback rate, species-specific tuning and settlement behavior; avoid changing authoritative locomotion solely to mask visual mismatch.
- **Area:** fauna / settlements / animation.

## IMP-009 — House lamps should light only at night
- **Observation:** Lamps mounted on houses are lit during daytime.
- **Expected:** House lamps illuminate only at night, following authoritative world day/night state; keep visual emissions and actual light sources in sync.
- **Investigate:** Existing day/night controls, lamp materials and light lifecycle, including distant/streamed settlements and performance.
- **Area:** settlements / world / rendering.

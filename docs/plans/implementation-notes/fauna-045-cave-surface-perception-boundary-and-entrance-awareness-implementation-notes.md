# Implementation notes: fauna-045 — cave/surface perception boundary and entrance awareness

**Plan:** [fauna-045](../fauna-045-cave-surface-perception-boundary-and-entrance-awareness.md)  
**Recon baseline:** reviewed against `main` at `cb11d119` on 2026-09-20; current code remains authoritative if `main` advances

## Current-code reality

The plan is directionally correct, but the current seams are more specific than the plan text implies:

- `WorldSpatialContext` already exists in `src/world/spatialContext.ts` and is intentionally tiny: `surface | cave:<id>`; keep it unchanged.
- `Caves.spatialContextAt(x, y, z)` in `src/world/createCaves.ts` is already the authoritative stateless XYZ query. It resolves strict heightfield occupancy and deliberately maps `openSky` mouth occupancy to `surface`.
- `createCaves()` already owns `v2ByCaveId: Map<string, CaveRuntime>`, so an exact cave-id entrance query can be O(1); do not scan `definitions()` or all cave heightfields.
- fauna-042 is already implemented: wild fauna has one `FaunaProximityIndex` rebuilt once per `Fauna.update()`, with snapshot candidate semantics. Extend that pipeline; do not create another proximity grid.
- wild predator → livestock and predator → NPC candidates are caller-composed bounded sets, not members of the wild fauna grid.
- `nearbyHumanCount` is currently precomputed in `gameLoop.ts` from player + loaded NPC X/Z only. That count is therefore spatially wrong across cave roofs even if wild-animal candidate filtering is fixed.

## Ownership / architecture

### World owns the boundary and entrance seam

Keep both spatial classification and entrance-awareness geometry under `Caves`.

Recommended shape: expose one small stateless cave-owned query that answers whether two *different* contexts are allowed to perceive each other through the matching cave entrance, e.g. an equivalent of:

`canPerceiveAcrossEntrance(caveId, aPos, bPos): boolean`

The exact name is not important. The ownership is.

The fauna layer should only combine:

1. already-derived actor contexts,
2. exact cave id from the cave-side context,
3. the world-owned entrance query.

Do not move `mouthCarve` geometry, topology, heightfield sampling, or cave lookup rules into fauna.

### Reuse the retained cave runtime

For `cave:<id>`, resolve the runtime through `v2ByCaveId.get(caveId)`.

The current mouth geometry already has shared semantic inputs:

- `CaveHeightfieldRepresentation.entrance`;
- `deriveMouthGeometry(...)` / `CaveMouthGeometry` in `src/world/caves/mouthCarve.ts`;
- `mouthAlong` / `mouthLateral`;
- the heightfield `openSky` aperture semantics.

Use these rather than distance to `CaveDefinition.bounds`, cave presentation objects, mouth rocks, or streamed meshes.

The entrance exception should be a short corridor around the actual doorway: bounded lateral distance around the aperture and bounded inward/outward distance around the mouth plane. It should key off the requested `caveId` only. Avoid a circular "near entrance position" rule large enough to leak through the hillside beside/above the aperture.

Do not change `spatialContextAt()` so the mouth becomes `cave`. Its current `openSky => surface` behavior is intentional and used by player interaction.

## Fauna integration

### Compose context once per pass / actor

Do not call `Caves.spatialContextAt()` from every candidate-pair predicate.

The existing fauna pass is:

`proximity.rebuild(agents) -> sequential AnimalAgent.update(...) -> removals -> respawns`.

Add a derived context snapshot at the same composition level, or otherwise cache context once per live actor for the pass. It must be derived only, not persisted and not stored as authoritative animal state.

Because fauna-042 accepts one-pass proximity snapshot semantics, context may use the same practical pass snapshot contract. Live exact distance/liveness checks remain unchanged.

For caller-owned sets, resolve context while composing them rather than repeatedly inside each predator:

- player: once per fauna pass from current XYZ;
- loaded NPCs: once while building the existing bounded `nearbyNpcCandidates`;
- huntable livestock: once while composing the existing bounded livestock encounter view, or through a parallel derived view keyed by `animalId`.

Do not merge livestock/NPCs into `FaunaProximityIndex`.

### Centralize spatial eligibility inside AnimalAgent

Add one small reusable eligibility helper for perception candidate checks rather than duplicating cave logic across prey, player and NPC branches.

Contract:

- equal contexts -> eligible;
- cave A vs cave B -> ineligible;
- cave A vs surface -> eligible only when `Caves` says both positions are inside cave A's entrance-awareness seam;
- surface vs cave A -> same rule, symmetric.

Keep `faunaDecision.ts` and `predatorHumanDecision.ts` pure scorers. They should receive only already-eligible inputs.

### Committed targets must revalidate spatial eligibility

`resolvePreyTarget()` currently keeps a committed target while membership + liveness + XZ range remain valid. Add the same spatial eligibility check there; otherwise an already-acquired target can walk onto the other side of a cave roof and remain locked until it exceeds `detectRange`.

Apply the same principle to committed player/NPC predator intent: when the source human is cross-space invalid, clear/suppress the encounter before scoring/chasing, rather than merely preventing fresh acquisition.

### Prey/threat scans

The fauna proximity grid remains X/Z and should remain so. Its job is only broad-phase candidate narrowing.

Filter candidate spatial eligibility after `forEachNear()` / bounded candidate composition and before nearest/threat scoring. This preserves fauna-042's performance win and avoids making cave context part of hash-grid identity.

Secondary alert/vocalization inputs must not let an otherwise invalid source threat cross the boundary indirectly. Filter the source threat by the same policy before it enters prey/guard response logic; do not create a separate "sound cave rule" in this plan.

## Human / NPC crowd count

Current `countNearbyHumans()` in `predatorHumanDecision.ts` accepts only `{x,z}` and `gameLoop.ts` computes one global player-centered count before fauna update.

That value cannot be reused unchanged for a cave predator because an NPC above the cave may incorrectly contribute fear/crowd pressure.

Do not move NPC scanning into each animal. Keep the bounded precomposition, but carry enough derived data (`y` + context, or a prebuilt context-aware candidate view) so the predator's crowd count is evaluated against its current spatial eligibility.

For player-target scoring, "nearby humans" should mean humans near the player *and perceptually in the same/entrance-connected space as the predator/player encounter*. For NPC-target scoring, the existing per-target crowd loop in `AnimalAgent.buildNpcDecisionInput()` also needs the same spatial filter; it currently compares only X/Z.

This is a behavioral-input fix, not a reason to redesign `predatorHumanDecision.ts`.

## Cave-resident animals

Do not use `AnimalCaveContext`, `this.cave`, habitat binding, den/spawner id, or territorial habitat as current spatial context.

A cave resident physically outside must classify as `surface` from its current mesh XYZ. Habitat remains relevant only to movement/territorial behavior.

## Files likely to change

Primary:

- `src/world/createCaves.ts` — cave-owned entrance-awareness query, exact `v2ByCaveId` lookup.
- `src/world/caves/mouthCarve.ts` only if a small pure entrance-corridor helper belongs beside the existing shared mouth geometry.
- `src/fauna/AnimalAgent.ts` — consume derived contexts, central eligibility helper, revalidate committed prey/player/NPC inputs.
- `src/fauna/createFauna.ts` — pass-level derived context composition and API plumbing.
- `src/app/gameLoop.ts` — player/NPC/livestock XYZ/context composition; remove the assumption that one 2D crowd count fits every predator.
- `src/fauna/predatorHumanDecision.ts` — keep scorer pure; only adjust `countNearbyHumans` contract if it remains the chosen bounded helper.
- `src/app/faunaEncounterComposition.ts` — only if the livestock encounter view is extended to carry derived spatial context.

Tests should be focused around the pure/world entrance predicate plus AnimalAgent acquisition/commitment behavior. Do not require rendered cave presentation.

## Pitfalls

- Do not compare `WorldSpatialContext` objects by reference; use `spatialContextsEqual()` or equivalent semantic matching.
- Do not make `spatialContextAt()` hysteretic; perception needs current physical XYZ, not player audio/fog continuity.
- Do not use `queryInterior()`; it is channel-stateful and intentionally hysteretic.
- Do not call `occupancyAt()` or `spatialContextAt()` repeatedly for the same actor/candidate pair.
- Do not turn cave entrance awareness into movement permission; existing cave traversal remains authoritative.
- Do not let cave A's entrance authorize cave B.
- Do not use Euclidean/Y distance alone as the boundary test: actors vertically close through solid rock must remain separated.
- Preserve fauna-042 snapshot lifecycle and `proximity.has()` global-membership semantics.

## Implementation order

1. Add/test the cave-owned exact-cave entrance-awareness predicate using retained runtime + shared mouth geometry.
2. Add a small fauna spatial-eligibility adapter over `WorldSpatialContext` + entrance predicate.
3. Compose/carry current contexts once for wild animals, player, bounded NPCs and livestock.
4. Apply eligibility to fresh wild prey/threat discovery and livestock selection.
5. Revalidate committed prey and player/NPC predator encounters.
6. Make crowd-count inputs spatially valid without introducing per-animal global NPC scans.
7. Add regression tests for closed roof, matching mouth, wrong cave id, resident-on-surface, and committed-target boundary crossing.

## Model assessment

Use source-plan metadata:

`**Model:** Grok, Composer`

This crosses world-owned cave geometry, fauna-042 snapshot semantics, several candidate pools, and committed predator intent. Grok is the safer primary choice for the multi-file reasoning. With these seams explicit, Composer is the cheaper fallback with limited additional risk.

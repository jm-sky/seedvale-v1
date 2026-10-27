# Implementation Notes: npc-064 — NPC spatial state seam

**Created:** 2026-10-27

**Scope:** Stages 0A and 0B; test-only characterization. Runtime refactor not implemented.

**Baseline (0A):** V1 `main` at `68fe0ec38f572bab24db8a4ad5b19b9d4b9cf447`. No changes to `NpcAgent.ts`, `npcMovementTarget.ts`, `npcMovementRoute.ts` or `slopeConstraint.ts` between recon SHA `d70b5c074955143090cb531ac80c08f6d065f4e8` and that baseline.

**Baseline (0B):** V1 `main` at `9d97064967cb8ce4bc5625d0d7fa55ae98457e84` (working tree clean at session start; Stage 0A landed as `98d0b7ed`). No runtime NPC/movement owner edits in this stage.

## Stage 0A outcome

Added [`NpcAgent.spatial.test.ts`](../../../src/ai/NpcAgent.spatial.test.ts): **21 tests** using real fallback NPC agents and a typed private-access harness. Covers flat displacement/arrival, resident-ground hold, exact surface sample order, X-only and Z-only water fallback, fully blocked movement, cave floor and mouth fallback, actual composed-route execution and target retention, separation after update without Y correction, cave resolver-returned coordinates, local/emergency recovery, well/player/combat facing, coincident ranged `+PI`, front/back defense and fallback death roll.

Review corrections before commit:

- Fixed import ordering and an unused parameter found by lint/type-check.
- Split horizontal fallback into X-only and Z-only cases with exact expected displacement.
- Asserted the full surface sample sequence rather than only its last sample.
- Exercised `stepComposedRoute` with its committed target and asserted actual movement; direct steering alone did not prove route execution.
- Chose a cave separation fixture where both returned coordinates differ from the old pose and raw nudge, detecting a no-op or discarded resolver result.
- Replaced the nonnegative RNG-count assertion with exact zero draws for emergency anchor/rim selection.
- Kept the NPC alive throughout both defense directions so the back-facing check cannot pass through the dead-agent early return.

No runtime, movement policy, RNG policy, save schema or fauna changes. The new tests deliberately arrange position/yaw/roll through mesh writes because this is the current-authority baseline. Before authority switches, migrate these setup writes to the private centralized writer harness in Stage 3B, retaining explicit mesh parity checks.

## Stage 0B outcome

Added [`NpcAgent.spatialLifecycle.test.ts`](../../../src/ai/NpcAgent.spatialLifecycle.test.ts): **15 tests**. Existing suites (`NpcAgent.timeSkip`, `npcTravel`, `npcOffscreenSurvival`, `npcState`, `npcPresentationOwner`, `npcPostDeath`) were **not** extended — pure-policy coverage already lives there; new cases are real-agent lifecycle/wiring.

Coverage:

1. **Constructor precedence:** ordinary home + sampled Y; living travel reify (XZ + resampled Y, purpose kept, no home reset); active corpse XYZ/yaw over travel; legacy/terminal dead without corpse teleport.
2. **Detailed checkpoint → registry → reconstructed agent:** accompany follow, travel XZ, bread/waterskin provisions, transport cargo; no offscreen execution from detailed stamp; ordinary resident snapshot has null travel and no universal pose fields.
3. **Detailed → offscreen → reify:** live-position handoff; second handoff does not mint a second executor; survival catch-up is not double-applied on repeated checkpoint resolve; reified agent keeps purpose without execution.
4. **Manager wiring probe:** production-sequence `snapshotNpcStates` / `unload` loops over real agents + registry; source-order guard on `SettlementsManager.ts` (sync before serialize; travel handoff before dispose); behavioral proof that serialize without sync keeps stale XZ while the probe syncs live XZ; unload call order handoff→dispose with live from-position.
5. **Loaded time-skip:** surface schedule placement to home; committed travel progression with Y resample and action clear; cave/mouth hold (no surface projection to destination).
6. **Death during travel:** purpose-backed travel becomes blocked at live pose; active postDeath; reconstructed corpse pose/yaw. Presentation-owner and postDeath loot/phase policy remain owned by existing settlement suites (run in the 0B bundle, not duplicated).

No runtime, save schema, fauna, spatial API, registry, or movement-engine changes.

### Remaining gaps after 0B

- Full `createSettlementsManager` end-to-end stream-out/in (probe + source guard, not a world bootstrap).
- Browser/manual M clips: motion/crowd/cave/combat before Stage 3A; stream/reload/skip/corpse/visitor before 3B.
- Stage 1 reader API and later authority switches not started.
- Interaction payload live-view freshness and consumer decoy-mesh proofs belong to Stage 2.

## Verification

### Stage 0A (landed)

```sh
pnpm exec vitest run src/ai/NpcAgent.spatial.test.ts src/ai/npcMovementSurfaceRegression.test.ts src/ai/npcCaveLocomotion.test.ts src/ai/npcMovementCaveIntegration.test.ts src/ai/npcMovementRoute.test.ts src/ai/npcCrowd.test.ts src/ai/npcCombat.test.ts src/ai/NpcAgent.combatMode.test.ts src/terrain/slopeConstraint.test.ts
pnpm exec eslint src/ai/NpcAgent.spatial.test.ts
```

**PASS:** 9 files / 127 tests, including 21/21 in the new suite; focused lint passed.

### Stage 0B (this session)

```sh
pnpm claude:preflight npc-064
pnpm exec vitest run \
  src/ai/NpcAgent.spatialLifecycle.test.ts \
  src/ai/NpcAgent.spatial.test.ts \
  src/ai/NpcAgent.timeSkip.test.ts \
  src/ai/npcTravel.test.ts \
  src/ai/npcOffscreenSurvival.test.ts \
  src/settlement/npcState.test.ts \
  src/settlement/npcPresentationOwner.test.ts \
  src/settlement/npcPostDeath.test.ts
pnpm exec eslint src/ai/NpcAgent.spatialLifecycle.test.ts
pnpm run type-check
```

**PASS:** 8 files / **130 tests** (15/15 in `NpcAgent.spatialLifecycle.test.ts`); focused ESLint passed.

**Global type-check limitation (unchanged baseline):** `pnpm run type-check` exits 2 with the same five existing TS2345 `Object3D` versus `Group` errors in `src/tools/assetBrowser/viewer/mountCompareGarments.test.ts` at lines **44, 77, 99, 100 and 115**. The new lifecycle suite contributes **no** diagnostics. Do not report a globally passing type-check; do not repair the asset-browser file in this stage.

No build, full-suite run, browser/manual verification or performance measurement was performed.

## Remaining gates and next session

Manual M motion/crowd/cave/combat reference clips remain required before Stage 3A. Manual stream/reload/skip/corpse/visitor observations remain required before Stage 3B. Keep the parent plan **incomplete** (`draft`); do not begin Stage 1 until 0A/0B are accepted and separately authorized.

Push and Stage 0B commit are **not** authorized by this documentation update alone — commit only when the author explicitly authorizes:

`test(npc): lock spatial checkpoint and reification contracts`

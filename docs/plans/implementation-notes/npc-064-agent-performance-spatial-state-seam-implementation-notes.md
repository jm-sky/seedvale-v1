# Implementation Notes: npc-064 — NPC spatial state seam

**Created:** 2026-10-27

**Scope:** Stage 0A only; test-only characterization. Runtime refactor not implemented.

**Baseline:** V1 `main` at `68fe0ec38f572bab24db8a4ad5b19b9d4b9cf447`. No changes to `NpcAgent.ts`, `npcMovementTarget.ts`, `npcMovementRoute.ts` or `slopeConstraint.ts` between recon SHA `d70b5c074955143090cb531ac80c08f6d065f4e8` and this baseline.

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

No runtime, movement policy, RNG policy, save schema or fauna changes. The new tests deliberately arrange position/yaw/roll through mesh writes because this is the current-authority baseline. Before authority switches, migrate these setup writes to the private centralized writer harness in Stage 3B, retaining explicit mesh parity checks. The original recon's “no real NPC test writes found” described the pre-0A source and is historical, not a current restriction.

## Verification

The original Composer report recorded preflight success and 20 tests / 9 files / 126 tests passed before review. The focused commit review reran:

```sh
pnpm exec vitest run src/ai/NpcAgent.spatial.test.ts src/ai/npcMovementSurfaceRegression.test.ts src/ai/npcCaveLocomotion.test.ts src/ai/npcMovementCaveIntegration.test.ts src/ai/npcMovementRoute.test.ts src/ai/npcCrowd.test.ts src/ai/npcCombat.test.ts src/ai/NpcAgent.combatMode.test.ts src/terrain/slopeConstraint.test.ts
pnpm exec eslint src/ai/NpcAgent.spatial.test.ts
```

**PASS:** 9 files / 127 tests, including 21/21 in the new suite; focused lint passed. `git diff --check` passed.

**Global type-check limitation:** `pnpm run type-check` fails with five existing TS2345 `Object3D` versus `Group` errors in `src/tools/assetBrowser/viewer/mountCompareGarments.test.ts` at lines 44, 77, 99, 100 and 115. After correcting the new test's unused parameter, it contributes no diagnostics. A temporary tsconfig extending the repository config and excluding only `NpcAgent.spatial.test.ts` (with the repository type roots retained for resolution from `/tmp`) reproduces the same five errors; the asset-browser file is outside this stage and was left unchanged. Do not report a globally passing type-check.

No build, full-suite run, browser/manual verification or performance measurement was performed in this review.

## Remaining gates and next session

Manual M motion/crowd/cave/combat reference clips are still required before Stage 3A, not before landing this test-only baseline. This suite does not prove full world stream/rebuild/save lifecycle parity; **Stage 0B** supplies focused lifecycle, checkpoint and manager-wiring coverage next. Keep the parent plan incomplete and do not begin the reader API or authority switches yet.

The user authorized the focused Stage 0A commit, including these review corrections and status documentation. Push and Stage 0B implementation are not part of that authorization. Independent HUD/trade working-tree changes are excluded from this commit.

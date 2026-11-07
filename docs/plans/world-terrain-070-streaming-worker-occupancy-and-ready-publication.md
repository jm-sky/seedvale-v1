# Plan: Streaming and actor publication — worker occupancy, grass identity, measured ready-publication bounds

**Created:** 2026-11-06
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** L
**Depends on:** tools-027
**Domain:** `world-terrain`
**Subdomains:** `chunks` `vegetation` `rendering`
**Tags:** `streaming` `workers` `performance` `lifecycle` `v1-revival` `review-041`
**Roadmap:** -

## Goal

Two layers from [review 041](../reviews/2026-11-06--041--rendering-performance-final-critical-synthesis.md):

1. **C1 — confirmed correctness now** (class A2): worker physical occupancy vs logical cancellation (F16-14) and the initial-grass callback identity race (F16-15). Independent of measurement.
2. **P — measured publication work later** (class B2 / stage S3): terrain/grass ready publication (F16-12), settlement actor presentation publication (F16-21), regional instance rebuild amplification (F16-13) and first-use program/upload gaps (F16-17). **Measure first**; no batch size, concurrency limit or rebuild strategy is chosen by this plan.

| Stage | Findings | Owner (verified 2026-11-06) | Start condition | Queue |
| --- | --- | --- | --- | --- |
| **C1** | F16-14, F16-15 | `src/terrain/chunkWorkerPool.ts` (`cancelByNamespacedKey` ~L399 deletes the `inflight` record while the worker stays out of `free`; `canStartBackground` counts `inflight` → logical headroom admits another background job), `src/terrain/chunkManager.ts` (`ensureGrass` ~L1716: `.then`/`.catch` guard by `chunks.get(key)` only — the `.catch` sets `rec.grassPending = false` on a replacement record; filler/main paths already guard by request id) | ready | Q176 |
| **P1** measurement | F16-12, F16-21, F16-13, F16-17 baseline | traces from [tools-027](./tools-027-frame-attribution-and-benchmark-provenance.md) T2 | Q183 + Q176 done; author consent for WSL series (runbook §WSL stability) | Q185 |
| **P2** terrain/grass ready publication bound | F16-12 | chunk drain / `runFinalize`, grass completion callbacks in `chunkManager.ts` | P1 shows concentrated ready→attach/first-draw bursts in p95/p99 | row added by P1 |
| **P3** settlement actor presentation publication | F16-21 | `createSettlement.ts` (`flatMembers.map(async …)` ~L1516), `SettlementsManager.ts`, `assembleCharacter.ts`; **coordinate with [settlements-023](./settlements-023-settlement-streaming-lifecycle-and-construction-rollback.md) Stage B rollback** | P1 shows settlement-arrival hitches attributable to assembly/attach; settlements-023 acceptance contract respected | row added by P1 |
| **P4** regional instance update | F16-13 (+ F16-16 granularity together with [world-terrain-040](./world-terrain-040-vegetation-render-budget-v2.md) Stage 2) | `vegetationRegionBatcher.ts` membership integration | P1 counts survivor rebuilds/bytes on border traversal as significant | row added by P1 |
| **P5** selective prewarm extension | F16-17 | `src/render/programPrewarm.ts` (plan [149](./2026-08-17--149--shader-program-first-use-hitch.md)) | P1 cold/warm program census shows specific post-warmup families | row added by P1 |

## Direction

- **C1 pool:** keep a cancelled-but-running job counted as physically occupying its worker (and in background accounting) until that worker's response arrives; the response is then discarded. Do not terminate/respawn workers on cancel. **C1 grass:** give the initial grass request a request id like filler/main (`grassRequestId`) and check it in both `.then` and `.catch`.
- **P stages:** bound **ready publication** in the current owner (chunk/grass or settlement), never authoritative population/simulation acceptance; preserve stale guards, rollback, stable identities; no global frame scheduler, no density/vegetation reductions.

## Verification

- **C1:** deterministic pool test with two workers: cancel a running background job, enqueue background + foreground — the foreground job is not delayed by a phantom free slot and background headroom is not exceeded; stale result rejected. Chunk-manager test: unload + reload of the same key with the old grass request resolving/rejecting late does not touch the replacement record's pending state or attach a second mesh.
- **P1:** reference seed `415424794`, cold/warm `stream` + `settlement-walk`, start/ready/attach/first-draw timestamps, bytes, program ids, p50/p95/p99/max; WSL and Windows reported separately. Output: a note deciding which of P2–P5 proceed, with numbers.
- **P2–P5:** each a revertable commit with WSL A/B per queue §0 rules, Windows confirmation via §4; no FPS claim without matched evidence.

## Stop if

- Any P stage would delay authoritative activation, show missing/late models visibly, or reduce vegetation/NPC density → author.
- P1 evidence is ambiguous → O judgement, not S.

## Implementation status

- **C1 (Q176, Sonnet 2026-11-07) — implemented, technically verified (pool); grass guard not covered by a manager-level test.** `chunkWorkerPool.ts`: cancelling a running job moves it to an `orphaned` map (caller promise rejected as before) that keeps counting toward background headroom and `busyCount` until that worker's response (or death) arrives; no terminate/respawn. Test: `chunkWorkerPool.test.ts` ("keeps a cancelled running background job counted…"). `chunkManager.ts`: initial grass request carries `grassRequestId` (shared `grassSideRequestSeq`), checked in `.then` and `.catch`; `removeGrass` clears it. **Gap:** no `createChunkManager` test harness exists in the repo, so the unload + reload late-resolve/reject case from the plan is untested — loose end (needs a mocked pool + minimal config harness).

# Q25 — multi-second `NPC` frames on the long `stream` route: recon + slice plan (2026-10-30)

**Author:** Claude Opus 5.5 (queue Q25, O→S). **Platform of all numbers:** WSL2 Chrome (OpenGL/Mesa D3D12) — never compare with Windows.
**Status:** recon done; implementation = queue **Q26** (S). No runtime behaviour changed by this task (only perf stage spans, `b3b52815`).

## 1. Finding

The three frames of ≈ 7.6 s / 5.4 s / 4.5 s on the 90 s `stream` route ([Q22 report](../../performance/results/2026-10-30--wsl-q22-river-prefetch-ab.md#findings-from-this-attempt)) are **not NPC simulation**. They are synchronous **settlement unique-name resolution** inside `SettlementsManager.recheck()` (the stream-in check, timed under the `NPC` category because it runs in `settlementsManager.update()`).

Evidence, `stream` `&benchDuration=90`, SHA `b3b52815` (stage spans added in that commit), artifacts `docs/performance/results/wsl/q25r-stream-rep1.*`:

| Frame | `settlementDefResolve` | of which `settlementDefName` | `settlementDefResidents` | `settlementDefGenerate` |
| --- | --- | --- | --- | --- |
| 7628 ms (t ≈ 21 s) | 7608 ms | 6918 ms | 646 ms | 44 ms |
| 5345 ms (t ≈ 42 s) | 5323 ms | 5174 ms | 0.4 ms | 148 ms |
| 4516 ms (t ≈ 30 s) | 4500 ms | 4339 ms | 0.3 ms | 160 ms |

A second diagnostic rep with temporary (not committed) probe counters in `namingInputsFor()`:

| Frame | site probes | probe ms | ms/probe | rings probed (Chebyshev from home) |
| --- | --- | --- | --- | --- |
| 7627 ms | 121 | 7550 | 62 | 0–5, every cell (1 + 8 + 16 + 24 + 32 + 40) |
| 5348 ms | 55 | 5170 | 94 | 7 (52) + 6 (3) |
| 4508 ms | 45 | 4330 | 96 | 6 (45) |

`streamingCumulativeMs` (agent CPU diag) ≈ the sum of the three frames in every Q22 rep, both arms — the same deterministic event every time; unrelated to river prefetch. `unload`, `ensureLoaded` and travel checkpoints are ≤ 6 ms.

## 2. Mechanism (current code)

- `settlementDefFor(cell)` (`src/settlement/settlementPlanCache.ts`) on a `defCache` miss calls `uniqueNameFor(cell)`. Plan "names unique without stream-order state" (`3f37eb33`) makes a cell's name depend on the names of **all predecessor cells** in name order: every cell of every lower Chebyshev ring around home plus earlier cells of its own ring (`predecessorSettlementCells`). Each predecessor needs a `probeSettlementSite()` (site search + terrain class + dominant resource) — **≈ 60–100 ms each on WSL**.
- So the first miss in ring *r* costs a probe for every not-yet-probed cell of rings 0…*r*, **regardless of travel direction** (O(r²) globally). Entering a new ring pays its 8r cells.
- Why the first frame re-probes rings 0–5 although the boot fixture/IndexedDB holds 106 `SettlementDef`s: hydrated defs fill only `defCache`; `namingInputCache` / `uniqueNameCache` are in-memory only, and `uniqueNameFor` never looks at `defCache`. The same miss also runs the Lost Treasure host-cell searches (`elderHostCellFor` radius 1, archaeologist/specialist radius 5 → `probeCandidatesWithin` → `namingInputsFor`), memoized per world, never persisted (the 646 ms above, cheap only because naming had just probed most of those cells).
- **Player impact, not benchmark-only:** a real player with a persistent worldgen cache hits the same re-probe on the first unseen cell of every session; on a fresh world every new ring costs 8r probes in one frame. Windows numbers unknown (CPU-bound sampling, expected same order of magnitude) — not claimed.

## 3. Options

| | Option | Effect | Contract / risk |
| --- | --- | --- | --- |
| **E4a** | `uniqueNameFor`: if `defCache` already holds the cell, use `def?.name ?? null` instead of probing | Removes re-probing of every cell whose def is cached (fixture, IndexedDB, earlier in session) | Exact, no format change: `def == null ⇔ site == null ⇔ uniqueName == null` (`generateSettlementCore` returns null only on `!site`; `probeSettlementSite` always sets `terrain` with a site), and a cached def's `name` is the applied unique name (`settlementDefFor` applies it before `remember`; the persistent cache, `8220a3e2`, postdates unique naming `3f37eb33`, and naming is a version-bump trigger). Does **not** cover never-resolved predecessors or the host searches. |
| **E4b** | **Worker naming-probe prefetch**: after world activation and on each `recheck`, request `SettlementSiteProbe`s from the chunk worker for every not-yet-probed cell of rings 0…(player ring + 1) (always 0…5 at activation for the host searches), in name order; main ingests them into `namingInputCache` (new `ingestNamingProbe`); synchronous probe stays the fallback | Moves all probes off the main thread ahead of need; covers fresh worlds and host searches | Worker already resolves settlement defs (`worldKnowledgeScan.ts` → `settlementDefFor` with its own road context). **Parity risk:** main uses `chunkManager.sampleHeight` (bundle path), worker `sampleHeightAt`; a parity test (main vs worker probe for a set of cells, seed 42 and `415424794`) is the gate. Same pattern as E2 river prefetch (Q22). |
| E4c | Persist naming probes/host cells as a worldgen cache namespace + fixture | Removes repeat cost across sessions | New namespace, fixture regeneration; only worth it if E4a + E4b leave a measurable residue |
| — | Change naming to a local rule (no global predecessor set) | O(1) per cell | **Changes existing settlement names** → worldgen/D3 epoch + D2 naming territory. Not proposed; author decision only. |

Rejected: main-thread time-slicing — a single probe is already 60–100 ms, so slicing still produces ≥ 60 ms hitches.

## 4. Slice plan (queue Q26, S)

1. **E4a** first (one commit, behaviour-exact): `uniqueNameFor` consults `defCache`; unit test that a hydrated def's name is returned without a probe and that a world resolved from cold and one resolved from hydrated defs produce identical names for a ring set (both seeds' fixtures, or the existing flat-terrain test context).
2. **E4b** (separate commit, behind `?settlementProbePrefetch=` in `src/perf/flags.ts`, default off until the WSL A/B): worker job in `chunkHeightmap.worker.ts`, request/ingest owned by `settlementPlanCache.ts` (the single cache owner — no second cache), scheduling from `SettlementsManager` (`recheck` + activation). Bounded queue; stale world ignored (world identity/seed check like E2). **Parity test is mandatory** (main vs worker `SettlementSiteProbe` deep-equal for ≥ 30 cells incl. river-adjacent ones).
3. Keep the `settlement*` stage spans; temporary probe counters may be added as a proper `settlementSiteProbes` count in `report.riverTiles`-style output if useful.

**A/B (WSL green light, then Windows):** `stream` `&benchDuration=90`, A default vs B `&settlementProbePrefetch=1` (E4a is exact and lands default-on without A/B), n = 3 per arm, interleaved. Decides: `frame max`, frames ≥ 1 s (expect 3 → 0), `settlementDefResolve` in long frames, p95/p99/hitches no regression. Also check boot time to `ready` does not grow (worker busy with probes during load). E4a alone, expected: first frame drops by the cached part only; report what remains.

**Stop if:** worker/main probes are not identical for any cell (→ record the mismatch, do not ship E4b, ask O); a name of any cell changes versus current `main` for the reference seeds; the fix needs a settlement-definition cache version bump or a new persisted namespace (→ that is E4c, ask first).

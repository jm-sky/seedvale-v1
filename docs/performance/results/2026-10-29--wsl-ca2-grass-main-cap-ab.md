# CA2 — far-band main grass storage cap, WSL2 A/B (forest, stream)

**Date:** 2026-10-29 · **By:** Claude Opus 5.5 · **Platform: WSL2** (Chrome, ANGLE → OpenGL → Mesa D3D12, Intel Arc 140V). **Do not compare with Windows numbers.**
**Verdict: WSL green light (memory/upload slice).** Resident main grass fell 47–69 % and estimated grass allocation 23–57 %, with **identical submitted instances** in every matched pair. There was no grass hitch and no tail regression beyond same-session noise. CA2 stays on by default (`?grassMainCap=0` disables it). This is not an FPS claim. Native Windows confirmation and the visual check are in queue §4/§2.

## Setup

- Build `0cfb9ed3` (gitSha verified in every run). A = `&grassMainCap=0`, B = default. Fixture `tools-001-v1`, High, 30 s window, fresh profile, 20 s cooldown, 1 rep per run.
- Order: forest A B, then stream A B B A. In stream, each run's travel ends at a different point, so compare A2↔B2 and B3↔A3 as matched pairs. Their submitted counts match exactly.
- Artifacts: `wsl/2026-10-29--wsl-ca2-{A1,B1}-forest-rep1.*`, `wsl/2026-10-29--wsl-ca2-{A2,B2,B3,A3}-stream-rep1.*`.
- Change: [CA2 implementation notes](../../research/v1-revival/2026-10-29--ca2-grass-main-cap--implementation-notes.md).

## Results

| Run | Arm | Resident main | Submitted main | Resident filler | Grass alloc (est.) | FPS | p50 / p95 / p99 ms | Long frames |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: |
| forest A1 | off | 616 454 | 265 630 | 624 138 | 119.1 MB | 35.0 | 29.9 / 38.0 / 44.6 | 0 |
| forest B1 | **on** | **326 361** (−47 %) | 265 630 | 624 138 | **91.2 MB** (−23 %) | 35.1 | 29.7 / 42.5 / 48.8 | 0 |
| stream A2 | off | 682 989 | 87 100 | 137 739 | 78.8 MB | 34.7 | 20.8 / 63.2 / 189.8 | 15 |
| stream B2 | **on** | **214 465** (−69 %) | 87 100 | 137 739 | **33.8 MB** (−57 %) | 35.8 | 20.1 / 58.8 / 210.1 | 17 |
| stream B3 | **on** | **333 014** (−54 %) | 76 794 | 289 574 | **59.8 MB** (−39 %) | 44.9 | 17.7 / 42.4 / 129.2 | 15 |
| stream A3 | off | 724 882 | 76 794 | 289 574 | 97.4 MB | 33.5 | 21.1 / 57.8 / 206.5 | 16 |

## Interpretation

- **Visual identity at the submission level.** Submitted main instances are equal to the instance in every pair. Together with the byte-identical-prefix unit test, this means the drawn blades are the same set.
- **Memory/upload.** In forest, residency moves to 1.23× submitted (from 2.3×). In stream, it moves to 2.5–4.3× (from 7.8–9.4×). The stream residue is chunks that regrew on approach and are now behind the player, plus the near ring. Lower residency also means fewer bytes transferred from the worker and uploaded to the GPU at stream-in.
- **Hitches/tails.** No `grass generation` hitch in either arm (only `chunk mesh`/`chunk water`, unrelated). Stream p99 and long frames overlap across arms: A 189.8/206.5 ms, B 210.1/129.2 ms; 15–17 long frames in both. Stream frame times on WSL are noisy, so no tail change can be claimed in either direction. B3's higher FPS is inside that noise and **is not attributed to CA2**.
- Forest FPS is equal (35.0 / 35.1); p95 +4.5 ms in B1 is a single-run difference within WSL noise.

## Limits

- n = 1 per arm in forest and n = 2 in stream. That is enough for the deterministic counts, not for frame-time claims.
- No browser visual check. The only expected visual difference is timing: an outer-ring chunk that steps inward keeps 8 % density for the few frames until its regrowth lands (notes §Determinism).
- No per-request worker timing was captured. Regrowth adds one worker job per chunk that leaves the far band.

## Windows A/B instructions (queue §4)

One build, order A B B A, `forest` and `stream`:

```
SEEDVALE_QUERY='&grassMainCap=0' node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/win 2026-10-xx--win-ca2-A 1 35 forest stream
SEEDVALE_QUERY='' node scripts/perf/run-benchmark-series.mjs <port> docs/performance/results/win 2026-10-xx--win-ca2-B 1 35 forest stream
```

- **Decides:** grass baseline resident main and estimated allocation (expected strongly lower), with submitted main equal per pair.
- **Guards:** stream p95/p99, long frames, max frame, and any `grass generation` hitch.
- **Revert** (flip the default off or revert `0cfb9ed3`) if Windows shows a stream tail or hitch regression, or if the visual check shows late density fill-in on approach.

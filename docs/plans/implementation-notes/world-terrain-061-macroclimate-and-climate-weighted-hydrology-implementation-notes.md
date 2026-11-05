# Implementation notes — world-terrain-061 (macroclimate + hydrology)

## C1 — macroClimate module + preview layers (Sonnet, 2026-11-05, queue Q120)

**Implemented / technically verified (no browser, no consumers, no worldgen output change, no cache bump):**

- `src/terrain/macroClimate.ts`: `createMacroClimate(params)` -> `{ at, maritimeAt, sampleAt }`. Reads only the unconditioned floor + moisture-region noise (new additive wrapper `sampleRawTexelUncorrectedAt` in `chunkHeightmap.ts`) and its own coarse sea mask; no hydrology, biome, settlement or weather input (acyclic). Immutable after build -> query-order independent, identical on rebuild (worker parity by construction; tests build twice).
- Terms (all first guesses, calibrate in C2): latitude `T` 3 C (north, -Z) -> 17 C (south); lapse 0.09 C/m above water level (80 m summit about -7 C); precipitation = clamp01(0.12 + 0.62*moistureRegion + 0.22*maritime - 0.1*lat); maritime = exp(-coastDist/1200 m) from a 64 m chamfer coast-distance grid (192^2 cells, 144 KiB, budget 0.6 MB). Sea = unconditioned floor below `waterLevel` (inland sea basins of the analytic floor count as coast; hydrology lakes do not).
- Cost: grid build = 36 864 uncorrected texel evaluations (preview whole run ~8 s incl. map tiles); `at()` takes an already-sampled floor + moisture so hydrology can reuse its grid samples (no second pass).
- `continent-preview-png.ts --climate`: T / P / maritime / runoff previews (runoff = P x warmth proxy, preview-only). Seed 42 / 415424794: T 1.9..14.3 / 2.2..14.8 C, P 0.31..0.83 / 0.30..0.82 on land. Exports in `docs/research/v1-revival/continent-previews/`.
- Tests: `macroClimate.test.ts` (latitude, lapse, bounds, determinism/order independence, memory, maritime).

**Observed (looked at 415424794 temp + precip only):** T falls cleanly north; precipitation shows regional blobs, not bands. **Not judged:** whether the look is right (author look is C2's gate), orographic term (only if C2 shows a need), payload hashing/installation with `hydrologyId` (belongs to C2/H1 when fields enter the payload).

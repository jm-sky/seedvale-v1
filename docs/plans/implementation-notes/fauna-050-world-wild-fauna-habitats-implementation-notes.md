# Implementation Notes: fauna-050 — World wild fauna habitats

## F1 — settlement habitat planner + `safetyBeltWidth` (2026-11-05, Q141)

Status: **implemented · technically verified** (type-check, lint, `pnpm vitest run src/fauna src/app` 95 files / 1245 tests). Not browser-verified.

### What changed

- New `src/fauna/settlementFaunaHabitats.ts` owns the pure placement logic that `createFauna()` ran inline for home: `planSettlementFaunaHabitats(input)` (ring individuals, then habitat spawners), `findWalkableNearSite`, `safetyBeltWidth`, `predatorDenRingForBelt`, `settlementFaunaSiteRandom`, plus the placement constants moved verbatim (`SPAWNS`, `SPAWN_RING_OFFSET`, `SPAWNER_RING_OFFSET`, `PREDATOR_DEN_RING_OFFSET`, `SPAWNER_SPECS`, `spawnerId`, `measureSlope`, ...). `createFauna.ts` re-exports the previously exported names, so no importer changed.
- The planner takes the RNG as an input. Home passes the shared `seed ^ 0xfa11` stream; the planner draws from it in exactly the old order, **including the per-prop draws** (rock/wolf den mouth = 1 draw, thicket = 2), which are now returned as `propRandoms` instead of being drawn at materialization. The extras / closed-pressure code after the planner keeps drawing from the same stream.
- Two hooks keep the side-effect order identical to the inline build: `onRingPlanned` (ring agents are created before any spawner carves terrain, so their ground Y is unchanged) and `onSpawnerPlaced` (state restore, rock-den carve, scorch, prop, label run before the next site is sampled, because carving/scorching changes later slope and height samples). `groundY`/`slope` in the plan are sampled before carving, as before.
- `habitatSpawnerRingAttempts(spec, denRing = PREDATOR_DEN_RING_OFFSET)`: the den ring is now a parameter; default = home (unchanged).
- Non-home sites: `settlementFaunaSiteRandom(worldSeed, settlementId)` (FNV-1a of the id, salted) — independent of build order and of the shared stream. Not wired to any caller yet (F3).

### `safetyBeltWidth(size, character, forestShare)` — 🟡 provisional numbers

Width in metres past the footprint radius = inner edge of the predator-den ring. Base by size `OUTPOST 40 · SM 55 · MD 70 · LG 85 · XL 100`; `closed` x0.75; minus 40 m per 1.0 of forest share above 0.35; floor 30 m. `MD / default / 0.35 = 70 m` = `HOME_SAFETY_BELT_WIDTH` (= `PREDATOR_DEN_RING_OFFSET[0]`).

Important: the **home belt is always exactly 70 m regardless of home size**. Home size is variable (`homeSize: 'auto'`), and a size-dependent value would move home dens and break the bit-identical invariant, so the home build keeps the constant ring and the function is only for non-home sites. Non-`MD` values are proposals; re-tune in F3/F4 with a census (author decision if it changes feel).

### Verification

- `src/fauna/settlementFaunaHabitats.test.ts`: golden test compares the planner against a verbatim port of the pre-extraction inline placement on seeds 42 and 415424794 x footprint 22/48/72 (synthetic deterministic terrain with river, lake, road and stateful rock-den carving): ring list (positions, herd ids, life stages, mother links), spawner ids/positions/groundY/slope/propRandoms and the next RNG value after the build are all `toEqual`. Plus ids (`home:cave`, `home:cave:bear`, `home:wolfDen`), belt tests (3 sizes x 2 characters, forest, floor, belt(home)=70, den ring 70-130), per-site RNG independence and build-order independence.
- Caveat: the golden test runs on synthetic samplers, not the real `ChunkManager` terrain, and not through `createFauna` itself (it needs GLB loading). The wiring in `createFauna` (hooks) was checked by reading; **a browser check of the home world on `?seed=415424794` is still owed** (queue §2): dens/caves and wild animals at the same places as before F1.

### Baseline counts (WSL) — partly recorded

- ✅ From code (static, home): ring individuals `SPAWNS` = 17 (+ herd juveniles, deer/stag/boar/rabbit herds, random 0-2 each); habitat initial fill rock den wolf 2 + thicket deer 4 + wolf den 2 + rock den bear 1 = 9. Home peak ≈ 26 live wild agents (+ juveniles), matching the plan's recon; plus pressure dens, dungeon residents, livestock. F2-F4 budget: <= 1.5 x that, so <= ~39 live wild agents in the loaded region.
- ❓ **Not measured:** `faunaAgentUpdatesMs` p95 on the WSL bench route and the live-agent count from a running world. Needs a browser run (Chrome, WSL baseline); handed to the author / a browser session via queue §4. Do not compare with Windows numbers.

# World inspection tools (agents + author)

**Purpose:** the one place that says how to *look at* the generated world while tuning worldgen, hydrology, roads or settlement layout, so before/after comparisons don't need a full play session. This page owns the how-to for both tools. Their design lives in their plans and implementation notes (linked below).

**Last verified:** 2026-11-04 (both tools run for seeds `415424794` and `42`)

Reference seed: **`415424794`** (CLAUDE.md). Check a second seed, usually `42`, before you claim a change is general.

## Which tool when

| Question | Tool | Output |
|---|---|---|
| Where are coast, lakes and rivers on the whole continent? How does a hydrology/terrain change move them? | [Continent preview](#continent-preview-tools-023) | 1536×1536 north-up PNG of the full ±6144 m map |
| How do the home village's houses, plaza, paths, pasture and palisade sit on the ground? | [Settlement shot](#home-settlement-shot-tools-024) | 1600×1600 straight-down PNG, ~173 m across at the default height |
| Anything else (ground-level look, interiors, NPC behaviour) | normal game or `?fly` free flight ([README § fly](../../README.md)) | manual |

Both tools are **deterministic for a seed + commit**, so the usual workflow is:

1. Render the baseline on the current `main` (or reuse the committed references below).
2. Make the change.
3. Render again with the same arguments and compare side by side (Read tool on both PNGs, or the author's image viewer).
4. If the change should alter the picture, commit new references together with it and say so in the commit message.

## Continent preview (tools-023)

**Headless, no browser and no dev server needed. About 6 s per seed.**

```text
pnpm tsx scripts/tools/continent-preview-png.ts <seed> <out.png> [all|standard] [--hillshade] [--slope] [--settlements] [--routes] [--landforms] [--climate] [--stream-m2=480,960,1920]
```

- `all` (default) draws every river including small tributaries, with a visual minimum stroke width. `standard` uses the gameplay map's width filter. Stroke widths are exaggerated for legibility and do not show physical river width.
- It runs canonical hydrology (`ensureWorldHydrology`) and the same tile builder/painter as the in-game map, at a coarse LOD (16 m steps, 144 tiles). No actors. Settlements and roads are opt-in layers (below).
- **Layers (tools-026 D4, all optional, default output unchanged; ~60 s per seed with `--settlements`/`--routes`):** `--hillshade` (NW light), `--slope` (tint by class <5 / 5–10 / 10–20 / 20–30 / ≥30°, gradient over ~8 m pixels — a coarse map-scale estimate, not terrain-mesh slope), `--settlements` (dots by size SM/MD/LG/XL, home ringed in yellow), `--routes` (deduplicated road-route polylines from `roadRoutesForSettlement`), `--stream-m2=<list>` (extra `<out>-streams-<m2>.png` per D1 initiation area, uniform runoff, hillshaded neutral base, lakes drawn like sea — preview only, not the production network). There is **no mountain-gate layer**: the generator does not expose the gate (see the proxy in `censusRelief.ts`).
- **`--climate` (plan 061 C1):** writes `<out>-climate-{temp,precip,maritime,runoff}.png` from `src/terrain/macroClimate.ts` (land only, hillshaded, ~8 s per seed; runoff is a provisional proxy P × warmth, no hydrology consumer). Committed C1 exports: `continent-previews/061-climate-c1/continent-<seed>-standard-climate-*-<sha>.png`.
- **Export layout (author 2026-11-05):** commit preview images into a per-topic subfolder of `docs/research/v1-revival/continent-previews/` (`<plan-or-task>-<topic>/`, e.g. `061-climate-c1/`), not flat; older flat files stay until touched.
- Q114 exports (both seeds, `standard` + `all`, layers on, SHA in the filename): `docs/research/v1-revival/continent-previews/continent-<seed>-{standard,all}-relief-routes-<sha>.png` and `…-streams-{480,960,1920}.png`.
- **Browser page**, the same render with a download button: `http://localhost:5577/continent-preview.html?seed=<seed>&autostart=1` (also in the in-game Tools menu). The page's canvas compositor differs slightly from the script's, so don't diff page PNGs against script PNGs pixel by pixel.
- References: `docs/research/v1-revival/continent-previews/continent-415424794-all-streams.png`, `continent-42-all-streams.png`.
- Details and limits: [tools-023 implementation notes](../plans/implementation-notes/tools-023-whole-continent-raster-hydrology-preview-implementation-notes.md).

## Home-settlement shot (tools-024)

**Needs the dev server (`pnpm dev`, port 5577) and native Chrome, which drives the GPU path in WSL2. Takes from tens of seconds up to the timeout on a cold Vite start.**

```text
pnpm tools:settlement-shot 5577 <seed> <out.png> [--agl 150] [--fov 60] [--keep trees,fog] [--hour 12] [--size 1600] [--timeout 180]
```

- It opens `/?seed=<seed>&fly&flyPose=home[,agl]&flyTop&hour=12[&flyFov=D]&debugDisableSystems=npcs,animals,weather,grass,playerModel,trees,fog` in a fresh Chrome profile, so no save or localStorage settings leak in. It waits for `window.__seedvaleFlyShotReady()`, hides the HUD and captures only the canvas.
- It prints seed, git SHA, URL, home `x,z` and AGL. Keep that line next to the PNG.
- **Orientation:** image up = world −Z (north), right = +X. **Scale:** fixed by `--agl` and `--fov`, never auto-fit, so shots of different villages or commits match only at equal arguments.
- `--keep trees` puts trees back. Canopies hide houses, so they are off by default. `--keep fog` brings back scene fog, which turns the frame into flat fog colour at shot heights (150–220 m).
- `--fov 30 --agl 300` gives a near-orthographic look with less building lean.
- It exits non-zero and writes no PNG on timeout or on a software rasterizer (llvmpipe/SwiftShader).
- References: `docs/research/v1-revival/settlement-shots/home-415424794.png`, `home-42.png`.
- **Do not run it while a benchmark is running**, because it uses the same GPU and dev server. Don't edit `src/` during a benchmark either.
- Details: [tools-024 implementation notes](../plans/implementation-notes/tools-024-home-settlement-top-down-screenshot-implementation-notes.md).

### Known limits (settlement shot)

- `trees` in `debugDisableSystems` misses some canopies and dead trees, so on seed 42 trees still partly cover the village.
- Frame edges show lower terrain LOD, and a dark ocean disc is visible beyond the coast.
- PNGs are not byte-identical between runs because of tree sway and shadow noise. Framing and layout are identical.
- Only the **home** settlement is supported. For another village, use `?fly&flyTop&flyPose=x,z,h,0,0` manually (settlement `x,z` from its `SettlementDef`, e.g. via a quick vitest/script against `settlementGenerator`).

## Geography baseline censuses (tools-026 D1–D3)

Headless, deterministic, `pnpm tsx` scripts (results of 2026-11-04 in `docs/research/v1-revival/census-data/`):

- `pnpm worldgen:rivers:census --network [--stream-m2=960,1920,3840]` — stream km per land km², heads, trunk systems, share of land > 300 m from a stream, accumulation-area histogram (chain points), parallel-pair detector (< 30 m gap, > 150 m run; ridge margin 1 m → `valid` / `artifact?`), payload MiB. `--stream-m2` recomputes chains on the same conditioned grid with other initiation areas (preview only, no cache key touched). Old output is unchanged without the flags.
- `pnpm worldgen:continent:census --relief [--transects=<dir>]` — height histogram, top-20 peaks with prominence/isolation, slope classes (16 m grid), gated-ridge components (**proxy**: `mountainRidge ≥ 0.05`, the generator does not expose its gate), 3 fixed transect CSVs per seed. Also fixed: the script needed an installed hydrology id (it crashed on `main`).
- `pnpm worldgen:travel:census [--json] [--routes-out=<dir>]` — per routed edge: straight/polyline/access length, ratio, hours (**distance ÷ speed estimate**), river crossings, grades; unrouted edges (failed route **or** beyond the per-settlement road cap — not distinguishable here); route connectivity over routed edges next to layout-adjacency components; coverage by straight-line hours; grade share along routes; author-route candidates (seed 415424794). `--routes-out` writes route polylines for the D4 overlay.

## Verification wording

A PNG you looked at counts as **browser-verified for layout and placement only**. It does not cover look, feel or ground-level readability. Those go to queue §2 for the author (CLAUDE.md "Verification").

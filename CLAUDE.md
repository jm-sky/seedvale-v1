# Seedvale — Agent Guide

Seedvale is a browser-based 3D adventure-oriented RPG in a deeply simulated living world (see `docs/VISION.md` §10). The world lives on its own; the player participates rather than drives it.

Stack: TypeScript, Three.js, Vue 3 (incremental UI migration — see `docs/STATE.md` UI), Tailwind CSS v4, Vite, Vitest, pnpm.

Repository documentation in English; conversation with the author in Polish.

## Session start — "Continue" protocol

If the author's message is just **"Continue"** (or "Kontynuuj", "next", or no concrete task), do this without asking:

1. `git pull --rebase origin main`.
2. Open `docs/research/v1-revival/AUTONOMOUS-SESSION-QUEUE.md` and follow its §0 protocol:
   - first **resume** a task marked `in progress` that has a `Resume:` note (an interrupted session),
   - otherwise take the **first `ready` task** fitting your model (O = Opus, S = Sonnet, O→S = Opus plans then Sonnet implements, H = Haiku sub-agent only),
   - follow queue §0.1 for model choice, sub-agents and the context budget (wrap up at ~200k tokens, never grind past ~220k).
3. Read `docs/research/v1-revival/STRATEGIC-BRIEF.md` §1 (decision table) once per session — not the whole dossier.
4. Work the task to its "done when"; commit + push; update the queue; continue with the next task until the session ends or everything left is blocked.
5. Answer the author briefly in Polish: what was done (commits), what is waiting for them (queue §2–§4).

If the author gives a concrete task, do that instead — the Revival rules below still apply.

## Current program: V1 Revival — phase P2

V1 is the foundation; V2/V3 are selective donors only. Approved: D1/D3/D4 (closed)/D9/D11 and local settlement-name uniqueness (Strategic Brief §1); everything else is open. Current phase **P2**: save policy `persistence-008` + coordinated worldgen epoch.

- **Autonomy (author, 2026-10-29):** docs and runtime implementation directly on `main` within approved scope. Open decisions, visual compromises, reduced density/simulation or dropped features → **stop and ask** (Polish, short options), record the question in queue §3, move on to an unblocked task.
- **Performance stays first-class** (D4 freeze lifted 2026-10-30): keep workload-affecting changes revertable and measure them when performance-relevant.
- **Performance evidence:** a parallel **WSL2 baseline** (Chrome, OpenGL via Mesa/D3D12) runs alongside native **Windows Intel Arc** (Chrome, ANGLE D3D11). A good WSL A/B against the WSL baseline green-lights landing/enabling an optimization; the native Windows A/B confirms it afterwards (revert if Windows regresses). Never compare or mix WSL and Windows numbers. Never claim FPS gains — hand off via queue §4.
- **While a benchmark is running, do not edit `src/`** — Vite serves the live tree, so edits contaminate running reps.
- **Reference world seed: `415424794`** (author, 2026-10-30) for manual/browser checks, deterministic worldgen tests and the default demo world (`?seed=415424794`). Boot fixture of its worldgen cache: planned (`tools-020`, queue Q19).

## Source of truth

When sources disagree, prefer: current source code → tests and build/type config → implementation notes and reviews → plans → state/architecture docs → vision/roadmap.

Documentation describes intended or observed behaviour; **the code is authoritative**. Never assume a planned or documented feature exists — verify it. Code maps are navigation aids, not truth.

## Task routing

Do not read the repository broadly. Narrow progressively, stopping as soon as you have enough:

1. `docs/CODE_INDEX.md` — first-file routing and code ownership (not a complete map).
2. `docs/STATE.md` — current system boundaries and invariants (`docs/state/*` for detail).
3. `docs/plans/README.md` — plan status and dependencies; if a relevant plan exists, read the **complete** plan, its `--implementation-notes.md` and linked `docs/reviews/`.
4. Source code: open the entry point, follow control/data flow, identify the owner of state and lifecycle, check callers/consumers. Expand into adjacent systems only when necessary.
5. `docs/code-map/symbols/` (symbol → file) and `docs/code-map/dependencies/` (importers, centrality) when needed; otherwise search the source directly.
6. `docs/architecture/ARCHITECTURE.md` when touching architecture, world lifecycle or shared runtime boundaries.
7. `docs/VISION.md` only for gameplay/design decisions (new gameplay, progression, balancing, simulation design, or a system whose intended behaviour is not established). Prefer established rules and existing patterns over inventing new ones.

Before implementing a non-trivial plan, run the bounded context preflight instead of broad reads:

```text
pnpm claude:preflight <plan-id-or-filename>
```

Plans describe intended work, not current implementation: verify their assumptions against the code, adapt if the repo has evolved, keep scope to the plan, and do not force code back into an outdated plan structure. Record useful out-of-scope discoveries in `docs/plans/LOOSE-ENDS.md`.

## Engineering rules

- **Reuse.** Before creating an abstraction, service, manager, event channel, state container or utility, search for an existing mechanism, find its owner and extend it. No abstractions for hypothetical future needs. Split files by ownership boundaries, not line count.
- **JSDoc** on main architectural/public functions and classes (it helps preflight discover their role); not on obvious code.
- **Simulation.** Authoritative simulation state stays separate from Three.js objects — runtime objects are projections, never a second source of truth. Entity identity survives unload/reload, chunk rebuilds, render reconstruction, save/load and time-skip; never use transient runtime object identity as persistent identity. The world simulation must not depend on the player or camera being present.
- **Determinism.** No frame-rate-dependent simulation, uncontrolled randomness, or order-dependent behaviour where ordering matters. Time-skip follows the same rules as normal progression.
- **Worldgen caches.** When deterministic worldgen output can change, bump that cache namespace's version/fingerprint (do not invalidate unrelated caches). If the change moves, re-identifies, drops or adds anything saves refer to, also bump `WORLDGEN_EPOCH` per the checklist in `src/persistence/worldgenEpoch.ts` (one coordinated bump per Revival batch, D3).
- **Persistence.** `CURRENT_SAVE_VERSION` (`src/persistence/saveData.ts`) with a real migration pipeline — taxonomy in `docs/state/persistence.md`, fields in `docs/architecture/ARCHITECTURE.md#save-schema`. Bump + migrate only when the persisted representation or semantics actually change.
- **Lifecycle.** Before changing creation, destruction, rebuild or persistence, identify who owns the state, the runtime representation, the lifecycle and the cleanup. `WorldBundle` is the world lifetime/rebuild boundary.
- **Performance.** Before adding recurring work, weigh update frequency, entity/chunk count, draw calls, geometry, allocations/GC, worker transfer, serialization and off-screen cost. Prefer lower frequency, batching, lazy evaluation, caching and existing pipelines over new per-frame work. Do not move work to a worker mechanically. For rendering, check draw calls and geometry before blaming simulation.

## Verification

Distinguish **implemented** (code changed) · **technically verified** (automated checks pass) · **browser/manual verified** (behaviour observed). Never claim gameplay or visual correctness from technical checks alone.

Agents may run browser/visual checks themselves (reference seed `415424794`): mark an item browser-verified only for what was actually observed, and record how (URL/flags, scene, screenshots). Checks you could not perform, or that need the author's judgement (look, feel, visual compromises), go to queue §2.

For worldgen / hydrology / road / settlement-layout work, compare before/after with the world inspection tools: `pnpm tsx scripts/tools/continent-preview-png.ts` (whole-continent PNG, headless) and `pnpm tools:settlement-shot` (top-down home village PNG) — see `docs/tools/world-inspection.md`.

Use the smallest relevant set:

```text
pnpm run type-check   # vue-tsc --noEmit (plain tsc misses .vue files)
pnpm run lint:fix
pnpm run test         # or: pnpm vitest run <path>
pnpm run build
```

## Documentation

- Update docs that your change makes stale, in the document that owns the information (no duplication): `docs/STATE.md` for current state, plans for status, reviews when performing that review.
- Generated docs (`docs/code-map/`, the block between `<!-- AI_NAVIGATION_INDEX_START -->` and `<!-- AI_NAVIGATION_INDEX_END -->` in `docs/CODE_INDEX.md`) are regenerated with `pnpm docs:sync`, never hand-edited; if the output is wrong, fix the generator.
- Assets: update `docs/assets/MODELS.md` / `docs/assets/SOUNDS.md` only when media actually changes; local non-repo assets go in `docs/assets/LOCAL_ASSETS.md`.

## Git

- Work directly on `main` (if the harness assigns a session branch, e.g. a cloud session, use it and open a PR). Commits focused on the task: implement → verify → commit → push.
- `git pull --rebase origin main` before pushing. Never force-push; never `git reset --hard` to resolve conflicts or discard work.
- Preserve existing changes, including automated commits that update generated docs or plan files.

## Final rule

**Find the correct owner, verify the current code, make the smallest coherent change, and do not create a parallel system** — preserving determinism, ownership/lifecycle boundaries and performance, without unrelated refactoring.

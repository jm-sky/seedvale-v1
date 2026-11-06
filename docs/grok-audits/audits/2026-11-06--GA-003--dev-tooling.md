# GA-003 — Developer-tooling documentation consistency audit

- **Task:** GA-003, second documentation-vs-code slice; Jan Madeyski explicitly selected topic 2 (developer tooling), followed later by topic 3 (items/player). This report covers topic 2 only.
- **Date:** 2026-11-06 (Europe/Warsaw, CET).
- **Repository / branch:** `jm-sky/seedvale-v1` / `main`.
- **Pinned SHA:** `3c249cb62ddde343be2b654fae43315a484f8054`.
- **Auditor / environment:** Grok Bot executor; native PowerShell on S661L, Windows checkout `D:\Projekty\private\seedvale-v1`. Model/provider identity is not asserted.
- **Report lifecycle:** `review needed`.
- **Finding validation:** GA-003-F03–F05 all `unverified`; no independent reviewer assigned. F01/F02 belong to the [deferred-section pilot](./2026-11-06--GA-003--state-deferred-section.md), not this slice.

## 1. Scope, preflight and stopping criteria

Compare developer-script/tooling claims in [CLAUDE.md](../../../CLAUDE.md), [STATE.md](../../STATE.md), and the directly cited script how-to [world-inspection.md](../../tools/world-inspection.md) against [package.json](../../../package.json), the invoked script entry points, and narrowly necessary build/type/menu configuration. Stop after a claim ledger, candidate findings and audit-index updates. This is not a tooling redesign, runtime audit, implementation plan or Revival-priority decision.

### Checkout and authorization

- Started on clean `main`, HEAD `5d3e2f46788991220a1315011cbbde3474af74d3` (the pushed GA-003 pilot). Checked status before `git pull --rebase origin main`; it fast-forwarded cleanly to the pin above. No existing commits were rebased or overwritten.
- The pull added review 036 and its review-index/matrix records only. It did not change the audited tooling paths. Read the current matrix after the pull.
- Read root `AGENTS.md` / `CLAUDE.md`, Grok workspace rules, queue, report index and prior GA-003 report; consulted the Revival research index, Strategic Brief §1/approved decisions, active queue and relevant archived Q19 record.
- Rechecked clean status, branch and unchanged HEAD immediately before authoring. No other agent was launched. A clean local tree does not establish the absence of work in another checkout.
- Native Windows Shell only for checkout reads/writes; no WSL checkout access. No browser, screenshot tool, dev server, game, benchmark, package install, stash, commit or push. No `src/`, STATE, agent-guide, plan, Revival-queue or matrix edits.

### Collision record / deliberate narrowing

| Active or prior work | Matrix / ownership | Treatment |
| --- | --- | --- |
| Q108 / tools-024 screenshot wrapper; tools-023 preview; Q111–Q116 / tools-026 diagnostic work | 27 (debug/benchmark/worldgen tooling) | Inspect package names, files, argument parsing, output and failure guards only. No new screenshots, GPU measurements or census results. |
| Q119 relief baseline; Q120–Q122 climate/hydrology; Q124/Q70 biome mapping; Q126 settlement variants | 01/02/04/05/23; review 031 | These are changing geography contracts. Preview flags are checked only as CLI surface. Exclude algorithm correctness, layer meaning, runoff units/semantics, numerical outputs and visual acceptance. In particular, do not turn the linked how-to's old climate/runoff prose into a geography finding. |
| Q19/tools-020 fixture planning (archived); Q80 fixture/baseline follow-up | 15/27 | CLAUDE:32 is a roadmap pointer, not a runnable-command claim. No fixture implementation/completeness verdict here. |
| Commissioned rendering/performance work, including newly pulled [review 036](../../reviews/2026-11-06--036--rendering-gpu-critical-architecture-session-1.md); earlier review 026 | 16/17/24 | Exclude render pipeline, GPU acceptance, timing, asset appearance and UI/layout behavior. Screenshot software-renderer guard is a wrapper/platform-contract check only, not a renderer-quality or performance review. |
| Fauna Q139/Q141–Q145, Q159–Q163 / review 035; combat Q150–Q154 / review 034 | 11/12/20 | Entirely excluded; no actor behavior, persistence or combat trace. |
| [Domain audit 25, 2026-09-19](../../reviews/codebase-domain-audit/2026-09-19--25--shared-utilities-config-and-debug-tooling.md) | Historical debug-global/boot-mark lifecycle review, tools-019 | Do not repeat lifecycle findings; that report explicitly excluded documentation-only drift (line 23). No independent validation of this report is implied. |
| GA-003 deferred-section pilot, pushed as `5d3e2f46` | Same audit task, different slice | Preserve its report and F01/F02; continue at F03. Items/player is not investigated in this run. |

Path-scoped recent history checked before authoring: `package.json`, `scripts/docs/`, `scripts/claude/`, `scripts/tools/`, CLAUDE/STATE and the world-inspection how-to. Relevant anchors: `bd3f280c` / `7e216de4` (hydrology/census), `6b392683` (preview layer fix), `24e38353` (climate preview), `5dca6b8e` (variant runner), `f989b47c` (settlement-shot), and `7fde5bc6` (shell hygiene). Narrowing above avoids the churning geography seams; no local concurrent edit was observed.

## 2. Method, corpus and verdicts

Extract explicit command/capability claims from CLAUDE's stack, preflight, verification and generated-doc sections; STATE's Developer tooling and Verification state; and only the directly linked world-inspection script how-to. Split compound claims when existence/wiring can be checked separately from excluded presentation/geometry semantics. Repeated commands in multiple documents share a row unless the later document adds a distinct contract (flags, provenance or failure behavior).

Read package scripts as a closed command list, check file-backed targets, then read invoked entry points and their output/dispatch branches. Follow the actual CODE_INDEX writer as counterevidence, not just a negative search. No command under audit was executed, including `docs:sync`, `lint:fix`, preflight or `--help`; static inspection was sufficient and avoids mutation/browser startup.

**Verdicts:** `supported (static)` means the inspected name/path/dispatch supports the stated bounded contract, **not** a passing execution or independent finding confirmation. `partial` means narrower coverage/platform support than the unqualified wording. `contradicted` is a concrete documented-vs-wired mismatch. `unclear` would mean insufficient bounded evidence. `excluded (overlap)` is no truth verdict.

Scope exclusions also include generic Git/session/shell-policy examples (not package-tool contracts), full stack/framework behavior, historical passing-check statements, benchmark protocols, runtime debug flags outside the tooling subsection, and recursive exploration of every linked plan/domain doc. No claim that every repository tool was reviewed.

## 3. Per-claim ledger (30/30 accounted for)

All line references below refer to the pinned snapshot. C = CLAUDE.md, S = STATE.md, W = docs/tools/world-inspection.md. Source paths are relative to the repository root unless linked.

| # | Documentation claim / location | Verdict | Package, target and bounded source evidence |
| --- | --- | --- | --- |
| 01 | C:5: TypeScript, Three.js, Vue 3, Tailwind v4, Vite, Vitest, pnpm stack | **supported (static)** | `package.json`:54–96 declares these packages and `packageManager`; `vite.config.ts`:1–2, 53 wires Vue/Tailwind. No framework/runtime compatibility certification. |
| 02 | C:52–56, 63: `pnpm claude:preflight <plan-id-or-filename>` gives bounded context; JSDoc aids discovery | **supported (static)** | package:52 → existing `scripts/claude/pre-implementation.ts`. `findPlan`:146–176 handles an existing path or plan name/prefix; limits:74–92, `main`:1253–1496 reads plan/notes, selects files/symbols/dependencies and prints a capped briefing. AST/JSDoc helper imports:59–70; not an implementation runner. |
| 03 | C:82: `pnpm run type-check` = `vue-tsc --noEmit`, not plain tsc | **supported (static)** | package:10 and vue-tsc dependency:94; `tsconfig.json`:25 includes Vue files; `src/vite-env.d.ts`:12–18 explicitly distinguishes the shim from SFC deep checking. |
| 04 | C:83 / S:172: `pnpm run lint:fix` | **supported (static)** | package:12 → `eslint . --fix`; ESLint dependency and `eslint.config.js` exist; config:26–44 handles Vue SFC scripts with the TS parser. This command mutates files; not run. |
| 05 | C:84 / S:172: `pnpm run test`, or `pnpm vitest run <path>` | **supported (static)** | package:14 → `vitest run`; Vitest dependency:92. `vite.config.ts`:99–101 includes `src/**/*.test.ts`, `scripts/**/*.test.ts` and the asset-browser plugin test. No passing-suite claim. |
| 06 | C:85 / S:172: `pnpm run build` | **supported (static)** | package:9 → `vue-tsc --noEmit && vite build`; both tools declared, `vite.config.ts` exists. Build itself supplies the Vue-aware check even if the separate STATE command is narrower (row 11). |
| 07 | C:95: generated `docs/code-map/` regenerated with `pnpm docs:sync` | **supported (static)** | package:36 directly runs the existing symbol/dependency/code-map scripts; symbol-index:99–150 writes `code-map/symbols`, dependency-map:176–227 writes `code-map/dependencies`, code-index:7–52 writes `code-map/README.md`. No generated output was changed. |
| 08 | C:95: the `AI_NAVIGATION_INDEX_START` / `END` block in `docs/CODE_INDEX.md` is also regenerated by `pnpm docs:sync` | **contradicted** | package:36 omits `docs-navigation-candidates.ts`; package:30 exposes it separately. Actual marker writer: `scripts/docs/docs-navigation-candidates.ts`:20–29, 629–675, 725–735. `docs-code-index.ts`:43–52 writes a different file, `docs/code-map/README.md`. **F03**. |
| 09 | C:77 / W:24–33: `pnpm tsx scripts/tools/continent-preview-png.ts` is a headless whole-continent PNG tool | **supported (static)** | Direct tsx invocation, not a missing package alias; tsx dependency:87. Existing script imports Node fs/zlib and canonical map helpers; argument parsing:41–47, headless hydrology setup:49–51, tile loop:62–78, PNG encoder/write:230–236. Geometry correctness excluded. |
| 10 | C:77 / W:42–47: `pnpm tools:settlement-shot` gives the home-village top-down shot | **supported (static)** | package:8 → existing `scripts/tools/settlement-shot.mjs`; positional parsing:12–23, generated URL:31–37 requests `flyPose=home` / `flyTop`; readiness:94–106, screenshot/write:123–130. Wrapper intent/wiring only, not a verified rendered view. |
| 11 | S:172: technical checks list `npx tsc --noEmit` | **partial** | Valid TypeScript command, not a missing npm alias, but narrower than C:82 and package:9–10's Vue-aware checker. The explicit `.vue` module shim at `src/vite-env.d.ts`:12–18 allows plain tsc to resolve imports without deep-checking SFCs. **F04**. |
| 12 | S:137: `/asset-browser.html` under `src/tools/assetBrowser/` is included in production `vite build` | **supported (static)** | `asset-browser.html`:20 points to the existing tool entry; `vite.config.ts`:65–79 declares `assetBrowser`. Configured inclusion, not an actual successful build. |
| 13 | S:137: registries/parked models, UBC clips/hair color, quad panes and localStorage camera/layout behavior | **excluded (overlap)** | Asset/animation/UI presentation (16/17/24). The build-entry check in row 12 does not validate these details. |
| 14 | S:138: Construction Catalog layers semantics over parked MegaKit assets | **excluded (overlap)** | Asset/construction semantics are not a package-script contract; no catalog/rendering audit. |
| 15 | S:139: House Builder assembles catalog houses and is wired into `buildSettlementProps()`; `?perf=1` verification open | **excluded (overlap)** | Settlement/rendering/measurement seam (05/16/27); no source correctness or historical verification verdict. |
| 16 | S:140: standalone `/house-browser.html` at `src/house-browser/`, Vue/Tailwind/Three app outside the main game | **supported (static)** | `house-browser.html`:9–10 points to its own existing entry, separately listed at `vite.config.ts`:70. Stack packages/plugins exist (row 01). UI execution not tested. |
| 17 | S:140: House Browser uses real Catalog → HouseBuilder, no parallel house/collider system | **excluded (overlap)** | Runtime construction/collider ownership (05/16/24), beyond package/entry wiring. |
| 18 | S:141: `src/tools/toolRegistry.ts` central `ToolDefinition[]` powers the Tools submenu | **supported (static)** | Registry:10–36 exports typed `TOOLS`; actual `PauseMenuEntriesTools.vue`:4 imports it, :49–58 iterates it, :11–14 navigates to each path. It is readonly, not a missing registry. |
| 19 | S:142: sampler/benchmark, `?perf=1` / `?benchmark=<id>`, graphics presets and performance docs | **excluded (overlap)** | Commissioned rendering/performance review scope. Do not open the linked performance corpus or run a benchmark. |
| 20 | W:44: `pnpm dev` starts the needed dev server, default port 5577 | **supported (static)** | package:7 → Vite; `vite.config.ts`:13–21, 82–84 sets default 5577, configurable by `PORT`, strict port. Server not started. |
| 21 | W:29–35: preview positional seed/output/detail and `--hillshade --slope --settlements --routes --landforms --climate --stream-m2=<list>` | **supported (static)** | Parser:41–47; corresponding branches at preview:160, 163, 182–220, 239–285, 288–313. `all` is the fallback, `standard` explicit. Flag acceptance/output branches checked; layer science, units and calibration excluded. |
| 22 | W:47, 50, 53: shot options `--agl --fov --keep --hour --size --timeout`; fresh profile, readiness hook and HUD hiding | **supported (static)** | shot:12–36 reads documented space-separated options; :71–76 makes a fresh temp profile, :85–87 sets viewport/navigation, :94–106 waits on `__seedvaleFlyShotReady()`, :107–122 hides canvas siblings, :135–137 cleans up. `--keep trees,fog` affects disabled flags. No canvas/layout acceptance inferred. |
| 23 | W:51: screenshot prints seed, SHA, URL, home x/z and AGL | **supported (static)** | shot:38–39 obtains git SHA, :123 obtains info, :128–130 logs those fields (also camera Y and FOV). No execution/provenance line produced in this audit. |
| 24 | W:55, timeout half: exits nonzero and writes no PNG on readiness timeout | **supported (static)** | shot:94–105 throws on readiness timeout before the write at :126–127; catch sets code 1 at :131–133, exit:139. This concerns a new write; it does not promise deletion of an older output file or an all-CDP-operations deadline. |
| 25 | W:55, software half: exits nonzero and writes no PNG on llvmpipe/SwiftShader | **partial** | Renderer rejection at shot:88–93 exists **only inside `if (!IS_WIN)`**. `IS_WIN`:26 and Windows Chrome path:27 show a deliberate Windows execution path without that guard; it can proceed to write:127. **F05**. No software-renderer run or faulty image observed. |
| 26 | W:13–22, 26, 34–39, 52–54, 60–65, 77: image dimensions/scale/orientation, reproducibility, timing, visual limits and verification wording | **excluded (overlap)** | Rendering/geography/performance/visual acceptance. W:64 already qualifies the earlier broad determinism wording with non-byte-identical PNGs; no extra determinism finding. Numeric timing/size assertions are not remeasured. |
| 27 | W:71: `pnpm worldgen:rivers:census --network [--stream-m2=…]` and metrics | **excluded (overlap)** | package:49 points to existing `scripts/perf/census-rivers.ts`; existence only noted. Q111/Q121–Q122 / review 031 owns flags' numerical/hydrology meaning; no substantive verdict or execution. |
| 28 | W:72: `pnpm worldgen:continent:census --relief [--transects=<dir>]` and metrics | **excluded (overlap)** | package:45 points to existing `scripts/perf/census-continent.ts`; existence only. Q112/Q119 / changing relief semantics excluded. |
| 29 | W:73: `pnpm worldgen:travel:census [--json] [--routes-out=<dir>]` and metrics | **excluded (overlap)** | package:47 points to existing `scripts/perf/census-travel.ts`; existence only. Q113/Q126 / route estimation and geography evidence excluded. |
| 30 | W:38: `/continent-preview.html` browser counterpart in the Tools menu | **supported (static)** | Separate Vite input at `vite.config.ts`:78; registry:30–35 points to it; menu consumes registry (row 18). No page opened or compositor equivalence checked. |

### docs:sync dispatch trace (supporting rows 07–08)

Every file below exists. `package.json`:36 invokes the following eight entry points directly through `tsx`, in order with `&&`:

| Entry under `scripts/docs/` | Inspected output/dispatch boundary |
| --- | --- |
| `plans-sync.ts` | Plan metadata repair at :511; plan README/PLANNING writes at :790–814. |
| `generate-plan-docs.ts` | Vocabulary sections for plans README, PLANNING, PLAN-METADATA; explicit writes array at :395–407. |
| `planned-plans-without-notes.ts` | `PLANS-WITHOUT-NOTES.md` output constant:7; main/update at :111–139. |
| `docs-readme-index.ts` | Closed `INDEXED_READMES` list:13–17 = state/roadmap/vision; :436–481 updates their generated sections, not CODE_INDEX. |
| `docs-symbol-index.ts` | Symbol-domain files and their index:99–150. |
| `docs-dependency-map.ts` | Dependency-domain files and their index:176–227. |
| `docs-code-index.ts` | Only `CODE_MAP_DIR/README.md`, :43–52; config:54–55 defines `docs/code-map`. |
| `plans-recommended-order.ts` | `PLANS_RECOMMENDED_ORDER_PATH`, :574; config:40 = `docs/plans/RECOMMENDED-ORDER.md`. |

`docs:sync:ci` (package:37) also omits navigation-candidates; `.github/workflows/docs-sync.yml`:42–43 invokes that CI variant. Neither similarly named `docs:code-index` nor CI is counterevidence that the marker block is regenerated. Imports/dispatch and output ownership were inspected; this is not an idempotence/content-quality certification of the generators.

## 4. Candidate findings (all initially unverified)

### GA-003-F03 — docs:sync does not invoke the CODE_INDEX navigation-block writer

- **Validation:** `unverified`; **kind:** documentation-vs-command-wiring mismatch; **impact:** onboarding/generated-navigation freshness, not a demonstrated game defect.
- **Disputed claim:** [CLAUDE.md](../../../CLAUDE.md):95 says generated code-map docs **and** the marker-delimited block in CODE_INDEX “are regenerated with `pnpm docs:sync`”.
- **Affected paths/symbols:** package script `docs:sync`; `docs:code-index`; `docs-navigation-candidates.ts::updateCodeIndex` / `main`; `docs-code-index.ts::main`.
- **Current evidence / call path:** package:36's eight-stage direct command chain has the output boundaries listed above. The actual CODE_INDEX path/marker constants are at navigation-candidates:20–29; `updateCodeIndex`:629–675 replaces that block; `main`:725–735 writes it. That entry is exposed separately as `docs:navigation-candidates` at package:30 and is not called by the documented chain.
- **Alternatives checked:** “docs:code-index” sounds applicable but its positive output path is `docs/code-map/README.md`, not CODE_INDEX. `docs-readme-index` has a closed three-file list excluding CODE_INDEX. The CI variant also omits navigation-candidates; its workflow only invokes that variant. No incidental absence search is the sole evidence.
- **Limits / confidence:** high for static dispatch mismatch. No stale entry or failed generator execution is demonstrated; no generator run performed.
- **Smallest independent verification / clarification candidate:** compare package:30, 36–37 and the two positive writer paths at this pin. If accepted, distinguish code-map regeneration from the separately invoked navigation-block command in the documentation. Do not alter orchestration or run a mutating generator merely to validate this report.

### GA-003-F04 — STATE's standalone type-check command is narrower than the Vue-aware project check

- **Validation:** `unverified`; **kind:** partial documentation/verification-guidance mismatch; **impact:** a reader using only the standalone STATE command may miss SFC errors. No current SFC error is asserted.
- **Disputed claim:** [STATE.md](../../STATE.md):172 lists “Technical checks: `npx tsc --noEmit` …”; [CLAUDE.md](../../../CLAUDE.md):82 instead specifies `pnpm run type-check # vue-tsc --noEmit (plain tsc misses .vue files)`.
- **Affected paths / usage:** developer following STATE's Verification state versus package `type-check` / `build`; `src/vite-env.d.ts`'s wildcard Vue-module shim.
- **Current evidence:** package:10 dispatches `vue-tsc --noEmit`, package:9 runs the same before Vite; dependencies:89/94 include both TypeScript and vue-tsc. `tsconfig.json`:25 includes `.vue`; that glob does not make ordinary tsc an SFC checker. The repository's own positive shim contract at `src/vite-env.d.ts`:12–18 says plain tsc resolves a generic component type while vue-tsc deep-checks the SFC.
- **Alternatives checked:** `npx tsc` is a valid binary command, not an absent package script. STATE also lists `pnpm run build`, whose Vue-aware step provides coverage if the whole list is executed. Therefore this is **partial/stale standalone guidance**, not proof the full verification sequence omits Vue checks or ever passed bad code.
- **Limits / confidence:** high for checker/coverage distinction; no compiler, build or synthetic failing component executed/created.
- **Smallest independent verification / wording candidate:** inspect the shim comment and package commands; if accepted, align STATE's standalone check with the existing `pnpm run type-check` command. No source/tooling change is implied.

### GA-003-F05 — the documented software-renderer rejection is not enforced on Windows

- **Validation:** `unverified`; **kind:** platform qualification missing from script how-to; **impact:** Windows users cannot infer hardware-backed screenshot evidence from this wrapper's success alone. Not a measured rendering/performance defect.
- **Disputed claim:** [world-inspection.md](../../tools/world-inspection.md):55: “It exits non-zero and writes no PNG on timeout or on a software rasterizer (llvmpipe/SwiftShader).”
- **Affected paths/symbols:** `tools:settlement-shot` → `scripts/tools/settlement-shot.mjs`, `IS_WIN`, renderer guard, write/exit branches.
- **Current evidence / usage path:** package:8 reaches the wrapper; :26 sets `IS_WIN`, :27 selects a Windows Chrome default, and :72–76 launches it. Renderer inspection and llvmpipe/SwiftShader/softpipe rejection are guarded by `if (!IS_WIN)` at :88–93. On Windows that block is skipped, while the common readiness/capture/write path remains reachable (:94–130).
- **Alternatives checked:** the how-to's setup line 44 highlights WSL2 and may have intended a WSL-only guarantee. However its failure sentence is unqualified and the current script explicitly supports Windows. The non-Windows guard also requires a D3D12 renderer; do not generalize it into a universal GPU-validation mechanism. Timeout rejection remains supported separately (row 24).
- **Limits / confidence:** high for guard/platform distinction; medium that the prose was intended to cover every supported platform. No browser/software-renderer reproduction performed and no invalid screenshot alleged. Native Chrome may fail for other reasons; successful hardware output is not guaranteed by this static review.
- **Smallest independent verification / wording candidate:** inspect :26–28, :88–93 and :125–139 without launching Chrome; if accepted, qualify the documented software-renderer rejection as the non-Windows/WSL path's check. Any guard implementation change is separate, unapproved work.

## 5. Negative results, checks and limits

- The three named examples (`claude:preflight`, `docs:sync`, `tools:settlement-shot`) **all exist**, as do their target files. No missing/renamed command or wrong target path was established in the checked core. Direct `pnpm tsx ...` / `pnpm vitest ...` / `npx tsc ...` commands need not be package-script keys.
- Preflight has plan resolution and bounded stdout output; it is not a plan executor. docs:sync is a real **mutating** regeneration pipeline, not a harmless listing/check-only command. `lint:fix` also mutates; neither was run.
- Every inspected package script file reference existed at the pin (supplementary path inventory, not a full behavioral audit of unclaimed scripts). World-inspection flags inspected here matched their wrapper spelling; no stale flag finding emitted. Excluded census semantics are not counted as verified.
- Tests/build/type-check/lint/preflight/docs-sync: **not run**. No benchmark, game/dev server, browser/manual/visual/GPU verification; no timing/throughput claim. Git/status/history, file reads and static path checks only.
- No runtime defect, rendering acceptance, whole-repository absence, generalized dead-code conclusion or generator-idempotence guarantee. Findings apply to the recorded snapshot, not unobserved future commits.
- No blocker prevented this slice. The Grok workspace overview and Revival research index still contain historical “no runs / empty index” prose; as in the pilot, they are outside this slice's three authorized deliverables and were not changed or promoted into tooling findings.

## 6. Pilot metrics and independent-validation handoff

### Claim-level coverage (mutually exclusive ledger rows)

| Verdict | Count |
| --- | ---: |
| supported (static) | 18 |
| contradicted | 1 |
| partial | 2 |
| unclear | 0 |
| excluded (overlap) | 9 |
| **Total extracted rows accounted for** | **30** |

21 rows received a bounded static verdict; nine exclusions are accounted for, not verified truth. Counts describe this explicitly defined extraction/row granularity, not a whole-document completeness percentage. Several supported rows cover name/wiring only; excluded finer behavior is named separately.

| Finding-validation metric | Value |
| --- | --- |
| Findings emitted in this slice | 3 (F03–F05) |
| Independently confirmed / rejected / unverified | 0 / 0 / 3 |
| Cumulative GA-003 findings including untouched pilot | 5; 0 / 0 / 5 at delivery |
| False-positive share `rejected / (confirmed + rejected)` | **N/A until independent validation** (0 resolved) |
| Independent reviewer / method | Not assigned / not performed |
| Meaningful surfaced candidates | One generator-command mismatch and two qualification/coverage mismatches; 0 claimed new gameplay/runtime discoveries |
| Missed / unchecked claims | No omitted extracted row; nine explicit exclusions plus the declared non-recursive corpus and execution limits |
| Scope violations | 0 identified; only report/queue/index authored, no prohibited verification or parallel agent launch |
| Approximate independent-review effort | Not yet spent; estimated 15–25 minutes for these three static traces (estimate, not measured reviewer time) |

### Per-finding validation log

| ID | Status | Independent reviewer | Validation method / evidence |
| --- | --- | --- | --- |
| GA-003-F03 | `unverified` | — | Awaiting package chain vs CODE_INDEX writer trace. |
| GA-003-F04 | `unverified` | — | Awaiting standalone tsc vs Vue shim / vue-tsc coverage check. |
| GA-003-F05 | `unverified` | — | Awaiting Windows branch vs documented renderer rejection check. |

Independent acceptance/rejection is per finding. Report acceptance does not authorize documentation fixes, implementation, plan creation, Revival-priority changes, commits/pushes or the next audit.

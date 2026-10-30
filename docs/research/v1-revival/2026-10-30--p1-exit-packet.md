# P1 exit packet — Performance-First freeze (A/B/C/D/E)

**Created:** 2026-10-30 by Claude Opus 5.5 (queue Q7)  
**Status:** **CLOSED by author decision 2026-10-30** (§0). §1–§7 remain the record of the proposed packet; the batched Windows session (§3) and visual review (§4) were not run as closure gates.  
**Exit rule** ([roadmap §4](./2026-10-27--master-revival-roadmap.md#4-strategy--performance-first), brief D4): approved A/B/C/D(/E) scope **completed or explicitly closed**; accepted changes technically and visually verified; **final combined performance result** documented; optional candidates closed/deferred explicitly and never prolonging the freeze. Reaching 50–60 FPS is the target, **not** an exit condition.

Evidence labels: ✅ measured on native Windows Arc · 🟢 WSL green light only (Windows pending) · 🧪 technical (tests) only · ⏳ waiting on the author.

## 0. Closure (author, 2026-10-30)

- P1 ends now; the Performance-First freeze is lifted and work moves to **P2** ([Master Roadmap §5](./2026-10-27--master-revival-roadmap.md#5-phases)).
- Last P1 fix: Q25/Q26 travel stall — settlement naming probes (`b4e30641`; recon [Q25](./2026-10-30--q25-npc-stream-frames-recon.md)).
- The author **accepts the current visual state**; no further benchmarks are required for closure (§3 not a gate). §6 (1) answered: the `settlement-heavy` gap does not block further work; optimizations deferred.
- Combined result (§5): not filled — closure by decision, not by a final combined measurement. Per-slice evidence stays in the linked reports.
- Deferred (not cancelled): E1 template prewarm (opt-in), E3 character programs (Q23), Q16 occluded-cohort ceiling, Windows confirmations listed in queue §4, CB / CSS2D / Skeleton retests, D10 far LOD, D8/D13 reflections.

## 1. Per-track verdicts (proposed)

| Track | Landed on `main` (default) | Evidence | Pending before exit | Proposed P1 verdict |
| --- | --- | --- | --- | --- |
| **A — actors** | A1′ conservative skinned cull bounds `e76f3f9c`/`8fc58ddf`/`36e99ef6` (on); A0 per-pass counters `85f00fe9` (tooling); Q15 skeleton bone-texture dispose (D4 exception); **Q20 one skeleton per actor `a416ff2b` (on, `?actorSkeletons=0`)** | A1′ ✅ part of the `36e99ef6` series; Q20 🟢 main skeletons 267 → 49–50, shadow 46 → 12, every B ≤ every A ([WSL A/B](../../performance/results/2026-10-30--wsl-q20-actor-skeleton-sharing-ab.md)) | Q20 Windows A/B (§3 S2) + visual (§4); A1′ picking check (§2 of queue); Q16 cohort ceiling (§3 S6) | **Complete** after Q20 keep/revert. Further actor work (Q16 detector, D10 far LOD, D11 merge retest) only by author choice (§6 Q1) |
| **B — settlements** | Wood-pile V2 tiers `4347c274`; lantern GLBs `405742dc`; **Q14 B1a one scene matrix update per frame** `e0a42fc7`+`277f71b5` (on, `?frameMatrixOnce=0`); **Q5 interior chests instanced** `b2691195` (on, `?chestInstancing=0`) | Lanterns ✅ draws −4–6 %, FPS below noise; B1a ✅ frame p50 −3.1 ms ([A/B](../../performance/results/2026-10-29--win-q14-frame-matrix-once-ab.md)); chests ✅ keep, storageContainer calls 58/20/28 → 18/6/8 ([A/B](../../performance/results/2026-10-30--win-q5-ca2-ab.md)) | Chest visual check (§4) | **Complete.** B1b static freeze deferred (§2); reflection trims are D8/D13, outside P1 |
| **C — grass** | CA1 filler gating `bc9a68d1`; CA2 far-band main cap `0cfb9ed3` (on, `?grassMainCap=0`) | CA1 ✅ resident filler −50…89 %; CA2 ✅ resident main −47…−69 %, forest neutral, author: keep on ([A/B](../../performance/results/2026-10-30--win-q5-ca2-ab.md)); **no FPS claim** (memory/upload) | CA2 `stream` n ≥ 3 per arm (§3 S3, author request); CA1/CA2 visual checks (§4) | **Complete** (D9 sequence C0→CA1→CA2→evaluate done). CB deferred (§2). C0 "certified baseline" is replaced by the §3 combined session — never certified retroactively |
| **D — trees** | Inert LOD assets `d867f38`; `dense-forest` fixture `a6676a11` | ✅ hide-vegetation Δ RENDER +0.4/−0.2/+0.2 ms vs ≥ ~2 ms threshold ([result](../../performance/results/2026-10-30--win-q2a-dense-forest.md)) | — | **Closed: measured, not needed.** Q3 (LOD1) closed without work; billboards closed (§2) |
| **E — travel stutter** | E1 template prewarm `0a56f8cc` (**opt-in** `?prewarmTemplates=1`); E2 river-tile worker prefetch `2e6bb561` (**opt-in** `?riverPrefetch=1`); E3 (Q23) not started | E1 ✅ ambiguous: template first-use and render-side ≥ 100 ms frames gone, guards n = 2 inconclusive ([report](../../performance/results/2026-10-30--win-q17e1-template-prewarm-ab.md)); E2 🧪 only | E1 n ≥ 3 (§3 S4, queue §3 option (b)); E2 guards A/B (structural gain proven on WSL) then Windows (§3 S5); Q23 E3 slice; **Q25 NPC multi-second travel frames (added by the author 2026-10-30)** | **Complete** once E1/E2 have keep/revert verdicts and Q23 has landed or been explicitly deferred |

Recorded D4 exceptions during P1 (workload-neutral, no measurement required): Q9 fog anchoring, Q10 IMP-004 cave proxy skirt, Q11 bark weather fallback, Q15 bone-texture dispose, issue 040 god-rays (manual GPU check in queue §4), issue 041 shadow acne, map raster `ui-input-046`, dialogue reskin.

## 2. Optional candidates — close/defer list

Each line is the proposed final state; none keeps the freeze open.

| Candidate | Proposed state | Reason / evidence | Reopen when |
| --- | --- | --- | --- |
| **CB** — V3 tiled grass backend | **Deferred (post-P1, unscheduled)** | D9: only if post-CA evidence warrants. CA2 left submitted instances identical and Windows forest/`settlement-heavy` show no grass-bound frame cost; no measured case for a renderer migration | A post-P1 scene where `hide-grass` isolation ≥ ~2 ms RENDER on Windows |
| **Tree billboards / LOD1** (D) | **Closed** | P1-D measured: vegetation ≤ 0.4 ms RENDER in `dense-forest` | Vegetation density/variety work (post-P1) raises the vegetation isolation cost ≥ ~2 ms |
| **CSS2D scene-matrix second-traversal skip** | **Closed — superseded** | Q14 B1a renders mirror, beauty and labels against one per-frame matrix update, which subsumes the skip ([A/B](../../performance/results/2026-10-29--win-css2d-matrix-skip-ab.md) was negative alone) | — |
| **Peasant body-only Skeleton sharing** | **Closed — superseded** | Q20 shares one skeleton across all compatible parts of every NPC/animal (superset of the reverted body-only [experiment](../../performance/results/2026-10-29--win-peasant-skeleton-sharing-ab.md)) | — |
| **D11 Peasant body merge** | **Deferred retest (post-P1 or §6 Q1)** | First experiment no repeatable gain; Q20 changed the per-actor skeleton cost, so the old result does not transfer. Structural potential 5→2 / 4→1 calls per body | Author picks it in §6 Q1, or post-P1 actor work |
| **B1b static owner matrix freeze** | **Deferred** | [Census](../../performance/results/2026-10-29--wsl-q14-b1b-matrix-census.md): static-owner ceiling ~0.3–0.7 ms, moving-part risk | Actor traversal share drops enough that statics dominate |
| **Track B candidate #3 — food representatives** | **Deferred** | Needs a food-kind breakdown first; no measured share | Post-P1 settlement work |
| **Q16 occlusion detector** (analysis §4.4) | **Conditional** | Only if the Q16 zero-cost mask ceiling (§3 S6) is ≥ ~2 ms RENDER on Windows; otherwise **closed** | — |
| Reflection trims (D8/D13), actor far detail (D10) | **Outside P1** | Open author decisions; not P1 work items | Author decision |

## 3. One batched Windows Arc session (author)

Same machine/Chrome/power plan, current `main` SHA recorded once, fixture `tools-001-v1`, fresh profile per rep, High preset, `scripts/perf/run-benchmark-series.mjs` per the [Arc runbook](../../performance/2026-10-27--arc-baseline-runbook.md). **One variable per A/B**; never combine two keep/revert flags in one arm. Order A B B A inside each step. Rough budget: ~2–2.5 h; S1 and S2 are the must-haves, S3–S6 can split into a second sitting.

| Step | Scenario(s) | Arms (`SEEDVALE_QUERY`) | n | Decides | Est. |
| --- | --- | --- | --- | --- | --- |
| **S1 — combined result** | `settlement-heavy`, `forest`, `dense-forest`, `stream`, `water`, `night` | final `main` (defaults) **and** "toggleable P1 off": `&frameMatrixOnce=0&actorSkeletons=0&chestInstancing=0&grassMainCap=0` | 3 per arm per scenario | Final combined P1 result (§5). The "off" arm is **not** a keep/revert test — it measures the toggleable share of P1 in one matched session; untoggleable slices (A1′, CA1, wood tiers, lanterns) are covered only by the historical reference | ~60 min |
| **S2 — Q20** | `settlement-heavy` | A `&actorSkeletons=0`, B default | 3 | Keep/revert A1 (frame/RENDER p50; guards mean FPS, p95/p99, hitches); structural `Skeletons first used` ([instructions](./2026-10-30--q20-actor-skeleton-sharing--implementation-notes.md#ab-instructions-wsl-first-then-windows)) | 20 min |
| **S3 — CA2 stream** | `stream` | A `&grassMainCap=0`, B default | 3 | Author request: repeat the ambiguous `stream` tail with n ≥ 3 | 15 min |
| **S4 — Q17 E1** | `stream` | A default, B `&prewarmTemplates=1` | 3 | Default on/off for E1 (frame max, ≥ 100 ms frames, hitches, p99) | 15 min |
| **S5 — Q22 E2** | `stream` | A default, B `&riverPrefetch=1` | 2–3 | Default on/off for E2 (`riverTileBuild` sync count/max, frame max, p99). WSL first if possible (queue §4) | 15 min |
| **S6 — Q16 cohort ceiling** | `settlement-heavy` | A `&actorCohort=census`, B `&actorCohort=mask`; control: same pair with `&benchYaw=<open view>` | 3 + 2 control | Whether a perfect occlusion test could save ≥ ~2 ms RENDER ([Q16 notes](./2026-10-30--q16-occluded-actor-cohort--implementation-notes.md)) | 25 min |
| Trace | `settlement-heavy` | default | 1 | Q6 Chrome Performance trace (queue §4) — optional | 10 min |

Notes:
- **Forest drift to explain in S1:** forest was ≈ 56 FPS at `36e99ef6` (2026-10-28) but 41.7–43.5 FPS in both arms of the 2026-10-30 Q5/CA2 session (one 63 FPS outlier). Not attributable from that data; S1's n = 3 on final `main` decides whether this is session variance or a regression that needs a bisect before exit.
- If S1 "off" vs default shows a regression in any scenario, stop and bisect the toggles before the remaining steps (the flags are independent).

## 4. Visual review (author) — P1 slices only

From queue §2; each with `?seed=415424794`, default vs the slice's off flag where one exists.

- [ ] A1′ envelope bounds — NPC picking/interaction at animated poses.
- [ ] Q20 one skeleton per actor — default vs `?actorSkeletons=0`: several NPC families (beards, hair, skirts, professions) and horse/cow/dog walking, working, sitting, fighting, dying/corpse; no seams or detached parts.
- [ ] Q5 chests — interior chests present, placed, oriented, shadowed; vs `?chestInstancing=0`.
- [ ] CA1 — filler coverage/pop-in on approach.
- [ ] CA2 — no late grass density fill-in when outer chunks step inward during fast travel; vs `?grassMainCap=0`.
- [ ] E1/E2 only if their default flips on: travel through new biomes with the flag — no missing/flickering trees, rivers identical.

D4-exception visual items (fog, IMP-004, issues 040/041) stay in queue §2 but do not gate P1 exit unless the author wants them to.

## 5. Combined result template (fill after S1)

SHA: `…` · Date: … · Platform: native Windows, Intel Arc, Chrome …, ANGLE D3D11 · Fixture `tools-001-v1` · High · fresh profile · n = 3 per cell (mean, min–max).

| Scenario | Historical reference (SHA, date, FPS / frame p50 / RENDER p50) | Final `main` default | "Toggleable P1 off" | Δ default vs off | Target 50–60 (45–60) |
| --- | --- | --- | --- | --- | --- |
| `settlement-heavy` | `36e99ef6` 2026-10-28 ≈ 32.6 FPS; `8a2bea88` Q14 B ≈ 31.4 FPS / 31.1 / 23.8 ms | | | | |
| `forest` | `36e99ef6` ≈ 56 FPS | | | | |
| `dense-forest` | 2026-10-30 Q2a ([result](../../performance/results/2026-10-30--win-q2a-dense-forest.md)) | | | | |
| `stream` (p99, max, ≥ 100 ms frames, hitches) | 2026-10-30 CA2 A arm: 55.9 / 56.1 FPS, p99 60 / 71 ms | | | | |
| `water`, `night` | latest matched run from the runbook baseline | | | | |

Rules: historical cells are **context, not a matched comparison** (different SHA/session); only the default-vs-off column is matched. No FPS gain is claimed beyond what the matched column and the per-slice A/B reports show. Guards: p95/p99, long frames, hitches per scenario.

## 6. Decisions for the author at exit

1. **Remaining gap.** `settlement-heavy` will very likely stay well below 45 FPS after P1 (~36–37 FPS in the last session). Exit with the gap documented and move to P2, or extend P1 with one named actor item (Q16 detector if S6 ≥ 2 ms; D10 simplified far LOD proposal; D11 merge retest)? Recommendation: exit P1, carry the gap as a dedicated post-P1 actor-performance plan — the freeze rule says optional work must not prolong it.
2. **E1/E2 defaults** after S4/S5 (queue §3 already holds E1).
3. **Historical reference** for the combined table: accept the dated historical runs as context (recommended), or additionally build and run a pre-P1 SHA in the same session (+~40 min, gives a matched before/after for the untoggleable slices).

## 7. Freeze-exit checklist

- [ ] A: Q20 keep/revert recorded; Q16 ceiling recorded (detector closed or chosen in §6 Q1).
- [ ] B: complete; chest visual check done.
- [ ] C: CA2 `stream` n ≥ 3 recorded; CA1/CA2 visual checks done; CB deferred (§2).
- [x] D: closed "measured, not needed" (Q2/Q3).
- [ ] E: E1 and E2 keep/revert recorded; Q23 E3 landed or explicitly deferred; Q25 NPC travel frames fixed or explicitly deferred.
- [ ] §2 close/defer list accepted by the author.
- [ ] §5 combined result filled from S1 and linked from the tracker snapshot.
- [ ] Forest drift (§3 note) explained or bisected.
- [ ] Author sign-off → Opus records P1 closure in the Strategic Brief (D4 row: freeze lifted, date, packet link), Master Roadmap §5 P1 row and tracker snapshot; queue Q7 `done`; P2 (`persistence-008`, Q8 plan) becomes the next phase.

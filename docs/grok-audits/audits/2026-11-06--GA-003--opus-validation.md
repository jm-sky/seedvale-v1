# GA-003 — independent validation of F01–F07 (Claude Opus)

- **Date:** 2026-11-06 (Europe/Warsaw)
- **Reviewer:** Claude Opus 5.5 (Claude Code, WSL2 checkout), per [handoff](./2026-11-06--GA-003--opus-validation-handoff.md)
- **Validated at:** `main` @ `46636498` (after `git pull --rebase`). Static reading only; no tests, generators or tools run.
- **Drift vs pins:** `a75dcdfb` / `3c249cb6` → `46636498` touches only `package.json` (+1 unrelated `worldgen:vegetation:census` script) and `docs/state/terrain-and-world-generation.md` (Q164/Q165). None of the cited files/lines moved in a way that changes a verdict; line numbers below are at `46636498`.
- **Scope kept:** no geography / fauna persistence / combat / rendering–performance; no implementation; Revival priorities unchanged.

## Verdicts

| ID | Verdict | Fix class | Evidence (path:symbol) |
| --- | --- | --- | --- |
| F01 | **confirmed** (docs precision) | docs-only | `src/settlement/npcState.ts` `NpcAuthoritativeState` doc (85–96): `carried` = transient work payload; `personalInventory` (111) and `transportCargo` (165) are authoritative, serialized at 441–442 and hydrated in `fromSnapshot` 295–296; `app/saveState.ts:345` saves `snapshotNpcStates()`. `docs/state/persistence.md:33,79` and `docs/state/settlements.md` S7 are already precise — only `docs/STATE.md:165` (NPC daily routine, "carried inventory … only health/needs/plan/etc.") and `:181` are loose. Not a save-loss bug. |
| F02 | **confirmed — needs-narrowing** of the STATE bullet | docs-only | `economy/interSettlementFoodTransport.ts` `matchInterSettlementFoodOpportunity` (86) → `ai/npcProfessionWork.ts` `planTraderInterSettlementExport` (924, called at 990) = real A→B food `TransportOrder` export. `app/actions/survivalActions.ts` `startCookAt` (345) = player campfire cooking; `items/campfireCooking.ts:6–9` says "not a crafting system". General priced trade and general player recipe crafting remain genuinely absent → keep them deferred, name the bounded exceptions. |
| F03 | **confirmed** — **resolved 2026-11-06** (author chose wiring: `docs-navigation-candidates.ts` now runs in `docs:sync` and `docs:sync:ci` after `docs-code-index.ts`; CLAUDE.md wording is now true) | script wiring | `package.json` `docs:sync` (36) / `docs:sync:ci` (37) chain ends at `docs-code-index.ts` + `plans-recommended-order.ts`; `docs-code-index.ts` writes only `docs/code-map/README.md` (43–48). The `AI_NAVIGATION_INDEX_*` block writer is `scripts/docs/docs-navigation-candidates.ts` (`CODE_INDEX_PATH` 20, `updateCodeIndex` 629, `main` 678/726), exposed only as `docs:navigation-candidates` (30). `CLAUDE.md` §Documentation claim is wrong as written. |
| F04 | **confirmed** | docs-only | `docs/STATE.md:172` lists `npx tsc --noEmit`; `package.json` `type-check` (10) and `build` (9) use `vue-tsc --noEmit`; `src/vite-env.d.ts:12–15` shim states plain tsc only resolves a generic `.vue` type. Mitigated (same line also lists `pnpm run build`), but the standalone command should be `pnpm run type-check`. |
| F05 | **confirmed** | docs-only now; optional tooling gap | `scripts/tools/settlement-shot.mjs` `IS_WIN` (26); renderer check (`D3D12` required, llvmpipe/SwiftShader/softpipe rejected) only inside `if (!IS_WIN)` (88–93). The D3D12 requirement is correctly WSL-only (native Windows = ANGLE D3D11), but Windows has no software-rasterizer rejection at all. `docs/tools/world-inspection.md:55` is unqualified. |
| F06 | **confirmed — needs-narrowing** (doc overclaim, no gameplay defect) | docs-only now; optional contract gap | Execution gate is capability-driven: `app/gameLoop.ts:2058` `hasItemCapability(heldTool.held(), 'fishing')`. UI availability is exact-kind: `app/createApp.ts:1134,3384` `inventory.has('fishing_rod', 1)` → `ui-vue/screens/QuickActionsScreen.vue:349,377`. Only `fishing_rod` declares `'fishing'` (`items/itemCatalog.ts:1511`), so behaviour agrees today; a second fishing tool would be executable but hidden in Quick Actions. `docs/STATE.md:71` "every tool-requirement gate … no hand-written per-tool check left" overclaims. |
| F07 | **confirmed** | docs-only | `docs/state/player-systems.md:52` "obtainable only from the home trader … no production chain" is stale: `economy/production.ts:214–218` `blacksmith.iron_rod` (2 iron + 1 coal → 1 rod); `ai/npcProfessionWork.ts` uses `BLACKSMITH_IRON_ROD_PRODUCTION` (1020 preflight, 1096 schedule); `ai/npcTradeAvailability.ts:90,134` offers owned rods. Historical plan-175 scope, present-tense current-state doc. |

## Classification

- **(a) Docs-only corrections** — F01, F02, F04, F05 (qualify as WSL-path check), F06 (qualify as execution gates; name the Quick Actions exact-kind exception), F07. Bundled as one low-priority Revival queue row (Q167).
- **(b) Contract/code gaps needing a separate brief (not tasks)** — F06: Quick Actions availability could derive from `hasItemCapability` like the execution gate; F05: Windows path could reject SwiftShader/Microsoft Basic Render; F03 was resolved by wiring the generator (author choice). Recorded in `docs/plans/LOOSE-ENDS.md`; none urgent.
- **(c) False positives to reject** — none. No finding is a runtime defect; F01 and F06 must **not** be promoted as save-loss / gameplay bugs.

## Not done

Tests, `docs:sync`/navigation generator, and the settlement shot were not run. Per-finding status in the three Grok reports is left `unverified` there; this file is the validation record.

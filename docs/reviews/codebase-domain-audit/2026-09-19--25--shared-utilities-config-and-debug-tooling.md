# Codebase domain audit 25 — Shared utilities, config & debug tooling

**Reviewed:** 2026-09-20  
**Area:** 25 — Shared utilities, config & debug tooling  
**Scope:** code correctness, architecture, lifecycle, performance  
**Baseline:** `main` @ `66fd7c13d0a3ffe814937c9c60834069f7c6636a`  
**Result:** ✅ reviewed; two bounded tooling-lifecycle findings

## 1. Scope

Audited shared helpers/configuration and development diagnostics with emphasis on semantics, ownership, rebuild/dispose behaviour and hot-path cost.

Traced:

- URL/debug/system flags in `src/debug/debugMode.ts`;
- `window.seedvale.debug` installation and its callers;
- debug inspectors/traces and GUI lifecycle;
- `WorldConfig` defaults/overlays and localStorage persistence;
- boot/perf/navigation diagnostics;
- representative shared spatial/query helpers and cache ownership;
- existing plans/reviews covering debug tooling, config and diagnostics.

Pure style issues, missing tooling and documentation-only drift are excluded.

## 2. Entry points and state owners

### Config/defaults

`src/config/worldConfig.ts::createWorldConfig()` owns the merge order:

```text
hardcoded baseConfig
→ persisted domain overlays
→ URL seed/res/gui overrides
→ live shared WorldConfig
```

`src/config/persistConfig.ts` splits graphics/player/world localStorage domains. Reads fail closed to `null`; writes tolerate unavailable/quota-limited localStorage. Terrain/post-processing/quality application remains owned by the config module rather than consumers.

### Feature/debug flags

`src/debug/debugMode.ts` is the shared URL-query parser for debug/admin/isolated-scene flags and `debugDisableSystems`. Callers intentionally use `isSystemEnabled()` both for presentation isolation and full subsystem isolation during diagnostics.

### DevTools API

`src/debug/npcDebugApi.ts::installNpcDebugApi()` constructs the single `window.seedvale.debug` namespace. Its operations reuse live domain APIs or fresh lookups where possible; it does not establish a second simulation registry.

The API is installed for `?debug` or `?admin`, closes over the app-owned bundle/context/player accessors and contains authoritative debug mutations.

### Diagnostics

- `src/shared/bootMark.ts` owns module-global boot marks.
- `src/perf/active.ts` owns one active perf monitor and has explicit `setActiveMonitor(null)` teardown in `createApp.ts`.
- `src/navigation/navigationStats.ts` owns session-wide counters and exposes snapshots rather than its mutable bag.
- inspector/UI handles inspected have explicit `dispose()` paths.

## 3. Flows traced

### Config

```text
defaults + localStorage + URL
→ createWorldConfig
→ shared mutable WorldConfig
→ GUI / Vue / runtime consumers
→ domain saver
→ localStorage
```

No second config authority was found. The concurrent rebuild/config mutation defect is already owned by area 23 / `world-033` and is not duplicated here.

### Debug API lifecycle

```text
?debug / ?admin
→ installNpcDebugApi
→ window.seedvale.debug
→ closures over current app/bundle/player/managers
→ authoritative debug operations
→ createApp.dispose
→ [no global uninstall]
```

See F25-1.

### Boot marks

```text
useBootMark(group)
→ bootMark(name)
→ module-global bootMarks[]
→ bootMarkEnd(name)
→ first matching historical mark
→ console timing/summary
```

See F25-2.

### System isolation flags

```text
debugDisableSystems
→ isSystemEnabled(name)
→ render/build/spawn call sites
→ intentionally reduced diagnostic runtime
```

The `animals` flag suppresses fauna/livestock materialisation, not merely visibility. This matches the repository's documented perf/isolation use of the flag, so it is not reported as a correctness finding. The helper's nearby "visual only" wording is narrower than actual semantics, but that wording alone has no separate engineering impact.

## 4. Findings

### F25-1 — MEDIUM — `window.seedvale.debug` outlives its owning app and can retain stale disposed runtime owners

**Affected flow:** app/debug bootstrap → DevTools global → app teardown → stale global closures → later console/debug call or non-debug remount.

**Files / symbols:**

- `src/debug/npcDebugApi.ts::installNpcDebugApi`
- `src/debug/npcDebugApi.ts::SeedvaleDebugApi`
- `src/app/createApp.ts` — DevTools installation and returned teardown
- consumers exposed through `window.seedvale.debug`

**Evidence:**

`installNpcDebugApi()` returns `void`, captures `bundle`, `worldContext`, `config`, player accessors, `questManager`, traces and local debug cursor state, then publishes:

```ts
window.seedvale = { ...window.seedvale, debug: api }
```

The `createApp.ts` teardown disposes the render loop, GUI, inspectors, world caches and `WorldBundle`, and clears the active perf monitor, but has no matching uninstall for `window.seedvale.debug`.

The installation guard is:

```ts
if (!isDebugMode() && !isAdminMode()) return
```

so a later app boot without either flag does not clear an API left by an earlier debug/admin instance.

**Why wrong / fragile:**

The global becomes a lifecycle owner accidentally. It strongly retains the disposed app graph and can continue exposing mutation functions backed by stale/disposed runtime objects. A subsequent non-debug app instance can therefore coexist with an old debug mutation surface until a page reload removes the global.

This is bounded to app teardown/remount/dev workflows, so it is medium rather than high, but it violates the explicit WorldBundle/app ownership boundary.

**Affected consumers:**

- browser DevTools/automation using `window.seedvale.debug`;
- HMR/test/remount flows;
- any future in-page app restart/entry-point transition;
- memory retained by the stale closures.

**Owner domain:** `tools`.

**Existing plan coverage:** none. `ui-input-001`, plan 170 and `tools-014` define/extend the API surface but do not own app-level uninstall. `world-033` covers WorldBundle rebuild transaction safety, not full-app DevTools-global teardown.

**Recommended action:** implement `tools-019`: make installation return an ownership-aware disposer and call it from `createApp` teardown; remove only the API instance installed by that app so a newer owner cannot be accidentally deleted.

---

### F25-2 — LOW — `bootMarkEnd()` resolves the oldest matching mark and the module-global mark list never resets

**Affected flow:** repeated app/world subsystem construction → boot mark start/end → diagnostic output.

**Files / symbols:**

- `src/shared/bootMark.ts::bootMarks`
- `src/shared/bootMark.ts::useBootMark`
- `bootMark()`
- `bootMarkEnd()`
- `bootMarksSummary()`
- callers including `src/app/createApp.ts` and `src/world/createCaves.ts`

**Evidence:**

`bootMarks` is a module-global append-only array. `bootMark(name)` always pushes when `?bootMark` is active.

`bootMarkEnd(name)` uses:

```ts
bootMarks.find(mark => mark.name === name && mark.group === group)
```

which selects the first historical start for that group/name. Repeated `createApp` instances and repeated `createCaves` construction therefore measure from the oldest matching start, not the current invocation. There is no reset/removal API, and `bootMarksSummary()` prints all historical marks.

**Why wrong / fragile:**

The diagnostic gives increasingly incorrect durations after repeated construction and retains an unbounded list for the life of the JS module. It does not alter simulation state, hence low severity.

**Affected consumers:**

- startup/rebuild performance investigations using `?bootMark`;
- `createApp` boot summary;
- cave/world construction timing comparisons.

**Owner domain:** `tools`.

**Existing plan coverage:** none found. Existing cave/performance plans consume `useBootMark` but do not correct its lifecycle/pairing semantics.

**Recommended action:** cover in `tools-019`: give boot marks an explicit session/lifecycle boundary and pair an end with the current/latest unmatched start (or return a start token), while keeping disabled-mode overhead negligible and storage bounded.

## 5. Architecture observations

- `WorldConfig` remains one shared authority. `persistConfig.ts` has deliberate tolerant storage failure semantics; no confirmed state-corruption path was found from its silent localStorage catches.
- `perf/active.ts` is mutable module-global state, but unlike F25-1 it has an explicit app teardown (`setActiveMonitor(null)`) and a safe no-op owner.
- `navigationStats.ts` is intentionally session-wide and returns a copied snapshot. No hot-path allocation beyond explicit `getNavigationStats()` calls was found.
- Debug NPC/history traces inspected are bounded; the inspector refresh is low-frequency and disposed with the app.
- Shared location-search helpers are bounded and reused rather than duplicated.
- `debugDisableSystems` is a diagnostic isolation mechanism, not a production feature gate. It intentionally changes subsystem materialisation when explicitly requested by URL.

## 6. Cross-domain dependencies / follow-ups

- F25-1 touches `createApp` only at composition-root install/dispose wiring; debug-domain operations themselves should stay unchanged.
- Area 23's `world-033` rebuild/config transaction remains the owner of concurrent rebuild semantics. Do not fold it into `tools-019`.
- Area 24 already reviewed steady-state performance/workers; no additional production hot-path finding was discovered here.

## 7. Existing plans that already cover findings

No existing active plan fully covers F25-1 or F25-2.

Related but non-owning work:

- `ui-input-001-developer-debug-api.md` — established the shared DevTools surface.
- `tools-013-npc-decision-verification-and-scenario-tooling.md` — bounded semantic diagnostics.
- `tools-014-player-owned-horse-debug-controls.md` — extends debug mutations through domain authority.
- `world-033-worldbundle-rebuild-transaction-and-lifecycle-safety.md` — rebuild transaction, not app-global tooling teardown.

## 8. New plans required

- `tools-019-debug-tooling-lifecycle-ownership.md` — covers both confirmed tooling-lifecycle findings without creating a second debug namespace or diagnostics framework.

## 9. Verification limits

Static code/repository review only.

Not run:

- browser/manual verification;
- `pnpm docs:sync`.

No production implementation was changed in this audit, so no gameplay/build verification was required for the review artifact itself.

## 10. Master status update

Area 25 can be marked **✅ reviewed**: the two unresolved findings are medium/low and both have a focused owner plan.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

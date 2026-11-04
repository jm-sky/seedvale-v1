# Implementation notes: tools-025 developer tools UI layout

## Verified entry points and ownership (2026-11-04; static code recon)

- `house-browser.html` → `src/house-browser/main.ts` → `src/house-browser/App.vue`. The Vue app owns `selectedId`, reactive `config`, `assemblyInfo` and `errorMessage`. It mounts `createHouseBrowserScene(viewport, callbacks)`, calls `setConfig` from the `watch(config)` path, and disposes the scene on unmount. Keep all three boundaries.
- `src/house-browser/houseBrowserTypes.ts`: `HouseBrowserConfig` includes `showGrid`, `showGround`, `showShadows`, `showColliders`, `colliderPadding`, `cameraAutoFit`, `doorsOpen`, `lamp.night` and `profession`. `HouseBrowserScene` exposes `resetCamera()`, `setCameraView()`, `setConfig()`, `setHouse()`, `dispose()`.
- `src/house-browser/houseBrowserScene.ts`: scene authority; `applyConfigToScene()` applies door state, grid, ground, shadows, colliders and lamp, then `applyDayNight()` reads `config.lamp.night`. The “Night” widget must bind to this field; do not add a second lighting state.
- House UI controls already separated: `components/HouseList.vue`, `HouseInfo.vue`, `SceneControls.vue`, `ColliderControls.vue`, `LampControls.vue`, `ProfessionControls.vue`, `CameraControls.vue`. `App.vue` currently renders all in a fixed `w-80`, scrolling sidebar and a `relative` main containing an `absolute inset-0` viewport. Move/use existing prop/model/events instead of copying behavior.
- `App.vue` methods `updateColliderVisibility` and `updateDoorsOpen` also sync URL; preserve their use from new widgets. `selectHouse` syncs `house`. `resetCamera` and `setCameraView` already delegate to scene.
- `asset-browser.html` → `src/tools/assetBrowser/main.ts` → `src/tools/assetBrowser/ui/AssetBrowser.vue` plus `viewer/createViewer.ts`. Existing global reactive `browserState` is from `src/tools/assetBrowser/state.ts`.
- `AssetBrowser.vue` currently owns search/filter/index and load, reset, align, report/snapshot handlers; the long template contains nearly all sidebar controls. `createViewer.ts` exposes `align('position'|'frame')`, `resetTargetTransform()`, `frame()`, `resize()`, `refresh()` and `dispose()`. Use those exact callbacks.
- Asset state includes `layout` (`quad`|`single`), `activeView`, `showGrid`, `showAxes`, `showGround`, `showBbox`, `lightingPreset`, `renderMode` and `showOverlay`. Existing URL syncing is in `urlParams.ts`; layout persistence in `viewer/layoutPersist.ts`, camera persistence in `viewer/cameraPersist.ts`. Do not replace these with generic localStorage logic.
- `AssetBrowser.vue` template ends with `<div class="relative min-w-0 flex-1">` containing `#asset-browser-viewport` (`absolute inset-0`) and a `pointer-events-none` diagnostic `pre` overlay at bottom. Add toolbar/widgets as siblings on this relative layer with careful pointer events and z-index; keep report readable.
- `viewer/createMultiView.ts` owns quad views, split-drag and maximize; overlay must not interfere. `AssetBrowser.vue` already observes viewport size via `ResizeObserver`; `main.ts` also initializes viewer through `MutationObserver` and a window resize listener. Avoid creating duplicate viewer instances or changing mount sequence.
- `src/tools/toolRegistry.ts` defines `TOOLS` with `house-browser`, `asset-browser`, `continent-preview`; plain URLs point to independent Vite entry points. `vite.config.ts` declares each HTML as a separate build input. No standalone “Model Browser”.
- Both apps import `src/ui-vue/tailwind.css`. House Browser has minimal `style.css`; Asset Browser has a small base style in `asset-browser.html`. Share presentational components/CSS without coupling scene states.

## Architectural decisions

1. Shared chrome should only know static tool navigation and small presentational controls; each page owns its quick-action definitions and bindings. A small shared folder under `src/tools/` is reasonable, but do not move the House Browser scene or Asset Viewer into it.
2. Keep the House Browser reactive config as the sole source of truth; bind new switch directly to `config.lamp.night`. Keep `doorsOpen` and `showColliders` routed through current URL-sync methods.
3. Keep Asset Browser's `browserState` as source of truth and existing viewer methods as the only action API.
4. Prefer a compact top-level navbar + absolute overlay inside the existing `relative` viewport wrapper. Make overlay placement adjustable per app: House Browser has one view; Asset Browser has split/quad and a report at the bottom.
5. Avoid displaying the same interaction in the sidebar and overlay unless both are deliberately bound to the same model. Remove or collapse obsolete sidebar duplicate actions after verifying alternate access.
6. UI demos are not tools shell consumers. Continent Preview stays out of this migration; navigation link only.

## Non-obvious pitfalls / checks

- `LampControls.vue` uses a whole-object `defineModel` for `lamp`; setting `config.lamp.night` directly is compatible with existing deep `watch(config)`, but verify no stale copies if this component is split.
- `ColliderControls.vue` contains the doors toggle and collider visibility; moving it wholesale will also move padding. Prefer separating quick switches from detailed sliders, keeping a single binding for each.
- The sample concept depicts actions not verified in code; do not add a fake selection/transform gizmo or a new generic camera mode.
- Quad view mouse interactions and report overlay must remain reliable with toolbars positioned above canvas. Ensure no blanket fullscreen `pointer-events: auto` overlay.
- Check `viewer.resize()` after any shell size/layout change; compare both single and quad modes.
- Include short `@domain tools` JSDoc on new shared public functions only where useful.

## Focused verification

Existing tests worth retaining/running: `src/house-browser/colliderPreview.test.ts`, `houseLoadGuard.test.ts`, `dressingPreview.test.ts`, and Asset Browser `urlParams.test.ts`, `state.default.test.ts`, `viewer/layoutPersist.test.ts`, `viewer/cameraPersist.test.ts`, `viewer/viewportLayout.test.ts`, `alignmentEdit.test.ts`, `gripEdit.test.ts`. Add only focused tests if new stateful behavior emerges. Manual browser sign-off remains essential for mouse, split-pane and overlay layout behavior.

## Model selection

**Model:** Sonnet, Composer — predominantly Vue/Tailwind layout changes with clearly established state ownership; use Opus review if implementation touches viewer lifecycle or split-view interaction internals.

## Implementation (2026-11-04)

- Shared `src/tools/ui/ToolsTopbar.vue` (nav from `TOOLS`; Continent Preview under `Tools ▾`) and `ToolbarToggle.vue`.
- House Browser: overlay toolbars (Night → `config.lamp.night`, Doors/Colliders via existing URL-sync methods, Grid/Ground/Shadows, Reset/Fit + views). Sidebar keeps auto-fit, collider padding, lamp, profession; `CameraControls.vue` removed.
- Asset Browser: overlay toolbars (Grid/Axes/Ground/Bounds, lighting, Layout/view, Reframe, Align frame/pos, Reset transform) bound to `browserState`; duplicates removed from sidebar. Page title is now "Asset Browser".
- Checked: type-check, lint, `src/house-browser` + `src/tools` vitest (73 pass), build. **Not browser-verified** (pointer events over canvas, quad drag, narrow widths, `viewer.resize()` after the new topbar) → queue §2. Concept PNG not available, not added.

# Plan: Developer tools UI layout and quick controls

**Created:** 2026-11-04
**Status:** `planned` 📋
**Type:** polish
**Priority:** medium · **Effort:** L
**Depends on:** -
**Domain:** `tools`
**Subdomains:** `development` `diagnostics`
**Tags:** `ui` `browser` `tooling`
**Model:** Sonnet, Composer

## Goal

Make V1 developer browsers faster and clearer to use through a small, consistent layout migration: shared top navigation, concise left inspection sidebar, immediately visible frequently used switches and actions, and semi-transparent controls over the 3D viewport. **Reuse the existing Vue state, viewers and scene APIs.** This is a UI rearrangement, not a new editor or application framework.

## Scope and entry points

- **House Browser:** `/house-browser.html`, `src/house-browser/App.vue`.
- **Asset Browser:** `/asset-browser.html`, `src/tools/assetBrowser/ui/AssetBrowser.vue`. Its current heading is *Asset Alignment Browser*; it is **not** a separate application.
- **Navigation:** use the existing `src/tools/toolRegistry.ts` as the source for tool names and URLs. The registered `Continent Preview` may be reachable from a compact `Tools` menu, but migrating its page layout is out of scope.
- **UI demos:** links may be grouped separately if useful, but demos are **not** developer browsers and do not inherit the tools shell. Do not invent a separate “Model Browser”.

## UX requirements

1. **Topbar:** one restrained, dark shared navigation strip with the SeedVale Tools title, active tool and links to actually existing tool entry points. Keep the standalone HTML pages and direct URLs; navigation is standard page navigation, not a combined runtime.
2. **Viewport first:** retain the narrow resizable-or-fixed left sidebar footprint without adding a second inspector column. The 3D canvas occupies the remaining area and remains the primary visual focus.
3. **On-viewport controls:** place the viewport toolbar as an absolutely positioned overlay inside a `position: relative` viewport wrapper. Use a modest translucent dark background, adequate contrast and compact spacing. It must not take a dedicated full-width row from the canvas.
4. **Visible quick toggles:** expose frequent actions without opening sidebar accordions. House Browser: `Night` (`config.lamp.night`), `Doors` (`config.doorsOpen`), camera Reset/Fit and existing view directions; consider Grid, Ground, Shadows and Colliders in the toolbar or a small always-visible popover. Asset Browser: Grid, Axes, Ground, Bounds, Reframe, Single/Quad, view selection, Align Frame/Position and Reset Transform; include a compact lighting preset selector if it fits.
5. **Sidebar stays for configuration:** House list and details; collider padding, lamp positioning/yaw/intensity, profession. Asset reference/target choices, anchors, transforms, grip/alignment edits, character customization, pose and detailed rendering controls. Collapse long sections by default where this improves navigation; keep search and primary selection visible.
6. **One source of truth:** a control shown in multiple places reads/writes the **existing** reactive field; avoid duplicated or conflicting state. Preserve URL params and Asset Browser layout/camera persistence.
7. **Feedback and diagnostics:** preserve existing error/status/report information. A small bottom status strip and collapsible diagnostics are permitted only where they do not duplicate the existing report overlay or obscure useful model content.
8. **Interaction:** controls must be mouse/keyboard accessible, have readable labels/tooltips/focus styles and visible on/off states. Buttons and overlay containers must not block OrbitControls, quad-view drags or camera interactions outside the control hit areas. Handle narrow screens via wrapping/overflow or simplified button groups, not viewport clipping.
9. **Visual constraints:** flat dark colors, standard controls, small consistent spacing and one simple accent color. No gradients, illustrated backgrounds, leaves, decorative imagery, animation library, draggable window manager or new UI framework.

## Reference concept / layout contract

The **author-reviewed minimal mockup from this conversation (2026-11-04)** is a visual direction, **not** a pixel-perfect specification. Its intended structure:

```text
┌ SeedVale Tools | House Browser | Asset Browser | Tools ▾ ─────────┐
│ Sidebar (search, selections, settings) │ 3D viewport           │
│                                       │ [Night] [Doors]       │
│                                       │        [view toolbar]  │
│                                       │                       │
│                                       │       3D content      │
│                                       │                       │
│                                       │ [compact status]      │
└───────────────────────────────────────────────────────────────┘
```

**Asset handoff:** the actual PNG concept-art was supplied/generated in the ChatGPT discussion but is not yet committed in the repository. Do **not** create an invented image link or substitute a newly generated illustration. The implementation agent should attach the approved original image under `docs/plans/references/` if its bytes are available, then replace this note with a relative Markdown image link. This does not block implementing the clearly specified UX requirements.

Mockup controls that do not exist in current V1 code are **not** feature requirements. For example, “Night” in House Browser means the already existing lamp/day-night preview switch, not a new global time simulation.

## Boundaries / non-goals

- Do not change Three.js rendering, scene semantics, house assembly, asset loading/alignment algorithms or gameplay.
- Do not merge browser entry points, add a generic docking system or import the game UI into these tools.
- Do not add fake actions (selection gizmos, transform tools, exports, etc.) merely because a concept image depicts them.
- Do not redesign the UI demo pages, Continent Preview or gameplay UI in this plan.
- Prefer a **few** light shared Vue/Tailwind components and CSS classes over a new abstraction hierarchy.
- Add targeted JSDoc with `@domain tools` to new public/architectural integration functions where useful for preflight discovery.

## Suggested implementation slices

1. **Shared shell:** simple topbar and reusable visual styles, applied independently to the two browsers. Keep independent scene lifecycle and mounting.
2. **House Browser:** reorganize existing controls into toolbar widgets + sidebar; preserve all existing states/actions and URL parameters.
3. **Asset Browser:** move existing quick actions/toggles into viewport overlay; keep quad/single-view layout, report overlay and persistent camera controls intact.
4. **Polish and verification:** narrow viewport behavior, focus/hit-testing, manual visual comparison with the approved concept, targeted regressions.

Each slice should be reversible and independently usable.

## Verification / acceptance

- Both URLs load directly and switch to each other through the shared navigation; `toolRegistry.ts` is the sole registered-tools list.
- House Browser: selected house, Grid/Ground/Shadows/Colliders, collider padding, Doors, Night, lamp positioning, profession and camera controls behave as before; `house`, `showColliders` and `doorsOpen` query parameters still work.
- Asset Browser: load reference/target, anchors, transform edits, align/reset, lighting modes, toggles, Single/Quad, view selection and Reframe all work. Quad split drag, maximize, camera orbit/zoom, persisted layout/camera, URL parameters, snapshot and report overlay still work.
- No overlay steals pointer/scroll gestures from the 3D canvas outside its own visible controls; no occluded essential content in the smallest supported desktop viewport.
- Focus, disabled states and active controls are understandable without opening nested panels.
- Run relevant Vue/typecheck/build and focused existing house/asset browser tests; perform **manual browser** checks on both browsers. Static inspection alone is not visual/runtime confirmation.
- No new scene update loop, renderer instance or simulation dependencies due to shell/toolbar changes.

## Implementation notes

[Verified file and state ownership handoff](./implementation-notes/tools-025-developer-tools-ui-layout-implementation-notes.md).

## Completion

After implementation, add the original approved concept PNG if available, record browser verification and update plan status via the normal plan workflow. Keep derived indexes and next plan IDs generator-owned; do not edit generated plan summaries manually.

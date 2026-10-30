# Plan: Align debug OBB overlays with physical colliders

**Created:** 2026-10-30
**Status:** `planned` 📋
**Type:** fix
**Priority:** medium · **Effort:** S
**Depends on:** -
**Domain:** `tools`
**Subdomains:** `debug`
**Tags:** `collision` `obb`

## Problem

After fence collision yaw was corrected, the orange `?debugColliders=1` OBB visualization still appears angled across visible fence sections. This misleads collision debugging even when gameplay collision is correct.

## Confirmed code seam

- `src/settlement/settlementPalisade.ts`: `fencePlacementColliders()` intentionally writes `rotationY: -placement.rotationY`, converting from Three.js visual yaw to the mathematical OBB frame in `world/collision.ts`.
- `src/debug/colliderInstancedVisual.ts`: instanced debug OBB boxes currently use collider `rotationY` directly as a Three.js quaternion yaw.
- `src/debug/colliderDebugView.ts` and House Browser reuse the shared visualizer.

## Scope

- Correct **presentation-only** conversion of mathematical OBB yaw into Three.js yaw in the shared instance renderer; keep physical `fencePlacementColliders()` unchanged.
- Verify circle visualization unaffected; verify multiple nonzero positive/negative angles, dimensions and positions.
- Check shared House Browser collider preview and house wall/door overlays, not just fences. If house collider poses themselves have an unrelated alignment defect, record it separately rather than silently modifying physics.
- Preserve instancing, bounded instance counts and disposal; avoid per-frame allocations/performance regressions.

## Non-goals

No changes to authoritative OBB collision resolution, fence placement, physics geometry, or house collision bug fixes.

## Verification

- Focused regression tests for nonzero rotations (including +/-45° and 90°), comparing rendered box orientation to the collider's mathematical long axis; zero yaw alone is insufficient.
- Manual browser visual PASS with `?debugColliders=1` at rotated external fences and House Browser previews.
- Add JSDoc/`@domain tools` for significant new helper APIs if introduced.

## Revival scheduling

Debug-only visualization changes must respect the Strategic Brief's D4 performance-first freeze; no runtime merge during freeze absent authorized exception, even if gameplay collision is untouched.

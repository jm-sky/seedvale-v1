# Plan: Align debug OBB overlays with physical colliders

**Created:** 2026-10-30
**Status:** `planned` 📋
**Type:** fix
**Priority:** medium · **Effort:** S
**Depends on:** -
**Domain:** `tools`
**Subdomains:** `debug`
**Tags:** `collision` `obb`
**Model:** Sonnet, Composer

## Goal and scope

The orange footprint in the gameplay collider overlay must match the authoritative OBB at every yaw. Apply the mathematical-to-Three.js yaw conversion once in the shared renderer used by gameplay and House Browser. Preserve circle rendering, instance limits, dimensions, placement, disposal and the existing update frequency.

## Acceptance and verification

- In a scene without WebGL, read the actual instance matrices for translated, non-square boxes at zero, +45°, −45° and 90°. Verify both oriented axes, half-extents and centre against the collision frame. Confirm a circle keeps its original matrix and reducing the input count removes old visible instances.
- Verify House Browser with padding zero and nonzero. Padding expands the footprint about the same centre and physical axes. The source colliders remain unchanged.
- Manually inspect an oblique external pasture or paddock fence at `?debugColliders=1`, including a gate gap. In `/house-browser.html`, toggle colliders, padding and door open/closed. The overlay must follow the physical walls and the presence of a closed leaf. Record any disagreement between physical and visible house geometry separately with a reproducible pose.
- Keep existing collision, house-builder and fence tests green. Record manual observations separately from automated matrix results.

## Boundaries and scheduling

Presentation only. No changes to physical OBB producers, house transforms, collision resolution, fence placement or vertical visualization. No dependency on the campfire plan. Keep the per-frame gameplay path allocation-neutral relative to the existing renderer. Document any significant new public API with `@domain tools`. Runtime merge remains gated by D4 exit or an authorized exception.

[Implementation notes](implementation-notes/tools-021-collider-debug-obb-orientation-implementation-notes.md)

# Plan: Jumpable low campfire collision

**Created:** 2026-10-30
**Status:** `planned` 📋
**Type:** fix
**Priority:** high · **Effort:** M
**Depends on:** -
**Domain:** `settlements`
**Subdomains:** `buildings`
**Tags:** `collision` `campfire`
**Model:** Sonnet, Composer

## Goal and scope

A solid settlement firepit stops a grounded player. A properly timed jump carries the player across the low body. Cover the village pit and raised masonry hearth, retaining both footprints. The player's feet must clear the body at its placed world elevation. Keep the same behavior lit or unlit.

## Acceptance and verification

- On level terrain, walk and sprint into each pit without jumping. Both stop at the existing contact rim. A timed normal-speed jump crosses the small pit. A timed sprint-jump crosses the centre of the wider masonry hearth. Demonstrate a full crossing before descent, not just a frame above the top.
- Test both positive and negative placement elevations, equality at the top, and feet just above it. Include grounded approaches from a lower and a higher nearby surface. Neither an elevation difference nor pressing jump while still below the lip grants passage.
- At 30 and 60 Hz, exercise horizontal collision and the production vertical integrator together. Verify that collision reactivates on descent, an ordinary unbounded obstacle blocks an airborne player, and existing cave Y bands retain both boundaries. Verify the existing ground-agent queries still see the fire disk.
- Manually check both variants, including interaction from the rim, movement after landing and NPC/fauna approach or avoidance. Re-enter a streamed settlement and check for stale or duplicate collision. Record browser outcome separately from unit results.

## Boundaries and scheduling

No changes to jump tuning, NPC/fauna navigation, fire damage, standing on the fire, placed fires, decorative wilderness remains or save data. No dependency on the debug overlay plan. Document any significant new public helper with its owning `@domain`. D4 permits planning and tests. Runtime integration waits for D4 exit or an authorized exception.

[Implementation notes](implementation-notes/settlements-024-campfire-jumpable-low-collision-implementation-notes.md)

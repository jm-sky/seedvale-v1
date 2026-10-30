# Q13 — Older plans vs Vision: working author decisions

**Date:** 2026-10-30
**Status:** author discussion complete (10 of 10 ChatGPT-identified areas decided); full Opus reconciliation audit pending.
**Authority:** author decisions in this discussion. The Strategic Brief remains authoritative for Revival integration. Not implementation authorization.

## Approved in discussion

1. **Skills/EXP:** Practice, teachers and books develop skills; no global character EXP or levels. Existing internal per-skill XP may stay as implementation detail, but should not appear in the UI. Do not force a rewrite of existing skill internals.
2. **Player crafting:** Supported through shared recipes, materials and world production rules. Requirements vary by recipe: none, campfire, workshop or other facilities. NPC artisans and player orders retain meaningful roles.
3. **Time:** Fixed **12 real minutes per normal in-game day**, replacing 8. No configurable day-length presets. Preserve existing time acceleration/skip; maintain time/simulation consistency.
4. **Human mortality:** Ordinary 0 HP causes incapacitation, not automatic death. Finishing, untreated wounds, illness, predators and serious hazards can still kill; real death uses authoritative NPC death/corpse lifecycle.
5. **Player defeat:** Unconsciousness with situational injuries, recovery/treatment, time loss and possibly lost belongings; death only in exceptional severe circumstances. Exact tuning unresolved.
6. **Quest autonomy:** Autonomous agents can resolve genuine world-driven problems. Major authored adventures require deliberate progression/termination rules; no generic automatic erasure of authored content. Preserve simulation autonomy and verify current external-resolution code.
7. **Economy:** Real physical production, storage, movement and consumption of goods. No artificial item spawning to repair economic shortages. Controlled currency sources and sinks permitted; no strict global money conservation. Safeguards unresolved.
8. **Companions:** Animals can die permanently, but have strong flee/self-preservation and critical escape protection. Selected important NPCs may have stronger travel-risk avoidance, not immortality. Exact mechanisms unresolved.

9. **Settlement leadership and founding:** The player can lead or found settlements by setting strategic goals executed autonomously by NPCs, rather than direct city-builder micromanagement. Existing settlements can develop independently. A **generic NPC outpost-founding mechanism may be considered in the future**; this is a potential long-term extension, not an approved immediate feature or a mandate for general autonomous town founding. It qualifies the stricter 2026-10-29 Vision Alignment prohibition on generic NPC founding and requires a separate scoped design decision.
10. **Survival intensity:** Keep the existing V1 player-needs balance as the baseline: eating and drinking approximately every in-game day, with attribute penalties for neglect. No general softening or hardening of player survival is approved. Preserve deep NPC needs and meaningful weather, illness, injury and expedition consequences.

## Reconciliation handoff

These ten areas were grouped by ChatGPT, **not** listed by Opus in Q13. Q13 explicitly requires a separately agreed Opus review against current V1 code/tests and older plans. Opus should verify precise conflicts and further omitted areas, reconcile plan intent against actual implementation, preserve V1 simulation depth, and seek author decisions on any uncovered forks. This document alone does **not** close Q13 or authorize changes to runtime code or existing plans.

References:
- [Q13 queue](./AUTONOMOUS-SESSION-QUEUE.md)
- [2026-10-29 Vision Alignment](./2026-10-29--vision-alignment-v1-v3.md)
- [Strategic Brief](./STRATEGIC-BRIEF.md)

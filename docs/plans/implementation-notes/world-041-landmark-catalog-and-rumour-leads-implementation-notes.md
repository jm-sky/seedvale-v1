# Implementation notes: world-041 landmark catalog and rumour leads

Plan: [world-041](../world-041-landmark-catalog-and-rumour-leads.md)

## L3a — uncertain projection, consumer guards, arrival rules (2026-11-05, Sonnet)

Landed (no dialogue, no producer, no save change):

- `src/world/locations/rumourLead.ts`: `rumourLeadArea`, `genericLocationLabel`, `isRumourLeadEntry`, `isLocationDiscovered`, `countOpenRumourLeads`, `RUMOUR_LEAD_CAP = 4`.
- `mapData.project()` estimated branch (area centre + radius + generic label); `createMapData` now requires `getSeed`.
- Consumer guards: `guardLocalKnowledge.alreadyKnownInRange`, `listKnownSettlementOptions`, quest `hasDiscoveredLocation` (`createApp`), `suppressedCaveLocationIdsForMineBinding` (estimated mine).
- `src/world/locations/landmarkArrival.ts` (lake / mountainPeak / cemetery) wired into `LocationProximityDiscovery` via an optional `sampleTexel`; catalog `lakeExtentRadius` / `peakSummitHeight` (memoized, non-persisted).
- Tests: `uncertainKnowledge.test.ts` (containment, clipping, determinism, no-name/no-pin per consumer, save/load reconstruction, cap derivation, stale ids, arrival closes lead), `landmarkArrival.test.ts`, catalog extent/summit test.

Deviations / findings for L3b:

- **Radius tier is not reconstructable.** The contract makes guard/hunter leads smaller (60–120 m) than other NPCs', but a lead persists only `{id, state, source}`, so `project()` cannot know the tier. L3b needs one decision: a uniform radius, a deterministic per-target tier, or an optional persisted field (save bump). `rumourLeadArea` already accepts `radiusMin/radiusMax`.
- Corner/edge: a target hugging the world bound keeps containment and may graze the bound (<= 0.4 r at a corner).
- Peak summit height is approximated from a sample grid around the coarse-cell centre, not the true summit; revisit with L1 landforms.
- Not browser-verified (no gameplay observed); technically verified only.

## L4 / Q137 — English script awaiting author approval (2026-11-06)

- [Astra's rumour line script](../../research/v1-revival/2026-11-06--q137-npc-rumour-line-script.md) supplies the reviewable copy and Q138 handoff: stable line IDs, placeholder contracts, outcome coverage, proposed uncertain-location labels, and gated future landmark wording.
- Reviewed against the existing area-topic menu, `guardLocalKnowledge`, `npcPlayerFollowUpDelivery`, `dialogueTemplates`, compass/travel helpers and L3a projection. Current runtime still delivers exact names through the older `discovered` path; this document does not integrate the draft.
- Q137 is **not complete** until the author approves the English copy. Q138 remains blocked by that approval and Q136-a (persisting/reconstructing guard/hunter precision); Q136-b label wording remains a proposal.
- Documentation only: no runtime, mechanics, persistence, worldgen, audio or quest changes; no gameplay/browser verification claimed.

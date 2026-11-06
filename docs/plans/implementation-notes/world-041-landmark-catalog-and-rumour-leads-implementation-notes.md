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

## L4 / Q137 — English script approved by the author (2026-11-06)

- [Astra's rumour line script](../../research/v1-revival/2026-11-06--q137-npc-rumour-line-script.md) supplies the reviewable copy and Q138 handoff: stable line IDs, placeholder contracts, outcome coverage, proposed uncertain-location labels, and gated future landmark wording.
- Reviewed against the existing area-topic menu, `guardLocalKnowledge`, `npcPlayerFollowUpDelivery`, `dialogueTemplates`, compass/travel helpers and L3a projection. Current runtime still delivers exact names through the older `discovered` path; this document does not integrate the draft.
- **Author approval, 2026-11-06:** dialogue/topic wording, conditional future-kind copy and the bounded Q136-b English labels are approved; Q137 is complete. Q138 remains blocked only by Q136-a (persisting/reconstructing guard/hunter precision). This approval does not select a radius/storage policy, activate future kinds or authorize audio production.
- Documentation only: no runtime, mechanics, persistence, worldgen, audio or quest changes; no gameplay/browser verification claimed.

## L3b / Q138 — rumour producer + dialogue (2026-11-06, Sonnet)

Landed (technically verified; **not** browser-verified):

- **Save v61 (`CURRENT_SAVE_VERSION` 60 → 61):** `LocationKnowledgeEntry` / `SaveLocationKnowledge` gain optional `leadTier: 'expert'` (only valid on `estimated`). Migration v60→v61 only moves the version — an absent tier already means the common 120–260 m tier, which is what every old lead was. `reveal(id, state, source, leadTier?)` drops the tier on upgrade.
- **One lead-area function:** `rumourLeadAreaForEntry(seed, entry, target)` (`rumourLead.ts`) — `mapData.project()` and the spoken bearing/hours both use it (expert = 60–120 m), so speech never reveals more than the marker.
- **Producer:** `guardLocalKnowledge.askAboutArea(npcId, x, z, speaker, trust)` is now async and instant (no wait, no persisted state). Gates in order: trust (`RUMOUR_TRUST_MIN = -10`, 🟡 threshold) → empty pool → daily (top candidate by `hash(seed, npc, floor(day), id)` ignoring knowledge; already in `LocationKnowledge` = "nothing new today") → open-lead cap (`RUMOUR_LEAD_CAP`) → reveal `estimated`+`npc`. Bands (🟡, L0 §5): ordinary `(4 h, 12 h]`, guard/hunter `(4 h, 25 h]` via `landmarksInRangeAsync`; kinds limited to cave/ruins/lake/mountainPeak/cemetery (script copy exists only for those).
- **Text:** `src/ai/rumourLines.ts` carries the approved Q137 lines (success + trust/cap/none/daily); variant chosen by a deterministic hash among equal wordings. Dormant: `RUM.NEAR` (origin inside the area cannot occur with a 4 h band), reserved landform/waterfall lines, child lines, deferred-wait lines (no wait was introduced).
- **Topic:** `NpcDialogueMenu` offers it to every living adult (children: not offered). Speaker = `role` (`guard` / `hunter` / adult).
- **Legacy:** the research/delay path is removed. Old saves' `map.guardLocalKnowledge` is still validated but dropped on restore and never written (removal would need another migration — loose end); an old armed `deliver_world_knowledge` follow-up is drained by `deliverNpcWorldKnowledgeFollowUp` without revealing anything.
- **Quests:** no quest reads a guard reveal directly; `hasDiscoveredLocation` uses `isLocationDiscovered`, so a rumour (`estimated`) does not complete it — arrival reveal (`discovered`/`confirmed`) does, as before. Quest-owned search areas are separate entries, untouched.

Open / for the author (queue §2): UI strings of the topic and Polish `genericLocationLabel` stay Polish while NPC lines are English (approved script); trust threshold and bands are 🟡; the daily pool depends on the player's position (band edge) — a player walking between asks can see a different top candidate on one day; walk-through (L5) not done.

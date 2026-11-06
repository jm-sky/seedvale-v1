# Plan: Simulation scaling — retained-NPC scan, crowd pairs, skip-end catch-up, fauna bookkeeping

**Created:** 2026-11-06
**Status:** `planned` 📋
**Type:** optimization
**Priority:** high · **Effort:** M
**Depends on:** -
**Domain:** `settlements-npcs`
**Subdomains:** `logistics` `schedules`
**Tags:** `performance` `simulation` `determinism` `v1-revival` `review-041`
**Roadmap:** -

## Goal

Address the CPU scaling risks of [review 041](../reviews/2026-11-06--041--rendering-performance-final-critical-synthesis.md) (class **B1**, stage S2): fix the one narrow confirmed mechanism now (F16-28) and **measure** the others before any behaviour-affecting change (F16-29, F16-30, F16-33). F16-32 (clock semantics) is an author decision, not engineering.

| Stage | Findings | Owner (verified 2026-11-06) | Start condition | Queue |
| --- | --- | --- | --- | --- |
| **N1** retained-NPC scan | F16-28 (S4-1) | `src/settlement/SettlementsManager.ts` ~L1618: `merchantByPackAnimalKey` rebuilt by `npcStates.forEach` every update whenever any detached animal exists | ready | Q181 |
| **N2** scaling counters + microbenchmarks | F16-29, F16-30, F16-33 | `src/ai/npcCrowd.ts` (all unordered pairs incl. dead slots, ~L61–69), `src/app/gameLoop.ts` `skip.justFinished` (~L1124) + NPC/fauna skip resolvers, `src/fauna/createFauna.ts` / `animalUpdateCadence.ts` | ready (diagnostic only) | Q184 |
| **N3** conditional fixes | F16-29 deterministic spatial neighbours; F16-30 staged catch-up; F16-33 bookkeeping cache | same owners | N2 note shows material cost at realistic N/skip lengths; F16-30 also needs author if semantics/visible timing change | rows added by N2 |
| — clock semantics | F16-32 | `gameLoop.ts` `dt = Math.min(rawDt, 0.05)` (~L1080), `timeSkip.ts` | **decision needed** — queue §3 Q184-a | — |

## Direction

- **N1:** event-invalidated key index under the existing owner: maintain the pack-animal → merchant map when `merchantJourney` with `packAnimalId` is set/cleared (or rebuild only on a registry version change); skip the rebuild entirely when no detached animal can match. No global per-frame scan of retained NPC records. Keep the composite `persistentLivestockKey` identity.
- **N2:** extend `agentCpuDiag` / existing perf counters (pair count, crowd ms, skip-end max ms and catch-up step count, fauna sensing vs spawner ms) and add headless microbenchmarks vs N (crowd), resident count × skip hours (1–24 h), materialized fauna count. Output a short note with numbers and a recommendation for N3.
- **N3 (not approved yet):** crowd — deterministic, symmetric local neighbour grid that preserves impulse semantics and corpse handling; skip — owner-local staged catch-up with atomic publication only if equivalent; fauna — owner-local bookkeeping cache keeping immediate threat sensing.

## Non-goals

No fixed-step conversion, no blanket NPC/fauna throttling, no population reduction, no change to offscreen continuity. Spatial state seam refactor stays in [npc-064](./npc-064-agent-performance-spatial-state-seam.md); NPC cost categories in [npc-063](./npc-063-agent-performance-update-cost-attribution.md); offscreen pack-animal continuity in [settlements-npcs-057](./settlements-npcs-057-agent-performance-offscreen-pack-animal-continuity.md).

## Verification

- **N1:** test: fixed detached count + growing retained registry → index rebuild count does not scale per frame; journey start/end/transfer, colliding bare `packAnimalId` across settlements, save/load keep the follow target correct.
- **N2:** counters zero-cost when off; deterministic replay unchanged (counters only).
- **N3:** deterministic replay/state-diff fixtures (impulses, near counts, corpses; needs/trade/stock/quests after skip), WSL A/B, §4 Windows.

## Stop if

- N1 requires changing merchant journey persistence → stop (persistence contract).
- Any N3 option changes simulation outcomes, visible cadence or time meaning → author.

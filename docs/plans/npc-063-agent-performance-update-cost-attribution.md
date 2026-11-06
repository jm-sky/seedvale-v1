# Plan: Agent Performance — NPC Update Cost Attribution

**Created:** 2026-09-21
**Status:** `draft` 📝
**Type:** optimization
**Priority:** high · **Effort:** S
**Depends on:** -
**Domain:** `npc`
**Subdomains:** `behavior` `lifecycle`
**Tags:** `agent-performance` `performance` `profiling`

## Cel

Rozbić koszt runtime NPC na konkretne kategorie tak, aby kolejna optymalizacja dotyczyła faktycznego hot path zamiast arbitralnego throttlingu decyzji lub całego `NpcAgent.update()`.

## Dlaczego

Aktualny koszt kategorii NPC jest istotny, ale obejmuje więcej niż samą logikę decyzji. Przed zmianą cadence trzeba rozdzielić przynajmniej koszt symulacji, movement/world queries i presentation/animation.

## Zakres draft

Po reconie plan powinien określić minimalną instrumentation pozwalającą rozdzielić m.in.:

- needs / pressures / decisions / action lifecycle,
- movement i path/traversal work,
- sensing i world queries,
- combat i interaction checks,
- animation mixer i presentation,
- labels/overlays,
- settlement/livestock work włączony obecnie do szerszej kategorii NPC,
- alokacje i broad scans zależne od liczby agentów.

## Guardrails

- To plan measurement-first.
- Nie zmieniać cadence decyzji ani potrzeb przed attribution.
- Nie tworzyć rozbudowanego profilera, jeśli wystarczą bounded counters/timers.
- Measurement nie może zmieniać zachowania NPC.
- Unikać per-frame allocation w instrumentation.
- Dodać JSDoc do ważnych nowych publicznych/architektonicznych funkcji lub klas; gdy pomaga preflightowi, użyć `@domain npc`.

## Rezultat

Plan powinien zakończyć się rankingiem konkretnych kosztów i wskazaniem jednej lub kilku małych optymalizacji z mierzalnym ROI. Jeśli presentation/animation okaże się głównym kosztem, nie dublować zakresu planu render LOD.

## Out of scope

- ogólny redesign NPC AI,
- nowe systemy decyzji,
- zmiany gameplayu,
- throttling wszystkiego według odległości bez dowodu,
- browser verification przez AI.

## Verification

AI agent wykonuje odpowiednie testy/typecheck/build i sprawdza narzut instrumentation. Benchmark runtime wykonuje użytkownik.

## Recon do wykonania przed przejściem na planned

Uzupełnić o aktualne call-sites, istniejącą instrumentation, granice `SettlementsManager` / `NpcAgent` i dokładny baseline benchmarków.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

## Review 041 cross-reference (2026-11-06)

[review 041](../reviews/2026-11-06--041--rendering-performance-final-critical-synthesis.md): cross-task joins (F16-31) are [tools-027](./tools-027-frame-attribution-and-benchmark-provenance.md) T2; crowd/skip/fauna counters (F16-29/30/33) are [settlements-npcs-058](./settlements-npcs-058-simulation-scaling-retained-scan-crowd-and-skip-catch-up.md) N2. This plan keeps the NPC update category split (incl. mixer cost for F16-22). Program: [roadmap §audit 041](../research/v1-revival/2026-10-27--master-revival-roadmap.md#rendering--performance-audit-041--program-2026-11-06).

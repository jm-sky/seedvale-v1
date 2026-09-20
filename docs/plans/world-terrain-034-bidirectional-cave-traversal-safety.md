# Plan: Bidirectional cave traversal safety

**Created:** 2026-09-15
**Status:** `verification needed` 🔍 — reopened after browser verification still found one-way mouth exits; second pass fixed mouth carve grade + heightfield floor ownership at segment overlaps. Browser/manual cave enter/exit is User.
**Type:** bug
**Priority:** high · **Effort:** M
**Depends on:** ~~world-terrain-019~~, ~~world-terrain-020~~
**Domain:** `world-terrain`
**Subdomains:** `terrain` `landmarks`
**Tags:** `caves` `heightfield` `traversal` `soft-lock`
**Roadmap:** -
**Model:** `Opus`, `Sonnet`

## Cel

Usunąć przypadki, w których gracz może wejść do wygenerowanej jaskini, ale nie może z niej wyjść z powodu lokalnie zbyt stromego finalnego gameplay floor.

Naprawa ma wzmacniać istniejący kontrakt `CaveTopology -> CaveHeightfieldRepresentation -> cave gameplay query`, bez teleportów awaryjnych, player-only wyjątków ani drugiego systemu nawigacji.

## Recon

- `src/world/caves/productionTopology.ts` ogranicza nachylenie centerline przez `MAX_TRAVERSABLE_FLOOR_GRADE`.
- Finalny gameplay floor powstaje jednak w `src/world/caves/caveHeightfieldRepresentation.ts`; reprezentacja może lokalnie skoncentrować zmianę wysokości bardziej niż topology.
- Pierwsza implementacja (2026-09-15) naprawiła cliff widening→chamber (lobe floor follows centerline), ale testy **świadomie pomijały** entrance segment / mouth portal (`if (seg.from === 'entrance') continue`, `mainRouteFromMouthInterior` startował od inward end). Reverse traversal dochodził tylko do mouth interior, nie przez `surface → mouth → interior`.
- Browser verification po pierwszej pass nadal wykazywało one-way exits. Recon drugiej pass wskazał dwie przyczyny na finalnym gameplay floor:
  1. **Mouth carve** (`CAVE_MOUTH_DEPTH` / `CAVE_MOUTH_RADIUS`): peak radial grade ~65° > `SLOPE_MAX_WALKABLE_DEG` (55°) — downhill enter OK, uphill exit blocked by `constrainToSlope`.
  2. **Heightfield floor union**: soft-min najniższych floorów pozwalał szerokiemu downstream segmentowi (core nadal `t = 0` metry upstream) wykopać cliff w upstream rampę transition.
- `SLOPE_MAX_WALKABLE_DEG` pozostaje źródłem prawdy dla akceptowalnego gameplay grade.

## Zakres

1. Poprawić generowanie/interpolację cave floor w `caveHeightfieldRepresentation.ts`, tak aby przejścia między passage/widening/chamber/branch nie tworzyły lokalnego floor grade większego niż player walkability contract.
2. Zachować topology jako źródło geometrii trasy; nie dodawać post-processu niezależnego od centerline, który mógłby rozjechać rendering, occupancy i gameplay query.
3. Walidować finalny heightfield, nie tylko topology stations.
4. Główna droga od wejścia do wnętrza ma być traversable w obie strony — **w tym** `surface → mouth → interior` i odwrotnie na hybrid gameplay floor (`queryHeightfieldGround` / carved `walkSurfaceAt`).
5. Mouth carve musi mieć peak grade ≤ walkability contract (shared discs w `mouthCarve.ts`); nie player-only escape.
6. Istniejące `it.fails` w `productionTopology.floor-continuity.test.ts` po pierwszej poprawce stały się normalnymi testami; druga pass dodaje mouth-transition regression.
7. Bounded zestaw seedów + Grota fixture (`1136726869`).

## Guardrails

- Nie dodawać przycisku/teleportu „wydostań się z jaskini” jako rozwiązania.
- Nie zwiększać globalnie player slope limitu tylko po to, aby przejść wadliwy floor.
- Nie tworzyć osobnego cave navmesh/pathfinding systemu.
- Nie modyfikować world seed semantics ani cave siting, jeśli problem można rozwiązać w reprezentacji floor / mouth carve.
- Zachować deterministyczność worldgen.
- Bump `CAVES_V2_VERSION` przy zmianie mouth geometry / heightfield algorithm identity.

## Relevant files

- `src/world/caves/caveHeightfieldRepresentation.ts`
- `src/world/caves/caveHeightfieldQuery.ts`
- `src/world/caves/productionTopology.ts`
- `src/world/caves/productionTopology.floor-continuity.test.ts`
- `src/world/caves/mouthCarve.ts`
- `src/world/caves/caveMouthGeometry.test.ts`
- `src/world/caves/caveWorldgenCache.ts`
- `src/terrain/slopeConstraint.ts`
- `docs/plans/implementation-notes/world-terrain-019-cave-heightfield-production-migration-implementation-notes.md`

## Verification

Automated:

- mouth carve combined grade ≤ `tan(SLOPE_MAX_WALKABLE_DEG)`,
- hybrid `surface → mouth → interior` and reverse ≤ walk-max grade + step continuity,
- interior segment heightfield grade (incl. former chamber cliff) remains green,
- bounded seeds `[42, 99, 7, 1]` + Grota `1136726869`.

Manual browser verification wykonuje User:

- wejście do kilku jaskiń i wyjście tą samą drogą,
- szczególnie cave z dużą różnicą wysokości komory,
- brak widocznych cliffów/stepów blokujących ruch na mouth i pierwszej rampie.

Przy nowych/zmienianych publicznych helperach dodać JSDoc z `@domain world-terrain`, jeśli poprawia to preflight discovery.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

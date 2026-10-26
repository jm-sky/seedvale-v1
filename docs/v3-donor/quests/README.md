# V3 curated quest portfolio (donor)

**Created at:** 2026-10-26  
**Created by:** Cursor (Composer)  
**Status:** Staging for V1 revival analysis / re-curation — **not** a shipping backlog and **not** runtime quest code.

Provenance: V3 `jm-sky/seedvale` @ `199f98e2` (same intake as [../README.md](../README.md)).

## What this is

The **51 keep/rewrite** stories from the V3 V1/V2 quest curation (review 094), plus:

- curation / decision documents (canonical narrative dispositions),
- full linked **v1 progression-plan** markdown where catalog READMEs are summaries,
- full **v2 design** markdown from `legacy/SeedVales/docs/design/quests/` (including stubs G02/G04),
- comparison **definition** TypeScript referenced by `meta.ts` (stage detail when prose is thin),
- merge / retire / defer trail under `dispositions/` for analysis.

Authority: [authority/2026-10-14--094--…](./authority/2026-10-14--094--v1-v2-quest-curation-independent-final-review.md) — **3 keep, 48 rewrite, 4 merge, 5 retire, 1 defer (Q08)**. Delivery framing: [authority/quests--004--…](./authority/quests--004--curated-portfolio-to-playable-quests.md).

## Layout

```text
quests/
  README.md                 # this index
  authority/                # review 094, review 024, quests--004, schema, proposals
  decisions/                # all *curation* decisions + arbitration/water/wolf contracts
  catalog/v1|v2/            # 51 selected folders (README.md + meta.ts)
  dispositions/             # merge/retire/defer catalog folders + _generated
  canon/                    # q0-cast-and-names, q3-preliminary-candidates
  v2-shared/                # QUEST-WORLD and related shared v2 design
  sources/
    v1-progression-plans/   # full v1 plan markdown linked from selected records
    v2-design/              # full v2 design docs from legacy SeedVales
    v1-roadmaps/            # hunters / chronicles / mine-colony / roadmap
    comparison-defs/        # seedvale-v1 + SeedVales-v2 quest definition TS
```

Cast / home context used by many quests: [../world/home-population.md](../world/home-population.md).

## How to read a quest

1. **Disposition** — matrix row in review 094 + matching file in `decisions/`.
2. **Catalog card** — `catalog/v1|v2/<id>/README.md` (+ `meta.ts` for source paths).
3. **Full prose** — if the README is short (~1–2 KB), open the linked file(s) under `sources/v1-progression-plans/` or `sources/v2-design/` (G02/G04 especially).
4. **Stage/code detail** — `sources/comparison-defs/` when documents alone are incomplete (several thin V1 starters; Q14 has no design md).

## Counts

| Bundle | Count |
| --- | --- |
| Selected catalog (keep+rewrite) | 32 v1 + 19 v2 = **51** |
| Disposition folders (merge/retire/defer) | 7 v1 + 3 v2 (+ `_generated`) |
| Curation decisions | 28 |
| V1 progression plans | 30 |
| V2 design docs | 36 |
| Comparison definition files | 30 |

## Explicitly not selected as separate V3 quests

| Disposition | IDs |
| --- | --- |
| merge | cemetery-favour → Q14; zapomniany-cmentarz → Q14; wilki-u-kupca → settlement pack; plaga-szcurow → systemic Rat Plague |
| retire | stare-ruiny, zagubiona-owca, ziola-dla-anny, Q01, Q10 |
| defer | Q08 |

Trail copies live under `dispositions/` so re-curation can see why they left the playable set.

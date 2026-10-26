# Preliminary first playable quest candidates

**Status:** `draft`  
**Created:** 2026-10-15  
**Domain:** quests, exploration  
**Authority:** [quests--004 Q0/Q3](../../plans/quests--004--curated-portfolio-to-playable-quests.md), [review 094](../../reviews/2026-10-14--094--v1-v2-quest-curation-independent-final-review.md), [Q0 cast](q0-cast-and-names.md). This register does not change the 61 accepted dispositions or promise an M7 title.

This is a preliminary shortlist only; M7 selection waits for actual M3–M6 suppliers.

## Supplier score

Score counts **missing shared supplier groups**, not story quality or implementation effort: 0 = supported now; 1 = one milestone group; 2 = two groups; 3 = three or more groups; `L` = a necessary accepted ending depends on M8/M9/M10+ or unresolved authority. M7 dialogue/journal/quest integration is common to every authored row and excluded from the score. The current port ledger has no playable quest engine, NPC household runtime, fauna or item pickup in the game scene. A model, prop or catalogue entry alone is not a working supplier. Scores are a 2026-10-15 planning snapshot and must be recalculated at Q3.

| Candidate / source record | Portfolio role and actor keys | Reusable evidence now | Missing shared suppliers and earliest plausible gate | Score / provisional call |
|---|---|---|---|---|
| **Water for Mark** — V1 `woda-dla-marka`, D-QUEST-24 | Short ordinary errand; `G01` | Mark's reserved data, home well/guard area, waterskin item definition | M4 real guard duty and talk; M5 filled vessel/physical transfer; M7 personal relation, local reputation and report. Never complete on well touch. | **2 — front-runner**, only after water transfer exists |
| **Fox by the Settlement** — V1 `lis-przy-osadzie`, D-QUEST-23 | One animal story; `G01` | Mark identity, prospective home poultry context; animal assets are files only | M4 Mark's actual guard/dialogue presence; M6 one stable fox, threat/death event and normal combat; M7 claim/credit and one physical outcome. `fox_pelt` is optional. | **2 — front-runner** after M6 and D-QUEST-16 review |
| **Kate's road survey** — V1 `sprawdz-szlak`, D-QUEST-36 | Investigation/report with honest, incomplete or false alternatives; `G02` | Kate reserved data; M3 map/cave primitives exist in part | M3 verified road/cave observation at a surveyed site; M4 actual knowledge/conversation; M6 only if reporting a live animal risk; M7 evidence-based branching. | **2–3 — candidate**, choose actual risk after world survey |
| **Night Torches** — V2 `G03`, D-QUEST-12/13 | Strong alternate investigation with three social paths; `G01`, `B02`, `B03` | Torch posts and Bowmans are specified/visual only | M4 17-person cast, guard routine and talk; mutable real torch-post state, Hazel's autonomous action and next-dusk availability; M6 wolf-track evidence for the show path; M7 branch/save/treasury. | **3 — alternate**, scope only after AI and evidence work |
| **Shells for Kate** — V1 `shells-dla-kasi`, D-QUEST-39 | Second short errand/social reward; `G02` | Kate reserved data and a real coast | M3/M5 shell item source, pickup and transfer; M4 Kate routine; persistent house decoration; M8 actual funds and M9 relation calibration for accepted exceptional-shell branch. | **L — later**, do not fake shells, money or decoration |
| **M3-D02 chapel chest** — outside the 61 records | Worthwhile exploration/reward path, **world discovery rather than quest** | Candidate ruin/chest assets and map primitives; D-ROAD-20 requires a chest in M3 acceptance | M3 surveyed ruin, board search area, valid discovery, conserved chest transfer and save/load. No quest engine or quest payout. | **1 — M3 path**, only if M3 approves D02 site/content |

**Provisional coverage:** Water = errand; Fox = animal; Kate's survey or G03 = investigation with alternatives; D02 = exploration reward. No fixed first M7 set is selected. If the survey lacks a credible site, Kate's survey waits. If the torch system/AI is not ready, G03 waits. G08, Q03, Q07, G05, Q06 and Q08 have later shared-system or policy gates; their omission here is not a retirement. Q08 remains deferred. The M3 chapel is not counted as a 62nd imported quest.

## Shortlist-only stale-name and premise audit

| Source | Legacy assumption found | Canonical replacement or gate |
|---|---|---|
| `woda-dla-marka` V1 `quests.ts` | `Marek`; stage completes on `interact_well`; shown five-coin reward | `G01` Mark on actual post duty; filled water transferred; chiefly personal/local social effect, symbolic or zero real coins (D-QUEST-24) |
| `lis-przy-osadzie` V1 `quests.ts` | `Marek`; kill by species `fox`; old fixed 20-coin/reputation values | `G01` Mark; one identified threatening fox and real death event, no second fox/Luke/Q01 prerequisite; rewards recalibrated (D-QUEST-23) |
| `sprawdz-szlak` V1 `quests.ts` | `Kasia`, hard-bound `rockDen` and exact cave report | `G02` Kate; surveyed road-safety evidence, truthful/incomplete/false report; one observation may also inform Peter without duplicating physical events (D-QUEST-36) |
| `G03` V2 `g03.ts` | Fixed day 3–10 offer, **male pronoun tokens for Hazel**, forced `hold`/`snap` of Hazel or Mark, day-based treasury pay and prewritten wolf prints | `B03` Hazel uses she/her; real Bowmans/guard schedule; no NPC lock/teleport or quest-owned wolf track; next dusk when Mark is occupied by Q07; shared treasury/stock and autonomous resolution |
| `shells-dla-kasi` V1 `quests.ts` | `Kasia`; generic gather count and relation +1, no handover or decoration | `G02` Kate; three real transferred shells, exceptional variant and persistent doorstep decoration; shared funds/relations (D-QUEST-39) |
| M3-D02 | Research 012 proposes a chapel ruin and chest; not yet a placed world site | D-ROAD-20 requires one conserved chest on the M3 acceptance route, but site/name/reward remain proposed and need world survey and M3 approval |

The V1/V2 IDs and old catalogue metadata remain historical reference. Later Q4 writes new English lines and stable speaker/line/option IDs; it does not edit imported source scripts or borrow their rewards and timers as current rules.

# Quest Consistency Review: v1 and v2

**Created at:** 2026-10-09  
**Created by:** ChatGPT Luna  
**Reviewer:** GPT-6 (ChatGPT Luna; correction pass based on supplied adversarial findings). Mechanical-conflict pass: Claude Sonnet 5.5 (Cursor cloud agent), static source reading only (see §3 and §7).  
**Reviewed commit:** original review `a27594271a14b9e12e7a31ff7e3ad00cbc074be6`; §8 audited `9796437`; mechanical-conflict pass (§2, §3, §5–§7) rebased on `7ad5e1f67d42783b2e313665d3483f8717069897` (main).

**Status:** Corrected review, second pass. Advisory only; this is not a canonical decision or implementation plan. Nothing was run: every "code" claim below comes from reading the cited source, and every "test" claim from reading a test file. No runtime result is claimed anywhere in this file.

**Scope:** v1 authored quests and generated opportunity families; v2 authored quest catalog, simulation-board quests, cast/world proposal, quest scope metadata and relevant plans. It audits **mechanical** conflicts (same incident, entity, resource, state transition, reward path) between those sources. It is not an exhaustive reconciliation of every generated world state, and v2 quests Q04, Q06, G02 and Q10 were not read at code level (see §6).

**Paths in this file.** `v1/` = `docs/comparison/code/seedvale-v1/src/` (read-only snapshot of SeedVale v1, `src` only, **no tests**). `v2/` = `docs/comparison/code/SeedVales-v2/src/game/` (read-only snapshot of SeedVales v2, whole project including 187 test files). `src/game/...` = this repository's own code. A snapshot is evidence about the old project, never about SeedVale.

## Executive verdict

**Approve with corrections.** The original review's NPC identity section and scope assumptions stay withdrawn; section 8 stays the identity baseline. This pass checked the mechanical claims against source and found that the original "audit-reported" wolf and vision findings were partly wrong and partly understated.

**Addendum (NPC identity):** section 8 is an independent source audit of NPC identity (Grok 4.7, main `9796437`). Section 1 now separates the four SeedVale continuity pins from v2 slot matches. Read section 8 before using section 1 as identity evidence.

Do not maintain v1 and v2 as parallel, unreconciled quest inventories, but do not merge them wholesale. SeedVale's vision and master plan set the direction; v1 is a source of gameplay content and v2 a source of ideas to evaluate. Imported v2 scope documents and proposals are evidence, not SeedVale decisions.

**Confirmed mechanical conflicts (static, see §3 for evidence; none runtime-tested):**

1. **v1 wolf den is one incident with up to five quest definitions** (F-01, high). Authored `wilcza-jama`, `wilki-pod-osada`, `wilki-u-kupca` and the generated `world:wolf-den-pressure:<home>:wolfDen` all resolve on the same den, and nothing suppresses them against each other. One burn event can complete three of them at once.
2. **v1 wolf chain reward and renown stacking** (F-02, high): up to 95 renown from one den plus two high-value swords and a horse, against a 0..100 clamp and a 12-renown guard-sword threshold.
3. **v2 wolf board counts kills by species and radius, not by entity** (F-03, high). A generic `wolves:<settlement>` notice and the starter rung `q-wolves-<home>-start` can both be active and both count the same kill; killing the unique alpha of G07 also advances them.
4. **v1 suppression covers only one case** (F-05, medium): authored-vs-generated livestock at offer time. Den quests, injured-cow vs lost-livestock for the same cow, and anything after acceptance are not covered.
5. **Lifecycle** (F-06, medium): v1 animal bindings are not persisted; wild-bound active quests (`grozny-wilk`) are invalidated on every load and livestock bindings are re-resolved and can drift.
6. **v2 has no landmark or entity claim arbitration** (F-10, medium) while v1 has two (`occupiedLandmarkIds`, cave anchor claims). Q14's `desecrated` ending also reacts to any grave dig near the cemetery, which v1 `mapa-do-skarbu` can perform (F-09, unresolved because the cemetery entities are not shown to be the same).

**Withdrawn or corrected from the earlier text:** "all four v1 wolf quests use `WOLF_DEN_ID`" (three do), the violence-against-people flags on `zaginiona-przesylka` and `dungeon-bandit-treasure` (not supported by their objectives), the shared timber stock claim (the four repair sinks are distinct), the open question about the rat path (now verified), and several wrong names, paths and milestone numbers. Full list in §7.2.

Default decision for every matrix row is **unresolved** until evidence supports a reversible choice. Do not delete v1 records during reconciliation.

## Evidence levels and classification

- **Code:** a claim tied to a specific source path and line range that was read in this pass. The game was not run.
- **Test:** a claim about what a specific test file asserts or does not assert. v1 tests are not in the snapshot, so v1 test coverage is **unknown**, not "absent".
- **Documentation:** directly represented in repository documentation or metadata; imported/proposal status still matters.
- **Hypothesis:** a possible connection requiring source evidence. Always labelled as such.

Verification status for a finding is one of: **static** (read only), **test-covered** (a test asserts it), **needs runtime** (outcome depends on placement, RNG, scheduling or event order that reading cannot settle).

Classify each connection as one of:

- `same_incident_duplicate`: same world event or active problem instance;
- `same_problem_class_separate_incident`: same kind of need, distinct instance;
- `complementary_soft_link`: can share context or consequences without merging;
- `unrelated`: different event or objective;
- `unresolved`: evidence is insufficient.

A shared title, animal species, landmark category, first name, or profession is not proof of identity. A relationship is only `same_incident_duplicate` when a concrete shared entity, resource, state transition or reward path is shown.

## 1. NPC identity and settlement-cast conflict

This section was corrected to follow §8.6. The section 8 tables win over anything here.

### SeedVale continuity pins from `npc--001`

The original review's "NPC identity reconciliation" hypothesis table stays withdrawn. `docs/plans/npc--001--npc-identity-and-generator.md` (`done`) records author-approved compatibility reservations. Quest and dialogue data are meant to cite reservation IDs, not display names. A pin continues a v1 person into SeedVale; it does **not** identify that person with a v2 quest slot (§8.2).

| Reservation ID | v1 identity | SeedVale continuity pin | v2 slot match | Status (§8.2) |
|---|---|---|---|---|
| `mark_hornblower` | Marek Hornblower, guard | Mark Hornblower, guard / Hornblower | slot `mark` | **confirmed** person and slot |
| `kate_hornblower` | Kasia Hornblower, trader, Mark's wife | Kate Hornblower, trader (`spouseOf: 'guard'`) | none | **probable** pin; **unresolved** as a v2 person. **Not** slot `stephen` |
| `ann_woodward` | Anna Leśniewska, farmer | Ann Woodward, farmer | none | **probable** pin. **Not** slot `ralph` |
| `peter_woodward` | Piotr Leśniewski, woodcutter, Ann's husband | Peter Woodward, woodcutter | none | **probable** pin. **Not** slot `miles` |

`Kate` and `Woodward` stay tentative (🟡 in `npc--001`). Kasia is not Stephen Chapman; Piotr is not Miles Hewer; Anna is not Ralph Fieldman (§8.2, §8.4).

Ann, Peter and Kate have no v2 person. The v1 quest jobs hung on Anna's name (sheep, herbs, wolves) are **possible** stand-ins for the v2 slots `molly`, `dora` and `jacob`, and **contradicted** as those people (§8.3). Quest data must therefore bind each quest to one identity target and must not bind a v2 slot to a reserved NPC to simplify a merge. `npc_reservation_id` in the matrix (§2) follows §8.6 item 5: it is set only for `relay-anna-piotr` (the couple's own marriage), for the confirmed guard where a quest is actually the home guard's own business, and left blank otherwise.

### Open conflict: `npc--001` versus `QUEST-WORLD.md`

`QUEST-WORLD.md` is a v2 proposal, not game canon or implementation. Its cast assumes one farmer/reeve household (Ralph Fieldman), one woodcutter household (Miles Hewer) and one trader (Stephen Chapman) in H. `npc--001` requires the reserved Woodward (farmer Ann + woodcutter Peter) and Hornblower (guard Mark + trader Kate) households in the home settlement. Instantiated literally, H would have two farmers, two woodcutters and two traders.

**Recommended default for author decision (Q-012 option a, unchanged):** keep the four pins for identity and household guarantees; treat Ralph, Miles and Stephen as additional people, not as merges into the pins. §8.5.1 adds the unresolved storage question for two-profession marriages before M4 builds homes. Option (b) would require rewriting quest objects, not just names. This is a project-level cast decision; the quest matrix cannot settle it.

Do not quote `QUEST-WORLD.md` as a SeedVale rule. Its casting rule 1 is "The role, not the name, is the key." It says one slot represents one person across packs; its precedence applies to the v2 scenario files aligned to that proposal.

## 2. Reconciliation matrix

Legend and conventions:

- `v2_scope` is **imported v2 metadata only** from the v2 design index (`retained` / `deferred` / `unclassified` / `n/a`). It is not SeedVale scope. `seedvale_scope` is `unclassified` for every row: SeedVale has no quest engine yet and quest implementation is milestone **M7** in the canonical roadmap. Domain curation is prerequisite work, not implementation; the master plan's Phase 1′ sequence was inconsistent and has been aligned to the roadmap. The old “Later milestones” table is explicitly superseded. D-PLAN-11 is `dropped` in `docs/decisions/DECISIONS.md` and is not an accepted SeedVale scope decision.
- `decision` is `unresolved` for every row. `canonical_quest_id` is unassigned for every row and so is omitted from the table; `shared_npc_ids` is omitted because §8 owns identity; `shared_world_entities` is merged into `shared_incident`; `open_questions` live in §6.
- `evidence_level`: `code` / `test` / `doc` / `hyp`. `Finding` points at the §3 entry that holds the evidence, line ranges and correction.
- `landmark_id`: no SeedVale landmark IDs exist for any of these; a value other than `—` is a snapshot identifier or kind, never a SeedVale ID. Nothing in this table is a generated instance from a real seeded world.
- `class` uses the five classifications above.

| Row | source_quest_id (version) | source_kind | v2 candidate and v2_scope | npc_reservation_id | landmark_id | shared_incident | dependency_type | reward_conflicts | vision_constraint | evidence_level | class | Finding / next step |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R-01 | `zagubiona-owca` (v1) | authored | G01 retained | — (§8.3: stand-in, slot `molly`) | — | the one household sheep chosen by `resolveAnimalTarget('sheep')` | suppression at admission | none found | none found | code | `same_incident_duplicate` with R-02 only when both resolve to the same animal; vs G01 `unresolved` (theft story, other animal) | F-05, F-06. Existing guard reused; extend rather than replace |
| R-02 | `world:lost-livestock:<settlementId>:<animalId>` (v1) | generated | G01 retained | — | — | one animal id per quest; unique by construction | `recover_lost_livestock.animalId` claim | one quest per animal | none found | code | `same_incident_duplicate` with R-01 (guarded); `same_problem_class_separate_incident` across different animals | F-05, F-12 |
| R-03 | `world:injured-cow:<settlementId>:<animalId>` (v1) | generated | Q01/Q02 deferred (no link established) | — | — | a cow that is also strayed (hyp: runtime) | **none** against R-02 | none found | none found | code (gap), hyp (co-occurrence) | `unresolved` vs R-02; `unrelated` to Q01/Q02 | F-05 |
| R-04 | `plaga-szcurow` (v1) | authored | not an authored v2 quest | — (Marek is the giver, quest is not his own business) | — (home settlement storage and nest) | settlement rat infestation registry (`exists`, `storageDamaged`, `nestDestroyed`, `aliveRatCount`) | read-only poll of world state | renown +5, relation +2 | none | code | vs v2 board `rats:<buildingId>`: `same_problem_class_separate_incident` (different state model); no generated v1 rat family exists | F-07 |
| R-05 | `guard-evening-duty:<settlementId>:<giverNpcId>` (v1) | generated | G03 retained; Q07 retained | — (giver is `NpcId` of first adult guard; slot `mark` only if that guard is the reserved one) | — (`villageTorches` ids) | torch-post lit state of the home settlement | state predicate (`light_settlement_fires`) vs v2 event counters | coin 3, renown +1 (small) | none | code | vs G03: `same_problem_class_separate_incident` (G03 is a vandal investigation); vs Q07 `posts`: `complementary_soft_link`; torch identity shared is `unresolved` | F-11 |
| R-06 | `world:wolf-den-pressure:<home>:wolfDen` (v1) | generated | G07 retained / v2 wolf board | — | spawner `<home>:wolfDen` | **the home wolf den** | `destroy_spawn_point.spawnerId` | renown +12, relation +2 | combat with animals only | code | `same_incident_duplicate` with R-08, R-09, R-10 | F-01, F-02 |
| R-07 | `grozny-wilk` (v1) | authored | G07 retained | — (§8.3: stand-in, slot `jacob`) | — | one dangerous wolf bound by `resolveAnimalTarget('wolf')` (identity vs den wolves not shown) | `kill_target_animal` bound at activation | Damascus long sword, renown +15 | animal only | code | vs R-08: `unresolved`; vs G07 Greybeard: `unresolved` | F-01, F-02, F-06 |
| R-08 | `wilcza-jama` (v1) | authored | G07 retained | — (stand-in) | den id `WOLF_DEN_ID` alias of any `wolfDen` spawner | home wolf den: all den wolves dead (`clear_wolf_den`) | prerequisite: Anna `trusted` + `grozny-wilk` outcome `reported` | obsidian sword, renown +25 | animal only | code | `same_incident_duplicate` (earlier state transition of the same den) | F-01, F-02 |
| R-09 | `wilki-pod-osada` (v1) | authored | G07 retained | — (stand-in) | den id `WOLF_DEN_ID` | home wolf den destroyed (`destroy_spawn_point`) | **no prerequisites**, no claim | renown +35 | animal only | code | `same_incident_duplicate` with R-06 (same title, same spawner) | F-01, F-02 |
| R-10 | `wilki-u-kupca` (v1, `buildHorseAcquisitionQuest`) | authored | G07 retained | — (Kasia is the giver; the horse and wolves are not her own goods) | den id `WOLF_DEN_ID` | home wolf den destroyed | `destroy_spawn_point`, horse reservation `canReserveHorseReward` | horse, renown +8, relation +2 | animal only | code | `same_incident_duplicate` with R-06, R-09 | F-01, F-02 |
| R-11 | `wolves:<settlementId>` generic and `q-wolves-<home>-start` (v2) | sim-board | n/a | — | settlement radius circle | any wolf kill near the settlement | species and radius counters in `questOnKill` | 60 c vs 80 c plus `leather_jerkin`, rep +courage/renown | animal only | code, test (absence) | `same_incident_duplicate` between the two board quests; vs G07: `unresolved` | F-03 |
| R-12 | G07 Trail of Greybeard (v2) | authored (DSL) | retained | — (slots `jacob`, `mark`; no reservation) | wild anchor 900 m north (`den`) | unique alpha, entity `greybeard`, ending by `dead` slot | entity identity | 30 c treasury (kill), 20 c (drive), courage +10 | animal only | code | vs R-11: `same_incident_duplicate` on a kill by the player; vs v1 wolf chain: `unresolved` | F-03 |
| R-13 | v1 hunter ladder `hunter-profession:<settlementId>:<giverNpcId>:<1..3>` | generated | G07 retained (hunter cast); no hunt-board link in index | — | — | deer and stag harvests, hide and antler stock | `harvest_animals` and `gather_item` by kind vs v2 kill counters | `short_bow` (rung I), `hunting_bow` (rung II) vs v2 starter rung `short_bow` | none | code | `same_problem_class_separate_incident` (harvest vs kill; separate counters) | F-04 |
| R-14 | v2 board `hunt:<settlementId>`, `gather:<settlementId>` and starter rungs | sim-board | n/a | — | settlement radius | game kills near the settlement; herb stock in the pack | kill counters; `settleJob` consumes pack stock | coin plus gear; starter `sling`, `short_bow`, `leather_jerkin` | none | code, test | `same_problem_class_separate_incident` (starter and generic hunt can both be active); vs v1 `ziola-dla-anny` and G04 `complementary_soft_link` via a shared pack stock (hyp) | F-04 |
| R-15 | `sporne-drewno`, `drewno-na-naprawe`, `kamienie-dla-piotra`, `drewno-dla-anny`, `drewno-dla-piotra`, `relay-anna-piotr` (v1) | authored | Q03 retained; G05 deferred | `relay-anna-piotr` only (the couple's marriage) | — | repair sinks: `householdFence`, `residentialFoundation`, `communalFence`, `loggingWagon` (distinct) | `gather_item` consumed by kind into a per-quest sink | carrot seed (Anna follow-up); renown small | none | code | v1 internal: `unrelated` sinks (**shared-stock claim disproved**); vs Q03/G05: `unresolved` (no timber state in SeedVale) | F-13 |
| R-16 | `woda-dla-marka` (v1) | authored | G08 retained; Q08 deferred | — (guard errand, not G08's rumour) | well object (kind) | none established | `interact_well` | none found | none | code, doc | vs G08: `same_problem_class_separate_incident`; vs Q08: `unrelated` (builds a well); well identity `unresolved` | F-14 |
| R-17 | `zaginiona-przesylka` (v1) | authored | G06 retained | — (Kasia's own parcel; §8.3 says contradicted vs `stephen`) | home `rockDen` (bound by `bindExactCaveQuests`) | the home rock cave visit | shared `interact_spawner` event with R-18 | none found | **none**: guard branch hands the parcel over, no violence | code | `complementary_soft_link` with `sprawdz-szlak` and `zwiadowca`; vs G06 `unresolved` | F-08, F-15 |
| R-18 | `zwiadowca`, `sprawdz-szlak` (v1) | authored | — | — | `zwiadowca`: any `rockDen`; `sprawdz-szlak`: home `rockDen` | the home rock cave visit | one `interact_spawner` completes every matching active quest | none found | none | code | `complementary_soft_link` (one state transition, three quests; intended by plan 003) | F-08 |
| R-19 | `zaginiony-ladunek` (v1) | authored | Q09 deferred | — | shipwreck landmark | none with Q09 | — | none | none | code, doc | `unrelated` | none |
| R-20 | `dzik-przy-szlaku` (v1) | authored | Q02 deferred | — (Piotr informant, not his own business) | — | none (boar vs sow with farrow) | prerequisite: renown ≥ 10 and a talk with Peter | none found | none | doc | `unresolved` (not merged on species); plan 070 healing-meadow link stays an open question | none |
| R-21 | `lis-przy-osadzie` (v1) | authored | Q01 deferred | — | — | none (fox vs white hare) | — | none | none | doc | `unrelated` | none |
| R-22 | `zapomniany-cmentarz`, `mapa-do-skarbu` / `skarb-jaskini-niedzwiedzia` (v1); Q14 (v2) | authored | Q14 **unclassified** | — (Ruth slot has no full name; not Kasia) | v1 `interact_landmark` of resolved kind `cemetery`; v1 map grave spot `<cemetery.id>:<index>`; v2 `cemetery` anchor | cemetery graves (tidy vs dig) | v2 `tidy` / `dig` counters and ending `desecrated` vs v1 `recover_hidden_find` spot | v2 renown/village purse; v1 map treasure | none | code | `unresolved` (entity identity not shown); `desecrated` conflict is hypothesis across versions | F-09 |
| R-23 | `stare-ruiny`, `samotna-wieza`, `mapa-do-skarbu` (v1); Q05, Q11, Q12, Q13 (v2) | authored | Q05/Q11/Q12 retained; Q13 deferred | — | v1 `occupiedLandmarkIds`; v2 anchors by slot | landmarks and containers | v1 claim arbitration; v2 none | not read | none | code (mechanism), hyp (shared entity) | `unresolved` | F-10 |
| R-24 | `rpg:old-place-secret`, `rpg:suspicious-transport`, `rpg:settlement-agreement` (v1) | generated | n/a | — | caves via `resolveCaveAdventureContentPolicy`; landmarks via `occupiedLandmarkIds` | landmark and cave anchors | claim arbitration at composition | not enumerated | not read for every branch | code (mechanism) | `unresolved` (instances not enumerated) | F-10, F-12 |
| R-25 | `dungeon-bandit-treasure` (v1) | authored module | — | — (givers chosen at runtime) | cave id plus `world-container:<prefix>:<anchorId>` | a cave anchor claim | `anchor_already_claimed` arbitration | marked valuable, ledger; renown +1..+4 | **none**: loot, own and decide; no violence required | code, doc | `unresolved` vs other cave quests (arbitration exists) | F-10, F-15 |
| R-26 | `slad-przy-monolicie`, `shells-dla-kasi`, `hunters-brotherhood-*` and other v1 modules (lost-treasure chronicles, old bones cave, lost hunter cave) | authored / modules | n/a | `relay-anna-piotr` is in R-15; others blank | varies | not audited | not audited | not audited | not audited | hyp | `unresolved` (inventory required) | §6 |
| R-27 | v2 G02, Q04, Q06, Q10 | authored (DSL code exists for G02, Q04, Q06; Q10 catalog only, not built) | G02 and Q06 retained; Q04 deferred (implemented); Q10 deferred (not built) | — | — | not audited | not audited | not audited | not audited | hyp | `unresolved` | §6 |

### Matrix schema

Use one row per **source definition or family**, plus per-instance rows where IDs depend on settlement, NPC, animal or spawner. Required fields: `source_quest_id`, `source_version`, `source_kind` (`authored` / `generated` / `sim-board`), `canonical_quest_id`, `decision` (`keep` / `merge` / `split` / `retire` / `unresolved`), `v2_scope` (`retained` / `deferred` / `unclassified` / `not-applicable`), `seedvale_scope`, `npc_reservation_id`, `shared_npc_ids`, `landmark_id`, `shared_world_entities`, `shared_incident`, `dependency_type`, `reward_conflicts`, `vision_constraint`, `evidence_level` (`code` / `test` / `documentation` / `hypothesis`), `evidence`, `open_questions`.

Default `decision=unresolved`. Do not default to `keep` merely because a candidate is deferred or no conflict has been found. Keep v2 `v2_scope` and `seedvale_scope` as separate fields: they must never be merged into one "scope" value.

## 3. Mechanical findings and existing mechanisms

Every finding is **static** unless it says otherwise. No runtime verification was done. A finding is an observation about the snapshots; the SeedVale repository has no quest engine to run it against. "Smallest safe correction" always reuses an existing mechanism named in the evidence and keeps the v1 records.

### F-01. One wolf den, up to five quest definitions, no mutual suppression

- **Severity:** High. **Class:** `same_incident_duplicate` (R-06, R-08, R-09, R-10); `unresolved` for R-07 (`grozny-wilk`).
- **Quests and kind:** authored `wilcza-jama`, `wilki-pod-osada`, `wilki-u-kupca`; generated `world:wolf-den-pressure:<home>:wolfDen`; authored `grozny-wilk` (not shown to be a den wolf).
- **Evidence (code, v1):**
  - `v1/quests/quests.ts:2134–2169` `wilcza-jama` objective `clear_wolf_den` with `denId: WOLF_DEN_ID` (line 2142); `:2170–2202` `wilki-pod-osada` `destroy_spawn_point` with `spawnerId: WOLF_DEN_ID` (line 2179), **no `availability` block**; `:2778–2815` `wilki-u-kupca` (`buildHorseAcquisitionQuest`) `destroy_spawn_point` with `WOLF_DEN_ID` (line 2788), no prerequisites. `grozny-wilk` (`:2099–2133`) uses `kill_target_animal` kind `wolf`, `dangerous: true`, and does not reference `WOLF_DEN_ID`.
  - `v1/quests/opportunities/worldQuestMaterialization.ts:75–116` generated pressure quest also uses `destroy_spawn_point` with a real `spawnerId`. `v1/quests/opportunities/settlementQuestOpportunities.ts:37–44` resolves it to `${settlementId}:wolfDen`.
  - `v1/fauna/wolfDenScenario.ts:48–51` `matchesQuestSpawnPointId`: when the quest id is `WOLF_DEN_ID` it matches **any** `wolfDen` spawner; `:53–60` `isQuestSpawnPointPermanentlyDestroyed` takes the first spawner for which that returns true. `v1/fauna/AnimalSpawner.ts:21–26` documents the single den per settlement.
  - `v1/quests/QuestManager.ts:1185–1198` `meetsAvailability`: checks horse reservation, world-source status, lost livestock, injured cow, the livestock claim guards and prerequisites. It has **no den claim**. A repository-wide search of the v1 snapshot finds no reference to `grozny-wilk`, `wilcza-jama` or `wilki-pod-osada` outside `quests.ts` (and item catalog notes), so no composition-time exclusion exists either.
  - `v1/quests/QuestManager.ts:1584–1594` `pollDestroySpawnPointObjectives` completes **every** active quest whose unfinished slot is a `destroy_spawn_point` for a destroyed spawner, in one loop.
  - `v1/app/gameLoop.ts:922–931` reports `wolf_den_cleared` with `WOLF_DEN_ID` to `onInteractObjective`, which (`QuestManager.ts:3294–3330`) loops over all definitions and completes every matching slot.
- **Failure mode and impact:** the player burns the home den once and every active wolf-den quest completes in the same poll; offers for the same incident appear side by side (authored `wilki-pod-osada` and generated pressure share the title "Wilki pod osadą"). Generated and authored versions use different givers (generated prefers a hunter, `worldQuestMaterialization.ts:64–68`; authored uses Anna), so the duplicate is visible as two NPCs asking for the same thing. Offer slots do not dedupe: `MAX_ORDINARY_ACTIVE_GIVER_QUESTS` (`QuestManager.ts:583`, `:1345`) counts active quests per giver only.
- **Status:** static; test coverage unknown (v1 tests not in snapshot). Runtime needed for which of these are simultaneously offered in a real seed.
- **Smallest safe correction (do not delete records):** generalise the existing claim check (`isAnimalClaimedByOtherQuest`, `QuestManager.ts:1206–1233`) so that `destroy_spawn_point` and `clear_wolf_den` objectives, resolved through `matchesQuestSpawnPointId`, count as a claim on that spawner; call it from `meetsAvailability` like the livestock guard. Then decide per quest whether authored `wilki-pod-osada` is retired in favour of the generated one, or becomes a story prerequisite (`wilcza-jama` already is one). That decision is a plan item.
- **Identity note (§8.5.5 unchanged):** whether `grozny-wilk`'s wolf, a den wolf or G07's Greybeard is the same animal is **unresolved**.

### F-02. Reward and renown stacking on the wolf chain

- **Severity:** High. **Class:** reward path of F-01.
- **Evidence (code, v1):** `quests.ts` outcomes: `grozny-wilk` `damascus_long_sword` and `renown: 15` (`:2099–2133`); `wilcza-jama` `obsidian_sword` and `renown: 25` (`:2134–2169`); `wilki-pod-osada` `renown: 35` (`:2170–2202`); `wilki-u-kupca` horse and `renown: 8` (`:2778–2815`); generated pressure `renown: 12` (`worldQuestMaterialization.ts:75–116`). `v1/reputation/ReputationManager.ts:117–122` `changeRenown` clamps settlement renown to 0..100. `v1/quests/guardRewards.ts:15–16` sets `GUARD_SWORD_RENOWN_MIN = 12`. SeedVale `src/game/data/items/weapons.ts` lines 148 and 154 (and 130 for `long_sword`) price `damascus_longsword` at 1500 and `obsidian_sword` at 760 against `long_sword` 200 (v1 `items/tradeCatalog.ts:220–221` priced them 240 and 320: a price rework, not evidence about the quests).
- **Failure mode and impact:** one den can yield up to 95 settlement renown (15 + 25 + 35 + 12 + 8), which is more than the clamp absorbs, and `grozny-wilk` alone clears the 12-renown guard-sword gate. Two top-tier swords come from one early chain. Whether that is intended is an economy decision under SeedVale's own prices; the `QUEST-WORLD` calibration is a proposal, not canon.
- **Status:** static arithmetic over declared values; whether a player can actually reach all five depends on F-01 and runtime.
- **Smallest safe correction:** resolve F-01 first (fewer definitions on one incident), then cap through the existing outcome tables rather than a new system. Do not change values in this review.

### F-03. v2 wolf board counts by species and radius; two board quests and the unique alpha overlap

- **Severity:** High. **Class:** `same_incident_duplicate` (R-11 with itself, R-11 with R-12 on a player kill).
- **Quests and kind:** sim-board `q-wolves-<settlementId>-<day>` (generic) and `q-wolves-<home>-start` (starter rung); authored G07.
- **Evidence (code, v2):**
  - `v2/sim/quests.ts:26` `questKey` is `${kind}:${settlementId}` for both wolf quests. `:104–126` the generic posting is blocked only when the latest quest under that key is available, active or recent (`:77`).
  - `v2/sim/boardJobs.ts:127–134` the wolf rung posts when `rung(huntStartId(home))` is done and `rung(wolfStartId(home))` does not exist. It does **not** consult `latest.get('wolves:<home>')`. So a generic notice can be active when the rung posts.
  - `v2/sim/quests.ts:277–291` `questOnKill`: every active `wolves` quest with a wolf kill inside `settlement radius + (isStarterRung ? 2200 : 900)` increments `kills` (`:286–289`). No variant, entity or den filter. `v2/sim/boardJobs.ts:40` `WOLF_RUNG_RADIUS_M = 2200`.
  - `v2/sim/combat.ts:205–230` `killAnimal` calls `questOnKill(sim, species, x, z, denId)` only for a player killer.
  - `v2/data/quests/g07.ts:10,25` Greybeard is `species: 'wolf', variant: 'alpha'` at a wild anchor 900 m north; its `killed` rule (`:98`) fires on `{ k: 'dead', slot: 'greybeard' }`, i.e. on entity identity. Its `slay` effects (`jacobKills`, `poisonWorks`) call `killAnimal(sim, a)` with **no killer** (`v2/sim/questCore.ts:1018–1022`), so `killAnimal` does not reach `questOnKill` for them; `drive` does not kill.
  - Tests: `v2/sim/boardJobs.test.ts:93–134` covers the starter ladder in sequence; `v2/sim/questBoard.test.ts` has four wolf references and no case with a generic and a starter wolf notice active together, and none with a unique wolf. `v2/sim/questG07.test.ts:65` sets `wolf.vitals.dead = true` directly instead of calling `killAnimal` with a player killer, so the board counter is never exercised alongside G07.
- **Failure mode and impact:** while both wolf notices are active, one player wolf kill inside both windows advances both; if that wolf is Greybeard, killed by the player after G07 reached stage 1 (the `killed` rule needs `stageGte(1)` and no poison or drive flag), G07 also ends with `kill`. That is up to three payouts for one animal (60 c, 80 c plus `leather_jerkin`, 30 c from the treasury) and stacked reputation. Greybeard is placed by `wildPoint` 900 m (plus 0–150 m search offset) from the home settlement centre (`v2/sim/questCore.ts:347–359`), which is inside the starter rung's `radius + 2200` window for any radius; for the generic notice it is inside `radius + 900` only if the settlement radius exceeds that offset. G07 describes the wolf as circling the village, so the actual kill position is a **runtime** question.
- **Status:** static; absence of tests confirmed by reading; placement needs runtime.
- **Smallest safe correction:** key the starter rung against the generic notice (the existing `blocks`/`latest` idiom at `quests.ts:77`) so only one `wolves:<home>` quest is open, and exclude unique named creatures from the board counters by reusing the creature `tag` the engine already stores (`g07.ts:25`, `tag: 'greybeard'`). Add a test that calls `killAnimal`, not `vitals.dead = true`.

### F-04. Hunt and gather board jobs: starter plus generic overlap, and duplicated gear across v1 and v2 ladders

- **Severity:** Medium. **Class:** `same_problem_class_separate_incident`.
- **Evidence (code, v2 and v1):** `v2/sim/boardJobs.ts:120–126` the hunt rung is also not gated on `latest.get('hunt:<home>')`, so a starter hunt and a generic hunt can both be active. `jobOnKill` (`:186–190`) increments **every** active `hunt` quest of the settlement for any `HUNT_SPECIES` kill within `radius + 1800 + 600`. The starter rung pays `short_bow` (`firstHuntJob`, `:68–78`; `AMMO_WITH_WEAPON` adds arrows), and v1 hunter ladder rung I (`v1/quests/opportunities/hunterProfessionQuests.ts:85–106`) pays `short_bow` too, rung II `hunting_bow` (`:133–154`). v1 rungs use `harvest_animals` and `gather_item` (hide, antler), which are different events from v2 kills.
- **Failure mode and impact:** two sources hand out the same starter bow if both systems are merged; one kill can progress two active hunt notices. Items are plain stacks, not ownership instances, so there is no instance-level conflict. Pack stock is shared only at turn-in: `v1/quests/QuestManager.ts:3075–3099` and v2 `settleJob` both consume the stack when the player hands in, so a single stack can satisfy only one quest, which is correct and not a conflict.
- **Status:** static. **Correction:** reuse the `latest`/`blocks` idiom for the rung posting, and decide in the plan which of the two ladders owns `short_bow`.

### F-05. The existing v1 suppression is real but narrow

- **Severity:** Medium. **Class:** the mechanism behind R-01, R-02, R-03.
- **Evidence (code, v1):** `QuestManager.ts:1185–1198` `meetsAvailability` calls `isAnimalClaimedByOtherQuest` (`:1206–1233`) for generated lost-livestock ids and `isAuthoredLivestockFindBlockedByClaimedTarget` (`:1237–1248`) for authored `find_animal` on livestock. Verified limits:
  1. It runs for `not_offered` admission (`eligibleNotOfferedCandidates`, `:1427–1433`). The only other caller is the public `isQuestAvailable` (`:1303–1307`), which nothing in the v1 snapshot calls, so an already offered or active quest is not re-checked.
  2. It looks only at objectives of type `recover_lost_livestock`, `find_animal` and `kill_target_animal` in other quests that are `offered`, `active` or `ready_to_report` (`:1206–1233`). `treat_animal` and `kill_bound_animal` (the injured-cow objectives, `worldQuestMaterialization.ts:219–222`) are not covered.
  3. `collectLostLivestockOpportunities` (`settlementQuestOpportunities.ts:148–163`) emits an opportunity for **every** household livestock identity including cows, and `collectInjuredCowOpportunities` (`:211–230`) for every injured household cow; the two are gated live by separate snapshots (`QuestManager.ts:1189–1192`). A cow that is both strayed and injured would satisfy both gates, and the guard does not link them. Whether a cow can be in both states is a **runtime** question.
  4. The prediction in `isAuthoredLivestockFindBlockedByClaimedTarget` calls `resolveAnimalTarget(kind)`, the same lookup that binds the target later (`:2018–2032`); the two can diverge if the livestock set changes between them.
  5. Wolf dens are not covered at all (F-01).
- **Corrected claim:** the earlier text called this a pattern to "reuse". It is a pattern to **extend**, with the limits above.
- **Status:** static; unknown tests. **Correction:** generalise the claim function by objective type and entity key (animal id, spawner id), as in F-01; do not add a parallel mechanism.

### F-06. Lifecycle: animal bindings are not persisted

- **Severity:** Medium. **Class:** lifecycle.
- **Evidence (code, v1):** `QuestManager.ts:648–656` `animalTargets` is a runtime map. On restore (`:755–778`), an active quest with a wild `kill_target_animal`/`find_animal` slot (any kind outside `LIVESTOCK_KINDS`) is set to `invalidated` and skipped; a livestock slot is rebound through `bindAnimalTargetIfNeeded` (`:2018–2032`), which picks the resolver's current animal. `requiresGeneratedOpportunityRetention` (`v1/quests/generatedOpportunityRetention.ts:17–29`) keeps generated quest ids only when state, stage, outcome, progress, suppression, journal, knowledge, cooldowns or observation exist; pristine `not_offered` rows are not retained.
- **Failure mode and impact:** an active `grozny-wilk` is invalidated on every save and load. An active authored `zagubiona-owca` can end up bound to a different sheep after load, so the claim in F-05 can point at a different animal than before the save. Generated lost-livestock quests are safe because the `animalId` is in the objective, not in the binding.
- **Status:** static. What the player sees for `invalidated` and whether the quest is re-offerable were not checked; needs runtime.
- **Correction:** persist the binding (`animalId` per key) with the quest state, additive and versioned (D-ARCH-3), instead of re-resolving.

### F-07. `plaga-szcurow` uses authoritative world state, with no offer gate and an instant-complete path

- **Severity:** Medium. **Class:** R-04.
- **Evidence (code, v1):** `v1/quests/quests.ts:2496–2535` (title "Plaga szczurów", id `plaga-szcurow`; the original review used the wrong id `plaga-szczurow`): one stage with objective `resolve_storage_rat_infestation`, outcome `infestation_cleared`, renown +5. `v1/quests/settlementRatInfestation.ts:11–32` `isSettlementRatInfestationResolved` is `exists && !storageDamaged && nestDestroyed && aliveRatCount <= 1` over a snapshot. `QuestManager.ts:368–370` (the lookup type exposes only `getSnapshot`), `:1571–1583` `pollSettlementRatInfestationObjectives` and `:1946–1954` `maybeAdvanceResolvedStorageRatInfestation` read it via `settlementRatInfestation.getSnapshot(def.settlementId)`; `meetsAvailability` (`:1185–1198`) has **no** rat check. State is owned by `v1/settlement/ratInfestation.ts` (registry, `SEEDED_RAT_INFESTATION`, `shouldSeedAuthoredHomeInfestation`); the quest never writes to it.
- **Verified:** the quest reads world state and has no write path, so it cannot create a conflicting infestation record. There is no generated v1 rat family (the generated list in `docs/quests/catalog/v1/_generated/README.md` has none), so there is no duplicate offer against a generated rat quest.
- **Failure mode:** (a) offered even if the infestation is already resolved; accepting then completes immediately through `maybeAdvanceResolvedStorageRatInfestation` (free +5 renown, +2 relation); (b) `exists: false` keeps the objective open and the reminder line says the problem is still there. Both are by-design edge cases rather than defects, but they matter if v2's per-building `rats:<buildingId>` board quest (`v2/sim/quests.ts:62–100`, completion by nest-tagged rats or kills within 80 m of the building, `:281–284`) is merged: two models of the same problem would need one owner.
- **Status:** static. Whether the game seeds an infestation for every home settlement was not run.
- **Correction:** if the v2 board is adopted, make the settlement-level registry the single owner and derive the per-building notice from it; add an availability check so a resolved infestation is not offered.

### F-08. One rock-cave interaction completes three v1 quests

- **Severity:** Low. **Class:** `complementary_soft_link` (R-17, R-18).
- **Evidence (code, v1):** `quests.ts:1843` (`zwiadowca`), `:2049` (`sprawdz-szlak`) and `:2212` (`zaginiona-przesylka`, first stage) all use `interact_spawner` with `spawnerType: 'rockDen'`. `CAVE_BOUND_QUEST_IDS` (`:2823`) and `bindExactCaveQuests` (`:2862–2882`) bind the latter two to the exact home den; `zwiadowca` stays unbound and matches any `rockDen` (`QuestManager.ts:608–611`, `:3412–3430`). `onInteractObjective` (`:3294–3330`) completes each active matching definition.
- **Impact:** one visit completes up to three stages. Plan 003 says `sprawdz-szlak` deliberately reuses `zwiadowca`'s cave interaction, so this is intended reuse, not a duplicate. There is no item in the cave (the first stage of `zaginiona-przesylka` is a visit, the parcel is not an item instance), so there is no ownership conflict. The risk is only if rewards expect separate visits.
- **Status:** static. **Correction:** none needed; record as a known shared transition.

### F-09. Cemetery: tidy versus dig (cross-version, unresolved)

- **Severity:** Medium (hypothesis across versions). **Class:** `unresolved`.
- **Evidence (code):** v2 `data/quests/q14.ts:52–53`: counter `tidied` counts `tidy` events within 60 m of the cemetery anchor and requires `flag('accepted')`; counter `dug` counts `dig` events with `grave: true` within the same radius and has **no `when` guard**. Rule `desecrated` (`:57`) ends the quest on `dug >= 1`. `v2/sim/questEngine.ts:44` `live()` includes `offered`, so events reach an offered quest; the rule's default phase was not checked. v1 `world/locations/treasureMapBearCave.ts:105–120` builds grave dig spots `<cemetery.id>:<index>` from `cemeteryGraveLayout`; `quests.ts:2862–2900` binds `mapa-do-skarbu` to a cave **or** a cemetery per seed; `zapomniany-cmentarz` (`quests.ts:2629–2660`) uses `interact_landmark` for the resolved landmark kind `cemetery`.
- **Why unresolved:** v1 distinguishes a settlement cemetery prop (`cemetery.id`) from the procedural landmark kind `cemetery`; the snapshots do not show them to be one entity, and SeedVale has no `dig` event or cemetery state. If they were the same, a v1 treasure dig in a cemetery would fire Q14's `desecrated` ending. That is a design conflict, not an observed behaviour.
- **Correction (when M7 reaches quest implementation):** give the cemetery a single state owner; scope the `dug` counter to Q14's accepted phase or exclude the quest-authorised dig spot.

### F-10. Landmark and entity claims: v1 has two mechanisms, v2 has none

- **Severity:** Medium. **Class:** mechanism gap behind R-23, R-24, R-25.
- **Evidence (code):** v1 `app/createApp.ts:1426–1449` builds `occupiedLandmarkIds` from authored `interact_landmark` objectives and world-knowledge binds and passes it to the RPG matrices (`quests/opportunities/rpgQuestMatrices.ts:53,127–129`); `v1/world/caves/caveAdventureContentPolicy.ts:90–160` arbitrates cave profile and anchor claims with reasons `cave_not_found`, `profile_conflict`, `anchor_not_found`, `anchor_already_claimed`, and `dungeonBanditTreasure.ts:79,205–230` takes a reservation key through it. In v2, the quest engine's only exclusive-resource mechanism found is the NPC `hold` (`v2/sim/questHold.ts`, `questCore.ts:649–701`); anchors resolve by `resolveAnchor` (`questCore.ts:412` for `wild`), memoised, with no claim. No landmark or container claim was found by search of `sim/quest*.ts`.
- **Impact:** if v2 quests Q05, Q11, Q12, Q13, Q14 are merged into the v1 world, they would place content on anchors that v1's arbitration does not know about, while v1's own claims would not stop them. Which of those anchors would collide with v1 landmarks was not checked.
- **Status:** static. **Correction:** register v2 anchors through the existing `occupiedLandmarkIds` / cave claim path before any merge; do not add a third system.

### F-11. Torch posts: state predicate versus event counters

- **Severity:** Low–Medium. **Class:** R-05, `same_problem_class_separate_incident` and `complementary_soft_link`.
- **Evidence (code):** v1 `guardProfessionQuests.ts:62–125` objective `light_settlement_fires` (selected torches plus campfire), evaluated from the live `settlementLight` snapshot (`QuestManager.ts:1837–1842`); while it is active, `activeSettlementLightDuty` (`:1851–1872`) suppresses dusk auto-lighting, and if the snapshot becomes `unavailable` the quest is `invalidated` (`:1878–1893`). The offer needs `evening_offer_window` for the giver (`guardEveningOfferWindow.ts:27–47`). v2 G03 uses the `torchpost` anchor of slot `hazel` and reacts to `douse`/`light` events; Q07 counter `posts` (`q07.ts:193–195`) counts `light` events on home torch posts between 16:00 and 24:00, `distinct`, and also a `visit` of an already-lit post.
- **Impact:** a state predicate that suppresses auto-lighting is not compatible with event counters that need the player to light posts, if both are active in the same dusk window; which posts v1's `pickEveningDutyTorches` chooses relative to the posts G03/Q07 use is **unresolved**. Rewards are small (v1: 3 coins, renown 1) so there is no reward conflict. The giver is the first adult guard in v1 and slot `mark` in v2; §8.2 keeps these separate, so no identity claim is made.
- **Status:** static; interplay needs runtime (hour, hold and suppression timing).
- **Correction:** none yet; decide which system owns torch state before M5 reads the torch-state in SeedVale, which does not exist yet.

### F-12. Generated-offer cap does not apply to world-driven opportunities

- **Severity:** Low–Medium. **Class:** lifecycle/offer volume.
- **Evidence (code, v1):** `settlementQuestSelection.ts:9` sets `SETTLEMENT_QUEST_OPPORTUNITY_LIMIT = 2`, and `take(opportunity, opportunity.kind !== 'rpg-matrix')` (`:68–75`, called in the loop after it) passes `ignoreLimit` for every non-RPG opportunity, so wolf-den, lost-livestock and injured-cow opportunities bypass the limit. They still occupy slots, which crowds out RPG matrices (priority `0` against `1`, `:17–19`). Per household livestock a lost-livestock candidate exists (F-05 item 3), live-gated per animal.
- **Impact:** with several strays at once the settlement can offer many lost-livestock quests together, while RPG matrices disappear. This is by design ("world problems outrank stories") but "limit 2" is not a cap on offers. Needs runtime for real counts.
- **Correction:** none; record the behaviour so a SeedVale port does not assume the cap.

### F-13. Disproved: shared timber stock and repair sinks in v1

- **Class:** disproved claim (R-15).
- **Evidence (code, v1):** `v1/quests/authoredRepairDeliveries.ts:17–22` maps `drewno-na-naprawe` → `householdFence`, `kamienie-dla-piotra` → `residentialFoundation`, `drewno-dla-anny` → `communalFence` (settlement economy), `drewno-dla-piotra` → `loggingWagon`. Four quests, four distinct sinks. `sporne-drewno` (`quests.ts:2290`) has no material delivery; it is an arbitration dialogue whose outcome gates the two follow-ups. `selectGatherTurnIn` (`QuestManager.ts:3075–3099`) removes items only after preflighting the sink and rolls back on failure.
- **Result:** the earlier "shared stock/consequences soft link" is narrowed: shared inventory by item kind only, no shared structure. Q03 and G05 remain `unresolved` because SeedVale has no timber or structure state to compare.

### F-14. Wells, wrecks, towers, ruins: no shared entity established

- **Class:** `unresolved` (R-16, R-19, R-23).
- **Evidence (code, v1; code, v2):** v1 `woda-dla-marka` uses `interact_well` (kind-level). v2 Q08 counts `built` wells and troughs near anchors (`q08.ts:82–85`); G08 is a rumour about an existing well. No snapshot shows a shared well id. `zaginiony-ladunek` is a wreck inspection with no v2 counterpart. Towers, ruins and caves are covered by F-10.
- **Rule kept:** do not merge on shared category.

### F-15. Vision constraint ("quests never require violence against people")

- **Verified (code, v1):** `zaginiona-przesylka` (`quests.ts:2203–2287`): stage 0 a rock-cave visit, stage 1 `talk_to_npc_choice` with outcomes `returned_sealed` or `turned_over_to_guard` (hand the items to Marek), with relation and integrity conditions. No combat objective. `dungeon-bandit-treasure` (`dungeonBanditTreasure.ts:375–460`): talk, `loot_world_container` plus `own_item_instance`, then `await_quest_outcome` with three non-violent choices (return, give evidence, keep). The guard and claimant are runtime-selected people, not combatants. VISION.md (lines 61–62) permits bandit settings and requires non-lethal handling.
- **Result:** the earlier flags are **not supported** and are withdrawn (§7.2). For v2, G03 and G07 involve animals and a child's behaviour only; G07's `jacobShoots` effect is an NPC hunting a wolf. Q04, Q06, G02, Q10 and the Q13/Q12 branches were not read, so the constraint is **unresolved** for them.

## 4. Project authority and scope

- `docs/decisions/DECISIONS.md` marks **D-PLAN-11 as `dropped`**: a v2 process/schedule decision, not a SeedVale scope decision and not accepted canon. D-QUEST-1..7 are `inherited-v2`.
- The retained/deferred table in the imported v2 `designs-README.md` explains the source project's choices; it is not authoritative for SeedVale. Q14 is missing from that table and stays `unclassified` until a project decision.
- "20 of 21 authored designs implemented" applies to the external v2 snapshot. The v2 catalog lists 22 designs (G01–G08, Q01–Q14); `v2/data/quests/` has code for G01–G08 and Q01–Q09, Q11–Q14, so Q10 has a catalog entry and no code in the snapshot. None of this is implementation in this repository: `src/game/sim` has no quest engine.
- SeedVale scope follows `docs/vision/VISION.md` and the canonical `docs/roadmap/ROADMAP.md`: quest implementation belongs to **M7**; **M6** owns combat and fauna. M9 covers NPC social systems and transport; M10+ covers construction and leadership. v1 content stays a source, v2 designs are candidates to evaluate. Domain curation is prerequisite work and should follow the same dependency order: combat/fauna before quests, because the roadmap explicitly says v1 quests lean on animals and caves. The master plan's Phase 1′ sequence was corrected to match this; its “Later milestones” table was already marked superseded.
- `QUEST-WORLD.md` is a proposal and does not supersede `npc--001` for SeedVale's reserved characters without an explicit project decision.
- G02, G04 and Q14 lack full design documents in the imported catalog (Q14 has metadata derived from code). That is an evidence limit, not a verdict on the quest.

## 5. Vision and narrative constraints

Check every branch, not titles. Result of this pass (details in F-15): no required violence against people was found in `zaginiona-przesylka` or `dungeon-bandit-treasure`; combat in the audited quests is against animals, as VISION.md states. Remaining branches not read stay `unresolved` in the matrix (`vision_constraint` column). A branch that is optional must still be distinguished from a required path when later quests are read.

## 6. Remaining evidence gaps

The following stay unresolved and must not be promoted to facts:

1. Runtime behaviour of everything in §3. Nothing in this review was executed, and the v1 snapshot has no tests, so v1 test coverage is unknown.
2. Whether Greybeard's den lies inside the `radius + 900` window of F-03 (placement by `wildPoint`), and whether `grozny-wilk`'s bound wolf is a den wolf (F-01).
3. Whether a household cow can be strayed and injured at once (F-05), and what the player sees for `invalidated` quests (F-06).
4. Ruth's full identity for Q14, Q14's scope, and whether the settlement cemetery prop and the procedural landmark kind `cemetery` are one entity (F-09).
5. Whether `Kate` and the Woodward surname are final; `npc--001` marks them tentative.
6. Reward and economy intent for the high-value swords and renown (F-02); `QUEST-WORLD` calibration is a proposal.
7. All generated IDs in a real seeded world; the imported README states generated outputs were not enumerated against a running world. Per-instance rows are therefore not built.
8. v2 Q04, Q06, G02, Q10 (and parts of Q05, Q11, Q12, Q13) were not read at code level; Q10 has no code in the snapshot. v1 `stare-ruiny`, `samotna-wieza`, lost-treasure chronicles, old bones cave, lost hunter cave and hunters' brotherhood modules were not audited beyond their arbitration path.
9. Torch-post identity shared between v1 `pickEveningDutyTorches` and v2 `torchpost` anchors (F-11).
10. The current vision/master-plan wording must be rechecked at the commit used for any implementation plan.

## 7. Formal review record, corrections and next steps

### 7.1 Record

The earlier filename used review number **011**, which is already occupied by the world-lakes review, so this report is **024**. `docs/reviews/LOG.md` has a row for each pass: the correction pass, the §8 identity addendum and this mechanical-conflict pass. This pass changed the document only; no gameplay, no v1 records and no section 8 text.

### 7.2 Claims corrected or withdrawn in this pass

| Earlier claim | Status | Evidence |
|---|---|---|
| "Verify the vision against `docs/vision/game-vision.md`" | Corrected: path is `docs/vision/VISION.md` | file list |
| Quest milestone was stated as M5, with M7+ described as transport and similar | Corrected: canonical roadmap assigns combat/fauna to **M6**, quests to **M7**, social/transport to **M9**, and construction/leadership to **M10+**. Phase 1′ curation order is now aligned; the old “Later milestones” table is superseded | `docs/roadmap/ROADMAP.md`; `docs/plans/project--001--master-plan.md` |
| Rat quest id `plaga-szczurow` | Corrected: `plaga-szcurow` | `v1/quests/quests.ts:2496` |
| "all four v1 wolf quests use `WOLF_DEN_ID`" | Corrected: three do (`wilcza-jama`, `wilki-pod-osada`, `wilki-u-kupca`); `grozny-wilk` binds a wolf by kind | F-01 |
| "inspect whether `plaga-szczurow` reads or writes the rat registry" | Verified: reads, never writes; no offer gate | F-07 |
| "v1 suppression around lines 1203–1240 is a pattern to reuse" | Narrowed: lines 1185–1248, livestock claims only, admission only | F-05 |
| "v2 `questOnKill` around 281–290 counts any wolf, alpha included" | Confirmed and sharpened: lines 277–291, plus the starter-rung radius 2200 and the coexistence of two wolf quests | F-03 |
| `zaginiona-przesylka` guard branch and `dungeon-bandit-treasure` may require violence against people | **Withdrawn**: neither objective list contains combat | F-15 |
| Shared timber stock / consequences between v1 wood quests | **Disproved at the sink level**: four distinct repair sinks | F-13 |
| "Resolved by reservation" in §1 | Replaced by the two-column pin / slot table | §1, §8.6 |
| Matrix assumed no row for generated families, rats, hunt/gather board jobs and the shared rock cave | Added R-02, R-03, R-04, R-05, R-06, R-11, R-13, R-14, R-18, R-24, R-25 | §2 |
| "Q14 and `mapa-do-skarbu` share a landmark" | Narrowed to `unresolved`: entity identity not shown | F-09 |

### 7.3 Next steps

1. Resolve Q-012's default (option a) for the reserved households; keep reservation IDs stable. §8.5.1 needs a rule for two-profession marriages before M4 builds the homes.
2. Plan the incident-claim generalisation for den, livestock and spawner objectives (F-01, F-05) before any of the v1 wolf quests are ported. Decide, per quest, `keep`, `merge` or `retire`; record it as a decision.
3. Decide the economy intent for the wolf chain rewards and renown (F-02) against SeedVale's own prices.
4. If the v2 board is adopted, fix the posting and attribution gaps (F-03, F-04) and add tests that go through `killAnimal`.
5. Persist animal bindings with the quest state for SeedVale (F-06), additive and versioned.
6. Give the cemetery, torch posts and rat infestation one state owner each (F-07, F-09, F-11) and register v2 anchors through the existing claim path (F-10).
7. Read the unexamined sources (§6.8) and enumerate generated IDs in a seeded world once SeedVale has a world to enumerate.

No v1 record should be deleted or rewritten until provenance, identity, world-state interactions, scope and rewards have been reviewed.

## 8. Independent NPC identity audit

**Reviewer:** Grok 4.7  
**Audited tree:** `9796437` (main). Sources are the comparison snapshots and the current SeedVale NPC contract. No game was run.  
**Rule used:** a different name is not a different person, and a matching name is not the same person. A v1 giver name is a label bound at materialisation, not a biography.

### 8.1 Identity mechanisms that already exist

No new id scheme is needed. Three mechanisms already separate identity from the display name.

| Layer | Stable key | What the name is | Source |
|---|---|---|---|
| v1 person | `NpcId` = `` `${settlementId}:npc:${memberIndex}` `` | First name only. `resolveAuthoredNpcId` matches `descriptor.name` and throws if the name is missing or ambiguous. `giverName` is presentation and is not the match key after materialisation. | `docs/comparison/code/seedvale-v1/src/settlement/npcIdentity.ts` (`settlementNpcId`, `settlementNpcDescriptors`); `src/quests/materializeAuthoredQuests.ts` (`resolveAuthoredNpcId`, lines 30–42 and 145–159) |
| v1 reserved homes | Family ids `family-reserved-0` and `family-reserved-1` | Two couples forced into the home settlement so the four first names keep resolving. Ages are seeded demographic state and are explicitly not part of the identity record. | `src/ai/characters.ts` `RESERVED_SEEDS` (lines 42–52); `src/settlement/families.ts` `reservedHomeFamilies` (lines 347–385) |
| v2 quest role | Slot id (`SlotId`), then `sim.state.questRoles[slot]` → numeric actor id | Generated, except the home settlement's first guard, whose display name is forced to `Mark Hornblower`. A slot is one person for the whole world only while that actor still fits the slot spec (D-QUEST-5). | `docs/comparison/code/SeedVales-v2/src/game/sim/questCore.ts` `resolveNpcSlots` (lines 129–164); `src/game/sim/newGame.ts` (lines 154–197); `docs/decisions/DECISIONS.md` D-QUEST-5 |
| v2 household | `Household.profession` on the house, not on the spouse | Only the head receives `npc.profession`. A spouse has no profession. SM always builds one household each of farmer, woodcutter, hunter, guard, herbalist, shepherd, trader. | `newGame.ts` (lines 178–210 and 221–224); `src/game/world/gen/settlements.ts` `HOUSEHOLDS_BY_SIZE.SM` (line 19) |
| SeedVale pin | `ReservedNpcId`: `mark_hornblower`, `kate_hornblower`, `ann_woodward`, `peter_woodward` | Display name is data on the pin. Quests are specified to cite `reservedId`, never the name. The pin is not placed in a settlement yet (M4). | `src/game/data/npc/types.ts` (`NpcId`, `ReservedNpcId`); `src/game/data/npc/reserved.ts`; `docs/plans/npc--001--npc-identity-and-generator.md` (reserved-characters table and N5) |

`QUEST-WORLD.md` display names are a proposal overlay on the v2 slots. Its own rule 1 is "the role, not the name, is the key." The "merged from" column (Radosław, Mirosław, Mira, Dobrawa, …) names earlier design-pack handles, not the v1 reserved four.

### 8.2 Person continuity

Classes: **confirmed**, **probable**, **possible**, **contradicted**, **unresolved**. "SeedVale pin" means the author continuation recorded in `npc--001` and `reserved.ts`. It is not, by itself, a match to a v2 slot.

| v1 person | v1 record | SeedVale pin | v2 slot / proposed name | Class | Why |
|---|---|---|---|---|---|
| Marek | `RESERVED_SEEDS`: male, `guard`, surname already `Hornblower`, quirk `sociable`; husband in `family-reserved-1` | `mark_hornblower` | Slot `mark`: home guard head. Display name forced by D-USER-1 / `newGame.ts`. QUEST-WORLD: "Mark Hornblower", merged from the H guard handles Wojciech / Ada | **confirmed** (the person) | Same sex, profession, home settlement, household-head/husband position, and the surname `Hornblower` already used in v1. Three later texts pin that same guard (D-USER-1, QUEST-WORLD rule 2, `npc--001`). His v1 quest list is not all his biography; see §8.3. |
| Marek | same | `mark_hornblower` | Slot `ralph` / Ralph Fieldman, farmer head and reeve | **contradicted** | Different profession, different household, different quest objects (well rumour, grain, common store, oak verdict). A shared settlement is not identity. |
| Kasia | female, `trader`, surname `Hornblower`, quirk `night_owl`; wife in `family-reserved-1`. Profession is per person, so a trader wife lives in the guard's family. | `kate_hornblower` (`spouseOf: 'guard'`, a profession, not `mark_hornblower`) | No v2 record of this person. Mark's generated spouse has no profession and a generated name (`newGame.ts` 208–210). | **probable** as the SeedVale continuation of the v1 wife; **unresolved** as a v2 person | Author text says keep the wife. Sex, trader profession, night-owl quirk, and Hornblower surname match v1. The given name `Kate` is marked 🟡 in the plan (Kasia / Katarzyna). v2 never names her. |
| Kasia | same | `kate_hornblower` | Slot `stephen`: trader household **head**. QUEST-WORLD: Stephen Chapman | **contradicted** | Stephen is another household's head. The design person is male. Kasia is the guard's wife. Objects differ: her parcel is private letters and bills in a rock cave, with a branch that hands them to her husband (`zaginiona-przesylka`, `quests.ts` giver `Kasia`, plan 005). Stephen's letter (`g06.ts`) is a sealed grain-price note to Jack in V. |
| Anna | female, `farmer`, quirk `fast_worker`, surname `Leśniewska`; wife in `family-reserved-0` | `ann_woodward` | No v2 person of this name. Slot `ralph` is the farmer head. | **probable** as the SeedVale continuation of the v1 farmer-wife; **contradicted** as Ralph | Sex, farmer profession, and fast-worker quirk match the v1 wife, and the plan's author line keeps Ann with Peter. `Woodward` is marked 🟡: it is not a translation of Leśniewska. Data does not store a spouse id for her; `reserved.test.ts` only checks that she shares Peter's surname. Ralph is a male farmer-head/reeve. |
| Piotr | male, `woodcutter`, quirk `energetic`, surname `Leśniewski`; husband in `family-reserved-0` | `peter_woodward` | Slot `miles`: woodcutter head. QUEST-WORLD: Miles Hewer, wife Lucy, mother Joan, son Matthew | **probable** as the SeedVale continuation of the v1 woodcutter-husband; **contradicted** as Miles | Sex, woodcutter profession, and energetic quirk match. `Peter` is a translation; `Woodward` is 🟡. Miles's household is a woodcutter house whose spouse is not a farmer. Peter's wife, in v1 and in the SeedVale pin, is the farmer. Those two household models cannot be the same marriage. |
| Anna's quest jobs | giver name `Anna` on sheep, herbs, wolves, monolith notes | not one pin | Slots `molly` (shepherd), `dora` (herbalist), `jacob` (hunter) | **contradicted** as the same person; **possible** as roles the four-name cast had to absorb | See §8.3. Profession and family disagree in every case. The plan that added the herb quest says the giver is Anna because she is the existing reserved farmer (`quests-progression-003`), not because she is an herbalist. |

Generated v1 opportunities are a different binder. `guard-evening-duty:<settlementId>:<giverNpcId>` uses an `NpcId`. `selectGuardQuestGiver` picks the first adult `role === 'guard'` (`guardProfessionQuests.ts`). That giver is Marek only when he is that guard. It is not a second identity for him, and it is not evidence that the giver is slot `mark` until the home guard is actually the reserved one.

### 8.3 One v1 name, several v2 people

The static list in `quests.ts` hardcodes only Anna, Piotr, Kasia, and Marek (`characters.ts` lines 42–46: randomising them would break those quests). Other v1 modules pick a giver at runtime (the lost-treasure elder, suspicious-transport, hunter and guard ladders) and are not this four-name cast. Plans 003 and 005 assign a new static quest to whichever of the four is closest in profession. That is a simplified cast, not a statement that one person lived every resulting story.

**Anna** (`ann_woodward` is the person; the jobs below are not all hers)

| v1 quest id | What the quest actually does | Nearest v2 slot | Class |
|---|---|---|---|
| `relay-anna-piotr` | She asks the player to tell her husband they fish at dawn (`quests.ts` ~1750). | none | **unresolved** quest (no v2 counterpart). Supports the marriage to Piotr only. |
| `zagubiona-owca` | Her sheep wandered; `find_animal` sheep; it can die (`quests.ts` ~1907). | `molly` / G01 | **contradicted** as the same incident and the same person. G01 (`g01.ts`) is a theft: latch lifted, lamb Pip, wanderer Piers Walker, guard `mark` as witness. v2 sheep are the shepherd household's livestock, not the farmer's (`newGame.ts` 221–224). **possible** only as "the lost-animal job was hung on the reserved farmer." |
| `ziola-dla-anny` | Three rare healing herbs for her home stock; no patient and no deadline (`quests.ts` ~1977). Plan 003 states the giver is the reserved farmer. | `dora` / G04 | **contradicted** as the same person and the same errand. G04 is yarrow ×2, mint ×2, chamomile ×1, 48 hours, son Toby with a chest fever (`g04.ts`). **possible** as the herb-gathering role later given to the herbalist. |
| `grozny-wilk`, `wilcza-jama`, `wilki-pod-osada` | A dangerous wolf, then the den, giver Anna after she is trusted (`quests.ts` ~2099). | `jacob` / G07, with `mark` as a clue | **contradicted** as the same person (farmer wife vs hunter head). **unresolved** as the same wolf. G07 is a named alpha, Greybeard, missing the outer toe of the left forepaw, who killed the hunter's dog (`g07.ts`). v1 uses singleton `WOLF_DEN_ID` and does not describe that animal. |
| `sporne-drewno`, `drewno-dla-anny` | One wood stock: her pasture fence versus Piotr's cart; her follow-up pays carrot seed (`quests.ts` ~2290; plan 005). | not G05; Q03 is a different wood problem | **contradicted** as G05. G05 is Miles versus Cedric Hogg over a boundary oak (`g05.ts`). **unresolved** against Q03: both touch timber, but Q03 is a rotten roof beam in the woodcutter's house (`q03.ts`), not a marital split of one stock. |
| `slad-przy-monolicie` | Someone did not return from a monolith; Anna rebuilds the route from old notes. | none of the H cast | **unresolved**. No v2 quest uses her notes or that monolith. Do not attach it to Dora or Ralph on the giver name alone. |

**Piotr** (`peter_woodward` is the person)

| v1 quest id | What the quest actually does | Nearest v2 slot | Class |
|---|---|---|---|
| `drewno-na-naprawe` | Five branches for a failing fence (`quests.ts` ~1940). | `miles` | **possible** role (home woodcutter repairs something). **contradicted** object: Miles's authored repair is the roof beam, not this fence. |
| `kamienie-dla-piotra` | Stones for a foundation. Plan 003: he already has the repair motif. | none | **unresolved**. No v2 stone-foundation quest. |
| `drewno-dla-piotra` | Five branches for his cart, only after `sporne-drewno` favours him. | `miles` | **contradicted** as Q03/G05 (different object and different dispute). |
| `zwiadowca` | Check a rock den, spot a stag, bring two stones from the hills (`quests.ts` ~1834). | none | **unresolved**. Forest knowledge sits on the only named woodcutter because v1 has no named hunter in the quest cast. |
| `dzik-przy-szlaku` (Piotr is the informant, Marek the giver) | Marek sends the player to Piotr, who knows where the boar is. | `jacob` knows animals; Q02's giver is `edith` | **possible** that the "knows the ground" line was the woodcutter standing in for a hunter. **contradicted** as Q02: that quest is a sow with farrow by the lower V road (`QUEST-WORLD.md`, Q02). |
| `stare-ruiny`, `samotna-wieza`, `mapa-do-skarbu` | Ruins, a lonely tower, a treasure map from a cave or a cemetery grave. | Q05, Q11, Q12, Q13 have other givers | **contradicted** as those givers (Rosalind, Eve, Duncan, Irene). **unresolved** as shared landmarks. |

**Kasia** (`kate_hornblower` is the probable person; she is not Stephen)

| v1 quest id | What the quest actually does | Nearest v2 slot | Class |
|---|---|---|---|
| `shells-dla-kasi` | Three shells for her doorstep (`quests.ts` ~1782). | none | **unresolved**. Personal errand with no v2 object. |
| `sprawdz-szlak` | Check a cave on a trade route. Plan 003: she is the reserved trader, and the objective reuses `zwiadowca`'s cave interaction. | none | **unresolved**. The plan chose her for profession and for an existing objective, not from a trader biography. |
| `zaginiona-przesylka` | Private letters and bills at a rock cave; return them sealed to her, or give them to Marek. | `stephen` / G06 | **contradicted** person and object (§8.2). |
| `zapomniany-cmentarz` | She asks whether the graves still stand; they are intact and overgrown. | `ruth` / Q14 | **contradicted** as the same person. Q14 (`q14.ts`) casts `ruth` with `kin: ['elder', 'spouse', 'head']` and no profession. The giver cannot bend to tidy five graves. Kasia is a working-age trader. **possible** only as the same kind of cemetery visit. Ruth's full name is still absent. |
| `wilki-u-kupca` | Wolves scare the merchant's horse; destroying `WOLF_DEN_ID` wins the horse if it is still alive. | `jacob` / G07 | **contradicted** person. **unresolved** wolf (same den id as Anna's wolf chain; not Greybeard's missing toe). |

**Marek** (the person is confirmed; several jobs are not his v2 life)

| v1 quest id | What the quest actually does | Nearest v2 slot | Class |
|---|---|---|---|
| `woda-dla-marka` | His hands are full; draw well water (`quests.ts` ~1808). | not `ralph` / G08; not Q08 | **contradicted** as those quests. G08 is a sickness rumour about the well (`g08.ts`). Q08 is building a well. This errand has no v2 counterpart. |
| `lis-przy-osadzie` | Kill a fox near the houses. Plan 003: he is the reserved guard, and a fox is used so the quest does not share the wolf target. | Q01 `jacob` | **contradicted**. Q01 is a white hare at the hazels, not a fox. |
| `dzik-przy-szlaku` | A boar on the trail; renown ≥ 10; talk to Piotr first. | Q02 | **contradicted** (boar vs sow with farrow; guard giver vs hunter Edith). |
| `plaga-szcurow` | Clear a rat infestation. | no authored v2 giver | **unresolved**. |
| `zaginiony-ladunek` | A coastal wreck; check the cargo. No crew. | none | **unresolved**. No v2 shipwreck quest. |
| `skarb-jaskini-niedzwiedzia` | A bear-cave treasure, with a return-or-keep choice. | Q12's bear is the Pinewatch cellar bear | **unresolved** landmark. Do not equate the two bears on species. |
| G01 / G03 / G07 / Q07 slot `mark` | Witness to the lamb theft; snuffed torches by the hunter's house; grey hair on a post; a guest at Lucy's supper. | slot `mark` | **probable** that these are the confirmed guard's v2 jobs. They are not present in v1 Marek's quest list. The v1 generated torch duty (`guard-evening-duty:…`) is the same problem class as G03 only at the "light the posts" level; G03's culprit is Hazel, the hunter's child (`g03.ts`). That story is not in the v1 duty. |

### 8.4 v2 people with no v1 person to map

These slots have a profession, kin, and quest objects that none of the four v1 names possess. Leave them unmapped. Do not fold them into Ann, Peter, Kate, or Mark to save a household.

| Slot id | Proposed name (QUEST-WORLD, not canon) | Settlement / kin | Evidence against a v1 merge |
|---|---|---|---|
| `ralph` | Ralph Fieldman | H, farmer head, reeve | Male reeve. Anna is a farmer wife. His quests are G02's plowshare money, G05 mediation, G08's rumour, Q03's common store, Q09's grain. |
| `miles` | Miles Hewer | H, woodcutter head | Spouse Lucy, elder Joan, son Matthew (`q03.ts`). Piotr's spouse is a farmer. |
| `lucy`, `joan`, `matthew` | Lucy, Joan, Matthew Hewer | H, woodcutter spouse / elder / son | No v1 woodcutter household of this shape. `family-reserved-0` has two adults and no child. |
| `stephen` | Stephen Chapman | H, trader head | Not the guard's wife. See Kasia. |
| `molly`, `tom`, `luke` | Molly, Tom, Luke Lambert | H, shepherd house | Sheep, pen, lamb Pip, small beer. No v1 named shepherd in the quest cast. |
| `jacob`, `martha`, `hazel` | Jacob, Martha, Hazel Bowman | H, hunter house | Dog Patch, Greybeard, Hazel snuffing torches. No v1 named hunter in the quest cast. |
| `dora`, `toby` | Dora, Toby Herbert | H, herbalist head and child | Sick child and a timed herb list. Anna's herb quest is a stock delivery. |
| `ruth` | no full name in the repo | H, elder-preferring kin, no profession (`q14.ts`) | Not Kasia. |
| `piers` | Piers Walker | spawn, not a household | Created by G01's `spawn` spec. No v1 counterpart. |
| V and T cast (`bernard`, `sophie`, `margaret`, `cedric`, `edith`, `elspeth`, `jack`, `eve`, `rosalind`, `percy`, `silas`, `duncan`, `irene`, …) | names in QUEST-WORLD | MD / LG | The static v1 giver names never leave the four home people. No evidence identifies any of these slots with Anna, Piotr, Kasia, or Marek. |

### 8.5 Contradictions and missing evidence

1. **Mixed-profession couple versus one profession per house.** v1 `family-reserved-0` is one family with a woodcutter husband and a farmer wife. v1 `family-reserved-1` is one family with a guard husband and a trader wife. v2 stores profession on the household and gives it only to the head. SeedVale reproduces the v1 pairs by surname (`reserved.test.ts`) and gives Kate `spouseOf: 'guard'`, but Ann and Peter have no spouse field at all. M4 cannot place both models without an explicit rule. Q-012 option (a) — keep the four pins and add Ralph, Miles, and Stephen as other people — matches the person evidence. It does not yet say how a two-profession marriage is stored.
2. **Section 1 over-claims.** "Resolved by reservation" is an author pin from v1 into SeedVale. It does not identify those pins with v2 slots, and it does not assign every quest that uses the v1 first name to that pin.
3. **Display strings still open.** `Kate` and `Woodward` are marked 🟡 in `npc--001`. v1 ages are not identity (`families.ts` 357–361); the ages 38 / 34 / 32 / 36 in `reserved.ts` are new pins. This audit did not recompute the Big Five floats; `reserved.ts` states they are `personalityForIndex` for seed order Anna, Piotr, Kasia, Marek, which is the `RESERVED_SEEDS` order.
4. **Ruth.** Slot id only. No surname, no profession, no v1 id.
5. **Greybeard versus `WOLF_DEN_ID`.** Not shown to be one animal.
6. **Cemetery.** `zapomniany-cmentarz` and Q14 and the map-in-a-grave beat of `mapa-do-skarbu` may share a landmark. They do not share a giver.
7. **Generated worlds.** This audit did not enumerate a seeded settlement, so it does not claim which numeric actor id a v2 slot receives.

### 8.6 Corrections required in the sections above

Apply these to sections 1 and 2. They are not optional wording.

1. Replace "Resolved by reservation" with two columns: **SeedVale continuity pin** (the four ids) and **v2 slot match** (only `mark` is confirmed). Kate, Ann, and Peter stay **probable** pins, not resolved v2 people.
2. Delete the instruction "Do not map Ann to Molly, Jacob, or Dora" as a blanket ban. Keep it for the **person** Ann Woodward. Add the §8.3 rows: her sheep, herb, and wolf quests are **possible** stand-ins for `molly`, `dora`, and `jacob`, and **contradicted** as those people.
3. State explicitly that Kasia is **not** Stephen and Piotr is **not** Miles. Section 1 currently says not to map Peter to "another woodcutter solely by role," which is right, and then leaves Miles inside the Q-012 pile as if the only question were headcount.
4. Q-012's default (a) stands for people: do not merge Ralph, Miles, or Stephen into the four pins. Add the household-model gap in §8.5.1 before M4 builds the homes. Option (b) would require rewriting quest objects, not just renaming.
5. In the matrix, `npc_reservation_id` may be set only where §8.2–8.3 say the quest is about that person's own life (`relay-anna-piotr`, and Marek's identity where a quest is actually the home guard). Sheep, herbs, wolves, the parcel, and the cemetery stay blank or point at a v2 slot, with `decision=unresolved`.
6. G08 remains a comparison candidate for "a well quest," not for Marek's identity. `woda-dla-marka` is a different event.
7. Do not treat QUEST-WORLD names as aliases of the reserved ids. Aliases belong to one canonical id (§8.7).

### 8.7 Recording canonical identity without display names

Use the keys that already exist. Do not add a third id.

1. **Canonical person id** for the four continued v1 people is `ReservedNpcId`. Dialogue and quest data cite `mark_hornblower`, `kate_hornblower`, `ann_woodward`, `peter_woodward`. The strings Mark, Marek, Kate, Kasia, Ann, Anna, Peter, Piotr, Hornblower, Leśniewska, Leśniewski, Woodward are aliases of those ids, and only where §8.2 says the pin is the same person. `Woodward` and `Kate` stay marked tentative until the author confirms the spelling.
2. **World instance id** stays `NpcId` (`` `${settlementId}:npc:${n}` ``). `reservedId` is a field on that def. Saving and streaming keep using `NpcId`. A rename does not change either id.
3. **v2 quest cast** keeps slot ids (`mark`, `molly`, `stephen`, `ruth`, …). On resolution, store `questRoles[slot] = NpcId` the way v2 stores `questRoles[slot] = actorId` (`questCore.ts`). The slot is a role binding (D-QUEST-5), not a person type. Binding `mark` to the def whose `reservedId` is `mark_hornblower` is the one confirmed link. Leave every other slot unbound to a reserved id.
4. **Alias table**, data rather than prose: `{ alias, reservedId | slotId, status }` with `status` in the five classes above. A row may point at a slot when the v1 quest was a stand-in (`zagubiona-owca` → slot `molly`, status `possible`) and must not also point at `ann_woodward`. One quest row has one identity target.
5. **Do not** key the alias table by display name, and do not let `uniqueNames` or `isReservedName` define identity. Those functions only keep the random pools from colliding with a pinned spelling.
6. **Spouse links** should be reserved ids, not a profession. `kate_hornblower.spouseOf: 'guard'` does not say she is Mark's wife if another guard exists. Ann and Peter need an explicit spouse pair if that marriage is canon; a shared surname is not that pair (`reserved.test.ts` only compares strings).

Until those links exist, quest reconciliation keeps `npc_reservation_id` empty except for the confirmed guard and for quests whose text is about that couple's own marriage or that trader wife's own goods. Everything else stays **unresolved**.

## Author decisions recorded after this review

The entries below supersede any earlier unresolved/recommended wording in this advisory review where they cover the same topic. Canonical records remain in `docs/decisions/DECISIONS.md` and the linked decision files.

- ✅ **D-QUEST-1 — Decision made:** Keep the four reserved NPC identity pins, with Mark Hornblower as the only reserved home guard; reconcile v1/v2 quest content individually instead of maintaining parallel inventories or merging people by role. Implementation remains gated by M7. ([`docs/decisions/quest-curation-and-q-012.md`](../decisions/quest-curation-and-q-012.md))
- ✅ **D-QUEST-8 — Decision made, refined by D-QUEST-14 and D-QUEST-15:** Keep G07 Greybeard as the longer eastern personal story; use `wilki-pod-osada` for the larger-pack threat, and retain `grozny-wilk` + `wilcza-jama` as a distinct short thread only while their gameplay objectives remain separate. Narrative consequences do not require simulated fauna migration. ([`docs/decisions/wolf-quest-curation.md`](../decisions/wolf-quest-curation.md))
- ✅ **D-QUEST-9 — Decision made:** Lost livestock is a general world-driven incident that can affect any household; v1 `zagubiona-owca` is not authored content to preserve, while G01 `The Lost Lamb` remains Molly Lambert's authored story about stolen lamb Pip. The same animal and incident must not create competing generated and authored quests. ([`docs/decisions/lost-livestock-quest-curation.md`](../decisions/lost-livestock-quest-curation.md))
- ✅ **D-QUEST-10 — Decision made:** Reconcile Rat Plague content from v1/v2 into one design, use the shared mechanics in `quest-feature-proposals.md`, and guarantee the infestation in the player's home settlement; poison stays optional and its risks to other animals must be considered. World state must be authoritative, and implementation remains gated by M7. ([`docs/decisions/quest-curation-and-q-012.md`](../decisions/quest-curation-and-q-012.md))
- ✅ **D-QUEST-11 — Decision made:** Keep general lost livestock, the injured-cow quest, and the injured/hungry dog companion quest distinct; animal subject matter alone is not a reason to merge them, and the same lost-animal incident must not be handled twice. Implementation remains gated by M7. ([`docs/decisions/lost-livestock-quest-curation.md`](../decisions/lost-livestock-quest-curation.md))
- ✅ **D-QUEST-12 — Decision made:** Retire v1 `guard-evening-duty` (“Światła na noc”); Q07 may take over its routine guard-duty role. G03 “Night Torches” remains and is not retired by this decision. ([`docs/decisions/quest-curation-and-q-012.md`](../decisions/quest-curation-and-q-012.md))
- ✅ **D-QUEST-13 — Decision made:** Keep both Q07 “Six Bowls, One Pan” and G03 “Night Torches”; if Q07 occupies Mark, G03's affected scene may wait until the next dusk. No mechanic change is required. ([`docs/decisions/quest-curation-and-q-012.md`](../decisions/quest-curation-and-q-012.md))
- ✅ **D-QUEST-14 — Decision made:** Merge `wilki-u-kupca` into `wilki-pod-osada` because both concern the same den incident, while preserving Kasia as a distinct giver with her own horse-related motivation; one world event may resolve multiple quest objectives. Rewards and presentation still need curation. ([`docs/decisions/wolf-quest-curation.md`](../decisions/wolf-quest-curation.md))
- ✅ **D-QUEST-15 — Decision made:** Keep `grozny-wilk` + `wilcza-jama` as a two-step thread about a different dangerous wolf: encounter it, then locate and clear its den. Exact locations await canonical geography, and both quests remain justified only while their gameplay objectives are distinct. ([`docs/decisions/wolf-quest-curation.md`](../decisions/wolf-quest-curation.md))
- 🟡 **D-QUEST-16 — Still open; no mechanic decision yet:** Opus must inspect the implementation and current authored/generated incident-conflict rules, then recommend whether/how `world:wolf-den-pressure` should defer to authored wolf quests. Distinguish the same incident from nearby activity, shared completion from duplicate generation, and reward/state conflicts. Implementation remains gated by M7. ([`docs/decisions/wolf-quest-curation.md`](../decisions/wolf-quest-curation.md))

- ✅ **D-QUEST-17 — Decision made:** Use a hybrid household model. Preserve the two v1 reserved marriages and their mixed professions: Mark Hornblower (guard) + Kate Woodward/Hornblower (merchant/trader), and Ann Woodward (farmer) + Peter Woodward (woodcutter). Other households may use a household-level profession model; do not force every household to follow the reserved couples' structure. Opus may recommend the least disruptive representation consistent with existing code and M4. (Resolves §8.5.1.)
- ✅ **D-QUEST-18 — Decision made:** Exceptional rewards such as large renown gains, valuable weapons, or a horse are appropriate only for major quests or as treasure/easy loot. Ordinary quests should not routinely grant rewards at that scale; Opus should inspect the economy and propose concrete tuning rather than treating the reviewed wolf-chain totals as the default. (Resolves the author-intent question in §3, F-02.)
- ✅ **D-QUEST-19 — Decision made:** Confirm **Kate Woodward** as the final canonical display name; keep it permanently rather than treating “Kate” or “Woodward” as tentative. Preserve the existing identity reservation/ID and aliases; a display-name confirmation must not create a new NPC identity. (Resolves §6 item 5 and §8.5.3.)

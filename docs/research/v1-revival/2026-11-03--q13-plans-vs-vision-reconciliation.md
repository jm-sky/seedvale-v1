# Q13 — Older plans vs approved Vision: Opus reconciliation

**Date:** 2026-11-03 · **Author:** Claude Opus 5.5 (queue Q13)  
**Status:** review + proposals only. **No plan, code or Strategic Brief change is made or authorized by this document** (author mandate, Strategic Brief "Older plans vs Vision reconciliation"). Conflicts and forks go to the author (queue §3).

## 1. Authority and method

Compared against, in this precedence:

1. [Q13 working author decisions (2026-10-30)](./2026-10-30--q13-author-decisions-working.md) — later than the Vision record; **supersede it** where they differ: #3 time (fixed 12 min, *no* configurable day length), #2 crafting (player crafting via shared recipes **is** approved — narrows Vision #23 "no automatic complex player crafting"), #9 founding (generic NPC outposts may be considered later).
2. [25 Vision decisions (2026-10-29)](./2026-10-29--vision-alignment-v1-v3.md).

Reused, not redone: [items/armor audit](./2026-11-02--q13-items-player-items-equipment-audit.md) (plans 029/030/031/040/044) and [progression audit](./2026-11-02--q13-progression-audit-handoff.md) (001/059/066).

Method (static only, `main` @ `4b3e9d43`): keyword sweep of all 113 active plan files in `docs/plans/` per Vision area (EXP/levels, crafting, day length, death/kill, teleport/fast travel, LLM, fantasy/magic, founding, external resolution, item spawning, multiplayer, music), then reading the hit lines and the code they depend on. No tests, browser runs or benchmarks. Code line refs are as of this SHA.

## 2. Findings

Severity: **High** = current code or a plan contradicts an approved decision · **Medium** = an approved direction has no owner/plan or is only partly delivered · **Low** = wording/guard rail in a plan.

| # | Sev | Decision | Where | State | Finding | Proposed correction | Depends |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | **High** | Vision #10, working #4 (0 HP → incapacitation; finishing kills and is a serious crime) | `src/ai/NpcAgent.ts::takeDamage` (≈ L2455–2479) → `commitNpcDeath()`; no NPC incapacitated state, no finishing action, no crime concept (`grep murder\|crime` = 0 hits in `src/`). Plans that build on it: `npc-033` §Injury/death (NPC death via `commitNpcDeath`), `settlements-npcs-049` (merchant dies), `settlements-npcs-051` (road party threats), `quests-progression-068` (bandit group/camp as threat), `world-032` | **implemented contrary** | Any human NPC reaching 0 HP dies. Today exposure is mostly player → NPC (no hostile-human producer exists — `npc-033` L101), but every planned human-combat feature inherits death-on-0-HP. Player side is already aligned (`downed`). | New Opus plan **`npc-066` human incapacitation, finishing and crime**: NPC `incapacitated` state on the alive→0 HP edge (persisted, time-skip safe, recovery/treatment via existing injury + healer seams), explicit *finish* interaction as the only lethal path for humans in combat, killing = social-news/reputation event (justice system out of scope). Animals unchanged. Needs author forks first (§4 Q13-a). | Blocks human-combat parts of `npc-033`, `068`, `051` |
| R2 | **High** | Vision #13, working #1 (internal per-skill XP must not appear in UI) | `src/ui-vue/components/CharacterPanel.vue:687` (`XP ${Math.round(r.xp)}`), `SkillsActionCards.vue:189` (`XP {{ card.xp }}`); plan `ui-input-042` "inline XP" (author PASS 2026-10-26, superseded) | **implemented contrary** — re-verified 2026-11-03 (progression audit F1) | Raw XP numbers visible on two screens. | UI-only: drop the XP numbers, keep skill values and progress bars; no change to `PlayerSkills`, persistence or XP math. Note on `ui-input-042` that inline XP is superseded. S, small, **X-suitable**. Needs author go-ahead (Q13-c). | — |
| R3 | Medium | Working #3 (fixed 12 min/day; no configurable day length; keep acceleration/skip) | `src/ui-vue/screens/WorldConfigScreen.vue:183–196` — player-facing slider "Długość dnia" 60–1200 s (Pause → World); also in `ui/createDebugGui.ts:117` (debug, fine). Default 720 s (`world/travelUnits.ts:13`, 059 T1) is aligned; value is not saved | **implemented contrary** (UI) | Player can change day length freely; travel-time units (`TRAVEL_HOUR_M`), needs pacing and spacing assume 720 s. The 0–20× time-multiplier slider is acceleration → allowed. | Remove the day-length slider from the player screen (keep debug GUI). S, XS. Author choice Q13-b. | — |
| R4 | Medium | Working #2 (player crafting through shared recipes, materials, facilities; NPC artisans and orders keep roles) | Code: campfire `COOKING_RECIPES` (`items/campfireCooking.ts`), per-structure build recipes (torch, trough, palisade), NPC production in `economy/production*.ts` + `settlement/artisanCraft.ts` — separate recipe sources. **No plan owns player crafting.** The items audit (F3, "do not add a player crafting system") predates/ignores working #2 | **gap** | Approved direction without owner; risk of a parallel player-only recipe system later. | Opus recon → plan `items-player-062` "shared recipe catalog for player crafting" reusing `economy/production` + `artisanCraft` (facility requirement: none / campfire / workshop). Mark items-audit F3 wording as superseded by working #2. Not urgent (after world/settlements/quests priorities). | items audit F2/F3 |
| R5 | Medium | Vision #12, working #5 (defeat → unconsciousness, injuries, recovery, time loss, maybe lost belongings) | `player/playerDamage.ts:141` → `enterDowned(DOWNED_DURATION_SEC = 5)`; physical injury registered; stand-up after 5 s | **partial** | No time loss, belongings or treatment consequence; tuning explicitly unresolved by the author. | Keep open (Vision open item 2). When combat work resumes, fold into the R1 plan as a shared "defeat consequences" section rather than a separate system. | R1 |
| R6 | Medium | Vision #20, working #8 (companion animals mortal but with strong flee/escape protection; selected NPCs travel-risk avoidance) | Generic fauna flee exists (`fauna/faunaDecision.ts`, `predatorHumanDecision.ts`); no companion-specific escape protection or important-NPC protection in code; companion plans `npc-032/033/034/035` and `quests-progression-058` (dog) do not cover it | **gap** | Approved direction, magnitudes open (Vision open item 1); no owner. | Add a dependency note to `npc-033` (companion combat) and `058`: companion escape protection is required before companion animals take combat damage. Design later with author magnitudes. | — |
| R7 | Low | Vision #14 (grounded realism, no fantasy monsters) | `fauna-049` L21: tier `elite` = "super-dangerous boss"; legendary trophy grade | **planned** | "Boss" framing invites game-y stat inflation/presentation. `fauna-032` morphs are already bounded (scale composition capped). | Add a realism guard to `fauna-049`: exceptional *individuals* (old, large, wounded/aggressive), stats within plausible species range, no boss UI/health bars. | — |
| R8 | Low | Working #1 | `quests-progression-066` L85–87 "bounded XP" | **draft** | Teaching may award XP — fine only as internal per-skill XP. | One-line clarification in the draft (progression audit F3). | R2 |
| R9 | — | Vision #01/#13 | `quests-progression-059` known deeds without witness gate | author-deferred (option C, 2026-11-02) | Carried as open design question, no task. | — | — |
| R10 | — | Vision #22/#23 | armor plans 029/030/031/040/044 | see items audit | Carried: regional/layered protection (high), armor condition/repair (medium), artisan provenance + NPC/player parity (medium). D5/D6 stay unapproved. | — | D5/D6 |

## 3. Checked and aligned (no action)

| Decision | Evidence |
| --- | --- |
| #6 travel, no teleport | `ui-input-025` L20 "autopilot is not fast travel/teleport"; `world-terrain-059` L79 no fast travel; no `fastTravel` symbol in `src/`. |
| #2 / working #6 quest autonomy | External resolution exists only for world-driven problems: `quests-progression-067` (missing merchant), `068` §9, `070` §14 (boar), `082`. Authored Lost Treasure Chronicles `040–046` have no rival claimant (`044` L150 "do not invent another claimant"). |
| #9 / working #9 founding | `settlements-003`, `settlements-022`, `settlements-npcs-044`, `quests-progression-062`, `quests-progression-010` are all quest/authored-site driven; no generic NPC founding plan. |
| #21 no quest requires killing a human | Quest objective kinds in `src/quests/` target animals only (`kill_target_animal`, `kill_bound_animal`); bandit treasure (`dungeonBanditTreasure.ts`) is loot/talk/own-item. |
| #15 no gameplay LLM | Every hit is an explicit non-goal (`npc-033`, `npc-035`, `066`, `069`, `ui-input-047`). |
| #16 singleplayer | `world-015` L517 lists multiplayer sync as a non-goal. |
| #19 / working #7 economy | No restock/replenish item-spawning path for goods found (`replenish` hits are rats/fauna populations); `settlements-npcs-050` §6 "no magic resupply". Currency safeguards remain open (Vision open item 4). |
| #24 time frozen when closed | Catch-up is game-day based (`gameLoop.ts` time-skip, household `lastResolvedAtDays`), no real-clock offline progress. |
| #25 no music | No music/soundtrack code or plan. |
| #18 / working #3 default pace | `DEFAULT_DAY_LENGTH_SEC = 720` (059 T1). Only the player slider conflicts (R3). |
| #13 | `settlements-npcs-022` and `066` list profession XP as non-goals; animal tiers in `fauna-049` are not player levels. |

**Not audited by Q13** (no Vision-sensitive keyword hits beyond those above, or out of the 25 decisions' surface): rendering/performance/lifecycle/tooling plans; the remaining `items-player` plans (`014`, `028`, `032`, `037`, `051`, `052`, `061`) and economy cargo plans (`settlements-npcs-052`, `054`) only had keyword-level screening — they are the candidates for delegated batch D4/D5 below.

## 4. Questions for the author (Polish, also in queue §3)

- **Q13-a — śmierć NPC przy 0 HP (R1):** (a) napisać teraz plan `npc-066` (nieprzytomność NPC + świadome dobicie + zabójstwo jako zdarzenie społeczne/reputacja) — implementacja po drogach/osadach [rek.]; (b) odłożyć do pracy nad walką z ludźmi (bandyci, kompani); (c) zostawić śmierć przy 0 HP.
- **Q13-b — suwak „Długość dnia” w menu gracza (R3):** (a) usunąć z ekranu gracza, zostaje w debug GUI [rek.]; (b) zostawić.
- **Q13-c — liczby XP w UI (R2):** (a) usunąć liczby XP z obu ekranów (paski i wartości zostają) [rek.]; (b) zostawić.
- **Q13-d — `fauna-049` „elite = boss” (R7):** (a) dopisać do planu granicę realizmu (wyjątkowe osobniki, bez „bossów”) [rek.]; (b) zostawić.

## 5. Delegation plan (after the answers)

| # | Work | Model | Gate |
| --- | --- | --- | --- |
| D1 | R2 hide XP numbers + `ui-input-042` superseded note | S / **X** (ChatGPT/Cursor; brief = R2 row) | Q13-c (a) |
| D2 | R3 remove player day-length slider | S / **X** | Q13-b (a) |
| D3 | R1 plan `npc-066` (incapacitation, finishing, crime event; R5 defeat section) | O | Q13-a (a) |
| D4 | Bounded audit, same format as the items audit: `items-player-014/028/032/037/051/052/061` vs #11/#19/#23 + working #2/#7 | **X** (GPT Sol/Luna) | none — paste-ready |
| D5 | Bounded audit: merchant/economy plans `settlements-npcs-049–054`, `world-032`, `world-035` vs #19/working #7 and R1 (merchant/carrier death assumptions) | **X** (GPT) | none — paste-ready |
| D6 | R4 shared-recipe player crafting recon → plan | O | after world/settlement/quest priorities |
| D7 | Plan annotations R6/R7/R8 + items-audit F3 superseded note | S (docs) | Q13-d; author OK for plan edits |

## 6. Verification limits

Static review of plan text and source at `4b3e9d43`. Keyword screening can miss conflicts phrased differently; rows R1–R3 are confirmed in code, R4–R8 are gap/wording findings. Nothing here is browser- or test-verified.

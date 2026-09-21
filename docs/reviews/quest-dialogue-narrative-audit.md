# Quest dialogue & narrative audit — master checklist

**Created:** 2026-09-21  
**Scope:** quest dialogue copy, narrative quality, character voice and story coherence only.  
**Out of scope:** quest mechanics, rewards, state machine, UI hierarchy, objectives, balance and runtime architecture unless dialogue directly contradicts them.

## Goal

Bring all quest dialogue to a consistent authored standard without turning simple errands into over-written story quests.

Target qualities:

- NPC dialogue sounds like something an inhabitant would actually say, not a quest-board instruction.
- The player hears why the NPC cares before hearing the task.
- Short quests remain short, but still carry context, personality or a small piece of worldbuilding.
- Anna, Piotr, Kasia, Marek and profession/story NPCs should not sound interchangeable.
- Objective/checklist wording belongs in quest descriptions and objectives, not in spoken dialogue.
- Reminders should sound like follow-up conversation, not UI status text.
- Reports and completions should react to what actually happened instead of defaulting to repeated "Dzięki".
- Branching quests should preserve distinct viewpoints, uncertainty, tension and consequences.
- Do not add lore that contradicts current world state or invent persistent facts that the simulation does not own.

## Status legend

- ⬜ todo — not reviewed in detail yet
- 🔄 in progress — currently being rewritten/reviewed
- ✅ done — narrative/dialogue pass complete

## Audit labels

- **OK** — strong enough; only fix obvious language errors if found.
- **polish** — concept works, but wording/voice/repetition needs improvement.
- **rewrite** — spoken dialogue is too mechanical, generic, awkward or narratively weak.

The labels below are the initial triage from the 2026-09-21 audit. They are not final until each quest/batch is reviewed line by line.

---

## Batch A — weak small errands

| Status | Quest | Source | Initial label | Main issue |
|---|---|---|---|---|
| ⬜ | Muszle dla Kasi | src/quests/quests.ts | **rewrite** | Pure fetch request; weak personal/world context. |
| ⬜ | Woda dla Marka | src/quests/quests.ts | **rewrite** | Mechanical request; giver motivation is barely present. |
| ⬜ | Zioła dla Anny | src/quests/quests.ts | **rewrite** | "Bring N items for N coins" tone; little character voice. |
| ⬜ | Kamienie dla Piotra | src/quests/quests.ts | **rewrite** | Quest-board wording; no concrete repair/problem context in spoken line. |

## Batch B — small local problems

| Status | Quest | Source | Initial label | Main issue |
|---|---|---|---|---|
| ⬜ | Drewno na naprawę | src/quests/quests.ts | **rewrite** | Functional but transactional and checklist-like. |
| ⬜ | Lis przy osadzie | src/quests/quests.ts | **rewrite** | Generic extermination contract; little local texture. |
| ⬜ | Sprawdzenie skalnej groty | src/quests/quests.ts | **polish** | Better premise than basic errands; needs stronger natural delivery. |

## Batch C — professions

| Status | Quest | Source | Initial label | Main issue |
|---|---|---|---|---|
| ⬜ | Pierwsze trofea | src/quests/opportunities/hunterProfessionQuests.ts | **polish** | Reads partly like tutorial/checklist dialogue. |
| ⬜ | Poroża jeleni | src/quests/opportunities/hunterProfessionQuests.ts | **rewrite** | Awkward tone; "bez pracy nie ma pysznego mięsa" is especially weak. |
| ⬜ | Pomoc przy zagajniku | src/quests/opportunities/hunterProfessionQuests.ts | **polish** | Solid systemic premise; improve hunter voice and naturalness. |
| ⬜ | Światła na noc | src/quests/opportunities/guardProfessionQuests.ts | **polish** | Grounded premise, but dialogue can carry more guard-specific voice. |

---

## Legacy/authored home quests

| Status | Quest | Source | Initial label | Main issue |
|---|---|---|---|---|
| ⬜ | Wiadomość dla Piotra | src/quests/quests.ts | **polish** | Simple and believable; can use slightly more character. |
| ⬜ | Zwiad okolicy | src/quests/quests.ts | **polish** | Good multi-stage structure; review individual lines and reactions. |
| ⬜ | Zagubiona owca | src/quests/quests.ts | **polish** | Works, but currently generic. |
| ⬜ | Groźny wilk | src/quests/quests.ts | **polish** | Real danger exists; spoken framing can carry more urgency/local detail. |
| ⬜ | Wilcza jama | src/quests/quests.ts | **polish** | Functional follow-up; needs continuity with prior wolf events. |
| ⬜ | Wilki pod osadą | src/quests/quests.ts | **polish** | Grounded, but compare against dynamic variant to avoid duplicate voice. |
| ⬜ | Zaginiona przesyłka | src/quests/quests.ts | **OK** | Branching viewpoints already carry stronger narrative. |
| ⬜ | Sporne drewno | src/quests/quests.ts | **OK** | Conflict premise and competing interests are narratively useful. |
| ⬜ | Drewno dla Anny | src/quests/quests.ts | **polish** | Review as consequence/follow-up to disputed wood, not standalone errand. |
| ⬜ | Drewno dla Piotra | src/quests/quests.ts | **polish** | Same as above; preserve distinct viewpoint from Anna. |
| ⬜ | Dzik przy szlaku | src/quests/quests.ts | **polish** | Good local problem; improve voice and intermediate conversation. |
| ⬜ | Plaga szczurów | src/quests/quests.ts | **rewrite** | Offer line recites mechanics/objectives rather than telling the situation. |

## Landmark/world discovery quests

| Status | Quest | Source | Initial label | Main issue |
|---|---|---|---|---|
| ⬜ | Stare ruiny | src/quests/quests.ts | **polish** | Good premise; completion wording is generic. |
| ⬜ | Ślad przy monolicie | src/quests/quests.ts | **polish** | Stronger mystery; improve emotional continuity around the missing person. |
| ⬜ | Zapomniany cmentarz | src/quests/quests.ts | **polish** | Good quiet premise; avoid generic "dziękuję za sprawdzenie". |
| ⬜ | Zaginiony ładunek | src/quests/quests.ts | **polish** | Works; report can better reflect loss/uncertainty. |
| ⬜ | Samotna wieża | src/quests/quests.ts | **polish** | Atmosphere is good; report is slightly stock/authorial. |
| ⬜ | Mapa do skarbu | src/quests/quests.ts | **polish** | Good adventure hook; report is generic relative to the journey. |
| ⬜ | Wilki u kupca | src/quests/quests.ts | **polish** | Strong practical motivation; review reward dialogue and plausibility. |
| ⬜ | Stary skarb w jaskini | src/quests/quests.ts | **polish** | Good structure; some lines are system-like rather than spoken. |

## Lost treasure / authored story chain

| Status | Quest | Source | Initial label | Main issue |
|---|---|---|---|---|
| ⬜ | Przygotowania do zimy | src/quests/lostTreasureChroniclesElder.ts | **OK** | Good grounded setup and character context. |
| ⬜ | Stara uraza | src/quests/lostTreasureChroniclesElder.ts | **OK** | Strong conflicting accounts and social framing. |
| ⬜ | Zakodowana kronika | src/quests/lostTreasureChronicleSearch.ts | **polish** | Good story direction; some reminder/journal-like lines need human wording. |
| ⬜ | Porządek na cmentarzu | src/quests/lostTreasureChronicleSearch.ts | **polish** | Review whether it feels like a living-world request rather than a gate. |
| ⬜ | Odczytanie kroniki | src/quests/lostTreasureChronicleDeciphering.ts | **polish** | Strong setup; contains grammar/logic issues in some specialist lines. |
| ⬜ | Zaginiona wyprawa po skarb | src/quests/lostTreasureExpedition.ts | **OK** | Generally strong authored adventure material. |
| ⬜ | Stare kości | src/quests/oldBonesAdventureCave.ts | **OK** | Good narrative premise; line-level pass still needed. |
| ⬜ | Skrytka bandytów | src/quests/dungeonBanditTreasure.ts | **OK** | Good ownership/ledger tension and outcome context. |

## Natural cave / transport stories

| Status | Quest | Source | Initial label | Main issue |
|---|---|---|---|---|
| ⬜ | Zaginiony myśliwy | src/quests/lostHunterNaturalCave.ts | **polish** | Story is good, but the offer line "to raczej nie ja" is awkward/confusing. |
| ⬜ | Podejrzany transport | src/quests/suspiciousTransportCaveCache.ts | **OK** | Good secrecy/trust framing and meaningful reactions. |

## Hunters Brotherhood

| Status | Quest | Source | Initial label | Main issue |
|---|---|---|---|---|
| ⬜ | Krąg myśliwych | src/quests/huntersBrotherhoodIntroduction.ts | **polish** | Too much exposition/instruction in the offer; dialogue can be more natural. |
| ⬜ | Niepokojące łowisko | src/quests/huntersBrotherhoodInvestigation.ts | **polish** | Solid context; check voice and escalation. |

## Dynamic RPG quest materialization

These are templates/materialized quests, so the pass must consider repeated use across settlements and avoid prose that assumes facts not represented by the generated opportunity.

| Status | Quest/template | Source | Initial label | Main issue |
|---|---|---|---|---|
| ⬜ | Sekret starego miejsca | src/quests/opportunities/rpgQuestMaterialization.ts | **polish** | Atmospheric but verbose; tighten without losing mystery. |
| ⬜ | Podejrzany transport | src/quests/opportunities/rpgQuestMaterialization.ts | **rewrite** | Artificial/expository phrasing; weaker than authored cave-cache version. |
| ⬜ | Umowa między osadami | src/quests/opportunities/rpgQuestMaterialization.ts | **rewrite** | Too abstract: NPCs discuss a generic "prośbę/odpowiedź" without a concrete subject. |

## Dynamic world-problem quests

| Status | Quest/template | Source | Initial label | Main issue |
|---|---|---|---|---|
| ⬜ | Wilki pod osadą | src/quests/opportunities/worldQuestMaterialization.ts | **polish** | Strong systemic cause; ensure dialogue feels specific to the pressure. |
| ⬜ | Zagubione zwierzę | src/quests/opportunities/worldQuestMaterialization.ts | **polish** | Good reusable premise; add warmth/context without inventing facts. |
| ⬜ | Ranna krowa | src/quests/opportunities/worldQuestMaterialization.ts | **OK** | Strong world-state grounding and meaningful alternative handling. |

---

## Per-quest review checklist

When a quest is picked for a batch, review every player-facing authored line that belongs to it:

- [ ] title and description support the same story as the dialogue
- [ ] offer line establishes a believable reason/problem
- [ ] giver voice is distinguishable where the NPC identity is authored
- [ ] spoken dialogue does not recite objective counts/mechanics unnecessarily
- [ ] player lines sound like actual responses, not UI labels
- [ ] reminder lines acknowledge an ongoing situation naturally
- [ ] progress lines separate narration/world observation from NPC speech correctly
- [ ] report prompt reflects what the giver knows at that moment
- [ ] player report reflects what the player actually discovered/did
- [ ] completion/report line reacts specifically to the result
- [ ] branch/outcome dialogue preserves each side's viewpoint
- [ ] repeated filler such as "Dzięki", "Dziękuję, że sprawdziłeś" is reduced
- [ ] grammar, declension and natural Polish are correct
- [ ] no invented lore/state that current simulation cannot support
- [ ] simple quest stays concise; stronger prose does not become unnecessary exposition

## Working rule

Each batch should change dialogue/narrative copy only unless the review discovers a direct contradiction between text and actual quest state. Such contradictions should be noted separately rather than silently changing mechanics.

After a batch is merged to main, update its rows here to ✅ done and adjust the initial label/problem notes if the detailed review changed the diagnosis.

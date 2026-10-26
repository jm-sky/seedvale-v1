# Q0 cast and name manifest

**Status:** `verification needed`  
**Created:** 2026-10-15  
**Domain:** quests, NPC identity, dialogue  
**Authority:** [D-NPC-23](../../world/areas/home-population.md), [quests--004 Q0](../../plans/quests--004--curated-portfolio-to-playable-quests.md), [Q-026](../../state/QUESTIONS.md). This file does not add residents or implement NPCs.

Authored identity preparation is complete; M4 runtime binding and author name taste remain open.

**Character-writing references:** [Mark Hornblower and Kate](../../dialogue/mark-hornblower-character-profile.md); [Peter and Ann Woodward](../../dialogue/woodward-character-profiles.md). Editorial guidance for quest/dialogue characterization only; actor identity, quest conditions and runtime authority remain as defined here and in accepted decisions.

## Binding rule

`actorKey` is the immutable authored reference used by dialogue, journal and quest content. The `NpcId` values below are **proposed fixed reservations for the canonical world**, not IDs currently created by gameplay. They fit the existing `${string}:npc:${number}` type and the overlay's `home.hamlet` settlement ID. M4 must explicitly construct and save this mapping, reserve these numbers against procedural arrivals, and test it after load. Row order, display names, professions and generator iteration must never derive or change an ID. The six-NPC `story.ts` demo fixture uses a separate `hamlet:npc:*` namespace and does not satisfy this binding.

The older `npc--003` N2 implementation note still says to build households from D-NPC-20. D-NPC-23 supersedes that 20-person roster; M4 must use the 17 rows here and the canonical home-population specification.

**Name status:** *canonical* means the current D-NPC-23 identity/name; *working 🟡* is a reversible Q-026 taste proposal. Pronouns follow current character descriptions; F01 and S01 pronouns are working choices with their names. English dialogue uses `actorKey` and the resolved name/pronoun fields, never a first-name search or a literal old name. No selected dialogue speaker may resolve to two NPCs.

| actorKey | Proposed `NpcId` | Display name and status | Pronouns | Home slot | Identity and relationship constraint |
|---|---|---|---|---|---|
| `E01` | `home.hamlet:npc:0` | **Edmund Vale** — working 🟡 | he/him/his | `elder` | One retired former adventurer; owns the unique sword; no Hewer/Ruth alias |
| `F01` | `home.hamlet:npc:1` | **Elias Reed** — working 🟡 | he/him/his 🟡 | `fisher-a` | Fisher; Dora/Toby's unrelated housemate |
| `H01` | `home.hamlet:npc:2` | Dora Herbert — canonical | she/her/her | `fisher-a` | Herbalist; Toby's mother |
| `H02` | `home.hamlet:npc:3` | Toby Herbert — canonical | he/him/his | `fisher-a` | Dora's child; no labour role |
| `L01` | `home.hamlet:npc:4` | Ralph Fieldman — canonical | he/him/his | `fisher-b` | Farmer; Mrs Fieldman's husband; reeve office is provisional |
| `L02` | `home.hamlet:npc:5` | **Mabel Fieldman** — working 🟡 | she/her/her | `fisher-b` | Ralph's wife; Stephen's unrelated host |
| `T01` | `home.hamlet:npc:6` | Stephen Chapman — canonical | he/him/his | `fisher-b` | Trader and boarder with his own goods; travels without changing home by default |
| `W01` | `home.hamlet:npc:7` | Ann Woodward — canonical; reserved `ann_woodward` | she/her/her | `farmer` | Peter's wife; Q07 host, never a second Anna |
| `W02` | `home.hamlet:npc:8` | Peter Woodward — canonical; reserved `peter_woodward` | he/him/his | `farmer` | Ann's husband; no longer housed in `woodcutter` |
| `G01` | `home.hamlet:npc:9` | Mark Hornblower — canonical; reserved `mark_hornblower` | he/him/his | `guard` | Kate's husband; one daytime guard, never a second Marek |
| `G02` | `home.hamlet:npc:10` | Kate Hornblower — canonical; reserved `kate_hornblower` | she/her/her | `guard` | Mark's wife; trader, never a second Kasia |
| `S01` | `home.hamlet:npc:11` | **Gareth Flint** — working 🟡 | he/him/his 🟡 | `smith` | Local smith; not Bernard or Sophie; parcel casting remains open |
| `M01` | `home.hamlet:npc:12` | Molly Lambert — canonical | she/her/her | `woodcutter` | Shepherd; Tom's wife; Pip's owner in G01 |
| `M02` | `home.hamlet:npc:13` | Tom Lambert — canonical | he/him/his | `woodcutter` | Molly's husband; G08 concerns his specific beer barrel |
| `B01` | `home.hamlet:npc:14` | Jacob Bowman — canonical | he/him/his | `hunter` | Hunter; Martha's husband and Hazel's father |
| `B02` | `home.hamlet:npc:15` | Martha Bowman — canonical | she/her/her | `hunter` | Jacob's wife and Hazel's mother |
| `B03` | `home.hamlet:npc:16` | Hazel Bowman — canonical | she/her/her | `hunter` | Their child; G03 actor, not a worker or guard |

Eight occupied homes contain **1+3+3+2+2+1+2+3 = 17** people; the `sale` plot contains none. The four `reservedId`s remain exactly as in `src/game/data/npc/reserved.ts`. A proposed numeric reservation is not evidence that its `NpcDef`, household, schedule, ownership or saved agent exists.

## Outside Saltmere and uncast slots

| Authored key or role slot | Name, pronouns and identity boundary | `NpcId` boundary |
|---|---|---|
| `miles_hewer` | Miles Hewer, he/him/his; external father and husband | Allocate only when the actual external Hewer home is authored; forbid `home.hamlet:npc:*` |
| `lucy_hewer` | Lucy Hewer, she/her/her; external mother and wife | Same external-home gate; never Q07's Saltmere host |
| `matthew_hewer` | Matthew Hewer, he/him/his; adult son, optional Q06 traveller | Same external-home gate; travel does not create a duplicate |
| `joan_hewer` | Joan Hewer, she/her/her; member of that same external family, not E01 | Same external-home gate; no local elder alias |
| `bernard_smith`, `sophie_smith` | Bernard Smith, he/him/his, and Sophie Smith, she/her/her; external father/daughter pair | Allocate only when their external site is selected; neither is S01 |
| `piers` | Piers, he/him/his; travelling G01 thief, not a starting resident | Allocate on actual visitor admission |
| `ruth_role`, `parcel_smith_role`, `cedric_role`, `boar_hunter_role`, `chronicle_specialist_role`, `hunter_circle_role` | Explicit uncast roles; names/pronouns remain unknown until casting; source titles do not add people | No `NpcId` or generated local slot before episode casting |

External actors and role slots never enter the Saltmere starting generator to make a quest scene work. Their future IDs must be stable once a real actor is admitted, and a visitor's dialogue remains bound to that actor when they travel.

## Legacy name migration for authored text

| Reference text token or premise | Current authored target | Rule |
|---|---|---|
| V1 `Marek`, `Marek Hornblower` | `G01` Mark Hornblower | Keep quest definition IDs such as `woda-dla-marka`; new display text uses Mark |
| V1 `Kasia`, `Kasia Hornblower` | `G02` Kate Hornblower | `shells-dla-kasi` and `sprawdz-szlak` retain source IDs, not old dialogue names |
| V1 `Anna`, `Anna Leśniewska` | `W01` Ann Woodward | Do not create a separate Anna for old Woodward stories |
| V1 `Piotr`, `Piotr Leśniewski` | `W02` Peter Woodward | Home is `farmer`, not the visually named `woodcutter` plot |
| Old local Miles/Lucy/Matthew/Joan Hewer premises | External Hewer keys | No Saltmere occupancy; Q07 is hosted by Ann/Peter Woodward |
| Imported `Ruth` as Q14 giver | `ruth_role` pending casting | Do not alias E01 or Joan or pin the given name before Q14 selection |

For a selected script, the editorial audit searches its legacy source for old names, titles, pronoun tokens, house references and named rewards; replacement dialogue is written anew after the actual cast and site are fixed. The [preliminary shortlist](q3-preliminary-candidates.md) records the first such audit.

## M4 acceptance handoff

1. Validate exactly the 17 explicit `actorKey`→`NpcId`→home rows and four reserved IDs; reject collisions with generated people and external actors.
2. Apply authored first/surname and pronouns to the same `NpcDef` before display, while leaving its own seeded abilities stable. `spouseOf` is only a profession hint; household/kin comes from the canonical roster.
3. Save/reload preserves actor identity and position. New Game may place a new actor by schedule; load must not regenerate, duplicate or teleport them to a schedule slot.
4. Resolve M4 dialogue speaker keys through this one binding; missing external/unselected role returns unavailable, never a fallback name match.
5. Batch the four working names and two working pronoun choices with Q-026 at the normal author taste review. A name change leaves `actorKey`, `NpcId`, journal/line IDs and save identity intact.

# Peter and Ann Woodward — character profiles and marriage dynamic

**Status:** author-approved editorial characterization; no runtime or visual asset changes  
**Created at:** 2026-10-24  
**Created by:** ChatGPT GPT-6  
**Domain:** NPC character, dialogue, quests, visual direction  
**Identity:** `W02` / `peter_woodward` and `W01` / `ann_woodward`

## Core premise

The Woodwards are an ordinary working Saltmere household, not exaggerated comic characters, heroes or moral opposites. Peter, 36, is a woodcutter; Ann, 32, is a farmer. They are married and share the canonical `farmer` home slot (Peter does not live in the `woodcutter` plot). Their everyday concerns are tools, timber, food, repairs, neighbours and making a living.

Both are capable and decent, but they differ in how widely they define their responsibilities. Their disagreements should be grounded in genuine competing needs, not a selfish-husband / virtuous-wife caricature.

## Peter — practical, family-first, short-sighted

Peter is an ordinary, hard-working woodsman who knows timber, tools, carting and sound repairs. His first concern is whether his family can get by and whether their property and work equipment will hold up. He is loyal and dependable at home. His self-interest is not calculated cruelty: in his own eyes he is simply doing the sensible thing and protecting the people whose welfare is his responsibility.

- **Strengths:** industrious, practical, capable with his hands, economical with materials, loyal to Ann, willing to help when the cost is reasonable.
- **Flaws:** somewhat short-sighted about knock-on effects, stubborn, reluctant to sacrifice his own household's resources for abstract communal benefits, inclined to overvalue the immediate problem he can see.
- **Social temperament:** fairly ordinary and approachable, not a hermit, heroic stoic or loud tavern entertainer. May chat or joke casually; neither relentlessly taciturn nor aggressively outspoken.
- **Decision style:** asks what a plan costs, what materials are needed and who will do the work. A concrete demonstration carries more weight than a lofty appeal.
- **Humour:** small, everyday observations and mildly self-serving excuses, not a signature barrage of one-liners or boisterous bravado.

Peter's `Close-mouthed` / `Diligent` authored traits and `energetic` quirk remain the current simulation values; do not read these as permission to portray him as a copy of Mark. Compared with Mark's perceptive, restrained sense of public duty, Peter has a narrower, domestic horizon and a less principled or strategic way of sizing up a situation. He need not be unintelligent, dishonest or unpleasant.

## Ann — energetic, talkative, community-minded

Ann is an energetic, capable farmer and household organiser who is **actively involved in the life of the entire settlement**. She talks readily with neighbours, knows whom to ask for help, joins common efforts, keeps track of supplies and can turn a concern into a practical plan. She welcomes company and is comfortable starting conversations, but her interest in people comes from responsibility and participation rather than Kate's trader-oriented social curiosity.

- **Strengths:** warm, sociable, engaged, industrious, orderly, resourceful, attentive to other households and communal needs.
- **Flaws:** tends to worry, overcommits herself, can be demanding or stubborn when people neglect shared work, sometimes expects Peter to see distant collective risks as clearly as she does.
- **Social temperament:** conversational and proactive, happy to organise neighbours or host a meal; not a gossip caricature or an all-knowing village information hub.
- **Decision style:** considers who else will be affected next week, whether supplies will last and whether neighbours can solve a problem together.
- **Humour:** warm, lively and occasionally gently teasing, especially with Peter; avoid making her a scolding-wife stock character.

Ann's current `Helpful` / `Orderly` traits and `fast_worker` quirk remain simulation data. Her **energy, talkativeness and community engagement are approved editorial direction**, not a silent rewrite of Big Five, quirks or scheduling. Review those runtime values separately if later behaviour contradicts authored character.

## Marriage — two reasonable but incomplete perspectives

Peter sees the household first; Ann sees the household **and** its neighbours. Neither is automatically correct. Peter's logging cart matters to his work and thus can serve the village too; Ann's communal pasture fence protects more than their own property. They can disagree about *priority* without making it a marital feud.

- Peter grounds Ann's expansive commitments in limited labour, fuel, money and time.
- Ann challenges Peter to consider consequences outside their own doorstep.
- Both share work, a home and ordinary affection. He shows care through doing and repairing; she through planning, noticing needs and bringing people together.
- Their differences create believable tension, small domestic humour and opportunities to compromise; neither spouse is a foolish foil for the other.
- Their marriage is a canonical relationship, not guaranteed positive opinion, automatic knowledge of the other's conversations or permission to override real schedules.

**Illustrative English tone samples only — not approved runtime lines, quest conditions or Fish Audio requests:**
- Peter, on a genuinely damaged cart: “The fence needs mending, I know. But I can't haul timber on a broken wheel.”
- Ann, discussing communal work: “It isn't only our pasture. If we leave it, three households will have trouble by winter.”
- Peter, in a friendly private exchange: “Ann's got a plan for the whole village. I've still got the gate to fix.”
- Ann, teasing him after an actual completed repair: “There. Was that as terrible as you said it would be?”

Do not use these lines unless their concrete claims are established by actual world state and speaker knowledge.

## Dialogue, quests and continuity

**Voice:** Peter speaks plainly and concretely, using work, materials and immediate consequences. Ann speaks naturally, warmly, at a livelier pace and with more invitations, questions and references to communal life. She may initiate conversations; he may respond with a specific practical concern. Both can listen, change their minds and occasionally make mistakes. Do not simply replay the Mark/Kate quiet-versus-talkative dynamic: the Woodwards' central difference is **household-first versus community-wide priorities**, not merely volume of speech.

Apply this perspective to accepted narrative decisions, without adding new incidents or modifying outcomes:
- **D-QUEST-22 timber priority:** Peter's cart and Ann's communal pasture fence are separate real repair targets. Both sides have practical merit; the second request remains possible.
- **D-QUEST-38 household repairs and storm:** fence, foundation and roof are distinct; the storm and damage follow the existing accepted world-state contract.
- **D-QUEST-28 Q07 supper:** Ann's energy and hospitality can shape preparations, but Peter has legitimate work obligations. Guests and resource use depend on real state.
- **D-QUEST-37 message:** Ann can ask the player to carry an actual message while apart; reunion and schedules are not frozen for the story.
- **D-QUEST-36 scouting / D-QUEST-34 tower:** Peter's practical forest knowledge and attention to useful evidence motivate his requests, not sudden amateur detective heroism.

Keep the separate retired V1 `stare-ruiny` and `ziola-dla-anny` quests retired; imported V1/V2 wording is reference, not current characterization authority. Existing daily conversation drafts are not automatically rewritten or voiced by this profile.

## Visual direction — editorial target only

**Peter:** credible 36-year-old working woodcutter, sturdy from physical labour rather than heroic musculature. Practical roughened hands, weathered but ordinary face, functional earth-toned work clothes and worn tools. His appearance should read as an everyday villager, not an intimidating warrior, dwarf-like comic bruiser or flamboyant adventurer.

**Ann:** credible 32-year-old active farmer and participant in village life; alert, expressive, approachable, comfortable speaking with neighbours. Work-worn yet cared-for clothing suitable for gardening, stores and domestic work; practical silhouette, not ornamental noble dress. Energy should show in posture and expression rather than an exaggerated costume.

No actor likeness is selected. This brief does not claim portraits or 3D assets exist.

## Authority and integration

Canonical identities, ages, professions and current trait values are governed by `src/game/data/npc/reserved.ts`; household and cast by `docs/world/areas/home-population.md` and `docs/quests/canon/q0-cast-and-names.md`. Accepted quest decisions own quest facts, consequences and timing. Simulation, knowledge, relationship and scheduling systems own actual eligibility and effects.

This document is an **editorial reference**, not a new personality engine, quest implementation, audio casting or source of unconditional NPC knowledge. Review future player dialogue, NPC pair banter, Fish Audio scripts and visual proposals against these profiles before production.

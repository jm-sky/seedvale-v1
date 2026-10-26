# Mark Hornblower — character profile and Kate contrast

**Status:** author-approved characterization direction; visual details are concept targets, not implemented 3D assets  
**Created at:** 2026-10-24  
**Created by:** ChatGPT GPT-6  
**Domain:** authored NPC character, dialogue, quests, visual direction  
**Identity:** `G01` / `mark_hornblower`; spouse `G02` / `kate_hornblower`

## Creative anchor

Mark, 38, is Saltmere's ordinary daytime guard, not a knight, mercenary or reluctant epic hero. An honest, grounded, quietly capable man who sees more than he says. He takes people and duty seriously without taking himself too seriously. Somewhat reserved, never a recluse: he is polite to strangers, gradually warmer with familiar people, and shows care through practical advice and action rather than declarations.

**Film-performance reference blend (qualities, not likeness):**
- Harrison Ford / Han Solo: understated dry wit, half-smile, quick social intelligence, warmth hidden beneath irony; omit swagger and recklessness.
- Sean Bean / Richard Sharpe: lived-in competence, practical judgement, skepticism toward pretension; omit habitual aggression and militarized bravado.
- Harrison Ford / John Book (*Witness*): watchfulness, restraint, honesty and moral steadiness; omit contemporary police mannerisms.

These are editorial reference points, **not** instructions to recreate an actor's face, voice, costume or a movie character.

## Personality and contradictions

- **Honest without being gullible:** keeps his word, notices inconsistencies and quietly tests a story before accusing anyone. Never cheats weaker people.
- **Simple-spoken, not simple-minded:** concise and concrete, understands motives and everyday tradeoffs, has no interest in sounding learned.
- **Serious but not solemn:** safeguards the village with diligence and calm; tolerates small human foolishness and smiles at absurdity.
- **Clever but not scheming:** solves ordinary problems with observation, patience and local knowledge, rather than tricks at others' expense.
- **Reserved but sociable:** doesn't volunteer intimate feelings, yet listens well, remembers details and can enjoy company.
- **Dependable, not infallible:** sometimes overcautious, slow to share worries, particular about order, stubborn when convinced he is right, and inclined to shoulder too much alone.

In emergencies he becomes shorter, firmer and more decisive, not quippy. He uses humor when safe, never to trivialize real distress.

## Dialogue performance

Voice: grounded, understated, observant, warm beneath a slightly weathered manner. Short natural English, concrete nouns, rarely abstract moral speeches. His humor is a dry observation, self-deprecation or a gentle jab at someone he knows well; an occasional crooked smile, not a continuous stream of punchlines. Care appears in advice and follow-through. Avoid generic guard commands, theatrical threats, cynical cruelty, modern sitcom banter and repetitive references to his wife.

**New sample lines — tone examples only, NOT approved runtime lines, Fish requests or unconditional world-state claims:**
- On a *verified* escaped goat incident: “That goat got out again. At this point, I think it likes an audience.”
- In a private, friendly aside: “Kate says I don't talk enough. I told her someone's got to listen.”
- On a safely quiet watch, if the actual situation warrants it: “A quiet day is a good day. The geese might disagree.”
- General advice when asked: “Keep to a path you can find again. Pride won't guide you home.”

Lines dependent on an event, mood, relationship, schedule or perceived danger must be gated by existing real state providers; never imply unobserved knowledge. This profile is **editorial guidance**, not a new dialogue resolver, trait engine, quest state or voice contract. Existing six recorded Mark clips remain valid until explicitly reviewed for replacements.

## Mark and Kate — complementary, not caricatures

Kate, 34, is a warm, perceptive, talkative trader and night owl. She more readily opens conversations, asks direct questions, remembers what matters to people, and can be firm in fair deals. Mark listens first, answers selectively, and notices practical or physical details. **Both** are intelligent, principled and socially perceptive; neither is a clever spouse paired with a foolish one.

- Kate often starts a conversation; Mark may cap it with one apt observation.
- Kate can coax Mark toward company; he respects her social skill rather than resenting it.
- They tease each other affectionately about his watchfulness and her talkativeness, without a fixed “nagging wife / henpecked husband” gag.
- When they disagree, both have understandable reasons. Her warmth does not override trade boundaries; his caution does not make him controlling.
- Their marriage is an established relationship, **not** automatic mind-reading, shared current knowledge or a guaranteed positive relationship score. Dialogue about the other spouse requires appropriate context and knowledge.

**Illustrative paired voice, not shippable script:**
- Kate: “He notices everything and then acts as if he's said nothing at all.”
- Mark: “Kate gets people talking. Most times, they're glad of it.”

Write both characters as independent people with duties, needs, agency and room for imperfect days.

## Character visual references — Mark and Kate

- [Mark Hornblower — character reference](../assets/characters/mark-hornblower-character-reference.png)
- [Kate Hornblower — variant 3 reference](../assets/characters/kate-hornblower-reference.png) — full [canonical visual profile](kate-hornblower-visual-profile.md).

Both are concept images and visual direction, **not** claims of implemented game models.

## Visual direction — Mark

A believable 38-year-old working village guard: rugged, slightly tired yet approachable. Defined but unglamorous face and jaw; alert, intelligent, kindly eyes with faint weather and sun lines; short practical medium-to-dark brown hair, light stubble, weathered but generally cared-for skin. A restrained, asymmetric half-smile rather than a wide grin. Fit, solid, functional build from walking, standing guard and ordinary physical work, not an oversized warrior's physique. Economical gestures, stable posture.

Clothing: worn-but-maintained layered wool and leather, practical belt and muted earthy hues (browns, greys, weathered green or blue). Modest locally appropriate guard equipment, no ceremonial armor, heroic costume or ornate fantasy gear. His silhouette should read “trusted settlement watchman” before “fighter.”

**Art guardrails:** realistic human proportions, understated natural expression, visible age and lived-in details; avoid polished fashion-model beauty, excessive grime, stylized scars and direct actor likeness. This is a design brief for later portrait/3D work, **not** a claim that any model or asset has been generated or approved.

## Integration and authority

- Identity, age, occupation and existing Big Five/quirk values remain governed by `src/game/data/npc/reserved.ts`, Q0 and accepted decisions; this editorial profile does **not** mutate simulation values.
- Existing authored lines and their contextual eligibility remain in [Hornblower dialogue pack](saltmere-hornblowers-dialogue-pack.md). Review consistency with this profile before future rewrites and Fish Audio batches.
- Quest writers should use Mark's integrity, everyday cleverness and practical concern without introducing extra quests, rewards, incidents, knowledge or universal availability.
- Mark's ordinary watch is daytime; actual availability and the couple's interactions depend on scheduling, social and perception systems. Do not use this narrative to bypass runtime gates.

# Q137 — NPC rumour line script

**Date:** 2026-11-06 · **Writer:** GPT Astra  
**Status:** **APPROVED by the author on 2026-11-06 — Q137 complete.**
**Scope:** [world-041 L4](../../plans/world-041-landmark-catalog-and-rumour-leads.md#slices-provisional), for later Q138 integration. Approved English dialogue and uncertain map labels only; no runtime, selection, range, radius, save or quest changes.

The adult voice is plain and conversational. Guards are measured; hunters are practical. Neither claims to have visited a place, patrolled a route or spoken to a witness. A little dry humour belongs in optional variants, without making every speaker a comedian. These are rumours about real eligible catalog entries, not invented legends.

## 1. Approval boundary and verified seams

- The [approved voice direction, §12](./2026-10-31--npc-voices-dialogue-audit.md#12-author-decisions--approved-2026-10-31-supersedes-open-questions-in-11) requires English NPC dialogue, stable voices, selected personality variants and truthful living-world speech. This script does not authorize a wider UI translation or audio production.
- Today, [`aboutAreaLine`](../../../src/ai/dialogueTemplates.ts) takes resolved names and returns Polish discovery text. [`guardLocalKnowledge`](../../../src/world/locations/guardLocalKnowledge.ts) and [`npcPlayerFollowUpDelivery`](../../../src/world/locations/npcPlayerFollowUpDelivery.ts) still reveal `discovered`. These lines are **not** compatible with merely swapping that text: Q138 must deliver an `estimated` result through the existing owner first.
- [`NpcDialogueMenu`](../../../src/ui-vue/NpcDialogueMenu.vue) currently exposes the topic to the home guard and adult hunters. [`inventoryWiring`](../../../src/app/inventoryWiring.ts) passes the player's position on asking. The persisted [`NpcPlayerFollowUp`](../../../src/ai/npcPlayerFollowUp.ts) has selected IDs and a `guard | hunter` source, but **no original position**. Ordinary-adult voice selection below is a proposed presentation classification, not an instruction to add a persisted source variant.
- Current candidate wording covers only L0 §5's **cave, ruins, lake, mountainPeak and cemetery**. `abandonedMine`, `settlement` and quest `searchArea` are not added to that pool. The separate nearest-settlement answer is outside this script.
- `landform` and `waterfall` are absent from today's [`WorldLocationKind`](../../../src/world/locations/worldLocationTypes.ts). Their copy in §4 stays dormant until L1 supplies eligible records and the corresponding discovery rules.
- The [L3a notes](../../plans/implementation-notes/world-041-landmark-catalog-and-rumour-leads-implementation-notes.md) leave radius provenance unresolved. **Q136-a remains open.** Guard/hunter wording never promises a smaller circle, an exact spot, a wider range or greater certainty. Better data and farther reach remain Q138's separately gated responsibility.

## 2. Proposed text adapter contract — not an existing API

Stable IDs below identify complete authored alternatives. Braces are literal interpolation slots. The formatter receives only approved, display-safe data; it must never receive a proper name or canonical target coordinates.

| Slot | Exact text contract | Source / limitation |
| --- | --- | --- |
| `{bearing}` | One lowercase word: `north`, `north-east`, `east`, `south-east`, `south`, `south-west`, `west`, `north-west`. No article, preposition or punctuation. | Eight-sector bearing from the **current conversation origin to the permitted uncertain-area centre**, using the world's existing compass convention. Never the canonical landmark. |
| `{travelTime}` | Complete approximate noun phrase, e.g. `about six hours' walk`, `about an hour's walk`, `less than an hour's walk`. No `from here`, terminal punctuation, kilometres, metres, decimals or clock time. | Presentation-only approximation of `worldUnitsToHours` applied to the same origin and uncertain-area centre. This is a rough distance in walking hours, not a routed ETA or a promise of a passable path. |
| `{place}` | One of `a cave`, `ruins`, `a lake`, `a mountain peak`, `a burial ground`; later, only with §4's gates: `a crag`, `a ridge summit`, `a crater`, `an island in a lake`, `a waterfall`. | Used only in the nearby fallback. The article is included; `ruins` remains plural. Never use `WorldLocation.name` or free-form generated prose. |

**Proposed formatter detail for Q138 review:** first, if the raw converted distance is below one hour, render `less than an hour's walk`. Otherwise round to the nearest whole walking hour; render one as `about an hour's walk` and larger values as `about … hours' walk`. Spell the number in English. This is a draft display convention, **not approval of a producer band, travel-speed change or gameplay threshold**. Do not clamp it to the originally searched band: a deferred conversation may happen elsewhere.

**Origin and disclosure:** all uses of “here” mean where this conversation is taking place **when the line is delivered**. Recompute both slots together on a delayed/manual/proactive delivery. The original research origin can continue to govern the existing search; it must not silently govern these spoken directions. Obtain geometry from the same allowed projection as [`mapData.resolveKnown`](../../../src/world/map/mapData.ts), following [review 031 F3](../../reviews/2026-11-04--031--geography-revival-g1-g9-critical-architecture-review.md#f3--p1--estimated-knowledge-currently-reveals-the-true-target-generic-landmark-arrival-is-missing). Do not create a second uncertainty calculation or derive more revealing speech from the canonical target. Reading the projected centre repeatedly reveals no additional target geometry.

**Degenerate or missing data:** if the verified uncertain area contains the conversation origin, §3's nearby fallback can replace direction/time wording; it makes no invented compass claim or zero-hour promise. Otherwise both normal slots are required. Missing/non-finite geometry, an unavailable conversation origin or an unsupported kind is an integration error: do not announce success, invent a direction or mislabel it as “no candidate.” Resolve the data through the existing owner before committing/delivering the result. No new retry or persistence policy is specified here.

Each successful reply is **one** selected line, without an added map tutorial or repeated uncertainty suffix. Q138 owns deterministic text-variant selection consistent with L0; no such rumour formatter exists today. These variants must not affect candidate selection or consume additional leads. `A` is the ordinary-adult pool, also a fallback for either specialist. `G` is guard-only; `H` is hunter-only. Do not concatenate them. The second `A` variant offers light character, not a mandatory four-personality matrix; existing personality may select an appropriate variant without adding a trait.

## 3. Successful rumours — current candidate kinds

Every normal success line gives a generic kind, a compass sector and rough walking hours. Its uncertainty concerns the location; it does not invent danger, inhabitants, treasure, architecture or history.

| Stable line ID | Speaker / kind | Exact English text |
| --- | --- | --- |
| `RUM.CAVE.A.01` | Adult · cave | I've heard there's a cave somewhere to the {bearing}, {travelTime} from here. I couldn't tell you just where. |
| `RUM.CAVE.A.02` | Adult · cave | A cave, they say, out to the {bearing}. It's {travelTime} from here, give or take. You'll have some looking to do. |
| `RUM.CAVE.G.01` | Guard · cave | There may be a cave to the {bearing}, {travelTime} from here. I can give you the direction, but not the entrance. |
| `RUM.CAVE.H.01` | Hunter · cave | Try the country to the {bearing}, {travelTime} from here. There's talk of a cave somewhere out that way. |
| `RUM.RUINS.A.01` | Adult · ruins | They say there are ruins to the {bearing}, {travelTime} from here. Whereabouts, I couldn't say. |
| `RUM.RUINS.A.02` | Adult · ruins | I've heard of ruins somewhere to the {bearing}, {travelTime} from here. I'd be curious to know what's left of them. |
| `RUM.RUINS.G.01` | Guard · ruins | There are said to be ruins to the {bearing}, {travelTime} from here. That's as close as I can place them. |
| `RUM.RUINS.H.01` | Hunter · ruins | Look out to the {bearing}, {travelTime} from here. You may find ruins in that country; I can't narrow it down further. |
| `RUM.LAKE.A.01` | Adult · lake | I've heard there's a lake to the {bearing}, {travelTime} from here. Somewhere in that part of the country. |
| `RUM.LAKE.A.02` | Adult · lake | A lake, somewhere to the {bearing}—that's what I've heard. It's {travelTime} from here. I wish I had better directions for you. |
| `RUM.LAKE.G.01` | Guard · lake | There is said to be a lake to the {bearing}, {travelTime} from here. I can point you towards the area, no closer. |
| `RUM.LAKE.H.01` | Hunter · lake | There's talk of a lake out to the {bearing}, {travelTime} from here. You'll have to find the shore yourself. |
| `RUM.PEAK.A.01` | Adult · mountainPeak | They speak of a mountain peak to the {bearing}, {travelTime} from here. I couldn't pick it out for you. |
| `RUM.PEAK.A.02` | Adult · mountainPeak | I've heard of a peak somewhere to the {bearing}, {travelTime} from here. The tale is rather clearer than the directions. |
| `RUM.PEAK.G.01` | Guard · mountainPeak | A mountain peak is said to lie to the {bearing}, {travelTime} from here. I can give you the area, not the way up. |
| `RUM.PEAK.H.01` | Hunter · mountainPeak | There's said to be a peak out to the {bearing}, {travelTime} from here. That's where I'd begin looking. |
| `RUM.CEMETERY.A.01` | Adult · cemetery | I've heard of a burial ground to the {bearing}, {travelTime} from here. I don't know the exact spot. |
| `RUM.CEMETERY.A.02` | Adult · cemetery | There may be a burial ground somewhere to the {bearing}, {travelTime} from here. That's all I can tell you of it. |
| `RUM.CEMETERY.G.01` | Guard · cemetery | A burial ground is said to lie to the {bearing}, {travelTime} from here. I can only point you towards that part of the country. |
| `RUM.CEMETERY.H.01` | Hunter · cemetery | Try looking to the {bearing}, {travelTime} from here. I've heard there's a burial ground somewhere out that way. |
| `RUM.NEAR.A.01` | Any adult · verified area contains current origin only | I've heard of {place} somewhere round here. You'll still have to look for it. |

“Burial ground” deliberately works for an active settlement cemetery and an abandoned one. No line calls it forgotten, haunted, overgrown or disused. “Ruins” does not imply a castle, a tower or a former owner. Peak wording does not promise visibility or a climbable approach.

## 4. Reserved future successes — not Q138 candidate authorization

These use the same slots and can be spoken by any adult. One line per kind/subtype is enough until actual landmark records and their presentation can be reviewed. Do not substitute future details into a present coarse `mountainPeak` or `lake` record.

| Stable line ID | Required verified catalog fact / release gate | Exact English text |
| --- | --- | --- |
| `RUM.CRAG.A.01` | L1 `landform` with `crag` subtype; dry-relief gate | They say there's a crag to the {bearing}, {travelTime} from here. I couldn't place it more closely. |
| `RUM.RIDGE.A.01` | L1 `landform` with `spineSummit` subtype; dry-relief gate | I've heard of a ridge summit to the {bearing}, {travelTime} from here. Somewhere out that way; I don't know the approach. |
| `RUM.CRATER.A.01` | L1 `landform` with `crater` subtype and its applicable geography gate | They speak of a hollow in the earth to the {bearing}, {travelTime} from here. A crater, by the sound of it. I can't give you the spot. |
| `RUM.ISLAND.A.01` | L1 `landform` with `lakeIsland` subtype; frozen hydrology and verified lake relationship | There's said to be an island in a lake to the {bearing}, {travelTime} from here. I know only the general direction. |
| `RUM.WATERFALL.A.01` | L1 `waterfall`, after 064 W1 and the relevant arrival rule | I've heard of a waterfall out to the {bearing}, {travelTime} from here. You'll have to search that area for it. |

The crater line asserts neither a lake nor a volcanic/impact origin. The island line promises neither a crossing nor dry access. The waterfall line promises neither audible water nor a particular river. No generic “landform” spoken fallback is needed: if the subtype is not understood, do not activate these lines.

**Route/hydrology enrichment:** none is included in this draft. The existing rumour seam passes IDs/names, not a verified route or water relationship. “Follow the river,” “beyond the bridge,” “upstream,” bank directions, paths and travel hazards must not be inferred from a kind, bearing or proximity. Adding such wording later requires both a truthful data contract and newly approved Astra copy. Q140's planned footpaths are not evidence that a path exists.

## 5. Replies without a new lead

Outcome selection belongs to Q138, not the text function. These rows do not establish gate precedence, a trust threshold, a cap value or a reset policy. Do not use one outcome's wording as a generic fallback for another.

| Stable line ID | Exact trigger / speaker | Exact English text |
| --- | --- | --- |
| `RUM.TRUST.A.01` | Trust gate refuses · any adult | I'd rather keep what I know to myself for now. |
| `RUM.TRUST.A.02` | Trust gate refuses · reserved adult | Forgive me, but I'm not ready to share that with you. |
| `RUM.TRUST.G.01` | Trust gate refuses · guard | I'll keep my counsel on that for now. |
| `RUM.TRUST.H.01` | Trust gate refuses · hunter | I don't give directions to just anyone. Nothing more to say for now. |
| `RUM.CAP.A.01` | Open-lead cap actually blocks a new lead · any adult | You've still got places to look for. See what you make of those first. |
| `RUM.CAP.A.02` | Open-lead cap actually blocks a new lead · dry adult | One tale at a time. You'll wear out your boots chasing them all. |
| `RUM.CAP.G.01` | Open-lead cap actually blocks a new lead · guard | Follow up the places you've heard of first. You've enough to be going on with. |
| `RUM.CAP.H.01` | Open-lead cap actually blocks a new lead · hunter | Find one of the places you're already looking for. Another rumour can wait. |
| `RUM.NONE.A.01` | Eligible candidate pool is empty · any adult | Nothing comes to mind that would help you. |
| `RUM.NONE.A.02` | Eligible candidate pool is empty · any adult | I don't know of a place I could point you towards. |
| `RUM.NONE.G.01` | Eligible candidate pool is empty · guard | I've nothing useful to tell you about the country. |
| `RUM.NONE.H.01` | Eligible candidate pool is empty · hunter | I can't give you a lead. I'd only be guessing. |
| `RUM.DAILY.A.01` | Today's deterministic candidate is already known, including an existing estimate · any adult | I've nothing else to tell you today. |
| `RUM.DAILY.A.02` | Same daily condition · dry adult | I could dress it up, but I've nothing new to tell you today. |
| `RUM.DAILY.G.01` | Same daily condition · guard | Nothing new today. That's all I have for you. |
| `RUM.DAILY.H.01` | Same daily condition · hunter | No fresh lead today. I can't add anything to what you know. |
| `RUM.CHILD.NONE.01` | Child · **only if this topic is exposed** | I don't know. You'll have to ask someone else. |
| `RUM.CHILD.NONE.02` | Child · **only if this topic is exposed** | I couldn't tell you where to look. |

Trust replies do not claim an individual friendship history: the planned gate reads settlement trust. Cap replies acknowledge outstanding searches without claiming this NPC supplied them, naming them, giving a number or inventing a tracked conversation. The daily lines neither identify the known target nor guarantee a new rumour tomorrow. Children receive no candidate, direction, reveal or deferred promise; their topic visibility remains an integration decision.

## 6. Conditional deferred-research copy

Use this section **only if Q138 retains the existing research/follow-up seam and delay**. The present delay is one game hour (`GUARD_LOCAL_KNOWLEDGE_DELAY_DAYS`). The “hour” below depends on that value remaining true. Do not introduce a wait just to use these lines.

| Stable line ID | State / speaker | Exact English text |
| --- | --- | --- |
| `RUM.WAIT.START.A.01` | Request accepted · any adult | Let me think on it. Ask me again in an hour. |
| `RUM.WAIT.START.G.01` | Request accepted · guard | Give me an hour to think it over. I'd rather not send you the wrong way. |
| `RUM.WAIT.START.H.01` | Request accepted · hunter | Let me think. There's little use in muddled directions. Ask me again in an hour. |
| `RUM.WAIT.PENDING.A.01` | Research/delay genuinely pending · any adult | I haven't an answer for you yet. Give me a little longer. |
| `RUM.WAIT.PENDING.G.01` | Research/delay genuinely pending · guard | Not yet. I still need a little time. |
| `RUM.WAIT.PENDING.H.01` | Research/delay genuinely pending · hunter | I'm still thinking it over. Ask me a little later. |
| `RUM.WAIT.READY.A.01` | Delivery is ready · any adult | You asked me about the country. |
| `RUM.WAIT.READY.G.01` | Delivery is ready · guard | About your question earlier. |
| `RUM.WAIT.READY.H.01` | Delivery is ready · hunter | I've had a chance to think about what you asked. |

`READY` is an **optional spoken prefix**, followed once by the actual success or non-success result. It is not evidence of a new lead by itself. The current `GUARD_AREA_RESEARCH_READY` is normally swallowed by immediate shared-seam delivery; preserve that behaviour unless a visible prefix is deliberately needed. Do not emit the prefix twice across manual and proactive delivery. None promises written reports, a patrol, a conversation with other NPCs or research activity the simulation has not performed.

After waiting, resolve the actual result again: an already-known candidate uses `DAILY`; an empty valid pool uses `NONE`; an applicable cap or trust block uses its own row. A stale/unresolvable target may use `NONE` only when the owner has determined that no valid candidate remains. A technical exception is not a diegetic “nothing found” event. The existing missing-NPC-state/failed-arm fallback must not be blindly relabelled as “still thinking”; it does not establish that research is in progress. Consumption, retry and migrated pending deliveries remain Q138 ownership questions, not decisions made by this script.

## 7. Player topic and uncertain map labels — separate approval

| Stable text ID | Surface | Proposed English text |
| --- | --- | --- |
| `RUM.TOPIC.PLAYER.01` | This topic's option and player utterance | Have you heard of any places worth finding? |
| `RUM.LABEL.CAVE.01` | Estimated cave | Rumoured cave |
| `RUM.LABEL.RUINS.01` | Estimated ruins | Rumoured ruins |
| `RUM.LABEL.LAKE.01` | Estimated lake | Rumoured lake |
| `RUM.LABEL.PEAK.01` | Estimated mountainPeak | Rumoured peak |
| `RUM.LABEL.CEMETERY.01` | Estimated cemetery | Rumoured burial ground |
| `RUM.LABEL.LANDFORM.01` | Future estimated landform, after L1 | Rumoured landmark |
| `RUM.LABEL.WATERFALL.01` | Future estimated waterfall, after L1 | Rumoured waterfall |

**Q136-b approved by the author, 2026-11-06:** this bounded English label set and the English topic are approved. “Rumoured” makes uncertainty explicit even when the label appears without its circle. These are UI strings, not spoken suffixes or proper names. Discovered/confirmed locations retain their canonical names; existing `settlement`, `abandonedMine` and `searchArea` labels are outside this proposal. The current [`genericLocationLabel`](../../../src/world/locations/rumourLead.ts) covers every estimated kind, so Q138 must respect that narrower approval when wiring the labels. The current Polish labels remain in runtime until Q138 integrates the approved set.

## 8. Editorial and handoff checks

Editorial pass completed on this draft:

- Read the complete present-kind lines with `north-east` / `about six hours' walk`, then the singular and under-one-hour forms. Slots carry their own agreed grammar; no `a ruins`, doubled articles or hour plural errors. Nearby wording takes the separate bounded `{place}` slot.
- Removed report/patrol claims and landmark decorations that the owner cannot substantiate. Kept humour away from burial grounds. Reserved crag/ridge/crater/island/waterfall claims are explicitly gated.
- Kept uncertainty inside each complete success, rather than stacking a profession preface, kind sentence and stock disclaimer. Repeated kind/direction/time vocabulary remains deliberately clear; the optional alternatives vary cadence without creating a large combinatorial bank.
- Checked refusal, cap, no-candidate and daily-known wording separately. Removed a “telling it twice” variant: today's candidate may already be known from another source before the player's first conversation with this NPC. None spends coins, offers a quest/reward, resets a lead, promises new information tomorrow or exposes a known target's name.
- Checked deferred “here” against the missing origin in persisted follow-ups. The proposed delivery-time projection contract avoids reusing stale directions. No save field or radius tier was selected.

For Q138 integration: preserve the line IDs; exercise every selected outcome and both compass/hour grammatical boundaries, a moved-NPC deferred delivery, an area containing the speaker/player, stale IDs and duplicate delivery. Check that map, text and navigation agree on the same uncertain area and that name-bearing legacy replies are not used on the rumour path. Check quest dependencies before changing today's exact reveals, as the plan requires. These are handoff acceptance cases, **not tests run in Q137**.

**Author approval recorded (2026-11-06):** the author accepted (1) dialogue/topic wording, including the reserved lines as conditional copy, and (2) the separate Q136-b English labels. Q137 is complete. Q136-a, Q138 mechanics, future-kind activation and audio remain outside that approval. No runtime or browser verification is claimed; no implementation is included.

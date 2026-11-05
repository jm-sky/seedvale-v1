# Named NPC voice and barks — targeted recon and writing pass

**2026-11-05 · documentation only · draft text, no new casting decisions**  
**Source:** V1 main `2722c78ab6d79b3312d78877f9b96140fd97ddb1`.

[Fish script (Markdown)](./2026-11-05--named-npc-voice-script.md) · [Fish script (JSON)](./2026-11-05--named-npc-voice-script.json) · [Reuse / QC blockers](./2026-11-05--named-npc-voice-reuse-qc.md) · [Queue](./AUTONOMOUS-SESSION-QUEUE.md)

## Findings and authority

Current code still resolves role/gender pools and then general pools. `voiceProfileIdFor` returns a scope, and `resolveNpcVoiceLineWithManifest` does not use that field to restrict a speaker. No named overrides exist in the manifest. **Approved casting is not implemented named runtime assignment.** Do not register this packet into that resolver and assume speaker safety; Q88 remains a prerequisite.

The ledger has **317 unique rows, all pending, zero passes**; 109 are directly under `public/sounds/voices/`, 208 are donor-only. The public tree also contains a nested references directory; these are not 9 extra gameplay-ready clips. No Q90 proposed filename was found among the current root public MP3s. Presence, ASR match, author liking a voice and a QC pass are four different facts. This pass did not listen to audio.

Molly is already guaranteed as the female home shepherd through `homeAuthoredResidents.ts`, key `molly_lambert`. Her donor profile's “binding pending” is stale for her basic identity. Piers has no `CharacterKey`, no entry in that resident overlay and no inspected live story binding. Do not create a key, profession or NPC duplicate from this packet.

The donor Woodward profile's instruction to keep `ziola-dla-anny` and `stare-ruiny` retired does **not** describe current V1: the former is still in `QUESTS`, the latter in `buildLandmarkQuests`, and createApp materializes those sources. This packet avoids recording those disputed stories and does not silently retire them. Donor profiles supply characterization, not V1 quest state.

## Six-NPC audit

All new text counts below are draft ceilings before casting/reuse reduction, not recording orders. No missing clip authorizes another speaker.

| NPC / current identity | Role and story function | Casting / Fish UUID | Existing MP3 and QC | Missing intended-voice coverage / packet |
| --- | --- | --- | --- | --- |
| Marek (Mark) Hornblower · `marek_hornblower` | Reserved male guard, sociable; water request, threat/guard quests; editorially observant and restrained, Kate's spouse | **Approved named cast:** Friendly Male `2adcdee4b3ce4b648dc16ea65430ea76`; not implemented | Six donor pilot MP3s, 6 ASR matches, all pending; none public. Current runtime instead uses guard + legacy general male | Pilot covers greeting/farewell/danger, thanks has no hook. Ten core gaps: attention, 3 quest cues, hungry, exhausted, neutral shelter, combat, work end, guard response. 19 drafts including optional bindings/weather/story |
| Kasia (Kate) Hornblower · `kasia_hornblower` | Reserved female trader, night owl; shells and other trade-related quest contacts; warm, perceptive, fair-minded | Expressive Female sample fit accepted; source and final named lock remain held: `d4f161bee1934b47ad3090f05649270c`. **No Laura substitution** | 17 public merchant files, 16 ASR matches / 1 mismatch, all pending. Not all registered. Runtime still borrows legacy female needs/danger/weather | Reuse core conversation clips; seven Q90 rows cover six bark gaps + reward-neutral completion. Only five new optional drafts (non-trade thanks, 3 weather variants, shells snippet); no duplicate Q90 pack |
| Anna · `anna_lesniewska` · runtime surname Leśniewska | Reserved female farmer, fast_worker; message giver, community/repair/animal quests. Woodward/Ann is editorial naming, not a changed key | **No approved named voice**; `voice_uuid=null`. Do not infer Hannah from gender/personality | No named pack. Current general female pool is legacy Warm `5e3be339f2df45e6a1a338bb2ce94800`, identity held; 22 public ledger files including campfire/age material, not 22 valid core cues | Six basic dialogue slots and six neutral core bark slots need stable-speaker coverage; 20 draft texts incl. unbound replies, weather and message snippet. Reduce after casting using Q90/donor coverage |
| Piotr · `piotr_lesniewski` · runtime surname Leśniewski | Reserved male woodcutter, energetic; message recipient, repair/scouting giver; practical, household-first | **No approved named voice**. FairyTail/Rick are approved general directions, not his named assignment; do not choose between them here | No named pack. Current legacy Casual `c2a3921fd7024b9189cb912bdfe5266a`, identity held; 22 public ledger files including non-core material | Same 12 core slots require consistent cast; 21 drafts incl. conditional reward and branch delivery. Prefer existing Q90 core if its exact speaker is subsequently chosen |
| Molly Lambert · `molly_lambert` | Guaranteed female home shepherd; gentle/dreamy but capable. Pip theft story is donor/approved narrative direction, not current quest implementation | Hannah `9a9cf47702da476aa4629e2506d4a857` is **candidate only**, not approved named assignment | No named pack. Hannah has 38 donor-only clips, 36 ASR matches / 2 mismatches, all pending. Current runtime uses legacy general female; male shepherd audio is not hers | Conditional Hannah shortlist + Q90 work end/snow/storm. Five new drafts: neutral shelter, defensive combat, rain, held quest accepted/completed. All quest cues held until real giver binding; livestock danger reuses her own danger clip |
| Piers · **no runtime key** | Editorial impoverished traveller involved in Pip theft; no runtime profession chosen | **No approved voice or named assignment** | No named MP3 pack or manifest binding established; general male catalog is not his voice | 19 preparatory texts, all casting/binding-held P2. No automatic apology, confession, theft acknowledgement, restitution, reward or household admission |

Mark's writing expansion is explicitly requested in the current task; this removes the historical “do not prepare a full pack” scope restriction for drafting. It does not approve these exact new texts for generation. Q90's 87 texts stay approved independently; no old approval is revoked.

## Actual event coverage

The following is **manifest reachability**, not a QC endorsement. A semantic entry without a caller is not live coverage. Detailed filenames and conditions are in the reuse document.

| NPC | Existing conversation voice surface | Existing spontaneous surface | Gaps / limits |
| --- | --- | --- | --- |
| Mark | Guard greeting/attention/farewell and accepted/declined/complete | Guard rain, danger, combat, response; general male hungry/exhausted/work end | Mixed speakers; none of his pilot voice wired; no neutral/snow shelter |
| Kate | Merchant greeting/attention/farewell | Legacy female exhausted/neutral weather/danger | Merchant quest files physically exist but no merchant quest manifest entries; no hungry/combat/work end; generic thanks/agree keys are not a producer |
| Anna | Legacy female greeting/farewell | Legacy female exhausted/neutral weather/danger | No attention or quest pools; no hungry/combat/work end; no named speaker |
| Piotr | Legacy male greeting/farewell | Legacy male hungry/exhausted/rain/danger/combat/work end | No attention/quest pools or neutral/snow shelter; legacy identity unresolved |
| Molly | Same as Anna via female fallback | Same as Anna; flock danger may alias to general female danger | No female shepherd bank; no Molly-authored quest binding; Hannah not wired |
| Piers | None established | None established | Every row binding-needed, even where a generic NpcAgent event exists |

Greeting presentation can suppress an otherwise resolved asset: unknown/mismatched time transcript yields text-only. Merchant greeting 03 has no entry in `GREETING_TRANSCRIPTS`. The current Polish greeting table is not an English transcript registry.

- **Greeting / attention:** `NpcAgent.playReactionSound`; explicit opening also uses `resolveNpcGreetingPresentation`.
- **Farewell / quest accepted / declined:** `closeNpcDialogueMenu` and `acceptNpcDialogueOffer`. Acceptance means the player agreed; do not promise a completed action.
- **Quest completed:** `QuestManager.playQuestCompleteSound` emits only giver ID + `quest_complete`; createApp resolves a loaded NPC. It does not pass quest ID, outcome or reward receipt. Therefore **reward-specific and story-specific lines are binding-needed**, even though the underlying quest exists.
- **Thanks / refusal / agreement:** semantic constants and some manifest entries exist; no inspected generic producers. Agreement is `confirmation`, not a new runtime intent.
- **Quest offer:** text offers exist; no inspected `quest_offer` voice producer.
- **Trade:** only Kate receives trade rows. `NpcDialogueMenu.openTrade` invokes `onOpenTrade` without a specific voice hook. Separate trade closing is binding-needed. No offer, sale or stocked item is inferred from simply opening the menu.
- **Weather:** `beginSeekShelter` is shelter intent, not ambient commentary or arrival. Rain → rain/neutral; storm → storm/rain/neutral; snow → snow/neutral. Neutral same-speaker line is the economical baseline.
- **Danger / combat:** new perceived animal threat versus successful `beginCombat`; not interchangeable, no species/weapon claims.
- **Hungry:** selected food need after another need, not proof of interrupted work. **Exhausted:** actual goTo/execute pause. Do not create an extra work-interruption take for the same event.
- **Work finished:** terminal action classified as scheduled work; no shift/day ending or actual repair success implied.
- **Guard / livestock:** use existing role-specific events; Molly's generic-safe same-speaker danger clip may serve the existing livestock alias.

## Bounded story selection and outcome safety

Only four current quests receive optional exact-context snippets; no Lost Lamb scenes are invented.

| Quest | Verified source contract | Voice policy |
| --- | --- | --- |
| `relay-anna-piotr` | Anna → Piotr message; report to Anna, outcome delivered; relations +1 to both, **no material reward** | Anna message receipt snippet only after successful report. Avoid repeating relative “tomorrow” in a delayed generic cue |
| `shells-dla-kasi` | Three shells; delivered; Kasia relation +1, **no material reward** | Q90-054 neutral completion; optional future-use doorstep snippet. Reject merchant reward/earn-coins recordings for this quest |
| `woda-dla-marka` | `interact_well`; delivered; shown 5 coins, relation +1 | Optional offer; reward acknowledgement only after actual grant. No bucket-item requirement, drinking, purity or temperature claim |
| `drewno-na-naprawe` | Five branches; delivered with 8 coins/+1; separate already_repaired outcome | Branches suitable for repair is safe after hand-in. No “fence now repaired” claim on delivery. Reward cue never on already_repaired |

Other current quest outcomes include losses and adverse branches. A complete status is not universal success: generated lost livestock includes `dead_confirmed` as complete. New generic completion lines deliberately thank for help without saying everything is fine. Do not extend a context-limited donor cue to all outcomes.

Current `zagubiona-owca` is Anna's authored sheep quest. Generated `world:lost-livestock:*` prefers a farmer giver through `selectSettlementQuestGiver`; neither establishes Molly/Piers/Pip. Molly's identity implementation must not be mistaken for implementation of her donor story.

## Economical recording budget

The full packet has **126 context rows = 89 new drafts + 27 reuse placements + 10 Q90 references**. The 27 reuse placements reference **25 unique MP3s** (Kate farewell also serves trade close; Molly danger also serves flock danger). New drafts: **P0 16 / P1 20 / P2 53**. These are ceilings; casts, duplicate coverage and absent bindings reduce actual production. **Zero new takes authorized by this document alone.**

| Stage | Minimal work | Recording cost / gate |
| --- | --- | --- |
| P0: regular conversations, Mark first | QC Mark greeting/farewell; NV-005–008 attention + 3 generic quest cues | **4 new takes** after text approval, one fixed approved UUID. Other intent gaps remain intentionally later |
| P0: Kate alongside Mark | QC five unique core merchant MP3s; use existing Q90-054 completion order | **1 already-approved Q90 take**, not a new packet commission; final named cast/source hold first |
| P1: Mark's real barks | Reuse pilot danger; NV-009–014 hunger, exhaustion, neutral shelter, combat, task end, guard response | **6 additional new takes**. Mark P0+P1 = **10 new**, plus 3 reused MP3s |
| P1: Kate's real barks | Existing Q90-047–052 | **6 additional already-approved Q90 takes**. Kate P0+P1 = **7 Q90**, 5 reused MP3s |
| P0/P1: Anna and Piotr | Resolve their named casts; select compatible same-speaker donor/Q90 core first | **0 commissioned now**; at most 12 basic core drafts each before reuse reduction. Approved generic directions are not permission to assign |
| P1: Molly if Hannah chosen | QC relevant Hannah dialogue/needs/danger; reuse danger for livestock; Q90-055 work end; NV-098–099 shelter/combat | **2 new + 1 existing Q90** for this limited baseline, only after named casting. No Molly quest production |
| P2 | Binding-needed replies/offers/trade/story/reward; specific-weather alternatives; Piers | **0 in minimal release**. Draft ceiling 53; do not batch-generate |

First useful Mark+Kate P0 batch: **5 takes total = 4 new + 1 Q90**, plus QC reuse. Expanded Mark+Kate P0+P1: **17 takes total = 10 new + 7 Q90**, plus **8 unique reused files**. Q90-054 stays P1 in its owning schedule; this named-NPC release prioritizes using it for core conversation completion without editing Q90.

No speculative price or duration estimate: Fish cost, retries and selected voice settings were not measured. One variant per situation is permitted by the requested 1–3 range. Optional weather variants and the second Mark greeting provide diversity later; a second whole core pack is not economical.

## Decisions needed from the author

1. Review/approve new text, starting with Mark NV-005–014; optional bindings can wait.
2. Confirm the final Kate named assignment and actual Expressive Female source UUID; sample fit alone did not lock it. Keep the existing UUID unchanged.
3. Choose Anna's and Piotr's named voices; confirm or reject **Hannah for Molly**. Do not revisit already approved general voice directions as if they were unknown.
4. Piers: resolve whether “Pierce” is an intended spelling change; choose his voice later. Keep runtime key null and do not rename code from an editorial spelling. **"Piers" is the correct version. Don't use "Pierce" for NPC name.**
5. Listening QC for the reuse shortlist (including Mark farewell wording); no blanket bank pass. Implement missing bindings separately if these optional lines are wanted.

## Verification and boundaries

Static inspection only: current character roster, resident overlay, quest definitions/materialization, template/greeting/offer/trade call paths, NpcAgent producers, bark weather chain, resolver/manifest, Q90 script and ledger. No game, listening, visual or performance verification claimed. No source, audio, ledger verdict, casting table, canonical runtime string or approved Q90 file changed.

Automated document checks performed before writing: unique row IDs and new filenames; transcript/generation-input equality for new rows; exact normalized comparison against Q90 recordings and ledger catalog/ASR; 1–3 rows per NPC/intent; reuse paths/blob presence; unchanged Q90 references; casting hold on null voices; all missing-binding rows held; counts and repository link targets. Semantic review is in the trigger and quest tables above. No gameplay tests were run for this documentation-only change.

## Source map

- [npc-065 casting decisions](../../plans/npc-065-stable-npc-voice-casting-and-donor-qc.md)
- [Q90 audit](./2026-11-04--q90-npc-voices-editorial-audit.md), [approved Q90 JSON](./2026-11-04--q90-fish-audio-script.json), [text-only dialogue proposals](./2026-11-04--q90-dialogue-proposals.md)
- [QC ledger](../../assets/voice-qc/ledger.json)
- [Character keys and reserved roles](../../../src/ai/characters.ts), [Molly identity](../../../src/settlement/homeAuthoredResidents.ts)
- [Resolver and manifest](../../../src/ai/npcVoiceLines.ts), [bark request and weather chain](../../../src/ai/npcBarkRequest.ts), [event producers](../../../src/ai/NpcAgent.ts)
- [Quest definitions](../../../src/quests/quests.ts), [QuestManager](../../../src/quests/QuestManager.ts), [materialization](../../../src/quests/materializeAuthoredQuests.ts), [generated livestock giver/outcomes](../../../src/quests/opportunities/worldQuestMaterialization.ts)
- [Composition callbacks](../../../src/app/createApp.ts), [UI offer/close](../../../src/ui-vue/store.ts), [trade UI](../../../src/ui-vue/NpcDialogueMenu.vue), [greeting](../../../src/ui-vue/npcDialogueGreeting.ts), [dynamic templates](../../../src/ai/dialogueTemplates.ts)
- [Mark personality](../../v3-donor/characters/profiles/mark-hornblower-character-profile.md), [Kate](../../v3-donor/characters/profiles/kate-hornblower-visual-profile.md), [Woodwards](../../v3-donor/characters/profiles/woodward-character-profiles.md), [Molly](../../v3-donor/characters/profiles/molly-lambert-character-profile.md), [Piers](../../v3-donor/characters/profiles/piers-character-profile.md)

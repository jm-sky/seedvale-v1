# Named NPC voices — reuse shortlist and QC blockers

**Casting update — 2026-11-05:** The [NPC-Voice map](../../design/npc-voices/CASTING.md#npc-voice-casting) is authoritative. Earlier casting holds/alternatives in this dated evidence are superseded: Kasia→Expressive Female, Anna→Laura, Piotr→Country Baritone, Molly→Hannah, Piers→Warm Male Friend (farmer; no runtime key), Jakub→Arthur, Patric→Dramatic, generic hunter→Cowboy, male farmer→Casual, general female→Warm Conversational, fisher→Rick. Existing file source/transcript/context QC and missing runtime bindings remain separate gates. See [cleanup report](./2026-11-05--npc-voice-cleanup.md). No transcript, recording ID, filename or ledger verdict is changed.

**2026-11-05 · source `2722c78ab6d79b3312d78877f9b96140fd97ddb1` · no audio listened to in this pass.**

[Audit](./2026-11-05--named-npc-voice-audit.md) · [Script](./2026-11-05--named-npc-voice-script.md) · [JSON](./2026-11-05--named-npc-voice-script.json)

## Conditional reuse — 25 unique files, 27 placements

Every ledger verdict is **pending**. ASR match does not establish correct voice, natural delivery, pronunciation or valid context. Do not regenerate these merely to obtain a named filename. Source paths in JSON distinguish public from donor; donor import requires Q89.

| NPC | File | Slots / row IDs | ASR | Catalog transcript (not yet listening-confirmed) |
| --- | --- | --- | --- | --- |
| Marek (Mark) Hornblower | `npc_mark_hornblower_greeting_01.mp3` | NV-001 greeting | match | Good day. Is there anything I can help with? |
| Marek (Mark) Hornblower | `npc_mark_hornblower_farewell_01.mp3` | NV-002 farewell | match | Look after yourself, will you? I'll see you around. |
| Marek (Mark) Hornblower | `npc_mark_hornblower_thanks_01.mp3` | NV-003 thanks | match | I appreciate that. It means a good deal. |
| Marek (Mark) Hornblower | `npc_mark_hornblower_danger_alert_01.mp3` | NV-004 danger_alert | match | Back! Get clear of it! |
| Kasia (Kate) Hornblower | `merchant_female_greeting_01.mp3` | NV-022 greeting | match | Welcome, traveler. Looking for something useful today? |
| Kasia (Kate) Hornblower | `merchant_female_farewell_01.mp3` | NV-023 farewell; NV-038 trade_close | match | Safe travels. Come back if you need anything. |
| Kasia (Kate) Hornblower | `merchant_female_attention_01.mp3` | NV-024 attention | match | Traveler! A moment, if you please. |
| Kasia (Kate) Hornblower | `merchant_female_quest_accepted_01.mp3` | NV-025 quest_accepted | match | Excellent. Come back when it's done. |
| Kasia (Kate) Hornblower | `merchant_female_quest_declined_01.mp3` | NV-026 quest_declined | match | A pity. I suppose I'll have to ask someone else. |
| Kasia (Kate) Hornblower | `merchant_female_refusal_01.mp3` | NV-034 refusal | match | I'm afraid I can't agree to that. |
| Kasia (Kate) Hornblower | `merchant_female_agree_01.mp3` | NV-035 confirmation | match | Alright. We have a deal. |
| Kasia (Kate) Hornblower | `merchant_female_quest_offer_02.mp3` | NV-036 quest_offer | match | There's something I need taken care of. Interested? |
| Kasia (Kate) Hornblower | `merchant_female_greeting_02.mp3` | NV-037 trade_open | match | Ah, a customer. Come, take a look. |
| Kasia (Kate) Hornblower | `merchant_female_thanks_01.mp3` | NV-039 thanks | match | Thank you. Always a pleasure doing business. |
| Molly Lambert | `general_female_b_greeting_01.mp3` | NV-082 greeting | match | Well met. What brings you this way? |
| Molly Lambert | `general_female_b_farewell_02.mp3` | NV-083 farewell | match | Farewell. May the road treat you kindly. |
| Molly Lambert | `general_female_b_attention_02.mp3` | NV-084 attention | match | Pardon me. Could I have a word? |
| Molly Lambert | `general_female_b_exhausted_01.mp3` | NV-085 exhausted | match | I'm worn out. I have to rest. |
| Molly Lambert | `general_female_b_hungry_01.mp3` | NV-086 hungry | match | I need food before I can keep going. |
| Molly Lambert | `general_female_b_danger_alert_02.mp3` | NV-087 danger_alert; NV-101 livestock_danger | match | Look out — something hostile! |
| Molly Lambert | `general_female_b_thanks_02.mp3` | NV-088 thanks | match | I'm grateful. Truly. |
| Molly Lambert | `general_female_b_refusal_01.mp3` | NV-089 refusal | match | Sorry. I can't help with that. |
| Molly Lambert | `general_female_b_agree_02.mp3` | NV-090 confirmation | match | Fine by me. We'll do it that way. |
| Molly Lambert | `general_female_b_quest_offer_02.mp3` | NV-091 quest_offer | match | I could use a capable pair of hands. Interested? |
| Molly Lambert | `general_female_b_quest_declined_02.mp3` | NV-092 quest_declined | match | Understood. Perhaps another day. |

## Q90 references — not ten extra orders

| NPC | Q90 ID | Existing filename | Intent |
| --- | --- | --- | --- |
| Kasia (Kate) Hornblower | Q90-047 | `q90_merchant_female_hungry_01.mp3` | hungry |
| Kasia (Kate) Hornblower | Q90-048 | `q90_merchant_female_exhausted_01.mp3` | exhausted |
| Kasia (Kate) Hornblower | Q90-049 | `q90_merchant_female_weather_shelter_01.mp3` | weather_shelter |
| Kasia (Kate) Hornblower | Q90-050 | `q90_merchant_female_danger_alert_01.mp3` | danger_alert |
| Kasia (Kate) Hornblower | Q90-051 | `q90_merchant_female_combat_start_01.mp3` | combat_start |
| Kasia (Kate) Hornblower | Q90-052 | `q90_merchant_female_work_finished_01.mp3` | work_finished |
| Kasia (Kate) Hornblower | Q90-054 | `q90_merchant_female_quest_complete_01.mp3` | quest_complete |
| Molly Lambert | Q90-055 | `q90_general_female_b_work_finished_01.mp3` | work_finished |
| Molly Lambert | Q90-076 | `q90_general_female_b_weather_shelter_snow_01.mp3` | weather_shelter_snow |
| Molly Lambert | Q90-079 | `q90_general_female_b_weather_shelter_storm_01.mp3` | weather_shelter_storm |

Use the Q90 source UUID unchanged. Its JSON has old row-level proposal labels despite document-level author approval; do not mistake those labels for revoked approval. This packet adds no production permission for unresolved casts/sources.

## Blockers and excluded reuse

| Blocker | Affected assets / NPC | Minimal next action |
| --- | --- | --- |
| No passed clips | All 317 ledger rows, including this shortlist | Author/listening transcript and speaker QC; record actual verdicts through the existing process, not this writing file |
| Stable-speaker resolver missing | All five implemented NPCs | Q88; no cross-role/general fallback to fill this packet |
| Mark farewell wording | `npc_mark_hornblower_farewell_01.mp3`: catalog “will you”, ASR “will ya” | Listen; preserve real canonical spoken form, do not regenerate automatically |
| Mark day greeting | `npc_mark_hornblower_greeting_01.mp3` “Good day” | Daytime eligibility or optional NV-018 for time-neutral coverage; do not claim round-the-clock coverage from one greeting |
| Kate source and named lock | Expressive Female UUID `d4f161bee1934b47ad3090f05649270c` | Confirm source and final named assignment; never use Laura as missing-line fallback |
| Kate accepted mismatch | `merchant_female_quest_accepted_02.mp3` | Listen before reuse; shortlist uses 01, restricted to return-to-giver quests |
| Kate false material reward | `merchant_female_quest_complete_01/02.mp3`; `merchant_female_quest_offer_01.mp3` | Exclude for shells; Q90-054 for generic completion, offer 02 for future bound offers |
| Kate location promise | `merchant_female_farewell_02.mp3` | Do not use universally; use farewell 01, or Q90-053 if desired (not an additional essential named take) |
| Kate trade thanks | `merchant_female_thanks_01.mp3` | Successful trade only; never no-purchase close or arbitrary help. Trade close reuses farewell 01 instead |
| No named cast | Anna, Piotr, Molly, Piers | Author decision first; null UUID blocks production. Recompute gaps from that one voice |
| Legacy identity inconsistencies | general male/female banks currently audible | Not a stable named reuse pool. Catalog UUID alone does not prove consistent audio |
| Hannah mismatches | `general_female_b_attention_01.mp3`, `general_female_b_hungry_02.mp3` | Prefer shortlist alternatives attention 02 / hunger 01 pending their own QC |
| Hannah work-end semantics | `general_female_b_work_finished_01/02.mp3` | Day/put-tools-away claims exceed event; reuse approved Q90-055 text order |
| Hannah weather forecasts | `general_female_b_weather_shelter_01/02.mp3` | “turning nasty” / “before it gets worse” not guaranteed; new neutral draft or verified safe same-speaker clip |
| Hannah combat tone/weapon | `general_female_b_combat_start_01/02.mp3` | Confrontational “settle this” / “Draw!” unsuitable generic Molly response; restrained new draft |
| Hannah completion/reward | `general_female_b_quest_complete_01/02.mp3` | No blanket “well done” on tragic outcomes, no generic reward; Molly-specific quest use stays binding-held |
| Piers absent | No stable runtime key/story binding | All rows binding-needed; no invented role, alias-based resolver entry or automatic confession |
| Brian global exclusion | `65c0b8155c464a648161af8877404f11` and aliases | Never cast, generate or import; retained archive is not reuse inventory |
| Missing event/outcome adapters | Thanks/refusal/confirmation, offers, trade, exact story/reward | Implement separately only if selected; a semantic constant is insufficient |

Two remaining Mark pilot files are **retained, not commissioned again**:
- `npc_mark_hornblower_daily_01.mp3` — “You learn who's had a hard day if you bother to listen.”
- `npc_mark_hornblower_road_advice_01.mp3` — “If you're out late, keep to the road. It's easier to find you if you need help.”

Both are ASR-match / QC-pending. No suitable current producer is verified; the road claim also needs context. They are outside this event pack, not failed/deleted audio.

## Current manifest inventory per implemented NPC

This table is generated from the inspected static manifest and role→general lookup. “Registered but unbound” means no inspected producer, not audible coverage. Rain rows may also serve storms; neutral rows may serve all admitted shelter weather. Candidate transcripts may still be unsafe. No Mark/Hannah named casting is inferred.

### Marek

| Intent | Existing resolved files | Producer |
| --- | --- | --- |
| greeting | `guard_male_greeting_01.mp3`, `guard_male_greeting_02.mp3` | existing generic event |
| farewell | `guard_male_farewell_01.mp3` | existing generic event |
| attention | `guard_male_attention_01.mp3` | existing generic event |
| thanks | `guard_male_thanks_01.mp3`, `guard_male_thanks_02.mp3` | registered but unbound |
| refusal | `guard_male_refusal_01.mp3` | registered but unbound |
| quest_accepted | `guard_male_quest_accepted_01.mp3`, `guard_male_quest_accepted_02.mp3` | existing generic event |
| quest_declined | `guard_male_quest_declined_01.mp3`, `guard_male_quest_declined_02.mp3` | existing generic event |
| quest_complete | `guard_male_quest_complete_01.mp3`, `guard_male_quest_complete_02.mp3` | existing generic event |
| hungry | `general_male_hungry_01.mp3` | existing generic event |
| exhausted | `general_male_exhausted_01.mp3` | existing generic event |
| weather_shelter_rain | `guard_male_weather_shelter_01.mp3` | existing generic event |
| danger_alert | `guard_male_danger_alert_01.mp3` | existing generic event |
| combat_start | `guard_male_combat_start_01.mp3` | existing generic event |
| work_finished | `general_male_work_finished_01.mp3` | existing generic event |
| guard_response | `guard_male_guard_response_01.mp3` | existing generic event |

### Kasia

| Intent | Existing resolved files | Producer |
| --- | --- | --- |
| greeting | `merchant_female_greeting_01.mp3`, `merchant_female_greeting_02.mp3`, `merchant_female_greeting_03.mp3` | existing generic event |
| farewell | `merchant_female_farewell_01.mp3` | existing generic event |
| attention | `merchant_female_attention_01.mp3` | existing generic event |
| thanks | `merchant_female_thanks_01.mp3` | registered but unbound |
| confirmation | `merchant_female_agree_01.mp3` | registered but unbound |
| exhausted | `general_female_exhausted_01.mp3` | existing generic event |
| weather_shelter | `general_female_weather_shelter_01.mp3` | existing generic event |
| danger_alert | `general_female_danger_alert_01.mp3` | existing generic event |

### Anna

| Intent | Existing resolved files | Producer |
| --- | --- | --- |
| greeting | `general_female_greeting_01.mp3` | existing generic event |
| farewell | `general_female_farewell_01.mp3` | existing generic event |
| exhausted | `general_female_exhausted_01.mp3` | existing generic event |
| weather_shelter | `general_female_weather_shelter_01.mp3` | existing generic event |
| danger_alert | `general_female_danger_alert_01.mp3` | existing generic event |

### Piotr

| Intent | Existing resolved files | Producer |
| --- | --- | --- |
| greeting | `general_male_greeting_01.mp3` (removed; historical reference) | silent pending approved replacement; see [backlog](../../assets/voice-qc/regeneration-backlog.json) |
| farewell | `general_male_farewell_01.mp3` (removed; historical reference) | silent pending approved replacement; see [backlog](../../assets/voice-qc/regeneration-backlog.json) |
| hungry | `general_male_hungry_01.mp3` | existing generic event |
| exhausted | `general_male_exhausted_01.mp3` | existing generic event |
| weather_shelter_rain | `general_male_weather_shelter_01.mp3` | existing generic event |
| danger_alert | `general_male_danger_alert_01.mp3` (removed; historical reference) | silent pending approved replacement; see [backlog](../../assets/voice-qc/regeneration-backlog.json) |
| combat_start | `general_male_combat_start_01.mp3` | existing generic event |
| work_finished | `general_male_work_finished_01.mp3` | existing generic event |

### Molly

| Intent | Existing resolved files | Producer |
| --- | --- | --- |
| greeting | `general_female_greeting_01.mp3` | existing generic event |
| farewell | `general_female_farewell_01.mp3` | existing generic event |
| exhausted | `general_female_exhausted_01.mp3` | existing generic event |
| weather_shelter | `general_female_weather_shelter_01.mp3` | existing generic event |
| danger_alert | `general_female_danger_alert_01.mp3` | existing generic event |


# Recorded NPC voice lines — replacement and listening backlog

**Status:** `draft` (proposals only; no recorded text or MP3 changed)  
**Created at:** 2026-10-20  
**Created by:** ChatGPT Sol  
**Domain:** dialogue, recorded audio, quality control  
**Roadmap:** M4 text admission, M7 voice pilot, M9 broader voice use  
**Depends on:** [voice catalog](NPC-VOICE-CATALOG.md), [quality audit](../reviews/2026-10-20--185--npc-dialogue-quality-audit.md)  
**Decided by:** ChatGPT Sol — quarantine potentially unsuitable recorded lines instead of silently rewriting their transcripts

## Safety rule

Every filename below exists at `public/sounds/voices/<filename>` at the audited HEAD. **All listed catalog statuses remain `in_repo`; no line, `voice_id`, `generation_input` or MP3 is altered by this backlog.** These are script replacements for a possible future re-record *or* reasons to narrowly gate the existing clip. The recorded Fish generation-history prompts are evidence of submitted text, **not proof from listening** that every generated file sounds exactly like that prompt. Text replacement must follow actual listening, a re-record and an atomic catalog/audio reconciliation. Do not rename `shepard_*` as part of an editorial pass.

| Priority | Exact MP3 filename | Current catalog spoken text | Suggested replacement for a future take | Why / existing-clip alternative |
|---|---|---|---|---|
| P0 verify | `general_male_farewell_01.mp3` | Take care out there. | Take care out there. | `generation_input` actually says “Take care out there. I’ll be here if you need supplies.” Listen first: source and caption may disagree. If the longer version is audible, restrict to real suppliers or re-record. |
| P1 | `general_female_call_for_help_01.mp3` | Oh! Help! Support needed! | Help! Someone, please! | “Support needed” sounds like a game UI alert, not a frightened person. |
| P1 | `general_male_call_for_help_01.mp3` | Help! Help! Someone! quickly! | Help! Somebody, please! | Unnatural final “quickly” and punctuation; listen for the irregular Fish expressive prompt. |
| P1 | `guard_male_combat_start_01.mp3` | You picked the wrong guy! | Stand down! Don't make me stop you! | Modern swagger and aggression conflict with a measured non-lethal guard response. |
| P1 | `guard_male_greeting_01.mp3` | Good day. State your business. | Good day. Can I help you with something? | Useful for a strict inspection, poor as a default village greeting; especially **never** an implicit Mark Hornblower line. |
| P1 | `guard_male_farewell_01.mp3` | Move along, and stay out of trouble. | Take care. Keep your wits about you. | Existing clip may remain as a specifically stern/unfriendly tone, not the default for guards. |
| P1 | `shepard_male_danger_alert_01.mp3` | Wolf in the flock! Get! away! from! the! sheep!! | Wolf near the flock! Get the sheep clear! | Same line as `shepherd_male_livestock_danger_01.mp3`, extreme word-by-word punctuation, typo in filename. Retain legacy filename mapping until separately migrated. Wolf/flock conditions are essential. |
| P1 | `shepherd_male_livestock_danger_01.mp3` | Wolf in the flock! Get! away! from! the! sheep!! | Get the sheep together! Quickly! | Duplicate semantic sound with the typo alias; a distinct sheep-protection reaction is more useful **when real livestock danger exists**. |
| P2 | `guard_male_quest_declined_02.mp3` | That's disappointing. I thought I could count on you. | I understand. I'll try another way. | Guilt-inducing response to an ordinary player refusal; keep old clip only for justified individual frustration. |
| P2 | `guard_male_greeting_02.mp3` | Morning, traveler. Keep your weapons sheathed inside the settlement. | Good day. Let me know if you need directions. | Requires actual morning and relevant weapon policy; otherwise sounds like constant inspection. |
| P2 | `hunter_male_quest_offer_01.mp3` | I've got a job, if you're not afraid of the woods. | I've a task that could use another pair of hands. Interested? | Generic hunter taunt instead of a plausible request; old line could suit one deliberately provocative hunter. |
| P2 | `hunter_male_quest_complete_02.mp3` | Good work. Not everyone comes back from a job like that. | That took patience. Well done. | Claims a dangerous outcome not present in every quest. |
| P2 | `merchant_female_greeting_02.mp3` | Ah, a customer. Come, take a look. | Hello there. What can I do for you? | Assumes commercial intent and goods; retain as stock-backed trading greeting only. |
| P2 | `merchant_female_farewell_02.mp3` | Take care out there. I'll be here if you need supplies. | Take care. I'd be glad to talk again. | Implies fixed location and stocked supply availability. |
| P2 | `merchant_female_quest_complete_01.mp3` | Well done. You've earned your reward. | You've seen it through. Thank you. | Requires a real reward and transfer; safer if the actual quest pays separately. |
| P2 | `general_male_danger_alert_01.mp3` | Wolf! Everyone, watch out! | Look out! Stay clear! | Existing clip fits a **witnessed wolf** only; not a generic danger alert. |
| P2 | `general_male_young_greeting_01.mp3` | Hello, you're new around here. | Hello there. How are you? | Assumes unfamiliarity; allow original only if actual encounter history supports it. |
| P2 | `campfire_male_road_answer_01.mp3` | Mostly the usual. Bad weather, wolves near the woods, and someone saying the northern trail isn't as safe as it used to be. | Not much I can speak for. Have you heard anything from the road? | Falsely asserts several local/world facts and second-hand knowledge without a supplier; until M4/S4/M9, suppress context-free playback. |
| P2 | `campfire_female_road_answer_02.mp3` | Not much. Saw fresh tracks near the forest, though. Bigger than deer. I wouldn't wander out there alone tonight. | Can't say I've seen anything unusual myself. | Claims personal observation and a particular threat/area; new line still requires appropriate knowledge of one's own recent activities. |

## Further recorded banks, lower priority

- **General `*_b`, 76 files:** the 38 sentences per voice are exact written duplicates across `general_male_b` and `general_female_b`. That is a diversity weakness, **not** an audio-integrity fault. Keep both sets until a deliberate replacement takes place; people can plausibly share commonplace phrases.
- **Campfire POC, 12 clips:** `weather` questions/answers and `road` rumours must not be scheduled just because two people sit nearby; they rely on observed conditions or knowable events. Clip existence does not imply M4 live conversation.
- **Other primary recorded `quest_*` clips:** do not invent quest ownership, payment, a meeting place or a dangerous mission. Existing expressive recordings may remain behind strict contextual admission after M7.
- **Fish metadata warning:** `general_female_quest_complete_01.mp3`, `general_female_quest_declined_01.mp3` and `merchant_female_agree_01.mp3` have small spoken-punctuation differences between their caption and `generation_input`, not established substantive text mismatches. Verify by listening if reusing for tightly subtitled scenes.

## Replacement protocol

1. Compare current Git HEAD with the ledger immediately before a production batch; identify any newer clip/status changes from Cursor. Never assume a file is still `planned`.
2. Listen to the actual file (not just its catalog caption), determine exact speech, pronunciation and expressive cues.
3. Choose: **keep with narrow eligibility**, **regenerate exact approved new line**, or **retire/replace after runtime consumers are mapped**. Record the disposition per filename.
4. When a replacement MP3 really exists and is verified, change its matching transcript and `generation_input` together. Preserve the filename and voice ID unless a separately accepted audio-routing decision says otherwise.
5. Check current runtime/candidate scene bindings, filenames, clip counts, and audibility before marking closure. `in_repo` alone means file exists, not that it is correct, staged or listened to.

**No recorded-clip replacements are authorized for Fish production by creating this document.**

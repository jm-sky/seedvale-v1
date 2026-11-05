# Voice regeneration backlog — 2026-11-05

[Machine-readable manifest](regeneration-backlog.json) · [Decisions](author-decisions.json) · [Deletion evidence](deletion-manifest.json) · [Casting](../../design/npc-voices/CASTING.md)

**14 tasks: 7 to restore removed runtime coverage, 7 optional coverage.**
Current gameplay follows existing silence/text-only handling. No new audio was generated.
The 38 archive-only Brian British clips are not replacement tasks: no approved runtime coverage depended on them.

| Original recording | Priority | Expected replacement Fish UUID | Text source |
| --- | --- | --- | --- |
| `campfire_female_weather_answer_02.mp3` | runtime-coverage-restoration | `5e3be339f2df45e6a1a338bb2ce94800` | Retained historical text; review ASR/context |
| `campfire_female_weather_question_01.mp3` | runtime-coverage-restoration | `5e3be339f2df45e6a1a338bb2ce94800` | Retained historical text; review ASR/context |
| `general_female_agree_01.mp3` | optional-coverage | `5e3be339f2df45e6a1a338bb2ce94800` | Retained historical text; review ASR/context |
| `general_female_farewell_01.mp3` | runtime-coverage-restoration | `5e3be339f2df45e6a1a338bb2ce94800` | Retained historical text; review ASR/context |
| `general_female_greeting_01.mp3` | runtime-coverage-restoration | `5e3be339f2df45e6a1a338bb2ce94800` | Retained historical text; review ASR/context |
| `general_female_quest_complete_01.mp3` | optional-coverage | `5e3be339f2df45e6a1a338bb2ce94800` | Retained historical text; review ASR/context |
| `general_female_quest_declined_01.mp3` | optional-coverage | `5e3be339f2df45e6a1a338bb2ce94800` | Retained historical text; review ASR/context |
| `general_female_thanks_01.mp3` | optional-coverage | `5e3be339f2df45e6a1a338bb2ce94800` | Retained historical text; review ASR/context |
| `general_male_danger_alert_01.mp3` | runtime-coverage-restoration | `c2a3921fd7024b9189cb912bdfe5266a` | Existing proposal; requires author approval |
| `general_male_farewell_01.mp3` | runtime-coverage-restoration | `c2a3921fd7024b9189cb912bdfe5266a` | Existing proposal; requires author approval |
| `general_male_greeting_01.mp3` | runtime-coverage-restoration | `c2a3921fd7024b9189cb912bdfe5266a` | Existing proposal; requires author approval |
| `general_male_old_greeting_01.mp3` | optional-coverage | `372ef39bf5bf4fd38c5c56bce607aba6` | Existing proposal; requires author approval |
| `general_male_young_farewell_01.mp3` | optional-coverage | **Unresolved age/role assignment** | Existing proposal; requires author approval |
| `general_male_young_greeting_01.mp3` | optional-coverage | **Unresolved age/role assignment** | Existing proposal; requires author approval |

Each JSON row retains original filename/hash/Git blob, original catalog and generation
input, content-bound ASR text, replacement text or text needing correction, rejection
reason, target path, casting evidence and runtime integration gates. ASR is machine
transcription, not listening verification; WER differences are flagged for review.
Eight new tasks retain original text for review; the six earlier proposed texts
remain unapproved proposals. No dialogue or speaker assignment was invented.

Warm Conversational is the approved target for general middle-aged women. Casual
Male Speaker remains the farmer target for three earlier adult lines, george for
the old greeting. The two young male replacements still need an age/role casting
decision; a young filename does not mean a boy or authorize Little Lem. These gates
block future generation/integration only, not the completed approved deletions.

The two campfire replacements must restore their original complete weather pair
with the retained opposite-gender partner; work/road pairs remain unchanged. No
unrelated speaker, intent or new fallback may stand in for an absent clip.

All production requires author-approved text, approved age/role speaker, generation
in a separate authorized task, source/transcript/context/listening QC and deliberate
runtime registration. Preserve original historical records; new audio needs fresh
content bindings. Q90 and named script texts/IDs are unchanged.

Recover exact deleted audio outside the playable tree with `git show <commit>:<path>`
using per-row removal evidence and verify SHA256. The [final report](../../research/v1-revival/2026-11-05--npc-voice-final-cleanup.md)
records executed checks and limits.

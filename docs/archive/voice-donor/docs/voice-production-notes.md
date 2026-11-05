# Voice production notes (Fish Audio)

**Updated at:** 2026-10-20  
**Updated by:** user taste feedback (recorded by Composer)

Operational taste and listen-QC notes for Cursor-lane Fish batches. Does not change catalog text, filenames, or `in_repo` status by itself unless a deliberate production step says so.

## Fish UUID taste ledger (casting history)

Author listen impressions for Discovery / catalog voices. Keep UUID + Fish display name stable so later casting rounds can reuse notes.

| Fish name (slug) | UUID | Author taste (2026-10-20) | Suggested use |
|---|---|---|---|
| Brian British (`brian-british`) | `65c0b8155c464a648161af8877404f11` | Too mechanical; no expression / emotion. Probably not useful for anything. | Avoid for living NPC speech. Catalog still lists it as `general_male_b` pending a separate re-voice decision. |
| British (`british-deep-calm`) | `d33bd87d47a04c2eada3c5438047e32d` | Sounds interesting; may be useful for something later. | Keep as spare deep/calm British male. Not assigned. |
| Friendly Male Voice (`friendly-male-voice`) | `2adcdee4b3ce4b648dc16ea65430ea76` | Excellent — **chosen for Mark Hornblower**. | Actor voice: `mark_hornblower` / `G01`. |
| Warm Conversational Male (`warm-conversational-male`) | `559bb0b0a3c74f7a93bd884c0e5a6049` | Odd, rather deep; reads like a psychopath. | Possible later psychopath / unsettling antagonist, not ordinary villagers. |
| Warm Male Friend (`warm-male-friend`) | `f292c81d563f47799b7e411f1c1e68a9` | Middling; sounds like a gloomy teenager. | Possible gloomy-teen / sulky youth NPCs later. |

Casting samples (identical Mark lines, not runtime): `_temp/fish-barks/casting/mark/` (git-ignored). Working notes: `_temp/fish-barks/casting/mark/CANDIDATES.md`.

---

## Mark Hornblower casting — Friendly Male Voice (`2adcdee4b3ce4b648dc16ea65430ea76`)

**Casting decision:** 2026-10-20 — author approved `friendly-male-voice` as Mark's character-specific Fish identity (`mark_hornblower`). Does **not** replace role banks `guard_male` / `guard_male_b`.

**Pilot lines (quality sample, not full pack):** see catalog profile `mark_hornblower` and `public/sounds/voices/npc_mark_hornblower_*.mp3`. Remaining Hornblower pack lines are **not** authorized without a separate ask.

**QA (after 6-line pilot landed):** all six `npc_mark_hornblower_*.mp3` present under `public/sounds/voices/`; catalog rows `in_repo` with exact `generation_input`. Author cast taste already signed on the three shared casting lines (greeting / road / alert). Pilot farewell, daily, and thanks generated with the same UUID and S2 Pro defaults (no expressive tags). No re-record requested. **Full pack still unauthorized.**

---

## `guard_male_b` — Dramatic Character Male (`7a18a1851d2649108c48ec9f2c80eb2c`)

**Recorded:** 2026-10-20 (40/40 `in_repo`, commit `1241c04e`).  
**Source:** user playtest / listen impression after batch landed.

**Finding:** The current timbre sounds **not very natural for in-world NPC barks** — closer to an AI assistant or **narration** voice than a living person in everyday situations. Delivery feels **emotionally flat** for real-life contexts (greeting, thanks, tiredness, etc.), even where the script is conversational.

**Disposition (open):** Do not treat this profile as signed-off for taste. Before more `guard_male_b` re-records or dependent design, consider:

- Fish voice pilot with a more conversational male timbre (while keeping `guard_male_b` UUID contract if unchanged), or
- Stronger expressive tags / model settings only where they improve naturalness without theatrical shouting on routine lines, or
- Partial or full re-record of the batch after a new voice or prompt strategy is chosen.

No runtime or catalog status change until a deliberate re-production plan is adopted.

**Related:** Brian British (`65c0b815…`) failed a similar “living person” bar in the Mark casting round (mechanical / no emotion) — treat as corroborating evidence against narration-flat male banks for character work.

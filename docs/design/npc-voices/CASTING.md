<!-- Author-approved decisions moved from npc-065; no casting/runtime policy change. -->

# NPC Voice Casting

**Author-approved casting · 2026-11-05 09:30.** This map is the single current source of casting decisions and supersedes earlier casting proposals/listening holds below. `?` means undecided; never fill it automatically. Voice selection does not approve existing MP3s, transcripts, runtime assignment or generation of unapproved text.

### Defined named NPCs

| Name | Profession | Voice name | Fish voice ID |
| --- | --- | --- | --- |
| Marek      | Guard              | Friendly Male           | 2adcdee4b3ce4b648dc16ea65430ea76 |
| Kasia      | Trader             | Expressive Female       | d4f161bee1934b47ad3090f05649270c |
| Anna       | Farmer             | Laura                   | e3cd384158934cc9a01029cd7d278634 |
| Piotr      | Woodcutter         | Country Baritone        | 5e03f21950f64729935dd8402c9c9702 |
| Molly      | Shepherd           | Hannah                  | 9a9cf47702da476aa4629e2506d4a857 |
| Piers      | Farmer             | Warm Male Friend        | f292c81d563f47799b7e411f1c1e68a9 |
| Jakub      | Hunter             | Arthur Morgan           | bd22266aba38416cb602e90ce651520c |
| Kazimierz  | Elder              | Clint Eastwood          | 61a8f98f12cc4551bc74d01d16830f02 |
| Archibald  | Trader             | Old man                 | 61fc0e0fc78046da8fb9549b9b4c6175 |
| Patric     | Blacksmith         | Dramatic Character Male | 7a18a1851d2649108c48ec9f2c80eb2c |
| Rudolf     | Farmer + reeve     | ?                       | ?                                |

### General, professions

| Sex | Profession | Age | Voice name | Fish voice ID |
| --- | --- | --- | --- | --- |
| Male   | General        | Middle | FairyTail 1         | 689b47ca83dd48dba90b160affb8a118 |
| Female | General        | Middle | Warm Conversational | 5e3be339f2df45e6a1a338bb2ce94800 |
| Male   | General        | Old    | george              | 372ef39bf5bf4fd38c5c56bce607aba6 |
| Female | General        | Old    | Old woman           | 8db547ea044f44838bf2f8a039f05b5a |
| Male   | General        | Child  | Little Lem          | 34a421bb18bd4d3289898233cfa88269 |
| Male   | Guard          | Middle | Guard               | c29549f41b3b4aa498d66d76fba0e887 |
| Male   | Farmer         | Middle | Casual Male Speaker | c2a3921fd7024b9189cb912bdfe5266a |
| Female | Farmer         | Middle | ?                   | ?                                |
| Male   | Woodcutter     | Middle | ?                   | ?                                |
| Male   | Hunter         | Middle | Cowboy              | a2cecd3eda8b44178b7f1bc1379edae0 |
| Male   | Trader         | Middle | ?                   | ?                                |
| Male   | Blacksmith     | Middle | ?                   | ?                                |
| Male   | Shepherd       | Middle | Hetalia Russia      | 4af16ba03cee422996ec29a43e1947ee |
| Male   | Fisher         | Middle | Rick Sanchez        | d2e75a3e3fd6419893057c02a375a113 |

## Author casting decisions — 2026-11-03 (S2, first listening round)

**Historical listening record; superseded for casting by [current casting](#npc-voice-casting).** Brian’s global exclusion remains in force. Dramatic→Patric, Hannah→Molly, Cowboy→generic hunter and Arthur→Jakub are now selected; recorded-file QC remains pending.

These are author-approved voice **casting** decisions, not per-clip transcript/QC passes. Do not convert unheard ledger rows into `pass` solely from this section.

| Speaker | Fish voice ID | Decision | Casting guidance |
| --- | --- | --- | --- |
| `general_male_b` — Brian British | `65c0b8155c464a648161af8877404f11` | **REJECTED PERMANENTLY / GLOBAL DO-NOT-USE** | Artificial, mechanical, flat delivery. Never generate new clips with this Fish voice ID, cast it to any NPC, import its donor audio to runtime, or register existing clips. Earlier rejection was Mark-only; this 2026-11-03 decision supersedes it globally. Retain archived donor files for provenance only, not runtime use. |
| `guard_male_b` — Dramatic Character Male | `7a18a1851d2649108c48ec9f2c80eb2c` | **Accepted provisionally** | Theatrical but usable; consider blacksmith or another guard/watchman, **not Mark Hornblower**. Role fit to be confirmed. |
| `general_female_b` — Hannah | `9a9cf47702da476aa4629e2506d4a857` | **Accepted** | Good, pleasant voice; Molly is a candidate, not yet a locked NPC assignment. |
| `hunter_male_b` — Cowboy | `a2cecd3eda8b44178b7f1bc1379edae0` | **Accepted provisionally** | Average but usable. Jacob Hunter or a different NPC is possible; do not assume this voice was Jacob's V3 voice without verifying V3 assignment. |

Implementation invariant: blocklisted Fish voice IDs must remain excluded irrespective of speaker profile aliases or future additions. All remaining S2 speakers and individual clip verdicts stay pending further review.

### S2 second listening round — 2026-11-03 (author decisions)

**Superseded casting holds:** Casual is now approved for male farmer, Warm Conversational for general female. The mixed-source concern below is retained as file provenance history, not a defective-UUID finding or current bank-wide casting veto.

- `general_male` / Casual Male: **HOLD — suspected inconsistent actual speaker**. `general_male_farewell_01.mp3` sounds pleasant, whereas `general_male_exhausted_01.mp3` sounds raspy/like a different voice. Both currently map to Fish voice ID `c2a3921fd7024b9189cb912bdfe5266a` in the QC ledger. Investigate source/generation provenance per file; **do not silently treat the shared catalog ID as proof of identical audible identity**. No bank-wide casting approval yet.
- `general_female` / Warm Conversational: **HOLD — suspected inconsistent actual speaker**. `general_female_greeting_01.mp3` sounds flat, `general_female_exhausted_01.mp3` bright and emotional. Both currently map to `5e3be339f2df45e6a1a338bb2ce94800`. Verify generation/source provenance before admitting this bank as a consistent speaker. No blanket rejection/approval.
- `guard_male`: **accepted**; author notes Mark Hornblower's separate voice sounds better. This is not a proposal to recast Mark.
- `hunter_male` / Arthur (`bd22266aba38416cb602e90ce651520c`): **accepted; author selects for Jacob, the hunter**. Verify named-character key / assignment before runtime integration. V3 quest docs call the hunter Jacob Bowman (not 'Jacob Hunter' as a surname).

All above are listening/casting judgments, **not** transcript validation or global per-clip QC verdicts. Keep the ledger's unheard rows pending, especially for the two inconsistent banks.


### S2 male Fish Audio candidates — author bookmarks (2026-11-04)

The author bookmarked the following **candidates**, not approved castings or recordings. The IDs below come from the supplied Fish Audio profile URLs; no generated clip, voice consistency, licensing, or runtime suitability has been verified.

| Fish voice / profile | Fish voice ID | Author listening impression | Possible use (not assigned) |
| --- | --- | --- | --- |
| [FairyTail 1](https://fish.audio/m/689b47ca83dd48dba90b160affb8a118) | `689b47ca83dd48dba90b160affb8a118` | Clear male voice, slight accent, somewhat storytelling-like but good | General male candidate |
| [george](https://fish.audio/m/372ef39bf5bf4fd38c5c56bce607aba6) | `372ef39bf5bf4fd38c5c56bce607aba6` | Calm, slightly raspy male voice with a slight accent | Older male character candidate |
| [Rick Sanchez](https://fish.audio/m/d2e75a3e3fd6419893057c02a375a113) | `d2e75a3e3fd6419893057c02a375a113` | Energetic, mildly sarcastic and slightly raspy male voice | Characterful male NPC candidate |

These candidates are separate from the existing `general_male` casting decision, which remains unresolved. Before producing replacements, select and audition an actual Fish Audio speaker. Do not alter the clip registry, casting table, or Q90 gap computation based only on bookmarks.

### S2 approved male voice direction — 2026-11-04

**Historical direction, narrowed by the 2026-11-05 map:** FairyTail→general middle-aged male, george→general old male, Rick→male fisher. No automatic alternative cast for Piotr/Piers or other unresolved profession slots.

**Author decision:** use these Fish Audio bookmarked voices for different NPC purposes (casting direction; not clip QC or completed implementation):

- **FairyTail 1** — Fish voice ID `689b47ca83dd48dba90b160affb8a118`: primary `general_male` for adult men.
- **george** — Fish voice ID `372ef39bf5bf4fd38c5c56bce607aba6`: `general_old_male` for older men.
- **Rick Sanchez** — Fish voice ID `d2e75a3e3fd6419893057c02a375a113`: `general_male_v2` as an alternative speaker for per-NPC assignment, potentially suitable for fishermen; do not lock it exclusively to the fisherman profession.

Each NPC retains one selected speaker across utterances (never randomly switches voice per line). Within eligible adult male general candidates, keep the author's approved **equal casting weights**; apply age, gender, role and named-character restrictions first. The older male speaker is age-eligible, not a requirement to retroactively change an existing NPC voice with age progression. No generated clips for these three voices have yet passed QC, and this decision does not authorize unverified audio in runtime. S3/S5 should use these approved targets when assessing voice coverage and recording needs; precise internal speaker identifiers remain implementation choices.

### S2 further author listening decisions — 2026-11-03

**Superseded for casting:** Laura→Anna, Expressive Female→Kasia, Hetalia Russia→male shepherd. Historian remains unassigned. Suspected source mismatches in existing files still require per-file QC; they do not reopen these selected UUIDs.

- `merchant_female_b` (catalog: Laura): usable mature female voice, but not for Kate/Kasia Hornblower. Author says sampled voice does not sound like Laura; verify actual source ID.
- `merchant_female` (catalog: Expressive Female): greeting sample fits merchant Kate/Kasia Hornblower; source ID likely correct but not independently verified.
- `shepherd_male_b` (Sleepless Historian): accepted, calm male voice; final NPC role undecided.
- `shepherd_male` (Hetalia Russia): accepted; author recognizes voice in the samples. Fish bookmark describes female voice; verify gender metadata/role before casting.
- `mark_hornblower` (Friendly Male Voice, `2adcdee4b3ce4b648dc16ea65430ea76`): **accepted for Mark Hornblower**. Listened to daily, danger alert and farewell samples. Keep separate from other guard voices.

These are casting judgments, not individual transcript-QC verdicts. Unverified source IDs must not be treated as proven.

---

## Global exclusions and asset gates — final cleanup

British-female (`82a3ef4504a6441e9a07acdaaf5349c1`) is globally rejected by
the author for insufficient expression. Brian British's permanent rejection
remains in force. The [decision registry](../../assets/voice-qc/author-decisions.json)
owns content-bound dispositions and confirmed identities. Historical catalog bank
UUIDs do not identify a recording. Positive author identity comments, seven
age-compatible keeps and all transcript QC remain distinct.

No assignment in this document is implemented by the cleanup. Runtime still
uses existing role/gender/age pools; Q88/Q89 remain separate work.
The [catalog](CATALOG.md) records retained assets, not runtime admission.
Girl voice, age transitions, Rudolf and question-mark slots remain undecided.

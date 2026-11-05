# Author-approved voice replacements — 2026-11-05

The [structured backlog](regeneration-backlog.json) is the per-recording authority:
exactly six entries, original catalog and generation text, ASR text, proposed text,
separate historical/target speaker fields, removal hashes and every tracked text
reference found before cleanup. [Author dispositions](author-decisions.json) are
bound to the historical ledger Git blobs. Neither file changes casting or
transcript/context verdicts. No audio was generated.

| Original filename | Intended use | Expected replacement speaker | Proposed replacement text |
| --- | --- | --- | --- |
| `general_male_danger_alert_01.mp3` | Male farmer / danger alert | Casual Male Speaker | Look out! Stay clear! |
| `general_male_farewell_01.mp3` | Male farmer / farewell | Casual Male Speaker | Take care out there. |
| `general_male_greeting_01.mp3` | Male farmer / greeting | Casual Male Speaker | Hello, traveler. Good to see you. |
| `general_male_old_greeting_01.mp3` | General old male / greeting | george | Good to see you. Been traveling far? |
| `general_male_young_farewell_01.mp3` | General male young / farewell | **Unresolved** | See you later! |
| `general_male_young_greeting_01.mp3` | General male young / greeting | **Unresolved** | Hello there. How are you? |

Current npc-065 casting explicitly approves Casual Male Speaker
(`c2a3921fd7024b9189cb912bdfe5266a`) for male farmers and george
(`372ef39bf5bf4fd38c5c56bce607aba6`) for general old men. These are replacement
targets, not verified historical generator UUIDs. In particular the old greeting
has **no verified historical UUID**. The two `young` filenames do not determine
child eligibility or a Fish UUID; Little Lem is approved for boys, not all young
recordings. Resolve that age/role assignment before production.

All replacement texts remain proposals requiring author approval before any later
generation. The danger proposal preserves warning meaning without claiming a
wolf; the young greeting removes assumed unfamiliarity; the farewell omits the
historical supplier-only extra sentence. Existing ASR evidence is preserved,
including matching transcripts for two rejected recordings: identity rejection
is independent of transcription/context quality.

## Integration and recovery

Both copies of each rejected recording were removed: donor `docs/v3-donor/voices/mp3/`
and public `public/sounds/voices/` (12 MP3 files total). All same-hash Git-tracked
MP3s were checked, including differently named files, backups and references;
there were no additional identical copies. The three general adult manifest
entries and the male greeting translation were removed. The age files were
already unregistered. Missing coverage follows existing silent/text-only behavior;
valid profession-specific pools continue to work. No alternate speaker is installed.

Keep the historical ledger/audit JSON, calibration, catalogs, generation history
and dated inventory/coverage documents. Removed catalog entries are marked
`removed-author-replace`; their prompts and bank labels remain historical evidence.
The 317 ledger rows remain byte-for-byte unchanged. Their `inV1Public` flags and
the audit's public-copy fields describe the historical snapshot. Live inventory is
311 donor files, 103 public root files; six backups and three public references
remain untouched.

To recover evidence outside the active asset tree:

```sh
git show <historicalCommit>:<removedPath> > /tmp/recording.mp3
```

Use the exact commit/path/SHA256 from each backlog entry. Markdown regeneration
needs only the committed audit and structured decisions, not removed audio.
Historical embedding extraction requires a separate historical checkout; see
[CLI instructions](../../../scripts/voice/IDENTITY-QC.md).

After later generation, require source, identity, transcript, gameplay context and
listening QC. Preserve original historical content bindings; replacements need
fresh QC evidence. Do not automatically re-add manifest URLs. The old general
bank reaches more roles than the approved farmer cast, and age-specific playback
requires the separate Q88 casting/age work. These are future integration gates,
not blockers to this bounded cleanup. Q90's 87 approved takes and the named draft
packet remain unchanged.

## Pending decisions and validation

Seven `suspected-wrong-speaker` British-female cases remain `pending` with their
audio intact. In total the disposition snapshot has seven `keep`, six `replace`
and 304 `pending`; identity comments in other categories do not imply disposition
approval. The seven kept age clips still have unresolved UUIDs; keep only confirms
the author's age assessment. Existing identity overrides and all transcript-QC
verdicts are unchanged.

Automated checks cover historical Git blob recovery for all 12 removed paths,
317-row ledger preservation, remaining donor/public content, absence of rejected
hashes among all tracked MP3s, all static runtime voice URLs, and reconstruction,
category moves, idempotence and conflicting-edit rejection in the report renderer.
See the [cleanup report](../../research/v1-revival/2026-11-05--npc-voice-cleanup.md)
for executed checks and results. Listening/browser verification was not performed.

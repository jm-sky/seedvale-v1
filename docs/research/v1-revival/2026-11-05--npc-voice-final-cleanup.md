# Final NPC voice cleanup and donor migration — 2026-11-05

All six stages completed on V1 `main`, starting at `4646b07e`. V1 remains the
source of truth. No audio generation, new casting policy, simulation change or
new runtime admission was performed. Technical validation only; no listening or
browser/runtime observation is claimed.

## Permanent authorities and evidence

- [CASTING.md](../../design/npc-voices/CASTING.md): approved Fish UUIDs, character assignments, undecided slots and dated casting history.
- [CATALOG.md](../../design/npc-voices/CATALOG.md): full donor semantic/generation metadata, current storage gates and original V1 catalog archive.
- [Author decision registry](../../assets/voice-qc/author-decisions.json): content-bound identities, dispositions and global exclusions; report regeneration never writes it.
- [Baseline inventory and final destinations](../../assets/voice-qc/migration-inventory.json): every scoped MP3, SHA256/Git blob, intended-source evidence, basename mentions, runtime usage and final path.
- [Migration actions](../../assets/voice-qc/migration-actions.json) and [deletion manifest](../../assets/voice-qc/deletion-manifest.json): exact copies, reasons, affected references and recovery commits.
- [Regeneration manifest](../../assets/voice-qc/regeneration-backlog.json) / [readable backlog](../../assets/voice-qc/REGENERATION-BACKLOG.md).
- [Machine-readable validation summary](../../assets/voice-qc/final-cleanup-validation.json).

## Counts and preservation

| Measure | Final result |
| --- | ---: |
| Canonical retained bank MP3s in `public/sounds/voices/` | 265 |
| Retained bank recordings including archive-only Brian British | 303 |
| Archive-only Brian British recordings | 38 |
| Unique alternate merchant backups retained in archive | 6 |
| Archived named reference paths | 38 |
| Total retained MP3 paths / distinct audio contents | 347 / 341 |
| Named reference aliases using relative symlinks (no repeated audio bytes) | 6 |
| Donor-only bank recordings moved to canonical public storage | 170 |
| Donor-only Brian British bank recordings moved to archive | 38 |
| Donor named references moved to archive | 38 |
| Redundant byte-identical donor/public bank copies removed | 95 |
| Newly removed British-female recordings / MP3 copies | 8 / 16 |
| Total rejected recordings / MP3 copies removed, including earlier cleanup | 14 / 28 |
| Regeneration tasks: previous runtime coverage / optional | 14: 7 / 7 |

The inspected baseline contained 458 MP3 paths: 311 donor bank, 103 public root,
38 named references, six backups and **zero** public `references/` files. The
earlier report's three public references were not present and are not claimed as
migrated/deleted. Baseline distinct audio contents: 349; final: 341. Exactly eight
newly rejected unique contents account for the difference. The original six
rejections predated this baseline. No other unique audio was lost.

All seven explicitly kept age-compatible recordings and every positively assessed
recording remain available with unchanged original audio hashes. Keeping those
age clips does not invent historical UUIDs or change gender/age playback policy.
Author cells (`Old-man`, `Old-woman`, `Little-Lem`, named voices, `matches`, tentative
comments) are preserved exactly. Final dispositions: **7 keep, 14 replace, 296
pending**. Transcript/context QC remains separate: all 317 historical verdicts
are still pending, and canonical storage is not a QC pass.

Brian British's existing permanent global exclusion remains in force. Its 38
bank recordings are archived rather than made playable. British-female is now
globally rejected for insufficient expression. Only the eight explicitly confirmed
recordings and identical copies were removed in this session; no additional
recording was classified/deleted from a similarity winner alone. Its historical
named reference remains outside the playable tree as QC evidence.

## Complete rejected-recording list

| Recording | Rejection | Replacement coverage |
| --- | --- | --- |
| `campfire_female_weather_answer_02.mp3` | Author-confirmed globally rejected British-female | runtime-coverage-restoration |
| `campfire_female_weather_question_01.mp3` | Author-confirmed globally rejected British-female | runtime-coverage-restoration |
| `general_female_agree_01.mp3` | Author-confirmed globally rejected British-female | optional-coverage |
| `general_female_farewell_01.mp3` | Author-confirmed globally rejected British-female | runtime-coverage-restoration |
| `general_female_greeting_01.mp3` | Author-confirmed globally rejected British-female | runtime-coverage-restoration |
| `general_female_quest_complete_01.mp3` | Author-confirmed globally rejected British-female | optional-coverage |
| `general_female_quest_declined_01.mp3` | Author-confirmed globally rejected British-female | optional-coverage |
| `general_female_thanks_01.mp3` | Author-confirmed globally rejected British-female | optional-coverage |
| `general_male_danger_alert_01.mp3` | Previously author-rejected individual take | runtime-coverage-restoration |
| `general_male_farewell_01.mp3` | Previously author-rejected individual take | runtime-coverage-restoration |
| `general_male_greeting_01.mp3` | Previously author-rejected individual take | runtime-coverage-restoration |
| `general_male_old_greeting_01.mp3` | Previously author-rejected individual take | optional-coverage |
| `general_male_young_farewell_01.mp3` | Previously author-rejected individual take | optional-coverage |
| `general_male_young_greeting_01.mp3` | Previously author-rejected individual take | optional-coverage |

SHA256, original Git blob, all 28 removed copy paths, recovery commits and affected
references are recorded per filename in the deletion manifest. The six earlier
rejections remain traceable through their original cleanup commit. All 317 ledger
rows, raw identity scores, calibration and ASR texts remain byte-for-byte unchanged.
Exact old identity configuration files are archived so their pinned hashes remain
verifiable after current configuration paths move.

## Runtime references and gameplay boundary

This session removed `general:female:greeting` and `general:female:farewell` from
`src/ai/npcVoiceLines.ts` and the corresponding greeting translation from
`src/ui-vue/npcDialogueGreeting.ts`. The earlier cleanup had already removed
`general:male:greeting`, `general:male:farewell` and `general:male:danger_alert`.
No alternate speaker/semantic intent was registered to replace them. Missing
coverage follows the existing silent/text-only behavior. Profession-specific
pools and the existing resolver/fallback algorithm were not changed.

`src/ai/campfireTalk.ts` no longer lists the two complete weather exchanges
containing the rejected female question/answer. Their valid male partner clips
remain stored for future pair restoration. Work and road exchanges remain intact;
the original selection algorithm and RNG draw shape remain unchanged. No work/road
line was substituted into a weather exchange.

There are 63 distinct production-source voice URLs, including template-literal
campfire paths, and all exist. None references a rejected hash. The 170 migrated
canonical files were not automatically added to a selector or manifest. Q88/Q89
speaker-constrained casting, intentional coverage limits and age policy remain
separate work. The active named production packet's 16 old donor `source_file`
mentions now use canonical paths; Q90/named UUIDs, texts and recording IDs are
unchanged and verified against the starting commit.

## Donor/archive state and tooling

**Remaining files in `docs/v3-donor/voices/`: none.** The empty local directory was
also removed. Current tools, runtime, permanent design docs and active production
source paths have no dependency on that location. Original paths remain only in
historical snapshots, provenance inventories, deletion/recovery records and dated
recon/history. Other V3 donor archives were not rewritten.

The permanent archive is `docs/archive/voice-donor/`: Fish production notes, raw
generation history, greeting/interaction drafts, historical review, original V1
catalog, exact historical QC configs, named references, rejected-speaker bank and
unique backups. Archive notices distinguish dated instructions/casting from V1
authority. Six named references use relative symlinks to identical retained bytes;
QC tools follow them. Use a checkout preserving symlinks when transporting the
reference set. No backup was deleted or admitted based on its matching basename.

`voice_assets.py` resolves retained bank files through the migration inventory.
ASR regeneration uses all 303 retained bank recordings and preserves cached
historical rows and authorized missing rows. Identity reruns use current archived
references and retained files; the 14 deleted originals reuse historical scores
with explicit `historicalEvidence` / removed-availability fields. The CLI refuses
to overwrite the historical audit: current reruns require another output path.
Markdown rendering reconstructs decisions from JSON and rejects stale bindings
or conflicting author-cell edits before writing.

## Executed validation

| Check | Result |
| --- | --- |
| `python3 -m unittest discover -s scripts/voice -p 'test_voice*.py'` | 16 passed |
| Targeted Vitest: voice resolver, bark limiter, campfire pairs, dialogue greeting | 49 passed |
| ESLint on changed TypeScript files | Passed |
| `pnpm run build` (includes `vue-tsc --noEmit`) | Passed; large-chunk advisory |
| Full cached ASR ledger regeneration | 303 available files, 317 historical rows retained; output unchanged |
| Identity CLI with `--cache-only` and a separate `/tmp` output | 340 hits, zero misses/extractions, no model initialization; 303 retained contents + 14 explicitly historical rows; zero target errors |
| Historical and current identity Markdown rendering | Passed; author cells/dispositions reconstructed |
| Every baseline retained path → final SHA256; deleted paths → historical Git content | Passed |
| No rejected playable hashes, duplicate physical voice content, missing runtime URLs or lost catalog filenames | Passed |
| Active production-path existence and unchanged Q90/named script content | Passed |
| Permanent owner/index local links and `git diff --check` | Passed |

The preflight CLI's IPC socket was blocked by the sandbox; the equivalent
`node --import tsx scripts/claude/pre-implementation.ts npc-065` completed.
The identity reference set still reports the historical unmapped KID reference;
no UUID was guessed. No full-suite, browser, listening or perceptual/runtime
verification is claimed. No benchmark or gameplay performance claim was made.

## Future production gates; no cleanup blockers

The requested cleanup and migration have no remaining author-decision blocker.
Future generation still requires approval of replacement text/context. Two young
male replacements require an explicit age/role speaker assignment; their expected
replacement UUID is deliberately null. This did not prevent the already approved
deletion. Existing unresolved casting slots (including Rudolf, girl voice and age
transition policy) are preserved in CASTING.md. They do not authorize new casting
or broaden runtime coverage.

No new audio was generated. The seven runtime restoration tasks are missing audio
coverage with established silence/text-only handling, not broken file URLs. The
other seven tasks are optional coverage and must not be automatically registered.

## Independently verifiable commits

1. `4d29c439` — final content-bound author/global decisions.
2. `33d920d6` — inventory, exact rejected copies and safe runtime removals.
3. `8247823a` — recording consolidation, archive and working QC path resolution.
4. `dfd6313c` — permanent design owners, historical production archive and links.
5. `14748a99` — complete 14-task regeneration manifest.
6. Final verification commit containing this report — provenance/coverage checks, final active packet paths and validation summary.

Each stage was committed and pushed to `main`. The revival index and master
roadmap link this report, registry and permanent design owners.

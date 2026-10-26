# Dialogue and voice documentation

**Created at:** 2026-10-24  
**Created by:** ChatGPT Sol (metadata normalization; earlier authors retained in git)  
**Updated at:** 2026-10-24  
**Updated by:** ChatGPT Sol  

- [NPC Voice Catalog](./NPC-VOICE-CATALOG.md) — Fish voice profile IDs, filename convention, semantic keywords, spoken English phrases, planned diversity (`*_b` slots), and actor profile `mark_hornblower` (6-line pilot). Status per clip: `in_repo` / `text_unknown` / `planned`. Optional `generation_input:` keeps the Fish prompt **with expressive tags**.
- [Saltmere daily conversations](./saltmere-daily-conversations.md) — 17 base player text sources (live code has additional topics) plus explicit SV01–SV15 shared-voice scene drafts, actor IDs, context gates and exact reuse; no new runtime or audio binding.
- [NPC greeting library](./greetings.md) — hierarchical text candidates for generated and authored NPCs: general, sex/age corpus variants, relation, local standing, known deeds and all 14 professions; conditional branches await their real suppliers.
- [Ordinary interactions](./ordinary-interactions.md) — reusable farewells, current-activity replies, existing work barks and weather lines, plus a supplier-based gap map for later situations.
- [Mark and Kate Hornblower dialogue pack](./saltmere-hornblowers-dialogue-pack.md) — 43 actor-authored text candidates; Mark Fish UUID + 6-line pilot handoff (2026-10-20); Kate still unbound.
- [Kate Hornblower canonical visual profile](./kate-hornblower-visual-profile.md) — author-selected variant 3, copper-auburn hair, merchant styling and image reference; concept only. 
- [Peter and Ann Woodward character profiles](./woodward-character-profiles.md) — personalities, couple dynamic, dialogue and visual guidance; editorial only.
- [Recorded-line replacement backlog](./recorded-lines-replacement-backlog.md) — exact filenames, current recorded text, proposed re-records and contextual gating; no MP3 changes.
- [NPC dialogue quality audit (2026-10-20)](../reviews/2026-10-20--185--npc-dialogue-quality-audit.md) — inventory, verified counts, new/planned coverage, review and Fish Audio handoff.
- [Voice production notes](./voice-production-notes.md) — Fish UUID taste ledger (Mark casting 2026-10-20) and post-batch listen/QC notes.
- [fish-generation-history-2026-10-09.json](./fish-generation-history-2026-10-09.json) — raw unique prompts scraped from Fish [Generation History](https://fish.audio/app/generation-history/) (2026-10-09).

This catalog owns **recorded phrases + voice-id mapping**. The current V3 inert projection is [npcVoiceManifest](../../src/game/audio/npcVoiceManifest.ts), with only three unverified Mark clips; [audio002](../plans/audio--002--npc-voice-and-social-dialogue.md) owns casting, exact-text resolution and session playback. Legacy resolvers are reference only. [Audio004](../plans/audio--004--npc-pair-voice-roi-production-queue.md) owns one staged NPC–player/NPC–NPC production queue: existing Mark QC first, then 16 accepted new central-cast clips, with casting, generation, QC and activation kept separate. It is not a second clip catalog or permission to generate.

MP3 generation is Cursor-lane (browser → fish.audio; no API, no runtime TTS). Treat only `in_repo` rows as present on disk. Resume notes for partial `*_b` batches live at the top of the Planned diversity section in the catalog. Recoveries from generation-history that are not listen-verified are marked 🟡 in the catalog notes.

**2026-10-20 editorial safety:** `merchant_female_b`, `guard_male_b`, `hunter_male_b` and `shepherd_male_b` planned scripts are revised in the linked review branch. If Cursor generated any MP3 after the reviewed HEAD, reconcile its actual contents **before** treating the revised text as the clip transcript. `general_male_b` and `general_female_b` (76 files) are already recorded and their catalog text was not revised.

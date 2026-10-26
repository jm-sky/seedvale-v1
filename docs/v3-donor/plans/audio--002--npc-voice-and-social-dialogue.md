# NPC voice, dialogue and social audio — V3 architecture and migration plan

**Status:** `planned` — independent review198: GO WITH AMENDMENTS, incorporated; implementation/runtime gates remain open
**A1 landed (inert):** 2026-10-23 — `data/npc/voiceCasting.ts`, `audio/npcVoice{Manifest,Resolver}.ts`, `scripts/gen-npc-voice-manifest.mjs [--check]`; all 3 Mark clips `unverified` (text-only until listen-QC, A0). A2/A3 still gated.
**Created:** 2026-10-21  
**Created at:** 2026-10-21  
**Created by:** ChatGPT Luna  
**Updated at:** 2026-10-24 (ChatGPT Sol; current-main voice queue reconciliation)
**Domain:** audio / dialogue / NPC  
**Roadmap:** [M4, M5/M6, M7, M9](../roadmap/ROADMAP.md)  
**Depends on:** [audio001](audio--001--world-audio.md); [SC0/S4 review193](../reviews/2026-10-20--193--sc0-s4-conversation-knowledge-architecture-gate.md); [review194](../reviews/2026-10-21--194--m4-daily-life-activation-plan.md); [review195](../reviews/2026-10-21--195--npc-needs-relationships-memory-architecture.md); [NPC003 integration notes](implementation-notes/npc--003--npc-daily-life-ai-implementation-notes.md); [Q-002](../state/QUESTIONS.md)  
**Finished:** —  
**Source-recon main SHA:** `bf7dd79b650ff59eb8a47925becf0baf0423bd66` (2026-10-21). Later documentation-only vegetation plan on main `731977eb25c0f49e1c73ab531ac49c1a0a0db268` does not change inspected NPC/audio sources.  
**Independent review HEAD:** `5c9f00cca49ea595ec5e8407dc9a834359afdef4`; [review198](../reviews/2026-10-21--198--npc-voice-independent-review.md). Inventory rechecked: 317 MP3, 399 catalog entries, no duplicate Git blobs; planning disposition D-ARCH-93.
**Scope:** Architecture, evidence, migration plan and QA only. No code, Save schema, MP3, Fish generation, live integration or closed runtime gate.

> This plan proposes implementation choices but does **not** supersede accepted D-ARCH-45 or D-ARCH-88…91, authorize live SC2, or assert that recorded/catalogued MP3s are playing in V3. Use [PROGRESS Now](../state/PROGRESS.md#now) for current blockers. Keep the F2-4b shared-clock and G1/G2/G3 critical path ahead of voice.

**Author-approved later social-audio integration (D-NPC-26, 2026-10-24):** V1's [campfireTalk.ts](../comparison/code/seedvale-v1/src/ai/campfireTalk.ts) and [npc-045](../reference/features/v1/npc/npc-045-campfire-spoken-conversation-pairs.md) provide six optional authored question→answer pairs already represented by MP3 assets, but **not** current V3 live campfire dialogue. After stable NPC gathering and actual `SocialPairs` pair completion have their own N-PAIRS acceptance, this **same audio--002 owner** may attach verified, compatible voice cues to a pair; silence when missing/incompatible is normal. No simulation effects from clip topic, no second audio scheduler, no new speech engine, no bypass of A2/A3/SC/listening gates, and **do not expand the three-line Mark pilot** as a side effect. [NPC003 §8](implementation-notes/npc--003--npc-daily-life-ai-implementation-notes.md#8-author-approved-social-life-v1v2v3-reconciliation-d-npc-26) is the behavioral contract; campfire speech is not a prerequisite for meetings.

**Current-main reconciliation (2026-10-24, `a1a44dce`):** the recon tables below are explicitly the 2026-10-21 baseline. Live NPC/player text conversation now exists (`SessionConversation` and `sceneSession`), including weather/activity suppliers and additional authored topics; do not treat SC2 as wholly detached from this historical table. A1 voice remains inert, only Mark is cast, and all three manifest clips remain unverified. This update closes no A0/A2/A3, S4 or N-PAIRS gate. [Audio004](audio--004--npc-pair-voice-roi-production-queue.md) now owns the shared player/pair **content-production order**, current evidence, full script review and budgets. Its proposed 1×-only, full-duration-fit pair admission and accelerated-time suppression require this owner's integration review; they do not change SocialPairs leases or the three-line Mark pilot. Catalog/QC/rights Q-002 and the exact-text/terminal-permit contracts below remain binding.

## 1. Recommendation

**Reuse the existing V3 Web Audio engine and existing M4/S4 conversation system.** Split: (a) authoritative dialogue/knowledge/eligibility decides *what* is said, (b) immutable NPC identity/casting decides *whose voice*, (c) a checked manifest resolves *which recorded utterance actually says those words*, (d) existing session-owned audio plays/attenuates/stops it. Playback has **zero causal feedback** into simulation.

The smallest useful live pilot, *only after SC2/SC3b real NPC activation*, is the three already recorded, exactly authored Mark Hornblower lines: `mark.greeting`, `mark.road.reply`, `mark.leave.reply`. Pure manifest/casting fixtures can proceed earlier. **Readiness after amendments: A1 GO (inert three-line scope); A2 GO WITH AMENDMENTS (detached implementation with the contracts below, not runtime acceptance); A3 NO-GO at reviewed HEAD.** Neutral dialogue never requires M9 reputation/known deeds, and a missing clip never blocks text.

## 2. Recon — current code is the truth

### 2.1 V3 foundations and missing wiring

| Current source | What really exists (at baseline) | Missing for NPC voice |
|---|---|---|
| [audioTypes.ts:7–23](../../src/game/audio/audioTypes.ts#L7-L23), [audioEngine.ts:106–145](../../src/game/audio/audioEngine.ts#L106-L145) | One lazy/unlocked AudioContext, buses master/ambient/effects/ui, reserved but **not created** voice bus | Actual voice routing and spatial speech lifecycle |
| [audioEngine.ts:180–193](../../src/game/audio/audioEngine.ts#L180-L193), [voiceLimiter.ts](../../src/game/audio/voiceLimiter.ts) | One-shot shared limiter and budgets | A bounded speech scheduler, without introducing a second global cap |
| [samplePlayer.ts:123–136](../../src/game/audio/samplePlayer.ts#L123-L136), [samplePlayer.ts:189–216](../../src/game/audio/samplePlayer.ts#L189-L216), [samplePlayer.ts:228–256](../../src/game/audio/samplePlayer.ts#L228-L256) | Lazy fetch/decode and LRU; first unready play returns 0. Long sounds can be truncated/excerpted; two pending decodes max | Preload, full non-excerpt speech, token-safe late readiness and stop |
| [soundManifest.ts:1](../../src/game/audio/soundManifest.ts#L1), [catalogue.ts:15–41](../../src/game/audio/catalogue.ts#L15-L41) | Generated top-level OGG catalog; no voice MP3 binding | Separate validated voice manifest; do not mix speech into OGG stems blindly |
| [sessionAudio.ts:61–108](../../src/game/session/sessionAudio.ts#L61-L108), [sessionAudio.ts:118–151](../../src/game/session/sessionAudio.ts#L118-L151), [sceneSession.ts:329–336](../../src/game/session/sceneSession.ts#L329-L336) | Audio engine, gesture unlock, seeded presentation RNG, ambience/footsteps/cues in continent session | NPC utterance dispatch, scoped source pose, session-token guards |
| [audioDebug.ts:6–28](../../src/game/audio/audioDebug.ts#L6-L28), [audioBudgets.ts:10–35](../../src/game/config/audioBudgets.ts#L10-L35) | `__sv.audio` basic counters; ≤8 one-shots, desktop 6 loops, decoded ≤48 MiB desktop/24 MiB phone-profile, idle unload after 120s | Reasons for voice denied/played, pending decode, actor/clip observability |
| [settings.ts:1–20](../../src/game/save/settings.ts#L1-L20) | Persisted master, ambient, effects, ui — **no voice volume field** | Voice gain derives from effects for pilot; separate slider only with reviewed settings migration |
| [households.ts:5–21,53–64](../../src/game/data/npc/households.ts#L53-L64), [types.ts](../../src/game/data/npc/types.ts), [lifeStage.ts](../../src/game/data/npc/lifeStage.ts) | Stable NPC/cast identity, `Sex`, age, profession, G01 Mark, G02 Kate | Pure stable casting projection; no mutable voice identity store |
| [conversationTypes.ts](../../src/game/data/dialogue/conversationTypes.ts), [ordinaryConversations.ts:28–63](../../src/game/data/dialogue/ordinaryConversations.ts#L28-L63), [conversation.ts:31–46](../../src/game/sim/npc/conversation.ts#L31-L46) | 17 Saltmere scenes, stable line/option/semantic IDs and pure authorized response resolution | Exact voice-to-published-line contract |
| [talkEngagement.ts:11–50](../../src/game/sim/npc/talkEngagement.ts#L11-L50), [ConversationPanel.vue:1–28](../../src/game/ui/dialogue/ConversationPanel.vue#L1-L28) | Detached single engagement (20/60 game-second leases, session/generation/token/view), detached read-only UI | Real SC2/session/actor bridge still gated; do not create another talk engine |
| [reputation.ts:1–9](../../src/game/data/character/reputation.ts#L1-L9), [review193](../reviews/2026-10-20--193--sc0-s4-conversation-knowledge-architecture-gate.md) | Reputation is display placeholder; accepted directional social/owned facts contract exists | No active reputation/deeds producer, no invented thresholds or knowledge |

Canonical status: [review193](../reviews/2026-10-20--193--sc0-s4-conversation-knowledge-architecture-gate.md#L12-L24) accepts SC0/S4 architecture **only**; [PROGRESS](../state/PROGRESS.md#L20-L25) confirms SC1a/SC1b and SC3a *detached*, G1+G2 before live SC2, G3/Map/Save for SC4. [Review195](../reviews/2026-10-21--195--npc-needs-relationships-memory-architecture.md) keeps shared Vitals, directed relationships, owned knowledge, **no second memory system**. Far NPC progression remains M8.

### 2.2 Reconciled asset audit (Git tree, not legacy README)

The pinned non-truncated main Git tree contains **317 tracked MP3 files** directly in `public/sounds/voices/` (total compressed Git blob bytes: **9,763,534**). Parsed [NPC-VOICE-CATALOG.md](../dialogue/NPC-VOICE-CATALOG.md) filename headings and status lines: **399 unique entries, 317 `in_repo` and 82 `planned`**, precisely 317:317 existing-file match, **zero** catalogued shipped file missing, **zero** orphan MP3s, **zero** duplicate filenames. Presence is **not** listening verification or playback integration.

| Pool | Shipped MP3 | Coverage caveat |
|---|---:|---|
| general male 16 + male B 38; general female 16 + female B 38 | 108 | B timbres share scripts; `general_male_b` has negative taste notes |
| guard male 22 + B 40; hunter male 21 + B 38 | 121 | Some guard phrases too harsh for ordinary greetings |
| merchant female 17 + B 38 | 55 | Does not provide male merchant identity automatically |
| shepherd male 4 + B 10 + misspelled `shepard` 1 | 15 | Explicit typo alias; do not rename silently |
| campfire male 6 + female 6 | 12 | Some lines assert unsupplied road/news knowledge |
| actor-specific Mark Hornblower | 6 | Only 3 are exact matches for present M4 ordinary scene |
| **Total** | **317** | **82 other entries planned, not playable** |

The [2026-10-20 audit185](../reviews/2026-10-20--185--npc-dialogue-quality-audit.md#L17-L39) reported **185/208** at its earlier baseline; [audio001](audio--001--world-audio.md#L10-L17), [PORT-LEDGER](../state/PORT-LEDGER.md#L184-L194) and [public sounds README](../../public/sounds/README.md#L1-L34) still state “138 voice MP3” or “no audio wired”. Treat those statements as historical. Do not mark voice port ✅ until the actual runtime lands. The old V1 hardcoded manifest lists just 60 existing URLs, not the 317-file inventory.

### 2.3 Proven code — keep / adapt / drop

| Snapshot | Disposition and evidence |
|---|---|
| V1 [npcVoiceLines.ts:28–35,83–103,293–334](../comparison/code/seedvale-v1/src/ai/npcVoiceLines.ts#L293-L334) | **ADAPT** deterministic profile+age/sex, `npc-specific → profession+age → profession → general+age → general` precedence, `trader→merchant` alias; **DROP** `Math.random` variant choice, role-only “unique” voice identity, static 60-file list. No unverified wrong-transcript fallback. |
| V1 [npcBarkRequest.ts:57–95](../comparison/code/seedvale-v1/src/ai/npcBarkRequest.ts#L57-L95) | **ADAPT** resolve→admit→play; **DROP** process-global callback and sim-layer playback. `livestock_danger→danger_alert` allowed only with truthful separate bark transcript. |
| V1 [npcBarkLimiter.ts:40–119](../comparison/code/seedvale-v1/src/ai/npcBarkLimiter.ts#L40-L119), [npcBarkPolicies.ts:10–35](../comparison/code/seedvale-v1/src/ai/npcBarkPolicies.ts#L10-L35) | **ADAPT** optional/urgent priority, per-NPC/area/episode rolling budgets. Former optional 4 per 300s is a *candidate*, not a new sim law. Avoid duplicate global one-shot limiter. |
| V1 [npcVoicePlayback.ts:9–31](../comparison/code/seedvale-v1/src/audio/npcVoicePlayback.ts#L9-L31), [createWorldAudio.ts:1–91](../comparison/code/seedvale-v1/src/audio/createWorldAudio.ts#L1-L91) | **ADAPT** distance/floor/cave/audio isolation; **DROP** Three.js AudioLoader/AudioListener cache and second backend. Prior ref=1.5m/max=28m is calibration reference, not adopted V3 constant. |
| V2 [voiceDirector.ts:7–29](../comparison/code/SeedVales-v2/src/game/audio/voiceDirector.ts#L7-L29) | **ADAPT** range 25m, per-NPC cooldown 20s, single voice and urgent preemption; values provisional, playback clock not gameplay clock. |
| V2 [voiceDirector.ts:32–69](../comparison/code/SeedVales-v2/src/game/audio/voiceDirector.ts#L32-L69) | **DROP** direct `hungry<20`, `exhausted<15`, NPC goal inference or quest status guesses; events must come from real owning producer. |
| V2 [catalogue.ts:19–57](../comparison/code/SeedVales-v2/src/game/audio/catalogue.ts#L19-L57) | **ADAPT** same-sex role/general fallback and file grouping, **not** automatic semantic clip under unrelated text. |
| V2 [voices.ts:7–39](../comparison/code/SeedVales-v2/src/game/audio/voices.ts#L7-L39), [samples.ts:1–76](../comparison/code/SeedVales-v2/src/game/audio/samples.ts#L1-L76) | **KEEP existing V3 ports** `audio/voiceLimiter.ts` and `audio/samplePlayer.ts`; extend in place. |
| V1 [dialogue.ts](../comparison/code/seedvale-v1/src/ai/dialogue.ts), [dialogueTemplates.ts](../comparison/code/seedvale-v1/src/ai/dialogueTemplates.ts), V2 [conversation.ts](../comparison/code/SeedVales-v2/src/game/sim/conversation.ts) | **CONTENT / REFERENCE ONLY**, no legacy UI/monolith, randomized personality buckets or parallel social dialogue manager. |

## 3. Ownership, semantic contract and data flow

### 3.1 Authority separation

- **Dialogue meaning/eligibility**: current `data/dialogue` scenes and `sim/npc/conversation`; later existing S4 NPC social/knowledge and domain quest/needs owners supply truth. An NPC must actually know a fact, personally have an eligible directed relationship, observe an event, or have an authentic need/mood before claiming it. No audio imports in sim/world/save/data.
- **Stable speaker voice**: pure `data/npc/voiceCasting.ts` projection from stable `NpcId` and immutable/canonical cast key, sex, original profession, age band (only if recorded), with explicit Mark G01 override `mark_hornblower`. Profession is not an immutable personality, E01 technical hunter is retired, and Kate G02 does not inherit Mark. Derived identity not persisted by default. For A1 use only explicit `reservedId === mark_hornblower` casting, cross-checked against the canonical G01 binding; G02/Kate and every other identity return uncast. Do not infer Mark from a name, profession, ordinal alone or spouse. No pool hash/slot framework in this slice. Later shared casting must freeze an explicit content mapping (or an immutable versioned slot table) from immutable identity: never modulo the current catalog length or select the first available recording. Profile fallback is resolved at casting time, not separately per intent; a missing line in the chosen profile stays silent/text-only. Actor override → compatible original role/sex/age slot → compatible general slot is a later **casting** precedence, not permission to switch timbre mid-conversation. Adding clips cannot recast existing actors; recasting is an explicit content change. Runtime aging/job changes cannot silently alter this identity.
- **Recorded clip resolution**: a reviewed version-controlled `audio/npcVoiceManifest.ts` mapping `clipId, file, voiceProfileId, intent, exactLineId?, actualSpokenText, englishLocale, qcStatus`. Catalog owns Fish UUID/phrase/generation input, compiled manifest is a validated runtime projection. One source of content truth, no second manually divergent transcript registry.
- **Playback**: one existing `SessionAudio → AudioEngine → SamplePlayer`; one Web Audio context, voice subgain and spatial Web Audio nodes; transient scheduling only. `ConversationPanel` renders committed `lineId + effectiveText` and emits existing commands. An independent bark UI may render its actual transcript; it must not impersonate a chosen NPC response.

### 3.2 Proposed data seam (types illustrated, not an implemented extra service)

```ts
type AuthorizedUtterance = {
  npcId: NpcId;
  actorKey: string;
  intent: string;
  lineId: string;
  effectiveText: string;
  talkToken: TalkToken | null; // ordinary engaged lines; terminal replies use the permit below
  viewRevision: number | null;
  committedEventId?: string;
};

type RecordedClip = {
  clipId: string;
  profileId: string;
  filename: string;
  intent: string;
  exactLineId?: string;
  spokenText: string;
  status: 'listen-verified' | 'unverified';
};

type VoiceResult =
  | { kind: 'exact-line'; utterance: AuthorizedUtterance; clip: RecordedClip }
  | { kind: 'independent-bark'; clip: RecordedClip; captionText: string }
  | { kind: 'text-only'; reason: string }
  | { kind: 'silence'; reason: string };
```

A `VoiceResult.exact-line` **must** match: (1) canonical speaker casting, (2) explicitly reviewed `lineId`, (3) its *actual spoken words equal already-authorized displayed `effectiveText`*. Normalize only unimportant whitespace/typographic punctuation; never drop an extra clause, interpolate unrecorded `{name}`, accept alternate grammar, assume voice from same semantic `intent` literally reads an authored line, or translate mismatching captions. `semanticIntent` permits an **independent** recorded bark only if it describes an actual trigger; its on-screen caption must equal its own spoken transcript, not the current selected dialogue line. Dialogue fallback is **text-only**; optional ambient cue fallback is **silence**. Missing file/QC/profile/line match fails closed and changes no simulation.

**Terminal reply exception (A3):** `resolveConversationChoice` returns `closes: true` for Leave; `TalkEngagement.end` immediately clears its slot, while `ConversationView.ended` can still show the closing reply. Do not retain gameplay engagement until the audio ends. At the same accepted Leave boundary, publish the authorized final view and release S4; the session may retain exactly one transient presentation permit for that closing line, bound to session/generation, actor, old engagement ID, final view revision and monotonically increasing utterance sequence. Only a decoded/unlocked clip may start immediately in that publication turn. No late completion may start it. The permit ends at playback completion, explicit panel Close/Escape, a new talk, actor/context loss, danger, explicit pause/hidden, accepted replacement or disable/disposal. A missing/unready clip creates no retained terminal audio permit. It cannot accept commands, renew a lease or award effects. Timeout/urgent-need goodbyes remain text-only in A3; danger has none. This is a terminal presentation state in the existing session bridge, not a second engagement engine.

**Mark exact pilot:**

| V3 `G01` authored line | MP3 under `public/sounds/voices/` | Condition |
|---|---|---|
| `mark.greeting`: “Good day. Is there anything I can help with?” | `npc_mark_hornblower_greeting_01.mp3` | Exact, pending listening |
| `mark.road.reply`: “If you're out late, keep to the road. It's easier to find you if you need help.” | `npc_mark_hornblower_road_advice_01.mp3` | Exact, pending listening |
| `mark.leave.reply`: “Look after yourself, will you? I'll see you around.” | `npc_mark_hornblower_farewell_01.mp3` | Exact, pending listening |

Compare [V3 lines](../../src/game/data/dialogue/ordinaryConversations.ts#L28-L30) with [catalog transcripts and Fish generation_input](../dialogue/NPC-VOICE-CATALOG.md#L3514-L3541). The other three recorded Mark files (`daily`, `danger_alert`, `thanks`) have no matching current SC1 response or active event producer (SC1 itself is detached); stage only. The [Mark/Kate pack](../dialogue/saltmere-hornblowers-dialogue-pack.md#L86-L101) authorizes Mark's voice and six-line pilot, **not** Kate casting or remaining 37 planned character-specific lines. The recorded text's source prompt is not proof from listening.

### 3.3 Correct sequencing and isolation

```text
authoritative NPC/quest/needs/knowledge state + S4 engagement
  → eligible stable semantic intent + authored line + committed effects
  → session publishes real view/caption (existing token + revision)
  → pure casting + exact-line / independent-bark manifest check
  → audio-only admit: range/context/priority/decoded/budget
  → one Web Audio engine → spatial playback or silent no-op
```

Effectful S4 disclosure must synchronously commit owned MapKnowledge/LeadBook/relationship/quest consequences **before** publishing a fact-bearing subtitle or triggering voice ([review193 §§6–8](../reviews/2026-10-20--193--sc0-s4-conversation-knowledge-architecture-gate.md#L100-L134)). Audio start/stop, hearability, UI repaint/ack and file load must never commit/repeat effects, award Speech, mutate relationship, write NPC memory, reveal a secret or change an AI plan.

## 4. Audio engine scheduling decisions

**Single context/bus:** add `voice` to the existing internal mix; initially map its gain to already persisted **effects** and **master** settings. Do not add a `VolumeSettings.voice` field or save version in this pilot; a dedicated user slider needs a later settings/persistence review. Existing `AudioEngine.playOneShot` and `SamplePlayer` enforce global **8** one-shots and cap length by kind: full recorded speech needs a specifically admitted **non-excerpt, normal-speed** clip playback path; never randomly truncate, start from an offset, or apply speech rate jitter. Reuse existing limiter, never instantiate another global limiter or a Three.js audio backend.

**Separate scheduling levels:** S4 manual talk eligibility remains **≤2.5m** physical reach, floor, space, LOS, active actor, shared talk token and game-second 20/60 leases ([review193](../reviews/2026-10-20--193--sc0-s4-conversation-knowledge-architecture-gate.md#L66-L78)). Audio bark audibility begins at V2's candidate **25m** plus compatible spatial context; V1 1.5m/28m attenuation guides measured gain. For ambient optional barks start with V2's **20s per NPC** + V1 per-area/per-intent/episode policies; do not apply the ambient cooldown to suppress an explicit engaged reply. **One audible NPC speech at a time** is the pilot target; protected dialogue outranks optional chatter; urgent alert preemption is deferred to A4, after a genuine producer exists and stop has been verified; danger may always cancel an ordinary A3 voice without inventing an alert. No unbounded queued audio or retry loop.

**Order:** validate published token/current event (or the specific terminal permit) → exact asset/profile → distance/context/priority → decoded-and-unlocked check → reserve full decoded duration → play complete recording → release on actual completion/stop; a failed decode/play/refusal consumes **no** cooldown/area quota. `SamplePlayer.play` currently drops a first not-yet-decoded hit: preload Mark's three clips after legitimate nearby interaction/user gesture or render **text-only** on miss. For A2/A3, fetch/decode completion only warms the shared cache and **never starts playback**. A publication miss is text-only with no retry on repaint, unlock or resume. Validate session ID, generation, token/terminal permit, view revision, utterance sequence, actor and physical context synchronously before every start. A future wait-for-ready feature would need the same full revalidation after each await; it is not part of this pilot. No “late greeting” after close, rapid option change, accepted Load, New Game, disposed session, render switch, or paused context. Rejected load preflight preserves previous live conversation. Audio cue handling is transient; no queue, cooldown or voice-profile ID stored in Save.

**Spatial:** per-source PannerNode/gain via current listener pose/heading, source pose from actual actor at emission, bounded update only for active voices. Reject cave/surface, floor and closed-door leakage using the actual SC2 physical-admission adapter; `AudioEnvQuery` currently supplies terrain/water/wear only and is **not** an actor/LOS/door query. A2 accepts injected immutable pose/context fixtures; A3 reuses the proven SC2 adapter, failing closed when unavailable. Preserve cave/space identity (not merely two `inCave` booleans); render-only culling never implies the NPC lost identity. A3 is pushed one authorized speaker, so no NPC discovery scan or new spatial candidate producer is needed. A4 must name and bound its real producer before ambient scheduling. Test indoor/nearby/behind-wall and out-of-range cases in an actual desktop browser.

**Time and determinism:** talk uses shared **game seconds**; needs, causes and knowledge retain their existing owner-specific shared-clock projections; audio overlap/cooldown/latency by **presentation/AudioContext time** so accelerated game time does not flood sound. Cosmetic variants may use a separate seeded `audio.*` RNG or immutable per-utterance hash, never simulation RNG; audio disabled/locked/muted produces bitwise-equivalent simulated consequences (not necessarily identical audible timing). No audio state persistence or audio feedback to AI.

### 4.1 Minimum backend and lifecycle contract (review198)

- **Exact asset seam:** extend the same `SamplePlayer` with allowlisted exact-file preload/play for `voices/<filename>.mp3`, using the existing base URL/cache/decode quota. Its current `variantOf` reads OGG `CATALOGUE` only; passing an MP3 filename as an existing sound ID will not work. No runtime catalog scan, second player/cache or random filename selection.
- **Resource ownership:** one opaque playback handle owns source, gain/panner, full-duration global reservation and buffer pin. `stop` is idempotent; disconnect/silence before releasing the audible slot; `onended` cleans up exactly once and cannot clear a newer handle. Release after a successful start must **not** use `VoiceLimiter.cancel(kind)`, which restores pre-start cooldown, nor affect a newer booking of the same kind. Keep existing SFX API compatible; narrow reservation identity/release support is sufficient, not a new limiter. Reserve the decoded full duration, not the default2s; `trim` can only shorten. Explicit engaged-speech rule has zero ambient cooldown and maxSame1. Refuse speech unless `ctx.state === running`; `playOneShot` currently checks only live parts.
- **Real retained PCM:** pin every active one-shot file alongside playing/fading loops until source cleanup, so eviction cannot hide a buffer still retained by a source or decode a second copy. Count each unique retained buffer once in the existing48MiB/24MiB cache budget. Do not claim this bounds browser decode peak: at most2 in-flight jobs additionally retain compressed bytes and temporary PCM. Record their peaks separately and reject oversized completed buffers. An OOM/uncapped retention result stops acceptance, not a budget increase.
- **Bounded preparation:** warm only the three allowlisted pilot clips, at most2 total existing fetch/decode jobs; use a finite3-entry preparation cursor to service the third after a slot frees. This is asset warming, never an utterance queue. One attempt per clip per session for A2/A3 failed fetch/decode; explicit later session/user retry only, no frame-loop network retry. Check disposal before decoding and before cache admission; abort fetches on disposal where supported, while non-cancellable decode completion only drops its result. Test old-engine completion while a replacement engine is running; report any residual in-flight overlap rather than calling it live cache.
- **Active cancellation:** a newer accepted reply stops the older speech even when the newer clip is unavailable; repeated paint of the same utterance never restarts it. Close/Escape, actor execution removal, wrong space/range/LOS, danger, pause/hidden, disable and accepted replacement stop speech and invalidate its permit. Render-only culling does neither. View/utterance identity, not `lineId` alone, distinguishes a new selection from a repaint.
- **Pause and replacement:** stop/discard NPC speech on explicit/nested pause or hidden notification, before context suspension; resume/unlock never replays it. Ambient follows audio001's existing policy. Successful or failed **Save** does not change generation or restart/close talk; a separately opened pause modal may stop speech under the pause rule. Failed/superseded **Load** preflight does not invalidate talk/voice; accepted publication calls transient invalidation through the existing `resetTransients`/generation seam before any subsequent start. New Game/scene replacement disposes the old session. No Save schema edits or audio-owned lifecycle generation.
- **Time:** retain the existing shared clock's real/game/calendar distinction. Talk leases use `gameDt`; needs use their owning domain's clock projection (not blanket game seconds); playback/rate/cooldown use presentation/context seconds. No extra clock or catch-up utterances at1×/4×/40×. Stop on owner invalidation, never wait for sound completion to release simulation.

## 5. Social and M4/M5/M6/M7/M9 integration

Use the accepted [directional relationship and owned-fact policy](../reviews/2026-10-20--193--sc0-s4-conversation-knowledge-architecture-gate.md#L80-L126). A NPC's own opinion of the player, settlement reputation *when an authoritative owner exists*, knowledge/facts with provenance, known witnessed deeds, actual environmental context and verified needs/mood influence **which authored line is eligible**. Do **not** invent a global “friendly score”, reputation thresholds, free-standing Mood component, memory engine, rumour propagation or knowledge from player proximity/render visibility. Kin is a factual edge, not a guaranteed attitude. E01's technical hunter profession grants no hunter knowledge. NPC-to-NPC facts cannot be inferred from spouse/settlement membership. [Draft greetings](../dialogue/greetings.md#L10-L30) and [ordinary interactions](../dialogue/ordinary-interactions.md#L10-L31) are candidate text, **not** active policy.

Stable voice timbre should remain tied to casting; actual emergency can select a *different pre-recorded take/intent* from the same speaker, not dynamically pitch-transform the person based on reputation/affection. No unconditional `hungry<20` or legacy V2 mood thresholds; M5/M6 genuine producer first, combat cues only behind M6 Combat G1–G4. M7 quest accept/complete voice only on an actually committed quest transition, not by UI click or title; quest audio scope/licensing Q-002 outstanding. M9 known-deed speech requires the NPC's actual owned knowledge, not a globally displayed badge. Neutral/basic M4 voice must not wait for any M9 system.

## 6. MP3 manifest, production and QC

**Bounded A1 generator** (three explicit line bindings only; full-pool coverage deferred to A4): `scripts/gen-npc-voice-manifest.mjs` reads canonical [catalog](../dialogue/NPC-VOICE-CATALOG.md) + audited explicit line-binding/QC table and checks `public/sounds/voices/`; emits `src/game/audio/npcVoiceManifest.ts`. Avoid two independently editable versions of Fish UUID, text and transcript. Validate unique filenames, status, actual file, exact reviewed line ID, sex/profile/age, path safety, aliases (`shepard` explicitly), no `planned` clip used, no stale bindings. Bind listen-QC evidence to the exact asset Git blob/content digest, transcript and profile revision; changing bytes at the same filename or changing text resets eligibility to unverified. A source prompt is not the observed transcript; a discrepancy is quarantined and corrected in the catalog after listening, never silently stripped by the generator. A1 may emit all three entries as unverified and its production resolver must then return text-only; positive exact-play tests use explicit verified test fixtures. Runtime never calls Fish or scans files; no new MP3s produced now. Keep OGG `soundManifest.ts` separate unless integration specifically proves need to amend it.

Later A4 coverage reporting may list every `(profile, sex, role, age-band?, intent, lineId?, status, listenQC)` slot and gaps across the 17 M4 scenes and future events; 317 filename matches do **not** mean 317 safely readable authored lines. Strict transcript QC is necessary: [recorded replacement backlog](../dialogue/recorded-lines-replacement-backlog.md#L15-L23) flags `general_male_farewell_01.mp3` because its generation prompt contains an **extra sentence** absent from the printed caption. Existing recordings with wrong perceived wording/tone are quarantined from exact-line playback, not silently re-labelled. [Audit185](../reviews/2026-10-20--185--npc-dialogue-quality-audit.md#L41-L55) flags hostile guard tone/campfire invented information; [production notes](../dialogue/voice-production-notes.md#L8-L30) reject mechanical `general_male_b` for living NPC speech and approve Mark's `Friendly Male Voice` Fish UUID `2adcdee4b3ce4b648dc16ea65430ea76`.

**Later Fish batch SOP (not authorized here):** confirm commercial license and spend budget (Q-002), approved actor or shared pool voice UUID, a precise English script, separate expressive generation tags and generation history; create recordings only in authorized Fish Cursor/browser lane; QC each actual played MP3 for spoken word match, volume, clipping, silence, pronunciation, pace, voice consistency, duration, decoding and any implied false fact; only then atomically update MP3, catalog `in_repo`/transcript, binding QC and generated manifest. Text/script edit without new matching take must disable an old exact binding. No automatic full pack or Kate casting.

## 7. Reversible implementation slices (future; exact touchpoints)

| Slice | Concrete files / scope | Acceptance and gates |
|---|---|---|
| **A0 inventory / QC** | Existing `docs/dialogue/NPC-VOICE-CATALOG.md`, `public/sounds/voices/`, QA backlog and scripts. | Recheck counts against execution HEAD; resolve Mark 3 spoken transcripts by listening; no audio generation. |
| **A1 pure casting + manifest** | **New** `src/game/data/npc/voiceCasting.ts` + `voiceCasting.test.ts`; **new** `src/game/audio/npcVoiceManifest.ts`, `npcVoiceResolver.ts` + tests; **new** `scripts/gen-npc-voice-manifest.mjs`. Read existing `data/npc/{types,households,lifeStage}.ts`, `data/dialogue/ordinaryConversations.ts`. | Stable G01 cast and 3 exact mappings, G02 uncast, no wrong-sex/transcript/age/profile substitute, no shared-pool/hash allocation yet, manifest check reproducible, asset-digest QC invalidation and default text-only; **inert**. GO after review198 amendments; no G1/G2 or listening prerequisite for inert data/tests, no playback authorization. |
| **A2 speech engine path** | Extend `src/game/audio/{audioTypes,audioEngine,samplePlayer,voiceLimiter,audioDebug}.ts` and existing `audioEngine.test.ts`, `samplePlayer.test.ts`, `fakeAudioContext.testkit.ts`; a small transient speech slot/helper + tests (separate `npcVoiceDirector.ts` only if ownership warrants it; no bark scheduler yet); extend `src/game/session/{sessionAudio,sessionAudio.test}.ts`; budgets only if measured. | One context/bus, preload, full non-excerpt clip, spatial isolation, cancellation, global8, 48MiB, unlock, delayed decode fences, counters and §4.1 reservation/pinning/preload contract; still detached from NPC. GO WITH AMENDMENTS for implementation; MEDIUM audio feature review at integration. |
| **A3 M4 exact Mark live pilot** | Existing future/added `src/game/session/sessionConversation.ts` S4 bridge (check whether landed), `src/game/session/sceneSession.ts`, `sessionAudio.ts`, current SC1 resolver, SC3 view; integration/browser tests. | **After G1/G2 + S4-BASIC-ACTIVATION and actual live SC2/SC3b actors**, exact 3 G01 sentences audible, all other lines in the 17-scene catalog remain truthful text-only, token/lifecycle and terminal-reply permit prevent ghosts. NO-GO at reviewed HEAD; A1+A2 verification and A0 per-asset listen-QC required, release rights remain Q-002. Preserve194 scheduling after G3; no new technical Speech/M9 prerequisite. No new Save or Speech. Coordinate with F2-4b shared-writer ownership. |
| **A4 contextual barks / M5/M6** | Actual NPC life/needs/Combat session event adapter + `audio/npcVoiceDirector.ts`, policy tests. | Legitimate state/event suppliers; no hardcoded legacy hunger thresholds; optional area/cooldown priority; Combat G1–G4 for combat producers. |
| **A5 M7 quest voice** | Existing M7 quest dialogue/outcome producer, manifest exact authored `lineId` bindings and later authorized Fish batch. | Committed quest transition only; Q-002 rights/budget; no MP3 as fake quest line. |
| **A6 M9 social/known deeds** | Existing approved directional NPC relationships, `npcKnowledge`, settlement known-deed/reputation producers, `data/dialogue` eligibility and manifest. | Own knowledge/provenance, local exposure, no duplicate social/save owner; SC4 requires G3/Map/Save + S4-DISCLOSURE-INTEGRATION. |

**Model recommendation within the requested lanes:** A0 inventory/checking GPT (Grok optional for mechanical catalog audit, never listening/rights sign-off); A1 GPT; A2 Opus for cross-module resource/lifecycle implementation, Astra or GPT for the one feature review; A3 Opus for the session seam, Astra for consequential boundary questions only; A4 Opus, A5 GPT after real M7 contracts are frozen (otherwise Opus), A6 Opus. No model or extra review substitutes for named gates or human listening. A0 inventory is already checked here; merge its three-line QC record into A1/A3 evidence, do not repeat a whole catalog audit unless changed. A4–A6 remain deferred producer-specific work, not an early universal director.

Use [Fast Development Policy](../guidelines/fast-development.md#L14-L33): A1 largely LOW inert contracts with targeted tests; A2/A3 MEDIUM presentation integration plus already-required HIGH S4/NPC gates; any authoritative Map/Save/social change HIGH at its existing gate. Do not request repeated SC0 architecture rounds or reopen closed E-01. No unnecessary rendering/GPU benchmarks for voice unless measurable GPU/visual integration cost changes.

## 8. Unit, integration, browser, listening and performance acceptance

| Level | Mandatory oracles |
|---|---|
| Manifest/unit | Unique every shipped filename; missing/renamed status fails build; `planned` not playable; `shepard` alias explicit; clip profile/sex/age; G01 3 exact and G02 uncast; authored text+spoken mismatch including extra sentence/interpolation fails closed; consistent line ID through text reorder; stable cast across pool additions and load. |
| Audio/unit | Context locked/gesture unlocked, suspend/resume/dispose; preload missed/decoded/failed, two pending decodes; no replay after stale token; full duration no excerpt/rate drift; ≤1 active NPC speech and total ≤8 global one-shots; per-NPC/area/episode budget only charged when successfully started; danger priority and optional suppression. |
| Session/S4 integration | Actual NPC availability/distance **2.5m inclusive**, LOS/wrong-floor/door refusal; selected line published first and fact effects committed first; view token + generation + expiry, 20/60 game-second ties, accepted load/new game invalidates, failed save/load preflight preserves session, render-only stream-out doesn't invent new identity, mute or 404 yields same simulation/knowledge/XP. |
| Browser desktop | Saltmere G01 open greeting→road→leave audible and caption-exact; Kate/other unrecorded lines text-only; simultaneous voices, closed door/cave/surface vs outdoors, 25m bark range, 40× sim speed, paused/hidden app, low volume, audio disabled, slow network decode, rapid close/reopen and Save/Load: no late ghost audio. Observe debug trace alongside ears; automated tests alone cannot prove quality. |
| Listening | Verify Mark 3 actual takes under ambience, word-for-word subtitle, consistent timbre, intelligibility, clipping/pop, correct distance and interruption; separately hear known `general_male_farewell_01` discrepancy before future exact binding. Do not label `in_repo` as listened. |
| Budgets | Preserve ≤8 total one-shots, ≤6 desktop ambient loops, decoded ≤48MiB desktop (24MiB low profile), ≤2 pending decodes, 120s idle unload; target initially ≤1 audible NPC line; preload only tiny near-term candidate subset (not all 317). Measure p95 cost of voice admission, decoded use and actual overlap before asserting new ms budget. No global NPC scans. Desktop-first D-M2-32 means no mobile device acceptance gate. |
| Diagnostics | Extend existing `__sv.audio` non-authoritative view with actor/clip/intent/current token, active/queued/pending decode and aggregated reasons: `no-exact-line`, `mismatch`, `unverified`, `out-of-range`, `wrong-context`, `cooldown`, `busy`, `global-cap`, `locked`, `stale`, `decode-failed`. Do not expose private NPC knowledge in diagnostics. |

**Additional review198 acceptance:** [review198 §5](../reviews/2026-10-21--198--npc-voice-independent-review.md#5-verification-matrix) supplies terminal-reply, pinned PCM, reservation identity, finite preload, pause/load, asset-replacement and measurable CPU/retention oracles. These are NOT RUN in this documentation review.

**Rollback:** flip off only session NPC voice playback (temporary feature flag) or remove a mismatched manifest binding; SC1/SC2 text, engagements, authoritative knowledge, ambient world audio, Save schema and quest effects remain identical. Cancel active/pending audio on disable. Do not use an audio event as an effect receipt.

## 9. Risks, unresolved decisions and review checklist

- **Unresolved Q-002:** Fish commercial permission, monthly budget, global per-character vs shared voices and later quest dubbing. Default shared pools and M7 pilot; Mark's actor-specific Fish casting already accepted; new generation requires explicit authorization. Existing-asset pilot still needs release rights verification.
- **Content risks:** catalog status does not imply matching audible transcript; general B repetitive lines, mechanically voiced profile, aggressive guard greetings, unsafe campfire news, no Kate profile. Resolve via conservative binding+human QC, not broad re-record.
- **Engineering risks:** first-use decode miss, old callback after new session, accidental global limiter duplication, truncated speech, uncontrolled memory and cave leakage; A2 acceptance explicitly addresses each.
- **Social risks:** hypothetical attitude/reputation thresholds, false shared knowledge, status-triggered legacy cues, alternate dialogue engine, voice-derived mood state, audio feedback into simulation. Existing D-ARCH-88…91 prohibit these paths.
- **Plan alternatives reviewed:** dropping voice entirely wastes Mark pilot; wholesale V1 Three.js audio/monolithic NPC port duplicates V3 ownership; V2 goal-inference adds unsupported real needs; runtime TTS adds network/cost/nondeterminism. All rejected for A1–A3.
- **Deferred choices:** shared-pool casting version/migration, precise gain/spatial curve and A4 25m/20s tuning, future independent voice slider. A1 freezes only Mark; A2/A3 use immediate ready-only playback and §4.1 handles. Do not reopen these pilot decisions to add a generic scheduler.

### Independent architecture review checklist — disposition in review198 (runtime obligations remain open)

1. [ ] Re-pin latest main, recheck filenames/catalog statuses and changed behavior since the baseline; verify evidence links and no canonical `audio002` duplicate.
2. [ ] Confirm one authoritative SC1/S4 `TalkEngagement` and one AudioContext; no code dependency from sim/world/save to audio, second knowledge/relationships engine or DSP identity drift.
3. [ ] Verify Mark `G01` stable identity and exact three spoken line bindings; Kate `G02` cannot inherit Mark profile; 3 other Mark MP3s are not falsely active.
4. [ ] Prove exact spoken transcript vs published `effectiveText`, interpolation, extra recorded sentence, languages, status `planned`, QC and honest text-only/silent fallbacks.
5. [ ] Check voice profile pool stability across extra recorded candidates, streaming and Save/Load; no index random draw or unreviewed `*_b` adoption.
6. [ ] Verify bus, 8 global one-shot cap, no excerpt/truncation, preload failure, async cancellation and voice stop/onended; stress fast conversations, context close and slow decode.
7. [ ] Test spatial listener/source alignment, cave/wall/door leaks, 25m bark vs 2.5m talk boundary, nearest-NPC query cost and no full-world scanning.
8. [ ] Confirm audio randomness/state never affect deterministic sim, UI ack/effects, knowledge/relationship/quest outcomes or persistent Save. Test accepted vs rejected load generation.
9. [ ] Check social and M5/M6/M7/M9 claims only from actual owners, no legacy needs thresholds or speculative reputation/known-deed propagation.
10. [ ] Map A0–A6 to current G1/G2/G3/F2/S4/Map/Save/Combat/M7 gates and active session writer; do not block neutral audio on M9, or bypass SC2 activation.
11. [ ] Demand concrete unit/integration/desktop-browser/listening/budget/diagnostic evidence for A2/A3; no fictitious audio readiness based on a catalog.
12. [ ] Return **A1 / A2 / A3 individually GO, GO WITH AMENDMENTS or NO-GO**, severity-ranked exact corrections, file touchpoints, accepted/deferred assumptions, and a small next implementation packet.

**Recommended next implementation slice after review198:** **A1 — pure profile casting + generated MP3 manifest + tests for three Mark exact lines**, with no live session coupling or new audio assets. Continue existing F2-4b/G1 work in parallel; A2 audio backend then A3 live Mark only when their actual gates permit.


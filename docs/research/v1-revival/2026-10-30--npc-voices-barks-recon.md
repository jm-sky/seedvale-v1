# NPC voices / barks recon (Q11)

**Date:** 2026-10-30 · **Author:** Claude Sonnet 5.5 (queue Q11) · **Scope:** source recon only, no runtime change, no listening pass. Scope origin: [Strategic Brief §3](./STRATEGIC-BRIEF.md) "NPC voices/dialogue recon scope".
**Evidence tags:** ✅ read in current source · 🟡 inference · ❓ needs author listening / play session.

## 1. Rain bark during snow — root cause (✅)

It is **not a weather-state mapping bug**. The shelter reaction works on the real `WeatherState`; the bark carries no weather information at all.

- `weatherShelterPressure` (`src/ai/weatherPressure.ts`) correctly produces pressure for `storm`, `snow` and rain types (separate thresholds), nothing for clear/cloudy/fog.
- `NpcAgent.beginSeekShelter` (`src/ai/NpcAgent.ts` ~6609) calls `this.requestBark('weather_shelter')` — intent only, `currentWeather` is not consulted.
- `GENERATED_VOICE_MANIFEST` has exactly one clip per scope for that intent (`src/ai/npcVoiceLines.ts` ~235): `general:male`, `guard:male` → *"Rain's coming down hard. Better get inside."* (identical generation input, [v3-donor catalog](../../design/npc-voices/CATALOG.md) lines 404/719); `general:female` → *"This weather's getting worse. Time to get under cover."* (weather-neutral).
- So any male/guard NPC sheltering from **snow or storm** says "Rain's coming down". Female NPCs are fine. The catalog already flags this as "quality debt" (rain presupposed by the intent).

**Fix candidates (all workload-neutral, presentation only):**

| # | Candidate | Cost | Notes |
| --- | --- | --- | --- |
| F1 | Pass `WeatherState.type` into the bark request; the male/guard rain clip plays only for rain types, snow/storm fall back to the weather-neutral female-text pattern or silence | tiny code, **no new asset** | Silence for male NPCs in snow is a reduced-content compromise → author choice |
| F2 | Split the intent: `weather_shelter` (neutral) + `weather_shelter_rain` (rain-only), re-key manifest | small code, needs a **new neutral male/guard recording** | Cleanest; matches "richer weather-specific barks" scope |
| F3 | Add snow / storm / fog-specific intents | code + several recordings | Depends on voice-budget; fog produces no shelter pressure today, so a fog bark needs a different trigger |

Recommendation 🟡: F2 (rename existing clip to the rain variant, record one neutral male + guard line); F1 as the interim code change. Neither is applied here — F1's silence variant needs the author's call ("dropped content").

**Update 2026-10-30 (author, second answer):** dedup approved (§2 candidate (a)) and new lines: more rain/storm/snow variants plus other situations (F3) → queue Q30 (dedup), Q31 (lines).

**Update 2026-10-30 (author):** target = F2 (new recordings later). Interim F1 landed: snow → silence, storm → rain clip (`weatherShelterBarkAllowed`, `src/ai/weatherPressure.ts`).

**Update 2026-10-31 (Q31):** F2/F3 contract landed — weather-specific intents `weather_shelter_rain|storm|snow` with a fallback chain in `resolveNpcBarkVoiceUrl` replace the interim F1 gate (same audible result with current assets); line script for author generation: [Q31 line script](./2026-10-31--q31-npc-bark-line-script.md).

## 2. Cooldown / dedup / repeated weather lines (✅ unless marked)

Limiter: `src/ai/npcBarkLimiter.ts`, policies `src/ai/npcBarkPolicies.ts`, wiring `createApp.ts:924` (one shared `NpcBarkLimiter`).

`weather_shelter` policy: per-NPC cooldown 900 sim-s, per-**area** window 300 s max 2, shared optional budget 4 per 300 s per area. All time is `NpcAgent.simClock`.

Defects / gaps:

1. **No repeat suppression of the clip itself.** `pickFromUrlPool` is `Math.random` over a pool that has **one entry** for every weather key → every male NPC in a settlement plays the identical file. Two admitted per 300 s window → "same line twice in different voices" is the designed outcome; a third arrives as soon as the window rolls (area window 300 s vs. a 900 s per-NPC cooldown), so "three times in ~6 min" is consistent with the policy (🟡, not reproduced).
2. **Budget is per settlement, not per audible area.** Two nearby settlements (or a settlement + road camp) each get 2 weather barks per window; the player hears the union. 🟡
3. **Budget is spent by barks the player can't hear**, and conversely there is no dedup by what the *listener* heard recently. 🟡 (Presentation could track "last weather bark played near the player".)
4. **Cooldown clock is `simClock`.** Behaviour under time-skip (`simClock` jump) — all cooldowns instantly expire or the window empties; not verified. ❓
5. Admission happens after asset resolution, so the random clip choice is made before admission; a rejected bark discards it harmlessly (✅ intended).
6. `requestBark` is a no-op without `household.settlementId`/`economy.settlementId` (`barkAreaKey`) → roaming/no-household NPCs never bark; may be intended. ✅ observed, intent ❓.
7. Trigger edge: `beginSeekShelter` barks only when `!shelterSettled`; `shelterSettled` resets when the decision leaves `seekShelter` (`NpcAgent.ts:3448`), so a flickering pressure near the threshold re-triggers barks (bounded by the cooldown above). 🟡

**Fix candidates:** (a) add a small "recently played clip" memory in the limiter/bark layer (no repeat of the same URL within N s per area) — cheap; (b) multiple weather clip variants per scope (assets); (c) tie the budget to distance from the listener (needs player position in the request — new input, hence a design call).

**Update 2026-10-31 (Q30):** candidate (a) landed — per-area+intent last-clip memory in `NpcBarkLimiter`, resolver avoids it when alternatives exist (one-clip pools unchanged).

## 3. Dialogue text/voice vs. relation, reputation, quest state (✅ unless marked)

- **Opening greeting** (`src/ui-vue/npcDialogueGreeting.ts`): the clip is chosen by `resolveNpcVoiceLine(npc,'greeting')` (scope/gender/age only); `relationLevel` is used **only** in the text-only fallback (`familiar` lines for friendly/trusted). Whenever a clip with a transcript is picked, a stranger and a trusted friend get the identical greeting. **Reputation and renown are not used in dialogue voice/text at all.**
- **World reaction** (`NpcAgent` ~3283, `reactionChance.ts`): `reactionTierForRelation` maps `trusted` → enthusiastic, `friendly` → warm, else normal (→ `attention` vs `greeting` clip). Reputation/renown only change the *chance* of reacting (`computeReactionChance`), by design (comment in `reactionChance.ts:117`).
- **No negative tier:** `RelationLevel = stranger | acquainted | friendly | trusted`; a hated/low-reputation player gets the same warm `greeting` clip as anyone at `acquainted` (🟡 whether a negative state exists elsewhere — `Reputation` type not read in depth; ❓).
- **Quest state:** quest offer/accepted/declined/complete have dedicated intents (`npcVoiceLines.ts` list, `store.ts` ~1273 chooses `quest_declined` vs `farewell`); no voice variation by quest *progress* (e.g. in-progress reminder) found. 🟡
- **Missing variations:** pools are mostly 1–3 clips per scope/gender; many scope/gender combos (e.g. female guard/hunter/shepherd for several intents) fall to `general:*` (hierarchy in `buildNpcVoiceLookupKeys`). Role identity is therefore often lost in barks. 🟡 (coverage table not generated here).

**Fix candidates:** add relation-gated greeting selection (`familiar` clip pool for friendly/trusted — needs recordings or transcripts for existing clips); add a low-reputation tier only after the author decides on hostile-NPC semantics (open design question).

## 4. V1 NPC–NPC conversations vs. V3 variants (✅ V1 side, 🟡 V3 side)

- V1: `src/ai/campfireTalk.ts` — **6 authored exchanges**, 3 topics × opposite-gender only, selected `Math.random` over the matching gender pool (so effectively 2 variants per topic/gender pair, 1 per direction). Weather exchanges ("Cold tonight, isn't it?" / "Feels like rain by morning.", "Think this wind will last?" / "Maybe. It usually turns before dawn.") are **not conditioned on actual weather** — same issue class as §1 (a "rain by morning" answer in clear summer weather). No dedup/cooldown seen in `campfireTalk.ts` itself (the pairing owner is in the Social place code, not read here ❓).
- V3 donor ordinary dialogue sets: `docs/v3-donor/voices/docs/ordinary-interactions.md` lists `ordinary.weather.*` drafts with explicit conditions (e.g. "Heavy actual rain, safe shelter known"). These are **selective adaptation candidates for P5**, as condition tables (not code), keeping V1's `campfireTalk` / Social Place authority. No port approved.

## 5. Richer weather barks (assessment)

Needs, in order: (1) the intent/weather contract from §1 F2/F3, (2) voice recordings per weather type for ≥ general male/female + guard (budget decision, author), (3) a trigger for non-shelter weather remarks (fog, light rain) — today only shelter pressure triggers a bark, and `weatherShelterPressure` is 0 for fog/cloudy/clear and light rain. ❓ author decision on whether weather remarks should exist without shelter behaviour.

## 6. Recommended follow-ups (not queued as work)

1. **D4-exception candidate (workload-neutral):** F1 — pass weather type to the bark and stop male/guard NPCs saying "Rain" in snow/storm; needs author choice between *silence* vs. *new neutral clip* (→ queue §3 question).
2. Cheap dedup: remember the last played bark URL per area and skip an immediate repeat (no assets needed).
3. Condition campfire weather answers on real weather (select only compatible exchanges) — data-only change in `campfireTalk.ts`; needs weather input at the pairing call site.
4. Relation-aware greeting + hostile tier → P5 content phase, after author decisions.

Not verified: any in-game listening, time-skip behaviour of limiter, `Reputation` negative states, Social Place pairing/dedup.

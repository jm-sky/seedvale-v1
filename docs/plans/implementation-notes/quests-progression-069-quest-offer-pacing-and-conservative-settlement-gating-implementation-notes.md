# Implementation Notes: Quest offer pacing and conservative settlement gating

## Current architecture and corrections

- `quests-progression-033` and `quests-progression-034` are already implemented on `main`. Reuse `QuestManager.eligibleNotOfferedCandidates()` → `selectableOfferIds()` → `admitOffersForGiver()`, `rankQuestOfferCandidates()`, decline suppression and the derived ordinary active-cap of 2.
- Giver pacing is **not per-quest progress**. Keep it out of `QuestProgressEntry` and `QuestManager.exportProgress()`; the latter is also consumed by generated-opportunity retention semantics. Add giver-level state to `QuestManager` and persist it alongside `quests.progress` / `quests.relations`.
- The source plan understates the persistence wiring. The concrete path is:
  - `src/quests/QuestManager.ts` — optional field on `QuestManagerInitial`, runtime giver map, export/reset;
  - `src/persistence/saveData.ts` — optional field on `SaveQuests` plus `isSaveQuests()` validation;
  - `src/app/saveState.ts` — write the exported giver cooldown map;
  - `src/app/createApp.ts` already spreads `initialSave.quests` into `initialQuestState`; once `QuestManagerInitial` accepts the field, preserve this restore path rather than adding a second loader.
- Keep the new save field optional. Older saves then mean “no giver cooldown”; no save-version bump is justified.

Suggested persisted shape:

```ts
ordinaryOfferCooldownUntilByGiver?: Record<NpcId, number>
```

## Cooldown integration

Put the pacing check in the existing eligible-`not_offered` candidate path, preferably in/under `eligibleNotOfferedCandidates()`, after source validity, authored availability and decline suppression. This makes dialogue admission, marker/list exposure and read-only offer selection agree automatically.

Only a `not_offered` ordinary candidate is blocked. Do not touch already `offered`, `active`, `ready_to_report`, report/hand-in or foreign-quest target interactions.

A bypass helper should have exactly this semantic:

```text
urgent || pacing === continuation
```

`exposure: 'story'` must **not** bypass giver pacing; it keeps only its existing exposure/cap/decline semantics.

Start the cooldown from the central successful outcome transition, not only from `resolveSuccessfulTurnIn()`. `applyOutcome()` is reached by report, choice/nonlinear and other outcome paths; after an actual transition to a `complete` outcome:

- ordinary completion → replace/set this giver's cooldown;
- urgent/continuation completion → do not create, clear or extend a cooldown;
- failed outcomes and `abandoned` / `invalidated` → no cooldown.

Use `def.giver.npcId`, never `giverName`.

For deterministic duration, existing quest code already uses the same local FNV-1a pattern (for example `guardEveningOfferWindow.ts`). A small quest-local helper is enough; do not add a general hashing abstraction for this plan. Hash a delimiter-safe key from:

```text
worldSeed + giverNpcId + completedQuestId
```

and map it to integer hours with `4 + (hash % 7)` (4..10 inclusive), then convert with existing `gameHoursToGameDays()` and add to `worldTime.getElapsedDays()`.

`reset()` must clear giver cooldowns. World rebuild must not: this is `QuestManager` progression state, not `WorldBundle` state.

## QuestOfferPolicy

Extend `QuestOfferPolicy` in `src/quests/quests.ts` with:

```ts
pacing?: 'ordinary' | 'continuation'
```

Missing means ordinary. Do not infer pacing from `quest_outcome`, `exposure: 'story'`, priority or quest id. Extend runtime definition validation only if the current validator explicitly validates offer-policy enum values.

Do not change `rankQuestOfferCandidates()` ordering for this plan. Pacing is an admission filter/bypass, not another ranking score.

## Exact continuation audit

Add `pacing: 'continuation'` to exactly one existing quest:

- `story:lost-treasure-chronicles:elder:dispute` in `src/quests/lostTreasureChroniclesElder.ts`.

Reason: the same elder finishes `elder:winter` and immediately says “Mam jeszcze jedną sprawę…”. A 4–10h pause is artificial.

Leave these ordinary:

- hunter profession I → II → III — successive jobs, not one immediate scene;
- hunter III → Hunters Brotherhood introduction and introduction → investigation — story exposure exists, but they are distinct beats and investigation additionally depends on a real habitat problem;
- `wilcza-jama` after `grozny-wilk` — it also requires authored relation state, so it is not an unconditional immediate continuation;
- `story:lost-treasure-chronicles:chronicle-search` — although it also unlocks from `elder:winter`, it is a larger next chapter. Keeping it ordinary is important: after winter, the dispute may bypass the cooldown, while chronicle-search remains paced. Otherwise the same elder could expose two story offers immediately;
- cemetery favour and chronicle deciphering — different givers / separate beats.

Add a focused regression for winter completion: dispute can be exposed immediately, chronicle-search cannot until the elder's ordinary cooldown expires. Completing the dispute must not extend or clear the cooldown started by winter.

## Urgent audit

Do not mark any current quest `urgent` as part of 069.

Current world-source contracts expose persistent problem/source state (for example wolf-den pressure and lost-livestock), but not a reliable “attack is happening now” signal. The plan explicitly forbids extending world systems just to manufacture urgency. Keep the urgent bypass implemented and tested with synthetic defs; future content can opt in when an authoritative immediate-crisis signal exists.

## RPG matrix renown gates

Apply only:

- `old-place-secret` → `renown >= 3`;
- `suspicious-transport` → `renown >= 3`;
- `settlement-agreement` → `renown >= 5`.

Important: `suspicious-transport` has two materialization paths in `rpgQuestMaterialization.ts`: the inline quest and `buildSuspiciousTransportCaveCacheQuest()`. Do not put the gate only in the inline builder. Prefer one small post-materialization helper in `materializeRpgQuestOpportunity()` that appends the matrix's approved renown prerequisite to the returned `QuestDef`, preserving any existing prerequisites. This keeps both variants identical.

The prerequisite remains settlement-local because `QuestManager.meetsAvailability()` reads standing using `QuestDef.settlementId`. For `settlement-agreement`, that correctly means the origin/giver settlement, not the target settlement.

Recon found multiple independent existing renown sources outside these three matrices (authored quests, profession/world quests, cave stories, badges/animal deeds), including rewards at or above the 3/5 thresholds. There is no circular dependency requiring one of these matrix quests to earn its own prerequisite. Do not add any further V1 social gates.

## Persistence/testing traps

- Extend `SaveQuests` / `isSaveQuests()`; do not add the giver timestamp to every `QuestProgressEntry`.
- `src/app/saveState.ts::buildSaveData()` must export the new map. Add save validation coverage for: field absent, valid numeric record, invalid value.
- Keep `generatedOpportunityRetention.ts` unchanged: a giver cooldown is not durable progress of one generated quest definition.
- Preserve `offerSuppressedUntilDay` as an independent per-quest mechanism.
- Preserve the max-2 ordinary active/ready giver capacity and all existing urgent/story capacity bypasses.
- Test the three matrix gates on the final materialized defs, including both suspicious-transport variants.
- Test a stale/already-offered quest remains offered when another quest completion starts the giver cooldown.
- Test save/load and `reset()`; the same seed/giver/quest must yield the same duration.

No UI change, scheduler, queue, new reputation owner or world-source urgency work is needed.

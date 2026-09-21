# Plan: Lost treasure expedition — external sponsor and local stakeholder flow

**Created:** 2026-09-21
**Status:** `planned` 📋
**Type:** fix
**Priority:** medium · **Effort:** S
**Depends on:** ~~quests-progression-027~~
**Domain:** `quests-progression`
**Subdomains:** `quests` `relationships`
**Tags:** `lost-treasure` `settlements` `dialogue`
**Roadmap:** -

## Goal

Fix the authored flow of the implemented lost-treasure expedition so its NPC roles make sense across the whole story and the player can reliably find an external sponsor.

The expedition is financed by a Merchant from another, larger nearby settlement. A local stakeholder in the home settlement connects that external commission to the missing expedition and provides the later local knowledge. The quest must never require the player to search blindly for an off-settlement NPC.

## Narrative roles

Keep the roles distinct and stable for the entire quest:

- **Sponsor** — an adult `trader`/Merchant from a different nearby settlement, preferably one larger than the home settlement. The sponsor financed the expedition, commissions the investigation and remains a valid recipient of the expedition journal at the terminal choice.
- **Local stakeholder** — an adult resident of the home settlement outside Kasia Hornblower's household. This person is connected to an expedition participant but does not need to share a surname or claim literal family relationship. Dialogue may describe a close contact, friend, partner, neighbour or other personal connection without inventing genealogy.

Do not swap roles merely to remove a dialogue click. The sponsor is the financier; the stakeholder is the local personal/information link.

If no preferred candidate exists, use deterministic fallbacks without synthesizing NPCs or relationships.

## Sponsor settlement selection and discoverability

Reuse real `SettlementDef` data. The binding/materialization layer must know the sponsor's settlement identity, name and position rather than retaining only a flattened NPC list.

Preferred sponsor selection:

1. adult `trader` in a different nearby settlement whose `VillageSize` is larger than the home settlement;
2. adult `trader` in another nearby settlement;
3. deterministic external adult fallback only if the current generated world cannot provide a Merchant.

Prefer the existing bounded nearby-settlement discovery used by RPG quest materialization; do not introduce a world-wide NPC scan or camera/streaming dependency.

Persist/reconstruct the quest from stable identities as today. Extend the deterministic binding with `sponsorSettlementId` (or an equivalent explicit field) rather than changing the meaning of the existing story/home `settlementId`.

Whenever the player is sent to the external sponsor, both dialogue and objective text must identify:

- sponsor name,
- settlement name,
- compass direction of that settlement relative to the home/story settlement.

Use an existing shared world/location direction helper if one exists at implementation time. Otherwise add the smallest reusable position-to-compass-direction helper; do not store N/S/E/W as quest state. Derive it from authoritative settlement coordinates. Prefer the established 8-way vocabulary N/NE/E/SE/S/SW/W/NW if compatible with current quest location wording.

Example intent, not fixed copy:

> Porozmawiaj z Janem w Brzezinach (NE).

The player must receive this information before being expected to travel there. Reuse existing settlement location knowledge/navigation when appropriate; do not create a quest-owned settlement registry or marker system.

## Local stakeholder selection

Select the local stakeholder from adult home-settlement NPCs outside Kasia Hornblower's household.

Resolve Kasia by the existing stable home identity/materialization contract rather than comparing display surnames. Household membership is the exclusion boundary; shared surname is not required for the selected stakeholder.

If Kasia or her household cannot be resolved under an existing-world fallback, choose another deterministic adult home NPC from a different household and keep the dialogue relationship-neutral. Do not invent a family link.

## Quest flow

Replace the current redundant sponsor offer → talk to the same sponsor flow with distinct information steps:

1. A local introduction/lead tells the player that an external Merchant financed the missing expedition and gives the Merchant's name, settlement name and direction.
2. The player travels to and talks to the external sponsor. The sponsor explains the commission and what happened to the expedition, but should not repeat an already-complete offer speech verbatim.
3. The sponsor directs the player to the local stakeholder for information the sponsor does not possess.
4. The local stakeholder provides genuinely new information and reveals the exact dungeon/location through the existing location-knowledge/navigation effect.
5. Existing physical expedition progression remains unchanged: abandoned camp → leader pack/journal → evidence → final treasure.
6. Terminal choice remains: give the exact journal to the local stakeholder, give it to the sponsor, or keep it. The player keeps the treasure.

The implementation may use the most natural existing quest-offer entry point for step 1, but it must not make the external sponsor undiscoverable and must not reintroduce two consecutive conversations that communicate the same information.

## Outcome semantics and compatibility

The current implementation calls the stakeholder/final outcome `family` even though selection only proves a different household/contact. Correct player-facing wording to stakeholder/contact semantics.

Do not casually rename persisted quest/outcome identifiers. Preserve existing stable IDs when they may be present in saves; internal constant names may be clarified only when doing so does not change persisted values.

Relationship/reputation consequences and exact journal transfer continue to target the stable NPC ids selected by the binding.

## Ownership and integration

Primary files/symbols to adapt:

- `src/quests/lostTreasureExpedition.ts` — deterministic NPC/settlement binding, quest stages, dialogue and outcome wording;
- `src/app/worldBundle.ts` — composition already resolves `homeDef` plus nearby `SettlementDef`s and their opportunity NPCs; pass the minimum settlement metadata needed by the resolver instead of adding a second lookup path;
- `src/quests/opportunities/rpgQuestMatrices.ts::nearbyRpgSettlementDefs()` — reuse its bounded definition discovery where suitable;
- `src/quests/opportunities/settlementNpcMaterialization.ts` — reuse stable NPC + household metadata;
- `src/quests/lostTreasureExpedition.test.ts` — focused binding, narrative-flow and fallback regressions.

Keep `QuestManager`, cave anchor claims, `WorldGeneratedContainers`, journal instance transfer, fauna ownership and dungeon materialization unchanged unless current code proves a direct defect. This plan fixes role binding and quest narrative/navigation, not the physical expedition content implemented by 027.

Add/update JSDoc for important reusable/public binding or direction helpers, using `@domain quests-progression` where appropriate.

## Determinism and lifecycle

- Binding must remain deterministic from world/settlement/NPC identity.
- Sponsor selection must not depend on whether the foreign settlement is currently streamed.
- The same quest id/save must reconstruct the same sponsor, stakeholder and dungeon for the same world.
- A `WorldBundle` rebuild must not change roles or duplicate expedition content.
- Existing accepted saves must not silently attach progress to a different quest solely because this fix adds sponsor-settlement metadata. If the current quest-id composition would change, preserve/bridge the existing identity contract rather than invalidating progress.

## Verification

Automated tests should cover at least:

- larger neighboring settlement with Merchant → that Merchant is sponsor;
- no larger Merchant settlement → Merchant from another nearby settlement fallback;
- no external Merchant → deterministic external-adult fallback;
- stakeholder is an adult home NPC outside Kasia's household;
- stakeholder wording does not assert unsupported family/kinship;
- sponsor objective/dialogue contains real settlement name and correct derived compass direction;
- external sponsor does not depend on settlement streaming;
- sponsor conversation and stakeholder conversation provide distinct information;
- location reveal happens at the intended information step, not through the old duplicate sponsor conversation;
- terminal stakeholder/sponsor/keep outcomes still transfer the exact journal and preserve existing consequences;
- deterministic reconstruction/save compatibility and no regression to pre-looted expedition content.

Run focused unit tests and normal repository type/test/build checks required by `CLAUDE.md`. Browser verification remains the User's responsibility.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

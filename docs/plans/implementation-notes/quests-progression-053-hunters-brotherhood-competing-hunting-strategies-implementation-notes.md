# Implementation notes: quests-progression-053 Hunters Brotherhood competing hunting strategies

## Recon findings that change the plan

- `quests-progression-049` is implemented in `src/quests/huntersBrotherhoodInvestigation.ts`. Reuse its `HuntersBrotherhoodBinding`, stable investigation quest id, persisted `QuestHabitatPressureObservation`, `deriveBrotherhoodHabitatDiagnosis()` and fauna-031 thresholds/tie order. Historical diagnosis is already persisted separately from live `Fauna.getHabitatPressure(spawnerId, nowDays)`.
- **049 currently has a continuity gap relevant to this plan:** `buildHuntersBrotherhoodInvestigationQuest()` only materializes while an unhealthy candidate exists. After the completed habitat recovers, reload/recomposition can omit the old 049 definition even though its persisted progress/observation is the only durable binding for 053. Fix this narrowly before/with 053: retained persisted 049 progress must reconstruct the same quest from its stored observation/`habitatId` (or another explicit persisted binding), rather than rerunning unhealthy-candidate selection. Do not select a new habitat.
- `harvest_animals` is **not habitat-aware**. `PlayerAnimalHarvestContext` has `animalId`, `animalKind`, `lootKinds`, while `QuestManager.onAnimalHarvested()` matches only species. Big-hunt V1 therefore needs the existing objective extended with an optional stable `spawnerId` constraint and the harvest ingress to carry the harvested animal's `spawnPointId`. Existing unconstrained hunter quests must keep current semantics when the field is absent.
- `feed_habitat_animals` is already identity-aware: it requires the exact `spawnerId`, accepted species/food and dedupes by `animalId`. The event is emitted only after a real dropped food item is consumed by fauna. It therefore proves a real fauna interaction, not merely a button press. However, fauna-031 food pressure reads nearby grass forage; feeding does **not** mutate that forage count or a habitat-health variable. Treat the authoritative effect as relief to the real animal's need/life state; do not claim that it directly lowers `snapshot.food.pressure`.
- Predator pressure in `src/fauna/habitatPressure.ts` is derived from live predator agents within `HABITAT_PREDATOR_PRESSURE_RADIUS` (24 m) of the spawner. There is no stable “predator source for this deer thicket” relation. Do not infer one from mortality.
- There is **no authoritative local NPC hunting-restriction mechanism** in current code. Omit the restriction branch from V1; do not add quest-owned policy state. If desired later, it needs a separate fauna/NPC/settlement-owned plan.
- Existing nonlinear stages support forward transitions, but current `talk_to_npc_choice` resolves choices directly to terminal outcomes. It cannot choose “strategy A → execution stage A”. This plan needs one narrow quest-runtime extension (below), not four separate quests.

## Recommended shape

Create `src/quests/huntersBrotherhoodStrategies.ts` beside the 048/049 modules. Keep pure/testable logic there:

- stable 053 quest id/outcome constants;
- reconstruction of the bound 049 habitat/diagnosis from persisted quest progress;
- strategy availability from historical diagnosis + fresh `HabitatPressureSnapshot`;
- council text and `QuestDef` materialization;
- branch-specific social consequences.

The 053 quest id should be stable for the Brotherhood + investigated habitat (same binding identity and `spawnerId`), not depend on the current pressure condition or selected strategy.

Materialize 053 only when the exact 049 quest has the `brotherhood_investigation_complete` outcome. Its `availability.prerequisites` should still contain that explicit `quest_outcome` prerequisite; composition-time reconstruction is not a replacement for normal quest gating.

## Council choice and branch persistence

Extend `talk_to_npc_choice` rather than inventing a dialogue runtime. The smallest useful contract is for each choice to target **either** an outcome (current behavior) **or** a forward `toStageId`. Keep existing `outcomeId` authoring backward-compatible and validate exactly one destination.

Selecting a council strategy should jump immediately to a dedicated execution stage. The active `stageIndex` already persists, so the selected branch survives save/load without a new `selectedStrategy` field. Final branch stages can transition to their authored terminal outcome ids.

Do not use `QuestHabitatPressureObservation` as mutable strategy state. It is the historical 049 field observation.

Natural recovery should be a council choice/path only when the fresh snapshot is now `healthy`: allow a no-intervention choice to resolve `brotherhood_strategy_no_intervention` directly. It is not an ecology mutation.

## Strategy availability

Use one pure resolver from:

- persisted 049 diagnosis;
- fresh `Fauna.getHabitatPressure(spawnerId, nowDays)`;
- concrete predator availability where required.

Suggested V1 rules should reuse fauna-031 significance rather than introduce another score:

- predator hunt: fresh predator pressure >= `HABITAT_PRESSURE_STRAINED_AT` **and** at least one concrete eligible live predator can be resolved;
- habitat support: fresh food pressure >= threshold, or fresh population condition is strained/critical; feeding remains useful support even though it does not directly alter grass-forage pressure;
- big hunt: available while real bound deer exist; when population is critical, keep it available only if that is an intentional authored choice, but make the risk explicit in text;
- no intervention: fresh condition is `healthy`;
- restriction: absent in V1.

Historical diagnosis should influence council wording, not override contradictory current state.

## Predator hunt: keep locality owned by fauna

Do not duplicate the 24 m predator-locality rule in the quest module. Add the narrowest fauna-owned query alongside `getHabitatPressure`, e.g. a read-only resolver returning eligible live predator ids for one `spawnerId`, using the same spawner origin and `HABITAT_PREDATOR_PRESSURE_RADIUS`.

For execution, prefer extending/reusing the existing concrete-animal target binding used by `kill_target_animal` rather than spawning anything. Bind a concrete live predator from that fauna query deterministically (distance then stable `animalId` is sufficient). Revalidate at selection/bind time. If the candidate disappears before commitment, return to a valid council/reselection path rather than soft-locking.

Do not count “mortality improved” as completion. Completion is the real predator action; a later pressure read is presentation only.

## Habitat support

Reuse `feed_habitat_animals` with the exact investigated `spawnerId`. Current implementation already verifies:

- the consuming animal belongs to that spawn point;
- species and food kind match;
- one animal contributes once per stage;
- a real dropped item was consumed before the quest event is emitted.

Use a small bounded count consistent with the current habitat capacity. Do not add `habitatHealth`, bonus forage, or a fake pressure decrement in quests.

If stronger ecological support is wanted later (e.g. replenishing forage/capacity), that belongs in fauna/world and should be a separate mechanism/plan; it is not required to make this V1 branch truthful.

## Big hunt

Extend the existing `harvest_animals` objective to:

`{ type: 'harvest_animals', kind, count, spawnerId?: string }`

and extend `PlayerAnimalHarvestContext` with optional `spawnPointId`. The player-harvest call site already receives the concrete animal context; thread its real binding through rather than resolving by coordinates after death.

053 must author `spawnerId`; existing profession quests omit it and remain unchanged. This gives the required identity guard while preserving the existing real corpse harvest/loot path.

Current managed target is a **deer thicket**. Do not require stag for this branch: current stag population is settlement-relative ring spawn and is not bound to the deer `PreySpawner`. If the story wants deer + stag from one habitat later, fauna ownership must first provide that association.

## Social consequences

Reuse `QuestConsequences` only:

- `relations` for the four bound Brotherhood NPC ids;
- existing settlement reputation dimensions / renown for broad social consequences.

No Brotherhood standing. Keep deltas modest and branch-specific. Different member reactions can be encoded as terminal outcome consequences and dialogue text; use existing `reactions` only where current relation/reputation genuinely changes a council response.

## Composition and live-state adapters

Wire 053 next to the existing 048/049 block in `src/app/createApp.ts`; reuse the same resolved `HuntersBrotherhoodBinding`. Do not perform a second cast or settlement search.

Avoid retaining a stale `Fauna` instance across `WorldBundle` rebuilds. Live reads/target resolution should go through callbacks that resolve the current bundle, following the existing 049 interaction-hook pattern.

The fresh council snapshot is derived state and should not be persisted. The selected stage/outcome is quest history; later ecology continues independently.

## Tests that matter

- completed 049 reconstructs with the same `spawnerId` after the habitat becomes healthy and after reload;
- 053 cannot bind to a newly selected habitat;
- availability uses fresh fauna-031 state while council text can still reference the persisted 049 diagnosis;
- recovered habitat exposes no-intervention without soft-lock;
- predator branch requires actual nearby predator evidence and binds a real concrete animal;
- mortality-only diagnosis never enables predator hunt by itself;
- habitat support counts only real consumption by animals from the bound `spawnerId`;
- constrained `harvest_animals` rejects same-species harvests from another habitat; legacy unconstrained objectives still work;
- council choice persists via branch `stageIndex` across save/load;
- missing restriction infrastructure does not appear as a choice;
- all terminal strategy outcomes are stable and consequences apply once.

## Implementation order

1. Fix 049 persisted-definition/binding reconstruction.
2. Add backward-compatible `talk_to_npc_choice → toStageId` support + validation/tests.
3. Add optional habitat identity to `harvest_animals` ingress/objective.
4. Add fauna-owned bounded predator-candidate resolver.
5. Implement pure 053 availability/materializer + branch tests.
6. Wire current-bundle adapters/materialization in `createApp.ts`; run focused quest/fauna/persistence tests plus normal typecheck/lint/build.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

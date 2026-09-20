# Implementation Notes: items-player-052 — Settlement tool ownership and social acquisition

**Plan:** `docs/plans/items-player-052-settlement-tool-ownership-and-social-acquisition.md`  
**Reviewed:** 2026-09-20

## Current-code conclusions

- `src/items/createItemSpawners.ts` is the single runtime owner of the home/village pickup nodes. The five target tools are ordinary `ItemSpawnPoint` rows with `respawnTime = Infinity`; only `extraOneTimePickups` currently receive a stable authored id and `authoredOneShot: true`.
- `ItemSpawnPoint` in `src/items/ItemSpawner.ts` has no ownership/authorization metadata. Its `collected` flag is runtime-only and therefore cannot represent save/load ownership or one-shot state.
- `src/app/gameLoop.ts::tryCollectWorldItem()` already commits world-item pickup atomically in the right order: capacity/instance checks happen before collection, inventory mutation happens after `itemSpawners.collect(ref.id)`, and `consumedWorldPickupIds.add(ref.id)` runs only after successful inventory commit for `authoredOneShot`.
- `SaveData.consumedWorldPickupIds` is already app-owned, sparse, carried across `WorldBundle` rebuilds, serialized by the normal save path and cleared only by New Game. Reuse that lifecycle; do not persist `ItemSpawnPoint`.
- `docs/plans/LOOSE-ENDS.md` already records the exact village-tool bug: generated `spawner:${index}` ids make Infinity pickups rematerialize after rebuild.
- Home reserved roles are stable in current code: Anna = `farmer`, Piotr = `woodcutter`, Kasia = `trader`, Marek = `guard` (`src/ai/characters.ts::RESERVED_SEEDS`). `professionStaffing.ts` never rewrites reserved families.
- A `miner` is **not guaranteed** in the home settlement. Staffing may assign one from resource/terrain signals, so pickaxe dialogue must have a deterministic fallback rather than assume a miner exists.
- NPC dialogue actions are wired from `src/app/inventoryWiring.ts` through `vueUi.configureNpcDialogueMenu(...)`; `src/ui-vue/store.ts` owns handler state and `NpcDialogueMenu.vue` is presentation. This is the correct integration seam for non-quest tool requests.
- `InventoryWiringDeps` already receives both `QuestManager` and `ReputationManager`, and `createInventoryWiring()` already resolves an NPC's loaded settlement with `findSettlementForNpc()`. Reuse this lookup for local `reputation.trust`; do not add settlement identity to `NpcAgent`.
- `ReputationManager.getReputation(settlementId)` returns the existing five-dimensional reputation. The plan's gate is exactly `trust >= 1`; no Player↔NPC relation and no renown.
- Quest exact-instance support already exists through `QuestStageDialogueAction.requireItemInstanceId`, `physicalOutcomeId`, and the physical-outcome resolver. Existing authored examples/tests include old bones, suspicious transport, dungeon bandit treasure and lost-treasure journal. Reuse this machinery for the axe; do not invent an `axe`-specific quest hand-in path.

## Stable pickup identity

Extend the existing one-time-source contract rather than creating a second spawner registry.

Add a small helper near the item-spawner/world-pickup code that produces deterministic ids from settlement identity + semantic source identity. The exact string is implementation detail, but keep these invariants:

```text
settlement tool source id
= stable settlement id
+ tool kind
+ stable slot only when multiples are possible
```

Do **not** use:

- `points.length`;
- random placement position;
- display label;
- NPC name.

For shovel/axe/pickaxe there is one semantic source per settlement. For pitchfork/sickle, the source slot must be deterministic before placement. The current loop randomly picks 1–3 mixed kinds, so implementation must ensure there is a stable claimable source for each requested gift kind. Prefer making the claimable `pitchfork` and claimable `sickle` explicit deterministic source rows, then optionally keeping additional decorative/stealable farm-tool rows with separate stable slot ids. Do not infer "first matching point" after random materialization.

Before adding a stable one-shot source to `points`, gate it against `consumedWorldPickupIds`, just as `buildAuthoredOneTimePickups()` gates authored extras today. The consumed set should be threaded/read at materialization boundary; do not recreate consumed points and merely mark them collected.

## Ownership vs authorization vs consumption

Three states are required semantically:

```text
owned by settlement, not authorized
owned by settlement, authorized for player
consumed / source no longer exists
```

The third state is already `consumedWorldPickupIds`.

Because the desired UX keeps the tool physically in the world after an NPC says "możesz go wziąć", authorization must also survive save/load before collection. Use a second small app-owned sparse stable-id set, e.g. `authorizedWorldPickupIds`.

Recommended ownership:

- live owner: `createApp.ts`, same lifecycle style as `consumedWorldPickupIds`;
- persistence: optional `SaveData.authorizedWorldPickupIds?: string[]`;
- New Game: clear;
- save: serialize;
- WorldBundle rebuild: pass as read-only state to item-spawner materialization/presentation.

Do not store authorization in:

- inventory presence;
- quest progress for shovel/pickaxe/pitchfork/sickle;
- `NpcAgent`;
- settlement economy;
- item kind.

Once a source enters `consumedWorldPickupIds`, keeping its id in `authorizedWorldPickupIds` is harmless but unnecessary. Prefer deleting authorization on successful collection to keep save state sparse.

If current save-version policy requires a version bump for a new optional field, follow the existing migration convention in `saveData.ts`; do not invent a parallel persistence file.

## ItemSpawner contract and labels

Extend `ItemSpawnPoint` minimally with source semantics rather than generic item ownership. A narrow shape such as a settlement-tool source flag plus authorization projection is enough.

Important: `createItemSpawners.ts::addSpawnPoint()` currently creates the DOM label immediately and only sets `ITEM_DEFS[kind].label`. Keep label styling in this presentation layer.

Recommended behavior:

- unauthorized settlement tool: red label + suffix such as `— własność osady`;
- authorized settlement tool: normal item label;
- ordinary renewable/drop/authored world pickup: unchanged.

Do not mutate `ITEM_DEFS[kind].label`; ownership is source-specific.

The label update path already runs every spawner update and owns opacity. Authorization changes while the dialogue is open must become visible without rebuilding the world. Either have the label renderer read the live authorization set or expose a narrow `ItemSpawners` refresh/authorize method keyed by stable pickup id. Prefer the smallest contract that does not duplicate authorization state inside the spawner.

## Collection semantics

Generalize the existing successful-commit one-shot handling in `tryCollectWorldItem()` from the current `authoredOneShot` boolean to stable persistent one-shot source semantics.

Required ordering remains:

1. validate capacity / concrete instance;
2. collect the world source;
3. commit inventory;
4. mark stable source consumed;
5. clear any authorization id;
6. sync HUD/tool state.

A failed/full-inventory attempt must not consume, authorize, or otherwise mutate persistent source state.

Unauthorized collection must remain possible if the plan's theft behavior is retained. Therefore authorization must **not** be a hard collect gate. It only distinguishes legitimate vs unauthorized acquisition and drives presentation/consequence hooks.

Do not implement issue 025 by special-casing `pitchfork`/`sickle` at the collect call-site. If theft reaction is included in this pass, branch from the source metadata (`settlement-owned && !authorized`) so shovel/axe/pickaxe and future settlement-owned sources share the same seam.

## Dialogue integration for gifts

Use `src/app/inventoryWiring.ts` as the mutation boundary.

It already has:

- current dialogue NPC via `ui.npcDialogueMenu.npc`;
- `findSettlementForNpc()`;
- `reputationManager`;
- `questManager`;
- `vueUi.configureNpcDialogueMenu(...)`.

Add a small pure resolver/module for tool-request availability/copy rather than putting role/reputation branching in Vue. It should receive already-resolved facts (role/NPC id, settlement id, trust, source exists, source consumed, source authorized) and return semantic request rows/results.

`NpcDialogueMenu.vue` should only render the supplied action(s). It must not call `ReputationManager` or interpret `trust >= 1`.

### Shovel

Bind the shovel request to reserved home Farmer Anna when this plan is home-only. Current code guarantees Anna remains `farmer`, so no profession scan is needed for the home source.

The action is available while the stable shovel source exists and is neither consumed nor already authorized. Selecting it adds that source id to `authorizedWorldPickupIds` and returns the positive NPC line.

No reputation gate.

### Pitchfork / sickle

Use the same home Farmer Anna binding for the home-settlement implementation. Each source has independent authorization.

Gate from the live local settlement:

```ts
reputationManager.getReputation(settlementId).trust >= 1
```

Below threshold, keep the action visible and return rejection copy. Do not mutate relation, reputation or cooldown on rejection.

### Pickaxe

Current home composition does not guarantee a miner.

Resolve giver deterministically:

1. an adult loaded home NPC with `role === 'miner'`, stable lowest `npc.id` tie-break;
2. fallback to reserved Piotr (woodcutter), who is guaranteed.

Do not make the gift disappear on seeds without a miner, and do not introduce a new reserved miner solely for this tool.

Use the same `trust >= 1` gate as farm tools.

If implementation generalizes beyond home settlement, move this giver selection into a deterministic settlement-level helper over stable NPC ids; do not persist the chosen giver when it can be re-derived.

## Axe quest

Use Piotr, the guaranteed reserved home Woodcutter, as giver. This avoids a generated-giver identity problem and matches the intended story.

The axe source must be a stable concrete item identity, not merely a stable pickup id, because the quest must reject any other axe. Current `createItemSpawners` already supports `instanceId` on `ItemSpawnPoint` and returns a `SaveItemInstance` on collect. Assign a deterministic instance id to the lost axe source.

Build the authored quest through the existing home authored-quest materialization path and stable `NpcId` binding. Do not add quest logic to `ItemSpawner`.

Recommended quest flow:

1. offer from Piotr;
2. acquire exact axe instance;
3. report to Piotr with `requireItemInstanceId`;
4. terminal/physical outcome leaves the same instance in Player Inventory.

For the final "zatrzymaj ją" branch, reuse the existing **keep exact instance** pattern: the action requires the instance but the physical outcome does not transfer/remove it. Do not add an item reward for `axe`, otherwise the player gets a duplicate.

If the current objective vocabulary has no exact-instance acquisition objective, do not add an axe-specific objective. Prefer the smallest generic exact-instance objective/report hook consistent with the existing exact-instance dialogue gating, or let the report action itself be the first exact-instance gate if quest UX remains clear.

The lost axe should not present as "własność osady" after the quest establishes it as the lost target if that copy is misleading. Source metadata may use a specific authored/lost-tool presentation while still using the same stable one-shot persistence. Do not force every settlement-tool source through identical label copy when story semantics differ.

## Reputation boundary

The plan intentionally uses settlement reputation, not Player↔NPC relation.

Do not call:

- `questManager.getRelation()`;
- `questManager.getRelationLevel()`

for shovel/pickaxe/pitchfork/sickle gift eligibility.

Do not create an aggregate reputation score. The gate is specifically:

```text
local settlement trust >= 1
```

Use the settlement containing the NPC through the existing loaded-settlement lookup. If no settlement can be resolved, fail closed for reputation-gated gifts rather than falling back to home reputation.

## Suggested files

Likely modified:

- `src/items/createItemSpawners.ts` — stable settlement-tool sources, source metadata, label projection.
- `src/items/ItemSpawner.ts` — minimal persistent-source/ownership metadata shape if needed.
- `src/app/worldBundle.ts` — thread consumed/authorized sets into settlement item materialization.
- `src/app/createApp.ts` — own/load/clear authorization set and wire dependencies.
- `src/app/saveState.ts` — serialize authorization ids.
- `src/persistence/saveData.ts` — optional sparse authorization field/migration if required.
- `src/app/gameLoop.ts` — generalized persistent one-shot commit + unauthorized-source seam.
- `src/app/inventoryWiring.ts` — tool request actions and live trust evaluation.
- `src/ui-vue/store.ts` / `src/ui-vue/NpcDialogueMenu.vue` — only the minimal generic action surface extension if current configured handlers cannot represent tool requests.
- `src/quests/... authored home quest module` — lost-axe definition/materialization.
- `src/quests/QuestManager.ts` / `src/quests/quests.ts` — only if a truly generic exact-instance acquisition primitive is missing.
- tests adjacent to the changed modules.

Docs after implementation:

- remove the village one-time-spawner entry from `docs/plans/LOOSE-ENDS.md`;
- update/close `docs/issues/2026-08-12--025--npc-react-to-stolen-village-tools.md` only to the extent theft reaction is actually implemented;
- update item/state docs to describe stable settlement-owned one-shot sources and tool acquisition.

## Test focus

Prefer small tests at ownership boundaries instead of one giant integration test.

### Item source / persistence

- stable ids do not depend on `points[]` ordering;
- consumed source is omitted on rebuild;
- authorized-but-uncollected source survives rebuild and renders non-owned presentation;
- failed inventory-capacity collection does not consume source;
- successful collection consumes source and removes authorization;
- renewable stone/shell/crops/branch/apple behavior unchanged.

### Gift resolver

- Anna shovel request succeeds at trust 0;
- farm-tool/pickaxe actions stay visible below trust 1 and return rejection;
- trust exactly 1 succeeds;
- Player↔NPC relation changes do not affect result;
- consumed/already-authorized source cannot be granted twice;
- pickaxe giver chooses miner by stable id when present and Piotr otherwise.

### Axe

- deterministic lost-axe instance id;
- unrelated axe cannot satisfy report;
- exact axe can;
- completion keeps same instance id in Player Inventory;
- no duplicate axe reward;
- save/restore before pickup, after pickup and after completion preserves source/quest state.

### Dialogue/UI

- Vue tests verify actions/copy only;
- domain tests verify reputation/ownership decisions;
- opening dialogue alone never authorizes or consumes a source.

## Implementation order

1. Stable source ids + consumed gating for village tools.
2. Add app-owned authorization persistence and thread it into spawner presentation.
3. Generalize collection commit semantics for persistent one-shot settlement sources.
4. Add pure tool-request resolver + `inventoryWiring` dialogue handlers.
5. Bind shovel/farm-tool/pickaxe requests.
6. Add deterministic lost-axe instance + authored quest using existing exact-instance APIs.
7. Add/adjust theft reaction only through generic unauthorized settlement-source metadata.
8. Tests, then docs cleanup.

## Pitfalls

- Do not use `authoredOneShot` name as the long-term semantic if settlement tools now share the mechanism; rename/generalize the contract rather than making "authored" mean two different things.
- Do not remove a source from the world at authorization time.
- Do not infer authorization from Player Inventory.
- Do not let a source respawn just because the Player later drops/sells/loses the tool.
- Do not bind quest/gift behavior by display name at runtime; materialize stable `NpcId` or use guaranteed reserved identity during composition.
- Do not require a miner in home worldgen.
- Do not move reputation reads into `NpcAgent` or Vue.
- Do not add an `axe` quest reward when the exact physical axe remains with the Player.
- Do not manually run `pnpm docs:sync`; repository automation owns derived docs/index refresh.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

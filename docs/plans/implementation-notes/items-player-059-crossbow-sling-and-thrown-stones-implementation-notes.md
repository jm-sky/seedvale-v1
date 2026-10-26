# Implementation Notes: Crossbow, sling and thrown stones

Plan: `docs/plans/archive/items-player-059-crossbow-sling-and-thrown-stones.md`

These notes reflect current `main`. Current code remains authoritative if it changes before implementation.

## Current ownership and seams

- `src/items/items.ts` owns `ItemKind`, labels/categories/weight/size and procedural fallback item meshes. Add only `crossbow`, `bolt`, and `sling`; keep the existing `stone` identity.
- `src/items/itemCatalog.ts` owns combat-facing item metadata. `RangedConfig` is already shared by player and NPC. Add the smallest handling/skill metadata here rather than branching on item kinds in player/NPC code.
- `src/combat/rangedLifecycle.ts` is the actor-neutral ranged timing state machine shared by player and NPC. This is the correct owner for explicit reload semantics.
- `src/player/playerRanged.ts` is only the player wrapper around the shared lifecycle plus stamina/vigor. Preserve manual press-to-draw/release-to-fire for bows.
- `src/combat/rangedAttack.ts` owns accuracy/deviation. Add declarative skill scaling here; do not add crossbow/sling checks in `gameLoop.ts`.
- `src/combat/projectile.ts` is already item-agnostic: projectile stores `ammoKind`, movement, damage and crit fields. Reuse it unchanged unless direct throwing exposes a genuinely missing generic field.
- `src/app/gameLoop.ts` owns player-fired projectile advancement/hit resolution. On miss/expiry it already calls `bundle.droppedItems.drop(projectile.ammoKind, ...)` exactly once. Do not add a bolt/stone recovery manager.
- `src/ai/npcCombat.ts` owns pure NPC weapon family/scoring/resolution. It already has profession-aware deterministic ranking from `npc-053`.
- `src/ai/NpcAgent.ts` owns transient combat execution: `combatIntent`, cached `combatMeleeWeapon`/`combatRangedWeapon`, `combatRangedAttack`, and at most one `combatProjectile`. Mode switching during an encounter belongs here, not in `npcCombat.ts`.
- `src/ai/npcLoadout.ts` owns deterministic role starting belongings. Guard crossbow and shepherd sling rolls belong here.
- NPC personal weapons belong to `NpcAuthoritativeState.personalInventory`; hunter arrows currently remain transient `carried` work supply. Do not move new personal weapons into `carried`.
- `src/items/tradeCatalog.ts` owns merchant price/stock. New merchant acquisition belongs there, not in role/loadout code.

## RangedConfig: resolve the crossbow semantics declaratively

Current `RangedConfig` fields are `damage/range/projectileSpeed/drawTime/recovery/staminaCost/accuracy/ammoKinds/critical*`. Comments and `rangedLifecycle` still describe bow draw/release/recovery.

Prefer extending the config with a small handling contract rather than adding weapon-kind conditionals. A concrete shape can be adjusted to the surrounding style, but it should answer:

```ts
handling?: {
  reloadTime?: number
  skillAccuracyScale?: number
}
```

Equivalent flat fields are acceptable if they keep `RangedConfig` clearer.

Rules:

- Existing bows omit `reloadTime`; their current `drawTime + recovery` behaviour must remain byte-for-byte equivalent where practical.
- Crossbow uses short pre-fire `drawTime`, ordinary short post-fire recovery if needed for animation, plus explicit `reloadTime`.
- Sling stays on ordinary ranged cadence and does not need a reload state.
- `skillAccuracyScale` defaults to today's full archery contribution (`1`) so all existing bows are unchanged.
- Crossbow should use a reduced scale; sling should use zero/small scale; direct stone throw uses zero.
- Keep base `accuracy` as the weapon's inherent accuracy.

Do not add a broad weapon-handling abstraction beyond what these concrete callers need.

## Shared ranged lifecycle

Current `createRangedLifecycle()` exposes `state()`, `isDrawing()`, `phaseProgress()`, `start()`, `release()`, `update()`, and `reset()`. Player uses `manualRelease: true`; NPC auto-fires after `drawTime`.

Extend this same state machine with reload rather than wrapping it.

Recommended state shape:

```text
idle
→ draw
→ recovery
→ reload (only when config requires it)
→ idle
```

The exact naming may follow current state types, but two behaviours are mandatory:

1. callers can distinguish reload from ordinary draw/recovery;
2. reload can be aborted/reset without manufacturing a shot or spending ammo.

Do not make manual player release semantics wait through reload before `fireReady`; `fireReady` still occurs at the actual shot. Reload gates the *next* shot.

`reset()` must clear reload state and config. Existing bow lifecycle tests are the regression anchor.

## NPC mode switch must stay inside the existing combat encounter

`CombatIntent.mode` is currently fixed when `beginCombat()` starts, and `NpcAgent` caches one melee/ranged weapon per encounter. Do not solve crossbow pressure by ending combat and calling `beginCombat()` again; that risks re-running encounter callbacks/lifecycle and weapon setup.

Instead add a small internal mode-transition helper in `NpcAgent`, conceptually:

```ts
switchCombatMode('melee' | 'ranged'): boolean
```

It should:

- preserve the same target and encounter;
- resolve/cache the required weapon through existing `resolveNpcMeleeWeapon` / `resolveNpcRangedWeapon`;
- reset only the incompatible attack lifecycle/projectile-preparation state;
- never duplicate `onKill`/end-combat semantics;
- not persist the selected mode.

Use it at bounded decision points, not every tick.

## Close-threat rule

Current `reactToAnimalThreat()` computes melee/ranged capability and then chooses `ranged` whenever available. Replace only this mode-choice policy.

Create a small pure helper either in `npcCombat.ts` or a focused combat-decision helper if that file already owns the relevant geometry by implementation time. Inputs should be actual capability + target distance + relevant ranged/melee ranges; output is `melee | ranged | null`.

Do not encode role names.

For combat entry:

- close threat + usable melee → melee;
- otherwise usable ranged → ranged;
- otherwise usable melee → melee;
- otherwise existing flee path.

For an active crossbow encounter, evaluate the unsafe reload boundary immediately after firing / when reload would start, and when the target crosses that boundary. If melee exists, switch to melee and reset/abort reload.

Do not add kiting/backpedal-to-reload.

Prefer one shared close-pressure function over separate entry and post-shot constants.

## Crossbow safe reload distance

Do not put a guard-specific number in `NpcAgent`.

Prefer a declarative value tied to ranged handling if the crossbow genuinely needs a threshold different from generic melee pressure, e.g. `minReloadDistance`. If current melee/ranged ranges are sufficient to derive the threshold cleanly, do that instead and avoid another field.

The invariant matters more than the exact representation:

```text
target inside unsafe reload distance
+ usable melee
→ no reload; melee
```

A future bandit carrying the same crossbow must inherit the same rule automatically.

## NPC ranged family classification and profession constraints

Current `npcCombat.ts`:

- `NpcRangedWeaponFamily = 'bow'`;
- `NPC_RANGED_FAMILY_PREFERENCE` contains only `hunter: ['bow']`;
- ranged score = `damage / (drawTime + recovery)`;
- generic profession preference multiplier = `1.5`.

Extend the family mapping explicitly and add a completeness test for every catalog ranged item:

```text
short_bow / hunting_bow / long_bow / masterwork_hunting_bow → bow
crossbow → crossbow
sling → sling
```

Preferences:

```text
hunter   → bow
guard    → crossbow
shepherd → sling
```

Hunter is a deliberate stronger constraint than the generic bonus. Implement this as a small allowed/preferred-family rule in the resolver, not as `if (role === 'hunter' && kind === 'crossbow')`. For normal profession resolution, hunter candidates should be restricted to bow when at least one usable bow candidate exists.

Do not apply this constraint to melee selection.

Thrown stone does not enter this resolver.

## Ranged scoring

Do not immediately redesign scoring.

First add crossbow with explicit reload and test the resulting candidate scores against the intended profession constraints. Because hunter is constrained to bow and guard/shepherd have family preference, sustained-DPS score may remain adequate for within-family ranking.

Only if current scoring causes a real wrong selection among intended candidates, adjust `rangedCombatScore()` with the smallest shared rule. Do not add role-specific scoring branches.

If reload participates in sustained cadence, include it in the cycle denominator for neutral ranking. Opening-shot tactical value belongs in mode/handling logic, not a hidden guard score bonus.

## Guard starting belongings

Current `defaultWeaponForRole('guard')` is `long_sword`; preserve it.

Add an independent deterministic crossbow roll in `npcLoadout.ts`, using:

- its own salt;
- the existing local FNV-1a helper;
- an explicit constant percentage;
- idempotent seeding.

Do not change `DEFAULT_WEAPON_BY_ROLE.guard`.

On a successful roll seed into `personalInventory`:

- one `crossbow`;
- a bounded stack of `bolt`.

These are personal combat belongings, so update `isNpcLoadoutBelonging()` accordingly. Unlike hunter arrows, guard bolts should not silently live in transient `carried` unless implementation finds an already-established guard resupply contract; none exists on current main.

Do not create bolt resupply/crafting in this plan.

## Shepherd starting belongings

Preserve the current deterministic primary melee roll exactly:

```text
spear 45 / pitchfork 30 / axe 25
```

Add sling as a second independent deterministic roll with a new salt. Do not alter `SHEPHERD_PRIMARY_WEAPON_WEIGHTS` or its salt.

On success, seed:

- one `sling`;
- a small stack of existing `stone`.

Because `stone` is also a normal resource, ownership semantics must be explicit. For initial sling ammo it is acceptable to be a personal belonging only if death/corpse loot is intended to include those stones; otherwise keep only the sling as a personal belonging and provide stones through an existing household/resource acquisition seam. Current code has no shepherd ammo-resupply loop, so prefer the smallest deterministic initial personal stack for V1 and document it in `isNpcLoadoutBelonging()` if required by corpse loot semantics.

## Hunter must stay on the existing bow/hunt pipeline

Do not modify:

- `defaultWeaponForRole('hunter') === 'hunting_bow'`;
- `seedHunterStartingArrows()`;
- `HUNT_RESUPPLY_ARROW_TARGET`;
- hunter household arrow crafting/resupply;
- `attemptHuntKill()` ammo assumptions except where generic ranged handling requires compatibility.

Hunter crossbow/bolt resupply is out of scope.

## Sling uses existing stone

Set `sling.ranged.ammoKinds = ['stone']`.

That automatically reuses:

- player inventory ammo count/removal;
- `resolveNpcAmmo()`;
- projectile `ammoKind`;
- miss/expiry `DroppedItems` recovery.

Do not introduce a special sling ammo resolver.

Check the existing `stone` weight (currently 1 kg). A stack of sling ammunition at that weight may make sling impractical and may exceed the NPC transient carry cap if put in `carried`. Do not silently change all construction stones to unrealistic lightweight ammo. If gameplay needs a lighter projectile, that is evidence for a distinct prepared sling-ammo item and would contradict the plan's single-`stone` decision; surface that explicitly rather than hiding it in inventory math. For V1 keep the existing item weight unless the user deliberately changes the design.

## Direct stone throw

Do not mark `stone` as `ranged`; otherwise it becomes a held ranged weapon and enters profession weapon selection/UI assumptions.

Add a narrow catalog field such as `throwable` only if it is useful to both player and NPC. Keep its config compatible with the same accuracy/projectile construction functions where practical.

Player direct throw needs an explicit action entry point. Reuse current ranged target acquisition/reticle primitives, but do not force `HeldTool` to pretend a resource is a weapon unless current inventory interaction already has a clean hold/use path.

NPC direct throw is one opportunistic action:

```text
no usable normal ranged weapon
+ stone available
+ defend selected
+ target inside throw range but not preferable melee range
→ consume one stone
→ spawn ordinary Projectile
→ return to normal melee/flee arbitration
```

Do not store thrown stone as `combatRangedWeapon`; it is not a ranged-family candidate.

## Player projectile creation and recovery

Current player fire path in `gameLoop.ts`:

1. resolves ammo at release/fire time;
2. removes exactly one unit;
3. applies archery accuracy/deviation;
4. creates a `Projectile`;
5. advances it each frame;
6. hit path applies damage and `continue`s;
7. expiry/miss drops `projectile.ammoKind` once.

Crossbow and sling should flow through this path unchanged after config/lifecycle changes.

For stone-on-hit recovery: current code deliberately does **not** drop ammo on hit. Do not expand this plan solely to special-case stones in `gameLoop.ts`. Keep V1 consistent: miss/expiry recovers; hit consumes. If later desired, introduce a generic projectile recovery policy in a follow-up.

NPC projectiles currently live on the agent, not the global player projectile array. Preserve that ownership.

## Accuracy / skill scaling

Current `rangedAccuracy(config, archerySkillValue)` adds the full `ARCHERY_MAX_ACCURACY_BONUS`.

Change it to multiply the skill bonus by config-provided scale, defaulting to `1`.

Conceptually:

```ts
skillBonus =
  ARCHERY_MAX_ACCURACY_BONUS
  * clamp01(archerySkillValue)
  * (config.skillAccuracyScale ?? 1)
```

NPC currently calls the same resolver with skill `0`, so this change is player-facing only unless NPC skills are added later.

Direct throw can call the same function with skill `0` or use a shared lower-level deviation helper; do not fake an archery skill value.

## Item/model wiring

Adding the three kinds requires updating all total `Record<ItemKind, ...>` or exhaustive item maps identified by TypeScript/tests.

Expected places:

- `ItemKind` union and `ITEM_DEFS` in `items.ts`;
- `ITEM_CATALOG`;
- merchant prices/stock;
- model specs in `src/items/itemModels.ts` if GLBs are available;
- held transforms / orientation in `src/items/heldToolVisual.ts` for crossbow/sling;
- procedural fallback meshes in `items.ts` where appropriate;
- docs catalog/weapons/assets.

Current bow GLBs use `ITEM_GLB_SPECS` and held `HELD_ATTACH`; follow the same pipeline.

If crossbow/sling GLBs are not already in the repository, keep functional procedural fallback and mark model backlog/docs accurately rather than inventing an asset path.

Bolt may reuse a simple procedural arrow-like fallback until a real asset exists.

## Economy

Current merchant ranged prices are:

- short bow 45;
- hunting bow 75;
- long bow 120;
- arrows start at 1 coin.

Add crossbow/sling/bolt values relative to these existing numbers; do not introduce a second price source.

Suggested relationship, not fixed values:

```text
sling << short_bow < hunting_bow < crossbow ≲ long_bow
bolt > basic arrow only if its higher per-shot value justifies it
```

Add stock through `MERCHANT_STOCK`.

Do not add blacksmith bolt production in this implementation.

## Tests to extend

Prefer focused additions to existing suites:

- `src/combat/rangedLifecycle.test.ts`
  - bows unchanged;
  - explicit reload state;
  - reload completes to idle;
  - reset/abort reload;
  - no duplicate `fireReady`.
- `src/combat/rangedAttack.test.ts`
  - default skill scale preserves bow accuracy;
  - crossbow reduced skill contribution;
  - zero scale ignores archery.
- `src/ai/npcCombat.test.ts`
  - ranged-family completeness;
  - hunter bow constraint;
  - guard crossbow preference;
  - shepherd sling preference;
  - deterministic score/tie-break remains catalog-order independent.
- `src/ai/npcLoadout.test.ts`
  - existing shepherd melee distribution unchanged;
  - guard crossbow roll stable/idempotent;
  - shepherd sling roll stable/idempotent;
  - hunter receives no crossbow;
  - loadout belongings classification includes new personal gear/ammo as designed.
- `NpcAgent` combat tests (existing file/suite discovered during implementation)
  - close threat starts melee when both modes exist;
  - distant threat starts ranged;
  - crossbow fire followed by close pressure switches to melee without ending/restarting encounter;
  - crossbow reload is not continued under close melee pressure;
  - no melee backup → current ranged/flee behaviour remains bounded, no invented kiting.
- player ranged/projectile tests
  - sling consumes `stone`;
  - crossbow consumes `bolt`;
  - direct throw consumes one stone;
  - no ammo/resource → no projectile;
  - miss/expiry recovery exactly once.

## Persistence

No save schema change should be necessary:

- item counts already persist generically by `ItemKind`;
- NPC personal inventory already persists;
- combat intent/lifecycle are transient and reconstructed;
- deterministic loadout seeding runs only on genuine initial state via `needsInitialPersonalLoadout`.

Do not bump save version merely for new enum/string item kinds unless the current serializer has an explicit whitelist/migration requirement discovered during implementation.

## Documentation that will become stale

On implementation update:

- `docs/items/CATALOG.md` ranged-combat summary and item rows;
- `docs/items/WEAPONS.md`;
- `docs/state/combat.md` (currently says ranged config is on the bows and describes draw→release→recovery);
- `docs/state/npc.md` starting loadout description;
- `docs/assets/MODELS.md` / `CREDITS.md` only if concrete assets are added.

There is an existing historical/documentation mismatch around arrow recovery: current runtime drops missed/expired ammo; do not reintroduce the older “never recovered” statement.

## Implementation order

1. Add item kinds/definitions/catalog/trade entries with functional fallback visuals.
2. Add declarative ranged handling + skill scaling, preserving bow defaults.
3. Extend `rangedLifecycle` with reload and lock regression tests.
4. Wire player crossbow/sling through existing player ranged path.
5. Add direct throwable stone config/action reusing projectile creation.
6. Extend NPC ranged families/preferences and hunter bow constraint.
7. Add deterministic guard/shepherd optional loadout rolls.
8. Add distance-aware combat mode choice and in-encounter crossbow→melee transition.
9. Update docs/assets metadata and run targeted tests/typecheck/build as justified.

Do not run browser verification; the User performs manual gameplay verification.

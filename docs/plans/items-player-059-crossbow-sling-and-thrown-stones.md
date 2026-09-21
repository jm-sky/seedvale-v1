# Plan: Crossbow, sling and thrown stones

**Created:** 2026-09-20
**Status:** `verification needed` 🔍
**Priority:** medium · **Effort:** L
**Depends on:** ~~npc-053~~
**Domain:** `items-player`
**Type:** `feature`
**Subdomains:** `items` `interaction`
**Tags:** `combat` `npc` `ranged`
**Roadmap:** -
**Model:** Grok, Sonnet

## Goal

Extend the existing ranged-combat architecture with three connected options:

1. **crossbow + bolts** — a slow, accurate, high-impact ranged weapon, especially suitable for guards;
2. **sling + existing stone** — a cheap ranged weapon, sometimes carried by shepherds;
3. **thrown stone** — an improvised short-range action using the existing `stone` resource without requiring a ranged weapon.

The feature must reuse the current item, ranged lifecycle, projectile, ammo ownership, profession-aware weapon selection and ordinary dropped-item pipelines.

Do not create separate crossbow, sling, thrown-projectile or profession-specific combat systems.

## 1. Existing foundations to reuse

Current code already provides:

- `ITEM_CATALOG[kind].ranged` / `RangedConfig`;
- `src/combat/rangedLifecycle.ts`;
- `src/combat/rangedAttack.ts`;
- `src/combat/projectile.ts`;
- player ranged execution in `src/player/playerRanged.ts` / `src/app/gameLoop.ts`;
- NPC ranged execution in `src/ai/NpcAgent.ts`;
- NPC weapon resolution in `src/ai/npcCombat.ts`;
- authoritative NPC belongings in `NpcAuthoritativeState.personalInventory`;
- real ammo ownership through `resolveNpcAmmo()`;
- ordinary world-item recovery through `DroppedItems`;
- role-based initial belongings in `src/ai/npcLoadout.ts`;
- profession-aware ranged-family selection from plan `npc-053`.

The existing `stone` item remains the single item kind for both resource use, sling ammunition and direct throwing.

Do not add `sling_stone` or another dedicated stone-ammo kind.

## 2. New item kinds

Add:

- `crossbow`;
- `bolt`;
- `sling`.

Do not add special bolt tiers in V1.

`stone` remains unchanged as an item identity and gains only the smallest gameplay metadata needed for throwing/sling use.

## 3. Crossbow gameplay role

The crossbow is not another bow variant.

Its role is:

- high single-shot impact;
- high base accuracy;
- high projectile speed;
- medium-to-long range;
- short aiming/firing preparation;
- expensive time commitment after firing because it must be reloaded.

Balance against the current bows in `docs/items/WEAPONS.md`, rather than introducing an independent stat scale.

Suggested starting envelope, to be adjusted against current bow values during implementation:

```text
damage: ~32–36
range: ~18
projectileSpeed: ~40
accuracy: ~0.88
aim/fire preparation: ~0.25–0.4 s
reload: ~2–3 s
```

## 4. Explicit reload semantics

Do not hide crossbow reload entirely inside the existing bow-oriented meaning of `recovery`.

The existing ranged lifecycle currently models:

```text
draw
→ release
→ recovery
```

Crossbow needs a meaningful distinction:

```text
aim
→ fire
→ reload
→ ready
```

Extend the shared ranged handling/lifecycle with the smallest declarative representation needed to distinguish post-shot reload from ordinary bow recovery.

The exact field shape should follow the current code, but the resulting contract must allow NPC logic to answer:

- is this ranged weapon ready to fire?
- is the actor currently reloading?
- may reload be abandoned because melee pressure is higher priority?

Do not create a `CrossbowLifecycle`.

Bow behaviour must remain unchanged.

## 5. Crossbow reload interruption and melee transition

A crossbow user must not stand next to an attacking enemy waiting for reload.

After firing a crossbow:

```text
shot fired
→ target still active
→ evaluate current distance / immediate pressure
```

If the target is now close enough to make reload unsafe and the NPC owns a usable melee weapon:

```text
cancel / do not begin reload commitment
→ switch current combat execution to melee
→ resolve normal melee weapon through existing npcCombat resolver
```

Reload can resume only when the actor is again in a suitable ranged situation or in a later encounter.

V1 explicitly does **not** add kiting behaviour. An NPC does not backpedal solely to create room for crossbow reload.

## 6. Shared combat-mode choice by distance

Current animal-threat defence effectively prefers ranged whenever usable ranged capability exists.

Extend the existing combat entry/execution seam so mode also considers target distance.

Desired behaviour:

```text
close threat + usable melee
→ melee

distant threat + usable ranged
→ ranged

distant threat + melee only
→ existing melee approach behaviour

no usable combat capability
→ flee / existing self-preservation behaviour
```

This must be shared combat logic, not role-specific AI.

Do not add:

- `GuardCrossbowAI`;
- `ShepherdSlingAI`;
- weapon-specific decision managers.

Distance thresholds should derive from real weapon ranges and a small shared safety rule rather than hard-coded profession values.

## 7. Minimum safe reload distance

Crossbow handling should expose or derive a minimum distance/pressure condition for beginning or continuing reload.

If the target is inside that unsafe zone and melee is available, melee wins.

The value belongs to shared weapon handling metadata or shared combat logic, never to the guard role.

This rule must also work later for bandits or other NPCs carrying a crossbow.

## 8. NPC ranged families

Extend the current NPC ranged-family classification from:

```ts
type NpcRangedWeaponFamily = 'bow'
```

to:

```ts
type NpcRangedWeaponFamily =
  | 'bow'
  | 'crossbow'
  | 'sling'
```

Classify:

- current bows → `bow`;
- `crossbow` → `crossbow`;
- `sling` → `sling`.

Thrown stone is **not** a ranged weapon family. It is an improvised fallback action.

## 9. Hunter preference

Hunter remains a bow specialist.

Normal profession behaviour:

```text
hunter → bow
```

Hunter should not receive a crossbow through standard role loadout generation.

A hunter owning both a bow and crossbow should still choose a bow for normal profession combat/hunting.

Do not rely only on the current generic `×1.5` family bonus if crossbow scoring could still overpower that preference. Treat hunter bow preference as a deliberate profession constraint for ordinary selection.

A manually authored exceptional hunter may still be given another weapon later, but that is outside this plan.

Do not extend the hunter's existing arrow crafting/resupply loop to bolts.

## 10. Guard crossbow loadout

Guard remains a melee-capable defender.

Existing melee belonging remains authoritative; crossbow is an additional ranged option rather than a replacement.

A subset of guards should deterministically receive:

```text
crossbow + bolts
+
normal melee weapon
```

Use an isolated deterministic per-NPC roll similar to the existing shepherd defensive-loadout roll in `src/ai/npcLoadout.ts`.

Suggested initial occurrence range:

```text
30–50% of guards
```

Choose the exact percentage during implementation/balance and keep it deterministic.

Guard ranged preference:

```text
guard → crossbow
```

Typical behaviour:

```text
enemy distant
→ crossbow opening shot

enemy closes
→ melee

safe distance restored / later encounter
→ crossbow may be used again
```

## 11. Sling

`sling` is a cheap, light ranged weapon using the existing `stone`.

```ts
ammoKinds: ['stone']
```

Intended role:

- cheaper and weaker than bows;
- short-to-medium range;
- modest accuracy;
- inexpensive ammunition gathered from the world;
- useful for shepherd defence and early/simple ranged combat.

Suggested starting envelope:

```text
damage: ~7–10
range: ~9–12
accuracy: ~0.60–0.70
```

Balance against current bows and thrown stone during implementation.

## 12. Shepherd sling loadout

Do not replace the existing shepherd primary defensive weapon roll:

```text
spear 45%
pitchfork 30%
axe 25%
```

Sling is an independent optional additional belonging.

Use another isolated deterministic per-NPC roll.

Suggested initial occurrence:

```text
20–30% of shepherds
```

A shepherd with sling behaves through shared combat-mode selection:

```text
predator distant
→ sling

predator close
→ spear / pitchfork / axe
```

Guard/shepherd ranged preferences must not change the ownership of their melee weapons.

## 13. Direct stone throwing

A carried `stone` may be used as an improvised short-range projectile without a sling.

Desired hierarchy:

```text
throw stone
<
sling
<
bow / crossbow
```

Suggested initial envelope:

```text
damage: ~3–5
range: ~5–7
accuracy: low
projectileSpeed: low
```

Do not represent direct throwing by pretending that `stone` is a normal held ranged weapon with itself as ammunition if that makes catalog semantics unclear.

Prefer a small declarative throwable/throw-attack config on the existing item only if the current code needs it, e.g. conceptually:

```ts
throwable?: {
  damage
  range
  projectileSpeed
  accuracy
  recovery
}
```

Final naming/shape must follow current item-catalog conventions.

## 14. Thrown stone is an improvised action, not a weapon family

Thrown stone must not enter normal profession ranged-family scoring.

For NPCs it is a low-priority fallback:

```text
usable normal ranged weapon
→ normal ranged weapon wins

no normal ranged weapon
+ stone available
+ target at suitable short distance
+ defend already preferred over flee
→ optional improvised throw
```

After the throw, the NPC should normally return to melee/flee logic rather than become a persistent ranged fighter.

This prevents every NPC carrying construction/resource stones from implicitly becoming a ranged combat specialist.

## 15. Shared projectile reuse

Crossbow bolts, sling stones and thrown stones use the existing `Projectile` representation.

Do not add:

- `ThrownItemManager`;
- `ThrownStoneProjectile`;
- `BoltProjectile`;
- separate projectile physics.

Only attack configuration and ammo/item identity differ.

## 16. Ammo ownership and world recovery

Ammo must be consumed from the inventory that actually owns it.

Reuse existing player/NPC inventory removal and `resolveNpcAmmo()` ownership rules.

### Bolt

`bolt` follows the ordinary ranged-ammo lifecycle.

Do not add a separate bolt recovery system.

### Sling / thrown stone

Both consume the existing `stone`.

Miss/expiry should use the ordinary `DroppedItems` path.

Because stones are durable resources, prefer allowing a thrown/sling stone to return to the world after impact as well if the shared projectile-result seam supports this cleanly.

Do not create an impact-only recovery subsystem solely for stones. If current shared lifecycle makes hit recovery substantially larger in scope, keep V1 consistent with ordinary projectile recovery and leave hit recovery as a follow-up.

## 17. Player interaction

Player can use:

- crossbow;
- sling;
- direct thrown stone.

Crossbow and sling should reuse current:

- target acquisition;
- reticle/aim feedback;
- ranged projectile resolution;
- stamina rules where applicable;
- ordinary inventory/ammo feedback.

Direct stone throwing should reuse the same projectile-resolution primitives without requiring a second aiming system.

## 18. Skill interaction

Do not create new `crossbow`, `sling` or `throwing` skills in this plan.

Current `archery` accuracy scaling is bow-oriented and should not automatically apply at full strength to every projectile weapon.

Extend the shared ranged config/accuracy seam only as much as necessary to support declarative skill influence.

Desired V1 direction:

- bow → current archery scaling unchanged;
- crossbow → low or reduced archery contribution because the weapon supplies much of the accuracy;
- sling → no or small archery contribution unless current skill semantics clearly justify it;
- thrown stone → no archery bonus.

Prefer a small declarative skill-scaling factor over weapon-kind conditionals.

## 19. NPC ranged scoring

Current NPC ranged ranking uses approximately:

```text
damage / (drawTime + recovery)
```

Crossbow reload makes pure sustained-DPS ranking potentially misleading for profession choice.

Do not solve this with guard-specific score bonuses.

During implementation, adjust the shared ranged scoring only if necessary so it can distinguish:

- opening-shot value;
- sustained cadence;
- profession family preference.

Keep the resolver small and deterministic.

Hunter bow constraint and guard/shepherd family preferences must remain explicit even if the shared score changes.

## 20. Assets

Expected new assets:

- crossbow GLB;
- bolt GLB;
- sling GLB.

Reuse current held-item attachment architecture:

```text
heldToolVisual
→ WristR / grip / HELD_ATTACH
```

Do not create another equipment attachment system.

`stone` continues to reuse its current item/world representation.

Update asset documentation when concrete assets are wired.

## 21. Economy and acquisition

V1 acquisition direction:

```text
crossbow → merchant / guard-oriented availability
bolt     → merchant

sling    → cheap merchant/common item
stone    → existing renewable world resource
```

Do not add bolt production to hunter households.

Future bolt production by blacksmith/craftsman may be added separately if the existing production system has a natural recipe seam.

Do not expand this plan into a crafting/economy overhaul.

## 22. Persistence and ownership

Do not add persistent combat-mode state.

New item kinds use normal inventory persistence.

Profession preferences remain derived from:

```text
role + owned items + catalog metadata
```

Do not persist selected weapon/family/score.

Crossbow reload is combat execution state, not long-lived authoritative identity. Do not add persistent `crossbowLoaded` in V1 unless current save/reconstruction semantics prove that reload state already belongs in authoritative combat state.

NPC belongings continue to live in `personalInventory`.

## 23. Performance

Do not add global or per-frame weapon scans.

Re-evaluate combat mode only at bounded meaningful points, such as:

- combat entry;
- after a ranged shot;
- when the target crosses the close-threat boundary;
- when the currently selected combat mode becomes unusable.

Keep profession-aware weapon ranking encounter-cached where valid.

Do not move this work to a worker.

## 24. Expected implementation seams

Primary likely files, subject to current-code verification at implementation time:

- `src/items/items.ts`;
- `src/items/itemCatalog.ts`;
- `src/items/tradeCatalog.ts`;
- `src/combat/rangedLifecycle.ts`;
- `src/combat/rangedAttack.ts`;
- `src/combat/projectile.ts`;
- `src/player/playerRanged.ts`;
- `src/app/gameLoop.ts`;
- `src/ai/npcCombat.ts`;
- `src/ai/NpcAgent.ts`;
- `src/ai/npcLoadout.ts`;
- relevant item/combat/loadout tests;
- `docs/items/CATALOG.md`;
- `docs/items/WEAPONS.md`;
- asset docs if new GLBs are wired.

Add/update JSDoc on shared architectural/public combat helpers when the new handling/reload seam would otherwise be unclear to preflight/navigation.

## 25. Tests

### Item/ranged families

Verify:

- all current bows → `bow`;
- crossbow → `crossbow`;
- sling → `sling`;
- thrown stone is not a ranged family.

### Hunter

Hunter owning bow + crossbow:

```text
→ bow
```

Hunter normal initial loadout never receives crossbow.

Existing hunting arrow-resupply behaviour remains unchanged.

### Guard

Guard with crossbow + bolts + melee weapon, distant target:

```text
→ ranged crossbow
```

After firing, target becomes close:

```text
→ melee
```

NPC does not wait through crossbow reload while under close pressure.

Deterministic guard crossbow roll is stable for the same NPC id.

### Shepherd

Shepherd sling roll is stable for the same NPC id.

Existing spear/pitchfork/axe roll remains unchanged.

Shepherd with sling + stone + melee:

```text
distant predator → sling
close predator   → melee
```

### Improvised stone

NPC with stone but no normal ranged weapon may perform the bounded improvised throw when combat decision already prefers defence.

NPC with:

```text
stone + usable bow/ammo
```

uses bow rather than thrown stone.

NPC with:

```text
stone + sling
```

uses sling rather than direct throw.

### Crossbow lifecycle

Verify:

- fire consumes one bolt from actual owner;
- reload state follows shared ranged lifecycle;
- unsafe reload can transition to melee;
- ordinary bow timing/lifecycle is unchanged.

### Projectile/recovery

Verify:

- sling consumes exactly one stone;
- direct throw consumes exactly one stone;
- no projectile spawns without required ammo/resource;
- expiry/miss creates at most one ordinary world item;
- no duplicate stone/bolt recovery.

### Determinism

Same:

- NPC id;
- role;
- inventory;
- target distance;

produces the same family/loadout/combat-mode result independent of catalog/map iteration order.

## Models

Check `public/models/items/crossbow.glb`


## 26. Non-goals

Do not implement:

- crossbow-specific AI;
- shepherd-specific combat AI;
- new combat managers;
- NPC kiting AI;
- bolt crafting economy overhaul;
- hunter bolt resupply;
- new ranged skills;
- persistent loaded-crossbow state;
- crossbow/sling durability;
- special sling-stone item kinds;
- fire/explosive/poison bolts;
- armor penetration;
- projectile physics engine;
- ammo equipment slots;
- broad NPC loadout redesign;
- unrelated combat refactors.

## 27. Definition of done

The plan is complete when:

- crossbow + bolt use the shared ranged/projectile architecture;
- crossbow reload is explicitly representable and can be abandoned for close-range melee pressure;
- guard can deterministically receive crossbow as an additional ranged option while retaining melee capability;
- hunter remains a bow specialist and standard hunter behaviour/loadout does not switch to crossbow;
- sling uses the existing `stone` item as ammunition;
- some shepherds deterministically receive sling without changing their existing melee defensive loadout;
- direct stone throwing reuses the shared projectile primitives and stays an improvised fallback rather than a ranged weapon family;
- NPC combat-mode choice accounts for distance/pressure instead of blindly choosing ranged whenever available;
- normal ranged weapon beats improvised throwing;
- ammo/resource ownership stays with the real inventory owner;
- no parallel combat/projectile/profession AI system is introduced;
- targeted automated tests pass.

Manual/browser gameplay verification is performed by the User.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

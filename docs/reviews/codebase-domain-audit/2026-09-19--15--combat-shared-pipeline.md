# Codebase domain audit — 15 — Combat shared pipeline

**Reviewed:** 2026-09-20  
**Master plan:** `tools-018-codebase-domain-and-flow-audit-master.md`  
**Scope:** code correctness, architecture, lifecycle/persistence and performance only  
**Result:** ⚠️ reviewed with unresolved high/critical findings

## Executive summary

Combat has a shared core, but not one universal end-to-end pipeline.

The player and NPC attack paths reuse shared melee/ranged lifecycle primitives, critical-hit resolution and target-owned incoming-damage entry points. Fauna outgoing attacks intentionally remain a separate flat-damage mechanism. HP authority is correctly entity-owned:

- Player: `PlayerController.health` (`HealthState`) through `applyPlayerDamage()`; zero HP enters the player-owned downed lifecycle.
- NPC: `NpcAuthoritativeState.health` through `NpcAgent.applyIncomingCombatDamage()` / `takeDamage()`; the one-shot alive→dead consequence is `commitNpcDeath()`, with `postDeath` as authoritative corpse state.
- Fauna: `AnimalAgent.health` through `takeDamage()`; `collapse()` starts the same-agent corpse lifecycle.

The audit found **one unresolved critical defect** crossing the NPC death edge: a transport carrier can die with an active `in-transit` order and persisted `transportCargo`; the order is not terminated, and the off-screen resolver can later deliver that cargo from the dead NPC. This receives a new focused plan, `settlements-npcs-054`.

A separate **medium** time-skip cleanup defect can discard active combat/action execution through a weaker hand-written reset instead of the normal interruption lifecycle. It is already covered by `npc-058`; no duplicate plan is created.

Previously reported fauna N×N proximity work and frenzy source-claim cleanup are **not current findings**: `fauna-042` and `fauna-043` are implemented on current `main`.

## 1. Shared ownership and pipeline map

### HP authority

| Entity | Authoritative HP | Incoming damage seam | Terminal transition |
|---|---|---|---|
| Player | `PlayerController.health: HealthState` | `playerDamage.ts::applyPlayerDamage()` | HP 0 → `PlayerController.enterDowned()`; combat does not create a dead/corpse entity |
| NPC | `NpcAuthoritativeState.health` | `NpcAgent.applyIncomingCombatDamage()` / `takeDamage()` | first lethal edge → `commitNpcDeath()` + runtime `die()`; persisted `postDeath` owns corpse truth |
| Fauna | `AnimalAgent.health: HealthState` | `AnimalAgent.takeDamage()` | first lethal edge → `collapse()`; corpse state remains on that same animal |

There is no separate runtime HP projection that independently owns hit points for NPCs or fauna. NPC reconstruction shares `NpcAuthoritativeState`; livestock snapshots serialize `AnimalSaveState`. Ordinary wild fauna individual state is intentionally not save-persistent, so a wild combatant does not survive save/load as the same individual. That is an existing persistence policy, not a combat correctness finding by itself.

### Attack mechanics

- Shared human melee: `combat/meleeAttack.ts` lifecycle, `MeleeConfig`, `meleeStrength.ts`, `criticalHit.ts`.
- Shared human ranged: `combat/rangedLifecycle.ts`, `projectile.ts`, `rangedAttack.ts`, `criticalHit.ts`.
- NPC targets use `CombatTargetHandle` and re-read `isAlive()` / `getPosition()` before starting and during combat.
- Fauna outgoing damage remains `fauna/faunaCombat.ts::damageFor()/damageVsHuman()` with flat per-kind values; target-owned incoming damage still owns defense/HP/death consequences.

The fauna math asymmetry is architectural, but this audit did not find a correctness defect caused merely by the absence of human-style critical rolls.

## 2. End-to-end flow traces

| Flow | Current trace | Result |
|---|---|---|
| **player → NPC** | No live player melee/ranged damage producer currently targets NPCs; NPC gaze interaction opens dialogue. | Missing capability, therefore **not a finding** under this audit scope. The NPC incoming seam already supports player-origin damage. |
| **player → fauna** | input → player melee/ranged lifecycle → target/range or projectile hit validation → Strength/critical → `AnimalAgent.takeDamage(..., 'player')` → HP → provoke/aggro reaction → `collapse()` on lethal → corpse lifecycle → quest `animal_died` + player animal-deed consequence → removal/tombstone according to fauna owner. | Coherent. Kill consequences are taken synchronously from the lethal edge; current code snapshots social-kill context instead of retaining the live animal reference. |
| **NPC → player** | No current hostile NPC decision producer was found; `NpcAgent.beginCombat()` live producers are animal defense/hunting-oriented. | Missing capability, **not a finding**. |
| **NPC → NPC** | Shared `CombatTargetHandle`/NPC incoming-damage machinery can represent the target side, but no current ordinary live producer was found in audited combat callers. | Missing capability, **not a finding**. |
| **NPC → fauna** | external decision (hunter / animal-threat defense) → `beginCombat()` → melee/ranged lifecycle → `applyNpcMeleeHit()/applyNpcRangedHit()` → `CombatTargetHandle.applyDamage()` → `AnimalAgent.takeDamage(..., 'npc')` → fauna death/corpse. Hunter `onKill` fires from successful combat completion and then reuses fauna harvest. | Coherent in live simulation. |
| **fauna → player** | fauna threat decision → chase/attack timing → `damageVsHuman()` → `Fauna.update` callback in game loop → `applyPlayerDamage()` → defense/armor → HP/injury → downed transition. | Coherent; dead/downed player is rejected by the incoming seam. |
| **fauna → NPC** | predator target resolution → chase/attack → flat fauna damage callback → `NpcAgent.applyIncomingCombatDamage()` → defense/armor → HP/injury → `commitNpcDeath()` + `die()` on lethal. | Damage/death itself is coherent; downstream transport consequence has F15-1. |
| **fauna → fauna** | predator/rabid/guard decision → prey target validation → `damageFor()` → target `AnimalAgent.takeDamage()` → collapse/corpse → predator/scavenger lifecycle. | Coherent. Current source-target claim cancellation includes the fixed frenzy transitions. |

## 3. Target validation, stale references and dead-target behavior

### Player attacks

Player combat acquisition works on living animal candidates. Melee resolves range/facing at hit time; ranged uses swept projectile collision. The current draw keeps a stable target id and resolves its live position again rather than trusting a cached transform.

### NPC attacks

`NpcAgent.beginCombat()` rejects a dead/unpositioned target:

```ts
if (this.health.dead) return false
if (!intent.target.isAlive() || !intent.target.getPosition()) return false
```

`CombatTargetHandle` is deliberately small and target-owned. The fauna handle returns no position once the animal is dead and its `applyDamage` delegates to the animal's authoritative seam.

No confirmed live-combat stale-reference defect remained after tracing the current implemented fauna cleanup. Runtime combat intent itself is not persisted across reconstruction; this is intentional detailed-simulation state. The time-skip cleanup mismatch is tracked separately as F15-2.

## 4. Death, corpse and exact-once consequences

### NPC

`commitNpcDeath()` is the authoritative one-shot alive→dead transaction. It returns false once `postDeath` already exists, moves the complete `personalInventory` into corpse loot once, records death transform/time and clears the pending player follow-up. `NpcAgent.die()` is presentation/runtime teardown and also runs during dead-state hydration, so it correctly does not mint corpse truth.

NPC corpse cleanup and burial use `postDeath.status`; terminalization is idempotent. This avoids duplicate corpse creation and duplicate personal-inventory loot.

### Fauna

`health.dead` stays authoritative. `collapse()` owns the lethal presentation/corpse edge and the injected `onDeath` callback is documented as once-per-death. `readyToRemove()` is distinct from death: a dead animal can remain as a corpse before its owner removes/disposes it. Livestock removal additionally writes a tombstone so deterministic spawning cannot resurrect a disposed individual.

### Player

Zero HP is downed, not a corpse transition. `applyPlayerDamage()` refuses more damage while downed/dead and therefore cannot repeatedly enter the downed edge.

## 5. Persistence, unload/rebuild and off-screen/time-skip

- NPC HP/death/post-death state is authoritative and persisted through `NpcAuthoritativeState`.
- Livestock persists per-individual animal state; ordinary wild fauna does not preserve an individual through save/load.
- Combat intent/projectiles/action phase are runtime-only and are not persisted.
- During time skip, detailed NPC/fauna combat does not live-tick. Catch-up is coarse: NPC `resolveTimeSkip()` and fauna `resolveTimeSkip()` advance supported state without frame-replaying combat.
- Fauna time-skip catch-up advances corpse age/life but intentionally does not invent off-screen combat encounters.
- NPC time-skip currently clears in-flight execution through a hand-written reset rather than the normal interruption seam; see F15-2.
- Transport has its own persisted/off-screen execution model. That model currently violates the NPC death terminal state; see F15-1.

## 6. Performance

Current `main` no longer performs the previously audited broad wild-fauna N×N proximity scans for the main local threat/prey/carcass queries. `fauna-042` introduced a runtime coarse spatial index rebuilt once per fauna pass, while callers retain exact radius/role/dead/self predicates. Combat/threat branches remain high-priority in adaptive fauna cadence.

No new confirmed recurring O(N²) combat-specific loop was found in this review.

NPC incoming armor derivation scans the NPC's bounded personal inventory at hit time. This is extra work in the damage hot path, but current inventory sizes are small and no unbounded/full-world scan or allocation defect was confirmed from code alone.

## 7. Findings

### F15-1 — Dead transport carrier can retain an active order and later deliver cargo off-screen

**Severity:** critical  
**Affected flow:** any lethal hit → NPC death → transport/order consequence → settlement unload/time skip/off-screen arrival  
**Owner domain:** `settlements-npcs`

**Files / symbols**

- `src/settlement/npcPostDeath.ts::commitNpcDeath()`
- `src/ai/NpcAgent.ts` lethal `takeDamage()` / `applyIncomingCombatDamage()` path
- `src/settlement/SettlementsManager.ts::beginOffscreenTransportHandoff()`
- `src/world/transportOffscreen.ts::resolveOffscreenTransportArrivals()`
- `src/world/transportTransactions.ts::executeTransportUnload()`
- `NpcAuthoritativeState.transportCargo`
- `TransportOrders.findByCarrier()/terminal transitions`

**Evidence**

`commitNpcDeath()` explicitly documents that `transportCargo` is excluded and that carrier death is an unresolved gap: the order remains `in-transit` and cargo remains on the dead NPC.

`resolveOffscreenTransportArrivals()` obtains the authoritative carrier state and immediately resolves destination/unload. It checks order/execution/time/carrier identity, but has no `carrierState.health.dead` guard before:

```ts
const carrierState = lookup.getNpcState(order.carrierNpcId)
if (!carrierState) continue
...
executeTransportUnload({
  carrier: carrierState.transportCargo,
  ...
})
```

Therefore detailed execution stops on NPC death, but a later stream transition can convert the same persisted commitment to off-screen execution and a later checkpoint can deliver it.

**Why this is wrong**

Death must be terminal for actor execution. Here the same authoritative state can mean “corpse that never resumes detailed transport” while the transport subsystem still treats it as an executable carrier. Outcome depends on player-driven streaming timing: cargo can remain stranded while loaded or be delivered after unload/time skip. This is both lifecycle corruption and conservation/continuity failure.

**Affected consumers**

Transport orders, settlement/household inventories, inter-settlement logistics, merchant transport, save/load, settlement streaming, time-skip arrival checkpoints, NPC corpse state.

**Existing plan coverage**

None. `settlements-npcs-052` explicitly excludes `transportCargo`; `settlements-npcs-053` fixes active-registry lifecycle and explicitly does not change transport cargo ownership/death semantics.

**Recommended action**

New focused plan: **`settlements-npcs-054-transport-carrier-death-and-cargo-disposition.md`**.

Use the one-shot alive→dead edge to terminalize the carrier's active order and disposition cargo exactly once, plus dead-carrier guards in off-screen handoff/arrival as defense-in-depth.

---

### F15-2 — Time-skip uses a weaker parallel cleanup path for in-flight NPC combat/action state

**Severity:** medium  
**Affected flow:** active NPC combat/action → time skip → runtime cleanup → resumed detailed simulation  
**Owner domain:** `npc`

**Files / symbols**

- `src/ai/NpcAgent.ts::resolveTimeSkip()`
- `NpcAgent.finishTimeSkipMovementReset()`
- `NpcAgent.catchUpCommittedTravel()`
- `NpcAgent.resetInFlightAction()`
- `NpcAgent.cancelCombat()`
- `SettlementsManager.resolveTimeSkip()`

**Evidence**

`resolveTimeSkip()` is a dedicated catch-up path. `finishTimeSkipMovementReset()` manually leaves the active queue and clears `pendingAction`, movement/conversation/path state instead of routing the interruption through the full normal reset lifecycle. Existing current plan recon also identifies combat/reservation cleanup as part of the missing parity.

**Why this is fragile**

Combat/action lifecycle has more ownership than `phase = choose` and a null pending action. A separate reset list can omit target/claim/reservation or lifecycle failure hooks as those mechanisms evolve. Time advancement should not create a third, weaker interruption implementation.

This finding does **not** claim that time skip must replay every combat hit frame-by-frame; the defect is cleanup/lifecycle parity for combat already in progress.

**Affected consumers**

NPC combat intent, interaction queues, reservations, conversation state, movement/path state and any action lifecycle relying on the normal interruption seam.

**Existing plan coverage**

Yes: **`npc-058-time-skip-resource-and-interrupt-parity.md`** explicitly covers combat/action interruption cleanup and tests for an NPC entering skip with active combat/action state.

**Recommended action**

Implement `npc-058`; do not create another combat-specific time-skip plan.

## 8. Reviewed non-findings / duplicate avoidance

- **Fauna proximity N×N scans:** fixed on current `main` by `fauna-042`; remaining browser/performance comparison is verification, not a new implementation finding.
- **Frenzy source-target food claim leak:** fixed by `fauna-043`; current `npc-attack-frenzied` and `frenzy-beeline` paths release incompatible source targets.
- **Player→NPC / NPC→player / NPC→NPC live combat producers:** absent today; these are missing capabilities, excluded by requested audit scope.
- **Fauna outgoing flat damage vs human critical pipeline:** real architecture asymmetry, but no concrete correctness/lifecycle/performance defect was demonstrated from it.
- **Wild fauna individual save persistence:** intentional current persistence boundary and already documented; not re-filed as a combat finding.
- **Corpse identity/exact-once:** NPC `postDeath` and fauna same-agent corpse lifecycle already provide a single authoritative owner; no duplicate-corpse defect confirmed.

## 9. Follow-up plans

1. **New:** `settlements-npcs-054-transport-carrier-death-and-cargo-disposition.md` — F15-1.
2. **Existing:** `npc-058-time-skip-resource-and-interrupt-parity.md` — F15-2.

Because F15-1 remains unresolved and critical, master audit area 15 must remain **⚠️ reviewed with unresolved high/critical findings**.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

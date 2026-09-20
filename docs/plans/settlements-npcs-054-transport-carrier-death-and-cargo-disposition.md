# Plan: Transport carrier death and cargo disposition

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** high · **Effort:** S  
**Depends on:** ~~settlements-npcs-019~~  
**Domain:** `settlements-npcs`  
**Type:** `fix`  
**Roadmap:** -  

## Problem

Current NPC death is not a complete terminal transaction for an active `TransportOrder`.

`commitNpcDeath()` moves `personalInventory` into `postDeath.loot`, but deliberately leaves `NpcAuthoritativeState.transportCargo` and the carrier's active `in-transit` order untouched. While the settlement remains loaded the dead `NpcAgent` no longer executes detailed transport, so the cargo is stranded. If the settlement later unloads, the existing off-screen handoff/resolver can arm and complete that same order from the dead carrier's authoritative state because it does not reject `health.dead`.

The result depends on streaming timing:

- loaded corpse: order/cargo can remain stuck;
- unload + off-screen checkpoint: the dead carrier can complete delivery posthumously.

This violates the transport ownership/conservation invariant and the combat/death invariant that a dead entity cannot continue world actions.

## Goal

Make the NPC alive→dead edge terminate or settle any active transport commitment exactly once, with one explicit disposition for `transportCargo`.

After death:

```text
carrier health.dead
→ no active TransportOrder for that carrier
→ transportCargo has exactly one terminal disposition
→ no detailed or off-screen delivery can execute from the corpse
```

Reuse the existing `TransportOrders`, `NpcAuthoritativeState.transportCargo`, inventory transfer/drop primitives and `commitNpcDeath()` alive→dead seam. Do not add a second transport lifecycle.

## Architecture decision

Death handling belongs on the one-shot authoritative alive→dead transition, not in polling consumers.

Extend the existing death composition boundary so transport termination is coordinated exactly once when `commitNpcDeath()` succeeds. Keep a defensive dead-carrier guard in off-screen handoff/arrival resolution so malformed/legacy state cannot execute a posthumous delivery.

Choose one explicit cargo disposition during implementation after checking the current item/drop APIs:

1. move transport cargo into the same physical post-death loot/drop ownership used for real NPC-owned goods, **or**
2. fail the order and materialize the cargo as world-owned dropped items at the death transform.

Do not refund to source after pickup: ownership already moved to `transportCargo`.

## Scope

### 1. Resolve active transport on alive→dead

At the one-shot death edge:

- resolve the carrier's current active order through the existing carrier lookup;
- if it is `assigned` before pickup, cancel/fail it with no cargo mutation;
- if it is `in-transit`, terminalize it exactly once and disposition the exact contents of `transportCargo`;
- clear no unrelated transport order;
- repeated death/hydration calls must be no-ops.

Do not put transport logic inside `NpcAgent.die()`: that method is also used for already-dead hydration and is not the authoritative death edge.

### 2. Exact-once cargo disposition

Use inventory transfer/snapshot helpers that preserve:

- stack counts;
- item instances;
- perishable freshness batches;
- capacity semantics appropriate to the chosen terminal owner.

After a successful terminal handoff, `transportCargo` must be empty. A partial failed transfer must leave a recoverable owner and must not also terminalize as if the cargo were safely handed off.

### 3. Block posthumous off-screen execution

Harden both boundaries that can abstract live transport:

- `beginOffscreenTransportHandoff()` must not arm execution for a dead carrier;
- `resolveOffscreenTransportArrivals()` must not call `executeTransportUnload()` for `carrierState.health.dead`.

The arrival guard is defense-in-depth for old/malformed saves and races; it is not the primary death transaction.

### 4. Save/load and rebuild continuity

Verify current serialization of:

- active `TransportOrder`;
- `NpcAuthoritativeState.health`;
- `transportCargo`;
- `postDeath`.

A save immediately after carrier death must contain the terminal post-death/cargo result and no resumable delivery for that carrier.

Do not add a top-level cargo save field.

## Relevant files / symbols

- `src/settlement/npcPostDeath.ts::commitNpcDeath`
- `src/ai/NpcAgent.ts` lethal-damage call site
- `src/world/createTransportOrders.ts` / `TransportOrders.findByCarrier` and terminal transitions
- `src/world/transportOffscreen.ts::resolveOffscreenTransportArrivals`
- `src/settlement/SettlementsManager.ts::beginOffscreenTransportHandoff`
- `src/world/transportTransactions.ts::executeTransportUnload`
- `src/settlement/npcState.ts::transportCargo`
- focused transport/death/save tests.

## Guardrails

- no second transport registry or death system;
- no transport cargo in `NpcAgent.carried` or `workCargo`;
- no source refund after an `in-transit` pickup;
- no polling every dead NPC from transport each frame;
- `commitNpcDeath()` stays idempotent;
- corpse hydration must not replay cargo disposition;
- terminal transport transition and cargo handoff must be exact-once;
- do not expand into merchant journey design, escorts or combat AI.

## Automated verification

Add focused tests proving:

1. carrier dies while `assigned` before pickup → order becomes terminal and source/cargo are unchanged;
2. carrier dies `in-transit` → order becomes terminal and every cargo item has exactly one terminal owner;
3. calling the death edge twice does not duplicate loot/drop/cargo or repeat the order transition;
4. dead carrier cannot receive an off-screen execution handoff;
5. legacy/malformed dead + `in-transit` state is not delivered by `resolveOffscreenTransportArrivals()`;
6. save/load immediately after death does not resurrect the active order or cargo;
7. settlement unload/reload after death cannot change the cargo disposition;
8. time-skip arrival checkpoint after death cannot deliver;
9. ordinary living-carrier pickup/off-screen/delivery stays unchanged;
10. perishable batches and item instances survive the chosen death handoff losslessly.

## Manual verification

User-owned browser verification only:

- start a real transport delivery, kill the carrier after pickup, then leave/re-enter the settlement and use time skip;
- confirm the cargo remains at its one terminal owner and is never delivered from the dead NPC.

AI agent does not run browser verification.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Plan: World-bound UI session rebuild lifecycle

**Created:** 2026-09-20  
**Status:** `planned` 📋  
**Priority:** high · **Effort:** S  
**Depends on:** world-033  
**Domain:** `ui-input`  
**Type:** `fix`  
**Roadmap:** -

## Goal

Make every UI session that depends on world-owned runtime identity safe across an in-session `WorldBundle` rebuild.

A rebuild must never leave an open UI surface reading or mutating an `NpcAgent`, `Settlement`, corpse/post-death object or other runtime target from the disposed world generation.

Keep Vue as presentation. Do not add a second world/entity registry.

## Source finding

Created from codebase domain audit area 23:

`docs/reviews/codebase-domain-audit/2026-09-19--23--ui-simulation-contracts.md`

Relevant finding: F23-1.

## Current code / ownership

### Composition root

`src/app/createApp.ts::rebuildWorld()` owns in-session world replacement and already performs explicit post-rebuild rebinds for selected consumers.

`world-033` owns the central rebuild transaction / invalid-world gate. This plan must consume that lifecycle boundary rather than creating another generation coordinator.

### Vue store

`src/ui-vue/store.ts` has both pure projections and world-bound sessions.

World-bound examples include:

- `NpcDialogueMenuState.npc`;
- `NpcDialogueMenuState.settlement`;
- merchant `npc`;
- Villagers `Raw<NpcAgent>` entries;
- FlavorDialog actions where the action closes over a world target.

### Container actions

`src/app/actions/containerActions.ts` mostly follows stable-id re-resolution for placed/world containers and animal packs, but NPC corpse transfer retains a direct `NpcAgent`.

### Existing good pattern

`src/app/actions/inspectionActions.ts` stores `InspectionTargetRef { kind, id }`, re-resolves through current `ctx.bundle`, refreshes the read model, and closes when the entity no longer exists.

Reuse this principle.

## Implementation requirements

### 1. Add one world-bound UI invalidation seam

At the composition root, define one explicit operation that invalidates/ends UI state whose identity belongs to the current WorldBundle generation.

Invoke it at the rebuild lifecycle boundary defined by `world-033` before disposed runtime objects can remain actionable.

Do not scatter generation counters through Vue components.

### 2. Classify surfaces by ownership

Do not close every UI indiscriminately.

World-independent/app-owned surfaces may survive when their authority survives, for example player Inventory projections where appropriate.

World-bound surfaces must either:

- close/reset on rebuild; or
- retain only stable identity and re-resolve against the fresh bundle before rendering/action.

Prefer closing transient conversational/transfer sessions unless there is a concrete continuity requirement.

### 3. NPC dialogue / merchant

For NPC dialogue and trade:

- never keep a disposed NPC actionable after rebuild;
- if continuity is preserved, store stable NPC/settlement identity and resolve the current runtime owner before every action;
- otherwise close the session at rebuild;
- do not use object-identity membership against a retained pre-rebuild `NpcAgent`;
- merchant settlement/social pricing and stock mutation must refer to the same current-world counterparty.

Do not create a global `Map<NpcId, NpcAgent>`; use current `SettlementsManager` resolution mechanisms.

### 4. NPC corpse transfers

Remove the stale-runtime hazard from `openTransfer = { kind: 'npcCorpse', npc }`.

Either:

- store sufficient stable corpse/NPC identity and re-resolve current post-death state at commit time; or
- close corpse transfer on rebuild.

A transfer must never add loot to player Inventory while mutating only an old-generation corpse object.

Preserve existing rollback/capacity rules; this plan does not replace `items-player-055`.

### 5. Villagers and generic callback surfaces

Audit the currently-open Villagers and Flavor/confirmation surfaces for world-owned runtime captures.

Only add rebuild invalidation where a callback/read model can outlive its target generation. Stable-id callbacks that already re-resolve live state should remain unchanged.

Do not rewrite all callbacks into a new command framework.

### 6. New Game and same-world rebuild semantics

Both paths must be explicit:

- same-world terrain/config rebuild: no stale runtime refs from the old generation;
- New Game: close/reset all old-world entity sessions; never rebind them into the new seed.

App-owned player UI can then refresh from its own authoritative reset/rebind owners.

### 7. Dispose remains symmetric

App teardown must still dispose/unmount UI normally.

If a small shared reset helper is introduced in `store.ts`, it must clear world-bound references/callbacks as well as visible `open` flags so module-level references cannot keep old runtime objects reachable.

## Files / symbols to inspect first

- `src/app/createApp.ts::rebuildWorld`
- `src/app/worldBundle.ts::rebuildWorldBundle`
- `src/ui-vue/store.ts`
  - NPC dialogue
  - merchant
  - villagers
  - FlavorDialog / ActionConfirm
  - container screen facade
- `src/app/inventoryWiring.ts`
  - `findSettlementForNpc`
  - `settleNpcGoodsTransaction`
- `src/app/actions/containerActions.ts`
  - `openTransfer`
  - `openNpcCorpse`
  - corpse transfer handlers
- `src/app/actions/inspectionActions.ts` as the stable-id reference pattern
- `src/ui-vue/mount.ts::dispose`
- relevant UI store/unit tests

## Tests

Add focused automated coverage for lifecycle contracts:

1. open NPC dialogue → rebuild invalidation → old `NpcAgent` cannot be read/actioned;
2. open ordinary NPC trade → rebuild → transaction cannot use old NPC/household inventory;
3. open NPC corpse transfer → rebuild → old corpse loot cannot be transferred/duplicated;
4. same-world rebuild leaves stable-id World Inspection safe or closes only when target no longer resolves;
5. New Game closes all old-world entity sessions;
6. repeated invalidation/close is idempotent;
7. app dispose after invalidation leaves no retained world-bound callbacks/references.

Prefer testing a small reset/invalidation contract and existing application controllers rather than mounting a browser for every case.

## Guardrails

- no second simulation state in Vue;
- no global runtime NPC/entity registry;
- no duplicate WorldBundle generation/lifecycle state — depend on `world-033`;
- do not absorb mount lifecycle — `items-player-057` owns it;
- do not absorb interaction target cycling — `ui-input-028` owns it;
- do not redesign container transaction atomicity — `items-player-055` owns it;
- no browser verification by the AI agent;
- do not run `pnpm docs:sync`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Implementation Notes: Authored starter repairs and disputed wood world consequences

Source plan: `docs/plans/archive/quests-progression-073-authored-starter-repairs-and-disputed-wood-world-consequences.md`

Recon against current `main` on 2026-09-20. These notes record implementation-relevant ownership, seams and discrepancies only.

## 1. Existing ownership to preserve

### Quest lifecycle

`src/quests/QuestManager.ts` owns quest progress/outcomes and currently performs final `gather_item` hand-in in `selectGatherTurnIn(...)`.

Current order is:

```text
inventory.has
→ inventory.remove
→ completeObjectiveSlot
→ possibly applyOutcome
```

There is no domain side-effect between removal and quest completion for a gathered item. Do not special-case the four quest ids inside `selectGatherTurnIn`.

Add one narrow injected/domain effect seam for a successful gather turn-in so the world transfer can be part of the same transaction. The seam must be able to fail/preflight before quest progress is committed. Avoid a sequence where player items are removed and destination transfer can then fail.

`QuestManager` must still not import settlement/household modules.

### Settlement structure condition

Relevant files:

- `src/settlement/structureCondition.ts`
- `src/settlement/structureStateRegistry.ts`
- `src/settlement/structureRepairCandidates.ts`
- `src/settlement/SettlementsManager.ts`

`SettlementStructureStateRegistry` is already the manager-lifetime authority and is generic at the storage level: records are keyed by `settlementId + structureId`, survive stream-out, serialize through `snapshotStructureStates()`, and are written to `SaveData.structureStates` by `src/app/saveState.ts`.

Reuse:
- `beginRegistryStructureRepair(...)`
- `contributeRegistryStructureRepairWork(...)`
- `world/condition.ts`
- `world/repair.ts`

Do not create another condition/repair registry.

The current policy/candidate layer is narrower than the registry:
- `structureRepairPolicy(...)` only supports `VillageBuildingRole === 'residential'`;
- `createNpcStructureRepairHooks(...)` binds one NPC only to its own residential house;
- `residentialRepairCandidates(...)` only enumerates loaded residential houses.

The new fence/wagon/foundation targets therefore need a small extension of the policy/candidate layer, not a replacement registry.

## 2. Foundation: do not overload the existing house record

The current residential house has one state under `residentialStructureId(familyIndex)`, one optional active `repair`, and a global residential material policy (`beam + branch`).

Using that exact record for an authored `foundation` repair would create an ambiguity with ordinary whole-house damage/repair.

Preferred implementation:

```text
root house id: building-house-0
foundation subtarget: stable id derived from root + component
```

For example, add one canonical helper in the settlement domain that derives the component target id from `residentialStructureId(0)`; do not hand-build strings at call sites. The subtarget may still live in `SettlementStructureStateRegistry` because that registry accepts arbitrary stable structure ids.

Add a policy resolver for this authored component:
- material: `6 x stone` for the starter restoration;
- work requirement should use the existing repair-work mechanism;
- parent residential policy remains unchanged.

Do not add a generic arbitrary component graph. One explicit `foundation` component contract is sufficient for this plan.

Presentation should resolve the foundation subtarget state and derive missing/scattered stones from it; no separate persisted visual flag.

## 3. Household materials

`src/settlement/household.ts` already owns a persistent generic `Inventory` as `Household.items`. It is serialized inside `HouseholdSnapshot.items` and survives manager rebuild/save-load through the existing household registry.

Important details:
- `depositWood(...)` has household capacity semantics and may overflow into settlement economy;
- `Household.items` can hold arbitrary `ItemKind`, including non-food/non-wood items;
- there is no generic public “deposit arbitrary repair item” method equivalent to `depositWood`.

For Piotr's private repair deliveries, use the Leśniewski household id derived through the existing `householdIdFor(settlementId, 0)` contract; do not locate the household by NPC display name.

For branches, if `depositWood(...)` is used, the repair material adapter must read the same final owner, including overflow. Do not let a full household silently route the quest's five branches to settlement stock while Piotr's repair hook checks only household items.

For stone/foundation, prefer a small generic household-item deposit mutation API over quest code mutating `Household.items` ad hoc if a new public seam is needed. It should preserve the household as authority and snapshot automatically; it does not need a second stock system.

## 4. Authored initial damage must be idempotent

A missing registry record currently means pristine condition = 100. Therefore starter damage cannot be “applied every time settlement loads”.

Seed authored damage once through a manager/registry-level bootstrap rule that is idempotent across:
- settlement stream-out/in;
- WorldBundle rebuild;
- save/load.

A saved/mutated record always wins over the initial authored default.

Do not derive “damaged because quest is not complete” every frame. The damage is world state; quest state only controls the initial reservation/release.

## 5. Starter repair reservation

Ordinary residential NPC repair is currently driven by repair pressure + material availability. A damaged authored target with available materials could therefore be repaired before the corresponding starter delivery unless it is gated.

Keep reservation in the settlement repair-target domain, not `NpcAgent` and not `QuestManager`.

Recommended shape: the target descriptor exposes whether autonomous repair is currently allowed. The composition root/quest-world bridge updates/releases that reservation after the successful hand-in.

The reservation should block only autonomous repair start. It should not fake condition and should not own repair progress.

If player-first repair is supported, player repair uses the same authoritative target state and can bypass the autonomous reservation only by an explicit player interaction rule. Quest dialogue then reads the real target state.

## 6. NPC repair execution

`createNpcStructureRepairHooks(...)` currently supplies only one own-house target to an NPC. Do not add world scans.

Extend the existing bounded-hook pattern so an NPC can receive a small fixed list of local repair targets:
- Piotr: household fence, foundation, logging wagon;
- Anna (or another explicitly selected local worker if current role arbitration requires it): communal fence.

Pressure/arbitration stays in the existing NPC decision system. A delivered quest must not directly force movement or invoke repair work.

If the target is reserved, its pressure should resolve to 0 until release. Once released and materials are available, normal decision arbitration can choose it.

Add JSDoc with `@domain settlements` / `@domain npc` on any new public architectural target/hook types so preflight can discover them.

## 7. Household fence target

There is no existing household-fence lifecycle. The plan should reuse the shared condition/repair registry, but the physical placement can be a small authored yard prop near family index 0.

Use existing household geometry as the anchor:
- `landmarks.houses[0]` / home position;
- `HOUSEHOLD_YARD_PROP_OFFSETS` and existing yard clearance contracts.

Do not bind state to the rendered mesh. Give the fence one stable domain id and derive its damaged/intact placements from registry state at settlement materialization/update.

Do not reuse:
- settlement entrance palisade;
- player `PalisadeSegmentRecord`.

## 8. Anna communal fence: home-size discrepancy

The source plan prefers `VillagePlan.pasture.fenceSegments['pasture-fence-a']`.

Current worldgen does **not** guarantee a pasture in the home settlement:
- auto home is clamped to `SM` or `MD`;
- `villagePasture.ts` returns no pasture for `SM`/OUTPOST;
- MD+ may also omit a pasture if no valid dry site is found.

Therefore the quest target resolver must not assume `plan.pasture!`.

Preferred resolution:
1. when a home pasture exists, bind the authored communal repair target to stable `pasture-fence-a`;
2. otherwise create one deterministic **communal fallback fence** in the home settlement near an always-present shared food/garden area, using the same repair-target type/material policy.

Do **not** force the whole home settlement to MD or change `rollVillageSize` just to satisfy this quest.

Dialogue/description should remain generic enough (“ogrodzenie osady / przy wspólnym gospodarstwie”) or resolve a target-specific text token so an SM fallback never claims a nonexistent pasture.

The existing `VillagePastureFenceSegment.id` is stable plan data and is suitable as an input to the target id; the instanced `PropPlacement` is presentation only.

## 9. Piotr logging wagon

There is already merchant-wagon placement/render code (`src/settlement/merchantWagon.ts`, `props.ts`) and a `landmarks.merchantWagon` presentation landmark.

Reuse the asset/loading/presentation technique only. Do not reuse the merchant landmark/ownership/lifecycle for Piotr's wagon.

Anchor Piotr's wagon deterministically from family 0's house/work context and give it its own stable repair-target id. It can use the same shared condition/repair registry/policy adapter as the fences rather than a new wagon manager.

If the existing wagon asset has no damaged submesh, a deterministic missing/tilted accessory or wheel/wood-piece presentation is preferable to introducing a quest-only state flag.

## 10. Questline ordering: use prerequisites, not a chain manager

`sporne-drewno` already resolves an authored outcome and `QuestPrerequisite.quest_outcome` already gates follow-ups.

Preserve that mechanism.

The clean ordering is:
- priority outcome unlocks the first follow-up;
- completion outcome of that first follow-up unlocks the second follow-up.

This requires prerequisite expressions that represent either priority path plus the appropriate first-follow-up completion. Extend the existing prerequisite composition minimally if current validation cannot express it; do not create `QuestChainManager`.

Keep both final follow-up quest ids stable unless a migration/validator constraint forces otherwise; saved quest progress references ids.

Update authored consequences in `src/quests/quests.ts`:
- remove the automatic negative relation on the non-prioritized spouse;
- priority outcome gives the intended reputation dimension;
- each actual delivery gives its own relation increase.

## 11. Hand-in transaction bridge

The composition root already injects world-facing hooks into `QuestManager` rather than letting it import world domains. Follow that pattern.

A repair-delivery bridge needs, at minimum:
- current home settlement id;
- target descriptor for the authored quest;
- household/economy lookup through `SettlementsManager`;
- current world day if the transfer/release mutates condition/repair metadata.

The bridge should return success/failure to `selectGatherTurnIn`. Quest objective completion must happen only after a successful world transfer.

Do not put settlement object references into `QuestDef`. Definitions remain serializable authored data; resolve stable target ids in the world bridge.

## 12. Persistence path already available

Existing persistence path:
- `SettlementStructureStateRegistry.serialize()`
- `SettlementsManager.snapshotStructureStates()`
- `src/app/saveState.ts` → `SaveData.structureStates`
- `src/app/worldBundle.ts` passes initial structure states back into `createSettlementsManager`.

Household items are already persisted through:
- `snapshotHouseholds()`
- `SaveData.households`.

Prefer fitting new fence/foundation/wagon repair state into these two existing snapshots. Avoid a new save top-level unless a concrete state cannot be represented there.

If repair-target metadata such as reservation cannot be derived from quest progress + target identity on load, persist it beside the structure state rather than in a new quest-owned world-state map.

## 13. Presentation/materialization seam

`props.ts` already materializes:
- houses;
- household yard props;
- pasture fence placements;
- merchant wagon presentation.

Keep render derivation close to those existing materialization paths. Registry state is authoritative; renderer receives a snapshot/condition and chooses intact/damaged placements.

Do not add per-frame global scans. Refresh only the few authored target visuals when their state changes, or derive them at settlement materialization plus existing settlement update hooks.

## 14. Suggested implementation order

1. Add generic authored repair-target identity/policy support on top of `SettlementStructureStateRegistry`.
2. Add foundation subtarget policy and tests without touching quest code.
3. Add household fence + communal fence target resolution, including SM fallback.
4. Add logging wagon target/presentation.
5. Extend bounded NPC repair hooks to accept these targets and reservation gating.
6. Add quest-world gather hand-in transaction bridge.
7. Seed initial damage/reservations idempotently for home settlement.
8. Update `src/quests/quests.ts` content/prerequisites/consequences.
9. Add player-first repair dialogue branch only after world-state paths are stable.
10. Verify save/load and WorldBundle rebuild using existing structure/household snapshots.

## 15. Tests worth reusing/extending

Prefer focused tests next to existing domains:
- `structureCondition*.test.ts` / `structureStateRegistry*.test.ts` for policy/subtarget/repair;
- `structureRepairCandidates*.test.ts` for bounded NPC target hooks/reservation;
- `families*.test.ts` only if binding family index 0 needs an assertion;
- `villagePasture*.test.ts` for pasture/no-pasture target resolution;
- `QuestManager*.test.ts` for transactional gather hand-in failure/success;
- authored quest definition/validation tests for dual follow-up ordering;
- save/persistence tests for `structureStates` + household material round-trip.

Critical regression checks:
- ordinary residential repair still consumes its existing `beam + branch` policy;
- no starter damage is reapplied after repair + reload;
- no quest completion occurs if world material transfer fails;
- both `drewno-dla-anny` and `drewno-dla-piotra` can complete in one save;
- an SM home still has a valid Anna communal repair target.

## 16. Avoid during implementation

- no new quest-owned world state manager;
- no NPC lookup by display name for material/repair ownership;
- no forced MD home size;
- no direct reuse of merchant wagon authority;
- no component state stuffed into the parent residential record if it can collide with ordinary house repair;
- no per-frame scan of settlement plans/Three.js objects from NPC code;
- no manual `pnpm docs:sync`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

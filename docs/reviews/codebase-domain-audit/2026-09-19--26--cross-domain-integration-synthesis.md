# Codebase domain audit 26 — Cross-domain integration synthesis

**Date:** 2026-09-20  
**Result:** ⚠️ reviewed with unresolved high findings, all with an owner and next action

## 1. Scope

This is the final synthesis for audit areas 01–25. It does not repeat the domain audits. It groups confirmed cross-domain findings by shared ownership/lifecycle seam, checks whether the current repair plans close the whole producer→consumer flow, and re-checks current `main` only where the combined reviews expose ambiguity.

Primary flows synthesized:

- player ↔ world ↔ interaction ↔ persistence/rebuild;
- NPC ↔ settlement ↔ household/work/resources ↔ off-screen/reification;
- NPC ↔ quests/reputation;
- fauna ↔ world ↔ movement/water/caves ↔ lifecycle;
- domestic animals ↔ settlement/player/merchant journey ↔ save/load/rebuild;
- items ↔ interaction/UI ↔ inventory/equipment ↔ persistence;
- combat/death ↔ corpse/cargo/economy/quests;
- WorldBundle ↔ UI/audio/debug lifecycle.

No new feature gap is reported as a finding.

## 2. Systemic cross-domain seams

### S1 — World generation / WorldBundle rebuild is one lifecycle boundary, but several consumers still own old-generation runtime references

This is the broadest unresolved integration seam.

The same root failure appears in:

- area 01: destructive/in-flight rebuild publication and failure handling;
- area 03: rebuild is destructive before fresh reconstruction is committed;
- area 19: mount state retains a direct `AnimalAgent` reference across rebuild;
- area 23: world-bound UI sessions can retain NPC/corpse/runtime callbacks across rebuild and rebuild-triggering config can race;
- area 20 (medium): interaction cycling retains selection runtime state across rebuild;
- area 04: deterministic system terrain modifications can be re-applied across same-session rebuild.

Current-code re-check confirms that `createApp.ts::rebuildWorld()` still calls `gameLoop.forgetHighlight()` as a narrow interaction cleanup, while mount and UI plans explicitly describe additional old-generation handles. `world-033` correctly defines the composition-root transaction and invalid-world gate; consumer plans must consume that contract rather than inventing generation counters.

**Root owner / plan:** `world-033-worldbundle-rebuild-transaction-and-lifecycle-safety.md`.

**Consumer plans:**

- `ui-input-031-world-bound-ui-session-rebuild-lifecycle.md` — depends on `world-033`;
- `items-player-057-mounted-player-lifecycle-and-restore-continuity.md` — depends on `world-033` and livestock identity continuity;
- `ui-input-028-interaction-target-identity-and-cycle-lifecycle.md` — should use the same rebuild lifecycle signal;
- `world-terrain-043-system-terrain-modification-rebuild-idempotency.md` — separate producer/idempotency fix, but must be regression-tested through the same rebuild transaction.

**Synthesis:** area 01 F3/F5, area 03 F03-8 and area 23 F23-2 are one root lifecycle problem, not three independent coordinators. Area 19 F19-2/F23-3 and area 23 F23-1 are consumer invalidation/re-resolution problems downstream of that root.

### S2 — Time-skip has one elapsed interval but multiple owner-specific catch-up implementations

Areas 02, 12 and 13 collectively describe one invariant:

```text
requested skipped interval
→ World Time advances by exactly that interval
→ every frozen owner receives exactly that interval once
→ owner-specific mutations reuse normal authoritative owners
→ detailed runtime state is safely interrupted/reified
```

The unresolved defects are not evidence for a generic scheduler. They are mismatches between the existing global skip handshake and owner-specific catch-up.

**Foundation:** `world-034-time-skip-clock-exactness-and-catch-up-coverage.md`.

**Consumers:**

- `npc-058-time-skip-resource-and-interrupt-parity.md` — authoritative resource mutations + cleanup parity;
- `npc-061-time-skip-and-reification-surface-placement-validity.md` — detailed materialization validity after coarse travel;
- `fauna-040-settlement-rat-reconciliation-checkpoint.md` — already done; prevents repeated mutation when runtime is reconstructed;
- fauna `AnimalAgent.resolveTimeSkip` fan-out belongs in `world-034`, not a second fauna clock.

Current source still documents `createFauna.resolveTimeSkip` as the sole catch-up path for its registry, while settlement-owned agents require explicit settlement fan-out. That confirms the synthesis from area 02 remains current.

### S3 — Runtime movement surface, water and reification use related but not interchangeable spatial authorities

Areas 04, 05, 07, 08 and 19 expose one cross-domain distinction that must remain explicit:

- analytical/generated terrain is valid for worldgen/coarse/off-screen queries;
- resident runtime movement surface is authoritative for detailed movement;
- bridges are part of movement surface, not base terrain;
- caves remain a separate higher-priority spatial context;
- local physical water is a separate query from global sea level.

The main integration defect is consumers silently treating a weaker query as equivalent when runtime data is unavailable.

**Foundation:** `world-terrain-044-runtime-ground-query-authority-and-missing-chunk-fallbacks.md`.

**Dependent repairs:**

- `world-terrain-045-canonical-local-water-player-traversal.md`;
- `world-terrain-046-unified-water-shore-query-and-river-hotpath.md`;
- `npc-061-time-skip-and-reification-surface-placement-validity.md`;
- `persistence-006-player-cave-position-save-load-continuity.md`;
- `fauna-045-cave-surface-perception-boundary-and-entrance-awareness.md`.

**Synthesis:** area 04 F04-2, area 05 F05-1/F05-2 and player/navigation restore findings are consumers of the same “query meaning must be explicit” problem, but they are not one implementation plan because ground, water and cave arbitration have different owners.

### S4 — Founded settlement persistence is ahead of live runtime ownership

Areas 03, 09, 10, 13 and quest consumers converge on one staged gap:

```text
founded record / resident identity
→ household + home binding
→ shared resident materializer
→ loaded settlement runtime
→ stream-out / reification / time-skip
→ persistence
```

The existing decomposition is correct:

1. `settlements-020` — bootstrap integrity;
2. `settlements-021` — shared resident runtime/materializer;
3. `settlements-022` — founded settlement live runtime + streaming.

Current plan/code notes confirm 021 intentionally stops before manager streaming and 022 consumes 020 + 021. No parallel founded-NPC runtime should be introduced by quests, NPC cognition or economy.

**Synthesis:** area 03 F03-2/F03-3 and the high findings from area 09 are stages of the same missing live-runtime chain, already correctly owned by 020→021→022.

### S5 — Persistent livestock identity and mounted/merchant runtime identity must share one durable key contract

Areas 03, 17, 19 and 23 describe the same identity seam:

```text
persistent livestock identity
→ settlement/detached registry
→ merchant pack assignment / journey
→ player mount reference
→ stream-out / WorldBundle rebuild
→ save/load restore
```

Current-code re-check still shows `createApp.ts` resolving a mount through `resolvePersistentAnimal(animalId)` from a bare string and `mountActions.ts` retaining a direct `AnimalAgent` handle. This is exactly the seam identified by the audits.

**Producer/identity owner:** `settlements-npcs-048-merchant-pack-animal-assignment-and-journey-continuity.md`.

**Consumer/lifecycle owner:** `items-player-057-mounted-player-lifecycle-and-restore-continuity.md`, after `world-033`.

Although `settlements-npcs-048` is marked `verification needed`, the synthesis must treat the bare-id runtime API as a verification failure until the durable identity contract is demonstrably unambiguous on current code. Do not create a new livestock-identity plan; close it under 048, then implement/verify 057 against that contract.

### S6 — Economic goods can cross execution, cargo and death boundaries, but each payload class needs exactly one owner

Areas 03, 11, 13, 15 and 18 converge on a conservation problem with three intentionally distinct ownership classes:

- `personalInventory` — belongings;
- `transportCargo` — goods bound to a `TransportOrder`;
- `workCargo` — local/profession economic payload after source mutation.

`settlements-npcs-052` correctly promotes source-mutated local work payload out of transient action closures into authoritative NPC state and explicitly defines death/cancellation disposition.

`settlements-npcs-054` correctly owns the separate active-`TransportOrder` death edge and requires exact-once terminal disposition of `transportCargo`.

These plans must not merge cargo stores, but both should converge on the existing post-death/world-item handoff primitives and the same exact-once death transaction.

**Important ordering note:** `052` and `054` can be implemented independently at the storage-model level, but the final death/corpse regression pass should verify both together. If `commitNpcDeath()` is modified by both plans, rebase/sequence the second implementation on the first rather than letting each add an unrelated cargo handoff branch.

No new plan is required.

### S7 — World item transfer and UI transfer are different call sites of the same ownership invariant

Area 18's high world-pickup finding and medium container transfer finding share the invariant:

```text
source owner retains item
until destination admission is known
→ one atomic ownership commit
→ source consumed only after destination owns exact payload
```

Current code still removes a world source via `collectItem(...)` before `inventory.addInstance(...)` and ignores the instance insertion result.

**Owner:** `items-player-053-atomic-world-pickup-ownership-transfer.md` for world pickup. Container/UI branches should reuse existing rollback-safe `Inventory` transfer primitives rather than duplicating the transaction shape.

This is separate from S1's stale UI-session problem: one is ownership atomicity, the other is runtime-generation validity.

### S8 — Quest/reputation state is mostly a consumer; do not make it a shadow owner of world consequences

Area 21 found no high/critical quest-state ownership defect. The important cross-domain rule from synthesis is to keep quest systems as consumers/projections of world/NPC/settlement consequences:

- startup readiness for definitions belongs to `world-003`;
- authored persistent world effects belong to `world-031`;
- generated opportunity retention / invalidated restore metadata remain bounded quest-owned medium findings (`quests-progression-071/072`);
- founded settlement/NPC or combat/economy fixes must not be duplicated inside quest state.

## 3. Unresolved high/critical findings grouped by systemic problem

| Systemic problem | Audit findings represented | Current owner / next action |
|---|---|---|
| WorldBundle rebuild transaction | 01 F3/F5, 03 F03-8, 23 F23-2 | `world-033` |
| Stale world-generation consumers | 19 F19-2, 23 F23-1/F23-3 | `items-player-057`, `ui-input-031` after `world-033` |
| Startup deferred readiness | 01 F1/F2 | close verification failures under `world-003` |
| Time-skip interval/fan-out | 02 F1/F2 | `world-034` |
| NPC time-skip authoritative mutation parity | 02 F3, cognition/work equivalents | `npc-058` |
| Runtime surface/query authority | 04 F04-2, related navigation/reification findings | `world-terrain-044`, then consumers |
| Local water authority | 05 F05-1/F05-2, 19 F19-7 | `world-terrain-045/046` |
| Founded settlement live runtime | 03 F03-2/F03-3, 09 high findings | `settlements-020 → 021 → 022` |
| Livestock durable identity / journey / mount | 03 F03-4, 17 F17-1..3, 19 F19-8 | repair/verify `settlements-npcs-048`, then `items-player-057` |
| Persistent economic work cargo | 03 F03-1, 11/13 equivalents | `settlements-npcs-052` |
| Carrier death / ghost delivery | 03 F03-5, 15 transport-death seam | `settlements-npcs-054` |
| Atomic world-item pickup | 18 F18-1 | `items-player-053` |
| Cave/player persistence continuity | 19 F19-6 / navigation seam | `persistence-006` |
| Player HP/injury persistence + New Game reset | 19 F19-1/F19-5 | `items-player-050 → 056` |
| System terrain rebuild idempotency | 03 F03-6, 04 F04-1 | `world-terrain-043` |

No critical finding without an owner was found. No high finding requires a new plan after synthesis.

## 4. Plans already covering the synthesis

High-value active/planned repair owners:

- `world-033` — rebuild transaction root;
- `world-034` — time-skip clock/fan-out root;
- `world-terrain-043/044/045/046` — rebuild-idempotent terrain + explicit ground/water authority;
- `npc-058`, `npc-061` — NPC catch-up and reification consumers;
- `settlements-022` after completed/verification-stage 020/021;
- `settlements-npcs-052`, `settlements-npcs-054`;
- `items-player-050/053/056/057`;
- `persistence-006`;
- `ui-input-031`.

Plans already marked done/verification-needed remain valid owners where the current review explicitly identifies a verification failure; status alone does not override current-code evidence.

## 5. Missing plans

**None.**

Every confirmed high/critical cross-domain finding has either:

- an active focused plan;
- an existing plan whose verification is currently failing and therefore remains the correct owner;
- or a completed foundational plan with a specific dependent consumer plan already present.

Creating more plans would duplicate ownership.

## 6. Dependency / implementation order recommendation

Recommended order by contract dependency, not by domain:

1. **World lifecycle foundations**
   - `world-033`
   - `world-034`
   - `world-terrain-043`
   - `world-terrain-044`

2. **Immediate lifecycle/query consumers**
   - `ui-input-031`
   - repair/verify `settlements-npcs-048`
   - `items-player-057`
   - `world-terrain-045`
   - `world-terrain-046`
   - `npc-061`
   - `persistence-006`

3. **Simulation ownership parity**
   - `npc-058`
   - `settlements-npcs-052`
   - `settlements-npcs-054`
   - final combined death/cargo conservation regression pass

4. **Founded settlement runtime**
   - verify `settlements-020`
   - verify `settlements-021`
   - implement `settlements-022`

5. **Player/item state**
   - `items-player-050`
   - `items-player-056`
   - `items-player-053`

This is not a global roadmap priority ranking. It is only the safest dependency ordering for the cross-domain contracts found by this audit.

### Dependency corrections / caveats

- `items-player-057` correctly depends on `world-033`, but its livestock dependency must be considered unresolved until `settlements-npcs-048` passes the bare-id identity verification on current code.
- `ui-input-031` correctly depends on `world-033`; do not implement an independent UI generation counter.
- `npc-061` correctly depends on `world-terrain-044`.
- `world-terrain-045` correctly depends on `world-terrain-044`.
- `settlements-022` correctly depends on `settlements-021`.
- `settlements-npcs-052` and `054` have no formal dependency on each other, but both touch the death/cargo handoff seam and therefore require sequential integration plus shared regression coverage if they modify `commitNpcDeath()`.

## 7. Findings that collapse into one shared problem

The following should not be counted as independent architecture redesigns:

- area 01 F3/F5 + area 03 F03-8 + area 23 F23-2 = **one WorldBundle transaction failure class**;
- area 19 F19-2 + area 23 F23-3 = **one stale mount runtime-handle problem**;
- area 03 F03-4 + area 17 F17-1/F17-2 + area 19 F19-8 = **one durable livestock identity problem**;
- area 03 F03-2/F03-3 + area 09 founded-runtime findings = **one staged founded-settlement materialization/streaming chain**;
- area 02 F1/F2 and fauna/domestic catch-up gaps = **one global skip interval/fan-out problem**, with owner-specific mutations remaining separate;
- area 03 F03-6 + area 04 F04-1 = **one system terrain same-session rebuild-idempotency problem**;
- area 03 F03-1 + economy/work equivalents = **one transient economic cargo ownership problem**;
- area 03 F03-5 + combat transport-death finding = **one dead-carrier ghost-delivery problem**.

## 8. Risks requiring current-code re-check during implementation

These are not new plans; they are implementation preflight checks because current code or plan status can change before repair:

1. **Livestock key shape:** confirm every resolver at the persistence/runtime boundary is unambiguous; current mount resolution still accepts bare `animalId`.
2. **Rebuild publication:** re-read `createApp.ts` + `worldBundle.ts` before `world-033`; async startup/rebuild work is actively evolving.
3. **UI session inventory:** enumerate currently open world-bound surfaces immediately before `ui-input-031`; do not rely on the review's UI list if new panels were added.
4. **Death/cargo composition:** before implementing the second of 052/054, re-read `commitNpcDeath()`, post-death loot and world drop APIs so both cargo classes use one exact-once death seam.
5. **Surface/water query callers:** after `world-terrain-044`, search for direct detailed-movement `sampleHeight`/global-water consumers before closing dependent plans.
6. **Time-skip fan-out:** after `world-034`, enumerate all live `AnimalAgent` ownership collections (wild, livestock, rats, detached/player-owned) and verify exactly-once coverage.
7. **Founded runtime consumers:** after `settlements-022`, re-check economy/storage/social/debug/UI consumers that assume every loaded settlement is procedural.
8. **World pickup transaction:** `gameLoop.ts` currently still retires source ownership before exact instance admission; verify all three pickup authorities close under one atomic contract.

## 9. Verification limits

This synthesis used the completed 01–25 review artifacts and targeted current-`main` checks only for ambiguous cross-domain seams. It did not re-audit every subsystem.

No browser verification was run. No implementation was performed. `pnpm docs:sync` was not run.

## 10. Final audit status

**Area 26:** ⚠️ reviewed with unresolved high findings.

The overall audit is complete as an audit:

- areas 01–25 all have dedicated review artifacts;
- area 26 synthesizes their cross-domain seams;
- every confirmed high/critical finding has an owner and a concrete next action;
- no new unowned high/critical finding was discovered;
- several apparent independent findings collapse into shared lifecycle/identity/authority problems, reducing the risk of parallel fixes.

The remaining work is implementation and verification of the linked plans, not additional broad audit coverage.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

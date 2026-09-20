# Codebase domain audit 03 — Persistence & lifecycle continuity

**Date:** 2026-09-19  
**Area:** 03 — Persistence & lifecycle continuity  
**Baseline:** current main during review (HEAD 774930b7f8eceacd6b30deb18cddc0c9818671d3 before review docs were committed)  
**Result:** ⚠️ reviewed with unresolved high findings  
**Scope:** code correctness, architecture, lifecycle/persistence and performance only

## 1. Scope

Reviewed current save/load/rebuild continuity across world/global state, procedural and founded settlements, NPC authoritative/travel state, fauna persistence classes, domestic animals, items/world items, quests/progression, player state, transport/work commitments and terrain/world modifications.

Trace used throughout:

    authoritative mutation
    → runtime owner
    → snapshot / serialization
    → validation
    → storage
    → load
    → migration/defaulting
    → reconstruction
    → runtime rebind
    → unload/rebuild
    → next save

Missing features and Vision/roadmap differences were not treated as findings.

## 2. Entry points and state owners

### Save boundary

src/app/saveState.ts::buildSaveData() is the single app-side snapshot assembly point. SaveData is serialization, not runtime authority.

saveNow() serializes both snapshot capture and IndexedDB writes through one promise queue. buildSaveData() runs inside the queued callback, so a later queued save cannot write an older snapshot after a newer one.

### Schema / storage

src/persistence/saveData.ts owns the current schema and migrations (CURRENT_SAVE_VERSION === 49 at the reviewed baseline).

src/persistence/saveDb.ts::writeSave() validates the outgoing current-schema snapshot and refuses to overwrite an existing unreadable/unsupported slot. readSave() accepts only successfully parsed/migrated data. No generic partial-snapshot acceptance path was found.

### Reconstruction model

Restore is mostly construction:

    read/migrate SaveData
    → createApp(initialSave)
    → construct registries / WorldBundle systems with saved seeds
    → materialize transient runtime projections

Same-session reconstruction is separate: rebuildWorldBundle() snapshots selected owners, disposes the old bundle, builds a fresh bundle and seeds it with carried state. Several current defects sit at that reconstruction boundary rather than in raw serialization.

## 3. Flows traced

### World/global state

Seed/config/time and mutable world deltas serialize through SaveData. Weather/season remain derived from seed + elapsed time. Player-origin terrain modifications persist; deterministic system terrain modifications intentionally do not. Save/load is coherent here, but same-session rebuild is not yet idempotent for system modifications (F03-6).

### Settlements / founded settlements

Economies, households, structure state, relationships, livestock/rats and other mutable state live in manager-lifetime registries; loaded Settlement objects are projections.

Founded records + residency overrides also serialize and carry across rebuild. Current reconstruction still fails to consume that authority in two places: procedural resident materialization and founded-settlement streaming/runtime (F03-2/F03-3).

### NPC authoritative state and travel

NpcStateRegistry owns durable NPC health/needs/injury, personal inventory, transport cargo, merchant state and generic travel continuity. NpcStateSnapshot round-trips those values through SaveData.npcStates.

Generic travel persists destination, lastPosition, optional execution, purpose, survival checkpoint and arrival state. No new save/load loss was found in the travel record itself.

NpcAgent action phase/path/watchdog and ordinary NpcAgent.carried are runtime-only. That is valid for disposable execution detail, but not when already-conserved economic value is placed there (F03-1).

### Fauna

Persistence classes remain distinct:
- ordinary wild individuals: reconstructed, not persisted;
- managed spawner lifecycle: thin persistent state;
- persistent habitat occupants: records + tombstones;
- settlement rats: individual persistence + infestation/reconcile state;
- livestock: per-individual snapshots + namespaced tombstones.

saveState.ts writes both persistentHabitatOccupants and removedPersistentOccupantSlots; createApp.ts restores both. No current resurrection defect was found at this boundary.

### Domestic animals

LivestockRegistry correctly persists semantic identity as (settlementId, animalId), and removal tombstones use a composite namespace. Several runtime/player/merchant references collapse that identity back to bare animalId (F03-4).

### Items / world items

Player inventory, item instances, freshness-bearing inventory contents, dropped items, containers and placed world objects use owner snapshots. The older food-batch persistence gap is no longer present. No new generic item/world-item persistence defect was confirmed; remaining value loss is specifically transient NPC economic cargo (F03-1).

### Quests / progression

Quest progress, relations, reputation, badges and social state persist through their owners. Recent findings were rechecked:
- generated-opportunity retention now filters through requiresGeneratedOpportunityRetention;
- wild-animal restore invalidation now preserves durable quest metadata.

Those prior findings are resolved on current main.

### Player

Position/yaw, inventory, needs, skills/equipment-related state and mount reference persist. Player HP and physical injury do not (F03-7).

### Transport / work commitments

Work contracts and active transport commitments persist. transportCargo correctly lives on NpcAuthoritativeState. TransportOrders is now active-only and removes terminal records immediately, so the older long-session terminal-history accumulation finding is resolved.

Carrier death still does not form one atomic lifecycle transition with the active order/cargo (F03-5).

### WorldBundle rebuild

Most registry-owned state is explicitly carried into the replacement bundle. Two current hazards remain:
- bundle replacement is non-transactional around disposal/async reconstruction (F03-8);
- system terrain modifications can be carried and then applied again by fresh reconstruction (F03-6).

## 4. Findings

### F03-1 — High — source-mutating NPC economic work can put conserved goods only in transient execution state

**Flow:** source inventory/stock → claim/remove → NpcAgent.carried or action closure → later deposit → save/unload/rebuild between those steps.

**Files/symbols:** src/ai/npcProfessionWork.ts; src/ai/npcLogistics.ts; src/ai/NpcAgent.ts::carried; src/settlement/npcState.ts::NpcAuthoritativeState.

**Evidence:** current profession/local-logistics paths still include source-mutating actions whose in-transit result is held by NpcAgent.carried or closure state. carried is deliberately absent from NpcStateSnapshot and a reconstructed NpcAgent does not recover it.

**Why wrong/fragile:** after the source is irreversibly reduced, the payload is authoritative conserved value, not disposable action detail. Save/load or stream-out/rebuild can preserve the reduced source while dropping the removed goods.

**Affected consumers:** household/economy production, local transfers, profession work, settlement streaming and save/load.

**Owner domain:** settlements-npcs.

**Existing plan coverage:** settlements-npcs-052-persistent-economic-work-cargo-and-local-transfer-conservation.md.

**Recommended action:** implement 052; promote source-mutated economic cargo to a persistent semantic owner or make the source→destination mutation atomic. Do not persist arbitrary NpcAgent phase/action state.

### F03-2 — High — founded residency persists but procedural resident materialization still ignores it

**Flow:** founding → FoundedSettlementRegistry.setResidency() → SaveData.foundedSettlements → restore registry → procedural source settlement materialization.

**Files/symbols:** src/settlement/foundedSettlement.ts::FoundedSettlementRegistry; src/settlement/SettlementsManager.ts::residencySettlementId; src/settlement/createSettlement.ts resident creation path.

**Evidence:** the registry exposes persisted NpcId → founded settlementId overrides, while the current procedural resident path still materializes from procedural family/member definitions without using that override as a suppression gate.

**Why wrong/fragile:** persisted semantic residency and live runtime identity can disagree. Reloading/materializing the source settlement can recreate an NPC whose authoritative residency says it moved to a founded settlement.

**Affected consumers:** NPC identity, residents, schedules/work/dialogue and future founded runtime.

**Owner domain:** settlements.

**Existing plan coverage:** settlements-021-shared-settlement-resident-runtime.md.

**Recommended action:** implement 021 at the existing resident-materialization boundary; do not create a second NPC-state store.

### F03-3 — High — founded settlement records round-trip but are ignored by the loaded-settlement lifecycle

**Flow:** founded record/economy/households/residency → save/load or rebuild → SettlementsManager → proximity streaming → live settlement projection.

**Files/symbols:** src/settlement/SettlementsManager.ts::listFoundedSettlements, recheck, ensureLoaded; src/app/saveState.ts::buildSaveData; src/app/worldBundle.ts::rebuildWorldBundle.

**Evidence:** founded records are snapshotted and carried, but streaming/materialization remains procedural-grid driven. A valid persisted founded record/economy/households/residency can therefore have no corresponding nearby live runtime.

**Why wrong/fragile:** persisted world truth and active runtime disagree after load/rebuild.

**Affected consumers:** resident runtime, local interaction, settlement consumers, streaming and founded production/work.

**Owner domain:** settlements.

**Existing plan coverage:** settlements-022-founded-settlement-live-runtime-and-streaming.md.

**Recommended action:** implement 022 on top of 021 using the common lifecycle; do not synthesize a procedural SettlementDef as a second authority.

### F03-4 — High — persistent livestock identity is namespaced in storage but collapsed to bare animalId in runtime references

**Flow:** deterministic livestock identity → namespaced persistence (settlementId, animalId) → restore → detached/loaded registry → player mount / ownership / merchant pack lookup.

**Files/symbols:** src/settlement/livestock.ts::LivestockRegistry and removedKey(); src/settlement/SettlementsManager.ts::resolvePersistentAnimal / resolvePersistentAnimalOrigin; src/app/createApp.ts::resolveMountAnimal; src/persistence/saveData.ts::SavePlayer.mountedAnimalId; merchantJourney.packAnimalId handling.

**Evidence:** livestock persistence explicitly namespaced tombstones because bare animalId collides across settlements. The public persistent-animal resolver and persisted mount/pack references still accept/store only animalId.

**Why wrong/fragile:** two settlements can legally contain the same deterministic slot id. Persistence restores both correctly, then a bare-id rebind can select the wrong individual/origin.

**Affected consumers:** mount restore, ownership/control, death handoff, merchant pack assignment/return and recovery tooling.

**Owner domain:** settlements-npcs / fauna integration.

**Existing plan coverage:** settlements-npcs-048-merchant-pack-animal-assignment-and-journey-continuity.md.

**Recommended action:** finish/repair 048 using canonical origin+animal identity at cross-settlement boundaries. Do not weaken LivestockRegistry to bare ids.

### F03-5 — High — a dead transport carrier can retain an active order and later ghost-deliver persistent cargo

**Flow:** pickup → NpcAuthoritativeState.transportCargo + active TransportOrder → carrier death → stream-out/off-screen execution → arrival/delivery.

**Files/symbols:** src/settlement/npcPostDeath.ts::commitNpcDeath; src/ai/NpcAgent.ts::die; src/world/transportOffscreen.ts::resolveOffscreenTransportArrivals; src/settlement/SettlementsManager.ts::beginOffscreenTransportHandoff; src/world/createTransportOrders.ts::findByCarrier; src/settlement/npcState.ts::transportCargo.

**Evidence:** transportCargo correctly persists on NPC state, but alive→dead does not terminalize the active order/disposition cargo. Off-screen resolution can therefore continue from semantically dead carrier state.

**Why wrong/fragile:** persistence preserves the inconsistency: a dead actor can continue a world commitment, or cargo can remain stranded indefinitely.

**Affected consumers:** transport demand, household/settlement stock, NPC death/corpses, streaming and time skip.

**Owner domain:** settlements-npcs.

**Existing plan coverage:** settlements-npcs-054-transport-carrier-death-and-cargo-disposition.md.

**Recommended action:** implement 054 at the one-shot death edge with defensive dead-carrier guards in off-screen handoff/arrival.

### F03-6 — High — system terrain modifications are save-safe but not same-session rebuild-idempotent

**Flow:** deterministic system modification → live modifications collection → WorldBundle rebuild carry → fresh reconstruction → same modification appended/applied again.

**Files/symbols:** src/terrain/chunkManager.ts::TerrainModification; src/app/saveState.ts::buildSaveData terrain filter; src/app/worldBundle.ts::rebuildWorldBundle; cave/fauna system-modification producers traced by area 04.

**Evidence:** save serialization correctly filters source === 'player' because system changes are reconstructed. Same-session rebuild carries the live modifications collection while fresh construction reproduces system effects again.

**Why wrong/fragile:** load-from-save and in-session rebuild have different semantics; repeated rebuild can stack deterministic system effects.

**Affected consumers:** chunk materialization, cave edits, system scorch/deformation producers and ground presentation.

**Owner domain:** world-terrain.

**Existing plan coverage:** world-terrain-043-system-terrain-modification-rebuild-idempotency.md.

**Recommended action:** implement 043; carry only player-authored deltas and regenerate system modifications exactly once.

### F03-7 — Medium — Continue/Load mints player health and clears physical injury

**Flow:** player damage/injury → PlayerController.health / injury state → save snapshot → load → new PlayerController.

**Files/symbols:** src/player/PlayerController.ts constructor; src/app/saveState.ts::buildSaveData; src/persistence/saveData.ts::SavePlayer; src/app/createApp.ts player construction/restore.

**Evidence:** no player HP/injury field is serialized. Loaded PlayerController starts with full HP and physicalInjury = 0. NPC and livestock health consequences do persist.

**Why wrong/fragile:** loading is a state-changing heal rather than reconstruction and erases combat/survival consequences.

**Affected consumers:** combat, starvation/dehydration damage, medicine/treatment and HUD/character condition.

**Owner domain:** items-player.

**Existing plan coverage:** none. Completed items-player-045 explicitly allowed HP + injury to remain runtime-only and does not own this gap.

**Recommended action:** implement new items-player-050-player-health-and-injury-persistence.md; persist HP and injury together and migrate older saves to the legacy healthy default.

### F03-8 — High — WorldBundle rebuild is destructive before fresh reconstruction is committed

**Flow:** live bundle → snapshot carried state → dispose old systems → async build fresh systems → publish fresh fields.

**Files/symbols:** src/app/worldBundle.ts::rebuildWorldBundle; src/app/createApp.ts rebuild callers/closures; long-lived consumers of the mutable WorldBundle container.

**Evidence:** rebuildWorldBundle() snapshots state, disposes old world systems and then awaits fresh construction. Long-lived consumers read the same mutable bundle object; there is no transactional old→new commit boundary around the async build.

**Why wrong/fragile:** failure/cancellation or an intervening consumer can observe disposed old systems before replacement is safely committed.

**Affected consumers:** game loop, world queries, interactions, audio/world closures and systems reading bundle fields during rebuild.

**Owner domain:** world.

**Existing plan coverage:** world-033-worldbundle-rebuild-transaction-and-lifecycle-safety.md.

**Recommended action:** implement 033; make rebuild publication transactional/cancellation-safe rather than adding per-domain stale-reference workarounds.

## 5. Architecture observations

### Generic save integrity is currently strong

The reviewed generic pipeline has one snapshot boundary, current-schema validation before write, fail-closed overwrite protection, migration/parse on read, restore by construction and queued snapshot+write ordering. No new generic stale-save race, partial-write acceptance or second SaveData authority was found.

### Optional defaults are not automatically defects

Many optional sparse fields use empty/default restore values intentionally for backward compatibility. They were only treated as findings where the default changes meaningful state or reconstruction ignores persisted authority.

### Persistent habitat occupants currently preserve tombstones

The persistent-occupant exception to ordinary wild-fauna non-persistence has a coherent entries+tombstones round trip. No duplicate-materialization/resurrection finding was confirmed.

### NPC travel continuity itself persists

Generic NpcAuthoritativeState.travel survives save/load and registry carry. Remaining time-skip parity work belongs to npc-058 / area 02; this review found no new travel-persistence plan.

### Resolved cross-checks on current main

The following older findings were rechecked and are not open findings here:
- settlements-020: reconcileExistingFoundedSettlement() no longer mints a missing existing tent; it returns explicit inconsistency;
- settlements-npcs-053: TransportOrders is now an active-only Map and removes terminal records immediately;
- quests-progression-071: generated-opportunity retention excludes pristine default entries;
- quests-progression-072: quest restore invalidation preserves durable metadata.

## 6. Cross-domain dependencies / follow-ups

- Area 17 remains the detailed owner of domestic-animal/merchant-pack behavior; area 03 records the persistent identity consequence.
- Areas 11/13 own profession/logistics semantics; area 03 records why transient post-source-mutation cargo breaks continuity.
- Area 04 owns terrain mechanics; area 03 records the rebuild semantic mismatch.
- Area 19 should consume F03-7 but must not duplicate the new plan.
- Area 02 owns time-skip parity; generic travel serialization is not reopened here.
- Area 01 owns the broader WorldBundle transaction architecture represented by F03-8.

## 7. Existing plans that already cover findings

- settlements-npcs-052-persistent-economic-work-cargo-and-local-transfer-conservation.md — F03-1.
- settlements-021-shared-settlement-resident-runtime.md — F03-2.
- settlements-022-founded-settlement-live-runtime-and-streaming.md — F03-3.
- settlements-npcs-048-merchant-pack-animal-assignment-and-journey-continuity.md — F03-4.
- settlements-npcs-054-transport-carrier-death-and-cargo-disposition.md — F03-5.
- world-terrain-043-system-terrain-modification-rebuild-idempotency.md — F03-6.
- world-033-worldbundle-rebuild-transaction-and-lifecycle-safety.md — F03-8.

Resolved cross-check coverage: settlements-020, settlements-npcs-053, quests-progression-071 and quests-progression-072.

## 8. New plans required

One:

- items-player-050-player-health-and-injury-persistence.md — F03-7.

No other new plan is justified; every other confirmed open finding already has a focused owner.

## 9. Verification limits

Static code/documentation review only. No browser/gameplay verification was performed. No production finding was implemented.

## 10. Master status update

Area 03 should be marked:

**⚠️ reviewed with unresolved high/critical findings**

because F03-1 through F03-6 and F03-8 include unresolved high-severity continuity defects on current main, while F03-7 is a new medium-severity player persistence defect.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

# Implementation Notes: NPC time-skip resource and interrupt parity

Plan: `npc-058-time-skip-resource-and-interrupt-parity.md`  
Reviewed against `main`: 2026-09-20 (`a3d50e10d0b4fe07f4377f628ab19a387f354640`)

## Current code reality

The plan's defects are present on current `main`.

In `NpcAgent.resolveTimeSkip()`:

- household water is removed and thirst is relieved unconditionally;
- `waterDuty` directly adds `WATER_FETCH_AMOUNT`;
- food is relieved with no item consumption;
- wood is relieved from tree presence only;
- the final cleanup is a hand-written subset of the normal interruption lifecycle.

`catchUpCommittedTravel()` contains a second hand-written reset.

In `SettlementsManager.resolveTimeSkip()`, every loaded procedural settlement calls `stampSettlementAgriculture(..., nowDays)`, advancing household agriculture anchors without resolving the skipped interval.

## Reuse the existing interruption owner

`NpcAgent.resetInFlightAction()` is already the authoritative non-combat cleanup seam. It releases:

- the other half of an NPC conversation;
- sanitation corpse claim/hold;
- action lifecycle when requested;
- interaction queue membership;
- payment approach state;
- pending action + committed movement/route;
- path/repath/watchdog state;
- optional sleep reason;
- optional active-plan interruption.

Do not extend `finishTimeSkipMovementReset()` as another cleanup implementation. Time skip should enter through one small NPC-owned interruption method and leave final placement/phase normalization separate.

Important exception: `resetInFlightAction()` does **not** clear combat intent/weapon/attack/projectile state. Active combat must terminate through `endCombat('cancelled')` (or a tiny wrapper that delegates to it), because that is the owner of combat lifecycle cleanup.

Recommended split inside `NpcAgent`:

1. ordinary detailed action -> `resetInFlightAction({ lifecycle: 'fail', clearSleepReason: false, markPlanInterrupted: true })`;
2. combat -> `endCombat('cancelled')`;
3. committed travel -> preserve `npcState.travel` and its checkpoint execution; only clear transient live-action state that cannot survive the skip. Do not mark the travel commitment itself interrupted merely because presentation is being collapsed.

After this, `finishTimeSkipMovementReset()` should only normalize post-skip transient presentation/movement fields not already owned by the interruption seam, ideally becoming very small. Remove the duplicate reset body from `catchUpCommittedTravel()`.

Do not replace `releaseConversationIfAny()` with `clearConversationPresentation()`: the former releases the partner's reservation too.

## Resource catch-up: use transactions, not live action planners

Do not call `beginNeed()` from time-skip. It owns movement, queues and chained actions.

The useful live ownership seams are:

- food: `Household.takeFood(simTime): ItemKind | null`;
- water: `Household.water.has()` + `remove()`;
- personal food/water: existing inventory helpers if deliberately supported;
- economy / household exchange: current planners in `npcLogistics.ts` are physical action planners, not suitable as-is for coarse catch-up;
- wood harvesting: `harvestWorldTreeFully()` mutates the tree lifecycle and depends on a concrete selected tree/action completion.

Create/reuse a **small actor-neutral transaction helper** for only the mutations that can be safely resolved without movement. Keep it outside the time-skip loop logic if possible so live and skipped consumption can share the same success condition.

Two current APIs need care:

- `Household.takeFood()` already reports success via `ItemKind | null`; relief must happen only when the return value is non-null.
- `WaterReserve.remove()` returns `void` and clamps at zero. Therefore check `has(amount)` immediately before removal, or add a narrow `tryRemove(amount): boolean` primitive and migrate the live household-drink completion to it. Do not infer success from the post-remove value.

The existing live household food/water completion callbacks currently also relieve after mutation without checking success. If extracting a shared transaction helper, migrate those callbacks to it; otherwise time-skip parity would still leave a race-dependent live path with different semantics.

### Safe V1 catch-up policy

Prefer the smallest conservative policy:

- `food`: consume one real household food item (and optionally existing personal-food helper if intentionally included), then relieve; otherwise leave hunger unresolved.
- `water`: consume one real household water unit, then relieve. A renewable well may only count if a real usable source is explicitly present through existing water-source hooks; do not treat a positional fallback as proof of water.
- `waterDuty`: do not directly add reserve water during skip unless implementation can express a real source->household transaction through an existing source capability. Leaving the duty unresolved is correct.
- `wood`: do not relieve from tree presence alone. Do not call `harvestWorldTreeFully()` from coarse catch-up without a concrete ownership/reservation model. Leave unresolved unless an already-atomic non-movement transfer seam is reused.

This deliberately avoids replaying `npcLogistics.ts` planners, tree actions, queueing or pathfinding.

## Agriculture: reuse the existing aggregate, but only where it applies

The aggregate owner already exists in `src/settlement/settlementAgriculture.ts`:

- `resolveUnloadedHouseholdAgriculture()`;
- `resolveSettlementAgricultureCatchUp()`;
- household anchor `agricultureLastResolvedAtDays()` / `markAgricultureResolved()`.

For a loaded **procedural non-home** settlement, time skip should run the same bounded agriculture catch-up against the skipped interval instead of calling `stampSettlementAgriculture()`.

Do **not** blindly call `resolveSettlementAgricultureCatchUp({ isHome: true, ... })` for the home settlement: its current implementation intentionally only stamps the anchor, which would reproduce the defect. If home agriculture remains frozen during time skip, leave its anchor unchanged.

The reviewed `settlements-022` notes explicitly classify procedural agriculture as procedural-only. Founded runtimes must not be given fake families/agriculture capability just to enter this path. If 022 lands before implementation, branch on the landed runtime discriminator/capability rather than current `Settlement` shape.

Keep `stampSettlementAgriculture()` for the existing detailed->off-screen unload handoff; the bug is specifically using it as time-skip resolution.

## Time ownership

`resolveSharedInjuryRecovery(this.npcState, this.nowDays())` and committed-travel checkpointing are world-day based. Preserve them.

Be careful that `catchUpCommittedTravel()` advances `this.worldNowDays` itself. Ordinary time-skip resource transactions that need timestamps should use the correct virtual/end world day, not only `simClock`, and should not double-advance travel.

`TIME_SKIP_SAMPLE_HOURS = 0.5` can stay unchanged.

## Suggested implementation order

1. Add a focused success-returning food/water consumption helper and reuse it in live household consume completions.
2. Add one time-skip interruption wrapper around `resetInFlightAction()` / `endCombat('cancelled')`; remove both manual reset sequences.
3. Replace the free resource relief branches in `resolveTimeSkip()` with conservative atomic transactions.
4. Replace time-skip agriculture stamping with procedural non-home aggregate catch-up; preserve unload stamping.
5. Add focused tests before broader suites.

## Tests to prioritize

Prefer pure/helper tests plus narrow `NpcAgent` tests; no GLB loading.

Cover:

- household food count decreases exactly once iff hunger relief occurs;
- empty food stock leaves hunger unchanged;
- household water decreases exactly once iff thirst relief occurs;
- insufficient water cannot be clamped-to-zero and still relieve thirst;
- `waterDuty` / wood cannot mint or relieve without a real transaction;
- time-skip from queued action releases queue + conversation partner + sanitation claim and fails/cancels lifecycle once;
- time-skip from combat clears combat intent, weapon caches, attack/ranged lifecycle and projectile through combat owner;
- committed travel keeps its commitment/checkpoint semantics and advances once;
- procedural non-home agriculture resolves the skipped interval;
- home/founded agriculture does not advance an anchor when no aggregate production is performed.

Relevant existing tests: `src/settlement/settlementAgriculture.test.ts`; place transaction helper tests next to its owning module rather than building a full settlement fixture.

## Likely files

Primary:

- `src/ai/NpcAgent.ts`;
- `src/settlement/SettlementsManager.ts`;
- `src/settlement/settlementAgriculture.ts` only if a small public adapter is needed;
- `src/settlement/household.ts` only if adding a success-returning water transaction.

Tests adjacent to those modules.

No scheduler redesign, no accelerated frame replay, no new resource registry, no founded-settlement agriculture shim.

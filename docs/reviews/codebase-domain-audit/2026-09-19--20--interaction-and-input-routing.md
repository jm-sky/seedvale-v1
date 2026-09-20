# Codebase domain audit 20 — Interaction & input routing

**Date:** 2026-09-20  
**Area:** 20 — Interaction & input routing  
**Scope:** code correctness, architecture, lifecycle/persistence, performance  
**Baseline:** current `main` (`05256c4e309b2af93f66fbfa410ea76ff1238ec4` during final recon)  
**Result:** ✅ reviewed; no unresolved high/critical findings

## 1. Scope

Traced:

```text
keyboard / mouse / touch
→ edge-triggered input state
→ per-frame candidate discovery
→ spatial-context filtering
→ gaze ranking / target cycling
→ selected target
→ prompt / highlight projection
→ action dispatch
→ domain-owned validation
→ mutation
→ candidate invalidation on the next frame
→ stream-out / rebuild / stream-in
```

Covered keyboard/mouse/touch primary input, target acquisition and cycling, structured prompts, pickups, containers, wells, NPCs/NPC corpses, animals/corpses, settlement/world props, quest-backed interaction targets, inspection/targeted skills and mounted-state routing.

This review excludes missing features and subjective UX. Historical reports about corpse targeting and well cycling were treated as hypotheses and checked against current code rather than assumed to remain valid.

Primary code inspected:

- `src/input/Keyboard.ts`
- `src/input/MouseLook.ts`
- `src/input/createTouchControls.ts`
- `src/app/gameLoop.ts`
- `src/app/interactables.ts`
- `src/interaction/Interactable.ts`
- `src/interaction/findInteractionTarget.ts`
- `src/interaction/interactionView.ts`
- `src/interaction/resolveInteraction.ts`
- `src/interaction/skillAimPick.ts`
- representative domain action owners under `src/app/actions/`
- `src/player/playerCombat.ts`
- `src/fauna/AnimalAgent.ts`
- relevant existing interaction/UI/player/items/world plans and implementation notes.

## 2. Entry points and state owners

### Input

`Keyboard.ts` owns the shared `KeyState`. Keyboard `E/R/V/Tab`, pointer-locked LMB and touch chrome all write into the same edge-triggered primary/alternate/inspect/cycle fields. `gameLoop.ts` consumes those edges once per frame. Modal handling drains pending interaction edges before returning to gameplay routing, which prevents a key/click pressed for a modal from leaking into the world on the next frame.

LMB is not a second interaction path: `MouseLook.ts::onMouseDown()` writes `keys.interact`; touch `onInteract` does the same.

### Candidate ownership

`src/app/interactables.ts::buildInteractables()` is the shared per-frame adapter over domain-owned state. It does not become authoritative state itself. Candidate payloads are reconstructed from live registries/loaded entities and then decorated with `WorldSpatialContext`.

Chunk-owned trees/crops/items/landmarks use nearby queries; loaded settlement actors and several player/world registries are range-filtered while building the adapter.

### Selection

`rankInGaze()` / `pickInGaze()` own deterministic gaze ranking. Candidate-specific `interactRange` is honored by the same ranking function used for normal prompt selection, so the common selection path does not have a separate prompt-only range.

`interactableStableKey()` provides semantic identity for gaze hysteresis and is the correct primitive to preserve across per-frame candidate reconstruction.

### Projection and dispatch

The selected `target` local in `gameLoop.ts` feeds both `buildInteractionGazePrompt()` and the dispatch switch later in the same tick. There is no separate prompt target cache.

Most mutations leave the interaction layer and re-enter the owning domain by stable ID or live object. Representative player-built actions re-check registry existence/action conditions before mutation (`placementActions.ts`), and item collection tolerates an ID becoming unavailable by treating `collectItem()` failure as a no-op for that member.

### Mounting

After selection, `mount.isMounted()` forces `target = null`; mounted movement uses the dedicated dismount action instead of allowing normal world `E/R` dispatch against player-position assumptions. This is a single explicit gate, not a second interaction registry.

## 3. Flows traced

### Normal keyboard/mouse/touch interaction

```text
Keyboard E / LMB / touch E
→ KeyState.interact
→ gameLoop.consumeInteract()
→ target selected from current-frame Interactable[]
→ same target projected to FlavorInteractionPrompt
→ kind dispatch
→ domain action / resolveInteraction
→ authoritative owner mutation
→ next frame rebuild omits/changes the candidate
```

### Target acquisition and cycling

```text
buildInteractables()
→ filterInteractablesSameSpatialContext()
→ rankInGaze()
→ cycleCandidates
→ gaze pick or Tab cycle
→ target
→ prompt + dispatch
```

Actionability participates in tie-breaking, after centeredness, so overlapping actionable/non-actionable objects are not maintained in a separate priority system.

### Pickups and containers

World/spawner/dropped pickups converge on the same `item` candidate/dispatch branch. Dropped grouped members are re-collected by ID one by one; missing members are skipped. Container interaction dispatches by ID into the existing container owner rather than retaining a separate interaction-owned container state.

### Wells and buildings/world props

Settlement wells, player wells, houses, storage, notice boards, grindstone, player-built objects and other props are candidates in the same list. Player-built well/buildable actions dispatch into the owning registries/action modules, where existence and current eligibility are re-read.

### NPCs, animals and corpses

Living NPCs and NPC corpses are mutually exclusive candidate kinds based on current health/corpse state. Living animals and animal corpses similarly share one discovery path.

The historical tipped-corpse targeting problem is not present in its old form: `corpseCandidate()` uses `AnimalAgent.interactionPosition()`, which relocates the interaction point for a tipped GLB corpse. This is covered by the implemented `ui-input-020` work and an `AnimalAgent` regression test.

### Quest/world interaction targets

Quest-backed interaction remains downstream of the same selected `Interactable`. `resolveInteraction()`/QuestManager receive the selected target; there is no quest-only target acquisition registry.

Targeted skills reuse the same current target and call `queryTargetedSkillAction()` before execution; execution returns unavailable rather than blindly mutating when the selected skill action is no longer valid.

### Rebuild / stream-out / stream-in

Candidate objects themselves are ephemeral and therefore do not survive stream-out/rebuild. The long-lived `GameLoop`, however, keeps its cycling/hysteresis runtime fields across `WorldBundle` rebuild. `createApp.ts::rebuildWorld()` calls `gameLoop.forgetHighlight()` before disposing old runtime objects; the method only drops `highlightedTarget`.

That lifecycle gap is F20-1.

## 4. Findings

### F20-1 — Medium — active cycling is index-owned rather than target-identity-owned, and its runtime selection state survives world rebuild

**Flow:** target ranking → cycling → selected target → prompt/highlight → rebuild / candidate churn

**Files / symbols:**

- `src/app/gameLoop.ts::createGameLoop`
  - `cycleActive`
  - `cycleIndex`
  - `gazeStableTargetKey`
  - non-combat cycling/selection block
  - `forgetHighlight()`
- `src/interaction/interactionView.ts::interactableStableKey`
- `src/interaction/findInteractionTarget.ts::rankInGaze`
- `src/app/createApp.ts::rebuildWorld`

**Code evidence**

The current non-combat cycle state is:

```ts
let cycleActive = false
let cycleIndex = 0
```

When Tab has activated cycling, selection is reconstructed each frame as:

```ts
target = (cycleActive ? cycleCandidates[cycleIndex]! : null)
  ?? ...
```

If the candidate array still has more than one element and its composition/order changes, the old index remains valid and now denotes whichever candidate moved into that slot. The code only resets when the list becomes trivial or clamps an out-of-range index; it does not preserve the identity of the previously selected cycled target.

That matters because `cycleCandidates` is rebuilt and sorted every frame from mutable world state. Removal, pickup, death/state transition, movement, stream-in/out or actionability/centeredness changes can reorder it without another Tab press.

A stable identity primitive already exists (`interactableStableKey()`) and is already used for ordinary gaze hysteresis, but not for the active cycle commitment.

The lifecycle seam has the same defect class. `GameLoop` survives `WorldBundle` rebuild. `rebuildWorld()` calls `forgetHighlight()`, but `forgetHighlight()` does not clear `cycleActive`, `cycleIndex` or `gazeStableTargetKey`. A cycle active before rebuild can therefore bind its retained index to an unrelated candidate in the rebuilt world on the first subsequent interaction frame.

There is also a projection ownership mismatch in the same selected-target seam. `gameLoop.ts` builds a second agent-only `gazeCandidates` list and calls `pickInGaze()` again for highlight fallback:

```ts
setHighlight(interactableAgent(target) ?? gazed?.agent ?? null)
```

When Tab selects a non-agent world target (the well-among-NPCs case), the prompt/dispatch owner is the well but an NPC independently under the gaze can remain highlighted. That makes two different objects appear to own the same interaction selection.

**Why this is a real defect/risk**

- Cycling can silently retarget without a new cycle input.
- Rebuild can carry a selection commitment across disposed/replaced runtime objects.
- Visual selection can point at a different entity than the object that receives `E/R`.
- The interaction layer already has semantic stable keys, so an index is the wrong lifetime/identity representation for a committed selection.

**Affected consumers**

- all non-combat Tab-cycled interactions;
- especially crowded NPC + well/prop scenes;
- prompt/highlight projection;
- world rebuild/new-game/config rebuild continuity.

**Owner domain:** `ui-input`

**Existing plan coverage**

`ui-input-015` established stable keys/hysteresis and `ui-input-020` fixed the historical well/corpse targeting regressions, but current code still stores active cycling by index and neither current plan owns rebuild reset of the cycle commitment.

**Recommended action**

Create `ui-input-028-interaction-target-identity-and-cycle-lifecycle.md`.

Use `interactableStableKey()` (or an equivalent semantic key) as the cycle commitment, re-resolve it against the current ranked set, clear it deterministically when the target disappears, reset interaction selection state on rebuild, and make highlight projection derive from the selected target rather than a second target pick.

---

### F20-2 — Low — a lit village torch projects an enabled primary interaction that dispatch intentionally ignores

**Flow:** candidate → prompt projection/actionability → primary input → dispatch

**Files / symbols:**

- `src/app/interactables.ts::buildInteractables` — `villageTorch` candidate
- `src/interaction/interactionView.ts::buildInteractionView` / legacy prompt parsing
- `src/app/gameLoop.ts` — `target.kind === 'villageTorch'` dispatch

**Code evidence**

A settlement village torch emits:

```ts
promptLabel: lit ? 'Pochodnia (płonie)' : '[E] Zapal pochodnię'
```

`interactionView.ts` has no `villageTorch` state-specific action builder. The plain lit label therefore falls through legacy prompt parsing and is treated as a normal enabled primary action rather than status-only text.

Dispatch has the real state gate:

```ts
if (interactPressed && !target.lit) {
  igniteVillageTorch?.(target.settlementId, target.torchId)
}
```

So the structured prompt/actionability layer can advertise/select a primary action for the lit state while the action dispatcher correctly performs no mutation.

**Why this is a real defect/risk**

This is not subjective wording: projection and execution disagree about whether a primary action exists. It also affects `isInteractableActionable()`, which participates in target tie-breaking.

**Affected consumers**

- structured desktop/touch interaction prompt;
- actionability ranking when a lit village torch overlaps another candidate;
- primary-input dispatch on the lit torch.

**Owner domain:** `ui-input`

**Existing plan coverage**

No current planned interaction/UI item covers this remaining village-torch state mismatch. The completed interaction-view foundation is the mechanism to extend, not a plan that still owns the defect.

**Recommended action**

Create `ui-input-029-village-torch-interaction-action-contract.md`: derive the action from `target.lit` in the structured interaction view and add focused projection/actionability tests. Do not add another prompt/dispatch mechanism.

---

### F20-3 — Medium — dropped-item candidate construction still performs unbounded quadratic work in the per-frame interaction path

**Flow:** candidate discovery → grouping/ranking → per-frame allocations

**Files / symbols:**

- `src/app/gameLoop.ts` → `buildInteractables()`
- `src/app/interactables.ts::groupDroppedItemCandidates`
- dropped-item `nodes()` consumers in `buildInteractables()`

**Code evidence**

The current candidate builder still groups the entire dropped-item registry every frame with all-pairs comparisons and repeated group reconstruction scans, then performs repeated registry lookups while materializing grouped candidates.

This is exactly the algorithmic finding already documented by area 24.

**Why this is a real defect/risk**

Dropped items are player-created and not naturally bounded by interaction radius, while this work sits on the normal frame path.

**Affected consumers**

- interaction candidate construction;
- frame CPU/GC under cluttered or long-running dropped-item populations.

**Owner domain:** `ui-input` with `items-player` registry input

**Existing plan coverage**

Already covered by `ui-input-027-interaction-candidate-dropped-item-scaling.md`. No duplicate plan created.

**Recommended action**

Implement `ui-input-027` as written: narrow to nearby dropped records before grouping, avoid global O(D²) work/repeated scans and preserve existing stable target identity semantics.

## 5. Architecture observations

Positive boundaries to preserve:

- Keyboard, LMB and touch converge on the same `KeyState` interaction edges.
- Modals drain world interaction edges rather than maintaining a separate input queue.
- `Interactable[]` is an ephemeral adapter over domain state, not a second authoritative registry.
- Spatial-context filtering occurs before target selection, preventing surface/cave cross-targeting.
- Prompt generation and action dispatch use the same selected `target` in the same frame.
- Candidate-specific interaction ranges are enforced by the shared ranking path.
- Mounted state has one explicit world-interaction gate.
- Player-built object actions generally re-read authoritative registry state before mutation.
- Pickups handle already-missing member IDs fail-closed.
- Quest interactions reuse the same target pipeline rather than creating quest-only targeting.
- The old corpse hit-point problem is addressed with `AnimalAgent.interactionPosition()`.
- The old well-cycling case has shared Tab cycling; there is no special well target registry.

Performance observations not promoted to additional findings:

- `buildInteractables()`, `finalizeInteractables()`, spatial filtering and gaze ranking allocate fresh arrays/objects every interaction frame.
- Several small registries are scanned then distance-filtered in the adapter, while chunk-owned content already exposes nearby queries.
- `rankInGaze()` sorts the current candidate set and the current highlight fallback performs a second agent-only pick.

Those are recurring costs, but current evidence does not establish a separate material performance defect beyond F20-3. F20-1's selected-target highlight correction can also remove the redundant semantic target pick without inventing a generic interaction manager or worker.

## 6. Cross-domain dependencies / follow-ups

- Area 18 remains the owner for item/container identity and persistence beyond the routing boundary. This audit verified only how interaction discovers and dispatches them.
- Area 19 remains the owner for mount/player lifecycle; this audit verified only the mounted interaction gate.
- Area 23 should review Vue/DOM callback lifetime and projection synchronization more broadly. F20-1 is recorded here because the mismatch is created by interaction target ownership itself.
- Area 24 already owns the measured/algorithmic recurring-work perspective and created `ui-input-027`.
- `world-033-worldbundle-rebuild-transaction-and-lifecycle-safety.md` owns the broader rebuild transaction. F20-1 should use that lifecycle seam but must not duplicate WorldBundle ownership work.

## 7. Existing plans that already cover findings

Checked against current plans before adding work:

- `ui-input-015-interaction-targeting-and-action-semantics.md` — implemented shared `Interactable`, stable keys, deterministic gaze ranking and structured interaction view; foundations to reuse.
- `ui-input-020-world-interaction-targeting-and-acquisition-feedback-regressions.md` — implementation present; historical corpse interaction point and well/non-combat cycling issues are not re-opened as duplicate findings.
- `ui-input-027-interaction-candidate-dropped-item-scaling.md` — directly covers F20-3.
- `items-player-021-player-skills-and-targeted-skill-actions-foundation.md` — targeted skills reuse the interaction target seam.
- `world-027-player-spatial-context-and-cross-space-target-isolation.md` — current candidate spatial-context filtering is present.
- `world-033-worldbundle-rebuild-transaction-and-lifecycle-safety.md` — broader rebuild ownership; does not specifically own active interaction-cycle identity.

No active plan found that closes F20-1 or F20-2.

## 8. New plans required

1. `ui-input-028-interaction-target-identity-and-cycle-lifecycle.md` — F20-1.
2. `ui-input-029-village-torch-interaction-action-contract.md` — F20-2.

No new plan for F20-3; reuse `ui-input-027`.

## 9. Verification limits

Review only. No production gameplay code was changed.

Static source/control-flow review and existing unit-test/implementation-note evidence were used. No browser verification was run and no new performance benchmark was run.

The known corpse/well reports are marked resolved only at the code-contract level described above; this audit does not claim manual browser verification.

## 10. Master status update

Area 20 should be marked:

**✅ reviewed**

There are two unresolved bounded correctness/architecture findings (medium + low), one medium performance finding already covered by an existing plan, and no confirmed high/critical finding.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

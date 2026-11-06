# Symbols

Generated from exported TypeScript symbols.

## `simulation/actionControl.ts`

- `abortActionLifecycle` — function — line 27
- `adoptPlannedAction` — function — line 35
- `finishActionLifecycle` — function — line 22
- `replaceActionLifecycle` — function — line 16

## `simulation/actionLifecycle.ts`

- `cancelActionLifecycle` — function — line 47
- `completeActionLifecycle` — function — line 33
- `createActionLifecycle` — function — line 9
- `failActionLifecycle` — function — line 40
- `isActionActive` — function — line 17
- `isActionTerminal` — function — line 13
- `resetActionLifecycle` — function — line 54
- `startActionLifecycle` — function — line 26

## `simulation/interactionQueue.ts`

- `createInteractionQueue` — function — line 80
- `householdWellQueueId` — function — line 158
- `InteractionQueue` — type — line 28
- `InteractionQueueConfig` — type — line 10
- `pastureWellQueueId` — function — line 163
- `settlementWellQueueId` — function — line 168
- `wellQueueId` — function — line 153

## `simulation/observation.ts`

- `assessHealthRatio` — function — line 100
- `assessStaminaRatio` — function — line 125
- `DEFAULT_PLAYER_OBSERVATION` — const — line 35
- `formatPhysicalAssessment` — function — line 148
- `formatPhysicalAssessmentFromQualitative` — function — line 118
- `NEUTRAL_PERCEPTION` — const — line 31
- `NPC_BROAD_IDENTITY_LABEL` — const — line 33
- `ObservationInput` — type — line 13
- `ObservationLevel` — type — line 11
  - domain: npc
  - system: observation
  - role: Pure observation-level resolution from observer Perception and distance. Intended for presentation now and simulation consumers later — no DOM/UI dependency.
- `observationRangeScale` — function — line 62
- `PlayerObservationInput` — type — line 18
- `QualitativeHealth` — type — line 54
- `qualitativeHealthFromInjurySeverity` — function — line 109
- `qualitativeHealthLabel` — function — line 131
- `QualitativeStamina` — type — line 55
- `qualitativeStaminaLabel` — function — line 140
- `resolveObservationLevel` — function — line 67
- `resolveStableObservationLevel` — function — line 93
- `stabilizeObservationLevel` — function — line 77

## `simulation/observationSpatial.ts`

- `isActorInfoSpatiallyVisible` — function — line 36
- `PlayerLabelSpatialView` — type — line 18

## `simulation/scoreActions.ts`

- `pickActionKind` — function — line 27
- `pickHighestScore` — function — line 14
- `plannedFromKind` — function — line 35
- `ScoredAction` — type — line 7

## `simulation/types.ts`

- `ActionLifecycle` — type — line 106
- `ActionLifecycleStatus` — type — line 99
- `copyVec3` — function — line 26
- `DecisionContext` — type — line 64
- `DecisionPressure` — type — line 47
- `PlannedAction` — type — line 90
- `SimulationEntityRef` — type — line 34
- `vec3` — function — line 21
- `Vec3` — type — line 15
  - domain: shared
  - system: simulation-contracts
  - role: Domain-agnostic shapes (`PlannedAction`, `DecisionContext`, `ActionLifecycle`) shared by NPC and fauna decision/action code.
  - uses: (none — deliberately Three.js- and domain-free)

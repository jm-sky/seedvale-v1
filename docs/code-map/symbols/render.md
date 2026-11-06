# Symbols

Generated from exported TypeScript symbols.

## `render/actorCullBounds.ts`

- `ActorCullBoundsResult` — type — line 4
- `installActorCullBounds` — function — line 70
  - domain: world-terrain

## `render/actorSightConcealment.ts`

- `setActorSightConcealed` — function — line 15
  - domain: world
  - system: sight
  - role: World-042 Stage 1 — conceal/reveal an actor's whole presentation subtree (incl. CSS2D labels) by render layer. Never touches `.visible`, so it cannot fight `hideLivingVisual()` / corpse lifecycle. Main and shadow cameras do not enable `SIGHT_CONCEALED_LAYER`: concealed actors neither render nor cast shadows.

## `render/actorSightSamples.ts`

- `ActorSightShape` — type — line 8
  - domain: world
  - system: sight
  - role: World-042 Stage 1 — writes semantic sight-target sample points for an actor (body/head/limbs) into a caller-owned buffer. Pure, allocation-free.
- `writeActorSightSamples` — function — line 16

## `render/actorSkeletonSharing.ts`

- `ActorSkeletonShareResult` — type — line 14
- `shareActorSkeletons` — function — line 180
  - domain: render

## `render/agentPresentationLod.ts`

- `AGENT_PRESENTATION_MID_DISTANCE_M` — const — line 41
- `AGENT_PRESENTATION_NEAR_DISTANCE_M` — const — line 34
- `AgentPresentationLevel` — type — line 23
  - domain: world-terrain
- `AgentPresentationLodInput` — type — line 25
- `resolveAgentPresentationLevel` — function — line 48

## `render/agentPresentationVisibility.ts`

- `AgentPresentationVisibility` — type — line 16
  - domain: world-terrain
- `createAgentPresentationVisibility` — function — line 25

## `render/aoBudget.ts`

- `AO_MIN_STABLE_MS` — const — line 16
- `AO_RESTORE_MS` — const — line 7
- `AO_SUPPRESS_MS` — const — line 6
- `shouldSuppressAo` — function — line 18

## `render/createPostProcessing.ts`

- `createPostProcessing` — function — line 62
- `PostPassId` — type — line 16
- `PostProcessing` — type — line 18

## `render/createRenderer.ts`

- `createRenderer` — function — line 6

## `render/frameSceneMatrices.ts`

- `beginFrameSceneMatrices` — function — line 21
- `endFrameSceneMatrices` — function — line 27

## `render/godRaysShader.ts`

- `GodRaysShader` — const — line 19

## `render/gradedOutputPass.ts`

- `createGradedOutputPass` — function — line 101

## `render/instancedProps.ts`

- `buildInstancedProps` — function — line 133
- `InstancedPropGroup` — type — line 30
- `PropPlacement` — type — line 15
- `PropPrimitive` — type — line 7

## `render/lastKnownBillboards.ts`

- `createLastKnownBillboards` — function — line 95
- `LastKnownBillboards` — type — line 21
  - domain: world
  - system: sight
  - role: World-042 Stage 1 — pooled grey-silhouette sprites marking where the player last saw a now-concealed actor. Presentation only; reads the contact list from `playerSightContacts`.

## `render/programPrewarm.ts`

- `buildProgramPrewarmStaging` — function — line 151
- `disposeProgramPrewarmStaging` — function — line 196
- `prewarmRenderPrograms` — function — line 239
- `ProgramPrewarmResult` — type — line 50
- `ProgramPrewarmStaging` — type — line 64

## `render/rendererResize.ts`

- `MIN_RENDERER_SIZE` — const — line 4
- `shouldApplyRendererResize` — function — line 9

## `render/shadowBudget.ts`

- `anyWithinRadius` — function — line 148
- `createShadowBudgetState` — function — line 55
- `decideShadowUpdate` — function — line 73
- `recordShadowBudgetFrame` — function — line 123
- `SHADOW_DIRTY_MAX_STALE_FRAMES` — const — line 27
- `SHADOW_DIRTY_PLAYER_EPS_M` — const — line 22
- `SHADOW_MOTION_D_HARD_M` — const — line 32
- `SHADOW_MOTION_MS_MAX` — const — line 34
- `SHADOW_MOTION_YAW_HARD_RAD` — const — line 33
- `ShadowBudgetState` — type — line 44
- `ShadowMotionCadenceInput` — type — line 37
- `ShadowUpdateReason` — type — line 66
- `shouldUpdateShadowMap` — function — line 110

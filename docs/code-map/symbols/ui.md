# Symbols

Generated from exported TypeScript symbols.

## `ui/agentStatusLabel.ts`

- `AgentLabelDom` — type — line 55
- `AgentLabelIconSlot` — type — line 29
- `AgentLabelNamePresentation` — type — line 32
- `AgentLabelObservationPresentation` — type — line 152
- `AgentStatusLabelController` — type — line 205
  - domain: ui-input
- `applyBarPercent` — function — line 136
- `computeBarPercent` — function — line 127
- `createAgentLabel` — function — line 73
  - domain: ui-input
- `createAgentStatusLabelController` — function — line 253
  - domain: ui-input
- `createLabelBar` — function — line 45
- `INITIAL_LABEL_DISTANCE_STATE` — const — line 171
- `LabelBarKind` — type — line 26
  - domain: ui-input
- `LabelDistanceState` — type — line 144
- `updateAgentLabelDistanceState` — function — line 586

## `ui/createBusyOverlay.ts`

- `BusyOverlay` — type — line 3
- `createBusyOverlay` — function — line 11

## `ui/createDebugGui.ts`

- `createDebugGui` — function — line 64
- `DebugGuiHandle` — type — line 51
- `DebugGuiHandlers` — type — line 21

## `ui/createHud.ts`

- `createHud` — function — line 61
- `Hud` — type — line 5

## `ui/createInventoryScreen.ts`

- `createInventoryScreen` — function — line 66
- `InventoryScreen` — type — line 43
- `InventoryScreenHandlers` — type — line 10

## `ui/createLoadingScreen.ts`

- `createLoadingScreen` — function — line 32
- `LoadingScreen` — type — line 20
- `StartupLoadingStage` — type — line 1

## `ui/createMinimap.ts`

- `createMinimap` — function — line 19
- `Minimap` — type — line 10

## `ui/createNpcDialog.ts`

- `createNpcDialog` — function — line 18
- `NpcDialog` — type — line 5
- `NpcDialogHandlers` — type — line 3
- `NpcDialogOffer` — type — line 4

## `ui/createNpcInspector.ts`

- `createNpcInspector` — function — line 306
- `NpcInspector` — type — line 20

## `ui/createPauseMenu.ts`

- `createPauseMenu` — function — line 48
- `PauseMenu` — type — line 46
- `PauseMenuHandlers` — type — line 6

## `ui/createQuestLog.ts`

- `createQuestLog` — function — line 15
- `QuestLog` — type — line 5
- `QuestLogHandlers` — type — line 4

## `ui/createQuickActions.ts`

- `createQuickActions` — function — line 159
- `QuickActions` — type — line 150
- `QuickActionsCropSeeds` — type — line 13
- `QuickActionsHandlers` — type — line 29
- `QuickActionsTraps` — type — line 9
- `QuickActionsWorkContract` — type — line 18
- `RestOutcome` — type — line 27
- `RestVariant` — type — line 20

## `ui/createStartScreen.ts`

- `createStartScreen` — function — line 28
- `StartScreen` — type — line 11
- `StartScreenChoice` — type — line 5

## `ui/createTimeSkipOverlay.ts`

- `createTimeSkipOverlay` — function — line 13
- `TimeSkipOverlay` — type — line 3

## `ui/createToast.ts`

- `createToast` — function — line 14
- `Toast` — type — line 5
- `ToastVariant` — type — line 3

## `ui/labelDistance.ts`

- `barsVisibleForDistance` — function — line 22
- `gazeOpacityFactor` — function — line 41
- `labelOpacityForDistance` — function — line 10

## `ui/lucideDomIcon.ts`

- `createLucideDomIcon` — function — line 19
  - domain: ui-input
- `LucideIconNode` — type — line 8
  - domain: ui-input

## `ui/npcLabelIconPresentation.ts`

- `activityIconPresentation` — function — line 131
  - domain: ui-input
- `ActivityIconSource` — type — line 18
- `AgentLabelIconKind` — type — line 28
  - domain: ui-input
- `AgentLabelIconPresentation` — type — line 46
- `iconNodeForKind` — function — line 82
  - domain: ui-input
- `questMarkerIconPresentation` — function — line 96
  - domain: ui-input
- `shopIconPresentation` — function — line 106
  - domain: ui-input

## `ui/startScreenFlow.ts`

- `BootSaveListing` — type — line 16
  - domain: ui-input
  - system: start-screen
  - role: Pure boot-loop decisions for the Start Screen (plan ui-input-011 §1/§2/§9). `main.ts` keeps every side effect — IndexedDB reads/deletes, seed resolution, `createApp()` — this module only says *whether* the screen stays open and, if not, which world to build.
- `resolveStartScreenAction` — function — line 55
  - domain: ui-input
- `shouldOpenStartScreen` — function — line 28
- `StartScreenAction` — type — line 34

# Symbols

Generated from exported TypeScript symbols.

## `perf/active.ts`

- `getMonitor` — function — line 12
- `setActiveMonitor` — function — line 8

## `perf/agentCpuDiag.ts`

- `AgentCpuDiag` — type — line 262
- `AgentCpuDiagTotals` — type — line 33
- `AgentCpuReport` — type — line 151
- `buildAgentCpuReport` — function — line 839
- `createAgentCpuDiag` — function — line 420
- `emptyAgentCpuDiagTotals` — function — line 337
- `formatAgentCpuReport` — function — line 1000
- `getAgentCpuDiag` — function — line 835
- `setActiveAgentCpuDiag` — function — line 831

## `perf/artifacts.ts`

- `assertArtifactRoundTrip` — function — line 62
- `buildArtifactBundle` — function — line 32
- `PerfArtifactBundle` — type — line 25
- `PerfArtifactMeta` — type — line 10

## `perf/benchmark.ts`

- `BenchmarkHost` — type — line 82
- `BenchmarkRunner` — type — line 66
- `BenchmarkRunOptions` — type — line 57
- `createBenchmarkRunner` — function — line 203

## `perf/benchmarkFixture.ts`

- `BENCHMARK_FIXTURE` — const — line 25
- `BenchmarkFixture` — type — line 14

## `perf/benchmarkScenarios.ts`

- `BENCHMARK_SCENARIO_IDS` — const — line 1
- `BenchmarkScenarioId` — type — line 12

## `perf/buildInfo.ts`

- `createRunId` — function — line 24
- `getBuildGitSha` — function — line 6

## `perf/detector.ts`

- `detectFrame` — function — line 76
- `DetectFrameInput` — type — line 15
- `primaryCategory` — function — line 97
- `rankSuspects` — function — line 45

## `perf/deviceMeta.ts`

- `buildGpuTimerStatus` — function — line 42
- `captureDeviceMeta` — function — line 6
- `drawingBufferSize` — function — line 90

## `perf/flags.ts`

- `benchmarkScenarioFromUrl` — function — line 78
- `DEFAULT_POINT_LIGHT_BUDGET` — const — line 40
- `isPerfUrlEnabled` — function — line 21
- `isProgramCensusUrlEnabled` — function — line 31
- `parseBenchmarkScenarioId` — function — line 71
- `parsePointLightBudgetFlag` — function — line 52
- `pointLightBudgetFromUrl` — function — line 65

## `perf/gpuTimer.ts`

- `createGpuTimer` — function — line 70
- `getGpuTimer` — function — line 174
- `GpuTimer` — type — line 20
- `GpuTimerProvenance` — type — line 11
- `setActiveGpuTimer` — function — line 170

## `perf/grassBaseline.ts`

- `createGrassBaselineDiag` — function — line 98
- `formatGrassBaselineReport` — function — line 246
- `getGrassBaselineDiag` — function — line 238
- `GrassBaselineDiag` — type — line 68
- `GrassBaselineLifecycle` — type — line 11
  - domain: world-terrain
- `GrassBaselineSnapshot` — type — line 22
- `setActiveGrassBaselineDiag` — function — line 234

## `perf/grassFinalizationDiag.ts`

- `buildGrassFinalizationReport` — function — line 335
- `createGrassFinalizationDiag` — function — line 217
- `formatGrassFinalizationReport` — function — line 401
- `getGrassFinalizationDiag` — function — line 325
- `GrassBucketStageSample` — type — line 114
- `GrassBuildSample` — type — line 123
- `GrassFinalizationDiag` — type — line 138
- `GrassFinalizationDiagTotals` — type — line 35
- `GrassFinalizationReport` — type — line 68
- `GrassFinalizationStageStats` — type — line 19
- `GrassSpeciesFinalizationStats` — type — line 25
- `readJsHeapUsedBytes` — function — line 329
- `setActiveGrassFinalizationDiag` — function — line 321

## `perf/heavySettlementScenario.ts`

- `HEAVY_SETTLEMENT_SEARCH_RADIUS` — const — line 16
  - domain: tools
- `HeavySettlementPeek` — type — line 32
- `HeavySettlementSelectFail` — type — line 29
- `HeavySettlementSelectOk` — type — line 28
- `HeavySettlementSelectResult` — type — line 30
- `scenarioSettlementFromDef` — function — line 105
- `selectHeavySettlement` — function — line 51
  - domain: tools
- `settlementResidentCount` — function — line 35

## `perf/isolationProbe.ts`

- `formatIsolationReport` — function — line 232
- `IsolationHost` — type — line 31
- `runIsolationProbes` — function — line 122

## `perf/log.ts`

- `createPerfLog` — function — line 29
- `PerfLog` — type — line 7

## `perf/longFrameFormat.ts`

- `formatLongFrameAttribution` — function — line 42
- `formatLongFrameRecord` — function — line 13

## `perf/monitor.ts`

- `createPerfMonitor` — function — line 184
- `emptySessionTotals` — function — line 84
- `FrameEndInput` — type — line 35
- `PerfMonitor` — type — line 88
- `SessionTotals` — type — line 53
- `withCategory` — function — line 520
- `withStage` — function — line 534

## `perf/passSubmissionCollector.ts`

- `createPassSubmissionCollector` — function — line 247
- `emptyPassSubmissionReport` — function — line 538
- `formatPassSubmissionReport` — function — line 505
- `getPassSubmissionCollector` — function — line 501
- `PassAggregate` — type — line 54
- `PassFrameStats` — type — line 43
- `PassKind` — type — line 30
  - domain: world-terrain
- `PassSubmissionCollector` — type — line 93
- `PassSubmissionReliability` — type — line 67
- `PassSubmissionReport` — type — line 69
- `setActivePassSubmissionCollector` — function — line 497
- `SubmissionBucketKey` — type — line 32
- `SubmissionBucketStats` — type — line 38

## `perf/percentile.ts`

- `copyAndSort` — function — line 16
- `percentile` — function — line 3

## `perf/programCensus.ts`

- `createProgramCensus` — function — line 372
- `formatProgramAttributionReport` — function — line 667
- `formatProgramCensusReport` — function — line 598
- `formatProgramCompileCostReport` — function — line 844
- `getProgramCensus` — function — line 904
- `ProgramCensus` — type — line 174
- `ProgramCensusAttachEvent` — type — line 16
- `ProgramCensusAttachKind` — type — line 13
- `ProgramCensusEvent` — type — line 130
- `ProgramCensusFamilyBreakdown` — type — line 137
- `ProgramCensusFirstUseEvent` — type — line 39
- `ProgramCensusFrameSnapshot` — type — line 112
- `ProgramCensusMaterialSnapshot` — type — line 120
- `ProgramCensusStageEvent` — type — line 29
- `ProgramCensusStageKind` — type — line 14
- `ProgramCensusSummary` — type — line 146
- `setActiveProgramCensus` — function — line 900
- `withProgramCensusStage` — function — line 885

## `perf/rawSidecar.ts`

- `buildRawSidecar` — function — line 34
- `PerfRawSidecar` — type — line 22
- `RAW_SIDECAR_FULL_LIMIT` — const — line 4
- `RawFrameSample` — type — line 13
- `RawSidecarSampling` — type — line 6

## `perf/report.ts`

- `buildReport` — function — line 21
- `formatReport` — function — line 170

## `perf/sceneCensus.ts`

- `AgentBucket` — type — line 354
- `AgentDetailCensus` — type — line 386
- `AgentDetailMeshStats` — type — line 356
- `AgentDistanceBandDetail` — type — line 375
- `AgentFamilyDetail` — type — line 367
- `BucketStats` — type — line 25
- `censusAgentDetail` — function — line 425
- `censusScene` — function — line 266
- `censusSettlementShadowCasters` — function — line 302
  - domain: world-terrain
- `censusShadowCasters` — function — line 284
  - domain: world-terrain
- `censusTotals` — function — line 314
- `classifyObject` — function — line 191
- `classifySettlementContent` — function — line 179
  - domain: world-terrain
- `emptyCensus` — function — line 83
- `emptySettlementShadowCensus` — function — line 89
- `hideBuckets` — function — line 328
- `restoreVisibility` — function — line 341
- `SCENE_BUCKETS` — const — line 10
- `SceneBucket` — type — line 23
- `SceneCensus` — type — line 33
- `SETTLEMENT_CONTENT_KINDS` — const — line 37
- `SETTLEMENT_SHADOW_KIND_USERDATA` — const — line 75
- `SettlementContentKind` — type — line 70
- `SettlementShadowCensus` — type — line 72
- `VisibilityRestore` — type — line 77

## `perf/timeDistribution.ts`

- `timeDistribution` — function — line 13
- `TimeDistribution` — type — line 5

## `perf/types.ts`

- `BenchmarkPhase` — type — line 121
- `BudgetKind` — type — line 287
- `CameraControlResult` — type — line 145
- `CameraPose` — type — line 123
- `DeviceMeta` — type — line 167
- `GpuTimerStatus` — type — line 152
- `HitchEvent` — type — line 61
- `HitchReportRow` — type — line 232
- `IsolationProbeRow` — type — line 240
- `LONG_FRAME_MS` — const — line 73
- `LongFrameAttribution` — type — line 91
- `LongFrameRecord` — type — line 81
- `LongFrameStage` — type — line 75
- `PERF_CATEGORIES` — const — line 13
- `PERF_CATEGORY_COUNT` — const — line 30
- `PERF_CATEGORY_INDEX` — const — line 32
- `PERF_SEVERITY_RANK` — const — line 49
- `PerfAttribution` — type — line 317
- `PerfCategory` — type — line 28
- `PerfContext` — type — line 184
- `PerfDetection` — type — line 295
- `PerfFilter` — type — line 56
- `PerfLiveStats` — type — line 266
- `PerfLogEvent` — type — line 304
- `PerfReportJson` — type — line 323
- `PerfSeverity` — type — line 47
- `PerfSuspect` — type — line 289
- `PopulationGateResult` — type — line 136
- `PopulationSnapshot` — type — line 128
- `ScenarioAnchor` — type — line 97
- `ScenarioRoute` — type — line 99
- `ScenarioSettlement` — type — line 108

# Symbols

Generated from exported TypeScript symbols.

## `terrain/abandonedMineDeposits.ts`

- `AbandonedMineDepositInput` — type — line 76
- `allocateIntegerReserves` — function — line 138
  - domain: world
- `generateAbandonedMineGoldDeposits` — function — line 339
  - domain: world
- `MINE_GOLD_SLOTS` — const — line 20
- `mineEconomicSourceId` — function — line 117
- `mineGoldDepositId` — function — line 110
- `MineGoldSlot` — type — line 28
- `pickMineGoldTotalReserve` — function — line 126
  - domain: world

## `terrain/biomeColors.ts`

- `applyMicroTint` — function — line 275
- `applyMountainRock` — function — line 202
- `applyOceanDepthTint` — function — line 225
- `applyRoadTint` — function — line 246
- `applySlopeRock` — function — line 168
- `colorForTerrain` — function — line 128
- `landBlendForSandBand` — function — line 54
- `ROCK_SLOPE_FULL` — const — line 62
- `ROCK_SLOPE_START` — const — line 61
- `SAND_BAND` — const — line 22
- `SAND_BAND_MAX` — const — line 20
- `SAND_BAND_MIN` — const — line 18
- `sandBandAt` — function — line 47
- `terrainTintNoise` — function — line 269

## `terrain/biomeRegions.ts`

- `BiomeWeights` — type — line 4
- `biomeWeightsAt` — function — line 28
- `ForestBiome` — type — line 139
- `forestBiomeAt` — function — line 157
- `forestDensityAt` — function — line 102

## `terrain/bloodOverlay.ts`

- `BloodOverlayPlacement` — type — line 31
- `BloodOverlaySystem` — type — line 41
- `createBloodOverlaySystem` — function — line 156

## `terrain/buildChunkGeometry.ts`

- `buildChunkGeometry` — function — line 420
- `ChunkMeshResult` — type — line 18
- `createTerrainMaterial` — function — line 56
- `TERRAIN_DIRT_DIFFUSE_TUNING` — const — line 47
- `TerrainWeatherUniforms` — type — line 41

## `terrain/cemeteryAssignment.ts`

- `ABANDONED_SETTLEMENT_MIN_DISTANCE` — const — line 55
- `activeTopologyNear` — function — line 198
- `assignmentVariationSeed` — function — line 178
- `CEMETERY_SETTLEMENT_GATHER_RADIUS` — const — line 53
- `CemeteryAssignment` — type — line 40
- `cemeteryAssignmentFromTopology` — function — line 168
- `cemeteryAssignmentId` — function — line 110
- `CemeteryAssignmentIntent` — type — line 30
- `cemeteryIdForAbandoned` — function — line 121
- `cemeteryIdForAssignment` — function — line 115
- `CemeterySettlementRef` — type — line 16
- `CemeteryTopologyIntent` — type — line 33
- `clearCemeteryCaches` — function — line 60
- `collectSettlementRefsNear` — function — line 79
- `dedicatedCemeteryTopology` — function — line 136
- `isAbandonedCemeteryId` — function — line 131
- `isLegacyCemeteryId` — function — line 126
- `makeSettlementRefPeek` — function — line 47
- `PeekSettlementDef` — type — line 44
- `PeekSettlementRef` — type — line 45
- `resolveCemeteryTopologyForSettlement` — function — line 150
  - domain: world-terrain
- `servedSettlementIdsForCemeteryId` — function — line 186
  - domain: world-terrain
- `settlementRefFromDef` — function — line 70

## `terrain/cemeteryPlacement.ts`

- `ABANDONED_CEMETERY_CHANCE` — const — line 49
- `abandonedCemeteryMaxOffsetFromCenter` — function — line 58
  - domain: world-terrain
- `chunkPassesAbandonedCemeteryRoll` — function — line 75
  - domain: world-terrain
- `clearCemeteryPlacementCaches` — function — line 308
- `getCachedPlacementForAssignment` — function — line 342
- `placementOwnerChunk` — function — line 432
- `resolveAbandonedCemeteryAfterRoll` — function — line 379
  - domain: world-terrain
- `resolveAbandonedCemeteryForChunk` — function — line 389
- `resolveCemeteriesForChunk` — function — line 454
  - domain: world-terrain
- `resolveCemeteryPlacement` — function — line 478
- `ResolvedCemeteryPlacement` — type — line 79
- `resolvedPlacementToEnvironment` — function — line 349
- `resolvePlacementForTopology` — function — line 324
  - domain: world-terrain
- `validateCemeteryPhysical` — function — line 162

## `terrain/chunkCrops.ts`

- `computeChunkCrops` — function — line 38

## `terrain/chunkEnvironment.ts`

- `CEMETERY_INNER_FRAC` — const — line 138
- `CEMETERY_OUTER_FRAC` — const — line 139
- `cemeteryFitsVillageFringe` — function — line 224
- `cemeteryFootprintClearsRoads` — function — line 275
- `CemeteryTerrainSampler` — type — line 415
- `clearCemeteryPlots` — function — line 390
- `clearVegetationAroundOldTrees` — function — line 353
- `computeChunkEnvironment` — function — line 554
- `deriveLandmarkId` — function — line 329
- `deriveMineableRockResourceId` — function — line 339
- `EnvironmentKind` — type — line 21
- `EnvironmentPlacement` — type — line 37
- `isClassicLandmarkKind` — function — line 541
- `LANDMARK_BIAS_MAX` — const — line 142
- `LANDMARK_BIAS_MIN` — const — line 141
- `LANDMARK_LABELS` — const — line 163
- `LandmarkBiasInput` — type — line 176
- `LandmarkBiasKind` — type — line 144
- `landmarkChanceBias` — function — line 197
- `LandmarkKind` — type — line 149
- `LandmarkTerrainSampler` — type — line 426
  - domain: world-terrain
- `OLD_TREE_CLEARANCE_RADIUS` — const — line 129
- `resolveClassicLandmarkPlacement` — function — line 496
  - domain: world-terrain
- `rollCemeterySize` — function — line 306
- `VillageDisk` — type — line 185

## `terrain/chunkGrid.ts`

- `chebyshevDistance` — function — line 21
- `chunkCenter` — function — line 17
- `ChunkCoord` — type — line 1
- `chunkKey` — function — line 3
- `chunksNear` — function — line 30
- `keyToCoord` — function — line 7
- `RegionCoord` — type — line 39
- `regionCoordOf` — function — line 44
- `regionKey` — function — line 48
- `worldToChunk` — function — line 13

## `terrain/chunkHeightmap.ts`

- `apronGridWeights` — function — line 771
- `ApronGridWeights` — type — line 762
- `apronOriginWorld` — function — line 742
- `ChunkTileData` — type — line 376
- `ChunkTileParams` — type — line 244
- `ClearingSegment` — type — line 176
- `computeChunkTile` — function — line 1201
- `createLocalTerrainSampler` — function — line 1286
  - domain: world-terrain
- `createWorldTerrainSampler` — function — line 1328
  - domain: world-terrain
- `extractCoreGrid` — function — line 826
- `LocalTerrainSampler` — type — line 1261
  - domain: world-terrain
- `RawSampleParams` — type — line 356
- `RawTexelSample` — type — line 681
- `RegionalSmoothingSegment` — type — line 236
- `RegionParams` — type — line 24
- `RiverChannelSegment` — type — line 212
- `RoadCorridorSegment` — type — line 158
- `RoadNetworkParams` — type — line 95
- `sampleApronGrid` — function — line 809
- `sampleApronGridWeighted` — function — line 794
- `sampleBiomeAt` — function — line 713
- `sampleContinentalnessAt` — function — line 717
- `sampleFloorAt` — function — line 709
- `sampleHeightAt` — function — line 693
- `sampleLandHeightAt` — function — line 699
- `sampleMoistureRegionAt` — function — line 725
- `sampleMountainRidgeAt` — function — line 733
- `sampleRawFloorUncorrected` — function — line 705
- `sampleRawTexelAt` — function — line 686
- `VegetationKind` — type — line 22
- `VillageClearingParams` — type — line 76

## `terrain/chunkHeightmapProtocol.ts`

- `ChunkTileResult` — type — line 16
- `ChunkWorkerJobRequest` — type — line 47
- `ChunkWorkerRequest` — type — line 33
- `ChunkWorkerResponse` — type — line 49
- `GrassRequestParams` — type — line 29

## `terrain/chunkItems.ts`

- `computeChunkItems` — function — line 142
  - domain: world-terrain
- `ItemPlacement` — type — line 16

## `terrain/chunkManager.ts`

- `applyChunkWaterDayNight` — function — line 1188
- `applyModificationToTile` — function — line 949
- `ChunkManager` — type — line 562
- `ChunkManagerConfig` — type — line 342
- `createChunkManager` — function — line 1213
  - domain: world-terrain
  - system: chunk-manager
  - role: Owns terrain chunk streaming, sampling and environment-facing world queries.
  - simulation: on-demand
  - performance: nearby-only
- `CropHarvestOutcome` — type — line 1202
- `drainByBudget` — function — line 1163
- `FinalizeStage` — type — line 458
- `pickNearestQueuedKey` — function — line 1123
- `pickNextFinalizeKey` — function — line 1141
- `ResidentChunkSnapshot` — type — line 1028
- `sampleResidentHeight` — function — line 1048
- `sampleResidentLocalWater` — function — line 1096
- `sampleResidentSurfaceGround` — function — line 1068
- `TerrainModification` — type — line 906
- `tickChunkWaterSurfaces` — function — line 1176

## `terrain/chunkMeshCache.ts`

- `ChunkMeshDataCache` — type — line 13
- `createChunkMeshDataCache` — function — line 35
- `DEFAULT_MESH_CACHE_BUDGET_BYTES` — const — line 33

## `terrain/chunkMeshData.ts`

- `ChunkMeshData` — type — line 63
- `ChunkMeshDataParams` — type — line 75
- `ChunkMeshTileGrids` — type — line 47
- `computeChunkMeshData` — function — line 125
- `SCORCH_CHARCOAL` — const — line 22
- `scorchFalloffAt` — function — line 27
- `TerrainScorchPatch` — type — line 19

## `terrain/chunkTileWorldgenCache.ts`

- `CHUNK_TILE_CACHE_BYTE_BUDGET` — const — line 75
- `CHUNK_TILE_CACHE_NAMESPACE` — const — line 30
  - domain: world-terrain
  - system: worldgen-cache
  - role: Persistent-cache adapter for canonical worker-generated chunk tiles (plan world-terrain-031): one `chunk:<cx>:<cz>` record per chunk holding the unchanged `ChunkTileResult` — the eight apron-inclusive terrain grids plus the deterministic vegetation/item/environment/crop placements. Stores the existing worker contract verbatim; there is deliberately no cache-specific terrain model and no `SaveData` field.
  - integration: Disposable derived data only. `ChunkManager.ensureLoaded()` generates exactly the same chunk with an empty cache — a miss, a malformed record or an IndexedDB failure always falls back to the tile worker. The payload is *base* worldgen: player/system terrain modifications, terrain cutouts, tree/crop lifecycle, collected items, resource depletion, mesh data and every Three.js object stay downstream and are never cached here, so two same-seed saves share only deterministic generation output.
- `CHUNK_TILE_CACHE_VERSION` — const — line 59
- `CHUNK_TILE_META_SUBKEY` — const — line 64
- `ChunkTileCacheStats` — type — line 105
- `ChunkTileCacheStorage` — type — line 241
- `chunkTileFingerprint` — function — line 98
  - domain: world-terrain
  - system: worldgen-cache
- `chunkTileSubKey` — function — line 82
- `cloneChunkTileForRuntime` — function — line 218
  - domain: world-terrain
  - system: worldgen-cache
- `estimateChunkTileBytes` — function — line 197
- `getChunkTileCacheStats` — function — line 131
- `loadCachedChunkTile` — function — line 342
  - domain: world-terrain
  - system: worldgen-cache
- `persistChunkTile` — function — line 390
  - domain: world-terrain
  - system: worldgen-cache
- `resetChunkTileCacheMetadata` — function — line 325
- `resetChunkTileCacheStats` — function — line 135
- `validateCachedChunkTile` — function — line 175
  - domain: world-terrain
  - system: worldgen-cache

## `terrain/chunkVegetation.ts`

- `computeChunkVegetation` — function — line 184
- `VegetationPlacement` — type — line 28

## `terrain/chunkWorkerPool.ts`

- `cancelChunkGrass` — function — line 589
- `cancelChunkMapTile` — function — line 619
- `cancelChunkMesh` — function — line 600
- `cancelChunkRiverTile` — function — line 631
- `cancelChunkTile` — function — line 578
- `cancelChunkWorldKnowledge` — function — line 611
- `ChunkWorkerLike` — type — line 29
- `ChunkWorkerPool` — type — line 45
- `ChunkWorkerPoolOptions` — type — line 36
- `createChunkWorkerPool` — function — line 204
- `defaultChunkWorkerCount` — function — line 174
- `disposeChunkWorkerPool` — function — line 648
- `HeightmapGenerationCancelledError` — class — line 17
- `installChunkWorkerHydrology` — function — line 635
- `isChunkWorkerCancelledError` — function — line 24
- `requestChunkGrass` — function — line 582
- `requestChunkHydrologyRows` — function — line 639
- `requestChunkMapTile` — function — line 615
- `requestChunkMesh` — function — line 593
- `requestChunkRiverTile` — function — line 623
- `requestChunkTile` — function — line 571
- `requestChunkWorldKnowledge` — function — line 604

## `terrain/chunkWorldItems.ts`

- `chunkCoordFromWorldItemId` — function — line 33
- `nearestWorldChunkItem` — function — line 69
- `nearestWorldChunkItems` — function — line 113
- `proceduralChunkItems` — function — line 50
  - domain: settlements-npcs
- `WorldChunkItemRef` — type — line 25

## `terrain/coastalResources.ts`

- `isShellDigShore` — function — line 53
- `isShellSpawnShore` — function — line 34
- `SHELL_DIG_MAX_DEPTH_BELOW_WATER` — const — line 22
- `SHELL_SPAWN_MAX_HEIGHT_ABOVE_WATER` — const — line 19
- `SHELL_SPAWN_MIN_HEIGHT_ABOVE_WATER` — const — line 16
  - domain: world-terrain

## `terrain/coastPlacement.ts`

- `COAST_BEACH_HEIGHT` — const — line 14
- `COAST_INLAND_MARGIN` — const — line 16
- `CoastalSamplers` — type — line 6
- `isCoastalPlacement` — function — line 19

## `terrain/continentMask.ts`

- `coastRadiusAt` — function — line 49
- `continentCentre` — function — line 38
- `continentMaskAt` — function — line 64
- `ContinentMaskParams` — type — line 17
- `WORLD_HALF_EXTENT` — const — line 30

## `terrain/depositMining.ts`

- `hitsForRichness` — function — line 30
- `isDepleted` — function — line 59
- `isMineableOre` — function — line 25
- `MINE_DURATION_SEC` — const — line 23
- `MineableOre` — type — line 6
- `ORE_ITEM` — const — line 8
- `ORE_YIELD_LABEL` — const — line 15
- `oreEconomicKind` — function — line 76
- `recordMined` — function — line 65
- `resolveRemaining` — function — line 48
- `ResourceDepletionState` — type — line 43
- `yieldForOre` — function — line 69

## `terrain/dig.ts`

- `DIG_DEPTH_ROCK` — const — line 12
- `DIG_DEPTH_SAND` — const — line 11
- `DIG_DEPTH_SOIL` — const — line 10
- `DIG_DURATION_SEC` — const — line 20
- `DIG_RADIUS` — const — line 9
- `DigEnv` — type — line 40
- `DigProfile` — type — line 34
- `DigShellOutcome` — type — line 114
- `DigStoneOutcome` — type — line 93
- `DigSurface` — type — line 32
- `getDigProfileAt` — function — line 65
- `getRockDigProfileAt` — function — line 86
- `isEligibleShellDigSpot` — function — line 133
- `isRockGround` — function — line 55
- `resolveDigShell` — function — line 120
- `resolveDigStone` — function — line 99
- `ROCK_MOUNTAIN_RIDGE_THRESHOLD` — const — line 27
- `SHELL_CHANCE_SHORE_DIG` — const — line 112
- `STONE_CHANCE_ROCK` — const — line 15
- `STONE_CHANCE_SAND` — const — line 14
- `STONE_CHANCE_SOIL` — const — line 13
- `STONE_NOTICE_CHANCE` — const — line 18

## `terrain/digAction.ts`

- `addDigItemToInventory` — function — line 33
- `applyDigAt` — function — line 49
- `applyLevelAt` — function — line 110
- `applyMoundAt` — function — line 135
- `DigFeedback` — type — line 18
- `dropDigItemNearby` — function — line 42

## `terrain/digFinds.ts`

- `buildDigContextualFindContext` — function — line 117
- `COASTAL_AMBER_CHANCE` — const — line 16
- `COASTAL_EXCEPTIONAL_SHELL_CHANCE` — const — line 15
  - domain: world-terrain Contextual shovel-find resolution (plan world-terrain-048) — repeatable low-probability material discovery during physical digging, separate from one-shot Hidden Finds.
- `DigContextualFindContext` — type — line 33
- `DigContextualFindEnv` — type — line 108
- `digContextualFindEnvFromChunkManager` — function — line 153
- `INLAND_AMBER_CHANCE` — const — line 17
- `isDigForestContext` — function — line 45
- `isDigSwampContext` — function — line 41
- `isMountainProspectingDigContext` — function — line 49
- `isWithinSettlementDigFootprint` — function — line 56
- `MOUNTAIN_PROSPECTING_RANGE` — const — line 20
- `MOUNTAIN_TRACE_ORE_CHANCE` — const — line 19
- `resolveContextualDigFind` — function — line 94
- `SETTLEMENT_DIG_FOOTPRINT_MARGIN` — const — line 26
- `SETTLEMENT_LOST_OBJECT_CHANCE` — const — line 18
- `SWAMP_CONTEXT_THRESHOLD` — const — line 23

## `terrain/distanceLod.ts`

- `DENSITY_LOD_FLOOR` — const — line 4
- `densityLodFraction` — function — line 11
- `grassFillerLodFraction` — function — line 25
- `grassGeometryLodTier` — function — line 37
- `GrassGeometryLodTier` — type — line 35

## `terrain/fbm.ts`

- `fbm01` — function — line 14
- `FbmParams` — type — line 3

## `terrain/fireResidueOverlay.ts`

- `createFireResidueOverlaySystem` — function — line 81
- `FireResidueOverlayPlacement` — type — line 12
- `FireResidueOverlaySystem` — type — line 19

## `terrain/footstepSurface.ts`

- `FootstepSurface` — type — line 6
- `sampleFootstepSurface` — function — line 35

## `terrain/grass.ts`

- `createGrassSystem` — function — line 530
- `grassBladeLocalPositions` — function — line 378
  - domain: world-terrain
- `GrassSystem` — type — line 79
- `WorldGrassChunk` — type — line 25

## `terrain/grassBounds.ts`

- `createGrassBoundsAccumulator` — function — line 90
- `expandGrassInstanceBounds` — function — line 108
  - domain: world-terrain
- `finalizeGrassBounds` — function — line 144
  - domain: world-terrain
- `GrassBoundsAccumulator` — type — line 18
- `grassBoundsContainsPoint` — function — line 153
- `GrassBucketBounds` — type — line 11
- `grassInstanceConservativeRadius` — function — line 79
  - domain: world-terrain
- `grassSpeciesLocalExtent` — function — line 69
  - domain: world-terrain
- `transformGrassLocalPoint` — function — line 167

## `terrain/grassPlacement.ts`

- `computeChunkGrass` — function — line 381
- `GRASS_SPECIES_ORDER` — const — line 32
- `GrassBucketData` — type — line 85
- `GrassChunkData` — type — line 101
- `GrassComputeMode` — type — line 83
- `GrassComputeParams` — type — line 46
- `grassLodCount` — function — line 107
- `GrassSpeciesId` — type — line 28
- `GrassTileGrids` — type — line 36
- `macroMeadowNoiseFor` — function — line 358
- `macroMeadowWeightAt` — function — line 374
  - domain: world-terrain

## `terrain/gridContour.ts`

- `CELL_RING` — const — line 12
  - domain: world-terrain
- `marchCellRing` — function — line 34
  - domain: world-terrain

## `terrain/hydrology.ts`

- `classifyStreams` — function — line 698
- `computeHydrologyRegion` — function — line 658
- `D8_DIRECTIONS` — const — line 28
- `DEFAULT_DEPRESSION_REPAIR_OPTIONS` — const — line 203
- `DEFAULT_DOWNSTREAM_PROBE_STEPS` — const — line 124
- `DEFAULT_STREAM_THRESHOLDS` — const — line 90
- `DepressionRepairOptions` — type — line 179
- `DownstreamProbe` — type — line 113
- `DownstreamProbeOutcome` — type — line 100
- `findSourceCandidates` — function — line 745
- `FLOW_DIR_SINK` — const — line 52
- `HydrologyFlag` — const — line 39
- `HydrologyRegion` — type — line 66
- `HydrologyRegionParams` — type — line 56
- `probeDownstreamTerminal` — function — line 161
  - domain: world-terrain
- `SourceCandidateOptions` — type — line 711
- `StreamClass` — type — line 695
- `StreamThresholds` — type — line 84
- `traceDownstreamPath` — function — line 795

## `terrain/mineableDeposit.ts`

- `depositMatchesQueryContext` — function — line 98
- `DepositQueryOptions` — type — line 53
- `MineableDepositDefinition` — type — line 35
  - domain: world
- `mineableDepositFromNaturalResource` — function — line 61
- `querySpatialContext` — function — line 91
- `resolveDepositRemaining` — function — line 84
  - domain: world

## `terrain/mineableRocks.ts`

- `applyMineableRockAction` — function — line 95
- `DEPLETED_STAGE_INDEX` — const — line 116
- `deserializeMineableRockState` — function — line 130
- `effectiveMineableRockKind` — function — line 62
- `isMineableRockKind` — function — line 21
- `isMineableRockTouched` — function — line 75
- `MineableRockKind` — type — line 19
  - domain: world-terrain
- `mineableRockPromptLabel` — function — line 79
- `MineableRockRuntimeState` — type — line 52
- `MineableRockStateStore` — type — line 54
- `MineableRockWorkOutcome` — type — line 83
- `mineableWorkDefinitionForRock` — function — line 43
- `SaveMineableRockRow` — type — line 114
- `serializeMineableRockState` — function — line 118

## `terrain/naturalResources.ts`

- `dominantResourceNear` — function — line 283
- `NaturalResource` — type — line 50
- `RESOURCE_ROLE` — const — line 75
- `RESOURCE_TYPES` — const — line 46
- `resourceAttractionAt` — function — line 305
- `resourceById` — function — line 252
  - domain: settlements-npcs
- `ResourceEnv` — type — line 115
- `resourcesNear` — function — line 261
- `ResourceType` — type — line 34
- `SIGNIFICANT_RICHNESS` — const — line 69

## `terrain/renewableWorldItems.ts`

- `depleteRenewableWorldItem` — function — line 64
- `isMedicinalForageKind` — function — line 33
- `isRenewableWorldItem` — function — line 28
- `isRenewableWorldItemAvailable` — function — line 51
- `isWorldItemPlacementAvailable` — function — line 89
- `MEDICINAL_HERB_SURVIVAL_RANGE_BONUS_MAX` — const — line 21
- `medicinalHerbInteractRange` — function — line 42
- `pruneRenewableWorldItems` — function — line 78
- `RENEWABLE_WORLD_ITEM_RESPAWN_DAYS` — const — line 13
  - domain: items-player
  - system: world-chunk-items
  - owns: RenewableWorldItemOverrides
- `renewableRespawnDays` — function — line 47
- `RenewableWorldItemOverrides` — type — line 26

## `terrain/resourceDeposits.ts`

- `createResourceDeposits` — function — line 186
  - domain: world
- `DepositTarget` — type — line 96
- `InterestPoint` — type — line 118
- `MineResult` — type — line 108
- `ResourceDeposits` — type — line 132
- `ResourceDepositSources` — type — line 127
  - domain: world
- `SettlementMiningHooks` — type — line 156

## `terrain/riverChainClip.ts`

- `clipChainsToRect` — function — line 84
- `clipChainToRect` — function — line 54
- `RiverChainIndex` — class — line 89

## `terrain/riverFord.ts`

- `FORD_WATER_DEPTH` — const — line 31
  - domain: terrain
  - system: water
  - role: Ford *shaping* maths — the small amount of pure geometry that turns an already-declared road↔river crossing into a shallow, traversable bed instead of the road falling into a full-depth carved channel.
  - integration: Since plan world-terrain-023 this module no longer decides whether a crossing exists: `settlement/roadRiverCrossing.ts` owns that, and `settlement/roadNetwork.ts` projects each declared `ford` crossing into compact, worker-safe FordProjection data on `ChunkTileParams.fordProjections` (the same "resolve nearby routes main-thread, ship plain numbers to the worker" seam as `RoadCorridorSegment`). `chunkHeightmap.ts`'s river-carving stage and `ChunkManager.sampleLocalWater()` both read the influence through fordInfluenceAt and the shaped bed through fordBedHeight, so gameplay water depth and terrain agree by construction. An incidental road × river overlap with no declared crossing leaves the canonical channel completely natural. Seam-safety follows the same argument roads and rivers already use: a projection is plain world-space geometry handed to every chunk its influence reaches, so two chunks sharing a boundary compute an identical ford there.
- `fordBedHeight` — function — line 106
- `fordInfluenceAt` — function — line 76
- `FordProjection` — type — line 41

## `terrain/riverNetwork.ts`

- `canonicalWaterHeight` — function — line 216
- `computeRiverTile` — function — line 869
- `computeRiverTileDiagnostics` — function — line 900
  - domain: world-terrain
- `DEFAULT_RIVER_THRESHOLDS` — const — line 60
- `depthFromAccumulation` — function — line 200
- `exposedBankFromFlow` — function — line 186
- `flowFactor` — function — line 140
- `footprintOverlapsRiver` — function — line 384
- `isInsideRiverChannel` — function — line 371
- `MEANDER_NOISE_SEED_XOR` — const — line 564
- `meanderChainPointsWith` — function — line 588
- `nearestRiverBankDistance` — function — line 354
- `nearestRiverBankPoint` — function — line 401
- `nearestRiverHydrologyContext` — function — line 454
- `nearestRiverShoreCandidate` — function — line 504
- `overlappingRiverTiles` — function — line 87
- `RIVER_CELL_STEP` — const — line 43
- `RIVER_MEANDER_TAPER_DISTANCE` — const — line 563
- `RIVER_TILE_HALO` — const — line 42
- `RIVER_TILE_SIZE` — const — line 36
- `RiverChain` — type — line 101
- `RiverChainDiagnostic` — type — line 655
- `RiverChainRejection` — type — line 646
- `RiverChainTerminal` — type — line 625
- `riverChannelSegmentsNear` — function — line 243
- `RiverHydrologyContext` — type — line 444
- `RiverPoint` — type — line 100
- `RiverShoreCandidate` — type — line 496
- `RiverTileCoord` — type — line 66
- `riverTileCoordOf` — function — line 68
- `riverTileCoreRect` — function — line 79
- `riverTileKey` — function — line 72
- `RiverWaterSample` — type — line 311
- `riverWaterSampleAt` — function — line 322
- `smoothChainPoints` — function — line 848
- `submergedDepthFromFlow` — function — line 191
- `widthFromAccumulation` — function — line 154
- `WorldRect` — type — line 76

## `terrain/riverQuery.ts`

- `createRiverQuery` — function — line 50
  - domain: terrain
- `RiverQuery` — type — line 28
  - domain: terrain
  - system: water
  - role: Analytic "what river geometry is around here" seam for *placement* code (settlement sites, village plots) that runs long before — and independently of — chunk streaming. Returns the same canonical `RiverChannelSegment[]` terrain carving and the water ribbon are built from (`riverChannelSegmentsNear`), so placement never reasons about rivers through a second, approximate representation.
  - integration: Deliberately separate from `riverTileCache.ts`: that cache is reference-counted against *loaded chunks* and evicts the moment no chunk holds a tile, which is the wrong lifetime for a query that has to answer for settlements far outside the loaded ring. This keeps its own small bounded map instead, at the cost of recomputing a tile the chunk cache may also hold. Both compute through the identical pure `computeRiverTile`, so the two can never disagree.

## `terrain/riverTileCache.ts`

- `createRiverTileCache` — function — line 56
- `RiverTileCache` — type — line 19
- `RiverTileCacheOptions` — type — line 44
- `RiverTileCacheStats` — type — line 32
- `riverTileStatsDelta` — function — line 148

## `terrain/roadBridge.ts`

- `bridgeDeckYAt` — function — line 72
- `isOnAnyBridgeDeck` — function — line 82
- `isOnBridgeDeck` — function — line 63
- `RoadBridgeSpec` — type — line 23
  - domain: world-terrain
  - system: roads
  - role: Bridge *projection* geometry — the plain-data `RoadBridgeSpec` an already-declared canonical `RoadRiverCrossing(kind = 'bridge')` (plan world-terrain-023) is turned into, plus the one oriented-footprint test every consumer shares (plan world-terrain-033). Mirrors `riverFord.ts`'s split: this module owns worker-safe type + pure query, `roadNetwork.ts` owns the settlement-layer projection (`bridgeSpecOf`) and bounded query (`bridgesNear`), same "terrain owns the shared shape, settlement produces it" seam `RoadCorridorSegment`/`FordProjection` already use.
  - integration: `terrain/chunkHeightmap.ts` reads isOnBridgeDeck to suppress road-height/tint shaping under an open span (never the river carve). `terrain/chunkManager.ts` reads the same test for bridge presentation ownership and the shared movement-ground query (`sampleBridgeDeck`/`sampleSurfaceGround`). No THREE.js, no route/crossing search — every bridge here is already decided.

## `terrain/slopeConstraint.ts`

- `applySlopeMovementConstraint` — function — line 82
- `constrainToSlope` — function — line 66
- `sampleResidentSlope` — function — line 138
- `sampleSlope` — function — line 42
- `SLOPE_FALLOFF_START_DEG` — const — line 12
- `SLOPE_MAX_WALKABLE_DEG` — const — line 15
- `SLOPE_SAMPLE_STEP` — const — line 20
- `SlopeSample` — interface — line 31
- `stepWithSlopeAndCollision` — function — line 104
- `stepWithSlopeAndCollisionResident` — function — line 172

## `terrain/snowField.ts`

- `GRASS_SNOW_BIAS` — const — line 24
- `GRASS_SNOW_DITHER_AT` — const — line 28
- `GRASS_SNOW_FROST` — const — line 26
- `grassSnowBury` — function — line 149
- `grassSnowCoverAt` — function — line 143
- `grassSnowFrost` — function — line 154
- `grassSnowVisible` — function — line 159
- `parseSnowParam` — function — line 167
- `SNOW_ALT_M` — const — line 22
- `SNOW_BIAS` — const — line 20
- `SNOW_COL` — const — line 30
- `SNOW_EDGE` — const — line 18
- `SNOW_FIELD_GLSL` — const — line 58
- `SNOW_GAIN` — const — line 14
  - domain: world-terrain
- `SNOW_ONSET` — const — line 16
- `snowCover` — function — line 111
- `snowLatticeHash` — function — line 45
- `snowNoise` — function — line 86
- `snowTerrainBias` — function — line 124
- `SnowTerrainBiasInput` — interface — line 116
- `snowThreshold` — function — line 102
- `terrainSnowCoverAt` — function — line 133

## `terrain/terrainClassification.ts`

- `isMountainRidge` — function — line 25
- `isOceanMix` — function — line 21
- `isWetFloor` — function — line 17
- `MOUNTAIN_RIDGE_THRESHOLD` — const — line 13
- `OCEAN_MIX_GATE` — const — line 15

## `terrain/terrainCutout.ts`

- `buildCutChunkAttributes` — function — line 148
  - domain: world-terrain
- `CutChunkAttributes` — type — line 57
- `cutoutsOverlappingChunk` — function — line 76
- `TerrainCutout` — type — line 34
- `TerrainCutoutBounds` — type — line 27

## `terrain/terrainDetailNormalMap.ts`

- `createTerrainNormalMap` — function — line 27
- `getSharedTerrainDetailNormalMap` — function — line 106

## `terrain/terrainPreparation.ts`

- `averageAbsHeightDelta` — function — line 213
- `CompletedTerrainPreparation` — type — line 49
  - domain: world
  - system: terrain-preparation
- `completedTerrainPreparationFrom` — function — line 55
- `computeRequiredWork` — function — line 189
- `exceedsMaxDeformation` — function — line 172
- `formatHeightDelta` — function — line 274
- `GridSample` — type — line 37
- `HeightSample` — type — line 38
- `isPreparationSize` — function — line 33
- `MAX_PREPARATION_DELTA` — const — line 167
- `MAX_PREPARATION_SIZE` — const — line 21
- `MIN_PREPARATION_SIZE` — const — line 20
- `MINIMUM_PREPARATION_WORK_HOURS` — const — line 186
- `nearestGridPoint` — function — line 97
- `PREPARATION_SIZES` — const — line 27
- `preparationSamplesPerSide` — function — line 125
- `PreparationSize` — type — line 29
- `PreparationValidationResult` — type — line 249
- `progressiveHeight` — function — line 236
- `progressiveHeights` — function — line 241
- `resolveLevelSamples` — function — line 108
- `resolvePreparationSamples` — function — line 141
- `TERRAIN_PREP_NPC_WORK_SESSION_HOURS` — const — line 211
- `TERRAIN_PREP_NPC_WORK_SESSION_SEC` — const — line 204
- `TerrainPreparationRecord` — type — line 73
- `terrainPreparationRemainingWork` — function — line 196
- `toolSpeedMultiplier` — function — line 224
- `validatePreparationSamples` — function — line 261

## `terrain/terrainVisualHorizon.ts`

- `terrainVisualHorizon` — function — line 33
  - domain: world-terrain
- `TerrainVisualHorizon` — type — line 14
  - domain: world-terrain

## `terrain/unloadedLandmarkLookup.ts`

- `isLightweightUnloadedLandmark` — function — line 49
  - domain: world-terrain
- `landmarkFromEnvironment` — function — line 35
  - domain: world-terrain
- `resolveUnloadedLandmark` — function — line 64
  - domain: world-terrain
- `ringChunkOffsets` — function — line 18
  - domain: world-terrain

## `terrain/vegetationRegionBatcher.ts`

- `createVegetationRegionBatcher` — function — line 190
- `REGION_CHUNKS` — const — line 100
- `VegetationKind` — type — line 10
- `VegetationLodClass` — type — line 41
- `vegetationLodFraction` — function — line 82
- `VegetationRegionBatcher` — type — line 125

## `terrain/waterBodies.ts`

- `BodyScaleParams` — type — line 15
- `computeBodyScale` — function — line 112
- `detectWaterBodies` — function — line 37
- `LAKE_SCALE_MAX` — const — line 29
- `lakeScaleFor` — function — line 90
- `OCEAN_BODY_SCALE_DISCARD` — const — line 27
- `oceanMixAt` — function — line 98
- `WaterBody` — type — line 4
- `WaterBodyDetection` — type — line 10

## `terrain/waterBodyKind.ts`

- `lakeProximityAt` — function — line 210
- `LakeProximitySamplers` — type — line 157
- `nearestShoreProbePoint` — function — line 50
- `resolveWaterBodyKind` — function — line 81
- `resolveWaterShore` — function — line 126
- `shoreProbeHits` — function — line 33
- `WaterShoreResult` — type — line 100
- `WaterShoreSamplers` — type — line 107

## `terrain/waterSample.ts`

- `DRY_WATER_SAMPLE` — const — line 25
- `LocalWaterSample` — type — line 21
  - domain: terrain
  - system: water
  - role: Single physical "what water, if any, is at this point" answer (plan fauna-015) — the one thing world/terrain owns so fauna (and, later, any other gameplay consumer) never re-derives lake/ocean vs. river depth logic itself. Pure/allocation-light so it's safe to call from a hot per-agent movement path; `ChunkManager.sampleLocalWater` is the only wiring that turns real chunk/river data into these inputs.
- `sampleLocalWater` — function — line 49

## `terrain/waterSurface.ts`

- `isWaterOrShore` — function — line 30
- `isWetFloor` — function — line 17
- `isWetTexel` — function — line 22
- `LAKE_SURFACE_EPS` — const — line 14
- `WET_EPS` — const — line 11
  - domain: terrain
  - system: water
  - role: Single owner of the "is this point wet" rule after plan world-terrain-058 L1: the clamped surface height `h` (`max(floorH, waterH)`, `waterH` = sea level or a lake's level) lies above the floor. Leaf module (no imports) so terrain, placement and gameplay code share one predicate instead of comparing a height against `waterLevel`, which only ever described the sea.

## `terrain/worldHydrology.ts`

- `ChainEnd` — const — line 115
- `ChainEndKind` — type — line 116
- `computeWorldHydrology` — function — line 670
- `DEFAULT_WORLD_HYDROLOGY_OPTIONS` — const — line 68
- `hashWorldHydrology` — function — line 1013
- `HydrologyLake` — type — line 127
- `PackedChains` — type — line 118
- `packSparseBlocks` — function — line 548
- `sampleRawFloorRows` — function — line 190
- `SparseBlocks` — type — line 107
- `sparseBlockValue` — function — line 591
- `WORLD_HYDROLOGY_GRID` — const — line 87
- `WORLD_HYDROLOGY_VERSION` — const — line 34
  - domain: world-terrain
- `WorldHydrology` — type — line 169
- `WorldHydrologyGrid` — type — line 94
- `WorldHydrologyOptions` — type — line 36
- `WorldHydrologyStats` — type — line 140

## `terrain/worldHydrologyCache.ts`

- `isWorldHydrologyPayload` — function — line 22
- `readCachedWorldHydrology` — function — line 38
- `WORLD_HYDROLOGY_CACHE_NAMESPACE` — const — line 14
  - domain: world-terrain
  - system: worldgen-cache
- `WORLD_HYDROLOGY_CACHE_VERSION` — const — line 17
- `writeCachedWorldHydrology` — function — line 49

## `terrain/worldHydrologyRegistry.ts`

- `hydrologyIdFor` — function — line 30
- `worldHydrologyOptionsFor` — function — line 21

## `terrain/worldHydrologyRuntime.ts`

- `computeWorldHydrologyFor` — function — line 62
- `ensureWorldHydrology` — function — line 94
- `EnsureWorldHydrologyOptions` — type — line 75
- `sampleRowsOnThisThread` — const — line 134
- `sampleWorldHydrologyFloor` — function — line 43
- `WORLD_HYDROLOGY_STRIPS` — const — line 37
- `WorldHydrologyFloorSampler` — type — line 34
- `WorldHydrologyInstallResult` — type — line 21
- `WorldHydrologyInstallSource` — type — line 19
  - domain: world-terrain

## `terrain/worldHydrologyStore.ts`

- `clearWorldHydrology` — function — line 46
- `hasWorldHydrology` — function — line 34
- `hydrologyCorrectionAt` — function — line 123
- `hydrologyLakeLevelAt` — function — line 145
- `installWorldHydrology` — function — line 30
- `isUnconditionedHydrologyId` — function — line 23
- `LEGACY_HYDROLOGY_PREFIX` — const — line 20
- `SPARSE_BLOCK_SIZE` — const — line 14
  - domain: world-terrain
- `StreamHead` — type — line 161
- `streamHeadsFor` — function — line 170
- `UNCONDITIONED_HYDROLOGY_ID` — const — line 17
- `unpackChains` — function — line 189
- `worldHydrologyFor` — function — line 39

## `terrain/worldKnowledgeScan.ts`

- `chunkParamsForWorldKnowledgeScan` — function — line 205
  - domain: world-terrain
- `prepareWorldKnowledgeScan` — function — line 139
  - domain: world-terrain
- `scanWorldKnowledge` — function — line 289
  - domain: world-terrain
- `WORLD_KNOWLEDGE_MAX_NEARBY_HITS` — const — line 28
- `WorldKnowledgeChunkGather` — type — line 84
- `worldKnowledgeGatherFor` — function — line 189
- `WorldKnowledgeQueryKind` — type — line 30
- `worldKnowledgeRoadContext` — function — line 117
  - domain: world-terrain
- `WorldKnowledgeScanHit` — type — line 71
- `WorldKnowledgeScanResult` — type — line 79
- `WorldKnowledgeTerrainSnapshot` — type — line 37
  - domain: world-terrain
- `WorldKnowledgeWorkerParams` — type — line 60

## `terrain/worleyNoise.ts`

- `worleyRidge` — function — line 35
- `WorleyRidgeResult` — type — line 1

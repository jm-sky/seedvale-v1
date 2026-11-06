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

- `applyMicroTint` — function — line 277
- `applyMountainRock` — function — line 202
- `applyOceanDepthTint` — function — line 227
- `applyRoadTint` — function — line 248
- `applySlopeRock` — function — line 168
- `colorForTerrain` — function — line 128
- `landBlendForSandBand` — function — line 54
- `ROCK_SLOPE_FULL` — const — line 62
- `ROCK_SLOPE_START` — const — line 61
- `SAND_BAND` — const — line 22
- `SAND_BAND_MAX` — const — line 20
- `SAND_BAND_MIN` — const — line 18
- `sandBandAt` — function — line 47
- `terrainTintNoise` — function — line 271

## `terrain/biomeRegions.ts`

- `ARID_START` — const — line 79
- `ARID_WIDTH` — const — line 80
- `biomeBorderAt` — function — line 125
- `BiomeClimateInput` — type — line 65
- `BiomeWeights` — type — line 7
- `biomeWeightsAt` — function — line 31
- `biomeWeightsAtPoint` — function — line 137
- `biomeWeightsFromClimate` — function — line 89
- `BiomeWeightsSampler` — type — line 154
- `biomeWeightsSamplerFor` — function — line 157
- `ForestBiome` — type — line 279
- `forestBiomeAt` — function — line 297
- `forestDensityAt` — function — line 238
- `forestDensityAtPoint` — function — line 162
- `regionalTreeSpeciesWeight` — function — line 184
- `SWAMP_WET_FULL` — const — line 82
- `SWAMP_WET_WIDTH` — const — line 83
- `T_WARM_FULL` — const — line 77
- `T_WARM_START` — const — line 76

## `terrain/bloodOverlay.ts`

- `BloodOverlayPlacement` — type — line 31
- `BloodOverlaySystem` — type — line 41
- `createBloodOverlaySystem` — function — line 156

## `terrain/buildChunkGeometry.ts`

- `buildChunkGeometry` — function — line 420
- `ChunkMeshResult` — type — line 19
- `createTerrainMaterial` — function — line 57
- `TERRAIN_DIRT_DIFFUSE_TUNING` — const — line 48
- `TerrainWeatherUniforms` — type — line 42

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

- `apronGridWeights` — function — line 894
- `ApronGridWeights` — type — line 885
- `apronOriginWorld` — function — line 865
- `ChunkTileData` — type — line 384
- `ChunkTileParams` — type — line 247
- `ClearingSegment` — type — line 179
- `computeChunkTile` — function — line 1324
- `createLocalTerrainSampler` — function — line 1409
  - domain: world-terrain
- `createWorldTerrainSampler` — function — line 1451
  - domain: world-terrain
- `extractCoreGrid` — function — line 949
- `landformDescriptorsOf` — function — line 546
- `landformIndexOf` — function — line 541
- `LocalTerrainSampler` — type — line 1384
  - domain: world-terrain
- `rangeSpinesFor` — function — line 560
- `RawSampleParams` — type — line 364
- `RawTexelSample` — type — line 799
- `RegionalSmoothingSegment` — type — line 239
- `RegionParams` — type — line 27
- `RiverChannelSegment` — type — line 215
- `RoadCorridorSegment` — type — line 161
- `RoadNetworkParams` — type — line 98
- `sampleApronGrid` — function — line 932
- `sampleApronGridWeighted` — function — line 917
- `sampleBiomeAt` — function — line 836
- `sampleContinentalnessAt` — function — line 840
- `sampleFloorAt` — function — line 832
- `sampleHeightAt` — function — line 811
- `sampleLandHeightAt` — function — line 817
- `sampleMoistureRegionAt` — function — line 848
- `sampleMountainRidgeAt` — function — line 856
- `sampleRawFloorUncorrected` — function — line 828
- `sampleRawTexelAt` — function — line 804
- `sampleRawTexelUncorrectedAt` — function — line 823
- `VegetationKind` — type — line 25
- `VillageClearingParams` — type — line 79

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

- `applyChunkWaterDayNight` — function — line 1197
- `applyModificationToTile` — function — line 958
- `ChunkManager` — type — line 566
- `ChunkManagerConfig` — type — line 342
- `createChunkManager` — function — line 1222
  - domain: world-terrain
  - system: chunk-manager
  - role: Owns terrain chunk streaming, sampling and environment-facing world queries.
  - simulation: on-demand
  - performance: nearby-only
- `CropHarvestOutcome` — type — line 1211
- `drainByBudget` — function — line 1172
- `FinalizeStage` — type — line 462
- `pickNearestQueuedKey` — function — line 1132
- `pickNextFinalizeKey` — function — line 1150
- `ResidentChunkSnapshot` — type — line 1037
- `sampleResidentHeight` — function — line 1057
- `sampleResidentLocalWater` — function — line 1105
- `sampleResidentSurfaceGround` — function — line 1077
- `TerrainModification` — type — line 915
- `tickChunkWaterSurfaces` — function — line 1185

## `terrain/chunkMeshCache.ts`

- `ChunkMeshDataCache` — type — line 13
- `createChunkMeshDataCache` — function — line 35
- `DEFAULT_MESH_CACHE_BUDGET_BYTES` — const — line 33

## `terrain/chunkMeshData.ts`

- `ChunkMeshData` — type — line 64
- `ChunkMeshDataParams` — type — line 76
- `ChunkMeshTileGrids` — type — line 48
- `computeChunkMeshData` — function — line 128
- `SCORCH_CHARCOAL` — const — line 23
- `scorchFalloffAt` — function — line 28
- `TerrainScorchPatch` — type — line 20

## `terrain/chunkTileWorldgenCache.ts`

- `CHUNK_TILE_CACHE_BYTE_BUDGET` — const — line 83
- `CHUNK_TILE_CACHE_NAMESPACE` — const — line 30
  - domain: world-terrain
  - system: worldgen-cache
  - role: Persistent-cache adapter for canonical worker-generated chunk tiles (plan world-terrain-031): one `chunk:<cx>:<cz>` record per chunk holding the unchanged `ChunkTileResult` — the eight apron-inclusive terrain grids plus the deterministic vegetation/item/environment/crop placements. Stores the existing worker contract verbatim; there is deliberately no cache-specific terrain model and no `SaveData` field.
  - integration: Disposable derived data only. `ChunkManager.ensureLoaded()` generates exactly the same chunk with an empty cache — a miss, a malformed record or an IndexedDB failure always falls back to the tile worker. The payload is *base* worldgen: player/system terrain modifications, terrain cutouts, tree/crop lifecycle, collected items, resource depletion, mesh data and every Three.js object stay downstream and are never cached here, so two same-seed saves share only deterministic generation output.
- `CHUNK_TILE_CACHE_VERSION` — const — line 67
- `CHUNK_TILE_META_SUBKEY` — const — line 72
- `ChunkTileCacheStats` — type — line 113
- `ChunkTileCacheStorage` — type — line 249
- `chunkTileFingerprint` — function — line 106
  - domain: world-terrain
  - system: worldgen-cache
- `chunkTileSubKey` — function — line 90
- `cloneChunkTileForRuntime` — function — line 226
  - domain: world-terrain
  - system: worldgen-cache
- `estimateChunkTileBytes` — function — line 205
- `getChunkTileCacheStats` — function — line 139
- `loadCachedChunkTile` — function — line 350
  - domain: world-terrain
  - system: worldgen-cache
- `persistChunkTile` — function — line 398
  - domain: world-terrain
  - system: worldgen-cache
- `resetChunkTileCacheMetadata` — function — line 333
- `resetChunkTileCacheStats` — function — line 143
- `validateCachedChunkTile` — function — line 183
  - domain: world-terrain
  - system: worldgen-cache

## `terrain/chunkVegetation.ts`

- `computeChunkVegetation` — function — line 185
- `VegetationPlacement` — type — line 29

## `terrain/chunkWorkerPool.ts`

- `cancelChunkFarTile` — function — line 678
- `cancelChunkGrass` — function — line 640
- `cancelChunkMapTile` — function — line 670
- `cancelChunkMesh` — function — line 651
- `cancelChunkTile` — function — line 629
- `cancelChunkWorldKnowledge` — function — line 662
- `ChunkWorkerLike` — type — line 29
- `ChunkWorkerPool` — type — line 45
- `ChunkWorkerPoolOptions` — type — line 36
- `createChunkWorkerPool` — function — line 204
- `defaultChunkWorkerCount` — function — line 174
- `disposeChunkWorkerPool` — function — line 695
- `HeightmapGenerationCancelledError` — class — line 17
- `installChunkWorkerHydrology` — function — line 682
- `isChunkWorkerCancelledError` — function — line 24
- `requestChunkFarTile` — function — line 674
- `requestChunkGrass` — function — line 633
- `requestChunkHydrologyRows` — function — line 686
- `requestChunkMapTile` — function — line 666
- `requestChunkMesh` — function — line 644
- `requestChunkTile` — function — line 622
- `requestChunkWorldKnowledge` — function — line 655

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

- `buildDigContextualFindContext` — function — line 119
- `COASTAL_AMBER_CHANCE` — const — line 16
- `COASTAL_EXCEPTIONAL_SHELL_CHANCE` — const — line 15
  - domain: world-terrain Contextual shovel-find resolution (plan world-terrain-048) — repeatable low-probability material discovery during physical digging, separate from one-shot Hidden Finds.
- `DigContextualFindContext` — type — line 33
- `DigContextualFindEnv` — type — line 108
- `digContextualFindEnvFromChunkManager` — function — line 157
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

## `terrain/farTerrain.ts`

- `createFarTerrain` — function — line 103
  - domain: world-terrain
- `FAR_CANOPY_KEEP_CHUNKS` — const — line 26
- `FAR_FINE_RADIUS` — const — line 16
- `FAR_MASK_SIZE` — const — line 18
- `FarTerrain` — type — line 77
- `FarTerrainOptions` — type — line 65
- `FarTileCells` — type — line 38
- `FarTileWanted` — type — line 40
- `wantedFarTiles` — function — line 49
  - domain: world-terrain

## `terrain/farTerrainFlag.ts`

- `DEFAULT_FAR_TERRAIN_RADIUS` — const — line 2
- `farTerrainRadiusFromUrl` — function — line 24
- `MAX_FAR_TERRAIN_RADIUS` — const — line 4
- `MIN_FAR_TERRAIN_RADIUS` — const — line 3
- `parseFarTerrainFlag` — function — line 12
  - domain: world-terrain

## `terrain/farTile.ts`

- `buildFarTileIndices` — function — line 82
- `computeFarTile` — function — line 124
  - domain: world-terrain
- `FAR_CANOPY_FULL` — const — line 22
- `FAR_CANOPY_HEIGHT` — const — line 24
- `FAR_CANOPY_NOISE` — const — line 25
- `FAR_CANOPY_NOISE_CELL` — const — line 27
- `FAR_CANOPY_START` — const — line 21
- `FAR_SKIRT_DROP` — const — line 15
- `FAR_SURFACE_DROP` — const — line 18
- `FAR_TILE_CELLS_COARSE` — const — line 12
- `FAR_TILE_CELLS_FINE` — const — line 11
- `FAR_TILE_SIZE` — const — line 8
- `farGridVertexCount` — function — line 54
- `FarTileData` — type — line 40
- `FarTileRequest` — type — line 32
- `farTileVertexCount` — function — line 59
- `skirtSourceIndex` — function — line 68

## `terrain/farTileColor.ts`

- `classifyBiomeColor` — function — line 30
  - domain: world-terrain
- `isFarLake` — function — line 19

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

- `computeChunkGrass` — function — line 383
- `GRASS_SPECIES_ORDER` — const — line 32
- `GrassBucketData` — type — line 87
- `GrassChunkData` — type — line 103
- `GrassComputeMode` — type — line 85
- `GrassComputeParams` — type — line 46
- `grassLodCount` — function — line 109
- `GrassSpeciesId` — type — line 28
- `GrassTileGrids` — type — line 36
- `macroMeadowNoiseFor` — function — line 360
- `macroMeadowWeightAt` — function — line 376
  - domain: world-terrain

## `terrain/gridContour.ts`

- `CELL_RING` — const — line 12
  - domain: world-terrain
- `marchCellRing` — function — line 34
  - domain: world-terrain

## `terrain/landformDescriptors.ts`

- `buildLandformIndex` — function — line 65
- `EMPTY_LANDFORM_INDEX` — const — line 56
- `generateLandforms` — function — line 152
- `insideCraterAt` — function — line 312
- `LANDFORM_BUCKET_SIZE_M` — const — line 39
- `LANDFORM_MAX_PER_BUCKET` — const — line 43
- `LANDFORM_MAX_RADIUS_M` — const — line 41
- `landformCorrectionBypassAt` — function — line 297
- `LandformDescriptor` — type — line 25
- `LandformGenContext` — type — line 98
- `landformHeightDeltaAt` — function — line 242
- `LandformIndex` — type — line 45
- `landformIndexFor` — function — line 226
- `LandformKind` — type — line 23
- `landformRockAt` — function — line 277

## `terrain/macroClimate.ts`

- `ClimateOffsetAt` — type — line 296
- `climateOffsetC` — function — line 122
  - domain: world
- `createClimateOffsetAt` — function — line 304
  - domain: world
- `createMacroClimate` — function — line 177
- `lastMacroClimateBuildMs` — function — line 264
- `latitude01` — function — line 102
- `MACRO_CLIMATE_CELL_M` — const — line 19
  - domain: world-terrain
- `MACRO_CLIMATE_GRID_N` — const — line 22
- `MacroClimate` — type — line 63
- `macroClimateFrom` — function — line 127
- `macroClimateOf` — function — line 272
- `MacroClimateSample` — type — line 33
- `referenceTemperatureC` — function — line 112
- `runoffFrom` — function — line 57
- `runoffGrid` — function — line 223
- `temperatureAt` — function — line 107

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

- `dominantResourceNear` — function — line 287
- `NaturalResource` — type — line 50
- `RESOURCE_ROLE` — const — line 75
- `RESOURCE_TYPES` — const — line 46
- `resourceAttractionAt` — function — line 309
- `resourceById` — function — line 256
  - domain: settlements-npcs
- `ResourceEnv` — type — line 115
- `resourcesNear` — function — line 265
- `ResourceType` — type — line 34
- `SIGNIFICANT_RICHNESS` — const — line 69

## `terrain/rangeSpines.ts`

- `EMPTY_RANGE_SPINES` — const — line 190
- `generateRangeSpines` — function — line 330
- `RANGE_HOME_RESERVE_M` — const — line 117
- `RANGE_MAX_SPINES` — const — line 105
- `RANGE_SEGMENTS` — const — line 106
- `RangeBaseRelief` — type — line 98
- `RangePass` — type — line 40
- `RangePassCorridor` — type — line 26
- `RangeSpine` — type — line 61
- `RangeSpineSample` — type — line 86
- `RangeSpineSet` — type — line 83
- `RangeSummit` — type — line 52
- `sampleRangeSpines` — function — line 486
- `softCapSummitHeight` — function — line 184
- `SUMMIT_SOFT_CEILING_M` — const — line 181
- `SUMMIT_SOFT_KNEE_M` — const — line 180
- `unionWithSpine` — function — line 161
  - domain: world-terrain

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

- `canonicalWaterHeight` — function — line 175
- `computeRiverTile` — function — line 611
- `DEFAULT_RIVER_THRESHOLDS` — const — line 34
- `depthFromAccumulation` — function — line 159
- `exposedBankFromFlow` — function — line 145
- `flowFactor` — function — line 99
- `footprintOverlapsRiver` — function — line 343
- `isInsideRiverChannel` — function — line 330
- `MEANDER_NOISE_SEED_XOR` — const — line 523
- `meanderChainPointsWith` — function — line 527
- `nearestRiverBankDistance` — function — line 313
- `nearestRiverBankPoint` — function — line 360
- `nearestRiverHydrologyContext` — function — line 413
- `nearestRiverShoreCandidate` — function — line 463
- `overlappingRiverTiles` — function — line 61
- `RIVER_CELL_STEP` — const — line 20
- `RIVER_MEANDER_TAPER_DISTANCE` — const — line 522
- `RIVER_TILE_SIZE` — const — line 19
- `RiverChain` — type — line 75
- `riverChannelSegmentsNear` — function — line 202
- `RiverHydrologyContext` — type — line 403
- `RiverPoint` — type — line 74
- `RiverShoreCandidate` — type — line 455
- `RiverTileCoord` — type — line 40
- `riverTileCoordOf` — function — line 42
- `riverTileCoreRect` — function — line 53
- `riverTileKey` — function — line 46
- `RiverWaterSample` — type — line 270
- `riverWaterSampleAt` — function — line 281
- `smoothChainPoints` — function — line 590
- `StreamThresholds` — type — line 28
- `submergedDepthFromFlow` — function — line 150
- `widthFromAccumulation` — function — line 113
- `WorldRect` — type — line 50

## `terrain/riverQuery.ts`

- `createRiverQuery` — function — line 50
  - domain: terrain
- `RiverQuery` — type — line 28
  - domain: terrain
  - system: water
  - role: Analytic "what river geometry is around here" seam for *placement* code (settlement sites, village plots) that runs long before — and independently of — chunk streaming. Returns the same canonical `RiverChannelSegment[]` terrain carving and the water ribbon are built from (`riverChannelSegmentsNear`), so placement never reasons about rivers through a second, approximate representation.
  - integration: Deliberately separate from `riverTileCache.ts`: that cache is reference-counted against *loaded chunks* and evicts the moment no chunk holds a tile, which is the wrong lifetime for a query that has to answer for settlements far outside the loaded ring. This keeps its own small bounded map instead, at the cost of recomputing a tile the chunk cache may also hold. Both compute through the identical pure `computeRiverTile`, so the two can never disagree.

## `terrain/riverTileCache.ts`

- `createRiverTileCache` — function — line 45
- `RiverTileCache` — type — line 17
- `RiverTileCacheOptions` — type — line 36
- `RiverTileCacheStats` — type — line 26
- `riverTileStatsDelta` — function — line 102

## `terrain/roadBridge.ts`

- `bridgeDeckYAt` — function — line 72
- `isOnAnyBridgeDeck` — function — line 82
- `isOnBridgeDeck` — function — line 63
- `RoadBridgeSpec` — type — line 23
  - domain: world-terrain
  - system: roads
  - role: Bridge *projection* geometry — the plain-data `RoadBridgeSpec` an already-declared canonical `RoadRiverCrossing(kind = 'bridge')` (plan world-terrain-023) is turned into, plus the one oriented-footprint test every consumer shares (plan world-terrain-033). Mirrors `riverFord.ts`'s split: this module owns worker-safe type + pure query, `roadNetwork.ts` owns the settlement-layer projection (`bridgeSpecOf`) and bounded query (`bridgesNear`), same "terrain owns the shared shape, settlement produces it" seam `RoadCorridorSegment`/`FordProjection` already use.
  - integration: `terrain/chunkHeightmap.ts` reads isOnBridgeDeck to suppress road-height/tint shaping under an open span (never the river carve). `terrain/chunkManager.ts` reads the same test for bridge presentation ownership and the shared movement-ground query (`sampleBridgeDeck`/`sampleSurfaceGround`). No THREE.js, no route/crossing search — every bridge here is already decided.

## `terrain/rockPlateColor.ts`

- `applyRockPlateColor` — function — line 15

## `terrain/rockPlates.ts`

- `FACET_CELL_M` — const — line 17
- `PLATE_CELL_M` — const — line 15
  - domain: world-terrain
- `PLATE_MAX_DELTA_M` — const — line 19
- `RockPlate` — type — line 58
- `rockPlateAt` — function — line 73
- `rockPlateZoneOf` — function — line 54

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
- `grassSnowBury` — function — line 157
- `grassSnowCoverAt` — function — line 151
- `grassSnowFrost` — function — line 162
- `grassSnowVisible` — function — line 167
- `INTEGER_LATTICE_GLSL` — const — line 56
- `parseSnowParam` — function — line 175
- `SNOW_ALT_M` — const — line 22
- `SNOW_BIAS` — const — line 20
- `SNOW_COL` — const — line 30
- `SNOW_EDGE` — const — line 18
- `SNOW_FIELD_GLSL` — const — line 66
- `SNOW_GAIN` — const — line 14
  - domain: world-terrain
- `SNOW_ONSET` — const — line 16
- `snowCover` — function — line 119
- `snowLatticeHash` — function — line 45
- `snowNoise` — function — line 94
- `snowTerrainBias` — function — line 132
- `SnowTerrainBiasInput` — interface — line 124
- `snowThreshold` — function — line 110
- `terrainSnowCoverAt` — function — line 141

## `terrain/terrainClassification.ts`

- `isFloorBelowSea` — function — line 18
- `isMountainRidge` — function — line 26
- `isOceanMix` — function — line 22
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

- `FAR_FOG_NEAR_FRACTION` — const — line 52
- `farRingBaseFog` — function — line 61
  - domain: world-terrain
- `terrainVisualHorizon` — function — line 36
  - domain: world-terrain
- `TerrainVisualHorizon` — type — line 14
  - domain: world-terrain

## `terrain/testWindowHydrology.ts`

- `DEFAULT_HYDROLOGY_TEST_WINDOW` — const — line 11
- `HydrologyTestWindow` — type — line 8
- `withWindowHydrology` — function — line 18

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

## `terrain/worldEdge.ts`

- `clampToWorldBox` — function — line 27
- `isInsideWorldBox` — function — line 22
- `WORLD_EDGE_BAND` — const — line 13
- `WORLD_EDGE_BAND_START` — const — line 19
- `WORLD_EDGE_MAX_PUSH_SPEED` — const — line 16
- `worldEdgePushVelocity` — function — line 39

## `terrain/worldHydrology.ts`

- `ChainEnd` — const — line 128
- `ChainEndKind` — type — line 129
- `computeWorldHydrology` — function — line 697
- `DEFAULT_WORLD_HYDROLOGY_OPTIONS` — const — line 74
- `hashWorldHydrology` — function — line 1044
- `HydrologyLake` — type — line 140
- `PackedChains` — type — line 131
- `packSparseBlocks` — function — line 575
- `sampleRawFloorRows` — function — line 203
- `SparseBlocks` — type — line 120
- `sparseBlockValue` — function — line 618
- `WORLD_HYDROLOGY_GRID` — const — line 94
- `WORLD_HYDROLOGY_VERSION` — const — line 40
  - domain: world-terrain
- `WorldHydrology` — type — line 182
- `WorldHydrologyGrid` — type — line 101
- `worldHydrologyGridFor` — function — line 224
- `WorldHydrologyOptions` — type — line 42
- `WorldHydrologyStats` — type — line 153

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
- `ensureWorldHydrology` — function — line 95
- `EnsureWorldHydrologyOptions` — type — line 75
- `sampleRowsOnThisThread` — const — line 138
- `sampleWorldHydrologyFloor` — function — line 43
- `WORLD_HYDROLOGY_STRIPS` — const — line 37
- `WorldHydrologyFloorSampler` — type — line 34
- `WorldHydrologyInstallResult` — type — line 21
- `WorldHydrologyInstallSource` — type — line 19
  - domain: world-terrain

## `terrain/worldHydrologyStore.ts`

- `clearWorldHydrology` — function — line 43
- `hasWorldHydrology` — function — line 31
- `hydrologyCorrectionAt` — function — line 146
- `hydrologyLakeLevelAt` — function — line 207
- `installWorldHydrology` — function — line 27
- `isUnconditionedHydrologyId` — function — line 20
- `retainOnlyWorldHydrology` — function — line 53
- `SPARSE_BLOCK_SIZE` — const — line 14
  - domain: world-terrain
- `StreamHead` — type — line 223
- `streamHeadsFor` — function — line 232
- `UNCONDITIONED_HYDROLOGY_ID` — const — line 17
- `unpackChains` — function — line 251
- `worldHydrologyFor` — function — line 36

## `terrain/worldKnowledgeScan.ts`

- `chunkParamsForWorldKnowledgeScan` — function — line 207
  - domain: world-terrain
- `prepareWorldKnowledgeScan` — function — line 141
  - domain: world-terrain
- `scanWorldKnowledge` — function — line 291
  - domain: world-terrain
- `WORLD_KNOWLEDGE_MAX_NEARBY_HITS` — const — line 29
- `WorldKnowledgeChunkGather` — type — line 85
- `worldKnowledgeGatherFor` — function — line 191
- `WorldKnowledgeQueryKind` — type — line 31
- `worldKnowledgeRoadContext` — function — line 118
  - domain: world-terrain
- `WorldKnowledgeScanHit` — type — line 72
- `WorldKnowledgeScanResult` — type — line 80
- `WorldKnowledgeTerrainSnapshot` — type — line 38
  - domain: world-terrain
- `WorldKnowledgeWorkerParams` — type — line 61

## `terrain/worleyNoise.ts`

- `roundCrease` — function — line 45
  - domain: world-terrain
- `worleyRidge` — function — line 64
- `WorleyRidgeResult` — type — line 3

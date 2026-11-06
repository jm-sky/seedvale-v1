# Symbols

Generated from exported TypeScript symbols.

## `settlement/animalCorpseSanitation.ts`

- `AnimalCorpseCleanupCandidate` — type — line 41
- `animalCorpseCleanupHandle` — function — line 174
- `AnimalCorpseCleanupHandle` — type — line 54
- `AnimalCorpseCleanupRejection` — type — line 80
- `AnimalCorpseView` — type — line 26
- `animalCorpseViewFromAgent` — function — line 157
- `collectAnimalCorpseCleanupCandidates` — function — line 132
- `HouseholdAnchor` — type — line 13
  - domain: settlements-npcs
- `isInsideSettlementInfluence` — function — line 90
- `resolveAnimalCorpseCleanupHandle` — function — line 195
- `resolveResponsibleHousehold` — function — line 105
- `SettlementCorpseCleanupHooks` — type — line 73
- `SettlementInfluence` — type — line 19

## `settlement/artisanCraft.ts`

- `artisanCanCraft` — function — line 64
- `ArtisanCraftDecision` — type — line 13
- `artisanMaterialDepositValue` — function — line 77
  - domain: settlements-npcs
- `artisanOutputKind` — function — line 145
- `MissingArtisanMaterial` — type — line 88
- `missingArtisanMaterials` — function — line 95
- `resolveArtisanCraft` — function — line 38
  - domain: settlements-npcs
- `resolveArtisanCraftedQuality` — function — line 133
  - domain: settlements-npcs

## `settlement/artisanOrders.ts`

- `acceptArtisanOrder` — function — line 133
  - domain: settlements-npcs
- `AcceptArtisanOrderResult` — type — line 111
- `ArtisanOrderCatalog` — type — line 51
- `ArtisanOrderCatalogEntry` — type — line 41
  - domain: settlements-npcs
- `artisanOrderRecipes` — function — line 58
- `completeArtisanOrder` — function — line 203
  - domain: settlements-npcs
- `CompleteArtisanOrderResult` — type — line 194
- `listArtisanOrderCatalog` — function — line 75
- `nextCompletableArtisanOrder` — function — line 299
- `pickupArtisanOrder` — function — line 266
  - domain: settlements-npcs
- `PickupArtisanOrderResult` — type — line 257
- `reservedArtisanOutputIds` — function — line 62

## `settlement/artisanProfile.ts`

- `ARTISAN_SKILL_MAX` — const — line 28
- `ARTISAN_SKILL_MIN` — const — line 27
- `ARTISAN_SPECIALIZATION_BONUS` — const — line 26
- `ARTISAN_SPECIALIZATIONS` — const — line 19
- `ArtisanGenerationContext` — type — line 101
- `ArtisanOrder` — type — line 65
  - domain: settlements-npcs
- `ArtisanOrderMaterial` — type — line 52
- `ArtisanOrderStatus` — type — line 45
- `ArtisanProfile` — type — line 37
  - domain: settlements-npcs
- `ArtisanSpecialization` — type — line 17
  - domain: settlements-npcs
- `cloneArtisanOrders` — function — line 360
- `cloneArtisanProfile` — function — line 350
- `effectiveArtisanSkill` — function — line 340
  - domain: settlements-npcs
- `generateArtisanBaseSkill` — function — line 153
  - domain: settlements-npcs
- `isArtisanOrderStatus` — function — line 401
- `isArtisanSpecialization` — function — line 397
- `listSettlementBlacksmiths` — function — line 202
  - domain: settlements-npcs
- `noteArtisanProductionCompleted` — function — line 389
  - domain: settlements-npcs
- `resolveArtisanProfile` — function — line 296
  - domain: settlements-npcs
- `seedArtisanProfileIfNeeded` — function — line 374
  - domain: settlements-npcs
- `SettlementBlacksmithRef` — type — line 192

## `settlement/authoredRepairTargets.ts`

- `AuthoredRepairPresentationInput` — type — line 18
  - domain: settlements
- `AuthoredRepairStructureIds` — type — line 60
  - domain: settlements
- `CommunalFenceTarget` — type — line 30
- `resolveAuthoredRepairStructureIds` — function — line 70
- `resolveCommunalFenceTarget` — function — line 44
  - domain: settlements

## `settlement/blacksmithYard.ts`

- `blacksmithYardGeometry` — function — line 35
- `BlacksmithYardGeometry` — type — line 24

## `settlement/campfireProps.ts`

- `CampfireBodyKind` — type — line 13
- `CampfireFlame` — type — line 253
- `createCampfire` — function — line 237
- `createCampfireBody` — function — line 228
- `createCampfireFlame` — function — line 268
- `createGrateVisual` — function — line 328
- `createLitCampfireVisual` — function — line 312
- `createSimpleFireBase` — function — line 244
- `preloadCampfireTemplates` — function — line 53

## `settlement/cemeteryFit.ts`

- `CEMETERY_CHUNK_EDGE_MARGIN` — const — line 23
- `CEMETERY_CLEARING_PAD` — const — line 32
- `cemeteryFitsOwnerChunk` — function — line 52
- `CemeteryGround` — type — line 35
- `cemeteryGroundFits` — function — line 113
- `CemeteryPlotPose` — type — line 42
- `projectIntoOwnerChunk` — function — line 70
- `rotatedPlotHalfExtents` — function — line 45

## `settlement/cemeteryLayout.ts`

- `CEMETERY_PIECE_HALF_EXTENTS` — const — line 69
- `cemeteryCounts` — function — line 132
- `cemeteryCryptLayout` — function — line 170
- `CemeteryCryptPose` — type — line 90
- `cemeteryGraveLayout` — function — line 138
- `CemeteryGraveSlot` — type — line 78
- `cemeteryLocalToWorld` — function — line 226
- `CemeteryMarkerPieceId` — type — line 66
- `CemeteryObb` — type — line 236
- `cemeteryObbColliders` — function — line 244
- `CemeteryPieceId` — type — line 65
- `cemeteryPlotDistanceToPoint` — function — line 285
- `cemeteryPlotDistanceToSegment` — function — line 303
- `cemeteryPlotExtents` — function — line 120
- `cemeteryPlotRadius` — function — line 126
- `CemeterySize` — type — line 17
- `cemeterySizeForServedSizes` — function — line 22
- `hash01` — function — line 103
- `isAbandonedCemeteryLandmarkId` — function — line 220
- `pickCemeteryMarkerPiece` — function — line 208

## `settlement/cemeteryMesh.ts`

- `buildMergedCemeteryMesh` — function — line 31
- `CemeteryPieceInstance` — type — line 13

## `settlement/cemeteryPack.ts`

- `CemeteryPieceData` — type — line 14
- `CemeteryPiecePack` — type — line 21
- `loadCemeteryPack` — function — line 110
- `peekCemeteryPack` — function — line 135

## `settlement/cemeteryReservation.ts`

- `CEMETERY_LANE_ID` — const — line 43
- `CEMETERY_PLOT_ID` — const — line 40
- `CemeteryReservationPose` — type — line 45
- `DEFAULT_RESERVATION_CHUNK_SIZE` — const — line 37
- `planCemeteryReservation` — function — line 74
- `settlementReservesCemetery` — function — line 56

## `settlement/createSettlement.ts`

- `AcquiredSettlementResources` — type — line 562
- `collectAgentBatch` — function — line 585
  - domain: settlements
- `createSettlement` — function — line 612
  - domain: settlements
- `CreateSettlementDeps` — type — line 338
- `Settlement` — type — line 182
- `settlementSpawnPoint` — function — line 326

## `settlement/decorProps.ts`

- `createBush` — function — line 113
- `createCactus` — function — line 161
- `createCaveMouth` — function — line 901
- `createCemetery` — function — line 820
- `createCobblePlate` — function — line 195
- `createExpeditionRuins` — function — line 719
- `createFallenLog` — function — line 503
- `createFelledTree` — function — line 100
- `createFern` — function — line 180
- `createGraveStone` — function — line 786
- `createLargeRock` — function — line 426
- `createLilyPad` — function — line 226
- `createLimbedTree` — function — line 71
- `createMonolith` — function — line 536
- `createReed` — function — line 208
- `createRockCluster` — function — line 463
- `createSeaweed` — function — line 241
- `createSmallRuins` — function — line 644
- `createStoneCircle` — function — line 599
- `createThicket` — function — line 131
- `createTree` — function — line 28
- `createTreeStump` — function — line 50
- `LargeRockPalette` — type — line 258
- `TerrainPlacementContext` — type — line 21

## `settlement/families.ts`

- `cobbleCountForSize` — function — line 133
- `ensureSettlementElder` — function — line 548
  - domain: settlements-npcs
- `FamilyDef` — type — line 163
- `FamilyMember` — type — line 146
- `FamilyMemberRef` — type — line 172
- `FamilyRelation` — type — line 144
- `generateFamilies` — function — line 466
- `HOME_ELDER_FAMILY_ID` — const — line 502
- `maxRolledVillageSize` — function — line 209
- `minRolledVillageSize` — function — line 217
- `RolledVillageSize` — type — line 19
- `rolledVillageSizeRank` — function — line 204
- `rollVillageSize` — function — line 240
- `VILLAGE_SIZE_CONFIG` — const — line 65
- `VillageSize` — type — line 16
- `villageSizeConfig` — function — line 118
- `VillageSizeConfig` — type — line 23

## `settlement/findSettlementSite.ts`

- `DEFAULT_SITE_SEARCH_MARGIN` — const — line 55
- `findSettlementSite` — function — line 176
- `SettlementFootprintHint` — type — line 18
- `SettlementSite` — type — line 7
- `SITE_RIVER_CLEARANCE` — const — line 63
- `SITE_SCORE_WEIGHTS` — const — line 31
- `SITE_STREAM_HEAD_CLEARANCE` — const — line 66

## `settlement/foundedSettlement.ts`

- `createFoundedSettlementRegistry` — function — line 134
- `foundedHomePlaceId` — function — line 58
  - domain: settlements
- `FoundedHomeTentLookup` — type — line 66
- `foundedHouseholdId` — function — line 38
- `foundedSettlementId` — function — line 33
  - domain: settlements
- `FoundedSettlementRecord` — type — line 15
  - domain: settlements
- `FoundedSettlementRegistry` — type — line 116
  - domain: settlements
  - system: founded-settlement
  - role: Owns founded-settlement records and NPC settlement-residency overrides.
  - owns: FoundedSettlementRecord
- `FoundedSettlementRegistrySnapshot` — type — line 99
- `foundedTentId` — function — line 43
- `resolveFoundedHomePlace` — function — line 80
  - domain: settlements

## `settlement/foundedSettlementBootstrap.ts`

- `bootstrapFoundedSettlement` — function — line 203
  - domain: settlements
  - system: founded-settlement
  - role: Turns an arrived expedition into ordinary founded-settlement/household/economy state.
- `BootstrapFoundedSettlementDeps` — type — line 86
- `BootstrapFoundedSettlementFailureReason` — type — line 36
- `BootstrapFoundedSettlementInconsistencyReason` — type — line 48
- `BootstrapFoundedSettlementInput` — type — line 19
- `BootstrapFoundedSettlementResult` — type — line 57
- `FoundedCampPlacement` — type — line 124
- `FoundedSettlementTentsDeps` — type — line 67
- `resolveFoundedCampLayout` — function — line 141
  - domain: settlements

## `settlement/frameYield.ts`

- `createPropYieldGate` — function — line 22

## `settlement/gardenScale.ts`

- `GARDEN_BED_D` — const — line 62
- `GARDEN_BED_GAP` — const — line 63
- `GARDEN_BED_W` — const — line 61
- `GARDEN_PLAZA_GAP` — const — line 46
- `gardenBedCount` — function — line 69
- `gardenClearingRadius` — function — line 81
- `gardenPlazaMinCenterDist` — function — line 52
- `gardenPlotRadius` — function — line 34
- `GardenScale` — type — line 2
- `gardenUnitsFromHouses` — function — line 5
- `packGardenScales` — function — line 15

## `settlement/hiddenTreasure.ts`

- `HIDDEN_TREASURE_DIG_TOLERANCE` — const — line 19
- `HIDDEN_TREASURE_MARKER_COUNT` — const — line 10
- `HiddenTreasureAnchorSource` — type — line 45
- `hiddenTreasureDigHit` — function — line 76
- `hiddenTreasureMarkerPositions` — function — line 54

## `settlement/homeAuthoredResidents.ts`

- `applyHomeAuthoredIdentities` — function — line 230
  - domain: settlements-npcs
- `createHomeElderFamily` — function — line 49
  - domain: settlements-npcs
- `HOME_ELDER_AGE` — const — line 14
- `HOME_ELDER_LAST_NAME` — const — line 13
- `HOME_HUNTER_FALLBACK_FAMILY_ID` — const — line 25
- `HOME_REEVE_FALLBACK_FAMILY_ID` — const — line 18
- `HOME_SHEPHERD_FALLBACK_FAMILY_ID` — const — line 30
- `isHomeElderFamily` — function — line 38
  - domain: settlements-npcs

## `settlement/horseAcquisition.ts`

- `getHorseAcquisitionState` — function — line 61
  - domain: quests-progression Single derived view over live animal state + quest reservation.
- `HorseAcquisitionState` — type — line 16
- `horseOfferStatusHint` — function — line 79
- `isVendorHorseAnimalId` — function — line 26
- `isVendorHorseSaleEligible` — function — line 47
  - domain: settlements
- `listVendorHorseAnimals` — function — line 101
  - domain: settlements
- `MERCHANT_HORSE_PRICE` — const — line 11
- `merchantHorseAnimalId` — function — line 20
- `resolveMerchantHorseAnimal` — function — line 33
  - domain: fauna Resolves the merchant horse acquisition target for `settlementId`.
- `vendorHorseOfferLabel` — function — line 84
- `vendorHorseOfferPrice` — function — line 91

## `settlement/houseBuilder.ts`

- `applyHouseShadowSide` — function — line 387
- `buildAssemblyCollidersWorld` — function — line 694
- `buildHouse` — function — line 756
- `buildHouseCollidersWorld` — function — line 679
- `buildHouseDoorCollidersLocal` — function — line 622
- `BuildHouseOptions` — type — line 312
- `buildHouseWallCollidersLocal` — function — line 588
- `censusAssembly` — function — line 455
- `cornerLocalPosition` — function — line 218
- `createHouseStaticBatch` — function — line 914
- `DOOR_1_FLAT_HINGE_OFFSET_X` — const — line 41
- `DOOR_ANIM_SPEED` — const — line 43
- `DOOR_OPEN_ANGLE` — const — line 42
- `doorLeafColliderLocal` — function — line 606
- `doorWallKeys` — function — line 546
- `fillOffsetFor` — function — line 400
- `floorTilePositions` — function — line 230
- `HOUSE_ASSEMBLY_SCALE` — const — line 45
- `HOUSE_DOOR_OPENING_HALF_WIDTH_M` — const — line 69
- `HOUSE_WALL_LENGTH_M` — const — line 54
- `HOUSE_WALL_THICKNESS_M` — const — line 55
- `HouseAssembly` — type — line 150
- `HouseAssemblyCensus` — type — line 142
- `HouseBuildContext` — type — line 127
- `houseDefinitionAssetIds` — function — line 321
- `houseDefinitionAssetIdsForStage` — function — line 325
- `HouseDoor` — type — line 133
- `houseFootprintRadius` — function — line 251
- `HouseLocalPose` — type — line 112
- `HousePartPrimitive` — type — line 119
- `HouseStaticBatch` — type — line 165
- `HouseVisualStage` — type — line 310
- `loadHousePartTemplates` — function — line 360
- `matchingWallPlacement` — function — line 256
- `openingLocalPose` — function — line 281
- `resolveRoofParts` — function — line 294
- `transformHouseCollidersToWorld` — function — line 649
- `WALL_HALF_DEPTH` — const — line 57
- `WALL_HALF_WIDTH` — const — line 56
- `WALL_YAW` — const — line 91
- `wallLocalTransform` — function — line 197
- `wallModuleKey` — function — line 542
- `wallModulePose` — function — line 270
- `wallTopY` — function — line 285

## `settlement/houseCatalog.ts`

- `DEFAULT_TARGET_DOOR_HEIGHT` — const — line 72
- `HOME_HOUSE_CATALOG` — const — line 204
- `homeHouseEntryAt` — function — line 218
- `HOUSE_CATALOG` — const — line 80
- `HOUSE_FLOOR_LAMP_Y` — const — line 78
- `HOUSE_LAMP_MAX_LOCAL_Y` — const — line 75
- `houseCatalogById` — function — line 214
- `HouseCatalogEntry` — type — line 25
- `HouseLampMount` — type — line 23
- `HouseLampStyle` — type — line 21
- `HouseRole` — type — line 18
- `pickHomeHouse` — function — line 233
- `resolveHouseHeight` — function — line 207

## `settlement/houseDoors.ts`

- `createHouseDoorController` — function — line 57
- `HOUSE_DOOR_CLOSE_DISTANCE` — const — line 18
- `HOUSE_DOOR_OPEN_DISTANCE` — const — line 17
  - domain: settlements
  - system: house-doors
  - role: Owns per-house door proximity hysteresis and change detection.
- `HouseDoorController` — type — line 37
- `shouldOpenHouseDoors` — function — line 23

## `settlement/household.ts`

- `createHousehold` — function — line 411
- `createHouseholdRegistry` — function — line 655
- `FARMER_STARTING_SEED_COUNT` — const — line 292
- `HayForageState` — type — line 129
- `Household` — type — line 295
- `HOUSEHOLD_WOOD_RESERVE_TARGET` — const — line 99
- `HouseholdAgricultureState` — type — line 218
- `HouseholdDepositResult` — type — line 38
- `HouseholdId` — type — line 33
  - domain: settlements-npcs
  - system: household
  - role: Owns one family's own food/wood/water stock, between NPC carrying and `SettlementEconomy`.
  - owns: Household
  - uses: SettlementEconomy
- `householdIdFor` — function — line 377
- `HouseholdRegistry` — type — line 620
- `HouseholdResourceKind` — type — line 56
- `HouseholdSnapshot` — type — line 230
- `HouseholdStartingContext` — type — line 274
- `HouseholdTradeStockContext` — type — line 257
  - domain: settlements-npcs
- `resolveHayForage` — function — line 145
- `WaterReserve` — type — line 160

## `settlement/householdExchange.ts`

- `createHouseholdExchangeHooks` — function — line 79
- `HouseholdExchangeHooks` — type — line 62
- `HouseholdSurplusCandidate` — type — line 12
- `HouseholdSurplusLookup` — type — line 24
- `selectHouseholdSurplusSource` — function — line 36

## `settlement/householdProfessionStock.ts`

- `applyProfessionTradeStock` — function — line 377
  - domain: settlements-npcs
- `BLACKSMITH_TRADE_PAULDRON_COUNT` — const — line 32
- `BLACKSMITH_TRADE_SWORD_COUNT` — const — line 31
- `FARMER_TRADE_TOOL_COUNT` — const — line 30
- `householdStartingContextFromFamily` — function — line 337
  - domain: settlements-npcs
- `HUNTER_STARTER_DRIED_MEAT` — const — line 36
- `HUNTER_STARTER_HERB` — const — line 37
- `HUNTER_STARTER_TRADE_ARROWS` — const — line 35
- `HUNTER_STARTER_TRADE_SHORT_BOWS` — const — line 29
- `resolveProfessionStarterGrants` — function — line 315
  - domain: settlements-npcs
- `StarterGrant` — type — line 39
- `WOODCUTTER_TRADE_AXE_COUNT` — const — line 28
  - domain: settlements-npcs

## `settlement/householdResourceTransfer.ts`

- `HouseholdTransferRequest` — type — line 23
- `HouseholdTransferResult` — type — line 27
- `householdTransferSummary` — function — line 57
- `transferableHouseholdItemKinds` — function — line 46
- `transferResourceToHousehold` — function — line 70

## `settlement/householdWells.ts`

- `minimumHouseholdWellCount` — function — line 21
  - domain: settlements-npcs
- `resolveNearestWaterWellTarget` — function — line 98
  - domain: settlements-npcs
- `selectHouseholdWellFamilyIndices` — function — line 35
  - domain: settlements-npcs
- `SettlementWellSource` — type — line 80
- `WaterWellTarget` — type — line 85

## `settlement/householdWood.ts`

- `applyWoodItemBatch` — function — line 77
- `claimableWoodSurplusValue` — function — line 70
- `HOUSEHOLD_WOOD_ITEM_KINDS` — const — line 13
  - domain: settlements-npcs
- `householdWoodCountFromItems` — function — line 23
- `HouseholdWoodItemBatch` — type — line 32
- `HouseholdWoodItemKind` — type — line 15
- `householdWoodItemValue` — function — line 18
- `selectClaimableWoodItems` — function — line 39

## `settlement/householdYard.ts`

- `HouseholdYardFenceSegment` — type — line 183
- `householdYardFenceSegmentId` — function — line 186
- `householdYardFenceSegments` — function — line 197
- `HouseholdYardPlan` — type — line 53
- `householdYardPlanFor` — function — line 113
- `houseLocalToWorld` — function — line 87
- `HouseYardFootprint` — type — line 20
- `PlanDisc` — type — line 76
- `pointInYard` — function — line 168
- `worldToYardLocal` — function — line 158
- `YARD_BACK_GAP` — const — line 25
- `YARD_DEPTH` — const — line 39
- `YARD_GATE_WIDTH` — const — line 35
- `YARD_PROFESSION_INSET` — const — line 33
- `YARD_PROFESSION_SIZE` — const — line 31
- `YARD_PROP_ROW_DEPTH` — const — line 27
- `YARD_PROP_SPACING` — const — line 29
- `YARD_SIDE_OVERHANG` — const — line 23
- `yardDisc` — function — line 178
- `YardPoint` — type — line 50
- `YardSlotName` — type — line 47
- `yawFacing` — function — line 103

## `settlement/houseLighting.ts`

- `createHouseLight` — function — line 239
- `createProceduralTorchPost` — function — line 288
- `createVillageTorchLight` — function — line 309
- `HouseLight` — type — line 68
- `lanternGlassCenter` — function — line 130
- `ResolvedHouseLampMount` — type — line 454
- `resolveHouseLampMount` — function — line 496
- `VillageTorch` — type — line 74

## `settlement/landmarkProps.ts`

- `createLandmarkProp` — function — line 152
- `isLandmarkGlbKind` — function — line 146
- `preloadLandmarkTemplates` — function — line 127

## `settlement/landOwnership.ts`

- `createLandOwnershipRegistry` — function — line 22
- `LandOwnershipRegistry` — type — line 9
- `landPlotKey` — function — line 18

## `settlement/landPurchase.ts`

- `LandPurchaseResult` — type — line 5
- `LandPurchaseTarget` — type — line 16
- `purchaseLandPlot` — function — line 29

## `settlement/livestock.ts`

- `attachToDetached` — function — line 984
- `createLivestockRegistry` — function — line 345
- `detachMerchantPackAnimal` — function — line 1074
  - domain: settlements-npcs
- `disposeLivestock` — function — line 1143
- `fillShepherdFlockKinds` — function — line 49
- `isPlayerOwnedLivestockRecord` — function — line 106
- `LIVESTOCK_KINDS` — const — line 82
- `LIVESTOCK_URLS` — const — line 66
- `LivestockPersistence` — type — line 165
- `livestockRecordMatchesHouseholdSlot` — function — line 130
- `LivestockRegistry` — type — line 187
- `LivestockSaveRecord` — type — line 96
- `livestockStrayCandidateFromAgent` — function — line 143
- `originOfDetachedAnimal` — function — line 973
- `PackAnimalCandidate` — type — line 1013
- `PackAnimalJourneyHooks` — type — line 1019
- `PersistentLivestockContext` — type — line 906
- `persistentLivestockKey` — function — line 892
- `PersistentLivestockRef` — type — line 884
- `resolveLivePersistentAnimal` — function — line 941
- `resolveLivePersistentAnimalByRef` — function — line 918
- `resolveMerchantPackAnimalCandidate` — function — line 1040
  - domain: settlements-npcs
- `restoreDetachedMerchantPackAnimals` — function — line 1124
- `restoreDetachedPlayerOwnedLivestock` — function — line 1100
- `setOwnedAnimalControl` — function — line 1088
- `shouldSpawnDeterministicLivestockSlot` — function — line 115
  - domain: fauna
  - role: Household rolls and merchant-horse slots skip tombstones and player-owned records restored on the detached path (fauna-020 / fauna-030).
- `spawnAnimalFromRecord` — function — line 236
- `SpawnAnimalFromRecordDeps` — type — line 220
- `spawnLivestock` — function — line 621
- `tickSettlementLivestock` — function — line 1160
- `transferAnimalOwnership` — function — line 991

## `settlement/lodging.ts`

- `advanceLodgingProgress` — function — line 99
  - domain: ui-input Advances the lodging-walk stuck watchdog by one frame — a meaningful distance improvement resets the timer, otherwise `dt` accumulates until `LODGING_STUCK_TIMEOUT_SEC` is reached. Pure and frame-count-independent (driven by `dt`, not calls) so it can be unit-tested without a running game loop or a `PlayerActionContext` mock.
- `GUARD_PAID_LODGING_PRICE` — const — line 81
- `hayLodgingId` — function — line 162
- `initialLodgingProgress` — function — line 89
- `LODGING_ARRIVE_TOLERANCE` — const — line 65
- `LODGING_STUCK_PROGRESS_EPSILON` — const — line 71
- `LODGING_STUCK_TIMEOUT_SEC` — const — line 77
- `lodgingChoiceLabel` — function — line 150
- `LodgingOption` — type — line 16
- `lodgingPlaceLabel` — function — line 119
- `LodgingProgress` — type — line 87
- `LodgingQuality` — type — line 14
- `lodgingRequiresPayment` — function — line 128
- `lodgingRestQuality` — function — line 57
- `LodgingType` — type — line 12

## `settlement/lodgingResolver.ts`

- `collectLodgingCandidates` — function — line 243
- `collectOwnedHouseLodgingOptions` — function — line 260
- `LodgingCandidateContext` — type — line 235
- `LodgingSelection` — type — line 364
- `LodgingSettlementInput` — type — line 32
- `resolveBestLodging` — function — line 329
- `selectLodgingFromCandidates` — function — line 378
- `settlementLodgingInput` — function — line 74

## `settlement/lostTreasureChroniclesArchaeologistResident.ts`

- `createLostTreasureArchaeologistFamily` — function — line 54
  - domain: settlements-npcs
- `findLostTreasureArchaeologistResident` — function — line 127
  - domain: settlements-npcs
- `findLostTreasureChroniclesArchaeologistSettlement` — function — line 150
  - domain: settlements-npcs
- `isLostTreasureArchaeologistFamily` — function — line 44
  - domain: settlements-npcs
- `LOST_TREASURE_ARCHAEOLOGIST_AGE` — const — line 16
- `LOST_TREASURE_ARCHAEOLOGIST_FAMILY_ID` — const — line 12
- `LOST_TREASURE_ARCHAEOLOGIST_GIVEN_NAME` — const — line 14
- `LOST_TREASURE_ARCHAEOLOGIST_LAST_NAME` — const — line 15
- `LOST_TREASURE_ARCHAEOLOGIST_SETTLEMENT_SEARCH_RADIUS` — const — line 20
- `LostTreasureArchaeologistSettlementCandidate` — type — line 30
  - domain: settlements-npcs
- `selectLostTreasureChroniclesArchaeologistSettlement` — function — line 90
  - domain: settlements-npcs

## `settlement/lostTreasureChroniclesElderResident.ts`

- `appendAuthoredResidentFamilies` — function — line 64
  - domain: settlements-npcs
- `appendAuthoredResidentFamily` — function — line 51
  - domain: settlements-npcs
- `createLostTreasureElderFamily` — function — line 79
  - domain: settlements-npcs
- `isLostTreasureElderFamily` — function — line 41
  - domain: settlements-npcs
- `LOST_TREASURE_ELDER_AGE` — const — line 13
- `LOST_TREASURE_ELDER_FAMILY_ID` — const — line 10
- `LOST_TREASURE_ELDER_GIVEN_NAME` — const — line 12
- `LOST_TREASURE_ELDER_SETTLEMENT_SEARCH_RADIUS` — const — line 16
- `LostTreasureElderSettlementCandidate` — type — line 26
  - domain: settlements-npcs
- `selectLostTreasureChroniclesElderSettlement` — function — line 112
  - domain: settlements-npcs

## `settlement/lostTreasureChroniclesSpecialistResident.ts`

- `createLostTreasureSpecialistFamily` — function — line 52
  - domain: settlements-npcs
- `findLostTreasureChroniclesSpecialistSettlement` — function — line 148
  - domain: settlements-npcs
- `findLostTreasureSpecialistResident` — function — line 125
  - domain: settlements-npcs
- `isLostTreasureSpecialistFamily` — function — line 42
  - domain: settlements-npcs
- `LOST_TREASURE_SPECIALIST_AGE` — const — line 14
- `LOST_TREASURE_SPECIALIST_FAMILY_ID` — const — line 10
- `LOST_TREASURE_SPECIALIST_GIVEN_NAME` — const — line 12
- `LOST_TREASURE_SPECIALIST_LAST_NAME` — const — line 13
- `LOST_TREASURE_SPECIALIST_SETTLEMENT_SEARCH_RADIUS` — const — line 18
- `LostTreasureSpecialistSettlementCandidate` — type — line 28
  - domain: settlements-npcs
- `selectLostTreasureChroniclesSpecialistSettlement` — function — line 95
  - domain: settlements-npcs

## `settlement/merchantJourney.ts`

- `advanceMerchantJourneyToVisiting` — function — line 71
  - domain: settlements-npcs
- `cloneMerchantJourney` — function — line 39
- `isNpcAwayOnMerchantJourney` — function — line 59
- `MerchantJourneyHost` — type — line 49
- `MerchantJourneyPhase` — type — line 16
  - domain: settlements-npcs
- `MerchantJourneyState` — type — line 18
- `MerchantReturnPoints` — type — line 92
- `resolveMerchantReturnArrival` — function — line 142
  - domain: settlements-npcs
- `TRAVELLING_MERCHANT_VISIT_DAYS` — const — line 37
- `tryBeginMerchantReturn` — function — line 107
  - domain: settlements-npcs

## `settlement/merchantTrade.ts`

- `generateMerchantAssortment` — function — line 484
- `HOME_STARTER_MERCHANT_KINDS` — const — line 96
- `horseVendorNpcId` — function — line 265
- `isPremiumMerchantGood` — function — line 196
- `MERCHANT_ARMOR_QUALITY_WEIGHTS` — const — line 579
- `MERCHANT_SPECIALIZATIONS` — const — line 42
- `MerchantArmorQualityContext` — type — line 589
- `MerchantAssortmentContext` — type — line 56
- `MerchantProfile` — type — line 50
- `merchantProfileFor` — function — line 256
- `MerchantSpecialization` — type — line 35
  - domain: settlements
- `merchantStockQuantity` — function — line 574
- `PREMIUM_MERCHANT_KINDS` — const — line 69
- `premiumAvailabilityChance` — function — line 201
- `resolveMerchantArmorQuality` — function — line 624
  - domain: settlements
- `resolveMerchantProfiles` — function — line 237
  - domain: settlements
- `resolvePremiumMerchantAssignment` — function — line 410
  - domain: settlements
- `seedMerchantStockIfNeeded` — function — line 648
- `settlementHasPremiumOffer` — function — line 398
- `specializationAffinity` — function — line 301

## `settlement/merchantWagon.ts`

- `MERCHANT_HORSE_RADIUS` — const — line 21
- `MERCHANT_STALL_RADIUS` — const — line 23
- `MERCHANT_WAGON_HORSE_DIST` — const — line 19
- `MERCHANT_WAGON_PREFERRED_YAW` — const — line 17
- `MERCHANT_WAGON_RADIUS` — const — line 20
- `MERCHANT_WAGON_STALL_DIST` — const — line 18
- `MerchantWagonPose` — type — line 8
- `pickMerchantWagonPose` — function — line 65
- `WagonObstacle` — type — line 6

## `settlement/minorLocations.ts`

- `clearMinorLocationCaches` — function — line 69
- `findDockLocation` — function — line 26
- `MinorLocation` — type — line 5
- `minorLocationsFor` — function — line 77

## `settlement/npcIdentity.ts`

- `flattenedSettlementMembers` — function — line 23
  - domain: settlements-npcs
- `resolveSettlementNpcHomeDescriptor` — function — line 88
  - domain: settlements-npcs
- `settlementMemberPhysicalSeed` — function — line 55
- `SettlementNpcDescriptor` — type — line 30
- `settlementNpcDescriptors` — function — line 42
  - domain: settlements-npcs
- `SettlementNpcHomeDescriptor` — type — line 71
- `settlementNpcId` — function — line 13
  - domain: settlements-npcs
- `settlementNpcMemberIndex` — function — line 62
- `TravellingVisitorSpawn` — type — line 116

## `settlement/npcPhysicalProfile.ts`

- `ageMultiplierForAge` — function — line 80
- `agilityAgePotentialForAge` — function — line 257
- `clampAge` — function — line 42
- `generatePhysicalProfile` — function — line 361
- `LifeStage` — type — line 17
- `lifeStageForAge` — function — line 46
- `NPC_AGE_MAX` — const — line 15
- `NPC_AGE_MIN` — const — line 14
- `PhysicalProfile` — type — line 328
- `resolveHumanAgilityProfile` — function — line 271
- `resolveHumanEnduranceProfile` — function — line 308
- `resolveHumanStrengthProfile` — function — line 296
- `strengthAgePotentialForAge` — function — line 208

## `settlement/npcPostDeath.ts`

- `canLootNpcCorpse` — function — line 210
- `claimNpcCorpseForBurial` — function — line 149
- `cloneNpcCorpseLoot` — function — line 68
- `cloneNpcPostDeath` — function — line 72
- `commitNpcDeath` — function — line 243
- `corpseLootInventory` — function — line 217
- `createActiveNpcPostDeath` — function — line 105
- `createEmptyNpcCorpseLoot` — function — line 86
- `createLegacyTerminalNpcPostDeath` — function — line 92
- `dropNpcCorpseLoot` — function — line 301
- `EMPTY_NPC_CORPSE_LOOT` — const — line 63
- `finalizeExpiredNpcCorpse` — function — line 321
- `FinalizeNpcBurialResult` — type — line 189
- `finalizeNpcCorpseBurial` — function — line 193
- `hasActiveNpcCorpse` — function — line 124
- `isNpcCorpseBuryable` — function — line 181
- `markNpcPostDeathTerminal` — function — line 143
- `NPC_CORPSE_BONES_ONSET_DAYS` — const — line 60
- `NPC_CORPSE_REMOVE_DAYS` — const — line 61
- `NPC_CORPSE_ROT_ONSET_DAYS` — const — line 59
- `npcCorpseBurialClaimOwner` — function — line 177
- `NpcCorpseCleanupReason` — type — line 31
- `NpcCorpseLootSnapshot` — type — line 39
- `NpcCorpsePhase` — type — line 29
- `npcCorpsePhaseFromElapsedDays` — function — line 128
- `npcCorpseReadyToRemove` — function — line 138
- `NpcPostDeathState` — type — line 41
- `NpcPostDeathStatus` — type — line 27
  - domain: npc
  - role: Authoritative NPC corpse lifecycle, loot snapshot and burial handoff.
  - owns: NpcPostDeathState
- `recoverStaleNpcBurialClaim` — function — line 168
- `releaseNpcCorpseBurialClaim` — function — line 159
- `resolveNpcCorpsePhase` — function — line 133
- `shouldSkipNpcCorpsePresentation` — function — line 333
- `snapshotCorpseLoot` — function — line 221
- `transferCorpseCountTo` — function — line 283
- `transferCorpseInstanceTo` — function — line 267

## `settlement/npcPresentationOwner.ts`

- `NpcPresentationOwner` — type — line 38
- `NpcPresentationOwnershipInput` — type — line 23
  - domain: settlements-npcs
  - system: npc-presentation-owner
  - role: Pure policy resolving which settlement (if any) may materialize a live/corpse `NpcAgent` presentation for a given `NpcId` right now.
- `resolveNpcPresentationOwner` — function — line 56
  - domain: settlements-npcs
- `shouldMaterializeNpcAt` — function — line 70

## `settlement/npcRelationships.ts`

- `createNpcRelationships` — function — line 32
- `NpcRelationshipEntry` — type — line 26
- `NpcRelationships` — type — line 15

## `settlement/npcResidentAnchors.ts`

- `NpcResidentAnchors` — type — line 29
  - domain: settlements-npcs
  - system: npc-resident-anchors
  - role: Narrow settlement-scoped physical routing/work-anchor contract shared by the procedural adapter and (later) a founded/nonprocedural one.
- `proceduralResidentAnchorsFromLandmarks` — function — line 94
  - domain: settlements-npcs
- `residentAnchorsForHome` — function — line 124
- `resolveNpcSettlementStorage` — function — line 72

## `settlement/npcStartingWealth.ts`

- `resolveNpcStartingCoins` — function — line 46
  - domain: settlements-npcs
- `seedNpcStartingWealthIfNeeded` — function — line 67
  - domain: settlements-npcs

## `settlement/npcState.ts`

- `createNpcAuthoritativeState` — function — line 350
- `createNpcStateRegistry` — function — line 405
- `MAX_HP` — const — line 61
- `MAX_STAMINA` — const — line 62
- `NpcAuthoritativeState` — type — line 100
  - domain: settlements-npcs
- `NpcGraveVisitRecord` — type — line 53
- `NpcId` — type — line 49
- `NpcPhysicalMaxima` — type — line 336
- `NpcStateRegistry` — type — line 391
- `NpcStateSnapshot` — type — line 223

## `settlement/pastureWater.ts`

- `PASTURE_WELL_TROUGH_BUCKET_REACH` — const — line 13
  - domain: settlements-npcs
  - role: Canonical pasture well ↔ pasture trough local water use contract (plan settlements-npcs-046). Single source for the "close enough for the well's rope bucket" reach shared by the pasture layout generator (`villagePasture.ts`) and pasture-trough player/runtime interaction eligibility. This is the well+trough usable reach, not a collision or terrain-clearance footprint (see `villagePasture.ts`'s `WELL_RADIUS`/ `TROUGH_RADIUS`, which stay independent obstacle-clearance radii).
- `pastureTroughCanFill` — function — line 49
- `pastureTroughPromptLabel` — function — line 57
- `pastureWellTroughDistance` — function — line 16
- `resolvePastureWaterHousehold` — function — line 36

## `settlement/pathDryness.ts`

- `PATH_DRY_SAMPLES` — const — line 10
- `pathIsDry` — function — line 18
- `SETTLEMENT_WATER_MARGIN` — const — line 7

## `settlement/PlacedFires.ts`

- `createPlacedFires` — function — line 162
- `HABITAT_BURN_DESPAWN_DELAY` — const — line 61
- `isPlayerPlacedFire` — function — line 71
- `isRemovablePlacedFireKind` — function — line 77
- `pileBodyScale` — function — line 37
- `PlacedFire` — type — line 97
- `PlacedFireEntry` — type — line 106
- `PlacedFireKind` — type — line 17
- `PlacedFires` — type — line 118
- `PlaceFireOpts` — type — line 63

## `settlement/places.ts`

- `homeIndexFromPlaceId` — function — line 49
- `homePlaceId` — function — line 39
- `Place` — type — line 21
- `PlaceType` — type — line 19
- `socialPlaceFor` — function — line 72
- `workEligibleSettlementTrees` — function — line 90
- `workplaceFor` — function — line 132

## `settlement/playerOwnedHorseDebug.ts`

- `HorseDebugCandidate` — type — line 34
- `HorseDebugCommandResult` — type — line 40
- `listPlayerOwnedHorses` — function — line 210
  - domain: fauna
  - role: Plain diagnostic list of player-owned horses from persistent livestock authority (live, saved-only, tombstoned). Never returns `AnimalAgent`.
- `PlayerOwnedHorseDebugSnapshot` — type — line 15
- `PlayerOwnedHorseDebugStatus` — type — line 13
- `resurrectPlayerOwnedHorse` — function — line 254
  - domain: fauna
  - role: Debug resurrection of a player-owned horse identity. Live corpses are revived in place; tombstoned individuals restore one saved record and one spawned agent. Never creates a second `animalId`.
- `teleportPlayerOwnedHorseToPlayer` — function — line 233
  - domain: fauna
  - role: Debug teleport of an existing live player-owned horse through the agent's ground-snap seam. Preserves identity/owner/name/control.

## `settlement/plazaPaving.ts`

- `centralPlazaReservedFootprints` — function — line 53
- `fullPlazaSurfaceHoles` — function — line 111
- `generateFullPlazaCobbles` — function — line 129
- `generateSparsePlazaCobbles` — function — line 79
- `PlazaExclusion` — type — line 15
- `plazaPavingMode` — function — line 34
- `PlazaPavingMode` — type — line 13
  - domain: settlements
- `PlazaPavingPlacement` — type — line 21
- `PlazaSurfaceHole` — type — line 28

## `settlement/professionDressing.ts`

- `DressingKit` — type — line 22
  - domain: settlements-npcs Profession-signature home dressing (queue Q48 / Q42 plan §2.1) — pure, Three.js-free deterministic projection of a household's generated professions onto small wall pieces (house-local) and one freestanding piece inside the yard's reserved profession rectangle. Not persisted and not cached: it is derived at settlement build time from `def.families` and the planned plots, like the blacksmith workplace.
- `DressingPlacement` — type — line 119
- `houseLampMountFor` — function — line 147
- `lampWallObstacle` — function — line 152
- `MAX_WALL_PIECES_PER_HOUSE` — const — line 57
- `professionDressingFor` — function — line 226
- `SLOT_KITS` — const — line 66
- `SlotDressingPlacement` — type — line 107
- `slotKitCorners` — function — line 378
- `WALL_FACE_OFFSET_M` — const — line 46
- `WALL_KITS` — const — line 59
- `WallDressingPlacement` — type — line 93
- `wallKitFits` — function — line 175
- `WallObstacle` — type — line 136

## `settlement/professionDressingMesh.ts`

- `buildProfessionDressingMeshes` — function — line 188
- `DressingHouse` — type — line 181
- `extractProfessionDressingPack` — function — line 90
- `loadProfessionDressingPack` — function — line 115
- `professionDressingColliders` — function — line 260
- `ProfessionDressingPack` — type — line 40

## `settlement/professionFamilySurnames.ts`

- `applyProfessionFamilySurnames` — function — line 123
  - domain: settlements-npcs
- `isWorldgenFamilyId` — function — line 47
- `representativeProfession` — function — line 58

## `settlement/professionStaffing.ts`

- `adultProfessionCoverage` — function — line 335
  - domain: settlements-npcs
- `isAdultAge` — function — line 301
- `isProfessionAdult` — function — line 306
- `ProfessionStaffingContext` — type — line 23
  - domain: settlements-npcs
- `resolveInitialProfessionStaffing` — function — line 437
  - domain: settlements-npcs
- `shepherdHouseholdIndex` — function — line 311
- `StaffingPriority` — type — line 13

## `settlement/props.ts`

- `AuthoredRepairVisualHandles` — type — line 387
  - domain: settlements
- `BlacksmithWorkplace` — type — line 407
- `buildSettlementProps` — function — line 853
- `disposeSettlementGroup` — function — line 2656
- `dryHaySpot` — function — line 704
- `houseChestPlacement` — function — line 2640
- `SettlementHouseBed` — type — line 172
- `SettlementHouseLandmark` — type — line 138
- `SettlementLandmarks` — type — line 203
- `SettlementLandPlot` — type — line 373
- `SettlementStorageVisuals` — type — line 365
- `SettlementStorehouse` — type — line 194
- `SettlementTreeLandmark` — type — line 417
- `SettlementWellLandmark` — type — line 179

## `settlement/propSpecs.ts`

- `ANIMAL_TROUGH_HEIGHT` — const — line 141
- `ANIMAL_TROUGH_URL` — const — line 139
- `BUSH_SPECS` — const — line 38
- `CACTUS_SPECS` — const — line 54
- `CAMPFIRE_FIT_MAX` — const — line 162
- `CAMPFIRE_UNLIT_URL` — const — line 160
- `COBBLE_FIT_MAX` — const — line 179
- `COBBLE_URL` — const — line 176
- `CROPS_FIT_MAX` — const — line 133
- `CROPS_URL` — const — line 131
- `DOCK_SPECS` — const — line 87
- `FALLEN_LOG_SPECS` — const — line 103
- `FARM_HEIGHT` — const — line 129
- `FARM_URL` — const — line 126
- `FERN_SPECS` — const — line 50
- `FIRE_FX_URL` — const — line 197
- `GRAVEYARD_GLB` — const — line 116
- `LANDMARK_BOAT_FIT_MAX` — const — line 166
- `LANDMARK_BOAT_URL` — const — line 165
- `LANDMARK_OLD_TREE_FIT_MAX` — const — line 172
- `LANDMARK_OLD_TREE_URL` — const — line 171
- `LANDMARK_SHIPWRECK_FIT_MAX` — const — line 168
- `LANDMARK_SHIPWRECK_URL` — const — line 167
- `LANDMARK_TOWER_FIT_MAX` — const — line 170
- `LANDMARK_TOWER_URL` — const — line 169
- `LANDMARK_WAGON_FIT_MAX` — const — line 174
- `LANDMARK_WAGON_URL` — const — line 173
- `LANTERN_FLOOR_MAX` — const — line 198
- `LANTERN_STANDING_URL` — const — line 195
- `LANTERN_URL` — const — line 189
- `LANTERN_WALL_MAX` — const — line 203
- `LANTERN_WALL_URL` — const — line 194
- `LILY_SPECS` — const — line 74
- `PROFESSION_DRESSING_GLB` — const — line 114
- `REED_SPECS` — const — line 65
- `RESOURCE_GOLD_SPECS` — const — line 118
- `RESOURCE_ROCK_SPECS` — const — line 122
- `ROCK_CLUSTER_SPECS` — const — line 99
- `ROCK_SPECS` — const — line 91
- `SEAWEED_SPECS` — const — line 83
- `TABLE_LAMP_FIT_MAX` — const — line 212
- `TABLE_LAMP_URL` — const — line 211
- `THICKET_TREE_SPECS` — const — line 26
- `TRAP_GOOD_FIT_MAX` — const — line 145
- `TRAP_GOOD_URL` — const — line 144
- `TREE_SPECS` — const — line 6
- `TREE_STUMP_HEIGHT` — const — line 184
- `TREE_STUMP_URL` — const — line 181
- `VILLAGE_CAMPFIRE_COLLISION_RADIUS` — const — line 156
- `VILLAGE_MASONRY_FIREPIT_COLLISION_RADIUS` — const — line 158
- `VILLAGE_TORCH_HEIGHT` — const — line 204
- `VILLAGE_TORCH_URL` — const — line 196
- `WALL_URL` — const — line 186
- `WELL_HEIGHT` — const — line 137
- `WELL_URL` — const — line 135
- `WOOD_PILE_COLLISION_RADIUS` — const — line 154
- `WOOD_PILE_HEIGHT` — const — line 151
- `WOOD_PILE_PROGRESSIVE_URL` — const — line 149
- `WOOD_PILE_URL` — const — line 147

## `settlement/propUtils.ts`

- `applyTerrainTilt` — function — line 69
- `cloneProp` — function — line 176
- `clonePropWithYaw` — function — line 190
- `disableCastShadow` — function — line 119
  - domain: world-terrain
- `loadPropOrFallback` — function — line 141
- `loadPropTemplates` — function — line 165
- `LocalTerrainSample` — type — line 42
- `placeOnGround` — function — line 91
- `rotateOffsetY` — function — line 85
- `sampleLocalTerrain` — function — line 49
- `tagSettlementShadowKind` — function — line 133
  - domain: world-terrain
- `TerrainSampler` — type — line 33
- `tintPropMaterials` — function — line 14

## `settlement/ratInfestation.ts`

- `createRatInfestationRegistry` — function — line 66
- `NO_RAT_INFESTATION` — const — line 18
- `RAT_NEST_DESTROY_DURATION_SEC` — const — line 31
- `RatInfestationRegistry` — type — line 33
- `RatInfestationState` — type — line 11
  - domain: settlements
  - system: rat-infestation
  - role: Authoritative settlement-owned rat infestation state (plan quests-progression-013 / quests-progression-078) — keyed by stable `settlementId`, survives settlement stream-out/in, `WorldBundle` rebuild and save/load. Owns independent storage-damage and nest-destroyed facts. Not owned by `QuestManager` or Three.js props.
- `SEEDED_RAT_INFESTATION` — const — line 25
- `shouldSeedAuthoredHomeInfestation` — function — line 56
  - domain: quests-progression

## `settlement/ratNestPlacement.ts`

- `placeRatNest` — function — line 85
- `PlaceRatNestArgs` — type — line 74
- `RatNestPlacement` — type — line 11
  - domain: settlements
  - system: rat-infestation
  - role: Deterministic rat-nest placement from a settlement's `VillagePlan` (plan quests-progression-013 §7) — one point behind a residential house, reconstructed from seed/id rather than a persisted transform.

## `settlement/ratPersistence.ts`

- `createRatRegistry` — function — line 49
- `RatPersistence` — type — line 17
- `RatRegistry` — type — line 27
- `RatSaveRecord` — type — line 12
  - domain: fauna
  - system: settlement-rat-persistence
  - role: Per-`SettlementsManager` persistence for wild settlement rats (plan quests-progression-006) — mirrors `livestock.ts`'s registry lifecycle without livestock ownership semantics.

## `settlement/rats.ts`

- `createSettlementRats` — function — line 272
- `infestationReplenishmentRoll` — function — line 102
- `normalizeRatClipName` — function — line 220
- `RAT_DOG_REPRODUCTION_PRESSURE` — const — line 41
- `RAT_INFESTATION_FLOOR` — const — line 38
- `RAT_INFESTATION_PRESSURE_BONUS` — const — line 36
- `RAT_MIN_REPRODUCTION_MULTIPLIER` — const — line 43
- `RAT_POPULATION_CAP` — const — line 32
  - domain: fauna
  - system: settlement-rats
  - role: Settlement-local rat population pressure/reconciliation (plan fauna-016 §7/§8/§9, quests-progression-006, quests-progression-013) — deliberately not a `RatManager`: rats are plain `AnimalAgent('rat')` instances this module spawns toward a small, food-driven target population. Infestation replenishment is a separate nest-gated roll; excess live rats are never deleted just because the target falls.
- `RAT_RECONCILE_INTERVAL_DAYS` — const — line 45
- `RAT_URL` — const — line 211
- `ratDogReproductionMultiplier` — function — line 92
- `RatFoodSite` — type — line 159
- `ratNormalPopulationTarget` — function — line 77
- `ratPopulationTarget` — function — line 85
- `RatPressureInputs` — type — line 51
- `ratReconcileAction` — function — line 142
- `RatReconcileAction` — type — line 56
- `ratReconcileBucket` — function — line 128
- `SettlementRats` — type — line 183
- `SettlementRatsDeps` — type — line 161
- `shouldInfestationReplenish` — function — line 113
- `shouldProcessRatReconciliation` — function — line 133

## `settlement/roadNetwork.ts`

- `activateRoadRouteWorldgenCache` — function — line 137
  - domain: world-terrain
  - system: worldgen-cache
- `attachRoadRoutePersistence` — function — line 126
  - domain: world-terrain
- `bridgesNear` — function — line 1324
  - domain: world-terrain
- `bridgeSpecOf` — function — line 1283
- `clearRoadNetworkCaches` — function — line 196
- `clearRoadNetworkMemoryCaches` — function — line 183
  - domain: world-terrain
- `entranceToward` — function — line 220
- `findRoute` — function — line 339
  - domain: world-terrain
- `fordsNear` — function — line 1216
  - domain: world-terrain
- `ingestHydratedRoadRoute` — function — line 116
  - domain: world-terrain
- `meanderRoute` — function — line 704
- `MidpointSignpost` — type — line 1007
- `midpointSignpostsFor` — function — line 1021
- `neighborsFor` — function — line 249
- `peekRoadRouteCache` — function — line 147
- `RoadNetworkContext` — type — line 67
- `RoadRoute` — type — line 93
- `roadRouteLocationKey` — function — line 169
  - domain: world-terrain
  - system: worldgen-cache
- `roadRoutePairKey` — function — line 158
  - domain: world-terrain
  - system: worldgen-cache
- `roadRoutesForSettlement` — function — line 935
- `roadRouteWorldgenCacheReady` — function — line 142
- `RoadSegment` — type — line 57
- `RoadSegmentKind` — type — line 55
- `RoutePoint` — type — line 45
- `RouteSearchOptions` — type — line 302
- `routeToMinorLocation` — function — line 1072
- `segmentsNear` — function — line 1141
- `SettlementSignpost` — type — line 972
- `signpostsForSettlement` — function — line 984
- `VillageSegments` — type — line 1353
- `villageSegmentsNear` — function — line 1377

## `settlement/roadRiverCrossing.ts`

- `crossingsForPolyline` — function — line 306
  - domain: world-terrain
- `CrossingVerdict` — type — line 113
- `evaluateRoadRiverCrossing` — function — line 126
  - domain: world-terrain
- `riverHitsOnEdge` — function — line 196
  - domain: world-terrain
- `RoadEdgeRiverHit` — type — line 180
- `RoadRiverCrossing` — type — line 55
- `RoadRiverCrossingFacts` — type — line 27
- `RoadRiverCrossingKind` — type — line 21
  - domain: world-terrain
  - system: roads
  - role: The single canonical road × river crossing authority (plan world-terrain-023). Decides *whether* a road polyline meets canonical river water, *where* exactly, and *what kind* of infrastructure that crossing is (`ford` / `bridge`) or that it is not supported at all. Pure and allocation-light so `roadNetwork.ts`'s A* can price every candidate edge through it.
  - integration: `roadNetwork.ts` is the only caller: it prices edges with riverHitsOnEdge/evaluateRoadRiverCrossing during the search and then derives the route's canonical RoadRiverCrossing records from the *final* polyline with crossingsForPolyline. No terrain, renderer or runtime stage may reclassify a crossing: terrain only projects a declared `ford` (`terrain/riverFord.ts`) and `world-terrain-033` only projects a declared `bridge`.

## `settlement/roadRouteWorldgenCache.ts`

- `createRoadRouteWorldgenCache` — function — line 196
  - domain: world-terrain
  - system: worldgen-cache
- `isValidRoadRoutePayload` — function — line 145
  - domain: world-terrain
  - system: worldgen-cache
- `ROAD_ROUTE_CACHE_NAMESPACE` — const — line 28
  - domain: world-terrain
  - system: worldgen-cache
  - role: Persistent-cache adapter for inter-settlement / settlement↔minor-location `RoadRoute` results (plan world-terrain-029). IndexedDB only hydrates and extends the module-level `routeCache` in `roadNetwork.ts` — that map stays the synchronous authority. Cached `null` is a real hit (a deterministic failed route), never a miss.
  - integration: Disposable derived data only. Route consumers stay synchronous; a miss, malformed payload or IndexedDB failure always falls back to the canonical `findRoute()` path. Never `SaveData`, never a second crossing classifier, never signposts / per-chunk corridors / bridge specs.
- `ROAD_ROUTE_CACHE_VERSION` — const — line 51
- `RoadRouteCachePayload` — type — line 58
- `roadRouteFingerprint` — function — line 73
  - domain: world-terrain
  - system: worldgen-cache
- `RoadRouteWorldgenCache` — type — line 171

## `settlement/routeObstacles.ts`

- `buildRouteObstacles` — function — line 30
- `ROUTE_ENDPOINT_FREE_RADIUS` — const — line 25
- `ROUTE_OBSTACLE_PAD` — const — line 23
- `RouteObstacles` — type — line 15
  - domain: settlements

## `settlement/routeShape.ts`

- `polylineIsClear` — function — line 178
- `roundCorners` — function — line 153
- `ROUTE_RESAMPLE_STEP` — const — line 33
- `RouteShapeEnv` — type — line 19
- `ShapePoint` — type — line 17
  - domain: world-terrain
- `straightChordAround` — function — line 200
  - domain: world-terrain
- `stringPull` — function — line 85

## `settlement/settlementAgriculture.ts`

- `completedAgricultureBatches` — function — line 52
- `householdAgriculturalCapacity` — function — line 22
  - domain: settlements-npcs
  - system: household
- `householdSeedReserveRequirement` — function — line 27
- `householdSeedStockCount` — function — line 32
- `householdSeedSurplusCount` — function — line 42
- `resolveSettlementAgricultureCatchUp` — function — line 130
- `resolveUnloadedHouseholdAgriculture` — function — line 73
- `shouldCatchUpAgricultureDuringTimeSkip` — function — line 119

## `settlement/settlementArmorQuality.ts`

- `hashArmorQualityOwner` — function — line 24
- `normalizeArmorQualityWeights` — function — line 33
- `pickWeightedArmorQuality` — function — line 41
- `resolveSettlementArmorQuality` — function — line 57
  - domain: settlements-npcs
- `SETTLEMENT_ARMOR_QUALITY_WEIGHTS` — const — line 16
  - domain: settlements-npcs

## `settlement/settlementCharacter.ts`

- `resolveSettlementCharacter` — function — line 34
  - domain: settlements
- `SETTLEMENT_CHARACTER_CHANCES` — const — line 42
- `SETTLEMENT_CHARACTER_SALT` — const — line 7
- `SettlementCharacterInput` — type — line 21
  - domain: settlements

## `settlement/settlementGenerator.ts`

- `cellFromId` — function — line 170
- `cellKey` — function — line 154
- `cellSeed` — function — line 198
- `cellsWithinRadius` — function — line 182
- `generateSettlementDef` — function — line 912
- `generateVillagePlan` — function — line 840
- `probeSettlementSite` — function — line 620
  - domain: settlements
- `setSettlementGridStepOverride` — function — line 90
- `SETTLEMENT_GRID_STEP` — const — line 71
- `settlementBaseNameFor` — function — line 237
  - domain: settlements
- `SettlementCell` — type — line 94
- `settlementCellCenter` — function — line 223
  - domain: settlements
- `settlementCellInsideWorld` — function — line 148
- `SettlementDef` — type — line 96
- `SettlementSiteProbe` — type — line 605
- `worldToCell` — function — line 158

## `settlement/settlementLayout.ts`

- `computeSettlementLayout` — function — line 151
  - domain: settlements
- `LayoutSite` — type — line 87
- `setSettlementLayoutOverrides` — function — line 83
- `SETTLEMENT_BAND_MAX_EDGE_M` — const — line 45
- `SETTLEMENT_MAX_EDGE_M` — const — line 42
- `SETTLEMENT_MIN_DISTANCE_M` — const — line 33
- `SETTLEMENT_SPACING_M` — const — line 36
- `SETTLEMENT_TARGET_COUNT` — const — line 40
- `SettlementLayout` — type — line 93
- `SettlementLayoutInput` — type — line 57
- `SettlementLayoutOverrides` — type — line 69

## `settlement/settlementNameUniqueness.ts`

- `compareSettlementNameOrder` — function — line 27
  - domain: settlements
- `fallbackSettlementName` — function — line 40
  - domain: settlements
- `LOCAL_SETTLEMENT_NAME_RADIUS_M` — const — line 12
- `localSettlementName` — function — line 92
  - domain: settlements
- `LocalSettlementNameDeps` — type — line 44
- `localSettlementNameOrdinal` — function — line 66
  - domain: settlements

## `settlement/settlementNightCycle.ts`

- `createSettlementNightCycle` — function — line 62
- `NIGHT_FIRE_IGNITE_CHANCE` — const — line 27
- `NIGHT_FIRE_THRESHOLD` — const — line 24
  - domain: settlements
  - system: settlement-night-cycle
  - role: Owns the dusk/dawn threshold crossing that drives fire autolight, torches and house-light intensity.
- `SettlementNightAutoLightPolicy` — type — line 52
- `SettlementNightCycle` — type — line 49
- `SettlementNightTorch` — type — line 57
- `shouldAutoLightNightFire` — function — line 38

## `settlement/settlementPalisade.ts`

- `fencePlacementColliders` — function — line 422
  - domain: settlements
- `PALISADE_GATE_HALF_ANGLE` — const — line 20
- `PALISADE_WALL_HALF_DEPTH` — const — line 27
  - domain: settlements
- `plantEntrancePalisade` — function — line 391
  - domain: settlements
- `resolveEntrancePalisadePlacements` — function — line 210
  - domain: settlements
- `resolveEntranceTorchPlacements` — function — line 318
  - domain: settlements
- `SettlementEntranceTorchPlacement` — type — line 73
  - domain: settlements
- `settlementPalisadeColliders` — function — line 441
  - domain: settlements
- `SettlementPalisadePlacement` — type — line 65
  - domain: settlements
- `WALL_HALF_LENGTH` — const — line 18
- `WALL_TARGET_HEIGHT` — const — line 16

## `settlement/settlementPlanCache.ts`

- `activateSettlementDefinitionCacheForWorld` — function — line 196
  - domain: settlements
  - system: worldgen-cache
- `attachSettlementDefinitionPersistence` — function — line 169
  - domain: settlements
  - system: worldgen-cache
- `cachedLostTreasureArchaeologistHostCell` — function — line 468
- `cachedLostTreasureSpecialistHostCell` — function — line 477
- `cachedSettlementDefCount` — function — line 505
- `cachedSettlementProgressionPolicy` — function — line 510
- `clearSettlementDefCache` — function — line 128
- `ingestHydratedSettlementDef` — function — line 149
  - domain: settlements
  - system: worldgen-cache
- `lostTreasureArchaeologistHostCell` — function — line 451
  - domain: settlements
- `lostTreasureSpecialistHostCell` — function — line 462
  - domain: settlements
- `setSettlementRiverQuery` — function — line 87
- `settlementDefFor` — function — line 485
- `settlementDefinitionCacheReady` — function — line 213
- `settlementLayoutFor` — function — line 224
  - domain: settlements
- `SettlementResolveContext` — type — line 61
- `worldRiverQuery` — function — line 100

## `settlement/settlementProgression.ts`

- `orderProgressionCandidates` — function — line 110
  - domain: settlements
- `resolveSettlementProgressionPolicy` — function — line 155
  - domain: settlements
- `SETTLEMENT_PROGRESSION_HOP_CAPS` — const — line 18
- `SETTLEMENT_PROGRESSION_LG_HOPS` — const — line 23
- `SETTLEMENT_PROGRESSION_LG_ORDER_SALT` — const — line 31
- `SETTLEMENT_PROGRESSION_MD_ORDER_SALT` — const — line 30
- `SETTLEMENT_PROGRESSION_XL_HOPS` — const — line 25
- `SETTLEMENT_PROGRESSION_XL_MAX_DISTANCE_M` — const — line 27
- `SETTLEMENT_PROGRESSION_XL_ORDER_SALT` — const — line 32
- `settlementGraphHops` — function — line 75
- `SettlementProgressionOverride` — type — line 48
- `SettlementProgressionPolicy` — type — line 59
  - domain: settlements
- `SettlementProgressionWorldInput` — type — line 36

## `settlement/settlementPropColliders.ts`

- `SettlementPropColliderLandmarks` — type — line 19
- `settlementPropColliders` — function — line 26

## `settlement/settlementProximity.ts`

- `isNearSettlement` — function — line 34
- `NEAR_SETTLEMENT_DISTANCE` — const — line 21
  - domain: settlement
  - system: settlement-proximity
  - role: Cheap, bounded "which settlements are near this world point" checks, built on the existing settlement grid instead of loaded/streamed settlements — `isNearSettlement`'s fixed-radius boolean check, and `settlementsWithinDistance`'s larger-radius full candidate list.
- `settlementsWithinDistance` — function — line 60

## `settlement/settlementSignposts.ts`

- `createLabeledProp` — function — line 51
- `createSettlementSignposts` — function — line 111
- `disposeLabeledProp` — function — line 95
- `LabeledProp` — type — line 37
  - domain: settlements
  - system: settlement-signposts
  - role: Owns build/update/dispose for every settlement prop that pairs a ground-placed mesh with a distance-faded CSS2D label.
- `SettlementSignposts` — type — line 106
- `updateLabelOpacity` — function — line 84

## `settlement/SettlementsManager.ts`

- `createSettlementsManager` — function — line 455
  - domain: settlements
  - system: settlements-manager
  - role: Owns settlement generation, streaming and per-settlement economy/household/NPC-state registries.
  - owns: SettlementEconomy, Household
  - lifecycle: streaming
- `SettlementsManager` — type — line 203
- `shouldAcceptSettlementResidency` — function — line 178
  - domain: settlements

## `settlement/settlementStructures.ts`

- `createAnvil` — function — line 267
- `createBarrel` — function — line 103
- `createCrate` — function — line 254
- `createDock` — function — line 336
- `createGarden` — function — line 404
- `createGrindWorkbench` — function — line 293
- `createHayBale` — function — line 127
- `createHut` — function — line 13
- `createRatNest` — function — line 208
- `createSignpost` — function — line 362
- `createStockpile` — function — line 318
- `createTrough` — function — line 200
- `createTroughVisual` — function — line 194
- `createVillageNamepost` — function — line 383
- `createWell` — function — line 40
- `createWheatField` — function — line 506
- `cropsBedPlacements` — function — line 473
  - domain: settlements
- `disableGardenPlantCastShadow` — function — line 441
  - domain: world-terrain
- `preloadAnimalTroughVisual` — function — line 150
- `TroughVisual` — type — line 140
- `VILLAGE_NAMEPOST_BOARD_CENTER_Y` — const — line 381
- `wellPropPlacement` — function — line 459
  - domain: settlements

## `settlement/settlementTerrain.ts`

- `classifySettlementTerrain` — function — line 41
- `MOUNTAIN_RIDGE_THRESHOLD` — const — line 33
- `TerrainSamplers` — type — line 9

## `settlement/settlementTimeSkipAnimals.ts`

- `visitUniqueAnimalsById` — function — line 11
  - domain: world

## `settlement/settlementVillageTorch.ts`

- `SettlementVillageTorch` — type — line 12
  - domain: settlements
  - system: settlement-lighting
- `settlementVillageTorchId` — function — line 19

## `settlement/settlementWorldgenCache.ts`

- `createSettlementWorldgenCache` — function — line 612
  - domain: settlements
  - system: worldgen-cache
- `isValidSettlementDefPayload` — function — line 530
  - domain: settlements
  - system: worldgen-cache
- `isValidSettlementWorldgenPayload` — function — line 577
  - domain: settlements
  - system: worldgen-cache
- `parseSettlementCellSubKey` — function — line 112
- `SETTLEMENT_DEFINITION_CACHE_NAMESPACE` — const — line 46
  - domain: settlements
  - system: worldgen-cache
  - role: Persistent-cache adapter for `SettlementDef | null` results (plan settlements-014). IndexedDB only hydrates and extends the module-level `defCache` in `settlementPlanCache.ts` — that map stays the synchronous authority. Cached `null` is a real hit (a cell that deterministically has no settlement), never a miss.
  - integration: Disposable derived data only. `settlementDefFor()` stays synchronous; a miss, malformed payload or IndexedDB failure always falls back to `generateSettlementDef()`. Never `SaveData`, never a second reduced `VillagePlan`, never economy / household / NPC runtime state.
- `SETTLEMENT_DEFINITION_CACHE_VERSION` — const — line 65
- `SETTLEMENT_LOST_TREASURE_HOSTS_SUB_KEY` — const — line 81
- `settlementCellSubKey` — function — line 107
  - domain: settlements
  - system: worldgen-cache
- `SettlementDefinitionCachePayload` — type — line 78
- `settlementDefinitionFingerprint` — function — line 134
  - domain: settlements
  - system: worldgen-cache
- `SettlementLostTreasureHostsPayload` — type — line 85
- `SettlementProgressionIdentity` — type — line 95
- `SettlementWorldgenCache` — type — line 586
- `SettlementWorldgenCachePayload` — type — line 91

## `settlement/storageDestinations.ts`

- `classifyItemStorageKind` — function — line 31
  - domain: settlements-npcs
  - system: storage-destinations
  - role: Resolves the physical destination for a wood/food delivery, given the household or settlement it belongs to.
- `householdStorageDestination` — function — line 37
- `resolveHouseholdWoodStorage` — function — line 47
- `settlementStorageDestination` — function — line 64

## `settlement/storageRepair.ts`

- `describeSettlementStorageRepair` — function — line 19
- `formatSettlementStorageInspection` — function — line 40
- `SETTLEMENT_STORAGE_REPAIR_BEAM_COST` — const — line 5
- `SETTLEMENT_STORAGE_REPAIR_DURATION_SEC` — const — line 8
- `SettlementStorageRepairView` — type — line 10

## `settlement/storageVisuals.ts`

- `allocateFoodRepresentatives` — function — line 166
  - domain: settlements-npcs
- `createFoodStorageVisual` — function — line 276
  - domain: settlements-npcs
- `createWoodPileVisual` — function — line 104
- `findWoodPileStageNodes` — function — line 75
- `flattenFoodRepresentatives` — function — line 210
- `FOOD_STORAGE_LOCAL_SLOTS` — const — line 235
  - domain: settlements-npcs
- `FOOD_STORAGE_MAX_KINDS` — const — line 136
- `FOOD_STORAGE_MAX_REPRESENTATIVES` — const — line 139
- `FoodRepresentativeAllocation` — type — line 141
- `foodRepresentativeCount` — function — line 149
  - domain: settlements-npcs
- `foodStorageAllocationSignature` — function — line 218
- `FoodStorageLocalSlot` — type — line 222
- `FoodStorageVisual` — type — line 260
- `WOOD_PILE_EXTRA_OFFSETS` — const — line 37
- `WOOD_PILE_MAX_EXTRA` — const — line 29
- `WOOD_PILE_OVERFLOW_START` — const — line 27
- `WOOD_PILE_OVERFLOW_STEP` — const — line 28
- `WOOD_PILE_STAGES` — const — line 22
  - domain: settlements-npcs
  - system: storage-visuals
  - role: Derives a bounded, deterministic Three.js visual from a storage destination's authoritative quantity/contents.
- `woodPileOverflowCount` — function — line 61
- `woodPileStage` — function — line 51
- `WoodPileStage` — type — line 23
- `WoodPileVisual` — type — line 87
- `woodPileVisualState` — function — line 70
- `WoodPileVisualState` — type — line 42

## `settlement/storehouseLayout.ts`

- `STOREHOUSE_APRON` — const — line 22
- `STOREHOUSE_BAY_OFFSET` — const — line 18
- `STOREHOUSE_BAY_SLOTS` — const — line 16
  - domain: settlements
- `STOREHOUSE_BAY_SPACING` — const — line 20
- `STOREHOUSE_FREE_FLOOR` — const — line 24
- `storehouseBaySlotFor` — function — line 50
- `StorehouseLayout` — type — line 26
- `storehouseLayoutFor` — function — line 38

## `settlement/structureCondition.ts`

- `applyStructureDamage` — function — line 248
  - domain: settlements
- `applyStructureRepairWork` — function — line 365
  - domain: settlements
- `AUTHORED_STARTER_DAMAGE_CONDITION` — const — line 186
- `AuthoredRepairTargetKind` — type — line 121
  - domain: settlements
- `beginStructureRepair` — function — line 316
  - domain: settlements
- `hasActiveStructureRepair` — function — line 63
- `isStructureRepairProblem` — function — line 231
- `pristineStructureState` — function — line 50
- `quoteStructureRepair` — function — line 282
  - domain: settlements
- `resolveStructureCondition` — function — line 220
- `SettlementStructureState` — type — line 31
  - domain: settlements
- `STRUCTURE_REPAIR_RESUME_PRESSURE` — const — line 198
- `STRUCTURE_REPAIR_WORK_SESSION_HOURS` — const — line 389
- `STRUCTURE_REPAIR_WORK_SESSION_SEC` — const — line 388
- `structureConditionStateFromSnapshot` — function — line 391
- `structureRepairPolicy` — function — line 171
- `StructureRepairPolicy` — type — line 71
- `structureRepairPressureFromCondition` — function — line 208
  - domain: settlements
- `StructureRepairQuote` — type — line 263
- `StructureRepairStartOutcome` — type — line 300
- `StructureRepairTargetKind` — type — line 127
- `StructureRepairWorkOutcome` — type — line 350

## `settlement/structureRepairCandidates.ts`

- `AuthoredNpcRepairTarget` — type — line 139
  - domain: settlements
- `AuthoredRepairMaterialSource` — type — line 153
- `createAuthoredNpcRepairTarget` — function — line 160
- `createNpcStructureRepairHooks` — function — line 97
- `NpcStructureRepairHooks` — type — line 79
  - domain: settlements
- `ResidentialRepairCandidate` — type — line 27
  - domain: settlements
- `residentialRepairCandidates` — function — line 41

## `settlement/structureStateRegistry.ts`

- `beginRegistryStructureRepair` — function — line 57
  - domain: settlements
- `contributeRegistryStructureRepairWork` — function — line 76
- `createSettlementStructureStateRegistry` — function — line 93
- `SettlementStructureStateRegistry` — type — line 28
  - domain: settlements
  - system: structure-condition
  - role: Owns mutable settlement-structure condition/repair state, keyed by stable structureId.
  - owns: SettlementStructureState

## `settlement/villageClearing.ts`

- `ClearingArea` — type — line 11
- `ClearingLayout` — type — line 21
- `layoutClearings` — function — line 172
- `layoutClearingsFromPlan` — function — line 72
- `plazaCoreRadius` — function — line 64

## `settlement/VillageFire.ts`

- `createVillageFire` — function — line 100
- `FireLightSource` — type — line 36
- `FUEL_PER_BRANCH` — const — line 11
- `IGNITE_DURATION_SEC` — const — line 15
- `VillageFire` — type — line 43
- `VillageFireHooks` — type — line 38

## `settlement/villageLanes.ts`

- `createBuildingClearance` — function — line 446
- `createLaneRouter` — function — line 454
- `laneAccessPoint` — function — line 297
- `LaneDestination` — type — line 81
- `LaneEntrance` — type — line 111
- `LaneRouter` — type — line 452
- `planVillageLanes` — function — line 322
- `VillageLanePlan` — type — line 113

## `settlement/villagePaddock.ts`

- `appendPaddockPath` — function — line 410
- `horseVendorSetupChance` — function — line 70
- `paddockFencePlacements` — function — line 432
- `PaddockPlanArgs` — type — line 97
- `paddockRadiusFor` — function — line 84
- `paddockSlotCountForRadius` — function — line 89
- `planSettlementPaddock` — function — line 320
  - domain: settlements
- `settlementRollsHorseVendor` — function — line 78
- `vendorHorseAnimalId` — function — line 93

## `settlement/villagePasture.ts`

- `appendPasturePath` — function — line 559
- `fenceSegmentPlacements` — function — line 600
- `pastureFencePlacements` — function — line 640
- `PasturePlanArgs` — type — line 92
- `pastureRadiusFor` — function — line 85
- `planSettlementPasture` — function — line 363
- `planSpurPoints` — function — line 476
- `settlementWantsPasture` — function — line 76
- `spurClearsFence` — function — line 455

## `settlement/villagePlan.ts`

- `communalFenceFallbackStructureId` — function — line 238
- `DEFAULT_PLAZA_RADIUS` — const — line 67
- `FoodSourceType` — type — line 12
- `householdFenceStructureId` — function — line 229
- `householdWellLandmarkId` — function — line 265
- `householdWellPlotId` — function — line 251
- `isTreeWorkEligible` — function — line 113
- `loggingWagonStructureId` — function — line 245
- `noticeBoardPlotId` — function — line 287
- `PADDOCK_ID` — const — line 329
- `paddockPathId` — function — line 331
- `parseHouseholdWellFamilyIndex` — function — line 257
- `PASTURE_ID` — const — line 315
- `pasturePathId` — function — line 324
- `pastureWellLandmarkId` — function — line 319
- `plannedCampfireBodyKind` — function — line 105
- `plannedCampfireFootprint` — function — line 101
- `PLAZA_CAMPFIRE_FOOTPRINT` — const — line 93
- `PLAZA_MASONRY_FIREPIT_FOOTPRINT` — const — line 95
- `PLAZA_TREE_WORK_MARGIN` — const — line 111
- `plazaRadiusForSize` — function — line 71
- `plazaUsesMasonryFirepit` — function — line 97
- `residentialFoundationStructureId` — function — line 222
- `residentialStructureId` — function — line 213
- `SettlementCharacter` — type — line 21
  - domain: settlements
- `storehousePlotId` — function — line 282
- `VillageBoundary` — type — line 41
- `VillageBuildingPlan` — type — line 192
- `VillageBuildingRole` — type — line 184
- `VillageCenter` — type — line 49
- `VillageEntrance` — type — line 409
- `VillageIdentity` — type — line 25
- `VillageLandmarkKind` — type — line 269
- `VillageLandmarkPlan` — type — line 291
- `VillageLayoutPattern` — type — line 421
- `VillagePaddockPlan` — type — line 390
  - domain: settlements
- `VillagePastureAnchor` — type — line 350
- `VillagePastureFenceSegment` — type — line 341
  - domain: settlements
- `VillagePasturePlan` — type — line 365
  - domain: settlements
- `VillagePathPlan` — type — line 305
- `VillagePlan` — type — line 437
- `VillagePlaza` — type — line 60
- `villagePlazaAt` — function — line 84
- `VillagePlot` — type — line 141
- `VillagePlotRole` — type — line 139
- `VillageZone` — type — line 131
- `VillageZoneKind` — type — line 123

## `settlement/villagePlanDebug.ts`

- `summarizeVillagePlan` — function — line 5

## `settlement/villagePlanner.ts`

- `buildingsAndLandmarksFromPlots` — function — line 1596
- `chooseLayoutPattern` — function — line 176
- `HOUSE_COMPOUND_GAP_FACTOR` — const — line 91
- `householdWellLocalBand` — function — line 103
  - domain: settlements-npcs
- `pathPlansToCorridorData` — function — line 2056
- `planLocalPathsAndEntrances` — function — line 1924
- `planVillageLayout` — function — line 1058
- `PLOT_SCORE_WEIGHTS` — const — line 62
- `roadEntranceAngles` — function — line 1810
- `VillageLayoutDraft` — type — line 139

## `settlement/wellInteractionQueue.ts`

- `buildWellInteractionQueueConfig` — function — line 19
- `WELL_QUEUE_SERVING_OFFSET_ANCHOR` — const — line 8
- `WELL_QUEUE_SERVING_OFFSET_FALLBACK` — const — line 11
- `WellQueueRestConfig` — type — line 13

## `settlement/woodPileTiers.ts`

- `bakeWoodPileTierTemplates` — function — line 52
- `createInstancedWoodPileVisuals` — function — line 177
- `createWoodPileTierPool` — function — line 113
- `InstancedWoodPileVisuals` — type — line 162
- `loadWoodPileTierTemplates` — function — line 83
- `WOOD_PILE_TIER_NODES` — const — line 26
- `WOOD_PILE_TIER_SCALE` — const — line 38
- `WOOD_PILE_TIERS_URL` — const — line 23
  - domain: settlements-npcs
  - system: storage-visuals
  - role: Renders wood-pile tiers as shared-geometry instanced meshes with change-driven slot updates.
- `WoodPilePoint` — type — line 97
- `WoodPileTierPool` — type — line 99
- `WoodPileTierTemplates` — type — line 40

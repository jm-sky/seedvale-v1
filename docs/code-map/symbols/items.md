# Symbols

Generated from exported TypeScript symbols.

## `items/armorItemInstances.ts`

- `applyArmorPenaltyQuality` — function — line 87
  - domain: items-player
- `createArmorInstance` — function — line 36
  - domain: items-player
- `createArmorInstance` — function — line 37
- `createArmorInstance` — function — line 38
- `createArmorInstance` — function — line 39
- `createArmorInstance` — function — line 45
- `EffectiveArmorPiece` — type — line 96
  - domain: items-player
- `effectiveInstanceWeight` — function — line 141
  - domain: items-player
- `migrateArmorCountsToInstances` — function — line 156
  - domain: items-player
- `resolveEffectiveArmorPiece` — function — line 114
  - domain: items-player

## `items/armorProtectionDisplay.ts`

- `DAMAGE_CHANNEL_LABELS` — const — line 15
  - domain: items-player
- `DAMAGE_CHANNELS` — const — line 26
- `expectedProtectionByProfile` — function — line 41
  - domain: ui-input
- `ExpectedProtectionByProfile` — type — line 36
- `formatArmorCoverage` — function — line 52
  - domain: ui-input
- `formatChannelResistance` — function — line 66
  - domain: ui-input
- `formatResistanceLabel` — function — line 57
- `PROTECTION_PROFILE_KEYS` — const — line 30
- `PROTECTION_PROFILE_LABEL` — const — line 31
- `ProtectionProfileKey` — type — line 29
- `resistancePercents` — function — line 18
- `strongestChannelPercent` — function — line 71
- `ZERO_PROTECTION_VIEW` — const — line 78
- `ZERO_RESISTANCE_VIEW` — const — line 75

## `items/authoredWorldPickups.ts`

- `buildAuthoredOneTimePickups` — function — line 12
  - domain: quests-progression

## `items/books.ts`

- `BookReadOutcome` — type — line 15
  - domain: items-player
  - role: Interprets the "Czytaj" inventory action against `ITEM_CATALOG[kind].book` metadata and `PlayerSkills` — the only place that decides what reading a book actually does. Owns no state of its own: the book stays in inventory either way, and the only lasting effect is the XP change `raiseSkillToValue` makes.
- `BookReadResult` — type — line 25
- `readBook` — function — line 37

## `items/campBlanketProp.ts`

- `createCampBlanketProp` — function — line 9
- `disposeCampBlanketProp` — function — line 19

## `items/campfireCooking.ts`

- `COOK_DURATION_SEC` — const — line 34
- `COOKING_RECIPES` — const — line 16
- `CookingRecipe` — type — line 10
- `findCookingBatch` — function — line 65
- `findCookingRecipe` — function — line 37
- `processCookedBatches` — function — line 82
  - domain: items-player
- `resolveCookingCapacity` — function — line 54

## `items/campRepair.ts`

- `applyCampRepairWork` — function — line 213
  - domain: items-player
- `BEDROLL_REPAIR_FULL_WORK_HOURS` — const — line 38
- `beginCampRepair` — function — line 166
  - domain: items-player
- `CAMP_REPAIR_COST_FACTOR` — const — line 32
- `CAMP_REPAIR_DURATION_CUT` — const — line 50
- `CAMP_REPAIR_SESSION_HOURS` — const — line 43
- `CAMP_REPAIR_SESSION_SEC` — const — line 44
- `CAMP_REPAIR_XP_PER_WORK_HOUR` — const — line 47
- `CampRepairableRecord` — type — line 200
- `campRepairCapability` — function — line 237
- `campRepairDurationScale` — function — line 243
- `CampRepairQuote` — type — line 52
- `CampRepairStartOutcome` — type — line 62
- `CampRepairTargetKind` — type — line 28
  - domain: items-player
- `campRepairXp` — function — line 248
- `hasActiveCampRepair` — function — line 232
- `PLATFORM_REPAIR_FULL_WORK_HOURS` — const — line 39
- `resolveCampRepairQuote` — function — line 139
  - domain: items-player
- `TENT_REPAIR_FULL_HIDE` — const — line 36
- `TENT_REPAIR_FULL_WORK_HOURS` — const — line 37

## `items/constructionMaterials.ts`

- `applyRecovery` — function — line 170
- `canReceiveRecovery` — function — line 162
- `computeMaterialRecovery` — function — line 152
- `CONSTRUCTION_MATERIAL_RADIUS` — const — line 12
- `consumeMaterial` — function — line 113
- `foldMaterialRequirements` — function — line 176
- `formatMaterialAvailabilityLine` — function — line 191
- `hasMaterial` — function — line 88
- `materialAvailabilityBreakdown` — function — line 64
- `MaterialAvailabilityView` — type — line 55
- `MaterialRecoveryPolicy` — type — line 143
- `MaterialRequirement` — type — line 8
- `nearbyWorldMaterialCount` — function — line 40

## `items/container.ts`

- `CONTAINER_DEFS` — const — line 55
- `CONTAINER_PLACE_REACH` — const — line 126
- `CONTAINER_PLACEMENT_MESSAGE` — const — line 96
- `CONTAINER_SETUP_DURATION_SEC` — const — line 129
- `ContainerDef` — type — line 36
- `containerGroundPrompt` — function — line 117
- `ContainerKind` — type — line 25
- `ContainerPickupPolicy` — type — line 34
- `ContainerPlacementReason` — type — line 94
- `containerTotalWeight` — function — line 107

## `items/cookingFireResolver.ts`

- `CookingFireRef` — type — line 7
- `NearbyCookingFire` — type — line 11
- `resolveCookingFireByRef` — function — line 81
- `resolveNearbyCookingFire` — function — line 35
  - domain: ui-input
- `resolvePlacedFireById` — function — line 92

## `items/createDroppedItems.ts`

- `createDroppedItems` — function — line 97
- `DROPPED_ITEM_QUERY_CELL_SIZE` — const — line 29
- `DroppedItem` — type — line 13
- `DroppedItems` — type — line 41

## `items/createItemSpawners.ts`

- `CollectedSpawnerItem` — type — line 12
- `createItemSpawners` — function — line 141
- `ItemSpawners` — type — line 20
- `OneTimeWorldItemPickup` — type — line 126

## `items/createPlacedTents.ts`

- `createPlacedTents` — function — line 113
  - domain: items-player
- `PlacedTent` — type — line 20
- `PlacedTentEntry` — type — line 34
- `PlacedTents` — type — line 41
- `TENT_CONDITION_MAX` — const — line 79
- `TENT_RAIN_DECAY_PER_DAY` — const — line 77
- `TENT_SNOW_DECAY_PER_DAY` — const — line 78
- `TentPackResult` — type — line 36

## `items/equipment.ts`

- `armorPositionOf` — function — line 130
- `buildProtectionSnapshot` — function — line 302
  - domain: items-player
- `createEquipmentState` — function — line 156
  - domain: items-player
- `EQUIPMENT_LAYER_LABEL` — const — line 48
- `EQUIPMENT_POSITIONS` — const — line 66
- `EQUIPMENT_SLOT_LABEL` — const — line 37
- `EQUIPMENT_SLOTS` — const — line 26
- `EquipmentModifiers` — type — line 73
- `equipmentPositionLabel` — function — line 56
  - domain: ui-input
- `EquipmentState` — type — line 102
  - domain: items-player
  - system: equipment
  - role: Tracks which owned armor instance (if any) is worn in each of the 14 equipment positions.
  - uses: Inventory
- `equippedArmorInstances` — function — line 221
- `equippedBodyArmor` — function — line 238
- `equippedInstanceId` — function — line 243
- `equippedInstanceIds` — function — line 252
- `EquipResult` — type — line 88
- `isEquipmentPositionKey` — function — line 125
- `isEquipmentSlot` — function — line 121
- `NEUTRAL_EQUIPMENT_MODIFIERS` — const — line 80
- `ProtectionSnapshot` — type — line 272
  - domain: items-player
- `rangedStaminaMultiplierFor` — function — line 290
- `resolveArmorInstanceEffective` — function — line 374
- `resolveEquipmentModifiers` — function — line 369
  - domain: items-player
- `resolveProtectionSnapshot` — function — line 355
  - domain: items-player
- `SavePlayerEquipment` — type — line 63
- `WornArmorPiece` — type — line 260

## `items/equipmentPreview.ts`

- `ArmorPreviewInstance` — type — line 80
- `emptyLoadoutStats` — function — line 87
- `EquipPreviewResult` — type — line 49
- `LoadoutStatView` — type — line 34
- `previewEquipLoadout` — function — line 184
  - domain: items-player
- `previewEquipLoadoutFromSnapshot` — function — line 249
  - domain: items-player

## `items/equipmentTypes.ts`

- `ARMOR_LAYERS` — const — line 8
- `ArmorLayer` — type — line 5
- `equipmentPositionKey` — function — line 10
- `EquipmentPositionKey` — type — line 6
- `EquipmentSlot` — type — line 4
  - domain: items-player

## `items/foodFreshness.ts`

- `bait` — function — line 308
- `BAIT_ITEM_PRIORITY` — const — line 317
- `canMergeFoodBatches` — function — line 242
- `CARRIED_FOOD_DECAY` — const — line 54
- `checkpointFoodBatch` — function — line 215
  - domain: items-player
- `cloneFoodBatch` — function — line 117
- `compareFoodBatchesFifo` — function — line 252
  - domain: items-player
- `createFoodBatch` — function — line 122
- `FOOD_BATCH_MERGE_TOLERANCE_DAYS` — const — line 240
- `FOOD_SOURCE_SPECIES` — const — line 15
- `FOOD_SOURCE_SPECIES_LABEL` — const — line 39
- `FoodBatch` — type — line 67
  - domain: items-player
- `foodBatchDecomposeAtDays` — function — line 196
  - domain: items-player
- `foodBatchEffectiveAge` — function — line 144
  - domain: items-player
- `foodBatchesMergeEqual` — function — line 229
- `foodBatchUsedFraction` — function — line 149
- `foodFreshnessDef` — function — line 76
- `foodHungerRelief` — function — line 298
  - domain: items-player
- `FoodSourceSpecies` — type — line 13
- `foodTotalShelfLifeDays` — function — line 81
- `FRESHNESS_STAGE_LABEL` — const — line 47
- `FreshnessStage` — type — line 8
- `getFoodBatchFreshnessStage` — function — line 163
- `getFreshnessStage` — function — line 168
- `getFreshnessStageFromAge` — function — line 155
- `inheritProcessedFoodBatch` — function — line 267
  - domain: items-player
- `isBaitCapable` — function — line 312
- `isFoodBatchDecomposed` — function — line 203
- `isFoodBatchSpoiled` — function — line 176
- `isFoodPerishable` — function — line 87
- `isFoodSourceSpecies` — function — line 19
- `isSpoiled` — function — line 172
- `MEAT_KIND_BY_SOURCE_SPECIES` — const — line 31
- `normalizeFoodBatch` — function — line 101
  - domain: items-player
- `SOURCE_SPECIES_BY_MEAT_KIND` — const — line 23
- `sourceSpeciesForMeatKind` — function — line 91
- `STORED_FOOD_DECAY` — const — line 57
- `WORLD_SPOILED_FOOD_DECAY_DAYS` — const — line 187
  - domain: items-player

## `items/foodItems.ts`

- `carryFoodClaim` — function — line 124
- `claimFoodItems` — function — line 52
- `deliverCarriedFoodClaim` — function — line 142
- `depositFoodItems` — function — line 74
- `expandFoodBatchesToUnits` — function — line 92
- `FOOD_ITEM_KINDS` — const — line 18
- `FoodItemClaim` — type — line 45
- `foodItemCount` — function — line 24
- `skipBatchCount` — function — line 101
- `takeBatchCount` — function — line 79
- `takeOneFoodItem` — function — line 33

## `items/foodSafety.ts`

- `RawMeatSafetyRisk` — type — line 24
- `resolveRawMeatSafetyRisk` — function — line 70
  - domain: items-player

## `items/foreignProperty.ts`

- `ActionConsequencePreview` — type — line 26
- `beginMountedForeignUse` — function — line 132
- `createForeignPropertyUse` — function — line 205
  - domain: items-player
  - role: Shared foreign-property preview/incident evaluator for merchant-horse use. Mount code reports threshold crossings; this owns social/trade commit.
- `evaluateMountedForeignUse` — function — line 157
- `FOREIGN_MERCHANT_HORSE_REMOVAL_DISTANCE` — const — line 16
- `FOREIGN_PROPERTY_MOUNT_REASON` — const — line 9
- `ForeignPropertyMountAction` — type — line 48
- `ForeignPropertyUse` — type — line 179
- `ForeignPropertyUseDeps` — type — line 190
- `isForeignPropertyBorrowingPermitted` — function — line 89
- `MerchantHorseForeignUse` — type — line 34
- `MountedForeignUseEvaluation` — type — line 147
- `MountedPropertyIncident` — type — line 39
- `previewForeignPropertyAction` — function — line 122
- `previewMerchantHorseMount` — function — line 113
  - domain: items-player
  - role: Derives action-level foreign-property consequence preview; does not own entity ownership.
- `resolveMerchantHorseForeignUse` — function — line 72
  - domain: items-player
  - role: Derives whether `animal` is the live unresolved merchant horse via `resolveMerchantHorseAnimal`; does not parse `merchant-horse-*` ids.
- `settlementMerchantNpc` — function — line 60
  - domain: items-player
  - role: Picks the settlement trader used for merchant-horse social/trade consequences; does not invent a second owner id on the animal.
- `UNAUTHORIZED_PROPERTY_MARKUP_MILD` — const — line 22
- `UNAUTHORIZED_PROPERTY_MARKUP_NEUTRAL` — const — line 23
- `UNAUTHORIZED_PROPERTY_MARKUP_POOR` — const — line 24
- `UNAUTHORIZED_PROPERTY_RELATION_DELTA` — const — line 20
- `unauthorizedPropertyMarkup` — function — line 97

## `items/HeldTool.ts`

- `createHeldTool` — function — line 95
  - domain: items-player
  - system: held-tool
  - role: Tracks which single tool/weapon instance is currently equipped in hand.
  - uses: Inventory
- `HeldTool` — type — line 63
- `isToolKind` — function — line 59
- `ToolKind` — type — line 7

## `items/heldToolVisual.ts`

- `BRANCH_HELD_ATTACH` — const — line 272
- `createHeldToolObject` — function — line 390
- `findRightHandSocket` — function — line 362
- `findUbcLeftHandSocket` — function — line 367
- `HELD_ATTACH` — const — line 45
- `HELD_GLB` — const — line 293
- `HeldAttach` — type — line 18
- `HeldMountContext` — type — line 348
- `mountAttachOnSocket` — function — line 464
- `mountHeldToolOnSocket` — function — line 418
- `preloadHeldToolModels` — function — line 371
- `TORCH_BELT_CARRY_ATTACH` — const — line 286
  - domain: items-player

## `items/Inventory.ts`

- `DEFAULT_MAX_SIZE` — const — line 66
- `effectiveCarriedInstanceWeight` — function — line 133
  - domain: items-player
- `EMPTY_INVENTORY_CONTENTS` — const — line 152
- `Inventory` — class — line 171
  - domain: items-player
  - system: inventory
  - role: Owns item ownership: stack counts, item instances and perishable food batches.
  - owns: FoodBatch
  - produces: SaveItemInstance
- `InventoryContentsSnapshot` — type — line 146
- `inventoryFromContents` — function — line 755
- `inventoryFullToastText` — function — line 774
- `inventoryFullToastTextForInstance` — function — line 787
- `ItemAmount` — type — line 71
- `SaveItemInstance` — type — line 85
- `snapshotInventoryContents` — function — line 745
- `toSaveItemInstance` — function — line 105

## `items/inventoryItemReadAction.ts`

- `inventoryItemReadAction` — function — line 15
  - domain: items-player
- `InventoryItemReadAction` — type — line 4

## `items/inventoryTransfer.ts`

- `transferAllInventoryContents` — function — line 69
- `transferInventoryCount` — function — line 19
  - domain: items-player
  - system: inventory
- `transferInventoryInstance` — function — line 40

## `items/inventoryView.ts`

- `buildInventoryGroups` — function — line 293
- `inventoryCountsForUi` — function — line 330
- `InventoryGroupView` — type — line 81
- `InventoryInstanceRow` — type — line 49
- `ITEM_METER_LABEL` — const — line 43
- `ItemMeterKind` — type — line 38

## `items/itemCatalog.ts`

- `AMMO_DAMAGE_TYPE` — const — line 2276
- `ammoDamageBonus` — function — line 2270
  - domain: items-player
- `ArmorConfig` — type — line 60
- `ARROW_DAMAGE_BONUS` — const — line 2255
- `BookTier` — type — line 216
- `CAPABILITY_KINDS` — const — line 2371
- `CAPABILITY_LABEL` — const — line 192
- `CAPABILITY_NEED_LABEL` — const — line 176
- `CONSUMABLE_KINDS_BY_NEED` — const — line 2411
- `ConsumableNeed` — type — line 207
- `consumeNeedNoun` — function — line 328
- `consumeVerbLabel` — function — line 319
- `DefenseConfig` — type — line 46
- `hasItemCapability` — function — line 2396
- `HOLDABLE_KINDS` — const — line 2362
- `INJURY_TREATMENT_KINDS` — const — line 2433
- `isArmorCatalogKind` — function — line 2349
- `isBodyArmorKind` — function — line 2355
- `isMeleeToolKind` — function — line 2343
- `isRangedTool` — function — line 2310
- `isThrowableKind` — function — line 2315
- `ITEM_CATALOG` — const — line 342
  - domain: items-player
  - system: item-catalog
  - role: Single source of truth for per-`ItemKind` gameplay flags and tool-capability gates.
  - owns: ItemCatalogEntry
- `ITEM_SYSTEM_ROADMAP` — const — line 2454
- `ItemCapability` — type — line 149
- `ItemCatalogEntry` — type — line 218
- `itemIsResilient` — function — line 2401
- `ItemSpawnKind` — type — line 16
- `itemTreatsPhysicalInjury` — function — line 2446
- `MeleeConfig` — type — line 27
- `NON_ITEM_PROPS` — const — line 2460
- `RangedConfig` — type — line 82
- `rangedConfigFromThrowable` — function — line 2322
- `resolveMeleeDamageType` — function — line 2303
  - domain: items-player
- `resolveProjectileDamageType` — function — line 2293
  - domain: items-player
- `ThrowableConfig` — type — line 126

## `items/itemDisplay.ts`

- `itemDisplayName` — function — line 15
  - domain: items-player

## `items/itemFuel.ts`

- `FUEL_ITEM_PRIORITY` — const — line 18
  - domain: items-player
  - system: item-fuel
  - role: Catalog-driven campfire fuel resolution (plan items-player-023) — the fuel counterpart of `hasItemCapability`/`findWithCapability`. `VillageFire` receives a resolved branch-equivalent contribution and never has to know which item kind produced it.
- `fuelValue` — function — line 23
- `isFuel` — function — line 27
- `selectFuelKind` — function — line 35

## `items/itemInstances.ts`

- `ARMOR_KIND_LIST` — const — line 36
- `ARMOR_KINDS` — const — line 54
- `ARMOR_QUALITIES` — const — line 58
- `ARMOR_QUALITY_LABELS` — const — line 60
- `ARMOR_QUALITY_RANK` — const — line 68
- `ArmorItemInstance` — type — line 75
- `ArmorKind` — type — line 19
- `ArmorQuality` — type — line 56
- `clamp01` — function — line 338
- `clampCampCondition` — function — line 272
- `cloneItemInstance` — function — line 343
- `createItemInstanceId` — function — line 288
- `createKeyInstance` — function — line 322
- `createTentInstance` — function — line 277
- `IDENTITY_ONLY_ITEM_KINDS` — const — line 298
- `INSTANCE_BACKED_KINDS` — const — line 308
- `isArmorItemInstance` — function — line 92
- `isArmorKind` — function — line 80
- `isArmorQuality` — function — line 84
- `isInstanceBackedKind` — function — line 326
- `isLiquidContainerInstance` — function — line 256
- `isLiquidContainerKind` — function — line 230
- `isRangedWeaponKind` — function — line 203
- `isTentItemInstance` — function — line 267
- `isTrapItemInstance` — function — line 334
- `isTrapKind` — function — line 330
- `isWeaponItemInstance` — function — line 243
- `isWeaponMaintenanceKind` — function — line 168
- `ItemInstance` — type — line 4
- `LIQUID_CONTAINER_KIND_LIST` — const — line 220
- `LIQUID_CONTAINER_KINDS` — const — line 228
- `LiquidContainerItemInstance` — type — line 250
- `LiquidContainerKind` — type — line 213
- `LiquidContent` — type — line 208
- `normalizeArmorQuality` — function — line 88
- `RANGED_WEAPON_KIND_LIST` — const — line 190
- `RANGED_WEAPON_KINDS` — const — line 201
- `RangedWeaponKind` — type — line 180
- `TentItemInstance` — type — line 262
- `TrapItemInstance` — type — line 11
- `TrapKind` — type — line 9
- `WEAPON_MAINTENANCE_KIND_LIST` — const — line 135
- `WEAPON_MAINTENANCE_KINDS` — const — line 166
- `WeaponItemInstance` — type — line 237
- `WeaponMaintenanceKind` — type — line 101

## `items/itemModels.ts`

- `cloneItemGlb` — function — line 198
- `ITEM_GLB_SPECS` — const — line 15
- `preloadItemGlbModels` — function — line 173

## `items/items.ts`

- `canCancelRestNow` — function — line 313
- `canCancelRestProgress` — function — line 284
- `createItemMesh` — function — line 1994
- `hasItemCategory` — function — line 261
- `hasItemKindCategory` — function — line 265
- `ITEM_DEFS` — const — line 317
- `ITEM_SIZE_UNITS` — const — line 234
- `ItemCategory` — type — line 225
- `ItemDef` — type — line 247
- `ItemKind` — type — line 6
- `ItemSize` — type — line 230
- `itemSizeUnits` — function — line 243
- `primaryItemCategory` — function — line 274
- `REST_CANCEL_PROGRESS_THRESHOLD` — const — line 282
- `REST_CANCEL_VIGOR_THRESHOLD` — const — line 294
- `restCancelAllowedByStartVigor` — function — line 301
- `tintBucketGlb` — function — line 2018

## `items/ItemSpawner.ts`

- `ItemSpawnPoint` — type — line 3
- `updateItemSpawnPoints` — function — line 19

## `items/itemUseView.ts`

- `ItemUseView` — type — line 18
  - domain: items-player
- `resolveConsumeUseView` — function — line 31
- `resolveReadBookUseView` — function — line 52

## `items/liquidContainer.ts`

- `addLiquidToContainer` — function — line 64
- `canDrinkFromLiquidContainer` — function — line 87
- `canFillLiquidContainer` — function — line 38
- `createLiquidContainerInstance` — function — line 34
- `drinkFromLiquidContainer` — function — line 98
- `emptyLiquidContainer` — function — line 109
- `fillLiquidContainer` — function — line 48
- `hasLiquidContent` — function — line 79
- `LIQUID_DENSITY_KG_PER_LITRE` — const — line 25
- `LIQUID_DRINK_PORTION_LITRES` — const — line 20
- `liquidContainerCapacity` — function — line 27
- `migrateLegacyWaterskinsToInstances` — function — line 143
- `pourLiquidFromContainer` — function — line 117

## `items/poisonedMeat.ts`

- `canPoisonMeat` — function — line 32
- `isPoisonMeatInputKind` — function — line 19
- `poisonMeat` — function — line 44
  - domain: items-player
- `PoisonMeatFailure` — type — line 12
  - domain: items-player
  - role: Player-side poisoned-meat transform (plan items-player-049) — one `poisonous_herb` plus one eligible raw meat → one `poisoned_meat`, preserving the source `FoodBatch` via freshness-aware inventory APIs.
- `PoisonMeatResult` — type — line 14
- `selectPoisonMeatInputKind` — function — line 24

## `items/primaryWeapons.ts`

- `createPrimaryWeaponSelection` — function — line 68
- `inventoryOwnsPrimaryWeaponChoice` — function — line 50
- `inventoryOwnsPrimaryWeaponKind` — function — line 41
- `isPrimaryMeleeAssignment` — function — line 96
- `isPrimaryRangedAssignment` — function — line 102
- `PrimaryWeaponChoice` — type — line 6
- `PrimaryWeaponSelection` — type — line 13
- `SavePrimaryWeaponChoice` — type — line 8

## `items/sensibleFood.ts`

- `resolveSensibleFoodKind` — function — line 66
  - domain: ui-input

## `items/tentPlacement.ts`

- `evaluateGroundPlacement` — function — line 96
- `evaluateOrientedGroundPlacement` — function — line 160
- `evaluateTentPlacement` — function — line 179
- `GroundPlacementInput` — type — line 15
- `GroundPlacementReason` — type — line 13
- `OrientedGroundPlacementInput` — type — line 113
- `PLACEMENT_WATER_MARGIN` — const — line 48
- `TENT_PLACEMENT_MESSAGE` — const — line 196
- `TENT_SETUP_DURATION_SEC` — const — line 194
- `TentPlacementInput` — type — line 30
- `TentPlacementReason` — type — line 3
- `WATER_MARGIN` — const — line 41

## `items/tentProp.ts`

- `createPlacedTentProp` — function — line 31
- `disposePlacedTentProp` — function — line 106
- `TENT_FOOTPRINT_RADIUS` — const — line 12
- `TENT_HEIGHT` — const — line 10
- `TENT_LENGTH` — const — line 8
- `TENT_WIDTH` — const — line 9
- `tentRestPose` — function — line 22
- `TentRestPose` — type — line 14

## `items/timedProcess.ts`

- `isProcessComplete` — function — line 31
- `ItemStackInput` — type — line 12
- `ItemStackOutput` — type — line 13
- `processCompletedAtDays` — function — line 27
- `processProgress` — function — line 36
- `TimedProcess` — type — line 15
- `TimedProcessKind` — type — line 10

## `items/trade.ts`

- `createAcquiredInstance` — function — line 201
- `InstanceSellResult` — type — line 40
- `OfferBuybackResolution` — type — line 44
- `OwnedGoodsPurchaseLine` — type — line 556
- `previewPricedPurchaseNetCoins` — function — line 368
- `previewTransactionNetCoins` — function — line 351
- `resolveOfferBuyback` — function — line 300
  - domain: settlements — merchant buyback for an entire offer basket plus the concrete instance ids settlement should remove for instance-backed kinds.
- `resolveOfferLineBuyback` — function — line 277
  - domain: settlements — deterministic merchant buyback for one offer row, using the same worst-condition instance selection that settlement will remove.
- `selectInstancesToSell` — function — line 235
- `selectInstanceToPlace` — function — line 250
- `sellInstancesForCoins` — function — line 828
- `settleMerchantStockTransaction` — function — line 499
- `settleOwnedGoodsBarterTransaction` — function — line 709
  - domain: settlements-npcs
- `settleOwnedGoodsPurchase` — function — line 656
- `settlePricedPurchase` — function — line 381
- `settleTransaction` — function — line 410
- `TradeResult` — type — line 38

## `items/tradeCatalog.ts`

- `armorQualityValueMultiplier` — function — line 324
  - domain: items-player
- `BASE_BUY_FACTOR` — const — line 303
  - domain: settlements — full-condition buy-from-NPC factor bounds (plan settlements-npcs-033) — a markup over `tradeValue` the player pays an ordinary NPC. `MIN_BUY_FACTOR` intentionally equals `MAX_SELL_FACTOR` so the best possible buy price never undercuts the best possible merchant buyback for the same nominal value — no standing can create a buy→sell(merchant) arbitrage loop.
- `BASE_SELL_FACTOR` — const — line 293
  - domain: settlements — full-condition sell factor bounds (plan settlements-006).
- `BROKEN_SELL_MULTIPLIER` — const — line 497
- `canSell` — function — line 395
- `fullConditionBuyFactor` — function — line 467
  - domain: settlements — social buy factor for player purchases from an ordinary NPC (plan settlements-npcs-033) — reuses the exact same `relationshipEffect`/`reputationEffect` inputs as merchant sell pricing, but *subtracted* rather than added: better relation/reputation must never raise what the player pays, worse standing must never lower it.
- `fullConditionSellFactor` — function — line 428
  - domain: settlements — sell factor for a full-condition item before durability scaling.
- `instanceNominalValue` — function — line 343
  - domain: items-player
- `isMerchantStock` — function — line 379
- `MAX_BUY_FACTOR` — const — line 305
- `MAX_SELL_FACTOR` — const — line 295
- `MERCHANT_PRICES` — const — line 22
- `MERCHANT_STOCK` — const — line 141
- `merchantInstancePrice` — function — line 355
  - domain: items-player
- `merchantPrice` — function — line 314
- `MIN_BUY_FACTOR` — const — line 304
- `MIN_SELL_FACTOR` — const — line 294
- `NEUTRAL_SELL_PRICE_CONTEXT` — const — line 285
  - domain: settlements — neutral social standing for merchant sell pricing.
- `npcInstanceSalePrice` — function — line 368
  - domain: items-player
- `npcSalePrice` — function — line 480
  - domain: settlements — player-buys-from-NPC unit price in coins for one ordinary trade-eligible good (plan settlements-npcs-033 §5/§6). Base value reuses the same catalog as merchant stock (`merchantPrice`, falling back to `tradeValue` for kinds the merchant doesn't stock) so no profession/dialogue code hardcodes its own price.
- `offerValue` — function — line 488
- `relationshipEffect` — function — line 404
  - domain: settlements — relation tier bonus in percentage points (0.01 = 1 pp).
- `reputationEffect` — function — line 417
  - domain: settlements — weighted reputation × renown amplification (percentage points).
- `resolveInstanceSellPrice` — function — line 500
  - domain: settlements — merchant buyback for a concrete item instance — price is derived, never stored.
- `roundSellPrice` — function — line 437
  - domain: settlements — deterministic integer coin rounding shared by stack and instance pricing.
- `sellPrice` — function — line 452
  - domain: settlements — merchant buyback for a stackable kind at full condition.
- `SellPriceContext` — type — line 307
- `tradeValue` — function — line 384

## `items/tradeGrievance.ts`

- `applyPurchaseMarkup` — function — line 24
  - domain: items-player
  - role: Integer coin price after a temporary purchase markup. `markup` 0 is identity so display and commit can share one helper.
- `createTradeGrievanceStore` — function — line 67
  - domain: items-player
  - role: Owns temporary merchant grievances only — not relation, reputation, or `MERCHANT_PRICES`.
- `isTradeGrievance` — function — line 29
- `isTradeGrievanceList` — function — line 40
- `TradeGrievance` — type — line 10
- `TradeGrievanceReason` — type — line 8
- `TradeGrievanceStore` — type — line 53
- `UNAUTHORIZED_PROPERTY_USE_DURATION_DAYS` — const — line 4

## `items/trapItemInstances.ts`

- `createTrapInstance` — function — line 6
- `isPlaceableTrapInstance` — function — line 44
- `trapConditionPercent` — function — line 40
- `trapConditionRatio` — function — line 33
- `trapInstanceFromWorld` — function — line 15
- `trapMaxDurability` — function — line 28

## `items/treasureGameplay.ts`

- `applyTreasureContentsLosses` — function — line 316
- `BLADE_TRAP_DAMAGE` — const — line 18
- `CAVE_FINAL_COIN_MAX` — const — line 29
- `CAVE_FINAL_COIN_MIN` — const — line 28
- `CAVE_FINAL_GOLD_MAX` — const — line 31
- `CAVE_FINAL_GOLD_MIN` — const — line 30
- `CAVE_SIDE_COIN_MAX` — const — line 27
- `CAVE_SIDE_COIN_MIN` — const — line 26
- `commitForcedEntry` — function — line 383
- `describeTreasureContainerInteraction` — function — line 331
- `EMPTY_TREASURE_MUTATION` — const — line 67
- `FORCE_ENTRY_DURATION_SEC` — const — line 19
- `ForcedEntryCommitInput` — type — line 357
- `ForcedEntryCommitResult` — type — line 366
- `GEMSTONE_KINDS` — const — line 39
- `GemstoneKind` — type — line 48
- `generateTreasureLoot` — function — line 203
- `GenerateTreasureLootOptions` — type — line 35
- `getTreasureMutation` — function — line 148
- `isGemstoneKind` — function — line 136
- `mutationIsDefault` — function — line 155
- `pryingQuality` — function — line 144
- `quantizeStrength` — function — line 140
- `resolveFireSeverity` — function — line 276
- `resolveMechanicalResult` — function — line 252
- `resolveTreasureLockDifficulty` — function — line 248
- `resolveTreasureTrap` — function — line 241
- `selectDestroyedContents` — function — line 300
- `serializeTreasureMutations` — function — line 164
- `snapshotTreasureContents` — function — line 290
- `TREASURE_COIN_MAX` — const — line 17
- `TREASURE_COIN_MIN` — const — line 16
  - domain: items-player
- `TreasureChestMutation` — type — line 60
- `TreasureContainerInteraction` — type — line 325
- `TreasureContentsSnapshot` — type — line 286
- `TreasureFireSeverity` — type — line 52
- `TreasureForceCapabilitySnapshot` — type — line 54
- `TreasureLootProfile` — type — line 33
- `TreasureMechanicalResult` — type — line 51
- `TreasureTrapType` — type — line 50
- `treasureWorldContainerPrompt` — function — line 344

## `items/upperTierIdentities.ts`

- `diagnoseUpperTierOwnerRows` — function — line 63
- `isUpperTierIdentity` — function — line 32
- `isUpperTierIssuanceSnapshot` — function — line 44
- `UPPER_TIER_FACTORY_ACCESS` — const — line 30
- `UPPER_TIER_IDENTITY_LIST` — const — line 7
  - domain: items-player
  - system: equipment
- `UpperTierIdentity` — type — line 24
- `UpperTierIssuanceRecord` — type — line 36
- `UpperTierIssuanceSnapshot` — type — line 42
- `validateUpperTierOwnerRows` — function — line 55

## `items/upperTierIssuance.ts`

- `ClaimUpperTierInput` — type — line 16
- `claimUpperTierInstance` — function — line 49
  - domain: items-player
  - system: equipment
- `isUpperTierIssuanceLedger` — function — line 112
- `markUpperTierDestroyed` — function — line 101
  - domain: items-player
  - system: equipment
- `UpperTierIssuance` — type — line 8
- `UpperTierIssuanceLedger` — type — line 14
- `validateUpperTierOwnership` — function — line 124
  - domain: items-player
  - system: equipment

## `items/v3Equipment/adapter.ts`

- `EquipmentProjection` — type — line 17
- `projectV3Equipment` — function — line 26

## `items/v3Equipment/catalogue.ts`

- `findV3EquipmentDefinition` — function — line 2347
- `V3_EQUIPMENT_DEFINITIONS` — const — line 17

## `items/v3Equipment/compatibility.ts`

- `CanonicalV3Id` — type — line 110
- `Classification` — type — line 8
- `CompatibilityEntry` — interface — line 113
- `IdentityRelation` — type — line 9
- `matchesReviewedPolicy` — function — line 136
- `V1_VERIFICATION_REVISION` — const — line 111
- `V3_EQUIPMENT_COMPATIBILITY` — const — line 157

## `items/v3Equipment/compatibilityTypes.ts`

- `CompatibilityDecision` — interface — line 20
- `EquipmentCompatibilityResult` — type — line 45
- `EquipmentPropertyPath` — type — line 7
- `PropertyCompatibility` — interface — line 11
- `VerifiedV1Target` — interface — line 27

## `items/v3Equipment/propertyCompatibility.ts`

- `PROPERTY_CLASSES` — const — line 6
- `propertyCompatibilityFor` — function — line 31
- `propertyPaths` — function — line 23

## `items/v3Equipment/provenance.ts`

- `EquipmentFamilyCounts` — interface — line 1
- `V3_EQUIPMENT_PROVENANCE` — const — line 51
- `V3EquipmentProvenance` — interface — line 11

## `items/v3Equipment/types.ts`

- `AmmoItem` — interface — line 84
- `AmmoKind` — type — line 45
- `ArmorFamily` — type — line 110
- `ArmorItem` — interface — line 114
- `ArmorLayer` — type — line 109
- `ArmorSlot` — type — line 108
- `DamageType` — type — line 6
- `Grip` — type — line 44
- `ItemAvailability` — type — line 13
- `ItemBase` — interface — line 21
- `ItemCategory` — type — line 8
- `ItemMaterial` — type — line 9
- `ItemOrigin` — type — line 14
- `ItemTier` — type — line 11
- `LegacyIds` — interface — line 16
- `MeleeClass` — type — line 41
- `MeleeWeapon` — interface — line 61
- `RangedClass` — type — line 42
- `RangedWeapon` — interface — line 70
- `Resist` — type — line 112
- `ShieldClass` — type — line 92
- `ShieldItem` — interface — line 94
- `SizeClass` — type — line 7
- `V3EquipmentDefinition` — type — line 125
- `WeaponCapability` — type — line 46
- `WeaponClass` — type — line 43
- `WeaponItem` — type — line 82

## `items/v3Equipment/validation.ts`

- `DeepReadonly` — type — line 10
- `V1Definitions` — interface — line 12
- `validateEquipmentCompatibility` — function — line 81

## `items/weaponMaintenance.ts`

- `applySharpnessWear` — function — line 118
- `createWeaponInstance` — function — line 95
- `createWeaponInstance` — function — line 96
- `createWeaponInstance` — function — line 97
- `createWeaponInstance` — function — line 98
- `getSharpnessDamageModifier` — function — line 81
- `getWeaponMaintenanceProfile` — function — line 66
- `listOwnedWeaponMaintenance` — function — line 30
- `migrateWeaponCountsToInstances` — function — line 157
- `OwnedWeaponMaintenance` — type — line 21
- `SharpenResult` — type — line 129
- `SharpenSource` — type — line 19
- `sharpenWeapon` — function — line 135
- `weaponDurabilityPercent` — function — line 107
- `WeaponMaintenanceProfile` — type — line 50
- `weaponSharpnessPercent` — function — line 111

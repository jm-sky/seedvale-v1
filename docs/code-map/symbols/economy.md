# Symbols

Generated from exported TypeScript symbols.

## `economy/development.ts`

- `DevelopmentDef` — type — line 5
- `DevelopmentStatus` — type — line 3
- `WOODSHED_DEVELOPMENT` — const — line 14

## `economy/foodTransportDemand.ts`

- `committedIncomingFood` — function — line 26
- `committedOutgoingFood` — function — line 47
- `committedOutgoingSettlementFood` — function — line 92
  - domain: settlements-npcs
- `uncommittedHouseholdFoodSurplus` — function — line 76
- `uncommittedSettlementFoodSurplus` — function — line 114
  - domain: settlements-npcs
- `uncoveredSettlementFoodShortage` — function — line 68

## `economy/initial.ts`

- `demandsFor` — function — line 106
- `initialFoodFor` — function — line 97
- `initialStockFor` — function — line 69
- `SettlementEconomySeed` — type — line 8

## `economy/interSettlementFoodTransport.ts`

- `InterSettlementFoodOpportunity` — type — line 39
- `InterSettlementTransportHooks` — type — line 33
- `isCrossSettlementStorageOrder` — function — line 72
- `KnownSettlementEconomyRef` — type — line 25
  - domain: settlements-npcs
- `matchInterSettlementFoodOpportunity` — function — line 86
  - domain: settlements-npcs
- `selectConcreteFoodGoods` — function — line 52
  - domain: settlements-npcs

## `economy/kinds.ts`

- `ECONOMIC_KINDS` — const — line 15
- `EconomicKind` — type — line 13
- `EconomicSourceId` — type — line 30
- `isEconomicKind` — function — line 17

## `economy/localExchange.ts`

- `claimEconomySurplus` — function — line 34
- `claimHouseholdSurplus` — function — line 24

## `economy/npcWork.ts`

- `commitBlacksmithProduction` — function — line 71
  - domain: settlements-npcs
- `commitDressingProduction` — function — line 116
  - domain: settlements-npcs
- `commitHunterArrowProduction` — function — line 49
- `commitHunterBowProduction` — function — line 60
  - domain: settlements-npcs
- `commitRoleWork` — function — line 35
- `commitTextileWorkProduction` — function — line 107
  - domain: settlements-npcs
- `commitWoodcutterDeposit` — function — line 24
- `commitWoolMaterialProduction` — function — line 94
  - domain: settlements-npcs
- `tryAdvanceDevelopment` — function — line 124

## `economy/oreTransportDemand.ts`

- `committedIncomingOre` — function — line 42
- `committedOutgoingOre` — function — line 62
- `creditDeliveredOreToStock` — function — line 154
  - domain: settlements-npcs
- `isOreTransportKind` — function — line 27
- `ORE_TRANSPORT_KINDS` — const — line 21
  - domain: settlements-npcs
- `ORE_TRANSPORT_MAX_TRANSFER` — const — line 25
- `OreTransportKind` — type — line 22
- `sourcedDeliveryProvenance` — function — line 134
- `SourcedOreDeliveryProvenance` — type — line 124
- `uncommittedResourceSiteOre` — function — line 98
- `uncoveredOreProductionNeed` — function — line 82

## `economy/production.ts`

- `ARROWS_FROM_BEAM_PRODUCTION` — const — line 91
- `ARROWS_FROM_BRANCH_PRODUCTION` — const — line 82
- `BLACKSMITH_AXE_PRODUCTION` — const — line 246
- `BLACKSMITH_BATTLE_AXE_PRODUCTION` — const — line 272
- `BLACKSMITH_CHAINMAIL_PRODUCTION` — const — line 265
- `BLACKSMITH_DAMASCUS_KNIFE_PRODUCTION` — const — line 279
- `BLACKSMITH_IRON_ROD_PRODUCTION` — const — line 213
  - domain: settlements-npcs
- `BLACKSMITH_KNIFE_PRODUCTION` — const — line 243
- `BLACKSMITH_LONG_SWORD_PRODUCTION` — const — line 255
- `BLACKSMITH_MASTERWORK_SWORD_PRODUCTION` — const — line 286
- `BLACKSMITH_ORDER_PRODUCTIONS` — const — line 301
  - domain: settlements-npcs
- `BLACKSMITH_PAULDRON_PRODUCTION` — const — line 258
- `BLACKSMITH_PICKAXE_PRODUCTION` — const — line 249
- `BLACKSMITH_SHORT_SWORD_PRODUCTION` — const — line 252
- `DRESSING_PRODUCTION` — const — line 316
- `FARMING_PRODUCTION` — const — line 52
- `FISHING_PRODUCTION` — const — line 59
- `FLAX_LINEN_PRODUCTION` — const — line 179
- `householdTradeBowCount` — function — line 152
  - domain: settlements-npcs
- `HUNTER_ARROW_PRODUCTIONS` — const — line 101
- `HUNTER_BOW_PRODUCTIONS` — const — line 135
- `HUNTER_BOW_STOCK_CAP` — const — line 141
- `LINEN_BANDAGE_PRODUCTION` — const — line 189
- `MINING_PRODUCTION` — const — line 66
- `produceFirstAvailableItemRecipe` — function — line 354
- `ProductionDef` — type — line 15
- `productionDefById` — function — line 406
- `productionForRole` — function — line 373
- `SHORT_BOW_FROM_BEAM_PRODUCTION` — const — line 125
- `SHORT_BOW_FROM_BRANCH_PRODUCTION` — const — line 116
  - domain: settlements-npcs
- `TEXTILE_WORKER_PRODUCTIONS` — const — line 199
- `WOODCUTTING_PRODUCTION` — const — line 41
- `WOOL_MATERIAL_PRODUCTION` — const — line 169
  - domain: settlements-npcs

## `economy/productionExecutor.ts`

- `executeProduction` — function — line 143
  - domain: settlements-npcs
- `preflightProductionInputs` — function — line 71
  - domain: settlements-npcs
- `ProductionBlockedCategory` — type — line 32
- `ProductionContext` — type — line 16
  - domain: settlements-npcs
- `ProductionFailureReason` — type — line 34
- `ProductionResult` — type — line 46
  - domain: settlements-npcs

## `economy/productionShortage.ts`

- `applyProductionOutcome` — function — line 91
  - domain: settlements-npcs
- `clearProductionShortageByRecipe` — function — line 73
- `isProductionShortagePersistent` — function — line 41
- `loadProductionShortages` — function — line 182
- `observeProductionShortage` — function — line 53
  - domain: settlements-npcs
- `PRODUCTION_SHORTAGE_PERSISTENCE_SEC` — const — line 30
- `productionShortageKey` — function — line 32
- `ProductionShortageRecord` — type — line 19
  - domain: settlements-npcs
- `ProductionShortageRevalidateContext` — type — line 111
- `revalidateProductionShortages` — function — line 124
  - domain: settlements-npcs
- `snapshotProductionShortages` — function — line 176

## `economy/registry.ts`

- `createEconomyRegistry` — function — line 19
- `EconomyRegistry` — type — line 9

## `economy/settlementEconomy.ts`

- `createSettlementEconomy` — function — line 141
- `SettlementDemand` — type — line 30
- `SettlementEconomy` — type — line 71
  - domain: settlements
  - system: settlement-economy
  - role: Owns a settlement's bulk stock, demand-driven shortage/surplus, reservations and (plan settlements-004) source-attributed stock, realization and entitlement accrual. Not player `Inventory`.
  - owns: SettlementEconomy
- `SettlementEconomySnapshot` — type — line 48

## `economy/sourceLedger.ts`

- `ClaimResult` — type — line 95
- `createSourceAccounting` — function — line 136
- `EstablishEntitlementInput` — type — line 89
- `RealizationResult` — type — line 73
- `RealizeAttributedInput` — type — line 62
- `SourceAccounting` — type — line 119
  - domain: settlements
  - system: source-accounting
  - role: Owns one settlement economy's source-unrealized ledger, exact-once realization records and persistent entitlement accrual/claim state.
  - owns: SourceAccounting
- `SourceAccountingSnapshot` — type — line 56
- `SourceEntitlement` — type — line 33
  - domain: settlements
- `SourceEntitlementBeneficiary` — type — line 23
  - domain: settlements
- `sourceEntitlementId` — function — line 108
- `SourceEntitlementSnapshot` — type — line 42
- `SourceRealizationSnapshot` — type — line 44

## `economy/stock.ts`

- `EconomicStock` — class — line 12
- `StockAmount` — type — line 3

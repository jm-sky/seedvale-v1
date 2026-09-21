# Symbols

Generated from exported TypeScript symbols.

## `persistence/db.ts`

- `DB_NAME` — const — line 13
  - domain: persistence
  - system: worldgen-cache
  - role: Shared IndexedDB open/upgrade seam for the whole `seedvale` database.
  - integration: `saveDb.ts` keeps owning save-slot semantics against the `saves` store; `seedDb.ts`/`worldgenCacheDb.ts` (plan world-015) own the `seeds`/`worldgenCache` stores added here. Every caller still opens and closes its own connection per operation (same lifecycle `saveDb.ts` already used) — this module only centralizes `DB_NAME`/`DB_VERSION` and the `onupgradeneeded` store creation so a version bump can never leave one store owner unaware of another's schema.
- `DB_VERSION` — const — line 14
- `openSeedvaleDb` — function — line 28
- `SAVES_STORE` — const — line 16
- `SEEDS_STORE` — const — line 17
- `WORLDGEN_CACHE_BY_SEED_INDEX` — const — line 22
- `WORLDGEN_CACHE_STORE` — const — line 18

## `persistence/saveData.ts`

- `CURRENT_SAVE_VERSION` — const — line 762
- `isSaveData` — function — line 2889
- `loadSaveData` — function — line 2985
- `loadStoredSave` — function — line 4394
- `migrateStoredSave` — function — line 4357
- `SaveBadges` — type — line 248
- `SaveBedroll` — type — line 590
- `SaveCarriedContainer` — type — line 426
- `SaveCart` — type — line 187
- `SaveCompletedTerrainPreparation` — type — line 493
- `SaveConfig` — type — line 67
- `SaveConstructionContractTarget` — type — line 675
- `SaveContractTarget` — type — line 684
- `SaveData` — type — line 774
  - domain: persistence
  - system: save-schema
  - role: Owns the SaveData shape and its validation/defaulting.
  - owns: SaveData
- `SaveDroppedItem` — type — line 132
- `SaveDryingRack` — type — line 363
- `SaveExpeditionDestinationRef` — type — line 708
- `SaveExpeditionEscortContractScope` — type — line 724
- `SaveExpeditionEscortDestination` — type — line 711
- `SaveExpeditionEscortTerms` — type — line 716
- `SaveFireResidue` — type — line 147
- `SaveFishingBait` — type — line 386
- `SaveFoodBatch` — type — line 120
- `SaveGuardClaimState` — type — line 194
- `SaveHive` — type — line 372
- `SaveLocationKnowledge` — type — line 223
- `SaveMap` — type — line 225
- `SaveMeasurableWorkContractScope` — type — line 693
- `SaveMigration` — type — line 2999
- `SaveMineableRockState` — type — line 418
- `SavePalisadeContractTarget` — type — line 681
- `SavePalisadeSegment` — type — line 551
- `SavePlacedContainer` — type — line 392
- `SavePlacedFire` — type — line 137
- `SavePlacedTent` — type — line 174
- `SavePlacedTrap` — type — line 321
- `SavePlantedCrop` — type — line 517
- `SavePlantedTree` — type — line 503
- `SavePlatform` — type — line 606
- `SavePlayer` — type — line 88
- `SavePlayerGarden` — type — line 625
- `SavePlayerHealth` — type — line 80
- `SavePlayerNeeds` — type — line 302
- `SavePlayerTorch` — type — line 168
- `SavePlayerTrough` — type — line 555
- `SavePlayerWell` — type — line 445
- `SaveQuests` — type — line 114
- `SaveReputation` — type — line 269
- `SaveResidentialBuilding` — type — line 572
- `SaveResidentialBuildingContractTarget` — type — line 683
- `SaveResidentialOwner` — type — line 564
- `SaveSettlementBadgeProgress` — type — line 257
- `SaveSkill` — type — line 313
- `SaveSkills` — type — line 314
- `SaveSocialNews` — type — line 294
- `SaveSocialNewsEvent` — type — line 277
- `SaveSpawnPoint` — type — line 339
- `SaveStandingTorch` — type — line 533
- `SaveStandingTorchContractTarget` — type — line 682
- `SaveTerrainModification` — type — line 468
- `SaveTerrainPreparation` — type — line 479
- `SaveTerrainPreparationContractTarget` — type — line 678
- `SaveTimedProcess` — type — line 353
- `SaveTreasureChestMutation` — type — line 405
- `SaveTreeOverride` — type — line 155
- `SaveWorkContract` — type — line 752
- `SaveWorkContractAdvertisement` — type — line 660
- `SaveWorkContractAssignment` — type — line 661
- `SaveWorkContractAssignmentState` — type — line 650
- `SaveWorkContractScope` — type — line 729
- `SaveWorkContractState` — type — line 642
- `SaveWorldFlags` — type — line 201
- `StoredSaveResult` — type — line 4383

## `persistence/saveDb.ts`

- `beginNewSave` — function — line 142
- `createSave` — function — line 368
  - role: Creates a brand-new named slot from `data`.
  - integration: Same outgoing-validation guard as `writeSave()` (plan persistence-004 §1) — an invalid `data` must not be allowed to create a slot that would immediately be excluded from `listSaves()` again.
- `CreateSaveResult` — type — line 32
- `deleteSave` — function — line 416
- `getActiveSaveId` — function — line 115
- `getPendingNewSaveName` — function — line 133
- `listSaveManagementEntries` — function — line 243
- `listSaves` — function — line 230
- `listSavesResult` — function — line 204
- `ListSavesResult` — type — line 200
- `readSave` — function — line 264
- `renameSave` — function — line 393
- `SaveManagementResult` — type — line 239
- `SaveReason` — type — line 51
- `setActiveSaveId` — function — line 124
- `setPendingNewSaveName` — function — line 137
- `writeSave` — function — line 309
  - domain: persistence
  - role: Writes `data` into the active (or given) named slot.
  - integration: Never overwrites a slot whose existing record is present but fails to parse, has no known migration path, or is a newer unsupported version — see `docs/plans/persistence-002-save-integrity-guard.md` and `docs/plans/persistence-003-save-schema-versioning-and-migrations.md`. A slot with no existing record still gets created normally. Also refuses an outgoing `data` that fails current-schema validation before any destructive `storePut()` (plan persistence-004 §1) — a TypeScript `SaveData` type alone doesn't rule out a runtime-invalid value (e.g. an enum-like field outside its validated set) reaching persistence.
- `WriteSaveError` — type — line 43
- `WriteSaveResult` — type — line 44

## `persistence/saveSlots.ts`

- `ACTIVE_SAVE_ID_KEY` — const — line 6
- `assertCanCreateSave` — function — line 174
- `CreateSaveError` — type — line 24
- `DEFAULT_SAVE_NAME_PREFIX` — const — line 8
- `formatSaveDay` — function — line 183
- `generateSaveId` — function — line 30
- `InspectedSaveSlot` — type — line 56
- `inspectStoredSave` — function — line 62
- `isSaveSlotEnvelope` — function — line 34
- `LEGACY_DEFAULT_SAVE_NAME` — const — line 7
- `LEGACY_SAVE_KEY` — const — line 5
- `legacyNameFromSave` — function — line 44
- `MAX_SAVES` — const — line 3
- `NameValidation` — type — line 26
- `nextDefaultSaveName` — function — line 166
- `parseStoredSave` — function — line 102
- `pickActiveSaveId` — function — line 122
- `resolvePauseActiveSaveName` — function — line 134
  - domain: persistence
  - role: Pause-menu save identity from pending new-game name or an existing slot.
  - integration: `pendingNewSaveName` is explicit New Game state (`beginNewSave`) and must win over `pickActiveSaveId()`'s fallback to the newest stored slot.
- `SAVE_NAME_MAX_LENGTH` — const — line 4
- `saveErrorMessage` — function — line 187
- `SaveManagementEntry` — type — line 79
- `SaveSlotEnvelope` — type — line 10
- `SaveSlotInfo` — type — line 15
- `sortSaveManagementEntries` — function — line 90
- `sortSavesByRecency` — function — line 118
- `toSaveManagementEntry` — function — line 83
- `toSaveSlotInfo` — function — line 107
- `UnhealthySaveStatus` — type — line 77
- `unhealthySaveStatusLabel` — function — line 96
- `validateSaveName` — function — line 149
- `wrapSave` — function — line 40

## `persistence/seedDb.ts`

- `deleteSeedRecord` — function — line 124
- `getSeedRecord` — function — line 61
- `listSeedRecords` — function — line 47
- `putSeedRecord` — function — line 77
- `renameSeedRecord` — function — line 101
- `touchSeedLastUsed` — function — line 95
- `updateSeedDescription` — function — line 108
- `updateSeedTags` — function — line 115

## `persistence/seedRecord.ts`

- `displaySeedName` — function — line 24
- `isSeedRecord` — function — line 32
- `minimalSeedRecord` — function — line 48
- `SeedRecord` — type — line 9
  - domain: persistence
  - system: seed-library
  - role: Owns the `SeedRecord` shape and its validation (plan world-015 §1/§9).
  - integration: `SaveData.config.seed` (`saveData.ts`) stays the authoritative world identity for a given save; a `SeedRecord` is optional/manageable catalog metadata for the same number, never a requirement to load a save.

## `persistence/worldgenCacheDb.ts`

- `cacheKey` — function — line 29
- `CacheRecord` — type — line 16
  - domain: persistence
  - system: worldgen-cache
  - role: Generic `(seed, namespace, version, key) -> payload` disposable derived-data store (plan world-015 §11/§12) — a persistence primitive, never a source of world truth. A namespace owner (e.g. `world/locations/locationsCoarseCache.ts`) decides its own payload shape, fingerprint and versioning; this module only knows how to store/retrieve/ bound it.
  - integration: Runtime correctness must never depend on this succeeding — a read miss or write failure always falls back to normal procedural generation at the call site.
- `countCacheForSeed` — function — line 161
- `deleteCacheForSeed` — function — line 144
- `deleteCacheRecords` — function — line 108
  - domain: persistence
  - system: worldgen-cache
- `enforceCacheCap` — function — line 184
- `getCacheRecord` — function — line 81
  - domain: persistence
  - system: worldgen-cache
- `listCacheRecords` — function — line 57
- `putCacheRecords` — function — line 127

## `persistence/worldgenFingerprint.ts`

- `hashString` — function — line 28
- `stableStringify` — function — line 16
  - domain: persistence
  - system: worldgen-cache
  - role: The one stable-fingerprint primitive every worldgen-cache namespace owner uses to turn its deterministic inputs into the `fingerprint` field of a `CacheRecord` (plan world-015 §8). Namespace owners decide *what* goes into the fingerprint; this module only decides how a value becomes a stable string.
  - integration: A fingerprint mismatch is always a plain cache miss, never a migration and never a correctness problem — so this hash may be cheap and non-cryptographic.
- `worldgenFingerprint` — function — line 43

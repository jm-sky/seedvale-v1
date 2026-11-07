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

- `CURRENT_SAVE_VERSION` — const — line 782
- `isSaveData` — function — line 3044
- `loadSaveData` — function — line 3144
- `loadStoredSave` — function — line 4815
- `LoadStoredSaveOptions` — type — line 4805
- `migrateStoredSave` — function — line 4767
- `SaveBadges` — type — line 262
- `SaveBedroll` — type — line 610
- `SaveCarriedContainer` — type — line 446
- `SaveCart` — type — line 194
- `SaveCompletedTerrainPreparation` — type — line 513
- `SaveConfig` — type — line 70
- `SaveConstructionContractTarget` — type — line 695
- `SaveContractTarget` — type — line 704
- `SaveData` — type — line 794
  - domain: persistence
  - system: save-schema
  - role: Owns the SaveData shape and its validation/defaulting.
  - owns: SaveData
- `SaveDroppedItem` — type — line 139
- `SaveDryingRack` — type — line 383
- `SaveExpeditionDestinationRef` — type — line 728
- `SaveExpeditionEscortContractScope` — type — line 744
- `SaveExpeditionEscortDestination` — type — line 731
- `SaveExpeditionEscortTerms` — type — line 736
- `SaveFireResidue` — type — line 154
- `SaveFishingBait` — type — line 406
- `SaveFoodBatch` — type — line 127
- `SaveGuardClaimState` — type — line 201
- `SaveHive` — type — line 392
- `SaveLocationKnowledge` — type — line 230
- `SaveMap` — type — line 239
- `SaveMeasurableWorkContractScope` — type — line 713
- `SaveMigration` — type — line 3158
- `SaveMineableRockState` — type — line 438
- `SavePalisadeContractTarget` — type — line 701
- `SavePalisadeSegment` — type — line 571
- `SavePlacedContainer` — type — line 412
- `SavePlacedFire` — type — line 144
- `SavePlacedTent` — type — line 181
- `SavePlacedTrap` — type — line 335
- `SavePlantedCrop` — type — line 537
- `SavePlantedTree` — type — line 523
- `SavePlatform` — type — line 626
- `SavePlayer` — type — line 95
- `SavePlayerGarden` — type — line 645
- `SavePlayerHealth` — type — line 87
- `SavePlayerNeeds` — type — line 316
- `SavePlayerTorch` — type — line 175
- `SavePlayerTrough` — type — line 575
- `SavePlayerWell` — type — line 465
- `SaveQuests` — type — line 121
- `SaveReputation` — type — line 283
- `SaveResidentialBuilding` — type — line 592
- `SaveResidentialBuildingContractTarget` — type — line 703
- `SaveResidentialOwner` — type — line 584
- `SaveSettlementBadgeProgress` — type — line 271
- `SaveSkill` — type — line 327
- `SaveSkills` — type — line 328
- `SaveSocialNews` — type — line 308
- `SaveSocialNewsEvent` — type — line 291
- `SaveSpawnPoint` — type — line 353
- `SaveStandingTorch` — type — line 553
- `SaveStandingTorchContractTarget` — type — line 702
- `SaveTerrainModification` — type — line 488
- `SaveTerrainPreparation` — type — line 499
- `SaveTerrainPreparationContractTarget` — type — line 698
- `SaveTimedProcess` — type — line 373
- `SaveTreasureChestMutation` — type — line 425
- `SaveTreeOverride` — type — line 162
- `SaveWorkContract` — type — line 772
- `SaveWorkContractAdvertisement` — type — line 680
- `SaveWorkContractAssignment` — type — line 681
- `SaveWorkContractAssignmentState` — type — line 670
- `SaveWorkContractScope` — type — line 749
- `SaveWorkContractState` — type — line 662
- `SaveWorldFlags` — type — line 208
- `StoredSaveResult` — type — line 4796
- `upperTierOrphanClaimsFromSave` — function — line 1673
- `UpperTierOwnerRow` — type — line 1634
- `upperTierOwnerRowsFromSave` — function — line 1646
  - domain: persistence
  - system: save-schema

## `persistence/saveDb.ts`

- `beginNewSave` — function — line 142
- `createSave` — function — line 369
  - role: Creates a brand-new named slot from `data`.
  - integration: Same outgoing-validation guard as `writeSave()` (plan persistence-004 §1) — an invalid `data` must not be allowed to create a slot that would immediately be excluded from `listSaves()` again.
- `CreateSaveResult` — type — line 32
- `deleteSave` — function — line 417
- `getActiveSaveId` — function — line 115
- `getPendingNewSaveName` — function — line 133
- `listSaveManagementEntries` — function — line 243
- `listSaves` — function — line 230
- `listSavesResult` — function — line 204
- `ListSavesResult` — type — line 200
- `readSave` — function — line 264
- `renameSave` — function — line 394
- `SaveManagementResult` — type — line 239
- `SaveReason` — type — line 51
- `setActiveSaveId` — function — line 124
- `setPendingNewSaveName` — function — line 137
- `writeSave` — function — line 309
  - domain: persistence
  - role: Writes `data` into the active (or given) named slot.
  - integration: Never overwrites a slot whose existing record is present but fails to parse, has no known migration path, or is a newer unsupported version — see `docs/plans/archive/persistence-002-save-integrity-guard.md` and `docs/plans/archive/persistence-003-save-schema-versioning-and-migrations.md`. A slot with no existing record still gets created normally. Also refuses an outgoing `data` that fails current-schema validation before any destructive `storePut()` (plan persistence-004 §1) — a TypeScript `SaveData` type alone doesn't rule out a runtime-invalid value (e.g. an enum-like field outside its validated set) reaching persistence.
- `WriteSaveError` — type — line 43
- `WriteSaveResult` — type — line 44

## `persistence/saveSlots.ts`

- `ACTIVE_SAVE_ID_KEY` — const — line 7
- `assertCanCreateSave` — function — line 204
- `CreateSaveError` — type — line 25
- `DEFAULT_SAVE_NAME_PREFIX` — const — line 9
- `formatSaveDay` — function — line 213
- `generateSaveId` — function — line 31
- `InspectedSaveSlot` — type — line 57
- `inspectStoredSave` — function — line 64
- `isSaveSlotEnvelope` — function — line 35
- `LEGACY_DEFAULT_SAVE_NAME` — const — line 8
- `LEGACY_SAVE_KEY` — const — line 6
- `legacyNameFromSave` — function — line 45
- `MAX_SAVES` — const — line 4
- `NameValidation` — type — line 27
- `nextDefaultSaveName` — function — line 196
- `parseStoredSave` — function — line 132
- `pickActiveSaveId` — function — line 152
- `resolvePauseActiveSaveName` — function — line 164
  - domain: persistence
  - role: Pause-menu save identity from pending new-game name or an existing slot.
  - integration: `pendingNewSaveName` is explicit New Game state (`beginNewSave`) and must win over `pickActiveSaveId()`'s fallback to the newest stored slot.
- `SAVE_NAME_MAX_LENGTH` — const — line 5
- `saveErrorMessage` — function — line 217
- `SaveManagementEntry` — type — line 95
- `SaveSlotEnvelope` — type — line 11
- `SaveSlotInfo` — type — line 16
- `sortSaveManagementEntries` — function — line 112
- `sortSavesByRecency` — function — line 148
- `toSaveManagementEntry` — function — line 99
- `toSaveSlotInfo` — function — line 137
- `UnhealthySaveEntry` — type — line 87
- `UnhealthySaveStatus` — type — line 82
- `unhealthySaveStatusLabel` — function — line 118
- `validateSaveName` — function — line 179
- `wrapSave` — function — line 41

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
- `listAllCacheRecords` — function — line 205
- `listCacheRecords` — function — line 57
- `putCacheRecords` — function — line 127

## `persistence/worldgenEpoch.ts`

- `WORLDGEN_EPOCH` — const — line 38
  - domain: persistence
  - system: save-schema

## `persistence/worldgenFingerprint.ts`

- `hashString` — function — line 28
- `stableStringify` — function — line 16
  - domain: persistence
  - system: worldgen-cache
  - role: The one stable-fingerprint primitive every worldgen-cache namespace owner uses to turn its deterministic inputs into the `fingerprint` field of a `CacheRecord` (plan world-015 §8). Namespace owners decide *what* goes into the fingerprint; this module only decides how a value becomes a stable string.
  - integration: A fingerprint mismatch is always a plain cache miss, never a migration and never a correctness problem — so this hash may be cheap and non-cryptographic.
- `worldgenFingerprint` — function — line 43

## `persistence/worldgenFixture.ts`

- `clearWorldgenFixtureMarker` — function — line 181
- `exportWorldgenFixture` — function — line 153
- `filterFixtureRecords` — function — line 79
- `getWorldgenFixtureStats` — function — line 56
- `importWorldgenFixture` — function — line 93
- `isWorldgenFixtureEnabled` — function — line 61
- `WorldgenFixtureExport` — type — line 139
- `WorldgenFixtureIndex` — type — line 40
- `WorldgenFixtureIndexEntry` — type — line 27
- `WorldgenFixtureProfile` — type — line 25
  - domain: persistence
  - system: worldgen-cache
  - role: Boot-time import (and dev export) of a versioned worldgen cache fixture (plan tools-020): the benchmark seed and the reference seed ship their small worldgen cache namespaces in `public/worldgen-fixtures/`, so a fresh browser profile does not regenerate caves, settlement definitions and road routes during the loading phase.
  - integration: Runs before `createWorldBundle()` so every namespace owner's hydrate sees the records. Fingerprints are never checked or rewritten here — owners already treat a mismatch as a miss, so a stale fixture costs loading time, never correctness. Any failure resolves quietly and the world boots cold.
- `WorldgenFixtureStats` — type — line 42

## `persistence/worldgenFixtureCodec.ts`

- `decodeWorldgenFixture` — function — line 146
- `encodeWorldgenFixture` — function — line 118
- `FixtureTypedArrayKind` — type — line 19
- `gunzipBytes` — function — line 192
- `gzipBytes` — function — line 187
- `WORLDGEN_FIXTURE_FORMAT` — const — line 15
  - domain: persistence
  - system: worldgen-cache
  - role: Binary container for a worldgen cache boot fixture (plan tools-020): a JSON header plus one binary section, gzip-wrapped. Payload typed arrays are moved out of the JSON into the binary section (`{ $ta, offset, length }` references) because IndexedDB structured clone keeps them but JSON does not.
  - integration: Pure (no IndexedDB / fetch); `worldgenFixture.ts` owns import and export. Decoding never throws — corrupt input yields `null`.
- `WorldgenFixtureContents` — type — line 39
- `WorldgenFixtureHeader` — type — line 29

## `persistence/worldgenFixtureNamespaces.ts`

- `WORLDGEN_FIXTURE_NAMESPACES` — const — line 19
  - domain: persistence
  - system: worldgen-cache
  - role: Namespaces that may ship in a worldgen cache boot fixture (plan tools-020) with the owner's *current* version. The importer drops records of any other version (a stale-version record is never evicted by `enforceCacheCap()`), the exporter refuses namespaces not listed here, and `pnpm worldgen:fixture:check` compares `public/worldgen-fixtures/index.json` against it. `chunk-tiles` is deliberately absent (78 MB, no boot gain). A new namespace joins here deliberately, with its owner's constants.

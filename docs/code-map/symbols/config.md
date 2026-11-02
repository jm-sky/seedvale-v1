# Symbols

Generated from exported TypeScript symbols.

## `config/persistConfig.ts`

- `loadDomainConfigs` — function — line 116
- `loadStoredConfig` — function — line 141
- `saveAllDomains` — function — line 170
- `saveGraphics` — function — line 145
- `savePlayer` — function — line 153
- `saveWorld` — function — line 160
- `saveWorldConfig` — function — line 177
- `StoredConfig` — type — line 27
- `StoredGraphics` — type — line 10
- `StoredPlayer` — type — line 15
- `StoredWorld` — type — line 19

## `config/qualityProfiles.ts`

- `applyQualityKnobs` — function — line 124
- `applyQualityPreset` — function — line 155
- `DEFAULT_QUALITY_PRESET` — const — line 68
- `isQualityPreset` — function — line 70
- `knobsFromConfig` — function — line 74
- `knobsMatch` — function — line 102
- `matchQualityPreset` — function — line 117
- `QUALITY_PRESET_IDS` — const — line 65
- `QUALITY_PRESETS` — const — line 26
- `QualityKnobs` — type — line 11
- `QualityPreset` — type — line 5

## `config/worldConfig.ts`

- `AoQuality` — type — line 14
- `applyStoredPlayer` — function — line 520
- `applyStoredPostProcessing` — function — line 544
- `applyStoredQuality` — function — line 529
- `applyStoredSettlements` — function — line 407
- `applyStoredSky` — function — line 512
- `applyStoredTerrain` — function — line 422
- `createBenchmarkWorldConfig` — function — line 628
- `createWorldConfig` — function — line 572
- `DEFAULT_PLAYER_NAME` — const — line 180
- `defaultTerrainConfig` — function — line 565
- `DetailNormalConfig` — type — line 22
- `HomeVillageSize` — type — line 11
- `PLAYER_NAME_MAX_LENGTH` — const — line 183
- `PlayerNameError` — type — line 185
- `playerNameErrorMessage` — function — line 206
- `PlayerNameValidation` — type — line 187
- `triangleCount` — function — line 640
- `validatePlayerName` — function — line 198
  - domain: ui-input
- `WorldConfig` — type — line 50
  - domain: world
  - system: world-config
  - role: Owns terrain/graphics/gameplay tunables shared by the debug GUI, world-config screen and benchmark runner.
  - owns: WorldConfig

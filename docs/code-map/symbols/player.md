# Symbols

Generated from exported TypeScript symbols.

## `player/cameraBoom.ts`

- `CAMERA_BOOM_MIN_DISTANCE` — const — line 17
- `CAMERA_BOOM_PULL_IN` — const — line 20
- `CAMERA_GROUND_CLEARANCE` — const — line 4
- `CAMERA_OCCLUDER_HEIGHT` — const — line 13
- `CAMERA_OCCLUDER_MIN_RADIUS` — const — line 10
- `CAMERA_TERRAIN_SKIP_DISTANCE` — const — line 23
- `CameraBoomInput` — type — line 35
- `CameraBoomResult` — type — line 51
- `resolveCameraBoom` — function — line 69
- `withCaveFloorFallback` — function — line 386

## `player/characterPresentation.ts`

- `aggregateAttributeModifierBadges` — function — line 211
- `ATTRIBUTE_DISPLAY_SCALE` — const — line 45
  - domain: items-player
  - system: player-ui
  - role: Character Screen presentation snapshot (plan ui-input-013). Vue renders these views; it does not own modifier formulas or effective SPEA. Not persisted — rebuilt from authoritative player/condition/skill state.
- `buildCharacterAttributeViews` — function — line 232
- `buildCharacterConditionViews` — function — line 252
- `buildCharacterEquipmentSlotViews` — function — line 171
- `buildCharacterEquipmentView` — function — line 188
  - domain: items-player
- `buildCharacterPresentation` — function — line 317
- `buildCharacterSkillViews` — function — line 244
- `CharacterAttributeView` — type — line 66
- `CharacterConditionEffectView` — type — line 79
- `CharacterConditionView` — type — line 84
- `CharacterEquipmentSlotView` — type — line 93
- `CharacterEquipmentView` — type — line 102
- `CharacterModifierBadge` — type — line 61
- `CharacterPresentation` — type — line 118
- `CharacterSkillView` — type — line 73
- `equipmentSnapshotToCharacterView` — function — line 155
  - domain: items-player
- `NEUTRAL_CHARACTER_EQUIPMENT_VIEW` — const — line 137
- `toDisplayAttribute` — function — line 199
- `toDisplaySkill` — function — line 203

## `player/humanCarryCapacity.ts`

- `HUMAN_CARRY_NEUTRAL_KG` — const — line 30
- `HUMAN_CARRY_STRENGTH_NEUTRAL` — const — line 26
  - domain: items-player
  - system: human-carry-capacity
  - role: Maps resolved human Strength onto body carry capacity in kilograms.
- `humanBodyCarryCapacityKg` — function — line 32

## `player/medicalTreatment.ts`

- `BARE_HANDS_STABILIZE_BASE_HP` — const — line 32
  - domain: items-player
  - system: player-skills
- `MEDICAL_TREATMENT_DURATION_SEC` — const — line 35
- `medicalMaterialLabel` — function — line 214
- `MedicalTreatmentPlan` — type — line 64
- `medicalTreatmentPromptLabel` — function — line 136
- `resolveMedicalTreatmentPlan` — function — line 79
- `treatableFromInteractable` — function — line 204
- `treatableFromLivestock` — function — line 178
- `treatableFromNpc` — function — line 153
- `treatableFromPlayer` — function — line 140
- `TreatableTarget` — type — line 43
- `TreatableTargetKind` — type — line 37

## `player/medicinalTreatmentEffectiveness.ts`

- `MEDICINE_EFFECT_MULTIPLIER_MAX` — const — line 13
- `MEDICINE_EFFECT_MULTIPLIER_MIN` — const — line 12
  - domain: items-player
  - system: player-skills
- `resolveMedicinalTreatmentMultiplier` — function — line 21
- `scaleMedicinalTreatmentAmount` — function — line 41
- `SURVIVAL_SUPPORT_MULTIPLIER_MAX` — const — line 14

## `player/physicalWorkStrength.ts`

- `PHYSICAL_WORK_STRENGTH_NEUTRAL` — const — line 27
  - domain: items-player
  - system: physical-work-strength
  - role: Maps resolved Strength onto existing physical-work duration.
- `physicalWorkDuration` — function — line 35
- `physicalWorkSpeedMultiplier` — function — line 29

## `player/playerCombat.ts`

- `collectLivingCombatTargets` — function — line 117
- `collectRangedAnimalCandidates` — function — line 206
- `COMBAT_MODE_TIMEOUT_SEC` — const — line 13
- `createPlayerCombat` — function — line 305
- `filterLivingTargetsSightDisclosed` — function — line 55
- `filterRangedCandidatesBySpatialContext` — function — line 229
- `filterRangedCandidatesSightDisclosed` — function — line 74
- `filterWorldCycleTargets` — function — line 262
- `findLivingTargetById` — function — line 278
- `forEachLivingCombatAnimal` — function — line 97
  - domain: fauna
- `LivingCombatTarget` — type — line 15
- `livingTargetIdForAnimal` — function — line 82
- `livingTargetIdForNpc` — function — line 86
- `PlayerCombat` — type — line 23
- `RangedAnimalCandidate` — type — line 197
- `resolveLivingInteractable` — function — line 289
- `resolveRangedAimYaw` — function — line 249
- `SpatialContextAt` — type — line 115
- `tabCyclesLivingCombatTargets` — function — line 274
  - domain: ui-input

## `player/playerCombatMode.ts`

- `CombatWeaponCategory` — type — line 9
- `createPlayerCombatMode` — function — line 80
  - domain: ui-input
- `PlayerCombatMode` — type — line 34
  - domain: ui-input
  - system: player-combat-mode
  - role: Tracks whether the player currently has the configured primary melee or ranged weapon drawn, for HUD/keyboard draw-sheathe and future observers.
- `PlayerCombatModeHeld` — type — line 11
- `PlayerCombatModePrimaries` — type — line 16

## `player/PlayerController.ts`

- `CaveFloorSampler` — type — line 260
- `CaveGroundQuery` — type — line 255
- `CaveHorizontalResolver` — type — line 276
- `CaveOccupancyQuery` — type — line 265
- `ColliderSource` — type — line 248
- `HeightSampler` — type — line 233
- `MOVE_SPEED` — const — line 117
- `PLAYER_STARTING_ATTRIBUTES` — const — line 137
- `PlayerController` — class — line 290
  - domain: items-player
  - system: player-controller
  - role: Owns player movement, animation and runtime transform state.
  - simulation: tick
- `PlayerMovementState` — type — line 112
- `RuntimeGroundSampler` — type — line 239
- `RuntimeLocalWaterSampler` — type — line 245
- `SPRINT_MULTIPLIER` — const — line 122

## `player/playerDamage.ts`

- `applyDownedRecovery` — function — line 40
- `applyPlayerDamage` — function — line 97
  - domain: items-player
- `ApplyPlayerDamageParams` — type — line 81
- `DOWNED_DURATION_SEC` — const — line 28
- `DOWNED_RECOVERY_HP_MAX` — const — line 30
- `DOWNED_RECOVERY_HP_MIN` — const — line 29
- `PlayerDamageInput` — type — line 61
- `PlayerDamageResult` — type — line 50
- `rollDownedRecoveryHp` — function — line 32
- `tickPlayerStarvationDamage` — function — line 160

## `player/playerDimensions.ts`

- `PLAYER_COLLISION_RADIUS` — const — line 11
  - domain: items-player
- `PLAYER_HEIGHT` — const — line 12
- `rockCeilingMaxY` — function — line 17

## `player/playerEncumbrance.ts`

- `computeEncumbrance` — function — line 32
- `Encumbrance` — type — line 8

## `player/playerEquipmentVisual.ts`

- `PLAYER_UBC_KNIGHT_PAULDRON_ROUND_URL` — const — line 9
- `PLAYER_UBC_KNIGHT_PAULDRON_SPIKE_URL` — const — line 8
- `PLAYER_UBC_LEATHER_PAULDRON_URL` — const — line 6
- `PLAYER_UBC_RANGER_PAULDRON_URL` — const — line 7
- `PlayerEquipmentVisual` — type — line 21
- `PlayerEquipmentVisualAlignment` — type — line 15
- `PlayerEquipmentVisualTint` — type — line 13
- `resolvePlayerEquipmentVisual` — function — line 49
  - domain: items-player
- `resolvePlayerEquipmentVisualByUrl` — function — line 58
  - domain: items-player
- `resolvePlayerEquipmentVisualTintUrl` — function — line 68

## `player/playerMelee.ts`

- `AttackRequestResult` — type — line 64
- `COMBAT_TARGET_MEMORY` — const — line 42
- `createPlayerMelee` — function — line 122
- `FALLBACK_APPROACH_DISTANCE` — const — line 52
- `LUNGE_STAMINA_COST` — const — line 49
- `MAX_LUNGE_DISTANCE` — const — line 46
- `meleeSwingAngle` — function — line 259
- `MeleeTickResult` — type — line 37
- `pickCombatTarget` — function — line 177
- `PlayerMelee` — type — line 73
- `rankCombatTargets` — function — line 215
- `resolveMeleeWeaponSnapshot` — function — line 28

## `player/PlayerNeeds.ts`

- `applyRepresentedPhysicalEffortVigor` — function — line 174
- `BUSY_ACTION_STAMINA_COST_PER_SEC` — const — line 101
- `createPlayerNeeds` — function — line 235
- `DEHYDRATION_HP_PER_SEC` — const — line 208
- `drinkWater` — function — line 405
- `eatFood` — function — line 401
- `hungerSevereDurationSec` — function — line 194
- `isTakingDeprivationDamage` — function — line 413
- `physicalEffortBusyOptions` — function — line 151
- `PhysicalEffortIntensity` — type — line 109
- `physicalEffortStaminaCostPerSec` — function — line 137
- `physicalEffortVigorCostPerSec` — function — line 144
- `PLAYER_MAX_HUNGER` — const — line 46
- `PLAYER_MAX_STAMINA` — const — line 44
- `PLAYER_MAX_THIRST` — const — line 47
- `PLAYER_MAX_VIGOR` — const — line 45
- `PlayerNeeds` — type — line 35
  - domain: items-player
  - system: player-needs
  - role: Owns the player's stamina/vigor/hunger/thirst survival pools.
  - owns: PlayerNeeds
  - uses: StaminaState, VigorState
  - simulation: tick
- `representedPhysicalEffortVigorPerHour` — function — line 164
- `resetPlayerNeeds` — function — line 247
- `restoreNeedsFromSleep` — function — line 395
- `restorePersistedNeeds` — function — line 268
- `SPRINT_MIN_STAMINA` — const — line 83
- `SPRINT_RESUME_STAMINA` — const — line 84
- `STARVATION_HP_PER_SEC` — const — line 207
- `thirstSevereDurationSec` — function — line 197
- `tickHealthRegen` — function — line 423
- `tickPlayerMovementVigor` — function — line 373
- `tickPlayerNeeds` — function — line 293
- `tickPlayerStamina` — function — line 320
- `tickRidingStamina` — function — line 353
- `updateSprintOutOfBreath` — function — line 88

## `player/playerRanged.ts`

- `createPlayerRanged` — function — line 46
- `PlayerRanged` — type — line 21
- `RangedTickResult` — type — line 19

## `player/PlayerSkills.ts`

- `accumulateRidingUse` — function — line 279
- `accumulateSneakUse` — function — line 257
- `applySneakSpeedModifier` — function — line 298
- `awardSkillXp` — function — line 137
- `createPlayerSkills` — function — line 119
- `isTargetedSkill` — function — line 44
- `PlayerSkills` — type — line 74
- `RaiseSkillResult` — type — line 144
- `raiseSkillToValue` — function — line 156
- `resetPlayerSkills` — function — line 201
- `restorePersistedSkills` — function — line 184
- `RIDING_XP_DISTANCE_M` — const — line 273
- `ridingSpeedMultiplier` — function — line 339
- `ridingStaminaDrainMultiplier` — function — line 353
- `setSkillValueForDebug` — function — line 174
- `SKILL_IDS` — const — line 42
- `SKILL_LABEL` — const — line 52
- `SKILL_MIN_VALUE` — const — line 80
- `SKILL_USE` — const — line 31
- `SKILL_XP_AWARD` — const — line 215
- `SKILL_XP_HALF_VALUE` — const — line 85
- `SkillId` — type — line 14
  - domain: items-player
  - system: player-skills
  - role: Owns the player's skill XP curve and the single award path.
  - owns: PlayerSkills
- `SkillState` — type — line 63
- `SkillUseKind` — type — line 29
- `SNEAK_LEGACY_VALUE` — const — line 112
- `SNEAK_LEGACY_XP` — const — line 113
- `SNEAK_SPEED_MULTIPLIER` — const — line 296
- `SNEAK_XP_DISTANCE_M` — const — line 249
- `survivalDurationMultiplier` — function — line 312
- `survivalFoodMultiplier` — function — line 362
- `toggleSneak` — function — line 209
- `xpForSkillValue` — function — line 102
- `xpToSkillValue` — function — line 89

## `player/playerThrow.ts`

- `createPlayerThrow` — function — line 19
- `PlayerThrow` — type — line 13

## `player/PlayerTorch.ts`

- `createPlayerTorch` — function — line 134
- `PlayerTorch` — type — line 31
- `TORCH_FUEL_BRANCH` — const — line 22
- `TORCH_FUEL_WOODEN` — const — line 24
- `TorchCarryMode` — type — line 29
- `TorchSource` — type — line 26

## `player/playerVisualPreset.ts`

- `companionAnimationUrl` — function — line 227
- `PLAYER_UBC_ANIMATION_URL` — const — line 9
- `PLAYER_UBC_KNIGHT_BROWN_URL` — const — line 19
- `PLAYER_UBC_KNIGHT_CLOTH_BROWN_URL` — const — line 20
- `PLAYER_UBC_KNIGHT_CLOTH_URL` — const — line 14
- `PLAYER_UBC_KNIGHT_URL` — const — line 13
- `PLAYER_UBC_NOBLE_BROWN_URL` — const — line 21
- `PLAYER_UBC_NOBLE_URL` — const — line 15
- `PLAYER_UBC_PEASANT_BROWN_URL` — const — line 17
- `PLAYER_UBC_PEASANT_URL` — const — line 11
- `PLAYER_UBC_RANGER_BROWN_URL` — const — line 18
- `PLAYER_UBC_RANGER_URL` — const — line 12
- `PLAYER_UBC_WIZARD_BROWN_URL` — const — line 22
- `PLAYER_UBC_WIZARD_URL` — const — line 16
- `PlayerAppearance` — type — line 41
- `PlayerEquipmentOutfitId` — type — line 32
- `playerOutfitId` — function — line 240
- `PlayerOutfitTint` — type — line 31
- `PlayerVisualId` — type — line 24
- `PlayerVisualPreset` — type — line 34
- `resolveEquipmentOutfit` — function — line 166
- `resolvePlayerAppearance` — function — line 192
- `resolvePlayerTint` — function — line 172
- `resolvePlayerUrlOverride` — function — line 155
- `resolvePlayerVisualPreset` — function — line 212
- `UBC_HUMANOID_ANIMATION_URL` — const — line 7
- `ubcPreloadUrls` — function — line 235

## `player/ridingStability.ts`

- `fallDamage` — function — line 68
- `fallRiskPerSecond` — function — line 40
- `rollFall` — function — line 58
- `StabilityInput` — type — line 11

## `player/skillEvaluation.ts`

- `EvaluatedSkillInput` — type — line 15
- `evaluateSkillCompetence` — function — line 40
- `SkillCompetence` — type — line 30
  - domain: items-player
  - system: player-skills
- `SkillSupportInput` — type — line 11
  - domain: items-player
  - system: player-skills

## `player/targetedSkillSelection.ts`

- `createTargetedSkillSelection` — function — line 23
- `TargetedSkillSelection` — type — line 13
  - domain: items-player
  - system: player-skills

## `player/torchLightPresets.ts`

- `BRANCH_HELD_MAX` — const — line 38
- `BRANCH_URL` — const — line 37
- `resolveTorchLight` — function — line 17
- `TORCH_CAVE_DISTANCE_MULTIPLIER` — const — line 10
- `TORCH_CAVE_INTENSITY_MULTIPLIER` — const — line 9
- `TORCH_FLAME_OFFSET_WOODEN` — const — line 35
- `TORCH_LIGHT_BRANCH` — const — line 1
- `TORCH_LIGHT_DECAY` — const — line 3
- `TORCH_LIGHT_WOODEN` — const — line 2
- `TORCH_TIP_OFFSET_BRANCH` — const — line 30
- `TORCH_TIP_OFFSET_WOODEN` — const — line 31

## `player/ubcAccessoryBind.ts`

- `bindAccessoryToPlayerSkeleton` — function — line 55
  - domain: items-player
- `collectBoneNames` — function — line 23
- `mapBonesByName` — function — line 11
  - domain: items-player
- `NamedBone` — type — line 3

## `player/verticalMotion.ts`

- `GRAVITY` — const — line 3
- `integrateVerticalMotion` — function — line 44
- `JUMP_HEIGHT` — const — line 5
- `JUMP_SPEED` — const — line 6
- `LAND_MIN_SPEED` — const — line 12
- `STEP_DOWN_MAX` — const — line 9
- `VerticalMotionInput` — type — line 14
- `VerticalMotionResult` — type — line 27

## `player/worldWaterEligibility.ts`

- `MAX_SWIM_DEPTH` — const — line 18
  - domain: items-player
- `nextSwimming` — function — line 73
- `SWIM_ENTER_DEPTH` — const — line 61
- `SWIM_EXIT_DEPTH` — const — line 69
- `swimFeetY` — function — line 50
- `wadeFeetY` — function — line 83
- `worldWaterAppliesInCurrentSpace` — function — line 43
- `WorldWaterEligibilityInput` — type — line 24
- `WorldWaterOccupancy` — type — line 20

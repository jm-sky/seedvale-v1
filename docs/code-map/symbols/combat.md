# Symbols

Generated from exported TypeScript symbols.

## `combat/combatIntent.ts`

- `CombatIntent` — type — line 44
- `CombatTargetHandle` — type — line 25
- `CombatTargetHit` — type — line 8
  - domain: combat

## `combat/criticalHit.ts`

- `CriticalOutcome` — type — line 31
- `criticalRoll` — function — line 13
- `MELEE_CRITICAL_CHANCE` — const — line 60
- `MELEE_CRITICAL_MULTIPLIER` — const — line 61
- `resolveCriticalHit` — function — line 40

## `combat/damageTypes.ts`

- `composeLocalResistance` — function — line 14
- `DamageType` — type — line 4
  - domain: combat
- `Resistance` — type — line 5
- `scaleArmorResistance` — function — line 8

## `combat/defenseResolver.ts`

- `DEFENSE_FRONT_ARC_DOT` — const — line 12
  - domain: shared
  - system: defense-resolver
  - role: Resolves an incoming hit into block/partial/full damage, shared by player and NPC combat.
  - uses: ItemCatalog, HealthState
- `defenseBlockRoll` — function — line 31
- `DefenseOutcome` — type — line 14
- `isAttackFromDefensibleDirection` — function — line 50
- `ResolvedDefense` — type — line 16
- `resolveDefense` — function — line 80

## `combat/hitLocation.ts`

- `expectedProtection` — function — line 41
- `HIT_LOCATION_PROFILES` — const — line 11
- `HIT_LOCATIONS` — const — line 6
  - domain: combat
- `HitLocation` — type — line 7
- `hitLocationRoll` — function — line 19
- `HitProfile` — type — line 8
- `HumanProtection` — type — line 9
- `sampleHitLocation` — function — line 30

## `combat/incomingHumanHit.ts`

- `HumanHitContext` — type — line 20
- `HumanHitResult` — type — line 28
- `inertHumanHitResult` — function — line 45
- `isAcceptedPhysicalContactAmount` — function — line 40
- `PhysicalHit` — type — line 11
  - domain: combat
- `resolveIncomingHumanHit` — function — line 62

## `combat/meleeAgility.ts`

- `MELEE_AGILITY_NEUTRAL` — const — line 25
- `meleeRecoveryMultiplier` — function — line 30
- `resolveMeleeRecovery` — function — line 40

## `combat/meleeAttack.ts`

- `createMeleeAttackLifecycle` — function — line 46
- `MeleeAttackLifecycle` — type — line 26
- `MeleeAttackTickResult` — type — line 18
- `MeleeHitCandidate` — type — line 120
- `MeleeState` — type — line 16
- `resolveMeleeHits` — function — line 131
- `yawToward` — function — line 158

## `combat/meleeStrength.ts`

- `applyMeleeStrength` — function — line 31
- `MELEE_STRENGTH_NEUTRAL` — const — line 22
- `meleeStrengthMultiplier` — function — line 24

## `combat/physicalHits.ts`

- `fallPhysicalHit` — function — line 25
- `trapPhysicalHit` — function — line 12
  - domain: combat

## `combat/projectile.ts`

- `advanceProjectile` — function — line 45
- `Projectile` — type — line 12
- `PROJECTILE_HIT_RADIUS` — const — line 40
- `ProjectileCandidate` — type — line 70
- `segmentPointDistance` — function — line 56
- `sweptProjectileHit` — function — line 77
  - domain: npc
  - system: combat

## `combat/rangedAttack.ts`

- `rangedAccuracy` — function — line 22
- `rangedDeviationRoll` — function — line 32
- `resolveRangedDirection` — function — line 53

## `combat/rangedLifecycle.ts`

- `createRangedAttackLifecycle` — function — line 74
- `RangedAttackLifecycle` — type — line 34
- `RangedAttackTickResult` — type — line 27
- `RangedState` — type — line 25

## `combat/rangedReticle.ts`

- `clampToViewportMargin` — function — line 37
- `projectToViewportFraction` — function — line 23
- `RANGED_RETICLE_TARGET_HEIGHT` — const — line 8
- `RANGED_RETICLE_VIEWPORT_MARGIN` — const — line 12
- `ReticleScreenPosition` — type — line 14

# Implementation notes: Layered anatomical armor and typed physical damage

**Plan:** `items-player-065-layered-anatomical-armor-and-typed-physical-damage.md` · verified at `fe49547f` (2026-11-04, static). The combat proposal's §2 baseline table was re-checked and holds at this SHA.

## Verified anchors

| Concern | Anchor |
| --- | --- |
| Slot union / state | `src/items/equipment.ts:15` `EquipmentSlot` (still `arms` until 044), `EquipmentState` type (~l.60), `equippedArmorInstances` (l.179), `equippedBodyArmor` (l.195), `equippedInstanceId(s)` (l.201/210), `composeEquipmentModifiers` (l.228 — global multiplication to remove), `resolveEquipmentModifiers` (l.262) |
| Catalog armor | `src/items/itemCatalog.ts:56` `ArmorConfig` (inline slot union duplicate at l.57 — replace by import from `equipmentTypes.ts`; that is the cycle-free reason for the new module) |
| Quality | `src/items/armorItemInstances.ts` — `createArmorInstance(kind, quality, id?)` l.34, `EffectiveArmorPiece` l.81, `resolveEffectiveArmorPiece` l.97 (extend to per-channel resist with the same `.85` cap and penalty strength) |
| Player damage | `src/player/playerDamage.ts:82` `applyPlayerDamage`; `attempt = player.nextDefenseAttempt()` l.113; global armor applied at l.128 (`resolved.finalDamage * equipmentModifiers.incomingDamageMultiplier`) |
| Player counter | `PlayerController.ts:405` `private defenseAttempt`, increment l.1307, **reset to 0 at l.1456** (find what calls it — a reset on respawn/new game must become an explicit restore from save, not a silent zero) |
| NPC damage | `NpcAgent.ts:1454` `private defenseAttempt`, `applyIncomingCombatDamage` ~l.2502; NPC armor via `resolveNpcArmorEquipment` / incoming resolver in `src/ai/npcCombat.ts` |
| NPC persistent state | `src/settlement/npcState.ts:97` `NpcAuthoritativeState`, l.215 `NpcStateSnapshot` (clone/restore/export there; validator in `saveData.ts`) |
| Defense roll hash | `src/combat/defenseResolver.ts:31` `defenseBlockRoll(defenderId, attackerKey, attempt)` (Math.imul mix); `resolveDefense(...)` l.80 — the location sampler uses the **same style with a different salt** (`armor-location-v1`); block and location must not share a roll |
| Combat target handle | `src/combat/combatIntent.ts:22` `applyDamage: (amount: number) => void` |
| Save | `CURRENT_SAVE_VERSION` `saveData.ts:767`; `isPlayerEquipmentField` l.1077 (strict keys — must accept position keys after S2); `SAVE_MIGRATIONS` l.4421; historical v37→v38 loop l.4375 (frozen by 044) |
| Visual binding | `createApp.ts:1173` `syncArmsEquipmentVisual` (renamed by 044); S2 must make visual sync pick `shoulders:outer` / `body:outer` explicitly |

## Decisions already made (do not reopen)

- Position keys are strings `` `${slot}:${layer}` `` in save and state; no nested objects.
- Ordinal increments once per accepted positive physical contact, including full block; never for misses, previews, deprivation, invalid/dead/downed contacts.
- Location for full block = `null`, `armorPrevented = 0`.
- NPC protection stays **derived** from `personalInventory` (no persisted NPC equipment state). The proposal's NPC selection rule (score `.30·cut + .45·pierce + .25·blunt`, ties mass → kind → ID) is implemented in S3 for incoming hits; the cache comes in npc-068.
- Fall policy is part of Q-IC2; implement exactly what the author approves.

## Pitfalls

- `EquipmentModifiers.incomingDamageMultiplier` has consumers beyond `playerDamage` (preview, character presentation, NPC incoming). Grep all and move them to the typed derivation in the same Wave 2 branch; S3 must leave no reader.
- Preview (`src/items/equipmentPreview.ts`) must use the same derivation function as combat (048 consumes it) — expose one pure "protection snapshot" builder in `equipment.ts`, not a Vue-side computation.
- Migration validates refs against **migrated player instance rows** of the same save only.
- Projectile `damageType` is snapshotted at fire time with damage/crit/ammo; later gear changes must not alter a flying projectile.
- Inventory revision: audit `updateInstance`, count migrations and bulk restore; failed operations must not bump.

## Order

S1 (main) → wait for 044-M + npc-067 + 062 W3 on main → branch: S2 (state + save) → S3 (integration) → hand to 066 A and 048 on the same branch.

## S1 implementation — 2026-11-04

- Added dependency-light equipment vocabulary (legacy slot union until 044-M), physical channels, per-channel quality/cap and layer composition, seven-region profiles, framed salted FNV-1a sampler, expected protection and pure incoming-hit resolver. No runtime damage caller.
- Catalog melee/ranged/throwable configs now carry optional `damageType`; all active configs and compatible ammo are explicitly tagged. Existing bonuses/timings/damage stay unchanged. Synthetic throw configs retain their tag.
- Golden damage fixtures, full/partial/rear/unblockable defense, quality/caps, profile boundaries (including zero weights), salted vectors and exhaustive catalog classification: 25 focused tests pass (new suite + defenseResolver + itemCatalog). Vue type-check and scoped ESLint pass; production build checked at slice end. No browser check: S1 has no changed gameplay.
- Preflight used `node --import tsx scripts/claude/pre-implementation.ts items-player-065`; pnpm's tsx CLI cannot open its IPC pipe in this sandbox.
- Integer profile boundaries are compared as normalized cumulative fractions to avoid floating-point multiplication assigning an exact boundary to the previous region.

## S2 implementation — 2026-11-04

- **Equipment model.** `ArmorConfig` now has `layer` + `resist` (cut/pierce/blunt); `damageReduction` is gone from catalog and `EffectiveArmorPiece` (which gains `layer`, `resist` with per-channel quality scale and `.85` cap via `scaleArmorResistance`). Existing six kinds + both bracers carry the proposal §5.1 resist values (all `outer`); restriction multipliers are unchanged until 066 A. `EquipmentState` is keyed by `EquipmentPositionKey` (`EQUIPMENT_POSITIONS`, 14, canonical slot then under/outer): `getPosition`, `equip(id, inventory)` → `EquipResult` (position inferred from catalog), `unequip(position)`, `selectionRevision`; restore keeps canonical order, discards invalid/duplicate refs, never touches items. `getSlot` removed. JSDoc `@domain items-player` added.
- **Protection snapshot.** `buildProtectionSnapshot` / `resolveProtectionSnapshot` in `items/equipment.ts` return worn pieces, per-slot 7×3 local resistance (`composeLocalResistance` of under+outer of the same slot only) and restrictions with the §5.2 armor-only clamps (stamina [1,1.8], recovery [1,1.5], movement [.75,1], sprint [1,2]). `resolveEquipmentModifiers` is its restriction view. Preview uses the same builder.
- **Revisions.** `Inventory.armorMutationRevision` bumps on successful armor `add`/`addWithFreshness`/`remove`/`removeWithFreshness`/recipe outputs/`addInstance`/`removeInstance`/`updateInstance` (once)/`clear`; failed ops do not bump; construction (bulk restore) starts at 0 and relies on Inventory identity in cache keys.
- **Ordinals.** Player: `PlayerController.nextIncomingPhysicalHitOrdinal()` / `getIncomingPhysicalHitOrdinal()` / `restoreIncomingPhysicalHitOrdinal()`, exported by `saveState` (`playerIncomingPhysicalHitOrdinal`), restored in `createApp`; `resetForNewGame` zeroes it (new game only). NPC: `NpcAuthoritativeState.incomingPhysicalHitOrdinal` + `NpcStateSnapshot` (clone/restore/serialize), `NpcAgent` increments the shared state instead of a private field. Counter still feeds the existing `defenseBlockRoll` attempt (behaviour unchanged).
- **Save migration v59 → v60** (`CURRENT_SAVE_VERSION` read after pull = 59): `playerEquipment` slot keys → `slot:outer` per proposal §10.1 (explicit layered key wins; `shoulders` over `arms`, invalid falls back to valid `arms`; refs validated against the save's own player instance rows and catalog position; stale/wrong/duplicate → empty; unknown keys/non-string values left for validation to reject). Ordinals absent stay absent (runtime = 0), stored ones untouched. Validators accept only position keys and safe nonnegative integer ordinals (player + NPC). No `WORLDGEN_EPOCH` bump. Fixtures through `loadStoredSave` in `saveData.test.ts`.
- **Consumers.** Inventory UI state/events are position-keyed (`equippedSlots`, `unequip-armor`); the slot cells show outer then under (display bridge until 048). `createApp` visual sync uses `shoulders:outer` and `equippedBodyArmor` = `body:outer` only (no under fallback). NPC derived armor picks best per position.

### Bridges to remove in S3 (explicit)

1. `EquipmentModifiers.incomingDamageMultiplier` (still read by `playerDamage`, `resolveIncomingNpcDamage`, `equipmentModifiersToCharacterView`/`damageReduction`) is derived from typed `resist` with `armorProtectionScore` (`.30·cut + .45·pierce + .25·blunt`) multiplied per piece. S3 deletes the field and the helper's combat use.
2. Display/ranking scalars (`protectionPercent`, `LoadoutStatView.damageReduction`, catalogue strength, NPC best-armor pick) use `armorProtectionScore`; 048 replaces labels with typed values, S3 replaces the NPC pick with the proposal's score + tie-break.

Verification: vitest on src/persistence src/player src/ai src/settlement src/combat src/app src/items src/ui-vue src/ui (336 files, 4106 tests) pass; `pnpm run type-check`, scoped ESLint and `pnpm run build` pass. Not browser-verified (no gameplay change intended until S3).

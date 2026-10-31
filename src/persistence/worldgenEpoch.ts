/**
 * Worldgen compatibility epoch (plan persistence-008, Strategic Brief D1/D3).
 *
 * A second, independent axis next to `CURRENT_SAVE_VERSION`: the save format
 * says whether this build can *read* the persisted fields; the epoch says
 * whether the persisted fields still point at the *same world*. Geography
 * and identity are rebuilt from `config.seed` + generator code, so a save
 * whose `config.worldgenEpoch` differs from this constant is refused with
 * `'incompatible-world'` — never migrated.
 *
 * Bump when a deterministic generator change would place, re-identify, drop
 * or add anything persisted state refers to:
 * - settlement IDs, economies, households, `structureStates`, land ownership
 *   (settlement grid, `generateSettlementDef()`, `VillagePlan`);
 * - NPC states/relationships, transport/expedition checkpoints, travel
 *   positions (NPC identity, settlement plans, roads);
 * - `graves` and cemetery-related quest state (cemetery assignment/layout);
 * - `terrainModifications`, player buildings, placed objects (heightmap,
 *   biomes, rivers, roads);
 * - `collectedItemIds`, `renewableWorldItems`, `consumedWorldPickupIds`
 *   (chunk item placement IDs); `treeOverrides` (vegetation placement IDs);
 * - deposit depletion, grass-forage patches, fauna spawn points,
 *   `persistentHabitatOccupants` (their placement/ID schemes);
 * - map/location discovery and knowledge, cave positions.
 *
 * Do not bump for visuals, LOD, non-persisted decoration density, identical-
 * output performance work or new optional content. The epoch is not part of
 * any worldgen cache fingerprint — bump the affected cache namespaces too.
 * D3: one coordinated Revival batch bumps `0 → 1` once, in its first
 * generator-changing commit; later commits of the batch reuse it. When
 * unsure, bump — a refused save is visible, a mismatched one is silent.
 *
 * `0` = every save written before persistence-008 (pre-Revival generator).
 *
 * @domain persistence
 * @system save-schema
 */
export const WORLDGEN_EPOCH = 1

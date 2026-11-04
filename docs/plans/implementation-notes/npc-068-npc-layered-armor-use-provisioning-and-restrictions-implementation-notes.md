# Implementation notes: NPC layered armor use, restrictions and provisioning

**Plan:** `npc-068-npc-layered-armor-use-provisioning-and-restrictions.md` · verified at `fe49547f` (2026-11-04, static).

## Anchors

| Concern | Anchor |
| --- | --- |
| Derived NPC armor | `src/ai/npcCombat.ts` `resolveNpcArmorEquipment(personalInventory)` (extended by 065 S3 to positions) |
| NPC agent | `src/ai/NpcAgent.ts` — movement `steerTo`, flee/run drain, attack stamina/recovery, combat-idle regeneration (keep it so heavy kits never softlock) |
| Loadout | `src/ai/npcLoadout.ts:184` `seedInitialPersonalBelongingsIfNeeded(inventory, role, state, npcId)` — signature has no settlement size/seed; N3 adds a plain context argument supplied by the creation owner (find callers; do not import world state into `npcLoadout`) |
| Weapon salts to preserve | `hashString` l.91, `selectShepherdPrimaryWeapon` l.114, `seedGuardCrossbowLoadout` l.146, `seedShepherdSlingLoadout` l.169 |
| Offscreen travel | `src/world/transportOffscreen.ts:40` `estimateOffscreenTravelDays`; callers `src/ai/npcTravel.ts:167` and `src/settlement/SettlementsManager.ts:1360` (legacy transport handoff) |
| Corpse | `src/settlement/npcPostDeath.ts` |
| Instance IDs | `createArmorInstance(kind, quality, id?)` `src/items/armorItemInstances.ts:34`; default IDs are `item:${Date.now()}:n` — kits must pass the deterministic ID |

## Pitfalls

- `seedInitialPersonalBelongingsIfNeeded` returns early when `!state.needsInitialPersonalLoadout`; kits go inside the same guarded block, before the latch is cleared, so stream-in/reconstruction never regrants.
- Profession work must not be slowed by attack-cost multipliers — apply only movement/sprint/attack restrictions where the proposal says.
- Personal armor is not in the personal-trade allowlist; corpse loot uses actual instances, not reconstructed role gear.
- Cache keyed by Inventory **object identity** too: a reconstructed Inventory (reload/stream-in) must miss the cache.
- Performance check: follow CLAUDE.md WSL baseline rule; do not edit `src/` while a benchmark runs.

## Order

N1 → N2 (may share a session) → N3 only after Q-IC3.

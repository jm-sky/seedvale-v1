import { describe, expect, it } from 'vitest'
import type { ItemKind } from './items'
import { isRangedTool, ITEM_CATALOG } from './itemCatalog'
import {
  IDENTITY_ONLY_ITEM_KINDS,
  INSTANCE_BACKED_KINDS,
  isRangedWeaponKind,
  isWeaponMaintenanceKind,
  RANGED_WEAPON_KIND_LIST,
  RANGED_WEAPON_KINDS,
} from './itemInstances'

describe('RANGED_WEAPON_KINDS (plan items-player-060)', () => {
  it('contains exactly the six current reusable ranged weapons', () => {
    expect(RANGED_WEAPON_KINDS.size).toBe(6)
    for (const kind of ['short_bow', 'hunting_bow', 'long_bow', 'masterwork_hunting_bow', 'crossbow', 'sling'] as const) {
      expect(isRangedWeaponKind(kind)).toBe(true)
    }
  })

  it('never overlaps WeaponMaintenanceKind — no fake sharpness on bows/crossbows/slings', () => {
    for (const kind of RANGED_WEAPON_KIND_LIST) {
      expect(isWeaponMaintenanceKind(kind)).toBe(false)
    }
  })

  it('does not classify ammo as a reusable weapon instance', () => {
    for (const ammo of ['arrow', 'broadhead_arrow', 'war_arrow', 'bolt', 'stone'] as const) {
      expect(isRangedWeaponKind(ammo)).toBe(false)
    }
  })

  it('is fully covered by INSTANCE_BACKED_KINDS', () => {
    for (const kind of RANGED_WEAPON_KIND_LIST) {
      expect(INSTANCE_BACKED_KINDS.has(kind)).toBe(true)
    }
  })

  it('no longer treats hunting_bow as the identity-only special case', () => {
    expect(IDENTITY_ONLY_ITEM_KINDS.has('hunting_bow')).toBe(false)
  })

  /** Guardrail (plan items-player-060 §3/§16): derives the expected ranged
   *  family from catalog `ranged` capability directly — not from a second
   *  hand-written list — so a future ranged-capable `ItemKind` added to
   *  `ITEM_CATALOG` without being wired into `RANGED_WEAPON_KIND_LIST` fails
   *  here instead of silently staying count-backed. */
  it('matches every catalog kind with a ranged-combat capability exactly', () => {
    const catalogRangedKinds = (Object.keys(ITEM_CATALOG) as ItemKind[]).filter((kind) => isRangedTool(kind))
    expect(new Set(catalogRangedKinds)).toEqual(new Set(RANGED_WEAPON_KIND_LIST))
  })
})

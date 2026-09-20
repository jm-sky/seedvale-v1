import type { ProductionDef } from '../economy/production'
import type { Inventory } from '../items/Inventory'
import type { ArmorQuality } from '../items/itemInstances'
import type { ItemKind } from '../items/items'
import { tradeValue } from '../items/tradeCatalog'
import { createSeededRandom } from '../world/parseSeed'
import {
  type ArtisanProfile,
  effectiveArtisanSkill,
} from './artisanProfile'
import { pickWeightedArmorQuality } from './settlementArmorQuality'

export type ArtisanCraftDecision = {
  canCraft: boolean
  prefersToCraft: boolean
  effectiveSkill: number
  reason?: 'missing-profile' | 'insufficient-skill' | 'exclusive-gate'
}

function hashString(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function artisanCapability(def: ProductionDef): ProductionDef['artisan'] {
  return def.artisan
}

/**
 * Recipe eligibility vs one artisan profile (plan settlements-npcs-056).
 *
 * @domain settlements-npcs
 */
export function resolveArtisanCraft(
  profile: ArtisanProfile | null | undefined,
  def: ProductionDef,
): ArtisanCraftDecision {
  const capability = artisanCapability(def)
  if (!profile || !capability) {
    return { canCraft: false, prefersToCraft: false, effectiveSkill: 0, reason: 'missing-profile' }
  }
  const skill = effectiveArtisanSkill(profile, capability.specialization)
  if (skill < capability.minSkill) {
    return { canCraft: false, prefersToCraft: false, effectiveSkill: skill, reason: 'insufficient-skill' }
  }
  if (
    profile.exclusive
    && capability.exclusive
    && !profile.specializations.includes(capability.specialization)
  ) {
    return { canCraft: false, prefersToCraft: false, effectiveSkill: skill, reason: 'exclusive-gate' }
  }
  return {
    canCraft: true,
    prefersToCraft: profile.specializations.includes(capability.specialization),
    effectiveSkill: skill,
  }
}

export function artisanCanCraft(
  profile: ArtisanProfile | null | undefined,
  def: ProductionDef,
): boolean {
  return resolveArtisanCraft(profile, def).canCraft
}

/**
 * Material-value deposit for one recipe (plan settlements-npcs-056) —
 * current `tradeValue` of required stock and item inputs, not a labor fee.
 *
 * @domain settlements-npcs
 */
export function artisanMaterialDepositValue(def: ProductionDef): number {
  let total = 0
  for (const input of def.inputs) {
    total += tradeValue(input.kind as ItemKind) * input.amount
  }
  for (const input of def.itemInputs ?? []) {
    total += tradeValue(input.kind) * input.amount
  }
  return Math.max(0, Math.round(total))
}

export type MissingArtisanMaterial = {
  kind: string
  amount: number
  have: number
  owner: 'stock' | 'item'
}

export function missingArtisanMaterials(
  def: ProductionDef,
  economyQuery: (kind: string) => number,
  inventory: Inventory | null | undefined,
): MissingArtisanMaterial[] {
  const missing: MissingArtisanMaterial[] = []
  for (const input of def.inputs) {
    const have = economyQuery(input.kind)
    if (have < input.amount) {
      missing.push({ kind: input.kind, amount: input.amount - have, have, owner: 'stock' })
    }
  }
  for (const input of def.itemInputs ?? []) {
    const have = inventory?.count(input.kind) ?? 0
    if (have < input.amount) {
      missing.push({ kind: input.kind, amount: input.amount - have, have, owner: 'item' })
    }
  }
  return missing
}

const QUALITY_SALT = 0x4152514c

function qualityWeights(effectiveSkill: number, difficulty: number): Record<ArmorQuality, number> {
  const gap = effectiveSkill - difficulty
  const poor = Math.max(0.02, 0.42 - gap * 0.012)
  const common = Math.max(0.08, 0.40 - Math.abs(gap) * 0.004)
  const good = Math.max(0.03, 0.14 + gap * 0.008)
  const masterwork = Math.max(0.005, 0.04 + gap * 0.006)
  return { poor, common, good, masterwork }
}

/**
 * Deterministic crafted quality from effective skill, recipe difficulty and
 * a stable production/order event identifier (plan settlements-npcs-056).
 *
 * @domain settlements-npcs
 */
export function resolveArtisanCraftedQuality(input: {
  effectiveSkill: number
  difficulty: number
  eventId: string
}): ArmorQuality {
  const mixed = (QUALITY_SALT ^ hashString(input.eventId) ^ Math.imul(input.effectiveSkill + 1, 0x9e3779b9)) >>> 0
  return pickWeightedArmorQuality(
    createSeededRandom(mixed),
    qualityWeights(input.effectiveSkill, input.difficulty),
  )
}

export function artisanOutputKind(def: ProductionDef): ItemKind | null {
  return def.itemOutputs?.[0]?.kind ?? null
}

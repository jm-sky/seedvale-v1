#!/usr/bin/env tsx
import { resolve } from 'node:path'
/**
 * Melee catalog balance table (plan items-player-067 §B, Q153).
 *
 * Reproducible, read-only view of every `ITEM_CATALOG[kind].melee` entry:
 * base + start-character effective damage, attack cycle, theoretical sustained
 * DPS, Stamina efficiency, reach, armor channel and hits-to-kill for the
 * reference animals. Changes NO catalog number.
 *
 * Usage: `pnpm tsx scripts/items/meleeCatalogTable.ts`
 *
 * Theoretical only: no Stamina cap, no target movement, no armor, crit as
 * expectation, sharpness 1.0. Sharpness is a uniform per-instance multiplier
 * (`getSharpnessDamageModifier`) and does not differentiate kinds.
 */
import { fileURLToPath } from 'node:url'
import type { ItemKind, MeleeConfig } from '../../src/items/itemCatalog'
import { MELEE_CRITICAL_CHANCE, MELEE_CRITICAL_MULTIPLIER } from '../../src/combat/criticalHit'
import { meleeRecoveryMultiplier } from '../../src/combat/meleeAgility'
import { meleeStrengthMultiplier } from '../../src/combat/meleeStrength'
import { ITEM_CATALOG } from '../../src/items/itemCatalog'
import { PLAYER_STARTING_ATTRIBUTES } from '../../src/player/PlayerController'
import { LUNGE_STAMINA_COST, MAX_LUNGE_DISTANCE } from '../../src/player/playerMelee'

export type MeleeFamily = 'compact' | 'sword' | 'axe' | 'spear' | 'blunt' | 'tool'
export type MeleeTier = 'starter' | 'ordinary' | 'improved' | 'masterwork' | 'exceptional' | 'legendary'

/** Analysis-only classification (NOT gameplay data); `npcCombat.ts` owns the NPC family map. */
export const MELEE_ANALYSIS_META: Readonly<Record<string, { family: MeleeFamily, tier: MeleeTier }>> = {
  knife: { family: 'compact', tier: 'starter' },
  dagger: { family: 'compact', tier: 'ordinary' },
  obsidian_knife: { family: 'compact', tier: 'ordinary' },
  obsidian_dagger: { family: 'compact', tier: 'ordinary' },
  damascus_knife: { family: 'compact', tier: 'improved' },
  ashgrove_dagger: { family: 'compact', tier: 'masterwork' },
  kestrel_dagger: { family: 'compact', tier: 'legendary' },
  short_sword: { family: 'sword', tier: 'ordinary' },
  sword: { family: 'sword', tier: 'ordinary' },
  long_sword: { family: 'sword', tier: 'ordinary' },
  damascus_short_sword: { family: 'sword', tier: 'improved' },
  damascus_long_sword: { family: 'sword', tier: 'improved' },
  obsidian_sword: { family: 'sword', tier: 'improved' },
  masterwork_sword: { family: 'sword', tier: 'masterwork' },
  millbrook_shortsword: { family: 'sword', tier: 'masterwork' },
  fenmoor_sword: { family: 'sword', tier: 'masterwork' },
  stonebridge_longsword: { family: 'sword', tier: 'masterwork' },
  pinewatch_longsword: { family: 'sword', tier: 'exceptional' },
  harrow_shortsword: { family: 'sword', tier: 'legendary' },
  ironvale_sword: { family: 'sword', tier: 'legendary' },
  greywatch_longsword: { family: 'sword', tier: 'legendary' },
  axe: { family: 'axe', tier: 'starter' },
  hatchet: { family: 'axe', tier: 'ordinary' },
  battle_axe: { family: 'axe', tier: 'improved' },
  halberd: { family: 'spear', tier: 'ordinary' },
  spear: { family: 'spear', tier: 'ordinary' },
  pitchfork: { family: 'tool', tier: 'starter' },
  sickle: { family: 'tool', tier: 'starter' },
  shears: { family: 'tool', tier: 'starter' },
  shovel: { family: 'tool', tier: 'starter' },
  club: { family: 'blunt', tier: 'ordinary' },
  mace: { family: 'blunt', tier: 'ordinary' },
  war_hammer: { family: 'blunt', tier: 'ordinary' },
  staff: { family: 'blunt', tier: 'ordinary' },
}

export const V1_ANCHORS: Readonly<Record<string, string>> = {
  knife: '12/1.6/4', short_sword: '18/2.1/7', long_sword: '28/2.6/12', spear: '20/3/9', axe: '20/2/10',
}

/** Reference animal HP (src/fauna/faunaCombat.ts, alpha x1.6). */
export const REFERENCE_TARGETS = { boar: 35, wolf: 50, alpha: 80, bear: 150 } as const

export type MeleeRow = {
  kind: ItemKind
  family: MeleeFamily
  tier: MeleeTier
  anchor: boolean
  damageType: string
  damage: number
  range: number
  arcDot: number
  stamina: number
  cycle: number
  dps: number
  startDamage: number
  startCycle: number
  startDps: number
  dmgPerStamina: number
  /** Stamina drained per second at sustained attack rate. */
  staminaPerSec: number
  /** Furthest start distance that still connects: range + MAX_LUNGE - 0.1 buffer is in playerMelee; range + lunge. */
  reachWithLunge: number
  hits: Record<keyof typeof REFERENCE_TARGETS, number>
}

const startStrength = meleeStrengthMultiplier(PLAYER_STARTING_ATTRIBUTES.strength)
const startRecovery = meleeRecoveryMultiplier(PLAYER_STARTING_ATTRIBUTES.agility)
const critExpect = 1 + MELEE_CRITICAL_CHANCE * (MELEE_CRITICAL_MULTIPLIER - 1)

/** Builds one row per live melee catalog entry (sorted by kind). */
export function buildMeleeRows(overrides: Readonly<Record<string, Partial<MeleeConfig>>> = {}): MeleeRow[] {
  const rows: MeleeRow[] = []
  for (const [kind, def] of Object.entries(ITEM_CATALOG)) {
    const base = (def as { melee?: MeleeConfig }).melee
    if (!base) continue
    const melee: MeleeConfig = { ...base, ...overrides[kind] }
    const meta = MELEE_ANALYSIS_META[kind] ?? { family: 'tool' as const, tier: 'ordinary' as const }
    const cycle = melee.windUp + melee.hitWindow + melee.recovery
    const startCycle = melee.windUp + melee.hitWindow + melee.recovery * startRecovery
    const startDamage = melee.damage * startStrength
    const hits = {} as MeleeRow['hits']
    for (const [name, hp] of Object.entries(REFERENCE_TARGETS)) {
      hits[name as keyof typeof REFERENCE_TARGETS] = Math.ceil(hp / startDamage)
    }
    rows.push({
      kind: kind as ItemKind,
      ...meta,
      anchor: kind in V1_ANCHORS,
      damageType: melee.damageType ?? '-',
      damage: melee.damage,
      range: melee.range,
      arcDot: melee.arcDot,
      stamina: melee.staminaCost,
      cycle,
      dps: melee.damage / cycle,
      startDamage,
      startCycle,
      startDps: startDamage / startCycle,
      dmgPerStamina: melee.damage / melee.staminaCost,
      staminaPerSec: melee.staminaCost / startCycle,
      reachWithLunge: melee.range + MAX_LUNGE_DISTANCE,
      hits,
    })
  }
  return rows.sort((a, b) => a.kind.localeCompare(b.kind))
}

const TIER_ORDER: readonly MeleeTier[] = ['starter', 'ordinary', 'improved', 'masterwork', 'exceptional', 'legendary']

export type FamilyFlag = { kind: string, other: string, reason: string }

/**
 * Flags unintended inversions inside one family: a strictly higher-tier weapon
 * that is worse than a lower-tier one on BOTH raw damage and DPS, or one that
 * is worse on damage/DPS/range simultaneously. Heuristic; not an invariant.
 */
export function findFamilyInversions(rows: readonly MeleeRow[]): FamilyFlag[] {
  const flags: FamilyFlag[] = []
  for (const hi of rows) {
    for (const lo of rows) {
      if (hi.family !== lo.family || TIER_ORDER.indexOf(hi.tier) <= TIER_ORDER.indexOf(lo.tier)) continue
      if (hi.damage < lo.damage && hi.dps < lo.dps) {
        flags.push({ kind: hi.kind, other: lo.kind, reason: `higher tier (${hi.tier}) has lower damage and DPS than ${lo.tier}` })
      }
    }
  }
  return flags
}

/** Retune PROPOSALS (Q153) - data only, applied as an in-memory overlay; the catalog is NOT changed. Opus gate. */
export const RETUNE_PROPOSALS: Readonly<Record<string, Partial<MeleeConfig>>> = {
  obsidian_sword: { recovery: 0.42, staminaCost: 13 },
  battle_axe: { recovery: 0.4, staminaCost: 13 },
  obsidian_dagger: { damage: 16, recovery: 0.19 },
  shovel: { staminaCost: 6 },
}

/** NPC pick-order flips (`resolveNpcMeleeWeapon` scores damage/cycle, x1.5 for a preferred family) caused by an overlay. */
export function findNpcScoreFlips(before: readonly MeleeRow[], after: readonly MeleeRow[], changed: readonly string[]): string[] {
  const score = (r: MeleeRow) => r.damage / r.cycle
  const out: string[] = []
  for (const k of changed) {
    const b = before.find((r) => r.kind === k)!
    const a = after.find((r) => r.kind === k)!
    for (const o of before) {
      if (o.kind === k) continue
      for (const [mk, mo] of [[1, 1], [1.5, 1], [1, 1.5]] as const) {
        const was = score(b) * mk > score(o) * mo
        const now = score(a) * mk > score(o) * mo
        if (was !== now) out.push(`${k}${mk > 1 ? ' (preferred)' : ''} vs ${o.kind}${mo > 1 ? ' (preferred)' : ''}: ${was ? 'won' : 'lost'} -> ${now ? 'wins' : 'loses'}`)
      }
    }
  }
  return out
}

const f = (n: number, d = 2) => n.toFixed(d)

export function formatMeleeTable(rows: readonly MeleeRow[]): string {
  const header = ['kind', 'fam', 'tier', 'type', 'dmg', 'rng', 'arc', 'stam', 'cyc', 'dps', 'dmg@6', 'dps@6', 'dmg/st', 'st/s', 'lunge', 'wolf', 'alpha', 'boar', 'bear']
  const lines = [header.join(' | ')]
  const sorted = [...rows].sort((a, b) =>
    TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier) || a.family.localeCompare(b.family) || a.dps - b.dps)
  for (const r of sorted) {
    lines.push([
      r.kind + (r.anchor ? '*' : ''), r.family, r.tier, r.damageType, r.damage, f(r.range, 2), f(r.arcDot), r.stamina,
      f(r.cycle), f(r.dps, 1), f(r.startDamage, 1), f(r.startDps, 1), f(r.dmgPerStamina, 1), f(r.staminaPerSec, 1),
      f(r.reachWithLunge, 1), r.hits.wolf, r.hits.alpha, r.hits.boar, r.hits.bear,
    ].join(' | '))
  }
  return lines.join('\n')
}

export function main(): void {
  const withProposals = process.argv.includes('--proposals')
  if (withProposals) {
    const before = buildMeleeRows()
    const after = buildMeleeRows(RETUNE_PROPOSALS)
    console.log('# PROPOSED overlay (catalog unchanged). before -> after')
    for (const k of Object.keys(RETUNE_PROPOSALS)) {
      const b = before.find((r) => r.kind === k)!
      const a = after.find((r) => r.kind === k)!
      console.log(`${k}: cycle ${f(b.cycle)}->${f(a.cycle)} dps ${f(b.dps, 1)}->${f(a.dps, 1)} dps@6 ${f(b.startDps, 1)}->${f(a.startDps, 1)} dmg/st ${f(b.dmgPerStamina, 1)}->${f(a.dmgPerStamina, 1)} st/s ${f(b.staminaPerSec, 1)}->${f(a.staminaPerSec, 1)} wolf hits ${b.hits.wolf}->${a.hits.wolf}`)
    }
    console.log('# NPC score flips'); for (const l of findNpcScoreFlips(before, after, Object.keys(RETUNE_PROPOSALS))) console.log('- ' + l)
    console.log('# Inversions after overlay'); for (const fl of findFamilyInversions(after)) console.log(`- ${fl.kind} vs ${fl.other}`)
    return
  }
  const rows = buildMeleeRows()
  console.log(`# Melee catalog table - ${rows.length} entries (* = V1 anchor). Start character: Strength ${PLAYER_STARTING_ATTRIBUTES.strength} (x${f(startStrength, 3)} dmg), Agility ${PLAYER_STARTING_ATTRIBUTES.agility} (x${f(startRecovery, 3)} recovery). Crit expectation x${f(critExpect, 3)} applies uniformly. Lunge: ${LUNGE_STAMINA_COST} Stamina, +${MAX_LUNGE_DISTANCE} m (frozen).`)
  console.log('# cyc/dps = windUp+hitWindow+recovery, base; @6 = start character (Str x1.06, Agi recovery x0.96). lunge = max start distance range+3. wolf/alpha/boar/bear = hits to kill at start damage, no crit.')
  console.log(formatMeleeTable(rows))
  const flags = findFamilyInversions(rows)
  console.log(`\n# Family inversion flags (${flags.length})`)
  for (const fl of flags) console.log(`- ${fl.kind} vs ${fl.other}: ${fl.reason}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}

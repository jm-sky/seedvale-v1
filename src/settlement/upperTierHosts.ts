import type { Inventory } from '../items/Inventory'
import type { NpcId } from './npcState'
import type { SettlementCell, SettlementDef } from './settlementGenerator'
import { UPPER_TIER_IDENTITY_LIST, type UpperTierIdentity } from '../items/upperTierIdentities'
import { claimUpperTierInstance, type UpperTierIssuanceLedger } from '../items/upperTierIssuance'
import { createSeededRandom } from '../world/parseSeed'
import { resolveMerchantProfiles } from './merchantTrade'
import { settlementNpcId } from './npcIdentity'
import { hashArmorQualityOwner } from './settlementArmorQuality'

/** One designated source of an upper-tier identity (review 042 U1, author Q-U2 (a)). */
export type UpperTierHost = {
  kind: UpperTierIdentity
  settlementId: string
  npcId: NpcId
  /** Stable ledger `issuanceKey`: `merchant:<settlementId>:<npcId>:<kind>`. */
  issuanceKey: string
}

export type UpperTierHostDeps = {
  seed: number
  /** Layout roster cells (deterministic, seed + terrain only). Home is skipped. */
  cells: () => readonly SettlementCell[]
  /** Cached pure def resolution (`settlementDefFor`); no materialization needed. */
  defFor: (cell: SettlementCell) => SettlementDef | null
}

export type UpperTierHostResolver = {
  /** Designated host of `kind`, or `null` when no eligible trader exists in the world. */
  hostFor: (kind: UpperTierIdentity) => UpperTierHost | null
  /** Identities designated to `npcId` (empty for every non-host trader). */
  hostedKindsFor: (npcId: NpcId) => readonly UpperTierIdentity[]
  /** Number of settlement defs resolved so far (budget/diagnostics). */
  readonly resolvedDefCount: number
}

const HOST_RANK_SALT = 0x5ee0d7a1

function rankOf(seed: number, kind: string, key: string): number {
  return createSeededRandom((seed ^ HOST_RANK_SALT ^ hashArmorQualityOwner(kind) ^ Math.imul(hashArmorQualityOwner(key), 0x9e3779b1)) >>> 0)()
}

/** Host preference tiers: specialist stalls first ("limited specialist sale"), then general
 *  stalls, then any other non-horse trader. Worlds have few specialists (0-2), so the fallback
 *  tiers are what keeps the 14 identities spread instead of piled on one merchant. */
const HOST_TIERS: readonly ReadonlySet<string>[] = [
  new Set(['imports-luxury', 'weapons-tools']),
  new Set(['general']),
  new Set(['food-materials']),
]
/** At most this many identities per host trader (raised only if the world has fewer traders). */
const MAX_IDENTITIES_PER_HOST = 4

/** Traders of a def with one of `specializations`, derived the same way
 *  `createSettlement` derives its merchant profiles (flat member order, horse-vendor rule). Pure.
 *
 * @domain settlements
 */
export function upperTierEligibleTraderIds(def: SettlementDef, specializations: ReadonlySet<string> = HOST_TIERS[0]!): NpcId[] {
  const traderIds: NpcId[] = []
  let index = 0
  for (const family of def.families) {
    for (const member of family.members) {
      if (member.character.role === 'trader') traderIds.push(settlementNpcId(def.id, index))
      index++
    }
  }
  return resolveMerchantProfiles(traderIds, def.plan.identity.terrain, {
    assignHorseVendor: !!def.plan.paddock && traderIds.length > 0,
  })
    .filter((profile) => specializations.has(profile.specialization))
    .map((profile) => profile.npcId)
}

/**
 * Deterministic one-host-per-identity designation (review 042 U1, author Q-U2 (a)).
 * Eligible sources are the traders of every non-home roster settlement (tiers: see HOST_TIERS).
 * Identities are assigned in `UPPER_TIER_IDENTITY_LIST` order to the trader with the lowest
 * seeded hash of (seed, identity, npcId) in the best preference tier that still has a trader under
 * the per-host cap (4), so the set spreads over the world instead of piling onto one merchant. Independent of exploration order, the player and materialization; defs resolve
 * through the shared def cache on first use and the result is memoized per resolver. With no
 * eligible trader an identity is simply never issued.
 *
 * @domain items-player
 * @system equipment
 */
export function createUpperTierHostResolver(deps: UpperTierHostDeps): UpperTierHostResolver {
  let hosts: Map<UpperTierIdentity, UpperTierHost> | null = null
  let resolved = 0
  const build = (): Map<UpperTierIdentity, UpperTierHost> => {
    const defs: SettlementDef[] = []
    for (const cell of deps.cells()) {
      if (cell.gx === 0 && cell.gz === 0) continue
      const def = deps.defFor(cell)
      resolved++
      if (def && !def.isHome) defs.push(def)
    }
    const tiers = HOST_TIERS.map((specializations) =>
      defs.flatMap((def) => upperTierEligibleTraderIds(def, specializations).map((npcId) => ({ settlementId: def.id, npcId }))))
    const total = tiers.reduce((sum, tier) => sum + tier.length, 0)
    const out = new Map<UpperTierIdentity, UpperTierHost>()
    if (total === 0) return out
    const cap = Math.max(MAX_IDENTITIES_PER_HOST, Math.ceil(UPPER_TIER_IDENTITY_LIST.length / total))
    const load = new Map<string, number>()
    for (const kind of UPPER_TIER_IDENTITY_LIST) {
      const tier = tiers.find((sources) => sources.some((source) => (load.get(source.npcId) ?? 0) < cap))!
      const best = tier
        .filter((source) => (load.get(source.npcId) ?? 0) < cap)
        .map((source) => ({ source, rank: rankOf(deps.seed, kind, source.npcId) }))
        .sort((a, b) => a.rank - b.rank || a.source.npcId.localeCompare(b.source.npcId))[0]!.source
      load.set(best.npcId, (load.get(best.npcId) ?? 0) + 1)
      out.set(kind, { kind, settlementId: best.settlementId, npcId: best.npcId, issuanceKey: `merchant:${best.settlementId}:${best.npcId}:${kind}` })
    }
    return out
  }
  const all = (): Map<UpperTierIdentity, UpperTierHost> => (hosts ??= build())
  return {
    hostFor: (kind) => all().get(kind) ?? null,
    hostedKindsFor: (npcId) => UPPER_TIER_IDENTITY_LIST.filter((kind) => all().get(kind)?.npcId === npcId),
    get resolvedDefCount() { return resolved },
  }
}

/**
 * Issues the specimens designated to one merchant into its own stock (items-player-064 U3).
 * Keyed on ledger absence, not on the stock-init latch: a kind already in the ledger (live or
 * destroyed — Q-U1) is never attempted again, so reconstruction, reload, unload and sold-out
 * stock cannot reissue, and a world whose merchant latched before this slice still receives
 * its specimen on the next materialization. Kinds that are not catalog-registered yet (the
 * armor identities until items-player-066) make `claimUpperTierInstance` return null without
 * touching the ledger, so registering them later issues them automatically. A dead merchant
 * is skipped (its stock is a corpse owner; the identity stays unissued). The specimen is added
 * on top of the ordinary assortment (merchant stock has no size/weight cap).
 *
 * @domain items-player
 * @system equipment
 */
export function issueHostedUpperTierStock(input: {
  ledger: UpperTierIssuanceLedger
  hosts: UpperTierHostResolver
  npcId: NpcId
  stock: Inventory
  alive: boolean
}): UpperTierIdentity[] {
  const { ledger, hosts, npcId, stock, alive } = input
  if (!alive) return []
  const issued: UpperTierIdentity[] = []
  if (UPPER_TIER_IDENTITY_LIST.every((kind) => ledger[kind])) return issued
  for (const kind of hosts.hostedKindsFor(npcId)) {
    if (ledger[kind]) continue
    const host = hosts.hostFor(kind)
    if (!host) continue
    const specimen = claimUpperTierInstance({
      ledger,
      kind,
      issuanceKey: host.issuanceKey,
      destination: stock,
      preflightSource: () => true,
      snapshotSource: () => null,
      commitSource: () => true,
      restoreSource: () => {},
    })
    if (specimen) issued.push(kind)
  }
  return issued
}

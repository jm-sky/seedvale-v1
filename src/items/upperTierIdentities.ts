/** The A8 identities reserved for one-per-world issuance (Stage 4 matrix U rows).
 *  Names are strings so the ledger can precede catalog registration for armor.
 *
 * @domain items-player
 * @system equipment
 */
export const UPPER_TIER_IDENTITY_LIST = [
  'kestrel_dagger',
  'pinewatch_longsword',
  'harrow_shortsword',
  'ironvale_sword',
  'greywatch_longsword',
  'yewmaster_longbow',
  'kingsbane_hauberk',
  'marshal_cuirass',
  'saltmere_wardens_coat',
  'northpass_riders_helm',
  'thornwatch_pauldrons',
  'blackpine_vambraces',
  'fallowmere_gauntlets',
  'ridgeguard_greaves',
] as const

export type UpperTierIdentity = typeof UPPER_TIER_IDENTITY_LIST[number]

const UPPER_TIER_IDENTITIES: ReadonlySet<string> = new Set(UPPER_TIER_IDENTITY_LIST)

/** Internal capability passed only by the singleton issuance command to the
 *  instance factories. Ordinary acquisition paths have no reference to it. */
export const UPPER_TIER_FACTORY_ACCESS: unique symbol = Symbol('upper-tier-factory-access')

export function isUpperTierIdentity(kind: string): kind is UpperTierIdentity {
  return UPPER_TIER_IDENTITIES.has(kind)
}

export type UpperTierIssuanceRecord = {
  instanceId: string
  issuanceKey: string
  status: 'live' | 'destroyed'
}

export type UpperTierIssuanceSnapshot = Record<string, UpperTierIssuanceRecord>

export function isUpperTierIssuanceSnapshot(value: unknown): value is UpperTierIssuanceSnapshot {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  return Object.entries(value as Record<string, unknown>).every(([kind, raw]) => {
    if (!isUpperTierIdentity(kind) || !raw || typeof raw !== 'object' || Array.isArray(raw)) return false
    const row = raw as Record<string, unknown>
    return typeof row.instanceId === 'string' && row.instanceId.length > 0
      && typeof row.issuanceKey === 'string' && row.issuanceKey.length > 0
      && (row.status === 'live' || row.status === 'destroyed')
  })
}

export function validateUpperTierOwnerRows(
  ledger: UpperTierIssuanceSnapshot,
  ownerRows: readonly { owner: string, instance: { id: string, kind: string } }[],
): boolean {
  return diagnoseUpperTierOwnerRows(ledger, ownerRows) === null
}

/** Returns an actionable owner/kind/ID integrity message for persistence diagnostics. */
export function diagnoseUpperTierOwnerRows(
  ledger: UpperTierIssuanceSnapshot,
  ownerRows: readonly { owner: string, instance: { id: string, kind: string } }[],
): string | null {
  const ids = new Set<string>()
  const ownerById = new Map<string, string>()
  const restrictedById = new Set<string>()
  const byKind = new Map<string, string[]>()
  for (const { owner, instance } of ownerRows) {
    const previousOwner = ownerById.get(instance.id)
    const restricted = isUpperTierIdentity(instance.kind)
    if (ids.has(instance.id) && (restricted || restrictedById.has(instance.id))) {
      return `duplicate instance ${instance.id} in ${previousOwner} and ${owner}`
    }
    ids.add(instance.id)
    if (!previousOwner) ownerById.set(instance.id, owner)
    if (!restricted) continue
    restrictedById.add(instance.id)
    const owners = byKind.get(instance.kind) ?? []
    owners.push(instance.id)
    byKind.set(instance.kind, owners)
  }
  for (const [kind, claim] of Object.entries(ledger)) {
    const owners = byKind.get(kind) ?? []
    if (claim.status === 'live') {
      if (owners.length !== 1 || owners[0] !== claim.instanceId) return `live claim ${kind}:${claim.instanceId} has ${owners.length} matching owners`
    } else if (owners.length !== 0) return `destroyed claim ${kind}:${claim.instanceId} still has an owner`
  }
  for (const [kind, owners] of byKind) {
    const claim = ledger[kind]
    if (!claim) return `unclaimed upper-tier instance ${kind}:${owners[0]}`
    if (claim.status !== 'live' || owners.length !== 1 || owners[0] !== claim.instanceId) return `owner ${kind}:${owners[0]} contradicts ledger claim ${claim.instanceId}`
  }
  return null
}

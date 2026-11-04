import type { Inventory } from './Inventory'
import { type ArmorKind, createArmorInstance } from './armorItemInstances'
import { createItemInstanceId, isArmorKind, isWeaponMaintenanceKind, type ItemInstance, type WeaponMaintenanceKind } from './itemInstances'
import { ITEM_DEFS, type ItemKind } from './items'
import { isUpperTierIdentity, isUpperTierIssuanceSnapshot, UPPER_TIER_FACTORY_ACCESS, type UpperTierIdentity, validateUpperTierOwnerRows } from './upperTierIdentities'
import { createWeaponInstance } from './weaponMaintenance'

export type UpperTierIssuance = {
  instanceId: string
  issuanceKey: string
  status: 'live' | 'destroyed'
}

export type UpperTierIssuanceLedger = Record<string, UpperTierIssuance>

export type ClaimUpperTierInput = {
  ledger: UpperTierIssuanceLedger
  kind: UpperTierIdentity
  issuanceKey: string
  /** Existing inventory methods; a future durable pickup can supply the same
   *  transactional operations without introducing another inventory owner. */
  destination: Pick<Inventory, 'canAddInstance' | 'addInstance' | 'removeInstance'>
  /** Source marker/payment state snapshot for rollback if any commit step fails. */
  snapshotSource: () => unknown
  /** Preflight source eligibility, payment and destination-specific constraints. */
  preflightSource: () => boolean
  /** Commit the source marker and payment after the specimen enters its owner. */
  commitSource: (instance: ItemInstance) => boolean
  /** Restore the complete source/payment snapshot after a failed commit. */
  restoreSource: (snapshot: unknown) => void
}

const activeClaims = new WeakMap<UpperTierIssuanceLedger, Set<string>>()

function createIssuedInstance(kind: UpperTierIdentity): ItemInstance | null {
  if (!(kind in ITEM_DEFS)) return null
  if (isWeaponMaintenanceKind(kind as ItemKind)) return createWeaponInstance(kind as WeaponMaintenanceKind, UPPER_TIER_FACTORY_ACCESS)
  if (isArmorKind(kind as ItemKind)) return createArmorInstance(kind as ArmorKind, 'common', undefined, UPPER_TIER_FACTORY_ACCESS)
  return { id: createItemInstanceId(), kind: kind as ItemKind }
}

/** Issues one reserved identity into an existing inventory and commits its source
 *  marker synchronously. A failed capacity/source commit leaves neither claim nor
 *  specimen. Transfers never call this command.
 *
 * @domain items-player
 * @system equipment
 */
export function claimUpperTierInstance(input: ClaimUpperTierInput): ItemInstance | null {
  const { ledger, kind, issuanceKey, destination } = input
  if (!isUpperTierIdentity(kind) || !issuanceKey || ledger[kind]) return null
  const active = activeClaims.get(ledger) ?? new Set<string>()
  if (active.has(kind)) return null
  active.add(kind)
  activeClaims.set(ledger, active)
  let sourceSnapshot: unknown
  let hasSnapshot = false
  let instance: ItemInstance | null = null
  let added = false
  let sourceRestored = false
  try {
    if (!input.preflightSource()) return null
    instance = createIssuedInstance(kind)
    if (!instance || (instance.kind as string) !== kind || !instance.id || !destination.canAddInstance(instance)) return null
    sourceSnapshot = input.snapshotSource()
    hasSnapshot = true
    if (!destination.addInstance(instance)) return null
    added = true
    if (!input.commitSource(instance)) {
      destination.removeInstance(instance.id)
      added = false
      input.restoreSource(sourceSnapshot)
      sourceRestored = true
      return null
    }
    ledger[kind] = { instanceId: instance.id, issuanceKey, status: 'live' }
    return instance
  } catch {
    if (added && instance) destination.removeInstance(instance.id)
    if (hasSnapshot && !sourceRestored) {
      try {
        input.restoreSource(sourceSnapshot)
        sourceRestored = true
      } catch {
        throw new Error(`Upper-tier issuance rollback failed for ${kind}`)
      }
    }
    return null
  } finally {
    active.delete(kind)
    if (active.size === 0) activeClaims.delete(ledger)
  }
}

/** Marks the identity permanently unavailable after an explicit destruction event.
 *  Absence from loaded owners is never sufficient evidence for this transition.
 *
 * @domain items-player
 * @system equipment
 */
export function markUpperTierDestroyed(
  ledger: UpperTierIssuanceLedger,
  kind: UpperTierIdentity,
  instanceId: string,
): boolean {
  const claim = ledger[kind]
  if (!claim || claim.instanceId !== instanceId || claim.status !== 'live') return false
  ledger[kind] = { ...claim, status: 'destroyed' }
  return true
}

export function isUpperTierIssuanceLedger(value: unknown): value is UpperTierIssuanceLedger {
  return isUpperTierIssuanceSnapshot(value)
}

/** Load/write integrity check for the currently persisted owner payloads. It rejects
 *  duplicate physical IDs, multiple specimens for one identity, orphan live claims,
 *  and owner rows lacking the matching claim. Held/equipment ID references are not
 *  owners and therefore do not count as extra specimens.
 *
 * @domain items-player
 * @system equipment
 */
export function validateUpperTierOwnership(
  ledger: UpperTierIssuanceLedger,
  ownerRows: readonly { owner: string, instance: { id: string, kind: string } }[],
): boolean {
  return validateUpperTierOwnerRows(ledger, ownerRows)
}

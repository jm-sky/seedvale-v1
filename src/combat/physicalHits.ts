import type { PhysicalHit } from './incomingHumanHit'

/**
 * Typed hit builders for sources that have no weapon/projectile config of their own.
 * Environmental sources are unblockable and carry an explicit stable source id so the
 * deterministic block/location rolls never share a generic attacker key.
 *
 * @domain combat
 */

/** Container blade trap: hands/cut, unblockable; `containerId` is the stable trapped container id. */
export function trapPhysicalHit(amount: number, containerId: string): PhysicalHit {
  return {
    amount,
    damageType: 'cut',
    source: 'trap',
    attackerId: `trap:${containerId}`,
    profile: 'reference',
    forcedLocation: 'hands',
    blockable: false,
  }
}

/** Mount fall: legs-weighted blunt with armor, unblockable; `mountId` is the animal that threw the rider. */
export function fallPhysicalHit(amount: number, mountId: string): PhysicalHit {
  return {
    amount,
    damageType: 'blunt',
    source: 'fall',
    attackerId: `fall:${mountId}`,
    profile: 'fall',
    blockable: false,
  }
}

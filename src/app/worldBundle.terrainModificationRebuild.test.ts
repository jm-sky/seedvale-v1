/** Plan world-terrain-043 — same-world rebuild terrain-modification carry. */

import { describe, expect, it } from 'vitest'
import type { TerrainModification } from '../terrain/chunkManager'
import { carryTerrainModificationsAcrossRebuild } from './worldBundle'

const playerDig: TerrainModification = {
  x: 1, z: 2, radius: 3, depth: 0.5, mode: 'dig', source: 'player',
}
const playerPrepare: TerrainModification = {
  x: 0, z: 0, radius: 0, depth: 0, mode: 'prepare', id: 'prep:1',
  samples: [{ x: 4, z: 5, height: 10 }], source: 'player',
}
const systemDig: TerrainModification = {
  x: 10, z: 20, radius: 8, depth: 1.2, mode: 'dig', source: 'system',
}
const systemScorch: TerrainModification = {
  x: -3, z: 7, radius: 4, depth: 0.15, mode: 'scorch', source: 'system',
}

describe('carryTerrainModificationsAcrossRebuild', () => {
  it('keeps only player-authored entries', () => {
    const mixed = [playerDig, playerPrepare, systemDig, systemScorch]
    const carried = carryTerrainModificationsAcrossRebuild(mixed)
    expect(carried).toEqual([playerDig, playerPrepare])
  })

  it('drops reconstructed system effects on a second carry cycle', () => {
    let mods: TerrainModification[] = [playerDig, playerPrepare, systemDig, systemScorch]
    mods = carryTerrainModificationsAcrossRebuild(mods)
    mods = [...mods, { ...systemDig, depth: systemDig.depth + 0.01 }]
    mods = carryTerrainModificationsAcrossRebuild(mods)
    expect(mods).toEqual([playerDig, playerPrepare])
  })

  it('returns a new array so the caller can rebind app-owned state', () => {
    const mixed = [playerDig, systemDig]
    const carried = carryTerrainModificationsAcrossRebuild(mixed)
    expect(carried).not.toBe(mixed)
    carried.push(systemDig)
    expect(mixed).toHaveLength(2)
  })
})

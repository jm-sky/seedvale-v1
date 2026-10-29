import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Scene } from 'three'
import { describe, expect, it } from 'vitest'
import { censusMatrixWork, formatMatrixWorkLines } from './matrixCensus'

function named<T extends { name: string }>(object: T, name: string): T {
  object.name = name
  return object
}

function mesh(): Mesh {
  return new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial())
}

describe('censusMatrixWork', () => {
  it('counts the force cascade from an auto-updating scene root', () => {
    const scene = new Scene()
    const settlement = named(new Group(), 'settlement')
    const frozen = mesh()
    frozen.matrixAutoUpdate = false
    settlement.add(frozen, mesh())
    scene.add(settlement)

    const census = censusMatrixWork(scene)
    expect(census.buckets.settlement).toEqual({ nodes: 3, composed: 2, multiplied: 3, skinned: 0 })
  })

  it('stops multiplying below a frozen chain and names the root owner', () => {
    const scene = new Scene()
    scene.matrixAutoUpdate = false
    const settlement = named(new Group(), 'settlement')
    settlement.matrixAutoUpdate = false
    const frozen = mesh()
    frozen.matrixAutoUpdate = false
    const moving = mesh()
    moving.add(mesh())
    settlement.add(frozen, moving)
    scene.add(settlement)

    const census = censusMatrixWork(scene)
    expect(census.buckets.settlement).toEqual({ nodes: 4, composed: 2, multiplied: 2, skinned: 0 })
    expect(census.topRoots[0]).toMatchObject({ name: 'settlement', roots: 1, multiplied: 2 })
    expect(formatMatrixWorkLines(census)).toContain('settlement ×1')
  })

  it('groups same-named scene children', () => {
    const scene = new Scene()
    scene.add(named(new Group(), 'npc'), named(new Group(), 'npc'))
    expect(censusMatrixWork(scene).topRoots).toEqual([
      { name: 'npc', roots: 2, nodes: 2, composed: 2, multiplied: 2, skinned: 0 },
    ])
  })
})

import { Group, Object3D } from 'three'
import { describe, expect, it } from 'vitest'
import { createAgentPresentationVisibility } from './agentPresentationVisibility'

function buildHierarchy(): { root: Object3D, body: Object3D, hair: Object3D, beard: Object3D } {
  const root = new Group()
  const body = new Group()
  const hair = new Group()
  const beard = new Group()
  root.add(body)
  root.add(hair)
  root.add(beard)
  return { root, body, hair, beard }
}

describe('createAgentPresentationVisibility', () => {
  it('returns null for an empty optional-node set', () => {
    expect(createAgentPresentationVisibility([])).toBeNull()
  })

  it('starts at near — construction does not hide anything', () => {
    const { hair, beard } = buildHierarchy()
    createAgentPresentationVisibility([hair, beard])
    expect(hair.visible).toBe(true)
    expect(beard.visible).toBe(true)
  })

  it('hides only the registered optional nodes on mid/far, leaving root/body untouched', () => {
    const { root, body, hair, beard } = buildHierarchy()
    const visibility = createAgentPresentationVisibility([hair, beard])!
    visibility.applyLevel('mid')
    expect(hair.visible).toBe(false)
    expect(beard.visible).toBe(false)
    expect(root.visible).toBe(true)
    expect(body.visible).toBe(true)
  })

  it('restores all owned nodes on a return to near', () => {
    const { hair, beard } = buildHierarchy()
    const visibility = createAgentPresentationVisibility([hair, beard])!
    visibility.applyLevel('far')
    visibility.applyLevel('near')
    expect(hair.visible).toBe(true)
    expect(beard.visible).toBe(true)
  })

  it('treats mid and far the same for a single optional-node tier', () => {
    const { hair } = buildHierarchy()
    const visibility = createAgentPresentationVisibility([hair])!
    visibility.applyLevel('mid')
    expect(hair.visible).toBe(false)
    visibility.applyLevel('far')
    expect(hair.visible).toBe(false)
  })

  it('is a no-op on a repeated same-level apply', () => {
    const { hair } = buildHierarchy()
    const visibility = createAgentPresentationVisibility([hair])!
    visibility.applyLevel('mid')
    hair.visible = true // simulate external code re-showing it between calls
    visibility.applyLevel('mid')
    expect(hair.visible).toBe(true) // unchanged — the second call saw no level transition
  })

  it('never touches layers', () => {
    const { hair } = buildHierarchy()
    const before = hair.layers.mask
    const visibility = createAgentPresentationVisibility([hair])!
    visibility.applyLevel('far')
    visibility.applyLevel('near')
    expect(hair.layers.mask).toBe(before)
  })
})

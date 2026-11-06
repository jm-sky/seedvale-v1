import { Object3D } from 'three'
import { describe, expect, it } from 'vitest'
import { AGENT_RENDER_LAYER } from '../world/waterMirror'
import { setActorSightConcealed, SIGHT_CONCEALED_LAYER } from './actorSightConcealment'

describe('setActorSightConcealed', () => {
  it('sets and restores layers on nested children without touching visible', () => {
    const root = new Object3D()
    const child = new Object3D()
    const label = new Object3D()
    child.add(label)
    root.add(child)
    child.visible = false
    setActorSightConcealed(root, true)
    for (const o of [root, child, label]) expect(o.layers.isEnabled(SIGHT_CONCEALED_LAYER)).toBe(true)
    expect(label.layers.isEnabled(AGENT_RENDER_LAYER)).toBe(false)
    setActorSightConcealed(root, false)
    for (const o of [root, child, label]) {
      expect(o.layers.isEnabled(AGENT_RENDER_LAYER)).toBe(true)
      expect(o.layers.isEnabled(SIGHT_CONCEALED_LAYER)).toBe(false)
    }
    expect(root.visible).toBe(true)
    expect(child.visible).toBe(false)
  })
})

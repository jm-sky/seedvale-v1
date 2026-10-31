import { BufferGeometry, Group, MeshBasicMaterial, SkinnedMesh } from 'three'
import { describe, expect, it } from 'vitest'
import { applyBodyBuild, parseBodyBuild, supportedBodyBuilds } from './bodyBuild'

function mesh(name: string, dict?: Record<string, number>, infl?: number[]): SkinnedMesh {
  const m = new SkinnedMesh(new BufferGeometry(), new MeshBasicMaterial())
  m.name = name
  if (dict) { m.morphTargetDictionary = dict; m.morphTargetInfluences = infl ?? Object.keys(dict).map(() => 0) }
  return m
}

describe('bodyBuild', () => {
  it('parses ids and rejects unknown', () => {
    expect(parseBodyBuild('Heavy')).toBe('heavy')
    expect(parseBodyBuild('child')).toBeUndefined()
    expect(parseBodyBuild(null)).toBeUndefined()
  })

  it('sets only the owned influence and keeps foreign morphs', () => {
    const root = new Group()
    const body = mesh('Body', { Wink: 0, Fat: 1, Slim: 2 }, [0.5, 1, 0])
    root.add(body)
    applyBodyBuild(root, 'slim')
    expect(body.morphTargetInfluences).toEqual([0.5, 0, 1])
    applyBodyBuild(root, 'muscular')
    expect(body.morphTargetInfluences).toEqual([0.5, 0, 0])
    applyBodyBuild(root, 'heavy')
    expect(body.morphTargetInfluences).toEqual([0.5, 1, 0])
  })

  it('rejects a build when an affected garment lacks the target, but tolerates head zone', () => {
    const root = new Group()
    root.add(mesh('Body', { Fat: 0, Slim: 1 }), mesh('Male_Head_Hood'), mesh('HAIR_Parted'))
    expect(supportedBodyBuilds(root)).toEqual(['muscular', 'heavy', 'slim'])
    root.add(mesh('EQ_Pauldrons'))
    expect(applyBodyBuild(root, 'heavy', true).unsupported).toEqual(['EQ_Pauldrons'])
    expect(supportedBodyBuilds(root)).toEqual(['muscular'])
  })
})

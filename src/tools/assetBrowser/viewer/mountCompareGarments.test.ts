import { Bone, BufferAttribute, BufferGeometry, Group, MeshBasicMaterial, Object3D, Skeleton, SkinnedMesh } from 'three'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { attachCompareGarments, attachCompareHair, attachCompareHead, attachCompareKit } from './mountCompareGarments'

vi.mock('../../../assets/loadGltf', () => ({
  loadGltf: vi.fn(),
}))

import { loadGltf } from '../../../assets/loadGltf'

beforeEach(() => {
  vi.mocked(loadGltf).mockReset()
})

function skinnedWithBone(meshName: string, boneName: string): SkinnedMesh {
  const bone = new Bone()
  bone.name = boneName
  const geom = new BufferGeometry()
  const mesh = new SkinnedMesh(geom, new MeshBasicMaterial())
  mesh.name = meshName
  mesh.add(bone)
  mesh.bind(new Skeleton([bone]))
  return mesh
}

function bodyWithPelvis(): { body: Object3D, bone: Bone } {
  const body = new Object3D()
  const bone = new Bone()
  bone.name = 'pelvis'
  body.add(bone)
  return { body, bone }
}

describe('attachCompareHead', () => {
  it('no-ops when headUrl missing', async () => {
    expect(await attachCompareHead(new Object3D(), {})).toEqual({ attached: [], warnings: [] })
    expect(loadGltf).not.toHaveBeenCalled()
  })

  it('binds head skinned meshes onto the body skeleton', async () => {
    const { body, bone } = bodyWithPelvis()
    const pack = new Group()
    pack.add(skinnedWithBone('Head', 'pelvis'))
    vi.mocked(loadGltf).mockResolvedValueOnce(pack)

    const result = await attachCompareHead(body, { headUrl: '/compare/v3/Male_Head.glb' })
    expect(result.attached).toEqual(['Head'])
    expect(result.warnings).toEqual([])
    const attached = body.children.find((c) => c.name === 'Head') as SkinnedMesh
    expect(attached.skeleton.bones[0]).toBe(bone)
  })
})

describe('attachCompareGarments', () => {
  it('no-ops when garments or eqUrl missing', async () => {
    const body = new Object3D()
    expect(await attachCompareGarments(body, {})).toEqual({ attached: [], warnings: [] })
    expect(loadGltf).not.toHaveBeenCalled()
  })

  it('warns when body has no bones', async () => {
    const body = new Object3D()
    const result = await attachCompareGarments(body, {
      garments: ['PeasantSkirt'],
      eqUrl: '/compare/v3/eq/Female.glb',
    })
    expect(result.attached).toEqual([])
    expect(result.warnings[0]).toMatch(/no bones/i)
    expect(loadGltf).not.toHaveBeenCalled()
  })

  it('binds EQ_PeasantSkirt onto the body skeleton by bone name', async () => {
    const { body, bone } = bodyWithPelvis()

    const pack = new Group()
    pack.add(skinnedWithBone('EQ_PeasantSkirt', 'pelvis'))
    vi.mocked(loadGltf).mockResolvedValueOnce(pack)

    const result = await attachCompareGarments(body, {
      garments: ['PeasantSkirt'],
      eqUrl: '/compare/v3/eq/Female.glb',
    })
    expect(result.attached).toEqual(['EQ_PeasantSkirt'])
    expect(result.warnings).toEqual([])
    const attached = body.children.find((c) => c.name === 'EQ_PeasantSkirt') as SkinnedMesh
    expect(attached?.isSkinnedMesh).toBe(true)
    expect(attached.skeleton.bones[0]).toBe(bone)
  })
})

describe('attachCompareKit', () => {
  it('attaches head then skirt', async () => {
    const { body } = bodyWithPelvis()
    const headPack = new Group()
    headPack.add(skinnedWithBone('Head', 'pelvis'))
    const eqPack = new Group()
    eqPack.add(skinnedWithBone('EQ_PeasantSkirt', 'pelvis'))
    vi.mocked(loadGltf)
      .mockResolvedValueOnce(headPack)
      .mockResolvedValueOnce(eqPack)

    const result = await attachCompareKit(body, {
      headUrl: '/compare/v3/Female_Head.glb',
      garments: ['PeasantSkirt'],
      eqUrl: '/compare/v3/eq/Female.glb',
    })
    expect(result.attached).toEqual(['Head', 'EQ_PeasantSkirt'])
    expect(result.warnings).toEqual([])
  })

  it('skips head when opts.head is false', async () => {
    const { body } = bodyWithPelvis()
    const eqPack = new Group()
    eqPack.add(skinnedWithBone('EQ_PeasantSkirt', 'pelvis'))
    vi.mocked(loadGltf).mockResolvedValueOnce(eqPack)

    const result = await attachCompareKit(
      body,
      {
        headUrl: '/compare/v3/Female_Head.glb',
        garments: ['PeasantSkirt'],
        eqUrl: '/compare/v3/eq/Female.glb',
      },
      { head: false },
    )
    expect(result.attached).toEqual(['EQ_PeasantSkirt'])
    expect(loadGltf).toHaveBeenCalledTimes(1)
    expect(loadGltf).toHaveBeenCalledWith('/compare/v3/eq/Female.glb')
  })
})


function morphGarment(name: string): SkinnedMesh {
  const mesh = skinnedWithBone(name, 'pelvis')
  mesh.geometry.setAttribute('position', new BufferAttribute(new Float32Array(9), 3))
  mesh.geometry.morphAttributes.position = [
    new BufferAttribute(new Float32Array(9).fill(1), 3),
    new BufferAttribute(new Float32Array(9).fill(2), 3),
  ]
  mesh.updateMorphTargets()
  mesh.morphTargetDictionary = { Fat: 0, Slim: 1 }
  mesh.morphTargetInfluences = [0.25, 0.75]
  return mesh
}

describe('morph preservation on rebind (tools-022)', () => {
  it('keeps morph attributes, dictionary and per-instance influences on WorkSkirt', async () => {
    const { body, bone } = bodyWithPelvis()
    const src = morphGarment('EQ_WorkSkirt')
    const pack = new Group()
    pack.add(src, morphGarment('EQ_WorkSkirtRed'))
    vi.mocked(loadGltf).mockResolvedValueOnce(pack)

    const result = await attachCompareGarments(body, { garments: ['WorkSkirt'], eqUrl: '/x/eq/Female.glb' })
    expect(result.attached).toEqual(['EQ_WorkSkirt']) // not the Red dye
    const out = body.children.find((c) => c.name === 'EQ_WorkSkirt') as SkinnedMesh
    expect(out.skeleton.bones[0]).toBe(bone)
    expect(out.geometry.morphAttributes.position).toHaveLength(2)
    expect(out.morphTargetDictionary).toEqual({ Fat: 0, Slim: 1 })
    expect(out.morphTargetDictionary).not.toBe(src.morphTargetDictionary)
    expect(out.morphTargetInfluences).toEqual([0.25, 0.75])
    expect(out.morphTargetInfluences).not.toBe(src.morphTargetInfluences)
    out.morphTargetInfluences![0] = 1
    expect(src.morphTargetInfluences![0]).toBe(0.25)
  })

  it('attaches only the requested hair node', async () => {
    const { body } = bodyWithPelvis()
    const pack = new Group()
    pack.add(skinnedWithBone('HAIR_Parted', 'pelvis'), skinnedWithBone('HAIR_Long', 'pelvis'))
    vi.mocked(loadGltf).mockResolvedValueOnce(pack)
    const result = await attachCompareHair(body, { hair: { url: '/h.glb', nodes: ['HAIR_Parted'] } })
    expect(result.attached).toEqual(['HAIR_Parted'])
  })
})

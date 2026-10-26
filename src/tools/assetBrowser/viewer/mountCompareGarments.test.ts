import { Bone, Object3D, Skeleton, SkinnedMesh, BufferGeometry, MeshBasicMaterial } from 'three'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { attachCompareGarments, attachCompareHead, attachCompareKit } from './mountCompareGarments'

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
    const pack = new Object3D()
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

    const pack = new Object3D()
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
    const headPack = new Object3D()
    headPack.add(skinnedWithBone('Head', 'pelvis'))
    const eqPack = new Object3D()
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
    const eqPack = new Object3D()
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


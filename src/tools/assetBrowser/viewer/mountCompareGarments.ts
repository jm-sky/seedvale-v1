import { Bone, Object3D, Skeleton, SkinnedMesh } from 'three'
import type { AssetIndexEntry, CompareGarment } from '../../../assets/assetIndex'
import { loadGltf } from '../../../assets/loadGltf'

const EQ_PREFIX = 'EQ_'

export type CompareAttachResult = {
  attached: readonly string[]
  warnings: readonly string[]
}

function collectBones(root: Object3D): Map<string, Bone> {
  const bones = new Map<string, Bone>()
  root.traverse((o) => {
    if ((o as Bone).isBone) bones.set(o.name, o as Bone)
  })
  return bones
}

function resolveBone(bones: Map<string, Bone>, name: string): Bone | undefined {
  return bones.get(name) ?? bones.get(name.replace(/_\d+$/, ''))
}

/** Rebind every SkinnedMesh from `pack` onto `body`'s skeleton (v2 head / eq contract). */
function rebindAllSkinned(
  body: Object3D,
  bones: Map<string, Bone>,
  pack: Object3D,
  label: string,
): CompareAttachResult {
  const attached: string[] = []
  const warnings: string[] = []

  pack.traverse((o) => {
    const src = o as SkinnedMesh
    if (!src.isSkinnedMesh) return

    const newBones = src.skeleton.bones.map((b) => resolveBone(bones, b.name) ?? b)
    const missing = src.skeleton.bones
      .filter((b, i) => newBones[i] === b && !bones.has(b.name) && !bones.has(b.name.replace(/_\d+$/, '')))
      .map((b) => b.name)
    if (missing.length > 0) {
      warnings.push(
        `${label}/${src.name}: unbound bones ${missing.slice(0, 6).join(', ')}${missing.length > 6 ? '…' : ''}`,
      )
    }

    const skeleton = new Skeleton(newBones, src.skeleton.boneInverses)
    const mesh = new SkinnedMesh(src.geometry, src.material)
    mesh.name = src.name || label
    mesh.frustumCulled = false
    body.add(mesh)
    mesh.bind(skeleton, src.bindMatrix)
    attached.push(mesh.name)
  })

  if (attached.length === 0) {
    warnings.push(`${label}: no skinned meshes to attach`)
  }
  return { attached, warnings }
}

/**
 * Attach Quaternius base head (`Male_Head` / `Female_Head`) onto a loaded body.
 * One variant per sex; Lean/Round/Warm omitted by design.
 */
export async function attachCompareHead(
  body: Object3D,
  entry: Pick<AssetIndexEntry, 'headUrl'>,
): Promise<CompareAttachResult> {
  const headUrl = entry.headUrl
  if (!headUrl) return { attached: [], warnings: [] }

  const bones = collectBones(body)
  if (bones.size === 0) {
    return {
      attached: [],
      warnings: [`Compare head skipped: body has no bones (${headUrl})`],
    }
  }

  let pack: Object3D
  try {
    pack = await loadGltf(headUrl)
  } catch (err) {
    return {
      attached: [],
      warnings: [`Compare head failed to load ${headUrl}: ${String(err)}`],
    }
  }

  return rebindAllSkinned(body, bones, pack, 'head')
}

/**
 * Attach Quaternius eq garments (e.g. PeasantSkirt) onto a loaded body by
 * rebinding skinned meshes to the body's skeleton via joint name — same
 * contract as v2 `Actors.attachEquipment` / v3 CharacterKit. Fail closed.
 */
export async function attachCompareGarments(
  body: Object3D,
  entry: Pick<AssetIndexEntry, 'garments' | 'eqUrl'>,
): Promise<CompareAttachResult> {
  const garments = entry.garments
  const eqUrl = entry.eqUrl
  if (!garments?.length || !eqUrl) {
    return { attached: [], warnings: [] }
  }

  const bones = collectBones(body)
  if (bones.size === 0) {
    return {
      attached: [],
      warnings: [`Compare garments skipped: body has no bones (${eqUrl})`],
    }
  }

  let pack: Object3D
  try {
    pack = await loadGltf(eqUrl)
  } catch (err) {
    return {
      attached: [],
      warnings: [`Compare garments failed to load ${eqUrl}: ${String(err)}`],
    }
  }

  const attached: string[] = []
  const warnings: string[] = []
  const wanted = new Set<CompareGarment>(garments)

  pack.traverse((o) => {
    const src = o as SkinnedMesh
    if (!src.isSkinnedMesh) return
    const mod = [...wanted].find(
      (w) => src.name === `${EQ_PREFIX}${w}` || src.name.startsWith(`${EQ_PREFIX}${w}_`),
    )
    if (!mod) return

    const newBones = src.skeleton.bones.map((b) => resolveBone(bones, b.name) ?? b)
    const missing = src.skeleton.bones
      .filter((b, i) => newBones[i] === b && !bones.has(b.name) && !bones.has(b.name.replace(/_\d+$/, '')))
      .map((b) => b.name)
    if (missing.length > 0) {
      warnings.push(`EQ_${mod}: unbound bones ${missing.slice(0, 6).join(', ')}${missing.length > 6 ? '…' : ''}`)
    }

    const skeleton = new Skeleton(newBones, src.skeleton.boneInverses)
    const mesh = new SkinnedMesh(src.geometry, src.material)
    mesh.name = src.name
    mesh.frustumCulled = false
    body.add(mesh)
    mesh.bind(skeleton, src.bindMatrix)
    attached.push(src.name)
  })

  if (attached.length === 0) {
    warnings.push(
      `No eq nodes for [${[...wanted].join(', ')}] in ${eqUrl}`,
    )
  }

  // Do not dispose pack geometry/materials — SkinnedMesh instances share them.
  return { attached, warnings }
}

/** Head first, then garments — shared status line for the asset-browser slot. */
export async function attachCompareKit(
  body: Object3D,
  entry: Pick<AssetIndexEntry, 'headUrl' | 'garments' | 'eqUrl'>,
): Promise<CompareAttachResult> {
  const head = await attachCompareHead(body, entry)
  const garments = await attachCompareGarments(body, entry)
  return {
    attached: [...head.attached, ...garments.attached],
    warnings: [...head.warnings, ...garments.warnings],
  }
}

/**
 * Slim Quaternius kit: body + rebind head / hair / eq onto the body skeleton,
 * then merge clips from `anims.glb`. Same attach contract as asset-browser
 * `mountCompareGarments` / V3 CharacterKit (no merge/instancing).
 */
import {
  type AnimationClip,
  Bone,
  Color,
  type Group,
  type MeshStandardMaterial,
  Object3D,
  Skeleton,
  SkinnedMesh,
} from 'three'
import type { CharacterAppearance, HairNode } from './characterTypes'
import { loadGltf, loadGltfAnimated } from '../assets/loadGltf'
import {
  ANIMS_URL,
  bodyUrl,
  characterUrls,
  eqNodeName,
  eqUrl,
  hairNodeName,
  hairUrl,
  headUrl,
} from './characterFiles'

export type AssembledCharacter = {
  animations: AnimationClip[]
  scene: Group
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

function rebindAllSkinned(
  body: Object3D,
  bones: Map<string, Bone>,
  pack: Object3D,
  label: string,
): { attached: string[], warnings: string[] } {
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

function rebindNamedNodes(
  body: Object3D,
  bones: Map<string, Bone>,
  pack: Object3D,
  nodeNames: readonly string[],
  label: string,
): { attached: string[], warnings: string[] } {
  const attached: string[] = []
  const warnings: string[] = []
  const wanted = new Set(nodeNames)

  for (const name of wanted) {
    const node = pack.getObjectByName(name)
    if (!node) {
      warnings.push(`${label}: missing node ${name}`)
      continue
    }
    const result = rebindAllSkinned(body, bones, node, name)
    attached.push(...result.attached)
    warnings.push(...result.warnings)
  }

  return { attached, warnings }
}

const UNTINTED_PREFIXES = ['MI_Eye', 'MI_Hair', 'MI_Superhero', 'MI_SuperHero', 'Eyes', 'Eyebrows']

function applyClothTint(root: Object3D, tint: number | null): void {
  if (tint === null) return
  const multiply = new Color(tint)
  root.traverse((o) => {
    const mesh = o as SkinnedMesh
    if (!mesh.isMesh) return
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const mat of mats) {
      if (!mat || UNTINTED_PREFIXES.some((p) => mat.name.startsWith(p))) continue
      const m = mat as MeshStandardMaterial
      if (!('color' in m) || !m.color) continue
      const cloned = m.clone() as MeshStandardMaterial
      cloned.color = m.color.clone().multiply(multiply)
      cloned.name = m.name
      cloned.userData.sharedGpu = false
      cloned.userData.ubcOutfitMaterial = true
      cloned.userData.defaultMap = cloned.map ?? null
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((x) => (x === mat ? cloned : x))
      } else {
        mesh.material = cloned
      }
    }
  })
}

function hairNodesFor(a: CharacterAppearance): string[] {
  const nodes: HairNode[] = []
  if (a.hair !== null) nodes.push(a.hair)
  if (a.beard) nodes.push('Beard')
  return nodes.map(hairNodeName)
}

/**
 * Load and assemble a Quaternius character for live NPC/player use.
 */
export async function assembleCharacter(a: CharacterAppearance): Promise<AssembledCharacter> {
  const warnings: string[] = []
  const { scene, animations: bodyAnims } = await loadGltfAnimated(bodyUrl(a.sex, a.outfit))
  const bones = collectBones(scene)
  if (bones.size === 0) {
    throw new Error(`assembleCharacter: body has no bones (${bodyUrl(a.sex, a.outfit)})`)
  }

  try {
    const head = await loadGltf(headUrl(a.sex, a.head))
    const headResult = rebindAllSkinned(scene, bones, head, 'head')
    warnings.push(...headResult.warnings)
  } catch (err) {
    warnings.push(`head failed: ${String(err)}`)
  }

  const hairNodeList = hairNodesFor(a)
  if (hairNodeList.length > 0) {
    try {
      const hair = await loadGltf(hairUrl(a.head))
      const hairResult = rebindNamedNodes(scene, bones, hair, hairNodeList, 'hair')
      warnings.push(...hairResult.warnings)
    } catch (err) {
      warnings.push(`hair failed: ${String(err)}`)
    }
  }

  if (a.garments.length > 0) {
    try {
      const eq = await loadGltf(eqUrl(a.sex))
      const eqNames = a.garments.map(eqNodeName)
      const eqResult = rebindNamedNodes(scene, bones, eq, eqNames, 'eq')
      warnings.push(...eqResult.warnings)
    } catch (err) {
      warnings.push(`eq failed: ${String(err)}`)
    }
  }

  applyClothTint(scene, a.clothTint)

  let animations = bodyAnims
  try {
    const anims = await loadGltfAnimated(ANIMS_URL)
    animations = [...bodyAnims, ...anims.animations]
  } catch (err) {
    warnings.push(`anims failed: ${String(err)}`)
  }

  return { scene, animations, warnings }
}

/** Warm kit URLs used by equipment-driven player outfits. */
export function kitPreloadUrls(a: CharacterAppearance): readonly string[] {
  return characterUrls(a)
}

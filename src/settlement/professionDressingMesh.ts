/**
 * Render projection of the profession-signature home dressing (queue Q48 / Q42 plan §2.4).
 * `professionDressing.ts` (pure) decides WHAT hangs where; this module loads the extracted donor pack
 * (`profession-dressing.glb`), bakes every placement into ONE merged mesh per material (static geometry,
 * world space — the settlement group is world-positioned) and derives OBB colliders for the freestanding
 * slot pieces. No per-house objects, no per-frame work.
 * @domain settlements-npcs
 */
import * as THREE from 'three'
import type { Collider } from '../world/collision'
import type { DressingKit, DressingPlacement, SlotDressingPlacement, WallDressingPlacement } from './professionDressing'
import { loadGltfAsset } from '../assets/loadGltf'
import { houseLocalToWorld } from './householdYard'
import { SLOT_KITS, WALL_KITS } from './professionDressing'
import { PROFESSION_DRESSING_GLB } from './propSpecs'

/** GLB node per kit (V3 `props.glb` names). */
const KIT_NODE: Record<DressingKit, readonly string[]> = {
  antlers: ['Hamlet_Antlers'],
  hidesFrame: ['Hamlet_HidesFrame'],
  shield: ['Hamlet_Shield'],
  banner: ['Hamlet_Banner'],
  netOnWall: ['Hamlet_NetOnWall'],
  dryingRack: ['Hamlet_DryingRack'],
  stumpWithAxe: ['Hamlet_Axe'],
  sacks: ['Hamlet_Sack'],
  handCart: ['Hamlet_Cart'],
  herbBed: ['Hamlet_HerbBed'],
}

/** Dense, de-quantized geometry of one primitive group, in the node frame. */
type PiecePart = {
  position: Float32Array
  normal: Float32Array
  uv: Float32Array | null
  color: Float32Array | null
  index: Uint32Array
  material: THREE.Material
}
export type ProfessionDressingPack = {
  nodes: Map<string, PiecePart[]>
  /** The shared plain vertex-colour material (also used by the stand-in stump), when the pack has one. */
  vertexColorMaterial: THREE.Material | null
}

function dense(attr: THREE.BufferAttribute | THREE.InterleavedBufferAttribute, size: number): Float32Array {
  const out = new Float32Array(attr.count * size)
  for (let i = 0; i < attr.count; i++) {
    out[i * size] = attr.getX(i)
    out[i * size + 1] = attr.getY(i)
    if (size > 2) out[i * size + 2] = attr.getZ(i)
  }
  return out
}

function extractParts(wrapper: THREE.Object3D): PiecePart[] {
  wrapper.updateWorldMatrix(true, true)
  const inverse = wrapper.matrixWorld.clone().invert()
  const parts: PiecePart[] = []
  wrapper.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    const g = mesh.geometry
    const material = Array.isArray(mesh.material) ? mesh.material[0]! : mesh.material
    const toNode = new THREE.Matrix4().multiplyMatrices(inverse, mesh.matrixWorld)
    const normalMatrix = new THREE.Matrix3().getNormalMatrix(toNode)
    const position = dense(g.attributes.position!, 3)
    const v = new THREE.Vector3()
    for (let i = 0; i < position.length; i += 3) {
      v.set(position[i]!, position[i + 1]!, position[i + 2]!).applyMatrix4(toNode)
      position[i] = v.x; position[i + 1] = v.y; position[i + 2] = v.z
    }
    const normal = g.attributes.normal ? dense(g.attributes.normal, 3) : new Float32Array(position.length)
    for (let i = 0; i < normal.length; i += 3) {
      v.set(normal[i]!, normal[i + 1]!, normal[i + 2]!).applyNormalMatrix(normalMatrix).normalize()
      normal[i] = v.x; normal[i + 1] = v.y; normal[i + 2] = v.z
    }
    const count = g.attributes.position!.count
    const color = g.attributes.color ? new Float32Array(count * 3) : null
    if (color) for (let i = 0; i < count; i++) { color[i * 3] = g.attributes.color!.getX(i); color[i * 3 + 1] = g.attributes.color!.getY(i); color[i * 3 + 2] = g.attributes.color!.getZ(i) }
    const index = new Uint32Array(g.index ? g.index.count : count)
    if (g.index) for (let i = 0; i < index.length; i++) index[i] = g.index.getX(i)
    else for (let i = 0; i < count; i++) index[i] = i
    parts.push({ position, normal, uv: g.attributes.uv ? dense(g.attributes.uv, 2) : null, color, index, material })
  })
  return parts
}

/** Pure extraction of the pack from a parsed GLB scene (exported for tests that parse from disk). */
export function extractProfessionDressingPack(root: THREE.Object3D): ProfessionDressingPack {
  root.updateMatrixWorld(true)
  const nodes = new Map<string, PiecePart[]>()
  // The GLB carries several equivalent unnamed, untextured vertex-colour materials; they collapse into one
  // draw (the first) so the whole pack is ≤ 5 materials.
  let vertexColorMaterial: THREE.Material | null = null
  for (const names of Object.values(KIT_NODE)) {
    for (const name of names) {
      const wrapper = root.getObjectByName(name)
      if (!wrapper) throw new Error(`profession-dressing.glb: node "${name}" missing`)
      const parts = extractParts(wrapper)
      for (const part of parts) {
        const m = part.material as THREE.MeshStandardMaterial
        if (m.name === '' && !m.map && m.vertexColors) part.material = vertexColorMaterial ??= m
      }
      nodes.set(name, parts)
    }
  }
  nodes.set(STUMP_NODE, [stumpPart(vertexColorMaterial ?? new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95 }))])
  return { nodes, vertexColorMaterial }
}

let packPromise: Promise<ProfessionDressingPack | null> | null = null

/** Loads (once) the extracted pack; `null` when the GLB failed (callers simply skip the dressing). */
export function loadProfessionDressingPack(): Promise<ProfessionDressingPack | null> {
  packPromise ??= (async () => {
    try {
      const asset = await loadGltfAsset(PROFESSION_DRESSING_GLB.url)
      return extractProfessionDressingPack(asset.root)
    } catch (err) {
      console.error('[professionDressing] pack load failed, homes stay undressed', err)
      return null
    }
  })()
  return packPromise
}

/** One baked item: pack node + kit-local matrix (node frame → kit frame), then placed at (x, y, z, yaw). */
type Item = { node: string, local: THREE.Matrix4 }

const _lean = new THREE.Matrix4()

function kitItems(kit: DressingKit): Item[] {
  const at = (x: number, y: number, z: number) => new THREE.Matrix4().makeTranslation(x, y, z)
  switch (kit) {
    case 'sacks':
      // V3 `sackArrangement`: two sacks on the ground, one on top.
      return [
        { node: 'Hamlet_Sack', local: at(-0.27, 0, 0.05).multiply(new THREE.Matrix4().makeRotationY(0.5)) },
        { node: 'Hamlet_Sack', local: at(0.27, 0, -0.04).multiply(new THREE.Matrix4().makeRotationY(-0.4)) },
        { node: 'Hamlet_Sack', local: at(0, 0.34, 0).multiply(new THREE.Matrix4().makeRotationY(1.3)) },
      ]
    case 'stumpWithAxe':
      // Stand-in stump is added separately (STUMP_*); the axe leans on its cut face.
      return [
        { node: STUMP_NODE, local: new THREE.Matrix4() },
        { node: 'Hamlet_Axe', local: at(0.05, STUMP_HEIGHT_M, 0).multiply(_lean.makeRotationZ(0.25)) },
      ]
    default: {
      const spec = (WALL_KITS as Record<string, { mountY: number, outZ: number }>)[kit]
      return [{ node: KIT_NODE[kit][0]!, local: spec ? at(0, spec.mountY, spec.outZ) : new THREE.Matrix4() }]
    }
  }
}

const STUMP_HEIGHT_M = 0.45
const STUMP_RADIUS_M = 0.32
const STUMP_SEGMENTS = 8
const STUMP_COLOR = new THREE.Color(0x6b4f35)
const STUMP_NODE = '__stump'

/** Stand-in stump (the V3 stump is procedural too) as a vertex-colour part, so it merges into the pack's plain draw. */
function stumpPart(material: THREE.Material): PiecePart {
  const g = new THREE.CylinderGeometry(STUMP_RADIUS_M * 0.85, STUMP_RADIUS_M, STUMP_HEIGHT_M, STUMP_SEGMENTS).translate(0, STUMP_HEIGHT_M / 2, 0)
  const n = g.attributes.position!.count
  const color = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) { color[i * 3] = STUMP_COLOR.r; color[i * 3 + 1] = STUMP_COLOR.g; color[i * 3 + 2] = STUMP_COLOR.b }
  return { position: dense(g.attributes.position!, 3), normal: dense(g.attributes.normal!, 3), uv: dense(g.attributes.uv!, 2), color, index: Uint32Array.from(g.index!.array), material }
}

function pose(p: DressingPlacement, houseOrigin: (p: WallDressingPlacement) => { x: number, z: number, yaw: number }): { x: number, y: number, z: number, yaw: number } {
  if (p.kind === 'slot') return { x: p.x, y: 0, z: p.z, yaw: p.yaw }
  const o = houseOrigin(p)
  const w = houseLocalToWorld(o.x, o.z, o.yaw, p.x, p.z)
  const sideYaw = p.side === 'front' ? 0 : p.side === 'left' ? Math.PI / 2 : p.side === 'right' ? -Math.PI / 2 : Math.PI
  return { x: w.x, y: 0, z: w.z, yaw: o.yaw + sideYaw }
}

export type DressingHouse = { x: number, z: number, yaw: number }

/**
 * Builds the merged meshes (one per material, `name: 'profession-dressing'`). `houseOf(familyIndex)` returns the
 * house origin/yaw the wall placements are local to; `sampleHeight` grounds each piece (wall pieces keep their
 * mount height above the ground at the house). Returns `[]` when there is nothing to draw.
 */
export function buildProfessionDressingMeshes(
  pack: ProfessionDressingPack,
  placements: readonly { familyIndex: number, placement: DressingPlacement }[],
  houseOf: (familyIndex: number) => DressingHouse | undefined,
  sampleHeight: (x: number, z: number) => number,
): THREE.Mesh[] {
  type Acc = { material: THREE.Material, parts: { part: PiecePart, matrix: THREE.Matrix4 }[] }
  const byMaterial = new Map<THREE.Material, Acc>()
  for (const { familyIndex, placement } of placements) {
    const house = houseOf(familyIndex)
    if (!house && placement.kind === 'wall') continue
    const p = pose(placement, () => house!)
    const ground = sampleHeight(p.x, p.z)
    const base = new THREE.Matrix4().makeTranslation(p.x, ground, p.z).multiply(new THREE.Matrix4().makeRotationY(p.yaw))
    for (const item of kitItems(placement.kit)) {
      const parts = pack.nodes.get(item.node)
      if (!parts) continue
      const matrix = new THREE.Matrix4().multiplyMatrices(base, item.local)
      for (const part of parts) {
        let acc = byMaterial.get(part.material)
        if (!acc) byMaterial.set(part.material, acc = { material: part.material, parts: [] })
        acc.parts.push({ part, matrix })
      }
    }
  }
  const meshes: THREE.Mesh[] = []
  const v = new THREE.Vector3()
  for (const acc of byMaterial.values()) {
    let vertexCount = 0
    let indexCount = 0
    for (const { part } of acc.parts) { vertexCount += part.position.length / 3; indexCount += part.index.length }
    const useColor = (acc.material as THREE.MeshStandardMaterial).vertexColors === true
    const position = new Float32Array(vertexCount * 3)
    const normal = new Float32Array(vertexCount * 3)
    const uv = new Float32Array(vertexCount * 2)
    const color = useColor ? new Float32Array(vertexCount * 3).fill(1) : null
    const index = vertexCount > 65535 ? new Uint32Array(indexCount) : new Uint16Array(indexCount)
    let vOff = 0
    let iOff = 0
    for (const { part, matrix } of acc.parts) {
      const nm = new THREE.Matrix3().getNormalMatrix(matrix)
      const n = part.position.length / 3
      for (let i = 0; i < n; i++) {
        const o = (vOff + i) * 3
        v.set(part.position[i * 3]!, part.position[i * 3 + 1]!, part.position[i * 3 + 2]!).applyMatrix4(matrix)
        position[o] = v.x; position[o + 1] = v.y; position[o + 2] = v.z
        v.set(part.normal[i * 3]!, part.normal[i * 3 + 1]!, part.normal[i * 3 + 2]!).applyNormalMatrix(nm).normalize()
        normal[o] = v.x; normal[o + 1] = v.y; normal[o + 2] = v.z
        if (part.uv) { uv[(vOff + i) * 2] = part.uv[i * 2]!; uv[(vOff + i) * 2 + 1] = part.uv[i * 2 + 1]! }
        if (color && part.color) { color[o] = part.color[i * 3]!; color[o + 1] = part.color[i * 3 + 1]!; color[o + 2] = part.color[i * 3 + 2]! }
      }
      for (let i = 0; i < part.index.length; i++) index[iOff + i] = part.index[i]! + vOff
      vOff += n
      iOff += part.index.length
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geometry.setAttribute('normal', new THREE.BufferAttribute(normal, 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    if (color) geometry.setAttribute('color', new THREE.BufferAttribute(color, 3))
    geometry.setIndex(new THREE.BufferAttribute(index, 1))
    geometry.computeBoundingSphere()
    const mesh = new THREE.Mesh(geometry, acc.material)
    mesh.name = 'profession-dressing'
    mesh.castShadow = true
    mesh.receiveShadow = true
    meshes.push(mesh)
  }
  return meshes
}

/** OBB collider per freestanding slot piece (wall pieces have none). */
export function professionDressingColliders(placements: readonly DressingPlacement[]): Collider[] {
  return placements
    .filter((p): p is SlotDressingPlacement => p.kind === 'slot')
    .map((p) => ({
      type: 'obb' as const,
      x: p.x,
      z: p.z,
      halfWidth: SLOT_KITS[p.kit].halfU,
      halfDepth: SLOT_KITS[p.kit].halfV,
      rotationY: 0 - p.yaw,
    }))
}

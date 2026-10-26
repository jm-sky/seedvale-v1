/**
 * Head extraction transforms for Quaternius Superhero FullBody → `*_Head.glb`.
 * Issue #20: Y-only neck cut left arm-weighted shoulder/arm skin; dropArmWeightedTris removes it.
 */
/** Neck-line Y (glTF up) matching historical Male_Head / Female_Head cuts. */
export const NECK_Y = { Male: 1.5, Female: 1.44 }

/** Joint names treated as arm-chain for SuperHero residual skin (Issue #20 inventory). */
const ARM_JOINT_RE = /^(clavicle_|upperarm_|lowerarm_|hand_|thumb_|index_|middle_|ring_|pinky_)/i

/**
 * Keep only Superhero-material triangles whose every vertex has Y > minY (coarse neck cut).
 * @param {number} minY
 */
export function headOnly(minY) {
  return (doc) => {
    for (const mesh of doc.getRoot().listMeshes()) {
      for (const prim of mesh.listPrimitives()) {
        const mat = prim.getMaterial()?.getName() ?? ''
        if (!/Superhero/i.test(mat)) continue
        const pos = prim.getAttribute('POSITION')
        const ind = prim.getIndices()
        if (!pos || !ind) continue
        const a = ind.getArray()
        const out = []
        const p = [0, 0, 0]
        for (let i = 0; i < a.length; i += 3) {
          const ok = [a[i], a[i + 1], a[i + 2]].every((v) => {
            pos.getElement(v, p)
            return p[1] > minY
          })
          if (ok) out.push(a[i], a[i + 1], a[i + 2])
        }
        ind.setArray(new Uint32Array(out))
      }
    }
  }
}

function skinForMesh(doc, mesh) {
  for (const node of doc.getRoot().listNodes()) {
    if (node.getMesh() === mesh) {
      const skin = node.getSkin()
      if (skin) return skin
    }
  }
  return null
}

/**
 * Drop Superhero-material triangles dominated by arm-chain skin weights.
 * A vert is arm-dominant when its largest WEIGHTS_0 influence is on clavicle/arm/hand (or finger) joints.
 * A triangle is dropped when any of its verts is arm-dominant. Keeps Head / neck_01 / spine face+neck.
 * (A ≥2 threshold left a fringe of single arm-dominant verts still indexed; ≥1 removes that residual.)
 */
export function dropArmWeightedTris() {
  return (doc) => {
    for (const mesh of doc.getRoot().listMeshes()) {
      const skin = skinForMesh(doc, mesh)
      if (!skin) continue
      const jointNames = skin.listJoints().map((j) => j.getName())
      for (const prim of mesh.listPrimitives()) {
        const mat = prim.getMaterial()?.getName() ?? ''
        if (!/Superhero/i.test(mat)) continue
        const ind = prim.getIndices()
        const joints = prim.getAttribute('JOINTS_0')
        const weights = prim.getAttribute('WEIGHTS_0')
        if (!ind || !joints || !weights) continue
        const a = ind.getArray()
        const jBuf = [0, 0, 0, 0]
        const wBuf = [0, 0, 0, 0]
        const armDominant = (vi) => {
          joints.getElement(vi, jBuf)
          weights.getElement(vi, wBuf)
          let bestW = -1
          let bestName = ''
          for (let k = 0; k < 4; k++) {
            if (wBuf[k] > bestW) {
              bestW = wBuf[k]
              bestName = jointNames[jBuf[k]] ?? ''
            }
          }
          return ARM_JOINT_RE.test(bestName)
        }
        const out = []
        for (let i = 0; i < a.length; i += 3) {
          const v0 = a[i]
          const v1 = a[i + 1]
          const v2 = a[i + 2]
          if (armDominant(v0) || armDominant(v1) || armDominant(v2)) continue
          out.push(v0, v1, v2)
        }
        ind.setArray(new Uint32Array(out))
      }
    }
  }
}

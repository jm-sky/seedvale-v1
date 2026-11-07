/**
 * Cave meshes (WORLD-05): floor, walls and ceiling built from the derived cave grid when the player comes
 * within range, released again when they leave. Rock textures are Poly Haven CC0 diffuse maps (world-space
 * UVs, no UV unwrapping needed). The terrain mesh is cut out over the cutting by `TerrainChunks`; the wall
 * strips here reach up to the ground so the cut has a rock face instead of a void.
 * @domain render
 * @subdomain caves
 */
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { Sim } from '../sim/sim'
import type { QualityProfile } from './quality'
import { CAVE } from '../config/calibration'
import { perf } from '../diag/perf'
import { planMouthRocks } from '../world/caveRocks'
import { buildMouthPatch, type CaveGrid, CELL_CLOSED, CELL_SKY, CELL_UNDER } from '../world/caveShape'
import { NATURE_MODEL } from './assetNames'
import { loadGltf, mergeTemplate } from './assets'
import { caveDayUniform, caveSunUniform, createCaveMaterial } from './caveMaterial'

/** Inside a cave the outside counts as visible within this distance of an opening, line of sight or not (the camera boom and a bend must not flicker). */
export const MOUTH_VISIBLE_M = 6
/** Beyond that, an opening counts only when a straight line over open cells reaches it, up to this far (review 027 #11: the large cave's chamber was 12 m from a mouth round a bend). */
export const MOUTH_SIGHT_M = 70
const SIGHT_STEP_M = 0.5

/** Half-angle (cosine) of the camera cone an opening must lie in to count as seen from afar: wider than the field of view, so a quick turn cannot show a hole. */
const SIGHT_CONE_COS = Math.cos((80 * Math.PI) / 180)

/**
 * Is the outside plausibly in view: a sky cell near the player, or one in front of the camera (facing `fx, fz`,
 * a unit vector; omit to look every way) that a straight open line reaches from the player or the camera?
 */
export function skyInReach(g: CaveGrid, sky: readonly (readonly [number, number])[], x: number, z: number, camX = x, camZ = z, fx = 0, fz = 0): boolean {
  const near = MOUTH_VISIBLE_M * MOUTH_VISIBLE_M
  const far = MOUTH_SIGHT_M * MOUTH_SIGHT_M
  const facing = fx !== 0 || fz !== 0
  for (const [sx, sz] of sky) {
    const d2 = (sx - x) ** 2 + (sz - z) ** 2
    if (d2 <= near) return true
    if (d2 > far) continue
    if (facing) {
      const cd = Math.hypot(sx - camX, sz - camZ)
      if (cd > 1e-3 && ((sx - camX) * fx + (sz - camZ) * fz) / cd < SIGHT_CONE_COS) continue
    }
    if (openLine(g, x, z, sx, sz) || openLine(g, camX, camZ, sx, sz)) return true
  }
  return false
}

/** Is there a straight line over open (non-closed) cells from (x, z) to (tx, tz)? */
export function openLine(g: CaveGrid, x: number, z: number, tx: number, tz: number): boolean {
  const d = Math.hypot(tx - x, tz - z)
  const n = Math.ceil(d / SIGHT_STEP_M)
  for (let k = 1; k < n; k++) {
    const t = k / n
    if (g.flagAt(x + (tx - x) * t, z + (tz - z) * t) === CELL_CLOSED) return false
  }
  return true
}
const HYSTERESIS_M = 60
const BUILD_PER_FRAME = 1
/** Texture repeat: one tile per this many metres. */
const TILE_M = 4

interface Built {
  group: THREE.Group
  geometries: THREE.BufferGeometry[]
  /** Instance matrices of the framing rocks per rock model (world--003 9.8). */
  rocks: THREE.Matrix4[][]
}

/** One shared instanced mesh per rock model part; capacity covers every built cave. */
interface RockSet {
  parts: { mesh: THREE.InstancedMesh; model: number }[]
}
const ROCK_CAP = 256

/** Per-vertex bakes of the cave material (9.6): AO, skylight, mouth blend, collar fade weight (D-LOOK-1) and the terrain colour it fades to. */
interface CaveBake {
  ao: number
  sky: number
  mouth: number
  collar: number
  /** 1 on vertices of the entrance region (walls there are terrain rock, not cave texture). */
  open: number
  ground: THREE.Color
}

/** Colour of the terrain mesh at a point (render supplies `TerrainChunks.groundColourAt`); default is the surface rock colour. */
export type GroundColourFn = (x: number, z: number, out: THREE.Color) => void

/** Faces within this cosine (about 70 degrees) of a triangle's own normal are smoothed into it. */
const SMOOTH_COS = 0.34

class Buf {
  pos: number[] = []
  uv: number[] = []
  col: number[] = []
  /** Quad from four corners (counter-clockwise), flat colour `c`, UVs from the supplied function; zero-area halves are dropped. */
  quad(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3, uvOf: (p: THREE.Vector3) => [number, number], shade: number) {
    for (const t of [[a, b, c], [a, c, d]] as const) {
      const [p, q, r] = t
      const cx = (q.y - p.y) * (r.z - p.z) - (q.z - p.z) * (r.y - p.y)
      const cy = (q.z - p.z) * (r.x - p.x) - (q.x - p.x) * (r.z - p.z)
      const cz = (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)
      if (cx * cx + cy * cy + cz * cz < 1e-10) continue
      for (const v of t) {
        this.pos.push(v.x, v.y, v.z)
        const [u, w] = uvOf(v)
        this.uv.push(u, w)
        this.col.push(shade, shade, shade)
      }
    }
  }

  /**
   * Area-weighted vertex normals shared by every triangle that meets at a position (world--003 9.5): the quad soup
   * stays non-indexed (UVs differ per face) but the lighting is smooth; floor and shell are separate buffers, so
   * the floor-to-wall crease stays. A face only joins the average of a vertex when it lies within `SMOOTH_COS` of that
   * triangle's own normal (faces are wound inconsistently, so each is flipped to the triangle's side first): a wall that
   * meets the entrance patch at a right angle keeps its own normal instead of a diagonal one that lit it black (review 027 #10).
   */
  private smoothNormals(): number[] {
    const key = (i: number) => `${Math.round(this.pos[i * 3]! * 1000)},${Math.round(this.pos[i * 3 + 1]! * 1000)},${Math.round(this.pos[i * 3 + 2]! * 1000)}`
    const n = this.pos.length / 3
    const face: [number, number, number][] = []
    for (let t = 0; t < n; t += 3) {
      const [a, b, c] = [t * 3, (t + 1) * 3, (t + 2) * 3]
      const ux = this.pos[b]! - this.pos[a]!
      const uy = this.pos[b + 1]! - this.pos[a + 1]!
      const uz = this.pos[b + 2]! - this.pos[a + 2]!
      const vx = this.pos[c]! - this.pos[a]!
      const vy = this.pos[c + 1]! - this.pos[a + 1]!
      const vz = this.pos[c + 2]! - this.pos[a + 2]!
      face.push([uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx])
    }
    const at = new Map<string, number[]>()
    for (let i = 0; i < n; i++) {
      const k = key(i)
      const l = at.get(k)
      if (l) l.push(Math.floor(i / 3))
      else at.set(k, [Math.floor(i / 3)])
    }
    const out: number[] = []
    for (let i = 0; i < n; i++) {
      const own = face[Math.floor(i / 3)]!
      const ol = Math.hypot(own[0], own[1], own[2]) || 1
      let sx = 0
      let sy = 0
      let sz = 0
      for (const f of at.get(key(i))!) {
        const fn = face[f]!
        const d = (fn[0] * own[0] + fn[1] * own[1] + fn[2] * own[2]) / (ol * (Math.hypot(fn[0], fn[1], fn[2]) || 1))
        if (Math.abs(d) < SMOOTH_COS) continue
        const sg = d < 0 ? -1 : 1
        sx += fn[0] * sg
        sy += fn[1] * sg
        sz += fn[2] * sg
      }
      const l = Math.hypot(sx, sy, sz)
      if (l < 1e-9) out.push(own[0] / ol, own[1] / ol, own[2] / ol)
      else out.push(sx / l, sy / l, sz / l)
    }
    // Double-sided materials flip the normal on back faces, which only lights correctly when each triangle's winding
    // agrees with its vertex normals: swap two vertices where it does not.
    for (let t = 0; t < n; t += 3) {
      const a = t * 3
      const fx = (this.pos[a + 4]! - this.pos[a + 1]!) * (this.pos[a + 8]! - this.pos[a + 2]!) - (this.pos[a + 5]! - this.pos[a + 2]!) * (this.pos[a + 7]! - this.pos[a + 1]!)
      const fy = (this.pos[a + 5]! - this.pos[a + 2]!) * (this.pos[a + 6]! - this.pos[a]!) - (this.pos[a + 3]! - this.pos[a]!) * (this.pos[a + 8]! - this.pos[a + 2]!)
      const fz = (this.pos[a + 3]! - this.pos[a]!) * (this.pos[a + 7]! - this.pos[a + 1]!) - (this.pos[a + 4]! - this.pos[a + 1]!) * (this.pos[a + 6]! - this.pos[a]!)
      if (fx * out[a]! + fy * out[a + 1]! + fz * out[a + 2]! >= 0) continue
      for (const arr of [this.pos, out, this.col]) for (let k = 0; k < 3; k++) [arr[a + 3 + k], arr[a + 6 + k]] = [arr[a + 6 + k]!, arr[a + 3 + k]!]
      const u = t * 2
      for (let k = 0; k < 2; k++) [this.uv[u + 2 + k], this.uv[u + 4 + k]] = [this.uv[u + 4 + k]!, this.uv[u + 2 + k]!]
    }
    return out
  }

  /** Triangle from three corners (UVs from the supplied function); zero-area triangles are dropped. */
  tri(p: THREE.Vector3, q: THREE.Vector3, r: THREE.Vector3, uvOf: (p: THREE.Vector3) => [number, number], shade: number) {
    const cx = (q.y - p.y) * (r.z - p.z) - (q.z - p.z) * (r.y - p.y)
    const cy = (q.z - p.z) * (r.x - p.x) - (q.x - p.x) * (r.z - p.z)
    const cz = (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x)
    if (cx * cx + cy * cy + cz * cz < 1e-10) return
    for (const v of [p, q, r]) {
      this.pos.push(v.x, v.y, v.z)
      const [u, w] = uvOf(v)
      this.uv.push(u, w)
      this.col.push(shade, shade, shade)
    }
  }

  geometry(displace?: (x: number, y: number, z: number) => [number, number, number], bake?: (x: number, y: number, z: number) => CaveBake): THREE.BufferGeometry | null {
    if (!this.pos.length) return null
    if (displace) {
      for (let i = 0; i < this.pos.length; i += 3) {
        const [dx, dy, dz] = displace(this.pos[i]!, this.pos[i + 1]!, this.pos[i + 2]!)
        this.pos[i]! += dx
        this.pos[i + 1]! += dy
        this.pos[i + 2]! += dz
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2))
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3))
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.smoothNormals(), 3))
    if (bake) {
      const cave: number[] = []
      const ground: number[] = []
      const open: number[] = []
      for (let i = 0; i < this.pos.length; i += 3) {
        const b = bake(this.pos[i]!, this.pos[i + 1]!, this.pos[i + 2]!)
        cave.push(b.ao, b.sky, b.mouth, b.collar)
        ground.push(b.ground.r, b.ground.g, b.ground.b)
        open.push(b.open)
      }
      g.setAttribute('cave', new THREE.Float32BufferAttribute(cave, 4))
      g.setAttribute('caveCol', new THREE.Float32BufferAttribute(ground, 3))
      g.setAttribute('caveOpen', new THREE.Float32BufferAttribute(open, 1))
    }
    g.computeBoundingSphere()
    return g
  }
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

/**
 * Builds the floor and shell (walls + ceiling + lintels + entrance patch) geometries of one cave grid. The entrance
 * patch (world--003 9.4, `buildMouthPatch`) fills the hole the terrain mesh has over the cutting and its collar: one
 * heightfield from the cutting floor up to the terrain, so the mouth is a closed bank instead of leaning slivers.
 * Exported for tests.
 */
export function buildCaveGeometry(g: CaveGrid, surfaceAt: (x: number, z: number) => number, _seed: number, groundColour?: GroundColourFn): { floor: THREE.BufferGeometry | null; shell: THREE.BufferGeometry | null } {
  const floor = new Buf()
  const shell = new Buf()
  const w = g.nx + 1
  const fy = (vi: number, vj: number) => g.floor[vj * w + vi]!
  const cy = (vi: number, vj: number) => g.ceil[vj * w + vi]!
  const patch = buildMouthPatch(g, surfaceAt)
  const ph = (vi: number, vj: number) => patch[vj * w + vi]!
  const k = 1 / TILE_M
  const uvFloor = (p: THREE.Vector3): [number, number] => [p.x * k, p.z * k]
  /** Steep patch faces: project along both horizontal axes and height so the texture is not stretched. */
  const uvBank = (p: THREE.Vector3): [number, number] => [(p.x + p.y) * k, (p.z + p.y) * k]
  // One shade for all cells: the old per-cell hash made vertical stripes (review 022 C1); the textures carry the variation.
  const shade = 0.92
  const flagAt = (i: number, j: number) => (i < 0 || j < 0 || i >= g.nx || j >= g.nz ? CELL_CLOSED : g.flag[j * g.nx + i]!)
  const touchesUnder = (vi: number, vj: number) => [[-1, -1], [0, -1], [-1, 0], [0, 0]].some(([di, dj]) => flagAt(vi + di!, vj + dj!) === CELL_UNDER)
  const ROWS = [0, 0.4, 0.75, 1]
  /** Directions of the lintel runs (roofed cell next to a cutting) through each vertex: the overhang leans only where there is one. */
  const lintelDirs = new Map<number, Set<number>>()
  for (let j = 0; j < g.nz; j++) {
    for (let i = 0; i < g.nx; i++) {
      if (flagAt(i, j) !== CELL_UNDER) continue
      for (const [di, dj, a, b, c, d] of [[0, -1, 0, 0, 1, 0], [0, 1, 0, 1, 1, 1], [-1, 0, 0, 0, 0, 1], [1, 0, 1, 0, 1, 1]] as const) {
        if (flagAt(i + di, j + dj) !== CELL_SKY) continue
        for (const key of [(j + b) * w + i + a, (j + d) * w + i + c]) {
          const set = lintelDirs.get(key) ?? new Set<number>()
          set.add((di + 1) * 3 + dj + 1)
          lintelDirs.set(key, set)
        }
      }
    }
  }
  const touchesClosed = (vi: number, vj: number) => [[-1, -1], [0, -1], [-1, 0], [0, 0]].some(([di, dj]) => flagAt(vi + di!, vj + dj!) === CELL_CLOSED)
  /** A vertex column gets the three-band profile when no cell around it is a cutting or part of the entrance region. */
  const profiled = (vi: number, vj: number) => [[-1, -1], [0, -1], [-1, 0], [0, 0]].every(([di, dj]) => flagAt(vi + di!, vj + dj!) !== CELL_SKY && !inR(vi + di!, vj + dj!))
  const inR = (i: number, j: number) => i >= 0 && j >= 0 && i < g.nx && j < g.nz && g.cut[j * g.nx + i] === 1
  // Edge walls: neighbour direction → the two vertices (in cell-vertex coordinates) of the shared edge; DoubleSide +
  // computed normals make the exact winding irrelevant to lighting.
  const edges: [number, number, number, number, number, number][] = [
    // di, dj, v0i, v0j, v1i, v1j (vertex offsets from the cell origin)
    [0, -1, 0, 0, 1, 0],
    [0, 1, 0, 1, 1, 1],
    [-1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1],
  ]
  for (let j = 0; j < g.nz; j++) {
    for (let i = 0; i < g.nx; i++) {
      const f: number = flagAt(i, j)
      const x0 = g.ox + i
      const z0 = g.oz + j
      if (f === CELL_CLOSED) {
        // Rock inside the entrance region: the patch surface (cells outside R keep the terrain mesh).
        if (inR(i, j)) shell.quad(V(x0, ph(i, j), z0), V(x0, ph(i, j + 1), z0 + 1), V(x0 + 1, ph(i + 1, j + 1), z0 + 1), V(x0 + 1, ph(i + 1, j), z0), uvBank, shade * 0.85)
        continue
      }
      floor.quad(V(x0, fy(i, j), z0), V(x0, fy(i, j + 1), z0 + 1), V(x0 + 1, fy(i + 1, j + 1), z0 + 1), V(x0 + 1, fy(i + 1, j), z0), uvFloor, shade)
      if (f === CELL_UNDER) {
        shell.quad(V(x0, cy(i, j), z0), V(x0 + 1, cy(i + 1, j), z0), V(x0 + 1, cy(i + 1, j + 1), z0 + 1), V(x0, cy(i, j + 1), z0 + 1), uvFloor, shade * 0.9)
        // Roof of the entrance region over a roofed cell: the patch surface above the ceiling.
        if (inR(i, j)) shell.quad(V(x0, ph(i, j), z0), V(x0 + 1, ph(i + 1, j), z0), V(x0 + 1, ph(i + 1, j + 1), z0 + 1), V(x0, ph(i, j + 1), z0 + 1), uvBank, shade * 0.85)
      }
      for (const [di, dj, a, b, c, d] of edges) {
        const nf: number = flagAt(i + di, j + dj)
        // Walls where rock meets the cell; a lintel (rock face above the opening) where a roofed cell meets a cutting.
        if (nf !== CELL_CLOSED && !(f === CELL_UNDER && nf === CELL_SKY)) continue
        const ax = x0 + a
        const az = z0 + b
        const bx = x0 + c
        const bz = z0 + d
        let ya: number
        let yb: number
        let ta: number
        let tb: number
        if (f === CELL_UNDER && nf === CELL_CLOSED) {
          // Tunnel wall: floor to ceiling.
          ya = fy(i + a, j + b)
          yb = fy(i + c, j + d)
          ta = cy(i + a, j + b)
          tb = cy(i + c, j + d)
        } else if (f === CELL_UNDER) {
          // Lintel over the opening: from the ceiling up to the patch.
          ya = cy(i + a, j + b)
          yb = cy(i + c, j + d)
          ta = ph(i + a, j + b)
          tb = ph(i + c, j + d)
        } else {
          // Cutting wall against rock outside R: floor up to the terrain at the region border.
          ya = fy(i + a, j + b)
          yb = fy(i + c, j + d)
          ta = ph(i + a, j + b)
          tb = ph(i + c, j + d)
        }
        const along = (p: THREE.Vector3): [number, number] => [(di === 0 ? p.x : p.z) * k, p.y * k]
        if ((ta > ya || tb > yb) && f === CELL_UNDER && nf === CELL_CLOSED) {
          // Tunnel wall: a column of vertices at each end, three bands (foot, belly, top) where the column is away from the mouth so
          // the 9.5 profile has vertices to move; columns of different density are stitched without T-junctions.
          const col = (vi: number, vj: number, lo: number, hi: number) => (profiled(vi, vj) ? ROWS.map((r) => lo + (hi - lo) * r) : [lo, hi])
          const left = col(i + a, j + b, ya, ta)
          const right = col(i + c, j + d, yb, tb)
          let li = 0
          let ri = 0
          while (li < left.length - 1 || ri < right.length - 1) {
            const tl = li < left.length - 1 ? (li + 1) / (left.length - 1) : 2
            const tr = ri < right.length - 1 ? (ri + 1) / (right.length - 1) : 2
            if (tl <= tr) {
              shell.tri(V(ax, left[li]!, az), V(bx, right[ri]!, bz), V(ax, left[li + 1]!, az), along, shade * 0.85)
              li++
            } else {
              shell.tri(V(ax, left[li]!, az), V(bx, right[ri]!, bz), V(bx, right[ri + 1]!, bz), along, shade * 0.85)
              ri++
            }
          }
        } else if (f === CELL_UNDER && (ta - ya > 0.1 || tb - yb > 0.1)) {
          // Lintel overhang (D-CAVE-4): a mid row leans out over the cutting (up to ~0.6 m, noise), so the opening is a rounded brow instead
          // of a flat block face. Only vertices on a straight lintel run move (corners and wall joints stay welded; the T-joint at a
          // wall end is collinear).
          const lean = (vx: number, vz: number, lo: number, hi: number) => {
            const vi = vx - g.ox
            const vj = vz - g.oz
            const dirs = lintelDirs.get(vj * w + vi)
            if (!dirs || dirs.size !== 1 || touchesClosed(vi, vj)) return 0
            return Math.min(0.7, (hi - lo) * 2) * (0.6 + 0.4 * Math.sin(vx * 1.7 + vz * 1.3))
          }
          const pa = lean(ax, az, ya, ta)
          const pb = lean(bx, bz, yb, tb)
          const ma = ya + (ta - ya) * 0.45
          const mb = yb + (tb - yb) * 0.45
          const A = V(ax, ya, az)
          const B = V(bx, yb, bz)
          const MA = V(ax + di * pa, ma, az + dj * pa)
          const MB = V(bx + di * pb, mb, bz + dj * pb)
          shell.quad(A, B, MB, MA, along, shade * 0.85)
          shell.quad(MA, MB, V(bx, tb, bz), V(ax, ta, az), along, shade * 0.85)
        } else if (ta > ya || tb > yb) {
          // A vertex that touches a roofed cell carries the ceiling height: the wall is split there so the faces around it share vertices.
          const ma = f === CELL_SKY && touchesUnder(i + a, j + b) ? Math.min(Math.max(cy(i + a, j + b), ya), ta) : ya
          const mb = f === CELL_SKY && touchesUnder(i + c, j + d) ? Math.min(Math.max(cy(i + c, j + d), yb), tb) : yb
          // A second split at the lintel's mid height (same fraction as the overhang row) keeps the lintel end welded.
          const na = ma !== ya ? ma + (ta - ma) * 0.45 : ma
          const nb = mb !== yb ? mb + (tb - mb) * 0.45 : mb
          shell.quad(V(ax, ya, az), V(bx, yb, bz), V(bx, mb, bz), V(ax, ma, az), along, shade * 0.85)
          shell.quad(V(ax, ma, az), V(bx, mb, bz), V(bx, nb, bz), V(ax, na, az), along, shade * 0.85)
          shell.quad(V(ax, na, az), V(bx, nb, bz), V(bx, tb, bz), V(ax, ta, az), along, shade * 0.85)
        }
      }
    }
  }
  // World--003 9.5 wall profile: tunnel walls bulge into the rock (zero at the floor foot, the ceiling and anywhere near the
  // entrance patch, so every shared edge stays welded) with a smooth two-wave variation; collision keeps the 1 m grid and
  // the open space never shrinks because vertices only move away from the open cells.
  const bulge = (x: number, y: number, z: number): [number, number, number] => {
    const vi = Math.round(x - g.ox)
    const vj = Math.round(z - g.oz)
    if (Math.abs(x - g.ox - vi) > 1e-4 || Math.abs(z - g.oz - vj) > 1e-4) return [0, 0, 0]
    let ox = 0
    let oz = 0
    let under = 0
    for (const [di, dj] of [[-1, -1], [0, -1], [-1, 0], [0, 0]] as const) {
      const f = flagAt(vi + di, vj + dj)
      if (f === CELL_SKY || inR(vi + di, vj + dj)) return [0, 0, 0]
      if (f === CELL_UNDER) {
        under++
        ox += vi + di + 0.5 - (vi)
        oz += vj + dj + 0.5 - (vj)
      }
    }
    // 9.5 ceiling dome: a ceiling vertex with open space all around (never shared with a wall top) rises, so the flat lid reads as a vault.
    if (under === 4) {
      if (Math.abs(y - cy(vi, vj)) > 1e-4) return [0, 0, 0]
      return [0, 0.3 + 0.1 * (Math.sin(x * 0.7 + z * 0.5) + Math.sin(z * 0.9 - x * 0.3)), 0]
    }
    const len = Math.hypot(ox, oz)
    if (len < 1e-6) return [0, 0, 0] // corners shared by diagonal open cells stay put
    const lo = fy(vi, vj)
    const hi = cy(vi, vj)
    if (hi - lo < 0.5 || y < lo + 1e-4 || y > hi - 1e-4) return [0, 0, 0]
    const t = (y - lo) / (hi - lo)
    // Two slow waves plus a finer pair (9.5 finer displacement); a rock tip (three open cells around it) is cut deeper, which chamfers the staircase of diagonal tunnels.
    const fine = 0.05 * (Math.sin(x * 2.9 + y * 3.3 + z * 0.8) + Math.sin(z * 3.3 - y * 2.1 - x * 1.1))
    const chamfer = under === 3 ? 1.5 : 1
    const amp = Math.sin(Math.PI * t) * Math.max(0, 0.28 + 0.1 * (Math.sin(x * 0.9 + y * 1.3) + Math.sin(z * 1.1 - y * 0.7 + x * 0.4)) + fine) * chamfer
    return [(-ox / len) * amp, 0, (-oz / len) * amp]
  }
  // World--003 9.6 bakes per vertex (the `cave` attribute): AO, skylight and mouth blend (1 at the opening, 0 after 8 m).
  const dist = openDistance(g)
  const smooth01 = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)
  }
  const skyD = skyDistance(g)
  const rockColour = new THREE.Color(0x77736b)
  const groundCache = new Map<number, THREE.Color>()
  const groundAt = (vi: number, vj: number) => {
    const k = vj * w + vi
    let c = groundCache.get(k)
    if (!c) {
      c = new THREE.Color()
      if (groundColour) groundColour(g.ox + vi, g.oz + vj, c)
      else c.copy(rockColour)
      groundCache.set(k, c)
    }
    return c
  }
  const bake = (x: number, y: number, z: number): CaveBake => {
    const vi = Math.round(x - g.ox)
    const vj = Math.round(z - g.oz)
    let open = 0
    let d = Infinity
    let inRegion = false
    for (const [di, dj] of [[-1, -1], [0, -1], [-1, 0], [0, 0]] as const) {
      const ci = vi + di
      const cj = vj + dj
      if (flagAt(ci, cj) !== CELL_CLOSED) {
        open++
        d = Math.min(d, dist[cj * g.nx + ci]!)
      }
      if (inR(ci, cj)) inRegion = true
    }
    if (!Number.isFinite(d)) d = inRegion ? 0 : 20
    const closed = 1 - open / 4
    const lo = open ? fy(vi, vj) : y
    const corner = closed * (1 - smooth01(0, 1.8, y - lo))
    const ao = Math.max(0.45, 1 - 0.55 * corner - 0.15 * closed)
    // Collar fade (D-LOOK-1): 0 at the cutting, 1 from 2 m out, only on the entrance patch (cells of R).
    let collar = 0
    if (inRegion) {
      let sd = Infinity
      for (const [di, dj] of [[-1, -1], [0, -1], [-1, 0], [0, 0]] as const) {
        const ci = vi + di
        const cj = vj + dj
        if (ci >= 0 && cj >= 0 && ci < g.nx && cj < g.nz) sd = Math.min(sd, skyD[cj * g.nx + ci]!)
      }
      collar = Number.isFinite(sd) ? smooth01(0, 2, sd) : 1
    }
    return { ao, sky: Math.exp(-d / 6), mouth: 1 - smooth01(0, 8, d), collar, open: inRegion ? 1 : 0, ground: collar > 0 ? groundAt(vi, vj) : rockColour }
  }
  return { floor: floor.geometry(undefined, bake), shell: shell.geometry(bulge, bake) }
}

/** Distance in cells (8-neighbour chamfer, through rock too) from the nearest cutting cell; used for the collar colour fade. */
function skyDistance(g: CaveGrid): Float32Array {
  const d = new Float32Array(g.nx * g.nz).fill(Infinity)
  for (let k = 0; k < d.length; k++) if (g.flag[k] === CELL_SKY) d[k] = 0
  for (let pass = 0; pass < 8; pass++) {
    for (let j = 0; j < g.nz; j++) {
      for (let i = 0; i < g.nx; i++) {
        for (let dj = -1; dj <= 1; dj++) {
          for (let di = -1; di <= 1; di++) {
            const ni = i + di
            const nj = j + dj
            if ((!di && !dj) || ni < 0 || nj < 0 || ni >= g.nx || nj >= g.nz) continue
            d[j * g.nx + i] = Math.min(d[j * g.nx + i]!, d[nj * g.nx + ni]! + (di && dj ? 1.414 : 1))
          }
        }
      }
    }
  }
  return d
}

/** Walking distance (m, 8-neighbour) from the nearest cutting cell through open cells; `Infinity` for rock and unreachable cells. */
function openDistance(g: CaveGrid): Float32Array {
  const d = new Float32Array(g.nx * g.nz).fill(Infinity)
  for (let k = 0; k < d.length; k++) if (g.flag[k] === CELL_SKY) d[k] = 0
  for (let pass = 0; pass < 400; pass++) {
    let changed = false
    for (let j = 0; j < g.nz; j++) {
      for (let i = 0; i < g.nx; i++) {
        const k = j * g.nx + i
        if (g.flag[k] === CELL_CLOSED) continue
        for (let dj = -1; dj <= 1; dj++) {
          for (let di = -1; di <= 1; di++) {
            const ni = i + di
            const nj = j + dj
            if ((!di && !dj) || ni < 0 || nj < 0 || ni >= g.nx || nj >= g.nz) continue
            const nd = d[nj * g.nx + ni]! + (di && dj ? 1.414 : 1)
            if (nd < d[k]!) {
              d[k] = nd
              changed = true
            }
          }
        }
      }
    }
    if (!changed) break
  }
  return d
}

export class Caves {
  group = new THREE.Group()
  /** Mouth framing rocks (9.8) follow the `caveLook` A/B flag. */
  rocksOn = true
  /** Terrain colour source for the collar fade (set by the renderer). */
  groundColour?: GroundColourFn
  /** Smoothed in-cave factor 0..1: scales the sun by the baked skylight (9.7). */
  set sunK(k: number) {
    caveSunUniform.value = k
  }

  /** Daylight 0..1: the entrance region keeps its terrain albedo underground only by day (9.9). */
  set day(d: number) {
    caveDayUniform.value = d
  }
  private built = new Map<number, Built>()
  private sim: Sim
  private mat: THREE.MeshStandardMaterial | THREE.MeshLambertMaterial
  private profile: QualityProfile
  private tex: { floor: THREE.Texture | null; wall: THREE.Texture | null } = { floor: null, wall: null }
  private textures: THREE.Texture[] = []
  private rockSet: RockSet = { parts: [] }

  constructor(sim: Sim, profile: QualityProfile = 'medium') {
    this.sim = sim
    this.profile = profile
    this.mat = createCaveMaterial(profile, this.tex)
  }

  /** Switches the material class (Standard on medium/high, Lambert on low). */
  setProfile(profile: QualityProfile) {
    if ((profile === 'low') === (this.profile === 'low')) {
      this.profile = profile
      return
    }
    this.profile = profile
    const old = this.mat
    this.mat = createCaveMaterial(profile, this.tex)
    this.built.forEach((b) => b.group.children.forEach((c) => ((c as THREE.Mesh).material = this.mat)))
    old.dispose()
  }

  /** Loads the rock textures and the rock models; the caves still render (flat colour) if a texture is missing. */
  async load() {
    const base = `${import.meta.env.BASE_URL}images/textures/`
    const loader = new THREE.TextureLoader()
    const get = async (file: string) => {
      try {
        const t = await loader.loadAsync(base + file)
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = 4
        this.textures.push(t)
        return t
      } catch {
        return null
      }
    }
    const [floor, wall] = await Promise.all([get('cave_floor_diff_1k.jpg'), get('cave_wall_diff_1k.jpg')])
    this.tex.floor = floor
    this.tex.wall = wall
    const old = this.mat
    this.mat = createCaveMaterial(this.profile, this.tex)
    this.built.forEach((b) => b.group.children.forEach((c) => ((c as THREE.Mesh).material = this.mat)))
    old.dispose()
    await this.loadRocks()
  }

  /** Framing rocks reuse the surface boulder models (same colour); each model is normalised to unit height, base at y = 0. */
  private async loadRocks() {
    try {
      const g = await loadGltf('nature.glb')
      const box = new THREE.Box3()
      const models = NATURE_MODEL.rock!.models.map((name) => {
        const obj = g.scene.getObjectByName(name)
        return obj ? mergeTemplate([{ obj, matrix: new THREE.Matrix4() }]) : []
      })
      models.forEach((parts, model) => {
        if (!parts.length) return
        box.makeEmpty()
        for (const p of parts) {
          p.geometry.computeBoundingBox()
          box.union(p.geometry.boundingBox!)
        }
        const h = Math.max(box.max.y - box.min.y, 1e-3)
        const cx = (box.min.x + box.max.x) / 2
        const cz = (box.min.z + box.max.z) / 2
        for (const p of parts) {
          p.geometry.translate(-cx, -box.min.y, -cz)
          p.geometry.scale(1 / h, 1 / h, 1 / h)
          const mesh = new THREE.InstancedMesh(p.geometry, p.material, ROCK_CAP)
          mesh.count = 0
          mesh.frustumCulled = false
          mesh.castShadow = false
          this.group.add(mesh)
          this.rockSet.parts.push({ mesh, model })
        }
      })
      this.refreshRocks()
    } catch (e) {
      console.warn('nature.glb failed; no cave framing rocks', e)
    }
  }

  private refreshRocks() {
    for (const { mesh, model } of this.rockSet.parts) {
      let n = 0
      if (this.rocksOn) {
        for (const b of this.built.values()) {
          for (const m of b.rocks[model] ?? []) {
            if (n >= ROCK_CAP) break
            mesh.setMatrixAt(n++, m)
          }
        }
      }
      mesh.count = n
      mesh.instanceMatrix.needsUpdate = true
    }
  }

  private skySpots = new Map<number, [number, number][]>()

  private skyCellsOf(i: number, g: CaveGrid): [number, number][] {
    let list = this.skySpots.get(i)
    if (!list) {
      list = []
      for (let j = 0; j < g.nz; j++) for (let k = 0; k < g.nx; k++) if (g.flag[j * g.nx + k] === CELL_SKY) list.push([g.ox + k + 0.5, g.oz + j + 0.5])
      this.skySpots.set(i, list)
    }
    return list
  }

  /**
   * Can the outside world be seen from (x, z) underground? True in no cave grid, on a cutting cell, and within
   * `MOUTH_VISIBLE_M` of an opening; false deeper in. Deliberately conservative (nothing is hidden near a mouth).
   */
  outsideVisible(x: number, z: number, camX = x, camZ = z, fx = 0, fz = 0): boolean {
    const field = this.sim.terrain.caves
    const i = field.indexAt(x, z)
    if (i < 0) return true
    const g = field.grid(i)
    if (g.flagAt(x, z) === CELL_SKY) return true
    return skyInReach(g, this.skyCellsOf(i, g), x, z, camX, camZ, fx, fz)
  }

  get builtCount() {
    return this.built.size
  }

  update(px: number, pz: number) {
    const field = this.sim.terrain.caves
    if (!field.count) return
    let built = 0
    field.caves.forEach((c, i) => {
      const g = field.grid(i)
      const cx = g.ox + g.nx / 2
      const cz = g.oz + g.nz / 2
      const d = Math.hypot(cx - px, cz - pz) - Math.hypot(g.nx, g.nz) / 2
      const have = this.built.get(i)
      if (have) {
        if (d > CAVE.showM + HYSTERESIS_M) this.drop(i, have)
        return
      }
      if (d > CAVE.showM || built >= BUILD_PER_FRAME) return
      perf.measure('render.caveBuild', () => this.build(i, g, c.id))
      built++
    })
  }

  private build(i: number, g: CaveGrid, id: string) {
    const seed = id.length * 7919 + i
    const surf = (x: number, z: number) => this.sim.terrain.baseHeightAt(x, z)
    const { floor, shell } = buildCaveGeometry(g, surf, seed, this.groundColour)
    const group = new THREE.Group()
    const geometries: THREE.BufferGeometry[] = []
    // One draw per cave (9.6): floor and shell share a material, so they share a geometry.
    const parts = [floor, shell].filter((x): x is THREE.BufferGeometry => !!x)
    const geo = parts.length > 1 ? mergeGeometries(parts, false) : parts[0]
    parts.forEach((p) => p.dispose())
    if (geo) {
      geo.computeBoundingSphere()
      const m = new THREE.Mesh(geo, this.mat)
      m.matrixAutoUpdate = false
      geometries.push(geo)
      group.add(m)
    }
    const rocks: THREE.Matrix4[][] = [[], []]
    for (const r of planMouthRocks(g, surf, id)) {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(r.tiltX, r.yaw, r.tiltZ, 'YXZ'))
      // Width follows the height (unit-height model); buried share goes below the base point.
      rocks[r.model]!.push(new THREE.Matrix4().compose(new THREE.Vector3(r.x, r.y - r.buried * r.scale, r.z), q, new THREE.Vector3(r.scale, r.scale, r.scale)))
    }
    this.group.add(group)
    this.built.set(i, { group, geometries, rocks })
    this.refreshRocks()
  }

  private drop(i: number, b: Built) {
    this.group.remove(b.group)
    b.geometries.forEach((g) => g.dispose())
    this.built.delete(i)
    this.refreshRocks()
  }

  dispose() {
    this.skySpots.clear()
    this.built.forEach((b, i) => this.drop(i, b))
    this.mat.dispose()
    this.rockSet.parts.forEach((p) => p.mesh.dispose())
    this.rockSet.parts = []
    this.textures.forEach((t) => t.dispose())
  }
}

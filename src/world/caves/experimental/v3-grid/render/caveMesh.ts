/**
 * Isolated reference import from SeedVale V3 (V2-derived cave system).
 * Source: src/game/render/caveMesh.ts
 * Source revision: 47733d6ba0fe96d4607be22c470c7331c76c2c5c
 * Copied with local import paths only; algorithms unchanged.
 * Inactive: do not import from production code. See README.md.
 */
/**
 * Ported from SeedVales v2 render/caves.ts: the Buf quad soup with smooth normals, buildCaveGeometry (floor and shell
 * triangulation, lintels, tunnel-wall columns, the wall bulge and ceiling dome of world--003 9.5) and the entrance
 * patch from world/caveShape.ts. Dropped in S3: the `cave` bake attribute and cave material (AO, skylight, mouth blend,
 * collar fade), the ground-colour callback and the rock props. Plain vertex colours instead: floor 0x5a5148, shell 0x6b665e.
 * @domain render
 * @subdomain caves
 */
import * as THREE from 'three'
import { buildMouthPatch, type CaveGrid, CELL_CLOSED, CELL_SKY, CELL_UNDER, type SurfaceFn } from '../caveShape'

const FLOOR_BASE = new THREE.Color(0x5a5148)
const SHELL_BASE = new THREE.Color(0x6b665e)

const TILE_M = 4
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

  /**
   * Geometry of the collected triangles. Each vertex gets the buffer's `base` colour times its shade times
   * `tint(x, y, z, ny)` (default 1). Normals are computed after the displacement and read the final vertex order.
   */
  geometry(base: THREE.Color, displace?: (x: number, y: number, z: number) => [number, number, number], tint?: (x: number, y: number, z: number, ny: number) => number): THREE.BufferGeometry | null {
    if (!this.pos.length) return null
    if (displace) {
      for (let i = 0; i < this.pos.length; i += 3) {
        const [dx, dy, dz] = displace(this.pos[i]!, this.pos[i + 1]!, this.pos[i + 2]!)
        this.pos[i]! += dx
        this.pos[i + 1]! += dy
        this.pos[i + 2]! += dz
      }
    }
    const normal = this.smoothNormals()
    const color: number[] = []
    for (let i = 0; i < this.pos.length; i += 3) {
      const m = tint ? tint(this.pos[i]!, this.pos[i + 1]!, this.pos[i + 2]!, normal[i + 1]!) : 1
      const shade = this.col[i]!
      color.push(base.r * shade * m, base.g * shade * m, base.b * shade * m)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2))
    g.setAttribute('color', new THREE.Float32BufferAttribute(color, 3))
    g.setAttribute('normal', new THREE.Float32BufferAttribute(normal, 3))
    g.computeBoundingSphere()
    return g
  }
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

/**
 * Builds the floor and shell (walls + ceiling + lintels + entrance patch) geometries of one cave grid, from the derived
 * cave grid. The entrance patch (`buildMouthPatch`) fills the hole the terrain mesh has over the cutting and its collar.
 */
export function buildCaveGeometry(g: CaveGrid, surfaceAt: SurfaceFn): { floor: THREE.BufferGeometry | null; shell: THREE.BufferGeometry | null } {
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
  // Shell colour: 0.75 on a downward face, 1 on top; darker (down to x0.8) the deeper below the surface, to 8 m.
  const shellTint = (x: number, y: number, z: number, ny: number): number => {
    const depth = Math.min(1, Math.max(0, (surfaceAt(x, z) - y) / 8))
    return (0.75 + 0.25 * ny) * (1 - 0.2 * depth)
  }
  return { floor: floor.geometry(FLOOR_BASE), shell: shell.geometry(SHELL_BASE, bulge, shellTint) }
}

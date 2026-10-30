/** Plan world-terrain-019 Milestone B — production heightfield presentation
 *  buffers. Pure: no Three.js scene, no `ChunkManager`. Fixture topologies
 *  come from the debug harness fixtures (same `CaveTopology` contract). */

import { describe, expect, it } from 'vitest'
import {
  buildCaveHeightfieldFixture,
  CAVE_HEIGHTFIELD_FIXTURE_IDS,
  caveHeightfieldWalkSurfaceAt,
} from '../../debug/caves/caveHeightfieldFixtures'
import { buildCaveMouthProxyBuffers, buildHeightfieldMeshBuffers, buildMouthUndersideMaskBuffers } from './caveHeightfieldMesh'
import {
  buildCaveHeightfieldRepresentation,
  type CaveHeightfieldRepresentation,
  DEFAULT_HEIGHTFIELD_CONFIG,
  mouthOpeningAt,
  sampleHeightfieldAt,
} from './caveHeightfieldRepresentation'
import { openingDirection } from './caveOrientation'

const TEST_CONFIG = { ...DEFAULT_HEIGHTFIELD_CONFIG, cellSize: 0.5 }
const walk = caveHeightfieldWalkSurfaceAt

function build(id: (typeof CAVE_HEIGHTFIELD_FIXTURE_IDS)[number]): CaveHeightfieldRepresentation {
  return buildCaveHeightfieldRepresentation(buildCaveHeightfieldFixture(id), walk, TEST_CONFIG).heightfield
}

function arraysEqual(a: Float32Array, b: Float32Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

/** Signed +Y component of a triangle's `computeVertexNormals()` normal. */
function triangleUpSign(positions: Float32Array, indices: Uint32Array, t: number): number {
  const a = indices[t]! * 3
  const b = indices[t + 1]! * 3
  const c = indices[t + 2]! * 3
  // THREE.computeVertexNormals: n = (C - B) x (A - B)
  const u = [positions[c]! - positions[b]!, positions[c + 1]! - positions[b + 1]!, positions[c + 2]! - positions[b + 2]!]
  const v = [positions[a]! - positions[b]!, positions[a + 1]! - positions[b + 1]!, positions[a + 2]! - positions[b + 2]!]
  return u[2]! * v[0]! - u[0]! * v[2]!
}

function pointInTriangleXZ(
  positions: Float32Array,
  indices: Uint32Array,
  t: number,
  px: number,
  pz: number,
): boolean {
  const ax = positions[indices[t]! * 3]!
  const az = positions[indices[t]! * 3 + 2]!
  const bx = positions[indices[t + 1]! * 3]!
  const bz = positions[indices[t + 1]! * 3 + 2]!
  const cx = positions[indices[t + 2]! * 3]!
  const cz = positions[indices[t + 2]! * 3 + 2]!
  const d1 = (px - bx) * (az - bz) - (ax - bx) * (pz - bz)
  const d2 = (px - cx) * (bz - cz) - (bx - cx) * (pz - cz)
  const d3 = (px - ax) * (cz - az) - (cx - ax) * (pz - az)
  const hasNeg = d1 < -1e-9 || d2 < -1e-9 || d3 < -1e-9
  const hasPos = d1 > 1e-9 || d2 > 1e-9 || d3 > 1e-9
  return !(hasNeg && hasPos)
}

describe('cave heightfield mesh (production)', () => {
  it('produces a finite welded surface for every fixture', () => {
    for (const id of CAVE_HEIGHTFIELD_FIXTURE_IDS) {
      const field = build(id)
      const buffers = buildHeightfieldMeshBuffers(field)
      expect(buffers.vertices).toBeGreaterThan(0)
      expect(buffers.triangles).toBeGreaterThan(0)
      expect(buffers.rimVertexCount).toBeGreaterThan(20)
      expect(buffers.skyVertexCount).toBeGreaterThan(0)
      for (let i = 0; i < buffers.positions.length; i++) {
        expect(Number.isFinite(buffers.positions[i])).toBe(true)
      }
      expect(buffers.colors.length).toBe(buffers.positions.length)
      expect(buffers.geometryBytes).toBe(
        buffers.positions.byteLength + buffers.indices.byteLength + buffers.colors.byteLength,
      )
    }
  })

  it('is deterministic — identical field, identical typed arrays', () => {
    const field = build('bend')
    const a = buildHeightfieldMeshBuffers(field)
    const b = buildHeightfieldMeshBuffers(field)
    expect(arraysEqual(a.positions, b.positions)).toBe(true)
    expect(arraysEqual(a.colors, b.colors)).toBe(true)
    expect(Array.from(a.indices)).toEqual(Array.from(b.indices))
    expect(a.rimVertexCount).toBe(b.rimVertexCount)
    expect(a.skyVertexCount).toBe(b.skyVertexCount)
  })

  it('floor triangles face up and ceiling triangles face down', () => {
    const field = build('basic')
    const { positions, indices } = buildHeightfieldMeshBuffers(field)
    let up = 0
    let down = 0
    for (let t = 0; t < indices.length; t += 3) {
      const ny = triangleUpSign(positions, indices, t)
      if (ny > 1e-9) up++
      else if (ny < -1e-9) down++
    }
    // Both surfaces exist and neither is inverted — with FrontSide, an
    // inverted floor is an invisible floor.
    expect(up).toBeGreaterThan(100)
    expect(down).toBeGreaterThan(100)
  })

  it('shares vertices between neighbouring cells — no per-cell flat quads', () => {
    const field = build('basic')
    const buffers = buildHeightfieldMeshBuffers(field)
    expect(buffers.vertices).toBeLessThan(buffers.triangles)
    for (let i = 0; i < buffers.indices.length; i++) {
      expect(buffers.indices[i]!).toBeLessThan(buffers.vertices)
    }
  })

  it('rim vertices are shared by the floor and the ceiling — no boundary wall strip, no naked interior edges', () => {
    const field = build('branch')
    const buffers = buildHeightfieldMeshBuffers(field)
    const edgeUse = new Map<string, number>()
    for (let t = 0; t < buffers.indices.length; t += 3) {
      const tri = [buffers.indices[t]!, buffers.indices[t + 1]!, buffers.indices[t + 2]!]
      for (let k = 0; k < 3; k++) {
        const a = tri[k]!
        const b = tri[(k + 1) % 3]!
        const key = a < b ? `${a}:${b}` : `${b}:${a}`
        edgeUse.set(key, (edgeUse.get(key) ?? 0) + 1)
      }
    }
    let naked = 0
    for (const uses of edgeUse.values()) if (uses === 1) naked++
    // Only the open-sky portal may leave an open edge loop.
    expect(naked).toBeLessThan(edgeUse.size * 0.05)
    // Rim vertices are used by both an up-facing and a down-facing triangle.
    const rimUp = new Set<number>()
    const rimDown = new Set<number>()
    for (let t = 0; t < buffers.indices.length; t += 3) {
      const ny = triangleUpSign(buffers.positions, buffers.indices, t)
      for (let k = 0; k < 3; k++) {
        const v = buffers.indices[t + k]!
        if (ny > 1e-9) rimUp.add(v)
        else if (ny < -1e-9) rimDown.add(v)
      }
    }
    let shared = 0
    for (const v of rimUp) if (rimDown.has(v)) shared++
    // A few rim vertices only touch sliver triangles on one side; the bulk
    // must be welded.
    expect(shared).toBeGreaterThanOrEqual(buffers.rimVertexCount * 0.8)
  })

  it('clips the ceiling on the open-sky contour — no cave lid over the mouth aperture', () => {
    for (const id of CAVE_HEIGHTFIELD_FIXTURE_IDS) {
      const field = build(id)
      const { positions, indices } = buildHeightfieldMeshBuffers(field)
      const opening = (x: number, z: number): number => mouthOpeningAt(field, walk, x, z)
      // Sample the aperture: everywhere the void clearly breaks the surface.
      const openPoints: [number, number][] = []
      for (let z = field.entrance.z - 6; z <= field.entrance.z + 6; z += 0.5) {
        for (let x = field.entrance.x - 6; x <= field.entrance.x + 6; x += 0.5) {
          if (opening(x, z) > 0.25) openPoints.push([x, z])
        }
      }
      expect(openPoints.length).toBeGreaterThan(4)
      let lidHits = 0
      for (let t = 0; t < indices.length; t += 3) {
        if (triangleUpSign(positions, indices, t) >= -1e-9) continue // floor
        for (const [x, z] of openPoints) {
          if (pointInTriangleXZ(positions, indices, t, x, z)) lidHits++
        }
      }
      expect(lidHits).toBe(0)
      // The floor (entrance ramp) does cover the aperture.
      let floorHits = 0
      for (let t = 0; t < indices.length; t += 3) {
        if (triangleUpSign(positions, indices, t) <= 1e-9) continue
        for (const [x, z] of openPoints) {
          if (pointInTriangleXZ(positions, indices, t, x, z)) floorHits++
        }
      }
      expect(floorHits).toBeGreaterThanOrEqual(openPoints.length)
    }
  })

  it('sky-rim vertices sit at the walk surface height (where the terrain cutout stops)', () => {
    const field = build('basic')
    const { positions, indices } = buildHeightfieldMeshBuffers(field)
    // Ceiling vertices on the aperture boundary: down-facing triangles whose
    // vertex is where the ceiling meets the surface.
    let checked = 0
    for (let t = 0; t < indices.length; t += 3) {
      if (triangleUpSign(positions, indices, t) >= -1e-9) continue
      for (let k = 0; k < 3; k++) {
        const v = indices[t + k]! * 3
        const x = positions[v]!
        const y = positions[v + 1]!
        const z = positions[v + 2]!
        const surface = walk(x, z)
        if (Math.abs(y - surface) > 0.3) continue
        const sample = sampleHeightfieldAt(field, x, z)
        if (sample.gap <= 0) continue
        // Ceiling never pokes above the walk surface.
        expect(y).toBeLessThanOrEqual(surface + 0.3)
        checked++
      }
    }
    expect(checked).toBeGreaterThan(0)
  })

  it('keeps the floor warmer/brighter than the darkened ceiling', () => {
    const field = build('basic')
    const { positions, colors, indices } = buildHeightfieldMeshBuffers(field)
    let floorLuma = 0
    let floorN = 0
    let ceilLuma = 0
    let ceilN = 0
    for (let t = 0; t < indices.length; t += 3) {
      const ny = triangleUpSign(positions, indices, t)
      for (let k = 0; k < 3; k++) {
        const v = indices[t + k]! * 3
        const luma = colors[v]! * 0.3 + colors[v + 1]! * 0.59 + colors[v + 2]! * 0.11
        if (ny > 1e-9) {
          floorLuma += luma
          floorN++
        } else if (ny < -1e-9) {
          ceilLuma += luma
          ceilN++
        }
      }
    }
    expect(floorN).toBeGreaterThan(0)
    expect(ceilN).toBeGreaterThan(0)
    expect(floorLuma / floorN).toBeGreaterThan(ceilLuma / ceilN)
  })
})

describe('mouth underside mask (production, presentation-only)', () => {
  it('sits under the terrain around the opening, not in the doorway', () => {
    for (const id of CAVE_HEIGHTFIELD_FIXTURE_IDS) {
      const field = build(id)
      const opening = (x: number, z: number): number => mouthOpeningAt(field, walk, x, z)
      const buffers = buildMouthUndersideMaskBuffers(field, opening, walk)
      expect(buffers.vertices).toBeGreaterThan(80)
      expect(buffers.triangles).toBeGreaterThan(80)
      let insideDoorway = 0
      for (let i = 0; i < buffers.vertices; i++) {
        const x = buffers.positions[i * 3]!
        const y = buffers.positions[i * 3 + 1]!
        const z = buffers.positions[i * 3 + 2]!
        expect(Number.isFinite(y)).toBe(true)
        expect(y).toBeLessThan(walk(x, z) - 0.01)
        expect(Math.hypot(x - field.entrance.x, z - field.entrance.z)).toBeLessThan(12)
        if (opening(x, z) > 0.12 && y > walk(x, z) - 0.35) insideDoorway++
        const sample = sampleHeightfieldAt(field, x, z)
        if (
          sample.gap > 0
          && !sample.outsideGrid
          && sample.surfaceY - sample.ceilY > 0.12
          && y >= sample.floorY - 0.05
        ) {
          expect(y).toBeGreaterThan(sample.ceilY - 0.02)
        }
      }
      expect(insideDoorway).toBe(0)
    }
  })

  it('is deterministic', () => {
    const field = build('basic')
    const opening = (x: number, z: number): number => mouthOpeningAt(field, walk, x, z)
    const a = buildMouthUndersideMaskBuffers(field, opening, walk)
    const b = buildMouthUndersideMaskBuffers(field, opening, walk)
    expect(a.vertices).toBe(b.vertices)
    expect(arraysEqual(a.positions, b.positions)).toBe(true)
    expect(Array.from(a.indices)).toEqual(Array.from(b.indices))
  })

  it('widens the entrance floor catcher to reach past the old left/right/front extent', () => {
    for (const id of CAVE_HEIGHTFIELD_FIXTURE_IDS) {
      const field = build(id)
      const opening = (x: number, z: number): number => mouthOpeningAt(field, walk, x, z)
      const buffers = buildMouthUndersideMaskBuffers(field, opening, walk)
      const out = openingDirection(field.entrance.yaw)
      const right = { dx: out.dz, dz: -out.dx }
      // Points 6 m to each side and 3 m along the approach — outside the old
      // half-extents (5 m across / 2 m out) but inside the new ones (7 m
      // across / 3.25 m out). The widened catcher must cover them.
      const probes: [number, number][] = [
        [field.entrance.x + right.dx * 6, field.entrance.z + right.dz * 6],
        [field.entrance.x - right.dx * 6, field.entrance.z - right.dz * 6],
        [field.entrance.x + out.dx * 3, field.entrance.z + out.dz * 3],
      ]
      for (const [px, pz] of probes) {
        let covered = false
        for (let i = 0; i < buffers.vertices; i++) {
          const x = buffers.positions[i * 3]!
          const z = buffers.positions[i * 3 + 2]!
          if (Math.hypot(x - px, z - pz) < 1.5) {
            covered = true
            break
          }
        }
        expect(covered).toBe(true)
      }
    }
  })
})

describe('cave mouth proxy buffers (world-terrain-026)', () => {
  it('covers production mouths with minimal geometry behind the terrain aperture', () => {
    for (const id of CAVE_HEIGHTFIELD_FIXTURE_IDS) {
      const field = build(id)
      const opening = (x: number, z: number): number => mouthOpeningAt(field, walk, x, z)
      const buffers = buildCaveMouthProxyBuffers(field, opening, walk)
      const fullMask = buildMouthUndersideMaskBuffers(field, opening, walk)
      expect(buffers.vertices).toBeGreaterThan(8)
      expect(buffers.triangles).toBeGreaterThan(4)
      expect(buffers.vertices).toBeLessThan(fullMask.vertices)
      for (let i = 0; i < buffers.vertices; i++) {
        const x = buffers.positions[i * 3]!
        const y = buffers.positions[i * 3 + 1]!
        const z = buffers.positions[i * 3 + 2]!
        expect(y).toBeLessThan(walk(x, z) - 0.05)
        expect(Math.hypot(x - field.entrance.x, z - field.entrance.z)).toBeLessThan(14)
      }
      expect(opening(field.entrance.x, field.entrance.z)).toBeGreaterThan(0)
    }
  })
})

/** Möller–Trumbore: distance along unit `dir` to the nearest triangle, or Infinity. */
function nearestTriangleHit(
  positions: Float32Array,
  indices: Uint32Array,
  o: readonly [number, number, number],
  dir: readonly [number, number, number],
): number {
  let best = Infinity
  for (let t = 0; t < indices.length; t += 3) {
    const a = indices[t]! * 3
    const b = indices[t + 1]! * 3
    const c = indices[t + 2]! * 3
    const e1 = [positions[b]! - positions[a]!, positions[b + 1]! - positions[a + 1]!, positions[b + 2]! - positions[a + 2]!]
    const e2 = [positions[c]! - positions[a]!, positions[c + 1]! - positions[a + 1]!, positions[c + 2]! - positions[a + 2]!]
    const p = [dir[1] * e2[2]! - dir[2] * e2[1]!, dir[2] * e2[0]! - dir[0] * e2[2]!, dir[0] * e2[1]! - dir[1] * e2[0]!]
    const det = e1[0]! * p[0]! + e1[1]! * p[1]! + e1[2]! * p[2]!
    if (Math.abs(det) < 1e-12) continue
    const inv = 1 / det
    const s = [o[0] - positions[a]!, o[1] - positions[a + 1]!, o[2] - positions[a + 2]!]
    const u = (s[0]! * p[0]! + s[1]! * p[1]! + s[2]! * p[2]!) * inv
    if (u < 0 || u > 1) continue
    const q = [s[1]! * e1[2]! - s[2]! * e1[1]!, s[2]! * e1[0]! - s[0]! * e1[2]!, s[0]! * e1[1]! - s[1]! * e1[0]!]
    const v = (dir[0] * q[0]! + dir[1] * q[1]! + dir[2] * q[2]!) * inv
    if (v < 0 || u + v > 1) continue
    const dist = (e2[0]! * q[0]! + e2[1]! * q[1]! + e2[2]! * q[2]!) * inv
    if (dist > 1e-6 && dist < best) best = dist
  }
  return best
}

describe('cave mouth proxy closes the aperture at distance (IMP-004)', () => {
  /** A distant, low-elevation sight line that drops into the opening must hit
   *  the proxy before it is clear of the opening under the (single-sided,
   *  back-face-culled) terrain sheet — otherwise the sky shows through as a
   *  bright hole. The skirt sits ~0.5 m outside the contour, so a sight line
   *  may run under the sheet that far before it meets proxy rock. */
  it('catches grazing sight lines before they pass under the terrain', () => {
    const STEP = 0.02
    const UNDER = 0.1
    const MAX_OUTSIDE = 0.8
    for (const id of CAVE_HEIGHTFIELD_FIXTURE_IDS) {
      const field = build(id)
      const opening = (x: number, z: number): number => mouthOpeningAt(field, walk, x, z)
      const { positions, indices } = buildCaveMouthProxyBuffers(field, opening, walk)
      const targets: { x: number, z: number }[] = []
      const openCells: { x: number, z: number }[] = []
      for (let z = field.entrance.z - 6; z <= field.entrance.z + 7; z += 0.2) {
        for (let x = field.entrance.x - 6; x <= field.entrance.x + 6; x += 0.2) {
          if (opening(x, z) > 0) openCells.push({ x, z })
        }
      }
      for (let z = field.entrance.z - 5; z <= field.entrance.z + 6; z += 0.5) {
        for (let x = field.entrance.x - 5; x <= field.entrance.x + 5; x += 0.5) {
          if (opening(x, z) > 0.05) targets.push({ x, z })
        }
      }
      expect(targets.length).toBeGreaterThan(0)
      const distanceToOpening = (x: number, z: number): number => {
        let best = Infinity
        for (const c of openCells) best = Math.min(best, Math.hypot(c.x - x, c.z - z))
        return best
      }
      const leaks: string[] = []
      for (const target of targets) {
        for (let yawDeg = 0; yawDeg < 360; yawDeg += 30) {
          for (const elevDeg of [1.5, 3, 6, 12]) {
            const yaw = (yawDeg * Math.PI) / 180
            const elev = (elevDeg * Math.PI) / 180
            const dir: [number, number, number] = [
              Math.cos(yaw) * Math.cos(elev), -Math.sin(elev), Math.sin(yaw) * Math.cos(elev),
            ]
            // The sight line enters the opening at the target, just under the
            // walk surface; skip it when terrain on the eye side blocks it.
            const ty = walk(target.x, target.z) - 0.01
            let occluded = false
            for (let back = STEP; back < 20; back += STEP) {
              const bx = target.x - dir[0] * back
              const bz = target.z - dir[2] * back
              if (ty - dir[1] * back < walk(bx, bz) && opening(bx, bz) <= 0) {
                occluded = true
                break
              }
            }
            if (occluded) continue
            const hit = nearestTriangleHit(positions, indices, [target.x, ty, target.z], dir)
            for (let d = STEP; d < Math.min(hit, 20); d += STEP) {
              const x = target.x + dir[0] * d
              const y = ty + dir[1] * d
              const z = target.z + dir[2] * d
              if (opening(x, z) > 0 || y >= walk(x, z) - UNDER) continue
              if (distanceToOpening(x, z) < MAX_OUTSIDE) continue
              leaks.push(`${id} target ${target.x.toFixed(1)},${target.z.toFixed(1)} yaw ${yawDeg} elev ${elevDeg}`)
              break
            }
          }
        }
      }
      expect(leaks.slice(0, 5)).toEqual([])
    }
  }, 30_000)
})

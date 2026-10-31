import * as THREE from 'three'
import type { CemeteryPiecePack } from './cemeteryPack'
import { patchProceduralFoliageMaterial } from '../world/foliageWind'
import {
  CEMETERY_PIECE_HALF_EXTENTS,
  cemeteryCryptLayout,
  cemeteryGraveLayout,
  type CemeterySize,
  isAbandonedCemeteryLandmarkId,
  pickCemeteryMarkerPiece,
} from './cemeteryLayout'
import { buildMergedCemeteryMesh, type CemeteryPieceInstance } from './cemeteryMesh'
import { applyTerrainTilt, clonePropWithYaw, rotateOffsetY, sampleLocalTerrain, type TerrainSampler } from './propUtils'

/** World placement context an individual stone-circle stone / cemetery grave
 *  needs to sample its own terrain height/normal (plan 173) — `worldX/worldZ`
 *  is the landmark's own placement point (matching `EnvironmentPlacement.x/z`)
 *  and `rotationY` its overall yaw. Omitted entirely, the flat single-height
 *  layout used before plan 173 is preserved (e.g. for tooling/tests that
 *  don't have a terrain sampler at hand). */
export type TerrainPlacementContext = {
  worldX: number
  worldZ: number
  rotationY: number
  sampleHeight: TerrainSampler
}

export function createTree(scale = 1): THREE.Group {
  const tree = new THREE.Group()
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18 * scale, 0.25 * scale, 1.6 * scale, 6),
    new THREE.MeshStandardMaterial({ color: 0x5c4033, flatShading: true }),
  )
  trunk.position.y = 0.8 * scale
  trunk.castShadow = true
  tree.add(trunk)

  const crown = new THREE.Mesh(
    new THREE.ConeGeometry(1.1 * scale, 2.2 * scale, 6),
    new THREE.MeshStandardMaterial({ color: 0x2f6b3a, flatShading: true }),
  )
  crown.position.y = 2.3 * scale
  crown.castShadow = true
  patchProceduralFoliageMaterial(crown.material as THREE.MeshStandardMaterial)
  tree.add(crown)
  return tree
}

/** Visible harvest remainder (plan 058) — same TreeId as the living tree. */
export function createTreeStump(scale = 1): THREE.Group {
  const stump = new THREE.Group()
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2 * scale, 0.26 * scale, 0.45 * scale, 6),
    new THREE.MeshStandardMaterial({ color: 0x5c4033, flatShading: true }),
  )
  trunk.position.y = 0.22 * scale
  trunk.castShadow = true
  stump.add(trunk)

  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22 * scale, 0.22 * scale, 0.06 * scale, 6),
    new THREE.MeshStandardMaterial({ color: 0x6b5340, flatShading: true }),
  )
  top.position.y = 0.48 * scale
  top.castShadow = true
  stump.add(top)
  return stump
}

/** Chop step 1 visual — tall trunk without crown (limbed / "dead" tree). */
export function createLimbedTree(scale = 1): THREE.Group {
  const tree = new THREE.Group()
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16 * scale, 0.22 * scale, 2.8 * scale, 6),
    new THREE.MeshStandardMaterial({ color: 0x4a3728, flatShading: true }),
  )
  trunk.position.y = 1.4 * scale
  trunk.castShadow = true
  tree.add(trunk)

  // A couple of short stub branches so it reads as "stripped", not a pole.
  const stubMat = new THREE.MeshStandardMaterial({ color: 0x3d2e22, flatShading: true })
  const stubA = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * scale, 0.05 * scale, 0.45 * scale, 5), stubMat)
  stubA.position.set(0.28 * scale, 2.1 * scale, 0)
  stubA.rotation.z = -0.9
  stubA.castShadow = true
  tree.add(stubA)
  const stubB = new THREE.Mesh(new THREE.CylinderGeometry(0.035 * scale, 0.045 * scale, 0.35 * scale, 5), stubMat)
  stubB.position.set(-0.22 * scale, 1.7 * scale, 0.1 * scale)
  stubB.rotation.z = 1.0
  stubB.castShadow = true
  tree.add(stubB)
  return tree
}

/**
 * Chop step 2 visual — low stump + fallen log beside it (same TreeId group).
 * `yaw` rotates the log offset so neighboring trees don't stack logs the same way.
 */
export function createFelledTree(scale = 1, yaw = 0): THREE.Group {
  const group = new THREE.Group()
  const stump = createTreeStump(scale)
  group.add(stump)

  const log = createFallenLog(scale, 2.6)
  const offset = 1.25 * scale
  log.position.set(Math.sin(yaw) * offset, 0, Math.cos(yaw) * offset)
  log.rotation.y = yaw + Math.PI / 2
  group.add(log)
  return group
}

export function createBush(scale = 1): THREE.Group {
  const bush = new THREE.Group()
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.55 * scale, 6, 4),
    new THREE.MeshStandardMaterial({ color: 0x3d7a3a, flatShading: true }),
  )
  body.scale.y = 0.75
  body.position.y = 0.42 * scale
  body.castShadow = true
  bush.add(body)
  return bush
}

/** Cluster of four trees — visual for the prey `thicket` spawner
 *  (`createFauna.ts`). Origin at feet; footprint ~7 m at scale 1 so ~4 m
 *  nature GLBs read as a grove. `variant` (0..1) jitters scale/offset/yaw.
 *  Clones `treeTemplates` (TREE_SPECS 0–3) when provided; otherwise
 *  procedural `createTree`. Decorative only — not `TreeLifecycle`. */
export function createThicket(
  scale = 1,
  variant = 0.5,
  treeTemplates?: THREE.Object3D[],
): THREE.Group {
  const group = new THREE.Group()
  // Four trunks around the origin (~90° apart), spaced for GLB canopies.
  const placements: Array<{ angle: number, radius: number, size: number }> = [
    { angle: 0.15 + variant * 0.4, radius: 2.4, size: 0.95 },
    { angle: 1.72 + variant * 0.3, radius: 2.7, size: 0.82 },
    { angle: 3.29 + variant * 0.35, radius: 2.5, size: 0.9 },
    { angle: 4.86 + variant * 0.25, radius: 2.85, size: 0.78 },
  ]
  const templates = treeTemplates != null && treeTemplates.length > 0 ? treeTemplates : null
  for (let i = 0; i < placements.length; i++) {
    const p = placements[i]!
    const sizeJitter = 0.9 + ((variant * (i + 3)) % 1) * 0.25
    const yaw = variant * 4.2 + i * 1.7
    const treeScale = scale * p.size * sizeJitter
    const tree = templates
      ? clonePropWithYaw(templates, i, treeScale, yaw)
      : createTree(treeScale)
    const r = p.radius * scale * (0.9 + ((variant * (i + 5)) % 1) * 0.2)
    tree.position.set(Math.sin(p.angle) * r, 0, Math.cos(p.angle) * r)
    if (!templates) tree.rotation.y = yaw
    group.add(tree)
  }
  return group
}

export function createCactus(scale = 1): THREE.Group {
  const cactus = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x4d7a4a, flatShading: true })

  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * scale, 0.28 * scale, 1.6 * scale, 7), mat)
  trunk.position.y = 0.8 * scale
  trunk.castShadow = true
  cactus.add(trunk)

  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.14 * scale, 0.16 * scale, 0.7 * scale, 6), mat)
  arm.position.set(0.28 * scale, 1.05 * scale, 0)
  arm.rotation.z = -0.5
  arm.castShadow = true
  cactus.add(arm)

  return cactus
}

/** Forest-floor undergrowth fallback — a squashed, low bush (plan 140). */
export function createFern(scale = 1): THREE.Group {
  const fern = new THREE.Group()
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.4 * scale, 6, 4),
    new THREE.MeshStandardMaterial({ color: 0x4a7d3f, flatShading: true }),
  )
  body.scale.set(1.2, 0.35, 1.2)
  body.position.y = 0.14 * scale
  body.castShadow = false
  patchProceduralFoliageMaterial(body.material as THREE.MeshStandardMaterial)
  fern.add(body)
  return fern
}

/** Plaza cobble plate fallback — a low, wide stone disc (plan 140). */
export function createCobblePlate(scale = 1): THREE.Group {
  const plate = new THREE.Group()
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72 * scale, 0.78 * scale, 0.06 * scale, 6),
    new THREE.MeshStandardMaterial({ color: 0x8a8a86, flatShading: true }),
  )
  mesh.position.y = 0.03 * scale
  mesh.castShadow = false
  mesh.receiveShadow = true
  plate.add(mesh)
  return plate
}

export function createReed(scale = 1): THREE.Group {
  const reed = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x6f8a4a, flatShading: true })
  for (let i = 0; i < 5; i++) {
    const height = (0.8 + Math.random() * 0.5) * scale
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.035 * scale, height, 4), mat)
    blade.position.set((Math.random() - 0.5) * 0.3 * scale, height / 2, (Math.random() - 0.5) * 0.3 * scale)
    // No shadow: a 3.5cm-radius blade contributes an imperceptible shadow at
    // the world's shadow-map resolution but still costs a draw call (perf
    // review A2 — "drobne propsy").
    blade.castShadow = false
    reed.add(blade)
  }
  return reed
}

/** Shallow-water lily pad fallback (plan world-terrain-010) — flat disc, no
 *  shadow (same "drobne propsy" reasoning as `createReed`). */
export function createLilyPad(scale = 1): THREE.Group {
  const lily = new THREE.Group()
  const pad = new THREE.Mesh(
    new THREE.CircleGeometry(0.28 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x2f6b3a, flatShading: true, side: THREE.DoubleSide }),
  )
  pad.rotation.x = -Math.PI / 2
  pad.castShadow = false
  lily.add(pad)
  return lily
}

/** Shallow coastal seaweed fallback (plan world-terrain-010, Phase 7) — a
 *  loose cluster of thin blades rooted at the seabed, no shadow (same
 *  "drobne propsy" reasoning as `createReed`/`createLilyPad`). */
export function createSeaweed(scale = 1): THREE.Group {
  const seaweed = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x2f6b4a, flatShading: true, side: THREE.DoubleSide })
  for (let i = 0; i < 4; i++) {
    const height = (0.35 + Math.random() * 0.25) * scale
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.05 * scale, height, 4), mat)
    blade.position.set((Math.random() - 0.5) * 0.2 * scale, height / 2, (Math.random() - 0.5) * 0.2 * scale)
    blade.castShadow = false
    seaweed.add(blade)
  }
  return seaweed
}

/** Rock surface palette for `createLargeRock` vertex colors — soft natural
 *  tints rather than a flat mid-gray slab. Tunable after visual check.
 *  Callers (e.g. cave interiors) may pass a custom palette to match local
 *  stone without changing the outdoor default. */
export type LargeRockPalette = {
  base: THREE.Color
  cool: THREE.Color
  warm: THREE.Color
  moss: THREE.Color
}

const LARGE_ROCK_PALETTE: LargeRockPalette = {
  base: new THREE.Color(0x7d7a72),
  cool: new THREE.Color(0x5c6168),
  warm: new THREE.Color(0x8a7b68),
  moss: new THREE.Color(0x6a7360),
}

/** Soft blotch cell size in local geometry units (~0.9 radius icosahedron).
 *  Larger → fewer, broader colour patches; smaller → finer mottling. */
const LARGE_ROCK_NOISE_CELL = 0.68
/** Second octave cell size — slight extra variety without pixel noise. */
const LARGE_ROCK_NOISE_CELL_B = 1.05
/** Bottom / top luminance multipliers along local Y. */
const LARGE_ROCK_BOTTOM_MUL = 0.78
const LARGE_ROCK_TOP_MUL = 1.06
/** Extra lift for faces whose normal points upward. */
const LARGE_ROCK_UP_FACE_BOOST = 0.07
/** How strongly accent colours mix into the base (0 = flat base, 1 = full). */
const LARGE_ROCK_ACCENT_STRENGTH = 0.55

/** Deterministic 0..1 hash from position + seed — no `Math.random()`. */
function rockHash01(x: number, y: number, z: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 19.19) * 43758.5453123
  return n - Math.floor(n)
}

/** Low-frequency trilinear value noise — large cells so blotches span many
 *  flat-shaded faces instead of reading as fine speckles. */
function rockValueNoise(x: number, y: number, z: number, seed: number, cellSize: number): number {
  const inv = 1 / cellSize
  const sx = x * inv
  const sy = y * inv
  const sz = z * inv
  const ix = Math.floor(sx)
  const iy = Math.floor(sy)
  const iz = Math.floor(sz)
  const fx = sx - ix
  const fy = sy - iy
  const fz = sz - iz
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const uz = fz * fz * (3 - 2 * fz)

  const c000 = rockHash01(ix, iy, iz, seed)
  const c100 = rockHash01(ix + 1, iy, iz, seed)
  const c010 = rockHash01(ix, iy + 1, iz, seed)
  const c110 = rockHash01(ix + 1, iy + 1, iz, seed)
  const c001 = rockHash01(ix, iy, iz + 1, seed)
  const c101 = rockHash01(ix + 1, iy, iz + 1, seed)
  const c011 = rockHash01(ix, iy + 1, iz + 1, seed)
  const c111 = rockHash01(ix + 1, iy + 1, iz + 1, seed)

  const x00 = c000 * (1 - ux) + c100 * ux
  const x10 = c010 * (1 - ux) + c110 * ux
  const x01 = c001 * (1 - ux) + c101 * ux
  const x11 = c011 * (1 - ux) + c111 * ux
  const y0 = x00 * (1 - uy) + x10 * uy
  const y1 = x01 * (1 - uy) + x11 * uy
  return y0 * (1 - uz) + y1 * uz
}

const _rockColor = new THREE.Color()
const _rockAccent = new THREE.Color()

/**
 * Bakes soft, variant-seeded rock surface colours into `geometry` (absolute
 * RGB; pair with a white `MeshStandardMaterial` + `vertexColors: true`).
 * Cheap one-shot CPU work at prop creation — no shaders, textures, or extra
 * draw calls. Compatible with shared-geometry instancing.
 * `radius` scales noise cells with the icosahedron so blotch size stays
 * proportional when `createLargeRock`'s `scale` changes.
 */
function applyLargeRockVertexColors(
  geometry: THREE.BufferGeometry,
  variant: number,
  radius: number,
  palette: LargeRockPalette,
): void {
  const pos = geometry.getAttribute('position')
  if (!pos) return
  const nrm = geometry.getAttribute('normal')
  const count = pos.count
  const colors = new Float32Array(count * 3)

  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i < count; i++) {
    const y = pos.getY(i)
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  const yRange = Math.max(1e-6, maxY - minY)
  const seed = variant * 97.13 + 11.7
  // Keep blotch size proportional to the icosahedron radius (tuned at scale=1).
  const sizeMul = radius / 0.9
  const cellA = LARGE_ROCK_NOISE_CELL * sizeMul
  const cellB = LARGE_ROCK_NOISE_CELL_B * sizeMul

  for (let i = 0; i < count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const z = pos.getZ(i)

    const nA = rockValueNoise(x, y, z, seed, cellA)
    const nB = rockValueNoise(x, y, z, seed + 3.17, cellB)

    // Soft mix across four rock tints — large cells keep patches broad.
    if (nA < 0.34) {
      _rockAccent.copy(palette.cool)
    } else if (nA < 0.67) {
      _rockAccent.copy(palette.warm)
    } else {
      _rockAccent.copy(palette.moss)
    }
    const mix = (0.2 + nB * LARGE_ROCK_ACCENT_STRENGTH) * (0.55 + nA * 0.45)
    _rockColor.copy(palette.base).lerp(_rockAccent, mix)

    const yNorm = (y - minY) / yRange
    const heightMul = LARGE_ROCK_BOTTOM_MUL + yNorm * (LARGE_ROCK_TOP_MUL - LARGE_ROCK_BOTTOM_MUL)
    _rockColor.multiplyScalar(heightMul)

    if (nrm) {
      const ny = nrm.getY(i)
      if (ny > 0.25) {
        _rockColor.multiplyScalar(1 + (ny - 0.25) * LARGE_ROCK_UP_FACE_BOOST)
      }
    }

    colors[i * 3] = _rockColor.r
    colors[i * 3 + 1] = _rockColor.g
    colors[i * 3 + 2] = _rockColor.b
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}

/**
 * Uniform per-pebble RGB multiplier (relative to the shared material
 * `color`) so ore tints from `createRockCluster(..., color)` /
 * `tintPropMaterials` stay intact while pebbles still differ slightly.
 */
function applyPebbleVertexTint(geometry: THREE.BufferGeometry, mulR: number, mulG: number, mulB: number): void {
  const pos = geometry.getAttribute('position')
  if (!pos) return
  const count = pos.count
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    colors[i * 3] = mulR
    colors[i * 3 + 1] = mulG
    colors[i * 3 + 2] = mulB
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
}

/** Irregular boulder — `IcosahedronGeometry` squashed/stretched per axis from
 *  `variant` (deterministic, no `Math.random()`: the caller already rolled a
 *  seeded `variant` in `chunkEnvironment.ts`, so re-rolling here would break
 *  the "same chunk reload = same world" guarantee). Soft vertex-colour
 *  blotches (cool / warm / mossy) + darker base give surface variety without
 *  textures or extra draw calls. Optional `palette` overrides the outdoor
 *  default (e.g. warm browns for cave interiors). */
export function createLargeRock(
  scale = 1,
  variant = 0.5,
  palette: LargeRockPalette = LARGE_ROCK_PALETTE,
): THREE.Group {
  const rock = new THREE.Group()
  const radius = 0.9 * scale
  const geometry = new THREE.IcosahedronGeometry(radius, 1)
  applyLargeRockVertexColors(geometry, variant, radius, palette)
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      flatShading: true,
      roughness: 1,
      vertexColors: true,
    }),
  )
  mesh.scale.set(
    0.75 + variant * 0.6,
    0.55 + ((variant * 7) % 1) * 0.5,
    0.75 + ((variant * 13) % 1) * 0.6,
  )
  mesh.position.y = 0.35 * scale
  mesh.castShadow = true
  mesh.receiveShadow = true
  rock.add(mesh)
  return rock
}

/** Small cluster of pebbles (same geometry as the collectible `stone` item,
 *  `items.ts` — pure visual reuse) scattered deterministically from `variant`
 *  via trig offsets rather than `Math.random()`. `color` defaults to plain
 *  rock gray — overridden for ore piles (`terrain/resourceDeposits.ts`, e.g.
 *  rust for iron, near-black for coal, gold for a gold vein). Per-pebble
 *  vertex-colour multipliers keep ore / `tintPropMaterials` base colour
 *  while breaking up a flat monochrome pile. */
export function createRockCluster(scale = 1, variant = 0.5, color = 0x8c8c8c): THREE.Group {
  const cluster = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color, flatShading: true, vertexColors: true })
  // Wider spread than a fixed 3-5: `variant` (already a random 0..1 roll from
  // the caller) pushes some clusters up to 9 pebbles for visible size variety
  // between clusters, not just within one.
  const count = 3 + Math.floor(variant * 7)
  const spread = 0.7 + variant * 0.6
  for (let i = 0; i < count; i++) {
    const a = variant * Math.PI * 2 + i * 2.4
    const r = (0.15 + ((variant * (i + 3)) % 1) * 0.3) * spread
    const geometry = new THREE.DodecahedronGeometry(0.16 * scale * (0.7 + (i % 3) * 0.15), 1)
    // Soft per-pebble luminance / warm-cool shift (multiplies material.color).
    const tintRoll = (variant * (i + 17) + i * 0.37) % 1
    const lum = 0.86 + ((variant * (i + 9)) % 1) * 0.22
    let mulR = lum
    let mulG = lum
    let mulB = lum
    if (tintRoll < 0.33) {
      mulR *= 0.94
      mulG *= 0.97
      mulB *= 1.05
    } else if (tintRoll < 0.66) {
      mulR *= 1.06
      mulG *= 0.98
      mulB *= 0.92
    }
    applyPebbleVertexTint(geometry, mulR, mulG, mulB)
    const pebble = new THREE.Mesh(geometry, mat)
    pebble.position.set(Math.cos(a) * r, 0.08 * scale, Math.sin(a) * r)
    pebble.rotation.set(a, a * 1.3, 0)
    // No shadow: same reasoning as `createReed` (perf review A2).
    pebble.castShadow = false
    cluster.add(pebble)
  }
  return cluster
}

/** Fallen tree trunk lying on its side — `length` (world units) comes from
 *  `EnvironmentPlacement.variant`. Reuses `createTree`'s trunk color. */
export function createFallenLog(scale = 1, length = 2.4): THREE.Group {
  const log = new THREE.Group()
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22 * scale, 0.26 * scale, length * scale, 7),
    new THREE.MeshStandardMaterial({ color: 0x5c4033, flatShading: true }),
  )
  trunk.rotation.z = Math.PI / 2
  trunk.position.y = 0.22 * scale
  trunk.castShadow = true
  trunk.receiveShadow = true
  log.add(trunk)
  return log
}

/** Single standing stone landmark (plans/2026-08-09--049, "częste" tier) —
 *  a tapered low-poly pillar with a slight lean plus a couple of grounding
 *  rubble pebbles at its base. `variant` (0..1) drives height, lean and
 *  rubble placement so no two monoliths look identical. */
/** Terrain-aware element placement (plan world-terrain-006) — same
 *  finite-difference step/lean-clamp shape as `STONE_CIRCLE_TILT_STEP`/
 *  `STONE_CIRCLE_MAX_TILT_RAD`, tuned down slightly: monolith rubble sits
 *  close to the ground and shouldn't tilt as visibly as a tall stone-circle
 *  pillar. */
const MONOLITH_TILT_STEP = 0.5
const MONOLITH_MAX_TILT_RAD = THREE.MathUtils.degToRad(12)

/** Rare "częste" tier landmark (plans/2026-08-09--049) — a single leaning
 *  monolith with a scatter of rubble at its base. `terrain` (plan
 *  world-terrain-006), when given, grounds/tilts the main stone and each
 *  rubble piece at its own exact world position (same `applyTerrainTilt`
 *  pattern as `createStoneCircle`/`createCemetery`) instead of leaving only
 *  the landmark's root grounded by the caller's `placeOnGround` — on an
 *  accepted slope that left rubble floating/intersecting the terrain. */
export function createMonolith(scale = 1, variant = 0.5, terrain?: TerrainPlacementContext): THREE.Group {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x726d64, flatShading: true, roughness: 1 })
  const baseY = terrain ? terrain.sampleHeight(terrain.worldX, terrain.worldZ) : 0

  const height = (3 + variant * 2.4) * scale
  const stone = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32 * scale, 0.5 * scale, height, 5),
    mat,
  )
  stone.rotation.y = variant * Math.PI * 2
  stone.rotation.z = (variant - 0.5) * 0.18 // slight deliberate lean
  stone.position.y = height / 2
  if (terrain) {
    const sample = sampleLocalTerrain(terrain.sampleHeight, terrain.worldX, terrain.worldZ, MONOLITH_TILT_STEP)
    stone.position.y = sample.height - baseY + height / 2
    stone.rotation.y += terrain.rotationY
    applyTerrainTilt(stone, sample.normal, MONOLITH_MAX_TILT_RAD)
  }
  stone.castShadow = true
  stone.receiveShadow = true
  group.add(stone)

  const rubbleCount = 2 + Math.floor(variant * 3)
  for (let i = 0; i < rubbleCount; i++) {
    const a = variant * Math.PI * 2 + i * 2.3
    const r = 0.5 * scale + ((variant * (i + 4)) % 1) * 0.3 * scale
    const rubble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18 * scale, 0), mat)
    const localX = Math.cos(a) * r
    const localZ = Math.sin(a) * r
    if (terrain) {
      const { x: rx, z: rz } = rotateOffsetY(localX, localZ, terrain.rotationY)
      const sample = sampleLocalTerrain(terrain.sampleHeight, terrain.worldX + rx, terrain.worldZ + rz, MONOLITH_TILT_STEP)
      rubble.position.set(rx, sample.height - baseY + 0.1 * scale, rz)
      rubble.rotation.set(a, a * 1.4, 0)
      applyTerrainTilt(rubble, sample.normal, MONOLITH_MAX_TILT_RAD)
    } else {
      rubble.position.set(localX, 0.1 * scale, localZ)
      rubble.rotation.set(a, a * 1.4, 0)
    }
    rubble.castShadow = true
    group.add(rubble)
  }

  return group
}

/** Terrain-aware element placement (plan 173) — finite-difference step and
 *  lean clamp for individual stone-circle stones. Stones are thick/short
 *  enough to tolerate more visible lean than a gravestone before it reads
 *  as broken. */
const STONE_CIRCLE_TILT_STEP = 0.4
const STONE_CIRCLE_MAX_TILT_RAD = THREE.MathUtils.degToRad(20)

/** Small stone circle landmark (plans/2026-08-09--049, "rzadkie" tier) — a
 *  ring of upright stones of uneven height, deterministically varied by
 *  `variant` (stone count 6-9, per-stone height jitter). Reads as a miniature
 *  Stonehenge from a distance without needing per-stone unique geometry.
 *  `terrain` (plan 173), when given, samples each stone's own ground height/
 *  normal at its exact world position instead of placing the whole ring at
 *  one height — the caller still positions the returned group at the
 *  landmark's own ground height via `placeOnGround`/`terrain.worldX/worldZ`
 *  (same value), so per-stone offsets are relative to that. */
export function createStoneCircle(scale = 1, variant = 0.5, terrain?: TerrainPlacementContext): THREE.Group {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x736e64, flatShading: true, roughness: 1 })

  const count = 6 + Math.floor(variant * 4)
  const radius = 2.6 * scale
  const baseY = terrain ? terrain.sampleHeight(terrain.worldX, terrain.worldZ) : 0
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2
    const h = (1.3 + ((variant * (i + 2)) % 1) * 0.9) * scale
    const stone = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22 * scale, 0.3 * scale, h, 5),
      mat,
    )
    const localX = Math.cos(a) * radius
    const localZ = Math.sin(a) * radius
    if (terrain) {
      const { x: rx, z: rz } = rotateOffsetY(localX, localZ, terrain.rotationY)
      const sample = sampleLocalTerrain(terrain.sampleHeight, terrain.worldX + rx, terrain.worldZ + rz, STONE_CIRCLE_TILT_STEP)
      stone.position.set(rx, sample.height - baseY + h / 2, rz)
      stone.rotation.y = a + terrain.rotationY
      applyTerrainTilt(stone, sample.normal, STONE_CIRCLE_MAX_TILT_RAD)
    } else {
      stone.position.set(localX, h / 2, localZ)
      stone.rotation.y = a
    }
    stone.castShadow = true
    stone.receiveShadow = true
    group.add(stone)
  }

  return group
}

/** Small ruined wall/foundation fragment (plans/2026-08-09--049, "rzadkie"
 *  tier) — a low foundation slab with two intersecting wall stubs of uneven,
 *  broken height, reading as the corner of a long-gone building rather than
 *  a random pile of boxes. `variant` (0..1) drives wall height/damage. */
/** Same tilt-step/clamp shape as `MONOLITH_TILT_STEP`/`MONOLITH_MAX_TILT_RAD`
 *  (plan world-terrain-006) — walls are thin, so a small tilt already reads
 *  clearly; kept modest so a "broken corner" doesn't look like it's
 *  toppling. */
const RUINS_TILT_STEP = 0.4
const RUINS_MAX_TILT_RAD = THREE.MathUtils.degToRad(10)

export function createSmallRuins(scale = 1, variant = 0.5, terrain?: TerrainPlacementContext): THREE.Group {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x8a8478, flatShading: true, roughness: 1 })
  const baseY = terrain ? terrain.sampleHeight(terrain.worldX, terrain.worldZ) : 0

  const size = 3.2 * scale
  const foundation = new THREE.Mesh(new THREE.BoxGeometry(size, 0.15 * scale, size), mat)
  foundation.position.y = 0.075 * scale
  // Kept flat/rigid (no per-vertex conforming) — only re-yawed to stay
  // visually aligned with the walls below, which do get per-element grounding.
  if (terrain) foundation.rotation.y = terrain.rotationY
  foundation.receiveShadow = true
  group.add(foundation)

  const wallHeight = (1.1 + variant * 0.7) * scale
  const wall1 = new THREE.Mesh(new THREE.BoxGeometry(size, wallHeight, 0.28 * scale), mat)
  const wall1LocalX = 0
  const wall1LocalZ = -size / 2 + 0.14 * scale
  wall1.position.set(wall1LocalX, wallHeight / 2, wall1LocalZ)
  if (terrain) {
    const { x: rx, z: rz } = rotateOffsetY(wall1LocalX, wall1LocalZ, terrain.rotationY)
    const sample = sampleLocalTerrain(terrain.sampleHeight, terrain.worldX + rx, terrain.worldZ + rz, RUINS_TILT_STEP)
    wall1.position.set(rx, sample.height - baseY + wallHeight / 2, rz)
    wall1.rotation.y = terrain.rotationY
    applyTerrainTilt(wall1, sample.normal, RUINS_MAX_TILT_RAD)
  }
  wall1.castShadow = true
  wall1.receiveShadow = true
  group.add(wall1)

  // Adjoining wall is more broken down — shorter, so the corner still reads
  // clearly as a ruin rather than an intact room.
  const wall2Height = wallHeight * (0.45 + variant * 0.35)
  const wall2 = new THREE.Mesh(new THREE.BoxGeometry(0.28 * scale, wall2Height, size), mat)
  const wall2LocalX = -size / 2 + 0.14 * scale
  const wall2LocalZ = 0
  wall2.position.set(wall2LocalX, wall2Height / 2, wall2LocalZ)
  if (terrain) {
    const { x: rx, z: rz } = rotateOffsetY(wall2LocalX, wall2LocalZ, terrain.rotationY)
    const sample = sampleLocalTerrain(terrain.sampleHeight, terrain.worldX + rx, terrain.worldZ + rz, RUINS_TILT_STEP)
    wall2.position.set(rx, sample.height - baseY + wall2Height / 2, rz)
    wall2.rotation.y = terrain.rotationY
    applyTerrainTilt(wall2, sample.normal, RUINS_MAX_TILT_RAD)
  }
  wall2.castShadow = true
  wall2.receiveShadow = true
  group.add(wall2)

  const rubbleCount = 2 + Math.floor(variant * 3)
  for (let i = 0; i < rubbleCount; i++) {
    const a = variant * Math.PI * 2 + i * 1.9
    const r = size * 0.3 + ((variant * (i + 5)) % 1) * size * 0.25
    const rubble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22 * scale, 0), mat)
    const localX = Math.cos(a) * r
    const localZ = Math.sin(a) * r
    if (terrain) {
      const { x: rx, z: rz } = rotateOffsetY(localX, localZ, terrain.rotationY)
      const sample = sampleLocalTerrain(terrain.sampleHeight, terrain.worldX + rx, terrain.worldZ + rz, RUINS_TILT_STEP)
      rubble.position.set(rx, sample.height - baseY + 0.11 * scale, rz)
      rubble.rotation.set(a, a * 1.2, 0)
      applyTerrainTilt(rubble, sample.normal, RUINS_MAX_TILT_RAD)
    } else {
      rubble.position.set(localX, 0.11 * scale, localZ)
      rubble.rotation.set(a, a * 1.2, 0)
    }
    rubble.castShadow = true
    group.add(rubble)
  }

  return group
}

/** Larger expedition ruin layout (plan quests-progression-009) — semantically
 *  distinct from procedural `smallRuins`: a readable corner of a bigger
 *  structure with a partial second wall run and more rubble. */
export function createExpeditionRuins(scale = 1, variant = 0.5, terrain?: TerrainPlacementContext): THREE.Group {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x857f73, flatShading: true, roughness: 1 })
  const baseY = terrain ? terrain.sampleHeight(terrain.worldX, terrain.worldZ) : 0
  const size = 5.4 * scale

  const foundation = new THREE.Mesh(new THREE.BoxGeometry(size * 1.05, 0.18 * scale, size * 1.05), mat)
  foundation.position.y = 0.09 * scale
  if (terrain) foundation.rotation.y = terrain.rotationY
  foundation.receiveShadow = true
  group.add(foundation)

  const addWall = (
    localX: number,
    localZ: number,
    w: number,
    h: number,
    d: number,
    heightMul: number,
  ): void => {
    const wallHeight = h * heightMul * scale
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w * scale, wallHeight, d * scale), mat)
    wall.position.set(localX, wallHeight / 2, localZ)
    if (terrain) {
      const { x: rx, z: rz } = rotateOffsetY(localX, localZ, terrain.rotationY)
      const sample = sampleLocalTerrain(terrain.sampleHeight, terrain.worldX + rx, terrain.worldZ + rz, RUINS_TILT_STEP)
      wall.position.set(rx, sample.height - baseY + wallHeight / 2, rz)
      wall.rotation.y = terrain.rotationY
      applyTerrainTilt(wall, sample.normal, RUINS_MAX_TILT_RAD)
    }
    wall.castShadow = true
    wall.receiveShadow = true
    group.add(wall)
  }

  const wallH = 1.35 + variant * 0.85
  addWall(0, -size / 2 + 0.2 * scale, size, wallH, 0.32, 1)
  addWall(-size / 2 + 0.2 * scale, 0, 0.32, wallH, size * 0.72, 0.55 + variant * 0.25)
  addWall(size / 2 - 0.2 * scale, size * 0.15, 0.28, wallH * 0.65, size * 0.45, 0.4 + variant * 0.2)

  const rubbleCount = 4 + Math.floor(variant * 4)
  for (let i = 0; i < rubbleCount; i++) {
    const a = variant * Math.PI * 2 + i * 1.37
    const r = size * 0.28 + ((variant * (i + 3)) % 1) * size * 0.32
    const rubble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28 * scale, 0), mat)
    const localX = Math.cos(a) * r
    const localZ = Math.sin(a) * r
    if (terrain) {
      const { x: rx, z: rz } = rotateOffsetY(localX, localZ, terrain.rotationY)
      const sample = sampleLocalTerrain(terrain.sampleHeight, terrain.worldX + rx, terrain.worldZ + rz, RUINS_TILT_STEP)
      rubble.position.set(rx, sample.height - baseY + 0.12 * scale, rz)
      rubble.rotation.set(a, a * 1.1, 0)
      applyTerrainTilt(rubble, sample.normal, RUINS_MAX_TILT_RAD)
    } else {
      rubble.position.set(localX, 0.12 * scale, localZ)
      rubble.rotation.set(a, a * 1.1, 0)
    }
    rubble.castShadow = true
    group.add(rubble)
  }

  return group
}

/** Single headstone fallback (plans/2026-08-09--049) — used when the Jarlan
 *  Perez `grave_a.glb` fails to load, and as extra stones around the cemetery
 *  plot. Origin at feet. */
export function createGraveStone(scale = 1): THREE.Group {
  const group = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color: 0x7a756c, flatShading: true, roughness: 1 })
  const slab = new THREE.Mesh(new THREE.BoxGeometry(0.38 * scale, 0.85 * scale, 0.12 * scale), mat)
  slab.position.y = 0.42 * scale
  slab.castShadow = true
  slab.receiveShadow = true
  group.add(slab)
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.5 * scale, 0.1 * scale, 0.22 * scale), mat)
  base.position.y = 0.05 * scale
  base.castShadow = true
  base.receiveShadow = true
  group.add(base)
  return group
}

/** Cemetery footprint size — see `cemeteryLayout.ts` (re-exported here for the existing import sites). */
export type { CemeterySize }
export { cemeteryCryptLayout, cemeteryGraveLayout, cemeteryPlotExtents } from './cemeteryLayout'

const CEMETERY_TILT_STEP = 0.35
/** Gravestones are thin slabs — clamp lean tighter than a stone-circle pillar
 *  so a slope doesn't read as a knocked-over headstone. */
const CEMETERY_GRAVE_MAX_TILT_RAD = THREE.MathUtils.degToRad(12)
/** Crypts sink slightly below their lowest corner so they never float on uneven ground. */
const CEMETERY_CRYPT_SINK = 0.1

/** Cemetery landmark (Q47 / Q39 plan, V2 donor layout) — a rectangular plot (crypt row at the back, grave grid
 *  with a central aisle, entrance towards +Z) from `cemeteryLayout.ts`, built as ONE merged mesh per cemetery
 *  from the `graveyard.glb` pieces (1 main + 1 shadow draw). `pack` undefined/null → procedural fallback
 *  (individual `createGraveStone`s + a box crypt). `variant` (0..1) drives the piece mix; `landmarkId`
 *  selects the damaged-heavy mix for abandoned (`cemetery:w:`) cemeteries. `terrain`, when given, samples each
 *  element's own ground height/normal at its exact world position (markers tilt ≤ 12°, crypts sit at their
 *  lowest corner); without it the layout sits flat. */
export function createCemetery(
  scale = 1,
  variant = 0.5,
  pack?: CemeteryPiecePack | null,
  size: CemeterySize = 'SM',
  terrain?: TerrainPlacementContext,
  landmarkId?: string,
): THREE.Group {
  const group = new THREE.Group()
  const baseY = terrain ? terrain.sampleHeight(terrain.worldX, terrain.worldZ) : 0
  const rotationY = terrain?.rotationY ?? 0
  const abandoned = isAbandonedCemeteryLandmarkId(landmarkId)
  const sampleAt = (lx: number, lz: number) => {
    const { x: rx, z: rz } = rotateOffsetY(lx, lz, rotationY)
    if (!terrain) return { rx, rz, height: 0, normal: new THREE.Vector3(0, 1, 0) }
    const sample = sampleLocalTerrain(terrain.sampleHeight, terrain.worldX + rx, terrain.worldZ + rz, CEMETERY_TILT_STEP)
    return { rx, rz, height: sample.height - baseY, normal: sample.normal }
  }

  const instances: CemeteryPieceInstance[] = []
  const slots = cemeteryGraveLayout(size, scale)
  const fallbackObjects: THREE.Object3D[] = []
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i]!
    const at = sampleAt(slot.markerX, slot.markerZ)
    const yaw = rotationY + slot.yaw
    if (pack) {
      instances.push({
        piece: pickCemeteryMarkerPiece(variant, i, abandoned),
        x: at.rx, y: at.height, z: at.rz, yaw, scale, normal: at.normal, maxTiltRad: CEMETERY_GRAVE_MAX_TILT_RAD,
      })
    } else {
      const stone = createGraveStone(scale)
      stone.position.set(at.rx, at.height, at.rz)
      stone.rotation.y = yaw
      applyTerrainTilt(stone, at.normal, CEMETERY_GRAVE_MAX_TILT_RAD)
      fallbackObjects.push(stone)
    }
  }

  const half = CEMETERY_PIECE_HALF_EXTENTS.Crypt
  for (const crypt of cemeteryCryptLayout(size, scale)) {
    const center = sampleAt(crypt.x, crypt.z)
    let low = center.height
    for (const [cx, cz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
      low = Math.min(low, sampleAt(crypt.x + cx * half.hx * crypt.scale * scale, crypt.z + cz * half.hz * crypt.scale * scale).height)
    }
    const yaw = rotationY + crypt.yaw
    const y = low - CEMETERY_CRYPT_SINK * scale * crypt.scale
    if (pack) {
      instances.push({ piece: 'Crypt', x: center.rx, y, z: center.rz, yaw, scale: scale * crypt.scale, normal: null, maxTiltRad: 0 })
    } else {
      const box = createFallbackCrypt(scale * crypt.scale)
      box.position.set(center.rx, y, center.rz)
      box.rotation.y = yaw
      fallbackObjects.push(box)
    }
  }

  if (pack) group.add(buildMergedCemeteryMesh(pack, instances))
  else for (const obj of fallbackObjects) group.add(obj)
  return group
}

/** Procedural crypt used only when `graveyard.glb` failed to load (V2 fallback box, 4.2 × 3 × 5.6 m). */
function createFallbackCrypt(scale: number): THREE.Mesh {
  const mat = new THREE.MeshStandardMaterial({ color: 0x6c675f, flatShading: true, roughness: 1 })
  const box = new THREE.Mesh(new THREE.BoxGeometry(4.2 * scale, 3 * scale, 5.6 * scale), mat)
  box.geometry.translate(0, 1.5 * scale, 0)
  box.castShadow = true
  box.receiveShadow = true
  return box
}

/** Horseshoe of rocks framing a real terrain depression — visual for the prey
 *  `cave` spawner (`createFauna.ts`, plan 083). Origin at feet; footprint
 *  ~2–3 m at scale 1. `variant` (0..1) jitters rock sizes/angles so two caves
 *  don't look identical. Open side faces +Z (caller may rotate) — the caller
 *  carves the actual pit into the terrain (`ChunkManager.modifyTerrain`)
 *  centered on this same origin; this prop only supplies the rock framing
 *  and a small dark accent, not the hole itself. */
export function createCaveMouth(scale = 1, variant = 0.5): THREE.Group {
  const group = new THREE.Group()
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x7d7a72,
    flatShading: true,
    roughness: 1,
  })
  const mouthMat = new THREE.MeshStandardMaterial({
    color: 0x1a1814,
    flatShading: true,
    roughness: 1,
    metalness: 0,
  })

  // U-shaped rock ring: angles spanning the back and sides, leaving +Z open.
  const rockAngles = [-2.2, -1.4, -0.7, 0.7, 1.4, 2.2]
  for (let i = 0; i < rockAngles.length; i++) {
    const a = rockAngles[i]!
    const sizeJitter = 0.75 + ((variant * (i + 3)) % 1) * 0.55
    const rock = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.55 * scale * sizeJitter, 0),
      rockMat,
    )
    const r = (1.05 + ((variant * (i + 5)) % 1) * 0.25) * scale
    rock.position.set(Math.sin(a) * r, 0.4 * scale * sizeJitter, Math.cos(a) * r * 0.55)
    rock.scale.set(
      0.85 + ((variant * (i + 2)) % 1) * 0.4,
      0.9 + ((variant * (i + 7)) % 1) * 0.5,
      0.85 + ((variant * (i + 11)) % 1) * 0.4,
    )
    rock.rotation.set(a * 0.3, a, variant * 1.7)
    rock.castShadow = true
    rock.receiveShadow = true
    group.add(rock)
  }

  // The opening itself is a real depression carved into the terrain by the
  // caller (`ChunkManager.modifyTerrain`, see `fauna/createFauna.ts`, plan
  // 083) — this prop no longer fakes it with a flat standing disc. A small
  // dark pool low at the back (away from the +Z open side, where the rock
  // ring is densest) hints the ground goes dark/deeper without reading as a
  // floating cap over the opening.
  const shadowPool = new THREE.Mesh(
    new THREE.CircleGeometry(0.5 * scale, 8),
    mouthMat,
  )
  shadowPool.rotation.x = -Math.PI / 2
  shadowPool.position.set(0, -0.35 * scale, -0.35 * scale)
  group.add(shadowPool)

  // Low threshold stone at the pit's open (+Z) lip, marking where natural
  // ground gives way to the carved depression.
  const sill = new THREE.Mesh(
    new THREE.BoxGeometry(1.4 * scale, 0.12 * scale, 0.5 * scale),
    rockMat,
  )
  sill.position.set(0, 0.02 * scale, 0.65 * scale)
  sill.receiveShadow = true
  group.add(sill)

  return group
}

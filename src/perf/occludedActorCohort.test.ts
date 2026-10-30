import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  type WebGLRenderer,
} from 'three'
import { describe, expect, it } from 'vitest'
import {
  censusOccludedActors,
  type CohortActor,
  createActorCohortMask,
  parseActorCohortMode,
} from './occludedActorCohort'

/** Camera at the origin looking down −Z; a 20 × 10 m wall at z = −10. */
function setup(wallOpts: { transparent?: boolean } = {}) {
  const scene = new Scene()
  const camera = new PerspectiveCamera(60, 3, 0.1, 500)
  camera.position.set(0, 1.5, 0)
  camera.lookAt(0, 1.5, -1)
  scene.add(camera)
  const settlement = new Group()
  settlement.name = 'settlement'
  const wall = new Mesh(
    new BoxGeometry(20, 10, 0.5),
    new MeshBasicMaterial({ transparent: wallOpts.transparent ?? false, opacity: wallOpts.transparent ? 0.5 : 1 }),
  )
  wall.position.set(0, 5, -10)
  settlement.add(wall)
  scene.add(settlement)
  return { scene, camera }
}

function actor(scene: Scene, id: string, x: number, z: number, opts: { dead?: boolean } = {}): CohortActor & { body: Mesh } {
  const root = new Group()
  root.name = 'npc'
  root.userData.npcFamily = 'peasant'
  const body = new Mesh(new BoxGeometry(0.6, 1.8, 0.6), new MeshBasicMaterial())
  body.position.y = 0.9
  body.castShadow = true
  root.add(body)
  root.position.set(x, 0, z)
  scene.add(root)
  return { id, family: 'npc', root, isDead: () => opts.dead ?? false, body }
}

function census(scene: Scene, camera: PerspectiveCamera, actors: CohortActor[]) {
  scene.updateMatrixWorld(true)
  camera.updateMatrixWorld(true)
  return censusOccludedActors({ mode: 'mask', actors, camera, scene, player: { x: 0, y: 0, z: 0 } })
}

/** Minimal renderer stand-in: `render` runs main projection, then the shadow map, like three. */
function fakeRenderer(onMain: () => void, onShadow: () => void) {
  const shadowMap = { render: (..._args: unknown[]) => onShadow() }
  const renderer = { shadowMap } as unknown as WebGLRenderer
  const render = () => {
    onMain()
    shadowMap.render()
  }
  return { renderer, render }
}

describe('parseActorCohortMode', () => {
  it('is off unless census or mask is requested', () => {
    expect(parseActorCohortMode(null, false)).toBe('off')
    expect(parseActorCohortMode('', true)).toBe('off')
    expect(parseActorCohortMode('1', true)).toBe('off')
    expect(parseActorCohortMode('census', true)).toBe('census')
    expect(parseActorCohortMode(' MASK ', true)).toBe('mask')
  })
})

describe('censusOccludedActors', () => {
  it('finds an actor fully behind an opaque settlement wall and splits near/far', () => {
    const { scene, camera } = setup()
    const hidden = actor(scene, 'npc-hidden', 0, -20)
    const visible = actor(scene, 'npc-open', 0, -5)
    const result = census(scene, camera, [hidden, visible])
    expect(result.inFrustum).toBe(2)
    expect(result.occluded.map((row) => row.id)).toEqual(['npc-hidden'])
    expect(result.occluded[0]).toMatchObject({ family: 'npc', kind: 'peasant', band: 'near', meshes: 1, castShadowMeshes: 1 })
    expect(result.bands['npc-near'].actors).toBe(1)
  })

  it('does not count an actor that straddles the wall edge', () => {
    const { scene, camera } = setup()
    // The wall (x ±10 at z −10) covers x ±20 at z −20; this actor spans 19.7…20.3.
    const edge = actor(scene, 'npc-edge', 20, -20)
    const result = census(scene, camera, [edge])
    expect(result.inFrustum).toBe(1)
    expect(result.occluded).toEqual([])
  })

  it('treats transparent blockers as see-through', () => {
    const { scene, camera } = setup({ transparent: true })
    const behind = actor(scene, 'npc-behind-glass', 0, -20)
    expect(census(scene, camera, [behind]).occluded).toEqual([])
  })

  it('skips dead actors and actors outside the frustum', () => {
    const { scene, camera } = setup()
    const dead = actor(scene, 'npc-dead', 0, -20, { dead: true })
    const behindCamera = actor(scene, 'npc-behind-camera', 0, 20)
    const result = census(scene, camera, [dead, behindCamera])
    expect(result.livingActors).toBe(1)
    expect(result.inFrustum).toBe(0)
    expect(result.occluded).toEqual([])
  })
})

describe('createActorCohortMask', () => {
  it('mask mode hides the cohort for the camera pass only and restores it', () => {
    const { scene, camera } = setup()
    const hidden = actor(scene, 'npc-hidden', 0, -20)
    camera.updateMatrixWorld(true)
    const mask = createActorCohortMask('mask')
    mask.arm([hidden], camera)
    const seen: { main?: boolean, shadow?: boolean } = {}
    const { renderer, render } = fakeRenderer(
      () => { seen.main = hidden.body.visible },
      () => { seen.shadow = hidden.body.visible },
    )
    mask.renderBeauty(renderer, render)
    expect(seen).toEqual({ main: false, shadow: true })
    expect(hidden.body.visible).toBe(true)
    expect(hidden.root.visible).toBe(true)
    const stats = mask.disarm()
    expect(stats).toMatchObject({ cohortStart: 1, cohortEnd: 1, frames: 1, maskedFrames: 1, hiddenMeshesAvg: 1 })
  })

  it('census mode never hides anything', () => {
    const { scene, camera } = setup()
    const hidden = actor(scene, 'npc-hidden', 0, -20)
    camera.updateMatrixWorld(true)
    const mask = createActorCohortMask('census')
    mask.arm([hidden], camera)
    let mainVisible = false
    const { renderer, render } = fakeRenderer(() => { mainVisible = hidden.body.visible }, () => {})
    mask.renderBeauty(renderer, render)
    expect(mainVisible).toBe(true)
    expect(mask.disarm()).toMatchObject({ maskedFrames: 0, cohortEnd: 1 })
  })

  it('drops actors that move or die and disarms on camera movement', () => {
    const { scene, camera } = setup()
    const walker = actor(scene, 'npc-walker', 0, -20)
    let dead = false
    const dier = { ...actor(scene, 'npc-dier', 2, -20), isDead: () => dead }
    const stayer = actor(scene, 'npc-stayer', -2, -20)
    camera.updateMatrixWorld(true)
    const mask = createActorCohortMask('mask')
    mask.arm([walker, dier, stayer], camera)
    const { renderer, render } = fakeRenderer(() => {}, () => {})

    walker.root.position.x += 0.5
    dead = true
    mask.renderBeauty(renderer, render)
    camera.position.x += 1
    camera.updateMatrixWorld(true)
    let stayerVisible = false
    mask.renderBeauty(renderer, () => { stayerVisible = stayer.body.visible })

    expect(stayerVisible).toBe(true)
    expect(mask.disarm()).toMatchObject({ cohortStart: 3, cohortEnd: 0, droppedMoved: 1, droppedDead: 1, cameraDisarmedAtFrame: 1, maskedFrames: 1 })
  })
})

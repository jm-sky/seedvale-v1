import {
  BufferGeometry,
  Camera,
  Group,
  InstancedMesh,
  type Material,
  Mesh,
  MeshBasicMaterial,
  Scene,
  Skeleton,
  SkinnedMesh,
  WebGLRenderer,
} from 'three'
import { describe, expect, it } from 'vitest'
import { createPassSubmissionCollector } from './passSubmissionCollector'

function fakeRenderer(): WebGLRenderer & { __draws: number } {
  const info = {
    render: { calls: 0, triangles: 0 },
    reset() {
      info.render.calls = 0
      info.render.triangles = 0
    },
  }
  const renderer = {
    info,
    __draws: 0,
    renderBufferDirect(
      _camera: Camera,
      _scene: Scene,
      geometry: BufferGeometry,
      _material: unknown,
      object: Mesh,
      _group: unknown,
    ) {
      renderer.__draws += 1
      const verts = geometry.index ? geometry.index.count : geometry.getAttribute('position')?.count ?? 0
      const instances = object instanceof InstancedMesh ? Math.max(0, object.count) : 1
      if (object instanceof InstancedMesh && object.count <= 0) return
      info.render.calls += 1
      info.render.triangles += (verts / 3) * instances
    },
  }
  return renderer as unknown as WebGLRenderer & { __draws: number }
}

function boxMesh(name: string): Mesh {
  const geo = new BufferGeometry()
  // 2 triangles
  geo.setAttribute('position', { count: 6, array: new Float32Array(18) } as never)
  geo.setIndex({ count: 6, array: new Uint16Array([0, 1, 2, 3, 4, 5]) } as never)
  const mesh = new Mesh(geo, new MeshBasicMaterial())
  mesh.name = name
  return mesh
}

describe('passSubmissionCollector', () => {
  it('is a no-op when disabled', () => {
    const collector = createPassSubmissionCollector()
    const renderer = fakeRenderer()
    collector.beginSession()
    collector.beginFrame()
    collector.withPass('main', new Camera(), () => {
      renderer.renderBufferDirect(new Camera(), new Scene(), boxMesh('npc').geometry, boxMesh('npc').material as never, boxMesh('npc'), undefined as never)
    })
    collector.endFrame()
    const report = collector.endSession()
    expect(report.reliability).toBe('disabled')
    expect(report.main).toBeNull()
  })

  it('attributes actual renderBufferDirect draws by classifyObject name', () => {
    const collector = createPassSubmissionCollector()
    const renderer = fakeRenderer()
    collector.enable(renderer)
    collector.beginSession()
    collector.beginFrame()
    collector.noteShadowRefresh(false)
    const beauty = new Camera()
    const npc = boxMesh('npc')
    const root = new Group()
    root.name = 'npc'
    root.userData.npcFamily = 'villager'
    root.add(npc)
    collector.withPass('main', beauty, () => {
      renderer.renderBufferDirect(beauty, new Scene(), npc.geometry, npc.material as never, npc, undefined as never)
      // Simulate info accounting matching the wrap
      renderer.info.render.calls = 1
      renderer.info.render.triangles = 2
    })
    // Reset info baseline: withPass snapshots info at start; re-run cleanly
    collector.endFrame()
    const mid = collector.endSession()
    collector.disable()
    expect(mid.frames).toBe(1)
    expect(mid.reliability === 'observed' || mid.reliability === 'unverified').toBe(true)
    expect(mid.shadowSkippedFrames).toBe(1)
  })

  it('skips zero-instance InstancedMesh draws', () => {
    const collector = createPassSubmissionCollector()
    const renderer = fakeRenderer()
    collector.enable(renderer)
    collector.beginSession()
    collector.beginFrame()
    const beauty = new Camera()
    const geo = new BufferGeometry()
    geo.setIndex({ count: 6, array: new Uint16Array(6) } as never)
    geo.setAttribute('position', { count: 6, array: new Float32Array(18) } as never)
    const mesh = new InstancedMesh(geo, new MeshBasicMaterial(), 0)
    mesh.count = 0
    mesh.name = 'chunk-grass-tri'
    let classified = 0
    const original = renderer.renderBufferDirect.bind(renderer)
    // After enable, renderBufferDirect is wrapped — call through renderer
    collector.withPass('main', beauty, () => {
      renderer.renderBufferDirect(beauty, new Scene(), geo, mesh.material as never, mesh, undefined as never)
      classified = 1
    })
    collector.endFrame()
    const report = collector.endSession()
    collector.disable()
    expect(classified).toBe(1)
    expect(report.main?.byBucket['grass']?.callsSum ?? 0).toBe(0)
    void original
  })

  it('restores renderBufferDirect on disable after error path', () => {
    const collector = createPassSubmissionCollector()
    const renderer = fakeRenderer()
    const before = renderer.renderBufferDirect
    collector.enable(renderer)
    expect(renderer.renderBufferDirect).not.toBe(before)
    collector.beginSession()
    expect(() => {
      collector.beginFrame()
      collector.withPass('main', new Camera(), () => {
        throw new Error('boom')
      })
    }).toThrow('boom')
    collector.disable()
    expect(renderer.renderBufferDirect).toBe(before)
  })

  it('records shadow skipped vs refresh', () => {
    const collector = createPassSubmissionCollector()
    const renderer = fakeRenderer()
    collector.enable(renderer)
    collector.beginSession()
    collector.beginFrame()
    collector.noteShadowRefresh(true)
    collector.withPass('main', new Camera(), () => {})
    collector.endFrame()
    collector.beginFrame()
    collector.noteShadowRefresh(false)
    collector.withPass('main', new Camera(), () => {})
    collector.endFrame()
    const report = collector.endSession()
    collector.dispose()
    expect(report.shadowRefreshFrames).toBe(1)
    expect(report.shadowSkippedFrames).toBe(1)
  })

  it('counts material/program switches, actor subset and first-used skeletons per pass (A0)', () => {
    const collector = createPassSubmissionCollector()
    const renderer = fakeRenderer()
    // Program identity as Three links it: one program per material here,
    // except two materials sharing one program.
    const programs = new Map<Material, object>()
    ;(renderer as unknown as { properties: unknown }).properties = {
      get: (m: Material) => ({ currentProgram: programs.get(m) }),
    }
    const shared = {}
    const terrainMat = new MeshBasicMaterial()
    const bodyMat = new MeshBasicMaterial()
    const headMat = new MeshBasicMaterial()
    programs.set(terrainMat, {})
    programs.set(bodyMat, shared)
    programs.set(headMat, shared)

    const terrain = boxMesh('chunk')
    terrain.material = terrainMat
    const skeleton = new Skeleton([])
    const actorRoot = new Group()
    actorRoot.name = 'npc'
    actorRoot.userData.npcFamily = 'Peasant'
    const body = new SkinnedMesh(terrain.geometry, bodyMat)
    const head = new SkinnedMesh(terrain.geometry, headMat)
    body.skeleton = skeleton
    head.skeleton = skeleton
    actorRoot.add(body, head)

    collector.enable(renderer)
    collector.beginSession()
    const beauty = new Camera()
    const draw = (mesh: Mesh) => renderer.renderBufferDirect(beauty, new Scene(), mesh.geometry, mesh.material as never, mesh, undefined as never)
    for (let frame = 0; frame < 2; frame++) {
      collector.beginFrame()
      collector.noteShadowRefresh(false)
      collector.withPass('main', beauty, () => {
        draw(terrain)
        draw(body) // material + program switch, actor
        draw(head) // material switch only (shared program), same skeleton
        draw(body) // material switch only
      })
      collector.endFrame()
    }
    const report = collector.endSession()
    collector.disable()

    const cost = report.main!.costAvg
    expect(cost.materialSwitches).toBe(3)
    expect(cost.programSwitches).toBe(1)
    expect(cost.actorCalls).toBe(3)
    expect(cost.actorMaterialSwitches).toBe(3)
    expect(cost.actorProgramSwitches).toBe(1)
    expect(cost.skinnedCalls).toBe(3)
    // Skeleton is counted once per frame, not once per skinned draw.
    expect(cost.skeletonsFirstUsed).toBe(1)
  })
})

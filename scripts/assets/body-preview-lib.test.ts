// @vitest-environment node
import { type Document, NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'
// @ts-expect-error plain .mjs tooling module
import { addPreviewTargets, computeTarget, skinRestTransform, WARPS, warpSlim } from './body-preview-lib.mjs'
// @ts-expect-error plain .mjs tooling module
import { warpBody } from './body-warp.mjs'

const DIR = path.resolve(__dirname, '../../public/assets/characters')
let io: NodeIO
beforeAll(async () => {
  await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready])
  io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder })
})

const meshes = (doc: Document) => doc.getRoot().listMeshes()

describe('body preview generator', () => {
  it('reproduces the shipped Fat target from the rest-space contract (rest transform + units)', async () => {
    const doc = await io.read(path.join(DIR, 'Male_Peasant.glb'))
    let compared = 0
    for (const node of doc.getRoot().listNodes()) {
      const mesh = node.getMesh(); const skin = node.getSkin()
      if (!mesh || !skin) continue
      const rest = skinRestTransform(skin, node.getName())
      for (const prim of mesh.listPrimitives()) {
        const stored = prim.listTargets()[0]!.getAttribute('POSITION')!
        const { dp } = computeTarget(prim, rest, (p: number[]) => warpBody('Male', p))
        const v = [0, 0, 0]
        let maxErr = 0
        for (let i = 0; i < stored.getCount(); i++) {
          stored.getElement(i, v)
          for (let k = 0; k < 3; k++) maxErr = Math.max(maxErr, Math.abs(v[k]! - dp[i * 3 + k]!))
        }
        expect(maxErr).toBeLessThan(0.01) // shipped Fat is 11-bit quantized
        compared++
      }
    }
    expect(compared).toBeGreaterThan(0)
  })

  it('appends Slim, keeps the shipped Fat byte-for-byte, zero weights, base geometry untouched', async () => {
    const doc = await io.read(path.join(DIR, 'Female_Peasant.glb'))
    const before = meshes(doc).map((m) => m.listPrimitives().map((p) => ({
      pos: Array.from(p.getAttribute('POSITION')!.getArray()!),
      fat: Array.from(p.listTargets()[0]!.getAttribute('POSITION')!.getArray()!),
    })))
    addPreviewTargets(doc, 'Female', { fileLabel: 'test' })
    const again = addPreviewTargets(doc, 'Female', { fileLabel: 'test' })
    expect(again.every((r: { added: string[] }) => r.added.length === 0)).toBe(true) // idempotent
    meshes(doc).forEach((m, mi) => {
      expect(m.getExtras().targetNames).toEqual(['Fat', 'Slim'])
      expect(m.getWeights()).toEqual([0, 0])
      m.listPrimitives().forEach((p, pi) => {
        expect(Array.from(p.getAttribute('POSITION')!.getArray()!)).toEqual(before[mi]![pi]!.pos)
        expect(Array.from(p.listTargets()[0]!.getAttribute('POSITION')!.getArray()!)).toEqual(before[mi]![pi]!.fat)
        const slim = p.listTargets()[1]!
        const d = slim.getAttribute('POSITION')!.getArray()!
        expect(d.every(Number.isFinite)).toBe(true)
        expect(slim.getAttribute('NORMAL')).toBeTruthy()
      })
    })
  })

  it('adds both targets to authored bodies that have no Fat and survives a meshopt round trip', async () => {
    const doc = await io.read(path.join(DIR, 'Male_Farmer.glb'))
    const rep = addPreviewTargets(doc, 'Male', { fileLabel: 'Male_Farmer' })
    expect(rep.every((r: { targets: string[] }) => r.targets.join() === 'Fat,Slim')).toBe(true)
    doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER })
    const back = await io.readBinary(await io.writeBinary(doc))
    expect(meshes(back)[0]!.listPrimitives()[0]!.listTargets()).toHaveLength(2)
    // Names must survive the writer (it regenerates extras.targetNames from target names).
    for (const m of meshes(back)) expect(m.getExtras().targetNames).toEqual(['Fat', 'Slim'])
  })

  it('Slim narrows the torso/arms/thighs and leaves head, hands and feet in place', () => {
    for (const sex of ['Male', 'Female'] as const) {
      const w = (p: number[]) => warpSlim(sex, p)
      const waist = w([0.2, 1.2, 0.1])
      expect(waist[0]).toBeLessThan(0.2)
      expect(w([0.2, 1.2, 0.1])[2]).toBeLessThan(0.1)
      const near = (a: number[], b: number[]) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i]!, 9))
      near(w([0.05, 1.7, 0]), [0.05, 1.7, 0])
      near(w([0.1, 0.05, 0.1]), [0.1, 0.05, 0.1])
      expect(Math.abs(w([0.7, 1.455, 0])[1] - 1.455)).toBeLessThan(1e-9) // hand on the arm axis
      const thigh = w([0.16, 0.7, 0.08])
      expect(thigh[0]).toBeLessThan(0.16)
    }
    expect(WARPS.Slim).toBe(warpSlim)
  })
})

import {
  CanvasTexture,
  DataTexture,
  type Object3D,
  RGBAFormat,
  Sprite,
  SpriteMaterial,
  type Texture,
} from 'three'
import type { LastKnownContact, SightBillboardVariant } from '../simulation/playerSightContacts'
import { AGENT_RENDER_LAYER } from '../world/waterMirror'

/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — pooled grey-silhouette sprites marking where the
 *  player last saw a now-concealed actor. Presentation only; reads the
 *  contact list from `playerSightContacts`.
 */

export type LastKnownBillboards = {
  sync: (contacts: readonly LastKnownContact[]) => void
  dispose: () => void
}

const VARIANTS: readonly SightBillboardVariant[] = ['human', 'largeAnimal', 'smallAnimal']
const SIZE: Record<SightBillboardVariant, readonly [number, number]> = {
  human: [0.75, 1.8],
  largeAnimal: [1.7, 1.25],
  smallAnimal: [0.6, 0.45],
}
const CELL = 128

function drawAtlas(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, CELL * 3, CELL)
  ctx.fillStyle = '#6b6b6b'
  ctx.filter = 'blur(2px)'
  const ell = (cx: number, cy: number, rx: number, ry: number): void => {
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  // Cell 0: human standing
  ell(64, 20, 12, 13)
  ctx.beginPath()
  ctx.roundRect(42, 36, 44, 44, 10)
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(48, 76, 15, 48, 5)
  ctx.roundRect(65, 76, 15, 48, 5)
  ctx.fill()
  // Cell 1: large quadruped, facing right
  const o1 = CELL
  ell(o1 + 60, 58, 36, 20)
  ctx.beginPath()
  ctx.moveTo(o1 + 86, 48)
  ctx.lineTo(o1 + 108, 26)
  ctx.lineTo(o1 + 122, 34)
  ctx.lineTo(o1 + 94, 70)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(o1 + 30, 64, 8, 50, 3)
  ctx.roundRect(o1 + 44, 64, 8, 50, 3)
  ctx.roundRect(o1 + 72, 64, 8, 50, 3)
  ctx.roundRect(o1 + 86, 64, 8, 50, 3)
  ctx.fill()
  // Cell 2: small crouched animal
  const o2 = CELL * 2
  ell(o2 + 56, 88, 30, 22)
  ell(o2 + 92, 76, 14, 13)
  ctx.beginPath()
  ctx.ellipse(o2 + 92, 52, 5, 17, 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.filter = 'none'
}

function createAtlasSource(): CanvasTexture | DataTexture {
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas')
    canvas.width = CELL * 3
    canvas.height = CELL
    const ctx = canvas.getContext('2d')
    if (ctx) {
      drawAtlas(ctx)
      return new CanvasTexture(canvas)
    }
  }
  const t = new DataTexture(new Uint8Array([107, 107, 107, 255]), 1, 1, RGBAFormat)
  t.needsUpdate = true
  return t
}

/** Creates the shared atlas + materials once; sprites are pooled under `parent`. */
export function createLastKnownBillboards(parent: Object3D): LastKnownBillboards {
  const source = createAtlasSource()
  const isAtlas = source instanceof CanvasTexture
  const textures: Texture[] = [source]
  const materials = new Map<SightBillboardVariant, SpriteMaterial>()
  VARIANTS.forEach((v, i) => {
    const tex = isAtlas ? source.clone() : source
    if (isAtlas) {
      tex.repeat.set(1 / 3, 1)
      tex.offset.set(i / 3, 0)
      tex.needsUpdate = true
      textures.push(tex)
    }
    materials.set(v, new SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 0.3,
      depthTest: true,
      depthWrite: false,
    }))
  })
  const pool: Sprite[] = []
  const shown: (LastKnownContact | null)[] = []
  let lastSet: readonly LastKnownContact[] | null = null

  const sync = (contacts: readonly LastKnownContact[]): void => {
    if (contacts === lastSet) return
    lastSet = contacts
    for (let i = 0; i < contacts.length; i++) {
      const c = contacts[i]!
      let s = pool[i]
      if (!s) {
        s = new Sprite(materials.get(c.variant))
        s.center.set(0.5, 0)
        s.renderOrder = 2
        s.layers.set(AGENT_RENDER_LAYER)
        s.castShadow = false
        parent.add(s)
        pool.push(s)
        shown.push(null)
      }
      const prev = shown[i]
      if (prev?.variant !== c.variant) {
        s.material = materials.get(c.variant)!
        const [w, h] = SIZE[c.variant]
        s.scale.set(w, h, 1)
      }
      s.position.set(c.x, c.y, c.z)
      s.visible = true
      shown[i] = c
    }
    for (let i = contacts.length; i < pool.length; i++) {
      pool[i]!.visible = false
      shown[i] = null
    }
  }

  return {
    sync,
    dispose() {
      for (const s of pool) s.removeFromParent()
      pool.length = 0
      shown.length = 0
      lastSet = null
      for (const m of materials.values()) m.dispose()
      for (const t of textures) t.dispose()
    },
  }
}

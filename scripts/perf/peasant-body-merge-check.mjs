// Fixed-pose WebGL correctness diagnostic. Never invokes the benchmark harness.
// Open /scripts/perf/peasant-body-merge-check.html on the Vite server.
/* global document, window, ImageData, setTimeout, __GIT_COMMIT_FULL__, URL, Blob */
import * as THREE from 'three'
import { prepareProp } from '../../src/assets/loadGltf.ts'
import { applyClothingHue, applyHairColor, cloneOutfitMaterials, fixOutfitMeshDarkness } from '../../src/assets/ubcOutfitMaterials.ts'
import { assembleCharacter } from '../../src/characters/assembleCharacter.ts'
import { mergePeasantBody } from '../../src/characters/mergePeasantBody.ts'
import { installActorCullBounds } from '../../src/render/actorCullBounds.ts'

const size = 512
const renderer = new THREE.WebGLRenderer({ antialias: false })
renderer.setSize(size, size)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.info.autoReset = false
const target = new THREE.WebGLRenderTarget(size, size)
// These pixels are shown in ordinary 2D canvases; encode them as display sRGB.
target.texture.colorSpace = THREE.SRGBColorSpace
const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 30)
camera.position.set(2, 1.7, 3.5)
camera.lookAt(0, 0.9, 0)
const canvases = ['A original', 'B merged', 'Difference ×16'].map((label) => {
  const figure = document.createElement('figure')
  const caption = document.createElement('figcaption')
  caption.textContent = label
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  figure.append(caption, canvas)
  document.querySelector('#pictures').append(figure)
  return canvas
})
const clips = ['Idle_Loop', 'Walk_Loop', 'Sprint_Loop', 'Sword_Attack', 'Interact', 'Sitting_Idle_Loop', 'Fixing_Kneeling', 'Death01']
const actors = {}
const results = []
const contactSheet = document.createElement('canvas')
contactSheet.width = 1536
contactSheet.height = 9152
const contactContext = contactSheet.getContext('2d')
const errors = []
window.addEventListener('error', (event) => errors.push(event.message))

async function build(sex, merge) {
  const kit = { sex, outfit: 'Peasant', head: 'Base', hair: 'Long', beard: sex === 'Male', garments: sex === 'Female' ? ['NobleBodice', 'WorkSkirt'] : [], clothTint: null }
  const assembled = await assembleCharacter(kit)
  if (assembled.warnings.length) throw new Error(assembled.warnings.join('; '))
  const root = assembled.scene
  cloneOutfitMaterials(root)
  root.traverse(fixOutfitMeshDarkness)
  applyClothingHue(root, 0x9a7965)
  applyHairColor(root, 0x775533)
  const mergeResult = merge ? mergePeasantBody(root, kit, assembled.bodySkinned, assembled.animations) : null
  if (merge && !mergeResult.merged) throw new Error(JSON.stringify(mergeResult))
  prepareProp(root, 1.8)
  const wrapper = new THREE.Group()
  wrapper.add(root)
  installActorCullBounds(wrapper)
  const body = new Set(assembled.bodySkinned.filter((m) => m.parent))
  root.traverse((mesh) => { if (mesh.geometry?.userData.peasantBodyMerge) body.add(mesh) })
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x4b5668)
  scene.add(wrapper, new THREE.AmbientLight(0xffffff, 1))
  const sun = new THREE.DirectionalLight(0xffffff, 2.5)
  sun.position.set(3, 5, 4)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = sun.shadow.camera.bottom = -3
  sun.shadow.camera.right = sun.shadow.camera.top = 3
  sun.shadow.camera.far = 15
  scene.add(sun)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshStandardMaterial({ color: 0x73826a }))
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)
  return { ...assembled, scene, root, wrapper, body, mixer: new THREE.AnimationMixer(root), mergeResult }
}
function render(actor, clipName, fat, time, rear) {
  actor.mixer.stopAllAction()
  const clip = actor.animations.find((c) => c.name === clipName)
  const action = actor.mixer.clipAction(clip).setLoop(THREE.LoopOnce, 1).play()
  action.clampWhenFinished = true
  actor.mixer.setTime(clip.duration * time)
  for (const mesh of actor.body) if (mesh.morphTargetInfluences) mesh.morphTargetInfluences[0] = fat
  camera.position.set(rear ? -2 : 2, 1.7, rear ? -3.5 : 3.5)
  camera.lookAt(0, 0.9, 0)
  const calls = { main: 0, shadow: 0, bodyMain: 0, bodyShadow: 0, mainTriangles: 0, shadowTriangles: 0 }
  const original = renderer.renderBufferDirect
  renderer.renderBufferDirect = function (cam, scene, geometry, material, object, group) {
    const pass = cam === camera ? 'main' : 'shadow'
    calls[pass]++
    calls[`${pass}Triangles`] += (group?.count ?? geometry.index?.count ?? geometry.attributes.position.count) / 3
    if (actor.body.has(object)) calls[pass === 'main' ? 'bodyMain' : 'bodyShadow']++
    return original.call(this, cam, scene, geometry, material, object, group)
  }
  renderer.info.reset()
  renderer.setRenderTarget(target)
  renderer.shadowMap.needsUpdate = true
  try { renderer.render(actor.scene, camera) } finally { renderer.renderBufferDirect = original }
  const pixels = new Uint8Array(size * size * 4)
  renderer.readRenderTargetPixels(target, 0, 0, size, size, pixels)
  return { pixels, calls, infoCalls: renderer.info.render.calls }
}
function showPixels(canvas, pixels) {
  const flipped = new Uint8ClampedArray(pixels.length)
  for (let y = 0; y < size; y++) flipped.set(pixels.subarray(y * size * 4, (y + 1) * size * 4), (size - y - 1) * size * 4)
  canvas.getContext('2d').putImageData(new ImageData(flipped, size, size), 0, 0)
}
function compare(sex, clip, fat, time, rear, display = false) {
  const a = render(actors[sex][0], clip, fat, time, rear)
  const b = render(actors[sex][1], clip, fat, time, rear)
  const diff = new Uint8Array(a.pixels.length)
  let changedPixels = 0, maxChannel = 0, sum = 0
  for (let i = 0; i < diff.length; i += 4) {
    let changed = false
    for (let c = 0; c < 3; c++) {
      const delta = Math.abs(a.pixels[i + c] - b.pixels[i + c])
      maxChannel = Math.max(maxChannel, delta)
      sum += delta
      changed ||= delta > 0
      diff[i + c] = Math.min(255, delta * 16)
    }
    diff[i + 3] = 255
    if (changed) changedPixels++
  }
  const row = { sex, clip, fat, time, rear, a: a.calls, b: b.calls, infoA: a.infoCalls, infoB: b.infoCalls, maxChannel, meanChannel: sum / (size * size * 3), changedPixels }
  if (display) { showPixels(canvases[0], a.pixels); showPixels(canvases[1], b.pixels); showPixels(canvases[2], diff) }
  return row
}
try {
  for (const sex of ['Male', 'Female']) {
    actors[sex] = [await build(sex, false), await build(sex, true)]
    for (const clip of clips) for (const fat of [0, 1]) for (const rear of [false, true]) {
      results.push(compare(sex, clip, fat, clip === 'Death01' ? 1 : 0.5, rear, true))
      const index = results.length - 1
      const x = index % 2 * 768, y = Math.floor(index / 2) * 286
      contactContext.fillStyle = '#20252c'
      contactContext.fillRect(x, y, 768, 286)
      contactContext.fillStyle = 'white'
      contactContext.font = '14px sans-serif'
      contactContext.fillText(`${sex} ${clip} Fat=${fat} ${rear ? 'rear' : 'front'} | A / B / difference x16`, x + 8, y + 20)
      canvases.forEach((canvas, i) => contactContext.drawImage(canvas, x + i * 256, y + 30, 256, 256))
      document.querySelector('#status').textContent = `Checked ${results.length}/64 fixed poses…`
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
    for (const clip of clips) {
      const button = document.createElement('button')
      button.textContent = `${sex} ${clip}`
      button.onclick = () => { document.querySelector('#status').textContent = JSON.stringify(compare(sex, clip, 0, 0.5, false, true), null, 2) }
      document.querySelector('#controls').append(button)
    }
  }
  const gl = renderer.getContext()
  const ext = gl.getExtension('WEBGL_debug_renderer_info')
  window.__peasantBodyCheck = { kind: 'correctness-only, NOT benchmark', gitSha: __GIT_COMMIT_FULL__, device: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown', size, colorSpace: target.texture.colorSpace, results, errors, glError: gl.getError() }
  document.querySelector('#status').textContent = JSON.stringify(window.__peasantBodyCheck, null, 2)
  compare('Female', 'Walk_Loop', 0, 0.5, false, true)
  const download = document.createElement('button')
  download.textContent = 'Export correctness JSON'
  download.onclick = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(window.__peasantBodyCheck, null, 2)], { type: 'application/json' }))
    a.download = '2026-10-29--peasant-body-webgl-correctness.json'
    a.click()
  }
  document.querySelector('#controls').prepend(download)
  const images = document.createElement('button')
  images.textContent = 'Export 64-pose contact sheet'
  images.onclick = () => contactSheet.toBlob((blob) => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = '2026-10-29--peasant-body-merge-contact-sheet.png'
    a.click()
  })
  document.querySelector('#controls').prepend(images)
} catch (error) { document.querySelector('#status').textContent = error.stack; window.__peasantBodyCheckError = error.stack }

/* eslint-disable no-empty */
/* eslint-disable no-undef */
// Usage: node scripts/tools/settlement-shot.mjs <vitePort> <seed> <out.png> [--agl N] [--fov D] [--keep trees,fog] [--hour H] [--size 1600] [--timeout SEC]
// Plan tools-024: north-up, straight-down PNG of the home settlement (?fly&flyPose=home&flyTop).
// Drives native Chrome over CDP (fresh profile, same WSL d3d12 flags as scripts/perf/run-benchmark-series.mjs).
// Exits non-zero (no PNG written) on timeout or software rasterizer.
import { execSync, spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

const args = process.argv.slice(2)
const positional = []
const opts = {}
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) opts[args[i].slice(2)] = args[++i]
  else positional.push(args[i])
}
const [port, seed, out] = positional
if (!port || !seed || !out) {
  console.error('Usage: node scripts/tools/settlement-shot.mjs <vitePort> <seed> <out.png> [--agl N] [--fov D] [--keep trees,fog] [--hour H] [--size 1600] [--timeout SEC]')
  process.exit(2)
}
const size = Number(opts.size ?? 1600)
const timeoutMs = Number(opts.timeout ?? 180) * 1000
const IS_WIN = process.platform === 'win32'
const CHROME = process.env.SEEDVALE_CHROME ?? (IS_WIN ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/usr/bin/google-chrome')
const DEBUG = Number(process.env.SEEDVALE_CDP_PORT ?? 9334)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const disabled = ['npcs', 'animals', 'weather', 'grass', 'playerModel']
const keep = (opts.keep ?? '').split(',')
if (!keep.includes('trees')) disabled.push('trees')
if (!keep.includes('fog')) disabled.push('fog')
const pose = opts.agl ? `home,${opts.agl}` : 'home'
const query = `seed=${seed}&fly&flyPose=${pose}&flyTop&hour=${opts.hour ?? 12}${opts.fov ? `&flyFov=${opts.fov}` : ''}&debugDisableSystems=${disabled.join(',')}`
const url = `http://localhost:${port}/?${query}`
let sha = 'unknown'
try { sha = execSync('git rev-parse --short HEAD').toString().trim() } catch {}

async function cdpConnect() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${DEBUG}/json`)).json()
      const page = list.find((t) => t.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch {}
    await sleep(500)
  }
  throw new Error('no CDP page')
}

function cdp(ws) {
  let id = 0
  const pending = new Map()
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data)
    if (d.id && pending.has(d.id)) {
      pending.get(d.id)(d)
      pending.delete(d.id)
    }
  }
  return (method, params = {}) =>
    new Promise((res, rej) => {
      const i = ++id
      pending.set(i, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result)))
      ws.send(JSON.stringify({ id: i, method, params }))
    })
}

const profile = mkdtempSync(join(tmpdir(), 'sv-shot-'))
const chrome = spawn(CHROME, [
  `--remote-debugging-port=${DEBUG}`, `--user-data-dir=${profile}`, '--no-first-run',
  '--no-default-browser-check', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', `--window-size=${size},${size + 200}`, '--window-position=0,0',
  ...(IS_WIN ? [] : ['--ignore-gpu-blocklist', '--password-store=basic', '--simulate-outdated-no-au=Tue, 31 Dec 2099 23:59:59 GMT']), 'about:blank',
], { stdio: 'ignore', env: IS_WIN ? process.env : { GALLIUM_DRIVER: 'd3d12', ...process.env } })

let code = 0
try {
  const ws = new WebSocket(await cdpConnect())
  await new Promise((r) => (ws.onopen = r))
  const send = cdp(ws)
  const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result.value
  await send('Page.bringToFront')
  // Exact square viewport regardless of window chrome.
  await send('Emulation.setDeviceMetricsOverride', { width: size, height: size, deviceScaleFactor: 1, mobile: false })
  await send('Page.navigate', { url })
  if (!IS_WIN) {
    const renderer = await ev('(() => { const g = document.createElement(\'canvas\').getContext(\'webgl2\'); const e = g && g.getExtension(\'WEBGL_debug_renderer_info\'); return e ? String(g.getParameter(e.UNMASKED_RENDERER_WEBGL)) : \'\' })()')
    if (!/D3D12/i.test(renderer) || /llvmpipe|SwiftShader|softpipe/i.test(renderer)) {
      throw new Error(`WSL renderer is not hardware D3D12: "${renderer}"`)
    }
  }
  const t0 = Date.now()
  let ready = false
  while (Date.now() - t0 < timeoutMs) {
    await sleep(1000)
    try {
      if (await ev('typeof window.__seedvaleFlyShotReady === "function" && window.__seedvaleFlyShotReady()')) { ready = true; break }
    } catch {}
  }
  if (!ready) {
    let diag = ''
    try { diag = await ev('JSON.stringify({ ready: window.__seedvaleReady, hook: typeof window.__seedvaleFlyShotReady, info: window.__seedvaleFlyShotInfo && window.__seedvaleFlyShotInfo() })') } catch {}
    throw new Error(`timeout (${timeoutMs / 1000}s) waiting for __seedvaleFlyShotReady() ${diag}`)
  }
  // Hide everything except the WebGL canvas.
  // Walk from the largest canvas up to <body>, hiding every sibling on the way (HUD, labels, overlays).
  const hidden = await ev(`(() => {
    const canvases = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)
    const canvas = canvases[0]
    if (!canvas) return -1
    let n = 0
    for (let el = canvas; el && el !== document.body; el = el.parentElement) {
      for (const sib of el.parentElement.children) {
        if (sib !== el) { sib.style.setProperty('display', 'none', 'important'); n++ }
      }
    }
    return n
  })()`)
  if (hidden < 0) throw new Error('no canvas found')
  await sleep(1500) // a few presented frames without UI
  const info = JSON.parse(await ev('JSON.stringify(window.__seedvaleFlyShotInfo())'))
  if (!(await ev('typeof window.__seedvaleFlyShotReady === "function" && window.__seedvaleFlyShotReady()'))) throw new Error('world became unsettled again before capture')
  const shot = await send('Page.captureScreenshot', { format: 'png' })
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, Buffer.from(shot.data, 'base64'))
  console.log(`seed=${seed} sha=${sha} url=${url}`)
  console.log(`home x=${info.homeX.toFixed(1)} z=${info.homeZ.toFixed(1)} camera y=${info.cameraY.toFixed(1)} agl=${info.agl.toFixed(1)} fov=${info.fov}`)
  console.log(`wrote ${out}`)
} catch (e) {
  console.error(`settlement-shot failed: ${e.message}`)
  code = 1
} finally {
  chrome.kill()
  await sleep(500)
  try { rmSync(profile, { recursive: true, force: true }) } catch {}
}
process.exit(code)

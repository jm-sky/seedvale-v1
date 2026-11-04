/* eslint-disable no-empty */
/* eslint-disable no-undef */
// tools-026 D7 — cost + workload baseline (boot side). WSL/Linux only, production build served by `vite preview`.
// Usage: node scripts/perf/measure-cost-baseline.mjs <previewPort> <outFile.json> <seed> <cold|warm> <reps>
//   cold = fresh Chrome profile per rep, ?worldgenFixture=0 (no fixture, empty caches)
//   warm = one fresh profile; rep 0 primes the caches (discarded), reps 1..N reload the same profile
// Captures: [BootMark] console lines (ms), navigation → __seedvaleReady, JS heap peak (sampled), worker count.
// No FPS claims; no src/ edits. Labels every sample with platform, SHA, seed, cache state.
import { execSync, spawn } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [, , port, outFile, seed, mode, repsArg] = process.argv
const REPS = Number(repsArg ?? 3)
const CHROME = process.env.SEEDVALE_CHROME ?? '/usr/bin/google-chrome'
const DEBUG = 9334
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const sha = execSync('git rev-parse HEAD').toString().trim()

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

function launch(profile) {
  return spawn(CHROME, [
    `--remote-debugging-port=${DEBUG}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
    '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling',
    '--window-size=1600,900', '--ignore-gpu-blocklist', '--password-store=basic',
    '--simulate-outdated-no-au=Tue, 31 Dec 2099 23:59:59 GMT', 'about:blank',
  ], { stdio: 'ignore', env: { GALLIUM_DRIVER: 'd3d12', ...process.env } })
}

async function sample(ws, url, label) {
  let id = 0
  const pending = new Map()
  const marks = {}
  const workers = new Set()
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data)
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) }
    if (d.method === 'Runtime.consoleAPICalled' && !d.sessionId) {
      const t = d.params.args?.[0]?.value
      const mm = typeof t === 'string' && t.match(/^\[BootMark\]\[([^\]]*)\] (.+): (\d+) ms$/)
      if (mm) marks[`${mm[1]}/${mm[2]}`] = Number(mm[3])
    }
    if (d.method === 'Target.attachedToTarget' && d.params.targetInfo.type === 'worker') workers.add(d.params.targetInfo.targetId)
  }
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })) })
  const ev = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result?.result?.value
  await send('Runtime.enable'); await send('Performance.enable')
  await send('Target.setAutoAttach', { autoAttach: true, waitForDebuggerOnStart: false, flatten: true })
  await send('Page.navigate', { url })
  // New-game menu: wait for the "Rozpocznij" button, then time click → __seedvaleReady (menu itself is not boot cost).
  for (let i = 0; i < 60; i++) {
    if (await ev(`(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Rozpocznij/.test(x.textContent));if(b){b.click();return true}return false})()`)) break
    await sleep(500)
  }
  const t0 = Date.now()
  let heapPeak = 0, ready = null
  while (Date.now() - t0 < 5 * 60_000) {
    await sleep(500)
    try {
      const m = (await send('Performance.getMetrics')).result?.metrics ?? []
      const heap = m.find((x) => x.name === 'JSHeapUsedSize')?.value ?? 0
      heapPeak = Math.max(heapPeak, heap)
      if (await ev('window.__seedvaleReady === true')) { ready = Date.now() - t0; break }
    } catch {}
  }
  const renderer = await ev("(()=>{const g=document.createElement('canvas').getContext('webgl2');const e=g&&g.getExtension('WEBGL_debug_renderer_info');return e?String(g.getParameter(e.UNMASKED_RENDERER_WEBGL)):'?'})()")
  const nav = await ev('JSON.stringify(performance.getEntriesByType("navigation")[0]?.toJSON?.() ?? null)')
  return { label, readyMs: ready, heapPeakMiB: +(heapPeak / 1048576).toFixed(1), workers: workers.size, marks, renderer, nav: nav && JSON.parse(nav) }
}

const url = `http://localhost:${port}/?bootMark=1&seed=${seed}${mode === 'cold' ? '&worldgenFixture=0' : ''}`
const results = []
if (mode === 'cold') {
  for (let r = 0; r < REPS; r++) {
    const profile = mkdtempSync(join(tmpdir(), 'sv-cost-'))
    const chrome = launch(profile)
    try {
      const ws = new WebSocket(await cdpConnect()); await new Promise((x) => (ws.onopen = x))
      results.push(await sample(ws, url, `cold#${r}`)); console.log('done', results.at(-1).label, results.at(-1).readyMs)
    } finally { chrome.kill(); await sleep(2000); rmSync(profile, { recursive: true, force: true }) }
  }
} else {
  const profile = mkdtempSync(join(tmpdir(), 'sv-cost-'))
  for (let r = 0; r <= REPS; r++) {
    const chrome = launch(profile)
    try {
      const ws = new WebSocket(await cdpConnect()); await new Promise((x) => (ws.onopen = x))
      const s = await sample(ws, url, r === 0 ? 'warm-prime(discarded)' : `warm#${r}`)
      if (r > 0) results.push(s)
      console.log('done', s.label, s.readyMs)
      await sleep(3000) // let IndexedDB/cache writes flush before the browser is killed
    } finally { chrome.kill(); await sleep(2000) }
  }
  rmSync(profile, { recursive: true, force: true })
}
writeFileSync(outFile, JSON.stringify({ tool: 'measure-cost-baseline', platform: 'wsl', sha, seed, mode, url, node: process.version, samples: results }, null, 2))

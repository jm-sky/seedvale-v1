/* eslint-disable no-empty */
/* eslint-disable no-undef */
// Usage: node scripts/perf/run-benchmark-series.mjs <vitePort> <outDir> <tag> <reps> <cooldownSec> <scenario...>  (artifacts: json/raw/md/meta per rep)
// Drives native Chrome via CDP: fresh profile per rep, ?benchmark=<id> auto-run, saves artifact bundle.
import { execSync, spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [, , port, outDir, tag, reps, cooldownSec, ...scenarios] = process.argv
const IS_WIN = process.platform === 'win32'
// Platform label kept in every artifact: Windows Chrome = ANGLE D3D11, WSL2 Chrome = OpenGL (Mesa/D3D12).
// Never compare numbers across platforms (runbook "Parallel WSL2 baseline").
const PLATFORM = IS_WIN ? 'windows' : 'wsl'
const CHROME = process.env.SEEDVALE_CHROME ?? (IS_WIN ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/usr/bin/google-chrome')
const DEBUG = 9333
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
mkdirSync(outDir, { recursive: true })
const REPO = process.env.SEEDVALE_REPO ?? (IS_WIN ? 'D:/Projekty/private/seedvale-v1' : process.cwd())
const expectedSha = execSync('git rev-parse HEAD', { cwd: REPO }).toString().trim()
console.log('expected SHA', expectedSha)

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

function evaluator(ws) {
  let id = 0
  const pending = new Map()
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data)
    if (d.id && pending.has(d.id)) {
      pending.get(d.id)(d)
      pending.delete(d.id)
    }
  }
  return (expression) =>
    new Promise((res, rej) => {
      const i = ++id
      pending.set(i, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result.result.value)))
      ws.send(JSON.stringify({ id: i, method: 'Runtime.evaluate', params: { expression, returnByValue: true } }))
    })
}

async function runOne(scenario, rep) {
  const profile = mkdtempSync(join(tmpdir(), 'sv-bench-'))
  const url = `http://localhost:${port}/?benchmark=${scenario}${process.env.SEEDVALE_QUERY ?? ''}` // e.g. SEEDVALE_QUERY='&skelShare=0'
  const chrome = spawn(CHROME, [
    `--remote-debugging-port=${DEBUG}`, `--user-data-dir=${profile}`, '--no-first-run',
    '--no-default-browser-check', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--window-size=1600,900', '--window-position=0,0',
    // WSL2: Mesa defaults to llvmpipe (software); d3d12 reaches the real GPU through /dev/dxg.
    // WSL2: no GNOME keyring prompt ("Choose password for new keyring" blocks the page, Q18) and
    // no "Can't update Chrome" infobar changing the viewport.
    ...(IS_WIN ? [] : ['--ignore-gpu-blocklist', '--password-store=basic', "--simulate-outdated-no-au=Tue, 31 Dec 2099 23:59:59 GMT"]), url,
  ], { stdio: 'ignore', env: IS_WIN ? process.env : { GALLIUM_DRIVER: 'd3d12', ...process.env } })
  try {
    const ws = new WebSocket(await cdpConnect())
    await new Promise((r) => (ws.onopen = r))
    const ev = evaluator(ws)
    ws.send(JSON.stringify({ id: 9999, method: 'Page.bringToFront' }))
    if (!IS_WIN) {
      // A WSL run on a software rasterizer is not a WSL-baseline run (Q18: Mesa
      // falls back to llvmpipe when GALLIUM_DRIVER=d3d12 does not take). Abort early.
      const renderer = await ev(`(() => { const g = document.createElement('canvas').getContext('webgl2'); const e = g && g.getExtension('WEBGL_debug_renderer_info'); return e ? String(g.getParameter(e.UNMASKED_RENDERER_WEBGL)) : '' })()`)
      if (!/D3D12/i.test(renderer) || /llvmpipe|SwiftShader|softpipe/i.test(renderer)) {
        throw new Error(`WSL renderer is not hardware D3D12: "${renderer}" — check GALLIUM_DRIVER=d3d12 / chrome://gpu`)
      }
    }
    const t0 = Date.now()
    let done = false
    while (Date.now() - t0 < 6 * 60_000) {
      await sleep(3000)
      try {
        if (await ev('!!window.__seedvalePerfLastArtifacts')) { done = true; break }
      } catch {}
    }
    if (!done) throw new Error('timeout waiting for benchmark')
    const json = await ev('JSON.stringify(window.__seedvalePerfLastArtifacts)')
    const b = JSON.parse(json)
    const gpu = b.report.context.device?.gpu ?? b.report.context.device?.renderer ?? JSON.stringify(b.report.context.device ?? {}).slice(0, 200)
    const sha = b.meta.gitSha
    // Vite dev embeds the SHA at server start but serves the working tree from disk, so the
    // served *code* is HEAD (+ any uncommitted runtime edits) even when the label is stale.
    // A mismatch is a warning, never a lost run: the artifact records what was really served.
    // SEEDVALE_STRICT_SHA=1 restores the old hard failure on a runtime-path diff.
    const RUNTIME_PATHS = 'src public index.html vite.config.ts package.json pnpm-lock.yaml'
    let dirty = ''
    try { dirty = execSync(`git status --porcelain -- ${RUNTIME_PATHS}`, { cwd: REPO }).toString().trim() } catch {}
    if (dirty !== '') {
      b.meta.dirtyRuntimePaths = dirty.split('\n').map((l) => l.trim())
      console.log(`WARN uncommitted runtime changes were served: ${dirty.replace(/\n/g, ', ').slice(0, 200)}`)
    }
    if (sha !== expectedSha) {
      let runtimeDiff = 'unknown'
      try { runtimeDiff = execSync(`git diff --name-only ${sha} ${expectedSha} -- ${RUNTIME_PATHS}`, { cwd: REPO }).toString().trim() } catch {}
      if (runtimeDiff !== '' && process.env.SEEDVALE_STRICT_SHA === '1') throw new Error(`SHA mismatch ${sha} vs ${expectedSha}; runtime diff: ${runtimeDiff.slice(0, 200)}`)
      b.meta.servedSha = expectedSha
      b.meta.shaNote = runtimeDiff === ''
        ? `label ${sha}, HEAD ${expectedSha}; no runtime-path diff`
        : `label ${sha} is stale (Vite started before a runtime commit); code served from HEAD ${expectedSha} working tree; runtime diff: ${runtimeDiff.replace(/\n/g, ', ').slice(0, 300)}`
      console.log(`WARN served SHA label ${sha.slice(0, 8)} != HEAD ${expectedSha.slice(0, 8)} (${runtimeDiff === '' ? 'no runtime diff' : 'runtime diff; label stale, restart Vite to silence'}) — run kept`)
    }
    if (process.env.SEEDVALE_EVAL) b.meta.evalAfter = await ev(process.env.SEEDVALE_EVAL) // e.g. JSON.stringify(window.__seedvaleSkeletonStats())
    b.meta.platform = PLATFORM
    b.meta.hardwareClass = IS_WIN && /Arc/i.test(JSON.stringify(b.report.context.device ?? {})) ? 'target-gpu' : PLATFORM === 'wsl' ? 'wsl-baseline' : 'diagnostic'
    b.meta.notes = `benchmark series ${tag} rep${rep}; ${IS_WIN ? 'native Windows' : 'WSL2'} Chrome headed, fresh profile, ${cooldownSec}s cooldown${process.env.SEEDVALE_QUERY ? `, query ${process.env.SEEDVALE_QUERY}` : ''}`
    const base = join(outDir, `${tag}-${scenario}-rep${rep}`)
    writeFileSync(`${base}.json`, JSON.stringify(b.report, null, 2))
    if (b.raw) writeFileSync(`${base}.raw.json`, JSON.stringify(b.raw))
    writeFileSync(`${base}.md`, b.markdown)
    writeFileSync(`${base}.meta.json`, JSON.stringify(b.meta, null, 2))
    const r = b.report
    console.log(`OK ${scenario} rep${rep} sha=${sha.slice(0, 8)} fps=${r.fps?.avg} p95=${r.frameTime?.p95} draws=${r.rendering?.drawCallsAvg} npc=${r.context?.npcCount} gpu=${String(gpu).slice(0, 60)}`)
    // Graceful close first: SIGTERM during an in-flight GPU op shows up in WSL as
    // dxgkrnl `wait_for_completion failed` / `Ioctl failed: -512` (Q18).
    try { ws.send(JSON.stringify({ id: 9998, method: 'Browser.close' })) } catch {}
    await sleep(3000)
    ws.close()
  } finally {
    chrome.kill()
    if (IS_WIN) { try { execSync(`taskkill /F /T /PID ${chrome.pid}`, { stdio: 'ignore' }) } catch {} }
    await sleep(3000)
    try { rmSync(profile, { recursive: true, force: true }) } catch {}
  }
}

for (const sc of scenarios) {
  for (let rep = 1; rep <= Number(reps); rep++) {
    console.log(`--- ${sc} rep${rep} start ${new Date().toISOString()}`)
    try { await runOne(sc, rep) } catch (e) { console.log(`FAIL ${sc} rep${rep}: ${e.message}`) }
    console.log(`cooldown ${cooldownSec}s`)
    await sleep(Number(cooldownSec) * 1000)
  }
}
console.log('ALL DONE')

// Usage: node scripts/perf/run-benchmark-series.mjs <vitePort> <outDir> <tag> <reps> <cooldownSec> <scenario...>  (artifacts: json/raw/md/meta per rep)
// Drives native Chrome via CDP: fresh profile per rep, ?benchmark=<id> auto-run, saves artifact bundle.
import { spawn, execSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [, , port, outDir, tag, reps, cooldownSec, ...scenarios] = process.argv
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const DEBUG = 9333
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
mkdirSync(outDir, { recursive: true })
const expectedSha = execSync('git rev-parse HEAD', { cwd: process.env.SEEDVALE_REPO ?? 'D:/Projekty/private/seedvale-v1' }).toString().trim()
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
  const url = `http://localhost:${port}/?benchmark=${scenario}`
  const chrome = spawn(CHROME, [
    `--remote-debugging-port=${DEBUG}`, `--user-data-dir=${profile}`, '--no-first-run',
    '--no-default-browser-check', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling', '--window-size=1600,900', '--window-position=0,0', url,
  ], { stdio: 'ignore' })
  try {
    const ws = new WebSocket(await cdpConnect())
    await new Promise((r) => (ws.onopen = r))
    const ev = evaluator(ws)
    ws.send(JSON.stringify({ id: 9999, method: 'Page.bringToFront' }))
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
    if (sha !== expectedSha) throw new Error(`SHA mismatch ${sha} vs ${expectedSha}`)
    b.meta.hardwareClass = /Arc/i.test(JSON.stringify(b.report.context.device ?? {})) ? 'target-gpu' : 'diagnostic'
    b.meta.notes = `A1' benchmark series ${tag} rep${rep}; native Windows Chrome headed, fresh profile, ${cooldownSec}s cooldown`
    const base = join(outDir, `${tag}-${scenario}-rep${rep}`)
    writeFileSync(`${base}.json`, JSON.stringify(b.report, null, 2))
    if (b.raw) writeFileSync(`${base}.raw.json`, JSON.stringify(b.raw))
    writeFileSync(`${base}.md`, b.markdown)
    writeFileSync(`${base}.meta.json`, JSON.stringify(b.meta, null, 2))
    const r = b.report
    console.log(`OK ${scenario} rep${rep} sha=${sha.slice(0, 8)} fps=${r.fps?.avg} p95=${r.frameTime?.p95} draws=${r.rendering?.drawCallsAvg} npc=${r.context?.npcCount} gpu=${String(gpu).slice(0, 60)}`)
    ws.close()
  } finally {
    chrome.kill()
    try { execSync(`taskkill /F /T /PID ${chrome.pid}`, { stdio: 'ignore' }) } catch {}
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

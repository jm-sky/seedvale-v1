// Usage: node scripts/perf/trace-benchmark-window.mjs <vitePort> <outDir> <scenario>  (see arc-baseline-runbook "Chrome trace of the benchmark window")
// Chrome trace of exactly the benchmark measured window (marks seedvale:bench-window-start/end), streamed to a file via CDP.
import { spawn, execSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync, appendFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [, , port, outDir, scenario] = process.argv
const DEBUG = 9334
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
mkdirSync(outDir, { recursive: true })
const sha = execSync('git rev-parse HEAD', { cwd: 'D:/Projekty/private/seedvale-v1' }).toString().trim()
const profile = mkdtempSync(join(tmpdir(), 'sv-trace-'))
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  `--remote-debugging-port=${DEBUG}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check',
  '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling',
  '--window-size=1600,900', '--window-position=0,0', `http://localhost:${port}/?benchmark=${scenario}`,
], { stdio: 'ignore' })

let id = 0
const pending = new Map()
const listeners = []
function send(method, params = {}) {
  return new Promise((res, rej) => {
    const i = ++id
    pending.set(i, (d) => (d.error ? rej(new Error(method + ' ' + JSON.stringify(d.error))) : res(d.result)))
    ws.send(JSON.stringify({ id: i, method, params }))
  })
}
const ev = async (e) => (await send('Runtime.evaluate', { expression: e, returnByValue: true })).result.value
let ws
try {
  let url
  for (let i = 0; i < 60 && !url; i++) {
    try { url = (await (await fetch(`http://127.0.0.1:${DEBUG}/json`)).json()).find((t) => t.type === 'page')?.webSocketDebuggerUrl } catch {}
    if (!url) await sleep(500)
  }
  ws = new WebSocket(url)
  await new Promise((r) => (ws.onopen = r))
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data)
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) }
    else listeners.forEach((l) => l(d))
  }
  await send('Page.bringToFront')

  const has = (n) => ev(`performance.getEntriesByName('${n}').length > 0`)
  const t0 = Date.now()
  while (!(await has('seedvale:bench-window-start'))) {
    if (Date.now() - t0 > 5 * 60_000) throw new Error('window-start mark never appeared')
    await sleep(100)
  }
  const complete = new Promise((r) => listeners.push((d) => d.method === 'Tracing.tracingComplete' && r(d.params)))
  await send('Tracing.start', {
    transferMode: 'ReturnAsStream', streamFormat: 'json', bufferUsage: 1, // ring buffer sized by Chrome
    
    traceConfig: {
      recordMode: 'recordContinuously',
      includedCategories: ['devtools.timeline', 'disabled-by-default-devtools.timeline', 'disabled-by-default-devtools.timeline.frame',
        'blink.user_timing', 'v8.execute', 'gpu', 'toplevel', 'disabled-by-default-v8.cpu_profiler'],
    },
  })
  await ev("performance.mark('seedvale:trace-start')")
  const tStart = Date.now()
  while (!(await has('seedvale:bench-window-end'))) {
    if (Date.now() - tStart > 90_000) throw new Error('window-end mark never appeared')
    await sleep(100)
  }
  console.log('mark end seen, ending trace', Date.now() - tStart)
  await send('Tracing.end')
  const { stream } = await complete
  console.log('tracingComplete, stream', stream)
  const file = join(outDir, `trace-${scenario}-${sha.slice(0, 8)}.json`)
  writeFileSync(file, '')
  let chunks = 0
  for (;;) {
    const r = await send('IO.read', { handle: stream, size: 1024 * 1024 })
    appendFileSync(file, r.data)
    if (++chunks % 20 === 0) console.log('read chunks', chunks)
    if (r.eof) break
  }
  await send('IO.close', { handle: stream })
  console.log(`TRACE_OK ${file} tracedMs=${Date.now() - tStart}`)
  // wait for the report to exist, for the FPS context
  for (let i = 0; i < 60 && !(await ev('!!window.__seedvalePerfLastReport')); i++) await sleep(1000)
  console.log('REPORT', await ev('(r=>r&&JSON.stringify({fps:r.fps.avg,p95:r.frameTime.p95,sha:r.context.gitSha,npc:r.context.npcCount}))(window.__seedvalePerfLastReport)'))
} catch (e) {
  console.log('FAIL', e.message)
} finally {
  try { execSync(`taskkill /F /T /PID ${chrome.pid}`, { stdio: 'ignore' }) } catch {}
  await sleep(2000)
  try { rmSync(profile, { recursive: true, force: true }) } catch {}
  process.exit(0)
}

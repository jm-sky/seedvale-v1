/* eslint-disable no-empty */
/* eslint-disable no-undef */
// Usage: node scripts/perf/export-worldgen-fixture.mjs <vitePort> <benchmark|default> [settleSec]
// Regenerates public/worldgen-fixtures/<seed>-<profile>.svwc (+ index.json entry), plan tools-020.
// Boots the profile world cold in a fresh Chrome profile with ?worldgenFixture=0 (no benchmark autorun),
// waits for __seedvaleReady and for the debounced worldgen cache writes to settle, then exports the
// fixture-eligible records. Nothing is measured; WSL2 Chrome is fine.
import { execSync, spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const [, , port, profile, settleArg] = process.argv
if (!port || !['benchmark', 'default'].includes(profile)) {
  console.error('usage: export-worldgen-fixture.mjs <vitePort> <benchmark|default> [settleSec]')
  process.exit(2)
}
const IS_WIN = process.platform === 'win32'
const CHROME = process.env.SEEDVALE_CHROME ?? (IS_WIN ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : '/usr/bin/google-chrome')
const DEBUG = 9334
const REFERENCE_SEED = 415424794
const BENCHMARK_SEED = 42
const seed = profile === 'benchmark' ? BENCHMARK_SEED : REFERENCE_SEED
const SETTLE_MS = Number(settleArg ?? 15) * 1000
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const REPO = process.env.SEEDVALE_REPO ?? process.cwd()
const OUT_DIR = join(REPO, 'public', 'worldgen-fixtures')
const gitSha = execSync('git rev-parse HEAD', { cwd: REPO }).toString().trim()
const dirty = execSync('git status --porcelain -- src', { cwd: REPO }).toString().trim()
if (dirty) console.log('WARN uncommitted src changes — fixture will record the working tree, label SHA', gitSha.slice(0, 8))

// ?fly boots a fresh world from ?seed without a save/start screen (default WorldConfig, no fixture config).
const query = profile === 'benchmark'
  ? '?benchmark=settlement-heavy&benchmarkAutorun=0&worldgenFixture=0'
  : `?fly&seed=${REFERENCE_SEED}&worldgenFixture=0`
const url = `http://localhost:${port}/${query}`
const indexPath = join(OUT_DIR, 'index.json')
const index = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, 'utf8')) : { format: 1, fixtures: [] }
const prev = index.fixtures.find((f) => f.id === `${seed}-${profile}`)
const fixtureVersion = (prev?.fixtureVersion ?? 0) + 1

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
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id) }
  }
  return (expression, awaitPromise = false) => new Promise((res, rej) => {
    const i = ++id
    pending.set(i, (d) => (d.error || d.result.exceptionDetails ? rej(new Error(JSON.stringify(d.error ?? d.result.exceptionDetails).slice(0, 400))) : res(d.result.result.value)))
    ws.send(JSON.stringify({ id: i, method: 'Runtime.evaluate', params: { expression, returnByValue: true, awaitPromise } }))
  })
}

const profileDir = mkdtempSync(join(tmpdir(), 'sv-wgfix-'))
const chrome = spawn(CHROME, [
  `--remote-debugging-port=${DEBUG}`, `--user-data-dir=${profileDir}`, '--no-first-run', '--no-default-browser-check',
  '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-background-timer-throttling',
  '--window-size=1600,900', '--window-position=0,0',
  ...(IS_WIN ? [] : ['--ignore-gpu-blocklist', '--password-store=basic', "--simulate-outdated-no-au=Tue, 31 Dec 2099 23:59:59 GMT"]), url,
], { stdio: 'ignore', env: IS_WIN ? process.env : { GALLIUM_DRIVER: 'd3d12', ...process.env } })

try {
  const ws = new WebSocket(await cdpConnect())
  await new Promise((r) => (ws.onopen = r))
  const ev = evaluator(ws)
  ws.send(JSON.stringify({ id: 9999, method: 'Page.bringToFront' }))
  const t0 = Date.now()
  while (!(await ev('!!window.__seedvaleReady').catch(() => false))) {
    if (Date.now() - t0 > 6 * 60_000) throw new Error('timeout waiting for __seedvaleReady')
    await sleep(2000)
  }
  console.log(`ready after ${Math.round((Date.now() - t0) / 1000)}s; waiting ${SETTLE_MS / 1000}s for debounced cache writes`)
  const stats = await ev('JSON.stringify(window.__seedvaleWorldgenFixtureStats?.())')
  if (JSON.parse(stats)?.skipped !== 'disabled') throw new Error(`fixture import was not disabled during export: ${stats}`)
  await sleep(SETTLE_MS)

  // Records keep arriving while owners hydrate/persist; repeat until the count is stable.
  let last = -1
  let exp
  for (let i = 0; i < 8; i++) {
    const json = await ev(`window.__seedvaleExportWorldgenFixture(${JSON.stringify(profile)}, ${JSON.stringify({ fixtureVersion, gitSha })}).then(JSON.stringify)`, true)
    exp = JSON.parse(json)
    if (exp.records === last) break
    last = exp.records
    await sleep(5000)
  }
  if (!exp || exp.records === 0) throw new Error('no fixture-eligible records found in the cache')

  mkdirSync(OUT_DIR, { recursive: true })
  const id = `${seed}-${profile}`
  const file = `${id}.svwc`
  const bytes = Buffer.from(exp.gzipBase64, 'base64')
  writeFileSync(join(OUT_DIR, file), bytes)
  const entry = {
    id, file, seed, profile,
    fixtureVersion,
    hash: createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length, records: exp.records, namespaces: exp.namespaces,
  }
  index.fixtures = [...index.fixtures.filter((f) => f.id !== id), entry].sort((a, b) => a.id.localeCompare(b.id))
  writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n')
  console.log(`wrote ${file}: ${(bytes.length / 1024).toFixed(0)} KiB gzip, ${exp.records} records`, JSON.stringify(exp.namespaces))
  if (bytes.length > 3 * 1024 * 1024) console.log('STOP: fixture exceeds the 3 MB compressed budget (plan tools-020) — report to the author')
  try { ws.send(JSON.stringify({ id: 9998, method: 'Browser.close' })) } catch {}
  await sleep(3000)
  ws.close()
} finally {
  chrome.kill()
  if (IS_WIN) { try { execSync(`taskkill /F /T /PID ${chrome.pid}`, { stdio: 'ignore' }) } catch {} }
  await sleep(2000)
  try { rmSync(profileDir, { recursive: true, force: true }) } catch {}
}

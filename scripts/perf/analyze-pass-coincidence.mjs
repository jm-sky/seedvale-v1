// Usage: node scripts/perf/analyze-pass-coincidence.mjs <raw-sidecar.json> [...more]
// world-terrain-056 S0: frame classes (neither / shadow-only / mirror-only / both),
// per-class share and frameMs/renderMs p50/p95/p99, refresh-interval histograms, max gap.
// Needs raw sidecar schemaVersion 2 (shadowRefreshed, mirrorDrawCalls). Files are pooled.
import { readFileSync } from 'node:fs'

const q = (a, p) => {
  if (!a.length) return NaN
  const s = [...a].sort((x, y) => x - y)
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))]
}
const stats = (a) => `${q(a, 50).toFixed(1)} / ${q(a, 95).toFixed(1)} / ${q(a, 99).toFixed(1)}`

const classes = { neither: [], 'shadow-only': [], 'mirror-only': [], both: [] }
const all = []
const gaps = { shadow: [], mirror: [] }
const reasons = {}
for (const file of process.argv.slice(2)) {
  const raw = JSON.parse(readFileSync(file, 'utf8'))
  const rawObj = raw.raw ?? raw
  if (rawObj.schemaVersion !== 2) { console.error(`skip ${file}: schemaVersion ${rawObj.schemaVersion} (need 2)`); continue }
  const names = rawObj.shadowReasonCodes
  const factor = rawObj.sampling?.factor ?? 1
  let lastM = null, lastS = null
  for (const f of rawObj.frames) {
    const sh = f.shadowRefreshed === 1
    const mi = (f.mirrorDrawCalls ?? 0) > 0
    const cls = sh && mi ? 'both' : sh ? 'shadow-only' : mi ? 'mirror-only' : 'neither'
    classes[cls].push(f)
    all.push(f)
    if (sh) reasons[names[f.shadowReason]] = (reasons[names[f.shadowReason]] ?? 0) + 1
    if (factor === 1) {
      if (sh) { if (lastS !== null) gaps.shadow.push(f.i - lastS); lastS = f.i }
      if (mi) { if (lastM !== null) gaps.mirror.push(f.i - lastM); lastM = f.i }
    }
  }
}
const n = all.length
const row = (name, fs) => `| ${name} | ${fs.length} | ${n ? ((100 * fs.length) / n).toFixed(1) : '0'} % | ${stats(fs.map((f) => f.frameMs))} | ${stats(fs.map((f) => f.renderMs))} |`
console.log('| class | frames | share | frameMs p50/p95/p99 | renderMs p50/p95/p99 |\n|---|---:|---:|---|---|')
for (const [k, v] of Object.entries(classes)) console.log(row(k, v))
console.log(row('all', all))
const hist = (g) => {
  const h = {}
  for (const x of g) h[x] = (h[x] ?? 0) + 1
  return Object.entries(h).sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}f×${v}`).join(' ') + (g.length ? ` · max gap ${Math.max(...g)} f` : '')
}
console.log(`\nshadow refresh reasons: ${JSON.stringify(reasons)}`)
console.log(`shadow interval histogram (frames): ${hist(gaps.shadow)}`)
console.log(`mirror interval histogram (frames): ${hist(gaps.mirror)}`)

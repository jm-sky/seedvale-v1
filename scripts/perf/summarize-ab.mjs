// Usage: node scripts/perf/summarize-ab.mjs <rawDir>  — medians over reps for arms A (original) and C (polished).
import { readdirSync, readFileSync } from 'node:fs'
const dir = process.argv[2]
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)]
const rows = []
for (const arm of ['A', 'C'])
  for (const sc of ['current', 'settlement']) {
    const js = readdirSync(`${dir}/${arm}`).filter((f) => f.includes(`-${sc}-rep`) && f.endsWith('.json') && !f.includes('meta') && !f.includes('raw')).map((f) => JSON.parse(readFileSync(`${dir}/${arm}/${f}`, 'utf8')))
    const m = (g) => med(js.map(g)).toFixed(1)
    rows.push(`| ${arm} | ${sc} | ${js.length} | ${m((j) => j.fps.avg)} | ${m((j) => j.frameTime.p50)} | ${m((j) => j.frameTime.p95)} | ${m((j) => j.frameTime.p99)} | ${m((j) => j.renderTime.p50)} | ${m((j) => j.updateTime.p50)} | ${m((j) => j.rendering.drawCallsAvg)} | ${m((j) => j.hitchCount)} |`)
  }
console.log('| arm | scenario | n | FPS avg | frame p50 | p95 | p99 | RENDER p50 | update p50 | draws avg | hitches |\n|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|\n' + rows.join('\n'))

// Usage: pnpm worldgen:variants [--seeds=42,415424794] [--variants=22@1150,25@1050,28@950] [--abca] [--json]
// world-terrain-063 V0: settlement variant runner (tooling only, current terrain).
// Each variant × seed runs `census-travel.ts` in a FRESH process, so the layout memo, defs, progression, quest
// hosts and road routes can never leak between variants (review 031 F4). `--abca` appends the first variant again
// and fails if A's fingerprint differs (A → B → A identity). Variant syntax: `<target>@<startSpacingM>`
// (suitabilityWeight arrives with V1; there is no suitability term to weight yet).
import { execFileSync } from 'node:child_process'

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const variants = arg('variants', '22@1150,25@1050,28@950').split(',')
const asJson = process.argv.includes('--json')
if (process.argv.includes('--abca')) variants.push(variants[0]!)

type Census = {
  seed: number
  counts: { selected: number, defined: number, routedEdges: number, unroutedEdges: number, roadConnectedInLargestComponent: number }
  connectivity: { routedComponents: number }
  routeStats: { polylineM: { p50: number, p90: number }, ratio: { p50: number }, riverCrossings: number }
  coverage: { wildernessOver5hPct: number, quadrantWithin5hPct: Record<string, number | null> }
  edges: unknown[]
}

function run(seed: number, variant: string): Census {
  const [target, spacing] = variant.split('@') as [string, string]
  const out = execFileSync('pnpm', ['exec', 'tsx', 'scripts/perf/census-travel.ts', `--seeds=${seed}`, '--json', `--target=${target}`, `--spacing=${spacing}`], {
    encoding: 'utf8', maxBuffer: 256 * 1024 * 1024,
  })
  return (JSON.parse(out.slice(out.indexOf('['))) as Census[])[0]!
}

const rows: Array<Record<string, string | number>> = []
const fingerprints = new Map<string, string>()
let failed = false
for (const seed of seeds) {
  for (const variant of variants) {
    const r = run(seed, variant)
    const fp = JSON.stringify([r.counts, r.edges])
    const key = `${seed}|${variant}`
    const repeat = fingerprints.has(key)
    if (repeat && fingerprints.get(key) !== fp) { failed = true; console.error(`A→B→A MISMATCH for ${key}`) }
    fingerprints.set(key, fp)
    const q = Object.values(r.coverage.quadrantWithin5hPct).filter((v): v is number => v !== null)
    rows.push({
      seed, variant: repeat ? `${variant} (A again)` : variant, selected: r.counts.selected, defined: r.counts.defined,
      routed: r.counts.routedEdges, unrouted: r.counts.unroutedEdges, comps: r.connectivity.routedComponents,
      p50m: r.routeStats.polylineM.p50, p90m: r.routeStats.polylineM.p90, ratioP50: r.routeStats.ratio.p50,
      crossings: r.routeStats.riverCrossings, wild5hPct: r.coverage.wildernessOver5hPct, minQuad5hPct: q.length ? Math.min(...q) : 0,
    })
  }
}
if (asJson) console.log(JSON.stringify(rows, null, 2))
else console.table(rows)
if (failed) process.exit(1)

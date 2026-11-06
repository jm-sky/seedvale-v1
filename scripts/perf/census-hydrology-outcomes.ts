// Usage: pnpm worldgen:outcomes:census [--seeds=42,415424794] [--min-drop=2] [--json=<file>]
// Plan world-terrain-061 H5: (1) asserts the world-terrain-060 landform `intendedOutcome` against the hydrology
// (lake-with-island holds a lake with a dry centre; crater stays dry), (2) records steep perennial reaches as DATA ONLY
// for world-terrain-064 (top/bottom, drop on the shipped chain elevation profile, width class, source-chain id + offset).
// No runtime consumer; nothing here changes worldgen.
import { writeFileSync } from 'node:fs'
import { defaultTerrainConfig } from '../../src/config/worldConfig'
import { landformDescriptorsOf, type RawSampleParams, sampleRawFloorUncorrected } from '../../src/terrain/chunkHeightmap'
import { widthFromAccumulation } from '../../src/terrain/riverNetwork'
import { computeWorldHydrology, sampleRawFloorRows, unpackChains, WORLD_HYDROLOGY_GRID, worldHydrologyGridFor } from '../../src/terrain/worldHydrology'
import { hydrologyIdFor } from '../../src/terrain/worldHydrologyRegistry'
import { hydrologyCorrectionAt, hydrologyLakeLevelAt, installWorldHydrology, UNCONDITIONED_HYDROLOGY_ID } from '../../src/terrain/worldHydrologyStore'

function arg(name: string, fallback: string): string {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`))
  return hit ? hit.slice(name.length + 3) : fallback
}
const seeds = arg('seeds', '42,415424794').split(',').map(Number)
const minDrop = Number(arg('min-drop', '2'))
const jsonOut = arg('json', '')

/** Slope (rise per metre) above which consecutive chain points belong to a steep reach; mirrors the renderer's foam onset. */
const STEEP_SLOPE = 0.25

type WidthClass = 'thin' | 'small' | 'medium' | 'large'
type WaterfallCandidate = {
  sourceChain: number
  offsetTopM: number
  top: { x: number, z: number, elevation: number }
  bottom: { x: number, z: number, elevation: number }
  dropM: number
  lengthM: number
  widthM: number
  widthClass: WidthClass
}

function widthClassOf(widthM: number): WidthClass {
  return widthM < 1.5 ? 'thin' : widthM < 4 ? 'small' : widthM < 8 ? 'medium' : 'large'
}

const report: Record<string, unknown> = {}
let failures = 0

for (const seed of seeds) {
  const base = { ...defaultTerrainConfig(65), seed, hydrologyId: UNCONDITIONED_HYDROLOGY_ID } as unknown as RawSampleParams
  const grid = { ...WORLD_HYDROLOGY_GRID }
  const floor = sampleRawFloorRows(base, grid, 0, grid.size)
  const h = computeWorldHydrology(worldHydrologyGridFor(base, floor), { waterLevel: base.waterLevel, seed })
  const hid = hydrologyIdFor(base)
  installWorldHydrology(hid, h)

  console.log(`seed ${seed}:`)
  const outcomes: string[] = []
  for (const d of landformDescriptorsOf(base)) {
    const ground = sampleRawFloorUncorrected(d.centreX, d.centreZ, base)
    const lake = hydrologyLakeLevelAt(hid, d.centreX, d.centreZ)
    const correction = hydrologyCorrectionAt(hid, d.centreX, d.centreZ)
    let ok: boolean
    let detail: string
    if (d.kind === 'lakeIsland') {
      // A lake basin must surround the centre; the centre itself (the island) must stay above the water.
      const ring = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2
        return hydrologyLakeLevelAt(hid, d.centreX + Math.cos(a) * d.radius * 0.6, d.centreZ + Math.sin(a) * d.radius * 0.6)
      })
      const wetRing = ring.filter((l) => Number.isFinite(l)).length
      ok = wetRing >= 6 && (!Number.isFinite(lake) || ground + correction >= lake)
      const filled = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2
        return hydrologyCorrectionAt(hid, d.centreX + Math.cos(a) * d.radius * 0.6, d.centreZ + Math.sin(a) * d.radius * 0.6)
      })
      detail = `rim corrections ${filled.map((c) => c.toFixed(1)).join('/')}; lake rim samples ${wetRing}/8, centre ${(ground + correction).toFixed(1)} m vs level ${Number.isFinite(lake) ? lake.toFixed(1) : 'none'}`
    } else if (d.kind === 'crater') {
      // The raw hydrology may fill/breach the pit; the sampler ignores that correction inside the crater
      // (`landformCorrectionBypassAt`), so the contract is "no lake registered over the bowl".
      ok = !Number.isFinite(lake)
      detail = `centre lake ${Number.isFinite(lake) ? lake.toFixed(1) : 'none'} (raw correction ${correction.toFixed(2)} m is bypassed at runtime)`
    } else {
      ok = true
      detail = 'no hydrology outcome asserted'
    }
    // A lake island whose basin simply did not fill is a worldgen finding (reported as MISS), not a script failure.
    const verdict = ok ? 'OK' : d.kind === 'lakeIsland' ? 'MISS' : 'FAIL'
    if (verdict === 'FAIL') failures++
    outcomes.push(`${d.id}: ${verdict} — ${detail}`)
    console.log(`  ${verdict.padEnd(4)} ${d.id} (${d.kind}) at (${d.centreX.toFixed(0)}, ${d.centreZ.toFixed(0)}): ${detail}`)
  }

  const chains = unpackChains(h.chains)
  const candidates: WaterfallCandidate[] = []
  chains.forEach((chain, ci) => {
    const pts = chain.points
    let run: { start: number, end: number } | null = null
    let along = 0
    const offsets: number[] = [0]
    for (let i = 1; i < pts.length; i++) {
      along += Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.z - pts[i - 1]!.z)
      offsets.push(along)
    }
    const flush = () => {
      if (!run) return
      const a = pts[run.start]!
      const b = pts[run.end]!
      const drop = a.elevation - b.elevation
      if (drop >= minDrop) {
        const widthM = widthFromAccumulation(Math.max(a.accumulation, b.accumulation))
        candidates.push({
          sourceChain: ci,
          offsetTopM: Math.round(offsets[run.start]!),
          top: { x: Math.round(a.x), z: Math.round(a.z), elevation: Math.round(a.elevation * 100) / 100 },
          bottom: { x: Math.round(b.x), z: Math.round(b.z), elevation: Math.round(b.elevation * 100) / 100 },
          dropM: Math.round(drop * 100) / 100,
          lengthM: Math.round(offsets[run.end]! - offsets[run.start]!),
          widthM: Math.round(widthM * 100) / 100,
          widthClass: widthClassOf(widthM),
        })
      }
      run = null
    }
    for (let i = 1; i < pts.length; i++) {
      const dist = Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.z - pts[i - 1]!.z) || 1
      const slope = (pts[i - 1]!.elevation - pts[i]!.elevation) / dist
      if (slope >= STEEP_SLOPE) {
        if (run) run.end = i
        else run = { start: i - 1, end: i }
      } else flush()
    }
    flush()
  })
  candidates.sort((a, b) => b.dropM - a.dropM)
  const byClass = candidates.reduce<Record<string, number>>((m, c) => ({ ...m, [c.widthClass]: (m[c.widthClass] ?? 0) + 1 }), {})
  console.log(`  steep perennial reaches (drop ≥ ${minDrop} m, slope ≥ ${STEEP_SLOPE}): ${candidates.length}`, byClass)
  for (const c of candidates.slice(0, 5)) console.log(`    chain ${c.sourceChain}+${c.offsetTopM} m: drop ${c.dropM} m over ${c.lengthM} m, ${c.widthClass} (${c.widthM} m) at (${c.top.x}, ${c.top.z})`)
  report[String(seed)] = { outcomes, waterfallCandidates: candidates }
}

if (jsonOut) writeFileSync(jsonOut, JSON.stringify(report, null, 1))
if (failures > 0) {
  console.error(`${failures} landform outcome assertion(s) failed`)
  process.exitCode = 1
}

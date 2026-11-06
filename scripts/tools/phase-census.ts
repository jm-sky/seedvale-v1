/**
 * Precipitation-phase census (plan world-terrain-062 W1, queue Q170): share of precipitation
 * weather cycles that fall as snow, per latitude third × season — global (offset 0, "before")
 * vs local (`localWeatherFrom` at each land sample, "after"). Also reports the home offset.
 *
 *   pnpm tsx scripts/tools/phase-census.ts <seed>[,<seed>...] [--years=8]
 *
 * @domain tools
 */
import { createBenchmarkWorldConfig } from '../../src/config/worldConfig'
import { sampleRawTexelUncorrectedAt } from '../../src/terrain/chunkHeightmap'
import { climateOffsetC } from '../../src/terrain/macroClimate'
import { rawSampleParamsFromWorld } from '../../src/world/map/mapProjection'
import { computeWeather, getSeason, localWeatherFrom, WEATHER_CYCLE_DAYS } from '../../src/world/weather'

const HALF = 6144
const STEP = 256
const N = (2 * HALF) / STEP
const args = process.argv.slice(2)
const seeds = (args.find((a) => !a.startsWith('--')) ?? '').split(',').map(Number)
const years = Number(args.find((a) => a.startsWith('--years='))?.slice(8) ?? 8)
const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const

for (const seed of seeds) {
  const params = rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed, terrainResolution: 65, loadRadius: 2 }))
  const sites: { third: number, off: number }[] = []
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const x = -HALF + (i + 0.5) * STEP
    const z = -HALF + (j + 0.5) * STEP
    const t = sampleRawTexelUncorrectedAt(x, z, params)
    if (t.floorH <= params.waterLevel) continue
    sites.push({ third: Math.min(2, Math.floor((j / N) * 3)), off: climateOffsetC(z, t.floorH, params.waterLevel) })
  }
  const home = sampleRawTexelUncorrectedAt(0, 0, params)
  console.log(`seed ${seed}: ${sites.length} land samples; home offset ${climateOffsetC(0, home.floorH, params.waterLevel).toFixed(2)} °C`)
  const acc = new Map<string, { precip: number, snowGlobal: number, snowLocal: number }>()
  for (let d = 0; d < 400 * years; d += WEATHER_CYCLE_DAYS) {
    const w = computeWeather(seed, d, getSeason(d))
    if (w.type === 'clear' || w.type === 'cloudy' || w.type === 'fog') continue
    for (const s of sites) {
      const k = `${s.third}:${getSeason(d)}`
      const a = acc.get(k) ?? { precip: 0, snowGlobal: 0, snowLocal: 0 }
      a.precip++
      if (w.type === 'snow') a.snowGlobal++
      if (localWeatherFrom(w, s.off).phase === 'snow') a.snowLocal++
      acc.set(k, a)
    }
  }
  for (const third of [0, 1, 2]) for (const season of SEASONS) {
    const a = acc.get(`${third}:${season}`)
    if (!a) continue
    const p = (n: number) => ((100 * n) / a.precip).toFixed(1).padStart(5)
    console.log(`  ${['north', 'middle', 'south'][third]!.padEnd(6)} ${season.padEnd(6)} snow global ${p(a.snowGlobal)}% → local ${p(a.snowLocal)}%`)
  }
}

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { createBenchmarkWorldConfig } from '../../../config/worldConfig'
import { cancelChunkMapTile, requestChunkMapTile } from '../../../terrain/chunkWorkerPool'
import { ensureWorldHydrology } from '../../../terrain/worldHydrologyRuntime'
import {
  collectContinentTiles,
  ContinentPreviewAbortedError,
  continentTileRequests,
} from '../../../world/map/continentPreview'
import { rawSampleParamsFromWorld } from '../../../world/map/mapProjection'
import { renderContinentCanvas } from '../../lib/continentPreviewRender'

/**
 * Author diagnostic (plan tools-023): whole-continent terrain + canonical river
 * network as a PNG. Independent of the game world, saves and map discovery.
 * @domain tools
 */

type RiverVisibility = 'major' | 'all'
type Phase = 'idle' | 'hydrology' | 'tiles' | 'ready' | 'error'

const DEFAULT_SEED = 415424794
const params = new URLSearchParams(window.location.search)
const seedInput = ref(params.get('seed') ?? String(DEFAULT_SEED))
const visibility = ref<RiverVisibility>('all')
const phase = ref<Phase>('idle')
const progress = ref({ done: 0, total: 0 })
const message = ref('')
const stats = ref('')
const canvas = ref<HTMLCanvasElement | null>(null)
let controller: AbortController | null = null
/** Seed of the raster currently on the canvas (null = nothing exportable). */
let readySeed: number | null = null

function parseSeed(raw: string): number | null {
  const n = Number(raw.trim())
  return Number.isInteger(n) && n >= 0 && n <= 0xffffffff ? n : null
}

async function generate(): Promise<void> {
  const seed = parseSeed(seedInput.value)
  if (seed === null) {
    phase.value = 'error'
    message.value = 'Seed must be an integer 0…4294967295.'
    return
  }
  controller?.abort()
  const mine = new AbortController()
  controller = mine
  readySeed = null
  message.value = ''
  stats.value = ''
  const started = performance.now()
  try {
    const sampleParams = rawSampleParamsFromWorld(createBenchmarkWorldConfig({ seed, terrainResolution: 65, loadRadius: 2 }))
    phase.value = 'hydrology'
    const hydrology = await ensureWorldHydrology(sampleParams)
    if (mine.signal.aborted) return
    const requests = continentTileRequests(sampleParams, visibility.value === 'all' ? 'all' : 'standard')
    progress.value = { done: 0, total: requests.length }
    phase.value = 'tiles'
    const tiles = await collectContinentTiles({
      requests,
      requester: { request: requestChunkMapTile, cancel: cancelChunkMapTile },
      signal: mine.signal,
      onProgress: (done, total) => { progress.value = { done, total } },
    })
    if (mine.signal.aborted || !canvas.value) return
    renderContinentCanvas(canvas.value, tiles, sampleParams, 1.5)
    readySeed = seed
    phase.value = 'ready'
    stats.value = `seed ${seed} · hydrology ${hydrology.source} (${hydrology.hash}) · ${tiles.length} tiles · `
      + `${((performance.now() - started) / 1000).toFixed(1)} s`
  } catch (error) {
    if (error instanceof ContinentPreviewAbortedError || mine.signal.aborted) return
    phase.value = 'error'
    message.value = error instanceof Error ? error.message : String(error)
  }
}

function cancel(): void {
  controller?.abort()
  phase.value = 'idle'
}

function download(): void {
  // Export only a complete render of the seed that is on screen.
  if (phase.value !== 'ready' || readySeed === null || !canvas.value) return
  const link = document.createElement('a')
  link.download = `seedvale-continent-${readySeed}-${visibility.value}.png`
  link.href = canvas.value.toDataURL('image/png')
  link.click()
}

onMounted(() => {
  if (params.get('autostart') === '1') void generate()
})
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <main class="mx-auto flex max-w-5xl flex-col gap-3 p-4 text-neutral-200">
    <h1 class="text-2xl font-semibold text-primary">
      Continent preview <span class="text-sm font-normal text-neutral-400">(author diagnostic)</span>
    </h1>
    <form
      class="flex flex-wrap items-end gap-3"
      @submit.prevent="generate"
    >
      <label class="flex flex-col gap-1 text-sm">
        Seed
        <input
          v-model="seedInput"
          class="w-40 rounded border border-neutral-600 bg-neutral-900 px-2 py-1"
          inputmode="numeric"
        >
      </label>
      <label class="flex flex-col gap-1 text-sm">
        Rivers
        <select
          v-model="visibility"
          class="rounded border border-neutral-600 bg-neutral-900 px-2 py-1"
        >
          <option value="all">All streams</option>
          <option value="major">Major waterways (LOD filter)</option>
        </select>
      </label>
      <button
        type="submit"
        class="rounded bg-primary px-3 py-1 text-sm text-black"
        :disabled="phase === 'hydrology' || phase === 'tiles'"
      >
        Generate
      </button>
      <button
        v-if="phase === 'hydrology' || phase === 'tiles'"
        type="button"
        class="rounded border border-neutral-600 px-3 py-1 text-sm"
        @click="cancel"
      >
        Cancel
      </button>
      <button
        type="button"
        class="rounded border border-neutral-600 px-3 py-1 text-sm disabled:opacity-40"
        :disabled="phase !== 'ready'"
        @click="download"
      >
        Download PNG
      </button>
    </form>
    <p class="text-sm text-neutral-400">
      <template v-if="phase === 'hydrology'">
        Preparing global hydrology…
      </template>
      <template v-else-if="phase === 'tiles'">
        Tiles {{ progress.done }} / {{ progress.total }}
      </template>
      <template v-else-if="phase === 'ready'">
        {{ stats }}
      </template>
      <template v-else-if="phase === 'error'">
        <span class="text-red-400">{{ message }}</span> — press Generate to retry.
      </template>
      <template v-else>
        Press Generate. Terrain is the canonical sampler; nothing here changes the game or its discovery.
      </template>
    </p>
    <p class="text-xs text-neutral-500">
      River strokes use a minimum of 1.5 px (visual exaggeration, not physical width). 8 m per pixel, north up.
    </p>
    <canvas
      ref="canvas"
      class="w-full max-w-[1536px] rounded border border-neutral-700"
      style="aspect-ratio: 1; background: #0e0c09"
    />
  </main>
</template>

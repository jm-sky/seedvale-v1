<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, type Ref, watch } from 'vue'
import type { AssetIndexEntry } from '../../../assets/assetIndex'
import type { AssetViewer } from '../viewer/createViewer'
import {
  buildAssetIndex,
  filterAssetIndex,
  formatAssetLabel,
  mergeParkedManifest,
  resolveLoadEntry,
} from '../../../assets/assetIndex'
import { BODY_BUILD_LABELS, BODY_BUILDS } from '../../../characters/bodyBuild'
import { HAIR_STYLES, HEAD_VARIANTS } from '../../../characters/characterTypes'
import ToolbarToggle from '../../ui/ToolbarToggle.vue'
import ToolsTopbar from '../../ui/ToolsTopbar.vue'
import {
  alignmentEdit,
  bumpAlignmentEdit,
  formatAlignmentSnippet,
  loadAlignmentEditor,
} from '../alignmentEdit'
import {
  bumpGripEdit,
  formatHeldAttachSnippet,
  gripEdit,
  installGripApi,
  loadGripEditor,
} from '../gripEdit'
import { ASSET_BROWSER_MODEL_MANIFEST } from '../modelManifest'
import { browserState, slotDiagnostics } from '../state'
import { syncAssetBrowserUrlParams } from '../urlParams'
import { boundsData, resolveAppliedClipName } from '../viewer/createAssetSlot'
import { captureSnapshot, copyText } from '../viewer/createSnapshot'
import { createLayoutPersistScheduler } from '../viewer/layoutPersist'

const props = defineProps<{ viewerRef: Ref<AssetViewer | null> }>()
const viewer = computed(() => props.viewerRef.value)

const modelFiles = ref<string[]>([])
const searchQuery = ref('')
const wiredIndex = buildAssetIndex()
const assetIndex = ref<AssetIndexEntry[]>(wiredIndex)
const indexReady = ref(false)
/** Inspected character that carries preview body builds (reference first, else target). */
const bodyBuildOwner = computed(() => {
  const e = [slotDiagnostics.reference.entry, slotDiagnostics.target.entry].find((x) => x?.bodyBuilds)
  return e ? e.label : null
})

const filteredIndex = computed(() => filterAssetIndex(assetIndex.value, searchQuery.value))
const searchMatchCount = computed(() => filteredIndex.value.length)

async function fetchModelFiles(): Promise<void> {
  try {
    const res = await fetch(ASSET_BROWSER_MODEL_MANIFEST)
    if (!res.ok) return
    const data = await res.json() as { files?: string[] }
    modelFiles.value = data.files ?? []
  } catch {
    modelFiles.value = []
  }
}

function onModelHmr(event: string, data?: { url?: string }) {
  if (event !== 'asset-browser:model-changed' || !data?.url) return
  browserState.statusMessage = `Model changed: ${data.url} — reload to pick up edits`
  const refUrl = viewer.value?.reference.url
  const tgtUrl = viewer.value?.target.url
  const clean = (u: string | null) => u?.replace(/\?r=\d+$/, '') ?? null
  if (clean(refUrl ?? null) === data.url) void viewer.value?.reloadReference()
  if (clean(tgtUrl ?? null) === data.url) void viewer.value?.reloadTarget()
}

const grouped = computed(() => {
  const map = new Map<string, AssetIndexEntry[]>()
  for (const entry of filteredIndex.value) {
    const list = map.get(entry.group) ?? []
    list.push(entry)
    map.set(entry.group, list)
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
})

const poseClipOptions = computed(() => {
  const ref = slotDiagnostics.reference.clipNames
  const tgt = slotDiagnostics.target.clipNames
  return ref.length > 0 ? ref : tgt
})

const poseSelect = computed({
  get() {
    if (browserState.pose === 'rest' && !browserState.clip) return 'rest'
    return resolveAppliedClipName('idle', browserState.clip, poseClipOptions.value) ?? 'rest'
  },
  set(value: string) {
    if (value === 'rest') {
      browserState.pose = 'rest'
      browserState.clip = null
      return
    }
    browserState.pose = 'idle'
    const idle = poseClipOptions.value.find((n) => /idle/i.test(n))
    browserState.clip = idle != null && value === idle ? null : value
  },
})

function syncSlot(which: 'reference' | 'target') {
  if (!viewer.value) return
  const slot = which === 'reference' ? viewer.value.reference : viewer.value.target
  const diag = slotDiagnostics[which]
  diag.entry = slot.entry
  diag.url = slot.url
  const box = slot.getBounds()
  diag.bounds = box ? boundsData(box) : null
  diag.anchors = slot.anchors.map((a) => ({
    name: a.def.name,
    type: a.def.type ?? null,
    source: a.source,
    issues: [],
  }))
  const g = slot.group
  diag.transform = {
    position: [g.position.x, g.position.y, g.position.z],
    rotationDeg: [
      g.rotation.x * 180 / Math.PI,
      g.rotation.y * 180 / Math.PI,
      g.rotation.z * 180 / Math.PI,
    ],
    scale: [g.scale.x, g.scale.y, g.scale.z],
  }
  diag.clipNames = slot.clipNames
}

async function loadReference() {
  if (!viewer.value) return
  const entry = resolveLoadEntry(assetIndex.value, {
    id: browserState.referenceId,
    url: browserState.referenceFreeUrl,
  })
  await viewer.value.loadReference(entry, entry?.url)
  syncSlot('reference')
}

async function loadTarget() {
  if (!viewer.value) return
  const entry = resolveLoadEntry(assetIndex.value, {
    id: browserState.targetId,
    url: browserState.freeUrl,
  })
  await viewer.value.loadTarget(entry, entry?.url)
  loadGripEditor(browserState.freeUrl.trim() ? null : browserState.targetId)
  loadAlignmentEditor(entry)
  syncSlot('target')
}

function applyGripEdit() {
  bumpGripEdit()
  viewer.value?.remountHeld()
  syncSlot('target')
}

function applyAlignmentEdit() {
  bumpAlignmentEdit()
  viewer.value?.remountAccessory()
  syncSlot('target')
}

async function copyGripSnippet() {
  await copyText(formatHeldAttachSnippet())
  browserState.statusMessage = 'HELD_ATTACH snippet copied'
}

async function copyAlignmentSnippet() {
  await copyText(formatAlignmentSnippet())
  browserState.statusMessage = 'alignment snippet copied'
}

watch(() => viewer.value, (v) => {
  if (!v || !indexReady.value) return
  installGripApi(() => {
    v.remountHeld()
    syncSlot('target')
  })
  void loadReference()
  if (browserState.targetId || browserState.freeUrl) void loadTarget()
})
watch(() => indexReady.value, (ready) => {
  if (!ready || !viewer.value) return
  installGripApi(() => {
    viewer.value?.remountHeld()
    syncSlot('target')
  })
  void loadReference()
  if (browserState.targetId || browserState.freeUrl) void loadTarget()
})
watch(() => browserState.referenceId, loadReference)
watch(() => browserState.targetId, loadTarget)
watch(() => browserState.freeUrl, () => { void loadTarget() })
watch(() => browserState.referenceFreeUrl, () => { void loadReference() })
watch(browserState, () => viewer.value?.refresh(), { deep: true })

watch(
  () => browserState.hairColor,
  () => viewer.value?.applyUbcHairColor(),
)

watch(
  () => browserState.bodyBuild,
  () => viewer.value?.applyBodyBuild(browserState.bodyBuild),
)

watch(
  () => [browserState.compareHead, browserState.kitHead, browserState.kitHair, browserState.kitFacialHair] as const,
  () => {
    if (!viewer.value || !indexReady.value) return
    const ref = resolveLoadEntry(assetIndex.value, {
      id: browserState.referenceId,
      url: browserState.referenceFreeUrl,
    })
    const tgt = resolveLoadEntry(assetIndex.value, {
      id: browserState.targetId,
      url: browserState.freeUrl,
    })
    if (ref?.headUrl) void loadReference()
    if (tgt?.headUrl) void loadTarget()
  },
)

watch(
  () => [browserState.focus, browserState.focusRadius] as const,
  () => viewer.value?.frame(),
)

watch(
  () => [
    browserState.referenceId,
    browserState.targetId,
    browserState.freeUrl,
    browserState.referenceFreeUrl,
    browserState.referenceAnchor,
    browserState.targetAnchor,
    browserState.focus,
    browserState.focusRadius,
    browserState.layout,
    browserState.activeView,
    browserState.pose,
    browserState.clip,
    browserState.lightingPreset,
    browserState.showBbox,
    browserState.showGrid,
    browserState.showAxes,
    browserState.showGround,
    browserState.showOverlay,
    browserState.hairColor,
    browserState.bodyBuild,
    browserState.kitHead,
    browserState.kitHair,
    browserState.kitFacialHair,
  ] as const,
  () => syncAssetBrowserUrlParams(browserState),
)

const layoutPersist = createLayoutPersistScheduler(() => browserState)
watch(
  () => [
    browserState.layout,
    browserState.activeView,
    browserState.splitX,
    browserState.splitY,
  ] as const,
  () => layoutPersist.schedule(),
)

let viewportResizeObserver: ResizeObserver | null = null
onMounted(() => {
  void (async () => {
    await fetchModelFiles()
    assetIndex.value = mergeParkedManifest(wiredIndex, modelFiles.value)
    indexReady.value = true
  })()
  if (import.meta.hot) {
    import.meta.hot.on('asset-browser:model-changed', (data: { url?: string }) => {
      onModelHmr('asset-browser:model-changed', data)
    })
  }
  viewportResizeObserver = new ResizeObserver(() => viewer.value?.resize())
  const el = document.getElementById('asset-browser-viewport')
  if (el) viewportResizeObserver.observe(el)
})
onUnmounted(() => {
  viewportResizeObserver?.disconnect()
  layoutPersist.flush()
  layoutPersist.dispose()
})

async function copyReport() {
  if (!viewer.value) return
  await copyText(browserState.reportText)
  browserState.statusMessage = 'Report copied'
}

async function saveSnapshot() {
  if (!viewer.value) return
  const blob = await captureSnapshot(viewer.value.getCanvas(), browserState.reportText)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'alignment-snapshot.png'
  a.click()
  URL.revokeObjectURL(url)
  browserState.statusMessage = 'Snapshot saved'
}

function heldAttachSnippet() {
  const t = slotDiagnostics.target.transform
  return `// HELD_ATTACH snippet\nposition: [${t.position.map((n) => n.toFixed(3)).join(', ')}],\nrotation: [${t.rotationDeg.map((n) => (n * Math.PI / 180).toFixed(4)).join(', ')}],\nscale: ${t.scale[0].toFixed(2)},`
}

function lampMountSnippet() {
  const t = slotDiagnostics.target.transform
  return `lampMount: { x: ${t.position[0].toFixed(3)}, y: ${t.position[1].toFixed(3)}, z: ${t.position[2].toFixed(3)} }`
}
</script>

<template>
  <div class="flex h-full w-full flex-col text-sm text-slate-100">
    <ToolsTopbar active-id="asset-browser" />
    <div class="flex min-h-0 flex-1">
      <aside class="flex w-80 shrink-0 flex-col gap-3 overflow-y-auto border-r border-slate-700 bg-slate-900/95 p-3">
        <section>
          <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Search
          </h2>
          <input
            v-model="searchQuery"
            class="w-full rounded bg-slate-800 px-2 py-1"
            placeholder="id, label, url, pack, kind…"
            type="search"
          >
          <p
            v-if="searchQuery.trim() && searchMatchCount === 0"
            class="mt-1 text-xs text-amber-300"
          >
            {{ searchQuery.trim() }}: 0
          </p>
          <p
            v-else-if="searchQuery.trim()"
            class="mt-1 text-[10px] text-slate-500"
          >
            {{ searchMatchCount }} matches
          </p>
        </section>

        <section>
          <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Reference
          </h2>
          <select
            v-model="browserState.referenceId"
            class="w-full rounded bg-slate-800 px-2 py-1"
          >
            <option :value="null">
              — none —
            </option>
            <optgroup
              v-for="[group, entries] in grouped"
              :key="group"
              :label="group"
            >
              <option
                v-for="e in entries"
                :key="e.id"
                :value="e.id"
              >
                {{ formatAssetLabel(e) }}
              </option>
            </optgroup>
          </select>
          <label class="mt-2 block text-xs text-slate-400">Free URL</label>
          <input
            v-model="browserState.referenceFreeUrl"
            class="w-full rounded bg-slate-800 px-2 py-1"
            placeholder="/models/..."
            list="asset-browser-model-list"
          >
          <label class="mt-2 block text-xs text-slate-400">Anchor</label>
          <select
            v-model="browserState.referenceAnchor"
            class="w-full rounded bg-slate-800 px-2 py-1"
          >
            <option :value="null">
              —
            </option>
            <option
              v-for="a in slotDiagnostics.reference.anchors"
              :key="a.name"
              :value="a.name"
            >
              {{ a.name }}
            </option>
          </select>
          <button
            class="mt-2 w-full rounded bg-slate-700 px-2 py-1 hover:bg-slate-600"
            @click="viewer?.reloadReference()"
          >
            Reload reference
          </button>
        </section>

        <section>
          <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Target
          </h2>
          <select
            v-model="browserState.targetId"
            class="w-full rounded bg-slate-800 px-2 py-1"
          >
            <option :value="null">
              — none —
            </option>
            <optgroup
              v-for="[group, entries] in grouped"
              :key="`t-${group}`"
              :label="group"
            >
              <option
                v-for="e in entries"
                :key="e.id"
                :value="e.id"
              >
                {{ formatAssetLabel(e) }}
              </option>
            </optgroup>
          </select>
          <label class="mt-2 block text-xs text-slate-400">Free URL</label>
          <input
            v-model="browserState.freeUrl"
            class="w-full rounded bg-slate-800 px-2 py-1"
            placeholder="/models/..."
            list="asset-browser-model-list"
          >
          <datalist id="asset-browser-model-list">
            <option
              v-for="url in modelFiles"
              :key="url"
              :value="url"
            />
          </datalist>
          <label class="mt-2 block text-xs text-slate-400">Anchor</label>
          <select
            v-model="browserState.targetAnchor"
            class="w-full rounded bg-slate-800 px-2 py-1"
          >
            <option :value="null">
              —
            </option>
            <option
              v-for="a in slotDiagnostics.target.anchors"
              :key="a.name"
              :value="a.name"
            >
              {{ a.name }}
            </option>
          </select>
          <button
            class="mt-2 w-full rounded bg-slate-700 px-2 py-1 hover:bg-slate-600"
            @click="viewer?.reloadTarget()"
          >
            Reload target
          </button>
        </section>

        <section
          v-if="browserState.invalidSelection"
          class="rounded border border-amber-600/50 bg-amber-950/40 p-2 text-amber-200"
        >
          Missing after reload: {{ browserState.invalidSelection }}
        </section>

        <section
          v-if="gripEdit.active"
          class="rounded border border-emerald-800/60 bg-emerald-950/20 p-2"
        >
          <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-300/90">
            Grip editor (HELD_ATTACH)
          </h2>
          <p class="mb-2 text-[10px] text-slate-400">
            Bone-local meters. WristR idle: +Y fingertips, −Z body. Live remount.
          </p>
          <div class="grid grid-cols-4 gap-1 text-[10px]">
            <span class="text-slate-500">pos</span>
            <input
              v-for="(_, i) in gripEdit.position"
              :key="`p${i}`"
              v-model.number="gripEdit.position[i]"
              type="number"
              step="0.01"
              class="rounded bg-slate-800 px-1"
              @change="applyGripEdit"
            >
            <span class="text-slate-500">rot°</span>
            <input
              v-for="(_, i) in gripEdit.rotationDeg"
              :key="`r${i}`"
              v-model.number="gripEdit.rotationDeg[i]"
              type="number"
              step="5"
              class="rounded bg-slate-800 px-1"
              @change="applyGripEdit"
            >
            <span class="text-slate-500">grip</span>
            <input
              v-for="(_, i) in gripEdit.gripLocalOffset"
              :key="`g${i}`"
              v-model.number="gripEdit.gripLocalOffset[i]"
              type="number"
              step="0.02"
              class="rounded bg-slate-800 px-1"
              @change="applyGripEdit"
            >
            <span class="text-slate-500">scale</span>
            <input
              v-model.number="gripEdit.scale"
              type="number"
              step="0.05"
              class="col-span-3 rounded bg-slate-800 px-1"
              @change="applyGripEdit"
            >
          </div>
          <div class="mt-2 flex gap-1">
            <button
              class="flex-1 rounded bg-emerald-700 px-2 py-1 hover:bg-emerald-600"
              @click="copyGripSnippet"
            >
              Copy HELD_ATTACH
            </button>
            <button
              class="rounded bg-slate-700 px-2 py-1"
              @click="() => { loadGripEditor(gripEdit.sourceId); applyGripEdit() }"
            >
              Reset
            </button>
          </div>
        </section>

        <section
          v-if="alignmentEdit.active"
          class="rounded border border-sky-800/60 bg-sky-950/20 p-2"
        >
          <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-300/90">
            Accessory alignment
          </h2>
          <p class="mb-2 text-[10px] text-slate-400">
            Overlay on the reference UBC skeleton. Paste into playerEquipmentVisual alignment.
          </p>
          <div class="grid grid-cols-4 gap-1 text-[10px]">
            <span class="text-slate-500">pos</span>
            <input
              v-for="(_, i) in alignmentEdit.position"
              :key="`ap${i}`"
              v-model.number="alignmentEdit.position[i]"
              type="number"
              step="0.01"
              class="rounded bg-slate-800 px-1"
              @change="applyAlignmentEdit"
            >
            <span class="text-slate-500">rot°</span>
            <input
              v-for="(_, i) in alignmentEdit.rotationDeg"
              :key="`ar${i}`"
              v-model.number="alignmentEdit.rotationDeg[i]"
              type="number"
              step="5"
              class="rounded bg-slate-800 px-1"
              @change="applyAlignmentEdit"
            >
            <span class="text-slate-500">scale</span>
            <input
              v-model.number="alignmentEdit.scale"
              type="number"
              step="0.05"
              class="col-span-3 rounded bg-slate-800 px-1"
              @change="applyAlignmentEdit"
            >
          </div>
          <div class="mt-2 flex gap-1">
            <button
              class="flex-1 rounded bg-sky-700 px-2 py-1 hover:bg-sky-600"
              @click="copyAlignmentSnippet"
            >
              Copy alignment
            </button>
            <button
              class="rounded bg-slate-700 px-2 py-1"
              @click="() => {
                loadAlignmentEditor(resolveLoadEntry(assetIndex, { id: alignmentEdit.sourceId }))
                applyAlignmentEdit()
              }"
            >
              Reset
            </button>
          </div>
        </section>

        <section>
          <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Transform (target root)
          </h2>
          <div class="grid grid-cols-3 gap-1 text-xs">
            <template
              v-for="(label, i) in ['X','Y','Z']"
              :key="label"
            >
              <label>{{ label }}</label>
              <input
                type="number"
                step="0.001"
                class="col-span-2 rounded bg-slate-800 px-1"
                :value="slotDiagnostics.target.transform.position[i]"
                @change="(e) => {
                  const v = Number((e.target as HTMLInputElement).value)
                  const p = [...slotDiagnostics.target.transform.position] as [number,number,number]
                  p[i] = v
                  viewer?.setTargetTransform({ position: p })
                }"
              >
            </template>
          </div>
        </section>

        <section>
          <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Rendering
          </h2>
          <select
            v-model="browserState.renderMode"
            class="mb-1 w-full rounded bg-slate-800 px-2 py-1"
          >
            <option value="diagnostic">
              Diagnostic
            </option>
            <option value="game-like">
              Game-like
            </option>
          </select>
          <label class="flex items-center gap-2 text-xs"><input
            v-model="browserState.wireframe"
            type="checkbox"
          > Wireframe</label>
          <label
            class="flex items-center gap-2 text-xs"
            title="Attach Male_Head / Female_Head on kit bodies that declare a head"
          ><input
            v-model="browserState.compareHead"
            type="checkbox"
          > kit head</label>
          <template v-if="bodyBuildOwner">
            <label
              class="mt-1 block text-xs text-slate-400"
              :title="`Applies to ${bodyBuildOwner}; Normal / Child are not implemented (see tools-022 notes)`"
            >Body build · {{ bodyBuildOwner }}</label>
            <select
              v-model="browserState.bodyBuild"
              data-testid="body-build"
              class="w-full rounded bg-slate-800 px-2 py-1"
            >
              <option
                v-for="b in BODY_BUILDS"
                :key="b"
                :value="b"
              >
                {{ BODY_BUILD_LABELS[b] }}
              </option>
            </select>
          </template>
          <template v-if="bodyBuildOwner">
            <label class="mt-1 block text-xs text-slate-400">Head</label>
            <select
              v-model="browserState.kitHead"
              data-testid="kit-head"
              class="w-full rounded bg-slate-800 px-2 py-1"
            >
              <option value="auto">
                Domyślna
              </option>
              <option
                v-for="h in HEAD_VARIANTS"
                :key="h"
                :value="h"
              >
                {{ h }}
              </option>
            </select>
            <label class="mt-1 block text-xs text-slate-400">Fryzura</label>
            <select
              v-model="browserState.kitHair"
              data-testid="kit-hair"
              class="w-full rounded bg-slate-800 px-2 py-1"
            >
              <option value="auto">
                Domyślna
              </option>
              <option value="none">
                Łysy
              </option>
              <option
                v-for="h in HAIR_STYLES"
                :key="h"
                :value="h"
              >
                {{ h }}
              </option>
            </select>
            <label class="mt-1 block text-xs text-slate-400">Zarost</label>
            <select
              v-model="browserState.kitFacialHair"
              data-testid="kit-facial-hair"
              class="w-full rounded bg-slate-800 px-2 py-1"
            >
              <option value="auto">
                Domyślny
              </option>
              <option value="none">
                Brak
              </option>
              <option value="moustache">
                Wąsy
              </option>
              <option value="beard">
                Broda
              </option>
            </select>
          </template>
          <label class="mt-1 block text-xs text-slate-400">Hair color</label>
          <select
            v-model="browserState.hairColor"
            class="w-full rounded bg-slate-800 px-2 py-1"
          >
            <option value="black">
              Czarny
            </option>
            <option value="brown">
              Brąz
            </option>
            <option value="redhead">
              Rudy
            </option>
            <option value="blond">
              Blond
            </option>
            <option value="grey">
              Siwy
            </option>
            <option value="copper">
              Miedziany
            </option>
          </select>
          <label class="mt-1 block text-xs text-slate-400">Pose</label>
          <select
            v-model="poseSelect"
            class="w-full rounded bg-slate-800 px-2 py-1"
          >
            <option value="rest">
              Rest / bind
            </option>
            <option
              v-for="name in poseClipOptions"
              :key="name"
              :value="name"
            >
              {{ name }}@t=0
            </option>
          </select>
          <label class="mt-1 block text-xs text-slate-400">Focus</label>
          <select
            v-model="browserState.focus"
            class="w-full rounded bg-slate-800 px-2 py-1"
          >
            <option value="scene">
              Full scene
            </option>
            <option value="hand">
              Hand / grip
            </option>
          </select>
          <p class="mt-1 text-[10px] leading-snug text-slate-500">
            Drag the crosshair to resize panes. Double-click a view to fill the canvas.
            Orbit/zoom and layout are kept in localStorage across refresh. Reframe overwrites the saved camera.
          </p>
          <label
            v-if="browserState.lightingPreset === 'torch'"
            class="mt-2 block text-xs"
          >Torch fuel {{ Math.round(browserState.torchFuelRatio * 100) }}%</label>
          <input
            v-if="browserState.lightingPreset === 'torch'"
            v-model.number="browserState.torchFuelRatio"
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            class="w-full"
          >
          <label class="mt-1 flex items-center gap-2 text-xs"><input
            v-model="browserState.showOverlay"
            type="checkbox"
          > Report overlay</label>
        </section>

        <section>
          <h2 class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Snippets
          </h2>
          <pre class="max-h-24 overflow-auto rounded bg-slate-950 p-2 text-[10px]">{{ heldAttachSnippet() }}</pre>
          <pre class="mt-1 max-h-16 overflow-auto rounded bg-slate-950 p-2 text-[10px]">{{ lampMountSnippet() }}</pre>
        </section>

        <section class="flex gap-1">
          <button
            class="flex-1 rounded bg-emerald-700 px-2 py-1 hover:bg-emerald-600"
            @click="copyReport"
          >
            Copy report
          </button>
          <button
            class="flex-1 rounded bg-emerald-800 px-2 py-1 hover:bg-emerald-700"
            @click="saveSnapshot"
          >
            Snapshot
          </button>
        </section>

        <p class="text-xs text-slate-500">
          {{ browserState.statusMessage }}
        </p>
      </aside>

      <div class="relative min-w-0 flex-1">
        <div
          id="asset-browser-viewport"
          class="absolute inset-0"
        />
        <pre
          v-if="browserState.showOverlay"
          class="pointer-events-none absolute bottom-0 left-0 right-0 max-h-40 overflow-auto bg-black/60 p-2 text-[10px] leading-tight text-slate-200"
        >{{ browserState.reportText }}</pre>
        <div class="pointer-events-none absolute inset-x-2 top-2 flex flex-wrap items-start justify-between gap-2">
          <div
            class="pointer-events-auto flex flex-wrap items-center gap-1 rounded bg-black/55 p-1"
            role="toolbar"
            aria-label="Viewport"
          >
            <ToolbarToggle v-model="browserState.showGrid">
              Grid
            </ToolbarToggle>
            <ToolbarToggle v-model="browserState.showAxes">
              Axes
            </ToolbarToggle>
            <ToolbarToggle v-model="browserState.showGround">
              Ground
            </ToolbarToggle>
            <ToolbarToggle v-model="browserState.showBbox">
              Bounds
            </ToolbarToggle>
            <select
              v-model="browserState.lightingPreset"
              aria-label="Lighting preset"
              title="Lighting preset"
              class="rounded bg-slate-800 px-1 py-1 text-xs"
            >
              <option value="alignment">
                Alignment
              </option>
              <option value="daylight">
                Daylight
              </option>
              <option value="night">
                Night
              </option>
              <option value="torch">
                Torch
              </option>
            </select>
          </div>
          <div
            class="pointer-events-auto flex flex-wrap items-center gap-1 rounded bg-black/55 p-1"
            role="toolbar"
            aria-label="View and alignment"
          >
            <select
              v-model="browserState.layout"
              aria-label="Layout"
              title="Layout"
              class="rounded bg-slate-800 px-1 py-1 text-xs"
            >
              <option value="quad">
                Quad
              </option>
              <option value="single">
                Single
              </option>
            </select>
            <select
              v-if="browserState.layout === 'single'"
              v-model.number="browserState.activeView"
              aria-label="Active view"
              title="Active view"
              class="rounded bg-slate-800 px-1 py-1 text-xs"
            >
              <option :value="0">
                Front
              </option>
              <option :value="1">
                Side
              </option>
              <option :value="2">
                Top
              </option>
              <option :value="3">
                Perspective
              </option>
            </select>
            <ToolbarToggle
              :toggle="false"
              title="Reframe camera (overwrites the saved camera)"
              @click="viewer?.frame()"
            >
              Reframe
            </ToolbarToggle>
            <ToolbarToggle
              :toggle="false"
              @click="viewer?.align('frame')"
            >
              Align frame
            </ToolbarToggle>
            <ToolbarToggle
              :toggle="false"
              @click="viewer?.align('position')"
            >
              Align pos
            </ToolbarToggle>
            <ToolbarToggle
              :toggle="false"
              @click="viewer?.resetTargetTransform()"
            >
              Reset transform
            </ToolbarToggle>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

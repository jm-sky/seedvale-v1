<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { HOME_HOUSE_DEFINITIONS } from '../assets/houseDefinitionExample'
import ToolbarToggle from '../tools/ui/ToolbarToggle.vue'
import ToolsTopbar from '../tools/ui/ToolsTopbar.vue'
import ColliderControls from './components/ColliderControls.vue'
import HouseInfo from './components/HouseInfo.vue'
import HouseList from './components/HouseList.vue'
import LampControls from './components/LampControls.vue'
import ProfessionControls from './components/ProfessionControls.vue'
import SceneControls from './components/SceneControls.vue'
import { createHouseBrowserScene } from './houseBrowserScene'
import {
  type CameraView,
  DEFAULT_HOUSE_BROWSER_CONFIG,
  type HouseBrowserAssemblyInfo,
  type HouseBrowserScene,
} from './houseBrowserTypes'

const houses = HOME_HOUSE_DEFINITIONS

function getInitialHouseId(): string {
  const url = new URL(window.location.href)
  const param = url.searchParams.get('house')

  if (param && houses.some((h) => h.id === param)) return param
  if (param) clearQueryParam('house')

  return houses[0]?.id ?? ''
}

function boolean(param: string | null): boolean {
  return ['1', 'true', 'y', 'yes'].includes(param?.toLowerCase() ?? '') ?? false
}

function getInitialColliderVisibility(): boolean {
  const url = new URL(window.location.href)
  const param = url.searchParams.get('showColliders')
  return param ? boolean(param) : DEFAULT_HOUSE_BROWSER_CONFIG.showColliders
}

function getInitialDoorsOpen(): boolean {
  const url = new URL(window.location.href)
  const param = url.searchParams.get('doorsOpen')
  return param ? boolean(param) : DEFAULT_HOUSE_BROWSER_CONFIG.doorsOpen
}

const viewport = ref<HTMLElement | null>(null)
const selectedId = ref(getInitialHouseId())
const config = reactive({ ...DEFAULT_HOUSE_BROWSER_CONFIG, showColliders: getInitialColliderVisibility(), doorsOpen: getInitialDoorsOpen() })
const assemblyInfo = ref<HouseBrowserAssemblyInfo | null>(null)
const errorMessage = ref<string | null>(null)

let scene: HouseBrowserScene | null = null

onMounted(() => {
  if (!viewport.value) return
  scene = createHouseBrowserScene(viewport.value, {
    onAssemblyChange: (info) => {
      assemblyInfo.value = info
      if (info) {
        const { x, y, z, yawDeg } = info.defaultLamp
        config.lamp = { ...config.lamp, x, y, z, yawDeg }
      }
      errorMessage.value = null
    },
    onError: (message) => {
      errorMessage.value = message
    },
  })
  scene.setConfig({ ...config })
  if (selectedId.value) void scene.setHouse(selectedId.value)
})

onUnmounted(() => {
  scene?.dispose()
  scene = null
})

watch(selectedId, (id) => {
  if (id) void scene?.setHouse(id)
})

watch(config, () => {
  scene?.setConfig({ ...config })
})

function putIntoQueryParam(name: string, value: string): void {
  const url = new URL(window.location.href)
  url.searchParams.set(name, value)
  window.history.replaceState({}, '', url)
}

function clearQueryParam(name: string): void {
  const url = new URL(window.location.href)
  url.searchParams.delete(name)
  window.history.replaceState({}, '', url)
}

function selectHouse(id: string): void {
  putIntoQueryParam('house', id)
  selectedId.value = id
}

function resetLamp(): void {
  const d = assemblyInfo.value?.defaultLamp
  if (d) config.lamp = { ...config.lamp, x: d.x, y: d.y, z: d.z, yawDeg: d.yawDeg }
}

function resetCamera(): void {
  scene?.resetCamera()
}

function setCameraView(view: CameraView): void {
  scene?.setCameraView(view)
}

function updateColliderVisibility(visible: boolean): void {
  config.showColliders = visible
  putIntoQueryParam('showColliders', visible.toString())
}

const night = computed({
  get: () => config.lamp.night,
  set: (v: boolean) => { config.lamp = { ...config.lamp, night: v } },
})
const doorCount = computed(() => assemblyInfo.value?.doorCount ?? 0)
const CAMERA_VIEWS: { id: CameraView, label: string }[] = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'left', label: 'Left' },
  { id: 'right', label: 'Right' },
  { id: 'top', label: 'Top' },
]

function updateDoorsOpen(doorsOpen: boolean): void {
  config.doorsOpen = doorsOpen
  putIntoQueryParam('doorsOpen', doorsOpen.toString())
}
</script>

<template>
  <div class="flex h-full w-full flex-col bg-[#14181c] text-ink">
    <ToolsTopbar active-id="house-browser" />
    <div class="flex min-h-0 flex-1">
      <aside class="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-r border-white/10 bg-black/20 p-4">
        <HouseList
          :houses="houses"
          :selected-id="selectedId"
          @select="selectHouse"
        />
        <HouseInfo
          :definition="houses.find((h) => h.id === selectedId) ?? null"
          :assembly-info="assemblyInfo"
        />
        <SceneControls
          v-model:camera-auto-fit="config.cameraAutoFit"
        />
        <ColliderControls
          v-model:padding="config.colliderPadding"
        />
        <LampControls
          v-model:lamp="config.lamp"
          :default-lamp="assemblyInfo?.defaultLamp ?? null"
          @reset="resetLamp"
        />
        <ProfessionControls v-model:profession="config.profession" />
        <p
          v-if="errorMessage"
          class="rounded bg-red-950/60 p-2 text-xs text-red-200"
        >
          {{ errorMessage }}
        </p>
      </aside>
      <main class="relative flex-1">
        <div
          ref="viewport"
          class="absolute inset-0"
        />
        <div class="pointer-events-none absolute inset-x-2 top-2 flex flex-wrap items-start justify-between gap-2">
          <div
            class="pointer-events-auto flex flex-wrap gap-1 rounded bg-black/55 p-1"
            role="toolbar"
            aria-label="Scene switches"
          >
            <ToolbarToggle
              v-model="night"
              title="Night lighting (lamp preview)"
            >
              Night
            </ToolbarToggle>
            <ToolbarToggle
              :model-value="config.doorsOpen"
              :disabled="doorCount === 0"
              :title="`Open doors (${doorCount})`"
              @update:model-value="updateDoorsOpen"
            >
              Doors
            </ToolbarToggle>
            <ToolbarToggle v-model="config.showGrid">
              Grid
            </ToolbarToggle>
            <ToolbarToggle v-model="config.showGround">
              Ground
            </ToolbarToggle>
            <ToolbarToggle v-model="config.showShadows">
              Shadows
            </ToolbarToggle>
            <ToolbarToggle
              :model-value="config.showColliders"
              @update:model-value="updateColliderVisibility"
            >
              Colliders
            </ToolbarToggle>
          </div>
          <div
            class="pointer-events-auto flex flex-wrap gap-1 rounded bg-black/55 p-1"
            role="toolbar"
            aria-label="Camera"
          >
            <ToolbarToggle
              :toggle="false"
              title="Reset / fit camera"
              @click="resetCamera"
            >
              Reset / Fit
            </ToolbarToggle>
            <ToolbarToggle
              v-for="view in CAMERA_VIEWS"
              :key="view.id"
              :toggle="false"
              @click="setCameraView(view.id)"
            >
              {{ view.label }}
            </ToolbarToggle>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

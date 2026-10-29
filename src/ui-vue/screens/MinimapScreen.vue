<script setup lang="ts">
import { MapIcon } from '@lucide/vue'
import { Minus, ZoomIn, ZoomOut } from 'lucide-vue-next'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import MinimapButton from '@/components/MinimapButton.vue'
import { isTouchDevice } from '../../input/isTouchDevice'
import {
  drawMinimapFrame,
  getMinimapZoom,
  lastMinimapPlayer,
  type MinimapSettlement,
  minimapSize,
  type MinimapZoomLevel,
  registerMinimapDrawer,
  setMinimapZoom,
} from '../lib/drawMinimap'
import { getActiveMapRasterLayers } from '../lib/mapRasterLayers'
import { openWorldMap, toggleMinimap, ui } from '../store'
import type { Vector3 } from 'three'

const touch = isTouchDevice()
const size = minimapSize(touch)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null

const props = defineProps<{
  /** Parent (HudRightColumn) owns position — drop independent `fixed` offsets. */
  embedded?: boolean
}>()

// The shell is the positioning context: `fixed` in the screen corner, or
// `relative` when HudRightColumn owns placement. Never both — two
// `position` utilities on one element override each other unpredictably.
// `min-*` keeps a corner for the toggle while the lens is collapsed.
const shellClass = computed(() => {
  const base = 'pointer-events-none z-[8] min-h-6 min-w-6'
  return props.embedded ? `${base} relative` : `${base} fixed`
})

const shellStyle = computed(() => {
  if (props.embedded) return undefined
  if (touch) {
    return {
      top: 'max(68px, calc(env(safe-area-inset-top) + 52px))',
      right: 'max(16px, env(safe-area-inset-right))',
    }
  }
  return {
    top: 'max(12px, env(safe-area-inset-top))',
    right: 'max(12px, env(safe-area-inset-right))',
  }
})

function setupCanvas(canvas: HTMLCanvasElement): void {
  const dpr = window.devicePixelRatio || 1
  canvas.width = size * dpr
  canvas.height = size * dpr
  canvas.style.width = `${size}px`
  canvas.style.height = `${size}px`
  ctx = canvas.getContext('2d')
  ctx?.scale(dpr, dpr)
}

const zoom = ref<MinimapZoomLevel>(getMinimapZoom())

function applyZoom(level: MinimapZoomLevel): void {
  setMinimapZoom(level)
  zoom.value = level
  lastPaint.at = 0
}

/** Skip repainting an unchanged view; NPC dots still refresh at this cadence. */
const IDLE_REPAINT_MS = 100
const lastPaint = { x: Number.NaN, z: Number.NaN, yaw: Number.NaN, zoom: '', revision: -1, at: 0 }

function draw(playerPos: Vector3, settlements: readonly MinimapSettlement[], yaw: number): void {
  if (ui.minimap.collapsed || !ctx) return
  const now = performance.now()
  const revision = getActiveMapRasterLayers()?.revision() ?? 0
  const unchanged = Math.abs(playerPos.x - lastPaint.x) < 0.02
    && Math.abs(playerPos.z - lastPaint.z) < 0.02
    && Math.abs(yaw - lastPaint.yaw) < 0.002
    && zoom.value === lastPaint.zoom
    && revision === lastPaint.revision
  if (unchanged && now - lastPaint.at < IDLE_REPAINT_MS) return
  drawMinimapFrame({ ctx, size }, playerPos, settlements, yaw)
  Object.assign(lastPaint, { x: playerPos.x, z: playerPos.z, yaw, zoom: zoom.value, revision, at: now })
}

function onCanvasWheel(event: WheelEvent): void {
  event.preventDefault()
  applyZoom(event.deltaY < 0 ? 'near' : 'far')
}

const pointers = new Map<number, { x: number, y: number }>()
let pinchStart = 0
let pinched = false

function onCanvasPointerDown(event: PointerEvent): void {
  canvasRef.value?.setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (pointers.size === 2) {
    pinched = true
    const [a, b] = [...pointers.values()]
    pinchStart = Math.hypot(a!.x - b!.x, a!.y - b!.y)
  }
}

/** Pinch ratio that flips between the two zoom steps. */
const PINCH_STEP_RATIO = 1.15

function onCanvasPointerMove(event: PointerEvent): void {
  if (!pointers.has(event.pointerId)) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (pointers.size !== 2 || pinchStart < 1) return
  const [a, b] = [...pointers.values()]
  const ratio = Math.hypot(a!.x - b!.x, a!.y - b!.y) / pinchStart
  if (ratio > PINCH_STEP_RATIO) applyZoom('near')
  else if (ratio < 1 / PINCH_STEP_RATIO) applyZoom('far')
}

function onCanvasPointerUp(event: PointerEvent): void {
  pointers.delete(event.pointerId)
  if (pointers.size < 2) pinchStart = 0
}

function onCanvasClick(): void {
  if (pinched) {
    pinched = false
    return
  }
  const { x, z, yaw } = lastMinimapPlayer()
  openWorldMap(x, z, yaw)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (canvas) setupCanvas(canvas)
  registerMinimapDrawer(draw)
})

onUnmounted(() => {
  registerMinimapDrawer(null)
  ctx = null
})

watch(canvasRef, (canvas) => {
  if (canvas && !ctx) setupCanvas(canvas)
})
</script>

<template>
  <div
    :class="shellClass"
    :style="shellStyle"
  >
    <div
      v-show="!ui.minimap.collapsed"
      class="pointer-events-auto relative rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
    >
      <canvas
        ref="canvasRef"
        class="block cursor-pointer rounded-full"
        @click="onCanvasClick"
        @wheel.prevent="onCanvasWheel"
        @pointerdown="onCanvasPointerDown"
        @pointermove="onCanvasPointerMove"
        @pointerup="onCanvasPointerUp"
        @pointercancel="onCanvasPointerUp"
      />
      <!-- V3 lens bezel: highlight on top, heavier shade at the bottom. -->
      <div class="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_2px_3px_rgb(255_255_255/45%),inset_0_-8px_18px_rgb(0_0_0/80%),inset_5px_0_12px_rgb(0_0_0/40%),inset_-5px_0_12px_rgb(0_0_0/50%)]" />
      <div class="absolute right-0 bottom-0 flex flex-col gap-1">
        <MinimapButton
          :icon-component="ZoomIn"
          aria-label="Przybliż minimapę"
          :disabled="zoom === 'near'"
          @click="applyZoom('near')"
        />
        <MinimapButton
          :icon-component="ZoomOut"
          aria-label="Oddal minimapę"
          :disabled="zoom === 'far'"
          @click="applyZoom('far')"
        />
      </div>
    </div>
    <!-- Toggle pinned to the shell's top-right corner: over the lens when
         expanded, alone in the screen corner when collapsed. -->
    <MinimapButton
      :icon-component="ui.minimap.collapsed ? MapIcon : Minus"
      :aria-label="ui.minimap.collapsed ? 'Pokaż minimapę' : 'Ukryj minimapę'"
      class="absolute top-0 right-0 z-1"
      @click="toggleMinimap"
    />
  </div>
</template>


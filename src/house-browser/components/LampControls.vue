<script setup lang="ts">
import type { HouseBrowserLampConfig, HouseBrowserLampDefault } from '../houseBrowserTypes'

const lamp = defineModel<HouseBrowserLampConfig>('lamp', { required: true })
defineProps<{ defaultLamp: HouseBrowserLampDefault | null }>()
const emit = defineEmits<{ reset: [] }>()

const AXES = [
  { key: 'x', min: -8, max: 8 },
  { key: 'y', min: 0, max: 5 },
  { key: 'z', min: -8, max: 8 },
] as const

function setAxis(key: 'x' | 'y' | 'z', value: number): void {
  if (Number.isFinite(value)) lamp.value = { ...lamp.value, [key]: value }
}
/** Effective yaw shown on the slider: explicit value or the game's auto yaw (outward through the mount). */
function effectiveYaw(): number {
  const l = lamp.value
  if (l.yawDeg !== null) return l.yawDeg
  return Math.round((Math.atan2(l.x, l.z) * 180) / Math.PI)
}
function setYaw(value: number): void {
  if (Number.isFinite(value)) patch({ yawDeg: value })
}
const YAW_PRESETS = [
  { label: 'Front', deg: 180 },
  { label: 'Right', deg: 90 },
  { label: 'Back', deg: 0 },
  { label: 'Left', deg: -90 },
] as const

function patch(p: Partial<HouseBrowserLampConfig>): void {
  lamp.value = { ...lamp.value, ...p }
}
</script>

<template>
  <section class="flex flex-col gap-2">
    <h2 class="text-xs font-semibold uppercase tracking-wide text-white/60">
      Lamp
    </h2>
    <label class="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        :checked="lamp.show"
        @change="patch({ show: ($event.target as HTMLInputElement).checked })"
      >
      Show Lamp
    </label>
    <div
      v-for="axis in AXES"
      :key="axis.key"
      class="flex items-center gap-2 text-sm"
    >
      <span class="w-4 uppercase">{{ axis.key }}</span>
      <input
        class="flex-1"
        type="range"
        step="0.01"
        :min="axis.min"
        :max="axis.max"
        :value="lamp[axis.key]"
        @input="setAxis(axis.key, ($event.target as HTMLInputElement).valueAsNumber)"
      >
      <input
        class="w-16 rounded bg-white/10 px-1"
        type="number"
        step="0.01"
        :value="lamp[axis.key]"
        @input="setAxis(axis.key, ($event.target as HTMLInputElement).valueAsNumber)"
      >
    </div>
    <div class="flex items-center gap-2 text-sm">
      <span class="w-16">Yaw</span>
      <input
        class="flex-1"
        type="range"
        min="-180"
        max="180"
        step="1"
        :value="effectiveYaw()"
        @input="setYaw(($event.target as HTMLInputElement).valueAsNumber)"
      >
      <input
        class="w-14 rounded bg-white/10 px-1"
        type="number"
        step="1"
        :value="effectiveYaw()"
        @input="setYaw(($event.target as HTMLInputElement).valueAsNumber)"
      >
    </div>
    <div class="flex flex-wrap items-center gap-1 text-xs">
      <button
        v-for="p in YAW_PRESETS"
        :key="p.label"
        class="rounded bg-white/10 px-2 py-1"
        type="button"
        @click="setYaw(p.deg)"
      >
        {{ p.label }} {{ p.deg }}°
      </button>
      <button
        class="rounded bg-white/10 px-2 py-1"
        type="button"
        @click="patch({ yawDeg: null })"
      >
        Auto{{ lamp.yawDeg === null ? ' ✓' : '' }}
      </button>
    </div>
    <div class="flex items-center gap-2 text-sm">
      <span class="w-16">Intensity</span>
      <input
        class="flex-1"
        type="range"
        min="0"
        max="20"
        step="0.1"
        :value="lamp.intensity"
        @input="patch({ intensity: ($event.target as HTMLInputElement).valueAsNumber })"
      >
      <span class="w-10 text-right">{{ lamp.intensity.toFixed(1) }}</span>
    </div>
    <p class="font-mono text-xs text-white/60">
      ({{ lamp.x.toFixed(2) }}, {{ lamp.y.toFixed(2) }}, {{ lamp.z.toFixed(2) }}) yaw {{ effectiveYaw() }}°
      <template v-if="defaultLamp">
        · def ({{ defaultLamp.x.toFixed(2) }}, {{ defaultLamp.y.toFixed(2) }}, {{ defaultLamp.z.toFixed(2) }}) {{ defaultLamp.style }}
      </template>
    </p>
    <button
      class="self-start rounded bg-white/10 px-2 py-1 text-xs"
      type="button"
      @click="emit('reset')"
    >
      Reset to definition
    </button>
  </section>
</template>

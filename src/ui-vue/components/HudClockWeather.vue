<script setup lang="ts">
/**
 * Stage E (ui-input-043): ClockWeather HUD chrome — horizontal row like V3,
 * with clearer vertical centering and spacing.
 * Presentation-only — time/phase/weather come from V1 producers via props.
 * @domain ui
 */
import { Cloud, CloudFog, CloudLightning, CloudRain, Snowflake, Sun } from 'lucide-vue-next'
import { type Component, computed } from 'vue'

export type HudWeatherKind = 'clear' | 'cloudy' | 'rain' | 'fog' | 'snow' | 'storm'

const props = defineProps<{
  time: string
  phase: string
  seasonLabel: string
  weatherLabel: string
  temperatureText: string
  weatherKind: HudWeatherKind | ''
}>()

const ICONS: Record<HudWeatherKind, Component> = {
  clear: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  fog: CloudFog,
  snow: Snowflake,
  storm: CloudLightning,
}

const icon = computed(() => (props.weatherKind ? ICONS[props.weatherKind] : null))
const hasWeather = computed(() => Boolean(props.weatherLabel && props.temperatureText))
const dayLine = computed(() => {
  const parts = [props.phase, props.seasonLabel].filter(Boolean)
  return parts.join(' · ')
})
</script>

<template>
  <div
    role="group"
    aria-label="Czas i pogoda"
    class="inline-flex max-w-full flex-wrap items-center gap-x-1.5 gap-y-1 rounded-md bg-neutral-900/70 px-3 py-2 text-sm leading-none select-none"
    data-testid="hud-clock-weather"
  >
    <span class="font-semibold tabular-nums text-[20px] leading-none tracking-wide mr-1">
      {{ time }}
    </span>
    <span
      v-if="dayLine"
      class="text-[13px] leading-none text-neutral-200/85"
    >
      {{ dayLine }}
    </span>
    <template v-if="hasWeather">
      <span
        class="inline-flex items-center gap-1.5 text-[13px] leading-none text-neutral-200/80"
      >
        <component
          :is="icon"
          v-if="icon"
          class="size-4 shrink-0 text-neutral-100/90"
          aria-hidden="true"
        />
        <span>{{ weatherLabel }} · {{ temperatureText }}</span>
      </span>
    </template>
  </div>
</template>

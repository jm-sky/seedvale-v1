<script setup lang="ts">
/**
 * Stage E D9 demo — same HUD presentation leaves as live screens.
 * Fixtures and callbacks are demo-local only (no world / save / WorldBundle).
 * @domain ui
 */
import { computed, ref } from 'vue'
import HudBottomPanel from '../../components/HudBottomPanel.vue'
import HudCarryStatus from '../../components/HudCarryStatus.vue'
import HudClockWeather from '../../components/HudClockWeather.vue'
import HudGazeChip from '../../components/HudGazeChip.vue'
import HudNeedsReadout from '../../components/HudNeedsReadout.vue'
import HudToastStack from '../../components/HudToastStack.vue'
import {
  clockFixture,
  DEMO_SCENARIOS,
  type DemoViewId,
  gazeDisabledFixture,
  gazeOkFixture,
  needsFixture,
  placementFixture,
  toastFixture,
} from './fixtures'

const selectedId = ref<DemoViewId>('clock-clear')
const log = ref<string[]>([])
const holdProgress = ref(0.55)

const scenario = computed(() => DEMO_SCENARIOS.find((s) => s.id === selectedId.value) ?? DEMO_SCENARIOS[0])

const clock = computed(() =>
  clockFixture(selectedId.value === 'clock-storm' ? 'storm' : 'clear'),
)

const needs = computed(() =>
  needsFixture(selectedId.value === 'needs-critical' ? 'critical' : 'full'),
)

const gaze = computed(() =>
  selectedId.value === 'gaze-disabled' ? gazeDisabledFixture() : gazeOkFixture(),
)

const placement = computed(() =>
  placementFixture(selectedId.value === 'placement-invalid' ? 'invalid' : 'valid'),
)

function selectScenario(id: DemoViewId): void {
  selectedId.value = id
  log.value = []
}

function resetDemo(): void {
  selectScenario('clock-clear')
}

function pushLog(message: string): void {
  log.value = [`[demo] ${message}`, ...log.value].slice(0, 8)
}

const showClock = computed(() =>
  selectedId.value === 'clock-clear'
  || selectedId.value === 'clock-storm'
  || selectedId.value.startsWith('needs'),
)
const showNeeds = computed(() => selectedId.value.startsWith('needs') || selectedId.value.startsWith('clock'))
const showToasts = computed(() => selectedId.value === 'toasts')
const showGaze = computed(() => selectedId.value.startsWith('gaze'))
const showPlacement = computed(() => selectedId.value.startsWith('placement'))
const showBusy = computed(() => selectedId.value === 'busy')
</script>

<template>
  <div class="relative min-h-dvh overflow-hidden bg-[oklch(0.2_0.015_60)] text-neutral-200">
    <header class="relative z-10 mx-auto max-w-4xl p-4">
      <p class="text-xs uppercase tracking-wide text-amber-200/80">
        Demo Stage E — HUD (bez świata / save)
      </p>
      <h1 class="text-lg font-semibold text-neutral-100">
        Te same leaves co live HudScreen / Toast / gaze / placement
      </h1>
      <p class="mt-1 text-sm text-neutral-400">
        Bez CompassStrip · E/R/V przez slotInputKey · callbacki lokalne.
      </p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="s in DEMO_SCENARIOS"
          :key="s.id"
          type="button"
          class="rounded-md border px-2.5 py-1 text-xs"
          :class="s.id === selectedId ? 'border-amber-400/60 bg-amber-900/30' : 'border-neutral-600 hover:bg-neutral-800'"
          @click="selectScenario(s.id)"
        >
          {{ s.label }}
        </button>
        <button
          type="button"
          class="rounded-md border border-neutral-600 px-2.5 py-1 text-xs hover:bg-neutral-800"
          @click="resetDemo"
        >
          Reset
        </button>
      </div>
    </header>

    <!-- Simulated HUD layer -->
    <div class="sv-hud pointer-events-none absolute inset-0">
      <div
        v-if="showClock || showNeeds"
        class="absolute left-4 top-20"
      >
        <HudClockWeather
          v-if="showClock"
          :time="clock.time"
          :phase="clock.phase"
          :season-label="clock.seasonLabel"
          :weather-label="clock.weatherLabel"
          :temperature-text="clock.temperatureText"
          :weather-kind="clock.weatherKind"
        />
        <HudNeedsReadout
          v-if="showNeeds"
          :bars="needs"
        />
        <HudCarryStatus
          v-if="showClock || showNeeds"
          weight="12.4/40.0 kg"
          held="w ręce: topór dwuręczny z długą nazwą"
          held-ammo="Amunicja: 8"
          player-condition="Zmęczony"
          fps="60 FPS"
          :show-fps="true"
        />
      </div>

      <div
        v-if="showToasts"
        class="absolute left-1/2 top-20 -translate-x-1/2"
      >
        <HudToastStack :rows="toastFixture()" />
      </div>

      <div
        v-if="showGaze"
        class="absolute bottom-[90px] left-1/2 -translate-x-1/2"
      >
        <HudGazeChip
          :interaction-prompt="gaze"
          :fallback-prompt="null"
          :highlighted="selectedId === 'gaze-ok'"
          :progress="selectedId === 'gaze-ok' ? holdProgress : null"
        />
      </div>

      <div
        v-if="showPlacement"
        class="absolute inset-x-0 bottom-24 flex justify-center"
      >
        <HudBottomPanel interactive>
          <div>{{ placement.label }}</div>
          <div
            class="text-[13px]"
            :class="placement.state === 'invalid' ? 'text-bad' : 'text-good'"
          >
            {{ placement.reasonLabel }}
          </div>
          <div
            v-if="placement.supportsRotation"
            class="flex items-center gap-2"
          >
            <button
              type="button"
              class="cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-800/55 px-3 py-1 text-[13px] hover:bg-neutral-700/65"
              @click="pushLog('Rotate left (demo-local)')"
            >
              ↶ [F]
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-800/55 px-3 py-1 text-[13px] hover:bg-neutral-700/65"
              @click="pushLog('Rotate right (demo-local)')"
            >
              [G] ↷
            </button>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-800/55 px-3 py-1 text-[13px] hover:bg-neutral-700/65 disabled:cursor-default disabled:text-neutral-400"
              :disabled="!placement.canConfirm"
              @click="pushLog('Confirm placement (demo-local)')"
            >
              {{ placement.confirmLabel }}
            </button>
            <button
              type="button"
              class="cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-800/55 px-3 py-1 text-[13px] hover:bg-neutral-700/65"
              @click="pushLog('Abort placement (demo-local)')"
            >
              Anuluj [Esc]
            </button>
          </div>
        </HudBottomPanel>
      </div>

      <div
        v-if="showBusy"
        class="absolute inset-0 flex items-center justify-center"
      >
        <HudBottomPanel>
          Przygotowanie terenu…
          <div class="mt-1.5 h-1 w-40 overflow-hidden rounded-full bg-white/20">
            <div
              class="h-full w-[62%] bg-primary"
            />
          </div>
          <button
            type="button"
            class="pointer-events-auto mt-2 cursor-pointer rounded-md border border-neutral-500/45 bg-neutral-800/55 px-3 py-1 text-[13px] hover:bg-neutral-700/65"
            @click="pushLog('Abort busy (demo-local)')"
          >
            Esc — przerwij
          </button>
        </HudBottomPanel>
      </div>
    </div>

    <p class="absolute bottom-4 left-4 z-10 text-xs text-neutral-500">
      Scenariusz: {{ scenario.label }}
    </p>

    <ul
      v-if="log.length"
      class="absolute bottom-4 right-4 z-10 max-w-sm space-y-1 font-mono text-xs text-neutral-500"
    >
      <li
        v-for="(line, i) in log"
        :key="i"
      >
        {{ line }}
      </li>
    </ul>
  </div>
</template>

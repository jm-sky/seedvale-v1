<script setup lang="ts">
import { ref } from 'vue'
import type { LoadoutStatView } from '../../../items/equipmentPreview'
import {
  DAMAGE_CHANNEL_LABELS,
  DAMAGE_CHANNELS,
  PROTECTION_PROFILE_KEYS,
  PROTECTION_PROFILE_LABEL,
  type ProtectionProfileKey,
} from '../../../items/armorProtectionDisplay'
import ProtectionTable from './ProtectionTable.vue'

/** Loadout summary: expected protection per channel (UI-only profile switch), restrictions, masses.
 * Numbers come from the shared protection snapshot; this component only formats them. Block chance
 * belongs to the held weapon and is never shown here.
 * @domain ui-input */
const props = defineProps<{
  current: LoadoutStatView
  delta?: LoadoutStatView | null
  context: string
  /** Stale/non-armor candidate: the preview is unavailable and says why. */
  unavailableReason?: string | null
  carriedWeightKg?: number | null
  carryCapacityKg?: number | null
}>()

type BetterWhen = 'higher' | 'lower'

const profile = ref<ProtectionProfileKey>('reference')
const tableOpen = ref(false)

function deltaClass(value: number, better: BetterWhen): string {
  if (value === 0) return 'text-neutral-500'
  const improved = better === 'higher' ? value > 0 : value < 0
  return improved ? 'text-good' : 'text-warn'
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function formatDeltaPercent(value: number): string {
  if (Math.round(value * 100) === 0) return ''
  const sign = value > 0 ? '+' : '−'
  return `${sign}${Math.round(Math.abs(value) * 100)}%`
}

function formatKg(value: number): string {
  return `${value.toFixed(2)} kg`
}

function formatDeltaKg(value: number): string {
  if (Math.abs(value) < 1e-9) return ''
  return `${value > 0 ? '+' : '−'}${Math.abs(value).toFixed(2)} kg`
}

type RestrictionKey = 'attackStaminaDelta' | 'rangedStaminaDelta' | 'meleeRecoveryDelta' | 'movementSpeedDelta' | 'sprintStaminaDelta'
type RestrictionRow = { key: RestrictionKey, label: string, better: BetterWhen }

const RESTRICTION_ROWS: readonly RestrictionRow[] = [
  { key: 'attackStaminaDelta', label: 'Wysiłek ataku wręcz', better: 'lower' },
  { key: 'rangedStaminaDelta', label: 'Wysiłek strzału', better: 'lower' },
  { key: 'meleeRecoveryDelta', label: 'Tempo ataku', better: 'lower' },
  { key: 'movementSpeedDelta', label: 'Ruch', better: 'higher' },
  { key: 'sprintStaminaDelta', label: 'Sprint', better: 'lower' },
]
</script>

<template>
  <div>
    <p
      id="inventory-loadout-context"
      class="mb-2 text-xs"
      :class="unavailableReason ? 'text-warn' : 'text-neutral-400'"
      :role="unavailableReason ? 'status' : undefined"
    >
      {{ unavailableReason ?? context }}
    </p>

    <div
      class="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1"
      role="group"
      aria-label="Profil trafienia (tylko podgląd)"
    >
      <span class="text-xs text-neutral-500">Ochrona oczekiwana:</span>
      <button
        v-for="key in PROTECTION_PROFILE_KEYS"
        :key="key"
        type="button"
        class="rounded px-1.5 text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        :class="profile === key ? 'bg-neutral-700 text-neutral-50' : 'text-neutral-400 hover:text-neutral-100'"
        :aria-pressed="profile === key"
        @click="profile = key"
      >
        {{ PROTECTION_PROFILE_LABEL[key] }}
      </button>
    </div>

    <dl class="grid grid-cols-3 gap-2 text-sm sm:grid-cols-4">
      <div
        v-for="channel in DAMAGE_CHANNELS"
        :key="channel"
      >
        <dt class="text-xs text-neutral-500">
          {{ DAMAGE_CHANNEL_LABELS[channel] }} ({{ PROTECTION_PROFILE_LABEL[profile].toLowerCase() }})
        </dt>
        <dd class="tabular-nums">
          {{ formatPercent(current.expectedByProfile[profile][channel]) }}
          <span
            v-if="props.delta && formatDeltaPercent(props.delta.expectedByProfile[profile][channel])"
            class="ml-1 text-xs"
            :class="deltaClass(props.delta.expectedByProfile[profile][channel], 'higher')"
          >{{ formatDeltaPercent(props.delta.expectedByProfile[profile][channel]) }}</span>
        </dd>
      </div>

      <div
        v-for="row in RESTRICTION_ROWS"
        :key="row.key"
      >
        <dt class="text-xs text-neutral-500">
          {{ row.label }}
        </dt>
        <dd class="tabular-nums">
          {{ formatDeltaPercent(current[row.key]) || '±0%' }}
          <span
            v-if="props.delta && formatDeltaPercent(props.delta[row.key])"
            class="ml-1 text-xs"
            :class="deltaClass(props.delta[row.key], row.better)"
          >{{ formatDeltaPercent(props.delta[row.key]) }}</span>
        </dd>
      </div>

      <div>
        <dt class="text-xs text-neutral-500">
          Waga zbroi
        </dt>
        <dd class="tabular-nums">
          {{ formatKg(current.gearWeightKg) }}
          <span
            v-if="props.delta && formatDeltaKg(props.delta.gearWeightKg)"
            class="ml-1 text-xs"
            :class="deltaClass(props.delta.gearWeightKg, 'lower')"
          >{{ formatDeltaKg(props.delta.gearWeightKg) }}</span>
        </dd>
      </div>
      <div v-if="carriedWeightKg != null">
        <dt class="text-xs text-neutral-500">
          Noszony ciężar (cały)
        </dt>
        <dd class="tabular-nums">
          {{ carriedWeightKg.toFixed(1) }}<template v-if="carryCapacityKg != null">
            / {{ carryCapacityKg.toFixed(1) }}
          </template> kg
        </dd>
      </div>
    </dl>

    <p class="mt-2 text-xs text-neutral-500">
      Wartości orientacyjne, nie mnożnik obrażeń. Szansa bloku zależy od trzymanej broni.
    </p>

    <button
      type="button"
      class="mt-1 text-xs text-neutral-400 underline-offset-2 hover:text-neutral-100 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      :aria-expanded="tableOpen"
      aria-controls="inventory-protection-table"
      @click="tableOpen = !tableOpen"
    >
      {{ tableOpen ? 'Ukryj tabelę regionów' : 'Tabela regionów 7 × 3' }}
    </button>
    <div
      v-if="tableOpen"
      id="inventory-protection-table"
      class="mt-1"
    >
      <ProtectionTable
        :current="current"
        :delta="delta ?? null"
      />
    </div>
  </div>
</template>

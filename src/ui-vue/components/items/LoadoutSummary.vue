<script setup lang="ts">
import type { LoadoutStatView } from '../../../items/equipmentPreview'

const props = defineProps<{
  current: LoadoutStatView
  delta?: LoadoutStatView | null
  context: string
}>()

type BetterWhen = 'higher' | 'lower'

function deltaClass(value: number, better: BetterWhen): string {
  if (value === 0) return 'text-neutral-500'
  const improved = better === 'higher' ? value > 0 : value < 0
  return improved ? 'text-good' : 'text-warn'
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

function formatDeltaPercent(value: number): string {
  if (value === 0) return ''
  const sign = value > 0 ? '+' : '−'
  return `${sign}${Math.round(Math.abs(value) * 100)}%`
}

function formatNumber(value: number, digits = 2): string {
  return value.toFixed(digits)
}

function formatDeltaNumber(value: number, unit = '', digits = 2): string {
  if (Math.abs(value) < 1e-9) return ''
  const sign = value > 0 ? '+' : '−'
  return `${sign}${Math.abs(value).toFixed(digits)}${unit}`
}

const d = () => props.delta ?? null
</script>

<template>
  <div>
    <p
      id="inventory-loadout-context"
      class="mb-2 text-xs text-neutral-400"
    >
      {{ context }}
    </p>
    <dl class="grid grid-cols-3 gap-2 text-sm sm:grid-cols-6">
      <div>
        <dt class="text-xs text-neutral-500">
          Ochrona
        </dt>
        <dd class="tabular-nums">
          {{ formatPercent(current.damageReduction) }}
          <span
            v-if="d() && d()!.damageReduction !== 0"
            class="ml-1 text-xs"
            :class="deltaClass(d()!.damageReduction, 'higher')"
          >{{ formatDeltaPercent(d()!.damageReduction) }}</span>
        </dd>
      </div>
      <div>
        <dt class="text-xs text-neutral-500">
          Wysiłek ataku
        </dt>
        <dd class="tabular-nums">
          {{ formatDeltaPercent(current.attackStaminaDelta) || '±0%' }}
          <span
            v-if="d() && d()!.attackStaminaDelta !== 0"
            class="ml-1 text-xs"
            :class="deltaClass(d()!.attackStaminaDelta, 'lower')"
          >{{ formatDeltaPercent(d()!.attackStaminaDelta) }}</span>
        </dd>
      </div>
      <div>
        <dt class="text-xs text-neutral-500">
          Tempo ataku
        </dt>
        <dd class="tabular-nums">
          {{ formatDeltaPercent(current.meleeRecoveryDelta) || '±0%' }}
          <span
            v-if="d() && d()!.meleeRecoveryDelta !== 0"
            class="ml-1 text-xs"
            :class="deltaClass(d()!.meleeRecoveryDelta, 'lower')"
          >{{ formatDeltaPercent(d()!.meleeRecoveryDelta) }}</span>
        </dd>
      </div>
      <div>
        <dt class="text-xs text-neutral-500">
          Ruch
        </dt>
        <dd class="tabular-nums">
          {{ formatDeltaPercent(current.movementSpeedDelta) || '±0%' }}
          <span
            v-if="d() && d()!.movementSpeedDelta !== 0"
            class="ml-1 text-xs"
            :class="deltaClass(d()!.movementSpeedDelta, 'higher')"
          >{{ formatDeltaPercent(d()!.movementSpeedDelta) }}</span>
        </dd>
      </div>
      <div>
        <dt class="text-xs text-neutral-500">
          Sprint
        </dt>
        <dd class="tabular-nums">
          {{ formatDeltaPercent(current.sprintStaminaDelta) || '±0%' }}
          <span
            v-if="d() && d()!.sprintStaminaDelta !== 0"
            class="ml-1 text-xs"
            :class="deltaClass(d()!.sprintStaminaDelta, 'lower')"
          >{{ formatDeltaPercent(d()!.sprintStaminaDelta) }}</span>
        </dd>
      </div>
      <div>
        <dt class="text-xs text-neutral-500">
          Waga zbroi
        </dt>
        <dd class="tabular-nums">
          {{ formatNumber(current.gearWeightKg) }} kg
          <span
            v-if="d() && d()!.gearWeightKg !== 0"
            class="ml-1 text-xs"
            :class="deltaClass(d()!.gearWeightKg, 'lower')"
          >{{ formatDeltaNumber(d()!.gearWeightKg, ' kg') }}</span>
        </dd>
      </div>
      <div>
        <dt class="text-xs text-neutral-500">
          Cut / pierce / blunt
        </dt>
        <dd class="text-xs text-neutral-500">
          N/A
        </dd>
      </div>
      <div>
        <dt class="text-xs text-neutral-500">
          DPS · cena
        </dt>
        <dd class="text-xs text-neutral-500">
          N/A
        </dd>
      </div>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ArmorQuality } from '../../../items/itemInstances'
import type { DetailMeterRow } from './buildItemDetailPresentation'
import { ARMOR_QUALITY_LABELS } from '../../../items/itemInstances'
import { formatCoins } from '../../lib/formatCoins'
import { TONE_TEXT } from './meters'
import QualityTag from './QualityTag.vue'
import StatBar from './StatBar.vue'
import StatIcon from './StatIcon.vue'

/** V1 `common` ≡ V3 donor `average` — default when the piece has no quality state. */
const DEFAULT_QUALITY: ArmorQuality = 'common'

const props = defineProps<{
  meters: DetailMeterRow[]
  /** Armor quality enum — coloured QualityTag in the V3-style header. */
  quality?: ArmorQuality | null
  /** Fallback quality label when enum is absent. */
  qualityLabel?: string | null
  /** Reference catalogue value in copper (shown as Wartość). */
  worthCoins?: number | null
  /** Optional stack count badge when > 1. */
  stackCount?: number | null
}>()

const resolvedQuality = computed<ArmorQuality>(() => props.quality ?? DEFAULT_QUALITY)
const resolvedQualityLabel = computed(() => {
  if (props.quality) return props.qualityLabel
  return props.qualityLabel?.trim() || ARMOR_QUALITY_LABELS[DEFAULT_QUALITY]
})
const showWorth = computed(() => props.worthCoins != null && Number.isFinite(props.worthCoins))
const showStack = computed(() => (props.stackCount ?? 0) > 1)
const showRoot = computed(() => true)
</script>

<template>
  <div
    v-if="showRoot"
    class="flex flex-col gap-2 text-xs text-neutral-400"
  >
    <!-- V3 InstanceMeters header: QualityTag · stack · Worth -->
    <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
      <QualityTag
        :quality="resolvedQuality"
        :label="resolvedQualityLabel"
      />
      <span v-if="showStack">
        Stos <span class="text-neutral-200">×{{ stackCount }}</span>
      </span>
      <span v-if="showWorth">
        <StatIcon
          name="price"
          class="mr-1"
        />Wartość <span class="text-neutral-200">{{ formatCoins(worthCoins ?? 0) }}</span>
      </span>
    </div>

    <div
      v-if="meters.length > 0"
      class="grid grid-cols-[5.5rem_minmax(6rem,14rem)_auto] items-center gap-x-3 gap-y-1.5"
    >
      <template
        v-for="(row, i) in meters"
        :key="`${row.label}-${i}`"
      >
        <span>
          <StatIcon
            v-if="row.icon"
            :name="row.icon"
            class="mr-1"
          />{{ row.label }}
        </span>
        <template v-if="row.unavailable">
          <!-- D4: gray empty bar — no fabricated fill percent -->
          <StatBar
            class="opacity-50"
            :value="0"
            tone="neutral"
            :title="row.title ?? `${row.label} N/A`"
          />
          <span class="tabular-nums text-neutral-500 italic opacity-50">—</span>
        </template>
        <template v-else-if="row.ratio != null">
          <StatBar
            :value="row.ratio"
            :tone="row.tone"
            :title="row.title"
          />
          <span
            class="tabular-nums"
            :class="TONE_TEXT[row.tone]"
          >{{ Math.round(row.ratio * 100) }}%</span>
        </template>
        <template v-else>
          <StatBar
            class="opacity-50"
            :value="0"
            tone="neutral"
            :title="row.title ?? `${row.label} N/A`"
          />
          <span class="tabular-nums text-neutral-500 italic opacity-50">—</span>
        </template>
      </template>
    </div>
  </div>
</template>

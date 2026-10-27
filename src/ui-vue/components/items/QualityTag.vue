<script setup lang="ts">
import { computed } from 'vue'
import type { ArmorQuality } from '../../../items/itemInstances'
import { ARMOR_QUALITY_LABELS } from '../../../items/itemInstances'
import { QUALITY_TAG } from './itemIcons'

const props = defineProps<{
  /** Preferred: drives colour from V3 QUALITY_TAG map. */
  quality?: ArmorQuality | null
  /** Fallback label when quality enum is unavailable. */
  label?: string | null
}>()

const text = computed(() => {
  if (props.quality) return ARMOR_QUALITY_LABELS[props.quality]
  return props.label?.trim() || ''
})

const toneClass = computed(() =>
  props.quality ? QUALITY_TAG[props.quality] : 'border-neutral-600 text-neutral-300',
)
</script>

<template>
  <span
    v-if="text"
    class="rounded border px-1.5 py-0 text-[11px] capitalize"
    :class="toneClass"
  >
    {{ text }}
  </span>
</template>

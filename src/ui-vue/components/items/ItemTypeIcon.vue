<script setup lang="ts">
import { computed } from 'vue'
import type { ItemCategory, ItemKind } from '../../../items/items'
import { resolveItemCategoryIconSrc, resolveItemKindIconSrc } from './itemIcons'

const props = defineProps<{
  kind?: ItemKind
  category: ItemCategory
  label?: string
}>()

const svg = computed(() =>
  props.kind
    ? resolveItemKindIconSrc(props.kind, props.category)
    : resolveItemCategoryIconSrc(props.category),
)
</script>

<template>
  <!-- SVG strings are static donor assets (not user content). -->
  <!-- eslint-disable vue/no-v-html -->
  <span
    role="img"
    class="inline-block shrink-0 [&_svg]:block [&_svg]:size-full"
    :aria-label="label ?? category"
    :title="label ?? category"
    v-html="svg"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

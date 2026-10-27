<script setup lang="ts">
import type { ItemStatIconName } from './itemIcons'
import { resolveItemStatIconSrc } from './itemIcons'

defineProps<{ name: ItemStatIconName }>()
</script>

<template>
  <!-- Static local SVG; the adjacent stat label supplies the accessible name. -->
  <!-- eslint-disable vue/no-v-html -->
  <span
    aria-hidden="true"
    class="inline-block size-3.5 shrink-0 align-[-3px] text-neutral-400 [&_svg]:block [&_svg]:size-full"
    v-html="resolveItemStatIconSrc(name)"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

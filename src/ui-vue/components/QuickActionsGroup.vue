<script setup lang="ts">
/**
 * Quick Actions section stack (Stage C spacing aligned with MenuPanel body gaps).
 * @domain ui
 */
import QuickActionsGroupLabel from './QuickActionsGroupLabel.vue'

defineProps<{
  label?: string | null
}>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <QuickActionsGroupLabel
      v-if="label"
      :label
    />
    <div class="flex flex-wrap content-start items-start gap-2">
      <slot />
    </div>
  </div>
</template>

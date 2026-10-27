<script setup lang="ts">
/**
 * Stage E (ui-input-043): shared warm bottom/center action panel chrome
 * for placement / busy / lodging overlays.
 * @domain ui
 */
defineProps<{
  /** When true, allow pointer events on children (buttons). */
  interactive?: boolean
}>()
</script>

<template>
  <div
    class="relative flex flex-col items-center gap-1.5 rounded-lg border border-neutral-500/45 bg-neutral-900/80 px-4.5 py-2 text-[15px] text-neutral-50 shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
    :class="interactive ? 'pointer-events-auto' : 'pointer-events-none'"
    data-testid="hud-bottom-panel"
  >
    <slot />
  </div>
</template>

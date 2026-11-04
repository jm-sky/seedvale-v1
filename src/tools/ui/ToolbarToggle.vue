<script setup lang="ts">
/**
 * Compact on/off button for viewport toolbars. Binds to an existing reactive field via v-model;
 * `pressed` state is visible and exposed via `aria-pressed`. Omit v-model for a plain action button.
 * @domain tools
 */
withDefaults(defineProps<{ title?: string, disabled?: boolean, toggle?: boolean }>(), {
  title: undefined,
  disabled: false,
  toggle: true,
})
const pressed = defineModel<boolean>({ default: false })
</script>

<template>
  <button
    type="button"
    :title="title"
    :disabled="disabled"
    :aria-pressed="toggle ? pressed : undefined"
    class="rounded px-2 py-1 text-xs text-slate-100 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
    :class="toggle && pressed ? 'bg-sky-500/50' : 'bg-white/10'"
    @click="toggle ? (pressed = !pressed) : undefined"
  >
    <slot />
  </button>
</template>

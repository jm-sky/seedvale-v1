<script setup lang="ts">
import { computed } from 'vue'
import { TOOLS } from '../toolRegistry'

/**
 * Shared dark navigation strip for developer browsers (plan tools-025).
 * Plain page navigation over `TOOLS`; never imports another tool's scene.
 * @domain tools
 */
const props = defineProps<{ activeId: string }>()

const MAIN_IDS = ['house-browser', 'asset-browser'] as const
const mainTools = computed(() => TOOLS.filter((t) => (MAIN_IDS as readonly string[]).includes(t.id)))
const otherTools = computed(() => TOOLS.filter((t) => !(MAIN_IDS as readonly string[]).includes(t.id)))
const otherActive = computed(() => otherTools.value.some((t) => t.id === props.activeId))
</script>

<template>
  <nav
    class="flex h-9 shrink-0 items-center gap-1 border-b border-white/10 bg-[#0e1114] px-3 text-sm text-slate-200"
    aria-label="Developer tools"
  >
    <span class="mr-3 font-semibold tracking-wide">SeedVale Tools</span>
    <a
      v-for="tool in mainTools"
      :key="tool.id"
      :href="tool.path"
      :title="tool.description"
      :aria-current="tool.id === activeId ? 'page' : undefined"
      class="rounded px-2 py-1 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
      :class="tool.id === activeId ? 'bg-sky-500/20 text-sky-200' : ''"
    >{{ tool.label }}</a>
    <details
      v-if="otherTools.length"
      class="relative"
    >
      <summary
        class="cursor-pointer list-none rounded px-2 py-1 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
        :class="otherActive ? 'bg-sky-500/20 text-sky-200' : ''"
      >
        Tools ▾
      </summary>
      <div class="absolute left-0 top-full z-50 mt-1 flex min-w-48 flex-col rounded border border-white/10 bg-[#0e1114] p-1 shadow">
        <a
          v-for="tool in otherTools"
          :key="tool.id"
          :href="tool.path"
          :title="tool.description"
          class="rounded px-2 py-1 hover:bg-white/10"
        >{{ tool.label }}</a>
      </div>
    </details>
  </nav>
</template>

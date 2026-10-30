<script setup lang="ts">
import { ref } from 'vue'
import DemoButton from '@/components/ui/DemoButton.vue'

/**
 * Shared chrome for Character / Inventory / Merchant demos (v3 ItemsShell analog).
 * Full page reload between HTML entries — no world / save.
 * @domain ui
 */
export type DemoPage = 'character' | 'inventory' | 'merchant' | 'dialogue'

defineProps<{
  current: DemoPage
  title: string
}>()

const logOpen = ref(false)

const PAGES: { id: DemoPage, label: string, href: string }[] = [
  { id: 'character', label: 'Character', href: 'character-skills-demo.html' },
  { id: 'inventory', label: 'Inventory', href: 'inventory-list-demo.html' },
  { id: 'merchant', label: 'Shop', href: 'merchant-demo.html' },
  { id: 'dialogue', label: 'Dialogue', href: 'dialogue-demo.html' },
]
</script>

<template>
  <div class="sv-demo-shell min-h-dvh text-neutral-200">
    <main class="mx-auto flex max-w-8xl flex-col gap-4 p-3 sm:p-6">
      <div class="flex flex-col gap-3 relative">
        <header class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-1 px-3 rounded-md border border-neutral-700 bg-surface/85 backdrop-blur-md">
          <h1 class="text-2xl font-semibold tracking-tight text-primary">
            {{ title }}
          </h1>
          <nav
            class="flex flex-wrap gap-1"
            aria-label="Demo pages"
          >
            <DemoButton
              v-for="p in PAGES"
              :key="p.id"
              :href="p.href"
              as="a"
              :active="p.id === current"
              :label="p.label"
            />
          </nav>
          <div class="flex w-full flex-wrap items-center gap-2 text-sm text-neutral-300 empty:hidden">
            <slot name="tools" />
          </div>
        </header>

        <details
          v-if="$slots.controls"
          class="absolute top-12 right-0 flex flex-col gap-2 max-w-48 rounded-lg border border-neutral-700 bg-surface/85 backdrop-blur-md px-3 py-2 text-sm"
          open
        >
          <summary class="cursor-pointer text-neutral-200 hover:text-neutral-300">
            Controls
          </summary>
          <div class="mt-2 flex flex-wrap gap-2">
            <slot name="controls" />
          </div>
        </details>
        <slot />

        <div
          v-if="$slots.log"
          class="absolute -bottom-4 left-0 space-y-1 font-mono text-xs text-neutral-500 overflow-x-auto rounded-lg border border-neutral-700 bg-surface/85 backdrop-blur-md p-3"
        >
          <button
            type="button"
            class="text-neutral-300 hover:text-neutral-100 font-semibold"
            @click="logOpen = !logOpen"
          >
            {{ logOpen ? 'Hide log' : 'Show log' }}
          </button>
          <ul
            v-if="logOpen"
            class="space-y-1 text-neutral-300"
          >
            <slot name="log" />
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
/* Demo-only backdrop on the shell itself — avoid -z-10 (paints under body bg). */
.sv-demo-shell {
  background-color: oklch(0.14 0.02 55);
  background-image: url('/images/bg/demo-shell-bg.jpg');
  background-size: cover;
  /* background-image:
    radial-gradient(circle at 14% 20%, oklch(91.637% 0.05491 224.565 / 0.45), transparent 42%),
    radial-gradient(circle at 86% 16%, oklch(54.139% 0.04787 227.49 / 0.38), transparent 40%),
    radial-gradient(circle at 68% 88%, oklch(44.855% 0.0659 105.417 / 0.32), transparent 45%),
    linear-gradient(
      180deg,
      oklch(45.466% 0.08776 237.059) 0%,
      oklch(81.107% 0.08658 234.228) 39%,
      oklch(81.107% 0.08658 234.228) 40%,
      oklch(0.48 0.09 78) 47%,
      oklch(0.28 0.05 65) 54%,
      oklch(40.451% 0.10955 142.743) 100%
    ); */
}
</style>

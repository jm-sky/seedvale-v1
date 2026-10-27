<script setup lang="ts">
/**
 * Shared chrome for Character / Inventory / Merchant demos (v3 ItemsShell analog).
 * Full page reload between HTML entries — no world / save.
 * @domain ui
 */
export type DemoPage = 'character' | 'inventory' | 'merchant'

defineProps<{
  current: DemoPage
  title: string
}>()

const PAGES: { id: DemoPage, label: string, href: string }[] = [
  { id: 'character', label: 'Character', href: 'character-skills-demo.html' },
  { id: 'inventory', label: 'Inventory', href: 'inventory-list-demo.html' },
  { id: 'merchant', label: 'Shop', href: 'merchant-demo.html' },
]
</script>

<template>
  <div class="min-h-dvh bg-[oklch(0.2_0.015_60)] text-neutral-200">
    <main class="mx-auto flex max-w-7xl flex-col gap-4 p-3 sm:p-6">
      <div class="flex flex-col gap-4 rounded-xl border border-neutral-700 bg-(--surface) p-4 shadow-2xl backdrop-blur-sm">
        <header class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <h1 class="text-2xl font-semibold tracking-tight text-primary">
            {{ title }}
          </h1>
          <nav
            class="flex flex-wrap gap-1"
            aria-label="Demo pages"
          >
            <a
              v-for="p in PAGES"
              :key="p.id"
              :href="p.href"
              class="rounded-full border px-3 py-1 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              :class="p.id === current
                ? 'border-primary bg-primary text-neutral-950'
                : 'border-neutral-600 text-neutral-300 hover:border-neutral-400'"
              :aria-current="p.id === current ? 'page' : undefined"
            >{{ p.label }}</a>
          </nav>
          <div class="flex w-full flex-wrap items-center gap-2 text-sm text-neutral-300 empty:hidden">
            <slot name="tools" />
          </div>
        </header>
        <slot />
      </div>
    </main>
  </div>
</template>

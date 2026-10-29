<script setup lang="ts">
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

const PAGES: { id: DemoPage, label: string, href: string }[] = [
  { id: 'character', label: 'Character', href: 'character-skills-demo.html' },
  { id: 'inventory', label: 'Inventory', href: 'inventory-list-demo.html' },
  { id: 'merchant', label: 'Shop', href: 'merchant-demo.html' },
  { id: 'dialogue', label: 'Dialogue', href: 'dialogue-demo.html' },
]
</script>

<template>
  <div class="sv-demo-shell min-h-dvh text-neutral-200">
    <main class="mx-auto flex max-w-7xl flex-col gap-4 p-3 sm:p-6">
      <div class="flex flex-col gap-4 rounded-xl border border-neutral-700 bg-neutral-800/50 p-4 shadow-2xl backdrop-blur-sm">
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
                ? 'border-amber-500 bg-amber-500 text-neutral-950'
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

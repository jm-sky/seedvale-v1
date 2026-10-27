<script setup lang="ts">
import type { DetailStatRow } from './buildItemDetailPresentation'
import type { Component } from 'vue'

withDefaults(defineProps<{
  title: string
  meta: string
  description: string
  lore: string | null
  loreUnavailable?: boolean
  illustrationSrc?: string | null
  /** Lucide (or other) icon when no illustration PNG. */
  fallbackIcon?: Component | null
  solid?: boolean
  /** Narrow drill-down shows Powrót; desktop inline hides it. */
  showReturn?: boolean
  /** Optional id for focus management (narrow details heading). */
  headingId?: string
  statRows: DetailStatRow[]
}>(), {
  showReturn: true,
  headingId: undefined,
})

defineEmits<{
  'return-to-list': []
}>()
</script>

<template>
  <section
    class="sv-item-detail rounded-lg border p-4 text-neutral-200"
    :class="solid ? 'bg-(--surface-solid) shadow-2xl' : 'bg-(--surface)'"
  >
    <header class="mb-2 flex flex-wrap items-baseline justify-between gap-2">
      <h2
        :id="headingId"
        tabindex="-1"
        class="flex items-center gap-2 text-xl font-semibold text-neutral-100 outline-none"
      >
        <component
          :is="fallbackIcon"
          v-if="fallbackIcon && !illustrationSrc"
          class="size-5 shrink-0 opacity-80"
          aria-hidden="true"
        />
        {{ title }}
      </h2>
      <div class="flex items-center gap-2">
        <p class="text-xs text-neutral-400">
          {{ meta }}
        </p>
        <button
          v-if="showReturn"
          type="button"
          class="cursor-pointer rounded-md border border-neutral-600 bg-transparent px-2.5 py-1 text-xs text-neutral-200 hover:bg-neutral-800"
          @click="$emit('return-to-list')"
        >
          Powrót
        </button>
      </div>
    </header>

    <div
      v-if="illustrationSrc"
      class="-mt-4 mb-1 flex justify-center"
    >
      <img
        :src="illustrationSrc"
        :alt="title"
        aria-hidden="true"
        class="size-56 object-contain"
      >
    </div>
    <div
      v-else-if="fallbackIcon"
      class="-mt-2 mb-2 flex justify-center"
    >
      <component
        :is="fallbackIcon"
        class="size-56 max-h-40 opacity-30"
        aria-hidden="true"
      />
    </div>

    <p class="text-sm text-neutral-300">
      {{ description }}
    </p>
    <p
      v-if="lore"
      class="mt-1 text-sm text-neutral-400 italic"
    >
      “{{ lore }}”
    </p>
    <p
      v-else-if="loreUnavailable"
      class="mt-1 text-sm text-neutral-500 italic"
    >
      Lore — niedostępne —
    </p>

    <div
      v-if="$slots.controls"
      class="mt-3"
    >
      <slot name="controls" />
    </div>

    <dl
      v-if="statRows.length > 0"
      class="mt-3 grid grid-cols-2 gap-x-4.5 gap-y-1.5 text-sm sm:grid-cols-3"
    >
      <div
        v-for="row in statRows"
        :key="row.label"
        class="border-b border-neutral-800 py-0.75"
      >
        <div class="flex justify-between gap-2">
          <dt class="text-neutral-400">
            {{ row.label }}
          </dt>
          <dd
            class="tabular-nums"
            :class="row.unavailable ? 'text-neutral-500 italic' : 'text-neutral-200'"
          >
            {{ row.unavailable ? '— niedostępne —' : row.value }}
          </dd>
        </div>
      </div>
    </dl>

    <div
      v-if="$slots.lista"
      class="mt-3"
    >
      <slot name="lista" />
    </div>

    <footer
      v-if="$slots.actions"
      class="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500"
    >
      <slot name="actions" />
    </footer>
  </section>
</template>

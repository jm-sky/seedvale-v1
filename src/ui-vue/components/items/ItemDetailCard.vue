<script setup lang="ts">
import { computed } from 'vue'
import type { ItemCategory, ItemKind } from '../../../items/items'
import {
  DETAIL_STAT_GROUP_ORDER,
  type DetailStatRow,
} from './buildItemDetailPresentation'
import ItemTypeIcon from './ItemTypeIcon.vue'
import StatIcon from './StatIcon.vue'
import StatUnderline from './StatUnderline.vue'
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  meta: string
  description: string
  lore: string | null
  illustrationSrc?: string | null
  /** Lucide (or other) icon when no illustration PNG and no kind icon. */
  fallbackIcon?: Component | null
  /** Preferred V3-style type icon from donor glyphs. */
  kind?: ItemKind | null
  category?: ItemCategory | null
  solid?: boolean
  /** Narrow drill-down shows Powrót; desktop inline hides it. */
  showReturn?: boolean
  /** Optional id for focus management (narrow details heading). */
  headingId?: string
  statRows: DetailStatRow[]
}>(), {
  showReturn: true,
  headingId: undefined,
  kind: null,
  category: null,
})

defineEmits<{
  'return-to-list': []
}>()

/** Same group banding as V3 ItemDetailCard (main / resist / body / value + V1 extra). */
const groups = computed(() => {
  const rows = props.statRows
  return DETAIL_STAT_GROUP_ORDER
    .map((g) => rows.filter((r) => (r.group ?? 'main') === g))
    .filter((g) => g.length > 0)
})
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
        <ItemTypeIcon
          v-if="kind && category"
          :kind="kind"
          :category="category"
          class="size-5 shrink-0 text-neutral-200"
          aria-hidden="true"
        />
        <component
          :is="fallbackIcon"
          v-else-if="fallbackIcon && !illustrationSrc"
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

    <div class="grid grid-cols-2 gap-4">
      <div
        v-if="illustrationSrc"
        class="flex justify-center"
      >
        <img
          :src="illustrationSrc"
          :alt="title"
          aria-hidden="true"
          class="size-52 object-contain"
        >
      </div>
      <div
        v-else-if="fallbackIcon && !(kind && category)"
        class="-mt-2 mb-2 flex justify-center"
      >
        <component
          :is="fallbackIcon"
          class="size-56 max-h-40 opacity-30"
          aria-hidden="true"
        />
      </div>

      <p class="pt-1 text-sm text-neutral-300">
        {{ description }}
      </p>
    </div>
    <p
      v-if="lore"
      class="mt-1 text-sm text-neutral-400 italic"
    >
      “{{ lore }}”
    </p>

    <div
      v-if="$slots.controls"
      class="mb-3 border-y border-neutral-800 py-3"
    >
      <slot name="controls" />
    </div>

    <dl
      v-for="(rows, i) in groups"
      :key="i"
      class="grid grid-cols-2 gap-x-4.5 gap-y-1.5 text-sm sm:grid-cols-3"
      :class="i === 0 ? 'mt-3' : 'mt-2'"
    >
      <div
        v-for="row in rows"
        :key="row.label"
        class="py-0.75"
        :class="[
          row.strength == null ? 'border-b border-neutral-800' : '',
          row.unavailable ? 'opacity-50' : '',
        ]"
      >
        <div class="flex min-w-0 justify-between gap-2">
          <dt class="flex min-w-0 shrink-0 items-center whitespace-nowrap text-neutral-400">
            <StatIcon
              v-if="row.icon"
              :name="row.icon"
              class="mr-1"
            />{{ row.label }}
          </dt>
          <dd
            class="min-w-0 truncate text-right tabular-nums"
            :class="row.unavailable ? 'text-neutral-500 italic' : 'text-neutral-200'"
            :title="row.unavailable ? undefined : row.value"
          >
            {{ row.unavailable ? '—' : row.value }}
          </dd>
        </div>
        <StatUnderline
          v-if="row.strength != null && !row.unavailable"
          :value="row.strength"
        />
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
      class="mt-3 flex flex-wrap items-center justify-end gap-2 text-xs text-neutral-500"
    >
      <slot name="actions" />
    </footer>
  </section>
</template>

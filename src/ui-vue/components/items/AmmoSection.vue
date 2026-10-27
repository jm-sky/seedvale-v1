<script setup lang="ts">
import { computed } from 'vue'
import type { ItemKind } from '../../../items/items'
import { buildAmmoSectionView } from './ammoSectionView'

const props = defineProps<{
  weaponLabel: string
  ammoKinds: readonly ItemKind[]
  counts: Partial<Record<string, number>>
}>()

const view = computed(() => buildAmmoSectionView(props.ammoKinds, props.counts))
</script>

<template>
  <section
    aria-label="Amunicja"
    class="min-w-0 border-t border-neutral-800 pt-3 text-sm"
  >
    <h3 class="mb-2 font-semibold text-neutral-100">
      Amunicja
    </h3>
    <p class="mb-2 break-words text-neutral-400">
      Broń dystansowa: {{ weaponLabel }}
    </p>
    <ul class="mb-2 space-y-0.5 text-neutral-300">
      <li
        v-for="line in view.lines"
        :key="line.kind"
      >
        {{ line.label }} ×{{ line.count }}
      </li>
    </ul>
    <div
      role="status"
      class="space-y-1 break-words text-neutral-300"
    >
      <p>Dostępna kompatybilna ilość: {{ view.total }}</p>
      <p v-if="view.resolvedLabel">
        Następny strzał: {{ view.resolvedLabel }} ×{{ view.resolvedCount }}
      </p>
      <p
        v-else
        class="text-amber-400"
      >
        Brak kompatybilnej amunicji.
      </p>
      <p class="text-xs text-neutral-500">
        Wybór automatyczny: gra zużywa pierwszy posiadany rodzaj amunicji z katalogu broni.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ItemDetailCard from '@/components/items/ItemDetailCard.vue'
import ItemInstanceMeters from '@/components/items/ItemInstanceMeters.vue'
import { buildItemDetailPresentation } from '@/components/items/buildItemDetailPresentation'
import ItemsScreenItemButton from '@/components/ItemsScreenItemButton.vue'
import { ITEM_DEFS, primaryItemCategory } from '../../../items/items'
import { DEMO_FIXTURES, type DemoFixtureId } from './fixtures'

const selectedId = ref<DemoFixtureId>('weapon')
const log = ref<string[]>([])

const fixture = computed(() => DEMO_FIXTURES.find((f) => f.id === selectedId.value) ?? DEMO_FIXTURES[0])
const presentation = computed(() => buildItemDetailPresentation(fixture.value.presentation))
const fixtureKind = computed(() => fixture.value.presentation.kind)
const fixtureCategory = computed(() => primaryItemCategory(ITEM_DEFS[fixtureKind.value]))

function selectFixture(id: DemoFixtureId): void {
  selectedId.value = id
  log.value = []
}

function resetDemo(): void {
  selectedId.value = 'weapon'
  log.value = []
}

function onDemoAction(actionId: string, label: string, disabled?: boolean): void {
  if (disabled) return
  log.value = [`[demo] ${label} (${actionId}) — lokalny stan tylko`, ...log.value].slice(0, 8)
}
</script>

<template>
  <div class="min-h-dvh bg-[oklch(0.2_0.015_60)] p-4 text-neutral-200">
    <header class="mx-auto mb-4 max-w-2xl">
      <p class="text-xs uppercase tracking-wide text-amber-200/80">
        Demo Stage A — item details (bez świata / save)
      </p>
      <h1 class="text-lg font-semibold text-neutral-100">
        Te same komponenty co live InventoryScreenItemDetails
      </h1>
      <p class="mt-1 text-sm text-neutral-400">
        Fixtures i callbacki są lokalne. Brak dostępu do Inventory / WorldBundle / donor gameplay.
      </p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="f in DEMO_FIXTURES"
          :key="f.id"
          type="button"
          class="rounded-md border px-2.5 py-1 text-xs"
          :class="f.id === selectedId ? 'border-amber-400/60 bg-amber-900/30' : 'border-neutral-600 hover:bg-neutral-800'"
          @click="selectFixture(f.id)"
        >
          {{ f.label }}
        </button>
        <button
          type="button"
          class="rounded-md border border-neutral-600 px-2.5 py-1 text-xs hover:bg-neutral-800"
          @click="resetDemo"
        >
          Reset
        </button>
      </div>
    </header>

    <div class="mx-auto max-w-2xl">
      <ItemDetailCard
        solid
        :title="presentation.title"
        :meta="presentation.meta"
        :description="presentation.description"
        :lore="presentation.lore"
        :illustration-src="presentation.illustrationSrc"
        :kind="fixtureKind"
        :category="fixtureCategory"
        :stat-rows="presentation.stats"
        @return-to-list="resetDemo"
      >
        <template #controls>
          <ItemInstanceMeters
            :meters="presentation.meters"
            :quality="presentation.quality"
            :quality-label="presentation.qualityLabel"
            :worth-coins="presentation.worthCoins"
            :stack-count="presentation.stackCount"
          />
        </template>
        <template #actions>
          <div class="flex w-full flex-wrap items-center gap-2">
            <template
              v-for="action in fixture.actions"
              :key="action.id"
            >
              <ItemsScreenItemButton
                :label="action.label"
                :disabled="action.disabled"
                @click="onDemoAction(action.id, action.label, action.disabled)"
              />
              <span
                v-if="action.reason"
                class="text-[11px] text-neutral-400"
              >{{ action.reason }}</span>
            </template>
          </div>
        </template>
      </ItemDetailCard>

      <aside class="mt-4 rounded-md border border-dashed border-neutral-600 p-3 text-xs text-neutral-400">
        <div class="mb-1 font-semibold text-neutral-300">
          Dziennik demo (lokalny)
        </div>
        <ul
          v-if="log.length"
          class="list-inside list-disc"
        >
          <li
            v-for="(line, i) in log"
            :key="i"
          >
            {{ line }}
          </li>
        </ul>
        <p v-else>
          Brak akcji — kliknięcie disabled nie dispatchuje.
        </p>
      </aside>
    </div>
  </div>
</template>

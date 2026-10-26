<script setup lang="ts">
/**
 * Stage C D9 demo — same QuickActions Button/Group leaves as live screen.
 * Fixtures and callbacks are demo-local only (no world / save / WorldBundle).
 * @domain ui
 */
import { BuildingIcon, ChevronLeft, FlameIcon, Utensils } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import QuickActionsButton from '../../components/QuickActionsButton.vue'
import QuickActionsGroup from '../../components/QuickActionsGroup.vue'
import { DEMO_SCENARIOS, type DemoViewId } from './fixtures'

const selectedId = ref<DemoViewId>('root')
const log = ref<string[]>([])
const recent = ref<{ key: string; label: string; cost?: string; disabled?: boolean; reason?: string }[]>([])

const scenario = computed(() => DEMO_SCENARIOS.find((s) => s.id === selectedId.value) ?? DEMO_SCENARIOS[0])

const categoryMeta = computed(() => {
  if (!scenario.value.categoryLabel) return null
  const icon = scenario.value.categoryLabel === 'Ogień'
    ? FlameIcon
    : scenario.value.categoryLabel === 'Budowa'
      ? BuildingIcon
      : Utensils
  return { label: scenario.value.categoryLabel, icon }
})

function selectScenario(id: DemoViewId): void {
  selectedId.value = id
  log.value = []
}

function resetDemo(): void {
  selectedId.value = 'root'
  log.value = []
  recent.value = []
}

function pushLog(message: string): void {
  log.value = [`[demo] ${message}`, ...log.value].slice(0, 8)
}

function pushRecent(label: string, cost?: string): void {
  recent.value = [
    { key: label, label, cost },
    ...recent.value.filter((r) => r.key !== label),
  ].slice(0, 5)
}

function onAction(label: string, cost?: string): void {
  pushRecent(label, cost)
  pushLog(`Akcja: ${label} (demo-local only)`)
}

function onCategory(label: string): void {
  pushLog(`Kategoria: ${label}`)
  if (label === 'Ogień') selectedId.value = 'ogien-mixed'
  else if (label === 'Budowa') selectedId.value = 'budowa-disabled'
}
</script>

<template>
  <div class="min-h-dvh bg-[oklch(0.2_0.015_60)] p-4 text-neutral-200">
    <header class="mx-auto mb-4 max-w-lg">
      <p class="text-xs uppercase tracking-wide text-amber-200/80">
        Demo Stage C — Quick Actions (bez świata / save)
      </p>
      <h1 class="text-lg font-semibold text-neutral-100">
        Te same leaves co live QuickActionsScreen (Button / Group)
      </h1>
      <p class="mt-1 text-sm text-neutral-400">
        Callbacki lokalne — brak Inventory / WorldBundle / katalogu runtime.
      </p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="s in DEMO_SCENARIOS"
          :key="s.id"
          type="button"
          class="rounded-md border px-2.5 py-1 text-xs"
          :class="s.id === selectedId ? 'border-amber-400/60 bg-amber-900/30' : 'border-neutral-600 hover:bg-neutral-800'"
          @click="selectScenario(s.id)"
        >
          {{ s.label }}
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

    <div class="mx-auto flex max-w-lg justify-center">
      <section
        class="sv-quick-actions flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-white/15 bg-neutral-900/85 text-neutral-50 shadow-2xl"
      >
        <div class="flex items-center justify-between border-b border-white/15 px-4 py-2">
          <h2 class="font-semibold text-primary">
            {{ scenario.title }}
          </h2>
          <span class="text-xs text-neutral-400">demo</span>
        </div>
        <div class="flex flex-col gap-4 p-4">
          <template v-if="!scenario.categoryLabel">
            <QuickActionsGroup>
              <QuickActionsButton
                v-for="cat in scenario.categories"
                :key="cat.id"
                :label="cat.label"
                :icon="cat.icon"
                @click="onCategory(cat.label)"
              />
            </QuickActionsGroup>
            <div
              v-if="recent.length"
              class="border-t border-white/15 pt-3"
            >
              <QuickActionsGroup label="Ostatnie">
                <QuickActionsButton
                  v-for="row in recent"
                  :key="row.key"
                  :label="row.label"
                  :cost="row.cost"
                  @click="onAction(row.label, row.cost)"
                />
              </QuickActionsGroup>
            </div>
          </template>
          <template v-else-if="categoryMeta">
            <div class="relative flex items-center justify-center gap-2">
              <button
                type="button"
                class="absolute left-0 inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-white/15 bg-neutral-800/60 hover:bg-neutral-700/70"
                aria-label="Wróć"
                @click="selectScenario('root')"
              >
                <ChevronLeft class="size-5" />
              </button>
              <component
                :is="categoryMeta.icon"
                class="size-5 shrink-0 text-primary"
              />
              <h3 class="font-semibold text-neutral-50">
                {{ categoryMeta.label }}
              </h3>
            </div>
            <QuickActionsGroup>
              <QuickActionsButton
                v-for="action in scenario.actions"
                :key="action.label"
                :label="action.label"
                :cost="action.cost"
                :disabled="action.disabled"
                :reason="action.reason"
                @click="onAction(action.label, action.cost)"
              />
            </QuickActionsGroup>
          </template>
        </div>
      </section>
    </div>

    <ul
      v-if="log.length"
      class="mx-auto mt-4 max-w-lg space-y-1 font-mono text-xs text-neutral-500"
    >
      <li
        v-for="(line, i) in log"
        :key="i"
      >
        {{ line }}
      </li>
    </ul>
  </div>
</template>

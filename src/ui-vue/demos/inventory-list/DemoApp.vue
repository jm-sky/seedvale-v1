<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EquipmentSlot } from '../../../items/equipment'
import { previewEquipLoadoutFromSnapshot } from '../../../items/equipmentPreview'
import EquipmentPanel from '../../components/items/EquipmentPanel.vue'
import QualityTag from '../../components/items/QualityTag.vue'
import DemoShell from '../DemoShell.vue'
import {
  DEMO_SCENARIOS,
  type DemoKindRow,
  type DemoScenarioId,
  slotViewsFor,
} from './fixtures'

const selectedId = ref<DemoScenarioId>('full-bag')
const log = ref<string[]>([])
const localCompareId = ref<string | null>(null)
const categoryFilter = ref<string>('all')

const scenario = computed(() => DEMO_SCENARIOS.find((s) => s.id === selectedId.value) ?? DEMO_SCENARIOS[0])

const compareId = computed(() => localCompareId.value ?? scenario.value.compareInstanceId)

const preview = computed(() =>
  previewEquipLoadoutFromSnapshot(
    scenario.value.equippedSlots,
    scenario.value.instances,
    compareId.value,
  ),
)

const slots = computed(() => slotViewsFor(scenario.value.equippedSlots, scenario.value.instances))

const categories = computed(() => {
  const set = new Set(scenario.value.kindRows.map((row) => row.category.split(' · ')[0]!))
  return ['all', ...[...set].sort((a, b) => a.localeCompare(b, 'pl'))]
})

const visibleRows = computed(() => {
  if (categoryFilter.value === 'all') return scenario.value.kindRows
  return scenario.value.kindRows.filter((row) => row.category.startsWith(categoryFilter.value))
})

function selectScenario(id: DemoScenarioId): void {
  selectedId.value = id
  localCompareId.value = null
  categoryFilter.value = 'all'
  log.value = []
}

function resetDemo(): void {
  selectedId.value = 'full-bag'
  localCompareId.value = null
  categoryFilter.value = 'all'
  log.value = []
}

function pushLog(message: string): void {
  log.value = [`[demo] ${message}`, ...log.value].slice(0, 8)
}

function onCompare(id: string): void {
  localCompareId.value = id
  pushLog(`Porównaj ${id} — bez equips`)
}

function onSelectSlot(slot: EquipmentSlot, instanceId: string): void {
  localCompareId.value = instanceId
  pushLog(`Select slot ${slot} → ${instanceId}`)
}

function onUnequipArmor(slot: EquipmentSlot): void {
  pushLog(`Unequip armor ${slot} (demo-local only)`)
}

function onUnequipHeld(): void {
  pushLog('Unequip held (demo-local only)')
}

function rowIsCompared(row: DemoKindRow): boolean {
  if (!compareId.value) return false
  if (row.compareId === compareId.value) return true
  return row.instances?.some((inst) => inst.id === compareId.value) ?? false
}

function formatWeight(kg: number): string {
  return `${kg.toFixed(1)} kg`
}
</script>

<template>
  <DemoShell
    current="inventory"
    title="Inventory (demo)"
  >
    <details
      class="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 text-sm"
      open
    >
      <summary class="cursor-pointer text-neutral-400 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        Demo controls
      </summary>
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
      <p class="mt-2 text-xs text-neutral-500">
        Fixture-only: stacks, multi-instance armor, meters. Porównaj nie equips.
        Shared leaves: EquipmentPanel only (list is demo chrome until D9 list leaf wiring).
      </p>
    </details>

    <div class="sv-inventory-stage-b mx-auto grid max-w-5xl gap-4 rounded-lg border border-neutral-700 bg-(--surface-solid) p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section class="flex min-h-0 flex-col gap-2">
        <h2 class="text-lg font-semibold text-neutral-100">
          Ekwipunek (fixture)
        </h2>
        <div class="text-[13px] text-neutral-400">
          Waga: {{ formatWeight(scenario.totalWeightKg) }} / {{ formatWeight(scenario.maxWeightKg) }}
          · Pojemność: {{ scenario.totalSize.toFixed(2) }} / {{ scenario.maxSize.toFixed(2) }}
          <span
            v-if="scenario.heldToolLabel"
            class="ml-2 text-neutral-300"
          >· w ręce: {{ scenario.heldToolLabel }}</span>
        </div>

        <div class="flex flex-wrap items-center gap-1">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="rounded-full border px-2.5 py-0.5 text-xs"
            :class="categoryFilter === cat
              ? 'border-neutral-200 bg-neutral-100 text-neutral-900'
              : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'"
            @click="categoryFilter = cat"
          >
            {{ cat === 'all' ? 'Wszystko' : cat }}
          </button>
        </div>

        <ul class="max-h-[min(36rem,70dvh)] divide-y divide-white/10 overflow-y-auto rounded-lg border border-neutral-700">
          <li
            v-if="visibleRows.length === 0"
            class="px-3 py-6 text-center text-sm text-neutral-500"
          >
            Brak przedmiotów w tej kategorii.
          </li>
          <li
            v-for="row in visibleRows"
            :key="row.id"
            class="flex flex-col gap-1 px-3 py-2 text-sm hover:bg-white/5"
            :class="rowIsCompared(row) ? 'bg-neutral-800/70' : ''"
          >
            <div class="flex items-baseline justify-between gap-2">
              <div class="min-w-0 font-semibold text-neutral-100">
                {{ row.count }} × {{ row.name }}
                <span
                  v-if="row.condition"
                  class="ml-1.5 text-[11px] font-normal text-neutral-400"
                >{{ row.condition }}</span>
              </div>
              <span class="shrink-0 text-[11px] uppercase tracking-wide text-neutral-500">
                {{ row.category }}
              </span>
            </div>

            <div
              v-if="row.badges?.length"
              class="flex flex-wrap gap-1"
            >
              <span
                v-for="badge in row.badges"
                :key="badge"
                class="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300"
              >{{ badge }}</span>
            </div>

            <ul
              v-if="row.instances?.length"
              class="mt-0.5 space-y-0.5 border-l border-neutral-700 pl-2"
            >
              <li
                v-for="inst in row.instances"
                :key="inst.id"
                class="flex items-center justify-between gap-2 text-xs"
                :class="compareId === inst.id ? 'text-amber-200' : 'text-neutral-300'"
              >
                <span class="flex min-w-0 flex-wrap items-center gap-1.5">
                  <QualityTag :label="inst.qualityLabel" />
                  <span
                    v-if="inst.note"
                    class="text-neutral-500"
                  >{{ inst.note }}</span>
                  <span class="font-mono text-[10px] text-neutral-600">{{ inst.id }}</span>
                </span>
                <button
                  type="button"
                  class="shrink-0 rounded border border-neutral-600 px-2 py-0.5 hover:bg-neutral-800"
                  @click="onCompare(inst.id)"
                >
                  Porównaj
                </button>
              </li>
            </ul>

            <div
              v-else-if="row.compareId"
              class="mt-0.5"
            >
              <button
                type="button"
                class="rounded border border-neutral-600 px-2 py-0.5 text-xs hover:bg-neutral-800"
                @click="onCompare(row.compareId)"
              >
                Porównaj
              </button>
            </div>
          </li>
        </ul>
      </section>

      <EquipmentPanel
        :slots="slots"
        :held-tool="scenario.heldTool"
        :held-label="scenario.heldToolLabel"
        :primary-melee="null"
        :primary-ranged="null"
        :primary-melee-label="scenario.primaryMeleeLabel"
        :primary-ranged-label="scenario.primaryRangedLabel"
        :ammo-lines="scenario.ammoLines"
        :loadout-current="preview.current"
        :loadout-delta="preview.delta"
        :loadout-context="preview.context"
        :compare-instance-id="compareId"
        @select-slot="onSelectSlot"
        @unequip-armor="onUnequipArmor"
        @unequip-held="onUnequipHeld"
        @select-held="pushLog('Select held')"
      />
    </div>

    <ul
      v-if="log.length"
      class="mx-auto max-w-5xl space-y-1 font-mono text-xs text-neutral-500"
      aria-label="Demo action log"
    >
      <li
        v-for="(line, i) in log"
        :key="i"
      >
        {{ line }}
      </li>
    </ul>
  </DemoShell>
</template>

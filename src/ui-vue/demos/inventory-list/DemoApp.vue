<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EquipmentSlot } from '../../../items/equipment'
import { previewEquipLoadoutFromSnapshot } from '../../../items/equipmentPreview'
import EquipmentPanel from '../../components/items/EquipmentPanel.vue'
import DemoShell from '../DemoShell.vue'
import { DEMO_SCENARIOS, type DemoScenarioId, slotViewsFor } from './fixtures'

const selectedId = ref<DemoScenarioId>('compare-chainmail')
const log = ref<string[]>([])
const localCompareId = ref<string | null>(null)

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

function selectScenario(id: DemoScenarioId): void {
  selectedId.value = id
  localCompareId.value = null
  log.value = []
}

function resetDemo(): void {
  selectedId.value = 'compare-chainmail'
  localCompareId.value = null
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
</script>

<template>
  <DemoShell
    current="inventory"
    title="Inventory (demo)"
  >
    <details class="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3 text-sm">
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
      <ul
        v-if="log.length"
        class="mt-3 space-y-1 font-mono text-xs text-neutral-500"
      >
        <li
          v-for="(line, i) in log"
          :key="i"
        >
          {{ line }}
        </li>
      </ul>
    </details>

    <div class="sv-inventory-stage-b mx-auto grid max-w-5xl gap-4 rounded-lg border border-neutral-700 bg-(--surface-solid) p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section class="flex flex-col gap-2">
        <h2 class="text-lg font-semibold">
          Ekwipunek (fixture)
        </h2>
        <ul class="divide-y divide-white/10 overflow-hidden rounded-lg border border-neutral-700">
          <li
            v-for="row in scenario.kindRows"
            :key="row.name"
            class="flex items-center justify-between gap-2 px-3 py-2 text-sm"
            :class="row.compareId && row.compareId === compareId ? 'bg-neutral-800/70' : ''"
          >
            <div>
              <div class="font-semibold">
                {{ row.name }}
              </div>
              <div class="text-xs text-neutral-400">
                {{ row.meta }}
              </div>
            </div>
            <button
              v-if="row.compareId"
              type="button"
              class="rounded border border-neutral-600 px-2 py-0.5 text-xs hover:bg-neutral-800"
              @click="onCompare(row.compareId)"
            >
              Porównaj
            </button>
          </li>
        </ul>
      </section>

      <EquipmentPanel
        :slots="slots"
        :held-tool="scenario.heldToolLabel ? 'axe' : null"
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
  </DemoShell>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { EquipmentSlot } from '../../../items/equipment'
import { previewEquipLoadoutFromSnapshot } from '../../../items/equipmentPreview'
import { itemDisplayName } from '../../../items/itemDisplay'
import {
  buildEquipmentSlotViews,
  collectArmorPreviewInstances,
} from '../../components/items/collectArmorPreviewInstances'
import EquipmentPanel from '../../components/items/EquipmentPanel.vue'
import InventoryItemDetails from '../../components/items/InventoryItemDetails.vue'
import InventoryList from '../../components/items/InventoryList.vue'
import {
  deriveCompareInstanceId,
  findPresentationRow,
  type InventoryCategoryFilter,
  type InventorySelection,
  type InventorySortMode,
  projectInventoryRows,
  reconcileInventorySelection,
} from '../../components/items/inventoryPresentation'
import DemoShell from '../DemoShell.vue'
import { cloneScenario, DEMO_SCENARIOS, type DemoScenario, type DemoScenarioId } from './fixtures'

const selectedId = ref<DemoScenarioId>('full-bag')
const log = ref<string[]>([])
const scenario = ref<DemoScenario>(cloneScenario('full-bag'))
const selection = ref<InventorySelection>(null)
const filter = ref<InventoryCategoryFilter>('all')
const sortMode = ref<InventorySortMode>('category')
const narrowPage = ref<'list' | 'details'>('list')
const isDesktop = ref(typeof window !== 'undefined' ? window.innerWidth >= 1200 : true)

const allRows = computed(() => projectInventoryRows(scenario.value.groups))
const selectedRow = computed(() => findPresentationRow(allRows.value, selection.value))
const compareInstanceId = computed(() => deriveCompareInstanceId(selection.value, allRows.value))
const armorInstances = computed(() => collectArmorPreviewInstances(scenario.value.groups))
const equipmentSlots = computed(() =>
  buildEquipmentSlotViews(scenario.value.equippedSlots, armorInstances.value),
)
const loadoutPreview = computed(() =>
  previewEquipLoadoutFromSnapshot(
    scenario.value.equippedSlots,
    armorInstances.value,
    compareInstanceId.value,
  ),
)
const equippedInstanceIds = computed(() =>
  Object.values(scenario.value.equippedSlots).filter((id): id is string => typeof id === 'string'),
)
const carryingLabel = computed(() =>
  `Waga: ${scenario.value.totalWeightKg.toFixed(1)} / ${scenario.value.maxWeightKg.toFixed(1)} kg · Pojemność: ${scenario.value.totalSize.toFixed(2)} / ${scenario.value.maxSize.toFixed(2)}`,
)
const detailGroup = computed(() => selectedRow.value?.group ?? null)
const detailInstance = computed(() =>
  selectedRow.value?.type === 'instance' ? selectedRow.value.instance : null,
)

function pushLog(message: string): void {
  log.value = [`[demo] ${message}`, ...log.value].slice(0, 10)
}

function selectScenario(id: DemoScenarioId): void {
  selectedId.value = id
  scenario.value = cloneScenario(id)
  selection.value = null
  filter.value = 'all'
  sortMode.value = 'category'
  narrowPage.value = 'list'
  log.value = []
  pushLog(`Scenario ${id}`)
}

function resetDemo(): void {
  selectScenario('full-bag')
}

function onSelect(next: Exclude<InventorySelection, null>): void {
  selection.value = next
  if (!isDesktop.value) narrowPage.value = 'details'
  pushLog(`Select ${next.type === 'instance' ? next.instanceId : next.kind} (no gameplay)`)
}

function onSelectSlot(_slot: EquipmentSlot, instanceId: string): void {
  const row = allRows.value.find((r) => r.type === 'instance' && r.instanceId === instanceId)
  if (!row || row.type !== 'instance') return
  onSelect({ type: 'instance', kind: row.kind, instanceId })
}

function onSelectHeld(): void {
  const kind = scenario.value.heldTool
  if (!kind) return
  if (scenario.value.heldInstanceId) {
    onSelect({ type: 'instance', kind, instanceId: scenario.value.heldInstanceId })
  } else {
    onSelect({ type: 'group', kind })
  }
}

function onSelectPrimaryMelee(): void {
  const choice = scenario.value.primaryMelee
  if (!choice) return
  if (choice.instanceId) onSelect({ type: 'instance', kind: choice.kind, instanceId: choice.instanceId })
  else onSelect({ type: 'group', kind: choice.kind })
}

function onSelectPrimaryRanged(): void {
  const choice = scenario.value.primaryRanged
  if (!choice) return
  if (choice.instanceId) onSelect({ type: 'instance', kind: choice.kind, instanceId: choice.instanceId })
  else onSelect({ type: 'group', kind: choice.kind })
}

function simulateVanishSelected(): void {
  if (!selection.value || selection.value.type !== 'instance') {
    pushLog('Vanish: select an instance first')
    return
  }
  const id = selection.value.instanceId
  scenario.value = {
    ...scenario.value,
    groups: scenario.value.groups
      .map((g) => ({
        ...g,
        instances: g.instances.filter((row) => row.id !== id),
        count: g.instances.some((row) => row.id === id) ? Math.max(0, g.count - 1) : g.count,
      }))
      .filter((g) => g.count > 0 || g.instances.length > 0),
    equippedSlots: Object.fromEntries(
      Object.entries(scenario.value.equippedSlots).filter(([, v]) => v !== id),
    ) as Partial<Record<EquipmentSlot, string>>,
  }
  selection.value = reconcileInventorySelection(selection.value, projectInventoryRows(scenario.value.groups))
  pushLog(`Vanished ${id}; selection cleared without sibling auto-select`)
}

function demoAction(label: string): void {
  pushLog(`${label} (simulated — fixture only)`)
}

if (typeof window !== 'undefined') {
  const sync = () => { isDesktop.value = window.innerWidth >= 1200 }
  sync()
  window.addEventListener('resize', sync)
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
      <summary class="cursor-pointer text-neutral-400 hover:text-neutral-100">
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
        <button
          type="button"
          class="rounded-md border border-rose-700/60 px-2.5 py-1 text-xs hover:bg-rose-950/40"
          @click="simulateVanishSelected"
        >
          Usuń zaznaczoną sztukę
        </button>
      </div>
      <p class="mt-2 text-xs text-neutral-500">
        Shared leaves: InventoryList + InventoryItemDetails + EquipmentPanel. Fixture-local only —
        no live store / WorldBundle / save. {{ scenario.note }}
      </p>
      <ul class="mt-2 space-y-0.5 text-[11px] text-neutral-500">
        <li
          v-for="(line, i) in log"
          :key="i"
        >
          {{ line }}
        </li>
      </ul>
    </details>

    <div
      class="sv-inventory-stage-b mx-auto mt-4 flex w-[min(96rem,calc(100vw-2rem))] flex-col gap-3 rounded-lg border border-neutral-700 bg-(--surface-solid) p-4"
      :class="isDesktop ? 'h-[min(48rem,calc(100dvh-8rem))]' : ''"
    >
      <p class="text-[13px] text-neutral-400">
        {{ carryingLabel }}
      </p>

      <div
        v-if="isDesktop"
        class="grid min-h-0 flex-1 gap-4 overflow-hidden"
        style="grid-template-columns: minmax(16rem, 1fr) minmax(22rem, 1.25fr) minmax(18rem, 1fr)"
      >
        <InventoryList
          class="min-h-0 overflow-hidden"
          :rows="allRows"
          :selection="selection"
          :filter="filter"
          :sort-mode="sortMode"
          :held-tool="scenario.heldTool"
          :held-instance-id="scenario.heldInstanceId"
          :primary-melee="scenario.primaryMelee"
          :primary-ranged="scenario.primaryRanged"
          :equipped-instance-ids="equippedInstanceIds"
          @select="onSelect"
          @update:filter="filter = $event"
          @update:sort-mode="sortMode = $event"
        />
        <div class="min-h-0 overflow-y-auto">
          <InventoryItemDetails
            v-if="selection && detailGroup"
            :selection="selection"
            :group="detailGroup"
            :instance="detailInstance"
            :held-tool="scenario.heldTool"
            :held-instance-id="scenario.heldInstanceId"
            :primary-melee="scenario.primaryMelee"
            :primary-ranged="scenario.primaryRanged"
            :equipped-slots="scenario.equippedSlots"
            :counts="scenario.counts"
            :whetstone-count="scenario.counts.whetstone ?? 0"
            :merchant-open="false"
            :book-skill-value="null"
            :show-return="false"
            :solid="false"
            @drop="demoAction('drop')"
            @request-drop-quantity="demoAction('drop quantity')"
            @equip="demoAction('equip')"
            @unequip="demoAction('unequip')"
            @equip-armor="demoAction('equip armor')"
            @unequip-armor="demoAction('unequip armor')"
            @consume="demoAction('consume')"
            @throw="demoAction('throw')"
            @read="demoAction('read')"
            @place-trap="demoAction('place trap')"
            @place-container="demoAction('place container')"
            @place-tent="demoAction('place tent')"
            @sharpen="demoAction('sharpen')"
            @sell="demoAction('sell')"
            @set-primary-melee="demoAction('set primary melee')"
            @set-primary-ranged="demoAction('set primary ranged')"
          />
          <div
            v-else
            class="flex h-full min-h-[12rem] items-center justify-center rounded-lg border border-dashed border-neutral-700 text-sm text-neutral-500"
          >
            Wybierz przedmiot
          </div>
        </div>
        <div class="min-h-0 overflow-y-auto">
          <EquipmentPanel
            :slots="equipmentSlots"
            :held-tool="scenario.heldTool"
            :held-label="scenario.heldTool ? itemDisplayName(scenario.heldTool) : null"
            :held-instance-id="scenario.heldInstanceId"
            :primary-melee="scenario.primaryMelee"
            :primary-ranged="scenario.primaryRanged"
            :primary-melee-label="scenario.primaryMelee ? itemDisplayName(scenario.primaryMelee.kind) : null"
            :primary-ranged-label="scenario.primaryRanged ? itemDisplayName(scenario.primaryRanged.kind) : null"
            :ammo-lines="[]"
            :loadout-current="loadoutPreview.current"
            :loadout-delta="loadoutPreview.delta"
            :loadout-context="loadoutPreview.context"
            :compare-instance-id="compareInstanceId"
            @select-slot="onSelectSlot"
            @select-held="onSelectHeld"
            @select-primary-melee="onSelectPrimaryMelee"
            @select-primary-ranged="onSelectPrimaryRanged"
          />
        </div>
      </div>

      <div
        v-else
        class="flex flex-col gap-3"
      >
        <template v-if="narrowPage === 'list'">
          <InventoryList
            :rows="allRows"
            :selection="selection"
            :filter="filter"
            :sort-mode="sortMode"
            :held-tool="scenario.heldTool"
            :held-instance-id="scenario.heldInstanceId"
            :primary-melee="scenario.primaryMelee"
            :primary-ranged="scenario.primaryRanged"
            :equipped-instance-ids="equippedInstanceIds"
            @select="onSelect"
            @update:filter="filter = $event"
            @update:sort-mode="sortMode = $event"
          />
          <EquipmentPanel
            :slots="equipmentSlots"
            :held-tool="scenario.heldTool"
            :held-label="scenario.heldTool ? itemDisplayName(scenario.heldTool) : null"
            :held-instance-id="scenario.heldInstanceId"
            :primary-melee="scenario.primaryMelee"
            :primary-ranged="scenario.primaryRanged"
            :primary-melee-label="scenario.primaryMelee ? itemDisplayName(scenario.primaryMelee.kind) : null"
            :primary-ranged-label="scenario.primaryRanged ? itemDisplayName(scenario.primaryRanged.kind) : null"
            :ammo-lines="[]"
            :loadout-current="loadoutPreview.current"
            :loadout-delta="loadoutPreview.delta"
            :loadout-context="loadoutPreview.context"
            :compare-instance-id="compareInstanceId"
            @select-slot="onSelectSlot"
            @select-held="onSelectHeld"
            @select-primary-melee="onSelectPrimaryMelee"
            @select-primary-ranged="onSelectPrimaryRanged"
          />
        </template>
        <InventoryItemDetails
          v-else-if="selection && detailGroup"
          :selection="selection"
          :group="detailGroup"
          :instance="detailInstance"
          :held-tool="scenario.heldTool"
          :held-instance-id="scenario.heldInstanceId"
          :primary-melee="scenario.primaryMelee"
          :primary-ranged="scenario.primaryRanged"
          :equipped-slots="scenario.equippedSlots"
          :counts="scenario.counts"
          :whetstone-count="0"
          :merchant-open="false"
          :book-skill-value="null"
          show-return
          @return-to-list="narrowPage = 'list'"
          @drop="demoAction('drop')"
          @request-drop-quantity="demoAction('drop quantity')"
          @equip="demoAction('equip')"
          @unequip="demoAction('unequip')"
          @equip-armor="demoAction('equip armor')"
          @unequip-armor="demoAction('unequip armor')"
          @consume="demoAction('consume')"
          @throw="demoAction('throw')"
          @read="demoAction('read')"
          @place-trap="demoAction('place trap')"
          @place-container="demoAction('place container')"
          @place-tent="demoAction('place tent')"
          @sharpen="demoAction('sharpen')"
          @sell="demoAction('sell')"
          @set-primary-melee="demoAction('set primary melee')"
          @set-primary-ranged="demoAction('set primary ranged')"
        />
      </div>
    </div>
  </DemoShell>
</template>

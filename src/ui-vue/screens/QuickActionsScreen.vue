<script setup lang="ts">
import { ArrowDownToLine, BedSingleIcon, BowArrow, BoxIcon, BuildingIcon, ChevronLeft, ClockIcon, FishingRod, FlameIcon, LockIcon, ScrollText, ShovelIcon, Sword, TractorIcon, TreesIcon, Utensils, Zap } from 'lucide-vue-next'
import { type Component, computed, ref } from 'vue'
import QuickActionsGroup from '@/components/QuickActionsGroup.vue'
import type { ActionAvailability } from '../../app/actions/actionContracts'
import type { PlacementPreviewKind } from '../../app/actions/placementPreviewActions'
import type { RestOutcome, RestVariant } from '../../ui/createQuickActions'
import type { TrapKind } from '../../world/animalTraps'
import type { CropId } from '../../world/cropLifecycle'
import { formatMaterialCost } from '../../app/actions/placementRequirementView'
import { isTouchDevice } from '../../input/isTouchDevice'
import { PALISADE_MATERIAL_REQUIREMENTS } from '../../world/palisade'
import { gardenMaterialRequirements } from '../../world/playerGarden'
import { PLAYER_TROUGH_MATERIAL_REQUIREMENTS } from '../../world/playerTrough'
import { residentialTotalRequirements } from '../../world/residentialBuilding'
import { BEDROLL_MATERIAL_REQUIREMENTS, PLATFORM_MATERIAL_REQUIREMENTS } from '../../world/sleepingUtilities'
import { STANDING_TORCH_MATERIAL_REQUIREMENTS } from '../../world/standingTorch'
import QuickActionsButton from '../components/QuickActionsButton.vue'
import SkillsHudButton from '../components/SkillsHudButton.vue'
import { useOverlayScreen } from '../composables/useOverlayScreen'
import { useTouchScroll } from '../composables/useTouchScroll'
import { hudWeaponShortcuts } from '../hudWeaponShortcuts'
import { FIRE_COST_ITEMS, formatCostItems, formatMissingRequirements, visibleFireActions } from '../playerQuickActions'
import { listQuickActionRecent, recordQuickActionRecent } from '../quickActionsRecent'
import {
  backToQuickActionsCategories,
  closeQuickActions,
  equipPrimaryMelee,
  equipPrimaryRanged,
  isQuickActionsOpen,
  type QuickActionsCategoryId,
  selectQuickActionsCategory,
  sheatheCombatWeapon,
  showToast,
  toggleQuickActions,
  ui,
} from '../store'

const panel = ref<HTMLElement | null>(null)
const touchDevice = isTouchDevice()

useOverlayScreen('quick-actions', isQuickActionsOpen, closeQuickActions)
useTouchScroll(panel)

const restStatusText: Record<Exclude<RestOutcome, 'ok' | 'choose'>, string> = {
  'too-far': 'Musisz być bliżej wioski',
  'no-blanket': 'Potrzebujesz koca',
  'no-lodging': 'Nie znaleziono noclegu',
}

// "Zbuduj palenisko"/"Zbuduj stos drewna" moved under "Budowa" only, as
// placement-preview actions (plan `ui-input-004` §2/§3, wood pile added by
// plan items-player-015) — Pause → Akcje keeps all as instant actions via
// its own separate `ui.pauseMenu` handlers/list. "Zbuduj ognisko" stays in
// both Budowa (placement preview) and Ogień (this instant entry) per plan
// items-player-012 — same `buildSimpleFire` action/cost either way, just two
// different entry points into it.
const fireActions = computed(() =>
  visibleFireActions(ui.quickActions.fireAvailability, ui.quickActions)
    .filter((action) => action.id !== 'buildFirePit' && action.id !== 'buildWoodPile'),
)

function startPlacementPreview(kind: PlacementPreviewKind): void {
  closeQuickActions()
  ui.quickActions.onStartPlacementPreview?.(kind)
}

function runFireAction(run: () => { ok: boolean; toast: string; kind: 'info' | 'error' }): void {
  const result = run()
  showToast(result.toast, result.kind)
}

function wait(hours: number): void {
  closeQuickActions()
  ui.quickActions.onWait?.(hours)
}

function rest(variant: RestVariant): void {
  const result = ui.quickActions.onRest?.(variant) ?? (variant === 'camp' ? 'no-blanket' : 'too-far')
  if (result === 'ok' || result === 'choose') {
    closeQuickActions()
    return
  }
  showToast(restStatusText[result], 'error')
}

function placeTrap(kind: TrapKind): void {
  closeQuickActions()
  startPlacementPreview(kind === 'simple' ? 'trapSimple' : 'trapGood')
}

function putDownContainer(): void {
  closeQuickActions()
  ui.quickActions.onPutDownContainer?.()
}

function dig(): void {
  closeQuickActions()
  ui.quickActions.onDig?.()
}

function level(): void {
  closeQuickActions()
  ui.quickActions.onLevel?.()
}

function mound(): void {
  closeQuickActions()
  ui.quickActions.onMound?.()
}

function prepareTerrain(): void {
  closeQuickActions()
  ui.quickActions.onPrepareTerrain?.()
}

function buildWell(): void {
  closeQuickActions()
  ui.quickActions.onStartPlacementPreview?.('well')
}

function buildGarden(): void {
  closeQuickActions()
  ui.quickActions.onStartPlacementPreview?.('garden')
}

function hireHelp(): void {
  closeQuickActions()
  ui.quickActions.onHireHelp?.()
}

function hireEscort(): void {
  closeQuickActions()
  ui.quickActions.onHireEscort?.()
}

function plantTree(): void {
  closeQuickActions()
  ui.quickActions.onPlantTree?.()
}

function plantCrop(cropId: CropId): void {
  closeQuickActions()
  ui.quickActions.onPlantCrop?.(cropId)
}

function equipFishingRod(): void {
  closeQuickActions()
  ui.quickActions.onEquipFishingRod?.()
}

function eatAnything(): void {
  const result = ui.quickActions.onEatAnything?.() ?? { ok: false, toast: 'Nie masz nic do jedzenia.', kind: 'error' as const }
  if (result.ok) closeQuickActions()
  else if (result.toast) showToast(result.toast, result.kind)
}

function cookMeal(): void {
  closeQuickActions()
  ui.quickActions.onCookMeal?.()
}

function startFullCamp(): void {
  closeQuickActions()
  ui.quickActions.onStartFullCamp?.()
}

function cancelWorkContract(id: string): void {
  ui.quickActions.onCancelWorkContract?.(id)
}

type Action = {
  label: string
  cost: string
  disabled?: boolean
  /** D4 adjacent reason when disabled. */
  reason?: string
  onClick: () => void
}

function unavailableReason(flag: boolean, reason: string): Pick<Action, 'disabled' | 'reason'> {
  return flag ? {} : { disabled: true, reason }
}

function fireUnavailable(avail: ActionAvailability): Pick<Action, 'disabled' | 'reason'> {
  if (avail.available) return {}
  const reason = formatMissingRequirements(avail.missing)
  return { disabled: true, reason: reason || 'Niedostępne' }
}

const trapActions = computed<Action[]>(() => {
  const list: Action[] = []
  if (ui.quickActions.traps.simple) {
    list.push({ label: 'Zastaw prostą pułapkę', cost: '1× prosta pułapka', onClick: () => placeTrap('simple') })
  }
  if (ui.quickActions.traps.good) {
    list.push({ label: 'Zastaw dobrą pułapkę', cost: '1× dobra pułapka', onClick: () => placeTrap('good') })
  }
  return list
})

const shovelActions: Action[] = [
  { label: 'Wykop dołek', cost: 'łopata', onClick: dig },
  { label: 'Wyrównaj', cost: 'łopata', onClick: level },
  { label: 'Zrób górkę', cost: 'łopata', onClick: mound },
  { label: 'Zbuduj studnię', cost: 'łopata', onClick: buildWell },
  { label: 'Zbuduj grządkę', cost: formatMaterialCost(gardenMaterialRequirements()), onClick: buildGarden },
]

const terrainActions: Action[] = [
  { label: 'Przygotuj teren', cost: 'łopata', onClick: prepareTerrain },
]

const poisonMeat = (): void => {
  ui.quickActions.onPoisonMeat?.()
}

const survivalActions = computed<Action[]>(() => {
  const list: Action[] = [
    { label: 'Zjedz cokolwiek', cost: 'jedzenie', onClick: eatAnything },
    { label: 'Ugotuj posiłek', cost: 'surowe mięso/ryba', onClick: cookMeal },
  ]
  list.push({
    label: 'Zatruj mięso',
    cost: '1× trujące ziele + surowe mięso',
    onClick: poisonMeat,
    ...unavailableReason(ui.quickActions.canPoisonMeat, 'Brakuje trującego ziela lub surowego mięsa'),
  })
  return list
})

// "Postaw skrzynię"/"Rozstaw namiot"/"Zbuduj ognisko"/"Zbuduj palenisko"/
// "Zbuduj stos drewna" — the shared placement-preview actions grouped under
// "Budowa" (plan `ui-input-004` §2/§3/§7, wood pile added by plan
// items-player-015).
const buildActions = computed<Action[]>(() => {
  const list: Action[] = []

  const fire = ui.quickActions.fireAvailability
  list.push({ label: 'Postaw skrzynię', cost: '1× skrzynia', onClick: () => startPlacementPreview('chest'), ...unavailableReason(ui.quickActions.hasChest, 'Brakuje skrzyni w ekwipunku') })
  list.push({ label: 'Rozstaw namiot', cost: '1× namiot', onClick: () => startPlacementPreview('tent'), ...unavailableReason(ui.quickActions.hasTent, 'Brakuje namiotu w ekwipunku') })
  list.push({
    label: 'Zbuduj ognisko',
    cost: formatCostItems(FIRE_COST_ITEMS.buildSimpleFire),
    onClick: () => startPlacementPreview('fireSimple'),
    ...fireUnavailable(fire.buildSimpleFire),
  })
  list.push({
    label: 'Zbuduj palenisko',
    cost: formatCostItems(FIRE_COST_ITEMS.buildFirePit),
    onClick: () => startPlacementPreview('firePit'),
    ...fireUnavailable(fire.buildFirePit),
  })
  list.push({
    label: 'Zbuduj stos drewna',
    cost: formatCostItems(FIRE_COST_ITEMS.buildWoodPile),
    onClick: () => startPlacementPreview('firePile'),
    ...fireUnavailable(fire.buildWoodPile),
  })
  list.push({ label: 'Postaw pochodnię', cost: formatMaterialCost(STANDING_TORCH_MATERIAL_REQUIREMENTS), onClick: () => startPlacementPreview('standingTorch'), ...unavailableReason(ui.quickActions.hasWoodenTorch, 'Brakuje materiałów na pochodnię') })
  list.push({ label: 'Postaw segment palisady', cost: formatMaterialCost(PALISADE_MATERIAL_REQUIREMENTS), onClick: () => startPlacementPreview('palisade'), ...unavailableReason(ui.quickActions.hasPalisadeMaterial, 'Brakuje materiałów na palisadę') })
  list.push({ label: 'Postaw koryto', cost: formatMaterialCost(PLAYER_TROUGH_MATERIAL_REQUIREMENTS), onClick: () => startPlacementPreview('playerTrough'), ...unavailableReason(ui.quickActions.hasTroughMaterial, 'Brakuje materiałów na koryto') })
  list.push({ label: 'Rozłóż posłanie', cost: formatMaterialCost(BEDROLL_MATERIAL_REQUIREMENTS), onClick: () => startPlacementPreview('bedroll'), ...unavailableReason(ui.quickActions.hasBedrollMaterial, 'Brakuje materiałów na posłanie') })
  list.push({ label: 'Zbuduj podest do spania', cost: formatMaterialCost(PLATFORM_MATERIAL_REQUIREMENTS), onClick: () => startPlacementPreview('platform'), ...unavailableReason(ui.quickActions.hasPlatformMaterial, 'Brakuje materiałów na podest') })
  list.push({ label: 'Zbuduj małą chatę', cost: formatMaterialCost(residentialTotalRequirements('small_house')), onClick: () => startPlacementPreview('smallHouse') })
  list.push({ label: 'Zbuduj średnią chatę', cost: formatMaterialCost(residentialTotalRequirements('medium_house')), onClick: () => startPlacementPreview('mediumHouse') })

  list.push({ label: 'Zbuduj studnię', cost: 'łopata', onClick: buildWell })
  list.push({ label: 'Zbuduj grządkę', cost: formatMaterialCost(gardenMaterialRequirements()), onClick: buildGarden })

  // "Zleć budowę studni" (plan npc-014) — always available, no material
  // cost; the reward is chosen after the well target is placed, not spent up
  // front. This flow intentionally supports only `PlayerWellRecord` targets.
  list.push({ label: 'Zleć budowę studni', cost: '', onClick: () => startPlacementPreview('workContract') })
  // "Zleć pomoc" (plan npc-018 §20) — hires help for an already-existing
  // unfinished target instead of placing a new one; always visible, same
  // "no cost up front" shape as "Zleć budowę studni" — `openHireHelp` itself tells
  // the player when there is nothing eligible to hire help for.
  list.push({ label: 'Zleć pomoc', cost: '', onClick: hireHelp })
  // "Zleć eskortę" (plan npc-030 §26) — paid expedition-escort Work Contract,
  // always visible; no world placement step (no target/flag).
  list.push({ label: 'Zleć eskortę', cost: '', onClick: hireEscort })

  return list
    .sort((a, b) => a.label.localeCompare(b.label))
    .sort((a, b) => (a.disabled ? 1 : b.disabled ? -1 : 0))
})

const CROP_SEED_LABEL: Record<CropId, string> = {
  carrot: 'Zasadź: marchew',
  potato: 'Zasadź: ziemniak',
  cabbage: 'Zasadź: kapustę',
}

const plantActions = computed<Action[]>(() => {
  const list: Action[] = []
  if (ui.quickActions.hasTreeSeed) {
    list.push({ label: 'Zasadź drzewo', cost: '1× nasiono drzewa', onClick: plantTree })
  }
  for (const cropId of ['carrot', 'potato', 'cabbage'] as const) {
    if (!ui.quickActions.cropSeeds[cropId]) continue
    list.push({ label: CROP_SEED_LABEL[cropId], cost: '1× nasiona', onClick: () => plantCrop(cropId) })
  }
  return list
})

// Quick Actions category hierarchy (plan `ui-input-004` §3) — a presentation
// layer over the same existing action lists above; category visibility just
// mirrors each list/flag's own existing v-if condition. Selecting a category
// drills in (`ui.quickActions.category`); "Wróć" returns to this root.
const CATEGORY_LABEL: Record<QuickActionsCategoryId, string> = {
  budowa: 'Budowa',
  ogien: 'Ogień',
  lopata: 'Łopata',
  teren: 'Teren',
  pulapki: 'Pułapki',
  sadzenie: 'Sadzenie',
  wedkarstwo: 'Wędkarstwo',
  czekaj: 'Czekaj',
  skrzynia: 'Skrzynia',
  odpoczynek: 'Odpoczynek',
  przetrwanie: 'Przetrwanie',
  zlecenia: 'Zlecenia',
}

const CATEGORY_ICON: Record<QuickActionsCategoryId, Component> = {
  budowa: BuildingIcon,
  ogien: FlameIcon,
  lopata: ShovelIcon,
  teren: TractorIcon,
  pulapki: LockIcon,
  sadzenie: TreesIcon,
  wedkarstwo: FishingRod,
  czekaj: ClockIcon,
  skrzynia: BoxIcon,
  odpoczynek: BedSingleIcon,
  przetrwanie: Utensils,
  zlecenia: ScrollText,
}

const categories = computed(() => (
  [
    { id: 'budowa', visible: buildActions.value.length > 0, icon: CATEGORY_ICON.budowa },
    { id: 'ogien', visible: fireActions.value.length > 0, icon: CATEGORY_ICON.ogien },
    { id: 'lopata', visible: ui.quickActions.hasDiggingTool, icon: CATEGORY_ICON.lopata },
    { id: 'teren', visible: ui.quickActions.hasDiggingTool, icon: CATEGORY_ICON.teren },
    { id: 'pulapki', visible: trapActions.value.length > 0, icon: CATEGORY_ICON.pulapki },
    { id: 'sadzenie', visible: plantActions.value.length > 0, icon: CATEGORY_ICON.sadzenie },
    { id: 'wedkarstwo', visible: ui.quickActions.hasFishingRod, icon: CATEGORY_ICON.wedkarstwo },
    { id: 'czekaj', visible: true, icon: CATEGORY_ICON.czekaj },
    { id: 'skrzynia', visible: ui.quickActions.hasCarriedContainer, icon: CATEGORY_ICON.skrzynia },
    { id: 'odpoczynek', visible: true, icon: CATEGORY_ICON.odpoczynek },
    { id: 'przetrwanie', visible: true, icon: CATEGORY_ICON.przetrwanie },
    { id: 'zlecenia', visible: ui.quickActions.workContracts.length > 0, icon: CATEGORY_ICON.zlecenia },
  ] as const satisfies readonly { id: QuickActionsCategoryId, visible: boolean, icon: Component }[]
).filter((c) => c.visible))

const selectedCategory = computed(() => {
  const id = ui.quickActions.category
  if (!id) return null
  return { id, label: CATEGORY_LABEL[id], icon: CATEGORY_ICON[id] }
})

type IndexedAction = {
  label: string
  cost?: string
  disabled?: boolean
  reason?: string
  onClick: () => void
}

/** Live action lookup for recent-row re-run (keys are stable presentation ids). */
const actionIndex = computed(() => {
  const map = new Map<string, IndexedAction>()
  const put = (key: string, row: IndexedAction) => { map.set(key, row) }

  for (const action of buildActions.value) {
    put(`budowa:${action.label}`, { label: action.label, cost: action.cost, disabled: action.disabled, reason: action.reason, onClick: action.onClick })
  }
  for (const action of fireActions.value) {
    put(`ogien:${action.id}`, {
      label: action.label,
      cost: action.cost,
      disabled: !action.available,
      reason: action.available ? undefined : (formatMissingRequirements(action.missing) || 'Niedostępne'),
      onClick: () => runFireAction(action.run),
    })
  }
  for (const action of shovelActions) {
    put(`lopata:${action.label}`, { label: action.label, cost: action.cost, disabled: action.disabled, reason: action.reason, onClick: action.onClick })
  }
  for (const action of terrainActions) {
    put(`teren:${action.label}`, { label: action.label, cost: action.cost, disabled: action.disabled, reason: action.reason, onClick: action.onClick })
  }
  for (const action of trapActions.value) {
    put(`pulapki:${action.label}`, { label: action.label, cost: action.cost, disabled: action.disabled, reason: action.reason, onClick: action.onClick })
  }
  for (const action of plantActions.value) {
    put(`sadzenie:${action.label}`, { label: action.label, cost: action.cost, disabled: action.disabled, reason: action.reason, onClick: action.onClick })
  }
  put('wedkarstwo:Łów ryby', { label: 'Łów ryby', onClick: equipFishingRod })
  for (const hours of [1, 2, 4, 6] as const) {
    put(`czekaj:${hours}h`, { label: `${hours}h`, onClick: () => wait(hours) })
  }
  put('skrzynia:Odłóż skrzynię', { label: 'Odłóż skrzynię', onClick: putDownContainer })
  put('odpoczynek:Śpij na biwaku (8h)', { label: 'Śpij na biwaku (8h)', onClick: () => rest('camp') })
  put('odpoczynek:Rozbij pełny obóz', { label: 'Rozbij pełny obóz', onClick: startFullCamp })
  if (ui.quickActions.nearTown) {
    put('odpoczynek:Nocuj w mieście', { label: 'Nocuj w mieście', onClick: () => rest('town') })
  }
  for (const action of survivalActions.value) {
    put(`przetrwanie:${action.label}`, { label: action.label, cost: action.cost, disabled: action.disabled, reason: action.reason, onClick: action.onClick })
  }
  for (const contract of ui.quickActions.workContracts) {
    put(`zlecenia:${contract.id}`, {
      label: contract.label,
      cost: contract.cost,
      onClick: () => cancelWorkContract(contract.id),
    })
  }
  return map
})

const recentRows = computed(() =>
  listQuickActionRecent().map((entry) => {
    const live = actionIndex.value.get(entry.key)
    if (!live) {
      return {
        key: entry.key,
        label: entry.label,
        cost: entry.cost,
        disabled: true,
        reason: 'Niedostępne teraz',
        onClick: () => undefined,
      }
    }
    return {
      key: entry.key,
      label: live.label,
      cost: live.cost ?? entry.cost,
      disabled: live.disabled,
      reason: live.reason,
      onClick: () => trackAndRun(entry.categoryId, entry.key, live.label, live.cost ?? entry.cost, live.onClick),
    }
  }),
)

function trackAndRun(
  categoryId: QuickActionsCategoryId,
  key: string,
  label: string,
  cost: string | undefined,
  run: () => void,
): void {
  recordQuickActionRecent({ key, label, categoryId, cost })
  run()
}

const weaponShortcuts = computed(() => hudWeaponShortcuts({
  combatWeapon: ui.hud.combatWeapon,
  primaryMeleeLabel: ui.hud.primaryMeleeLabel,
  primaryRangedLabel: ui.hud.primaryRangedLabel,
}))

function onWeaponShortcut(action: 'melee' | 'ranged' | 'sheathe'): void {
  if (action === 'sheathe') sheatheCombatWeapon()
  else if (action === 'melee') equipPrimaryMelee()
  else equipPrimaryRanged()
}

function weaponShortcutIcon(action: 'melee' | 'ranged' | 'sheathe'): Component {
  if (action === 'sheathe') return ArrowDownToLine
  if (action === 'ranged') return BowArrow
  return Sword
}
</script>

<template>
  <!-- Desktop FAB stack — above backdrop so Zap can toggle while open (D6). -->
  <div
    v-if="!touchDevice"
    class="pointer-events-none fixed z-10 flex flex-col items-center gap-2"
    style="right: max(20px, env(safe-area-inset-right)); bottom: max(20px, env(safe-area-inset-bottom))"
  >
    <SkillsHudButton />
    <button
      v-for="shortcut in weaponShortcuts"
      :key="shortcut.id"
      type="button"
      class="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-neutral-900/80 text-neutral-50 hover:bg-neutral-800/90"
      :aria-label="shortcut.ariaLabel"
      @click="onWeaponShortcut(shortcut.action)"
    >
      <component
        :is="weaponShortcutIcon(shortcut.action)"
        :size="20"
      />
    </button>
    <button
      type="button"
      class="pointer-events-auto flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-primary/50 bg-primary/80 text-neutral-950 hover:bg-primary"
      aria-label="Szybkie działania"
      @click="toggleQuickActions"
    >
      <Zap :size="22" />
    </button>
  </div>

  <!-- Stage C: centered MenuPanel-like overlay (reposition authorized). -->
  <div
    v-if="ui.quickActions.open"
    class="pointer-events-auto fixed inset-0 z-9 flex items-center justify-center overflow-y-auto bg-neutral-950/50 p-4 backdrop-blur-sm"
    :style="touchDevice
      ? { paddingBottom: 'max(12px, calc(env(safe-area-inset-bottom) + 100px))' }
      : undefined"
    @pointerdown.self="closeQuickActions"
  >
    <section
      ref="panel"
      role="dialog"
      aria-modal="true"
      aria-label="Szybkie działania"
      class="sv-quick-actions flex max-h-[min(36rem,calc(100dvh-2rem))] w-full max-w-md flex-col overflow-hidden rounded-xl border border-white/15 bg-neutral-900/85 text-neutral-50 shadow-2xl"
      :style="{ touchAction: 'pan-y' }"
      @click.stop
    >
      <div class="flex items-center justify-between border-b border-white/15 px-4 py-2">
        <h2 class="font-semibold text-primary">
          Szybkie działania
        </h2>
        <button
          type="button"
          class="rounded px-2 py-1 text-lg leading-none hover:bg-white/10"
          aria-label="Zamknij"
          @click="closeQuickActions"
        >
          ✕
        </button>
      </div>
      <div class="flex flex-col gap-4 overflow-x-hidden overflow-y-auto overscroll-contain p-4">
        <!-- Root: categories + recent (divider). -->
        <template v-if="!ui.quickActions.category">
          <QuickActionsGroup>
            <QuickActionsButton
              v-for="category in categories"
              :key="category.id"
              :label="CATEGORY_LABEL[category.id]"
              :icon="category.icon"
              :disabled="!category.visible"
              @click="selectQuickActionsCategory(category.id)"
            />
          </QuickActionsGroup>

          <div
            v-if="recentRows.length > 0"
            class="border-t border-white/15 pt-3"
          >
            <QuickActionsGroup label="Ostatnie">
              <!--
                Compact chips: no adjacent D4 reason (subtitle stretched the row —
                e.g. torch "Już płonie"). Reason stays as native title tooltip;
                full adjacent reasons remain in category drill-in.
              -->
              <QuickActionsButton
                v-for="row in recentRows"
                :key="row.key"
                :label="row.label"
                :cost="row.cost"
                :disabled="row.disabled"
                :title="row.reason || undefined"
                @click="row.onClick"
              />
            </QuickActionsGroup>
          </div>
        </template>

        <!-- Drilled-in: category icon+name header, then actions. -->
        <template v-else-if="selectedCategory">
          <div class="relative flex items-center justify-center gap-2">
            <button
              type="button"
              class="absolute left-0 inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/15 bg-neutral-800/60 text-neutral-50 hover:bg-neutral-700/70"
              aria-label="Wróć do kategorii"
              @click="backToQuickActionsCategories"
            >
              <ChevronLeft class="size-5" />
            </button>
            <component
              :is="selectedCategory.icon"
              class="size-5 shrink-0 text-primary"
            />
            <h3 class="min-w-0 truncate text-base font-semibold text-neutral-50">
              {{ selectedCategory.label }}
            </h3>
          </div>

          <QuickActionsGroup v-if="ui.quickActions.category === 'budowa'">
            <QuickActionsButton
              v-for="action in buildActions"
              :key="action.label"
              :label="action.label"
              :cost="action.cost"
              :disabled="action.disabled"
              :reason="action.reason"
              @click="trackAndRun('budowa', `budowa:${action.label}`, action.label, action.cost, action.onClick)"
            />
          </QuickActionsGroup>
          <QuickActionsGroup v-if="ui.quickActions.category === 'ogien'">
            <QuickActionsButton
              v-for="action in fireActions"
              :key="action.id"
              :label="action.label"
              :cost="action.cost"
              :disabled="!action.available"
              :reason="action.available ? undefined : (formatMissingRequirements(action.missing) || 'Niedostępne')"
              @click="trackAndRun('ogien', `ogien:${action.id}`, action.label, action.cost, () => runFireAction(action.run))"
            />
          </QuickActionsGroup>
          <QuickActionsGroup v-if="ui.quickActions.category === 'lopata'">
            <QuickActionsButton
              v-for="action in shovelActions"
              :key="action.label"
              :label="action.label"
              :cost="action.cost"
              :disabled="action.disabled"
              :reason="action.reason"
              @click="trackAndRun('lopata', `lopata:${action.label}`, action.label, action.cost, action.onClick)"
            />
          </QuickActionsGroup>
          <QuickActionsGroup v-if="ui.quickActions.category === 'teren'">
            <QuickActionsButton
              v-for="action in terrainActions"
              :key="action.label"
              :label="action.label"
              :cost="action.cost"
              :disabled="action.disabled"
              :reason="action.reason"
              @click="trackAndRun('teren', `teren:${action.label}`, action.label, action.cost, action.onClick)"
            />
          </QuickActionsGroup>
          <QuickActionsGroup v-if="ui.quickActions.category === 'pulapki'">
            <QuickActionsButton
              v-for="action in trapActions"
              :key="action.label"
              :label="action.label"
              :cost="action.cost"
              :disabled="action.disabled"
              :reason="action.reason"
              @click="trackAndRun('pulapki', `pulapki:${action.label}`, action.label, action.cost, action.onClick)"
            />
          </QuickActionsGroup>
          <QuickActionsGroup v-if="ui.quickActions.category === 'sadzenie'">
            <QuickActionsButton
              v-for="action in plantActions"
              :key="action.label"
              :label="action.label"
              :cost="action.cost"
              :disabled="action.disabled"
              :reason="action.reason"
              @click="trackAndRun('sadzenie', `sadzenie:${action.label}`, action.label, action.cost, action.onClick)"
            />
          </QuickActionsGroup>
          <QuickActionsGroup v-if="ui.quickActions.category === 'wedkarstwo'">
            <QuickActionsButton
              label="Łów ryby"
              @click="trackAndRun('wedkarstwo', 'wedkarstwo:Łów ryby', 'Łów ryby', undefined, equipFishingRod)"
            />
          </QuickActionsGroup>
          <QuickActionsGroup v-if="ui.quickActions.category === 'czekaj'">
            <QuickActionsButton
              v-for="hours in [1, 2, 4, 6]"
              :key="hours"
              :label="`${hours}h`"
              @click="trackAndRun('czekaj', `czekaj:${hours}h`, `${hours}h`, undefined, () => wait(hours))"
            />
          </QuickActionsGroup>
          <QuickActionsGroup v-if="ui.quickActions.category === 'skrzynia'">
            <QuickActionsButton
              label="Odłóż skrzynię"
              @click="trackAndRun('skrzynia', 'skrzynia:Odłóż skrzynię', 'Odłóż skrzynię', undefined, putDownContainer)"
            />
          </QuickActionsGroup>
          <QuickActionsGroup v-if="ui.quickActions.category === 'odpoczynek'">
            <QuickActionsButton
              label="Śpij na biwaku (8h)"
              @click="trackAndRun('odpoczynek', 'odpoczynek:Śpij na biwaku (8h)', 'Śpij na biwaku (8h)', undefined, () => rest('camp'))"
            />
            <QuickActionsButton
              label="Rozbij pełny obóz"
              @click="trackAndRun('odpoczynek', 'odpoczynek:Rozbij pełny obóz', 'Rozbij pełny obóz', undefined, startFullCamp)"
            />
            <QuickActionsButton
              v-if="ui.quickActions.nearTown"
              label="Nocuj w mieście"
              @click="trackAndRun('odpoczynek', 'odpoczynek:Nocuj w mieście', 'Nocuj w mieście', undefined, () => rest('town'))"
            />
          </QuickActionsGroup>
          <QuickActionsGroup v-if="ui.quickActions.category === 'przetrwanie'">
            <QuickActionsButton
              v-for="action in survivalActions"
              :key="action.label"
              :label="action.label"
              :cost="action.cost"
              :disabled="action.disabled"
              :reason="action.reason"
              @click="trackAndRun('przetrwanie', `przetrwanie:${action.label}`, action.label, action.cost, action.onClick)"
            />
          </QuickActionsGroup>
          <QuickActionsGroup v-if="ui.quickActions.category === 'zlecenia'">
            <QuickActionsButton
              v-for="contract in ui.quickActions.workContracts"
              :key="contract.id"
              :label="contract.label"
              :cost="contract.cost"
              @click="trackAndRun('zlecenia', `zlecenia:${contract.id}`, contract.label, contract.cost, () => cancelWorkContract(contract.id))"
            />
          </QuickActionsGroup>
        </template>
      </div>
    </section>
  </div>
</template>

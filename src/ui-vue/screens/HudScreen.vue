<script setup lang="ts">
/**
 * Stage E (ui-input-043): V3-like HUD chrome on V1 producers.
 * Aim / mounted / leading geometry and callbacks unchanged (D6).
 * @domain ui
 */
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { isTouchDevice } from '../../input/isTouchDevice'
import HudCarryStatus from '../components/HudCarryStatus.vue'
import HudClockWeather from '../components/HudClockWeather.vue'
import HudNeedsReadout from '../components/HudNeedsReadout.vue'
import { abortTargetedSkill, setHudSkillAimScreen, ui } from '../store'

const touchDevice = isTouchDevice()

/** Free Aim reticle offset (plan 186 follow-up: reticle positioning) — the
 *  third-person camera looks at the player's chest/eye point (`PlayerController`
 *  `lookAtHeight`), which sits at screen center, so a reticle left at dead
 *  center renders on top of the player model. Nudging it up by a small,
 *  fixed screen-space amount clears the model without introducing a
 *  world-space aim point for Free Aim. */
const FREE_AIM_RETICLE_OFFSET_PX = 56

const reticleStyle = computed(() => {
  const target = ui.hud.aimTargetScreen
  if (target) return { left: `${target.x * 100}%`, top: `${target.y * 100}%` }
  return { left: '50%', top: `calc(50% - ${FREE_AIM_RETICLE_OFFSET_PX}px)` }
})

/** Targeted-skill crosshair follows the free mouse cursor (desktop). Touch
 *  keeps a fixed free-aim offset because there is no persistent pointer. */
const skillAimStyle = computed(() => {
  const aim = ui.hud.skillAimScreen
  if (aim) return { left: `${aim.x * 100}%`, top: `${aim.y * 100}%` }
  return { left: '50%', top: `calc(50% - ${FREE_AIM_RETICLE_OFFSET_PX}px)` }
})

function onSkillAimMouseMove(event: MouseEvent): void {
  if (!ui.skillsScreen.selectedSkill || touchDevice) return
  const w = window.innerWidth || 1
  const h = window.innerHeight || 1
  setHudSkillAimScreen({ x: event.clientX / w, y: event.clientY / h })
}

watch(
  () => ui.skillsScreen.selectedSkill,
  (skill) => {
    if (!skill || touchDevice) {
      setHudSkillAimScreen(null)
      return
    }
    // Seed to viewport center until the first mousemove so picking isn't empty.
    if (!ui.hud.skillAimScreen) {
      setHudSkillAimScreen({ x: 0.5, y: 0.5 - FREE_AIM_RETICLE_OFFSET_PX / (window.innerHeight || 1) })
    }
  },
)

onMounted(() => {
  if (!touchDevice) window.addEventListener('mousemove', onSkillAimMouseMove)
})
onUnmounted(() => {
  if (!touchDevice) window.removeEventListener('mousemove', onSkillAimMouseMove)
})

/** Plan 106 + issue 034 — colors match the existing NPC/animal label bars
 *  (`.npc-label__bar--{hp,stamina,vigor,satiety,hydration}`, index.html) so the
 *  player's own bars read as the same visual language. */
const needBars = computed(() => [
  { id: 'hp', label: 'Zdrowie', value: ui.hud.playerNeeds.hp, color: '#e05555' },
  { id: 'stamina', label: 'Kondycja', value: ui.hud.playerNeeds.stamina, color: '#e0c040' },
  { id: 'vigor', label: 'Wigor', value: ui.hud.playerNeeds.vigor, color: '#5cbfa8' },
  { id: 'hunger', label: 'Głód', value: ui.hud.playerNeeds.hunger, color: '#d4893a' },
  { id: 'thirst', label: 'Pragnienie', value: ui.hud.playerNeeds.thirst, color: '#4a9fd8' },
])
</script>

<template>
  <div
    class="sv-hud pointer-events-none fixed z-5 select-none max-[700px]:left-[max(12px,env(safe-area-inset-left))] max-[700px]:top-[max(12px,env(safe-area-inset-top))]"
    style="left: 16px; top: 16px"
  >
    <HudClockWeather
      :time="ui.hud.time"
      :phase="ui.hud.phase"
      :season-label="ui.hud.seasonLabel"
      :weather-label="ui.hud.weatherLabel"
      :temperature-text="ui.hud.temperatureText"
      :weather-kind="ui.hud.weatherKind"
    />
    <HudNeedsReadout :bars="needBars" />
    <HudCarryStatus
      :weight="ui.hud.weight"
      :held="ui.hud.held"
      :held-ammo="ui.hud.heldAmmo"
      :player-condition="ui.hud.playerCondition"
      :fps="ui.hud.fps"
      :show-fps="ui.hud.showFps"
    />
  </div>

  <!-- Dedicated Dismount button (plan fauna-003 §10) — bottom-center, clear
       of the bottom-left joystick and bottom-right action cluster; a plain
       button works for both a mouse click and a touch tap, so this covers
       desktop and mobile without touch-specific wiring. -->
  <div
    v-if="ui.hud.mounted.active"
    class="sv-hud pointer-events-none fixed inset-x-0 bottom-[max(20px,env(safe-area-inset-bottom))] z-5 flex justify-center"
  >
    <button
      type="button"
      class="pointer-events-auto cursor-pointer rounded-full border border-neutral-400/40 bg-neutral-900/75 px-5 py-2.5 text-sm font-semibold tracking-wide text-neutral-50 shadow-lg backdrop-blur-sm transition-colors hover:bg-neutral-800/80 active:bg-neutral-700/80"
      @click="ui.hud.mounted.onDismount?.()"
    >
      Zejdź z wierzchowca ({{ ui.hud.mounted.animalLabel }}){{ touchDevice ? '' : ' [T]' }}
    </button>
  </div>

  <div
    v-else-if="ui.hud.leading.active"
    class="sv-hud pointer-events-none fixed inset-x-0 bottom-[max(20px,env(safe-area-inset-bottom))] z-5 flex justify-center"
  >
    <button
      type="button"
      class="pointer-events-auto cursor-pointer rounded-full border border-neutral-400/40 bg-neutral-900/75 px-5 py-2.5 text-sm font-semibold tracking-wide text-neutral-50 shadow-lg backdrop-blur-sm transition-colors hover:bg-neutral-800/80 active:bg-neutral-700/80"
      @click="ui.hud.leading.onDetach?.()"
    >
      Odepnij linę ({{ ui.hud.leading.animalLabel }})
    </button>
  </div>

  <!-- Targeted-skill cancel (touch) — Esc already clears selection on desktop;
       this mirrors PlacementPreview / lodging cancel chrome. -->
  <div
    v-else-if="touchDevice && ui.skillsScreen.selectedSkill"
    class="sv-hud pointer-events-none fixed inset-x-0 bottom-24 z-[5] flex justify-center"
  >
    <button
      type="button"
      class="pointer-events-auto cursor-pointer rounded-md border border-neutral-400/40 bg-neutral-900/80 px-3 py-1 text-[13px] text-neutral-50 hover:bg-neutral-800/80"
      @click="abortTargetedSkill()"
    >
      Anuluj
    </button>
  </div>

  <!-- Ranged-aim reticle (plan 186 §1) — visible only while drawing a bow.
       Free Aim sits at a fixed screen-space offset from center; a soft lock
       reprojects the target's world-space aim point every frame instead
       (`ui.hud.aimTargetScreen`, set from `app/gameLoop.ts`). Presentation
       only: never touches accuracy/deviation, which stay entirely in
       `combat/rangedAttack.ts`. -->
  <div
    v-if="ui.hud.aiming"
    class="pointer-events-none fixed z-[5]"
    :style="reticleStyle"
  >
    <div class="relative h-9 w-9 -translate-x-1/2 -translate-y-1/2">
      <div class="absolute inset-0 rounded-full border border-ink/70" />
      <div class="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/90" />
    </div>
  </div>

  <!-- Targeted-skill aim crosshair — follows free mouse (system cursor hidden
       via body.seedvale-skill-aiming). Hidden while the bow reticle owns the
       screen. -->
  <div
    v-else-if="ui.skillsScreen.selectedSkill"
    class="pointer-events-none fixed z-[5]"
    :style="skillAimStyle"
  >
    <div class="relative h-8 w-8 -translate-x-1/2 -translate-y-1/2">
      <div class="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink/80" />
      <div class="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink/80" />
      <div class="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/90" />
    </div>
  </div>
</template>

import * as THREE from 'three'
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import type { ObservationLevel, QualitativeHealth } from '../simulation/observation'
import { formatPhysicalAssessment, formatPhysicalAssessmentFromQualitative } from '../simulation/observation'
import { setSubtreeCastShadow } from '../world/waterMirror'
import { barsVisibleForDistance, labelOpacityForDistance } from './labelDistance'
import { createLucideDomIcon } from './lucideDomIcon'
import {
  type AgentLabelIconKind,
  type AgentLabelIconPresentation,
  iconNodeForKind,
  questMarkerIconPresentation,
  shopIconPresentation,
} from './npcLabelIconPresentation'

/**
 * Shared floating name+stat-bars CSS2D label (plan 202 / ui-input-035) —
 * `NpcAgent` and `AnimalAgent` both build one above their mesh (optional
 * icon row, name line + a row of percent-fill bars) and refresh it every
 * frame with write-if-changed DOM guards. This module owns that shared
 * shape; each caller still owns its own bar set, name text and update cadence.
 *
 * @domain ui-input
 */

export type LabelBarKind = 'hp' | 'stamina' | 'vigor' | 'satiety' | 'hydration'

/** Stable icon-row slots — fixed visual order: activity → quest → shop. */
export type AgentLabelIconSlot = 'activity' | 'quest' | 'shop'

/** Structured name presentation for the label name row. */
export type AgentLabelNamePresentation = {
  prefix?: string
  name: string
  suffix?: string
}

export type { AgentLabelIconKind, AgentLabelIconPresentation }

const ICON_SLOT_ORDER: readonly AgentLabelIconSlot[] = ['activity', 'quest', 'shop']

/** One `npc-label__bar--{kind}` bar + its fill div, ready to append into a
 *  `labelBarsEl`. `initialPercent` seeds the fill width before the first
 *  real `update()` call (matches each existing bar's pre-202 default). */
export function createLabelBar(kind: LabelBarKind, initialPercent = 100): { bar: HTMLDivElement, fill: HTMLDivElement } {
  const bar = document.createElement('div')
  bar.className = `npc-label__bar npc-label__bar--${kind}`
  const fill = document.createElement('div')
  fill.className = 'npc-label__bar-fill'
  fill.style.width = `${initialPercent}%`
  bar.appendChild(fill)
  return { bar, fill }
}

export type AgentLabelDom = {
  label: CSS2DObject
  el: HTMLDivElement
  iconRowEl: HTMLDivElement
  nameRowEl: HTMLDivElement
  /** Main name span — kept as `nameEl` for PlayerController / fauna callers. */
  nameEl: HTMLDivElement
  namePrefixEl: HTMLDivElement
  nameSuffixEl: HTMLDivElement
  barsEl: HTMLDivElement
}

/**
 * Builds the `.npc-label` DOM tree (icon row + name row + bars) and wraps
 * it in a `CSS2DObject` positioned at `height` above the mesh origin.
 *
 * @domain ui-input
 */
export function createAgentLabel(
  initialName: string,
  _questMarker: string | null,
  bars: readonly { bar: HTMLDivElement }[],
  height: number,
): AgentLabelDom {
  const wrapperEl = document.createElement('div')
  wrapperEl.className = 'npc-label'

  const iconRowEl = document.createElement('div')
  iconRowEl.className = 'npc-label__icon-row'
  iconRowEl.style.display = 'none'

  const nameRowEl = document.createElement('div')
  nameRowEl.className = 'npc-label__name-row'

  const namePrefixEl = document.createElement('div')
  namePrefixEl.className = 'npc-label__name-prefix'
  namePrefixEl.style.display = 'none'

  const nameEl = document.createElement('div')
  nameEl.className = 'npc-label__name npc-label__name-main'
  nameEl.textContent = initialName

  const nameSuffixEl = document.createElement('div')
  nameSuffixEl.className = 'npc-label__name-suffix'
  nameSuffixEl.style.display = 'none'

  nameRowEl.append(namePrefixEl, nameEl, nameSuffixEl)

  const barsEl = document.createElement('div')
  barsEl.className = 'npc-label__bars'
  barsEl.append(...bars.map((b) => b.bar))

  wrapperEl.append(iconRowEl, nameRowEl, barsEl)

  const label = new CSS2DObject(wrapperEl)
  label.position.set(0, height, 0)

  return {
    label,
    el: wrapperEl,
    iconRowEl,
    nameRowEl,
    nameEl,
    namePrefixEl,
    nameSuffixEl,
    barsEl,
  }
}

/** `current/max` → rounded percent, `0` for a non-positive `max` — shared by
 *  every hp/stamina/vigor bar (not by fauna's satiety/hydration, which are
 *  an inverted 0-1 need with no `max`; those callers round inline). */
export function computeBarPercent(current: number, max: number): number {
  return max > 0 ? Math.round((current / max) * 100) : 0
}

/** Writes `fill`'s width only when `percent` actually differs from the
 *  caller-owned `lastPercent` (the raw ratio drifts by a hair every frame
 *  during regen/drain, so comparing the already-rounded percent is what
 *  actually catches a no-op frame) — returns the value to store back into
 *  that field. */
export function applyBarPercent(fill: HTMLDivElement, percent: number, lastPercent: number): number {
  if (percent !== lastPercent) fill.style.width = `${percent}%`
  return percent
}

/** Distance-derived visibility/shadow/opacity state a label tracks between
 *  frames — one combined field replacing the three separate `last*`
 *  booleans/numbers each caller used to keep. */
export type LabelDistanceState = {
  barsVisible: boolean | null
  shadowCasting: boolean | null
  opacity: number
}

/** Already-resolved observation presentation for one label sync — callers own
 *  Perception/distance policy; this controller only maps level → DOM. */
export type AgentLabelObservationPresentation = {
  level: ObservationLevel
  /** Broad non-personal identity for `basic`/`assessed`. */
  broadIdentity: string
  /** Knowledge-authorized or detailed personal label when `detailed`. */
  knownName: string
  /** Quest marker token from QuestManager (`?`/`✓`/`!`/`…`); mapped to an icon. */
  questMarker: string | null
  /** When true and observation is detailed / full-label, show the shop icon. */
  shopVisible?: boolean
  healthRatio: number
  staminaRatio: number
  /** When set (NPC injury observation, plan npc-025), qualitative health
   *  text uses this instead of deriving from `healthRatio` alone. */
  qualitativeHealth?: QualitativeHealth
  /** Debug bypass — show full detailed presentation regardless of `level`. */
  fullLabelInfo?: boolean
}

export const INITIAL_LABEL_DISTANCE_STATE: LabelDistanceState = {
  barsVisible: null,
  shadowCasting: null,
  opacity: -1,
}

type IconSlotState = {
  el: HTMLDivElement
  presentation: AgentLabelIconPresentation | null
  iconKind: AgentLabelIconKind | null
}

function presentationsEqual(
  a: AgentLabelIconPresentation | null,
  b: AgentLabelIconPresentation | null,
): boolean {
  if (a === b) return true
  if (!a || !b) return false
  return a.icon === b.icon && a.color === b.color && a.title === b.title
}

function namePresentationsEqual(a: AgentLabelNamePresentation, b: AgentLabelNamePresentation): boolean {
  return (a.prefix ?? '') === (b.prefix ?? '')
    && a.name === b.name
    && (a.suffix ?? '') === (b.suffix ?? '')
}

/**
 * Full label controller (review 2026-09-03 §5 E6 / plan ui-input-035) —
 * constructor-time wiring + per-frame `sync()` guards for name, icon slots,
 * bars, distance fade, and optional debug line.
 *
 * @domain ui-input
 */
export type AgentStatusLabelController = {
  label: CSS2DObject
  el: HTMLDivElement
  /** Convenience for simple names — equivalent to `setNamePresentation({ name })`. */
  setName: (text: string) => void
  /** Structured prefix / main / suffix name presentation. */
  setNamePresentation: (presentation: AgentLabelNamePresentation) => void
  /**
   * Sets one icon-row slot. Gameplay quest/shop slots are normally driven by
   * observation `sync`; the activity slot is the deliberate debug bypass.
   */
  setIcon: (slot: AgentLabelIconSlot, presentation: AgentLabelIconPresentation | null) => void
  /** Maps a quest marker token into the quest icon slot (compat helper). */
  setQuestMarker: (text: string | null) => void
  /** `null` hides the debug line; a string shows it, write-if-changed. */
  setDebugLine: (text: string | null) => void
  sync: (
    bars: Partial<Record<LabelBarKind, { current: number, max: number }>>,
    mesh: THREE.Object3D,
    distance: number,
    shadowDistance: number,
    gazeFactor?: number,
    observation?: AgentLabelObservationPresentation,
  ) => void
  /**
   * Distance fade / shadow / bar visibility only — no bar percentages,
   * observation or name updates. Use when presentation content is frozen
   * (e.g. corpse) but label opacity must still track the observer.
   *
   * @domain ui-input
   */
  syncDistance: (
    mesh: THREE.Object3D,
    distance: number,
    shadowDistance: number,
    gazeFactor?: number,
    showBarsOverride?: boolean,
  ) => void
  settleAtZeroHp: () => void
  dispose: () => void
}

/**
 * Builds the full label and wraps it with guarded name/icon/debug/`sync`
 * behavior. `bars` order is display order.
 *
 * @domain ui-input
 */
export function createAgentStatusLabelController(
  name: string,
  questMarker: string | null,
  bars: readonly LabelBarKind[],
  height: number,
): AgentStatusLabelController {
  const builtBars = bars.map((kind) => ({ kind, ...createLabelBar(kind) }))
  const labelDom = createAgentLabel(name, questMarker, builtBars, height)
  const fillByKind = new Map<LabelBarKind, HTMLDivElement>(builtBars.map((b) => [b.kind, b.fill]))
  const lastPercentByKind = new Map<LabelBarKind, number>(builtBars.map((b) => [b.kind, -1]))

  const assessmentEl = document.createElement('div')
  assessmentEl.className = 'npc-label__assessment'
  assessmentEl.style.display = 'none'
  labelDom.el.append(assessmentEl)

  const debugEl = document.createElement('div')
  debugEl.className = 'npc-label__debug'
  debugEl.style.display = 'none'
  labelDom.el.append(debugEl)

  const slots = new Map<AgentLabelIconSlot, IconSlotState>()
  for (const slot of ICON_SLOT_ORDER) {
    const el = document.createElement('div')
    el.className = `npc-label__icon npc-label__icon--${slot}`
    el.style.display = 'none'
    el.dataset.slot = slot
    labelDom.iconRowEl.append(el)
    slots.set(slot, { el, presentation: null, iconKind: null })
  }

  let lastNamePresentation: AgentLabelNamePresentation = { name }
  let lastQuestMarker: string | null = questMarker
  let lastShopVisible = false
  let lastAssessmentText = ''
  let lastObservationLevel: ObservationLevel | null = null
  let lastDebugText = ''
  let distanceState = INITIAL_LABEL_DISTANCE_STATE

  const syncIconRowVisibility = (): void => {
    let anyVisible = false
    for (const slot of ICON_SLOT_ORDER) {
      if (slots.get(slot)?.presentation) {
        anyVisible = true
        break
      }
    }
    const display = anyVisible ? '' : 'none'
    if (labelDom.iconRowEl.style.display !== display) {
      labelDom.iconRowEl.style.display = display
    }
  }

  const applyIconSlot = (
    slot: AgentLabelIconSlot,
    presentation: AgentLabelIconPresentation | null,
  ): void => {
    const state = slots.get(slot)
    if (!state) return
    if (presentationsEqual(state.presentation, presentation)) return

    state.presentation = presentation
    if (!presentation) {
      state.el.style.display = 'none'
      state.el.replaceChildren()
      state.el.removeAttribute('title')
      state.el.style.color = ''
      state.iconKind = null
      syncIconRowVisibility()
      return
    }

    if (state.iconKind !== presentation.icon) {
      state.el.replaceChildren(createLucideDomIcon(iconNodeForKind(presentation.icon), {
        size: 12,
        className: 'npc-label__icon-svg',
      }))
      state.iconKind = presentation.icon
    }

    const color = presentation.color ?? ''
    if (state.el.style.color !== color) state.el.style.color = color
    const title = presentation.title ?? ''
    if ((state.el.getAttribute('title') ?? '') !== title) {
      if (title) state.el.setAttribute('title', title)
      else state.el.removeAttribute('title')
    }
    if (state.el.style.display !== '') state.el.style.display = ''
    syncIconRowVisibility()
  }

  const applyNamePresentation = (presentation: AgentLabelNamePresentation): void => {
    if (namePresentationsEqual(presentation, lastNamePresentation)) return
    lastNamePresentation = {
      prefix: presentation.prefix,
      name: presentation.name,
      suffix: presentation.suffix,
    }

    const prefix = presentation.prefix?.trim() ?? ''
    const suffix = presentation.suffix?.trim() ?? ''
    if (labelDom.nameEl.textContent !== presentation.name) {
      labelDom.nameEl.textContent = presentation.name
    }
    if (labelDom.namePrefixEl.textContent !== prefix) {
      labelDom.namePrefixEl.textContent = prefix
    }
    const prefixDisplay = prefix ? '' : 'none'
    if (labelDom.namePrefixEl.style.display !== prefixDisplay) {
      labelDom.namePrefixEl.style.display = prefixDisplay
    }
    if (labelDom.nameSuffixEl.textContent !== suffix) {
      labelDom.nameSuffixEl.textContent = suffix
    }
    const suffixDisplay = suffix ? '' : 'none'
    if (labelDom.nameSuffixEl.style.display !== suffixDisplay) {
      labelDom.nameSuffixEl.style.display = suffixDisplay
    }
  }

  if (questMarker) {
    applyIconSlot('quest', questMarkerIconPresentation(questMarker))
  }

  return {
    label: labelDom.label,
    el: labelDom.el,
    setName: (text) => {
      applyNamePresentation({ name: text })
    },
    setNamePresentation: (presentation) => {
      applyNamePresentation(presentation)
    },
    setIcon: (slot, presentation) => {
      applyIconSlot(slot, presentation)
    },
    setQuestMarker: (text) => {
      if (text === lastQuestMarker) return
      lastQuestMarker = text
      applyIconSlot('quest', questMarkerIconPresentation(text))
    },
    setDebugLine: (text) => {
      if (text === null) {
        if (debugEl.style.display !== 'none') debugEl.style.display = 'none'
        return
      }
      if (debugEl.style.display === 'none') debugEl.style.display = ''
      if (text !== lastDebugText) {
        lastDebugText = text
        debugEl.textContent = text
      }
    },
    sync: (barValues, mesh, distance, shadowDistance, gazeFactor = 1, observation) => {
      for (const [kind, fill] of fillByKind) {
        const value = barValues[kind]
        if (!value) continue
        const percent = computeBarPercent(value.current, value.max)
        lastPercentByKind.set(kind, applyBarPercent(fill, percent, lastPercentByKind.get(kind) ?? -1))
      }
      let showBarsOverride: boolean | undefined
      if (observation) {
        const presentation = resolveAgentLabelObservationPresentation(observation)
        distanceState = applyAgentLabelObservationPresentation(
          labelDom,
          assessmentEl,
          presentation,
          {
            lastNamePresentation,
            lastQuestMarker,
            lastShopVisible,
            lastAssessmentText,
            lastObservationLevel,
          },
          distanceState,
          applyIconSlot,
          applyNamePresentation,
        )
        lastQuestMarker = presentation.questMarker
        lastShopVisible = presentation.shopVisible
        lastAssessmentText = presentation.assessmentText
        lastObservationLevel = presentation.level
        showBarsOverride = presentation.showBars
      }
      distanceState = updateAgentLabelDistanceState(
        labelDom.el,
        labelDom.barsEl,
        mesh,
        distance,
        shadowDistance,
        distanceState,
        gazeFactor,
        showBarsOverride,
      )
    },
    syncDistance: (mesh, distance, shadowDistance, gazeFactor = 1, showBarsOverride) => {
      distanceState = updateAgentLabelDistanceState(
        labelDom.el,
        labelDom.barsEl,
        mesh,
        distance,
        shadowDistance,
        distanceState,
        gazeFactor,
        showBarsOverride,
      )
    },
    settleAtZeroHp: () => {
      lastPercentByKind.set('hp', 0)
      const hpFill = fillByKind.get('hp')
      if (hpFill) hpFill.style.width = '0%'
      labelDom.barsEl.style.display = 'none'
    },
    dispose: () => {
      labelDom.label.removeFromParent()
      labelDom.el.remove()
    },
  }
}

type ResolvedAgentLabelObservationPresentation = {
  level: ObservationLevel
  nameText: string
  questMarker: string | null
  shopVisible: boolean
  assessmentText: string
  showBars: boolean
  showName: boolean
  showAssessment: boolean
}

function resolveAgentLabelObservationPresentation(
  observation: AgentLabelObservationPresentation,
): ResolvedAgentLabelObservationPresentation {
  const level = observation.fullLabelInfo ? 'detailed' : observation.level
  const assessmentText = observation.qualitativeHealth
    ? formatPhysicalAssessmentFromQualitative(observation.qualitativeHealth, observation.staminaRatio)
    : formatPhysicalAssessment(observation.healthRatio, observation.staminaRatio)
  const shopVisible = level === 'detailed' ? Boolean(observation.shopVisible) : false
  switch (level) {
    case 'assessed':
      return {
        level,
        nameText: observation.broadIdentity,
        questMarker: observation.questMarker,
        shopVisible,
        assessmentText,
        showBars: false,
        showName: true,
        showAssessment: true,
      }
    case 'basic':
      return {
        level,
        nameText: observation.broadIdentity,
        questMarker: observation.questMarker,
        shopVisible,
        assessmentText,
        showBars: false,
        showName: true,
        showAssessment: false,
      }
    case 'detailed':
      return {
        level,
        nameText: observation.knownName,
        questMarker: observation.questMarker,
        shopVisible,
        assessmentText,
        showBars: true,
        showName: true,
        showAssessment: false,
      }
    case 'none':
      return {
        level,
        nameText: '',
        assessmentText,
        questMarker: observation.questMarker,
        shopVisible,
        showBars: false,
        showName: false,
        showAssessment: false,
      }
  }
}

function applyAgentLabelObservationPresentation(
  labelDom: AgentLabelDom,
  assessmentEl: HTMLDivElement,
  presentation: ResolvedAgentLabelObservationPresentation,
  prev: {
    lastNamePresentation: AgentLabelNamePresentation
    lastQuestMarker: string | null
    lastShopVisible: boolean
    lastAssessmentText: string
    lastObservationLevel: ObservationLevel | null
  },
  distanceState: LabelDistanceState,
  applyIconSlot: (slot: AgentLabelIconSlot, presentation: AgentLabelIconPresentation | null) => void,
  applyNamePresentation: (presentation: AgentLabelNamePresentation) => void,
): LabelDistanceState {
  const nameDisplay = presentation.showName ? '' : 'none'
  if (labelDom.nameRowEl.style.display !== nameDisplay) {
    labelDom.nameRowEl.style.display = nameDisplay
  }
  if (presentation.showName && presentation.nameText !== prev.lastNamePresentation.name) {
    // Observation owns the visible identity string; clear prefix/suffix so
    // broad/known swaps do not leave stale structured parts.
    applyNamePresentation({ name: presentation.nameText })
  }

  if (presentation.questMarker !== prev.lastQuestMarker) {
    applyIconSlot('quest', questMarkerIconPresentation(presentation.questMarker))
  }
  if (presentation.shopVisible !== prev.lastShopVisible) {
    applyIconSlot('shop', shopIconPresentation(presentation.shopVisible))
  }

  const assessmentDisplay = presentation.showAssessment ? '' : 'none'
  if (assessmentEl.style.display !== assessmentDisplay) assessmentEl.style.display = assessmentDisplay
  if (presentation.showAssessment && presentation.assessmentText !== prev.lastAssessmentText) {
    assessmentEl.textContent = presentation.assessmentText
  }

  const showBars = presentation.showBars
  if (showBars !== distanceState.barsVisible) labelDom.barsEl.style.display = showBars ? '' : 'none'

  return {
    ...distanceState,
    barsVisible: showBars,
  }
}

export function updateAgentLabelDistanceState(
  el: HTMLDivElement,
  barsEl: HTMLDivElement,
  mesh: THREE.Object3D,
  distance: number,
  shadowDistance: number,
  prev: LabelDistanceState,
  gazeFactor = 1,
  showBarsOverride?: boolean,
): LabelDistanceState {
  const showBars = showBarsOverride ?? barsVisibleForDistance(distance)
  if (showBars !== prev.barsVisible) barsEl.style.display = showBars ? '' : 'none'

  const shadowCasting = distance <= shadowDistance
  if (shadowCasting !== prev.shadowCasting) setSubtreeCastShadow(mesh, shadowCasting)

  // Quantized before comparing — `distance`/`gazeFactor` change by a hair
  // every frame while the observer moves, so an unrounded guard never
  // catches a repeat.
  const opacity = Math.round(labelOpacityForDistance(distance) * gazeFactor * 32) / 32
  if (opacity !== prev.opacity) {
    el.style.opacity = String(opacity)
    // At full visibility bars sit at 80%; once the shared label fades,
    // inherit the parent opacity without an extra dimming factor.
    barsEl.style.opacity = opacity === 1 ? '0.8' : '1'
  }

  return { barsVisible: showBars, shadowCasting, opacity }
}

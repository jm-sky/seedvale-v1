/**
 * Stage E D9 fixtures — HUD presentation only.
 * No WorldBundle / save / climate tick.
 * @domain ui
 */
import type { InteractionGazePrompt } from '../../../interaction/interactionView'
import type { HudWeatherKind } from '../../components/HudClockWeather.vue'
import type { HudNeedBar } from '../../components/HudNeedsReadout.vue'
import type { HudToastRow } from '../../components/HudToastStack.vue'

export type DemoViewId =
  | 'clock-clear'
  | 'clock-storm'
  | 'needs-critical'
  | 'needs-full'
  | 'toasts'
  | 'gaze-ok'
  | 'gaze-disabled'
  | 'placement-valid'
  | 'placement-invalid'
  | 'busy'

export type DemoScenario = {
  id: DemoViewId
  label: string
}

export const DEMO_SCENARIOS: readonly DemoScenario[] = [
  { id: 'clock-clear', label: 'Zegar · pogodnie' },
  { id: 'clock-storm', label: 'Zegar · burza' },
  { id: 'needs-critical', label: 'Needs · krytyczne' },
  { id: 'needs-full', label: 'Needs · pełne' },
  { id: 'toasts', label: 'Toasty' },
  { id: 'gaze-ok', label: 'Gaze · E/R/V' },
  { id: 'gaze-disabled', label: 'Gaze · disabled + powód' },
  { id: 'placement-valid', label: 'Placement · OK' },
  { id: 'placement-invalid', label: 'Placement · invalid' },
  { id: 'busy', label: 'Busy · progress' },
]

export type ClockFixture = {
  time: string
  phase: string
  seasonLabel: string
  weatherLabel: string
  temperatureText: string
  weatherKind: HudWeatherKind
}

export function clockFixture(kind: 'clear' | 'storm'): ClockFixture {
  if (kind === 'storm') {
    return {
      time: '18:42',
      phase: 'Wieczór',
      seasonLabel: 'Jesień',
      weatherLabel: 'Burza',
      temperatureText: '6°C',
      weatherKind: 'storm',
    }
  }
  return {
    time: '11:05',
    phase: 'Dzień',
    seasonLabel: 'Lato',
    weatherLabel: 'Bezchmurnie',
    temperatureText: '25°C',
    weatherKind: 'clear',
  }
}

export function needsFixture(kind: 'critical' | 'full'): readonly HudNeedBar[] {
  if (kind === 'critical') {
    return [
      { id: 'hp', label: 'Zdrowie', value: 0.18, color: '#e05555' },
      { id: 'stamina', label: 'Kondycja', value: 0.12, color: '#e0c040' },
      { id: 'vigor', label: 'Wigor', value: 0.22, color: '#5cbfa8' },
      { id: 'hunger', label: 'Głód', value: 0.08, color: '#d4893a' },
      { id: 'thirst', label: 'Pragnienie', value: 0.15, color: '#4a9fd8' },
    ]
  }
  return [
    { id: 'hp', label: 'Zdrowie', value: 1, color: '#e05555' },
    { id: 'stamina', label: 'Kondycja', value: 0.92, color: '#e0c040' },
    { id: 'vigor', label: 'Wigor', value: 0.88, color: '#5cbfa8' },
    { id: 'hunger', label: 'Głód', value: 0.75, color: '#d4893a' },
    { id: 'thirst', label: 'Pragnienie', value: 0.8, color: '#4a9fd8' },
  ]
}

export function toastFixture(): readonly HudToastRow[] {
  return [
    { id: 1, text: 'Podniesiono: jabłko ×2', variant: 'pickup' },
    { id: 2, text: 'Informacja o czasie', variant: 'info' },
    { id: 3, text: 'Brak miejsca w ekwipunku', variant: 'error' },
  ]
}

export function gazeOkFixture(): InteractionGazePrompt {
  return {
    targetLabel: 'Studnia',
    cycleHint: ' · [Tab] cykl',
    actions: [
      { slot: 'primary', label: 'Nabierz wodę', enabled: true, reasonLabel: '' },
      { slot: 'alternate', label: 'Napraw', enabled: true, reasonLabel: '', consequenceTone: 'caution' },
      { slot: 'inspect', label: 'Zbadaj', enabled: true, reasonLabel: '' },
    ],
  }
}

export function gazeDisabledFixture(): InteractionGazePrompt {
  return {
    targetLabel: 'Ognisko',
    cycleHint: '',
    actions: [
      { slot: 'primary', label: 'Rozpal', enabled: false, reasonLabel: 'Brak krzemienia' },
      { slot: 'alternate', label: 'Gotuj', enabled: false, reasonLabel: 'Ognisko zgaszone', consequenceTone: 'negative' },
      { slot: 'inspect', label: 'Zbadaj', enabled: true, reasonLabel: '' },
    ],
  }
}

export type PlacementFixture = {
  label: string
  reasonLabel: string
  state: 'valid' | 'invalid' | 'preparation'
  canConfirm: boolean
  confirmLabel: string
  supportsRotation: boolean
}

export function placementFixture(kind: 'valid' | 'invalid'): PlacementFixture {
  if (kind === 'invalid') {
    return {
      label: 'Palik',
      reasonLabel: 'Za stroma powierzchnia',
      state: 'invalid',
      canConfirm: false,
      confirmLabel: 'Postaw [E]',
      supportsRotation: true,
    }
  }
  return {
    label: 'Skrzynia',
    reasonLabel: 'Można postawić',
    state: 'valid',
    canConfirm: true,
    confirmLabel: 'Postaw [E]',
    supportsRotation: true,
  }
}

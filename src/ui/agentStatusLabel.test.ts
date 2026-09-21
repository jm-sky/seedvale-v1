// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createAgentStatusLabelController } from './agentStatusLabel'
import {
  activityIconPresentation,
  questMarkerIconPresentation,
  shopIconPresentation,
} from './npcLabelIconPresentation'

function iconSlot(controller: ReturnType<typeof createAgentStatusLabelController>, slot: string): HTMLElement | null {
  return controller.el.querySelector(`.npc-label__icon--${slot}`)
}

function iconRow(controller: ReturnType<typeof createAgentStatusLabelController>): HTMLElement {
  return controller.el.querySelector('.npc-label__icon-row') as HTMLElement
}

function visibleSlots(controller: ReturnType<typeof createAgentStatusLabelController>): string[] {
  return [...controller.el.querySelectorAll('.npc-label__icon')]
    .filter((el) => (el as HTMLElement).style.display !== 'none')
    .map((el) => (el as HTMLElement).dataset.slot ?? '')
}

describe('createAgentStatusLabelController syncDistance (ui-input-026)', () => {
  it('applies the same distance fade policy as sync without re-showing bars', () => {
    const controller = createAgentStatusLabelController('Wilk', null, ['hp', 'stamina'], 2)
    controller.sync(
      { hp: { current: 100, max: 100 }, stamina: { current: 100, max: 100 } },
      controller.label,
      10,
      80,
    )
    expect(controller.el.style.opacity).not.toBe('0')
    controller.settleAtZeroHp()
    expect((controller.el.querySelector('.npc-label__bars') as HTMLElement).style.display).toBe('none')

    controller.syncDistance(controller.label, 40, 80, 1, false)
    expect(controller.el.style.opacity).toBe('0')
    expect((controller.el.querySelector('.npc-label__bars') as HTMLElement).style.display).toBe('none')

    controller.syncDistance(controller.label, 10, 80, 1, false)
    expect(controller.el.style.opacity).toBe('1')
    expect((controller.el.querySelector('.npc-label__bars') as HTMLElement).style.display).toBe('none')
  })

  it('does not change top-level display when label was hidden for harvest', () => {
    const controller = createAgentStatusLabelController('Szczur', null, ['hp'], 2)
    controller.el.style.display = 'none'
    controller.syncDistance(controller.label, 10, 80, 1, false)
    expect(controller.el.style.display).toBe('none')
  })
})

describe('createAgentStatusLabelController observation presentation', () => {
  it('hides observation-owned content at none while keeping the label element', () => {
    const controller = createAgentStatusLabelController('Jan', null, ['hp', 'stamina'], 2)
    controller.sync(
      { hp: { current: 50, max: 100 }, stamina: { current: 80, max: 100 } },
      controller.label,
      40,
      80,
      1,
      {
        level: 'none',
        broadIdentity: 'Osoba',
        knownName: 'Jan',
        questMarker: null,
        healthRatio: 0.5,
        staminaRatio: 0.8,
      },
    )
    expect(controller.el.querySelector('.npc-label__name-main')?.textContent).toBe('Jan')
    expect((controller.el.querySelector('.npc-label__name-row') as HTMLElement).style.display).toBe('none')
    expect((controller.el.querySelector('.npc-label__bars') as HTMLElement).style.display).toBe('none')
  })

  it('shows broad identity and qualitative assessment without bars at assessed', () => {
    const controller = createAgentStatusLabelController('Jan', null, ['hp', 'stamina'], 2)
    controller.sync(
      { hp: { current: 30, max: 100 }, stamina: { current: 10, max: 100 } },
      controller.label,
      24,
      80,
      1,
      {
        level: 'assessed',
        broadIdentity: 'Osoba',
        knownName: 'Jan',
        questMarker: null,
        healthRatio: 0.45,
        staminaRatio: 0.1,
      },
    )
    expect(controller.el.querySelector('.npc-label__name-main')?.textContent).toBe('Osoba')
    expect(controller.el.querySelector('.npc-label__assessment')?.textContent).toBe('Ranny · Wyczerpany')
    expect((controller.el.querySelector('.npc-label__bars') as HTMLElement).style.display).toBe('none')
  })

  it('shows detailed name and bars at detailed', () => {
    const controller = createAgentStatusLabelController('Jan', null, ['hp', 'stamina'], 2)
    controller.sync(
      { hp: { current: 100, max: 100 }, stamina: { current: 100, max: 100 } },
      controller.label,
      5,
      80,
      1,
      {
        level: 'detailed',
        broadIdentity: 'Osoba',
        knownName: 'Jan',
        questMarker: null,
        healthRatio: 1,
        staminaRatio: 1,
      },
    )
    expect(controller.el.querySelector('.npc-label__name-main')?.textContent).toBe('Jan')
    expect((controller.el.querySelector('.npc-label__bars') as HTMLElement).style.display).not.toBe('none')
  })

  it('bypasses observation gating when fullLabelInfo is set', () => {
    const controller = createAgentStatusLabelController('Jan', null, ['hp', 'stamina'], 2)
    controller.sync(
      { hp: { current: 100, max: 100 }, stamina: { current: 100, max: 100 } },
      controller.label,
      100,
      80,
      1,
      {
        level: 'none',
        broadIdentity: 'Osoba',
        knownName: 'Jan',
        questMarker: null,
        healthRatio: 1,
        staminaRatio: 1,
        fullLabelInfo: true,
      },
    )
    expect(controller.el.querySelector('.npc-label__name-main')?.textContent).toBe('Jan')
    expect((controller.el.querySelector('.npc-label__name-row') as HTMLElement).style.display).not.toBe('none')
  })
})

describe('agentStatusLabel shop / quest icon row (ui-input-035)', () => {
  it('hides shop below detailed observation levels', () => {
    for (const level of ['none', 'basic', 'assessed'] as const) {
      const controller = createAgentStatusLabelController('Jan', '?', ['hp'], 2)
      controller.sync(
        { hp: { current: 100, max: 100 } },
        controller.label,
        10,
        80,
        1,
        {
          level,
          broadIdentity: 'Osoba',
          knownName: 'Jan',
          questMarker: '?',
          shopVisible: true,
          healthRatio: 1,
          staminaRatio: 1,
        },
      )
      expect(iconSlot(controller, 'shop')?.style.display).toBe('none')
    }
  })

  it('shows shop ChartBar at detailed when shopVisible', () => {
    const controller = createAgentStatusLabelController('Kasia', null, ['hp'], 2)
    controller.sync(
      { hp: { current: 100, max: 100 } },
      controller.label,
      5,
      80,
      1,
      {
        level: 'detailed',
        broadIdentity: 'Osoba',
        knownName: 'Kasia',
        questMarker: null,
        shopVisible: true,
        healthRatio: 1,
        staminaRatio: 1,
      },
    )
    expect(iconSlot(controller, 'shop')?.style.display).not.toBe('none')
    expect(iconSlot(controller, 'shop')?.querySelector('svg')).toBeTruthy()
  })

  it('shows shop under fullLabelInfo even when observation level is none', () => {
    const controller = createAgentStatusLabelController('Marek', null, ['hp'], 2)
    controller.sync(
      { hp: { current: 100, max: 100 } },
      controller.label,
      100,
      80,
      1,
      {
        level: 'none',
        broadIdentity: 'Osoba',
        knownName: 'Marek',
        questMarker: null,
        shopVisible: true,
        healthRatio: 1,
        staminaRatio: 1,
        fullLabelInfo: true,
      },
    )
    expect(iconSlot(controller, 'shop')?.style.display).not.toBe('none')
  })

  it('does not show shop for fauna / non-vendor presentation', () => {
    const controller = createAgentStatusLabelController('Wilk', null, ['hp'], 2)
    controller.sync(
      { hp: { current: 100, max: 100 } },
      controller.label,
      5,
      80,
      1,
      {
        level: 'detailed',
        broadIdentity: 'Wilk',
        knownName: 'Wilk',
        questMarker: null,
        healthRatio: 1,
        staminaRatio: 1,
      },
    )
    expect(iconSlot(controller, 'shop')?.style.display).toBe('none')
    expect(iconRow(controller).style.display).toBe('none')
  })

  it('renders quest and shop icons together in stable order', () => {
    const controller = createAgentStatusLabelController('Jan', null, ['hp'], 2)
    controller.setIcon('activity', activityIconPresentation({ kind: 'work' }))
    controller.sync(
      { hp: { current: 100, max: 100 } },
      controller.label,
      5,
      80,
      1,
      {
        level: 'detailed',
        broadIdentity: 'Osoba',
        knownName: 'Jan',
        questMarker: '!',
        shopVisible: true,
        healthRatio: 1,
        staminaRatio: 1,
      },
    )
    expect(visibleSlots(controller)).toEqual(['activity', 'quest', 'shop'])
  })

  it('hides the icon row when all slots are empty and leaves no spacer artifacts', () => {
    const controller = createAgentStatusLabelController('Jan', '!', ['hp'], 2)
    controller.sync(
      { hp: { current: 100, max: 100 } },
      controller.label,
      5,
      80,
      1,
      {
        level: 'detailed',
        broadIdentity: 'Osoba',
        knownName: 'Jan',
        questMarker: null,
        shopVisible: false,
        healthRatio: 1,
        staminaRatio: 1,
      },
    )
    expect(visibleSlots(controller)).toEqual([])
    expect(iconRow(controller).style.display).toBe('none')
  })

  it('changing quest presentation does not recreate unrelated icon slots', () => {
    const controller = createAgentStatusLabelController('Jan', null, ['hp'], 2)
    controller.setIcon('activity', activityIconPresentation({ kind: 'sleep' }))
    controller.sync(
      { hp: { current: 100, max: 100 } },
      controller.label,
      5,
      80,
      1,
      {
        level: 'detailed',
        broadIdentity: 'Osoba',
        knownName: 'Jan',
        questMarker: '!',
        shopVisible: true,
        healthRatio: 1,
        staminaRatio: 1,
      },
    )
    const activitySvg = iconSlot(controller, 'activity')?.querySelector('svg')
    const shopSvg = iconSlot(controller, 'shop')?.querySelector('svg')
    controller.sync(
      { hp: { current: 100, max: 100 } },
      controller.label,
      5,
      80,
      1,
      {
        level: 'detailed',
        broadIdentity: 'Osoba',
        knownName: 'Jan',
        questMarker: '✓',
        shopVisible: true,
        healthRatio: 1,
        staminaRatio: 1,
      },
    )
    expect(iconSlot(controller, 'activity')?.querySelector('svg')).toBe(activitySvg)
    expect(iconSlot(controller, 'shop')?.querySelector('svg')).toBe(shopSvg)
    expect(iconSlot(controller, 'quest')?.querySelector('svg')).toBeTruthy()
  })

  it('clears the activity icon when set to null', () => {
    const controller = createAgentStatusLabelController('Jan', null, ['hp'], 2)
    controller.setIcon('activity', activityIconPresentation({ kind: 'combat' }))
    expect(iconSlot(controller, 'activity')?.style.display).not.toBe('none')
    controller.setIcon('activity', null)
    expect(iconSlot(controller, 'activity')?.style.display).toBe('none')
  })
})

describe('agentStatusLabel structured name (ui-input-035)', () => {
  it('renders a simple name in the main span', () => {
    const controller = createAgentStatusLabelController('Jan Kowalski', null, ['hp'], 2)
    expect(controller.el.querySelector('.npc-label__name-main')?.textContent).toBe('Jan Kowalski')
    expect((controller.el.querySelector('.npc-label__name-prefix') as HTMLElement).style.display).toBe('none')
    expect((controller.el.querySelector('.npc-label__name-suffix') as HTMLElement).style.display).toBe('none')
  })

  it('renders prefix-only, suffix-only and prefix+suffix presentations', () => {
    const controller = createAgentStatusLabelController('Jan', null, ['hp'], 2)
    controller.setNamePresentation({ prefix: 'Stary', name: 'Jan Kowalski' })
    expect(controller.el.querySelector('.npc-label__name-prefix')?.textContent).toBe('Stary')
    expect(controller.el.querySelector('.npc-label__name-main')?.textContent).toBe('Jan Kowalski')
    expect((controller.el.querySelector('.npc-label__name-suffix') as HTMLElement).style.display).toBe('none')

    controller.setNamePresentation({ name: 'Jan Kowalski', suffix: 'Starszy' })
    expect((controller.el.querySelector('.npc-label__name-prefix') as HTMLElement).style.display).toBe('none')
    expect(controller.el.querySelector('.npc-label__name-suffix')?.textContent).toBe('Starszy')

    controller.setNamePresentation({ prefix: 'Stary', name: 'Jan Kowalski', suffix: 'Starszy' })
    expect(controller.el.querySelector('.npc-label__name-prefix')?.textContent).toBe('Stary')
    expect(controller.el.querySelector('.npc-label__name-main')?.textContent).toBe('Jan Kowalski')
    expect(controller.el.querySelector('.npc-label__name-suffix')?.textContent).toBe('Starszy')
  })

  it('setName remains compatible for fauna/simple callers', () => {
    const controller = createAgentStatusLabelController('Wilk', null, ['hp'], 2)
    controller.setName('Niebezpieczny wilk')
    expect(controller.el.querySelector('.npc-label__name-main')?.textContent).toBe('Niebezpieczny wilk')
  })
})

describe('npcLabelIconPresentation mappers', () => {
  it('maps quest tokens with QuestManager priority semantics preserved as distinct icons', () => {
    expect(questMarkerIconPresentation('?')?.icon).toBe('quest-talk')
    expect(questMarkerIconPresentation('✓')?.icon).toBe('quest-ready')
    expect(questMarkerIconPresentation('!')?.icon).toBe('quest-available')
    expect(questMarkerIconPresentation('…')?.icon).toBe('quest-progress')
    expect(questMarkerIconPresentation(null)).toBeNull()
  })

  it('maps shop visibility to ChartBar presentation', () => {
    expect(shopIconPresentation(true)?.icon).toBe('shop')
    expect(shopIconPresentation(false)).toBeNull()
  })

  it('prefers need over generic activity kind', () => {
    expect(activityIconPresentation({ kind: 'need', need: 'water' })?.icon).toBe('need-water')
    expect(activityIconPresentation({ kind: 'work' })?.icon).toBe('activity-work')
    expect(activityIconPresentation({ kind: 'idle' })?.icon).toBe('activity-idle')
  })
})

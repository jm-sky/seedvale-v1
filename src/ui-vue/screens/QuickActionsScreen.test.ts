// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, h, nextTick } from 'vue'
import { recordQuickActionRecent } from '../quickActionsRecent'
import { ui } from '../store'
import QuickActionsScreen from './QuickActionsScreen.vue'

let app: ReturnType<typeof createApp> | undefined
let el: HTMLElement

afterEach(() => {
  app?.unmount()
  el?.remove()
  ui.quickActions.open = false
})

describe('Recent live eligibility (review 026 F4)', () => {
  it.each([
    ['lopata', 'Wykop dołek', 'hasDiggingTool', 'onDig'],
    ['teren', 'Przygotuj teren', 'hasDiggingTool', 'onPrepareTerrain'],
    ['wedkarstwo', 'Łów ryby', 'hasFishingRod', 'onEquipFishingRod'],
    ['skrzynia', 'Odłóż skrzynię', 'hasCarriedContainer', 'onPutDownContainer'],
  ] as const)('disables %s after losing its required tool and restores it when recovered', async (categoryId, label, flag, handler) => {
    const run = vi.fn()
    ui.quickActions.open = true
    ui.quickActions.category = null
    ui.quickActions[flag] = true
    ui.quickActions[handler] = run
    recordQuickActionRecent({ key: `${categoryId}:${label}`, categoryId, label })
    el = document.createElement('div')
    document.body.appendChild(el)
    app = createApp({ render: () => h(QuickActionsScreen) })
    app.mount(el)
    const button = () => Array.from(el.querySelectorAll('button')).find((b) => b.textContent?.includes(label))!
    expect(button().disabled).toBe(false)
    ui.quickActions[flag] = false
    // A click before Vue patches native disabled must still fail closed.
    button().click()
    expect(run).not.toHaveBeenCalled()
    expect(ui.quickActions.open).toBe(true)
    await nextTick()
    expect(button().disabled).toBe(true)
    expect(button().getAttribute('title') || button().parentElement?.getAttribute('title')).toBeTruthy()
    button().click()
    expect(run).not.toHaveBeenCalled()
    expect(ui.quickActions.open).toBe(true)
    ui.quickActions[flag] = true
    await nextTick()
    button().click()
    expect(run).toHaveBeenCalledOnce()
  })
})

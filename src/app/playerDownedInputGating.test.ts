// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createKeyboard } from '../input/Keyboard'
import { drainNonModalGameplayInput, runUnlessPlayerDowned } from './playerDownedInputGating'

function press(code: string): void {
  window.dispatchEvent(new KeyboardEvent('keydown', { code, cancelable: true }))
}

describe('playerDownedInputGating (plan ui-input-030)', () => {
  let keyboard: ReturnType<typeof createKeyboard>

  beforeEach(() => {
    keyboard = createKeyboard()
  })

  afterEach(() => {
    keyboard.dispose()
  })

  it('drains gameplay edges including interact and alt interact', () => {
    press('KeyE')
    press('KeyR')
    press('KeyV')
    press('KeyX')
    press('Space')
    press('KeyQ')
    drainNonModalGameplayInput(keyboard)
    expect(keyboard.consumeInteract()).toBe(false)
    expect(keyboard.consumeAltInteract()).toBe(false)
    expect(keyboard.consumeInspect()).toBe(false)
    expect(keyboard.consumeCombatMode()).toBe(false)
    expect(keyboard.consumeJump()).toBe(false)
  })

  it('does not drain UI navigation edges', () => {
    press('KeyL')
    press('KeyI')
    drainNonModalGameplayInput(keyboard)
    expect(keyboard.consumeQuestLog()).toBe(true)
    expect(keyboard.consumeInventory()).toBe(true)
  })

  it('consumes a latched interact press so it cannot fire after recovery', () => {
    press('KeyE')
    drainNonModalGameplayInput(keyboard)
    expect(keyboard.consumeInteract()).toBe(false)
    expect(keyboard.consumeInteract()).toBe(false)
  })

  it('runUnlessPlayerDowned skips the callback while downed', () => {
    const run = vi.fn()
    runUnlessPlayerDowned({ isDowned: () => true }, run)
    expect(run).not.toHaveBeenCalled()
    runUnlessPlayerDowned({ isDowned: () => false }, run)
    expect(run).toHaveBeenCalledOnce()
  })
})

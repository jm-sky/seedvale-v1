import { describe, expect, it } from 'vitest'
import { createStaminaState } from '../shared/StaminaState'
import {
  SPRINT_MIN_STAMINA,
  SPRINT_RESUME_STAMINA,
  tickPlayerStamina,
  updateSprintOutOfBreath,
} from './PlayerNeeds'

describe('sprint stamina hysteresis', () => {
  it('latches out-of-breath at/below min and clears only at/above resume', () => {
    expect(updateSprintOutOfBreath(false, SPRINT_MIN_STAMINA)).toBe(true)
    expect(updateSprintOutOfBreath(false, SPRINT_MIN_STAMINA - 1)).toBe(true)
    expect(updateSprintOutOfBreath(true, (SPRINT_MIN_STAMINA + SPRINT_RESUME_STAMINA) / 2)).toBe(true)
    expect(updateSprintOutOfBreath(false, (SPRINT_MIN_STAMINA + SPRINT_RESUME_STAMINA) / 2)).toBe(false)
    expect(updateSprintOutOfBreath(true, SPRINT_RESUME_STAMINA)).toBe(false)
    expect(updateSprintOutOfBreath(true, SPRINT_RESUME_STAMINA + 1)).toBe(false)
    expect(SPRINT_RESUME_STAMINA).toBeGreaterThan(SPRINT_MIN_STAMINA)
  })

  it('held sprint intent near empty does not oscillate sprint-allowed frame-to-frame', () => {
    const stamina = createStaminaState(100)
    stamina.current = SPRINT_MIN_STAMINA + 3
    let outOfBreath = false
    const sprintAllowed: boolean[] = []
    const dt = 1 / 60
    for (let i = 0; i < 600; i++) {
      outOfBreath = updateSprintOutOfBreath(outOfBreath, stamina.current)
      const sprinting = !outOfBreath
      sprintAllowed.push(sprinting)
      tickPlayerStamina(stamina, dt, sprinting, true, 0.5, 1)
    }
    const firstBlocked = sprintAllowed.indexOf(false)
    expect(sprintAllowed[0]).toBe(true)
    expect(firstBlocked).toBeGreaterThan(0)
    // First recovery stretch lasts seconds (must reach SPRINT_RESUME_STAMINA), not a few frames.
    let blockedLen = 0
    for (let i = firstBlocked; i < sprintAllowed.length; i++) {
      if (!sprintAllowed[i]) blockedLen++
      else break
    }
    expect(blockedLen).toBeGreaterThanOrEqual(180) // >= 3 s at 60 Hz
  })
})

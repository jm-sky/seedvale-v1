import type { createKeyboard } from '../input/Keyboard'

export type KeyboardGameplayDrain = Pick<
  ReturnType<typeof createKeyboard>,
  | 'consumeInteract'
  | 'consumeInteractRelease'
  | 'consumeAltInteract'
  | 'consumeInspect'
  | 'consumeDrop'
  | 'consumeRotateLeft'
  | 'consumeJump'
  | 'consumeCombatMode'
  | 'consumeCycleTarget'
  | 'consumePlus'
  | 'consumeMinus'
  | 'consumeComma'
  | 'consumePeriod'
>

/** Clears edge-triggered non-modal gameplay keys while the player is downed
 *  (plan ui-input-030) so no press survives into the first recovery frame.
 *  UI navigation keys (inventory, quest log, …) are intentionally excluded. */
export function drainNonModalGameplayInput(keyboard: KeyboardGameplayDrain): void {
  keyboard.consumeInteract()
  keyboard.consumeInteractRelease()
  keyboard.consumeAltInteract()
  keyboard.consumeInspect()
  keyboard.consumeDrop()
  keyboard.consumeRotateLeft()
  keyboard.consumeJump()
  keyboard.consumeCombatMode()
  keyboard.consumeCycleTarget()
  keyboard.consumePlus()
  keyboard.consumeMinus()
  keyboard.consumeComma()
  keyboard.consumePeriod()
}

/** Runs a world-mutation callback only when the player is not incapacitated
 *  (plan ui-input-030) — used for Quick Actions entries that bypass the
 *  non-modal `gameLoop` dispatch. */
export function runUnlessPlayerDowned(player: { isDowned(): boolean }, run: () => void): void {
  if (player.isDowned()) return
  run()
}

import type { ItemKind } from '../items/items'

/**
 * Transient armed-throw state (plan items-player-059 §17) — inventory's
 * "Rzuć" arms a throwable item kind (currently only `stone`) without
 * occupying `HeldTool`: the resource stays non-holdable, but the next
 * `[E]` gaze-fire on a live target reuses the same press-to-draw/release
 * ranged trigger `app/gameLoop.ts` already drives for a held bow, via a
 * synthetic `RangedConfig` built from `ITEM_CATALOG[kind].throwable`
 * (`items/itemCatalog.ts`'s `rangedConfigFromThrowable`). Not persisted —
 * purely a same-session UI-arm affordance, cleared on death/out-of-ammo.
 */
export type PlayerThrow = {
  armedKind: () => ItemKind | null
  arm: (kind: ItemKind) => void
  clear: () => void
}

export function createPlayerThrow(): PlayerThrow {
  let armed: ItemKind | null = null
  return {
    armedKind: () => armed,
    arm: (kind) => { armed = kind },
    clear: () => { armed = null },
  }
}

/**
 * Travel-time unit constants (plan world-terrain-059 T1, decisions 1 + 8).
 *
 * Light module (no Three.js / runtime imports) so worldgen census scripts, UI
 * and off-screen NPC travel can share one definition. Existing saves keep their
 * own `dayLengthSec`; these are the defaults for new worlds only.
 *
 * @domain world-time
 */
import { GAME_HOURS_PER_DAY } from './timeConversion'

/** Default real seconds per full game day (12 min → 30 real s per game hour). */
export const DEFAULT_DAY_LENGTH_SEC = 720

/** Player base walk speed (m/s) — owner of `PlayerController`'s `MOVE_SPEED`. */
export const PLAYER_WALK_SPEED = 6

/** In-settlement NPC walk speed (m/s) — `NpcAgent`'s `WALK_SPEED`. */
export const NPC_WALK_SPEED = 2.4

/** NPC "fast march" speed (m/s) for inter-settlement legs and off-screen travel. */
export const NPC_TRAVEL_SPEED = 3.6

/** Real seconds per game hour at the default day length. */
export const DEFAULT_GAME_HOUR_REAL_SEC = DEFAULT_DAY_LENGTH_SEC / GAME_HOURS_PER_DAY

/**
 * Metres a walking player covers in one game hour at the default day length
 * (6 × 30 = 180 m). Spacing targets, census and UI travel-time strings derive
 * from this; worldgen constants derived from it are frozen numbers because
 * `dayLengthSec` is per-world configurable.
 */
export const TRAVEL_HOUR_M = PLAYER_WALK_SPEED * DEFAULT_GAME_HOUR_REAL_SEC

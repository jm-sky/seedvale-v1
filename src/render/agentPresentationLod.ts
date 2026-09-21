/**
 * Shared agent presentation LOD policy (plan world-terrain-041).
 *
 * One pure, stateless near/mid/far decision used by both `NpcAgent` and
 * `AnimalAgent` — NPC/fauna get their own small hierarchy adapters (see
 * `agentPresentationVisibility.ts`), but never their own policy. `near` is
 * today's full presentation; `mid`/`far` only ever affect nodes an owner has
 * explicitly registered as optional (non-silhouette) — everything else about
 * the agent (identity, simulation, colliders, animation mixer, render layer,
 * shadow distance) is untouched.
 *
 * Thresholds here are render-LOD thresholds, not aliases of
 * `animalUpdateCadence.ts`'s CPU cadence radii — that module governs how
 * often simulation/presentation *runs*, this one only governs which already-
 * built optional nodes are visible. They happen to sit in the same
 * neighbourhood because both are keyed off how far away an agent stops being
 * worth full detail, but they are independent constants on purpose so a
 * future change to one never silently retunes the other.
 *
 * @domain world-terrain
 */

export type AgentPresentationLevel = 'near' | 'mid' | 'far'

export type AgentPresentationLodInput = {
  /** Horizontal distance from the observer (player), in metres. */
  distance: number
  /** Forces `near` regardless of distance — mounted/led animal, active
   *  combat, or any other signal the owner already knows locally. */
  important: boolean
}

/** Inside this radius an agent always renders at full presentation. */
export const AGENT_PRESENTATION_NEAR_DISTANCE_M = 18

/** Beyond this radius an agent may drop optional nodes entirely (`far`).
 *  Between the near and mid radii it may already drop them (`mid`) — v1's
 *  only registered optional nodes (NPC hair/beard attachments) treat `mid`
 *  and `far` the same, but the policy still distinguishes them for owners
 *  with a finer-grained optional-node set. */
export const AGENT_PRESENTATION_MID_DISTANCE_M = 36

/**
 * Deterministic, side-effect-free level resolution. Same input always
 * produces the same output — callers own comparing against their last level
 * and deciding whether a transition actually needs to run.
 */
export function resolveAgentPresentationLevel(
  input: AgentPresentationLodInput,
): AgentPresentationLevel {
  if (input.important) return 'near'
  if (input.distance <= AGENT_PRESENTATION_NEAR_DISTANCE_M) return 'near'
  if (input.distance <= AGENT_PRESENTATION_MID_DISTANCE_M) return 'mid'
  return 'far'
}

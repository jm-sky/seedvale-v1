import type { AgentPresentationLevel } from './agentPresentationLod'
import type { Object3D } from 'three'

/**
 * Cached-visibility adapter over a fixed set of optional presentation nodes
 * (plan world-terrain-041) — e.g. an NPC's `ubcHairAttachment`/
 * `ubcBeardAttachment`. The owner selects `optionalNodes` once, right after
 * the model finishes building; `applyLevel()` never traverses the hierarchy
 * again, never touches material/geometry/skeleton/layers, and never touches
 * anything outside `optionalNodes` — in particular not the agent's root, so
 * this can never fight `hideLivingVisual()`/`showLivingVisual()` or corpse
 * lifecycle, which own root/body visibility.
 *
 * @domain world-terrain
 */
export type AgentPresentationVisibility = {
  applyLevel: (level: AgentPresentationLevel) => void
}

/**
 * `null` when `optionalNodes` is empty — a family with no confirmed safe
 * optional nodes gets no adapter at all rather than a no-op one, matching the
 * plan's "family without a safe rule stays full" guardrail.
 */
export function createAgentPresentationVisibility(
  optionalNodes: readonly Object3D[],
): AgentPresentationVisibility | null {
  if (optionalNodes.length === 0) return null
  let level: AgentPresentationLevel = 'near'
  return {
    applyLevel(next) {
      if (next === level) return
      level = next
      const visible = next === 'near'
      for (const node of optionalNodes) node.visible = visible
    },
  }
}

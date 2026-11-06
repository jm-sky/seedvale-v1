import { AGENT_RENDER_LAYER, assignRenderLayer, SIGHT_CONCEALED_LAYER } from '../world/waterMirror'
import type { Object3D } from 'three'

export { SIGHT_CONCEALED_LAYER }

/**
 * @domain world
 * @system sight
 * @role World-042 Stage 1 — conceal/reveal an actor's whole presentation
 *  subtree (incl. CSS2D labels) by render layer. Never touches `.visible`, so
 *  it cannot fight `hideLivingVisual()` / corpse lifecycle. Main and shadow
 *  cameras do not enable `SIGHT_CONCEALED_LAYER`: concealed actors neither
 *  render nor cast shadows.
 */
export function setActorSightConcealed(root: Object3D, concealed: boolean): void {
  assignRenderLayer(root, concealed ? SIGHT_CONCEALED_LAYER : AGENT_RENDER_LAYER)
}

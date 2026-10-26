/**
 * Quaternius v2/v3 body GLBs ship without clips; shared pack is `anims.glb`
 * under the same `/compare/v{2|3}/` mount (mirrors UBC `ual_humanoid.glb`).
 */
export function compareCompanionAnimationUrl(modelUrl: string): string | null {
  const path = modelUrl.split('?')[0] ?? modelUrl
  if (!path.endsWith('.glb')) return null
  const match = path.match(/^\/compare\/(v[23])\//)
  if (!match) return null
  if (path.endsWith('/anims.glb')) return null
  if (path.includes('/eq/')) return null
  return `/compare/${match[1]}/anims.glb`
}

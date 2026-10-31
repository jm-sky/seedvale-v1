/**
 * @domain tools
 * Asset Browser body-build preview (tools-022): build ids and the morph application over a loaded model.
 * Preview-only — gameplay (`assembleCharacter`, NpcAgent, player) never imports this module.
 */
import type { Object3D, SkinnedMesh } from 'three'

export type BodyBuild = 'muscular' | 'heavy' | 'slim'

export const BODY_BUILDS: readonly BodyBuild[] = ['muscular', 'heavy', 'slim']
export const DEFAULT_BODY_BUILD: BodyBuild = 'muscular'

export const BODY_BUILD_LABELS: Record<BodyBuild, string> = {
  muscular: 'Muscular (original)',
  heavy: 'Heavy',
  slim: 'Slim',
}

/** glTF morph target name per build; `null` = all preview influences zero (original Super Hero body). */
const MORPH: Record<BodyBuild, string | null> = { muscular: null, heavy: 'Fat', slim: 'Slim' }
const PREVIEW_MORPH_NAMES = ['Fat', 'Slim'] as const

/** Meshes above the shoulders (head pack: SuperHero_<Sex>/Eyes/Eyebrows, y ≥ 1.45 m; warp influence there < 1 mm). */
const HEAD_ZONE = /(^|_)(Head|HAIR|Hood|Armet|Helm|Hat|Cap|Eyebrows|Eyes|SuperHero)/i

export function parseBodyBuild(raw: string | null | undefined): BodyBuild | undefined {
  const v = raw?.trim().toLowerCase()
  return BODY_BUILDS.find((b) => b === v)
}

export type BodyBuildResult = {
  /** Meshes whose owned preview influences were set. */
  applied: number
  /** Body/garment meshes that lack the requested target (build cannot follow them). */
  unsupported: string[]
}

function skinnedMeshes(root: Object3D): SkinnedMesh[] {
  const out: SkinnedMesh[] = []
  root.traverse((o) => { if ((o as SkinnedMesh).isSkinnedMesh) out.push(o as SkinnedMesh) })
  return out
}

/** Builds the loaded model can follow: muscular always, others only when no body/garment mesh lacks the target. */
export function supportedBodyBuilds(root: Object3D): BodyBuild[] {
  return BODY_BUILDS.filter((b) => applyBodyBuild(root, b, true).unsupported.length === 0 && (b === 'muscular' || applyBodyBuild(root, b, true).applied > 0))
}

/**
 * Select a build on every skinned mesh of `root`: clears only the owned `Fat`/`Slim` influences, then sets the chosen
 * one to 1. Other morphs and mesh instances outside `root` are untouched. `dryRun` only reports support.
 */
export function applyBodyBuild(root: Object3D, build: BodyBuild, dryRun = false): BodyBuildResult {
  const wanted = MORPH[build]
  let applied = 0
  const unsupported: string[] = []
  for (const mesh of skinnedMeshes(root)) {
    const dict = mesh.morphTargetDictionary
    const infl = mesh.morphTargetInfluences
    const hasOwned = !!dict && !!infl && PREVIEW_MORPH_NAMES.some((n) => n in dict)
    if (!hasOwned) {
      if (wanted && !HEAD_ZONE.test(mesh.name)) unsupported.push(mesh.name || '(unnamed)')
      continue
    }
    const idx = wanted ? dict![wanted] : undefined
    if (wanted && idx === undefined) { unsupported.push(mesh.name); continue }
    if (dryRun) { applied++; continue }
    for (const n of PREVIEW_MORPH_NAMES) {
      const i = dict![n]
      if (i !== undefined) infl![i] = 0
    }
    if (idx !== undefined) infl![idx] = 1
    // Skinned bounds are cached from the rest pose; morph changes the silhouette.
    mesh.geometry.boundingBox = null
    mesh.geometry.boundingSphere = null
    applied++
  }
  return { applied, unsupported }
}

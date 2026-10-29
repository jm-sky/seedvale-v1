import { classifyObject, SCENE_BUCKETS, type SceneBucket } from './sceneCensus'
import type { Object3D } from 'three'

/** Per-bucket world-matrix work done by one `scene.updateMatrixWorld()`. */
export type MatrixWorkStats = {
  /** Nodes the traversal visits (visibility does not prune it). */
  nodes: number
  /** Nodes that recompose their local matrix (`matrixAutoUpdate`). */
  composed: number
  /** Nodes that re-multiply their world matrix every traversal. */
  multiplied: number
  /** Skinned meshes among `multiplied` (each also inverts `bindMatrixInverse`). */
  skinned: number
}

export type MatrixWorkCensus = {
  buckets: Record<SceneBucket, MatrixWorkStats>
  /** Direct scene children grouped by name, ranked by `multiplied`, to name the owners. */
  topRoots: MatrixWorkRoot[]
}

function emptyStats(): MatrixWorkStats {
  return { nodes: 0, composed: 0, multiplied: 0, skinned: 0 }
}

export type MatrixWorkRoot = MatrixWorkStats & { name: string, roots: number }

const TOP_ROOTS = 12

/**
 * Steady-state estimate of the matrix work of one scene traversal (Queue
 * Q14 B1b): mirrors three r185 `Object3D.updateMatrixWorld`, where a node
 * re-multiplies when it recomposes itself or any ancestor did (`force`
 * cascade). One-shot `matrixWorldNeedsUpdate` flags are ignored. Diagnostic
 * only — counts nodes, not time; run once per benchmark, not per frame.
 */
export function censusMatrixWork(scene: Object3D): MatrixWorkCensus {
  const buckets = {} as Record<SceneBucket, MatrixWorkStats>
  for (const bucket of SCENE_BUCKETS) buckets[bucket] = emptyStats()
  const roots = new Map<string, MatrixWorkRoot>()

  const visit = (node: Object3D, forced: boolean, root: MatrixWorkStats): void => {
    const stats = buckets[classifyObject(node)]
    const multiplies = forced || node.matrixAutoUpdate
    stats.nodes += 1
    root.nodes += 1
    if (node.matrixAutoUpdate) {
      stats.composed += 1
      root.composed += 1
    }
    if (multiplies && node.matrixWorldAutoUpdate) {
      stats.multiplied += 1
      root.multiplied += 1
      if ((node as { isSkinnedMesh?: boolean }).isSkinnedMesh) {
        stats.skinned += 1
        root.skinned += 1
      }
    }
    for (const child of node.children) visit(child, multiplies, root)
  }

  for (const child of scene.children) {
    const name = child.name || child.type
    let root = roots.get(name)
    if (!root) roots.set(name, root = { name, roots: 0, ...emptyStats() })
    root.roots += 1
    visit(child, scene.matrixAutoUpdate, root)
  }
  const topRoots = [...roots.values()].sort((a, b) => b.multiplied - a.multiplied).slice(0, TOP_ROOTS)
  return { buckets, topRoots }
}

/** Report lines for {@link censusMatrixWork}; empty when not sampled. */
export function formatMatrixWorkLines(census: MatrixWorkCensus | undefined): string {
  if (!census) return ''
  const row = (label: string, s: MatrixWorkStats): string =>
    `  ${label.padEnd(24)} nodes=${s.nodes} composed=${s.composed} multiplied=${s.multiplied} skinned=${s.skinned}`
  const lines = SCENE_BUCKETS
    .filter((bucket) => census.buckets[bucket].nodes > 0)
    .map((bucket) => row(bucket, census.buckets[bucket]))
  lines.push('  top scene children:')
  for (const root of census.topRoots) lines.push(`  ${row(`${root.name.slice(0, 16)} ×${root.roots}`, root)}`)
  return lines.join('\n')
}

/**
 * Build-time identity for benchmark provenance.
 * `__GIT_COMMIT_FULL__` is injected by Vite (`git rev-parse HEAD`); the short
 * `__GIT_COMMIT__` remains for UI. Never invent a SHA at report time.
 */
export function getBuildGitSha(): string {
  try {
    if (typeof __GIT_COMMIT_FULL__ === 'string' && __GIT_COMMIT_FULL__.length > 0) {
      return __GIT_COMMIT_FULL__
    }
  } catch {
    // vitest / non-vite contexts
  }
  try {
    if (typeof __GIT_COMMIT__ === 'string' && __GIT_COMMIT__.length > 0) {
      return __GIT_COMMIT__
    }
  } catch {
    // ignore
  }
  return 'unavailable'
}

export function createRunId(): string {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const rand = Math.random().toString(36).slice(2, 8)
  return `${stamp}-${rand}`
}

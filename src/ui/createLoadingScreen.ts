export type StartupLoadingStage = 'terrain' | 'world' | 'player' | 'render' | 'ready'

const STAGE_DETAIL_LABELS: Record<StartupLoadingStage, string> = {
  terrain: 'Generowanie terenu i rzek…',
  world: 'Przygotowywanie świata…',
  player: 'Przygotowywanie postaci…',
  render: 'Przygotowywanie grafiki…',
  ready: 'Uruchamianie gry…',
}

/** Stage-derived approximate progress — UX orientation only, not measured work. */
const STAGE_PROGRESS: Record<StartupLoadingStage, number> = {
  terrain: 10,
  world: 35,
  player: 60,
  render: 85,
  ready: 100,
}

export type LoadingScreen = {
  /** Updates the coarse detail line and approximate % — O(1), no-op if unchanged or hidden. */
  setStage: (stage: StartupLoadingStage) => void
  /** Fades out and removes the overlay — call once the first real frame has rendered. */
  hide: () => void
}

/**
 * Covers the canvas while the world's initial chunks + settlement/fauna GLTF assets
 * load — without it, that startup work (worth several seconds, especially cold-cache)
 * shows nothing but the page's plain sky-blue background.
 */
export function createLoadingScreen(parent: HTMLElement): LoadingScreen {
  const root = document.createElement('div')
  root.className = 'seedvale-loading'

  const spinner = document.createElement('div')
  spinner.className = 'seedvale-loading__spinner'

  const headlineRow = document.createElement('div')
  headlineRow.className = 'seedvale-loading__headline'

  const headline = document.createElement('div')
  headline.className = 'seedvale-loading__text'
  headline.textContent = 'Budowanie świata…'

  const progress = document.createElement('div')
  progress.className = 'seedvale-loading__progress'

  headlineRow.append(headline, progress)

  const detail = document.createElement('div')
  detail.className = 'seedvale-loading__detail'

  root.append(spinner, headlineRow, detail)
  parent.appendChild(root)

  let currentStage: StartupLoadingStage | null = null
  let displayedProgress = 0
  let hidden = false

  return {
    setStage(stage) {
      if (hidden || currentStage === stage) return
      currentStage = stage
      detail.textContent = STAGE_DETAIL_LABELS[stage]
      displayedProgress = Math.max(displayedProgress, STAGE_PROGRESS[stage])
      progress.textContent = `${displayedProgress}%`
    },
    hide() {
      if (hidden) return
      hidden = true
      root.classList.add('seedvale-loading--hidden')
      root.addEventListener('transitionend', () => root.remove(), { once: true })
    },
  }
}

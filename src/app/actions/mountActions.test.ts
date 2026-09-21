// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest'
import type { PlayerActionContext } from './actionContext'
import { AnimalAgent, type AnimalAgentDeps } from '../../fauna/AnimalAgent'
import { ANIMAL_DEFS } from '../../fauna/animalDefs'
import { DRY_WATER_SAMPLE } from '../../terrain/waterSample'
import { createMountActions } from './mountActions'

const sampleHeight = () => 0
const sampleLocalWater = () => DRY_WATER_SAMPLE
const collidersNear = () => []

function makeDeps(overrides: Partial<AnimalAgentDeps> = {}): AnimalAgentDeps {
  return {
    def: ANIMAL_DEFS.horse,
    animalId: 'test-horse',
    sampleHeight,
    waterLevel: -10,
    sampleLocalWater,
    collidersNear,
    x: 0,
    z: 0,
    ...overrides,
  }
}

function setupMount(opts?: {
  refreshStayOnPlayerDismount?: (animal: AnimalAgent) => void
  resolveAnimal?: (animalId: string) => AnimalAgent | null
  isDowned?: () => boolean
}) {
  const toast = { show: vi.fn() }
  const hud = { setMounted: vi.fn() }
  let mounted = false
  const player = {
    isDowned: opts?.isDowned ?? (() => false),
    isMounted: () => mounted,
    setMounted: vi.fn((value: boolean) => { mounted = value }),
    setMountedTransform: vi.fn(),
    setPosition: vi.fn(),
    mesh: { position: { x: 0, y: 0, z: 0 } },
    skills: { riding: { value: 0 } },
    needs: { stamina: { current: 1, max: 1 } },
    effectiveAttributes: () => ({ endurance: 1 }),
  }
  const ctx = {
    player,
    toast,
    hud,
    busy: { isActive: () => false },
    timeSkip: { isActive: () => false },
    restCamp: { isActive: () => false },
    keyboard: { consumeDismount: () => false, state: {} },
    mouseLook: { state: { yaw: 0 } },
    dayNight: { elapsedDays: 0 },
    bundle: { chunkManager: { sampleHeight } },
  } as unknown as PlayerActionContext

  const refreshStayOnPlayerDismount = opts?.refreshStayOnPlayerDismount
    ?? vi.fn((animal: AnimalAgent) => {
      animal.setOwnedControlMode('stay')
    })

  const actions = createMountActions(
    ctx,
    opts?.resolveAnimal ?? (() => null),
    undefined,
    { refreshStayOnPlayerDismount },
  )
  return { actions, refreshStayOnPlayerDismount, toast, hud, player }
}

describe('createMountActions owned-control Stay refresh (plan fauna-035)', () => {
  it('player dismount refreshes Stay anchor to the horse position at B', () => {
    const { actions, refreshStayOnPlayerDismount } = setupMount()
    const horse = new AnimalAgent(makeDeps({ animalId: 'owned-stay', x: 2, z: 3 }))
    horse.transferOwnershipToPlayer()
    horse.setOwnedControlMode('stay')
    expect(horse.snapshot().control?.stayAnchor).toEqual({ x: 2, z: 3 })

    expect(actions.tryMount(horse)).toBe(true)
    horse.mesh.position.set(40, 0, -15)
    actions.dismount('player')

    expect(refreshStayOnPlayerDismount).toHaveBeenCalledTimes(1)
    expect(refreshStayOnPlayerDismount).toHaveBeenCalledWith(horse)
    expect(horse.getOwnedControlMode()).toBe('stay')
    expect(horse.snapshot().control?.stayAnchor).toEqual({ x: 40, z: -15 })
  })

  it('Follow dismount does not invoke Stay refresh', () => {
    const { actions, refreshStayOnPlayerDismount } = setupMount()
    const horse = new AnimalAgent(makeDeps({ animalId: 'owned-follow', x: 1, z: 1 }))
    horse.transferOwnershipToPlayer()
    expect(horse.getOwnedControlMode()).toBe('follow')

    expect(actions.tryMount(horse)).toBe(true)
    horse.mesh.position.set(20, 0, 20)
    actions.dismount('player')

    expect(refreshStayOnPlayerDismount).not.toHaveBeenCalled()
    expect(horse.getOwnedControlMode()).toBe('follow')
    expect(horse.snapshot().control?.stayAnchor).toBeUndefined()
  })

  it('fall exit does not refresh Stay anchor', () => {
    const { actions, refreshStayOnPlayerDismount } = setupMount()
    const horse = new AnimalAgent(makeDeps({ animalId: 'owned-fall', x: 5, z: 5 }))
    horse.transferOwnershipToPlayer()
    horse.setOwnedControlMode('stay')

    expect(actions.tryMount(horse)).toBe(true)
    horse.mesh.position.set(30, 0, 0)
    actions.dismount('fall')

    expect(refreshStayOnPlayerDismount).not.toHaveBeenCalled()
    expect(horse.getOwnedControlMode()).toBe('stay')
    expect(horse.snapshot().control?.stayAnchor).toEqual({ x: 5, z: 5 })
  })

  it('non-player-owned mount does not refresh Stay on player dismount', () => {
    const { actions, refreshStayOnPlayerDismount } = setupMount()
    const horse = new AnimalAgent(makeDeps({ animalId: 'merchant-horse', x: 0, z: 0 }))
    expect(horse.isPlayerOwned()).toBe(false)
    // Household mounts have no player owned-control mode to refresh.
    expect(actions.tryMount(horse)).toBe(true)
    horse.mesh.position.set(12, 0, 8)
    actions.dismount('player')

    expect(refreshStayOnPlayerDismount).not.toHaveBeenCalled()
  })
})

describe('createMountActions rebuild/New-Game lifecycle (plan items-player-057/056)', () => {
  it('mountedAnimalId() reflects a still-pending restore/rebuild-reattach id (save projection)', () => {
    const { actions } = setupMount()
    expect(actions.mountedAnimalId()).toBeNull()
    actions.restoreMountedAnimalId('pending-horse')
    expect(actions.isMounted()).toBe(false)
    expect(actions.mountedAnimalId()).toBe('pending-horse')
  })

  it('detachForRebuild drops the live handle but keeps the durable relation, and update() reattaches once the fresh bundle resolves it', () => {
    let resolvable: AnimalAgent | null = null
    const { actions } = setupMount({ resolveAnimal: (id) => (resolvable?.animalId === id ? resolvable : null) })
    const horse = new AnimalAgent(makeDeps({ animalId: 'rebuild-horse', x: 0, z: 0 }))
    expect(actions.tryMount(horse)).toBe(true)
    expect(actions.isMounted()).toBe(true)

    actions.detachForRebuild()
    expect(actions.isMounted()).toBe(false)
    // Durable relation survives the detach — a save taken mid-rebuild must
    // not lose it.
    expect(actions.mountedAnimalId()).toBe('rebuild-horse')

    // Not resolvable yet (fresh bundle still materializing livestock) — stays pending.
    actions.update(0.016, 1)
    expect(actions.isMounted()).toBe(false)
    expect(actions.mountedAnimalId()).toBe('rebuild-horse')

    // The same persistent animal becomes resolvable against the fresh bundle.
    resolvable = horse
    actions.update(0.016, 1)
    expect(actions.isMounted()).toBe(true)
    expect(actions.mountedAnimalId()).toBe('rebuild-horse')
  })

  it('a dead/non-mountable animal discovered after rebuild-detach clears the relation and unmounts cleanly', () => {
    const horse = new AnimalAgent(makeDeps({ animalId: 'doomed-horse', x: 0, z: 0 }))
    const { actions, toast, hud, player } = setupMount({ resolveAnimal: (id) => (id === horse.animalId ? horse : null) })
    expect(actions.tryMount(horse)).toBe(true)
    actions.detachForRebuild()
    horse.health.dead = true

    actions.update(0.016, 1)

    expect(actions.isMounted()).toBe(false)
    expect(actions.mountedAnimalId()).toBeNull()
    expect(player.isMounted()).toBe(false)
    expect(hud.setMounted).toHaveBeenCalledWith(false, '', null)
    expect(toast.show).toHaveBeenCalledWith('Wierzchowiec zniknął.', 'error')
  })

  it('resetForNewGame clears both live and pending relation without gameplay dismount consequences', () => {
    const { actions, refreshStayOnPlayerDismount, toast, player } = setupMount()
    const horse = new AnimalAgent(makeDeps({ animalId: 'new-game-horse', x: 0, z: 0 }))
    horse.transferOwnershipToPlayer()
    horse.setOwnedControlMode('stay')
    expect(actions.tryMount(horse)).toBe(true)
    toast.show.mockClear()

    actions.resetForNewGame()

    expect(actions.isMounted()).toBe(false)
    expect(actions.mountedAnimalId()).toBeNull()
    expect(player.isMounted()).toBe(false)
    expect(refreshStayOnPlayerDismount).not.toHaveBeenCalled()
    expect(toast.show).not.toHaveBeenCalled()
  })

  it('resetForNewGame is safe to call while only a restore was pending (no live mount)', () => {
    const { actions } = setupMount()
    actions.restoreMountedAnimalId('pending-horse')
    actions.resetForNewGame()
    expect(actions.mountedAnimalId()).toBeNull()
  })
})

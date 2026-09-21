import { describe, expect, it, vi } from 'vitest'
import type { Interactable } from '../interaction/Interactable'
import { WORLD_SPATIAL_CONTEXT_SURFACE } from '../world/spatialContext'
import { createWaterSource, UNCOVERED_WELL_CONSUMPTION_RISK } from '../world/WaterSource'
import { arbitrateGazeWaterEdgeTarget, requestDirectWaterDrink } from './waterDrinkInteraction'

const waterEdge: Interactable = {
  kind: 'waterEdge',
  position: { x: 0, z: 0 },
  promptLabel: 'Woda',
  source: createWaterSource('lake'),
  spatialContext: WORLD_SPATIAL_CONTEXT_SURFACE,
}

const digTarget: Interactable = {
  kind: 'dig',
  position: { x: 1, z: 1 },
  promptLabel: 'Wykop',
  profile: null,
  canLevel: false,
  spatialContext: WORLD_SPATIAL_CONTEXT_SURFACE,
}

const combatTarget = {
  kind: 'animal',
  position: { x: 2, z: 2 },
  promptLabel: 'Wilk',
  animal: { animalId: 'wolf-1' },
  spatialContext: WORLD_SPATIAL_CONTEXT_SURFACE,
} as Interactable

describe('arbitrateGazeWaterEdgeTarget (plan ui-input-034)', () => {
  it('keeps a non-shoreline gaze winner', () => {
    const item: Interactable = {
      kind: 'item',
      position: { x: 0, z: 0 },
      promptLabel: 'Gałąź',
      item: { id: 'branch-1', kind: 'branch', source: 'dropped' },
      spatialContext: WORLD_SPATIAL_CONTEXT_SURFACE,
    }
    expect(arbitrateGazeWaterEdgeTarget(item, digTarget, combatTarget, 'shovel')).toBe(item)
  })

  it('demotes plain shoreline to a valid dig target', () => {
    expect(arbitrateGazeWaterEdgeTarget(waterEdge, digTarget, null, 'shovel')).toBe(digTarget)
  })

  it('demotes plain shoreline to combat when digging is unavailable', () => {
    expect(arbitrateGazeWaterEdgeTarget(waterEdge, null, combatTarget, null)).toBe(combatTarget)
  })

  it('keeps fishing shoreline while holding a fishing-capable tool', () => {
    expect(arbitrateGazeWaterEdgeTarget(waterEdge, digTarget, combatTarget, 'fishing_rod')).toBe(waterEdge)
  })
})

describe('requestDirectWaterDrink (plan ui-input-034)', () => {
  it('drinks safe water immediately', () => {
    const drink = vi.fn()
    const openActionConfirm = vi.fn()
    requestDirectWaterDrink(createWaterSource('well'), () => null, { drinkFromWaterSource: drink, openActionConfirm })
    expect(drink).toHaveBeenCalledOnce()
    expect(openActionConfirm).not.toHaveBeenCalled()
  })

  it('opens confirmation for unsafe water and commits once after revalidation', () => {
    const drink = vi.fn()
    let confirm: (() => void) | undefined
    const openActionConfirm = vi.fn((_title, _body, onConfirm) => { confirm = onConfirm })
    const preview = createWaterSource('lake')
    const live = createWaterSource('lake')
    requestDirectWaterDrink(preview, () => live, { drinkFromWaterSource: drink, openActionConfirm })
    expect(drink).not.toHaveBeenCalled()
    expect(openActionConfirm).toHaveBeenCalledOnce()
    confirm?.()
    expect(drink).toHaveBeenCalledTimes(1)
    expect(drink).toHaveBeenCalledWith(live)
  })

  it('does not drink when revalidation fails after confirm', () => {
    const drink = vi.fn()
    let confirm: (() => void) | undefined
    const openActionConfirm = vi.fn((_title, _body, onConfirm) => { confirm = onConfirm })
    requestDirectWaterDrink(createWaterSource('lake'), () => null, { drinkFromWaterSource: drink, openActionConfirm })
    confirm?.()
    expect(drink).not.toHaveBeenCalled()
  })

  it('routes undrinkable sources through the immediate drink boundary', () => {
    const drink = vi.fn()
    const openActionConfirm = vi.fn()
    requestDirectWaterDrink(createWaterSource('ocean'), () => null, { drinkFromWaterSource: drink, openActionConfirm })
    expect(drink).toHaveBeenCalledOnce()
    expect(openActionConfirm).not.toHaveBeenCalled()
  })

  it('requires confirmation when consumptionRisk is present on a safe-quality source', () => {
    const openActionConfirm = vi.fn()
    requestDirectWaterDrink(
      { kind: 'well', quality: 'safe', consumptionRisk: UNCOVERED_WELL_CONSUMPTION_RISK },
      () => null,
      { drinkFromWaterSource: vi.fn(), openActionConfirm },
    )
    expect(openActionConfirm).toHaveBeenCalledOnce()
  })
})

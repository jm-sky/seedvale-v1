import { describe, expect, it } from 'vitest'
import { createWaterSource, requiresRiskyWaterDrinkConfirmation, UNCOVERED_WELL_CONSUMPTION_RISK } from './WaterSource'

describe('createWaterSource (plan world-011)', () => {
  it('classifies well as safe', () => {
    expect(createWaterSource('well')).toEqual({ kind: 'well', quality: 'safe' })
  })

  it('classifies river as safe (mountain streams read as clean)', () => {
    expect(createWaterSource('river')).toEqual({ kind: 'river', quality: 'safe' })
  })

  it('classifies lake as unsafe', () => {
    expect(createWaterSource('lake')).toEqual({ kind: 'lake', quality: 'unsafe' })
  })

  it('classifies ocean as undrinkable', () => {
    expect(createWaterSource('ocean')).toEqual({ kind: 'ocean', quality: 'undrinkable' })
  })
})

describe('requiresRiskyWaterDrinkConfirmation (plan ui-input-034)', () => {
  it('requires confirmation for unsafe natural water', () => {
    expect(requiresRiskyWaterDrinkConfirmation(createWaterSource('lake'))).toBe(true)
  })

  it('does not require confirmation for safe water without consumption risk', () => {
    expect(requiresRiskyWaterDrinkConfirmation(createWaterSource('well'))).toBe(false)
  })

  it('does not offer confirmation for undrinkable water', () => {
    expect(requiresRiskyWaterDrinkConfirmation(createWaterSource('ocean'))).toBe(false)
  })

  it('requires confirmation when consumptionRisk is set', () => {
    expect(requiresRiskyWaterDrinkConfirmation({
      kind: 'well',
      quality: 'safe',
      consumptionRisk: UNCOVERED_WELL_CONSUMPTION_RISK,
    })).toBe(true)
  })
})

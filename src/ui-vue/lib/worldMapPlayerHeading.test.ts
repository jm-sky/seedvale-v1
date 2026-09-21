import { describe, expect, it } from 'vitest'
import { worldMapPlayerLookDirection } from './drawMap'

const EPS = 1e-9

function expectDirection(yaw: number, dirX: number, dirY: number): void {
  const dir = worldMapPlayerLookDirection(yaw)
  expect(dir.dirX).toBeCloseTo(dirX, 9)
  expect(dir.dirY).toBeCloseTo(dirY, 9)
}

describe('worldMapPlayerLookDirection', () => {
  it('maps cardinal yaw to canvas directions (north-up, MouseLook convention)', () => {
    expectDirection(0, 0, -1)
    expectDirection(Math.PI / 2, -1, 0)
    expectDirection(Math.PI, 0, 1)
    expectDirection(-Math.PI / 2, 1, 0)
  })

  it('returns a unit vector', () => {
    for (const yaw of [0, 0.7, -1.2, Math.PI * 0.25]) {
      const { dirX, dirY } = worldMapPlayerLookDirection(yaw)
      expect(dirX * dirX + dirY * dirY).toBeCloseTo(1, EPS)
    }
  })
})

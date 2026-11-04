import { PerspectiveCamera, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { aimFlyCamera, readFlyConfig } from './flyCam'

describe('readFlyConfig', () => {
  it('returns null without ?fly', () => {
    expect(readFlyConfig('?seed=1')).toBeNull()
  })

  it('parses flyPose=home with default height and implies top-down', () => {
    const c = readFlyConfig('?fly&flyPose=home')!
    expect(c.home).toEqual({ agl: null })
    expect(c.pose).toBeNull()
    expect(c.top).toBe(true)
  })

  it('parses flyPose=home,300', () => {
    expect(readFlyConfig('?fly&flyPose=home,300')!.home).toEqual({ agl: 300 })
  })

  it('keeps literal poses unchanged and not top-down', () => {
    const c = readFlyConfig('?fly&flyPose=10,20,50,1,-0.5')!
    expect(c.pose).toEqual({ x: 10, z: 20, agl: 50, yaw: 1, pitch: -0.5 })
    expect(c.home).toBeNull()
    expect(c.top).toBe(false)
  })

  it('parses flyTop and flyFov', () => {
    const c = readFlyConfig('?fly&flyTop&flyFov=30')!
    expect(c.top).toBe(true)
    expect(c.fov).toBe(30)
    expect(readFlyConfig('?fly&flyTop=0')!.top).toBe(false)
    expect(readFlyConfig('?fly&flyFov=abc')!.fov).toBeNull()
  })
})

describe('aimFlyCamera', () => {
  it('top-down looks along -Y with image-up = north (-Z) and a non-degenerate basis', () => {
    const cam = new PerspectiveCamera(60, 1, 0.1, 500)
    aimFlyCamera(cam, 5, 200, 7, 1.3, -Math.PI / 2, true)
    cam.updateMatrixWorld(true)
    const dir = cam.getWorldDirection(new Vector3())
    const up = new Vector3(0, 1, 0).applyQuaternion(cam.quaternion)
    const right = new Vector3(1, 0, 0).applyQuaternion(cam.quaternion)
    expect(dir.y).toBeCloseTo(-1, 6)
    expect(up.z).toBeCloseTo(-1, 6)
    expect(right.x).toBeCloseTo(1, 6)
    expect(Number.isNaN(cam.quaternion.x)).toBe(false)
  })

  it('normal mode restores camera.up', () => {
    const cam = new PerspectiveCamera()
    aimFlyCamera(cam, 0, 10, 0, 0, -Math.PI / 2, true)
    aimFlyCamera(cam, 0, 10, 0, 0, 0, false)
    expect(cam.up.toArray()).toEqual([0, 1, 0])
  })
})

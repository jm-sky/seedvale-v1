/**
 * Position-dependent surface weather for terrain and grass shaders (world-terrain-062 W2).
 * The per-fragment / per-blade climate offset is the closed form of `climateOffsetC`
 * (latitude + lapse, exact — no approximation), and wetness/snow come from a 16-knot LUT of
 * `computeSurfaceWeather` at 1 °C offsets. Uniform upload only: 2 × 16 floats + one vec4, no new
 * program variants. TS twins: `climateOffsetFromParams` (macroClimate) + `surfaceWeatherAtOffset` (weather).
 * @domain world-terrain
 * @subdomain terrain
 */
import * as THREE from 'three'
import { SURFACE_LUT_KNOTS, SURFACE_LUT_MIN_C, type SurfaceWeatherLut } from '../world/weather'
import { WORLD_HALF_EXTENT } from './continentMask'
import { SURFACE_CLIMATE_OFF, type SurfaceClimateParams } from './macroClimate'

/** Shared mutable uniform objects, referenced (not copied) by terrain and grass programs. */
export type SurfaceClimateUniforms = {
  uSnowLut: { value: Float32Array }
  uWetLut: { value: Float32Array }
  /** (a, b, lapse, waterLevel) of `climateOffsetC`; all-zero = offset 0 everywhere. */
  uClimate: { value: THREE.Vector4 }
}

export function createSurfaceClimateUniforms(): SurfaceClimateUniforms {
  return {
    uSnowLut: { value: new Float32Array(SURFACE_LUT_KNOTS) },
    uWetLut: { value: new Float32Array(SURFACE_LUT_KNOTS) },
    uClimate: { value: new THREE.Vector4(0, 0, 0, 0) },
  }
}

export function setSurfaceClimateParams(u: SurfaceClimateUniforms, p: SurfaceClimateParams = SURFACE_CLIMATE_OFF): void {
  u.uClimate.value.set(p.a, p.b, p.lapse, p.waterLevel)
}

export function setSurfaceWeatherLut(u: SurfaceClimateUniforms, lut: SurfaceWeatherLut): void {
  u.uSnowLut.value.set(lut.snow)
  u.uWetLut.value.set(lut.wetness)
}

/** Uniform declarations + functions; include once per program (guarded). Snow-only programs ignore `uWetLut`. */
export const SURFACE_CLIMATE_GLSL = `
#ifndef SV_SURFACE_CLIMATE_GLSL
#define SV_SURFACE_CLIMATE_GLSL
uniform float uSnowLut[${SURFACE_LUT_KNOTS}];
uniform float uWetLut[${SURFACE_LUT_KNOTS}];
uniform vec4 uClimate;
float svClimateOffset( vec3 p ) {
  float along = clamp( p.z + ${WORLD_HALF_EXTENT.toFixed(1)}, 0.0, ${(WORLD_HALF_EXTENT * 2).toFixed(1)} );
  return uClimate.x + uClimate.y * along - uClimate.z * max( 0.0, p.y - uClimate.w );
}
float svLutPos( float offsetC ) {
  return clamp( offsetC - ( ${SURFACE_LUT_MIN_C.toFixed(1)} ), 0.0, ${(SURFACE_LUT_KNOTS - 1).toFixed(1)} );
}
float svSurfaceSnow( vec3 p ) {
  float f = svLutPos( svClimateOffset( p ) );
  int i = min( int( floor( f ) ), ${SURFACE_LUT_KNOTS - 2} );
  return mix( uSnowLut[ i ], uSnowLut[ i + 1 ], f - float( i ) );
}
float svSurfaceWet( vec3 p ) {
  float f = svLutPos( svClimateOffset( p ) );
  int i = min( int( floor( f ) ), ${SURFACE_LUT_KNOTS - 2} );
  return mix( uWetLut[ i ], uWetLut[ i + 1 ], f - float( i ) );
}
#endif
`

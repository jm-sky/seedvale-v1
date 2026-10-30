import { Vector2 } from 'three'

/**
 * Screen-space crepuscular rays (radial blur toward the sun's projected
 * screen position, weighted by a bright-pass threshold). No occlusion buffer
 * — terrain/objects in front of the sun are already dark in `tDiffuse`, so
 * they contribute ~0 to the accumulation and read as naturally occluding the
 * rays. Cheap approximation, not physically-based volumetric lighting.
 *
 * Default path (issue 040 — glare + stepped shaft edges): each tap is capped
 * to luminance 1 and the sum is normalised by the decay series, so the result
 * is the decay-weighted *fraction* of the path that sees bright sky instead
 * of a sum that saturates the clamp almost everywhere near the sun. A soft
 * shoulder replaces the hard per-channel `min`, and a per-pixel interleaved-
 * gradient-noise offset of the first tap turns the 32-tap banding into fine
 * grain. Same tap count, no extra pass. `GOD_RAYS_LEGACY` (`?godRaysSoft=0`)
 * keeps the issue-016 shader for the before/after A/B.
 */
export const GodRaysShader = {
  name: 'GodRaysShader',

  defines: {} as Record<string, string>,

  uniforms: {
    tDiffuse: { value: null },
    lightPosition: { value: new Vector2(0.5, 0.5) },
    exposure: { value: 0.22 },
    decay: { value: 0.95 },
    density: { value: 0.9 },
    // Legacy path only: kept modest so shafts read as streaks, not a
    // full-frame lift when many samples hit HDR sky (issue 016).
    weight: { value: 0.4 },
    // Above typical day-fog luminance so fogged horizons don't feed the rays.
    threshold: { value: 0.75 },
    /** Overall fade — 0 while the sun is below/far from the horizon or off
     *  screen, so the sample loop below is wasted work only near dawn/dusk. */
    intensity: { value: 0 },
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,

  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 lightPosition;
    uniform float exposure;
    uniform float decay;
    uniform float density;
    uniform float weight;
    uniform float threshold;
    uniform float intensity;
    varying vec2 vUv;

    const int NUM_SAMPLES = 32;
    // Ceiling of the added linear light (same 0.2 as issue 016), reached
    // asymptotically through a soft shoulder instead of a hard clamp.
    const float RAYS_CAP = 0.2;
    // exposure (0.22) × gain ≈ 0.26 for a fully unoccluded path → ~0.15 after
    // the shoulder: a fully-lit path stays below the old flat 0.2 plateau and
    // a half-occluded one lands well below it, so shafts keep their contrast.
    const float RAYS_GAIN = 1.2;

    void main() {
      vec4 base = texture2D(tDiffuse, vUv);

      if (intensity <= 0.001) {
        gl_FragColor = base;
        return;
      }

      vec2 deltaTexCoord = (vUv - lightPosition) * (density / float(NUM_SAMPLES));
      vec2 coord = vUv;
      float illuminationDecay = 1.0;
      vec3 accumulated = vec3(0.0);

    #ifdef GOD_RAYS_LEGACY
      for (int i = 0; i < NUM_SAMPLES; i++) {
        coord -= deltaTexCoord;
        vec3 samp = texture2D(tDiffuse, coord).rgb;
        float lum = dot(samp, vec3(0.299, 0.587, 0.114));
        float bright = smoothstep(threshold, threshold + 0.2, lum);
        accumulated += samp * bright * illuminationDecay * weight;
        illuminationDecay *= decay;
      }

      // Near lightPosition (or with a sky-heavy frame from a ridge), many
      // samples hit the same bright, not-yet-tonemapped sky — the geometric
      // series can exceed ~3× before exposure. A high per-pixel cap (0.8)
      // still washed the whole frame white on mountains (issue 016); keep
      // shafts as a local glow, not a screen-wide lift.
      vec3 rays = min(accumulated * exposure * intensity, vec3(0.2));
    #else
      // Interleaved gradient noise: shift the first tap by [0,1) of a step so
      // neighbouring pixels sample between each other's taps (no banding).
      float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
      coord += deltaTexCoord * (1.0 - jitter);

      for (int i = 0; i < NUM_SAMPLES; i++) {
        coord -= deltaTexCoord;
        vec3 samp = texture2D(tDiffuse, coord).rgb;
        float lum = dot(samp, vec3(0.299, 0.587, 0.114));
        float bright = smoothstep(threshold, threshold + 0.2, lum);
        // HDR sun disc / Mie halo (lum >> 1) would otherwise dominate the sum
        // and flip neighbouring pixels between "hit the sun" and "missed it".
        accumulated += samp * (bright * illuminationDecay / max(lum, 1.0));
        illuminationDecay *= decay;
      }

      // Normalise by the decay series (0..~1 = lit fraction of the path).
      float decaySum = (1.0 - pow(decay, float(NUM_SAMPLES))) / max(1.0 - decay, 1e-4);
      vec3 x = accumulated * (exposure * intensity * RAYS_GAIN / decaySum);
      vec3 rays = RAYS_CAP * (vec3(1.0) - exp(-x / RAYS_CAP));
    #endif

      gl_FragColor = vec4(base.rgb + rays, base.a);
    }`,
}

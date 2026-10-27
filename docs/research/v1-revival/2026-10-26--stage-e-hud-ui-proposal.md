# Stage E — HUD UI proposal (`HudScreen` + toasts + gaze/placement chrome)

**Created at:** 2026-10-27  
**Created by:** Cursor (Composer)  
**Updated at:** 2026-10-27  
**Updated by:** Cursor (Composer)  
**Status:** **IMPLEMENTED — visual PASS** (author 2026-10-27) via `ui-input-043-stage-e-hud-v3-reskin`. Row ClockWeather + needs + carry panel (under bars); no CompassStrip; hint line removed.

**Target:** `jm-sky/seedvale-v1` (`legacy/seedvale`)  
**Design donor:** V3 `game/ui/hud/ClockWeather`, `NeedsReadout`, `ToastStack` presentation only — adapt to V1 producers; **no** CompassStrip; **no** InteractPrompt replacing FlavorDialog.

## Podsumowanie dla autora (PL)

Stage E przeprojektowuje **wygląd** HUD (zegar/pogoda/needs/toast, chip interakcji E/R/V, overlaye placement/busy) na look jak V3 ClockWeather / NeedsReadout / ToastStack + warm scoped tokeny A–D, przy zachowaniu V1 producentów i klawiszy. **Bez** CompassStrip (kompas = minimap `N`). Bez zmiany climate math / needs producers / save. Demo D9 na tych samych leafach.

**Zaakceptowane 2026-10-27** (autor): E-HUD (nie Trade); D5 = V3-like; D7 compass = **nie** (minimap only); placement = reskin obecnych overlayów; D4 muted readable chrome.

---

## Reading route and pins

- [UI migration research / decision register](./2026-10-26--ui-migration-research.md)  
- [Draft later slices §5](./2026-10-26--ui-migration-draft-stages.md#5-later-slices-and-release-gates)  
- Stage A–D: proposals + `ui-input-039`…`042` (visual PASS)

**Author decisions (do not re-ask):** D0/D1/D2/D3/D4/D5(A–D)/D6/D9; **D5 Stage E** = V3-like HUD chrome + warm tokens; **D7 HUD compass** = rejected (minimap N only); placement overlays = style-only reskin.

## 1. Layout (D5 + D7)

```
Desktop HUD (.sv-hud)
┌──────────────────────────────────────────────────────────┐
│ [top-left]                                               │
│  ClockWeather-like: HH:MM · faza · pogoda · °C           │
│  Needs: HP / stam / vigor / hunger / thirst (5 V1)       │
│  secondary: weight · condition · held · ammo · FPS       │
│                                                          │
│              [toasts — top-center]                       │
│                                                          │
│         [gaze FlavorDialog: target + E/R/V + hold]       │
│         [placement / terrain / mounted — bottom]         │
│  [minimap BL + N]                          [aim reticle] │
└──────────────────────────────────────────────────────────┘
```

No CompassStrip. No V3 InteractPrompt as owner. D6: E/R/V/hold/release/cycle, mounted/leading, aim geometry unchanged.

## 2. Boundary (unchanged wiring)

**Owned presentation:** `HudScreen.vue`, `ToastStack.vue`, gaze chip chrome in `FlavorDialog.vue`, placement/terrain/busy/time-skip/lodging overlays (style), optional thin leaves (`HudClockWeather` / `HudNeedsReadout`), scoped `.sv-hud` in `tailwind.css`.

**Thin weather HUD projection:** read-only `setHudWeather` from existing `climate.weather` (`WEATHER_LABELS`, temperature) — **no** `tickClimate` / save / climate math changes.

**Read-only:** `createHud`/`createToast` facades, store overlay owners, `Keyboard` E/R/V, `slotInputKey`, minimap/`drawMinimap`, aim math, TouchChrome behavior.

## 3. Unavailability (D4 adapted)

- Native `disabled` + no dispatch where controls exist.
- Dense chips: muted readable chrome (Stage C/D precedent), not literal `opacity-5`.
- Missing weather until first climate push: omit weather/°C spans (no fabricated labels).

## 4. D9 demo

Standalone Vite entry `hud-demo.html` + `src/ui-vue/demos/hud/`: shared presentation leaves; fixtures for clock+weather, critical needs, toast tones, gaze prompt (enabled + disabled reason), placement valid/invalid, busy progress; labeled demo-local callbacks; no world/save/WorldBundle.

## 5. Acceptance / verification

Preserve E/R/V/hold/cycle, mounted/leading, aim, minimap N, toast API, placement confirm/rotate/Esc. Focused type-check/lint + `pnpm build` if entries/styles. Author screenshots for visual PASS.

## 6. Out of scope

Dialogue, Character/inventory/QA/trade beyond token reuse, CompassStrip, InteractPrompt owner swap, climate/needs producer math, schema/save, map/menu redesign, A–D re-litigation.

## 7. Closure

**Accepted for implementation** 2026-10-27 by the author. **Visual PASS** 2026-10-27 (after layout iteration: row clock, carry under needs, rounded-md). Plan: `ui-input-043-stage-e-hud-v3-reskin` (closed).

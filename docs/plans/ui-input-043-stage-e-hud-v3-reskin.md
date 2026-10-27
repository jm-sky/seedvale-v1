# Plan: Stage E — HUD V3-like reskin (no compass)

**Created:** 2026-10-27  
**Status:** `done` ✅  
**Implemented at:** 2026-10-27  
**Closed:** 2026-10-27 — author visual PASS (row ClockWeather; needs; carry under bars; no compass; hint removed)  
**Type:** polish  
**Priority:** high · **Effort:** M  
**Depends on:** ~~ui-input-039~~ ~~ui-input-040~~ ~~ui-input-041~~ ~~ui-input-042~~  
**Domain:** `ui-input`  
**Subdomains:** `hud` `toast` `placement` `presentation`  
**Tags:** `v1-revival` `stage-e` `hud` `d5` `d7` `d4` `d9`

## Cel

Przeprojektować wygląd HUD (zegar/pogoda/needs/toast, gaze E/R/V, placement/busy overlays) na look jak V3 ClockWeather / NeedsReadout / ToastStack + warm scoped tokeny, **bez** CompassStrip, bez zmiany climate/needs producers / save / kluczy. Demo D9 na wspólnych leafach.

## Autorytet

- Zaakceptowana propozycja: [2026-10-26--stage-e-hud-ui-proposal.md](../research/v1-revival/2026-10-26--stage-e-hud-ui-proposal.md) (ACCEPTED 2026-10-27).
- Kontrakt: [draft-stages §5](../research/v1-revival/2026-10-26--ui-migration-draft-stages.md#5-later-slices-and-release-gates).
- Decyzje: D0/D4/D5(Stage E)/D6/D7(HUD compass rejected)/D9.

## Zakres

- `HudScreen.vue` (+ optional `HudClockWeather` / `HudNeedsReadout` leaves) — V3-like clock/weather/needs chrome; keep mounted/leading/aim.
- `ToastStack.vue` — V3-like toast rows.
- `FlavorDialog.vue` gaze chip (+ light modal surface polish) — keep `slotInputKey` / handlers.
- Style-only: Placement / Terrain / Busy / TimeSkip / Lodging overlays.
- Thin weather HUD projection: `setHudWeather` from existing climate (no producer/schema change).
- Scoped `.sv-hud` tokens in `tailwind.css`.
- Standalone demo `hud-demo.html` + fixtures.

## Poza zakresem

Dialogue, Character/inventory/QA/trade beyond token reuse, CompassStrip, InteractPrompt owner swap, climate math, save schema, map/menu redesign, A–D re-litigation.

## Guardrails

- V1 E/R/V/hold/release/cycle, mounted/leading, aim geometry, minimap N stay authoritative.
- No second overlay owner; `useOverlayScreen` only where already used.
- D4: muted readable chrome for dense disabled chips.
- No fabricated weather when climate not yet pushed.

## Verification

- `pnpm type-check`; focused lint; `pnpm build` if entry/styles.
- Browser (autor): time/phase/weather, needs, toast, gaze E/R/V + hold, placement rotate/confirm/Esc, mounted, aim, minimap N — visual PASS only after author screenshots.
- Demo: no world bootstrap; shared leaves; no save writes.

## Rollback

Revert Stage E presentation (+ thin weather HUD fields if added). Producers, keys, minimap, save intact.

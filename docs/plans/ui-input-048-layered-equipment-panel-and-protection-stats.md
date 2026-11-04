# Plan: Layered equipment panel and truthful protection stats

**Created:** 2026-11-04
**Status:** `verification needed` 🔍
**Type:** feature
**Priority:** high · **Effort:** M
**Depends on:** ui-input-045, items-player-066
**Domain:** `ui-input`
**Subdomains:** `inventory` `presentation` `equipment`
**Tags:** `v1-revival` `equipment` `armor` `layers` `ui` `side-initiative`
**Model:** Sonnet, Opus
**Roadmap:** -

Executor: GPT-6 Sol. Coordination: [side-initiative index](../research/v1-revival/2026-11-04--items-combat-side-initiative-index.md). Design authority: [Combat & Armor proposal §9](../research/v1-revival/2026-11-04--combat-armor-redesign-proposal.md#9-ui-feedback-and-appearance). Successor of the approved unlayered [ui-input-045](./ui-input-045-equipment-body-layout.md) — 045's grid and order are kept; this plan adds layers and replaces protection claims. Dependency on 066 means slice A.

## Scope

1. **Layer rows** — each armor cell of the 045 grid shows `Under` and `Outer` rows (item, quality, details, remove for that exact position); empty row: "—" or "No compatible items yet". Narrow/keyboard order: anatomy, under then outer. Shield stays disabled N/A; held weapon, primary melee/ranged, AmmoSection unchanged.
2. **Position-aware commands** — `EquipmentSlotView`/command payloads/highlight use `EquipmentPositionKey`; `loadoutPreview.targetSlot` becomes the target position.
3. **Item details** — local cut/pierce/blunt resistance with named coverage and layer ("35 % cut resistance — torso only"), quality-adjusted mass and restrictions. No unqualified "damage reduction".
4. **Loadout summary** — three expected-protection channels labelled "Reference"; optional UI-only profile switch Reference / Low bite / Large maul; expandable 7 × 3 table; melee/ranged stamina, recovery, movement, sprint; gear mass; carried weight separately. Block chance stays with the held weapon, never mixed into armor numbers.
5. **Preview** — exact-position replacement with both layers, displaced item, channel/restriction/mass deltas — computed by the same derivation as combat (065 protection snapshot builder); stale candidate → unavailable with reason.
6. **Hit feedback** — from the committed `HumanHitResult`: full/partial block vs armor-prevented vs HP lost; compact last-hit line for the player ("Legs · pierce · 10 HP lost · armor prevented 4"); no per-NPC toasts; debug ring of 32 events optional.
7. **Character screen and demos** — update `characterPresentation.ts` and the inventory/character-skills demo fixtures to position keys.

## Non-goals

Visual silhouettes/lines from V3, new item art, shield UI, durability, multi-region garments, Vue-side protection math.

## Verification

Vitest for presentation helpers (labels, ordering, expected-protection numbers equal 065/066 catalog fixtures), `equipmentLayout.test.ts` extended to positions, type-check (`vue-tsc`). Manual (release check, proposal §11.2 item 7): desktop + narrow + keyboard on inventory, character screen and `inventory-list` demo; no leftover global "armor %" claim anywhere; preview equals the stats after equipping.

Add JSDoc (`@domain ui-input`) to new presentation helpers.

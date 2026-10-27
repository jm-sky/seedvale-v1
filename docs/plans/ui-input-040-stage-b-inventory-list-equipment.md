# Plan: Stage B — Inventory list + equipment comparison V3 reskin

**Created:** 2026-10-26
**Status:** `done` ✅
**Closed:** 2026-10-26 — author visual PASS
**Type:** polish
**Priority:** high · **Effort:** M
**Depends on:** ~~ui-input-039~~
**Domain:** `ui-input`
**Subdomains:** `inventory` `presentation` `equipment`
**Tags:** `v1-revival` `stage-b` `inventory-list` `equipment` `d2` `d5`

> **Inventory revision — 2026-10-27:** Historical completion/visual PASS below is retained. For the subsequent inventory revision, the [D2(c)/D5 contract](../research/v1-revival/2026-10-27--inventory-hybrid-three-panel-contract.md) supersedes the old kind-list, desktop two-column/nested-modal and unchanged-details-navigation constraints. Use its [Cursor handoff](../research/v1-revival/2026-10-27--inventory-hybrid-cursor-handoff.md). New implementation and visual acceptance remain pending; do not reopen or relabel this completed historical plan.

## Cel

Dwukolumnowy list view (kind-list \| equipment + LoadoutSummary) z lookiem **identycznym z V3** `InventoryList` / `EquipmentPanel` / `LoadoutSummary`, przy V1 state/callbackach. Pure preview porównania; Stage A details bez zmiany kontraktu. Demo D9 list+equipment.

## Autorytet

- Zaakceptowana propozycja: [2026-10-26--stage-b-inventory-list-equipment-ui-proposal.md](../research/v1-revival/2026-10-26--stage-b-inventory-list-equipment-ui-proposal.md) (ACCEPTED 2026-10-26; D2=a; D5=V3-identical).
- Kontrakt: [draft-stages §3](../research/v1-revival/2026-10-26--ui-migration-draft-stages.md#3-stage-b--inventory-list-and-current-equipment-comparison).
- Decyzje: D0/D1/D2/D3/D4/D5(Stage B)/D6/D9.

## Zakres

- `InventoryScreen.vue` — list = two-column; details unchanged routing.
- Reskin `InventoryScreenItemList.vue` + new leaves: EquipmentPanel, LoadoutSummary, optional InventoryKindList chrome; reuse Stage A QualityTag/StatBar/tokens.
- Pure `previewEquipLoadout` + tests (non-mutation; empty/replace/worn/stale/quality).
- Scoped `.sv-inventory-stage-b` tokens in `tailwind.css`.
- Standalone demo Vite entry (list+equipment fixtures).

## Poza zakresem

Stage C, character/HUD/trade/map, dialogue, donor mutations/formulas, layered armor mechanics, schema/save, global reskin.

## Guardrails

- Kind-list; drop = kind/amount; held ≠ primary; six slots only.
- Preview never equips/removes; agrees with `resolveEquipmentModifiers` after real equip.
- D4: `disabled` + exactly `opacity-5` + reason; no fabricated resist/DPS/wear.
- Do not break Stage A details leaves/contracts.

## Verification

- `pnpm type-check`; focused lint; existing equipment/inventory/primary + new preview tests; `pnpm build` if entry/styles.
- Browser (autor): multi-quality; compare≠equip; equip then preview agrees; mass+size; I/Esc; screenshots vs V3 — visual PASS only after author verdict.
- Demo: no world bootstrap; shared leaves; no save writes.

## Rollback

Revert Stage B presentation commit; Stage A remains usable; no equipment schema change.

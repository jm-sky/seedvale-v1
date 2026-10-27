# Stage B — Inventory list + equipment comparison UI proposal

**Created at:** 2026-10-26  
**Created by:** Cursor (Composer)  
**Updated at:** 2026-10-26  
**Updated by:** Cursor (Composer)  
**Status:** **IMPLEMENTED — visual PASS** (author 2026-10-26). Accepted earlier same day (D2 = kind-list (a); two-column list|equipment; D5 = V3-identical look). Plan: `ui-input-040-stage-b-inventory-list-equipment`. Live list+equipment + D9 demo `inventory-list-demo.html` landed.

**Target:** `jm-sky/seedvale-v1` (`legacy/seedvale`)  
**Design donor:** `jm-sky/seedvale` (V3) `InventoryList` / `EquipmentPanel` / `LoadoutSummary` presentation only

> **Inventory supersession — 2026-10-27:** The author-selected [D2(c)/D5 contract](./2026-10-27--inventory-hybrid-three-panel-contract.md) replaces D2(a), desktop two-column inventory and nested desktop details with hybrid identity/group rows and `InventoryList | ItemDetailCard | EquipmentPanel`. It also defines explicit group-action identity limits and required D9 shared presentation. Historical Stage A/B visual PASS remains evidence for the versions accepted then; revised implementation and visual acceptance are pending. The contract governs this inventory revision wherever older wording below conflicts.


## Podsumowanie dla autora (PL)

Stage B przeprojektowuje **listę ekwipunku** i dodaje **panel założonego sprzętu + porównanie loadoutu** wizualnie **identycznie** jak V3, przy zachowaniu V1 kind-list, mass+size, sześciu slotów, HeldTool vs primaryMelee/primaryRanged oraz wszystkich akcji Stage A (details bez zmiany kontraktu). Preview jest czystym helperem — **nie** equips/removes. Warstwy/tarcza/typed resist/DPS = D4 placeholdery.

---

## Reading route and pins

- [UI migration research / decision register](./2026-10-26--ui-migration-research.md)  
- [Draft Stage B](./2026-10-26--ui-migration-draft-stages.md#3-stage-b--inventory-list-and-current-equipment-comparison)  
- Stage A: [proposal](./2026-10-26--stage-a-item-details-ui-proposal.md) · plan `ui-input-039`

**Author decisions (do not re-ask):** D0/D1/D3/D4/D6/D9; **D2 AUTHOR DECIDED (a)** kind-list; **D5 Stage B** = look identical to V3 list/equipment panels.

## 1. Navigation and layout (D2 accepted)

| Behavior | Fate |
| --- | --- |
| Kind row click → `details` + Stage A card | **Keep** — details is a **nested modal over** inventory (click-outside / Esc / Powrót closes details only; inventory stays open) |
| Esc details→list; list→close | **Keep** (D6) |
| List view chrome | Two-column: kind list \| equipment + LoadoutSummary; **fixed panel height** (`min(42rem, 100dvh−3rem)`) so category filters do not resize the shell |
| Drop | `onDrop(kind, amount)` only — no exact-instance drop |
| Preview candidate | Slot click and/or explicit **Porównaj** on armor rows; never mutates inventory |
| Instance-first donor list | **Rejected** (D2 a) |

## 2. Visual layout (D5 — V3-identical look)

```
┌─ Inventory list view (.sv-inventory-stage-b) ───────────────┐
│ Masa … · Rozmiar …                         [filtry · sort] │
├────────────────────────────┬────────────────────────────────┤
│ Kind rows (V1 groups)      │ Equipment (6 V1 slots)         │
│  look ≈ V3 InventoryList   │  + HeldTool                    │
│  klik → details            │  + primaryMelee / Ranged       │
│  [Porównaj] armor → preview│  layer/shield: D4 disabled     │
│                            │ LoadoutSummary (V1 scalars)    │
│                            │  current | preview Δ           │
└────────────────────────────┴────────────────────────────────┘
 details view: Stage A ItemDetailCard (unchanged contract)
```

### 2.1 Equipment panel (V1 slots)

- Slots: head / body / arms / hands / legs / feet (`EQUIPMENT_SLOT_LABEL`).
- HeldTool + heldInstanceId; unequip → `onUnequip()` only (never clears primaries).
- primaryMelee / primaryRanged readout (set/clear stays on list/details actions).
- Future under/outer layers + shield: labeled unavailable; controls `disabled` + exactly `opacity-5` + reason.
- Unequip armor → `onUnequipArmor(slot)`.

### 2.2 LoadoutSummary (V1 numbers)

Show: protection (damageReduction), attack stamina Δ, recovery Δ, movement Δ, sprint Δ, gear weight.  
Donor cut/pierce/blunt resist + DPS + price: **D4 labeled unavailable** placeholders (stable space).  
Preview = pure helper over unchanged slots/inventory; after real equip, numbers match `resolveEquipmentModifiers` + `equipmentModifiersToCharacterView`.

### 2.3 Adapter boundary

- Pure `previewEquipLoadout(...)` beside equipment ownership (no second Inventory).
- Presentation leaves under `src/ui-vue/components/items/` with V1 props.
- Reuse Stage A tokens (`.sv-item-detail` neutrals) via `.sv-inventory-stage-b` scope.
- **Forbidden:** donor `@/game/data` Inventory mutations, `previewEquip`, `inventoryLoadout`, quality formulas, command systems.

## 3. D9 demo

Standalone Vite entry: list + equipment + summary on shared leaves; fixtures (armor qualities, empty slots, held/primary); local callbacks; no world/save.

## 4. Acceptance / verification

Per draft-stages §3: discoverability, mass+size, Stage A actions, six slots, held≠primary, compare≠equip, preview agrees after equip, focused type-check/lint/preview tests, author screenshots for visual PASS.

## 5. Out of scope

Stage C, character tab, HUD, trade, map, dialogue, layered armor mechanics, schema/save, free repair, global reskin.

## 8. Closure

**Accepted for implementation** 2026-10-26 by the author. Active plan: `ui-input-040-stage-b-inventory-list-equipment`. Stage A/B visual PASS accepted by author 2026-10-26.

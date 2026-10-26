# Stage A — Item-details UI proposal (`InventoryScreenItemDetails`)

**Created at:** 2026-10-26  
**Created by:** Cursor (Composer)  
**Updated at:** 2026-10-26  
**Updated by:** Cursor (Composer)  
**Status:** **IMPLEMENTED — visual PASS** (author 2026-10-26). Accepted earlier same day (D5 = V3-identical look; §6 flags 2–6). Plan [`ui-input-039`](../../plans/ui-input-039-stage-a-item-details-v3-reskin.md). Live reskin + D9 demo `item-details-demo.html` landed.

**Target:** `jm-sky/seedvale-v1` (`legacy/seedvale`)  
**Design donor:** `jm-sky/seedvale` (V3) item-card presentation only

## Podsumowanie dla autora (PL)

Propozycja Stage A przeprojektowuje **tylko** ekran szczegółów przedmiotu (`InventoryScreenItemDetails`) wizualnie **identycznie** jak karta V3 (`ItemDetailCard`), **bez** zmiany nawigacji lista→szczegóły ani callbacków V1. Zachowane zostają wszystkie pola i akcje. Liczniki zużycia zbroi, DPS i donorowe „napraw” nie wchodzą do gry — niedostępne metryki jako podpisane placeholdery; niedostępne kontrolki: native `disabled` + dokładnie `opacity-5` + czytelny powód. Brak importu store’ów / mutacji / komend V3. **Zaakceptowane 2026-10-26** (D5 = look V3; flagi 2–6 = defaulty).

---

## Reading route and pins

Read first: [UI migration research / decision register](./2026-10-26--ui-migration-research.md), [compatibility matrix](./2026-10-26--ui-migration-compatibility-matrix.md), [draft Stage A](./2026-10-26--ui-migration-draft-stages.md#2-stage-a--one-real-item-details-slice). Broader context: [UI/equipment comparison](./2026-10-26--ui-equipment-v1-v3-comparison.md), [Strategic Brief](./STRATEGIC-BRIEF.md).

| Repo | Freshness note (2026-10-26) |
| --- | --- |
| V1 details UI | `InventoryScreenItemDetails.vue` last gameplay-relevant commit `bd2cb548` (throw wiring); `inventoryView.ts` `ab7ca232`. Contracts match the research matrix; no inventory-details behavior change required for this proposal. |
| V1 checkout HEAD | May advance for unrelated work (models/docs). **Recheck** affected files before any later implementation handoff. |
| V3 donor card | Layout reference: `ItemDetailCard.vue`, `InstanceMeters.vue`, `StatBar` / `QualityTag` / icon leaves, selected palette in `src/css/style.css`. Do not import `statRows` formulas, `performingItem`, sandbox repair/sharpen, or `@/game/data` Item types. |
| Staged assets | Optional illustrations/icons under [`docs/v3-donor/items/`](../../v3-donor/items/) — display metadata only. |

**Author decisions already recorded (do not re-ask):** D0 no V3 dialogue UI; D1 item details first; D3 current V1 equipment mechanics; D4 unavailable controls stay rendered (`disabled` + exactly `opacity-5`), missing metrics = labeled unavailable placeholders (never fabricated numbers).

**D5 (accepted 2026-10-26):** visual target = live V3 `ItemDetailCard` (+ leaves/tokens), not the ASCII wireframes in §3. Content/meta remain V1 per §6.

---

## 1. Verified V1 contracts (fields, actions, ownership)

Source of truth: `src/ui-vue/screens/InventoryScreenItemDetails.vue`, parent `InventoryScreen.vue`, `ui-vue/store.ts` `InventoryState`, `app/createApp.ts` inventory handlers, `app/inventoryWiring.ts`. Cross-checked against matrix rows for `ItemDetailCard` / `InstanceMeters` / inventory actions.

### 1.1 Props / events / navigation

| Direction | Name | Type / behavior | Stage A fate |
| --- | --- | --- | --- |
| Prop | `selectedItem` | `ItemKind \| null` | **Keep** |
| Emit | `return-to-list` | no payload; parent sets `currentView = 'list'` | **Keep** (header Powrót) |
| Parent | `select-item` | `[ItemKind]` → details | **Keep** (list unchanged in Stage A) |
| Escape | details → list (+ clear selection); list → `closeInventory` | **Keep** (D6) |
| Backdrop | always `closeInventory` | **Keep** |

No new gameplay Vue emits. All mutations remain `ui.inventory.on*`.

### 1.2 Callback ownership (unchanged)

```
InventoryScreenItemDetails
  → ui.inventory.on*(…)
createInventoryScreen.open / createApp inventoryScreenHandlers
  → inventoryWiring | survival.consumeItem | playerThrow | placementPreview
refreshInventoryScreen → inventoryScreen.refresh when open
```

| Store callback | Signature | Owner / notes |
| --- | --- | --- |
| `onDrop` | `(kind, amount)` | `inventoryWiring.dropItems` — kind/quantity, **not** exact selected-instance drop |
| `onEquip` / `onUnequip` | `(kind, instanceId?)` / `()` | held tool |
| `onEquipArmor` / `onUnequipArmor` | `(instanceId)` / `(slot?)` | armor slots |
| `onConsume` | `(kind)` | FIFO / kind consume |
| `onThrow` | `(kind)` | closes inventory; arms throw |
| `onRead` | `(kind)` | book or treasure map |
| `onPlaceTrap` | `(TrapKind)` | closes; placement preview |
| `onPlaceContainer` / `onPlaceTent` | `()` | closes; chest/tent preview |
| `onSellInstances` | `(instanceIds)` | when `ui.merchant.open` |
| `onSharpen` | `(instanceId)` | whetstone path; not donor free smith |
| `onSetPrimaryMelee` / `onSetPrimaryRanged` | `(kind, instanceId \| null)` | primaries |

### 1.3 Display fields by item family (must remain accessible)

| Family | Labels / meters (V1) |
| --- | --- |
| Always | Kategoria, Ilość, Waga, Wartość, description, category icon/illustration |
| Melee | Obrażenia, Zasięg, Szybkość ataku (cycle → szybki/średni/wolny); instance Stan + Ostrość when maintenance |
| Ranged | Obrażenia, Zasięg, Amunicja (kinds × live counts) |
| Armor | Slot, Jakość, Ochrona %, Wysiłek ataku, Tempo ataku, Ruch; Stan=Założona when equipped; **no** wear meter |
| Food | Efekt (+relief), Świeżość, optional Źródło |
| Liquid | meter `fill` → **Napełnienie**; consume Wypij / Pusty |
| Book | Umiejętność·tier, Wymagane, Twój poziom, Nauka do, Stan (read reason) |
| Trap/tent | meter `condition` → **Stan**; Zastaw / Rozstaw |
| Chest | Postaw; display-only Stan if present |
| Capabilities / primary shortcut | Zastosowania; Skrót podstawowej broni |

### 1.4 Actions that must remain reachable

**Per-instance (Lista):** Weź, Odłóż, Załóż, Zdejmij, Ustaw podstawową, Naostrz (disabled without whetstone + reason), Sprzedaj (only if merchant open).

**Bottom grid:** consume label (Zjedz/Wypij/Opatrz ± reason), Rzuć, Czytaj/Odczytaj, Zastaw, Postaw, Rozstaw, kind-level primary/Weź/Odłóż for non-maintenance tools, **Wyrzuć** (quantity dialog when count > 1).

---

## 2. Chosen visual layout (D5 — accepted: V3-identical look)

Reproduce V3 `ItemDetailCard` **look** (classes, warm surface tokens, illustration size, stats grid density, meter chrome) inside the existing in-panel details view. ASCII in §3 is a field/action map only. **Not** a new Reka/`ItemDetailsModal` owner. Overlay stack stays V1 `useOverlayScreen` / inventory open stack.

```
InventoryScreen (list | details) — navigation unchanged
  └── InventoryScreenItemDetails (reskin)
        └── V1 ItemDetailCard shell (presentation)
              ├── header + Powrót
              ├── illustration
              ├── description (+ lore placeholder if absent)
              ├── #controls  → V1 instance meters / quality
              ├── stats grid → V1 rows only (+ D4 unavailable slots)
              ├── Lista      → existing instance rows/actions
              └── #actions   → existing bottom actions
                    └── ui.inventory.on* (authoritative)
```

### 2.1 Regions (top → bottom)

1. **Header** — category/type icon + `itemDisplayName`; meta = V1 categories joined · `×N`. **Powrót** top-right. Do **not** present donor tier/availability as live facts.
2. **Illustration** — allow-listed PNG from `docs/v3-donor/items/illustrations` when a kind map exists; else current Lucide category icon. No fabricated item art.
3. **Description** — `ITEM_DEFS.description` (fallback as today). Lore: only if V1 already has equivalent text; otherwise reserved labeled unavailable placeholder (D4), not invented prose.
4. **`#controls`** — V1 meters from `inventoryView` (`Stan` / `Napełnienie` / `Ostrość` / `Jakość`). Armor **wear** = reserved unavailable placeholder; never treat sort-only 100 as durability. Fill is never durability.
5. **Stats grid** — same V1 fields as §1.3, restyled as donor-style `dl` (`grid-cols-2` / `sm:grid-cols-3`). Weapon **DPS** and donor cut/pierce/blunt = labeled unavailable placeholders in reserved slots. Real damage/range/speed/protection/restrictions stay authoritative.
6. **Lista** — current quality/condition buckets + per-id actions; visually tightened, not removed or relocated off-screen.
7. **Footer `#actions`** — existing bottom action grid. **Do not add** free sandbox Repair, QualityPicker, or a disabled free-repair button in Stage A (would invent a surface). D4 applies to metrics/controls in the selected card anatomy, not every donor demo affordance.

### 2.2 Tokens and primitives

- Scoped warm panel theme on a details root class (e.g. `.sv-item-detail`): copy selected `--surface` / `--surface-solid`, warm neutrals, meter tones (`good` / `bad` / `warn` / `edge`) from donor `style.css` into V1 `src/ui-vue/tailwind.css` aliases.
- Do **not** globally replace cool panel tokens for all screens in Stage A.
- Prefer existing `UiButton` / `UiPanel` for actions. Adapt StatBar / QualityTag / optional ItemTypeIcon as **V1-prop** leaves. No Reka; no second modal/hotkey stack.

### 2.3 Adapter boundary

Screen-local pure helper, e.g. `buildItemDetailPresentation(kind, group, inventorySnapshot)` under `src/ui-vue/` (or beside the screen), producing:

- header/meta/description/illustration key  
- meter descriptors (`meterKind`, percents, qualityLabel, unavailable placeholders)  
- ordered stat rows (label, value, optional tone; `unavailable: true` for D4 slots)  
- no donor `Item` / `ItemInstance` construction  

**Forbidden imports:** `@/game/data`, donor `statRows.ts`, `performingItem`, `repairItem` / `sharpenItem`, donor Inventory model, SceneSession / useSettings / craft hosts.

Gameplay remains: open-time snapshot from `refreshInventoryScreen` + existing callbacks.

---

## 3. Annotated wireframes (structure only — not visual acceptance)

These ASCII diagrams map **which V1 fields/actions land where**. They are **not** the D5 look target; the look target is the live V3 card. Callouts: **V1** = preserved field/action; **D4** = labeled unavailable / disabled+`opacity-5`.

### 3.1 Weapon (maintenance — e.g. topór / axe)

```
┌─ .sv-item-detail ────────────────────────────────── [Powrót] ─┐
│ [type icon] Topór                                         V1 │
│ narzędzie · broń · ×1                                     V1 │
│                                                              │
│            [ illustration PNG or Lucide ]                 V1 │
│                                                              │
│ Opis z ITEM_DEFS…                                         V1 │
│ Lore — niedostępne —                                      D4 │
│                                                              │
│ ── meters (#controls) ───────────────────────────────────── │
│ Stan       [████████░░] 72%                               V1 │
│ Ostrość    [█████░░░░░] 55%                               V1 │
│ Zużycie zbroi  — niedostępne —                            D4 │
│                                                              │
│ ── stats ────────────────────────────────────────────────── │
│ Obrażenia 12 │ Zasięg 1.2 m │ Szybkość ataku średni       V1 │
│ DPS — niedostępne —                                       D4 │
│ Kategoria · Ilość · Waga · Wartość · Zastosowania         V1 │
│                                                              │
│ ── Lista ────────────────────────────────────────────────── │
│ #1  Stan 72% · Ostrość 55%                                   │
│     [Weź] [Ustaw podstawową] [Naostrz] [Sprzedaj?]        V1 │
│     Naostrz: disabled+opacity-5 + „Brak osełki” if 0      V1 │
│                                                              │
│ ── actions ──────────────────────────────────────────────── │
│ [Wyrzuć]                                                  V1 │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Armor (e.g. leather_armor)

```
┌─ .sv-item-detail ────────────────────────────────── [Powrót] ─┐
│ [icon] Skórzany pancerz · pancerz · ×1                    V1 │
│ [ illustration / Lucide ]                                     │
│ Opis…                                                     V1 │
│                                                              │
│ Jakość  [zwykła]  QualityTag                              V1 │
│ Zużycie (wear)  — niedostępne —   never show 100% wear    D4 │
│                                                              │
│ Slot ciało │ Ochrona 18%                                  V1 │
│ Wysiłek ataku │ Tempo ataku │ Ruch   (V1 penalties)       V1 │
│ cut/pierce/blunt  — niedostępne —                         D4 │
│ Stan: Założona (when equipped)                            V1 │
│                                                              │
│ Lista #id  [Załóż] / [Zdejmij]  [Sprzedaj?]               V1 │
│ [Wyrzuć]                                                  V1 │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 Food (batch)

```
┌─ .sv-item-detail ────────────────────────────────── [Powrót] ─┐
│ [icon] Mięso · pożywienie · ×3                            V1 │
│ [ illustration / Lucide ]                                     │
│ Opis…                                                     V1 │
│                                                              │
│ (no Stan/fill chrome — omit empty meter rows)                │
│ Efekt +N głodu │ Świeżość … │ Źródło … (if any)           V1 │
│                                                              │
│ [Zjedz]  or  disabled+opacity-5 + reason „Zepsute”        V1 │
│ [Wyrzuć]                                                  V1 │
└──────────────────────────────────────────────────────────────┘
```

### 3.4 Liquid container (waterskin)

```
┌─ .sv-item-detail ────────────────────────────────── [Powrót] ─┐
│ [icon] Bukłak · … · ×1                                    V1 │
│ [ illustration / Lucide ]                                     │
│ Opis…                                                     V1 │
│                                                              │
│ Napełnienie [██████░░░░] 60%   ← fill, not durability     V1 │
│ Efekt +N pragnienia (when applicable)                     V1 │
│                                                              │
│ [Wypij]  or  disabled+opacity-5 + „Pusty”                 V1 │
│ [Wyrzuć]                                                  V1 │
└──────────────────────────────────────────────────────────────┘
```

### 3.5 Other kinds (same owners; layout regions only)

| Kind | Stats / meters | Footer / lista actions |
| --- | --- | --- |
| Book | skill/tier/required/current/target/Stan | Czytaj ± reason |
| Treasure map | description | Odczytaj |
| Trap | Stan % | Zastaw; instance actions if any |
| Chest / tent | display meters if present | Postaw / Rozstaw |
| Throwable | as catalog | Rzuć |
| Non-maintenance tool | kind-level Weź/Odłóż/primary | bottom grid |

---

## 4. Field and action accessibility map

Every current V1 detail label/control maps to a card region. **Nothing removed.**

| V1 field / control | New region | Notes |
| --- | --- | --- |
| Title / Powrót | Header | Same emit |
| Category icon / image | Illustration | Donor PNG optional |
| Description | Body | |
| Kategoria, Ilość | Header meta and/or stats | `×N` in meta |
| Waga, Wartość | Stats | |
| Melee/ranged combat stats | Stats | No DPS number |
| Consumable Efekt / freshness / species | Stats | |
| Book rows | Stats | |
| Capabilities / Skrót primary | Stats | |
| Armor slot/quality/protection/penalties / Założona | Controls + stats | Wear = D4 placeholder |
| Instance Stan / Ostrość / Napełnienie | Controls + Lista | Correct meterKind |
| Per-instance Weź/Odłóż/Załóż/Zdejmij/primary/Naostrz/Sprzedaj | Lista | Same store callbacks |
| Consume / Rzuć / Czytaj / place* / kind equip / Wyrzuć | Footer `#actions` | Same enable rules |
| Drop quantity dialog | Existing overlay | Unchanged |
| Free Repair / QualityPicker / donor DPS value | — | **Not added** as operational; DPS/wear as D4 placeholders only |

---

## 5. Implementation specification (for later handoff — not authorized)

### 5.1 Files

| Path | Role |
| --- | --- |
| `src/ui-vue/screens/InventoryScreenItemDetails.vue` | Primary owner — reskin composition |
| `src/ui-vue/components/items/ItemDetailCard.vue` (new) | Presentational shell; V1 view props + `#controls` / `#actions` slots; no donor Item |
| `src/ui-vue/components/items/ItemInstanceMeters.vue` (new) | V1 `meterKind` / percents / quality; D4 placeholders |
| `src/ui-vue/components/items/StatBar.vue`, `QualityTag.vue` (new, optional) | Visual leaves; V1 labels/enums |
| `src/ui-vue/…/buildItemDetailPresentation.ts` (new) | Pure adapter; unit-tested |
| `src/ui-vue/tailwind.css` | Scoped `.sv-item-detail` aliases only |
| `InventoryScreenSection.vue` / `ItemsScreenItemButton.vue` | Class-only if needed; **preserve public contracts** |

**Do not change:** `createApp.ts` handler signatures, `inventoryWiring.ts` formulas, `Inventory.ts`, `equipment.ts`, save schema, item catalog definitions (except optional later illustration key map that does not invent kinds).

### 5.2 Props / events after reskin

| Component | Contract |
| --- | --- |
| `InventoryScreenItemDetails` | Unchanged: `selectedItem`, `return-to-list` |
| `ItemDetailCard` (V1) | e.g. `title`, `meta`, `description`, `loreState`, `illustrationSrc \| null`, `statRows[]`, slots `controls` / `actions`; optional `solid` presentation flag |
| `ItemInstanceMeters` | V1 rows: `meterKind`, `conditionPercent`, `sharpnessPercent \| null`, `qualityLabel \| null`, `showArmorWearPlaceholder: true` for armor, never donor durability math |
| Actions | Continue calling `ui.inventory.on*`; guard disabled paths so no dispatch |

### 5.3 Unavailable states (D4)

| Case | UI |
| --- | --- |
| Missing metric (armor wear, DPS, lore, resist triad) | Fixed-space labeled „niedostępne” (or equivalent Polish); **no** `0` / `100` / empty green bar as fake value |
| Existing disabled actions (Zepsute, Pusty, Brak osełki, book reasons) | Keep reasons; apply native `disabled` + exactly `opacity-5`; reason text outside dimmed control |
| Unsupported donor controls (free repair, quality edit) | **Omitted** from Stage A layout (not invented disabled buttons) |

### 5.4 Focused acceptance (when implementation is approved)

**Automated:** `pnpm type-check`; focused lint on touched Vue/TS; existing inventoryView / itemUse / equipment / weaponMaintenance tests; **new** adapter tests: trap `Stan` vs liquid `Napełnienie` vs weapon sharpness vs armor-without-wear vs missing ≠ real zero.

**Browser:** I → food, liquid, weapon, armor, book, packed utility; list→details→Powrót/Esc; one real consume/equip/sharpen/drop/read with world/HUD effect (not toast-only); 1366×768 and narrow viewport; long Polish labels; save/reload/reopen fresh state; screenshots: current V1, adapted V1, reference V3 card. Opening/selecting/closing details must not mutate inventory.

**Rollback:** revert presentation commit only; handlers untouched so items cannot be lost.

---

## 6. Author flags (accepted 2026-10-26)

| # | Question | Decision |
| --- | --- | --- |
| 1 | **D5 look** | **Identical to V3 `ItemDetailCard`** (not ASCII §3). Author: look must match V3. |
| 2 | Header meta = V1 categories · `×N` only; donor tier/availability not live facts; lore/material as D4 placeholders when absent? | **Yes** |
| 3 | Reserve DPS + armor-wear labeled placeholders vs omit? | **Reserve** placeholders |
| 4 | No free Repair / QualityPicker in Stage A? | **Omit** |
| 5 | Navigation unchanged; two-column deferred to Stage B / D2? | **No nav change** |
| 6 | Optional staged `v3-donor` illustrations when mapped? | **Yes** |

---

## 7. Out of scope

- UI code / commits implementing this proposal until approved  
- Stage B inventory list / equipment comparison  
- V3 Player–NPC dialogue (D0)  
- Donor stores, inventory mutations, demo repair/sharpen, command systems  
- General crafting UI, layered armor mechanics, save/schema/gameplay balance  
- Global palette reskin of all V1 screens  

---

## 8. Closure

**Accepted for implementation** 2026-10-26 by the author (D5 = V3-identical look; §6 flags 2–6 as defaults). Active plan: `ui-input-039-stage-a-item-details-v3-reskin`. Visual acceptance of the built screen remains a separate author screenshot gate.

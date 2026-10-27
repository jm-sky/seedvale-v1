# Plan: Equipment panel body-ordered layout (V3 items--006 adapted)

**Created:** 2026-10-27
**Status:** `planned` 📋
**Type:** polish
**Priority:** medium · **Effort:** S
**Depends on:** ~~ui-input-040~~
**Domain:** `ui-input`
**Subdomains:** `inventory` `presentation` `equipment`
**Tags:** `v1-revival` `equipment` `layout` `items-006`
**Roadmap:** -

## Cel

Ułożyć sekcję „Założone” w ekwipunku tak, by czytać się jak ciało: głowa u góry, stopy na dole — według Option C z V3 [items--006](../../../docs/plans/items--006--equipment-body-layout.md), dopasowanej do **obecnego** modelu V1 (bez warstw under/outer, bez zmiany save/slotów).

## Decyzja (locked)

Autor wybrał wariant 2 (2026-10-27): siatka anatomiczna jak w items--006, z placeholderem Forearms; bez migracji modelu.

```
            [ Głowa / head ]
[ Ramiona ] [ Tułów / body ] [ W ręce ]
[ Przedr.] [ Nogi          ] [ Tarcza N/A ]
[ Dłonie  ] [ Stopy        ]
```

- **Realne sloty:** `head`, `body` (komórka torso), `arms` (komórka shoulders / Ramiona), `hands`, `legs`, `feet`
- **`forearms`:** tylko UI — dashed / `—`, bez select/unequip, bez klucza w `EquipmentSlot` / save
- **Prawa kolumna:** held → komórka weapon; shield = N/A jak dziś
- **Bez** warstw under/outer, **bez** rozdziału `arms` → shoulders+forearms (to [items-player-044](./items-player-044-shoulder-and-forearm-equipment-slots.md)), **bez** lustrzanych L/R
- **Podst. wręcz / dystans + AmmoSection + LoadoutSummary** zostają **pod** siatką
- Narrow (`< sm`): jedna kolumna w kolejności ciała: head → arms → body → forearms(placeholder) → hands → legs → feet → held → shield

Główna praca: [`EquipmentPanel.vue`](../../src/ui-vue/components/items/EquipmentPanel.vue). [`InventoryScreen.vue`](../../src/ui-vue/screens/InventoryScreen.vue) tylko podaje highlight z istniejącego `loadoutPreview.targetSlot`. Demo list+equipment dostaje layout za darmo.

## Pliki

| Action | Path |
|--------|------|
| Add | `src/ui-vue/components/items/equipmentLayout.ts` |
| Add | `src/ui-vue/components/items/equipmentLayout.test.ts` |
| Add | `src/ui-vue/components/items/EquipmentSlotCell.vue` |
| Edit | `src/ui-vue/components/items/EquipmentPanel.vue` |
| Edit | `src/ui-vue/screens/InventoryScreen.vue` — `:highlight-slot="loadoutPreview.targetSlot"` |
| Edit | `src/ui-vue/demos/inventory-list/DemoApp.vue` — ten sam prop jeśli trywialne |

Poza zakresem: gameplay / model / save, CharacterScreen, linie łączące z mockupu, sylwetka, split shoulders/forearms (044).

## Kroki

### 1. `EQUIPMENT_LAYOUT`

```ts
type EquipmentCellKey =
  | EquipmentSlot          // head|body|arms|hands|legs|feet
  | 'forearms'             // UI placeholder only
  | 'held'
  | 'shield'

type EquipmentLayoutCell = { key: EquipmentCellKey; area: string; label: string }
```

Kolejność tablicy = kolejność DOM / tab / wąska kolumna. Obszary desktop (`sm+`): `head`, `arms`→`shoulders`, `body`→`torso`, `forearms`, `hands`, `legs`, `feet`, `held`→`weapon`, `shield`.

Test: każdy wpis `EQUIPMENT_SLOTS` + `held` + `shield` + `forearms` dokładnie raz.

### 2. `EquipmentSlotCell.vue`

Props: widok komórki / held / shield, `highlighted`, flaga placeholder. Emit: `select`, `unequip` (armor) / held unequip.

- Armor: label + truncate + `✕`; puste → `—`
- Forearms placeholder: „Przedramiona”, `—`, non-interactive, muted
- Held: obecne „W ręce”
- Shield: „Tarcza” / `N/A`
- Highlight: pierścień `--primary` / `outline-primary`
- Długie nazwy: `truncate` + `title`

### 3. Siatka w `EquipmentPanel`

Zastąpić flat `grid-cols-2 sm:grid-cols-3` przez `grid-template-areas` (desktop Option C; wąsko jedna kolumna). `v-for` po `EQUIPMENT_LAYOUT`. Poniżej: primary melee/ranged, AmmoSection, LoadoutSummary — bez zmiany semantyki.

### 4. Preview highlight

`InventoryScreen` już ma `loadoutPreview.targetSlot`. Przekazać do panelu; podświetlić komórkę o matching `EquipmentSlot`. Held / shield / forearms nigdy z podglądu pancerza. Demo: null albo fixture, jeśli proste.

### 5. Weryfikacja

- Vitest: `equipmentLayout.test.ts`
- Type-check / istniejące testy inventory UI montujące EquipmentPanel
- Manualnie: desktop head→feet; wąska kolejność; select armor → ring; forearms nieklikalne; select/unequip na realnych slotach i held bez regresji

## Explicit non-goals

- Linie under/outer z V3
- Rename `arms` / dodanie `forearms` do `EquipmentSlot`
- Zmiana macierzy akcji Inventory / three-panel shell
- Pipeline look-review shots z V3 plan (smak autora z live UI)

## Rollback

Usunąć nowe pliki layout/cell; przywrócić flat grid w `EquipmentPanel`; usunąć prop highlight z ekranu/demo.

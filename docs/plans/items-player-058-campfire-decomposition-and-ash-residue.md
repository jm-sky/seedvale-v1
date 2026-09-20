# Plan: Campfire decomposition and ash residue

**Created:** 2026-09-20
**Status:** `planned` 📋
**Priority:** medium · **Effort:** M
**Depends on:** none
**Domain:** `items-player`
**Subdomains:** `items` `tools` `interaction`
**Tags:** `campfire` `inspection` `world-residue`
**Type:** `feature`
**Roadmap:** -
**Model:** Sonnet, Composer

## Cel

Dodać spójny lifecycle usuwania ognisk zbudowanych przez gracza:

- zwykłe ognisko (`simple`) można usunąć; jeżeli było używane, po usunięciu pozostaje ślad popiołu przez około **1 dzień świata**;
- kamienne palenisko (`pit`) można rozebrać i odzyskać kamienie; jeżeli było używane, również zostawia popiół;
- zimne, nigdy nieużywane `pit` nie tworzy popiołu;
- akcja jest dostępna z World Inspection;
- narzędzie trzymane w ręce z capability `soil_digging` daje bezpośredni skrót do tej samej operacji bez otwierania Inspection;
- lifecycle i expiry nie zależą od kamery ani obecności gracza.

Nie tworzyć osobnego systemu demontażu dla skrótu narzędzia.

## Aktualny stan

`src/settlement/PlacedFires.ts` jest właścicielem player-placed fires. `PlacedFireKind` ma obecnie `simple | pit | pile`, a zapis zachowuje pozycję, kind i grate, ale nie stan ognia.

Aktualnie:

- `PlacedFires` nie udostępnia publicznego `remove(id)`;
- `campfire` `Interactable` przekazuje `VillageFire`, ale nie stabilne `PlacedFire.id` / `PlacedFireKind`;
- `inspectionTargetRef()` nie obsługuje campfire;
- World Inspection nie posiada typu `placedFire`;
- `[R]` przy campfire jest już używane do cooking;
- wyposażone narzędzie jest dostępne przez `HeldTool`;
- `soil_digging` jest istniejącą capability i obecnie posiada ją łopata;
- `grantItem()` jest istniejącą ścieżką przyznawania itemów z overflow do świata;
- terrain `scorch` jest trwałą modyfikacją chunków i nie nadaje się jako jednodniowy ślad popiołu.

## 1. Persistowane `hasBurned`

Rozszerzyć persisted `PlacedFire` o:

```ts
hasBurned: boolean
```

Semantyka:

- `simple` ustawiane na `true` w momencie utworzenia, ponieważ startuje zapalone;
- `pit` i `pile` startują z `false`;
- gdy fire pierwszy raz zostanie rzeczywiście zapalony, wartość zmienia się na `true`;
- wartość przeżywa save/load oraz WorldBundle rebuild.

Nie używać runtime-only `everLit` jako źródła prawdy dla decyzji o residue po reloadzie.

Migracja wcześniejszych zapisów ustawia `hasBurned` konserwatywnie tak, aby nie tworzyć fałszywego popiołu z nigdy nieużywanego `pit`; istniejące `simple` można traktować jako używane.

## 2. Tożsamość player-placed campfire w interaction

Rozszerzyć campfire variant w `src/interaction/Interactable.ts` tak, aby target rozróżniał:

- player-placed fire wraz ze stabilnym `id` i `PlacedFireKind`;
- settlement campfire.

Preferować jawny metadata contract zamiast niezależnych optional fields, np. semantycznie:

```ts
source:
  | { kind: 'placed', id: string, fireKind: PlacedFireKind }
  | { kind: 'settlement' }
```

`src/app/interactables.ts` ma wypełniać ten kontrakt.

Habitat-burn fires nie mogą stać się demontowalnymi player fires.

`interactableStableKey()` dla player-placed fire powinien używać stabilnego `id`, a nie współrzędnych.

## 3. Jedna authoritative operacja usunięcia

Rozszerzyć `PlacedFires` o bezpieczne:

```ts
remove(id)
```

Collection owner odpowiada za:

- znalezienie wpisu;
- unregister z `PointLightBudget`;
- usunięcie runtime mesh;
- `disposeObject3D`;
- usunięcie rekordu z collection.

Operacja nie przyznaje materiałów i nie obsługuje UI.

Istniejący automatyczny despawn ma używać tego samego wewnętrznego cleanup path.

## 4. Wspólny gameplay commit

Dodać jedną application-layer operację dla demontażu player fire. Powinna być wywoływana zarówno przez Inspection, jak i shortcut.

Flow:

```text
resolve id fresh
→ validate player-placed + supported kind
→ validate grate rule
→ capture live salvage/residue facts
→ extinguish/remove atomically
→ grant salvage
→ create residue when hasBurned
→ sync inventory/UI
```

Repeated lub stale call ma być bezpiecznym no-op.

### `simple`

Akcja: **Usuń ognisko**

- brak odzysku spalonych gałęzi;
- residue tylko gdy `hasBurned === true`.

### `pit`

Akcja: **Rozbierz palenisko**

- odzysk dokładnie `FIRE_PIT_STONE_COST`;
- residue tylko gdy `hasBurned === true`.

Nie kopiować wartości liczbowej kosztu.

### Grate

V1 nie rozszerza salvage rusztu.

Jeżeli `grate === true`, demontaż paleniska jest zablokowany z czytelnym powodem: najpierw należy zdemontować/obsłużyć ruszt w przyszłym osobnym lifecycle.

Nie kasować wartościowego upgrade bez informacji i nie dodawać w tym planie nowego systemu demontażu grate.

### `pile`

Poza zakresem. Nie podpinać mechanicznie pod reguły `simple` / `pit`.

## 5. Demontaż płonącego ogniska

Demontaż nie wymaga osobnej akcji „zgaś”.

Jeżeli fire jest zapalone, wspólny commit usuwa je w jednym przebiegu. Cleanup nie może pozostawić audio/light/mesh po usunięciu.

## 6. Ash residue

Nie implementować popiołu jako `TerrainModification.mode = 'scorch'`.

Dodać lekki rekord, np.:

```ts
type FireResidue = {
  id: string
  x: number
  z: number
  createdAtDay: number
  expiresAtDay: number
}
```

Lifetime:

```text
expiresAtDay = createdAtDay + 1
```

Używać `dayNight.elapsedDays`, nie realnego czasu ani `setTimeout`.

## 7. Ownership i expiry residue

Preferowany owner: mały world-owned `FireResidues` w `WorldBundle`.

API powinno pozostać wąskie:

```ts
add(...)
nodes()
reconcile(nowDays)
dispose()
```

Nie sprawdzać expiry co frame, jeśli nie jest to konieczne. Użyć cached `nextExpiryDay` lub wywołań przy naturalnych punktach synchronizacji, np. utworzenie, load/rebuild, time-skip i rzadki world-time reconciliation.

Authoritative lifecycle nie może istnieć wyłącznie w Three.js mesh.

## 8. Rendering residue

Wykorzystać jako wzorzec `src/terrain/bloodOverlay.ts`.

Preferować:

- batched/instanced representation;
- brak `Mesh + Material` per residue;
- prostą nieregularną plamę popiołu/węgla;
- ground height przez istniejący sampler;
- brak collidera i brak `Interactable`.

Nie wymaga nowego GLB.

## 9. Persistence

Fire residue oraz `PlacedFire.hasBurned` zmieniają persisted representation.

- rozszerzyć `SaveData`;
- bump `CURRENT_SAVE_VERSION`;
- dodać jeden standardowy migration step;
- starsze save dostają `fireResidues: []`;
- wcześniejsze `PlacedFire` dostają poprawnie znormalizowane `hasBurned`;
- save zapisuje tylko aktywne residue;
- load/rebuild odtwarza rekordy, po czym `reconcile(elapsedDays)` usuwa expired.

Nie persistować mesh ani derived presentation.

## 10. World Inspection

Rozszerzyć:

- `InspectionTargetKind` o `placedFire`;
- `inspectionTargetRef()`;
- `WorldInspectionLookup`;
- `buildWorldInspection()`;
- `createInspectionActions()`.

Inspection jest dostępne tylko dla player-placed `simple` / `pit`.

Settlement campfire nie dostaje opcji demontażu.

### Simple

```text
Zwykłe ognisko
Stan: pali się / wygaszone

[Usuń ognisko]
```

### Pit

```text
Kamienne palenisko
Stan: pali się / wygaszone
Ruszt: tak / nie

[Rozbierz palenisko]
```

Destructive action używa istniejącego `variant: 'danger'` i istniejącego confirmation flow.

Dla `pit` preview pokazuje odzysk kamieni. Gdy grate istnieje, action jest disabled z powodem.

Commit po potwierdzeniu ponownie re-resolvu­je fire po `id`.

## 11. Shortcut narzędzia do kopania

Nie sprawdzać `heldTool.held() === 'shovel'`.

Użyć:

```ts
hasItemCapability(heldTool.held(), 'soil_digging')
```

Dla player-placed `simple` / `pit`:

- z held `soil_digging`: alternate slot `[R]` = dismantle/remove;
- bez niego: `[R]` zachowuje obecne campfire semantics, w tym cooking;
- gdy grate blokuje dismantle, prompt pokazuje disabled/reason zamiast wykonywać cooking jako fallback.

To jest contextual override istniejącego alternate slot, nie nowy input handler.

Shortcut nie otwiera confirmation dialogu; jawny prompt `[R] Usuń/Rozbierz` przy wyposażonym narzędziu jest szybkim wejściem do tego samego commit path.

Settlement campfires nie dostają tego override.

## 12. WorldBundle lifecycle

Residue owner:

- tworzony w `WorldBundle`;
- odtwarzany z save records;
- runtime representation czyszczona w `dispose()`;
- ordinary same-world rebuild nie może duplikować residue;
- expiry opiera się na absolute world days.

Nie wiązać expiry z kamerą ani streamed chunk lifecycle.

## 13. Główne pliki

Zweryfikowane punkty integracji:

- `src/settlement/PlacedFires.ts`
- `src/interaction/Interactable.ts`
- `src/app/interactables.ts`
- `src/interaction/interactionView.ts`
- `src/app/gameLoop.ts`
- `src/app/userActions.ts` lub wąski action module przy obecnym player-action seam
- `src/app/inspection/inspectionTarget.ts`
- `src/app/inspection/worldInspectionView.ts`
- `src/app/inspection/buildWorldInspection.ts`
- `src/app/actions/inspectionActions.ts`
- `src/app/worldBundle.ts`
- `src/app/createApp.ts`
- `src/app/saveState.ts`
- `src/persistence/saveData.ts`

Prawdopodobne nowe wąskie moduły:

- `src/world/fireResidues.ts`
- `src/terrain/fireResidueOverlay.ts`

Nie robić przy okazji ogólnego refaktoru interaction/campfire.

## 14. Testy

### Fire lifecycle

1. `remove(id)` usuwa dokładnie właściwy fire.
2. Powtórne `remove(id)` jest no-op.
3. Cleanup usuwa mesh/light registration.
4. Usunięty fire nie trafia do save.
5. `hasBurned` przeżywa save/load.
6. Nigdy nieużywany `pit` pozostaje `hasBurned=false` po reloadzie.

### Salvage

7. `simple` nie zwraca gałęzi.
8. `pit` zwraca dokładnie `FIRE_PIT_STONE_COST`.
9. Overflow idzie istniejącą ścieżką `grantItem`.
10. Powtórna akcja nie duplikuje salvage.
11. `pit + grate` blokuje dismantle.

### Residue

12. Used fire tworzy dokładnie jeden residue.
13. Cold never-used `pit` nie tworzy residue.
14. Residue istnieje przed `expiresAtDay`.
15. Znika po expiry.
16. Time skip przekraczający expiry usuwa residue.
17. Save/load przed expiry zachowuje residue.
18. Save/load po expiry nie odtwarza aktywnego residue.

### Inspection / shortcut

19. Player `simple` i `pit` mają inspection.
20. Settlement campfire nie ma dismantle inspection.
21. Inspection używa danger confirmation.
22. Stale inspection po usunięciu zamyka się/no-op bez duplikacji.
23. Bez `soil_digging` `[R]` zachowuje cooking.
24. Z `soil_digging` `[R]` pokazuje dismantle.
25. Shortcut i Inspection trafiają do jednego commit path.
26. Settlement campfire nigdy nie dostaje shortcutu.

## 15. Manual verification

Do wykonania przez użytkownika w przeglądarce:

1. Postaw i usuń zwykłe ognisko przez Inspection.
2. Potwierdź ash residue.
3. Postaw zimne palenisko i rozbierz — odzysk kamieni, bez popiołu.
4. Postaw, zapal i rozbierz palenisko — odzysk kamieni + popiół.
5. Zbuduj grate i potwierdź blokadę dismantle.
6. Weź łopatę, sprawdź `[R]` shortcut i wykonaj demontaż bez Inspection.
7. Schowaj łopatę i potwierdź powrót `[R]` cooking.
8. Settlement campfire — brak dismantle.
9. Save/load z używanym fire i z aktywnym residue.
10. Przesuń czas o >1 dzień i potwierdź zniknięcie residue.

AI nie wykonuje browser verification.

## Non-goals

- demontaż settlement campfires;
- decomposition `pile`;
- generic dismantling framework dla wszystkich obiektów;
- demontaż/salvage grate;
- general tool durability;
- popiół jako inventory item;
- wpływ popiołu na glebę/roślinność;
- zmiana terrain `scorch`;
- nowe animacje;
- refaktor cooking system.

## Definition of Done

- `simple` i `pit` mają poprawny demontaż przez Inspection;
- `pit` odzyskuje kamienie;
- `hasBurned` rozróżnia zimne palenisko od używanego także po reloadzie;
- używane fire zostawia jednodniowy residue, zimne `pit` nie;
- residue zachowuje poprawny lifecycle przez save/load, rebuild i time skip;
- held `soil_digging` daje szybki `[R]` shortcut;
- bez niego obecne campfire/cooking `[R]` działa bez regresji;
- oba wejścia korzystają z jednego authoritative commit path;
- grate blokuje demontaż zamiast cicho znikać;
- settlement fires i `pile` są nietknięte;
- brak kosztownego per-frame skanowania i mesh-per-residue.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

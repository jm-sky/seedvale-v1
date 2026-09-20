# Plan: Settlement tool ownership and social acquisition

**Created:** 2026-09-20
**Status:** `planned` 📋
**Type:** feature
**Priority:** medium · **Effort:** M
**Depends on:** none
**Domain:** `items-player`
**Subdomains:** `items` `interaction`
**Tags:** `quests` `dialogue` `reputation` `settlements`

## Cel

Zastąpić obecne darmowe village-tool pickups spójnym modelem:

- narzędzia istnieją fizycznie w osadzie od początku;
- są własnością mieszkańców/osady;
- gracz może dostać je przez dialog, lokalną reputację albo prosty quest;
- każde źródłowe narzędzie istnieje dokładnie raz w świecie/save;
- legalne przekazanie nie tworzy kopii itemu;
- reuse istniejących questów, reputacji, dialogu i `consumedWorldPickupIds`.

Zakres:

- `shovel`
- `axe`
- `pickaxe`
- `pitchfork`
- `sickle`

`wooden_torch` pozostaje obecnym darmowym/startowym itemem.

---

## Stan obecny

`src/items/createItemSpawners.ts` tworzy:

- `shovel` — 1× przy campfire/garden;
- `axe` — 1× przy drzewach/garden;
- `pickaxe` — 1× przy stockpile;
- `pitchfork` / `sickle` — 1–3 przy garden.

Wszystkie narzędzia używają `respawnTime = Infinity`.

Problem: village tools używają generowanych `spawner:${index}` IDs. `Infinity` zapobiega respawnowi tylko w lifetime aktualnego `ItemSpawners`; rebuild/save-load może zmaterializować item ponownie.

`docs/plans/LOOSE-ENDS.md` już rejestruje dokładnie ten problem.

Istniejący `consumedWorldPickupIds` zapewnia trwałe one-shot semantics dla authored world pickups i powinien zostać reuse po dodaniu stabilnych IDs.

Istnieje też issue `025` dotyczące cudzych `pitchfork` / `sickle`.

### Social state

Repo ma dwa niezależne mechanizmy:

- Player↔NPC relation — `QuestManager`;
- Player↔settlement reputation/renown — `ReputationManager`.

Ten plan używa **reputacji osady**, nie relacji NPC.

`ReputationManager` przechowuje pięć wymiarów:

- `trust`
- `competence`
- `benevolence`
- `courage`
- `integrity`

Istniejący quest availability/dialogue contract obsługuje już:

```ts
{ type: 'reputation', dimension: ReputationDimension, minimum: number }
```

Nie dodawać nowego aggregate reputation score.

---

## 1. Stable village-tool IDs

Nadać source pickupom deterministyczne ID, np.:

```text
settlement-tool:<settlementId>:shovel
settlement-tool:<settlementId>:axe
settlement-tool:<settlementId>:pickaxe
settlement-tool:<settlementId>:pitchfork:<slot>
settlement-tool:<settlementId>:sickle:<slot>
```

ID musi być niezależne od pozycji w `points[]`.

Po zabraniu source:

- ID trafia do istniejącego `consumedWorldPickupIds`;
- rebuild nie materializuje go ponownie;
- save/load nie materializuje go ponownie;
- New Game resetuje stan.

Nie persystować całego `ItemSpawnPoint`.

---

## 2. Village ownership

Pięć typów narzędzi jest własnością osady/mieszkańców.

World pickup dostaje minimalną semantykę ownership/source, np.:

```text
village-owned
player-authorized
```

Nie tworzyć pełnego `OwnershipManager`.

### Label

Przed przekazaniem:

```text
Kilof — własność osady
Widły — własność osady
```

Label czerwony.

Ownership należy do konkretnego source pickup, nie `ItemKind`.

Siekiera wyrzucona później przez gracza nie może stać się przez to ponownie „własnością osady”.

---

## 3. Łopata — darmowy prezent Farmera

Farmer od początku ma akcję dialogową:

> „Mógłbym dostać łopatę?”

Bez wymagań reputacji.

Przykładowa odpowiedź:

> „Jasne. Weź tę przy ogrodzie.”

Rozmowa autoryzuje istniejący stable shovel source.

Preferowany flow:

```text
village-owned shovel
→ Farmer grants permission
→ player-authorized shovel
→ gracz fizycznie ją podnosi
→ source consumed
```

Nie generować nowej łopaty.

Grant jest jednorazowy i persistowany niezależnie od późniejszej obecności łopaty w inventory.

---

## 4. Siekiera — „Zgubiłem siekierę”

Prosty authored quest.

Preferowany giver:

1. `woodcutter`;
2. Farmer jako fallback, jeśli home settlement nie ma odpowiedniego Woodcuttera.

## Oferta

> „Gdzieś niedaleko zgubiłem siekierę. Jeśli ją znajdziesz, przynieś mi ją.”

Quest wiąże dokładnie istniejący stable settlement axe source.

Nie tworzyć specjalnego questowego `axe`.

## Cel

```text
Znajdź zgubioną siekierę.
```

Po jej podniesieniu:

```text
Wróć do właściciela.
```

Zwykła inna `axe` nie spełnia celu.

## Finał

Gracz pokazuje/oddaje dokładnie tę siekierę.

NPC:

> „Już znalazłem inną. Zatrzymaj tę, przyda ci się.”

Fizycznym rewardem pozostaje ta sama siekiera.

Nie:

```text
consume axe A
grant axe B
```

Reuse istniejącego exact-instance / retain-physical-loot pattern z questów.

Quest nie wymaga reputacji.

---

## 5. Kilof — lokalna reputacja

Kilof pozostaje fizycznie przy stockpile.

Odpowiedni NPC zawsze pokazuje opcję:

> „Mógłbym dostać ten kilof?”

Preferowany NPC: `miner`, gdy settlement ma minera.

## Gate

Nie Player↔NPC relation.

Warunek:

```ts
reputation.trust >= 1
```

dla aktualnej osady.

Reuse istniejącego `ReputationManager` i reputation-condition semantics.

### Trust < 1

Opcja nadal widoczna.

NPC odpowiada np.:

> „Jeszcze nie zapracowałeś na zaufanie naszej osady.”

albo krócej:

> „Najpierw pokaż, że możemy ci zaufać.”

Nie ma:

- relation mutation;
- cooldownu;
- ukrywania opcji;
- grantu.

### Trust >= 1

NPC:

> „Pomogłeś już naszej osadzie. Możesz go wziąć.”

Istniejący kilof staje się `player-authorized`.

Jednorazowo.

---

## 6. Widły i sierp — Farmer + reputacja

Farmer pokazuje:

```text
„Mógłbym dostać widły?”
„Mógłbym dostać sierp?”
```

Obie opcje są widoczne od początku.

## Gate

```ts
reputation.trust >= 1
```

tej osady.

### Trust < 1

> „Takich narzędzi nie rozdajemy komuś, kto jeszcze nie zdobył naszego zaufania.”

### Trust >= 1

> „Dobrze. Weź je, skoro mają ci się przydać.”

Każde narzędzie ma osobny one-time grant.

Otrzymanie wideł nie grantuje sierpa.

---

## 7. Dlaczego `trust`

Nie tworzyć sztucznego:

```text
overallReputation
```

Obecna architektura świadomie trzyma reputację w pięciu wymiarach.

Dla przekazania własności narzędzia najbardziej odpowiada istniejące:

```text
trust
```

Próg `1` daje oczekiwany efekt:

```text
nowy gracz / 0
→ wykonuje małą pomoc dla osady
→ trust > 0
→ mieszkańcy pozwalają mu dostać podstawowe narzędzia
```

`competence`, `courage` czy `integrity` nie powinny być alternatywnymi bramkami w V1.

Nie używać `renown`: rozpoznawalność gracza nie oznacza automatycznie zaufania.

---

## 8. Wielokrotne widły/sierpy

Obecnie generowane jest 1–3 farm tools.

Do prezentów wybrać deterministycznie:

- jeden `pitchfork`;
- jeden `sickle`.

Pozostałe nadal są village-owned.

Nie dawać graczowi całego stocku po osiągnięciu `trust >= 1`.

---

## 9. Nieautoryzowane zabranie

Plan ma przygotować ownership semantics, aby można było rozróżnić:

```text
authorized pickup
unauthorized pickup
```

Gracz może nadal fizycznie zabrać czerwony item, jeśli gameplay ma pozwalać na kradzież.

Issue 025 powinno zostać uogólnione z:

```text
pitchfork / sickle
```

na:

```text
settlement-owned tool
```

Minimalna reakcja może później obejmować:

- protest pobliskiego NPC;
- reputację `trust` / `integrity`;
- ewentualnie osobną grievance.

Nie hardcodować konsekwencji po `ItemKind`.

---

## 10. Dialogue integration

Nie tworzyć `GiftManager`.

Reuse istniejącego NPC dialogue menu.

Tool requests powinny wejść do istniejącej kategorii działań/spraw.

UI dostaje już resolved action/result.

Vue nie interpretuje:

```text
trust >= 1
profession == farmer
pickup ownership
claim state
```

Logika pozostaje w gameplay/domain layer.

---

## 11. State ownership

### Pickup consumed state

Existing:

```text
consumedWorldPickupIds
```

### Settlement reputation

Existing:

```text
ReputationManager
```

Czytamy:

```text
getReputation(settlementId).trust
```

### Siekiera quest

Existing:

```text
QuestManager
```

### Player↔NPC relation

**Nie używana jako gate dla tych prezentów.**

Nie zmieniać relacji za samo poproszenie ani otrzymanie narzędzia.

### Gift claim state

Nie dedukować z inventory.

Preferować stable source/grant state. Jeśli samo `consumedWorldPickupIds` nie wystarczy do odróżnienia „ukradł” od „Farmer pozwolił wziąć”, dodać mały sparse authorized/claim set keyed stable pickup ID.

Nie tworzyć snapshotu wszystkich tool spawnerów.

---

## 12. Relevant files

### Items/world

- `src/items/createItemSpawners.ts`
- `src/items/ItemSpawner.ts`
- `src/app/worldBundle.ts`
- `src/app/gameLoop.ts`
- `src/app/saveState.ts`
- `src/persistence/saveData.ts`

### Reputation

- `src/reputation/ReputationManager.ts`
- istniejące social/reputation lookup seams

### Quest/dialogue

- `src/quests/quests.ts`
- `src/quests/QuestManager.ts`
- authored quest composition/materialization
- existing NPC dialogue action/menu pipeline

### Docs

- `docs/plans/LOOSE-ENDS.md`
- `docs/issues/2026-08-12--025--npc-react-to-stolen-village-tools.md`
- `docs/items/CATALOG.md`
- odpowiednie `docs/state/*.md`

---

## 13. Testy

### Persistence

Dla wszystkich pięciu tool kinds:

1. deterministic stable ID;
2. collect → rebuild → brak respawnu;
3. collect → save/load → brak respawnu;
4. New Game → source wraca.

### Shovel

- request dostępny przy reputation 0;
- Farmer grantuje;
- dokładnie jeden grant;
- utrata itemu nie resetuje claim.

### Axe

- quest korzysta z istniejącego source;
- inna siekiera nie spełnia celu;
- właściwa siekiera spełnia;
- finał zostawia tę samą fizyczną siekierę;
- save/load na każdym etapie bez duplikacji.

### Pickaxe

Przy:

```text
trust = 0
```

- opcja widoczna;
- odmowa odnosi się do braku reputacji/zaufania osady.

Przy:

```text
trust = 1
```

- dokładnie ta sama opcja daje grant;
- source staje się authorized;
- drugi grant niemożliwy.

Player↔NPC relation nie wpływa na wynik.

### Pitchfork / sickle

Analogicznie.

Dodatkowo:

- jeden claimable source per kind;
- pozostałe village tools nie stają się automatycznie prezentami.

---

## 14. Manual verification

User wykonuje browser verification.

1. New Game.
2. Sprawdzić czerwone labels.
3. Poprosić Farmera o łopatę przy `trust = 0` → sukces.
4. Poprosić o widły/sierp przy `trust = 0` → odmowa związana z reputacją osady.
5. Poprosić o kilof → analogiczna odmowa.
6. Zdobyć minimum `trust = 1`.
7. Bez poprawiania personal relation wrócić do tych NPC.
8. Widły/sierp/kilof można otrzymać.
9. Wykonać „Zgubiłem siekierę”.
10. Potwierdzić retained exact axe.
11. Save/load → brak respawnu.
12. New Game → źródła ponownie istnieją.

---

## 15. Non-goals

Nie implementować:

- generic gift economy;
- nowego Player↔NPC relation systemu;
- aggregate reputation score;
- pełnego crime/law systemu;
- generic ownership wszystkich world items;
- craftingu/durability zmian;
- merchant changes.

---

## 16. Guardrails

- `trust >= 1`, nie relation.
- Reputation jest settlement-scoped.
- Nie używać renown jako zamiennika reputacji.
- Nie tworzyć `overallReputation`.
- Stable IDs zamiast `spawner:${index}`.
- Inventory presence ≠ claim state.
- Nie tworzyć kopii physical reward.
- Nie tworzyć specjalnego questowego `axe`.
- UI nie interpretuje reputacji.
- Reuse `consumedWorldPickupIds`.
- Dodać JSDoc dla nowych ważnych publicznych kontraktów z odpowiednim `@domain`.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

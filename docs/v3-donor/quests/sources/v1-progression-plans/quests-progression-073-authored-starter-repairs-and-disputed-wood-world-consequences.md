# Plan: Authored starter repairs and disputed wood world consequences

**Created:** 2026-09-20  
**Status:** `verification needed` 🔍  
**Type:** feature  
**Priority:** high · **Effort:** L  
**Depends on:** ~~settlements-007~~, ~~quests-progression-005~~  
**Domain:** `quests-progression`  
**Subdomains:** `quests` `relationships` `rewards`  
**Tags:** `starter-quests` `repair` `world-state` `piotr` `anna`  
**Roadmap:** -  
**Model:** Opus, Sonnet

## Cel

Powiązać starterowe questy Anny i Piotra z realnymi, widocznymi problemami świata tak, aby dostarczane materiały miały fizyczne przeznaczenie, a późniejsza naprawa była niezależną konsekwencją symulacji.

Quest kończy się po spełnieniu prośby NPC — przy dostawie materiałów — a nie dopiero po wykonaniu naprawy.

```text
real damage
→ NPC asks player for materials
→ player delivers
→ quest completes
→ materials enter real world ownership
→ NPC later chooses/performs repair
→ visible world state changes
```

Kod jest source of truth. Implementacja ma rozszerzać istniejące mechanizmy condition/repair, household/settlement ownership i authored quest outcomes zamiast tworzyć questowy system napraw.

## Kontekst fabularny

Anna Leśniewska i Piotr Leśniewski należą do jednego household `family-reserved-0`.

Różnica między nimi ma wynikać z perspektywy, nie z posiadania osobnych gospodarstw:

- **Piotr** reprezentuje przede wszystkim prywatne potrzeby domu i swojej pracy;
- **Anna** w konflikcie o drewno reprezentuje pilną potrzebę szerszej społeczności/osady.

`sporne-drewno` nie jest permanentnym wyborem „pomóż Annie albo Piotrowi”. Gracz wybiera **kto ma dostać drewno pierwszy**, ale ostatecznie może pomóc obu stronom.

## 1. Authored repair targets

Home settlement dostaje deterministyczne starterowe problemy związane z istniejącymi questami.

### 1.1. Płot gospodarstwa Leśniewskich

Quest: `drewno-na-naprawe`.

Materiały:
- `5 x branch`.

Cel:
- niewielki płot przy gospodarstwie `family-reserved-0`;
- jeden wyraźnie uszkodzony fragment;
- stabilna tożsamość niezależna od runtime `Object3D`.

Przepływ:

```text
damaged household fence
→ Piotr asks for 5 branches
→ hand-in consumes branches
→ quest completes immediately
→ materials become available to the household repair
→ Piotr later repairs the fence through normal NPC work
```

Nie używać settlement entrance palisade ani player-built `PalisadeSegmentRecord`. To ma być household repair target, nie kolejna palisade lifecycle.

### 1.2. Fundament domu Leśniewskich

Quest: `kamienie-dla-piotra`.

Materiały:
- `6 x stone`.

Target:
- `residentialStructureId(0)`;
- konkretny rodzaj/component uszkodzenia: kamienna podmurówka/fundament domu.

Obecna polityka `residential` w `src/settlement/structureCondition.ts` używa `beam + branch`. Nie zmieniać globalnie wszystkich napraw domów na stone.

Rozszerzyć settlement structure repair o minimalny component/damage-kind contract wystarczający do rozróżnienia np.:

```text
foundation → stone
wall       → beam / branch
roof       → beam / branch
```

Na potrzeby tego planu implementować tylko zakres wymagany przez authored foundation damage. Nie budować pełnego symulatora komponentów budynku.

Uszkodzenie ma być widoczne jako brakujące/rozsypane kamienie przy podstawie domu i wynikać z authoritative structure state.

### 1.3. Płot wspólnego pastwiska osady

Questline:
- `sporne-drewno`;
- `drewno-dla-anny`.

Reuse:
- `VillagePlan.pasture.fenceSegments`;
- istniejące stabilne segmenty `pasture-fence-a` / `pasture-fence-b`.

Preferowany target:
- `pasture-fence-a` home settlement.

Materiały:
- `5 x branch`.

Anna ma mówić o pilnej potrzebie osady: uszkodzonym ogrodzeniu wspólnego pastwiska. To odpowiada jej roli w tej historii jako głosu szerszej społeczności.

Dzisiejsze fence segments są tylko plan/render data. Dodać dla wybranego segmentu trwały condition/repair state przez rozszerzenie istniejącego shared repair ownership, nie quest-owned flagę.

## 2. Piotr's logging wagon

`drewno-dla-piotra` zachowuje istniejącą fabułę naprawy wozu potrzebnego Piotrowi do pracy przy wyrębie.

Dodać fizyczny wóz należący do kontekstu Piotra:
- ustawiony przy jego gospodarstwie lub istniejącym work area;
- wykorzystujący istniejący wagon asset/pipeline tam, gdzie to praktyczne;
- ze stabilną domenową tożsamością niezależną od merchant wagon.

Nie używać merchant wagon ownership jako authority dla wozu Piotra.

Wóz zaczyna w stanie wymagającym naprawy. Materiały z `drewno-dla-piotra` mają realnie umożliwiać późniejszą naprawę.

## 3. Hand-in materiałów

Obecny finalny `gather_item` hand-in nie może jedynie usuwać materiałów z inventory i kończyć questa.

Dla tych authored repair deliveries finalizacja ma być atomowa:

```text
player inventory
→ remove requested items
→ deposit/allocate materials to canonical repair source
→ complete quest
→ apply normal reward/consequences
```

Ownership:
- prywatne cele Piotra → household Leśniewskich;
- wspólnotowy cel Anny → settlement-owned material source / settlement stock zgodny z istniejącym repair material adapterem.

Reuse istniejącego `Household.items` / household wood ownership i settlement economy tam, gdzie odpowiadają rzeczywistemu material source.

Nie tworzyć `QuestMaterialStorage`.

## 4. Naprawa po zakończeniu questa

Naprawa nie jest kolejnym quest stage.

Po dostarczeniu materiałów:

```text
damage + required materials available
→ repair pressure becomes actionable
→ appropriate NPC chooses repair
→ NPC walks to target
→ repeated repair work bouts
→ shared repair API
→ condition restored
```

Quest jest już zakończony.

Nie dodawać scripted effect „Piotr/Anna natychmiast idzie naprawić”. Wykonanie ma należeć do zwykłej symulacji NPC.

Preferować istniejące:
- `SettlementStructureStateRegistry`;
- `world/condition.ts`;
- `world/repair.ts`;
- `beginRegistryStructureRepair(...)`;
- `contributeRegistryStructureRepairWork(...)`;
- istniejący NPC repair pressure/action flow.

## 5. Starter problem reservation

Starterowe authored problemy muszą pozostać deterministycznie dostępne do czasu związanej z nimi dostawy.

Normalna symulacja nie może:
- naprawić ich wcześniej z przypadkowego zapasu;
- pozwolić innemu NPC całkowicie rozwiązać problem;
- przez off-screen catch-up usunąć problem przed rozpoczęciem/ukończeniem starter questa.

Wprowadzić wąski, ogólny repair reservation/authority contract tylko jeśli aktualny material/repair flow tego wymaga:

```text
authored starter reservation
→ autonomous repair from unrelated sources blocked

requested materials delivered
→ reservation released / transferred to normal repair authority
```

Nie umieszczać wiedzy o quest ID w `NpcAgent`.

## 6. Player repairs first

Gracz może fizycznie naprawić odpowiedni target przed standardową dostawą, jeżeli zwykły player repair interaction na to pozwala.

Nie traktować tego automatycznie jako failure.

Przykład dla `drewno-na-naprawe`:

```text
player repairs fence early
→ real fence state becomes repaired
→ dialogue/quest detects real state
→ Piotr reacts to unsolicited help
```

Quest logic nie może wymagać oddania drewna na już naprawiony problem bez zmiany dialogu.

Dla tej gałęzi przewidzieć alternate authored response/outcome lub transformację requestu, opartą na realnym world state.

Tuning relacji może być słabszy niż w standardowej ścieżce, np.:
- standard delivery → `Piotr +1`;
- wcześniejsza samowolna naprawa → `Piotr +0`.

Dokładne wartości ustalić podczas implementacji na podstawie aktualnego relationship scale.

## 7. Przebudowa `sporne-drewno`

Zmienić znaczenie wyboru z:

```text
support_anna | support_piotr
→ drugi follow-up permanentnie niedostępny
```

na:

```text
prioritize_anna | prioritize_piotr
→ wybór kolejności
→ oba problemy mogą zostać ostatecznie rozwiązane
```

### Anna

Problem:
- uszkodzone ogrodzenie wspólnego pastwiska osady.

Perspektywa:
- szerszy interes społeczności;
- ochrona zwierząt / działania gospodarstw;
- pilna wspólnotowa infrastruktura.

### Piotr

Problem:
- uszkodzony wóz potrzebny do jego pracy przy wyrębie.

Perspektywa:
- jego praca i household;
- utrzymanie zdolności do dowożenia drewna;
- konkretny prywatny problem o potencjalnych skutkach gospodarczych.

## 8. Oba follow-upy muszą być dostępne

Po wyborze pierwszeństwa:

```text
prioritize_anna
→ drewno-dla-anny dostępne pierwsze
→ po ukończeniu odblokuj drewno-dla-piotra

prioritize_piotr
→ drewno-dla-piotra dostępne pierwsze
→ po ukończeniu odblokuj drewno-dla-anny
```

Nie wymagać długiego cooldownu, jeśli nie wynika on z istniejącego quest availability system.

Celem wyboru jest tempo i konsekwencja społeczna, nie sztuczny lockout odnawialnego zasobu.

## 9. Social consequences

Sam wybór pierwszeństwa nie powinien automatycznie karać relacji z drugą osobą, skoro gracz nadal może jej pomóc chwilę później.

Kierunek:

### Anna first

- `Anna +1`;
- reputation: `benevolence +3`, `trust +1`;
- brak automatycznego `Piotr -1`.

### Piotr first

- `Piotr +1`;
- reputation: `competence +3`, `trust +1`;
- brak automatycznego `Anna -1`.

Po ukończeniu drugiego follow-upu:
- `+1` relation z drugą osobą.

Ostateczne wartości dopasować do istniejącej skali reputation/relationship, bez zwiększania całkowitego reward power bez potrzeby.

## 10. Presentation

Każdy authored problem ma być widoczny w świecie bez potrzeby czytania questa:

- household fence → brakujący/przechylony fragment;
- house foundation → brakujące/rozsypane kamienie;
- pasture fence → brakujący/przechylony fragment istniejącego ogrodzenia;
- wagon → uszkodzony wariant lub czytelny brak elementu.

Presentation ma być projekcją authoritative repair state.

Nie przechowywać osobnego `isBrokenVisual`.

Jeżeli asset nie wspiera bezpiecznego wariantu damaged, zastosować małą data-driven zmianę placement/visibility istniejących części zamiast osobnego questowego modelu.

## 11. Persistence and lifecycle

Stan repair targetów musi przeżyć:
- settlement stream-out/in;
- WorldBundle rebuild;
- save/load.

Preferować istniejące sparse persistence contracts.

QuestManager przechowuje wyłącznie:
- lifecycle/progress questa;
- resolved outcome;
- relacje/reputation zgodnie z obecnym contractem.

Nie może być ownerem:
- condition targetu;
- repair progress;
- materiałów przeznaczonych na naprawę;
- wizualnego damaged state.

## 12. Relevant current code

Implementator powinien zacząć od:
- `src/quests/quests.ts`;
- `src/quests/QuestManager.ts`;
- `src/settlement/structureCondition.ts`;
- `src/settlement/structureStateRegistry.ts`;
- `src/settlement/structureRepairCandidates.ts`;
- `src/settlement/villagePlan.ts`;
- `src/settlement/villagePasture.ts`;
- `src/settlement/props.ts`;
- `src/settlement/household.ts`;
- `src/settlement/families.ts`.

Istotne istniejące kontrakty:
- `residentialStructureId(familyIndex)`;
- `VillagePlan.pasture.fenceSegments`;
- `SettlementStructureStateRegistry`;
- shared actor-neutral repair work;
- household/settlement material-source adapters;
- authored `quest_outcome` prerequisites.

## 13. Guardrails

Nie tworzyć:
- `QuestRepairManager`;
- quest-owned `fenceHealth` / `foundationHealth`;
- osobnego questa „poczekaj aż NPC naprawi”;
- specjalnego timera naprawy;
- automatycznej pełnej naprawy w momencie hand-in;
- osobnego inventory na quest materials;
- permanentnego Anna-vs-Piotr lockoutu;
- zależności od runtime `Object3D` jako identity.

Nie scalać bez potrzeby:
- settlement pasture fence z player palisade construction;
- Piotr wagon z merchant wagon lifecycle.

## 14. Automated verification

Dodać testy potwierdzające co najmniej:

- home settlement deterministycznie rozpoznaje authored targets dla Leśniewskich i wspólnego pastwiska;
- Piotr i Anna nadal należą do `family-reserved-0`;
- `drewno-na-naprawe` kończy się przy hand-in, nie po repair completion;
- `kamienie-dla-piotra` kończy się przy hand-in;
- `drewno-dla-anny` i `drewno-dla-piotra` oba mogą zostać ukończone w jednej rozgrywce;
- wybór w `sporne-drewno` ustala kolejność, nie permanentny branch lockout;
- oddane materiały trafiają do właściwego canonical owner/material source;
- starter reservation blokuje przypadkowe autonomous repair przed dostawą;
- po dostawie normalny NPC repair flow może rozpocząć naprawę;
- foundation repair używa stone bez zmiany kosztu wszystkich ordinary residential repairs;
- save/load i WorldBundle rebuild zachowują authoritative damage/repair state;
- ordinary systemic residential repair pozostaje bez regresji.

## 15. Manual browser verification

Browser verification wykonuje User.

Sprawdzić ręcznie:
- czy wszystkie uszkodzenia są czytelne wizualnie;
- czy Piotr/odpowiedni NPC faktycznie dochodzi do targetu;
- czy naprawa następuje po dostawie, ale niezależnie od ukończonego questa;
- czy wcześniejsza naprawa przez gracza daje sensowny alternate dialogue;
- czy oba follow-upy `sporne-drewno` można ukończyć;
- czy po stream-out/in i reload świat nie wraca do stanu sprzed naprawy.

## 16. Implementation status

Zaimplementowane (sekcje 1–14 automatycznie weryfikowalne; sekcja 15 = browser, User):

- Cztery authored targets jako prawdziwe `SettlementStructureState` (policies, seeding idempotentny, reservation, persistence przez istniejący `structureStates`).
- Player `[R]` — `Interactable` kind `structureRepair` + `authoredRepairGazeTargets` na home settlement; ten sam `describeStructureRepair` / `workOnStructureRepair` co residential house; reservation **nie** blokuje gracza.
- Live visual sync — `AuthoredRepairVisualHandles` + `Settlement.syncAuthoredRepairPresentation` wywoływane z `contributeStructureRepairWork` po `completed` (foundation pile, untilt wagon, plant missing fences) bez stream-out/rebuild.
- Hand-in transakcyjny — `canDeliverGatherMaterials` (preflight) → `inventory.remove` → `deliverGatherMaterials` (deposit + release) z rollbackiem przy fail commit.
- NPC autonomous repair — Piotr/Anna bounded `authoredRepairTargets`, reservation-aware; materiały z household / economy.
- Early repair (§6) — `isAuthoredRepairTargetIntact` + outcome `already_repaired` (relation +0) zastępuje gather action gdy target już intact; standardowa dostawa daje relation +1.
- `sporne-drewno` dual follow-up (`any` prerequisites) bez permanent lockout.
- Determinizm — brak `Math.random()` w foundation stone pile.
- Testy: hand-in preflight/rollback/success, already_repaired, player begin while reserved, seed idempotency, sporne-drewno dual path, policies/candidates.

Browser verification (User, sekcja 15) — nadal wymagana: czytelność uszkodzeń, NPC podchodzi po dostawie, live sync w sesji, early-repair dialog w grze, stream-out/in.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

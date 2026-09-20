# Plan: Stamina-aware animal water crossing risk

**Created:** 2026-09-21
**Status:** `planned` 📋
**Type:** fix
**Model:** Opus · Sonnet
**Priority:** high · **Effort:** M
**Depends on:** ~~fauna-015~~, ~~fauna-029~~
**Domain:** `fauna`
**Subdomains:** `habitat` `migration`
**Tags:** `water` `navigation` `stamina` `survival`
**Roadmap:** -

## Cel

Zwierzęta zdolne do pływania nadal mogą świadomie przekraczać wodę, ale autonomiczne planowanie ma uwzględniać realny koszt przeprawy i ryzyko utonięcia.

Obecne `fauna-015` rozdziela fizyczną zdolność wejścia do wody od stanu `dry/wading/swimming`, a `fauna-029` dodaje `preferDry` i stały koszt A* dla swimming. To wystarcza do preferowania suchej trasy, ale nie odpowiada na pytanie:

> Czy to konkretne zwierzę, z obecną staminą i własnym metabolizmem, może bezpiecznie przepłynąć wymagany odcinek i dotrzeć do miejsca wyjścia z wody?

Naprawa ma rozszerzyć istniejący water-routing, nie tworzyć osobnego systemu pływania.

## Aktualny stan / recon

### Istniejące mechanizmy do reuse

- `src/terrain/waterSample.ts` / `ChunkManager.sampleLocalWater()` — canonical physical water sample.
- `src/fauna/waterTraversal.ts` — authoritative fauna policy:
  - `classifyWaterTraversal()`,
  - `wadeDepthFor()`,
  - `swimStaminaExertion()`,
  - `WaterRouteIntent`,
  - `waterTraversalCellCost()`.
- `src/fauna/AnimalLife.ts` — authoritative stamina state i per-species `AnimalMetabolismConfig.staminaDrainRate/staminaCapacity/staminaRegenRate`.
- `src/fauna/AnimalAgent.ts`:
  - `isWalkable()` = physical ability,
  - `waterModeAt()`,
  - `waterRouteCellCostAt()`,
  - `destLosHasDispreferredSwim()`,
  - `stepNavRescue()` / `attemptNavRepath()`,
  - `moveNav` dla wander/trip/needs/attraction,
  - `tickDrowning()` po wyczerpaniu staminy podczas swimming.
- `src/navigation/navigation.ts` — bounded local A* z opcjonalnym `NavigationQuery.cellCost`.

### Obecna luka

`preferDry` używa stałego mnożnika `SWIM_PREFER_DRY_CELL_COST = 10`. Koszt nie zależy od:

- aktualnej staminy zwierzęcia,
- `staminaDrainRate`,
- `swimStaminaExertion()`,
- długości ciągłego odcinka swimming,
- odległości do bezpiecznego wyjścia,
- wymaganej rezerwy bezpieczeństwa po przeprawie.

W efekcie A* może poprawnie uznać pływanie za droższe od lądu, ale nadal wybrać przeprawę, której zwierzę nie jest w stanie bezpiecznie ukończyć.

Nie wolno naprawiać tego przez `canSwim: false` dla konia/livestock ani przez przywrócenie wody jako hard wall.

## Inwariant

Rozdzielić trzy pytania:

```text
physical ability
→ czy gatunek może wejść / brodzić / pływać?

route preference
→ czy sucha/płytka trasa jest rozsądniejsza?

survival feasibility
→ czy aktualne zwierzę ma bezpieczny budżet staminy
  na wymagany odcinek pływania i dotarcie do wyjścia?
```

`isWalkable()` pozostaje wyłącznie physical ability.

## 1. Czysty model budżetu pływania

Rozszerzyć `src/fauna/waterTraversal.ts` o małe pure helpers opisujące koszt i bezpieczeństwo przeprawy. Nie tworzyć drugiego modułu water policy.

Model powinien korzystać z:

- bieżącej `stamina.current`,
- `AnimalMetabolismConfig.staminaDrainRate`,
- `swimStaminaExertion(def.water)`,
- realnego/przewidywanego czasu lub dystansu swimming,
- prędkości używanej przez daną autonomiczną intencję.

Wyprowadzić:

- przewidywany koszt staminy dla długości przeprawy,
- maksymalny bezpieczny dystans/czas swimming,
- ocenę `safe / risky / unsafe` albo równoważny mały kontrakt.

Nie dodawać osobnego `swimEnergy`.

### Safety reserve

Autonomiczne planowanie nie powinno zużywać całej staminy do zera. Zachować konfigurowalny, wspólny margines bezpieczeństwa, np. jako udział pojemności staminy.

Dokładna wartość ma być tuning constant w fauna water policy, nie per-species pole bez potrzeby.

`waterAdapted` nadal korzysta z istniejącego niższego `swimStaminaExertion`, więc naturalnie dostaje znacznie większy bezpieczny zasięg bez `kind === 'duck'`.

## 2. Ocena całego odcinka swimming, nie pojedynczej komórki

Sama funkcja `cellCost(x,z)` nie zna długości ciągłego akwenu ani miejsca wyjścia.

Dodać bounded route/segment evaluation, która dla planowanej trasy potrafi oszacować co najmniej:

- łączny dystans swimming,
- najdłuższy ciągły odcinek swimming,
- czy po wejściu istnieje osiągalny punkt wyjścia na dry/wading,
- przewidywaną staminę przy wyjściu.

Kluczowym kryterium bezpieczeństwa jest ciągły odcinek bez możliwości odpoczynku, nie tylko suma wszystkich mokrych komórek.

Reuse istniejącego `sampleLocalWater()` + `classifyWaterTraversal()`. Bez globalnego skanowania akwenu.

## 3. Integracja z bounded A*

Nie zamieniać shared `navigation.ts` w fauna-specific survival planner.

Najmniejszy preferowany kontrakt:

1. `findPath()` nadal znajduje lokalną trasę z obecnym `cellCost`.
2. Fauna ocenia wynikową trasę/segmenty pod kątem swim budget.
3. Jeśli trasa jest `unsafe`, zwierzę jej nie rozpoczyna jako zwykłej autonomicznej decyzji.
4. Jeżeli istnieje alternatywna bezpieczna trasa w lokalnym search bounds, planner powinien móc ją wybrać zamiast bez końca wracać do tej samej unsafe trasy.

Jeżeli do uniknięcia ponownego wyboru tej samej przeprawy potrzebne jest minimalne rozszerzenie `NavigationQuery`, powinno pozostać generyczne (np. route/segment constraint lub bounded cost input), a nie importować fauna/stamina/water do `navigation.ts`.

Nie zwiększać globalnie `DEFAULT_BOUNDS_PADDING` ani `DEFAULT_MAX_NODES` jako substytutu właściwej oceny ryzyka.

## 4. Intencje autonomiczne

### Zwykłe zachowanie

Dla:

- wander,
- water trip,
- needs / drink / forage,
- attraction,
- routine rest,
- return home / stray return,

zwierzę może wybrać swimming, jeśli przeprawa mieści się w bezpiecznym budżecie.

Przykłady:

- koń z pełną staminą może przepłynąć krótką rzekę,
- ten sam koń z niską staminą powinien obejść wodę albo zrezygnować/odpocząć,
- koń nie powinien ruszyć przez szerokie morze tylko dlatego, że cel leży po drugiej stronie.

### Threat / emergency

`flee/chase` i inne istniejące `allowSwim` pozostają bardziej ryzykowne.

Nie blokować awaryjnego wejścia do wody tylko dlatego, że zwykły safety reserve zostałby naruszony. Fizyczna możliwość i drowning lifecycle pozostają realne — desperacka ucieczka może skończyć się źle.

Nie zmieniać mounted movement: gracz nadal może świadomie poprowadzić konia do ryzykownej wody.

## 5. Picie

`animalForaging.isDrinkableNaturalShorePoint()` już wymaga dry/shallow-wading destination i odrzuca ocean jako naturalne źródło picia.

Zachować ten kontrakt.

Naprawa dotyczy **trasy do źródła**:

- koń nie może wybrać bezpiecznego punktu brzegu po drugiej stronie akwenu, jeśli dojście wymaga niebezpiecznej przeprawy,
- natural-water target powinien pozostać ważny tylko, gdy aktualna route feasibility nadal jest bezpieczna,
- po spadku staminy lub zmianie trasy target może zostać porzucony i wyszukany ponownie przez istniejący source-target lifecycle.

Nie dodawać horse-specific ani drink-specific geometrii wody.

## 6. Zachowanie zwierzęcia już znajdującego się w wodzie

To krytyczny przypadek.

Jeżeli zwierzę jest już `swimming`, nie może po prostu zatrzymać się dlatego, że nowa ocena mówi `unsafe`.

Powinno preferować przeżycie:

1. znaleźć najbliższe osiągalne dry/wading exit w bounded lokalnym zakresie,
2. płynąć do niego nawet jeśli pierwotny cel zostanie anulowany,
3. nie wykonywać zwykłego wander/drink retargetu dopóki nie wyjdzie z głębokiej wody,
4. nadal używać istniejącego stamina drain + drowning damage — brak teleportu i brak immunitetu.

Preferować rozszerzenie istniejącego movement/nav state zamiast osobnego globalnego rescue managera.

## 7. Replanning i stabilność

Ocena nie może powodować oscylacji brzeg ↔ woda ani pathfinding spamu.

- Nie przeliczaj pełnego A* co frame.
- Reuse `NavRescue`, watchdog/cooldown i istniejące committed targets.
- Replan przy istotnej zmianie: nowa trasa, spadek budżetu poniżej safety threshold, utrata wyjścia, target invalidation.
- Po odrzuceniu unsafe crossing zastosować bounded retry/cooldown, żeby agent nie wybierał tej samej przeprawy co tick.
- Bez nowego per-frame global water scan.

## 8. Debug / observability

Rozszerzyć istniejące fauna debug info tylko o tanie wartości potrzebne do diagnozy, jeśli obecny kontrakt na to pozwala:

- current stamina ratio,
- estimated swim distance/time,
- estimated stamina at exit,
- safety reserve,
- route water risk / rejection reason,
- chosen exit podczas emergency water recovery.

Nie budować nowego debug UI.

## 9. Testy

### Pure water policy

`src/fauna/waterTraversal.test.ts`:

- pełna vs niska stamina → różny safe swim distance,
- wyższy `staminaDrainRate` → krótszy zasięg,
- `waterAdapted` → większy zasięg przez istniejący exertion,
- safety reserve jest zachowany,
- zero/near-zero stamina nie zatwierdza zwykłej przeprawy.

### Route evaluation

Testy bez pełnego świata:

- dry → short swim → dry = safe przy wystarczającej staminie,
- ten sam odcinek = unsafe przy niskiej staminie,
- długa ciągła przeprawa przez ocean = unsafe,
- kilka krótkich odcinków rozdzielonych dry/wading nie jest traktowanych jak jeden ciągły swim,
- route kończąca się w swimming bez bezpiecznego exit = unsafe.

### Behaviour regression

Pokryć kontrakty helperów / extracted movement policy:

- horse + thirst + shore po tej samej stronie → normalne picie,
- horse + thirst + shore wymagający krótkiej bezpiecznej przeprawy → może przepłynąć,
- horse + thirst + shore za zbyt szeroką wodą → nie rozpoczyna przeprawy,
- animal already swimming + destination becomes unsafe → wybiera safe exit zamiast zatrzymania,
- flee może przekroczyć normalny safety reserve,
- mounted nie jest blokowany przez autonomous risk policy.

## 10. Performance guardrails

- żadnego globalnego water-body flood fill,
- żadnego globalnego river scan,
- żadnego pełnego A* per animal per frame,
- nie kopiować water state do każdego agenta,
- route evaluation tylko przy path request/replan/istotnej zmianie budżetu,
- korzystać z istniejących bounded navigation samples,
- preferować pure scalar calculations i istniejące scratch/state zamiast hot-path allocations.

## Relevant files

Główne:

- `src/fauna/waterTraversal.ts`
- `src/fauna/waterTraversal.test.ts`
- `src/fauna/AnimalAgent.ts`
- `src/fauna/AnimalLife.ts`
- `src/fauna/animalForaging.ts`
- `src/navigation/navigation.ts`
- `src/navigation/navigation.test.ts`

Do sprawdzenia podczas implementacji:

- `src/fauna/animalRoaming.ts`
- `src/fauna/animalDefs.ts`
- istniejące `AnimalAgent` / foraging tests dotyczące trips, needs i navigation.

## Non-goals

- zakaz pływania koniom lub livestock,
- `canSwim: false` jako obejście problemu,
- nowy swimming controller,
- nowy stamina resource,
- teleportowanie zwierzęcia z wody,
- NPC swimming,
- zmiana player swimming,
- zmiana mounted physical ability,
- pełny globalny route planner/navmesh,
- realistyczna hydrodynamika/prądy/fale.

## Weryfikacja techniczna

- `npx tsc --noEmit`
- lint zmienionego zakresu
- targeted fauna/navigation tests
- full test suite, jeśli targeted zmiany dotykają shared `navigation.ts`
- build

Browser/manual verification wykonuje użytkownik:

1. koń z pełną staminą przepływa krótką bezpieczną przeprawę,
2. koń z niską staminą nie rozpoczyna tej samej ryzykownej przeprawy,
3. koń idący pić nie biegnie przez środek morza,
4. zwierzę już pływające próbuje dotrzeć do bezpiecznego brzegu,
5. flee/chase może podjąć większe ryzyko,
6. kaczka nadal naturalnie korzysta z wody,
7. jazda konna zachowuje dotychczasową fizyczną możliwość wejścia do wody.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

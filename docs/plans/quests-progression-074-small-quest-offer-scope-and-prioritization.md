# Plan: Small quest offer scope and prioritization

**Created:** 2026-09-21
**Status:** `planned` 📋
**Priority:** medium · **Effort:** S
**Depends on:** quests-progression-069
**Domain:** `quests-progression`
**Type:** `polish`
**Roadmap:** `quests-and-reputation.md`
**Model:** Sonnet, Composer

## Goal

Sprawić, aby małe, lokalne i niskiego zobowiązania questy naturalnie pojawiały się przed większymi ordinary questami, jeśli kilka równorzędnych ofert tego samego givera jest jednocześnie eligible.

Problem potwierdzony w aktualnym kodzie: `rankQuestOfferCandidates()` rozróżnia dziś urgency, continuation, relation i authored/source priority, ale nie ma semantycznego sygnału wielkości zobowiązania. W efekcie prosty `woda-dla-marka` może pojawić się dopiero po wielu większych zadaniach, a przy równych sygnałach o kolejności może ostatecznie zdecydować stabilny quest id.

To nie jest system "early-game quests". Mały lokalny quest powinien mieć naturalną przewagę również później, jeśli gracz wcześniej go nie wykonał.

## Dependency

Twarda zależność:

```text
quests-progression-069
→ quests-progression-074
```

Plan 069 najpierw ustala canonical pacing/admission pipeline, w tym `QuestOfferPolicy.pacing`, giver cooldown i jego bypassy. Ten plan rozszerza dopiero wynikowy ranking.

Nie implementować 074 przed zakończeniem 069 i nie dublować jego giver cooldown/gating semantics.

## Existing mechanisms to extend

Reużyć:

- `QuestOfferPolicy` w `src/quests/quests.ts`;
- `QuestOfferRankSignal`;
- `rankQuestOfferCandidates()`;
- `QuestManager.offerRankSignal()`;
- `eligibleNotOfferedCandidates()`;
- `selectableOfferIds()` / `admitOffersForGiver()`;
- availability/source validity, decline suppression i active giver capacity;
- po 069: `QuestOfferPolicy.pacing` i giver ordinary-offer cooldown.

Nie tworzyć schedulerów, kolejek ofert ani osobnego early-game progression state.

## Offer scope

Po 069 rozszerzyć istniejący `QuestOfferPolicy` o jawny authored sygnał:

```ts
export type QuestOfferPolicy = {
  priority?: number
  urgency?: 'normal' | 'urgent'
  exposure?: 'normal' | 'story'
  pacing?: 'ordinary' | 'continuation'
  scope?: 'minor' | 'standard' | 'major'
}
```

Brak `scope` oznacza:

```text
standard
```

Semantyka:

- `minor` — mała lokalna przysługa / krótka czynność, mały commitment;
- `standard` — zwykły quest; bez pola zachowuje obecne zachowanie;
- `major` — większa wyprawa, polowanie, dłuższe lub bardziej zobowiązujące zadanie.

`scope` opisuje wielkość zobowiązania, nie importance/urgency.

## Do not infer scope mechanically

Nie wyliczać `scope` automatycznie z:

- liczby stages;
- objective type;
- reward value;
- dystansu;
- quest id;
- authored/generated source.

Jednostage'owy quest może być dużą wyprawą, a wielostage'owy może być małym lokalnym zadaniem.

Scope jest authored/source policy i ma być jawny.

## Ranking contract

Po 069 ranking ordinary candidates ma semantycznie respektować:

```text
hard eligibility / live world validity
→ pacing admission/cooldown
→ urgency
→ explicit continuation
→ scope: minor > standard > major
→ relation
→ authored/source priority
→ stable quest id
```

Dokładne umiejscowienie continuation ma pozostać zgodne z finalnym kontraktem 069. Implementacja 074 ma rozszerzyć ten kontrakt, nie odtwarzać go z wcześniejszego stanu repo.

Najważniejsze: `scope` jest **soft ranking signal**, nie bypass.

## Guardrails

`minor` NIE może omijać:

- `meetsAvailability()`;
- source/world validity;
- authored prerequisites;
- decline suppression;
- giver cooldown z 069;
- active giver capacity;
- normal/story exposure semantics.

`urgent` nadal ma pierwszeństwo przed ordinary minor.

Jawny continuation z 069 nadal ma pierwszeństwo przed świeżym minor questem.

Nie zmieniać `priority` w substytut scope. `priority` pozostaje sygnałem ważności konkretnej authored/source oferty w obrębie istniejącego mechanizmu.

## Initial authored-content audit

W ramach implementacji zrobić wąski audyt obecnych authored quests.

Jawnie oznaczyć `minor` tylko dla oczywistych małych lokalnych zadań. Kandydaci do potwierdzenia względem aktualnego kodu:

- `woda-dla-marka`;
- proste lokalne gather/delivery typu gałęzie, kamienie, zioła;
- `zapomniany-cmentarz`, jeśli po aktualnej materializacji nadal reprezentuje krótką lokalną czynność.

Nie zakładać, że powyższa lista jest kompletna ani automatycznie poprawna po 069. Agent ma zweryfikować aktualne definicje na `main`.

Dla niejednoznacznego questa:

```text
pozostawić standard
```

Nie robić szerokiego retagowania całego katalogu tylko po to, aby uzyskać oczekiwaną kolejność.

## Cemetery guardrail

`zapomniany-cmentarz` jest materializowany tylko przy istniejącym cemetery landmark.

Scope nie może zmienić tej semantyki. Jeśli cemetery nie istnieje / quest nie materializuje się / availability nie jest spełnione, `minor` nie może go ujawnić.

## Generated opportunities

Generated/source-driven quest może użyć `scope` w przyszłości, ale V1 nie ma masowo klasyfikować generated opportunities.

Nie zmieniać:

- `SETTLEMENT_QUEST_OPPORTUNITY_LIMIT`;
- materialization limits;
- source ownership;
- world-problem authority.

Jeżeli source potrzebuje wpływać na ważność, nadal może używać istniejącego `priority` / `urgency`. Scope nie zastępuje tych sygnałów.

## Main implementation points

Po zakończeniu 069 zweryfikować aktualne call-sites, minimum:

- `src/quests/quests.ts`
  - `QuestOfferPolicy`;
  - `QuestOfferRankSignal`;
  - `rankQuestOfferCandidates()`;
  - wybrane authored quest definitions;
- `src/quests/QuestManager.ts`
  - `offerRankSignal()`;
  - bez nowego state ownera;
- `src/quests/quests.test.ts`
  - pure ranking tests;
- `src/quests/QuestManager.test.ts`
  - admission/integration tests;
- materialization test dla cemetery, jeśli jego `scope` zostanie oznaczony jawnie.

Nie dodawać persistence state: `scope` jest właściwością `QuestDef`, nie runtime progress.

## Tests

Automated tests mają pokryć minimum:

1. przy równych pozostałych sygnałach `minor` rankuje przed `standard`;
2. `standard` rankuje przed `major`;
3. brak `scope` zachowuje się jak `standard`;
4. `urgent major` wygrywa z ordinary `minor`;
5. explicit continuation z finalnego 069 wygrywa z nowym ordinary `minor`;
6. `minor` nie omija giver cooldown z 069;
7. `minor` nie omija active giver capacity;
8. `minor` z niespełnionym prerequisite nie jest admitted;
9. `minor` z nieobecnym/invalid world source nie jest admitted;
10. relation nadal rozstrzyga między kandydatami tego samego scope;
11. `priority` nadal rozstrzyga między kandydatami tego samego scope i wcześniejszych sygnałów;
12. stable id pozostaje deterministycznym final tie-breakiem;
13. `woda-dla-marka` dostaje oczekiwany scope;
14. cemetery nie staje się dostępny bez istniejącego landmark/source condition.

## Non-goals

Nie robić w tym planie:

- early-game phase/state;
- tutorial quest subsystem;
- `QuestScheduler`;
- persistent offer queue;
- nowych cooldownów;
- zmian giver cooldown z 069;
- zmian renown/reputation gates z 069;
- globalnego quest difficulty system;
- automatycznego liczenia scope z objective/reward;
- quest-specific spawnów lub zmian świata tylko po to, aby quest był dostępny;
- zmian UI;
- zmian death provenance / animal kill semantics;
- rozwiązania problemu dostępności populacji deer — to osobny problem fauna/quest-world integration.

## Verification

Technical:

```text
npx tsc --noEmit
pnpm run lint:fix
pnpm run build
pnpm run test
```

Nie uruchamiać ręcznie `pnpm docs:sync`.

Manual browser verification wykonuje User.

Scenariusze:

1. nowa gra / save bez wykonanej `woda-dla-marka`: przy konkurujących ordinary ofertach Marka mała lokalna oferta pojawia się przed większą ordinary ofertą, o ile nie blokuje jej pacing 069;
2. urgent większy quest nadal ma pierwszeństwo;
3. direct continuation nadal pojawia się zgodnie z 069;
4. po ukończeniu ordinary questa minor nie omija giver cooldown;
5. cemetery quest nadal wymaga rzeczywistego cemetery;
6. po wyczerpaniu minor ofert standard/major pozostają normalnie osiągalne.

## Success criteria

Po implementacji:

```text
kilka eligible ordinary ofert tego samego givera
→ najpierw mała lokalna sprawa
→ potem standardowe / większe zobowiązania

urgent / direct continuation
→ zachowują wyższy priorytet

availability + live world + pacing
→ nadal są twardymi warunkami
```

Nie chodzi o wymuszenie tutorialowej kolejności. Chodzi o to, aby istniejący system ofert rozumiał różnicę między drobną lokalną przysługą a większym zobowiązaniem bez tworzenia równoległego mechanizmu.

> **Zrób git commit i push do main, rebase jeżeli trzeba**

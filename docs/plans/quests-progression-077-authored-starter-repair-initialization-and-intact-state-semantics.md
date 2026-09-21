# Plan: Authored starter repair initialization and intact-state semantics

**Created:** 2026-09-21  
**Status:** `planned` 📋  
**Type:** fix  
**Priority:** high · **Effort:** S  
**Depends on:** ~~quests-progression-073~~  
**Domain:** `quests-progression`  
**Subdomains:** `quests`  
**Tags:** `starter-quests` `repair` `world-state` `lifecycle`  
**Roadmap:** -

## Cel

Naprawić lifecycle authored starter repairs tak, aby brak authoritative `SettlementStructureState` nie był interpretowany jako dowód wykonanej naprawy.

Cztery targety z planu 073 — household fence, residential foundation, logging wagon i communal/pasture fence Anny — mają zaczynać jako rzeczywiście uszkodzone i zarezerwowane przed autonomous NPC repair. Gracz nadal może naprawić target sam; po dostawie materiałów reservation zostaje zwolnione i zwykła symulacja NPC może wykonać naprawę.

## Potwierdzona regresja

Ogólny `SettlementStructureStateRegistry` jest sparse. `resolve(settlementId, structureId, nowDays)` dla brakującego rekordu zwraca pristine state (`condition: 100`). To jest poprawny kontrakt dla zwykłych struktur.

Authored quest seam w `src/app/createApp.ts` obecnie używa resolved snapshotu:

```text
missing authored record
→ getStructureSnapshot()
→ sparse registry resolves pristine condition=100
→ !isStructureRepairProblem(...)
→ isAuthoredRepairTargetIntact = true
→ QuestManager exposes already_repaired dialogue/outcome
```

Dla authored starter targetu brak rekordu nie oznacza jednak „gracz/NPC naprawił”; oznacza co najmniej brak dowodu naprawy, a w lifecycle boot może oznaczać jeszcze niezainicjalizowany starter damage.

`SettlementsManager.ensureLoaded()` seeduje home authored damage przed `createSettlement()`, ale poprawność dialogu nie może zależeć od przypadkowej kolejności pomiędzy pierwszym quest lookupem a obecnością sparse rekordu.

## Zakres

### 1. Rozdzielić stored state od resolved pristine fallback

Dodać/wykorzystać wąski read-only seam pozwalający composition rootowi sprawdzić, czy authoritative record dla `settlementId + structureId` faktycznie istnieje.

Nie zmieniać globalnej semantyki `SettlementStructureStateRegistry.resolve()`: zwykłe nieuszkodzone struktury nadal mogą korzystać z `missing → pristine`.

`isAuthoredRepairTargetIntact` ma zwracać `true` wyłącznie, gdy authored target ma istniejący authoritative state i jego realny condition nie stanowi już repair problemu.

Missing/uninitialized authored state nie może wybierać `already_repaired`.

### 2. Zachować jeden shared authored repair lifecycle

Nie dodawać quest-specific flag dla Piotra/Anny.

Reuse:
- `resolveAuthoredRepairStructureIds(...)`;
- `AUTHORED_REPAIR_DELIVERIES`;
- `SettlementStructureStateRegistry`;
- `AUTHORED_STARTER_DAMAGE_CONDITION`;
- `autonomousRepairReserved`;
- istniejący actor-neutral begin/contribute repair flow.

Ten sam fix ma obejmować:
- `drewno-na-naprawe` — household fence;
- `kamienie-dla-piotra` — foundation;
- `drewno-dla-piotra` — logging wagon;
- `drewno-dla-anny` — communal/pasture fence.

### 3. Zweryfikować bootstrap ordering

Utrzymać zasadę:

```text
home def/plan
→ resolve stable authored target ids
→ seed missing authored damage + reservation
→ materialize settlement/presentation
→ quest/world observation
```

Sprawdzić call-sites świeżego world creation, save/load oraz same-seed `rebuildWorldBundle()`.

Nie reseedować targetu, który posiada persisted state — szczególnie po rzeczywistej naprawie.

### 4. Reservation i delivery

Nie zmieniać poprawnej semantyki planu 073:
- seeded target: `autonomousRepairReserved = true`;
- reservation blokuje autonomous NPC repair, nie player repair;
- player może naprawić target przed hand-in;
- delivery trafia do canonical household/economy source;
- dopiero udany delivery zwalnia reservation;
- późniejsza naprawa NPC używa normalnego repair flow.

Jeżeli investigation podczas implementacji wykaże inną drogę zwalniającą reservation przed delivery, poprawić ją w tym samym shared lifecycle zamiast dodawać quest workaround.

## Relevant code

Zweryfikowane punkty wejścia:
- `src/app/createApp.ts` — `isAuthoredRepairTargetIntact`, delivery/release hooks;
- `src/quests/QuestManager.ts` — `offerText()`, `alreadyRepairedGatherAction()`;
- `src/quests/authoredRepairDeliveries.ts`;
- `src/settlement/authoredRepairTargets.ts`;
- `src/settlement/SettlementsManager.ts` — `seedAuthoredRepairDamageIfNeeded()`, `ensureLoaded()`, structure snapshot/reservation API;
- `src/settlement/structureStateRegistry.ts` — sparse stored state vs `resolve()`;
- `src/settlement/structureCondition.ts` — pristine/default condition, repair policies;
- `src/app/worldBundle.ts` — carry/restore `structureStates` across rebuild;
- persistence SaveData wiring dla `snapshotStructureStates()` / restore.

Kod jest source of truth; plan 073 opisuje intencję, ale implementacja ma bazować na aktualnych kontraktach.

## Guardrails

- Nie zmieniać globalnie `missing → pristine` dla ordinary structures.
- Nie tworzyć quest-owned `isBroken`, `isRepaired` ani duplicate condition state.
- Nie uznawać samego braku rekordu za repair completion.
- Nie reseedować damage po prawdziwej naprawie, stream-in, rebuild ani save/load.
- Nie blokować player repair przez authored reservation.
- Nie wykonywać automatycznej pełnej naprawy przy hand-in.
- Nie przenosić quest ID do `NpcAgent`.
- Ważne nowe publiczne/architektoniczne seamy opisać JSDoc; użyć `@domain quests-progression` tam, gdzie pomaga preflight.

## Automated verification

Dodać regresje obejmujące co najmniej:

1. missing authored record nie daje `already_repaired`;
2. fresh home settlement seeduje wszystkie cztery targety do `AUTHORED_STARTER_DAMAGE_CONDITION` z reservation przed ich normalnym użyciem;
3. każdy z czterech seeded targets jest rozpoznawany jako damaged, nie intact;
4. rzeczywista player repair do stanu intact aktywuje istniejącą ścieżkę `already_repaired`;
5. reservation blokuje autonomous NPC repair, ale nie player repair;
6. successful delivery zapisuje materiały do canonical owner i zwalnia reservation;
7. po release zwykły NPC repair może rozpocząć naprawę;
8. save/load przed naprawą zachowuje damage + reservation;
9. save/load po naprawie zachowuje intact i nie reseeduje damage;
10. same-seed WorldBundle rebuild zachowuje oba powyższe przypadki;
11. fresh/new-world rebuild seeduje starter damage od nowa;
12. ordinary sparse structure lookup nadal interpretuje brak state jako pristine — brak regresji settlements-007.

Preferować test wspólnego contractu/table-driven dla czterech targetów zamiast czterech rozbieżnych implementacji.

## Manual verification

Browser verification wykonuje User.

Po implementacji ręcznie sprawdzić przede wszystkim, że na świeżej grze płot, fundament, wóz i communal fence są uszkodzone oraz żaden starter dialog nie twierdzi, że target został naprawiony bez rzeczywistej naprawy.

> **Zrób git commit i push do main, rebase jeżeli trzeba**
